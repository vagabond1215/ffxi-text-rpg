import test from 'node:test';
import assert from 'node:assert/strict';

import { getEquipmentCatalogEntry } from '../js/text/data/equipmentCatalog.js';
import { validateEquipmentCatalogEntry, validateWorldData } from '../js/text/systems/validation.js';

test('world validation accepts normalized equipment catalog entries', () => {
    assert.deepEqual(validateWorldData(), []);
});

test('equipment validation rejects unknown jobs races slots and bad array fields', () => {
    const entry = getEquipmentCatalogEntry('bronze-sword');
    const issues = validateEquipmentCatalogEntry({
        ...entry,
        equipmentSlot: 'badSlot',
        allowedSlots: ['mainHand', 'badSlot'],
        flags: { rare: true },
        effects: {},
        requirements: {
            ...entry.requirements,
            allowedJobs: ['notAJob'],
            allowedRaces: ['notARace'],
        },
    });

    assert.ok(issues.some((issue) => issue.includes('equipmentSlot is unknown')));
    assert.ok(issues.some((issue) => issue.includes('allowedSlots contains unknown slot badSlot')));
    assert.ok(issues.some((issue) => issue.includes('flags must be an array')));
    assert.ok(issues.some((issue) => issue.includes('effects must be an array')));
    assert.ok(issues.some((issue) => issue.includes('allowedJobs contains unknown job notAJob')));
    assert.ok(issues.some((issue) => issue.includes('allowedRaces contains unknown race notARace')));
});

test('equipment validation rejects invalid modifier keys and missing field metadata', () => {
    const entry = getEquipmentCatalogEntry('bronze-sword');
    const issues = validateEquipmentCatalogEntry({
        ...entry,
        modifiers: {
            ...entry.modifiers,
            derived: {
                ...entry.modifiers.derived,
                imaginaryPower: 99,
            },
        },
        fieldNotes: {
            ...entry.fieldNotes,
            weaponDelay: {
                confidence: 'placeholder',
            },
        },
    });

    assert.ok(issues.some((issue) => issue.includes('modifiers.derived.imaginaryPower is an unknown modifier key')));
    assert.ok(issues.some((issue) => issue.includes('fieldNotes.weaponDelay.source is required')));
});

test('equipment validation checks nested effect modifiers and charge bounds', () => {
    const entry = getEquipmentCatalogEntry('bronze-sword');
    const issues = validateEquipmentCatalogEntry({
        ...entry,
        effects: [{
            ...entry.effects[0],
            modifiers: {
                ...entry.effects[0].modifiers,
                derived: {
                    ...entry.effects[0].modifiers.derived,
                    imaginaryPower: 1,
                },
            },
        }],
        latentEffects: [{
            id: 'bad-latent',
            modifiers: {
                attributes: {
                    str: 1,
                    impossible: 2,
                },
            },
        }],
        enchantments: [{
            id: 'bad-enchantment',
            modifiers: {
                resources: {
                    mp: 'not-a-number',
                },
            },
        }],
        augments: ['bad-augment'],
        charges: {
            max: 1,
            current: 2,
            recastSeconds: -1,
            cooldownSeconds: 'soon',
        },
    });

    assert.ok(issues.some((issue) => issue.includes('effects[0].modifiers.derived.imaginaryPower is an unknown modifier key')));
    assert.ok(issues.some((issue) => issue.includes('latentEffects[0].modifiers.attributes.impossible is an unknown modifier key')));
    assert.ok(issues.some((issue) => issue.includes('enchantments[0].modifiers.resources.mp must be numeric')));
    assert.ok(issues.some((issue) => issue.includes('augments[0] must be an object')));
    assert.ok(issues.some((issue) => issue.includes('charges.current cannot exceed charges.max')));
    assert.ok(issues.some((issue) => issue.includes('charges.recastSeconds must be a non-negative integer')));
    assert.ok(issues.some((issue) => issue.includes('charges.cooldownSeconds must be a non-negative integer')));
});
