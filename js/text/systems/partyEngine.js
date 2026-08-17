import {
    findCompanionDefinition,
    getCompanionDefinition,
    getCompanionFieldApproach,
    listCompanionDefinitions,
    listCompanionFieldApproaches,
} from '../data/companions.js';
import { createNpc } from '../entities/entityFactory.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { calculateCombatProfile } from './statEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const PARTY_STATE_VERSION = 1;
export const PARTY_ACTIVE_COMPANION_CAPACITY = 2;

export function createPartyState(options = {}) {
    return {
        version: PARTY_STATE_VERSION,
        capacity: PARTY_ACTIVE_COMPANION_CAPACITY,
        activeCompanionIds: Array.isArray(options.activeCompanionIds) ? [...options.activeCompanionIds] : [],
        companions: cloneCompanionMap(options.companions),
    };
}

export function ensurePartyState(state) {
    if (!state || typeof state !== 'object') throw new Error('Party state requires game state.');
    if (!state.party || typeof state.party !== 'object' || Array.isArray(state.party)) state.party = createPartyState();
    state.party.version ??= PARTY_STATE_VERSION;
    state.party.capacity ??= PARTY_ACTIVE_COMPANION_CAPACITY;
    state.party.activeCompanionIds ??= [];
    state.party.companions ??= {};
    for (const [companionId, companion] of Object.entries(state.party.companions)) {
        const definition = getCompanionDefinition(companionId);
        if (!definition || !companion || typeof companion !== 'object') continue;
        companion.tactics ??= { ...definition.tactics };
        companion.tactics.approachId ??= definition.tactics.defaultApproachId;
    }
    const issues = validatePartyState(state.party);
    if (issues.length) throw new Error(issues.join(' '));
    syncPartyNpcIdentity(state, state.party);
    return state.party;
}

export function listRecruitedCompanions(state) {
    return Object.values(ensurePartyState(state).companions).map(snapshotCompanion);
}

export function listActiveCompanions(state) {
    const party = ensurePartyState(state);
    return party.activeCompanionIds
        .map((id) => party.companions[id])
        .filter(Boolean)
        .map(snapshotCompanion);
}

export function getRecruitedCompanion(state, companionId) {
    const definition = resolveDefinition(companionId);
    if (!definition) return null;
    const companion = ensurePartyState(state).companions[definition.id] ?? null;
    return companion ? snapshotCompanion(companion) : null;
}

export function canRecruitCompanion(state, companionQuery) {
    const definition = resolveDefinition(companionQuery);
    if (!definition) return blocked('party.companion-not-found', { companionQuery }, `Unknown companion: ${String(companionQuery ?? '')}.`);
    const party = ensurePartyState(state);
    if (state.activeBattle?.phase === 'active') return blocked('party.in-combat', { companionId: definition.id }, 'Decide who travels with you before a fight begins.');
    if (party.companions[definition.id]) return blocked('party.already-recruited', { companionId: definition.id }, `${definition.name} is already one of your traveling companions.`);
    if (!definition.recruitment.placeIds.includes(state.currentPlaceId)) {
        return blocked('party.wrong-place', { companionId: definition.id, requiredPlaceIds: [...definition.recruitment.placeIds] }, `${definition.name} is not available to join you here.`);
    }
    const missingFlags = definition.recruitment.requiredFlags.filter((flagId) => !state.flags?.[flagId]);
    if (missingFlags.length) {
        return blocked('party.relationship-requirement', { companionId: definition.id, missingFlags }, `${definition.name} is not yet willing to travel with you.`);
    }
    const npc = ensureBackingNpcRecord(state, definition);
    if (npc.identity.locationId !== state.currentPlaceId) {
        return blocked('party.npc-not-present', { companionId: definition.id, npcId: definition.npcId, locationId: npc.identity.locationId }, `${definition.name} is not currently here.`);
    }
    return actionSuccess({
        action: 'party.recruit-check', code: 'party.recruitable', outcome: 'available',
        data: { companionId: definition.id, npcId: definition.npcId },
        display: { text: `${definition.name} is willing to share the road with you.` },
    });
}

export function recruitCompanion(state, companionQuery, options = {}) {
    const definition = resolveDefinition(companionQuery);
    if (!definition) return blocked('party.companion-not-found', { companionQuery }, `Unknown companion: ${String(companionQuery ?? '')}.`);
    if (!options.ignoreRequirements) {
        const check = canRecruitCompanion(state, definition.id);
        if (!check.ok) return check;
    } else if (state.activeBattle?.phase === 'active') {
        return blocked('party.in-combat', { companionId: definition.id }, 'Decide who travels with you before a fight begins.');
    }
    const party = ensurePartyState(state);
    if (party.companions[definition.id]) return blocked('party.already-recruited', { companionId: definition.id }, `${definition.name} is already one of your traveling companions.`);

    const companion = createPersistentCompanion(definition, state.currentPlaceId, ensureWorldTimeState(state).totalSeconds);
    party.companions[companion.id] = companion;
    let active = false;
    if (options.join !== false && party.activeCompanionIds.length < party.capacity) {
        party.activeCompanionIds.push(companion.id);
        active = true;
    }
    syncBackingNpc(state, companion, active);
    const event = emitSemanticEvent(state, 'party.companion-recruited', {
        companionId: companion.id,
        npcId: companion.npcId,
        placeId: state.currentPlaceId,
        active,
    }, { source: 'partyEngine' });
    return actionSuccess({
        action: 'party.recruit', code: 'party.companion-recruited', outcome: active ? 'joined' : 'recruited',
        data: { companion: snapshotCompanion(companion), active, eventId: event.id },
        display: { text: active ? `${companion.identity.name} falls into step beside you.` : `${companion.identity.name} agrees to travel with you when you return.` },
    });
}

export function joinCompanion(state, companionQuery) {
    const definition = resolveDefinition(companionQuery);
    if (!definition) return blocked('party.companion-not-found', { companionQuery }, `Unknown companion: ${String(companionQuery ?? '')}.`);
    const party = ensurePartyState(state);
    const companion = party.companions[definition.id];
    if (!companion) return blocked('party.not-recruited', { companionId: definition.id }, `${definition.name} has not agreed to travel with you.`);
    if (state.activeBattle?.phase === 'active') return blocked('party.in-combat', { companionId: companion.id }, 'Decide who travels with you before a fight begins.');
    if (party.activeCompanionIds.includes(companion.id)) return blocked('party.already-active', { companionId: companion.id }, `${companion.identity.name} is already traveling with you.`);
    if (party.activeCompanionIds.length >= party.capacity) return blocked('party.full', { capacity: party.capacity }, 'Your traveling company is already full.');
    if (companion.locationId !== state.currentPlaceId) return blocked('party.not-present', { companionId: companion.id, locationId: companion.locationId }, `${companion.identity.name} is not currently here.`);
    if (companion.resources.hp <= 0) return blocked('party.unavailable', { companionId: companion.id }, `${companion.identity.name} needs time to recover before taking the road again.`);

    party.activeCompanionIds.push(companion.id);
    syncBackingNpc(state, companion, true);
    const event = emitSemanticEvent(state, 'party.companion-joined', { companionId: companion.id, placeId: state.currentPlaceId }, { source: 'partyEngine' });
    return actionSuccess({ action: 'party.join', code: 'party.companion-joined', outcome: 'joined', data: { companion: snapshotCompanion(companion), eventId: event.id }, display: { text: `${companion.identity.name} falls into step beside you.` } });
}

export function leaveCompanion(state, companionQuery) {
    const definition = resolveDefinition(companionQuery);
    if (!definition) return blocked('party.companion-not-found', { companionQuery }, `Unknown companion: ${String(companionQuery ?? '')}.`);
    const party = ensurePartyState(state);
    const companion = party.companions[definition.id];
    if (!companion) return blocked('party.not-recruited', { companionId: definition.id }, `${definition.name} has not agreed to travel with you.`);
    const index = party.activeCompanionIds.indexOf(companion.id);
    if (index < 0) return blocked('party.not-active', { companionId: companion.id }, `${companion.identity.name} is not traveling with you now.`);
    if (state.activeBattle?.phase === 'active') return blocked('party.in-combat', { companionId: companion.id }, 'Part ways only after the fighting is done.');

    party.activeCompanionIds.splice(index, 1);
    companion.locationId = state.currentPlaceId;
    syncBackingNpc(state, companion, false);
    const event = emitSemanticEvent(state, 'party.companion-left', { companionId: companion.id, placeId: state.currentPlaceId }, { source: 'partyEngine' });
    return actionSuccess({ action: 'party.leave', code: 'party.companion-left', outcome: 'left', data: { companion: snapshotCompanion(companion), eventId: event.id }, display: { text: `${companion.identity.name} stays behind in ${state.location ?? state.currentPlaceId}, ready to meet you here again.` } });
}

export function listCompanionApproaches(state, companionQuery) {
    const definition = resolveDefinition(companionQuery);
    if (!definition) return [];
    const companion = ensurePartyState(state).companions[definition.id];
    if (!companion) return [];
    const active = ensurePartyState(state).activeCompanionIds.includes(companion.id);
    return listCompanionFieldApproaches(definition.id).map((approach) => Object.freeze({
        ...approach,
        selected: companion.tactics?.approachId === approach.id,
        available: active && state.activeBattle?.phase !== 'active',
    }));
}

export function setCompanionApproach(state, companionQuery, approachId) {
    const definition = resolveDefinition(companionQuery);
    if (!definition) return blocked('party.companion-not-found', { companionQuery }, `Unknown companion: ${String(companionQuery ?? '')}.`);
    const party = ensurePartyState(state);
    const companion = party.companions[definition.id];
    if (!companion) return blocked('party.not-recruited', { companionId: definition.id }, `${definition.name} has not agreed to travel with you.`);
    if (!party.activeCompanionIds.includes(companion.id)) return blocked('party.not-active', { companionId: companion.id }, `${companion.identity.name} needs to be traveling with you before you can agree on a field approach.`);
    if (state.activeBattle?.phase === 'active') return blocked('party.in-combat', { companionId: companion.id }, 'Settle your field approach before the fighting begins.');
    const approach = getCompanionFieldApproach(definition.id, approachId);
    if (!approach) return blocked('party.approach-not-found', { companionId: companion.id, approachId }, `That field approach is not available to ${companion.identity.name}.`);
    if (companion.tactics?.approachId === approach.id) {
        return actionSuccess({
            action: 'party.approach.set', code: 'party.approach-unchanged', outcome: 'unchanged',
            data: { companion: snapshotCompanion(companion), approachId: approach.id },
            display: { text: `${companion.identity.name} is already set on ${approach.name}. ${approach.quote}` },
        });
    }

    companion.tactics ??= { ...definition.tactics };
    const previousApproachId = companion.tactics.approachId ?? definition.tactics.defaultApproachId;
    companion.tactics.approachId = approach.id;
    const event = emitSemanticEvent(state, 'party.companion-approach-changed', {
        companionId: companion.id,
        npcId: companion.npcId,
        previousApproachId,
        approachId: approach.id,
        placeId: state.currentPlaceId,
    }, { source: 'partyEngine' });
    return actionSuccess({
        action: 'party.approach.set', code: 'party.approach-changed', outcome: 'changed',
        data: { companion: snapshotCompanion(companion), previousApproachId, approachId: approach.id, eventId: event.id },
        display: { text: `${companion.identity.name} nods. ${approach.quote} ${approach.summary}` },
    });
}

export function syncActivePartyLocation(state, placeId = state.currentPlaceId) {
    const party = ensurePartyState(state);
    for (const companionId of party.activeCompanionIds) {
        const companion = party.companions[companionId];
        if (!companion) continue;
        companion.locationId = placeId;
        syncBackingNpc(state, companion, true);
    }
    return listActiveCompanions(state);
}

export function getActiveCompanionCombatEntities(state) {
    return listActiveCompanions(state)
        .filter((companion) => companion.resources.hp > 0)
        .map((companion) => ({
            ...companion,
            type: 'companion',
            identity: { ...companion.identity },
            equipment: clonePlain(companion.equipment),
            statuses: clonePlain(companion.statuses),
            resources: { ...companion.resources },
            skills: { ...companion.skills },
            baseAttributes: { ...companion.baseAttributes },
        }));
}

export function syncCompanionsFromBattle(state, battle = state.activeBattle) {
    if (!battle?.combatants) return [];
    const party = ensurePartyState(state);
    const synced = [];
    for (const combatant of battle.combatants.filter((entry) => entry.type === 'companion')) {
        const companion = party.companions[combatant.id];
        if (!companion) continue;
        companion.resources = { ...combatant.resources };
        companion.statuses = clonePlain(combatant.statuses ?? []);
        companion.locationId = state.currentPlaceId;
        syncBackingNpc(state, companion, party.activeCompanionIds.includes(companion.id));
        synced.push(snapshotCompanion(companion));
    }
    return synced;
}

export function describeParty(state) {
    const party = ensurePartyState(state);
    const recruited = Object.values(party.companions);
    if (!recruited.length) return 'No one has joined you on the road yet.';
    return [
        `Traveling with you: ${party.activeCompanionIds.length}`,
        ...recruited.map((companion) => {
            const definition = getCompanionDefinition(companion.id);
            const approach = getCompanionFieldApproach(companion.id, companion.tactics?.approachId);
            const company = party.activeCompanionIds.includes(companion.id) ? 'with you' : `staying at ${companion.locationId}`;
            return `- ${companion.identity.name}, ${companion.identity.title} — ${company}; HP ${companion.resources.hp}/${calculateCombatProfile(companion).resources.maxHp}; ${approach?.name ?? definition?.tactics?.role ?? 'ready for the road'}`;
        }),
    ].join('\n');
}

export function validatePartyState(party) {
    if (!party || typeof party !== 'object' || Array.isArray(party)) return ['party must be an object.'];
    const issues = [];
    if (party.version !== PARTY_STATE_VERSION) issues.push(`party.version must be ${PARTY_STATE_VERSION}.`);
    if (!Number.isInteger(party.capacity) || party.capacity < 1) issues.push('party.capacity must be positive.');
    if (!Array.isArray(party.activeCompanionIds)) return [...issues, 'party.activeCompanionIds must be an array.'];
    if (!party.companions || typeof party.companions !== 'object' || Array.isArray(party.companions)) return [...issues, 'party.companions must be an object.'];
    if (new Set(party.activeCompanionIds).size !== party.activeCompanionIds.length) issues.push('party.activeCompanionIds contains duplicates.');
    if (party.activeCompanionIds.length > party.capacity) issues.push('party.activeCompanionIds exceeds party capacity.');
    for (const companionId of party.activeCompanionIds) if (!party.companions[companionId]) issues.push(`Active companion ${companionId} is not recruited.`);
    for (const [id, companion] of Object.entries(party.companions)) {
        const definition = getCompanionDefinition(id);
        if (!definition) issues.push(`party.companions.${id} references unknown companion definition.`);
        if (!companion || typeof companion !== 'object' || Array.isArray(companion)) { issues.push(`party.companions.${id} must be an object.`); continue; }
        if (companion.id !== id) issues.push(`party.companions.${id}.id must match its key.`);
        if (definition && companion.npcId !== definition.npcId) issues.push(`party.companions.${id}.npcId does not match catalog.`);
        if (!Number.isInteger(companion.level) || companion.level < 1) issues.push(`party.companions.${id}.level must be positive.`);
        if (!companion.resources || !Number.isFinite(companion.resources.hp) || companion.resources.hp < 0) issues.push(`party.companions.${id}.resources.hp is invalid.`);
        if (!Array.isArray(companion.statuses)) issues.push(`party.companions.${id}.statuses must be an array.`);
        if (!companion.relationship || typeof companion.relationship !== 'object' || Array.isArray(companion.relationship)) issues.push(`party.companions.${id}.relationship must be an object.`);
        if (!companion.tactics || typeof companion.tactics !== 'object' || Array.isArray(companion.tactics)) issues.push(`party.companions.${id}.tactics must be an object.`);
        else if (definition && !getCompanionFieldApproach(id, companion.tactics.approachId)) issues.push(`party.companions.${id}.tactics.approachId must reference a field approach.`);
    }
    return issues;
}

export function listRecruitableCompanions(state) {
    return listCompanionDefinitions().map((definition) => {
        const result = canRecruitCompanion(state, definition.id);
        return Object.freeze({ definition, recruitable: result.ok, code: result.code, reason: result.display?.text ?? '' });
    });
}

function createPersistentCompanion(definition, locationId, joinedAtWorldSeconds) {
    const relationship = Object.fromEntries(definition.relationshipDimensions.map((dimension) => [dimension, 0]));
    const entity = {
        id: definition.id,
        npcId: definition.npcId,
        type: 'companion',
        identity: { name: definition.name, title: definition.title, family: 'person', faction: null },
        level: definition.level,
        baseAttributes: { ...definition.baseAttributes },
        skills: { ...definition.skills },
        equipment: {},
        statuses: [],
        resources: { hp: 0, mp: 0, tp: 0 },
        relationship,
        tactics: { ...definition.tactics, approachId: definition.tactics.defaultApproachId },
        homePlaceId: definition.homePlaceId,
        locationId,
        joinedAtWorldSeconds,
        flags: {},
    };
    const combat = calculateCombatProfile(entity);
    entity.resources = { hp: combat.resources.maxHp, mp: combat.resources.maxMp, tp: 0 };
    return entity;
}

function syncPartyNpcIdentity(state, party) {
    for (const companion of Object.values(party.companions)) {
        syncBackingNpc(state, companion, party.activeCompanionIds.includes(companion.id));
    }
}

function ensureBackingNpcRecord(state, definition) {
    state.npcs ??= [];
    let npc = state.npcs.find((entry) => entry.id === definition.npcId) ?? null;
    if (npc) return npc;
    npc = createNpc({
        id: definition.npcId,
        name: definition.name,
        title: definition.title,
        locationId: definition.homePlaceId,
        services: ['companion-recruitment'],
        flags: { companionId: definition.id, companionActive: false },
    });
    state.npcs.push(npc);
    return npc;
}

function syncBackingNpc(state, companion, active) {
    const definition = getCompanionDefinition(companion.id);
    if (!definition) return null;
    const npc = ensureBackingNpcRecord(state, definition);
    npc.identity.name = companion.identity.name;
    npc.identity.title = companion.identity.title;
    npc.identity.locationId = companion.locationId;
    npc.flags ??= {};
    npc.flags.companionId = companion.id;
    npc.flags.companionActive = Boolean(active);
    return npc;
}

function resolveDefinition(query) {
    return getCompanionDefinition(query) ?? findCompanionDefinition(query);
}
function blocked(code, data, text) {
    return actionFailure({ action: 'party', code, outcome: 'blocked', data, display: { text } });
}
function snapshotCompanion(companion) {
    return Object.freeze({
        ...companion,
        identity: Object.freeze({ ...companion.identity }),
        baseAttributes: Object.freeze({ ...companion.baseAttributes }),
        skills: Object.freeze({ ...companion.skills }),
        equipment: Object.freeze(clonePlain(companion.equipment)),
        statuses: Object.freeze(clonePlain(companion.statuses)),
        resources: Object.freeze({ ...companion.resources }),
        relationship: Object.freeze({ ...companion.relationship }),
        tactics: Object.freeze({ ...companion.tactics }),
        flags: Object.freeze({ ...companion.flags }),
    });
}
function cloneCompanionMap(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).map(([id, companion]) => [id, clonePlain(companion)]));
}
function clonePlain(value) {
    if (Array.isArray(value)) return value.map(clonePlain);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clonePlain(child)]));
}
