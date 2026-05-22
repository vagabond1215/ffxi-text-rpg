export const LOOT_TABLES = Object.freeze({
    starterBeast: lootTable('starterBeast', 'Starter Beast Drops', [
        drop('wild-rabbit-hide', 'Wild Rabbit Hide', 'material', 0.65, { tags: ['material', 'hide', 'beast'], valueGil: 8 }),
    ]),
    starterGoblin: lootTable('starterGoblin', 'Starter Goblin Drops', [
        drop('goblin-scrap', 'Goblin Scrap', 'material', 0.45, { tags: ['material', 'beastman'], valueGil: 12 }),
    ]),
    starterOrc: lootTable('starterOrc', 'Starter Orc Drops', [
        drop('orcish-scale', 'Orcish Scale', 'material', 0.35, { tags: ['material', 'beastman'], valueGil: 18 }),
    ]),
    starterWorm: lootTable('starterWorm', 'Starter Worm Drops', [
        drop('worm-segment', 'Worm Segment', 'material', 0.55, { tags: ['material', 'vermiform'], valueGil: 7 }),
    ]),
    starterMandragora: lootTable('starterMandragora', 'Starter Mandragora Drops', [
        drop('mandragora-sprout', 'Mandragora Sprout', 'material', 0.55, { tags: ['material', 'plantoid'], valueGil: 7 }),
    ]),
    starterBat: lootTable('starterBat', 'Starter Bat Drops', [
        drop('bat-wing', 'Bat Wing', 'material', 0.55, { tags: ['material', 'beast'], valueGil: 9 }),
    ]),
});

export function getLootTable(tableId) {
    return LOOT_TABLES[tableId] ?? null;
}

export function listLootTables() {
    return Object.values(LOOT_TABLES);
}

function lootTable(id, name, drops) {
    return Object.freeze({ id, name, drops: Object.freeze(drops) });
}

function drop(id, name, kind, chance, options = {}) {
    return Object.freeze({
        id,
        name,
        kind,
        chance,
        quantity: options.quantity ?? 1,
        valueGil: options.valueGil ?? 0,
        tags: Object.freeze(options.tags ?? []),
    });
}
