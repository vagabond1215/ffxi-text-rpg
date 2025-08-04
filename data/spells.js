export const spells = [
  // Basic elemental spells with approximate base damage and MP cost
  { name: 'Fire', element: 'Fire', baseDamage: 30, tier: 1, mpCost: 8, castTime: 2.5 },
  { name: 'Blizzard', element: 'Ice', baseDamage: 30, tier: 1, mpCost: 8, castTime: 2.5 },
  { name: 'Aero', element: 'Wind', baseDamage: 30, tier: 1, mpCost: 8, castTime: 2.5 },
  { name: 'Stone', element: 'Earth', baseDamage: 30, tier: 1, mpCost: 8, castTime: 2.5 },
  { name: 'Thunder', element: 'Lightning', baseDamage: 35, tier: 1, mpCost: 10, castTime: 2.5 },
  { name: 'Water', element: 'Water', baseDamage: 30, tier: 1, mpCost: 8, castTime: 2.5 }
];

export function getSpell(name) {
  return spells.find(s => s.name === name);
}
