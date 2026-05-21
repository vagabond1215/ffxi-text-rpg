const ALIASES = Object.freeze({
    '?': 'help',
    h: 'help',
    l: 'look',
    char: 'character',
    status: 'character',
    stat: 'stats',
    i: 'inventory',
    inv: 'inventory',
    npc: 'npcs',
    enemy: 'enemies',
});

export function parseCommand(rawCommand) {
    const input = String(rawCommand ?? '').trim();
    if (!input) {
        return {
            raw: rawCommand,
            input: '',
            command: '',
            args: [],
            named: {},
        };
    }

    const tokens = tokenize(input);
    const commandToken = tokens.shift()?.toLowerCase() ?? '';
    const command = ALIASES[commandToken] ?? commandToken;
    const { args, named } = parseArgs(tokens);

    return {
        raw: rawCommand,
        input,
        command,
        args,
        named,
    };
}

export function tokenize(input) {
    const tokens = [];
    let current = '';
    let quote = null;

    for (let index = 0; index < input.length; index += 1) {
        const char = input[index];

        if ((char === '"' || char === "'") && quote === null) {
            quote = char;
            continue;
        }

        if (char === quote) {
            quote = null;
            continue;
        }

        if (/\s/.test(char) && quote === null) {
            if (current) {
                tokens.push(current);
                current = '';
            }
            continue;
        }

        current += char;
    }

    if (current) tokens.push(current);
    return tokens;
}

function parseArgs(tokens) {
    const args = [];
    const named = {};

    for (const token of tokens) {
        if (token.startsWith('--')) {
            const [key, ...valueParts] = token.slice(2).split('=');
            named[toCamelCase(key)] = valueParts.length ? valueParts.join('=') : true;
            continue;
        }

        args.push(token);
    }

    return { args, named };
}

function toCamelCase(value) {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}
