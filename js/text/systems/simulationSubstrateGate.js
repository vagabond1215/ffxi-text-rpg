import {
    listEcologyFamilies,
    listGatheringSources,
    listPopulations,
    listSpecies,
    validateEcologyCatalog,
} from '../data/ecologyCatalog.js';
import { REGIONAL_CONTENT_PACKS } from '../data/regionalContentPacks.js';
import {
    getNextServiceDeparture,
    listRoutes,
    listTransportServices,
    validateRouteCatalog,
} from '../data/routeCatalog.js';
import { buildContentPackIndex, validateContentPacks } from './contentPackValidator.js';
import { SYSTEM_VERSIONS, VERSION } from '../version.js';

export const SIMULATION_SUBSTRATE_GATE_VERSION = 1;

export const SIMULATION_SUBSTRATE_GATE_GROUPS = Object.freeze([
    'deterministicSimulation',
    'originalWorldIdentity',
    'projectsAndProvenance',
    'ecologyAndGathering',
    'routesAndTransport',
    'regionalContentScale',
    'persistenceContract',
]);

export function evaluateSimulationSubstrateGate(options = {}) {
    const systemVersions = options.systemVersions ?? SYSTEM_VERSIONS;
    const version = options.version ?? VERSION;
    const packs = options.contentPacks ?? REGIONAL_CONTENT_PACKS;
    const routeIssues = options.routeIssues ?? validateRouteCatalog();
    const ecologyIssues = options.ecologyIssues ?? validateEcologyCatalog();
    const contentPackIssues = options.contentPackIssues ?? validateContentPacks(packs);
    const packIndex = options.packIndex ?? buildContentPackIndex(packs);
    const routes = options.routes ?? listRoutes();
    const services = options.transportServices ?? listTransportServices();
    const families = options.ecologyFamilies ?? listEcologyFamilies();
    const species = options.species ?? listSpecies();
    const populations = options.populations ?? listPopulations();
    const gatheringSources = options.gatheringSources ?? listGatheringSources();

    const checks = [
        group('deterministicSimulation', [
            systemCheck(systemVersions, 'worldTime'),
            systemCheck(systemVersions, 'simulationControl'),
            systemCheck(systemVersions, 'timedTasks'),
            systemCheck(systemVersions, 'simulationInterrupts'),
            systemCheck(systemVersions, 'dayCycle'),
            systemCheck(systemVersions, 'semanticEvents'),
        ]),
        group('originalWorldIdentity', [
            minimumVersionCheck('game-state-identity-generation', version.gameState, 5, 'Game State'),
            systemCheck(systemVersions, 'worldIdentity'),
            booleanCheck(
                'product-identity',
                productVersionAtLeast(version.product, [0, 5, 900, 0]),
                `Product ${version.product} must be at or beyond the completed 0.5.900 exit-gate track.`,
            ),
        ]),
        group('projectsAndProvenance', [
            systemCheck(systemVersions, 'projects'),
            systemCheck(systemVersions, 'resourceProvenance'),
            systemCheck(systemVersions, 'resourceOpportunities'),
            systemCheck(systemVersions, 'resourceRecovery'),
        ]),
        group('ecologyAndGathering', [
            issueCheck('ecology-catalog-valid', ecologyIssues),
            minimumCheck('ecology-family-breadth', families.length, 3),
            minimumCheck('species-breadth', species.length, 5),
            minimumCheck('population-breadth', populations.length, 5),
            minimumCheck('gathering-source-breadth', gatheringSources.length, 3),
            booleanCheck(
                'gathering-source-types',
                ['flora', 'mineral', 'fishing'].every((type) => gatheringSources.some((source) => source.type === type)),
                'Representative gathering must cover flora, mineral, and fishing source types.',
            ),
        ]),
        group('routesAndTransport', [
            issueCheck('route-catalog-valid', routeIssues),
            minimumCheck('route-breadth', routes.length, 3),
            minimumCheck('scheduled-service-breadth', services.length, 2),
            booleanCheck(
                'scheduled-departure-determinism',
                services.every((service) => deterministicServiceDeparture(service)),
                'Scheduled services must derive repeatable departures from canonical world seconds.',
            ),
        ]),
        group('regionalContentScale', [
            issueCheck('regional-content-packs-valid', contentPackIssues),
            issueCheck('content-pack-index-valid', packIndex.issues ?? []),
            minimumCheck('content-pack-count', packs.length, 3),
            minimumCheck('regional-pack-count', packs.filter((pack) => pack.ownership?.scope === 'region').length, 2),
            booleanCheck(
                'cross-pack-dependency',
                packs.some((pack) => (pack.dependencies ?? []).some((dependencyId) => packs.some((candidate) => candidate.id === dependencyId))),
                'At least one authored pack must exercise a declared cross-pack dependency.',
            ),
            systemCheck(systemVersions, 'contentPackValidation'),
            systemCheck(systemVersions, 'legacyCandidateNormalization'),
        ]),
        group('persistenceContract', [
            minimumVersionCheck('account-save-contract', version.accountSave, 4, 'Account Save'),
            minimumVersionCheck('game-state-contract', version.gameState, 5, 'Game State'),
            booleanCheck('data-contract', version.data >= 19, `Data ${version.data} must include regional content-pack contracts.`),
            booleanCheck(
                'compatibility-policy',
                version.compatibility === 'pre-release-current-schema',
                `Compatibility mode ${version.compatibility} must use the pre-release current-schema policy.`,
            ),
        ]),
    ];

    const issues = checks.flatMap((entry) => entry.issues.map((issue) => `[${entry.id}] ${issue}`));
    return Object.freeze({
        version: SIMULATION_SUBSTRATE_GATE_VERSION,
        ready: issues.length === 0,
        productVersion: version.product,
        groups: Object.freeze(checks),
        issues: Object.freeze(issues),
        summary: Object.freeze({
            passedGroups: checks.filter((entry) => entry.ready).length,
            totalGroups: checks.length,
            packCount: packs.length,
            ownedRecordCount: packIndex.ownerCount ?? 0,
            routeCount: routes.length,
            transportServiceCount: services.length,
            familyCount: families.length,
            speciesCount: species.length,
            populationCount: populations.length,
            gatheringSourceCount: gatheringSources.length,
        }),
    });
}

export function validateSimulationSubstrateGate(options = {}) {
    return [...evaluateSimulationSubstrateGate(options).issues];
}

function group(id, checks) {
    const issues = checks.filter((check) => !check.ready).map((check) => `${check.id}: ${check.issue}`);
    return Object.freeze({
        id,
        ready: issues.length === 0,
        checks: Object.freeze(checks),
        issues: Object.freeze(issues),
    });
}

function systemCheck(systemVersions, systemId) {
    const value = systemVersions?.[systemId];
    const ready = typeof value === 'string' && value !== 'planned' && value !== '0.0.0';
    return booleanCheck(`system-${systemId}`, ready, `${systemId} must have an implemented subsystem version.`);
}

function issueCheck(id, issues) {
    const normalized = Array.isArray(issues) ? issues : [`validator returned non-array issues: ${String(issues)}`];
    return Object.freeze({
        id,
        ready: normalized.length === 0,
        issue: normalized.length ? normalized.join(' | ') : '',
    });
}

function minimumCheck(id, actual, minimum) {
    return booleanCheck(id, Number(actual) >= minimum, `${actual} records found; expected at least ${minimum}.`);
}

function minimumVersionCheck(id, actual, minimum, label) {
    const ready = Number.isInteger(actual) && actual >= minimum;
    return booleanCheck(id, ready, `${label} ${actual} must be at least schema ${minimum}.`);
}

function booleanCheck(id, ready, issue) {
    return Object.freeze({ id, ready: Boolean(ready), issue: ready ? '' : issue });
}

function productVersionAtLeast(value, minimum) {
    const parts = String(value ?? '').split('.').map((part) => Number(part));
    if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0)) return false;
    for (let index = 0; index < minimum.length; index += 1) {
        if (parts[index] > minimum[index]) return true;
        if (parts[index] < minimum[index]) return false;
    }
    return true;
}

function deterministicServiceDeparture(service) {
    if (!service?.id || !Number.isInteger(service.cadenceSeconds) || service.cadenceSeconds <= 0) return false;
    const sampleTime = service.firstDepartureOffsetSeconds + Math.max(1, Math.floor(service.cadenceSeconds / 3));
    const first = getNextServiceDeparture(service, sampleTime);
    const second = getNextServiceDeparture(service, sampleTime);
    return Number.isInteger(first) && first === second && first >= sampleTime;
}
