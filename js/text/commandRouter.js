import {
    appendLog,
    describeCharacter,
    describeInventory,
    describeLocation,
} from './gameState.js';

const HELP_TEXT = [
    'Available commands:',
    '  help       Show this command list.',
    '  look       Describe the current location.',
    '  character  Show the current character summary.',
    '  inventory  Show carried items.',
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
            case 'inventory':
            case 'inv':
            case 'i':
                return describeInventory(state);
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
