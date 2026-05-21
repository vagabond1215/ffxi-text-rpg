import { isValidGameState, validateGameState } from './systems/validation.js';

const SAVE_KEY = 'ffxiTextRpgSave';

export function loadGame() {
    try {
        const raw = window.localStorage?.getItem(SAVE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!isValidGameState(parsed)) {
            console.warn('Ignoring incompatible local save.', validateGameState(parsed));
            return null;
        }

        return parsed;
    } catch (error) {
        console.warn('Unable to load local save.', error);
        return null;
    }
}

export function saveGame(state) {
    try {
        const issues = validateGameState(state);
        if (issues.length) {
            console.warn('Refusing to save invalid game state.', issues);
            return false;
        }

        window.localStorage?.setItem(SAVE_KEY, JSON.stringify(state));
        return true;
    } catch (error) {
        console.warn('Unable to save local game.', error);
        return false;
    }
}

export function clearSave() {
    window.localStorage?.removeItem(SAVE_KEY);
}
