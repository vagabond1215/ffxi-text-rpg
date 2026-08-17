import { createDomApp } from './text/ui/domApp.js';
import { installOnboardingEnhancements } from './text/ui/domOnboardingEnhancements.js';

function init() {
    const host = document.getElementById('app');
    createDomApp({ host });
    installOnboardingEnhancements(host);
}

document.addEventListener('DOMContentLoaded', init);
