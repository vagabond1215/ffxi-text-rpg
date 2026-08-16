export const PLAYER_EXPERIENCE_CONTENT_VERSION = 4;

export const ORIGIN_EXPERIENCE_CONTENT = Object.freeze({
    thornwall: origin({
        nationId: 'thornwall',
        nationName: 'Thornwall',
        startingPlaceId: 'thornwall-southgate',
        guidePoiId: 'poi-sandoria-s-alaune',
        guideName: 'Sera Talwin',
        arrival: 'Southgate’s newcomer roll now carries your name, but no reputation travels ahead of you. The old gate is busy enough that a person can disappear into the crowd or begin making themselves useful before noon.',
        localLead: 'the guild stalls, road wardens, shops, and training yards around Southgate',
        regionalHorizon: 'Elderwood',
        regionalDeparturePlaceId: 'thornwall-southgate',
        firstRegionalDestinationId: 'west-elderwood',
        firstRegionalDestination: 'West Elderwood',
        livelihoodExamples: 'forestry, tanning, hunting, field recovery, and road work',
        livelihoodSourceId: 'source-west-elderwood-amber-resin-grove',
        trainingEnemyId: 'enemy-brush-hare',
        servicePoiId: 'poi-sandoria-s-corua',
        serviceName: 'Nessa Woodmere',
    }),
    brasshaven: origin({
        nationId: 'brasshaven',
        nationName: 'Brasshaven',
        startingPlaceId: 'brasshaven-market-ring',
        guidePoiId: 'poi-bastok-markets-rabid-wolf',
        guideName: 'Marshal Varric Stone',
        arrival: 'The Market Ring has recorded you among the day’s new arrivals. Brasshaven does not care much for pedigree when there is useful work to be done, but tools, contacts, and a reliable name are earned rather than assumed.',
        localLead: 'the market workshops, Delvers’ Ward, foundry offices, and supply merchants',
        regionalHorizon: 'Redstone Reach',
        regionalDeparturePlaceId: 'brasshaven-market-ring',
        firstRegionalDestinationId: 'south-redstone-reach',
        firstRegionalDestination: 'South Redstone Reach',
        livelihoodExamples: 'mining, salvage, metalwork, caravan supply, and paid field work',
        livelihoodSourceId: 'source-south-redstone-copper-seam',
        trainingEnemyId: 'enemy-redstone-burrower',
        servicePoiId: 'poi-bastok-markets-olwyn',
        serviceName: 'Perrin Coil',
        regionalLoop: {
            id: 'loop-brasshaven-first-copper',
            title: 'Bring Redstone copper back to the forge',
            targetResourceItemId: 'item-redstone-copper-ore',
            targetResourceQuantity: 2,
            returnPlaceId: 'brasshaven-market-ring',
            workstationPoiId: 'poi-bastok-markets-reinberta',
            productionId: 'process-redstone-copper-ingot',
            outputItemId: 'item-redstone-copper-ingot',
            largerAmbition: 'A copper ingot and metalworking practice open the first half of a Copper Trail Clasp; Starfen reed fiber can complete that cross-region craft later.',
        },
    }),
    mistmere: origin({
        nationId: 'mistmere',
        nationName: 'Mistmere',
        startingPlaceId: 'mistmere-canal-ward',
        guidePoiId: 'poi-waters-dagoza-beruza',
        guideName: 'Reader Soli Venn',
        arrival: 'Your name has reached the Canal Ward registry with the morning ferries. Mistmere is generous with directions and questions, but access to better work, instruments, and serious study still comes from demonstrated competence.',
        localLead: 'the canal market, culinary guild, herb sellers, gardens, and civic readers',
        regionalHorizon: 'Starfen',
        regionalDeparturePlaceId: 'mistmere-reedport',
        firstRegionalDestinationId: 'west-starfen',
        firstRegionalDestination: 'West Starfen',
        livelihoodExamples: 'herb gathering, cooking, field study, marsh recovery, and local trade',
        livelihoodSourceId: 'source-west-starfen-reedbed',
        trainingEnemyId: 'enemy-starfen-rootling',
        servicePoiId: 'poi-waters-hilkomu-makimu',
        serviceName: 'Kiri Fen',
    }),
});

export function getOriginExperienceContent(nationId = 'thornwall') {
    return ORIGIN_EXPERIENCE_CONTENT[normalizeNationId(nationId)] ?? ORIGIN_EXPERIENCE_CONTENT.thornwall;
}

export function listOriginExperienceContent() {
    return Object.values(ORIGIN_EXPERIENCE_CONTENT);
}

function origin(definition) {
    return Object.freeze({
        ...definition,
        regionalLoop: definition.regionalLoop ? Object.freeze({ ...definition.regionalLoop }) : null,
    });
}

function normalizeNationId(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/\s+/g, '-');
}
