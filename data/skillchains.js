export const skillchainChart = {
  Transfixion: {
    Compression: { name: 'Compression', level: 1 },
    Scission: { name: 'Distortion', level: 2 },
    Reverberation: { name: 'Reverberation', level: 1 }
  },
  Compression: {
    Transfixion: { name: 'Transfixion', level: 1 },
    Detonation: { name: 'Detonation', level: 1 }
  },
  Liquefaction: {
    Scission: { name: 'Scission', level: 1 },
    Impaction: { name: 'Fusion', level: 2 }
  },
  Scission: {
    Liquefaction: { name: 'Liquefaction', level: 1 },
    Detonation: { name: 'Scission', level: 1 },
    Reverberation: { name: 'Reverberation', level: 1 }
  },
  Reverberation: {
    Transfixion: { name: 'Reverberation', level: 1 },
    Scission: { name: 'Reverberation', level: 1 },
    Induration: { name: 'Induration', level: 1 },
    Impaction: { name: 'Impaction', level: 1 }
  },
  Detonation: {
    Compression: { name: 'Gravitation', level: 2 },
    Scission: { name: 'Scission', level: 1 }
  },
  Induration: {
    Compression: { name: 'Compression', level: 1 },
    Reverberation: { name: 'Fragmentation', level: 2 },
    Impaction: { name: 'Impaction', level: 1 }
  },
  Impaction: {
    Liquefaction: { name: 'Liquefaction', level: 1 },
    Detonation: { name: 'Detonation', level: 1 }
  },
  Distortion: {
    Gravitation: { name: 'Darkness', level: 3 },
    Fusion: { name: 'Fusion', level: 2 }
  },
  Fusion: {
    Gravitation: { name: 'Gravitation', level: 2 },
    Fragmentation: { name: 'Light', level: 3 }
  },
  Fragmentation: {
    Distortion: { name: 'Distortion', level: 2 },
    Fusion: { name: 'Light', level: 3 }
  },
  Gravitation: {
    Distortion: { name: 'Darkness', level: 3 },
    Fragmentation: { name: 'Fragmentation', level: 2 }
  },
  Light: {
    Light: { name: 'Light', level: 4 }
  },
  Darkness: {
    Darkness: { name: 'Darkness', level: 4 }
  }
};

export const skillchainMultipliers = {
  1: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
  2: [0, 0.6, 0.75, 1.0, 1.25, 1.5, 1.75],
  3: [0, 1.0, 1.5, 1.75, 2.0, 2.25, 2.5],
  4: [0, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0]
};

export function resolveSkillchain(prevProps, currentProps) {
  let best = null;
  if (!prevProps || !currentProps) return null;
  for (const first of prevProps) {
    const row = skillchainChart[first];
    if (!row) continue;
    for (const second of currentProps) {
      const res = row[second];
      if (res && (!best || res.level > best.level)) {
        best = res;
      }
    }
  }
  return best;
}

export function skillchainBonus(level, step) {
  const row = skillchainMultipliers[level];
  if (!row) return 0;
  const idx = Math.min(step, 7);
  return row[idx] || 0;
}
