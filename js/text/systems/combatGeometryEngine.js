export const COMBAT_GEOMETRY_VERSION = 1;
export const COMBAT_GEOMETRY_KINDS = Object.freeze(['ring']);

const ENEMY_FORMATION = Object.freeze([
    Object.freeze({ x: 3, y: 0 }),
    Object.freeze({ x: 4, y: 1 }),
    Object.freeze({ x: 4, y: -1 }),
    Object.freeze({ x: 5, y: 0 }),
    Object.freeze({ x: 3, y: 2 }),
    Object.freeze({ x: 5, y: 2 }),
]);

const ALLY_FORMATION = Object.freeze([
    Object.freeze({ x: 0, y: 0 }),
    Object.freeze({ x: -1, y: 1 }),
    Object.freeze({ x: -1, y: -1 }),
    Object.freeze({ x: -2, y: 0 }),
]);

export function getCombatFormationPosition(battle, actorId) {
    const combatants = battle?.combatants ?? [];
    const combatant = combatants.find((entry) => entry.id === actorId) ?? null;
    if (!combatant) return null;

    const side = combatant.battle?.side ?? (combatant.type === 'enemy' ? 'enemy' : 'ally');
    const sameSide = combatants.filter((entry) => (entry.battle?.side ?? (entry.type === 'enemy' ? 'enemy' : 'ally')) === side);
    const index = sameSide.findIndex((entry) => entry.id === actorId);
    if (index < 0) return null;

    const position = side === 'enemy'
        ? enemyFormationPosition(index)
        : allyFormationPosition(index);
    return Object.freeze({ ...position });
}

export function resolveCombatGeometryTargets(battle, definition = {}) {
    const geometry = definition.geometry ?? {};
    if (geometry.kind !== 'ring') return emptyResolution(geometry.kind ?? null);

    const actor = findCombatant(battle, definition.actorId);
    const primaryTarget = findCombatant(battle, definition.primaryTargetId);
    if (!actor || !primaryTarget) return emptyResolution('ring');

    const actorSide = actor.battle?.side ?? (actor.type === 'enemy' ? 'enemy' : 'ally');
    const centerId = geometry.center === 'target' ? primaryTarget.id : null;
    const center = centerId ? getCombatFormationPosition(battle, centerId) : null;
    if (!center) return emptyResolution('ring');

    const radius = Math.max(0, Number(geometry.radius) || 0);
    const maximumTargets = Math.max(1, Math.floor(Number(geometry.maximumTargets) || 1));
    const encounterOrder = new Map((battle?.combatants ?? []).map((entry, index) => [entry.id, index]));

    const rows = (battle?.combatants ?? [])
        .filter((entry) => {
            const side = entry.battle?.side ?? (entry.type === 'enemy' ? 'enemy' : 'ally');
            return side !== actorSide && !entry.battle?.defeated && Number(entry.resources?.hp) > 0;
        })
        .map((entry) => {
            const position = getCombatFormationPosition(battle, entry.id);
            const distance = position ? euclideanDistance(center, position) : Infinity;
            return { entry, position, distance, order: encounterOrder.get(entry.id) ?? Number.MAX_SAFE_INTEGER };
        })
        .filter((row) => row.distance <= radius)
        .sort((left, right) => {
            if (left.entry.id === primaryTarget.id && right.entry.id !== primaryTarget.id) return -1;
            if (right.entry.id === primaryTarget.id && left.entry.id !== primaryTarget.id) return 1;
            return left.distance - right.distance || left.order - right.order || left.entry.id.localeCompare(right.entry.id);
        })
        .slice(0, maximumTargets);

    const evidence = Object.freeze({
        version: COMBAT_GEOMETRY_VERSION,
        kind: 'ring',
        center: 'target',
        centerId,
        centerPosition: Object.freeze({ ...center }),
        radius,
        maximumTargets,
        recipients: Object.freeze(rows.map((row) => Object.freeze({
            id: row.entry.id,
            distance: row.distance,
            position: Object.freeze({ ...row.position }),
        }))),
    });

    return Object.freeze({
        targets: Object.freeze(rows.map((row) => row.entry)),
        evidence,
    });
}

function enemyFormationPosition(index) {
    if (index < ENEMY_FORMATION.length) return ENEMY_FORMATION[index];
    const offset = index - ENEMY_FORMATION.length;
    const lane = offset % 3;
    const rank = Math.floor(offset / 3);
    return { x: 6 + rank, y: lane === 0 ? 0 : lane === 1 ? 1 + rank : -1 - rank };
}

function allyFormationPosition(index) {
    if (index < ALLY_FORMATION.length) return ALLY_FORMATION[index];
    const offset = index - ALLY_FORMATION.length;
    const lane = offset % 2;
    const rank = Math.floor(offset / 2);
    return { x: -3 - rank, y: lane === 0 ? 1 + rank : -1 - rank };
}

function euclideanDistance(left, right) {
    return Math.hypot(Number(right.x) - Number(left.x), Number(right.y) - Number(left.y));
}

function emptyResolution(kind) {
    return Object.freeze({
        targets: Object.freeze([]),
        evidence: Object.freeze({
            version: COMBAT_GEOMETRY_VERSION,
            kind,
            center: null,
            centerId: null,
            centerPosition: null,
            radius: 0,
            maximumTargets: 0,
            recipients: Object.freeze([]),
        }),
    });
}

function findCombatant(battle, actorId) {
    return (battle?.combatants ?? []).find((entry) => entry.id === actorId) ?? null;
}
