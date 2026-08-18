import { getPlace } from '../data/places.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { setPositionAndDiscover } from './atlasEngine.js';
import { getBlockingHandsOnTask } from './characterActivityEngine.js';
import { isSettlementLocality } from './localityEngine.js';
import { ensurePartyState, syncActivePartyLocation } from './partyEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { calculateCombatProfile } from './statEngine.js';
import { listTimedTasks, reconcileTimedTasks, startTimedTask, TIMED_TASK_STATUSES } from './timedTaskEngine.js';
import { ensureWorldTimeState } from './worldTimeEngine.js';

export const CAMPAIGN_RECOVERY_VERSION = 2;
export const CAMPAIGN_RECOVERY_KINDS = Object.freeze({
    FIELD: 'recovery.field',
    SETTLEMENT: 'recovery.settlement',
    DEFEAT: 'recovery.defeat',
});
export const CAMPAIGN_RECOVERY_DURATIONS = Object.freeze({
    [CAMPAIGN_RECOVERY_KINDS.FIELD]: 10 * 60,
    [CAMPAIGN_RECOVERY_KINDS.SETTLEMENT]: 60 * 60,
    [CAMPAIGN_RECOVERY_KINDS.DEFEAT]: 2 * 60 * 60,
});

const RECOVERY_KINDS = new Set(Object.values(CAMPAIGN_RECOVERY_KINDS));

export function createCampaignRecoveryModel(state) {
    if (!state?.player) return null;
    const profile = calculateCombatProfile(state.player);
    const activeTask = findActiveCampaignRecoveryTask(state);
    const defeated = isUnrecoveredDefeat(state);
    const hp = Math.max(0, Number(state.player.resources?.hp) || 0);
    const mp = Math.max(0, Number(state.player.resources?.mp) || 0);
    const maxHp = profile.resources.maxHp;
    const maxMp = profile.resources.maxMp;
    const playerInjured = hp < maxHp || mp < maxMp;
    const mode = activeTask?.kind
        ?? (defeated ? CAMPAIGN_RECOVERY_KINDS.DEFEAT
            : isSettlementLocality(state.currentPlaceId) ? CAMPAIGN_RECOVERY_KINDS.SETTLEMENT
                : CAMPAIGN_RECOVERY_KINDS.FIELD);
    const companionRecovery = createRecoverableCompanionModel(state, mode);
    const injured = playerInjured || companionRecovery.injuredCount > 0;
    const blockingTask = activeTask ? null : getBlockingHandsOnTask(state);
    const blockedReason = state.activeBattle?.phase === 'active'
        ? 'Finish the active battle before recovering.'
        : state.travel?.active
            ? 'Finish or stop the current journey before recovering.'
            : blockingTask
                ? `${blockingTask.label} is already in progress.`
                : !defeated && !injured
                    ? 'You and your nearby traveling company are already fully recovered.'
                    : null;

    return Object.freeze({
        version: CAMPAIGN_RECOVERY_VERSION,
        mode,
        active: Boolean(activeTask),
        taskId: activeTask?.id ?? null,
        defeated,
        injured,
        playerInjured,
        injuredCompanionCount: companionRecovery.injuredCount,
        companions: Object.freeze(companionRecovery.entries),
        available: !activeTask && !blockedReason,
        blockedReason,
        durationSeconds: activeTask?.durationSeconds ?? CAMPAIGN_RECOVERY_DURATIONS[mode],
        hp,
        maxHp,
        mp,
        maxMp,
        destinationPlaceId: mode === CAMPAIGN_RECOVERY_KINDS.DEFEAT ? getDefeatRecoveryDestinationId(state) : state.currentPlaceId,
    });
}

export function startCampaignRecovery(state) {
    const model = createCampaignRecoveryModel(state);
    if (!model) return failure('recovery.no-player', 'No player character is available to recover.');
    if (model.active) return failure('recovery.already-active', 'Recovery is already in progress.', { taskId: model.taskId });
    if (!model.available) return failure('recovery.unavailable', model.blockedReason ?? 'Recovery is not currently available.');

    const kind = model.mode;
    const destinationPlaceId = kind === CAMPAIGN_RECOVERY_KINDS.DEFEAT ? model.destinationPlaceId : null;
    const task = startTimedTask(state, {
        kind,
        label: recoveryLabel(kind),
        channel: 'recovery:character',
        durationSeconds: CAMPAIGN_RECOVERY_DURATIONS[kind],
        data: {
            recoveryVersion: CAMPAIGN_RECOVERY_VERSION,
            battleId: state.activeBattle?.id ?? null,
            fromPlaceId: state.currentPlaceId ?? null,
            destinationPlaceId,
            resolved: false,
        },
    });
    if (!task.ok) return task;

    const event = emitSemanticEvent(state, 'recovery.started', {
        taskId: task.data.task.id,
        kind,
        battleId: state.activeBattle?.id ?? null,
        fromPlaceId: state.currentPlaceId ?? null,
        destinationPlaceId,
        durationSeconds: CAMPAIGN_RECOVERY_DURATIONS[kind],
        injuredCompanionCount: model.injuredCompanionCount,
    }, { source: 'campaignRecoveryEngine' });

    return actionSuccess({
        action: 'recovery.start',
        code: 'recovery.started',
        outcome: 'started',
        data: { task: task.data.task, kind, eventId: event.id },
        display: { text: recoveryStartedText(kind, CAMPAIGN_RECOVERY_DURATIONS[kind]) },
    });
}

export function reconcileCampaignRecoveries(state) {
    reconcileTimedTasks(state);
    const completed = [];
    for (const task of state?.tasks?.records ?? []) {
        if (!RECOVERY_KINDS.has(task.kind)) continue;
        if (task.status !== TIMED_TASK_STATUSES.COMPLETED || task.data?.resolved === true) continue;
        const result = resolveCampaignRecoveryTask(state, task);
        if (result) completed.push(result);
    }
    return completed;
}

export function findActiveCampaignRecoveryTask(state) {
    return listTimedTasks(state, { status: TIMED_TASK_STATUSES.ACTIVE })
        .find((task) => RECOVERY_KINDS.has(task.kind)) ?? null;
}

export function isCampaignRecoveryTask(task) {
    return RECOVERY_KINDS.has(task?.kind);
}

function resolveCampaignRecoveryTask(state, task) {
    const beforePlaceId = state.currentPlaceId ?? null;
    const playerBefore = { ...state.player.resources };
    const companionsBefore = snapshotRecoverableCompanions(state, task.kind);
    if (task.kind === CAMPAIGN_RECOVERY_KINDS.DEFEAT) {
        resolveDefeatRecovery(state, task);
    } else if (task.kind === CAMPAIGN_RECOVERY_KINDS.SETTLEMENT) {
        restoreParty(state, { full: true }, { includeLocalInactive: true });
    } else {
        restoreParty(state, { missingRatio: 0.4 });
    }

    task.data.resolved = true;
    task.data.resolvedAtWorldSeconds = ensureWorldTimeState(state).totalSeconds;
    task.data.resolvedPlaceId = state.currentPlaceId ?? null;
    if (task.data.battleId && state.activeBattle?.id === task.data.battleId && state.activeBattle.phase === 'defeat') {
        state.activeBattle.recoveryResolved = true;
        state.activeBattle.recoveryTaskId = task.id;
    }

    const companionsAfter = snapshotRecoverableCompanions(state, task.kind);
    const event = emitSemanticEvent(state, 'recovery.completed', {
        taskId: task.id,
        kind: task.kind,
        battleId: task.data.battleId ?? null,
        fromPlaceId: beforePlaceId,
        toPlaceId: state.currentPlaceId ?? null,
        playerBefore,
        playerAfter: { ...state.player.resources },
        companionsBefore,
        companionsAfter,
    }, { source: 'campaignRecoveryEngine' });

    return Object.freeze({
        taskId: task.id,
        kind: task.kind,
        battleId: task.data.battleId ?? null,
        fromPlaceId: beforePlaceId,
        toPlaceId: state.currentPlaceId ?? null,
        playerBefore: Object.freeze(playerBefore),
        playerAfter: Object.freeze({ ...state.player.resources }),
        companionsBefore: Object.freeze(companionsBefore),
        companionsAfter: Object.freeze(companionsAfter),
        eventId: event.id,
    });
}

function resolveDefeatRecovery(state, task) {
    const destinationId = getPlace(task.data?.destinationPlaceId)?.id ?? getDefeatRecoveryDestinationId(state);
    const destination = getPlace(destinationId);
    if (destination) {
        setPositionAndDiscover(state, destination.id, destination.coordinateSystem.start, {
            important: ['Recovered after defeat'],
        });
        syncActivePartyLocation(state, destination.id);
    }
    restoreParty(state, { hpRatio: 0.35, mpRatio: 0.5, resetTp: true });
}

function restoreParty(state, options, scope = {}) {
    restoreEntity(state.player, options);
    const party = ensurePartyState(state);
    const companionIds = new Set(party.activeCompanionIds);
    if (scope.includeLocalInactive) {
        for (const companion of Object.values(party.companions)) {
            if (companion.locationId === state.currentPlaceId) companionIds.add(companion.id);
        }
    }
    for (const companionId of companionIds) {
        const companion = party.companions[companionId];
        if (companion) restoreEntity(companion, options);
    }
}

function restoreEntity(entity, options = {}) {
    if (!entity) return;
    const profile = calculateCombatProfile(entity);
    const maxHp = profile.resources.maxHp;
    const maxMp = profile.resources.maxMp;
    entity.resources ??= { hp: maxHp, mp: maxMp, tp: 0 };

    if (options.full) {
        entity.resources.hp = maxHp;
        entity.resources.mp = maxMp;
    } else if (Number.isFinite(options.hpRatio)) {
        entity.resources.hp = Math.max(1, Math.ceil(maxHp * options.hpRatio));
        entity.resources.mp = Math.max(0, Math.ceil(maxMp * (options.mpRatio ?? options.hpRatio)));
    } else {
        const ratio = Math.max(0, Math.min(1, Number(options.missingRatio) || 0));
        entity.resources.hp = Math.min(maxHp, Math.max(0, Number(entity.resources.hp) || 0) + Math.ceil((maxHp - Math.max(0, Number(entity.resources.hp) || 0)) * ratio));
        entity.resources.mp = Math.min(maxMp, Math.max(0, Number(entity.resources.mp) || 0) + Math.ceil((maxMp - Math.max(0, Number(entity.resources.mp) || 0)) * ratio));
    }
    if (options.resetTp) entity.resources.tp = 0;
}

function createRecoverableCompanionModel(state, mode) {
    const companions = recoverableCompanions(state, mode);
    const entries = companions.map((companion) => {
        const profile = calculateCombatProfile(companion);
        const hp = Math.max(0, Number(companion.resources?.hp) || 0);
        const mp = Math.max(0, Number(companion.resources?.mp) || 0);
        const maxHp = profile.resources.maxHp;
        const maxMp = profile.resources.maxMp;
        return Object.freeze({
            id: companion.id,
            name: companion.identity?.name ?? companion.id,
            active: ensurePartyState(state).activeCompanionIds.includes(companion.id),
            hp,
            maxHp,
            mp,
            maxMp,
            injured: hp < maxHp || mp < maxMp,
        });
    });
    return {
        entries,
        injuredCount: entries.filter((entry) => entry.injured).length,
    };
}

function recoverableCompanions(state, mode) {
    const party = ensurePartyState(state);
    const companionIds = new Set(party.activeCompanionIds);
    if (mode === CAMPAIGN_RECOVERY_KINDS.SETTLEMENT) {
        for (const companion of Object.values(party.companions)) {
            if (companion.locationId === state.currentPlaceId) companionIds.add(companion.id);
        }
    }
    return [...companionIds].map((id) => party.companions[id]).filter(Boolean);
}

function snapshotRecoverableCompanions(state, mode) {
    return recoverableCompanions(state, mode).map((companion) => Object.freeze({
        companionId: companion.id,
        hp: Math.max(0, Number(companion.resources?.hp) || 0),
        mp: Math.max(0, Number(companion.resources?.mp) || 0),
    }));
}

function isUnrecoveredDefeat(state) {
    return Boolean(state.activeBattle?.phase === 'defeat' && state.activeBattle.recoveryResolved !== true)
        || Math.max(0, Number(state.player?.resources?.hp) || 0) <= 0;
}

function getDefeatRecoveryDestinationId(state) {
    const knownHomes = state.player?.progression?.unlockedHomePoints ?? [];
    return knownHomes.find((placeId) => isSettlementLocality(placeId))
        ?? knownHomes.find((placeId) => getPlace(placeId))
        ?? state.currentPlaceId;
}

function recoveryLabel(kind) {
    if (kind === CAMPAIGN_RECOVERY_KINDS.DEFEAT) return 'Recover from defeat';
    if (kind === CAMPAIGN_RECOVERY_KINDS.SETTLEMENT) return 'Rest in safety';
    return 'Catch your breath';
}

function recoveryStartedText(kind, durationSeconds) {
    const minutes = Math.floor(durationSeconds / 60);
    if (kind === CAMPAIGN_RECOVERY_KINDS.DEFEAT) return `You are forced back toward safety. Recovering will take ${minutes} minutes before you can set out again.`;
    if (kind === CAMPAIGN_RECOVERY_KINDS.SETTLEMENT) return `You settle in for ${minutes} minutes of safe rest. Nearby companions who stay here recover with you.`;
    return `You stop for ${minutes} minutes to bind wounds, drink, and catch your breath before pressing on.`;
}

function failure(code, text, data = {}) {
    return actionFailure({
        action: 'recovery.start',
        code,
        outcome: 'blocked',
        data,
        display: { text },
    });
}
