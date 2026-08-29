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

export const ECOLOGY_REGISTRY_VERSION = 7;

export function getCanonicalEcologyFamily(id) { return getEcologyFamily(id) ?? getRegionalEcologyFamily(id) ?? getGreatMereEcologyFamily(id) ?? getIronspineEcologyFamily(id) ?? getHeadwaterEcologyFamily(id) ?? getStarfenDeltaEcologyFamily(id); }
export function getCanonicalSpecies(id) { return getSpecies(id) ?? getRegionalSpecies(id) ?? getGreatMereSpecies(id) ?? getIronspineSpecies(id) ?? getHeadwaterSpecies(id) ?? getStarfenDeltaSpecies(id); }
export function getCanonicalPopulation(id) { return getPopulation(id) ?? getRegionalPopulation(id) ?? getGreatMerePopulation(id) ?? getIronspinePopulation(id) ?? getHeadwaterPopulation(id) ?? getStarfenDeltaPopulation(id); }
export function getCanonicalGatheringSource(id) { return getGatheringSource(id) ?? getRegionalGatheringSource(id) ?? getGreatMereGatheringSource(id) ?? getIronspineGatheringSource(id) ?? getHeadwaterGatheringSource(id) ?? getStarfenDeltaGatheringSource(id) ?? getMaterialFoundationGatheringSource(id); }

export function listCanonicalEcologyFamilies() { return unique([...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listGreatMereEcologyFamilies(), ...listIronspineEcologyFamilies(), ...listHeadwaterEcologyFamilies(), ...listStarfenDeltaEcologyFamilies()]); }
export function listCanonicalSpecies() { return unique([...listSpecies(), ...listRegionalSpecies(), ...listGreatMereSpecies(), ...listIronspineSpecies(), ...listHeadwaterSpecies(), ...listStarfenDeltaSpecies()]); }
export function listCanonicalPopulations() { return unique([...listPopulations(), ...listRegionalPopulations(), ...listGreatMerePopulations(), ...listIronspinePopulations(), ...listHeadwaterPopulations(), ...listStarfenDeltaPopulations()]); }
export function listCanonicalGatheringSources() { return unique([...listGatheringSources(), ...listRegionalGatheringSources(), ...listGreatMereGatheringSources(), ...listIronspineGatheringSources(), ...listHeadwaterGatheringSources(), ...listStarfenDeltaGatheringSources(), ...listMaterialFoundationGatheringSources()]); }

export function validateEcologyRegistry() {
    const issues = [
        ...validateEcologyCatalog().map((issue) => `[foundation] ${issue}`),
        ...validateRegionalEcologyExpansion().map((issue) => `[regional] ${issue}`),
        ...validateGreatMereEcology().map((issue) => `[greatMere] ${issue}`),
        ...validateIronspineEcology().map((issue) => `[ironspine] ${issue}`),
        ...validateHeadwaterEcology().map((issue) => `[headwater] ${issue}`),
        ...validateStarfenDeltaEcology().map((issue) => `[starfenDelta] ${issue}`),
        ...validateMaterialFoundationSources().map((issue) => `[materialFoundation] ${issue}`),
    ];
    const collections = [
        ['family', [...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listGreatMereEcologyFamilies(), ...listIronspineEcologyFamilies(), ...listHeadwaterEcologyFamilies(), ...listStarfenDeltaEcologyFamilies()]],
        ['species', [...listSpecies(), ...listRegionalSpecies(), ...listGreatMereSpecies(), ...listIronspineSpecies(), ...listHeadwaterSpecies(), ...listStarfenDeltaSpecies()]],
        ['population', [...listPopulations(), ...listRegionalPopulations(), ...listGreatMerePopulations(), ...listIronspinePopulations(), ...listHeadwaterPopulations(), ...listStarfenDeltaPopulations()]],
        ['source', [...listGatheringSources(), ...listRegionalGatheringSources(), ...listGreatMereGatheringSources(), ...listIronspineGatheringSources(), ...listHeadwaterGatheringSources(), ...listStarfenDeltaGatheringSources(), ...listMaterialFoundationGatheringSources()]],
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
