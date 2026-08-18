import { DEFAULT_DAY_SUMMARY_LIMIT, validateDayCycleState } from './dayCycleEngine.js';
import { SECONDS_PER_DAY } from './worldTimeEngine.js';

export function validatePersistedDayCycle(dayCycle, worldTime = null) {
    const issues = [...validateDayCycleState(dayCycle)];
    if (issues.length) return issues;

    if (dayCycle.summaries.length > DEFAULT_DAY_SUMMARY_LIMIT) {
        issues.push(`dayCycle.summaries must retain at most ${DEFAULT_DAY_SUMMARY_LIMIT} records.`);
    }

    let previousDay = 0;
    for (const [index, summary] of dayCycle.summaries.entries()) {
        const path = `dayCycle.summaries[${index}]`;
        if (!isObject(summary)) {
            issues.push(`${path} must be an object.`);
            continue;
        }
        if (!Number.isInteger(summary.day) || summary.day < 1) issues.push(`${path}.day must be a positive integer.`);
        if (Number.isInteger(summary.day)) {
            if (summary.day <= previousDay) issues.push(`${path}.day must be strictly increasing.`);
            previousDay = Math.max(previousDay, summary.day);
            if (summary.startWorldSeconds !== (summary.day - 1) * SECONDS_PER_DAY) issues.push(`${path}.startWorldSeconds must match its canonical day boundary.`);
            if (summary.endWorldSeconds !== summary.day * SECONDS_PER_DAY) issues.push(`${path}.endWorldSeconds must match its canonical day boundary.`);
        }
        if (!nonNegativeInteger(summary.eventCount)) issues.push(`${path}.eventCount must be a non-negative integer.`);
        validateCountMap(summary.eventTypeCounts, `${path}.eventTypeCounts`, issues);
        validateCountMap(summary.categoryCounts, `${path}.categoryCounts`, issues);
        if (!Array.isArray(summary.notableEvents)) issues.push(`${path}.notableEvents must be an array.`);
    }

    if (previousDay > dayCycle.lastFinalizedDay) issues.push('dayCycle.lastFinalizedDay cannot precede a stored summary.');
    if (worldTime && nonNegativeInteger(worldTime.totalSeconds)) {
        const completedDay = Math.floor(worldTime.totalSeconds / SECONDS_PER_DAY);
        if (dayCycle.lastFinalizedDay > completedDay) issues.push('dayCycle.lastFinalizedDay cannot exceed completed canonical world days.');
    }
    return issues;
}

function validateCountMap(value, path, issues) {
    if (!isObject(value)) {
        issues.push(`${path} must be an object.`);
        return;
    }
    for (const [key, count] of Object.entries(value)) {
        if (!key || !nonNegativeInteger(count)) issues.push(`${path}.${String(key)} must be a non-negative integer count.`);
    }
}

function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function isObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
