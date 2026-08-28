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

export const ECOLOGY_REGISTRY_VERSION = 2;

export function getCanonicalEcologyFamily(id) { return getEcologyFamily(id) ?? getRegionalEcologyFamily(id) ?? getGreatMereEcologyFamily(id); }
export function getCanonicalSpecies(id) { return getSpecies(id) ?? getRegionalSpecies(id) ?? getGreatMereSpecies(id); }
export function getCanonicalPopulation(id) { return getPopulation(id) ?? getRegionalPopulation(id) ?? getGreatMerePopulation(id); }
export function getCanonicalGatheringSource(id) { return getGatheringSource(id) ?? getRegionalGatheringSource(id) ?? getGreatMereGatheringSource(id); }

export function listCanonicalEcologyFamilies() { return unique([...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listGreatMereEcologyFamilies()]); }
export function listCanonicalSpecies() { return unique([...listSpecies(), ...listRegionalSpecies(), ...listGreatMereSpecies()]); }
export function listCanonicalPopulations() { return unique([...listPopulations(), ...listRegionalPopulations(), ...listGreatMerePopulations()]); }
export function listCanonicalGatheringSources() { return unique([...listGatheringSources(), ...listRegionalGatheringSources(), ...listGreatMereGatheringSources()]); }

export function validateEcologyRegistry() {
    const issues = [
        ...validateEcologyCatalog().map((issue) => `[foundation] ${issue}`),
        ...validateRegionalEcologyExpansion().map((issue) => `[regional] ${issue}`),
        ...validateGreatMereEcology().map((issue) => `[greatMere] ${issue}`),
    ];
    const collections = [
        ['family', [...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listGreatMereEcologyFamilies()]],
        ['species', [...listSpecies(), ...listRegionalSpecies(), ...listGreatMereSpecies()]],
        ['population', [...listPopulations(), ...listRegionalPopulations(), ...listGreatMerePopulations()]],
        ['source', [...listGatheringSources(), ...listRegionalGatheringSources(), ...listGreatMereGatheringSources()]],
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
