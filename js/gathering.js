import { monstersByDistance } from '../data/index.js';

const DAILY_FISH_LIMIT = 200;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function attemptFishing(character, zone, subArea = null) {
  const today = new Date().toDateString();
  if (character.fishDay !== today) {
    character.fishDay = today;
    character.fishCount = 0;
  }
  if (character.fishCount >= DAILY_FISH_LIMIT) {
    return { success: false, message: 'You are too tired to fish today.' };
  }
  const pool = (monstersByDistance(zone, subArea) || []).filter(m => m.fishingOnly);
  if (!pool.length) {
    return { success: false, message: 'There is nothing to fish here.' };
  }
  const target = { ...pickRandom(pool) };
  const required = target.fishingSkill || 0;
  const skill = character.crafting?.Fishing || 0;
  let chance = 0.5 + (skill - required) * 0.02;
  if (chance < 0.05) chance = 0.05;
  if (chance > 0.95) chance = 0.95;
  character.fishCount++;
  if (Math.random() < chance) {
    return { success: true, fish: target.name };
  }
  return { success: false, message: 'The catch got away.' };
}

export function attemptGather(character, skillName, difficulty = 0) {
  const level = character.gathering?.[skillName] || 0;
  let chance = 0.5 + (level - difficulty) * 0.02;
  if (chance < 0.05) chance = 0.05;
  if (chance > 0.95) chance = 0.95;
  return Math.random() < chance;
}
