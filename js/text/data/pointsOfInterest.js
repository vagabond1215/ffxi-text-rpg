import { coordinateKey, describeCoordinate, isTopologyPlace, normalizeCoordinate } from './coordinates.js';
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

// Legacy-shaped POI stable IDs are temporarily retained as compatibility keys for
// shop/quest/guild hooks. Player-facing names and descriptions are canonical
// Hearth & Horizon content; later schema work can migrate the remaining IDs atomically.
const POI_SEEDS = [
    poi('poi-sandoria-s-alaune', 'thornwall-southgate', 'Mara Venn', POI_TYPES.NPC, 'G-10', ['tutorial'], 'Newcomer guide and Southgate orientation contact'),
    poi('poi-sandoria-s-ambrotien', 'thornwall-southgate', 'Oren Vale', POI_TYPES.MISSION, 'K-10', ['mission', 'thornwall'], 'Thornwall civic commission clerk'),
    poi('poi-sandoria-s-aravoge', 'thornwall-southgate', 'Warden Halric Dane', POI_TYPES.TRAVEL, 'F-10', ['realm', 'gateGuard'], 'Thornwall road warden'),
    poi('poi-sandoria-s-ashene', 'thornwall-southgate', 'Sella Thorn', POI_TYPES.VENDOR, 'K-7', ['weapons', 'shop'], 'Weapons vendor'),
    poi('poi-sandoria-s-aveline', 'thornwall-southgate', 'Mira Fen', POI_TYPES.VENDOR, 'F-7', ['food', 'shop'], 'Prepared food vendor'),
    poi('poi-sandoria-s-benaige', 'thornwall-southgate', 'Orren Pike', POI_TYPES.VENDOR, 'F-7', ['food', 'shop'], 'Travel provisions vendor'),
    poi('poi-sandoria-s-capucine', 'thornwall-southgate', 'Bria Holt', POI_TYPES.VENDOR, 'E-9', ['armor', 'shop'], 'Armor vendor'),
    poi('poi-sandoria-s-carautia', 'thornwall-southgate', 'Tamsin Reed', POI_TYPES.VENDOR, 'K-8', ['armor', 'shop'], 'Protective gear vendor'),
    poi('poi-sandoria-s-faulpie', 'thornwall-southgate', 'Edrin Bale', POI_TYPES.GUILD, 'E-8', ['tanning', 'guildMaster'], 'Tanning guild master'),
    poi('poi-sandoria-s-gondebaud', 'thornwall-southgate', 'Rowan Greymark', POI_TYPES.TRUST, 'L-6', ['companion'], 'Potential future companion contact'),
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

    poi('poi-bastok-markets-rabid-wolf', 'brasshaven-market-ring', 'Marshal Varric Stone', POI_TYPES.TRAVEL, 'E-11', ['gateGuard', 'realm'], 'Market Ring gate marshal'),
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

    poi('poi-bastok-mines-zeruhn-gate', 'brasshaven-delvers-ward', 'Deepvein Mine Gate', POI_TYPES.ZONE_LINE, 'I-9', ['zoneConnection', 'deepveinMine'], 'Passage toward Deepvein Mine'),
    poi('poi-bastok-mines-gate-guard', 'brasshaven-delvers-ward', 'Delvers’ Ward Watch', POI_TYPES.TRAVEL, 'H-6', ['gateGuard', 'realm'], 'Brasshaven watch post'),
    poi('poi-metalworks-cid', 'brasshaven-foundry-hall', 'Master Engineer Caldris', POI_TYPES.QUEST, 'H-8', ['importantNpc', 'engineer', 'quest'], 'Senior Brasshaven engineer and project contact'),
    poi('poi-metalworks-cornelia', 'brasshaven-foundry-hall', 'Envoy Tessa Mar', POI_TYPES.MISSION, 'K-8', ['mission', 'brasshaven'], 'Civic commission contact'),
    poi('poi-metalworks-iron-eater', 'brasshaven-foundry-hall', 'Captain Brannic Voss', POI_TYPES.MISSION, 'J-8', ['mission', 'brasshaven'], 'Foundry guard and military commission contact'),
    poi('poi-metalworks-raibaht', 'brasshaven-foundry-hall', 'Gearwright Noll', POI_TYPES.QUEST, 'G-8', ['quest', 'engineer'], 'Workshop project and repair contact'),
    poi('poi-port-bastok-travel-counter', 'brasshaven-iron-quay', 'Iron Quay Transit Office', POI_TYPES.TRAVEL, 'K-7', ['travel', 'futureTransit'], 'Port and caravan travel services placeholder'),
    poi('poi-port-bastok-shops', 'brasshaven-iron-quay', 'Iron Quay Exchange', POI_TYPES.SHOP, 'F-6', ['shops'], 'Quayside shop cluster'),

    poi('poi-waters-baehu-faehu', 'mistmere-canal-ward', 'Pelu Senn', POI_TYPES.VENDOR, 'G-5', ['regionalVendor', 'starfen'], 'Regional vendor for Starfen goods'),
    poi('poi-waters-chomo-jinjahl', 'mistmere-canal-ward', 'Tavi Meren', POI_TYPES.GUILD, 'E-8', ['cooking', 'guildMerchant'], 'Culinary guild merchant'),
    poi('poi-waters-dagoza-beruza', 'mistmere-canal-ward', 'Reader Soli Venn', POI_TYPES.MISSION, 'F-5', ['mission', 'mistmere'], 'Mistmere civic commission contact'),
    poi('poi-waters-ensasa', 'mistmere-canal-ward', 'Nemi Vale', POI_TYPES.VENDOR, 'H-9', ['items', 'shop'], 'Canal-market goods vendor'),
    poi('poi-waters-hilkomu-makimu', 'mistmere-canal-ward', 'Kiri Fen', POI_TYPES.VENDOR, 'G-7', ['items', 'shop'], 'Herbs and practical supplies vendor'),
    poi('poi-waters-dienger', 'mistmere-canal-ward', 'Perrin Reed', POI_TYPES.NPC, 'F-5', ['minstrel'], 'Traveling minstrel'),
    poi('poi-waters-ephemeral-moogle', 'mistmere-canal-ward', 'Lantern Keeper Sivi', POI_TYPES.STORAGE, 'E-9', ['specialStorage'], 'Lodging and secure-storage service contact'),

    poi('poi-woods-apururu', 'mistmere-garden-ward', 'Curator Lessa Rain', POI_TYPES.MISSION, 'H-9', ['importantNpc', 'mission', 'mistmere'], 'Important Mistmere garden-ward civic contact'),
    poi('poi-woods-east-gate', 'mistmere-garden-ward', 'East Starfen Gate', POI_TYPES.ZONE_LINE, 'K-10', ['zoneConnection', 'eastStarfen'], 'Gate toward East Starfen'),
    poi('poi-walls-heavens-tower-gate', 'mistmere-spire-ward', 'Observatory Gate', POI_TYPES.MISSION, 'H-7', ['mission', 'observatory'], 'Access to Mistmere Observatory'),
    poi('poi-port-windurst-travel-counter', 'mistmere-reedport', 'Reedport Transit House', POI_TYPES.TRAVEL, 'M-6', ['travel', 'futureTransit'], 'Regional travel services placeholder'),
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
    if (!pois.length) return 'No known points of interest at this coordinate.';
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
    return `${poi.name} [${poi.type}] coordinate ${describeCoordinate(poi.coordinate)} source ${poi.sourcePosition} - ${poi.notes}`;
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
