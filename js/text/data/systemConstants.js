export const ATTRIBUTE_KEYS = Object.freeze([
    'str',
    'dex',
    'vit',
    'agi',
    'int',
    'mnd',
    'chr',
]);

export const RESOURCE_KEYS = Object.freeze([
    'hp',
    'mp',
    'tp',
]);

export const ELEMENT_KEYS = Object.freeze([
    'fire',
    'ice',
    'wind',
    'earth',
    'lightning',
    'water',
    'light',
    'dark',
]);

export const DERIVED_STAT_KEYS = Object.freeze([
    'attack',
    'defense',
    'accuracy',
    'evasion',
    'rangedAttack',
    'rangedAccuracy',
    'magicAttack',
    'magicAccuracy',
    'magicDefense',
    'magicEvasion',
    'criticalRate',
    'criticalDamage',
    'haste',
    'delayReduction',
    'enmity',
    'shieldBlock',
    'parry',
    'guard',
    'counter',
    'curePotency',
    'spellInterruptionRate',
    'physicalDamageTaken',
    'magicDamageTaken',
    'breathDamageTaken',
    'movementSpeed',
]);

export const SKILL_KEYS = Object.freeze([
    'handToHand',
    'dagger',
    'sword',
    'greatSword',
    'axe',
    'greatAxe',
    'scythe',
    'polearm',
    'katana',
    'greatKatana',
    'club',
    'staff',
    'archery',
    'marksmanship',
    'throwing',
    'guard',
    'evasion',
    'shield',
    'parrying',
    'divineMagic',
    'healingMagic',
    'enhancingMagic',
    'enfeeblingMagic',
    'elementalMagic',
    'darkMagic',
    'summoningMagic',
    'ninjutsu',
    'singing',
    'stringInstrument',
    'windInstrument',
    'blueMagic',
    'geomancy',
    'handbell',
]);

export const EQUIPMENT_SLOTS = Object.freeze([
    'mainHand',
    'offHand',
    'ranged',
    'ammo',
    'head',
    'neck',
    'leftEar',
    'rightEar',
    'body',
    'hands',
    'leftRing',
    'rightRing',
    'back',
    'waist',
    'legs',
    'feet',
]);

export const ENTITY_TYPES = Object.freeze({
    PLAYER: 'player',
    NPC: 'npc',
    ENEMY: 'enemy',
});

export const STATUS_CATEGORIES = Object.freeze({
    BUFF: 'buff',
    DEBUFF: 'debuff',
    FOOD: 'food',
    SONG: 'song',
    ROLL: 'roll',
    SAMBA: 'samba',
    DOT: 'damageOverTime',
    REGEN: 'regen',
    REFRESH: 'refresh',
    REGAIN: 'regain',
    SPECIAL: 'special',
});

export const CURRENCY_KEYS = Object.freeze([
    'gil',
    'conquestPoints',
    'imperialStanding',
    'alliedNotes',
    'bayld',
    'sparks',
    'accolades',
]);

export function createZeroBlock(keys) {
    return Object.fromEntries(keys.map((key) => [key, 0]));
}
