import {
    getNpcScheduleByNpcId,
    getNpcScheduleByPoiId,
    listNpcSchedules,
    NPC_SCHEDULE_DATA_VERSION,
} from '../data/npcSchedules.js';
import { getPlace } from '../data/places.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';
import { createSeedNpcs } from '../data/seedEntities.js';
import {
    ensureWorldTimeState,
    getWorldTimeParts,
    SECONDS_PER_DAY,
} from './worldTimeEngine.js';

export const NPC_SCHEDULE_ENGINE_VERSION = 1;

export function getNpcScheduleStatus(state, npcId) {
    const schedule = getNpcScheduleByNpcId(npcId);
    return createScheduleStatus(state, schedule);
}

export function getPoiScheduleStatus(state, poiOrId) {
    const poiId = typeof poiOrId === 'string' ? poiOrId : poiOrId?.id;
    const schedule = getNpcScheduleByPoiId(poiId);
    return createScheduleStatus(state, schedule);
}

export function isNpcAvailableNow(state, npcId) {
    return getNpcScheduleStatus(state, npcId).available;
}

export function isPoiAvailableNow(state, poiOrId) {
    return getPoiScheduleStatus(state, poiOrId).available;
}

export function describeNpcScheduleStatus(status) {
    if (!status?.scheduled) return 'Available now.';
    if (status.available) {
        return `${status.npcName} is here now · ${status.currentWindowLabel} · until ${formatClock(status.currentWindowEndSecond)}.`;
    }
    return `${status.unavailableText} Available ${status.windowSummary}; returns ${formatClock(status.nextAvailableSecondOfDay)}.`;
}

export function validateNpcScheduleCatalog() {
    const issues = [];
    const ids = new Set();
    const npcIds = new Set(createSeedNpcs().map((npc) => npc.id));
    const poiIds = new Set();

    if (NPC_SCHEDULE_DATA_VERSION !== 1) issues.push('npcSchedules data version must be 1.');

    for (const schedule of listNpcSchedules()) {
        if (!schedule.id) issues.push('npc schedule is missing id.');
        else if (ids.has(schedule.id)) issues.push(`duplicate npc schedule id ${schedule.id}.`);
        else ids.add(schedule.id);

        if (!npcIds.has(schedule.npcId)) issues.push(`${schedule.id} references unknown NPC ${schedule.npcId}.`);
        const poi = getPointOfInterest(schedule.poiId);
        if (!poi) issues.push(`${schedule.id} references unknown POI ${schedule.poiId}.`);
        if (poi && poi.placeId !== schedule.placeId) issues.push(`${schedule.id} POI place does not match ${schedule.placeId}.`);
        if (!getPlace(schedule.placeId)) issues.push(`${schedule.id} references unknown place ${schedule.placeId}.`);
        if (poiIds.has(schedule.poiId)) issues.push(`multiple npc schedules claim POI ${schedule.poiId}.`);
        else poiIds.add(schedule.poiId);

        if (!Array.isArray(schedule.windows) || !schedule.windows.length) {
            issues.push(`${schedule.id} must define at least one daily window.`);
            continue;
        }

        let previousEnd = -1;
        for (const [index, window] of schedule.windows.entries()) {
            if (!Number.isInteger(window.startSecond) || !Number.isInteger(window.endSecond)) {
                issues.push(`${schedule.id}.windows.${index} must use integer seconds.`);
                continue;
            }
            if (window.startSecond < 0 || window.startSecond >= SECONDS_PER_DAY) issues.push(`${schedule.id}.windows.${index}.startSecond is outside the day.`);
            if (window.endSecond <= 0 || window.endSecond > SECONDS_PER_DAY) issues.push(`${schedule.id}.windows.${index}.endSecond is outside the day.`);
            if (window.endSecond <= window.startSecond) issues.push(`${schedule.id}.windows.${index} must end after it starts.`);
            if (window.startSecond < previousEnd) issues.push(`${schedule.id}.windows.${index} overlaps or is out of order.`);
            previousEnd = window.endSecond;
        }
    }

    return issues;
}

function createScheduleStatus(state, schedule) {
    if (!schedule) {
        return Object.freeze({
            scheduled: false,
            available: true,
            scheduleId: null,
            npcId: null,
            npcName: null,
            poiId: null,
            placeId: null,
            currentWindowLabel: null,
            currentWindowEndSecond: null,
            nextAvailableAtWorldSeconds: null,
            nextAvailableInSeconds: 0,
            nextAvailableSecondOfDay: null,
            windowSummary: null,
            unavailableText: null,
        });
    }

    const worldTime = ensureWorldTimeState(state);
    const parts = getWorldTimeParts(worldTime);
    const now = worldTime.totalSeconds;
    const currentWindow = schedule.windows.find((window) => parts.secondsOfDay >= window.startSecond && parts.secondsOfDay < window.endSecond) ?? null;
    const npcName = (state?.npcs ?? []).find((npc) => npc.id === schedule.npcId)?.identity?.name ?? schedule.npcId;

    if (currentWindow) {
        return Object.freeze({
            scheduled: true,
            available: true,
            scheduleId: schedule.id,
            npcId: schedule.npcId,
            npcName,
            poiId: schedule.poiId,
            placeId: schedule.placeId,
            currentWindowLabel: currentWindow.label,
            currentWindowEndSecond: currentWindow.endSecond,
            nextAvailableAtWorldSeconds: now,
            nextAvailableInSeconds: 0,
            nextAvailableSecondOfDay: parts.secondsOfDay,
            windowSummary: summarizeWindows(schedule.windows),
            unavailableText: schedule.unavailableText,
        });
    }

    const laterToday = schedule.windows.find((window) => window.startSecond > parts.secondsOfDay) ?? null;
    const nextWindow = laterToday ?? schedule.windows[0];
    const nextAvailableInSeconds = laterToday
        ? nextWindow.startSecond - parts.secondsOfDay
        : (SECONDS_PER_DAY - parts.secondsOfDay) + nextWindow.startSecond;

    return Object.freeze({
        scheduled: true,
        available: false,
        scheduleId: schedule.id,
        npcId: schedule.npcId,
        npcName,
        poiId: schedule.poiId,
        placeId: schedule.placeId,
        currentWindowLabel: null,
        currentWindowEndSecond: null,
        nextAvailableAtWorldSeconds: now + nextAvailableInSeconds,
        nextAvailableInSeconds,
        nextAvailableSecondOfDay: nextWindow.startSecond,
        windowSummary: summarizeWindows(schedule.windows),
        unavailableText: schedule.unavailableText,
    });
}

function summarizeWindows(windows) {
    return windows.map((window) => `${formatClock(window.startSecond)}–${formatClock(window.endSecond)}`).join(', ');
}

function formatClock(secondOfDay) {
    const safe = Math.max(0, Math.min(SECONDS_PER_DAY, Number(secondOfDay) || 0));
    const hour = Math.floor(safe / 3600);
    const minute = Math.floor((safe % 3600) / 60);
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
