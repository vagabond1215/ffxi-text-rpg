import { classifyCommandFeedback } from './uiPanels.js';

export function createTextShell({ output, form, input, router, afterCommand }) {
    if (!output || !form || !input || !router) {
        throw new Error('Text shell is missing required DOM elements or command router.');
    }

    function write(text) {
        output.textContent = text;
        output.scrollTop = output.scrollHeight;
    }

    function append(text) {
        output.textContent = output.textContent
            ? `${output.textContent}\n\n${text}`
            : text;
        output.scrollTop = output.scrollHeight;
    }

    function submitCommand(command) {
        if (!command.trim()) return '';

        const response = router(command);
        append(`> ${command}\n${response}`);
        afterCommand?.({ command, response, feedback: classifyCommandFeedback(command, response) });
        return response;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const command = input.value;
        input.value = '';
        submitCommand(command);
    });

    return {
        printIntro() {
            write([
                'FFXI Text RPG shell initialized.',
                '',
                'Main commands now use / slash input.',
                'Type /menu to open the main menu.',
                'Type /newcharacter to create a character.',
                'Type /commands or /help to see available commands.',
            ].join('\n'));
        },
        focus() {
            input.focus();
        },
        submitCommand,
    };
}
