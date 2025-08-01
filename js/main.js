import { renderMainMenu, renderCharacterMenu, setupBackButton, renderUserControls, setupLogControls, setupTimeDisplay, setupMapOverlay, setupItemPopup, updateTimeDisplay, isLogFullscreen, adjustLogFontSize, setupPressFeedback } from './ui.js';
import { loadCharacters, initCurrentUser, initNotorious, activeCharacter, persistCharacter } from '../data/index.js';

// Entry point: initialize application
let uiScale = 1;

function applyOrientation() {
    const portrait = window.innerHeight > window.innerWidth;
    document.body.classList.toggle('portrait', portrait);
    document.body.classList.toggle('landscape', !portrait);
}

function updateScale(delta) {
    if (isLogFullscreen()) {
        adjustLogFontSize(delta * 20);
    } else {
        uiScale = Math.max(0.5, Math.min(2, uiScale + delta));
        document.documentElement.style.setProperty('--ui-scale', uiScale);
        if (activeCharacter) {
            activeCharacter.uiScale = uiScale;
            persistCharacter(activeCharacter);
        }
    }
}

function init() {
    initCurrentUser();
    loadCharacters();
    uiScale = activeCharacter && activeCharacter.uiScale ? activeCharacter.uiScale : 1;
    document.documentElement.style.setProperty('--ui-scale', uiScale);
    initNotorious();
    renderUserControls();
    const app = document.getElementById('app');
    app.innerHTML = '';
    const menu = renderMainMenu();
    app.appendChild(menu);
    setupPressFeedback(document.body);
    if (!activeCharacter) {
        renderCharacterMenu(menu);
    }


    const backBtn = document.getElementById('back-button');
    if (backBtn) setupBackButton(backBtn);

    applyOrientation();
    window.addEventListener('resize', applyOrientation);

    const inc = document.getElementById('scale-inc');
    const dec = document.getElementById('scale-dec');
    if (inc && dec) {
        inc.addEventListener('click', () => updateScale(0.1));
        dec.addEventListener('click', () => updateScale(-0.1));
    }

    const logBtn = document.getElementById('log-button');
    const logPanel = document.getElementById('game-log');
    if (logBtn && logPanel) setupLogControls(logBtn, logPanel);

    const timeEl = document.getElementById('time-display');
    const timePopup = document.getElementById('time-popup');
    if (timeEl) {
        setupTimeDisplay(timeEl, timePopup);
        updateTimeDisplay();
    }

    const mapOverlay = document.getElementById('map-overlay');
    const mapImage = document.getElementById('map-image');
    const mapClose = document.getElementById('map-close');
    if (mapOverlay && mapImage && mapClose) {
        setupMapOverlay(mapOverlay, mapImage, mapClose);
    }

    const itemPopup = document.getElementById('item-popup');
    const itemPopupContent = document.getElementById('item-popup-content');
    const itemPopupClose = document.getElementById('item-popup-close');
    if (itemPopup && itemPopupContent && itemPopupClose) {
        setupItemPopup(itemPopup, itemPopupContent, itemPopupClose);
    }

    const charBtn = document.getElementById('character-select');
    if (charBtn) {
        charBtn.addEventListener('click', () => {
            const root = document.getElementById('app').firstElementChild;
            if (root) {
                renderCharacterMenu(root);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
