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
        ${renderOmnibox(model.information?.search?.query ?? '')}
    `;
}

function renderExplorationColumn(model) {
    if (model.navigation?.mode !== 'exploration') return '';
    return `
        <aside class="map-column" aria-label="Local navigation">
            <section class="panel map-panel">
                <div class="panel-heading">
                    <span>Local Map</span>
                    <small>${escapeHtml(model.map?.exploredCount ?? 0)} places traced</small>
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
            <div class="map-legend"><span><b class="legend-current"></b> You</span><span><b class="legend-known"></b> Known</span><span>faint paths = not yet traveled</span></div>
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
    if (viewId === 'spellbook') return renderSpellbookView(model);
    if (viewId === 'journal') return renderJournalView(model);
    if (viewId === 'codex') return renderCodexView(model);
    if (viewId === 'craft') return renderCraftView(model);
    if (viewId === 'world') return renderWorldView(model);
    return renderSceneView(model);
}

function renderSceneView(model) {
    const nearby = model.scene.nearby.length
        ? model.scene.nearby.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(formatType(entry.type))}</small></div><p>${escapeHtml(entry.notes)}</p></article>`).join('')
        : '<p class="empty-note">Nothing notable is immediately beside you.</p>';
    return `
        <section class="panel primary-view scene-view">
            <p class="eyebrow">${escapeHtml(model.scene.region)} · ${escapeHtml(formatDanger(model.scene.dangerLevel))}</p>
            <h1>${escapeHtml(model.scene.title)}</h1>
            <p class="scene-description">${escapeHtml(model.scene.description)}</p>
            <h2>Nearby</h2>
            <div class="nearby-list">${nearby}</div>
        </section>
    `;
}

function renderCharacterView(model) {
    const preparation = model.information?.preparation;
    const equipped = preparation?.equipment?.length
        ? preparation.equipment.map((entry) => `
            <article class="nearby-card">
                <div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.slotLabel)}</small></div>
                ${informationActionButton(entry.action)}
            </article>
        `).join('')
        : '<p class="empty-note">No equipment is currently worn.</p>';
    const carried = preparation?.containers?.length
        ? preparation.containers.map((container) => `
            <section class="opportunity-group">
                <div class="panel-heading opportunity-group-heading"><h3>${escapeHtml(container.label)}</h3><small>${escapeHtml(container.used)}/${escapeHtml(container.capacity)} slots</small></div>
                <div class="nearby-list">${container.items.length ? container.items.map((item) => `
                    <article class="nearby-card">
                        <div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.quantity)} · ${escapeHtml(formatType(item.kind))}</small></div>
                        ${item.consumptionLabel ? `<p class="muted item-consumption-label">${escapeHtml(item.consumptionLabel)}</p>` : ''}
                        ${item.blocker ? `<p class="muted">${escapeHtml(item.blocker)}</p>` : ''}
                        ${informationActionButton(item.action)}
                    </article>
                `).join('') : '<p class="empty-note">Nothing here.</p>'}</div>
            </section>
        `).join('')
        : '<p class="empty-note">No carried containers are accessible here.</p>';
    const skills = model.information?.skills?.entries?.length
        ? model.information.skills.entries.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.rank ?? 'practice')}</small></div><p>Learned ${escapeHtml(entry.learned)} · effective ${escapeHtml(entry.effective)} / ${escapeHtml(entry.cap)}</p></article>`).join('')
        : '<p class="empty-note">No trained skills are recorded yet.</p>';
    const capabilities = model.information?.capabilities?.entries?.length
        ? model.information.capabilities.entries.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(formatType(entry.kind))}</small></div><p>${escapeHtml(entry.description)}</p></article>`).join('')
        : '<p class="empty-note">No additional capabilities have been learned yet.</p>';
    const companions = model.party?.entries?.length
        ? model.party.entries.map(renderCompanionCard).join('')
        : '<p class="empty-note">No one has joined you on the road yet.</p>';
    return `
        <section class="panel primary-view character-view">
            <p class="eyebrow">Gear &amp; training · ${escapeHtml(preparation?.gil ?? 0)} gil</p>
            <h1>${escapeHtml(model.character.name)}</h1>
            <p class="muted">${escapeHtml(model.character.ancestry)} · ${escapeHtml(model.character.discipline)} Lv.${escapeHtml(model.character.level)}</p>
            <div class="attribute-grid large-attributes">${model.character.attributes.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join('')}</div>
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Equipped</h2><small>${escapeHtml(preparation?.equipment?.length ?? 0)} items</small></div><div class="nearby-list">${equipped}</div></section>
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Carried</h2><small>${escapeHtml(preparation?.itemCount ?? 0)} items</small></div>${carried}</section>
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Skills</h2><small>practice under ${escapeHtml(model.character.discipline)}</small></div><div class="nearby-list">${skills}</div></section>
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Capabilities</h2><small>what you know how to do</small></div><div class="nearby-list">${capabilities}</div></section>
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Traveling company</h2><small>${escapeHtml(model.party?.activeCount ?? 0)} with you</small></div><div class="nearby-list">${companions}</div></section>
        </section>
    `;
}

function renderCompanionCard(entry) {
    const current = entry.currentApproach;
    const approachChoices = entry.approaches?.length
        ? entry.approaches.map((approach) => `
            <article class="nearby-card ${approach.selected ? 'is-recommended' : ''}">
                <div><strong>${escapeHtml(approach.name)}</strong><small>${approach.selected ? 'Current' : 'Alternative'}</small></div>
                <p>${escapeHtml(approach.summary)}</p>
                <p class="muted">${escapeHtml(approach.quote)}</p>
                ${partyActionButton(approach.action)}
            </article>
        `).join('')
        : '';
    const status = entry.active ? 'Traveling with you' : `Staying at ${entry.locationName}`;
    return `
        <article class="nearby-card companion-card">
            <div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.title)} · Lv.${escapeHtml(entry.level)}</small></div>
            ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ''}
            <p class="muted">${escapeHtml(status)} · HP ${escapeHtml(entry.hp)}/${escapeHtml(entry.maxHp)}</p>
            ${current ? `<p><strong>${escapeHtml(current.name)}:</strong> ${escapeHtml(current.summary)}</p><p class="muted">${escapeHtml(current.quote)}</p>` : ''}
            ${entry.active && approachChoices ? `<details class="opportunity-details"><summary>Field approach</summary><div class="nearby-list">${approachChoices}</div></details>` : ''}
            ${partyActionButton(entry.membershipAction)}
        </article>
    `;
}

function renderSpellbookView(model) {
    const entries = model.spellbook?.entries ?? [];
    const content = entries.length
        ? entries.map((entry) => `
            <article class="nearby-card opportunity-card status-${entry.available ? 'ready' : 'blocked'}">
                <div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.schoolName ?? formatType(entry.kind))}</small></div>
                <p>${escapeHtml(entry.cost)} · ${escapeHtml(formatDuration(entry.activationSeconds))} to use${entry.cooldownSeconds ? ` · ${escapeHtml(formatDuration(entry.cooldownSeconds))} recovery` : ''}</p>
                ${entry.available ? '' : `<p class="opportunity-blockers">${escapeHtml(entry.reason ?? 'Not ready now.')}</p>`}
                ${entry.available ? informationActionButton({ id: `information:ability:${entry.id}`, label: `Use ${entry.name}` }) : ''}
            </article>
        `).join('')
        : '<p class="empty-note">No spells or techniques have been learned yet. Capabilities gained through training remain part of the character even when your active discipline changes.</p>';
    return `
        <section class="panel primary-view spellbook-view">
            <p class="eyebrow">Prepared knowledge · ${escapeHtml(entries.length)} known</p>
            <h1>Spellbook &amp; Techniques</h1>
            <p class="muted">These are the spells and techniques you have actually learned. Readiness reflects your current resources, equipment, cooldowns, and situation.</p>
            <div class="nearby-list opportunity-list">${content}</div>
        </section>
    `;
}

function renderJournalView(model) {
    const groups = model.opportunities?.groups ?? [];
    const fallbackEntries = model.opportunities?.entries ?? [];
    const content = groups.length
        ? groups.map((group) => renderOpportunityGroup(group, model.opportunities.recommendedOpportunityId)).join('')
        : fallbackEntries.length
            ? `<div class="nearby-list opportunity-list">${fallbackEntries.map((entry) => renderOpportunityCard(entry, model.opportunities?.recommendedOpportunityId)).join('')}</div>`
            : '<p class="empty-note">No current opportunities are known.</p>';
    return `
        <section class="panel primary-view">
            <p class="eyebrow">What matters now</p>
            <h1>Journal</h1>
            <p class="muted">${escapeHtml(model.opportunities?.prompt ?? 'Choose from the leads you know now. You can change course whenever another goal matters more.')}</p>
            ${model.activity ? `<div class="journal-activity"><strong>${escapeHtml(model.activity.label)}</strong>${model.activity.detail ? `<span>${escapeHtml(model.activity.detail)}</span>` : ''}</div>` : '<p class="empty-note">No timed activity is currently underway.</p>'}
            <div class="opportunity-groups">${content}</div>
        </section>
    `;
}

function renderOpportunityGroup(group, recommendedOpportunityId) {
    const counts = [
        group.activeCount ? `${group.activeCount} active` : null,
        group.readyCount ? `${group.readyCount} ready` : null,
        group.availableCount ? `${group.availableCount} available` : null,
        group.blockedCount ? `${group.blockedCount} blocked` : null,
        group.completeCount ? `${group.completeCount} complete` : null,
    ].filter(Boolean).join(' · ') || 'known';
    const label = group.current ? `${group.label} · current` : group.label;
    const id = `opportunity-group-${group.id}`;
    return `
        <section class="opportunity-group" aria-labelledby="${escapeAttr(id)}">
            <div class="panel-heading opportunity-group-heading">
                <h2 id="${escapeAttr(id)}">${escapeHtml(label)}</h2>
                <small>${escapeHtml(counts)}</small>
            </div>
            <div class="nearby-list opportunity-list">
                ${(group.entries ?? []).map((entry) => renderOpportunityCard(entry, recommendedOpportunityId)).join('')}
            </div>
        </section>
    `;
}

function renderOpportunityCard(entry, recommendedOpportunityId) {
    const requirementList = entry.requirements?.length
        ? `<ul class="opportunity-requirements">${entry.requirements.map((item) => `<li>${item.met ? '✓' : '○'} ${escapeHtml(item.label)}</li>`).join('')}</ul>`
        : '';
    const blockers = entry.blockers?.length
        ? `<p class="opportunity-blockers"><strong>Blocked:</strong> ${escapeHtml(entry.blockers.join(' '))}</p>`
        : '';
    const action = entry.action
        ? `<button type="button" class="primary-button" data-opportunity-action="${escapeAttr(entry.id)}">${escapeHtml(entry.action.label)}</button>`
        : '';
    const isRecommended = recommendedOpportunityId === entry.id;
    const recommended = isRecommended ? '<span class="opportunity-recommended">Suggested next</span>' : '';
    const regionPrefix = entry.regionLabel && String(entry.title).startsWith(`${entry.regionLabel} ·`)
        ? `${entry.regionLabel} ·`
        : null;
    const displayTitle = regionPrefix ? String(entry.title).slice(regionPrefix.length).trimStart() : entry.title;
    const motivation = entry.motivation ?? playerFacingMotivation(entry.category);
    const detailParts = [
        entry.progress ? `<p><strong>Progress:</strong> ${escapeHtml(entry.progress)}</p>` : '',
        requirementList,
    ].filter(Boolean).join('');
    const details = detailParts
        ? `<details class="opportunity-details"><summary>Details</summary>${detailParts}</details>`
        : '';
    const classes = [
        'nearby-card',
        'opportunity-card',
        `status-${escapeAttr(entry.status ?? 'available')}`,
        isRecommended ? 'is-recommended' : '',
    ].filter(Boolean).join(' ');
    return `
        <article class="${classes}">
            <div><strong>${escapeHtml(displayTitle)}</strong><small>${escapeHtml(formatType(entry.category))} · ${escapeHtml(entry.status)}</small></div>
            ${recommended}
            <p>${escapeHtml(entry.summary)}</p>
            ${motivation ? `<p class="opportunity-motivation">${escapeHtml(motivation)}</p>` : ''}
            ${blockers}${details}${action}
        </article>
    `;
}

function renderCodexView(model) {
    const information = model.information;
    const search = information?.search;
    const searchContent = search?.active
        ? `<section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Search results</h2><small>${escapeHtml(search.results.length)} matches</small></div>${search.results.length ? `<div class="nearby-list">${search.results.map((entry) => `
            <article class="nearby-card">
                <div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.category)}</small></div>
                ${entry.detail ? `<p>${escapeHtml(entry.detail)}</p>` : ''}
                ${informationActionButton(entry.action)}
            </article>
        `).join('')}</div>` : `<p class="empty-note">Nothing you currently know, carry, or can act on matches “${escapeHtml(search.query)}”.</p>`}<div class="view-links"><button type="button" data-intent="ui.search.clear">Clear search</button></div></section>`
        : '';
    const maps = information?.knowledge?.maps?.length
        ? information.knowledge.maps.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.region)}</small></div></article>`).join('')
        : '<p class="empty-note">No map knowledge is recorded yet.</p>';
    const places = information?.knowledge?.places?.length
        ? information.knowledge.places.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.region)}</small></div></article>`).join('')
        : '<p class="empty-note">No visited places are recorded yet.</p>';
    const contacts = information?.knowledge?.discoveredPois?.length
        ? information.knowledge.discoveredPois.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.placeName)}</small></div><p>${escapeHtml(entry.notes)}</p></article>`).join('')
        : '<p class="empty-note">No named places or contacts have been recorded through interaction yet.</p>';
    return `
        <section class="panel primary-view codex-view">
            <p class="eyebrow">Known world</p>
            <h1>Codex</h1>
            <p class="muted">Maps, places, and people you have actually encountered are kept here. Unknown roads stay unknown until you learn them.</p>
            ${searchContent}
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Maps</h2><small>acquired</small></div><div class="nearby-list">${maps}</div></section>
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Visited places</h2><small>remembered</small></div><div class="nearby-list">${places}</div></section>
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Known contacts &amp; places</h2><small>discovered</small></div><div class="nearby-list">${contacts}</div></section>
        </section>
    `;
}

function renderCraftView(model) {
    const board = model.settlementServices;
    if (!board?.available) {
        return `
            <section class="panel primary-view">
                <p class="eyebrow">Work &amp; trade</p>
                <h1>Craft &amp; Process</h1>
                <p class="muted">Workshops and merchants are easiest to use in settled places. Bring materials back when you want to make, sell, buy, or recover before the next outing.</p>
                <div class="view-links"><button type="button" data-view="character">Character &amp; Gear</button></div>
            </section>
        `;
    }

    const production = board.production.length
        ? `<div class="nearby-list opportunity-list">${board.production.map(renderProductionServiceCard).join('')}</div>`
        : '<p class="empty-note">No workshop process is available anywhere in this locality.</p>';
    return `
        <section class="panel primary-view craft-view">
            <p class="eyebrow">Settlement services · ${escapeHtml(board.walletGil)} gil on hand</p>
            <h1>Work, Trade &amp; Recover</h1>
            <p class="muted">Returning to town gives you choices: turn materials into more useful goods, sell what you carried home, buy preparation, or spend time recovering before you leave again.</p>

            <section class="opportunity-group" aria-labelledby="craft-work-heading">
                <div class="panel-heading opportunity-group-heading"><h2 id="craft-work-heading">Workshop work</h2><small>${escapeHtml(board.production.length)} known here</small></div>
                ${production}
            </section>

            ${renderTradeServices(board.trade)}
            ${renderRecoveryService(board.recovery)}

            <div class="view-links"><button type="button" data-view="character">Character &amp; Gear</button></div>
        </section>
    `;
}

function renderProductionServiceCard(entry) {
    const inputs = entry.inputs.map((item) => `${item.requiredQuantity} ${item.name} (${item.carriedQuantity} carried)`).join(' + ');
    const outputs = entry.outputs.map((item) => `${item.quantity} ${item.name}`).join(' + ');
    const delta = entry.tradeDeltaGil > 0 ? `+${entry.tradeDeltaGil}` : String(entry.tradeDeltaGil);
    const blockers = entry.blockers?.length
        ? `<p class="opportunity-blockers"><strong>Needs:</strong> ${escapeHtml(entry.blockers.join(' '))}</p>`
        : '';
    return `
        <article class="nearby-card opportunity-card status-${escapeAttr(entry.status)}">
            <div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(formatType(entry.kind))} · ${escapeHtml(entry.status)}</small></div>
            <p><strong>Use:</strong> ${escapeHtml(inputs || 'No carried materials required')}</p>
            <p><strong>Make:</strong> ${escapeHtml(outputs)}</p>
            <p><strong>Time:</strong> ${escapeHtml(formatDuration(entry.durationSeconds))} · ${escapeHtml(formatType(entry.proficiencyId))} ${escapeHtml(entry.proficiency)} → +${escapeHtml(entry.proficiencyGain)} practice</p>
            <p class="muted">Typical shop value: materials ${escapeHtml(entry.inputSellGil)} gil → output ${escapeHtml(entry.outputSellGil)} gil (${escapeHtml(delta)} gil), before counting the value of your time or what the item can do for you.</p>
            ${blockers}
            ${serviceActionButton(entry.action)}
        </article>
    `;
}

function renderTradeServices(trade) {
    if (!trade) return '';
    if (!trade.currentShop) {
        const shops = trade.localShops?.length
            ? `<div class="view-links">${trade.localShops.map((shop) => serviceActionButton(shop.action)).join('')}</div>`
            : '<p class="empty-note">No merchant is available in this locality.</p>';
        return `
            <section class="opportunity-group" aria-labelledby="craft-trade-heading">
                <div class="panel-heading opportunity-group-heading"><h2 id="craft-trade-heading">Trade</h2><small>Choose a merchant</small></div>
                <p class="muted">Visit a local merchant to see actual stock, prices, and what your carried goods will fetch here.</p>
                ${shops}
            </section>
        `;
    }

    const buy = trade.buyOffers.slice(0, 8).map((offer) => `
        <article class="nearby-card">
            <div><strong>${escapeHtml(offer.name)}</strong><small>${escapeHtml(offer.priceGil)} gil</small></div>
            ${offer.blocker ? `<p class="opportunity-blockers">${escapeHtml(offer.blocker)}</p>` : ''}
            ${serviceActionButton(offer.action)}
        </article>
    `).join('') || '<p class="empty-note">Nothing is listed for sale.</p>';
    const sell = trade.sellOffers.slice(0, 8).map((offer) => `
        <article class="nearby-card">
            <div><strong>${escapeHtml(offer.name)}</strong><small>${escapeHtml(offer.quantity)} carried</small></div>
            <p>${escapeHtml(offer.unitPriceGil)} gil each · ${escapeHtml(offer.stackPriceGil)} gil for the carried stack</p>
            ${serviceActionButton(offer.action)}
        </article>
    `).join('') || '<p class="empty-note">You are carrying nothing this merchant will buy.</p>';

    return `
        <section class="opportunity-group" aria-labelledby="craft-trade-heading">
            <div class="panel-heading opportunity-group-heading"><h2 id="craft-trade-heading">${escapeHtml(trade.currentShop.name)}</h2><small>${escapeHtml(trade.currentShop.catalogName)}</small></div>
            <h3>Buy</h3><div class="nearby-list">${buy}</div>
            <h3>Sell</h3><div class="nearby-list">${sell}</div>
        </section>
    `;
}

function renderRecoveryService(recovery) {
    if (!recovery) return '';
    const status = recovery.active ? 'resting' : recovery.injured ? 'recovery available' : 'fully recovered';
    const blocker = recovery.blocker && recovery.injured ? `<p class="opportunity-blockers">${escapeHtml(recovery.blocker)}</p>` : '';
    return `
        <section class="opportunity-group" aria-labelledby="craft-recovery-heading">
            <div class="panel-heading opportunity-group-heading"><h2 id="craft-recovery-heading">Recovery</h2><small>${escapeHtml(status)}</small></div>
            <article class="nearby-card">
                <p>HP ${escapeHtml(recovery.hp)}/${escapeHtml(recovery.maxHp)} · MP ${escapeHtml(recovery.mp)}/${escapeHtml(recovery.maxMp)}</p>
                <p class="muted">Safe rest takes ${escapeHtml(formatDuration(recovery.durationSeconds))}. That time could otherwise be spent working, trading, or traveling.</p>
                ${blocker}${serviceActionButton(recovery.action)}
            </article>
        </section>
    `;
}

function serviceActionButton(action) {
    if (!action) return '';
    return `<button type="button" class="primary-button" data-service-action="${escapeAttr(action.id)}">${escapeHtml(action.label)}</button>`;
}

function informationActionButton(action) {
    if (!action?.id) return '';
    return `<button type="button" class="primary-button" data-information-action="${escapeAttr(action.id)}">${escapeHtml(action.label ?? 'Open')}</button>`;
}

function partyActionButton(action) {
    if (!action?.id) return '';
    return `<button type="button" class="primary-button" data-party-action="${escapeAttr(action.id)}">${escapeHtml(action.label ?? 'Choose')}</button>`;
}

function renderWorldView(model) {
    const information = model.information;
    const destinations = information?.local?.destinations?.length
        ? information.local.destinations.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(formatDuration(entry.travelSeconds))}</small></div>${informationActionButton(entry.action)}</article>`).join('')
        : '<p class="empty-note">No named district crossing is available here.</p>';
    const points = information?.local?.points?.length
        ? information.local.points.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(formatType(entry.type))}</small></div><p>${escapeHtml(entry.notes)}</p>${informationActionButton(entry.action)}</article>`).join('')
        : '<p class="empty-note">No named local service or contact is available here.</p>';
    const maps = information?.knowledge?.maps?.length
        ? information.knowledge.maps.map((entry) => `<article class="nearby-card"><div><strong>${escapeHtml(entry.name)}</strong><small>${escapeHtml(entry.region)}</small></div></article>`).join('')
        : '<p class="empty-note">No acquired maps are recorded yet.</p>';
    return `
        <section class="panel primary-view world-view">
            <p class="eyebrow">Acquired knowledge</p>
            <h1>${escapeHtml(model.header.placeName)}</h1>
            ${model.map ? renderMinimap(model.map) : '<p class="empty-note">In settled streets, names and landmarks matter more than counting steps. Your field map returns when the road leaves the ward.</p>'}
            ${information?.local?.mode === 'locality' ? `<section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Nearby districts</h2><small>reachable now</small></div><div class="nearby-list">${destinations}</div></section><section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Local places &amp; people</h2><small>usable here</small></div><div class="nearby-list">${points}</div></section>` : ''}
            <section class="opportunity-group"><div class="panel-heading opportunity-group-heading"><h2>Your maps</h2><small>acquired</small></div><div class="nearby-list">${maps}</div></section>
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
            ${activity.detail ? `<span>${escapeHtml(activity.detail)}</span>` : ''}
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

function renderOmnibox(query = '') {
    return `
        <form class="omnibox" id="omnibox-form">
            <label class="sr-only" for="omnibox-input">Search what you know or can do</label>
            <span aria-hidden="true">›</span>
            <input id="omnibox-input" autocomplete="off" value="${escapeAttr(query)}" placeholder="Search what you know or can do…  (/ for commands)">
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

function playerFacingMotivation(category) {
    const motivations = {
        orientation: 'A useful local contact can turn an unfamiliar settlement into a place where you know how to begin.',
        preparation: 'Better preparation changes which choices are practical before you spend time or take a risk.',
        livelihood: 'Useful work builds practice and gives you material that can matter elsewhere in the world.',
        training: 'Manageable danger can build combat skill and confidence before you attempt harder ground.',
        exploration: 'Travel turns directions into knowledge and gives you more places and routes to plan around.',
        service: 'Knowing the right local people can improve your equipment, supplies, and preparation.',
        commitment: 'Someone is counting on you, and finishing the work can change what they remember about you.',
        ambition: 'This goal connects what you have already accomplished to a farther horizon.',
        recovery: 'Recovery costs time, but it lets you continue without pretending the danger never happened.',
        'day-review': 'Yesterday still matters: use what changed to decide what deserves your time next.',
    };
    return motivations[category] ?? '';
}

function formatDanger(value) {
    const level = Math.max(0, Number(value) || 0);
    if (level <= 0) return 'Safe';
    if (level === 1) return 'Low risk';
    if (level === 2) return 'Watchful';
    if (level === 3) return 'Hazardous';
    if (level <= 5) return 'Dangerous';
    return 'Severe danger';
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
