import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const IRONSPINE_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-ironspine-stonepine-cone': gathered({
        id: 'item-ironspine-stonepine-cone',
        name: 'Ironspine Stonepine Cone',
        tags: ['flora', 'cone', 'food', 'nuts', 'alpine', 'ironspine'],
        valueGil: 9,
        sourceId: 'source-ironspine-stonepine-grove',
        placeId: 'ironspine-lower-pass',
        action: 'forage',
        consumption: {
            mode: 'processRequired',
            hazard: 'none',
            preparation: ['shell', 'roast-or-grind'],
            notes: 'The hard cone is provision stock rather than trail food; crack out the kernels and roast or grind them before eating.',
        },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-alpine-sorrel': gathered({
        id: 'item-ironspine-alpine-sorrel',
        name: 'Ironspine Alpine Sorrel',
        tags: ['flora', 'herb', 'food', 'greens', 'alpine', 'ironspine'],
        valueGil: 8,
        sourceId: 'source-ironspine-alpine-sorrel-patch',
        placeId: 'ironspine-high-meadow',
        action: 'forage',
        consumption: {
            mode: 'direct',
            hazard: 'none',
            preparation: [],
            notes: 'Young clean leaves are eaten fresh in small handfuls and are also commonly put into broths and stews.',
        },
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-frost-lichen': gathered({
        id: 'item-ironspine-frost-lichen',
        name: 'Frost Lichen',
        tags: ['flora', 'lichen', 'dye', 'remedy', 'alpine', 'ironspine'],
        valueGil: 24,
        sourceId: 'source-ironspine-frost-lichen-face',
        placeId: 'ironspine-high-meadow',
        action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-dwarf-willow-bark': gathered({
        id: 'item-ironspine-dwarf-willow-bark',
        name: 'Dwarf Willow Bark',
        tags: ['flora', 'bark', 'tannin', 'remedy', 'alpine', 'ironspine'],
        valueGil: 12,
        sourceId: 'source-ironspine-dwarf-willow-scrub',
        placeId: 'ironspine-lower-pass',
        action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-lodestone-ore': gathered({
        id: 'item-ironspine-lodestone-ore',
        name: 'Ironspine Lodestone Ore',
        tags: ['mineral', 'ore', 'iron', 'lodestone', 'survey', 'ironspine'],
        valueGil: 28,
        sourceId: 'source-ironspine-lodestone-seam',
        placeId: 'ironspine-high-meadow',
        action: 'mine',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-cloud-quartz': gathered({
        id: 'item-ironspine-cloud-quartz',
        name: 'Cloud Quartz',
        tags: ['mineral', 'quartz', 'fine-craft', 'survey', 'luxury', 'ironspine'],
        valueGil: 44,
        sourceId: 'source-ironspine-cloud-quartz-pocket',
        placeId: 'ironspine-high-meadow',
        action: 'mine',
        sinks: ['processInput', 'craftIngredient', 'trade', 'collectible'],
    }),
    'item-ironspine-snowhorn-hide': body({
        id: 'item-ironspine-snowhorn-hide',
        name: 'Snowhorn Ibex Hide',
        tags: ['material', 'hide', 'beast', 'alpine', 'ironspine'],
        valueGil: 24,
        sourceId: 'enemy-ironspine-snowhorn-ibex',
        placeId: 'ironspine-high-meadow',
        action: 'skin',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-ironspine-snowhorn-meat': body({
        id: 'item-ironspine-snowhorn-meat',
        name: 'Fresh Snowhorn Meat',
        tags: ['meat', 'food', 'game', 'beast', 'alpine', 'ironspine'],
        valueGil: 16,
        sourceId: 'enemy-ironspine-snowhorn-ibex',
        placeId: 'ironspine-high-meadow',
        action: 'butcher',
        consumption: {
            mode: 'processRequired',
            hazard: 'pathogenRisk',
            preparation: ['butcher', 'cook-or-smoke'],
            notes: 'Fresh-killed mountain game is normally roasted, boiled, stewed, or properly smoked; eating it raw is known to bring sickness.',
        },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-cliff-bear-hide': body({
        id: 'item-ironspine-cliff-bear-hide',
        name: 'Cliff Bear Hide',
        tags: ['material', 'hide', 'fur', 'beast', 'alpine', 'ironspine'],
        valueGil: 42,
        sourceId: 'enemy-ironspine-cliff-bear',
        placeId: 'ironspine-lower-pass',
        action: 'skin',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-ironspine-bear-fat': body({
        id: 'item-ironspine-bear-fat',
        name: 'Cliff Bear Fat',
        tags: ['material', 'fat', 'rendering', 'beast', 'ironspine'],
        valueGil: 18,
        sourceId: 'enemy-ironspine-cliff-bear',
        placeId: 'ironspine-lower-pass',
        action: 'butcher',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-ironspine-froststep-pelt': body({
        id: 'item-ironspine-froststep-pelt',
        name: 'Froststep Lynx Pelt',
        tags: ['material', 'hide', 'fur', 'beast', 'alpine', 'ironspine'],
        valueGil: 48,
        sourceId: 'enemy-ironspine-froststep-lynx',
        placeId: 'ironspine-high-meadow',
        action: 'skin',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
});

export function getIronspineResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listIronspineResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function gathered({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks }) {
    return resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption, sinks, provenanceType: 'gathering' });
}

function body({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks }) {
    return resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption, sinks, provenanceType: 'body' });
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks, provenanceType }) {
    return Object.freeze({
        id,
        name,
        kind: ITEM_KINDS.MATERIAL,
        quantity: 1,
        maxStack: 99,
        valueGil,
        tags: Object.freeze([...tags]),
        consumption,
        provenance: Object.freeze([Object.freeze({
            type: provenanceType,
            sourceId,
            placeId,
            action,
            data: Object.freeze({ catalogVersion: IRONSPINE_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Ironspine Highlands',
            notes: 'Canonical Ironspine resource with exact authored source and intended downstream use.',
        }),
    });
}
