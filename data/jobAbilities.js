export const jobAbilities = {
  Warrior: [
    { name: 'Provoke', effect: 'Forces enemy attention', level: 5 },
    { name: 'Berserk', effect: 'Increases attack, lowers defense', level: 15 },
    { name: 'Defender', effect: 'Raises defense, lowers attack', level: 15 },
    { name: 'Warcry', effect: 'Boosts nearby party attack', level: 35 },
    { name: 'Aggressor', effect: 'Increases accuracy, lowers evasion', level: 45 },
    { name: 'Mighty Strikes', effect: 'All attacks critical hit', level: 1 }
  ],
  Monk: [
    { name: 'Boost', effect: 'Raises attack for one strike', level: 5 },
    { name: 'Dodge', effect: 'Raises evasion', level: 15 },
    { name: 'Focus', effect: 'Raises accuracy', level: 15 },
    { name: 'Chakra', effect: 'Restores HP', level: 35 },
    { name: 'Hundred Fists', effect: 'Greatly increases attack speed', level: 1 }
  ],
  'White Mage': [
    { name: 'Benediction', effect: 'Restores HP to party', level: 1 },
    { name: 'Divine Seal', effect: 'Enhances next healing spell', level: 25 },
    { name: 'Martyr', effect: 'Transfers HP to party member', level: 70 }
  ],
  'Black Mage': [
    { name: 'Manafont', effect: 'Spells cost no MP', level: 1 },
    { name: 'Elemental Seal', effect: 'Improves spell accuracy', level: 15 },
    { name: 'Burst Affinity', effect: 'Enables magic burst on next spell', level: 40 }
  ],
  'Red Mage': [
    { name: 'Chainspell', effect: 'Removes recast on spells', level: 1 },
    { name: 'Convert', effect: 'Swaps HP and MP', level: 40 },
    { name: 'Composure', effect: 'Enhances enhancing magic duration', level: 50 }
  ],
  Thief: [
    { name: 'Steal', effect: 'Attempts to steal an item', level: 5 },
    { name: 'Sneak Attack', effect: 'Next attack deals critical damage', level: 30 },
    { name: 'Trick Attack', effect: 'Transfers enmity to target ally', level: 45 },
    { name: 'Flee', effect: 'Increases movement speed', level: 25 },
    { name: 'Mug', effect: 'Steal gil from target', level: 35 },
    { name: 'Perfect Dodge', effect: 'Avoid all attacks', level: 1 }
  ],
  Paladin: [
    { name: 'Shield Bash', effect: 'Stuns target', level: 5 },
    { name: 'Sentinel', effect: 'Greatly increases defense', level: 30 },
    { name: 'Rampart', effect: 'Raises defense of party', level: 46 },
    { name: 'Cover', effect: 'Takes damage for an ally', level: 35 },
    { name: 'Invincible', effect: 'Negates damage', level: 1 }
  ],
  'Dark Knight': [
    { name: 'Last Resort', effect: 'Raises attack, lowers defense', level: 15 },
    { name: 'Souleater', effect: 'Converts HP to damage', level: 30 },
    { name: 'Weapon Bash', effect: 'Stuns enemy', level: 20 },
    { name: 'Arcane Circle', effect: 'Boosts party vs arcane', level: 5 },
    { name: 'Dark Seal', effect: 'Enhances next dark magic', level: 75 },
    { name: 'Blood Weapon', effect: 'Converts damage to HP', level: 1 }
  ],
  Beastmaster: [
    { name: 'Charm', effect: 'Controls a beast', level: 1 },
    { name: 'Call Beast', effect: 'Summons a pet', level: 23 },
    { name: 'Familiar', effect: 'Strengthens pet', level: 1 },
    { name: 'Reward', effect: 'Restores pet HP', level: 35 }
  ],
  Bard: [
    { name: 'Foe Lullaby', effect: 'Puts enemy to sleep', level: 5 },
    { name: "Army's Paeon", effect: 'Gradually restores HP', level: 1 },
    { name: "Mage's Ballad", effect: 'Gradually restores MP', level: 25 },
    { name: 'Pianissimo', effect: 'Single-target next song', level: 75 }
  ],
  Ranger: [
    { name: 'Sharpshot', effect: 'Increases ranged accuracy', level: 1 },
    { name: 'Barrage', effect: 'Fires multiple shots', level: 30 },
    { name: 'Shadowbind', effect: 'Binds target', level: 40 },
    { name: 'Scavenge', effect: 'Finds ammo', level: 15 },
    { name: 'Camouflage', effect: 'Avoids aggro temporarily', level: 20 },
    { name: 'Eagle Eye Shot', effect: 'Powerful ranged attack', level: 1 }
  ],
  Samurai: [
    { name: 'Meditate', effect: 'Instantly gains TP', level: 30 },
    { name: 'Third Eye', effect: 'Parries one attack', level: 15 },
    { name: 'Seigan', effect: 'Enhances Third Eye', level: 25 },
    { name: 'Hasso', effect: 'Increases attack speed', level: 25 },
    { name: 'Sekkanoki', effect: 'Reduces weapon skill TP cost', level: 60 },
    { name: 'Meikyo Shisui', effect: 'Unlimited weapon skills', level: 1 }
  ],
  Ninja: [
    { name: 'Mijin Gakure', effect: 'Deals area damage at cost of HP', level: 1 },
    { name: 'Futae', effect: 'Enhances next ninjutsu', level: 25 },
    { name: 'Jutsu: Utsusemi', effect: 'Creates shadow images', level: 12 },
    { name: 'Yonin', effect: 'Increases enmity', level: 40 },
    { name: 'Innin', effect: 'Increases damage from behind', level: 40 }
  ],
  Dragoon: [
    { name: 'Jump', effect: 'Deals jumping attack', level: 1 },
    { name: 'High Jump', effect: 'Deals higher jumping attack', level: 35 },
    { name: 'Super Jump', effect: 'Avoids enemy enmity', level: 50 },
    { name: 'Spirit Link', effect: 'Transfers HP to wyvern', level: 20 },
    { name: 'Spirit Surge', effect: 'Strengthens wyvern', level: 1 }
  ],
  Summoner: [
    { name: 'Astral Flow', effect: 'Powerful avatar attack', level: 1 },
    { name: 'Elemental Siphon', effect: 'Converts avatar energy to MP', level: 35 },
    { name: "Avatar's Favor", effect: 'Grants party bonuses', level: 45 }
  ],
  'Blue Mage': [
    { name: 'Azure Lore', effect: 'Enhances blue magic', level: 1 },
    { name: 'Diffusion', effect: 'Spreads next spell to party', level: 75 },
    { name: 'Burst Affinity', effect: 'Allows magic burst', level: 40 }
  ],
  Corsair: [
    { name: 'Wild Card', effect: 'Resets ability timers', level: 70 },
    { name: 'Phantom Roll', effect: 'Provides party bonuses', level: 5 },
    { name: 'Random Deal', effect: 'Resets ability recast', level: 40 }
  ],
  Puppetmaster: [
    { name: 'Overdrive', effect: 'Enhances automaton', level: 1 },
    { name: 'Deploy', effect: 'Sends automaton to attack', level: 10 },
    { name: 'Activate', effect: 'Activates automaton', level: 1 }
  ],
  Dancer: [
    { name: 'Trance', effect: 'Unlimited step usage', level: 1 },
    { name: 'Drain Samba', effect: 'Steals HP with attacks', level: 5 },
    { name: 'Curing Waltz', effect: 'Restores HP to ally', level: 15 }
  ],
  Scholar: [
    { name: 'Tabula Rasa', effect: 'Enhances grimoire', level: 1 },
    { name: 'Strategems', effect: 'Modifies spellcasting', level: 10 },
    { name: 'Libra', effect: 'Measures enemy strength', level: 40 }
  ],
  Geomancer: [
    { name: 'Bolster', effect: 'Greatly strengthens geomancy', level: 1 },
    { name: 'Full Circle', effect: 'Ends current geomancy spell', level: 25 },
    { name: 'Blaze of Glory', effect: 'Increases luopan power', level: 45 }
  ],
  'Rune Fencer': [
    { name: 'Embolden', effect: 'Enhances enhancing magic', level: 96 },
    { name: 'Valiance', effect: 'Increases magic defense', level: 50 },
    { name: 'Swordplay', effect: 'Boosts evasion and parry', level: 20 }
  ]
};
