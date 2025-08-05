export const gathering = [
  { name: 'Logging', description: 'Harvest lumber from logging points.' },
  { name: 'Mining', description: 'Extract ore from mining points.' },
  { name: 'Harvesting', description: 'Gather plants from harvesting points.' },
  { name: 'Excavation', description: 'Dig for fossils and artifacts.' },
  { name: 'Clamming', description: 'Collect shellfish from tidal pools.' },
  { name: 'Chocobo Digging', description: 'Unearth items while riding a chocobo.' }
];

export const gatheringNames = gathering.map(g => g.name);
