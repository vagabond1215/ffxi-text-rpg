import { getCapability } from '../data/capabilities.js';
import { getPointOfInterest, listPointsOfInterest } from '../data/pointsOfInterest.js';
import { createSeedNpcs } from '../data/seedEntities.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { evaluateLearningRequirements, learnCapability, knowsCapability } from './capabilityEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const TRAINING_SERVICE_VERSION = 1;

export function validateTrainingServiceDefinitions() {
    const issues = [];
    const npcIds = new Set(createSeedNpcs().map((npc) => npc.id));
    for (const poi of listPointsOfInterest().filter((entry) => (entry.trainingCapabilityIds ?? []).length || entry.trainingNpcId)) {
        if (!(poi.tags ?? []).includes('combatTraining')) issues.push(`${poi.id} training service must carry combatTraining tag.`);
        if (!(poi.actions ?? []).includes('training')) issues.push(`${poi.id} training service must expose training action.`);
        if (typeof poi.trainingNpcId !== 'string' || !poi.trainingNpcId.trim()) issues.push(`${poi.id}.trainingNpcId must be a non-empty string.`);
        else if (!npcIds.has(poi.trainingNpcId)) issues.push(`${poi.id}.trainingNpcId references unknown NPC ${poi.trainingNpcId}.`);
        if (!Array.isArray(poi.trainingCapabilityIds) || !poi.trainingCapabilityIds.length) {
            issues.push(`${poi.id}.trainingCapabilityIds must be a non-empty array.`);
            continue;
        }
        if (new Set(poi.trainingCapabilityIds).size !== poi.trainingCapabilityIds.length) issues.push(`${poi.id}.trainingCapabilityIds contains duplicates.`);
        for (const capabilityId of poi.trainingCapabilityIds) {
            const capability = getCapability(capabilityId);
            if (!capability) issues.push(`${poi.id} references unknown training capability ${capabilityId}.`);
            else if (capability.type !== 'technique') issues.push(`${poi.id} combat training capability ${capabilityId} must be a technique.`);
        }
    }
    return issues;
}

export function listTrainingOptionsAtPoi(state, poiId = state?.activePoiId) {
    const poi = getPointOfInterest(poiId);
    if (!poi || !(poi.trainingCapabilityIds ?? []).length) return [];
    return poi.trainingCapabilityIds
        .map((capabilityId) => getCapability(capabilityId))
        .filter(Boolean)
        .map((capability) => {
            const known = knowsCapability(state?.player, capability.id);
            const learning = known ? { ok: true } : evaluateLearningRequirements(state?.player, capability);
            return Object.freeze({
                capabilityId: capability.id,
                name: capability.name,
                type: capability.type,
                known,
                eligible: Boolean(learning.ok),
                reason: learning.ok ? '' : learning.reason,
                requiredSkills: Object.freeze((capability.use?.requiredSkills ?? []).map((entry) => Object.freeze({ ...entry }))),
            });
        });
}

export function describeTrainingServiceAtPoi(state, poiId = state?.activePoiId) {
    const context = validateTrainingContext(state, poiId, { requireActivePoi: false });
    if (!context.ok) return context.display.text;
    const options = listTrainingOptionsAtPoi(state, context.poi.id);
    if (!options.length) return `${context.poi.name} has no combat instruction available.`;

    return [
        `${context.poi.name} — Forge-Road combat instruction`,
        'Instruction teaches character-owned techniques through the existing capability system. Weapon proficiency still determines whether you can execute a learned technique.',
        ...options.map((entry) => {
            const status = entry.known ? 'known' : entry.eligible ? 'ready to learn' : entry.reason;
            const use = entry.requiredSkills.length
                ? ` | use: ${entry.requiredSkills.map((skill) => `${skill.skillId} ${skill.min}`).join(', ')}`
                : '';
            return `- ${entry.name}: ${status}${use}`;
        }),
    ].join('\n');
}

export function trainCapabilityAtPoi(state, capabilityQuery, poiId = state?.activePoiId) {
    const context = validateTrainingContext(state, poiId, { requireActivePoi: true });
    if (!context.ok) return context;
    const query = normalize(capabilityQuery);
    if (!query) return fail('training.capability-required', 'Choose a technique to train.');

    const capability = (context.poi.trainingCapabilityIds ?? [])
        .map((capabilityId) => getCapability(capabilityId))
        .filter(Boolean)
        .find((entry) => normalize(entry.id) === query || normalize(entry.name) === query || normalize(entry.name).includes(query));
    if (!capability) return fail('training.capability-unavailable', `${context.poi.name} does not teach ${String(capabilityQuery ?? '').trim() || 'that technique'}.`);

    if (knowsCapability(state.player, capability.id)) {
        return actionSuccess({
            action: 'training.learn',
            code: 'training.already-known',
            outcome: 'unchanged',
            data: { version: TRAINING_SERVICE_VERSION, poiId: context.poi.id, instructorNpcId: context.instructor.id, capabilityId: capability.id },
            display: { text: `${capability.name} is already part of your training.` },
        });
    }

    const learning = evaluateLearningRequirements(state.player, capability);
    if (!learning.ok) {
        return fail('training.learning-requirement', `${context.instructor.identity?.name ?? context.poi.name} can demonstrate ${capability.name}, but your current discipline training has not reached its learning path yet.`, { capabilityId: capability.id, reason: learning.reason });
    }

    const now = ensureWorldTimeState(state).totalSeconds;
    const learned = learnCapability(state.player, capability.id, { source: 'instruction', worldSeconds: now });
    if (!learned.ok) return fail('training.learn-failed', learned.reason ?? `Could not learn ${capability.name}.`);

    const event = emitSemanticEvent(state, 'training.capability-learned', {
        poiId: context.poi.id,
        instructorNpcId: context.instructor.id,
        capabilityId: capability.id,
        learnedFromDisciplineId: learned.record?.learnedFromDisciplineId ?? null,
    }, { source: 'trainingServiceEngine' });

    return actionSuccess({
        action: 'training.learn',
        code: 'training.capability-learned',
        outcome: 'learned',
        data: {
            version: TRAINING_SERVICE_VERSION,
            poiId: context.poi.id,
            instructorNpcId: context.instructor.id,
            capabilityId: capability.id,
            learnedFromDisciplineId: learned.record?.learnedFromDisciplineId ?? null,
            eventId: event.id,
        },
        display: { text: `${context.instructor.identity?.name ?? context.poi.name} drills the movement until you can carry ${capability.name} as your own learned technique.` },
    });
}

function validateTrainingContext(state, poiId, options = {}) {
    if (!state?.player) return fail('training.no-player', 'No player is available for training.');
    if (state.activeBattle?.phase === 'active') return fail('training.in-combat', 'Finish the current battle before training.');
    if (state.travel?.active) return fail('training.travel-active', 'Finish or stop the current journey before training.');

    const poi = getPointOfInterest(poiId);
    if (!poi || !(poi.trainingCapabilityIds ?? []).length || !poi.trainingNpcId) return fail('training.service-unavailable', 'No combat training service is available here.');
    if (poi.placeId !== state.currentPlaceId) return fail('training.wrong-place', `Return to ${poi.placeId} for that instruction.`);
    if (options.requireActivePoi !== false && state.activePoiId !== poi.id) return fail('training.trainer-not-engaged', `Reach and engage with ${poi.name} before training.`);

    const instructor = (state.npcs ?? []).find((npc) => npc.id === poi.trainingNpcId && npc.identity?.locationId === poi.placeId);
    if (!instructor) return fail('training.instructor-absent', 'The instructor is not present.');
    return { ok: true, poi, instructor };
}

function fail(code, text, data = {}) {
    return actionFailure({ action: 'training.learn', code, outcome: 'blocked', data, display: { text } });
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/[\s_-]+/g, '');
}