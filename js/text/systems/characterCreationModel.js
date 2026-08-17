import { listJobs } from '../data/jobs.js';
import { listNations } from '../data/nations.js';
import { RACES } from '../data/races.js';
import { randomCharacterName } from '../data/characterNames.js';
import {
    composeStartingNarrative,
    describeCreatorSex,
    getJobCreationPresentation,
    getNationCreationPresentation,
    getRaceCreationPresentation,
} from '../data/characterCreationContent.js';

const STARTING_JOB_IDS = Object.freeze(['vanguard', 'pugilist', 'lifewarden', 'elementalist', 'spellblade', 'shadowhand']);
export const CREATOR_STEPS = Object.freeze(['identity', 'nation', 'job', 'summary']);

export function createGuidedCreatorState(options = {}) {
    const raceId = RACES[options.raceId] ? options.raceId : 'human';
    const race = RACES[raceId];
    const sex = race.allowedSexes.includes(options.sex) ? options.sex : race.allowedSexes[0];
    return normalizeCreatorState({
        stepIndex: clampStep(options.stepIndex ?? 0),
        name: options.name ?? '',
        raceId,
        sex,
        nationId: options.nationId ?? 'thornwall',
        mainJobId: STARTING_JOB_IDS.includes(options.mainJobId) ? options.mainJobId : 'vanguard',
    });
}

export function normalizeCreatorState(creator = {}) {
    const raceId = RACES[creator.raceId] ? creator.raceId : 'human';
    const race = RACES[raceId];
    const sex = race.allowedSexes.includes(creator.sex) ? creator.sex : race.allowedSexes[0];
    const nationId = getNationOptions().some((item) => item.id === creator.nationId) ? creator.nationId : 'thornwall';
    const mainJobId = STARTING_JOB_IDS.includes(creator.mainJobId) ? creator.mainJobId : 'vanguard';
    return {
        stepIndex: clampStep(creator.stepIndex ?? 0),
        name: normalizeName(creator.name ?? ''),
        raceId,
        sex,
        nationId,
        mainJobId,
    };
}

export function getCreatorStep(creator) {
    return CREATOR_STEPS[normalizeCreatorState(creator).stepIndex] ?? 'identity';
}

export function getRaceOptions() {
    return Object.values(RACES).map((race) => ({
        ...getRaceCreationPresentation(race.id),
        allowedSexes: [...race.allowedSexes],
        sexLabel: race.allowedSexes.map(describeCreatorSex).join(' / '),
    }));
}

export function getSexOptions(creator) {
    const normalized = normalizeCreatorState(creator);
    return RACES[normalized.raceId].allowedSexes.map((sex) => ({ id: sex, name: describeCreatorSex(sex) }));
}

export function getNationOptions() {
    return listNations().map((nation) => getNationCreationPresentation(nation.id));
}

export function getStartingJobOptions() {
    return listJobs().filter((job) => STARTING_JOB_IDS.includes(job.id)).map((job) => getJobCreationPresentation(job.id));
}

export function selectCreatorRace(creator, raceId) {
    const nextRaceId = RACES[raceId] ? raceId : 'human';
    const race = RACES[nextRaceId];
    return normalizeCreatorState({ ...creator, raceId: nextRaceId, sex: race.allowedSexes.includes(creator.sex) ? creator.sex : race.allowedSexes[0] });
}

export function selectCreatorSex(creator, sex) {
    const normalized = normalizeCreatorState(creator);
    const race = RACES[normalized.raceId];
    return normalizeCreatorState({ ...normalized, sex: race.allowedSexes.includes(sex) ? sex : race.allowedSexes[0] });
}

export function selectCreatorNation(creator, nationId) {
    return normalizeCreatorState({ ...creator, nationId });
}

export function selectCreatorJob(creator, mainJobId) {
    return normalizeCreatorState({ ...creator, mainJobId });
}

export function setCreatorName(creator, name) {
    return normalizeCreatorState({ ...creator, name: normalizeName(name).slice(0, 24) });
}

export function randomizeCreatorName(creator, rng = Math.random) {
    const normalized = normalizeCreatorState(creator);
    return setCreatorName(normalized, randomCharacterName(normalized.raceId, normalized.sex, rng));
}

export function randomizeCreator(creator, rng = Math.random) {
    const current = normalizeCreatorState(creator);
    const races = Object.values(RACES);
    const race = pick(races, rng) ?? RACES.human;
    const sex = pick(race.allowedSexes, rng) ?? race.allowedSexes[0];
    const nations = getNationOptions();
    const jobs = STARTING_JOB_IDS;
    const nation = pick(nations, rng)?.id ?? current.nationId;
    const mainJobId = pick(jobs, rng) ?? current.mainJobId;
    return normalizeCreatorState({
        ...current,
        raceId: race.id,
        sex,
        nationId: nation,
        mainJobId,
        name: randomCharacterName(race.id, sex, rng),
    });
}

export function advanceCreatorStep(creator, delta) {
    const normalized = normalizeCreatorState(creator);
    return normalizeCreatorState({ ...normalized, stepIndex: clampStep(normalized.stepIndex + delta) });
}

export function getCreatorSummary(creator) {
    const normalized = normalizeCreatorState(creator);
    const race = getRaceCreationPresentation(normalized.raceId);
    const nation = getNationCreationPresentation(normalized.nationId);
    const job = getJobCreationPresentation(normalized.mainJobId);
    return {
        name: normalized.name || 'Traveler',
        race: race.name,
        sex: describeCreatorSex(normalized.sex),
        nation: nation.name,
        startingCity: nation.startingPlaceName,
        starterRegion: nation.starterRegion,
        job: job.name,
        jobAbbreviation: job.abbreviation,
        startingMaps: nation.startingMapIds,
        startingKeyItems: nation.startingKeyItems,
        discipline: job,
    };
}

export function validateCreator(creator) {
    const normalized = normalizeCreatorState(creator);
    const issues = [];
    if (!normalizeName(normalized.name)) issues.push('Name is required.');
    if (normalizeName(normalized.name).length > 24) issues.push('Name must be 24 characters or fewer.');
    if (!RACES[normalized.raceId].allowedSexes.includes(normalized.sex)) issues.push('Selected sex is not valid for the selected ancestry.');
    if (!STARTING_JOB_IDS.includes(normalized.mainJobId)) issues.push('Selected discipline is not a starting discipline.');
    return issues;
}

export function createCreatorGameOptions(creator) {
    const normalized = normalizeCreatorState(creator);
    return {
        name: normalizeName(normalized.name) || 'Traveler',
        raceId: normalized.raceId,
        sex: normalized.sex,
        nationId: normalized.nationId,
        mainJobId: normalized.mainJobId,
        includeStartingDisciplineKit: true,
    };
}

export function describeCreatorOpening(creator) {
    return composeStartingNarrative(createCreatorGameOptions(creator));
}

function normalizeName(value) {
    return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function clampStep(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(CREATOR_STEPS.length - 1, parsed));
}

function pick(values, rng) {
    if (!values?.length) return null;
    const roll = Number(typeof rng === 'function' ? rng() : Math.random());
    const bounded = Number.isFinite(roll) ? Math.max(0, Math.min(0.999999999, roll)) : 0;
    return values[Math.floor(bounded * values.length)] ?? values[0];
}
