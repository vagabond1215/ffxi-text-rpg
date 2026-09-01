import { COMBAT_SIDES } from './battleEngine.js';
import { validateBattleAttentionState } from './combatAttentionEngine.js';
import { validatePersistedBattleDerivedCaches } from './battleDerivedCachePersistence.js';
import { COMBAT_ACTION_HISTORY_LIMIT, validateCombatContract } from './combatTurnEngine.js';
import { validatePersistedPlayerStatuses } from './playerStatusPersistence.js';

export const ACTIVE_BATTLE_PERSISTENCE_VERSION = 2;
const BATTLE_PHASES = Object.freeze(['active', 'victory', 'defeat']);
const COMBATANT_TYPES = Object.freeze(['player', 'companion', 'enemy']);

export function validatePersistedActiveBattle(battle) {
    const issues = [];
    if (!isObject(battle)) return ['activeBattle must be an object.'];
    if (!nonEmptyString(battle.id)) issues.push('activeBattle.id must be a non-empty string.');
    if (!Number.isInteger(battle.round) || battle.round < 1) issues.push('activeBattle.round must be a positive integer.');
    if (!BATTLE_PHASES.includes(battle.phase)) issues.push('activeBattle.phase is invalid.');
    if (!Array.isArray(battle.combatants) || battle.combatants.length < 2) {
        issues.push('activeBattle.combatants must contain at least two combatants.');
        return [...issues, ...prefix(validateCombatContract(battle), 'activeBattle.')];
    }
    issues.push(...prefix(validateBattleAttentionState(battle), 'activeBattle.'));
    if (!Array.isArray(battle.log)) issues.push('activeBattle.log must be an array.');
    else {
        if (battle.log.length > 100) issues.push('activeBattle.log must contain at most 100 entries.');
        battle.log.forEach((entry, index) => {
            if (typeof entry !== 'string') issues.push(`activeBattle.log[${index}] must be a string.`);
        });
    }
    if (battle.source !== undefined && !nonEmptyString(battle.source)) issues.push('activeBattle.source must be a non-empty string when present.');
    if (battle.sourceEnemyId !== undefined && !nonEmptyString(battle.sourceEnemyId)) issues.push('activeBattle.sourceEnemyId must be a non-empty string when present.');
    if (battle.sourcePopulationId !== undefined && !nonEmptyString(battle.sourcePopulationId)) issues.push('activeBattle.sourcePopulationId must be a non-empty string when present.');
    if (battle.sourceSpeciesId !== undefined && !nonEmptyString(battle.sourceSpeciesId)) issues.push('activeBattle.sourceSpeciesId must be a non-empty string when present.');
    if (battle.sourcePopulationConsumed !== undefined && typeof battle.sourcePopulationConsumed !== 'boolean') issues.push('activeBattle.sourcePopulationConsumed must be boolean when present.');
    if (battle.endLogged !== undefined && typeof battle.endLogged !== 'boolean') issues.push('activeBattle.endLogged must be boolean when present.');

    const ids = new Set();
    let playerCount = 0;
    let enemyCount = 0;
    let livingAllies = 0;
    let livingEnemies = 0;
    for (const [index, combatant] of battle.combatants.entries()) {
        const path = `activeBattle.combatants[${index}]`;
        if (!isObject(combatant)) {
            issues.push(`${path} must be an object.`);
            continue;
        }
        if (!nonEmptyString(combatant.id)) issues.push(`${path}.id must be a non-empty string.`);
        else if (ids.has(combatant.id)) issues.push(`${path}.id duplicates ${combatant.id}.`);
        else ids.add(combatant.id);
        if (!COMBATANT_TYPES.includes(combatant.type)) issues.push(`${path}.type is invalid.`);
        if (combatant.type === 'player') playerCount += 1;
        if (combatant.type === 'enemy') enemyCount += 1;
        if (!isObject(combatant.identity) || !nonEmptyString(combatant.identity.name)) issues.push(`${path}.identity.name must be a non-empty string.`);
        issues.push(...validateResources(combatant.resources, `${path}.resources`));
        if (!isObject(combatant.combat)) issues.push(`${path}.combat must be a persisted combat snapshot.`);
        else issues.push(...validatePersistedBattleDerivedCaches(combatant, path));
        if (!isObject(combatant.battle)) issues.push(`${path}.battle must be an object.`);
        else {
            if (![COMBAT_SIDES.ALLY, COMBAT_SIDES.ENEMY].includes(combatant.battle.side)) issues.push(`${path}.battle.side is invalid.`);
            if (combatant.type === 'enemy' && combatant.battle.side !== COMBAT_SIDES.ENEMY) issues.push(`${path}.battle.side must be enemy for enemy combatants.`);
            if (combatant.type !== 'enemy' && combatant.battle.side !== COMBAT_SIDES.ALLY) issues.push(`${path}.battle.side must be ally for player/companion combatants.`);
            if (typeof combatant.battle.defeated !== 'boolean') issues.push(`${path}.battle.defeated must be boolean.`);
            if (combatant.battle.targetId !== null && combatant.battle.targetId !== undefined && !nonEmptyString(combatant.battle.targetId)) issues.push(`${path}.battle.targetId must be null or a non-empty string.`);
            if (!isObject(combatant.battle.recasts)) issues.push(`${path}.battle.recasts must be an object.`);
            if (combatant.battle.casting !== null && combatant.battle.casting !== undefined && !isObject(combatant.battle.casting)) issues.push(`${path}.battle.casting must be null or an object.`);
            if (!Number.isFinite(combatant.battle.actionDelay) || combatant.battle.actionDelay < 0) issues.push(`${path}.battle.actionDelay must be a non-negative number.`);
            const alive = combatant.battle.defeated === false && Number.isInteger(combatant.resources?.hp) && combatant.resources.hp > 0;
            if (alive && combatant.battle.side === COMBAT_SIDES.ALLY) livingAllies += 1;
            if (alive && combatant.battle.side === COMBAT_SIDES.ENEMY) livingEnemies += 1;
        }
        if (Array.isArray(combatant.statuses)) issues.push(...prefix(validatePersistedPlayerStatuses(combatant.statuses), `${path}.`));
        else issues.push(`${path}.statuses must be an array.`);
    }
    if (playerCount !== 1) issues.push('activeBattle must contain exactly one player combatant.');
    if (enemyCount < 1) issues.push('activeBattle must contain at least one enemy combatant.');

    if (battle.phase === 'active' && (livingAllies < 1 || livingEnemies < 1)) issues.push('activeBattle.phase active requires at least one living ally and enemy.');
    if (battle.phase === 'victory' && (livingAllies < 1 || livingEnemies !== 0)) issues.push('activeBattle.phase victory requires living allies and no living enemies.');
    if (battle.phase === 'defeat' && livingAllies !== 0) issues.push('activeBattle.phase defeat requires no living allies.');

    const contractIssues = validateCombatContract(battle);
    issues.push(...prefix(contractIssues, 'activeBattle.'));
    if (isObject(battle.contract) && Array.isArray(battle.contract.actions)) {
        const maxSequence = battle.contract.actions.reduce((max, action) => {
            const match = /^combat-action-(\d+)$/.exec(action?.id ?? '');
            return match ? Math.max(max, Number(match[1])) : max;
        }, 0);
        if (Number.isInteger(battle.contract.actionSequence) && battle.contract.actionSequence < maxSequence) issues.push('activeBattle.contract.actionSequence must be at least the greatest stored action id sequence.');
        const expectedLast = battle.contract.actions.at(-1)?.id ?? null;
        if ((battle.contract.lastActionId ?? null) !== expectedLast) issues.push('activeBattle.contract.lastActionId must match the latest stored action id.');
        if (battle.contract.actions.length > COMBAT_ACTION_HISTORY_LIMIT) issues.push(`activeBattle.contract.actions must contain at most ${COMBAT_ACTION_HISTORY_LIMIT} records.`);
        for (const [index, action] of battle.contract.actions.entries()) {
            if (nonEmptyString(action?.actorId) && !ids.has(action.actorId)) issues.push(`activeBattle.contract.actions[${index}].actorId must reference a combatant.`);
            if (action?.targetId !== null && action?.targetId !== undefined && (!nonEmptyString(action.targetId) || !ids.has(action.targetId))) issues.push(`activeBattle.contract.actions[${index}].targetId must reference a combatant or be null.`);
        }
    }
    const ready = battle.contract?.timeline?.readyAtByActorId;
    if (isObject(ready)) {
        for (const actorId of Object.keys(ready)) if (!ids.has(actorId)) issues.push(`activeBattle.contract.timeline contains unknown actor ${actorId}.`);
        for (const actorId of ids) if (!Object.hasOwn(ready, actorId)) issues.push(`activeBattle.contract.timeline is missing actor ${actorId}.`);
    }
    return issues;
}

function validateResources(resources, path) {
    if (!isObject(resources)) return [`${path} must be an object.`];
    const issues = [];
    for (const key of ['hp', 'mp', 'tp']) if (!Number.isInteger(resources[key]) || resources[key] < 0) issues.push(`${path}.${key} must be a non-negative integer.`);
    return issues;
}

function prefix(issues, value) {
    return issues.map((issue) => `${value}${issue}`);
}
function nonEmptyString(value) {
    return typeof value === 'string' && Boolean(value.trim());
}
function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
