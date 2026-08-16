import test from 'node:test';
import assert from 'node:assert/strict';

import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadCharacter, saveGame } from '../js/text/save.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { updateBattlePhase } from '../js/text/systems/battleEngine.js';
import {
    createCampaignRecoveryModel,
    reconcileCampaignRecoveries,
    startCampaignRecovery,
} from '../js/text/systems/campaignRecoveryEngine.js';
import { performPlayerAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { advanceCombatSimulation } from '../js/text/systems/combatSimulationEngine.js';
import { finalizeCombatState } from '../js/text/systems/combatTurnEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { listResourceOpportunities } from '../js/text/systems/resourceOpportunityEngine.js';
import {
    reconcileCharacterResourceRecoveries,
    startCharacterResourceRecovery,
} from '../js/text/systems/resourceRecoveryWorkAdapter.js';
import { validateGameState } from '../js/text/systems/validation.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function model(state) {
    return createGameViewModel(state, createUiState({ screen: 'game', activeView: 'journal' }));
}

function category(view, categoryId) {
    return view.opportunities.entries.find((entry) => entry.category === categoryId) ?? null;
}

function reachRedstone(state) {
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);
    assert.equal(claimOriginStarterKit(state).ok, true);
    assert.match(equipItem(state, 'prospector-pick'), /Equipped/);
    const view = model(state);
    const training = category(view, 'training');
    assert.equal(training.action?.intent, 'travel.start');
    assert.equal(startTravel(state, training.action.payload.destinationId).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'south-redstone-reach');
    return state;
}

function winCurrentBattle(state) {
    for (let index = 0; index < 20 && state.activeBattle?.phase === 'active'; index += 1) {
        performPlayerAttack(state);
        if (state.activeBattle.phase === 'active') advanceCombatSimulation(state, 3);
    }
    assert.equal(state.activeBattle.phase, 'victory');
}

test('PX6 keeps livelihood and field danger as competing semantic goals, then resolves victory into exactly-once progression and a physical recovery opportunity', () => {
    const state = reachRedstone(createNewGameState({ nationId: 'brasshaven' }));
    let view = model(state);
    const training = category(view, 'training');
    const livelihood = category(view, 'livelihood');
    assert.equal(training.status, 'ready');
    assert.equal(training.action?.intent, 'combat.encounter');
    assert.equal(training.action?.payload.enemyId, 'enemy-redstone-burrower');
    assert.equal(livelihood.status, 'ready');
    assert.equal(livelihood.action?.intent, 'gathering.start');

    const started = startEncounter(state, training.action.payload.enemyId, { source: 'player-opportunity' });
    assert.equal(started.ok, true, started.message);
    view = model(state);
    assert.equal(view.contextualActions[0].intent, 'combat.attack');
    assert.ok(view.contextualActions.some((action) => action.intent === 'combat.wait'));

    const expBefore = state.player.progression.exp;
    const gilBefore = state.player.wallet.gil;
    winCurrentBattle(state);
    const expAfter = state.player.progression.exp;
    const gilAfter = state.player.wallet.gil;
    assert.ok(expAfter > expBefore);
    assert.ok(gilAfter > gilBefore);

    const resources = listResourceOpportunities(state);
    assert.equal(resources.length, 1);
    assert.equal(resources[0].sourceEnemyId, 'enemy-redstone-burrower');
    assert.equal(resources[0].placeId, 'south-redstone-reach');
    assert.equal(resources[0].actions[0].id, 'extract');
    assert.equal(state.player.inventory.some((item) => item.id === 'worm-segment'), false, 'battle victory must not auto-loot physical material');

    finalizeCombatState(state);
    assert.equal(state.player.progression.exp, expAfter, 'victory EXP must remain exactly once');
    assert.equal(state.player.wallet.gil, gilAfter, 'victory currency must remain exactly once');
    assert.equal(listResourceOpportunities(state).length, 1, 're-finalizing victory must not duplicate the body opportunity');

    view = model(state);
    const body = view.opportunities.entries.find((entry) => entry.id.startsWith('battle-resource-'));
    assert.ok(body);
    assert.equal(body.status, 'blocked');
    assert.equal(body.action, null);
    assert.ok(body.blockers.some((blocker) => /cutting/i.test(blocker)), 'the Brasshaven mining starter should not magically satisfy Redstone Burrower extraction');
});

test('PX6 recovery and defeated-body handling consume fictional time, survive real save/load, and return material with provenance', () => {
    installStorage();
    assert.equal(createAccountWithPassword('PX6 Save Audit', 'pwd', { persistentLogin: true }).ok, true);
    let state = reachRedstone(createNewGameState({ nationId: 'brasshaven', name: 'Danger Auditor' }));
    startEncounter(state, 'enemy-redstone-burrower', { source: 'player-opportunity' });
    winCurrentBattle(state);

    const maxHp = state.player.combat.resources.maxHp;
    if (state.player.resources.hp >= maxHp) state.player.resources.hp = maxHp - 1;
    const hpBefore = state.player.resources.hp;
    const timeBefore = state.worldTime.totalSeconds;
    let view = model(state);
    const recovery = view.opportunities.entries.find((entry) => entry.category === 'recovery' && entry.id.startsWith('recovery-'));
    assert.ok(recovery);
    assert.equal(recovery.status, 'ready');
    assert.equal(recovery.action?.intent, 'recovery.start');

    const recoveryStarted = startCampaignRecovery(state);
    assert.equal(recoveryStarted.ok, true, recoveryStarted.display?.text ?? recoveryStarted.reason);
    assert.equal(createCampaignRecoveryModel(state).active, true);
    assert.equal(saveGame(state), true);

    state = loadCharacter('Danger Auditor');
    assert.ok(state);
    assert.equal(createCampaignRecoveryModel(state).active, true, 'recovery task must persist through the real account save/load path');
    view = model(state);
    const activeRecovery = view.opportunities.entries.find((entry) => entry.category === 'recovery' && entry.id.startsWith('recovery-'));
    assert.equal(activeRecovery.status, 'active');
    assert.equal(activeRecovery.action?.intent, 'activity.advanceToCompletion');
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.worldTime.totalSeconds, timeBefore + 600);
    assert.ok(state.player.resources.hp > hpBefore);
    assert.ok(state.player.resources.hp <= maxHp);

    const knife = getEquipmentCatalogEntry('field-knife');
    assert.ok(knife);
    assert.equal(addItemToContainer(state.player.inventoryState, 'inventory', knife).ok, true);
    assert.match(equipItem(state, 'field-knife'), /Equipped/);

    view = model(state);
    const body = view.opportunities.entries.find((entry) => entry.id.startsWith('battle-resource-'));
    assert.ok(body);
    assert.equal(body.status, 'ready');
    assert.equal(body.action?.intent, 'resource.recovery.start');
    assert.equal(body.action?.payload.actionId, 'extract');
    const bodyStarted = startCharacterResourceRecovery(state, body.action.payload.opportunityId, body.action.payload.actionId, { rng: () => 0 });
    assert.equal(bodyStarted.ok, true, bodyStarted.display?.text ?? bodyStarted.reason);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);

    const segment = state.player.inventory.find((item) => item.id === 'worm-segment');
    assert.ok(segment);
    assert.ok(segment.provenance.some((entry) => entry.sourceId === 'enemy-redstone-burrower'));
    assert.ok(segment.provenance.some((entry) => entry.action === 'extract'));
    const quantityAfter = state.player.inventory.filter((item) => item.id === 'worm-segment').reduce((sum, item) => sum + item.quantity, 0);
    assert.deepEqual(reconcileCharacterResourceRecoveries(state), []);
    const repeatedQuantity = state.player.inventory.filter((item) => item.id === 'worm-segment').reduce((sum, item) => sum + item.quantity, 0);
    assert.equal(repeatedQuantity, quantityAfter, 'completed body recovery must resolve exactly once');
    assert.deepEqual(validateGameState(state), []);
});

test('PX6 defeat costs two fictional hours, retreats to known safety, restores only part of the party, and leaves the campaign readable', () => {
    const state = reachRedstone(createNewGameState({ nationId: 'brasshaven' }));
    assert.equal(startEncounter(state, 'enemy-redstone-burrower', { source: 'player-opportunity' }).ok, true);
    const battlePlayer = state.activeBattle.combatants.find((combatant) => combatant.type === 'player');
    battlePlayer.resources.hp = 0;
    battlePlayer.battle.defeated = true;
    updateBattlePhase(state.activeBattle);
    assert.equal(state.activeBattle.phase, 'defeat');
    finalizeCombatState(state);
    assert.equal(state.player.resources.hp, 0);

    let view = model(state);
    const defeat = view.opportunities.entries.find((entry) => entry.category === 'recovery' && entry.id.startsWith('recovery-'));
    assert.ok(defeat);
    assert.equal(defeat.title, 'Redstone Reach · Recover from defeat');
    assert.equal(defeat.regionLabel, 'Redstone Reach');
    assert.equal(defeat.currentRegion, true);
    assert.equal(defeat.action?.intent, 'recovery.start');

    const timeBefore = state.worldTime.totalSeconds;
    assert.equal(startCampaignRecovery(state).ok, true);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.worldTime.totalSeconds, timeBefore + 7200);
    assert.equal(state.currentPlaceId, 'brasshaven-market-ring');
    assert.equal(state.activeBattle.recoveryResolved, true);
    assert.ok(state.player.resources.hp > 0);
    assert.ok(state.player.resources.hp < state.player.combat.resources.maxHp, 'defeat recovery must not be a free full reset');
    assert.deepEqual(reconcileCampaignRecoveries(state), [], 'defeat recovery consequence must resolve exactly once');

    view = model(state);
    assert.ok(view.opportunities.entries.some((entry) => entry.category === 'livelihood'));
    assert.ok(view.opportunities.entries.some((entry) => entry.category === 'training'));
    assert.equal(view.opportunities.entries.some((entry) => entry.title.endsWith('Recover from defeat')), false);
    assert.deepEqual(validateGameState(state), []);
});