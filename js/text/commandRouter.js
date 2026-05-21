import {
    appendLog,
    describeCharacter,
    describeEnemies,
    describeInventory,
    describeLocation,
    describeNpcs,
    describeStats,
} from './gameState.js';

const HELP_TEXT = [
    'Available commands:',
    '  help       Show this command list.',
    '  look       Describe the current location.',
    '  character  Show the current character summary.',
    '  stats      Show attributes and derived combat stats.',
    '  inventory  Show carried items.',
    '  npcs       List loaded NPCs.',
    '  enemies    List loaded enemies.',
    '  log        Show recent command history.',
    '  save       Save the current local game state.',
    '  reset      Clear local save data and reload the page.',
].join('\n');

export function createCommandRouter(state, services = {}) {
    const saveGame = services.saveGame ?? (() => {});

    return function routeCommand(rawCommand) {
        const command = normalizeCommand(rawCommand);
        if (!command) return '';

        appendLog(state, `> ${rawCommand}`);

        switch (command) {
            case 'help':
            case '?':
                return HELP_TEXT;
            case 'look':
            case 'l':
                return describeLocation(state);
            case 'character':
            case 'char':
            case 'status':
                return describeCharacter(state);
            case 'stats':
            case 'stat':
                return describeStats(state);
            case 'inventory':
            case 'inv':
            case 'i':
                return describeInventory(state);
            case 'npcs':
            case 'npc':
                return describeNpcs(state);
            case 'enemies':
            case 'enemy':
                return describeEnemies(state);
            case 'log':
                return describeLog(state);
            case 'save':
                saveGame(state);
                return 'Game saved locally.';
            case 'reset':
                window.localStorage?.removeItem('ffxiTextRpgSave');
                window.location.reload();
                return 'Resetting local save...';
            default:
                return `Unknown command: ${rawCommand}\nType \"help\" for available commands.`;
        }
    };
}

function normalizeCommand(rawCommand) {
    return String(rawCommand ?? '')
        .trim()
        .toLowerCase();
}

function describeLog(state) {
    if (!state.log.length) {
        return 'No command history yet.';
    }

    return state.log
        .slice(-20)
        .map((item) => `${item.at} ${item.entry}`)
        .join('\n');
}
