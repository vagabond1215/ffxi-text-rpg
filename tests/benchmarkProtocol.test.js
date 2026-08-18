import test from 'node:test';
import assert from 'node:assert/strict';

import {
    BENCHMARK_DEFINITIONS,
    BENCHMARK_WARMUP_RATIO,
    runBenchmarkDefinition,
} from '../scripts/benchmarkSuite.js';

function benchmarkByName(fragment) {
    const definition = BENCHMARK_DEFINITIONS.find((candidate) => candidate.name.includes(fragment));
    assert.ok(definition, `missing benchmark containing ${fragment}`);
    return definition;
}

test('tick benchmark times steady dispatch rather than subscription setup', () => {
    const definition = benchmarkByName('steady subscribers');
    const tickEngine = definition.setup({ iterations: definition.iterations });

    assert.equal(tickEngine.subscriberCount, 5);
    assert.equal(tickEngine.elapsedTicks, 0);

    definition.action(tickEngine, 0);
    definition.action(tickEngine, 1);

    assert.equal(tickEngine.subscriberCount, 5);
    assert.equal(tickEngine.elapsedTicks, 2);
});

test('route benchmark reuses one state and measures lookup without simulation mutation', () => {
    const definition = benchmarkByName('travel route lookups');
    const state = definition.setup({ iterations: definition.iterations });
    const placeBefore = state.currentPlaceId;
    const timeBefore = state.worldTime.totalSeconds;

    definition.action(state, 0);
    definition.action(state, 1);

    assert.equal(state.currentPlaceId, placeBefore);
    assert.equal(state.worldTime.totalSeconds, timeBefore);
});

test('basic-attack benchmark prepares independent battles before timed action calls', () => {
    const definition = benchmarkByName('basic attacks');
    const battles = definition.setup({ iterations: 2 });

    assert.equal(battles.length, 2);
    assert.notEqual(battles[0], battles[1]);
    const firstLogLength = battles[0].log.length;
    const secondLogLength = battles[1].log.length;

    definition.action(battles, 0);
    definition.action(battles, 1);

    assert.equal(battles[0].log.length > firstLogLength, true);
    assert.equal(battles[1].log.length > secondLogLength, true);
});

test('benchmark runner warms a separate setup context before measuring reported iterations', () => {
    const setupIterations = [];
    const actionCounts = [];
    const definition = {
        name: 'protocol fixture',
        iterations: 20,
        setup: ({ iterations }) => {
            const slot = setupIterations.length;
            setupIterations.push(iterations);
            actionCounts.push(0);
            return { slot };
        },
        action: (context) => {
            actionCounts[context.slot] += 1;
        },
    };

    const result = runBenchmarkDefinition(definition);

    assert.equal(BENCHMARK_WARMUP_RATIO, 0.1);
    assert.deepEqual(setupIterations, [2, 20]);
    assert.deepEqual(actionCounts, [2, 20]);
    assert.equal(result.warmupIterations, 2);
    assert.equal(result.iterations, 20);
});
