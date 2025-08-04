// Weapon and magic proficiency definitions based on FFXI's skill system
// Weapon proficiencies are stored as a simple list of skill names.
export const weaponSkills = [
  'Hand-to-Hand',
  'Dagger',
  'Sword',
  'Great Sword',
  'Axe',
  'Great Axe',
  'Scythe',
  'Polearm',
  'Katana',
  'Great Katana',
  'Club',
  'Staff',
  'Archery',
  'Marksmanship',
  'Throwing'
];

// Magic proficiencies are objects that specify their broader magic type and a
// more granular subType used by spell definitions.
export const magicSkills = [
  { name: 'Elemental Magic', magicType: 'Black Magic', subType: 'Elemental' },
  { name: 'Dark Magic', magicType: 'Black Magic', subType: 'Dark' },
  { name: 'Enfeebling Magic', magicType: 'Black Magic', subType: 'Enfeebling' },
  { name: 'Enhancing Magic', magicType: 'White Magic', subType: 'Enhancing' },
  { name: 'Healing Magic', magicType: 'White Magic', subType: 'Healing' },
  { name: 'Divine Magic', magicType: 'White Magic', subType: 'Divine' },
  { name: 'Summoning Magic', magicType: 'Summoning Magic', subType: 'Summoning' },
  { name: 'Ninjutsu', magicType: 'Ninjutsu', subType: 'Ninjutsu' },
  { name: 'Singing', magicType: 'Bard', subType: 'Singing' },
  { name: 'Stringed Instrument', magicType: 'Bard', subType: 'Instrument' },
  { name: 'Wind Instrument', magicType: 'Bard', subType: 'Instrument' },
  { name: 'Blue Magic', magicType: 'Blue Magic', subType: 'Blue Magic' }
];
