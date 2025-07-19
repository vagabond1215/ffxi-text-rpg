import { characters } from '../data/characters.js';

export function renderMainMenu() {
    const container = document.createElement('div');
    const title = document.createElement('h1');
    title.textContent = 'FFXI Adventures';

    const menu = document.createElement('div');
    menu.id = 'menu';

    const charSelectBtn = document.createElement('button');
    charSelectBtn.textContent = 'Character Select';
    charSelectBtn.addEventListener('click', () => {
        renderCharacterSelect(container);
    });

    menu.appendChild(charSelectBtn);

    container.appendChild(title);
    container.appendChild(menu);

    return container;
}

export function renderCharacterSelect(root) {
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = 'Choose Your Character';
    root.appendChild(title);

    characters.forEach((ch) => {
        const btn = document.createElement('button');
        btn.textContent = ch.name;
        btn.addEventListener('click', () => {
            alert(`${ch.name} selected!`);
        });
        root.appendChild(btn);
    });

    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => {
        const menu = renderMainMenu();
        root.replaceWith(menu);
    });

    root.appendChild(document.createElement('br'));
    root.appendChild(back);
}
