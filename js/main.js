import { renderMainMenu, renderCharacterMenu, setupBackButton, renderUserControls } from './ui.js';
import { loadCharacters, initCurrentUser } from '../data/index.js';

// Entry point: initialize application
let uiScale = 1;

function applyOrientation() {
    const portrait = window.innerHeight > window.innerWidth;
    document.body.classList.toggle('portrait', portrait);
    document.body.classList.toggle('landscape', !portrait);
}

function updateScale(delta) {
    uiScale = Math.max(0.5, Math.min(2, uiScale + delta));
    document.documentElement.style.setProperty('--ui-scale', uiScale);
}

function init() {
    initCurrentUser();
    loadCharacters();
    renderUserControls();
    const app = document.getElementById('app');
    app.innerHTML = '';
    const menu = renderMainMenu();
    app.appendChild(menu);


    const backBtn = document.getElementById('back-button');
    if (backBtn) setupBackButton(backBtn);

    applyOrientation();
    window.addEventListener('resize', applyOrientation);

    const inc = document.getElementById('scale-inc');
    const dec = document.getElementById('scale-dec');
    if (inc && dec) {
        inc.addEventListener('click', () => updateScale(0.1));
        dec.addEventListener('click', () => updateScale(-0.1));
    }

    const charBtn = document.getElementById('character-select');
    if (charBtn) {
        charBtn.addEventListener('click', () => {
            const root = document.getElementById('app').firstElementChild;
            if (root) {
                renderCharacterMenu(root);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
