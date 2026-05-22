import { renderTopBar } from './uiPanels.js';

export function createTopBar({ root, state, runCommand }) {
    if (!root || !state || !runCommand) {
        throw new Error('Top bar is missing root, state, or runCommand.');
    }

    let lastFeedback = null;

    root.addEventListener('click', (event) => {
        const button = event.target.closest('[data-command]');
        if (!button) return;
        runCommand(button.dataset.command);
    });

    function render(feedback = lastFeedback) {
        if (feedback !== undefined) lastFeedback = feedback;
        root.innerHTML = renderTopBar(state, lastFeedback);
    }

    render();

    return { render };
}
