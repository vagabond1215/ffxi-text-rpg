import { getConnectionsFrom, getPlace, listPlaces } from './places.js';

export const POI_TYPES = Object.freeze({
    NPC: 'npc',
    VENDOR: 'vendor',
    SHOP: 'shop',
    GUILD: 'guild',
    MISSION: 'mission',
    QUEST: 'quest',
    STORAGE: 'storage',
    TRUST: 'trust',
    TRAVEL: 'travel',
    HOME_POINT: 'homePoint',
    ZONE_LINE: 'zoneLine',
    LANDMARK: 'landmark',
});

const POI_SEEDS = [
    poi('poi-sandoria-s-alaune', 'southern-sandoria', 'Alaune', POI_TYPES.NPC, 'G-10', ['tutorial'], 'Tutorial NPC'),
    poi('poi-sandoria-s-ambrotien', 'southern-sandoria', 'Ambrotien', POI_TYPES.MISSION, 'K-10', ['mission', 'sanDoria'], 'San d’Oria mission NPC'),
    poi('poi-sandoria-s-aravoge', 'southern-sandoria', 'Aravoge, T.K.', POI_TYPES.TRAVEL, 'F-10', ['conquest', 'gateGuard'], 'San d’Oria conquest guard'),
    poi('poi-sandoria-s-ashene', 'southern-sandoria', 'Ashene', POI_TYPES.VENDOR, 'K-7', ['weapons', 'shop'], 'Weapons vendor'),
    poi('poi-sandoria-s-aveline', 'southern-sandoria', 'Aveline', POI_TYPES.VENDOR, 'F-7', ['food', 'shop'], 'Food vendor'),
    poi('poi-sandoria-s-benaige', 'southern-sandoria', 'Benaige', POI_TYPES.VENDOR, 'F-7', ['food', 'shop'], 'Food vendor'),
    poi('poi-sandoria-s-capucine', 'southern-sandoria', 'Capucine', POI_TYPES.VENDOR, 'E-9', ['armor', 'shop'], 'Armor vendor'),
    poi('poi-sandoria-s-carautia', 'southern-sandoria', 'Carautia', POI_TYPES.VENDOR, 'K-8', ['armor', 'shop'], 'Armor vendor'),
    poi('poi-sandoria-s-faulpie', 'southern-sandoria', 'Faulpie', POI_TYPES.GUILD, 'E-8', ['tanning', 'guildMaster'], 'Tanning guild master'),
    poi('poi-sandoria-s-gondebaud', 'southern-sandoria', 'Gondebaud', POI_TYPES.TRUST, 'L-6', ['trust'], 'Trust NPC'),
    poi('poi-sandoria-s-corua', 'southern-sandoria', 'Corua', POI_TYPES.VENDOR, 'G-9', ['regionalVendor', 'ronfaure'], 'Regional vendor for Ronfaure'),
    poi('poi-sandoria-s-ferdoulemiont', 'southern-sandoria', 'Ferdoulemiont', POI_TYPES.VENDOR, 'I-11', ['standardVendor', 'shop'], 'Standard vendor'),

    poi('poi-sandoria-n-cheupirudaux', 'northern-sandoria', 'Cheupirudaux', POI_TYPES.GUILD, 'F-3', ['woodworking', 'guildMaster'], 'Woodworking guild master'),
    poi('poi-sandoria-n-amarefice', 'northern-sandoria', 'Amarefice', POI_TYPES.GUILD, 'E-3', ['woodworking', 'synthesisSupport'], 'Woodworking synthesis support'),
    poi('poi-sandoria-n-chaupire', 'northern-sandoria', 'Chaupire', POI_TYPES.GUILD, 'E-3', ['woodworking', 'guildVendor'], 'Woodworking guild vendor'),
    poi('poi-sandoria-n-mevreauche', 'northern-sandoria', 'Mevreauche', POI_TYPES.GUILD, 'E-6', ['blacksmithing', 'guildMaster'], 'Blacksmith guild master'),
    poi('poi-sandoria-n-doggomehr', 'northern-sandoria', 'Doggomehr', POI_TYPES.GUILD, 'E-5', ['blacksmithing', 'guildVendor'], 'Blacksmith guild vendor'),
    poi('poi-sandoria-n-arachagnon', 'northern-sandoria', 'Arachagnon', POI_TYPES.VENDOR, 'F-3', ['armor', 'shop'], 'Initial armor vendor'),
    poi('poi-sandoria-n-arlenne', 'northern-sandoria', 'Arlenne', POI_TYPES.VENDOR, 'E-4', ['weapons', 'shop'], 'Weapons vendor'),
    poi('poi-sandoria-n-elesca', 'northern-sandoria', 'Elesca', POI_TYPES.VENDOR, 'I-8', ['mapVendor'], 'Map vendor'),
    poi('poi-sandoria-n-grilau', 'northern-sandoria', 'Grilau', POI_TYPES.MISSION, 'C-8', ['mission', 'sanDoria'], 'San d’Oria mission NPC'),
    poi('poi-sandoria-n-jeanvirgaud', 'northern-sandoria', 'Jeanvirgaud', POI_TYPES.TRAVEL, 'L-10', ['outpostTeleporter'], 'Outpost teleporter'),

    poi('poi-bastok-markets-rabid-wolf', 'bastok-markets', 'Rabid Wolf, I.M.', POI_TYPES.TRAVEL, 'E-11', ['gateGuard', 'conquest'], 'Gate guard'),
    poi('poi-bastok-markets-brunhilde', 'bastok-markets', 'Brunhilde', POI_TYPES.VENDOR, 'F-10', ['armor', 'shop'], 'Armor vendor'),
    poi('poi-bastok-markets-ciqala', 'bastok-markets', 'Ciqala', POI_TYPES.VENDOR, 'F-10', ['weapons', 'shop'], 'Weapons merchant'),
    poi('poi-bastok-markets-peritrage', 'bastok-markets', 'Peritrage', POI_TYPES.VENDOR, 'F-10', ['weapons', 'shop'], 'Weapon vendor'),
    poi('poi-bastok-markets-zhikkom', 'bastok-markets', 'Zhikkom', POI_TYPES.VENDOR, 'F-10', ['weapons', 'shop'], 'Weapon vendor'),
    poi('poi-bastok-markets-carmelide', 'bastok-markets', 'Carmelide', POI_TYPES.VENDOR, 'I-8', ['items', 'shop'], 'Item vendor'),
    poi('poi-bastok-markets-olwyn', 'bastok-markets', 'Olwyn', POI_TYPES.VENDOR, 'E-11', ['items', 'shop'], 'Item vendor'),
    poi('poi-bastok-markets-reinberta', 'bastok-markets', 'Reinberta', POI_TYPES.GUILD, 'I-8', ['goldsmithing', 'guildMaster'], 'Goldsmithing guild master'),
    poi('poi-bastok-markets-teerth', 'bastok-markets', 'Teerth', POI_TYPES.GUILD, 'H-8', ['goldsmithing', 'guildVendor'], 'Goldsmithing guild vendor'),
    poi('poi-bastok-markets-karine', 'bastok-markets', 'Karine', POI_TYPES.VENDOR, 'H-9', ['mapVendor'], 'Map vendor'),
    poi('poi-bastok-markets-cleades', 'bastok-markets', 'Cleades', POI_TYPES.MISSION, 'D-11', ['mission', 'bastok'], 'Mission NPC'),

    poi('poi-bastok-mines-zeruhn-gate', 'bastok-mines', 'Zeruhn Mines Gate', POI_TYPES.ZONE_LINE, 'I-9', ['zoneConnection', 'zeruhnMines'], 'Passage toward Zeruhn Mines'),
    poi('poi-bastok-mines-gate-guard', 'bastok-mines', 'Bastok Mines Guard Post', POI_TYPES.TRAVEL, 'H-6', ['gateGuard', 'conquest'], 'Bastok guard post'),
    poi('poi-metalworks-cid', 'metalworks', 'Cid', POI_TYPES.QUEST, 'H-8', ['importantNpc', 'engineer', 'quest'], 'Important Bastok engineer'),
    poi('poi-metalworks-cornelia', 'metalworks', 'Cornelia', POI_TYPES.MISSION, 'K-8', ['mission', 'bastok'], 'Mission NPC'),
    poi('poi-metalworks-iron-eater', 'metalworks', 'Iron Eater', POI_TYPES.MISSION, 'J-8', ['mission', 'bastok'], 'Mission NPC'),
    poi('poi-metalworks-raibaht', 'metalworks', 'Raibaht', POI_TYPES.QUEST, 'G-8', ['quest', 'engineer'], 'Quest NPC'),
    poi('poi-port-bastok-travel-counter', 'port-bastok', 'Port Bastok Travel Counter', POI_TYPES.TRAVEL, 'K-7', ['travel', 'airshipFuture'], 'Port travel services placeholder'),
    poi('poi-port-bastok-shops', 'port-bastok', 'Port Bastok Shops', POI_TYPES.SHOP, 'F-6', ['shops'], 'Port shop cluster'),

    poi('poi-waters-baehu-faehu', 'windurst-waters', 'Baehu-Faehu', POI_TYPES.VENDOR, 'G-5', ['regionalVendor', 'sarutabaruta'], 'Regional vendor for Sarutabaruta'),
    poi('poi-waters-chomo-jinjahl', 'windurst-waters', 'Chomo Jinjahl', POI_TYPES.GUILD, 'E-8', ['cooking', 'guildMerchant'], 'Cooking guild merchant'),
    poi('poi-waters-dagoza-beruza', 'windurst-waters', 'Dagoza-Beruza', POI_TYPES.MISSION, 'F-5', ['mission', 'windurst'], 'Mission NPC'),
    poi('poi-waters-ensasa', 'windurst-waters', 'Ensasa', POI_TYPES.VENDOR, 'H-9', ['items', 'shop'], 'Sells various items'),
    poi('poi-waters-hilkomu-makimu', 'windurst-waters', 'Hilkomu-Makimu', POI_TYPES.VENDOR, 'G-7', ['items', 'shop'], 'Sells various items'),
    poi('poi-waters-dienger', 'windurst-waters', 'Dienger', POI_TYPES.NPC, 'F-5', ['melodyMinstrel'], 'Melody Minstrel'),
    poi('poi-waters-ephemeral-moogle', 'windurst-waters', 'Ephemeral Moogle', POI_TYPES.STORAGE, 'E-9', ['crystalStorage'], 'Crystal storage NPC'),

    poi('poi-woods-apururu', 'windurst-woods', 'Apururu', POI_TYPES.MISSION, 'H-9', ['importantNpc', 'mission', 'windurst'], 'Important Windurst NPC'),
    poi('poi-woods-east-gate', 'windurst-woods', 'East Sarutabaruta Gate', POI_TYPES.ZONE_LINE, 'K-10', ['zoneConnection', 'eastSarutabaruta'], 'Gate toward East Sarutabaruta'),
    poi('poi-walls-heavens-tower-gate', 'windurst-walls', 'Heavens Tower Gate', POI_TYPES.MISSION, 'H-7', ['mission', 'heavensTower'], 'Access to Heavens Tower'),
    poi('poi-port-windurst-travel-counter', 'port-windurst', 'Port Windurst Travel Counter', POI_TYPES.TRAVEL, 'M-6', ['travel', 'airshipFuture'], 'Port travel services placeholder'),
    poi('poi-heavens-tower-mission-desk', 'heavens-tower', 'Heavens Tower Mission Desk', POI_TYPES.MISSION, 'H-6', ['mission', 'windurst'], 'Windurst mission desk'),
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
    return POINTS_OF_INTEREST.filter((poi) => poi.placeId === placeId);
}

export function getPoisAtGrid(placeId, coordinate) {
    return getPoisForPlace(placeId).filter((poi) => poi.coordinate.x === coordinate.x && poi.coordinate.y === coordinate.y);
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
    if (!pois.length) return `No points of interest seeded for ${placeId}.`;
    return pois.map(describePoiLine).join('\n');
}

export function describeContextualPois(state) {
    const pois = getContextualPois(state);
    if (!pois.length) return 'No known points of interest at this grid.';
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
        type: POI_TYPES.ZONE_LINE,
        sourcePosition: 'connection-grid',
        coordinate: connection.departFrom ?? place.coordinateSystem.start,
        tags: ['zoneConnection', connection.to],
        notes: `Travel to ${getPlace(connection.to)?.name ?? connection.to}.`,
        actions: ['travel'],
    })));
}

function poi(id, placeId, name, type, sourcePosition, tags, notes) {
    return { id, placeId, name, type, sourcePosition, tags, notes };
}

function describePoiLine(poi) {
    return `${poi.name} [${poi.type}] grid (${poi.coordinate.x}, ${poi.coordinate.y}) source ${poi.sourcePosition} - ${poi.notes}`;
}

function inferActions(poi) {
    const actions = new Set(['talk']);
    if ([POI_TYPES.VENDOR, POI_TYPES.SHOP].includes(poi.type)) actions.add('shop');
    if (poi.type === POI_TYPES.GUILD) actions.add('guild');
    if ([POI_TYPES.MISSION, POI_TYPES.QUEST].includes(poi.type)) actions.add('quest');
    if ([POI_TYPES.TRAVEL, POI_TYPES.HOME_POINT, POI_TYPES.ZONE_LINE].includes(poi.type)) actions.add('travel');
    if (poi.type === POI_TYPES.STORAGE) actions.add('storage');
    if (poi.type === POI_TYPES.TRUST) actions.add('trust');
    return Array.from(actions);
}

function mapSourcePositionToGrid(placeId, sourcePosition) {
    const place = getPlace(placeId);
    if (!place || !sourcePosition || sourcePosition === 'connection-grid') return { x: 0, y: 0 };
    const match = String(sourcePosition).match(/([A-Z])-?(\d+)/i);
    if (!match) return place.coordinateSystem.start;

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
