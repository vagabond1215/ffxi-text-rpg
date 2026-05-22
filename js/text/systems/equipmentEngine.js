import { EQUIPMENT_SLOTS } from '../data/systemConstants.js';
import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import { getContainerDefinition } from '../data/inventoryContainers.js';
import { ITEM_KINDS, hasItemFlag, normalizeItem } from '../data/itemSchema.js';
import {
    canStoreItemInContainer,
    findItemInContainer,
    isContainerAccessible,
} from './inventoryEngine.js';

const DEFAULT_EQUIP_SEARCH_CONTAINERS = Object.freeze(['inventory', 'wardrobe1', 'wardrobe2', 'wardrobe3', 'wardrobe4', 'wardrobe5', 'wardrobe6', 'wardrobe7', 'wardrobe8']);

export function equipItem(state, itemQuery, options = {}) {
    if (!itemQuery) return 'Equip what?';
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';

    const source = findEquippableItem(state, itemQuery, options.fromContainerId);
    if (!source.ok) return source.reason;

    const item = enrichEquipmentItem(source.item);
    if ((item.kind ?? 'misc') !== ITEM_KINDS.EQUIPMENT) return `${item.name ?? item.id} is not equipment.`;

    const slot = options.slot ?? inferEquipmentSlot(item);
    if (!slot) return `Could not infer equipment slot for ${item.name ?? item.id}. Use: equip <item> to <slot>.`;
    if (!EQUIPMENT_SLOTS.includes(slot)) return `Unknown equipment slot: ${slot}`;
    const eligibility = validateEquipmentEligibility(state, item, slot);
    if (!eligibility.ok) return eligibility.reason;

    const currentItem = state.player.equipment[slot] ?? null;
    const returnContainerId = options.returnContainerId ?? source.containerId;
    const returnDefinition = getContainerDefinition(returnContainerId);
    if (currentItem && !returnDefinition) return `Unknown return container: ${returnContainerId}`;

    const [removedItem] = source.container.items.splice(source.index, 1);
    if (currentItem) {
        const storeCheck = canStoreItemInContainer(inventoryState, returnContainerId, currentItem);
        if (!storeCheck.ok) {
            source.container.items.splice(source.index, 0, removedItem);
            return storeCheck.reason;
        }
    }

    state.player.equipment[slot] = item;
    if (currentItem) inventoryState.containers[returnContainerId].items.push(currentItem);

    return [
        `Equipped ${item.name ?? item.id} to ${slot}.`,
        `Source: ${getContainerDefinition(source.containerId)?.label ?? source.containerId}`,
        currentItem ? `Replaced ${currentItem.name ?? currentItem.id} -> ${returnDefinition.label}.` : 'No previous item replaced.',
    ].join('\n');
}

export function unequipItem(state, slot, destinationContainerId = 'inventory') {
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';
    if (!slot) return 'Unequip which slot?';
    if (!EQUIPMENT_SLOTS.includes(slot)) return `Unknown equipment slot: ${slot}`;

    const item = state.player.equipment[slot];
    if (!item) return `Nothing is equipped in ${slot}.`;

    const destinationDefinition = getContainerDefinition(destinationContainerId);
    if (!destinationDefinition) return `Unknown destination container: ${destinationContainerId}`;

    const storeCheck = canStoreItemInContainer(inventoryState, destinationContainerId, item);
    if (!storeCheck.ok) return storeCheck.reason;

    state.player.equipment[slot] = null;
    inventoryState.containers[destinationContainerId].items.push(item);

    return [
        `Unequipped ${item.name ?? item.id} from ${slot}.`,
        `Stored in ${destinationDefinition.label}.`,
    ].join('\n');
}

export function describeEquippableSources(state) {
    const inventoryState = state.player?.inventoryState;
    if (!inventoryState) return 'No inventory container state found.';

    const lines = ['Equippable item sources:'];
    for (const containerId of DEFAULT_EQUIP_SEARCH_CONTAINERS) {
        const container = inventoryState.containers[containerId];
        const definition = getContainerDefinition(containerId);
        if (!container || !definition) continue;
        const accessible = isContainerAccessible(inventoryState, containerId);
        const equipmentItems = container.items.filter((item) => (item.kind ?? 'misc') === 'equipment');
        lines.push(`- ${definition.label}: ${accessible ? 'accessible' : 'not accessible'}, equipment items=${equipmentItems.length}`);
    }
    return lines.join('\n');
}

export function validateEquipmentEligibility(state, item, slot = null) {
    const candidate = enrichEquipmentItem(item);
    const player = state.player;
    if (!player) return { ok: false, reason: 'No player found.' };
    if ((candidate.kind ?? 'misc') !== ITEM_KINDS.EQUIPMENT) {
        return { ok: false, reason: `${candidate.name ?? candidate.id} is not equipment.` };
    }
    if (!slot) return { ok: false, reason: `Could not infer equipment slot for ${candidate.name ?? candidate.id}. Use: equip <item> to <slot>.` };
    if (!EQUIPMENT_SLOTS.includes(slot)) return { ok: false, reason: `Unknown equipment slot: ${slot}` };
    if (!isSlotAllowed(candidate, slot)) {
        return { ok: false, reason: `${candidate.name ?? candidate.id} cannot be equipped to ${slot}. Allowed slots: ${describeAllowedSlots(candidate)}.` };
    }

    const requirements = candidate.requirements ?? {};
    const level = Number(player.jobs?.level) || 1;
    const mainJobId = player.jobs?.mainJobId;
    const raceId = player.identity?.raceId;
    const sex = player.identity?.sex;
    const nation = player.identity?.nation;

    if (level < (requirements.minLevel ?? 1)) {
        return { ok: false, reason: `${candidate.name} requires level ${requirements.minLevel}; current ${player.jobs?.mainJobName ?? mainJobId} level is ${level}.` };
    }
    if (requirements.allowedJobs?.length && !requirements.allowedJobs.includes(mainJobId)) {
        return { ok: false, reason: `${candidate.name} cannot be equipped by ${player.jobs?.mainJobName ?? mainJobId}. Allowed jobs: ${requirements.allowedJobs.join(', ')}.` };
    }
    if (requirements.allowedRaces?.length && !requirements.allowedRaces.includes(raceId)) {
        return { ok: false, reason: `${candidate.name} cannot be equipped by ${player.identity?.raceName ?? raceId}. Allowed races: ${requirements.allowedRaces.join(', ')}.` };
    }
    if (requirements.allowedSexes?.length && !requirements.allowedSexes.includes(sex)) {
        return { ok: false, reason: `${candidate.name} cannot be equipped by sex ${sex}. Allowed sexes: ${requirements.allowedSexes.join(', ')}.` };
    }
    if (requirements.requiredNations?.length && !requirements.requiredNations.includes(nation)) {
        return { ok: false, reason: `${candidate.name} requires nation: ${requirements.requiredNations.join(', ')}.` };
    }
    if (requirements.requiredKeyItems?.length && !requirements.requiredKeyItems.every((keyItem) => player.keyItems?.includes(keyItem))) {
        return { ok: false, reason: `${candidate.name} requires key item(s): ${requirements.requiredKeyItems.join(', ')}.` };
    }
    if (requirements.requiredQuestFlags?.length && !requirements.requiredQuestFlags.every((flag) => player.flags?.[flag])) {
        return { ok: false, reason: `${candidate.name} requires quest flag(s): ${requirements.requiredQuestFlags.join(', ')}.` };
    }

    const equippedMain = player.equipment?.mainHand ? enrichEquipmentItem(player.equipment.mainHand) : null;
    if (slot === 'mainHand' && hasItemFlag(candidate, 'twoHanded') && player.equipment?.offHand) {
        return { ok: false, reason: `${candidate.name} is two-handed and requires an empty offHand slot.` };
    }
    if (slot === 'offHand' && equippedMain && hasItemFlag(equippedMain, 'twoHanded')) {
        return { ok: false, reason: `Cannot equip ${candidate.name} to offHand while ${equippedMain.name} is two-handed.` };
    }
    if (slot === 'ranged' && hasItemFlag(candidate, 'ammo')) {
        return { ok: false, reason: `${candidate.name} is ammo and must use the ammo slot.` };
    }
    if (slot === 'ammo' && hasItemFlag(candidate, 'rangedWeapon')) {
        return { ok: false, reason: `${candidate.name} is a ranged weapon and must use the ranged slot.` };
    }

    return { ok: true, item: candidate, slot };
}

export function inspectItem(state, itemQuery) {
    if (!itemQuery) return 'Inspect which item? Use: item <query> or inspect item <query>.';
    const found = findInspectableItem(state, itemQuery);
    if (!found.ok) return found.reason;
    return describeItemInspection(found.item, found.sourceLabel);
}

export function inferEquipmentSlot(item) {
    if (item.equipmentSlot) return item.equipmentSlot;
    const tags = new Set(item.tags ?? []);
    if (tags.has('head')) return 'head';
    if (tags.has('body')) return 'body';
    if (tags.has('hands')) return 'hands';
    if (tags.has('legs')) return 'legs';
    if (tags.has('feet')) return 'feet';
    if (tags.has('neck')) return 'neck';
    if (tags.has('ear')) return 'leftEar';
    if (tags.has('ring')) return 'leftRing';
    if (tags.has('back')) return 'back';
    if (tags.has('waist')) return 'waist';
    if (tags.has('ranged')) return 'ranged';
    if (tags.has('ammo')) return 'ammo';
    if (tags.has('shield') || tags.has('offhand')) return 'offHand';
    if (tags.has('weapon') || tags.has('sword') || tags.has('axe') || tags.has('dagger') || tags.has('staff') || tags.has('club')) return 'mainHand';
    return null;
}

function describeItemInspection(item, sourceLabel = 'unknown') {
    const normalized = (item.kind ?? 'misc') === ITEM_KINDS.EQUIPMENT ? enrichEquipmentItem(item) : normalizeItem(item);
    const lines = [
        `${normalized.name}`,
        `ID: ${normalized.id}`,
        `Template: ${normalized.templateId}`,
        `Kind: ${normalized.kind}`,
        `Source: ${sourceLabel}`,
    ];

    if (normalized.kind === ITEM_KINDS.EQUIPMENT) {
        lines.push(`Slot: ${normalized.equipmentSlot ?? 'none'} (allowed: ${describeAllowedSlots(normalized)})`);
        lines.push(`Family: ${normalized.family ?? 'none'} / ${normalized.archetype ?? 'none'} / ${normalized.subtype ?? 'none'}`);
        if (normalized.weaponCategory || normalized.weaponDelay !== null) {
            lines.push(`Weapon: ${normalized.weaponCategory ?? 'none'} delay ${normalized.weaponDelay ?? 'none'}`);
        }
        lines.push(describeRequirements(normalized.requirements));
    }

    lines.push(`Flags: ${normalized.flags.length ? normalized.flags.join(', ') : 'none'}`);
    lines.push('Always-on modifiers:');
    lines.push(...describeModifierBlock(normalized.modifiers));
    lines.push('Effects:');
    lines.push(...describeEffects(normalized));
    lines.push('Confidence/source:');
    lines.push(...describeConfidence(normalized));
    return lines.join('\n');
}

function findEquippableItem(state, itemQuery, fromContainerId = null) {
    const inventoryState = state.player?.inventoryState;
    const containerIds = fromContainerId ? [fromContainerId] : DEFAULT_EQUIP_SEARCH_CONTAINERS;

    for (const containerId of containerIds) {
        const definition = getContainerDefinition(containerId);
        if (!definition) return { ok: false, reason: `Unknown container: ${containerId}` };
        if (!isContainerAccessible(inventoryState, containerId)) continue;
        const found = findItemInContainer(inventoryState, containerId, itemQuery);
        if (found.ok) return { ...found, containerId };
    }

    return { ok: false, reason: `No accessible equipment item found: ${itemQuery}` };
}

function findInspectableItem(state, itemQuery) {
    const normalizedQuery = normalizeQuery(itemQuery);
    if (!normalizedQuery) return { ok: false, reason: 'No item specified.' };

    for (const [slot, item] of Object.entries(state.player?.equipment ?? {})) {
        if (item && itemMatches(item, normalizedQuery)) return { ok: true, item, sourceLabel: `equipped ${slot}` };
    }

    const inventoryState = state.player?.inventoryState;
    for (const containerId of DEFAULT_EQUIP_SEARCH_CONTAINERS) {
        const definition = getContainerDefinition(containerId);
        const container = inventoryState?.containers?.[containerId];
        if (!definition || !container || !isContainerAccessible(inventoryState, containerId)) continue;
        const item = container.items.find((entry) => itemMatches(entry, normalizedQuery));
        if (item) return { ok: true, item, sourceLabel: definition.label };
    }

    return { ok: false, reason: `No accessible item found: ${itemQuery}` };
}

function isSlotAllowed(item, slot) {
    if (item.allowedSlots?.includes(slot)) return true;
    if (slot === 'offHand' && (hasItemFlag(item, 'offhandAllowed') || item.family === 'shield' || item.archetype === 'shield')) return true;
    return false;
}

function describeAllowedSlots(item) {
    return item.allowedSlots?.length ? item.allowedSlots.join(', ') : 'none';
}

function describeRequirements(requirements = {}) {
    return [
        'Requirements:',
        `- Min level: ${requirements.minLevel ?? 1}`,
        `- Allowed jobs: ${requirements.allowedJobs?.length ? requirements.allowedJobs.join(', ') : 'all'}`,
        `- Allowed races: ${requirements.allowedRaces?.length ? requirements.allowedRaces.join(', ') : 'all'}`,
        `- Allowed sexes: ${requirements.allowedSexes?.length ? requirements.allowedSexes.join(', ') : 'all'}`,
        `- Required nations: ${requirements.requiredNations?.length ? requirements.requiredNations.join(', ') : 'none'}`,
        `- Required key items: ${requirements.requiredKeyItems?.length ? requirements.requiredKeyItems.join(', ') : 'none'}`,
        `- Required quest flags: ${requirements.requiredQuestFlags?.length ? requirements.requiredQuestFlags.join(', ') : 'none'}`,
    ].join('\n');
}

function describeModifierBlock(modifiers = {}) {
    const lines = [];
    for (const [category, block] of Object.entries(modifiers)) {
        const entries = Object.entries(block ?? {}).filter(([, value]) => Number(value) !== 0);
        if (entries.length) lines.push(`- ${category}: ${entries.map(([key, value]) => `${key} ${formatSigned(value)}`).join(', ')}`);
    }
    return lines.length ? lines : ['- none'];
}

function describeEffects(item) {
    const lines = [];
    lines.push(...(item.effects?.length ? item.effects.map((effect) => `- ${effect.id}: ${effect.type} (${effect.trigger}) confidence=${effect.confidence}`) : ['- always-on effects: none beyond modifiers']));
    lines.push(...(item.latentEffects?.length ? item.latentEffects.map((effect) => `- latent ${effect.id}: condition=${JSON.stringify(effect.condition)} confidence=${effect.confidence}`) : ['- latent: none']));
    lines.push(...(item.enchantments?.length ? item.enchantments.map((entry) => `- enchantment ${entry.id}: ${entry.type} confidence=${entry.confidence}`) : ['- enchantments: none']));
    lines.push(...(item.augments?.length ? item.augments.map((entry) => `- augment ${entry.id}: ${entry.type} confidence=${entry.confidence}`) : ['- augments: none']));
    lines.push(item.charges ? `- charges: ${item.charges.current}/${item.charges.max}, recast ${item.charges.recastSeconds}s, cooldown ${item.charges.cooldownSeconds}s` : '- charges: none');
    return lines;
}

function describeConfidence(item) {
    const lines = [`- template: ${item.metadata?.confidence ?? 'placeholder'}${item.metadata?.source ? ` (${item.metadata.source})` : ''}`];
    for (const [field, metadata] of Object.entries(item.fieldNotes ?? {})) {
        lines.push(`- ${field}: ${metadata.confidence}${metadata.source ? ` (${metadata.source})` : ''}${metadata.notes ? ` - ${metadata.notes}` : ''}`);
    }
    return lines;
}

function itemMatches(item, normalizedQuery) {
    return normalizeQuery(item.id) === normalizedQuery
        || normalizeQuery(item.templateId) === normalizedQuery
        || normalizeQuery(item.name).includes(normalizedQuery);
}

function normalizeQuery(value) {
    return String(value ?? '').trim().toLowerCase().replace(/['\u2019]/g, '').replace(/\s+/g, '-');
}

function formatSigned(value) {
    const number = Number(value) || 0;
    return number > 0 ? `+${number}` : String(number);
}
