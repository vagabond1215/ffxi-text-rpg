export const LEGACY_BRANCH_IMPORTS = Object.freeze({
    jobAbilityTraitSource: 'codex/create-ffxi-database-for-races-and-jobs',
    weaponSkillSource: 'codex/update-weaponskill-and-tp-systems',
    vendorItemSource: 'codex/update-bronze-armor-item-data',
    bestiarySource: 'codex/update-south-gustaberg-monster-spawn-data',
    startingGearSource: 'codex/add-rest-feature-and-starting-gear',
    confidence: 'legacy-branch-import-unverified',
});

export const RECOVERED_JOB_ABILITIES = Object.freeze({
    warrior: abilities('warrior', [
        ability('provoke', 'Provoke', 5, 'Forces enemy attention.'),
        ability('berserk', 'Berserk', 15, 'Increases attack and lowers defense.'),
        ability('defender', 'Defender', 15, 'Raises defense and lowers attack.'),
        ability('warcry', 'Warcry', 35, 'Boosts nearby party attack.'),
        ability('aggressor', 'Aggressor', 45, 'Increases accuracy and lowers evasion.'),
        ability('mighty-strikes', 'Mighty Strikes', 1, 'All attacks critical hit.'),
    ]),
    monk: abilities('monk', [
        ability('boost', 'Boost', 5, 'Raises attack for one strike.'),
        ability('dodge', 'Dodge', 15, 'Raises evasion.'),
        ability('focus', 'Focus', 15, 'Raises accuracy.'),
        ability('chakra', 'Chakra', 35, 'Restores HP.'),
        ability('hundred-fists', 'Hundred Fists', 1, 'Greatly increases attack speed.'),
    ]),
    whiteMage: abilities('whiteMage', [
        ability('benediction', 'Benediction', 1, 'Restores HP to party.'),
        ability('divine-seal', 'Divine Seal', 25, 'Enhances next healing spell.'),
        ability('martyr', 'Martyr', 70, 'Transfers HP to party member.'),
    ]),
    blackMage: abilities('blackMage', [
        ability('manafont', 'Manafont', 1, 'Spells cost no MP.'),
        ability('elemental-seal', 'Elemental Seal', 15, 'Improves spell accuracy.'),
        ability('burst-affinity', 'Burst Affinity', 40, 'Enables magic burst on next spell.'),
    ]),
    redMage: abilities('redMage', [
        ability('chainspell', 'Chainspell', 1, 'Removes recast on spells.'),
        ability('convert', 'Convert', 40, 'Swaps HP and MP.'),
        ability('composure', 'Composure', 50, 'Enhances enhancing magic duration.'),
    ]),
    thief: abilities('thief', [
        ability('steal', 'Steal', 5, 'Attempts to steal an item.'),
        ability('flee', 'Flee', 25, 'Increases movement speed.'),
        ability('sneak-attack', 'Sneak Attack', 30, 'Next attack deals critical damage.'),
        ability('mug', 'Mug', 35, 'Steals gil from target.'),
        ability('trick-attack', 'Trick Attack', 45, 'Transfers enmity to target ally.'),
        ability('perfect-dodge', 'Perfect Dodge', 1, 'Avoid all attacks.'),
    ]),
});

export const RECOVERED_JOB_TRAITS = Object.freeze({
    warrior: traits('warrior', [
        trait('defense-bonus', 'Defense Bonus', 10, 'Increases defense.'),
        trait('resist-virus', 'Resist Virus', 20, 'Reduces chance to contract Virus.'),
        trait('double-attack', 'Double Attack', 25, 'Chance to attack twice.'),
        trait('attack-bonus', 'Attack Bonus', 30, 'Increases attack power.'),
    ]),
    monk: traits('monk', [
        trait('martial-arts', 'Martial Arts', 1, 'Decreases hand-to-hand delay.'),
        trait('max-hp-boost', 'Max HP Boost', 10, 'Raises maximum HP.'),
        trait('counter', 'Counter', 25, 'Chance to counterattack.'),
    ]),
    whiteMage: traits('whiteMage', [
        trait('clear-mind', 'Clear Mind', 15, 'Increases MP recovered while healing.'),
        trait('magic-defense-bonus', 'Magic Defense Bonus', 45, 'Increases magic defense.'),
        trait('auto-refresh', 'Auto Refresh', 45, 'Regenerates MP.'),
    ]),
    blackMage: traits('blackMage', [
        trait('magic-attack-bonus', 'Magic Attack Bonus', 20, 'Boosts magic damage.'),
        trait('conserve-mp', 'Conserve MP', 45, 'Occasionally reduces MP cost.'),
    ]),
    redMage: traits('redMage', [
        trait('fast-cast', 'Fast Cast', 15, 'Shortens casting time.'),
        trait('magic-accuracy-bonus', 'Magic Accuracy Bonus', 40, 'Improves magic accuracy.'),
    ]),
    thief: traits('thief', [
        trait('treasure-hunter', 'Treasure Hunter', 5, 'Improves drop rates.'),
        trait('gilfinder', 'Gilfinder', 20, 'Increases gil earned from enemies.'),
        trait('triple-attack', 'Triple Attack', 79, 'Chance to attack three times.'),
    ]),
});

export const RECOVERED_WEAPON_SKILLS = Object.freeze({
    waspSting: weaponSkill('wasp-sting', 'Wasp Sting', 'dagger', 1, [1.0, 1.0, 1.0], { dex: 0.3 }),
    viperBite: weaponSkill('viper-bite', 'Viper Bite', 'dagger', 1, [1.5, 1.5, 1.5], { dex: 0.3 }),
    fastBlade: weaponSkill('fast-blade', 'Fast Blade', 'sword', 1, [1.0, 1.0, 1.0], { str: 0.3 }),
    burningBlade: weaponSkill('burning-blade', 'Burning Blade', 'sword', 1, [1.5, 1.5, 1.5], { str: 0.3 }),
    savageBlade: weaponSkill('savage-blade', 'Savage Blade', 'sword', 1, [4.0, 10.25, 13.75], { str: 0.5, mnd: 0.5 }),
});

export const RECOVERED_STARTER_ITEMS = Object.freeze({
    bronzeDagger: item('bronze-dagger', 'Bronze Dagger', 'weapon', { price: 140, sellPrice: 70, damage: 3, delay: 183, slot: 'mainHand' }),
    bronzeSword: item('bronze-sword', 'Bronze Sword', 'weapon', { price: 246, sellPrice: 123, damage: 6, delay: 231, slot: 'mainHand' }),
    bronzeAxe: item('bronze-axe', 'Bronze Axe', 'weapon', { price: 360, sellPrice: 180, damage: 7, delay: 276, slot: 'mainHand' }),
    bronzeSpear: item('bronze-spear', 'Bronze Spear', 'weapon', { price: 520, sellPrice: 260, damage: 8, delay: 303, slot: 'mainHand' }),
    bronzeKnuckles: item('bronze-knuckles', 'Bronze Knuckles', 'weapon', { price: 224, sellPrice: 112, damage: 4, delay: 96, slot: 'mainHand' }),
    willowStaff: item('willow-staff', 'Willow Staff', 'weapon', { price: 200, sellPrice: 100, damage: 4, delay: 366, slot: 'mainHand' }),
    mapleWand: item('maple-wand', 'Maple Wand', 'weapon', { price: 47, sellPrice: 23, damage: 3, delay: 240, slot: 'mainHand' }),
    bronzeShield: item('bronze-shield', 'Bronze Shield', 'armor', { price: 220, sellPrice: 110, defense: 2, slot: 'offHand' }),
    bronzeCap: item('bronze-cap', 'Bronze Cap', 'armor', { price: 174, sellPrice: 87, defense: 2, slot: 'head' }),
    bronzeHarness: item('bronze-harness', 'Bronze Harness', 'armor', { price: 251, sellPrice: 125, defense: 4, slot: 'body' }),
    bronzeMittens: item('bronze-mittens', 'Bronze Mittens', 'armor', { price: 136, sellPrice: 68, defense: 1, slot: 'hands' }),
    leatherVest: item('leather-vest', 'Leather Vest', 'armor', { price: 604, sellPrice: 302, defense: 7, slot: 'body' }),
    leatherGloves: item('leather-gloves', 'Leather Gloves', 'armor', { price: 176, sellPrice: 88, defense: 4, slot: 'hands' }),
    leatherBoots: item('leather-boots', 'Leather Boots', 'armor', { price: 176, sellPrice: 88, defense: 3, slot: 'feet' }),
    potion: item('potion', 'Potion', 'consumable', { price: 892, sellPrice: 446, stack: 12, effect: 'Restores a small amount of HP.' }),
    antidote: item('antidote', 'Antidote', 'consumable', { price: 309, sellPrice: 155, stack: 12, effect: 'Cures poison.' }),
    scrollCure: item('scroll-cure', 'Scroll of Cure', 'scroll', { price: 66, sellPrice: 33, teaches: 'cure' }),
    scrollFire: item('scroll-fire', 'Scroll of Fire', 'scroll', { price: 600, sellPrice: 300, teaches: 'fire' }),
    pickaxe: item('pickaxe', 'Pickaxe', 'tool', { price: 200, sellPrice: 100, use: 'mining' }),
});

export const RECOVERED_BESTIARY_NOTES = Object.freeze({
    westRonfaure: bestiaryZone('west-ronfaure', [
        monster('forest-hare', 'Forest Hare', '1-5', false, false, 'Sight & Scent', ['Hare Meat', 'Rabbit Hide']),
        monster('carrion-worm', 'Carrion Worm', '1-5', true, false, 'Sound', ['Copper Ore', 'Flint Stone', 'Silver Ore', 'Zinc Ore']),
        monster('tiny-bee', 'Tiny Bee', '1-3', false, false, 'Sight', ['Insect Wing', 'Beeswax', 'Honey']),
        monster('orcish-fodder', 'Orcish Fodder', '3-8', true, true, 'Sight', ['Orcish Axe', 'Bronze Axe', 'Stone']),
    ]),
    southGustaberg: bestiaryZone('south-gustaberg', [
        monster('huge-hornet', 'Huge Hornet', '1', false, false, 'Sight & Scent', ['Insect Wing'], { spawns: 26, spawnChance: 0.531 }),
        monster('tunnel-worm', 'Tunnel Worm', '1', false, false, 'Sound', ['Flint Stone'], { spawns: 14, spawnChance: 0.286, coords: ['I-7', 'J-7', 'J-8', 'K-7', 'K-8'] }),
        monster('stone-eater', 'Stone Eater', '1-5', false, false, 'Sound', [], { spawns: 68, spawnChance: 1.388 }),
        monster('goblin-fisher', 'Goblin Fisher', '3-4', true, true, 'Sight', [], { spawns: 6, spawnChance: 0.122, coords: ['E-8', 'E-9', 'K-10', 'L-8', 'L-9', 'L-10'] }),
        monster('goblin-thug', 'Goblin Thug', '3-8', true, true, 'Sight', [], { spawns: 17, spawnChance: 0.347 }),
        monster('young-quadav', 'Young Quadav', '3-8', true, true, 'Sound', [], { spawns: 23, spawnChance: 0.469 }),
        monster('black-wolf', 'Black Wolf', '5-8', true, false, 'Sound & Low HP', [], { spawns: 10, spawnChance: 0.204, nightOnly: true }),
    ]),
    westSarutabaruta: bestiaryZone('west-sarutabaruta', [
        monster('savanna-rarab', 'Savanna Rarab', '1-6', false, false, 'Sight', ['Rabbit Hide', 'Rabbit Meat']),
        monster('tiny-mandragora', 'Tiny Mandragora', '1', false, false, 'Sight', ['Mandragora Flower', 'La Theine Cabbage']),
        monster('mandragora', 'Mandragora', '3-5', true, false, 'Sound', ['Cornette', 'Four-Leaf Mandragora Bud', 'Two-Leaf Mandragora Bud', 'Yuhtunga Sulfur']),
        monster('yagudo-initiate', 'Yagudo Initiate', '1-8', true, true, 'Sight', ['Yagudo Feather', 'Bird Egg']),
    ]),
});

export function describeLegacyRecoveredData() {
    return [
        'Legacy branch data consolidated:',
        `- job ability groups: ${Object.keys(RECOVERED_JOB_ABILITIES).length}`,
        `- job trait groups: ${Object.keys(RECOVERED_JOB_TRAITS).length}`,
        `- weapon skills: ${Object.keys(RECOVERED_WEAPON_SKILLS).length}`,
        `- starter items: ${Object.keys(RECOVERED_STARTER_ITEMS).length}`,
        `- bestiary zones: ${Object.keys(RECOVERED_BESTIARY_NOTES).length}`,
        '',
        `Confidence: ${LEGACY_BRANCH_IMPORTS.confidence}`,
    ].join('\n');
}

function abilities(jobId, entries) {
    return Object.freeze(entries.map((entry) => ({ ...entry, jobId, kind: 'ability', source: LEGACY_BRANCH_IMPORTS.jobAbilityTraitSource })));
}

function traits(jobId, entries) {
    return Object.freeze(entries.map((entry) => ({ ...entry, jobId, kind: 'trait', source: LEGACY_BRANCH_IMPORTS.jobAbilityTraitSource })));
}

function ability(id, name, level, effect) {
    return Object.freeze({ id, name, level, effect });
}

function trait(id, name, level, effect) {
    return Object.freeze({ id, name, level, effect });
}

function weaponSkill(id, name, skillType, hits, ftp, wsc) {
    return Object.freeze({ id, name, skillType, hits, ftp, wsc, source: LEGACY_BRANCH_IMPORTS.weaponSkillSource });
}

function item(id, name, type, options = {}) {
    return Object.freeze({ id, name, type, levelRequirement: 1, stack: 1, source: LEGACY_BRANCH_IMPORTS.vendorItemSource, ...options });
}

function bestiaryZone(zoneId, entries) {
    return Object.freeze(entries.map((entry) => ({ ...entry, zoneId, source: LEGACY_BRANCH_IMPORTS.bestiarySource })));
}

function monster(id, name, levelRange, aggressive, linking, detection, drops = [], extras = {}) {
    return Object.freeze({ id, name, levelRange, aggressive, linking, detection, drops, ...extras });
}
