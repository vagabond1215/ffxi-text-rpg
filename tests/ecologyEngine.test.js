import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getPopulation,
    getSpecies,
    listEcologyFamilies,
    listGatheringSources,
    listPopulations,
    listSpecies,
    validateEcologyCatalog,
} from '../js/text/data/ecologyCatalog.js';
import { listResourceItems } from '../js/text/data/resourceItems.js';
import { createSeedEnemies } from '../js/text/data/seedEntities.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    consumePopulationUnits,
    createEcologyState,
    getGatheringSourceAvailability,
    getPopulationAvailability,
    harvestGatheringSource,
    isGatheringSourceActive,
    isPopulationActive,
    listActiveNamedVariantHooks,
    validateEcologyState,
} from '../js/text/systems/ecologyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

test('ecology catalog separates families species and encounter templates', () => {
    assert.ok(listEcologyFamilies().length >= 6);
    assert.ok(listSpecies().length >= 8);
    const brushHare = getSpecies('species-brush-hare');
    assert.equal(brushHare.familyId, 'family-hare');
    assert.equal(brushHare.encounterTemplateId, 'enemy-brush-hare');

    const encounter = createSeedEnemies().find((enemy) => enemy.id === 'enemy-brush-hare');
    assert.equal(encounter.speciesId, brushHare.id);
    assert.equal(encounter.identity.name, brushHare.name);
});

test('population catalog spans distinct habitats and behavior families', () => {
    const populations = listPopulations();
    assert.ok(populations.some((entry) => entry.placeId === 'west-elderwood'));
    assert.ok(populations.some((entry) => entry.placeId === 'south-redstone-reach'));
    assert.ok(populations.some((entry) => entry.placeId === 'deepvein-mine'));
    assert.ok(populations.some((entry) => entry.placeId === 'west-starfen'));
    assert.ok(new Set(populations.map((entry) => getSpecies(entry.speciesId).familyId)).size >= 5);
});

test('gathering sources reference canonical raw resource items with matching provenance', () => {
    const items = new Map(listResourceItems().map((item) => [item.id, item]));
    for (const source of listGatheringSources()) {
        const item = items.get(source.outputItemId);
        assert.ok(item, source.outputItemId);
        assert.ok(item.provenance.some((entry) => entry.sourceId === source.id));
        assert.ok(item.provenance.some((entry) => entry.placeId === source.placeId));
        assert.ok(item.provenance.some((entry) => entry.action === source.action));
    }
});

test('new games initialize versioned ecology state without a save version bump', () => {
    const state = createNewGameState();
    assert.equal(state.version, 5);
    assert.equal(state.ecology.version, 1);
    assert.deepEqual(state.ecology.populations, {});
    assert.deepEqual(state.ecology.gatheringSources, {});
});

test('population consumption uses persistent availability and deterministic respawn', () => {
    const state = createNewGameState({ startingPlaceId: 'west-elderwood' });
    const populationId = 'population-west-elderwood-brush-hare';
    const population = getPopulation(populationId);

    assert.equal(getPopulationAvailability(state, populationId).availableUnits, population.capacity);
    const consumed = consumePopulationUnits(state, populationId, population.capacity);
    assert.equal(consumed.ok, true);
    assert.equal(getPopulationAvailability(state, populationId).availableUnits, 0);

    advanceWorldTime(state, 899, { emitEvent: false });
    assert.equal(getPopulationAvailability(state, populationId).availableUnits, 0);
    advanceWorldTime(state, 1, { emitEvent: false });
    assert.equal(getPopulationAvailability(state, populationId).availableUnits, 2);
});

test('rare population appearance is deterministic from canonical day and time', () => {
    const populationId = 'population-west-elderwood-moon-antler-hart';
    const beforeWindow = createNewGameState({ startWorldTimeSeconds: 4 * 86400 + 3 * 3600 });
    const insideWindow = createNewGameState({ startWorldTimeSeconds: 4 * 86400 + 5 * 3600 });
    const wrongDay = createNewGameState({ startWorldTimeSeconds: 3 * 86400 + 5 * 3600 });

    assert.equal(isPopulationActive(beforeWindow, populationId), false);
    assert.equal(isPopulationActive(insideWindow, populationId), true);
    assert.equal(isPopulationActive(wrongDay, populationId), false);
});

test('named population hooks depend on explicit world flags rather than arbitrary rolls', () => {
    const state = createNewGameState({ startingPlaceId: 'west-elderwood' });
    const populationId = 'population-west-elderwood-brush-hare';
    assert.deepEqual(listActiveNamedVariantHooks(state, populationId), []);

    state.flags['elderwood.pale-ear-trail'] = true;
    const hooks = listActiveNamedVariantHooks(state, populationId);
    assert.equal(hooks.length, 1);
    assert.equal(hooks[0].id, 'named-hook-pale-ear');
});

test('harvesting consumes source capacity and adds provenance-tagged material atomically', () => {
    const state = createNewGameState({ startingPlaceId: 'west-elderwood' });
    const sourceId = 'source-west-elderwood-sweetroot-patch';
    const result = harvestGatheringSource(state, sourceId, { quantity: 2 });

    assert.equal(result.ok, true);
    assert.equal(result.data.source.availableUnits, 4);
    const item = state.player.inventory.find((entry) => entry.id === 'item-elderwood-sweetroot');
    assert.ok(item);
    assert.equal(item.quantity, 2);
    assert.equal(item.provenance[0].sourceId, sourceId);
    assert.equal(item.provenance[0].placeId, 'west-elderwood');
    assert.equal(item.provenance[0].action, 'forage');
});

test('depleted gathering sources regenerate on canonical world-time intervals', () => {
    const state = createNewGameState({ startingPlaceId: 'west-elderwood' });
    const sourceId = 'source-west-elderwood-sweetroot-patch';

    assert.equal(harvestGatheringSource(state, sourceId, { quantity: 6 }).ok, true);
    assert.equal(harvestGatheringSource(state, sourceId).code, 'ecology.source-depleted');
    advanceWorldTime(state, 1799, { emitEvent: false });
    assert.equal(getGatheringSourceAvailability(state, sourceId).availableUnits, 0);
    advanceWorldTime(state, 1, { emitEvent: false });
    assert.equal(getGatheringSourceAvailability(state, sourceId).availableUnits, 1);
});

test('gathering enforces place and tool hooks before depleting source state', () => {
    const state = createNewGameState({ startingPlaceId: 'south-redstone-reach' });
    const sourceId = 'source-south-redstone-copper-seam';

    const missingTool = harvestGatheringSource(state, sourceId);
    assert.equal(missingTool.code, 'ecology.tool-required');
    assert.equal(getGatheringSourceAvailability(state, sourceId).availableUnits, 5);

    const mined = harvestGatheringSource(state, sourceId, { toolTags: ['mining'] });
    assert.equal(mined.ok, true);
    assert.equal(getGatheringSourceAvailability(state, sourceId).availableUnits, 4);

    state.currentPlaceId = 'west-elderwood';
    const wrongPlace = harvestGatheringSource(state, sourceId, { toolTags: ['mining'] });
    assert.equal(wrongPlace.code, 'ecology.source-wrong-place');
    assert.equal(getGatheringSourceAvailability(state, sourceId).availableUnits, 4);
});

test('time-window gathering conditions are derived from world time', () => {
    const sourceId = 'source-west-starfen-silverfin-water';
    const state = createNewGameState({ startingPlaceId: 'west-starfen', startWorldTimeSeconds: 0 });
    assert.equal(isGatheringSourceActive(state, sourceId), false);
    advanceWorldTime(state, 5 * 3600, { emitEvent: false });
    assert.equal(isGatheringSourceActive(state, sourceId), true);
});

test('ecology catalog cross-reference validation passes representative canonical data', () => {
    assert.deepEqual(validateEcologyCatalog(), []);
});

test('ecology state validation rejects runtime references to unknown definitions', () => {
    const ecology = createEcologyState({
        populations: {
            'population-missing': {
                id: 'population-missing',
                availableUnits: 1,
                lastUpdatedAtWorldSeconds: 0,
            },
        },
    });
    const issues = validateEcologyState(ecology);
    assert.ok(issues.some((issue) => issue.includes('unknown definition')));
});
