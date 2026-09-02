import { getConnectionsFrom, getPlace } from '../data/places.js';
import { getPointOfInterest, getPoisAtGrid, getPoisForPlace } from '../data/pointsOfInterest.js';
import { setPositionAndDiscover } from './atlasEngine.js';
import { describeBlockingHandsOnTask, isCharacterHandsOnBusy } from './characterActivityEngine.js';
import { isSettlementLocality } from './localityClassificationEngine.js';
import {
    KNOWLEDGE_STATES,
    canDirectlyNavigateToPoi,
    canTraverseKnownConnection,
    clearCurrentLocalAnchor,
    getConnectorKnowledge,
    getCurrentLocalAnchor,
    getGuidanceWeightBonus,
    getKnownPoisForPlace,
    getPlayerFacingPoiName,
    getPoiKnowledge,
    identifyNpc,
    learnPoiName,
    nextExplorationSequence,
    recordConnectorExposure,
    recordPlaceExposure,
    recordPoiExposure,
    recordPoiInteraction,
    requiresPoiEntryTransition,
    setCurrentLocalAnchor,
} from './localKnowledgeEngine.js';
import { describeNpcScheduleStatus, getPoiScheduleStatus } from './npcScheduleEngine.js';
import { recruitCompanion, syncActivePartyLocation } from './partyEngine.js';
import { performPoiAction, talkAtCurrentGrid } from './poiEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { advanceSimulationUntilInterrupt } from './simulationInterruptEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export { SETTLEMENT_LOCALITY_TYPES, isSettlementLocality } from './localityClassificationEngine.js';

export const LOCALITY_NAVIGATION_VERSION = 3;
export const DEFAULT_LOCALITY_EXPLORE_SECONDS = 120;

export function getNavigationMode(state) {
    if (state?.activeBattle?.phase === 'active') return 'combat';
    if (state?.travel?.active) return 'route';
    return isSettlementLocality(state?.currentPlaceId) ? 'locality' : 'exploration';
}

export function listLocalityDestinations(state) {
    const current = getPlace(state?.currentPlaceId);
    if (!isSettlementLocality(current)) return [];
    const anchor = getCurrentLocalAnchor(state);

    return listCanonicalLocalityConnections(current)
        .filter(({ connection }) => {
            const knowledge = getConnectorKnowledge(state, connection.id);
            if (knowledge?.knowledgeState === KNOWLEDGE_STATES.FAMILIAR) return true;
            return anchor?.type === 'connection' && anchor.id === connection.id && anchor.placeId === current.id;
        })
        .map(({ connection, destination }) => {
            const knowledge = getConnectorKnowledge(state, connection.id);
            const familiar = knowledge?.knowledgeState === KNOWLEDGE_STATES.FAMILIAR;
            return Object.freeze({
                id: destination.id,
                name: destination.name,
                type: destination.type,
                travelSeconds: Math.max(0, Number(connection.travelSeconds) || 0),
                connectionId: connection.id,
                knowledgeState: knowledge?.knowledgeState ?? KNOWLEDGE_STATES.SIGHTED,
                familiarityPoints: knowledge?.familiarityPoints ?? 0,
                navigationState: familiar ? 'familiar' : 'sighted',
            });
        });
}

export function listLocalityPoints(state, options = {}) {
    if (!isSettlementLocality(state?.currentPlaceId)) return [];
    const limit = Math.max(1, Number(options.limit) || 8);
    const activePoiId = state.activePoiId ?? null;
    return getKnownPoisForPlace(state, state.currentPlaceId)
        .sort((left, right) => Number(right.id === activePoiId) - Number(left.id === activePoiId))
        .slice(0, limit)
        .map((poi) => decoratePoiAvailability(state, poi));
}

export function lookAroundLocality(state) {
    const blocker = validateLocalityExplorationAction(state);
    if (blocker) return blocker;

    const current = getPlace(state.currentPlaceId);
    const contextual = getPoisAtGrid(current.id, state.position)
        .filter((poi) => !hasSightedPoi(state, poi.id));
    const otherPois = getPoisForPlace(current.id)
        .filter((poi) => !hasSightedPoi(state, poi.id))
        .filter((poi) => !contextual.some((candidate) => candidate.id === poi.id))
        .sort((a, b) => visibilityRank(a) - visibilityRank(b) || a.id.localeCompare(b.id));
    const connection = listCanonicalLocalityConnections(current)
        .find(({ connection: candidate }) => !hasSightedConnection(state, candidate.id));

    const poi = contextual[0] ?? otherPois[0] ?? null;
    if (poi) {
        const before = getPoiKnowledge(state, poi.id)?.knowledgeState ?? KNOWLEDGE_STATES.UNKNOWN;
        const knowledge = recordPoiExposure(state, poi, { points: 1 });
        state.activePoiId = null;
        setCurrentLocalAnchor(state, { type: 'poi', id: poi.id, placeId: current.id });
        const label = getPlayerFacingPoiName(state, poi);
        const event = emitSemanticEvent(state, 'locality.observed', {
            placeId: current.id,
            targetType: 'poi',
            targetId: poi.id,
            beforeKnowledgeState: before,
            afterKnowledgeState: knowledge.knowledgeState,
        }, { source: 'localityEngine' });
        return ok('locality.observed', `You take in the immediate surroundings and notice ${label}. You have not entered or approached it yet.`, {
            targetType: 'poi',
            targetId: poi.id,
            knowledgeState: knowledge.knowledgeState,
            eventId: event.id,
        });
    }

    if (connection) {
        return revealConnection(state, current, connection.connection, connection.destination, 'look');
    }

    clearCurrentLocalAnchor(state);
    state.activePoiId = null;
    return ok('locality.observed', 'You take in the immediate surroundings. Nothing newly identifiable stands out from what you already know.', {
        targetType: null,
        targetId: null,
    });
}

export function exploreLocality(state, options = {}) {
    const blocker = validateLocalityExplorationAction(state);
    if (blocker) return blocker;

    const current = getPlace(state.currentPlaceId);
    const seconds = Math.max(1, Math.floor(Number(options.durationSeconds) || DEFAULT_LOCALITY_EXPLORE_SECONDS));
    const beforeWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const advance = advanceSimulationUntilInterrupt(state, seconds, {
        worldTimeOptions: { source: 'localityEngine' },
    });
    if (advance.data?.interrupted) {
        return fail('locality.explore-interrupted', `Your exploration is interrupted after ${advance.data.secondsAdvanced}s.`, {
            interrupt: advance.data.interrupt,
            secondsAdvanced: advance.data.secondsAdvanced,
        });
    }

    recordPlaceExposure(state, current.id, { points: 1, learnedName: true });
    const sequence = nextExplorationSequence(state);
    const candidates = createExplorationCandidates(state, current);
    const chosen = chooseWeighted(candidates, resolveExplorationRoll(state, sequence, options.rng));

    state.activePoiId = null;
    if (!chosen || chosen.kind === 'ambient') {
        clearCurrentLocalAnchor(state);
        const event = emitSemanticEvent(state, 'locality.explored', {
            placeId: current.id,
            outcome: 'ambient',
            secondsAdvanced: seconds,
            beforeWorldSeconds,
            afterWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        }, { source: 'localityEngine' });
        return ok('locality.explored', 'You spend time working through the local streets and foot traffic, but nothing new resolves into a reliable landmark or entrance this time.', {
            outcome: 'ambient',
            secondsAdvanced: seconds,
            eventId: event.id,
        });
    }

    if (chosen.kind === 'poi') {
        const poi = chosen.poi;
        const before = getPoiKnowledge(state, poi.id)?.knowledgeState ?? KNOWLEDGE_STATES.UNKNOWN;
        const knowledge = recordPoiExposure(state, poi, { points: 1 });
        setCurrentLocalAnchor(state, { type: 'poi', id: poi.id, placeId: current.id });
        const label = getPlayerFacingPoiName(state, poi);
        const event = emitSemanticEvent(state, 'locality.explored', {
            placeId: current.id,
            outcome: 'poi',
            targetId: poi.id,
            beforeKnowledgeState: before,
            afterKnowledgeState: knowledge.knowledgeState,
            secondsAdvanced: seconds,
            beforeWorldSeconds,
            afterWorldSeconds: ensureWorldTimeState(state).totalSeconds,
        }, { source: 'localityEngine' });
        return ok('locality.explored', describePoiExplorationResult(label, before, knowledge.knowledgeState), {
            outcome: 'poi',
            targetId: poi.id,
            knowledgeState: knowledge.knowledgeState,
            familiarityPoints: knowledge.familiarityPoints,
            secondsAdvanced: seconds,
            eventId: event.id,
        });
    }

    return revealConnection(state, current, chosen.connection, chosen.destination, 'explore', {
        secondsAdvanced: seconds,
        beforeWorldSeconds,
    });
}

export function visitLocalityPoi(state, poiId) {
    if (state?.activeBattle?.phase === 'active') return fail('locality.in-combat', 'You cannot cross the settlement while in battle.');
    if (state?.travel?.active) return fail('locality.travel-active', 'Finish or stop the current journey first.');
    if (isCharacterHandsOnBusy(state)) return fail('locality.work-active', describeBlockingHandsOnTask(state));
    if (!isSettlementLocality(state?.currentPlaceId)) return fail('locality.poi-unavailable', 'Locality actions are only available in safe settlement areas.');
    if (state.activePoiId) return fail('locality.inside-poi', 'Leave the place you are currently inside before going somewhere else.');

    const poi = getPointOfInterest(poiId);
    if (!poi || poi.placeId !== state.currentPlaceId) return fail('locality.poi-missing', 'That point of interest is not in this locality.');

    const anchor = getCurrentLocalAnchor(state);
    const currentlySighted = anchor?.type === 'poi' && anchor.id === poi.id && anchor.placeId === state.currentPlaceId;
    if (!currentlySighted && !canDirectlyNavigateToPoi(state, poi.id)) {
        return fail('locality.poi-not-locatable', 'You know of that place, but not well enough to reliably find your way back to it.');
    }

    const positioned = setPositionAndDiscover(state, state.currentPlaceId, poi.coordinate, {
        important: [`Reached local point ${poi.id}`],
    });
    if (!positioned.ok) return fail('locality.poi-position-failed', positioned.reason);

    const knowledge = recordPoiExposure(state, poi, { points: 1 });
    const requiresEntry = requiresPoiEntryTransition(poi);
    state.activePoiId = requiresEntry ? null : poi.id;
    setCurrentLocalAnchor(state, { type: 'poi', id: poi.id, placeId: state.currentPlaceId });

    const label = getPlayerFacingPoiName(state, poi);
    const event = emitSemanticEvent(state, 'locality.poi-reached', {
        placeId: state.currentPlaceId,
        poiId: poi.id,
        knowledgeState: knowledge.knowledgeState,
        requiresEntry,
    }, { source: 'localityEngine' });

    return ok('locality.poi-reached',
        requiresEntry
            ? `You make your way to ${label}. The entrance is before you; entering is still your choice.`
            : `You approach ${label}. You can greet them, ask for service, or move on.`,
        {
            poiId: poi.id,
            knowledgeState: knowledge.knowledgeState,
            requiresEntry,
            eventId: event.id,
        });
}

export function enterLocalityPoi(state, poiId) {
    if (state?.activeBattle?.phase === 'active') return fail('locality.in-combat', 'You cannot enter a local venue while in battle.');
    if (state?.travel?.active) return fail('locality.travel-active', 'Finish or stop the current journey first.');
    if (isCharacterHandsOnBusy(state)) return fail('locality.work-active', describeBlockingHandsOnTask(state));
    if (!isSettlementLocality(state?.currentPlaceId)) return fail('locality.poi-unavailable', 'Locality actions are only available in safe settlement areas.');

    const poi = getPointOfInterest(poiId);
    if (!poi || poi.placeId !== state.currentPlaceId) return fail('locality.poi-missing', 'That point of interest is not in this locality.');
    if (!requiresPoiEntryTransition(poi)) {
        if (getCurrentLocalAnchor(state)?.type === 'poi' && getCurrentLocalAnchor(state)?.id === poi.id) {
            state.activePoiId = poi.id;
            return ok('locality.poi-entered', `You are already close enough to interact with ${getPlayerFacingPoiName(state, poi)}.`, { poiId: poi.id });
        }
        return fail('locality.poi-no-entry', 'That local point does not have a separate interior entrance.');
    }
    const anchor = getCurrentLocalAnchor(state);
    if (!anchor || anchor.type !== 'poi' || anchor.id !== poi.id || anchor.placeId !== state.currentPlaceId) {
        return fail('locality.poi-entrance-not-reached', 'Reach the entrance before trying to go inside.');
    }
    if (state.activePoiId === poi.id) return ok('locality.poi-already-entered', `You are already inside ${getPlayerFacingPoiName(state, poi)}.`, { poiId: poi.id });

    const availability = getPoiScheduleStatus(state, poi);
    if (poi.type === 'shop' && availability.scheduled && !availability.available) {
        return fail('locality.poi-closed', 'The shop is closed right now.', {
            poiId: poi.id,
            nextAvailableAtWorldSeconds: availability.nextAvailableAtWorldSeconds,
        });
    }

    state.activePoiId = poi.id;
    const knowledge = recordPoiExposure(state, poi, { points: 1 });
    const event = emitSemanticEvent(state, 'locality.poi-entered', {
        placeId: state.currentPlaceId,
        poiId: poi.id,
        knowledgeState: knowledge.knowledgeState,
    }, { source: 'localityEngine' });
    return ok('locality.poi-entered', `You enter ${getPlayerFacingPoiName(state, poi)}.`, {
        poiId: poi.id,
        knowledgeState: knowledge.knowledgeState,
        eventId: event.id,
    });
}

export function leaveLocalityPoi(state) {
    const poi = state?.activePoiId ? getPointOfInterest(state.activePoiId) : null;
    if (!poi) return fail('locality.poi-not-entered', 'You are not currently inside or engaged with a local point of interest.');
    const poiId = poi.id;
    state.activePoiId = null;
    setCurrentLocalAnchor(state, { type: 'poi', id: poi.id, placeId: state.currentPlaceId });
    const event = emitSemanticEvent(state, 'locality.poi-left', {
        placeId: state.currentPlaceId,
        poiId,
    }, { source: 'localityEngine' });
    return ok('locality.poi-left', `You step away from ${getPlayerFacingPoiName(state, poi)}.`, { poiId, eventId: event.id });
}

export function moveWithinLocality(state, destinationId) {
    if (state?.activeBattle?.phase === 'active') return fail('locality.in-combat', 'You cannot cross the settlement while in battle.');
    if (state?.travel?.active) return fail('locality.travel-active', 'Finish or stop the current journey first.');
    if (isCharacterHandsOnBusy(state)) return fail('locality.work-active', describeBlockingHandsOnTask(state));
    if (state.activePoiId) return fail('locality.inside-poi', 'Leave the current venue before walking to another district.');
    const current = getPlace(state?.currentPlaceId);
    if (!isSettlementLocality(current)) return fail('locality.not-locality', 'Named locality movement is only available in safe settlement areas.');

    const canonical = listCanonicalLocalityConnections(current)
        .find(({ destination }) => destination.id === getPlace(destinationId)?.id);
    if (!canonical) return fail('locality.not-connected', `That locality is not directly reachable from ${current.name}.`);
    if (!canTraverseKnownConnection(state, canonical.connection.id)) {
        return fail('locality.connection-unknown', 'You do not yet know a reliable way to that adjacent locality.');
    }

    const beforeWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const advance = advanceSimulationUntilInterrupt(state, canonical.connection.travelSeconds, {
        worldTimeOptions: { source: 'localityEngine' },
    });
    if (advance.data?.interrupted) {
        return fail(
            'locality.interrupted',
            `Your crossing toward ${canonical.destination.name} is interrupted after ${advance.data.secondsAdvanced}s.`,
            { interrupt: advance.data.interrupt, secondsAdvanced: advance.data.secondsAdvanced },
        );
    }

    const positioned = setPositionAndDiscover(state, canonical.destination.id, canonical.destination.coordinateSystem.start, {
        important: [`Entered ${canonical.destination.name} by known locality connection`],
    });
    if (!positioned.ok) return fail('locality.position-failed', positioned.reason);
    syncActivePartyLocation(state, canonical.destination.id);
    state.activePoiId = null;

    const connectorKnowledge = recordConnectorExposure(state, canonical.connection, {
        points: 2,
        learnedDestinationName: true,
    });
    recordPlaceExposure(state, canonical.destination.id, { points: 1, learnedName: true });

    const reverse = listCanonicalLocalityConnections(canonical.destination)
        .find(({ destination }) => destination.id === current.id);
    if (reverse) {
        recordConnectorExposure(state, reverse.connection, { points: 1, learnedDestinationName: true });
        setCurrentLocalAnchor(state, {
            type: 'connection',
            id: reverse.connection.id,
            placeId: canonical.destination.id,
        });
    } else {
        clearCurrentLocalAnchor(state);
    }

    const event = emitSemanticEvent(state, 'locality.changed', {
        fromPlaceId: current.id,
        toPlaceId: canonical.destination.id,
        connectionId: canonical.connection.id,
        connectorKnowledgeState: connectorKnowledge.knowledgeState,
        travelSeconds: canonical.connection.travelSeconds,
        beforeWorldSeconds,
        afterWorldSeconds: ensureWorldTimeState(state).totalSeconds,
    }, { source: 'localityEngine' });

    return ok('locality.changed', `Walked to ${canonical.destination.name} (${canonical.connection.travelSeconds}s).`, {
        placeId: canonical.destination.id,
        travelSeconds: canonical.connection.travelSeconds,
        eventId: event.id,
    });
}

export function performLocalityPoiAction(state, poiId, action = 'talk') {
    if (!isSettlementLocality(state?.currentPlaceId)) return fail('locality.poi-unavailable', 'Locality actions are only available in safe settlement areas.');
    if (isCharacterHandsOnBusy(state)) return fail('locality.work-active', describeBlockingHandsOnTask(state));
    const poi = getPointOfInterest(poiId);
    if (!poi || poi.placeId !== state.currentPlaceId) return fail('locality.poi-missing', 'That point of interest is not in this locality.');
    if (state.activePoiId !== poi.id) {
        return fail('locality.poi-not-present', 'You need to reach or enter that place before using its services or speaking with someone there.');
    }

    const availability = getPoiScheduleStatus(state, poi);
    if (availability.scheduled && !availability.available) {
        return fail('locality.poi-unavailable-now', describeUnavailablePoi(availability), {
            poiId: poi.id,
            scheduleId: availability.scheduleId,
            nextAvailableAtWorldSeconds: availability.nextAvailableAtWorldSeconds,
        });
    }
    if (availability.npcId) {
        const backingNpc = (state.npcs ?? []).find((npc) => npc.id === availability.npcId);
        if (!backingNpc || backingNpc.identity?.locationId !== state.currentPlaceId) {
            return fail('locality.poi-npc-absent', `${availability.npcName ?? poi.name} is not currently here.`, {
                poiId: poi.id,
                npcId: availability.npcId,
                npcLocationId: backingNpc?.identity?.locationId ?? null,
            });
        }
    }

    recordPoiInteraction(state, poi, { points: 1, learnedName: true });
    learnPoiName(state, poi);
    if (availability.npcId) identifyNpc(state, availability.npcId, { points: 1 });

    const canonicalAction = String(action ?? 'talk').trim().toLowerCase();
    if (canonicalAction === 'companion') {
        const recruitment = recruitCompanion(state, poi.name);
        if (!recruitment.ok) {
            return fail(
                recruitment.code ?? 'locality.companion-unavailable',
                recruitment.display?.text ?? recruitment.reason ?? 'That person is not yet willing to travel with you.',
                { poiId: poi.id, action: canonicalAction, companionResult: recruitment.data ?? null },
            );
        }
        const event = emitSemanticEvent(state, 'locality.poi-used', {
            placeId: state.currentPlaceId,
            poiId: poi.id,
            action: canonicalAction,
        }, { source: 'localityEngine' });
        return ok('locality.poi-used', recruitment.display?.text ?? `${poi.name} agrees to travel with you.`, {
            poiId: poi.id,
            action: canonicalAction,
            companionResult: recruitment.data ?? null,
            eventId: event.id,
        });
    }

    const message = canonicalAction === 'talk'
        ? talkAtCurrentGrid(state, poi.name)
        : performPoiAction(state, canonicalAction, poi.name);

    emitSemanticEvent(state, 'locality.poi-used', {
        placeId: state.currentPlaceId,
        poiId: poi.id,
        action: canonicalAction,
    }, { source: 'localityEngine' });
    return ok('locality.poi-used', message, { poiId: poi.id, action: canonicalAction });
}

export function describeLocality(state) {
    const place = getPlace(state?.currentPlaceId);
    if (!isSettlementLocality(place)) return `${place?.name ?? 'This place'} uses exploration navigation.`;
    const destinations = listLocalityDestinations(state);
    const points = listLocalityPoints(state, { limit: 20 });
    return [
        `${place.name} — learned locality`,
        destinations.length ? `Known adjacent ways: ${destinations.map((entry) => entry.name).join(', ')}` : 'Known adjacent ways: none yet',
        points.length ? `Locatable places: ${points.map((poi) => poi.name).join(', ')}` : 'Locatable places: none yet',
        'Look Around reveals the immediate surroundings. Explore spends fictional time learning the locality.',
    ].join('\n');
}

function createExplorationCandidates(state, current) {
    const candidates = [];
    for (const poi of getPoisForPlace(current.id)) {
        const knowledge = getPoiKnowledge(state, poi.id);
        if (knowledge?.knowledgeState === KNOWLEDGE_STATES.FAMILIAR) continue;
        const stateWeight = knowledge?.knowledgeState === KNOWLEDGE_STATES.REFERENCED ? 8
            : knowledge?.knowledgeState === KNOWLEDGE_STATES.SIGHTED ? 6
                : knowledge?.knowledgeState === KNOWLEDGE_STATES.RECOGNIZED ? 4
                    : 5;
        const guidance = getGuidanceWeightBonus(state, 'poi', poi.id);
        candidates.push({ kind: 'poi', poi, weight: Math.max(1, stateWeight + guidance - visibilityRank(poi) + 1) });
    }
    for (const { connection, destination } of listCanonicalLocalityConnections(current)) {
        const knowledge = getConnectorKnowledge(state, connection.id);
        if (knowledge?.knowledgeState === KNOWLEDGE_STATES.FAMILIAR) continue;
        const stateWeight = knowledge?.knowledgeState === KNOWLEDGE_STATES.REFERENCED ? 8
            : knowledge?.knowledgeState === KNOWLEDGE_STATES.SIGHTED ? 6
                : knowledge?.knowledgeState === KNOWLEDGE_STATES.RECOGNIZED ? 4
                    : 6;
        const guidance = getGuidanceWeightBonus(state, 'connection', connection.id);
        candidates.push({ kind: 'connection', connection, destination, weight: stateWeight + guidance });
    }
    candidates.push({ kind: 'ambient', weight: 2 });
    return candidates;
}

function revealConnection(state, current, connection, destination, source, details = {}) {
    const before = getConnectorKnowledge(state, connection.id)?.knowledgeState ?? KNOWLEDGE_STATES.UNKNOWN;
    const knowledge = recordConnectorExposure(state, connection, {
        points: 1,
        learnedDestinationName: true,
    });
    state.activePoiId = null;
    setCurrentLocalAnchor(state, { type: 'connection', id: connection.id, placeId: current.id });
    const event = emitSemanticEvent(state, source === 'explore' ? 'locality.explored' : 'locality.observed', {
        placeId: current.id,
        outcome: 'connection',
        targetId: connection.id,
        destinationPlaceId: destination.id,
        beforeKnowledgeState: before,
        afterKnowledgeState: knowledge.knowledgeState,
        ...details,
        afterWorldSeconds: ensureWorldTimeState(state).totalSeconds,
    }, { source: 'localityEngine' });
    return ok(source === 'explore' ? 'locality.explored' : 'locality.observed',
        `You come upon a clear way into ${destination.name}. The entrance is before you; crossing it is still your choice.`,
        {
            outcome: 'connection',
            targetId: connection.id,
            destinationId: destination.id,
            knowledgeState: knowledge.knowledgeState,
            familiarityPoints: knowledge.familiarityPoints,
            eventId: event.id,
            ...details,
        });
}

function listCanonicalLocalityConnections(current) {
    return getConnectionsFrom(current.id)
        .filter((connection) => connection.mode === 'walk' && !connection.flags?.externalPlaceholder)
        .map((connection) => ({ connection, destination: getPlace(connection.to) }))
        .filter(({ destination }) => isSettlementLocality(destination) && destination.nation === current.nation);
}

function validateLocalityExplorationAction(state) {
    if (state?.activeBattle?.phase === 'active') return fail('locality.in-combat', 'You cannot explore the settlement while in battle.');
    if (state?.travel?.active) return fail('locality.travel-active', 'Finish or stop the current journey first.');
    if (isCharacterHandsOnBusy(state)) return fail('locality.work-active', describeBlockingHandsOnTask(state));
    if (state.activePoiId) return fail('locality.inside-poi', 'Leave the current venue before exploring the surrounding locality.');
    const current = getPlace(state?.currentPlaceId);
    if (!isSettlementLocality(current)) return fail('locality.not-locality', 'Look Around and locality exploration are available in safe settlement areas.');
    return null;
}

function hasSightedPoi(state, poiId) {
    const knowledge = getPoiKnowledge(state, poiId);
    return knowledge && knowledge.knowledgeState !== KNOWLEDGE_STATES.REFERENCED;
}

function hasSightedConnection(state, connectionId) {
    const knowledge = getConnectorKnowledge(state, connectionId);
    return knowledge && knowledge.knowledgeState !== KNOWLEDGE_STATES.REFERENCED;
}

function visibilityRank(poi) {
    if (['routeExit', 'travel', 'travelMarker', 'landmark'].includes(poi.type)) return 1;
    if (['shop', 'vendor', 'guild'].includes(poi.type)) return 2;
    return 3;
}

function resolveExplorationRoll(state, sequence, rng) {
    if (typeof rng === 'function') return normalizeRoll(rng());
    const input = `${state.currentPlaceId}|${ensureWorldTimeState(state).totalSeconds}|${sequence}`;
    let hash = 2166136261;
    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967296;
}

function chooseWeighted(candidates, roll) {
    const total = candidates.reduce((sum, entry) => sum + Math.max(0, Number(entry.weight) || 0), 0);
    if (total <= 0) return null;
    let cursor = normalizeRoll(roll) * total;
    for (const entry of candidates) {
        cursor -= Math.max(0, Number(entry.weight) || 0);
        if (cursor < 0) return entry;
    }
    return candidates[candidates.length - 1] ?? null;
}

function normalizeRoll(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(0.999999999, number));
}

function describePoiExplorationResult(label, before, after) {
    if (after === KNOWLEDGE_STATES.FAMILIAR) {
        return `You work through the streets until ${label} falls into place against routes and landmarks you now remember reliably. You can find it directly from this locality in the future.`;
    }
    if (before === KNOWLEDGE_STATES.UNKNOWN || before === KNOWLEDGE_STATES.REFERENCED) {
        return `You work your way through the locality and come upon ${label}. It is before you now; you still choose whether to approach or enter.`;
    }
    return `Your wandering brings you back to ${label}. The surrounding turns and landmarks are becoming easier to recognize.`;
}

function decoratePoiAvailability(state, poi) {
    const availability = getPoiScheduleStatus(state, poi);
    const knowledge = getPoiKnowledge(state, poi.id);
    const name = getPlayerFacingPoiName(state, poi);
    const notes = availability.scheduled
        ? availability.available
            ? `${poi.notes} · Available now · ${availability.windowSummary ?? availability.currentWindowLabel ?? 'schedule varies'}.`
            : availability.npcId
                ? `${poi.notes} · ${describeNpcScheduleStatus(availability)}`
                : `${poi.notes} · Not available right now · ${availability.windowSummary ?? availability.currentWindowLabel ?? 'schedule varies'}.`
        : poi.notes;
    return Object.freeze({
        ...poi,
        name,
        notes,
        canonicalName: poi.name,
        knowledgeState: knowledge?.knowledgeState ?? KNOWLEDGE_STATES.SIGHTED,
        familiarityPoints: knowledge?.familiarityPoints ?? 0,
        learnedName: Boolean(knowledge?.learnedName),
        present: state.activePoiId === poi.id,
        atEntrance: getCurrentLocalAnchor(state)?.type === 'poi' && getCurrentLocalAnchor(state)?.id === poi.id && state.activePoiId !== poi.id,
        requiresEntry: requiresPoiEntryTransition(poi),
        availability,
    });
}

function describeUnavailablePoi(status) {
    if (!status?.scheduled) return 'That service is not available right now.';
    if (status.npcId) return describeNpcScheduleStatus(status);
    return status.currentWindowLabel
        ? `That service is not available right now. Its current schedule is ${status.currentWindowLabel}.`
        : status.windowSummary
            ? `That service is not available right now. Its schedule is ${status.windowSummary}.`
            : 'That service is not available right now.';
}

function ok(code, message, data = {}) { return { ok: true, code, message, data }; }
function fail(code, message, data = {}) { return { ok: false, code, message, data }; }
