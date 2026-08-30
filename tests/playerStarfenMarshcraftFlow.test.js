import test from 'node:test';
import assert from 'node:assert/strict';

import { validateAbilityCatalog } from '../js/text/data/abilities.js';
import { validateCapabilityCatalog } from '../js/text/data/capabilities.js';
import { validateCommitmentCatalog } from '../js/text/data/commitments.js';
import { validateNpcScheduleCatalog as validateNpcScheduleDefinitions } from '../js/text/data/npcSchedules.js';
import { validateProductionCatalog } from '../js/text/data/productionCatalog.js';
import { getProductionItem } from '../js/text/data/productionItems.js';
import {
    REGIONAL_CONTENT_PACKS,
    STARFEN_MARSHCRAFT_PACK,
} from '../js/text/data/regionalContentPacks.js';
import { getCanonicalResourceItem } from '../js/text/data/resourceItemRegistry.js';
import { createNewGameState } from '../js/text/gameState.js';
import { knowsCapability } from '../js/text/systems/capabilityEngine.js';
import {
    acceptCommitment,
    resolveCommitment,
} from '../js/text/systems/commitmentEngine.js';
import { validateContentPacks } from '../js/text/systems/contentPackValidator.js';
import { collectContentScaleCounts } from '../js/text/systems/contentScaleGate.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import {
    getNpcScheduleStatus,
    validateNpcScheduleCatalog,
} from '../js/text/systems/npcScheduleEngine.js';
import {
    reconcileProductionWork,
    startProductionWork,
} from '../js/text/systems/productionEngine.js';
import { gainWorkProficiency } from '../js/text/systems/workProficiencyEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';

function addItem(state, item, quantity = 1) {
    assert.ok(item, 'expected canonical item');
    const added = addItemToContainer(state.player.inventoryState, 'inventory', { ...item, quantity });
    assert.equal(added.ok, true, added.reason);
}

function completeWork(state, processId, stationTag) {
    const started = startProductionWork(state, processId, { stationTags: stationTag ? [stationTag] : [] });
    assert.equal(started.ok, true, started.display?.text ?? started.code);
    advanceWorldTime(state, started.data.task.durationSeconds);
    const results = reconcileProductionWork(state);
    const completed = results.find((entry) => entry.data?.work?.data?.processId === processId) ?? results[0];
    assert.ok(completed, `expected completion for ${processId}`);
    assert.equal(completed.ok, true, completed.display?.text ?? completed.code);
    assert.equal(completed.code, 'production.completed');
    return completed;
}

test('Starfen Marshcraft remains a regional production and community tranche while magic ownership is shared', () => {
    assert.deepEqual(validateCapabilityCatalog(), []);
    assert.deepEqual(validateAbilityCatalog(), []);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateCommitmentCatalog(), []);
    assert.deepEqual(validateNpcScheduleDefinitions(), []);
    assert.deepEqual(validateNpcScheduleCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    assert.equal(STARFEN_MARSHCRAFT_PACK.id, 'pack-starfen-marshcraft');
    assert.deepEqual(STARFEN_MARSHCRAFT_PACK.dependencies, [
        'pack-shared-foundation',
        'pack-starfen-opening',
        'pack-starfen-ecology-breadth',
    ]);
    assert.ok(STARFEN_MARSHCRAFT_PACK.records.items.some((entry) => entry.id === 'item-starfen-marsh-poultice'));
    assert.ok(STARFEN_MARSHCRAFT_PACK.records.recipes.some((entry) => entry.id === 'craft-starfen-marsh-survey-kit'));
    assert.ok(STARFEN_MARSHCRAFT_PACK.records.npcs.some((entry) => entry.id === 'npc-mistmere-pelu-senn'));
    assert.ok(STARFEN_MARSHCRAFT_PACK.records.npcSchedules.some((entry) => entry.id === 'schedule-mistmere-tavi-meren'));
    assert.deepEqual(STARFEN_MARSHCRAFT_PACK.records.capabilities.map((entry) => entry.id), ['practical-starfen-current-reading']);
    assert.deepEqual(STARFEN_MARSHCRAFT_PACK.records.abilities.map((entry) => entry.id), ['ability-starfen-current-reading']);
    assert.ok(STARFEN_MARSHCRAFT_PACK.records.quests.some((entry) => entry.id === 'commitment-mistmere-marsh-survey-kit'));

    const counts = collectContentScaleCounts();
    assert.ok(counts.npcs >= 17);
    assert.ok(counts.items >= 68);
    assert.ok(counts.recipes >= 29);
    assert.ok(counts.abilities >= 41);
    assert.ok(counts.quests >= 18);
    assert.equal(counts.supplemental.contentPacks, 33);
    assert.ok(counts.supplemental.capabilities >= 44);
    assert.ok(counts.supplemental.npcSchedules >= 7);
    assert.ok(counts.supplemental.ownedPackRecords >= 248);
});

test('Starfen wetland inputs become provenance-bearing medicine and civic delivery without gating universal magic', () => {
    const state = createNewGameState({ nationId: 'mistmere', mainJobId: 'lifewarden' });
    assert.equal(state.currentPlaceId, 'mistmere-canal-ward');
    gainWorkProficiency(state, 'cooking', 2, { sourceId: 'starfen-prior-kitchen-work' });

    addItem(state, getCanonicalResourceItem('item-starfen-bluekelp'), 2);
    addItem(state, getCanonicalResourceItem('item-starfen-marrowleaf'), 1);
    completeWork(state, 'process-starfen-bluekelp-extract', 'kitchen');
    completeWork(state, 'craft-starfen-marsh-poultice', 'kitchen');

    const poultice = state.player.inventory.find((item) => item.id === 'item-starfen-marsh-poultice');
    assert.ok(poultice);
    assert.equal(poultice.provenance[0].sourceId, 'craft-starfen-marsh-poultice');
    assert.ok(poultice.provenance[0].data.inputSources.some((entry) => entry.itemId === 'item-starfen-bluekelp-extract'));
    assert.ok(poultice.provenance[0].data.inputSources.some((entry) => entry.itemId === 'item-starfen-marrowleaf'));

    assert.equal(getNpcScheduleStatus(state, 'npc-mistmere-kiri-fen').available, false);
    advanceWorldTime(state, 8 * 60 * 60);
    assert.equal(getNpcScheduleStatus(state, 'npc-mistmere-kiri-fen').available, true);

    const beforeGil = state.player.wallet.gil;
    assert.equal(knowsCapability(state.player, 'spell-wellspring-mending'), false);
    assert.equal(acceptCommitment(state, 'commitment-mistmere-marsh-poultice').ok, true);
    const resolved = resolveCommitment(state, 'commitment-mistmere-marsh-poultice');
    assert.equal(resolved.ok, true, resolved.display?.text);
    assert.equal(resolved.code, 'commitment.resolved');
    assert.equal(resolved.data.capabilityRewardId, null);
    assert.equal(resolved.data.capabilityLearned, false);
    assert.equal(knowsCapability(state.player, 'spell-wellspring-mending'), false);
    assert.equal(state.player.wallet.gil, beforeGil + 48);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-starfen-marsh-poultice'), false);

    const replay = resolveCommitment(state, 'commitment-mistmere-marsh-poultice');
    assert.equal(replay.ok, true);
    assert.equal(replay.code, 'commitment.already-resolved');
    assert.equal(state.player.wallet.gil, beforeGil + 48);
});

test('regional Current Reading instruction still checks character training atomically because it is field knowledge, not magic', () => {
    const state = createNewGameState({ nationId: 'mistmere', mainJobId: 'wayfinder' });
    addItem(state, getProductionItem('item-starfen-marsh-survey-kit'), 1);

    const beforeGil = state.player.wallet.gil;
    assert.equal(acceptCommitment(state, 'commitment-mistmere-marsh-survey-kit').ok, true);
    const blocked = resolveCommitment(state, 'commitment-mistmere-marsh-survey-kit');
    assert.equal(blocked.ok, false);
    assert.equal(blocked.code, 'commitment.requirements-unmet');
    assert.equal(state.player.wallet.gil, beforeGil);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-starfen-marsh-survey-kit'), true);
    assert.equal(knowsCapability(state.player, 'practical-starfen-current-reading'), false);

    state.player.jobs.level = 2;
    state.player.progression.jobProgression.wayfinder.level = 2;
    const resolved = resolveCommitment(state, 'commitment-mistmere-marsh-survey-kit');
    assert.equal(resolved.ok, true, resolved.display?.text);
    assert.equal(resolved.data.capabilityRewardId, 'practical-starfen-current-reading');
    assert.equal(resolved.data.capabilityLearned, true);
    assert.equal(knowsCapability(state.player, 'practical-starfen-current-reading'), true);
});

test('Pelu and Tavi availability derives from canonical fictional time without a second social clock', () => {
    const state = createNewGameState({ nationId: 'mistmere' });
    const peluMorning = getNpcScheduleStatus(state, 'npc-mistmere-pelu-senn');
    const taviMorning = getNpcScheduleStatus(state, 'npc-mistmere-tavi-meren');
    assert.equal(peluMorning.available, true);
    assert.equal(peluMorning.windowSummary, '07:00–14:00');
    assert.equal(taviMorning.available, true);
    assert.equal(taviMorning.windowSummary, '08:00–18:00');

    advanceWorldTime(state, 9 * 60 * 60);
    assert.equal(getNpcScheduleStatus(state, 'npc-mistmere-pelu-senn').available, false);
    assert.equal(getNpcScheduleStatus(state, 'npc-mistmere-tavi-meren').available, true);
    assert.equal(Object.hasOwn(state, 'socialClock'), false);
});
