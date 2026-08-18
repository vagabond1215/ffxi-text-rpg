import test from 'node:test';
import assert from 'node:assert/strict';

import { createEnemy } from '../js/text/entities/entityFactory.js';
import { createInitialState } from '../js/text/gameState.js';
import { createAccountWithPassword, loadActiveCharacter, saveGame } from '../js/text/save.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import {
    advanceSimulationWithDayPolicy,
    DEFAULT_DAY_SUMMARY_LIMIT,
    listDaySummaries,
} from '../js/text/systems/dayCycleEngine.js';
import {
    createProject,
    reconcileProjects,
    startProjectLabor,
} from '../js/text/systems/projectEngine.js';
import {
    createDefeatedEnemyResourceOpportunity,
    reconcileResourceRecoveries,
    startResourceRecovery,
} from '../js/text/systems/resourceOpportunityEngine.js';
import {
    DEFAULT_EVENT_HISTORY_LIMIT,
    listSemanticEvents,
} from '../js/text/systems/semanticEventEngine.js';
import { setEndOfDayPause } from '../js/text/systems/simulationControlEngine.js';
import {
    findTimedTask,
    listTimedTasks,
    reconcileTimedTasks,
    startTimedTask,
    TIMED_TASK_STATUSES,
} from '../js/text/systems/timedTaskEngine.js';
import {
    advanceTravelJourney,
    startRouteJourney,
} from '../js/text/systems/transportEngine.js';
import {
    markWorkCompleted,
    reconcileWorkTasks,
    startWorkTask,
} from '../js/text/systems/workTaskEngine.js';
import { activateAbility, reconcileAbilityActivation } from '../js/text/systems/abilityEngine.js';
import { advanceWorldTime, SECONDS_PER_DAY } from '../js/text/systems/worldTimeEngine.js';

class MemoryStorage {
    constructor() {
        this.values = new Map();
    }

    getItem(key) {
        return this.values.has(key) ? this.values.get(key) : null;
    }

    setItem(key, value) {
        this.values.set(key, String(value));
    }

    removeItem(key) {
        this.values.delete(key);
    }
}

function installStorage() {
    globalThis.localStorage = new MemoryStorage();
}

function saveAndReload(state) {
    assert.equal(saveGame(state), true);
    const loaded = loadActiveCharacter();
    assert.ok(loaded);
    return loaded;
}

function createRetentionHare() {
    return createEnemy({
        id: 'enemy-retention-hare',
        name: 'Retention Hare',
        family: 'hare',
        ecosystem: 'beast',
        zoneId: 'west-elderwood',
        level: 1,
        lootTableId: 'starterBeast',
    });
}

function assertOnlyBaselineTask(state, baselineTaskId) {
    const tasks = listTimedTasks(state);
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0].id, baselineTaskId);
    assert.equal(tasks[0].status, TIMED_TASK_STATUSES.COMPLETED);
}

test('multi-day save/load continuation keeps lifecycle-owned state deterministic and bounded', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Lifecycle Runner', 'pwd', { persistentLogin: true }).ok, true);

    let state = createInitialState();
    state.player.identity.name = 'Lifecycle Runner';
    setEndOfDayPause(state, false);

    const started = startTimedTask(state, {
        kind: 'test.lifecycle',
        label: 'Lifecycle smoke task',
        channel: 'test:lifecycle',
        durationSeconds: 3600,
        data: { purpose: 'long-session-smoke' },
    });
    assert.equal(started.ok, true);
    const taskId = started.data.task.id;

    for (let cycle = 0; cycle < 3; cycle += 1) {
        state = saveAndReload(state);
        const tasks = listTimedTasks(state);
        assert.equal(tasks.length, 1);
        assert.equal(tasks[0].id, taskId);
        assert.equal(tasks[0].status, TIMED_TASK_STATUSES.ACTIVE);
        assert.equal(listSemanticEvents(state, { type: 'task.started' }).length, 1);
    }

    advanceWorldTime(state, 3600, { source: 'test.long-session' });
    const completed = reconcileTimedTasks(state);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].task.id, taskId);
    assert.equal(listTimedTasks(state)[0].status, TIMED_TASK_STATUSES.COMPLETED);
    assert.equal(listSemanticEvents(state, { type: 'task.completed' }).length, 1);

    state = saveAndReload(state);
    assert.deepEqual(reconcileTimedTasks(state), []);
    assert.equal(listTimedTasks(state).length, 1);
    assert.equal(listSemanticEvents(state, { type: 'task.completed' }).length, 1);

    const longRunStart = state.worldTime.totalSeconds;
    const daysToAdvance = DEFAULT_DAY_SUMMARY_LIMIT + 10;
    for (let day = 1; day <= daysToAdvance; day += 1) {
        const result = advanceSimulationWithDayPolicy(state, SECONDS_PER_DAY);
        assert.equal(result.ok, true);
        assert.equal(result.data.secondsAdvanced, SECONDS_PER_DAY);
        if (day % 10 === 0) state = saveAndReload(state);
    }

    assert.equal(state.worldTime.totalSeconds, longRunStart + (daysToAdvance * SECONDS_PER_DAY));
    assert.equal(listTimedTasks(state).length, 1);

    const summaries = listDaySummaries(state);
    assert.equal(summaries.length, DEFAULT_DAY_SUMMARY_LIMIT);
    assert.equal(summaries.at(-1).day, state.dayCycle.lastFinalizedDay);
    assert.equal(new Set(summaries.map((summary) => summary.day)).size, summaries.length);

    const events = listSemanticEvents(state);
    assert.equal(events.length, DEFAULT_EVENT_HISTORY_LIMIT);
    assert.equal(new Set(events.map((event) => event.id)).size, events.length);
    assert.equal(new Set(events.map((event) => event.sequence)).size, events.length);

    const finalWorldTime = state.worldTime.totalSeconds;
    const finalTaskCount = state.tasks.records.length;
    const finalEventCount = state.events.records.length;
    const finalSummaryCount = state.dayCycle.summaries.length;
    state = saveAndReload(state);

    assert.equal(state.worldTime.totalSeconds, finalWorldTime);
    assert.equal(state.tasks.records.length, finalTaskCount);
    assert.equal(state.events.records.length, finalEventCount);
    assert.equal(state.dayCycle.summaries.length, finalSummaryCount);
    assert.equal(listSemanticEvents(state).length, DEFAULT_EVENT_HISTORY_LIMIT);
});

test('mixed owner-managed lifecycles return task retention to one unreleased terminal baseline across save/load', () => {
    installStorage();
    assert.equal(createAccountWithPassword('Retention Runner', 'pwd', { persistentLogin: true }).ok, true);

    let state = createInitialState();
    state.player.identity.name = 'Retention Runner';
    grantCapability(state.player, 'practical-waymark-reading');

    const baseline = startTimedTask(state, {
        kind: 'test.unowned-terminal',
        label: 'Unowned terminal baseline',
        channel: 'test:unowned-terminal',
        durationSeconds: 1,
        data: { purpose: 'prove-owner-gated-retention' },
    });
    assert.equal(baseline.ok, true);
    const baselineTaskId = baseline.data.task.id;
    advanceWorldTime(state, 1, { source: 'test.retention-baseline' });
    reconcileTimedTasks(state);
    assertOnlyBaselineTask(state, baselineTaskId);

    for (let cycle = 0; cycle < 3; cycle += 1) {
        const work = startWorkTask(state, {
            kind: `retention.work.${cycle}`,
            label: `Retention work ${cycle}`,
            channel: `work:retention:${cycle}`,
            durationSeconds: 2,
        });
        assert.equal(work.ok, true);
        advanceWorldTime(state, 2, { source: 'test.retention-work' });
        const dueWork = reconcileWorkTasks(state).find(({ record }) => record.id === work.data.work.id);
        assert.ok(dueWork);
        markWorkCompleted(state, work.data.work.id, { cycle });
        assert.equal(findTimedTask(state, work.data.task.id), null);
        assertOnlyBaselineTask(state, baselineTaskId);

        const project = createProject(state, {
            kind: `retention.project.${cycle}`,
            label: `Retention project ${cycle}`,
            laborSeconds: 2,
        });
        assert.equal(project.ok, true);
        const projectStart = startProjectLabor(state, project.data.project.id);
        assert.equal(projectStart.ok, true);

        if (cycle === 1) {
            state = saveAndReload(state);
            const tasks = listTimedTasks(state);
            assert.equal(tasks.length, 2);
            assert.equal(findTimedTask(state, baselineTaskId).status, TIMED_TASK_STATUSES.COMPLETED);
            assert.equal(findTimedTask(state, projectStart.data.task.id).status, TIMED_TASK_STATUSES.ACTIVE);
        }

        advanceWorldTime(state, 2, { source: 'test.retention-project' });
        const completedProjects = reconcileProjects(state);
        assert.ok(completedProjects.some(({ project: completedProject }) => completedProject.id === project.data.project.id));
        assert.equal(findTimedTask(state, projectStart.data.task.id), null);
        assertOnlyBaselineTask(state, baselineTaskId);

        const destinationPlaceId = state.currentPlaceId === 'west-elderwood' ? 'thornwall-southgate' : 'west-elderwood';
        const travel = startRouteJourney(state, {
            routeId: 'test-retention-route',
            from: state.currentPlaceId,
            to: destinationPlaceId,
            mode: 'walk',
            durationSeconds: 2,
        });
        assert.equal(travel.ok, true);
        const travelTaskId = travel.data.travel.taskId;
        const arrived = advanceTravelJourney(state, 2);
        assert.equal(arrived.ok, true);
        assert.equal(arrived.completed, true);
        assert.equal(state.currentPlaceId, destinationPlaceId);
        assert.equal(findTimedTask(state, travelTaskId), null);
        assertOnlyBaselineTask(state, baselineTaskId);

        const ability = activateAbility(state, 'Waymark Reading');
        assert.equal(ability.ok, true);
        assert.equal(ability.code, 'ability.started');
        const abilityTaskId = ability.data.activation.taskId;
        advanceWorldTime(state, 3, { source: 'test.retention-ability' });
        const resolvedAbility = reconcileAbilityActivation(state);
        assert.equal(resolvedAbility.ok, true);
        assert.equal(resolvedAbility.code, 'ability.resolved');
        assert.equal(findTimedTask(state, abilityTaskId), null);
        assertOnlyBaselineTask(state, baselineTaskId);

        const opportunity = createDefeatedEnemyResourceOpportunity(state, createRetentionHare(), { battleId: `retention-battle-${cycle}` });
        assert.equal(opportunity.ok, true);
        const recovery = startResourceRecovery(state, opportunity.data.opportunity.id, 'skin', {
            toolTags: ['cutting'],
            rng: () => 0,
        });
        assert.equal(recovery.ok, true);
        const recoveryTaskId = recovery.data.task.id;
        advanceWorldTime(state, recovery.data.task.durationSeconds, { source: 'test.retention-resource' });
        const completedRecoveries = reconcileResourceRecoveries(state, { rng: () => 1 });
        assert.equal(completedRecoveries.length, 1);
        assert.equal(findTimedTask(state, recoveryTaskId), null);
        assertOnlyBaselineTask(state, baselineTaskId);

        state = saveAndReload(state);
        assertOnlyBaselineTask(state, baselineTaskId);
    }

    assert.ok(state.tasks.nextSequence > 16, 'released task ids remain monotonic rather than being reused');
    assert.equal(listSemanticEvents(state, { type: 'task.completed' }).some((event) => event.data.taskId === baselineTaskId), true);
    assertOnlyBaselineTask(state, baselineTaskId);
});
