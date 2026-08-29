export const SHOP_CATALOG_VERSION = 3;

export const SHOP_CATALOGS = Object.freeze({
    'poi-sandoria-s-ashene': shop('poi-sandoria-s-ashene', 'Southgate Arms', 'Practical arms for road wardens, travelers, and apprentices.', [
        item('bronze-sword', 'Bronze Sword', 76, ['weapon', 'sword', 'starter']),
        item('bronze-axe', 'Bronze Axe', 88, ['weapon', 'axe', 'starter']),
        item('bronze-dagger', 'Bronze Dagger', 64, ['weapon', 'dagger', 'starter']),
        item('field-knife', 'Field Knife', 72, ['equipment', 'tool', 'weapon', 'dagger', 'cutting', 'field']),
        item('iron-buckler', 'Iron Buckler', 110, ['equipment', 'armor', 'shield', 'offhand']),
    ]),
    'poi-sandoria-s-aveline': shop('poi-sandoria-s-aveline', 'Southgate Provisions', 'Bread, water, bandages, and ordinary road supplies.', [
        item('loaf-of-bread', 'Loaf of Bread', 12, ['food', 'starter']),
        item('flask-of-water', 'Flask of Water', 8, ['consumable', 'starter']),
        item('simple-bandage', 'Simple Bandage', 20, ['consumable', 'healing']),
    ]),
    'poi-sandoria-s-capucine': shop('poi-sandoria-s-capucine', 'Southgate Outfitters', 'Workwear and light protection suited to city streets and the western roads.', [
        item('bronze-cap', 'Bronze Cap', 70, ['armor', 'head', 'starter']),
        item('bronze-harness', 'Bronze Harness', 120, ['armor', 'body', 'starter']),
        item('leather-vest', 'Leather Vest', 96, ['equipment', 'armor', 'body', 'light']),
        item('traveler-gloves', 'Traveler Gloves', 58, ['equipment', 'armor', 'hands', 'travel']),
        item('leather-trousers', 'Leather Trousers', 78, ['equipment', 'armor', 'legs', 'light']),
        item('traveler-boots', 'Traveler Boots', 82, ['equipment', 'armor', 'feet', 'travel']),
        item('road-cloak', 'Road Cloak', 94, ['equipment', 'armor', 'back', 'travel']),
        item('field-belt', 'Field Belt', 68, ['equipment', 'armor', 'waist', 'field']),
    ]),
    'poi-sandoria-n-arlenne': shop('poi-sandoria-n-arlenne', 'Crownward Implements', 'Arcane implements and practical tools from the inner city workshops.', [
        item('ash-staff', 'Ash Staff', 96, ['weapon', 'staff', 'starter']),
        item('maple-wand', 'Maple Wand', 80, ['weapon', 'club', 'starter']),
        item('woodsman-hatchet', 'Woodsman Hatchet', 92, ['equipment', 'tool', 'weapon', 'axe', 'woodcutting', 'field']),
        item('digging-spade', 'Digging Spade', 84, ['equipment', 'tool', 'digging', 'field']),
    ]),
    'poi-crownfields-grange-exchange': shop('poi-crownfields-grange-exchange', 'Crownfields Produce Exchange', 'A grange market counter buying ordinary sellable farm goods and stocking staple produce, food, water, field tools, and road necessities.', [
        item('loaf-of-bread', 'Loaf of Bread', 10, ['food', 'staple']),
        item('flask-of-water', 'Flask of Water', 8, ['consumable', 'travel']),
        item('item-crownfields-crown-rye', 'Crown Rye', 8, ['material', 'regional', 'grain', 'staple']),
        item('item-crownfields-field-pea', 'Field Pea', 10, ['material', 'regional', 'pulse', 'staple']),
        item('item-crownfields-flax-straw', 'Blue Flax Straw', 12, ['material', 'regional', 'fiber', 'staple']),
        item('item-crownfields-cider-apple', 'Cider Apple', 11, ['material', 'regional', 'fruit', 'staple']),
        item('item-crownfields-meadow-hay', 'Meadow Hay', 7, ['material', 'regional', 'fodder', 'staple']),
        item('item-crownfields-dyers-woad', 'Dyer’s Woad', 36, ['material', 'regional', 'dye', 'luxury']),
        item('field-knife', 'Field Knife', 72, ['equipment', 'tool', 'cutting', 'field']),
        item('digging-spade', 'Digging Spade', 82, ['equipment', 'tool', 'digging', 'field']),
    ]),
    'poi-great-mere-fishery-exchange': shop('poi-great-mere-fishery-exchange', 'Merewatch Fishery Exchange', 'A lakeside exchange buying sellable catches and shore goods while stocking food-safe prepared fish, fresh produce, and practical fishing supplies.', [
        item('item-great-mere-silver-perch', 'Great Mere Silver Perch', 18, ['material', 'regional', 'fish', 'requires-cooking']),
        item('item-great-mere-lake-cress', 'Lake Cress', 11, ['material', 'regional', 'food', 'safe-raw']),
        item('item-great-mere-lake-rush-stem', 'Great Mere Lake Rush', 10, ['material', 'regional', 'fiber']),
        item('item-great-mere-smoked-perch-ration', 'Smoked Perch Ration', 34, ['food', 'prepared', 'safe-ready']),
        item('item-great-mere-pickled-pike', 'Pickled Reed Pike', 46, ['food', 'prepared', 'safe-ready']),
        item('marsh-rod', 'Marsh Fishing Rod', 106, ['equipment', 'tool', 'fishing', 'field']),
        item('field-knife', 'Field Knife', 74, ['equipment', 'tool', 'cutting', 'field']),
    ]),
    'poi-tideglass-exchange': shop('poi-tideglass-exchange', 'Tideglass Delta Exchange', 'A coastal exchange buying ordinary delta goods and stocking prepared seafood, preserved greens, salt, fishing gear, cutting tools, and tide-country provisions.', [
        item('travel-ration', 'Travel Ration', 22, ['food', 'travel']),
        item('flask-of-water', 'Flask of Water', 9, ['consumable', 'travel']),
        item('simple-bandage', 'Simple Bandage', 22, ['consumable', 'healing']),
        item('item-delta-smoked-eel', 'Willow-Smoked Brackish Eel', 48, ['food', 'prepared', 'preserved']),
        item('item-delta-boiled-mud-crab', 'Boiled Saltflat Mud Crab', 42, ['food', 'prepared', 'shellfish']),
        item('item-delta-dried-kelp', 'Dried Coast Kelp', 26, ['food', 'prepared', 'travel']),
        item('item-delta-pickled-samphire', 'Pickled Marsh Samphire', 36, ['food', 'prepared', 'preserved']),
        item('item-delta-refined-sea-salt', 'Tideglass Sea Salt', 31, ['material', 'salt', 'preservation']),
        item('item-delta-woven-reed-matting', 'Woven Saltmarsh Matting', 44, ['material', 'packing', 'reed']),
        item('marsh-rod', 'Marsh Fishing Rod', 108, ['equipment', 'tool', 'fishing', 'field']),
        item('field-knife', 'Field Knife', 76, ['equipment', 'tool', 'cutting', 'field']),
        item('prospector-pick', 'Prospector Pick', 104, ['equipment', 'tool', 'mining', 'field']),
    ]),
    'poi-oldbough-exchange': shop('poi-oldbough-exchange', 'Oldbough Field Exchange', 'A small boundary-forest counter buying usable old-growth finds and stocking preserved trail food, field dressings, and repair goods.', [
        item('item-gloamwood-dried-raincaps', 'Dried Gloam Raincaps', 28, ['food','regional','travel','gloamwood']),
        item('item-gloamwood-dried-nightberries', 'Dried Nightberries', 24, ['food','regional','travel','gloamwood']),
        item('item-gloamwood-field-dressing-roll', 'Gloamwood Field Dressing Roll', 48, ['material','regional','fieldcraft','gloamwood']),
        item('item-gloamwood-route-repair-stakes', 'Oldgrowth Route-Repair Stakes', 56, ['material','regional','repair','gloamwood']),
    ]),
    'poi-headwater-river-exchange': shop('poi-headwater-river-exchange', 'Headwater River Exchange', 'A river-warden exchange buying ordinary vale goods and stocking food, first aid, fishing gear, cutting tools, and locally prepared provisions.', [
        item('travel-ration', 'Travel Ration', 20, ['food', 'travel']),
        item('flask-of-water', 'Flask of Water', 8, ['consumable', 'travel']),
        item('simple-bandage', 'Simple Bandage', 20, ['consumable', 'healing']),
        item('item-headwater-spring-cress', 'Headwater Spring Cress', 11, ['material', 'regional', 'food', 'safe-raw']),
        item('item-headwater-alder-smoked-trout', 'Alder-Smoked Coldstream Trout', 42, ['food', 'prepared', 'preserved']),
        item('item-headwater-smoked-venison', 'Alder-Smoked Headwater Venison', 48, ['food', 'prepared', 'preserved']),
        item('item-headwater-dried-meadowsweet', 'Dried Headwater Meadowsweet', 30, ['material', 'regional', 'remedy']),
        item('item-headwater-willow-creel', 'Headwater Willow Creel', 78, ['material', 'fishing-gear', 'fieldcraft']),
        item('marsh-rod', 'Marsh Fishing Rod', 104, ['equipment', 'tool', 'fishing', 'field']),
        item('field-knife', 'Field Knife', 74, ['equipment', 'tool', 'cutting', 'field']),
        item('woodsman-hatchet', 'Woodsman Hatchet', 94, ['equipment', 'tool', 'woodcutting', 'field']),
    ]),
    'poi-ironspine-survey-exchange': shop('poi-ironspine-survey-exchange', 'Ironspine Survey Exchange', 'A high-pass counter buying ordinary sellable mountain finds and stocking durable provisions, warm road gear, cutting tools, and mining equipment.', [
        item('travel-ration', 'Travel Ration', 22, ['food', 'travel']),
        item('flask-of-water', 'Flask of Water', 9, ['consumable', 'travel']),
        item('simple-bandage', 'Simple Bandage', 22, ['consumable', 'healing']),
        item('item-ironspine-stonepine-kernels', 'Roasted Stonepine Kernels', 24, ['food', 'prepared', 'trail-food']),
        item('item-ironspine-smoked-snowhorn', 'Salt-Smoked Snowhorn', 44, ['food', 'prepared', 'preserved']),
        item('item-ironspine-frost-lichen-salve', 'Frost Lichen Tallow Salve', 58, ['remedy', 'field-medicine']),
        item('field-knife', 'Field Knife', 78, ['equipment', 'tool', 'cutting', 'field']),
        item('prospector-pick', 'Prospector Pick', 108, ['equipment', 'tool', 'mining', 'field']),
        item('road-cloak', 'Road Cloak', 102, ['equipment', 'armor', 'back', 'travel']),
    ]),
    'poi-slatewater-waylodge-exchange': shop('poi-slatewater-waylodge-exchange', 'Slatewater Field Exchange', 'A guild-backed road counter that buys ordinary sellable field finds and stocks food, water, first aid, gathering tools, and durable travel gear.', [
        item('loaf-of-bread', 'Loaf of Bread', 12, ['food', 'travel']),
        item('travel-ration', 'Travel Ration', 20, ['food', 'travel']),
        item('flask-of-water', 'Flask of Water', 8, ['consumable', 'travel']),
        item('simple-bandage', 'Simple Bandage', 20, ['consumable', 'healing']),
        item('item-slatewater-serviceberry', 'Slatewater Serviceberry', 10, ['material', 'regional', 'food', 'staple']),
        item('item-slatewater-pitch-pine-resin', 'Pitch Pine Resin', 13, ['material', 'regional', 'resin', 'staple']),
        item('item-slatewater-white-clay', 'Slatewater White Clay', 12, ['material', 'regional', 'clay', 'staple']),
        item('item-slatewater-mountain-thyme', 'Mountain Thyme', 11, ['material', 'regional', 'herb', 'staple']),
        item('item-slatewater-silver-lichen', 'Silver Lichen', 50, ['material', 'regional', 'dye', 'luxury']),
        item('item-slatewater-blue-slate', 'Slatewater Blue Slate', 48, ['material', 'regional', 'stone', 'luxury']),
        item('field-knife', 'Field Knife', 74, ['equipment', 'tool', 'weapon', 'dagger', 'cutting', 'field']),
        item('woodsman-hatchet', 'Woodsman Hatchet', 96, ['equipment', 'tool', 'weapon', 'axe', 'woodcutting', 'field']),
        item('digging-spade', 'Digging Spade', 88, ['equipment', 'tool', 'digging', 'field']),
        item('road-cloak', 'Road Cloak', 96, ['equipment', 'armor', 'back', 'travel']),
    ]),
    'poi-bastok-markets-brunhilde': shop('poi-bastok-markets-brunhilde', 'Market Ring Armorer', 'Protective gear made for foundry crews, caravans, and civic guards.', [
        item('bronze-subligar', 'Bronze Subligar', 90, ['armor', 'legs', 'starter']),
        item('bronze-mittens', 'Bronze Mittens', 62, ['armor', 'hands', 'starter']),
        item('leather-vest', 'Leather Vest', 96, ['equipment', 'armor', 'body', 'light']),
        item('iron-buckler', 'Iron Buckler', 108, ['equipment', 'armor', 'shield', 'offhand']),
        item('brass-ring', 'Brass Ring', 70, ['equipment', 'ring', 'accessory']),
    ]),
    'poi-bastok-markets-ciqala': shop('poi-bastok-markets-ciqala', 'Market Ring Toolworks', 'Mining and field implements alongside ordinary weapons.', [
        item('bronze-sword', 'Bronze Sword', 76, ['weapon', 'sword', 'starter']),
        item('bronze-pick', 'Bronze Pick', 92, ['weapon', 'axe', 'starter']),
        item('prospector-pick', 'Prospector Pick', 98, ['equipment', 'tool', 'mining', 'field']),
        item('digging-spade', 'Digging Spade', 82, ['equipment', 'tool', 'digging', 'field']),
        item('field-knife', 'Field Knife', 74, ['equipment', 'tool', 'weapon', 'dagger', 'cutting', 'field']),
    ]),
    'poi-bastok-markets-carmelide': shop('poi-bastok-markets-carmelide', 'Market Ring General Goods', 'Medicinals, travel necessities, and inexpensive field gear.', [
        item('flask-of-water', 'Flask of Water', 8, ['consumable', 'starter']),
        item('minor-potion', 'Minor Potion', 60, ['consumable', 'healing']),
        item('field-belt', 'Field Belt', 66, ['equipment', 'armor', 'waist', 'field']),
        item('traveler-boots', 'Traveler Boots', 80, ['equipment', 'armor', 'feet', 'travel']),
    ]),
    'poi-waters-baehu-faehu': shop('poi-waters-baehu-faehu', 'Canal Ward Regional Goods', 'Wetland fibers, tea, and tools suited to reedbeds and shallow water.', [
        item('sarutabaruta-cotton', 'Starfen Cotton', 30, ['material', 'regional']),
        item('windurstian-tea-leaf', 'Fen Tea Leaf', 18, ['food', 'regional']),
        item('reed-sickle', 'Reed Sickle', 76, ['equipment', 'tool', 'cutting', 'field']),
        item('marsh-rod', 'Marsh Fishing Rod', 105, ['equipment', 'tool', 'fishing', 'field']),
    ]),
    'poi-waters-ensasa': shop('poi-waters-ensasa', 'Canal Ward Sundries', 'Scholastic supplies, simple restorative goods, and light travel equipment.', [
        item('maple-wand', 'Maple Wand', 80, ['weapon', 'club', 'starter']),
        item('minor-ether', 'Minor Ether', 90, ['consumable', 'mp']),
        item('road-cloak', 'Road Cloak', 92, ['equipment', 'armor', 'back', 'travel']),
        item('brass-ring', 'Brass Ring', 68, ['equipment', 'ring', 'accessory']),
    ]),
    'poi-port-bastok-shops': shop('poi-port-bastok-shops', 'Iron Quay Chandlery', 'Travel provisions and durable tools for freight crews and road caravans.', [
        item('travel-ration', 'Travel Ration', 20, ['food', 'travel']),
        item('simple-bandage', 'Simple Bandage', 20, ['consumable', 'healing']),
        item('prospector-pick', 'Prospector Pick', 100, ['equipment', 'tool', 'mining', 'field']),
        item('marsh-rod', 'Marsh Fishing Rod', 108, ['equipment', 'tool', 'fishing', 'field']),
    ]),
});

export function getShopCatalogForPoi(poiId) {
    return SHOP_CATALOGS[poiId] ?? null;
}

export function listShopCatalogs() {
    return Object.values(SHOP_CATALOGS);
}

export function describeShopCatalogForPoi(poi) {
    const catalog = getShopCatalogForPoi(poi.id);
    if (!catalog) return `${poi.name} has no shop catalog yet. Tags: ${poi.tags.join(', ')}`;

    return [
        `${catalog.name}`,
        catalog.description,
        'Inventory:',
        ...catalog.items.map((entry) => `- ${entry.name}: ${entry.priceGil} gil [${entry.tags.join(', ')}]`),
    ].join('\n');
}

function shop(poiId, name, description, items) {
    return Object.freeze({ poiId, name, description, items: Object.freeze(items) });
}

function item(id, name, priceGil, tags = []) {
    return Object.freeze({ id, name, priceGil, tags: Object.freeze(tags) });
}
