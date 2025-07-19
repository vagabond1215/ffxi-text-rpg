import { renderMainMenu } from './ui.js';

// Entry point: initialize application
function init() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    const menu = renderMainMenu();
    app.appendChild(menu);
}

document.addEventListener('DOMContentLoaded', init);
