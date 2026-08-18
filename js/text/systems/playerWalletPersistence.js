import { CURRENCY_KEYS } from '../data/systemConstants.js';

const CURRENCY_KEY_SET = new Set(CURRENCY_KEYS);

export function validatePersistedPlayerWallet(wallet) {
    if (!isObject(wallet)) return ['wallet must be an object.'];

    const issues = [];
    for (const currency of CURRENCY_KEYS) {
        if (!Number.isInteger(wallet[currency]) || wallet[currency] < 0) {
            issues.push(`wallet.${currency} must be a non-negative integer.`);
        }
    }
    for (const currency of Object.keys(wallet)) {
        if (!CURRENCY_KEY_SET.has(currency)) issues.push(`wallet.${currency} is not a canonical currency key.`);
    }
    return issues;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
