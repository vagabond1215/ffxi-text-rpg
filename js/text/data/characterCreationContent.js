import { getJob } from './jobs.js';
import { getNation } from './nations.js';
import { getPlace } from './places.js';
import { RACES } from './races.js';

const RACE_PRESENTATION = Object.freeze({
    hume: presentation('Adaptable citizens found across the nations. Humes have no sharp weakness and are easy to build into any starting role.', ['Balanced', 'Flexible']),
    elvaan: presentation('Tall, proud, and physically imposing. Elvaan favor direct martial roles and disciplined divine practice.', ['Strong', 'Stalwart']),
    tarutaru: presentation('Small-bodied spellcasters with remarkable magical reserves. Tarutaru reward careful positioning and strong spell use.', ['Magical', 'Fragile']),
    mithra: presentation('Quick, perceptive hunters with excellent agility and accuracy. Mithra naturally suit evasive and precise physical jobs.', ['Agile', 'Accurate']),
    galka: presentation('Powerful, enduring laborers and warriors with exceptional toughness. Galka excel where durability matters most.', ['Durable', 'Physical']),
});

const NATION_PRESENTATION = Object.freeze({
    sandoria: presentation('A fortified northern kingdom of knights, banners, and old vows. New adventurers begin inside Southern San d’Oria with Ronfaure beyond the gates.', ['Kingdom', 'Ronfaure']),
    bastok: presentation('An industrial republic of markets, mines, engineers, and hard-earned ambition. New adventurers begin in Bastok Markets with Gustaberg outside the city.', ['Republic', 'Gustaberg']),
    windurst: presentation('A magical federation of canals, towers, academies, and living tradition. New adventurers begin in Windurst Waters with Sarutabaruta nearby.', ['Federation', 'Sarutabaruta']),
});

const JOB_PRESENTATION = Object.freeze({
    warrior: presentation('A weapon generalist trained to survive the front line and turn steady pressure into victory.', ['Frontline', 'Weaponry']),
    monk: presentation('A hand-to-hand fighter with high endurance, counter pressure, and simple early momentum.', ['Brawler', 'High HP']),
    whiteMage: presentation('A defensive support caster who keeps allies alive with healing and protection.', ['Healer', 'Support']),
    blackMage: presentation('An elemental damage caster who trades fragility for direct magical force.', ['Caster', 'Damage']),
    redMage: presentation('A hybrid spellblade using swordplay, support magic, and enfeebling tools.', ['Hybrid', 'Control']),
    thief: presentation('An agile attacker built around evasion, accuracy, and opportunistic combat utility.', ['Agile', 'Utility']),
});

const SEX_LABELS = Object.freeze({
    male: 'Male',
    female: 'Female',
});

export function getRaceCreationPresentation(raceId) {
    const race = RACES[raceId] ?? RACES.hume;
    return { id: race.id, name: race.name, ...(RACE_PRESENTATION[race.id] ?? presentation(race.description, [])) };
}

export function getNationCreationPresentation(nationId) {
    const nation = getNation(nationId);
    const place = getPlace(nation.startingPlaceId);
    return {
        id: nation.id,
        name: nation.name,
        startingPlaceId: nation.startingPlaceId,
        startingPlaceName: place?.name ?? nation.startingPlaceId,
        starterRegion: place?.region ?? 'Unknown',
        startingMapIds: [...nation.startingMapIds],
        startingKeyItems: [...nation.startingKeyItems],
        ...(NATION_PRESENTATION[nation.id] ?? presentation(nation.description, [])),
    };
}

export function getJobCreationPresentation(jobId) {
    const job = getJob(jobId);
    return { id: job.id, name: job.name, abbreviation: job.abbreviation, role: job.role, ...(JOB_PRESENTATION[job.id] ?? presentation(job.role, [])) };
}

export function describeCreatorSex(sex) {
    return SEX_LABELS[sex] ?? capitalize(sex);
}

export function composeStartingNarrative({ name = 'Adventurer', nationId = 'sandoria', mainJobId = 'warrior' } = {}) {
    const nation = getNationCreationPresentation(nationId);
    const job = getJobCreationPresentation(mainJobId);
    const adventurerName = normalizeName(name) || 'Adventurer';
    return [
        `${adventurerName} steps into ${nation.startingPlaceName}, where the first work of an adventurer begins close to home.`,
        `${nation.blurb}`,
        `As a ${job.name}, your role is clear: ${job.role}. The gates to ${nation.starterRegion} are not far, and reputation starts with the first task you finish.`,
    ];
}

function presentation(blurb, tags = []) {
    return Object.freeze({ blurb, tags: Object.freeze([...tags]) });
}

function normalizeName(value) {
    return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function capitalize(value) {
    const text = String(value ?? '');
    return text ? `${text.slice(0, 1).toUpperCase()}${text.slice(1)}` : '';
}
