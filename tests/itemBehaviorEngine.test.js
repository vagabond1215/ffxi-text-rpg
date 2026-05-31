import test from 'node:test';
import assert from 'node:assert/strict';

import {
    calculateSellValue,
    canSellItem,
    describeItemBehavior,
    describeRangedAmmoBehavior,
} from '../js/text/systems/itemBehaviorEngine.js';

test('item behavior selling allows metadata-only trade restrictions by default', () => {
    const item = {
        id: 'auction-tagged-hide',
        name: 'Auction Tagged Hide',
        kind: 'material',
        valueGil: 9,
        flags: ['noTrade', 'noDrop', 'noAuction'],
    };

    const result = canSellItem(item);
    const description = describeItemBehavior(item);

    assert.equal(result.ok, true);
    assert.equal(result.sellValueGil, 4);
    assert.match(description, /metadata-only restrictions: noTrade, noDrop, noAuction/);
    assert.match(description, /not enforced for shop selling yet/);
});

test('item behavior sell value is conservative with minimum one gil for valued items', () => {
    assert.equal(calculateSellValue({ id: 'tiny-shell', name: 'Tiny Shell', kind: 'material', valueGil: 1 }), 1);
    assert.equal(calculateSellValue({ id: 'wild-rabbit-hide', name: 'Wild Rabbit Hide', kind: 'material', valueGil: 8 }), 4);
});

test('item behavior describes ranged and ammo metadata without combat wiring', () => {
    const description = describeRangedAmmoBehavior({
        id: 'training-arrow',
        name: 'Training Arrow',
        kind: 'equipment',
        equipmentSlot: 'ammo',
        flags: ['ammo'],
        tags: ['ammo'],
    });

    assert.match(description, /ammo flag/);
    assert.match(description, /ammo tag/);
    assert.match(description, /ammo slot/);
});
