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
    assert.ok(getPoisForPlace('thornwall-southgate').length >= 8);
    assert.ok(getPoisForPlace('brasshaven-market-ring').length >= 8);
    assert.ok(getPoisForPlace('mistmere-canal-ward').length >= 6);
    assert.ok(listPointsOfInterest().some((poi) => poi.actions.includes('shop')));
    assert.ok(listPointsOfInterest().some((poi) => poi.actions.includes('guild')));
    assert.ok(listPointsOfInterest().some((poi) => poi.actions.includes('companion')));
    assert.equal(listPointsOfInterest().some((poi) => poi.actions.includes('trust')), false);
});

test('catalogs are attached to bounded legacy POI ids', () => {
    assert.ok(getShopCatalogForPoi('poi-sandoria-s-ashene'));
    assert.ok(getGuildServiceForPoi('poi-sandoria-s-faulpie'));
    assert.ok(getQuestHookForPoi('poi-metalworks-cid'));
});

test('world validation includes POI and catalog data', () => {
    assert.deepEqual(validateWorldData(), []);
});

test('describePlacePois lists canonical seeded POIs', () => {
    assert.match(describePlacePois('brasshaven-market-ring'), /Dessa Rivet/);
});

test('talking at current grid discovers same-place fast-travel POI', () => {
    const state = createInitialState();
    const vendor = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Sella Thorn');
    setPositionAndDiscover(state, 'thornwall-southgate', vendor.coordinate);

    assert.match(talkAtCurrentGrid(state, 'Sella Thorn'), /Discovered: yes/);
    assert.match(describeDiscoveredPois(state), /Sella Thorn/);

    setPositionAndDiscover(state, 'thornwall-southgate', { levelId: 'main', coord: 'H-8' });
    assert.match(fastTravelToPoi(state, 'Sella Thorn'), /Fast traveled to Sella Thorn/);
    assert.equal(state.position.coord, vendor.coordinate.coord);
});

test('POI actions render shop guild quest and companion interactions', () => {
    const state = createInitialState();
    const vendor = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Sella Thorn');
    setPositionAndDiscover(state, 'thornwall-southgate', vendor.coordinate);
    assert.match(performPoiAction(state, 'shop', 'Sella Thorn'), /Bronze Sword/);

    const guildMaster = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Edrin Bale');
    setPositionAndDiscover(state, 'thornwall-southgate', guildMaster.coordinate);
    assert.match(performPoiAction(state, 'guild', 'Edrin Bale'), /Tanning Guild/);

    const clerk = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Oren Vale');
    setPositionAndDiscover(state, 'thornwall-southgate', clerk.coordinate);
    const commissionOutput = performPoiAction(state, 'quest', 'Oren Vale');
    assert.match(commissionOutput, /Thornwall Southgate Civic Commission Desk/);
    assert.match(commissionOutput, /No formal tracked commission is posted here yet/);

    const companion = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Rowan Greymark');
    setPositionAndDiscover(state, 'thornwall-southgate', companion.coordinate);
    const companionOutput = performPoiAction(state, 'companion', 'Rowan Greymark');
    assert.match(companionOutput, /Type: companion/);
    assert.match(companionOutput, /Action: companion/);
    assert.match(companionOutput, /party system/);
    assert.doesNotMatch(companionOutput, /not implemented/i);
    assert.doesNotMatch(companionOutput, /Trust/);
});

test('router exposes POI discovery fast travel catalog companion and exit actions', () => {
    const state = createInitialState();
    const vendor = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Sella Thorn');
    setPositionAndDiscover(state, 'thornwall-southgate', vendor.coordinate);
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.match(router('here'), /Sella Thorn/);
    assert.match(router('talk Sella Thorn'), /Sella Thorn/);
    assert.match(router('shop Sella Thorn'), /Bronze Sword/);
    assert.match(router('discovered'), /Sella Thorn/);
    assert.match(router('fastpoi Sella Thorn'), /Fast traveled to Sella Thorn/);
    assert.match(router('exits'), /Known exits/);

    const companion = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Rowan Greymark');
    setPositionAndDiscover(state, 'thornwall-southgate', companion.coordinate);
    const output = router('companion Rowan Greymark');
    assert.match(output, /party system/);
    assert.doesNotMatch(output, /not implemented/i);
});