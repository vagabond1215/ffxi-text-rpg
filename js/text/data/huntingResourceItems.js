import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const HUNTING_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-elderwood-barkboar-hide': hunted({
        id: 'item-elderwood-barkboar-hide', name: 'Barkboar Hide', tags: ['material', 'hide', 'beast', 'elderwood'], valueGil: 16,
        sourceId: 'enemy-elderwood-barkboar', placeId: 'west-elderwood', action: 'skin',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-redstone-ibex-hide': hunted({
        id: 'item-redstone-ibex-hide', name: 'Ridge Ibex Hide', tags: ['material', 'hide', 'beast', 'redstone'], valueGil: 18,
        sourceId: 'enemy-redstone-ridge-ibex', placeId: 'south-redstone-reach', action: 'skin',
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-starfen-heron-feather': hunted({
        id: 'item-starfen-heron-feather', name: 'Mirecrest Feather', tags: ['material', 'feather', 'bird', 'starfen'], valueGil: 14,
        sourceId: 'enemy-starfen-mire-heron', placeId: 'west-starfen', action: 'pluck',
        sinks: ['craftIngredient', 'trade'],
    }),
});

export function getHuntingResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listHuntingResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function hunted({ id, name, tags, valueGil, sourceId, placeId, action, sinks }) {
    return Object.freeze({
        id,
        name,
        kind: ITEM_KINDS.MATERIAL,
        quantity: 1,
        maxStack: 99,
        valueGil,
        tags: Object.freeze([...tags]),
        provenance: Object.freeze([Object.freeze({
            type: 'body', sourceId, placeId, action,
            data: Object.freeze({ catalogVersion: HUNTING_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon regional hunting breadth',
            notes: 'Canonical material template; runtime body recovery replaces provenance with the actual defeated-creature opportunity.',
        }),
    });
}
