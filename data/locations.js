export const cityList = ['Bastok', "San d'Oria", 'Windurst', 'Jeuno'];

export const zonesByCity = {
  Bastok: [
    {
      name: 'Bastok Mines',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Markets', 'Metalworks', 'Zeruhn Mines', 'North Gustaberg', 'Bastok Residential Area'],
      pointsOfInterest: ['Mog House', 'Steaming Sheep Tavern', 'Alchemy Guild'],
      importantNPCs: ['Naji', 'Gumbah']
    },
    {
      name: 'Bastok Markets',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Mines', 'Port Bastok', 'South Gustaberg', 'Bastok Residential Area'],
      pointsOfInterest: ['Auction House', 'Chocobo Stables', 'Goldsmiths\' Guild'],
      importantNPCs: ['Ayame', 'Iron Eater']
    },
    {
      name: 'Port Bastok',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Markets', 'South Gustaberg', 'Bastok Residential Area'],
      pointsOfInterest: ['Airship Dock'],
      importantNPCs: ['Cid']
    },
    {
      name: 'Metalworks',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Mines'],
      pointsOfInterest: ["President's Office", 'Smithing Guild'],
      importantNPCs: ['President Karst']
    },
    {
      name: 'Bastok Residential Area',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Mines', 'Bastok Markets', 'Port Bastok'],
      pointsOfInterest: ['Mog House'],
      importantNPCs: []
    }
  ],
  "San d'Oria": [
    {
      name: "Northern San d'Oria",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Southern San d'Oria", "Port San d'Oria", "Château d'Oraguille", 'East Ronfaure', "San d'Oria Residential Area"],
      pointsOfInterest: ['Auction House', 'Cathedral'],
      importantNPCs: ['Trion', 'Rahal']
    },
    {
      name: "Southern San d'Oria",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", "Port San d'Oria", 'West Ronfaure'],
      pointsOfInterest: ['Chocobo Stables', 'Woodworking Guild', 'Leathercraft Guild'],
      importantNPCs: ['Curilla']
    },
    {
      name: "Port San d'Oria",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", "Southern San d'Oria", 'East Ronfaure'],
      pointsOfInterest: ['Airship Dock'],
      importantNPCs: []
    },
    {
      name: "Château d'Oraguille",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Northern San d'Oria"],
      pointsOfInterest: ['Throne Room'],
      importantNPCs: ['King Destin', 'Prince Trion', 'Prince Pieuje']
    },
    {
      name: "San d'Oria Residential Area",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", "Southern San d'Oria", "Port San d'Oria"],
      pointsOfInterest: ['Mog House'],
      importantNPCs: []
    }
  ],
  Windurst: [
    {
      name: 'Windurst Waters',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Walls', 'Windurst Woods', 'Port Windurst', 'East Sarutabaruta', 'Windurst Residential Area'],
      pointsOfInterest: ['Auction House', 'Clothcraft Guild', 'Cooking Guild'],
      importantNPCs: ['Kupipi']
    },
    {
      name: 'Windurst Woods',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Port Windurst', 'East Sarutabaruta', 'Windurst Residential Area'],
      pointsOfInterest: ['Chocobo Stables', 'Bonecraft Guild'],
      importantNPCs: ['Apururu']
    },
    {
      name: 'Windurst Walls',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Heavens Tower'],
      pointsOfInterest: ['Mog House'],
      importantNPCs: ['Shantotto']
    },
    {
      name: 'Port Windurst',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Woods', 'Windurst Waters', 'East Sarutabaruta', 'Windurst Residential Area'],
      pointsOfInterest: ['Airship Dock', 'Fishing Guild'],
      importantNPCs: []
    },
    {
      name: 'Heavens Tower',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Walls'],
      pointsOfInterest: ['Star Tree'],
      importantNPCs: ['Star Sibyl']
    },
    {
      name: 'Windurst Residential Area',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Windurst Woods', 'Port Windurst'],
      pointsOfInterest: ['Mog House'],
      importantNPCs: []
    }
  ],
  Jeuno: [
    {
      name: 'Lower Jeuno',
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Port Jeuno', 'Upper Jeuno', 'Jeuno Residential Area'],
      pointsOfInterest: ['Auction House', 'Synergy Furnace'],
      importantNPCs: ['Magian Moogle']
    },
    {
      name: 'Upper Jeuno',
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Lower Jeuno', 'Port Jeuno', "Ru'Lude Gardens", 'Jeuno Residential Area'],
      pointsOfInterest: ['Chocobo Stables'],
      importantNPCs: ['Jubilee', 'Monisette']
    },
    {
      name: 'Port Jeuno',
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Lower Jeuno', 'Upper Jeuno', 'Jeuno Residential Area'],
      pointsOfInterest: ['Airship Dock'],
      importantNPCs: ['Maat']
    },
    {
      name: "Ru'Lude Gardens",
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Upper Jeuno', 'Jeuno Residential Area'],
      pointsOfInterest: ['Palace'],
      importantNPCs: ["Kam'lanaut"]
    },
    {
      name: 'Jeuno Residential Area',
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Lower Jeuno', 'Upper Jeuno', 'Port Jeuno', "Ru'Lude Gardens"],
      pointsOfInterest: ['Mog House'],
      importantNPCs: []
    }
  ]
};

export const locations = Object.values(zonesByCity).flat();
export const zoneNames = locations.map(z => z.name);
