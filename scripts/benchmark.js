import { performance } from 'node:perf_hooks';

import { createEnemy, createPlayerCharacter } from '../js/text/entities/entityFactory.js';
import { calculateCombatProfile } from '../js/text/systems/statEngine.js';
import { createBattleState, performBasicAttack } from '../js/text/systems/battleEngine.js';
import { createTickEngine } from '../js/text/systems/tickEngine.js';
import { describeVersion } from '../js/text/version.js';

const BENCHMARKS = [
    benchmark('create 1,000 player combat profiles', 1000, () => {
        const player = createPlayerCharacter({ level: 30, raceId: 'hume', mainJobId: 'warrior' });
        calculateCombatProfile(player);
    }),
    benchmark('create 1,000 enemy combat profiles', 1000, () => {
        const enemy = createEnemy({ level: 30, family: 'beast' });
        calculateCombatProfile(enemy);
    }),
    benchmark('resolve 1,000 basic attacks', 1000, () => {
        const player = createPlayerCharacter({ id: 'bench-player', level: 10 });
        const enemy = createEnemy({ id: 'bench-enemy', level: 10 });
        const battle = createBattleState({ player, enemies: [enemy] });
        performBasicAttack(battle, 'bench-player', 'bench-enemy');
    }),
    benchmark('run 10,000 tick dispatches with 5 subscribers', 10000, () => {
        const tickEngine = createTickEngine({ tickLengthMs: 1000 });
        for (let index = 0; index < 5; index += 1) {
            tickEngine.subscribe(`subscriber-${index}`, () => {});
        }
        tickEngine.tick();
    }),
];

console.log('FFXI Text RPG Benchmarks');
console.log(describeVersion());
console.log('');

for (const result of BENCHMARKS) {
    console.log(`${result.name}: ${result.totalMs.toFixed(3)}ms total | ${result.perIterationMs.toFixed(6)}ms/op`);
}

function benchmark(name, iterations, action) {
    const start = performance.now();
    for (let index = 0; index < iterations; index += 1) {
        action(index);
    }
    const totalMs = performance.now() - start;
    return {
        name,
        iterations,
        totalMs,
        perIterationMs: totalMs / iterations,
    };
}
