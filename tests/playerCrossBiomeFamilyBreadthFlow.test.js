import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalEcologyFamily,
    getCanonicalPopulation,
    getCanonicalSpecies,
    validateEcologyRegistry,
} from '../js/text/data/ecologyRegistry.js';
import {
    listCrossBiomeFamilyBreadthEcologyFamilies,
    listCrossBiomeFamilyBreadthGatheringSources,
    listCrossBiomeFamilyBreadthPopulations,
    listCrossBiomeFamilyBreadthSpecies,
} from '../js/text/data/crossBiomeFamilyBreadthEcology.js';
import { getPlace } from '../js/text/data/places.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';

test('cross-biome breadth adds exactly two scoped families and seven passive regional species', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.equal(listCrossBiomeFamilyBreadthEcologyFamilies().length, 2);
    assert.equal(listCrossBiomeFamilyBreadthSpecies().length, 7);
    assert.equal(listCrossBiomeFamilyBreadthPopulations().length, 7);
    assert.equal(listCrossBiomeFamilyBreadthGatheringSources().length, 0);

    assert.equal(getCanonicalEcologyFamily('family-ground-squirrel').name, 'Ground Squirrel');
    assert.equal(getCanonicalEcologyFamily('family-finch').name, 'Finch');

    for (const species of listCrossBiomeFamilyBreadthSpecies()) {
        assert.ok(['passive', 'wary'].includes(species.behavior.aggression), species.id);
        assert.equal(species.encounterTemplateId, null, species.id);
        assert.deepEqual(species.behavior.linksWithFamilyIds, [], species.id);
    }
});

test('ground squirrel family spans steppe, plateau, and agricultural margins without redundant foothill inflation', () => {
    const expected = new Map([
        ['population-coppergrass-loess-ground-squirrels', 'coppergrass-steppe'],
        ['population-waymeet-cairn-ground-squirrels', 'waymeet-south-marches'],
        ['population-crownfields-hedgebank-ground-squirrels', 'crownfields'],
    ]);

    for (const [id, placeId] of expected) {
        const population = getCanonicalPopulation(id);
        assert.ok(population, id);
        assert.equal(population.placeId, placeId);
        assert.equal(getCanonicalSpecies(population.speciesId).familyId, 'family-ground-squirrel');
    }

    assert.equal(
        listCrossBiomeFamilyBreadthPopulations().filter((entry) => entry.placeId === 'slatewater-foothills' && /ground-squirrel/.test(entry.speciesId)).length,
        0,
    );
});

test('finch family spans steppe, hedgerow, woodland edge, and foothill seed niches', () => {
    const expected = new Map([
        ['population-coppergrass-seed-finches', 'coppergrass-steppe'],
        ['population-crownfields-hedgerow-finches', 'crownfields'],
        ['population-east-elderwood-hazel-finches', 'east-elderwood'],
        ['population-slatewater-thistle-finches', 'slatewater-foothills'],
    ]);

    for (const [id, placeId] of expected) {
        const population = getCanonicalPopulation(id);
        assert.ok(population, id);
        assert.equal(population.placeId, placeId);
        assert.equal(getCanonicalSpecies(population.speciesId).familyId, 'family-finch');
    }
});

test('affected places expose small-fauna habitat evidence without adding resource-node prose', () => {
    assert.match(getPlace('coppergrass-steppe').description, /burrow|seed finch|seed head/i);
    assert.match(getPlace('waymeet-south-marches').description, /burrow|cairn bank/i);
    assert.match(getPlace('crownfields').description, /hedgebank|finch|burrow/i);
    assert.match(getPlace('east-elderwood').description, /finch|hazel/i);
    assert.match(getPlace('slatewater-foothills').description, /finch|thistle|seed head/i);
});

test('one Pack-v2 breadth graph owns only the new families species and populations', () => {
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
    const pack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-cross-biome-family-breadth');
    assert.ok(pack);
    assert.deepEqual(pack.ownership.regionIds, [
        'coppergrass-steppe',
        'waymeet-marches',
        'crownfields',
        'elderwood',
        'slatewater-foothills',
    ]);

    for (const dependency of [
        'pack-coppergrass-steppe-ecology',
        'pack-waymeet-marches-ecology',
        'pack-crownfields-agricultural-ecology',
        'pack-elderwood-ecology-breadth',
        'pack-slatewater-foothills-ecology',
    ]) assert.ok(pack.dependencies.includes(dependency), dependency);

    assert.equal(pack.records.ecologyFamilies.length, 2);
    assert.equal(pack.records.species.length, 7);
    assert.equal(pack.records.populations.length, 7);
    assert.equal(pack.records.gatheringSources.length, 0);
    assert.equal(pack.records.items.length, 0);
    assert.equal(pack.records.recipes.length, 0);
});
