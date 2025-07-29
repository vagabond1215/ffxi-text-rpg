import { jobs, jobNames } from './jobs.js';
import { races, raceNames, startingCities } from './races.js';
import { zonesByCity, locations } from './locations.js';
import { parseCoordinate } from '../js/encounter.js';
import { bestiaryByZone } from './bestiary.js';
import { getScale, proficiencyScale } from './scales.js';

const aldoScale = buildScaleFields('Hume', 'Thief');
const shantottoScale = buildScaleFields('Tarutaru', 'Black Mage');

const startingGearByJob = {
  'Warrior': { weapon: 'bronzeSword', armor: 'leatherVest' },
  'Monk': { weapon: 'bronzeDagger', armor: 'leatherVest' },
  'White Mage': { weapon: 'bronzeDagger', armor: 'leatherVest' },
  'Black Mage': { weapon: 'bronzeDagger', armor: 'leatherVest' },
  'Red Mage': { weapon: 'bronzeDagger', armor: 'leatherVest' },
  'Thief': { weapon: 'bronzeDagger', armor: 'leatherVest' }
};

const STARTING_GIL = 500;

export let currentUser = null;
const USERS_KEY = 'ffxiUsers';
const CURRENT_USER_KEY = 'ffxiCurrentUser';
export let activeCharacter = null;
const LAST_ACTIVE_KEY = 'ffxiLastActiveCharacter_';

export function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    console.error('Failed to load users', e);
    return [];
  }
}

export function saveUsers(list) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function addUser(name) {
  const users = loadUsers();
  if (!users.includes(name)) {
    users.push(name);
    saveUsers(users);
    localStorage.setItem(`ffxiChars_${name}`, JSON.stringify([]));
  }
  return name;
}

export function initCurrentUser() {
  const users = loadUsers();
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  currentUser = saved && users.includes(saved) ? saved : users[0] || null;
}

export function setCurrentUser(name) {
  currentUser = name;
  try {
    localStorage.setItem(CURRENT_USER_KEY, name);
  } catch (e) {
    console.error('Failed to set current user', e);
  }
  loadCharacters();
}

export function grantSignet(character) {
  const now = new Date();
  const nextMid = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  character.signetUntil = nextMid.getTime();
  if (!character.buffs) character.buffs = [];
  if (!character.buffs.includes('Signet')) character.buffs.push('Signet');
}

export function hasSignet(character) {
  return character.signetUntil && character.signetUntil > Date.now();
}

function buildScaleFields(raceName, jobName) {
  const raceInfo = races.find(r => r.name === raceName);
  const jobInfo = jobs.find(j => j.name === jobName);

  const raceHP = getScale(raceInfo?.proficiencies?.hp);
  const raceMP = getScale(raceInfo?.proficiencies?.mp);
  const jobHP = getScale(jobInfo?.proficiencies?.hp);
  const jobMP = getScale(jobInfo?.proficiencies?.mp);

  const fields = {
    raceHpScale: raceHP.hpScale,
    raceHpBase: raceHP.hpBase,
    raceHpScaleXXX: raceHP.hpScaleXXX,
    raceMpScale: raceMP.mpScale,
    raceMpBase: raceMP.mpBase,
    jobHpScale: jobHP.hpScale,
    jobHpBase: jobHP.hpBase,
    jobHpScaleXXX: jobHP.hpScaleXXX,
    jobMpScale: jobMP.mpScale,
    jobMpBase: jobMP.mpBase
  };

  const stats = ['str', 'dex', 'vit', 'agi', 'int', 'mnd', 'chr'];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  stats.forEach(stat => {
    const rScale = getScale(raceInfo?.proficiencies?.[stat]);
    const jScale = getScale(jobInfo?.proficiencies?.[stat]);
    fields[`race${cap(stat)}Scale`] = rScale.statusScale;
    fields[`race${cap(stat)}Base`] = rScale.statusBase;
    fields[`job${cap(stat)}Scale`] = jScale.statusScale;
    fields[`job${cap(stat)}Base`] = jScale.statusBase;
  });

  return fields;
}

export const characters = [
  {
    name: 'Aldo',
    race: 'Hume',
    sex: 'Male',
    job: 'Thief',
    startingCity: startingCities['Hume'],
    homeCity: startingCities['Hume'],
    spawnPoint: zonesByCity[startingCities['Hume']][0].name,
    currentLocation: zonesByCity[startingCities['Hume']][0].name,
    subArea: null,
    lastZone: null,
    level: 99,
    stats: { str: 70, dex: 90, vit: 70, agi: 80, int: 60, mnd: 60, chr: 70 },
    hp: 1200,
    mp: 200,
    tp: 0,
    experience: 0,
    xpMode: 'EXP',
    limitPoints: 0,
    meritPoints: 0,
    capacityPoints: 0,
    jobPoints: 0,
    skills: [],
    traits: [],
    abilities: [],
    jobs: { Thief: 99, Ninja: 49 },
    gil: 100000,
    combatSkills: {},
    magicSkills: {},
    crafting: {},
    spells: [],
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
    travel: null,
    coordinates: null,
    returnJourney: null,
    inventory: [
      { id: 'bronzeDagger', qty: 1 },
      { id: 'leatherVest', qty: 1 }
    ],
    equipment: {
      head: null,
      body: 'leatherVest',
      hands: null,
      legs: null,
      feet: null,
      mainHand: 'bronzeDagger',
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
    },
    buffs: [],
    debuffs: [],
    temporaryBuffs: [],
    temporaryDebuffs: [],
    homePoints: [zonesByCity[startingCities['Hume']][0].name],
    ownedResidences: [startingCities['Hume']],
    currentHomePoint: zonesByCity[startingCities['Hume']][0].name,
    travelTurns: { [startingCities['Hume']]: 0 },
    signetUntil: 0,
    conquestPoints: 0,
    minutes: 0,
    targetIndex: null,
    monsterCoord: '',
    monsters: []
  },
  {
    name: 'Shantotto',
    race: 'Tarutaru',
    sex: 'Female',
    job: 'Black Mage',
    startingCity: startingCities['Tarutaru'],
    homeCity: startingCities['Tarutaru'],
    spawnPoint: zonesByCity[startingCities['Tarutaru']][0].name,
    currentLocation: zonesByCity[startingCities['Tarutaru']][0].name,
    subArea: null,
    lastZone: null,
    level: 99,
    stats: { str: 40, dex: 60, vit: 50, agi: 60, int: 95, mnd: 80, chr: 70 },
    hp: 1000,
    mp: 1500,
    tp: 0,
    experience: 0,
    xpMode: 'EXP',
    limitPoints: 0,
    meritPoints: 0,
    capacityPoints: 0,
    jobPoints: 0,
    skills: [],
    traits: [],
    abilities: [],
    jobs: { 'Black Mage': 99, 'White Mage': 49 },
    gil: 500000,
    combatSkills: {},
    magicSkills: {},
    crafting: {},
    spells: [],
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
    travel: null,
    coordinates: null,
    returnJourney: null,
    inventory: [
      { id: 'bronzeDagger', qty: 1 },
      { id: 'leatherVest', qty: 1 }
    ],
    equipment: {
      head: null,
      body: 'leatherVest',
      hands: null,
      legs: null,
      feet: null,
      mainHand: 'bronzeDagger',
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
    },
    buffs: [],
    debuffs: [],
    temporaryBuffs: [],
    temporaryDebuffs: [],
    homePoints: [zonesByCity[startingCities['Tarutaru']][0].name],
    ownedResidences: [startingCities['Tarutaru']],
    currentHomePoint: zonesByCity[startingCities['Tarutaru']][0].name,
    travelTurns: { [startingCities['Tarutaru']]: 0 },
    signetUntil: 0,
    conquestPoints: 0,
    minutes: 0,
    targetIndex: null,
    monsterCoord: '',
    monsters: []
  }
];

characters.forEach(ch => updateDerivedStats(ch));

export function createCharacterObject(name, job, race, sex = 'Male') {
  const selectedRace = race || raceNames[Math.floor(Math.random() * raceNames.length)];
  const selectedJob = job || jobNames[Math.floor(Math.random() * jobNames.length)];
  const gear = startingGearByJob[selectedJob] || {};
  const character = {
    name,
    race: selectedRace,
    sex,
    job: selectedJob,
    startingCity: startingCities[selectedRace],
    homeCity: startingCities[selectedRace],
    spawnPoint: zonesByCity[startingCities[selectedRace]][0].name,
    currentLocation: zonesByCity[startingCities[selectedRace]][0].name,
    subArea: null,
    lastZone: null,
    level: 1,
    stats: { str: 10, dex: 10, vit: 10, agi: 10, int: 10, mnd: 10, chr: 10 },
    hp: 50,
    mp: 30,
    tp: 0,
    experience: 0,
    xpMode: 'EXP',
    limitPoints: 0,
    meritPoints: 0,
    capacityPoints: 0,
    jobPoints: 0,
    skills: [],
    traits: [],
    abilities: [],
    jobs: { [selectedJob]: 1 },
    gil: STARTING_GIL,
    combatSkills: {},
    magicSkills: {},
    crafting: {},
    spells: [],
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
    travel: null,
    returnJourney: null,
    inventory: [
      ...(gear.weapon ? [{ id: gear.weapon, qty: 1 }] : []),
      ...(gear.armor ? [{ id: gear.armor, qty: 1 }] : [])
    ],
    equipment: {
      head: null,
      body: gear.armor || null,
      hands: null,
      legs: null,
      feet: null,
      mainHand: gear.weapon || null,
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
    },
    buffs: [],
    debuffs: [],
    temporaryBuffs: [],
    temporaryDebuffs: [],
    homePoints: [zonesByCity[startingCities[selectedRace]][0].name],
    ownedResidences: [startingCities[selectedRace]],
    currentHomePoint: zonesByCity[startingCities[selectedRace]][0].name,
    travelTurns: { [startingCities[selectedRace]]: 0 },
    signetUntil: 0,
    conquestPoints: 0,
    minutes: 0,
    targetIndex: null,
    monsterCoord: '',
    monsters: []
  };
  updateDerivedStats(character);
  return character;
}

export function createNewCharacter(name = `Adventurer ${characters.length + 1}`, job, race, sex = 'Male') {
  const character = createCharacterObject(name, job, race, sex);
  characters.unshift(character);
  setActiveCharacter(character);
  saveCharacters();
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
  const jobHP = getScale(jobInfo?.proficiencies?.hp);
  const jobMP = getScale(jobInfo?.proficiencies?.mp);

  const stats = ['str', 'dex', 'vit', 'agi', 'int', 'mnd', 'chr'];
  const raceStatScale = {};
  const jobStatScale = {};
  const subStatScale = {};
  stats.forEach(stat => {
    raceStatScale[stat] = getScale(raceInfo?.proficiencies?.[stat]);
    jobStatScale[stat] = getScale(jobInfo?.proficiencies?.[stat]);
    subStatScale[stat] = subInfo ? getScale(subInfo.proficiencies?.[stat]) : proficiencyScale.X;
  });

  const subHP = subInfo ? getScale(subInfo.proficiencies?.hp) : proficiencyScale.X;
  const subMP = subInfo ? getScale(subInfo.proficiencies?.mp) : proficiencyScale.X;

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

  const derivedStats = {};
  const raceStatVals = {};
  const jobStatVals = {};
  const sJobStatVals = {};
  stats.forEach(stat => {
    const r = raceStatScale[stat].statusScale * (mainLevel - 1) + raceStatScale[stat].statusBase;
    const j = jobStatScale[stat].statusScale * (mainLevel - 1) + jobStatScale[stat].statusBase;
    const s = subInfo ? (subStatScale[stat].statusScale * (subLevel - 1) + subStatScale[stat].statusBase) / 2 : 0;
    raceStatVals[stat] = r;
    jobStatVals[stat] = j;
    sJobStatVals[stat] = s;
    derivedStats[stat] = r + j + s;
  });

  const raceStatusVal = raceStatVals.str;
  const jobStatusVal = jobStatVals.str;
  const sJobStatusVal = sJobStatVals.str;
  const statusTotal = derivedStats.str;

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

  const statFields = {};
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  stats.forEach(stat => {
    statFields[`race${cap(stat)}`] = raceStatVals[stat];
    statFields[`job${cap(stat)}`] = jobStatVals[stat];
    statFields[`sJob${cap(stat)}`] = sJobStatVals[stat];
  });
  Object.assign(character, statFields);
  character.stats = { ...derivedStats };

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
    if (!currentUser) return;
    localStorage.setItem(`ffxiChars_${currentUser}`, JSON.stringify(characters));
  } catch (e) {
    console.error('Failed to save characters', e);
  }
}

export function saveCharacterSlot(index) {
  try {
    if (!currentUser) return;
    const saved = JSON.parse(localStorage.getItem(`ffxiChars_${currentUser}`) || '[]');
    while (saved.length <= index) saved.push(null);
    const char = characters[index];
    if (!char) return;
    if (saved[index] && saved[index].name !== char.name) {
      if (!confirm('Overwrite existing character in this slot?')) return;
    }
    saved[index] = char;
    localStorage.setItem(`ffxiChars_${currentUser}`, JSON.stringify(saved));
    saveCharacters();
  } catch (e) {
    console.error('Failed to save character slot', e);
  }
}

export function loadCharacters() {
  try {
    if (!currentUser) {
      characters.length = 0;
      return;
    }
    const data = localStorage.getItem(`ffxiChars_${currentUser}`);
    if (!data) {
      characters.length = 0;
      return;
    }
    const loaded = JSON.parse(data);
    characters.length = 0;
    loaded.forEach(c => {
      if (c.conquestPoints === undefined) c.conquestPoints = 0;
      if (c.targetIndex === undefined) c.targetIndex = null;
      if (!Array.isArray(c.monsters)) c.monsters = [];
      if (c.monsterCoord === undefined) c.monsterCoord = '';
      characters.push(c);
      updateDerivedStats(c);
    });
    const lastName = localStorage.getItem(`${LAST_ACTIVE_KEY}${currentUser}`);
    activeCharacter = characters.find(c => c.name === lastName) || characters[0] || null;
    setActiveCharacter(activeCharacter);
  } catch (e) {
    console.error('Failed to load characters', e);
  }
}

export function loadCharacterSlot(index) {
  try {
    if (!currentUser) return;
    const saved = JSON.parse(localStorage.getItem(`ffxiChars_${currentUser}`) || '[]');
    if (!saved[index]) return;
    characters[index] = saved[index];
    if (characters[index].conquestPoints === undefined) characters[index].conquestPoints = 0;
    updateDerivedStats(characters[index]);
    setActiveCharacter(characters[index]);
    saveCharacters();
  } catch (e) {
    console.error('Failed to load character slot', e);
  }
}


export function deleteCharacterSlot(index) {
  try {
    if (!currentUser) return;
    const saved = JSON.parse(localStorage.getItem(`ffxiChars_${currentUser}`) || '[]');
    while (saved.length <= index) saved.push(null);
    saved[index] = null;
    localStorage.setItem(`ffxiChars_${currentUser}`, JSON.stringify(saved));
    if (characters[index] && characters[index] === activeCharacter) {
      setActiveCharacter(null);
    }
    characters[index] = null;
    saveCharacters();
  } catch (e) {
    console.error('Failed to delete character slot', e);
  }
}

export async function saveCharacterToFile(character) {
  try {
    if (!window.showSaveFilePicker) {
      console.error('File picker API not available');
      return;
    }
    const handle = await window.showSaveFilePicker({
      suggestedName: `${character.name}.json`,
      types: [{ description: 'Character Save', accept: { 'application/json': ['.json'] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(character, null, 2));
    await writable.close();
    character.saveFileHandle = handle;
    character.saveFileName = handle.name;
  } catch (e) {
    console.error('Failed to save character to file', e);
  }
}

export async function loadCharacterFromFile() {
  try {
    if (!window.showOpenFilePicker) {
      console.error('File picker API not available');
      return null;
    }
    const [handle] = await window.showOpenFilePicker({
      types: [{ description: 'Character Save', accept: { 'application/json': ['.json'] } }]
    });
    const file = await handle.getFile();
    const text = await file.text();
    const character = JSON.parse(text);
    updateDerivedStats(character);
    character.saveFileHandle = handle;
    character.saveFileName = handle.name;
    characters.unshift(character);
    setActiveCharacter(character);
    saveCharacters();
    return character;
  } catch (e) {
    console.error('Failed to load character from file', e);
    return null;
  }
}

export function setActiveCharacter(character) {
  activeCharacter = character;
  try {
    if (character) {
      if (currentUser)
        localStorage.setItem(`${LAST_ACTIVE_KEY}${currentUser}`, character.name);
    } else {
      if (currentUser)
        localStorage.removeItem(`${LAST_ACTIVE_KEY}${currentUser}`);
    }
    saveCharacters();
  } catch (e) {
    console.error('Failed to save last active character', e);
  }
}

export function clearTemporaryEffects(character) {
  if (!character) return;
  character.temporaryBuffs = [];
  character.temporaryDebuffs = [];
}

export function pruneExpiredEffects(character) {
  if (!character) return;
  const now = Date.now();
  character.temporaryBuffs = (character.temporaryBuffs || []).filter(b => b.expiresAt > now);
  character.temporaryDebuffs = (character.temporaryDebuffs || []).filter(d => d.expiresAt > now);
}

export async function persistCharacter(character) {
  if (!character) return;
  saveCharacters();
  if (character.saveFileHandle) {
    try {
      const writable = await character.saveFileHandle.createWritable();
      await writable.write(JSON.stringify(character, null, 2));
      await writable.close();
    } catch (e) {
      console.error('Failed to update character file', e);
    }
  }
}

export function setLocation(character, name, from) {
  if (!character) return;
  character.lastZone = character.currentLocation;
  character.currentLocation = name;
  character.subArea = null;
  if (character.lastZone !== name) character.huntTarget = '';
  const zone = locations.find(l => l.name === name);
  if (zone) {
    if (!character.travelTurns) character.travelTurns = {};
    if (zone.distance === 0) {
      character.returnJourney = null;
      character.travelTurns[zone.city] = 0;
    } else {
      character.returnJourney = { zone: zone.city, turns: zone.distance };
      character.travelTurns[zone.city] = zone.distance;
      for (const c in character.travelTurns) {
        if (c !== zone.city) {
          character.travelTurns[c] = Math.min(10, (character.travelTurns[c] || 0) + 1);
        }
      }
    }
    const coordStr = zone.coordinates?.[from];
    if (coordStr) {
      character.coordinates = parseCoordinate(coordStr);
    }
  }
  persistCharacter(character);
}

export function advanceTime(character, zone, turns = 1) {
  if (!character) return;
  const loc = locations.find(l => l.name === zone);
  const hasMonsters = bestiaryByZone[zone] && bestiaryByZone[zone].length > 0;
  if (loc && loc.distance > 0 && hasMonsters) {
    character.minutes = (character.minutes || 0) + 10 * turns;
  }
}

export function formatTime(minutes = 0) {
  const day = Math.floor(minutes / 1440) + 1;
  const hour = Math.floor((minutes % 1440) / 60);
  const min = minutes % 60;
  return `Day ${day} ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

// ----- Real-time based Vana'diel clock -----
const VANADIEL_EPOCH = Date.UTC(2025, 0, 1, 0, 0, 0); // Jan 1st 2025
const VANADIEL_SCALE = 25; // 25x faster than Earth time

const dayNames = [
  'Firesday',
  'Earthsday',
  'Watersday',
  'Windsday',
  'Iceday',
  'Lightningday',
  'Lightsday',
  'Darksday'
];

export const dayElements = {
  Firesday: '🔥',
  Earthsday: '🪨',
  Watersday: '💧',
  Windsday: '💨',
  Iceday: '❄️',
  Lightningday: '⚡',
  Lightsday: '✨',
  Darksday: '🌑'
};

export function currentVanaTime(date = new Date()) {
  const elapsedMs = date.getTime() - VANADIEL_EPOCH;
  const vanaMs = elapsedMs * VANADIEL_SCALE;
  const totalMinutes = Math.floor(vanaMs / 60000);
  const day = Math.floor(totalMinutes / 1440);
  const hour = Math.floor((totalMinutes % 1440) / 60);
  const minute = totalMinutes % 60;
  const weekday = dayNames[day % 8];
  const month = Math.floor(day / 30) + 1;
  const year = Math.floor(day / 360) + 1;
  return { day: day + 1, hour, minute, weekday, month, year };
}

export function formatVanaTime(vanaObj) {
  return `Day ${vanaObj.day} ${vanaObj.hour.toString().padStart(2, '0')}:${vanaObj.minute.toString().padStart(2, '0')}`;
}
