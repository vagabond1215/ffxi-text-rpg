import { DIRECTION_DELTAS, normalizeCoordinate, normalizeDirection } from './coordinates.js';

const CITY_MOVEMENT = Object.freeze({
    coordinateSizeYalms: 80,
    baseWalkYalmsPerSecond: 8,
    tickSeconds: 1,
    diagonalCostMultiplier: 1.414,
    minimumMoveTicks: 1,
});

export const SAN_DORIA_TOPOLOGIES = Object.freeze({
    southernSandoria: cityTopology({
        start: 'G-10',
        navigable: [
            'E-8', 'E-9',
            'F-7', 'F-8', 'F-9', 'F-10',
            'G-7', 'G-8', 'G-9', 'G-10',
            'H-7', 'H-8', 'H-9', 'H-10', 'H-11',
            'I-7', 'I-8', 'I-9', 'I-10', 'I-11',
            'J-7', 'J-8', 'J-9', 'J-10',
            'K-7', 'K-8', 'K-9', 'K-10',
            'L-6', 'L-7', 'L-8', 'L-9', 'L-10',
        ],
        exits: [
            exit('I-7', ['north'], 'northern-sandoria', 'I-10', 20),
            exit('F-10', ['west', 'southwest'], 'west-ronfaure', 'I-6', 45),
            exit('L-10', ['east', 'southeast'], 'east-ronfaure', 'G-4', 45),
            exit('H-11', ['south'], 'chocobo-circuit', 'H-8', 20),
        ],
    }),
    northernSandoria: cityTopology({
        start: 'I-10',
        navigable: [
            'C-8', 'D-7', 'D-8',
            'E-3', 'E-4', 'E-5', 'E-6', 'E-7', 'E-8',
            'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8', 'F-9', 'F-10',
            'G-6', 'G-7', 'G-8', 'G-9', 'G-10',
            'H-6', 'H-7', 'H-8', 'H-9', 'H-10',
            'I-6', 'I-7', 'I-8', 'I-9', 'I-10',
            'J-10', 'K-10', 'L-10',
        ],
        exits: [
            exit('F-5', ['north'], 'carpenters-landing', 'G-7', 30),
            exit('I-6', ['north'], 'chateau-doraguille', 'H-9', 20),
            exit('F-3', ['north'], 'port-sandoria', 'F-10', 25),
            exit('I-10', ['south'], 'southern-sandoria', 'I-7', 20),
            exit('C-8', ['west'], 'west-ronfaure', 'I-5', 45),
            exit('D-7', ['west', 'southwest'], 'west-ronfaure', 'I-5', 45),
        ],
    }),
    portSandoria: cityTopology({
        start: 'F-10',
        navigable: ['F-10', 'G-10', 'H-10', 'H-9', 'H-8', 'H-7', 'H-6', 'H-5'],
        exits: [
            exit('F-10', ['north'], 'northern-sandoria', 'F-3', 25),
            exit('H-5', ['north'], 'airship-jeuno-sandoria', 'H-5', 60, { externalPlaceholder: true }),
        ],
    }),
    chateauDoraguille: cityTopology({
        start: 'H-9',
        navigable: ['H-9', 'I-9', 'I-8', 'H-8'],
        exits: [
            exit('H-9', ['south'], 'northern-sandoria', 'I-6', 20),
            exit('I-8', ['north'], 'bostaunieux-oubliette', 'H-6', 30),
        ],
    }),
    simpleH8: cityTopology({ start: 'H-8', navigable: ['H-8'], exits: [] }),
    simpleH6: cityTopology({ start: 'H-6', navigable: ['H-6'], exits: [] }),
    simpleH5: cityTopology({ start: 'H-5', navigable: ['H-5'], exits: [] }),
    simpleG7: cityTopology({ start: 'G-7', navigable: ['G-7'], exits: [] }),
});

function cityTopology({ start, navigable, exits }) {
    const normalizedNavigable = unique(navigable.map(normalizeCoordinate).filter(Boolean));
    return Object.freeze({
        type: 'topology',
        bounds: Object.freeze({ minColumn: 'A', maxColumn: 'M', minRow: 1, maxRow: 13 }),
        start: Object.freeze({ levelId: 'main', coord: normalizeCoordinate(start), facing: 'north' }),
        movement: CITY_MOVEMENT,
        levels: Object.freeze([
            Object.freeze({
                id: 'main',
                name: 'Main',
                navigable: Object.freeze(normalizedNavigable),
                edges: Object.freeze(buildEdges(normalizedNavigable, exits)),
                interactions: Object.freeze({}),
            }),
        ]),
    });
}

function buildEdges(navigable, exits) {
    const navigableSet = new Set(navigable);
    const edges = {};
    for (const coord of navigable) {
        edges[coord] = {};
        for (const [direction, delta] of Object.entries(DIRECTION_DELTAS)) {
            const target = offsetCoordinate(coord, delta);
            if (navigableSet.has(target)) {
                edges[coord][direction] = Object.freeze({
                    type: 'move',
                    direction,
                    to: Object.freeze({ levelId: 'main', coord: target }),
                    diagonal: delta.diagonal,
                });
            }
        }
    }
    for (const item of exits) {
        const from = normalizeCoordinate(item.from);
        edges[from] ??= {};
        for (const direction of item.directions) {
            edges[from][direction] = Object.freeze({
                type: 'exit',
                direction,
                toPlaceId: item.toPlaceId,
                arriveAt: Object.freeze({ levelId: 'main', coord: normalizeCoordinate(item.arriveAt), facing: oppositeDirection(direction) }),
                travelSeconds: item.travelSeconds,
                flags: Object.freeze(item.flags ?? {}),
            });
        }
    }
    return Object.fromEntries(Object.entries(edges).map(([coord, value]) => [coord, Object.freeze(value)]));
}

function exit(from, directions, toPlaceId, arriveAt, travelSeconds, flags = {}) {
    return Object.freeze({
        from,
        directions: Object.freeze(directions.map(normalizeDirection).filter(Boolean)),
        toPlaceId,
        arriveAt,
        travelSeconds,
        flags: Object.freeze(flags),
    });
}

function offsetCoordinate(coord, delta) {
    const match = String(coord).match(/^([A-Z]+)-(\d+)$/);
    if (!match) return coord;
    const column = String.fromCharCode(match[1].charCodeAt(0) + delta.column);
    const row = Number(match[2]) + delta.row;
    return `${column}-${row}`;
}

function oppositeDirection(direction) {
    const opposites = {
        north: 'south',
        northeast: 'southwest',
        east: 'west',
        southeast: 'northwest',
        south: 'north',
        southwest: 'northeast',
        west: 'east',
        northwest: 'southeast',
    };
    return opposites[direction] ?? 'north';
}

function unique(values) {
    return [...new Set(values)];
}
