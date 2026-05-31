import { getPlace } from '../data/places.js';
import { coordinateKey } from './atlasEngine.js';

export function evaluateAggroForGrid(state, options = {}) {
    const place = getPlace(state.currentPlaceId);
    const position = state.position;
    if (!place || !position) return { triggered: false, rolls: [] };

    const travelMode = options.travelMode ?? 'foot';
    if (travelMode !== 'foot') return { triggered: false, rolls: [], reason: 'Aggro currently only applies to foot travel.' };

    const rolls = place.spawnRules
        .filter((rule) => rule.grids.includes(coordinateKey(position)))
        .filter((rule) => rule.aggroTypes.length > 0)
        .map((rule) => rollAggro(rule, options.rng ?? Math.random));

    const triggered = rolls.find((roll) => roll.triggered) ?? null;
    return {
        triggered: Boolean(triggered),
        encounter: triggered,
        rolls,
    };
}

export function describeAggroResult(result) {
    if (!result.rolls?.length) return 'No aggressive monsters are known to threaten this coordinate.';
    if (!result.triggered) {
        return [
            'Aggro check: safe for now.',
            ...result.rolls.map((roll) => `- ${roll.enemyId}: rolled ${roll.rollPercent}% vs ${roll.chancePercent}%`),
        ].join('\n');
    }

    return [
        `Aggro! ${result.encounter.enemyId} notices you by ${result.encounter.aggroTypes.join('/')}.`,
        ...result.rolls.map((roll) => `- ${roll.enemyId}: rolled ${roll.rollPercent}% vs ${roll.chancePercent}%${roll.triggered ? ' TRIGGERED' : ''}`),
    ].join('\n');
}

function rollAggro(rule, rng) {
    const spawnPressure = Math.max(1, rule.count ?? 1);
    const chance = clamp(rule.baseChance * (1 + (spawnPressure - 1) * 0.08), 0, 0.95);
    const roll = rng();

    return {
        enemyId: rule.enemyId,
        aggroTypes: rule.aggroTypes,
        spawnCount: rule.count,
        chance,
        chancePercent: Math.round(chance * 100),
        roll,
        rollPercent: Math.round(roll * 100),
        triggered: roll < chance,
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
