import { listCharacters } from './save.js';
import { calculateCombatProfile } from './systems/statEngine.js';
import {
    renderCharacterCards,
    renderCommandChips,
    renderFeedback,
    renderMainMenuPanel,
} from './uiPanels.js';

const SIDEBAR_MENUS = Object.freeze([
    ['Main Menu', '/menu'],
    ['New Character', '/newcharacter'],
    ['Characters', '/characters'],
    ['Save', '/save'],
    ['Items', '/inventory'],
    ['Equipment', '/equipment'],
    ['Containers', '/containers'],
    ['Spells', '/spells'],
    ['Weapon Skills', '/weaponSkills'],
    ['Job Abilities', '/jobAbilities'],
    ['Bestiary', '/bestiary'],
    ['Atlas', '/atlas'],
    ['Controls', '/controls'],
    ['Commands', '/commands'],
]);

export function createSidebar({ root, state, runCommand }) {
    if (!root || !state || !runCommand) {
        throw new Error('Sidebar is missing root, state, or runCommand.');
    }

    let lastFeedback = null;

    root.addEventListener('click', (event) => {
        const button = event.target.closest('[data-command]');
        if (!button) return;
        runCommand(button.dataset.command);
    });

    function render(feedback = lastFeedback) {
        if (feedback !== undefined) lastFeedback = feedback;
        const player = state.player;
        const combat = calculateCombatProfile(player);
        const level = player.jobs.level;
        const exp = player.progression?.exp ?? 0;
        const expToNext = player.progression?.expToNext ?? level * 500;

        root.innerHTML = [
            renderFeedback(lastFeedback),
            renderMainMenuPanel(),
            renderCharacterSummary(player, state, level, exp, expToNext),
            renderBars(player, combat, exp, expToNext),
            renderCharacterCards(listCharacters()),
            renderCommandChips(),
            renderMenus(),
        ].join('');
    }

    render();

    return { render };
}

function renderCharacterSummary(player, state, level, exp, expToNext) {
    return `
        <section class="sidebar-section">
            <h2 class="character-name">${escapeHtml(player.identity.name)}</h2>
            <div class="sidebar-line"><span>Job</span><strong>${escapeHtml(player.jobs.mainJobName)} Lv.${level}</strong></div>
            <div class="sidebar-line"><span>Nation</span><strong>${escapeHtml(player.identity.nation)}</strong></div>
            <div class="sidebar-line"><span>Location</span><strong>${escapeHtml(state.location)}</strong></div>
            <div class="sidebar-line"><span>Grid</span><strong>${state.position?.x ?? '?'}:${state.position?.y ?? '?'}</strong></div>
            <div class="sidebar-line"><span>EXP</span><strong>${exp}/${expToNext}</strong></div>
            <div class="sidebar-line"><span>Gil</span><strong>${player.wallet.gil}</strong></div>
        </section>
    `;
}

function renderBars(player, combat, exp, expToNext) {
    return `
        <section class="sidebar-section bar-block">
            <h3>Resources</h3>
            ${renderBar('HP', player.resources.hp, combat.resources.maxHp)}
            ${renderBar('MP', player.resources.mp, combat.resources.maxMp)}
            ${renderBar('TP', player.resources.tp, combat.resources.maxTp)}
            ${renderBar('EXP', exp, expToNext)}
        </section>
    `;
}

function renderBar(label, current, max) {
    const safeMax = Math.max(1, Number(max) || 1);
    const value = Math.max(0, Math.min(100, Math.round(((Number(current) || 0) / safeMax) * 100)));
    return `
        <div>
            <div class="bar-label"><span>${label}</span><span>${current}/${max}</span></div>
            <div class="meter" role="meter" aria-label="${label}" aria-valuemin="0" aria-valuemax="${safeMax}" aria-valuenow="${Number(current) || 0}">
                <span class="meter-fill" style="--value:${value}%"></span>
            </div>
        </div>
    `;
}

function renderMenus() {
    return `
        <section class="sidebar-section">
            <h3>Menus</h3>
            <div class="sidebar-menu">
                ${SIDEBAR_MENUS.map(([label, command]) => `<button type="button" data-command="${command}">${label}</button>`).join('')}
            </div>
        </section>
    `;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
