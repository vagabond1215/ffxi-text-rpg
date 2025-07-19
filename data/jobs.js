export const jobs = [
  {
    name: 'Warrior',
    proficiencies: { hp: 'B', mp: 'X', str: 'A', dex: 'C', vit: 'D', agi: 'C', int: 'F', mnd: 'F', chr: 'E' },
    traits: [
      { name: 'Defense Bonus', effect: 'Increases defense', level: 10 }
    ],
    abilities: [
      { name: 'Provoke', effect: 'Forces enemy attention', level: 5 }
    ]
  },
  {
    name: 'Monk',
    proficiencies: { hp: 'A', mp: 'X', str: 'C', dex: 'B', vit: 'A', agi: 'F', int: 'G', mnd: 'D', chr: 'E' },
    traits: [
      { name: 'Max HP Boost', effect: 'Raises maximum HP', level: 10 }
    ],
    abilities: [
      { name: 'Chakra', effect: 'Restores HP', level: 35 }
    ]
  },
  {
    name: 'White Mage',
    proficiencies: { hp: 'E', mp: 'C', str: 'D', dex: 'F', vit: 'D', agi: 'E', int: 'E', mnd: 'A', chr: 'C' },
    traits: [
      { name: 'Auto Refresh', effect: 'Regenerates MP over time', level: 45 }
    ],
    abilities: [
      { name: 'Benediction', effect: 'Restores HP to party', level: 1 }
    ]
  },
  {
    name: 'Black Mage',
    proficiencies: { hp: 'F', mp: 'B', str: 'F', dex: 'C', vit: 'F', agi: 'C', int: 'A', mnd: 'E', chr: 'D' },
    traits: [
      { name: 'Magic Attack Bonus', effect: 'Boosts magic damage', level: 20 }
    ],
    abilities: [
      { name: 'Elemental Seal', effect: 'Improves spell accuracy', level: 15 }
    ]
  },
  {
    name: 'Red Mage',
    proficiencies: { hp: 'D', mp: 'D', str: 'D', dex: 'D', vit: 'E', agi: 'E', int: 'C', mnd: 'C', chr: 'D' },
    traits: [
      { name: 'Fast Cast', effect: 'Shortens casting time', level: 15 }
    ],
    abilities: [
      { name: 'Convert', effect: 'Swaps HP and MP', level: 40 }
    ]
  },
  {
    name: 'Thief',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'A', vit: 'D', agi: 'B', int: 'C', mnd: 'G', chr: 'G' },
    traits: [
      { name: 'Treasure Hunter', effect: 'Improves drop rates', level: 5 }
    ],
    abilities: [
      { name: 'Steal', effect: 'Attempts to steal an item', level: 5 }
    ]
  },
  {
    name: 'Paladin',
    proficiencies: { hp: 'C', mp: 'F', str: 'B', dex: 'E', vit: 'A', agi: 'G', int: 'G', mnd: 'C', chr: 'C' },
    traits: [
      { name: 'Shield Mastery', effect: 'Blocks more often', level: 10 }
    ],
    abilities: [
      { name: 'Cover', effect: 'Protects an ally', level: 35 }
    ]
  },
  {
    name: 'Dark Knight',
    proficiencies: { hp: 'C', mp: 'F', str: 'A', dex: 'C', vit: 'C', agi: 'D', int: 'C', mnd: 'G', chr: 'G' },
    traits: [
      { name: 'Attack Bonus', effect: 'Increases attack', level: 10 }
    ],
    abilities: [
      { name: 'Souleater', effect: 'Converts HP to damage', level: 30 }
    ]
  },
  {
    name: 'Beastmaster',
    proficiencies: { hp: 'C', mp: 'X', str: 'D', dex: 'C', vit: 'D', agi: 'F', int: 'E', mnd: 'E', chr: 'A' },
    traits: [
      { name: 'Charm', effect: 'Tame beasts for a time', level: 1 }
    ],
    abilities: [
      { name: 'Feral Howl', effect: 'Weakens a beast', level: 45 }
    ]
  },
  {
    name: 'Bard',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'D', vit: 'D', agi: 'F', int: 'D', mnd: 'D', chr: 'B' },
    traits: [
      { name: 'Song Spellcasting Time', effect: 'Faster song casting', level: 20 }
    ],
    abilities: [
      { name: "Mage's Ballad", effect: 'Restores MP over time', level: 25 }
    ]
  },
  {
    name: 'Ranger',
    proficiencies: { hp: 'E', mp: 'X', str: 'E', dex: 'D', vit: 'D', agi: 'A', int: 'E', mnd: 'D', chr: 'E' },
    traits: [
      { name: 'Accuracy Bonus', effect: 'Increases ranged accuracy', level: 10 }
    ],
    abilities: [
      { name: 'Barrage', effect: 'Fires multiple shots at once', level: 30 }
    ]
  },
  {
    name: 'Samurai',
    proficiencies: { hp: 'B', mp: 'X', str: 'C', dex: 'C', vit: 'C', agi: 'D', int: 'E', mnd: 'E', chr: 'D' },
    traits: [
      { name: 'Store TP', effect: 'Gain extra TP per hit', level: 10 }
    ],
    abilities: [
      { name: 'Meditate', effect: 'Instantly gains TP', level: 30 }
    ]
  },
  {
    name: 'Ninja',
    proficiencies: { hp: 'D', mp: 'X', str: 'C', dex: 'B', vit: 'C', agi: 'B', int: 'D', mnd: 'G', chr: 'F' },
    traits: [
      { name: 'Dual Wield', effect: 'Allows wielding two weapons', level: 10 }
    ],
    abilities: [
      { name: 'Mijin Gakure', effect: 'Deals damage at cost of HP', level: 25 }
    ]
  },
  {
    name: 'Dragoon',
    proficiencies: { hp: 'C', mp: 'X', str: 'C', dex: 'E', vit: 'C', agi: 'E', int: 'F', mnd: 'E', chr: 'C' },
    traits: [
      { name: 'Accuracy Bonus', effect: 'Increases accuracy', level: 10 }
    ],
    abilities: [
      { name: 'Jump', effect: 'Deals jumping attack', level: 1 }
    ]
  },
  {
    name: 'Summoner',
    proficiencies: { hp: 'G', mp: 'A', str: 'G', dex: 'D', vit: 'G', agi: 'D', int: 'B', mnd: 'C', chr: 'C' },
    traits: [
      { name: 'Avatar Cost Down', effect: 'Lowers avatar upkeep', level: 25 }
    ],
    abilities: [
      { name: 'Astral Flow', effect: 'Enables powerful avatar attack', level: 1 }
    ]
  },
  {
    name: 'Blue Mage',
    proficiencies: { hp: 'C', mp: 'D', str: 'C', dex: 'C', vit: 'C', agi: 'D', int: 'D', mnd: 'D', chr: 'C' },
    traits: [
      { name: 'Blue Magic Attack Bonus', effect: 'Boosts blue magic', level: 30 }
    ],
    abilities: [
      { name: 'Azure Lore', effect: 'Enhances blue magic', level: 1 }
    ]
  },
  {
    name: 'Corsair',
    proficiencies: { hp: 'D', mp: 'E', str: 'E', dex: 'C', vit: 'D', agi: 'B', int: 'D', mnd: 'D', chr: 'B' },
    traits: [
      { name: 'Phantom Roll', effect: 'Provides party bonuses', level: 5 }
    ],
    abilities: [
      { name: 'Wild Card', effect: 'Resets ability timers', level: 70 }
    ]
  },
  {
    name: 'Puppetmaster',
    proficiencies: { hp: 'C', mp: 'E', str: 'D', dex: 'C', vit: 'D', agi: 'C', int: 'D', mnd: 'D', chr: 'C' },
    traits: [
      { name: 'Automaton Max HP Bonus', effect: 'Increases automaton HP', level: 10 }
    ],
    abilities: [
      { name: 'Overdrive', effect: 'Enhances automaton abilities', level: 1 }
    ]
  },
  {
    name: 'Dancer',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'A', vit: 'C', agi: 'C', int: 'C', mnd: 'G', chr: 'C' },
    traits: [
      { name: 'Sambas', effect: 'Adds healing or debuff effects', level: 5 }
    ],
    abilities: [
      { name: 'Trance', effect: 'Unlimited step usage', level: 1 }
    ]
  },
  {
    name: 'Scholar',
    proficiencies: { hp: 'E', mp: 'B', str: 'E', dex: 'D', vit: 'D', agi: 'D', int: 'B', mnd: 'A', chr: 'D' },
    traits: [
      { name: 'Grimoire', effect: 'Alters spellcasting modes', level: 1 }
    ],
    abilities: [
      { name: 'Tabula Rasa', effect: 'Enhances grimoire', level: 1 }
    ]
  },
  {
    name: 'Geomancer',
    proficiencies: { hp: 'E', mp: 'B', str: 'E', dex: 'D', vit: 'D', agi: 'D', int: 'C', mnd: 'A', chr: 'D' },
    traits: [
      { name: 'Indicolure Duration', effect: 'Extends geomancy spells', level: 40 }
    ],
    abilities: [
      { name: 'Bolster', effect: 'Greatly strengthens geomancy', level: 1 }
    ]
  },
  {
    name: 'Rune Fencer',
    proficiencies: { hp: 'B', mp: 'D', str: 'C', dex: 'C', vit: 'B', agi: 'D', int: 'C', mnd: 'D', chr: 'C' },
    traits: [
      { name: 'Magic Defense Bonus', effect: 'Increases magic defense', level: 10 }
    ],
    abilities: [
      { name: 'Embolden', effect: 'Enhances enhancing magic', level: 96 }
    ]
  }
];

export const jobNames = jobs.map(j => j.name);
