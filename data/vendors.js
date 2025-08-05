import { jobNames, baseJobNames } from './jobs.js';

export const items = {
  bronzeDagger: {
    name: 'Bronze Dagger',
    price: 140,
        sellPrice: 70,
    stack: 1,
    description: 'A small dagger forged from bronze.',
    damage: 3,
    delay: 183,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  bronzeSword: {
    name: 'Bronze Sword',
    price: 246,
        sellPrice: 123,
    stack: 1,
    description: 'A simple bronze sword.',
    damage: 6,
    delay: 231,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  leatherVest: {
    name: 'Leather Vest',
    description: 'Basic leather body armor, provides 7 defense.',
    price: 618,
    sellPrice: 309,
    stack: 1,
    levelRequirement: 7,
    slot: 'body',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 7,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Miogique', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Tahn Posbei', zone: 'Kazham (H-9)', currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  leatherVestPlus1: {
    name: 'Leather Vest +1',
    description: 'High quality leather body armor, provides 8 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 7,
    slot: 'body',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 8,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  bronzeIngot: {
    name: 'Bronze Ingot',
    price: 120,
        sellPrice: 60,
    stack: 12,
    description: 'A bar of bronze used in crafting.',
    levelRequirement: 0
  },
  potion: {
    name: 'Potion',
    price: 892,
    sellPrice: 446,
    stack: 12,
    description: 'Restores a small amount of HP.',
    levelRequirement: 0
  },
  antidote: {
    name: 'Antidote',
    price: 309,
    sellPrice: 155,
    stack: 12,
    description: 'Cures poison.',
    levelRequirement: 0
  },
  meatJerky: {
    name: 'Meat Jerky',
    price: 120,
        sellPrice: 60,
    stack: 12,
    description: 'Dried meat that slightly restores HP.',
    levelRequirement: 0
  },
  distilledWater: {
    name: 'Distilled Water',
    price: 12,
        sellPrice: 6,
    stack: 12,
    description: 'Used in alchemy and cooking.',
    levelRequirement: 0
  },
  insectPaste: {
    name: 'Insect Paste',
    price: 36,
        sellPrice: 18,
    stack: 12,
    description: 'Popular fishing bait.',
    levelRequirement: 0
  },
  scrollCure: {
    name: 'Scroll of Cure',
    price: 66,
    sellPrice: 33,
    stack: 1,
    description: 'Teaches the white magic Cure.',
    levelRequirement: 1
  },
  bronzeShield: {
    name: 'Bronze Shield',
    price: 220,
        sellPrice: 110,
    stack: 1,
    description: 'A small bronze buckler.',
    defense: 2,
    levelRequirement: 1,
    slot: 'offHand',
    jobs: baseJobNames
  },
  leatherGloves: {
    name: 'Leather Gloves',
    description: 'Basic leather hand armor, provides 2 defense.',
    price: 331,
    sellPrice: 166,
    stack: 1,
    levelRequirement: 7,
    slot: 'hands',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 2,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Miogique', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Tahn Posbei', zone: 'Kazham (H-9)', currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  leatherGlovesPlus1: {
    name: 'Leather Gloves +1',
    description: 'High quality leather hand armor, provides 3 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 7,
    slot: 'hands',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 3,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  clothHeadband: {
    name: 'Cloth Headband',
    price: 112,
        sellPrice: 56,
    stack: 1,
    description: 'A simple cloth headband.',
    defense: 1,
    levelRequirement: 1,
    slot: 'head',
    jobs: baseJobNames
  },
  scrollFire: {
    name: 'Scroll of Fire',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'Teaches the black magic Fire.',
    levelRequirement: 1
  },
  ether: {
    name: 'Ether',
    price: 4735,
    sellPrice: 2367,
    stack: 12,
    description: 'Restores a small amount of MP.',
    levelRequirement: 0
  },
  applePie: {
    name: 'Apple Pie',
    price: 200,
        sellPrice: 100,
    stack: 12,
    description: 'A sweet pie that restores MP over time.',
    levelRequirement: 0
  },
  leatherCap: {
    name: 'Leather Cap',
    price: 150,
        sellPrice: 75,
    stack: 1,
    description: 'A basic leather cap.',
    defense: 2,
    levelRequirement: 1,
    slot: 'head',
    jobs: baseJobNames
  },
  leatherBoots: {
    name: 'Leather Boots',
    price: 176,
        sellPrice: 88,
    stack: 1,
    description: 'Sturdy leather boots.',
    defense: 3,
    levelRequirement: 1,
    slot: 'feet',
    jobs: baseJobNames
  },
  bronzeAxe: {
    name: 'Bronze Axe',
    price: 360,
        sellPrice: 180,
    stack: 1,
    description: 'A crude axe forged from bronze.',
    damage: 7,
    delay: 276,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  bronzeSpear: {
    name: 'Bronze Spear',
    price: 520,
        sellPrice: 260,
    stack: 1,
    description: 'A simple bronze spear.',
    damage: 8,
    delay: 303,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  bronzeKnife: {
    name: 'Bronze Knife',
    price: 100,
        sellPrice: 50,
    stack: 1,
    description: 'A small bronze knife.',
    damage: 2,
    delay: 186,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  willowStaff: {
    name: 'Willow Staff',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'A basic wooden staff.',
    damage: 4,
    delay: 366,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  woodenArrow: {
    name: 'Wooden Arrow',
    price: 4,
    sellPrice: 2,
    stack: 99,
    description: 'Simple arrows made of wood.',
    levelRequirement: 0,
    slot: 'ammo'
  },
  bambooFishingRod: {
    name: 'Bamboo Fishing Rod',
    price: 500,
    sellPrice: 250,
    stack: 1,
    description: 'A basic bamboo fishing rod.',
    levelRequirement: 0,
    slot: 'ranged'
  },
  pickaxe: {
    name: 'Pickaxe',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'Used for mining ore from deposits.',
    levelRequirement: 0
  },
  copperOre: {
    name: 'Copper Ore',
    price: 12,
    sellPrice: 6,
    stack: 12,
    description: 'Ore used in smithing.',
    levelRequirement: 0
  },
  copperIngot: {
    name: 'Copper Ingot',
    price: 150,
        sellPrice: 75,
    stack: 12,
    description: 'A bar of refined copper.',
    levelRequirement: 0
  },
  cottonThread: {
    name: 'Cotton Thread',
    price: 60,
        sellPrice: 30,
    stack: 12,
    description: 'Thread spun from cotton.',
    levelRequirement: 0
  },
  boneChip: {
    name: 'Bone Chip',
    price: 20,
        sellPrice: 10,
    stack: 12,
    description: 'Small fragments of bone.',
    levelRequirement: 0
  },
  arrowwoodLog: {
    name: 'Arrowwood Log',
    price: 100,
        sellPrice: 50,
    stack: 12,
    description: 'A log of arrowwood.',
    levelRequirement: 0
  },
  honey: {
    name: 'Honey',
    price: 40,
        sellPrice: 20,
    stack: 12,
    description: 'Sweet honey used in cooking.',
    levelRequirement: 0
  },
  mythrilSallet: {
    name: 'Mythril Sallet',
    price: 51152,
        sellPrice: 25576,
    stack: 1,
    description: 'Heavy headgear forged of mythril.',
    defense: 15,
    levelRequirement: 20,
    slot: 'head',
    jobs: baseJobNames
  },
  breastplate: {
    name: 'Breastplate',
    price: 44226,
        sellPrice: 22113,
    stack: 1,
    description: 'A sturdy metal breastplate.',
    defense: 27,
    levelRequirement: 18,
    slot: 'body',
    jobs: baseJobNames
  },
  gauntlets: {
    name: 'Gauntlets',
    price: 23328,
        sellPrice: 11664,
    stack: 1,
    description: 'Heavy metal gauntlets.',
    defense: 12,
    levelRequirement: 16,
    slot: 'hands',
    jobs: baseJobNames
  },
  brassMask: {
    name: 'Brass Mask',
    price: 11520,
        sellPrice: 5760,
    stack: 1,
    description: 'Face armor forged from brass.',
    defense: 8,
    levelRequirement: 14,
    slot: 'head',
    jobs: baseJobNames
  },
  sallet: {
    name: 'Sallet',
    price: 28674,
        sellPrice: 14337,
    stack: 1,
    description: 'A sturdy metal helm.',
    defense: 12,
    levelRequirement: 16,
    slot: 'head',
    jobs: baseJobNames
  },
  brassScaleMail: {
    name: 'Brass Scale Mail',
    price: 17539,
        sellPrice: 8769,
    stack: 1,
    description: 'Scale armor made of brass.',
    defense: 17,
    levelRequirement: 14,
    slot: 'body',
    jobs: baseJobNames
  },
  brassFingerGauntlets: {
    name: 'Brass Finger Gauntlets',
    price: 9273,
        sellPrice: 4636,
    stack: 1,
    description: 'Fingered gauntlets of brass.',
    defense: 8,
    levelRequirement: 14,
    slot: 'hands',
    jobs: baseJobNames
  },
  bronzeCap: {
    name: 'Bronze Cap',
    price: 154,
        sellPrice: 77,
    stack: 1,
    description: 'Basic head armor crafted from bronze, part of the Bronze Armor Set.',
    defense: 2,
    levelRequirement: 1,
    slot: 'head',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    vendors: [
      { npc: 'Miogique', zone: 'Southern San d’Oria (K-8)', price: 154, currency: 'Gil' },
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', price: 154, currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', price: 154, currency: 'Gil' },
      { npc: 'Orez-Ebrez', zone: 'Windurst Waters South (H-7)', price: 154, currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', price: 154, currency: 'Gil' },
      { npc: 'Rolandienne', zone: 'Southern San d’Oria (G-10)', price: 50, currency: 'Sparks' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', price: 50, currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat', zone: 'Windurst Woods (J-10)', price: 50, currency: 'Sparks' },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)', price: 50, currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },
  bronzeCapPlus1: {
    name: 'Bronze Cap +1',
    description: 'Reinforced bronze head armor with improved plating.',
    stack: 1,
    levelRequirement: 1,
    slot: 'head',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 3,
    keyItem: false,
    sellable: false
  },
  faceguard: {
    name: 'Faceguard',
    description: 'Cloth head armor, part of the Scale Armor Set.',
    price: 1334,
    sellPrice: 667,
    stack: 1,
    levelRequirement: 10,
    slot: 'head',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 5,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Victoire',       zone: 'Southern San d’Oria (K-8)', currency: 'Gil', price: 1334 },
      { npc: 'Brunhilde',      zone: 'Bastok Markets (F-10)',      currency: 'Gil', price: 1334 },
      { npc: 'Drozga',         zone: 'Port Windurst (H-7)',        currency: 'Gil', price: 1334 },
      { npc: 'Rolandienne',    zone: 'Southern San d’Oria (G-10)', currency: 'Sparks', price: 60 },
      { npc: 'Isakoth',        zone: 'Bastok Markets (E-11)',      currency: 'Sparks', price: 60 },
      { npc: 'Fhelm Jobeizat', zone: 'Windurst Woods (J-10)',      currency: 'Sparks', price: 60 },
      { npc: 'Eternal Flame',  zone: 'Western Adoulin (H-11)',     currency: 'Sparks', price: 60 }
    ],
    keyItem: false,
    sellable: true
  },

  faceguardPlus1: {
    name: 'Faceguard +1',
    description: 'High quality version of the Faceguard, reinforced for better protection.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 10,
    slot: 'head',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 6,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  bronzeHarness: {
    name: 'Bronze Harness',
    price: 235,
        sellPrice: 117,
    stack: 1,
    description: 'Basic body armor crafted from bronze, part of the Bronze Armor Set.',
    defense: 4,
    levelRequirement: 1,
    slot: 'body',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    vendors: [
      { npc: 'Miogique', zone: 'Southern San d’Oria (K-8)', price: 235, currency: 'Gil' },
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', price: 235, currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', price: 235, currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', price: 235, currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', price: 235, currency: 'Gil' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', price: 50, currency: 'Sparks' },
      { npc: 'Rolandienne', zone: 'Southern San d’Oria (G-10)', price: 50, currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat', zone: 'Windurst Woods (J-10)', price: 50, currency: 'Sparks' },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)', price: 50, currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },
  bronzeHarnessPlus1: {
    name: 'Bronze Harness +1',
    description: 'Reinforced bronze body armor with improved plating.',
    stack: 1,
    levelRequirement: 1,
    slot: 'body',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 5,
    keyItem: false,
    sellable: false
  },
  scaleMail: {
    name: 'Scale Mail',
    description: 'Body armor crafted from bronze scales, part of the Scale Armor Set.',
    price: 2051,
    sellPrice: 1025,
    stack: 1,
    levelRequirement: 10,
    slot: 'body',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 11,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Victoire',      zone: 'Southern San d’Oria (K-8)', currency: 'Gil', price: 2051 },
      { npc: 'Brunhilde',     zone: 'Bastok Markets (F-10)',      currency: 'Gil', price: 2051 },
      { npc: 'Drozga',        zone: 'Port Windurst (H-7)',        currency: 'Gil', price: 2051 },
      { npc: 'Rolandienne',   zone: 'Southern San d’Oria (G-10)', currency: 'Sparks', price: 60 },
      { npc: 'Isakoth',       zone: 'Bastok Markets (E-11)',      currency: 'Sparks', price: 60 },
      { npc: 'Fhelm Jobeizat',zone: 'Windurst Woods (J-10)',      currency: 'Sparks', price: 60 },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)',     currency: 'Sparks', price: 60 }
    ],
    keyItem: false,
    sellable: true
  },

  solidMail: {
    name: 'Solid Mail',
    description: 'High quality body armor, reinforced version of Scale Mail.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 10,
    slot: 'body',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 12,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  bronzeMittens: {
    name: 'Bronze Mittens',
    price: 128,
        sellPrice: 64,
    stack: 1,
    description: 'Basic hand armor crafted from bronze, part of the Bronze Armor Set.',
    defense: 1,
    levelRequirement: 1,
    slot: 'hands',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    vendors: [
      { npc: 'Miogique', zone: 'Southern San d’Oria (K-8)', price: 128, currency: 'Gil' },
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', price: 128, currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', price: 128, currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', price: 128, currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', price: 128, currency: 'Gil' },
      { npc: 'Rolandienne', zone: 'Southern San d’Oria (G-10)', price: 50, currency: 'Sparks' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', price: 50, currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat', zone: 'Windurst Woods (J-10)', price: 50, currency: 'Sparks' },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)', price: 50, currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },
  bronzeMittensPlus1: {
    name: 'Bronze Mittens +1',
    description: 'Reinforced bronze hand armor with improved plating.',
    stack: 1,
    levelRequirement: 1,
    slot: 'hands',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 2,
    keyItem: false,
    sellable: false
  },
  scaleFingerGauntlets: {
    name: 'Scale Finger Gauntlets',
    description: 'Hand armor crafted from bronze scales, part of the Scale Armor Set.',
    price: 1094,
    sellPrice: 547,
    stack: 1,
    levelRequirement: 10,
    slot: 'hands',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 3,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Victoire',      zone: 'Southern San d’Oria (K-8)', currency: 'Gil', price: 1094 },
      { npc: 'Brunhilde',     zone: 'Bastok Markets (F-10)',      currency: 'Gil', price: 1094 },
      { npc: 'Drozga',        zone: 'Port Windurst (H-7)',        currency: 'Gil', price: 1094 },
      { npc: 'Rolandienne',   zone: 'Southern San d’Oria (G-10)', currency: 'Sparks', price: 60 },
      { npc: 'Isakoth',       zone: 'Bastok Markets (E-11)',      currency: 'Sparks', price: 60 },
      { npc: 'Fhelm Jobeizat',zone: 'Windurst Woods (J-10)',      currency: 'Sparks', price: 60 },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)',     currency: 'Sparks', price: 60 }
    ],
    keyItem: false,
    sellable: true
  },

  solidFingerGauntlets: {
    name: 'Solid Finger Gauntlets',
    description: 'High quality hand armor, reinforced version of Scale Finger Gauntlets.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 10,
    slot: 'hands',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 4,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  bronzeKnuckles: {
    name: 'Bronze Knuckles',
    price: 224,
        sellPrice: 112,
    stack: 1,
    description: 'Bronze fist weapons.',
    damage: 4,
    delay: 96,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  brassKnuckles: {
    name: 'Brass Knuckles',
    price: 828,
        sellPrice: 414,
    stack: 1,
    description: 'Brass fist weapons.',
    damage: 7,
    delay: 96,
    levelRequirement: 7,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  metalKnuckles: {
    name: 'Metal Knuckles',
    price: 4818,
        sellPrice: 2409,
    stack: 1,
    description: 'Heavy metal knuckles.',
    damage: 10,
    delay: 96,
    levelRequirement: 18,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  bronzeHammer: {
    name: 'Bronze Hammer',
    price: 312,
        sellPrice: 156,
    stack: 1,
    description: 'A basic bronze hammer.',
    damage: 5,
    delay: 288,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  brassHammer: {
    name: 'Brass Hammer',
    price: 2129,
        sellPrice: 1064,
    stack: 1,
    description: 'A sturdy brass hammer.',
    damage: 11,
    delay: 288,
    levelRequirement: 13,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  warhammer: {
    name: 'Warhammer',
    price: 6033,
        sellPrice: 3016,
    stack: 1,
    description: 'A heavy warhammer.',
    damage: 18,
    delay: 312,
    levelRequirement: 20,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  mapleWand: {
    name: 'Maple Wand',
    price: 47,
        sellPrice: 23,
    stack: 1,
    description: 'A simple wand made of maple.',
    damage: 3,
    delay: 240,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  ironArrow: {
    name: 'Iron Arrow',
    price: 8,
    sellPrice: 4,
    stack: 99,
    description: 'Sturdy iron arrows.',
    levelRequirement: 1,
    slot: 'ammo'
  },
  silverArrow: {
    name: 'Silver Arrow',
    price: 17,
    sellPrice: 8,
    stack: 99,
    description: 'High-quality silver arrows.',
    levelRequirement: 1,
    slot: 'ammo'
  },
  crossbowBolt: {
    name: 'Crossbow Bolt',
    price: 6,
    sellPrice: 3,
    stack: 99,
    description: 'Bolts used with crossbows.',
    levelRequirement: 1,
    slot: 'ammo'
  },
  lightCrossbow: {
    name: 'Light Crossbow',
    price: 176,
    sellPrice: 88,
    stack: 1,
    description: 'A lightweight crossbow.',
    damage: 10,
    delay: 288,
    levelRequirement: 1,
    slot: 'ranged',
    jobs: baseJobNames
  },
  crossbow: {
    name: 'Crossbow',
    price: 2308,
    sellPrice: 1154,
    stack: 1,
    description: 'A standard crossbow.',
    damage: 15,
    delay: 300,
    levelRequirement: 14,
    slot: 'ranged',
    jobs: baseJobNames
  },
  zamburak: {
    name: 'Zamburak',
    price: 14158,
    sellPrice: 7079,
    stack: 1,
    description: 'A powerful crossbow for seasoned fighters.',
    damage: 19,
    delay: 288,
    levelRequirement: 30,
    slot: 'ranged',
    jobs: baseJobNames
  },
  scrollDarkThrenody: {
    name: 'Scroll of Dark Threnody',
    price: 212,
    sellPrice: 106,
    stack: 1,
    description: 'Teaches the song Dark Threnody.',
    levelRequirement: 15
  },
  scrollIceThrenody: {
    name: 'Scroll of Ice Threnody',
    price: 1066,
    sellPrice: 533,
    stack: 1,
    description: 'Teaches the song Ice Threnody.',
    levelRequirement: 45
  },
  scrollFoeRequiemI: {
    name: 'Scroll of Foe Requiem I',
    price: 69,
    sellPrice: 34,
    stack: 1,
    description: 'Teaches Foe Requiem I.',
    levelRequirement: 7
  },
  scrollFoeRequiemII: {
    name: 'Scroll of Foe Requiem II',
    price: 475,
    sellPrice: 238,
    stack: 1,
    description: 'Teaches Foe Requiem II.',
    levelRequirement: 17
  },
  scrollFoeRequiemIII: {
    name: 'Scroll of Foe Requiem III',
    price: 4268,
    sellPrice: 2134,
    stack: 1,
    description: 'Teaches Foe Requiem III.',
    levelRequirement: 37
  },
  scrollFoeRequiemIV: {
    name: 'Scroll of Foe Requiem IV',
    price: 7449,
    sellPrice: 3724,
    stack: 1,
    description: 'Teaches Foe Requiem IV.',
    levelRequirement: 47
  },
  scrollArmysPaeon: {
    name: "Scroll of Army's Paeon",
    price: 40,
    sellPrice: 20,
    stack: 1,
    description: "Teaches Army's Paeon.",
    levelRequirement: 5
  },
  scrollArmysPaeonII: {
    name: "Scroll of Army's Paeon II",
    price: 346,
    sellPrice: 173,
    stack: 1,
    description: "Teaches Army's Paeon II.",
    levelRequirement: 15
  },
  scrollArmysPaeonIII: {
    name: "Scroll of Army's Paeon III",
    price: 3492,
    sellPrice: 1746,
    stack: 1,
    description: "Teaches Army's Paeon III.",
    levelRequirement: 35
  },
  scrollArmysPaeonIV: {
    name: "Scroll of Army's Paeon IV",
    price: 6402,
    sellPrice: 3201,
    stack: 1,
    description: "Teaches Army's Paeon IV.",
    levelRequirement: 45
  },
  scrollValorMinuet: {
    name: 'Scroll of Valor Minuet',
    price: 23,
    sellPrice: 11,
    stack: 1,
    description: 'Teaches Valor Minuet.',
    levelRequirement: 3
  },
  scrollValorMinuetII: {
    name: 'Scroll of Valor Minuet II',
    price: 1187,
    sellPrice: 594,
    stack: 1,
    description: 'Teaches Valor Minuet II.',
    levelRequirement: 23
  },
  scrollValorMinuetIII: {
    name: 'Scroll of Valor Minuet III',
    price: 5975,
    sellPrice: 2987,
    stack: 1,
    description: 'Teaches Valor Minuet III.',
    levelRequirement: 43
  },
  scrollCureII: {
    name: 'Scroll of Cure II',
    price: 631,
    sellPrice: 315,
    stack: 1,
    description: 'Teaches the white magic Cure II.',
    levelRequirement: 11
  },
  scrollCuraga: {
    name: 'Scroll of Curaga',
    price: 1469,
    sellPrice: 734,
    stack: 1,
    description: 'Teaches the white magic Curaga.',
    levelRequirement: 43
  },
  scrollPoisona: {
    name: 'Scroll of Poisona',
    price: 194,
    sellPrice: 97,
    stack: 1,
    description: 'Teaches the white magic Poisona.',
    levelRequirement: 15
  },
  scrollParalyna: {
    name: 'Scroll of Paralyna',
    price: 349,
    sellPrice: 174,
    stack: 1,
    description: 'Teaches the white magic Paralyna.',
    levelRequirement: 21
  },
  scrollBlindna: {
    name: 'Scroll of Blindna',
    price: 1067,
    sellPrice: 534,
    stack: 1,
    description: 'Teaches the white magic Blindna.',
    levelRequirement: 47
  },
  scrollDia: {
    name: 'Scroll of Dia',
    price: 89,
    sellPrice: 44,
    stack: 1,
    description: 'Teaches the white magic Dia.',
    levelRequirement: 27
  },
  scrollDiaga: {
    name: 'Scroll of Diaga',
    price: 1256,
    sellPrice: 628,
    stack: 1,
    description: 'Teaches the white magic Diaga.',
    levelRequirement: 73
  },
  scrollBanish: {
    name: 'Scroll of Banish',
    price: 151,
    sellPrice: 75,
    stack: 1,
    description: 'Teaches Banish.',
    levelRequirement: 1
  },
  scrollBanishga: {
    name: 'Scroll of Banishga',
    price: 1280,
    sellPrice: 640,
    stack: 1,
    description: 'Teaches Banishga.',
    levelRequirement: 35
  },
  scrollBlink: {
    name: 'Scroll of Blink',
    price: 2260,
    sellPrice: 1130,
    stack: 1,
    description: 'Teaches Blink.',
    levelRequirement: 15
  },
  scrollProtect: {
    name: 'Scroll of Protect',
    price: 236,
    sellPrice: 118,
    stack: 1,
    description: 'Teaches Protect.',
    levelRequirement: 20
  },
  scrollShell: {
    name: 'Scroll of Shell',
    price: 1707,
    sellPrice: 854,
    stack: 1,
    description: 'Teaches Shell.',
    levelRequirement: 35
  },
  scrollStoneskin: {
    name: 'Scroll of Stoneskin',
    price: 7572,
    sellPrice: 3786,
    stack: 1,
    description: 'Teaches Stoneskin.',
    levelRequirement: 49
  },
  scrollSlow: {
    name: 'Scroll of Slow',
    price: 902,
    sellPrice: 451,
    stack: 1,
    description: 'Teaches Slow.',
    levelRequirement: 13
  },
  echoDrops: {
    name: 'Echo Drops',
    price: 784,
    sellPrice: 392,
    stack: 12,
    description: 'Cures silence.',
    levelRequirement: 0
  },
  eyeDrops: {
    name: 'Eye Drops',
    price: 2543,
    sellPrice: 1271,
    stack: 12,
    description: 'Cures blindness.',
    levelRequirement: 0
  },
  tourmaline: {
    name: 'Tourmaline',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A pink gemstone.',
    levelRequirement: 0
  },
  sardonyx: {
    name: 'Sardonyx',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A striped gemstone.',
    levelRequirement: 0
  },
  amethyst: {
    name: 'Amethyst',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A purple gemstone.',
    levelRequirement: 0
  },
  amber: {
    name: 'Amber',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A golden gemstone.',
    levelRequirement: 0
  },
  lapisLazuli: {
    name: 'Lapis Lazuli',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A blue gemstone.',
    levelRequirement: 0
  },
  clearTopaz: {
    name: 'Clear Topaz',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A transparent gem.',
    levelRequirement: 0
  },
  onyx: {
    name: 'Onyx',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A jet-black gem.',
    levelRequirement: 0
  },
  lightOpal: {
    name: 'Light Opal',
    price: 1863,
    sellPrice: 932,
    stack: 1,
    description: 'A brilliant opal.',
    levelRequirement: 0
  },
  copperRing: {
    name: 'Copper Ring',
    price: 68,
        sellPrice: 34,
    stack: 1,
    description: 'A simple copper ring.',
    levelRequirement: 1,
    slot: 'leftRing',
    jobs: jobNames
  },
  brassRing: {
    name: 'Brass Ring',
    price: 194,
        sellPrice: 97,
    stack: 1,
    description: 'A ring forged from brass.',
    defense: 1,
    levelRequirement: 7,
    slot: 'leftRing',
    jobs: jobNames
  },
  silverRing: {
    name: 'Silver Ring',
    price: 1212,
        sellPrice: 606,
    stack: 1,
    description: 'A polished silver band.',
    defense: 1,
    levelRequirement: 14,
    slot: 'leftRing',
    jobs: jobNames
  },
  silverEarring: {
    name: 'Silver Earring',
    price: 1212,
        sellPrice: 606,
    stack: 1,
    description: 'A simple silver earring.',
    defense: 1,
    levelRequirement: 14,
    slot: 'leftEar',
    jobs: jobNames
  },
  bastokMap: {
    name: 'Map of Bastok',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'A detailed map of Bastok and surrounding areas.',
    levelRequirement: 0
  },
  sandoriaMap: {
    name: "Map of San d'Oria",
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: "A detailed map of San d'Oria and surrounding areas.",
    levelRequirement: 0
  },
  windurstMap: {
    name: 'Map of Windurst',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'A detailed map of Windurst and surrounding areas.',
    levelRequirement: 0
  },
  jeunoMap: {
    name: 'Map of the Jeuno area',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of the Jeuno area.',
    levelRequirement: 0
  },
  valkurmMap: {
    name: 'Map of Valkurm Dunes',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'A map guiding travelers through the Valkurm Dunes.',
    levelRequirement: 0
  },
  ordellesCavesMap: {
    name: 'Map of Ordelle\'s Caves',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of ordelle\'s caves.',
    levelRequirement: 0
  },
  ghelsbaMap: {
    name: 'Map of Ghelsba',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of ghelsba.',
    levelRequirement: 0
  },
  zeruhnMinesMap: {
    name: 'Map of the Zeruhn Mines',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'A detailed map of the zeruhn mines.',
    levelRequirement: 0
  },
  palboroughMinesMap: {
    name: 'Map of the Palborough Mines',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of the palborough mines.',
    levelRequirement: 0
  },
  beadeauxMap: {
    name: 'Map of Beadeaux',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of beadeaux.',
    levelRequirement: 0
  },
  giddeusMap: {
    name: 'Map of Giddeus',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of giddeus.',
    levelRequirement: 0
  },
  castleOztrojaMap: {
    name: 'Map of Castle Oztroja',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of castle oztroja.',
    levelRequirement: 0
  },
  mazeOfShakhramiMap: {
    name: 'Map of the Maze of Shakhrami',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of the maze of shakhrami.',
    levelRequirement: 0
  },
  liTelorMap: {
    name: 'Map of the Li\'Telor region',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the li\'telor region.',
    levelRequirement: 0
  },
  bibikiBayMap: {
    name: 'Map of Bibiki Bay',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of bibiki bay.',
    levelRequirement: 0
  },
  qufimIslandMap: {
    name: 'Map of Qufim Island',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of qufim island.',
    levelRequirement: 0
  },
  elshimoMap: {
    name: 'Map of the Elshimo regions',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the elshimo regions.',
    levelRequirement: 0
  },
  eldiemeNecropolisMap: {
    name: 'Map of the Eldieme Necropolis',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the eldieme necropolis.',
    levelRequirement: 0
  },
  garlaigeCitadelMap: {
    name: 'Map of the Garlaige Citadel',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the garlaige citadel.',
    levelRequirement: 0
  },
  northlandsMap: {
    name: 'Map of the Northlands area',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the northlands area.',
    levelRequirement: 0
  },
  kingRanperresTombMap: {
    name: 'Map of King Ranperre\'s Tomb',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of king ranperre\'s tomb.',
    levelRequirement: 0
  },
  dangrufWadiMap: {
    name: 'Map of the Dangruf Wadi',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of the dangruf wadi.',
    levelRequirement: 0
  },
  horutotoRuinsMap: {
    name: 'Map of the Horutoto Ruins',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of the horutoto ruins.',
    levelRequirement: 0
  },
  bostaunieuxOublietteMap: {
    name: 'Map of Bostaunieux Oubliette',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of bostaunieux oubliette.',
    levelRequirement: 0
  },
  toraimaraiCanalMap: {
    name: 'Map of the Toraimarai Canal',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the toraimarai canal.',
    levelRequirement: 0
  },
  gusgenMinesMap: {
    name: 'Map of the Gusgen Mines',
    price: 600,
        sellPrice: 300,
    stack: 1,
    description: 'A detailed map of the gusgen mines.',
    levelRequirement: 0
  },
  crawlersNestMap: {
    name: 'Map of the Crawlers\' Nest',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the crawlers\' nest.',
    levelRequirement: 0
  },
  ranguemontPassMap: {
    name: 'Map of the Ranguemont Pass',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the ranguemont pass.',
    levelRequirement: 0
  },
  delfkuttsTowerMap: {
    name: 'Map of Delkfutt\'s Tower',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of delkfutt\'s tower.',
    levelRequirement: 0
  },
  feiyinMap: {
    name: "Map of Fei'Yin",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of fei'yin.",
    levelRequirement: 0
  },
  castleZvahlMap: {
    name: 'Map of Castle Zvahl',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of castle zvahl.',
    levelRequirement: 0
  },
  kuzotzMap: {
    name: 'Map of the Kuzotz region',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the kuzotz region.',
    levelRequirement: 0
  },
  ruaunGardensMap: {
    name: "Map of the Ru'Aun Gardens",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of the ru'aun gardens.",
    levelRequirement: 0
  },
  norgMap: {
    name: 'Map of Norg',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of norg.',
    levelRequirement: 0
  },
  templeOfUggalepihMap: {
    name: 'Map of Temple of Uggalepih',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of temple of uggalepih.',
    levelRequirement: 0
  },
  denOfRancorMap: {
    name: 'Map of the Den of Rancor',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the den of rancor.',
    levelRequirement: 0
  },
  korrolokaTunnelMap: {
    name: 'Map of the Korroloka Tunnel',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the korroloka tunnel.',
    levelRequirement: 0
  },
  kuftalTunnelMap: {
    name: 'Map of the Kuftal Tunnel',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the kuftal tunnel.',
    levelRequirement: 0
  },
  boyahdaTreeMap: {
    name: 'Map of the Boyahda Tree',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the boyahda tree.',
    levelRequirement: 0
  },
  velugannonPalaceMap: {
    name: "Map of Ve'Lugannon Palace",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of ve'lugannon palace.",
    levelRequirement: 0
  },
  ifritsCauldronMap: {
    name: "Map of Ifrit's Cauldron",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of ifrit's cauldron.",
    levelRequirement: 0
  },
  quicksandCavesMap: {
    name: 'Map of the Quicksand Caves',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the quicksand caves.',
    levelRequirement: 0
  },
  seaSerpentGrottoMap: {
    name: 'Map of Sea Serpent Grotto',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of sea serpent grotto.',
    levelRequirement: 0
  },
  vollbowRegionMap: {
    name: 'Map of the Vollbow region',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the vollbow region.',
    levelRequirement: 0
  },
  labyrinthOfOnzozoMap: {
    name: 'Map of the Labyrinth of Onzozo',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the labyrinth of onzozo.',
    levelRequirement: 0
  },
  uleguerandRangeMap: {
    name: 'Map of the Uleguerand Range',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the uleguerand range.',
    levelRequirement: 0
  },
  attohwaChasmMap: {
    name: 'Map of the Attohwa Chasm',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the attohwa chasm.',
    levelRequirement: 0
  },
  psoxjaMap: {
    name: "Map of Pso'Xja",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of pso'xja.",
    levelRequirement: 0
  },
  oldtonMovalpolosMap: {
    name: 'Map of Oldton Movalpolos',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of oldton movalpolos.',
    levelRequirement: 0
  },
  newtonMovalpolosMap: {
    name: 'Map of Newton Movalpolos',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of newton movalpolos.',
    levelRequirement: 0
  },
  tavnaziaMap: {
    name: 'Map of Tavnazia',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of tavnazia.',
    levelRequirement: 0
  },
  aqueductsMap: {
    name: 'Map of the Aqueducts',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the aqueducts.',
    levelRequirement: 0
  },
  sacrariumMap: {
    name: 'Map of the Sacrarium',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of the sacrarium.',
    levelRequirement: 0
  },
  capeRiverneMap: {
    name: 'Map of Cape Riverne',
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: 'A detailed map of cape riverne.',
    levelRequirement: 0
  },
  altaieuMap: {
    name: "Map of Al'Taieu",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of al'taieu.",
    levelRequirement: 0
  },
  huxzoiMap: {
    name: "Map of Hu'Xzoi",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of hu'xzoi.",
    levelRequirement: 0
  },
  ruHmetMap: {
    name: "Map of Ru'Hmet",
    price: 3000,
        sellPrice: 1500,
    stack: 1,
    description: "A detailed map of ru'hmet.",
    levelRequirement: 0
  },
  ashLog: {
    name: 'Ash Log',
    price: 88,
        sellPrice: 44,
    stack: 99,
    description: 'A log cut from an ash tree.',
    levelRequirement: 0
  },
  chestnutLog: {
    name: 'Chestnut Log',
    price: 2599,
        sellPrice: 1299,
    stack: 99,
    description: 'Wood from a chestnut tree.',
    levelRequirement: 0
  },
  oakLog: {
    name: 'Oak Log',
    price: 5814,
        sellPrice: 2907,
    stack: 99,
    description: 'A sturdy oak log.',
    levelRequirement: 0
  },
  ironOre: {
    name: 'Iron Ore',
    price: 828,
        sellPrice: 414,
    stack: 99,
    description: 'Ore containing iron.',
    levelRequirement: 0
  },
  mythrilOre: {
    name: 'Mythril Ore',
    price: 1840,
        sellPrice: 920,
    stack: 99,
    description: 'Ore containing mythril.',
    levelRequirement: 0
  },
  mokoGrass: {
    name: 'Moko Grass',
    price: 18,
        sellPrice: 9,
    stack: 99,
    description: 'A clump of moko grass used in clothcraft.',
    levelRequirement: 0
  },
  birdEgg: {
    name: 'Bird Egg',
    price: 51,
        sellPrice: 25,
    stack: 12,
    description: 'A fresh bird egg.',
    levelRequirement: 0
  },
  flaxFlower: {
    name: 'Flax Flower',
    price: 230,
        sellPrice: 115,
    stack: 99,
    description: 'A delicate flax blossom.',
    levelRequirement: 0
  },
  kaiserinCosmetics: {
    name: 'Kaiserin Cosmetics',
    price: 1840,
        sellPrice: 920,
    stack: 99,
    description: 'Cosmetics from the Empire of Aht Urhgan.',
    levelRequirement: 0
  },
  blackChip: {
    name: 'Black Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A black strange apparatus chip.',
    levelRequirement: 0
  },
  blueChip: {
    name: 'Blue Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A blue strange apparatus chip.',
    levelRequirement: 0
  },
  clearChip: {
    name: 'Clear Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A clear strange apparatus chip.',
    levelRequirement: 0
  },
  greenChip: {
    name: 'Green Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A green strange apparatus chip.',
    levelRequirement: 0
  },
  purpleChip: {
    name: 'Purple Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A purple strange apparatus chip.',
    levelRequirement: 0
  },
  redChip: {
    name: 'Red Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A red strange apparatus chip.',
    levelRequirement: 0
  },
  whiteChip: {
    name: 'White Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A white strange apparatus chip.',
    levelRequirement: 0
  },
  yellowChip: {
    name: 'Yellow Chip',
    price: 21000,
        sellPrice: 10500,
    stack: 1,
    description: 'A yellow strange apparatus chip.',
    levelRequirement: 0
  },
  linkshell: {
    name: 'Linkshell',
    price: 6000,
        sellPrice: 3000,
    stack: 1,
    description: 'Creates a social linkshell.',
    levelRequirement: 0
  },
  pendantCompass: {
    name: 'Pendant Compass',
    description: 'Small compass on a necklace, shows city orientation.',
    price: 375,
    sellPrice: 187,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    abilities: ['Show compass in HUD'],
    vendors: [
      { npc: 'Ilita', zone: 'Port Bastok (E-7)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },
  cottonHachimaki: {
    name: 'Cotton Hachimaki',
    description: 'Basic cloth headband of the Cotton Garb set.',
    price: 4493,
    sellPrice: 2246,
    stack: 1,
    levelRequirement: 18,
    slot: 'head',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 7,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',     currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',         currency: 'Gil' },
      { npc: 'Guruna-Magurama',    zone: 'Port Windurst (H-9)',       currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',         currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',             currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  cottonHachimakiPlus1: {
    name: 'Cotton Hachimaki +1',
    description: 'High quality cloth headband, reinforced version of Cotton Hachimaki.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 18,
    slot: 'head',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 8,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  cottonDogi: {
    name: 'Cotton Dogi',
    description: 'Basic cloth tunic of the Cotton Garb set.',
    price: 6771,
    sellPrice: 3385,
    stack: 1,
    levelRequirement: 18,
    slot: 'body',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 14,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',     currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',         currency: 'Gil' },
      { npc: 'Guruna-Magurama',    zone: 'Port Windurst (H-9)',       currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',         currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',             currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  cottonDogiPlus1: {
    name: 'Cotton Dogi +1',
    description: 'High quality cloth tunic, reinforced version of Cotton Dogi.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 18,
    slot: 'body',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 15,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  cottonTekko: {
    name: 'Cotton Tekko',
    description: 'Basic cloth hand wraps of the Cotton Garb set.',
    price: 3726,
    sellPrice: 1863,
    stack: 1,
    levelRequirement: 18,
    slot: 'hands',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 5,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',     currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',         currency: 'Gil' },
      { npc: 'Guruna-Magurama',    zone: 'Port Windurst (H-9)',       currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',         currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',             currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  cottonTekkoPlus1: {
    name: 'Cotton Tekko +1',
    description: 'High quality cloth hand wraps, reinforced version of Cotton Tekko.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 18,
    slot: 'hands',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 6,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  cottonSitabaki: {
    name: 'Cotton Sitabaki',
    description: 'Basic cloth leg wraps of the Cotton Garb set.',
    price: 5426,
    sellPrice: 2713,
    stack: 1,
    levelRequirement: 18,
    slot: 'legs',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 10,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',     currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',         currency: 'Gil' },
      { npc: 'Guruna-Magurama',    zone: 'Port Windurst (H-9)',       currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',         currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',             currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  cottonSitabakiPlus1: {
    name: 'Cotton Sitabaki +1',
    description: 'High quality cloth leg wraps, reinforced version of Cotton Sitabaki.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 18,
    slot: 'legs',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 11,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  cottonKyahan: {
    name: 'Cotton Kyahan',
    description: 'Basic cloth ankle wraps of the Cotton Garb set.',
    price: 3472,
    sellPrice: 1736,
    stack: 1,
    levelRequirement: 18,
    slot: 'feet',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 4,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',     currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',         currency: 'Gil' },
      { npc: 'Guruna-Magurama',    zone: 'Port Windurst (H-9)',       currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',         currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',             currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  cottonKyahanPlus1: {
    name: 'Cotton Kyahan +1',
    description: 'High quality cloth ankle wraps, reinforced version of Cotton Kyahan.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 18,
    slot: 'feet',
    jobs: ['Monk', 'Samurai', 'Ninja'],
    defense: 5,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  silverObi: {
    name: 'Silver Obi',
    price: 3825,
        sellPrice: 1912,
    stack: 99,
    description: 'A belt adorned with silver.',
    defense: 1,
    levelRequirement: 14,
    slot: 'waist',
    jobs: baseJobNames
  },
  hachimaki: {
    name: 'Hachimaki',
    description: 'Cloth headband of the Far East martial tradition, part of the Kenpogi Set.',
    price: 833,
    sellPrice: 416,
    stack: 1,
    levelRequirement: 8,
    slot: 'head',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 4,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',   currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',       currency: 'Gil' },
      { npc: 'Silver Owl',         zone: 'Port Bastok (F-6)',       currency: 'Gil' },
      { npc: 'Ryan',               zone: 'Port Windurst (H-7)',     currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',       currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',           currency: 'Gil' },
      { npc: 'Rolandienne',        zone: 'Southern San d’Oria (G-10)', currency: 'Sparks' },
      { npc: 'Isakoth',            zone: 'Bastok Markets (E-11)',   currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat',     zone: 'Windurst Woods (J-10)',   currency: 'Sparks' },
      { npc: 'Eternal Flame',      zone: 'Western Adoulin (H-11)',  currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  hachimakiPlus1: {
    name: 'Hachimaki +1',
    description: 'Reinforced cloth headband, high quality version of Hachimaki.',
    stack: 1,
    levelRequirement: 8,
    slot: 'head',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 5,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  kenpogi: {
    name: 'Kenpogi',
    description: 'Cloth body armor of the Far East martial tradition, part of the Kenpogi Set.',
    price: 833,
    sellPrice: 416,
    stack: 1,
    levelRequirement: 8,
    slot: 'body',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 8,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',   currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',       currency: 'Gil' },
      { npc: 'Silver Owl',         zone: 'Port Bastok (F-6)',       currency: 'Gil' },
      { npc: 'Ryan',               zone: 'Port Windurst (H-7)',     currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',       currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',           currency: 'Gil' },
      { npc: 'Rolandienne',        zone: 'Southern San d’Oria (G-10)', currency: 'Sparks' },
      { npc: 'Isakoth',            zone: 'Bastok Markets (E-11)',   currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat',     zone: 'Windurst Woods (J-10)',   currency: 'Sparks' },
      { npc: 'Eternal Flame',      zone: 'Western Adoulin (H-11)',  currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  kenpogiPlus1: {
    name: 'Kenpogi +1',
    description: 'Reinforced cloth body armor, high quality version of Kenpogi.',
    stack: 1,
    levelRequirement: 8,
    slot: 'body',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 9,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  tekko: {
    name: 'Tekko',
    description: 'Cloth hand wraps of the Far East martial tradition, part of the Kenpogi Set.',
    price: 833,
    sellPrice: 416,
    stack: 1,
    levelRequirement: 8,
    slot: 'hands',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 2,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',   currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',       currency: 'Gil' },
      { npc: 'Silver Owl',         zone: 'Port Bastok (F-6)',       currency: 'Gil' },
      { npc: 'Ryan',               zone: 'Port Windurst (H-7)',     currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',       currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',           currency: 'Gil' },
      { npc: 'Rolandienne',        zone: 'Southern San d’Oria (G-10)', currency: 'Sparks' },
      { npc: 'Isakoth',            zone: 'Bastok Markets (E-11)',   currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat',     zone: 'Windurst Woods (J-10)',   currency: 'Sparks' },
      { npc: 'Eternal Flame',      zone: 'Western Adoulin (H-11)',  currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  tekkoPlus1: {
    name: 'Tekko +1',
    description: 'Reinforced cloth hand wraps, high quality version of Tekko.',
    stack: 1,
    levelRequirement: 8,
    slot: 'hands',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 3,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  sitabaki: {
    name: 'Sitabaki',
    description: 'Cloth leg wraps of the Far East martial tradition, part of the Kenpogi Set.',
    price: 833,
    sellPrice: 416,
    stack: 1,
    levelRequirement: 8,
    slot: 'legs',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 5,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',   currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',       currency: 'Gil' },
      { npc: 'Silver Owl',         zone: 'Port Bastok (F-6)',       currency: 'Gil' },
      { npc: 'Ryan',               zone: 'Port Windurst (H-7)',     currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',       currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',           currency: 'Gil' },
      { npc: 'Rolandienne',        zone: 'Southern San d’Oria (G-10)', currency: 'Sparks' },
      { npc: 'Isakoth',            zone: 'Bastok Markets (E-11)',   currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat',     zone: 'Windurst Woods (J-10)',   currency: 'Sparks' },
      { npc: 'Eternal Flame',      zone: 'Western Adoulin (H-11)',  currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  sitabakiPlus1: {
    name: 'Sitabaki +1',
    description: 'Reinforced cloth leg wraps, high quality version of Sitabaki.',
    stack: 1,
    levelRequirement: 8,
    slot: 'legs',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 6,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  kyahan: {
    name: 'Kyahan',
    description: 'Cloth ankle wraps of the Far East martial tradition, part of the Kenpogi Set.',
    price: 833,
    sellPrice: 416,
    stack: 1,
    levelRequirement: 8,
    slot: 'feet',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 2,
    races: ['All'],
    vendors: [
      { npc: 'Coullave',           zone: 'Port San d’Oria (F-10)',   currency: 'Gil' },
      { npc: 'Numa',               zone: 'Port Bastok (E-7)',       currency: 'Gil' },
      { npc: 'Silver Owl',         zone: 'Port Bastok (F-6)',       currency: 'Gil' },
      { npc: 'Ryan',               zone: 'Port Windurst (H-7)',     currency: 'Gil' },
      { npc: 'Akamafula',          zone: 'Lower Jeuno (J-8)',       currency: 'Gil' },
      { npc: 'Tsutsuroon',         zone: 'Nashmau (G-7)',           currency: 'Gil' },
      { npc: 'Rolandienne',        zone: 'Southern San d’Oria (G-10)', currency: 'Sparks' },
      { npc: 'Isakoth',            zone: 'Bastok Markets (E-11)',   currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat',     zone: 'Windurst Woods (J-10)',   currency: 'Sparks' },
      { npc: 'Eternal Flame',      zone: 'Western Adoulin (H-11)',  currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  kyahanPlus1: {
    name: 'Kyahan +1',
    description: 'Reinforced cloth ankle wraps, high quality version of Kyahan.',
    stack: 1,
    levelRequirement: 8,
    slot: 'feet',
    jobs: ['Monk','Samurai','Ninja'],
    defense: 3,
    races: ['All'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  bambooStick: {
    name: 'Bamboo Stick',
    price: 132,
        sellPrice: 66,
    stack: 99,
    description: 'A basic bamboo pole.',
    damage: 5,
    delay: 240,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  toolbagIno: {
    name: 'Toolbag (Ino)',
    price: 13500,
        sellPrice: 6750,
    stack: 99,
    description: 'Bundle of Ino tools for ninjutsu.',
    levelRequirement: 0
  },
  toolbagShika: {
    name: 'Toolbag (Shika)',
    price: 18000,
        sellPrice: 9000,
    stack: 99,
    description: 'Bundle of Shika tools for ninjutsu.',
    levelRequirement: 0
  },
  toolbagCho: {
    name: 'Toolbag (Cho)',
    price: 18000,
        sellPrice: 9000,
    stack: 99,
    description: 'Bundle of Cho tools for ninjutsu.',
    levelRequirement: 0
  },
  ironBread: {
    name: 'Iron Bread',
    price: 92,
        sellPrice: 46,
    stack: 99,
    description: 'Bread that slightly boosts vitality when eaten.',
    levelRequirement: 0
  },
  bretzel: {
    name: 'Bretzel',
    price: 22,
        sellPrice: 11,
    stack: 99,
    description: 'A soft pretzel popular in Bastok.',
    levelRequirement: 0
  },
  pumpernickel: {
    name: 'Pumpernickel',
    price: 147,
        sellPrice: 73,
    stack: 99,
    description: 'Dark rye bread with a mild effect.',
    levelRequirement: 0
  },
  sausage: {
    name: 'Sausage',
    price: 143,
        sellPrice: 71,
    stack: 99,
    description: 'A grilled sausage that restores a little HP.',
    levelRequirement: 0
  },
  bakedPopoto: {
    name: 'Baked Popoto',
    price: 294,
        sellPrice: 147,
    stack: 99,
    description: 'A baked popoto that recovers HP.',
    levelRequirement: 0
  },
  pebbleSoup: {
    name: 'Pebble Soup',
    price: 184,
        sellPrice: 92,
    stack: 99,
    description: 'Soup with tiny pebbles for texture.',
    levelRequirement: 0
  },
  pineappleJuice: {
    name: 'Pineapple Juice',
    price: 368,
        sellPrice: 184,
    stack: 99,
    description: 'A sweet juice that gradually restores MP.',
    levelRequirement: 0
  },
  melonJuice: {
    name: 'Melon Juice',
    price: 1012,
        sellPrice: 506,
    stack: 99,
    description: 'A refreshing melon juice that restores MP over time.',
    levelRequirement: 0
  },
  roastMutton: {
    name: 'Roast Mutton',
    price: 662,
        sellPrice: 331,
    stack: 99,
    description: 'A hearty roast of mutton.',
    levelRequirement: 0
  },
  eggSoup: {
    name: 'Egg Soup',
    price: 3036,
        sellPrice: 1518,
    stack: 99,
    description: 'A soup made from eggs.',
    levelRequirement: 0
  },
  derflandPear: {
    name: 'Derfland Pear',
    price: 128,
        sellPrice: 64,
    stack: 99,
    description: 'A sweet pear from the Derfland region.',
    levelRequirement: 0
  },
  ginger: {
    name: 'Ginger',
    price: 142,
        sellPrice: 71,
    stack: 99,
    description: 'A fragrant root used in cooking.',
    levelRequirement: 0
  },
  gysahlGreens: {
    name: 'Gysahl Greens',
    price: 62,
        sellPrice: 31,
    stack: 99,
    description: 'Favorite food of chocobos.',
    levelRequirement: 0
  },
  oliveFlower: {
    name: 'Olive Flower',
    price: 1656,
        sellPrice: 828,
    stack: 99,
    description: 'A delicate olive blossom.',
    levelRequirement: 0
  },
  oliveOil: {
    name: 'Olive Oil',
    price: 14,
        sellPrice: 7,
    stack: 99,
    description: 'Oil pressed from olives.',
    levelRequirement: 0
  },
  wijnruit: {
    name: 'Wijnruit',
    price: 110,
        sellPrice: 55,
    stack: 99,
    description: 'A pungent herb used in alchemy.',
    levelRequirement: 0
  },
  kazhamPeppers: {
    name: 'Kazham Peppers',
    price: 55,
        sellPrice: 27,
    stack: 99,
    description: 'Spicy peppers from Kazham.',
    levelRequirement: 0
  },
  kazhamPineapple: {
    name: 'Kazham Pineapple',
    price: 55,
        sellPrice: 27,
    stack: 99,
    description: 'A tropical pineapple.',
    levelRequirement: 0
  },
  mithranTomato: {
    name: 'Mithran Tomato',
    price: 36,
        sellPrice: 18,
    stack: 99,
    description: 'A juicy tomato cultivated by Mithra.',
    levelRequirement: 0
  },
  blackPepper: {
    name: 'Black Pepper',
    price: 234,
        sellPrice: 117,
    stack: 99,
    description: 'A common spice used in cooking.',
    levelRequirement: 0
  },
  ogrePumpkin: {
    name: 'Ogre Pumpkin',
    price: 88,
        sellPrice: 44,
    stack: 99,
    description: 'A large pumpkin.',
    levelRequirement: 0
  },
  kukuruBean: {
    name: 'Kukuru Bean',
    price: 110,
        sellPrice: 55,
    stack: 99,
    description: 'A flavorful bean used in sweets.',
    levelRequirement: 0
  },
  phalaenopsis: {
    name: 'Phalaenopsis',
    price: 1656,
        sellPrice: 828,
    stack: 99,
    description: 'A rare orchid.',
    levelRequirement: 0
  },
  cattleya: {
    name: 'Cattleya',
    price: 1656,
        sellPrice: 828,
    stack: 99,
    description: 'An exotic flower from the uplands.',
    levelRequirement: 0
  },
  cinnamon: {
    name: 'Cinnamon',
    price: 239,
        sellPrice: 119,
    stack: 99,
    description: 'Fragrant cinnamon bark.',
    levelRequirement: 0
  },
  pamamas: {
    name: 'Pamamas',
    price: 73,
        sellPrice: 36,
    stack: 99,
    description: 'Small sweet bananas.',
    levelRequirement: 0
  },
  rattanLumber: {
    name: 'Rattan Lumber',
    price: 147,
        sellPrice: 73,
    stack: 99,
    description: 'Lumber cut from rattan.',
    levelRequirement: 0
  },
  sulfur: {
    name: 'Sulfur',
    price: 703,
        sellPrice: 351,
    stack: 99,
    description: 'Yellow sulfur used in alchemy.',
    levelRequirement: 0
  },
  popoto: {
    name: 'Popoto',
    price: 43,
        sellPrice: 21,
    stack: 99,
    description: 'A starchy vegetable.',
    levelRequirement: 0
  },
  ryeFlour: {
    name: 'Rye Flour',
    price: 36,
        sellPrice: 18,
    stack: 99,
    description: 'Finely milled rye flour.',
    levelRequirement: 0
  },
  eggplant: {
    name: 'Eggplant',
    price: 40,
        sellPrice: 20,
    stack: 99,
    description: 'A glossy purple vegetable.',
    levelRequirement: 0
  },
  cactuarNeedle: {
    name: 'Cactuar Needle',
    price: 855,
        sellPrice: 427,
    stack: 99,
    description: 'A sharp needle from a cactuar.',
    levelRequirement: 0
  },
  thundermelon: {
    name: 'Thundermelon',
    price: 299,
        sellPrice: 149,
    stack: 99,
    description: 'A melon crackling with energy.',
    levelRequirement: 0
  },
  watermelon: {
    name: 'Watermelon',
    price: 184,
        sellPrice: 92,
    stack: 99,
    description: 'A juicy watermelon.',
    levelRequirement: 0
  },
  giantSheepMeat: {
    name: 'Giant Sheep Meat',
    price: 44,
        sellPrice: 22,
    stack: 99,
    description: 'Meat from a giant sheep.',
    levelRequirement: 0
  },
  driedMarjoram: {
    name: 'Dried Marjoram',
    price: 44,
        sellPrice: 22,
    stack: 99,
    description: 'A bundle of dried marjoram.',
    levelRequirement: 0
  },
  sanDoriaFlour: {
    name: "San d'Oria Flour",
    price: 55,
        sellPrice: 27,
    stack: 99,
    description: 'Flour milled in San d\'Oria.',
    levelRequirement: 0
  },
  semolina: {
    name: 'Semolina',
    price: 1840,
        sellPrice: 920,
    stack: 99,
    description: 'High-quality wheat flour.',
    levelRequirement: 0
  },
  laTheineCabbage: {
    name: 'La Theine Cabbage',
    price: 22,
        sellPrice: 11,
    stack: 99,
    description: 'A crisp cabbage from La Theine.',
    levelRequirement: 0
  },
  selbinaMilk: {
    name: 'Selbina Milk',
    price: 55,
        sellPrice: 27,
    stack: 99,
    description: 'Fresh milk from Selbina.',
    levelRequirement: 0
  },
  movalpolosWater: {
    name: 'Movalpolos Water',
    price: 736,
        sellPrice: 368,
    stack: 99,
    description: 'Water from the depth of Movalpolos.',
    levelRequirement: 0
  },
  danceshroom: {
    name: 'Danceshroom',
    price: 4121,
        sellPrice: 2060,
    stack: 99,
    description: 'A rare dancing mushroom.',
    levelRequirement: 0
  },
  coralFungus: {
    name: 'Coral Fungus',
    price: 694,
        sellPrice: 347,
    stack: 99,
    description: 'A fungus resembling coral.',
    levelRequirement: 0
  },
  kopparnickel: {
    name: 'Kopparnickel',
    price: 736,
        sellPrice: 368,
    stack: 99,
    description: 'Ore rich in copper and nickel.',
    levelRequirement: 0
  },
  degen: {
    name: 'Degen',
    price: 9406,
        sellPrice: 4703,
    stack: 1,
    description: 'A well-balanced broadsword.',
    damage: 14,
    delay: 224,
    levelRequirement: 20,
    slot: 'mainHand',
    jobs: ['Warrior','Red Mage','Paladin','Bard','Dragoon','Corsair','Dancer']
  },
  worldPass: {
    name: 'World Pass',
    price: 1000,
        sellPrice: 500,
    stack: 1,
    description: 'Allows inviting new players to your world.',
    levelRequirement: 0
  },
  goldWorldPass: {
    name: 'Gold World Pass',
    price: 1000,
        sellPrice: 500,
    stack: 1,
    description: 'A gold pass for new characters.',
    levelRequirement: 0
  },
  brassFlowerpot: {
    name: 'Brass Flowerpot',
    price: 920,
        sellPrice: 460,
    stack: 1,
    description: 'A small brass pot for gardening.',
    levelRequirement: 0
  },
  republicWaystone: {
    name: 'Republic Waystone',
    price: 9200,
        sellPrice: 4600,
    stack: 1,
    description: 'Teleports the user to a Bastok location.',
    levelRequirement: 0
  },
  thievesTools: {
    name: "Thief's Tools",
    price: 3643,
        sellPrice: 1821,
    stack: 1,
    description: 'Used to pick simple locks.',
    levelRequirement: 0
  },
  livingKey: {
    name: 'Living Key',
    price: 5520,
        sellPrice: 2760,
    stack: 1,
    description: 'Opens locked doors and chests.',
    levelRequirement: 0
  },
  lugworm: {
    name: 'Lugworm',
    price: 11,
        sellPrice: 5,
    stack: 99,
    description: 'Common fishing bait.',
    levelRequirement: 0
  },
  littleWorm: {
    name: 'Little Worm',
    price: 3,
        sellPrice: 1,
    stack: 99,
    description: 'Small bait for beginner fishers.',
    levelRequirement: 0
  },
  yewFishingRod: {
    name: 'Yew Fishing Rod',
    price: 217,
        sellPrice: 108,
    stack: 1,
    description: 'A sturdy fishing rod made of yew.',
    levelRequirement: 0,
    slot: 'ranged'
  },
  willowFishingRod: {
    name: 'Willow Fishing Rod',
    price: 66,
        sellPrice: 33,
    stack: 1,
    description: 'A light fishing rod crafted from willow.',
    levelRequirement: 0,
    slot: 'ranged'
  },
  robe: {
    name: 'Robe',
    description: 'Basic cloth body armor, provides 3 defense.',
    price: 220,
    sellPrice: 60,
    stack: 1,
    levelRequirement: 1,
    slot: 'body',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 3,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Ostalie', zone: 'Southern San d\'Oria (E-9)', price: 220, currency: 'Gil' },
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 220, currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', price: 220, currency: 'Gil' },
      { npc: 'Rolandienne', zone: 'Southern San d\'Oria (G-10)', price: 50, currency: 'Sparks' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', price: 50, currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat', zone: 'Windurst Woods (J-10)', price: 50, currency: 'Sparks' },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)', price: 50, currency: 'Sparks' }
    ]
  },
  robePlus1: {
    name: 'Robe +1',
    description: 'High quality robe, provides 4 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'body',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 4,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  cuffs: {
    name: 'Cuffs',
    description: 'Basic cloth hand armor, provides 1 defense.',
    price: 118,
    sellPrice: 32,
    stack: 1,
    levelRequirement: 1,
    slot: 'hands',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 1,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Ostalie', zone: 'Southern San d\'Oria (E-9)', price: 118, currency: 'Gil' },
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 118, currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', price: 118, currency: 'Gil' },
      { npc: 'Kuzah Hpirohpon', zone: 'Windurst Woods (F-12)', price: 118, currency: 'Gil' },
      { npc: 'Taten-Bilten', zone: 'Al Zahbi (J-10)', price: 118, currency: 'Gil' }
    ]
  },
  cuffsPlus1: {
    name: 'Cuffs +1',
    description: 'High quality cuffs, provides 2 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'hands',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 2,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  slops: {
    name: 'Slops',
    description: 'Basic cloth leg armor, provides 2 defense.',
    price: 172,
    sellPrice: 49,
    stack: 1,
    levelRequirement: 1,
    slot: 'legs',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 2,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Ostalie', zone: 'Southern San d\'Oria (E-9)', price: 172, currency: 'Gil' },
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 172, currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', price: 172, currency: 'Gil' },
      { npc: 'Kuzah Hpirohpon', zone: 'Windurst Woods (F-12)', price: 172, currency: 'Gil' },
      { npc: 'Taten-Bilten', zone: 'Al Zahbi (J-10)', price: 172, currency: 'Gil' }
    ]
  },
  slopsPlus1: {
    name: 'Slops +1',
    description: 'High quality slops, provides 3 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'legs',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 3,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  ashClogs: {
    name: 'Ash Clogs',
    description: 'Basic cloth foot armor, provides 1 defense.',
    price: 111,
    sellPrice: 31,
    stack: 1,
    levelRequirement: 1,
    slot: 'feet',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 1,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Pirvidiauce', zone: 'Northern San d\'Oria (D-8)', price: 111, currency: 'Gil' },
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 111, currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', price: 111, currency: 'Gil' },
      { npc: 'Chaupire', zone: 'Northern San d\'Oria (E-3)', price: 111, currency: 'Gil' },
      { npc: 'Dehbi Moshal', zone: 'Al Zahbi (G-10)', price: 111, currency: 'Gil' }
    ]
  },
  ashClogsPlus1: {
    name: 'Ash Clogs +1',
    description: 'High quality clogs, provides 2 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'feet',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Dark Knight',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 2,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  headgear: {
    name: 'Headgear',
    description: 'Basic cloth head armor, provides 5 defense.',
    price: 1781,
    sellPrice: 890,
    stack: 1,
    levelRequirement: 11,
    slot: 'head',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Paladin',
      'Beastmaster', 'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair',
      'Puppetmaster', 'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 5,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 1781, currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', price: 1781, currency: 'Gil' },
      { npc: 'Kuzah Hpirohpon', zone: 'Windurst Woods (F-12)', price: 1781, currency: 'Gil' },
      { npc: 'Meriri', zone: 'Windurst Woods (F-12)', price: 1781, currency: 'Gil' }
    ]
  },
  headgearPlus1: {
    name: 'Headgear +1',
    description: 'High quality headgear, provides 6 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'head',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Paladin',
      'Beastmaster', 'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair',
      'Puppetmaster', 'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 6,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  doublet: {
    name: 'Doublet',
    description: 'Basic cloth body armor, provides 10 defense.',
    price: 2470,
    sellPrice: 1235,
    stack: 1,
    levelRequirement: 11,
    slot: 'body',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Paladin',
      'Beastmaster', 'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair',
      'Puppetmaster', 'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 10,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 2470, currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', price: 2470, currency: 'Gil' },
      { npc: 'Kuzah Hpirohpon', zone: 'Windurst Woods (F-12)', price: 2470, currency: 'Gil' },
      { npc: 'Meriri', zone: 'Windurst Woods (F-12)', price: 2470, currency: 'Gil' }
    ]
  },
  doubletPlus1: {
    name: 'Doublet +1',
    description: 'High quality doublet, provides 11 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'body',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Paladin',
      'Beastmaster', 'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair',
      'Puppetmaster', 'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 11,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  gloves: {
    name: 'Gloves',
    description: 'Basic cloth hand armor, provides 3 defense.',
    price: 1363,
    sellPrice: 681,
    stack: 1,
    levelRequirement: 11,
    slot: 'hands',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Paladin',
      'Beastmaster', 'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair',
      'Puppetmaster', 'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 3,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 1363, currency: 'Gil' },
      { npc: 'Guruna-Magurama', zone: 'Port Windurst (H-9)', price: 1363, currency: 'Gil' },
      { npc: 'Kuzah Hpirohpon', zone: 'Windurst Woods (F-12)', price: 1363, currency: 'Gil' },
      { npc: 'Meriri', zone: 'Windurst Woods (F-12)', price: 1363, currency: 'Gil' }
    ]
  },
  glovesPlus1: {
    name: 'Gloves +1',
    description: 'High quality gloves, provides 4 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'hands',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Thief', 'Paladin',
      'Beastmaster', 'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair',
      'Puppetmaster', 'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 4,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  brais: {
    name: 'Brais',
    description: 'Basic cloth leg armor, provides 7 defense.',
    price: 1899,
    sellPrice: 211,
    stack: 1,
    levelRequirement: 11,
    slot: 'legs',
    jobs: [
      'Monk', 'White Mage', 'Red Mage', 'Thief', 'Paladin', 'Beastmaster',
      'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Geomancer', 'Rune Fencer'
    ],
    defense: 7,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 1899, currency: 'Gil' },
      { npc: 'Kumama', zone: 'Port Windurst (H-9)', price: 1899, currency: 'Gil' }
    ]
  },
  braisPlus1: {
    name: 'Brais +1',
    description: 'High quality brais, provides 8 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'legs',
    jobs: [
      'Monk', 'White Mage', 'Red Mage', 'Thief', 'Paladin', 'Beastmaster',
      'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 8,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  gaiters: {
    name: 'Gaiters',
    description: 'Basic cloth foot armor, provides 3 defense.',
    price: 1269,
    sellPrice: 282,
    stack: 1,
    levelRequirement: 11,
    slot: 'feet',
    jobs: [
      'Monk', 'White Mage', 'Red Mage', 'Thief', 'Paladin', 'Beastmaster',
      'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 3,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: true,
    vendors: [
      { npc: 'Gelzerio', zone: 'Bastok Mines (H-7)', price: 1269, currency: 'Gil' },
      { npc: 'Kumama', zone: 'Port Windurst (H-9)', price: 1269, currency: 'Gil' },
      { npc: 'Kuzah Hpirohpon', zone: 'Windurst Woods (F-12)', price: 1269, currency: 'Gil' },
      { npc: 'Meriri', zone: 'Windurst Woods (F-12)', price: 1269, currency: 'Gil' }
    ]
  },
  gaitersPlus1: {
    name: 'Gaiters +1',
    description: 'High quality gaiters, provides 4 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'feet',
    jobs: [
      'Monk', 'White Mage', 'Red Mage', 'Thief', 'Paladin', 'Beastmaster',
      'Bard', 'Dragoon', 'Summoner', 'Blue Mage', 'Corsair', 'Puppetmaster',
      'Dancer', 'Scholar', 'Geomancer', 'Rune Fencer'
    ],
    defense: 4,
    races: ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'],
    keyItem: false,
    sellable: false,
    vendors: []
  },
  poetsCirclet: {
    name: "Poet's Circlet",
    price: 1904,
        sellPrice: 952,
    stack: 1,
    description: 'A fine circlet favored by traveling bards.',
    defense: 5,
    levelRequirement: 12,
    slot: 'head',
    jobs: ['Monk','White Mage','Black Mage','Red Mage','Thief','Dark Knight','Bard','Ranger','Summoner','Blue Mage','Corsair','Puppetmaster','Dancer','Scholar','Geomancer','Rune Fencer']
  },
  tunic: {
    name: 'Tunic',
    description: 'Cloth body armor made from cotton and grasses, part of the Tunic Set.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'body',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 9,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  tunicPlus1: {
    name: 'Tunic +1',
    description: 'High quality version of the Tunic, reinforced for better protection.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'body',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 10,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  linenRobe: {
    name: 'Linen Robe',
    price: 2838,
        sellPrice: 1419,
    stack: 1,
    description: 'A robe woven from linen cloth.',
    defense: 10,
    levelRequirement: 12,
    slot: 'body',
    jobs: ['Monk','White Mage','Black Mage','Red Mage','Thief','Dark Knight','Bard','Ranger','Summoner','Blue Mage','Corsair','Puppetmaster','Dancer','Scholar','Geomancer','Rune Fencer']
  },
  mitts: {
    name: 'Mitts',
    description: 'Cloth hand armor, part of the Tunic Set.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'hands',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 2,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  mittsPlus1: {
    name: 'Mitts +1',
    description: 'High quality version of the Mitts, reinforced for better protection.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'hands',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 3,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  linenCuffs: {
    name: 'Linen Cuffs',
    price: 1605,
        sellPrice: 802,
    stack: 1,
    description: 'Arm cuffs sewn from linen.',
    defense: 3,
    levelRequirement: 12,
    slot: 'hands',
    jobs: ['Monk','White Mage','Black Mage','Red Mage','Thief','Dark Knight','Bard','Ranger','Summoner','Blue Mage','Corsair','Puppetmaster','Dancer','Scholar','Geomancer','Rune Fencer']
  },
  slacks: {
    name: 'Slacks',
    description: 'Cloth leg armor, part of the Tunic Set.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'legs',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 5,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  slacksPlus1: {
    name: 'Slacks +1',
    description: 'High quality version of the Slacks, reinforced for better protection.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'legs',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 6,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  linenSlops: {
    name: 'Linen Slops',
    price: 2318,
        sellPrice: 1159,
    stack: 1,
    description: 'Loose linen slops.',
    defense: 7,
    levelRequirement: 12,
    slot: 'legs',
    jobs: ['Monk','White Mage','Black Mage','Red Mage','Thief','Dark Knight','Bard','Ranger','Summoner','Blue Mage','Corsair','Puppetmaster','Dancer','Scholar','Geomancer','Rune Fencer']
  },
  solea: {
    name: 'Solea',
    description: 'Cloth foot armor, part of the Tunic Set.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'feet',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 2,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  soleaPlus1: {
    name: 'Solea +1',
    description: 'High quality version of the Solea, reinforced for better protection.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 8,
    slot: 'feet',
    jobs: [
      'Monk', 'White Mage', 'Black Mage', 'Red Mage', 'Paladin',
      'Bard', 'Ranger', 'Summoner', 'Blue Mage', 'Puppetmaster', 'Scholar'
    ],
    defense: 3,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  hollyClogs: {
    name: 'Holly Clogs',
    price: 1495,
        sellPrice: 748,
    stack: 1,
    description: 'Clogs carved from holly wood.',
    defense: 3,
    levelRequirement: 12,
    slot: 'feet',
    jobs: ['Monk','White Mage','Black Mage','Red Mage','Thief','Dark Knight','Bard','Ranger','Summoner','Blue Mage','Corsair','Puppetmaster','Dancer','Scholar','Geomancer','Rune Fencer']
  },
  leatherRing: {
    name: 'Leather Ring',
    price: 1150,
        sellPrice: 575,
    stack: 1,
    description: 'A simple leather band for the finger.',
    defense: 1,
    levelRequirement: 14,
    slot: 'leftRing',
    jobs: jobNames
  },
  paddedCap: {
    name: 'Padded Cap',
    price: 18360,
        sellPrice: 9180,
    stack: 1,
    description: 'A padded iron cap.',
    defense: 12,
    levelRequirement: 35,
    slot: 'head',
    jobs: ['Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight','Beastmaster','Bard','Samurai','Ninja','Dragoon','Blue Mage','Corsair','Dancer','Rune Fencer']
  },
  ironMask: {
    name: 'Iron Mask',
    price: 9234,
        sellPrice: 4617,
    stack: 1,
    description: 'A heavy iron mask.',
    defense: 7,
    levelRequirement: 15,
    slot: 'head',
    jobs: ['Warrior','Paladin','Dark Knight']
  },
  paddedArmor: {
    name: 'Padded Armor',
    price: 28339,
        sellPrice: 14169,
    stack: 1,
    description: 'Body armor lined with padding.',
    defense: 24,
    levelRequirement: 35,
    slot: 'body',
    jobs: ['Warrior','Monk','Red Mage']
  },
  ironMittens: {
    name: 'Iron Mittens',
    price: 15552,
        sellPrice: 7776,
    stack: 1,
    description: 'Iron gauntlets.',
    defense: 11,
    levelRequirement: 15,
    slot: 'hands',
    jobs: ['Warrior','Dark Knight']
  },
  brassCap: {
    name: 'Brass Cap',
    description: 'Basic head armor crafted from brass, part of the Brass Armor Set.',
    price: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'head',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 5,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Charging Chocobo', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', currency: 'Gil' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', currency: 'Sparks' },
      { npc: 'Rolandienne', zone: 'Southern San d’Oria (G-10)', currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat', zone: 'Windurst Woods (J-10)', currency: 'Sparks' },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)', currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  brassCapPlus1: {
    name: 'Brass Cap +1',
    description: 'Reinforced brass head armor with improved plating.',
    stack: 1,
    levelRequirement: 11,
    slot: 'head',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 6,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Charging Chocobo', zone: 'Bastok Markets (F-10)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: false
  },
  leatherBandana: {
    name: 'Leather Bandana',
    description: 'Basic leather head armor, provides 3 defense.',
    price: 404,
    sellPrice: 202,
    stack: 1,
    levelRequirement: 7,
    slot: 'head',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 3,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Miogique', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Orez-Ebrez', zone: 'Windurst Waters (H-7)', currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', currency: 'Gil' },
      { npc: 'Tahn Posbei', zone: 'Kazham (H-9)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  leatherBandanaPlus1: {
    name: 'Leather Bandana +1',
    description: 'High quality leather head armor, provides 4 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 7,
    slot: 'head',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 4,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  brassHarness: {
    name: 'Brass Harness',
    description: 'Basic body armor crafted from brass, part of the Brass Armor Set.',
    price: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'body',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 10,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', currency: 'Gil' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', currency: 'Sparks' },
      { npc: 'Rolandienne', zone: 'Southern San d’Oria (G-10)', currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  brassHarnessPlus1: {
    name: 'Brass Harness +1',
    description: 'Reinforced brass body armor with improved plating.',
    stack: 1,
    levelRequirement: 11,
    slot: 'body',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 11,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: false
  },

  brassMittens: {
    name: 'Brass Mittens',
    description: 'Basic hand armor crafted from brass, part of the Brass Armor Set.',
    price: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'hands',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 3,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', currency: 'Gil' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },

  brassMittensPlus1: {
    name: 'Brass Mittens +1',
    description: 'Reinforced brass hand armor with improved plating.',
    stack: 1,
    levelRequirement: 11,
    slot: 'hands',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 4,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: false
  },
  ironSubligar: {
    name: 'Iron Subligar',
    price: 23316,
        sellPrice: 11658,
    stack: 1,
    description: 'Iron leg protection.',
    defense: 10,
    levelRequirement: 20,
    slot: 'legs',
    jobs: baseJobNames
  },
  lizardTrousers: {
    name: 'Lizard Trousers',
    price: 5003,
        sellPrice: 2501,
    stack: 1,
    description: 'Trousers made from lizard skin.',
    defense: 3,
    levelRequirement: 10,
    slot: 'legs',
    jobs: baseJobNames
  },
  leggings: {
    name: 'Leggings',
    price: 14484,
        sellPrice: 7242,
    stack: 1,
    description: 'Sturdy protective leggings.',
    defense: 11,
    levelRequirement: 30,
    slot: 'legs',
    jobs: baseJobNames
  },
  lizardLedelsens: {
    name: 'Lizard Ledelsens',
    price: 3162,
        sellPrice: 1581,
    stack: 1,
    description: 'Footwear made from lizard skin.',
    defense: 4,
    levelRequirement: 17,
    slot: 'feet',
    jobs: ['Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster','Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair','Dancer','Rune Fencer']
  },
  buckler: {
    name: 'Buckler',
    price: 31544,
        sellPrice: 15772,
    stack: 1,
    description: 'A sturdy round shield.',
    defense: 12,
    levelRequirement: 40,
    slot: 'offHand',
    jobs: ['Warrior','Paladin','Black Mage','Red Mage','Thief','Dark Knight']
  },
  brassSubligar: {
    name: 'Brass Subligar',
    description: 'Basic leg armor crafted from brass, part of the Brass Armor Set.',
    price: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'legs',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 7,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Charging Chocobo', zone: 'Bastok Markets (F-10)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  brassSubligarPlus1: {
    name: 'Brass Subligar +1',
    description: 'Reinforced brass leg armor with improved plating.',
    stack: 1,
    levelRequirement: 11,
    slot: 'legs',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 8,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: false
  },
  leatherTrousers: {
    name: 'Leather Trousers',
    description: 'Basic leather leg armor, provides 5 defense.',
    price: 493,
    sellPrice: 246,
    stack: 1,
    levelRequirement: 7,
    slot: 'legs',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 5,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', currency: 'Gil' },
      { npc: 'Zemedars', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Kumama', zone: 'Port Windurst (H-9)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  leatherTrousersPlus1: {
    name: 'Leather Trousers +1',
    description: 'High quality leather leg armor, provides 6 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 7,
    slot: 'legs',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 6,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  brassLeggings: {
    name: 'Brass Leggings',
    description: 'Basic foot armor crafted from brass, part of the Brass Armor Set.',
    price: 0,
    stack: 1,
    levelRequirement: 11,
    slot: 'feet',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 3,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  brassLeggingsPlus1: {
    name: 'Brass Leggings +1',
    description: 'Reinforced brass foot armor with improved plating.',
    stack: 1,
    levelRequirement: 11,
    slot: 'feet',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 4,
    vendors: [
      { npc: 'Brunhilde', zone: 'Bastok Markets (F-10)', currency: 'Gil' },
      { npc: 'Deegis', zone: 'Bastok Mines (H-6)', currency: 'Gil' },
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: false
  },
  leatherHighboots: {
    name: 'Leather Highboots',
    description: 'Basic leather foot armor, provides 2 defense.',
    price: 309,
    sellPrice: 154,
    stack: 1,
    levelRequirement: 7,
    slot: 'feet',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 2,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', currency: 'Gil' },
      { npc: 'Kueh Igunahmori', zone: 'Southern San d’Oria (D-8)', currency: 'Gil' }
    ],
    keyItem: false,
    sellable: true
  },

  leatherHighbootsPlus1: {
    name: 'Leather Highboots +1',
    description: 'High quality leather foot armor, provides 3 defense.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 7,
    slot: 'feet',
    jobs: [
      'Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster',
      'Bard','Ranger','Samurai','Ninja','Dragoon','Blue Mage','Corsair',
      'Dancer','Rune Fencer'
    ],
    defense: 3,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  targe: {
    name: 'Targe',
    price: 11076,
        sellPrice: 5538,
    stack: 1,
    description: 'A small protective shield.',
    defense: 8,
    levelRequirement: 15,
    slot: 'offHand',
    jobs: baseJobNames
  },
  bronzeSubligar: {
    name: 'Bronze Subligar',
    price: 191,
        sellPrice: 95,
    stack: 1,
    description: 'Basic leg armor crafted from bronze, part of the Bronze Armor Set.',
    defense: 3,
    levelRequirement: 1,
    slot: 'legs',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    vendors: [
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', price: 191, currency: 'Gil' },
      { npc: 'Charging Chocobo', zone: 'Bastok Markets (F-10)', price: 191, currency: 'Gil' },
      { npc: 'Zemedars', zone: 'Bastok Mines (H-6)', price: 191, currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', price: 191, currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', price: 191, currency: 'Gil' },
      { npc: 'Rolandienne', zone: 'Southern San d’Oria (G-10)', price: 50, currency: 'Sparks' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', price: 50, currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },
  bronzeSubligarPlus1: {
    name: 'Bronze Subligar +1',
    description: 'Reinforced bronze leg armor with improved plating.',
    stack: 1,
    levelRequirement: 1,
    slot: 'legs',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 4,
    keyItem: false,
    sellable: false
  },
  chainHose: {
    name: 'Chain Hose',
    price: 11592,
        sellPrice: 5796,
    stack: 1,
    description: 'Leg armor of interlocked chain.',
    defense: 12,
    levelRequirement: 28,
    slot: 'legs',
    jobs: baseJobNames
  },
  bronzeLeggings: {
    name: 'Bronze Leggings',
    price: 117,
        sellPrice: 58,
    stack: 1,
    description: 'Basic foot armor crafted from bronze, part of the Bronze Armor Set.',
    defense: 1,
    levelRequirement: 1,
    slot: 'feet',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    vendors: [
      { npc: 'Carautia', zone: 'Southern San d’Oria (K-8)', price: 117, currency: 'Gil' },
      { npc: 'Charging Chocobo', zone: 'Bastok Markets (F-10)', price: 117, currency: 'Gil' },
      { npc: 'Ryan', zone: 'Port Windurst (H-7)', price: 117, currency: 'Gil' },
      { npc: 'Graine', zone: 'Mhaura (H-8)', price: 117, currency: 'Gil' },
      { npc: 'Rolandienne', zone: 'Southern San d’Oria (G-10)', price: 50, currency: 'Sparks' },
      { npc: 'Isakoth', zone: 'Bastok Markets (E-11)', price: 50, currency: 'Sparks' },
      { npc: 'Fhelm Jobeizat', zone: 'Windurst Woods (J-10)', price: 50, currency: 'Sparks' },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)', price: 50, currency: 'Sparks' }
    ],
    keyItem: false,
    sellable: true
  },
  bronzeLeggingsPlus1: {
    name: 'Bronze Leggings +1',
    description: 'Reinforced bronze foot armor with improved plating.',
    stack: 1,
    levelRequirement: 1,
    slot: 'feet',
    jobs: [
      'Warrior','Monk','Red Mage','Thief','Paladin','Dark Knight',
      'Beastmaster','Bard','Samurai','Ninja','Dragoon',
      'Blue Mage','Corsair','Dancer','Rune Fencer'
    ],
    defense: 2,
    keyItem: false,
    sellable: false
  },
  greaves: {
    name: 'Greaves',
    price: 7120,
        sellPrice: 3560,
    stack: 1,
    description: 'Heavy metal greaves.',
    defense: 9,
    levelRequirement: 30,
    slot: 'feet',
    jobs: baseJobNames
  },
  lauanShield: {
    name: 'Lauan Shield',
    price: 110,
        sellPrice: 55,
    stack: 1,
    description: 'A basic wooden shield.',
    defense: 2,
    levelRequirement: 1,
    slot: 'offHand',
    jobs: baseJobNames
  },
  humeTunic: {
    name: 'Hume Tunic',
    price: 276,
        sellPrice: 138,
    stack: 1,
    description: 'Starting tunic for Hume males.',
    defense: 6,
    levelRequirement: 1,
    slot: 'body',
    jobs: ['Hume M']
  },
  humeVest: {
    name: 'Hume Vest',
    price: 276,
        sellPrice: 138,
    stack: 1,
    description: 'Starting vest for Hume females.',
    defense: 6,
    levelRequirement: 1,
    slot: 'body',
    jobs: ['Hume F']
  },
  humeMGloves: {
    name: 'Hume M Gloves',
    price: 165,
        sellPrice: 82,
    stack: 1,
    description: 'Gloves sized for Hume males.',
    defense: 2,
    levelRequirement: 1,
    slot: 'hands',
    jobs: ['Hume M']
  },
  humeFGloves: {
    name: 'Hume F Gloves',
    price: 165,
        sellPrice: 82,
    stack: 1,
    description: 'Gloves sized for Hume females.',
    defense: 2,
    levelRequirement: 1,
    slot: 'hands',
    jobs: ['Hume F']
  },
  humeSlacks: {
    name: 'Hume Slacks',
    price: 239,
        sellPrice: 119,
    stack: 1,
    description: 'Starting pants for Humes.',
    defense: 2,
    levelRequirement: 1,
    slot: 'legs',
    jobs: ['Hume']
  },
  humeMBoots: {
    name: 'Hume M Boots',
    price: 165,
        sellPrice: 82,
    stack: 1,
    description: 'Boots sized for Hume males.',
    defense: 2,
    levelRequirement: 1,
    slot: 'feet',
    jobs: ['Hume M']
  },
  humeFBoots: {
    name: 'Hume F Boots',
    price: 165,
        sellPrice: 82,
    stack: 1,
    description: 'Boots sized for Hume females.',
    defense: 2,
    levelRequirement: 1,
    slot: 'feet',
    jobs: ['Hume F']
  },
  galkanSurcoat: {
    name: 'Galkan Surcoat',
    price: 276,
        sellPrice: 138,
    stack: 1,
    description: 'Starting surcoat for Galkas.',
    defense: 6,
    levelRequirement: 1,
    slot: 'body',
    jobs: ['Galka']
  },
  galkanBracers: {
    name: 'Galkan Bracers',
    price: 165,
        sellPrice: 82,
    stack: 1,
    description: 'Bracers sized for Galkas.',
    defense: 2,
    levelRequirement: 1,
    slot: 'hands',
    jobs: ['Galka']
  },
  galkanBraguette: {
    name: 'Galkan Braguette',
    price: 239,
        sellPrice: 119,
    stack: 1,
    description: 'Legwear for Galkas.',
    defense: 2,
    levelRequirement: 1,
    slot: 'legs',
    jobs: ['Galka']
  },
  galkanSandals: {
    name: 'Galkan Sandals',
    price: 165,
        sellPrice: 82,
    stack: 1,
    description: 'Sandals for Galkas.',
    defense: 2,
    levelRequirement: 1,
    slot: 'feet',
    jobs: ['Galka']
  },
  chocoboFeather: {
    name: 'Chocobo Feather',
    price: 7,
        sellPrice: 3,
    stack: 99,
    description: 'Feather used to revive chocobos.',
    levelRequirement: 0
  },
  dart: {
    name: 'Dart',
    price: 9,
        sellPrice: 4,
    stack: 99,
    description: 'A small dart for chocobo racing.',
    levelRequirement: 0
  },
  blackChocoboFeather: {
    name: 'Black Chocobo Feather',
    price: 1150,
        sellPrice: 575,
    stack: 99,
    description: 'Revives a black chocobo.',
    levelRequirement: 0
  },
  petFoodAlphaBiscuit: {
    name: 'Pet Food Alpha Biscuit',
    price: 11,
        sellPrice: 5,
    stack: 99,
    description: 'Biscuit that boosts pet speed.',
    levelRequirement: 0
  },
  petFoodBetaBiscuit: {
    name: 'Pet Food Beta Biscuit',
    price: 82,
        sellPrice: 41,
    stack: 99,
    description: 'Biscuit that extends sprint duration.',
    levelRequirement: 0
  },
  carrotBroth: {
    name: 'Carrot Broth',
    price: 82,
        sellPrice: 41,
    stack: 99,
    description: 'Pet broth made from carrots.',
    levelRequirement: 0
  },
  bugBroth: {
    name: 'Bug Broth',
    price: 695,
        sellPrice: 347,
    stack: 99,
    description: 'Pet broth teeming with insects.',
    levelRequirement: 0
  },
  herbalBroth: {
    name: 'Herbal Broth',
    price: 126,
        sellPrice: 63,
    stack: 99,
    description: 'Aromatic herb-based pet feed.',
    levelRequirement: 0
  },
  carrionBroth: {
    name: 'Carrion Broth',
    price: 695,
        sellPrice: 347,
    stack: 99,
    description: 'Pet feed made from carrion.',
    levelRequirement: 0
  },
  scrollChocoboMazurka: {
    name: 'Scroll of Chocobo Mazurka',
    price: 50784,
        sellPrice: 25392,
    stack: 1,
    description: 'Teaches the song Chocobo Mazurka.',
    levelRequirement: 75
  },
  pickledHerring: {
    name: 'Pickled Herring',
    price: 441,
        sellPrice: 220,
    stack: 12,
    description: 'A salty preserved fish.',
    levelRequirement: 0
  },
  hiPotion: {
    name: 'Hi-Potion',
    price: 3375,
        sellPrice: 1687,
    stack: 12,
    description: 'Restores a large amount of HP.',
    levelRequirement: 0
  },
  triturator: {
    name: 'Triturator',
    price: 75,
        sellPrice: 37,
    stack: 1,
    description: 'An alchemy tool for grinding.',
    levelRequirement: 0
  },
  beehiveChip: {
    name: 'Beehive Chip',
    price: 192,
        sellPrice: 96,
    stack: 99,
    description: 'A chunk of honeycomb.',
    levelRequirement: 0
  },
  cobaltJellyfish: {
    name: 'Cobalt Jellyfish',
    price: 114,
        sellPrice: 57,
    stack: 12,
    description: 'A bright blue jellyfish.',
    levelRequirement: 0
  },
  holyWater: {
    name: 'Holy Water',
    price: 5250,
        sellPrice: 2625,
    stack: 12,
    description: 'Cures petrification.',
    levelRequirement: 0
  },
  prismPowder: {
    name: 'Prism Powder',
    price: 1050,
        sellPrice: 525,
    stack: 12,
    description: 'Creates an invisible barrier.',
    levelRequirement: 0
  },
  bombAsh: {
    name: 'Bomb Ash',
    price: 1004,
        sellPrice: 502,
    stack: 99,
    description: 'Ash from an exploded bomb.',
    levelRequirement: 0
  },
  beaugreens: {
    name: 'Beaugreens',
    price: 90,
        sellPrice: 45,
    stack: 99,
    description: 'A leafy vegetable from Fauregandi.',
    levelRequirement: 0
  },
  faerieApple: {
    name: 'Faerie Apple',
    price: 39,
        sellPrice: 19,
    stack: 99,
    description: 'A sweet apple from Fauregandi.',
    levelRequirement: 0
  },
  mapleLog: {
    name: 'Maple Log',
    price: 54,
        sellPrice: 27,
    stack: 99,
    description: 'A log cut from a maple tree.',
    levelRequirement: 0
  },
  arquebus: {
    name: 'Arquebus',
    price: 46836,
        sellPrice: 23418,
    stack: 1,
    description: 'A basic firearm.',
    slot: 'ranged',
    damage: 15,
    delay: 600,
    levelRequirement: 1,
    jobs: baseJobNames
  },
  aspis: {
    name: 'Aspis',
    price: 2400,
        sellPrice: 1200,
    stack: 1,
    description: 'A small shield.',
    defense: 4,
    slot: 'offHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  baghnakh: {
    name: 'Baghnakh',
    price: 1920,
        sellPrice: 960,
    stack: 1,
    description: 'Clawed fist weapons.',
    damage: 6,
    delay: 96,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  battleaxe: {
    name: 'Battleaxe',
    price: 1344,
        sellPrice: 672,
    stack: 1,
    description: 'A two-handed battleaxe.',
    damage: 12,
    delay: 360,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  bilbo: {
    name: 'Bilbo',
    price: 3215,
        sellPrice: 1607,
    stack: 1,
    description: 'A well-balanced sword.',
    damage: 11,
    delay: 226,
    slot: 'mainHand',
    levelRequirement: 13,
    jobs: ['Warrior','Black Mage','Red Mage','Thief','Paladin','Dark Knight','Beastmaster','Bard','Ranger','Ninja','Dragoon','Corsair','Dancer','Rune Fencer']
  },
  bronzeBed: {
    name: 'Bronze Bed',
    price: 90,
        sellPrice: 45,
    stack: 1,
    description: 'A bellows used in smithing.',
    levelRequirement: 0
  },
  bronzeScales: {
    name: 'Bronze Scales',
    price: 592,
        sellPrice: 296,
    stack: 1,
    description: 'Light bronze scale armor.',
    defense: 7,
    slot: 'body',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  bronzeSheet: {
    name: 'Bronze Sheet',
    price: 70,
        sellPrice: 35,
    stack: 99,
    description: 'A sheet of bronze for crafting.',
    levelRequirement: 0
  },
  butterflyAxe: {
    name: 'Butterfly Axe',
    price: 819,
        sellPrice: 409,
    stack: 1,
    description: 'A decorative axe.',
    damage: 8,
    delay: 300,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  cuisses: {
    name: 'Cuisses',
    price: 1200,
        sellPrice: 600,
    stack: 1,
    description: 'Plate armor for the legs.',
    defense: 6,
    slot: 'legs',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  mythrilCuisses: {
    name: 'Mythril Cuisses',
    price: 40320,
        sellPrice: 20160,
    stack: 1,
    description: 'Leg armor forged of mythril plates.',
    defense: 12,
    slot: 'legs',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  mythrilLeggings: {
    name: 'Mythril Leggings',
    price: 39600,
        sellPrice: 19800,
    stack: 1,
    description: 'Protective greaves of mythril.',
    defense: 11,
    slot: 'feet',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  brassCuisses: {
    name: 'Brass Cuisses',
    price: 8640,
        sellPrice: 4320,
    stack: 1,
    description: 'Brass plates for leg protection.',
    defense: 7,
    slot: 'legs',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  brassGreaves: {
    name: 'Brass Greaves',
    price: 8160,
        sellPrice: 4080,
    stack: 1,
    description: 'Greaves hammered from brass.',
    defense: 7,
    slot: 'feet',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  plateLeggings: {
    name: 'Plate Leggings',
    price: 27240,
        sellPrice: 13620,
    stack: 1,
    description: 'Heavy plate leggings.',
    defense: 10,
    slot: 'legs',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  scaleCuisses: {
    name: 'Scale Cuisses',
    description: 'Leg armor crafted from bronze scales, part of the Scale Armor Set.',
    price: 1646,
    sellPrice: 823,
    stack: 1,
    levelRequirement: 10,
    slot: 'legs',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 7,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Victoire',      zone: 'Southern San d’Oria (K-8)', currency: 'Gil', price: 1646 },
      { npc: 'Charging Chocobo', zone: 'Bastok Markets (F-10)',   currency: 'Gil', price: 1646 },
      { npc: 'Drozga',        zone: 'Port Windurst (H-7)',        currency: 'Gil', price: 1646 },
      { npc: 'Rolandienne',   zone: 'Southern San d’Oria (G-10)', currency: 'Sparks', price: 60 },
      { npc: 'Isakoth',       zone: 'Bastok Markets (E-11)',      currency: 'Sparks', price: 60 },
      { npc: 'Fhelm Jobeizat',zone: 'Windurst Woods (J-10)',      currency: 'Sparks', price: 60 },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)',     currency: 'Sparks', price: 60 }
    ],
    keyItem: false,
    sellable: true
  },

  solidCuisses: {
    name: 'Solid Cuisses',
    description: 'High quality leg armor, reinforced version of Scale Cuisses.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 10,
    slot: 'legs',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 8,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  scaleGreaves: {
    name: 'Scale Greaves',
    description: 'Foot armor crafted from bronze scales, part of the Scale Armor Set.',
    price: 998,
    sellPrice: 499,
    stack: 1,
    levelRequirement: 10,
    slot: 'feet',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 3,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [
      { npc: 'Victoire',      zone: 'Southern San d’Oria (K-8)', currency: 'Gil', price: 998 },
      { npc: 'Charging Chocobo', zone: 'Bastok Markets (F-10)',   currency: 'Gil', price: 998 },
      { npc: 'Drozga',        zone: 'Port Windurst (H-7)',        currency: 'Gil', price: 998 },
      { npc: 'Rolandienne',   zone: 'Southern San d’Oria (G-10)', currency: 'Sparks', price: 60 },
      { npc: 'Isakoth',       zone: 'Bastok Markets (E-11)',      currency: 'Sparks', price: 60 },
      { npc: 'Fhelm Jobeizat',zone: 'Windurst Woods (J-10)',      currency: 'Sparks', price: 60 },
      { npc: 'Eternal Flame', zone: 'Western Adoulin (H-11)',     currency: 'Sparks', price: 60 }
    ],
    keyItem: false,
    sellable: true
  },

  solidGreaves: {
    name: 'Solid Greaves',
    description: 'High quality foot armor, reinforced version of Scale Greaves.',
    price: 0,
    sellPrice: 0,
    stack: 1,
    levelRequirement: 10,
    slot: 'feet',
    jobs: [
      'Warrior','Red Mage','Paladin','Dark Knight','Beastmaster',
      'Ranger','Samurai','Dragoon','Blue Mage','Rune Fencer'
    ],
    defense: 4,
    races: ['Hume','Elvaan','Tarutaru','Mithra','Galka'],
    vendors: [],
    keyItem: false,
    sellable: false
  },
  chainmail: {
    name: 'Chainmail',
    price: 15840,
        sellPrice: 7920,
    stack: 1,
    description: 'A suit of basic chainmail armor.',
    defense: 9,
    slot: 'body',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  chainMittens: {
    name: 'Chain Mittens',
    price: 7680,
        sellPrice: 3840,
    stack: 1,
    description: 'Hand protection of linked chain.',
    defense: 6,
    slot: 'hands',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  leatherBelt: {
    name: 'Leather Belt',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'A simple leather belt.',
    defense: 0,
    slot: 'waist',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  silverBelt: {
    name: 'Silver Belt',
    price: 1200,
        sellPrice: 600,
    stack: 1,
    description: 'A decorative belt adorned with silver.',
    defense: 0,
    slot: 'waist',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  darksteelChain: {
    name: 'Darksteel Chain',
    price: 2400,
        sellPrice: 1200,
    stack: 1,
    description: 'Mail forged of darksteel.',
    defense: 9,
    slot: 'body',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  darksteelFalchion: {
    name: 'Darksteel Falchion',
    price: 3600,
        sellPrice: 1800,
    stack: 1,
    description: 'A darksteel sword.',
    damage: 15,
    delay: 240,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  darksteelIngot: {
    name: 'Darksteel Ingot',
    price: 525,
        sellPrice: 262,
    stack: 99,
    description: 'Refined darksteel used in smithing.',
    levelRequirement: 0
  },
  darksteelKnife: {
    name: 'Darksteel Knife',
    price: 1200,
        sellPrice: 600,
    stack: 1,
    description: 'A sharp darksteel dagger.',
    damage: 9,
    delay: 200,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  darksteelKnuckles: {
    name: 'Darksteel Knuckles',
    price: 1920,
        sellPrice: 960,
    stack: 1,
    description: 'Darksteel fist weapons.',
    damage: 8,
    delay: 96,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  darksteelSheet: {
    name: 'Darksteel Sheet',
    price: 600,
        sellPrice: 300,
    stack: 99,
    description: 'A sheet of darksteel.',
    levelRequirement: 0
  },
  falchion: {
    name: 'Falchion',
    price: 62560,
        sellPrice: 31280,
    stack: 1,
    description: 'A single-edged sword.',
    damage: 28,
    delay: 236,
    slot: 'mainHand',
    levelRequirement: 44,
    jobs: ['Warrior','Thief','Dark Knight','Beastmaster','Ranger','Samurai','Blue Mage']
  },
  gorget: {
    name: 'Gorget',
    price: 855,
        sellPrice: 427,
    stack: 1,
    description: 'Neck armor for protection.',
    defense: 2,
    slot: 'neck',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  greataxe: {
    name: 'Greataxe',
    price: 4560,
        sellPrice: 2280,
    stack: 1,
    description: 'A heavy two-handed axe.',
    damage: 18,
    delay: 450,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  heavyAxe: {
    name: 'Heavy Axe',
    price: 3600,
        sellPrice: 1800,
    stack: 1,
    description: 'A large two-handed axe.',
    damage: 16,
    delay: 420,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  ironChain: {
    name: 'Iron Chain',
    price: 1200,
        sellPrice: 600,
    stack: 1,
    description: 'Chainmail crafted from iron.',
    defense: 7,
    slot: 'body',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  ironIngot: {
    name: 'Iron Ingot',
    price: 105,
        sellPrice: 52,
    stack: 99,
    description: 'A refined bar of iron.',
    levelRequirement: 0
  },
  ironScales: {
    name: 'Iron Scales',
    price: 2100,
        sellPrice: 1050,
    stack: 1,
    description: 'Iron scale armor.',
    defense: 10,
    slot: 'body',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  ironSheet: {
    name: 'Iron Sheet',
    price: 350,
        sellPrice: 175,
    stack: 99,
    description: 'A sheet of iron.',
    levelRequirement: 0
  },
  knife: {
    name: 'Knife',
    price: 42,
        sellPrice: 21,
    stack: 1,
    description: 'A small knife.',
    damage: 3,
    delay: 180,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  kukri: {
    name: 'Kukri',
    price: 150,
        sellPrice: 75,
    stack: 1,
    description: 'A curved dagger.',
    damage: 4,
    delay: 190,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  mandrel: {
    name: 'Mandrel',
    price: 75,
    sellPrice: 38,
    stack: 1,
    description: 'A forging mandrel.',
    levelRequirement: 0
  },
  maul: {
    name: 'Maul',
    price: 420,
        sellPrice: 210,
    stack: 1,
    description: 'A heavy hammer.',
    damage: 9,
    delay: 320,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  mythrilAxe: {
    name: 'Mythril Axe',
    price: 2100,
        sellPrice: 1050,
    stack: 1,
    description: 'A mythril axe.',
    damage: 12,
    delay: 276,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  mythrilBolt: {
    name: 'Mythril Bolt',
    price: 12,
        sellPrice: 6,
    stack: 99,
    description: 'Bolts made of mythril.',
    levelRequirement: 1
  },
  tathlum: {
    name: 'Tathlum',
    price: 294,
    sellPrice: 147,
    stack: 99,
    description: 'A smooth stone used as throwing ammo.',
    damage: 24,
    delay: 276,
    levelRequirement: 35,
    slot: 'ammo'
  },
  mythrilIngot: {
    name: 'Mythril Ingot',
    price: 130,
        sellPrice: 65,
    stack: 99,
    description: 'A bar of mythril.',
    levelRequirement: 0
  },
  mythrilKnife: {
    name: 'Mythril Knife',
    price: 200,
        sellPrice: 100,
    stack: 1,
    description: 'A mythril dagger.',
    damage: 5,
    delay: 180,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  mythrilKnuckles: {
    name: 'Mythril Knuckles',
    price: 500,
        sellPrice: 250,
    stack: 1,
    description: 'Mythril fist weapons.',
    damage: 7,
    delay: 96,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  mythrilSheet: {
    name: 'Mythril Sheet',
    price: 230,
        sellPrice: 115,
    stack: 99,
    description: 'A sheet of mythril.',
    levelRequirement: 0
  },
  tabar: {
    name: 'Tabar',
    price: 2400,
        sellPrice: 1200,
    stack: 1,
    description: 'A sturdy battleaxe.',
    damage: 14,
    delay: 360,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  tulwar: {
    name: 'Tulwar',
    price: 3600,
        sellPrice: 1800,
    stack: 1,
    description: 'A curved sword.',
    damage: 13,
    delay: 270,
    slot: 'mainHand',
    levelRequirement: 1,
    jobs: baseJobNames
  },
  workshopAnvil: {
    name: 'Workshop Anvil',
    price: 75,
        sellPrice: 37,
    stack: 1,
    description: 'A portable smithing anvil.',
    levelRequirement: 0
  },
  bronzeNugget: {
    name: 'Bronze Nugget',
    price: 70,
        sellPrice: 35,
    stack: 99,
    description: 'A small lump of bronze.',
    levelRequirement: 0
  },
  tinOre: {
    name: 'Tin Ore',
    price: 60,
        sellPrice: 30,
    stack: 99,
    description: 'Ore containing tin.',
    levelRequirement: 0
  },
  kopparnickelOre: {
    name: 'Kopparnickel Ore',
    price: 800,
        sellPrice: 400,
    stack: 99,
    description: 'Ore rich in kopparnickel.',
    levelRequirement: 0
  },
  ironNugget: {
    name: 'Iron Nugget',
    price: 500,
        sellPrice: 250,
    stack: 99,
    description: 'A small lump of iron.',
    levelRequirement: 0
  },
  steelSheet: {
    name: 'Steel Sheet',
    price: 10000,
        sellPrice: 5000,
    stack: 99,
    description: 'A sheet of steel.',
    levelRequirement: 0
  },
  steelIngot: {
    name: 'Steel Ingot',
    price: 6000,
        sellPrice: 3000,
    stack: 99,
    description: 'A bar of steel.',
    levelRequirement: 0
  },
  tamaHagane: {
    name: 'Tama-Hagane',
    price: 12000,
        sellPrice: 6000,
    stack: 99,
    description: 'A special steel used in forging.',
    levelRequirement: 0
  },
  darksteelNugget: {
    name: 'Darksteel Nugget',
    price: 2700,
        sellPrice: 1350,
    stack: 99,
    description: 'A lump of darksteel.',
    levelRequirement: 0
  },
  darksteelOre: {
    name: 'Darksteel Ore',
    price: 7000,
        sellPrice: 3500,
    stack: 99,
    description: 'Ore containing darksteel.',
    levelRequirement: 0
  },
  steelNugget: {
    name: 'Steel Nugget',
    price: 800,
        sellPrice: 400,
    stack: 99,
    description: 'A small piece of steel.',
    levelRequirement: 0
  },
  swampOre: {
    name: 'Swamp Ore',
    price: 5000,
        sellPrice: 2500,
    stack: 99,
    description: 'Ore found in swampy regions.',
    levelRequirement: 0
  },
  smithingKit: {
    name: 'Smithing Kit',
    price: 300,
        sellPrice: 150,
    stack: 1,
    description: 'A kit of smithing materials.',
    levelRequirement: 0
  },
  niobiumOre: {
    name: 'Niobium Ore',
    price: 1126125,
        sellPrice: 563062,
    stack: 99,
    description: 'Rare niobium ore.',
    levelRequirement: 0
  },
  bullet: {
    name: 'Bullet',
    price: 90,
        sellPrice: 45,
    stack: 99,
    description: 'Ammunition for firearms.',
    levelRequirement: 1
  },
  bombArm: {
    name: 'Bomb Arm',
    price: 675,
        sellPrice: 337,
    stack: 99,
    description: 'The arm of a bomb, used in alchemy.',
    levelRequirement: 0
  },
  grenade: {
    name: 'Grenade',
    price: 1083,
        sellPrice: 541,
    stack: 99,
    description: 'An explosive device.',
    levelRequirement: 0
  },
  catalyticOil: {
    name: 'Catalytic Oil',
    price: 92,
        sellPrice: 46,
    stack: 99,
    description: 'Oil used to catalyze explosions.',
    levelRequirement: 0
  },
  soot: {
    name: 'Soot',
    price: 12,
        sellPrice: 6,
    stack: 99,
    description: 'Fine black powder.',
    levelRequirement: 0
  },
  sausageRoll: {
    name: 'Sausage Roll',
    price: 257,
        sellPrice: 128,
    stack: 12,
    description: 'A savory sausage roll.',
    levelRequirement: 0
  },
  hardBoiledEgg: {
    name: 'Hard-Boiled Egg',
    price: 73,
        sellPrice: 36,
    stack: 12,
    description: 'A simply boiled egg.',
    levelRequirement: 0
  },
  magicPotShard: {
    name: 'Magic Pot Shard',
    price: 614,
        sellPrice: 307,
    stack: 99,
    description: 'Expands Mog House storage when used.',
    levelRequirement: 0
  },
  instantReraise: {
    name: 'Instant Reraise',
    price: 0,
    stack: 1,
    description: 'Grants the Reraise effect when used.',
    levelRequirement: 0
  },
  instantWarp: {
    name: 'Instant Warp',
    price: 0,
    stack: 1,
    description: 'Teleports you to your Home Point.',
    levelRequirement: 0
  },
  returnRing: {
    name: 'Return Ring',
    price: 0,
    stack: 1,
    description: 'Outpost warp ring with 10 charges.',
    slot: 'leftRing',
    levelRequirement: 0,
    jobs: baseJobNames
  },
  homingRing: {
    name: 'Homing Ring',
    price: 0,
    stack: 1,
    description: 'Outpost warp ring with 30 charges.',
    slot: 'leftRing',
    levelRequirement: 0,
    jobs: baseJobNames
  },
  chariotBand: {
    name: 'Chariot Band',
    price: 0,
    stack: 1,
    description: 'Grants +75% EXP up to 10,000.',
    slot: 'leftRing',
    levelRequirement: 0,
    jobs: baseJobNames
  },
  empressBand: {
    name: 'Empress Band',
    price: 0,
    stack: 1,
    description: 'Grants +50% EXP up to 1,000 per charge.',
    slot: 'leftRing',
    levelRequirement: 0,
    jobs: baseJobNames
  },
  emperorBand: {
    name: 'Emperor Band',
    price: 0,
    stack: 1,
    description: 'Grants +50% EXP up to 30,000 per charge.',
    slot: 'leftRing',
    levelRequirement: 0,
    jobs: baseJobNames
  },
  cesti: {
    name: 'Cesti',
    price: 132,
    sellPrice: 66,
    stack: 1,
    description: 'Lightweight striking weapons.',
    damage: 1,
    delay: 48,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  brassBaghnakhs: {
    name: 'Brass Baghnakhs',
    price: 1554,
    sellPrice: 777,
    stack: 1,
    description: 'Clawed brass knuckles.',
    damage: 4,
    delay: 60,
    levelRequirement: 11,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  catBaghnakhs: {
    name: 'Cat Baghnakhs',
    price: 106,
    sellPrice: 53,
    stack: 1,
    description: 'Small baghnakhs favored by beastmasters.',
    damage: 2,
    delay: 60,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  ashClub: {
    name: 'Ash Club',
    price: 66,
    sellPrice: 33,
    stack: 1,
    description: 'A club carved from ash wood.',
    damage: 4,
    delay: 264,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  bronzeRod: {
    name: 'Bronze Rod',
    price: 92,
    sellPrice: 46,
    stack: 1,
    description: 'A simple bronze rod.',
    damage: 5,
    delay: 288,
    levelRequirement: 5,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  brassRod: {
    name: 'Brass Rod',
    price: 634,
    sellPrice: 317,
    stack: 1,
    description: 'A polished brass rod.',
    damage: 8,
    delay: 288,
    levelRequirement: 12,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  ashStaff: {
    name: 'Ash Staff',
    price: 58,
    sellPrice: 29,
    stack: 1,
    description: 'A staff made of ash.',
    damage: 4,
    delay: 264,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  ashPole: {
    name: 'Ash Pole',
    price: 386,
    sellPrice: 193,
    stack: 1,
    description: 'A long ash polearm.',
    damage: 6,
    delay: 408,
    levelRequirement: 1,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  brassAxe: {
    name: 'Brass Axe',
    price: 1528,
    sellPrice: 764,
    stack: 1,
    description: 'A sturdy brass axe.',
    damage: 12,
    delay: 276,
    levelRequirement: 8,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  brassDagger: {
    name: 'Brass Dagger',
    price: 855,
    sellPrice: 427,
    stack: 1,
    description: 'A dagger forged from brass.',
    damage: 6,
    delay: 178,
    levelRequirement: 9,
    slot: 'mainHand',
    jobs: baseJobNames
  },
  piccolo: {
    name: 'Piccolo',
    price: 1067,
    sellPrice: 533,
    stack: 1,
    description: 'A small flute used by bards.',
    levelRequirement: 1,
    slot: 'ranged'
  },
  cornette: {
    name: 'Cornette',
    price: 236,
    sellPrice: 118,
    stack: 1,
    description: 'A brass instrument favored by novice bards.',
    levelRequirement: 1,
    slot: 'ranged'
  },
  mapleHarp: {
    name: 'Maple Harp',
    price: 46,
    sellPrice: 23,
    stack: 1,
    description: 'A small harp crafted from maple.',
    levelRequirement: 1,
    slot: 'ranged'
  },
  scrollVitalEtude: {
    name: 'Scroll of Vital Etude',
    price: 74496,
    sellPrice: 37248,
    stack: 1,
    description: 'Teaches the song Vital Etude.',
    levelRequirement: 55
  },
  scrollSwiftEtude: {
    name: 'Scroll of Swift Etude',
    price: 71392,
    sellPrice: 35696,
    stack: 1,
    description: 'Teaches the song Swift Etude.',
    levelRequirement: 55
  },
  scrollSageEtude: {
    name: 'Scroll of Sage Etude',
    price: 68288,
    sellPrice: 34144,
    stack: 1,
    description: 'Teaches the song Sage Etude.',
    levelRequirement: 55
  },
  scrollLogicalEtude: {
    name: 'Scroll of Logical Etude',
    price: 61110,
    sellPrice: 30555,
    stack: 1,
    description: 'Teaches the song Logical Etude.',
    levelRequirement: 55
  },
  scrollHerculeanEtude: {
    name: 'Scroll of Herculean Etude',
    price: 85748,
    sellPrice: 42874,
    stack: 1,
    description: 'Teaches the song Herculean Etude.',
    levelRequirement: 55
  },
  scrollUncannyEtude: {
    name: 'Scroll of Uncanny Etude',
    price: 82450,
    sellPrice: 41225,
    stack: 1,
    description: 'Teaches the song Uncanny Etude.',
    levelRequirement: 55
  },
  gemshorn: {
    name: 'Gemshorn',
    price: 5005,
    sellPrice: 2502,
    stack: 1,
    description: 'A curved horn instrument.',
    levelRequirement: 1,
    slot: 'ranged'
  },
  flute: {
    name: 'Flute',
    price: 46,
    sellPrice: 23,
    stack: 1,
    description: 'A simple wooden flute.',
    levelRequirement: 1,
    slot: 'ranged'
  },
  scrollBewitchingEtude: {
    name: 'Scroll of Bewitching Etude',
    price: 58200,
    sellPrice: 29100,
    stack: 1,
    description: 'Teaches the song Bewitching Etude.',
    levelRequirement: 55
  },
  foeSirvente: {
    name: 'Foe Sirvente',
    price: 91425,
    sellPrice: 45712,
    stack: 1,
    description: 'Teaches the song Foe Sirvente.',
    levelRequirement: 55
  },
  adventurersDirge: {
    name: "Adventurer's Dirge",
    price: 91425,
    sellPrice: 45712,
    stack: 1,
    description: "Teaches the song Adventurer's Dirge.",
    levelRequirement: 55
  },
  scrollFoeRequiemVII: {
    name: 'Scroll of Foe Requiem VII',
    price: 47196,
    sellPrice: 23598,
    stack: 1,
    description: 'Teaches Foe Requiem VII.',
    levelRequirement: 75
  },
  scrollArmysPaeonVI: {
    name: "Scroll of Army's Paeon VI",
    price: 48944,
    sellPrice: 24472,
    stack: 1,
    description: "Teaches Army's Paeon VI.",
    levelRequirement: 55
  },
  scrollValorMinuetV: {
    name: 'Scroll of Valor Minuet V',
    price: 53820,
    sellPrice: 26910,
    stack: 1,
    description: 'Teaches Valor Minuet V.',
    levelRequirement: 55
  },
  scrollRepose: {
    name: 'Scroll of Repose',
    price: 32010,
    sellPrice: 16005,
    stack: 1,
    description: 'Teaches the white magic Repose.',
    levelRequirement: 55
  },
  scrollBlind: {
    name: 'Scroll of Blind',
    price: 124,
    sellPrice: 62,
    stack: 1,
    description: 'Teaches the black magic Blind.',
    levelRequirement: 5
  },
  scrollBio: {
    name: 'Scroll of Bio',
    price: 400,
    sellPrice: 200,
    stack: 1,
    description: 'Teaches the black magic Bio.',
    levelRequirement: 5
  },
  scrollPoison: {
    name: 'Scroll of Poison',
    price: 92,
    sellPrice: 46,
    stack: 1,
    description: 'Teaches the black magic Poison.',
    levelRequirement: 5
  },
  scrollSleep: {
    name: 'Scroll of Sleep',
    price: 2500,
    sellPrice: 1250,
    stack: 1,
    description: 'Teaches the black magic Sleep.',
    levelRequirement: 20
  },
  scrollAero: {
    name: 'Scroll of Aero',
    price: 349,
    sellPrice: 175,
    stack: 1,
    description: 'Teaches the black magic Aero.',
    levelRequirement: 1
  },
  scrollBlizzard: {
    name: 'Scroll of Blizzard',
    price: 1707,
    sellPrice: 853,
    stack: 1,
    description: 'Teaches the black magic Blizzard.',
    levelRequirement: 11
  },
  scrollBurn: {
    name: 'Scroll of Burn',
    price: 5005,
    sellPrice: 2502,
    stack: 1,
    description: 'Teaches the black magic Burn.',
    levelRequirement: 55
  },
  scrollChoke: {
    name: 'Scroll of Choke',
    price: 2425,
    sellPrice: 1212,
    stack: 1,
    description: 'Teaches the black magic Choke.',
    levelRequirement: 35
  },
  scrollDrown: {
    name: 'Scroll of Drown',
    price: 6861,
    sellPrice: 3430,
    stack: 1,
    description: 'Teaches the black magic Drown.',
    levelRequirement: 55
  },
  scrollFrost: {
    name: 'Scroll of Frost',
    price: 3975,
    sellPrice: 1987,
    stack: 1,
    description: 'Teaches the black magic Frost.',
    levelRequirement: 35
  },
  scrollRasp: {
    name: 'Scroll of Rasp',
    price: 1969,
    sellPrice: 984,
    stack: 1,
    description: 'Teaches the black magic Rasp.',
    levelRequirement: 15
  },
  scrollShock: {
    name: 'Scroll of Shock',
    price: 1469,
    sellPrice: 734,
    stack: 1,
    description: 'Teaches the black magic Shock.',
    levelRequirement: 25
  },
  scrollStone: {
    name: 'Scroll of Stone',
    price: 66,
    sellPrice: 33,
    stack: 1,
    description: 'Teaches the black magic Stone.',
    levelRequirement: 1
  },
  scrollThunder: {
    name: 'Scroll of Thunder',
    price: 3515,
    sellPrice: 1757,
    stack: 1,
    description: 'Teaches the black magic Thunder.',
    levelRequirement: 17
  },
  scrollWater: {
    name: 'Scroll of Water',
    price: 151,
    sellPrice: 75,
    stack: 1,
    description: 'Teaches the black magic Water.',
    levelRequirement: 1
  },
  zincOre: {
    name: 'Zinc Ore',
    price: 200,
    sellPrice: 100,
    stack: 12,
    description: 'A chunk of zinc-bearing ore.',
    levelRequirement: 0
  },
  brassNugget: {
    name: 'Brass Nugget',
    price: 40,
    sellPrice: 20,
    stack: 12,
    description: 'A nugget of brass.',
    levelRequirement: 0
  },
  brassSheet: {
    name: 'Brass Sheet',
    price: 300,
    sellPrice: 150,
    stack: 12,
    description: 'A sheet of hammered brass.',
    levelRequirement: 0
  },
  silverOre: {
    name: 'Silver Ore',
    price: 450,
    sellPrice: 225,
    stack: 12,
    description: 'Ore containing traces of silver.',
    levelRequirement: 0
  },
  silverNugget: {
    name: 'Silver Nugget',
    price: 200,
    sellPrice: 100,
    stack: 12,
    description: 'A small silver nugget.',
    levelRequirement: 0
  },
  brassScales: {
    name: 'Brass Scales',
    price: 210,
    sellPrice: 105,
    stack: 12,
    description: 'Scales fashioned from brass.',
    levelRequirement: 0
  },
  mythrilChain: {
    name: 'Mythril Chain',
    price: 10500,
    sellPrice: 5250,
    stack: 12,
    description: 'A length of mythril chain.',
    levelRequirement: 0
  },
  redRock: {
    name: 'Red Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A red-colored rock used in goldsmithing.',
    levelRequirement: 0
  },
  blueRock: {
    name: 'Blue Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A blue-colored rock used in goldsmithing.',
    levelRequirement: 0
  },
  yellowRock: {
    name: 'Yellow Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A yellow-colored rock used in goldsmithing.',
    levelRequirement: 0
  },
  greenRock: {
    name: 'Green Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A green-colored rock used in goldsmithing.',
    levelRequirement: 0
  },
  translucentRock: {
    name: 'Translucent Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A faintly glowing rock.',
    levelRequirement: 0
  },
  purpleRock: {
    name: 'Purple Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A purple-colored rock used in goldsmithing.',
    levelRequirement: 0
  },
  blackRock: {
    name: 'Black Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A pitch-black rock used in goldsmithing.',
    levelRequirement: 0
  },
  whiteRock: {
    name: 'White Rock',
    price: 6440,
    sellPrice: 3220,
    stack: 1,
    description: 'A white rock used in goldsmithing.',
    levelRequirement: 0
  },
  ironSword: {
    name: 'Iron Sword',
    price: 7286,
        sellPrice: 3643,
    stack: 1,
    description: 'A sword forged of iron.',
    damage: 14,
    delay: 231,
    levelRequirement: 18,
    slot: 'mainHand',
    jobs: ['Warrior','Red Mage','Thief','Paladin','Dark Knight','Bard','Ranger','Ninja','Dragoon','Blue Mage','Rune Fencer']
  },
  mythrilSword: {
    name: 'Mythril Sword',
    price: 31648,
        sellPrice: 15824,
    stack: 1,
    description: 'A sword forged of mythril.',
    damage: 21,
    delay: 231,
    levelRequirement: 36,
    slot: 'mainHand',
    jobs: ['Warrior','Red Mage','Thief','Paladin','Dark Knight','Bard','Ranger','Ninja','Dragoon','Blue Mage','Rune Fencer']
  },
  broadsword: {
    name: 'Broadsword',
    price: 21535,
        sellPrice: 10767,
    stack: 1,
    description: 'A heavy broadsword.',
    damage: 19,
    delay: 233,
    levelRequirement: 30,
    slot: 'mainHand',
    jobs: ['Warrior','Red Mage','Paladin','Dark Knight','Blue Mage','Corsair','Rune Fencer']
  },
  tuck: {
    name: 'Tuck',
    price: 11845,
        sellPrice: 5922,
    stack: 1,
    description: 'A slender thrusting sword.',
    damage: 15,
    delay: 226,
    levelRequirement: 23,
    slot: 'mainHand',
    jobs: ['Warrior','Black Mage','Red Mage','Thief','Paladin','Dark Knight','Beastmaster','Bard','Ranger','Ninja','Dragoon','Corsair','Dancer','Rune Fencer']
  },
  sapara: {
    name: 'Sapara',
    price: 713,
        sellPrice: 356,
    stack: 1,
    description: 'A short curved sword.',
    damage: 9,
    delay: 236,
    levelRequirement: 7,
    slot: 'mainHand',
    jobs: ['Warrior','Thief','Dark Knight','Samurai','Blue Mage']
  },
  scimitar: {
    name: 'Scimitar',
    price: 4163,
        sellPrice: 2081,
    stack: 1,
    description: 'A curved sword favored in deserts.',
    damage: 13,
    delay: 236,
    levelRequirement: 13,
    slot: 'mainHand',
    jobs: ['Warrior','Thief','Dark Knight','Samurai','Blue Mage']
  },
  xiphos: {
    name: 'Xiphos',
    price: 618,
        sellPrice: 309,
    stack: 1,
    description: 'A short stabbing sword.',
    damage: 8,
    delay: 228,
    levelRequirement: 7,
    slot: 'mainHand',
    jobs: ['Warrior','Red Mage','Thief','Paladin','Dark Knight','Beastmaster','Bard','Ranger','Ninja','Dragoon','Blue Mage','Corsair','Rune Fencer']
  },
  spatha: {
    name: 'Spatha',
    price: 1711,
        sellPrice: 855,
    stack: 1,
    description: 'A straight double-edged sword.',
    damage: 11,
    delay: 240,
    levelRequirement: 9,
    slot: 'mainHand',
    jobs: ['Warrior','Red Mage','Paladin','Dark Knight','Rune Fencer']
  },
  warpRing: {
    name: 'Warp Ring',
    price: 0,
    stack: 1,
    description: 'Warp to Home Point.',
    slot: 'leftRing',
    levelRequirement: 0,
    jobs: baseJobNames
  },

  beastCollar: {
    name: 'Beast Collar',
    description: 'Necklace that boosts pet health when equipped.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Pet HP +20%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  judgesGorget: {
    name: "Judge's Gorget",
    description: 'Sturdy gorget worn by magistrates, increases defense.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['DEF +5'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  minersPendant: {
    name: "Miner's Pendant",
    description: 'Pendant favored by miners, boosts mining yield.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Mining yield +10%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  portafurnace: {
    name: 'Portafurnace',
    description: 'Portable furnace that provides heat to craft on the go.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    jobs: jobNames,
    abilities: ['Enable furnace crafting anywhere'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  chocoboPullusTorque: {
    name: 'Chocobo Pullus Torque',
    description: 'Necklace that increases chocobo sprint speed.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Chocobo Sprint +15%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  pileChain: {
    name: 'Pile Chain',
    description: 'Heavy chain necklace, grants resistance to earth magic.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Earth resist +10%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  buffoonsCollar: {
    name: "Buffoon's Collar",
    description: 'Necklace granting occasional evasion boost.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Occasional Evasion +5%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  buffoonsCollarPlus1: {
    name: "Buffoon's Collar +1",
    description: 'Enhanced version of Buffoon’s Collar with improved evasion.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Occasional Evasion +10%'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  featherCollar: {
    name: 'Feather Collar',
    description: 'Light collar that boosts ranged attack speed.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Ranged Attack Delay -5'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  featherCollarPlus1: {
    name: 'Feather Collar +1',
    description: 'Enhanced Feather Collar with greater speed boost.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Ranged Attack Delay -10'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  justiceBadge: {
    name: 'Justice Badge',
    description: 'Badge symbolizing civic duty, increases reputation gain.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Reputation gain +10%'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  leatherGorget: {
    name: 'Leather Gorget',
    description: 'Sturdy leather gorget providing moderate defense.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    defense: 2,
    vendors: [],
    keyItem: false,
    sellable: true
  },

  leatherGorgetPlus1: {
    name: 'Leather Gorget +1',
    description: 'Reinforced Leather Gorget with improved defense.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    defense: 3,
    vendors: [],
    keyItem: false,
    sellable: false
  },

  rabbitCharm: {
    name: 'Rabbit Charm',
    description: 'Lucky charm that slightly increases critical hit rate.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Critical Hit Rate +1%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  regenCollar: {
    name: 'Regen Collar',
    description: 'Collar that provides a slow HP regeneration effect.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['HP Regen Rate +5'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  silverNameTag: {
    name: 'Silver Name Tag',
    description: 'Tag identifying mercenary troops, boosts reputation.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Mercenary Fame +5'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  wingPendant: {
    name: 'Wing Pendant',
    description: 'Pendant with feather motif, increases movement speed.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Movement Speed +3%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  armigersLace: {
    name: "Armiger's Lace",
    description: 'Lace used in crafting high-tier weaponry; key crafting material.',
    price: 0,
    stack: 99,
    levelRequirement: 1,
    keyItem: false,
    sellable: true
  },

  dogCollar: {
    name: 'Dog Collar',
    description: 'Collar that slightly boosts pet defense.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    jobs: jobNames,
    effects: ['Pet DEF +5%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  greenScarf: {
    name: 'Green Scarf',
    description: 'Scarf that grants minor wind resistance.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Wind Resist +5%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  republicanBronzeMedal: {
    name: 'Republican Bronze Medal',
    description: 'Medal awarded by Bastok Republic; increases EXP gain slightly.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['EXP +1%'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  scaleGorget: {
    name: 'Scale Gorget',
    description: 'Metal gorget crafted from bronze scales, part of Scale Set.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    defense: 4,
    vendors: [],
    keyItem: false,
    sellable: true
  },

  rangersNecklace: {
    name: "Ranger's Necklace",
    description: 'Necklace that boosts ranged accuracy.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Ranged Accuracy +5'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  vanPendant: {
    name: 'Van Pendant',
    description: 'Pendant inscribed with Vanadiel sigil, grants minor magic boost.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Magic Accuracy +5'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  birdWhistle: {
    name: 'Bird Whistle',
    description: 'Tool used to summon and guide chocobos.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    abilities: ['Summon Chocobo'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  federationStablesScarf: {
    name: 'Federation Stables Scarf',
    description: 'Scarf awarded by San d’Oria stables, grants pet speed boost.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Pet Speed +10%'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  kingdomStablesCollar: {
    name: 'Kingdom Stables Collar',
    description: 'Collar awarded by Windurst stables, boosts pet MP.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Pet MP +20%'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  republicStablesMedal: {
    name: 'Republic Stables Medal',
    description: 'Medal awarded by Bastok stables, boosts pet HP.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Pet HP +20%'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  ceruleanPendant: {
    name: 'Cerulean Pendant',
    description: 'Pendant that grants water resistance.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Water Resist +10%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  focusCollar: {
    name: 'Focus Collar',
    description: 'Collar that increases magic focus for casters.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Magic Crit Rate +1%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  focusCollarPlus1: {
    name: 'Focus Collar +1',
    description: 'Enhanced Focus Collar with improved magic focus.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Magic Crit Rate +2%'],
    vendors: [],
    keyItem: false,
    sellable: false
  },

  blackSilkNeckerchief: {
    name: 'Black Silk Neckerchief',
    description: 'Silken neckerchief, increases evasion.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Evasion +5'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  bloodbeadAmulet: {
    name: 'Bloodbead Amulet',
    description: 'Amulet with magical bead, grants slight HP drain on attack.',
    price: 0,
    stack: 1,
    levelRequirement: 1,
    slot: 'neck',
    effects: ['Life Steal +2%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  chocoboWhistle: {
    name: 'Chocobo Whistle',
    description: 'Whistle used to summon chocobos in the field.',
    price: 0,
    stack: 1,
    abilities: ['Summon Chocobo'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  beetleGorget: {
    name: 'Beetle Gorget',
    description: 'Gorget made from beetle shell, increases poison resistance.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Poison Resist +10%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  fangNecklace: {
    name: 'Fang Necklace',
    description: 'Necklace made from monster fang, increases attack.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Attack +5'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  greenGorget: {
    name: 'Green Gorget',
    description: 'Gorget dyed green, increases wind resistance.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Wind Resist +10%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  spikeNecklace: {
    name: 'Spike Necklace',
    description: 'Necklace with metal spikes, grants HP bonus.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Max HP +20'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  hempGorget: {
    name: 'Hemp Gorget',
    description: 'Light gorget woven from hemp, provides minor defense.',
    price: 0,
    stack: 1,
    slot: 'neck',
    defense: 1,
    vendors: [],
    keyItem: false,
    sellable: true
  },

  hempGorgetPlus1: {
    name: 'Hemp Gorget +1',
    description: 'Reinforced Hemp Gorget with better defense.',
    price: 0,
    stack: 1,
    slot: 'neck',
    defense: 2,
    vendors: [],
    keyItem: false,
    sellable: false
  },

  beastWhistle: {
    name: 'Beast Whistle',
    description: 'Whistle used to call and calm wild beasts.',
    price: 0,
    stack: 1,
    abilities: ['Calm Beast'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  chainChoker: {
    name: 'Chain Choker',
    description: 'Metal choker granting small defense boost.',
    price: 0,
    stack: 1,
    slot: 'neck',
    defense: 2,
    vendors: [],
    keyItem: false,
    sellable: true
  },

  chainGorget: {
    name: 'Chain Gorget',
    description: 'Sturdy chain gorget, increases physical defense.',
    price: 0,
    stack: 1,
    slot: 'neck',
    defense: 4,
    vendors: [],
    keyItem: false,
    sellable: true
  },

  fineGorget: {
    name: 'Fine Gorget',
    description: 'Elegantly crafted gorget, grants charisma bonus.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Charisma +2'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  redChoker: {
    name: 'Red Choker',
    description: 'Choker with red gem, increases fire resistance.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Fire Resist +10%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  tigerStole: {
    name: 'Tiger Stole',
    description: 'Fur stole granting minor attack bonus.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Attack +3'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  holyPhial: {
    name: 'Holy Phial',
    description: 'Sacred flask that provides instant full HP restoration.',
    price: 0,
    stack: 1,
    abilities: ['Instant Full HP'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  buburimuGorget: {
    name: 'Buburimu Gorget',
    description: 'Gorget awarded for service in Buburimu Peninsula.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['EXP +2%'],
    vendors: [],
    keyItem: true,
    sellable: false
  },

  flowerNecklace: {
    name: 'Flower Necklace',
    description: 'Necklace garland of flowers, increases wind resistance.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Wind Resist +5%'],
    vendors: [],
    keyItem: false,
    sellable: true
  },

  sandCharm: {
    name: 'Sand Charm',
    description: 'Charm made from desert sand, grants earth resistance.',
    price: 0,
    stack: 1,
    slot: 'neck',
    effects: ['Earth Resist +10%'],
    vendors: [],
    keyItem: false,
    sellable: true
  }
};

const mapInventory = [
'bastokMap', 'sandoriaMap', 'windurstMap', 'jeunoMap', 'valkurmMap', 'ordellesCavesMap', 'ghelsbaMap', 'zeruhnMinesMap', 'palboroughMinesMap', 'beadeauxMap', 'giddeusMap', 'castleOztrojaMap', 'mazeOfShakhramiMap', 'liTelorMap', 'bibikiBayMap', 'qufimIslandMap', 'elshimoMap', 'eldiemeNecropolisMap', 'garlaigeCitadelMap', 'northlandsMap', 'kingRanperresTombMap', 'dangrufWadiMap', 'horutotoRuinsMap', 'bostaunieuxOublietteMap', 'toraimaraiCanalMap', 'gusgenMinesMap', 'crawlersNestMap', 'ranguemontPassMap', 'delfkuttsTowerMap', 'feiyinMap', 'castleZvahlMap', 'kuzotzMap', 'ruaunGardensMap', 'norgMap', 'templeOfUggalepihMap', 'denOfRancorMap', 'korrolokaTunnelMap', 'kuftalTunnelMap', 'boyahdaTreeMap', 'velugannonPalaceMap', 'ifritsCauldronMap', 'quicksandCavesMap', 'seaSerpentGrottoMap', 'vollbowRegionMap', 'labyrinthOfOnzozoMap', 'uleguerandRangeMap', 'attohwaChasmMap', 'psoxjaMap', 'oldtonMovalpolosMap', 'newtonMovalpolosMap', 'tavnaziaMap', 'aqueductsMap', 'sacrariumMap', 'capeRiverneMap', 'altaieuMap', 'huxzoiMap', 'ruHmetMap'
];

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
  'Guild Shop': ['bronzeIngot'],
  'Map Vendor': mapInventory,
  'Armor Shop': ['leatherVest', 'leatherGloves', 'clothHeadband', 'bronzeShield', 'leatherCap', 'leatherBoots'],
  'Weapon Shop': ['bronzeSword', 'bronzeDagger', 'bronzeAxe', 'bronzeSpear', 'willowStaff'],
  'Consumable Shop': ['potion', 'antidote', 'meatJerky', 'applePie', 'distilledWater', 'ether', 'honey'],
  'Arrow Shop': ['woodenArrow'],
  'Potion Shop': ['potion', 'antidote', 'ether'],
  'Sword Shop': ['bronzeSword'],
  'Dagger Shop': ['bronzeDagger', 'bronzeKnife'],
  'Staff Shop': ['willowStaff'],
  'Fishing Shop': ['bambooFishingRod', 'insectPaste', 'distilledWater'],
  'Fishing Guild': ['bambooFishingRod', 'insectPaste', 'distilledWater'],
  "Fisherman's Guild": ['bambooFishingRod', 'insectPaste', 'distilledWater'],
  'Cooking Guild': ['meatJerky', 'applePie', 'honey'],
  "Carpenter's Guild": ['arrowwoodLog'],
  'Clothcraft Guild': ['cottonThread'],
  "Boneworker's Guild": ['boneChip'],
  "Goldsmiths' Guild": ['copperIngot'],
  "Blacksmith's Guild": ['arquebus', 'aspis', 'baghnakh', 'battleaxe', 'bilbo', 'breastplate', 'bronzeAxe', 'bronzeBed', 'bronzeCap', 'bronzeHammer', 'bronzeHarness', 'bronzeIngot', 'bronzeKnuckles', 'bronzeKnife', 'bronzeLeggings', 'bronzeMittens', 'bronzeScales', 'bronzeSheet', 'bronzeSubligar', 'butterflyAxe', 'copperOre', 'crossbowBolt', 'cuisses', 'darksteelChain', 'darksteelFalchion', 'darksteelIngot', 'darksteelKnife', 'darksteelKnuckles', 'darksteelSheet', 'degen', 'falchion', 'gauntlets', 'gorget', 'greataxe', 'heavyAxe', 'ironChain', 'ironIngot', 'ironMittens', 'ironOre', 'ironScales', 'ironSheet', 'ironSubligar', 'knife', 'kukri', 'leggings', 'mandrel', 'maul', 'metalKnuckles', 'mythrilAxe', 'mythrilBolt', 'mythrilIngot', 'mythrilKnife', 'mythrilKnuckles', 'mythrilSheet', 'targe', 'tabar', 'tulwar', 'warhammer'],
  "Blacksmiths' Guild": ['arquebus', 'aspis', 'baghnakh', 'battleaxe', 'bilbo', 'breastplate', 'bronzeAxe', 'bronzeBed', 'bronzeCap', 'bronzeHammer', 'bronzeHarness', 'bronzeIngot', 'bronzeKnuckles', 'bronzeKnife', 'bronzeLeggings', 'bronzeMittens', 'bronzeScales', 'bronzeSheet', 'bronzeSubligar', 'butterflyAxe', 'copperOre', 'crossbowBolt', 'cuisses', 'darksteelChain', 'darksteelFalchion', 'darksteelIngot', 'darksteelKnife', 'darksteelKnuckles', 'darksteelSheet', 'degen', 'falchion', 'gauntlets', 'gorget', 'greataxe', 'heavyAxe', 'ironChain', 'ironIngot', 'ironMittens', 'ironOre', 'ironScales', 'ironSheet', 'ironSubligar', 'knife', 'kukri', 'leggings', 'mandrel', 'maul', 'metalKnuckles', 'mythrilAxe', 'mythrilBolt', 'mythrilIngot', 'mythrilKnife', 'mythrilKnuckles', 'mythrilSheet', 'targe', 'tabar', 'tulwar', 'warhammer'],
  'Blacksmith Supplies': ['workshopAnvil', 'mandrel', 'copperOre', 'bronzeNugget', 'tinOre', 'bronzeSheet', 'ironOre', 'kopparnickelOre', 'ironNugget', 'ironSheet', 'steelSheet', 'steelIngot', 'tamaHagane', 'darksteelNugget', 'darksteelOre', 'steelNugget', 'darksteelSheet', 'swampOre', 'smithingKit', 'niobiumOre'],
  'Mining Guild': ['pickaxe', 'copperOre'],
  Nogga: ['soot', 'bombArm', 'grenade', 'catalyticOil'],
  Olaf: ['arquebus', 'bullet', 'bombAsh'],
  Tomasa: ['sausageRoll', 'hardBoiledEgg', 'eggSoup', 'pineappleJuice', 'bretzel', 'sausage', 'melonJuice', 'ironBread', 'bakedPopoto'],
  Takiyah: ['magicPotShard'],
  "Boytz's Knickknacks": ['potion', 'ether', 'echoDrops', 'eyeDrops', 'antidote', 'woodenArrow', 'ironArrow', 'crossbowBolt', 'brassFlowerpot', 'pickaxe', 'republicWaystone', 'thievesTools', 'livingKey'],
  "Gelzerio's Stall": ['lugworm', 'littleWorm', 'bambooFishingRod', 'yewFishingRod', 'willowFishingRod', 'robe', 'cuffs', 'slops', 'ashClogs', 'headgear', 'doublet', 'gloves', 'brais', 'gaiters'],
  Ostalie: ['robe', 'cuffs', 'slops'],
  'Guruna-Magurama': ['robe', 'cuffs', 'slops', 'ashClogs', 'headgear', 'doublet', 'gloves', 'brais', 'gaiters', 'leatherVest', 'leatherGloves', 'cottonHachimaki', 'cottonDogi', 'cottonTekko', 'cottonSitabaki', 'cottonKyahan'],
  'Kuzah Hpirohpon': ['cuffs', 'slops', 'headgear', 'doublet', 'gloves', 'gaiters'],
  'Taten-Bilten': ['cuffs', 'slops'],
  Pirvidiauce: ['ashClogs'],
  Chaupire: ['ashClogs'],
  'Dehbi Moshal': ['ashClogs'],
  Kumama: ['brais', 'gaiters', 'leatherTrousers'],
  'Kueh Igunahmori': ['leatherHighboots'],
  Meriri: ['headgear', 'doublet', 'gloves', 'gaiters'],
  "Deegis's Armour": ['paddedCap', 'ironMask', 'paddedArmor', 'ironMittens', 'brassCap', 'brassCapPlus1', 'leatherBandana', 'brassHarness', 'brassHarnessPlus1', 'leatherVest', 'brassMittens', 'brassMittensPlus1', 'brassSubligar', 'brassSubligarPlus1', 'leatherGloves', 'bronzeCap', 'bronzeHarness', 'chainmail', 'bronzeMittens', 'chainMittens'],
  Zemedars: ['ironSubligar', 'lizardTrousers', 'leggings', 'lizardLedelsens', 'buckler', 'brassSubligar', 'leatherTrousers', 'brassLeggings', 'leatherHighboots', 'targe', 'bronzeSubligar', 'chainHose', 'bronzeLeggings', 'greaves', 'lauanShield'],
  'Proud Beard': ['humeTunic', 'humeVest', 'humeMGloves', 'humeFGloves', 'humeSlacks', 'humeMBoots', 'humeFBoots', 'galkanSurcoat', 'galkanBracers', 'galkanBraguette', 'galkanSandals'],
  "Neigepance's Chocobo Stables": ['gysahlGreens', 'chocoboFeather', 'dart', 'blackChocoboFeather', 'petFoodAlphaBiscuit', 'petFoodBetaBiscuit', 'carrotBroth', 'bugBroth', 'herbalBroth', 'carrionBroth', 'scrollChocoboMazurka'],
  "Griselda's Tavern": ['pineappleJuice', 'bretzel', 'pickledHerring', 'melonJuice', 'ironBread', 'meatJerky', 'distilledWater'],
  "Alchemists' Guild": ['triturator', 'beehiveChip', 'cobaltJellyfish', 'potion', 'hiPotion', 'ether', 'antidote', 'eyeDrops', 'echoDrops', 'holyWater', 'prismPowder', 'bombAsh'],
  "Rodellieux's Stall": ['beaugreens', 'faerieApple', 'mapleLog'],
  Denvihr: ['ashLog', 'chestnutLog', 'oakLog', 'copperOre', 'ironOre', 'mythrilOre', 'mokoGrass', 'birdEgg', 'flaxFlower', 'kaiserinCosmetics'],
  Blabbivix: ['blackChip', 'blueChip', 'clearChip', 'greenChip', 'purpleChip', 'redChip', 'whiteChip', 'yellowChip'],
  Galvin: ['potion', 'ether', 'echoDrops', 'eyeDrops', 'antidote', 'woodenArrow', 'ironArrow', 'crossbowBolt'],
  Ilita: ['linkshell', 'pendantCompass'],
  Numa: ['cottonHachimaki', 'cottonDogi', 'cottonTekko', 'cottonSitabaki', 'cottonKyahan', 'silverObi', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan', 'bambooStick', 'pickaxe', 'toolbagIno', 'toolbagShika', 'toolbagCho'],
  Coullave: ['cottonHachimaki', 'cottonDogi', 'cottonTekko', 'cottonSitabaki', 'cottonKyahan', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan'],
  'Silver Owl': ['hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan'],
  Akamafula: ['cottonHachimaki', 'cottonDogi', 'cottonTekko', 'cottonSitabaki', 'cottonKyahan', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan'],
  Tsutsuroon: ['cottonHachimaki', 'cottonDogi', 'cottonTekko', 'cottonSitabaki', 'cottonKyahan', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan'],
  Melloa: ['ironBread', 'bretzel', 'pumpernickel', 'sausage', 'bakedPopoto', 'pebbleSoup', 'pineappleJuice', 'melonJuice', 'roastMutton', 'eggSoup', 'distilledWater'],
  Sawyer: ['ironBread', 'bretzel', 'pumpernickel', 'sausage', 'bakedPopoto', 'pebbleSoup', 'pineappleJuice', 'melonJuice', 'roastMutton', 'eggSoup', 'distilledWater'],
  Sugandhi: ['degen'],
  Belka: ['derflandPear', 'ginger', 'gysahlGreens', 'oliveFlower', 'oliveOil', 'wijnruit'],
  'Zoby Quhyo': ['kazhamPeppers', 'kazhamPineapple', 'mithranTomato', 'blackPepper', 'ogrePumpkin', 'kukuruBean', 'phalaenopsis'],
  'Dhen Tevryukoh': ['cattleya', 'cinnamon', 'pamamas', 'rattanLumber'],
  Evelyn: ['sulfur', 'popoto', 'ryeFlour', 'eggplant'],
  Vattian: ['cactuarNeedle', 'thundermelon', 'watermelon'],
  Rosswald: ['giantSheepMeat', 'driedMarjoram', 'sanDoriaFlour', 'ryeFlour', 'semolina', 'laTheineCabbage', 'selbinaMilk'],
  Bagnobrok: ['movalpolosWater', 'copperOre', 'danceshroom', 'coralFungus', 'kopparnickel'],
  Kachada: ['worldPass', 'goldWorldPass'],
  Rex: mapInventory,
  Karine: mapInventory,
  Elesca: mapInventory,
  Violitte: mapInventory,
  'Mhoji Roccoruh': mapInventory,
  'Pehki Machumaht': mapInventory,
  Ludwig: mapInventory,
  Lombaria: mapInventory,
  Promurouve: mapInventory,
  Rusese: mapInventory,
  Antiqix: mapInventory,
  Haggleblix: mapInventory,
  Lootblox: mapInventory,
  Riyadahf: mapInventory,
  Balthilda: ['poetsCirclet', 'linenRobe', 'linenCuffs', 'linenSlops', 'hollyClogs', 'leatherRing'],
  'Charging Chocobo': ['mythrilCuisses', 'mythrilLeggings', 'brassCuisses', 'cuisses', 'brassGreaves', 'plateLeggings', 'gorget', 'bronzeSubligar', 'scaleCuisses', 'bronzeLeggings', 'scaleGreaves', 'leatherBelt', 'silverBelt', 'brassCap', 'brassCapPlus1', 'brassSubligar'],
  'Brunhilde the Armourer': ['mythrilSallet', 'breastplate', 'gauntlets', 'brassMask', 'sallet', 'brassScaleMail', 'brassFingerGauntlets', 'bronzeCap', 'faceguard', 'bronzeHarness', 'scaleMail', 'bronzeMittens', 'scaleFingerGauntlets', 'mythrilCuisses', 'mythrilLeggings', 'brassCuisses', 'cuisses', 'brassGreaves', 'plateLeggings', 'gorget', 'bronzeSubligar', 'scaleCuisses', 'bronzeLeggings', 'scaleGreaves', 'leatherBelt', 'silverBelt'],
  Miogique: ['bronzeCap', 'bronzeHarness', 'bronzeMittens', 'leatherBandana', 'leatherVest', 'leatherGloves'],
  Brunhilde: ['bronzeCap', 'bronzeHarness', 'bronzeMittens', 'brassCap', 'brassCapPlus1', 'brassHarness', 'brassHarnessPlus1', 'brassMittens', 'brassMittensPlus1', 'brassSubligar', 'brassSubligarPlus1', 'brassLeggings', 'brassLeggingsPlus1', 'faceguard', 'scaleMail', 'scaleFingerGauntlets'],
  Victoire: ['faceguard', 'scaleMail', 'scaleFingerGauntlets', 'scaleCuisses', 'scaleGreaves'],
  Drozga: ['faceguard', 'scaleMail', 'scaleFingerGauntlets', 'scaleCuisses', 'scaleGreaves'],
  'Orez-Ebrez': ['bronzeCap', 'leatherBandana'],
  Graine: ['bronzeCap', 'bronzeHarness', 'bronzeMittens', 'bronzeSubligar', 'bronzeLeggings', 'brassCap', 'brassHarness', 'leatherBandana', 'leatherVest', 'leatherGloves', 'leatherTrousers'],
  Rolandienne: ['bronzeCap', 'bronzeHarness', 'bronzeMittens', 'bronzeSubligar', 'bronzeLeggings', 'brassCap', 'brassHarness', 'robe', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan', 'faceguard', 'scaleMail', 'scaleFingerGauntlets', 'scaleCuisses', 'scaleGreaves'],
  Isakoth: ['bronzeCap', 'bronzeHarness', 'bronzeMittens', 'bronzeSubligar', 'bronzeLeggings', 'brassCap', 'brassHarness', 'brassMittens', 'robe', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan', 'faceguard', 'scaleMail', 'scaleFingerGauntlets', 'scaleCuisses', 'scaleGreaves'],
  'Fhelm Jobeizat': ['bronzeCap', 'bronzeHarness', 'bronzeMittens', 'bronzeLeggings', 'brassCap', 'robe', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan', 'faceguard', 'scaleMail', 'scaleFingerGauntlets', 'scaleCuisses', 'scaleGreaves'],
  'Eternal Flame': ['bronzeCap', 'bronzeHarness', 'bronzeMittens', 'bronzeLeggings', 'brassCap', 'robe', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan', 'faceguard', 'scaleMail', 'scaleFingerGauntlets', 'scaleCuisses', 'scaleGreaves'],
  Ryan: ['bronzeHarness', 'bronzeMittens', 'bronzeSubligar', 'bronzeLeggings', 'brassCap', 'brassHarness', 'brassMittens', 'brassLeggings', 'hachimaki', 'kenpogi', 'tekko', 'sitabaki', 'kyahan'],
  Carautia: ['bronzeSubligar', 'bronzeLeggings', 'brassCap', 'brassCapPlus1', 'brassHarness', 'brassHarnessPlus1', 'brassMittens', 'brassMittensPlus1', 'brassSubligar', 'brassSubligarPlus1', 'brassLeggings', 'brassLeggingsPlus1', 'leatherTrousers', 'leatherHighboots'],
  'Tahn Posbei': ['leatherBandana', 'leatherVest', 'leatherGloves'],
  'Ciqala': [
    'bronzeKnuckles', 'brassKnuckles', 'metalKnuckles',
    'cesti', 'brassBaghnakhs', 'catBaghnakhs',
    'bronzeHammer', 'brassHammer', 'warhammer',
    'mapleWand', 'ashClub', 'bronzeRod', 'brassRod',
    'ashStaff', 'ashPole'
  ],
  'Peritrage': [
    'bronzeAxe', 'brassAxe', 'battleaxe', 'butterflyAxe', 'greataxe',
    'bronzeKnife', 'knife', 'kukri', 'bronzeDagger', 'brassDagger'
  ],
  'Zhikkom': ['bronzeSword', 'ironSword', 'mythrilSword', 'broadsword', 'degen', 'tuck', 'sapara', 'scimitar', 'falchion', 'xiphos', 'spatha', 'bilbo'],
  'Carmelide': ['tourmaline', 'sardonyx', 'amethyst', 'amber', 'lapisLazuli', 'clearTopaz', 'onyx', 'lightOpal', 'copperRing'],
  Raghd: ['silverRing', 'silverEarring', 'brassRing', 'copperRing'],
  "Mjoll's General Goods": [
    'woodenArrow', 'ironArrow', 'silverArrow', 'scrollDarkThrenody', 'scrollIceThrenody',
    'lightCrossbow', 'crossbow', 'zamburak', 'crossbowBolt', 'mythrilBolt', 'tathlum',
    'eyeDrops', 'antidote', 'echoDrops', 'potion', 'ether'
  ],
  Mjoll: ['woodenArrow', 'ironArrow', 'silverArrow', 'scrollDarkThrenody', 'scrollIceThrenody', 'lightCrossbow', 'crossbow', 'zamburak', 'crossbowBolt', 'mythrilBolt', 'tathlum'],
  Olwyn: ['eyeDrops', 'antidote', 'echoDrops', 'potion', 'ether'],
  Harmodios: ['piccolo', 'cornette', 'mapleHarp', 'scrollVitalEtude', 'scrollSwiftEtude', 'scrollSageEtude', 'scrollLogicalEtude', 'scrollHerculeanEtude', 'scrollUncannyEtude', 'gemshorn', 'flute', 'scrollBewitchingEtude', 'foeSirvente', 'adventurersDirge'],
  Hortense: ['scrollFoeRequiemI', 'scrollFoeRequiemII', 'scrollFoeRequiemIII', 'scrollFoeRequiemIV', 'scrollFoeRequiemVII', 'scrollArmysPaeon', 'scrollArmysPaeonII', 'scrollArmysPaeonIII', 'scrollArmysPaeonIV', 'scrollArmysPaeonVI', 'scrollValorMinuet', 'scrollValorMinuetII', 'scrollValorMinuetIII', 'scrollValorMinuetV'],
  Sororo: ['scrollDiaga', 'scrollStoneskin', 'scrollSlow', 'scrollCureII', 'scrollBanish', 'scrollBanishga', 'scrollBlink', 'scrollCure', 'scrollCuraga', 'scrollPoisona', 'scrollParalyna', 'scrollBlindna', 'scrollDia', 'scrollProtect', 'scrollShell', 'scrollRepose'],
  Zaira: ['scrollBlind', 'scrollBio', 'scrollPoison', 'scrollSleep', 'scrollAero', 'scrollBlizzard', 'scrollBurn', 'scrollChoke', 'scrollDrown', 'scrollFire', 'scrollFrost', 'scrollRasp', 'scrollShock', 'scrollStone', 'scrollThunder', 'scrollWater'],
  Teerth: ['workshopAnvil', 'mandrel', 'zincOre', 'copperOre', 'brassNugget', 'brassSheet', 'silverOre', 'silverNugget', 'tourmaline', 'sardonyx', 'clearTopaz', 'amethyst', 'lapisLazuli', 'amber', 'onyx'],
  Visala: ['silverOre', 'mythrilOre', 'brassScales', 'mythrilChain', 'redRock', 'blueRock', 'yellowRock', 'greenRock', 'translucentRock', 'purpleRock', 'blackRock', 'whiteRock', 'lapisLazuli', 'lightOpal', 'onyx', 'amethyst', 'tourmaline', 'sardonyx', 'clearTopaz']
};

// Map vendor NPCs to their shop inventories
vendorInventories.Boytz = vendorInventories["Boytz's Knickknacks"];
vendorInventories.Gelzerio = vendorInventories["Gelzerio's Stall"];
vendorInventories.Deegis = vendorInventories["Deegis's Armour"];
vendorInventories.Neigepance = vendorInventories["Neigepance's Chocobo Stables"];
vendorInventories.Griselda = vendorInventories["Griselda's Tavern"];
vendorInventories.Amulya = vendorInventories["Blacksmith's Guild"];
vendorInventories['Vicious Eye'] = vendorInventories['Blacksmith Supplies'];
vendorInventories.Odoba = vendorInventories["Alchemists' Guild"];
vendorInventories.Maymunah = vendorInventories["Alchemists' Guild"];
vendorInventories.Rodellieux = vendorInventories["Rodellieux's Stall"];

export const shopNpcs = {
  'Brunhilde\'s Armory': ['Brunhilde the Armourer', 'Balthilda', 'Charging Chocobo'],
  "Dragon's Claw Weaponry": ['Ciqala', 'Peritrage', 'Zhikkom'],
  "Carmelide's Jewelry Store": ['Carmelide', 'Raghd'],
  "Harmodios's Music Shop": ['Harmodios', 'Hortense'],
  'Scribe & Notary': ['Sororo', 'Zaira'],
  "Galvin's Travel Gear": ['Galvin', 'Ilita', 'Numa'],
  'Steaming Sheep Restaurant': ['Melloa', 'Sawyer'],
  "Boytz's Knickknacks": ['Boytz'],
  "Gelzerio's Stall": ['Gelzerio'],
  "Deegis's Armour": ['Deegis', 'Zemedars'],
  'Proud Beard': ['Proud Beard'],
  "Neigepance's Chocobo Stables": ['Neigepance'],
  "Griselda's Tavern": ['Griselda'],
  "Blacksmith's Guild": ['Amulya'],
  "Goldsmiths' Guild": ['Teerth', 'Visala'],
  'Blacksmith Supplies': ['Vicious Eye'],
  'Gunpowder Room': ['Nogga', 'Olaf'],
  "Craftsmen's Eatery": ['Tomasa'],
  'Qufim Regional Goods': ['Takiyah'],
  "Mjoll's General Goods": ['Mjoll', 'Olwyn'],
  "Alchemists' Guild": ['Odoba', 'Maymunah'],
  "Rodellieux's Stall": ['Rodellieux'],
  'Map Vendor': ['Karine', 'Rex', 'Elesca', 'Violitte', 'Mhoji Roccoruh', 'Pehki Machumaht', 'Ludwig', 'Lombaria', 'Promurouve', 'Rusese', 'Antiqix', 'Haggleblix', 'Lootblox', 'Riyadahf']
};

export const vendorGreetings = {
  'Brunhilde the Armourer': "Welcome to my armoury, traveler!",
  Balthilda: 'Quality attire at fair prices.',
  'Charging Chocobo': 'Armor fit for any rider.',
  'Ciqala': 'Looking for a new weapon? Take your pick.',
  'Carmelide': 'Only the finest jewels for sale here.',
  Raghd: 'Rings and trinkets for discerning buyers.',
  'Hortense': 'Care to peruse my collection of scores?',
  'Sororo': 'Official documents and scrolls, right this way.',
  'Galvin': 'Travel gear for every journey!',
  'Ilita': 'Linkshells and rare trinkets at fair prices.',
  'Numa': 'Sturdy gear for the road.',
  'Melloa': 'Hungry? We have fresh meals ready.',
  'Sawyer': 'Sit and relax, I will serve you shortly.',
  'Boytz': 'Knickknacks and oddities galore!',
  'Gelzerio': 'Need supplies? Take a look.',
  'Deegis': 'Armor to keep you standing strong.',
  'Zemedars': 'Protect your legs and feet with my wares.',
  'Proud Beard': 'Finest clothing in Bastok!',
  'Neigepance': 'Chocobo supplies for the discerning rider.',
  'Griselda': 'Welcome, have a seat and enjoy.',
  'Amulya': 'Smithing goods for your craft.',
  'Vicious Eye': 'Tools and metals, sharp and true.',
  'Nogga': 'Handle these explosives with care!',
  'Olaf': 'Ammunition and powder ready to go.',
  'Olwyn': 'Take a look at our fine goods.',
  'Mjoll': 'Take a look at our fine goods.',
  'Tomasa': 'A warm meal will do you good.',
  'Takiyah': 'Goods from distant Qufim, just in.',
  'Odoba': 'Potions brewed to perfection.',
  'Maymunah': 'Alchemical supplies for any venture.',
  'Rodellieux': 'Fresh produce and lumber, take your pick.',
  'Miogique': 'Bronze armor for the discerning adventurer.',
  'Brunhilde': 'Strong armor for budding heroes.',
  'Victoire': 'Sturdy armor for San d\'Oria adventurers.',
  'Drozga': 'Scale armor for Windurst\'s finest.',
  'Orez-Ebrez': 'Quality gear from Windurst waters.',
  'Graine': 'Sturdy equipment for your travels.',
  'Rolandienne': 'Earned some sparks? Spend them here.',
  'Isakoth': 'Sparks gear ready for you.',
  'Fhelm Jobeizat': 'Trade your sparks for gear.',
  'Eternal Flame': 'Sparks and armor for adventurers.',
  'Coullave': 'Gear from the Far East to hone your skills.',
  'Silver Owl': 'Training gear at fair prices.',
  'Akamafula': 'Quality gear from Jeuno.',
  'Tsutsuroon': 'Exotic goods for wandering warriors.',
  'Ostalie': 'Robes and starter gear for mages.',
  'Guruna-Magurama': 'Cloth armor for any adventurer.',
  'Kuzah Hpirohpon': 'Eastern styles at fair prices.',
  'Taten-Bilten': 'Gear fresh from Aht Urhgan.',
  'Pirvidiauce': 'Need new clogs? I have them.',
  'Chaupire': 'Footwear to keep you light.',
  'Dehbi Moshal': 'Sturdy clogs for your journeys.',
  'Kumama': 'Quality legwear and footwear.',
  'Kueh Igunahmori': 'Finely crafted boots for any traveler.',
  'Meriri': 'Cloth armor for discerning buyers.',
  'Ryan': 'Have a look at my wares.',
  'Carautia': 'Protect your legs and feet with my goods.',
  'Tahn Posbei': 'Gear up for the jungles of Kazham.',
  'Peritrage': 'Axes and blades for every adventurer.',
  'Zhikkom': 'Quality daggers at a fair price.'
};

export const vendorTypes = {
  'Brunhilde the Armourer': 'armor',
  Balthilda: 'clothing',
  'Charging Chocobo': 'armor',
  'Ciqala': 'weapons',
  'Carmelide': 'jewelry',
  Raghd: 'jewelry',
  'Hortense': 'music',
  'Sororo': 'scribery',
  'Galvin': 'travel gear',
  'Ilita': 'linkshells',
  'Numa': 'equipment',
  'Melloa': 'food',
  'Sawyer': 'food',
  'Boytz': 'knickknacks',
  'Gelzerio': 'supplies',
  'Deegis': 'armor',
  'Zemedars': 'armor',
  'Proud Beard': 'clothing',
  'Neigepance': 'chocobo gear',
  'Griselda': 'tavern fare',
  'Amulya': 'smithing goods',
  'Vicious Eye': 'smithing supplies',
  'Nogga': 'explosives',
  'Olaf': 'ammunition',
  'Olwyn': 'general goods',
  'Mjoll': 'general goods',
  'Tomasa': 'meals',
  'Takiyah': 'regional goods',
  'Odoba': 'alchemy',
  'Maymunah': 'alchemy',
  'Rodellieux': 'produce',
  'Miogique': 'armor',
  'Brunhilde': 'armor',
  'Victoire': 'armor',
  'Drozga': 'armor',
  'Orez-Ebrez': 'armor',
  'Graine': 'armor',
  'Rolandienne': 'armor',
  'Isakoth': 'armor',
  'Fhelm Jobeizat': 'armor',
  'Eternal Flame': 'armor',
  'Coullave': 'armor',
  'Silver Owl': 'armor',
  'Akamafula': 'armor',
  'Tsutsuroon': 'armor',
  Ostalie: 'clothing',
  'Guruna-Magurama': 'clothing',
  'Kuzah Hpirohpon': 'clothing',
  'Taten-Bilten': 'clothing',
  Pirvidiauce: 'clothing',
  Chaupire: 'clothing',
  'Dehbi Moshal': 'clothing',
  Kumama: 'clothing',
  Meriri: 'clothing',
  'Ryan': 'armor',
  'Carautia': 'armor',
  'Tahn Posbei': 'armor',
  'Kueh Igunahmori': 'armor',
  'Peritrage': 'weapons',
  'Zhikkom': 'weapons',
  'Karine': 'maps', 'Rex': 'maps', 'Elesca': 'maps', 'Violitte': 'maps',
  'Mhoji Roccoruh': 'maps', 'Pehki Machumaht': 'maps', 'Ludwig': 'maps',
  'Lombaria': 'maps', 'Promurouve': 'maps', 'Rusese': 'maps', 'Antiqix': 'maps',
  'Haggleblix': 'maps', 'Lootblox': 'maps', 'Riyadahf': 'maps'
};

export const conquestRewards = {
  instantReraise: 7,
  instantWarp: 10,
  returnRing: 2500,
  homingRing: 9000,
  chariotBand: 500,
  empressBand: 1000,
  emperorBand: 2000,
  warpRing: 5000
};

// Apply default flags and mark map items as key items
Object.values(items).forEach(it => {
  if (it.sellable === undefined) it.sellable = true;
  if (/^Map of/i.test(it.name)) {
    it.keyItem = true;
    it.sellable = false;
  }
});
