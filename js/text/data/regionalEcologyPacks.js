import { createContentPack } from './contentPackSchema.js';
import {
    listRegionalEcologyFamilies,
    listRegionalGatheringSources,
    listRegionalPopulations,
    listRegionalSpecies,
} from './regionalEcologyExpansion.js';
import { listRegionalResourceItems } from './regionalResourceItems.js';
import { listHuntingResourceItems } from './huntingResourceItems.js';

export const REGIONAL_ECOLOGY_PACK_DATA_VERSION = 27;

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

export const REGIONAL_ECOLOGY_PACKS = Object.freeze([ELDERWOOD_ECOLOGY_PACK, REDSTONE_ECOLOGY_PACK, STARFEN_ECOLOGY_PACK]);

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
