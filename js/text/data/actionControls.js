export const RESOURCE_BARS = Object.freeze([
    bar('hp', 'HP', 'player.resources.hp', 'player.combat.resources.maxHp'),
    bar('mp', 'MP', 'player.resources.mp', 'player.combat.resources.maxMp'),
    bar('tp', 'TP', 'player.resources.tp', 'player.combat.resources.maxTp'),
]);

export const LIVE_TIMER_BAR = Object.freeze({
    id: 'liveTick',
    label: 'Tick',
    source: 'tickEngine.elapsedTicks',
    display: 'progress-bar',
    description: 'Text-rendered timer bar for time-based systems: travel, combat, casting, recasts, status effects, AI, crafting, and respawns.',
});

export const NAV_KEYPAD = Object.freeze([
    nav('nw', 'Northwest', -1, -1),
    nav('n', 'North', 0, -1),
    nav('ne', 'Northeast', 1, -1),
    nav('w', 'West', -1, 0),
    nav('e', 'East', 1, 0),
    nav('sw', 'Southwest', -1, 1),
    nav('s', 'South', 0, 1),
    nav('se', 'Southeast', 1, 1),
]);

export const ACTION_CONTROL_GROUPS = Object.freeze({
    combat: group('combat', 'Combat', [
        action('attack', 'Auto Attack', 'Begin or continue basic attacks against a target.'),
        action('weaponSkill', 'Weapon Skill', 'Spend TP on a weapon skill.'),
        action('defend', 'Defend', 'Take a defensive posture or delay action.'),
        action('disengage', 'Disengage', 'Attempt to stop fighting.'),
    ]),
    magic: group('magic', 'Magic', [
        action('cast', 'Cast Magic', 'Cast a known spell with MP, cast time, recast, and interruption rules.'),
        action('interrupt', 'Interrupt', 'Attempt to interrupt current casting where applicable.'),
    ]),
    ability: group('ability', 'Abilities', [
        action('jobAbility', 'Job Ability', 'Use a job ability with recast tracking.'),
        action('traitInspect', 'Traits', 'Inspect passive traits.'),
    ]),
    item: group('item', 'Items', [
        action('useItem', 'Use Item', 'Use a consumable or triggered item.'),
        action('equip', 'Equip', 'Equip an item into a valid slot.'),
    ]),
    travel: group('travel', 'Travel', [
        action('move', 'Move Coordinate', 'Move within the current zone coordinate using 8-way navigation.'),
        action('travel', 'Travel Zone', 'Travel to a connected zone.'),
        action('mount', 'Mount', 'Use a mount where unlocked and allowed.'),
    ]),
    social: group('social', 'Social / NPC', [
        action('talk', 'Talk', 'Talk to an NPC.'),
        action('trade', 'Trade', 'Trade items or currency.'),
        action('quest', 'Quest', 'Inspect or progress quests.'),
    ]),
});

export function describeControls() {
    return [
        'Resource Bars:',
        ...RESOURCE_BARS.map((item) => `- ${item.label}: ${item.currentPath} / ${item.maxPath}`),
        '',
        `Timer Bar: ${LIVE_TIMER_BAR.label} - ${LIVE_TIMER_BAR.description}`,
        '',
        '8-Way Coordinate Compass:',
        ...NAV_KEYPAD.map((item) => `- ${item.id}: ${item.label} (${item.dx}, ${item.dy})`),
        '',
        'Action Groups:',
        ...Object.values(ACTION_CONTROL_GROUPS).map((controlGroup) => `- ${controlGroup.label}: ${controlGroup.actions.map((action) => action.label).join(', ')}`),
    ].join('\n');
}

function bar(id, label, currentPath, maxPath) {
    return Object.freeze({ id, label, currentPath, maxPath });
}

function nav(id, label, dx, dy) {
    return Object.freeze({ id, label, dx, dy });
}

function group(id, label, actions) {
    return Object.freeze({ id, label, actions });
}

function action(id, label, description) {
    return Object.freeze({ id, label, description });
}
