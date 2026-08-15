import {
    getCreatorSummary,
    getNationOptions,
    getRaceOptions,
    getSexOptions,
    getStartingJobOptions,
    validateCreator,
} from '../systems/characterCreationModel.js';
import { createGameViewModel } from './gameViewModel.js';
import { createMenuActionList } from './uiActions.js';

const PRIMARY_NAV = Object.freeze([
    ['scene', 'Scene'],
    ['character', 'Character'],
    ['spellbook', 'Spellbook'],
    ['journal', 'Journal'],
    ['codex', 'Codex'],
    ['craft', 'Craft'],
    ['world', 'World'],
]);

export function renderDomApp({ state, uiState, session }) {
    const screen = uiState.screen ?? 'menu';
    let content = '';
    if (screen === 'game') content = renderGameScreen(createGameViewModel(state, uiState), uiState, session);
    else if (screen === 'creator') content = renderCreatorScreen(uiState, session);
    else if (screen === 'creatorIntro') content = renderCreatorIntro(state, uiState, session);
    else content = renderMenuScreen(session, uiState);

    return `<div class="hh-app">${content}${renderModal(session, uiState)}</div>`;
}

export function renderGameScreen(model, uiState = {}, session = {}) {
    return `
        ${renderHeader(model, uiState, session)}
        <main class="game-layout">
            ${renderExplorationColumn(model)}

            <section class="scene-column" aria-live="polite">
                ${renderPrimaryView(model, uiState.activeView ?? 'scene')}
                ${renderContextActions(model.contextualActions)}
                ${renderActivityFeed(model.scene.recent)}
            </section>

            <aside class="status-column" aria-label="Character status">
                ${renderCharacterStatus(model.character)}
                ${renderActivityStatus(model.activity)}
            </aside>
        </main>
        ${renderOmnibox()}
    `;
}

function renderExplorationColumn(model) {
    if (model.navigation?.mode !== 'exploration') return '';
    return `
        <aside class="map-column" aria-label="Local navigation">
            <section class="panel map-panel">
                <div class="panel-heading">
                    <span>Local Map</span>
                    <small>${escapeHtml(model.map?.exploredCount ?? 0)}/${escapeHtml(model.map?.totalCount ?? 0)} explored</small>
                </div>
                ${renderMinimap(model.map)}
                ${renderMovementPad(model.movement)}
            </section>
        </aside>
    `;
}

export function renderCreatorScreen(uiState, session = {}) {
    const creator = uiState.creator ?? {};
    const races = getRaceOptions();
    const origins = getNationOptions();
    const disciplines = getStartingJobOptions();
    const sexes = getSexOptions(creator);
    const summary = getCreatorSummary(creator);
    const issues = validateCreator(creator);
    const selectedRace = races.find((item) => item.id === creator.raceId) ?? races[0];
    const selectedOrigin = origins.find((item) => item.id === creator.nationId) ?? origins[0];
    const selectedDiscipline = disciplines.find((item) => item.id === creator.mainJobId) ?? disciplines[0];

    return `
        <header class="creation-header">
            <div>
                <p class="eyebrow">Hearth &amp; Horizon</p>
                <h1>Create Character</h1>
                <p class="muted">Choose a beginning, not a permanent class. Everything here sets your opening circumstances.</p>
            </div>
            <button type="button" class="quiet-button" data-intent="creator.cancel">Cancel</button>
        </header>

        <main class="creator-layout">
            <section class="creator-form panel">
                <label class="creator-name-label" for="creator-name">Name</label>
                <input id="creator-name" class="creator-name-input" maxlength="24" autocomplete="off" value="${escapeAttr(creator.name ?? '')}" placeholder="Character name">

                ${renderChoiceSection('Ancestry', races, creator.raceId, 'race', selectedRace?.blurb, selectedRace?.tags)}
                ${renderChoiceSection('Sex', sexes, creator.sex, 'sex')}
                ${renderChoiceSection('Origin', origins, creator.nationId, 'nation', selectedOrigin?.blurb, selectedOrigin?.tags)}
                ${renderChoiceSection('Starting Discipline', disciplines, creator.mainJobId, 'job', selectedDiscipline?.blurb, selectedDiscipline?.tags)}
            </section>

            <aside class="creator-summary panel">
                <p class="eyebrow">Starting Profile</p>
                <h2>${escapeHtml(summary.name)}</h2>
                <dl class="summary-list">
                    <div><dt>Ancestry</dt><dd>${escapeHtml(summary.race)} · ${escapeHtml(summary.sex)}</dd></div>
                    <div><dt>Origin</dt><dd>${escapeHtml(summary.nation)}</dd></div>
                    <div><dt>Start</dt><dd>${escapeHtml(summary.startingCity)}</dd></div>
                    <div><dt>Region</dt><dd>${escapeHtml(summary.starterRegion)}</dd></div>
                    <div><dt>Training</dt><dd>${escapeHtml(summary.job)}</dd></div>
                </dl>
                <p class="creator-rule">Your starting discipline is initial training. It does not erase or forbid capabilities learned later.</p>
                ${issues.length ? `<p class="form-error" role="alert">${escapeHtml(issues[0])}</p>` : ''}
                <button type="button" class="primary-button creator-submit" data-intent="creator.confirm" ${issues.length ? 'disabled' : ''}>Create Character</button>
                ${session?.displayName ? `<small class="muted">Account: ${escapeHtml(session.displayName)}</small>` : ''}
            </aside>
        </main>
    `;
}

export function renderMenuScreen(session = {}, uiState = {}) {
    const loggedIn = Boolean(session.loggedIn);
    const characters = session.characters ?? [];
    return `
        <main class="landing-screen">
            <section class="landing-card panel">
                <p class="eyebrow">Persistent fantasy life RPG</p>
                <h1>Hearth &amp; Horizon</h1>
                <p class="landing-copy">Build one life across settlements, roads, wild country, work, craft, relationships, danger, and discovery.</p>
                ${uiState.activeFeedback ? `<p class="landing-feedback" role="status">${escapeHtml(uiState.activeFeedback)}</p>` : ''}
                ${loggedIn ? renderCharacterSelection(session, characters) : renderAccountLanding(session)}
            </section>
        </main>
    `;
}

export function renderCreatorIntro(state, uiState, session = {}) {
    const intro = (uiState.creatorIntro ?? []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
    return `
        <main class="landing-screen">
            <section class="landing-card panel intro-card">
                <p class="eyebrow">${escapeHtml(state.player.identity.raceName)} · ${escapeHtml(state.player.jobs.mainJobName)}</p>
                <h1>${escapeHtml(state.player.identity.name)}</h1>
                <div class="intro-prose">${intro}</div>
                <button type="button" class="primary-button" data-intent="creator.begin">Begin</button>
                ${session?.displayName ? `<small class="muted">Saved to ${escapeHtml(session.displayName)}</small>` : ''}
            </section>
        </main>
    `;
}

export function renderMinimap(map) {
    if (!map) return '<div class="minimap-empty">No local map knowledge.</div>';
    const width = Math.max(1, map.width);
    const height = Math.max(1, map.height);
    const cell = 20;
    const pad = 10;
    const svgWidth = width * cell + pad * 2;
    const svgHeight = height * cell + pad * 2;
    const center = (point) => ({ x: pad + (point.x + 0.5) * cell, y: pad + (point.y + 0.5) * cell });

    const connections = (map.connections ?? []).map((connection) => {
        const from = center(connection.from);
        const to = center(connection.to);
        const ratio = connection.targetVisited ? 1 : connection.exit ? 0.68 : 0.45;
        const tx = from.x + (to.x - from.x) * ratio;
        const ty = from.y + (to.y - from.y) * ratio;
        const classes = ['map-link', connection.exit ? 'map-link-exit' : '', connection.currentSource ? 'map-link-current' : ''].filter(Boolean).join(' ');
        return `<line class="${classes}" x1="${from.x}" y1="${from.y}" x2="${tx}" y2="${ty}"></line>`;
    }).join('');

    const cells = (map.cells ?? []).map((entry) => {
        const point = center(entry);
        return entry.current
            ? `<circle class="map-cell map-current" cx="${point.x}" cy="${point.y}" r="5"><title>Current: ${escapeHtml(map.currentLabel)}</title></circle>`
            : `<rect class="map-cell" x="${point.x - 3.5}" y="${point.y - 3.5}" width="7" height="7"><title>${escapeHtml(entry.key)}</title></rect>`;
    }).join('');

    return `
        <div class="minimap-wrap">
            <div class="map-caption"><strong>${escapeHtml(map.placeName)}</strong><span>${escapeHtml(map.currentLabel)}</span></div>
            <svg class="minimap" viewBox="0 0 ${svgWidth} ${svgHeight}" role="img" aria-label="Discovered local map of ${escapeAttr(map.placeName)}">
                ${connections}${cells}
            </svg>
            <div class="map-legend"><span><b class="legend-current"></b> You</span><span><b class="legend-known"></b> Known</span><span>stubs = unrevealed path</span></div>
        </div>
    `;
}

function renderHeader(model, uiState, session) {
    return `
        <header class="game-header">
            <button type="button" class="menu-button" aria-label="Open menu" data-intent="ui.menu.open">☰</button>
            <div class="place-heading">
                <strong>${escapeHtml(model.header.placeName)}</strong>
                <span>${escapeHtml(model.header.region)} · ${escapeHtml(model.header.coordinate)}</span>
            </div>
            <nav class="primary-nav" aria-label="Game views">
                ${PRIMARY_NAV.map(([id, label]) => `<button type="button" data-view="${id}" class="${(uiState.activeView ?? 'scene') === id ? 'selected' : ''}">${label}</button>`).join('')}
            </nav>
            <div class="time-status">
                <strong>${escapeHtml(model.header.worldTime)}</strong>
                <span>${model.header.paused ? 'Paused' : `${escapeHtml(model.header.speedMultiplier)}×`}</span>
                ${session?.displayName ? `<small>${escapeHtml(session.displayName)}</small>` : ''}
            </div>
        </header>
    `;
}

function renderPrimaryView(model, viewId) {
    if (viewId === 'character') return renderCharacterView(model);
    if (viewId === 'spellbook') return renderSpellbookView();
    if (viewId === 'journal') return renderJournalView(model);
    if (viewId === 'codex') return renderCodexView();
    if (viewId === 'craft') return renderCraftView();
    if (viewId === 'world') return renderWorldView(model);
    return renderSceneView(model);
}

function renderSceneView(model) {
    const nearby = model.scene.nearby.length
        ? model.scene.nearby.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(formatType(entry.type))}</small></div><p>${escapeHtml(entry.notes)}</p></article>`).join('')
        : '<p class="empty-note">Nothing notable is immediately beside you.</p>';
    return `
        <section class="panel primary-view scene-view">
            <p class="eyebrow">${escapeHtml(model.scene.region)} · danger ${escapeHtml(model.scene.dangerLevel)}</p>
            <h1>${escapeHtml(model.scene.title)}</h1>
            <p class="scene-description">${escapeHtml(model.scene.description)}</p>
            <h2>Nearby</h2>
            <div class="nearby-list">${nearby}</div>
        </section>
    `;
}

function renderCharacterView(model) {
    return `
        <section class="panel primary-view">
            <p class="eyebrow">Continuous Character</p>
            <h1>${escapeHtml(model.character.name)}</h1>
            <p class="muted">${escapeHtml(model.character.ancestry)} · ${escapeHtml(model.character.discipline)} Lv.${escapeHtml(model.character.level)}</p>
            <div class="attribute-grid large-attributes">${model.character.attributes.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join('')}</div>
            <div class="view-links">
                ${commandButton('Inventory', 'inventory')}
                ${commandButton('Equipment', 'equipment')}
                ${commandButton('Skills', 'skills')}
                ${commandButton('Training', 'job')}
            </div>
        </section>
    `;
}

function renderSpellbookView() {
    return `
        <section class="panel primary-view">
            <p class="eyebrow">Prepared knowledge</p>
            <h1>Spellbook &amp; Techniques</h1>
            <p class="muted">Canonical abilities and techniques execute through structured effects; this view remains a compact knowledge surface rather than a permanent action catalog.</p>
            <div class="view-links">
                ${commandButton('Known Spells', 'spells')}
                ${commandButton('Techniques', 'techniques')}
                ${commandButton('Abilities', 'abilities')}
                ${commandButton('Skills', 'skills')}
            </div>
        </section>
    `;
}

function renderJournalView(model) {
    return `
        <section class="panel primary-view">
            <p class="eyebrow">What matters now</p>
            <h1>Journal</h1>
            ${model.activity ? `<div class="journal-activity"><strong>${escapeHtml(model.activity.label)}</strong><span>${escapeHtml(model.activity.detail)}</span></div>` : '<p class="empty-note">No timed activity is currently underway.</p>'}
            <p class="muted">Quest and commitment records will appear here as their canonical state systems mature. Recent meaningful output remains visible below.</p>
        </section>
    `;
}

function renderCodexView() {
    return `
        <section class="panel primary-view">
            <p class="eyebrow">Known world</p>
            <h1>Codex</h1>
            <p class="muted">Reference surfaces should reflect what the character has learned, not expose the whole authored database.</p>
            <div class="view-links">
                ${commandButton('Bestiary', 'bestiary')}
                ${commandButton('Known Maps', 'maps')}
                ${commandButton('Places', 'places')}
            </div>
        </section>
    `;
}

function renderCraftView() {
    return `
        <section class="panel primary-view">
            <p class="eyebrow">Production</p>
            <h1>Craft &amp; Process</h1>
            <p class="empty-note">Canonical recipe/process state is not implemented yet. This view intentionally stays quiet rather than presenting legacy craft labels as finished gameplay.</p>
        </section>
    `;
}

function renderWorldView(model) {
    return `
        <section class="panel primary-view world-view">
            <p class="eyebrow">Acquired knowledge</p>
            <h1>${escapeHtml(model.header.placeName)}</h1>
            ${model.map ? renderMinimap(model.map) : '<p class="empty-note">This safe locality is navigated by named destinations; detailed cartography is reserved for places where terrain matters.</p>'}
            <div class="view-links">
                ${commandButton('Local Atlas', 'atlas')}
                ${commandButton('Known Maps', 'maps')}
                ${commandButton('Known Exits', 'exits')}
            </div>
        </section>
    `;
}

function renderContextActions(actions) {
    if (!actions?.length) return '';
    return `
        <section class="context-bar" aria-label="Context actions">
            ${actions.map((action) => `<button type="button" class="context-action context-${escapeAttr(action.kind ?? 'action')}" data-context-action="${escapeAttr(action.id)}">${escapeHtml(action.label)}</button>`).join('')}
        </section>
    `;
}

function renderMovementPad(actions) {
    const byDirection = new Map(actions.map((item) => [item.direction, item]));
    const order = ['northwest', 'north', 'northeast', 'west', null, 'east', 'southwest', 'south', 'southeast'];
    return `
        <div class="movement-pad" aria-label="Movement controls">
            ${order.map((direction) => {
                if (!direction) return '<button type="button" class="movement-stop" aria-label="Stop movement" data-intent="navigation.stop">■</button>';
                const action = byDirection.get(direction);
                return `<button type="button" aria-label="Move ${direction}" data-move="${direction}" ${action?.disabled ? 'disabled' : ''}>${escapeHtml(action?.label ?? '')}</button>`;
            }).join('')}
        </div>
    `;
}

function renderCharacterStatus(character) {
    return `
        <section class="panel status-panel">
            <p class="eyebrow">Character</p>
            <h2>${escapeHtml(character.name)}</h2>
            <p class="muted">${escapeHtml(character.ancestry)} · ${escapeHtml(character.discipline)} Lv.${escapeHtml(character.level)}</p>
            <div class="resource-stack">
                ${character.resources.map((item) => `
                    <div class="resource-row resource-${item.id}">
                        <div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.current)}/${escapeHtml(item.max)}</strong></div>
                        <div class="meter"><span style="--value:${Math.round(item.ratio * 100)}%"></span></div>
                    </div>
                `).join('')}
            </div>
            <div class="attribute-grid">${character.attributes.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join('')}</div>
        </section>
    `;
}

function renderActivityStatus(activity) {
    if (!activity) return '<section class="panel activity-panel"><p class="eyebrow">Current Activity</p><strong>None</strong></section>';
    return `
        <section class="panel activity-panel">
            <p class="eyebrow">Current Activity</p>
            <strong>${escapeHtml(activity.label)}</strong>
            <span>${escapeHtml(activity.detail)}</span>
            <div class="meter activity-meter"><span style="--value:${Math.round(activity.progress * 100)}%"></span></div>
            <small>${escapeHtml(formatDuration(activity.remainingSeconds))} remaining</small>
        </section>
    `;
}

function renderActivityFeed(lines) {
    if (!lines?.length) return '';
    return `
        <section class="activity-feed" aria-label="Recent events">
            <div class="activity-feed-heading"><span>Recent</span><button type="button" data-view="journal">Open Journal</button></div>
            <div class="activity-feed-lines">${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>
        </section>
    `;
}

function renderOmnibox() {
    return `
        <form class="omnibox" id="omnibox-form">
            <label class="sr-only" for="omnibox-input">Search or act</label>
            <span aria-hidden="true">›</span>
            <input id="omnibox-input" autocomplete="off" placeholder="Search or act…  (travel, inventory, talk, item, place, command)">
            <button type="submit">Go</button>
        </form>
    `;
}

function renderChoiceSection(title, options, selectedId, kind, description = '', tags = []) {
    return `
        <fieldset class="creator-choice-section">
            <legend>${escapeHtml(title)}</legend>
            <div class="choice-grid choice-${kind}">
                ${options.map((option) => `<button type="button" class="choice-button ${option.id === selectedId ? 'selected' : ''}" data-creator-choice="${escapeAttr(kind)}" data-value="${escapeAttr(option.id)}"><strong>${escapeHtml(option.name)}</strong>${option.abbreviation ? `<small>${escapeHtml(option.abbreviation)}</small>` : ''}</button>`).join('')}
            </div>
            ${description ? `<p class="choice-description">${escapeHtml(description)}</p>` : ''}
            ${tags?.length ? `<div class="choice-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        </fieldset>
    `;
}

function renderCharacterSelection(session, characters) {
    const cards = characters.length
        ? characters.map((character) => `
            <button type="button" class="character-select-card" data-character-id="${escapeAttr(character.id)}">
                <strong>${escapeHtml(character.name)}</strong>
                <span>${escapeHtml(character.job)} Lv.${escapeHtml(character.level)}</span>
                <small>${escapeHtml(character.location ?? '')}</small>
            </button>
        `).join('')
        : '<p class="empty-note">No characters yet.</p>';
    return `
        <div class="landing-account">${escapeHtml(session.displayName ?? '')}</div>
        <div class="character-select-list">${cards}</div>
        <div class="landing-actions">
            <button type="button" class="primary-button" data-intent="creator.open">${characters.length ? 'New Character' : 'Create Character'}</button>
            <button type="button" class="quiet-button" data-intent="ui.menu.open">Account &amp; Settings</button>
        </div>
    `;
}

function renderAccountLanding(session) {
    const hasAccounts = Boolean(session.accounts?.length);
    return `
        <div class="landing-actions">
            ${hasAccounts ? '<button type="button" class="primary-button" data-intent="account.login.open">Login</button>' : ''}
            <button type="button" class="${hasAccounts ? 'quiet-button' : 'primary-button'}" data-intent="account.create.open">Create Local Account</button>
        </div>
        <small class="muted">Local saves stay in this browser. No network account is required.</small>
    `;
}

function renderModal(session, uiState) {
    if (!uiState.modal) return '';
    const modal = uiState.modal;
    let body = '';

    if (modal === 'createAccount') {
        body = `
            <h2>Create Local Account</h2>
            <label>Account name<input data-modal-field="accountName" autocomplete="username" value="${escapeAttr(uiState.modalInputs?.accountName ?? '')}"></label>
            <label>Passphrase<input type="password" data-modal-field="password" autocomplete="new-password" value="${escapeAttr(uiState.modalInputs?.password ?? '')}"></label>
            <button type="button" class="primary-button" data-menu-action="confirmCreateAccount">Create Account</button>
        `;
    } else if (modal === 'login') {
        body = `
            <h2>Choose Account</h2>
            <div class="modal-action-list">${createMenuActionList(session, 'login').map(renderMenuAction).join('')}</div>
        `;
    } else if (modal === 'loginPassword') {
        body = `
            <h2>Login</h2>
            <label>Passphrase<input type="password" data-modal-field="password" autocomplete="current-password" value="${escapeAttr(uiState.modalInputs?.password ?? '')}"></label>
            <button type="button" class="primary-button" data-menu-action="confirmLogin">Login</button>
        `;
    } else if (modal === 'settings') {
        body = `
            <h2>Settings</h2>
            <div class="modal-action-list">${createMenuActionList(session, 'settings', uiState.modalPage).map(renderMenuAction).join('')}</div>
        `;
    } else {
        body = `
            <h2>Menu</h2>
            <div class="modal-action-list">
                <button type="button" data-command="save">Save</button>
                ${createMenuActionList(session, 'mainMenu').map(renderMenuAction).join('')}
            </div>
        `;
    }

    return `
        <div class="modal-backdrop" role="presentation">
            <section class="modal-card panel" role="dialog" aria-modal="true">
                <button type="button" class="modal-close" aria-label="Close" data-intent="ui.modal.close">×</button>
                ${body}
            </section>
        </div>
    `;
}

function renderMenuAction(action) {
    if (action.kind === 'command') return `<button type="button" data-command="${escapeAttr(action.payload?.command ?? action.command ?? '')}" ${action.disabled ? 'disabled' : ''}>${escapeHtml(action.label)}</button>`;
    return `<button type="button" data-menu-action="${escapeAttr(action.id)}" ${action.disabled ? 'disabled' : ''}>${escapeHtml(action.label)}</button>`;
}

function commandButton(label, command) {
    return `<button type="button" data-command="${escapeAttr(command)}">${escapeHtml(label)}</button>`;
}

function formatType(value) {
    return String(value ?? '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ');
}

function formatDuration(seconds) {
    const total = Math.max(0, Number(seconds) || 0);
    if (total < 60) return `${Math.ceil(total)}s`;
    if (total < 3600) return `${Math.ceil(total / 60)}m`;
    const hours = Math.floor(total / 3600);
    const minutes = Math.ceil((total % 3600) / 60);
    return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
    return escapeHtml(value).replaceAll('`', '&#096;');
}