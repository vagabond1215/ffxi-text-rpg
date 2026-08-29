import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const HEADWATER_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-headwater-coldstream-trout': gathered({
        id: 'item-headwater-coldstream-trout', name: 'Coldstream Trout',
        tags: ['fish', 'food', 'freshwater', 'protein', 'headwater'], valueGil: 13,
        sourceId: 'source-headwater-coldstream-trout-run', placeId: 'headwater-lower-vale', action: 'fish',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean', 'cook-or-smoke'], notes: 'Fresh river trout is cleaned and cooked or properly smoked before eating; raw fish is known to bring sickness.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-headwater-spring-cress': gathered({
        id: 'item-headwater-spring-cress', name: 'Headwater Spring Cress',
        tags: ['flora', 'herb', 'food', 'greens', 'freshwater', 'headwater'], valueGil: 7,
        sourceId: 'source-headwater-spring-cress-bank', placeId: 'headwater-lower-vale', action: 'forage',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Young clean leaves are eaten fresh in small handfuls and are also put into fish soups and stews.' },
        sinks: ['consume', 'processInput', 'craftIngredient', 'trade'],
    }),
    'item-headwater-meadowsweet': gathered({
        id: 'item-headwater-meadowsweet', name: 'Headwater Meadowsweet',
        tags: ['flora', 'herb', 'remedy', 'aromatic', 'headwater'], valueGil: 12,
        sourceId: 'source-headwater-meadowsweet-slope', placeId: 'headwater-upper-vale', action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-headwater-alder-bark': gathered({
        id: 'item-headwater-alder-bark', name: 'River Alder Bark',
        tags: ['flora', 'bark', 'tannin', 'smoke', 'headwater'], valueGil: 10,
        sourceId: 'source-headwater-alder-bark-coppice', placeId: 'headwater-lower-vale', action: 'forage',
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-headwater-willow-withe': gathered({
        id: 'item-headwater-willow-withe', name: 'River Willow Withe',
        tags: ['flora', 'fiber', 'basketry', 'wicker', 'headwater'], valueGil: 8,
        sourceId: 'source-headwater-willow-withe-stand', placeId: 'headwater-lower-vale', action: 'gather',
        sinks: ['processInput', 'craftIngredient', 'construction', 'trade'],
    }),
    'item-headwater-alder-timber': gathered({
        id: 'item-headwater-alder-timber', name: 'Headwater Alder Timber',
        tags: ['flora', 'wood', 'timber', 'riverine', 'headwater'], valueGil: 15,
        sourceId: 'source-headwater-alder-timber-stand', placeId: 'headwater-lower-vale', action: 'log',
        sinks: ['processInput', 'craftIngredient', 'construction', 'repair', 'trade'],
    }),
    'item-headwater-red-deer-hide': body({
        id: 'item-headwater-red-deer-hide', name: 'Headwater Red Deer Hide',
        tags: ['material', 'hide', 'beast', 'game', 'headwater'], valueGil: 22,
        sourceId: 'enemy-headwater-red-deer', placeId: 'headwater-upper-vale', action: 'skin',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-headwater-red-deer-venison': body({
        id: 'item-headwater-red-deer-venison', name: 'Fresh Headwater Venison',
        tags: ['meat', 'food', 'game', 'beast', 'headwater'], valueGil: 17,
        sourceId: 'enemy-headwater-red-deer', placeId: 'headwater-upper-vale', action: 'butcher',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['butcher', 'cook-or-smoke'], notes: 'Fresh deer meat is normally roasted, stewed, or properly smoked; eating raw game is known to bring sickness.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-headwater-red-deer-antler': body({
        id: 'item-headwater-red-deer-antler', name: 'Headwater Red Deer Antler',
        tags: ['material', 'antler', 'bone', 'carving', 'game', 'headwater'], valueGil: 20,
        sourceId: 'enemy-headwater-red-deer', placeId: 'headwater-upper-vale', action: 'butcher',
        sinks: ['processInput', 'craftIngredient', 'trade', 'decorative'],
    }),
});
export function getHeadwaterResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listHeadwaterResourceItems() { return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry)); }
function gathered({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks }) {
    return resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption, sinks, provenanceType: action === 'fish' || action === 'trap' ? 'fishing' : 'flora' });
}
function body({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks }) {
    return resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption, sinks, provenanceType: 'body' });
}
function resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption = null, sinks, provenanceType }) {
    return Object.freeze({
        id, name, kind: ITEM_KINDS.MATERIAL, quantity: 1, maxStack: 99, valueGil,
        tags: Object.freeze([...tags]), consumption,
        provenance: Object.freeze([Object.freeze({ type: provenanceType, sourceId, placeId, action, data: Object.freeze({ catalogVersion: HEADWATER_RESOURCE_ITEM_CATALOG_VERSION }) })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({ confidence: 'intentionalSimplification', source: 'Hearth & Horizon Headwater Vale', notes: 'Canonical Headwater Vale resource with exact authored source and connected downstream use.' }),
    });
}
