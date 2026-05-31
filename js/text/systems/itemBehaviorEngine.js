import { ITEM_KINDS, hasItemFlag, normalizeItem } from '../data/itemSchema.js';

const DEFAULT_SELL_RATE = 0.5;
const METADATA_ONLY_RESTRICTION_FLAGS = Object.freeze(['noTrade', 'noDrop', 'noAuction']);

export function canSellItem(item, vendorContext = {}) {
    const normalized = normalizeItem(item);
    if (normalized.kind === ITEM_KINDS.KEY_ITEM || hasItemFlag(normalized, 'keyItem')) {
        return { ok: false, item: normalized, reason: `${normalized.name} is a key item and cannot be sold.` };
    }
    if (hasItemFlag(normalized, 'noSell')) {
        return { ok: false, item: normalized, reason: `${normalized.name} is marked noSell and cannot be sold.` };
    }

    const baseValue = getBaseValueGil(normalized);
    if (baseValue <= 0 && !vendorContext.allowZeroValueSell) {
        return { ok: false, item: normalized, reason: `${normalized.name} has no vendor value and cannot be sold.` };
    }

    return {
        ok: true,
        item: normalized,
        sellValueGil: calculateSellValue(normalized, vendorContext),
    };
}

export function calculateSellValue(item, vendorContext = {}) {
    const normalized = normalizeItem(item);
    const baseValue = getBaseValueGil(normalized);
    if (baseValue <= 0) {
        return vendorContext.allowZeroValueSell
            ? Math.max(0, Number.parseInt(vendorContext.zeroValueSellGil, 10) || 0)
            : 0;
    }

    const rawRate = Number(vendorContext.sellRate ?? DEFAULT_SELL_RATE);
    const rate = Number.isFinite(rawRate) ? Math.max(0, Math.min(1, rawRate)) : DEFAULT_SELL_RATE;
    return Math.max(1, Math.floor(baseValue * rate));
}

export function describeItemBehavior(item, vendorContext = {}) {
    const normalized = normalizeItem(item);
    const sellCheck = canSellItem(normalized, vendorContext);
    const metadataOnlyFlags = METADATA_ONLY_RESTRICTION_FLAGS.filter((flag) => hasItemFlag(normalized, flag));
    const lines = [
        sellCheck.ok
            ? `- selling: allowed, estimated ${sellCheck.sellValueGil} gil each`
            : `- selling: restricted - ${sellCheck.reason}`,
    ];

    if (metadataOnlyFlags.length) {
        lines.push(`- metadata-only restrictions: ${metadataOnlyFlags.join(', ')} (not enforced for shop selling yet)`);
    }
    if (normalized.metadata?.source || normalized.metadata?.notes) {
        lines.push(`- item metadata: ${describeMetadata(normalized.metadata)}`);
    }

    return lines.join('\n');
}

export function describeLatentEffects(item) {
    const normalized = normalizeItem(item);
    if (!normalized.latentEffects?.length) return '- latent effects: none';
    return normalized.latentEffects
        .map((effect) => `- latent ${effect.id}: condition=${describeCondition(effect.condition)}; modifiers=${describeModifierSummary(effect.modifiers)}; ${describeMetadata(effect)}`)
        .join('\n');
}

export function describeEnchantments(item) {
    const normalized = normalizeItem(item);
    if (!normalized.enchantments?.length) return '- enchantments: none';
    return normalized.enchantments
        .map((entry) => `- enchantment ${entry.id}: type=${entry.type}; condition=${describeCondition(entry.condition)}; modifiers=${describeModifierSummary(entry.modifiers)}; ${describeMetadata(entry)}`)
        .join('\n');
}

export function describeCharges(item) {
    const normalized = normalizeItem(item);
    if (!normalized.charges) return '- charges: none';
    const charges = normalized.charges;
    return `- charges: ${charges.current}/${charges.max}, recast ${charges.recastSeconds}s, cooldown ${charges.cooldownSeconds}s; ${describeMetadata(charges)}`;
}

export function describeRangedAmmoBehavior(item) {
    const normalized = normalizeItem(item);
    const markers = [];
    if (hasItemFlag(normalized, 'rangedWeapon')) markers.push('rangedWeapon flag');
    if (hasItemFlag(normalized, 'ammo')) markers.push('ammo flag');
    if (normalized.tags?.includes('ranged')) markers.push('ranged tag');
    if (normalized.tags?.includes('ammo')) markers.push('ammo tag');
    if (normalized.equipmentSlot === 'ranged') markers.push('ranged slot');
    if (normalized.equipmentSlot === 'ammo') markers.push('ammo slot');

    if (!markers.length) return '- ranged/ammo: none';

    const details = [
        `markers=${markers.join(', ')}`,
        `weaponCategory=${normalized.weaponCategory ?? 'none'}`,
        `weaponDelay=${normalized.weaponDelay ?? 'none'}`,
    ];
    return `- ranged/ammo: ${details.join('; ')}`;
}

function getBaseValueGil(item) {
    return Math.max(0, Number.parseInt(item?.valueGil, 10) || 0);
}

function describeCondition(condition) {
    return condition ? JSON.stringify(condition) : 'none';
}

function describeMetadata(metadata = {}) {
    const parts = [`confidence=${metadata.confidence ?? 'placeholder'}`];
    if (metadata.source) parts.push(`source=${metadata.source}`);
    if (metadata.notes) parts.push(`notes=${metadata.notes}`);
    return parts.join('; ');
}

function describeModifierSummary(modifiers = {}) {
    const entries = [];
    for (const [category, block] of Object.entries(modifiers ?? {})) {
        const values = Object.entries(block ?? {}).filter(([, value]) => Number(value) !== 0);
        if (values.length) entries.push(`${category}(${values.map(([key, value]) => `${key} ${formatSigned(value)}`).join(', ')})`);
    }
    return entries.length ? entries.join(', ') : 'none';
}

function formatSigned(value) {
    const number = Number(value) || 0;
    return number > 0 ? `+${number}` : String(number);
}
