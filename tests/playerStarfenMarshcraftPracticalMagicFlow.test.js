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
    STARFEN_MARSHCRAFT_MAGIC_PACK,
} from '../js/text/data/regionalContentPacks.js';
import { getCanonicalResourceItem } from '../js/text/data/resourceItemRegistry.js';
import { createNewGameState } from '../js/text/gameState.js';
import {
    activateAbility,
    reconcileAbilityActivation,
} from '../js/text/systems/abilityEngine.js';
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
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
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

function qualifyLifewardenForMarshMending(state) {
    state.player.jobs.level = 2;
    state.player.progression.jobProgression.lifewarden.level = 2;
}

test('Starfen Marshcraft-Practical Magic is one Pack-v2-owned wetland production, schedule, commitment, and training tranche', () => {
    assert.deepEqual(validateCapabilityCatalog(), []);
    assert.deepEqual(validateAbilityCatalog(), []);
    assert.deepEqual(validateProductionCatalog(), []);
    assert.deepEqual(validateCommitmentCatalog(), []);
    assert.deepEqual(validateNpcScheduleDefinitions(), []);
    assert.deepEqual(validateNpcScheduleCatalog(), []);
    assert.deepEqual(validateContentPacks(REGIONAL_CONTENT_PACKS), []);

    assert.equal(STARFEN_MARSHCRAFT_MAGIC_PACK.id, 'pack-starfen-marshcraft-magic');
    assert.deepEqual(STARFEN_MARSHCRAFT_MAGIC_PACK.dependencies, [
        'pack-shared-foundation',
        'pack-starfen-opening',
        'pack-starfen-ecology-breadth',
    ]);
    assert.ok(STARFEN_MARSHCRAFT_MAGIC_PACK.records.items.some((entry) => entry.id === 'item-starfen-marsh-poultice'));
    assert.ok(STARFEN_MARSHCRAFT_MAGIC_PACK.records.recipes.some((entry) => entry.id === 'craft-starfen-marsh-survey-kit'));
    assert.ok(STARFEN_MARSHCRAFT_MAGIC_PACK.records.npcs.some((entry) => entry.id === 'npc-mistmere-pelu-senn'));
    assert.ok(STARFEN_MARSHCRAFT_MAGIC_PACK.records.npcSchedules.some((entry) => entry.id === 'schedule-mistmere-tavi-meren'));
    assert.ok(STARFEN_MARSHCRAFT_MAGIC_PACK.records.abilities.some((entry) => entry.id === 'ability-marsh-mending'));
    assert.ok(STARFEN_MARSHCRAFT_MAGIC_PACK.records.quests.some((entry) => entry.id === 'commitment-mistmere-marsh-survey-kit'));

    const counts = collectContentScaleCounts();
    assert.ok(counts.npcs >= 17);
    assert.ok(counts.items >= 68);
    assert.ok(counts.recipes >= 29);
    assert.ok(counts.abilities >= 17);
    assert.ok(counts.quests >= 18);
    assert.equal(counts.supplemental.contentPacks, 10);
    assert.ok(counts.supplemental.capabilities >= 20);
    assert.ok(counts.supplemental.npcSchedules >= 7);
    assert.ok(counts.supplemental.ownedPackRecords >= 199);
});

test('Starfen wetland inputs become provenance-bearing medicine and qualified Kiri instruction exactly once', () => {
    const state = createNewGameState({ nationId: 'mistmere', mainJobId: 'lifewarden' });
    assert.equal(state.currentPlaceId, 'mistmere-canal-ward');
    qualifyLifewardenForMarshMending(state);
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
    assert.equal(knowsCapability(state.player, 'spell-marsh-mending'), false);
    const accepted = acceptCommitment(state, 'commitment-mistmere-marsh-poultice');
    assert.equal(accepted.ok, true, accepted.display?.text);
    const resolved = resolveCommitment(state, 'commitment-mistmere-marsh-poultice');
    assert.equal(resolved.ok, true, resolved.display?.text);
    assert.equal(resolved.code, 'commitment.resolved');
    assert.equal(resolved.data.capabilityRewardId, 'spell-marsh-mending');
    assert.equal(resolved.data.capabilityLearned, true);
    assert.equal(knowsCapability(state.player, 'spell-marsh-mending'), true);
    assert.equal(state.player.progression.capabilities.known['spell-marsh-mending'].source, 'quest');
    assert.equal(state.player.wallet.gil, beforeGil + 48);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-starfen-marsh-poultice'), false);

    const learnedAt = state.player.progression.capabilities.known['spell-marsh-mending'].learnedAtWorldSeconds;
    const replay = resolveCommitment(state, 'commitment-mistmere-marsh-poultice');
    assert.equal(replay.ok, true);
    assert.equal(replay.code, 'commitment.already-resolved');
    assert.equal(state.player.wallet.gil, beforeGil + 48);
    assert.equal(state.player.progression.capabilities.known['spell-marsh-mending'].learnedAtWorldSeconds, learnedAt);

    setLearnedSkill(state.player, 'healingMagic', 2);
    state.player.resources.hp = Math.max(1, state.player.resources.hp - 20);
    const started = activateAbility(state, 'Marsh Mending');
    assert.equal(started.ok, true, started.display?.text);
    assert.equal(started.code, 'ability.started');
    advanceWorldTime(state, 5);
    const abilityResult = reconcileAbilityActivation(state);
    assert.equal(abilityResult.ok, true, abilityResult.display?.text);
    assert.equal(abilityResult.code, 'ability.resolved');
    assert.equal(abilityResult.data.activation.abilityId, 'ability-marsh-mending');
    assert.equal(abilityResult.data.effects[0].type, 'heal');
});

test('Starfen instruction requirements block resolution before delivery or reward mutation', () => {
    const state = createNewGameState({ nationId: 'mistmere', mainJobId: 'lifewarden' });
    addItem(state, getProductionItem('item-starfen-marsh-poultice'), 1);
    advanceWorldTime(state, 8 * 60 * 60);

    const beforeGil = state.player.wallet.gil;
    const accepted = acceptCommitment(state, 'commitment-mistmere-marsh-poultice');
    assert.equal(accepted.ok, true, accepted.display?.text);
    const blocked = resolveCommitment(state, 'commitment-mistmere-marsh-poultice');
    assert.equal(blocked.ok, false);
    assert.equal(blocked.code, 'commitment.requirements-unmet');
    assert.ok(blocked.data.blockers.some((entry) => entry.includes('Marsh Mending has not met a learning path')));
    assert.equal(state.player.wallet.gil, beforeGil);
    assert.equal(state.player.inventory.some((item) => item.id === 'item-starfen-marsh-poultice'), true);
    assert.equal(knowsCapability(state.player, 'spell-marsh-mending'), false);
});

test('Pelu and Tavi availability derives from canonical fictional time without a second social clock', () => {
    const state = createNewGameState({ nationId: 'mistmere' });
    const peluMorning = getNpcScheduleStatus(state, 'npc-mistmere-pelu-senn');
    const taviMorning = getNpcScheduleStatus(state, 'npc-mistmere-tavi-meren');
    assert.equal(peluMorning.available, true);
    assert.equal(peluMorning.windowSummary, '07:00–14:00');
    assert.equal(taviMorning.available, false);
    assert.equal(taviMorning.windowSummary, '10:00–18:00');

    advanceWorldTime(state, 2 * 60 * 60);
    assert.equal(getNpcScheduleStatus(state, 'npc-mistmere-pelu-senn').available, true);
    assert.equal(getNpcScheduleStatus(state, 'npc-mistmere-tavi-meren').available, true);
    assert.equal(Object.hasOwn(state, 'socialClock'), false);
});
