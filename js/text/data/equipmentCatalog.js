import {
    CONFIDENCE_LABELS,
    ITEM_KINDS,
    mergeModifierBlocks,
    normalizeItem,
    normalizeRequirements,
} from './itemSchema.js';

const STARTER_SOURCE = 'Hearth & Horizon early equipment contract; values are original provisional balance for systems testing.';

export const EQUIPMENT_CATALOG_VERSION = 4;

export const EQUIPMENT_CATALOG = Object.freeze({
    'bronze-sword': equipment('bronze-sword', 'Bronze Sword', {
        family: 'weapon', archetype: 'oneHandedWeapon', subtype: 'sword', equipmentSlot: 'mainHand', allowedSlots: ['mainHand'],
        weaponCategory: 'sword', weaponDelay: 236, handling: handling(1, 2, 1), requirements: requirement(),
        tags: ['weapon', 'sword', 'starter'], flags: ['equipmentOnly'], modifiers: { derived: { attack: 3, accuracy: 1 } },
        fieldNotes: withHandlingNotes(withDelayNotes('Provisional starter sword delay.'), 'One-handed sword draw and stow timing for B3 combat-loadout proof.'),
    }),
    'bronze-axe': equipment('bronze-axe', 'Bronze Axe', {
        family: 'weapon', archetype: 'oneHandedWeapon', subtype: 'axe', equipmentSlot: 'mainHand', allowedSlots: ['mainHand'],
        weaponCategory: 'axe', weaponDelay: 288, handling: handling(2, 2, 1), requirements: requirement(),
        tags: ['weapon', 'axe', 'starter'], flags: ['equipmentOnly'], modifiers: { derived: { attack: 4 } },
        fieldNotes: withHandlingNotes(withDelayNotes('Provisional starter axe delay.'), 'Heavier one-handed axe handling for directional B3 timing.'),
    }),
    'bronze-dagger': equipment('bronze-dagger', 'Bronze Dagger', {
        family: 'weapon', archetype: 'oneHandedWeapon', subtype: 'dagger', equipmentSlot: 'mainHand', allowedSlots: ['mainHand'],
        weaponCategory: 'dagger', weaponDelay: 190, handling: handling(1, 1, 1), requirements: requirement(),
        tags: ['weapon', 'dagger', 'starter'], flags: ['equipmentOnly'], modifiers: { derived: { attack: 2, accuracy: 2 } },
        fieldNotes: withHandlingNotes(withDelayNotes('Provisional starter dagger delay.'), 'Compact dagger handling for fast B3 weapon-set changes.'),
    }),
    'bronze-pick': equipment('bronze-pick', 'Bronze Pick', {
        family: 'weapon', archetype: 'oneHandedWeapon', subtype: 'axe', equipmentSlot: 'mainHand', allowedSlots: ['mainHand'],
        weaponCategory: 'axe', weaponDelay: 300, requirements: requirement(),
        tags: ['weapon', 'axe', 'starter'], flags: ['equipmentOnly'], modifiers: { derived: { attack: 3 } },
        fieldNotes: withDelayNotes('Legacy-shaped starter combat pick retained for compatibility; use Prospector Pick for field mining.'),
    }),
    'ash-staff': equipment('ash-staff', 'Ash Staff', {
        family: 'weapon', archetype: 'twoHandedWeapon', subtype: 'staff', equipmentSlot: 'mainHand', allowedSlots: ['mainHand'],
        weaponCategory: 'staff', weaponDelay: 366, handling: handling(2, 3, 2, true), requirements: requirement(),
        tags: ['weapon', 'staff', 'starter', 'caster'], flags: ['equipmentOnly', 'twoHanded'],
        modifiers: { resources: { mp: 3 }, derived: { attack: 2, magicAccuracy: 1 } },
        fieldNotes: withHandlingNotes(withDelayNotes('Provisional two-handed staff delay.'), 'Two-handed staff handling is deliberately slower and cumbersome for B3 timing proof.'),
    }),
    'maple-wand': equipment('maple-wand', 'Maple Wand', {
        family: 'weapon', archetype: 'oneHandedWeapon', subtype: 'club', equipmentSlot: 'mainHand', allowedSlots: ['mainHand'],
        weaponCategory: 'club', weaponDelay: 216, requirements: requirement(),
        tags: ['weapon', 'club', 'starter', 'caster'], flags: ['equipmentOnly'],
        modifiers: { attributes: { int: 1, mnd: 1 }, resources: { mp: 4 }, derived: { magicAccuracy: 1 } },
        fieldNotes: withDelayNotes('Provisional starter wand delay.'),
    }),

    'field-knife': fieldTool('field-knife', 'Field Knife', 'knife', ['cutting', 'dagger'], {
        weaponCategory: 'dagger', weaponDelay: 205, modifiers: { derived: { accuracy: 1 } },
    }),
    'prospector-pick': fieldTool('prospector-pick', 'Prospector Pick', 'pick', ['mining'], {
        modifiers: { attributes: { str: 1 } },
    }),
    'woodsman-hatchet': fieldTool('woodsman-hatchet', 'Woodsman Hatchet', 'hatchet', ['woodcutting', 'axe'], {
        weaponCategory: 'axe', weaponDelay: 310, modifiers: { derived: { attack: 2 } },
    }),
    'digging-spade': fieldTool('digging-spade', 'Digging Spade', 'spade', ['digging'], {
        flags: ['equipmentOnly', 'twoHanded'], modifiers: { attributes: { vit: 1 } },
    }),
    'reed-sickle': fieldTool('reed-sickle', 'Reed Sickle', 'sickle', ['cutting'], {
        modifiers: { derived: { accuracy: 1 } },
    }),
    'marsh-rod': fieldTool('marsh-rod', 'Marsh Fishing Rod', 'fishingRod', ['fishing'], {
        flags: ['equipmentOnly', 'twoHanded'], modifiers: { attributes: { mnd: 1 } },
    }),

    'iron-buckler': equipment('iron-buckler', 'Iron Buckler', {
        family: 'shield', archetype: 'shield', subtype: 'buckler', equipmentSlot: 'offHand', allowedSlots: ['offHand'],
        requirements: requirement(), tags: ['equipment', 'shield', 'offhand', 'martial'], flags: ['equipmentOnly'], handling: handling(1, 2, 1),
        modifiers: { derived: { defense: 3, shieldBlock: 2 } }, fieldNotes: withHandlingNotes(originalFieldNotes('A compact shield usable by any character who can carry the loadout.'), 'Compact shield handling for B3 off-hand transition proof.'),
    }),
    'road-cloak': equipment('road-cloak', 'Road Cloak', {
        family: 'armor', archetype: 'travelGear', subtype: 'cloak', equipmentSlot: 'back', allowedSlots: ['back'],
        requirements: requirement(), tags: ['equipment', 'armor', 'back', 'travel'], flags: ['equipmentOnly'],
        modifiers: { derived: { defense: 1, evasion: 1 } }, fieldNotes: originalFieldNotes('Light protection for travel without discipline gating.'),
    }),
    'field-belt': equipment('field-belt', 'Field Belt', {
        family: 'armor', archetype: 'fieldGear', subtype: 'belt', equipmentSlot: 'waist', allowedSlots: ['waist'],
        requirements: requirement(), tags: ['equipment', 'armor', 'waist', 'field'], flags: ['equipmentOnly'],
        modifiers: { attributes: { vit: 1 } }, fieldNotes: originalFieldNotes('Practical load-bearing field gear.'),
    }),
    'brass-ring': equipment('brass-ring', 'Brass Ring', {
        family: 'accessory', archetype: 'ring', subtype: 'plainRing', equipmentSlot: 'leftRing', allowedSlots: ['leftRing', 'rightRing'],
        requirements: requirement(), tags: ['equipment', 'ring', 'accessory'], flags: ['equipmentOnly'],
        modifiers: { attributes: { vit: 1 } }, fieldNotes: originalFieldNotes('Simple general-purpose accessory.'),
    }),
    'traveler-boots': equipment('traveler-boots', 'Traveler Boots', {
        family: 'armor', archetype: 'travelGear', subtype: 'boots', equipmentSlot: 'feet', allowedSlots: ['feet'],
        requirements: requirement(), tags: ['equipment', 'armor', 'feet', 'travel'], flags: ['equipmentOnly'],
        modifiers: { derived: { defense: 1, evasion: 1 } }, fieldNotes: originalFieldNotes('Durable walking boots.'),
    }),
    'leather-vest': equipment('leather-vest', 'Leather Vest', {
        family: 'armor', archetype: 'lightArmor', subtype: 'vest', equipmentSlot: 'body', allowedSlots: ['body'],
        requirements: requirement(), tags: ['equipment', 'armor', 'body', 'light'], flags: ['equipmentOnly'], handling: handling(2, 4, 1),
        modifiers: { resources: { hp: 2 }, derived: { defense: 4 } }, fieldNotes: withHandlingNotes(originalFieldNotes('General light armor without discipline restrictions.'), 'Full-body light armor requires a slower B3 equipment transition than a weapon swap.'),
    }),
    'traveler-gloves': equipment('traveler-gloves', 'Traveler Gloves', {
        family: 'armor', archetype: 'travelGear', subtype: 'gloves', equipmentSlot: 'hands', allowedSlots: ['hands'],
        requirements: requirement(), tags: ['equipment', 'armor', 'hands', 'travel'], flags: ['equipmentOnly'],
        modifiers: { derived: { defense: 1, accuracy: 1 } }, fieldNotes: originalFieldNotes('Work-capable gloves with modest protection.'),
    }),
    'leather-trousers': equipment('leather-trousers', 'Leather Trousers', {
        family: 'armor', archetype: 'lightArmor', subtype: 'trousers', equipmentSlot: 'legs', allowedSlots: ['legs'],
        requirements: requirement(), tags: ['equipment', 'armor', 'legs', 'light'], flags: ['equipmentOnly'],
        modifiers: { derived: { defense: 2 } }, fieldNotes: originalFieldNotes('General light leg protection.'),
    }),

    'bronze-cap': bronzeArmor('bronze-cap', 'Bronze Cap', 'head', ['armor', 'head', 'starter'], { derived: { defense: 2 } }),
    'bronze-harness': bronzeArmor('bronze-harness', 'Bronze Harness', 'body', ['armor', 'body', 'starter'], { resources: { hp: 4 }, derived: { defense: 5 } }),
    'bronze-subligar': bronzeArmor('bronze-subligar', 'Bronze Subligar', 'legs', ['armor', 'legs', 'starter'], { derived: { defense: 3 } }),
    'bronze-mittens': bronzeArmor('bronze-mittens', 'Bronze Mittens', 'hands', ['armor', 'hands', 'starter'], { derived: { defense: 2, attack: 1 } }),
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
        : hasExplicitRequirements(runtimeItem.requirements)
        ? mergeRequirements(entry.requirements, runtimeItem.requirements)
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
        handling: runtimeItem.handling ?? entry.handling,
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
        family: 'armor', archetype: 'starterArmor', subtype: slot, equipmentSlot: slot, allowedSlots: [slot],
        requirements: requirement(), tags, flags: ['equipmentOnly'], handling: handling(3, 4, 1, true), modifiers, fieldNotes: withHandlingNotes(baseFieldNotes(), 'Bronze starter armor uses deliberately cumbersome full-equipment timing for B3 proof.'),
    });
}

function fieldTool(id, name, subtype, toolTags, options = {}) {
    const notes = originalFieldNotes(`Field tool supplies ${toolTags.join(', ')} capability through the equipped loadout.`);
    if (options.weaponDelay) {
        notes.weaponDelay = {
            confidence: CONFIDENCE_LABELS.PLACEHOLDER,
            source: STARTER_SOURCE,
            notes: 'Provisional combat timing for a field tool that can also function as a weapon.',
        };
    }
    return equipment(id, name, {
        family: 'tool', archetype: 'fieldTool', subtype, equipmentSlot: 'mainHand', allowedSlots: ['mainHand'],
        requirements: requirement(),
        tags: ['equipment', 'tool', 'field', ...toolTags],
        flags: options.flags ?? ['equipmentOnly'],
        weaponCategory: options.weaponCategory ?? null,
        weaponDelay: options.weaponDelay ?? null,
        modifiers: options.modifiers ?? {},
        fieldNotes: notes,
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
            notes: 'Original provisional item template with normalized requirements, effects, and metadata.',
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
    return { ...baseFieldNotes(), weaponDelay: { confidence: CONFIDENCE_LABELS.PLACEHOLDER, source: STARTER_SOURCE, notes: weaponDelayNotes } };
}

function handling(stowSeconds, drawSeconds, readySeconds, cumbersome = false) {
    return { stowSeconds, drawSeconds, readySeconds, cumbersome };
}

function withHandlingNotes(fieldNotes, notes) {
    return {
        ...fieldNotes,
        handling: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes,
        },
    };
}

function baseFieldNotes() {
    return {
        requirements: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes: 'No active-discipline restriction; starter eligibility is expressed by possession, loadout, and later concrete capability/proficiency requirements.',
        },
        modifiers: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes: 'Small original provisional stat modifiers for early balance testing.',
        },
    };
}

function originalFieldNotes(notes) {
    return {
        requirements: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes: 'No active-discipline restriction; availability is expressed by level, loadout, possession, and later capability requirements.',
        },
        modifiers: {
            confidence: CONFIDENCE_LABELS.INTENTIONAL_SIMPLIFICATION,
            source: STARTER_SOURCE,
            notes,
        },
    };
}

function hasExplicitRequirements(requirements = null) {
    if (!requirements || typeof requirements !== 'object') return false;
    if ((Number(requirements.minLevel) || 1) > 1) return true;
    return ['allowedJobs', 'allowedRaces', 'allowedSexes', 'requiredNations', 'requiredFame', 'requiredKeyItems', 'requiredQuestFlags']
        .some((key) => Array.isArray(requirements[key]) && requirements[key].length > 0);
}

function mergeRequirements(baseRequirements, runtimeRequirements) {
    const base = normalizeRequirements(baseRequirements);
    const runtime = normalizeRequirements(runtimeRequirements);
    return normalizeRequirements({
        ...base,
        minLevel: runtime.minLevel > 1 ? runtime.minLevel : base.minLevel,
        allowedJobs: runtime.allowedJobs.length ? runtime.allowedJobs : base.allowedJobs,
        allowedRaces: runtime.allowedRaces.length ? runtime.allowedRaces : base.allowedRaces,
        allowedSexes: runtime.allowedSexes.length ? runtime.allowedSexes : base.allowedSexes,
        requiredNations: runtime.requiredNations.length ? runtime.requiredNations : base.requiredNations,
        requiredFame: runtime.requiredFame.length ? runtime.requiredFame : base.requiredFame,
        requiredKeyItems: runtime.requiredKeyItems.length ? runtime.requiredKeyItems : base.requiredKeyItems,
        requiredQuestFlags: runtime.requiredQuestFlags.length ? runtime.requiredQuestFlags : base.requiredQuestFlags,
    });
}

function isCatalogEnrichedItem(item, entry) {
    return item?.fieldNotes?.requirements?.source === entry.fieldNotes?.requirements?.source || item?.metadata?.source === entry.metadata?.source;
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
