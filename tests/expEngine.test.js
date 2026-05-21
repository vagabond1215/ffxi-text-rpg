import test from 'node:test';
import assert from 'node:assert/strict';

import { EXP_CON_RANKS } from '../js/text/data/expTables.js';
import { calculateExpBreakdown, getChainBonusPercent, inferConRank } from '../js/text/systems/expEngine.js';

test('EXP scaffold infers broad con ranks from level difference', () => {
    assert.equal(inferConRank(-7), EXP_CON_RANKS.TOO_WEAK);
    assert.equal(inferConRank(-3), EXP_CON_RANKS.EASY_PREY);
    assert.equal(inferConRank(-1), EXP_CON_RANKS.DECENT_CHALLENGE);
    assert.equal(inferConRank(0), EXP_CON_RANKS.EVEN_MATCH);
    assert.equal(inferConRank(2), EXP_CON_RANKS.TOUGH);
    assert.equal(inferConRank(4), EXP_CON_RANKS.VERY_TOUGH);
    assert.equal(inferConRank(5), EXP_CON_RANKS.INCREDIBLY_TOUGH);
});

test('EXP chain bonus caps at chain five scaffold value', () => {
    assert.equal(getChainBonusPercent(0), 0);
    assert.equal(getChainBonusPercent(1), 20);
    assert.equal(getChainBonusPercent(5), 50);
    assert.equal(getChainBonusPercent(12), 50);
});

test('EXP breakdown returns traceable calculation fields', () => {
    const result = calculateExpBreakdown({ playerLevel: 10, monsterLevel: 10, baseExp: 100, chainCount: 2, bonusPercent: 10 });

    assert.equal(result.status, 'research-scaffold');
    assert.equal(result.baseExp, 100);
    assert.equal(result.chainBonusPercent, 25);
    assert.equal(result.chainBonus, 25);
    assert.equal(result.bonusExp, 12);
    assert.equal(result.finalExp, 137);
    assert.ok(result.notes.some((note) => note.includes('Base EXP table is not finalized')));
});
