import {
    characters,
    activeCharacter,
    raceNames,
    baseJobNames,
    jobs,
    startingCities,
    createCharacterObject,
    createNewCharacter,
    saveCharacterSlot,
    loadCharacterSlot,
    deleteCharacterSlot
} from '../data/index.js';

export function renderMainMenu() {
    const container = document.createElement('div');
    const title = document.createElement('h1');
    title.textContent = 'FFXI Adventures';

    const menu = document.createElement('div');
    menu.id = 'menu';

    const charactersBtn = document.createElement('button');
    charactersBtn.textContent = 'Characters';
    charactersBtn.addEventListener('click', () => {
        renderCharacterMenu(container);
    });

    const adventureBtn = document.createElement('button');
    adventureBtn.textContent = 'Adventure';
    adventureBtn.addEventListener('click', () => {
        renderPlayUI(container);
    });

    menu.appendChild(charactersBtn);
    menu.appendChild(adventureBtn);

    container.appendChild(title);
    container.appendChild(menu);

    if (activeCharacter) {
        const profile = document.createElement('div');
        profile.id = 'active-profile';

        const line1 = document.createElement('div');
        line1.textContent = `${activeCharacter.name} ${activeCharacter.sex} ${activeCharacter.race}`;
        const line2 = document.createElement('div');

        const subJob = Object.keys(activeCharacter.jobs || {}).find(j => j !== activeCharacter.job);
        const subLvl = subJob ? activeCharacter.jobs[subJob] : 0;
        let jobText = `${activeCharacter.job} Lv.${activeCharacter.level}`;
        if (subJob) {
            jobText = `${activeCharacter.job}/${subJob} ${activeCharacter.level}/${subLvl}`;
        }
        line2.textContent = `${jobText} HP: ${activeCharacter.hp} MP: ${activeCharacter.mp} TP: ${activeCharacter.tp}`;

        profile.appendChild(line1);
        profile.appendChild(line2);
        container.appendChild(profile);

        const info = document.createElement('div');
        info.className = 'profile-info';

        const buttons = document.createElement('div');
        buttons.className = 'info-buttons';
        const display = document.createElement('div');
        display.className = 'info-display';

        const sections = [
            { label: 'Traits', data: activeCharacter.traits },
            { label: 'Abilities', data: activeCharacter.abilities },
            { label: 'Skills', data: activeCharacter.skills },
            { label: 'Weapon Skills', data: activeCharacter.weaponSkills },
            { label: 'Magic', data: activeCharacter.magic }
        ];

        sections.forEach(sec => {
            const btn = document.createElement('button');
            btn.textContent = sec.label;
            btn.addEventListener('click', () => {
                display.innerHTML = '';
                const ul = document.createElement('ul');
                if (sec.data && sec.data.length) {
                    sec.data.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item.name || item;
                        ul.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.textContent = 'None';
                    ul.appendChild(li);
                }
                display.appendChild(ul);
            });
            buttons.appendChild(btn);
        });

        info.appendChild(buttons);
        info.appendChild(display);
        container.appendChild(info);
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
        loadBtn.textContent = 'Load';
        loadBtn.addEventListener('click', () => {
            loadCharacterSlot(i);
            renderCharacterMenu(root);
        });
        entry.appendChild(loadBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', () => {
            saveCharacterSlot(i);
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
    const title = document.createElement('h3');
    title.textContent = 'Create Character';
    root.appendChild(title);

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
    nameInput.value = `Adventurer ${characters.length + 1}`;
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
    ['Male', 'Female'].forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        sexSelect.appendChild(opt);
    });
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
        sexSelect.value = ['Male', 'Female'][Math.floor(Math.random() * 2)];
        updateInfo();
    });
    inputs.appendChild(randomBtn);

    form.appendChild(inputs);
    // middle column: stats display
    const statsCol = document.createElement('div');
    statsCol.className = 'form-stats';
    const statsList = document.createElement('ul');
    statsList.className = 'stats-list';
    statsCol.appendChild(statsList);
    const cityDiv = document.createElement('div');
    cityDiv.className = 'start-city';
    statsCol.appendChild(cityDiv);
    form.appendChild(statsCol);

    // right column: traits and abilities
    const infoCol = document.createElement('div');
    infoCol.className = 'form-traits';

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
        cityDiv.textContent = `Starting City: ${startingCities[raceSelect.value]}`;

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

    nameInput.addEventListener('input', updateInfo);
    raceSelect.addEventListener('change', updateInfo);
    sexSelect.addEventListener('change', updateInfo);
    jobSelect.addEventListener('change', updateInfo);
    updateInfo();

    const createBtn = document.createElement('button');
    createBtn.textContent = 'Create';
    createBtn.addEventListener('click', () => {
        createNewCharacter(
            nameInput.value.trim() || undefined,
            jobSelect.value,
            raceSelect.value,
            sexSelect.value
        );
        renderCharacterMenu(root);
    });
    root.appendChild(createBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        renderCharacterMenu(root);
    });
    root.appendChild(cancelBtn);
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
