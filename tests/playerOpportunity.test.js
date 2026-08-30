import test from 'node:test';
import assert from 'node:assert/strict';
import { learnLocality, moveToKnownLocality, useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import { getNation } from '../js/text/data/nations.js';
import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { equipItem } from '../js/text/systems/equipmentEngine.js';
import { startGatheringWork } from '../js/text/systems/gatheringWorkEngine.js';
import { moveWithinLocality, performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { claimOriginStarterKit } from '../js/text/systems/playerExperienceEngine.js';
import { createPlayerOpportunityModel } from '../js/text/systems/playerOpportunityEngine.js';
import { advanceTravel, startTravel } from '../js/text/systems/travelEngine.js';
import { renderGameScreen } from '../js/text/ui/domRenderer.js';
import { createGameViewModel } from '../js/text/ui/gameViewModel.js';
import { createUiState } from '../js/text/ui/uiState.js';

const ORIGINS = Object.freeze([
    { nationId: 'thornwall', guidePoiId: 'poi-sandoria-s-alaune', departureId: 'thornwall-southgate', destinationId: 'west-elderwood', sourceId: 'source-west-elderwood-amber-resin-grove' },
    { nationId: 'brasshaven', guidePoiId: 'poi-bastok-markets-rabid-wolf', departureId: 'brasshaven-market-ring', destinationId: 'south-redstone-reach', sourceId: 'source-south-redstone-copper-seam' },
    { nationId: 'mistmere', guidePoiId: 'poi-waters-dagoza-beruza', departureId: 'mistmere-reedport', destinationId: 'west-starfen', sourceId: 'source-west-starfen-reedbed' },
]);

function meetGuide(state, guidePoiId) {
    const result = useKnownPoi(state, guidePoiId, 'talk');
    assert.equal(result.ok, true);
}

function opportunity(model, category) {
    return model.entries.find((entry) => entry.category === category);
}

function claimAndEquipStarter(state, origin) {
    meetGuide(state, origin.guidePoiId);
    const starterItemId = getNation(origin.nationId).startingEquipmentIds[0];
    const claimed = claimOriginStarterKit(state);
    assert.equal(claimed.ok, true, claimed.display?.text ?? claimed.reason);
    const carried = state.player.inventory.find((item) => item.templateId === starterItemId || item.id === starterItemId);
    assert.ok(carried, `${origin.nationId} missing claimed ${starterItemId}`);
    assert.match(equipItem(state, starterItemId), /Equipped/);
    return starterItemId;
}

function reachFirstRegion(state, origin, category = 'livelihood') {
    let entry = opportunity(createPlayerOpportunityModel(state), category);
    if (state.currentPlaceId !== origin.departureId) {
        assert.equal(entry.status, 'ready', `${origin.nationId} should expose its named departure locality`);
        assert.equal(entry.action?.intent, 'locality.move');
        assert.equal(entry.action?.payload.destinationId, origin.departureId);
        const moved = moveToKnownLocality(state, origin.departureId);
        assert.equal(moved.ok, true, moved.message);
        assert.equal(state.currentPlaceId, origin.departureId);
        entry = opportunity(createPlayerOpportunityModel(state), category);
    }

    assert.equal(entry.status, 'ready', `${origin.nationId} should expose regional travel from ${origin.departureId}`);
    assert.equal(entry.action?.intent, 'travel.start');
    assert.equal(entry.action?.payload.destinationId, origin.destinationId);
    const started = startTravel(state, origin.destinationId);
    assert.equal(started.ok, true, started.display?.text ?? started.reason);
    assert.equal(started.data.to, origin.destinationId);
    const advanced = advanceTravel(state, started.data.durationSeconds);
    assert.equal(advanced.completed, true, advanced.reason);
    assert.equal(state.currentPlaceId, origin.destinationId);
}

test('each origin guide issues a real field tool and Journal advances from claim to equip', () => {
    for (const origin of ORIGINS) {
        const state = createNewGameState({ nationId: origin.nationId });
        const starterItemId = getNation(origin.nationId).startingEquipmentIds[0];
        assert.equal(state.player.inventory.some((item) => item.templateId === starterItemId || item.id === starterItemId), false);

        meetGuide(state, origin.guidePoiId);
        let preparation = opportunity(createPlayerOpportunityModel(state), 'preparation');
        assert.equal(preparation.status, 'ready');
        assert.equal(preparation.action?.intent, 'playerExperience.claimStarterKit');

        const claimed = claimOriginStarterKit(state);
        assert.equal(claimed.ok, true, claimed.display?.text ?? claimed.reason);
        assert.ok(state.player.inventory.some((item) => item.templateId === starterItemId || item.id === starterItemId));

        preparation = opportunity(createPlayerOpportunityModel(state), 'preparation');
        assert.equal(preparation.status, 'ready');
        assert.equal(preparation.action?.intent, 'equipment.equip');
        assert.equal(preparation.action?.payload.itemId, starterItemId);
        assert.match(preparation.reason, /Possession alone does not satisfy an equipped-tool requirement/i);

        assert.match(equipItem(state, starterItemId), /Equipped/);
        preparation = opportunity(createPlayerOpportunityModel(state), 'preparation');
        assert.equal(preparation.status, 'complete');
        assert.equal(preparation.action, null);
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

test('equipping the origin tool opens an honest livelihood route through named locality and regional navigation', () => {
    for (const origin of ORIGINS) {
        const state = createNewGameState({ nationId: origin.nationId });
        claimAndEquipStarter(state, origin);

        const beforeTravel = createPlayerOpportunityModel(state);
        const livelihood = opportunity(beforeTravel, 'livelihood');
        assert.equal(livelihood.status, 'ready');
        if (state.currentPlaceId === origin.departureId) {
            assert.equal(livelihood.action.intent, 'travel.start');
            assert.equal(livelihood.action.payload.destinationId, origin.destinationId);
        } else {
            assert.equal(livelihood.action.intent, 'locality.move');
            assert.equal(livelihood.action.payload.destinationId, origin.departureId);
        }

        reachFirstRegion(state, origin, 'livelihood');

        const inRegion = createPlayerOpportunityModel(state);
        const regionalLivelihood = opportunity(inRegion, 'livelihood');
        assert.equal(regionalLivelihood.status, 'ready');
        assert.equal(regionalLivelihood.action.intent, 'gathering.start');
        assert.equal(regionalLivelihood.action.payload.sourceId, origin.sourceId);
        const gathering = startGatheringWork(state, origin.sourceId);
        assert.equal(gathering.ok, true, gathering.display?.text ?? gathering.reason);
        assert.equal(opportunity(createPlayerOpportunityModel(state), 'livelihood').status, 'active');
    }
});

test('regional training opportunity points only at an enemy authored for the current place', () => {
    for (const origin of ORIGINS) {
        const state = createNewGameState({ nationId: origin.nationId });
        claimAndEquipStarter(state, origin);
        reachFirstRegion(state, origin, 'training');

        const training = opportunity(createPlayerOpportunityModel(state), 'training');
        assert.equal(training.status, 'ready', `${origin.nationId} training should be ready in ${origin.destinationId}`);
        assert.equal(training.action.intent, 'combat.encounter');
        assert.ok(state.enemies.some((enemy) => enemy.id === training.action.payload.enemyId));
        const place = getPlace(state.currentPlaceId);
        assert.ok(place.spawnRules.some((rule) => rule.enemyId === training.action.payload.enemyId));
    }
});

test('Journal renders actionable opportunity cards and advances from collection to equipment preparation', () => {
    const state = createNewGameState({ nationId: 'thornwall' });
    meetGuide(state, 'poi-sandoria-s-alaune');
    const uiState = createUiState({ screen: 'game', activeView: 'journal' });
    let html = renderGameScreen(createGameViewModel(state, uiState), uiState);

    assert.match(html, /Journal/);
    assert.match(html, /Suggested next/);
    assert.doesNotMatch(html, /<strong>Why:<\/strong>/);
    assert.match(html, /<details class="opportunity-details">/);
    assert.match(html, /<summary>Details<\/summary>/);
    assert.match(html, /<strong>Progress:<\/strong>/);
    assert.match(html, /data-opportunity-action=/);
    assert.match(html, /Collect Field Knife/);
    assert.doesNotMatch(html, /Quest and commitment records will appear here/i);

    assert.equal(claimOriginStarterKit(state).ok, true);
    html = renderGameScreen(createGameViewModel(state, uiState), uiState);
    assert.match(html, /Equip Field Knife/);
});

test('Craft view keeps unknown settlement services hidden until the locality is learned', () => {
    const state = createNewGameState();
    const uiState = createUiState({ screen: 'game', activeView: 'craft' });
    let html = renderGameScreen(createGameViewModel(state, uiState), uiState);

    assert.match(html, /Work, Trade &amp; Recover/i);
    assert.match(html, /Workshop work/i);
    assert.match(html, /Trade/i);
    assert.match(html, /Recovery/i);
    assert.doesNotMatch(html, /data-service-action=/);
    assert.match(html, /No merchant is available in this locality/i);

    learnLocality(state);
    html = renderGameScreen(createGameViewModel(state, uiState), uiState);
    assert.match(html, /data-service-action=/);
    assert.doesNotMatch(html, /data-command="production"/i);
    assert.doesNotMatch(html, /canonical timed work|not implemented yet/i);
});