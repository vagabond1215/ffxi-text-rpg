import test from 'node:test';
import assert from 'node:assert/strict';

import { collectRepositoryContractIssues, formatRepositoryAudit } from '../scripts/repositoryAudit.js';

test('repository contract audit keeps runtime package profile docs and hosted Check synchronized', () => {
    assert.deepEqual(collectRepositoryContractIssues(), []);
    assert.match(formatRepositoryAudit().text, /Status: PASS/);
});
