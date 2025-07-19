import { renderMainMenu } from './ui.js';
import { loadCharacters } from '../data/index.js';

// Entry point: initialize application
function init() {
    loadCharacters();
    const app = document.getElementById('app');
    app.innerHTML = '';
    const menu = renderMainMenu();
    app.appendChild(menu);
}

document.addEventListener('DOMContentLoaded', init);
