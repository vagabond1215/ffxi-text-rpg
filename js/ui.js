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
    items,
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
    setLocation
} from '../data/index.js';
import { randomName, raceInfo, jobInfo, cityImages, characterImages, getZoneTravelTurns, rollForEncounter, exploreEncounter, parseLevel, experienceForKill, expNeeded } from '../data/index.js';

let backButtonElement = null;

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
    div.textContent = `${activeCharacter.name} - Lv.${activeCharacter.level} ${activeCharacter.sex} ${activeCharacter.race} ${activeCharacter.job}`;
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
    hideBackButton();
    const container = document.createElement('div');
    const title = document.createElement('h1');
    title.textContent = activeCharacter ? activeCharacter.name : 'FFXI Adventures';

    const menu = document.createElement('div');
    menu.id = 'menu';

    const areaBtn = document.createElement('button');
    areaBtn.textContent = activeCharacter?.currentLocation || 'Area';
    areaBtn.addEventListener('click', () => {
        renderAreaScreen(container);
    });

    const loc = activeCharacter && locations.find(l => l.name === activeCharacter.currentLocation);
    const restBtn = document.createElement('button');
    restBtn.textContent = 'Rest';
    restBtn.addEventListener('click', () => {
        if (activeCharacter) {
            updateDerivedStats(activeCharacter);
            activeCharacter.tp = 0;
        }
        const menu = renderMainMenu();
        container.replaceWith(menu);
    });
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
    menu.appendChild(areaBtn);
    if (loc && loc.distance > 0) menu.appendChild(restBtn);
    menu.appendChild(invBtn);
    menu.appendChild(equipBtn);
    container.appendChild(title);

    const layout = document.createElement('div');
    layout.className = 'main-layout';

    if (activeCharacter) {
        const profile = document.createElement('div');
        profile.id = 'active-profile';

        const charImg = document.createElement('img');
        charImg.className = 'character-img';
        charImg.src = characterImages[activeCharacter.race]?.[activeCharacter.sex]?.[activeCharacter.job] || '';

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
                const menu = renderMainMenu();
                container.replaceWith(menu);
            });
        }

        profile.appendChild(charImg);
        profile.appendChild(line2);
        profile.appendChild(line3);
        profile.appendChild(line4);
        profile.appendChild(line5);
        profile.appendChild(line6);
        if (modeBtn) profile.appendChild(modeBtn);
        layout.appendChild(profile);

        // Previously the main menu displayed several buttons that allowed the
        // player to inspect traits, abilities, skills and other details. Those
        // buttons have been removed to simplify the profile view. The character
        // information now only shows the basic profile lines above.
    }
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

    showBackButton(() => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
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

    const raceImg = document.createElement('img');
    raceImg.className = 'race-img';
    statsCol.appendChild(raceImg);

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
        raceImg.src = characterImages[raceSelect.value]?.[sexSelect.value]?.[jobSelect.value] || '';
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


export function renderPlayUI(root) {
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
    showBackButton(() => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
}

export function renderAreaScreen(root) {
    if (!activeCharacter) return;
    root.innerHTML = '';
    root.appendChild(statusEffectsDisplay());
    const loc = locations.find(l => l.name === activeCharacter.currentLocation);
    const title = document.createElement('h2');
    title.textContent = loc ? loc.name : 'Unknown Area';
    root.appendChild(title);

    if (loc) {
        const grid = document.createElement('div');
        grid.id = 'area-grid';

        const travelCol = document.createElement('div');
        travelCol.className = 'area-column';
        const travelHeader = document.createElement('h3');
        travelHeader.textContent = 'Zone';
        travelCol.appendChild(travelHeader);
        const travelList = document.createElement('ul');

        if (loc.distance > 0) {
            const exploreLi = document.createElement('li');
            const exploreBtn = document.createElement('button');
            exploreBtn.textContent = 'Explore';
            exploreBtn.className = 'explore-btn';
            exploreBtn.addEventListener('click', () => {
                const mob = exploreEncounter(loc.name);
                if (mob) {
                    renderCombatScreen(root, mob);
                }
            });
            exploreLi.appendChild(exploreBtn);
            travelList.appendChild(exploreLi);
        }

        const travelKeywords = /(airship|ferry|chocobo|rental|home point|dock|boat|stable|crystal)/i;
        const travelPOIs = loc.pointsOfInterest.filter(p => travelKeywords.test(p));

        const craftingKeywords = /guild/i;
        const craftingPOIs = loc.pointsOfInterest.filter(p => craftingKeywords.test(p) && !travelPOIs.includes(p));

        loc.connectedAreas.forEach(area => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            const total = getZoneTravelTurns(area, loc.name);
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
                if (!activeCharacter.travel || activeCharacter.travel.start !== loc.name || activeCharacter.travel.destination !== area) {
                    activeCharacter.travel = { start: loc.name, destination: area, remaining: total, total };
                }
                const mob = rollForEncounter(activeCharacter, loc.name);
                if (mob) {
                    renderCombatScreen(root, mob, area);
                    return;
                }
                activeCharacter.travel.remaining -= 1;
                if (activeCharacter.travel.remaining <= 0) {
                    setLocation(activeCharacter, area);
                    activeCharacter.travel = null;
                }
                persistCharacter(activeCharacter);
                renderAreaScreen(root);
            });
            li.appendChild(btn);
            travelList.appendChild(li);
        });

        travelPOIs.forEach(p => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = p;
            btn.addEventListener('click', () => openMenu(p));
            li.appendChild(btn);
            travelList.appendChild(li);
        });
        travelCol.appendChild(travelList);

        const craftPOIs = [];
        craftingPOIs.forEach(p => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = p;
            btn.addEventListener('click', () => openMenu(p));
            li.appendChild(btn);
            craftPOIs.push(li);
        });
        let craftCol = null;
        if (craftPOIs.length) {
            craftCol = document.createElement('div');
            craftCol.className = 'area-column';
            const craftHeader = document.createElement('h3');
            craftHeader.textContent = 'Crafting';
            craftCol.appendChild(craftHeader);
            const craftList = document.createElement('ul');
            craftPOIs.forEach(li => craftList.appendChild(li));
            craftCol.appendChild(craftList);
        }

        const marketKeywords = /(shop|store|auction|merchant|market|armor|armour|weapon|smith|vendor)/i;
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
        let marketCol = null;
        if (marketItems.length) {
            marketCol = document.createElement('div');
            marketCol.className = 'area-column';
            const marketHeader = document.createElement('h3');
            marketHeader.textContent = 'Marketplace';
            marketCol.appendChild(marketHeader);
            const marketList = document.createElement('ul');
            marketItems.forEach(li => marketList.appendChild(li));
            marketCol.appendChild(marketList);
        }

        const otherCol = document.createElement('div');
        otherCol.className = 'area-column';
        const otherHeader = document.createElement('h3');
        otherHeader.textContent = 'Other';
        otherCol.appendChild(otherHeader);
        const otherList = document.createElement('ul');

        loc.pointsOfInterest.forEach(p => {
            if (travelPOIs.includes(p) || craftingPOIs.includes(p) || marketPOIs.includes(p)) return;
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = p;
            btn.addEventListener('click', () => openMenu(p));
            li.appendChild(btn);
            otherList.appendChild(li);
        });
        const merchantNPC = /(merchant|shop|store|auction)/i;
        loc.importantNPCs.forEach(n => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = n;
            btn.addEventListener('click', () => openMenu(n));
            li.appendChild(btn);
            if (merchantNPC.test(n)) {
                marketList.appendChild(li);
            } else {
                otherList.appendChild(li);
            }
        });
        otherCol.appendChild(otherList);

        grid.appendChild(travelCol);
        if (craftCol) grid.appendChild(craftCol);
        if (marketCol) grid.appendChild(marketCol);
        grid.appendChild(otherCol);
        root.appendChild(grid);
    }

    showBackButton(() => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
}

function renderCombatScreen(root, mob, destination) {
    if (!activeCharacter) return;
    root.innerHTML = '';
    root.appendChild(statusEffectsDisplay());
    const container = document.createElement('div');
    container.id = 'combat-screen';

    const playerDiv = document.createElement('div');
    playerDiv.className = 'combat-player';
    playerDiv.innerHTML = `<h3>${activeCharacter.name}</h3><div id="player-hp">HP: ${activeCharacter.hp}</div>`;

    mob.currentHP = parseLevel(mob.level) * 20;
    const mobDiv = document.createElement('div');
    mobDiv.className = 'combat-monster';
    mobDiv.innerHTML = `<h3>${mob.name}</h3><div id="mob-hp">HP: ${mob.currentHP}</div>`;

    const logDiv = document.createElement('div');
    logDiv.id = 'combat-log';
    logDiv.className = 'combat-log';

    container.appendChild(playerDiv);
    container.appendChild(logDiv);
    container.appendChild(mobDiv);
    root.appendChild(container);

    const playerDelay = items[activeCharacter.equipment?.mainHand]?.delay || 240;
    const mobDelay = mob.delay || 240;
    const mobLevel = parseLevel(mob.level);
    const mobScale = mobLevel * 2;
    let timeToPlayer = playerDelay;
    let timeToMob = mobDelay;
    let battleEnded = false;

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
        const level = mobLevel;
        const dex = mob.dex !== undefined ? mob.dex : mob.str;
        const agi = mob.agi !== undefined ? mob.agi : (mob.vit ?? mobScale) + 1;
        const weaponSkill = mob.weaponSkill || level * 5;
        const evasionSkill = mob.evasionSkill || level * 5;
        const str = mob.str ?? mobScale;
        const vit = mob.vit ?? mobScale;
        return {
            atk: str + level,
            def: vit + level,
            acc: calculateAccuracy(dex, weaponSkill),
            eva: calculateEvasion(agi, evasionSkill),
            level
        };
    }

    function log(msg) {
        const p = document.createElement('div');
        p.textContent = msg;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    function findItemIdByName(name) {
        for (const [id, data] of Object.entries(items)) {
            if (data.name === name) return id;
        }
        return null;
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

    function victory(exp, gil, itemDrops) {
        mob.currentHP = 0;
        update();
        battleEnded = true;
        const lootDiv = document.createElement('div');
        lootDiv.className = 'loot-display';
        const msg = document.createElement('div');
        msg.textContent = `You defeat the ${mob.name}!`;
        lootDiv.appendChild(msg);
        const list = document.createElement('ul');
        if (exp > 0) {
            const li = document.createElement('li');
            li.textContent = `${exp} EXP`;
            list.appendChild(li);
        }
        if (gil > 0) {
            const li = document.createElement('li');
            li.textContent = `${gil} gil`;
            list.appendChild(li);
        }
        itemDrops.forEach(it => {
            const li = document.createElement('li');
            const name = items[it.id]?.name || it.id;
            li.textContent = name + (it.qty > 1 ? ` x${it.qty}` : '');
            list.appendChild(li);
        });
        lootDiv.appendChild(list);
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
                }
            }
            activeCharacter.gil += gil;
            addItemsToInventory(itemDrops);
            if (destination && activeCharacter.hp > 0) {
                setLocation(activeCharacter, destination);
            }
            persistCharacter(activeCharacter);
            renderAreaScreen(root);
        });
        lootDiv.appendChild(btn);
        root.appendChild(lootDiv);
    }

    function update() {
        document.getElementById('player-hp').textContent = `HP: ${activeCharacter.hp}`;
        document.getElementById('mob-hp').textContent = `HP: ${mob.currentHP}`;
    }

    function monsterDefeated() {
        const exp = experienceForKill(activeCharacter.level, mobLevel);
        let gil = 0;
        if (/(Orc|Yagudo|Goblin|Quadav|Moblin)/i.test(mob.name)) {
            gil = Math.floor(mobLevel * 5 + Math.random() * mobLevel * 5);
        }
        const drops = [];
        if (mob.drops && mob.drops.length) {
            const name = mob.drops[Math.floor(Math.random() * mob.drops.length)];
            const id = findItemIdByName(name);
            if (id) drops.push({ id, qty: 1 });
        }
        if (hasSignet(activeCharacter) && Math.random() < 0.1) {
            const crystalId = Object.keys(items).find(k => /Crystal/i.test(items[k].name));
            if (crystalId) drops.push({ id: crystalId, qty: 1 });
        }
        victory(exp, gil, drops);
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
                mob.currentHP = Math.max(0, mob.currentHP - dmg);
            }
            if (isCrit) {
                log(`${attacker.name} critically hits ${defender.name} for ${dmg} damage.`);
            } else {
                log(`${attacker.name} hits ${defender.name} for ${dmg} damage.`);
            }
            if (mob.currentHP <= 0 && defender !== activeCharacter) {
                monsterDefeated();
            }
        } else {
            log(`${attacker.name} misses.`);
        }
        update();
    }

    function endBattle() {
        if (activeCharacter.hp <= 0) {
            activeCharacter.hp = 1;
            setLocation(activeCharacter, activeCharacter.currentHomePoint || activeCharacter.startingCity);
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
            renderAreaScreen(root);
        });
        root.appendChild(btn);
    }

    function monsterTurn() {
        if (battleEnded) return;
        if (mob.currentHP <= 0) return endBattle();
        attack(mob, activeCharacter);
        if (activeCharacter.hp > 0) {
            nextTurn();
        } else {
            endBattle();
        }
    }

    function playerTurn() {
        if (battleEnded) return;
        if (mob.currentHP <= 0) return endBattle();
        const actionDiv = document.createElement('div');

        const command = document.createElement('select');
        const actOpt = new Option('Attack', 'attack');
        const abilOpt = new Option('Ability', 'ability');
        const magicOpt = new Option('Magic', 'magic');
        const fleeOpt = new Option('Flee', 'flee');
        [actOpt, abilOpt, magicOpt, fleeOpt].forEach(o => command.appendChild(o));

        const abilitySelect = document.createElement('select');
        const jobData = jobs.find(j => j.name === activeCharacter.job) || {};
        const availableAbilities = (jobData.abilities || []).filter(a => a.level <= activeCharacter.level);
        availableAbilities.forEach(a => abilitySelect.appendChild(new Option(a.name, a.name)));
        abilitySelect.style.display = 'none';

        const spellsByJob = {
            'White Mage': ['Cure'],
            'Black Mage': ['Fire'],
            'Red Mage': ['Cure', 'Fire']
        };
        const magicSelect = document.createElement('select');
        const spells = spellsByJob[activeCharacter.job] || [];
        spells.forEach(s => magicSelect.appendChild(new Option(s, s)));
        magicSelect.style.display = 'none';

        const go = document.createElement('button');
        go.textContent = 'Go';

        command.addEventListener('change', () => {
            abilitySelect.style.display = command.value === 'ability' ? 'inline' : 'none';
            magicSelect.style.display = command.value === 'magic' ? 'inline' : 'none';
        });

        actionDiv.appendChild(command);
        actionDiv.appendChild(abilitySelect);
        actionDiv.appendChild(magicSelect);
        actionDiv.appendChild(go);
        root.appendChild(actionDiv);

        function attemptFlee() {
            const playerAgi = activeCharacter.stats.agi;
            const mobAgi = mob.agi !== undefined ? mob.agi : (mob.vit ?? mobScale) + 1;
            let chance = 0.5 + (playerAgi - mobAgi) * 0.05;
            chance = Math.max(0.05, Math.min(0.95, chance));
            if (Math.random() < chance) {
                log(`${activeCharacter.name} fled successfully!`);
                endBattle();
                return true;
            }
            log(`${activeCharacter.name} failed to flee.`);
            return false;
        }

        go.addEventListener('click', () => {
            root.removeChild(actionDiv);
            const choice = command.value;
            if (choice === 'attack') {
                attack(activeCharacter, mob);
            } else if (choice === 'ability') {
                const name = abilitySelect.value || 'Ability';
                log(`${activeCharacter.name} uses ${name}.`);
                attack(activeCharacter, mob);
            } else if (choice === 'magic') {
                const spell = magicSelect.value || 'Spell';
                log(`${activeCharacter.name} casts ${spell}.`);
                attack(activeCharacter, mob);
            } else if (choice === 'flee') {
                if (attemptFlee()) return; // battle ended on success
                return nextTurn();
            }
            if (battleEnded) return;
            if (mob.currentHP > 0) {
                nextTurn();
            } else {
                endBattle();
            }
        });
    }

    log(`A ${mob.name} appears!`);
    update();

    function nextTurn() {
        if (battleEnded) return;
        if (timeToPlayer <= timeToMob) {
            timeToMob -= timeToPlayer;
            timeToPlayer = playerDelay;
            playerTurn();
        } else {
            timeToPlayer -= timeToMob;
            timeToMob = mobDelay;
            monsterTurn();
        }
    }

    nextTurn();
}

export function renderTravelScreen(root) {
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
                renderAreaScreen(root);
            });
            li.appendChild(btn);
            list.appendChild(li);
        });
    }
    root.appendChild(list);

    showBackButton(() => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
}

export function Travel() {
    renderTravelScreen(document.getElementById('app'));
}

export function Explore() {
    console.log('Explore not implemented');
}

export function Skills() {
    console.log('Skills not implemented');
}

export function Magic() {
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

export function renderVendorScreen(root, vendor, backFn = null) {
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = vendor;
    root.appendChild(title);
    root.appendChild(characterSummary());
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
        top.appendChild(name);
        const price = document.createElement('span');
        price.textContent = ` - ${item.price} gil`;
        if (item.price > activeCharacter.gil) price.style.color = 'red';
        top.appendChild(price);
        const detail = document.createElement('button');
        detail.textContent = 'Details';
        detail.addEventListener('click', () => alert(itemDetailsText(item)));
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
        const desc = document.createElement('div');
        desc.className = 'item-description';
        desc.textContent = item.description || item.name;
        row.appendChild(desc);
        const stats = basicStatsText(item);
        if (stats) {
            const s = document.createElement('div');
            s.className = 'item-stats';
            s.textContent = stats;
            row.appendChild(s);
        }
        const req = requirementText(item);
        if (req) {
            const r = document.createElement('div');
            r.className = 'item-req';
            r.textContent = req;
            row.appendChild(r);
        }
        list.appendChild(row);
    });
    root.appendChild(list);

    const sellTitle = document.createElement('h3');
    sellTitle.textContent = 'Sell Items';
    root.appendChild(sellTitle);
    const sellList = document.createElement('div');
    sellList.className = 'vendor-list';
    activeCharacter.inventory.forEach(entry => {
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
        const desc = document.createElement('div');
        desc.className = 'item-description';
        desc.textContent = item.description || item.name;
        row.appendChild(desc);
        sellList.appendChild(row);
    });
    root.appendChild(sellList);
    const handler = backFn || (() => renderAreaScreen(root));
    showBackButton(handler);
}

export function renderEquipmentScreen(root) {
    root.innerHTML = '';
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
            const itemId = activeCharacter.equipment?.[key];
            const item = items[itemId];
            const nameDiv = document.createElement('div');
            nameDiv.textContent = `${slots[key]}: ${item ? item.name : itemId || 'Empty'}`;
            if (item) {
                if (!meetsRequirements(item)) nameDiv.style.color = 'red';
            }
            li.appendChild(nameDiv);
            if (item) {
                const desc = document.createElement('div');
                desc.className = 'item-description';
                desc.textContent = item.description || item.name;
                li.appendChild(desc);
                const stats = basicStatsText(item);
                if (stats) {
                    const s = document.createElement('div');
                    s.className = 'item-stats';
                    s.textContent = stats;
                    li.appendChild(s);
                }
                const reqTxt = requirementText(item);
                if (reqTxt) {
                    const r = document.createElement('div');
                    r.className = 'item-req';
                    r.textContent = reqTxt;
                    li.appendChild(r);
                }
                const details = document.createElement('button');
                details.textContent = 'Details';
                details.addEventListener('click', () => alert(itemDetailsText(item)));
                li.appendChild(details);
            }
            if (itemId) {
                const unequip = document.createElement('button');
                unequip.textContent = 'Unequip';
                unequip.addEventListener('click', () => {
                    activeCharacter.equipment[key] = null;
                    persistCharacter(activeCharacter);
                    renderEquipmentScreen(root);
                });
                li.appendChild(unequip);
            }
            list.appendChild(li);
        }
        root.appendChild(list);
    }
    showBackButton(() => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
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

export function renderInventoryScreen(root) {
    if (!activeCharacter) return;
    root.innerHTML = '';
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
        const h = document.createElement('h3');
        h.textContent = cat;
        root.appendChild(h);
        const ul = document.createElement('ul');
        ul.className = 'inventory-list';
        list.forEach(ent => {
            const li = document.createElement('li');
            const nameSpan = document.createElement('span');
            const qtyText = ent.item.stack > 1 && ent.qty > 1 ? ` x${ent.qty}` : '';
            nameSpan.textContent = ent.item.name + qtyText;
            if (!meetsRequirements(ent.item)) nameSpan.style.color = 'red';
            else if (canEquipItem(ent.item) && isBetterItem(ent.item)) nameSpan.style.color = 'lightgreen';
            li.appendChild(nameSpan);
            const details = document.createElement('button');
            details.textContent = 'Details';
            details.addEventListener('click', () => alert(itemDetailsText(ent.item)));
            li.appendChild(details);
            if (canEquipItem(ent.item)) {
                const eq = document.createElement('button');
                if (activeCharacter.equipment[ent.item.slot] === ent.id) {
                    eq.textContent = 'Equipped';
                } else {
                    eq.textContent = 'Equip';
                    eq.addEventListener('click', () => equipItem(ent.id, root));
                }
                li.appendChild(eq);
            }
            const stats = basicStatsText(ent.item);
            if (stats) {
                const s = document.createElement('div');
                s.className = 'item-stats';
                s.textContent = stats;
                li.appendChild(s);
            }
            ul.appendChild(li);
        });
        root.appendChild(ul);
    });
    showBackButton(() => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
}

function openMenu(name, backFn) {
    const root = document.getElementById('app');
    const backHandler = backFn || (() => renderAreaScreen(root));
    if (shopNpcs[name]) {
        root.innerHTML = '';
        const title = document.createElement('h2');
        title.textContent = name;
        root.appendChild(title);
        const list = document.createElement('ul');
        shopNpcs[name].forEach(npc => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = npc;
            btn.addEventListener('click', () => openMenu(npc, () => openMenu(name, backFn)));
            li.appendChild(btn);
            list.appendChild(li);
        });
        root.appendChild(list);
        showBackButton(backHandler);
    } else if (vendorInventories[name]) {
        renderVendorScreen(root, name, backHandler);
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
            renderAreaScreen(root);
        });
        root.appendChild(document.createElement('br'));
        root.appendChild(select);
        root.appendChild(warpBtn);
        showBackButton(backHandler);
    } else if (/Gate Guard/i.test(name)) {
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
            renderAreaScreen(root);
        });
        root.appendChild(signetBtn);
        showBackButton(backHandler);
    } else {
        alert(`Opening menu for ${name}`);
    }
}
