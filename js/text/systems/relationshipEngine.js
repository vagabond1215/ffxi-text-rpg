import { SOCIAL_RELATIONSHIP_DIMENSIONS } from '../data/socialRequirements.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const RELATIONSHIP_STATE_VERSION = 1;
export const RELATIONSHIP_DIMENSIONS = SOCIAL_RELATIONSHIP_DIMENSIONS;

export function createRelationshipState(options = {}) {
    return {
        version: RELATIONSHIP_STATE_VERSION,
        npcs: cloneRecords(options.npcs),
    };
}

export function ensureRelationshipState(state) {
    if (!state || typeof state !== 'object') throw new Error('Relationship state requires game state.');
    if (!state.relationships || typeof state.relationships !== 'object' || Array.isArray(state.relationships)) {
        state.relationships = createRelationshipState();
    }
    const issues = validateRelationshipState(state.relationships);
    if (issues.length) throw new Error(issues.join(' '));
    return state.relationships;
}

export function getNpcRelationship(state, npcId, options = {}) {
    const relationships = ensureRelationshipState(state);
    const key = String(npcId ?? '').trim();
    if (!key) return null;
    if (!relationships.npcs[key] && options.create) relationships.npcs[key] = createNpcRelationshipRecord(key);
    return relationships.npcs[key] ?? null;
}

export function applyNpcRelationshipChange(state, npcId, requestedDeltas = {}, options = {}) {
    const key = String(npcId ?? '').trim();
    const npc = (state.npcs ?? []).find((entry) => entry.id === key);
    if (!npc) {
        return actionFailure({
            action: 'relationship.change',
            code: 'relationship.unknown-npc',
            outcome: 'blocked',
            data: { npcId: key },
            display: { text: `Unknown persistent NPC: ${key || 'unspecified'}.` },
        });
    }

    const deltas = normalizeDeltas(requestedDeltas);
    if (!Object.keys(deltas).length) {
        return actionFailure({
            action: 'relationship.change',
            code: 'relationship.no-change',
            outcome: 'rejected',
            data: { npcId: key },
            display: { text: 'No valid relationship change was supplied.' },
        });
    }

    const record = getNpcRelationship(state, key, { create: true });
    const before = { ...record.dimensions };
    for (const [dimension, delta] of Object.entries(deltas)) record.dimensions[dimension] += delta;
    record.lastInteractionWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const after = { ...record.dimensions };
    const event = emitSemanticEvent(state, 'relationship.changed', {
        npcId: key,
        npcName: npc.identity?.name ?? key,
        deltas,
        before,
        after,
        reason: String(options.reason ?? '').trim() || null,
        sourceId: options.sourceId ?? null,
    }, { source: options.source ?? 'relationshipEngine' });

    return actionSuccess({
        action: 'relationship.change',
        code: 'relationship.changed',
        outcome: 'changed',
        data: { npcId: key, deltas, before, after, eventId: event.id },
        display: { text: `${npc.identity?.name ?? key}: relationship changed (${describeDeltas(deltas)}).` },
    });
}

export function validateRelationshipState(relationships) {
    if (!relationships || typeof relationships !== 'object' || Array.isArray(relationships)) return ['relationships must be an object.'];
    const issues = [];
    if (relationships.version !== RELATIONSHIP_STATE_VERSION) issues.push(`relationships.version must be ${RELATIONSHIP_STATE_VERSION}.`);
    if (!relationships.npcs || typeof relationships.npcs !== 'object' || Array.isArray(relationships.npcs)) {
        issues.push('relationships.npcs must be an object.');
        return issues;
    }
    for (const [npcId, record] of Object.entries(relationships.npcs)) {
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            issues.push(`relationships.npcs.${npcId} must be an object.`);
            continue;
        }
        if (record.npcId !== npcId) issues.push(`relationships.npcs.${npcId}.npcId must match its key.`);
        if (!record.dimensions || typeof record.dimensions !== 'object' || Array.isArray(record.dimensions)) {
            issues.push(`relationships.npcs.${npcId}.dimensions must be an object.`);
            continue;
        }
        for (const dimension of RELATIONSHIP_DIMENSIONS) {
            if (!Number.isInteger(record.dimensions[dimension])) issues.push(`relationships.npcs.${npcId}.dimensions.${dimension} must be an integer.`);
        }
        if (record.lastInteractionWorldSeconds !== null && (!Number.isInteger(record.lastInteractionWorldSeconds) || record.lastInteractionWorldSeconds < 0)) {
            issues.push(`relationships.npcs.${npcId}.lastInteractionWorldSeconds must be null or a non-negative integer.`);
        }
    }
    return issues;
}

function createNpcRelationshipRecord(npcId) {
    return {
        npcId,
        dimensions: Object.fromEntries(RELATIONSHIP_DIMENSIONS.map((dimension) => [dimension, 0])),
        lastInteractionWorldSeconds: null,
    };
}

function normalizeDeltas(requested) {
    const deltas = {};
    for (const dimension of RELATIONSHIP_DIMENSIONS) {
        const value = requested?.[dimension];
        if (Number.isInteger(value) && value !== 0) deltas[dimension] = value;
    }
    return deltas;
}

function describeDeltas(deltas) {
    return Object.entries(deltas).map(([dimension, delta]) => `${dimension} ${delta > 0 ? '+' : ''}${delta}`).join(', ');
}

function cloneRecords(records) {
    if (!records || typeof records !== 'object' || Array.isArray(records)) return {};
    return Object.fromEntries(Object.entries(records).map(([npcId, record]) => [npcId, {
        npcId,
        dimensions: Object.fromEntries(RELATIONSHIP_DIMENSIONS.map((dimension) => [dimension, Number.isInteger(record?.dimensions?.[dimension]) ? record.dimensions[dimension] : 0])),
        lastInteractionWorldSeconds: Number.isInteger(record?.lastInteractionWorldSeconds) ? record.lastInteractionWorldSeconds : null,
    }]));
}
