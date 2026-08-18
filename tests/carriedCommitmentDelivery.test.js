import test from 'node:test';
import assert from 'node:assert/strict';

import { getProductionItem } from '../js/text/data/productionItems.js';
import { createNewGameState } from '../js/text/gameState.js';
import { getCarriedCargoUnits } from '../js/text/systems/carriedLoadEngine.js';
import {
    applyCarriedItemRemovalPlan,
    listCarriedItemEntries,
} from '../js/text/systems/carriedInventoryEngine.js';
import {
    acceptCommitment,
    checkCommitmentRequirements,
    resolveCommitment,
} from '../js/text/systems/commitmentEngine.js';
import {
    addItemToContainer,
    unlockInventoryContainer,
} from '../js/text/systems/inventoryEngine.js';
import { performLocalityPoiAction } from '../js/text/systems/localityEngine.js';

const COMMITMENT_ID = 'commitment-brasshaven-copper-return';
const INGOT_ID = 'item-redstone-copper-ingot';

function createAcceptedBrasshavenCommitment() {
    const state = createNewGameState({ nationId: 'brasshaven' });
    assert.equal(performLocalityPoiAction(state, 'poi-bastok-markets-rabid-wolf', 'talk').ok, true);
    assert.equal(acceptCommitment(state, COMMITMENT_ID).ok, true);
    return state;
}

test('a qualifying item in Field Satchel satisfies and resolves a commitment', () => {
    const state = createAcceptedBrasshavenCommitment();
    assert.equal(unlockInventoryContainer(state, 'fieldSatchel').ok, true);
    assert.equal(addItemToContainer(state.player.inventoryState, 'fieldSatchel', getProductionItem(INGOT_ID)).ok, true);
    assert.equal(getCarriedCargoUnits(state), 1);

    const check = checkCommitmentRequirements(state, COMMITMENT_ID);
    assert.equal(check.ok, true, check.blockers.join(' '));

    const resolved = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(resolved.ok, true, resolved.display?.text ?? resolved.reason);
    assert.equal(state.player.inventoryState.containers.fieldSatchel.items.length, 0);
    assert.equal(getCarriedCargoUnits(state), 0);
});

test('qualifying home storage does not count as carried commitment delivery', () => {
    const state = createAcceptedBrasshavenCommitment();
    assert.equal(addItemToContainer(
        state.player.inventoryState,
        'homeSafe',
        getProductionItem(INGOT_ID),
        { isAtHome: true },
    ).ok, true);

    const check = checkCommitmentRequirements(state, COMMITMENT_ID);
    assert.equal(check.ok, false);
    assert.match(check.blockers.join(' '), /Requires 1 item-redstone-copper-ingot/);

    const resolved = resolveCommitment(state, COMMITMENT_ID);
    assert.equal(resolved.ok, false);
    assert.equal(resolved.code, 'commitment.requirements-unmet');
    assert.equal(state.player.inventoryState.containers.homeSafe.items.length, 1);
});

test('carried removal plans validate all containers before mutating any of them', () => {
    const state = createNewGameState({ nationId: 'brasshaven' });
    assert.equal(unlockInventoryContainer(state, 'fieldSatchel').ok, true);
    assert.equal(addItemToContainer(state.player.inventoryState, 'inventory', getProductionItem(INGOT_ID)).ok, true);
    assert.equal(addItemToContainer(state.player.inventoryState, 'fieldSatchel', getProductionItem(INGOT_ID)).ok, true);

    const entries = listCarriedItemEntries(state, (item) => item.id === INGOT_ID);
    assert.equal(entries.length, 2);

    const invalidPlan = [
        { containerId: entries[0].containerId, index: entries[0].index, quantity: 1 },
        { containerId: entries[1].containerId, index: entries[1].index, quantity: 2 },
    ];
    const rejected = applyCarriedItemRemovalPlan(state, invalidPlan);
    assert.equal(rejected.ok, false);
    assert.equal(listCarriedItemEntries(state, (item) => item.id === INGOT_ID).length, 2, 'failed plan must not partially mutate carried inventory');

    const validPlan = entries.map((entry) => ({
        containerId: entry.containerId,
        index: entry.index,
        quantity: 1,
    }));
    const applied = applyCarriedItemRemovalPlan(state, validPlan);
    assert.equal(applied.ok, true, applied.reason);
    assert.equal(applied.removed.length, 2);
    assert.equal(listCarriedItemEntries(state, (item) => item.id === INGOT_ID).length, 0);
});
