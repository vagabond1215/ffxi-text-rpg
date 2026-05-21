export const VERSION = Object.freeze({
    app: '0.3.0',
    save: 2,
    data: 2,
    benchmark: 1,
    codename: 'Coordinate Atlas Foundation',
    compatibility: 'no-backwards-compatibility',
    released: false,
});

export const SYSTEM_VERSIONS = Object.freeze({
    commandShell: '0.3.0',
    parser: '0.2.0',
    validation: '0.3.0',
    playerEntity: '0.1.0',
    npcEntity: '0.1.0',
    enemyEntity: '0.1.0',
    statEngine: '0.1.0',
    statusEngine: '0.1.0',
    battleEngine: '0.1.0',
    liveTick: '0.2.0',
    zones: '0.3.0',
    zoneAtlas: '0.3.0',
    gridMovement: '0.3.0',
    hudControls: '0.3.0',
    aggro: '0.3.0',
    travel: '0.3.0',
    quests: 'planned',
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
