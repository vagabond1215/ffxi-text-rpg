import test from 'node:test';
import assert from 'node:assert/strict';

import { validateAbilityCatalog } from '../js/text/data/abilities.js';
import { validateCapabilityCatalog } from '../js/text/data/capabilities.js';
import { validateCommitmentCatalog } from '../js/text/data/commitments.js';
import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { validateNpcScheduleCatalog as validateNpcScheduleDefinitions } from '../js/text/data/npcSchedules.js';
import { validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import {
    ELDERWOOD_HUNT_TIMBER_PACK,
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
    getNpcScheduleStatus,
    validateNpcScheduleCatalog,
} from '../js/text/systems/npcScheduleEngine.js';
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

function completeWork(state, processId, stationTag) {
    const started = startProductionWork(state, processId, { stationTags: [stationTag] });
    assert.equal(started.ok, true, started.display?.text ?? started.code);
    advanceWorldTime(state, started.data.task.durationSeconds);
    const results = reconcileProductionWork(state);
    const completed = results.find((entry) => entry.data?.work?.data?.processId === processId) ?? results[0];
    assert.ok(completed, `expected completion for ${processId}`);
    assert.equal(completed.ok, true, completed.display?.text ?? completed.code);
    assert.equal(completed.code, 'production.completed');
    return completed;
}

test('Elderwood Hunt-Timber is one Pack-v2-owned hunt, forestry, production, civic, and technique tranche', () => {
    assert.deepEqual(validateCapabilityCatalog(), []);
    assert.deepEqual(validateAbilityCatalog(), []);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateCommitmentCatalog(), []);
    assert.deepEqual(validateNpcScheduleDefinitions(), []);
    assert.deepEqual(validateNpcScheduleCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    assert.equal(ELDERWOOD_HUNT_TIMBER_PACK.id, 'pack-elderwood-hunt-timber');
    assert.deepEqual(ELDERWOOD_HUNT_TIMBER_PACK.dependencies, [
        'pack-shared-foundation',
        'pack-elderwood-opening',
        'pack-elderwood-ecology-breadth',
    ]);
    assert.ok(ELDERWOOD_HUNT_TIMBER_PACK.records.items.some((entry) => entry.id === 'item-elderwood-tanned-hide'));
    assert.ok(ELDERWOOD_HUNT_TIMBER_PACK.records.recipes.some((entry) => entry.id === 'craft-elderwood-trail-repair-bundle'));
    assert.ok(ELDERWOOD_HUNT_TIMBER_PACK.records.npcs.some((entry) => entry.id === 'npc-thornwall-oren-vale'));
    assert.ok(ELDERWOOD_HUNT_TIMBER_PACK.records.abilities.some((entry) => entry.id === 'ability-barkboar-brace'));
    assert.ok(ELDERWOOD_HUNT_TIMBER_PACK.records.quests.some((entry) => entry.id === 'commitment-thornwall-trail-repair-bundles'));

    const counts = collectContentScaleCounts();
    assert.ok(counts.npcs >= 15);
    assert.ok(counts.items >= 62);
    assert.ok(counts.recipes >= 23);
    assert.ok(counts.abilities >= 13);
    assert.ok(counts.quests >= 14);
    assert.equal(counts.supplemental.contentPacks, 36);
    assert.ok(counts.supplemental.capabilities >= 16);
    assert.ok(counts.supplemental.npcSchedules >= 5);
    assert.ok(counts.supplemental.ownedPackRecords >= 171);
});

test('Barkboar recovery and forest gathering become provenance-bearing field gear and road repair stock with exactly-once civic delivery', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    assert.equal(state.currentPlaceId, 'thornwall-southgate');

    gainWorkProficiency(state, 'crafting', 4, { sourceId: 'elderwood-prior-fieldcraft' });
    addItem(state, getCanonicalResourceItem('item-elderwood-barkboar-hide'), 4);
    addItem(state, getCanonicalResourceItem('item-elderwood-duskcap'), 2);
    addItem(state, getCanonicalResourceItem('item-elderwood-amber-resin'), 6);
    addItem(state, getCanonicalResourceItem('item-elderwood-hardwood'), 2);

    completeWork(state, 'process-elderwood-tanned-hide', 'tannery');
    completeWork(state, 'process-elderwood-tanned-hide', 'tannery');
    completeWork(state, 'craft-elderwood-hide-binding', 'tannery');
    completeWork(state, 'craft-elderwood-hide-binding', 'tannery');
    completeWork(state, 'craft-elderwood-resin-board', 'woodshop');
    completeWork(state, 'craft-elderwood-resin-board', 'woodshop');
    completeWork(state, 'process-elderwood-resin-pitch', 'woodshop');
    completeWork(state, 'craft-elderwood-forester-gloves', 'tannery');
    completeWork(state, 'craft-elderwood-hunters-bracer', 'woodshop');

    // Add one more binding for the road bundle after the two wearable pieces have consumed the first pair.
    addItem(state, getCanonicalResourceItem('item-elderwood-barkboar-hide'), 1);
    addItem(state, getCanonicalResourceItem('item-elderwood-amber-resin'), 1);
    completeWork(state, 'craft-elderwood-hide-binding', 'tannery');
    completeWork(state, 'craft-elderwood-trail-repair-bundle', 'woodshop');

    const gloves = state.player.inventory.find((item) => item.id === 'item-elderwood-forester-gloves');
    const bracer = state.player.inventory.find((item) => item.id === 'item-elderwood-hunters-bracer');
    const bundles = state.player.inventory.find((item) => item.id === 'item-elderwood-trail-repair-bundle');
    assert.ok(gloves);
    assert.ok(bracer);
    assert.ok(bundles);
    assert.equal(bundles.quantity, 2);
    assert.equal(bundles.provenance[0].sourceId, 'craft-elderwood-trail-repair-bundle');
    assert.ok(bundles.provenance[0].data.inputSources.some((entry) => entry.itemId === 'item-elderwood-resin-board'));
    assert.ok(bundles.provenance[0].data.inputSources.some((entry) => entry.itemId === 'item-elderwood-hide-binding'));
    assert.ok(getProductionItem('item-elderwood-forester-gloves').sinks.some((sink) => sink.type === 'equipment'));

    const oren = getNpcScheduleStatus(state, 'npc-thornwall-oren-vale');
    assert.equal(oren.scheduled, true);
    assert.equal(oren.available, true);

    const beforeGil = state.player.wallet.gil;
    const accepted = acceptCommitment(state, 'commitment-thornwall-trail-repair-bundles');
    assert.equal(accepted.ok, true, accepted.display?.text);
    const resolved = resolveCommitment(state, 'commitment-thornwall-trail-repair-bundles');
    assert.equal(resolved.ok, true, resolved.display?.text);
    assert.equal(resolved.code, 'commitment.resolved');
    assert.equal(state.player.wallet.gil, beforeGil + 84);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-elderwood-trail-repair-bundle'), false);

    const replay = resolveCommitment(state, 'commitment-thornwall-trail-repair-bundles');
    assert.equal(replay.ok, true);
    assert.equal(replay.code, 'commitment.already-resolved');
    assert.equal(state.player.wallet.gil, beforeGil + 84);
});

test('Oren road works availability is derived from fictional time rather than a social clock', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    const morning = getNpcScheduleStatus(state, 'npc-thornwall-oren-vale');
    assert.equal(morning.available, true);
    assert.equal(morning.windowSummary, '07:00–15:00');

    advanceWorldTime(state, 8 * 60 * 60);
    const late = getNpcScheduleStatus(state, 'npc-thornwall-oren-vale');
    assert.equal(late.available, false);
    assert.equal(late.nextAvailableSecondOfDay, 7 * 60 * 60);
    assert.equal(Object.hasOwn(state, 'socialClock'), false);
});

test('Barkboar Brace is character-owned and executable through the existing ability engine', () => {
    const state = createNewGameState({ nationId: 'thornwall', mainJobId: 'vanguard' });
    grantCapability(state.player, 'technique-barkboar-brace', { source: 'instruction', worldSeconds: state.worldTime.totalSeconds });
    setLearnedSkill(state.player, 'axe', 2);
    state.player.equipment.mainHand = getEquipmentCatalogEntry('bronze-axe');
    state.player.resources.tp = 500;
    startEncounter(state, 'Elderwood Barkboar', { rng: () => 0 });

    const result = activateAbility(state, 'Barkboar Brace');
    assert.equal(result.ok, true, result.display?.text);
    assert.equal(result.code, 'ability.resolved');
    assert.equal(result.data.activation.abilityId, 'ability-barkboar-brace');
    assert.equal(result.data.activation.costs.tp, 300);
    assert.equal(result.data.effects[0].type, 'damage');
    assert.equal(result.data.effects[1].type, 'status');
});
