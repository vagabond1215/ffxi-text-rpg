import { createContentPack } from './contentPackSchema.js';

export const REGIONAL_CONTENT_PACK_DATA_VERSION = 19;

export const SHARED_FOUNDATION_PACK = createContentPack({
    id: 'pack-shared-foundation',
    dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'shared', regionIds: [], steward: 'core-world' },
    dependencies: [],
    metadata: {
        name: 'Shared World Foundation',
        notes: 'Cross-region transport records shared by regional packs without duplicating stable-ID ownership.',
    },
    records: {
        routes: [
            { id: 'route-crown-forge-caravan-road', catalogRef: true },
            { id: 'route-forge-mere-caravan-road', catalogRef: true },
        ],
        transportServices: [
            { id: 'service-crown-forge-caravan', catalogRef: true },
            { id: 'service-forge-mere-caravan', catalogRef: true },
        ],
    },
});

export const ELDERWOOD_PACK = createContentPack({
    id: 'pack-elderwood-opening',
    dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['elderwood'], steward: 'thornwall-west' },
    dependencies: ['pack-shared-foundation'],
    metadata: {
        name: 'Elderwood Opening Pack',
        notes: 'Representative ownership manifest plus a small cross-linked social/economy layer.',
    },
    records: {
        places: [
            { id: 'thornwall-southgate', catalogRef: true },
            { id: 'timbercross-landing', catalogRef: true },
            { id: 'west-elderwood', catalogRef: true },
        ],
        routes: [
            { id: 'route-thornwall-west-elderwood-road', catalogRef: true },
            { id: 'route-thornwall-timbercross-road', catalogRef: true },
        ],
        species: [
            { id: 'species-brush-hare', catalogRef: true },
            { id: 'species-mossback-goblin', catalogRef: true },
            { id: 'species-moon-antler-hart', catalogRef: true },
        ],
        populations: [
            { id: 'population-west-elderwood-brush-hare', catalogRef: true },
            { id: 'population-west-elderwood-mossback-goblin', catalogRef: true },
            { id: 'population-west-elderwood-moon-antler-hart', catalogRef: true },
        ],
        gatheringSources: [
            { id: 'source-west-elderwood-sweetroot-patch', catalogRef: true },
            { id: 'source-west-elderwood-hardwood-fall', catalogRef: true },
        ],
        items: [
            { id: 'item-elderwood-sweetroot', catalogRef: true },
            { id: 'item-elderwood-hardwood', catalogRef: true },
            {
                id: 'item-elderwood-root-tonic',
                name: 'Sweetroot Field Tonic',
                kind: 'consumable',
                provenance: [{
                    version: 1,
                    type: 'crafting',
                    sourceId: 'recipe-elderwood-root-tonic',
                    placeId: 'timbercross-landing',
                    action: 'craft',
                    exceptional: false,
                    notes: '',
                    data: {},
                }],
                sinks: [
                    { type: 'consume', targetId: null, notes: '', data: {} },
                    { type: 'trade', targetId: null, notes: '', data: {} },
                ],
            },
        ],
        npcs: [{
            id: 'npc-elderwood-waywarden',
            name: 'Mara Venn',
            placeId: 'timbercross-landing',
            services: ['route-guidance', 'contracts'],
        }],
        shops: [{
            id: 'shop-timbercross-provisions',
            name: 'Timbercross Provisions',
            placeId: 'timbercross-landing',
            keeperNpcId: 'npc-elderwood-waywarden',
            stockItemIds: ['item-elderwood-sweetroot', 'item-elderwood-root-tonic'],
        }],
        recipes: [{
            id: 'recipe-elderwood-root-tonic',
            name: 'Sweetroot Field Tonic',
            station: 'camp-kettle',
            placeIds: ['timbercross-landing', 'thornwall-southgate'],
            inputs: [{ itemId: 'item-elderwood-sweetroot', quantity: 2 }],
            outputs: [{ itemId: 'item-elderwood-root-tonic', quantity: 1 }],
        }],
        quests: [{
            id: 'quest-elderwood-road-repair',
            name: 'Timber for the Work Road',
            giverNpcId: 'npc-elderwood-waywarden',
            placeId: 'timbercross-landing',
            objectives: [{ type: 'deliverItem', itemId: 'item-elderwood-hardwood', quantity: 2 }],
            rewards: [{ type: 'item', itemId: 'item-elderwood-root-tonic', quantity: 1 }],
        }],
        relationships: [{
            id: 'relationship-elderwood-waywarden',
            npcId: 'npc-elderwood-waywarden',
            dimensions: ['trust', 'respect'],
            unlockQuestIds: ['quest-elderwood-road-repair'],
        }],
    },
});

export const STARFEN_PACK = createContentPack({
    id: 'pack-starfen-opening',
    dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['starfen'], steward: 'mistmere-west' },
    dependencies: ['pack-shared-foundation', 'pack-elderwood-opening'],
    metadata: {
        name: 'Starfen Opening Pack',
        notes: 'Representative wetland pack with an intentional Elderwood material dependency.',
    },
    records: {
        places: [
            { id: 'mistmere-reedport', catalogRef: true },
            { id: 'west-starfen', catalogRef: true },
        ],
        routes: [
            { id: 'route-mistmere-west-starfen-causeway', catalogRef: true },
            { id: 'route-mistmere-west-starfen-waterway', catalogRef: true },
        ],
        transportServices: [
            { id: 'service-mistmere-west-ferry', catalogRef: true },
        ],
        species: [
            { id: 'species-starfen-rootling', catalogRef: true },
            { id: 'species-reedmask-acolyte', catalogRef: true },
        ],
        populations: [
            { id: 'population-west-starfen-rootlings', catalogRef: true },
            { id: 'population-west-starfen-reedmasks', catalogRef: true },
        ],
        gatheringSources: [
            { id: 'source-west-starfen-reedbed', catalogRef: true },
            { id: 'source-west-starfen-marrowleaf-bed', catalogRef: true },
            { id: 'source-west-starfen-silverfin-water', catalogRef: true },
        ],
        items: [
            { id: 'item-starfen-reed-fiber', catalogRef: true },
            { id: 'item-starfen-marrowleaf', catalogRef: true },
            { id: 'item-starfen-silverfin', catalogRef: true },
            {
                id: 'item-starfen-field-dressing',
                name: 'Fenfield Dressing',
                kind: 'consumable',
                provenance: [{
                    version: 1,
                    type: 'crafting',
                    sourceId: 'recipe-starfen-field-dressing',
                    placeId: 'west-starfen',
                    action: 'craft',
                    exceptional: false,
                    notes: '',
                    data: {},
                }],
                sinks: [
                    { type: 'consume', targetId: null, notes: '', data: {} },
                    { type: 'contract', targetId: 'quest-starfen-ferry-supplies', notes: '', data: {} },
                ],
            },
        ],
        npcs: [{
            id: 'npc-starfen-ferrymaster',
            name: 'Ilyan Reed',
            placeId: 'mistmere-reedport',
            services: ['ferry-booking', 'contracts'],
        }],
        shops: [{
            id: 'shop-reedport-fenmarket',
            name: 'Reedport Fenmarket',
            placeId: 'mistmere-reedport',
            keeperNpcId: 'npc-starfen-ferrymaster',
            stockItemIds: ['item-starfen-marrowleaf', 'item-elderwood-root-tonic'],
        }],
        recipes: [{
            id: 'recipe-starfen-field-dressing',
            name: 'Fenfield Dressing',
            station: 'field-kit',
            placeIds: ['west-starfen'],
            inputs: [
                { itemId: 'item-starfen-marrowleaf', quantity: 1 },
                { itemId: 'item-starfen-reed-fiber', quantity: 1 },
                { itemId: 'item-elderwood-sweetroot', quantity: 1 },
            ],
            outputs: [{ itemId: 'item-starfen-field-dressing', quantity: 1 }],
        }],
        quests: [{
            id: 'quest-starfen-ferry-supplies',
            name: 'Timber for the West Ferry',
            giverNpcId: 'npc-starfen-ferrymaster',
            placeId: 'mistmere-reedport',
            objectives: [{ type: 'deliverItem', itemId: 'item-elderwood-hardwood', quantity: 2 }],
            rewards: [{ type: 'item', itemId: 'item-starfen-field-dressing', quantity: 1 }],
        }],
        relationships: [{
            id: 'relationship-starfen-ferrymaster',
            npcId: 'npc-starfen-ferrymaster',
            dimensions: ['trust', 'familiarity'],
            unlockQuestIds: ['quest-starfen-ferry-supplies'],
        }],
    },
});

export const REGIONAL_CONTENT_PACKS = Object.freeze([
    SHARED_FOUNDATION_PACK,
    ELDERWOOD_PACK,
    STARFEN_PACK,
]);

export function listRegionalContentPacks() {
    return [...REGIONAL_CONTENT_PACKS];
}

export function getRegionalContentPack(packId) {
    return REGIONAL_CONTENT_PACKS.find((pack) => pack.id === packId) ?? null;
}
