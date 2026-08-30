import { ITEM_KINDS, normalizeItem, validateItemConsumption } from './itemSchema.js';

export const LOWER_DEEPVEIN_PRODUCTION_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-lower-deepvein-cooked-lampcaps': item({
        id: 'item-lower-deepvein-cooked-lampcaps', name: 'Cooked Lower Deepvein Lampcaps', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'fungus', 'cooked', 'subterranean', 'lower-deepvein'], valueGil: 26,
        sourceId: 'cook-lower-deepvein-lampcaps', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'The irritating fresh gills have been fully cooked; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-lower-deepvein-threadfin-fillet': item({
        id: 'item-lower-deepvein-threadfin-fillet', name: 'Cleaned Threadfin Fillet', kind: ITEM_KINDS.MATERIAL,
        tags: ['food', 'fish', 'fillet', 'ingredient', 'lower-deepvein'], valueGil: 20,
        sourceId: 'process-lower-deepvein-clean-threadfin', action: 'process',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['cook'], notes: 'Cleaned cavefish is still raw and must be cooked.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-lower-deepvein-salt-baked-threadfin': item({
        id: 'item-lower-deepvein-salt-baked-threadfin', name: 'Salt-Baked Threadfin Ration', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'fish', 'cooked', 'travel', 'lower-deepvein'], valueGil: 38,
        sourceId: 'cook-lower-deepvein-salt-baked-threadfin', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Fully cooked and salted; ready for a delver’s ration.' },
        sinks: ['consume', 'trade'],
    }),
    'item-lower-deepvein-boiled-sump-crab': item({
        id: 'item-lower-deepvein-boiled-sump-crab', name: 'Boiled Blind Sump Crab', kind: ITEM_KINDS.CONSUMABLE,
        tags: ['food', 'crustacean', 'cooked', 'lower-deepvein'], valueGil: 34,
        sourceId: 'cook-lower-deepvein-blind-sump-crab', action: 'craft',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Thoroughly boiled cave crab; ready to eat.' },
        sinks: ['consume', 'trade'],
    }),
    'item-lower-deepvein-glowmoss-wick-cord': item({
        id: 'item-lower-deepvein-glowmoss-wick-cord', name: 'Glowmoss Wick Cord', kind: ITEM_KINDS.MATERIAL,
        tags: ['fiber', 'wick', 'lampwork', 'component', 'lower-deepvein'], valueGil: 24,
        sourceId: 'process-lower-deepvein-glowmoss-wick-cord', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Twisted lamp wick and repair cord; not food.' },
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-lower-deepvein-refined-cave-salt': item({
        id: 'item-lower-deepvein-refined-cave-salt', name: 'Refined Deepvein Cave Salt', kind: ITEM_KINDS.MATERIAL,
        tags: ['salt', 'preservation', 'cooking', 'trade', 'lower-deepvein'], valueGil: 25,
        sourceId: 'process-lower-deepvein-refine-cave-salt', action: 'process',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Clean refined salt suitable for cooking and preservation.' },
        sinks: ['processInput', 'craftIngredient', 'preservation', 'trade'],
    }),
    'item-lower-deepvein-polished-quartz': item({
        id: 'item-lower-deepvein-polished-quartz', name: 'Polished Deepvein Quartz', kind: ITEM_KINDS.MATERIAL,
        tags: ['quartz', 'optical', 'reflector', 'survey', 'component', 'lower-deepvein'], valueGil: 40,
        sourceId: 'process-lower-deepvein-polish-quartz', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Polished mineral for reflector and survey work; not food.' },
        sinks: ['processInput', 'craftIngredient', 'trade', 'collectible'],
    }),
    'item-lower-deepvein-fired-lamp-cup': item({
        id: 'item-lower-deepvein-fired-lamp-cup', name: 'Fired Sump-Clay Lamp Cup', kind: ITEM_KINDS.MATERIAL,
        tags: ['ceramic', 'lampwork', 'component', 'lower-deepvein'], valueGil: 28,
        sourceId: 'process-lower-deepvein-fire-lamp-cup', action: 'process',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Small fired ceramic lamp vessel; not food.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-lower-deepvein-reflector-lamp-kit': item({
        id: 'item-lower-deepvein-reflector-lamp-kit', name: 'Deepvein Reflector Lamp Kit', kind: ITEM_KINDS.MATERIAL,
        tags: ['tool', 'lampwork', 'survey', 'fieldcraft', 'lower-deepvein'], valueGil: 86,
        sourceId: 'craft-lower-deepvein-reflector-lamp-kit', action: 'craft',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Ceramic lamp-and-reflector kit supplied unfueled for mine and cave work; not food.' },
        sinks: ['toolUse', 'repair', 'contract', 'trade'],
    }),
    'item-lower-deepvein-gallery-seep-packing': item({
        id: 'item-lower-deepvein-gallery-seep-packing', name: 'Deepvein Gallery Seep Packing', kind: ITEM_KINDS.MATERIAL,
        tags: ['repair', 'packing', 'clay', 'fiber', 'minework', 'lower-deepvein'], valueGil: 48,
        sourceId: 'craft-lower-deepvein-gallery-seep-packing', action: 'craft',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Fiber-and-clay packing for damp timber joints and minor seep control; not food.' },
        sinks: ['repair', 'construction', 'contract', 'trade'],
    }),
});

export function getLowerDeepveinProductionItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listLowerDeepveinProductionItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

export function validateLowerDeepveinProductionItems() {
    const issues = [];
    const ids = new Set();
    for (const entry of listLowerDeepveinProductionItems()) {
        if (ids.has(entry.id)) issues.push(`Duplicate Lower Deepvein production item ${entry.id}.`);
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
            data: Object.freeze({ catalogVersion: LOWER_DEEPVEIN_PRODUCTION_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        equipmentSlot: null,
        allowedSlots: Object.freeze([]),
        requirements: Object.freeze({ minLevel: 1, allowedJobs: [], allowedRaces: [] }),
        flags: Object.freeze([]),
        modifiers: Object.freeze({}),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Lower Deepvein production',
            notes: 'Original Lower Deepvein output connected to delver food, lampwork, repair, survey, and trade.',
        }),
    });
}
