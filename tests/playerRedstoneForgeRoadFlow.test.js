import test from 'node:test';
import assert from 'node:assert/strict';

import { validateAbilityCatalog } from '../js/text/data/abilities.js';
import { validateCapabilityCatalog } from '../js/text/data/capabilities.js';
import { validateCommitmentCatalog } from '../js/text/data/commitments.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import {
    REDSTONE_FORGE_ROAD_PACK,
    REGIONAL_CONTENT_PACKS,
} from '../js/text/data/regionalContentPacks.js';
import { getCanonicalResourceItem } from '../js/text/data/resourceItemRegistry.js';
import { createNewGameState } from '../js/text/gameState.js';
import { activateAbility } from '../js/text/systems/abilityEngine.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import {
    acceptCommitment,
    resolveCommitment,
} from '../js/text/systems/commitmentEngine.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { collectContentScaleCounts } from '../js/text/systems/contentScaleGate.js';
import { startEncounter } from '../js/text/systems/combatActionEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import {
    reconcileProductionWork,
    startProductionWork,
} from '../js/text/systems/productionEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

function addItem(state, item, quantity = 1) {
    assert.ok(item, 'expected canonical item');
    const added = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(added.ok, true, added.reason);
}

function completeForgeWork(state, processId) {
    const started = startProductionWork(state, processId, { stationTags: ['forge'] });
    assert.equal(started.ok, true, started.display?.text ?? started.code);
    advanceWorldTime(state, started.data.task.durationSeconds);
    const results = reconcileProductionWork(state);
    const completed = results.find((entry) => entry.data?.work?.data?.processId === processId) ?? results[0];
    assert.ok(completed, `expected completion for ${processId}`);
    assert.equal(completed.ok, true, completed.display?.text ?? completed.code);
    assert.equal(completed.code, 'production.completed');
    return completed;
}

test('Redstone Forge-Road is one Pack-v2-owned connected production, contract, and technique tranche', () => {
    assert.deepEqual(validateCapabilityCatalog(), []);
    assert.deepEqual(validateAbilityCatalog(), []);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateCommitmentCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    assert.equal(REDSTONE_FORGE_ROAD_PACK.id, 'pack-redstone-forge-road');
    assert.deepEqual(REDSTONE_FORGE_ROAD_PACK.dependencies, [
        'pack-shared-foundation',
        'pack-redstone-opening',
        'pack-redstone-ecology-breadth',
    ]);
    assert.ok(REDSTONE_FORGE_ROAD_PACK.records.items.some((entry) => entry.id === 'item-redstone-tempered-iron-bar'));
    assert.ok(REDSTONE_FORGE_ROAD_PACK.records.recipes.some((entry) => entry.id === 'craft-redstone-caravan-shoe'));
    assert.ok(REDSTONE_FORGE_ROAD_PACK.records.abilities.some((entry) => entry.id === 'ability-ridge-breaker'));
    assert.ok(REDSTONE_FORGE_ROAD_PACK.records.quests.some((entry) => entry.id === 'commitment-brasshaven-caravan-shoes'));

    const counts = collectContentScaleCounts();
    assert.ok(counts.items >= 56);
    assert.ok(counts.recipes >= 17);
    assert.ok(counts.abilities >= 9);
    assert.ok(counts.quests >= 11);
    assert.equal(counts.supplemental.contentPacks, 8);
    assert.ok(counts.supplemental.capabilities >= 12);
});

test('Redstone field inputs become provenance-bearing caravan hardware through existing forge work and satisfy a real contract exactly once', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');

    gainWorkProficiency(state, 'metalworking', 2, { sourceId: 'redstone-prior-copper-work' });
    addItem(state, getCanonicalResourceItem('item-redstone-iron-ore'), 4);
    addItem(state, getCanonicalResourceItem('item-redstone-sunstone-grit'), 4);

    completeForgeWork(state, 'process-redstone-iron-bloom');
    completeForgeWork(state, 'process-redstone-iron-bloom');
    completeForgeWork(state, 'process-redstone-forge-flux');
    completeForgeWork(state, 'process-redstone-forge-flux');
    completeForgeWork(state, 'process-redstone-tempered-iron');
    completeForgeWork(state, 'process-redstone-tempered-iron');
    completeForgeWork(state, 'craft-redstone-rivet-set');
    completeForgeWork(state, 'craft-redstone-caravan-shoe');

    const shoes = state.player.inventory.find((item) => item.id === 'item-redstone-caravan-shoe');
    assert.ok(shoes);
    assert.equal(shoes.quantity, 2);
    assert.equal(shoes.provenance[0].sourceId, 'craft-redstone-caravan-shoe');
    assert.ok(shoes.provenance[0].data.inputSources.some((entry) => entry.itemId === 'item-redstone-tempered-iron-bar'));
    assert.ok(getProductionItem('item-redstone-miners-brace').sinks.some((sink) => sink.type === 'equipment'));

    const beforeGil = state.player.wallet.gil;
    const accepted = acceptCommitment(state, 'commitment-brasshaven-caravan-shoes');
    assert.equal(accepted.ok, true, accepted.display?.text);
    const resolved = resolveCommitment(state, 'commitment-brasshaven-caravan-shoes');
    assert.equal(resolved.ok, true, resolved.display?.text);
    assert.equal(resolved.code, 'commitment.resolved');
    assert.equal(state.player.wallet.gil, beforeGil + 76);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-redstone-caravan-shoe'), false);

    const replay = resolveCommitment(state, 'commitment-brasshaven-caravan-shoes');
    assert.equal(replay.ok, true);
    assert.equal(replay.code, 'commitment.already-resolved');
    assert.equal(state.player.wallet.gil, beforeGil + 76);
});

test('a Redstone technique is character-owned and executable through the existing ability engine', () => {
    const state = createNewGameState({ nationId: 'brasshaven', mainJobId: 'vanguard' });
    grantCapability(state.player, 'technique-ridge-breaker', { source: 'instruction', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'axe', 2);
    state.player.equipment.mainHand = getEquipmentCatalogEntry('bronze-axe');
    state.player.resources.tp = 500;
    startEncounter(state, 'Redstone Ridge Ibex', { rng: () => 0 });

    const result = activateAbility(state, 'Ridge Breaker');
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(result.code, 'ability.resolved');
    assert.equal(result.data.activation.abilityId, 'ability-ridge-breaker');
    assert.equal(result.data.activation.costs.tp, 300);
    assert.equal(result.data.effects[0].type, 'damage');
});
