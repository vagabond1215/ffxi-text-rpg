// Spell definitions. Each spell includes its magicType and subType which
// correspond to the entries in magicSkills for proficiency tracking.
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
  },
  {
    name: 'Thundaga',
    level: 32,
    element: 'Lightning',
    target: 'AoE',
    mpCost: 105,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 200,
    damage: [
      { skill: 0, V: 200, M: 2.0 },
      { skill: 50, V: 300, M: 1.5 },
      { skill: 100, V: 375, M: 1.0 },
      { skill: 200, V: 475, M: 0.0 }
    ]
  },
  {
    name: 'Aero II',
    level: 34,
    element: 'Wind',
    target: 'ST',
    mpCost: 22,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 140,
    damage: [
      { skill: 0, V: 140, M: 2.6 },
      { skill: 50, V: 270, M: 1.8 },
      { skill: 100, V: 360, M: 1.0 },
      { skill: 200, V: 460, M: 0.0 }
    ]
  },
  {
    name: 'Blizzaga',
    level: 36,
    element: 'Ice',
    target: 'AoE',
    mpCost: 80,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 1,
    baseDamage: 160,
    damage: [
      { skill: 0, V: 160, M: 2.2 },
      { skill: 50, V: 270, M: 1.6 },
      { skill: 100, V: 350, M: 1.0 },
      { skill: 200, V: 450, M: 0.0 }
    ]
  },
  {
    name: 'Fire II',
    level: 38,
    element: 'Fire',
    target: 'ST',
    mpCost: 26,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 160,
    damage: [
      { skill: 0, V: 160, M: 2.4 },
      { skill: 50, V: 280, M: 1.7 },
      { skill: 100, V: 365, M: 1.0 },
      { skill: 200, V: 465, M: 0.0 }
    ]
  },
  {
    name: 'Stonega II',
    level: 40,
    element: 'Earth',
    target: 'AoE',
    mpCost: 24,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 250,
    damage: [
      { skill: 0, V: 250, M: 4.0 },
      { skill: 50, V: 450, M: 3.0 },
      { skill: 100, V: 600, M: 2.0 },
      { skill: 200, V: 800, M: 1.0 },
      { skill: 300, V: 900, M: 0.0 }
    ]
  },
  {
    name: 'Blizzard II',
    level: 42,
    element: 'Ice',
    target: 'ST',
    mpCost: 29,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 180,
    damage: [
      { skill: 0, V: 180, M: 2.2 },
      { skill: 50, V: 290, M: 1.6 },
      { skill: 100, V: 370, M: 1.0 },
      { skill: 200, V: 470, M: 0.0 }
    ]
  },
  {
    name: 'Waterga II',
    level: 44,
    element: 'Water',
    target: 'AoE',
    mpCost: 21,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 280,
    damage: [
      { skill: 0, V: 280, M: 3.7 },
      { skill: 50, V: 465, M: 2.9 },
      { skill: 100, V: 610, M: 1.95 },
      { skill: 200, V: 805, M: 1.0 },
      { skill: 300, V: 905, M: 0.0 }
    ]
  },
  {
    name: 'Thunder II',
    level: 46,
    element: 'Lightning',
    target: 'ST',
    mpCost: 32,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 200,
    damage: [
      { skill: 0, V: 200, M: 2.0 },
      { skill: 50, V: 300, M: 1.5 },
      { skill: 100, V: 375, M: 1.0 },
      { skill: 200, V: 475, M: 0.0 }
    ]
  },
  {
    name: 'Aeroga II',
    level: 48,
    element: 'Wind',
    target: 'AoE',
    mpCost: 27,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 310,
    damage: [
      { skill: 0, V: 310, M: 3.4 },
      { skill: 50, V: 480, M: 2.8 },
      { skill: 100, V: 620, M: 1.9 },
      { skill: 200, V: 810, M: 1.0 },
      { skill: 300, V: 910, M: 0.0 }
    ]
  },
  {
    name: 'Stone III',
    level: 51,
    element: 'Earth',
    target: 'ST',
    mpCost: 28,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 200,
    damage: [
      { skill: 0, V: 200, M: 4.0 },
      { skill: 50, V: 400, M: 3.0 },
      { skill: 100, V: 550, M: 2.0 },
      { skill: 200, V: 750, M: 1.0 },
      { skill: 300, V: 850, M: 0.0 }
    ]
  },
  {
    name: 'Firaga II',
    level: 53,
    element: 'Fire',
    target: 'AoE',
    mpCost: 31,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 340,
    damage: [
      { skill: 0, V: 340, M: 3.1 },
      { skill: 50, V: 495, M: 2.7 },
      { skill: 100, V: 630, M: 1.85 },
      { skill: 200, V: 815, M: 1.0 },
      { skill: 300, V: 915, M: 0.0 }
    ]
  },
  {
    name: 'Water III',
    level: 55,
    element: 'Water',
    target: 'ST',
    mpCost: 33,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 230,
    damage: [
      { skill: 0, V: 230, M: 3.7 },
      { skill: 50, V: 415, M: 2.9 },
      { skill: 100, V: 560, M: 1.95 },
      { skill: 200, V: 755, M: 1.0 },
      { skill: 300, V: 855, M: 0.0 }
    ]
  },
  {
    name: 'Blizzaga II',
    level: 57,
    element: 'Ice',
    target: 'AoE',
    mpCost: 83,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 370,
    damage: [
      { skill: 0, V: 370, M: 2.8 },
      { skill: 50, V: 510, M: 2.6 },
      { skill: 100, V: 640, M: 1.8 },
      { skill: 200, V: 820, M: 1.0 },
      { skill: 300, V: 920, M: 0.0 }
    ]
  },
  {
    name: 'Aero III',
    level: 59,
    element: 'Wind',
    target: 'ST',
    mpCost: 38,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 260,
    damage: [
      { skill: 0, V: 260, M: 3.4 },
      { skill: 50, V: 430, M: 2.8 },
      { skill: 100, V: 570, M: 1.9 },
      { skill: 200, V: 760, M: 1.0 },
      { skill: 300, V: 860, M: 0.0 }
    ]
  },
  {
    name: 'Thundaga II',
    level: 61,
    element: 'Lightning',
    target: 'AoE',
    mpCost: 193,
    castTime: 3.0,
    recastTime: 15.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 2,
    baseDamage: 400,
    damage: [
      { skill: 0, V: 400, M: 2.5 },
      { skill: 50, V: 525, M: 2.5 },
      { skill: 100, V: 650, M: 1.75 },
      { skill: 200, V: 825, M: 1.0 },
      { skill: 300, V: 925, M: 0.0 }
    ]
  },
  {
    name: 'Fire III',
    level: 62,
    element: 'Fire',
    target: 'ST',
    mpCost: 41,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 290,
    damage: [
      { skill: 0, V: 290, M: 3.1 },
      { skill: 50, V: 445, M: 2.7 },
      { skill: 100, V: 580, M: 1.85 },
      { skill: 200, V: 765, M: 1.0 },
      { skill: 300, V: 865, M: 0.0 }
    ]
  },
  {
    name: 'Stonega III',
    level: 63,
    element: 'Earth',
    target: 'AoE',
    mpCost: 45,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 500,
    damage: [
      { skill: 0, V: 500, M: 5.0 },
      { skill: 50, V: 750, M: 4.0 },
      { skill: 100, V: 950, M: 3.0 },
      { skill: 200, V: 1250, M: 2.0 },
      { skill: 300, V: 1550, M: 0.0 }
    ]
  },
  {
    name: 'Blizzard III',
    level: 64,
    element: 'Ice',
    target: 'AoE',
    mpCost: 297,
    castTime: 7.0,
    recastTime: 25.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 320,
    damage: [
      { skill: 0, V: 320, M: 2.8 },
      { skill: 50, V: 460, M: 2.6 },
      { skill: 100, V: 590, M: 1.8 },
      { skill: 200, V: 770, M: 1.0 },
      { skill: 300, V: 870, M: 0.0 }
    ]
  },
  {
    name: 'Waterga III',
    level: 65,
    element: 'Water',
    target: 'AoE',
    mpCost: 54,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 540,
    damage: [
      { skill: 0, V: 540, M: 4.7 },
      { skill: 50, V: 775, M: 3.9 },
      { skill: 100, V: 970, M: 2.95 },
      { skill: 200, V: 1265, M: 1.99 },
      { skill: 300, V: 1564, M: 0.0 }
    ]
  },
  {
    name: 'Thunder III',
    level: 66,
    element: 'Lightning',
    target: 'ST',
    mpCost: 46,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 350,
    damage: [
      { skill: 0, V: 350, M: 2.5 },
      { skill: 50, V: 475, M: 2.5 },
      { skill: 100, V: 600, M: 1.75 },
      { skill: 200, V: 775, M: 1.0 },
      { skill: 300, V: 875, M: 0.0 }
    ]
  },
  {
    name: 'Aeroga III',
    level: 67,
    element: 'Wind',
    target: 'AoE',
    mpCost: 61,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 580,
    damage: [
      { skill: 0, V: 580, M: 4.4 },
      { skill: 50, V: 800, M: 3.8 },
      { skill: 100, V: 990, M: 2.9 },
      { skill: 200, V: 1280, M: 1.98 },
      { skill: 300, V: 1578, M: 0.0 }
    ]
  },
  {
    name: 'Stone IV',
    level: 68,
    element: 'Earth',
    target: 'ST',
    mpCost: 50,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 4,
    baseDamage: 400,
    damage: [
      { skill: 0, V: 400, M: 5.0 },
      { skill: 50, V: 650, M: 4.0 },
      { skill: 100, V: 850, M: 3.0 },
      { skill: 200, V: 1150, M: 2.0 },
      { skill: 300, V: 1450, M: 1.0 },
      { skill: 400, V: 1450, M: 0.0 }
    ]
  },
  {
    name: 'Firaga III',
    level: 69,
    element: 'Fire',
    target: 'AoE',
    mpCost: 63,
    castTime: 2.0,
    recastTime: 5.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 620,
    damage: [
      { skill: 0, V: 620, M: 4.2 },
      { skill: 50, V: 830, M: 3.7 },
      { skill: 100, V: 1015, M: 2.85 },
      { skill: 200, V: 1295, M: 1.97 },
      { skill: 300, V: 1597, M: 0.0 }
    ]
  },
  {
    name: 'Water IV',
    level: 70,
    element: 'Water',
    target: 'ST',
    mpCost: 144,
    castTime: 8.25,
    recastTime: 36.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 4,
    baseDamage: 440,
    damage: [
      { skill: 0, V: 440, M: 4.7 },
      { skill: 50, V: 675, M: 3.9 },
      { skill: 100, V: 870, M: 2.95 },
      { skill: 200, V: 1165, M: 1.99 },
      { skill: 300, V: 1464, M: 0.0 }
    ]
  },
  {
    name: 'Blizzaga III',
    level: 71,
    element: 'Ice',
    target: 'AoE',
    mpCost: 297,
    castTime: 7.0,
    recastTime: 25.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 660,
    damage: [
      { skill: 0, V: 660, M: 3.9 },
      { skill: 50, V: 855, M: 3.6 },
      { skill: 100, V: 1035, M: 2.8 },
      { skill: 200, V: 1310, M: 1.96 },
      { skill: 300, V: 1611, M: 0.0 }
    ]
  },
  {
    name: 'Aero IV',
    level: 72,
    element: 'Wind',
    target: 'ST',
    mpCost: 66,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 4,
    baseDamage: 480,
    damage: [
      { skill: 0, V: 480, M: 4.4 },
      { skill: 50, V: 700, M: 3.8 },
      { skill: 100, V: 890, M: 2.9 },
      { skill: 200, V: 1180, M: 1.98 },
      { skill: 300, V: 1478, M: 0.0 }
    ]
  },
  {
    name: 'Fire IV',
    level: 73,
    element: 'Fire',
    target: 'ST',
    mpCost: 74,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 4,
    baseDamage: 520,
    damage: [
      { skill: 0, V: 520, M: 4.2 },
      { skill: 50, V: 730, M: 3.7 },
      { skill: 100, V: 915, M: 2.85 },
      { skill: 200, V: 1195, M: 1.97 },
      { skill: 300, V: 1497, M: 0.0 }
    ]
  },
  {
    name: 'Thundaga III',
    level: 73,
    element: 'Lightning',
    target: 'AoE',
    mpCost: 332,
    castTime: 7.0,
    recastTime: 25.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 3,
    baseDamage: 700,
    damage: [
      { skill: 0, V: 700, M: 3.6 },
      { skill: 50, V: 880, M: 3.5 },
      { skill: 100, V: 1055, M: 2.75 },
      { skill: 200, V: 1325, M: 1.95 },
      { skill: 300, V: 1625, M: 0.0 }
    ]
  },
  {
    name: 'Blizzard IV',
    level: 74,
    element: 'Ice',
    target: 'ST',
    mpCost: 78,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 4,
    baseDamage: 560,
    damage: [
      { skill: 0, V: 560, M: 3.9 },
      { skill: 50, V: 755, M: 3.6 },
      { skill: 100, V: 935, M: 2.8 },
      { skill: 200, V: 1210, M: 1.96 },
      { skill: 300, V: 1511, M: 0.0 }
    ]
  },
  {
    name: 'Thunder IV',
    level: 75,
    element: 'Lightning',
    target: 'ST',
    mpCost: 84,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 4,
    baseDamage: 600,
    damage: [
      { skill: 0, V: 600, M: 3.6 },
      { skill: 50, V: 780, M: 3.5 },
      { skill: 100, V: 955, M: 2.75 },
      { skill: 200, V: 1225, M: 1.95 },
      { skill: 300, V: 1525, M: 0.0 }
    ]
  },
  {
    name: 'Stone V',
    level: 77,
    element: 'Earth',
    target: 'ST',
    mpCost: 96,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 5,
    baseDamage: 650,
    damage: [
      { skill: 0, V: 650, M: 6.0 },
      { skill: 50, V: 950, M: 5.0 },
      { skill: 100, V: 1200, M: 4.0 },
      { skill: 200, V: 1600, M: 3.0 },
      { skill: 300, V: 1900, M: 2.0 },
      { skill: 400, V: 2100, M: 1.0 },
      { skill: 500, V: 2200, M: 0.0 }
    ]
  },
  {
    name: 'Water V',
    level: 80,
    element: 'Water',
    target: 'ST',
    mpCost: 104,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 5,
    baseDamage: 700,
    damage: [
      { skill: 0, V: 700, M: 5.6 },
      { skill: 50, V: 980, M: 4.74 },
      { skill: 100, V: 1217, M: 3.95 },
      { skill: 200, V: 1612, M: 2.99 },
      { skill: 300, V: 1911, M: 1.99 },
      { skill: 400, V: 2110, M: 1.0 },
      { skill: 500, V: 2210, M: 0.0 }
    ]
  },
  {
    name: 'Aero V',
    level: 83,
    element: 'Wind',
    target: 'ST',
    mpCost: 112,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 5,
    baseDamage: 750,
    damage: [
      { skill: 0, V: 750, M: 5.2 },
      { skill: 50, V: 1010, M: 4.5 },
      { skill: 100, V: 1235, M: 3.9 },
      { skill: 200, V: 1625, M: 2.98 },
      { skill: 300, V: 1923, M: 1.98 },
      { skill: 400, V: 2121, M: 1.0 },
      { skill: 500, V: 2221, M: 0.0 }
    ]
  },
  {
    name: 'Fire V',
    level: 86,
    element: 'Fire',
    target: 'ST',
    mpCost: 120,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 5,
    baseDamage: 800,
    damage: [
      { skill: 0, V: 800, M: 4.8 },
      { skill: 50, V: 1040, M: 4.24 },
      { skill: 100, V: 1252, M: 3.85 },
      { skill: 200, V: 1637, M: 2.97 },
      { skill: 300, V: 1934, M: 1.97 },
      { skill: 400, V: 2131, M: 1.0 },
      { skill: 500, V: 2231, M: 0.0 }
    ]
  },
  {
    name: 'Blizzard V',
    level: 89,
    element: 'Ice',
    target: 'ST',
    mpCost: 128,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 5,
    baseDamage: 850,
    damage: [
      { skill: 0, V: 850, M: 4.4 },
      { skill: 50, V: 1070, M: 4.0 },
      { skill: 100, V: 1270, M: 3.8 },
      { skill: 200, V: 1650, M: 2.96 },
      { skill: 300, V: 1946, M: 1.96 },
      { skill: 400, V: 2142, M: 1.0 },
      { skill: 500, V: 2242, M: 0.0 }
    ]
  },
  {
    name: 'Thunder V',
    level: 92,
    element: 'Lightning',
    target: 'ST',
    mpCost: 136,
    castTime: 1.5,
    recastTime: 6.0,
    magicType: 'Black Magic',
    subType: 'Elemental',
    proficiency: 'Elemental Magic',
    tier: 5,
    baseDamage: 900,
    damage: [
      { skill: 0, V: 900, M: 4.0 },
      { skill: 50, V: 1100, M: 3.74 },
      { skill: 100, V: 1287, M: 3.75 },
      { skill: 200, V: 1662, M: 2.95 },
      { skill: 300, V: 1957, M: 1.95 },
      { skill: 400, V: 2152, M: 1.0 },
      { skill: 500, V: 2252, M: 0.0 }
    ]
  }

];

export function getSpell(name) {
  return spells.find(s => s.name === name);
}

// Mapping of jobs to the types of magic they can cast
const magicTypesByJob = {
  'White Mage': ['White Magic'],
  'Black Mage': ['Black Magic'],
  'Red Mage': ['White Magic', 'Black Magic'],
  'Paladin': ['White Magic'],
  'Dark Knight': ['Black Magic'],
  'Bard': ['Bard'],
  'Summoner': ['Summoning Magic'],
  'Scholar': ['White Magic', 'Black Magic'],
  'Blue Mage': ['Blue Magic'],
  'Ninja': ['Ninjutsu']
};

/**
 * Return a list of spells the character can currently cast based on
 * job, sub job and level requirements. Spells remain learned even if
 * they are not currently available.
 */
export function getAvailableSpells(character) {
  if (!character?.spells) return [];

  const mainTypes = magicTypesByJob[character.job] || [];
  const mainLevel = character.level || 0;
  const subJob = character.subJob;
  const subTypes = subJob ? (magicTypesByJob[subJob] || []) : [];
  const subLevel = subJob ? Math.floor(mainLevel / 2) : 0;

  return character.spells.filter(name => {
    const sp = getSpell(name);
    if (!sp) return false;
    if (mainTypes.includes(sp.magicType) && sp.level <= mainLevel) return true;
    if (subJob && subTypes.includes(sp.magicType) && sp.level <= subLevel) return true;
    return false;
  });
}
