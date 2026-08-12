import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState } from '../js/text/gameState.js';
import { createGuidedCreatorState } from '../js/text/systems/characterCreationModel.js';
import { moveInDirection } from '../js/text/systems/navigationEngine.js';
import { applyCanvasKey, createCanvasUiState, setActionCategory } from '../js/text/ui/canvasInput.js';
import { createCanvasLayout } from '../js/text/ui/canvasLayout.js';
import { createCanvasContextSnapshot, wrapText } from '../js/text/ui/canvasRenderer.js';
import { createMinimapModel } from '../js/text/ui/minimapModel.js';
import { createActionList, createCompassActionList, findActionById } from '../js/text/ui/uiActions.js';

test('local minimap begins from discovered atlas knowledge only', () => {
    const state = createInitialState();
    const model = createMinimapModel(state);

    assert.equal(model.mode, 'topology');
    assert.equal(model.currentKey, 'G-10');
    assert.equal(model.exploredCount, 1);
    assert.ok(model.totalCount > model.exploredCount);
    assert.deepEqual(model.cells.map((cell) => cell.key), ['G-10']);
});

test('moving through the world reveals additional minimap cells and known connections', () => {
    const state = createInitialState();

    const moved = moveInDirection(state, 'east');
    assert.equal(moved.ok, true);

    const model = createMinimapModel(state);
    const knownKeys = new Set(model.cells.map((cell) => cell.key));
    assert.equal(model.currentKey, 'H-10');
    assert.equal(model.exploredCount, 2);
    assert.equal(knownKeys.has('G-10'), true);
    assert.equal(knownKeys.has('H-10'), true);
    assert.equal(model.connections.some((connection) => connection.targetVisited), true);
});

test('layout places a compact centered d-pad beneath the minimap', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game' });
    const layout = createCanvasLayout({
        width: 1200,
        height: 800,
        actions: createActionList(state, uiState),
        compassActions: createCompassActionList(state, uiState),
    });

    assert.ok(layout.panels.minimap.h >= 100);
    assert.equal(layout.compassButtons.length, 9);
    assert.equal(layout.compassButtons.every((button) => button.rect.w <= 30 && button.rect.h <= 30), true);
    assert.ok(Math.min(...layout.compassButtons.map((button) => button.rect.y)) > layout.panels.minimap.y + layout.panels.minimap.h);

    const left = Math.min(...layout.compassButtons.map((button) => button.rect.x));
    const right = Math.max(...layout.compassButtons.map((button) => button.rect.x + button.rect.w));
    const dpadCenter = (left + right) / 2;
    const sidebarCenter = layout.panels.sidebar.x + layout.panels.sidebar.w / 2;
    assert.ok(Math.abs(dpadCenter - sidebarCenter) <= 1);
});

test('game sidebar starts with category buttons instead of a flat character command list', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game' });
    const actions = createActionList(state, uiState);

    assert.deepEqual(actions.map((action) => action.label), ['Character', 'Spellbook', 'Codex', 'World', 'Crafting', 'Combat', 'System']);
    assert.equal(findActionById('character', actions), null);
    assert.equal(actions.every((action) => action.intent === 'ui.actions.openCategory'), true);
});

test('character category groups useful character views without duplicating the summary command', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game' });
    setActionCategory(uiState, 'character');
    const actions = createActionList(state, uiState);

    assert.ok(findActionById('stats', actions));
    assert.ok(findActionById('job', actions));
    assert.ok(findActionById('skills', actions));
    assert.ok(findActionById('inventory', actions));
    assert.ok(findActionById('equipment', actions));
    assert.equal(findActionById('character', actions), null);
});

test('spellbook codex and crafting categories expose coherent current and planned surfaces', () => {
    const state = createInitialState();
    const uiState = createCanvasUiState({ screen: 'game' });

    setActionCategory(uiState, 'spellbook');
    let actions = createActionList(state, uiState);
    assert.ok(findActionById('spells', actions));
    assert.ok(findActionById('techniques', actions));
    assert.ok(findActionById('abilities', actions));

    setActionCategory(uiState, 'codex');
    actions = createActionList(state, uiState);
    assert.ok(findActionById('bestiary', actions));
    assert.equal(findActionById('floraFauna', actions).disabled, true);
    assert.equal(findActionById('lootIndex', actions).disabled, true);
    assert.equal(findActionById('itemCompendium', actions).disabled, true);

    setActionCategory(uiState, 'crafting');
    actions = createActionList(state, uiState);
    assert.equal(actions.filter((action) => action.id !== 'actionCategoryBack').every((action) => action.disabled), true);
});

test('right-pane context snapshot exposes at-a-glance attributes and combat values', () => {
    const state = createInitialState();
    const snapshot = createCanvasContextSnapshot(state);

    assert.equal(Number.isFinite(snapshot.attributes.str), true);
    assert.equal(Number.isFinite(snapshot.attributes.mnd), true);
    assert.equal(Number.isFinite(snapshot.derived.attack), true);
    assert.equal(Number.isFinite(snapshot.derived.magicDefense), true);
});

test('canvas text wrapping breaks long creator descriptions and oversized tokens safely', () => {
    const ctx = { measureText: (value) => ({ width: String(value).length * 8 }) };
    const lines = wrapText(ctx, 'A concise description still needs to wrap within a narrow card.', 96);
    assert.ok(lines.length > 1);
    assert.equal(lines.every((line) => ctx.measureText(line).width <= 96), true);

    const tokenLines = wrapText(ctx, 'supercalifragilisticexpialidocious', 64);
    assert.ok(tokenLines.length > 1);
    assert.equal(tokenLines.every((line) => ctx.measureText(line).width <= 64), true);
});

test('creator keyboard text edits only the visible name field on the review step', () => {
    const uiState = createCanvasUiState({ screen: 'creator', creator: createGuidedCreatorState() });

    assert.deepEqual(applyCanvasKey(uiState, 'A'), { type: 'ignored' });
    assert.equal(uiState.creator.name, '');

    uiState.creator = createGuidedCreatorState({ stepIndex: 3 });
    assert.deepEqual(applyCanvasKey(uiState, 'A'), { type: 'edit' });
    assert.equal(uiState.creator.name, 'A');
});
