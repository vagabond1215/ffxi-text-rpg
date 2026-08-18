import { performance } from 'node:perf_hooks';

import { createEnemy, createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { createInitialState } from '../js/text/gameState.js';
import { createBattleState, performBasicAttack } from '../js/text/systems/battleEngine.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { createTickEngine } from '../js/text/systems/tickEngine.js';
import { findTravelRoute } from '../js/text/systems/travelEngine.js';

export const BENCHMARK_DEFINITIONS = Object.freeze([
    Object.freeze({
        name: 'create 1,000 player combat profiles',
        iterations: 1000,
        setup: null,
        action: () => {
            const player = createPlayerCharacter({ level: 30, raceId: 'human', mainJobId: 'vanguard' });
            calculateCombatProfile(player);
        },
    }),
    Object.freeze({
        name: 'create 1,000 enemy combat profiles',
        iterations: 1000,
        setup: null,
        action: () => {
            const enemy = createEnemy({ level: 30, family: 'beast' });
            calculateCombatProfile(enemy);
        },
    }),
    Object.freeze({
        name: 'resolve 1,000 basic attacks',
        iterations: 1000,
        setup: ({ iterations }) => Array.from({ length: iterations }, (_, index) => {
            const player = createPlayerCharacter({ id: `bench-player-${index}`, level: 10 });
            const enemy = createEnemy({ id: `bench-enemy-${index}`, level: 10 });
            return createBattleState({ player, enemies: [enemy] });
        }),
        action: (battles, index) => {
            performBasicAttack(battles[index], `bench-player-${index}`, `bench-enemy-${index}`);
        },
    }),
    Object.freeze({
        name: 'dispatch 10,000 ticks to 5 steady subscribers',
        iterations: 10000,
        setup: () => {
            const tickEngine = createTickEngine({ tickLengthMs: 1000 });
            for (let index = 0; index < 5; index += 1) {
                tickEngine.subscribe(`subscriber-${index}`, () => {});
            }
            return tickEngine;
        },
        action: (tickEngine) => {
            tickEngine.tick();
        },
    }),
    Object.freeze({
        name: 'resolve 10,000 direct travel route lookups',
        iterations: 10000,
        setup: () => createInitialState(),
        action: (state) => {
            findTravelRoute(state, 'West Elderwood');
        },
    }),
]);

export function runBenchmarkSuite() {
    return BENCHMARK_DEFINITIONS.map((definition) => benchmark(definition));
}

function benchmark(definition) {
    const context = typeof definition.setup === 'function'
        ? definition.setup({ iterations: definition.iterations })
        : undefined;
    const start = performance.now();
    for (let index = 0; index < definition.iterations; index += 1) {
        definition.action(context, index);
    }
    const totalMs = performance.now() - start;
    return Object.freeze({
        name: definition.name,
        iterations: definition.iterations,
        totalMs,
        perIterationMs: totalMs / definition.iterations,
    });
}
