import test from 'node:test';
import assert from 'node:assert/strict';

import { getExpToNextLevel } from '../js/text/data/expTables.js';
import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, decodePayload, encodePayload, loadCharacter, saveGame } from '../js/text/save.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { awardExperience, switchMainJob } from '../js/text/systems/progressionEngine.js';
import { setLearnedSkill } from '../js/text/systems/skillProgressionEngine.js';

class MemoryStorage {
    constructor() { this.values = new Map(); }
    getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
}

function installAccount(name) {
    globalThis.localStorage = new MemoryStorage();
    assert.equal(createAccountWithPassword(name, 'pwd', { persistentLogin: true }).ok, true);
}

function corruptStoredCharacter(characterName, mutate) {
    const key = 'hearthHorizonAccounts';
    const registry = decodePayload(globalThis.localStorage.getItem(key));
    const record = registry.accounts[0].characters.find((entry) => entry.name === characterName);
    assert.ok(record);
    const state = decodePayload(record.encodedState);
    mutate(state);
    record.encodedState = encodePayload(state);
    globalThis.localStorage.setItem(key, encodePayload(registry));
}

function stateWithProgression() {
    const state = createInitialState();
    const firstThreshold = getExpToNextLevel(1, state.player.jobs.levelCap);
    awardExperience(state.player, firstThreshold + 37);
    assert.equal(switchMainJob(state.player, 'pugilist').ok, true);
    awardExperience(state.player, 43);
    assert.equal(setLearnedSkill(state.player, 'sword', 7).ok, true);
    return state;
}

test('current schema accepts non-trivial persisted character progression', () => {
    const state = stateWithProgression();

    assert.equal(state.player.progression.jobProgression.vanguard.level, 2);
    assert.equal(state.player.progression.jobProgression.vanguard.exp, 37);
    assert.equal(state.player.progression.jobProgression.pugilist.exp, 43);
    assert.equal(state.player.progression.skills.sword, 7);
    assert.deepEqual(validateCurrentGameStateStructure(state), []);
});

test('current schema rejects progression records that ensureProgressionState could reconstruct', () => {
    const state = stateWithProgression();
    delete state.player.progression.jobProgression;
    delete state.player.progression.character;

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('player.progression.jobProgression must be an object')));
    assert.ok(issues.some((issue) => issue.includes('player.progression.character must be an object')));
});

test('current schema rejects incoherent discipline progress and malformed character-owned skills', () => {
    const state = stateWithProgression();
    state.player.jobs.level = 9;
    state.player.progression.exp = 999;
    state.player.progression.skills.sword = -1;

    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('jobs.jobLevels.pugilist must match jobs.level')));
    assert.ok(issues.some((issue) => issue.includes('progression.jobProgression.pugilist.level must match jobs.level')));
    assert.ok(issues.some((issue) => issue.includes('progression.exp must match progression.jobProgression.pugilist.exp')));
    assert.ok(issues.some((issue) => issue.includes('progression.skills.sword must be a non-negative integer')));
});

test('non-trivial character progression survives current save and load unchanged', () => {
    installAccount('Progression Registry');
    const state = stateWithProgression();
    state.player.identity.name = 'Pathkeeper';
    const expectedJobs = structuredClone(state.player.jobs);
    const expectedProgression = structuredClone(state.player.progression);
    assert.equal(saveGame(state), true);

    const loaded = loadCharacter('Pathkeeper');
    assert.ok(loaded);
    assert.deepEqual(loaded.player.jobs, expectedJobs);
    assert.deepEqual(loaded.player.progression, expectedProgression);
    assert.deepEqual(validateCurrentGameStateStructure(loaded, { requireMeta: true }), []);
});

test('load rejects missing current progression authority without rebuilding it', () => {
    installAccount('Strict Progression Registry');
    const state = stateWithProgression();
    state.player.identity.name = 'Recordkeeper';
    assert.equal(saveGame(state), true);
    corruptStoredCharacter('Recordkeeper', (stored) => {
        delete stored.player.progression.jobProgression;
    });

    assert.equal(loadCharacter('Recordkeeper'), null);
    const registry = decodePayload(globalThis.localStorage.getItem('hearthHorizonAccounts'));
    const unchanged = decodePayload(registry.accounts[0].characters[0].encodedState);
    assert.equal(Object.hasOwn(unchanged.player.progression, 'jobProgression'), false);
});
