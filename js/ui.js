import {
    characters,
    activeCharacter,
    raceNames,
    baseJobNames,
    jobs,
    startingCities,
    createCharacterObject,
    createNewCharacter,
    deleteCharacterSlot,
    saveCharacterToFile,
    loadCharacterFromFile,
    loadCharacterSlot,
    setActiveCharacter,
    locations,
    vendorInventories,
    shopNpcs,
    vendorGreetings,
    vendorTypes,
    items,
    conquestRewards,
    updateDerivedStats,
    loadUsers,
    addUser,
    setCurrentUser,
    currentUser,
    grantSignet,
    hasSignet,
    clearTemporaryEffects,
    pruneExpiredEffects,
    persistCharacter,
    setLocation,
    bestiaryByZone,
    spawnNearbyMonsters,
    calculateBattleRewards,
    parseCoordinate,
    coordinateDistance,
    stepToward,
    checkForNM,
    getSubArea,
    canMove,
    advanceTime,
    formatTime,
    currentVanaTime,
    formatVanaTime,
    dayElements
} from '../data/index.js';
import { randomName, raceInfo, jobInfo, cityImages, characterImages, getZoneTravelTurns, exploreEncounter, parseLevel, expNeeded, expToLevel} from '../data/index.js';

let backButtonElement = null;
let openDetailElement = null;
let logButtonElement = null;
let logPanelElement = null;
let timeDisplayElement = null;
let timePopupElement = null;
const gameLogMessages = [];
let currentTurn = 0;
let logFontSize = 14;
let nearbyMonsters = [];
let monsterCoordKey = '';
let selectedMonsterIndex = null;

const BASE_TOP_PADDING = 60;

function updateGameLogPadding() {
    if (!logPanelElement) return;
    const height = logPanelElement.classList.contains('hidden') ? 0 : logPanelElement.offsetHeight;
    document.body.style.paddingTop = (BASE_TOP_PADDING + height) + 'px';
}

export function setupTimeDisplay(el, popup) {
    timeDisplayElement = el;
    timePopupElement = popup;
    if (!timeDisplayElement) return;
    if (timePopupElement) {
        timeDisplayElement.addEventListener('click', () => {
            updateTimePopup();
            toggleDetails(timePopupElement);
        });
    }
    setInterval(updateTimeDisplay, 1000);
}

export function updateTimeDisplay() {
    if (!timeDisplayElement) return;
    const vt = currentVanaTime();
    const icon = dayElements[vt.weekday] || '';
    timeDisplayElement.textContent = `${icon} ${vt.hour.toString().padStart(2, '0')}:${vt.minute.toString().padStart(2, '0')}`;
}

function updateTimePopup() {
    if (!timePopupElement) return;
    const vt = currentVanaTime();
    const icon = dayElements[vt.weekday] || '';
    const openHour = 8;
    const closeHour = 20;
    let status, nextChange;
    if (vt.hour >= openHour && vt.hour < closeHour) {
        status = 'Shops open';
        nextChange = `Closes at ${closeHour.toString().padStart(2,'0')}:00`;
    } else {
        status = 'Shops closed';
        nextChange = `Opens at ${openHour.toString().padStart(2,'0')}:00`;
    }
    const nextFerry = `${((vt.hour + 1) % 24).toString().padStart(2,'0')}:00`;
    timePopupElement.innerHTML = `
        <div>${icon} ${formatVanaTime(vt)} - ${vt.weekday}</div>
        <div>${status} - ${nextChange}</div>
        <div>Next ferry departure: ${nextFerry}</div>
    `;
}

function updateLogFont() {
    document.documentElement.style.setProperty('--log-font-size', `${logFontSize}px`);
}

function pruneLog() {
    const cutoff = currentTurn - 1;
    gameLogMessages.forEach(obj => {
        const show = logPanelElement.classList.contains('fullscreen') || obj.turn >= cutoff;
        obj.div.style.display = show ? '' : 'none';
    });
    updateGameLogPadding();
}

export function incrementTurn() {
    currentTurn++;
    updateTimeDisplay();
    pruneLog();
}

export function setupLogControls(btn, panel) {
    logButtonElement = btn;
    logPanelElement = panel;
    if (!logButtonElement || !logPanelElement) return;
    const fontControls = document.createElement('div');
    fontControls.className = 'font-controls hidden';
    const dec = document.createElement('button');
    dec.textContent = '-';
    const inc = document.createElement('button');
    inc.textContent = '+';
    fontControls.appendChild(dec);
    fontControls.appendChild(inc);
    logPanelElement.appendChild(fontControls);
    updateLogFont();

    const toggle = () => {
        const fs = logPanelElement.classList.toggle('fullscreen');
        logPanelElement.classList.toggle('hidden', false);
        fontControls.classList.toggle('hidden', !fs);
        pruneLog();
        updateGameLogPadding();
    };
    logButtonElement.addEventListener('click', toggle);
    dec.addEventListener('click', e => { e.stopPropagation(); logFontSize = Math.max(8, logFontSize - 2); updateLogFont(); });
    inc.addEventListener('click', e => { e.stopPropagation(); logFontSize = Math.min(32, logFontSize + 2); updateLogFont(); });
    pruneLog();
}

export function addGameLog(msg) {
    if (!logPanelElement) return;
    const div = document.createElement('div');
    div.textContent = msg;
    logPanelElement.prepend(div);
    gameLogMessages.unshift({ div, turn: currentTurn });
    if (gameLogMessages.length > 50) {
        const old = gameLogMessages.pop();
        if (old && old.div.parentElement) old.div.parentElement.remove();
    }
    pruneLog();
}

export function showGameLogTemporarily(ms = 3000) {
    if (!logPanelElement) return;
    logPanelElement.classList.remove('hidden');
    pruneLog();
    setTimeout(() => { logPanelElement.classList.add('hidden'); updateGameLogPadding(); }, ms);
}

function resetDetails() {
    if (openDetailElement) {
        openDetailElement.classList.add('hidden');
        openDetailElement = null;
    }
}

function toggleDetails(element) {
    const isVisible = !element.classList.contains('hidden');
    if (openDetailElement && openDetailElement !== element) {
        openDetailElement.classList.add('hidden');
    }
    if (isVisible) {
        element.classList.add('hidden');
        if (openDetailElement === element) openDetailElement = null;
    } else {
        element.classList.remove('hidden');
        openDetailElement = element;
    }
}

function coordKey(coord) {
    return coord ? `${coord.letter}-${coord.number}` : '';
}

function updateNearbyMonsters(zone, root) {
    const key = coordKey(activeCharacter.coordinates);
    if (key !== monsterCoordKey) {
        const { list, aggro } = spawnNearbyMonsters(activeCharacter, zone);
        nearbyMonsters = list;
        monsterCoordKey = key;
        selectedMonsterIndex = null;
        if (aggro.length) {
            const app = root.parentElement || root;
            renderCombatScreen(app, aggro);
            return true;
        }
    }
    return false;
}

function createImageContainer() {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-container';
    const img = document.createElement('img');
    img.className = 'character-img';
    wrapper.appendChild(img);

    const left = document.createElement('span');
    left.className = 'img-nav left';
    left.textContent = '‹';
    wrapper.appendChild(left);
    const right = document.createElement('span');
    right.className = 'img-nav right';
    right.textContent = '›';
    wrapper.appendChild(right);

    let images = [];
    let index = 0;

    function update() {
        const src = images[index] || '';
        img.src = src ? encodeURI(src) : '';
        const show = images.length > 1;
        left.style.display = show ? 'block' : 'none';
        right.style.display = show ? 'block' : 'none';
    }

    left.addEventListener('click', () => {
        if (!images.length) return;
        index = (index - 1 + images.length) % images.length;
        update();
    });
    right.addEventListener('click', () => {
        if (!images.length) return;
        index = (index + 1) % images.length;
        update();
    });

    return {
        wrapper,
        setImages(list) {
            images = Array.isArray(list) ? list : [list].filter(Boolean);
            index = 0;
            update();
        },
        img
    };
}

export function setupBackButton(element) {
    backButtonElement = element;
}

export function showBackButton(handler) {
    if (!backButtonElement) return;
    backButtonElement.style.display = 'inline-block';
    backButtonElement.onclick = handler;
}

export function hideBackButton() {
    if (!backButtonElement) return;
    backButtonElement.style.display = 'none';
    backButtonElement.onclick = null;
}

function refreshMainMenu(container = document.getElementById('app')) {
    container.innerHTML = '';
    container.appendChild(renderMainMenu());
    updateTimeDisplay();
}

export function renderUserControls() {
    const container = document.getElementById('user-controls');
    if (!container) return;
    container.innerHTML = '';

    const label = document.createElement('label');
    label.textContent = 'User:';
    label.htmlFor = 'user-select';

    const userSelect = document.createElement('select');
    userSelect.id = 'user-select';
    loadUsers().forEach(u => {
        const opt = document.createElement('option');
        opt.value = u;
        opt.textContent = u;
        userSelect.appendChild(opt);
    });
    userSelect.value = currentUser || '';
    userSelect.addEventListener('change', () => {
        setCurrentUser(userSelect.value);
        const root = document.getElementById('app').firstElementChild;
        if (root) {
            renderCharacterMenu(root);
        }
    });

    const newUserBtn = document.createElement('button');
    newUserBtn.id = 'new-user-btn';
    newUserBtn.textContent = 'New User';
    newUserBtn.addEventListener('click', () => {
        const name = prompt('Enter new username');
        if (name) {
            addUser(name);
            setCurrentUser(name);
            renderUserControls();
            const root = document.getElementById('app').firstElementChild;
            if (root) renderCharacterMenu(root);
        }
    });

    container.appendChild(label);
    container.appendChild(userSelect);
    container.appendChild(newUserBtn);
}

function getAttack(character) {
    const weapon = items[character.equipment?.mainHand];
    const dmg = weapon?.damage || 0;
    return character.stats.str + character.level + dmg;
}

function getDefense(character) {
    let def = character.stats.vit + character.level;
    for (const slot of Object.values(character.equipment || {})) {
        const it = items[slot];
        if (it?.defense) def += it.defense;
    }
    return def;
}

function accuracyFromSkill(skill) {
    if (skill <= 200) return skill;
    if (skill <= 400) return 200 + Math.floor((skill - 200) * 0.9);
    if (skill <= 600) return 380 + Math.floor((skill - 400) * 0.8);
    return 540 + Math.floor((skill - 600) * 0.9);
}

function evasionFromSkill(skill) {
    if (skill <= 200) return skill;
    return 200 + Math.floor((skill - 200) * 0.9);
}

function calculateAccuracy(dex, skill, bonus = 0, isPet = false) {
    const dexAcc = Math.floor(dex * (isPet ? 0.5 : 0.75));
    return dexAcc + accuracyFromSkill(skill) + bonus;
}

function calculateEvasion(agi, skill, bonus = 0) {
    const agiEva = Math.floor(agi / 2);
    return agiEva + evasionFromSkill(skill) + bonus;
}

function calculateHitChance(acc, eva, attackerLevel, defenderLevel, cap = 95) {
    const dLvl = defenderLevel - attackerLevel;
    let rate = 75 + Math.floor((acc - eva) / 2) - 2 * dLvl;
    rate = Math.max(20, Math.min(cap, rate));
    return rate / 100;
}

function calculateCritBonusDex(dDex) {
    if (dDex <= 6) return 0;
    if (dDex <= 13) return 1;
    if (dDex <= 19) return 2;
    if (dDex <= 29) return 3;
    if (dDex <= 39) return 4;
    if (dDex <= 50) return dDex - 35;
    return 15;
}

function calculateCriticalChance(attacker, defender) {
    let rate = 0.05; // base 5%
    const atkDex = attacker.stats?.dex !== undefined
        ? attacker.stats.dex
        : attacker.dex !== undefined
            ? attacker.dex
            : attacker.str;
    const defAgi = defender.stats?.agi !== undefined
        ? defender.stats.agi
        : defender.agi !== undefined
            ? defender.agi
            : (defender.vit ?? (parseLevel(defender.level) * 2)) + 1;
    const dDex = atkDex - defAgi;
    rate += calculateCritBonusDex(dDex) / 100;
    return rate;
}

function itemDetailsText(item) {
    const parts = [item.description || item.name];
    if (item.damage !== undefined) parts.push(`DMG: ${item.damage}`);
    if (item.delay !== undefined) parts.push(`Delay: ${item.delay}`);
    if (item.defense !== undefined) parts.push(`DEF: ${item.defense}`);
    if (item.element) parts.push(`Element: ${item.element}`);
    return parts.join('\n');
}

function basicStatsText(item) {
    const parts = [];
    if (item.damage !== undefined) parts.push(`DMG ${item.damage}`);
    if (item.delay !== undefined) parts.push(`Delay ${item.delay}`);
    if (item.defense !== undefined) parts.push(`DEF ${item.defense}`);
    return parts.join(' ');
}

function meetsRequirements(item) {
    if (item.levelRequirement > activeCharacter.level) return false;
    if (item.sex && item.sex !== activeCharacter.sex) return false;
    if (item.races && !item.races.includes(activeCharacter.race)) return false;
    if (item.jobs && !item.jobs.includes(activeCharacter.job)) return false;
    return true;
}

function isBetterItem(item) {
    if (!item.slot) return false;
    const current = items[activeCharacter.equipment?.[item.slot]];
    if (!current) return true;
    if (item.damage !== undefined && current.damage !== undefined) {
        return item.damage > current.damage;
    }
    if (item.defense !== undefined && current.defense !== undefined) {
        return item.defense > current.defense;
    }
    return false;
}

function characterSummary() {
    if (!activeCharacter) return document.createElement('div');
    const div = document.createElement('div');
    div.className = 'character-summary';
    const line1 = document.createElement('div');
    line1.textContent = `${activeCharacter.name} - Lv.${activeCharacter.level} ${activeCharacter.sex} ${activeCharacter.race} ${activeCharacter.job}`;
    const line2 = document.createElement('div');
    line2.textContent = `Gil: ${activeCharacter.gil} CP: ${activeCharacter.conquestPoints || 0}`;
    div.appendChild(line1);
    div.appendChild(line2);
    return div;
}

function statusEffectsDisplay() {
    const div = document.createElement('div');
    div.id = 'status-effects';
    if (!activeCharacter) return div;
    pruneExpiredEffects(activeCharacter);
    const buffs = [
        ...(activeCharacter.buffs || []),
        ...((activeCharacter.temporaryBuffs || []).map(b => b.name))
    ];
    const debuffs = [
        ...(activeCharacter.debuffs || []),
        ...((activeCharacter.temporaryDebuffs || []).map(d => d.name))
    ];
    if (!hasSignet(activeCharacter)) {
        const idx = buffs.indexOf('Signet');
        if (idx !== -1) buffs.splice(idx, 1);
    }
    const buffSpan = document.createElement('span');
    buffSpan.className = 'buffs';
    buffSpan.textContent = buffs.join(', ');
    const debuffSpan = document.createElement('span');
    debuffSpan.className = 'debuffs';
    debuffSpan.textContent = debuffs.join(', ');
    div.appendChild(buffSpan);
    div.appendChild(debuffSpan);
    return div;
}

export function renderMainMenu() {
    document.body.classList.remove('combat-active');
    hideBackButton();
    const container = document.createElement('div');
    container.id = 'main-screen';

    const menu = document.createElement('div');
    menu.id = 'menu';

    const areaBtn = document.createElement('button');
    areaBtn.className = 'area-header';
    areaBtn.textContent = activeCharacter?.currentLocation || 'Area';
    const areaDiv = document.createElement('div');
    areaDiv.classList.add('hidden');
    areaBtn.addEventListener('click', () => areaDiv.classList.toggle('hidden'));

    const loc = activeCharacter && locations.find(l => l.name === activeCharacter.currentLocation);
    let navSection = null;
    let restBtn = null;
    if (loc) {
        updateNearbyMonsters(loc.name, container);
        if (loc.distance > 0) {
            const actions = createActionPanel(container, loc);
            if (actions) {
                restBtn = actions.restBtn;
                navSection = actions.navSection;
            }
        }
        const grid = createAreaGrid(container, loc);
        areaDiv.appendChild(grid);
    }
    menu.appendChild(areaBtn);
    menu.appendChild(areaDiv);

    const layout = document.createElement('div');
    layout.className = 'main-layout';

    if (activeCharacter) {
        const profile = document.createElement('div');
        profile.id = 'active-profile';

        const imgNav = createImageContainer();
        imgNav.setImages(characterImages[activeCharacter.race]?.[activeCharacter.sex]?.[activeCharacter.job]);

    const line2 = document.createElement('div');

        const subJob = Object.keys(activeCharacter.jobs || {}).find(j => j !== activeCharacter.job);
        const subLvl = subJob ? activeCharacter.jobs[subJob] : 0;
        let jobText = `${activeCharacter.job} Lv.${activeCharacter.level}`;
        if (subJob) {
            jobText = `${activeCharacter.job}/${subJob} ${activeCharacter.level}/${subLvl}`;
        }
        line2.textContent = jobText;

        const line3 = document.createElement('div');
        line3.textContent = `HP: ${activeCharacter.hp} MP: ${activeCharacter.mp} TP: ${activeCharacter.tp}`;

        const line4 = document.createElement('div');
        line4.textContent = `ATK: ${getAttack(activeCharacter)} DEF: ${getDefense(activeCharacter)}`;
        const line5 = document.createElement('div');
        line5.textContent = `Gil: ${activeCharacter.gil}`;

        const lineTime = document.createElement('div');
        lineTime.textContent = `Time: ${formatVanaTime(currentVanaTime())}`;

        const lineCp = document.createElement('div');
        lineCp.textContent = `Conquest Points: ${activeCharacter.conquestPoints || 0}`;

        const line6 = document.createElement('div');
        let progressText;
        if (activeCharacter.level >= 99 && activeCharacter.xpMode === 'CP') {
            const needed = 30000 - ((activeCharacter.capacityPoints || 0) % 30000);
            progressText = `CP to Next Job Point: ${needed}`;
        } else if (activeCharacter.level >= 75 && activeCharacter.xpMode === 'LP') {
            const needed = 10000 - ((activeCharacter.limitPoints || 0) % 10000);
            progressText = `LP to Next Merit: ${needed}`;
        } else {
            progressText = `EXP to Next Level: ${expNeeded(activeCharacter)}`;
        }
        line6.textContent = progressText;

        let modeBtn = null;
        if (activeCharacter.level >= 75) {
            modeBtn = document.createElement('button');
            modeBtn.textContent = `Mode: ${activeCharacter.xpMode}`;
            modeBtn.addEventListener('click', () => {
                if (activeCharacter.level >= 99) {
                    if (activeCharacter.xpMode === 'EXP') activeCharacter.xpMode = 'LP';
                    else if (activeCharacter.xpMode === 'LP') activeCharacter.xpMode = 'CP';
                    else activeCharacter.xpMode = 'EXP';
                } else {
                    activeCharacter.xpMode = activeCharacter.xpMode === 'EXP' ? 'LP' : 'EXP';
                }
                persistCharacter(activeCharacter);
                refreshMainMenu(container.parentElement);
            });
        }

        const group = document.createElement('div');
        group.className = 'profile-group';

        const charBtn = document.createElement('button');
        charBtn.className = 'profile-btn';
        charBtn.textContent = `${activeCharacter.name} (${activeCharacter.hp} HP)`;
        group.appendChild(charBtn);

        const details = document.createElement('div');
        details.id = 'character-details';
        details.classList.add('hidden');
        charBtn.addEventListener('click', () => toggleDetails(details));

        details.appendChild(imgNav.wrapper);

        const invBtn = document.createElement('button');
        invBtn.textContent = 'Inventory';
        invBtn.addEventListener('click', () => {
            renderInventoryScreen(container);
        });

        const equipBtn = document.createElement('button');
        equipBtn.textContent = 'Equipment';
        equipBtn.addEventListener('click', () => {
            renderEquipmentScreen(container);
        });

        details.appendChild(line2);
        details.appendChild(line3);
        details.appendChild(line4);
        details.appendChild(line5);
        details.appendChild(lineTime);
        details.appendChild(lineCp);
        details.appendChild(line6);
        if (modeBtn) details.appendChild(modeBtn);
        details.appendChild(invBtn);
        details.appendChild(equipBtn);
        group.appendChild(details);
        profile.appendChild(group);
        if (restBtn) profile.appendChild(restBtn);
        layout.appendChild(profile);

        // Previously the main menu displayed several buttons that allowed the
        // player to inspect traits, abilities, skills and other details. Those
        // buttons have been removed to simplify the profile view. The character
        // information now only shows the basic profile lines above.
    }
    if (navSection) layout.appendChild(navSection);
    layout.appendChild(menu);
    container.appendChild(layout);
    return container;
}

export function renderCharacterMenu(root) {
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = 'Characters';
    root.appendChild(title);
    if (!currentUser) {
        const msg = document.createElement('div');
        msg.textContent = 'Create a user to start saving characters.';
        root.appendChild(msg);
    }

    const controls = document.createElement('div');
    controls.className = 'char-menu-controls';

    const userSelect = document.createElement('select');
    loadUsers().forEach(u => {
        const opt = document.createElement('option');
        opt.value = u;
        opt.textContent = u;
        userSelect.appendChild(opt);
    });
    userSelect.value = currentUser || '';
    userSelect.addEventListener('change', () => {
        setCurrentUser(userSelect.value);
        renderCharacterMenu(root);
    });

    const newBtn = document.createElement('button');
    newBtn.textContent = 'New Character';
    newBtn.addEventListener('click', () => {
        renderNewCharacterForm(root);
    });
    if (!currentUser) newBtn.disabled = true;

    const newUserBtn = document.createElement('button');
    newUserBtn.textContent = 'New User';
    newUserBtn.addEventListener('click', () => {
        const name = prompt('Enter new username');
        if (name) {
            addUser(name);
            setCurrentUser(name);
            renderCharacterMenu(root);
        }
    });

    controls.appendChild(userSelect);
    controls.appendChild(newBtn);
    controls.appendChild(newUserBtn);
    root.appendChild(controls);

    const list = document.createElement('div');
    list.id = 'slot-container';
    const maxSlots = 12;
    const slotCount = Math.min(Math.max(characters.length, 3), maxSlots);
    for (let i = 0; i < slotCount; i++) {
        const entry = document.createElement('div');
        entry.className = 'slot-entry';
        const label = document.createElement('span');
        label.className = 'slot-label';
        const ch = characters[i];
        label.textContent = ch ? `${ch.name} - ${ch.race} ${ch.job} Lv.${ch.level}` : 'No Save';
        entry.appendChild(label);

        const loadBtn = document.createElement('button');
        if (ch) {
            if (ch === activeCharacter) {
                loadBtn.textContent = 'Active';
                loadBtn.disabled = true;
            } else {
                loadBtn.textContent = 'Load';
                loadBtn.addEventListener('click', () => {
                    setActiveCharacter(ch);
                    renderCharacterMenu(root);
                });
            }
        } else {
            loadBtn.textContent = 'Import';
            loadBtn.addEventListener('click', async () => {
                await loadCharacterFromFile();
                renderCharacterMenu(root);
            });
        }
        entry.appendChild(loadBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', async () => {
            const ch = characters[i];
            if (ch) {
                await saveCharacterToFile(ch);
            }
        });
        entry.appendChild(saveBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this character slot?')) {
                deleteCharacterSlot(i);
                renderCharacterMenu(root);
            }
        });
        entry.appendChild(deleteBtn);

        list.appendChild(entry);
    }
    root.appendChild(list);

    showBackButton(() => refreshMainMenu(root.parentElement));
}

function renderNewCharacterForm(root) {
    root.innerHTML = '';
    showBackButton(() => renderCharacterMenu(root));
    const header = document.createElement('div');
    header.className = 'form-header';

    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create Character';
    createBtn.addEventListener('click', () => {
        createNewCharacter(
            nameInput.value.trim() || undefined,
            jobSelect.value,
            raceSelect.value,
            sexSelect.value
        );
        renderCharacterMenu(root);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Back';
    cancelBtn.addEventListener('click', () => {
        renderCharacterMenu(root);
    });

    header.appendChild(createBtn);
    header.appendChild(cancelBtn);
    root.appendChild(header);

    // container for three-column layout
    const form = document.createElement('div');
    form.className = 'character-form';

    // left column: input fields
    const inputs = document.createElement('div');
    inputs.className = 'form-inputs';

    const statsList = document.createElement('ul');
    statsList.className = 'stats-list';
    inputs.appendChild(statsList);

    const nameField = document.createElement('div');
    nameField.className = 'form-field';
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = randomName(raceNames[0], 'Male');
    let customName = false;
    nameField.appendChild(nameLabel);
    nameField.appendChild(nameInput);
    inputs.appendChild(nameField);

    const raceField = document.createElement('div');
    raceField.className = 'form-field';
    const raceLabel = document.createElement('label');
    raceLabel.textContent = 'Race:';
    const raceSelect = document.createElement('select');
    raceNames.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        raceSelect.appendChild(opt);
    });
    raceField.appendChild(raceLabel);
    raceField.appendChild(raceSelect);
    inputs.appendChild(raceField);

    const sexField = document.createElement('div');
    sexField.className = 'form-field';
    const sexLabel = document.createElement('label');
    sexLabel.textContent = 'Sex:';
    const sexSelect = document.createElement('select');
    function updateSexOptions() {
        const race = raceSelect.value;
        const options = race === 'Galka'
            ? ['Male']
            : race === 'Mithra'
                ? ['Female']
                : ['Male', 'Female'];
        const current = sexSelect.value;
        sexSelect.innerHTML = '';
        options.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            sexSelect.appendChild(opt);
        });
        if (options.includes(current)) {
            sexSelect.value = current;
        }
    }
    updateSexOptions();
    sexField.appendChild(sexLabel);
    sexField.appendChild(sexSelect);
    inputs.appendChild(sexField);

    const jobField = document.createElement('div');
    jobField.className = 'form-field';
    const jobLabel = document.createElement('label');
    jobLabel.textContent = 'Job:';
    const jobSelect = document.createElement('select');
    baseJobNames.forEach(j => {
        const opt = document.createElement('option');
        opt.value = j;
        opt.textContent = j;
        jobSelect.appendChild(opt);
    });
    jobField.appendChild(jobLabel);
    jobField.appendChild(jobSelect);
    inputs.appendChild(jobField);

    const randomBtn = document.createElement('button');
    randomBtn.textContent = 'Randomize';
    randomBtn.addEventListener('click', () => {
        raceSelect.value = raceNames[Math.floor(Math.random() * raceNames.length)];
        jobSelect.value = baseJobNames[Math.floor(Math.random() * baseJobNames.length)];
        updateSexOptions();
        const options = Array.from(sexSelect.options).map(o => o.value);
        sexSelect.value = options[Math.floor(Math.random() * options.length)];
        if (!customName) {
            nameInput.value = randomName(raceSelect.value, sexSelect.value);
        }
        customName = false;
        updateInfo();
    });
    inputs.appendChild(randomBtn);

    form.appendChild(inputs);
    // middle column: stats display

    const statsCol = document.createElement('div');
    statsCol.className = 'form-stats';

    const raceHeader = document.createElement('h3');
    raceHeader.className = 'race-header';

    const raceDesc = document.createElement('p');
    raceDesc.className = 'race-desc';

    const raceImgNav = createImageContainer();
    raceImgNav.img.classList.remove('character-img');
    raceImgNav.img.classList.add('race-img');
    statsCol.appendChild(raceImgNav.wrapper);

    const cityDiv = document.createElement('div');
    cityDiv.className = 'start-city';
    statsCol.appendChild(cityDiv);
    const cityImg = document.createElement('img');
    cityImg.className = 'city-img';
    statsCol.appendChild(cityImg);

    form.appendChild(statsCol);

    // right column: traits and abilities
    const infoCol = document.createElement('div');
    infoCol.className = 'form-traits';

    infoCol.appendChild(raceHeader);
    infoCol.appendChild(raceDesc);

    const jobHeader = document.createElement('h3');
    jobHeader.className = 'job-header';
    infoCol.appendChild(jobHeader);

    const jobDesc = document.createElement('p');
    jobDesc.className = 'job-desc';
    infoCol.appendChild(jobDesc);

    const traitsHeader = document.createElement('h4');
    traitsHeader.textContent = 'Traits';
    infoCol.appendChild(traitsHeader);
    const traitsList = document.createElement('ul');
    traitsList.className = 'trait-list';
    infoCol.appendChild(traitsList);

    const abilitiesHeader = document.createElement('h4');
    abilitiesHeader.textContent = 'Abilities';
    abilitiesHeader.style.marginTop = '20px';
    infoCol.appendChild(abilitiesHeader);
    const abilitiesList = document.createElement('ul');
    abilitiesList.className = 'ability-list';
    infoCol.appendChild(abilitiesList);

    form.appendChild(infoCol);

    root.appendChild(form);

    function updateInfo() {
        const preview = createCharacterObject(
            nameInput.value.trim() || `Adventurer ${characters.length + 1}`,
            jobSelect.value,
            raceSelect.value,
            sexSelect.value
        );
        statsList.innerHTML = '';
        raceHeader.textContent = raceSelect.value;
        raceImgNav.setImages(characterImages[raceSelect.value]?.[sexSelect.value]?.[jobSelect.value]);
        raceDesc.textContent = raceInfo[raceSelect.value]?.description || '';
        jobHeader.textContent = jobSelect.value;
        let jd = jobInfo[jobSelect.value]?.description || '';
        jd = jd.replace(/ (Skills:)/, '<br><br>$1')
               .replace(/ (Magic:)/, '<br><br>$1')
               .replace(/ (Gear:)/, '<br><br>$1')
               .replace(/ (History:)/, '<br><br>$1');
        jobDesc.innerHTML = jd;

        const statEntries = [
            ['HP', preview.hp],
            ['MP', preview.mp],
            ['STR', preview.stats.str],
            ['DEX', preview.stats.dex],
            ['VIT', preview.stats.vit],
            ['AGI', preview.stats.agi],
            ['INT', preview.stats.int],
            ['MND', preview.stats.mnd],
            ['CHR', preview.stats.chr]
        ];
        statEntries.forEach(([label, val]) => {
            const li = document.createElement('li');
            li.textContent = `${label}: ${val}`;
            statsList.appendChild(li);
        });
        const city = startingCities[raceSelect.value];
        cityDiv.textContent = `Starting City: ${city}`;
        cityImg.src = cityImages[city] || '';

        traitsList.innerHTML = '';
        abilitiesList.innerHTML = '';
        const job = jobs.find(j => j.name === jobSelect.value);
        if (job) {
            const level1Traits = (job.traits || []).filter(t => t.level === 1);
            if (level1Traits.length) {
                level1Traits.forEach(t => {
                    const li = document.createElement('li');
                    const name = document.createElement('span');
                    name.className = 'trait-name';
                    name.textContent = t.name;
                    const desc = document.createElement('span');
                    desc.className = 'trait-desc';
                    desc.textContent = t.effect;
                    li.appendChild(name);
                    li.appendChild(desc);
                    traitsList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'None';
                traitsList.appendChild(li);
            }

            const level1Abilities = (job.abilities || []).filter(a => a.level === 1);
            if (level1Abilities.length) {
                level1Abilities.forEach(a => {
                    const li = document.createElement('li');
                    const name = document.createElement('span');
                    name.className = 'ability-name';
                    name.textContent = a.name;
                    const desc = document.createElement('span');
                    desc.className = 'ability-desc';
                    desc.textContent = a.effect;
                    li.appendChild(name);
                    li.appendChild(desc);
                    abilitiesList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = 'None';
                abilitiesList.appendChild(li);
            }
        }
    }

    nameInput.addEventListener('input', () => {
        customName = true;
        updateInfo();
    });
    raceSelect.addEventListener('change', () => {
        updateSexOptions();
        if (!customName) {
            nameInput.value = randomName(raceSelect.value, sexSelect.value);
        }
        updateInfo();
    });
    sexSelect.addEventListener('change', updateInfo);
    jobSelect.addEventListener('change', updateInfo);
    updateInfo();

}


// Legacy function no longer used
function renderPlayUI(root) {
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = 'Adventure';
    root.appendChild(title);

    const travelBtn = document.createElement('button');
    travelBtn.textContent = 'Zone';
    travelBtn.addEventListener('click', Travel);
    root.appendChild(travelBtn);

    const exploreBtn = document.createElement('button');
    exploreBtn.textContent = 'Explore';
    exploreBtn.addEventListener('click', Explore);
    root.appendChild(exploreBtn);

    const skillsBtn = document.createElement('button');
    skillsBtn.textContent = 'Skills';
    skillsBtn.addEventListener('click', Skills);
    root.appendChild(skillsBtn);

    const magicBtn = document.createElement('button');
    magicBtn.textContent = 'Magic';
    magicBtn.addEventListener('click', Magic);
    root.appendChild(magicBtn);

    root.appendChild(document.createElement('br'));
    showBackButton(() => refreshMainMenu(root.parentElement));
}

function createAreaGrid(root, loc) {
    const grid = document.createElement('div');
    grid.id = 'area-grid';
    grid.classList.add('vertical');

    const sections = [];
    function makeSection(title, expanded = false) {
        const col = document.createElement('div');
        col.className = 'area-column';
        const header = document.createElement('button');
        header.className = 'area-header';
        header.textContent = title;
        if (expanded) header.classList.add('expanded');
        const list = document.createElement('ul');
        if (!expanded) list.classList.add('hidden');
        col.appendChild(header);
        col.appendChild(list);
        grid.appendChild(col);
        sections.push({ header, list });
        return list;
    }

    const travelList = makeSection('Zone', true);


    const travelKeywords = /(airship|ferry|chocobo|rental|home point|dock|boat|stable|crystal)/i;
    const travelPOIs = loc.pointsOfInterest.filter(p => travelKeywords.test(p));

    const craftingKeywords = /guild/i;
    const craftingPOIs = loc.pointsOfInterest.filter(p => craftingKeywords.test(p) && !travelPOIs.includes(p));

    loc.connectedAreas.forEach(area => {
        if (loc.name === 'South Gustaberg' && area === 'Vomp Hill') return;
        if (loc.name === 'Vomp Hill' && area === 'South Gustaberg') return;
        const li = document.createElement('li');
        const btn = document.createElement('button');
        const destCoordStr = loc.coordinates?.[area];
        let total = getZoneTravelTurns(area, loc.name);
        if (activeCharacter.coordinates && destCoordStr) {
            total = coordinateDistance(activeCharacter.coordinates, parseCoordinate(destCoordStr));
        }
        const travel = activeCharacter.travel &&
            activeCharacter.travel.start === loc.name &&
            activeCharacter.travel.destination === area
            ? activeCharacter.travel.remaining
            : total;
        if (total > 1) {
            btn.textContent = `${area} (${travel}/${total})`;
        } else {
            btn.textContent = area;
        }
        btn.addEventListener('click', () => {
            const destCoordStrClick = loc.coordinates?.[area];
            if (!activeCharacter.travel || activeCharacter.travel.start !== loc.name || activeCharacter.travel.destination !== area) {
                let t = getZoneTravelTurns(area, loc.name);
                let destC = null;
                if (activeCharacter.coordinates && destCoordStrClick) {
                    destC = parseCoordinate(destCoordStrClick);
                    t = coordinateDistance(activeCharacter.coordinates, destC);
                }
                activeCharacter.travel = { start: loc.name, destination: area, remaining: t, total: t, destCoord: destC };
            }
            if (updateNearbyMonsters(loc.name, root)) return;
            if (activeCharacter.travel.destCoord && activeCharacter.coordinates) {
                const next = stepToward(activeCharacter.coordinates, activeCharacter.travel.destCoord);
                if (canMove(loc.name, activeCharacter.coordinates, next)) {
                    activeCharacter.coordinates = next;
                    activeCharacter.subArea = getSubArea(loc.name, next);
                }
            }
            activeCharacter.travel.remaining -= 1;
            advanceTime(activeCharacter, loc.name);
            incrementTurn();
            if (activeCharacter.travel.remaining <= 0) {
                setLocation(activeCharacter, area, loc.name);
                activeCharacter.travel = null;
            }
            const nm = checkForNM(
                loc.name,
                activeCharacter.coordinates,
                getSubArea(loc.name, activeCharacter.coordinates)
            );
            if (nm) {
                renderCombatScreen(root.parentElement, [nm]);
                return;
            }
            persistCharacter(activeCharacter);
            refreshMainMenu(root.parentElement);
        });
        li.appendChild(btn);
        travelList.appendChild(li);
    });

    if (loc.name === 'South Gustaberg') {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = 'Vomp Hill Ramp';
        btn.addEventListener('click', () => {
            setLocation(activeCharacter, 'Vomp Hill', loc.name);
            persistCharacter(activeCharacter);
            refreshMainMenu(root.parentElement);
        });
        li.appendChild(btn);
        travelList.appendChild(li);
    } else if (loc.name === 'Vomp Hill') {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = 'Vomp Hill Ramp';
        btn.addEventListener('click', () => {
            setLocation(activeCharacter, 'South Gustaberg', loc.name);
            persistCharacter(activeCharacter);
            refreshMainMenu(root.parentElement);
        });
        li.appendChild(btn);
        travelList.appendChild(li);
    }

    travelPOIs.forEach(p => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.addEventListener('click', () => openMenu(p));
        li.appendChild(btn);
        travelList.appendChild(li);
    });

    const craftPOIs = [];
    craftingPOIs.forEach(p => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.addEventListener('click', () => openMenu(p));
        li.appendChild(btn);
        craftPOIs.push(li);
    });
    const craftList = craftPOIs.length ? makeSection('Crafting') : null;
    if (craftList) {
        craftPOIs.forEach(li => craftList.appendChild(li));
    }

    const marketKeywords = /(shop|store|auction|merchant|market|armor|armour|weapon|smith|vendor|goods|gear|scribe|notary)/i;
    const marketPOIs = loc.pointsOfInterest.filter(p => marketKeywords.test(p) && !travelPOIs.includes(p) && !craftingPOIs.includes(p));
    const marketItems = [];
    marketPOIs.forEach(p => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.addEventListener('click', () => openMenu(p));
        li.appendChild(btn);
        marketItems.push(li);
    });
    let marketList = null;
    if (marketItems.length) {
        marketList = makeSection('Marketplace');
        marketItems.forEach(li => marketList.appendChild(li));
    }

    const otherList = makeSection('Other');

    loc.pointsOfInterest.forEach(p => {
        if (travelPOIs.includes(p) || craftingPOIs.includes(p) || marketPOIs.includes(p)) return;
        if ((loc.name === 'South Gustaberg' || loc.name === 'Vomp Hill') && p === 'Vomp Hill Ramp') return;
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = p;
        btn.addEventListener('click', () => openMenu(p));
        li.appendChild(btn);
        otherList.appendChild(li);
    });
    const merchantNPC = /(merchant|shop|store|auction|vendor|goods|gear|scribe|notary)/i;
    loc.importantNPCs.forEach(n => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = n;
        btn.addEventListener('click', () => openMenu(n));
        li.appendChild(btn);
        if (merchantNPC.test(n) && marketList) {
            marketList.appendChild(li);
        } else {
            otherList.appendChild(li);
        }
    });

    sections.forEach((s) => {
        s.header.addEventListener('click', () => {
            sections.forEach(o => {
                o.list.classList.add('hidden');
                o.header.classList.remove('expanded');
            });
            s.list.classList.remove('hidden');
            s.header.classList.add('expanded');
        });
    });

    return grid;
}

function stepInDirection(coord, dx, dy) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const x = Math.min(Math.max(0, coord.letter.toUpperCase().charCodeAt(0) - 65 + dx), letters.length - 1);
    const y = Math.max(1, coord.number + dy);
    const next = { letter: letters[x], number: y };
    if (!canMove(activeCharacter.currentLocation, coord, next)) return coord;
    activeCharacter.subArea = getSubArea(activeCharacter.currentLocation, next);
    return next;
}

function createActionPanel(root, loc) {
    if (!loc || loc.distance <= 0) return null;

    const restBtn = document.createElement('button');
    restBtn.textContent = 'Rest';
    restBtn.addEventListener('click', () => {
        if (activeCharacter) {
            updateDerivedStats(activeCharacter);
            activeCharacter.tp = 0;
            advanceTime(activeCharacter, loc.name);
            incrementTurn();
            persistCharacter(activeCharacter);
        }
        refreshMainMenu(root.parentElement);
    });

    updateNearbyMonsters(loc.name, root);
    const dirGrid = document.createElement('div');
    dirGrid.id = 'direction-grid';
    const dirs = [
        { l: 'NW', dx: -1, dy: -1 },
        { l: 'N', dx: 0, dy: -1 },
        { l: 'NE', dx: 1, dy: -1 },
        { l: 'W', dx: -1, dy: 0 },
        { attack: true },
        { l: 'E', dx: 1, dy: 0 },
        { l: 'SW', dx: -1, dy: 1 },
        { l: 'S', dx: 0, dy: 1 },
        { l: 'SE', dx: 1, dy: 1 }
    ];
    dirs.forEach(d => {
        const b = document.createElement('button');
        if (d.attack) {
            b.textContent = '🗡';
            b.id = 'attack-button';
            b.addEventListener('click', () => {
                if (selectedMonsterIndex === null) return;
                const mob = nearbyMonsters[selectedMonsterIndex];
                if (mob && !mob.defeated) {
                    renderCombatScreen(root.parentElement, [{ ...mob, listIndex: selectedMonsterIndex }]);
                }
            });
        } else {
            b.textContent = d.l;
            b.addEventListener('click', () => {
                if (!activeCharacter?.coordinates) return;
                activeCharacter.coordinates = stepInDirection(activeCharacter.coordinates, d.dx, d.dy);
                advanceTime(activeCharacter, loc.name);
                incrementTurn();
                persistCharacter(activeCharacter);
                if (updateNearbyMonsters(loc.name, root)) return;
                const nm = checkForNM(
                    loc.name,
                    activeCharacter.coordinates,
                    getSubArea(loc.name, activeCharacter.coordinates)
                );
                if (nm) {
                    renderCombatScreen(root.parentElement, [nm]);
                    return;
                }
                refreshMainMenu(root.parentElement);
            });
        }
        dirGrid.appendChild(b);
    });

    const monsterList = document.createElement('div');
    monsterList.id = 'nearby-monsters';

    function renderMonsters() {
        monsterList.innerHTML = '';
        nearbyMonsters.forEach((m, i) => {
            const btn = document.createElement('button');
            btn.textContent = `${m.name} HP:${m.hp}`;
            btn.className = 'monster-btn';
            if (m.defeated) btn.classList.add('defeated');
            if (m.aggro) btn.classList.add('aggro');
            if (i === selectedMonsterIndex) btn.classList.add('selected');
            btn.addEventListener('click', () => {
                if (m.defeated) return;
                selectedMonsterIndex = i;
                renderMonsters();
            });
            btn.disabled = m.defeated;
            monsterList.appendChild(btn);
        });
    }

    renderMonsters();

    const navSection = document.createElement('div');
    navSection.className = 'nav-section';
    const navCol = document.createElement('div');
    navCol.className = 'nav-column';
    navCol.appendChild(dirGrid);

    const coordDisp = document.createElement('div');
    coordDisp.id = 'coord-display';
    if (activeCharacter.coordinates) {
        coordDisp.textContent = `${activeCharacter.coordinates.letter}-${activeCharacter.coordinates.number}`;
    }
    navCol.appendChild(coordDisp);

    const mobCol = document.createElement('div');
    mobCol.className = 'mob-column';
    mobCol.appendChild(monsterList);

    navSection.appendChild(navCol);
    navSection.appendChild(mobCol);

    return { restBtn, navSection };
}


function renderCombatScreen(app, mobs, destination) {
    if (!activeCharacter) return;
    if (!Array.isArray(mobs)) mobs = [mobs];
    document.body.classList.add('combat-active');
    const container = document.createElement('div');
    container.id = 'combat-screen';
    container.appendChild(statusEffectsDisplay());
    app.appendChild(container);

    const enemyColumn = document.createElement('div');
    enemyColumn.className = 'enemy-column';
    const enemyList = document.createElement('div');
    enemyList.className = 'enemy-list';
    enemyColumn.appendChild(enemyList);

    const actionColumn = document.createElement('div');
    actionColumn.className = 'action-column';

    const enemyEntries = [];
    mobs.forEach((m, idx) => {
        m.currentHP = (m.hp || parseLevel(m.level) * 20);
        const entry = document.createElement('div');
        entry.className = 'target-entry';
        entry.id = `enemy-${idx}`;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'target-name';
        nameSpan.textContent = m.name;
        const stat = document.createElement('span');
        stat.className = 'target-stats';
        stat.textContent = `HP:${m.currentHP}`;
        entry.addEventListener('click', () => {
            currentTarget = m;
        });
        entry.appendChild(nameSpan);
        entry.appendChild(stat);
        enemyEntries.push({ entry, stat });
        enemyList.appendChild(entry);
    });
    let currentTarget = mobs[0];

    container.appendChild(enemyColumn);
    container.appendChild(actionColumn);

    let battleEnded = false;
    const defeated = [];

    function getCombatStats(target) {
        if (target === activeCharacter) {
            const level = activeCharacter.level;
            const weaponSkill = level * 5;
            const evasionSkill = level * 5;
            return {
                atk: getAttack(activeCharacter),
                def: getDefense(activeCharacter),
                acc: calculateAccuracy(activeCharacter.stats.dex, weaponSkill),
                eva: calculateEvasion(activeCharacter.stats.agi, evasionSkill),
                level
            };
        }
        const level = parseLevel(target.level);
        const scale = level * 2;
        const dex = target.dex !== undefined ? target.dex : target.str;
        const agi = target.agi !== undefined ? target.agi : (target.vit ?? scale) + 1;
        const weaponSkill = target.weaponSkill || level * 5;
        const evasionSkill = target.evasionSkill || level * 5;
        const str = target.str ?? scale;
        const vit = target.vit ?? scale;
        return {
            atk: str + level,
            def: vit + level,
            acc: calculateAccuracy(dex, weaponSkill),
            eva: calculateEvasion(agi, evasionSkill),
            level
        };
    }

    function log(msg) {
        addGameLog(msg);
        updateGameLogPadding();
    }

    function addItemsToInventory(list) {
        list.forEach(({ id, qty }) => {
            const existing = activeCharacter.inventory.find(i => i.id === id);
            if (existing) existing.qty += qty; else activeCharacter.inventory.push({ id, qty });
        });
        activeCharacter.inventory.sort((a, b) => {
            const n1 = items[a.id]?.name || a.id;
            const n2 = items[b.id]?.name || b.id;
            return n1.localeCompare(n2);
        });
    }

    function checkLevelUp() {
        let leveled = false;
        const oldLevel = activeCharacter.level;
        const oldVals = {
            hp: activeCharacter.hp,
            mp: activeCharacter.mp,
            ...activeCharacter.stats
        };
        while (activeCharacter.level < 99 &&
            activeCharacter.experience >= expToLevel[activeCharacter.level + 1]) {
            activeCharacter.level++;
            leveled = true;
        }
        if (leveled) {
            updateDerivedStats(activeCharacter);
            const diffs = [];
            const fields = ['hp','mp','str','dex','vit','agi','int','mnd','chr'];
            fields.forEach(f => {
                const before = oldVals[f] || 0;
                const after = f === 'hp' ? activeCharacter.hp
                    : f === 'mp' ? activeCharacter.mp
                    : activeCharacter.stats[f];
                const diff = after - before;
                if (diff !== 0) diffs.push(`${f.toUpperCase()} ${diff > 0 ? '+'+diff : diff}`);
            });
            addGameLog(`Level up! ${oldLevel} → ${activeCharacter.level} | ${diffs.join(', ')}`);
            showGameLogTemporarily();
        }
    }

    function victory(exp, gil, cp, itemDrops, notes = []) {
        update();
        battleEnded = true;
        const lootDiv = document.createElement('div');
        lootDiv.className = 'loot-display';
        const enemyNames = defeated.map(m => m.name).join(', ');
        addGameLog(`You defeated the ${enemyNames}.`);
        if (exp > 0) addGameLog(`${exp} EXP`);
        if (gil > 0) addGameLog(`${gil} gil`);
        if (cp > 0) addGameLog(`${cp} CP`);
        notes.forEach(m => addGameLog(m));
        itemDrops.forEach(it => {
            const name = items[it.id]?.name || it.id;
            addGameLog(name + (it.qty > 1 ? ` x${it.qty}` : ''));
        });
        showGameLogTemporarily();
        const btn = document.createElement('button');
        btn.textContent = 'Claim Loot';
        btn.addEventListener('click', () => {
            if (exp > 0) {
                if (activeCharacter.level >= 99 && activeCharacter.xpMode === 'CP') {
                    activeCharacter.capacityPoints = (activeCharacter.capacityPoints || 0) + exp;
                    while (activeCharacter.capacityPoints >= 30000) {
                        activeCharacter.capacityPoints -= 30000;
                        activeCharacter.jobPoints = (activeCharacter.jobPoints || 0) + 1;
                    }
                } else if (activeCharacter.level >= 75 && activeCharacter.xpMode === 'LP') {
                    activeCharacter.limitPoints = (activeCharacter.limitPoints || 0) + exp;
                    while (activeCharacter.limitPoints >= 10000) {
                        activeCharacter.limitPoints -= 10000;
                        activeCharacter.meritPoints = (activeCharacter.meritPoints || 0) + 1;
                    }
                } else {
                    activeCharacter.experience = (activeCharacter.experience || 0) + exp;
                    checkLevelUp();
                }
            }
            activeCharacter.gil += gil;
            activeCharacter.conquestPoints = (activeCharacter.conquestPoints || 0) + cp;
            addItemsToInventory(itemDrops);
            defeated.forEach(m => {
                let idx = m.listIndex;
                if (idx === undefined) idx = nearbyMonsters.indexOf(m);
                if (idx !== -1) nearbyMonsters[idx].defeated = true;
            });
            selectedMonsterIndex = null;
            if (destination && activeCharacter.hp > 0) {
                setLocation(activeCharacter, destination);
            }
            persistCharacter(activeCharacter);
            refreshMainMenu(app);
        });
        lootDiv.appendChild(btn);
        container.appendChild(lootDiv);
    }

    function update() {
        enemyEntries.forEach((obj, i) => {
            if (mobs[i]) obj.stat.textContent = `HP:${mobs[i].currentHP}`;
        });
    }

    function monsterDefeated(idx) {
        const mob = mobs[idx];
        defeated.push(mob);
        mobs.splice(idx, 1);
        enemyEntries[idx].entry.remove();
        enemyEntries.splice(idx, 1);
        if (mobs.length === 0) {
            const rewards = calculateBattleRewards(activeCharacter, defeated);
            victory(rewards.exp, rewards.gil, rewards.cp, rewards.drops, rewards.messages);
        } else {
            currentTarget = mobs[0];
            update();
        }
    }

    function calculatePhysicalDamage(attacker, defender, aStats, dStats, isCrit = false, critBonus = 0) {
        const atkLevel = attacker === activeCharacter ? activeCharacter.level : parseLevel(attacker.level);
        const defLevel = defender === activeCharacter ? activeCharacter.level : parseLevel(defender.level);

        const weaponDamage = attacker === activeCharacter
            ? (items[activeCharacter.equipment?.mainHand]?.damage || 1)
            : Math.max(1, Math.floor(aStats.atk / 2));

        const str = attacker.stats?.str ?? aStats.atk;
        const vit = defender.stats?.vit ?? dStats.def;

        const rank = Math.floor(weaponDamage / 9);
        let fSTR = Math.floor(((str - vit) + 4) / 4);
        fSTR = Math.min(Math.max(fSTR, -rank), rank + 8);

        const baseDamage = weaponDamage + fSTR;

        let ratio = aStats.atk / dStats.def;
        ratio = Math.min(ratio, 2.25);
        if (defLevel > atkLevel) {
            ratio -= 0.05 * (defLevel - atkLevel);
        }

        const p = x => Math.max(x, 0);
        const n = x => Math.max(-x, 0);
        const a = 1 + (10 / 9) * (p(Math.max(ratio, 0.5) - 1.5) - n(Math.max(ratio, 0.5) - 1.25));
        const b = 1 + (10 / 9) * (p(ratio - 0.75) - n(ratio - 0.5));
        let pdif = a + Math.random() * (b - a);
        pdif = Math.floor(pdif * 1000) / 1000;
        pdif = Math.floor(pdif * (1 + Math.random() * 0.05) * 1000) / 1000;

        if (isCrit) {
            pdif += 1;
            return Math.max(1, Math.floor(baseDamage * pdif * (1 + critBonus)));
        }
        return Math.max(1, Math.floor(baseDamage * pdif));
    }

    function attack(attacker, defender) {
        const aStats = getCombatStats(attacker);
        const dStats = getCombatStats(defender);
        const hitChance = calculateHitChance(aStats.acc, dStats.eva, aStats.level, dStats.level);
        if (Math.random() < hitChance) {
            const critChance = calculateCriticalChance(attacker, defender);
            const isCrit = Math.random() < critChance;
            const dmg = calculatePhysicalDamage(attacker, defender, aStats, dStats, isCrit);
            if (defender === activeCharacter) {
                activeCharacter.hp = Math.max(0, activeCharacter.hp - dmg);
            } else {
                defender.currentHP = Math.max(0, defender.currentHP - dmg);
            }
            if (isCrit) {
                log(`${attacker.name} critically hits ${defender.name} for ${dmg} damage.`);
            } else {
                log(`${attacker.name} hits ${defender.name} for ${dmg} damage.`);
            }
            if (defender.currentHP <= 0 && defender !== activeCharacter) {
                const idx = mobs.indexOf(defender);
                if (idx !== -1) monsterDefeated(idx);
            }
        } else {
            log(`${attacker.name} misses.`);
        }
        update();
    }

    function endBattle() {
        if (activeCharacter.hp <= 0) {
            activeCharacter.hp = 1;
            setLocation(activeCharacter, activeCharacter.spawnPoint || activeCharacter.homeCity);
            clearTemporaryEffects(activeCharacter);
            log('You were defeated and return to your home point.');
        }
        battleEnded = true;
        const btn = document.createElement('button');
        btn.textContent = 'Continue';
        btn.addEventListener('click', () => {
            if (destination && activeCharacter.hp > 0) {
                setLocation(activeCharacter, destination);
            }
            persistCharacter(activeCharacter);
            refreshMainMenu(app);
        });
        container.appendChild(btn);
    }

    function monsterTurn() {
        if (battleEnded) return;
        for (const m of mobs) {
            if (m.currentHP > 0) {
                attack(m, activeCharacter);
                if (activeCharacter.hp <= 0) break;
            }
        }
        if (activeCharacter.hp > 0 && mobs.length > 0) {
            playerTurn();
        } else {
            endBattle();
        }
    }

    function playerTurn() {
        if (battleEnded) return;
        if (mobs.length === 0) return endBattle();
        const actionDiv = document.createElement('div');
        actionDiv.id = 'action-buttons';

        const attackBtn = document.createElement('button');
        attackBtn.textContent = 'Attack';

        const abilitySelect = document.createElement('select');
        const abilityBtn = document.createElement('button');
        abilityBtn.textContent = 'Ability';
        const jobData = jobs.find(j => j.name === activeCharacter.job) || {};
        const availableAbilities = (jobData.abilities || [])
            .filter(a => a.level <= activeCharacter.level);
        availableAbilities.forEach(a => abilitySelect.appendChild(new Option(a.name, a.name)));

        const magicSelect = document.createElement('select');
        const magicBtn = document.createElement('button');
        magicBtn.textContent = 'Magic';
        const spells = activeCharacter.spells || [];
        spells.forEach(s => magicSelect.appendChild(new Option(s, s)));
        if (!spells.length) magicBtn.disabled = true;

        const fleeBtn = document.createElement('button');
        fleeBtn.textContent = 'Flee';

        const attackWrap = document.createElement('div');
        attackWrap.className = 'action-cell';
        attackWrap.appendChild(attackBtn);

        const abilityWrap = document.createElement('div');
        abilityWrap.className = 'action-cell with-select';
        abilityWrap.appendChild(abilityBtn);
        abilityWrap.appendChild(abilitySelect);

        const magicWrap = document.createElement('div');
        magicWrap.className = 'action-cell with-select';
        magicWrap.appendChild(magicBtn);
        magicWrap.appendChild(magicSelect);

        const fleeWrap = document.createElement('div');
        fleeWrap.className = 'action-cell';
        fleeWrap.appendChild(fleeBtn);

        actionDiv.appendChild(attackWrap);
        actionDiv.appendChild(abilityWrap);
        actionDiv.appendChild(fleeWrap);
        actionDiv.appendChild(magicWrap);

        actionColumn.appendChild(actionDiv);

        function attemptFlee() {
            const playerAgi = activeCharacter.stats.agi;
            mobs.forEach(m => {
                const mobAgi = m.agi !== undefined ? m.agi : (m.vit ?? parseLevel(m.level) * 2) + 1;
                let chance = 0.5 + (playerAgi - mobAgi) * 0.05;
                chance = Math.max(0.05, Math.min(0.95, chance));
                if (Math.random() < chance) {
                    log(`${activeCharacter.name} fled from ${m.name}.`);
                    if (m.listIndex !== undefined && nearbyMonsters[m.listIndex]) {
                        nearbyMonsters[m.listIndex].aggro = false;
                    }
                } else {
                    log(`${m.name} keeps chase.`);
                }
            });
            endBattle();
            return true;
        }

        function afterAction() {
            if (battleEnded) return;
            if (mobs.length > 0) {
                monsterTurn();
            } else {
                endBattle();
            }
        }

        attackBtn.addEventListener('click', () => {
            actionColumn.removeChild(actionDiv);
            attack(activeCharacter, currentTarget);
            afterAction();
        });

        abilityBtn.addEventListener('click', () => {
            actionColumn.removeChild(actionDiv);
            const name = abilitySelect.value || 'Ability';
            log(`${activeCharacter.name} uses ${name}.`);
            attack(activeCharacter, currentTarget);
            afterAction();
        });

        magicBtn.addEventListener('click', () => {
            actionColumn.removeChild(actionDiv);
            const spell = magicSelect.value || 'Spell';
            log(`${activeCharacter.name} casts ${spell}.`);
            attack(activeCharacter, currentTarget);
            afterAction();
        });

        fleeBtn.addEventListener('click', () => {
            actionColumn.removeChild(actionDiv);
            if (attemptFlee()) return;
            monsterTurn();
        });
    }

    log(`A ${mobs.map(m=>m.name).join(', ')} appear!`);
    update();
    playerTurn();
}

// Legacy function no longer used
function renderTravelScreen(root) {
    if (!activeCharacter) return;
    root.innerHTML = '';
    const loc = locations.find(l => l.name === activeCharacter.currentLocation);
    const title = document.createElement('h2');
    title.textContent = 'Zone';
    root.appendChild(title);

    const list = document.createElement('ul');
    if (loc) {
        loc.connectedAreas.forEach(area => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = area;
            btn.addEventListener('click', () => {
                setLocation(activeCharacter, area);
                refreshMainMenu(root.parentElement);
            });
            li.appendChild(btn);
            list.appendChild(li);
        });
    }
    root.appendChild(list);

    showBackButton(() => refreshMainMenu(root.parentElement));
}

function Travel() {
    renderTravelScreen(document.getElementById('app'));
}

function Explore() {
    console.log('Explore not implemented');
}

function Skills() {
    console.log('Skills not implemented');
}

function Magic() {
    console.log('Magic not implemented');
}

function buyItem(id, qty = 1) {
    const item = items[id];
    const cost = item.price * qty;
    if (activeCharacter.gil < cost) {
        alert('Not enough gil!');
        return;
    }
    activeCharacter.gil -= cost;
    const existing = activeCharacter.inventory.find(i => i.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        activeCharacter.inventory.push({ id, qty });
    }
    persistCharacter(activeCharacter);
    alert(`Purchased ${qty} x ${item.name}.`);
}

function sellItem(id, qty = 1) {
    const entry = activeCharacter.inventory.find(i => i.id === id);
    if (!entry) return;
    qty = Math.min(qty, entry.qty);
    if (qty <= 0) return;
    const item = items[id];
    const revenue = (item.sellPrice || Math.floor(item.price / 2)) * qty;
    activeCharacter.gil += revenue;
    entry.qty -= qty;
    if (entry.qty <= 0) {
        const idx = activeCharacter.inventory.indexOf(entry);
        activeCharacter.inventory.splice(idx, 1);
    }
    persistCharacter(activeCharacter);
    alert(`Sold ${qty} x ${item.name} for ${revenue} gil.`);
}

function renderVendorMenu(root, vendor, backFn = null, shopName = null) {
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = shopName || vendor;
    root.appendChild(title);
    const intro = document.createElement('p');
    if (shopName) intro.textContent = `You enter ${shopName} and approach ${vendor}.`;
    else intro.textContent = `You approach ${vendor}.`;
    root.appendChild(intro);
    const greet = document.createElement('p');
    greet.textContent = vendorGreetings[vendor] || 'Welcome, traveler.';
    root.appendChild(greet);
    root.appendChild(characterSummary());
    const buyBtn = document.createElement('button');
    buyBtn.textContent = 'Buy';
    buyBtn.addEventListener('click', () => {
        renderVendorScreen(root, vendor, backFn, 'buy');
    });
    const sellBtn = document.createElement('button');
    sellBtn.textContent = 'Sell';
    sellBtn.addEventListener('click', () => {
        renderVendorScreen(root, vendor, backFn, 'sell');
    });
    root.appendChild(buyBtn);
    root.appendChild(sellBtn);
    const handler = backFn || (() => refreshMainMenu(root.parentElement));
    showBackButton(handler);
}

export function renderVendorScreen(root, vendor, backFn = null, mode = 'buy') {
    root.innerHTML = '';
    resetDetails();
    const title = document.createElement('h2');
    title.textContent = vendor;
    root.appendChild(title);
    root.appendChild(characterSummary());
    if (mode === 'buy') {
        const list = document.createElement('div');
        list.className = 'vendor-list';
        const inv = vendorInventories[vendor] || [];
        inv.forEach(id => {
        const item = items[id];
        const row = document.createElement('div');
        row.className = 'vendor-item';
        const top = document.createElement('div');
        top.className = 'vendor-row-top';
        const name = document.createElement('span');
        name.textContent = item.name;
        if (!meetsRequirements(item)) name.style.color = 'red';
        else if (canEquipItem(item) && isBetterItem(item)) name.style.color = 'lightgreen';
        if (/^scroll/i.test(id)) {
            const spell = item.name.replace(/^Scroll of\s+/i, '');
            if (activeCharacter.spells && activeCharacter.spells.includes(spell)) {
                name.style.color = 'gray';
            }
        } else if (/Map$/.test(id)) {
            if (activeCharacter.inventory.some(e => e.id === id)) {
                name.style.color = 'lightskyblue';
            }
        }
        top.appendChild(name);
        const price = document.createElement('span');
        price.textContent = ` - ${item.price} gil`;
        if (item.price > activeCharacter.gil) price.style.color = 'red';
        top.appendChild(price);
        const detail = document.createElement('button');
        detail.textContent = 'Details';
        top.appendChild(detail);
        let qtyInput = null;
        if (item.stack > 1) {
            qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = '1';
            qtyInput.max = String(item.stack);
            qtyInput.value = '1';
            qtyInput.className = 'vendor-qty';
            top.appendChild(qtyInput);
        }
        const buyBtn = document.createElement('button');
        buyBtn.textContent = 'Buy';
        buyBtn.addEventListener('click', () => {
            const q = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            buyItem(id, q);
        });
        top.appendChild(buyBtn);
        row.appendChild(top);
        const detailsWrap = document.createElement('div');
        detailsWrap.className = 'item-details hidden';
        const desc = document.createElement('div');
        desc.className = 'item-description';
        desc.textContent = item.description || item.name;
        detailsWrap.appendChild(desc);
        const stats = basicStatsText(item);
        if (stats) {
            const s = document.createElement('div');
            s.className = 'item-stats';
            s.textContent = stats;
            detailsWrap.appendChild(s);
        }
        const req = requirementText(item);
        if (req) {
            const r = document.createElement('div');
            r.className = 'item-req';
            r.textContent = req;
            detailsWrap.appendChild(r);
        }
        row.appendChild(detailsWrap);
        detail.addEventListener('click', () => toggleDetails(detailsWrap));
            list.appendChild(row);
        });
        root.appendChild(list);
    }

    if (mode === 'sell') {
        const sellTitle = document.createElement('h3');
        sellTitle.textContent = 'Sell Items';
        root.appendChild(sellTitle);
        const sellList = document.createElement('div');
        sellList.className = 'vendor-list';
        const equipped = new Set(Object.values(activeCharacter.equipment || {}));
        activeCharacter.inventory.forEach(entry => {
        if (equipped.has(entry.id)) return;
        const item = items[entry.id];
        const row = document.createElement('div');
        row.className = 'vendor-item';
        const top = document.createElement('div');
        top.className = 'vendor-row-top';
        const name = document.createElement('span');
        const qtyText = item.stack > 1 || entry.qty > 1 ? ` x${entry.qty}` : '';
        name.textContent = item.name + qtyText;
        top.appendChild(name);
        const price = document.createElement('span');
        const sp = item.sellPrice || Math.floor(item.price / 2);
        price.textContent = ` - ${sp} gil`;
        top.appendChild(price);
        let qtyInput = null;
        if ((item.stack > 1 || entry.qty > 1) && entry.qty > 1) {
            qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = '1';
            qtyInput.max = String(entry.qty);
            qtyInput.value = '1';
            qtyInput.className = 'vendor-qty';
            top.appendChild(qtyInput);
        }
        const sellBtn = document.createElement('button');
        sellBtn.textContent = 'Sell';
        sellBtn.addEventListener('click', () => {
            const q = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            sellItem(entry.id, q);
            renderVendorScreen(root, vendor, backFn);
        });
        top.appendChild(sellBtn);
        row.appendChild(top);
        const detailsWrap = document.createElement('div');
        detailsWrap.className = 'item-details hidden';
        const desc = document.createElement('div');
        desc.className = 'item-description';
        desc.textContent = item.description || item.name;
        detailsWrap.appendChild(desc);
        row.appendChild(detailsWrap);
        const detailBtn = document.createElement('button');
        detailBtn.textContent = 'Details';
        detailBtn.addEventListener('click', () => toggleDetails(detailsWrap));
        top.appendChild(detailBtn);
            sellList.appendChild(row);
        });
        root.appendChild(sellList);
    }
    showBackButton(() => renderVendorMenu(root, vendor, backFn));
}

export function renderConquestShop(root, backFn = null) {
    root.innerHTML = '';
    resetDetails();
    const title = document.createElement('h2');
    title.textContent = 'Conquest Rewards';
    root.appendChild(title);
    root.appendChild(characterSummary());
    const list = document.createElement('div');
    list.className = 'vendor-list';
    Object.entries(conquestRewards).forEach(([id, cost]) => {
        const item = items[id];
        const row = document.createElement('div');
        row.className = 'vendor-item';
        const top = document.createElement('div');
        top.className = 'vendor-row-top';
        const name = document.createElement('span');
        name.textContent = item.name;
        top.appendChild(name);
        const price = document.createElement('span');
        price.textContent = ` - ${cost} CP`;
        if (cost > (activeCharacter.conquestPoints || 0)) price.style.color = 'red';
        top.appendChild(price);
        const detail = document.createElement('button');
        detail.textContent = 'Details';
        top.appendChild(detail);
        const buyBtn = document.createElement('button');
        buyBtn.textContent = 'Buy';
        buyBtn.addEventListener('click', () => {
            if ((activeCharacter.conquestPoints || 0) < cost) {
                alert('Not enough Conquest Points!');
                return;
            }
            activeCharacter.conquestPoints -= cost;
            const existing = activeCharacter.inventory.find(i => i.id === id);
            if (existing) existing.qty += 1; else activeCharacter.inventory.push({ id, qty: 1 });
            persistCharacter(activeCharacter);
            alert(`Purchased ${item.name}.`);
            renderConquestShop(root, backFn);
        });
        top.appendChild(buyBtn);
        row.appendChild(top);
        const detailsWrap = document.createElement('div');
        detailsWrap.className = 'item-details hidden';
        const desc = document.createElement('div');
        desc.className = 'item-description';
        desc.textContent = item.description || item.name;
        detailsWrap.appendChild(desc);
        row.appendChild(detailsWrap);
        detail.addEventListener('click', () => toggleDetails(detailsWrap));
        list.appendChild(row);
    });
    root.appendChild(list);
    showBackButton(backFn || (() => refreshMainMenu(root.parentElement)));
}

export function renderEquipmentScreen(root) {
    root.innerHTML = '';
    resetDetails();
    const title = document.createElement('h2');
    title.textContent = 'Equipment';
    root.appendChild(title);
    root.appendChild(characterSummary());
    if (!activeCharacter) {
        const p = document.createElement('p');
        p.textContent = 'No active character';
        root.appendChild(p);
    } else {
        const list = document.createElement('ul');
        list.className = 'equipment-list';
        const slots = {
            head: 'Head', body: 'Body', hands: 'Hands', legs: 'Legs', feet: 'Feet',
            mainHand: 'Main Hand', offHand: 'Off Hand', ranged: 'Ranged', ammo: 'Ammo',
            back: 'Back', waist: 'Waist', neck: 'Neck',
            leftEar: 'Left Ear', rightEar: 'Right Ear',
            leftRing: 'Left Ring', rightRing: 'Right Ring'
        };
        for (const key of Object.keys(slots)) {
            const li = document.createElement('li');
            li.className = 'equipment-item';
            const top = document.createElement('div');
            top.className = 'equipment-row-top';
            const itemId = activeCharacter.equipment?.[key];
            const item = items[itemId];
            const nameDiv = document.createElement('span');
            nameDiv.textContent = `${slots[key]}: ${item ? item.name : itemId || 'Empty'}`;
            if (item && !meetsRequirements(item)) nameDiv.style.color = 'red';
            top.appendChild(nameDiv);
            if (item) {
                const detailsBtn = document.createElement('button');
                detailsBtn.textContent = 'Details';
                top.appendChild(detailsBtn);
                li.appendChild(top);
                const detailsWrap = document.createElement('div');
                detailsWrap.className = 'item-details hidden';
                const desc = document.createElement('div');
                desc.className = 'item-description';
                desc.textContent = item.description || item.name;
                detailsWrap.appendChild(desc);
                const stats = basicStatsText(item);
                if (stats) {
                    const s = document.createElement('div');
                    s.className = 'item-stats';
                    s.textContent = stats;
                    detailsWrap.appendChild(s);
                }
                const reqTxt = requirementText(item);
                if (reqTxt) {
                    const r = document.createElement('div');
                    r.className = 'item-req';
                    r.textContent = reqTxt;
                    detailsWrap.appendChild(r);
                }
                li.appendChild(detailsWrap);
                detailsBtn.addEventListener('click', () => toggleDetails(detailsWrap));
            } else {
                li.appendChild(top);
            }
            if (itemId) {
                const unequip = document.createElement('button');
                unequip.textContent = 'Unequip';
                unequip.addEventListener('click', () => {
                    activeCharacter.equipment[key] = null;
                    persistCharacter(activeCharacter);
                    renderEquipmentScreen(root);
                });
                top.appendChild(unequip);
            }
            list.appendChild(li);
        }
        root.appendChild(list);
    }
    showBackButton(() => refreshMainMenu(root.parentElement));
}

function getItemCategory(item) {
    if (item.damage !== undefined || item.delay !== undefined) return 'Weapons';
    if (item.defense !== undefined) return 'Armor';
    if (/crystal/i.test(item.name)) return 'Crystals';
    if (/potion|ether|antidote|pie|jerky|water/i.test(item.name)) return 'Consumables';
    if (/ore|ingot|thread|log|chip/i.test(item.name)) return 'Crafting Materials';
    return 'Misc Loot';
}

function canEquipItem(item) {
    return item.slot && meetsRequirements(item);
}

function requirementText(item) {
    const parts = [];
    if (item.levelRequirement) parts.push(`Lv.${item.levelRequirement}`);
    if (item.jobs) parts.push(item.jobs.join('/'));
    if (item.races) parts.push(item.races.join('/'));
    if (item.sex) parts.push(item.sex);
    return parts.join(' ');
}

function equipItem(id, root) {
    const item = items[id];
    if (!canEquipItem(item)) return;
    activeCharacter.equipment[item.slot] = id;
    persistCharacter(activeCharacter);
    renderInventoryScreen(root);
}

function useScroll(id, root) {
    const entry = activeCharacter.inventory.find(i => i.id === id);
    if (!entry) return;
    const item = items[id];
    const spell = item.name.replace(/^Scroll of\s+/i, '');
    if (!activeCharacter.spells) activeCharacter.spells = [];
    if (activeCharacter.spells.includes(spell)) {
        alert(`${spell} is already learned.`);
    } else {
        activeCharacter.spells.push(spell);
        alert(`${spell} learned!`);
    }
    entry.qty -= 1;
    if (entry.qty <= 0) {
        const idx = activeCharacter.inventory.indexOf(entry);
        activeCharacter.inventory.splice(idx, 1);
    }
    persistCharacter(activeCharacter);
    renderInventoryScreen(root);
}

export function renderInventoryScreen(root) {
    if (!activeCharacter) return;
    root.innerHTML = '';
    resetDetails();
    const title = document.createElement('h2');
    title.textContent = 'Inventory';
    root.appendChild(title);
    const categories = {
        Weapons: [],
        Armor: [],
        'Crafting Materials': [],
        Crystals: [],
        Consumables: [],
        'Misc Loot': []
    };
    activeCharacter.inventory.forEach(entry => {
        const item = items[entry.id];
        const cat = getItemCategory(item);
        categories[cat].push({ item, qty: entry.qty, id: entry.id });
    });
    Object.keys(categories).forEach(cat => {
        const list = categories[cat];
        if (!list.length) return;

        const headerBtn = document.createElement('button');
        headerBtn.className = 'inventory-header';
        headerBtn.textContent = cat;
        root.appendChild(headerBtn);

        const section = document.createElement('div');
        section.className = 'inventory-section';
        root.appendChild(section);

        const ul = document.createElement('ul');
        ul.className = 'inventory-list';
        section.appendChild(ul);

        headerBtn.addEventListener('click', () => {
            section.classList.toggle('hidden');
        });

        list.forEach(ent => {
            const li = document.createElement('li');
            li.className = 'inventory-item';

            const row = document.createElement('div');
            row.className = 'inventory-row-top';

            const info = document.createElement('div');
            info.className = 'item-info';
            const qtyText = ent.item.stack > 1 && ent.qty > 1 ? ` x${ent.qty}` : '';
            const statsInline = basicStatsText(ent.item);
            info.textContent = ent.item.name + qtyText + (statsInline ? ` (${statsInline})` : '');
            if (!meetsRequirements(ent.item)) info.style.color = 'red';
            else if (canEquipItem(ent.item) && isBetterItem(ent.item)) info.style.color = 'lightgreen';
            row.appendChild(info);

            const actions = document.createElement('div');
            actions.className = 'item-actions';

            const detailsBtn = document.createElement('button');
            detailsBtn.textContent = 'Details';
            actions.appendChild(detailsBtn);

            if (canEquipItem(ent.item)) {
                const eq = document.createElement('button');
                if (activeCharacter.equipment[ent.item.slot] === ent.id) {
                    eq.textContent = 'Equipped';
                } else {
                    eq.textContent = 'Equip';
                    eq.addEventListener('click', () => equipItem(ent.id, root));
                }
                actions.appendChild(eq);
            } else if (/^Scroll of/i.test(ent.item.name)) {
                const learnBtn = document.createElement('button');
                learnBtn.textContent = 'Use';
                learnBtn.addEventListener('click', () => useScroll(ent.id, root));
                if (activeCharacter.spells && activeCharacter.spells.includes(ent.item.name.replace(/^Scroll of\s+/i, ''))) {
                    learnBtn.disabled = true;
                }
                actions.appendChild(learnBtn);
            }

            row.appendChild(actions);
            li.appendChild(row);

            const detailsWrap = document.createElement('div');
            detailsWrap.className = 'item-details hidden';
            const stats = basicStatsText(ent.item);
            if (stats) {
                const s = document.createElement('div');
                s.className = 'item-stats';
                s.textContent = stats;
                detailsWrap.appendChild(s);
            }
            li.appendChild(detailsWrap);
            detailsBtn.addEventListener('click', () => toggleDetails(detailsWrap));
            ul.appendChild(li);
        });
    });
    showBackButton(() => refreshMainMenu(root.parentElement));
}

function openMenu(name, backFn) {
    const root = document.getElementById('app');
    const backHandler = backFn || (() => refreshMainMenu(root));
    if (shopNpcs[name]) {
        const npcs = shopNpcs[name];
        if (npcs.length === 1) {
            renderVendorMenu(root, npcs[0], backHandler, name);
            return;
        }
        root.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = name;
        root.appendChild(title);
        const intro = document.createElement('p');
        intro.textContent = `You enter ${name}. Inside you see:`;
        root.appendChild(intro);
        const list = document.createElement('ul');
        npcs.forEach(npc => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = npc + (vendorTypes[npc] ? ` - ${vendorTypes[npc]}` : '');
            btn.addEventListener('click', () => openMenu(npc, () => openMenu(name, backFn)));
            li.appendChild(btn);
            list.appendChild(li);
        });
        root.appendChild(list);
        showBackButton(backHandler);
    } else if (vendorInventories[name]) {
        renderVendorMenu(root, name, backHandler);
    } else if (/Home Point Crystal/i.test(name)) {
        root.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = 'Home Point Crystal';
        root.appendChild(title);
        root.appendChild(characterSummary());
        const zone = activeCharacter.currentLocation;
        if (!activeCharacter.homePoints.includes(zone)) {
            activeCharacter.homePoints.push(zone);
            alert('You have attuned to this home point crystal.');
            persistCharacter(activeCharacter);
        }
        const setBtn = document.createElement('button');
        setBtn.textContent = 'Set Home Point';
        setBtn.addEventListener('click', () => {
            activeCharacter.currentHomePoint = zone;
            activeCharacter.spawnPoint = zone;
            alert('Home point set.');
            persistCharacter(activeCharacter);
        });
        root.appendChild(setBtn);
        const select = document.createElement('select');
        activeCharacter.homePoints.forEach(hp => {
            const opt = new Option(hp, hp);
            select.appendChild(opt);
        });
        const warpBtn = document.createElement('button');
        warpBtn.textContent = 'Teleport (1000 gil)';
        warpBtn.addEventListener('click', () => {
            const dest = select.value;
            if (activeCharacter.gil < 1000) return alert('Not enough gil.');
            activeCharacter.gil -= 1000;
            setLocation(activeCharacter, dest);
            persistCharacter(activeCharacter);
            refreshMainMenu(root);
        });
        root.appendChild(document.createElement('br'));
        root.appendChild(select);
        root.appendChild(warpBtn);
        showBackButton(backHandler);
    } else if (/Gate Guard|I\.M\./i.test(name)) {
        root.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = 'Gate Guard';
        root.appendChild(title);
        root.appendChild(characterSummary());
        const signetBtn = document.createElement('button');
        signetBtn.textContent = 'Receive Signet';
        signetBtn.addEventListener('click', () => {
            grantSignet(activeCharacter);
            alert('Signet bestowed.');
            persistCharacter(activeCharacter);
            refreshMainMenu(root);
        });
        root.appendChild(signetBtn);
        const rewardBtn = document.createElement('button');
        rewardBtn.textContent = 'Redeem Conquest Points';
        rewardBtn.addEventListener('click', () => {
            renderConquestShop(root, backHandler);
        });
        root.appendChild(rewardBtn);
        showBackButton(backHandler);
    } else {
        alert(`Opening menu for ${name}`);
    }
}
