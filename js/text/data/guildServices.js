export const GUILD_SERVICES = Object.freeze({
    'poi-sandoria-s-faulpie': guild('poi-sandoria-s-faulpie', 'Tanning Guild', 'leathercraft', ['guildMaster', 'synthesisSupport', 'guildVendor'], [
        recipe('rabbit-hide-leather', 'Rabbit Hide Leather', 1, ['rabbit-hide', 'distilled-water']),
        recipe('leather-bandana', 'Leather Bandana', 3, ['sheep-leather', 'grass-thread']),
    ]),
    'poi-sandoria-n-cheupirudaux': guild('poi-sandoria-n-cheupirudaux', 'Carpenters’ Guild', 'woodworking', ['guildMaster', 'synthesisSupport', 'guildVendor'], [
        recipe('ash-lumber', 'Ash Lumber', 1, ['ash-log']),
        recipe('maple-wand', 'Maple Wand', 3, ['maple-lumber', 'wind-crystal']),
    ]),
    'poi-sandoria-n-mevreauche': guild('poi-sandoria-n-mevreauche', 'Blacksmiths’ Guild', 'blacksmithing', ['guildMaster', 'synthesisSupport', 'guildVendor'], [
        recipe('bronze-ingot', 'Bronze Ingot', 1, ['copper-ore', 'tin-ore']),
        recipe('bronze-sword', 'Bronze Sword', 4, ['bronze-ingot', 'ash-lumber']),
    ]),
    'poi-bastok-markets-reinberta': guild('poi-bastok-markets-reinberta', 'Goldsmiths’ Guild', 'goldsmithing', ['guildMaster', 'synthesisSupport', 'guildVendor'], [
        recipe('copper-ingot', 'Copper Ingot', 1, ['copper-ore']),
        recipe('brass-ring', 'Brass Ring', 5, ['brass-ingot']),
    ]),
    'poi-waters-chomo-jinjahl': guild('poi-waters-chomo-jinjahl', 'Culinarians’ Guild', 'cooking', ['guildMaster', 'synthesisSupport', 'guildVendor'], [
        recipe('boiled-egg', 'Boiled Egg', 1, ['bird-egg', 'distilled-water']),
        recipe('roast-mushroom', 'Roast Mushroom', 2, ['sleepshroom', 'fire-crystal']),
    ]),
});

export function getGuildServiceForPoi(poiId) {
    return GUILD_SERVICES[poiId] ?? null;
}

export function listGuildServices() {
    return Object.values(GUILD_SERVICES);
}

export function describeGuildServiceForPoi(poi) {
    const guild = getGuildServiceForPoi(poi.id);
    if (!guild) return `${poi.name} has no guild service profile yet. Tags: ${poi.tags.join(', ')}`;

    return [
        `${guild.name}`,
        `Craft: ${guild.craftSkill}`,
        `Services: ${guild.services.join(', ')}`,
        'Starter recipes:',
        ...guild.recipes.map((recipe) => `- ${recipe.name} Lv.${recipe.level}: ${recipe.ingredients.join(', ')}`),
    ].join('\n');
}

function guild(poiId, name, craftSkill, services, recipes) {
    return Object.freeze({ poiId, name, craftSkill, services: Object.freeze(services), recipes: Object.freeze(recipes) });
}

function recipe(id, name, level, ingredients) {
    return Object.freeze({ id, name, level, ingredients: Object.freeze(ingredients) });
}
