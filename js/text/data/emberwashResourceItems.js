import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const EMBERWASH_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-emberwash-emberpod': resource({
        id: 'item-emberwash-emberpod', name: 'Emberpod', tags: ['flora', 'pod', 'food', 'arid', 'emberwash'], valueGil: 10,
        sourceId: 'source-emberwash-emberpod-grove', placeId: 'emberwash-north-wash', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'processRequired', hazard: 'none', preparation: ['grind-and-cook'], notes: 'The dry pods are normally milled and cooked before eating; chewing them raw is poor trail practice.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-cinder-pear': resource({
        id: 'item-emberwash-cinder-pear', name: 'Cinder Pear', tags: ['flora', 'fruit', 'food', 'arid', 'emberwash'], valueGil: 9,
        sourceId: 'source-emberwash-cinder-pear-patch', placeId: 'emberwash-north-wash', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['peel-and-despine'], notes: 'Ripe fruit is eaten after the skin and fine spines are carefully removed.' },
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-desert-sage': resource({
        id: 'item-emberwash-desert-sage', name: 'Emberwash Desert Sage', tags: ['flora', 'herb', 'remedy', 'arid', 'emberwash'], valueGil: 11,
        sourceId: 'source-emberwash-desert-sage-slope', placeId: 'emberwash-north-wash', action: 'forage', provenanceType: 'flora',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-cinderbrush-fiber': resource({
        id: 'item-emberwash-cinderbrush-fiber', name: 'Cinderbrush Fiber', tags: ['flora', 'fiber', 'cordage', 'arid', 'emberwash'], valueGil: 8,
        sourceId: 'source-emberwash-cinderbrush-stand', placeId: 'emberwash-north-wash', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-emberwash-salt-crust': resource({
        id: 'item-emberwash-salt-crust', name: 'Saltpan Crust', tags: ['mineral', 'salt', 'preservation', 'arid', 'emberwash'], valueGil: 10,
        sourceId: 'source-emberwash-saltpan-crust', placeId: 'emberwash-saltpan-verge', action: 'gather', provenanceType: 'mineral',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-red-ochre': resource({
        id: 'item-emberwash-red-ochre', name: 'Emberwash Red Ochre', tags: ['mineral', 'pigment', 'earth', 'arid', 'emberwash'], valueGil: 12,
        sourceId: 'source-emberwash-red-ochre-cut', placeId: 'emberwash-north-wash', action: 'mine', provenanceType: 'mineral',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-emberwash-gypsum-nodule': resource({
        id: 'item-emberwash-gypsum-nodule', name: 'Gypsum Nodule', tags: ['mineral', 'gypsum', 'plaster', 'construction', 'emberwash'], valueGil: 12,
        sourceId: 'source-emberwash-gypsum-shelf', placeId: 'emberwash-north-wash', action: 'mine', provenanceType: 'mineral',
        sinks: ['processInput', 'craftIngredient', 'construction', 'repair', 'trade'],
    }),
});

export function getEmberwashResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listEmberwashResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, provenanceType, consumption = null, sinks }) {
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
            data: Object.freeze({ catalogVersion: EMBERWASH_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Emberwash',
            notes: 'Canonical arid-frontier resource with exact authored source and connected downstream use.',
        }),
    });
}
