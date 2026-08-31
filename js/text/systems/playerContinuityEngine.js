import { getCanonicalGatheringSource } from '../data/ecologyRegistry.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';
import { getConnectionsFrom, getPlace } from '../data/places.js';
import { getProductionItem } from '../data/productionItems.js';
import { getCanonicalResourceItem } from '../data/resourceItemRegistry.js';
import { listCommitmentDefinitions } from '../data/commitments.js';
import {
    checkCommitmentRequirements,
    getCommitmentRecord,
    isCommitmentFollowUpAvailable,
} from './commitmentEngine.js';
import { getLatestDaySummary } from './dayCycleEngine.js';
import { checkGatheringWorkRequirements } from './gatheringWorkEngine.js';
import { isSettlementLocality, listLocalityDestinations } from './localityEngine.js';
import { decorateCampaignReadabilityModel } from './playerCampaignReadabilityEngine.js';
import { decoratePlayerDangerRecoveryModel } from './playerDangerRecoveryEngine.js';
import { hasInteractedWithPoi } from './localKnowledgeEngine.js';
import { findTravelRoute } from './travelEngine.js';

export const PLAYER_CONTINUITY_VERSION = 5;

export function decoratePlayerOpportunityModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const dangerBase = decoratePlayerDangerRecoveryModel(state, baseModel);
    const continuityEntries = createCommitmentOpportunities(state);
    const dayReview = createDayReviewOpportunity(state);

    let decorated = dangerBase;
    if (continuityEntries.length || dayReview) {
        const entries = [...dangerBase.entries];
        if (continuityEntries.length) {
            const preparationIndex = entries.findIndex((entry) => entry.category === 'preparation');
            entries.splice(preparationIndex >= 0 ? preparationIndex + 1 : 0, 0, ...continuityEntries);
        }
        if (dayReview) entries.push(dayReview);

        // Hands-on work and recovery with an explicit Finish action should win over unrelated ready leads.
        const activeAction = entries.find((entry) => entry.status === 'active' && entry.action);
        const recommended = activeAction
            ?? entries.find((entry) => entry.status === 'ready' && entry.action)
            ?? entries.find((entry) => entry.status === 'ready')
            ?? entries.find((entry) => entry.status === 'active')
            ?? entries.find((entry) => entry.status === 'available')
            ?? null;

        decorated = Object.freeze({
            ...dangerBase,
            version: Math.max(Number(dangerBase.version) || 0, 8),
            recommendedOpportunityId: recommended?.id ?? null,
            entries: Object.freeze(entries),
        });
    }

    return decorateCampaignReadabilityModel(state, decorated);
}

export function createCommitmentOpportunities(state) {
    return Object.freeze(listCommitmentDefinitions()
        .filter((definition) => getCommitmentRecord(state, definition.id) || hasInteractedWithPoi(state, definition.offerPoiId))
        .map((definition) => createCommitmentOpportunity(state, definition))
        .filter(Boolean));
}

export function createCommitmentOpportunity(state, definitionOrId = null) {
    const definition = typeof definitionOrId === 'object'
        ? definitionOrId
        : listCommitmentDefinitions().find((entry) => entry.id === definitionOrId)
            ?? listCommitmentDefinitions().find((entry) => getCommitmentRecord(state, entry.id) || hasInteractedWithPoi(state, entry.offerPoiId))
            ?? null;
    if (!definition) return null;
    const record = getCommitmentRecord(state, definition.id);
    const giver = getPointOfInterest(definition.offerPoiId);
    const offerPlace = getPlace(definition.offerPlaceId);
    const giverName = giver?.name ?? definition.giverNpcId;
    const offerPlaceName = offerPlace?.name ?? definition.offerPlaceId;

    if (!record) {
        const inPlace = state.currentPlaceId === definition.offerPlaceId;
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: definition.name,
            summary: definition.description,
            reason: 'A known person has a concrete need that can connect ordinary world activity to persistent social consequence.',
            progress: `Finish the requested work and ${giverName} will remember whether you followed through.`,
            status: inPlace ? 'ready' : 'available',
            requirements: [requirement(`Speak with ${giverName} in ${offerPlaceName}`, inPlace)],
            action: inPlace ? action(`accept-${definition.id}`, `Accept · ${definition.name}`, 'commitment.accept', { commitmentId: definition.id }) : null,
            regionLabel: offerPlace?.region ?? null,
        });
    }

    if (record.status === 'active') {
        return createActiveCommitmentOpportunity(state, definition, { giverName, offerPlaceName, offerPlace });
    }

    const followUpSeen = record.followUpSeenAtWorldSeconds !== null;
    if (followUpSeen) {
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: `${definition.name} · remembered`,
            summary: `${giverName} remembers that you finished the work. The relationship now carries history beyond the original payment.`,
            reason: 'Persistent social continuity turns completed work into future context instead of resetting the NPC after reward collection.',
            progress: definition.followUpText,
            status: 'complete',
            requirements: [requirement(`Finish the work and speak with ${giverName} again on a later day`, true)],
            action: null,
            regionLabel: offerPlace?.region ?? null,
        });
    }

    const followUpReady = isCommitmentFollowUpAvailable(state, definition.id);
    const inPlace = state.currentPlaceId === definition.offerPlaceId;
    return opportunity({
        id: `commitment-${definition.id}`,
        category: 'commitment',
        title: followUpReady ? `${giverName} remembers the work` : `${definition.name} · credited`,
        summary: followUpReady
            ? `A new day has begun since the work was credited. ${giverName} may have something different to say now.`
            : 'The work has been delivered and credited. Give it some time before expecting another conversation to grow from it.',
        reason: 'Time and relationships persist after resolution; continuity is not an immediate reward-dialogue reset.',
        progress: followUpReady ? definition.followUpText : `Return to ${giverName} on a later day.`,
        status: followUpReady && inPlace ? 'ready' : 'available',
        requirements: [
            requirement(`${definition.name} complete`, true),
            requirement('A new day has begun', followUpReady),
            requirement(`Return to ${offerPlaceName}`, inPlace),
        ],
        action: followUpReady && inPlace
            ? action(`follow-up-${definition.id}`, `Speak again · ${giverName}`, 'commitment.followUp', { commitmentId: definition.id })
            : null,
        regionLabel: offerPlace?.region ?? null,
    });
}

function createActiveCommitmentOpportunity(state, definition, { giverName, offerPlaceName, offerPlace }) {
    const check = checkCommitmentRequirements(state, definition.id);
    const itemRequirements = definition.requiredItems.map((itemRequirement) => {
        const item = getCommitmentItem(itemRequirement.itemId);
        const carried = qualifyingQuantity(state, itemRequirement);
        return requirement(`Carry ${itemRequirement.quantity} ${item?.name ?? itemRequirement.itemId}`, carried >= itemRequirement.quantity);
    });
    const allItemsReady = itemRequirements.every((entry) => entry.met);
    const inOfferPlace = state.currentPlaceId === definition.offerPlaceId;
    const fieldSource = definition.fieldSourceId ? getCanonicalGatheringSource(definition.fieldSourceId) : null;
    const sourceRequirement = fieldSource
        ? definition.requiredItems.find((entry) => entry.itemId === fieldSource.outputItemId)
        : null;
    const sourceQuantity = sourceRequirement ? qualifyingQuantity(state, sourceRequirement) : 0;
    const needed = sourceRequirement ? Math.max(0, sourceRequirement.quantity - sourceQuantity) : 0;
    const atFieldSource = Boolean(fieldSource && state.currentPlaceId === fieldSource.placeId);
    const gatherCheck = atFieldSource && needed > 0
        ? checkGatheringWorkRequirements(state, fieldSource.id, { quantity: needed })
        : null;

    let status = check.ok ? 'ready' : 'active';
    let nextAction = check.ok
        ? action(`resolve-${definition.id}`, `Deliver · ${definition.name}`, 'commitment.resolve', { commitmentId: definition.id })
        : null;
    let blockers = check.ok ? [] : check.blockers;
    let summary = allItemsReady
        ? `You have what ${giverName} asked for. Bring it back to ${offerPlaceName}.`
        : definition.objective;

    if (!check.ok && gatherCheck?.ok) {
        status = 'ready';
        nextAction = action(`gather-${definition.id}`, `${capitalize(fieldSource.action)} · ${fieldSource.name}`, 'gathering.start', {
            sourceId: fieldSource.id,
            quantity: needed,
        });
        blockers = [];
        summary = `${fieldSource.name} is here in ${getPlace(fieldSource.placeId)?.name ?? 'the region'}. Gather ${needed} more ${getCommitmentItem(sourceRequirement.itemId)?.name ?? 'required material'} for ${giverName}.`;
    } else if (!check.ok && gatherCheck && !gatherCheck.ok) {
        status = 'blocked';
        blockers = gatherCheck.blockers;
        summary = `${fieldSource.name} is here, but your current preparation is not enough to gather what ${giverName} needs.`;
    } else if (!check.ok && allItemsReady && !inOfferPlace) {
        const returnStep = createReturnStep(state, definition);
        if (returnStep.action) {
            status = 'ready';
            nextAction = returnStep.action;
            blockers = [];
            summary = `You have what ${giverName} asked for. ${returnStep.summary}`;
        }
    }

    return opportunity({
        id: `commitment-${definition.id}`,
        category: 'commitment',
        title: definition.name,
        summary,
        reason: 'The commitment stays persistent while gathering, production, travel, and inventory remain owned by their existing gameplay systems.',
        progress: allItemsReady
            ? `Return to ${giverName} in ${offerPlaceName}.`
            : fieldSource
                ? `Gather the requested material in ${getPlace(fieldSource.placeId)?.name ?? 'the field'}, then return to ${giverName}.`
                : definition.objective,
        status,
        requirements: [
            requirement('Commitment accepted', true),
            ...itemRequirements,
            requirement(`Return to ${offerPlaceName}`, inOfferPlace),
        ],
        blockers,
        action: nextAction,
        regionLabel: atFieldSource ? getPlace(fieldSource.placeId)?.region ?? offerPlace?.region ?? null : offerPlace?.region ?? null,
    });
}

function createReturnStep(state, definition) {
    const offerPlace = getPlace(definition.offerPlaceId);
    const directLocal = listLocalityDestinations(state).find((entry) => entry.id === definition.offerPlaceId);
    if (directLocal) {
        return {
            summary: `Go to ${directLocal.name} and deliver it.`,
            action: action(`return-local-${definition.id}`, `Go · ${directLocal.name}`, 'locality.move', { destinationId: directLocal.id }),
        };
    }
    const current = getPlace(state.currentPlaceId);
    const directlyAdjacentLocality = isSettlementLocality(current)
        && isSettlementLocality(offerPlace)
        && getConnectionsFrom(state.currentPlaceId).some((connection) => connection.to === definition.offerPlaceId && connection.mode === 'walk' && !connection.flags?.externalPlaceholder);
    if (directlyAdjacentLocality) {
        return {
            summary: `Explore the locality until you can reliably find the way to ${offerPlace?.name ?? definition.offerPlaceId}.`,
            action: action(`return-explore-${definition.id}`, `Explore for the way to ${offerPlace?.name ?? definition.offerPlaceId}`, 'locality.explore', { targetPlaceId: definition.offerPlaceId }),
        };
    }

        const directTravel = findTravelRoute(state, definition.offerPlaceId);
    if (directTravel.ok) {
        return {
            summary: `Travel back to ${offerPlace?.name ?? definition.offerPlaceId}.`,
            action: action(`return-travel-${definition.id}`, `Travel · ${offerPlace?.name ?? definition.offerPlaceId}`, 'travel.start', { destinationId: definition.offerPlaceId }),
        };
    }
    if (definition.returnViaPlaceId) {
        const via = getPlace(definition.returnViaPlaceId);
        const localVia = listLocalityDestinations(state).find((entry) => entry.id === definition.returnViaPlaceId);
        if (localVia) {
            return {
                summary: `Go through ${localVia.name} on the way back.`,
                action: action(`return-via-local-${definition.id}`, `Go · ${localVia.name}`, 'locality.move', { destinationId: localVia.id }),
            };
        }
        const travelVia = findTravelRoute(state, definition.returnViaPlaceId);
        if (travelVia.ok) {
            return {
                summary: `Travel back through ${via?.name ?? definition.returnViaPlaceId}.`,
                action: action(`return-via-travel-${definition.id}`, `Travel · ${via?.name ?? definition.returnViaPlaceId}`, 'travel.start', { destinationId: definition.returnViaPlaceId }),
            };
        }
    }
    return { summary: `Find a known route back to ${offerPlace?.name ?? definition.offerPlaceId}.`, action: null };
}

export function createDayReviewOpportunity(state) {
    const summary = getLatestDaySummary(state);
    if (!summary) return null;
    const categories = summary.categoryCounts ?? {};
    const eventTypes = summary.eventTypeCounts ?? {};
    const commitments = Number(categories.commitments) || 0;
    const relationships = Number(categories.relationships) || 0;
    const work = Number(categories.work) || 0;
    const progression = Number(categories.progression) || 0;
    const resolved = Number(eventTypes['commitment.resolved']) || 0;
    const relationshipChanges = Number(eventTypes['relationship.changed']) || 0;

    const memories = [
        resolved ? `you finished ${resolved === 1 ? 'a commitment' : `${resolved} commitments`} someone was counting on` : null,
        relationshipChanges ? `${relationshipChanges === 1 ? 'one relationship changed' : `${relationshipChanges} relationships changed`} because of what you did` : null,
        work ? `you spent time on ${work === 1 ? 'useful work' : 'several pieces of useful work'}` : null,
        progression ? 'your practice left you more experienced than the day before' : null,
    ].filter(Boolean);

    const memoryText = memories.length
        ? `Looking back on Day ${summary.day}, ${joinNaturally(memories)}.`
        : `Day ${summary.day} passed without a major change that needs your attention now.`;
    const nextThoughts = [
        commitments ? 'unfinished or newly completed promises' : null,
        relationships ? 'people who now know you differently' : null,
        work ? 'work worth continuing or turning into something useful' : null,
        progression ? 'new practice you can build on' : null,
    ].filter(Boolean);

    return opportunity({
        id: `day-review-${summary.day}`,
        category: 'day-review',
        title: `Yesterday · Day ${summary.day}`,
        summary: memoryText,
        reason: 'Day review summarizes structured persistent changes; it does not reconstruct progress from display prose.',
        progress: nextThoughts.length
            ? `Worth remembering: ${joinNaturally(nextThoughts)}.`
            : 'Nothing from yesterday demands a particular next step.',
        status: 'complete',
        requirements: [],
        action: null,
    });
}

function qualifyingQuantity(state, requirement) {
    if (!requirement) return 0;
    return (state.player?.inventoryState?.containers?.inventory?.items ?? []).reduce((total, item) => {
        const matches = item.id === requirement.itemId || item.templateId === requirement.itemId;
        if (!matches) return total;
        const provenanceMatches = !requirement.provenanceSourceId
            || (Array.isArray(item.provenance) && item.provenance.some((entry) => entry.sourceId === requirement.provenanceSourceId));
        return provenanceMatches ? total + Math.max(1, Number(item.quantity) || 1) : total;
    }, 0);
}

function getCommitmentItem(itemId) {
    return getCanonicalResourceItem(itemId) ?? getProductionItem(itemId);
}

function opportunity(definition) {
    return Object.freeze({
        ...definition,
        blockers: Object.freeze([...(definition.blockers ?? [])]),
        requirements: Object.freeze((definition.requirements ?? []).map((entry) => Object.freeze({ ...entry }))),
        action: definition.action ? Object.freeze({ ...definition.action, payload: Object.freeze({ ...(definition.action.payload ?? {}) }) }) : null,
    });
}

function action(id, label, intent, payload = {}) {
    return { id, label, intent, payload };
}

function requirement(label, met) {
    return { label, met: Boolean(met) };
}

function joinNaturally(items) {
    if (items.length <= 1) return items[0] ?? '';
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function capitalize(value) {
    const text = String(value ?? '').trim();
    return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : 'Gather';
}
