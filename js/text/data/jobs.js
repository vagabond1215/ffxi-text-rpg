const JOBS = {
    warrior: ['Warrior', 'WAR', 'frontline physical attacker and durable weapon generalist', ['str', 'vit'], ['attack', 'defense'], ['axe', 'greatAxe', 'sword', 'shield']],
    monk: ['Monk', 'MNK', 'hand-to-hand attacker with high HP and counter pressure', ['str', 'vit'], ['attack', 'counter'], ['handToHand', 'guard', 'evasion']],
    whiteMage: ['White Mage', 'WHM', 'healer and defensive support caster', ['mnd'], ['curePotency', 'magicDefense'], ['healingMagic', 'divineMagic', 'enhancingMagic']],
    blackMage: ['Black Mage', 'BLM', 'elemental damage caster', ['int'], ['magicAttack', 'magicAccuracy'], ['elementalMagic', 'darkMagic', 'enfeeblingMagic']],
    redMage: ['Red Mage', 'RDM', 'hybrid caster with enfeebling and support tools', ['int', 'mnd'], ['magicAccuracy', 'spellInterruptionRate'], ['sword', 'enfeeblingMagic', 'enhancingMagic']],
    thief: ['Thief', 'THF', 'agile attacker with evasion and loot utility', ['dex', 'agi'], ['accuracy', 'evasion'], ['dagger', 'evasion', 'throwing']],
    paladin: ['Paladin', 'PLD', 'defensive tank with shield and healing support', ['vit', 'mnd'], ['defense', 'enmity', 'shieldBlock'], ['sword', 'shield', 'healingMagic']],
    darkKnight: ['Dark Knight', 'DRK', 'heavy weapon attacker with dark magic flavor', ['str', 'int'], ['attack', 'magicAttack'], ['greatSword', 'scythe', 'darkMagic']],
    beastmaster: ['Beastmaster', 'BST', 'pet-oriented physical solo specialist', ['str', 'chr'], ['attack'], ['axe', 'evasion']],
    bard: ['Bard', 'BRD', 'song-based party support', ['chr'], ['magicAccuracy'], ['singing', 'stringInstrument', 'windInstrument']],
    ranger: ['Ranger', 'RNG', 'ranged physical attacker', ['agi', 'dex'], ['rangedAttack', 'rangedAccuracy'], ['archery', 'marksmanship', 'dagger']],
    samurai: ['Samurai', 'SAM', 'TP and weapon-skill focused attacker', ['str'], ['attack'], ['greatKatana', 'polearm', 'archery']],
    ninja: ['Ninja', 'NIN', 'dual-wield evasive attacker with ninjutsu utility', ['agi', 'dex'], ['evasion', 'delayReduction'], ['katana', 'ninjutsu', 'throwing']],
    dragoon: ['Dragoon', 'DRG', 'polearm attacker with jump and wyvern identity', ['str'], ['attack'], ['polearm', 'evasion']],
    summoner: ['Summoner', 'SMN', 'avatar-based magical support and damage', ['mp', 'mnd'], ['magicAttack'], ['summoningMagic', 'staff']],
    blueMage: ['Blue Mage', 'BLU', 'learned monster magic hybrid', ['str', 'int'], ['attack', 'magicAccuracy'], ['blueMagic', 'sword']],
    corsair: ['Corsair', 'COR', 'ranged attacker and roll-based support', ['agi', 'chr'], ['rangedAttack', 'rangedAccuracy'], ['marksmanship', 'sword']],
    puppetmaster: ['Puppetmaster', 'PUP', 'pet job using automaton and hand-to-hand combat', ['dex'], ['accuracy'], ['handToHand', 'evasion']],
    dancer: ['Dancer', 'DNC', 'TP-based support and evasive melee', ['dex', 'agi'], ['evasion', 'accuracy'], ['dagger', 'evasion']],
    scholar: ['Scholar', 'SCH', 'strategic magic job that shifts between healing and nuking', ['int', 'mnd'], ['magicAttack', 'curePotency'], ['elementalMagic', 'healingMagic', 'enhancingMagic']],
    geomancer: ['Geomancer', 'GEO', 'area support caster with geomancy identity', ['int', 'mnd'], ['magicAttack', 'magicAccuracy'], ['geomancy', 'handbell', 'elementalMagic']],
    runeFencer: ['Rune Fencer', 'RUN', 'magic-resistant frontline tank', ['vit', 'mnd'], ['magicDefense', 'magicEvasion', 'enmity'], ['greatSword', 'enhancingMagic', 'evasion']],
};

export const JOB_DEFINITIONS = Object.freeze(Object.fromEntries(
    Object.entries(JOBS).map(([id, [name, abbreviation, role, primaryAttributes, derivedFocus, skillFocus]]) => [
        id,
        {
            id,
            name,
            abbreviation,
            role,
            primaryAttributes,
            derivedFocus,
            skillFocus,
            unlockedByDefault: ['warrior', 'monk', 'whiteMage', 'blackMage', 'redMage', 'thief'].includes(id),
        },
    ]),
));

export const DEFAULT_JOB_ID = 'warrior';

export function getJob(jobId = DEFAULT_JOB_ID) {
    return JOB_DEFINITIONS[jobId] ?? JOB_DEFINITIONS[DEFAULT_JOB_ID];
}

export function listJobs() {
    return Object.values(JOB_DEFINITIONS);
}
