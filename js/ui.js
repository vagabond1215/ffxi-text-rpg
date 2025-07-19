import { characters, jobNames, raceNames, createNewCharacter } from '../data/index.js';

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

    menu.appendChild(charactersBtn);
    menu.appendChild(randomBtn);

    container.appendChild(title);
    container.appendChild(menu);

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

    const list = document.createElement('div');
    characters.forEach((ch) => {
        const entry = document.createElement('div');
        entry.textContent = `${ch.name} - ${ch.race} ${ch.job} Lv.${ch.level}`;
        list.appendChild(entry);
    });
    root.appendChild(list);

    const newBtn = document.createElement('button');
    newBtn.textContent = 'New Character';
    newBtn.addEventListener('click', () => {
        createNewCharacter();
        renderCharacterMenu(root);
    });
    root.appendChild(newBtn);

    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });

    root.appendChild(document.createElement('br'));
    root.appendChild(back);
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
