import test from 'node:test';
import assert from 'node:assert/strict';

import {
    describeLocationProfileCatalog,
    getLocationProfile,
    getRegionProfile,
    getSettlementProfile,
    getWorldPopulationSummary,
    listLocationProfiles,
    listRegionProfiles,
    listSettlementProfiles,
    validateLocationProfileCatalog,
} from '../js/text/data/locationProfileCatalog.js';
import { listPlaces } from '../js/text/data/places.js';

test('location profiles cover every canonical place exactly once', () => {
    assert.deepEqual(validateLocationProfileCatalog(), []);

    const places = listPlaces();
    const profiles = listLocationProfiles();
    assert.equal(places.length, 26);
    assert.equal(profiles.length, places.length);
    assert.deepEqual(
        new Set(profiles.map((entry) => entry.id)),
        new Set(places.map((entry) => entry.id)),
    );

    for (const profile of profiles) {
        assert.ok(profile.biome.primary);
        assert.ok(profile.biome.tags.length >= 1);
        assert.ok(Number.isInteger(profile.population.residents));
        assert.ok(profile.population.residents >= 0);
        assert.ok(Number.isInteger(profile.population.typicalTransient));
        assert.equal(
            profile.population.typicalPresent,
            profile.population.residents + profile.population.typicalTransient,
        );
        assert.ok(['local-canonical', 'regional-context-only', 'not-yet-modeled'].includes(profile.ecology.coverage));
    }
});

test('settlement totals are derived from member-place populations', () => {
    const settlements = listSettlementProfiles();
    assert.equal(settlements.length, 5);

    const thornwall = getSettlementProfile('settlement-thornwall');
    assert.equal(thornwall.population.residents, 32610);
    assert.equal(thornwall.population.typicalTransient, 7480);
    assert.equal(thornwall.population.typicalPresent, 40090);

    const brasshaven = getSettlementProfile('settlement-brasshaven');
    assert.equal(brasshaven.population.residents, 29900);
    assert.equal(brasshaven.population.typicalPresent, 39300);

    const mistmere = getSettlementProfile('settlement-mistmere');
    assert.equal(mistmere.population.residents, 29250);
    assert.equal(mistmere.population.typicalPresent, 37370);

    const timbercross = getSettlementProfile('settlement-timbercross');
    assert.equal(timbercross.population.residents, 340);

    const redfang = getSettlementProfile('settlement-redfang-camp');
    assert.equal(redfang.population.residents, 110);
});

test('region profiles aggregate all current places, settlements, biomes, flora, fauna, and other creatures', () => {
    const regions = listRegionProfiles();
    assert.deepEqual(regions.map((entry) => entry.name), ['Elderwood', 'Redstone Reach', 'Starfen']);

    const elderwood = getRegionProfile('Elderwood');
    assert.equal(elderwood.placeIds.length, 11);
    assert.equal(elderwood.population.residents, 33175);
    assert.equal(elderwood.population.typicalTransient, 7993);
    assert.ok(elderwood.settlements.some((entry) => entry.id === 'settlement-thornwall'));
    assert.ok(elderwood.biomes.includes('old-growth'));
    assert.ok(elderwood.ecology.flora.some((entry) => entry.name === 'Amber Resin'));
    assert.ok(elderwood.ecology.fauna.some((entry) => entry.name === 'Elderwood Barkboar'));
    assert.ok(elderwood.ecology.otherCreatures.some((entry) => entry.name === 'Mossback Goblin'));

    const redstone = getRegionProfile('Redstone Reach');
    assert.equal(redstone.placeIds.length, 7);
    assert.equal(redstone.population.residents, 30080);
    assert.equal(redstone.ecology.flora.length, 0);
    assert.ok(redstone.ecology.fauna.some((entry) => entry.name === 'Redstone Ridge Ibex'));
    assert.ok(redstone.ecology.otherCreatures.some((entry) => entry.name === 'Ashcap Scavenger'));

    const starfen = getRegionProfile('Starfen');
    assert.equal(starfen.placeIds.length, 8);
    assert.equal(starfen.population.residents, 29530);
    assert.ok(starfen.ecology.flora.some((entry) => entry.name === 'Bluekelp'));
    assert.ok(starfen.ecology.fauna.some((entry) => entry.name === 'Mirecrest Heron'));
    assert.ok(starfen.ecology.fishing.some((entry) => entry.name === 'Starfen Silverfin'));
    assert.ok(starfen.ecology.otherCreatures.some((entry) => entry.name === 'Starfen Rootling'));
});

test('local ecology is distinguished from regional context rather than invented for uncovered places', () => {
    const westElderwood = getLocationProfile('west-elderwood');
    assert.equal(westElderwood.ecology.coverage, 'local-canonical');
    assert.ok(westElderwood.ecology.local.flora.some((entry) => entry.name === 'Elderwood Sweetroot'));
    assert.ok(westElderwood.ecology.local.flora.some((entry) => entry.name === 'Duskcap Mushroom'));
    assert.ok(westElderwood.ecology.local.fauna.some((entry) => entry.name === 'Brush Hare'));
    assert.ok(westElderwood.ecology.local.fauna.some((entry) => entry.name === 'Moon-Antler Hart'));
    assert.ok(westElderwood.ecology.local.otherCreatures.some((entry) => entry.name === 'Mossback Goblin'));

    const thornwall = getLocationProfile('thornwall-southgate');
    assert.equal(thornwall.ecology.coverage, 'regional-context-only');
    assert.equal(thornwall.ecology.local.flora.length, 0);
    assert.equal(thornwall.ecology.local.fauna.length, 0);
    assert.ok(thornwall.ecology.regionalRepresentative.flora.length > 0);
    assert.ok(thornwall.ecology.regionalRepresentative.fauna.length > 0);

    const northRedstone = getLocationProfile('north-redstone-reach');
    assert.equal(northRedstone.ecology.local.flora.length, 0);
    assert.ok(northRedstone.ecology.local.fauna.some((entry) => entry.name === 'Redstone Burrower'));

    const eastStarfen = getLocationProfile('east-starfen');
    assert.equal(eastStarfen.ecology.local.fauna.length, 0);
    assert.ok(eastStarfen.ecology.local.otherCreatures.some((entry) => entry.name === 'Starfen Rootling'));
    assert.ok(eastStarfen.ecology.regionalRepresentative.fauna.some((entry) => entry.name === 'Mirecrest Heron'));
});

test('world population is derived once from all 26 place profiles', () => {
    const world = getWorldPopulationSummary();
    assert.equal(world.residents, 92785);
    assert.equal(world.typicalTransient, 26693);
    assert.equal(world.typicalPresent, 119478);
});

test('profile descriptions expose population and ecology for every area', () => {
    const description = describeLocationProfileCatalog();
    assert.match(description, /Modeled world population: 92,785 residents; ~119,478 typically present/);
    assert.match(description, /# Elderwood/);
    assert.match(description, /# Redstone Reach/);
    assert.match(description, /# Starfen/);
    assert.match(description, /## Thornwall Southgate/);
    assert.match(description, /## Deepvein Mine/);
    assert.match(description, /## Sunken Archive/);
    assert.match(description, /Population: 33,175 residents/);
    assert.match(description, /Flora:/);
    assert.match(description, /Fauna:/);
});
