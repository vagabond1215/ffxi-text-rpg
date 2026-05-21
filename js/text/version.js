export const VERSION = Object.freeze({
    app: '0.3.3',
    save: 2,
    data: 3,
    benchmark: 1,
    codename: 'Aggro Encounter Integration',
    compatibility: 'no-backwards-compatibility',
    released: false,
});

export const SYSTEM_VERSIONS = Object.freeze({
    commandShell: '0.3.3',
    parser: '0.2.0',
    validation: '0.3.1',
    playerEntity: '0.3.1',
    characterCreation: '0.3.1',
    nations: '0.3.1',
    npcEntity: '0.1.0',
    enemyEntity: '0.1.0',
    statEngine: '0.1.0',
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
