export const races = [
  {
    name: 'Hume',
    proficiencies: {
      hp: 'D', mp: 'D', str: 'D', dex: 'D', vit: 'D', agi: 'D', int: 'D', mnd: 'D', chr: 'D'
    }
  },
  {
    name: 'Elvaan',
    proficiencies: {
      hp: 'C', mp: 'E', str: 'B', dex: 'E', vit: 'C', agi: 'F', int: 'F', mnd: 'B', chr: 'D'
    }
  },
  {
    name: 'Tarutaru',
    proficiencies: {
      hp: 'G', mp: 'A', str: 'F', dex: 'D', vit: 'E', agi: 'C', int: 'A', mnd: 'E', chr: 'D'
    }
  },
  {
    name: 'Mithra',
    proficiencies: {
      hp: 'D', mp: 'D', str: 'E', dex: 'A', vit: 'E', agi: 'B', int: 'D', mnd: 'E', chr: 'F'
    }
  },
  {
    name: 'Galka',
    proficiencies: {
      hp: 'A', mp: 'G', str: 'C', dex: 'D', vit: 'A', agi: 'E', int: 'E', mnd: 'D', chr: 'F'
    }
  }
];

export const raceNames = races.map(r => r.name);
