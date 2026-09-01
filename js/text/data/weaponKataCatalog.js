export const WEAPON_KATA_CATALOG_VERSION = 2;
export const WEAPON_KATA_CONFIGURATION_VERSION = 2;

const B4_KATA_SOURCE = 'Hearth & Horizon Combat 2.0 B4 representative kata proof.';
const P1_KATA_SOURCE = 'Hearth & Horizon 0.9.300 Packet 1 current melee kata breadth.';

export const WEAPON_KATA_SLOT_THRESHOLDS = Object.freeze([0, 2, 4]);

const MOVES = {
    'dagger-quick-thrust': move('dagger-quick-thrust', 'Quick Thrust', 'dagger', 1, 'automatic', 0, {
        stat: 'dex', coefficient: 0.5, accuracyModifier: 0, recoveryMultiplier: 1,
    }),
    'dagger-careful-thrust': move('dagger-careful-thrust', 'Careful Thrust', 'dagger', 1, 'automatic', 2, {
        stat: 'dex', coefficient: 0.42, accuracyModifier: 10, recoveryMultiplier: 1,
    }),
    'dagger-cross-cut': move('dagger-cross-cut', 'Cross Cut', 'dagger', 2, 'automatic', 2, {
        stat: 'dex', coefficient: 0.58, accuracyModifier: 0, recoveryMultiplier: 1,
    }),
    'dagger-driving-thrust': move('dagger-driving-thrust', 'Driving Thrust', 'dagger', 3, 'automatic', 4, {
        stat: 'dex', coefficient: 0.72, accuracyModifier: -2, recoveryMultiplier: 1.15,
    }),
    'dagger-recenter-cut': move('dagger-recenter-cut', 'Recenter Cut', 'dagger', null, 'manual', 2, {
        stat: 'dex', coefficient: 0.5, accuracyModifier: 2, recoveryMultiplier: 1, sequenceEffect: 'reset',
    }),
    'sword-forward-cut': move('sword-forward-cut', 'Forward Cut', 'sword', 1, 'automatic', 0, {
        stat: 'str', coefficient: 0.5, accuracyModifier: 0, recoveryMultiplier: 1,
    }),
    'sword-return-cut': move('sword-return-cut', 'Return Cut', 'sword', 2, 'automatic', 2, {
        stat: 'str', coefficient: 0.58, accuracyModifier: 0, recoveryMultiplier: 1,
    }),
    'sword-committed-cut': move('sword-committed-cut', 'Committed Cut', 'sword', 3, 'automatic', 4, {
        stat: 'str', coefficient: 0.74, accuracyModifier: -3, recoveryMultiplier: 1.2,
    }),
    'axe-set-hew': move('axe-set-hew', 'Set Hew', 'axe', 1, 'automatic', 0, {
        stat: 'str', coefficient: 0.56, accuracyModifier: -1, recoveryMultiplier: 1.05, source: P1_KATA_SOURCE,
    }),
    'axe-hooking-chop': move('axe-hooking-chop', 'Hooking Chop', 'axe', 2, 'automatic', 2, {
        stat: 'str', coefficient: 0.64, accuracyModifier: -2, defensePenetration: 0.05, recoveryMultiplier: 1.1, source: P1_KATA_SOURCE,
    }),
    'axe-driving-cleave': move('axe-driving-cleave', 'Driving Cleave', 'axe', 3, 'automatic', 4, {
        stat: 'str', coefficient: 0.82, accuracyModifier: -5, defensePenetration: 0.12, recoveryMultiplier: 1.3, source: P1_KATA_SOURCE,
    }),
    'staff-measured-thrust': move('staff-measured-thrust', 'Measured Thrust', 'staff', 1, 'automatic', 0, {
        stat: 'str', coefficient: 0.42, accuracyModifier: 6, recoveryMultiplier: 0.95, source: P1_KATA_SOURCE,
    }),
    'staff-turning-sweep': move('staff-turning-sweep', 'Turning Sweep', 'staff', 2, 'automatic', 2, {
        stat: 'str', coefficient: 0.54, accuracyModifier: 2, recoveryMultiplier: 1, source: P1_KATA_SOURCE,
    }),
    'staff-braced-drive': move('staff-braced-drive', 'Braced Drive', 'staff', 3, 'automatic', 4, {
        stat: 'str', coefficient: 0.7, accuracyModifier: -1, defensePenetration: 0.06, recoveryMultiplier: 1.15, source: P1_KATA_SOURCE,
    }),
    'club-short-strike': move('club-short-strike', 'Short Strike', 'club', 1, 'automatic', 0, {
        stat: 'str', coefficient: 0.46, accuracyModifier: 4, recoveryMultiplier: 0.95, source: P1_KATA_SOURCE,
    }),
    'club-returning-blow': move('club-returning-blow', 'Returning Blow', 'club', 2, 'automatic', 2, {
        stat: 'str', coefficient: 0.54, accuracyModifier: 1, defensePenetration: 0.02, recoveryMultiplier: 1, source: P1_KATA_SOURCE,
    }),
    'club-braced-strike': move('club-braced-strike', 'Braced Strike', 'club', 3, 'automatic', 4, {
        stat: 'str', coefficient: 0.68, accuracyModifier: -2, defensePenetration: 0.08, recoveryMultiplier: 1.15, source: P1_KATA_SOURCE,
    }),
};

export const WEAPON_KATA_MOVES = deepFreeze(MOVES);

export const WEAPON_KATA_FAMILIES = deepFreeze({
    dagger: {
        id: 'dagger',
        skillId: 'dagger',
        slots: [
            { slot: 1, defaultMoveId: 'dagger-quick-thrust', optionMoveIds: ['dagger-quick-thrust', 'dagger-careful-thrust'] },
            { slot: 2, defaultMoveId: 'dagger-cross-cut', optionMoveIds: ['dagger-cross-cut'] },
            { slot: 3, defaultMoveId: 'dagger-driving-thrust', optionMoveIds: ['dagger-driving-thrust'] },
        ],
        manualMoveIds: ['dagger-recenter-cut'],
    },
    sword: {
        id: 'sword',
        skillId: 'sword',
        slots: [
            { slot: 1, defaultMoveId: 'sword-forward-cut', optionMoveIds: ['sword-forward-cut'] },
            { slot: 2, defaultMoveId: 'sword-return-cut', optionMoveIds: ['sword-return-cut'] },
            { slot: 3, defaultMoveId: 'sword-committed-cut', optionMoveIds: ['sword-committed-cut'] },
        ],
        manualMoveIds: [],
    },
    axe: {
        id: 'axe',
        skillId: 'axe',
        slots: [
            { slot: 1, defaultMoveId: 'axe-set-hew', optionMoveIds: ['axe-set-hew'] },
            { slot: 2, defaultMoveId: 'axe-hooking-chop', optionMoveIds: ['axe-hooking-chop'] },
            { slot: 3, defaultMoveId: 'axe-driving-cleave', optionMoveIds: ['axe-driving-cleave'] },
        ],
        manualMoveIds: [],
    },
    staff: {
        id: 'staff',
        skillId: 'staff',
        slots: [
            { slot: 1, defaultMoveId: 'staff-measured-thrust', optionMoveIds: ['staff-measured-thrust'] },
            { slot: 2, defaultMoveId: 'staff-turning-sweep', optionMoveIds: ['staff-turning-sweep'] },
            { slot: 3, defaultMoveId: 'staff-braced-drive', optionMoveIds: ['staff-braced-drive'] },
        ],
        manualMoveIds: [],
    },
    club: {
        id: 'club',
        skillId: 'club',
        slots: [
            { slot: 1, defaultMoveId: 'club-short-strike', optionMoveIds: ['club-short-strike'] },
            { slot: 2, defaultMoveId: 'club-returning-blow', optionMoveIds: ['club-returning-blow'] },
            { slot: 3, defaultMoveId: 'club-braced-strike', optionMoveIds: ['club-braced-strike'] },
        ],
        manualMoveIds: [],
    },
});

export function getWeaponKataFamily(familyId) {
    return WEAPON_KATA_FAMILIES[normalize(familyId)] ?? null;
}

export function getWeaponKataMove(moveId) {
    return WEAPON_KATA_MOVES[String(moveId ?? '')] ?? null;
}

export function createDefaultWeaponKataConfiguration() {
    return {
        version: WEAPON_KATA_CONFIGURATION_VERSION,
        selections: Object.fromEntries(Object.values(WEAPON_KATA_FAMILIES).map((family) => [
            family.id,
            Object.fromEntries(family.slots.map((slot) => [String(slot.slot), slot.defaultMoveId])),
        ])),
    };
}

export function validateWeaponKataConfiguration(value) {
    const issues = [];
    if (!isObject(value)) return ['weaponKata must be an object.'];
    if (value.version !== WEAPON_KATA_CONFIGURATION_VERSION) issues.push(`weaponKata.version must be ${WEAPON_KATA_CONFIGURATION_VERSION}.`);
    if (!isObject(value.selections)) return [...issues, 'weaponKata.selections must be an object.'];

    for (const family of Object.values(WEAPON_KATA_FAMILIES)) {
        const selections = value.selections[family.id];
        if (!isObject(selections)) {
            issues.push(`weaponKata.selections.${family.id} must be an object.`);
            continue;
        }
        for (const slot of family.slots) {
            const selected = selections[String(slot.slot)];
            if (typeof selected !== 'string' || !slot.optionMoveIds.includes(selected)) {
                issues.push(`weaponKata.selections.${family.id}.${slot.slot} must reference an allowed move.`);
            }
        }
    }
    for (const familyId of Object.keys(value.selections)) {
        if (!WEAPON_KATA_FAMILIES[familyId]) issues.push(`weaponKata.selections contains unknown family ${familyId}.`);
    }
    return issues;
}

export function validateWeaponKataCatalog() {
    const issues = [];
    for (const family of Object.values(WEAPON_KATA_FAMILIES)) {
        for (const slot of family.slots) {
            if (!Number.isInteger(slot.slot) || slot.slot < 1 || slot.slot > WEAPON_KATA_SLOT_THRESHOLDS.length) issues.push(`${family.id} has invalid slot ${slot.slot}.`);
            if (!slot.optionMoveIds.includes(slot.defaultMoveId)) issues.push(`${family.id} slot ${slot.slot} default is not an option.`);
            for (const moveId of slot.optionMoveIds) {
                const entry = getWeaponKataMove(moveId);
                if (!entry) issues.push(`${family.id} slot ${slot.slot} references missing move ${moveId}.`);
                else if (entry.family !== family.id || entry.kind !== 'automatic' || entry.slot !== slot.slot) issues.push(`${moveId} does not match ${family.id} slot ${slot.slot}.`);
            }
        }
        for (const moveId of family.manualMoveIds) {
            const entry = getWeaponKataMove(moveId);
            if (!entry || entry.family !== family.id || entry.kind !== 'manual') issues.push(`${family.id} manual move ${moveId} is invalid.`);
        }
    }
    return issues;
}

function move(id, name, family, slot, kind, requiredSkill, attack) {
    return {
        id,
        name,
        family,
        slot,
        kind,
        requiredSkill,
        attack: {
            stat: attack.stat,
            coefficient: attack.coefficient,
            accuracyModifier: attack.accuracyModifier,
            defensePenetration: attack.defensePenetration ?? 0,
        },
        recoveryMultiplier: attack.recoveryMultiplier ?? 1,
        sequenceEffect: attack.sequenceEffect ?? 'advance',
        fieldNotes: {
            confidence: 'intentionalSimplification',
            source: attack.source ?? B4_KATA_SOURCE,
            notes: 'Original provisional physical sequence move; values are mechanics proof, not final balance.',
        },
    };
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
    return value;
}
