import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { addItemToContainer } from '../js/text/systems/inventoryEngine.js';
import { listSemanticEvents } from '../js/text/systems/semanticEventEngine.js';
import {
    cancelProject,
    contributeProjectMaterial,
    createProject,
    getProjectProgress,
    listProjects,
    PROJECT_STATUSES,
    reconcileProjects,
    startProjectLabor,
    validateProjectState,
} from '../js/text/systems/projectEngine.js';
import { advanceWorldTime } from '../js/text/systems/worldTimeEngine.js';


test('new games initialize an empty versioned persistent project registry', () => {
    const state = createInitialState();

    assert.equal(state.projects.version, 1);
    assert.equal(state.projects.nextSequence, 1);
    assert.deepEqual(state.projects.records, []);
    assert.deepEqual(validateProjectState(state.projects), []);
});

test('project creation records stable ids material requirements labor and semantic event data', () => {
    const state = createInitialState();
    state.worldTime.totalSeconds = 120;

    const result = createProject(state, {
        kind: 'construction.camp-table',
        label: 'Camp Worktable',
        materials: [
            { itemId: 'rough-board', name: 'Rough Board', quantity: 2 },
            { itemId: 'iron-nail', name: 'Iron Nail', quantity: 4 },
        ],
        laborSeconds: 600,
        data: { placeId: state.currentPlaceId },
    });

    assert.equal(result.ok, true);
    assert.equal(result.code, 'project.created');
    assert.equal(result.data.project.id, 'project-000001');
    assert.equal(result.data.project.status, PROJECT_STATUSES.PLANNED);
    assert.equal(result.data.project.createdAtWorldSeconds, 120);
    assert.equal(result.data.project.materials[0].quantityRequired, 2);
    const [event] = listSemanticEvents(state, { type: 'project.created' });
    assert.equal(event.data.projectId, 'project-000001');
    assert.equal(event.data.laborSeconds, 600);
});

test('project material contribution consumes inventory atomically and caps at requirement', () => {
    const state = createInitialState();
    const created = createProject(state, {
        kind: 'construction.test',
        label: 'Test Project',
        materials: [{ itemId: 'rough-board', name: 'Rough Board', quantity: 2 }],
        laborSeconds: 10,
    });
    addItemToContainer(state.player.inventoryState, 'inventory', {
        id: 'rough-board',
        name: 'Rough Board',
        kind: 'material',
        quantity: 3,
        maxStack: 99,
    });

    const contributed = contributeProjectMaterial(state, created.data.project.id, 'rough-board', 5);

    assert.equal(contributed.ok, true);
    assert.equal(contributed.data.project.materials[0].quantityContributed, 2);
    const stack = state.player.inventory.find((item) => item.id === 'rough-board');
    assert.equal(stack.quantity, 1);
    assert.equal(contributeProjectMaterial(state, created.data.project.id, 'rough-board', 1).ok, false);
});

test('project labor cannot start until materials are satisfied', () => {
    const state = createInitialState();
    const created = createProject(state, {
        kind: 'construction.test',
        label: 'Test Project',
        materials: [{ itemId: 'rough-board', name: 'Rough Board', quantity: 1 }],
        laborSeconds: 30,
    });

    const blocked = startProjectLabor(state, created.data.project.id);

    assert.equal(blocked.ok, false);
    assert.equal(blocked.code, 'project.materials-incomplete');
    assert.equal(state.projects.records[0].status, PROJECT_STATUSES.PLANNED);
});

test('project labor uses canonical timed tasks and completes at the deterministic task boundary', () => {
    const state = createInitialState();
    const created = createProject(state, {
        kind: 'construction.test',
        label: 'Test Project',
        materials: [],
        laborSeconds: 60,
    });

    const started = startProjectLabor(state, created.data.project.id);
    assert.equal(started.ok, true);
    assert.equal(started.data.project.status, PROJECT_STATUSES.ACTIVE);
    assert.equal(started.data.task.kind, 'project.labor');
    assert.equal(getProjectProgress(state, created.data.project.id).laborProgress, 0);

    advanceWorldTime(state, 30);
    assert.equal(getProjectProgress(state, created.data.project.id).laborProgress, 0.5);
    assert.deepEqual(reconcileProjects(state), []);

    advanceWorldTime(state, 30);
    const completed = reconcileProjects(state);
    assert.equal(completed.length, 1);
    assert.equal(completed[0].project.status, PROJECT_STATUSES.COMPLETED);
    assert.equal(completed[0].project.completedAtWorldSeconds, 60);
    assert.equal(getProjectProgress(state, created.data.project.id).progress, 1);
    const [event] = listSemanticEvents(state, { type: 'project.completed' });
    assert.equal(event.data.projectId, created.data.project.id);
    assert.equal(event.data.completedAtWorldSeconds, 60);
});

test('cancelling an active project cancels its timed labor task', () => {
    const state = createInitialState();
    const created = createProject(state, {
        kind: 'construction.test',
        label: 'Test Project',
        laborSeconds: 100,
    });
    startProjectLabor(state, created.data.project.id);
    advanceWorldTime(state, 25);

    const cancelled = cancelProject(state, created.data.project.id);

    assert.equal(cancelled.ok, true);
    assert.equal(cancelled.data.project.status, PROJECT_STATUSES.CANCELLED);
    assert.equal(cancelled.data.project.cancelledAtWorldSeconds, 25);
    assert.equal(listProjects(state, { status: PROJECT_STATUSES.CANCELLED }).length, 1);
    advanceWorldTime(state, 200);
    assert.deepEqual(reconcileProjects(state), []);
});

test('missing project registry lazily initializes without changing save version', () => {
    const state = createInitialState();
    const versionBefore = state.version;
    delete state.projects;

    const created = createProject(state, { kind: 'work.test', label: 'Test', laborSeconds: 5 });

    assert.equal(created.ok, true);
    assert.equal(state.projects.version, 1);
    assert.equal(state.version, versionBefore);
});

test('invalid project definitions do not allocate stable ids', () => {
    const state = createInitialState();

    assert.equal(createProject(state, { kind: '', laborSeconds: 10 }).ok, false);
    assert.equal(createProject(state, { kind: 'work.test', laborSeconds: 0 }).ok, false);
    assert.equal(createProject(state, { kind: 'work.test', laborSeconds: 10, materials: [{ itemId: 'wood', quantity: 0 }] }).ok, false);
    assert.equal(state.projects.nextSequence, 1);
});
