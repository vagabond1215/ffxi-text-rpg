import test from 'node:test';
import assert from 'node:assert/strict';

import { getPoisForPlace } from '../js/text/data/pointsOfInterest.js';
import { createNewGameState } from '../js/text/gameState.js';
import { grantCapability } from '../js/text/systems/capabilityEngine.js';
import { recordPoiExposure } from '../js/text/systems/localKnowledgeEngine.js';
import { createPlayerInformationModel } from '../js/text/systems/playerInformationEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

function learnSera(state) {
    const sera = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Sera Talwin');
    assert.ok(sera);
    recordPoiExposure(state, sera, { points: 7, learnedName: true });
    return sera;
}

test('information model exposes acquired knowledge without enumerating the fresh locality', () => {
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
    assert.deepEqual(information.local.points, []);
    assert.deepEqual(information.local.destinations, []);

    const hiddenLocalSearch = createPlayerInformationModel(state, { query: 'Sera' }).search;
    assert.deepEqual(hiddenLocalSearch.results, []);

    learnSera(state);
    const learnedInformation = createPlayerInformationModel(state);
    assert.ok(learnedInformation.local.points.some((entry) => entry.name === 'Sera Talwin'));
    const localSearch = createPlayerInformationModel(state, { query: 'Sera' }).search;
    assert.ok(localSearch.results.some((entry) => entry.name === 'Sera Talwin' && entry.action?.intent === 'locality.poi.visit'));

    const capabilitySearch = createPlayerInformationModel(state, { query: 'Ore Survey' }).search;
    assert.ok(capabilitySearch.results.some((entry) => entry.name === 'Ore Survey' && entry.action?.intent === 'ui.view.open'));

    const hiddenSearch = createPlayerInformationModel(state, { query: 'Tall Reedbed' }).search;
    assert.deepEqual(hiddenSearch.results, []);
});

test('core information views keep locality names hidden until learned', () => {
    const state = createNewGameState({ name: 'Lark' });
    grantCapability(state.player, 'practical-ore-survey');

    const freshCodex = renderGameScreen(
        createGameViewModel(state, createUiState({ screen: 'game', activeView: 'codex', informationQuery: 'Sera' })),
        createUiState({ screen: 'game', activeView: 'codex', informationQuery: 'Sera' }),
        { displayName: 'Local Player' },
    );
    assert.doesNotMatch(freshCodex, /Sera Talwin/);

    learnSera(state);

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
            assert.match(html, /Sera Talwin/);
            assert.match(html, /data-information-action=/);
        }
    }
});

test('game view carries the transient semantic query without adding gameplay state', () => {
    const state = createNewGameState({ name: 'Lark' });
    const uiState = createUiState({ screen: 'game', activeView: 'codex', informationQuery: 'Southgate' });
    const model = createGameViewModel(state, uiState);

    assert.equal(model.information.search.query, 'Southgate');
    assert.ok(model.information.search.results.some((entry) => /Southgate/.test(entry.name)));
    assert.equal(state.informationQuery, undefined);
    assert.equal(state.player.informationQuery, undefined);
});
