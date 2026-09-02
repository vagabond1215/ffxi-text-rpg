import test from 'node:test';
import assert from 'node:assert/strict';

import {
    CONTEXTUAL_PRODUCTION_TOOL_TAGS,
    WORKSTATION_TAGS,
    listAuthorizedProductionToolTags,
    listCanonicalPortableToolTagProviders,
    validateProductionRequirementAuthority,
} from '../js/text/data/productionRequirementAuthority.js';
import { listProductionDefinitions, validateProductionCatalog } from '../js/text/data/productionCatalog.js';

test('A6 centralizes the recognized production workstation authority', () => {
    assert.deepEqual(WORKSTATION_TAGS, [
        'forge',
        'kitchen',
        'woodshop',
        'tannery',
        'workshop',
    ]);
});

test('A6 proves every current portable production-tool requirement has a canonical provider', () => {
    const definitions = listProductionDefinitions();
    const requiredToolTags = [...new Set(definitions.flatMap((definition) => definition.requiredToolTags))].sort();

    assert.deepEqual(requiredToolTags, ['cutting', 'woodcutting']);
    assert.deepEqual(CONTEXTUAL_PRODUCTION_TOOL_TAGS, []);

    const providers = listCanonicalPortableToolTagProviders();
    assert.deepEqual(providers.cutting, ['field-knife', 'reed-sickle']);
    assert.deepEqual(providers.woodcutting, ['woodsman-hatchet']);
    assert.ok(listAuthorizedProductionToolTags().includes('cutting'));
    assert.ok(listAuthorizedProductionToolTags().includes('woodcutting'));

    assert.deepEqual(validateProductionRequirementAuthority(definitions), []);
    assert.deepEqual(validateProductionCatalog(), []);
});

test('A6 rejects undeclared workshop-tool requirements instead of silently accepting decorative tags', () => {
    const issues = validateProductionRequirementAuthority([
        {
            id: 'craft-audit-fixture',
            requiredStationTags: ['forge'],
            requiredToolTags: ['smithing-hammer'],
        },
    ]);

    assert.deepEqual(issues, [
        'craft-audit-fixture requires tool capability smithing-hammer with no canonical portable-tool provider or declared contextual authority.',
    ]);
});

test('A6 rejects unrecognized workstation tags until station authority is explicitly extended', () => {
    const issues = validateProductionRequirementAuthority([
        {
            id: 'craft-station-audit-fixture',
            requiredStationTags: ['loom'],
            requiredToolTags: [],
        },
    ]);

    assert.deepEqual(issues, [
        'craft-station-audit-fixture requires unknown workstation tag loom.',
    ]);
});
