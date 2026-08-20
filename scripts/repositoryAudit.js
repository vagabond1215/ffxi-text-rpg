import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { VERSION } from '../js/text/version.js';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(SCRIPT_PATH), '..');
const EXPECTED_CHECK = 'npm run audit:repo && npm test && npm run census && npm run benchmark && npm run benchmark:sample';

function readText(rootDir, relativePath) {
    return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function requireText(issues, text, expected, label) {
    if (!text.includes(expected)) issues.push(`${label} is missing expected contract: ${expected}`);
}

export function collectRepositoryContractIssues({ rootDir = DEFAULT_ROOT } = {}) {
    const issues = [];
    const packageJson = JSON.parse(readText(rootDir, 'package.json'));
    const profile = readText(rootDir, 'PROJECT_PROFILE.yaml');
    const workflow = readText(rootDir, '.github/workflows/check.yml');

    if (packageJson.version !== VERSION.package) issues.push(`package.json version ${packageJson.version} does not match runtime package ${VERSION.package}.`);
    if (packageJson.engines?.node !== '>=24') issues.push(`package.json engines.node must remain >=24; found ${packageJson.engines?.node}.`);
    if (packageJson.scripts?.check !== EXPECTED_CHECK) issues.push(`package.json scripts.check must be '${EXPECTED_CHECK}'.`);

    for (const [expected, label] of [
        [`current_product_version: ${VERSION.product}`, 'PROJECT_PROFILE current product'],
        [`current_package_version: ${VERSION.package}`, 'PROJECT_PROFILE current package'],
        [`current_account_save: ${VERSION.accountSave}`, 'PROJECT_PROFILE Account Save'],
        [`current_game_state: ${VERSION.gameState}`, 'PROJECT_PROFILE Game State'],
        [`current_data_version: ${VERSION.data}`, 'PROJECT_PROFILE Data'],
        [`current_benchmark_version: ${VERSION.benchmark}`, 'PROJECT_PROFILE Benchmark'],
    ]) requireText(issues, profile, expected, label);

    for (const command of ['npm run audit:repo', 'npm test', 'npm run census', 'npm run benchmark', 'npm run benchmark:sample']) {
        requireText(issues, workflow, command, 'hosted Check workflow');
    }

    for (const relativePath of [
        'README.md',
        'docs/THREAD_HANDOFF.md',
        'docs/EXECUTION_PIPELINE.md',
        'docs/ROADMAP.md',
        'docs/SYSTEM_CATALOG.md',
        'docs/VERSIONING_AND_RELEASE_ROADMAP.md',
    ]) {
        const text = readText(rootDir, relativePath);
        requireText(issues, text, `Product:       ${VERSION.product}`, relativePath);
        requireText(issues, text, `Game State:    ${VERSION.gameState}`, relativePath);
    }

    return issues;
}

export function formatRepositoryAudit({ rootDir = DEFAULT_ROOT } = {}) {
    const issues = collectRepositoryContractIssues({ rootDir });
    const lines = [
        'Hearth & Horizon Repository Contract Audit',
        `Product: ${VERSION.product}`,
        `Package: ${VERSION.package}`,
        `Account Save: ${VERSION.accountSave}`,
        `Game State: ${VERSION.gameState}`,
        `Data: ${VERSION.data}`,
        `Benchmark: ${VERSION.benchmark}`,
    ];
    if (issues.length === 0) lines.push('Status: PASS');
    else {
        lines.push(`Status: FAIL (${issues.length} issue${issues.length === 1 ? '' : 's'})`);
        for (const issue of issues) lines.push(`- ${issue}`);
    }
    return { issues, text: lines.join('\n') };
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
    const result = formatRepositoryAudit();
    console.log(result.text);
    if (result.issues.length > 0) process.exitCode = 1;
}
