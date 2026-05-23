import { createInventoryState } from './systems/inventoryEngine.js';
import { isValidGameState, validateGameState } from './systems/validation.js';

const ACCOUNT_KEY = 'ffxiTextRpgAccount';
const ACCOUNT_SESSION_KEY = 'ffxiTextRpgAccountSession';
const LEGACY_SAVE_KEY = 'ffxiTextRpgSave';
const ACCOUNT_VERSION = 1;
const ENCODING = 'base64-json-v1';

export function loadGame() {
    return loadActiveCharacter();
}

export function loadActiveCharacter() {
    const account = loadAccount();
    if (!account.characters.length) return loadLegacySave();

    const characterId = account.profile.lastCharacterId ?? account.characters[0].id;
    return loadCharacter(characterId) ?? loadCharacter(account.characters[0].id);
}

export function loadCharacter(characterSelector) {
    const account = loadAccount();
    const record = findCharacterRecord(account, characterSelector);
    if (!record) return null;

    const state = decodeState(record.encodedState);
    if (!state) return null;
    const revived = reviveGameState(state, record.id);
    if (!isValidGameState(revived)) {
        console.warn('Ignoring incompatible character save.', validateGameState(revived));
        return null;
    }

    account.profile.lastCharacterId = record.id;
    saveAccount(account);
    return revived;
}

export function saveGame(state) {
    try {
        const revived = reviveGameState(state, state?.meta?.characterId);
        const issues = validateGameState(revived);
        if (issues.length) {
            console.warn('Refusing to save invalid game state.', issues);
            return false;
        }

        const account = loadAccount();
        const characterId = revived.meta.characterId ?? createId('character');
        revived.meta.characterId = characterId;
        revived.meta.updatedAt = new Date().toISOString();

        const summary = createCharacterSummary(revived, characterId);
        const encodedState = encodeState(revived);
        const existingIndex = account.characters.findIndex((record) => record.id === characterId);
        const nextRecord = { ...summary, encodedState };
        if (existingIndex >= 0) account.characters[existingIndex] = nextRecord;
        else account.characters.push(nextRecord);

        account.profile.lastCharacterId = characterId;
        account.profile.updatedAt = nextRecord.updatedAt;
        saveAccount(account);
        return true;
    } catch (error) {
        console.warn('Unable to save local game.', error);
        return false;
    }
}

export function listCharacters() {
    return loadAccount().characters.map(({ encodedState, ...summary }, index) => ({ index: index + 1, ...summary }));
}

export function loadAccount() {
    try {
        const raw = getStorage()?.getItem(ACCOUNT_KEY);
        if (!raw) return createAccount();
        const parsed = decodePayload(raw);
        if (!parsed || parsed.version !== ACCOUNT_VERSION || !Array.isArray(parsed.characters)) return createAccount();
        parsed.profile ??= createAccountProfile();
        parsed.profile.accountId ??= createId('account');
        parsed.profile.displayName = normalizeDisplayName(parsed.profile.displayName);
        parsed.characters = parsed.characters.filter((record) => record?.id && record?.encodedState);
        return parsed;
    } catch (error) {
        console.warn('Unable to load account save.', error);
        return createAccount();
    }
}

export function saveAccount(account) {
    const nextAccount = {
        version: ACCOUNT_VERSION,
        encoding: ENCODING,
        profile: {
            ...createAccountProfile(),
            ...(account.profile ?? {}),
            displayName: normalizeDisplayName(account.profile?.displayName),
            updatedAt: new Date().toISOString(),
        },
        characters: account.characters ?? [],
    };
    getStorage()?.setItem(ACCOUNT_KEY, encodePayload(nextAccount));
    getStorage()?.removeItem(LEGACY_SAVE_KEY);
    syncAccountSession(nextAccount);
    return nextAccount;
}

export function loadAccountSession() {
    const account = loadAccount();
    const raw = getStorage()?.getItem(ACCOUNT_SESSION_KEY);
    let session = null;
    try {
        session = raw ? decodePayload(raw) : null;
    } catch {
        session = null;
    }

    const loggedIn = Boolean(session?.loggedIn && session.accountId === account.profile.accountId);
    return {
        loggedIn,
        accountId: account.profile.accountId,
        displayName: account.profile.displayName,
        lastCharacterId: account.profile.lastCharacterId ?? null,
        characterCount: account.characters.length,
        updatedAt: account.profile.updatedAt,
        loggedInAt: loggedIn ? session.loggedInAt : null,
    };
}

export function loginAccount(displayName = null) {
    const account = loadAccount();
    account.profile.displayName = normalizeDisplayName(displayName ?? account.profile.displayName);
    const saved = saveAccount(account);
    const session = {
        loggedIn: true,
        accountId: saved.profile.accountId,
        displayName: saved.profile.displayName,
        loggedInAt: new Date().toISOString(),
    };
    getStorage()?.setItem(ACCOUNT_SESSION_KEY, encodePayload(session));
    return loadAccountSession();
}

export function logoutAccount() {
    getStorage()?.removeItem(ACCOUNT_SESSION_KEY);
    return loadAccountSession();
}

export function clearSave() {
    getStorage()?.removeItem(ACCOUNT_KEY);
    getStorage()?.removeItem(ACCOUNT_SESSION_KEY);
    getStorage()?.removeItem(LEGACY_SAVE_KEY);
}

export function describeAccount() {
    const account = loadAccount();
    const session = loadAccountSession();
    const lines = [
        `Account: ${account.profile.displayName}`,
        `Account ID: ${account.profile.accountId}`,
        `Logged in: ${session.loggedIn ? 'yes' : 'no'}`,
        `Characters: ${account.characters.length}`,
        `Last character: ${account.profile.lastCharacterId ?? 'none'}`,
    ];
    return lines.join('\n');
}

export function encodePayload(value) {
    const json = JSON.stringify(value);
    return `${ENCODING}:${toBase64(json)}`;
}

export function decodePayload(raw) {
    const value = String(raw ?? '');
    if (!value.startsWith(`${ENCODING}:`)) return JSON.parse(value);
    return JSON.parse(fromBase64(value.slice(ENCODING.length + 1)));
}

export function reviveGameState(state, characterId = null) {
    if (!state || typeof state !== 'object') return state;
    state.meta ??= {};
    state.meta.characterId ??= characterId ?? createId('character');
    state.meta.updatedAt ??= new Date().toISOString();
    if (state.player) {
        state.player.inventoryState ??= createInventoryState();
        state.player.inventoryState.containers ??= createInventoryState().containers;
        state.player.inventoryState.mogHouse ??= createInventoryState().mogHouse;
        state.player.inventoryState.containers.inventory ??= { id: 'inventory', unlocked: true, items: [] };
        state.player.inventory = state.player.inventoryState.containers.inventory.items;
    }
    return state;
}

function createAccount() {
    return {
        version: ACCOUNT_VERSION,
        encoding: ENCODING,
        profile: createAccountProfile(),
        characters: [],
    };
}

function createAccountProfile() {
    const now = new Date().toISOString();
    return {
        accountId: createId('account'),
        displayName: 'Local Adventurer',
        createdAt: now,
        updatedAt: now,
        lastCharacterId: null,
    };
}

function createCharacterSummary(state, characterId) {
    const player = state.player;
    return {
        id: characterId,
        name: player.identity.name,
        race: player.identity.raceName,
        nation: player.identity.nation,
        job: player.jobs.mainJobName,
        level: player.jobs.level,
        location: state.location,
        currentPlaceId: state.currentPlaceId,
        updatedAt: new Date().toISOString(),
    };
}

function findCharacterRecord(account, selector) {
    if (!selector) return null;
    const normalized = normalize(selector);
    const index = Number.parseInt(selector, 10);
    if (Number.isInteger(index) && index > 0) return account.characters[index - 1] ?? null;
    return account.characters.find((record) => normalize(record.id) === normalized || normalize(record.name).includes(normalized)) ?? null;
}

function encodeState(state) {
    return encodePayload(state);
}

function decodeState(encodedState) {
    try {
        return decodePayload(encodedState);
    } catch (error) {
        console.warn('Unable to decode character state.', error);
        return null;
    }
}

function loadLegacySave() {
    try {
        const raw = getStorage()?.getItem(LEGACY_SAVE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        const revived = reviveGameState(parsed);
        if (!isValidGameState(revived)) return null;
        saveGame(revived);
        return revived;
    } catch {
        return null;
    }
}

function syncAccountSession(account) {
    const raw = getStorage()?.getItem(ACCOUNT_SESSION_KEY);
    if (!raw) return;
    try {
        const session = decodePayload(raw);
        if (!session?.loggedIn || session.accountId !== account.profile.accountId) return;
        getStorage()?.setItem(ACCOUNT_SESSION_KEY, encodePayload({
            ...session,
            displayName: account.profile.displayName,
        }));
    } catch {
        getStorage()?.removeItem(ACCOUNT_SESSION_KEY);
    }
}

function getStorage() {
    return globalThis.localStorage ?? globalThis.window?.localStorage ?? null;
}

function toBase64(value) {
    if (globalThis.btoa) return globalThis.btoa(unescape(encodeURIComponent(value)));
    if (globalThis.Buffer) return globalThis.Buffer.from(value, 'utf8').toString('base64');
    throw new Error('No base64 encoder available.');
}

function fromBase64(value) {
    if (globalThis.atob) return decodeURIComponent(escape(globalThis.atob(value)));
    if (globalThis.Buffer) return globalThis.Buffer.from(value, 'base64').toString('utf8');
    throw new Error('No base64 decoder available.');
}

function createId(prefix) {
    if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '-');
}

function normalizeDisplayName(value) {
    const normalized = String(value ?? '').trim().replace(/\s+/g, ' ');
    return normalized || 'Local Adventurer';
}
