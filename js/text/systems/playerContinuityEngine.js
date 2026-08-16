import { getCommitmentDefinition } from '../data/commitments.js';
import {
    checkCommitmentRequirements,
    getCommitmentRecord,
    isCommitmentFollowUpAvailable,
} from './commitmentEngine.js';
import { getLatestDaySummary } from './dayCycleEngine.js';
import { decorateCampaignReadabilityModel } from './playerCampaignReadabilityEngine.js';
import { decoratePlayerDangerRecoveryModel } from './playerDangerRecoveryEngine.js';
import { getOriginExperienceForState } from './playerExperienceEngine.js';
import { hasDiscoveredPoi } from './poiEngine.js';

export const PLAYER_CONTINUITY_VERSION = 4;

export function decoratePlayerOpportunityModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const dangerBase = decoratePlayerDangerRecoveryModel(state, baseModel);
    const continuity = createCommitmentOpportunity(state);
    const dayReview = createDayReviewOpportunity(state);

    let decorated = dangerBase;
    if (continuity || dayReview) {
        const entries = [...dangerBase.entries];
        if (continuity) {
            const preparationIndex = entries.findIndex((entry) => entry.category === 'preparation');
            entries.splice(preparationIndex >= 0 ? preparationIndex + 1 : 0, 0, continuity);
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
            version: Math.max(Number(dangerBase.version) || 0, 7),
            recommendedOpportunityId: recommended?.id ?? null,
            entries: Object.freeze(entries),
        });
    }

    return decorateCampaignReadabilityModel(state, decorated);
}

export function createCommitmentOpportunity(state) {
    const origin = getOriginExperienceForState(state);
    const commitmentId = origin.regionalLoop?.commitmentId;
    if (!commitmentId) return null;
    const definition = getCommitmentDefinition(commitmentId);
    if (!definition || !hasDiscoveredPoi(state, definition.offerPoiId)) return null;

    const record = getCommitmentRecord(state, commitmentId);
    if (!record) {
        const inPlace = state.currentPlaceId === definition.offerPlaceId;
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: definition.name,
            summary: definition.description,
            reason: 'A real commitment gives the first regional livelihood loop a social and economic reason without turning the Journal into authority.',
            progress: 'Finish the requested work and Varric will remember whether you followed through.',
            status: inPlace ? 'ready' : 'available',
            requirements: [requirement('Speak with Marshal Varric Stone in Brasshaven Market Ring', inPlace)],
            action: inPlace ? action('accept-copper-return', `Accept · ${definition.name}`, 'commitment.accept', { commitmentId }) : null,
        });
    }

    if (record.status === 'active') {
        const check = checkCommitmentRequirements(state, commitmentId);
        const deliverable = hasQualifyingItem(state, definition.requiredItems[0]);
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: definition.name,
            summary: deliverable
                ? 'You have the Redstone ingot Varric asked you to make. Bring it back to him at the Market Ring.'
                : definition.objective,
            reason: 'The commitment remains persistent while the livelihood loop supplies its real material requirement.',
            progress: 'Completing the delivery earns Varric’s payment and changes how he regards your work.',
            status: check.ok ? 'ready' : 'active',
            requirements: [
                requirement('Commitment accepted', true),
                requirement('Carry one Redstone Copper Ingot you smelted from Redstone ore', deliverable),
                requirement('Return to Brasshaven Market Ring', state.currentPlaceId === definition.offerPlaceId),
            ],
            blockers: check.ok ? [] : check.blockers,
            action: check.ok ? action('resolve-copper-return', 'Deliver · Redstone Copper Ingot', 'commitment.resolve', { commitmentId }) : null,
        });
    }

    const followUpSeen = record.followUpSeenAtWorldSeconds !== null;
    if (followUpSeen) {
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: `${definition.name} · remembered`,
            summary: 'Varric remembers that you completed the copper run. Your work with him now has history rather than ending at the payment.',
            reason: 'Persistent social continuity turns completed work into future context instead of resetting the NPC after reward collection.',
            progress: 'His later advice points toward Starfen reed fiber and the Copper Trail Clasp.',
            status: 'complete',
            requirements: [requirement('Finish the copper delivery and speak with Varric again on a later day', true)],
            action: null,
        });
    }

    const followUpReady = isCommitmentFollowUpAvailable(state, commitmentId);
    const inPlace = state.currentPlaceId === definition.offerPlaceId;
    return opportunity({
        id: `commitment-${definition.id}`,
        category: 'commitment',
        title: followUpReady ? 'Varric remembers the copper' : `${definition.name} · credited`,
        summary: followUpReady
            ? 'A new day has begun since the delivery. Varric may have something different to say now that you have proven you can finish the route.'
            : 'The ingot has been delivered and credited. Give the work some time before expecting another conversation to grow from it.',
        reason: 'Time and relationships persist after resolution; continuity is not an immediate reward-dialogue reset.',
        progress: 'The next conversation can turn proven Brasshaven work into a reason to look farther east.',
        status: followUpReady && inPlace ? 'ready' : 'available',
        requirements: [
            requirement('Copper delivery complete', true),
            requirement('A new day has begun', followUpReady),
            requirement('Return to Brasshaven Market Ring', inPlace),
        ],
        action: followUpReady && inPlace
            ? action('follow-up-copper-return', 'Speak again · Marshal Varric Stone', 'commitment.followUp', { commitmentId })
            : null,
    });
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

function hasQualifyingItem(state, requirement) {
    if (!requirement) return false;
    return (state.player?.inventoryState?.containers?.inventory?.items ?? []).some((item) => {
        const matches = item.id === requirement.itemId || item.templateId === requirement.itemId;
        if (!matches) return false;
        if (!requirement.provenanceSourceId) return true;
        return Array.isArray(item.provenance) && item.provenance.some((entry) => entry.sourceId === requirement.provenanceSourceId);
    });
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
