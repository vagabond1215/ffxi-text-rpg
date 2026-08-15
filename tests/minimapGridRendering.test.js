import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { renderMinimap } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

test('grid atlas keys produce drawable discovery-relative minimap cells in exploration space', () => {
    const state = createNewGameState({ name: 'Lark' });
    setPositionAndDiscover(state, 'west-elderwood', { x: 4, y: 4 });

    const model = createGameViewModel(state, createUiState({ screen: 'game' }));

    assert.equal(model.navigation.mode, 'exploration');
    assert.equal(model.map.mode, 'grid');
    assert.equal(model.map.cells.length, 1);
    assert.equal(model.map.cells[0].current, true);
    assert.deepEqual({ x: model.map.cells[0].x, y: model.map.cells[0].y }, { x: 0, y: 0 });
    assert.equal(model.map.totalCount, '?');

    const html = renderMinimap(model.map);
    assert.match(html, /<circle class="map-cell map-current"/);
    assert.doesNotMatch(html, /4,4/);
});
