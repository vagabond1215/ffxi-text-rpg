import { createSeedNpcs } from '../data/seedEntities.js';
import { getConnectionsFrom, getPlace, listPlaces } from '../data/places.js';
import { getPointOfInterest, getPoisForPlace } from '../data/pointsOfInterest.js';

export const LOCAL_KNOWLEDGE_VERSION = 1;

export const KNOWLEDGE_STATES = Object.freeze({
    UNKNOWN: 'unknown',
    REFERENCED: 'referenced',
    SIGHTED: 'sighted',
    RECOGNIZED: 'recognized',
    FAMILIAR: 'familiar',
});

export const FAMILIARITY_THRESHOLDS = Object.freeze({
    1: 5,
    2: 7,
    3: 10,
    4: 14,
});

const VALID_STATES = new Set(Object.values(KNOWLEDGE_STATES));

export function createLocalKnowledgeState(startPlaceId, options = {}) {
    const worldTimeSeconds = normalizeWorldSeconds(options.worldTimeSeconds);
    const state = {
        version: LOCAL_KNOWLEDGE_VERSION,
        places: {},
        pois: {},
        npcs: {},
        connectors: {},
        guidance: [],
        explorationSequence: 0,
        guidanceSequence: 0,
        currentAnchor: null,
    };
    if (getPlace(startPlaceId)) {
        state.places[startPlaceId] = {
            placeId: startPlaceId,
            knowledgeState: KNOWLEDGE_STATES.FAMILIAR,
            familiarityPoints: FAMILIARITY_THRESHOLDS[1],
            learnedName: true,
            firstSeenAtWorldSeconds: worldTimeSeconds,
            lastSeenAtWorldSeconds: worldTimeSeconds,
        };
    }
    return state;
}

export function ensureLocalKnowledgeState(state) {
    if (!state.localKnowledge || typeof state.localKnowledge !== 'object' || Array.isArray(state.localKnowledge)) {
        state.localKnowledge = createLocalKnowledgeState(state.currentPlaceId, {
            worldTimeSeconds: state.worldTime?.totalSeconds,
        });
    }
    return state.localKnowledge;
}

export function getPoiKnowledge(state, poiId) {
    return state?.localKnowledge?.pois?.[poiId] ?? null;
}

export function getPlaceKnowledge(state, placeId) {
    return state?.localKnowledge?.places?.[placeId] ?? null;
}

export function getConnectorKnowledge(state, connectionId) {
    return state?.localKnowledge?.connectors?.[connectionId] ?? null;
}

export function getNpcKnowledge(state, npcId) {
    return state?.localKnowledge?.npcs?.[npcId] ?? null;
}

export function referencePlace(state, placeId, options = {}) {
    const place = getPlace(placeId);
    if (!place) return null;
    const knowledge = ensureLocalKnowledgeState(state);
    const now = currentWorldSeconds(state);
    const entry = knowledge.places[place.id] ?? {
        placeId: place.id,
        knowledgeState: KNOWLEDGE_STATES.REFERENCED,
        familiarityPoints: 0,
        learnedName: false,
        firstSeenAtWorldSeconds: now,
        lastSeenAtWorldSeconds: now,
    };
    if (stateRank(entry.knowledgeState) < stateRank(KNOWLEDGE_STATES.REFERENCED)) entry.knowledgeState = KNOWLEDGE_STATES.REFERENCED;
    if (options.learnedName === true) entry.learnedName = true;
    entry.lastSeenAtWorldSeconds = now;
    knowledge.places[place.id] = entry;
    return entry;
}

export function recordPlaceExposure(state, placeId, options = {}) {
    const place = getPlace(placeId);
    if (!place) return null;
    const entry = referencePlace(state, place.id, { learnedName: options.learnedName === true });
    const points = normalizePoints(options.points, 1);
    entry.familiarityPoints += points;
    entry.knowledgeState = deriveKnowledgeState(entry.familiarityPoints, options.threshold ?? FAMILIARITY_THRESHOLDS[1]);
    entry.lastSeenAtWorldSeconds = currentWorldSeconds(state);
    return entry;
}

export function referencePoi(state, poiOrId, options = {}) {
    const poi = resolvePoi(poiOrId);
    if (!poi) return null;
    const knowledge = ensureLocalKnowledgeState(state);
    const now = currentWorldSeconds(state);
    const entry = knowledge.pois[poi.id] ?? {
        poiId: poi.id,
        placeId: poi.placeId,
        knowledgeState: KNOWLEDGE_STATES.REFERENCED,
        familiarityPoints: 0,
        interactionCount: 0,
        learnedName: false,
        firstSeenAtWorldSeconds: now,
        lastSeenAtWorldSeconds: now,
    };
    if (stateRank(entry.knowledgeState) < stateRank(KNOWLEDGE_STATES.REFERENCED)) entry.knowledgeState = KNOWLEDGE_STATES.REFERENCED;
    if (options.learnedName === true) entry.learnedName = true;
    entry.lastSeenAtWorldSeconds = now;
    knowledge.pois[poi.id] = entry;
    referencePlace(state, poi.placeId);
    return entry;
}

export function recordPoiExposure(state, poiOrId, options = {}) {
    const poi = resolvePoi(poiOrId);
    if (!poi) return null;
    const entry = referencePoi(state, poi, { learnedName: options.learnedName === true });
    entry.familiarityPoints += normalizePoints(options.points, 1);
    entry.knowledgeState = deriveKnowledgeState(entry.familiarityPoints, options.threshold ?? getPoiFamiliarityThreshold(poi));
    entry.lastSeenAtWorldSeconds = currentWorldSeconds(state);
    if (options.learnedName === true) entry.learnedName = true;
    return entry;
}

export function learnPoiName(state, poiOrId) {
    const poi = resolvePoi(poiOrId);
    if (!poi) return null;
    const entry = referencePoi(state, poi, { learnedName: true });
    entry.learnedName = true;
    return entry;
}

export function recordPoiInteraction(state, poiOrId, options = {}) {
    const poi = resolvePoi(poiOrId);
    if (!poi) return null;
    const entry = recordPoiExposure(state, poi, {
        points: options.points ?? 1,
        learnedName: options.learnedName !== false,
    });
    entry.interactionCount = (Number.isInteger(entry.interactionCount) && entry.interactionCount >= 0 ? entry.interactionCount : 0) + 1;
    return entry;
}

export function hasInteractedWithPoi(state, poiId) {
    return (getPoiKnowledge(state, poiId)?.interactionCount ?? 0) > 0;
}

export function recordConnectorExposure(state, connectionOrId, options = {}) {
    const connection = resolveConnection(connectionOrId);
    if (!connection) return null;
    const knowledge = ensureLocalKnowledgeState(state);
    const now = currentWorldSeconds(state);
    const entry = knowledge.connectors[connection.id] ?? {
        connectionId: connection.id,
        fromPlaceId: connection.from,
        toPlaceId: connection.to,
        knowledgeState: KNOWLEDGE_STATES.REFERENCED,
        familiarityPoints: 0,
        firstSeenAtWorldSeconds: now,
        lastSeenAtWorldSeconds: now,
    };
    entry.familiarityPoints += normalizePoints(options.points, 1);
    entry.knowledgeState = deriveKnowledgeState(entry.familiarityPoints, options.threshold ?? FAMILIARITY_THRESHOLDS[1]);
    entry.lastSeenAtWorldSeconds = now;
    knowledge.connectors[connection.id] = entry;
    referencePlace(state, connection.from, { learnedName: true });
    referencePlace(state, connection.to, { learnedName: options.learnedDestinationName !== false });
    return entry;
}

export function identifyNpc(state, npcId, options = {}) {
    const npc = createSeedNpcs().find((candidate) => candidate.id === npcId);
    if (!npc) return null;
    const knowledge = ensureLocalKnowledgeState(state);
    const now = currentWorldSeconds(state);
    const entry = knowledge.npcs[npc.id] ?? {
        npcId: npc.id,
        appearanceKnown: false,
        referencedNameKnown: false,
        identityLinked: false,
        familiarityPoints: 0,
        firstMetAtWorldSeconds: now,
        lastMetAtWorldSeconds: now,
    };
    if (options.appearanceKnown !== false) entry.appearanceKnown = true;
    if (options.referencedNameKnown !== false) entry.referencedNameKnown = true;
    if (options.identityLinked !== false) entry.identityLinked = true;
    entry.familiarityPoints += normalizePoints(options.points, 1);
    entry.lastMetAtWorldSeconds = now;
    knowledge.npcs[npc.id] = entry;
    return entry;
}

export function referenceNpcName(state, npcId) {
    const npc = createSeedNpcs().find((candidate) => candidate.id === npcId);
    if (!npc) return null;
    const knowledge = ensureLocalKnowledgeState(state);
    const now = currentWorldSeconds(state);
    const entry = knowledge.npcs[npc.id] ?? {
        npcId: npc.id,
        appearanceKnown: false,
        referencedNameKnown: false,
        identityLinked: false,
        familiarityPoints: 0,
        firstMetAtWorldSeconds: now,
        lastMetAtWorldSeconds: now,
    };
    entry.referencedNameKnown = true;
    knowledge.npcs[npc.id] = entry;
    return entry;
}

export function isNpcIdentityKnown(state, npcId) {
    return Boolean(getNpcKnowledge(state, npcId)?.identityLinked);
}

export function getPlayerFacingNpcName(state, npc) {
    if (!npc) return 'an unfamiliar person';
    if (isNpcIdentityKnown(state, npc.id)) return npc.identity?.name ?? npc.id;
    return describeUnknownNpc(npc);
}

export function getPlayerFacingPoiName(state, poiOrId) {
    const poi = resolvePoi(poiOrId);
    if (!poi) return 'something nearby';
    const knowledge = getPoiKnowledge(state, poi.id);
    if (knowledge?.learnedName) return poi.name;
    return describeUnknownPoi(poi);
}

export function getKnownPoisForPlace(state, placeId = state?.currentPlaceId, options = {}) {
    const knowledge = state?.localKnowledge;
    if (!knowledge || !placeId) return [];
    const anchor = knowledge.currentAnchor;
    return getPoisForPlace(placeId)
        .filter((poi) => {
            const entry = knowledge.pois?.[poi.id];
            if (!entry || stateRank(entry.knowledgeState) < stateRank(KNOWLEDGE_STATES.SIGHTED)) return false;
            if (options.familiarOnly === true) return entry.knowledgeState === KNOWLEDGE_STATES.FAMILIAR;
            if (entry.knowledgeState === KNOWLEDGE_STATES.FAMILIAR) return true;
            if (state?.activePoiId === poi.id) return true;
            return anchor?.type === 'poi' && anchor.id === poi.id && anchor.placeId === placeId;
        });
}

export function canDirectlyNavigateToPoi(state, poiId) {
    return getPoiKnowledge(state, poiId)?.knowledgeState === KNOWLEDGE_STATES.FAMILIAR;
}

export function canUsePoiNow(state, poiId) {
    return state?.activePoiId === poiId && state?.currentPlaceId === getPointOfInterest(poiId)?.placeId;
}

export function canTraverseKnownConnection(state, connectionId) {
    const entry = getConnectorKnowledge(state, connectionId);
    if (entry?.knowledgeState === KNOWLEDGE_STATES.FAMILIAR) return true;
    const anchor = state?.localKnowledge?.currentAnchor;
    return anchor?.type === 'connection' && anchor.id === connectionId && anchor.placeId === state?.currentPlaceId;
}

export function setCurrentLocalAnchor(state, anchor = null) {
    const knowledge = ensureLocalKnowledgeState(state);
    if (!anchor) {
        knowledge.currentAnchor = null;
        return null;
    }
    knowledge.currentAnchor = {
        type: anchor.type,
        id: anchor.id,
        placeId: anchor.placeId ?? state.currentPlaceId,
    };
    return knowledge.currentAnchor;
}

export function getCurrentLocalAnchor(state) {
    return state?.localKnowledge?.currentAnchor ?? null;
}

export function clearCurrentLocalAnchor(state) {
    if (state?.localKnowledge) state.localKnowledge.currentAnchor = null;
    return null;
}

export function addTemporaryGuidance(state, definition = {}) {
    const knowledge = ensureLocalKnowledgeState(state);
    const targetType = definition.targetType === 'connection' ? 'connection' : 'poi';
    const targetId = String(definition.targetId ?? '').trim();
    if (!isValidGuidanceTarget(targetType, targetId)) return null;
    knowledge.guidanceSequence += 1;
    const guidance = {
        id: `guidance-${knowledge.guidanceSequence}`,
        targetType,
        targetId,
        sourceId: definition.sourceId ? String(definition.sourceId) : null,
        searchWeightBonus: Math.max(1, Number(definition.searchWeightBonus) || 2),
        learnedAtWorldSeconds: currentWorldSeconds(state),
        expiresAtWorldSeconds: Number.isInteger(definition.expiresAtWorldSeconds) && definition.expiresAtWorldSeconds >= 0
            ? definition.expiresAtWorldSeconds
            : null,
        expiresOnRest: definition.expiresOnRest !== false,
    };
    knowledge.guidance.push(guidance);
    return guidance;
}

export function pruneExpiredGuidance(state, options = {}) {
    const knowledge = ensureLocalKnowledgeState(state);
    const now = currentWorldSeconds(state);
    const restReset = options.restReset === true;
    knowledge.guidance = knowledge.guidance.filter((entry) => {
        if (restReset && entry.expiresOnRest) return false;
        if (entry.expiresAtWorldSeconds !== null && entry.expiresAtWorldSeconds <= now) return false;
        return true;
    });
    return knowledge.guidance;
}

export function getGuidanceWeightBonus(state, targetType, targetId) {
    pruneExpiredGuidance(state);
    return state.localKnowledge.guidance
        .filter((entry) => entry.targetType === targetType && entry.targetId === targetId)
        .reduce((sum, entry) => sum + entry.searchWeightBonus, 0);
}

export function nextExplorationSequence(state) {
    const knowledge = ensureLocalKnowledgeState(state);
    knowledge.explorationSequence += 1;
    return knowledge.explorationSequence;
}

export function getPoiFamiliarityTier(poiOrId) {
    const poi = resolvePoi(poiOrId);
    if (!poi) return 2;
    const tags = new Set(poi.tags ?? []);
    if (['hidden', 'secret', 'blackMarket', 'thievesGuild', 'restricted'].some((tag) => tags.has(tag))) return 4;
    if (['quest', 'mission', 'npc', 'companion', 'storage'].includes(poi.type)) return 3;
    if (['vendor', 'shop', 'guild'].includes(poi.type)) return 2;
    return 1;
}

export function getPoiFamiliarityThreshold(poiOrId) {
    return FAMILIARITY_THRESHOLDS[getPoiFamiliarityTier(poiOrId)] ?? FAMILIARITY_THRESHOLDS[2];
}

export function validateLocalKnowledgeState(localKnowledge, options = {}) {
    const issues = [];
    if (!isObject(localKnowledge)) return ['localKnowledge must be an object.'];
    if (localKnowledge.version !== LOCAL_KNOWLEDGE_VERSION) issues.push(`localKnowledge.version must be ${LOCAL_KNOWLEDGE_VERSION}.`);
    for (const field of ['places', 'pois', 'npcs', 'connectors']) {
        if (!isObject(localKnowledge[field])) issues.push(`localKnowledge.${field} must be an object.`);
    }
    if (!Array.isArray(localKnowledge.guidance)) issues.push('localKnowledge.guidance must be an array.');
    if (!Number.isInteger(localKnowledge.explorationSequence) || localKnowledge.explorationSequence < 0) issues.push('localKnowledge.explorationSequence must be a non-negative integer.');
    if (!Number.isInteger(localKnowledge.guidanceSequence) || localKnowledge.guidanceSequence < 0) issues.push('localKnowledge.guidanceSequence must be a non-negative integer.');

    for (const [placeId, entry] of Object.entries(localKnowledge.places ?? {})) {
        const path = `localKnowledge.places.${placeId}`;
        if (!getPlace(placeId)) issues.push(`${path} references unknown place.`);
        issues.push(...validateKnowledgeEntry(entry, path, 'placeId', placeId));
        if (typeof entry?.learnedName !== 'boolean') issues.push(`${path}.learnedName must be boolean.`);
    }

    for (const [poiId, entry] of Object.entries(localKnowledge.pois ?? {})) {
        const path = `localKnowledge.pois.${poiId}`;
        const poi = getPointOfInterest(poiId);
        if (!poi) issues.push(`${path} references unknown POI.`);
        issues.push(...validateKnowledgeEntry(entry, path, 'poiId', poiId));
        if (poi && entry?.placeId !== poi.placeId) issues.push(`${path}.placeId must match ${poi.placeId}.`);
        if (!Number.isInteger(entry?.interactionCount) || entry.interactionCount < 0) issues.push(`${path}.interactionCount must be a non-negative integer.`);
        if (typeof entry?.learnedName !== 'boolean') issues.push(`${path}.learnedName must be boolean.`);
    }

    const npcIds = new Set(createSeedNpcs().map((npc) => npc.id));
    for (const [npcId, entry] of Object.entries(localKnowledge.npcs ?? {})) {
        const path = `localKnowledge.npcs.${npcId}`;
        if (!npcIds.has(npcId)) issues.push(`${path} references unknown NPC.`);
        if (!isObject(entry)) {
            issues.push(`${path} must be an object.`);
            continue;
        }
        if (entry.npcId !== npcId) issues.push(`${path}.npcId must match its key.`);
        for (const field of ['appearanceKnown', 'referencedNameKnown', 'identityLinked']) {
            if (typeof entry[field] !== 'boolean') issues.push(`${path}.${field} must be boolean.`);
        }
        if (!Number.isFinite(entry.familiarityPoints) || entry.familiarityPoints < 0) issues.push(`${path}.familiarityPoints must be non-negative.`);
        for (const field of ['firstMetAtWorldSeconds', 'lastMetAtWorldSeconds']) {
            if (!Number.isInteger(entry[field]) || entry[field] < 0) issues.push(`${path}.${field} must be a non-negative integer.`);
        }
    }

    for (const [connectionId, entry] of Object.entries(localKnowledge.connectors ?? {})) {
        const path = `localKnowledge.connectors.${connectionId}`;
        const connection = resolveConnection(connectionId);
        if (!connection) issues.push(`${path} references unknown connection.`);
        issues.push(...validateKnowledgeEntry(entry, path, 'connectionId', connectionId));
        if (connection && (entry?.fromPlaceId !== connection.from || entry?.toPlaceId !== connection.to)) {
            issues.push(`${path} endpoints must match the canonical connection.`);
        }
    }

    for (const [index, entry] of (localKnowledge.guidance ?? []).entries()) {
        const path = `localKnowledge.guidance[${index}]`;
        if (!isObject(entry)) {
            issues.push(`${path} must be an object.`);
            continue;
        }
        if (typeof entry.id !== 'string' || !entry.id.trim()) issues.push(`${path}.id must be a non-empty string.`);
        if (!['poi', 'connection'].includes(entry.targetType)) issues.push(`${path}.targetType must be poi or connection.`);
        if (!isValidGuidanceTarget(entry.targetType, entry.targetId)) issues.push(`${path} references an unknown target.`);
        if (!Number.isFinite(entry.searchWeightBonus) || entry.searchWeightBonus <= 0) issues.push(`${path}.searchWeightBonus must be positive.`);
        if (!Number.isInteger(entry.learnedAtWorldSeconds) || entry.learnedAtWorldSeconds < 0) issues.push(`${path}.learnedAtWorldSeconds must be non-negative.`);
        if (entry.expiresAtWorldSeconds !== null && (!Number.isInteger(entry.expiresAtWorldSeconds) || entry.expiresAtWorldSeconds < 0)) issues.push(`${path}.expiresAtWorldSeconds must be null or non-negative.`);
        if (typeof entry.expiresOnRest !== 'boolean') issues.push(`${path}.expiresOnRest must be boolean.`);
    }

    if (localKnowledge.currentAnchor !== null) {
        const anchor = localKnowledge.currentAnchor;
        if (!isObject(anchor)) issues.push('localKnowledge.currentAnchor must be null or an object.');
        else {
            if (!['poi', 'connection'].includes(anchor.type)) issues.push('localKnowledge.currentAnchor.type must be poi or connection.');
            if (typeof anchor.id !== 'string' || !anchor.id.trim()) issues.push('localKnowledge.currentAnchor.id must be a non-empty string.');
            if (typeof anchor.placeId !== 'string' || !getPlace(anchor.placeId)) issues.push('localKnowledge.currentAnchor.placeId must reference a place.');
            if (anchor.type === 'poi' && !getPointOfInterest(anchor.id)) issues.push('localKnowledge.currentAnchor references unknown POI.');
            if (anchor.type === 'connection' && !resolveConnection(anchor.id)) issues.push('localKnowledge.currentAnchor references unknown connection.');
            if (options.currentPlaceId && anchor.placeId !== options.currentPlaceId) issues.push('localKnowledge.currentAnchor must belong to currentPlaceId.');
        }
    }
    return issues;
}

function validateKnowledgeEntry(entry, path, idField, idValue) {
    const issues = [];
    if (!isObject(entry)) return [`${path} must be an object.`];
    if (entry[idField] !== idValue) issues.push(`${path}.${idField} must match its key.`);
    if (!VALID_STATES.has(entry.knowledgeState) || entry.knowledgeState === KNOWLEDGE_STATES.UNKNOWN) issues.push(`${path}.knowledgeState must be referenced, sighted, recognized, or familiar.`);
    if (!Number.isFinite(entry.familiarityPoints) || entry.familiarityPoints < 0) issues.push(`${path}.familiarityPoints must be non-negative.`);
    for (const field of ['firstSeenAtWorldSeconds', 'lastSeenAtWorldSeconds']) {
        if (!Number.isInteger(entry[field]) || entry[field] < 0) issues.push(`${path}.${field} must be a non-negative integer.`);
    }
    return issues;
}

function deriveKnowledgeState(points, threshold) {
    if (points >= threshold) return KNOWLEDGE_STATES.FAMILIAR;
    if (points >= 2) return KNOWLEDGE_STATES.RECOGNIZED;
    if (points >= 1) return KNOWLEDGE_STATES.SIGHTED;
    return KNOWLEDGE_STATES.REFERENCED;
}

function stateRank(value) {
    return {
        [KNOWLEDGE_STATES.UNKNOWN]: 0,
        [KNOWLEDGE_STATES.REFERENCED]: 1,
        [KNOWLEDGE_STATES.SIGHTED]: 2,
        [KNOWLEDGE_STATES.RECOGNIZED]: 3,
        [KNOWLEDGE_STATES.FAMILIAR]: 4,
    }[value] ?? 0;
}

function resolvePoi(poiOrId) {
    if (poiOrId && typeof poiOrId === 'object') return getPointOfInterest(poiOrId.id);
    return getPointOfInterest(String(poiOrId ?? ''));
}

function resolveConnection(connectionOrId) {
    if (connectionOrId && typeof connectionOrId === 'object' && connectionOrId.id) return connectionOrId;
    const id = String(connectionOrId ?? '');
    for (const place of listPlaces()) {
        const connection = getConnectionsFrom(place.id).find((candidate) => candidate.id === id);
        if (connection) return connection;
    }
    return null;
}

function isValidGuidanceTarget(targetType, targetId) {
    if (targetType === 'poi') return Boolean(getPointOfInterest(targetId));
    if (targetType === 'connection') return Boolean(resolveConnection(targetId));
    return false;
}

function describeUnknownPoi(poi) {
    switch (poi.type) {
        case 'vendor': return 'a merchant or stall';
        case 'shop': return 'a shopfront';
        case 'guild': return 'a guild office';
        case 'quest':
        case 'mission': return 'a civic or professional contact';
        case 'travel':
        case 'travelMarker':
        case 'routeExit': return 'a marked passage or travel point';
        case 'storage': return 'a secure service counter';
        case 'companion':
        case 'npc': return 'an unfamiliar person';
        case 'landmark': return 'a notable local landmark';
        default: return 'something notable nearby';
    }
}

function describeUnknownNpc(npc) {
    const services = new Set(npc.services ?? []);
    if ([...services].some((service) => /guard|warden|watch|realm/i.test(service))) return 'an unfamiliar guard';
    if ([...services].some((service) => /shop|goods|trade|vendor|provision/i.test(service))) return 'an unfamiliar merchant';
    if ([...services].some((service) => /guild|training|fieldcraft|craft/i.test(service))) return 'an unfamiliar craftsperson';
    return 'an unfamiliar local';
}

function normalizePoints(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function normalizeWorldSeconds(value) {
    return Number.isInteger(value) && value >= 0 ? value : 0;
}

function currentWorldSeconds(state) {
    return normalizeWorldSeconds(state?.worldTime?.totalSeconds);
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
