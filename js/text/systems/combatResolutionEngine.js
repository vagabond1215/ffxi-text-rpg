import { ELEMENT_KEYS } from '../data/systemConstants.js';
import { rollPercent } from './rng.js';

export const COMBAT_RESOLUTION_VERSION = 1;
export const COMBAT_DELIVERIES = Object.freeze(['melee', 'projectile', 'spell', 'sigil', 'contact']);
export const COMBAT_CHANNELS = Object.freeze(['physical', 'magical', 'hybrid']);
export const COMBAT_ACCURACY_MODELS = Object.freeze(['physical', 'ranged', 'magic', 'automatic']);
export const COMBAT_RESISTANCE_MODELS = Object.freeze(['physicalDefense', 'magicDefense', 'magicEvasion', 'none']);

export function normalizeCombatResolution(definition = {}) {
    const element = ELEMENT_KEYS.includes(definition.element) ? definition.element : null;
    return Object.freeze({
        version: COMBAT_RESOLUTION_VERSION,
        delivery: COMBAT_DELIVERIES.includes(definition.delivery) ? definition.delivery : 'contact',
        channel: COMBAT_CHANNELS.includes(definition.channel) ? definition.channel : 'physical',
        damageType: definition.damageType ? String(definition.damageType) : null,
        element,
        elementSource: element ? String(definition.elementSource ?? 'ability') : null,
        accuracyModel: COMBAT_ACCURACY_MODELS.includes(definition.accuracyModel) ? definition.accuracyModel : 'physical',
        accuracyModifier: number(definition.accuracyModifier),
        resistanceModel: COMBAT_RESISTANCE_MODELS.includes(definition.resistanceModel) ? definition.resistanceModel : 'physicalDefense',
        defensePenetration: clamp(number(definition.defensePenetration), 0, 0.9),
        flatPenetration: Math.max(0, number(definition.flatPenetration)),
        criticalEligible: definition.criticalEligible === true,
        criticalRateModifier: number(definition.criticalRateModifier),
        criticalBonusPercent: Math.max(0, number(definition.criticalBonusPercent)),
    });
}

export function resolveCombatDamage(attacker, defender, effect = {}, options = {}) {
    const spec = normalizeCombatResolution(effect.resolution ?? effect);
    const rng = options.rng ?? Math.random;
    const accuracy = resolveAccuracy(attacker, defender, spec, rng);
    if (!accuracy.hit) {
        return Object.freeze({
            ok: true,
            outcome: 'miss',
            hit: false,
            damage: 0,
            critical: false,
            accuracy,
            defense: describeDefense(defender, spec),
            element: describeElement(defender, spec),
            contract: spec,
        });
    }

    const scalingStat = String(effect.stat ?? options.scalingStat ?? 'str');
    const scaleValue = number(attacker?.combat?.attributes?.[scalingStat]);
    const base = Math.max(0, number(effect.base ?? options.base));
    const coefficient = Math.max(0, number(effect.coefficient ?? options.coefficient ?? 1));
    const potency = Math.max(0, base + scaleValue * coefficient);
    const defense = describeDefense(defender, spec);
    const element = describeElement(defender, spec);

    let multiplier = 1;
    if (spec.resistanceModel === 'physicalDefense') {
        const attackStat = spec.accuracyModel === 'ranged' ? 'rangedAttack' : 'attack';
        const attack = Math.max(1, number(attacker?.combat?.derived?.[attackStat]));
        multiplier *= attack / Math.max(1, defense.effective);
    } else if (spec.resistanceModel === 'magicDefense') {
        const magicAttack = number(attacker?.combat?.derived?.magicAttack);
        const magicDefense = number(defender?.combat?.derived?.magicDefense);
        multiplier *= clamp(1 + (magicAttack - magicDefense) / 100, 0.5, 1.5);
    }

    multiplier *= element.multiplier;

    const variance = spec.channel === 'physical' || spec.channel === 'hybrid'
        ? 0.9 + rng() * 0.2
        : 1;

    const critical = resolveCritical(attacker, spec, rng);
    if (critical.critical) multiplier *= critical.multiplier;

    const damage = Math.max(potency > 0 ? 1 : 0, Math.floor(potency * multiplier * variance));
    return Object.freeze({
        ok: true,
        outcome: 'hit',
        hit: true,
        damage,
        critical: critical.critical,
        potency,
        multiplier,
        variance,
        accuracy,
        defense,
        element,
        criticalDetail: critical,
        contract: spec,
    });
}

export function resolveCombatStatus(attacker, defender, resolution = {}, options = {}) {
    const spec = normalizeCombatResolution(resolution);
    const rng = options.rng ?? Math.random;
    const accuracy = resolveAccuracy(attacker, defender, spec, rng);
    return Object.freeze({
        ok: true,
        outcome: accuracy.hit ? 'landed' : 'resisted',
        landed: accuracy.hit,
        accuracy,
        element: describeElement(defender, spec),
        contract: spec,
    });
}

export function validateCombatResolutionDefinition(definition = {}) {
    const issues = [];
    if (!definition || typeof definition !== 'object' || Array.isArray(definition)) return ['resolution must be an object.'];
    if (definition.version !== undefined && definition.version !== COMBAT_RESOLUTION_VERSION) issues.push(`resolution.version must be ${COMBAT_RESOLUTION_VERSION}.`);
    if (definition.delivery !== undefined && !COMBAT_DELIVERIES.includes(definition.delivery)) issues.push(`resolution.delivery is invalid: ${definition.delivery}.`);
    if (definition.channel !== undefined && !COMBAT_CHANNELS.includes(definition.channel)) issues.push(`resolution.channel is invalid: ${definition.channel}.`);
    if (definition.element !== undefined && definition.element !== null && !ELEMENT_KEYS.includes(definition.element)) issues.push(`resolution.element is invalid: ${definition.element}.`);
    if (definition.accuracyModel !== undefined && !COMBAT_ACCURACY_MODELS.includes(definition.accuracyModel)) issues.push(`resolution.accuracyModel is invalid: ${definition.accuracyModel}.`);
    if (definition.resistanceModel !== undefined && !COMBAT_RESISTANCE_MODELS.includes(definition.resistanceModel)) issues.push(`resolution.resistanceModel is invalid: ${definition.resistanceModel}.`);
    if (definition.defensePenetration !== undefined && (!Number.isFinite(Number(definition.defensePenetration)) || Number(definition.defensePenetration) < 0 || Number(definition.defensePenetration) > 0.9)) issues.push('resolution.defensePenetration must be between 0 and 0.9.');
    for (const key of ['accuracyModifier', 'flatPenetration', 'criticalRateModifier', 'criticalBonusPercent']) {
        if (definition[key] !== undefined && !Number.isFinite(Number(definition[key]))) issues.push(`resolution.${key} must be numeric.`);
    }
    if (definition.criticalEligible !== undefined && typeof definition.criticalEligible !== 'boolean') issues.push('resolution.criticalEligible must be boolean.');
    return issues;
}

function resolveAccuracy(attacker, defender, spec, rng) {
    if (spec.accuracyModel === 'automatic') {
        return Object.freeze({ model: 'automatic', chance: 100, roll: null, hit: true });
    }

    const attackStat = spec.accuracyModel === 'magic' ? 'magicAccuracy' : spec.accuracyModel === 'ranged' ? 'rangedAccuracy' : 'accuracy';
    const defenseStat = spec.accuracyModel === 'magic' ? 'magicEvasion' : 'evasion';
    const attackerValue = number(attacker?.combat?.derived?.[attackStat]);
    const defenderValue = number(defender?.combat?.derived?.[defenseStat]);
    const elementalResistance = spec.element ? number(defender?.combat?.resistances?.[spec.element]) : 0;
    const resistancePenalty = spec.resistanceModel === 'magicEvasion' ? elementalResistance / 4 : 0;
    const chance = clamp(75 + (attackerValue + spec.accuracyModifier - defenderValue - resistancePenalty) / 2, 20, 95);
    const roll = rollPercent(rng);
    return Object.freeze({
        model: spec.accuracyModel,
        attackerStat: attackStat,
        defenderStat: defenseStat,
        attackerValue,
        defenderValue,
        elementalResistance,
        chance,
        roll,
        hit: roll <= chance,
    });
}

function describeDefense(defender, spec) {
    if (spec.resistanceModel !== 'physicalDefense') {
        return Object.freeze({
            model: spec.resistanceModel,
            base: spec.resistanceModel === 'magicDefense' ? Math.max(0, number(defender?.combat?.derived?.magicDefense)) : 0,
            effective: spec.resistanceModel === 'magicDefense' ? Math.max(0, number(defender?.combat?.derived?.magicDefense)) : 0,
            penetration: 0,
            flatPenetration: 0,
        });
    }

    const base = Math.max(1, number(defender?.combat?.derived?.defense));
    const afterPercent = base * (1 - spec.defensePenetration);
    const effective = Math.max(1, afterPercent - spec.flatPenetration);
    return Object.freeze({
        model: spec.resistanceModel,
        base,
        effective,
        penetration: spec.defensePenetration,
        flatPenetration: spec.flatPenetration,
    });
}

function describeElement(defender, spec) {
    if (!spec.element) return Object.freeze({ element: null, source: null, resistance: 0, multiplier: 1 });
    const resistance = number(defender?.combat?.resistances?.[spec.element]);
    return Object.freeze({
        element: spec.element,
        source: spec.elementSource,
        resistance,
        multiplier: clamp(1 - resistance / 100, 0.25, 1.75),
    });
}

function resolveCritical(attacker, spec, rng) {
    if (!spec.criticalEligible) return Object.freeze({ eligible: false, critical: false, chance: 0, roll: null, multiplier: 1 });
    const chance = clamp(number(attacker?.combat?.derived?.criticalRate) + spec.criticalRateModifier, 0, 100);
    const roll = rollPercent(rng);
    const critical = roll <= chance;
    const basePercent = Math.max(100, number(attacker?.combat?.derived?.criticalDamage));
    const multiplier = critical ? Math.max(1, (basePercent + spec.criticalBonusPercent) / 100) : 1;
    return Object.freeze({ eligible: true, critical, chance, roll, multiplier });
}

function number(value) {
    const result = Number(value);
    return Number.isFinite(result) ? result : 0;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
