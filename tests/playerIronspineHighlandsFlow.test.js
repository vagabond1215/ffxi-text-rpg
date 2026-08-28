import test from 'node:test';
import assert from 'node:assert/strict';

import { getMap } from '../js/text/data/maps.js';
import { getCanonicalPopulation, validateEcologyRegistry } from '../js/text/data/ecologyRegistry.js';
import { getCanonicalResourceItem, validateResourceItemRegistry } from '../js/text/data/resourceItemRegistry.js';
import { getProductionDefinition, validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem, validateProductionItemCatalog } from '../js/text/data/productionItems.js';
import { getRoute, validateRouteCatalog } from '../js/text/data/routeCatalog.js';
import { REGIONAL_CONTENT_PACKS } from '../js/text/data/regionalContentPacks.js';
import { validateContentPacks } from '../js/text/data/contentPackValidator.js';
import { describeItemConsumption } from '../js/text/data/itemSchema.js';
import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { performPlayerAttack } from '../js/text/systems/combatActionEngine.js';
import { getPopulationAvailability } from '../js/text/systems/ecologyEngine.js';
import { listPopulationEncounterOptions, startPopulationEncounter } from '../js/text/systems/populationEncounterEngine.js';

function highMeadowState() {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Ironspine Auditor' });
    const place = getPlace('ironspine-high-meadow');
    const moved = setPositionAndDiscover(state, place.id, place.coordinateSystem.start);
    assert.equal(moved.ok, true, moved.reason);
    return state;
}

test('Ironspine geography has a wagon-limited lower pass and foot-or-mount high trail', () => {
    const map = getMap('map-ironspine-highlands');
    assert.deepEqual(map.placeIds, ['ironspine-lower-pass', 'ironspine-watchpost', 'ironspine-high-meadow']);

    const lower = getRoute('route-redstone-ironspine-pass-road');
    const high = getRoute('route-ironspine-high-trail');
    assert.ok(lower.allowedModes.includes('wagon'));
    assert.ok(lower.allowedModes.includes('mount'));
    assert.equal(high.allowedModes.includes('wagon'), false);
    assert.deepEqual(new Set(high.allowedModes), new Set(['walk', 'mount']));
    assert.ok(high.segments[0].hazards.includes('scree'));
    assert.ok(high.segments[0].hazards.includes('cliff-exposure'));
    assert.deepEqual(validateRouteCatalog(), []);
});

test('Ironspine ecology and resource registries validate with alpine niches and exact provenance', () => {
    assert.deepEqual(validateEcologyRegistry(), []);
    assert.deepEqual(validateResourceItemRegistry(), []);

    for (const id of [
        'population-ironspine-snowhorn-ibex',
        'population-ironspine-cliff-bears',
        'population-ironspine-froststep-lynxes',
        'population-ironspine-crag-marmots',
        'population-ironspine-whitecrest-eagles',
        'population-ironspine-snow-grouse',
    ]) assert.ok(getCanonicalPopulation(id), id);

    const ore = getCanonicalResourceItem('item-ironspine-lodestone-ore');
    assert.ok(ore.provenance.some((entry) => entry.sourceId === 'source-ironspine-lodestone-seam' && entry.placeId === 'ironspine-high-meadow' && entry.action === 'mine'));

    const hide = getCanonicalResourceItem('item-ironspine-snowhorn-hide');
    assert.ok(hide.provenance.some((entry) => entry.sourceId === 'enemy-ironspine-snowhorn-ibex' && entry.action === 'skin'));
});

test('population-backed Snowhorn hunting depletes ecology only on victory and leaves ordinary body recovery', () => {
    const state = highMeadowState();
    const options = listPopulationEncounterOptions(state);
    assert.ok(options.some((entry) => entry.speciesId === 'species-ironspine-snowhorn-ibex'));
    assert.ok(options.some((entry) => entry.speciesId === 'species-ironspine-froststep-lynx'));

    const before = getPopulationAvailability(state, 'population-ironspine-snowhorn-ibex').availableUnits;
    const started = startPopulationEncounter(state, 'Snowhorn Ibex', { rng: () => 0 });
    assert.equal(started.ok, true, started.display?.text);
    assert.equal(getPopulationAvailability(state, 'population-ironspine-snowhorn-ibex').availableUnits, before);

    const enemy = state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    enemy.resources.hp = 1;
    const result = performPlayerAttack(state);
    assert.match(result, /Battle: victory/);
    assert.equal(getPopulationAvailability(state, 'population-ironspine-snowhorn-ibex').availableUnits, before - 1);

    const body = state.activeBattle.rewards.resourceOpportunities[0];
    assert.equal(body.type, 'body');
    assert.ok(body.outputs.some((entry) => entry.itemId === 'item-ironspine-snowhorn-hide' && entry.recoveryAction === 'skin'));
    assert.ok(body.outputs.some((entry) => entry.itemId === 'item-ironspine-snowhorn-meat' && entry.recoveryAction === 'butcher'));
});

test('Ironspine raw game and prepared food use practical fantasy-era safety language and real cooking paths', () => {
    const rawMeat = getCanonicalResourceItem('item-ironspine-snowhorn-meat');
    assert.equal(rawMeat.consumption.mode, 'processRequired');
    assert.equal(rawMeat.consumption.hazard, 'pathogenRisk');
    assert.match(rawMeat.consumption.notes, /raw.*sickness/i);
    assert.match(describeItemConsumption(rawMeat), /cause sickness if eaten raw/i);

    const stew = getProductionItem('item-ironspine-snowhorn-stew');
    const smoked = getProductionItem('item-ironspine-smoked-snowhorn');
    assert.equal(stew.consumption.mode, 'direct');
    assert.equal(smoked.consumption.mode, 'direct');

    assert.ok(getProductionDefinition('cook-ironspine-snowhorn-stew').inputs.some((entry) => entry.itemId === rawMeat.id));
    assert.ok(getProductionDefinition('process-ironspine-smoked-snowhorn').inputs.some((entry) => entry.itemId === rawMeat.id));
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateProductionItemCatalog(), []);
});

test('every new Ironspine raw has production demand and packs own the connected regional graph', () => {
    const ironspineRawIds = [
        'item-ironspine-stonepine-cone',
        'item-ironspine-alpine-sorrel',
        'item-ironspine-frost-lichen',
        'item-ironspine-dwarf-willow-bark',
        'item-ironspine-lodestone-ore',
        'item-ironspine-cloud-quartz',
        'item-ironspine-snowhorn-hide',
        'item-ironspine-snowhorn-meat',
        'item-ironspine-cliff-bear-hide',
        'item-ironspine-bear-fat',
        'item-ironspine-froststep-pelt',
    ];
    const demanded = new Set(
        [
            'process-ironspine-stonepine-kernels',
            'cook-ironspine-snowhorn-stew',
            'process-ironspine-smoked-snowhorn',
            'process-ironspine-render-bear-tallow',
            'process-ironspine-highland-leather',
            'process-ironspine-froststep-fur-lining',
            'craft-ironspine-frost-lichen-salve',
            'process-ironspine-lodestone-billet',
            'craft-ironspine-lodestone-pointer',
            'process-ironspine-polished-cloud-quartz',
            'craft-ironspine-high-pass-compass',
            'craft-ironspine-bearhide-bedroll',
            'craft-ironspine-weather-mantle',
        ].flatMap((id) => getProductionDefinition(id).inputs.map((entry) => entry.itemId)),
    );
    for (const id of ironspineRawIds) assert.ok(demanded.has(id), `${id} lacks Ironspine production demand`);

    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);
    const ecologyPack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-ironspine-highlands-ecology');
    const highlandsPack = REGIONAL_CONTENT_PACKS.find((entry) => entry.id === 'pack-ironspine-highlands');
    assert.ok(ecologyPack);
    assert.ok(highlandsPack);
    assert.ok(highlandsPack.dependencies.includes(ecologyPack.id));
    assert.ok(highlandsPack.records.routes.some((entry) => entry.id === 'route-ironspine-high-trail'));
});
