export const COMMON_COMMAND_CHIPS = Object.freeze([
    ['/look', 'Look'],
    ['/stats', 'Stats'],
    ['/inventory', 'Inventory'],
    ['/equipment', 'Equipment'],
    ['/containers', 'Containers'],
    ['/here', 'Here'],
    ['/maps', 'Maps'],
    ['/atlas', 'Atlas'],
    ['/move n', 'North'],
    ['/move e', 'East'],
    ['/move s', 'South'],
    ['/move w', 'West'],
    ['/travel', 'Travel'],
    ['/save', 'Save'],
]);

export function renderMainMenuPanel() {
    return `
        <section class="sidebar-section main-menu-panel">
            <h3>Main Menu</h3>
            <p class="sidebar-note">Create, load, inspect, and save without memorizing every slash command.</p>
            <div class="primary-actions">
                <button type="button" data-command="/newcharacter">New Character</button>
                <button type="button" data-command="/characters">Characters</button>
                <button type="button" data-command="/save">Save</button>
                <button type="button" data-command="/commands">All Commands</button>
            </div>
        </section>
    `;
}

export function renderCommandChips(commands = COMMON_COMMAND_CHIPS) {
    return `
        <section class="sidebar-section">
            <h3>Command Chips</h3>
            <div class="command-chip-grid">
                ${commands.map(([command, label]) => `<button type="button" class="command-chip" data-command="${escapeHtml(command)}">${escapeHtml(label)}</button>`).join('')}
            </div>
        </section>
    `;
}

export function renderCharacterCards(characters = []) {
    const cards = characters.length
        ? characters.map(renderCharacterCard).join('')
        : '<p class="sidebar-note">No saved characters yet. Use New Character to create one.</p>';

    return `
        <section class="sidebar-section">
            <h3>Character Slots</h3>
            <div class="character-card-list">
                ${cards}
            </div>
        </section>
    `;
}

export function renderFeedback(feedback = null) {
    if (!feedback) return '';
    return `
        <section class="sidebar-section feedback feedback-${escapeHtml(feedback.kind)}" role="status" aria-live="polite">
            <h3>Last Action</h3>
            <div class="feedback-command">${escapeHtml(feedback.command)}</div>
            <p>${escapeHtml(feedback.message)}</p>
        </section>
    `;
}

export function classifyCommandFeedback(command, response) {
    const text = String(response ?? '').trim();
    const normalized = text.toLowerCase();
    const isFailure = /failed|invalid|unknown|not enough|no matching|no saved|cannot|blocked|missing|not implemented/.test(normalized);
    const isSuccess = /saved|loaded|created|equipped|unequipped|transferred|bought|moved|arrived|fast traveled|advanced/.test(normalized);
    return {
        command: String(command ?? '').trim(),
        message: firstMeaningfulLine(text) || 'Command completed.',
        kind: isFailure ? 'error' : isSuccess ? 'success' : 'info',
    };
}

function renderCharacterCard(record) {
    return `
        <article class="character-card">
            <div>
                <strong>${escapeHtml(record.name)}</strong>
                <span>${escapeHtml(record.race)} ${escapeHtml(record.job)} Lv.${escapeHtml(record.level)}</span>
                <span>${escapeHtml(record.nation)} · ${escapeHtml(record.location)}</span>
            </div>
            <button type="button" data-command="/load ${escapeHtml(record.index)}">Load</button>
        </article>
    `;
}

function firstMeaningfulLine(text) {
    return String(text ?? '').split('\n').map((line) => line.trim()).find(Boolean) ?? '';
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
