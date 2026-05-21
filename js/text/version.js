export const VERSION = Object.freeze({
    app: '0.2.0',
    save: 2,
    data: 1,
    benchmark: 1,
    codename: 'Text Foundation Pipeline',
    compatibility: 'no-backwards-compatibility',
    released: false,
});

export const SYSTEM_VERSIONS = Object.freeze({
    commandShell: '0.2.0',
    parser: '0.2.0',
    validation: '0.2.0',
    playerEntity: '0.1.0',
    npcEntity: '0.1.0',
    enemyEntity: '0.1.0',
    statEngine: '0.1.0',
    statusEngine: '0.1.0',
    battleEngine: '0.1.0',
    liveTick: 'planned',
    zones: 'planned',
    travel: 'planned',
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
