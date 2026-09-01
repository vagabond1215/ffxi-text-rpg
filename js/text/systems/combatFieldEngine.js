import { getAbility } from '../data/abilities.js';
import { resolveCombatPointRadiusTargets } from './combatGeometryEngine.js';
import { resolveCombatDamage } from './combatResolutionEngine.js';

export const COMBAT_FIELD_STATE_VERSION = 1;
export const COMBAT_FIELD_INTERRUPT_PRIORITY = 910;

export function createCombatFieldState() {
    return {
        version: COMBAT_FIELD_STATE_VERSION,
        sequence: 0,
        records: [],
    };
}

export function createCombatField(battle, definition = {}) {
    if (!battle || battle.phase !== 'active') return { ok: false, code: 'combat.field-battle-inactive', field: null };
    const state = ensureCombatFieldState(battle);
    const source = findCombatant(battle, definition.sourceActorId);
    const centerTarget = findCombatant(battle, definition.centerTargetId);
    const fieldDefinition = definition.fieldDefinition;
    if (!source || !centerTarget || !fieldDefinition) return { ok: false, code: 'combat.field-invalid-source', field: null };

    const pulseEffect = fieldDefinition.effect;
    const scalingStat = String(pulseEffect?.stat ?? 'int');
    const centerPosition = definition.centerPosition;
    if (!validPosition(centerPosition)) return { ok: false, code: 'combat.field-invalid-center', field: null };

    state.sequence += 1;
    const createdAtWorldSeconds = normalizeWorldSecond(definition.nowWorldSeconds);
    const durationSeconds = positiveInteger(fieldDefinition.durationSeconds) ? fieldDefinition.durationSeconds : 1;
    const pulseSeconds = positiveInteger(fieldDefinition.pulseSeconds) ? fieldDefinition.pulseSeconds : durationSeconds;
    const record = {
        id: `combat-field-${String(state.sequence).padStart(6, '0')}`,
        sourceActorId: source.id,
        sourceAbilityId: String(definition.sourceAbilityId ?? ''),
        centerTargetId: centerTarget.id,
        centerPosition: { x: Number(centerPosition.x), y: Number(centerPosition.y) },
        createdAtWorldSeconds,
        expiresAtWorldSeconds: createdAtWorldSeconds + durationSeconds,
        pulseSeconds,
        nextPulseAtWorldSeconds: createdAtWorldSeconds + pulseSeconds,
        pulseSequence: 0,
        geometry: {
            radius: Number(fieldDefinition.geometry?.radius) || 0,
            maximumTargets: Math.max(1, Math.floor(Number(fieldDefinition.geometry?.maximumTargets) || 1)),
        },
        sourceSnapshot: {
            scalingStat,
            scalingValue: number(source.combat?.attributes?.[scalingStat]),
            magicAccuracy: number(source.combat?.derived?.magicAccuracy),
            magicAttack: number(source.combat?.derived?.magicAttack),
        },
    };
    state.records.push(record);
    appendFieldLog(battle, `${String(definition.fieldName ?? 'A field')} settles into place.`);
    return { ok: true, code: 'combat.field-created', field: snapshotField(record) };
}

export function getCombatField(battle, fieldId) {
    return battle?.fields?.records?.find((record) => record.id === fieldId) ?? null;
}

export function provideCombatFieldInterrupts({ state, nowWorldSeconds, horizonWorldSeconds }) {
    const battle = state?.activeBattle;
    if (!battle || battle.phase !== 'active') return [];
    const fields = battle.fields?.records ?? [];
    return fields.map((field) => {
        if (!nonNegativeInteger(field.nextPulseAtWorldSeconds) || !nonNegativeInteger(field.expiresAtWorldSeconds)) return null;
        if (field.nextPulseAtWorldSeconds > field.expiresAtWorldSeconds) return null;
        const atWorldSeconds = Math.max(nowWorldSeconds, field.nextPulseAtWorldSeconds);
        if (atWorldSeconds > horizonWorldSeconds) return null;
        return {
            id: `combat-field-pulse:${field.id}:${field.pulseSequence + 1}:${field.nextPulseAtWorldSeconds}`,
            type: 'combat.field-pulse',
            atWorldSeconds,
            priority: COMBAT_FIELD_INTERRUPT_PRIORITY,
            source: 'combatFieldEngine',
            data: {
                battleId: battle.id ?? null,
                fieldId: field.id,
                sourceAbilityId: field.sourceAbilityId,
                scheduledAtWorldSeconds: field.nextPulseAtWorldSeconds,
                pulseSequence: field.pulseSequence + 1,
            },
        };
    }).filter(Boolean);
}

export function resolveCombatFieldPulse(battle, fieldId, options = {}) {
    const field = getCombatField(battle, fieldId);
    if (!battle || battle.phase !== 'active' || !field) return { ok: false, code: 'combat.field-unavailable', fieldId, effects: [] };

    const nowWorldSeconds = normalizeWorldSecond(options.nowWorldSeconds);
    if (nowWorldSeconds < field.nextPulseAtWorldSeconds) {
        return {
            ok: false,
            code: 'combat.field-not-due',
            fieldId,
            nextPulseAtWorldSeconds: field.nextPulseAtWorldSeconds,
            effects: [],
        };
    }

    const source = findCombatant(battle, field.sourceActorId);
    const ability = getAbility(field.sourceAbilityId);
    const fieldDefinition = ability?.effects?.find((effect) => effect.type === 'field')?.field ?? null;
    const pulseEffect = fieldDefinition?.effect ?? null;
    if (!source || !pulseEffect) return { ok: false, code: 'combat.field-definition-missing', fieldId, effects: [] };

    const targets = resolveCombatPointRadiusTargets(battle, {
        actorId: field.sourceActorId,
        centerPosition: field.centerPosition,
        radius: field.geometry.radius,
        maximumTargets: field.geometry.maximumTargets,
    });
    const attacker = snapshotAttacker(field);
    const effects = [];

    for (const recipient of targets.targets) {
        const resolution = resolveCombatDamage(attacker, recipient, pulseEffect, { rng: options.rng ?? battle.rng ?? Math.random });
        if (!resolution.hit) {
            appendFieldLog(battle, `${recipient.identity?.name ?? 'The target'} avoids ${ability.name}'s pulse.`);
            effects.push({
                type: 'damage',
                applied: false,
                reason: 'miss',
                recipientId: recipient.id ?? null,
                amount: 0,
                resolution,
            });
            continue;
        }

        const before = Math.max(0, Number(recipient.resources?.hp) || 0);
        recipient.resources.hp = Math.max(0, before - resolution.damage);
        if (recipient.resources.hp <= 0 && recipient.battle) recipient.battle.defeated = true;
        appendFieldLog(battle, `${ability.name} pulses for ${resolution.damage} damage to ${recipient.identity?.name ?? 'the target'}.`);
        effects.push({
            type: 'damage',
            applied: true,
            recipientId: recipient.id ?? null,
            amount: resolution.damage,
            before,
            after: recipient.resources.hp,
            resolution,
        });
    }

    const scheduledAtWorldSeconds = field.nextPulseAtWorldSeconds;
    field.pulseSequence += 1;
    field.nextPulseAtWorldSeconds += field.pulseSeconds;
    const ended = field.nextPulseAtWorldSeconds > field.expiresAtWorldSeconds;
    const fieldSnapshot = snapshotField(field);
    if (ended) {
        battle.fields.records = battle.fields.records.filter((record) => record.id !== field.id);
        appendFieldLog(battle, `${ability.name} dissipates.`);
    }

    return {
        ok: true,
        code: 'combat.field-pulse-resolved',
        fieldId: field.id,
        sourceActorId: field.sourceActorId,
        sourceAbilityId: field.sourceAbilityId,
        centerTargetId: field.centerTargetId,
        scheduledAtWorldSeconds,
        resolvedAtWorldSeconds: nowWorldSeconds,
        pulseSequence: field.pulseSequence,
        geometry: targets.evidence,
        effects,
        ended,
        field: fieldSnapshot,
    };
}

export function reconcileCombatFields(battle) {
    if (!battle?.fields || !Array.isArray(battle.fields.records)) return [];
    if (battle.phase !== 'active') {
        const removed = battle.fields.records.map((field) => field.id);
        battle.fields.records = [];
        return removed;
    }

    const removed = [];
    battle.fields.records = battle.fields.records.filter((field) => {
        const exhausted = nonNegativeInteger(field.nextPulseAtWorldSeconds)
            && nonNegativeInteger(field.expiresAtWorldSeconds)
            && field.nextPulseAtWorldSeconds > field.expiresAtWorldSeconds;
        if (exhausted) removed.push(field.id);
        return !exhausted;
    });
    return removed;
}

export function validateBattleFieldState(battle) {
    const issues = [];
    const state = battle?.fields;
    if (!isObject(state)) return ['fields must be an object.'];
    if (state.version !== COMBAT_FIELD_STATE_VERSION) issues.push(`fields.version must be ${COMBAT_FIELD_STATE_VERSION}.`);
    if (!nonNegativeInteger(state.sequence)) issues.push('fields.sequence must be a non-negative integer.');
    if (!Array.isArray(state.records)) return [...issues, 'fields.records must be an array.'];

    const combatantIds = new Set((battle.combatants ?? []).map((combatant) => combatant.id));
    const ids = new Set();
    let maxSequence = 0;

    for (const [index, field] of state.records.entries()) {
        const path = `fields.records[${index}]`;
        if (!isObject(field)) {
            issues.push(`${path} must be an object.`);
            continue;
        }
        const idMatch = /^combat-field-(\d{6,})$/.exec(field.id ?? '');
        if (!idMatch) issues.push(`${path}.id is invalid.`);
        else maxSequence = Math.max(maxSequence, Number(idMatch[1]));
        if (ids.has(field.id)) issues.push(`${path}.id duplicates ${field.id}.`);
        ids.add(field.id);

        if (!combatantIds.has(field.sourceActorId)) issues.push(`${path}.sourceActorId must reference a combatant.`);
        if (!combatantIds.has(field.centerTargetId)) issues.push(`${path}.centerTargetId must reference a combatant.`);
        if (!validPosition(field.centerPosition)) issues.push(`${path}.centerPosition must be finite x/y coordinates.`);

        const ability = getAbility(field.sourceAbilityId);
        const definition = ability?.effects?.find((effect) => effect.type === 'field')?.field ?? null;
        if (!ability || !definition) issues.push(`${path}.sourceAbilityId must reference an ability with a field effect.`);

        if (!nonNegativeInteger(field.createdAtWorldSeconds)) issues.push(`${path}.createdAtWorldSeconds must be a non-negative integer.`);
        if (!nonNegativeInteger(field.expiresAtWorldSeconds) || field.expiresAtWorldSeconds <= field.createdAtWorldSeconds) issues.push(`${path}.expiresAtWorldSeconds must be after creation.`);
        if (!positiveInteger(field.pulseSeconds)) issues.push(`${path}.pulseSeconds must be a positive integer.`);
        if (!nonNegativeInteger(field.nextPulseAtWorldSeconds) || field.nextPulseAtWorldSeconds <= field.createdAtWorldSeconds || field.nextPulseAtWorldSeconds > field.expiresAtWorldSeconds) issues.push(`${path}.nextPulseAtWorldSeconds must be an outstanding pulse deadline inside the field lifetime.`);
        if (!nonNegativeInteger(field.pulseSequence)) issues.push(`${path}.pulseSequence must be a non-negative integer.`);

        if (!isObject(field.geometry)) issues.push(`${path}.geometry must be an object.`);
        else {
            if (!(Number(field.geometry.radius) > 0)) issues.push(`${path}.geometry.radius must be positive.`);
            if (!positiveInteger(field.geometry.maximumTargets)) issues.push(`${path}.geometry.maximumTargets must be a positive integer.`);
        }

        if (!isObject(field.sourceSnapshot)) issues.push(`${path}.sourceSnapshot must be an object.`);
        else {
            if (typeof field.sourceSnapshot.scalingStat !== 'string' || !field.sourceSnapshot.scalingStat) issues.push(`${path}.sourceSnapshot.scalingStat is required.`);
            for (const key of ['scalingValue', 'magicAccuracy', 'magicAttack']) {
                if (!Number.isFinite(Number(field.sourceSnapshot[key]))) issues.push(`${path}.sourceSnapshot.${key} must be finite.`);
            }
        }

        if (definition) {
            if (field.pulseSeconds !== definition.pulseSeconds) issues.push(`${path}.pulseSeconds must match the authored field cadence.`);
            if (field.expiresAtWorldSeconds - field.createdAtWorldSeconds !== definition.durationSeconds) issues.push(`${path} lifetime must match the authored field duration.`);
            if (Number(field.geometry?.radius) !== Number(definition.geometry?.radius)) issues.push(`${path}.geometry.radius must match the authored field radius.`);
            if (field.geometry?.maximumTargets !== definition.geometry?.maximumTargets) issues.push(`${path}.geometry.maximumTargets must match the authored field cap.`);
            if (field.sourceSnapshot?.scalingStat !== definition.effect?.stat) issues.push(`${path}.sourceSnapshot.scalingStat must match the authored pulse scaling stat.`);
        }
    }

    if (nonNegativeInteger(state.sequence) && state.sequence < maxSequence) issues.push('fields.sequence must be at least the greatest stored field id sequence.');
    return issues;
}

function snapshotAttacker(field) {
    return {
        id: field.sourceActorId,
        combat: {
            attributes: {
                [field.sourceSnapshot.scalingStat]: field.sourceSnapshot.scalingValue,
            },
            derived: {
                magicAccuracy: field.sourceSnapshot.magicAccuracy,
                magicAttack: field.sourceSnapshot.magicAttack,
            },
        },
    };
}

function snapshotField(field) {
    return Object.freeze({
        ...field,
        centerPosition: Object.freeze({ ...field.centerPosition }),
        geometry: Object.freeze({ ...field.geometry }),
        sourceSnapshot: Object.freeze({ ...field.sourceSnapshot }),
    });
}

function ensureCombatFieldState(battle) {
    if (!isObject(battle.fields) || battle.fields.version !== COMBAT_FIELD_STATE_VERSION || !Array.isArray(battle.fields.records)) {
        battle.fields = createCombatFieldState();
    }
    return battle.fields;
}

function findCombatant(battle, actorId) {
    return (battle?.combatants ?? []).find((combatant) => combatant.id === actorId) ?? null;
}

function appendFieldLog(battle, entry) {
    battle.log ??= [];
    battle.log.push(entry);
    if (battle.log.length > 100) battle.log.splice(0, battle.log.length - 100);
}

function validPosition(value) {
    return isObject(value) && Number.isFinite(Number(value.x)) && Number.isFinite(Number(value.y));
}
function normalizeWorldSecond(value) { return Math.max(0, Math.floor(Number(value) || 0)); }
function number(value) { const result = Number(value); return Number.isFinite(result) ? result : 0; }
function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function isObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
