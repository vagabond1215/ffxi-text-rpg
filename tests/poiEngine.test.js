import test from 'node:test';
import assert from 'node:assert/strict';

import { createCommandRouter } from '../js/text/commandRouter.js';
import { createInitialState } from '../js/text/gameState.js';
import { getPoisForPlace, listPointsOfInterest } from '../js/text/data/pointsOfInterest.js';
import { getShopCatalogForPoi } from '../js/text/data/shopCatalogs.js';
import { getGuildServiceForPoi } from '../js/text/data/guildServices.js';
import { getQuestHookForPoi } from '../js/text/data/questHooks.js';
import {
    describeDiscoveredPois,
    describePlacePois,
    fastTravelToPoi,
    performPoiAction,
    talkAtCurrentGrid,
} from '../js/text/systems/poiEngine.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { validateWorldData } from '../js/text/systems/validation.js';


test('starter POIs are populated for major cities', () => {
    assert.ok(getPoisForPlace('southern-sandoria').length >= 8);
    assert.ok(getPoisForPlace('bastok-markets').length >= 8);
    assert.ok(getPoisForPlace('windurst-waters').length >= 6);
    assert.ok(listPointsOfInterest().some((poi) => poi.actions.includes('shop')));
    assert.ok(listPointsOfInterest().some((poi) => poi.actions.includes('guild')));
});

test('catalogs are attached to POI ids', () => {
    assert.ok(getShopCatalogForPoi('poi-sandoria-s-ashene'));
    assert.ok(getGuildServiceForPoi('poi-sandoria-s-faulpie'));
    assert.ok(getQuestHookForPoi('poi-metalworks-cid'));
});

test('world validation includes POI and catalog data', () => {
    assert.deepEqual(validateWorldData(), []);
});

test('describePlacePois lists seeded POIs', () => {
    assert.match(describePlacePois('bastok-markets'), /Brunhilde/);
});

test('talking at current grid discovers same-zone fast-travel POI', () => {
    const state = createInitialState();
    const ashene = getPoisForPlace('southern-sandoria').find((poi) => poi.name === 'Ashene');
    setPositionAndDiscover(state, 'southern-sandoria', ashene.coordinate);

    assert.match(talkAtCurrentGrid(state, 'Ashene'), /Discovered: yes/);
    assert.match(describeDiscoveredPois(state), /Ashene/);

    setPositionAndDiscover(state, 'southern-sandoria', { x: 2, y: 2 });
    assert.match(fastTravelToPoi(state, 'Ashene'), /Fast traveled to Ashene/);
    assert.equal(state.position.x, ashene.coordinate.x);
    assert.equal(state.position.y, ashene.coordinate.y);
});

test('POI actions render shop guild and quest catalogs', () => {
    const state = createInitialState();
    const ashene = getPoisForPlace('southern-sandoria').find((poi) => poi.name === 'Ashene');
    setPositionAndDiscover(state, 'southern-sandoria', ashene.coordinate);
    assert.match(performPoiAction(state, 'shop', 'Ashene'), /Bronze Sword/);

    const faulpie = getPoisForPlace('southern-sandoria').find((poi) => poi.name === 'Faulpie');
    setPositionAndDiscover(state, 'southern-sandoria', faulpie.coordinate);
    assert.match(performPoiAction(state, 'guild', 'Faulpie'), /Tanning Guild/);

    const ambrotien = getPoisForPlace('southern-sandoria').find((poi) => poi.name === 'Ambrotien');
    setPositionAndDiscover(state, 'southern-sandoria', ambrotien.coordinate);
    assert.match(performPoiAction(state, 'quest', 'Ambrotien'), /Mission Desk/);
});

test('router exposes POI discovery fast travel and catalog actions', () => {
    const state = createInitialState();
    const ashene = getPoisForPlace('southern-sandoria').find((poi) => poi.name === 'Ashene');
    setPositionAndDiscover(state, 'southern-sandoria', ashene.coordinate);
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('here'), /Ashene/);
    assert.match(router('talk Ashene'), /Ashene/);
    assert.match(router('shop Ashene'), /Bronze Sword/);
    assert.match(router('discovered'), /Ashene/);
    assert.match(router('fastpoi Ashene'), /Fast traveled to Ashene/);
    assert.match(router('zonefast'), /Known zone exits/);
});
