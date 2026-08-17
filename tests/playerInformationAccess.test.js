import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { createPlayerInformationModel } from '../js/text/systems/playerInformationEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

test('0.7.300 information model exposes only carried, learned, visited, acquired, and currently actionable knowledge', () => {
    const state = createNewGameState({ name: 'Lark' });
    grantCapability(state.player, 'practical-ore-survey');

    const information = createPlayerInformationModel(state);

    assert.equal(information.version, 1);
    assert.equal('playerInformation' in state, false);
    assert.ok(information.preparation.containers.some((entry) => entry.label === 'Inventory'));
    assert.equal(information.preparation.containers.some((entry) => entry.label === 'Home Safe'), false);
    assert.ok(information.capabilities.entries.some((entry) => entry.name === 'Ore Survey'));
    assert.ok(information.knowledge.maps.some((entry) => entry.id === 'map-thornwall'));
    assert.equal(information.knowledge.maps.some((entry) => entry.id === 'map-starfen'), false);
    assert.ok(information.knowledge.places.some((entry) => entry.name === 'Thornwall Southgate'));
    assert.equal(information.knowledge.places.some((entry) => entry.name === 'West Starfen'), false);
    assert.ok(information.local.points.some((entry) => entry.name === 'Sera Talwin'));

    const localSearch = createPlayerInformationModel(state, { query: 'Sera' }).search;
    assert.ok(localSearch.results.some((entry) => entry.name === 'Sera Talwin' && entry.action?.intent === 'locality.poi'));

    const capabilitySearch = createPlayerInformationModel(state, { query: 'Ore Survey' }).search;
    assert.ok(capabilitySearch.results.some((entry) => entry.name === 'Ore Survey' && entry.action?.intent === 'ui.view.open'));

    const hiddenSearch = createPlayerInformationModel(state, { query: 'Tall Reedbed' }).search;
    assert.deepEqual(hiddenSearch.results, []);
});

test('0.7.300 core information views render structured semantic surfaces instead of command vocabulary', () => {
    const state = createNewGameState({ name: 'Lark' });
    grantCapability(state.player, 'practical-ore-survey');

    for (const activeView of ['character', 'spellbook', 'codex', 'world']) {
        const uiState = createUiState({ screen: 'game', activeView, informationQuery: activeView === 'codex' ? 'Sera' : '' });
        const model = createGameViewModel(state, uiState);
        const html = renderGameScreen(model, uiState, { displayName: 'Local Player' });

        assert.doesNotMatch(html, /data-command=/);
        assert.match(html, /Search what you know or can do/);
        if (activeView === 'character') {
            assert.match(html, />Equipped</);
            assert.match(html, />Carried</);
            assert.match(html, />Skills</);
            assert.match(html, />Capabilities</);
            assert.match(html, /Ore Survey/);
        }
        if (activeView === 'codex') {
            assert.match(html, /Search results/);
            assert.match(html, /Sera Talwin/);
            assert.doesNotMatch(html, /Tall Reedbed/);
        }
        if (activeView === 'world') {
            assert.match(html, /Nearby districts/);
            assert.match(html, /Local places &amp; people/);
            assert.match(html, /data-information-action=/);
        }
    }
});

test('0.7.300 game view carries the transient semantic query without adding gameplay state', () => {
    const state = createNewGameState({ name: 'Lark' });
    const uiState = createUiState({ screen: 'game', activeView: 'codex', informationQuery: 'Southgate' });
    const model = createGameViewModel(state, uiState);

    assert.equal(model.information.search.query, 'Southgate');
    assert.ok(model.information.search.results.some((entry) => /Southgate/.test(entry.name)));
    assert.equal(state.informationQuery, undefined);
    assert.equal(state.player.informationQuery, undefined);
});
