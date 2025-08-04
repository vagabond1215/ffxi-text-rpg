export const spells = [
  {
    name: 'Stone',
    level: 1,
    element: 'Earth',
    target: 'ST',
    mpCost: 4,
    castTime: 0.5,
    recastTime: 2,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 10,
    damage: [
      { skill: 0, V: 10, M: 2 },
      { skill: 50, V: 110, M: 1 },
      { skill: 100, V: 160, M: 0 }
    ]
  },
  {
    name: 'Water',
    level: 5,
    element: 'Water',
    target: 'ST',
    mpCost: 5,
    castTime: 0.5,
    recastTime: 2,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 25,
    damage: [
      { skill: 0, V: 25, M: 1.8 },
      { skill: 50, V: 115, M: 1 },
      { skill: 100, V: 165, M: 0 }
    ]
  },
  {
    name: 'Aero',
    level: 9,
    element: 'Wind',
    target: 'ST',
    mpCost: 6,
    castTime: 0.5,
    recastTime: 2,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 40,
    damage: [
      { skill: 0, V: 40, M: 1.6 },
      { skill: 50, V: 120, M: 1 },
      { skill: 100, V: 170, M: 0 }
    ]
  },
  {
    name: 'Fire',
    level: 13,
    element: 'Fire',
    target: 'ST',
    mpCost: 7,
    castTime: 0.5,
    recastTime: 2,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 55,
    damage: [
      { skill: 0, V: 55, M: 1.4 },
      { skill: 50, V: 125, M: 1 },
      { skill: 100, V: 175, M: 0 }
    ]
  },
  {
    name: 'Stonega',
    level: 15,
    element: 'Earth',
    target: 'AoE',
    mpCost: 24,
    castTime: 2,
    recastTime: 5,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 60,
    damage: [
      { skill: 0, V: 60, M: 3 },
      { skill: 50, V: 210, M: 2 },
      { skill: 100, V: 310, M: 1 },
      { skill: 200, V: 410, M: 0 }
    ]
  },
  {
    name: 'Blizzard',
    level: 17,
    element: 'Ice',
    target: 'ST',
    mpCost: 8,
    castTime: 0.5,
    recastTime: 2,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 70,
    damage: [
      { skill: 0, V: 70, M: 1.2 },
      { skill: 50, V: 130, M: 1 },
      { skill: 100, V: 180, M: 0 }
    ]
  },
  {
    name: 'Waterga',
    level: 19,
    element: 'Water',
    target: 'AoE',
    mpCost: 34,
    castTime: 2,
    recastTime: 5,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 80,
    damage: [
      { skill: 0, V: 80, M: 2.8 },
      { skill: 50, V: 220, M: 1.9 },
      { skill: 100, V: 315, M: 1 },
      { skill: 200, V: 415, M: 0 }
    ]
  },
  {
    name: 'Thunder',
    level: 21,
    element: 'Lightning',
    target: 'ST',
    mpCost: 9,
    castTime: 0.5,
    recastTime: 2,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 85,
    damage: [
      { skill: 0, V: 85, M: 1.0 },
      { skill: 50, V: 135, M: 1 },
      { skill: 100, V: 185, M: 0 }
    ]
  },
  {
    name: 'Aeroga',
    level: 23,
    element: 'Wind',
    target: 'AoE',
    mpCost: 45,
    castTime: 2,
    recastTime: 5,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 100,
    damage: [
      { skill: 0, V: 100, M: 2.6 },
      { skill: 50, V: 230, M: 1.8 },
      { skill: 100, V: 320, M: 1 },
      { skill: 200, V: 420, M: 0 }
    ]
  },
  {
    name: 'Stone II',
    level: 26,
    element: 'Earth',
    target: 'ST',
    mpCost: 16,
    castTime: 1.5,
    recastTime: 6,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 100,
    damage: [
      { skill: 0, V: 100, M: 3 },
      { skill: 50, V: 250, M: 2 },
      { skill: 100, V: 350, M: 1 },
      { skill: 200, V: 450, M: 0 }
    ]
  },
  {
    name: 'Firaga',
    level: 28,
    element: 'Fire',
    target: 'AoE',
    mpCost: 57,
    castTime: 2,
    recastTime: 5,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 120,
    damage: [
      { skill: 0, V: 120, M: 2.4 },
      { skill: 50, V: 240, M: 1.7 },
      { skill: 100, V: 325, M: 1 },
      { skill: 200, V: 425, M: 0 }
    ]
  },
  {
    name: 'Water II',
    level: 30,
    element: 'Water',
    target: 'ST',
    mpCost: 19,
    castTime: 1.5,
    recastTime: 6,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 120,
    damage: [
      { skill: 0, V: 120, M: 2.8 },
      { skill: 50, V: 260, M: 1.9 },
      { skill: 100, V: 355, M: 1 },
      { skill: 200, V: 455, M: 0 }
    ]
  }
];

export function getSpell(name) {
  return spells.find(s => s.name === name);
}
