export const items = {
  bronzeDagger: {
    name: 'Bronze Dagger',
    price: 140,
    stack: 1,
    description: 'A small dagger forged from bronze.',
    damage: 3,
    delay: 183,
    levelRequirement: 1
  },
  bronzeSword: {
    name: 'Bronze Sword',
    price: 240,
    stack: 1,
    description: 'A simple bronze sword.',
    damage: 6,
    delay: 231,
    levelRequirement: 1
  },
  leatherVest: {
    name: 'Leather Vest',
    price: 604,
    stack: 1,
    description: 'Basic leather armor for the body.',
    defense: 7,
    levelRequirement: 1
  },
  bronzeIngot: {
    name: 'Bronze Ingot',
    price: 120,
    stack: 12,
    description: 'A bar of bronze used in crafting.',
    levelRequirement: 0
  },
  potion: {
    name: 'Potion',
    price: 300,
    stack: 12,
    description: 'Restores a small amount of HP.',
    levelRequirement: 0
  },
  antidote: {
    name: 'Antidote',
    price: 60,
    stack: 12,
    description: 'Cures poison.',
    levelRequirement: 0
  },
  meatJerky: {
    name: 'Meat Jerky',
    price: 120,
    stack: 12,
    description: 'Dried meat that slightly restores HP.',
    levelRequirement: 0
  },
  distilledWater: {
    name: 'Distilled Water',
    price: 12,
    stack: 12,
    description: 'Used in alchemy and cooking.',
    levelRequirement: 0
  },
  insectPaste: {
    name: 'Insect Paste',
    price: 36,
    stack: 12,
    description: 'Popular fishing bait.',
    levelRequirement: 0
  },
  scrollCure: {
    name: 'Scroll of Cure',
    price: 600,
    stack: 1,
    description: 'Teaches the white magic Cure.',
    levelRequirement: 1
  },
  bronzeShield: {
    name: 'Bronze Shield',
    price: 220,
    stack: 1,
    description: 'A small bronze buckler.',
    defense: 2,
    levelRequirement: 1
  },
  leatherGloves: {
    name: 'Leather Gloves',
    price: 176,
    stack: 1,
    description: 'Basic leather armor for the hands.',
    defense: 4,
    levelRequirement: 1
  },
  clothHeadband: {
    name: 'Cloth Headband',
    price: 112,
    stack: 1,
    description: 'A simple cloth headband.',
    defense: 1,
    levelRequirement: 1
  },
  scrollFire: {
    name: 'Scroll of Fire',
    price: 600,
    stack: 1,
    description: 'Teaches the black magic Fire.',
    levelRequirement: 1
  },
  ether: {
    name: 'Ether',
    price: 540,
    stack: 12,
    description: 'Restores a small amount of MP.',
    levelRequirement: 0
  },
  applePie: {
    name: 'Apple Pie',
    price: 200,
    stack: 12,
    description: 'A sweet pie that restores MP over time.',
    levelRequirement: 0
  }
};

export const vendorInventories = {
  'Swordsmith Shop': ['bronzeDagger', 'bronzeSword', 'bronzeShield'],
  'Arms & Armor Shop': ['bronzeSword', 'leatherVest', 'bronzeDagger', 'leatherGloves', 'clothHeadband', 'bronzeShield'],
  'General Goods Shop': ['potion', 'antidote', 'distilledWater', 'ether'],
  'Food Shop': ['meatJerky', 'applePie'],
  'Item Shop': ['potion', 'antidote', 'distilledWater', 'ether'],
  'Alchemy Shop': ['potion', 'antidote', 'bronzeIngot', 'distilledWater', 'ether'],
  'Scroll Shop': ['scrollCure', 'scrollFire'],
  'Magic Shop': ['scrollCure', 'scrollFire', 'ether'],
  'Fishing Supplies Shop': ['insectPaste', 'distilledWater'],
  'Guild Shop': ['bronzeIngot']
};
