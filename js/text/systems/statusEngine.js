import {
    ATTRIBUTE_KEYS,
    DERIVED_STAT_KEYS,
    ELEMENT_KEYS,
    RESOURCE_KEYS,
    STATUS_CATEGORIES,
} from '../data/systemConstants.js';

export function createStatusEffect(options = {}) {
    const appliedAtWorldSeconds = normalizeWorldSecond(options.appliedAtWorldSeconds);
    const durationSeconds = normalizeDuration(options.durationSeconds);
    const expiresAtWorldSeconds = normalizeWorldSecond(options.expiresAtWorldSeconds)
        ?? (appliedAtWorldSeconds !== null && durationSeconds !== null ? appliedAtWorldSeconds + durationSeconds : null);
    return {
        id: options.id,
        name: options.name ?? options.id,
        category: options.category ?? STATUS_CATEGORIES.BUFF,
        sourceId: options.sourceId ?? null,
        durationSeconds,
        remainingSeconds: options.remainingSeconds ?? durationSeconds,
        appliedAtWorldSeconds,
        expiresAtWorldSeconds,
        tickSeconds: options.tickSeconds ?? null,
        tickAccumulator: normalizeAccumulator(options.tickAccumulator),
        stackGroup: options.stackGroup ?? options.id,
        stackRule: options.stackRule ?? 'replace',
        modifiers: normalizeStatusModifiers(options.modifiers),
        tick: options.tick ?? null,
        flags: options.flags ?? {},
    };
}

export function normalizeStatusModifiers(rawModifiers = {}) {
    const raw = rawModifiers && typeof rawModifiers === 'object' && !Array.isArray(rawModifiers) ? rawModifiers : {};
    const normalized = {
        attributes: normalizeModifierCategory(raw.attributes, ATTRIBUTE_KEYS),
        resources: normalizeModifierCategory(raw.resources, RESOURCE_KEYS),
        derived: normalizeModifierCategory(raw.derived, DERIVED_STAT_KEYS),
        resistances: normalizeModifierCategory(raw.resistances, ELEMENT_KEYS),
    };

    for (const [key, value] of Object.entries(raw)) {
        if (['attributes', 'resources', 'derived', 'resistances'].includes(key)) continue;
        if (!Number.isFinite(Number(value))) continue;
        if (ATTRIBUTE_KEYS.includes(key)) normalized.attributes[key] = Number(value);
        else if (RESOURCE_KEYS.includes(key)) normalized.resources[key] = Number(value);
        else if (DERIVED_STAT_KEYS.includes(key)) normalized.derived[key] = Number(value);
        else if (ELEMENT_KEYS.includes(key)) normalized.resistances[key] = Number(value);
    }
    return normalized;
}

export function applyStatus(entity, status, options = {}) {
    const next = createStatusEffect({ ...status, appliedAtWorldSeconds: options.nowWorldSeconds ?? status.appliedAtWorldSeconds });
    entity.statuses ??= [];

    const existingIndex = entity.statuses.findIndex((item) => item.stackGroup === next.stackGroup);
    if (existingIndex >= 0 && next.stackRule === 'replace') {
        entity.statuses.splice(existingIndex, 1, next);
        return entity;
    }
    if (existingIndex >= 0 && next.stackRule === 'ignore') return entity;
    entity.statuses.push(next);
    return entity;
}

export function removeStatus(entity, statusId) {
    entity.statuses = (entity.statuses ?? []).filter((status) => status.id !== statusId);
    return entity;
}

export function reconcileStatusesAtWorldTime(entity, nowWorldSeconds) {
    const now = normalizeWorldSecond(nowWorldSeconds);
    if (now === null) throw new Error('Status reconciliation requires a non-negative integer world time.');
    const expired = [];

    for (const status of entity.statuses ?? []) {
        const duration = normalizeDuration(status.durationSeconds);
        let appliedAt = normalizeWorldSecond(status.appliedAtWorldSeconds);
        if (appliedAt === null && duration !== null) {
            appliedAt = now;
            status.appliedAtWorldSeconds = now;
        }
        if (status.expiresAtWorldSeconds === null || status.expiresAtWorldSeconds === undefined) {
            if (appliedAt !== null && duration !== null) status.expiresAtWorldSeconds = appliedAt + duration;
        }
        const expiresAt = normalizeWorldSecond(status.expiresAtWorldSeconds);
        if (expiresAt === null) continue;
        status.remainingSeconds = Math.max(0, expiresAt - now);
        if (expiresAt <= now) expired.push(status.id);
    }

    if (expired.length) entity.statuses = (entity.statuses ?? []).filter((status) => !expired.includes(status.id));
    return expired;
}

export function advanceStatuses(entity, elapsedSeconds) {
    const expired = [];
    for (const status of entity.statuses ?? []) {
        if (status.remainingSeconds !== null) status.remainingSeconds = Math.max(0, status.remainingSeconds - elapsedSeconds);
        if (status.tickSeconds) {
            status.tickAccumulator += elapsedSeconds;
            while (status.tickAccumulator >= status.tickSeconds) {
                status.tickAccumulator -= status.tickSeconds;
                applyStatusTick(entity, status);
            }
        }
        if (status.remainingSeconds === 0) expired.push(status.id);
    }
    if (expired.length) entity.statuses = entity.statuses.filter((status) => !expired.includes(status.id));
    return expired;
}

function applyStatusTick(entity, status) {
    if (!status.tick) return;
    if (status.tick.hp) entity.resources.hp = Math.max(0, entity.resources.hp + status.tick.hp);
    if (status.tick.mp) entity.resources.mp = Math.max(0, entity.resources.mp + status.tick.mp);
    if (status.tick.tp) entity.resources.tp = Math.max(0, entity.resources.tp + status.tick.tp);
}

function normalizeModifierCategory(value, allowedKeys) {
    const result = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
    for (const [key, amount] of Object.entries(value)) {
        if (allowedKeys.includes(key) && Number.isFinite(Number(amount))) result[key] = Number(amount);
    }
    return result;
}

function normalizeAccumulator(value) {
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : 0;
}

function normalizeWorldSecond(value) {
    if (value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : null;
}

function normalizeDuration(value) {
    if (value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 ? number : null;
}
