export const items = {
  bronzeDagger: {
    name: 'Bronze Dagger',
    price: 140,
    stack: 1,
    description: 'A small dagger forged from bronze.',
    damage: 3,
    delay: 183
  },
  bronzeSword: {
    name: 'Bronze Sword',
    price: 240,
    stack: 1,
    description: 'A simple bronze sword.',
    damage: 6,
    delay: 231
  },
  leatherVest: {
    name: 'Leather Vest',
    price: 604,
    stack: 1,
    description: 'Basic leather armor for the body.',
    defense: 7
  },
  bronzeIngot: { name: 'Bronze Ingot', price: 120, stack: 12, description: 'A bar of bronze used in crafting.' },
  potion: { name: 'Potion', price: 300, stack: 12, description: 'Restores a small amount of HP.' },
  antidote: { name: 'Antidote', price: 60, stack: 12, description: 'Cures poison.' },
  meatJerky: { name: 'Meat Jerky', price: 120, stack: 12, description: 'Dried meat that slightly restores HP.' },
  distilledWater: { name: 'Distilled Water', price: 12, stack: 12, description: 'Used in alchemy and cooking.' },
  insectPaste: { name: 'Insect Paste', price: 36, stack: 12, description: 'Popular fishing bait.' },
  scrollCure: { name: 'Scroll of Cure', price: 600, stack: 1, description: 'Teaches the white magic Cure.' }
};

export const vendorInventories = {
  'Swordsmith Shop': ['bronzeDagger', 'bronzeSword'],
  'Arms & Armor Shop': ['bronzeSword', 'leatherVest', 'bronzeDagger'],
  'General Goods Shop': ['potion', 'antidote', 'distilledWater'],
  'Food Shop': ['meatJerky'],
  'Item Shop': ['potion', 'antidote', 'distilledWater'],
  'Alchemy Shop': ['potion', 'antidote', 'bronzeIngot', 'distilledWater'],
  'Scroll Shop': ['scrollCure'],
  'Magic Shop': ['scrollCure'],
  'Fishing Supplies Shop': ['insectPaste'],
  'Guild Shop': ['bronzeIngot']
};
