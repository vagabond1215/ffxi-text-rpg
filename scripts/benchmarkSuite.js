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
        action: () => {
            const player = createPlayerCharacter({ level: 30, raceId: 'human', mainJobId: 'vanguard' });
            calculateCombatProfile(player);
        },
    }),
    Object.freeze({
        name: 'create 1,000 enemy combat profiles',
        iterations: 1000,
        action: () => {
            const enemy = createEnemy({ level: 30, family: 'beast' });
            calculateCombatProfile(enemy);
        },
    }),
    Object.freeze({
        name: 'resolve 1,000 basic attacks',
        iterations: 1000,
        action: () => {
            const player = createPlayerCharacter({ id: 'bench-player', level: 10 });
            const enemy = createEnemy({ id: 'bench-enemy', level: 10 });
            const battle = createBattleState({ player, enemies: [enemy] });
            performBasicAttack(battle, 'bench-player', 'bench-enemy');
        },
    }),
    Object.freeze({
        name: 'run 10,000 tick dispatches with 5 subscribers',
        iterations: 10000,
        action: () => {
            const tickEngine = createTickEngine({ tickLengthMs: 1000 });
            for (let index = 0; index < 5; index += 1) {
                tickEngine.subscribe(`subscriber-${index}`, () => {});
            }
            tickEngine.tick();
        },
    }),
    Object.freeze({
        name: 'resolve 10,000 direct travel route lookups',
        iterations: 10000,
        action: () => {
            const state = createInitialState();
            findTravelRoute(state, 'West Elderwood');
        },
    }),
]);

export function runBenchmarkSuite() {
    return BENCHMARK_DEFINITIONS.map((definition) => benchmark(definition));
}

function benchmark(definition) {
    const start = performance.now();
    for (let index = 0; index < definition.iterations; index += 1) {
        definition.action(index);
    }
    const totalMs = performance.now() - start;
    return Object.freeze({
        name: definition.name,
        iterations: definition.iterations,
        totalMs,
        perIterationMs: totalMs / definition.iterations,
    });
}
