import { runBenchmarkSuite } from './benchmarkSuite.js';
import { describeVersion } from '../js/text/version.js';

console.log('Hearth & Horizon Benchmarks');
console.log(describeVersion());
console.log('');

for (const result of runBenchmarkSuite()) {
    console.log(`${result.name}: ${result.totalMs.toFixed(3)}ms total | ${result.perIterationMs.toFixed(6)}ms/op`);
}
