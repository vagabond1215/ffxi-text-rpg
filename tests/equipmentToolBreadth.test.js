import test from 'node:test';
import assert from 'node:assert/strict';
import { useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import {
    EQUIPMENT_CATALOG_VERSION,
    getEquipmentCatalogEntry,
    listEquipmentCatalogEntries,
} from '../js/text/data/equipmentCatalog.js';
import { listShopCatalogs } from '../js/text/data/shopCatalogs.js';
import { createNewGameState } from '../js/text/gameState.js';
import { canUseCapability, grantCapability } from '../js/text/systems/capabilityEngine.js';
import { harvestGatheringSource } from '../js/text/systems/ecologyEngine.js';
import { collectEquippedItemTags } from '../js/text/systems/equipmentToolEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { buyFromCurrentShop } from '../js/text/systems/shopEngine.js';

const ORIGINAL_UNRESTRICTED_IDS = [
    'field-knife',
    'prospector-pick',
    'woodsman-hatchet',
    'digging-spade',
    'reed-sickle',
    'marsh-rod',
    'iron-buckler',
    'road-cloak',
    'field-belt',
    'brass-ring',
    'traveler-boots',
    'leather-vest',
    'traveler-gloves',
    'leather-trousers',
];

test('equipment catalog v3 provides representative weapon armor accessory and field-tool breadth', () => {
    const entries = listEquipmentCatalogEntries();
    assert.equal(EQUIPMENT_CATALOG_VERSION, 3);
    assert.ok(entries.length >= 24);
    assert.ok(entries.some((entry) => entry.family === 'weapon'));
    assert.ok(entries.some((entry) => entry.family === 'armor'));
    assert.ok(entries.some((entry) => entry.family === 'shield'));
    assert.ok(entries.some((entry) => entry.family === 'accessory'));
    assert.ok(entries.filter((entry) => entry.family === 'tool').length >= 6);
});

test('new original equipment avoids active-discipline eligibility gates by default', () => {
    for (const id of ORIGINAL_UNRESTRICTED_IDS) {
        const item = getEquipmentCatalogEntry(id);
        assert.ok(item, `missing ${id}`);
        assert.deepEqual(item.requirements.allowedJobs, [], `${id} unexpectedly has active-discipline gating`);
    }
});

test('field tool catalog covers current gathering and recovery tool tags', () => {
    const tags = new Set(listEquipmentCatalogEntries().flatMap((entry) => entry.tags ?? []));
    for (const tag of ['cutting', 'mining', 'woodcutting', 'digging', 'fishing']) assert.ok(tags.has(tag), `missing ${tag}`);
});

test('equipped Field Knife satisfies character-owned Field Dressing capability without discipline gating', () => {
    const state = createNewGameState({ mainJobId: 'elementalist' });
    addCatalogEquipment(state, 'field-knife');
    assert.match(equipItem(state, 'Field Knife'), /Equipped Field Knife/);
    grantCapability(state.player, 'practical-field-dressing');

    const result = canUseCapability(state.player, 'practical-field-dressing', { type: 'resourceRecovery' });

    assert.equal(result.ok, true);
    assert.ok(collectEquippedItemTags(state.player).includes('cutting'));
});

test('equipped Prospector Pick satisfies gathering source tool requirement automatically', () => {
    const state = createNewGameState();
    state.currentPlaceId = 'south-redstone-reach';
    state.location = 'South Redstone Reach';
    addCatalogEquipment(state, 'prospector-pick');
    assert.match(equipItem(state, 'Prospector Pick'), /Equipped Prospector Pick/);

    const result = harvestGatheringSource(state, 'source-south-redstone-copper-seam', {
        proficiencies: { mining: 0 },
    });

    assert.equal(result.ok, true);
    assert.equal(result.code, 'ecology.resource-harvested');
    assert.equal(result.data.item.id, 'item-redstone-copper-ore');
});

test('settlement shops stock original tools as real equipment purchases', () => {
    const state = createNewGameState();
    state.player.wallet.gil = 200;
    const focused = useKnownPoi(state, 'poi-sandoria-s-ashene', 'shop');
    assert.equal(focused.ok, true);

    const result = buyFromCurrentShop(state, 'Field Knife');
    const purchased = state.player.inventoryState.containers.inventory.items.find((item) => item.id === 'field-knife');

    assert.match(result, /Bought Field Knife/);
    assert.equal(purchased.kind, 'equipment');
    assert.ok(purchased.tags.includes('cutting'));
});

test('shop-facing catalog names and descriptions use original-world vocabulary', () => {
    const text = listShopCatalogs().map((catalog) => `${catalog.name} ${catalog.description} ${catalog.items.map((item) => item.name).join(' ')}`).join('\n');
    assert.doesNotMatch(text, /San d[’']Oria|Bastok|Windurst|Sarutabaruta/i);
    for (const id of ['field-knife', 'prospector-pick', 'woodsman-hatchet', 'digging-spade', 'reed-sickle', 'marsh-rod']) {
        assert.ok(listShopCatalogs().some((catalog) => catalog.items.some((item) => item.id === id)), `shop stock missing ${id}`);
    }
});

function addCatalogEquipment(state, id) {
    const item = getEquipmentCatalogEntry(id);
    assert.ok(item, `missing catalog item ${id}`);
    const result = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity: 1 });
    assert.equal(result.ok, true, result.reason);
}
