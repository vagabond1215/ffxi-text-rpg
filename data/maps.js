export const zoneMaps = {};

function coordKey(coord) {
  if (!coord) return '';
  if (typeof coord === 'string') return coord.toUpperCase();
  return `${coord.letter.toUpperCase()}-${coord.number}`;
}

export function registerZoneMap(zone, entries) {
  if (!zoneMaps[zone]) zoneMaps[zone] = {};
  for (const [coord, data] of Object.entries(entries)) {
    zoneMaps[zone][coord.toUpperCase()] = { ...data };
  }
}

export function getSubArea(zone, coord) {
  const z = zoneMaps[zone];
  if (!z) return null;
  const info = z[coordKey(coord)];
  return info ? info.subArea || null : null;
}

export function canMove(zone, from, to) {
  const map = zoneMaps[zone];
  if (!map) return true;
  const fromKey = coordKey(from);
  const toKey = coordKey(to);
  const fromInfo = map[fromKey];
  const toInfo = map[toKey];
  if (!toInfo) return false;
  const dx = toKey.charCodeAt(0) - fromKey.charCodeAt(0);
  const dy = parseInt(toKey.slice(2)) - parseInt(fromKey.slice(2));
  const isDiag = dx !== 0 && dy !== 0;
  if (isDiag && (toInfo.noDiagonal || fromInfo?.noDiagonal)) return false;
  if (toInfo.allowedFrom && !toInfo.allowedFrom.includes(fromKey)) return false;
  if (fromInfo?.oneWayTo && !fromInfo.oneWayTo.includes(toKey)) return false;
  return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
}

// Register South Gustaberg map
registerZoneMap('South Gustaberg', {
  'D-8': { allowedFrom: ['E-8'] },
  'D-9': { allowedFrom: ['E-9'] },
  'E-6': {}, 'E-7': {}, 'E-8': {}, 'E-9': {},
  'F-7': {}, 'F-8': {}, 'F-9': {},
  'G-7': {}, 'G-8': {}, 'G-9': { allowedFrom: ['G-8', 'H-8', 'H-9'] },
  'H-5': { noDiagonal: true },
  'H-6': { noDiagonal: true },
  'H-7': {}, 'H-8': {}, 'H-9': {}, 'H-10': {},
  'I-7': {}, 'I-9': {}, 'I-10': {},
  'J-7': {}, 'J-8': { entryTo: 'Vomp Hill L1', entryLabel: 'Ramp Up' }, 'J-9': {}, 'J-10': { pois: ['Cavernous Maw'] },
  'K-7': {}, 'K-8': {}, 'K-9': { subArea: 'Goblin Camp' },
  'K-10': { subArea: 'Goblin Camp', entryTo: 'Goblin Camp', entryLabel: 'Goblin Camp' },
  'L-8': { allowedFrom: ['K-8', 'K-9', 'L-9'] }, 'L-9': {}, 'L-10': {},
  'M-10': {}
});

// Register Vomp Hill level 1 map
registerZoneMap('Vomp Hill L1', {
  'H-8': { subArea: 'Vomp Hill' },
  'H-9': { subArea: 'Vomp Hill' },
  'I-7': { subArea: 'Vomp Hill' },
  'I-8': { subArea: 'Vomp Hill' },
  'I-9': { subArea: 'Vomp Hill' },
  'J-8': { subArea: 'Vomp Hill', entries: [
    { to: 'South Gustaberg', label: 'Ramp Down' },
    { to: 'Vomp Hill L2', label: 'Ramp Up' }
  ] },
  'J-9': { subArea: 'Vomp Hill' }
});

// Register Vomp Hill level 2 map
registerZoneMap('Vomp Hill L2', {
  'I-8': { subArea: 'Vomp Hill' },
  'I-9': { subArea: 'Vomp Hill', entries: [{ to: 'Vomp Hill L3', label: 'Ramp Up' }] },
  'J-8': { subArea: 'Vomp Hill', entryTo: 'Vomp Hill L1', entryLabel: 'Ramp Down' },
  'J-9': { subArea: 'Vomp Hill' }
});

// Register Vomp Hill level 3 map
registerZoneMap('Vomp Hill L3', {
  'I-8': { subArea: 'Vomp Hill' },
  'I-9': { subArea: 'Vomp Hill', entryTo: 'Vomp Hill L2', entryLabel: 'Ramp Down' },
  'J-8': { subArea: 'Vomp Hill' }
});

// Register Goblin Camp map
registerZoneMap('Goblin Camp', {
  'K-9': { subArea: 'Goblin Camp' },
  'K-10': { subArea: 'Goblin Camp', entryTo: 'South Gustaberg', entryLabel: 'Ramp Down' }
});
