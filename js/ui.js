import {
    characters,
    activeCharacter,
    jobNames,
    raceNames,
    baseJobNames,
    jobs,
    createCharacterObject,
    createNewCharacter,
    clearSavedCharacters,
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

    const randomBtn = document.createElement('button');
    randomBtn.textContent = 'Random Race & Job';
    randomBtn.addEventListener('click', () => {
        const race = raceNames[Math.floor(Math.random() * raceNames.length)];
        const job = jobNames[Math.floor(Math.random() * jobNames.length)];
        displayRandomSelection(container, race, job);
    });

    const adventureBtn = document.createElement('button');
    adventureBtn.textContent = 'Adventure';
    adventureBtn.addEventListener('click', () => {
        renderPlayUI(container);
    });

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Data';
    clearBtn.addEventListener('click', () => {
        clearSavedCharacters();
        const newMenu = renderMainMenu();
        container.replaceWith(newMenu);
    });

    menu.appendChild(charactersBtn);
    menu.appendChild(randomBtn);
    menu.appendChild(adventureBtn);
    menu.appendChild(clearBtn);

    container.appendChild(title);
    container.appendChild(menu);

    if (activeCharacter) {
        const profile = document.createElement('p');
        profile.id = 'active-profile';
        profile.textContent = `${activeCharacter.name} - ${activeCharacter.race} ${activeCharacter.sex} ${activeCharacter.job} Lv.${activeCharacter.level} HP:${activeCharacter.hp} MP:${activeCharacter.mp}`;
        container.appendChild(profile);
    }

    const display = document.createElement('p');
    display.id = 'random-display';
    container.appendChild(display);

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
        const label = document.createElement('span');
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

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = `Adventurer ${characters.length + 1}`;
    root.appendChild(nameLabel);
    root.appendChild(nameInput);
    root.appendChild(document.createElement('br'));

    const raceLabel = document.createElement('label');
    raceLabel.textContent = 'Race:';
    const raceSelect = document.createElement('select');
    raceNames.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        raceSelect.appendChild(opt);
    });
    root.appendChild(raceLabel);
    root.appendChild(raceSelect);
    root.appendChild(document.createElement('br'));

    const sexLabel = document.createElement('label');
    sexLabel.textContent = 'Sex:';
    const sexSelect = document.createElement('select');
    ['Male', 'Female'].forEach(s => {
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s;
        sexSelect.appendChild(opt);
    });
    root.appendChild(sexLabel);
    root.appendChild(sexSelect);
    root.appendChild(document.createElement('br'));

    const jobLabel = document.createElement('label');
    jobLabel.textContent = 'Job:';
    const jobSelect = document.createElement('select');
    baseJobNames.forEach(j => {
        const opt = document.createElement('option');
        opt.value = j;
        opt.textContent = j;
        jobSelect.appendChild(opt);
    });
    root.appendChild(jobLabel);
    root.appendChild(jobSelect);
    root.appendChild(document.createElement('br'));

    const infoDiv = document.createElement('div');
    root.appendChild(infoDiv);

    function updateInfo() {
        const preview = createCharacterObject(
            nameInput.value.trim() || `Adventurer ${characters.length + 1}`,
            jobSelect.value,
            raceSelect.value,
            sexSelect.value
        );
        infoDiv.innerHTML = `HP: ${preview.hp} | MP: ${preview.mp}`;
        const job = jobs.find(j => j.name === jobSelect.value);
        if (job) {
            const trait = job.traits[0];
            const ability = job.abilities[0];
            infoDiv.innerHTML += '<br>';
            if (trait) infoDiv.innerHTML += `Trait: ${trait.name} - ${trait.effect}<br>`;
            if (ability) infoDiv.innerHTML += `Ability: ${ability.name} - ${ability.effect}`;
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

function displayRandomSelection(root, race, job) {
    let display = root.querySelector('#random-display');
    if (!display) {
        display = document.createElement('p');
        display.id = 'random-display';
        root.appendChild(display);
    }
    display.textContent = `Race: ${race} | Job: ${job}`;
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
