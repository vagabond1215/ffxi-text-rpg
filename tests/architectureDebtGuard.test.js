import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
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
