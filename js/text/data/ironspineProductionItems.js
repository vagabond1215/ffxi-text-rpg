import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const IRONSPINE_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-ironspine-stonepine-kernels': item({
        id: 'item-ironspine-stonepine-kernels', name: 'Roasted Stonepine Kernels', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'nuts', 'roasted', 'trail-food', 'ironspine'], valueGil: 18,
        sourceId: 'process-ironspine-stonepine-kernels', action: 'process',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Shelled and roasted kernels are ordinary trail food and can be eaten as carried.' },
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-snowhorn-stew': item({
        id: 'item-ironspine-snowhorn-stew', name: 'Snowhorn Sorrel Stew', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'meal', 'cooked', 'game', 'ironspine'], valueGil: 38,
        sourceId: 'cook-ironspine-snowhorn-stew', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'The game meat has been thoroughly stewed with sorrel and salt and is ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-ironspine-smoked-snowhorn': item({
        id: 'item-ironspine-smoked-snowhorn', name: 'Salt-Smoked Snowhorn', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'preserved', 'smoked', 'game', 'travel', 'ironspine'], valueGil: 34,
        sourceId: 'process-ironspine-smoked-snowhorn', action: 'process',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Salted and properly smoked over a long fire, this meat is prepared for the road and ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-ironspine-rendered-tallow': item({
        id: 'item-ironspine-rendered-tallow', name: 'Rendered Bear Tallow', kind: ITEM_KINDS.MATERIAL,
        tags: ['fat', 'tallow', 'lamp', 'salve', 'component', 'ironspine'], valueGil: 30,
        sourceId: 'process-ironspine-render-bear-tallow', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'repair', 'trade'],
    }),
    'item-ironspine-highland-leather': item({
        id: 'item-ironspine-highland-leather', name: 'Willow-Tanned Highland Leather', kind: ITEM_KINDS.MATERIAL,
        tags: ['hide', 'leather', 'component', 'weatherproof', 'ironspine'], valueGil: 54,
        sourceId: 'process-ironspine-highland-leather', action: 'process',
        sinks: ['craftIngredient', 'repair', 'trade'],
    }),
    'item-ironspine-froststep-fur-lining': item({
        id: 'item-ironspine-froststep-fur-lining', name: 'Dressed Froststep Fur Lining', kind: ITEM_KINDS.MATERIAL,
        tags: ['fur', 'lining', 'cold-weather', 'component', 'ironspine'], valueGil: 72,
        sourceId: 'process-ironspine-froststep-fur-lining', action: 'process',
        sinks: ['craftIngredient', 'repair', 'trade'],
    }),
    'item-ironspine-frost-lichen-salve': item({
        id: 'item-ironspine-frost-lichen-salve', name: 'Frost Lichen Tallow Salve', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['remedy', 'salve', 'cold-weather', 'field-medicine', 'ironspine'], valueGil: 48,
        sourceId: 'craft-ironspine-frost-lichen-salve', action: 'craft',
        sinks: ['consume', 'trade'],
    }),
    'item-ironspine-lodestone-billet': item({
        id: 'item-ironspine-lodestone-billet', name: 'Ironspine Lodestone Billet', kind: ITEM_KINDS.MATERIAL,
        tags: ['metal', 'iron', 'lodestone', 'component', 'survey', 'ironspine'], valueGil: 56,
        sourceId: 'process-ironspine-lodestone-billet', action: 'process',
        sinks: ['craftIngredient', 'processInput', 'trade'],
    }),
    'item-ironspine-lodestone-pointer': item({
        id: 'item-ironspine-lodestone-pointer', name: 'Balanced Lodestone Pointer', kind: ITEM_KINDS.MATERIAL,
        tags: ['metal', 'lodestone', 'instrument', 'survey', 'component', 'ironspine'], valueGil: 76,
        sourceId: 'craft-ironspine-lodestone-pointer', action: 'craft',
        sinks: ['craftIngredient', 'trade'],
    }),
    'item-ironspine-polished-cloud-quartz': item({
        id: 'item-ironspine-polished-cloud-quartz', name: 'Polished Cloud Quartz', kind: ITEM_KINDS.MATERIAL,
        tags: ['quartz', 'fine-craft', 'instrument', 'luxury', 'component', 'ironspine'], valueGil: 82,
        sourceId: 'process-ironspine-polished-cloud-quartz', action: 'process',
        sinks: ['craftIngredient', 'trade', 'decorative'],
    }),
    'item-ironspine-high-pass-compass': item({
        id: 'item-ironspine-high-pass-compass', name: 'High-Pass Survey Compass', kind: ITEM_KINDS.MATERIAL,
        tags: ['instrument', 'survey', 'navigation', 'fine-craft', 'ironspine'], valueGil: 132,
        sourceId: 'craft-ironspine-high-pass-compass', action: 'craft',
        sinks: ['contract', 'trade', 'collectible'],
    }),
    'item-ironspine-weather-mantle': item({
        id: 'item-ironspine-weather-mantle', name: 'Ironspine Weather Mantle', kind: ITEM_KINDS.EQUIPMENT,
        tags: ['equipment', 'armor', 'body', 'cold-weather', 'travel', 'ironspine'], valueGil: 168,
        sourceId: 'craft-ironspine-weather-mantle', action: 'craft',
        sinks: ['equipment', 'repair', 'trade'],
        equipmentSlot: 'body', allowedSlots: ['body'],
        modifiers: { attributes: { vit: 1 }, derived: { defense: 3 } },
    }),
});

export function getIronspineProductionItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listIronspineProductionItems() { return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry)); }
export function validateIronspineProductionItems() {
    const issues = [];
    const ids = new Set();
    for (const entry of listIronspineProductionItems()) {
        if (ids.has(entry.id)) issues.push(`Duplicate Ironspine production item ${entry.id}.`);
        ids.add(entry.id);
        for (const issue of validateItemConsumption(entry)) issues.push(`${entry.id} ${issue}`);
    }
    return issues;
}
function item({ id, name, kind, tags, valueGil, sourceId, action, consumption = null, sinks, equipmentSlot = null, allowedSlots = [], modifiers = {} }) {
    return Object.freeze({
        id, name, kind, quantity: 1, maxStack: kind === ITEM_KINDS.EQUIPMENT ? 1 : 99, valueGil,
        tags: Object.freeze([...tags]), consumption,
        provenance: Object.freeze([Object.freeze({ type: 'crafting', sourceId, placeId: null, action, data: Object.freeze({ catalogVersion: IRONSPINE_PRODUCTION_ITEM_CATALOG_VERSION }) })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot, allowedSlots: Object.freeze([...allowedSlots]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]), modifiers: Object.freeze(modifiers),
        metadata: Object.freeze({ confidence: 'intentionalSimplification', source: 'Hearth & Horizon Ironspine production', notes: 'Original highland production output connected to regional resources and existing work authorities.' }),
    });
}
