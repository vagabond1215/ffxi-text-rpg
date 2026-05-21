export const SHOP_CATALOGS = Object.freeze({
    'poi-sandoria-s-ashene': shop('poi-sandoria-s-ashene', 'Ashene Weapons', 'Basic San d’Oria weapons.', [
        item('bronze-sword', 'Bronze Sword', 76, ['weapon', 'sword', 'starter']),
        item('bronze-axe', 'Bronze Axe', 88, ['weapon', 'axe', 'starter']),
        item('bronze-dagger', 'Bronze Dagger', 64, ['weapon', 'dagger', 'starter']),
    ]),
    'poi-sandoria-s-aveline': shop('poi-sandoria-s-aveline', 'Aveline Foodstuffs', 'Simple food and provisions.', [
        item('loaf-of-bread', 'Loaf of Bread', 12, ['food', 'starter']),
        item('flask-of-water', 'Flask of Water', 8, ['consumable', 'starter']),
    ]),
    'poi-sandoria-s-capucine': shop('poi-sandoria-s-capucine', 'Capucine Armor', 'Basic protective gear.', [
        item('bronze-cap', 'Bronze Cap', 70, ['armor', 'head', 'starter']),
        item('bronze-harness', 'Bronze Harness', 120, ['armor', 'body', 'starter']),
    ]),
    'poi-sandoria-n-arlenne': shop('poi-sandoria-n-arlenne', 'Arlenne Weapons', 'Northern San d’Oria weapon stock.', [
        item('ash-staff', 'Ash Staff', 96, ['weapon', 'staff', 'starter']),
        item('maple-wand', 'Maple Wand', 80, ['weapon', 'club', 'starter']),
    ]),
    'poi-bastok-markets-brunhilde': shop('poi-bastok-markets-brunhilde', 'Brunhilde Armor', 'Basic Bastok armor.', [
        item('bronze-subligar', 'Bronze Subligar', 90, ['armor', 'legs', 'starter']),
        item('bronze-mittens', 'Bronze Mittens', 62, ['armor', 'hands', 'starter']),
    ]),
    'poi-bastok-markets-ciqala': shop('poi-bastok-markets-ciqala', 'Ciqala Weapons', 'Basic Bastok weapon stock.', [
        item('bronze-sword', 'Bronze Sword', 76, ['weapon', 'sword', 'starter']),
        item('bronze-pick', 'Bronze Pick', 92, ['weapon', 'axe', 'starter']),
    ]),
    'poi-bastok-markets-carmelide': shop('poi-bastok-markets-carmelide', 'Carmelide Goods', 'Basic item supplies.', [
        item('flask-of-water', 'Flask of Water', 8, ['consumable', 'starter']),
        item('minor-potion', 'Minor Potion', 60, ['consumable', 'healing']),
    ]),
    'poi-waters-baehu-faehu': shop('poi-waters-baehu-faehu', 'Baehu-Faehu Regional Goods', 'Sarutabaruta regional goods.', [
        item('sarutabaruta-cotton', 'Sarutabaruta Cotton', 30, ['material', 'regional']),
        item('windurstian-tea-leaf', 'Windurstian Tea Leaf', 18, ['food', 'regional']),
    ]),
    'poi-waters-ensasa': shop('poi-waters-ensasa', 'Ensasa Sundries', 'Windurst starter supplies.', [
        item('maple-wand', 'Maple Wand', 80, ['weapon', 'club', 'starter']),
        item('minor-ether', 'Minor Ether', 90, ['consumable', 'mp']),
    ]),
    'poi-port-bastok-shops': shop('poi-port-bastok-shops', 'Port Bastok Shops', 'Port-side mixed goods.', [
        item('travel-ration', 'Travel Ration', 20, ['food', 'travel']),
        item('simple-bandage', 'Simple Bandage', 20, ['consumable', 'healing']),
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
        ...catalog.items.map((item) => `- ${item.name}: ${item.priceGil} gil [${item.tags.join(', ')}]`),
    ].join('\n');
}

function shop(poiId, name, description, items) {
    return Object.freeze({ poiId, name, description, items: Object.freeze(items) });
}

function item(id, name, priceGil, tags = []) {
    return Object.freeze({ id, name, priceGil, tags });
}
