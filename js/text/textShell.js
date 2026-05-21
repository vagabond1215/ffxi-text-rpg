export function createTextShell({ output, form, input, router }) {
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

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const command = input.value;
        input.value = '';

        if (!command.trim()) return;

        const response = router(command);
        append(`> ${command}\n${response}`);
    });

    return {
        printIntro() {
            write([
                'FFXI Text RPG reset shell initialized.',
                '',
                'This branch intentionally strips the old graphical/interface layer.',
                'Type "help" to see available commands.',
            ].join('\n'));
        },
        focus() {
            input.focus();
        },
    };
}
