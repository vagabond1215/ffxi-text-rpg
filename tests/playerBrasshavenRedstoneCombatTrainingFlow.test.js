import test from 'node:test';
import assert from 'node:assert/strict';
import { useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { createNewGameState } from '../js/text/gameState.js';
import { activateAbility } from '../js/text/systems/abilityEngine.js';
import { grantCapability, knowsCapability } from '../js/text/systems/capabilityEngine.js';
import { performPlayerAttack, performPlayerRangedAttack, startEncounter } from '../js/text/systems/combatActionEngine.js';
import { getEnemyAttentionSnapshot, setAggroTarget, setAttentionBaseline } from '../js/text/systems/combatAttentionEngine.js';
import { advanceCombatSimulation } from '../js/text/systems/combatSimulationEngine.js';
import { getArmorPressureReport, startCombatEquipTransition } from '../js/text/systems/combatLoadoutEngine.js';
import { getCombatantReadyAt, setCombatantReadyAt } from '../js/text/systems/combatTurnEngine.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { recruitCompanion } from '../js/text/systems/partyEngine.js';
import { awardExperience } from '../js/text/systems/progressionEngine.js';
import { getLearnedSkill, setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';
import { applyStatus } from '../js/text/systems/statusEngine.js';
import { describeTrainingServiceAtPoi, trainCapabilityAtPoi, validateTrainingServiceDefinitions } from '../js/text/systems/trainingServiceEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { advanceActiveActivityToCompletion } from '../js/text/systems/activityAdvanceEngine.js';
import { startTravel } from '../js/text/systems/travelEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';

const VARRIC_POI = 'poi-bastok-markets-rabid-wolf';

test('B5 Varric training service is player-facing and preserves capability learning authority', () => {
    assert.deepEqual(validateTrainingServiceDefinitions(), []);
    const state = createNewGameState({ nationId: 'brasshaven', mainJobId: 'vanguard' });
    useKnownPoi(state, VARRIC_POI, 'training');

    const early = trainCapabilityAtPoi(state, 'Rivet Guard', VARRIC_POI);
    assert.equal(early.ok, false);
    assert.equal(early.code, 'training.learning-requirement');
    assert.equal(knowsCapability(state.player, 'technique-rivet-guard'), false);

    const training = awardExperience(state.player, 1000);
    assert.ok(training.after.level >= 3);
    const view = createGameViewModel(state);
    assert.ok(view.contextualActions.some((action) => action.intent === 'locality.poi' && action.payload.action === 'training'));
    assert.ok(view.contextualActions.some((action) => action.intent === 'training.learn' && action.payload.capabilityId === 'technique-rivet-guard'));
    assert.match(describeTrainingServiceAtPoi(state, VARRIC_POI), /Rivet Guard: ready to learn/);

    const learned = trainCapabilityAtPoi(state, 'Rivet Guard', VARRIC_POI);
    assert.equal(learned.ok, true, learned.display.text);
    assert.equal(learned.code, 'training.capability-learned');
    assert.equal(knowsCapability(state.player, 'technique-rivet-guard'), true);
    assert.equal(state.player.progression.capabilities.known['technique-rivet-guard'].source, 'instruction');
    assert.ok(state.events.some((event) => event.type === 'training.capability-learned' && event.data.capabilityId === 'technique-rivet-guard'));
});

test('B5 Brasshaven Redstone combat-training proof composes B1 through B4 without new combat authority', () => {
    const state = createNewGameState({ nationId: 'brasshaven', mainJobId: 'vanguard' });
    awardExperience(state.player, 1000);
    useKnownPoi(state, VARRIC_POI, 'training');
    assert.equal(trainCapabilityAtPoi(state, 'Rivet Guard', VARRIC_POI).ok, true);
    assert.equal(trainCapabilityAtPoi(state, 'Ridge Breaker', VARRIC_POI).ok, true);

    // Prior magical study remains character-owned even while Vanguard is active.
    assert.equal(grantCapability(state.player, 'spell-ember-dart', { source: 'grant', worldSeconds: state.worldTime.totalSeconds }).ok, true);
    setLearnedSkill(state.player, 'elementalMagic', 1);
    setLearnedSkill(state.player, 'sword', 1);
    setLearnedSkill(state.player, 'axe', 2);

    for (const id of ['bronze-sword', 'bronze-axe', 'braided-sling', 'rounded-sling-stones', 'leather-vest', 'bronze-harness']) addEquipment(state, id);
    assert.match(equipItem(state, 'bronze-sword'), /Equipped Bronze Sword/);
    assert.match(equipItem(state, 'braided-sling'), /Equipped Braided Sling/);
    assert.match(equipItem(state, 'rounded-sling-stones'), /Equipped Rounded Sling Stones/);
    assert.match(equipItem(state, 'leather-vest'), /Equipped Leather Vest/);

    const companion = recruitCompanion(state, 'companion-sable-renn', { ignoreRequirements: true });
    assert.equal(companion.ok, true, companion.display?.text);

    const outbound = startTravel(state, 'south-redstone-reach');
    assert.equal(outbound.ok, true, outbound.display?.text);
    assert.equal(advanceActiveActivityToCompletion(state).ok, true);
    assert.equal(state.currentPlaceId, 'south-redstone-reach');

    state.player.resources.tp = 900;
    state.player.resources.mp = 100;
    const started = startEncounter(state, 'Redstone Ridge Ibex', { rng: () => 0 });
    assert.equal(started.ok, true, started.message);
    const player = state.activeBattle.combatants.find((entry) => entry.type === 'player');
    const ally = state.activeBattle.combatants.find((entry) => entry.type === 'companion');
    const enemy = state.activeBattle.combatants.find((entry) => entry.type === 'enemy');
    assert.ok(player && ally && enemy);
    player.resources.tp = 900;
    player.resources.mp = 100;
    enemy.resources.hp = 999;
    enemy.combat.resources.maxHp = 999;
    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);

    // B2 pressure has two credible party actors and initially sticks to the player.
    setAttentionBaseline(state.activeBattle, enemy.id, player.id, { baseline: 60 });
    setAttentionBaseline(state.activeBattle, enemy.id, ally.id, { baseline: 30 });
    setAggroTarget(state.activeBattle, enemy.id, player.id);
    const attention = getEnemyAttentionSnapshot(state.activeBattle, enemy.id);
    assert.equal(attention.entries.length, 2);
    assert.equal(attention.aggroTargetId, player.id);

    // B4 cadence/kata plus existing skill progression: one sword attack raises skill 1 -> 2.
    const swordBefore = getLearnedSkill(state.player, 'sword');
    performPlayerAttack(state);
    const basic = playerActions(state).find((action) => action.kind === 'basicAttack');
    assert.equal(basic.data.cadence.delayUnits, 236);
    assert.equal(basic.data.kata.family, 'sword');
    assert.equal(getLearnedSkill(state.player, 'sword'), swordBefore + 1);
    assert.equal(getCombatantReadyAt(state, player.id), basic.atWorldSeconds + 4);

    advanceCombatSimulation(state, 4);
    const rivet = activateAbility(state, 'Rivet Guard');
    assert.equal(rivet.ok, true, rivet.display?.text);
    assert.equal(rivet.code, 'ability.resolved');
    assert.equal(rivet.data.effects.some((effect) => effect.type === 'status'), true);

    advanceCombatSimulation(state, 3);
    const ammoBefore = state.player.equipment.ammo.quantity;
    performPlayerRangedAttack(state);
    const ranged = playerActions(state).find((action) => action.kind === 'rangedAttack');
    assert.ok(ranged);
    assert.equal(ranged.data.resolution.accuracy.model, 'ranged');
    assert.equal(state.player.equipment.ammo.quantity, ammoBefore - 1);

    advanceCombatSimulation(state, 4);
    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);
    const emberStarted = activateAbility(state, 'Ember Dart');
    assert.equal(emberStarted.code, 'ability.started');
    const emberAdvance = advanceCombatSimulation(state, 6);
    assert.equal(emberAdvance.abilityResult?.code, 'ability.resolved');
    assert.equal(emberAdvance.abilityResult.data.effects[0].resolution.element.element, 'fire');

    // B3 weapon-set transition is legal under pressure and resets the B4 sequence to the axe family (unsupported kata family -> null).
    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);
    advanceCombatSimulation(state, 2);
    const weaponSwap = startCombatEquipTransition(state, 'bronze-axe');
    assert.equal(weaponSwap.ok, true, weaponSwap.display.text);
    const weaponAdvance = advanceCombatSimulation(state, weaponSwap.data.transition.durationSeconds);
    assert.equal(weaponAdvance.loadoutResult?.ok, true, weaponAdvance.message);
    assert.equal(state.player.equipment.mainHand.id, 'bronze-axe');
    assert.equal(state.activeBattle.weaponKata.byActorId[player.id].family, null);

    const weaponRecovery = Math.max(0, getCombatantReadyAt(state, player.id) - state.worldTime.totalSeconds);
    if (weaponRecovery) advanceCombatSimulation(state, weaponRecovery);
    const ridge = activateAbility(state, 'Ridge Breaker');
    assert.equal(ridge.ok, true, ridge.display?.text);
    assert.equal(ridge.data.effects[0].resolution.defense.penetration, 0.25);

    // Full armor change is blocked while this hostile still carries player pressure.
    const blockedPressure = getArmorPressureReport(state, player.id);
    assert.equal(blockedPressure.blocked, true);
    const blockedArmor = startCombatEquipTransition(state, 'bronze-harness');
    assert.equal(blockedArmor.ok, false);
    assert.equal(blockedArmor.code, 'combat.loadout.armor-pressure');

    // B5 does not invent LOS/pursuit. A real existing hard-disable state removes immediate pressure.
    applyStatus(enemy, {
        id: 'status-b5-training-stun',
        name: 'Training Stun',
        category: 'debuff',
        durationSeconds: 20,
        stackGroup: 'b5-training-stun',
        stackRule: 'replace',
        modifiers: {},
        flags: { stunned: true },
    }, { nowWorldSeconds: state.worldTime.totalSeconds });
    assert.equal(getArmorPressureReport(state, player.id).blocked, false);
    setCombatantReadyAt(state, enemy.id, state.worldTime.totalSeconds + 100000);

    const actionRecovery = Math.max(0, getCombatantReadyAt(state, player.id) - state.worldTime.totalSeconds);
    if (actionRecovery) advanceCombatSimulation(state, actionRecovery);
    const armorSwap = startCombatEquipTransition(state, 'bronze-harness');
    assert.equal(armorSwap.ok, true, armorSwap.display.text);
    const armorAdvance = advanceCombatSimulation(state, armorSwap.data.transition.durationSeconds);
    assert.equal(armorAdvance.loadoutResult?.ok, true, armorAdvance.message);
    assert.equal(state.player.equipment.body.id, 'bronze-harness');

    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

function addEquipment(state, id) {
    const item = getEquipmentCatalogEntry(id);
    assert.ok(item, `missing equipment ${id}`);
    const added = addItemToContainer(state.player.inventoryState, 'inventory', structuredClone(item));
    assert.equal(added.ok, true, added.reason);
}

function playerActions(state) {
    return state.activeBattle.contract.actions.filter((action) => action.actorType === 'player');
}