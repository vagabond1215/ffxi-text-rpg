export const cityList = ['Bastok', "San d'Oria", 'Windurst', 'Jeuno'];

export const zonesByCity = {
  Bastok: [
    {
      name: 'Bastok Mines',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Markets', 'Metalworks', 'Zeruhn Mines', 'North Gustaberg'],
      pointsOfInterest: ['Mog House', 'Mining Guild', 'Swordsmith Shop', 'General Goods Shop', 'Food Shop', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard']
    },
    {
      name: 'Bastok Markets',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Mines', 'Port Bastok', 'South Gustaberg'],
      pointsOfInterest: ['Auction House', 'Mog House', 'Rental House', "Goldsmiths' Guild", "Blacksmiths' Guild", 'Arms & Armor Shop', 'General Goods Shop', 'Item Shop', 'Tenshodo Entrance', 'Chocobo Stables', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Regional Merchant']
    },
    {
      name: 'Port Bastok',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Markets'],
      pointsOfInterest: ['Airship Dock', 'Chocobo Stables', 'Fishing Shop', 'Ferry to Selbina', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Regional Merchant']
    },
    {
      name: 'Metalworks',
      city: 'Bastok',
      subAreas: [],
      connectedAreas: ['Bastok Mines'],
      pointsOfInterest: ["President's Office", 'Mission/Rank NPCs', 'Cid', 'Home Point Crystal'],
      importantNPCs: []
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
      connectedAreas: ["Southern San d'Oria", "Port San d'Oria", "Château d'Oraguille", 'West Ronfaure'],
      pointsOfInterest: ['Auction House', 'Mog House', 'Rental House', 'Armor Shop', 'Weapon Shop', 'Consumable Shop', 'Item Shop', 'Chocobo Stables', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Mission/Fame NPCs', 'Outpost Warper', 'Regional Merchant']
    },
    {
      name: "Southern San d'Oria",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Northern San d'Oria", 'East Ronfaure'],
      pointsOfInterest: ["Carpenter's Guild", "Blacksmith's Guild", 'Food Shop', 'Arrow Shop', 'Potion Shop', 'Armor Shop', 'Sword Shop', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Quest Giver NPCs', 'Regional Merchant']
    },
    {
      name: "Port San d'Oria",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Northern San d'Oria"],
      pointsOfInterest: ['Airship Dock', 'Chocobo Stables', 'Fishing Guild', 'Item Shop', 'Home Point Crystal', 'Ferry to Mhaura'],
      importantNPCs: ['Gate Guard', 'Ferry Ticket Seller', 'Regional Merchant']
    },
    {
      name: "Château d'Oraguille",
      city: "San d'Oria",
      subAreas: [],
      connectedAreas: ["Northern San d'Oria"],
      pointsOfInterest: ['Mission/Rank NPCs', 'Prince Trion', 'High-Level Quest Givers', 'Home Point Crystal'],
      importantNPCs: []
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
      connectedAreas: ['Windurst Walls', 'Windurst Woods', 'Port Windurst', 'East Sarutabaruta'],
      pointsOfInterest: ['Auction House', 'Mog House', 'Rental House', 'Cooking Guild', "Fisherman's Guild", 'General Store', 'Food Shop', 'Scroll Shop', 'Item Shop', 'Chocobo Stables', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Mission/Quest NPCs', 'Outpost Warper', 'Regional Merchant']
    },
    {
      name: 'Windurst Woods',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Port Windurst', 'East Sarutabaruta'],
      pointsOfInterest: ['Clothcraft Guild', "Boneworker's Guild", 'Dagger Shop', 'Staff Shop', 'Magic Shop', 'Guild Shop', 'Alchemy Shop', 'Consumable Shop', 'Home Point Crystal'],
      importantNPCs: ['Gate Guard', 'Fame/Quest/Event NPCs', 'Regional Merchant']
    },
    {
      name: 'Windurst Walls',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Waters', 'Heavens Tower'],
      pointsOfInterest: ['Home Point Crystal'],
      importantNPCs: ['Quest/Mission/Event NPCs']
    },
    {
      name: 'Port Windurst',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Waters'],
      pointsOfInterest: ['Ferry to Mhaura', 'Chocobo Stables', 'Fishing Supplies Shop', 'Item Shop', 'Airship Dock', 'Home Point Crystal'],
      importantNPCs: ['Regional Merchant', 'Ferry Ticket Seller']
    },
    {
      name: 'Heavens Tower',
      city: 'Windurst',
      subAreas: [],
      connectedAreas: ['Windurst Walls'],
      pointsOfInterest: ['Star Sibyl', 'Mission/Rank/Quest/Event NPCs', 'Home Point Crystal'],
      importantNPCs: []
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
      connectedAreas: ['Upper Jeuno', 'Port Jeuno', 'Qufim Island'],
      pointsOfInterest: ['Auction House', 'Mog House', 'Rental House', 'Chocobo Stables', 'General Goods Shop', 'Armor Shop', 'Weapon Shop', 'Home Point Crystal'],
      importantNPCs: ['Fame/Mission/Quest NPCs', 'Outpost Warper', 'Regional Merchant']
    },
    {
      name: 'Upper Jeuno',
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Lower Jeuno', "Ru'Lude Gardens"],
      pointsOfInterest: ['Airship Dock', 'Magic Shop', 'Item Shop', 'Armor Shop', 'Weapon Shop', 'Consumable Shop', 'Home Point Crystal'],
      importantNPCs: ['Mission/Quest/Event NPCs', 'Regional Merchant']
    },
    {
      name: 'Port Jeuno',
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Lower Jeuno'],
      pointsOfInterest: ['Ferry to Selbina', 'Ferry to Mhaura', 'Auction House', 'Fishing Shop', 'Item Shop', 'Armor Shop', 'Weapon Shop', 'Home Point Crystal'],
      importantNPCs: ['Outpost Warper', 'Regional Merchant']
    },
    {
      name: "Ru'Lude Gardens",
      city: 'Jeuno',
      subAreas: [],
      connectedAreas: ['Upper Jeuno'],
      pointsOfInterest: ['Home Point Crystal'],
      importantNPCs: ['Embassy/Mission NPCs', 'Event/High-Rank/Quest NPCs']
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
