import test from 'node:test';
import assert from 'node:assert/strict';

import { createTickEngine } from '../js/text/systems/tickEngine.js';

test('stale tick subscription disposer cannot remove a replacement owner', () => {
    const tickEngine = createTickEngine({ tickLengthMs: 1000 });
    let firstHandled = 0;
    let secondHandled = 0;

    const disposeFirst = tickEngine.subscribe('shared-owner', () => {
        firstHandled += 1;
    });
    const disposeSecond = tickEngine.subscribe('shared-owner', () => {
        secondHandled += 1;
    });

    assert.equal(tickEngine.subscriberCount, 1);

    disposeFirst();
    assert.equal(tickEngine.subscriberCount, 1);

    tickEngine.tick();
    assert.equal(firstHandled, 0);
    assert.equal(secondHandled, 1);

    disposeSecond();
    assert.equal(tickEngine.subscriberCount, 0);
});

test('explicit unsubscribe still removes the current stable-id subscriber', () => {
    const tickEngine = createTickEngine({ tickLengthMs: 1000 });
    tickEngine.subscribe('owned', () => {});

    assert.equal(tickEngine.subscriberCount, 1);
    tickEngine.unsubscribe('owned');
    assert.equal(tickEngine.subscriberCount, 0);
});
