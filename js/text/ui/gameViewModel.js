import { DIRECTION_ARROWS, DIRECTION_ORDER, describeCoordinate } from '../data/coordinates.js';
import { getContextualPois } from '../data/pointsOfInterest.js';
import { getPlace } from '../data/places.js';
import { canMoveDirection } from '../systems/navigationEngine.js';
import { calculateCombatProfile } from '../systems/statEngine.js';
import { getTimedTaskProgress, listTimedTasks } from '../systems/timedTaskEngine.js';
import { describeWorldTime, ensureWorldTimeState } from '../systems/worldTimeEngine.js';
import { createMinimapModel } from './minimapModel.js';

const POI_ACTION_LABELS = Object.freeze({
    shop: 'Browse',
    guild: 'Guild',
    quest: 'Commission',
    storage: 'Storage',
    companion: 'Companion',
    travel: 'Travel Desk',
});

export function createGameViewModel(state, uiState = {}) {
    if (!state?.player) throw new Error('Game view model requires player state.');
    const place = getPlace(state.currentPlaceId);
    const combat = calculateCombatProfile(state.player);
    const nearby = getContextualPois(state).map(toNearbyRecord);
    const activity = createActivityModel(state);

    return Object.freeze({
        header: Object.freeze({
            placeId: place?.id ?? state.currentPlaceId ?? null,
            placeName: place?.name ?? state.location ?? 'Unknown place',
            region: place?.region ?? '',
            coordinate: describeCoordinate(state.position),
            worldTime: describeWorldTime(ensureWorldTimeState(state)),
            paused: Boolean(state.simulation?.paused),
            speedMultiplier: state.simulation?.speedMultiplier ?? 1,
        }),
        character: createCharacterModel(state.player, combat, activity),
        scene: Object.freeze({
            title: place?.name ?? state.location ?? 'Unknown place',
            region: place?.region ?? '',
            type: place?.type ?? '',
            dangerLevel: place?.dangerLevel ?? 0,
            coordinate: describeCoordinate(state.position),
            description: place?.description ?? 'The surroundings are not yet described.',
            nearby: Object.freeze(nearby),
            recent: Object.freeze(createRecentSceneLines(uiState.outputLines ?? [])),
        }),
        map: createMinimapModel(state),
        movement: Object.freeze(createMovementActions(state)),
        contextualActions: Object.freeze(createContextualActions(state, nearby)),
        activity,
    });
}

export function createContextualActions(state, nearby = getContextualPois(state).map(toNearbyRecord)) {
    if (state.activeBattle?.phase === 'active') {
        return [
            commandAction('context:attack', 'Attack', 'attack', 'combat'),
            commandAction('context:techniques', 'Techniques', 'techniques', 'combat'),
            commandAction('context:magic', 'Magic', 'spells', 'combat'),
            commandAction('context:items', 'Items', 'inventory', 'utility'),
            commandAction('context:battle', 'Battle Status', 'battle', 'utility'),
        ];
    }

    if (state.travel?.active) {
        return [
            Object.freeze({ id: 'context:stop-travel', label: 'Stop Travel', intent: 'navigation.stop', payload: Object.freeze({}), kind: 'travel' }),
        ];
    }

    const actions = [];
    for (const poi of nearby) {
        actions.push(commandAction(`context:talk:${poi.id}`, `Talk · ${poi.name}`, `talk ${poi.name}`, 'social'));
        for (const action of poi.actions) {
            if (!POI_ACTION_LABELS[action]) continue;
            actions.push(commandAction(
                `context:${action}:${poi.id}`,
                `${POI_ACTION_LABELS[action]} · ${poi.name}`,
                `${action} ${poi.name}`,
                action,
            ));
        }
    }

    actions.push(commandAction('context:look', 'Look Around', 'look', 'world'));
    if (!nearby.length) actions.push(commandAction('context:nearby', 'Nearby', 'here', 'world'));
    return dedupeActions(actions).slice(0, 6);
}

export function createMovementActions(state) {
    const inBattle = state.activeBattle?.phase === 'active';
    return DIRECTION_ORDER.map((direction) => Object.freeze({
        id: `move:${direction}`,
        label: DIRECTION_ARROWS[direction],
        direction,
        intent: 'navigation.move',
        payload: Object.freeze({ direction }),
        disabled: inBattle || !canMoveDirection(state, direction),
    }));
}

function createCharacterModel(player, combat, activity) {
    const a = combat.attributes;
    return Object.freeze({
        name: player.identity.name,
        ancestry: player.identity.raceName,
        discipline: player.jobs.mainJobName,
        level: player.jobs.level,
        resources: Object.freeze([
            resource('hp', 'HP', player.resources.hp, combat.resources.maxHp),
            resource('mp', 'MP', player.resources.mp, combat.resources.maxMp),
            resource('tp', 'TP', player.resources.tp, combat.resources.maxTp),
        ]),
        attributes: Object.freeze([
            stat('str', 'STR', a.str), stat('dex', 'DEX', a.dex), stat('vit', 'VIT', a.vit),
            stat('agi', 'AGI', a.agi), stat('int', 'INT', a.int), stat('mnd', 'MND', a.mnd), stat('chr', 'CHR', a.chr),
        ]),
        activityLabel: activity?.label ?? 'None',
    });
}

function createActivityModel(state) {
    const now = ensureWorldTimeState(state).totalSeconds;
    if (state.travel?.active) {
        const total = Math.max(1, Number(state.travel.totalSeconds) || 1);
        const remaining = state.travel.arriveAtWorldSeconds === undefined
            ? Math.max(0, Number(state.travel.remainingSeconds) || 0)
            : Math.max(0, state.travel.arriveAtWorldSeconds - now);
        return Object.freeze({
            kind: 'travel',
            label: state.travel.status === 'waiting' ? 'Waiting to depart' : 'Traveling',
            detail: getPlace(state.travel.to)?.name ?? state.travel.to ?? '',
            remainingSeconds: remaining,
            progress: clamp01((total - remaining) / total),
        });
    }

    const task = listTimedTasks(state, { status: 'active' })
        .sort((a, b) => a.completesAtWorldSeconds - b.completesAtWorldSeconds)[0];
    if (!task) return null;
    const progress = getTimedTaskProgress(state, task.id);
    return Object.freeze({
        kind: task.kind,
        label: task.label,
        detail: task.channel,
        remainingSeconds: progress?.remainingSeconds ?? 0,
        progress: clamp01(progress?.progress ?? 0),
    });
}

function createRecentSceneLines(lines) {
    const ignored = new Set([
        'Hearth & Horizon canvas shell initialized.',
        'Hearth & Horizon interface initialized.',
    ]);
    return lines
        .map((line) => String(line ?? '').trim())
        .filter((line) => line && !line.startsWith('> ') && !ignored.has(line))
        .slice(-10);
}

function toNearbyRecord(poi) {
    return Object.freeze({
        id: poi.id,
        name: poi.name,
        type: poi.type,
        notes: poi.notes,
        actions: Object.freeze([...(poi.actions ?? [])]),
    });
}

function commandAction(id, label, command, kind) {
    return Object.freeze({
        id,
        label,
        intent: 'command.route',
        payload: Object.freeze({ command }),
        kind,
    });
}

function dedupeActions(actions) {
    const seen = new Set();
    return actions.filter((action) => {
        const key = `${action.intent}:${action.payload?.command ?? action.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function resource(id, label, current, max) {
    const safeMax = Math.max(0, Number(max) || 0);
    const safeCurrent = Math.max(0, Number(current) || 0);
    return Object.freeze({ id, label, current: safeCurrent, max: safeMax, ratio: safeMax ? clamp01(safeCurrent / safeMax) : 0 });
}

function stat(id, label, value) {
    return Object.freeze({ id, label, value: Number(value) || 0 });
}

function clamp01(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
}
