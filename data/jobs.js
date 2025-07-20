export const jobs = [
  {
    name: 'Warrior',
    proficiencies: { hp: 'B', mp: 'X', str: 'A', dex: 'C', vit: 'D', agi: 'C', int: 'F', mnd: 'F', chr: 'E' },
    traits: [
      { name: 'Defense Bonus I', effect: 'Increases defense', level: 10 },
      { name: 'Resist Virus I', effect: 'Improves virus resistance', level: 15 },
      { name: 'Double Attack I', effect: 'Chance to attack twice', level: 25 },
      { name: 'Max HP Boost I', effect: 'Raises maximum HP', level: 30 },
      { name: 'Attack Bonus I', effect: 'Increases attack power', level: 30 },
      { name: 'Resist Virus II', effect: 'Improves virus resistance', level: 35 },
      { name: 'Smite I', effect: 'Enhances weapon skill damage', level: 35 },
      { name: 'Damage Limit+ I', effect: 'Raises damage cap', level: 40 },
      { name: 'Fencer I', effect: 'Enhances one-handed weapon use', level: 45 },
      { name: 'Defense Bonus II', effect: 'Further increases defense', level: 45 },
      { name: 'Double Attack II', effect: 'Higher chance to attack twice', level: 50 },
      { name: 'Max HP Boost II', effect: 'Raises maximum HP further', level: 50 },
      { name: 'Resist Virus III', effect: 'Improves virus resistance', level: 55 },
      { name: 'Fencer II', effect: 'Greater bonus with one-handed weapons', level: 58 },
      { name: 'Attack Bonus II', effect: 'Further increases attack power', level: 65 },
      { name: 'Smite II', effect: 'Further enhances weapon skill damage', level: 65 },
      { name: 'Resist Virus IV', effect: 'Greatly improves virus resistance', level: 70 },
      { name: 'Max HP Boost III', effect: 'Raises maximum HP more', level: 70 },
      { name: 'Fencer III', effect: 'Even greater bonus with one-handed weapons', level: 71 },
      { name: 'Savagery', effect: 'Boosts weapon skill potency', level: 75 },
      { name: 'Aggressive Aim', effect: 'Improves ranged accuracy', level: 75 },
      { name: 'Double Attack III', effect: 'Further improved chance to attack twice', level: 75 },
      { name: 'Crit. Atk. Bonus I', effect: 'Increases critical damage', level: 78 },
      { name: 'Shield Def. Bonus I', effect: 'Improves shield defense', level: 80 },
      { name: 'Shield Mastery I', effect: 'TP gained when blocking', level: 80 },
      { name: 'Damage Limit+ II', effect: 'Greatly raises damage cap', level: 80 },
      { name: 'Resist Virus V', effect: 'Massively improves virus resistance', level: 81 },
      { name: 'Fencer IV', effect: 'Major bonus with one-handed weapons', level: 84 },
      { name: 'Double Attack IV', effect: 'Greatly increased chance to attack twice', level: 85 },
      { name: 'Defense Bonus III', effect: 'Significant defense increase', level: 86 },
      { name: 'Crit. Atk. Bonus II', effect: 'Further increases critical damage', level: 86 },
      { name: 'Shield Mastery II', effect: 'More TP when blocking', level: 87 },
      { name: 'Shield Def. Bonus II', effect: 'Improved shield defense', level: 88 },
      { name: 'Max HP Boost IV', effect: 'Max HP greatly increased', level: 90 },
      { name: 'Attack Bonus III', effect: 'Greatly increases attack power', level: 91 },
      { name: 'Shield Mastery III', effect: 'Maximum TP when blocking', level: 93 },
      { name: 'Smite III', effect: 'Highest weapon skill damage boost', level: 95 },
      { name: 'Fencer V', effect: 'Maximum bonus with one-handed weapons', level: 97 },
      { name: 'Double Attack V', effect: 'Highest chance to attack twice', level: 99 },
      { name: 'Shield Def. Bonus III', effect: 'Maximum shield defense', level: 99 }
    ],
    abilities: [
      { name: 'Mighty Strikes', effect: 'Guarantees critical hits for a short time', level: 1 },
      { name: 'Provoke', effect: 'Forces enemy attention', level: 5 },
      { name: 'Berserk', effect: 'Boosts attack, lowers defense', level: 15 },
      { name: 'Defender', effect: 'Boosts defense, lowers attack', level: 25 },
      { name: 'Warcry', effect: 'Raises party attack briefly', level: 35 },
      { name: 'Aggressor', effect: 'Improves accuracy but lowers evasion', level: 45 },
      { name: 'Retaliation', effect: 'Counters when blocking or parrying', level: 60 },
      { name: "Warrior's Charge", effect: 'Enhances next attack', level: 75 },
      { name: 'Tomahawk', effect: 'Reduces enemy defense', level: 75 },
      { name: 'Restraint', effect: 'Increases weapon skill damage', level: 77 },
      { name: 'Blood Rage', effect: 'Greatly boosts party attack', level: 87 },
      { name: 'Brazen Rush', effect: 'Grants frequent double attacks', level: 96 }
    ]
  },
  {
    name: 'Monk',
    proficiencies: { hp: 'A', mp: 'X', str: 'C', dex: 'B', vit: 'A', agi: 'F', int: 'G', mnd: 'D', chr: 'E' },
    traits: [
      { name: 'Martial Arts I', effect: 'Reduces hand-to-hand delay', level: 1 },
      { name: 'Subtle Blow I', effect: 'Reduces enemy TP gain', level: 5 },
      { name: 'Counter I', effect: 'Chance to counterattack', level: 10 },
      { name: 'Max HP Boost I', effect: 'Raises maximum HP', level: 15 },
      { name: 'Martial Arts II', effect: 'Further reduces hand-to-hand delay', level: 16 },
      { name: 'Subtle Blow II', effect: 'Further reduces enemy TP gain', level: 20 },
      { name: 'Max HP Boost II', effect: 'Raises maximum HP further', level: 25 },
      { name: 'Damage Limit+ I', effect: 'Raises damage cap', level: 30 },
      { name: 'Martial Arts III', effect: 'Further reduces hand-to-hand delay', level: 31 },
      { name: 'Max HP Boost III', effect: 'Increases maximum HP', level: 35 },
      { name: 'Subtle Blow III', effect: 'Further reduces enemy TP gain', level: 40 },
      { name: 'Smite I', effect: 'Enhances weapon skill damage', level: 40 },
      { name: 'Max HP Boost IV', effect: 'Further increases maximum HP', level: 45 },
      { name: 'Martial Arts IV', effect: 'Further reduces hand-to-hand delay', level: 46 },
      { name: 'Kick Attacks I', effect: 'Adds kick attacks to attacks', level: 51 },
      { name: 'Max HP Boost V', effect: 'Greatly increases maximum HP', level: 55 },
      { name: 'Damage Limit+ II', effect: 'Greatly raises damage cap', level: 60 },
      { name: 'Martial Arts V', effect: 'Greatly reduces hand-to-hand delay', level: 61 },
      { name: 'Subtle Blow IV', effect: 'Significantly reduces enemy TP gain', level: 65 },
      { name: 'Max HP Boost VI', effect: 'Boosts maximum HP even more', level: 65 },
      { name: 'Kick Attacks II', effect: 'Improves kick attack rate', level: 71 },
      { name: 'Martial Arts VI', effect: 'Extremely reduces hand-to-hand delay', level: 75 },
      { name: 'Max HP Boost VII', effect: 'Boosts maximum HP tremendously', level: 75 },
      { name: 'Invigorate', level: 75 },
      { name: 'Penance', level: 75 },
      { name: 'Kick Attacks III', effect: 'Maximizes kick attack rate', level: 76 },
      { name: 'Tactical Guard I', effect: 'Improves defense while guarding', level: 77 },
      { name: 'Smite II', effect: 'Further enhances weapon skill damage', level: 80 },
      { name: 'Counter II', effect: 'Higher chance to counterattack', level: 81 },
      { name: 'Martial Arts VII', effect: 'Nearly eliminates hand-to-hand delay', level: 82 },
      { name: 'Skillchain Bonus I', effect: 'Increases skillchain damage', level: 85 },
      { name: 'Max HP Boost VIII', effect: 'Massively increases maximum HP', level: 85 },
      { name: 'Tactical Guard II', effect: 'Greater defense while guarding', level: 87 },
      { name: 'Damage Limit+ III', effect: 'Maximizes damage cap', level: 90 },
      { name: 'Subtle Blow V', effect: 'Greatly reduces enemy TP gain', level: 91 },
      { name: 'Skillchain Bonus II', effect: 'Greatly increases skillchain damage', level: 95 },
      { name: 'Max HP Boost IX', effect: 'Maximum increase to HP', level: 95 },
      { name: 'Tactical Guard III', effect: 'Maximum defense while guarding', level: 97 }
    ],
    abilities: [
      { name: 'Hundred Fists', effect: 'Increases attack speed drastically', level: 1 },
      { name: 'Boost', effect: 'Raises attack temporarily', level: 5 },
      { name: 'Dodge', effect: 'Improves evasion', level: 15 },
      { name: 'Focus', effect: 'Improves accuracy', level: 25 },
      { name: 'Chakra', effect: 'Restores HP', level: 35 },
      { name: 'Chi Blast', effect: 'Deals damage with Chi', level: 41 },
      { name: 'Counterstance', effect: 'Replaces defense with counter rate', level: 45 },
      { name: 'Footwork', effect: 'Enhances kick attacks', level: 65 },
      { name: 'Formless Strikes', effect: 'Ignores enemy resistances', level: 75 },
      { name: 'Mantra', effect: 'Raises party HP', level: 75 },
      { name: 'Perfect Counter', effect: 'Counters next attack with high damage', level: 79 },
      { name: 'Impetus', effect: 'Boosts attack after consecutive hits', level: 88 },
      { name: 'Inner Strength', effect: 'Greatly boosts defenses', level: 96 }
    ]
  },
  {
    name: 'White Mage',
    proficiencies: { hp: 'E', mp: 'C', str: 'D', dex: 'F', vit: 'D', agi: 'E', int: 'E', mnd: 'A', chr: 'C' },
    traitsVerified: true,
    traits: [
      { name: 'Magic Defense Bonus', effect: 'Raises magic defense', level: 10 },
      { name: 'Clear Mind', effect: 'Improves MP recovery while resting', level: 20 },
      { name: 'Tranquil Heart', effect: 'Reduces cure enmity', level: 21 },
      { name: 'Auto Regen', effect: 'Gradually restores HP', level: 25 },
      { name: 'Magic Defense Bonus II', effect: 'Further raises magic defense', level: 30 },
      { name: 'Clear Mind II', effect: 'Improves MP recovery while resting', level: 35 },
      { name: 'Clear Mind III', effect: 'Improves MP recovery while resting', level: 50 },
      { name: 'Divine Veil', effect: 'Enhances magic defense effects', level: 50 },
      { name: 'Magic Defense Bonus III', effect: 'Further raises magic defense', level: 50 },
      { name: 'Divine Benison', effect: 'Reduces enmity from cures', level: 50 },
      { name: 'Divine Benison II', effect: 'Further reduces enmity from cures', level: 60 },
      { name: 'Clear Mind IV', effect: 'Improves MP recovery while resting', level: 65 },
      { name: 'Divine Benison III', effect: 'Greater enmity reduction from cures', level: 70 },
      { name: 'Magic Defense Bonus IV', effect: 'Greatly raises magic defense', level: 70 },
      { name: 'Auto Regen II', effect: 'Gradually restores more HP', level: 76 },
      { name: 'Clear Mind V', effect: 'Greatly improves MP recovery', level: 80 },
      { name: 'Divine Benison IV', effect: 'Major enmity reduction from cures', level: 80 },
      { name: 'Magic Defense Bonus V', effect: 'Significantly raises magic defense', level: 81 },
      { name: 'Shield Defense Bonus', effect: 'Enhances shield defense', level: 85 },
      { name: 'Divine Benison V', effect: 'Maximum enmity reduction from cures', level: 90 },
      { name: 'Magic Defense Bonus VI', effect: 'Massively raises magic defense', level: 91 }
    ],
    abilities: [
      { name: 'Benediction', effect: 'Restores HP to party', level: 1 },
      { name: 'Divine Seal', effect: 'Enhances next healing spell', level: 15 },
      { name: 'Afflatus Misery', effect: 'Changes stance to Misery', level: 30 },
      { name: 'Afflatus Solace', effect: 'Changes stance to Solace', level: 30 },
      { name: 'Auspice', effect: 'Enhances party attack and lowers enemy attack', level: 55 },
      { name: 'Devotion', level: 75 },
      { name: 'Martyr', level: 75 },
      { name: 'Divine Caress', effect: 'Enhances next status removal', level: 83 },
      { name: 'Sacrosanctity', effect: 'Temporarily reduces magic damage taken', level: 95 },
      { name: 'Asylum', effect: 'Reduces enmity and damage taken for party', level: 96 }
    ]
  },
  {
    name: 'Black Mage',
    proficiencies: { hp: 'F', mp: 'B', str: 'F', dex: 'C', vit: 'F', agi: 'C', int: 'A', mnd: 'E', chr: 'D' },
    traits: [
      { name: 'Magic Attack Bonus I', effect: 'Boosts magic damage', level: 10 },
      { name: 'Clear Mind I', effect: 'Improves MP recovery while resting', level: 15 },
      { name: 'Conserve MP', effect: 'Chance to use less MP', level: 20 },
      { name: 'Clear Mind II', effect: 'Improves MP recovery while resting', level: 30 },
      { name: 'Magic Attack Bonus II', effect: 'Further boosts magic damage', level: 30 },
      { name: 'Clear Mind III', effect: 'Improves MP recovery while resting', level: 45 },
      { name: 'Magic Burst Bonus I', effect: 'Increases magic burst damage', level: 45 },
      { name: 'Magic Attack Bonus III', effect: 'Further boosts magic damage', level: 50 },
      { name: 'Elemental Celerity I', effect: 'Reduces elemental magic cast time', level: 50 },
      { name: 'Magic Burst Bonus II', effect: 'Further increases magic burst damage', level: 58 },
      { name: 'Clear Mind IV', effect: 'Improves MP recovery while resting', level: 60 },
      { name: 'Elemental Celerity II', effect: 'Reduces elemental magic cast time', level: 60 },
      { name: 'Magic Attack Bonus IV', effect: 'Greatly boosts magic damage', level: 70 },
      { name: 'Elemental Celerity III', effect: 'Reduces elemental magic cast time', level: 70 },
      { name: 'Magic Burst Bonus III', effect: 'Further increases magic burst damage', level: 71 },
      { name: 'Clear Mind V', effect: 'Greatly improves MP recovery while resting', level: 75 },
      { name: 'Conserve MP II', effect: 'Better chance to use less MP', level: 76 },
      { name: 'Elemental Celerity IV', effect: 'Reduces elemental magic cast time', level: 80 },
      { name: 'Magic Attack Bonus V', effect: 'Boosts magic damage significantly', level: 81 },
      { name: 'Magic Burst Bonus IV', effect: 'Greatly increases magic burst damage', level: 84 },
      { name: 'Occult Acumen I', effect: 'Converts damage dealt to TP', level: 85 },
      { name: 'Conserve MP III', effect: 'Highest chance to use less MP', level: 86 },
      { name: 'Elemental Celerity V', effect: 'Reduces elemental magic cast time', level: 90 },
      { name: 'Magic Attack Bonus VI', effect: 'Maximum boost to magic damage', level: 91 },
      { name: 'Occult Acumen II', effect: 'Improved TP gain from spells', level: 95 },
      { name: 'Magic Burst Bonus V', effect: 'Maximum magic burst damage', level: 97 }
    ],
    abilities: [
      { name: 'Manafont', effect: 'Temporarily removes MP cost', level: 1 },
      { name: 'Elemental Seal', effect: 'Improves spell accuracy', level: 15 },
      { name: 'Mana Wall', effect: 'Converts damage to MP', level: 76 },
      { name: 'Cascade', effect: 'Converts STR to magic attack', level: 85 },
      { name: 'Enmity Douse', effect: 'Lowers enmity on target', level: 87 },
      { name: 'Manawell', effect: 'Increases elemental magic damage temporarily', level: 95 },
      { name: 'Subtle Sorcery', effect: 'Grants full casting speed', level: 96 }
    ]
  },
  {
    name: 'Red Mage',
    proficiencies: { hp: 'D', mp: 'D', str: 'D', dex: 'D', vit: 'E', agi: 'E', int: 'C', mnd: 'C', chr: 'D' },
    traits: [
      { name: 'Resist Petrify I', effect: 'Improves resistance to Petrify', level: 10 },
      { name: 'Fast Cast I', effect: 'Shortens casting time', level: 15 },
      { name: 'Magic Attack Bonus I', effect: 'Boosts magic damage', level: 20 },
      { name: 'Magic Defense Bonus I', effect: 'Raises magic defense', level: 25 },
      { name: 'Tranquil Heart', effect: 'Reduces cure enmity', level: 26 },
      { name: 'Resist Petrify II', effect: 'Improves resistance to Petrify', level: 30 },
      { name: 'Clear Mind I', effect: 'Improves MP recovery while resting', level: 31 },
      { name: 'Fast Cast II', effect: 'Shortens casting time further', level: 35 },
      { name: 'Magic Attack Bonus II', effect: 'Further boosts magic damage', level: 40 },
      { name: 'Magic Defense Bonus II', effect: 'Further raises magic defense', level: 45 },
      { name: 'Resist Petrify III', effect: 'Improves resistance to Petrify', level: 50 },
      { name: 'Clear Mind II', effect: 'Improves MP recovery while resting', level: 53 },
      { name: 'Fast Cast III', effect: 'Shortens casting time more', level: 55 },
      { name: 'Damage Limit+ I', effect: 'Raises damage cap', level: 60 },
      { name: 'Resist Petrify IV', effect: 'Greatly improves resistance to Petrify', level: 70 },
      { name: 'Clear Mind III', effect: 'Greatly improves MP recovery', level: 75 },
      { name: 'Fast Cast IV', effect: 'Greatly shortens casting time', level: 76 },
      { name: 'Magic Burst Bonus I', effect: 'Increases magic burst damage', level: 85 },
      { name: 'Magic Attack Bonus III', effect: 'Greatly boosts magic damage', level: 86 },
      { name: 'Shield Mastery I', effect: 'TP gained when blocking', level: 87 },
      { name: 'Fast Cast V', effect: 'Maximum casting time reduction', level: 89 },
      { name: 'Magic Burst Bonus II', effect: 'Further increases magic burst damage', level: 95 },
      { name: 'Magic Defense Bonus III', effect: 'Greatly raises magic defense', level: 96 },
      { name: 'Shield Mastery II', effect: 'More TP when blocking', level: 97 }
    ],
    abilities: [
      { name: 'Chainspell', effect: 'Allows rapid spellcasting', level: 1 },
      { name: 'Convert', effect: 'Swaps HP and MP', level: 40 },
      { name: 'Composure', effect: 'Extends beneficial magic duration', level: 50 },
      { name: 'Saboteur', effect: 'Enhances next enfeebling spell', level: 83 },
      { name: 'Spontaneity', effect: 'Eliminates next spell casting time', level: 95 },
      { name: 'Stymie', effect: 'Neutralizes target resistance to next enfeeble', level: 96 }
    ]
  },
  {
    name: 'Thief',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'A', vit: 'D', agi: 'B', int: 'C', mnd: 'G', chr: 'G' },
    traits: [
      { name: 'Gilfinder', effect: 'Increases gil obtained', level: 5 },
      { name: 'Evasion Bonus I', effect: 'Increases evasion', level: 10 },
      { name: 'Treasure Hunter I', effect: 'Improves drop rates', level: 15 },
      { name: 'Resist Gravity I', effect: 'Improves resistance to Weight', level: 20 },
      { name: 'Evasion Bonus II', effect: 'Further increases evasion', level: 30 },
      { name: 'Resist Gravity II', effect: 'Further improves Weight resistance', level: 40 },
      { name: 'Treasure Hunter II', effect: 'Further improves drop rates', level: 45 },
      { name: 'Evasion Bonus III', effect: 'Improves evasion more', level: 50 },
      { name: 'Damage Limit+ I', effect: 'Raises damage cap', level: 50 },
      { name: 'Triple Attack I', effect: 'Chance to attack three times', level: 55 },
      { name: 'Assassin', effect: 'Enhances sneak and trick attack', level: 60 },
      { name: 'Resist Gravity III', effect: 'Greatly improves Weight resistance', level: 66 },
      { name: 'Evasion Bonus IV', effect: 'Greatly increases evasion', level: 70 },
      { name: 'Resist Gravity IV', effect: 'Greater Weight resistance', level: 75 },
      { name: 'Ambush', effect: 'Improves attacks from behind', level: 75 },
      { name: 'Aura Steal', effect: 'Steals beneficial status effects', level: 75 },
      { name: 'Evasion Bonus V', effect: 'Massively increases evasion', level: 76 },
      { name: 'Crit. Atk. Bonus I', effect: 'Increases critical damage', level: 78 },
      { name: 'Resist Gravity V', effect: 'Maximum Weight resistance', level: 81 },
      { name: 'Dual Wield I', effect: 'Allows wielding two weapons', level: 83 },
      { name: 'Crit. Atk. Bonus II', effect: 'Further increases critical damage', level: 84 },
      { name: 'Evasion Bonus VI', effect: 'Further enhances evasion', level: 88 },
      { name: 'Treasure Hunter III', effect: 'Greatly improves drop rates', level: 90 },
      { name: 'Dual Wield II', effect: 'Improves dual wield', level: 90 },
      { name: 'Crit. Atk. Bonus III', effect: 'Greatly increases critical damage', level: 91 },
      { name: 'Triple Attack II', effect: 'Improved chance to attack three times', level: 95 },
      { name: 'Crit. Atk. Bonus IV', effect: 'Maximum critical damage bonus', level: 97 },
      { name: 'Dual Wield III', effect: 'Maximum dual wield', level: 98 }
    ],
    abilities: [
      { name: 'Perfect Dodge', effect: 'Temporarily avoids all attacks', level: 1 },
      { name: 'Steal', effect: 'Attempts to steal an item', level: 5 },
      { name: 'Sneak Attack', effect: 'Deals extra damage from behind', level: 15 },
      { name: 'Flee', effect: 'Greatly increases movement speed', level: 25 },
      { name: 'Trick Attack', effect: 'Transfers enmity behind target', level: 30 },
      { name: 'Mug', effect: 'Steals gil from enemy', level: 35 },
      { name: 'Hide', effect: 'Conceals yourself from sight', level: 45 },
      { name: 'Accomplice', effect: 'Diverts enmity to yourself', level: 65 },
      { name: 'Collaborator', effect: 'Shares enmity with an ally', level: 65 },
      { name: "Assassin's Charge", effect: 'Guarantees next two attacks crit', level: 75 },
      { name: 'Feint', effect: 'Greatly lowers target evasion', level: 75 },
      { name: 'Despoil', effect: 'Attempts to steal equipment', level: 77 },
      { name: 'Conspirator', effect: 'Boosts party accuracy and crit rate', level: 87 },
      { name: 'Bully', effect: 'Increases chance to intimidate', level: 93 },
      { name: 'Larceny', effect: 'Steals an enemy ability', level: 96 }
    ]
  },
  {
    name: 'Paladin',
    proficiencies: { hp: 'C', mp: 'F', str: 'B', dex: 'E', vit: 'A', agi: 'G', int: 'G', mnd: 'C', chr: 'C' },
    traits: [
      { name: 'Defense Bonus I', effect: 'Raises defense', level: 1 },
      { name: 'Resist Sleep I', effect: 'Improves sleep resistance', level: 20 },
      { name: 'Shield Mastery I', effect: 'TP gained when blocking', level: 25 },
      { name: 'Defense Bonus II', effect: 'Further raises defense', level: 30 },
      { name: 'Auto Refresh', effect: 'Restores MP over time', level: 35 },
      { name: 'Resist Sleep II', effect: 'Improves sleep resistance', level: 40 }
    ],
    abilities: [
      { name: 'Invincible', effect: 'Temporarily nullifies damage', level: 1 },
      { name: 'Holy Circle', effect: 'Increases damage against undead', level: 5 },
      { name: 'Shield Bash', effect: 'Stuns enemy with shield', level: 15 },
      { name: 'Sentinel', effect: 'Raises defense and enmity', level: 30 },
      { name: 'Cover', effect: 'Protects an ally', level: 35 },
      { name: 'Rampart', effect: 'Raises party defense', level: 62 },
      { name: 'Majesty', effect: 'Enhances healing spells', level: 70 },
      { name: 'Fealty', effect: 'Greatly reduces enmity loss', level: 75 },
      { name: 'Chivalry', effect: 'Converts TP to MP', level: 75 },
      { name: 'Divine Emblem', effect: 'Enhances divine magic', level: 78 },
      { name: 'Sepulcher', effect: 'Blocks damage for party members', level: 87 },
      { name: 'Palisade', effect: 'Reduces physical damage taken', level: 95 },
      { name: 'Intervene', effect: 'Deals physical damage and removes enmity', level: 96 }
    ]
  },
  {
    name: 'Dark Knight',
    proficiencies: { hp: 'C', mp: 'F', str: 'A', dex: 'C', vit: 'C', agi: 'D', int: 'C', mnd: 'G', chr: 'G' },
    traits: [
      { name: 'Attack Bonus I', effect: 'Increases attack', level: 10 },
      { name: 'Desperate Blows I', effect: 'Reduces delay under Last Resort', level: 30 },
      { name: 'Smite I', effect: 'Boosts weapon skill damage', level: 35 },
      { name: 'Resist Paralyze II', effect: 'Improves paralyze resistance', level: 40 },
      { name: 'Damage Limit+ I', effect: 'Raises damage cap', level: 40 },
      { name: 'Occult Acumen I', effect: 'Converts magic damage to TP', level: 45 }
    ],
    abilities: [
      { name: 'Blood Weapon', effect: 'Converts damage dealt to HP', level: 1 },
      { name: 'Arcane Circle', effect: 'Increases party accuracy vs arcana', level: 5 },
      { name: 'Last Resort', effect: 'Boosts attack but lowers defense', level: 15 },
      { name: 'Weapon Bash', effect: 'Stuns target with shield', level: 20 },
      { name: 'Souleater', effect: 'Converts HP to damage', level: 30 },
      { name: 'Consume Mana', effect: 'Uses MP for stronger attack', level: 55 },
      { name: 'Dark Seal', effect: 'Boosts next dark magic spell', level: 75 },
      { name: 'Diabolic Eye', effect: 'Temporarily boosts accuracy', level: 75 },
      { name: 'Nether Void', effect: 'Enhances next Absorb spell', level: 78 },
      { name: 'Arcane Crest', effect: 'Grants damage shield', level: 87 },
      { name: 'Scarlet Delirium', effect: 'Adds damage based on lost HP', level: 95 },
      { name: 'Soul Enslavement', effect: 'Guarantees attacks trigger weapon skill', level: 96 }
    ]
  },
  {
    name: 'Beastmaster',
    proficiencies: { hp: 'C', mp: 'X', str: 'D', dex: 'C', vit: 'D', agi: 'F', int: 'E', mnd: 'E', chr: 'A' },
    traits: [
      { name: 'Resist Slow I', effect: 'Reduces duration of Slow', level: 15 },
      { name: 'Resist Amnesia I', effect: 'Improves amnesia resistance', level: 15 },
      { name: 'Bird Killer I', effect: 'Increases damage to birds', level: 20 },
      { name: 'Amorph Killer I', effect: 'Increases damage to amorphs', level: 30 },
      { name: 'Resist Slow II', effect: 'Further reduces Slow duration', level: 35 }
    ],
    abilities: [
      { name: 'Charm', effect: 'Tame beasts for a time', level: 1 },
      { name: 'Gauge', effect: 'Check a monster\'s status', level: 10 },
      { name: 'Reward', effect: 'Restores pet HP', level: 12 },
      { name: 'Call Beast', effect: 'Calls a pet from a jug', level: 23 },
      { name: 'Bestial Loyalty', effect: 'Instantly calls a pet from a jug', level: 23 },
      { name: 'Tame', effect: 'Attempts to calm a monster', level: 30 },
      { name: 'Snarl', effect: 'Transfers enmity to pet', level: 45 },
      { name: 'Feral Howl', effect: 'Weakens a beast', level: 75 },
      { name: 'Killer Instinct', effect: 'Boosts pet attack', level: 75 },
      { name: 'Spur', effect: 'Increases pet attack speed', level: 83 },
      { name: 'Run Wild', effect: 'Releases pet but boosts its power', level: 93 },
      { name: 'Unleash', effect: 'Greatly empowers pet actions', level: 96 }
    ]
  },
  {
    name: 'Bard',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'D', vit: 'D', agi: 'F', int: 'D', mnd: 'D', chr: 'B' },
    traits: [
      { name: 'Resist Silence I', effect: 'Improves silence resistance', level: 5 },
      { name: 'Resist Silence II', effect: 'Improves silence resistance', level: 25 },
      { name: 'Resist Silence III', effect: 'Improves silence resistance', level: 45 },
      { name: 'Resist Silence IV', effect: 'Improves silence resistance', level: 65 },
      { name: 'Fencer I', effect: 'Improves one-handed weapon use', level: 85 }
    ],
    abilities: [
      { name: 'Soul Voice', effect: 'Dramatically enhances songs', level: 1 },
      { name: 'Pianissimo', effect: 'Directs next song to a single target', level: 20 },
      { name: 'Nightingale', effect: 'Halves song cast time', level: 75 },
      { name: 'Troubadour', effect: 'Doubles song duration', level: 75 },
      { name: 'Tenuto', effect: 'Prevents songs from overwriting', level: 83 },
      { name: 'Marcato', effect: 'Increases power of next song', level: 95 },
      { name: 'Clarion Call', effect: 'Allows an extra song', level: 96 }
    ]
  },
  {
    name: 'Ranger',
    proficiencies: { hp: 'E', mp: 'X', str: 'E', dex: 'D', vit: 'D', agi: 'A', int: 'E', mnd: 'D', chr: 'E' },
    traits: [
      { name: 'Wide Scan III', effect: 'Allows tracking of distant foes', level: 1 },
      { name: 'Alertness', effect: 'Reduces chance of aggro', level: 5 },
      { name: 'Accuracy Bonus I', effect: 'Increases ranged accuracy', level: 10 },
      { name: 'Rapid Shot I', effect: 'Occasionally quickens ranged attacks', level: 15 },
      { name: 'Recycle I', effect: 'Chance to conserve ammunition', level: 20 }
    ],
    abilities: [
      { name: 'Eagle Eye Shot', effect: 'Deals a powerful ranged attack', level: 1 },
      { name: 'Sharpshot', effect: 'Greatly boosts ranged accuracy', level: 1 },
      { name: 'Scavenge', effect: 'Finds ammunition', level: 10 },
      { name: 'Camouflage', effect: 'Temporarily prevents enemy detection', level: 20 },
      { name: 'Barrage', effect: 'Fires multiple shots at once', level: 30 },
      { name: 'Shadowbind', effect: 'Binds the target', level: 40 },
      { name: 'Velocity Shot', effect: 'Increases ranged attack speed', level: 45 },
      { name: 'Unlimited Shot', effect: 'Uses no ammo for next shot', level: 51 },
      { name: 'Flashy Shot', effect: 'Enhances enmity from ranged attacks', level: 75 },
      { name: 'Stealth Shot', effect: 'Reduces enmity from ranged attacks', level: 75 },
      { name: 'Double Shot', effect: 'Grants additional ranged attack', level: 79 },
      { name: 'Bounty Shot', effect: 'Improves item drop rate', level: 87 },
      { name: 'Decoy Shot', effect: 'Transfers enmity to an illusion', level: 95 },
      { name: 'Hover Shot', effect: 'Reduces enmity while moving', level: 95 },
      { name: 'Overkill', effect: 'Greatly increases ranged attack rate', level: 96 }
    ]
  },
  {
    name: 'Samurai',
    proficiencies: { hp: 'B', mp: 'X', str: 'C', dex: 'C', vit: 'C', agi: 'D', int: 'E', mnd: 'E', chr: 'D' },
    traits: [
      { name: 'Resist Blind I', effect: 'Improves blind resistance', level: 5 },
      { name: 'Store TP I', effect: 'Gain extra TP per hit', level: 10 },
      { name: 'Zanshin I', effect: 'Chance to attack again when missing', level: 20 },
      { name: 'Resist Blind II', effect: 'Improves blind resistance', level: 25 },
      { name: 'Store TP II', effect: 'Gain extra TP per hit', level: 30 }
    ],
    abilities: [
      { name: 'Meikyo Shisui', effect: 'Instantly readies weapon skills', level: 1 },
      { name: 'Warding Circle', effect: 'Increases defense against demons', level: 5 },
      { name: 'Third Eye', effect: 'Parries a single attack', level: 15 },
      { name: 'Hasso', effect: 'Boosts attack speed and accuracy', level: 25 },
      { name: 'Meditate', effect: 'Instantly gains TP', level: 30 },
      { name: 'Seigan', effect: 'Improves parrying ability', level: 35 },
      { name: 'Sekkanoki', effect: 'Reduces weapon skill charge time', level: 40 },
      { name: 'Konzen-ittai', effect: 'Increases weapon skill damage', level: 65 },
      { name: 'Shikikoyo', effect: 'Transfers TP to target', level: 75 },
      { name: 'Blade Bash', effect: 'Stuns the target', level: 75 },
      { name: 'Sengikori', effect: 'Increases weapon skill damage', level: 77 },
      { name: 'Hamanoha', effect: 'Area attack that removes buffs', level: 87 },
      { name: 'Hagakure', effect: 'Increases skillchain damage', level: 95 },
      { name: 'Yaegasumi', effect: 'Greatly reduces damage taken', level: 96 }
    ]
  },
  {
    name: 'Ninja',
    proficiencies: { hp: 'D', mp: 'X', str: 'C', dex: 'B', vit: 'C', agi: 'B', int: 'D', mnd: 'G', chr: 'F' },
    traits: [
      { name: 'Stealth I', effect: 'Reduces sound detection', level: 5 },
      { name: 'Resist Bind I', effect: 'Improves bind resistance', level: 10 },
      { name: 'Dual Wield I', effect: 'Allows wielding two weapons', level: 10 },
      { name: 'Subtle Blow I', effect: 'Reduces enemy TP gain', level: 15 },
      { name: 'Max HP Boost I', effect: 'Increases maximum HP', level: 20 },
      { name: 'Dual Wield II', effect: 'Improved dual wield', level: 25 },
      { name: 'Daken I', effect: 'Chance to throw shuriken', level: 25 },
      { name: 'Resist Bind II', effect: 'Improves bind resistance', level: 30 },
      { name: 'Subtle Blow II', effect: 'Further reduces enemy TP gain', level: 30 },
      { name: 'Daken II', effect: 'Improved chance to throw shuriken', level: 40 },
      { name: 'Max HP Boost II', effect: 'Increases maximum HP', level: 40 },
      { name: 'Dual Wield III', effect: 'Enhanced dual wield', level: 45 },
      { name: 'Subtle Blow III', effect: 'Further reduces enemy TP gain', level: 45 },
      { name: 'Resist Bind III', effect: 'Improves bind resistance', level: 50 },
      { name: 'Damage Limit+ I', effect: 'Raises damage cap', level: 50 },
      { name: 'Daken III', effect: 'Higher chance to throw shuriken', level: 55 },
      { name: 'Subtle Blow IV', effect: 'Greatly reduces enemy TP gain', level: 60 },
      { name: 'Max HP Boost III', effect: 'Raises maximum HP', level: 60 },
      { name: 'Dual Wield IV', effect: 'Further improved dual wield', level: 65 },
      { name: 'Resist Bind IV', effect: 'Greatly improves bind resistance', level: 70 },
      { name: 'Daken IV', effect: 'Further improved chance to throw shuriken', level: 70 },
      { name: 'Subtle Blow V', effect: 'Even greater reduction to enemy TP gain', level: 75 },
      { name: 'Ninja Tool Expertise', effect: 'Reduces ninja tool consumption', level: 75 },
      { name: 'Tactical Parry I', effect: 'TP gained when parrying', level: 77 },
      { name: 'Magic Burst Bonus I', effect: 'Increases magic burst damage', level: 80 },
      { name: 'Max HP Boost IV', effect: 'Greatly increases maximum HP', level: 80 },
      { name: 'Resist Bind V', effect: 'Massively improves bind resistance', level: 81 },
      { name: 'Dual Wield V', effect: 'Maximum dual wield potential', level: 83 },
      { name: 'Skillchain Bonus I', effect: 'Increases skillchain damage', level: 85 },
      { name: 'Stealth II', effect: 'Greatly reduces sound detection', level: 86 },
      { name: 'Tactical Parry II', effect: 'Greater TP gain when parrying', level: 87 },
      { name: 'Magic Burst Bonus II', effect: 'Further increases magic burst damage', level: 90 },
      { name: 'Subtle Blow VI', effect: 'Maximum reduction to enemy TP gain', level: 91 },
      { name: 'Skillchain Bonus II', effect: 'Greatly increases skillchain damage', level: 95 },
      { name: 'Daken V', effect: 'Maximum chance to throw shuriken', level: 95 },
      { name: 'Tactical Parry III', effect: 'Maximum TP gain when parrying', level: 97 },
      { name: 'Max HP Boost V', effect: 'Maximum increase to HP', level: 99 }
    ],
    abilities: [
      { name: 'Mijin Gakure', effect: 'Deals damage at cost of HP', level: 1 },
      { name: 'Yonin', effect: 'Enhances defense and enmity', level: 40 },
      { name: 'Innin', effect: 'Enhances offense when behind target', level: 40 },
      { name: 'Sange', effect: 'Consumes shuriken for high damage', level: 75 },
      { name: 'Futae', effect: 'Doubles ninjutsu damage', level: 77 },
      { name: 'Issekigan', effect: 'Increases parry rate', level: 95 },
      { name: 'Mikage', effect: 'Creates copies of yourself', level: 96 }
    ]
  },
  {
    name: 'Dragoon',
    proficiencies: { hp: 'C', mp: 'X', str: 'C', dex: 'E', vit: 'C', agi: 'E', int: 'F', mnd: 'E', chr: 'C' },
    traits: [
      { name: 'Attack Bonus I', effect: 'Increases attack', level: 10 },
      { name: 'Strafe I', effect: 'Improves wyvern accuracy', level: 20 },
      { name: 'Dragon Killer I', effect: 'Increases damage to dragons', level: 25 },
      { name: 'Accuracy Bonus I', effect: 'Increases accuracy', level: 30 },
      { name: 'Conserve TP I', effect: 'Chance to conserve TP', level: 45 }
    ],
    abilities: [
      { name: 'Spirit Surge', effect: 'Greatly empowers wyvern', level: 1 },
      { name: 'Call Wyvern', effect: 'Summons your wyvern', level: 1 },
      { name: 'Ancient Circle', effect: 'Increases attack against dragons', level: 5 },
      { name: 'Jump', effect: 'Deals jumping attack', level: 10 },
      { name: 'Spirit Link', effect: 'Shares HP with wyvern', level: 25 },
      { name: 'High Jump', effect: 'Deals damage and sheds enmity', level: 35 },
      { name: 'Super Jump', effect: 'Removes enmity completely', level: 50 },
      { name: 'Spirit Bond', effect: 'Heals wyvern for damage dealt', level: 65 },
      { name: 'Deep Breathing', effect: 'Enhances wyvern breath', level: 75 },
      { name: 'Angon', effect: 'Lowers defense with a lance', level: 75 },
      { name: 'Spirit Jump', effect: 'Jumps with wyvern for extra TP', level: 77 },
      { name: 'Soul Jump', effect: 'Powerful jump with wyvern', level: 85 },
      { name: 'Dragon Breaker', effect: 'Greatly weakens dragons', level: 87 },
      { name: 'Fly High', effect: 'Allows repeated jumps', level: 96 }
    ]
  },
  {
    name: 'Summoner',
    proficiencies: { hp: 'G', mp: 'A', str: 'G', dex: 'D', vit: 'G', agi: 'D', int: 'B', mnd: 'C', chr: 'C' },
    traits: [
      { name: 'Max MP Boost I', effect: 'Raises maximum MP', level: 10 },
      { name: 'Clear Mind I', effect: 'Improves MP recovery while resting', level: 15 },
      { name: 'Resist Slow I', effect: 'Improves Slow resistance', level: 20 },
      { name: 'Auto Refresh I', effect: 'Regenerates MP over time', level: 25 },
      { name: 'Max MP Boost II', effect: 'Further increases MP', level: 30 }
    ],
    abilities: [
      { name: 'Astral Flow', effect: 'Enables powerful avatar attack', level: 1 },
      { name: 'Elemental Siphon', effect: 'Drains MP from spirit', level: 50 },
      { name: 'Apogee', effect: 'Enhances next blood pact', level: 70 },
      { name: 'Mana Cede', effect: 'Transfers MP to avatar', level: 87 },
      { name: 'Astral Conduit', effect: 'Allows rapid blood pacts', level: 96 }
    ]
  },
  {
    name: 'Blue Mage',
    proficiencies: { hp: 'C', mp: 'D', str: 'C', dex: 'C', vit: 'C', agi: 'D', int: 'D', mnd: 'D', chr: 'C' },
    traits: [
      { name: 'Blue Magic Attack Bonus', effect: 'Boosts blue magic', level: 30 },
      { name: 'Blue Magic Skill Bonus', effect: 'Raises blue magic skill', level: 20 },
      { name: 'Assimilation', effect: 'Adds set points for spells', level: 75 },
      { name: 'Enchainment', effect: 'Improves skillchains with spells', level: 75 }
    ],
    abilities: [
      { name: 'Azure Lore', effect: 'Enhances blue magic', level: 1 },
      { name: 'Burst Affinity', effect: 'Allows magic bursts', level: 25 },
      { name: 'Chain Affinity', effect: 'Links spells with weapon skills', level: 40 },
      { name: 'Diffusion', effect: 'Spreads a spell\'s effect to party', level: 75 },
      { name: 'Efflux', effect: 'Boosts physical blue magic', level: 83 },
      { name: 'Unbridled Learning', effect: 'Temporarily access special spells', level: 95 },
      { name: 'Unbridled Wisdom', effect: 'Enhances Unbridled Learning', level: 96 }
    ]
  },
  {
    name: 'Corsair',
    proficiencies: { hp: 'D', mp: 'E', str: 'E', dex: 'C', vit: 'D', agi: 'B', int: 'D', mnd: 'D', chr: 'B' },
    traits: [
      { name: 'Resist Paralyze I', effect: 'Improves paralyze resistance', level: 5 },
      { name: 'Rapid Shot I', effect: 'Occasionally quickens ranged attacks', level: 15 },
      { name: 'Resist Paralyze II', effect: 'Improves paralyze resistance', level: 25 },
      { name: 'Resist Amnesia I', effect: 'Improves amnesia resistance', level: 30 },
      { name: 'Recycle I', effect: 'Chance to conserve ammunition', level: 35 }
    ],
    abilities: [
      { name: 'Wild Card', effect: 'Resets ability timers', level: 1 },
      { name: 'Phantom Roll', effect: 'Provides party bonuses', level: 5 },
      { name: 'Double-Up', effect: 'Enhances current roll', level: 5 },
      { name: 'Quick Draw', effect: 'Uses elemental bullets to enfeeble', level: 40 },
      { name: 'Random Deal', effect: 'Resets an ability cooldown', level: 50 },
      { name: 'Snake Eye', effect: 'Improves next roll result', level: 75 },
      { name: 'Fold', effect: 'Removes bust effects', level: 75 },
      { name: 'Triple Shot', effect: 'Shoots multiple times', level: 87 },
      { name: 'Crooked Cards', effect: 'Enhances active roll', level: 95 },
      { name: 'Cutting Cards', effect: 'Reduces recast times', level: 96 }
    ]
  },
  {
    name: 'Puppetmaster',
    proficiencies: { hp: 'C', mp: 'E', str: 'D', dex: 'C', vit: 'D', agi: 'C', int: 'D', mnd: 'D', chr: 'C' },
    traits: [
      { name: 'Resist Slow I', effect: 'Improves Slow resistance', level: 10 },
      { name: 'Resist Amnesia I', effect: 'Improves amnesia resistance', level: 15 },
      { name: 'Evasion Bonus I', effect: 'Increases evasion', level: 20 },
      { name: 'Martial Arts I', effect: 'Reduces hand-to-hand delay', level: 25 },
      { name: 'Resist Amnesia II', effect: 'Improves amnesia resistance', level: 35 }
    ],
    abilities: [
      { name: 'Overdrive', effect: 'Enhances automaton abilities', level: 1 },
      { name: 'Deus Ex Automata', effect: 'Instantly repairs automaton', level: 5 },
      { name: 'Activate', effect: 'Deploys automaton', level: 1 },
      { name: 'Repair', effect: 'Restores automaton HP', level: 15 },
      { name: 'Maintenance', effect: 'Removes automaton ailments', level: 30 },
      { name: 'Ventriloquy', effect: 'Transfers enmity to automaton', level: 75 },
      { name: 'Role Reversal', effect: 'Swaps HP with automaton', level: 75 }
    ]
  },
  {
    name: 'Dancer',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'A', vit: 'C', agi: 'C', int: 'C', mnd: 'G', chr: 'C' },
    traits: [
      { name: 'Resist Slow I', effect: 'Improves Slow resistance', level: 20 },
      { name: 'Dual Wield I', effect: 'Allows wielding two weapons', level: 20 },
      { name: 'Subtle Blow I', effect: 'Reduces enemy TP gain', level: 25 },
      { name: 'Accuracy Bonus I', effect: 'Increases accuracy', level: 30 },
      { name: 'Dual Wield II', effect: 'Improved dual wield', level: 40 }
    ],
    abilities: [
      { name: 'Trance', effect: 'Unlimited step usage', level: 1 },
      { name: 'Contradance', effect: 'Enhances next waltz', level: 50 },
      { name: 'Saber Dance', effect: 'Focuses on offense', level: 75 },
      { name: 'Fan Dance', effect: 'Focuses on defense', level: 75 },
      { name: 'No Foot Rise', effect: 'Replenishes finishing moves', level: 75 },
      { name: 'Presto', effect: 'Grants finishing moves', level: 77 },
      { name: 'Grand Pas', effect: 'Greatly enhances steps', level: 96 }
    ]
  },
  {
    name: 'Scholar',
    proficiencies: { hp: 'E', mp: 'B', str: 'E', dex: 'D', vit: 'D', agi: 'D', int: 'B', mnd: 'A', chr: 'D' },
    traits: [
      { name: 'Resist Silence I', effect: 'Improves silence resistance', level: 10 },
      { name: 'Clear Mind I', effect: 'Improves MP recovery while resting', level: 20 },
      { name: 'Conserve MP', effect: 'Chance to use less MP', level: 25 },
      { name: 'Max MP Boost I', effect: 'Raises maximum MP', level: 30 },
      { name: 'Tranquil Heart', effect: 'Reduces enmity from cures', level: 30 }
    ],
    abilities: [
      { name: 'Tabula Rasa', effect: 'Enhances grimoire', level: 1 },
      { name: 'Light Arts', effect: 'Reduces MP cost of white magic', level: 10 },
      { name: 'Dark Arts', effect: 'Reduces MP cost of black magic', level: 10 },
      { name: 'Sublimation', effect: 'Stores HP as MP', level: 35 },
      { name: 'Modus Veritas', effect: 'Increases helix damage', level: 65 },
      { name: 'Enlightenment', effect: 'Grants access to both arts', level: 75 },
      { name: 'Libra', effect: 'Checks target enmity levels', level: 76 },
      { name: 'Caper Emissarius', effect: 'Transfers enmity to target', level: 96 }
    ]
  },
  {
    name: 'Geomancer',
    proficiencies: { hp: 'E', mp: 'B', str: 'E', dex: 'D', vit: 'D', agi: 'D', int: 'C', mnd: 'A', chr: 'D' },
    traits: [
      { name: 'Conserve MP', effect: 'Chance to use less MP', level: 10 },
      { name: 'Clear Mind', effect: 'Improves MP recovery while resting', level: 20 },
      { name: 'Cardinal Chant', effect: 'Boosts geomancy potency', level: 25 },
      { name: 'Conserve MP II', effect: 'Greater chance to use less MP', level: 25 },
      { name: 'Max MP Boost I', effect: 'Raises maximum MP', level: 30 }
    ],
    abilities: [
      { name: 'Bolster', effect: 'Greatly strengthens geomancy', level: 1 },
      { name: 'Full Circle', effect: 'Ends luopan effect', level: 5 },
      { name: 'Lasting Emanation', effect: 'Extends luopan duration', level: 25 },
      { name: 'Ecliptic Attrition', effect: 'Strengthens a luopan', level: 25 },
      { name: 'Collimated Fervor', effect: 'Boosts geomancy potency', level: 40 },
      { name: 'Life Cycle', effect: 'Converts HP to luopan HP', level: 50 },
      { name: 'Blaze of Glory', effect: 'Greatly enhances a single geomancy spell', level: 60 },
      { name: 'Dematerialize', effect: 'Temporarily removes luopan', level: 70 },
      { name: 'Entrust', effect: 'Allows casting Indi-spell on an ally', level: 75 },
      { name: 'Mending Halation', effect: 'Restores HP to luopan', level: 75 },
      { name: 'Radial Arcana', effect: 'Deals damage around luopan', level: 75 }
    ]
  },
  {
    name: 'Rune Fencer',
    proficiencies: { hp: 'B', mp: 'D', str: 'C', dex: 'C', vit: 'B', agi: 'D', int: 'C', mnd: 'D', chr: 'C' },
    traits: [
      { name: 'Tenacity', effect: 'Reduces physical damage taken', level: 1 },
      { name: 'Magic Defense Bonus', effect: 'Increases magic defense', level: 10 },
      { name: 'Inquartata', effect: 'Improves parry rate', level: 15 },
      { name: 'Max HP Boost I', effect: 'Raises maximum HP', level: 20 },
      { name: 'Magic Defense Bonus II', effect: 'Further increases magic defense', level: 30 },
      { name: 'Auto Regen', effect: 'Restores HP over time', level: 35 }
    ],
    abilities: [
      { name: 'Elemental Sforzo', effect: 'Temporarily nullifies magic damage', level: 1 },
      { name: 'Vallation', effect: 'Raises elemental resistance', level: 10 },
      { name: 'Swordplay', effect: 'Increases parry rate', level: 20 },
      { name: 'Swipe', effect: 'Deals elemental damage', level: 25 },
      { name: 'Lunge', effect: 'Deals heavy elemental damage', level: 25 },
      { name: 'Pflug', effect: 'Raises resistance to status effects', level: 40 },
      { name: 'Valiance', effect: 'Extends Vallation to party', level: 50 },
      { name: 'Embolden', effect: 'Enhances enhancing magic', level: 60 },
      { name: 'Vivacious Pulse', effect: 'Heals HP and cures status', level: 65 },
      { name: 'Gambit', effect: 'Lowers enemy resistance to magic', level: 70 },
      { name: 'Battuta', effect: 'Greatly increases parry rate', level: 75 },
      { name: 'Rayke', effect: 'Reduces enemy magic defense', level: 75 },
      { name: 'Liement', effect: 'Shares magic defense with party', level: 85 },
      { name: 'One for All', effect: 'Reduces magic damage taken for party', level: 95 },
      { name: 'Odyllic Subterfuge', effect: 'Transfers enmity to party member', level: 96 }
    ]
  }
];

export const jobNames = jobs.map(j => j.name);
// Jobs available when creating a brand new character without completing any
// unlock quests. These correspond to the six starter jobs from the original
// Final Fantasy XI release.
export const baseJobNames = [
  'Warrior',
  'Monk',
  'White Mage',
  'Black Mage',
  'Red Mage',
  'Thief'
];
