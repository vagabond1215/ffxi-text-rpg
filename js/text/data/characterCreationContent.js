import { getJob } from './jobs.js';
import { getNation } from './nations.js';
import { getOriginExperienceContent } from './playerExperienceContent.js';
import { getPlace } from './places.js';
import { getRace } from './races.js';
import { getStartingDisciplineKit } from './startingDisciplineKits.js';

export const CHARACTER_CREATION_CONTENT_VERSION = 2;

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

const ORIGIN_OPENINGS = Object.freeze({
    thornwall: Object.freeze({
        arrival: 'The last timber wagon leaves you at Thornwall Southgate just after dawn. Behind you, the forest road is still wet with night rain; ahead, carts, hunters, laborers, and pack animals crowd beneath an old stone gate blackened by generations of smoke.',
        contact: 'Warden Halric Dane checks your name against the newcomer roll while a hawker tries to sell you an “essential road bundle” for three times what it is worth. Dane sends the man away with a look, marks the roll, and tells you that honest newcomers usually do better by finding Sera Talwin near the Southgate guild stalls.',
        scene: 'Inside the walls, axes ring from a training yard, guild criers compete with food sellers, and foresters in mud-stiff boots argue over trail conditions. Thornwall feels less like a courtly capital from here than a working gate between stone streets and Elderwood.',
        guide: 'Dane’s advice is specific: put your pack somewhere safe, learn the streets around Southgate, then speak with Sera before paying anyone for work, tools, or directions you do not yet understand.',
    }),
    brasshaven: Object.freeze({
        arrival: 'You reach Brasshaven with a morning freight caravan, walking the last stretch beside ore wagons because the passenger bench was sold twice. The Market Ring rises through foundry haze ahead of you, all brick, ironwork, shouting porters, and wheels grinding over stone.',
        contact: 'A red-sashed labor broker catches you before the caravan is fully unloaded and promises easy quarry pay if you buy his tools first. Marshal Varric Stone cuts across the pitch, checks your name on the arrival slate, and tells the broker to find someone less new to fleece. Varric tells you to report to his Market Ring post once you have your bearings.',
        scene: 'Assay clerks test ore beneath awnings, food smoke drifts between workshop doors, and civic notices share wall space with private contracts. Brasshaven makes its bargain plain: useful hands can rise quickly, but nobody gives away tools, trust, or a good name.',
        guide: 'Varric points out the public workshops and supply stalls before returning to the gate traffic. If you want work that pays what it claims, he says, come back to his post and ask before signing anything expensive.',
    }),
    mistmere: Object.freeze({
        arrival: 'Your ferry noses into Mistmere’s Canal Ward with the first busy run of the morning. Wet stone steps shine beneath hanging lamps, narrow boats slip between market bridges, and the air carries river water, herbs, frying grain cakes, and the faint mineral scent of civic spellwork.',
        contact: 'At the landing, a cheerful runner offers to guide you to the registry for a “visitor’s fee” even though the desk is visible across the bridge. The canal registrar waves them off, records your name, and tells you that Reader Soli Venn handles newcomers who want real work, study, or reliable directions.',
        scene: 'Students hurry past herb sellers with notebooks under their arms, cooks shout orders across a waterside market, and small practical enchantments keep lamps lit and lock gates against the current. Mistmere seems welcoming, but competence is the currency beneath the courtesy.',
        guide: 'The registrar tells you to find Soli at the Canal Ward civic desk after you have looked around. “Ask questions before you buy answers,” they add, tapping the registry with one ink-stained finger.',
    }),
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
    const kit = getStartingDisciplineKit(job.id);
    return {
        id: job.id,
        name: job.name,
        abbreviation: job.abbreviation,
        role: job.role,
        primaryAttributes: [...(job.primaryAttributes ?? [])],
        derivedFocus: [...(job.derivedFocus ?? [])],
        skillFocus: [...(job.skillFocus ?? [])],
        startingGear: kit.items.map((item) => ({ id: item.id, name: item.name })),
        protection: kit.protection,
        playStyle: kit.playStyle,
        ...(JOB_PRESENTATION[job.id] ?? presentation(job.role, [])),
    };
}

export function describeCreatorSex(sex) {
    return SEX_LABELS[sex] ?? capitalize(sex);
}

export function composeStartingNarrative({ name = 'Traveler', nationId = 'thornwall', mainJobId = 'vanguard' } = {}) {
    const nation = getNationCreationPresentation(nationId);
    const discipline = getJobCreationPresentation(mainJobId);
    const experience = getOriginExperienceContent(nationId);
    const opening = ORIGIN_OPENINGS[nation.id] ?? ORIGIN_OPENINGS.thornwall;
    const characterName = normalizeName(name) || 'Traveler';
    return [
        opening.arrival,
        opening.contact,
        opening.scene,
        disciplineObservation(discipline, characterName),
        opening.guide,
        `Beyond ${nation.startingPlaceName}, ${experience.regionalHorizon} is the first wider country you can learn for yourself. The roads out are not promises of safety; they are chances to return with better judgment, stronger hands, useful material, or someone who remembers your name.`,
    ];
}

function disciplineObservation(discipline, characterName) {
    const gear = discipline.startingGear.map((item) => item.name).join(' and ');
    const focus = discipline.skillFocus.map(formatIdentifier).join(', ');
    const observations = {
        vanguard: `${characterName}'s Vanguard training makes the gate traffic easy to read: weapon belts, shield habits, tired guards, and who is standing where trouble would hit first. Your ${gear} mark you as trained, if still untested here.`,
        pugilist: `${characterName}'s Pugilist training notices balance before heraldry—the laborers carrying badly, the guards who keep their weight centered, and the spaces in the crowd where quick feet matter. Your ${gear} are plain traveling equipment, not a uniform.`,
        lifewarden: `${characterName}'s Lifewarden training catches smaller signs of strain: an old porter favoring one knee, a guard wrapping a split knuckle, and which travelers look one hard mile from exhaustion. Your ${gear} support the restorative practice you already know.`,
        elementalist: `${characterName}'s Elementalist training turns the city’s ordinary details into magical ones as well: soot drawn by heat, damp carried on moving air, ward marks, lamp-glow, and the places spellwork has been built into daily life. Your ${gear} suit prepared casting rather than heavy protection.`,
        spellblade: `${characterName}'s Spellblade training makes both steel and ward-work familiar. You notice how armed travelers carry their blades, where protective marks have been renewed, and how quickly a crowded street can become a problem of position and control. Your ${gear} reflect that mixed training.`,
        shadowhand: `${characterName}'s Shadowhand training makes the crowd legible in a different way: loose purses, blocked sightlines, practiced watchers, and the people trying too hard not to look interested. Your ${gear} favor movement and precision over standing still to trade blows.`,
    };
    return observations[discipline.id] ?? `${characterName} arrives with practical training in ${focus || discipline.name.toLowerCase()} and a modest kit of ${gear}.`;
}

function presentation(blurb, tags = []) {
    return Object.freeze({ blurb, tags: Object.freeze([...tags]) });
}

function normalizeName(value) {
    return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function formatIdentifier(value) {
    return String(value ?? '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').toLowerCase();
}

function capitalize(value) {
    const text = String(value ?? '');
    return text ? `${text.slice(0, 1).toUpperCase()}${text.slice(1)}` : '';
}
