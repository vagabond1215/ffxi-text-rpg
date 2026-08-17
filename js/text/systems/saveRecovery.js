import { clearSave, loadAccount, loadAccountSession, saveAccount } from '../save.js';

export const SAVE_RECOVERY_VERSION = 1;

export function deleteCharacterSave(characterId) {
    const selector = String(characterId ?? '').trim();
    if (!selector) return { ok: false, reason: 'Character id is required.' };
    const account = loadAccount();
    if (!account) return { ok: false, reason: 'Login required.' };

    const index = account.characters.findIndex((record) => record.id === selector);
    if (index < 0) return { ok: false, reason: 'That character save no longer exists.' };

    const [removed] = account.characters.splice(index, 1);
    if (account.profile.lastCharacterId === removed.id) {
        account.profile.lastCharacterId = account.characters[0]?.id ?? null;
    }
    account.profile.updatedAt = new Date().toISOString();
    saveAccount(account);
    return {
        ok: true,
        deletedId: removed.id,
        deletedName: removed.name,
        nextCharacterId: account.profile.lastCharacterId,
        session: loadAccountSession(),
    };
}

export function clearAllLocalData() {
    clearSave();
    return { ok: true, session: loadAccountSession() };
}
