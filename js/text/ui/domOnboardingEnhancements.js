import { randomCharacterName } from '../data/characterNames.js';
import { getJob } from '../data/jobs.js';
import { getStartingDisciplineKit } from '../data/startingDisciplineKits.js';
import { loadAccountSession, updateAccountSettings } from '../save.js';
import { clearAllLocalData, deleteCharacterSave } from '../systems/saveRecovery.js';

export const DOM_ONBOARDING_ENHANCEMENTS_VERSION = 1;

const MAGIC_SKILLS = new Set([
    'healingMagic', 'divineMagic', 'enhancingMagic', 'enfeeblingMagic', 'elementalMagic',
    'darkMagic', 'summoningMagic', 'ninjutsu', 'singing', 'blueMagic', 'geomancy',
]);

export function installOnboardingEnhancements(host) {
    if (!host) return () => {};
    const refresh = () => enhanceCurrentScreen(host);
    refresh();
    if (typeof MutationObserver === 'undefined') return () => {};
    const observer = new MutationObserver(refresh);
    observer.observe(host, { childList: true, subtree: true });
    return () => observer.disconnect();
}

export function applyThemePreference(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    if (typeof document === 'undefined') return resolved;
    document.documentElement.dataset.theme = resolved;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', resolved === 'light' ? '#d9dde2' : '#171a1f');
    return resolved;
}

export function describeDisciplinePreview(jobId) {
    const job = getJob(jobId);
    const kit = getStartingDisciplineKit(job.id);
    const magicSkills = (job.skillFocus ?? []).filter((skillId) => MAGIC_SKILLS.has(skillId));
    const martialSkills = (job.skillFocus ?? []).filter((skillId) => !MAGIC_SKILLS.has(skillId));
    const activeAttributeText = (job.primaryAttributes ?? []).length
        ? job.primaryAttributes.map((key) => `${key.toUpperCase()} +2`).join(' · ')
        : 'No focused attribute bonus';
    const resourceParts = [];
    if (job.primaryAttributes?.includes('vit')) resourceParts.push('+2 HP at starting rank');
    if (magicSkills.length) resourceParts.push('+14 MP at starting rank');
    return {
        disciplineId: job.id,
        attributes: activeAttributeText,
        resources: resourceParts.join(' · ') || 'No starting discipline resource bonus',
        combatFocus: (job.derivedFocus ?? []).map(formatIdentifier).join(' · ') || 'General training',
        weaponTraining: martialSkills.map(formatIdentifier).join(' · ') || kit.weaponTraining,
        magicTraining: magicSkills.map(formatIdentifier).join(' · ') || 'None at the start',
        startingGear: kit.items.map((item) => item.name).join(' · '),
        protection: kit.protection,
        playStyle: kit.playStyle,
    };
}

function enhanceCurrentScreen(host) {
    applyThemePreference(loadAccountSession().settings?.theme);
    enhanceCreator(host);
    enhanceCharacterCards(host);
    enhanceSettings(host);
    enhanceLandingRecovery(host);
}

function enhanceCreator(host) {
    const nameInput = host.querySelector('#creator-name');
    if (!nameInput) return;

    if (!nameInput.closest('.creator-name-row')) {
        const row = document.createElement('div');
        row.className = 'creator-name-row';
        nameInput.parentNode.insertBefore(row, nameInput);
        row.appendChild(nameInput);
        const die = document.createElement('button');
        die.type = 'button';
        die.className = 'creator-die-button';
        die.setAttribute('aria-label', 'Randomize name');
        die.title = 'Random name for the selected ancestry and sex';
        die.textContent = '🎲';
        die.addEventListener('click', () => randomizeNameField(host));
        row.appendChild(die);
    }

    const headerCopy = host.querySelector('.creation-header > div');
    if (headerCopy && !headerCopy.querySelector('.creator-random-all')) {
        const randomAll = document.createElement('button');
        randomAll.type = 'button';
        randomAll.className = 'quiet-button creator-random-all';
        randomAll.setAttribute('aria-label', 'Randomize entire character');
        randomAll.innerHTML = '<span aria-hidden="true">🎲</span><span>Random character</span>';
        randomAll.addEventListener('click', () => randomizeWholeCreator(host));
        headerCopy.appendChild(randomAll);
    }

    const selected = host.querySelector('[data-creator-choice="job"].selected');
    const jobSection = selected?.closest('.creator-choice-section');
    if (jobSection && !jobSection.querySelector('.discipline-preview')) {
        jobSection.appendChild(createDisciplinePreviewElement(selected.dataset.value));
    }
}

function randomizeWholeCreator(host) {
    clickRandomChoice(host, 'race');
    clickRandomChoice(host, 'sex');
    clickRandomChoice(host, 'nation');
    clickRandomChoice(host, 'job');
    randomizeNameField(host);
}

function clickRandomChoice(host, kind) {
    const choices = [...host.querySelectorAll(`[data-creator-choice="${kind}"]`)];
    if (!choices.length) return;
    choices[Math.floor(Math.random() * choices.length)]?.click();
}

function randomizeNameField(host) {
    const input = host.querySelector('#creator-name');
    if (!input) return;
    const raceId = host.querySelector('[data-creator-choice="race"].selected')?.dataset.value ?? 'human';
    const sex = host.querySelector('[data-creator-choice="sex"].selected')?.dataset.value ?? 'male';
    input.value = randomCharacterName(raceId, sex);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    input.select();
}

function createDisciplinePreviewElement(jobId) {
    const preview = describeDisciplinePreview(jobId);
    const section = document.createElement('section');
    section.className = 'discipline-preview';
    section.setAttribute('aria-label', 'Starting discipline details');
    const grid = document.createElement('dl');
    grid.className = 'discipline-preview-grid';
    appendDetail(grid, 'Active attributes', preview.attributes);
    appendDetail(grid, 'Starting resources', preview.resources);
    appendDetail(grid, 'Combat strengths', preview.combatFocus);
    appendDetail(grid, 'Weapon training', preview.weaponTraining);
    appendDetail(grid, 'Magic training', preview.magicTraining);
    appendDetail(grid, 'Starting gear', preview.startingGear);
    appendDetail(grid, 'Protection', preview.protection);
    appendDetail(grid, 'How it plays', preview.playStyle);
    section.appendChild(grid);
    return section;
}

function appendDetail(grid, label, value) {
    const wrap = document.createElement('div');
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value;
    wrap.append(dt, dd);
    grid.appendChild(wrap);
}

function enhanceCharacterCards(host) {
    const cards = [...host.querySelectorAll('.character-select-list > .character-select-card')];
    for (const card of cards) {
        const id = card.dataset.characterId;
        if (!id) continue;
        const entry = document.createElement('div');
        entry.className = 'character-select-entry';
        card.parentNode.insertBefore(entry, card);
        entry.appendChild(card);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'character-delete-button';
        remove.setAttribute('aria-label', `Delete ${card.querySelector('strong')?.textContent ?? 'character'} save`);
        remove.title = 'Delete this local character save';
        remove.textContent = '×';
        remove.addEventListener('click', (event) => {
            event.stopPropagation();
            const name = card.querySelector('strong')?.textContent ?? 'this character';
            if (!window.confirm(`Delete ${name}? This local save cannot be recovered.`)) return;
            const result = deleteCharacterSave(id);
            if (!result.ok) {
                window.alert(result.reason);
                return;
            }
            window.location.reload();
        });
        entry.appendChild(remove);
    }
}

function enhanceSettings(host) {
    const modal = host.querySelector('.modal-card');
    if (!modal || modal.querySelector('h2')?.textContent?.trim() !== 'Settings') return;
    if (modal.querySelector('.onboarding-settings-tools')) return;

    const tools = document.createElement('section');
    tools.className = 'onboarding-settings-tools';
    const session = loadAccountSession();
    const themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.className = 'quiet-button';
    const refreshThemeLabel = () => {
        const theme = applyThemePreference(loadAccountSession().settings?.theme);
        themeButton.textContent = `Theme: ${theme === 'light' ? 'Light' : 'Dark'}`;
    };
    refreshThemeLabel();
    themeButton.addEventListener('click', () => {
        const current = loadAccountSession().settings?.theme === 'light' ? 'light' : 'dark';
        updateAccountSettings({ theme: current === 'light' ? 'dark' : 'light' });
        refreshThemeLabel();
    });

    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'quiet-button local-data-clear';
    clear.textContent = 'Clear all local data';
    clear.addEventListener('click', () => {
        if (!window.confirm('Clear every local account and character save in this browser? This cannot be undone.')) return;
        if (!window.confirm('Confirm permanent deletion of all Hearth & Horizon local data.')) return;
        clearAllLocalData();
        window.location.reload();
    });

    const note = document.createElement('small');
    note.textContent = 'Local data controls affect only this browser. Individual character saves can also be removed from the character list.';
    tools.append(themeButton, clear, note);
    modal.appendChild(tools);
}

function enhanceLandingRecovery(host) {
    const session = loadAccountSession();
    if (session.loggedIn) return;
    const card = host.querySelector('.landing-screen .landing-card');
    if (!card || card.querySelector('.landing-reset-data')) return;
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'quiet-button landing-reset-data';
    reset.textContent = 'Reset local data';
    reset.title = 'Use this if local account or save data cannot be loaded correctly.';
    reset.addEventListener('click', () => {
        if (!window.confirm('Reset all Hearth & Horizon local data in this browser? This cannot be undone.')) return;
        clearAllLocalData();
        window.location.reload();
    });
    card.appendChild(reset);
}

function formatIdentifier(value) {
    return String(value ?? '')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[-_]/g, ' ')
        .replace(/^./, (letter) => letter.toUpperCase());
}
