import { createCommandRouter } from './commandRouter.js';
import { createNewGameState, replaceState } from './gameState.js';
import {
    clearSave,
    describeAccount,
    listCharacters,
    loadCharacter,
    saveGame,
} from './save.js';

const SLASH_HELP = [
    'Slash commands:',
    '  /menu                 Show the main menu.',
    '  /newcharacter         Start character creation prompts.',
    '  /characters           List local character saves.',
    '  /load <name|number>   Load a saved character.',
    '  /save                 Save the active character.',
    '  /account              Show local account summary.',
    '  /commands             Show available slash commands.',
    '  /help                 Same as /commands.',
    '  /reset                Clear local account/characters and reload.',
    '',
    'Gameplay commands now use a slash prefix:',
    '  /look, /stats, /inventory, /equipment, /containers, /talk, /shop, /buy, /travel, /move, /battle, /attack, etc.',
    '',
    'Character-creation answers do not need a slash while prompts are active.',
].join('\n');

const MAIN_MENU = [
    'Main Menu',
    '',
    '1. /newcharacter - Create a new character.',
    '2. /characters   - List saved characters.',
    '3. /load <slot>   - Load a saved character.',
    '4. /account       - Show local account state.',
    '5. /commands      - Show command list.',
].join('\n');

const SLASH_ALIASES = Object.freeze({
    '/help': '/commands',
    '/?': '/commands',
    '/menu': '/menu',
    '/new': '/newcharacter',
    '/newchar': '/newcharacter',
    '/charlist': '/characters',
    '/chars': '/characters',
});

export function createSlashCommandRouter(state, services = {}) {
    const engineRouter = createCommandRouter(state, services);
    const save = services.saveGame ?? saveGame;
    const reload = services.reload ?? (() => globalThis.window?.location?.reload?.());
    const clear = services.clearSave ?? clearSave;
    let creatorActive = false;

    return function routeSlashCommand(rawCommand) {
        const input = String(rawCommand ?? '').trim();
        if (!input) return '';

        if (creatorActive && !input.startsWith('/')) {
            const response = engineRouter(input);
            if (response.startsWith('Created ')) {
                creatorActive = false;
                save(state);
                return `${response}\n\nCharacter saved. Type /menu or /commands.`;
            }
            return response;
        }

        if (!input.startsWith('/')) {
            return 'Commands now require a slash prefix. Try /menu, /commands, or /newcharacter.';
        }

        const [rawCommandName, ...args] = input.split(/\s+/);
        const commandName = SLASH_ALIASES[rawCommandName.toLowerCase()] ?? rawCommandName.toLowerCase();

        switch (commandName) {
            case '/commands':
                return SLASH_HELP;
            case '/menu':
                return MAIN_MENU;
            case '/account':
                return describeAccount();
            case '/characters':
                return describeCharacters();
            case '/newcharacter':
                creatorActive = true;
                return engineRouter('create');
            case '/load':
                return loadCharacterIntoState(state, args.join(' '), save);
            case '/save':
                return save(state) ? 'Character saved.' : 'Save failed. Run /validate for details.';
            case '/reset':
                clear();
                reload?.();
                return 'Local account and character saves cleared.';
            default:
                return routeGameplaySlash(engineRouter, input);
        }
    };
}

function routeGameplaySlash(engineRouter, input) {
    const stripped = input.slice(1);
    if (!stripped.trim()) return SLASH_HELP;
    return engineRouter(stripped);
}

function describeCharacters() {
    const characters = listCharacters();
    if (!characters.length) return 'No saved characters yet. Use /newcharacter.';
    return [
        'Saved characters:',
        ...characters.map((record) => `${record.index}. ${record.name} - ${record.race} ${record.job} Lv.${record.level}, ${record.nation}, ${record.location}, updated ${record.updatedAt}`),
    ].join('\n');
}

function loadCharacterIntoState(state, selector, save) {
    if (!selector) return 'Load which character? Use /characters, then /load <number|name>.';
    const loaded = loadCharacter(selector);
    if (!loaded) return `No saved character matched: ${selector}`;
    replaceState(state, loaded);
    save(state);
    return [`Loaded ${state.player.identity.name}.`, '', 'Use /look, /character, or /menu.'].join('\n');
}

export function describeMainMenu() {
    return MAIN_MENU;
}
