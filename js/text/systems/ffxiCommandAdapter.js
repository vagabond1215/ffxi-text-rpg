import { describeFfxiMacroReference, findFfxiMacroCommand } from '../data/ffxiMacroCommands.js';
import { describeEquipment, describeJobAbilities, describeSpells, describeWeaponSkills } from './menuDescriptions.js';

const COMMAND_ALIASES = Object.freeze({
    '/magic': '/ma',
    '/weaponskill': '/ws',
    '/weaponSkill': '/ws',
    '/rangedattack': '/ra',
    '/rangedAttack': '/ra',
});

export function isFfxiSlashCommand(parsed) {
    return String(parsed.command ?? '').startsWith('/');
}

export function routeFfxiSlashCommand(state, parsed) {
    const command = normalizeSlashCommand(parsed.command);
    const macro = findFfxiMacroCommand(command);

    switch (command) {
        case '/macrohelp':
        case '/commands':
            return describeFfxiMacroReference();
        case '/ma':
            return describeActionStub('Magic', parsed.args, '<t>', describeSpells(state));
        case '/ja':
            return describeActionStub('Job Ability', parsed.args, '<me>', describeJobAbilities(state));
        case '/ws':
            return describeActionStub('Weapon Skill', parsed.args, '<t>', describeWeaponSkills());
        case '/ra':
            return `Ranged attack queued against ${parsed.args[0] ?? '<t>'}. Combat execution is not implemented yet.`;
        case '/item':
            return describeActionStub('Item', parsed.args, '<me>', 'Item use will route through inventory and consumable systems later.');
        case '/equip':
            return describeEquip(parsed.args, state);
        case '/equipset':
            return `Equipset ${parsed.args[0] ?? '?'} selected. Equipset storage is not implemented yet.`;
        case '/wait':
            return `Macro wait requested: ${parsed.args[0] ?? '1'} second(s). Use plain wait <seconds> to advance game time for now.`;
        case '/recast':
            return `Recast check requested for ${parsed.args.join(' ') || '<current action>'}. Cooldown tracking is not implemented yet.`;
        case '/target':
        case '/targetnpc':
        case '/targetbnpc':
        case '/assist':
            return `Target command accepted: ${command} ${parsed.args.join(' ')}. Target state is not implemented yet.`.trim();
        case '/attack':
            return `Attack command accepted against ${parsed.args[0] ?? '<t>'}. Battle targeting hookup is not implemented yet.`;
        case '/check':
            return `Check command requested for ${parsed.args[0] ?? '<t>'}. Detailed target inspection is not implemented yet.`;
        case '/echo':
            return parsed.args.join(' ') || '(echo)';
        case '/p':
        case '/l':
        case '/linkshell':
        case '/say':
        case '/s':
        case '/tell':
        case '/t':
            return `Chat command ${command}: ${parsed.args.join(' ')}`;
        default:
            return macro
                ? `${macro.command} recognized: ${macro.description}\nExample: ${macro.example}\nRuntime behavior is not implemented yet.`
                : `Unknown FFXI-style command: ${parsed.command}. Try /macrohelp.`;
    }
}

function normalizeSlashCommand(command) {
    const normalized = String(command ?? '').trim();
    return COMMAND_ALIASES[normalized] ?? normalized;
}

function describeActionStub(label, args, defaultTarget, referenceText) {
    const action = args[0] ?? '<action>';
    const target = args[1] ?? defaultTarget;
    return [
        `${label} command accepted: ${action} -> ${target}.`,
        'Execution hooks are not implemented yet.',
        '',
        referenceText,
    ].join('\n');
}

function describeEquip(args, state) {
    const slot = args[0] ?? '<slot>';
    const item = args.slice(1).join(' ') || '<item>';
    return [
        `Equip command accepted: ${slot} -> ${item}.`,
        'Direct equipment mutation is not implemented yet.',
        '',
        describeEquipment(state),
    ].join('\n');
}
