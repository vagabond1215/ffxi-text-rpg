import { validateCompanionCatalog } from '../data/companions.js';
import { listDatabases } from '../data/databaseRegistry.js';
import { validateEcologyCatalog } from '../data/ecologyCatalog.js';
import { listEquipmentCatalogEntries } from '../data/equipmentCatalog.js';
import { validateProductionCatalog } from '../data/productionCatalog.js';
import { REGIONAL_CONTENT_PACKS } from '../data/regionalContentPacks.js';
import { validateRouteCatalog } from '../data/routeCatalog.js';
import { createNewGameState } from '../gameState.js';
import { SYSTEM_VERSIONS, VERSION } from '../version.js';
import { ensureAbilityRuntimeState } from './abilityEngine.js';
import { buildContentPackIndex, validateContentPacks } from './contentPackValidator.js';
import { ensureEcologyState } from './ecologyEngine.js';
import { ensurePartyState } from './partyEngine.js';
import { ensureProjectState } from './projectEngine.js';
import { ensureResourceOpportunityState } from './resourceOpportunityEngine.js';
import { ensureSemanticEventState } from './semanticEventEngine.js';
import { ensureSimulationControlState } from './simulationControlEngine.js';
import { ensureTimedTaskState } from './timedTaskEngine.js';
import { validateGameState, validateWorldData } from './validation.js';
import { ensureWorkState } from './workTaskEngine.js';

export const INTEGRATED_MECHANICS_GATE_VERSION = 1;

export const INTEGRATED_MECHANICS_GATE_GROUPS = Object.freeze([
    'persistenceAndNormalization',
    'fictionalTimeAndInterrupts',
    'continuousCharacterOwnership',
    'combatPartyWorkTravel',
    'provenanceAndProduction',
    'semanticUiAuthority',
    'worldAndContentValidation',
    'phaseExitReadiness',
]);

const REQUIRED_DATABASES = Object.freeze([
    'capabilities',
    'abilities',
    'projects',
    'resourceProvenance',
    'resourceOpportunities',
    'gatheringWork',
    'production',
    'workTasks',
    'workProficiencies',
    'travel',
    'companions',
    'party',
]);

export function evaluateIntegratedMechanicsGate(options = {}) {
    const systemVersions = options.systemVersions ?? SYSTEM_VERSIONS;
    const version = options.version ?? VERSION;
    const packs = options.contentPacks ?? REGIONAL_CONTENT_PACKS;
    const databases = options.databases ?? listDatabases();
    const worldIssues = options.worldIssues ?? validateWorldData();
    const ecologyIssues = options.ecologyIssues ?? validateEcologyCatalog();
    const routeIssues = options.routeIssues ?? validateRouteCatalog();
    const productionIssues = options.productionIssues ?? validateProductionCatalog();
    const companionIssues = options.companionIssues ?? validateCompanionCatalog();
    const contentPackIssues = options.contentPackIssues ?? validateContentPacks(packs);
    const packIndex = options.packIndex ?? buildContentPackIndex(packs);
    const initialStateIssues = options.initialStateIssues ?? validateGameState(createNewGameState());
    const normalizationIssues = options.normalizationIssues ?? validateAdditiveStateNormalization();
    const canonicalDisciplineGates = listEquipmentCatalogEntries()
        .filter((entry) => (entry.requirements?.allowedJobs ?? []).length > 0)
        .map((entry) => entry.id);

    const checks = [
        group('persistenceAndNormalization', [
            issueCheck('new-game-state-valid', initialStateIssues),
            issueCheck('additive-state-normalization', normalizationIssues),
            minimumVersionCheck('account-save-contract', version.accountSave, 4, 'Account Save'),
            minimumVersionCheck('game-state-contract', version.gameState, 5, 'Game State'),
            booleanCheck(
                'compatibility-policy',
                version.compatibility === 'pre-release-current-schema',
                `Compatibility mode ${version.compatibility} must use the pre-release current-schema policy.`,
            ),
        ]),
        group('fictionalTimeAndInterrupts', [
            systemCheck(systemVersions, 'worldTime'),
            systemCheck(systemVersions, 'simulationControl'),
            systemCheck(systemVersions, 'simulationInterrupts'),
            systemCheck(systemVersions, 'timedTasks'),
            systemCheck(systemVersions, 'dayCycle'),
            systemCheck(systemVersions, 'abilityEngine'),
            systemCheck(systemVersions, 'combatSimulation'),
            systemCheck(systemVersions, 'transport'),
            systemCheck(systemVersions, 'projects'),
            systemCheck(systemVersions, 'workTasks'),
        ]),
        group('continuousCharacterOwnership', [
            systemCheck(systemVersions, 'characterStats'),
            systemCheck(systemVersions, 'progression'),
            systemCheck(systemVersions, 'capabilities'),
            systemCheck(systemVersions, 'skillProgression'),
            systemCheck(systemVersions, 'workProficiencies'),
            booleanCheck(
                'canonical-equipment-discipline-gates',
                canonicalDisciplineGates.length === 0,
                `Canonical equipment must not hard-gate use by active discipline: ${canonicalDisciplineGates.join(', ')}`,
            ),
        ]),
        group('combatPartyWorkTravel', [
            systemCheck(systemVersions, 'battleEngine'),
            systemCheck(systemVersions, 'combatTurns'),
            systemCheck(systemVersions, 'combatActions'),
            systemCheck(systemVersions, 'battleRewards'),
            systemCheck(systemVersions, 'party'),
            systemCheck(systemVersions, 'companionCatalog'),
            systemCheck(systemVersions, 'travel'),
            systemCheck(systemVersions, 'localityNavigation'),
            systemCheck(systemVersions, 'gatheringWork'),
            systemCheck(systemVersions, 'production'),
        ]),
        group('provenanceAndProduction', [
            systemCheck(systemVersions, 'resourceProvenance'),
            systemCheck(systemVersions, 'resourceOpportunities'),
            systemCheck(systemVersions, 'resourceRecoveryWork'),
            systemCheck(systemVersions, 'ecologyState'),
            systemCheck(systemVersions, 'productionCatalog'),
            issueCheck('ecology-catalog-valid', ecologyIssues),
            issueCheck('production-catalog-valid', productionIssues),
        ]),
        group('semanticUiAuthority', [
            systemCheck(systemVersions, 'semanticEvents'),
            systemCheck(systemVersions, 'gameViewModels'),
            systemCheck(systemVersions, 'uiIntents'),
            systemCheck(systemVersions, 'domUi'),
            systemCheck(systemVersions, 'commandShell'),
        ]),
        group('worldAndContentValidation', [
            issueCheck('world-data-valid', worldIssues),
            issueCheck('route-catalog-valid', routeIssues),
            issueCheck('companion-catalog-valid', companionIssues),
            issueCheck('regional-content-packs-valid', contentPackIssues),
            issueCheck('content-pack-index-valid', packIndex.issues ?? []),
            systemCheck(systemVersions, 'contentPackValidation'),
        ]),
        group('phaseExitReadiness', [
            booleanCheck('data-contract', version.data >= 26, `Data ${version.data} must include the Phase 0.6 companion/content contracts.`),
            booleanCheck(
                'product-track',
                productVersionAtLeast(version.product, [0, 6, 900, 1]),
                `Product ${version.product} must be at or beyond the completed 0.6.900.1 exit gate.`,
            ),
            ...REQUIRED_DATABASES.map((databaseId) => databaseCheck(databases, databaseId)),
        ]),
    ];

    const issues = checks.flatMap((entry) => entry.issues.map((issue) => `[${entry.id}] ${issue}`));
    return Object.freeze({
        version: INTEGRATED_MECHANICS_GATE_VERSION,
        ready: issues.length === 0,
        productVersion: version.product,
        groups: Object.freeze(checks),
        issues: Object.freeze(issues),
        summary: Object.freeze({
            passedGroups: checks.filter((entry) => entry.ready).length,
            totalGroups: checks.length,
            databaseCount: databases.length,
            contentPackCount: packs.length,
            ownedRecordCount: packIndex.ownerCount ?? 0,
        }),
    });
}

export function validateIntegratedMechanicsGate(options = {}) {
    return [...evaluateIntegratedMechanicsGate(options).issues];
}

export function validateAdditiveStateNormalization() {
    const state = createNewGameState();
    const originalVersion = state.version;
    delete state.simulation;
    delete state.tasks;
    delete state.events;
    delete state.abilities;
    delete state.party;
    delete state.projects;
    delete state.resourceOpportunities;
    delete state.ecology;
    delete state.work;

    const issues = [];
    try {
        ensureSimulationControlState(state);
        ensureTimedTaskState(state);
        ensureSemanticEventState(state);
        ensureAbilityRuntimeState(state);
        ensurePartyState(state);
        ensureProjectState(state);
        ensureResourceOpportunityState(state);
        ensureEcologyState(state);
        ensureWorkState(state);
    } catch (error) {
        issues.push(`Additive normalization threw: ${error?.message ?? String(error)}`);
    }
    if (state.version !== originalVersion) issues.push(`Runtime normalization changed Game State ${originalVersion} to ${state.version}.`);
    issues.push(...validateGameState(state).map((issue) => `normalized state: ${issue}`));
    return issues;
}

function group(id, checks) {
    const issues = checks.filter((check) => !check.ready).map((check) => `${check.id}: ${check.issue}`);
    return Object.freeze({ id, ready: issues.length === 0, checks: Object.freeze(checks), issues: Object.freeze(issues) });
}

function systemCheck(systemVersions, systemId) {
    const value = systemVersions?.[systemId];
    const ready = typeof value === 'string' && value !== 'planned' && value !== '0.0.0';
    return booleanCheck(`system-${systemId}`, ready, `${systemId} must have an implemented subsystem version.`);
}

function databaseCheck(databases, databaseId) {
    const database = databases.find((entry) => entry.id === databaseId);
    const ready = Boolean(database && !String(database.status).includes('planned') && database.version !== '0.0.0');
    return booleanCheck(`database-${databaseId}`, ready, `${databaseId} must be an implemented or seeded Phase 0.6 database contract.`);
}

function issueCheck(id, issues) {
    const normalized = Array.isArray(issues) ? issues : [`validator returned non-array issues: ${String(issues)}`];
    return Object.freeze({ id, ready: normalized.length === 0, issue: normalized.length ? normalized.join(' | ') : '' });
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
