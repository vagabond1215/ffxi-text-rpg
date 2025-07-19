import { jobTraits } from './jobTraits.js';
import { jobAbilities } from './jobAbilities.js';

export const jobs = [
  {
    name: 'Warrior',
    proficiencies: { hp: 'B', mp: 'X', str: 'A', dex: 'C', vit: 'D', agi: 'C', int: 'F', mnd: 'F', chr: 'E' },
    traits: jobTraits['Warrior'],
    abilities: jobAbilities['Warrior']
  },
  {
    name: 'Monk',
    proficiencies: { hp: 'A', mp: 'X', str: 'C', dex: 'B', vit: 'A', agi: 'F', int: 'G', mnd: 'D', chr: 'E' },
    traits: jobTraits['Monk'],
    abilities: jobAbilities['Monk']
  },
  {
    name: 'White Mage',
    proficiencies: { hp: 'E', mp: 'C', str: 'D', dex: 'F', vit: 'D', agi: 'E', int: 'E', mnd: 'A', chr: 'C' },
    traits: jobTraits['White Mage'],
    abilities: jobAbilities['White Mage']
  },
  {
    name: 'Black Mage',
    proficiencies: { hp: 'F', mp: 'B', str: 'F', dex: 'C', vit: 'F', agi: 'C', int: 'A', mnd: 'E', chr: 'D' },
    traits: jobTraits['Black Mage'],
    abilities: jobAbilities['Black Mage']
  },
  {
    name: 'Red Mage',
    proficiencies: { hp: 'D', mp: 'D', str: 'D', dex: 'D', vit: 'E', agi: 'E', int: 'C', mnd: 'C', chr: 'D' },
    traits: jobTraits['Red Mage'],
    abilities: jobAbilities['Red Mage']
  },
  {
    name: 'Thief',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'A', vit: 'D', agi: 'B', int: 'C', mnd: 'G', chr: 'G' },
    traits: jobTraits['Thief'],
    abilities: jobAbilities['Thief']
  },
  {
    name: 'Paladin',
    proficiencies: { hp: 'C', mp: 'F', str: 'B', dex: 'E', vit: 'A', agi: 'G', int: 'G', mnd: 'C', chr: 'C' },
    traits: jobTraits['Paladin'],
    abilities: jobAbilities['Paladin']
  },
  {
    name: 'Dark Knight',
    proficiencies: { hp: 'C', mp: 'F', str: 'A', dex: 'C', vit: 'C', agi: 'D', int: 'C', mnd: 'G', chr: 'G' },
    traits: jobTraits['Dark Knight'],
    abilities: jobAbilities['Dark Knight']
  },
  {
    name: 'Beastmaster',
    proficiencies: { hp: 'C', mp: 'X', str: 'D', dex: 'C', vit: 'D', agi: 'F', int: 'E', mnd: 'E', chr: 'A' },
    traits: jobTraits['Beastmaster'],
    abilities: jobAbilities['Beastmaster']
  },
  {
    name: 'Bard',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'D', vit: 'D', agi: 'F', int: 'D', mnd: 'D', chr: 'B' },
    traits: jobTraits['Bard'],
    abilities: jobAbilities['Bard']
  },
  {
    name: 'Ranger',
    proficiencies: { hp: 'E', mp: 'X', str: 'E', dex: 'D', vit: 'D', agi: 'A', int: 'E', mnd: 'D', chr: 'E' },
    traits: jobTraits['Ranger'],
    abilities: jobAbilities['Ranger']
  },
  {
    name: 'Samurai',
    proficiencies: { hp: 'B', mp: 'X', str: 'C', dex: 'C', vit: 'C', agi: 'D', int: 'E', mnd: 'E', chr: 'D' },
    traits: jobTraits['Samurai'],
    abilities: jobAbilities['Samurai']
  },
  {
    name: 'Ninja',
    proficiencies: { hp: 'D', mp: 'X', str: 'C', dex: 'B', vit: 'C', agi: 'B', int: 'D', mnd: 'G', chr: 'F' },
    traits: jobTraits['Ninja'],
    abilities: jobAbilities['Ninja']
  },
  {
    name: 'Dragoon',
    proficiencies: { hp: 'C', mp: 'X', str: 'C', dex: 'E', vit: 'C', agi: 'E', int: 'F', mnd: 'E', chr: 'C' },
    traits: jobTraits['Dragoon'],
    abilities: jobAbilities['Dragoon']
  },
  {
    name: 'Summoner',
    proficiencies: { hp: 'G', mp: 'A', str: 'G', dex: 'D', vit: 'G', agi: 'D', int: 'B', mnd: 'C', chr: 'C' },
    traits: jobTraits['Summoner'],
    abilities: jobAbilities['Summoner']
  },
  {
    name: 'Blue Mage',
    proficiencies: { hp: 'C', mp: 'D', str: 'C', dex: 'C', vit: 'C', agi: 'D', int: 'D', mnd: 'D', chr: 'C' },
    traits: jobTraits['Blue Mage'],
    abilities: jobAbilities['Blue Mage']
  },
  {
    name: 'Corsair',
    proficiencies: { hp: 'D', mp: 'E', str: 'E', dex: 'C', vit: 'D', agi: 'B', int: 'D', mnd: 'D', chr: 'B' },
    traits: jobTraits['Corsair'],
    abilities: jobAbilities['Corsair']
  },
  {
    name: 'Puppetmaster',
    proficiencies: { hp: 'C', mp: 'E', str: 'D', dex: 'C', vit: 'D', agi: 'C', int: 'D', mnd: 'D', chr: 'C' },
    traits: jobTraits['Puppetmaster'],
    abilities: jobAbilities['Puppetmaster']
  },
  {
    name: 'Dancer',
    proficiencies: { hp: 'D', mp: 'X', str: 'D', dex: 'A', vit: 'C', agi: 'C', int: 'C', mnd: 'G', chr: 'C' },
    traits: jobTraits['Dancer'],
    abilities: jobAbilities['Dancer']
  },
  {
    name: 'Scholar',
    proficiencies: { hp: 'E', mp: 'B', str: 'E', dex: 'D', vit: 'D', agi: 'D', int: 'B', mnd: 'A', chr: 'D' },
    traits: jobTraits['Scholar'],
    abilities: jobAbilities['Scholar']
  },
  {
    name: 'Geomancer',
    proficiencies: { hp: 'E', mp: 'B', str: 'E', dex: 'D', vit: 'D', agi: 'D', int: 'C', mnd: 'A', chr: 'D' },
    traits: jobTraits['Geomancer'],
    abilities: jobAbilities['Geomancer']
  },
  {
    name: 'Rune Fencer',
    proficiencies: { hp: 'B', mp: 'D', str: 'C', dex: 'C', vit: 'B', agi: 'D', int: 'C', mnd: 'D', chr: 'C' },
    traits: jobTraits['Rune Fencer'],
    abilities: jobAbilities['Rune Fencer']
  }
];

export const jobNames = jobs.map(j => j.name);
