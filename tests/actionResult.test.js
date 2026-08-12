import test from 'node:test';
import assert from 'node:assert/strict';

import {
    ACTION_RESULT_VERSION,
    actionFailure,
    actionSuccess,
    createActionResult,
    describeActionResult,
    isActionResult,
} from '../js/text/systems/actionResult.js';


test('ActionResult separates semantic data from display prose', () => {
    const result = actionSuccess({
        action: 'fixture.start',
        code: 'fixture.started',
        outcome: 'started',
        data: { targetId: 'target-1', durationSeconds: 30 },
        display: { text: 'Started fixture action.' },
    });

    assert.equal(result.contract, 'ActionResult');
    assert.equal(result.version, ACTION_RESULT_VERSION);
    assert.equal(result.ok, true);
    assert.equal(result.action, 'fixture.start');
    assert.equal(result.code, 'fixture.started');
    assert.equal(result.outcome, 'started');
    assert.deepEqual(result.data, { targetId: 'target-1', durationSeconds: 30 });
    assert.deepEqual(result.display, { text: 'Started fixture action.' });
    assert.equal(describeActionResult(result), 'Started fixture action.');
    assert.equal(isActionResult(result), true);
});

test('legacy message and reason aliases are non-enumerable compatibility adapters', () => {
    const success = actionSuccess({
        action: 'fixture.start',
        code: 'fixture.started',
        outcome: 'started',
        display: { text: 'Started.' },
    });
    const failure = actionFailure({
        action: 'fixture.start',
        code: 'fixture.blocked',
        outcome: 'blocked',
        display: { text: 'Blocked.' },
    });

    assert.equal(success.message, 'Started.');
    assert.equal(success.reason, undefined);
    assert.equal(failure.message, undefined);
    assert.equal(failure.reason, 'Blocked.');
    assert.equal(Object.keys(success).includes('message'), false);
    assert.equal(Object.keys(failure).includes('reason'), false);
    assert.equal(JSON.stringify(success).includes('Started.'), true);
    assert.equal(JSON.stringify(success).includes('message'), false);
});

test('ActionResult validates required semantic fields', () => {
    assert.throws(() => createActionResult({ ok: true, action: '', code: 'x', outcome: 'x' }), /action is required/);
    assert.throws(() => createActionResult({ ok: true, action: 'x', code: '', outcome: 'x' }), /code is required/);
    assert.throws(() => createActionResult({ ok: true, action: 'x', code: 'x', outcome: '' }), /outcome is required/);
});
