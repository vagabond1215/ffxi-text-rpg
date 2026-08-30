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
    getHeadwaterHighlandTransitionRepairEcologyFamily,
    getHeadwaterHighlandTransitionRepairGatheringSource,
    getHeadwaterHighlandTransitionRepairPopulation,
    getHeadwaterHighlandTransitionRepairSpecies,
    listHeadwaterHighlandTransitionRepairEcologyFamilies,
    listHeadwaterHighlandTransitionRepairGatheringSources,
    listHeadwaterHighlandTransitionRepairPopulations,
    listHeadwaterHighlandTransitionRepairSpecies,
    validateHeadwaterHighlandTransitionRepairEcology,
} from './headwaterHighlandTransitionRepairEcology.js';
import {
    getDryUplandSaltpanRepairEcologyFamily,
    getDryUplandSaltpanRepairGatheringSource,
    getDryUplandSaltpanRepairPopulation,
    getDryUplandSaltpanRepairSpecies,
    listDryUplandSaltpanRepairEcologyFamilies,
    listDryUplandSaltpanRepairGatheringSources,
    listDryUplandSaltpanRepairPopulations,
    listDryUplandSaltpanRepairSpecies,
    validateDryUplandSaltpanRepairEcology,
} from './dryUplandSaltpanRepairEcology.js';
import {
    getElderwoodRepairEcologyFamily,
    getElderwoodRepairGatheringSource,
    getElderwoodRepairPopulation,
    getElderwoodRepairSpecies,
    listElderwoodRepairEcologyFamilies,
    listElderwoodRepairGatheringSources,
    listElderwoodRepairPopulations,
    listElderwoodRepairSpecies,
    validateElderwoodRepairEcology,
} from './elderwoodRepairEcology.js';
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
    getLowerDeepveinEcologyFamily,
    getLowerDeepveinGatheringSource,
    getLowerDeepveinPopulation,
    getLowerDeepveinSpecies,
    listLowerDeepveinEcologyFamilies,
    listLowerDeepveinGatheringSources,
    listLowerDeepveinPopulations,
    listLowerDeepveinSpecies,
    validateLowerDeepveinEcology,
} from './lowerDeepveinEcology.js';
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
import { getWaymeetMarchesEcologyFamily,getWaymeetMarchesGatheringSource,getWaymeetMarchesPopulation,getWaymeetMarchesSpecies,listWaymeetMarchesEcologyFamilies,listWaymeetMarchesGatheringSources,listWaymeetMarchesPopulations,listWaymeetMarchesSpecies,validateWaymeetMarchesEcology } from './waymeetMarchesEcology.js';
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

export const ECOLOGY_REGISTRY_VERSION = 11;

export function getCanonicalEcologyFamily(id) { return getEcologyFamily(id) ?? getRegionalEcologyFamily(id) ?? getHeadwaterHighlandTransitionRepairEcologyFamily(id) ?? getDryUplandSaltpanRepairEcologyFamily(id) ?? getElderwoodRepairEcologyFamily(id) ?? getEmberwashEcologyFamily(id) ?? getLowerDeepveinEcologyFamily(id) ?? getGreatMereEcologyFamily(id) ?? getIronspineEcologyFamily(id) ?? getHeadwaterEcologyFamily(id) ?? getStarfenDeltaEcologyFamily(id) ?? getGloamwoodEcologyFamily(id) ?? getWaymeetMarchesEcologyFamily(id); }
export function getCanonicalSpecies(id) { return getSpecies(id) ?? getRegionalSpecies(id) ?? getHeadwaterHighlandTransitionRepairSpecies(id) ?? getDryUplandSaltpanRepairSpecies(id) ?? getElderwoodRepairSpecies(id) ?? getEmberwashSpecies(id) ?? getLowerDeepveinSpecies(id) ?? getGreatMereSpecies(id) ?? getIronspineSpecies(id) ?? getHeadwaterSpecies(id) ?? getStarfenDeltaSpecies(id) ?? getGloamwoodSpecies(id) ?? getWaymeetMarchesSpecies(id); }
export function getCanonicalPopulation(id) { return getPopulation(id) ?? getRegionalPopulation(id) ?? getHeadwaterHighlandTransitionRepairPopulation(id) ?? getDryUplandSaltpanRepairPopulation(id) ?? getElderwoodRepairPopulation(id) ?? getEmberwashPopulation(id) ?? getLowerDeepveinPopulation(id) ?? getGreatMerePopulation(id) ?? getIronspinePopulation(id) ?? getHeadwaterPopulation(id) ?? getStarfenDeltaPopulation(id) ?? getGloamwoodPopulation(id) ?? getWaymeetMarchesPopulation(id); }
export function getCanonicalGatheringSource(id) { return getGatheringSource(id) ?? getRegionalGatheringSource(id) ?? getHeadwaterHighlandTransitionRepairGatheringSource(id) ?? getDryUplandSaltpanRepairGatheringSource(id) ?? getElderwoodRepairGatheringSource(id) ?? getEmberwashGatheringSource(id) ?? getLowerDeepveinGatheringSource(id) ?? getGreatMereGatheringSource(id) ?? getIronspineGatheringSource(id) ?? getHeadwaterGatheringSource(id) ?? getStarfenDeltaGatheringSource(id) ?? getGloamwoodGatheringSource(id) ?? getWaymeetMarchesGatheringSource(id) ?? getMaterialFoundationGatheringSource(id); }

export function listCanonicalEcologyFamilies() { return unique([...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listHeadwaterHighlandTransitionRepairEcologyFamilies(), ...listDryUplandSaltpanRepairEcologyFamilies(), ...listElderwoodRepairEcologyFamilies(), ...listEmberwashEcologyFamilies(), ...listLowerDeepveinEcologyFamilies(), ...listGreatMereEcologyFamilies(), ...listIronspineEcologyFamilies(), ...listHeadwaterEcologyFamilies(), ...listStarfenDeltaEcologyFamilies(), ...listGloamwoodEcologyFamilies(), ...listWaymeetMarchesEcologyFamilies()]); }
export function listCanonicalSpecies() { return unique([...listSpecies(), ...listRegionalSpecies(), ...listHeadwaterHighlandTransitionRepairSpecies(), ...listDryUplandSaltpanRepairSpecies(), ...listElderwoodRepairSpecies(), ...listEmberwashSpecies(), ...listLowerDeepveinSpecies(), ...listGreatMereSpecies(), ...listIronspineSpecies(), ...listHeadwaterSpecies(), ...listStarfenDeltaSpecies(), ...listGloamwoodSpecies(), ...listWaymeetMarchesSpecies()]); }
export function listCanonicalPopulations() { return unique([...listPopulations(), ...listRegionalPopulations(), ...listHeadwaterHighlandTransitionRepairPopulations(), ...listDryUplandSaltpanRepairPopulations(), ...listElderwoodRepairPopulations(), ...listEmberwashPopulations(), ...listLowerDeepveinPopulations(), ...listGreatMerePopulations(), ...listIronspinePopulations(), ...listHeadwaterPopulations(), ...listStarfenDeltaPopulations(), ...listGloamwoodPopulations(), ...listWaymeetMarchesPopulations()]); }
export function listCanonicalGatheringSources() { return unique([...listGatheringSources(), ...listRegionalGatheringSources(), ...listHeadwaterHighlandTransitionRepairGatheringSources(), ...listDryUplandSaltpanRepairGatheringSources(), ...listElderwoodRepairGatheringSources(), ...listEmberwashGatheringSources(), ...listLowerDeepveinGatheringSources(), ...listGreatMereGatheringSources(), ...listIronspineGatheringSources(), ...listHeadwaterGatheringSources(), ...listStarfenDeltaGatheringSources(), ...listGloamwoodGatheringSources(), ...listWaymeetMarchesGatheringSources(), ...listMaterialFoundationGatheringSources()]); }

export function validateEcologyRegistry() {
    const issues = [
        ...validateEcologyCatalog().map((issue) => `[foundation] ${issue}`),
        ...validateRegionalEcologyExpansion().map((issue) => `[regional] ${issue}`),
        ...validateHeadwaterHighlandTransitionRepairEcology().map((issue) => `[headwaterHighlandTransitionRepair] ${issue}`),
        ...validateDryUplandSaltpanRepairEcology().map((issue) => `[dryUplandSaltpanRepair] ${issue}`),
        ...validateElderwoodRepairEcology().map((issue) => `[elderwoodRepair] ${issue}`),
        ...validateEmberwashEcology().map((issue) => `[emberwash] ${issue}`),
        ...validateLowerDeepveinEcology().map((issue) => `[lowerDeepvein] ${issue}`),
        ...validateGreatMereEcology().map((issue) => `[greatMere] ${issue}`),
        ...validateIronspineEcology().map((issue) => `[ironspine] ${issue}`),
        ...validateHeadwaterEcology().map((issue) => `[headwater] ${issue}`),
        ...validateStarfenDeltaEcology().map((issue) => `[starfenDelta] ${issue}`),
        ...validateGloamwoodEcology().map((issue) => `[gloamwood] ${issue}`),
        ...validateWaymeetMarchesEcology().map((issue) => `[waymeetMarches] ${issue}`),
        ...validateMaterialFoundationSources().map((issue) => `[materialFoundation] ${issue}`),
    ];
    const collections = [
        ['family', [...listEcologyFamilies(), ...listRegionalEcologyFamilies(), ...listHeadwaterHighlandTransitionRepairEcologyFamilies(), ...listDryUplandSaltpanRepairEcologyFamilies(), ...listElderwoodRepairEcologyFamilies(), ...listEmberwashEcologyFamilies(), ...listLowerDeepveinEcologyFamilies(), ...listGreatMereEcologyFamilies(), ...listIronspineEcologyFamilies(), ...listHeadwaterEcologyFamilies(), ...listStarfenDeltaEcologyFamilies(), ...listGloamwoodEcologyFamilies(), ...listWaymeetMarchesEcologyFamilies()]],
        ['species', [...listSpecies(), ...listRegionalSpecies(), ...listHeadwaterHighlandTransitionRepairSpecies(), ...listDryUplandSaltpanRepairSpecies(), ...listElderwoodRepairSpecies(), ...listEmberwashSpecies(), ...listLowerDeepveinSpecies(), ...listGreatMereSpecies(), ...listIronspineSpecies(), ...listHeadwaterSpecies(), ...listStarfenDeltaSpecies(), ...listGloamwoodSpecies(), ...listWaymeetMarchesSpecies()]],
        ['population', [...listPopulations(), ...listRegionalPopulations(), ...listHeadwaterHighlandTransitionRepairPopulations(), ...listDryUplandSaltpanRepairPopulations(), ...listElderwoodRepairPopulations(), ...listEmberwashPopulations(), ...listLowerDeepveinPopulations(), ...listGreatMerePopulations(), ...listIronspinePopulations(), ...listHeadwaterPopulations(), ...listStarfenDeltaPopulations(), ...listGloamwoodPopulations(), ...listWaymeetMarchesPopulations()]],
        ['source', [...listGatheringSources(), ...listRegionalGatheringSources(), ...listHeadwaterHighlandTransitionRepairGatheringSources(), ...listDryUplandSaltpanRepairGatheringSources(), ...listElderwoodRepairGatheringSources(), ...listEmberwashGatheringSources(), ...listLowerDeepveinGatheringSources(), ...listGreatMereGatheringSources(), ...listIronspineGatheringSources(), ...listHeadwaterGatheringSources(), ...listStarfenDeltaGatheringSources(), ...listGloamwoodGatheringSources(), ...listWaymeetMarchesGatheringSources(), ...listMaterialFoundationGatheringSources()]],
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
