import { createDomApp } from './text/ui/domApp.js';

function init() {
    createDomApp({ host: document.getElementById('app') });
}

document.addEventListener('DOMContentLoaded', init);
