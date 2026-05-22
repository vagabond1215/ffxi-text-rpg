import {
    CONFIDENCE_LABELS,
    ITEM_KINDS,
    mergeModifierBlocks,
    normalizeItem,
    normalizeRequirements,
} from './itemSchema.js';

const STARTER_SOURCE = 'Starter catalog schema pass; values are intentionally simplified and not asserted as exact retail data.';
const STARTER_JOBS = Object.freeze(['warrior', 'monk', 'whiteMage', 'blackMage', 'redMage', 'thief']);
const BRONZE_ARMOR_JOBS = Object.freeze([...STARTER_JOBS, 'paladin', 'darkKnight', 'beastmaster', 'bard', 'ranger', 'samurai', 'ninja', 'dragoon', 'blueMage', 'corsair', 'puppetmaster', 'dancer', 'runeFencer']);
const CASTER_JOBS = Object.freeze(['whiteMage', 'blackMage', 'redMage', 'summoner', 'scholar', 'geomancer']);

export const EQUIPMENT_CATALOG = Object.freeze({
    'bronze-sword': equipment('bronze-sword', 'Bronze Sword', {
        family: 'weapon',
        archetype: 'oneHandedWeapon',
        subtype: 'sword',
        equipmentSlot: 'mainHand',
        allowedSlots: ['mainHand'],
        weaponCategory: 'sword',
        weaponDelay: 236,
        requirements: requirement({ allowedJobs: ['warrior', 'redMage', 'paladin'] }),
        tags: ['weapon', 'sword', 'starter'],
        flags: ['equipmentOnly'],
        modifiers: {
            derived: { attack: 3, accuracy: 1 },
        },
        fieldNotes: withDelayNotes('Placeholder starter sword delay for schema/testing only.'),
    }),
    'bronze-axe': equipment('bronze-axe', 'Bronze Axe', {
        family: 'weapon',
        archetype: 'oneHandedWeapon',
        subtype: 'axe',
        equipmentSlot: 'mainHand',
        allowedSlots: ['mainHand'],
        weaponCategory: 'axe',
        weaponDelay: 288,
        requirements: requirement({ allowedJobs: ['warrior', 'beastmaster'] }),
        tags: ['weapon', 'axe', 'starter'],
        flags: ['equipmentOnly'],
        modifiers: {
            derived: { attack: 4 },
        },
        fieldNotes: withDelayNotes('Placeholder starter axe delay for schema/testing only.'),
    }),
    'bronze-dagger': equipment('bronze-dagger', 'Bronze Dagger', {
        family: 'weapon',
        archetype: 'oneHandedWeapon',
        subtype: 'dagger',
        equipmentSlot: 'mainHand',
        allowedSlots: ['mainHand'],
        weaponCategory: 'dagger',
        weaponDelay: 190,
        requirements: requirement({ allowedJobs: ['warrior', 'redMage', 'thief', 'bard', 'ranger', 'dancer'] }),
        tags: ['weapon', 'dagger', 'starter'],
        flags: ['equipmentOnly'],
        modifiers: {
            derived: { attack: 2, accuracy: 2 },
        },
        fieldNotes: withDelayNotes('Placeholder starter dagger delay for schema/testing only.'),
    }),
    'bronze-pick': equipment('bronze-pick', 'Bronze Pick', {
        family: 'weapon',
        archetype: 'oneHandedWeapon',
        subtype: 'axe',
        equipmentSlot: 'mainHand',
        allowedSlots: ['mainHand'],
        weaponCategory: 'axe',
        weaponDelay: 300,
        requirements: requirement({ allowedJobs: ['warrior', 'beastmaster'] }),
        tags: ['weapon', 'axe', 'starter'],
        flags: ['equipmentOnly'],
        modifiers: {
            derived: { attack: 3 },
        },
        fieldNotes: withDelayNotes('Placeholder starter pick delay for schema/testing only.'),
    }),
    'ash-staff': equipment('ash-staff', 'Ash Staff', {
        family: 'weapon',
        archetype: 'twoHandedWeapon',
        subtype: 'staff',
        equipmentSlot: 'mainHand',
        allowedSlots: ['mainHand'],
        weaponCategory: 'staff',
        weaponDelay: 366,
        requirements: requirement({ allowedJobs: CASTER_JOBS }),
        tags: ['weapon', 'staff', 'starter', 'caster'],
        flags: ['equipmentOnly', 'twoHanded'],
        modifiers: {
            resources: { mp: 3 },
            derived: { attack: 2, magicAccuracy: 1 },
        },
        fieldNotes: withDelayNotes('Placeholder two-handed staff delay for schema/testing only.'),
    }),
    'maple-wand': equipment('maple-wand', 'Maple Wand', {
        family: 'weapon',
        archetype: 'oneHandedWeapon',
        subtype: 'club',
        equipmentSlot: 'mainHand',
        allowedSlots: ['mainHand'],
        weaponCategory: 'club',
        weaponDelay: 216,
        requirements: requirement({ allowedJobs: CASTER_JOBS }),
        tags: ['weapon', 'club', 'starter', 'caster'],
        flags: ['equipmentOnly'],
        modifiers: {
            attributes: { int: 1, mnd: 1 },
            resources: { mp: 4 },
            derived: { magicAccuracy: 1 },
        },
        fieldNotes: withDelayNotes('Placeholder starter wand delay for schema/testing only.'),
    }),
    'bronze-cap': bronzeArmor('bronze-cap', 'Bronze Cap', 'head', ['armor', 'head', 'starter'], {
        derived: { defense: 2 },
    }),
    'bronze-harness': bronzeArmor('bronze-harness', 'Bronze Harness', 'body', ['armor', 'body', 'starter'], {
        resources: { hp: 4 },
        derived: { defense: 5 },
    }),
    'bronze-subligar': bronzeArmor('bronze-subligar', 'Bronze Subligar', 'legs', ['armor', 'legs', 'starter'], {
        derived: { defense: 3 },
    }),
    'bronze-mittens': bronzeArmor('bronze-mittens', 'Bronze Mittens', 'hands', ['armor', 'hands', 'starter'], {
        derived: { defense: 2, attack: 1 },
    }),
});

export function getEquipmentCatalogEntry(itemId) {
    return EQUIPMENT_CATALOG[itemId] ?? null;
}

export function enrichEquipmentItem(item) {
    const runtimeItem = normalizeItem(item);
    const entry = getEquipmentCatalogEntry(runtimeItem.templateId) ?? getEquipmentCatalogEntry(runtimeItem.id);
    if (!entry) return runtimeItem;

    const alreadyEnriched = isCatalogEnrichedItem(item, entry);
    const requirements = alreadyEnriched
        ? runtimeItem.requirements
        : hasExplicitRequirements(item.requirements)
        ? normalizeRequirements({ ...entry.requirements, ...item.requirements })
        : entry.requirements;
    const allowedSlots = alreadyEnriched
        ? runtimeItem.allowedSlots
        : runtimeItem.allowedSlots.length ? unique([...entry.allowedSlots, ...runtimeItem.allowedSlots]) : entry.allowedSlots;
    const flags = unique([...(entry.flags ?? []), ...(runtimeItem.flags ?? [])]);
    const modifiers = alreadyEnriched ? runtimeItem.modifiers : mergeModifierBlocks(entry.modifiers, item.modifiers);

    return normalizeItem({
        ...entry,
        ...runtimeItem,
        id: runtimeItem.id,
        templateId: runtimeItem.templateId ?? entry.id,
        name: runtimeItem.name ?? entry.name,
        kind: ITEM_KINDS.EQUIPMENT,
        tags: unique([...(entry.tags ?? []), ...(runtimeItem.tags ?? [])]),
        source: runtimeItem.source,
        valueGil: runtimeItem.valueGil,
        family: runtimeItem.family ?? entry.family,
        archetype: runtimeItem.archetype ?? entry.archetype,
        subtype: runtimeItem.subtype ?? entry.subtype,
        equipmentSlot: runtimeItem.equipmentSlot ?? entry.equipmentSlot,
        allowedSlots,
        weaponCategory: runtimeItem.weaponCategory ?? entry.weaponCategory,
        weaponDelay: runtimeItem.weaponDelay ?? entry.weaponDelay,
        requirements,
        flags,
        modifiers,
        effects: alreadyEnriched ? runtimeItem.effects : item.effects ?? entry.effects,
        latentEffects: alreadyEnriched ? runtimeItem.latentEffects : [...(entry.latentEffects ?? []), ...runtimeItem.latentEffects],
        enchantments: alreadyEnriched ? runtimeItem.enchantments : [...(entry.enchantments ?? []), ...runtimeItem.enchantments],
        augments: alreadyEnriched ? runtimeItem.augments : [...(entry.augments ?? []), ...runtimeItem.augments],
        charges: item.charges ?? entry.charges,
        metadata: hasUsefulMetadata(item.metadata) ? item.metadata : entry.metadata,
        fieldNotes: { ...(entry.fieldNotes ?? {}), ...(item.fieldNotes ?? {}) },
    });
}

export function listEquipmentCatalogEntries() {
    return Object.values(EQUIPMENT_CATALOG);
}

function bronzeArmor(id, name, slot, tags, modifiers) {
    return equipment(id, name, {
        family: 'armor',
        archetype: 'starterArmor',
        subtype: slot,
        equipmentSlot: slot,
        allowedSlots: [slot],
        requirements: requirement({ allowedJobs: BRONZE_ARMOR_JOBS }),
        tags,
        flags: ['equipmentOnly'],
        modifiers,
        fieldNotes: baseFieldNotes(),
    });
}

function equipment(id, name, options) {
    const normalized = normalizeItem({
        id,
        templateId: id,
        name,
        kind: ITEM_KINDS.EQUIPMENT,
        quantity: 1,
        stackable: false,
        maxStack: 1,
        ...options,
        effects: options.effects ?? [{
            id: 'always-on-modifiers',
            type: 'modifier',
            trigger: 'always',
            modifiers: options.modifiers,
            confidence: options.fieldNotes?.modifiers?.confidence ?? CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: options.fieldNotes?.modifiers?.source ?? STARTER_SOURCE,
            notes: options.fieldNotes?.modifiers?.notes ?? '',
        }],
        metadata: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes: 'Starter item template demonstrates normalized requirements, flags, effects, and metadata.',
            ...(options.metadata ?? {}),
        },
    });
    return deepFreeze({ ...normalized, slot: normalized.equipmentSlot });
}

function requirement(overrides = {}) {
    return normalizeRequirements({
        minLevel: 1,
        allowedJobs: [],
        allowedRaces: [],
        allowedSexes: [],
        requiredNations: [],
        requiredFame: [],
        requiredKeyItems: [],
        requiredQuestFlags: [],
        ...overrides,
    });
}

function withDelayNotes(weaponDelayNotes) {
    return {
        ...baseFieldNotes(),
        weaponDelay: {
            confidence: CONFIDENCE_LABELS.PLACEHOLDER,
            source: STARTER_SOURCE,
            notes: weaponDelayNotes,
        },
    };
}

function baseFieldNotes() {
    return {
        requirements: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes: 'Broad starter eligibility intended to exercise validation without retail-complete restrictions.',
        },
        modifiers: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes: 'Small starter stat modifiers for early combat-profile testing.',
        },
    };
}

function hasExplicitRequirements(requirements = null) {
    if (!requirements || typeof requirements !== 'object') return false;
    if ((Number(requirements.minLevel) || 1) > 1) return true;
    return [
        'allowedJobs',
        'allowedRaces',
        'allowedSexes',
        'requiredNations',
        'requiredFame',
        'requiredKeyItems',
        'requiredQuestFlags',
    ].some((key) => Array.isArray(requirements[key]) && requirements[key].length > 0);
}

function isCatalogEnrichedItem(item, entry) {
    return item?.fieldNotes?.requirements?.source === entry.fieldNotes?.requirements?.source
        || item?.metadata?.source === entry.metadata?.source;
}

function hasUsefulMetadata(metadata = null) {
    return Boolean(metadata?.source || metadata?.notes);
}

function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
