export const COMBAT_ATTENTION_VERSION = 1;

export const DEFAULT_ATTENTION_POLICY = Object.freeze({
    concentrationExponent: 3,
    switchRatio: 1.25,
    currentTargetWeightMultiplier: 1.2,
});

export function createBattleAttentionState(combatants = [], options = {}) {
    const nowWorldSeconds = normalizeWorldSeconds(options.nowWorldSeconds);
    const state = {
        version: COMBAT_ATTENTION_VERSION,
        byEnemyId: {},
    };
    populateAttentionState(state, combatants, nowWorldSeconds);
    return state;
}

export function ensureBattleAttentionState(battle, options = {}) {
    if (!battle || typeof battle !== 'object') return null;
    const nowWorldSeconds = normalizeWorldSeconds(options.nowWorldSeconds);
    if (!isObject(battle.enmity) || battle.enmity.version !== COMBAT_ATTENTION_VERSION || !isObject(battle.enmity.byEnemyId)) {
        battle.enmity = createBattleAttentionState(battle.combatants ?? [], { nowWorldSeconds });
        return battle.enmity;
    }
    populateAttentionState(battle.enmity, battle.combatants ?? [], nowWorldSeconds);
    return battle.enmity;
}

export function setAttentionPolicy(battle, enemyId, patch = {}, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record) return null;
    record.policy = normalizePolicy({ ...record.policy, ...patch });
    return snapshotPolicy(record.policy);
}

export function setAttentionBaseline(battle, enemyId, actorId, definition = {}, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record) return null;
    const entry = record.entries[actorId];
    if (!entry) return null;
    reconcileEntry(entry, normalizeWorldSeconds(options.nowWorldSeconds));
    if (definition.baseline !== undefined) entry.baseline = nonNegativeNumber(definition.baseline);
    if (definition.floor !== undefined) entry.floor = nonNegativeNumber(definition.floor);
    if (definition.decayPerSecond !== undefined) entry.decayPerSecond = nonNegativeNumber(definition.decayPerSecond);
    return snapshotEntry(entry, normalizeWorldSeconds(options.nowWorldSeconds));
}

export function addEnmity(battle, enemyId, actorId, amount, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record) return null;
    const entry = record.entries[actorId];
    if (!entry) return null;
    const nowWorldSeconds = normalizeWorldSeconds(options.nowWorldSeconds);
    reconcileEntry(entry, nowWorldSeconds);
    entry.transient = Math.max(0, entry.transient + Number(amount || 0));
    entry.lastUpdatedAtWorldSeconds = nowWorldSeconds;
    return snapshotEntry(entry, nowWorldSeconds);
}

export function setAggroTarget(battle, enemyId, targetId, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record) return null;
    record.aggroTargetId = isCredibleActor(battle, targetId) ? targetId : null;
    return record.aggroTargetId;
}

export function setFixation(battle, enemyId, targetId, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record || !isCredibleActor(battle, targetId)) return null;
    const expiresAtWorldSeconds = options.expiresAtWorldSeconds === null || options.expiresAtWorldSeconds === undefined
        ? null
        : normalizeWorldSeconds(options.expiresAtWorldSeconds);
    record.fixation = {
        targetId,
        reason: String(options.reason ?? 'priority'),
        expiresAtWorldSeconds,
    };
    return { ...record.fixation };
}

export function clearFixation(battle, enemyId, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record) return false;
    const hadFixation = Boolean(record.fixation);
    record.fixation = null;
    return hadFixation;
}

export function getEnemyAttentionSnapshot(battle, enemyId, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record) return null;
    const nowWorldSeconds = normalizeWorldSeconds(options.nowWorldSeconds);
    expireFixationIfNeeded(battle, record, nowWorldSeconds);
    const candidates = livingCredibleActors(battle);
    const rows = candidates.map((actor) => {
        const entry = record.entries[actor.id];
        const effectiveEnmity = effectiveEntryEnmity(entry, nowWorldSeconds);
        return { actorId: actor.id, effectiveEnmity };
    });
    const totalEnmity = rows.reduce((sum, row) => sum + row.effectiveEnmity, 0);
    const equalFocus = rows.length ? 1 / rows.length : 0;
    for (const row of rows) {
        row.focus = totalEnmity > 0 ? row.effectiveEnmity / totalEnmity : equalFocus;
        row.selectionWeight = Math.pow(row.focus, record.policy.concentrationExponent);
        if (row.actorId === record.aggroTargetId) row.selectionWeight *= record.policy.currentTargetWeightMultiplier;
    }
    const totalWeight = rows.reduce((sum, row) => sum + row.selectionWeight, 0);
    for (const row of rows) row.selectionShare = totalWeight > 0 ? row.selectionWeight / totalWeight : equalFocus;
    return Object.freeze({
        enemyId,
        aggroTargetId: record.aggroTargetId,
        fixation: record.fixation ? Object.freeze({ ...record.fixation }) : null,
        policy: snapshotPolicy(record.policy),
        entries: Object.freeze(rows.map((row) => Object.freeze({ ...row }))),
    });
}

export function selectEnemyAttentionTarget(battle, enemyId, options = {}) {
    const record = ensureEnemyAttentionRecord(battle, enemyId, options);
    if (!record) return null;
    const nowWorldSeconds = normalizeWorldSeconds(options.nowWorldSeconds);
    expireFixationIfNeeded(battle, record, nowWorldSeconds);
    const fixationTarget = record.fixation?.targetId;
    if (fixationTarget && isLivingCredibleActor(battle, fixationTarget)) return fixationTarget;

    const snapshot = getEnemyAttentionSnapshot(battle, enemyId, { nowWorldSeconds });
    const rows = snapshot?.entries ?? [];
    if (!rows.length) {
        record.aggroTargetId = null;
        return null;
    }

    const current = rows.find((row) => row.actorId === record.aggroTargetId) ?? null;
    if (current && options.reassess !== true) return current.actorId;

    if (current) {
        const challenger = rows
            .filter((row) => row.actorId !== current.actorId)
            .sort((a, b) => b.selectionWeight - a.selectionWeight || a.actorId.localeCompare(b.actorId))[0] ?? null;
        if (!challenger || challenger.selectionWeight < current.selectionWeight * record.policy.switchRatio) return current.actorId;
        record.aggroTargetId = challenger.actorId;
        return challenger.actorId;
    }

    const selected = weightedPick(rows, options.rng ?? battle.rng);
    record.aggroTargetId = selected?.actorId ?? rows[0].actorId;
    return record.aggroTargetId;
}

export function applyCombatActionAttention(battle, action, options = {}) {
    if (!battle || !action || !isCredibleActor(battle, action.actorId)) return [];

    const multiRecipients = appliedEnemyEffectRecipientIds(battle, action);
    const perRecipient = action.data?.attention?.mode === 'per-recipient';
    if (perRecipient || multiRecipients.length > 1) {
        return multiRecipients.map((enemyId) => {
            const amount = deriveCombatActionEnmityForRecipient(action, enemyId);
            if (!(amount > 0)) return null;
            const entry = addEnmity(battle, enemyId, action.actorId, amount, options);
            return entry ? { enemyId, actorId: action.actorId, amount, effectiveEnmity: entry.effectiveEnmity } : null;
        }).filter(Boolean);
    }

    const amount = deriveCombatActionEnmity(action);
    if (!(amount > 0)) return [];
    const target = findCombatant(battle, action.targetId);
    const enemies = target && isEnemy(target)
        ? [target]
        : livingEnemies(battle);
    return enemies.map((enemy) => {
        const entry = addEnmity(battle, enemy.id, action.actorId, amount, options);
        return entry ? { enemyId: enemy.id, actorId: action.actorId, amount, effectiveEnmity: entry.effectiveEnmity } : null;
    }).filter(Boolean);
}

export function deriveCombatActionEnmityForRecipient(action, recipientId) {
    const data = action?.data ?? {};
    let amount = action?.targetId === recipientId ? nonNegativeNumber(data.attention?.enmityBonus) : 0;
    for (const effect of data.effects ?? []) {
        if (effect?.applied !== true || effect.recipientId !== recipientId) continue;
        if (effect.type === 'damage') amount += nonNegativeNumber(effect.amount);
        else if (effect.type === 'heal') amount += nonNegativeNumber(effect.amount) * 0.5;
        else if (effect.type === 'status') amount += 8;
    }
    return amount;
}

export function deriveCombatActionEnmity(action) {
    const data = action?.data ?? {};
    let amount = nonNegativeNumber(data.attention?.enmityBonus);
    if (Number.isFinite(Number(data.damage))) amount += nonNegativeNumber(data.damage);
    if (Number.isFinite(Number(data.amount)) && data.effectType === 'damage') amount += nonNegativeNumber(data.amount);
    if (Number.isFinite(Number(data.amount)) && data.effectType === 'heal') amount += nonNegativeNumber(data.amount) * 0.5;
    for (const effect of data.effects ?? []) {
        if (effect?.applied !== true) continue;
        if (effect.type === 'damage') amount += nonNegativeNumber(effect.amount);
        else if (effect.type === 'heal') amount += nonNegativeNumber(effect.amount) * 0.5;
        else if (effect.type === 'status' && effect.recipientId && effect.recipientId !== action.actorId) amount += 8;
        else if (effect.type === 'status') amount += 3;
    }
    return amount;
}

export function validateBattleAttentionState(battle) {
    const issues = [];
    const state = battle?.enmity;
    if (!isObject(state)) return ['enmity must be an object.'];
    if (state.version !== COMBAT_ATTENTION_VERSION) issues.push(`enmity.version must be ${COMBAT_ATTENTION_VERSION}.`);
    if (!isObject(state.byEnemyId)) return [...issues, 'enmity.byEnemyId must be an object.'];

    const enemyIds = new Set((battle.combatants ?? []).filter(isEnemy).map((combatant) => combatant.id));
    const actorIds = new Set((battle.combatants ?? []).filter(isCredibleCombatant).map((combatant) => combatant.id));
    for (const enemyId of enemyIds) if (!isObject(state.byEnemyId[enemyId])) issues.push(`enmity.byEnemyId is missing enemy ${enemyId}.`);
    for (const [enemyId, record] of Object.entries(state.byEnemyId)) {
        if (!enemyIds.has(enemyId)) issues.push(`enmity.byEnemyId contains unknown enemy ${enemyId}.`);
        if (!isObject(record)) continue;
        if (!isObject(record.entries)) issues.push(`enmity.byEnemyId.${enemyId}.entries must be an object.`);
        else {
            for (const actorId of actorIds) if (!isObject(record.entries[actorId])) issues.push(`enmity.byEnemyId.${enemyId}.entries is missing actor ${actorId}.`);
            for (const [actorId, entry] of Object.entries(record.entries)) {
                if (!actorIds.has(actorId)) issues.push(`enmity.byEnemyId.${enemyId}.entries contains unknown actor ${actorId}.`);
                if (!isObject(entry)) continue;
                for (const key of ['baseline', 'transient', 'floor', 'decayPerSecond']) if (!isNonNegativeFinite(entry[key])) issues.push(`enmity.byEnemyId.${enemyId}.entries.${actorId}.${key} must be non-negative.`);
                if (!Number.isInteger(entry.lastUpdatedAtWorldSeconds) || entry.lastUpdatedAtWorldSeconds < 0) issues.push(`enmity.byEnemyId.${enemyId}.entries.${actorId}.lastUpdatedAtWorldSeconds must be a non-negative integer.`);
            }
        }
        if (record.aggroTargetId !== null && !actorIds.has(record.aggroTargetId)) issues.push(`enmity.byEnemyId.${enemyId}.aggroTargetId must reference an ally or be null.`);
        if (record.fixation !== null) {
            if (!isObject(record.fixation)) issues.push(`enmity.byEnemyId.${enemyId}.fixation must be an object or null.`);
            else {
                if (!actorIds.has(record.fixation.targetId)) issues.push(`enmity.byEnemyId.${enemyId}.fixation.targetId must reference an ally.`);
                if (typeof record.fixation.reason !== 'string' || !record.fixation.reason.trim()) issues.push(`enmity.byEnemyId.${enemyId}.fixation.reason must be a non-empty string.`);
                if (record.fixation.expiresAtWorldSeconds !== null && (!Number.isInteger(record.fixation.expiresAtWorldSeconds) || record.fixation.expiresAtWorldSeconds < 0)) issues.push(`enmity.byEnemyId.${enemyId}.fixation.expiresAtWorldSeconds must be null or a non-negative integer.`);
            }
        }
        if (!isObject(record.policy)) issues.push(`enmity.byEnemyId.${enemyId}.policy must be an object.`);
        else {
            if (!(Number(record.policy.concentrationExponent) > 0)) issues.push(`enmity.byEnemyId.${enemyId}.policy.concentrationExponent must be positive.`);
            if (!(Number(record.policy.switchRatio) >= 1)) issues.push(`enmity.byEnemyId.${enemyId}.policy.switchRatio must be at least 1.`);
            if (!(Number(record.policy.currentTargetWeightMultiplier) >= 1)) issues.push(`enmity.byEnemyId.${enemyId}.policy.currentTargetWeightMultiplier must be at least 1.`);
        }
    }
    return issues;
}

function populateAttentionState(state, combatants, nowWorldSeconds) {
    const actors = combatants.filter(isCredibleCombatant);
    for (const enemy of combatants.filter(isEnemy)) {
        const record = isObject(state.byEnemyId[enemy.id]) ? state.byEnemyId[enemy.id] : createEnemyRecord();
        record.entries = isObject(record.entries) ? record.entries : {};
        for (const actor of actors) if (!isObject(record.entries[actor.id])) record.entries[actor.id] = createEntry(nowWorldSeconds);
        record.aggroTargetId ??= null;
        record.fixation ??= null;
        record.policy = normalizePolicy(record.policy);
        state.byEnemyId[enemy.id] = record;
    }
}

function ensureEnemyAttentionRecord(battle, enemyId, options = {}) {
    const state = ensureBattleAttentionState(battle, options);
    const enemy = findCombatant(battle, enemyId);
    if (!state || !enemy || !isEnemy(enemy)) return null;
    return state.byEnemyId[enemy.id] ?? null;
}

function createEnemyRecord() {
    return { entries: {}, aggroTargetId: null, fixation: null, policy: { ...DEFAULT_ATTENTION_POLICY } };
}

function createEntry(nowWorldSeconds) {
    return { baseline: 1, transient: 0, floor: 0, decayPerSecond: 0, lastUpdatedAtWorldSeconds: nowWorldSeconds };
}

function reconcileEntry(entry, nowWorldSeconds) {
    const elapsed = Math.max(0, nowWorldSeconds - normalizeWorldSeconds(entry.lastUpdatedAtWorldSeconds));
    if (elapsed > 0 && entry.decayPerSecond > 0) entry.transient = Math.max(0, entry.transient - elapsed * entry.decayPerSecond);
    entry.lastUpdatedAtWorldSeconds = nowWorldSeconds;
    return entry;
}

function effectiveEntryEnmity(entry, nowWorldSeconds) {
    if (!entry) return 0;
    const elapsed = Math.max(0, nowWorldSeconds - normalizeWorldSeconds(entry.lastUpdatedAtWorldSeconds));
    const transient = Math.max(0, nonNegativeNumber(entry.transient) - elapsed * nonNegativeNumber(entry.decayPerSecond));
    return Math.max(nonNegativeNumber(entry.floor), nonNegativeNumber(entry.baseline) + transient);
}

function snapshotEntry(entry, nowWorldSeconds) {
    return Object.freeze({ ...entry, effectiveEnmity: effectiveEntryEnmity(entry, nowWorldSeconds) });
}

function normalizePolicy(policy = {}) {
    return {
        concentrationExponent: positiveNumber(policy.concentrationExponent, DEFAULT_ATTENTION_POLICY.concentrationExponent),
        switchRatio: atLeastOne(policy.switchRatio, DEFAULT_ATTENTION_POLICY.switchRatio),
        currentTargetWeightMultiplier: atLeastOne(policy.currentTargetWeightMultiplier, DEFAULT_ATTENTION_POLICY.currentTargetWeightMultiplier),
    };
}

function snapshotPolicy(policy) { return Object.freeze({ ...policy }); }

function expireFixationIfNeeded(battle, record, nowWorldSeconds) {
    if (!record.fixation) return;
    const expired = record.fixation.expiresAtWorldSeconds !== null && record.fixation.expiresAtWorldSeconds <= nowWorldSeconds;
    const invalid = !isLivingCredibleActor(battle, record.fixation.targetId);
    if (expired || invalid) record.fixation = null;
}

function weightedPick(rows, rng) {
    const total = rows.reduce((sum, row) => sum + row.selectionWeight, 0);
    if (!(total > 0)) return rows[0] ?? null;
    const roll = clamp01(typeof rng === 'function' ? rng() : 0) * total;
    let cursor = 0;
    for (const row of rows) {
        cursor += row.selectionWeight;
        if (roll <= cursor) return row;
    }
    return rows.at(-1) ?? null;
}

function appliedEnemyEffectRecipientIds(battle, action) {
    const ids = [];
    for (const effect of action?.data?.effects ?? []) {
        if (effect?.applied !== true || !effect.recipientId) continue;
        const recipient = findCombatant(battle, effect.recipientId);
        if (!recipient || !isEnemy(recipient) || ids.includes(recipient.id)) continue;
        ids.push(recipient.id);
    }
    return ids;
}

function livingCredibleActors(battle) { return (battle?.combatants ?? []).filter((combatant) => isCredibleCombatant(combatant) && !combatant.battle?.defeated && Number(combatant.resources?.hp) > 0); }
function livingEnemies(battle) { return (battle?.combatants ?? []).filter((combatant) => isEnemy(combatant) && !combatant.battle?.defeated && Number(combatant.resources?.hp) > 0); }
function isCredibleActor(battle, actorId) { const actor = findCombatant(battle, actorId); return Boolean(actor && isCredibleCombatant(actor)); }
function isLivingCredibleActor(battle, actorId) { return livingCredibleActors(battle).some((combatant) => combatant.id === actorId); }
function isCredibleCombatant(combatant) { return Boolean(combatant && !isEnemy(combatant)); }
function isEnemy(combatant) { return combatant?.battle?.side === 'enemy' || combatant?.type === 'enemy'; }
function findCombatant(battle, id) { return (battle?.combatants ?? []).find((combatant) => combatant.id === id) ?? null; }
function normalizeWorldSeconds(value) { return Math.max(0, Math.floor(Number(value) || 0)); }
function nonNegativeNumber(value) { return Math.max(0, Number(value) || 0); }
function positiveNumber(value, fallback) { return Number(value) > 0 ? Number(value) : fallback; }
function atLeastOne(value, fallback) { return Number(value) >= 1 ? Number(value) : fallback; }
function isNonNegativeFinite(value) { return Number.isFinite(Number(value)) && Number(value) >= 0; }
function clamp01(value) { return Math.max(0, Math.min(0.999999999999, Number(value) || 0)); }
function isObject(value) { return Boolean(value && typeof value === 'object' && !Array.isArray(value)); }
