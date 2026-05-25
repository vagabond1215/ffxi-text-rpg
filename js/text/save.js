import { createInventoryState } from './systems/inventoryEngine.js';
import { isValidGameState, validateGameState } from './systems/validation.js';

const ACCOUNTS_KEY = 'ffxiTextRpgAccounts';
const ACCOUNT_SESSION_KEY = 'ffxiTextRpgAccountSession';
const LEGACY_SINGLE_ACCOUNT_KEY = 'ffxiTextRpgAccount';
const LEGACY_SAVE_KEY = 'ffxiTextRpgSave';
const ACCOUNT_VERSION = 2;
const ENCODING = 'base64-json-v1';
const RESERVED_ACCOUNT_NAMES = new Set(['local-adventurer', 'account', 'placeholder']);

export const DEFAULT_ACCOUNT_SETTINGS = Object.freeze({
    theme: 'dark',
    uiScale: 'auto',
    layoutMode: 'auto',
    layoutProportion: 'standard',
    showClock: true,
    clockFormat: '12h',
    timeZoneMode: 'auto',
    gmtOffset: 0,
    daylightSavings: 'auto',
});

export function loadGame() {
    return loadActiveCharacter();
}

export function loadActiveCharacter() {
    const account = loadAccount();
    if (!account?.characters?.length) return null;
    const characterId = account.profile.lastCharacterId ?? account.characters[0].id;
    return loadCharacter(characterId) ?? loadCharacter(account.characters[0].id);
}

export function loadCharacter(characterSelector) {
    const account = loadAccount();
    if (!account) return null;
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
        const account = loadAccount();
        if (!account) {
            console.warn('Refusing to save without a logged-in local account.');
            return false;
        }

        const revived = reviveGameState(state, state?.meta?.characterId);
        const issues = validateGameState(revived);
        if (issues.length) {
            console.warn('Refusing to save invalid game state.', issues);
            return false;
        }

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

export function listAccounts() {
    return loadAccountRegistry().accounts.map((account, index) => ({
        index: index + 1,
        id: account.profile.accountId,
        displayName: account.profile.displayName,
        characterCount: account.characters.length,
        lastCharacterId: account.profile.lastCharacterId ?? null,
        persistentLogin: Boolean(account.profile.persistentLogin),
        updatedAt: account.profile.updatedAt,
    }));
}

export function listCharacters() {
    const account = loadAccount();
    if (!account) return [];
    return account.characters.map(({ encodedState, ...summary }, index) => ({ index: index + 1, ...summary }));
}

export function loadAccount() {
    const session = readStoredSession();
    if (!session?.loggedIn) return null;
    const account = findAccountRecord(loadAccountRegistry(), session.accountId);
    if (!account) return null;
    return cloneAccount(account);
}

export function saveAccount(account) {
    const registry = loadAccountRegistry();
    const nextAccount = normalizeAccount(account);
    const existingIndex = registry.accounts.findIndex((record) => record.profile.accountId === nextAccount.profile.accountId);
    if (existingIndex >= 0) registry.accounts[existingIndex] = nextAccount;
    else registry.accounts.push(nextAccount);
    saveAccountRegistry(registry);
    syncAccountSession(nextAccount);
    getStorage()?.removeItem(LEGACY_SAVE_KEY);
    getStorage()?.removeItem(LEGACY_SINGLE_ACCOUNT_KEY);
    return cloneAccount(nextAccount);
}

export function createAccountWithPassword(displayName, password, options = {}) {
    const name = normalizeDisplayName(displayName);
    const accountIssue = validateAccountName(name);
    if (accountIssue) return { ok: false, reason: accountIssue };
    const passwordIssue = validatePassword(password);
    if (passwordIssue) return { ok: false, reason: passwordIssue };

    const registry = loadAccountRegistry();
    if (registry.accounts.some((account) => normalize(account.profile.displayName) === normalize(name))) return { ok: false, reason: `Account already exists: ${name}` };

    const account = createAccount(name, password, { persistentLogin: Boolean(options.persistentLogin) });
    registry.accounts.push(account);
    saveAccountRegistry(registry);
    const session = writeSession(account, { persistentLogin: Boolean(options.persistentLogin) });
    return { ok: true, account: cloneAccount(account), session };
}

export function loginAccount(accountSelector, password, options = {}) {
    const registry = loadAccountRegistry();
    const account = findAccountRecord(registry, accountSelector);
    if (!account) return { ok: false, reason: `No local account matched: ${accountSelector}` };
    const passwordIssue = validatePassword(password);
    if (passwordIssue) return { ok: false, reason: passwordIssue };
    if (account.profile.passwordHash !== hashPassword(password, account.profile.passwordSalt)) return { ok: false, reason: 'Incorrect password.' };
    account.profile.persistentLogin = Boolean(options.persistentLogin);
    account.profile.updatedAt = new Date().toISOString();
    saveAccountRegistry(registry);
    return { ok: true, account: cloneAccount(account), session: writeSession(account, { persistentLogin: Boolean(options.persistentLogin) }) };
}

export function updateAccountSettings(updates = {}) {
    const account = loadAccount();
    if (!account) return { ok: false, reason: 'Login required.' };
    account.profile.settings = normalizeSettings({ ...account.profile.settings, ...updates });
    account.profile.updatedAt = new Date().toISOString();
    saveAccount(account);
    return { ok: true, settings: account.profile.settings, session: loadAccountSession() };
}

export function logoutAccount() {
    getStorage()?.removeItem(ACCOUNT_SESSION_KEY);
    return loadAccountSession();
}

export function loadAccountSession() {
    const registry = loadAccountRegistry();
    const storedSession = readStoredSession();
    const account = storedSession?.loggedIn ? findAccountRecord(registry, storedSession.accountId) : null;
    const loggedIn = Boolean(account && storedSession?.loggedIn);
    return {
        loggedIn,
        accountId: loggedIn ? account.profile.accountId : null,
        displayName: loggedIn ? account.profile.displayName : null,
        lastCharacterId: loggedIn ? account.profile.lastCharacterId ?? null : null,
        characterCount: loggedIn ? account.characters.length : 0,
        characters: loggedIn ? account.characters.map(({ encodedState, ...summary }, index) => ({ index: index + 1, ...summary })) : [],
        settings: loggedIn ? normalizeSettings(account.profile.settings) : normalizeSettings(),
        persistentLogin: loggedIn ? Boolean(storedSession.persistentLogin) : false,
        updatedAt: loggedIn ? account.profile.updatedAt : null,
        loggedInAt: loggedIn ? storedSession.loggedInAt : null,
        accounts: listAccounts(),
    };
}

export function clearSave() {
    getStorage()?.removeItem(ACCOUNTS_KEY);
    getStorage()?.removeItem(ACCOUNT_SESSION_KEY);
    getStorage()?.removeItem(LEGACY_SINGLE_ACCOUNT_KEY);
    getStorage()?.removeItem(LEGACY_SAVE_KEY);
}

export function describeAccount() {
    const session = loadAccountSession();
    if (!session.loggedIn) {
        const accounts = listAccounts();
        if (!accounts.length) return 'No local accounts. Create an account first.';
        return ['Not logged in.', 'Local accounts:', ...accounts.map((account) => `${account.index}. ${account.displayName} (${account.characterCount} characters)`)].join('\n');
    }
    return [
        `Account: ${session.displayName}`,
        `Account ID: ${session.accountId}`,
        `Logged in: yes`,
        `Persistent login: ${session.persistentLogin ? 'yes' : 'no'}`,
        `Theme: ${session.settings.theme}`,
        `Scale: ${session.settings.uiScale}`,
        `Layout: ${session.settings.layoutMode} / ${session.settings.layoutProportion}`,
        `Clock: ${session.settings.showClock ? session.settings.clockFormat : 'hidden'}`,
        `Time zone: ${session.settings.timeZoneMode}${session.settings.timeZoneMode === 'manual' ? ` GMT ${formatSignedOffset(session.settings.gmtOffset)}` : ''}`,
        `Daylight savings: ${session.settings.daylightSavings}`,
        `Characters: ${session.characterCount}`,
        `Last character: ${session.lastCharacterId ?? 'none'}`,
    ].join('\n');
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

function loadAccountRegistry() {
    try {
        const raw = getStorage()?.getItem(ACCOUNTS_KEY);
        if (!raw) return createAccountRegistry();
        const parsed = decodePayload(raw);
        if (!parsed || parsed.version !== ACCOUNT_VERSION || !Array.isArray(parsed.accounts)) return createAccountRegistry();
        return { version: ACCOUNT_VERSION, encoding: ENCODING, accounts: parsed.accounts.map(normalizeAccount).filter((account) => isRealAccount(account)) };
    } catch (error) {
        console.warn('Unable to load account registry.', error);
        return createAccountRegistry();
    }
}

function saveAccountRegistry(registry) {
    const nextRegistry = { version: ACCOUNT_VERSION, encoding: ENCODING, accounts: (registry.accounts ?? []).map(normalizeAccount).filter((account) => isRealAccount(account)) };
    getStorage()?.setItem(ACCOUNTS_KEY, encodePayload(nextRegistry));
    return nextRegistry;
}

function createAccountRegistry() {
    return { version: ACCOUNT_VERSION, encoding: ENCODING, accounts: [] };
}

function createAccount(displayName, password, options = {}) {
    const now = new Date().toISOString();
    const salt = createId('salt');
    return {
        version: ACCOUNT_VERSION,
        encoding: ENCODING,
        profile: {
            accountId: createId('account'),
            displayName: normalizeDisplayName(displayName),
            passwordSalt: salt,
            passwordHash: hashPassword(password, salt),
            settings: normalizeSettings(),
            persistentLogin: Boolean(options.persistentLogin),
            createdAt: now,
            updatedAt: now,
            lastCharacterId: null,
        },
        characters: [],
    };
}

function normalizeAccount(account) {
    const now = new Date().toISOString();
    return {
        version: ACCOUNT_VERSION,
        encoding: ENCODING,
        profile: {
            accountId: account?.profile?.accountId ?? createId('account'),
            displayName: normalizeDisplayName(account?.profile?.displayName),
            passwordSalt: account?.profile?.passwordSalt ?? null,
            passwordHash: account?.profile?.passwordHash ?? null,
            settings: normalizeSettings(account?.profile?.settings),
            persistentLogin: Boolean(account?.profile?.persistentLogin),
            createdAt: account?.profile?.createdAt ?? now,
            updatedAt: account?.profile?.updatedAt ?? now,
            lastCharacterId: account?.profile?.lastCharacterId ?? null,
        },
        characters: Array.isArray(account?.characters) ? account.characters.filter((record) => record?.id && record?.encodedState) : [],
    };
}

function normalizeSettings(settings = {}) {
    const theme = oneOf(settings.theme, ['dark', 'light', 'highContrast'], DEFAULT_ACCOUNT_SETTINGS.theme);
    const uiScale = oneOf(settings.uiScale, ['auto', '90%', '100%', '110%', '125%'], DEFAULT_ACCOUNT_SETTINGS.uiScale);
    const layoutMode = oneOf(settings.layoutMode, ['auto', 'portrait', 'landscape'], DEFAULT_ACCOUNT_SETTINGS.layoutMode);
    const layoutProportion = oneOf(settings.layoutProportion, ['standard', 'compact', 'wide'], DEFAULT_ACCOUNT_SETTINGS.layoutProportion);
    const clockFormat = settings.clockFormat === '24h' ? '24h' : DEFAULT_ACCOUNT_SETTINGS.clockFormat;
    const timeZoneMode = oneOf(settings.timeZoneMode ?? settings.timeZone, ['auto', 'manual'], DEFAULT_ACCOUNT_SETTINGS.timeZoneMode);
    const daylightSavings = oneOf(settings.daylightSavings, ['auto', 'on', 'off'], DEFAULT_ACCOUNT_SETTINGS.daylightSavings);
    return {
        theme,
        uiScale,
        layoutMode,
        layoutProportion,
        showClock: settings.showClock ?? DEFAULT_ACCOUNT_SETTINGS.showClock,
        clockFormat,
        timeZoneMode,
        gmtOffset: clampInteger(settings.gmtOffset, -12, 14, DEFAULT_ACCOUNT_SETTINGS.gmtOffset),
        daylightSavings,
    };
}

function isRealAccount(account) {
    return Boolean(account?.profile?.accountId && !validateAccountName(account.profile.displayName) && account.profile.passwordSalt && account.profile.passwordHash);
}

function validateAccountName(displayName) {
    const value = normalizeDisplayName(displayName);
    if (!value || value === 'Account') return 'Account name is required.';
    if (RESERVED_ACCOUNT_NAMES.has(normalize(value))) return 'That account name is reserved.';
    return null;
}

function createCharacterSummary(state, characterId) {
    const player = state.player;
    return { id: characterId, name: player.identity.name, race: player.identity.raceName, nation: player.identity.nation, job: player.jobs.mainJobName, level: player.jobs.level, location: state.location, currentPlaceId: state.currentPlaceId, updatedAt: new Date().toISOString() };
}

function findAccountRecord(registry, selector) {
    if (!selector) return null;
    const normalized = normalize(selector);
    const index = Number.parseInt(selector, 10);
    if (Number.isInteger(index) && index > 0) return registry.accounts[index - 1] ?? null;
    return registry.accounts.find((account) => normalize(account.profile.accountId) === normalized || normalize(account.profile.displayName) === normalized) ?? null;
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
    try { return decodePayload(encodedState); } catch (error) { console.warn('Unable to decode character state.', error); return null; }
}

function writeSession(account, options = {}) {
    const session = { loggedIn: true, accountId: account.profile.accountId, displayName: account.profile.displayName, persistentLogin: Boolean(options.persistentLogin), loggedInAt: new Date().toISOString() };
    getStorage()?.setItem(ACCOUNT_SESSION_KEY, encodePayload(session));
    return loadAccountSession();
}

function readStoredSession() {
    try { const raw = getStorage()?.getItem(ACCOUNT_SESSION_KEY); return raw ? decodePayload(raw) : null; } catch { getStorage()?.removeItem(ACCOUNT_SESSION_KEY); return null; }
}

function syncAccountSession(account) {
    const session = readStoredSession();
    if (!session?.loggedIn || session.accountId !== account.profile.accountId) return;
    getStorage()?.setItem(ACCOUNT_SESSION_KEY, encodePayload({ ...session, displayName: account.profile.displayName }));
}

function getStorage() {
    return globalThis.localStorage ?? globalThis.window?.localStorage ?? null;
}

function hashPassword(password, salt) {
    return toBase64(`${salt}:${String(password)}`);
}

function validatePassword(password) {
    const value = String(password ?? '');
    if (!value) return 'Password is required.';
    if (value.length < 3) return 'Password must be at least 3 characters.';
    return null;
}

function cloneAccount(account) {
    return JSON.parse(JSON.stringify(account));
}

function oneOf(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
}

function clampInteger(value, min, max, fallback) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(min, Math.min(max, parsed));
}

function formatSignedOffset(offset) {
    return Number(offset) >= 0 ? `+${offset}` : String(offset);
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
    return normalized || 'Account';
}
