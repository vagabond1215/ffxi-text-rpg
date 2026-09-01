import { coordinateKey, isTopologyPlace, normalizeCoordinate } from './coordinates.js';
import { getConnectionsFrom, getPlace, listPlaces } from './places.js';

export const POI_TYPES = Object.freeze({
    NPC: 'npc',
    VENDOR: 'vendor',
    SHOP: 'shop',
    GUILD: 'guild',
    MISSION: 'mission',
    QUEST: 'quest',
    STORAGE: 'storage',
    COMPANION: 'companion',
    TRAVEL: 'travel',
    TRAVEL_MARKER: 'travelMarker',
    ROUTE_EXIT: 'routeExit',
    LANDMARK: 'landmark',

    // Bounded compatibility aliases for older callers; canonical records emit the values above.
    TRUST: 'companion',
    HOME_POINT: 'travelMarker',
    ZONE_LINE: 'routeExit',
});

// Legacy-shaped POI stable IDs are temporarily retained as compatibility keys for
// shop/quest/guild hooks. Player-facing names and descriptions are canonical
// Hearth & Horizon content; later schema work can migrate the remaining IDs atomically.
const POI_SEEDS = [
    poi('poi-sandoria-s-alaune', 'thornwall-southgate', 'Sera Talwin', POI_TYPES.NPC, 'G-10', ['tutorial'], 'Newcomer guide and Southgate orientation contact'),
    poi('poi-sandoria-s-ambrotien', 'thornwall-southgate', 'Oren Vale', POI_TYPES.MISSION, 'K-10', ['mission', 'thornwall'], 'Thornwall civic commission clerk'),
    poi('poi-sandoria-s-aravoge', 'thornwall-southgate', 'Warden Halric Dane', POI_TYPES.TRAVEL, 'F-10', ['realm', 'gateGuard'], 'Thornwall road warden'),
    poi('poi-sandoria-s-ashene', 'thornwall-southgate', 'Sella Thorn', POI_TYPES.VENDOR, 'K-7', ['weapons', 'shop'], 'Weapons vendor'),
    poi('poi-sandoria-s-aveline', 'thornwall-southgate', 'Mira Fen', POI_TYPES.VENDOR, 'F-7', ['food', 'shop'], 'Prepared food vendor'),
    poi('poi-sandoria-s-benaige', 'thornwall-southgate', 'Orren Pike', POI_TYPES.VENDOR, 'F-7', ['food', 'shop'], 'Travel provisions vendor'),
    poi('poi-sandoria-s-capucine', 'thornwall-southgate', 'Bria Holt', POI_TYPES.VENDOR, 'E-9', ['armor', 'shop'], 'Armor vendor'),
    poi('poi-sandoria-s-carautia', 'thornwall-southgate', 'Tamsin Reed', POI_TYPES.VENDOR, 'K-8', ['armor', 'shop'], 'Protective gear vendor'),
    poi('poi-sandoria-s-faulpie', 'thornwall-southgate', 'Edrin Bale', POI_TYPES.GUILD, 'E-8', ['tanning', 'guildMaster'], 'Tanning guild master'),
    poi('poi-sandoria-s-gondebaud', 'thornwall-southgate', 'Rowan Greymark', POI_TYPES.COMPANION, 'L-6', ['companion'], 'A grey-cloaked ranger who watches Southgate travelers and listens for news from Elderwood'),
    poi('poi-sandoria-s-corua', 'thornwall-southgate', 'Nessa Woodmere', POI_TYPES.VENDOR, 'G-9', ['regionalVendor', 'elderwood'], 'Regional vendor for Elderwood goods'),
    poi('poi-sandoria-s-ferdoulemiont', 'thornwall-southgate', 'Pell Arden', POI_TYPES.VENDOR, 'I-11', ['standardVendor', 'shop'], 'General goods vendor'),

    poi('poi-sandoria-n-cheupirudaux', 'thornwall-crownward', 'Corven Ash', POI_TYPES.GUILD, 'F-3', ['woodworking', 'guildMaster'], 'Woodworking guild master'),
    poi('poi-sandoria-n-amarefice', 'thornwall-crownward', 'Ilya Moss', POI_TYPES.GUILD, 'E-3', ['woodworking', 'craftSupport'], 'Woodworking craft support'),
    poi('poi-sandoria-n-chaupire', 'thornwall-crownward', 'Fen Alder', POI_TYPES.GUILD, 'E-3', ['woodworking', 'guildVendor'], 'Woodworking guild vendor'),
    poi('poi-sandoria-n-mevreauche', 'thornwall-crownward', 'Garrik Forge', POI_TYPES.GUILD, 'E-6', ['blacksmithing', 'guildMaster'], 'Blacksmithing guild master'),
    poi('poi-sandoria-n-doggomehr', 'thornwall-crownward', 'Soren Bell', POI_TYPES.GUILD, 'E-5', ['blacksmithing', 'guildVendor'], 'Blacksmithing guild vendor'),
    poi('poi-sandoria-n-arachagnon', 'thornwall-crownward', 'Hessa Ward', POI_TYPES.VENDOR, 'F-3', ['armor', 'shop'], 'Armor vendor'),
    poi('poi-sandoria-n-arlenne', 'thornwall-crownward', 'Bren Voss', POI_TYPES.VENDOR, 'E-4', ['weapons', 'shop'], 'Weapons vendor'),
    poi('poi-sandoria-n-elesca', 'thornwall-crownward', 'Maelin Quill', POI_TYPES.VENDOR, 'I-8', ['mapVendor'], 'Cartography and route-map vendor'),
    poi('poi-sandoria-n-grilau', 'thornwall-crownward', 'Deren Oathclerk', POI_TYPES.MISSION, 'C-8', ['mission', 'thornwall'], 'Thornwall civic commission contact'),
    poi('poi-sandoria-n-jeanvirgaud', 'thornwall-crownward', 'Roadmaster Kett', POI_TYPES.TRAVEL, 'L-10', ['roadTravel'], 'Regional road-travel contact'),

    poi('poi-crownfields-grange-exchange', 'crownfields-grange', 'Maelin Rook', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'crownfields', 'produce'], 'Produce factor buying field goods and selling farm staples, provisions, and practical tools'),
    poi('poi-crownfields-grange-growers-hall', 'crownfields-grange', 'Hessa Vale', POI_TYPES.GUILD, 'F-6', ['fieldcraft', 'guildMaster', 'agriculture', 'marketNotices', 'craftSupport'], 'Growers’ and drovers’ hall for harvest guidance, crop appraisal, field notices, and livestock-road coordination'),
    poi('poi-crownfields-grange-wagon-yard', 'crownfields-grange', 'Perrin Bale', POI_TYPES.TRAVEL, 'H-8', ['travel', 'wagon', 'stabling', 'produceFreight'], 'Produce-wagon yard with feed, watering troughs, harness checks, and scheduled Southgate departures'),
    poi('poi-crownfields-grange-millhouse', 'crownfields-grange', 'Crownfields Millhouse and Common Loft', POI_TYPES.LANDMARK, 'E-6', ['mill', 'granary', 'lodging', 'food', 'safeRest', 'cooking', 'craftSupport'], 'Watermill, granary scales, common kitchen, and simple loft bunks serving farm crews and wagoners'),

    poi('poi-great-mere-fishery-exchange', 'merewatch-landing', 'Essel Wren', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'greatMere', 'fishery', 'food'], 'Fishery factor buying lake catches, shore produce, and craft stock while selling fresh and preserved lake goods'),
    poi('poi-great-mere-lakesmens-hall', 'merewatch-landing', 'Jory Tamm', POI_TYPES.GUILD, 'F-6', ['fishing', 'guildMaster', 'lakecraft', 'foodSafety', 'craftSupport'], 'Lakesmen’s hall for fishing guidance, processing practice, safe-food notices, tackle work, and lake condition reports'),
    poi('poi-great-mere-ferry-landing', 'merewatch-landing', 'Nara Veil', POI_TYPES.TRAVEL, 'H-8', ['travel', 'ferry', 'skiff', 'greatMere'], 'Marked ferry slips for Reedport and Reedcrown Isle; open water is crossed by boat rather than walked'),
    poi('poi-great-mere-smokehouse-loft', 'merewatch-landing', 'Merewatch Smokehouse and Common Loft', POI_TYPES.LANDMARK, 'E-6', ['smokehouse', 'lodging', 'food', 'safeRest', 'cooking', 'craftSupport'], 'Shared smokehouse, cook hearth, cleaning tables, drying racks, and simple loft bunks used by fishing crews'),
    poi('poi-tideglass-exchange', 'tideglass-landing', 'Lessa Venn', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'starfenDelta', 'fishery', 'shellfish', 'saltTrade'], 'Delta exchange buying catches, shellfish, saltmarsh goods, and tidepan salt while selling prepared coast food and practical field gear'),
    poi('poi-tideglass-pilot-house', 'tideglass-landing', 'Orin Cade', POI_TYPES.TRAVEL, 'H-8', ['travel', 'ferry', 'pilotage', 'shoalGuidance', 'tideNotices', 'starfenDelta'], 'Pilot house posting channel marks, shoal warnings, tide turns, and packet-boat departures between Merewatch and Tideglass'),
    poi('poi-tideglass-smokehouse', 'tideglass-landing', 'Maela Thorne', POI_TYPES.LANDMARK, 'E-6', ['smokehouse', 'lodging', 'food', 'safeRest', 'cooking', 'craftSupport', 'starfenDelta'], 'Shared smokehouse and cook shed with cleaning tables, drying racks, kettles, and simple loft bunks for delta crews'),
    poi('poi-tideglass-tideworks', 'tideglass-landing', 'Tideglass Tideworks Yard', POI_TYPES.LANDMARK, 'D-6', ['craftSupport', 'saltWorks', 'netRepair', 'matting', 'shellLime', 'starfenDelta'], 'Open workyard for salt cleaning, shell-lime burning, reed matting, creel and net repair, and packing coast cargo'),
    poi('poi-cinderwell-exchange', 'cinderwell-station', 'Tarin Hove', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'emberwash', 'caravan', 'provisions'], 'Frontier factor buying usable Emberwash finds and selling water, prepared trail food, salt, and practical desert-route repair stock'),
    poi('poi-cinderwell-warden-desk', 'cinderwell-station', 'Merek Sorn', POI_TYPES.GUILD, 'F-5', ['fieldcraft', 'routeGuidance', 'caravan', 'wagonLimit', 'waterNotices', 'emberwash'], 'Caravan warden desk posting well conditions, wash crossings, dust warnings, wagon turnaround notices, and saltpan foretrail reports'),
    poi('poi-cinderwell-cistern-workyard', 'cinderwell-station', 'Cinderwell Cistern Workyard', POI_TYPES.LANDMARK, 'E-6', ['craftSupport', 'waterworks', 'cordage', 'plaster', 'repair', 'emberwash'], 'Covered benches, cordage hooks, plaster trays, cistern-patch stock, and shade cloth for field repairs and waterworks maintenance'),
    poi('poi-cinderwell-shade-hearth', 'cinderwell-station', 'Pella Aven', POI_TYPES.LANDMARK, 'D-5', ['lodging', 'food', 'safeRest', 'cooking', 'craftSupport', 'stabling', 'emberwash'], 'Deep shade roof, common cook hearth, grinding stone, drying lines, simple bunks, and watering pens at the last ordinary wagon stop'),
    poi('poi-lantern-sump-exchange', 'lantern-sump-station', 'Ressa Kell', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'lowerDeepvein', 'delverGoods', 'provisions'], 'Underground factor buying useful Lower Deepvein finds and selling water, cooked cave provisions, refined salt, lamp kits, and gallery-repair stock'),
    poi('poi-lantern-sump-survey-desk', 'lantern-sump-station', 'Borin Vale', POI_TYPES.GUILD, 'F-5', ['fieldcraft', 'survey', 'routeGuidance', 'mineSafety', 'lowerDeepvein'], 'Survey warden desk posting gallery conditions, seep reports, loose-rock notices, and marked Echoing Shelf traverse guidance'),
    poi('poi-lantern-sump-lampworks', 'lantern-sump-station', 'Lantern Sump Lampworks', POI_TYPES.LANDMARK, 'E-6', ['craftSupport', 'lampwork', 'ceramic', 'wick', 'repair', 'lowerDeepvein'], 'Covered underground workbay with clay firing hearth, wick hooks, quartz-polishing bench, reflector jigs, and damp-gallery repair stock'),
    poi('poi-lantern-sump-hearth', 'lantern-sump-station', 'Hessa Rusk', POI_TYPES.LANDMARK, 'D-5', ['lodging', 'food', 'safeRest', 'cooking', 'craftSupport', 'lowerDeepvein'], 'Common hearth beside the station cistern with cookpot, fish-cleaning board, drying rack, first-aid chest, and simple delver bunks'),
    poi('poi-oldbough-exchange', 'oldbough-refuge', 'Mara Oren', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'gloamwood', 'forestry', 'fieldGoods'], 'Small refuge exchange buying old-growth finds and selling preserved trail food, field dressings, and practical route-repair stock'),
    poi('poi-oldbough-forester-desk', 'oldbough-refuge', 'Hale Rowan', POI_TYPES.GUILD, 'F-5', ['fieldcraft', 'forestry', 'routeGuidance', 'wagonLimit', 'gloamwood'], 'Boundary-forester desk posting cart-track conditions, deadfall warnings, flooded gullies, and notices for the marked deepwood trail'),
    poi('poi-oldbough-workyard', 'oldbough-refuge', 'Oldbough Workyard', POI_TYPES.LANDMARK, 'E-6', ['woodworking', 'craftSupport', 'resinWork', 'drying', 'trailRepair', 'gloamwood'], 'Covered saw benches, shaving horses, resin kettles, drying frames, and repair stock for timber, fieldcraft, and route work'),
    poi('poi-oldbough-common-hearth', 'oldbough-refuge', 'Tessa Brin', POI_TYPES.LANDMARK, 'D-5', ['lodging', 'food', 'safeRest', 'cooking', 'craftSupport', 'gloamwood'], 'Common hearth with a cookpot, mushroom pans, drying lines, simple bunks, and the last sheltered wagon yard before the deep forest'),
    poi('poi-headwater-river-exchange', 'headwater-warden-lodge', 'Elin Marr', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'headwater', 'fishery', 'timber'], 'River factor buying catches, hides, herbs, and timber while selling preserved food, field goods, and practical tools'),
    poi('poi-headwater-warden-desk', 'headwater-warden-lodge', 'Torin Ash', POI_TYPES.GUILD, 'F-5', ['fieldcraft', 'hunting', 'wildlifeTracking', 'routeGuidance', 'riverCrossings', 'headwater'], 'Warden desk posting bridge conditions, flood notices, deer sign, fishing runs, and upper-trail reports'),
    poi('poi-headwater-riverworks-yard', 'headwater-warden-lodge', 'Headwater Riverworks Yard', POI_TYPES.LANDMARK, 'E-6', ['woodworking', 'tanning', 'craftSupport', 'bridgeRepair', 'smokehouse', 'headwater'], 'Open workyard with saw benches, shaving horses, hide frames, tanning tubs, smoke racks, and bridge-repair stock'),
    poi('poi-headwater-common-hearth', 'headwater-warden-lodge', 'Bessa Reed', POI_TYPES.LANDMARK, 'D-5', ['lodging', 'food', 'safeRest', 'cooking', 'craftSupport', 'headwater'], 'Common hearth, cookpot, drying lines, simple bunks, and a sheltered yard for wagon teams and saddle animals'),
    poi('poi-cairnward-exchange','cairnward-relay','Sella Ward',POI_TYPES.VENDOR,'G-7',['shop','regionalVendor','waymeetMarches','transshipment','provisions'],'Neutral relay counter buying useful plateau finds and selling prepared road food, water, field supplies, packing goods, and road-repair stock'),
    poi('poi-cairnward-route-desk','cairnward-relay','Kellan Rusk',POI_TYPES.GUILD,'F-5',['fieldcraft','routeGuidance','saddleConditions','wagonTransfer','waymeetMarches'],'Route desk posting Windscar switchback conditions, fog and ice notices, burn crossings, wagon-road reports, and the current northern survey limit'),
    poi('poi-cairnward-cart-shelter','cairnward-relay','Cairnward Cart Shelter',POI_TYPES.LANDMARK,'E-6',['woodworking','craftSupport','cartRepair','roadRepair','packing','waymeetMarches'],'Covered wheel and axle benches, packing frames, sedge matting hooks, fascine racks, stone-dressing blocks, and road-mender stock for plateau traffic'),
    poi('poi-cairnward-hearth','cairnward-relay','Tam Berrow',POI_TYPES.LANDMARK,'D-5',['lodging','food','safeRest','cooking','craftSupport','animalShelter','waymeetMarches'],'Common hearth beside the relay cistern with cookpot, drying racks, peat fuel, simple bunks, feed bins, and a sheltered hitching yard'),
    poi('poi-ironspine-survey-exchange', 'ironspine-watchpost', 'Vara Kell', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'ironspine', 'surveyGoods'], 'High-pass exchange buying field finds and selling provisions, survey goods, and mountain tools'),
    poi('poi-ironspine-warden-desk', 'ironspine-watchpost', 'Dain Rove', POI_TYPES.GUILD, 'F-5', ['fieldcraft', 'hunting', 'wildlifeTracking', 'routeGuidance', 'ironspine'], 'Warden desk posting pass conditions, wildlife sign, and high-country notices'),
    poi('poi-ironspine-common-hearth', 'ironspine-watchpost', 'Mara Fell', POI_TYPES.LANDMARK, 'E-6', ['lodging', 'food', 'safeRest', 'cooking', 'craftSupport', 'ironspine'], 'Stone common room with a banked hearth, stew pot, drying lines, a common repair bench, and simple sleeping pallets'),
    poi('poi-ironspine-animal-yard', 'ironspine-watchpost', 'Ironspine Sheltered Yard', POI_TYPES.TRAVEL, 'H-8', ['travel', 'mountCare', 'packAnimals', 'wagonLimit'], 'Roofed mountain yard where wagon teams stop and saddle animals are checked before the high trail'),

    poi('poi-slatewater-waylodge-exchange', 'slatewater-waylodge', 'Eira Voss', POI_TYPES.VENDOR, 'G-7', ['shop', 'regionalVendor', 'slatewater', 'fieldGoods'], 'Waylodge factor buying field finds and selling provisions, tools, and road gear'),
    poi('poi-slatewater-waylodge-trailguild', 'slatewater-waylodge', 'Toren Marr', POI_TYPES.GUILD, 'F-5', ['fieldcraft', 'guildMaster', 'gathering', 'hunting', 'trade'], 'Foothill guild steward for gathering, hunting, route conditions, and field exchange'),
    poi('poi-slatewater-road-scout', 'slatewater-waylodge', 'Sable Renn', POI_TYPES.COMPANION, 'F-6', ['roadScout', 'routeGuidance', 'fieldcraft', 'slatewater'], 'Neutral foothill scout who tests potential road partners through practical field work before agreeing to share the road'),
    poi('poi-slatewater-waylodge-stableyard', 'slatewater-waylodge', 'Bram Pell', POI_TYPES.TRAVEL, 'H-8', ['travel', 'stabling', 'mountCare', 'packAnimals'], 'Stableyard with water, feed, sheltered pens, tack checks, and caravan boarding for mounts and pack animals'),
    poi('poi-slatewater-waylodge-hearth', 'slatewater-waylodge', 'Slatewater Hearth and Bunkroom', POI_TYPES.LANDMARK, 'E-6', ['lodging', 'food', 'safeRest', 'cooking', 'craftSupport'], 'Common hearth, hot meals, drying racks, a shared repair bench, and simple bunks for road crews and field workers'),

    poi('poi-bastok-markets-rabid-wolf', 'brasshaven-market-ring', 'Marshal Varric Stone', POI_TYPES.TRAVEL, 'E-11', ['gateGuard', 'realm', 'combatTraining'], 'Market Ring gate marshal and Forge-Road combat drill instructor', {
        trainingNpcId: 'npc-brasshaven-marshal-varric-stone',
        trainingCapabilityIds: ['technique-ridge-breaker', 'technique-rivet-guard'],
    }),
    poi('poi-bastok-markets-brunhilde', 'brasshaven-market-ring', 'Dessa Rivet', POI_TYPES.VENDOR, 'F-10', ['armor', 'shop'], 'Armor vendor'),
    poi('poi-bastok-markets-ciqala', 'brasshaven-market-ring', 'Tessa Rook', POI_TYPES.VENDOR, 'F-10', ['weapons', 'shop'], 'Weapons merchant'),
    poi('poi-bastok-markets-peritrage', 'brasshaven-market-ring', 'Joren Flint', POI_TYPES.VENDOR, 'F-10', ['weapons', 'shop'], 'Weapon vendor'),
    poi('poi-bastok-markets-zhikkom', 'brasshaven-market-ring', 'Kerris Anvil', POI_TYPES.VENDOR, 'F-10', ['weapons', 'shop'], 'Weapon vendor'),
    poi('poi-bastok-markets-carmelide', 'brasshaven-market-ring', 'Mae Oris', POI_TYPES.VENDOR, 'I-8', ['items', 'shop'], 'General goods vendor'),
    poi('poi-bastok-markets-olwyn', 'brasshaven-market-ring', 'Perrin Coil', POI_TYPES.VENDOR, 'E-11', ['items', 'shop'], 'Workshop supplies vendor'),
    poi('poi-bastok-markets-reinberta', 'brasshaven-market-ring', 'Selka Aurum', POI_TYPES.GUILD, 'I-8', ['goldsmithing', 'guildMaster'], 'Goldsmithing guild master'),
    poi('poi-bastok-markets-teerth', 'brasshaven-market-ring', 'Brann Coil', POI_TYPES.GUILD, 'H-8', ['goldsmithing', 'guildVendor'], 'Goldsmithing guild vendor'),
    poi('poi-bastok-markets-karine', 'brasshaven-market-ring', 'Oda Chart', POI_TYPES.VENDOR, 'H-9', ['mapVendor'], 'Survey and route-map vendor'),
    poi('poi-bastok-markets-cleades', 'brasshaven-market-ring', 'Clerk Merrow', POI_TYPES.MISSION, 'D-11', ['mission', 'brasshaven'], 'Brasshaven civic commission contact'),

    poi('poi-bastok-mines-zeruhn-gate', 'brasshaven-delvers-ward', 'Deepvein Mine Gate', POI_TYPES.ROUTE_EXIT, 'I-9', ['zoneConnection', 'deepveinMine'], 'Passage toward Deepvein Mine'),
    poi('poi-bastok-mines-gate-guard', 'brasshaven-delvers-ward', 'Delvers’ Ward Watch', POI_TYPES.TRAVEL, 'H-6', ['gateGuard', 'realm'], 'Brasshaven watch post'),
    poi('poi-metalworks-cid', 'brasshaven-foundry-hall', 'Master Engineer Caldris', POI_TYPES.QUEST, 'H-8', ['importantNpc', 'engineer', 'quest'], 'Senior Brasshaven engineer and project contact'),
    poi('poi-metalworks-cornelia', 'brasshaven-foundry-hall', 'Envoy Tessa Mar', POI_TYPES.MISSION, 'K-8', ['mission', 'brasshaven'], 'Civic commission contact'),
    poi('poi-metalworks-iron-eater', 'brasshaven-foundry-hall', 'Captain Brannic Voss', POI_TYPES.MISSION, 'J-8', ['mission', 'brasshaven'], 'Foundry guard and military commission contact'),
    poi('poi-metalworks-raibaht', 'brasshaven-foundry-hall', 'Gearwright Noll', POI_TYPES.QUEST, 'G-8', ['quest', 'engineer'], 'Workshop project and repair contact'),
    poi('poi-port-bastok-travel-counter', 'brasshaven-iron-quay', 'Iron Quay Transit Office', POI_TYPES.TRAVEL, 'K-7', ['travel', 'futureTransit'], 'Freight clerks, caravan boards, and passenger bookings for routes beyond the quay'),
    poi('poi-port-bastok-shops', 'brasshaven-iron-quay', 'Iron Quay Exchange', POI_TYPES.SHOP, 'F-6', ['shops'], 'Quayside shop cluster'),

    poi('poi-waters-baehu-faehu', 'mistmere-canal-ward', 'Pelu Senn', POI_TYPES.VENDOR, 'G-5', ['regionalVendor', 'starfen', 'craftSupport'], 'Regional vendor for Starfen goods with a shared reedcraft and repair bench'),
    poi('poi-waters-chomo-jinjahl', 'mistmere-canal-ward', 'Tavi Meren', POI_TYPES.GUILD, 'E-8', ['cooking', 'guildMerchant'], 'Culinary guild merchant'),
    poi('poi-waters-dagoza-beruza', 'mistmere-canal-ward', 'Reader Soli Venn', POI_TYPES.MISSION, 'F-5', ['mission', 'mistmere'], 'Mistmere civic commission contact'),
    poi('poi-waters-ensasa', 'mistmere-canal-ward', 'Nemi Vale', POI_TYPES.VENDOR, 'H-9', ['items', 'shop'], 'Canal-market goods vendor'),
    poi('poi-waters-hilkomu-makimu', 'mistmere-canal-ward', 'Kiri Fen', POI_TYPES.VENDOR, 'G-7', ['items', 'shop'], 'Herbs and practical supplies vendor'),
    poi('poi-waters-dienger', 'mistmere-canal-ward', 'Perrin Reed', POI_TYPES.NPC, 'F-5', ['minstrel'], 'Traveling minstrel'),
    poi('poi-waters-ephemeral-moogle', 'mistmere-canal-ward', 'Lantern Keeper Sivi', POI_TYPES.STORAGE, 'E-9', ['specialStorage'], 'Lodging and secure-storage service contact'),

    poi('poi-woods-apururu', 'mistmere-garden-ward', 'Curator Lessa Rain', POI_TYPES.MISSION, 'H-9', ['importantNpc', 'mission', 'mistmere'], 'Important Mistmere garden-ward civic contact'),
    poi('poi-woods-east-gate', 'mistmere-garden-ward', 'East Starfen Gate', POI_TYPES.ROUTE_EXIT, 'K-10', ['zoneConnection', 'eastStarfen'], 'Gate toward East Starfen'),
    poi('poi-walls-heavens-tower-gate', 'mistmere-spire-ward', 'Observatory Gate', POI_TYPES.MISSION, 'H-7', ['mission', 'observatory'], 'Access to Mistmere Observatory'),
    poi('poi-port-windurst-travel-counter', 'mistmere-reedport', 'Reedport Transit House', POI_TYPES.TRAVEL, 'M-6', ['travel', 'futureTransit'], 'Boatmen, caravan agents, and passenger boards serving routes beyond Reedport'),
    poi('poi-heavens-tower-mission-desk', 'mistmere-observatory', 'Observatory Civic Desk', POI_TYPES.MISSION, 'H-6', ['mission', 'mistmere'], 'Mistmere civic commission desk'),
];

export const POINTS_OF_INTEREST = Object.freeze(POI_SEEDS.map((item) => Object.freeze({
    ...item,
    coordinate: mapSourcePositionToGrid(item.placeId, item.sourcePosition),
    actions: inferActions(item),
})));

export function listPointsOfInterest() {
    return POINTS_OF_INTEREST;
}

export function getPointOfInterest(poiId) {
    return POINTS_OF_INTEREST.find((poi) => poi.id === poiId) ?? null;
}

export function getPoisForPlace(placeId) {
    return POINTS_OF_INTEREST.filter((poi) => poi.placeId === getPlace(placeId)?.id);
}

export function getPoisAtGrid(placeId, coordinate) {
    const key = coordinateKey(coordinate);
    return getPoisForPlace(placeId).filter((poi) => coordinateKey(poi.coordinate) === key);
}

export function findPoiInPlace(placeId, query) {
    const normalized = normalize(query);
    return getPoisForPlace(placeId).find((poi) => poi.id === normalized || normalize(poi.name).includes(normalized)) ?? null;
}

export function getContextualPois(state) {
    if (!state.currentPlaceId || !state.position) return [];
    return getPoisAtGrid(state.currentPlaceId, state.position);
}

export function describePoisForPlace(placeId) {
    const pois = getPoisForPlace(placeId);
    if (!pois.length) return `No points of interest seeded for ${getPlace(placeId)?.name ?? placeId}.`;
    return pois.map(describePoiLine).join('\n');
}

export function describeContextualPois(state) {
    const pois = getContextualPois(state);
    if (!pois.length) return 'No known points of interest here.';
    return ['Points of interest here:', ...pois.map((poi) => `- ${describePoiLine(poi)} | actions: ${poi.actions.join(', ')}`)].join('\n');
}

export function describeAllPoisSummary() {
    const byPlace = new Map();
    for (const poi of POINTS_OF_INTEREST) {
        byPlace.set(poi.placeId, (byPlace.get(poi.placeId) ?? 0) + 1);
    }
    return Array.from(byPlace.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([placeId, count]) => `${placeId}: ${count} POIs`)
        .join('\n');
}

export function createZoneConnectionPois() {
    return listPlaces().flatMap((place) => getConnectionsFrom(place.id).map((connection) => ({
        id: `connection-${connection.id}`,
        placeId: place.id,
        name: `Exit to ${getPlace(connection.to)?.name ?? connection.to}`,
        type: POI_TYPES.ROUTE_EXIT,
        sourcePosition: 'connection-grid',
        coordinate: connection.departFrom ?? place.coordinateSystem.start,
        tags: ['zoneConnection', connection.to],
        notes: `Travel to ${getPlace(connection.to)?.name ?? connection.to}.`,
        actions: ['travel'],
    })));
}

function poi(id, placeId, name, type, sourcePosition, tags, notes, extras = {}) {
    return { id, placeId, name, type, sourcePosition, tags, notes, ...extras };
}

function describePoiLine(poi) {
    return `${poi.name} [${poi.type}] - ${poi.notes}`;
}

function inferActions(poi) {
    const actions = new Set(['talk']);
    if ([POI_TYPES.VENDOR, POI_TYPES.SHOP].includes(poi.type)) actions.add('shop');
    if (poi.type === POI_TYPES.GUILD) actions.add('guild');
    if ([POI_TYPES.MISSION, POI_TYPES.QUEST].includes(poi.type)) actions.add('quest');
    if ([POI_TYPES.TRAVEL, POI_TYPES.TRAVEL_MARKER, POI_TYPES.ROUTE_EXIT].includes(poi.type)) actions.add('travel');
    if (poi.type === POI_TYPES.STORAGE) actions.add('storage');
    if (poi.type === POI_TYPES.COMPANION) actions.add('companion');
    if ((poi.tags ?? []).includes('combatTraining') && (poi.trainingCapabilityIds ?? []).length) actions.add('training');
    return Array.from(actions);
}

function mapSourcePositionToGrid(placeId, sourcePosition) {
    const place = getPlace(placeId);
    if (!place || !sourcePosition || sourcePosition === 'connection-grid') return { x: 0, y: 0 };
    const match = String(sourcePosition).match(/([A-Z])-?(\d+)/i);
    if (!match) return place.coordinateSystem.start;
    if (isTopologyPlace(place)) return { levelId: 'main', coord: normalizeCoordinate(sourcePosition) };

    const column = match[1].toUpperCase().charCodeAt(0) - 65;
    const row = Number(match[2]) - 1;
    const maxSourceColumn = 12;
    const maxSourceRow = 13;
    return {
        x: clamp(Math.round((column / maxSourceColumn) * (place.coordinateSystem.width - 1)), 0, place.coordinateSystem.width - 1),
        y: clamp(Math.round((row / maxSourceRow) * (place.coordinateSystem.height - 1)), 0, place.coordinateSystem.height - 1),
    };
}

function normalize(value) {
    return String(value ?? '').trim().toLowerCase().replace(/[’']/g, '').replace(/\s+/g, '-');
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
