export const cityList = ['Bastok', "San d'Oria", 'Windurst', 'Jeuno', 'Outlands'];

export const zonesByCity = {
  Bastok: [
    {
      name: 'Bastok Mines',
      city: 'Bastok',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Bastok Markets', 'Metalworks', 'Zeruhn Mines', 'North Gustaberg (East)', 'Bastok Residential Area'],
      pointsOfInterest: [
        'Mining Guild',
        "Boytz's Knickknacks",
        "Gelzerio's Stall",
        "Deegis's Armour",
        'Zemedars',
        'Proud Beard',
        "Neigepance's Chocobo Stables",
        "Griselda's Tavern",
        "Alchemists' Guild",
        "Rodellieux's Stall",
        'Home Point Crystal'
      ],
      importantNPCs: ['Gate Guard']
    },
    {
      name: 'Bastok Markets',
      city: 'Bastok',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Bastok Mines', 'Port Bastok', 'South Gustaberg', 'Bastok Residential Area'],
      pointsOfInterest: [
        'Auction House',
        "Goldsmiths' Guild",
        "Brunhilde's Armory",
        "Dragon's Claw Weaponry",
        "Carmelide's Jewelry Store",
        "Mjoll's General Goods",
        "Harmodios's Music Shop",
        'Scribe & Notary',
        'Tenshodo Entrance',
        'Chocobo Stables',
        'Home Point Crystal'
      ],
      importantNPCs: ['Gate Guard', 'Regional Merchant', 'Karine']
    },
    {
      name: 'Port Bastok',
      city: 'Bastok',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Bastok Markets', 'Bastok Residential Area', 'North Gustaberg (East)'],
      pointsOfInterest: [
        'Airship Dock',
        'Chocobo Stables',
        'Fishing Shop',
        'Ferry to Selbina',
        "Galvin's Travel Gear",
        'Denvihr',
        'Blabbivix',
        'Steaming Sheep Restaurant',
        'Sugandhi',
        'World Pass Merchant',
        'Map Vendor',
        'Home Point Crystal'
      ],
      importantNPCs: ['Gate Guard', 'Regional Merchant', 'Rex']
    },
    {
      name: 'Metalworks',
      city: 'Bastok',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Bastok Mines'],
      pointsOfInterest: ["President's Office", 'Mission/Rank NPCs', 'Cid', "Blacksmiths' Guild", 'Home Point Crystal'],
      importantNPCs: []
    },
    {
      name: 'Bastok Residential Area',
      city: 'Bastok',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Bastok Mines', 'Bastok Markets', 'Port Bastok'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Zeruhn Mines',
      city: 'Bastok',
      distance: 1,
      subAreas: [],
      connectedAreas: ['Bastok Mines', 'North Gustaberg (East)'],
      pointsOfInterest: ['Training Grounds', 'Mine Shafts'],
      importantNPCs: []
    },
    {
      name: 'North Gustaberg (East)',
      city: 'Bastok',
      region: 'Gustaberg',
      distance: 1,
      subAreas: [],
      connectedAreas: ['South Gustaberg', 'Port Bastok', 'Oldton Movalpolos', 'Palborough Mines'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    },
    {
      name: 'North Gustaberg (West)',
      city: 'Bastok',
      region: 'Gustaberg',
      distance: 1,
      subAreas: [],
      connectedAreas: ['South Gustaberg', 'Konschtat Highlands'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    },
    {
      name: 'South Gustaberg',
      city: 'Bastok',
      region: 'Gustaberg',
      distance: 1,
      subAreas: ['Vomp Hill', 'Goblin Camp'],
      coordinates: {
        'Bastok Markets': 'J-7',
        'Bastok Mines': 'L-8',
        'Dangruf Wadi': 'D-9',
        'North Gustaberg (West)': 'E-6',
        'North Gustaberg (East)': 'H-5',
        'Goblin Camp': 'K-10',
        'Cavernous Maw (Abyssea – Altepa)': 'J-10'
      },
      connectedAreas: [
        'Bastok Markets',
        'North Gustaberg (East)',
        'North Gustaberg (West)',
        'Dangruf Wadi',
        'Goblin Camp'
      ],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Vomp Hill L1',
      displayName: 'Vomp Hill',
      city: 'Bastok',
      region: 'Gustaberg',
      distance: 1,
      parent: 'South Gustaberg',
      coordinates: { 'Vomp Hill L2': 'J-8' },
      connectedAreas: ['Vomp Hill L2'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Vomp Hill L2',
      displayName: 'Vomp Hill',
      city: 'Bastok',
      region: 'Gustaberg',
      distance: 1,
      parent: 'South Gustaberg',
      coordinates: { 'Vomp Hill L1': 'J-8', 'Vomp Hill L3': 'I-9' },
      connectedAreas: ['Vomp Hill L1', 'Vomp Hill L3'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Vomp Hill L3',
      displayName: 'Vomp Hill',
      city: 'Bastok',
      region: 'Gustaberg',
      distance: 1,
      parent: 'South Gustaberg',
      coordinates: { 'Vomp Hill L2': 'I-9' },
      connectedAreas: ['Vomp Hill L2'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Goblin Camp',
      displayName: 'Goblin Camp',
      city: 'Bastok',
      region: 'Gustaberg',
      distance: 1,
      parent: 'South Gustaberg',
      coordinates: { 'South Gustaberg': 'K-10' },
      connectedAreas: ['South Gustaberg'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Konschtat Highlands',
      city: 'Bastok',
      distance: 2,
      subAreas: [],
      connectedAreas: ['North Gustaberg (West)', 'Valkurm Dunes', 'Gusgen Mines', 'Pashhow Marshlands'],
      pointsOfInterest: ['Outpost', 'Crag of Dem'],
      importantNPCs: []
    },
    {
      name: 'Gusgen Mines',
      city: 'Bastok',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Konschtat Highlands'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Palborough Mines',
      city: 'Bastok',
      distance: 2,
      subAreas: [],
      connectedAreas: ['North Gustaberg (East)'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Oldton Movalpolos',
      city: 'Bastok',
      distance: 2,
      subAreas: [],
      connectedAreas: ['North Gustaberg (East)'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Dangruf Wadi',
      city: 'Bastok',
      distance: 2,
      subAreas: [],
      connectedAreas: ['North Gustaberg (East)', 'South Gustaberg'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    }
  ],
  "San d'Oria": [
    {
      name: "Northern San d'Oria",
      city: "San d'Oria",
      distance: 0,
      subAreas: [],
      connectedAreas: ["Southern San d'Oria", "Port San d'Oria", "Château d'Oraguille", 'West Ronfaure', "San d'Oria Residential Area"],
      pointsOfInterest: ['Auction House', 'Armor Shop', 'Weapon Shop', 'Consumable Shop', 'Item Shop', 'Chocobo Stables', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Mission/Fame NPCs', 'Outpost Warper', 'Regional Merchant', 'Elesca']
    },
    {
      name: "Southern San d'Oria",
      city: "San d'Oria",
      distance: 0,
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", 'East Ronfaure', "San d'Oria Residential Area"],
      pointsOfInterest: ["Carpenter's Guild", "Blacksmith's Guild", 'Food Shop', 'Arrow Shop', 'Potion Shop', 'Armor Shop', 'Sword Shop', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Quest Giver NPCs', 'Regional Merchant', 'Violitte']
    },
    {
      name: "Port San d'Oria",
      city: "San d'Oria",
      distance: 0,
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", "San d'Oria Residential Area"],
      pointsOfInterest: ['Airship Dock', 'Chocobo Stables', 'Fishing Guild', 'Item Shop', 'Home Point Crystal', 'Ferry to Mhaura', 'Map Vendor'],
      importantNPCs: ['Gate Guard', 'Ferry Ticket Seller', 'Regional Merchant']
    },
    {
      name: "Château d'Oraguille",
      city: "San d'Oria",
      distance: 0,
      subAreas: [],
      connectedAreas: ["Northern San d'Oria"],
      pointsOfInterest: ['Mission/Rank NPCs', 'Prince Trion', 'High-Level Quest Givers', 'Home Point Crystal'],
      importantNPCs: []
    },
    {
      name: "San d'Oria Residential Area",
      city: "San d'Oria",
      distance: 0,
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", "Southern San d'Oria", "Port San d'Oria"],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'West Ronfaure',
      city: "San d'Oria",
      distance: 1,
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", 'East Ronfaure', 'La Theine Plateau'],
      pointsOfInterest: ['Outpost', 'Canyon'],
      importantNPCs: []
    },
    {
      name: 'East Ronfaure',
      city: "San d'Oria",
      distance: 1,
      subAreas: [],
      connectedAreas: ["Southern San d'Oria", 'West Ronfaure', 'La Theine Plateau', "King Ranperre's Tomb"],
      pointsOfInterest: ['Outpost', 'Orc Camps'],
      importantNPCs: []
    },
    {
      name: 'La Theine Plateau',
      city: "San d'Oria",
      distance: 2,
      subAreas: [],
      connectedAreas: ['West Ronfaure', 'East Ronfaure', 'Valkurm Dunes'],
      pointsOfInterest: ['Outpost', 'Crag of Holla'],
      importantNPCs: []
    },
    {
      name: "King Ranperre's Tomb",
      city: "San d'Oria",
      distance: 2,
      subAreas: [],
      connectedAreas: ['East Ronfaure'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Ghelsba Outpost',
      city: "San d'Oria",
      distance: 2,
      subAreas: [],
      connectedAreas: ['West Ronfaure'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    }
  ],
  Windurst: [
    {
      name: 'Windurst Waters',
      city: 'Windurst',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Windurst Walls', 'Windurst Woods', 'Port Windurst', 'East Sarutabaruta', 'Windurst Residential Area'],
      pointsOfInterest: ['Auction House', 'Cooking Guild', "Fisherman's Guild", 'General Store', 'Food Shop', 'Scroll Shop', 'Item Shop', 'Chocobo Stables', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Mission/Quest NPCs', 'Outpost Warper', 'Regional Merchant']
    },
    {
      name: 'Windurst Woods',
      city: 'Windurst',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Port Windurst', 'East Sarutabaruta', 'Windurst Residential Area'],
      pointsOfInterest: ['Clothcraft Guild', "Boneworker's Guild", 'Dagger Shop', 'Staff Shop', 'Magic Shop', 'Guild Shop', 'Alchemy Shop', 'Consumable Shop', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Fame/Quest/Event NPCs', 'Regional Merchant', 'Pehki Machumaht']
    },
    {
      name: 'Windurst Walls',
      city: 'Windurst',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Heavens Tower'],
      pointsOfInterest: ['Home Point Crystal'],
      importantNPCs: ['Quest/Mission/Event NPCs']
    },
    {
      name: 'Port Windurst',
      city: 'Windurst',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'West Sarutabaruta', 'Windurst Woods', 'Windurst Residential Area'],
      pointsOfInterest: ['Ferry to Mhaura', 'Chocobo Stables', 'Fishing Supplies Shop', 'Item Shop', 'Airship Dock', 'Home Point Crystal', 'Map Vendor'],
      importantNPCs: ['Regional Merchant', 'Ferry Ticket Seller', 'Mhoji Roccoruh']
    },
    {
      name: 'Heavens Tower',
      city: 'Windurst',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Windurst Walls'],
      pointsOfInterest: ['Star Sibyl', 'Mission/Rank/Quest/Event NPCs', 'Home Point Crystal'],
      importantNPCs: []
    },
    {
      name: 'Windurst Residential Area',
      city: 'Windurst',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Windurst Woods', 'Port Windurst'],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'East Sarutabaruta',
      city: 'Windurst',
      distance: 1,
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Windurst Woods', 'Tahrongi Canyon'],
      pointsOfInterest: ['Outpost', 'Crag of Mea'],
      importantNPCs: []
    },
    {
      name: 'West Sarutabaruta',
      city: 'Windurst',
      distance: 1,
      subAreas: [],
      connectedAreas: ['Port Windurst', 'Tahrongi Canyon', 'Giddeus'],
      pointsOfInterest: ['Outpost', 'Giddeus Entrance'],
      importantNPCs: []
    },
    {
      name: 'Giddeus',
      city: 'Windurst',
      distance: 2,
      subAreas: [],
      connectedAreas: ['West Sarutabaruta'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    },
    {
      name: 'Tahrongi Canyon',
      city: 'Windurst',
      distance: 2,
      subAreas: [],
      connectedAreas: ['East Sarutabaruta', 'West Sarutabaruta', 'Buburimu Peninsula', 'Meriphataud Mountains'],
      pointsOfInterest: ['Outpost', 'Crag of Mea'],
      importantNPCs: []
    },
    {
      name: 'Buburimu Peninsula',
      city: 'Windurst',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Tahrongi Canyon'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    },
    {
      name: 'Meriphataud Mountains',
      city: 'Windurst',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Tahrongi Canyon', 'Sauromugue Champaign'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    }
  ],
  Jeuno: [
    {
      name: 'Lower Jeuno',
      city: 'Jeuno',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Upper Jeuno', 'Port Jeuno', 'Qufim Island', 'Rolanberry Fields', 'Jeuno Residential Area'],
      pointsOfInterest: ['Auction House', 'Chocobo Stables', 'General Goods Shop', 'Armor Shop', 'Weapon Shop', 'Home Point Crystal', 'Map Vendor'],
      importantNPCs: ['Fame/Mission/Quest NPCs', 'Outpost Warper', 'Regional Merchant', 'Promurouve']
    },
    {
      name: 'Upper Jeuno',
      city: 'Jeuno',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Lower Jeuno', "Ru'Lude Gardens", 'Battalia Downs', 'Jeuno Residential Area'],
      pointsOfInterest: ['Airship Dock', 'Magic Shop', 'Item Shop', 'Armor Shop', 'Weapon Shop', 'Consumable Shop', 'Home Point Crystal'],
      importantNPCs: ['Mission/Quest/Event NPCs', 'Regional Merchant', 'Rusese']
    },
    {
      name: 'Port Jeuno',
      city: 'Jeuno',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Lower Jeuno', 'Sauromugue Champaign', 'Jeuno Residential Area'],
      pointsOfInterest: ['Ferry to Selbina', 'Ferry to Mhaura', 'Auction House', 'Fishing Shop', 'Item Shop', 'Armor Shop', 'Weapon Shop', 'Home Point Crystal'],
      importantNPCs: ['Outpost Warper', 'Regional Merchant']
    },
    {
      name: "Ru'Lude Gardens",
      city: 'Jeuno',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Upper Jeuno', 'Jeuno Residential Area'],
      pointsOfInterest: ['Home Point Crystal'],
      importantNPCs: ['Embassy/Mission NPCs', 'Event/High-Rank/Quest NPCs']
    },
    {
      name: 'Jeuno Residential Area',
      city: 'Jeuno',
      distance: 0,
      subAreas: [],
      connectedAreas: ['Lower Jeuno', 'Upper Jeuno', 'Port Jeuno', "Ru'Lude Gardens"],
      pointsOfInterest: [],
      importantNPCs: []
    },
    {
      name: 'Qufim Island',
      city: 'Jeuno',
      distance: 2,
      subAreas: [],
      connectedAreas: ['Lower Jeuno'],
      pointsOfInterest: ['Outpost', "Delkfutt's Tower"],
      importantNPCs: []
    },
    {
      name: 'Rolanberry Fields',
      city: 'Jeuno',
      distance: 2,
      subAreas: [],
      connectedAreas: ['Lower Jeuno', 'Sauromugue Champaign', 'Battalia Downs', 'Pashhow Marshlands'],
      pointsOfInterest: ['Outpost', 'Crag of Mea'],
      importantNPCs: []
    },
    {
      name: 'Sauromugue Champaign',
      city: 'Jeuno',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Port Jeuno', 'Rolanberry Fields', 'Meriphataud Mountains'],
      pointsOfInterest: ['Outpost', 'Crag of Dem'],
      importantNPCs: []
    },
    {
      name: 'Battalia Downs',
      city: 'Jeuno',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Upper Jeuno', 'Rolanberry Fields'],
      pointsOfInterest: ['Outpost', 'Crag of Holla'],
      importantNPCs: []
    },
    {
      name: 'Pashhow Marshlands',
      city: 'Jeuno',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Konschtat Highlands', 'Rolanberry Fields'],
      pointsOfInterest: ['Outpost', 'Crag of Dem'],
      importantNPCs: []
    },
    {
      name: 'Valkurm Dunes',
      city: 'Jeuno',
      distance: 2,
      subAreas: [],
      connectedAreas: ['Konschtat Highlands', 'La Theine Plateau'],
      pointsOfInterest: ['Outpost'],
      importantNPCs: []
    }
  ],
  Outlands: [
    {
      name: 'Mhaura',
      city: 'Outlands',
      distance: 2,
      subAreas: [],
      connectedAreas: ['Buburimu Peninsula', 'Selbina', 'Aht Urhgan Whitegate'],
      pointsOfInterest: ['Ferry Docks', 'Home Point Crystal'],
      importantNPCs: ['Ludwig']
    },
    {
      name: 'Selbina',
      city: 'Outlands',
      distance: 2,
      subAreas: [],
      connectedAreas: ['Valkurm Dunes', 'Mhaura'],
      pointsOfInterest: ['Ferry Docks', 'Home Point Crystal'],
      importantNPCs: ['Lombaria']
    },
    {
      name: 'Castle Oztroja',
      city: 'Outlands',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Meriphataud Mountains'],
      pointsOfInterest: [],
      importantNPCs: ['Antiqix']
    },
    {
      name: 'Beadeaux',
      city: 'Outlands',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Pashhow Marshlands'],
      pointsOfInterest: [],
      importantNPCs: ['Haggleblix']
    },
    {
      name: 'Davoi',
      city: 'Outlands',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Battalia Downs'],
      pointsOfInterest: [],
      importantNPCs: ['Lootblox']
    },
    {
      name: 'Aht Urhgan Whitegate',
      city: 'Outlands',
      distance: 3,
      subAreas: [],
      connectedAreas: ['Mhaura'],
      pointsOfInterest: ['Home Point Crystal'],
      importantNPCs: ['Riyadahf']
    }
  ]
};

export const locations = Object.values(zonesByCity).flat();
export const zoneNames = locations.map(z => z.name);
