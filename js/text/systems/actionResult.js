export const ACTION_RESULT_VERSION = 1;

export function actionSuccess(options = {}) {
    return createActionResult({ ...options, ok: true });
}

export function actionFailure(options = {}) {
    return createActionResult({ ...options, ok: false });
}

export function createActionResult(options = {}) {
    const {
        ok,
        action,
        code,
        outcome,
        data = {},
        display = {},
    } = options;

    if (typeof ok !== 'boolean') throw new Error('ActionResult ok must be boolean.');
    if (!isNonEmptyString(action)) throw new Error('ActionResult action is required.');
    if (!isNonEmptyString(code)) throw new Error('ActionResult code is required.');
    if (!isNonEmptyString(outcome)) throw new Error('ActionResult outcome is required.');
    if (!isPlainObject(data)) throw new Error('ActionResult data must be an object.');
    if (!isPlainObject(display)) throw new Error('ActionResult display must be an object.');

    return Object.freeze({
        contract: 'ActionResult',
        version: ACTION_RESULT_VERSION,
        ok,
        action,
        code,
        outcome,
        data: Object.freeze({ ...data }),
        display: Object.freeze({ ...display }),
    });
}

export function isActionResult(value) {
    return Boolean(
        value
        && value.contract === 'ActionResult'
        && value.version === ACTION_RESULT_VERSION
        && typeof value.ok === 'boolean'
        && isNonEmptyString(value.action)
        && isNonEmptyString(value.code)
        && isNonEmptyString(value.outcome)
        && isPlainObject(value.data)
        && isPlainObject(value.display),
    );
}

export function describeActionResult(result, fallback = '') {
    if (!isActionResult(result)) return fallback;
    return String(result.display.text ?? fallback);
}

// Transitional adapter for callers that still read .message/.reason or a promoted
// semantic field directly. The compatibility aliases are non-enumerable so saved,
// logged, or inspected ActionResult data keeps prose isolated under display.
export function asLegacyActionResult(result, promotedDataKeys = []) {
    if (!isActionResult(result)) return result;
    const view = { ...result };
    const descriptors = {
        message: {
            enumerable: false,
            get: () => (result.ok ? describeActionResult(result) : undefined),
        },
        reason: {
            enumerable: false,
            get: () => (!result.ok ? describeActionResult(result) : undefined),
        },
    };

    for (const key of promotedDataKeys) {
        if (!(key in result.data) || key in view) continue;
        descriptors[key] = {
            enumerable: false,
            get: () => result.data[key],
        };
    }

    Object.defineProperties(view, descriptors);
    return Object.freeze(view);
}

function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function isPlainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
