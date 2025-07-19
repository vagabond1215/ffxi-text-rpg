import { jobs, jobNames } from './jobs.js';
import { races, raceNames } from './races.js';
import { getScale, proficiencyScale } from './scales.js';

const aldoScale = buildScaleFields('Hume', 'Thief');
const shantottoScale = buildScaleFields('Tarutaru', 'Black Mage');

export let activeCharacter = null;

function buildScaleFields(raceName, jobName) {
  const raceInfo = races.find(r => r.name === raceName);
  const jobInfo = jobs.find(j => j.name === jobName);

  const raceHP = getScale(raceInfo?.proficiencies?.hp);
  const raceMP = getScale(raceInfo?.proficiencies?.mp);
  const raceStatus = getScale(raceInfo?.proficiencies?.str);

  const jobHP = getScale(jobInfo?.proficiencies?.hp);
  const jobMP = getScale(jobInfo?.proficiencies?.mp);
  const jobStatus = getScale(jobInfo?.proficiencies?.str);

  return {
    raceHpScale: raceHP.hpScale,
    raceHpBase: raceHP.hpBase,
    raceHpScaleXXX: raceHP.hpScaleXXX,
    raceMpScale: raceMP.mpScale,
    raceMpBase: raceMP.mpBase,
    raceStatusScale: raceStatus.statusScale,
    raceStatusBase: raceStatus.statusBase,
    jobHpScale: jobHP.hpScale,
    jobHpBase: jobHP.hpBase,
    jobHpScaleXXX: jobHP.hpScaleXXX,
    jobMpScale: jobMP.mpScale,
    jobMpBase: jobMP.mpBase,
    jobStatusScale: jobStatus.statusScale,
    jobStatusBase: jobStatus.statusBase
  };
}

export const characters = [
  {
    name: 'Aldo',
    race: 'Hume',
    sex: 'Male',
    job: 'Thief',
    level: 99,
    stats: { str: 70, dex: 90, vit: 70, agi: 80, int: 60, mnd: 60, chr: 70 },
    hp: 1200,
    mp: 200,
    tp: 0,
    skills: [],
    traits: [],
    abilities: [],
    jobs: { Thief: 99, Ninja: 49 },
    gil: 100000,
    combatSkills: {},
    magicSkills: {},
    crafting: {},
    ...aldoScale,
    mLvX: 0,
    mLvXXX: 0,
    sLvX: 0,
    raceHP: 0,
    jobHP: 0,
    sJobHP: 0,
    raceMP: 0,
    jobMP: 0,
    sJobMP: 0,
    equipment: {
      head: null,
      body: null,
      hands: null,
      legs: null,
      feet: null,
      mainHand: null,
      offHand: null,
      ranged: null,
      ammo: null,
      back: null,
      waist: null,
      neck: null,
      leftEar: null,
      rightEar: null,
      leftRing: null,
      rightRing: null
    }
  },
  {
    name: 'Shantotto',
    race: 'Tarutaru',
    sex: 'Female',
    job: 'Black Mage',
    level: 99,
    stats: { str: 40, dex: 60, vit: 50, agi: 60, int: 95, mnd: 80, chr: 70 },
    hp: 1000,
    mp: 1500,
    tp: 0,
    skills: [],
    traits: [],
    abilities: [],
    jobs: { 'Black Mage': 99, 'White Mage': 49 },
    gil: 500000,
    combatSkills: {},
    magicSkills: {},
    crafting: {},
    ...shantottoScale,
    mLvX: 0,
    mLvXXX: 0,
    sLvX: 0,
    raceHP: 0,
    jobHP: 0,
    sJobHP: 0,
    raceMP: 0,
    jobMP: 0,
    sJobMP: 0,
    equipment: {
      head: null,
      body: null,
      hands: null,
      legs: null,
      feet: null,
      mainHand: null,
      offHand: null,
      ranged: null,
      ammo: null,
      back: null,
      waist: null,
      neck: null,
      leftEar: null,
      rightEar: null,
      leftRing: null,
      rightRing: null
    }
  }
];

characters.forEach(ch => updateDerivedStats(ch));

export function createCharacterObject(name, job, race, sex = 'Male') {
  const selectedRace = race || raceNames[Math.floor(Math.random() * raceNames.length)];
  const selectedJob = job || jobNames[Math.floor(Math.random() * jobNames.length)];
  const character = {
    name,
    race: selectedRace,
    sex,
    job: selectedJob,
    level: 1,
    stats: { str: 10, dex: 10, vit: 10, agi: 10, int: 10, mnd: 10, chr: 10 },
    hp: 50,
    mp: 30,
    tp: 0,
    skills: [],
    traits: [],
    abilities: [],
    jobs: { [selectedJob]: 1 },
    gil: 0,
    combatSkills: {},
    magicSkills: {},
    crafting: {},
    ...buildScaleFields(selectedRace, selectedJob),
    mLvX: 0,
    mLvXXX: 0,
    sLvX: 0,
    raceHP: 0,
    jobHP: 0,
    sJobHP: 0,
    raceMP: 0,
    jobMP: 0,
    sJobMP: 0,
    equipment: {
      head: null,
      body: null,
      hands: null,
      legs: null,
      feet: null,
      mainHand: null,
      offHand: null,
      ranged: null,
      ammo: null,
      back: null,
      waist: null,
      neck: null,
      leftEar: null,
      rightEar: null,
      leftRing: null,
      rightRing: null
    }
  };
  updateDerivedStats(character);
  return character;
}

export function createNewCharacter(name = `Adventurer ${characters.length + 1}`, job, race, sex = 'Male') {
  const character = createCharacterObject(name, job, race, sex);
  characters.unshift(character);
  activeCharacter = character;
  return character;
}

export function calculateCharacterStats(character) {
  const totals = {
    hp: character.hp || 0,
    mp: character.mp || 0,
    str: character.stats?.str || 0,
    dex: character.stats?.dex || 0,
    vit: character.stats?.vit || 0,
    agi: character.stats?.agi || 0,
    int: character.stats?.int || 0,
    mnd: character.stats?.mnd || 0,
    chr: character.stats?.chr || 0
  };

  const raceInfo = races.find(r => r.name === character.race);
  if (raceInfo) {
    applyProficiencies(totals, raceInfo.proficiencies);
  }

  const jobInfo = jobs.find(j => j.name === character.job);
  if (jobInfo) {
    if (jobInfo.proficiencies) {
      applyProficiencies(totals, jobInfo.proficiencies);
    }
    // TODO: adjust totals based on job traits/abilities
  }

  if (character.equipment) {
    // TODO: incorporate equipment stat bonuses
  }

  return totals;
}

export function updateDerivedStats(character) {
  const mainLevel = character.jobs?.[character.job] || character.level || 1;
  const subJobName = Object.keys(character.jobs || {}).find(j => j !== character.job);
  const subLevel = subJobName ? character.jobs[subJobName] : 0;

  const raceInfo = races.find(r => r.name === character.race);
  const jobInfo = jobs.find(j => j.name === character.job);
  const subInfo = subJobName ? jobs.find(j => j.name === subJobName) : null;

  const raceHP = getScale(raceInfo?.proficiencies?.hp);
  const raceMP = getScale(raceInfo?.proficiencies?.mp);
  const raceStatus = getScale(raceInfo?.proficiencies?.str);

  const jobHP = getScale(jobInfo?.proficiencies?.hp);
  const jobMP = getScale(jobInfo?.proficiencies?.mp);
  const jobStatus = getScale(jobInfo?.proficiencies?.str);

  const subHP = subInfo ? getScale(subInfo.proficiencies?.hp) : proficiencyScale.X;
  const subMP = subInfo ? getScale(subInfo.proficiencies?.mp) : proficiencyScale.X;
  const subStatus = subInfo ? getScale(subInfo.proficiencies?.str) : proficiencyScale.X;

  const mLvX = Math.max(mainLevel - 10, 0);
  const mLvXXX = Math.max(mainLevel - 30, 0);
  const sLvX = subInfo ? Math.max(subLevel - 10, 0) : 0;

  const raceHPVal = (raceHP.hpScale * (mainLevel - 1) + raceHP.hpBase) + (2 * mLvX) + (raceHP.hpScaleXXX * mLvXXX);
  const jobHPVal = (jobHP.hpScale * (mainLevel - 1) + jobHP.hpBase) + (jobHP.hpScaleXXX * mLvXXX);
  const sJobHPVal = subInfo ? ((subHP.hpScale * (subLevel - 1) + subHP.hpBase + sLvX) / 2) : 0;
  const hpTotal = raceHPVal + jobHPVal + sJobHPVal;

  let raceMPVal = 0;
  if (jobMP.mpScale > 0) {
    raceMPVal = raceMP.mpScale * (mainLevel - 1) + raceMP.mpBase;
  } else if (subInfo && subMP.mpScale > 0) {
    raceMPVal = (subMP.mpScale * (subLevel - 1) + subMP.mpBase) / 2;
  }
  const jobMPVal = jobMP.mpScale * (mainLevel - 1) + jobMP.mpBase;
  const sJobMPVal = subInfo && subMP.mpScale > 0 ? (subMP.mpScale * (subLevel - 1) + subMP.mpBase) / 2 : 0;
  const mpTotal = raceMPVal + jobMPVal + sJobMPVal;

  const raceStatusVal = raceStatus.statusScale * (mainLevel - 1) + raceStatus.statusBase;
  const jobStatusVal = jobStatus.statusScale * (mainLevel - 1) + jobStatus.statusBase;
  const sJobStatusVal = subInfo ? (subStatus.statusScale * (subLevel - 1) + subStatus.statusBase) / 2 : 0;
  const statusTotal = raceStatusVal + jobStatusVal + sJobStatusVal;

  Object.assign(character, {
    mLvX,
    mLvXXX,
    sLvX,
    raceHP: raceHPVal,
    jobHP: jobHPVal,
    sJobHP: sJobHPVal,
    raceMP: raceMPVal,
    jobMP: jobMPVal,
    sJobMP: sJobMPVal,
    raceStatus: raceStatusVal,
    jobStatus: jobStatusVal,
    sJobStatus: sJobStatusVal,
    hp: hpTotal,
    mp: mpTotal,
    status: statusTotal
  });

  return character;
}

function applyProficiencies(stats, profs) {
  for (const key in profs) {
    stats[key] += gradeToValue(profs[key]);
  }
}

function gradeToValue(grade) {
  const mapping = { A: 6, B: 5, C: 4, D: 3, E: 2, F: 1, G: 0, X: 0 };
  return mapping[grade] ?? 0;
}

export function saveCharacters() {
  try {
    localStorage.setItem('ffxiCharacters', JSON.stringify(characters));
  } catch (e) {
    console.error('Failed to save characters', e);
  }
}

export function saveCharacterSlot(index) {
  try {
    const saved = JSON.parse(localStorage.getItem('ffxiCharacters') || '[]');
    while (saved.length <= index) saved.push(null);
    const char = characters[index];
    if (!char) return;
    if (saved[index] && saved[index].name !== char.name) {
      if (!confirm('Overwrite existing character in this slot?')) return;
    }
    saved[index] = char;
    localStorage.setItem('ffxiCharacters', JSON.stringify(saved));
  } catch (e) {
    console.error('Failed to save character slot', e);
  }
}

export function loadCharacters() {
  try {
    const data = localStorage.getItem('ffxiCharacters');
    if (!data) return;
    const loaded = JSON.parse(data);
    characters.length = 0;
    loaded.forEach(c => {
      characters.push(c);
      updateDerivedStats(c);
    });
    activeCharacter = characters[0] || null;
  } catch (e) {
    console.error('Failed to load characters', e);
  }
}

export function loadCharacterSlot(index) {
  try {
    const saved = JSON.parse(localStorage.getItem('ffxiCharacters') || '[]');
    if (!saved[index]) return;
    characters[index] = saved[index];
    updateDerivedStats(characters[index]);
    activeCharacter = characters[index];
  } catch (e) {
    console.error('Failed to load character slot', e);
  }
}

export function clearSavedCharacters() {
  try {
    localStorage.removeItem('ffxiCharacters');
    characters.length = 0;
    activeCharacter = null;
  } catch (e) {
    console.error('Failed to clear characters', e);
  }
}

export function deleteCharacterSlot(index) {
  try {
    const saved = JSON.parse(localStorage.getItem('ffxiCharacters') || '[]');
    while (saved.length <= index) saved.push(null);
    saved[index] = null;
    localStorage.setItem('ffxiCharacters', JSON.stringify(saved));
    if (characters[index] && characters[index] === activeCharacter) {
      activeCharacter = null;
    }
    characters[index] = null;
  } catch (e) {
    console.error('Failed to delete character slot', e);
  }
}
