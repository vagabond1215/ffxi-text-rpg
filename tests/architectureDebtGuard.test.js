import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TEXT_ROOT = resolve(ROOT, 'js/text');

function source(relativePath) {
    return readFileSync(resolve(ROOT, relativePath), 'utf8');
}

function assertAbsent(relativePath, patterns) {
    const text = source(relativePath);
    for (const pattern of patterns) {
        assert.doesNotMatch(text, pattern, `${relativePath} reintroduced architecture debt matching ${pattern}`);
    }
}

function listJavaScriptFiles(root) {
    const files = [];
    for (const entry of readdirSync(root, { withFileTypes: true })) {
        const path = resolve(root, entry.name);
        if (entry.isDirectory()) files.push(...listJavaScriptFiles(path));
        else if (entry.isFile() && entry.name.endsWith('.js')) files.push(path);
    }
    return files;
}

test('retired FFXI command compatibility modules stay deleted', () => {
    assert.equal(existsSync(resolve(TEXT_ROOT, 'systems/ffxiCommandAdapter.js')), false);
    assert.equal(existsSync(resolve(TEXT_ROOT, 'data/ffxiMacroCommands.js')), false);
    assertAbsent('js/text/commandRouter.js', [/ffxiCommandAdapter/i, /ffxiMacroCommands/i]);
    assertAbsent('js/text/slashCommandRouter.js', [/macrohelp/i, /routeFfxiSlashCommand/i, /isFfxiSlashCommand/i]);
});

test('current persistence does not regain old storage or home identifiers', () => {
    assertAbsent('js/text/save.js', [/ffxiTextRpg/i, /mogHouse/i, /mogSafe/i, /mogLocker/i, /mogSatchel/i]);
    assertAbsent('js/text/data/inventoryContainers.js', [/mogHouse/i, /mogSafe/i, /mogLocker/i, /mogSatchel/i]);
    assertAbsent('js/text/systems/homeInfrastructureEngine.js', [/mogHouse/i, /mogSafe/i, /mogLocker/i, /mogSatchel/i]);
});

test('version and ActionResult compatibility aliases stay removed', () => {
    assertAbsent('js/text/version.js', [/^\s*app\s*:/m, /^\s*save\s*:/m]);
    assertAbsent('js/text/systems/actionResult.js', [/asLegacyActionResult/, /\bmessage\s*:/, /\breason\s*:/]);
});

test('presentation does not regain rejected compatibility payloads', () => {
    assertAbsent('js/text/ui/gameViewModel.js', [/cargoUnits\s*:/]);
    assertAbsent('js/text/ui/uiIntentDispatcher.js', [/highContrast/]);
});

test('active travel does not regain runtime compatibility reconstruction', () => {
    assertAbsent('js/text/systems/transportEngine.js', [/normalizeLegacyActiveTravel/, /legacyTravel\s*:/]);
});

test('direct timed-task creation stays limited to audited domain owners with release responsibility', () => {
    const expectedOwners = [
        'js/text/systems/abilityEngine.js',
        'js/text/systems/campaignRecoveryEngine.js',
        'js/text/systems/projectEngine.js',
        'js/text/systems/resourceOpportunityEngine.js',
        'js/text/systems/transportEngine.js',
        'js/text/systems/workTaskEngine.js',
    ];

    const actualOwners = listJavaScriptFiles(TEXT_ROOT)
        .map((path) => relative(ROOT, path).replaceAll('\\', '/'))
        .filter((path) => path !== 'js/text/systems/timedTaskEngine.js')
        .filter((path) => source(path).includes('startTimedTask'))
        .sort();

    assert.deepEqual(actualOwners, expectedOwners);
    for (const ownerPath of expectedOwners) {
        assert.match(source(ownerPath), /\breleaseTimedTask\b/, `${ownerPath} creates timed tasks without an explicit terminal release dependency`);
    }
});
