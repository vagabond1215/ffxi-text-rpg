export function createInitialState() {
    return {
        version: 1,
        location: 'Southern San d\u2019Oria',
        player: {
            name: 'Adventurer',
            race: 'Hume',
            mainJob: 'Warrior',
            level: 1,
            gil: 0,
        },
        inventory: [],
        flags: {},
        log: [],
    };
}

export function describeLocation(state) {
    return [
        `You are in ${state.location}.`,
        '',
        'The old interface has been stripped back to a text-only command shell.',
        'Systems will be rebuilt here deliberately: state, commands, travel, combat, vendors, quests, and persistence.',
    ].join('\n');
}

export function describeCharacter(state) {
    const { player } = state;
    return [
        `${player.name}`,
        `Race: ${player.race}`,
        `Job: ${player.mainJob} Lv.${player.level}`,
        `Gil: ${player.gil}`,
        `Location: ${state.location}`,
    ].join('\n');
}

export function describeInventory(state) {
    if (!state.inventory.length) {
        return 'Inventory is empty.';
    }

    return state.inventory
        .map((item, index) => `${index + 1}. ${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`)
        .join('\n');
}

export function appendLog(state, entry) {
    state.log.push({
        at: new Date().toISOString(),
        entry,
    });

    if (state.log.length > 100) {
        state.log.splice(0, state.log.length - 100);
    }
}
