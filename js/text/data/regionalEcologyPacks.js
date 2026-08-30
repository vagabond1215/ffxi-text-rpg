import { createContentPack } from './contentPackSchema.js';
import {
    listRegionalEcologyFamilies,
    listRegionalGatheringSources,
    listRegionalPopulations,
    listRegionalSpecies,
} from './regionalEcologyExpansion.js';
import { listRegionalResourceItems } from './regionalResourceItems.js';
import { listHuntingResourceItems } from './huntingResourceItems.js';
import {
    listEmberwashEcologyFamilies,
    listEmberwashGatheringSources,
    listEmberwashPopulations,
    listEmberwashSpecies,
} from './emberwashEcology.js';
import { listEmberwashResourceItems } from './emberwashResourceItems.js';
import {
    listLowerDeepveinEcologyFamilies,
    listLowerDeepveinGatheringSources,
    listLowerDeepveinPopulations,
    listLowerDeepveinSpecies,
} from './lowerDeepveinEcology.js';
import { listLowerDeepveinResourceItems } from './lowerDeepveinResourceItems.js';
import {
    listGloamwoodEcologyFamilies,
    listGloamwoodGatheringSources,
    listGloamwoodPopulations,
    listGloamwoodSpecies,
} from './gloamwoodEcology.js';
import { listGloamwoodResourceItems } from './gloamwoodResourceItems.js';
import {
    listGreatMereEcologyFamilies,
    listGreatMereGatheringSources,
    listGreatMerePopulations,
    listGreatMereSpecies,
} from './greatMereEcology.js';
import { listGreatMereResourceItems } from './greatMereResourceItems.js';
import {
    listIronspineEcologyFamilies,
    listIronspineGatheringSources,
    listIronspinePopulations,
    listIronspineSpecies,
} from './ironspineEcology.js';
import { listIronspineResourceItems } from './ironspineResourceItems.js';
import {
    listHeadwaterEcologyFamilies,
    listHeadwaterGatheringSources,
    listHeadwaterPopulations,
    listHeadwaterSpecies,
} from './headwaterEcology.js';
import { listHeadwaterResourceItems } from './headwaterResourceItems.js';
import {
    listStarfenDeltaEcologyFamilies,
    listStarfenDeltaGatheringSources,
    listStarfenDeltaPopulations,
    listStarfenDeltaSpecies,
} from './starfenDeltaEcology.js';
import { listStarfenDeltaResourceItems } from './starfenDeltaResourceItems.js';

import { listWaymeetMarchesEcologyFamilies,listWaymeetMarchesGatheringSources,listWaymeetMarchesPopulations,listWaymeetMarchesSpecies } from './waymeetMarchesEcology.js';
import { listWaymeetMarchesResourceItems } from './waymeetMarchesResourceItems.js';

export const REGIONAL_ECOLOGY_PACK_DATA_VERSION = 38;

export const ELDERWOOD_ECOLOGY_PACK = regionalPack({
    id: 'pack-elderwood-ecology-breadth', regionId: 'elderwood', steward: 'thornwall-west', dependencies: ['pack-elderwood-opening'],
    placeId: 'west-elderwood', ownsPlace: false,
    speciesIds: [
        'species-elderwood-barkboar', 'species-elderwood-lantern-moth', 'species-elderwood-embercoat-fox',
        'species-timbercross-river-otter', 'species-elderwood-moss-owl', 'species-elderwood-amber-bee',
        'species-timbercross-moss-shell-turtle',
    ],
    populationIds: [
        'population-west-elderwood-barkboars', 'population-west-elderwood-lantern-moths',
        'population-east-elderwood-embercoat-foxes', 'population-timbercross-river-otters',
        'population-west-elderwood-moss-owls', 'population-east-elderwood-amber-bees',
        'population-timbercross-moss-shell-turtles',
    ],
    sourceIds: [
        'source-west-elderwood-amber-resin-grove', 'source-west-elderwood-duskcap-ring',
        'source-east-elderwood-hazel-coppice', 'source-east-elderwood-crabapple-thicket',
        'source-west-elderwood-ghost-orchid-hollow', 'source-west-elderwood-blackheart-windfall',
    ],
    itemIds: [
        'item-elderwood-amber-resin', 'item-elderwood-duskcap', 'item-elderwood-barkboar-hide',
        'item-elderwood-hazel-nut', 'item-elderwood-crabapple', 'item-elderwood-ghost-orchid',
        'item-elderwood-blackheart-heartwood',
    ],
});

export const REDSTONE_ECOLOGY_PACK = regionalPack({
    id: 'pack-redstone-ecology-breadth', regionId: 'redstone-reach', steward: 'brasshaven-south', dependencies: ['pack-redstone-opening'],
    placeId: 'south-redstone-reach', ownsPlace: true,
    speciesIds: [
        'species-redstone-ridge-ibex', 'species-redstone-glass-shell', 'species-redstone-crag-marmot',
        'species-redstone-sunscale-lizard', 'species-redstone-ironclaw-scorpion',
        'species-deepvein-glass-salamander', 'species-redstone-cliff-vulture',
    ],
    populationIds: [
        'population-south-redstone-ridge-ibex', 'population-south-redstone-glass-shells',
        'population-north-redstone-crag-marmots', 'population-south-redstone-sunscale-lizards',
        'population-south-redstone-ironclaw-scorpions', 'population-deepvein-glass-salamanders',
        'population-north-redstone-cliff-vultures',
    ],
    sourceIds: [
        'source-south-redstone-iron-vein', 'source-south-redstone-sunstone-scree',
        'source-north-redstone-ridge-millet-stand', 'source-south-redstone-rock-salt-pan',
        'source-south-redstone-sun-crocus-terrace', 'source-north-redstone-fire-opal-pocket',
    ],
    itemIds: [
        'item-redstone-iron-ore', 'item-redstone-sunstone-grit', 'item-redstone-ibex-hide',
        'item-redstone-ridge-millet', 'item-redstone-rock-salt', 'item-redstone-sun-crocus-stigma',
        'item-redstone-fire-opal',
    ],
});

export const STARFEN_ECOLOGY_PACK = regionalPack({
    id: 'pack-starfen-ecology-breadth', regionId: 'starfen', steward: 'mistmere-west', dependencies: ['pack-starfen-opening'],
    placeId: 'west-starfen', ownsPlace: false,
    speciesIds: [
        'species-starfen-mire-heron', 'species-starfen-reed-eel', 'species-starfen-bellfrog',
        'species-starfen-reed-crab', 'species-starfen-fen-duck', 'species-starfen-pearl-mussel',
        'species-archive-threadspider',
    ],
    populationIds: [
        'population-west-starfen-mire-herons', 'population-west-starfen-reed-eels',
        'population-east-starfen-bellfrogs', 'population-west-starfen-reed-crabs',
        'population-east-starfen-fen-ducks', 'population-west-starfen-pearl-mussels',
        'population-sunken-archive-threadspiders',
    ],
    sourceIds: [
        'source-west-starfen-bluekelp-pool', 'source-west-starfen-bogberry-brake',
        'source-east-starfen-reedgrain-shelf', 'source-west-starfen-fen-mussel-bed',
        'source-east-starfen-indigo-iris-patch', 'source-west-starfen-moonlotus-pool',
    ],
    itemIds: [
        'item-starfen-bluekelp', 'item-starfen-bogberry', 'item-starfen-heron-feather',
        'item-starfen-reedgrain', 'item-starfen-fen-mussel', 'item-starfen-indigo-iris-petal',
        'item-starfen-moonlotus-blossom',
    ],
});

export const COPPERGRASS_ECOLOGY_PACK = regionalPack({
    id: 'pack-coppergrass-steppe-ecology', regionId: 'coppergrass-steppe', steward: 'forge-mere-road',
    dependencies: ['pack-redstone-opening', 'pack-starfen-opening'],
    placeId: 'coppergrass-steppe', ownsPlace: true,
    speciesIds: [
        'species-coppergrass-dun-courser', 'species-coppergrass-slateback-wolf',
        'species-coppergrass-tallcrest-bustard', 'species-coppergrass-copperwing-locust',
        'species-coppergrass-stormglass-kite',
    ],
    populationIds: [
        'population-coppergrass-dun-coursers', 'population-coppergrass-slateback-wolves',
        'population-coppergrass-tallcrest-bustards', 'population-coppergrass-copperwing-locusts',
        'population-coppergrass-stormglass-kites',
    ],
    sourceIds: [
        'source-coppergrass-groundpea-patch', 'source-coppergrass-prairie-flax-stand',
        'source-coppergrass-crimson-madder-bed', 'source-coppergrass-windglass-gravel',
    ],
    itemIds: [
        'item-coppergrass-groundpea', 'item-coppergrass-prairie-flax',
        'item-coppergrass-crimson-madder', 'item-coppergrass-windglass-agate',
    ],
});

export const CROWNFIELDS_ECOLOGY_PACK = regionalPack({
    id: 'pack-crownfields-agricultural-ecology', regionId: 'crownfields', steward: 'thornwall-south-farms',
    dependencies: ['pack-elderwood-opening', 'pack-elderwood-ecology-breadth'],
    placeId: 'crownfields', ownsPlace: true,
    ownedFamilyIds: ['family-cattle', 'family-sheep', 'family-chicken', 'family-field-rat'],
    speciesIds: [
        'species-crownfields-cattle', 'species-crownfields-whitefleece-sheep',
        'species-crownfields-redcomb-hen', 'species-crownfields-hedgerow-rat',
        'species-crownfields-orchard-bee',
    ],
    populationIds: [
        'population-crownfields-cattle', 'population-crownfields-whitefleece-sheep',
        'population-crownfields-redcomb-hens', 'population-crownfields-hedgerow-rats',
        'population-crownfields-orchard-bees',
    ],
    sourceIds: [
        'source-crownfields-crown-rye-strip', 'source-crownfields-field-pea-row',
        'source-crownfields-flax-strip', 'source-crownfields-cider-apple-orchard',
        'source-crownfields-hay-meadow', 'source-crownfields-woad-bed',
    ],
    itemIds: [
        'item-crownfields-crown-rye', 'item-crownfields-field-pea',
        'item-crownfields-flax-straw', 'item-crownfields-cider-apple',
        'item-crownfields-meadow-hay', 'item-crownfields-dyers-woad',
    ],
});

export const SLATEWATER_ECOLOGY_PACK = regionalPack({
    id: 'pack-slatewater-foothills-ecology', regionId: 'slatewater-foothills', steward: 'crown-forge-road',
    dependencies: ['pack-elderwood-opening', 'pack-redstone-opening'],
    placeId: 'slatewater-foothills', ownsPlace: true,
    speciesIds: [
        'species-slatewater-greyback-bear', 'species-slatewater-scree-lynx',
        'species-slatewater-russet-grouse', 'species-slatewater-ridge-eagle',
    ],
    populationIds: [
        'population-slatewater-greyback-bears', 'population-slatewater-scree-lynxes',
        'population-slatewater-russet-grouse', 'population-slatewater-ridge-eagles',
    ],
    sourceIds: [
        'source-slatewater-serviceberry-brake', 'source-slatewater-pitch-pine-stand',
        'source-slatewater-white-clay-bank', 'source-slatewater-mountain-thyme-slope',
        'source-slatewater-silver-lichen-face', 'source-slatewater-blue-slate-shelf',
    ],
    itemIds: [
        'item-slatewater-serviceberry', 'item-slatewater-pitch-pine-resin',
        'item-slatewater-white-clay', 'item-slatewater-mountain-thyme',
        'item-slatewater-silver-lichen', 'item-slatewater-blue-slate',
    ],
});

export const GREAT_MERE_ECOLOGY_PACK = createContentPack({
    id: 'pack-great-mere-freshwater-ecology',
    dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['great-mere'], steward: 'mistmere-merewatch' },
    dependencies: ['pack-starfen-opening', 'pack-starfen-ecology-breadth', 'pack-elderwood-ecology-breadth'],
    metadata: {
        name: 'Great Mere Freshwater Ecology',
        notes: 'Freshwater lake ecology for the Great Mere shore and Reedcrown Isle. Reuses canonical turtle and freshwater-mussel families through declared dependencies while owning new lake fish, crayfish, grebe, and dragonfly families.',
    },
    records: {
        places: [
            { id: 'great-mere-westshore', catalogRef: true },
            { id: 'reedcrown-isle', catalogRef: true },
        ],
        ecologyFamilies: listGreatMereEcologyFamilies().map((entry) => ({ id: entry.id, catalogRef: true })),
        species: listGreatMereSpecies().map((entry) => ({ id: entry.id, catalogRef: true })),
        populations: listGreatMerePopulations().map((entry) => ({ id: entry.id, catalogRef: true })),
        gatheringSources: listGreatMereGatheringSources().map((entry) => ({ id: entry.id, catalogRef: true })),
        items: listGreatMereResourceItems().map((entry) => ({ id: entry.id, catalogRef: true })),
    },
});

export const IRONSPINE_ECOLOGY_PACK = createContentPack({
    id: 'pack-ironspine-highlands-ecology',
    dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['ironspine-highlands'], steward: 'brasshaven-high-pass' },
    dependencies: ['pack-redstone-opening', 'pack-redstone-ecology-breadth', 'pack-slatewater-foothills-ecology'],
    metadata: {
        name: 'Ironspine Highlands Ecology',
        notes: 'Alpine/subalpine ecology using existing regional animal families, population-backed hunting for game and predators, six gathering sources, and exact highland resource provenance.',
    },
    records: {
        places: [
            { id: 'ironspine-lower-pass', catalogRef: true },
            { id: 'ironspine-high-meadow', catalogRef: true },
        ],
        ecologyFamilies: listIronspineEcologyFamilies().map((entry) => ({ id: entry.id, catalogRef: true })),
        species: listIronspineSpecies().map((entry) => ({ id: entry.id, catalogRef: true })),
        populations: listIronspinePopulations().map((entry) => ({ id: entry.id, catalogRef: true })),
        gatheringSources: listIronspineGatheringSources().map((entry) => ({ id: entry.id, catalogRef: true })),
        items: listIronspineResourceItems().map((entry) => ({ id: entry.id, catalogRef: true })),
    },
});

export const HEADWATER_VALE_ECOLOGY_PACK = createContentPack({
    id: 'pack-headwater-vale-ecology',
    dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['headwater-vale'], steward: 'thornwall-headwater-wardens' },
    dependencies: ['pack-elderwood-opening', 'pack-elderwood-ecology-breadth'],
    metadata: {
        name: 'Headwater Vale Ecology',
        notes: 'Cool river-valley ecology with red deer hunting, coldstream fishing, riverine forest species, six exact-provenance gathering sources, and no forced aggression for passive wildlife.',
    },
    records: {
        places: [
            { id: 'headwater-lower-vale', catalogRef: true },
            { id: 'headwater-upper-vale', catalogRef: true },
        ],
        ecologyFamilies: listHeadwaterEcologyFamilies().map((entry) => ({ id: entry.id, catalogRef: true })),
        species: listHeadwaterSpecies().map((entry) => ({ id: entry.id, catalogRef: true })),
        populations: listHeadwaterPopulations().map((entry) => ({ id: entry.id, catalogRef: true })),
        gatheringSources: listHeadwaterGatheringSources().map((entry) => ({ id: entry.id, catalogRef: true })),
        items: listHeadwaterResourceItems().map((entry) => ({ id: entry.id, catalogRef: true })),
    },
});

export const EMBERWASH_ECOLOGY_PACK = createContentPack({
    id: 'pack-emberwash-badlands-ecology',
    dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['emberwash-badlands'], steward: 'brasshaven-cinderwell' },
    dependencies: ['pack-redstone-opening', 'pack-redstone-ecology-breadth'],
    metadata: {
        name: 'Emberwash Badlands Ecology',
        notes: 'Northern arid-frontier ecology with eight passive, wary, or naturally territorial species, seven exact-provenance sources, and no manufactured hostile encounter templates.',
    },
    records: {
        places: [
            { id: 'emberwash-north-wash', catalogRef: true },
            { id: 'emberwash-saltpan-verge', catalogRef: true },
        ],
        ecologyFamilies: listEmberwashEcologyFamilies().map((entry) => ({ id: entry.id, catalogRef: true })),
        species: listEmberwashSpecies().map((entry) => ({ id: entry.id, catalogRef: true })),
        populations: listEmberwashPopulations().map((entry) => ({ id: entry.id, catalogRef: true })),
        gatheringSources: listEmberwashGatheringSources().map((entry) => ({ id: entry.id, catalogRef: true })),
        items: listEmberwashResourceItems().map((entry) => ({ id: entry.id, catalogRef: true })),
    },
});


export const LOWER_DEEPVEIN_ECOLOGY_PACK = createContentPack({
    id: 'pack-lower-deepvein-ecology',
    dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['lower-deepvein'], steward: 'brasshaven-lantern-sump' },
    dependencies: ['pack-shared-foundation', 'pack-redstone-opening', 'pack-redstone-ecology-breadth', 'pack-starfen-ecology-breadth', 'pack-elderwood-ecology-breadth'],
    metadata: {
        name: 'Lower Deepvein Ecology',
        notes: 'First Deep World frontier ecology with eight passive or naturally territorial cave species, seven exact-provenance sources, reused regional cave families through explicit dependencies, and no manufactured hostile encounter templates.',
    },
    records: {
        places: [
            { id: 'deepvein-lower-decline', catalogRef: true },
            { id: 'lower-deepvein-echoing-shelf', catalogRef: true },
        ],
        ecologyFamilies: listLowerDeepveinEcologyFamilies().map((entry) => ({ id: entry.id, catalogRef: true })),
        species: listLowerDeepveinSpecies().map((entry) => ({ id: entry.id, catalogRef: true })),
        populations: listLowerDeepveinPopulations().map((entry) => ({ id: entry.id, catalogRef: true })),
        gatheringSources: listLowerDeepveinGatheringSources().map((entry) => ({ id: entry.id, catalogRef: true })),
        items: listLowerDeepveinResourceItems().map((entry) => ({ id: entry.id, catalogRef: true })),
    },
});

export const GLOAMWOOD_ECOLOGY_PACK = createContentPack({
    id: 'pack-gloamwood-oldgrowth-ecology',
    dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['gloamwood'], steward: 'oldbough-foresters' },
    dependencies: ['pack-elderwood-opening', 'pack-elderwood-ecology-breadth'],
    metadata: {
        name: 'Gloamwood Old-Growth Ecology',
        notes: 'Wet old-growth barrier ecology with eight passive, wary, or naturally territorial species, seven exact-provenance sources, and no new hunting/body-recovery authority.',
    },
    records: {
        places: [
            { id: 'gloamwood-verge', catalogRef: true },
            { id: 'gloamwood-deep', catalogRef: true },
        ],
        ecologyFamilies: listGloamwoodEcologyFamilies().map((entry) => ({ id: entry.id, catalogRef: true })),
        species: listGloamwoodSpecies().map((entry) => ({ id: entry.id, catalogRef: true })),
        populations: listGloamwoodPopulations().map((entry) => ({ id: entry.id, catalogRef: true })),
        gatheringSources: listGloamwoodGatheringSources().map((entry) => ({ id: entry.id, catalogRef: true })),
        items: listGloamwoodResourceItems().map((entry) => ({ id: entry.id, catalogRef: true })),
    },
});

export const STARFEN_DELTA_ECOLOGY_PACK = createContentPack({
    id: 'pack-starfen-delta-brackish-ecology',
    dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['starfen-delta'], steward: 'mistmere-tideglass' },
    dependencies: ['pack-starfen-ecology-breadth', 'pack-great-mere-freshwater-ecology'],
    metadata: {
        name: 'Starfen Delta & Brackish Coast Ecology',
        notes: 'Freshwater-to-brackish transition ecology with eight coastal species, seven exact-provenance sources, and no forced encounter templates for ordinary wildlife.',
    },
    records: {
        places: [
            { id: 'starfen-lower-delta', catalogRef: true },
            { id: 'starfen-brackish-coast', catalogRef: true },
        ],
        ecologyFamilies: listStarfenDeltaEcologyFamilies().map((entry) => ({ id: entry.id, catalogRef: true })),
        species: listStarfenDeltaSpecies().map((entry) => ({ id: entry.id, catalogRef: true })),
        populations: listStarfenDeltaPopulations().map((entry) => ({ id: entry.id, catalogRef: true })),
        gatheringSources: listStarfenDeltaGatheringSources().map((entry) => ({ id: entry.id, catalogRef: true })),
        items: listStarfenDeltaResourceItems().map((entry) => ({ id: entry.id, catalogRef: true })),
    },
});

export const WAYMEET_MARCHES_ECOLOGY_PACK=createContentPack({
 id:'pack-waymeet-marches-ecology',dataVersion:REGIONAL_ECOLOGY_PACK_DATA_VERSION,ownership:{scope:'region',regionIds:['waymeet-marches'],steward:'cairnward-route-wardens'},
 dependencies:['pack-headwater-vale-ecology','pack-elderwood-ecology-breadth','pack-redstone-ecology-breadth','pack-slatewater-foothills-ecology','pack-starfen-ecology-breadth'],
 metadata:{name:'Waymeet Marches Plateau Ecology',notes:'Cool central-plateau ecology with eight passive, wary, or naturally territorial populations, one new cold-burn fish family, seven exact-provenance sources, and reused established families without manufactured hostile encounters.'},
 records:{places:[{id:'windscar-saddle',catalogRef:true},{id:'waymeet-south-marches',catalogRef:true}],ecologyFamilies:listWaymeetMarchesEcologyFamilies().map(e=>({id:e.id,catalogRef:true})),species:listWaymeetMarchesSpecies().map(e=>({id:e.id,catalogRef:true})),populations:listWaymeetMarchesPopulations().map(e=>({id:e.id,catalogRef:true})),gatheringSources:listWaymeetMarchesGatheringSources().map(e=>({id:e.id,catalogRef:true})),items:listWaymeetMarchesResourceItems().map(e=>({id:e.id,catalogRef:true}))}
});

export const REGIONAL_ECOLOGY_PACKS = Object.freeze([ELDERWOOD_ECOLOGY_PACK, REDSTONE_ECOLOGY_PACK, STARFEN_ECOLOGY_PACK, COPPERGRASS_ECOLOGY_PACK, CROWNFIELDS_ECOLOGY_PACK, SLATEWATER_ECOLOGY_PACK, GREAT_MERE_ECOLOGY_PACK, IRONSPINE_ECOLOGY_PACK, HEADWATER_VALE_ECOLOGY_PACK, EMBERWASH_ECOLOGY_PACK, LOWER_DEEPVEIN_ECOLOGY_PACK, GLOAMWOOD_ECOLOGY_PACK, STARFEN_DELTA_ECOLOGY_PACK, WAYMEET_MARCHES_ECOLOGY_PACK]);

function regionalPack({ id, regionId, steward, dependencies, placeId, ownsPlace, ownedFamilyIds = null, speciesIds, populationIds, sourceIds, itemIds }) {
    const species = listRegionalSpecies().filter((entry) => speciesIds.includes(entry.id));
    const familyIds = new Set(ownedFamilyIds ?? species.map((entry) => entry.familyId));
    const families = listRegionalEcologyFamilies().filter((entry) => familyIds.has(entry.id));
    const populations = listRegionalPopulations().filter((entry) => populationIds.includes(entry.id));
    const sources = listRegionalGatheringSources().filter((entry) => sourceIds.includes(entry.id));
    const resources = [...listRegionalResourceItems(), ...listHuntingResourceItems()].filter((entry) => itemIds.includes(entry.id));
    return createContentPack({
        id,
        dataVersion: REGIONAL_ECOLOGY_PACK_DATA_VERSION,
        ownership: { scope: 'region', regionIds: [regionId], steward },
        dependencies,
        metadata: { name: `${regionId} ecology breadth`, notes: 'Original regional ecology/resource breadth tied to canonical timed gathering, hunting recovery, production, and provenance loops.' },
        records: {
            places: ownsPlace ? [{ id: placeId, catalogRef: true }] : [],
            ecologyFamilies: families,
            species,
            populations,
            gatheringSources: sources,
            items: resources,
        },
    });
}
