import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalPopulation,
    getCanonicalSpecies,
    listCanonicalGatheringSources,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import {
    listWetlandIslandDistributionRepairEcologyFamilies,
    listWetlandIslandDistributionRepairGatheringSources,
    listWetlandIslandDistributionRepairPopulations,
    listWetlandIslandDistributionRepairSpecies,
} from '../js/text/data/wetlandIslandDistributionRepairEcology.js';
import { getPlace } from '../js/text/data/places.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';

test('wetland island repair is pure existing-species distribution with no new taxonomy', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.equal(listWetlandIslandDistributionRepairEcologyFamilies().length, 0);
    assert.equal(listWetlandIslandDistributionRepairSpecies().length, 0);
    assert.equal(listWetlandIslandDistributionRepairGatheringSources().length, 0);
    assert.equal(listWetlandIslandDistributionRepairPopulations().length, 8);

    for (const id of [
        'species-starfen-mire-heron',
        'species-starfen-reed-eel',
        'species-starfen-reed-crab',
        'species-starfen-fen-duck',
        'species-great-mere-silver-perch',
        'species-great-mere-glasswing-dragonfly',
        'species-delta-saltflat-mud-crab',
    ]) assert.ok(getCanonicalSpecies(id), id);
});

test('East Starfen gains wader, fish, crab, and dragonfly overlap', () => {
    for (const id of [
        'population-east-starfen-mirecrest-herons',
        'population-east-starfen-reed-eels',
        'population-east-starfen-reed-crabs',
        'population-east-starfen-glasswing-dragonflies',
    ]) {
        const population = getCanonicalPopulation(id);
        assert.ok(population, id);
        assert.equal(population.placeId, 'east-starfen');
    }

    const description = getPlace('east-starfen').description;
    assert.match(description, /sedge|rush/i);
    assert.match(description, /duckweed|floating|reed litter|marsh flower/i);
});

test('Reedcrown gains same-place perch prey plus insect and waterfowl overlap', () => {
    for (const id of [
        'population-reedcrown-silver-perch',
        'population-reedcrown-glasswing-dragonflies',
        'population-reedcrown-fen-ducks',
    ]) {
        const population = getCanonicalPopulation(id);
        assert.ok(population, id);
        assert.equal(population.placeId, 'reedcrown-isle');
    }

    const grebe = getCanonicalSpecies('species-great-mere-crown-grebe');
    assert.ok(grebe.behavior.preyFamilyIds.includes('family-lake-perch'));

    const perch = getCanonicalSpecies('species-great-mere-silver-perch');
    assert.equal(perch.familyId, 'family-lake-perch');

    const description = getPlace('reedcrown-isle').description;
    assert.match(description, /pondweed|sedge|water mint|algae/i);
});

test('Lower Delta gains mud-crab presence without duplicating the coastal recovery trap', () => {
    const population = getCanonicalPopulation('population-lower-delta-saltflat-mud-crabs');
    assert.ok(population);
    assert.equal(population.placeId, 'starfen-lower-delta');

    const sources = listCanonicalGatheringSources();
    assert.equal(sources.filter((entry) => entry.placeId === 'starfen-lower-delta' && /crab/i.test(entry.id)).length, 0);
    assert.ok(sources.some((entry) => entry.id === 'source-delta-mud-crab-flat' && entry.placeId === 'starfen-brackish-coast'));

    const description = getPlace('starfen-lower-delta').description;
    assert.match(description, /sedge|transition grass|mud-bank herb|algae/i);
});

test('one Pack-v2 repair graph owns only eight new population placements', () => {
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
    const pack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-wetland-island-distribution-repair');
    assert.ok(pack);
    assert.deepEqual(pack.ownership.regionIds, ['starfen', 'great-mere', 'starfen-delta']);

    for (const dependency of [
        'pack-starfen-opening',
        'pack-starfen-ecology-breadth',
        'pack-great-mere-freshwater-ecology',
        'pack-starfen-delta-brackish-ecology',
    ]) assert.ok(pack.dependencies.includes(dependency), dependency);

    assert.equal(pack.records.ecologyFamilies.length, 0);
    assert.equal(pack.records.species.length, 0);
    assert.equal(pack.records.populations.length, 8);
    assert.equal(pack.records.gatheringSources.length, 0);
    assert.equal(pack.records.items.length, 0);
    assert.equal(pack.records.recipes.length, 0);
});
