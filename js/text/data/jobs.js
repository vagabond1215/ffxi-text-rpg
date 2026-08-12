import { canonicalizeDisciplineId } from './legacyIdentity.js';

const DISCIPLINES = {
    vanguard: ['Vanguard', 'VGD', 'frontline physical combatant and durable weapon generalist', ['str', 'vit'], ['attack', 'defense'], ['axe', 'greatAxe', 'sword', 'shield']],
    pugilist: ['Pugilist', 'PUG', 'hand-to-hand combatant with high endurance and counter pressure', ['str', 'vit'], ['attack', 'counter'], ['handToHand', 'guard', 'evasion']],
    lifewarden: ['Lifewarden', 'LIF', 'healer and defensive support caster', ['mnd'], ['curePotency', 'magicDefense'], ['healingMagic', 'divineMagic', 'enhancingMagic']],
    elementalist: ['Elementalist', 'ELM', 'elemental damage caster', ['int'], ['magicAttack', 'magicAccuracy'], ['elementalMagic', 'darkMagic', 'enfeeblingMagic']],
    spellblade: ['Spellblade', 'SPB', 'hybrid sword-and-magic combatant with control and support tools', ['int', 'mnd'], ['magicAccuracy', 'spellInterruptionRate'], ['sword', 'enfeeblingMagic', 'enhancingMagic']],
    shadowhand: ['Shadowhand', 'SHD', 'agile combatant with evasion, precision, scouting, and opportunistic utility', ['dex', 'agi'], ['accuracy', 'evasion'], ['dagger', 'evasion', 'throwing']],
    oathguard: ['Oathguard', 'OAT', 'defensive protector using shield discipline and restorative support', ['vit', 'mnd'], ['defense', 'enmity', 'shieldBlock'], ['sword', 'shield', 'healingMagic']],
    duskblade: ['Duskblade', 'DSK', 'heavy-weapon combatant using dangerous occult techniques', ['str', 'int'], ['attack', 'magicAttack'], ['greatSword', 'scythe', 'darkMagic']],
    wildbinder: ['Wildbinder', 'WLD', 'field specialist who works with beasts and fights effectively alone', ['str', 'chr'], ['attack'], ['axe', 'evasion']],
    cantor: ['Cantor', 'CNT', 'voice-and-instrument support specialist', ['chr'], ['magicAccuracy'], ['singing', 'stringInstrument', 'windInstrument']],
    wayfinder: ['Wayfinder', 'WAY', 'ranged hunter, scout, and wilderness combatant', ['agi', 'dex'], ['rangedAttack', 'rangedAccuracy'], ['archery', 'marksmanship', 'dagger']],
    bladeAdept: ['Blade Adept', 'BLA', 'disciplined two-handed blade combatant focused on decisive techniques', ['str'], ['attack'], ['greatKatana', 'polearm', 'archery']],
    veilrunner: ['Veilrunner', 'VEI', 'mobile evasive combatant using paired weapons, misdirection, and prepared arts', ['agi', 'dex'], ['evasion', 'delayReduction'], ['katana', 'ninjutsu', 'throwing']],
    skyLancer: ['Sky Lancer', 'SKY', 'mobile polearm specialist trained in leaping attacks and aerial partnership traditions', ['str'], ['attack'], ['polearm', 'evasion']],
    eidolist: ['Eidolist', 'EID', 'caller who forms pacts with manifested magical beings', ['mp', 'mnd'], ['magicAttack'], ['summoningMagic', 'staff']],
    echoSage: ['Echo Sage', 'ECH', 'adaptive magic combatant who studies and reproduces creature techniques', ['str', 'int'], ['attack', 'magicAccuracy'], ['blueMagic', 'sword']],
    freeCaptain: ['Free Captain', 'CAP', 'ranged skirmisher and battlefield coordinator drawing on luck, nerve, and command', ['agi', 'chr'], ['rangedAttack', 'rangedAccuracy'], ['marksmanship', 'sword']],
    artificer: ['Artificer', 'ART', 'technical combatant using crafted devices and autonomous constructs', ['dex'], ['accuracy'], ['handToHand', 'evasion']],
    rhythmblade: ['Rhythmblade', 'RHB', 'mobile support combatant whose movement converts momentum into aid and pressure', ['dex', 'agi'], ['evasion', 'accuracy'], ['dagger', 'evasion']],
    savant: ['Savant', 'SAV', 'strategic magical scholar who shifts between restorative and destructive methods', ['int', 'mnd'], ['magicAttack', 'curePotency'], ['elementalMagic', 'healingMagic', 'enhancingMagic']],
    leykeeper: ['Leykeeper', 'LEY', 'area-support caster attuned to terrain and ambient magical currents', ['int', 'mnd'], ['magicAttack', 'magicAccuracy'], ['geomancy', 'handbell', 'elementalMagic']],
    wardsword: ['Wardsword', 'WRD', 'frontline protector using warding techniques against hostile magic', ['vit', 'mnd'], ['magicDefense', 'magicEvasion', 'enmity'], ['greatSword', 'enhancingMagic', 'evasion']],
};

export const JOB_DEFINITIONS = Object.freeze(Object.fromEntries(
    Object.entries(DISCIPLINES).map(([id, [name, abbreviation, role, primaryAttributes, derivedFocus, skillFocus]]) => [
        id,
        {
            id,
            name,
            abbreviation,
            role,
            primaryAttributes,
            derivedFocus,
            skillFocus,
            unlockedByDefault: ['vanguard', 'pugilist', 'lifewarden', 'elementalist', 'spellblade', 'shadowhand'].includes(id),
        },
    ]),
));

export const DEFAULT_JOB_ID = 'vanguard';

export function getJob(jobId = DEFAULT_JOB_ID) {
    return JOB_DEFINITIONS[canonicalizeDisciplineId(jobId)] ?? JOB_DEFINITIONS[DEFAULT_JOB_ID];
}

export function listJobs() {
    return Object.values(JOB_DEFINITIONS);
}
