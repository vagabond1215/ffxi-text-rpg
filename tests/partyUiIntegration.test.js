import test from 'node:test';
import assert from 'node:assert/strict';

import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { getRecruitedCompanion } from '../js/text/systems/partyEngine.js';
import { createCanvasUiState } from '../js/text/ui/canvasInput.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { dispatchUiIntent } from '../js/text/ui/uiIntentDispatcher.js';

const MARA_ID = 'companion-mara-venn';

test('game view exposes recruitable companion as a semantic action and intent recruits without a command string', () => {
    const state = createNewGameState();
    const place = getPlace('timbercross-landing');
    const moved = setPositionAndDiscover(state, place.id, place.coordinateSystem.start);
    assert.equal(moved.ok, true);
    const uiState = createCanvasUiState({ screen: 'game' });

    const before = createGameViewModel(state, uiState);
    const action = before.contextualActions.find((entry) => entry.intent === 'party.recruit');
    assert.ok(action);
    assert.equal(action.payload.companionId, MARA_ID);

    const result = dispatchUiIntent({
        intent: action.intent,
        payload: action.payload,
        state,
        uiState,
        session: { loggedIn: true, accounts: [], settings: {} },
    });
    const after = createGameViewModel(state, uiState);

    assert.equal(result.ok, true);
    assert.equal(result.partyResult.ok, true);
    assert.ok(getRecruitedCompanion(state, MARA_ID));
    assert.equal(after.party.activeCount, 1);
    assert.equal(after.party.entries[0].name, 'Mara Venn');
    assert.deepEqual(uiState.commandHistory, []);
});
