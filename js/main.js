import { createInitialState } from './text/gameState.js';
import { createCommandRouter } from './text/commandRouter.js';
import { createTextShell } from './text/textShell.js';
import { loadGame, saveGame } from './text/save.js';

function init() {
    const savedState = loadGame();
    const state = savedState ?? createInitialState();
    const router = createCommandRouter(state, { saveGame });
    const shell = createTextShell({
        output: document.getElementById('output'),
        form: document.getElementById('command-form'),
        input: document.getElementById('command-input'),
        router,
    });

    shell.printIntro();
    shell.focus();
}

document.addEventListener('DOMContentLoaded', init);
