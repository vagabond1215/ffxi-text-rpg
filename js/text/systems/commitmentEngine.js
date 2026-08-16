import { getCommitmentDefinition } from '../data/commitments.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { removeItemQuantityFromContainer } from './inventoryEngine.js';
import { applyNpcRelationshipChange, ensureRelationshipState } from './relationshipEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { ensureWorldTimeState, SECONDS_PER_DAY } from './worldTimeEngine.js';

export const COMMITMENT_STATE_VERSION = 1;
export const COMMITMENT_STATUSES = Object.freeze({ ACTIVE: 'active', RESOLVED: 'resolved' });

export function createCommitmentState(options = {}) {
    return {
        version: COMMITMENT_STATE_VERSION,
        records: cloneRecords(options.records),
    };
}

export function ensureCommitmentState(state) {
    if (!state || typeof state !== 'object') throw new Error('Commitment state requires game state.');
    if (!state.commitments || typeof state.commitments !== 'object' || Array.isArray(state.commitments)) {
        state.commitments = createCommitmentState();
    }
    const issues = validateCommitmentState(state.commitments);
    if (issues.length) throw new Error(issues.join(' '));
    return state.commitments;
}

export function getCommitmentRecord(state, commitmentId) {
    return ensureCommitmentState(state).records[String(commitmentId ?? '').trim()] ?? null;
}

export function acceptCommitment(state, commitmentId) {
    const definition = getCommitmentDefinition(commitmentId);
    if (!definition) return failure('commitment.accept', 'commitment.unknown', `Unknown commitment: ${commitmentId}`);
    const commitments = ensureCommitmentState(state);
    ensureRelationshipState(state);
    const existing = commitments.records[definition.id];
    if (existing) {
        return actionSuccess({
            action: 'commitment.accept',
            code: existing.status === COMMITMENT_STATUSES.RESOLVED ? 'commitment.already-resolved' : 'commitment.already-active',
            outcome: 'unchanged',
            data: { commitmentId: definition.id, status: existing.status },
            display: { text: existing.status === COMMITMENT_STATUSES.RESOLVED ? `${definition.name} is already resolved.` : `${definition.name} is already active.` },
        });
    }
    const placeCheck = checkGiverContext(state, definition);
    if (!placeCheck.ok) return placeCheck;

    const now = ensureWorldTimeState(state).totalSeconds;
    const record = {
        id: definition.id,
        giverNpcId: definition.giverNpcId,
        status: COMMITMENT_STATUSES.ACTIVE,
        acceptedAtWorldSeconds: now,
        resolvedAtWorldSeconds: null,
        resolvedDay: null,
        rewardClaimed: false,
        followUpAvailableDay: null,
        followUpSeenAtWorldSeconds: null,
    };
    commitments.records[definition.id] = record;
    const event = emitSemanticEvent(state, 'commitment.accepted', {
        commitmentId: definition.id,
        giverNpcId: definition.giverNpcId,
        offerPlaceId: definition.offerPlaceId,
    }, { source: 'commitmentEngine' });

    return actionSuccess({
        action: 'commitment.accept',
        code: 'commitment.accepted',
        outcome: 'accepted',
        data: { commitmentId: definition.id, eventId: event.id, record },
        display: { text: `${definition.name}\n${definition.offerText}\nObjective: ${definition.objective}` },
    });
}

export function checkCommitmentRequirements(state, commitmentId) {
    const definition = getCommitmentDefinition(commitmentId);
    if (!definition) return { ok: false, blockers: [`Unknown commitment: ${commitmentId}`], definition: null };
    const record = getCommitmentRecord(state, definition.id);
    const blockers = [];
    if (!record) blockers.push('Commitment has not been accepted.');
    else if (record.status === COMMITMENT_STATUSES.RESOLVED) blockers.push('Commitment is already resolved.');
    if (state.currentPlaceId !== definition.offerPlaceId) blockers.push(`Return to ${definition.offerPlaceId}.`);
    if (!(state.npcs ?? []).some((npc) => npc.id === definition.giverNpcId && npc.identity?.locationId === definition.offerPlaceId)) {
        blockers.push(`Persistent giver ${definition.giverNpcId} is not present.`);
    }
    for (const requirement of definition.requiredItems) {
        const available = qualifyingItemQuantity(state, requirement);
        if (available < requirement.quantity) blockers.push(`Requires ${requirement.quantity} ${requirement.itemId} with source ${requirement.provenanceSourceId ?? 'any'}.`);
    }
    return { ok: blockers.length === 0, blockers, definition, record };
}

export function resolveCommitment(state, commitmentId) {
    const check = checkCommitmentRequirements(state, commitmentId);
    if (!check.definition) return failure('commitment.resolve', 'commitment.unknown', check.blockers[0]);
    if (check.record?.status === COMMITMENT_STATUSES.RESOLVED) {
        return actionSuccess({
            action: 'commitment.resolve',
            code: 'commitment.already-resolved',
            outcome: 'unchanged',
            data: { commitmentId: check.definition.id },
            display: { text: `${check.definition.name} is already resolved; its reward cannot be claimed again.` },
        });
    }
    if (!check.ok) {
        return actionFailure({
            action: 'commitment.resolve',
            code: 'commitment.requirements-unmet',
            outcome: 'blocked',
            data: { commitmentId: check.definition.id, blockers: check.blockers },
            display: { text: check.blockers.join(' ') },
        });
    }

    const definition = check.definition;
    const record = check.record;
    // All requirements are prevalidated before any mutation. This first slice has one
    // canonical production source per required item, so exact ID removal is provenance-safe.
    const removed = [];
    for (const requirement of definition.requiredItems) {
        const result = removeItemQuantityFromContainer(state.player.inventoryState, 'inventory', requirement.itemId, requirement.quantity);
        if (!result.ok) {
            // Prevalidation and single-threaded state mutation should make this unreachable.
            // Restore anything removed earlier before returning a deterministic failure.
            for (const item of removed) state.player.inventoryState.containers.inventory.items.push(item);
            return failure('commitment.resolve', 'commitment.delivery-failed', result.reason);
        }
        removed.push(result.item);
    }

    const now = ensureWorldTimeState(state).totalSeconds;
    const resolvedDay = dayNumber(now);
    state.player.wallet.gil += definition.reward.gil;
    const relationshipResult = applyNpcRelationshipChange(state, definition.giverNpcId, definition.reward.relationship, {
        reason: `Resolved ${definition.id}`,
        sourceId: definition.id,
        source: 'commitmentEngine',
    });
    if (!relationshipResult.ok) throw new Error(relationshipResult.display?.text ?? relationshipResult.reason ?? 'Relationship resolution failed.');

    record.status = COMMITMENT_STATUSES.RESOLVED;
    record.resolvedAtWorldSeconds = now;
    record.resolvedDay = resolvedDay;
    record.rewardClaimed = true;
    record.followUpAvailableDay = resolvedDay + definition.followUpDelayDays;
    const event = emitSemanticEvent(state, 'commitment.resolved', {
        commitmentId: definition.id,
        giverNpcId: definition.giverNpcId,
        deliveredItems: removed.map((item) => ({ itemId: item.id, quantity: item.quantity, provenance: item.provenance })),
        gilReward: definition.reward.gil,
        relationshipDeltas: { ...definition.reward.relationship },
        resolvedDay,
        followUpAvailableDay: record.followUpAvailableDay,
    }, { source: 'commitmentEngine' });

    return actionSuccess({
        action: 'commitment.resolve',
        code: 'commitment.resolved',
        outcome: 'resolved',
        data: {
            commitmentId: definition.id,
            gilReward: definition.reward.gil,
            relationship: relationshipResult.data,
            eventId: event.id,
            followUpAvailableDay: record.followUpAvailableDay,
        },
        display: { text: `${definition.resolvedText}\nReward: ${definition.reward.gil} gil. ${relationshipResult.display.text}` },
    });
}

export function isCommitmentFollowUpAvailable(state, commitmentId) {
    const definition = getCommitmentDefinition(commitmentId);
    const record = definition ? getCommitmentRecord(state, definition.id) : null;
    if (!definition || !record || record.status !== COMMITMENT_STATUSES.RESOLVED || record.followUpSeenAtWorldSeconds !== null) return false;
    return dayNumber(ensureWorldTimeState(state).totalSeconds) >= record.followUpAvailableDay;
}

export function performCommitmentFollowUp(state, commitmentId) {
    const definition = getCommitmentDefinition(commitmentId);
    if (!definition) return failure('commitment.followUp', 'commitment.unknown', `Unknown commitment: ${commitmentId}`);
    const record = getCommitmentRecord(state, definition.id);
    if (!record || record.status !== COMMITMENT_STATUSES.RESOLVED) return failure('commitment.followUp', 'commitment.unresolved', `${definition.name} must be resolved first.`);
    if (record.followUpSeenAtWorldSeconds !== null) {
        return actionSuccess({
            action: 'commitment.followUp',
            code: 'commitment.followup-already-seen',
            outcome: 'unchanged',
            data: { commitmentId: definition.id },
            display: { text: definition.followUpText },
        });
    }
    if (!isCommitmentFollowUpAvailable(state, definition.id)) return failure('commitment.followUp', 'commitment.followup-too-early', 'Varric has no new follow-up yet; return on a later fictional day.');
    const placeCheck = checkGiverContext(state, definition);
    if (!placeCheck.ok) return placeCheck;

    const relationshipResult = applyNpcRelationshipChange(state, definition.giverNpcId, { familiarity: 1 }, {
        reason: `Follow-up after ${definition.id}`,
        sourceId: definition.id,
        source: 'commitmentEngine',
    });
    if (!relationshipResult.ok) return relationshipResult;
    record.followUpSeenAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    const event = emitSemanticEvent(state, 'commitment.followup-viewed', {
        commitmentId: definition.id,
        giverNpcId: definition.giverNpcId,
        relationshipDeltas: { familiarity: 1 },
    }, { source: 'commitmentEngine' });
    return actionSuccess({
        action: 'commitment.followUp',
        code: 'commitment.followup-viewed',
        outcome: 'continued',
        data: { commitmentId: definition.id, eventId: event.id, relationship: relationshipResult.data },
        display: { text: definition.followUpText },
    });
}

export function validateCommitmentState(commitments) {
    if (!commitments || typeof commitments !== 'object' || Array.isArray(commitments)) return ['commitments must be an object.'];
    const issues = [];
    if (commitments.version !== COMMITMENT_STATE_VERSION) issues.push(`commitments.version must be ${COMMITMENT_STATE_VERSION}.`);
    if (!commitments.records || typeof commitments.records !== 'object' || Array.isArray(commitments.records)) {
        issues.push('commitments.records must be an object.');
        return issues;
    }
    for (const [commitmentId, record] of Object.entries(commitments.records)) {
        if (!getCommitmentDefinition(commitmentId)) issues.push(`commitments.records.${commitmentId} references unknown commitment.`);
        if (!record || typeof record !== 'object' || Array.isArray(record)) {
            issues.push(`commitments.records.${commitmentId} must be an object.`);
            continue;
        }
        if (record.id !== commitmentId) issues.push(`commitments.records.${commitmentId}.id must match its key.`);
        if (![COMMITMENT_STATUSES.ACTIVE, COMMITMENT_STATUSES.RESOLVED].includes(record.status)) issues.push(`commitments.records.${commitmentId}.status is invalid.`);
        if (!nonNegativeInteger(record.acceptedAtWorldSeconds)) issues.push(`commitments.records.${commitmentId}.acceptedAtWorldSeconds must be non-negative.`);
        if (record.status === COMMITMENT_STATUSES.RESOLVED) {
            if (!nonNegativeInteger(record.resolvedAtWorldSeconds)) issues.push(`commitments.records.${commitmentId}.resolvedAtWorldSeconds must be non-negative when resolved.`);
            if (!positiveInteger(record.resolvedDay)) issues.push(`commitments.records.${commitmentId}.resolvedDay must be positive when resolved.`);
            if (record.rewardClaimed !== true) issues.push(`commitments.records.${commitmentId}.rewardClaimed must be true when resolved.`);
            if (!positiveInteger(record.followUpAvailableDay)) issues.push(`commitments.records.${commitmentId}.followUpAvailableDay must be positive when resolved.`);
        }
        if (record.followUpSeenAtWorldSeconds !== null && !nonNegativeInteger(record.followUpSeenAtWorldSeconds)) issues.push(`commitments.records.${commitmentId}.followUpSeenAtWorldSeconds must be null or non-negative.`);
    }
    return issues;
}

function checkGiverContext(state, definition) {
    if (state.currentPlaceId !== definition.offerPlaceId) return failure('commitment.context', 'commitment.wrong-place', `Return to ${definition.offerPlaceId} to speak with the commitment giver.`);
    const giver = (state.npcs ?? []).find((npc) => npc.id === definition.giverNpcId && npc.identity?.locationId === definition.offerPlaceId);
    if (!giver) return failure('commitment.context', 'commitment.giver-absent', `Persistent giver ${definition.giverNpcId} is not present.`);
    return { ok: true, giver };
}

function qualifyingItemQuantity(state, requirement) {
    return (state.player?.inventoryState?.containers?.inventory?.items ?? [])
        .filter((item) => (item.id === requirement.itemId || item.templateId === requirement.itemId) && hasRequiredProvenance(item, requirement.provenanceSourceId))
        .reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
}

function hasRequiredProvenance(item, sourceId) {
    if (!sourceId) return true;
    return Array.isArray(item.provenance) && item.provenance.some((entry) => entry.sourceId === sourceId);
}

function dayNumber(totalSeconds) {
    return Math.floor(Math.max(0, Number(totalSeconds) || 0) / SECONDS_PER_DAY) + 1;
}

function cloneRecords(records) {
    if (!records || typeof records !== 'object' || Array.isArray(records)) return {};
    return Object.fromEntries(Object.entries(records).map(([id, record]) => [id, { ...record, id }]));
}

function failure(action, code, text) {
    return actionFailure({ action, code, outcome: 'blocked', display: { text } });
}

function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
