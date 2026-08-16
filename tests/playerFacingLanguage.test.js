import test from 'node:test';
import assert from 'node:assert/strict';

import { createNewGameState } from '../js/text/gameState.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';

const DEVELOPER_JARGON = /\b(?:canonical|authority|authoritative|persisted|provenance-bearing)\b|semantic event|authored database|internal coordinates|future-system placeholder|exactly once|persisted outcome roll|fictional minutes/i;

function render(state, activeView) {
    const uiState = { activeView, outputLines: [] };
    return renderGameScreen(createGameViewModel(state, uiState), uiState, {});
}

test('ordinary player views keep implementation rationale out of visible prose', () => {
    const state = createNewGameState({ nationId: 'brasshaven', name: 'Ari' });
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);

    for (const view of ['journal', 'spellbook', 'codex', 'craft']) {
        const html = render(state, view);
        assert.doesNotMatch(html, DEVELOPER_JARGON, `${view} should use character-facing language`);
    }
});

test('Journal is decision-first while deeper requirements remain available on demand', () => {
    const state = createNewGameState({ nationId: 'brasshaven', name: 'Ari' });
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);

    const html = render(state, 'journal');
    assert.match(html, /Suggested next/);
    assert.match(html, /<details class="opportunity-details">/);
    assert.match(html, /<summary>Details<\/summary>/);
    assert.doesNotMatch(html, /<strong>Why:<\/strong>/);
});
