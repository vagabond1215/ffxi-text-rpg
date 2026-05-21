import { createInitialState } from './text/gameState.js';
import { createCommandRouter } from './text/commandRouter.js';
import { createSidebar } from './text/sidebar.js';
import { createTextShell } from './text/textShell.js';
import { loadGame, saveGame } from './text/save.js';

function init() {
    const savedState = loadGame();
    const state = savedState ?? createInitialState();
    let shell;

    const router = createCommandRouter(state, { saveGame });
    const sidebar = createSidebar({
        root: document.getElementById('sidebar'),
        state,
        runCommand: (command) => shell?.submitCommand(command),
    });

    shell = createTextShell({
        output: document.getElementById('output'),
        form: document.getElementById('command-form'),
        input: document.getElementById('command-input'),
        router,
        afterCommand: () => sidebar.render(),
    });

    shell.printIntro();
    sidebar.render();
    shell.focus();
}

document.addEventListener('DOMContentLoaded', init);
