import {
    ATTRIBUTE_KEYS,
    DERIVED_STAT_KEYS,
    ELEMENT_KEYS,
    RESOURCE_KEYS,
    createZeroBlock,
} from './systemConstants.js';

export const ITEM_KINDS = Object.freeze({
    EQUIPMENT: 'equipment',
    CONSUMABLE: 'consumable',
    MATERIAL: 'material',
    MISC: 'misc',
    KEY_ITEM: 'keyItem',
});

export const CONFIDENCE_LABELS = Object.freeze({
    EXACT_RETAIL_LIKE: 'exactRetailLike',
    RESEARCHED_APPROXIMATION: 'researchedApproximation',
    INTENTIONAL_SIMPLIFICATION: 'intentionalSimplification',
    PLACEHOLDER: 'placeholder',
});

export const ITEM_FLAGS = Object.freeze([
    'rare',
    'exclusive',
    'noSell',
    'noTrade',
    'noAuction',
    'noDrop',
    'equipmentOnly',
    'twoHanded',
    'offhandAllowed',
    'rangedWeapon',
    'ammo',
    'consumable',
    'keyItem',
    'latent',
    'enchantment',
    'chargeBased',
]);

export const ITEM_SCHEMA_VERSION = 2;

export function normalizeItem(rawItem = {}) {
    const kind = rawItem.kind ?? ITEM_KINDS.MISC;
    const stackable = rawItem.stackable ?? isStackableKind(kind);
    const quantity = Math.max(1, Number.parseInt(rawItem.quantity, 10) || 1);
    const maxStack = stackable ? Math.max(1, Number.parseInt(rawItem.maxStack, 10) || 99) : 1;
    const id = rawItem.id ?? rawItem.templateId ?? normalizeId(rawItem.name ?? 'unknown-item');
    const modifiers = normalizeModifierBlock(rawItem.modifiers ?? collectAlwaysOnModifiers(rawItem.effects));
    const equipmentSlot = rawItem.equipmentSlot ?? rawItem.slot ?? null;
    const allowedSlots = normalizeStringArray(rawItem.allowedSlots ?? (equipmentSlot ? [equipmentSlot] : []));
    const effects = normalizeEffects(rawItem.effects, modifiers, rawItem.fieldNotes?.modifiers ?? rawItem.metadata);

    return {
        schemaVersion: rawItem.schemaVersion ?? ITEM_SCHEMA_VERSION,
        id,
        templateId: rawItem.templateId ?? id,
        name: rawItem.name ?? rawItem.id ?? 'Unknown Item',
        kind,
        quantity,
        stackable,
        maxStack,
        valueGil: rawItem.valueGil ?? 0,
        tags: [...(rawItem.tags ?? [])],
        source: rawItem.source ?? null,
        family: rawItem.family ?? null,
        archetype: rawItem.archetype ?? null,
        subtype: rawItem.subtype ?? null,
        equipmentSlot,
        allowedSlots,
        weaponCategory: rawItem.weaponCategory ?? null,
        weaponDelay: normalizeNullableInteger(rawItem.weaponDelay),
        requirements: normalizeRequirements(rawItem.requirements),
        flags: normalizeItemFlags(rawItem.flags),
        modifiers,
        effects,
        latentEffects: normalizeLatentEffects(rawItem.latentEffects),
        enchantments: normalizeEffectLikeArray(rawItem.enchantments ?? (rawItem.enchantment ? [rawItem.enchantment] : [])),
        augments: normalizeEffectLikeArray(rawItem.augments),
        charges: normalizeCharges(rawItem.charges),
        metadata: normalizeMetadata(rawItem.metadata),
        fieldNotes: normalizeFieldNotes(rawItem.fieldNotes),
    };
}

export function normalizeRequirements(rawRequirements = {}) {
    const requirements = rawRequirements ?? {};
    return {
        minLevel: Math.max(1, Number.parseInt(requirements.minLevel, 10) || 1),
        allowedJobs: normalizeStringArray(requirements.allowedJobs ?? requirements.jobs),
        allowedRaces: normalizeStringArray(requirements.allowedRaces ?? requirements.races),
        allowedSexes: normalizeStringArray(requirements.allowedSexes ?? requirements.sexes ?? requirements.sex),
        requiredNations: normalizeStringArray(requirements.requiredNations ?? requirements.nations),
        requiredFame: normalizeStringArray(requirements.requiredFame ?? requirements.fame),
        requiredKeyItems: normalizeStringArray(requirements.requiredKeyItems ?? requirements.keyItems),
        requiredQuestFlags: normalizeStringArray(requirements.requiredQuestFlags ?? requirements.questFlags),
    };
}

export function normalizeItemFlags(rawFlags = []) {
    if (Array.isArray(rawFlags)) return uniqueStrings(rawFlags.map(normalizeFlagId).filter(Boolean));
    if (rawFlags && typeof rawFlags === 'object') {
        return uniqueStrings(Object.entries(rawFlags)
            .filter(([, enabled]) => Boolean(enabled))
            .map(([flag]) => normalizeFlagId(flag))
            .filter(Boolean));
    }
    if (typeof rawFlags === 'string') return normalizeItemFlags([rawFlags]);
    return [];
}

export function hasItemFlag(item, flagId) {
    const normalized = normalizeFlagId(flagId);
    return normalizeItemFlags(item?.flags).includes(normalized);
}

export function normalizeEffects(rawEffects = [], fallbackModifiers = null, fallbackMetadata = null) {
    const effects = Array.isArray(rawEffects) ? rawEffects.map((effect, index) => normalizeEffect(effect, index)) : [];
    const hasAlwaysOnModifier = effects.some((effect) => effect.type === 'modifier' && effect.trigger === 'always');
    if (!hasAlwaysOnModifier && hasAnyModifier(fallbackModifiers)) {
        effects.unshift(normalizeEffect({
            id: 'always-on-modifiers',
            type: 'modifier',
            trigger: 'always',
            modifiers: fallbackModifiers,
            confidence: fallbackMetadata?.confidence,
            source: fallbackMetadata?.source,
            notes: fallbackMetadata?.notes,
        }, 0));
    }
    return effects;
}

export function normalizeLatentEffects(rawLatentEffects = []) {
    const latentEffects = Array.isArray(rawLatentEffects) ? rawLatentEffects : [];
    return latentEffects.map((effect, index) => ({
        id: effect.id ?? `latent-${index + 1}`,
        condition: effect.condition ?? null,
        modifiers: normalizeModifierBlock(effect.modifiers),
        confidence: normalizeConfidence(effect.confidence),
        source: effect.source ?? null,
        notes: effect.notes ?? '',
    }));
}

export function normalizeCharges(rawCharges = null) {
    if (!rawCharges || typeof rawCharges !== 'object' || Array.isArray(rawCharges)) return null;
    const max = Math.max(0, Number.parseInt(rawCharges.max, 10) || 0);
    const current = Math.max(0, Math.min(max, Number.parseInt(rawCharges.current, 10) || 0));
    return {
        max,
        current,
        recastSeconds: Math.max(0, Number.parseInt(rawCharges.recastSeconds, 10) || 0),
        cooldownSeconds: Math.max(0, Number.parseInt(rawCharges.cooldownSeconds, 10) || 0),
        lastUsedAt: rawCharges.lastUsedAt ?? null,
        confidence: normalizeConfidence(rawCharges.confidence),
        source: rawCharges.source ?? null,
        notes: rawCharges.notes ?? '',
    };
}

export function normalizeModifierBlock(modifiers = {}) {
    return {
        attributes: normalizeNumericBlock(modifiers?.attributes, ATTRIBUTE_KEYS),
        resources: normalizeNumericBlock(modifiers?.resources, RESOURCE_KEYS),
        derived: normalizeNumericBlock(modifiers?.derived, DERIVED_STAT_KEYS),
        resistances: normalizeNumericBlock(modifiers?.resistances, ELEMENT_KEYS),
    };
}

export function mergeModifierBlocks(...blocks) {
    const merged = createEmptyModifierBlock();
    for (const block of blocks) {
        const normalized = normalizeModifierBlock(block);
        for (const category of Object.keys(merged)) {
            for (const [key, value] of Object.entries(normalized[category])) {
                merged[category][key] += Number(value) || 0;
            }
        }
    }
    return merged;
}

export function createEmptyModifierBlock() {
    return {
        attributes: createZeroBlock(ATTRIBUTE_KEYS),
        resources: createZeroBlock(RESOURCE_KEYS),
        derived: createZeroBlock(DERIVED_STAT_KEYS),
        resistances: createZeroBlock(ELEMENT_KEYS),
    };
}

export function canStackItems(existingItem, incomingItem) {
    if (!existingItem || !incomingItem) return false;
    if (!existingItem.stackable || !incomingItem.stackable) return false;
    if (existingItem.id !== incomingItem.id) return false;
    if (existingItem.kind !== incomingItem.kind) return false;
    return (existingItem.quantity ?? 1) < (existingItem.maxStack ?? 1);
}

export function addToStack(existingItem, incomingItem) {
    const maxStack = existingItem.maxStack ?? 1;
    const current = existingItem.quantity ?? 1;
    const incoming = incomingItem.quantity ?? 1;
    const accepted = Math.min(incoming, Math.max(0, maxStack - current));
    existingItem.quantity = current + accepted;
    return {
        accepted,
        remaining: incoming - accepted,
    };
}

export function describeItem(item) {
    const quantity = item.quantity > 1 ? ` x${item.quantity}` : '';
    const stack = item.stackable ? ` stack ${item.quantity}/${item.maxStack}` : ' non-stackable';
    return `${item.name}${quantity} [${item.kind},${stack}]`;
}

function isStackableKind(kind) {
    return [ITEM_KINDS.CONSUMABLE, ITEM_KINDS.MATERIAL, ITEM_KINDS.MISC].includes(kind);
}

function normalizeEffectsModifiers(rawEffects) {
    return Array.isArray(rawEffects)
        ? rawEffects
            .filter((effect) => effect?.type === 'modifier' && (effect.trigger ?? 'always') === 'always')
            .map((effect) => effect.modifiers)
        : [];
}

function collectAlwaysOnModifiers(rawEffects) {
    return mergeModifierBlocks(...normalizeEffectsModifiers(rawEffects));
}

function normalizeEffect(rawEffect = {}, index = 0) {
    return {
        id: rawEffect.id ?? `effect-${index + 1}`,
        type: rawEffect.type ?? 'modifier',
        trigger: rawEffect.trigger ?? 'always',
        modifiers: normalizeModifierBlock(rawEffect.modifiers),
        confidence: normalizeConfidence(rawEffect.confidence),
        source: rawEffect.source ?? null,
        notes: rawEffect.notes ?? '',
    };
}

function normalizeEffectLikeArray(rawEntries = []) {
    if (!Array.isArray(rawEntries)) return [];
    return rawEntries.map((entry, index) => ({
        id: entry.id ?? `entry-${index + 1}`,
        type: entry.type ?? 'unknown',
        condition: entry.condition ?? null,
        modifiers: normalizeModifierBlock(entry.modifiers),
        confidence: normalizeConfidence(entry.confidence),
        source: entry.source ?? null,
        notes: entry.notes ?? '',
    }));
}

function normalizeMetadata(rawMetadata = {}) {
    const metadata = rawMetadata ?? {};
    return {
        confidence: normalizeConfidence(metadata.confidence),
        source: metadata.source ?? null,
        notes: metadata.notes ?? '',
    };
}

function normalizeFieldNotes(rawFieldNotes = {}) {
    if (!rawFieldNotes || typeof rawFieldNotes !== 'object' || Array.isArray(rawFieldNotes)) return {};
    return Object.fromEntries(Object.entries(rawFieldNotes).map(([field, metadata]) => [field, normalizeMetadata(metadata)]));
}

function normalizeConfidence(value) {
    return Object.values(CONFIDENCE_LABELS).includes(value) ? value : CONFIDENCE_LABELS.PLACEHOLDER;
}

function normalizeNumericBlock(block = {}, allowedKeys = []) {
    const result = createZeroBlock(allowedKeys);
    for (const [key, value] of Object.entries(block ?? {})) {
        if (allowedKeys.includes(key)) result[key] = Number(value) || 0;
    }
    return result;
}

function hasAnyModifier(modifiers = {}) {
    return Object.values(modifiers ?? {}).some((block) => Object.values(block ?? {}).some((value) => Number(value) !== 0));
}

function normalizeStringArray(value = []) {
    if (value === null || value === undefined) return [];
    const raw = Array.isArray(value) ? value : [value];
    return uniqueStrings(raw.map((entry) => String(entry ?? '').trim()).filter(Boolean));
}

function uniqueStrings(values) {
    return Array.from(new Set(values));
}

function normalizeNullableInteger(value) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
}

function normalizeFlagId(value) {
    const text = String(value ?? '').trim();
    if (!text) return null;
    const compact = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = ITEM_FLAGS.find((flag) => flag.toLowerCase().replace(/[^a-z0-9]/g, '') === compact);
    return match ?? text;
}

function normalizeId(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/['\u2019]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'unknown-item';
}
