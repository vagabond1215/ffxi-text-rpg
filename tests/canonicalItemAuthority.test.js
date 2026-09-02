import test from 'node:test';
import assert from 'node:assert/strict';

import {
    getCanonicalItem,
    getCanonicalItemAuthority,
    validateCanonicalItemRegistry,
} from '../js/text/data/canonicalItemRegistry.js';
import {
    getProductionOutputItem,
    validateProductionCatalog,
} from '../js/text/data/productionCatalog.js';
import { validateShopCatalogs } from '../js/text/data/shopCatalogs.js';

test('canonical item registry resolves resource production and equipment authorities without collisions', () => {
    assert.deepEqual(validateCanonicalItemRegistry(), []);
    assert.equal(getCanonicalItemAuthority('item-redstone-copper-ore'), 'resource');
    assert.equal(getCanonicalItemAuthority('item-redstone-copper-ingot'), 'production');
    assert.equal(getCanonicalItemAuthority('field-knife'), 'equipment');
    assert.equal(getCanonicalItem('field-knife')?.kind, 'equipment');
});

test('production output resolver can target existing canonical equipment without duplicate item definitions', () => {
    const fieldKnife = getProductionOutputItem('field-knife');
    assert.ok(fieldKnife);
    assert.equal(fieldKnife.id, 'field-knife');
    assert.equal(fieldKnife.kind, 'equipment');
    assert.ok(fieldKnife.tags.includes('cutting'));
    assert.deepEqual(validateProductionCatalog(), []);
});

test('shop identity validation keeps canonical stock definitions coherent', () => {
    assert.deepEqual(validateShopCatalogs(), []);
    const lampKit = getCanonicalItem('item-lower-deepvein-reflector-lamp-kit');
    assert.ok(lampKit);
    assert.equal(lampKit.kind, 'material');
    assert.ok(lampKit.tags.includes('tool'));
});
