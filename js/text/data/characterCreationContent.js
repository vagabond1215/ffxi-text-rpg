import { getJob } from './jobs.js';
import { getNation } from './nations.js';
import { getOriginExperienceContent } from './playerExperienceContent.js';
import { getPlace } from './places.js';
import { getRace } from './races.js';

const RACE_PRESENTATION = Object.freeze({
    human: presentation('Flexible and widespread, with a balanced starting profile and no strong attribute bias.', ['Adaptable', 'Balanced']),
    lethari: presentation('Long-lived woodland and highland communities shaped by craft, oaths, and disciplined training.', ['Resolute', 'Disciplined']),
    miri: presentation('Scholarly and inventive, with strong traditions of craft, study, and practical magic.', ['Scholarly', 'Arcane']),
    veyra: presentation('Agile travelers and hunters who favor scouting, precision, mobility, and exchange.', ['Agile', 'Perceptive']),
    korren: presentation('Resilient builders and miners with deep traditions of engineering, masonry, and hard labor.', ['Resilient', 'Practical']),
});

const NATION_PRESENTATION = Object.freeze({
    thornwall: presentation('A forest crown city of guilds, foresters, stone keeps, and roads leading into Elderwood.', ['Crown City', 'Elderwood']),
    brasshaven: presentation('A forge republic of markets, foundries, engineers, and caravan trade on the Redstone Reach.', ['Forge Republic', 'Redstone Reach']),
    mistmere: presentation('A canal city of colleges, gardens, ferries, herbalists, and practical magic beside Starfen.', ['Canal City', 'Starfen']),
});

const JOB_PRESENTATION = Object.freeze({
    vanguard: presentation('Durable frontline weapon training with broad martial fundamentals.', ['Frontline', 'Weaponry']),
    pugilist: presentation('Close-quarters training built on conditioning, hand-to-hand technique, and counters.', ['Brawler', 'Endurance']),
    lifewarden: presentation('Restorative training focused on healing, protection, and group endurance.', ['Healer', 'Support']),
    elementalist: presentation('Elemental spellcraft focused on prepared, direct magical offense.', ['Caster', 'Damage']),
    spellblade: presentation('Weapon and spell training blended for control, support, and flexible combat.', ['Hybrid', 'Control']),
    shadowhand: presentation('Mobile training in precision, evasion, scouting, and exploiting openings.', ['Agile', 'Utility']),
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
    const experience = getOriginExperienceContent(nationId);
    const characterName = normalizeName(name) || 'Traveler';
    return [
        `${characterName} begins in ${nation.startingPlaceName}, with a few known streets behind them and a much larger world beyond the nearest road.`,
        experience.arrival,
        nation.blurb,
        `Your first training follows the ${discipline.name} discipline. It is a starting tradition, not a permanent class or a limit on what you can learn.`,
        `${experience.guideName} is the first person you have been told to find. They can explain how newcomers turn small work, practice, preparation, and exploration into a real footing here.`,
        `Beyond ${nation.startingPlaceName}, ${experience.regionalHorizon} offers the first larger test. You do not need to choose one permanent path: return from each effort with more mastery, material capability, knowledge, or useful connections than you started with.`,
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
