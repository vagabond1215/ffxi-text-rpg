import { notoriousMonsters } from '../data/nms.js';

function letterToNum(l) {
  return l.toUpperCase().charCodeAt(0) - 65;
}

function parseCoord(str) {
  const [letter, num] = str.split('-');
  return { x: letterToNum(letter), y: parseInt(num, 10) };
}

function coordsEqual(c, str) {
  const p = parseCoord(str);
  return c && letterToNum(c.letter) === p.x && c.number === p.y;
}

export function initNotorious() {
  const now = Date.now();
  for (const nm of notoriousMonsters) {
    if (nm.type === 'timed') {
      nm.nextSpawn = now + nm.respawnMin * 1000 + Math.random() * (nm.respawnMax - nm.respawnMin) * 1000;
      nm.spawned = false;
    } else if (nm.type === 'lottery') {
      nm.windowOpen = now + nm.deadTime * 1000;
      nm.spawned = false;
    }
  }
}

export function handleMonsterKill(zone, name, subArea = null) {
  const messages = [];
  const now = Date.now();
  for (const nm of notoriousMonsters) {
    if (nm.zone !== zone) continue;
    if (nm.subArea && nm.subArea !== subArea) continue;
    if (nm.type === 'lottery' && name.startsWith(nm.placeholder)) {
      if (now >= nm.windowOpen && !nm.spawned && Math.random() < nm.chance) {
        nm.spawned = true;
        messages.push(`${nm.name} has spawned!`);
      }
    }
  }
  return messages;
}

export function checkForNM(zone, coord, subArea = null) {
  const now = Date.now();
  for (const nm of notoriousMonsters) {
    if (nm.zone !== zone) continue;
    if (nm.subArea && nm.subArea !== subArea) continue;
    if (nm.type === 'timed' && !nm.spawned && now >= nm.nextSpawn) {
      nm.spawned = true;
    }
    if (nm.spawned && nm.coords.some(c => coordsEqual(coord, c))) {
      nm.spawned = false;
      if (nm.type === 'timed') {
        nm.nextSpawn = now + nm.respawnMin * 1000 + Math.random() * (nm.respawnMax - nm.respawnMin) * 1000;
      } else if (nm.type === 'lottery') {
        nm.windowOpen = now + nm.deadTime * 1000;
      }
      return nm;
    }
  }
  return null;
}
