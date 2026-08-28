export const SHOP_CATALOG_VERSION = 2;

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
