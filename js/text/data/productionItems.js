import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const PRODUCTION_ITEM_CATALOG_VERSION = 4;

const PRODUCTION_ITEM_DEFINITIONS = Object.freeze({
    'item-redstone-copper-ingot': productionItem({ id: 'item-redstone-copper-ingot', name: 'Redstone Copper Ingot', kind: ITEM_KINDS.MATERIAL, tags: ['metal', 'copper', 'component', 'crafted'], valueGil: 28, sourceId: 'process-redstone-copper-ingot', action: 'process', sinks: ['craftIngredient', 'processInput', 'construction', 'trade'] }),
    'item-copper-trail-clasp': productionItem({ id: 'item-copper-trail-clasp', name: 'Copper Trail Clasp', kind: ITEM_KINDS.EQUIPMENT, tags: ['accessory', 'travel', 'crafted', 'metal'], valueGil: 42, sourceId: 'craft-copper-trail-clasp', action: 'craft', sinks: ['equipment', 'construction', 'salvage', 'trade'], equipmentSlot: 'waist', allowedSlots: ['waist'], modifiers: { derived: { defense: 1 } } }),
    'item-silverfin-sweetroot-stew': productionItem({ id: 'item-silverfin-sweetroot-stew', name: 'Silverfin Sweetroot Stew', kind: ITEM_KINDS.CONSUMABLE, tags: ['food', 'meal', 'cooked', 'starfen'], valueGil: 24, sourceId: 'cook-silverfin-sweetroot-stew', action: 'craft', sinks: ['consume', 'trade'] }),
    'item-copper-scrap': productionItem({ id: 'item-copper-scrap', name: 'Copper Scrap', kind: ITEM_KINDS.MATERIAL, tags: ['metal', 'copper', 'scrap', 'salvage'], valueGil: 8, sourceId: 'salvage-copper-trail-clasp', action: 'salvage', sinks: ['processInput', 'trade'] }),
    'item-elderwood-resin-board': productionItem({ id: 'item-elderwood-resin-board', name: 'Resin-Sealed Hardwood Board', kind: ITEM_KINDS.MATERIAL, tags: ['wood', 'component', 'sealed', 'elderwood'], valueGil: 38, sourceId: 'craft-elderwood-resin-board', action: 'craft', sinks: ['craftIngredient', 'construction', 'repair', 'trade'] }),
    'item-elderwood-hide-binding': productionItem({ id: 'item-elderwood-hide-binding', name: 'Resin-Cured Hide Binding', kind: ITEM_KINDS.MATERIAL, tags: ['hide', 'binding', 'component', 'elderwood'], valueGil: 34, sourceId: 'craft-elderwood-hide-binding', action: 'craft', sinks: ['craftIngredient', 'construction', 'repair', 'trade'] }),
    'item-redstone-iron-bloom': productionItem({ id: 'item-redstone-iron-bloom', name: 'Redstone Iron Bloom', kind: ITEM_KINDS.MATERIAL, tags: ['metal', 'iron', 'component', 'redstone'], valueGil: 36, sourceId: 'process-redstone-iron-bloom', action: 'process', sinks: ['craftIngredient', 'processInput', 'repair', 'trade'] }),
    'item-starfen-bluekelp-broth': productionItem({ id: 'item-starfen-bluekelp-broth', name: 'Bluekelp Silverfin Broth', kind: ITEM_KINDS.CONSUMABLE, tags: ['food', 'meal', 'cooked', 'starfen'], valueGil: 27, sourceId: 'cook-starfen-bluekelp-broth', action: 'craft', sinks: ['consume', 'trade'] }),
});

export function getProductionItem(itemId) {
    const definition = PRODUCTION_ITEM_DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return definition ? normalizeItem(definition) : null;
}

export function listProductionItems() {
    return Object.values(PRODUCTION_ITEM_DEFINITIONS).map((definition) => normalizeItem(definition));
}

function productionItem({ id, name, kind, tags, valueGil, sourceId, action, sinks, equipmentSlot = null, allowedSlots = [], modifiers = {} }) {
    return Object.freeze({
        id, name, kind, quantity: 1, maxStack: kind === ITEM_KINDS.EQUIPMENT ? 1 : 99, valueGil, tags: Object.freeze([...tags]),
        provenance: Object.freeze([Object.freeze({ type: action === 'salvage' ? 'salvage' : 'crafting', sourceId, placeId: null, action, data: Object.freeze({ catalogVersion: PRODUCTION_ITEM_CATALOG_VERSION }) })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot, allowedSlots: Object.freeze([...allowedSlots]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }), flags: Object.freeze([]), modifiers: Object.freeze(modifiers),
        metadata: Object.freeze({ confidence: 'intentionalSimplification', source: 'Hearth & Horizon production substrate', notes: 'Representative production output used to validate provenance-bearing transformation loops before broad recipe authoring.' }),
    });
}
