import {
    getAbility,
    getSpellSchool,
    validateAbilityCatalog,
} from './abilities.js';
import {
    getCapability,
    validateCapabilityCatalog,
} from './capabilities.js';
import {
    getCommitmentDefinition,
    validateCommitmentCatalog,
} from './commitments.js';
import {
    getCompanionDefinition,
    validateCompanionCatalog,
} from './companions.js';
import {
    getCanonicalEcologyFamily,
    getCanonicalGatheringSource,
    getCanonicalPopulation,
    getCanonicalSpecies,
    validateEcologyRegistry,
} from './ecologyRegistry.js';
import {
    getNpcScheduleById,
    validateNpcScheduleCatalog,
} from './npcSchedules.js';
import { getPlace } from './places.js';
import {
    getProductionDefinition,
    validateProductionCatalog,
} from './productionCatalog.js';
import { validateProductionItemCatalog } from './productionItems.js';
import { validateResourceItemRegistry } from './resourceItemRegistry.js';
import { getCanonicalItem, validateCanonicalItemRegistry } from './canonicalItemRegistry.js';
import {
    getRoute,
    getTransportService,
    validateRouteCatalog,
} from './routeCatalog.js';
import { createSeedNpcs } from './seedEntities.js';

export const CONTENT_CATALOG_REGISTRY_VERSION = 1;

const SEED_NPC_INDEX = new Map(createSeedNpcs().map((entry) => [entry.id, entry]));

const CONTENT_CATALOG_RESOLVERS = Object.freeze({
    places: getPlace,
    routes: getRoute,
    transportServices: getTransportService,
    ecologyFamilies: getCanonicalEcologyFamily,
    species: getCanonicalSpecies,
    populations: getCanonicalPopulation,
    gatheringSources: getCanonicalGatheringSource,
    items: getCanonicalItem,
    recipes: getProductionDefinition,
    quests: getCommitmentDefinition,
    npcs: (npcId) => SEED_NPC_INDEX.get(String(npcId ?? '').trim()) ?? null,
    spellSchools: getSpellSchool,
    capabilities: getCapability,
    abilities: getAbility,
    npcSchedules: getNpcScheduleById,
    companions: getCompanionDefinition,
});

const CONNECTED_CATALOG_VALIDATORS = Object.freeze([
    ['routeCatalog', validateRouteCatalog],
    ['ecologyRegistry', validateEcologyRegistry],
    ['resourceItemRegistry', validateResourceItemRegistry],
    ['canonicalItemRegistry', validateCanonicalItemRegistry],
    ['productionCatalog', validateProductionCatalog],
    ['productionItems', validateProductionItemCatalog],
    ['commitmentCatalog', validateCommitmentCatalog],
    ['capabilityCatalog', validateCapabilityCatalog],
    ['abilityCatalog', validateAbilityCatalog],
    ['npcScheduleCatalog', validateNpcScheduleCatalog],
    ['companionCatalog', validateCompanionCatalog],
]);

export function hasContentCatalogResolver(collection) {
    return typeof CONTENT_CATALOG_RESOLVERS[String(collection ?? '')] === 'function';
}

export function getContentCatalogEntry(collection, recordId) {
    const resolver = CONTENT_CATALOG_RESOLVERS[String(collection ?? '')];
    return typeof resolver === 'function' ? resolver(recordId) : null;
}

export function listContentCatalogResolverCollections() {
    return Object.keys(CONTENT_CATALOG_RESOLVERS);
}

export function validateConnectedContentCatalogs() {
    const issues = [];
    for (const [catalogId, validate] of CONNECTED_CATALOG_VALIDATORS) {
        for (const issue of validate()) issues.push(`[${catalogId}] ${issue}`);
    }
    return issues;
}

