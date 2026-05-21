import { STATUS_CATEGORIES } from '../data/systemConstants.js';

export function createStatusEffect(options = {}) {
    return {
        id: options.id,
        name: options.name ?? options.id,
        category: options.category ?? STATUS_CATEGORIES.BUFF,
        sourceId: options.sourceId ?? null,
        durationSeconds: options.durationSeconds ?? null,
        remainingSeconds: options.remainingSeconds ?? options.durationSeconds ?? null,
        tickSeconds: options.tickSeconds ?? null,
        tickAccumulator: 0,
        stackGroup: options.stackGroup ?? options.id,
        stackRule: options.stackRule ?? 'replace',
        modifiers: options.modifiers ?? {},
        tick: options.tick ?? null,
        flags: options.flags ?? {},
    };
}

export function applyStatus(entity, status) {
    const next = createStatusEffect(status);
    entity.statuses ??= [];

    const existingIndex = entity.statuses.findIndex((item) => item.stackGroup === next.stackGroup);
    if (existingIndex >= 0 && next.stackRule === 'replace') {
        entity.statuses.splice(existingIndex, 1, next);
        return entity;
    }

    if (existingIndex >= 0 && next.stackRule === 'ignore') {
        return entity;
    }

    entity.statuses.push(next);
    return entity;
}

export function removeStatus(entity, statusId) {
    entity.statuses = (entity.statuses ?? []).filter((status) => status.id !== statusId);
    return entity;
}

export function advanceStatuses(entity, elapsedSeconds) {
    const expired = [];
    for (const status of entity.statuses ?? []) {
        if (status.remainingSeconds !== null) {
            status.remainingSeconds = Math.max(0, status.remainingSeconds - elapsedSeconds);
        }

        if (status.tickSeconds) {
            status.tickAccumulator += elapsedSeconds;
            while (status.tickAccumulator >= status.tickSeconds) {
                status.tickAccumulator -= status.tickSeconds;
                applyStatusTick(entity, status);
            }
        }

        if (status.remainingSeconds === 0) expired.push(status.id);
    }

    if (expired.length) {
        entity.statuses = entity.statuses.filter((status) => !expired.includes(status.id));
    }

    return expired;
}

function applyStatusTick(entity, status) {
    if (!status.tick) return;
    if (status.tick.hp) {
        entity.resources.hp = Math.max(0, entity.resources.hp + status.tick.hp);
    }
    if (status.tick.mp) {
        entity.resources.mp = Math.max(0, entity.resources.mp + status.tick.mp);
    }
    if (status.tick.tp) {
        entity.resources.tp = Math.max(0, entity.resources.tp + status.tick.tp);
    }
}
