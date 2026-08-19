export const PRESENTATION_LOG_VERSION = 1;

export function resetPresentationLog(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) return [];
    state.log = [];
    return state.log;
}
