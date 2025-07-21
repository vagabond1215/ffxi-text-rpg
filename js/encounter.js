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
  if (diff <= -6) return 0; // too weak
  if (diff <= -1) return 0.2; // easy prey / decent challenge
  if (diff === 0) return 0.5; // even match
  if (diff === 1) return 0.7; // tough
  if (diff === 2) return 0.9; // very tough
  return 1; // incredibly tough
}

import { bestiaryByZone } from '../data/bestiary.js';
import { locations } from '../data/locations.js';

export function getAggressiveMonsters(zone) {
  const list = bestiaryByZone[zone] || [];
  return list.filter(m => m.aggressive);
}

export function baseEncounterChanceForZone(playerLevel, zone) {
  const aggressive = getAggressiveMonsters(zone);
  let maxChance = 0;
  for (const m of aggressive) {
    const lvl = parseLevel(m.level);
    const chance = encounterChance(playerLevel, lvl);
    if (chance > maxChance) maxChance = chance;
  }
  return maxChance;
}

export function getZoneTravelTurns(zone) {
  const info = locations.find(l => l.name === zone);
  const hasMonsters = (bestiaryByZone[zone] && bestiaryByZone[zone].length > 0);
  const defaultTurns = hasMonsters ? 10 : 1;
  return info && info.travelTurns ? info.travelTurns : defaultTurns;
}

export function rollForEncounter(character, zone, options = {}) {
  const usingMount = !!options.mount;
  const baseChance = baseEncounterChanceForZone(character.level, zone);
  const chance = Math.max(0, baseChance - (usingMount ? 0.2 : 0));
  if (Math.random() < chance) {
    const mobs = getAggressiveMonsters(zone);
    if (mobs.length) {
      const mob = mobs[Math.floor(Math.random() * mobs.length)];
      return mob;
    }
  }
  return null;
}

export function walkAcrossZone(character, zone, options = {}) {
  const usingMount = !!options.mount;
  const turns = Math.ceil(getZoneTravelTurns(zone) / (usingMount ? 2 : 1));
  const baseChance = baseEncounterChanceForZone(character.level, zone);
  const chance = Math.max(0, baseChance - (usingMount ? 0.2 : 0));
  const encounters = [];
  for (let t = 1; t <= turns; t++) {
    if (Math.random() < chance) {
      const mobs = getAggressiveMonsters(zone);
      if (mobs.length) {
        const mob = mobs[Math.floor(Math.random() * mobs.length)];
        encounters.push({ turn: t, monster: mob.name });
      }
    }
  }
  return { turns, encounters };
}
