import test from 'node:test';
import assert from 'node:assert/strict';

import { createEnemy } from '../js/text/entities/entityFactory.js';
import { createInitialState } from '../js/text/gameState.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { validateCurrentGameStateStructure } from '../js/text/systems/currentGameStateSchema.js';
import { createProject, startProjectLabor } from '../js/text/systems/projectEngine.js';
import { createDefeatedEnemyResourceOpportunity, startResourceRecovery } from '../js/text/systems/resourceOpportunityEngine.js';
import { activateAbility } from '../js/text/systems/abilityEngine.js';
import { startWorkTask } from '../js/text/systems/workTaskEngine.js';

function removeTask(state, taskId) {
    state.tasks.records = state.tasks.records.filter((task) => task.id !== taskId);
}

function assertMissingLinkRejected(state, text) {
    const issues = validateCurrentGameStateStructure(state);
    assert.ok(issues.some((issue) => issue.includes('must reference a persisted timed task')), `${text}: ${issues.join(' | ')}`);
}

test('current active project requires its persisted labor task', () => {
    const state = createInitialState();
    const project = createProject(state, { kind: 'schema.project', label: 'Schema project', laborSeconds: 30 });
    assert.equal(project.ok, true);
    const started = startProjectLabor(state, project.data.project.id);
    assert.equal(started.ok, true);
    removeTask(state, started.data.task.id);
    assertMissingLinkRejected(state, 'active project missing task');
});

test('current active work requires its persisted work task', () => {
    const state = createInitialState();
    const started = startWorkTask(state, { kind: 'schema-work', label: 'Schema work', durationSeconds: 30 });
    assert.equal(started.ok, true);
    removeTask(state, started.data.task.id);
    assertMissingLinkRejected(state, 'active work missing task');
});

test('current timed ability activation requires its persisted ability task', () => {
    const state = createInitialState();
    grantCapability(state.player, 'practical-waymark-reading');
    const started = activateAbility(state, 'Waymark Reading');
    assert.equal(started.ok, true);
    assert.equal(started.code, 'ability.started');
    removeTask(state, started.data.activation.taskId);
    assertMissingLinkRejected(state, 'active ability missing task');
});

test('current active resource recovery requires its persisted recovery task', () => {
    const state = createInitialState();
    const enemy = createEnemy({
        id: 'enemy-schema-hare',
        name: 'Schema Hare',
        family: 'hare',
        ecosystem: 'beast',
        zoneId: 'west-elderwood',
        level: 1,
        lootTableId: 'starterBeast',
    });
    const opportunity = createDefeatedEnemyResourceOpportunity(state, enemy, { battleId: 'schema-battle' });
    assert.equal(opportunity.ok, true);
    const started = startResourceRecovery(state, opportunity.data.opportunity.id, 'skin', {
        toolTags: ['cutting'],
        rng: () => 0,
    });
    assert.equal(started.ok, true);
    removeTask(state, started.data.task.id);
    assertMissingLinkRejected(state, 'active resource recovery missing task');
});
