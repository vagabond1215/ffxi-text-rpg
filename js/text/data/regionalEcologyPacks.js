import { createContentPack } from './contentPackSchema.js';
import {
    listRegionalEcologyFamilies,
    listRegionalGatheringSources,
    listRegionalPopulations,
    listRegionalSpecies,
} from './regionalEcologyExpansion.js';
import { listRegionalResourceItems } from './regionalResourceItems.js';
import { listHuntingResourceItems } from './huntingResourceItems.js';

export const REGIONAL_ECOLOGY_PACK_DATA_VERSION = 25;

export const ELDERWOOD_ECOLOGY_PACK = regionalPack({
    id: 'pack-elderwood-ecology-breadth', regionId: 'elderwood', steward: 'thornwall-west', dependencies: ['pack-elderwood-opening'],
    placeId: 'west-elderwood', ownsPlace: false,
    speciesIds: ['species-elderwood-barkboar', 'species-elderwood-lantern-moth'],
    populationIds: ['population-west-elderwood-barkboars', 'population-west-elderwood-lantern-moths'],
    sourceIds: ['source-west-elderwood-amber-resin-grove', 'source-west-elderwood-duskcap-ring'],
    itemIds: ['item-elderwood-amber-resin', 'item-elderwood-duskcap', 'item-elderwood-barkboar-hide'],
});

export const REDSTONE_ECOLOGY_PACK = regionalPack({
    id: 'pack-redstone-ecology-breadth', regionId: 'redstone-reach', steward: 'brasshaven-south', dependencies: ['pack-shared-foundation'],
    placeId: 'south-redstone-reach', ownsPlace: true,
    speciesIds: ['species-redstone-ridge-ibex', 'species-redstone-glass-shell'],
    populationIds: ['population-south-redstone-ridge-ibex', 'population-south-redstone-glass-shells'],
    sourceIds: ['source-south-redstone-iron-vein', 'source-south-redstone-sunstone-scree'],
    itemIds: ['item-redstone-iron-ore', 'item-redstone-sunstone-grit', 'item-redstone-ibex-hide'],
});

export const STARFEN_ECOLOGY_PACK = regionalPack({
    id: 'pack-starfen-ecology-breadth', regionId: 'starfen', steward: 'mistmere-west', dependencies: ['pack-starfen-opening'],
    placeId: 'west-starfen', ownsPlace: false,
    speciesIds: ['species-starfen-mire-heron', 'species-starfen-reed-eel'],
    populationIds: ['population-west-starfen-mire-herons', 'population-west-starfen-reed-eels'],
    sourceIds: ['source-west-starfen-bluekelp-pool', 'source-west-starfen-bogberry-brake'],
    itemIds: ['item-starfen-bluekelp', 'item-starfen-bogberry', 'item-starfen-heron-feather'],
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
