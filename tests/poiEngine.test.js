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
import { recordPoiExposure } from '../js/text/systems/localKnowledgeEngine.js';
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

test('describePlacePois remains a canonical developer/debug listing', () => {
    assert.match(describePlacePois('brasshaven-market-ring'), /Dessa Rivet/);
});

test('talking at a physically present POI learns its name but does not make it instantly familiar', () => {
    const state = createInitialState();
    const vendor = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Sella Thorn');
    setPositionAndDiscover(state, 'thornwall-southgate', vendor.coordinate);

    assert.match(talkAtCurrentGrid(state, 'Sella Thorn'), /Sella Thorn/);
    assert.match(describeDiscoveredPois(state), /Sella Thorn/);
    assert.equal(state.localKnowledge.pois[vendor.id].learnedName, true);
    assert.notEqual(state.localKnowledge.pois[vendor.id].knowledgeState, 'familiar');

    setPositionAndDiscover(state, 'thornwall-southgate', { levelId: 'main', coord: 'H-8' });
    assert.match(fastTravelToPoi(state, 'Sella Thorn'), /do not yet know the locality well enough/i);

    recordPoiExposure(state, vendor, { points: 10 });
    assert.match(fastTravelToPoi(state, 'Sella Thorn'), /Went directly to Sella Thorn/);
    assert.equal(state.position.coord, vendor.coordinate.coord);
});

test('POI actions render shop guild quest and companion interactions after physical positioning', () => {
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

test('router keeps legacy POI commands but direct-return command obeys familiarity', () => {
    const state = createInitialState();
    const vendor = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Sella Thorn');
    setPositionAndDiscover(state, 'thornwall-southgate', vendor.coordinate);
    const router = createCommandRouter(state, {
        saveGame: () => true,
        clearSave: () => {},
        reload: () => {},
    });

    assert.doesNotMatch(router('here'), /Sella Thorn/);
    assert.match(router('talk Sella Thorn'), /Sella Thorn/);
    assert.match(router('shop Sella Thorn'), /Bronze Sword/);
    assert.match(router('discovered'), /Sella Thorn/);
    assert.match(router('fastpoi Sella Thorn'), /do not yet know the locality well enough/i);
    recordPoiExposure(state, vendor, { points: 10 });
    assert.match(router('fastpoi Sella Thorn'), /Went directly to Sella Thorn/);
    assert.match(router('exits'), /Route connections/);

    const companion = getPoisForPlace('thornwall-southgate').find((poi) => poi.name === 'Rowan Greymark');
    setPositionAndDiscover(state, 'thornwall-southgate', companion.coordinate);
    const output = router('companion Rowan Greymark');
    assert.match(output, /party system/);
    assert.doesNotMatch(output, /not implemented/i);
});
