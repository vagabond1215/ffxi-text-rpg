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

const testMob = (function() {
  for (const zone of Object.values(bestiaryByZone)) {
    for (const m of zone) {
      if (parseLevel(m.level) === 1) return { ...m };
    }
  }
  throw new Error('No level 1 mob found');
})();

testMob.delay = testMob.delay || 240;

function calcPhysicalDamage(attacker, defender, aStats, dStats) {
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
  return Math.max(1, Math.floor(baseDamage * pdif));
}

function attemptHit(attacker, defender, aStats, dStats) {
  const hitChance = Math.min(0.95, Math.max(0.05, (aStats.acc - dStats.eva + 50) / 100));
  if (Math.random() < hitChance) {
    return calcPhysicalDamage(attacker, defender, aStats, dStats);
  }
  return 0;
}

function runBattle(char, mob) {
  let playerHp = char.hp;
  let mobHp = parseLevel(mob.level) * 20;
  const playerDelay = items[char.equipment?.mainHand]?.delay || 240;
  const mobDelay = mob.delay || 240;
  const playerInit = (char.stats.dex + char.stats.agi) * (60 / playerDelay);
  const mobInit = parseLevel(mob.level) * 2 * (60 / mobDelay);
  const playerStats = {
    atk: getAttack(char),
    def: getDefense(char),
    acc: char.stats.dex + char.level,
    eva: char.stats.agi + char.level
  };
  const mobStats = {
    atk: mobInit + 10,
    def: mobInit + 10,
    acc: mobInit + 10,
    eva: mobInit + 10
  };

  let turn = playerInit >= mobInit ? 'player' : 'mob';
  while (playerHp > 0 && mobHp > 0) {
    if (turn === 'player') {
      mobHp -= attemptHit(char, mob, playerStats, mobStats);
      if (mobHp <= 0) break;
      playerHp -= attemptHit(mob, char, mobStats, playerStats);
    } else {
      playerHp -= attemptHit(mob, char, mobStats, playerStats);
      if (playerHp <= 0) break;
      mobHp -= attemptHit(char, mob, playerStats, mobStats);
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
