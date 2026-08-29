import {
    getEcologyFamily,
    getGatheringSource,
    getPopulation,
    getSpecies,
    listEcologyFamilies,
    listGatheringSources,
    listPopulations,
    listSpecies,
    validateEcologyCatalog,
} from './ecologyCatalog.js';
import {
    getEmberwashEcologyFamily,
    getEmberwashGatheringSource,
    getEmberwashPopulation,
    getEmberwashSpecies,
    listEmberwashEcologyFamilies,
    listEmberwashGatheringSources,
    listEmberwashPopulations,
    listEmberwashSpecies,
    validateEmberwashEcology,
} from './emberwashEcology.js';
import {
    getGreatMereEcologyFamily,
    getGreatMereGatheringSource,
    getGreatMerePopulation,
    getGreatMereSpecies,
    listGreatMereEcologyFamilies,
    listGreatMereGatheringSources,
    listGreatMerePopulations,
    listGreatMereSpecies,
    validateGreatMereEcology,
} from './greatMereEcology.js';
import {
    getGloamwoodEcologyFamily,
    getGloamwoodGatheringSource,
    getGloamwoodPopulation,
    getGloamwoodSpecies,
    listGloamwoodEcologyFamilies,
    listGloamwoodGatheringSources,
    listGloamwoodPopulations,
    listGloamwoodSpecies,
    validateGloamwoodEcology,
} from './gloamwoodEcology.js';
import {
    getHeadwaterEcologyFamily,
    getHeadwaterGatheringSource,
    getHeadwaterPopulation,
    getHeadwaterSpecies,
    listHeadwaterEcologyFamilies,
    listHeadwaterGatheringSources,
    listHeadwaterPopulations,
    listHeadwaterSpecies,
    validateHeadwaterEcology,
} from './headwaterEcology.js';
import {
    getStarfenDeltaEcologyFamily,
    getStarfenDeltaGatheringSource,
    getStarfenDeltaPopulation,
    getStarfenDeltaSpecies,
    listStarfenDeltaEcologyFamilies,
    listStarfenDeltaGatheringSources,
    listStarfenDeltaPopulations,
    listStarfenDeltaSpecies,
    validateStarfenDeltaEcology,
} from './starfenDeltaEcology.js';
import {
    getIronspineEcologyFamily,
    getIronspineGatheringSource,
    getIronspinePopulation,
    getIronspineSpecies,
    listIronspineEcologyFamilies,
    listIronspineGatheringSources,
    listIronspinePopulations,
    listIronspineSpecies,
    validateIronspineEcology,
} from './ironspineEcology.js';
import {
    getMaterialFoundationGatheringSource,
    listMaterialFoundationGatheringSources,
    validateMaterialFoundationSources,
} from './materialFoundationSources.js';
import {
    getRegionalEcologyFamily,
    getRegionalGatheringSource,
    getRegionalPopulation,
    getRegionalSpecies,
    listRegionalEcologyFamilies,
    listRegionalGatheringSources,
    listRegionalPopulations,
    listRegionalSpecies,
    validateRegionalEcologyExpansion,
} from './regionalEcologyExpansion.js';

export const ECOLOGY_REGISTRY_VERSION = 9;

export function getCanonicalEcologyFamily(id) { return getEcologyFamily(id) ?? getRegionalEcologyFamily(id) ?? getEmberwashEcologyFamily(id) ?? getGreatMereEcologyFamily(id) ?? getIronspineEcologyFamily(id) ?? getHeadwaterEcologyFamily(id) ?? getStarfenDeltaEcologyFamily(id) ?? getGloamwoodEcologyFamily(id); }
export function getCanonicalSpecies(id) { return getSpecies(id) ?? getRegionalSpecies(id) ?? getEmberwashSpecies(id) ?? getGreatMereSpecies(id) ?? getIronspineSpecies(id) ?? getHeadwaterSpecies(id) ?? getStarfenDeltaSpecies(id) ?? getGloamwoodSpecies(id); }
export function getCanonicalPopulation(id) { return getPopulation(id) ?? getRegionalPopulation(id) ?? getEmberwashPopulation(id) ?? getGreatMerePopulation(id) ?? getIronspinePopulation(id) ?? getHeadwaterPopulation(id) ?? getStarfenDeltaPopulation(id) ?? getGloamwoodPopulation(id); }
export function getCanonicalGatheringSource(id) { return getGatheringSource(id) ?? getRegionalGatheringSource(id) ?? getEmberwashGatheringSource(id) ?? getGreatMereGatheringSource(id) ?? getIronspineGatheringSource(id) ?? getHeadwaterGatheringSource(id) ?? getStarfenDeltaGatheringSource(id) ?? getGloamwoodGatheringSource(id) ?? getMaterialFoundationGatheringSource(id); }

export function listCanonicalEcologyFamilies() { return unique([...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listEmberwashEcologyFamilies(), ...listGreatMereEcologyFamilies(), ...listIronspineEcologyFamilies(), ...listHeadwaterEcologyFamilies(), ...listStarfenDeltaEcologyFamilies(), ...listGloamwoodEcologyFamilies()]); }
export function listCanonicalSpecies() { return unique([...listSpecies(), ...listRegionalSpecies(), ...listEmberwashSpecies(), ...listGreatMereSpecies(), ...listIronspineSpecies(), ...listHeadwaterSpecies(), ...listStarfenDeltaSpecies(), ...listGloamwoodSpecies()]); }
export function listCanonicalPopulations() { return unique([...listPopulations(), ...listRegionalPopulations(), ...listEmberwashPopulations(), ...listGreatMerePopulations(), ...listIronspinePopulations(), ...listHeadwaterPopulations(), ...listStarfenDeltaPopulations(), ...listGloamwoodPopulations()]); }
export function listCanonicalGatheringSources() { return unique([...listGatheringSources(), ...listRegionalGatheringSources(), ...listEmberwashGatheringSources(), ...listGreatMereGatheringSources(), ...listIronspineGatheringSources(), ...listHeadwaterGatheringSources(), ...listStarfenDeltaGatheringSources(), ...listGloamwoodGatheringSources(), ...listMaterialFoundationGatheringSources()]); }

export function validateEcologyRegistry() {
    const issues = [
        ...validateEcologyCatalog().map((issue) => `[foundation] ${issue}`),
        ...validateRegionalEcologyExpansion().map((issue) => `[regional] ${issue}`),
        ...validateEmberwashEcology().map((issue) => `[emberwash] ${issue}`),
        ...validateGreatMereEcology().map((issue) => `[greatMere] ${issue}`),
        ...validateIronspineEcology().map((issue) => `[ironspine] ${issue}`),
        ...validateHeadwaterEcology().map((issue) => `[headwater] ${issue}`),
        ...validateStarfenDeltaEcology().map((issue) => `[starfenDelta] ${issue}`),
        ...validateGloamwoodEcology().map((issue) => `[gloamwood] ${issue}`),
        ...validateMaterialFoundationSources().map((issue) => `[materialFoundation] ${issue}`),
    ];
    const collections = [
        ['family', [...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listEmberwashEcologyFamilies(), ...listGreatMereEcologyFamilies(), ...listIronspineEcologyFamilies(), ...listHeadwaterEcologyFamilies(), ...listStarfenDeltaEcologyFamilies(), ...listGloamwoodEcologyFamilies()]],
        ['species', [...listSpecies(), ...listRegionalSpecies(), ...listEmberwashSpecies(), ...listGreatMereSpecies(), ...listIronspineSpecies(), ...listHeadwaterSpecies(), ...listStarfenDeltaSpecies(), ...listGloamwoodSpecies()]],
        ['population', [...listPopulations(), ...listRegionalPopulations(), ...listEmberwashPopulations(), ...listGreatMerePopulations(), ...listIronspinePopulations(), ...listHeadwaterPopulations(), ...listStarfenDeltaPopulations(), ...listGloamwoodPopulations()]],
        ['source', [...listGatheringSources(), ...listRegionalGatheringSources(), ...listEmberwashGatheringSources(), ...listGreatMereGatheringSources(), ...listIronspineGatheringSources(), ...listHeadwaterGatheringSources(), ...listStarfenDeltaGatheringSources(), ...listGloamwoodGatheringSources(), ...listMaterialFoundationGatheringSources()]],
    ];
    for (const [label, records] of collections) {
        const ids = new Set();
        for (const record of records) {
            if (ids.has(record.id)) issues.push(`Duplicate canonical ${label} id ${record.id}.`);
            ids.add(record.id);
        }
    }
    return issues;
}

function unique(records) {
    const seen = new Set();
    return records.filter((record) => {
        if (seen.has(record.id)) return false;
        seen.add(record.id);
        return true;
    });
}
