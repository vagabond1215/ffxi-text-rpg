import {
    appendLog,
    describeCharacter,
    describeEnemies,
    describeInventory,
    describeLocation,
    describeNpcs,
    describeStats,
    moveWithinCurrentPlace,
} from './gameState.js';
import { parseCommand } from './commands/parser.js';
import { describeControls, NAV_KEYPAD } from './data/actionControls.js';
import { describeDatabases } from './data/databaseRegistry.js';
import { describeMap, describeMaps } from './data/maps.js';
import { describeAggroResult, evaluateAggroForGrid } from './systems/aggroEngine.js';
import { describeAtlas, describeCurrentGrid } from './systems/atlasEngine.js';
import { validateGameState } from './systems/validation.js';
import { createTickEngine } from './systems/tickEngine.js';
import {
    advanceTravel,
    describePlace,
    describePlaces,
    describeTravel,
    startTravel,
} from './systems/travelEngine.js';
import { describeSystemVersions, describeVersion } from './version.js';

const HELP_TEXT = [
    'Available commands:',
    '  help                 Show this command list.',
    '  look                 Describe the current location.',
    '  character            Show the current character summary.',
    '  stats                Show attributes and derived combat stats.',
    '  inventory            Show carried items.',
    '  npcs                 List loaded NPCs.',
    '  enemies              List loaded enemies.',
    '  maps                 List known starter map records.',
    '  map <id>             Inspect a starter map record.',
    '  zones                List known seeded places.',
    '  zone [id/name]       Inspect current or named zone.',
    '  atlas [id/name]      Show discovered zone atlas grids.',
    '  grid                 Inspect current grid.',
    '  move <dir>           Move within the current zone grid using n/ne/e/se/s/sw/w/nw.',
    '  controls             Show resource bars, tick bar, keypad, and action groups.',
    '  travel <destination> Start direct travel to a connected zone.',
    '  wait [seconds]       Advance time manually for travel/tick testing.',
    '  databases            List planned/seeded/implemented data registries.',
    '  version              Show app/save/data version tracking.',
    '  systems              Show system version map.',
    '  tick                 Inspect live tick engine baseline.',
    '  inspect <target>     Inspect player, npcs, enemies, state, or log.',
    '  validate             Validate current game state.',
    '  log                  Show recent command history.',
    '  save                 Save the current local game state.',
    '  reset                Clear local save data and reload the page.',
].join('\n');

export function createCommandRouter(state, services = {}) {
    const saveGame = services.saveGame ?? (() => false);
    const clearSave = services.clearSave ?? (() => window.localStorage?.removeItem('ffxiTextRpgSave'));
    const reload = services.reload ?? (() => window.location.reload());
    const tickEngine = services.tickEngine ?? createTickEngine();

    return function routeCommand(rawCommand) {
        const parsed = parseCommand(rawCommand);
        if (!parsed.command) return '';

        appendLog(state, `> ${parsed.input}`);

        switch (parsed.command) {
            case 'help':
                return HELP_TEXT;
            case 'look':
                return describeLocation(state);
            case 'character':
                return describeCharacter(state);
            case 'stats':
                return describeStats(state);
            case 'inventory':
                return describeInventory(state);
            case 'npcs':
                return describeNpcs(state);
            case 'enemies':
                return describeEnemies(state);
            case 'maps':
                return describeMaps();
            case 'map':
                return describeMap(parsed.args.join(' '));
            case 'zones':
            case 'places':
                return describePlaces();
            case 'zone':
            case 'place':
                return describePlace(parsed.args.join(' ') || state.currentPlaceId);
            case 'atlas':
                return describeAtlas(state, parsed.args.join(' ') || state.currentPlaceId);
            case 'grid':
                return describeCurrentGrid(state);
            case 'move':
                return describeMove(state, parsed.args[0]);
            case 'controls':
            case 'hud':
                return describeControls();
            case 'travel':
                return describeTravelStart(state, parsed.args.join(' '));
            case 'wait':
                return describeWait(state, tickEngine, parsed.args[0]);
            case 'databases':
            case 'db':
                return describeDatabases();
            case 'version':
                return describeVersion();
            case 'systems':
                return describeSystemVersions();
            case 'tick':
                return tickEngine.describe();
            case 'inspect':
                return inspectTarget(state, parsed.args[0]);
            case 'validate':
                return describeValidation(state);
            case 'log':
                return describeLog(state, parsed.args[0]);
            case 'save':
                return saveGame(state) ? 'Game saved locally.' : 'Save failed. Check console for validation details.';
            case 'reset':
                clearSave();
                reload();
                return 'Resetting local save...';
            default:
                return `Unknown command: ${parsed.input}\nType \"help\" for available commands.`;
        }
    };
}

function describeMove(state, direction) {
    if (!direction) return 'Move where? Use n, ne, e, se, s, sw, w, or nw.';
    const nav = NAV_KEYPAD.find((item) => item.id === String(direction).toLowerCase());
    if (!nav) return `Unknown direction: ${direction}. Use n, ne, e, se, s, sw, w, or nw.`;

    const result = moveWithinCurrentPlace(state, nav);
    if (!result.ok) return result.reason;

    const aggro = evaluateAggroForGrid(state, { travelMode: 'foot' });
    return [
        result.message,
        '',
        describeCurrentGrid(state),
        '',
        describeAggroResult(aggro),
    ].join('\n');
}

function describeTravelStart(state, destination) {
    if (!destination) return 'Travel where? Try `zones` to see known places.';
    const result = startTravel(state, destination);
    return result.ok ? result.message : result.reason;
}

function describeWait(state, tickEngine, secondsArg = '1') {
    const seconds = Math.max(1, Math.min(3600, Number.parseInt(secondsArg, 10) || 1));
    tickEngine.tick({ state, manual: true, seconds });
    const travelResult = advanceTravel(state, seconds);

    if (travelResult.completed) {
        return [
            `Advanced ${seconds}s.`,
            travelResult.message,
            '',
            describeLocation(state),
        ].join('\n');
    }

    return [
        `Advanced ${seconds}s.`,
        describeTravel(state),
    ].join('\n');
}

function inspectTarget(state, target = 'player') {
    switch (String(target).toLowerCase()) {
        case 'player':
        case 'character':
        case 'char':
            return describeCharacter(state);
        case 'stats':
            return describeStats(state);
        case 'inventory':
        case 'inv':
            return describeInventory(state);
        case 'npcs':
        case 'npc':
            return describeNpcs(state);
        case 'enemies':
        case 'enemy':
            return describeEnemies(state);
        case 'maps':
            return describeMaps();
        case 'zone':
        case 'place':
            return describeLocation(state);
        case 'atlas':
            return describeAtlas(state);
        case 'grid':
            return describeCurrentGrid(state);
        case 'travel':
            return describeTravel(state);
        case 'controls':
        case 'hud':
            return describeControls();
        case 'state':
            return JSON.stringify(state, null, 2);
        case 'log':
            return describeLog(state);
        case 'version':
            return describeVersion();
        case 'systems':
            return describeSystemVersions();
        case 'databases':
        case 'db':
            return describeDatabases();
        default:
            return `Nothing to inspect for "${target}". Try: player, stats, inventory, npcs, enemies, maps, zone, atlas, grid, travel, controls, state, log, version, systems, databases.`;
    }
}

function describeValidation(state) {
    const issues = validateGameState(state);
    if (!issues.length) return 'Game state is valid.';

    return [
        'Game state has validation issues:',
        ...issues.map((issue) => `- ${issue}`),
    ].join('\n');
}

function describeLog(state, limitArg = '20') {
    if (!state.log.length) {
        return 'No command history yet.';
    }

    const limit = Math.max(1, Math.min(100, Number.parseInt(limitArg, 10) || 20));
    return state.log
        .slice(-limit)
        .map((item) => `${item.at} ${item.entry}`)
        .join('\n');
}
