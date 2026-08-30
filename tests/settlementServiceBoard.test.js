import test from 'node:test';
import assert from 'node:assert/strict';
import { useKnownPoi } from './helpers/localKnowledgeTestSupport.js';

import { createNewGameState } from '../js/text/gameState.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';
import { createSettlementServiceBoard } from '../js/text/systems/settlementServiceBoardEngine.js';

const ORIGIN_SERVICE_PROOFS = Object.freeze([
    {
        nationId: 'thornwall',
        workshopPoiId: 'poi-sandoria-s-faulpie',
        stationTag: 'tannery',
        processId: 'craft-elderwood-hide-binding',
    },
    {
        nationId: 'brasshaven',
        workshopPoiId: 'poi-bastok-markets-reinberta',
        stationTag: 'forge',
        processId: 'process-redstone-copper-ingot',
    },
    {
        nationId: 'mistmere',
        workshopPoiId: 'poi-waters-chomo-jinjahl',
        stationTag: 'kitchen',
        processId: 'cook-starfen-bluekelp-broth',
    },
]);

test('one settlement service board derives existing workshop and merchant breadth across all three origins', () => {
    for (const proof of ORIGIN_SERVICE_PROOFS) {
        const state = createNewGameState({ nationId: proof.nationId, name: `${proof.nationId} service audit` });
        let board = createSettlementServiceBoard(state);

        assert.equal(board.available, true, `${proof.nationId} should be a settlement locality`);
        const workshop = board.workshops.find((entry) => entry.poiId === proof.workshopPoiId);
        assert.ok(workshop, `${proof.nationId} should derive its authored workshop POI`);
        assert.ok(workshop.stationTags.includes(proof.stationTag));
        assert.ok(board.production.some((entry) => entry.id === proof.processId), `${proof.nationId} should derive production from that station type`);
        assert.ok(board.trade.localShops.length > 0, `${proof.nationId} should derive its existing local merchants`);

        const moved = useKnownPoi(state, proof.workshopPoiId, 'talk');
        assert.equal(moved.ok, true, moved.message);
        board = createSettlementServiceBoard(state);
        assert.ok(board.currentStationTags.includes(proof.stationTag));
        const process = board.production.find((entry) => entry.id === proof.processId);
        assert.ok(process);
        assert.notEqual(process.status, 'needsWorkshop', `${proof.nationId} process should recognize the current authored workstation`);
    }
});
