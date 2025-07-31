export function parseLevel(level) {
  if (typeof level === 'number') return level;
  if (!level) return 1;
  if (level.includes('-')) {
    const [min, max] = level.split('-').map(Number);
    return (min + max) / 2;
  }
  return Number(level);
}

export function conLevel(playerLevel, monsterLevel) {
  const diff = monsterLevel - playerLevel;
  if (diff <= -6) return 'Too Weak';
  if (diff <= -4) return 'Easy Prey';
  if (diff <= -1) return 'Decent Challenge';
  if (diff === 0) return 'Even Match';
  if (diff === 1) return 'Tough';
  if (diff === 2) return 'Very Tough';
  return 'Incredibly Tough';
}

export function encounterChance(playerLevel, monsterLevel) {
  const diff = monsterLevel - playerLevel;
  let chance = 0.5 + diff * 0.0625;
  if (chance < 0) chance = 0;
  if (chance > 1) chance = 1;
  return chance;
}

import { bestiaryByZone } from '../data/bestiary.js';
import { locations } from '../data/locations.js';
import { getSubArea } from '../data/maps.js';

export function monstersByDistance(zone, subArea = null) {
  let mobs = bestiaryByZone[zone] || [];
  if (subArea) mobs = mobs.filter(m => m.subArea === subArea);
  else mobs = mobs.filter(m => !m.subArea);
  const loc = locations.find(l => l.name === zone);
  const dist = loc?.distance ?? 0;
  if (!mobs.length) return [];
  const groups = {};
  for (const m of mobs) {
    if (!groups[m.name]) groups[m.name] = [];
    groups[m.name].push(m);
  }
  for (const name in groups) {
    groups[name].sort((a, b) => parseLevel(a.level) - parseLevel(b.level));
  }
  const pool = [];
  for (const name of Object.keys(groups)) {
    const arr = groups[name];
    let idx = 0;
    if (dist <= 1) {
      idx = 0;
    } else if (dist === 2) {
      idx = Math.min(1, arr.length - 1);
    } else {
      idx = arr.length - 1;
    }
    pool.push(arr[idx]);
  }
  return pool.sort((a, b) => parseLevel(a.level) - parseLevel(b.level));
}

function weightedPick(mobs) {
  const total = mobs.reduce((sum, m) => sum + (m.spawnChance || 1), 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const m of mobs) {
    roll -= (m.spawnChance || 1);
    if (roll <= 0) return m;
  }
  return mobs[mobs.length - 1];
}

export function randomMonster(zone, subArea = null) {
  const pool = monstersByDistance(zone, subArea);
  return weightedPick(pool);
}

export function getAggressiveMonsters(zone, subArea = null) {
  return monstersByDistance(zone, subArea).filter(m => m.aggressive);
}

export function baseEncounterChanceForZone(playerLevel, zone, subArea = null) {
  const aggressive = getAggressiveMonsters(zone, subArea);
  let maxChance = 0;
  for (const m of aggressive) {
    const lvl = parseLevel(m.level);
    const chance = encounterChance(playerLevel, lvl);
    if (chance > maxChance) maxChance = chance;
  }
  return maxChance;
}

export function parseCoordinate(coord) {
  if (!coord) return null;
  const [letter, num] = coord.split('-');
  return { letter, number: parseInt(num, 10) };
}

export function coordinateDistance(a, b) {
  if (!a || !b) return 1;
  const x1 = a.letter.toUpperCase().charCodeAt(0);
  const y1 = a.number;
  const x2 = b.letter.toUpperCase().charCodeAt(0);
  const y2 = b.number;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export function stepToward(current, target) {
  const result = { ...current };
  const x1 = current.letter.toUpperCase().charCodeAt(0);
  const x2 = target.letter.toUpperCase().charCodeAt(0);
  if (x1 < x2) {
    result.letter = String.fromCharCode(x1 + 1);
  } else if (x1 > x2) {
    result.letter = String.fromCharCode(x1 - 1);
  } else if (current.number < target.number) {
    result.number += 1;
  } else if (current.number > target.number) {
    result.number -= 1;
  }
  return result;
}

export function getZoneTravelTurns(zone, baseZone = zone) {
  const info = locations.find(l => l.name === zone);
  const hasMonsters = bestiaryByZone[baseZone] && bestiaryByZone[baseZone].length > 0;
  const defaultTurns = hasMonsters ? 10 : 1;
  return info && info.travelTurns ? info.travelTurns : defaultTurns;
}

export function rollForEncounter(character, zone, options = {}) {
  const usingMount = !!options.mount;
  const sub = getSubArea(zone, character.coordinates);
  const mobs = getAggressiveMonsters(zone, sub);
  if (!mobs.length) return null;
  const mob = weightedPick(mobs);
  let chance = encounterChance(character.level, parseLevel(mob.level));
  if (usingMount) chance = Math.max(0, chance - 0.2);
  if (Math.random() < chance) {
    return mob;
  }
  return null;
}

export function walkAcrossZone(character, zone, options = {}) {
  const usingMount = !!options.mount;
  const sub = getSubArea(zone, character.coordinates);
  const turns = Math.ceil(getZoneTravelTurns(zone) / (usingMount ? 2 : 1));
  const encounters = [];
  for (let t = 1; t <= turns; t++) {
    const mobs = getAggressiveMonsters(zone, sub);
    if (!mobs.length) break;
    const mob = weightedPick(mobs);
    let chance = encounterChance(character.level, parseLevel(mob.level));
    if (usingMount) chance = Math.max(0, chance - 0.2);
    if (Math.random() < chance) {
      encounters.push({ turn: t, monster: mob.name });
    }
  }
  return { turns, encounters };
}

export function exploreEncounter(zone, subArea = null) {
  const mobs = monstersByDistance(zone, subArea);
  if (!mobs.length) return null;
  return weightedPick(mobs);
}

export function huntEncounter(zone, targetName, subArea = null) {
  const mobs = (bestiaryByZone[zone] || []).filter(m =>
    subArea ? m.subArea === subArea : !m.subArea
  );
  const matches = mobs.filter(m => m.name.startsWith(targetName));
  if (!matches.length) return [];
  const pick = { ...matches[Math.floor(Math.random() * matches.length)] };
  const group = [pick];
  const firstWord = pick.name.split(' ')[0];
  const sameRace = mobs.filter(m => m.name.startsWith(firstWord));
  if ((pick.linking || /(Goblin|Orc|Yagudo|Quadav)/i.test(firstWord)) && sameRace.length > 1) {
    const extra = Math.random() < 0.5 ? 1 : 0;
    for (let i = 0; i < extra; i++) {
      const mob = { ...sameRace[Math.floor(Math.random() * sameRace.length)] };
      group.push(mob);
    }
  }
  return group;
}

export function spawnNearbyMonsters(character, zone) {
  const subArea = getSubArea(zone, character.coordinates);
  const pool = monstersByDistance(zone, subArea);
  if (!pool.length) return { list: [], aggro: [] };
  const coordStr = `${character.coordinates.letter}-${character.coordinates.number}`;
  const available = pool.filter(m =>
    !m.fishingOnly && (!m.coords || m.coords.includes(coordStr))
  );
  if (!available.length) return { list: [], aggro: [] };
  const count = Math.floor(Math.random() * 6) + 1;
  const list = [];
  for (let i = 0; i < count; i++) {
    const base = weightedPick(available);
    const mob = { ...base };
    mob.hp = base.hp || parseLevel(base.level) * 20;
    list.push(mob);
  }
  const linkGroups = {};
  list.forEach(m => {
    if (m.linking) {
      const key = m.name.split(' ')[0];
      if (!linkGroups[key]) linkGroups[key] = [];
      linkGroups[key].push(m);
    }
  });

  const processed = new Set();
  const aggro = [];
  let aggroCount = 0;
  const candidates = [];

  list.forEach(m => {
    if (m.linking) {
      const key = m.name.split(' ')[0];
      if (processed.has(key)) return;
      processed.add(key);
      candidates.push(linkGroups[key]);
    } else {
      candidates.push([m]);
    }
  });

  candidates.forEach(group => {
    if (!group[0].aggressive) return;
    const baseLevel = parseLevel(group[0].level);
    let baseChance = encounterChance(character.level, baseLevel);
    let chance = baseChance;
    if (group.length === 1 && aggroCount > 0) {
      chance = Math.pow(baseChance, aggroCount + 1);
    }
    if (Math.random() < chance) {
      aggroCount++;
      group.forEach(m => {
        m.aggro = true;
        aggro.push(m);
      });
    }
  });

  return { list, aggro };
}
