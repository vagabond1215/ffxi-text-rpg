export function createIntentResult({ ok = true, message = '', data = null } = {}) {
    return { ok, message, data };
}

export function isCommandIntent(intent) {
    return intent === 'command.route';
}

export function isUiIntent(intent) {
    return typeof intent === 'string' && !isCommandIntent(intent);
}

export function describeIntent(action) {
    if (!action) return 'unknown';
    return action.intent ?? action.kind ?? action.id ?? 'unknown';
}
