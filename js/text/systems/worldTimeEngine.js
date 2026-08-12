import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';

export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
export const SECONDS_PER_DAY = SECONDS_PER_HOUR * HOURS_PER_DAY;

export function createWorldTimeState(options = {}) {
    const totalSeconds = options.totalSeconds ?? 0;
    if (!isValidTotalSeconds(totalSeconds)) {
        throw new Error('worldTime.totalSeconds must be a non-negative integer.');
    }
    return { totalSeconds };
}

export function ensureWorldTimeState(state, options = {}) {
    if (!state || typeof state !== 'object') throw new Error('World time requires game state.');
    if (!state.worldTime || typeof state.worldTime !== 'object' || Array.isArray(state.worldTime)) {
        state.worldTime = createWorldTimeState(options);
    }
    if (!isValidTotalSeconds(state.worldTime.totalSeconds)) {
        throw new Error('worldTime.totalSeconds must be a non-negative integer.');
    }
    return state.worldTime;
}

export function getWorldTimeParts(worldTimeOrState) {
    const worldTime = resolveWorldTime(worldTimeOrState);
    const totalSeconds = worldTime.totalSeconds;
    const dayIndex = Math.floor(totalSeconds / SECONDS_PER_DAY);
    const secondsOfDay = totalSeconds % SECONDS_PER_DAY;
    const hour = Math.floor(secondsOfDay / SECONDS_PER_HOUR);
    const minute = Math.floor((secondsOfDay % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
    const second = secondsOfDay % SECONDS_PER_MINUTE;

    return Object.freeze({
        totalSeconds,
        day: dayIndex + 1,
        dayIndex,
        secondsOfDay,
        hour,
        minute,
        second,
    });
}

export function describeWorldTime(worldTimeOrState) {
    const parts = getWorldTimeParts(worldTimeOrState);
    return `Day ${parts.day}, ${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second)}`;
}

export function advanceWorldTime(state, seconds, options = {}) {
    const amount = Number(seconds);
    if (!Number.isInteger(amount) || amount < 0) {
        return actionFailure({
            action: 'time.advance',
            code: 'time.invalid-advance',
            outcome: 'rejected',
            data: { requestedSeconds: seconds },
            display: { text: 'World-time advancement must be a non-negative whole number of seconds.' },
        });
    }

    const worldTime = ensureWorldTimeState(state);
    const before = worldTime.totalSeconds;
    const beforeParts = getWorldTimeParts(worldTime);
    worldTime.totalSeconds += amount;
    const afterParts = getWorldTimeParts(worldTime);
    const crossedDays = afterParts.dayIndex - beforeParts.dayIndex;

    let event = null;
    if (options.emitEvent !== false) {
        event = emitSemanticEvent(state, 'time.advanced', {
            secondsAdvanced: amount,
            beforeTotalSeconds: before,
            afterTotalSeconds: worldTime.totalSeconds,
            crossedDays,
        }, { source: 'worldTimeEngine' });
    }

    return actionSuccess({
        action: 'time.advance',
        code: 'time.advanced',
        outcome: 'advanced',
        data: {
            secondsAdvanced: amount,
            beforeTotalSeconds: before,
            afterTotalSeconds: worldTime.totalSeconds,
            crossedDays,
            day: afterParts.day,
            hour: afterParts.hour,
            minute: afterParts.minute,
            second: afterParts.second,
            eventId: event?.id ?? null,
        },
        display: { text: `Advanced ${amount}s. ${describeWorldTime(worldTime)}` },
    });
}

export function validateWorldTimeState(worldTime) {
    const issues = [];
    if (!worldTime || typeof worldTime !== 'object' || Array.isArray(worldTime)) {
        return ['worldTime must be an object.'];
    }
    if (!isValidTotalSeconds(worldTime.totalSeconds)) {
        issues.push('worldTime.totalSeconds must be a non-negative integer.');
    }
    return issues;
}

function resolveWorldTime(value) {
    const worldTime = value?.worldTime ?? value;
    if (!worldTime || typeof worldTime !== 'object' || Array.isArray(worldTime)) {
        throw new Error('World time must be an object or game state containing worldTime.');
    }
    if (!isValidTotalSeconds(worldTime.totalSeconds)) {
        throw new Error('worldTime.totalSeconds must be a non-negative integer.');
    }
    return worldTime;
}

function isValidTotalSeconds(value) {
    return Number.isInteger(value) && value >= 0;
}

function pad2(value) {
    return String(value).padStart(2, '0');
}
