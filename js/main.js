import { createDomApp } from './text/ui/domApp.js';
import { installOnboardingEnhancements } from './text/ui/domOnboardingEnhancements.js';
import { createDomRoot } from './text/ui/domRoot.js';

let root = null;
let rootHost = null;

function init() {
    const host = document.getElementById('app');
    if (!host) return;
    if (!root || rootHost !== host) {
        root?.unmount();
        root = createDomRoot({
            host,
            createApp: createDomApp,
            installEnhancements: installOnboardingEnhancements,
        });
        rootHost = host;
    }
    root.mount();
}

document.addEventListener('DOMContentLoaded', init);
