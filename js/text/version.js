export const VERSION = Object.freeze({
    app: '0.4.1',
    save: 3,
    data: 7,
    benchmark: 1,
    codename: 'Slash UI Account Saves',
    compatibility: 'no-backwards-compatibility',
    released: false,
});

export const SYSTEM_VERSIONS = Object.freeze({
    commandShell: '0.4.1',
    slashCommands: '0.4.1',
    accountSaves: '0.4.1',
    saveEncoding: '0.4.1',
    parser: '0.2.0',
    validation: '0.3.6',
    playerEntity: '0.3.6',
    characterCreation: '0.4.1',
    nations: '0.3.1',
    npcEntity: '0.1.0',
    enemyEntity: '0.1.0',
    statEngine: '0.4.0',
    statusEngine: '0.1.0',
    battleEngine: '0.3.2',
    combatActions: '0.3.2',
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
    inventoryContainers: '0.3.8',
    inventoryTransfers: '0.3.8',
    equipmentCommands: '0.4.0',
    equipmentCatalog: '0.4.0',
    mogHouseStorage: '0.3.8',
    wardrobes: '0.3.9',
    achievements: 'planned',
    items: 'planned',
    keyItems: 'planned',
    magic: 'planned',
    loot: 'planned',
    leveling: 'planned',
    trusts: 'planned',
    crafting: 'planned',
    mounts: 'planned',
});

export function describeVersion() {
    return [
        `App: ${VERSION.app}`,
        `Save: ${VERSION.save}`,
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
