import test from 'node:test';
import assert from 'node:assert/strict';

import { createCanvasUiState, applyCanvasKey, submitCommandInput } from '../js/text/ui/canvasInput.js';
import { createCanvasLayout, hitTestAction } from '../js/text/ui/canvasLayout.js';
import { createActionList, dispatchAction, findActionById } from '../js/text/ui/uiActions.js';

test('canvas action registry maps global buttons to existing commands', () => {
    assert.equal(findActionById('character').command, 'character');
    assert.equal(findActionById('stats').command, 'stats');
    assert.equal(findActionById('skills').command, 'skills');
    assert.equal(findActionById('save').command, 'save');
});

test('canvas action list marks unavailable battle action disabled', () => {
    const actions = createActionList({ activeBattle: null });

    assert.equal(findActionById('battle', actions).disabled, true);
    assert.equal(findActionById('stats', actions).disabled, false);
});

test('canvas layout creates clickable button bounds', () => {
    const actions = createActionList({ activeBattle: { phase: 'active' } });
    const layout = createCanvasLayout({ width: 1200, height: 800, actions });
    const statsButton = layout.actionButtons.find((button) => button.action.id === 'stats');

    assert.ok(statsButton.rect.w > 100);
    assert.ok(statsButton.rect.h > 20);
});

test('canvas hit testing returns the expected action', () => {
    const actions = createActionList({ activeBattle: { phase: 'active' } });
    const layout = createCanvasLayout({ width: 1200, height: 800, actions });
    const target = layout.actionButtons.find((button) => button.action.id === 'inventory');
    const hit = hitTestAction(layout, target.rect.x + target.rect.w / 2, target.rect.y + target.rect.h / 2);

    assert.equal(hit.action.id, 'inventory');
});

test('dispatching a canvas action calls the command router seam', () => {
    let routedCommand = null;
    const result = dispatchAction('skills', (command) => {
        routedCommand = command;
        return 'skills output';
    });

    assert.equal(result.ok, true);
    assert.equal(routedCommand, 'skills');
    assert.equal(result.response, 'skills output');
});

test('canvas keyboard input builds and submits command strings', () => {
    const uiState = createCanvasUiState();
    for (const key of 'stats') applyCanvasKey(uiState, key);

    const result = applyCanvasKey(uiState, 'Enter');

    assert.deepEqual(result, { type: 'submit', command: 'stats' });
    assert.equal(uiState.inputBuffer, '');
    assert.deepEqual(uiState.commandHistory, ['stats']);
});

test('canvas command history stores submitted commands and supports browsing', () => {
    const uiState = createCanvasUiState({ inputBuffer: 'look' });
    const first = submitCommandInput(uiState, (command) => `${command} output`);
    uiState.inputBuffer = 'inventory';
    const second = submitCommandInput(uiState, (command) => `${command} output`);

    applyCanvasKey(uiState, 'ArrowUp');
    assert.equal(uiState.inputBuffer, 'inventory');
    applyCanvasKey(uiState, 'ArrowUp');
    assert.equal(uiState.inputBuffer, 'look');
    applyCanvasKey(uiState, 'ArrowDown');
    assert.equal(uiState.inputBuffer, 'inventory');
    assert.equal(first.command, 'look');
    assert.equal(second.command, 'inventory');
});
