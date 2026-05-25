export function createCommandIntent(command, payload = {}) {
    return {
        intent: 'command.route',
        payload: {
            ...payload,
            command: String(command ?? '').trim(),
        },
    };
}

export function createCommandIntentAdapter(routeCommand) {
    return function routeCommandIntent(command, action = null) {
        return routeCommand(String(command ?? '').trim(), action);
    };
}
