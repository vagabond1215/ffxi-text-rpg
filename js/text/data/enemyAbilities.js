export const ENEMY_ABILITY_CATALOG_VERSION = 1;

const ENEMY_ABILITIES = Object.freeze({
    'enemy-ability-rushing-cleave': enemyAbility({
        id: 'enemy-ability-rushing-cleave',
        name: 'Rushing Cleave',
        kind: 'technique',
        recoverySeconds: 6,
        effect: {
            type: 'damage',
            stat: 'str',
            base: 5,
            coefficient: 0.8,
        },
        tags: ['martial', 'raider', 'committed'],
    }),
});

export function getEnemyAbility(id) {
    return ENEMY_ABILITIES[String(id ?? '').trim()] ?? null;
}

export function listEnemyAbilities() {
    return Object.values(ENEMY_ABILITIES);
}

export function validateEnemyAbilityCatalog() {
    const issues = [];
    for (const ability of listEnemyAbilities()) {
        if (!/^enemy-ability-[a-z0-9-]+$/.test(ability.id)) issues.push(`Invalid enemy ability id ${ability.id}.`);
        if (!ability.name) issues.push(`${ability.id} is missing name.`);
        if (!Number.isInteger(ability.recoverySeconds) || ability.recoverySeconds < 1) issues.push(`${ability.id}.recoverySeconds must be positive.`);
        if (ability.effect?.type !== 'damage') issues.push(`${ability.id} currently requires a damage effect.`);
        if (!['str', 'dex', 'vit', 'agi', 'int', 'mnd', 'chr'].includes(ability.effect?.stat)) issues.push(`${ability.id} has invalid scaling stat.`);
        if (!Number.isFinite(ability.effect?.base) || ability.effect.base < 0) issues.push(`${ability.id} has invalid base damage.`);
        if (!Number.isFinite(ability.effect?.coefficient) || ability.effect.coefficient < 0) issues.push(`${ability.id} has invalid coefficient.`);
    }
    return issues;
}

function enemyAbility(definition) {
    return deepFreeze({
        id: String(definition.id),
        name: String(definition.name),
        kind: String(definition.kind ?? 'technique'),
        recoverySeconds: Math.max(1, Math.floor(Number(definition.recoverySeconds) || 1)),
        effect: { ...definition.effect },
        tags: [...(definition.tags ?? [])],
    });
}

function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    for (const child of Object.values(value)) deepFreeze(child);
    return Object.freeze(value);
}
