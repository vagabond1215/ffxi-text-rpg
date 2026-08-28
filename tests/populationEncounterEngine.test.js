import test from 'node:test';
import assert from 'node:assert/strict';

import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { performPlayerAttack } from '../js/text/systems/combatActionEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { consumePopulationUnits, getPopulationAvailability } from '../js/text/systems/ecologyEngine.js';
import {
    listPopulationEncounterOptions,
    startPopulationEncounter,
} from '../js/text/systems/populationEncounterEngine.js';

function elderwoodState() {
    const state = createNewGameState({ nationId: 'thornwall' });
    const place = getPlace('west-elderwood');
    const moved = setPositionAndDiscover(state, place.id, place.coordinateSystem.start);
    assert.equal(moved.ok, true, moved.reason);
    return state;
}

test('deliberate wildlife tracking exposes non-hostile encounter-backed populations without converting hostile ecology into hunt targets', () => {
    const state = elderwoodState();
    const options = listPopulationEncounterOptions(state, { includeInactive: true, includeDepleted: true });

    assert.ok(options.some((entry) => entry.speciesId === 'species-brush-hare'));
    assert.ok(options.some((entry) => entry.speciesId === 'species-elderwood-barkboar'));
    assert.equal(options.some((entry) => entry.speciesId === 'species-mossback-goblin'), false);
    assert.ok(options.every((entry) => ['passive', 'wary', 'territorial'].includes(entry.aggression)));
});

test('starting a population encounter records its ecology source without depleting the population before victory', () => {
    const state = elderwoodState();
    const before = getPopulationAvailability(state, 'population-west-elderwood-brush-hare');
    assert.equal(before.availableUnits, 8);

    const started = startPopulationEncounter(state, 'Brush Hare', { rng: () => 0 });

    assert.equal(started.ok, true, started.display?.text);
    assert.equal(state.activeBattle.source, 'population');
    assert.equal(state.activeBattle.sourcePopulationId, 'population-west-elderwood-brush-hare');
    assert.equal(state.activeBattle.sourceSpeciesId, 'species-brush-hare');
    assert.equal(state.activeBattle.sourcePopulationConsumed, false);
    assert.equal(getPopulationAvailability(state, 'population-west-elderwood-brush-hare').availableUnits, 8);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('victory consumes one population unit exactly once and still creates ordinary body recovery', () => {
    const state = elderwoodState();
    const started = startPopulationEncounter(state, 'population-west-elderwood-brush-hare', { rng: () => 0 });
    assert.equal(started.ok, true, started.display?.text);

    const enemy = state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    enemy.resources.hp = 1;

    const result = performPlayerAttack(state);
    assert.match(result, /Battle: victory/);
    assert.equal(state.activeBattle.sourcePopulationConsumed, true);
    assert.equal(state.activeBattle.rewards.populationConsumption.populationId, 'population-west-elderwood-brush-hare');
    assert.equal(state.activeBattle.rewards.populationConsumption.remaining, 7);
    assert.equal(getPopulationAvailability(state, 'population-west-elderwood-brush-hare').availableUnits, 7);
    assert.equal(state.activeBattle.rewards.resourceOpportunities.length, 1);
    assert.equal(state.activeBattle.rewards.resourceOpportunities[0].type, 'body');

    const afterFirstResolution = getPopulationAvailability(state, 'population-west-elderwood-brush-hare').availableUnits;
    assert.equal(afterFirstResolution, 7);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('depleted populations cannot create new deliberate wildlife encounters', () => {
    const state = elderwoodState();
    const depleted = consumePopulationUnits(state, 'population-west-elderwood-brush-hare', 8);
    assert.equal(depleted.ok, true);
    assert.equal(getPopulationAvailability(state, 'population-west-elderwood-brush-hare').availableUnits, 0);

    const started = startPopulationEncounter(state, 'Brush Hare', { rng: () => 0 });
    assert.equal(started.ok, false);
    assert.equal(started.code, 'population-encounter.depleted');
    assert.equal(state.activeBattle, null);
});

test('malformed optional population source metadata is rejected by active-battle persistence validation', () => {
    const state = elderwoodState();
    const started = startPopulationEncounter(state, 'Brush Hare', { rng: () => 0 });
    assert.equal(started.ok, true);
    state.activeBattle.sourcePopulationConsumed = 'no';

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('sourcePopulationConsumed must be boolean')));
});
