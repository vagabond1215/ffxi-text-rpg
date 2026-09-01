import { enrichEquipmentItem } from '../data/equipmentCatalog.js';
import { hasItemFlag } from '../data/itemSchema.js';

export const WEAPON_CADENCE_VERSION = 1;
export const WEAPON_DELAY_UNITS_PER_SECOND = 60;
export const DEFAULT_UNARMED_WEAPON_DELAY = 180;
export const DEFAULT_RANGED_WEAPON_DELAY = 300;

export function weaponDelayToRecoverySeconds(delayUnits, options = {}) {
    const fallback = Math.max(1, Math.floor(Number(options.fallbackDelayUnits) || DEFAULT_UNARMED_WEAPON_DELAY));
    const delay = Math.max(1, Math.floor(Number(delayUnits) || fallback));
    return Math.max(1, Math.round(delay / WEAPON_DELAY_UNITS_PER_SECOND));
}

export function scaleWeaponRecoverySeconds(baseSeconds, multiplier = 1) {
    const base = Math.max(1, Math.floor(Number(baseSeconds) || 1));
    const scale = Math.max(0.1, Number(multiplier) || 1);
    return Math.max(1, Math.round(base * scale));
}

export function getMeleeCadenceProfile(actor) {
    const mainHand = actor?.equipment?.mainHand ? enrichEquipmentItem(actor.equipment.mainHand) : null;
    const delayUnits = mainHand?.weaponDelay ?? DEFAULT_UNARMED_WEAPON_DELAY;
    return Object.freeze({
        version: WEAPON_CADENCE_VERSION,
        mode: 'melee',
        itemId: mainHand?.id ?? null,
        weaponFamily: normalizeFamily(mainHand?.weaponCategory) ?? 'unarmed',
        delayUnits,
        recoverySeconds: weaponDelayToRecoverySeconds(delayUnits),
        delaySource: mainHand?.weaponDelay !== null && mainHand?.weaponDelay !== undefined ? 'equipment' : 'unarmed-fallback',
        conversion: 'rounded-delay-units-per-second-v1',
        unitsPerSecond: WEAPON_DELAY_UNITS_PER_SECOND,
    });
}

export function getRangedCadenceProfile(actor) {
    const check = validateRangedLoadout(actor);
    if (!check.ok) return null;
    const delayUnits = check.weapon.weaponDelay ?? DEFAULT_RANGED_WEAPON_DELAY;
    return Object.freeze({
        version: WEAPON_CADENCE_VERSION,
        mode: 'ranged',
        itemId: check.weapon.id,
        ammoItemId: check.ammo.id,
        weaponFamily: normalizeFamily(check.weapon.weaponCategory) ?? 'ranged',
        delayUnits,
        recoverySeconds: weaponDelayToRecoverySeconds(delayUnits, { fallbackDelayUnits: DEFAULT_RANGED_WEAPON_DELAY }),
        delaySource: check.weapon.weaponDelay !== null && check.weapon.weaponDelay !== undefined ? 'equipment' : 'ranged-fallback',
        conversion: 'rounded-delay-units-per-second-v1',
        unitsPerSecond: WEAPON_DELAY_UNITS_PER_SECOND,
    });
}

export function validateRangedLoadout(actor) {
    const ranged = actor?.equipment?.ranged ? enrichEquipmentItem(actor.equipment.ranged) : null;
    const ammo = actor?.equipment?.ammo ? enrichEquipmentItem(actor.equipment.ammo) : null;
    if (!ranged || !(hasItemFlag(ranged, 'rangedWeapon') || ranged.equipmentSlot === 'ranged')) {
        return { ok: false, code: 'combat.ranged.weapon-required', reason: 'Equip a ranged weapon first.' };
    }
    if (!ammo || !(hasItemFlag(ammo, 'ammo') || ammo.equipmentSlot === 'ammo')) {
        return { ok: false, code: 'combat.ranged.ammo-required', reason: 'Equip compatible ammunition first.' };
    }
    if ((Number(ammo.quantity) || 0) < 1) {
        return { ok: false, code: 'combat.ranged.ammo-empty', reason: 'No ammunition remains.' };
    }
    const weaponFamily = normalizeFamily(ranged.weaponCategory);
    const ammoFamily = normalizeFamily(ammo.weaponCategory);
    if (weaponFamily && ammoFamily && weaponFamily !== ammoFamily) {
        return { ok: false, code: 'combat.ranged.ammo-incompatible', reason: `${ammo.name} is not compatible with ${ranged.name}.` };
    }
    return { ok: true, weapon: ranged, ammo };
}

function normalizeFamily(value) {
    const normalized = String(value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
    return normalized || null;
}
