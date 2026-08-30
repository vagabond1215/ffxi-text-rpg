import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const ELDERWOOD_REPAIR_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-elderwood-wood-sorrel': resource({
        id: 'item-elderwood-wood-sorrel', name: 'Elderwood Wood Sorrel',
        tags: ['flora','leafy-green','food','herb','understory','elderwood'], valueGil: 6,
        sourceId: 'source-east-elderwood-wood-sorrel-bank', placeId: 'east-elderwood', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['rinse'], notes: 'Fresh clean leaves are eaten as a tart trail herb or chopped into cooked food; they are gathered as a seasoning green rather than a bulk staple.' },
        sinks: ['consume','processInput','craftIngredient','trade'],
    }),
    'item-elderwood-wayleaf': resource({
        id: 'item-elderwood-wayleaf', name: 'Elderwood Wayleaf',
        tags: ['flora','herb','medicine','alchemical','understory','elderwood'], valueGil: 9,
        sourceId: 'source-east-elderwood-wayleaf-patch', placeId: 'east-elderwood', action: 'forage', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-elderwood-bluebell-petal': resource({
        id: 'item-elderwood-bluebell-petal', name: 'Elderwood Bluebell Petals',
        tags: ['flora','flower','dye','aromatic','decorative','elderwood'], valueGil: 8,
        sourceId: 'source-east-elderwood-bluebell-glade', placeId: 'east-elderwood', action: 'forage', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','decorative','trade'],
    }),
    'item-timbercross-river-mint': resource({
        id: 'item-timbercross-river-mint', name: 'Timbercross River Mint',
        tags: ['flora','herb','food','aromatic','medicine','riparian','elderwood'], valueGil: 7,
        sourceId: 'source-timbercross-river-mint-bank', placeId: 'timbercross-landing', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['rinse'], notes: 'Clean mint leaves may be chewed or used directly as a culinary herb; most are steeped or cooked.' },
        sinks: ['consume','processInput','craftIngredient','trade'],
    }),
    'item-timbercross-willowherb': resource({
        id: 'item-timbercross-willowherb', name: 'Timbercross Willowherb',
        tags: ['flora','herb','medicine','alchemical','riparian','elderwood'], valueGil: 9,
        sourceId: 'source-timbercross-willowherb-bank', placeId: 'timbercross-landing', action: 'forage', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-timbercross-sedge-fiber': resource({
        id: 'item-timbercross-sedge-fiber', name: 'Timbercross Sedge Fiber',
        tags: ['flora','fiber','sedge','matting','bankwork','riparian','elderwood'], valueGil: 7,
        sourceId: 'source-timbercross-sedge-stand', placeId: 'timbercross-landing', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','construction','repair','trade'],
    }),
    'item-timbercross-river-currant': resource({
        id: 'item-timbercross-river-currant', name: 'Timbercross River Currants',
        tags: ['flora','berry','fruit','food','preserve','riparian','elderwood'], valueGil: 7,
        sourceId: 'source-timbercross-river-currant-brake', placeId: 'timbercross-landing', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'direct', hazard: 'none', preparation: ['rinse'], notes: 'Ripe sound currants are safe to eat fresh after ordinary cleaning and are commonly cooked into preserves.' },
        sinks: ['consume','processInput','craftIngredient','trade'],
    }),
    'item-timbercross-bronze-dace': resource({
        id: 'item-timbercross-bronze-dace', name: 'Timbercross Bronze Dace',
        tags: ['fish','food','freshwater','river','protein','elderwood'], valueGil: 13,
        sourceId: 'source-timbercross-bronze-dace-run', placeId: 'timbercross-landing', action: 'fish', provenanceType: 'fishing',
        consumption: { mode: 'processRequired', hazard: 'pathogenRisk', preparation: ['clean','cook-or-smoke'], notes: 'Fresh river dace should be gutted, cleaned, and thoroughly cooked or properly smoked before eating.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
    'item-thornwall-cistern-moss': resource({
        id: 'item-thornwall-cistern-moss', name: 'Thornwall Cistern Moss',
        tags: ['flora','moss','absorbent','alchemical','ruin','elderwood'], valueGil: 6,
        sourceId: 'source-thornwall-old-gaol-cistern-moss', placeId: 'thornwall-old-gaol', action: 'gather', provenanceType: 'flora',
        sinks: ['processInput','craftIngredient','repair','trade'],
    }),
    'item-thornwall-gaol-shelf-fungus': resource({
        id: 'item-thornwall-gaol-shelf-fungus', name: 'Gaol Shelf Fungus',
        tags: ['flora','fungus','tinder','dye','ruin','elderwood'], valueGil: 7,
        sourceId: 'source-thornwall-old-gaol-shelf-fungus', placeId: 'thornwall-old-gaol', action: 'forage', provenanceType: 'flora',
        consumption: { mode: 'nonFood', hazard: 'none', preparation: [], notes: 'A leathery cellar fungus gathered for tinder and pigment work, not for eating.' },
        sinks: ['processInput','craftIngredient','trade'],
    }),
});

export function getElderwoodRepairResourceItem(id) {
    const entry = DEFINITIONS[String(id ?? '').trim()] ?? null;
    return entry ? normalizeItem(entry) : null;
}
export function listElderwoodRepairResourceItems() {
    return Object.values(DEFINITIONS).map((entry) => normalizeItem(entry));
}

function resource({ id, name, tags, valueGil, sourceId, placeId, action, provenanceType, consumption = null, sinks }) {
    return Object.freeze({
        id, name, kind: ITEM_KINDS.MATERIAL, quantity: 1, maxStack: 99, valueGil,
        tags: Object.freeze([...tags]), consumption,
        provenance: Object.freeze([Object.freeze({
            type: provenanceType, sourceId, placeId, action,
            data: Object.freeze({ catalogVersion: ELDERWOOD_REPAIR_RESOURCE_ITEM_CATALOG_VERSION }),
        })]),
        sinks: Object.freeze(sinks.map((type) => Object.freeze({ type, data: Object.freeze({}) }))),
        metadata: Object.freeze({
            confidence: 'intentionalSimplification',
            source: 'Hearth & Horizon Legacy Elderwood ecology repair',
            notes: 'Canonical Elderwood repair resource with exact place/source/action provenance and an intentional production or use sink.',
        }),
    });
}
