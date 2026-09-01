import { createEnemy, createNpc } from '../entities/entityFactory.js';

export function createSeedNpcs() {
    return [
        createNpc({
            id: 'npc-thornwall-gate-warden', name: 'Thornwall Gate Warden', title: 'Road Warden', faction: 'Thornwall',
            locationId: 'thornwall-southgate', services: ['realmSeal', 'regionalRewards'],
        }),
        createNpc({
            id: 'npc-thornwall-sera-talwin', name: 'Sera Talwin', title: 'Southgate Guide', faction: 'Thornwall',
            locationId: 'thornwall-southgate', services: ['orientation', 'commissions', 'road-guidance'],
            questIds: ['commitment-thornwall-sweetroot-return'],
        }),
        createNpc({
            id: 'npc-thornwall-mira-fen', name: 'Mira Fen', title: 'Southgate Cook', faction: 'Thornwall',
            locationId: 'thornwall-southgate', services: ['food', 'household', 'commissions'],
            questIds: ['commitment-thornwall-hearth-sweetroot-share'],
        }),
        createNpc({
            id: 'npc-thornwall-edrin-bale', name: 'Edrin Bale', title: 'Tanning Guild Master', faction: 'Thornwall',
            locationId: 'thornwall-southgate', services: ['tanning', 'training', 'commissions'],
            questIds: ['commitment-thornwall-tanned-hide-order'],
        }),
        createNpc({
            id: 'npc-thornwall-nessa-woodmere', name: 'Nessa Woodmere', title: 'Elderwood Factor', faction: 'Thornwall',
            locationId: 'thornwall-southgate', services: ['regional-goods', 'forestry', 'commissions'],
            questIds: ['commitment-thornwall-forester-gloves'],
        }),
        createNpc({
            id: 'npc-thornwall-oren-vale', name: 'Oren Vale', title: 'Road Works Clerk', faction: 'Thornwall',
            locationId: 'thornwall-southgate', services: ['civic', 'roadworks', 'commissions'],
            questIds: ['commitment-thornwall-trail-repair-bundles'],
        }),
        createNpc({
            id: 'npc-road-instructor', name: 'Road Instructor', title: 'Combat Tutor',
            locationId: 'thornwall-southgate', services: ['tutorial', 'sparring'],
        }),
        createNpc({
            id: 'npc-crownfields-maelin-rook', name: 'Maelin Rook', title: 'Grange Produce Factor', faction: 'Thornwall',
            locationId: 'crownfields-grange', services: ['regional-goods', 'produce-trade', 'crop-appraisal', 'provisions'],
        }),
        createNpc({
            id: 'npc-crownfields-hessa-vale', name: 'Hessa Vale', title: 'Growers’ Hall Steward', faction: 'Thornwall',
            locationId: 'crownfields-grange', services: ['agriculture', 'fieldcraft', 'harvest-guidance', 'market-notices', 'drover-notices'],
        }),
        createNpc({
            id: 'npc-crownfields-perrin-bale', name: 'Perrin Bale', title: 'Produce Wagonmaster', faction: 'Thornwall',
            locationId: 'crownfields-grange', services: ['wagon-travel', 'stabling', 'draft-animal-care', 'produce-freight'],
        }),
        createNpc({
            id: 'npc-great-mere-essel-wren', name: 'Essel Wren', title: 'Merewatch Fishery Factor', faction: 'Mistmere',
            locationId: 'merewatch-landing', services: ['regional-goods', 'fishery-trade', 'catch-appraisal', 'provisions'],
        }),
        createNpc({
            id: 'npc-great-mere-jory-tamm', name: 'Jory Tamm', title: 'Lakesmen’s Hall Steward', faction: 'Mistmere',
            locationId: 'merewatch-landing', services: ['fishing', 'lakecraft', 'food-safety', 'processing-guidance', 'fishery-notices'],
        }),
        createNpc({
            id: 'npc-great-mere-nara-veil', name: 'Nara Veil', title: 'Great Mere Ferrymaster', faction: 'Mistmere',
            locationId: 'merewatch-landing', services: ['ferry-booking', 'skiff-guidance', 'lake-weather', 'cargo'],
        }),
        createNpc({
            id: 'npc-ironspine-vara-kell', name: 'Vara Kell', title: 'High-Pass Survey Factor', faction: 'Brasshaven',
            locationId: 'ironspine-watchpost', services: ['regional-goods', 'survey-trade', 'resource-appraisal', 'provisions'],
        }),
        createNpc({
            id: 'npc-ironspine-dain-rove', name: 'Dain Rove', title: 'Ironspine Warden', faction: 'Brasshaven',
            locationId: 'ironspine-watchpost', services: ['route-guidance', 'hunting', 'wildlife-tracking', 'weather', 'field-training'],
        }),
        createNpc({
            id: 'npc-ironspine-mara-fell', name: 'Mara Fell', title: 'Pass Lodge Keeper', faction: 'Brasshaven',
            locationId: 'ironspine-watchpost', services: ['lodging', 'food', 'animal-shelter', 'trail-provisions'],
        }),
        createNpc({
            id: 'npc-cinderwell-tarin-hove', name: 'Tarin Hove', title: 'Cinderwell Field Factor', faction: 'Brasshaven',
            locationId: 'cinderwell-station', services: ['regional-goods', 'caravan-trade', 'resource-appraisal', 'provisions', 'water'],
        }),
        createNpc({
            id: 'npc-cinderwell-merek-sorn', name: 'Merek Sorn', title: 'Emberwash Caravan Warden', faction: 'Brasshaven',
            locationId: 'cinderwell-station', services: ['route-guidance', 'wash-crossings', 'water-notices', 'fieldcraft', 'wagon-turnaround'],
        }),
        createNpc({
            id: 'npc-cinderwell-pella-aven', name: 'Pella Aven', title: 'Cinderwell Station Keeper', faction: 'Brasshaven',
            locationId: 'cinderwell-station', services: ['lodging', 'food', 'cistern-care', 'stabling', 'field-repair', 'trail-provisions'],
        }),
        createNpc({
            id: 'npc-lantern-sump-ressa-kell', name: 'Ressa Kell', title: 'Lower Deepvein Factor', faction: 'Brasshaven',
            locationId: 'lantern-sump-station', services: ['regional-goods', 'delver-trade', 'resource-appraisal', 'provisions', 'lamp-supplies'],
        }),
        createNpc({
            id: 'npc-lantern-sump-borin-vale', name: 'Borin Vale', title: 'Deepvein Survey Warden', faction: 'Brasshaven',
            locationId: 'lantern-sump-station', services: ['route-guidance', 'cave-survey', 'gallery-conditions', 'fieldcraft', 'mine-safety'],
        }),
        createNpc({
            id: 'npc-lantern-sump-hessa-rusk', name: 'Hessa Rusk', title: 'Lantern Sump Station Keeper', faction: 'Brasshaven',
            locationId: 'lantern-sump-station', services: ['lodging', 'food', 'cistern-care', 'lampwork', 'field-repair', 'first-aid'],
        }),
        createNpc({
            id: 'npc-oldbough-mara-oren', name: 'Mara Oren', title: 'Oldbough Field Factor', faction: 'Thornwall',
            locationId: 'oldbough-refuge', services: ['regional-goods', 'forestry-trade', 'resource-appraisal', 'provisions'],
        }),
        createNpc({
            id: 'npc-oldbough-hale-rowan', name: 'Hale Rowan', title: 'Gloamwood Boundary Forester', faction: 'Thornwall',
            locationId: 'oldbough-refuge', services: ['route-guidance', 'forestry', 'deadfall-notices', 'fieldcraft', 'wagon-turnaround'],
        }),
        createNpc({
            id: 'npc-oldbough-tessa-brin', name: 'Tessa Brin', title: 'Oldbough Refuge Keeper', faction: 'Thornwall',
            locationId: 'oldbough-refuge', services: ['lodging', 'food', 'drying', 'woodwork', 'trail-provisions'],
        }),
        createNpc({
            id: 'npc-headwater-elin-marr', name: 'Elin Marr', title: 'Headwater River Factor', faction: 'Thornwall',
            locationId: 'headwater-warden-lodge', services: ['regional-goods', 'fishery-trade', 'timber-appraisal', 'provisions'],
        }),
        createNpc({
            id: 'npc-headwater-torin-ash', name: 'Torin Ash', title: 'Headwater Warden', faction: 'Thornwall',
            locationId: 'headwater-warden-lodge', services: ['route-guidance', 'river-crossings', 'hunting', 'wildlife-tracking', 'roadwork'],
        }),
        createNpc({
            id: 'npc-headwater-bessa-reed', name: 'Bessa Reed', title: 'Headwater Lodge Keeper', faction: 'Thornwall',
            locationId: 'headwater-warden-lodge', services: ['lodging', 'food', 'smokehouse', 'animal-shelter', 'trail-provisions'],
        }),
        createNpc({id:'npc-cairnward-sella-ward',name:'Sella Ward',title:'Cairnward Relay Factor',locationId:'cairnward-relay',services:['regional-goods','transshipment','resource-appraisal','provisions','caravan']}),
        createNpc({id:'npc-cairnward-kellan-rusk',name:'Kellan Rusk',title:'Plateau Route Warden',locationId:'cairnward-relay',services:['route-guidance','saddle-conditions','road-notices','wagon-transfer','fieldcraft']}),
        createNpc({id:'npc-cairnward-tam-berrow',name:'Tam Berrow',title:'Cairnward Cartwright',locationId:'cairnward-relay',services:['lodging','food','cart-repair','wheelwork','animal-shelter','trail-provisions']}),
        createNpc({
            id: 'npc-tideglass-lessa-venn', name: 'Lessa Venn', title: 'Tideglass Delta Factor', faction: 'Mistmere',
            locationId: 'tideglass-landing', services: ['regional-goods', 'fishery-trade', 'shellfish-appraisal', 'salt-trade', 'provisions'],
        }),
        createNpc({
            id: 'npc-tideglass-orin-cade', name: 'Orin Cade', title: 'Delta Pilot', faction: 'Mistmere',
            locationId: 'tideglass-landing', services: ['ferry-booking', 'pilotage', 'shoal-guidance', 'tide-notices', 'cargo'],
        }),
        createNpc({
            id: 'npc-tideglass-maela-thorne', name: 'Maela Thorne', title: 'Tideglass Smokehouse Keeper', faction: 'Mistmere',
            locationId: 'tideglass-landing', services: ['food', 'smokehouse', 'shellfish-preparation', 'lodging', 'net-repair'],
        }),
        createNpc({
            id: 'npc-slatewater-eira-voss', name: 'Eira Voss', title: 'Waylodge Factor',
            locationId: 'slatewater-waylodge', services: ['regional-goods', 'trade', 'resource-appraisal', 'provisions'],
        }),
        createNpc({
            id: 'npc-slatewater-toren-marr', name: 'Toren Marr', title: 'Foothill Guild Steward',
            locationId: 'slatewater-waylodge', services: ['gathering', 'hunting', 'route-guidance', 'field-training', 'trade-notices'],
        }),
        createNpc({
            id: 'npc-slatewater-bram-pell', name: 'Bram Pell', title: 'Waylodge Stablemaster',
            locationId: 'slatewater-waylodge', services: ['stabling', 'mount-care', 'pack-animal-care', 'caravan-boarding'],
        }),
        createNpc({
            id: 'npc-slatewater-sable-renn', name: 'Sable Renn', title: 'Slatewater Road Scout',
            locationId: 'slatewater-waylodge',
            services: ['route-guidance', 'field-scouting', 'commissions', 'companion-recruitment'],
            questIds: ['commitment-slatewater-resin-waymarks', 'commitment-slatewater-lichen-fogmarks'],
        }),
        createNpc({
            id: 'npc-brasshaven-civic-warden', name: 'Brasshaven Civic Warden', title: 'Gate Warden', faction: 'Brasshaven',
            locationId: 'brasshaven-market-ring', services: ['realmSeal', 'regionalRewards'],
        }),
        createNpc({
            id: 'npc-brasshaven-marshal-varric-stone', name: 'Marshal Varric Stone', title: 'Civic Marshal', faction: 'Brasshaven',
            locationId: 'brasshaven-market-ring', services: ['orientation', 'commissions', 'civic', 'combat-training'],
            questIds: ['commitment-brasshaven-copper-return'],
        }),
        createNpc({
            id: 'npc-brasshaven-mae-oris', name: 'Mae Oris', title: 'Market Ring Provisioner', faction: 'Brasshaven',
            locationId: 'brasshaven-market-ring', services: ['items', 'household', 'commissions'],
            questIds: ['commitment-brasshaven-courtyard-sweetroot-share'],
        }),
        createNpc({
            id: 'npc-mistmere-marsh-warden', name: 'Mistmere Marsh Warden', title: 'Road Warden', faction: 'Mistmere',
            locationId: 'mistmere-canal-ward', services: ['realmSeal', 'regionalRewards'],
        }),
        createNpc({
            id: 'npc-mistmere-reader-soli-venn', name: 'Reader Soli Venn', title: 'Canal Ward Reader', faction: 'Mistmere',
            locationId: 'mistmere-canal-ward', services: ['orientation', 'commissions', 'civic', 'field-instruction'],
            questIds: ['commitment-mistmere-marrowleaf-return', 'commitment-mistmere-marsh-survey-kit'],
        }),
        createNpc({
            id: 'npc-mistmere-kiri-fen', name: 'Kiri Fen', title: 'Canal Herbkeeper', faction: 'Mistmere',
            locationId: 'mistmere-canal-ward', services: ['herbs', 'household', 'commissions', 'remedy-instruction'],
            questIds: ['commitment-mistmere-canalside-sweetroot-share', 'commitment-mistmere-marsh-poultice'],
        }),
        createNpc({
            id: 'npc-mistmere-pelu-senn', name: 'Pelu Senn', title: 'Starfen Factor', faction: 'Mistmere',
            locationId: 'mistmere-canal-ward', services: ['regional-goods', 'marshcraft', 'training', 'commissions'],
            questIds: ['commitment-mistmere-waterproof-wraps'],
        }),
        createNpc({
            id: 'npc-mistmere-tavi-meren', name: 'Tavi Meren', title: 'Canal Culinary Instructor', faction: 'Mistmere',
            locationId: 'mistmere-canal-ward', services: ['cooking', 'training', 'commissions'],
            questIds: ['commitment-mistmere-bogberry-tonic'],
        }),
        createNpc({
            id: 'npc-elderwood-waywarden', name: 'Mara Venn', title: 'Waywarden', faction: 'Thornwall',
            locationId: 'timbercross-landing', services: ['route-guidance', 'contracts', 'companion-recruitment'],
        }),
    ];
}

export function createSeedEnemies() {
    return [
        createEnemy({
            id: 'enemy-training-dummy', name: 'Training Dummy', family: 'construct', level: 1, expValue: 0,
            baseAttributes: { vit: 2, agi: -3 },
        }),
        createEnemy({
            id: 'enemy-brush-hare', speciesId: 'species-brush-hare', name: 'Brush Hare', family: 'hare', ecosystem: 'beast',
            zoneId: 'west-elderwood', level: 1, expValue: 35, lootTableId: 'starterBeast', baseAttributes: { agi: 2, vit: -1 },
            aggro: { sight: false, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-mossback-goblin', speciesId: 'species-mossback-goblin', name: 'Mossback Goblin', family: 'goblin', ecosystem: 'raider',
            zoneId: 'west-elderwood', level: 3, expValue: 75, lootTableId: 'starterGoblin', baseAttributes: { str: 1, dex: 1 },
            aggro: { sight: true, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-redfang-raider', speciesId: 'species-redfang-raider', name: 'Redfang Raider', family: 'redfang', ecosystem: 'raider',
            zoneId: 'redfang-camp', level: 5, expValue: 120, lootTableId: 'starterOrc', baseAttributes: { str: 2, vit: 1 },
            combatAbilityIds: ['enemy-ability-rushing-cleave'], aggro: { sight: true, sound: true, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-redstone-burrower', speciesId: 'species-redstone-burrower', name: 'Redstone Burrower', family: 'burrower', ecosystem: 'vermiform',
            zoneId: 'south-redstone-reach', level: 1, expValue: 35, lootTableId: 'starterWorm', baseAttributes: { vit: 1, agi: -2 },
            aggro: { sight: false, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-ashcap-scavenger', speciesId: 'species-ashcap-scavenger', name: 'Ashcap Scavenger', family: 'goblin', ecosystem: 'raider',
            zoneId: 'south-redstone-reach', level: 3, expValue: 75, lootTableId: 'starterGoblin', baseAttributes: { str: 1, dex: 1 },
            aggro: { sight: true, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-sootwing-bat', speciesId: 'species-sootwing-bat', name: 'Sootwing Bat', family: 'bat', ecosystem: 'beast',
            zoneId: 'deepvein-mine', level: 3, expValue: 80, lootTableId: 'starterBat', baseAttributes: { agi: 2, vit: -1 },
            aggro: { sight: false, sound: true, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-starfen-rootling', speciesId: 'species-starfen-rootling', name: 'Starfen Rootling', family: 'rootling', ecosystem: 'plantoid',
            zoneId: 'west-starfen', level: 1, expValue: 35, lootTableId: 'starterMandragora', baseAttributes: { agi: 1, mnd: 1 },
            aggro: { sight: false, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-reedmask-acolyte', speciesId: 'species-reedmask-acolyte', name: 'Reedmask Acolyte', family: 'reedmask', ecosystem: 'raider',
            zoneId: 'west-starfen', level: 3, expValue: 75, lootTableId: 'starterGoblin', baseAttributes: { dex: 1, agi: 1 },
            aggro: { sight: true, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-vaultwing-bat', speciesId: 'species-vaultwing-bat', name: 'Vaultwing Bat', family: 'bat', ecosystem: 'beast',
            zoneId: 'sunken-archive', level: 3, expValue: 80, lootTableId: 'starterBat', baseAttributes: { agi: 2, vit: -1 },
            aggro: { sight: false, sound: true, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-elderwood-barkboar', speciesId: 'species-elderwood-barkboar', name: 'Elderwood Barkboar', family: 'barkboar', ecosystem: 'beast',
            zoneId: 'west-elderwood', level: 4, expValue: 90, lootTableId: 'elderwoodBarkboar', baseAttributes: { str: 2, vit: 2, agi: -1 },
            aggro: { sight: true, sound: true, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-redstone-ridge-ibex', speciesId: 'species-redstone-ridge-ibex', name: 'Redstone Ridge Ibex', family: 'ridge-ibex', ecosystem: 'beast',
            zoneId: 'south-redstone-reach', level: 4, expValue: 90, lootTableId: 'redstoneRidgeIbex', baseAttributes: { vit: 2, agi: 1 },
            aggro: { sight: false, sound: true, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-starfen-mire-heron', speciesId: 'species-starfen-mire-heron', name: 'Mirecrest Heron', family: 'mire-heron', ecosystem: 'bird',
            zoneId: 'west-starfen', level: 4, expValue: 90, lootTableId: 'starfenMireHeron', baseAttributes: { dex: 2, agi: 2, vit: -1 },
            aggro: { sight: false, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-headwater-red-deer', speciesId: 'species-headwater-red-deer', name: 'Headwater Red Deer', family: 'red-deer', ecosystem: 'beast',
            zoneId: 'headwater-upper-vale', level: 5, expValue: 110, lootTableId: 'headwaterRedDeer', baseAttributes: { vit: 1, agi: 2, str: 1 },
            aggro: { sight: false, sound: false, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-ironspine-snowhorn-ibex', speciesId: 'species-ironspine-snowhorn-ibex', name: 'Ironspine Snowhorn Ibex', family: 'ridge-ibex', ecosystem: 'beast',
            zoneId: 'ironspine-high-meadow', level: 5, expValue: 115, lootTableId: 'ironspineSnowhorn', baseAttributes: { vit: 2, agi: 2, str: 1 },
            aggro: { sight: false, sound: true, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-ironspine-cliff-bear', speciesId: 'species-ironspine-cliff-bear', name: 'Ironspine Cliff Bear', family: 'bear', ecosystem: 'beast',
            zoneId: 'ironspine-lower-pass', level: 6, expValue: 145, lootTableId: 'ironspineCliffBear', baseAttributes: { str: 3, vit: 3, agi: -1 },
            aggro: { sight: true, sound: true, magic: false, lowHp: false },
        }),
        createEnemy({
            id: 'enemy-ironspine-froststep-lynx', speciesId: 'species-ironspine-froststep-lynx', name: 'Froststep Lynx', family: 'lynx', ecosystem: 'beast',
            zoneId: 'ironspine-high-meadow', level: 6, expValue: 135, lootTableId: 'ironspineFroststepLynx', baseAttributes: { dex: 2, agi: 3, vit: 0 },
            aggro: { sight: false, sound: true, magic: false, lowHp: false },
        }),
    ];
}
