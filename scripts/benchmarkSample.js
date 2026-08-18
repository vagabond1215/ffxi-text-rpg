import { runBenchmarkSuite } from './benchmarkSuite.js';
import { describeVersion } from '../js/text/version.js';

const sampleCount = normalizeSampleCount(process.env.HNH_BENCHMARK_SAMPLES);
const samples = Array.from({ length: sampleCount }, () => runBenchmarkSuite());

console.log('Hearth & Horizon Benchmark Sample');
console.log(describeVersion());
console.log(`Samples: ${sampleCount}`);
console.log('No hard thresholds are enforced; compare like-for-like environments and use median/spread as baseline evidence.');
console.log('');

for (let benchmarkIndex = 0; benchmarkIndex < samples[0].length; benchmarkIndex += 1) {
    const benchmarkSamples = samples.map((sample) => sample[benchmarkIndex]);
    const perIterationValues = benchmarkSamples.map((result) => result.perIterationMs);
    const summary = summarize(perIterationValues);
    const reference = benchmarkSamples[0];
    console.log([
        reference.name,
        `n=${sampleCount}`,
        `min=${summary.min.toFixed(6)}ms/op`,
        `median=${summary.median.toFixed(6)}ms/op`,
        `max=${summary.max.toFixed(6)}ms/op`,
        `mean=${summary.mean.toFixed(6)}ms/op`,
        `spread=${summary.spreadPercent.toFixed(2)}%`,
    ].join(' | '));
}

function summarize(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
        ? (sorted[middle - 1] + sorted[middle]) / 2
        : sorted[middle];
    const min = sorted[0];
    const max = sorted.at(-1);
    const mean = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
    const spreadPercent = median > 0 ? ((max - min) / median) * 100 : 0;
    return { min, median, max, mean, spreadPercent };
}

function normalizeSampleCount(value) {
    const parsed = Number.parseInt(String(value ?? '3'), 10);
    if (!Number.isInteger(parsed)) return 3;
    return Math.max(2, Math.min(10, parsed));
}
