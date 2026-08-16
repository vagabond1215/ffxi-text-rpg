import { getCanonicalGatheringSource } from '../data/ecologyRegistry.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';
import { getPlace } from '../data/places.js';
import { getProductionDefinition } from '../data/productionCatalog.js';
import { getServiceJourney, getTransportService } from '../data/routeCatalog.js';
import { getCommitmentRecord } from './commitmentEngine.js';
import { checkGatheringWorkRequirements } from './gatheringWorkEngine.js';
import { listLocalityDestinations } from './localityEngine.js';
import { getOriginExperienceForState } from './playerExperienceEngine.js';
import { checkProductionRequirements } from './productionEngine.js';
import { findTravelRoute } from './travelEngine.js';
import { listWorkRecords, WORK_STATUSES } from './workTaskEngine.js';

export const PLAYER_CAMPAIGN_READABILITY_VERSION = 2;

const COPPER_TRAIL_PROOF = Object.freeze({
    commitmentId: 'commitment-brasshaven-copper-return',
    ambitionName: 'Copper Trail Clasp',
    craftId: 'craft-copper-trail-clasp',
    outputItemId: 'item-copper-trail-clasp',
    ingotItemId: 'item-redstone-copper-ingot',
    fiberItemId: 'item-starfen-reed-fiber',
    fiberSourceId: 'source-west-starfen-reedbed',
    starfenPlaceId: 'west-starfen',
    mistmereHubId: 'mistmere-reedport',
    brasshavenHubId: 'brasshaven-iron-quay',
    brasshavenForgePlaceId: 'brasshaven-market-ring',
    brasshavenForgePoiId: 'poi-bastok-markets-reinberta',
    longRoadServiceId: 'service-forge-mere-caravan',
});

const STATUS_PRIORITY = Object.freeze({
    active: 0,
    ready: 1,
    available: 2,
    blocked: 3,
    complete: 4,
});

export function decorateCampaignReadabilityModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const origin = getOriginExperienceForState(state);
    const currentRegion = getPlace(state.currentPlaceId)?.region ?? null;
    const originRegion = getPlace(origin.startingPlaceId)?.region ?? origin.regionalHorizon;
    const regionalTarget = getPlace(origin.firstRegionalDestinationId);

    const entries = (baseModel.entries ?? []).map((entry) => decorateExistingEntry(entry, {
        currentRegion,
        originRegion,
        regionalTarget,
    }));
    const crossRegion = createCopperTrailOpportunity(state);
    if (crossRegion) entries.push(crossRegion);

    const groups = buildGroups(entries, currentRegion);
    const orderedEntries = groups.flatMap((group) => group.entries);
    const recommendedOpportunityId = chooseRecommendedOpportunity(baseModel, orderedEntries);

    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 6),
        campaignReadabilityVersion: PLAYER_CAMPAIGN_READABILITY_VERSION,
        prompt: createReadabilityPrompt(groups),
        recommendedOpportunityId,
        entries: Object.freeze(orderedEntries),
        groups: Object.freeze(groups),
    });
}

export function createCopperTrailOpportunity(state) {
    const proof = COPPER_TRAIL_PROOF;
    const commitment = getCommitmentRecord(state, proof.commitmentId);
    const starfenVisited = Boolean(state.atlas?.[proof.starfenPlaceId]);
    const fiberQuantity = inventoryQuantity(state, proof.fiberItemId);
    const ingotQuantity = inventoryQuantity(state, proof.ingotItemId);
    const claspQuantity = inventoryQuantity(state, proof.outputItemId);
    const followUpSeen = commitment?.followUpSeenAtWorldSeconds !== null && commitment?.followUpSeenAtWorldSeconds !== undefined;

    // Starfen is not promoted merely because authored data contains it. This lead
    // appears only after social, visited-place, or carried-item knowledge makes it knowable.
    if (!followUpSeen && !starfenVisited && fiberQuantity === 0 && claspQuantity === 0) return null;

    const source = getCanonicalGatheringSource(proof.fiberSourceId);
    const craft = getProductionDefinition(proof.craftId);
    const forge = getPointOfInterest(proof.brasshavenForgePoiId);
    const knowledgeSource = followUpSeen
        ? 'Marshal Varric Stone follow-up'
        : starfenVisited
            ? 'visited Starfen'
            : 'carried Starfen material';

    if (claspQuantity > 0) {
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: proof.ambitionName,
            summary: 'The Redstone metalwork and Starfen fiber have become one finished cross-region component.',
            reason: 'A larger ambition should connect earlier work across places instead of replacing it with a disconnected reward tier.',
            progress: 'The Copper Trail Clasp is complete; its materials still tell the story of work done in both regions.',
            status: 'complete',
            requirements: [
                requirement('Redstone copper ingot', true),
                requirement('Starfen reed fiber', true),
                requirement('Craft at a forge', true),
            ],
            regionLabel: 'Cross-region',
            groupKind: 'ambition',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: null,
        });
    }

    const activeWork = listWorkRecords(state, { status: WORK_STATUSES.ACTIVE })
        .find((record) => record.data?.sourceId === proof.fiberSourceId || record.data?.processId === proof.craftId);
    if (activeWork) {
        const gathering = activeWork.data?.sourceId === proof.fiberSourceId;
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: gathering ? 'Starfen fiber for the Copper Trail Clasp' : proof.ambitionName,
            summary: gathering
                ? 'You are already gathering reeds in Starfen. Finish the work to secure the fiber you came for.'
                : 'The Copper Trail Clasp is already on the bench. Finish the work to complete it.',
            reason: 'Active work outranks unrelated distant leads and remains owned by the existing timed-task authority.',
            progress: gathering ? 'Secure the Starfen half of the clasp material chain.' : 'Finish the Copper Trail Clasp.',
            status: 'active',
            requirements: [requirement(`Finish ${activeWork.label}`, false)],
            regionLabel: gathering ? 'Starfen' : 'Redstone Reach',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: action(`finish-${activeWork.id}`, `Finish · ${activeWork.label}`, 'activity.advanceToCompletion'),
        });
    }

    if (state.travel?.active) {
        const towardStarfen = [proof.brasshavenHubId, proof.mistmereHubId, proof.starfenPlaceId].includes(state.travel.to);
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: towardStarfen ? 'Travel toward Starfen' : proof.ambitionName,
            summary: towardStarfen
                ? 'Your current journey is already carrying you toward the Starfen material you need.'
                : 'Another journey is already underway. Finish or stop it before choosing a different long road.',
            reason: 'The Journal follows canonical travel state rather than offering simultaneous route actions.',
            progress: `You learned this lead from ${knowledgeSource}; Starfen reed fiber is still missing.`,
            status: towardStarfen ? 'active' : 'available',
            requirements: [requirement('Finish the current journey', false)],
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: towardStarfen ? action('finish-starfen-travel', 'Finish current journey', 'activity.advanceToCompletion') : null,
        });
    }

    if (fiberQuantity > 0 && ingotQuantity === 0) {
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: 'Starfen material secured',
            summary: 'You have the reed fiber. The remaining material is another Redstone Copper Ingot, which you already know how to produce.',
            reason: 'The larger ambition links regional work without duplicating the Redstone gathering/production authority in a second quest path.',
            progress: 'Starfen leg complete; acquire another Redstone Copper Ingot before returning to a forge.',
            status: 'complete',
            requirements: [
                requirement('Starfen reed fiber', true),
                requirement('Redstone copper ingot', false),
            ],
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: null,
        });
    }

    if (fiberQuantity > 0 && ingotQuantity > 0) {
        return createCraftStep(state, { proof, craft, forge, knowledgeSource });
    }

    return createStarfenFiberStep(state, { proof, source, knowledgeSource, starfenVisited });
}

function createStarfenFiberStep(state, { proof, source, knowledgeSource, starfenVisited }) {
    const currentPlace = getPlace(state.currentPlaceId);

    if (state.currentPlaceId === proof.starfenPlaceId) {
        const check = checkGatheringWorkRequirements(state, proof.fiberSourceId, { quantity: 1 });
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: `Starfen · gather reed fiber for ${proof.ambitionName}`,
            summary: check.ok
                ? `${source?.name ?? 'A local reedbed'} is here. Gather one usable length of fiber for the clasp.`
                : `You have reached Starfen, but ${source?.name ?? 'the reedbed'} still requires better preparation before you can harvest it.`,
            reason: 'The exact source is surfaced only after the character reaches the place that contains it; authored remote resource nodes remain hidden beforehand.',
            progress: 'Starfen reed fiber completes the second regional material requirement for the Copper Trail Clasp.',
            status: check.ok ? 'ready' : 'blocked',
            requirements: [
                requirement('Reach West Starfen', true),
                requirement('Equip a cutting-capable field tool', check.ok),
            ],
            blockers: check.ok ? [] : check.blockers,
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: check.ok ? action('gather-starfen-reed-fiber', 'Gather · Starfen reed fiber', 'gathering.start', { sourceId: proof.fiberSourceId, quantity: 1 }) : null,
        });
    }

    if (state.currentPlaceId === proof.mistmereHubId) {
        const route = findTravelRoute(state, proof.starfenPlaceId);
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: 'Starfen · continue toward reed country',
            summary: route.ok
                ? 'From Mistmere Reedport, you now know a usable way into West Starfen.'
                : 'You know Starfen is the target region, but you do not currently have a usable route from here.',
            reason: 'Specific route actions appear only when the character is at a place from which that route is genuinely usable.',
            progress: 'Reach West Starfen. You will still need to find a suitable reed source after you arrive.',
            status: route.ok ? 'ready' : 'available',
            requirements: [requirement('Reach Mistmere Reedport', true), requirement('Know a usable route into Starfen', route.ok)],
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: route.ok ? action('travel-mistmere-to-starfen', 'Travel · West Starfen', 'travel.start', { destinationId: proof.starfenPlaceId }) : null,
        });
    }

    if (state.currentPlaceId === proof.brasshavenHubId) {
        return createLongRoadStep(state, proof.brasshavenHubId, proof.mistmereHubId, knowledgeSource);
    }

    const localToBrasshavenHub = listLocalityDestinations(state).find((entry) => entry.id === proof.brasshavenHubId);
    if (localToBrasshavenHub) {
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: 'Starfen · take the long road east',
            summary: `${localToBrasshavenHub.name} is the local travel hub you know. Go there before choosing the long-distance leg.`,
            reason: 'The Journal exposes the next locally knowable transition, not every hidden stop in the route graph.',
            progress: 'Reach the Iron Quay, then look for the long-distance connection toward Mistmere and Starfen.',
            status: 'ready',
            requirements: [requirement(`Reach ${localToBrasshavenHub.name}`, false)],
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: action('go-brasshaven-iron-quay', `Go · ${localToBrasshavenHub.name}`, 'locality.move', { destinationId: proof.brasshavenHubId }),
        });
    }

    const localToMistmereHub = listLocalityDestinations(state).find((entry) => entry.id === proof.mistmereHubId);
    if (localToMistmereHub) {
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: 'Starfen · reach Mistmere Reedport',
            summary: 'Reedport is the local travel hub you know for continuing toward Starfen.',
            reason: 'Named locality knowledge can guide the player toward a regional route without exposing authored coordinates.',
            progress: 'Reach Reedport, then choose a route into Starfen.',
            status: 'ready',
            requirements: [requirement('Reach Mistmere Reedport', false)],
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: action('go-mistmere-reedport', 'Go · Mistmere Reedport', 'locality.move', { destinationId: proof.mistmereHubId }),
        });
    }

    const returnToBrasshaven = findTravelRoute(state, proof.brasshavenForgePlaceId);
    if (returnToBrasshaven.ok && currentPlace?.region === 'Redstone Reach') {
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: 'Starfen · return to the Brasshaven road hub',
            summary: 'You know what you need from Starfen, but the long-distance connection you know begins back in Brasshaven.',
            reason: 'Distant goals remain visible while only the next reachable route action is enabled.',
            progress: 'Return to Brasshaven, then continue east through the travel connections you know.',
            status: 'ready',
            requirements: [requirement('Return to Brasshaven', false)],
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: action('return-brasshaven-for-starfen', 'Travel · Brasshaven Market Ring', 'travel.start', { destinationId: proof.brasshavenForgePlaceId }),
        });
    }

    return opportunity({
        id: 'campaign-copper-trail-clasp',
        category: 'ambition',
        title: 'Starfen · known material horizon',
        summary: starfenVisited
            ? 'You have been to Starfen before, but no route you can use from your current position leads there directly.'
            : 'Varric has given you a reason to seek Starfen reed fiber. You know the destination, not every road or reedbed between here and there.',
        reason: 'Knowing that a region or material exists is different from knowing every route, locality, and source inside it.',
        progress: `You learned this lead from ${knowledgeSource}. Reach a travel connection you know before planning the next leg.`,
        status: 'available',
        requirements: [requirement('Reach a known travel connection toward Starfen', false)],
        regionLabel: 'Starfen',
        groupKind: 'region',
        linkedAmbition: proof.ambitionName,
        knowledgeSource,
        action: null,
    });
}

function createCraftStep(state, { proof, craft, forge, knowledgeSource }) {
    if (state.currentPlaceId === proof.brasshavenForgePlaceId) {
        const check = checkProductionRequirements(state, proof.craftId);
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: proof.ambitionName,
            summary: check.ok
                ? `${forge?.name ?? 'The Brasshaven forge'} can combine your Redstone metal and Starfen fiber into the clasp now.`
                : 'You have both regional materials, but the current forge or preparation still blocks the craft.',
            reason: 'The larger ambition resolves through existing workstation, input, timed-work, and output authority.',
            progress: 'Craft the Copper Trail Clasp at a suitable forge.',
            status: check.ok ? 'ready' : 'blocked',
            requirements: [
                requirement('Redstone copper ingot', true),
                requirement('Starfen reed fiber', true),
                requirement('Work at a forge', check.ok),
            ],
            blockers: check.ok ? [] : check.blockers,
            regionLabel: 'Redstone Reach',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: check.ok ? action('craft-copper-trail-clasp', `Craft · ${craft?.name ?? proof.ambitionName}`, 'production.start', { processId: proof.craftId }) : null,
        });
    }

    const returnStep = createReturnToForgeStep(state, proof);
    return opportunity({
        id: 'campaign-copper-trail-clasp',
        category: 'ambition',
        title: 'Return with Starfen fiber',
        summary: 'Both regional materials are in hand. Bring them back to the Brasshaven forge you already know.',
        reason: 'The Journal can name a known service destination without exposing hidden topology or bypassing travel authority.',
        progress: 'Return to Brasshaven Market Ring, then craft the Copper Trail Clasp.',
        status: returnStep.status,
        requirements: [requirement('Reach Brasshaven Market Ring', false)],
        blockers: returnStep.blockers,
        regionLabel: 'Redstone Reach',
        groupKind: 'region',
        linkedAmbition: proof.ambitionName,
        knowledgeSource,
        action: returnStep.action,
    });
}

function createReturnToForgeStep(state, proof) {
    if (state.currentPlaceId === proof.brasshavenHubId) {
        const local = listLocalityDestinations(state).find((entry) => entry.id === proof.brasshavenForgePlaceId);
        return {
            status: local ? 'ready' : 'available',
            blockers: local ? [] : ['Brasshaven Market Ring is not a current locality destination.'],
            action: local ? action('return-to-market-ring', 'Go · Brasshaven Market Ring', 'locality.move', { destinationId: proof.brasshavenForgePlaceId }) : null,
        };
    }

    const localToReedport = listLocalityDestinations(state).find((entry) => entry.id === proof.mistmereHubId);
    if (localToReedport) {
        return {
            status: 'ready',
            blockers: [],
            action: action('return-to-reedport', 'Go · Mistmere Reedport', 'locality.move', { destinationId: proof.mistmereHubId }),
        };
    }
    const localToIronQuay = listLocalityDestinations(state).find((entry) => entry.id === proof.brasshavenHubId);
    if (localToIronQuay) {
        return {
            status: 'ready',
            blockers: [],
            action: action('return-to-iron-quay', 'Go · Brasshaven Iron Quay', 'locality.move', { destinationId: proof.brasshavenHubId }),
        };
    }
    const routeToMarket = findTravelRoute(state, proof.brasshavenForgePlaceId);
    return {
        status: routeToMarket.ok ? 'ready' : 'available',
        blockers: routeToMarket.ok ? [] : [routeToMarket.reason ?? 'No current return route to Brasshaven.'],
        action: routeToMarket.ok ? action('return-to-brasshaven-market', 'Travel · Brasshaven Market Ring', 'travel.start', { destinationId: proof.brasshavenForgePlaceId }) : null,
    };
}

function createLongRoadStep(state, fromPlaceId, toPlaceId, knowledgeSource) {
    const proof = COPPER_TRAIL_PROOF;
    const service = getTransportService(proof.longRoadServiceId);
    const journey = getServiceJourney(proof.longRoadServiceId, fromPlaceId, toPlaceId);
    if (!service || !journey) {
        return opportunity({
            id: 'campaign-copper-trail-clasp',
            category: 'ambition',
            title: 'Starfen · long-distance connection unavailable',
            summary: 'You still know why Starfen matters, but this travel hub does not currently offer a usable service for the next leg.',
            reason: 'The Journal does not invent a teleport or hidden connection when route authority cannot supply one.',
            progress: `You learned this lead from ${knowledgeSource}.`,
            status: 'available',
            requirements: [requirement('Find a usable long-distance service', false)],
            regionLabel: 'Starfen',
            groupKind: 'region',
            linkedAmbition: proof.ambitionName,
            knowledgeSource,
            action: null,
        });
    }

    const fare = service.fare.baseAmount + service.fare.perSegmentAmount * journey.segmentCount;
    const currencyId = service.fare.currencyId;
    const available = Number(state.player?.wallet?.[currencyId]) || 0;
    const canPay = available >= fare;
    const destination = getPlace(toPlaceId);
    return opportunity({
        id: 'campaign-copper-trail-clasp',
        category: 'ambition',
        title: toPlaceId === proof.mistmereHubId ? 'Starfen · cross to Mistmere' : 'Return west with the Starfen material',
        summary: `${service.name} runs from here to ${destination?.name ?? toPlaceId}.`,
        reason: 'Scheduled transport is surfaced only at a served stop and still enforces fare, cadence, cargo, fictional time, and arrival authority.',
        progress: toPlaceId === proof.mistmereHubId
            ? 'Reach Mistmere Reedport, then continue into Starfen.'
            : 'Return to Brasshaven with the cross-region material.',
        status: canPay ? 'ready' : 'blocked',
        requirements: [
            requirement(`Be at ${getPlace(fromPlaceId)?.name ?? fromPlaceId}`, true),
            requirement(`Pay ${fare} ${currencyId}`, canPay),
        ],
        blockers: canPay ? [] : [`Requires ${fare} ${currencyId}; you have ${available}.`],
        regionLabel: toPlaceId === proof.mistmereHubId ? 'Starfen' : 'Redstone Reach',
        groupKind: 'region',
        linkedAmbition: proof.ambitionName,
        knowledgeSource,
        action: canPay ? action(
            `book-${proof.longRoadServiceId}-${toPlaceId}`,
            `Book · ${service.name} (${fare} ${currencyId})`,
            'transport.start',
            { serviceId: proof.longRoadServiceId, destinationPlaceId: toPlaceId },
        ) : null,
    });
}

function decorateExistingEntry(entry, { currentRegion, originRegion, regionalTarget }) {
    const regionLabel = entry.regionLabel ?? inferRegionLabel(entry, originRegion, regionalTarget);
    const groupKind = entry.groupKind ?? (entry.category === 'day-review' ? 'continuity' : 'region');
    const prefix = groupKind === 'continuity' ? 'Recent continuity' : regionLabel;
    return opportunity({
        ...entry,
        title: prefix && !String(entry.title).startsWith(`${prefix} ·`) ? `${prefix} · ${entry.title}` : entry.title,
        regionLabel: groupKind === 'continuity' ? 'Recent continuity' : regionLabel,
        groupKind,
        currentRegion: groupKind === 'region' && regionLabel === currentRegion,
        linkedAmbition: entry.linkedAmbition ?? null,
        knowledgeSource: entry.knowledgeSource ?? inferKnowledgeSource(entry),
    });
}

function inferRegionLabel(entry, originRegion, regionalTarget) {
    if (['livelihood', 'training', 'exploration'].includes(entry.category)) return regionalTarget?.region ?? originRegion;
    return originRegion;
}

function inferKnowledgeSource(entry) {
    if (entry.category === 'commitment') return 'known contact and commitment state';
    if (entry.category === 'day-review') return 'structured day history';
    if (entry.category === 'exploration') return 'origin directions and atlas knowledge';
    return 'current character/world state';
}

function buildGroups(entries, currentRegion) {
    const byKey = new Map();
    for (const entry of entries) {
        const key = entry.groupKind === 'continuity'
            ? 'continuity'
            : entry.regionLabel === 'Cross-region'
                ? 'cross-region'
                : `region:${entry.regionLabel ?? 'Known world'}`;
        if (!byKey.has(key)) {
            byKey.set(key, {
                id: key,
                label: entry.groupKind === 'continuity' ? 'Recent continuity' : entry.regionLabel ?? 'Known world',
                kind: entry.groupKind ?? 'region',
                current: entry.groupKind === 'region' && entry.regionLabel === currentRegion,
                entries: [],
            });
        }
        byKey.get(key).entries.push(entry);
    }

    return Array.from(byKey.values())
        .map((group) => {
            const sorted = [...group.entries].sort(compareEntries);
            const counts = statusCounts(sorted);
            return Object.freeze({
                id: group.id,
                label: group.label,
                kind: group.kind,
                current: group.current,
                activeCount: counts.active,
                readyCount: counts.ready,
                availableCount: counts.available,
                blockedCount: counts.blocked,
                completeCount: counts.complete,
                entries: Object.freeze(sorted),
            });
        })
        .sort((a, b) => groupPriority(a) - groupPriority(b) || a.label.localeCompare(b.label));
}

function chooseRecommendedOpportunity(baseModel, orderedEntries) {
    const baseRecommended = orderedEntries.find((entry) => entry.id === baseModel.recommendedOpportunityId);
    if (baseRecommended?.action && ['active', 'ready'].includes(baseRecommended.status)) return baseRecommended.id;
    return orderedEntries.find((entry) => entry.status === 'active' && entry.action)?.id
        ?? orderedEntries.find((entry) => entry.status === 'ready' && entry.action)?.id
        ?? orderedEntries.find((entry) => entry.status === 'available' && entry.action)?.id
        ?? baseRecommended?.id
        ?? null;
}

function createReadabilityPrompt(groups) {
    if (!groups.length) return 'No current opportunities are known.';
    const summary = groups.map((group) => {
        const label = group.current ? `${group.label} (here)` : group.label;
        const parts = [
            group.activeCount ? `${group.activeCount} active` : null,
            group.readyCount ? `${group.readyCount} ready` : null,
            group.availableCount ? `${group.availableCount} known` : null,
            group.blockedCount ? `${group.blockedCount} blocked` : null,
        ].filter(Boolean);
        return `${label}: ${parts.join(', ') || 'known'}`;
    });
    return `Choose among the leads you know now. ${summary.join(' · ')}.`;
}

function compareEntries(a, b) {
    const rankA = actionRank(a);
    const rankB = actionRank(b);
    return rankA - rankB || String(a.title).localeCompare(String(b.title));
}

function actionRank(entry) {
    const base = STATUS_PRIORITY[entry.status] ?? 9;
    if (entry.status === 'active' && entry.action) return -2;
    if (entry.status === 'ready' && entry.action) return -1;
    return base * 2 + (entry.action ? 0 : 1);
}

function groupPriority(group) {
    if (group.current) return 0;
    if (group.kind === 'region') return 1;
    if (group.kind === 'ambition') return 2;
    return 3;
}

function statusCounts(entries) {
    const counts = { active: 0, ready: 0, available: 0, blocked: 0, complete: 0 };
    for (const entry of entries) if (Object.hasOwn(counts, entry.status)) counts[entry.status] += 1;
    return counts;
}

function inventoryQuantity(state, itemId, containerId = 'inventory') {
    const items = state.player?.inventoryState?.containers?.[containerId]?.items ?? [];
    return items
        .filter((item) => item.id === itemId || item.templateId === itemId)
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
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
