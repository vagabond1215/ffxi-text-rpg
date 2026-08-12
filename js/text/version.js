export const PRODUCT_VERSION = '0.4.500.0';
export const PACKAGE_VERSION = '0.4.500';

export const VERSION = Object.freeze({
    product: PRODUCT_VERSION,
    package: PACKAGE_VERSION,
    accountSave: 4,
    gameState: 3,
    data: 13,
    benchmark: 1,
    codename: 'Semantic Event Foundation',
    compatibility: 'migrate-supported-save-versions',
    released: false,

    // Transitional aliases for callers that still use the historical names.
    app: PRODUCT_VERSION,
    save: 4,
});

export const SYSTEM_VERSIONS = Object.freeze({
    versionManifest: '0.4.500',
    saveMigrations: '0.1.0',
    actionResults: '0.1.0',
    semanticEvents: '0.1.0',
    commandShell: '0.4.4',
    canvasUi: '0.7.0',
    uiIntents: '0.1.1',
    slashCommands: '0.4.1',
    accountSaves: '0.6.0',
    saveEncoding: '0.4.1',
    parser: '0.2.0',
    validation: '0.6.0',
    playerEntity: '0.5.4',
    characterCreation: '0.4.1',
    nations: '0.3.1',
    npcEntity: '0.1.0',
    enemyEntity: '0.1.0',
    statEngine: '0.4.0',
    statusEngine: '0.1.0',
    battleEngine: '0.5.0',
    combatActions: '0.5.1',
    battleRewards: '0.5.2',
    progression: '0.5.4',
    expTables: '0.5.2',
    jobSwitching: '0.5.3',
    skillProgression: '0.5.2',
    liveTick: '0.2.0',
    maps: '0.4.0',
    zones: '0.4.0',
    coordinates: '0.1.0',
    navigation: '0.1.0',
    zoneAtlas: '0.4.0',
    gridMovement: '0.4.0',
    hudControls: '0.4.0',
    aggro: '0.3.3',
    travel: '0.4.2',
    pois: '0.3.5',
    poiDiscovery: '0.3.5',
    poiFastTravel: '0.3.5',
    zoneFastTravel: '0.3.5',
    shops: '0.3.8',
    shopTransactions: '0.3.8',
    guilds: '0.3.5',
    questHooks: '0.3.5',
    inventoryContainers: '0.5.1',
    inventoryTransfers: '0.5.1',
    itemSchema: '0.6.0',
    itemBehavior: '0.1.0',
    itemStacking: '0.5.1',
    equipmentCommands: '0.5.0',
    equipmentEligibility: '0.5.0',
    itemInspection: '0.5.1',
    equipmentCatalog: '0.6.0',
    skillCaps: '0.5.1',
    mogHouseStorage: '0.3.8',
    wardrobes: '0.3.9',
    achievements: 'planned',
    items: '0.6.0',
    keyItems: 'planned',
    magic: 'planned',
    loot: '0.5.0',
    leveling: '0.5.3',
    trusts: 'planned',
    crafting: 'planned',
    mounts: 'planned',
});

export function describeVersion() {
    return [
        `Product: ${VERSION.product}`,
        `Package: ${VERSION.package}`,
        `Account Save: ${VERSION.accountSave}`,
        `Game State: ${VERSION.gameState}`,
        `Data: ${VERSION.data}`,
        `Benchmark: ${VERSION.benchmark}`,
        `Codename: ${VERSION.codename}`,
        `Compatibility: ${VERSION.compatibility}`,
    ].join('\n');
}

export function describeSystemVersions() {
    return Object.entries(SYSTEM_VERSIONS)
        .map(([system, version]) => `${system}: ${version}`)
        .join('\n');
}
