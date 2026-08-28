import { createContentPack } from './contentPackSchema.js';
import { REGIONAL_ECOLOGY_PACKS } from './regionalEcologyPacks.js';

export const REGIONAL_CONTENT_PACK_DATA_VERSION = 30;

export const SHARED_FOUNDATION_PACK = createContentPack({
    id: 'pack-shared-foundation', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'shared', regionIds: [], steward: 'core-world' }, dependencies: [],
    metadata: { name: 'Shared World Foundation', notes: 'Cross-region transport, training, and executable capability records shared by regional packs without duplicating stable-ID ownership.' },
    records: {
        routes: [{ id: 'route-crown-forge-caravan-road', catalogRef: true }, { id: 'route-forge-mere-caravan-road', catalogRef: true }],
        transportServices: [{ id: 'service-crown-forge-caravan', catalogRef: true }, { id: 'service-forge-mere-caravan', catalogRef: true }],
        spellSchools: [{ id: 'school-elemental-form', catalogRef: true }, { id: 'school-vital-weave', catalogRef: true }, { id: 'school-ward-lore', catalogRef: true }, { id: 'school-veilscript', catalogRef: true }],
        capabilities: [
            { id: 'spell-ember-dart', catalogRef: true },
            { id: 'spell-mending-thread', catalogRef: true },
            { id: 'spell-stone-ward', catalogRef: true },
            { id: 'spell-cinder-spark', catalogRef: true },
            { id: 'spell-tempered-ward', catalogRef: true },
            { id: 'spell-barkskin-ward', catalogRef: true },
            { id: 'spell-wellspring-mending', catalogRef: true },
            { id: 'spell-mistveil-ward', catalogRef: true },
            { id: 'spell-storm-spark', catalogRef: true },
            { id: 'spell-cinder-bolt', catalogRef: true },
            { id: 'spell-stone-shards', catalogRef: true },
            { id: 'spell-gale-cutter', catalogRef: true },
            { id: 'spell-tide-needle', catalogRef: true },
            { id: 'spell-storm-jolt', catalogRef: true },
            { id: 'spell-rime-splinters', catalogRef: true },
            { id: 'spell-sunlance', catalogRef: true },
            { id: 'spell-gloam-spike', catalogRef: true },
            { id: 'spell-flare-bloom', catalogRef: true },
            { id: 'spell-fault-rush', catalogRef: true },
            { id: 'spell-tempest-ring', catalogRef: true },
            { id: 'spell-riptide-lance', catalogRef: true },
            { id: 'spell-thunder-cage', catalogRef: true },
            { id: 'spell-rimefall', catalogRef: true },
            { id: 'spell-radiant-arc', catalogRef: true },
            { id: 'spell-umbral-well', catalogRef: true },
            { id: 'spell-renewing-pulse', catalogRef: true },
            { id: 'spell-steady-heart', catalogRef: true },
            { id: 'spell-spellguard', catalogRef: true },
            { id: 'spell-swiftstep', catalogRef: true },
            { id: 'spell-fracture-sigil', catalogRef: true },
            { id: 'spell-haze-sigil', catalogRef: true },
            { id: 'spell-snare-sigil', catalogRef: true },
            { id: 'spell-guardian-sigil', catalogRef: true },
            { id: 'technique-guarded-cut', catalogRef: true },
            { id: 'technique-shadow-feint', catalogRef: true },
            { id: 'practical-field-dressing', catalogRef: true },
            { id: 'practical-ore-survey', catalogRef: true },
            { id: 'practical-waymark-reading', catalogRef: true },
        ],
        abilities: [
            { id: 'ability-ember-dart', catalogRef: true },
            { id: 'ability-mending-thread', catalogRef: true },
            { id: 'ability-stone-ward', catalogRef: true },
            { id: 'ability-cinder-spark', catalogRef: true },
            { id: 'ability-tempered-ward', catalogRef: true },
            { id: 'ability-barkskin-ward', catalogRef: true },
            { id: 'ability-wellspring-mending', catalogRef: true },
            { id: 'ability-mistveil-ward', catalogRef: true },
            { id: 'ability-storm-spark', catalogRef: true },
            { id: 'ability-cinder-bolt', catalogRef: true },
            { id: 'ability-stone-shards', catalogRef: true },
            { id: 'ability-gale-cutter', catalogRef: true },
            { id: 'ability-tide-needle', catalogRef: true },
            { id: 'ability-storm-jolt', catalogRef: true },
            { id: 'ability-rime-splinters', catalogRef: true },
            { id: 'ability-sunlance', catalogRef: true },
            { id: 'ability-gloam-spike', catalogRef: true },
            { id: 'ability-flare-bloom', catalogRef: true },
            { id: 'ability-fault-rush', catalogRef: true },
            { id: 'ability-tempest-ring', catalogRef: true },
            { id: 'ability-riptide-lance', catalogRef: true },
            { id: 'ability-thunder-cage', catalogRef: true },
            { id: 'ability-rimefall', catalogRef: true },
            { id: 'ability-radiant-arc', catalogRef: true },
            { id: 'ability-umbral-well', catalogRef: true },
            { id: 'ability-renewing-pulse', catalogRef: true },
            { id: 'ability-steady-heart', catalogRef: true },
            { id: 'ability-spellguard', catalogRef: true },
            { id: 'ability-swiftstep', catalogRef: true },
            { id: 'ability-fracture-sigil', catalogRef: true },
            { id: 'ability-haze-sigil', catalogRef: true },
            { id: 'ability-snare-sigil', catalogRef: true },
            { id: 'ability-guardian-sigil', catalogRef: true },
            { id: 'ability-guarded-cut', catalogRef: true },
            { id: 'ability-waymark-reading', catalogRef: true },
        ],
    },
});

export const ELDERWOOD_PACK = createContentPack({
    id: 'pack-elderwood-opening', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['elderwood'], steward: 'thornwall-west' }, dependencies: ['pack-shared-foundation'],
    metadata: { name: 'Elderwood Opening Pack', notes: 'Representative ownership manifest plus a small cross-linked social/economy layer.' },
    records: {
        places: [{ id: 'thornwall-southgate', catalogRef: true }, { id: 'timbercross-landing', catalogRef: true }, { id: 'west-elderwood', catalogRef: true }],
        routes: [{ id: 'route-thornwall-west-elderwood-road', catalogRef: true }, { id: 'route-thornwall-timbercross-road', catalogRef: true }],
        species: [{ id: 'species-brush-hare', catalogRef: true }, { id: 'species-mossback-goblin', catalogRef: true }, { id: 'species-moon-antler-hart', catalogRef: true }],
        populations: [{ id: 'population-west-elderwood-brush-hare', catalogRef: true }, { id: 'population-west-elderwood-mossback-goblin', catalogRef: true }, { id: 'population-west-elderwood-moon-antler-hart', catalogRef: true }],
        gatheringSources: [{ id: 'source-west-elderwood-sweetroot-patch', catalogRef: true }, { id: 'source-west-elderwood-hardwood-fall', catalogRef: true }],
        items: [
            { id: 'item-elderwood-sweetroot', catalogRef: true }, { id: 'item-elderwood-hardwood', catalogRef: true },
            { id: 'item-elderwood-root-tonic', name: 'Sweetroot Field Tonic', kind: 'consumable', provenance: [{ version: 1, type: 'crafting', sourceId: 'recipe-elderwood-root-tonic', placeId: 'timbercross-landing', action: 'craft', exceptional: false, notes: '', data: {} }], sinks: [{ type: 'consume', targetId: null, notes: '', data: {} }, { type: 'trade', targetId: null, notes: '', data: {} }] },
        ],
        npcs: [{ id: 'npc-thornwall-sera-talwin', catalogRef: true }, { id: 'npc-thornwall-mira-fen', catalogRef: true }, { id: 'npc-elderwood-waywarden', catalogRef: true }],
        npcSchedules: [{ id: 'schedule-thornwall-sera-talwin', catalogRef: true }, { id: 'schedule-thornwall-mira-fen', catalogRef: true }],
        shops: [{ id: 'shop-timbercross-provisions', name: 'Timbercross Provisions', placeId: 'timbercross-landing', keeperNpcId: 'npc-elderwood-waywarden', stockItemIds: ['item-elderwood-sweetroot', 'item-elderwood-root-tonic'] }],
        recipes: [{ id: 'recipe-elderwood-root-tonic', name: 'Sweetroot Field Tonic', station: 'camp-kettle', placeIds: ['timbercross-landing', 'thornwall-southgate'], inputs: [{ itemId: 'item-elderwood-sweetroot', quantity: 2 }], outputs: [{ itemId: 'item-elderwood-root-tonic', quantity: 1 }] }],
        quests: [
            { id: 'quest-elderwood-road-repair', name: 'Timber for the Work Road', giverNpcId: 'npc-elderwood-waywarden', placeId: 'timbercross-landing', objectives: [{ type: 'deliverItem', itemId: 'item-elderwood-hardwood', quantity: 2 }], rewards: [{ type: 'item', itemId: 'item-elderwood-root-tonic', quantity: 1 }] },
            { id: 'commitment-thornwall-sweetroot-return', catalogRef: true }, { id: 'commitment-thornwall-hearth-sweetroot-share', catalogRef: true },
        ],
        relationships: [{ id: 'relationship-elderwood-waywarden', npcId: 'npc-elderwood-waywarden', dimensions: ['trust', 'respect'], unlockQuestIds: ['quest-elderwood-road-repair'] }],
        companions: [{ id: 'companion-mara-venn', catalogRef: true }],
    },
});

export const ELDERWOOD_HUNT_TIMBER_PACK = createContentPack({
    id: 'pack-elderwood-hunt-timber', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['elderwood'], steward: 'thornwall-hunt-timber' },
    dependencies: ['pack-shared-foundation', 'pack-elderwood-opening', 'pack-elderwood-ecology-breadth'],
    metadata: { name: 'Elderwood Hunt-Timber Pack', notes: 'Dense Elderwood hunt, forestry, tanning, road-repair, and field-technique tranche connecting Barkboar recovery and forest gathering to useful gear, civic work, and persistent relationships.' },
    records: {
        items: [
            { id: 'item-elderwood-resin-board', catalogRef: true },
            { id: 'item-elderwood-hide-binding', catalogRef: true },
            { id: 'item-elderwood-tanned-hide', catalogRef: true },
            { id: 'item-elderwood-resin-pitch', catalogRef: true },
            { id: 'item-elderwood-forester-gloves', catalogRef: true },
            { id: 'item-elderwood-hunters-bracer', catalogRef: true },
            { id: 'item-elderwood-trail-repair-bundle', catalogRef: true },
            { id: 'item-elderwood-waywarden-mantle', catalogRef: true },
        ],
        npcs: [
            { id: 'npc-thornwall-edrin-bale', catalogRef: true },
            { id: 'npc-thornwall-nessa-woodmere', catalogRef: true },
            { id: 'npc-thornwall-oren-vale', catalogRef: true },
        ],
        npcSchedules: [{ id: 'schedule-thornwall-oren-vale', catalogRef: true }],
        recipes: [
            { id: 'craft-elderwood-resin-board', catalogRef: true },
            { id: 'craft-elderwood-hide-binding', catalogRef: true },
            { id: 'process-elderwood-tanned-hide', catalogRef: true },
            { id: 'process-elderwood-resin-pitch', catalogRef: true },
            { id: 'craft-elderwood-forester-gloves', catalogRef: true },
            { id: 'craft-elderwood-hunters-bracer', catalogRef: true },
            { id: 'craft-elderwood-trail-repair-bundle', catalogRef: true },
            { id: 'craft-elderwood-waywarden-mantle', catalogRef: true },
        ],
        capabilities: [
            { id: 'technique-barkboar-brace', catalogRef: true },
            { id: 'technique-thicket-feint', catalogRef: true },
            { id: 'practical-elderwood-trail-read', catalogRef: true },
        ],
        abilities: [
            { id: 'ability-barkboar-brace', catalogRef: true },
            { id: 'ability-thicket-feint', catalogRef: true },
            { id: 'ability-elderwood-trail-read', catalogRef: true },
        ],
        quests: [
            { id: 'commitment-thornwall-tanned-hide-order', catalogRef: true },
            { id: 'commitment-thornwall-forester-gloves', catalogRef: true },
            { id: 'commitment-thornwall-trail-repair-bundles', catalogRef: true },
        ],
    },
});

export const SLATEWATER_WAYLODGE_PACK = createContentPack({
    id: 'pack-slatewater-waylodge', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['slatewater-foothills'], steward: 'slatewater-field-guild' },
    dependencies: ['pack-shared-foundation', 'pack-elderwood-opening', 'pack-redstone-opening', 'pack-slatewater-foothills-ecology'],
    metadata: { name: 'Slatewater Waylodge Pack', notes: 'Neutral Crown-Forge road lodge connecting foothill gathering and hunting country to safe recovery, trade exchange, guild information, stabling, and local caravan service.' },
    records: {
        places: [{ id: 'slatewater-waylodge', catalogRef: true }],
        transportServices: [{ id: 'service-slatewater-foothill-caravan', catalogRef: true }],
        npcs: [
            { id: 'npc-slatewater-eira-voss', catalogRef: true },
            { id: 'npc-slatewater-toren-marr', catalogRef: true },
            { id: 'npc-slatewater-bram-pell', catalogRef: true },
        ],
        npcSchedules: [
            { id: 'schedule-slatewater-eira-voss', catalogRef: true },
            { id: 'schedule-slatewater-toren-marr', catalogRef: true },
        ],
        shops: [{
            id: 'shop-slatewater-field-exchange',
            name: 'Slatewater Field Exchange',
            placeId: 'slatewater-waylodge',
            keeperNpcId: 'npc-slatewater-eira-voss',
            stockItemIds: [
                'item-slatewater-serviceberry',
                'item-slatewater-pitch-pine-resin',
                'item-slatewater-white-clay',
                'item-slatewater-mountain-thyme',
                'item-slatewater-silver-lichen',
                'item-slatewater-blue-slate',
            ],
        }],
    },
});

export const REDSTONE_PACK = createContentPack({
    id: 'pack-redstone-opening', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['redstone-reach'], steward: 'brasshaven-south' }, dependencies: ['pack-shared-foundation', 'pack-elderwood-opening'],
    metadata: { name: 'Redstone Opening Pack', notes: 'Regional root for Brasshaven people, schedules, commitments, and downstream Redstone content packs.' },
    records: {
        places: [{ id: 'brasshaven-market-ring', catalogRef: true }],
        npcs: [{ id: 'npc-brasshaven-marshal-varric-stone', catalogRef: true }, { id: 'npc-brasshaven-mae-oris', catalogRef: true }],
        npcSchedules: [{ id: 'schedule-brasshaven-mae-oris', catalogRef: true }],
        quests: [{ id: 'commitment-brasshaven-copper-return', catalogRef: true }, { id: 'commitment-brasshaven-courtyard-sweetroot-share', catalogRef: true }],
    },
});

export const REDSTONE_FORGE_ROAD_PACK = createContentPack({
    id: 'pack-redstone-forge-road', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['redstone-reach'], steward: 'brasshaven-forge-road' },
    dependencies: ['pack-shared-foundation', 'pack-redstone-opening', 'pack-redstone-ecology-breadth'],
    metadata: { name: 'Redstone Forge-Road Pack', notes: 'Dense Redstone production and technique tranche connecting field minerals and Ridge Ibex recovery to forge work, wearable equipment, caravan repair, contracts, and executable combat training.' },
    records: {
        items: [
            { id: 'item-redstone-iron-bloom', catalogRef: true },
            { id: 'item-redstone-forge-flux', catalogRef: true },
            { id: 'item-redstone-tempered-iron-bar', catalogRef: true },
            { id: 'item-redstone-rivet-set', catalogRef: true },
            { id: 'item-redstone-miners-brace', catalogRef: true },
            { id: 'item-redstone-forge-gloves', catalogRef: true },
            { id: 'item-redstone-caravan-shoe', catalogRef: true },
        ],
        recipes: [
            { id: 'process-redstone-iron-bloom', catalogRef: true },
            { id: 'process-redstone-forge-flux', catalogRef: true },
            { id: 'process-redstone-tempered-iron', catalogRef: true },
            { id: 'craft-redstone-rivet-set', catalogRef: true },
            { id: 'craft-redstone-miners-brace', catalogRef: true },
            { id: 'craft-redstone-forge-gloves', catalogRef: true },
            { id: 'craft-redstone-caravan-shoe', catalogRef: true },
        ],
        capabilities: [
            { id: 'technique-ridge-breaker', catalogRef: true },
            { id: 'technique-rivet-guard', catalogRef: true },
        ],
        abilities: [
            { id: 'ability-ridge-breaker', catalogRef: true },
            { id: 'ability-rivet-guard', catalogRef: true },
        ],
        quests: [
            { id: 'commitment-brasshaven-iron-bloom-return', catalogRef: true },
            { id: 'commitment-brasshaven-rivet-run', catalogRef: true },
            { id: 'commitment-brasshaven-caravan-shoes', catalogRef: true },
        ],
    },
});

export const STARFEN_PACK = createContentPack({
    id: 'pack-starfen-opening', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['starfen'], steward: 'mistmere-west' }, dependencies: ['pack-shared-foundation', 'pack-elderwood-opening'],
    metadata: { name: 'Starfen Opening Pack', notes: 'Representative wetland pack with an intentional Elderwood material dependency.' },
    records: {
        places: [{ id: 'mistmere-canal-ward', catalogRef: true }, { id: 'mistmere-reedport', catalogRef: true }, { id: 'west-starfen', catalogRef: true }],
        routes: [{ id: 'route-mistmere-west-starfen-causeway', catalogRef: true }, { id: 'route-mistmere-west-starfen-waterway', catalogRef: true }],
        transportServices: [{ id: 'service-mistmere-west-ferry', catalogRef: true }],
        species: [{ id: 'species-starfen-rootling', catalogRef: true }, { id: 'species-reedmask-acolyte', catalogRef: true }],
        populations: [{ id: 'population-west-starfen-rootlings', catalogRef: true }, { id: 'population-west-starfen-reedmasks', catalogRef: true }],
        gatheringSources: [{ id: 'source-west-starfen-reedbed', catalogRef: true }, { id: 'source-west-starfen-marrowleaf-bed', catalogRef: true }, { id: 'source-west-starfen-silverfin-water', catalogRef: true }],
        items: [
            { id: 'item-starfen-reed-fiber', catalogRef: true }, { id: 'item-starfen-marrowleaf', catalogRef: true }, { id: 'item-starfen-silverfin', catalogRef: true },
            { id: 'item-starfen-field-dressing', name: 'Fenfield Dressing', kind: 'consumable', provenance: [{ version: 1, type: 'crafting', sourceId: 'recipe-starfen-field-dressing', placeId: 'west-starfen', action: 'craft', exceptional: false, notes: '', data: {} }], sinks: [{ type: 'consume', targetId: null, notes: '', data: {} }, { type: 'contract', targetId: 'quest-starfen-ferry-supplies', notes: '', data: {} }] },
        ],
        npcs: [{ id: 'npc-mistmere-reader-soli-venn', catalogRef: true }, { id: 'npc-mistmere-kiri-fen', catalogRef: true }, { id: 'npc-starfen-ferrymaster', name: 'Ilyan Reed', placeId: 'mistmere-reedport', services: ['ferry-booking', 'contracts'] }],
        npcSchedules: [{ id: 'schedule-mistmere-kiri-fen', catalogRef: true }],
        shops: [{ id: 'shop-reedport-fenmarket', name: 'Reedport Fenmarket', placeId: 'mistmere-reedport', keeperNpcId: 'npc-starfen-ferrymaster', stockItemIds: ['item-starfen-marrowleaf', 'item-elderwood-root-tonic'] }],
        recipes: [{ id: 'recipe-starfen-field-dressing', name: 'Fenfield Dressing', station: 'field-kit', placeIds: ['west-starfen'], inputs: [{ itemId: 'item-starfen-marrowleaf', quantity: 1 }, { itemId: 'item-starfen-reed-fiber', quantity: 1 }, { itemId: 'item-elderwood-sweetroot', quantity: 1 }], outputs: [{ itemId: 'item-starfen-field-dressing', quantity: 1 }] }],
        quests: [
            { id: 'quest-starfen-ferry-supplies', name: 'Timber for the West Ferry', giverNpcId: 'npc-starfen-ferrymaster', placeId: 'mistmere-reedport', objectives: [{ type: 'deliverItem', itemId: 'item-elderwood-hardwood', quantity: 2 }], rewards: [{ type: 'item', itemId: 'item-starfen-field-dressing', quantity: 1 }] },
            { id: 'commitment-mistmere-marrowleaf-return', catalogRef: true }, { id: 'commitment-mistmere-canalside-sweetroot-share', catalogRef: true },
        ],
        relationships: [{ id: 'relationship-starfen-ferrymaster', npcId: 'npc-starfen-ferrymaster', dimensions: ['trust', 'familiarity'], unlockQuestIds: ['quest-starfen-ferry-supplies'] }],
    },
});

export const STARFEN_MARSHCRAFT_PACK = createContentPack({
    id: 'pack-starfen-marshcraft', dataVersion: REGIONAL_CONTENT_PACK_DATA_VERSION,
    ownership: { scope: 'region', regionIds: ['starfen'], steward: 'mistmere-marshcraft' },
    dependencies: ['pack-shared-foundation', 'pack-starfen-opening', 'pack-starfen-ecology-breadth'],
    metadata: { name: 'Starfen Marshcraft Pack', notes: 'Dense wetland production and community tranche connecting Starfen herbs, kelp, reed fiber, and recovered heron material to medicine, waterproof marshcraft, civic use, and regional field knowledge. Magic remains shared/universal.' },
    records: {
        items: [
            { id: 'item-starfen-reed-cord', catalogRef: true },
            { id: 'item-starfen-bluekelp-extract', catalogRef: true },
            { id: 'item-starfen-marsh-poultice', catalogRef: true },
            { id: 'item-starfen-bogberry-tonic', catalogRef: true },
            { id: 'item-starfen-waterproof-wrap', catalogRef: true },
            { id: 'item-starfen-marsh-survey-kit', catalogRef: true },
        ],
        npcs: [
            { id: 'npc-mistmere-pelu-senn', catalogRef: true },
            { id: 'npc-mistmere-tavi-meren', catalogRef: true },
        ],
        npcSchedules: [
            { id: 'schedule-mistmere-pelu-senn', catalogRef: true },
            { id: 'schedule-mistmere-tavi-meren', catalogRef: true },
        ],
        recipes: [
            { id: 'process-starfen-reed-cord', catalogRef: true },
            { id: 'process-starfen-bluekelp-extract', catalogRef: true },
            { id: 'craft-starfen-marsh-poultice', catalogRef: true },
            { id: 'cook-starfen-bogberry-tonic', catalogRef: true },
            { id: 'craft-starfen-waterproof-wrap', catalogRef: true },
            { id: 'craft-starfen-marsh-survey-kit', catalogRef: true },
        ],
        capabilities: [
            { id: 'practical-starfen-current-reading', catalogRef: true },
        ],
        abilities: [
            { id: 'ability-starfen-current-reading', catalogRef: true },
        ],
        quests: [
            { id: 'commitment-mistmere-marsh-poultice', catalogRef: true },
            { id: 'commitment-mistmere-waterproof-wraps', catalogRef: true },
            { id: 'commitment-mistmere-bogberry-tonic', catalogRef: true },
            { id: 'commitment-mistmere-marsh-survey-kit', catalogRef: true },
        ],
    },
});

export const REGIONAL_CONTENT_PACKS = Object.freeze([
    SHARED_FOUNDATION_PACK,
    ELDERWOOD_PACK,
    ELDERWOOD_HUNT_TIMBER_PACK,
    SLATEWATER_WAYLODGE_PACK,
    REDSTONE_PACK,
    REDSTONE_FORGE_ROAD_PACK,
    STARFEN_PACK,
    STARFEN_MARSHCRAFT_PACK,
    ...REGIONAL_ECOLOGY_PACKS,
]);

export function listRegionalContentPacks() { return [...REGIONAL_CONTENT_PACKS]; }
export function getRegionalContentPack(packId) { return REGIONAL_CONTENT_PACKS.find((pack) => pack.id === packId) ?? null; }
