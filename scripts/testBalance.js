const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load(file, context) {
  let code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  code = code
    .replace(/import[^\n]+\n/g, '')
    .replace(/export\s+async\s+function\s+/g, 'async function ')
    .replace(/export\s+const\s+/g, 'var ')
    .replace(/export\s+let\s+/g, 'var ')
    .replace(/export\s+var\s+/g, 'var ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s*{[^}]*};?/g, '');
  vm.runInContext(code, context, { filename: file });
}

const context = { console, Math }; // allow console and Math
vm.createContext(context);

// load data modules
load('data/scales.js', context);
load('data/jobs.js', context);
load('data/races.js', context);
load('data/locations.js', context);
load('data/vendors.js', context);
load('data/characters.js', context);
load('data/bestiary.js', context);
load('js/encounter.js', context);

const { races, jobs, baseJobNames, items, createCharacterObject, bestiaryByZone, parseLevel } = context;

function getAttack(character) {
  const weapon = items[character.equipment?.mainHand];
  const dmg = weapon?.damage || 0;
  return character.stats.str + character.level + dmg;
}

function getDefense(character) {
  let def = character.stats.vit + character.level;
  for (const slot of Object.values(character.equipment || {})) {
    const it = items[slot];
    if (it?.defense) def += it.defense;
  }
  return def;
}

function accuracyFromSkill(skill) {
  if (skill <= 200) return skill;
  if (skill <= 400) return 200 + Math.floor((skill - 200) * 0.9);
  if (skill <= 600) return 380 + Math.floor((skill - 400) * 0.8);
  return 540 + Math.floor((skill - 600) * 0.9);
}

function evasionFromSkill(skill) {
  if (skill <= 200) return skill;
  return 200 + Math.floor((skill - 200) * 0.9);
}

function calculateAccuracy(dex, skill, bonus = 0, isPet = false) {
  const dexAcc = Math.floor(dex * (isPet ? 0.5 : 0.75));
  return dexAcc + accuracyFromSkill(skill) + bonus;
}

function calculateEvasion(agi, skill, bonus = 0) {
  const agiEva = Math.floor(agi / 2);
  return agiEva + evasionFromSkill(skill) + bonus;
}

function calculateHitChance(acc, eva, attackerLevel, defenderLevel, cap = 95) {
  const dLvl = defenderLevel - attackerLevel;
  let rate = 75 + Math.floor((acc - eva) / 2) - 2 * dLvl;
  rate = Math.max(20, Math.min(cap, rate));
  return rate / 100;
}

function critBonusDex(dDex) {
  if (dDex <= 6) return 0;
  if (dDex <= 13) return 1;
  if (dDex <= 19) return 2;
  if (dDex <= 29) return 3;
  if (dDex <= 39) return 4;
  if (dDex <= 50) return dDex - 35;
  return 15;
}

function criticalChance(attacker, defender) {
  let rate = 0.05;
  const atkDex = attacker.stats?.dex !== undefined
    ? attacker.stats.dex
    : attacker.dex !== undefined
      ? attacker.dex
      : attacker.str;
  const defAgi = defender.stats?.agi !== undefined
    ? defender.stats.agi
    : defender.agi !== undefined
      ? defender.agi
      : (defender.vit ?? (parseLevel(defender.level) * 2)) + 1;
  const dDex = atkDex - defAgi;
  rate += critBonusDex(dDex) / 100;
  return rate;
}

const testMob = (function() {
  for (const zone of Object.values(bestiaryByZone)) {
    for (const m of zone) {
      if (parseLevel(m.level) === 1) return { ...m };
    }
  }
  throw new Error('No level 1 mob found');
})();

testMob.delay = testMob.delay || 240;

function calcPhysicalDamage(attacker, defender, aStats, dStats, isCrit = false, critBonus = 0) {
  const atkLevel = attacker.level || parseLevel(attacker.level);
  const defLevel = defender.level || parseLevel(defender.level);
  const weaponDamage = attacker.equipment
    ? (items[attacker.equipment.mainHand]?.damage || 1)
    : Math.max(1, Math.floor(aStats.atk / 2));
  const str = attacker.stats?.str ?? aStats.atk;
  const vit = defender.stats?.vit ?? dStats.def;
  const rank = Math.floor(weaponDamage / 9);
  let fSTR = Math.floor(((str - vit) + 4) / 4);
  fSTR = Math.min(Math.max(fSTR, -rank), rank + 8);
  const baseDamage = weaponDamage + fSTR;
  let ratio = aStats.atk / dStats.def;
  ratio = Math.min(ratio, 2.25);
  if (defLevel > atkLevel) {
    ratio -= 0.05 * (defLevel - atkLevel);
  }
  const p = x => Math.max(x, 0);
  const n = x => Math.max(-x, 0);
  const a = 1 + (10 / 9) * (p(Math.max(ratio, 0.5) - 1.5) - n(Math.max(ratio, 0.5) - 1.25));
  const b = 1 + (10 / 9) * (p(ratio - 0.75) - n(ratio - 0.5));
  let pdif = a + Math.random() * (b - a);
  pdif = Math.floor(pdif * 1000) / 1000;
  pdif = Math.floor(pdif * (1 + Math.random() * 0.05) * 1000) / 1000;
  if (isCrit) {
    pdif += 1;
    return Math.max(1, Math.floor(baseDamage * pdif * (1 + critBonus)));
  }
  return Math.max(1, Math.floor(baseDamage * pdif));
}

function attemptHit(attacker, defender, aStats, dStats) {
  const hitChance = calculateHitChance(aStats.acc, dStats.eva, aStats.level, dStats.level);
  if (Math.random() < hitChance) {
    const isCrit = Math.random() < criticalChance(attacker, defender);
    return calcPhysicalDamage(attacker, defender, aStats, dStats, isCrit);
  }
  return 0;
}

function runBattle(char, mob) {
  let playerHp = char.hp;
  let mobHp = parseLevel(mob.level) * 20;
  const playerDelay = items[char.equipment?.mainHand]?.delay || 240;
  const mobDelay = mob.delay || 240;
  const mobLevel = parseLevel(mob.level);
  const mobScale = mobLevel * 2;

  function playerStats() {
    const level = char.level;
    const ws = level * 5;
    const es = level * 5;
    return {
      atk: getAttack(char),
      def: getDefense(char),
      acc: calculateAccuracy(char.stats.dex, ws),
      eva: calculateEvasion(char.stats.agi, es),
      level
    };
  }

  function mobStats() {
    const level = mobLevel;
    const dex = mob.dex !== undefined ? mob.dex : mob.str;
    const agi = mob.agi !== undefined ? mob.agi : (mob.vit ?? mobScale) + 1;
    const ws = mob.weaponSkill || level * 5;
    const es = mob.evasionSkill || level * 5;
    const str = mob.str ?? mobScale;
    const vit = mob.vit ?? mobScale;
    return {
      atk: str + level,
      def: vit + level,
      acc: calculateAccuracy(dex, ws),
      eva: calculateEvasion(agi, es),
      level
    };
  }

  let timeToPlayer = playerDelay;
  let timeToMob = mobDelay;
  while (playerHp > 0 && mobHp > 0) {
    if (timeToPlayer <= timeToMob) {
      timeToMob -= timeToPlayer;
      mobHp -= attemptHit(char, mob, playerStats(), mobStats());
      if (mobHp <= 0) break;
      timeToPlayer = playerDelay;
    } else {
      timeToPlayer -= timeToMob;
      playerHp -= attemptHit(mob, char, mobStats(), playerStats());
      if (playerHp <= 0) break;
      timeToMob = mobDelay;
    }
  }
  return Math.max(0, playerHp);
}

function averageOutcome(char, iterations = 100) {
  let total = 0;
  for (let i = 0; i < iterations; i++) {
    total += runBattle(char, testMob);
  }
  return total / iterations;
}

const results = [];
for (const race of races) {
  for (const jobName of baseJobNames) {
    const c = createCharacterObject('Test', jobName, race.name);
    const avgHp = averageOutcome(c, 200);
    const percent = Math.round((avgHp / c.hp) * 100);
    results.push({ race: race.name, job: jobName, hpPercent: percent });
  }
}

console.table(results);
