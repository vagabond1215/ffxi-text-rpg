export const FFXI_MACRO_REFERENCE = Object.freeze({
    notes: [
        'FFXI macros execute sequential command lines; retail macros are commonly described as up to six commands.',
        'Action commands usually need waits between lines; equipment set commands generally do not need a wait.',
        'This project treats these as command-surface compatibility references, not final combat implementations.',
    ],
    commands: Object.freeze([
        macro('/ma', 'magic', 'Cast a spell, song, or ninjutsu.', '/ma "Cure" <t>'),
        macro('/magic', 'magic', 'Alias form for /ma.', '/magic "Cure" <t>'),
        macro('/ja', 'jobAbility', 'Use a job ability.', '/ja "Berserk" <me>'),
        macro('/ws', 'weaponSkill', 'Use a weapon skill.', '/ws "Fast Blade" <t>'),
        macro('/ra', 'rangedAttack', 'Perform a ranged attack.', '/ra <t>'),
        macro('/pet', 'pet', 'Use a pet command.', '/pet "Predator Claws" <t>'),
        macro('/item', 'item', 'Use an item from inventory or trade one item to an NPC.', '/item "Potion" <me>'),
        macro('/attack', 'combat', 'Engage the targeted enemy.', '/attack <t>'),
        macro('/target', 'targeting', 'Target a named object or unit.', '/target PlayerName'),
        macro('/targetnpc', 'targeting', 'Target the closest NPC or monster.', '/targetnpc'),
        macro('/targetbnpc', 'targeting', 'Target the closest enemy NPC.', '/targetbnpc'),
        macro('/assist', 'targeting', 'Target what another character is attacking.', '/assist TheTank'),
        macro('/lockon', 'targeting', 'Lock view/direction to the selected target.', '/lockon'),
        macro('/check', 'information', 'Examine a player or gauge a monster.', '/check <t>'),
        macro('/equip', 'equipment', 'Equip or unequip one gear slot.', '/equip head "Bronze Cap"'),
        macro('/equipset', 'equipment', 'Equip a saved equipment set.', '/equipset 1'),
        macro('/macro', 'macro', 'Change active macro set or book.', '/macro set 5'),
        macro('/wait', 'macro', 'Delay macro execution.', '/wait 1'),
        macro('<wait>', 'macro', 'Inline wait token appended to another macro line.', '/ma "Cure" <t> <wait 1>'),
        macro('/recast', 'information', 'Display recast time for a spell or job ability.', '/recast "Provoke"'),
        macro('/pcmd', 'party', 'Run a party command.', '/pcmd add "PlayerName"'),
        macro('/acmd', 'alliance', 'Run an alliance command.', '/acmd leader "PlayerName"'),
        macro('/p', 'chat', 'Send a party chat message.', '/p Hello Party!'),
        macro('/l', 'chat', 'Send a linkshell chat message.', '/l Hello LS!'),
        macro('/echo', 'chat', 'Display text only to yourself.', '/echo Ready.'),
    ]),
    targets: Object.freeze([
        target('<me>', 'Self.'),
        target('<t>', 'Current target.'),
        target('<bt>', 'Last monster claimed by party.'),
        target('<ht>', 'Call for Help target.'),
        target('<ft>', 'Adventuring Fellow target.'),
        target('<st>', 'Subtarget prompt.'),
        target('<stpc>', 'Subtarget player characters.'),
        target('<stpt>', 'Subtarget party members.'),
        target('<stal>', 'Subtarget alliance members.'),
        target('<stnpc>', 'Subtarget NPCs.'),
        target('<lastst>', 'Last selected subtarget.'),
        target('<r>', 'Last player who sent a tell.'),
        target('<pet>', 'Active pet.'),
        target('<scan>', 'Wide scan target.'),
        target('<p0>-<p5>', 'Party members, with <p0> as self.'),
        target('<a10>-<a25>', 'Alliance member slots.'),
    ]),
    placeholders: Object.freeze([
        '<hp>', '<hpp>', '<mp>', '<mpp>', '<tp>', '<pos>', '<job>', '<mjob>', '<sjob>', '<recast="Name">', '<call1>-<call21>', '<ncall1>-<ncall21>', '<scall1>-<scall21>',
    ]),
});

export function describeFfxiMacroReference() {
    return [
        'FFXI Macro/Text Command Reference:',
        '',
        'Common commands:',
        ...FFXI_MACRO_REFERENCE.commands.map((item) => `- ${item.command} [${item.category}] ${item.description} Example: ${item.example}`),
        '',
        'Target placeholders:',
        ...FFXI_MACRO_REFERENCE.targets.map((item) => `- ${item.token}: ${item.description}`),
        '',
        `Informational placeholders: ${FFXI_MACRO_REFERENCE.placeholders.join(', ')}`,
    ].join('\n');
}

export function findFfxiMacroCommand(command) {
    return FFXI_MACRO_REFERENCE.commands.find((item) => item.command === command) ?? null;
}

function macro(command, category, description, example) {
    return Object.freeze({ command, category, description, example });
}

function target(token, description) {
    return Object.freeze({ token, description });
}
