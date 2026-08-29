import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const EMBERWASH_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-emberwash-emberpod-meal': item({
        id: 'item-emberwash-emberpod-meal', name: 'Ground Emberpod Meal', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'meal', 'grain-substitute', 'emberwash'], valueGil: 18,
        sourceId: 'process-emberwash-emberpod-meal', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'none', preparation: ['cook-or-bake'], notes: 'Ground meal is meant for the cookpot or griddle rather than eaten dry.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-trail-cakes': item({
        id: 'item-emberwash-trail-cakes', name: 'Emberpod Trail Cakes', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'baked', 'travel', 'emberwash'], valueGil: 26,
        sourceId: 'cook-emberwash-trail-cakes', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'The cakes are fully baked and ready for the trail.' },
        sinks: ['consume', 'trade'],
    }),
    'item-emberwash-dried-cinder-pear': item({
        id: 'item-emberwash-dried-cinder-pear', name: 'Dried Cinder Pear Strips', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'dried', 'fruit', 'travel', 'emberwash'], valueGil: 22,
        sourceId: 'process-emberwash-dry-cinder-pear', action: 'process',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Peeled fruit has been properly dried and is ready to eat.' },
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-dried-desert-sage': item({
        id: 'item-emberwash-dried-desert-sage', name: 'Dried Emberwash Desert Sage', kind: ITEM_KINDS.MATERIAL,
        tags: ['herb', 'dried', 'remedy', 'fieldcraft', 'emberwash'], valueGil: 22,
        sourceId: 'process-emberwash-dry-desert-sage', action: 'process',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-cinderbrush-cord': item({
        id: 'item-emberwash-cinderbrush-cord', name: 'Cinderbrush Cord', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber', 'cordage', 'repair', 'emberwash'], valueGil: 24,
        sourceId: 'process-emberwash-cinderbrush-cord', action: 'process',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-emberwash-caravan-salt': item({
        id: 'item-emberwash-caravan-salt', name: 'Emberwash Caravan Salt', kind: ITEM_KINDS.MATERIAL,
        tags: ['salt', 'preservation', 'trade', 'emberwash'], valueGil: 24,
        sourceId: 'process-emberwash-caravan-salt', action: 'process',
        sinks: ['craftIngredient', 'preservation', 'trade'],
    }),
    'item-emberwash-red-ochre-pigment': item({
        id: 'item-emberwash-red-ochre-pigment', name: 'Emberwash Red Ochre Pigment', kind: ITEM_KINDS.MATERIAL,
        tags: ['pigment', 'earth', 'marking', 'emberwash'], valueGil: 28,
        sourceId: 'process-emberwash-red-ochre-pigment', action: 'process',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-gypsum-plaster': item({
        id: 'item-emberwash-gypsum-plaster', name: 'Burnt Emberwash Gypsum Plaster', kind: ITEM_KINDS.MATERIAL,
        tags: ['gypsum', 'plaster', 'construction', 'repair', 'emberwash'], valueGil: 30,
        sourceId: 'process-emberwash-gypsum-plaster', action: 'process',
        sinks: ['processInput', 'craftIngredient', 'construction', 'repair', 'trade'],
    }),
    'item-emberwash-dustwrap-repair-kit': item({
        id: 'item-emberwash-dustwrap-repair-kit', name: 'Emberwash Dustwrap Repair Kit', kind: ITEM_KINDS.MATERIAL,
        tags: ['fieldcraft', 'cloth', 'repair', 'travel', 'emberwash'], valueGil: 48,
        sourceId: 'craft-emberwash-dustwrap-repair-kit', action: 'craft',
        sinks: ['repair', 'contract', 'trade'],
    }),
    'item-emberwash-cistern-patch-compound': item({
        id: 'item-emberwash-cistern-patch-compound', name: 'Cinderwell Cistern Patch Compound', kind: ITEM_KINDS.MATERIAL,
        tags: ['plaster', 'waterworks', 'repair', 'construction', 'emberwash'], valueGil: 52,
        sourceId: 'craft-emberwash-cistern-patch', action: 'craft',
        sinks: ['construction', 'repair', 'contract', 'trade'],
    }),
});

export function getEmberwashProductionItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listEmberwashProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

export function validateEmberwashProductionItems() {
    const issues = [];
    const ids = new Set();
    for (const entry of listEmberwashProductionItems()) {
        if (ids.has(entry.id)) issues.push(`Duplicate Emberwash production item ${entry.id}.`);
        ids.add(entry.id);
        for (const issue of validateItemConsumption(entry)) issues.push(`${entry.id} ${issue}`);
    }
    return issues;
}

function item({ id, name, kind, tags, valueGil, sourceId, action, consumption = null, sinks }) {
    return Object.freeze({
        id,
        name,
        kind,
        quantity: 1,
        maxStack: 99,
        valueGil,
        tags: Object.freeze([...tags]),
        consumption,
        provenance: Object.freeze([Object.freeze({
            type: 'crafting',
            sourceId,
            placeId: null,
            action,
            data: Object.freeze({ catalogVersion: EMBERWASH_PRODUCTION_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null,
        allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]),
        modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Emberwash production',
            notes: 'Original arid-frontier production output connected to provisions, cloth repair, cordage, pigment, plaster, cistern work, and trade.',
        }),
    });
}
