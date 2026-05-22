import { createInitialState } from './text/gameState.js';
import { createSidebar } from './text/sidebar.js';
import { createTextShell } from './text/textShell.js';
import { createTopBar } from './text/topBar.js';
import { loadActiveCharacter, saveGame, clearSave } from './text/save.js';
import { createSlashCommandRouter } from './text/slashCommandRouter.js';

function init() {
    const savedState = loadActiveCharacter();
    const state = savedState ?? createInitialState();
    let shell;

    const router = createSlashCommandRouter(state, {
        saveGame,
        clearSave,
        reload: () => window.location.reload(),
    });
    const sidebar = createSidebar({
        root: document.getElementById('sidebar'),
        state,
        runCommand: (command) => shell?.submitCommand(command),
    });
    const topBar = createTopBar({
        root: document.getElementById('topbar'),
        state,
        runCommand: (command) => shell?.submitCommand(command),
    });

    shell = createTextShell({
        output: document.getElementById('output'),
        form: document.getElementById('command-form'),
        input: document.getElementById('command-input'),
        router,
        afterCommand: ({ feedback }) => {
            sidebar.render(feedback);
            topBar.render(feedback);
        },
    });

    shell.printIntro();
    sidebar.render();
    topBar.render();
    shell.focus();
}

document.addEventListener('DOMContentLoaded', init);
