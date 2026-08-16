import { getPlace } from '../data/places.js';
import { createCampaignRecoveryModel } from './campaignRecoveryEngine.js';
import {
    listResourceOpportunities,
    RESOURCE_OPPORTUNITY_STATUSES,
    RESOURCE_RECOVERY_STATUSES,
} from './resourceOpportunityEngine.js';
import { checkCharacterResourceRecovery } from './resourceRecoveryWorkAdapter.js';

export const PLAYER_DANGER_RECOVERY_VERSION = 2;

export function decoratePlayerDangerRecoveryModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const entries = [...(baseModel.entries ?? [])];
    const recovery = createRecoveryOpportunity(state);
    const resource = createBattleResourceOpportunity(state);
    if (recovery) entries.push(recovery);
    if (resource) entries.push(resource);
    if (!recovery && !resource) return baseModel;

    const activeAction = entries.find((entry) => entry.status === 'active' && entry.action);
    const recommended = activeAction
        ?? entries.find((entry) => entry.status === 'ready' && entry.action)
        ?? entries.find((entry) => entry.status === 'ready')
        ?? entries.find((entry) => entry.status === 'active')
        ?? entries.find((entry) => entry.status === 'available')
        ?? null;

    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 7),
        dangerRecoveryVersion: PLAYER_DANGER_RECOVERY_VERSION,
        recommendedOpportunityId: recommended?.id ?? baseModel.recommendedOpportunityId ?? null,
        entries: Object.freeze(entries),
    });
}

export function createRecoveryOpportunity(state) {
    const model = createCampaignRecoveryModel(state);
    if (!model || (!model.active && !model.defeated && !model.injured)) return null;
    const activeBattle = state.activeBattle?.phase === 'active';
    const place = getPlace(state.currentPlaceId);
    const isDefeat = model.defeated || model.mode === 'recovery.defeat';
    const isSettlement = model.mode === 'recovery.settlement';
    const status = model.active ? 'active' : model.available ? 'ready' : 'blocked';
    const label = isDefeat ? 'Recover from defeat' : isSettlement ? 'Rest in safety' : 'Catch your breath';
    const action = model.active
        ? opportunityAction(`finish-${model.taskId}`, `Finish · ${label}`, 'activity.advanceToCompletion')
        : model.available
            ? opportunityAction('start-campaign-recovery', label, 'recovery.start')
            : null;
    const minutes = Math.floor(model.durationSeconds / 60);
    const summary = isDefeat
        ? `Defeat has left you unable to continue. Recovering will take ${minutes} minutes and bring your party back to ${getPlace(model.destinationPlaceId)?.name ?? 'known safety'}, but you will not return at full strength.`
        : isSettlement
            ? `${place?.name ?? 'This safe locality'} gives you enough safety to rest fully. The hour still passes while you recover.`
            : `You are hurt in the field. Catching your breath will restore part of what you have lost and take ${minutes} minutes.`;

    return opportunity({
        id: `recovery-${model.taskId ?? state.activeBattle?.id ?? state.currentPlaceId}`,
        category: 'recovery',
        title: label,
        summary,
        reason: 'Combat consequence belongs to the same fictional-time budget as livelihood, travel, and social commitments; recovery is not a free reset.',
        progress: isDefeat
            ? `Get back on your feet and resume from ${getPlace(model.destinationPlaceId)?.name ?? 'a known safe locality'}.`
            : `HP ${model.hp}/${model.maxHp} · MP ${model.mp}/${model.maxMp}`,
        status: activeBattle ? 'blocked' : status,
        requirements: [
            requirement('No active battle', !activeBattle),
            requirement(`Spend ${minutes} minutes recovering`, false),
        ],
        blockers: activeBattle ? ['Finish the active battle before recovering.'] : model.blockedReason ? [model.blockedReason] : [],
        action: activeBattle ? null : action,
        regionLabel: place?.region ?? null,
        knowledgeSource: 'current injuries and battle aftermath',
    });
}

export function createBattleResourceOpportunity(state) {
    const local = listResourceOpportunities(state)
        .filter((entry) => entry.placeId === state.currentPlaceId)
        .filter((entry) => entry.status === RESOURCE_OPPORTUNITY_STATUSES.AVAILABLE)
        .sort((a, b) => String(b.id).localeCompare(String(a.id)))[0] ?? null;
    if (!local) return null;

    const activeAction = local.actions.find((entry) => entry.status === RESOURCE_RECOVERY_STATUSES.ACTIVE) ?? null;
    const availableAction = local.actions.find((entry) => entry.status === RESOURCE_RECOVERY_STATUSES.AVAILABLE) ?? null;
    if (!activeAction && !availableAction) return null;
    const regionLabel = getPlace(local.placeId)?.region ?? getPlace(state.currentPlaceId)?.region ?? null;

    if (activeAction) {
        return opportunity({
            id: `battle-resource-${local.id}`,
            category: 'recovery',
            title: `Finish recovering from ${local.sourceName}`,
            summary: `You have already begun ${activeAction.id} work on the defeated ${local.sourceName}. Finish the work before moving on.`,
            reason: 'Victory rewards progression immediately, but physical materials still require their own tool, time, proficiency, condition, and inventory path.',
            progress: `${capitalize(activeAction.id)} is underway. The useful material, if recovered successfully, will be added when the work finishes.`,
            status: 'active',
            requirements: [requirement(`Finish ${activeAction.id}`, false)],
            action: opportunityAction(`finish-resource-${local.id}`, `Finish · ${activeAction.id}`, 'activity.advanceToCompletion'),
            regionLabel,
            knowledgeSource: `defeated ${local.sourceName}`,
        });
    }

    const check = checkCharacterResourceRecovery(state, local.id, availableAction.id);
    return opportunity({
        id: `battle-resource-${local.id}`,
        category: 'recovery',
        title: `Recover useful material from ${local.sourceName}`,
        summary: check.ok
            ? `${capitalize(availableAction.id)} is possible here if the material is worth the time and inventory space.`
            : `${local.sourceName} can still yield useful material, but your current tools or preparation are not enough for the work.`,
        reason: 'The Journal exposes only a resource opportunity the character actually created through victory and keeps its tool/proficiency blockers authoritative.',
        progress: local.outputs.length
            ? `Possible recovered material: ${local.outputs.map((output) => output.name).join(', ')}.`
            : 'No recoverable material remains.',
        status: check.ok ? 'ready' : 'blocked',
        requirements: [requirement(`${capitalize(availableAction.id)} ${local.sourceName}`, check.ok)],
        blockers: check.ok ? [] : [check.display?.text ?? check.reason ?? 'Recovery requirements are not met.'],
        action: check.ok
            ? opportunityAction(`recover-${local.id}-${availableAction.id}`, `${capitalize(availableAction.id)} · ${local.sourceName}`, 'resource.recovery.start', {
                opportunityId: local.id,
                actionId: availableAction.id,
            })
            : null,
        regionLabel,
        knowledgeSource: `defeated ${local.sourceName}`,
    });
}

function opportunity(definition) {
    return Object.freeze({
        ...definition,
        blockers: Object.freeze([...(definition.blockers ?? [])]),
        requirements: Object.freeze((definition.requirements ?? []).map((entry) => Object.freeze({ ...entry }))),
        action: definition.action ? Object.freeze({ ...definition.action, payload: Object.freeze({ ...(definition.action.payload ?? {}) }) }) : null,
    });
}

function opportunityAction(id, label, intent, payload = {}) {
    return { id, label, intent, payload };
}

function requirement(label, met) {
    return { label, met: Boolean(met) };
}

function capitalize(value) {
    const text = String(value ?? '').trim();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}
