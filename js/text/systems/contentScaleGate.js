import { listAbilities, listSpellSchools } from '../data/abilities.js';
import { listCapabilities } from '../data/capabilities.js';
import { listCommitmentDefinitions } from '../data/commitments.js';
import { listCompanionDefinitions } from '../data/companions.js';
import { listGatheringSources, listSpecies } from '../data/ecologyCatalog.js';
import { listEquipmentCatalogEntries } from '../data/equipmentCatalog.js';
import { listNpcSchedules } from '../data/npcSchedules.js';
import { PLACES } from '../data/places.js';
import { listProductionDefinitions } from '../data/productionCatalog.js';
import { listProductionItems } from '../data/productionItems.js';
import { REGIONAL_CONTENT_PACKS } from '../data/regionalContentPacks.js';
import { listCanonicalResourceItems } from '../data/resourceItemRegistry.js';
import { listRoutes, listTransportServices } from '../data/routeCatalog.js';
import { createSeedEnemies, createSeedNpcs } from '../data/seedEntities.js';
import { buildContentPackIndex } from './contentPackValidator.js';

export const CONTENT_SCALE_GATE_VERSION = 2;

export const CONTENT_SCALE_METRICS = Object.freeze([
    'places',
    'npcs',
    'functionalServices',
    'creatures',
    'resources',
    'items',
    'recipes',
    'abilities',
    'quests',
    'companions',
    'transportServices',
]);

// Lower-bound planning gates from WORLD_IDENTITY_AND_CONTENT_POLICY.md.
// These are progression indicators, not balance or release-quality claims.
export const CONTENT_SCALE_TARGETS = deepFreeze({
    mechanicsIntegration: {
        places: 10,
        npcs: 50,
        functionalServices: 20,
        creatures: 40,
        resources: 40,
        items: 200,
        recipes: 75,
        abilities: 100,
        quests: 30,
        companions: 4,
        transportServices: 5,
    },
    playableAlpha: {
        places: 30,
        npcs: 250,
        functionalServices: 60,
        creatures: 120,
        resources: 100,
        items: 800,
        recipes: 300,
        abilities: 250,
        quests: 150,
        companions: 12,
        transportServices: 20,
    },
    onePointZero: {
        places: 75,
        npcs: 700,
        functionalServices: 150,
        creatures: 300,
        resources: 250,
        items: 2500,
        recipes: 800,
        abilities: 500,
        quests: 500,
        companions: 25,
        transportServices: 50,
    },
});

export function collectContentScaleCounts(options = {}) {
    const packs = options.contentPacks ?? REGIONAL_CONTENT_PACKS;
    const packIndex = buildContentPackIndex(packs);

    const places = uniqueIds([
        ...Object.values(PLACES),
        ...packRecords(packs, 'places'),
    ]);
    const npcs = uniqueIds([
        ...createSeedNpcs(),
        ...packRecords(packs, 'npcs'),
    ]);
    const serviceSites = new Set(
        Object.values(PLACES)
            .filter((place) => Array.isArray(place.services) && place.services.length > 0)
            .map((place) => `place:${place.id}`),
    );
    for (const shop of packRecords(packs, 'shops')) serviceSites.add(`shop:${shop.id}`);

    const creatures = uniqueIds([
        ...listSpecies(),
        ...packRecords(packs, 'species'),
    ]);
    const resources = uniqueIds([
        ...listGatheringSources(),
        ...packRecords(packs, 'gatheringSources'),
    ]);
    const items = uniqueIds([
        ...listCanonicalResourceItems(),
        ...listProductionItems(),
        ...listEquipmentCatalogEntries(),
        ...packRecords(packs, 'items'),
    ]);
    const recipes = uniqueIds([
        ...listProductionDefinitions(),
        ...packRecords(packs, 'recipes'),
    ]);
    const abilities = uniqueIds([
        ...listAbilities(),
        ...packRecords(packs, 'abilities'),
    ]);
    const quests = uniqueIds([
        ...listCommitmentDefinitions(),
        ...packRecords(packs, 'quests'),
    ]);
    const companions = uniqueIds([
        ...listCompanionDefinitions(),
        ...packRecords(packs, 'companions'),
    ]);
    const transportServices = uniqueIds([
        ...listTransportServices(),
        ...packRecords(packs, 'transportServices'),
    ]);

    return deepFreeze({
        places: places.size,
        npcs: npcs.size,
        functionalServices: serviceSites.size,
        creatures: creatures.size,
        resources: resources.size,
        items: items.size,
        recipes: recipes.size,
        abilities: abilities.size,
        quests: quests.size,
        companions: companions.size,
        transportServices: transportServices.size,
        supplemental: {
            routes: uniqueIds([
                ...listRoutes(),
                ...packRecords(packs, 'routes'),
            ]).size,
            spellSchools: uniqueIds([
                ...listSpellSchools(),
                ...packRecords(packs, 'spellSchools'),
            ]).size,
            capabilities: uniqueIds([
                ...listCapabilities(),
                ...packRecords(packs, 'capabilities'),
            ]).size,
            npcSchedules: uniqueIds([
                ...listNpcSchedules(),
                ...packRecords(packs, 'npcSchedules'),
            ]).size,
            contentPacks: packs.length,
            ownedPackRecords: packIndex.ownerCount ?? 0,
            packOwnedByCollection: { ...(packIndex.recordCounts ?? {}) },
            seedNpcs: createSeedNpcs().length,
            seedEnemies: createSeedEnemies().length,
            packIndexIssues: [...(packIndex.issues ?? [])],
        },
    });
}

export function evaluateContentScaleGate(options = {}) {
    const current = normalizeCounts(options.counts ?? collectContentScaleCounts(options));
    const targets = options.targets ?? CONTENT_SCALE_TARGETS;
    const stages = Object.fromEntries(
        Object.entries(targets).map(([stageId, target]) => [stageId, evaluateStage(current, target)]),
    );
    const mechanics = stages.mechanicsIntegration;
    const gaps = CONTENT_SCALE_METRICS
        .map((id) => mechanics.metrics[id])
        .filter((metric) => !metric.ready)
        .sort((a, b) => a.progress - b.progress || b.remaining - a.remaining || a.id.localeCompare(b.id));

    return deepFreeze({
        version: CONTENT_SCALE_GATE_VERSION,
        current,
        stages,
        mechanicsScaleReady: Boolean(mechanics?.ready),
        gaps,
        nextPriority: gaps[0]?.id ?? null,
    });
}

export function formatContentScaleReport(report = evaluateContentScaleGate()) {
    const lines = [
        `Hearth & Horizon Content Scale Gate v${report.version}`,
        '',
        'Metric                Current   Mechanics   Alpha   1.0',
        '--------------------  -------   ---------   -----   ----',
    ];

    for (const id of CONTENT_SCALE_METRICS) {
        lines.push(
            `${labelFor(id).padEnd(20)}  ${String(report.current[id]).padStart(7)}   `
            + `${String(report.stages.mechanicsIntegration.metrics[id].target).padStart(9)}   `
            + `${String(report.stages.playableAlpha.metrics[id].target).padStart(5)}   `
            + `${String(report.stages.onePointZero.metrics[id].target).padStart(4)}`,
        );
    }

    lines.push('', `Mechanics-scale gate: ${report.mechanicsScaleReady ? 'READY' : 'NOT READY'}`);
    if (report.gaps.length) {
        lines.push(`Largest relative gap: ${labelFor(report.nextPriority)}`);
        lines.push('Outstanding mechanics-scale gaps:');
        for (const gap of report.gaps) {
            lines.push(`- ${labelFor(gap.id)}: ${gap.current}/${gap.target} (${gap.remaining} remaining)`);
        }
    }

    const supplemental = report.current.supplemental ?? {};
    const owned = supplemental.packOwnedByCollection ?? {};
    lines.push(
        '',
        'Supplemental:',
        `- routes: ${supplemental.routes ?? 0}`,
        `- spell schools: ${supplemental.spellSchools ?? 0}`,
        `- capabilities/training definitions: ${supplemental.capabilities ?? 0}`,
        `- NPC schedules: ${supplemental.npcSchedules ?? 0}`,
        `- regional content packs: ${supplemental.contentPacks ?? 0}`,
        `- pack-owned records: ${supplemental.ownedPackRecords ?? 0}`,
        `- pack-owned abilities/capabilities/schedules/companions: ${owned.abilities ?? 0}/${owned.capabilities ?? 0}/${owned.npcSchedules ?? 0}/${owned.companions ?? 0}`,
        `- runtime seed NPCs: ${supplemental.seedNpcs ?? 0}`,
        `- runtime seed enemies: ${supplemental.seedEnemies ?? 0}`,
    );
    if ((supplemental.packIndexIssues ?? []).length) {
        lines.push(`- pack index issues: ${(supplemental.packIndexIssues ?? []).join(' | ')}`);
    }

    return lines.join('\n');
}

function evaluateStage(current, target) {
    const metrics = Object.fromEntries(CONTENT_SCALE_METRICS.map((id) => {
        const currentValue = nonNegativeInteger(current[id]);
        const targetValue = positiveInteger(target?.[id]);
        const remaining = Math.max(0, targetValue - currentValue);
        return [id, deepFreeze({
            id,
            current: currentValue,
            target: targetValue,
            remaining,
            ready: remaining === 0,
            progress: targetValue > 0 ? Math.min(1, currentValue / targetValue) : 1,
        })];
    }));
    return deepFreeze({
        ready: Object.values(metrics).every((metric) => metric.ready),
        metrics,
    });
}

function normalizeCounts(counts) {
    const normalized = Object.fromEntries(CONTENT_SCALE_METRICS.map((id) => [id, nonNegativeInteger(counts?.[id])]));
    normalized.supplemental = counts?.supplemental && typeof counts.supplemental === 'object'
        ? { ...counts.supplemental }
        : {};
    return normalized;
}

function packRecords(packs, collection) {
    return packs.flatMap((pack) => Array.isArray(pack?.records?.[collection]) ? pack.records[collection] : []);
}

function uniqueIds(records) {
    return new Set((records ?? []).map((record) => String(record?.id ?? '').trim()).filter(Boolean));
}

function nonNegativeInteger(value) {
    const numeric = Math.floor(Number(value));
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : 0;
}

function positiveInteger(value) {
    const numeric = Math.floor(Number(value));
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 1;
}

function labelFor(id) {
    return ({
        places: 'Places/localities',
        npcs: 'Named NPCs',
        functionalServices: 'Shop/service sites',
        creatures: 'Creature definitions',
        resources: 'Resource sources',
        items: 'Canonical items',
        recipes: 'Recipes/processes',
        abilities: 'Abilities/techniques',
        quests: 'Quests/contracts',
        companions: 'Companions',
        transportServices: 'Transport services',
    })[id] ?? id;
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
