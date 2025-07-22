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
    items,
    updateDerivedStats
} from '../data/index.js';
import { randomName, raceInfo, jobInfo, cityImages, getZoneTravelTurns, rollForEncounter, parseLevel } from '../data/index.js';

export function renderMainMenu() {
    const container = document.createElement('div');
    const title = document.createElement('h1');
    title.textContent = 'FFXI Adventures';

    const menu = document.createElement('div');
    menu.id = 'menu';

    const areaBtn = document.createElement('button');
    areaBtn.textContent = 'Area';
    areaBtn.addEventListener('click', () => {
        renderAreaScreen(container);
    });

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
    menu.appendChild(areaBtn);
    menu.appendChild(restBtn);

    container.appendChild(title);
    container.appendChild(menu);

    if (activeCharacter) {
        const profile = document.createElement('div');
        profile.id = 'active-profile';

        const charImg = document.createElement('img');
        charImg.className = 'character-img';
        charImg.src = raceInfo[activeCharacter.race]?.image || '';

        const line1 = document.createElement('div');
        line1.textContent = `${activeCharacter.name} ${activeCharacter.sex} ${activeCharacter.race}`;
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
        const loc = activeCharacter.currentLocation || activeCharacter.startingCity || 'Unknown';
        line4.textContent = `Current location: ${loc}`;

        profile.appendChild(charImg);
        profile.appendChild(line1);
        profile.appendChild(line2);
        profile.appendChild(line3);
        profile.appendChild(line4);
        container.appendChild(profile);

        // Previously the main menu displayed several buttons that allowed the
        // player to inspect traits, abilities, skills and other details. Those
        // buttons have been removed to simplify the profile view. The character
        // information now only shows the basic profile lines above.
    }

    return container;
}

export function renderCharacterMenu(root) {
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = 'Characters';
    root.appendChild(title);

    const newBtn = document.createElement('button');
    newBtn.textContent = 'New Character';
    newBtn.addEventListener('click', () => {
        renderNewCharacterForm(root);
    });
    root.appendChild(newBtn);

    const list = document.createElement('div');
    list.id = 'slot-container';
    const maxSlots = 8;
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
            loadBtn.textContent = 'Load';
            loadBtn.addEventListener('click', () => {
                setActiveCharacter(ch);
                renderCharacterMenu(root);
            });
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

    const back = document.createElement('button');
    back.textContent = 'Return to Main Menu';
    back.addEventListener('click', () => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });

    root.appendChild(back);
}

function renderNewCharacterForm(root) {
    root.innerHTML = '';
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

    const statsList = document.createElement('ul');
    statsList.className = 'stats-list';
    inputs.appendChild(statsList);
    const cityDiv = document.createElement('div');
    cityDiv.className = 'start-city';
    inputs.appendChild(cityDiv);
    const cityImg = document.createElement('img');
    cityImg.className = 'city-img';
    inputs.appendChild(cityImg);

    form.appendChild(inputs);
    // middle column: stats display

    const statsCol = document.createElement('div');
    statsCol.className = 'form-stats';

    const raceHeader = document.createElement('h3');
    raceHeader.className = 'race-header';
    statsCol.appendChild(raceHeader);

    const raceDesc = document.createElement('p');
    raceDesc.className = 'race-desc';
    statsCol.appendChild(raceDesc);

    const raceImg = document.createElement('img');
    raceImg.className = 'race-img';
    statsCol.appendChild(raceImg);

    form.appendChild(statsCol);

    // right column: traits and abilities
    const infoCol = document.createElement('div');
    infoCol.className = 'form-traits';

    const jobHeader = document.createElement('h3');
    jobHeader.className = 'job-header';
    infoCol.appendChild(jobHeader);

    const jobDesc = document.createElement('p');
    jobDesc.className = 'job-desc';
    infoCol.appendChild(jobDesc);

    const jobImg = document.createElement('img');
    jobImg.className = 'job-img';
    infoCol.appendChild(jobImg);

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
        raceImg.src = raceInfo[raceSelect.value]?.image || '';
        raceDesc.textContent = raceInfo[raceSelect.value]?.description || '';
        jobHeader.textContent = jobSelect.value;
        jobImg.src = jobInfo[jobSelect.value]?.image || '';
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
    travelBtn.textContent = 'Travel';
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

    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });

    root.appendChild(document.createElement('br'));
    root.appendChild(back);
}

export function renderAreaScreen(root) {
    if (!activeCharacter) return;
    root.innerHTML = '';
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
        travelHeader.textContent = 'Travel';
        travelCol.appendChild(travelHeader);
        const travelList = document.createElement('ul');

        const travelKeywords = /(airship|ferry|chocobo|home point|gate|dock|boat)/i;
        const travelPOIs = loc.pointsOfInterest.filter(p => travelKeywords.test(p));

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
                    const prev = loc.name;
                    activeCharacter.currentLocation = area;
                    activeCharacter.travel = null;
                    if (activeCharacter.returnJourney) {
                        if (area === activeCharacter.returnJourney.zone) {
                            activeCharacter.returnJourney = null;
                        } else {
                            activeCharacter.returnJourney.turns = Math.min(activeCharacter.returnJourney.turns + 1, 10);
                        }
                    } else {
                        activeCharacter.returnJourney = { zone: prev, turns: 1 };
                    }
                }
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

        const marketCol = document.createElement('div');
        marketCol.className = 'area-column';
        const marketHeader = document.createElement('h3');
        marketHeader.textContent = 'Marketplace';
        marketCol.appendChild(marketHeader);
        const marketList = document.createElement('ul');

        const marketKeywords = /(shop|store|auction|guild|merchant|market)/i;
        const marketPOIs = loc.pointsOfInterest.filter(p => marketKeywords.test(p) && !travelPOIs.includes(p));

        marketPOIs.forEach(p => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = p;
            btn.addEventListener('click', () => openMenu(p));
            li.appendChild(btn);
            marketList.appendChild(li);
        });
        marketCol.appendChild(marketList);

        const otherCol = document.createElement('div');
        otherCol.className = 'area-column';
        const otherHeader = document.createElement('h3');
        otherHeader.textContent = 'Other';
        otherCol.appendChild(otherHeader);
        const otherList = document.createElement('ul');

        loc.pointsOfInterest.forEach(p => {
            if (travelPOIs.includes(p) || marketPOIs.includes(p)) return;
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = p;
            btn.addEventListener('click', () => openMenu(p));
            li.appendChild(btn);
            otherList.appendChild(li);
        });
        loc.importantNPCs.forEach(n => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = n;
            btn.addEventListener('click', () => openMenu(n));
            li.appendChild(btn);
            otherList.appendChild(li);
        });
        otherCol.appendChild(otherList);

        grid.appendChild(travelCol);
        grid.appendChild(marketCol);
        grid.appendChild(otherCol);
        root.appendChild(grid);
    }

    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
    root.appendChild(back);
}

function renderCombatScreen(root, mob, destination) {
    if (!activeCharacter) return;
    root.innerHTML = '';
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

    const playerInit = activeCharacter.stats.dex + activeCharacter.stats.agi;
    const mobInit = parseLevel(mob.level) * 2;

    const playerStats = {
        atk: activeCharacter.stats.str + activeCharacter.level,
        def: activeCharacter.stats.vit + activeCharacter.level,
        acc: activeCharacter.stats.dex + activeCharacter.level,
        eva: activeCharacter.stats.agi + activeCharacter.level
    };
    const mobStats = {
        atk: mobInit + 10,
        def: mobInit + 10,
        acc: mobInit + 10,
        eva: mobInit + 10
    };

    function log(msg) {
        const p = document.createElement('div');
        p.textContent = msg;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    function update() {
        document.getElementById('player-hp').textContent = `HP: ${activeCharacter.hp}`;
        document.getElementById('mob-hp').textContent = `HP: ${mob.currentHP}`;
    }

    function attack(attacker, defender, aStats, dStats) {
        const hitChance = Math.min(0.95, Math.max(0.05, (aStats.acc - dStats.eva + 50) / 100));
        if (Math.random() < hitChance) {
            const dmg = Math.max(1, aStats.atk - dStats.def + Math.floor(Math.random() * 5));
            if (defender === activeCharacter) {
                activeCharacter.hp -= dmg;
            } else {
                mob.currentHP -= dmg;
            }
            log(`${attacker.name} hits ${defender.name} for ${dmg} damage.`);
        } else {
            log(`${attacker.name} misses.`);
        }
        update();
    }

    function endBattle() {
        const btn = document.createElement('button');
        btn.textContent = 'Continue';
        btn.addEventListener('click', () => {
            if (destination) {
                activeCharacter.currentLocation = destination;
            }
            renderAreaScreen(root);
        });
        root.appendChild(btn);
    }

    function monsterTurn() {
        if (mob.currentHP <= 0) return endBattle();
        attack(mob, activeCharacter, mobStats, playerStats);
        if (activeCharacter.hp > 0) {
            playerTurn();
        } else {
            endBattle();
        }
    }

    function playerTurn() {
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
            const mobAgi = mobInit;
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
                attack(activeCharacter, mob, playerStats, mobStats);
            } else if (choice === 'ability') {
                const name = abilitySelect.value || 'Ability';
                log(`${activeCharacter.name} uses ${name}.`);
                attack(activeCharacter, mob, playerStats, mobStats);
            } else if (choice === 'magic') {
                const spell = magicSelect.value || 'Spell';
                log(`${activeCharacter.name} casts ${spell}.`);
                attack(activeCharacter, mob, playerStats, mobStats);
            } else if (choice === 'flee') {
                if (attemptFlee()) return; // battle ended on success
                return monsterTurn();
            }
            if (mob.currentHP > 0) {
                monsterTurn();
            } else {
                endBattle();
            }
        });
    }

    log(`A ${mob.name} appears!`);
    update();

    if (playerInit >= mobInit) {
        playerTurn();
    } else {
        monsterTurn();
    }
}

export function renderTravelScreen(root) {
    if (!activeCharacter) return;
    root.innerHTML = '';
    const loc = locations.find(l => l.name === activeCharacter.currentLocation);
    const title = document.createElement('h2');
    title.textContent = 'Travel';
    root.appendChild(title);

    const list = document.createElement('ul');
    if (loc) {
        loc.connectedAreas.forEach(area => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.textContent = area;
            btn.addEventListener('click', () => {
                activeCharacter.currentLocation = area;
                renderAreaScreen(root);
            });
            li.appendChild(btn);
            list.appendChild(li);
        });
    }
    root.appendChild(list);

    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });
    root.appendChild(back);
}

export function Travel() {
    console.log('Travel not implemented');
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
    alert(`Purchased ${qty} x ${item.name}.`);
}

export function renderVendorScreen(root, vendor) {
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = vendor;
    root.appendChild(title);
    const list = document.createElement('div');
    list.className = 'vendor-list';
    const inv = vendorInventories[vendor] || [];
    inv.forEach(id => {
        const item = items[id];
        const row = document.createElement('div');
        row.className = 'vendor-item';
        const name = document.createElement('span');
        name.textContent = `${item.name} - ${item.price} gil`;
        row.appendChild(name);
        const detail = document.createElement('button');
        detail.textContent = 'Details';
        detail.addEventListener('click', () => alert(item.description || item.name));
        row.appendChild(detail);
        let qtyInput = null;
        if (item.stack > 1) {
            qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = '1';
            qtyInput.max = String(item.stack);
            qtyInput.value = '1';
            qtyInput.className = 'vendor-qty';
            row.appendChild(qtyInput);
        }
        const buyBtn = document.createElement('button');
        buyBtn.textContent = 'Buy';
        buyBtn.addEventListener('click', () => {
            const q = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            buyItem(id, q);
        });
        row.appendChild(buyBtn);
        list.appendChild(row);
    });
    root.appendChild(list);
    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => renderAreaScreen(root));
    root.appendChild(back);
}

function openMenu(name) {
    const root = document.getElementById('app');
    if (vendorInventories[name]) {
        renderVendorScreen(root, name);
    } else {
        alert(`Opening menu for ${name}`);
    }
}
