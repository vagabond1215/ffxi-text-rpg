import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const GREAT_MERE_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-great-mere-silver-perch': resource({
        id: 'item-great-mere-silver-perch', name: 'Great Mere Silver Perch',
        tags: ['fish', 'food', 'freshwater', 'protein', 'great-mere'], valueGil: 12,
        sourceId: 'source-great-mere-silver-perch-shoal', placeId: 'great-mere-westshore', action: 'fish',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean', 'cook'], notes: 'Freshwater fish must be cleaned and cooked before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-reed-pike': resource({
        id: 'item-great-mere-reed-pike', name: 'Great Mere Reed Pike',
        tags: ['fish', 'food', 'freshwater', 'predator', 'great-mere'], valueGil: 18,
        sourceId: 'source-great-mere-reed-pike-dropoff', placeId: 'great-mere-westshore', action: 'fish',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean', 'cook-or-pickle'], notes: 'Predatory freshwater fish should be cleaned and cooked or properly preserved before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-blueclaw-crayfish': resource({
        id: 'item-great-mere-blueclaw-crayfish', name: 'Blueclaw Crayfish',
        tags: ['crustacean', 'food', 'freshwater', 'protein', 'great-mere'], valueGil: 10,
        sourceId: 'source-great-mere-blueclaw-trap-bed', placeId: 'great-mere-westshore', action: 'trap',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean', 'cook'], notes: 'Freshwater crayfish must be cleaned and cooked before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-cloudwater-mussel': resource({
        id: 'item-great-mere-cloudwater-mussel', name: 'Cloudwater Mussel',
        tags: ['shellfish', 'mollusk', 'food', 'freshwater', 'great-mere'], valueGil: 9,
        sourceId: 'source-great-mere-cloudwater-mussel-bed', placeId: 'great-mere-westshore', action: 'fish',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['purge', 'clean', 'cook'], notes: 'Freshwater mussels should be purged, cleaned, and thoroughly cooked before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-lake-cress': resource({
        id: 'item-great-mere-lake-cress', name: 'Lake Cress',
        tags: ['flora', 'herb', 'food', 'freshwater', 'great-mere'], valueGil: 7,
        sourceId: 'source-great-mere-lake-cress-bank', placeId: 'great-mere-westshore', action: 'forage',
        consumption: { mode: 'direct', hazard: 'none', preparation: [], notes: 'Young washed leaves are safe to eat raw and also suit soups and fish dishes.' },
        sinks: ['consume', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-arrowroot-corm': resource({
        id: 'item-great-mere-arrowroot-corm', name: 'Mere Arrowroot Corm',
        tags: ['flora', 'root', 'food', 'starch', 'freshwater', 'great-mere'], valueGil: 8,
        sourceId: 'source-great-mere-arrowroot-bank', placeId: 'great-mere-westshore', action: 'gather',
        consumption: { mode: 'processRequired', hazard: 'rawIrritant', preparation: ['peel', 'cook-or-grate-and-wash'], notes: 'The raw corm is irritating; cook it or wash the grated starch before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-bitterflag-rhizome': resource({
        id: 'item-great-mere-bitterflag-rhizome', name: 'Bitterflag Rhizome',
        tags: ['flora', 'root', 'food', 'starch', 'toxic-raw', 'great-mere'], valueGil: 11,
        sourceId: 'source-great-mere-bitterflag-marsh', placeId: 'great-mere-westshore', action: 'forage',
        consumption: { mode: 'processRequired', hazard: 'rawToxic', preparation: ['slice', 'leach', 'boil'], notes: 'Poisonous if eaten raw. Repeated leaching and boiling are required before culinary use.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-lake-rush-stem': resource({
        id: 'item-great-mere-lake-rush-stem', name: 'Great Mere Lake Rush',
        tags: ['flora', 'fiber', 'basketry', 'fishing-gear', 'great-mere'], valueGil: 6,
        sourceId: 'source-great-mere-lake-rush-bed', placeId: 'great-mere-westshore', action: 'gather',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Structural rush fiber; not intended for eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-great-mere-cloudwater-pearl': resource({
        id: 'item-great-mere-cloudwater-pearl', name: 'Cloudwater Pearl',
        tags: ['freshwater', 'pearl', 'jewelry', 'ornament', 'luxury', 'great-mere'], valueGil: 68,
        sourceId: 'source-great-mere-cloudwater-pearl-bed', placeId: 'reedcrown-isle', action: 'fish',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Decorative freshwater pearl; not food.' },
        sinks: ['processInput', 'craftIngredient', 'trade', 'decorative', 'collectible'],
    }),
});

export function getGreatMereResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listGreatMereResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, consumption, sinks }) {
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
            type: action === 'fish' || action === 'trap' ? 'fishing' : 'flora',
            sourceId,
            placeId,
            action,
            data: Object.freeze({ catalogVersion: GREAT_MERE_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Great Mere freshwater ecology',
            notes: 'Original Great Mere resource authored with explicit consumption safety and a connected production role.',
        }),
    });
}
