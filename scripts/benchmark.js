import { BENCHMARK_WARMUP_RATIO, runBenchmarkSuite } from './benchmarkSuite.js';
import { describeVersion } from '../js/text/version.js';

console.log('Hearth & Horizon Benchmarks');
console.log(describeVersion());
console.log(`Warm-up: ${(BENCHMARK_WARMUP_RATIO * 100).toFixed(0)}% of measured iterations per workload on separate setup state; warm-up time is not reported.`);
console.log('');

for (const result of runBenchmarkSuite()) {
    console.log(`${result.name}: ${result.totalMs.toFixed(3)}ms total | ${result.perIterationMs.toFixed(6)}ms/op | warmup=${result.warmupIterations}`);
}
