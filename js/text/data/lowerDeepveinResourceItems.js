import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const LOWER_DEEPVEIN_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-lower-deepvein-lampcap': resource({
        id: 'item-lower-deepvein-lampcap', name: 'Lower Deepvein Lampcap',
        tags: ['flora', 'fungus', 'food', 'subterranean', 'lower-deepvein'], valueGil: 12,
        sourceId: 'source-lower-deepvein-lampcap-shelf', placeId: 'lower-deepvein-echoing-shelf', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'processRequired', hazard: 'rawIrritant', preparation: ['slice-and-cook'], notes: 'Fresh lampcap gills are irritating; delvers slice and cook them before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-lower-deepvein-threadfin': resource({
        id: 'item-lower-deepvein-threadfin', name: 'Threadfin Cavefish',
        tags: ['fish', 'food', 'cave', 'protein', 'lower-deepvein'], valueGil: 14,
        sourceId: 'source-lower-deepvein-threadfin-pool', placeId: 'lower-deepvein-echoing-shelf', action: 'fish', provenanceType: 'fishing',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean', 'cook'], notes: 'Cavefish are cleaned and cooked before they are eaten.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-lower-deepvein-blind-sump-crab': resource({
        id: 'item-lower-deepvein-blind-sump-crab', name: 'Blind Sump Crab',
        tags: ['crustacean', 'food', 'cave', 'protein', 'lower-deepvein'], valueGil: 13,
        sourceId: 'source-lower-deepvein-blind-crab-trap-bed', placeId: 'lower-deepvein-echoing-shelf', action: 'trap', provenanceType: 'fishing',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean', 'boil'], notes: 'Sump crabs are cleaned and boiled thoroughly before eating.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-lower-deepvein-glowmoss-fiber': resource({
        id: 'item-lower-deepvein-glowmoss-fiber', name: 'Glowmoss Fiber',
        tags: ['flora', 'fiber', 'wick', 'packing', 'subterranean', 'lower-deepvein'], valueGil: 9,
        sourceId: 'source-lower-deepvein-glowmoss-wall', placeId: 'deepvein-lower-decline', action: 'gather', provenanceType: 'flora',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Tough fibrous moss used for wicks and damp-gallery packing; not food.' },
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
    'item-lower-deepvein-cave-salt-bloom': resource({
        id: 'item-lower-deepvein-cave-salt-bloom', name: 'Cave Salt Bloom',
        tags: ['mineral', 'salt', 'preservation', 'subterranean', 'lower-deepvein'], valueGil: 11,
        sourceId: 'source-lower-deepvein-salt-bloom-gallery', placeId: 'deepvein-lower-decline', action: 'gather', provenanceType: 'mineral',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Raw cave salt bloom is a processing material and is refined before culinary use.' },
        sinks: ['processInput', 'craftIngredient', 'trade'],
    }),
    'item-lower-deepvein-quartz-cluster': resource({
        id: 'item-lower-deepvein-quartz-cluster', name: 'Deepvein Quartz Cluster',
        tags: ['mineral', 'quartz', 'optical', 'survey', 'lower-deepvein'], valueGil: 18,
        sourceId: 'source-lower-deepvein-quartz-rib', placeId: 'lower-deepvein-echoing-shelf', action: 'mine', provenanceType: 'mineral',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Survey and lampwork mineral; not food.' },
        sinks: ['processInput', 'craftIngredient', 'trade', 'collectible'],
    }),
    'item-lower-deepvein-sump-clay': resource({
        id: 'item-lower-deepvein-sump-clay', name: 'Deepvein Sump Clay',
        tags: ['mineral', 'clay', 'ceramic', 'sealing', 'lower-deepvein'], valueGil: 8,
        sourceId: 'source-lower-deepvein-sump-clay-bank', placeId: 'deepvein-lower-decline', action: 'gather', provenanceType: 'mineral',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'Dense gallery clay used for small ceramics and seep packing; not food.' },
        sinks: ['processInput', 'craftIngredient', 'repair', 'trade'],
    }),
});

export function getLowerDeepveinResourceItem(itemId) {
    const entry = DEFINITIONS[String(itemId ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}

export function listLowerDeepveinResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, provenanceType, consumption, sinks }) {
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
            data: Object.freeze({ catalogVersion: LOWER_DEEPVEIN_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Lower Deepvein',
            notes: 'Canonical first-Deep-World resource with exact authored source and connected downstream use.',
        }),
    });
}
