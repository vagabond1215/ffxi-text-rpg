import { listJobs } from '../data/jobs.js';
import { listNations } from '../data/nations.js';
import { RACES } from '../data/races.js';

const STARTING_JOB_IDS = Object.freeze(['warrior', 'monk', 'whiteMage', 'blackMage', 'redMage', 'thief']);
const CREATOR_STEPS = Object.freeze(['name', 'nation', 'race', 'sex', 'job', 'confirm']);

export function createCreatorSession() {
    return {
        stepIndex: 0,
        answers: {
            name: 'Adventurer',
            nationId: 'sandoria',
            raceId: 'hume',
            sex: null,
            mainJobId: 'warrior',
        },
    };
}

export function handleCreatorInput(creator, input) {
    const step = CREATOR_STEPS[creator.stepIndex];
    const value = String(input ?? '').trim();

    if (step === 'name') {
        creator.answers.name = value || 'Adventurer';
        creator.stepIndex += 1;
        return { done: false, message: renderCreatorPrompt(creator) };
    }

    if (step === 'nation') {
        const nation = chooseByNumberOrId(value, listNations(), (item) => item.id, (item) => item.name);
        if (!nation) return invalidChoice(creator, 'nation', value);
        creator.answers.nationId = nation.id;
        creator.stepIndex += 1;
        return { done: false, message: renderCreatorPrompt(creator) };
    }

    if (step === 'race') {
        const race = chooseByNumberOrId(value, Object.values(RACES), (item) => item.id, (item) => item.name);
        if (!race) return invalidChoice(creator, 'race', value);
        creator.answers.raceId = race.id;
        creator.answers.sex = race.allowedSexes.length === 1 ? race.allowedSexes[0] : null;
        creator.stepIndex += race.allowedSexes.length === 1 ? 2 : 1;
        return { done: false, message: renderCreatorPrompt(creator) };
    }

    if (step === 'sex') {
        const race = RACES[creator.answers.raceId];
        const sexOptions = race.allowedSexes.map((sex) => ({ id: sex, name: capitalize(sex) }));
        const sex = chooseByNumberOrId(value, sexOptions, (item) => item.id, (item) => item.name);
        if (!sex) return invalidChoice(creator, 'sex', value);
        creator.answers.sex = sex.id;
        creator.stepIndex += 1;
        return { done: false, message: renderCreatorPrompt(creator) };
    }

    if (step === 'job') {
        const job = chooseByNumberOrId(value, listStartingJobs(), (item) => item.id, (item) => item.name);
        if (!job) return invalidChoice(creator, 'job', value);
        creator.answers.mainJobId = job.id;
        creator.stepIndex += 1;
        return { done: false, message: renderCreatorPrompt(creator) };
    }

    if (step === 'confirm') {
        const normalized = normalize(value);
        if (['y', 'yes', 'confirm', 'create'].includes(normalized)) {
            return { done: true, confirmed: true, answers: { ...creator.answers } };
        }
        if (['n', 'no', 'restart'].includes(normalized)) {
            const next = createCreatorSession();
            return { done: false, restart: true, creator: next, message: renderCreatorPrompt(next) };
        }
        return { done: false, message: `${renderCreatorPrompt(creator)}\n\nType yes to create, no to restart, or cancel.` };
    }

    return { done: false, message: 'Character creator is in an unknown state. Type cancel and start again.' };
}

export function renderCreatorPrompt(creator) {
    const step = CREATOR_STEPS[creator.stepIndex];
    if (step === 'name') return 'Character Creator\n\nWhat is your character name?';
    if (step === 'nation') return renderChoicePrompt('Choose starting nation:', listNations(), (nation) => `${nation.name} - ${nation.description}`);
    if (step === 'race') return renderChoicePrompt('Choose race:', Object.values(RACES), (race) => `${race.name} - ${race.description}`);
    if (step === 'sex') {
        const race = RACES[creator.answers.raceId];
        return renderChoicePrompt('Choose sex:', race.allowedSexes.map((sex) => ({ id: sex, name: capitalize(sex) })), (item) => item.name);
    }
    if (step === 'job') return renderChoicePrompt('Choose starting job:', listStartingJobs(), (job) => `${job.name} (${job.abbreviation}) - ${job.role}`);
    if (step === 'confirm') return renderCreatorSummary(creator);
    return 'Character creator is ready.';
}

export function listStartingJobs() {
    return listJobs().filter((job) => STARTING_JOB_IDS.includes(job.id));
}

function invalidChoice(creator, type, value) {
    return { done: false, message: `${renderCreatorPrompt(creator)}\n\nInvalid ${type}: ${value}` };
}

function renderChoicePrompt(title, options, describe) {
    return [
        title,
        '',
        ...options.map((item, index) => `${index + 1}. ${describe(item)}`),
        '',
        'Type the number or id/name. Type cancel to stop.',
    ].join('\n');
}

function renderCreatorSummary(creator) {
    const nation = listNations().find((item) => item.id === creator.answers.nationId);
    const race = RACES[creator.answers.raceId];
    const job = listStartingJobs().find((item) => item.id === creator.answers.mainJobId);
    return [
        'Confirm character:',
        '',
        `Name: ${creator.answers.name}`,
        `Nation: ${nation?.name ?? creator.answers.nationId}`,
        `Race: ${race?.name ?? creator.answers.raceId}`,
        `Sex: ${creator.answers.sex}`,
        `Job: ${job?.name ?? creator.answers.mainJobId}`,
        '',
        'Type yes to create, no to restart, or cancel.',
    ].join('\n');
}

function chooseByNumberOrId(input, options, getId, getName) {
    const index = Number.parseInt(input, 10);
    if (Number.isInteger(index) && options[index - 1]) return options[index - 1];
    const normalized = normalize(input);
    return options.find((item) => normalize(getId(item)) === normalized || normalize(getName(item)) === normalized) ?? null;
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/\s+/g, '-');
}

function capitalize(value) {
    const text = String(value ?? '');
    return `${text.slice(0, 1).toUpperCase()}${text.slice(1)}`;
}
