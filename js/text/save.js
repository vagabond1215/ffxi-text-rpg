const SAVE_KEY = 'ffxiTextRpgSave';

export function loadGame() {
    try {
        const raw = window.localStorage?.getItem(SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.warn('Unable to load local save.', error);
        return null;
    }
}

export function saveGame(state) {
    try {
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
