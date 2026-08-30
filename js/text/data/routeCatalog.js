import { isNavigableCoordinate, isTopologyPlace } from './coordinates.js';
import { getMap } from './maps.js';
import { getPlace, isCoordinateInsidePlace } from './places.js';

export const ROUTE_CATALOG_VERSION = 9;
export const ROUTE_TYPES = Object.freeze(['road', 'track', 'causeway', 'caravanRoad', 'waterway']);
export const ROUTE_TRAVEL_MODES = Object.freeze(['walk', 'caravan', 'coach', 'wagon', 'ferry', 'mount']);

const ROUTE_DEFINITIONS = Object.freeze({
    'route-thornwall-crownfields-road': route({
        id: 'route-thornwall-crownfields-road',
        name: 'Southfield Farm Road',
        type: 'road',
        allowedModes: ['walk', 'mount', 'wagon', 'caravan'],
        stops: [
            stop('stop-thornwall-southgate-crownfields', 'thornwall-southgate'),
            stop('stop-crownfields-grange-north-road', 'crownfields-grange', { x: 2, y: 2 }),
        ],
        segments: [segment('stop-thornwall-southgate-crownfields', 'stop-crownfields-grange-north-road', 3600, 9000, ['farm-traffic', 'seasonal-mud', 'livestock-crossing'])],
        bidirectional: true,
        knowledge: { mapId: 'map-crownfields', discoveryTag: 'route.southfield-farm-road' },
        cargo: { encumbranceMultiplier: 1.05 },
    }),
    'route-thornwall-west-elderwood-road': route({
        id: 'route-thornwall-west-elderwood-road',
        name: 'Southgate Forest Road',
        type: 'road',
        allowedModes: ['walk', 'mount', 'wagon'],
        stops: [
            stop('stop-thornwall-southgate-west-road', 'thornwall-southgate', { levelId: 'main', coord: 'F-10' }),
            stop('stop-west-elderwood-east-road', 'west-elderwood', { x: 4, y: 7 }),
        ],
        segments: [segment('stop-thornwall-southgate-west-road', 'stop-west-elderwood-east-road', 1800, 4200, ['wildlife', 'roadside-raiders'])],
        bidirectional: true,
        knowledge: { mapId: 'map-elderwood', discoveryTag: 'route.southgate-forest-road' },
        cargo: { encumbranceMultiplier: 1 },
    }),
    'route-thornwall-timbercross-road': route({
        id: 'route-thornwall-timbercross-road',
        name: 'Timbercross Work Road',
        type: 'road',
        allowedModes: ['walk', 'mount', 'wagon', 'caravan'],
        stops: [
            stop('stop-thornwall-crownward-north-road', 'thornwall-crownward', { levelId: 'main', coord: 'F-5' }),
            stop('stop-timbercross-landing-south-road', 'timbercross-landing', { levelId: 'main', coord: 'G-7' }),
        ],
        segments: [segment('stop-thornwall-crownward-north-road', 'stop-timbercross-landing-south-road', 3600, 9000, ['forest-weather', 'fallen-timber'])],
        bidirectional: true,
        knowledge: { mapId: 'map-elderwood', discoveryTag: 'route.timbercross-work-road' },
        cargo: { encumbranceMultiplier: 1.05 },
    }),
    'route-brasshaven-south-redstone-road': route({
        id: 'route-brasshaven-south-redstone-road',
        name: 'South Quarry Road',
        type: 'road',
        allowedModes: ['walk', 'mount', 'wagon', 'caravan'],
        stops: [
            stop('stop-brasshaven-market-south-road', 'brasshaven-market-ring', { x: 2, y: 4 }),
            stop('stop-south-redstone-north-road', 'south-redstone-reach', { x: 4, y: 1 }),
        ],
        segments: [segment('stop-brasshaven-market-south-road', 'stop-south-redstone-north-road', 2400, 6500, ['heat', 'quarry-traffic'])],
        bidirectional: true,
        knowledge: { mapId: 'map-redstone-reach', discoveryTag: 'route.south-quarry-road' },
        cargo: { encumbranceMultiplier: 1.1 },
    }),
    'route-emberwash-cinderwell-caravan-road': route({
        id: 'route-emberwash-cinderwell-caravan-road',
        name: 'Cinderwell Caravan Road',
        type: 'caravanRoad',
        allowedModes: ['walk', 'mount', 'wagon', 'caravan'],
        stops: [
            stop('stop-south-redstone-emberwash-road', 'south-redstone-reach', { x: 4, y: 7 }),
            stop('stop-emberwash-north-wash-road', 'emberwash-north-wash', { x: 4, y: 1 }),
            stop('stop-cinderwell-caravan-road', 'cinderwell-station', { x: 3, y: 3 }),
        ],
        segments: [
            segment('stop-south-redstone-emberwash-road', 'stop-emberwash-north-wash-road', 3000, 7500, ['heat', 'dust', 'loose-stone', 'flash-flood-wash']),
            segment('stop-emberwash-north-wash-road', 'stop-cinderwell-caravan-road', 2400, 6000, ['heat', 'dust', 'scarce-shade', 'wash-crossing']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-emberwash-badlands', discoveryTag: 'route.emberwash-cinderwell-caravan-road' },
        cargo: { encumbranceMultiplier: 1.2 },
    }),
    'route-emberwash-saltpan-foretrail': route({
        id: 'route-emberwash-saltpan-foretrail',
        name: 'Saltpan Foretrail',
        type: 'track',
        allowedModes: ['walk', 'mount', 'caravan'],
        stops: [
            stop('stop-cinderwell-saltpan-foretrail', 'cinderwell-station', { x: 3, y: 5 }),
            stop('stop-emberwash-saltpan-foretrail', 'emberwash-saltpan-verge', { x: 4, y: 1 }),
        ],
        segments: [
            segment('stop-cinderwell-saltpan-foretrail', 'stop-emberwash-saltpan-foretrail', 3600, 8000, ['heat', 'salt-glare', 'dust-wind', 'soft-crust', 'scarce-water', 'broken-gullies']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-emberwash-badlands', discoveryTag: 'route.emberwash-saltpan-foretrail' },
        cargo: { encumbranceMultiplier: 1.3 },
    }),
    'route-lower-deepvein-haulage-decline': route({
        id: 'route-lower-deepvein-haulage-decline',
        name: 'Lower Deepvein Haulage Decline',
        type: 'track',
        allowedModes: ['walk'],
        stops: [
            stop('stop-deepvein-mine-lower-decline', 'deepvein-mine', { x: 3, y: 0 }),
            stop('stop-lower-deepvein-decline-haulage', 'deepvein-lower-decline', { x: 4, y: 7 }),
            stop('stop-lantern-sump-haulage', 'lantern-sump-station', { x: 3, y: 5 }),
        ],
        segments: [
            segment('stop-deepvein-mine-lower-decline', 'stop-lower-deepvein-decline-haulage', 1800, 2500, ['darkness', 'steep-grade', 'slick-stone', 'timbered-gallery']),
            segment('stop-lower-deepvein-decline-haulage', 'stop-lantern-sump-haulage', 1500, 2000, ['darkness', 'seep-crossing', 'loose-rock', 'narrow-gallery']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-lower-deepvein', discoveryTag: 'route.lower-deepvein-haulage-decline' },
        cargo: { encumbranceMultiplier: 1.5 },
    }),
    'route-lower-deepvein-echoing-shelf': route({
        id: 'route-lower-deepvein-echoing-shelf',
        name: 'Echoing Shelf Traverse',
        type: 'track',
        allowedModes: ['walk'],
        stops: [
            stop('stop-lantern-sump-echoing-shelf', 'lantern-sump-station', { x: 3, y: 0 }),
            stop('stop-lower-deepvein-echoing-shelf', 'lower-deepvein-echoing-shelf', { x: 4, y: 7 }),
        ],
        segments: [
            segment('stop-lantern-sump-echoing-shelf', 'stop-lower-deepvein-echoing-shelf', 2700, 3500, ['darkness', 'narrow-ledge', 'black-water-pools', 'low-ceiling', 'broken-gallery', 'loose-stone']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-lower-deepvein', discoveryTag: 'route.lower-deepvein-echoing-shelf' },
        cargo: { encumbranceMultiplier: 1.6 },
    }),
    'route-mistmere-west-starfen-causeway': route({
        id: 'route-mistmere-west-starfen-causeway',
        name: 'West Fen Causeway',
        type: 'causeway',
        allowedModes: ['walk', 'mount', 'wagon'],
        stops: [
            stop('stop-mistmere-reedport-west-causeway', 'mistmere-reedport', { x: 0, y: 2 }),
            stop('stop-west-starfen-east-causeway', 'west-starfen', { x: 7, y: 4 }),
        ],
        segments: [segment('stop-mistmere-reedport-west-causeway', 'stop-west-starfen-east-causeway', 2100, 5200, ['flooded-track', 'marsh-wildlife'])],
        bidirectional: true,
        knowledge: { mapId: 'map-starfen', discoveryTag: 'route.west-fen-causeway' },
        cargo: { encumbranceMultiplier: 1.15 },
    }),
    'route-crown-forge-caravan-road': route({
        id: 'route-crown-forge-caravan-road',
        name: 'Crown-Forge Caravan Road',
        type: 'caravanRoad',
        allowedModes: ['walk', 'caravan', 'wagon', 'mount'],
        stops: [
            stop('stop-thornwall-rivergate-caravan', 'thornwall-rivergate'),
            stop('stop-timbercross-landing-caravan', 'timbercross-landing'),
            stop('stop-slatewater-waylodge-caravan', 'slatewater-waylodge', { x: 2, y: 2 }),
            stop('stop-brasshaven-iron-quay-caravan', 'brasshaven-iron-quay'),
        ],
        segments: [
            segment('stop-thornwall-rivergate-caravan', 'stop-timbercross-landing-caravan', 7200, 18000, ['forest-weather', 'roadside-raiders']),
            segment('stop-timbercross-landing-caravan', 'stop-slatewater-waylodge-caravan', 7200, 18000, ['forest-weather', 'river-crossings', 'fallen-rock', 'roadside-raiders']),
            segment('stop-slatewater-waylodge-caravan', 'stop-brasshaven-iron-quay-caravan', 7200, 18000, ['upland-weather', 'steep-grades', 'fallen-rock', 'roadside-raiders']),
        ],
        bidirectional: true,
        knowledge: { mapId: null, discoveryTag: 'route.crown-forge-caravan-road' },
        cargo: { encumbranceMultiplier: 1.4 },
    }),
    'route-gloamwood-oldgrowth-cart-track': route({
        id: 'route-gloamwood-oldgrowth-cart-track',
        name: 'Oldgrowth Cart Track',
        type: 'track',
        allowedModes: ['walk', 'mount', 'wagon'],
        stops: [
            stop('stop-west-elderwood-gloamwood-track', 'west-elderwood', { x: 0, y: 4 }),
            stop('stop-gloamwood-verge-cart-track', 'gloamwood-verge', { x: 8, y: 4 }),
            stop('stop-oldbough-refuge-cart-track', 'oldbough-refuge', { x: 5, y: 3 }),
        ],
        segments: [
            segment('stop-west-elderwood-gloamwood-track', 'stop-gloamwood-verge-cart-track', 3000, 7000, ['forest-weather', 'root-heave', 'fallen-timber', 'seasonal-mud']),
            segment('stop-gloamwood-verge-cart-track', 'stop-oldbough-refuge-cart-track', 2400, 5000, ['deep-mud', 'root-heave', 'fallen-timber', 'narrow-track']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-gloamwood', discoveryTag: 'route.gloamwood-oldgrowth-cart-track' },
        cargo: { encumbranceMultiplier: 1.35 },
    }),
    'route-gloamwood-deepwood-forester-trail': route({
        id: 'route-gloamwood-deepwood-forester-trail',
        name: 'Deepwood Forester Trail',
        type: 'track',
        allowedModes: ['walk', 'mount'],
        stops: [
            stop('stop-oldbough-refuge-deepwood-trail', 'oldbough-refuge', { x: 0, y: 3 }),
            stop('stop-gloamwood-deep-forester-trail', 'gloamwood-deep', { x: 8, y: 4 }),
        ],
        segments: [
            segment('stop-oldbough-refuge-deepwood-trail', 'stop-gloamwood-deep-forester-trail', 3600, 7000, ['ravines', 'flooded-gullies', 'deadfall', 'root-tangles', 'low-visibility']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-gloamwood', discoveryTag: 'route.gloamwood-deepwood-forester-trail' },
        cargo: { encumbranceMultiplier: 1.55 },
    }),
    'route-timbercross-headwater-road': route({
        id: 'route-timbercross-headwater-road',
        name: 'Headwater River Road',
        type: 'road',
        allowedModes: ['walk', 'mount', 'wagon'],
        stops: [
            stop('stop-timbercross-headwater-road', 'timbercross-landing'),
            stop('stop-headwater-lower-vale-road', 'headwater-lower-vale', { x: 4, y: 7 }),
            stop('stop-headwater-warden-lodge-road', 'headwater-warden-lodge', { x: 3, y: 5 }),
        ],
        segments: [
            segment('stop-timbercross-headwater-road', 'stop-headwater-lower-vale-road', 2800, 7000, ['river-fog', 'seasonal-mud', 'bridge-crossing', 'fallen-timber']),
            segment('stop-headwater-lower-vale-road', 'stop-headwater-warden-lodge-road', 2000, 5000, ['ford-crossing', 'river-weather', 'steep-grade']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-headwater-vale', discoveryTag: 'route.headwater-river-road' },
        cargo: { encumbranceMultiplier: 1.2 },
    }),
    'route-headwater-upper-trail': route({
        id: 'route-headwater-upper-trail',
        name: 'Headwater Upper Trail',
        type: 'track',
        allowedModes: ['walk', 'mount'],
        stops: [
            stop('stop-headwater-warden-lodge-upper-trail', 'headwater-warden-lodge', { x: 3, y: 0 }),
            stop('stop-headwater-upper-vale-trail', 'headwater-upper-vale', { x: 4, y: 7 }),
        ],
        segments: [
            segment('stop-headwater-warden-lodge-upper-trail', 'stop-headwater-upper-vale-trail', 2800, 7000, ['rocky-ford', 'spring-flood', 'steep-side-ridges', 'fallen-timber']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-headwater-vale', discoveryTag: 'route.headwater-upper-trail' },
        cargo: { encumbranceMultiplier: 1.35 },
    }),
    'route-forge-mere-caravan-road': route({
        id: 'route-forge-mere-caravan-road',
        name: 'Forge-Mere Long Road',
        type: 'caravanRoad',
        allowedModes: ['walk', 'caravan', 'wagon', 'mount'],
        stops: [
            stop('stop-brasshaven-iron-quay-eastbound', 'brasshaven-iron-quay'),
            stop('stop-coppergrass-long-road', 'coppergrass-steppe', { x: 5, y: 4 }),
            stop('stop-mistmere-reedport-westbound', 'mistmere-reedport'),
        ],
        segments: [
            segment('stop-brasshaven-iron-quay-eastbound', 'stop-coppergrass-long-road', 9000, 22500, ['upland-weather', 'crosswind', 'grassfire', 'roadside-raiders']),
            segment('stop-coppergrass-long-road', 'stop-mistmere-reedport-westbound', 9000, 22500, ['seasonal-flood', 'fen-weather', 'roadside-raiders']),
        ],
        bidirectional: true,
        knowledge: { mapId: null, discoveryTag: 'route.forge-mere-long-road' },
        cargo: { encumbranceMultiplier: 1.4 },
    }),
    'route-redstone-ironspine-pass-road': route({
        id: 'route-redstone-ironspine-pass-road',
        name: 'Ironspine Lower Pass Road',
        type: 'road',
        allowedModes: ['walk', 'mount', 'wagon'],
        stops: [
            stop('stop-north-redstone-ironspine-road', 'north-redstone-reach', { x: 4, y: 0 }),
            stop('stop-ironspine-lower-pass-road', 'ironspine-lower-pass', { x: 4, y: 7 }),
            stop('stop-ironspine-watchpost-road', 'ironspine-watchpost', { x: 3, y: 5 }),
        ],
        segments: [
            segment('stop-north-redstone-ironspine-road', 'stop-ironspine-lower-pass-road', 3600, 8000, ['steep-grade', 'falling-rock', 'cold-weather']),
            segment('stop-ironspine-lower-pass-road', 'stop-ironspine-watchpost-road', 1800, 4000, ['switchbacks', 'fog', 'cold-weather']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-ironspine-highlands', discoveryTag: 'route.ironspine-lower-pass-road' },
        cargo: { encumbranceMultiplier: 1.35 },
    }),
    'route-ironspine-high-trail': route({
        id: 'route-ironspine-high-trail',
        name: 'Ironspine High Trail',
        type: 'track',
        allowedModes: ['walk', 'mount'],
        stops: [
            stop('stop-ironspine-watchpost-high-trail', 'ironspine-watchpost', { x: 3, y: 0 }),
            stop('stop-ironspine-high-meadow-trail', 'ironspine-high-meadow', { x: 4, y: 7 }),
        ],
        segments: [
            segment('stop-ironspine-watchpost-high-trail', 'stop-ironspine-high-meadow-trail', 2400, 5000, ['scree', 'cliff-exposure', 'cold-weather', 'whiteout']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-ironspine-highlands', discoveryTag: 'route.ironspine-high-trail' },
        cargo: { encumbranceMultiplier: 1.5 },
    }),
    'route-east-starfen-lower-delta-levee': route({
        id: 'route-east-starfen-lower-delta-levee',
        name: 'East Fen Delta Levee',
        type: 'track',
        allowedModes: ['walk', 'mount'],
        stops: [
            stop('stop-east-starfen-delta-levee', 'east-starfen', { x: 7, y: 4 }),
            stop('stop-starfen-lower-delta-west-levee', 'starfen-lower-delta', { x: 0, y: 4 }),
        ],
        segments: [
            segment('stop-east-starfen-delta-levee', 'stop-starfen-lower-delta-west-levee', 3200, 8000, ['reed-channels', 'soft-levee', 'seasonal-flood', 'fen-weather']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-starfen-delta', discoveryTag: 'route.east-fen-delta-levee' },
        cargo: { encumbranceMultiplier: 1.3 },
    }),
    'route-great-mere-delta-waterway': route({
        id: 'route-great-mere-delta-waterway',
        name: 'Mere-Delta Waterway',
        type: 'waterway',
        allowedModes: ['ferry'],
        stops: [
            stop('stop-merewatch-delta-packet', 'merewatch-landing', { x: 4, y: 3 }),
            stop('stop-starfen-lower-delta-waterway', 'starfen-lower-delta', { x: 4, y: 7 }),
            stop('stop-tideglass-delta-packet', 'tideglass-landing', { x: 1, y: 3 }),
        ],
        segments: [
            segment('stop-merewatch-delta-packet', 'stop-starfen-lower-delta-waterway', 3600, 12000, ['lake-weather', 'shallow-bars', 'river-current']),
            segment('stop-starfen-lower-delta-waterway', 'stop-tideglass-delta-packet', 2400, 8000, ['distributary-channels', 'mud-banks', 'tide-turn']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-starfen-delta', discoveryTag: 'route.mere-delta-waterway' },
        cargo: { encumbranceMultiplier: 1.25 },
    }),
    'route-tideglass-brackish-coast-track': route({
        id: 'route-tideglass-brackish-coast-track',
        name: 'Tideglass Coast Track',
        type: 'track',
        allowedModes: ['walk', 'mount'],
        stops: [
            stop('stop-tideglass-coast-track', 'tideglass-landing', { x: 5, y: 3 }),
            stop('stop-starfen-brackish-coast-track', 'starfen-brackish-coast', { x: 0, y: 4 }),
        ],
        segments: [
            segment('stop-tideglass-coast-track', 'stop-starfen-brackish-coast-track', 2400, 6000, ['tidal-cut', 'mudflat', 'saltwind', 'high-water']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-starfen-delta', discoveryTag: 'route.tideglass-coast-track' },
        cargo: { encumbranceMultiplier: 1.25 },
    }),
    'route-starfen-great-mere-shore': route({
        id: 'route-starfen-great-mere-shore',
        name: 'East Fen Shore Track',
        type: 'track',
        allowedModes: ['walk', 'mount'],
        stops: [
            stop('stop-east-starfen-mere-track', 'east-starfen', { x: 7, y: 4 }),
            stop('stop-great-mere-westshore-track', 'great-mere-westshore', { x: 0, y: 4 }),
            stop('stop-merewatch-shore-track', 'merewatch-landing', { x: 1, y: 3 }),
        ],
        segments: [
            segment('stop-east-starfen-mere-track', 'stop-great-mere-westshore-track', 3600, 9000, ['seasonal-flood', 'reed-channels', 'lake-weather']),
            segment('stop-great-mere-westshore-track', 'stop-merewatch-shore-track', 1200, 3000, ['shore-mud', 'lake-weather']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-great-mere', discoveryTag: 'route.east-fen-shore-track' },
        cargo: { encumbranceMultiplier: 1.15 },
    }),
    'route-mistmere-great-mere-waterway': route({
        id: 'route-mistmere-great-mere-waterway',
        name: 'Reedport-Mere Waterway',
        type: 'waterway',
        allowedModes: ['ferry'],
        stops: [
            stop('stop-mistmere-reedport-mere-ferry', 'mistmere-reedport', { x: 4, y: 2 }),
            stop('stop-merewatch-ferry', 'merewatch-landing', { x: 4, y: 3 }),
            stop('stop-reedcrown-isle-ferry', 'reedcrown-isle', { x: 3, y: 5 }),
        ],
        segments: [
            segment('stop-mistmere-reedport-mere-ferry', 'stop-merewatch-ferry', 2400, 9000, ['reed-channels', 'lake-weather', 'shallow-bars']),
            segment('stop-merewatch-ferry', 'stop-reedcrown-isle-ferry', 1800, 7000, ['open-water', 'lake-weather', 'shoals']),
        ],
        bidirectional: true,
        knowledge: { mapId: 'map-great-mere', discoveryTag: 'route.reedport-great-mere-waterway' },
        cargo: { encumbranceMultiplier: 1.2 },
    }),
    'route-mistmere-west-starfen-waterway': route({
        id: 'route-mistmere-west-starfen-waterway',
        name: 'Reedport West Channel',
        type: 'waterway',
        allowedModes: ['ferry'],
        stops: [
            stop('stop-mistmere-reedport-ferry', 'mistmere-reedport'),
            stop('stop-west-starfen-ferry', 'west-starfen'),
        ],
        segments: [segment('stop-mistmere-reedport-ferry', 'stop-west-starfen-ferry', 1500, 6000, ['shallow-water', 'fen-weather'])],
        bidirectional: true,
        knowledge: { mapId: 'map-starfen', discoveryTag: 'route.reedport-west-channel' },
        cargo: { encumbranceMultiplier: 1.25 },
    }),
});

const TRANSPORT_SERVICE_DEFINITIONS = Object.freeze({
    'service-crownfields-produce-wagon': transportService({
        id: 'service-crownfields-produce-wagon',
        name: 'Crownfields Produce Wagon',
        mode: 'wagon',
        routeId: 'route-thornwall-crownfields-road',
        stopIds: ['stop-thornwall-southgate-crownfields', 'stop-crownfields-grange-north-road'],
        cadenceSeconds: 7200,
        firstDepartureOffsetSeconds: 5400,
        fare: { currencyId: 'gil', baseAmount: 5, perSegmentAmount: 3 },
        cargoAllowanceUnits: 20,
        boardingLeadSeconds: 120,
    }),
    'service-crown-forge-caravan': transportService({
        id: 'service-crown-forge-caravan',
        name: 'Crown-Forge Caravan',
        mode: 'caravan',
        routeId: 'route-crown-forge-caravan-road',
        stopIds: ['stop-thornwall-rivergate-caravan', 'stop-timbercross-landing-caravan', 'stop-brasshaven-iron-quay-caravan'],
        cadenceSeconds: 21600,
        firstDepartureOffsetSeconds: 21600,
        fare: { currencyId: 'gil', baseAmount: 24, perSegmentAmount: 18 },
        cargoAllowanceUnits: 24,
        boardingLeadSeconds: 300,
    }),
    'service-slatewater-foothill-caravan': transportService({
        id: 'service-slatewater-foothill-caravan',
        name: 'Slatewater Foothill Caravan',
        mode: 'caravan',
        routeId: 'route-crown-forge-caravan-road',
        stopIds: ['stop-timbercross-landing-caravan', 'stop-slatewater-waylodge-caravan', 'stop-brasshaven-iron-quay-caravan'],
        cadenceSeconds: 14400,
        firstDepartureOffsetSeconds: 9000,
        fare: { currencyId: 'gil', baseAmount: 10, perSegmentAmount: 8 },
        cargoAllowanceUnits: 18,
        boardingLeadSeconds: 180,
    }),
    'service-forge-mere-caravan': transportService({
        id: 'service-forge-mere-caravan',
        name: 'Forge-Mere Caravan',
        mode: 'caravan',
        routeId: 'route-forge-mere-caravan-road',
        stopIds: ['stop-brasshaven-iron-quay-eastbound', 'stop-mistmere-reedport-westbound'],
        cadenceSeconds: 28800,
        firstDepartureOffsetSeconds: 25200,
        fare: { currencyId: 'gil', baseAmount: 30, perSegmentAmount: 22 },
        cargoAllowanceUnits: 30,
        boardingLeadSeconds: 300,
    }),
    'service-mere-delta-packet': transportService({
        id: 'service-mere-delta-packet',
        name: 'Mere-Delta Packet Boat',
        mode: 'ferry',
        routeId: 'route-great-mere-delta-waterway',
        stopIds: ['stop-merewatch-delta-packet', 'stop-starfen-lower-delta-waterway', 'stop-tideglass-delta-packet'],
        cadenceSeconds: 10800,
        firstDepartureOffsetSeconds: 5400,
        fare: { currencyId: 'gil', baseAmount: 10, perSegmentAmount: 7 },
        cargoAllowanceUnits: 16,
        boardingLeadSeconds: 180,
    }),
    'service-great-mere-ferry': transportService({
        id: 'service-great-mere-ferry',
        name: 'Great Mere Ferry',
        mode: 'ferry',
        routeId: 'route-mistmere-great-mere-waterway',
        stopIds: ['stop-mistmere-reedport-mere-ferry', 'stop-merewatch-ferry', 'stop-reedcrown-isle-ferry'],
        cadenceSeconds: 7200,
        firstDepartureOffsetSeconds: 3600,
        fare: { currencyId: 'gil', baseAmount: 8, perSegmentAmount: 6 },
        cargoAllowanceUnits: 14,
        boardingLeadSeconds: 180,
    }),
    'service-mistmere-west-ferry': transportService({
        id: 'service-mistmere-west-ferry',
        name: 'West Fen Ferry',
        mode: 'ferry',
        routeId: 'route-mistmere-west-starfen-waterway',
        stopIds: ['stop-mistmere-reedport-ferry', 'stop-west-starfen-ferry'],
        cadenceSeconds: 3600,
        firstDepartureOffsetSeconds: 1800,
        fare: { currencyId: 'gil', baseAmount: 6, perSegmentAmount: 4 },
        cargoAllowanceUnits: 12,
        boardingLeadSeconds: 120,
    }),
});

export function getRoute(routeId) {
    return ROUTE_DEFINITIONS[String(routeId ?? '').trim()] ?? null;
}

export function listRoutes() {
    return Object.values(ROUTE_DEFINITIONS);
}

export function getTransportService(serviceId) {
    return TRANSPORT_SERVICE_DEFINITIONS[String(serviceId ?? '').trim()] ?? null;
}

export function listTransportServices() {
    return Object.values(TRANSPORT_SERVICE_DEFINITIONS);
}

export function findRouteLeg(fromPlaceId, toPlaceId, options = {}) {
    const mode = options.mode ? String(options.mode) : null;
    for (const candidate of listRoutes()) {
        if (mode && !candidate.allowedModes.includes(mode)) continue;
        const leg = routeLeg(candidate, fromPlaceId, toPlaceId);
        if (leg) return leg;
    }
    return null;
}

export function getServiceJourney(serviceId, fromPlaceId, toPlaceId) {
    const service = getTransportService(serviceId);
    if (!service) return null;
    const routeDefinition = getRoute(service.routeId);
    if (!routeDefinition) return null;
    const fromIndex = service.stopIds.findIndex((stopId) => routeStop(routeDefinition, stopId)?.placeId === fromPlaceId);
    const toIndex = service.stopIds.findIndex((stopId) => routeStop(routeDefinition, stopId)?.placeId === toPlaceId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;
    const forward = toIndex > fromIndex;
    if (!forward && !routeDefinition.bidirectional) return null;
    const leg = routeLeg(routeDefinition, fromPlaceId, toPlaceId);
    if (!leg) return null;
    const segmentCount = Math.abs(toIndex - fromIndex);
    return Object.freeze({ service, route: routeDefinition, ...leg, segmentCount });
}

export function getNextServiceDeparture(serviceOrId, worldSeconds) {
    const service = typeof serviceOrId === 'string' ? getTransportService(serviceOrId) : serviceOrId;
    if (!service) return null;
    const now = Math.max(0, Math.floor(Number(worldSeconds) || 0));
    const offset = service.firstDepartureOffsetSeconds;
    if (now <= offset) return offset;
    const cycles = Math.ceil((now - offset) / service.cadenceSeconds);
    return offset + cycles * service.cadenceSeconds;
}

export function validateRouteCatalog() {
    const issues = [];
    const routeIds = new Set();
    const serviceIds = new Set();

    for (const routeDefinition of listRoutes()) {
        if (routeIds.has(routeDefinition.id)) issues.push(`duplicate route id ${routeDefinition.id}.`);
        routeIds.add(routeDefinition.id);
        if (!ROUTE_TYPES.includes(routeDefinition.type)) issues.push(`${routeDefinition.id} has unknown type ${routeDefinition.type}.`);
        if (!routeDefinition.allowedModes.length) issues.push(`${routeDefinition.id} has no allowed travel modes.`);
        for (const mode of routeDefinition.allowedModes) if (!ROUTE_TRAVEL_MODES.includes(mode)) issues.push(`${routeDefinition.id} has unknown mode ${mode}.`);
        if (routeDefinition.stops.length < 2) issues.push(`${routeDefinition.id} requires at least two stops.`);
        const stopIds = new Set();
        for (const routeStopDefinition of routeDefinition.stops) {
            if (stopIds.has(routeStopDefinition.id)) issues.push(`${routeDefinition.id} duplicates stop ${routeStopDefinition.id}.`);
            stopIds.add(routeStopDefinition.id);
            const place = getPlace(routeStopDefinition.placeId);
            if (!place) {
                issues.push(`${routeDefinition.id} stop ${routeStopDefinition.id} references unknown place ${routeStopDefinition.placeId}.`);
            } else if (routeStopDefinition.coordinate) {
                if (!isCoordinateInsidePlace(place, routeStopDefinition.coordinate)) {
                    issues.push(`${routeDefinition.id} stop ${routeStopDefinition.id} coordinate is outside ${place.id}.`);
                } else if (isTopologyPlace(place) && !isNavigableCoordinate(place, routeStopDefinition.coordinate, routeStopDefinition.coordinate.levelId)) {
                    issues.push(`${routeDefinition.id} stop ${routeStopDefinition.id} coordinate is not navigable in ${place.id}.`);
                }
            }
        }
        if (routeDefinition.segments.length !== routeDefinition.stops.length - 1) issues.push(`${routeDefinition.id} segment count must equal stops - 1.`);
        for (const [index, routeSegment] of routeDefinition.segments.entries()) {
            if (!stopIds.has(routeSegment.fromStopId) || !stopIds.has(routeSegment.toStopId)) issues.push(`${routeDefinition.id} has segment with unknown stop.`);
            const expectedFrom = routeDefinition.stops[index]?.id;
            const expectedTo = routeDefinition.stops[index + 1]?.id;
            if (routeSegment.fromStopId !== expectedFrom || routeSegment.toStopId !== expectedTo) {
                issues.push(`${routeDefinition.id} segment ${index} must connect ${expectedFrom} to ${expectedTo} in route order.`);
            }
            if (!positiveInteger(routeSegment.durationSeconds)) issues.push(`${routeDefinition.id} has invalid segment duration.`);
            if (!positiveInteger(routeSegment.distanceYalms)) issues.push(`${routeDefinition.id} has invalid segment distance.`);
        }
        if (routeDefinition.knowledge.mapId && !getMap(routeDefinition.knowledge.mapId)) issues.push(`${routeDefinition.id} references unknown map ${routeDefinition.knowledge.mapId}.`);
        if (!positiveNumber(routeDefinition.cargo.encumbranceMultiplier)) issues.push(`${routeDefinition.id} has invalid cargo encumbranceMultiplier.`);
    }

    for (const service of listTransportServices()) {
        if (serviceIds.has(service.id)) issues.push(`duplicate transport service id ${service.id}.`);
        serviceIds.add(service.id);
        if (!ROUTE_TRAVEL_MODES.includes(service.mode)) issues.push(`${service.id} has unknown mode ${service.mode}.`);
        const routeDefinition = getRoute(service.routeId);
        if (!routeDefinition) {
            issues.push(`${service.id} references unknown route ${service.routeId}.`);
            continue;
        }
        if (!routeDefinition.allowedModes.includes(service.mode)) issues.push(`${service.id} mode ${service.mode} is not allowed on ${service.routeId}.`);
        if (service.stopIds.length < 2) issues.push(`${service.id} requires at least two service stops.`);
        const serviceStopIds = new Set();
        let previousRouteIndex = -1;
        for (const stopId of service.stopIds) {
            if (serviceStopIds.has(stopId)) issues.push(`${service.id} duplicates service stop ${stopId}.`);
            serviceStopIds.add(stopId);
            const routeIndex = routeDefinition.stops.findIndex((entry) => entry.id === stopId);
            if (routeIndex < 0) {
                issues.push(`${service.id} references unknown route stop ${stopId}.`);
                continue;
            }
            if (routeIndex <= previousRouteIndex) issues.push(`${service.id} service stops must follow ${service.routeId} route order.`);
            previousRouteIndex = routeIndex;
        }
        if (!positiveInteger(service.cadenceSeconds)) issues.push(`${service.id} has invalid cadenceSeconds.`);
        if (!nonNegativeInteger(service.firstDepartureOffsetSeconds)) issues.push(`${service.id} has invalid firstDepartureOffsetSeconds.`);
        if (!nonNegativeInteger(service.boardingLeadSeconds) || service.boardingLeadSeconds >= service.cadenceSeconds) issues.push(`${service.id} has invalid boardingLeadSeconds.`);
        if (!positiveInteger(service.cargoAllowanceUnits)) issues.push(`${service.id} has invalid cargoAllowanceUnits.`);
        if (!String(service.fare.currencyId ?? '').trim() || !nonNegativeInteger(service.fare.baseAmount) || !nonNegativeInteger(service.fare.perSegmentAmount)) issues.push(`${service.id} has invalid fare.`);
    }

    return issues;
}

function routeLeg(routeDefinition, fromPlaceId, toPlaceId) {
    const fromIndex = routeDefinition.stops.findIndex((entry) => entry.placeId === fromPlaceId);
    const toIndex = routeDefinition.stops.findIndex((entry) => entry.placeId === toPlaceId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null;
    const forward = toIndex > fromIndex;
    if (!forward && !routeDefinition.bidirectional) return null;
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    const relevantSegments = routeDefinition.segments.slice(start, end);
    const durationSeconds = relevantSegments.reduce((sum, entry) => sum + entry.durationSeconds, 0);
    const distanceYalms = relevantSegments.reduce((sum, entry) => sum + entry.distanceYalms, 0);
    const hazardTags = Array.from(new Set(relevantSegments.flatMap((entry) => entry.hazardTags)));
    const fromStop = routeDefinition.stops[fromIndex];
    const toStop = routeDefinition.stops[toIndex];
    return Object.freeze({
        route: routeDefinition,
        fromStop,
        toStop,
        durationSeconds,
        distanceYalms,
        hazardTags: Object.freeze(hazardTags),
        direction: forward ? 'forward' : 'reverse',
    });
}

function routeStop(routeDefinition, stopId) {
    return routeDefinition.stops.find((entry) => entry.id === stopId) ?? null;
}

function route(options) {
    return deepFreeze({
        version: ROUTE_CATALOG_VERSION,
        id: options.id,
        name: options.name,
        type: options.type,
        allowedModes: [...options.allowedModes],
        stops: [...options.stops],
        segments: [...options.segments],
        bidirectional: Boolean(options.bidirectional),
        knowledge: { mapId: options.knowledge?.mapId ?? null, discoveryTag: options.knowledge?.discoveryTag ?? null },
        cargo: { encumbranceMultiplier: Number(options.cargo?.encumbranceMultiplier) || 1 },
    });
}

function stop(id, placeId, coordinate = null) {
    return { id, placeId, coordinate: coordinate ? { ...coordinate } : null };
}

function segment(fromStopId, toStopId, durationSeconds, distanceYalms, hazardTags = []) {
    return { fromStopId, toStopId, durationSeconds, distanceYalms, hazardTags: [...hazardTags] };
}

function transportService(options) {
    return deepFreeze({
        version: ROUTE_CATALOG_VERSION,
        id: options.id,
        name: options.name,
        mode: options.mode,
        routeId: options.routeId,
        stopIds: [...options.stopIds],
        cadenceSeconds: options.cadenceSeconds,
        firstDepartureOffsetSeconds: options.firstDepartureOffsetSeconds,
        fare: { ...options.fare },
        cargoAllowanceUnits: options.cargoAllowanceUnits,
        boardingLeadSeconds: options.boardingLeadSeconds,
    });
}

function positiveInteger(value) { return Number.isInteger(value) && value > 0; }
function nonNegativeInteger(value) { return Number.isInteger(value) && value >= 0; }
function positiveNumber(value) { return Number.isFinite(Number(value)) && Number(value) > 0; }
function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
