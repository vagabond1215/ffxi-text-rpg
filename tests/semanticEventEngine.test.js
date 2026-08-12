import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import {
    createSemanticEventState,
    emitSemanticEvent,
    hasSemanticEvent,
    listSemanticEvents,
    validateSemanticEventState,
} from '../js/text/systems/semanticEventEngine.js';
import { advanceTravel, startTravel } from '../js/text/systems/travelEngine.js';


test('semantic events use stable sequential ids and typed semantic data', () => {
    const state = { events: createSemanticEventState() };

    const first = emitSemanticEvent(state, 'fixture.started', { targetId: 'a' }, { source: 'test' });
    const second = emitSemanticEvent(state, 'fixture.completed', { targetId: 'a' }, { source: 'test' });

    assert.equal(first.id, 'evt-000001');
    assert.equal(first.sequence, 1);
    assert.equal(first.type, 'fixture.started');
    assert.deepEqual(first.data, { targetId: 'a' });
    assert.equal(second.id, 'evt-000002');
    assert.equal(state.events.nextSequence, 3);
    assert.deepEqual(validateSemanticEventState(state.events), []);
});

test('semantic event consumers filter structured outcomes without parsing log prose', () => {
    const state = {
        log: [{ entry: 'This prose deliberately says nothing useful about the objective.' }],
        events: createSemanticEventState(),
    };
    emitSemanticEvent(state, 'project.material-added', { projectId: 'shed', materialId: 'lumber', quantity: 8 });

    const satisfied = hasSemanticEvent(
        state,
        'project.material-added',
        (event) => event.data.projectId === 'shed' && event.data.quantity >= 8,
    );

    assert.equal(satisfied, true);
    assert.equal(state.log.some((entry) => entry.entry.includes('shed')), false);
});

test('event history is bounded without becoming authoritative state history', () => {
    const state = { events: createSemanticEventState() };

    emitSemanticEvent(state, 'fixture.step', { n: 1 }, { historyLimit: 2 });
    emitSemanticEvent(state, 'fixture.step', { n: 2 }, { historyLimit: 2 });
    emitSemanticEvent(state, 'fixture.step', { n: 3 }, { historyLimit: 2 });

    assert.deepEqual(listSemanticEvents(state).map((event) => event.data.n), [2, 3]);
    assert.equal(state.events.nextSequence, 4);
});

test('travel emits semantic start and arrival events independently of display prose', () => {
    const state = createInitialState();
    setPositionAndDiscover(state, 'thornwall-southgate', { coord: 'F-10' });

    const started = startTravel(state, 'West Elderwood');
    assert.equal(started.ok, true);
    assert.equal(hasSemanticEvent(state, 'travel.started', (event) => event.data.to === 'west-elderwood'), true);
    assert.equal(started.data.eventId, 'evt-000001');

    const advanced = advanceTravel(state, 45);
    assert.equal(advanced.completed, true);
    assert.equal(advanced.eventId, 'evt-000002');
    assert.equal(hasSemanticEvent(state, 'travel.arrived', (event) => event.data.to === 'west-elderwood'), true);

    const travelEvents = listSemanticEvents(state);
    assert.deepEqual(travelEvents.map((event) => event.type), ['travel.started', 'travel.arrived']);
});

test('state without an event container is upgraded lazily without changing its save version', () => {
    const state = createInitialState();
    const versionBefore = state.version;
    delete state.events;

    const event = emitSemanticEvent(state, 'fixture.started', { value: 1 });

    assert.equal(event.id, 'evt-000001');
    assert.equal(state.events.records.length, 1);
    assert.equal(state.version, versionBefore);
});
