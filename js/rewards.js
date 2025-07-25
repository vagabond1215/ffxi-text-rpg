import { items } from '../data/vendors.js';
import { experienceForKill } from '../data/experience.js';
import { hasSignet } from '../data/characters.js';
import { parseLevel } from './encounter.js';
import { handleMonsterKill } from './notorious.js';

export function findItemIdByName(name) {
  for (const [id, data] of Object.entries(items)) {
    if (data.name === name) return id;
  }
  return null;
}

function parseDropRate(rate) {
  if (rate === undefined) return null;
  if (typeof rate === 'number') return rate;
  if (typeof rate === 'string') {
    let r = rate.replace(/%/g, '').trim();
    if (r.includes('-')) {
      const [min, max] = r.split('-').map(Number);
      return (min + max) / 2;
    }
    const num = Number(r);
    return isNaN(num) ? null : num;
  }
  return null;
}

export function calculateBattleRewards(character, defeated) {
  let exp = 0;
  let gil = 0;
  let cp = 0;
  const drops = [];
  const messages = [];

  for (const mob of defeated) {
    const mobLevel = parseLevel(mob.level);
    const xp = experienceForKill(character.level, mobLevel);
    exp += xp;

    if (character.level >= 6 && hasSignet(character)) {
      cp += Math.floor(xp / 10);
    }

    if (/(Orc|Yagudo|Goblin|Quadav|Moblin)/i.test(mob.name)) {
      gil += Math.floor(mobLevel * 5 + Math.random() * mobLevel * 5);
    }

    if (mob.drops && mob.drops.length) {
      for (const name of mob.drops) {
        const chance = parseDropRate(mob.dropRates?.[name]) ?? (100 / mob.drops.length);
        if (Math.random() * 100 < chance) {
          const id = findItemIdByName(name);
          if (id) drops.push({ id, qty: 1 });
        }
      }
    }

    if (hasSignet(character) && Math.random() < 0.1) {
      const crystalId = Object.keys(items).find(k => /Crystal/i.test(items[k].name));
      if (crystalId) drops.push({ id: crystalId, qty: 1 });
    }
    const notes = handleMonsterKill(character.currentLocation, mob.name);
    if (notes.length) messages.push(...notes);
  }

  return { exp, gil, cp, drops, messages };
}
