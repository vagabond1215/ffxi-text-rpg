import { getJob } from './jobs.js';
import { getNation } from './nations.js';
import { getPlace } from './places.js';
import { getRace } from './races.js';

const RACE_PRESENTATION = Object.freeze({
    human: presentation('Humans live throughout the major powers and trade roads. Their varied communities make them a flexible starting point for nearly any path.', ['Adaptable', 'Widespread']),
    lethari: presentation('Lethari are long-lived woodland and highland people whose communities place weight on memory, craft, oath, and disciplined training.', ['Resolute', 'Traditional']),
    miri: presentation('Miri communities are known for dense scholarship, ingenious craft, and practical magic. Their smaller frames reward preparation over brute force.', ['Scholarly', 'Arcane']),
    veyra: presentation('Veyra clans have strong traditions of hunting, scouting, travel, and exchange. Their agility rewards mobile and precise approaches.', ['Agile', 'Perceptive']),
    korren: presentation('Korren communities carry deep traditions of masonry, mining, engineering, and long-distance kinship. Their physical resilience suits demanding work and combat.', ['Resilient', 'Practical']),
});

const NATION_PRESENTATION = Object.freeze({
    thornwall: presentation('An old crown city beneath the Elderwood canopy, where stone keeps, craft guilds, foresters, and oath houses crowd around roads leading into the royal forests.', ['Crown City', 'Elderwood']),
    brasshaven: presentation('A hard-driving forge republic of markets, mines, foundries, engineers, labor halls, and caravan wealth at the edge of the Redstone Reach.', ['Forge Republic', 'Redstone Reach']),
    mistmere: presentation('A wetland city of canals, colleges, gardens, observatories, herbalists, ferry stairs, and practical magic surrounded by the Starfen.', ['Canal City', 'Starfen']),
});

const JOB_PRESENTATION = Object.freeze({
    vanguard: presentation('A broad martial discipline built around weapon familiarity, staying power, and reliable frontline pressure.', ['Frontline', 'Weaponry']),
    pugilist: presentation('A close-quarters discipline built on body conditioning, hand-to-hand technique, and counter pressure.', ['Brawler', 'Endurance']),
    lifewarden: presentation('A restorative discipline focused on healing, protection, and keeping a group functioning through danger.', ['Healer', 'Support']),
    elementalist: presentation('A destructive magical discipline that studies elemental forces and converts preparation and knowledge into direct power.', ['Caster', 'Damage']),
    spellblade: presentation('A hybrid discipline combining weapon practice with support, control, and practical battle magic.', ['Hybrid', 'Control']),
    shadowhand: presentation('A mobile discipline built around precision, evasion, scouting, and taking advantage of openings.', ['Agile', 'Utility']),
});

const SEX_LABELS = Object.freeze({
    male: 'Male',
    female: 'Female',
});

export function getRaceCreationPresentation(raceId) {
    const race = getRace(raceId);
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

export function composeStartingNarrative({ name = 'Traveler', nationId = 'thornwall', mainJobId = 'vanguard' } = {}) {
    const nation = getNationCreationPresentation(nationId);
    const discipline = getJobCreationPresentation(mainJobId);
    const characterName = normalizeName(name) || 'Traveler';
    return [
        `${characterName} begins in ${nation.startingPlaceName}, with a few known streets behind them and a much larger world beyond the nearest road.`,
        nation.blurb,
        `Your first training follows the ${discipline.name} discipline: ${discipline.role}. It is a starting tradition, not the limit of what you can eventually learn.`,
        `The routes into ${nation.starterRegion} promise work, resources, people, and danger—provided you prepare well enough to come back with something worth keeping.`,
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
