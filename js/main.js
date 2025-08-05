import { renderMainMenu, renderCharacterMenu, setupBackButton, renderUserControls, setupLogControls, setupTimeDisplay, setupMapOverlay, setupItemPopup, setupStoragePopup, setupProfilePopup, setupMenuButton, updateTimeDisplay, isLogFullscreen, adjustLogFontSize, setupPressFeedback } from './ui.js';
import { loadCharacters, initCurrentUser, initNotorious, activeCharacter, persistCharacter } from '../data/index.js';
import { startTicks, onTick } from './tick.js';

// Entry point: initialize application
let uiScale = 1;

onTick(() => {
    const ch = activeCharacter;
    if (!ch) return;
    const maxHp = (ch.raceHP || 0) + (ch.jobHP || 0) + (ch.sJobHP || 0);
    const maxMp = (ch.raceMP || 0) + (ch.jobMP || 0) + (ch.sJobMP || 0);
    const newHp = Math.min(maxHp, (ch.hp ?? maxHp) + 1);
    const newMp = Math.min(maxMp, (ch.mp ?? maxMp) + 1);
    if (newHp !== ch.hp || newMp !== ch.mp) {
        ch.hp = newHp;
        ch.mp = newMp;
        persistCharacter(ch);
    }
});

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

    const storagePopup = document.getElementById('storage-popup');
    const storagePopupContent = document.getElementById('storage-popup-content');
    const storagePopupClose = document.getElementById('storage-popup-close');
    if (storagePopup && storagePopupContent && storagePopupClose) {
        setupStoragePopup(storagePopup, storagePopupContent, storagePopupClose);
    }

    const profilePopup = document.getElementById('profile-popup');
    const profilePopupContent = document.getElementById('profile-popup-content');
    const profilePopupClose = document.getElementById('profile-popup-close');
    if (profilePopup && profilePopupContent && profilePopupClose) {
        setupProfilePopup(profilePopup, profilePopupContent, profilePopupClose);
    }

    const menuBtn = document.getElementById('menu-button');
    const menuPopup = document.getElementById('menu-popup');
    if (menuBtn && menuPopup) {
        setupMenuButton(menuBtn, menuPopup);
    }

    startTicks();
}

document.addEventListener('DOMContentLoaded', init);
