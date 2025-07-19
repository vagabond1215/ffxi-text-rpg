export const races = [
  {
    name: 'Hume',
    startingCity: 'Bastok',
    proficiencies: {
      hp: 'D', mp: 'D', str: 'D', dex: 'D', vit: 'D', agi: 'D', int: 'D', mnd: 'D', chr: 'D'
    }
  },
  {
    name: 'Elvaan',
    startingCity: "San d'Oria",
    proficiencies: {
      hp: 'C', mp: 'E', str: 'B', dex: 'E', vit: 'C', agi: 'F', int: 'F', mnd: 'B', chr: 'D'
    }
  },
  {
    name: 'Tarutaru',
    startingCity: 'Windurst',
    proficiencies: {
      hp: 'G', mp: 'A', str: 'F', dex: 'D', vit: 'E', agi: 'C', int: 'A', mnd: 'E', chr: 'D'
    }
  },
  {
    name: 'Mithra',
    startingCity: 'Windurst',
    proficiencies: {
      hp: 'D', mp: 'D', str: 'E', dex: 'A', vit: 'E', agi: 'B', int: 'D', mnd: 'E', chr: 'F'
    }
  },
  {
    name: 'Galka',
    startingCity: 'Bastok',
    proficiencies: {
      hp: 'A', mp: 'G', str: 'C', dex: 'D', vit: 'A', agi: 'E', int: 'E', mnd: 'D', chr: 'F'
    }
  }
];

export const raceNames = races.map(r => r.name);
export const startingCities = Object.fromEntries(
  races.map(r => [r.name, r.startingCity])
);
