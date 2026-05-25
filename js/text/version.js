export const VERSION = Object.freeze({
    app: '0.4.1',
    accountSave: 4,
    gameState: 2,
    data: 12,
    benchmark: 1,
    codename: 'Canvas UI Intents',
    compatibility: 'no-backwards-compatibility',
    released: false,

    // Backward-compatible alias for older callers while they migrate.
    save: 4,
});

export const SYSTEM_VERSIONS = Object.freeze({
    commandShell: '0.4.1',
    canvasUi: '0.6.5',
    uiIntents: '0.1.0',
    slashCommands: '0.4.1',
    accountSaves: '0.5.1',
    saveEncoding: '0.4.1',
    parser: '0.2.0',
    validation: '0.5.1',
    playerEntity: '0.5.4',
    characterCreation: '0.4.1',
    nations: '0.3.1',
    npcEntity: '0.1.0',
    enemyEntity: '0.1.0',
    statEngine: '0.4.0',
    statusEngine: '0.1.0',
    battleEngine: '0.5.0',
    combatActions: '0.5.0',
    battleRewards: '0.5.2',
    progression: '0.5.4',
    expTables: '0.5.2',
    jobSwitching: '0.5.3',
    skillProgression: '0.5.1',
    liveTick: '0.2.0',
    maps: '0.3.1',
    zones: '0.3.1',
    zoneAtlas: '0.3.0',
    gridMovement: '0.3.3',
    hudControls: '0.3.0',
    aggro: '0.3.3',
    travel: '0.3.3',
    pois: '0.3.4',
    poiDiscovery: '0.3.4',
    poiFastTravel: '0.3.4',
    zoneFastTravel: '0.3.4',
    shops: '0.3.7',
    shopTransactions: '0.3.7',
    guilds: '0.3.5',
    questHooks: '0.3.5',
    inventoryContainers: '0.5.1',
    inventoryTransfers: '0.5.1',
    itemSchema: '0.6.0',
    itemStacking: '0.5.1',
    equipmentCommands: '0.5.0',
    equipmentEligibility: '0.5.0',
    itemInspection: '0.5.0',
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
        `App: ${VERSION.app}`,
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
