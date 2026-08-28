import {
    getCanonicalGatheringSource,
    getCanonicalPopulation,
    getCanonicalSpecies,
    listCanonicalGatheringSources,
    listCanonicalPopulations,
} from './ecologyRegistry.js';
import { getPlace, listPlaces } from './places.js';
import { getCanonicalResourceItem } from './resourceItemRegistry.js';
import { createSeedEnemies } from './seedEntities.js';

export const LOCATION_PROFILE_CATALOG_VERSION = 1;

const POPULATION_BASIS = 'authored-pre-alpha-estimate';

const SETTLEMENT_DEFINITIONS = Object.freeze({
    'settlement-thornwall': settlement({
        id: 'settlement-thornwall',
        name: 'Thornwall',
        kind: 'capital-city',
        region: 'Elderwood',
        nation: 'Thornwall',
        placeIds: [
            'thornwall-southgate',
            'thornwall-crownward',
            'thornwall-rivergate',
            'thornwall-high-citadel',
            'thornwall-strider-yard',
            'skyferry-waymeet-thornwall',
        ],
    }),
    'settlement-timbercross': settlement({
        id: 'settlement-timbercross',
        name: 'Timbercross Landing',
        kind: 'forest-work-camp',
        region: 'Elderwood',
        nation: 'Thornwall',
        placeIds: ['timbercross-landing'],
    }),
    'settlement-redfang-camp': settlement({
        id: 'settlement-redfang-camp',
        name: 'Redfang Camp',
        kind: 'fortified-raider-camp',
        region: 'Elderwood',
        nation: null,
        placeIds: ['redfang-camp'],
    }),
    'settlement-brasshaven': settlement({
        id: 'settlement-brasshaven',
        name: 'Brasshaven',
        kind: 'republic-city',
        region: 'Redstone Reach',
        nation: 'Brasshaven',
        placeIds: [
            'brasshaven-market-ring',
            'brasshaven-delvers-ward',
            'brasshaven-iron-quay',
            'brasshaven-foundry-hall',
        ],
    }),
    'settlement-mistmere': settlement({
        id: 'settlement-mistmere',
        name: 'Mistmere',
        kind: 'canal-city',
        region: 'Starfen',
        nation: 'Mistmere',
        placeIds: [
            'mistmere-canal-ward',
            'mistmere-spire-ward',
            'mistmere-garden-ward',
            'mistmere-reedport',
            'mistmere-observatory',
        ],
    }),
});

const PLACE_PROFILE_METADATA = Object.freeze({
    'thornwall-southgate': metadata({
        primaryBiome: 'temperate river-valley city',
        biomeTags: ['temperate-river-valley', 'urban-forest-edge', 'fortified-gate', 'managed-green'],
        settlementId: 'settlement-thornwall',
        settlementRole: 'southern gate and guild ward',
        residentPopulation: 13200,
        transientPopulation: 2400,
    }),
    'thornwall-crownward': metadata({
        primaryBiome: 'temperate upland city',
        biomeTags: ['temperate-river-valley', 'urban-upland', 'managed-gardens', 'stone-district'],
        settlementId: 'settlement-thornwall',
        settlementRole: 'northern craft and oath ward',
        residentPopulation: 9800,
        transientPopulation: 1400,
    }),
    'thornwall-rivergate': metadata({
        primaryBiome: 'riparian city',
        biomeTags: ['temperate-river-valley', 'riparian-urban', 'riverfront', 'timber-quay'],
        settlementId: 'settlement-thornwall',
        settlementRole: 'riverward trade district',
        residentPopulation: 7600,
        transientPopulation: 1900,
    }),
    'thornwall-high-citadel': metadata({
        primaryBiome: 'fortified urban upland',
        biomeTags: ['urban-upland', 'fortified-citadel', 'stone-terrace'],
        settlementId: 'settlement-thornwall',
        settlementRole: 'civic, royal, and military seat',
        residentPopulation: 1600,
        transientPopulation: 900,
    }),
    'thornwall-strider-yard': metadata({
        primaryBiome: 'urban-fringe pasture',
        biomeTags: ['urban-fringe', 'stable-yard', 'managed-pasture', 'temperate-river-valley'],
        settlementId: 'settlement-thornwall',
        settlementRole: 'stable, training, and roadstrider yard',
        residentPopulation: 320,
        transientPopulation: 620,
    }),
    'timbercross-landing': metadata({
        primaryBiome: 'riparian managed woodland',
        biomeTags: ['riparian-woodland', 'managed-forest', 'river-bend', 'work-camp'],
        settlementId: 'settlement-timbercross',
        settlementRole: 'timber landing and forest work camp',
        residentPopulation: 340,
        transientPopulation: 180,
    }),
    'thornwall-old-gaol': metadata({
        primaryBiome: 'subterranean urban ruin',
        biomeTags: ['subterranean', 'urban-ruin', 'cistern', 'old-foundation'],
        settlementId: null,
        settlementRole: null,
        residentPopulation: 0,
        transientPopulation: 8,
    }),
    'skyferry-waymeet-thornwall': metadata({
        primaryBiome: 'exposed urban high mooring',
        biomeTags: ['urban-fringe', 'high-mooring', 'exposed-wind', 'river-overlook'],
        settlementId: 'settlement-thornwall',
        settlementRole: 'high mooring and weather station',
        residentPopulation: 90,
        transientPopulation: 260,
    }),
    'west-elderwood': metadata({
        primaryBiome: 'temperate old-growth woodland',
        biomeTags: ['temperate-woodland', 'old-growth', 'forest-edge', 'root-thicket', 'flowering-glade'],
        settlementId: null,
        settlementRole: 'managed royal forest and old-growth frontier',
        residentPopulation: 70,
        transientPopulation: 180,
    }),
    'east-elderwood': metadata({
        primaryBiome: 'temperate hunting woodland',
        biomeTags: ['temperate-woodland', 'hunting-ground', 'boundary-forest', 'trade-track'],
        settlementId: null,
        settlementRole: 'eastern forest roads and hunting grounds',
        residentPopulation: 45,
        transientPopulation: 130,
    }),
    'redfang-camp': metadata({
        primaryBiome: 'fortified woodland camp',
        biomeTags: ['fortified-forest', 'palisade', 'old-growth-edge', 'raider-camp'],
        settlementId: 'settlement-redfang-camp',
        settlementRole: 'fortified raider encampment',
        residentPopulation: 110,
        transientPopulation: 15,
    }),
    'brasshaven-market-ring': metadata({
        primaryBiome: 'dry-upland mercantile city',
        biomeTags: ['dry-upland-urban', 'mercantile', 'stone-paved', 'workshop-district'],
        settlementId: 'settlement-brasshaven',
        settlementRole: 'commercial and civic market ring',
        residentPopulation: 12600,
        transientPopulation: 3100,
    }),
    'brasshaven-delvers-ward': metadata({
        primaryBiome: 'rocky upland industrial city',
        biomeTags: ['dry-upland-urban', 'rocky', 'mine-edge', 'labor-district'],
        settlementId: 'settlement-brasshaven',
        settlementRole: 'mining, lift-house, and labor ward',
        residentPopulation: 9400,
        transientPopulation: 2600,
    }),
    'brasshaven-iron-quay': metadata({
        primaryBiome: 'industrial river quay',
        biomeTags: ['dry-upland-urban', 'industrial-riverfront', 'freight-quay', 'caravan-yard'],
        settlementId: 'settlement-brasshaven',
        settlementRole: 'freight, ore-barge, and passenger quay',
        residentPopulation: 6200,
        transientPopulation: 2500,
    }),
    'brasshaven-foundry-hall': metadata({
        primaryBiome: 'industrial civic interior',
        biomeTags: ['industrial-urban', 'foundry-complex', 'dry-upland', 'civic-hall'],
        settlementId: 'settlement-brasshaven',
        settlementRole: 'public foundry and republic administration',
        residentPopulation: 1700,
        transientPopulation: 1200,
    }),
    'south-redstone-reach': metadata({
        primaryBiome: 'dry rocky upland',
        biomeTags: ['dry-upland', 'exposed-ridge', 'scree', 'quarry-road', 'ore-bearing-rock'],
        settlementId: null,
        settlementRole: 'quarry roads, prospecting ridges, and caravan tracks',
        residentPopulation: 85,
        transientPopulation: 240,
    }),
    'north-redstone-reach': metadata({
        primaryBiome: 'wind-scoured rocky upland',
        biomeTags: ['wind-scoured-upland', 'exposed-ridge', 'mine-road', 'rocky-soil'],
        settlementId: null,
        settlementRole: 'northern prospecting and mine-road frontier',
        residentPopulation: 60,
        transientPopulation: 180,
    }),
    'deepvein-mine': metadata({
        primaryBiome: 'subterranean mine and cave',
        biomeTags: ['subterranean', 'mine', 'cave', 'abandoned-gallery'],
        settlementId: null,
        settlementRole: 'maintained mine with abandoned deeper galleries',
        residentPopulation: 35,
        transientPopulation: 420,
    }),
    'mistmere-canal-ward': metadata({
        primaryBiome: 'wetland canal city',
        biomeTags: ['wetland-urban', 'canal', 'reed-island', 'market-waterfront'],
        settlementId: 'settlement-mistmere',
        settlementRole: 'working canal, market, kitchen, and ferry ward',
        residentPopulation: 9600,
        transientPopulation: 2500,
    }),
    'mistmere-spire-ward': metadata({
        primaryBiome: 'raised-island scholastic city',
        biomeTags: ['wetland-urban', 'raised-island', 'scholastic', 'civic-spire'],
        settlementId: 'settlement-mistmere',
        settlementRole: 'administrative and scholastic ward',
        residentPopulation: 6800,
        transientPopulation: 1700,
    }),
    'mistmere-garden-ward': metadata({
        primaryBiome: 'cultivated wetland city',
        biomeTags: ['wetland-urban', 'firm-island', 'cultivated-garden', 'dye-yard'],
        settlementId: 'settlement-mistmere',
        settlementRole: 'residential, garden, and workshop ward',
        residentPopulation: 7400,
        transientPopulation: 1300,
    }),
    'mistmere-reedport': metadata({
        primaryBiome: 'wetland port',
        biomeTags: ['wetland-port', 'reed-channel', 'shallow-water', 'cargo-landing'],
        settlementId: 'settlement-mistmere',
        settlementRole: 'outer shallow-draft port',
        residentPopulation: 4800,
        transientPopulation: 2200,
    }),
    'mistmere-observatory': metadata({
        primaryBiome: 'elevated wetland civic interior',
        biomeTags: ['wetland-urban', 'elevated-island', 'observatory', 'scholastic'],
        settlementId: 'settlement-mistmere',
        settlementRole: 'observatory and survey-record complex',
        residentPopulation: 650,
        transientPopulation: 420,
    }),
    'west-starfen': metadata({
        primaryBiome: 'marsh-grassland wetland',
        biomeTags: ['wetland', 'marsh-grassland', 'shallow-water', 'reedbed', 'peat-hummock'],
        settlementId: null,
        settlementRole: 'western marsh paths, grazing islands, and gathering grounds',
        residentPopulation: 120,
        transientPopulation: 180,
    }),
    'east-starfen': metadata({
        primaryBiome: 'open fen and grass islands',
        biomeTags: ['open-fen', 'grass-island', 'reed-channel', 'ruin-edge', 'raised-path'],
        settlementId: null,
        settlementRole: 'eastern fen, reed-clan trails, and ruin approaches',
        residentPopulation: 160,
        transientPopulation: 140,
    }),
    'sunken-archive': metadata({
        primaryBiome: 'half-submerged wetland ruin',
        biomeTags: ['submerged-ruin', 'wetland', 'dry-chamber', 'subterranean'],
        settlementId: null,
        settlementRole: 'pre-Compact archive ruin',
        residentPopulation: 0,
        transientPopulation: 20,
    }),
});

const SEED_ENEMY_SPECIES_BY_ID = new Map(
    createSeedEnemies()
        .filter((entry) => entry.speciesId)
        .map((entry) => [entry.id, entry.speciesId]),
);

export function getLocationProfile(placeId) {
    const place = getPlace(placeId);
    if (!place) return null;
    const meta = PLACE_PROFILE_METADATA[place.id];
    if (!meta) return null;

    const settlementProfile = meta.settlementId ? getSettlementProfile(meta.settlementId) : null;
    const localEcology = collectLocalEcology(place);
    const regionalEcology = collectRegionalEcology(place.region);

    return freezeProfile({
        id: place.id,
        name: place.name,
        type: place.type,
        region: place.region,
        nation: place.nation,
        dangerLevel: place.dangerLevel,
        description: place.description,
        services: [...place.services],
        biome: {
            primary: meta.primaryBiome,
            tags: [...meta.biomeTags],
        },
        settlement: settlementProfile
            ? {
                id: settlementProfile.id,
                name: settlementProfile.name,
                kind: settlementProfile.kind,
                role: meta.settlementRole,
                totalResidents: settlementProfile.population.residents,
                typicalPresentPopulation: settlementProfile.population.typicalPresent,
            }
            : null,
        population: {
            residents: meta.residentPopulation,
            typicalTransient: meta.transientPopulation,
            typicalPresent: meta.residentPopulation + meta.transientPopulation,
            basis: POPULATION_BASIS,
        },
        ecology: {
            local: localEcology,
            regionalRepresentative: regionalEcology,
            coverage: ecologyCoverage(localEcology, regionalEcology),
        },
    });
}

export function listLocationProfiles() {
    return listPlaces().map((place) => getLocationProfile(place.id)).filter(Boolean);
}

export function getSettlementProfile(settlementId) {
    const definition = SETTLEMENT_DEFINITIONS[String(settlementId ?? '').trim()];
    if (!definition) return null;
    const members = definition.placeIds
        .map((placeId) => {
            const place = getPlace(placeId);
            const meta = PLACE_PROFILE_METADATA[placeId];
            if (!place || !meta) return null;
            return {
                placeId,
                name: place.name,
                role: meta.settlementRole,
                residents: meta.residentPopulation,
                typicalTransient: meta.transientPopulation,
            };
        })
        .filter(Boolean);
    const residents = sum(members.map((entry) => entry.residents));
    const typicalTransient = sum(members.map((entry) => entry.typicalTransient));
    return Object.freeze({
        ...definition,
        placeIds: Object.freeze([...definition.placeIds]),
        population: Object.freeze({
            residents,
            typicalTransient,
            typicalPresent: residents + typicalTransient,
            basis: POPULATION_BASIS,
        }),
        members: Object.freeze(members.map((entry) => Object.freeze(entry))),
    });
}

export function listSettlementProfiles() {
    return Object.keys(SETTLEMENT_DEFINITIONS).map((id) => getSettlementProfile(id));
}

export function getRegionProfile(regionName) {
    const region = String(regionName ?? '').trim();
    const places = listPlaces().filter((place) => place.region === region);
    if (!places.length) return null;
    const locationProfiles = places.map((place) => getLocationProfile(place.id));
    const settlementProfiles = listSettlementProfiles().filter((settlementEntry) => settlementEntry.region === region);
    const residents = sum(locationProfiles.map((entry) => entry.population.residents));
    const typicalTransient = sum(locationProfiles.map((entry) => entry.population.typicalTransient));
    const ecology = collectRegionalEcology(region);
    return freezeProfile({
        id: `region-${slug(region)}`,
        name: region,
        nations: unique(locationProfiles.map((entry) => entry.nation).filter(Boolean)),
        placeIds: places.map((place) => place.id),
        biomes: unique(locationProfiles.flatMap((entry) => entry.biome.tags)),
        settlements: settlementProfiles.map((entry) => ({
            id: entry.id,
            name: entry.name,
            kind: entry.kind,
            residents: entry.population.residents,
            typicalPresent: entry.population.typicalPresent,
        })),
        population: {
            residents,
            typicalTransient,
            typicalPresent: residents + typicalTransient,
            basis: POPULATION_BASIS,
        },
        ecology,
    });
}

export function listRegionProfiles() {
    return unique(listPlaces().map((place) => place.region)).map((region) => getRegionProfile(region));
}

export function validateLocationProfileCatalog() {
    const issues = [];
    const places = listPlaces();
    const placeIds = new Set(places.map((place) => place.id));
    const metadataIds = Object.keys(PLACE_PROFILE_METADATA);

    if (metadataIds.length !== places.length) {
        issues.push(`Location profile metadata count ${metadataIds.length} does not match place count ${places.length}.`);
    }
    for (const place of places) {
        const meta = PLACE_PROFILE_METADATA[place.id];
        if (!meta) {
            issues.push(`Missing location profile metadata for ${place.id}.`);
            continue;
        }
        if (!meta.primaryBiome) issues.push(`${place.id} requires primaryBiome.`);
        if (!Array.isArray(meta.biomeTags) || meta.biomeTags.length === 0) issues.push(`${place.id} requires biomeTags.`);
        if (!nonNegativeInteger(meta.residentPopulation)) issues.push(`${place.id} residentPopulation must be a non-negative integer.`);
        if (!nonNegativeInteger(meta.transientPopulation)) issues.push(`${place.id} transientPopulation must be a non-negative integer.`);
        if (meta.settlementId && !SETTLEMENT_DEFINITIONS[meta.settlementId]) {
            issues.push(`${place.id} references unknown settlement ${meta.settlementId}.`);
        }
    }
    for (const metadataId of metadataIds) {
        if (!placeIds.has(metadataId)) issues.push(`Location profile metadata references unknown place ${metadataId}.`);
    }

    const settlementPlaceIds = new Set();
    for (const definition of Object.values(SETTLEMENT_DEFINITIONS)) {
        if (!definition.placeIds.length) issues.push(`${definition.id} requires at least one place.`);
        for (const placeId of definition.placeIds) {
            if (!placeIds.has(placeId)) issues.push(`${definition.id} references unknown place ${placeId}.`);
            if (settlementPlaceIds.has(placeId)) issues.push(`Place ${placeId} belongs to more than one settlement profile.`);
            settlementPlaceIds.add(placeId);
            if (PLACE_PROFILE_METADATA[placeId]?.settlementId !== definition.id) {
                issues.push(`${placeId} settlement metadata does not point back to ${definition.id}.`);
            }
        }
    }

    for (const profile of listLocationProfiles()) {
        for (const flora of profile.ecology.local.flora) {
            if (!getCanonicalGatheringSource(flora.sourceId)) issues.push(`${profile.id} references unknown local flora source ${flora.sourceId}.`);
        }
        for (const fauna of profile.ecology.local.fauna) {
            if (!getCanonicalSpecies(fauna.speciesId)) issues.push(`${profile.id} references unknown local fauna ${fauna.speciesId}.`);
        }
    }

    return issues;
}

export function describeLocationProfileCatalog() {
    const lines = [];
    lines.push('Hearth & Horizon Location / Area Profiles');
    lines.push(`Version: ${LOCATION_PROFILE_CATALOG_VERSION}`);
    lines.push(`Places: ${listLocationProfiles().length}`);
    lines.push(`Settlements: ${listSettlementProfiles().length}`);
    lines.push(`Regions: ${listRegionProfiles().length}`);
    lines.push('');
    for (const region of listRegionProfiles()) {
        lines.push(`# ${region.name}`);
        lines.push(`Population: ${formatNumber(region.population.residents)} residents; ~${formatNumber(region.population.typicalPresent)} typically present`);
        lines.push(`Settlements: ${region.settlements.map((entry) => `${entry.name} (${formatNumber(entry.residents)})`).join(', ') || 'none'}`);
        lines.push(`Biomes: ${region.biomes.join(', ')}`);
        lines.push(`Flora: ${region.ecology.flora.map((entry) => entry.name).join(', ') || 'none currently modeled'}`);
        lines.push(`Fauna: ${region.ecology.fauna.map((entry) => entry.name).join(', ') || 'none currently modeled'}`);
        if (region.ecology.otherCreatures.length) lines.push(`Other creatures: ${region.ecology.otherCreatures.map((entry) => entry.name).join(', ')}`);
        lines.push('');
        for (const placeId of region.placeIds) {
            const profile = getLocationProfile(placeId);
            lines.push(`## ${profile.name}`);
            lines.push(`${profile.type} | biome: ${profile.biome.primary} | residents: ${formatNumber(profile.population.residents)} | typical present: ~${formatNumber(profile.population.typicalPresent)}`);
            if (profile.settlement) lines.push(`Settlement: ${profile.settlement.name} — ${profile.settlement.role}; settlement residents: ${formatNumber(profile.settlement.totalResidents)}`);
            lines.push(`Local flora: ${profile.ecology.local.flora.map((entry) => entry.name).join(', ') || 'none currently modeled'}`);
            lines.push(`Local fauna: ${profile.ecology.local.fauna.map((entry) => entry.name).join(', ') || 'none currently modeled'}`);
            if (profile.ecology.local.otherCreatures.length) lines.push(`Other local creatures: ${profile.ecology.local.otherCreatures.map((entry) => entry.name).join(', ')}`);
            if (!profile.ecology.local.flora.length && profile.ecology.regionalRepresentative.flora.length) {
                lines.push(`Regional flora context: ${profile.ecology.regionalRepresentative.flora.map((entry) => entry.name).join(', ')}`);
            }
            if (!profile.ecology.local.fauna.length && profile.ecology.regionalRepresentative.fauna.length) {
                lines.push(`Regional fauna context: ${profile.ecology.regionalRepresentative.fauna.map((entry) => entry.name).join(', ')}`);
            }
            lines.push('');
        }
    }
    return lines.join('\n');
}

function collectLocalEcology(place) {
    const sourceRecords = listCanonicalGatheringSources().filter((entry) => entry.placeId === place.id);
    const populationRecords = listCanonicalPopulations().filter((entry) => entry.placeId === place.id);
    const speciesIds = new Set(populationRecords.map((entry) => entry.speciesId));
    for (const spawnRule of place.spawnRules ?? []) {
        const speciesId = SEED_ENEMY_SPECIES_BY_ID.get(spawnRule.enemyId);
        if (speciesId) speciesIds.add(speciesId);
    }
    return ecologyProjection(sourceRecords, populationRecords, [...speciesIds]);
}

function collectRegionalEcology(region) {
    const placeIds = new Set(listPlaces().filter((place) => place.region === region).map((place) => place.id));
    const sourceRecords = listCanonicalGatheringSources().filter((entry) => placeIds.has(entry.placeId));
    const populationRecords = listCanonicalPopulations().filter((entry) => placeIds.has(entry.placeId));
    const speciesIds = new Set(populationRecords.map((entry) => entry.speciesId));
    for (const place of listPlaces().filter((entry) => entry.region === region)) {
        for (const spawnRule of place.spawnRules ?? []) {
            const speciesId = SEED_ENEMY_SPECIES_BY_ID.get(spawnRule.enemyId);
            if (speciesId) speciesIds.add(speciesId);
        }
    }
    return ecologyProjection(sourceRecords, populationRecords, [...speciesIds]);
}

function ecologyProjection(sourceRecords, populationRecords, speciesIds) {
    const populationIdsBySpecies = new Map();
    for (const populationEntry of populationRecords) {
        const ids = populationIdsBySpecies.get(populationEntry.speciesId) ?? [];
        ids.push(populationEntry.id);
        populationIdsBySpecies.set(populationEntry.speciesId, ids);
    }
    const flora = sourceRecords
        .filter((entry) => entry.type === 'flora')
        .map((entry) => {
            const item = getCanonicalResourceItem(entry.outputItemId);
            return Object.freeze({
                sourceId: entry.id,
                name: item?.name ?? entry.name,
                sourceName: entry.name,
                outputItemId: entry.outputItemId,
                biomeTags: Object.freeze([...entry.biomeTags]),
            });
        });
    const fishing = sourceRecords
        .filter((entry) => entry.type === 'fishing')
        .map((entry) => Object.freeze({
            sourceId: entry.id,
            name: getCanonicalResourceItem(entry.outputItemId)?.name ?? entry.name,
            sourceName: entry.name,
            outputItemId: entry.outputItemId,
            biomeTags: Object.freeze([...entry.biomeTags]),
        }));
    const fauna = [];
    const otherCreatures = [];
    for (const speciesId of speciesIds) {
        const species = getCanonicalSpecies(speciesId);
        if (!species) continue;
        const entry = Object.freeze({
            speciesId: species.id,
            name: species.name,
            ecosystem: species.ecosystem,
            habitatTags: Object.freeze([...species.habitatTags]),
            populationIds: Object.freeze([...(populationIdsBySpecies.get(species.id) ?? [])]),
        });
        if (isFauna(species)) fauna.push(entry);
        else otherCreatures.push(entry);
    }
    return Object.freeze({
        flora: Object.freeze(sortByName(flora)),
        fauna: Object.freeze(sortByName(fauna)),
        fishing: Object.freeze(sortByName(fishing)),
        otherCreatures: Object.freeze(sortByName(otherCreatures)),
    });
}

function ecologyCoverage(local, regional) {
    if (local.flora.length || local.fauna.length || local.fishing.length || local.otherCreatures.length) return 'local-canonical';
    if (regional.flora.length || regional.fauna.length || regional.fishing.length || regional.otherCreatures.length) return 'regional-context-only';
    return 'not-yet-modeled';
}

function isFauna(species) {
    return !['raider', 'plantoid', 'construct'].includes(species.ecosystem);
}

function metadata({ primaryBiome, biomeTags, settlementId, settlementRole, residentPopulation, transientPopulation }) {
    return Object.freeze({
        primaryBiome,
        biomeTags: Object.freeze([...biomeTags]),
        settlementId,
        settlementRole,
        residentPopulation,
        transientPopulation,
    });
}

function settlement({ id, name, kind, region, nation, placeIds }) {
    return Object.freeze({ id, name, kind, region, nation, placeIds: Object.freeze([...placeIds]) });
}

function freezeProfile(profile) {
    return Object.freeze(profile);
}

function unique(values) {
    return [...new Set(values)];
}

function sum(values) {
    return values.reduce((total, value) => total + value, 0);
}

function sortByName(records) {
    return [...records].sort((a, b) => a.name.localeCompare(b.name));
}

function slug(value) {
    return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function nonNegativeInteger(value) {
    return Number.isInteger(value) && value >= 0;
}

function formatNumber(value) {
    return Number(value).toLocaleString('en-US');
}
