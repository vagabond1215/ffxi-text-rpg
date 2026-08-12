import test from 'node:test';
import assert from 'node:assert/strict';

import {
    SIMULATION_SUBSTRATE_GATE_GROUPS,
    evaluateSimulationSubstrateGate,
    validateSimulationSubstrateGate,
} from '../js/text/systems/simulationSubstrateGate.js';
import { VERSION } from '../js/text/version.js';


test('0.5 simulation substrate gate remains green after later product tracks begin', () => {
    const result = evaluateSimulationSubstrateGate();

    assert.equal(result.ready, true);
    assert.equal(result.productVersion, VERSION.product);
    assert.deepEqual(result.groups.map((group) => group.id), SIMULATION_SUBSTRATE_GATE_GROUPS);
    assert.equal(result.summary.passedGroups, result.summary.totalGroups);
    assert.ok(result.summary.packCount >= 3);
    assert.ok(result.summary.ownedRecordCount > 20);
    assert.ok(result.summary.routeCount >= 3);
    assert.ok(result.summary.transportServiceCount >= 2);
    assert.ok(result.summary.familyCount >= 3);
    assert.ok(result.summary.speciesCount >= 5);
    assert.ok(result.summary.populationCount >= 5);
    assert.ok(result.summary.gatheringSourceCount >= 3);
    assert.deepEqual(validateSimulationSubstrateGate(), []);
});

test('exit gate reports validator failures as structured group diagnostics', () => {
    const result = evaluateSimulationSubstrateGate({
        routeIssues: ['fixture route is invalid.'],
        ecologyIssues: ['fixture ecology is invalid.'],
        contentPackIssues: ['fixture pack is invalid.'],
    });

    assert.equal(result.ready, false);
    assert.equal(result.groups.find((group) => group.id === 'routesAndTransport').ready, false);
    assert.equal(result.groups.find((group) => group.id === 'ecologyAndGathering').ready, false);
    assert.equal(result.groups.find((group) => group.id === 'regionalContentScale').ready, false);
    assert.ok(result.issues.some((issue) => issue.includes('fixture route is invalid')));
    assert.ok(result.issues.some((issue) => issue.includes('fixture ecology is invalid')));
    assert.ok(result.issues.some((issue) => issue.includes('fixture pack is invalid')));
});

test('exit gate rejects a planned deterministic-simulation dependency without mutating production versions', () => {
    const result = evaluateSimulationSubstrateGate({
        systemVersions: {
            worldTime: '0.2.0',
            simulationControl: '0.3.0',
            timedTasks: 'planned',
            simulationInterrupts: '0.1.0',
            dayCycle: '0.1.0',
            semanticEvents: '0.1.0',
            worldIdentity: '0.1.1',
            projects: '0.1.0',
            resourceProvenance: '0.1.0',
            resourceOpportunities: '0.1.0',
            resourceRecovery: '0.1.0',
            contentPackValidation: '0.1.0',
            legacyCandidateNormalization: '0.1.0',
        },
    });

    const simulation = result.groups.find((group) => group.id === 'deterministicSimulation');
    assert.equal(result.ready, false);
    assert.equal(simulation.ready, false);
    assert.ok(simulation.issues.some((issue) => issue.includes('timedTasks')));
});

test('exit gate rejects product versions predating the completed 0.5.900 track', () => {
    const result = evaluateSimulationSubstrateGate({
        version: { ...VERSION, product: '0.5.800.9' },
    });

    assert.equal(result.ready, false);
    const identity = result.groups.find((group) => group.id === 'originalWorldIdentity');
    assert.ok(identity.issues.some((issue) => issue.includes('0.5.900')));
});
