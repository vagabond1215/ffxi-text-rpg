import { evaluateContentScaleGate, formatContentScaleReport } from '../js/text/systems/contentScaleGate.js';

const report = evaluateContentScaleGate();

if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
    process.stdout.write(`${formatContentScaleReport(report)}\n`);
}
