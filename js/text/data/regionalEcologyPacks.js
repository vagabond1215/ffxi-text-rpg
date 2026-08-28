import { createContentPack } from './contentPackSchema.js';
import {
    listRegionalEcologyFamilies,
    listRegionalGatheringSources,
    listRegionalPopulations,
    listRegionalSpecies,
} from './regionalEcologyExpansion.js';
import { listRegionalResourceItems } from './regionalResourceItems.js';
import { listHuntingResourceItems } from './huntingResourceItems.js';

export const REGIONAL_ECOLOGY_PACK_DATA_VERSION = 30;

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
    dependencies: ['pack-elderwood-opening'],
    placeId: 'crownfields', ownsPlace: true,
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

export const REGIONAL_ECOLOGY_PACKS = Object.freeze([ELDERWOOD_ECOLOGY_PACK, REDSTONE_ECOLOGY_PACK, STARFEN_ECOLOGY_PACK, COPPERGRASS_ECOLOGY_PACK, CROWNFIELDS_ECOLOGY_PACK, SLATEWATER_ECOLOGY_PACK]);

function regionalPack({ id, regionId, steward, dependencies, placeId, ownsPlace, speciesIds, populationIds, sourceIds, itemIds }) {
    const species = listRegionalSpecies().filter((entry) => speciesIds.includes(entry.id));
    const familyIds = new Set(species.map((entry) => entry.familyId));
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
