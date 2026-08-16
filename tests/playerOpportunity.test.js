import test from 'node:test';
import assert from 'node:assert/strict';

import { getNation } from '../js/text/data/nations.js';
import { createNewGameState } from '../js/text/gameState.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { createPlayerOpportunityModel } from '../js/text/systems/playerOpportunityEngine.js';
import { advanceTravel, startTravel } from '../js/text/systems/travelEngine.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const ORIGINS = Object.freeze([
    { nationId: 'thornwall', guidePoiId: 'poi-sandoria-s-alaune', destinationId: 'west-elderwood', sourceId: 'source-west-elderwood-amber-resin-grove' },
    { nationId: 'brasshaven', guidePoiId: 'poi-bastok-markets-rabid-wolf', destinationId: 'south-redstone-reach', sourceId: 'source-south-redstone-copper-seam' },
    { nationId: 'mistmere', guidePoiId: 'poi-waters-dagoza-beruza', destinationId: 'west-starfen', sourceId: 'source-west-starfen-reedbed' },
]);

function meetGuide(state, guidePoiId) {
    const result = performLocalityPoiAction(state, guidePoiId, 'talk');
    assert.equal(result.ok, true);
}

function opportunity(model, category) {
    return model.entries.find((entry) => entry.category === category);
}

test('each origin starts with a real field tool and Journal preparation tells the player to equip it', () => {
    for (const origin of ORIGINS) {
        const state = createNewGameState({ nationId: origin.nationId });
        const nation = getNation(origin.nationId);
        const starterItemId = nation.startingEquipmentIds[0];
        const carried = state.player.inventory.find((item) => item.templateId === starterItemId || item.id === starterItemId);
        assert.ok(carried, `${origin.nationId} missing ${starterItemId}`);

        meetGuide(state, origin.guidePoiId);
        const model = createPlayerOpportunityModel(state);
        const preparation = opportunity(model, 'preparation');
        assert.equal(preparation.status, 'ready');
        assert.equal(preparation.action.intent, 'equipment.equip');
        assert.equal(preparation.action.payload.itemId, starterItemId);
        assert.match(preparation.reason, /Possession alone does not satisfy an equipped-tool requirement/i);
    }
});

test('first-day opportunities answer what why requirements and persistent progress across all origins', () => {
    for (const origin of ORIGINS) {
        const state = createNewGameState({ nationId: origin.nationId });
        meetGuide(state, origin.guidePoiId);
        const model = createPlayerOpportunityModel(state);

        assert.deepEqual(model.entries.map((entry) => entry.category), ['preparation', 'livelihood', 'training', 'exploration', 'service']);
        assert.ok(model.recommendedOpportunityId);
        for (const entry of model.entries) {
            assert.ok(entry.title.length > 3);
            assert.ok(entry.summary.length > 20);
            assert.ok(entry.reason.length > 20);
            assert.ok(entry.progress.length > 20);
            assert.ok(Array.isArray(entry.requirements));
            assert.ok(['ready', 'blocked', 'active', 'complete', 'available'].includes(entry.status));
        }
    }
});

test('equipping the origin tool opens an honest livelihood route from named locality navigation', () => {
    for (const origin of ORIGINS) {
        const state = createNewGameState({ nationId: origin.nationId });
        meetGuide(state, origin.guidePoiId);
        const starterItemId = getNation(origin.nationId).startingEquipmentIds[0];
        assert.match(equipItem(state, starterItemId), /Equipped/);

        const beforeTravel = createPlayerOpportunityModel(state);
        const livelihood = opportunity(beforeTravel, 'livelihood');
        assert.equal(livelihood.status, 'ready');
        assert.equal(livelihood.action.intent, 'travel.start');
        assert.equal(livelihood.action.payload.destinationId, origin.destinationId);

        const started = startTravel(state, origin.destinationId);
        assert.equal(started.ok, true, started.display?.text ?? started.reason);
        assert.equal(started.data.to, origin.destinationId);
        const advanced = advanceTravel(state, started.data.durationSeconds);
        assert.equal(advanced.completed, true);
        assert.equal(state.currentPlaceId, origin.destinationId);

        const inRegion = createPlayerOpportunityModel(state);
        const regionalLivelihood = opportunity(inRegion, 'livelihood');
        assert.equal(regionalLivelihood.status, 'ready');
        assert.equal(regionalLivelihood.action.intent, 'gathering.start');
        assert.equal(regionalLivelihood.action.payload.sourceId, origin.sourceId);
        const gathering = startGatheringWork(state, origin.sourceId);
        assert.equal(gathering.ok, true, gathering.display?.text ?? gathering.reason);
        assert.equal(createPlayerOpportunityModel(state).entries.find((entry) => entry.category === 'livelihood').status, 'active');
    }
});

test('regional training opportunity points only at an enemy authored for the current place', () => {
    for (const origin of ORIGINS) {
        const state = createNewGameState({ nationId: origin.nationId });
        meetGuide(state, origin.guidePoiId);
        const starterItemId = getNation(origin.nationId).startingEquipmentIds[0];
        equipItem(state, starterItemId);
        const started = startTravel(state, origin.destinationId);
        advanceTravel(state, started.data.durationSeconds);

        const training = opportunity(createPlayerOpportunityModel(state), 'training');
        assert.equal(training.status, 'ready');
        assert.equal(training.action.intent, 'combat.encounter');
        assert.ok(state.enemies.some((enemy) => enemy.id === training.action.payload.enemyId));
        const place = (await import('../js/text/data/places.js')).getPlace(state.currentPlaceId);
        assert.ok(place.spawnRules.some((rule) => rule.enemyId === training.action.payload.enemyId));
    }
});

test('Journal renders actionable opportunity cards instead of future-system placeholder copy', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    meetGuide(state, 'poi-sandoria-s-alaune');
    const uiState = createUiState({ screen: 'game', activeView: 'journal' });
    const html = renderGameScreen(createGameViewModel(state, uiState), uiState);

    assert.match(html, /Journal/);
    assert.match(html, /Suggested next/);
    assert.match(html, /<strong>Why:<\/strong>/);
    assert.match(html, /<strong>Progress:<\/strong>/);
    assert.match(html, /data-opportunity-action=/);
    assert.match(html, /Equip Field Knife/);
    assert.doesNotMatch(html, /Quest and commitment records will appear here/i);
});

test('Craft view describes the implemented production substrate rather than claiming it does not exist', () => {
    const state = createNewGameState();
    const uiState = createUiState({ screen: 'game', activeView: 'craft' });
    const html = renderGameScreen(createGameViewModel(state, uiState), uiState);

    assert.match(html, /canonical timed work/i);
    assert.doesNotMatch(html, /not implemented yet/i);
});
