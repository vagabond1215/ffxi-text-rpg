import { canonicalizeMapId } from './legacyIdentity.js';

export const MAP_DEFINITIONS = Object.freeze({
    mapThornwall: map({
        id: 'map-thornwall',
        name: 'Map of Thornwall',
        nation: 'Thornwall',
        region: 'Elderwood',
        placeIds: ['thornwall-southgate', 'thornwall-crownward', 'thornwall-rivergate', 'thornwall-high-citadel', 'thornwall-strider-yard', 'thornwall-old-gaol', 'skyferry-waymeet-thornwall'],
        notes: 'City map covering the currently seeded Thornwall districts and connected civic interiors.',
    }),
    mapElderwood: map({
        id: 'map-elderwood',
        name: 'Map of the Elderwood',
        nation: 'Thornwall',
        region: 'Elderwood',
        placeIds: ['west-elderwood', 'east-elderwood', 'timbercross-landing'],
        notes: 'Regional map for Thornwall’s managed forests, work roads, and surrounding wild routes.',
    }),
    mapEmberwashBadlands: map({
        id: 'map-emberwash-badlands',
        name: 'Cinderwell Survey of the Emberwash',
        nation: null,
        region: 'Emberwash Badlands',
        placeIds: ['emberwash-north-wash', 'cinderwell-station', 'emberwash-saltpan-verge'],
        notes: 'A caravan survey south of Redstone: maintained traffic reaches Cinderwell, while the marked foretrail continues through broken washes to the saltpan verge. Heat, dust, scarce water, gullies, and unstable crust are route hazards; no southern strait or Veyra route is implied.',
    }),
    mapGloamwood: map({
        id: 'map-gloamwood',
        name: 'Forester Survey of Gloamwood',
        nation: null,
        region: 'Gloamwood',
        placeIds: ['gloamwood-verge', 'oldbough-refuge', 'gloamwood-deep'],
        notes: 'A boundary-forester survey of the wet old-growth beyond West Elderwood: one maintained cart track reaches Oldbough Refuge, then a marked foot-and-mount trail continues into the deep forest. Ravines, flooded gullies, deadfall, and the uncharted western mountain approaches are barriers rather than implicit exits.',
    }),
    mapHeadwaterVale: map({
        id: 'map-headwater-vale',
        name: 'Survey of Headwater Vale',
        nation: 'Thornwall',
        region: 'Headwater Vale',
        placeIds: ['headwater-lower-vale', 'headwater-warden-lodge', 'headwater-upper-vale'],
        notes: 'River-warden survey of the young western drainage above Timbercross: maintained lower road and bridge crossings, the warden lodge at the wagon limit, and a marked upper trail toward meadow and plateau country. Side ridges and unbridged channels are barriers rather than automatic map edges.',
    }),
    mapWaymeetMarches: map({
        id: 'map-waymeet-marches', name: 'Cairnward Survey of the Waymeet South Marches', nation: null, region: 'Waymeet Marches',
        placeIds: ['windscar-saddle', 'cairnward-relay', 'waymeet-south-marches'],
        notes: 'A plateau-route survey continuing north from Headwater Vale through the exposed Windscar Saddle to Cairnward Relay and the first wagon-capable South March road. The survey stops before the inner marches and Waymeet; nearby envelopes do not imply an unrecorded road.',
    }),
    mapCrownfields: map({
        id: 'map-crownfields',
        name: 'Map of the Crownfields',
        nation: 'Thornwall',
        region: 'Crownfields',
        placeIds: ['crownfields', 'crownfields-grange'],
        notes: 'Regional map for Thornwall’s southern agricultural lowlands, including pasture, hedgerows, orchards, mill roads, and the Crownfields Grange market hamlet.',
    }),
    mapSlatewaterFoothills: map({
        id: 'map-slatewater-foothills',
        name: 'Map of Slatewater Foothills',
        nation: null,
        region: 'Slatewater Foothills',
        placeIds: ['slatewater-foothills', 'slatewater-waylodge'],
        notes: 'Regional map for the mixed-wood foothills, river-cut slopes, road passes, and neutral guild lodge between Timbercross and Brasshaven.',
    }),
    mapRedfangCamp: map({
        id: 'map-redfang-camp',
        name: 'Sketch of Redfang Camp',
        nation: null,
        region: 'Elderwood',
        placeIds: ['redfang-camp'],
        notes: 'A rough expedition map for the fortified raider camp beyond the western forest.',
    }),
    mapBrasshaven: map({
        id: 'map-brasshaven',
        name: 'Map of Brasshaven',
        nation: 'Brasshaven',
        region: 'Redstone Reach',
        placeIds: ['brasshaven-market-ring', 'brasshaven-delvers-ward', 'brasshaven-iron-quay', 'brasshaven-foundry-hall'],
        notes: 'City map covering Brasshaven’s primary commercial, industrial, mining, and freight districts.',
    }),
    mapRedstoneReach: map({
        id: 'map-redstone-reach',
        name: 'Map of Redstone Reach',
        nation: 'Brasshaven',
        region: 'Redstone Reach',
        placeIds: ['south-redstone-reach', 'north-redstone-reach'],
        notes: 'Regional map for the dry uplands, quarry roads, mine routes, and caravan approaches around Brasshaven.',
    }),
    mapIronspineHighlands: map({
        id: 'map-ironspine-highlands',
        name: 'Survey of the Ironspine Highlands',
        nation: 'Brasshaven',
        region: 'Ironspine Highlands',
        placeIds: ['ironspine-lower-pass', 'ironspine-watchpost', 'ironspine-high-meadow'],
        notes: 'A survey map of the maintained lower pass, high-pass watchpost, and the marked alpine trail into upper meadow and scree country. Broad cliff and unstable scree bands are barriers, not walkable map edges.',
    }),
    mapCoppergrassSteppe: map({
        id: 'map-coppergrass-steppe',
        name: 'Map of Coppergrass Steppe',
        nation: null,
        region: 'Coppergrass Steppe',
        placeIds: ['coppergrass-steppe'],
        notes: 'Regional map for the neutral steppe corridor between Redstone Reach and Starfen, centered on the Forge-Mere Long Road and its seasonal drainage basins.',
    }),
    mapDeepveinMine: map({
        id: 'map-deepvein-mine',
        name: 'Survey of Deepvein Mine',
        nation: 'Brasshaven',
        region: 'Redstone Reach',
        placeIds: ['deepvein-mine'],
        notes: 'Mine survey covering the currently accessible Deepvein galleries.',
    }),
    mapLowerDeepvein: map({
        id: 'map-lower-deepvein',
        name: 'Survey of Lower Deepvein',
        nation: 'Brasshaven',
        region: 'Lower Deepvein',
        placeIds: ['deepvein-lower-decline', 'lantern-sump-station', 'lower-deepvein-echoing-shelf'],
        notes: 'A delvers’ survey of the maintained decline below Deepvein Mine, Lantern Sump Station, and the marked foot traverse to Echoing Shelf. Darkness, seep water, broken galleries, and cavern ledges are route hazards; no farther deep-road or Korren route is implied.',
    }),
    mapMistmere: map({
        id: 'map-mistmere',
        name: 'Map of Mistmere',
        nation: 'Mistmere',
        region: 'Starfen',
        placeIds: ['mistmere-canal-ward', 'mistmere-spire-ward', 'mistmere-garden-ward', 'mistmere-reedport', 'mistmere-observatory'],
        notes: 'City map covering Mistmere’s canal, scholastic, garden, port, and observatory districts.',
    }),
    mapStarfen: map({
        id: 'map-starfen',
        name: 'Map of the Starfen',
        nation: 'Mistmere',
        region: 'Starfen',
        placeIds: ['west-starfen', 'east-starfen'],
        notes: 'Regional map for the marsh-grassland paths, reed routes, and gathering grounds surrounding Mistmere.',
    }),
    mapGreatMere: map({
        id: 'map-great-mere',
        name: 'Chart of the Great Mere',
        nation: 'Mistmere',
        region: 'Great Mere',
        placeIds: ['great-mere-westshore', 'merewatch-landing', 'reedcrown-isle'],
        notes: 'Freshwater chart covering the western shore, Merewatch fishery landing, marked boat channels, shoals, and Reedcrown nesting island. Open water is route-travel terrain, not a walkable map edge.',
    }),
    mapStarfenDelta: map({
        id: 'map-starfen-delta',
        name: 'Chart of the Starfen Delta and Brackish Coast',
        nation: 'Mistmere',
        region: 'Starfen Delta',
        placeIds: ['starfen-lower-delta', 'tideglass-landing', 'starfen-brackish-coast'],
        notes: 'Pilot chart of the Great Mere outflow, lower distributaries, Tideglass Landing, salt marsh, tidal flats, and exposed eastern strand. Channels and open sea are route-travel water, not walkable adjacency.',
    }),
    mapSunkenArchive: map({
        id: 'map-sunken-archive',
        name: 'Plan of the Sunken Archive',
        nation: 'Mistmere',
        region: 'Starfen',
        placeIds: ['sunken-archive'],
        notes: 'Partial plan of the half-submerged ruin currently accessible from East Starfen.',
    }),
});

export function getMap(mapId) {
    const canonicalId = canonicalizeMapId(mapId);
    return Object.values(MAP_DEFINITIONS).find((item) => item.id === canonicalId) ?? null;
}

export function listMaps() {
    return Object.values(MAP_DEFINITIONS);
}

export function describeMaps() {
    return listMaps()
        .map((item) => `${item.id} - ${item.name} [${item.region}] places=${item.placeIds.length}`)
        .join('\n');
}

export function describeMap(mapId) {
    const item = getMap(mapId);
    if (!item) return `Unknown map: ${mapId}`;

    return [
        item.name,
        `Region: ${item.region}`,
        `Nation: ${item.nation ?? 'none'}`,
        item.notes,
        '',
        'Places:',
        ...item.placeIds.map((placeId) => `- ${placeId}`),
    ].join('\n');
}

function map(definition) {
    return Object.freeze({
        nation: null,
        notes: '',
        ...definition,
    });
}
