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
    huntEncounter,
    parseCoordinate,
    coordinateDistance,
    stepToward,
    checkForNM,
    getSubArea,
    canMove,
    zoneMaps,
    advanceTime,
    formatTime,
    currentVanaTime,
    formatVanaTime,
    dayElements,
    changeJob,
    changeSubJob
} from '../data/index.js';
import { randomName, raceInfo, jobInfo, cityImages, characterImages, getZoneTravelTurns, exploreEncounter, parseLevel, expNeeded, expToLevel} from '../data/index.js';

let backButtonElement = null;
let openDetailElement = null;
let logButtonElement = null;
let logPanelElement = null;
let timeDisplayElement = null;
let timePopupElement = null;
let timePopupFontSize = 12;
let mapOverlayElement = null;
let mapImageElement = null;
let mapCloseElement = null;
let mapPanzoomInstance = null;
let itemPopupCloseElement = null;
let itemPopupElement = null;
let itemPopupContentElement = null;
let storagePopupCloseElement = null;
let storagePopupElement = null;
let storagePopupContentElement = null;
const gameLogMessages = [];
let currentTurn = 0;
let logFontSize = 14;
let nearbyMonsters = [];
let monsterCoordKey = '';
let selectedMonsterIndex = null;
let currentTargetMonster = null;
let partyMembers = [];
let selectedPartyIndex = null;
let partyListElement = null;

// Optional callback invoked when a monster is highlighted
let monsterSelectHandler = null;

let monsterListElement = null;
let updateMonsterDisplay = () => {};
let navColumnElement = null;

// Store details about the current monster list for debugging/consistency
let monsterIndexList = [];
let monsterNameList = [];
let monsterHpList = [];

const BASE_BOTTOM_PADDING = 60;

function itemProtected(id) {
    const presets = activeCharacter?.jobPresets || {};
    for (const set of Object.values(presets)) {
        if (Object.values(set).includes(id)) return true;
    }
    const item = items[id];
    return item && (item.keyItem || item.sellable === false && item.keyItem !== false);
}

// Apply a lightened style while a button is actively pressed
export function setupPressFeedback(root = document.body) {
    function add(e) {
        const btn = e.target.closest('button');
        if (btn) btn.classList.add('pressed');
    }
    function remove() {
        root.querySelectorAll('button.pressed').forEach(b => b.classList.remove('pressed'));
    }
    root.addEventListener('mousedown', add);
    root.addEventListener('touchstart', add, { passive: true });
    ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev =>
        root.addEventListener(ev, remove));
}

// Highlight the selected monster in the nearby monster list
export function updateTargetIndicator() {
    if (monsterListElement) {
        Array.from(monsterListElement.children).forEach(btn => {
            const idx = Number(btn.dataset.idx);
            btn.classList.toggle('target', idx === selectedMonsterIndex);
        });
    }
    if (partyListElement) {
        Array.from(partyListElement.children).forEach((btn, idx) => {
            btn.classList.toggle('target', idx === selectedPartyIndex);
        });
    }
}

// Ensure selectedMonsterIndex and character target stay in sync
export function setTargetIndex(idx) {
    if (idx === null || idx === undefined || idx < 0 || idx >= nearbyMonsters.length) {
        selectedMonsterIndex = null;
        if (activeCharacter) activeCharacter.targetIndex = null;
        currentTargetMonster = null;
    } else {
        selectedMonsterIndex = idx;
        selectedPartyIndex = null;
        if (activeCharacter) activeCharacter.targetIndex = idx;
        currentTargetMonster = nearbyMonsters[idx];
        if (currentTargetMonster && (currentTargetMonster.hp === undefined || currentTargetMonster.hp === null)) {
            currentTargetMonster.hp = currentTargetMonster.currentHP ?? parseLevel(currentTargetMonster.level) * 20;
        }
        if (currentTargetMonster && currentTargetMonster.currentHP === undefined) {
            currentTargetMonster.currentHP = currentTargetMonster.hp;
        }
        if (activeCharacter) persistCharacter(activeCharacter);
    }
    updateTargetIndicator();
}

export function getSelectedMonster(list = nearbyMonsters) {
    if (selectedMonsterIndex === null || !Array.isArray(list)) return null;
    let mob = list.find(m => m.listIndex === selectedMonsterIndex) || list[selectedMonsterIndex];
    if (!mob && list !== nearbyMonsters) {
        mob = nearbyMonsters[selectedMonsterIndex];
    }
    if (mob) {
        if (mob.hp === undefined || mob.hp === null) {
            mob.hp = mob.currentHP ?? parseLevel(mob.level) * 20;
        }
        if (mob.currentHP === undefined) {
            mob.currentHP = mob.hp;
        }
    }
    return mob || null;
}

export function setPartyTarget(idx) {
    if (idx === null || idx === undefined || idx < 0 || idx >= partyMembers.length) {
        selectedPartyIndex = null;
    } else {
        selectedPartyIndex = idx;
        selectedMonsterIndex = null;
        currentTargetMonster = null;
        if (activeCharacter) activeCharacter.targetIndex = null;
    }
    updateTargetIndicator();
}

export function getSelectedPartyMember() {
    if (selectedPartyIndex === null) return null;
    return partyMembers[selectedPartyIndex] || null;
}

function updateGameLogPadding() {
    if (!logPanelElement) return;
    const height = logPanelElement.classList.contains('hidden') ? 0 : logPanelElement.offsetHeight;
    document.body.style.paddingBottom = (BASE_BOTTOM_PADDING + height) + 'px';
}

export function setupTimeDisplay(el, popup) {
    timeDisplayElement = el;
    timePopupElement = popup;
    if (!timeDisplayElement) return;
    if (timePopupElement) {
        const controls = document.createElement('div');
        controls.className = 'font-controls';
        const dec = document.createElement('button');
        dec.textContent = '-';
        dec.addEventListener('click', e => { e.stopPropagation(); adjustTimePopupFontSize(-2); });
        const inc = document.createElement('button');
        inc.textContent = '+';
        inc.addEventListener('click', e => { e.stopPropagation(); adjustTimePopupFontSize(2); });
        controls.appendChild(dec);
        controls.appendChild(inc);
        timePopupElement.appendChild(controls);
        updateTimePopupFont();
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
    timeDisplayElement.innerHTML = `${icon} ${vt.hour.toString().padStart(2, '0')}:${vt.minute.toString().padStart(2, '0')}`;
}

export function setupMapOverlay(el, img, closeBtn) {
    mapOverlayElement = el;
    mapImageElement = img;
    mapCloseElement = closeBtn;
    if (!mapOverlayElement) return;
    if (mapCloseElement) {
        mapCloseElement.addEventListener('click', () => {
            mapOverlayElement.classList.add('hidden');
            if (mapPanzoomInstance) mapPanzoomInstance.reset();
        });
    }
    if (window.Panzoom && mapImageElement) {
        mapPanzoomInstance = Panzoom(mapImageElement, { maxScale: 5 });
        mapOverlayElement.addEventListener('wheel', mapPanzoomInstance.zoomWithWheel);
    }
}

export function setupItemPopup(el, content, closeBtn) {
    itemPopupElement = el;
    itemPopupContentElement = content;
    itemPopupCloseElement = closeBtn;
    if (itemPopupCloseElement) {
        itemPopupCloseElement.addEventListener('click', () => {
            if (itemPopupElement) itemPopupElement.classList.add('hidden');
        });
    }
}

let profilePopupElement = null;
let profilePopupContentElement = null;
let profilePopupCloseElement = null;

export function setupProfilePopup(el, content, closeBtn) {
    profilePopupElement = el;
    profilePopupContentElement = content;
    profilePopupCloseElement = closeBtn;
    if (profilePopupCloseElement) {
        profilePopupCloseElement.addEventListener('click', () => {
            if (profilePopupElement) profilePopupElement.classList.add('hidden');
        });
    }
}

export function showProfilePopup(details) {
    if (!profilePopupElement || !profilePopupContentElement) return;
    profilePopupContentElement.innerHTML = '';
    const clone = details.cloneNode(true);
    clone.classList.remove('hidden');
    profilePopupContentElement.appendChild(clone);
    const root = document.getElementById('app')?.firstElementChild;
    const invBtn = Array.from(clone.querySelectorAll('button')).find(b => b.textContent === 'Inventory');
    if (invBtn) {
        invBtn.addEventListener('click', () => {
            profilePopupElement.classList.add('hidden');
            if (root) renderInventoryScreen(root);
        });
    }
    const equipBtn = Array.from(clone.querySelectorAll('button')).find(b => b.textContent === 'Equipment');
    if (equipBtn) {
        equipBtn.addEventListener('click', () => {
            profilePopupElement.classList.add('hidden');
            if (root) renderEquipmentScreen(root);
        });
    }
    profilePopupElement.classList.remove('hidden');
}

export function showItemPopup(item) {
    if (!itemPopupElement || !itemPopupContentElement) return;
    itemPopupContentElement.innerHTML = '';
    const desc = document.createElement('div');
    desc.className = 'item-description';
    desc.textContent = item.description || item.name;
    itemPopupContentElement.appendChild(desc);
    if (item.effects) {
        const eff = document.createElement('div');
        eff.className = 'item-effects';
        eff.textContent = 'Effects: ' + item.effects.join(', ');
        itemPopupContentElement.appendChild(eff);
    }
    if (item.abilities) {
        const ab = document.createElement('div');
        ab.className = 'item-abilities';
        ab.textContent = 'Abilities: ' + item.abilities.join(', ');
        itemPopupContentElement.appendChild(ab);
    }
    const stats = basicStatsText(item);
    if (stats) {
        const s = document.createElement('div');
        s.className = 'item-stats';
        s.textContent = stats;
        itemPopupContentElement.appendChild(s);
    }
    const req = requirementText(item);
    if (req) {
        const r = document.createElement('div');
        r.className = 'item-req';
        r.textContent = req;
        itemPopupContentElement.appendChild(r);
    }
    itemPopupElement.classList.remove('hidden');
}

export function setupStoragePopup(el, content, closeBtn) {
    storagePopupElement = el;
    storagePopupContentElement = content;
    storagePopupCloseElement = closeBtn;
    if (storagePopupCloseElement) {
        storagePopupCloseElement.addEventListener('click', () => {
            if (storagePopupElement) storagePopupElement.classList.add('hidden');
        });
    }
}

function addItem(list, id, qty) {
    const item = items[id];
    if (!item) return;
    if (item.stack === 1) {
        for (let i = 0; i < qty; i++) list.push({ id, qty: 1 });
    } else {
        const existing = list.find(i => i.id === id);
        if (existing) existing.qty = Math.min(item.stack, existing.qty + qty);
        else list.push({ id, qty: Math.min(item.stack, qty) });
    }
}

function removeItem(list, id, qty) {
    const item = items[id];
    if (!item) return;
    if (item.stack === 1) {
        for (let i = 0; i < qty; i++) {
            const idx = list.findIndex(e => e.id === id);
            if (idx !== -1) list.splice(idx, 1);
        }
    } else {
        const entry = list.find(i => i.id === id);
        if (!entry) return;
        entry.qty -= qty;
        if (entry.qty <= 0) list.splice(list.indexOf(entry), 1);
    }
}

function renderTransferPopup(type) {
    if (!storagePopupContentElement || !activeCharacter) return;
    storagePopupContentElement.innerHTML = '';
    const filter = type === 'wardrobe' ? canEquipItem : (it => !canEquipItem(it));
    const dest = type === 'wardrobe' ? activeCharacter.wardrobe : activeCharacter.storage;
    const invItems = activeCharacter.inventory.map(e => ({ ...e }));
    const destItems = dest.map(e => ({ ...e }));
    Object.values(activeCharacter.equipment || {}).forEach(id => {
        if (id) {
            removeItem(invItems, id, 1);
            removeItem(destItems, id, 1);
        }
    });
    const invDiv = document.createElement('div');
    const destDiv = document.createElement('div');
    const invTitle = document.createElement('h3');
    invTitle.textContent = 'Inventory';
    invDiv.appendChild(invTitle);
    const invList = document.createElement('ul');
    invList.className = 'inventory-list';
    invItems.filter(e => filter(items[e.id])).forEach(ent => {
        const li = document.createElement('li');
        li.className = 'transfer-item';
        const span = document.createElement('span');
        const stack = items[ent.id].stack;
        const qtyText = stack > 1 && ent.qty > 1 ? ` x${ent.qty}` : '';
        span.textContent = `${items[ent.id].name}${qtyText}`;
        const btn = document.createElement('button');
        btn.className = 'transfer-arrow';
        btn.textContent = '→';
        btn.addEventListener('click', () => {
            removeItem(activeCharacter.inventory, ent.id, ent.qty);
            addItem(dest, ent.id, ent.qty);
            persistCharacter(activeCharacter);
            renderTransferPopup(type);
        });
        li.appendChild(span);
        li.appendChild(btn);
        invList.appendChild(li);
    });
    invDiv.appendChild(invList);

    const destTitle = document.createElement('h3');
    destTitle.textContent = type === 'wardrobe' ? 'Wardrobe' : 'Storage';
    destDiv.appendChild(destTitle);
    const destList = document.createElement('ul');
    destList.className = 'inventory-list';
    destItems.forEach(ent => {
        const li = document.createElement('li');
        li.className = 'transfer-item';
        const span = document.createElement('span');
        const stack = items[ent.id].stack;
        const qtyText = stack > 1 && ent.qty > 1 ? ` x${ent.qty}` : '';
        span.textContent = `${items[ent.id].name}${qtyText}`;
        const btn = document.createElement('button');
        btn.className = 'transfer-arrow';
        btn.textContent = '←';
        btn.addEventListener('click', () => {
            removeItem(dest, ent.id, ent.qty);
            addItem(activeCharacter.inventory, ent.id, ent.qty);
            persistCharacter(activeCharacter);
            renderTransferPopup(type);
        });
        li.appendChild(btn);
        if (type === 'wardrobe' && canEquipItem(items[ent.id])) {
            const eq = document.createElement('button');
            eq.textContent = 'Equip';
            eq.addEventListener('click', () => {
                activeCharacter.equipment[items[ent.id].slot] = ent.id;
                persistCharacter(activeCharacter);
                renderTransferPopup(type);
            });
            li.appendChild(eq);
        }
        li.appendChild(span);
        destList.appendChild(li);
    });
    destDiv.appendChild(destList);
    storagePopupContentElement.appendChild(invDiv);
    storagePopupContentElement.appendChild(destDiv);
}

export function showStoragePopup() {
    renderTransferPopup('storage');
    if (storagePopupElement) storagePopupElement.classList.remove('hidden');
}

export function showWardrobePopup() {
    renderTransferPopup('wardrobe');
    if (storagePopupElement) storagePopupElement.classList.remove('hidden');
}

function zoneSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

export function showMap(zone) {
    if (!mapOverlayElement || !mapImageElement) return;
    const slug = zoneSlug(zone);
    const pngPath = `img/maps/${slug}.png`;
    const jpgPath = `img/maps/${slug}.jpg`;
    const svgPath = `img/maps/${slug}.svg`;
    mapImageElement.onerror = () => {
        mapImageElement.onerror = () => {
            mapImageElement.src = 'img/maps/default_map.svg';
        };
        mapImageElement.src = jpgPath;
    };
    mapImageElement.src = pngPath;
    if (mapPanzoomInstance) mapPanzoomInstance.reset();
    mapOverlayElement.classList.remove('hidden');
}

function updateTimePopup() {
    if (!timePopupElement) return;
    const controls = document.getElementById('scale-controls');
    if (controls) {
        timePopupElement.style.width = controls.offsetWidth + 'px';
    }
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
    function nextScheduledTime(times) {
        const minutes = vt.hour * 60 + vt.minute;
        for (const t of times) {
            const [h, m] = t.split(':').map(Number);
            const tm = h * 60 + m;
            if (tm > minutes) return t;
        }
        return times[0];
    }

    const airshipSchedules = {
        "San d'Oria - Jeuno": ['04:12', '10:12', '16:12', '22:12'],
        'Bastok - Jeuno': ['01:12', '07:12', '13:12', '19:12'],
        'Windurst - Jeuno': ['05:43', '11:43', '17:43', '23:43'],
        'Kazham - Jeuno': ['02:42', '08:42', '14:42', '20:42']
    };

    const ferrySchedules = {
        'Selbina - Mhaura': ['00:00', '08:00', '16:00'],
        'Mhaura - Aht Urhgan': ['04:00', '12:00', '20:00']
    };

    const manaclipperSchedules = {
        'Bibiki Bay - Purgonorgo Isle': ['05:30', '17:30'],
        'Purgonorgo Isle - Bibiki Bay': ['09:15', '21:15'],
        'Bibiki Bay - Maliyakaleya Reef': ['12:50'],
        'Bibiki Bay - Dhalmel Rock': ['00:50']
    };

    const lines = [];
    lines.push(`${icon} ${formatVanaTime(vt)} - ${vt.weekday}`);
    lines.push(`${status} - ${nextChange}`);
    lines.push('');
    lines.push('Airships:');
    for (const [route, times] of Object.entries(airshipSchedules).sort((a,b) => a[0].localeCompare(b[0]))) {
        lines.push(`${route} departs: ${nextScheduledTime(times)}`);
    }
    lines.push('');
    lines.push('Ferries:');
    for (const [route, times] of Object.entries(ferrySchedules).sort((a,b) => a[0].localeCompare(b[0]))) {
        lines.push(`${route} departs: ${nextScheduledTime(times)}`);
    }
    for (const [route, times] of Object.entries(manaclipperSchedules)) {
        lines.push(`${route} departs: ${nextScheduledTime(times)}`);
    }
    const controlsDiv = timePopupElement.querySelector('.font-controls');
    const content = lines.map(l => `<div>${l}</div>`).join('');
    timePopupElement.innerHTML = '';
    if (controlsDiv) timePopupElement.appendChild(controlsDiv);
    timePopupElement.insertAdjacentHTML('beforeend', content);
}

function updateLogFont() {
    document.documentElement.style.setProperty('--log-font-size', `${logFontSize}px`);
}

function updateTimePopupFont() {
    document.documentElement.style.setProperty('--time-popup-font-size', `${timePopupFontSize}px`);
}

function pruneLog() {
    if (!logPanelElement) return;
    const full = logPanelElement.classList.contains('fullscreen');
    let shown = 0;
    gameLogMessages.forEach(obj => {
        if (!obj.div) {
            obj.div = document.createElement('div');
            obj.div.textContent = obj.msg;
            logPanelElement.prepend(obj.div);
        }
        let show;
        if (full) {
            show = true;
        } else if (obj.turn === currentTurn && shown < 5) {
            show = true;
            shown++;
        } else {
            show = false;
        }
        obj.div.style.display = show ? '' : 'none';
    });
    if (!full && shown === 0 && gameLogMessages.length) {
        const first = gameLogMessages[0];
        if (first.div) first.div.style.display = '';
    }
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
    updateLogFont();

    for (let i = gameLogMessages.length - 1; i >= 0; i--) {
        const obj = gameLogMessages[i];
        if (!obj.div) {
            obj.div = document.createElement('div');
            obj.div.textContent = obj.msg;
            logPanelElement.prepend(obj.div);
        }
    }

    const toggle = () => {
        const fs = logPanelElement.classList.toggle('fullscreen');
        logPanelElement.classList.toggle('hidden', false);
        pruneLog();
        updateGameLogPadding();
    };
    logButtonElement.addEventListener('click', toggle);
    pruneLog();
}

export function adjustLogFontSize(delta) {
    logFontSize = Math.max(8, Math.min(32, logFontSize + delta));
    updateLogFont();
}

export function adjustTimePopupFontSize(delta) {
    timePopupFontSize = Math.max(8, Math.min(32, timePopupFontSize + delta));
    updateTimePopupFont();
}

export function isLogFullscreen() {
    return !!(logPanelElement && logPanelElement.classList.contains('fullscreen'));
}

export function addGameLog(msg) {
    const obj = { msg, div: null, turn: currentTurn };
    gameLogMessages.unshift(obj);
    if (gameLogMessages.length > 50) {
        const old = gameLogMessages.pop();
        if (old.div && old.div.parentElement) old.div.parentElement.remove();
    }
    if (logPanelElement) {
        obj.div = document.createElement('div');
        obj.div.textContent = msg;
        logPanelElement.prepend(obj.div);
        pruneLog();
    }
}

export function showGameLogTemporarily(ms = 3000) {
    if (!logPanelElement) return;
    if (logPanelElement.classList.contains('fullscreen')) return;
    logPanelElement.classList.remove('hidden');
    pruneLog();
    setTimeout(() => {
        if (!logPanelElement.classList.contains('fullscreen')) {
            logPanelElement.classList.add('hidden');
            updateGameLogPadding();
        }
    }, ms);
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
    if (!activeCharacter.monsters) activeCharacter.monsters = [];
    if (activeCharacter.monsterCoord === undefined) activeCharacter.monsterCoord = '';

    if (key !== activeCharacter.monsterCoord || !activeCharacter.monsters.length) {
        const { list, aggro } = spawnNearbyMonsters(activeCharacter, zone);
        list.forEach((m, i) => { m.listIndex = i; });
        nearbyMonsters = list;
        activeCharacter.monsters = list;
        activeCharacter.monsterCoord = key;
        monsterCoordKey = key;
        selectedMonsterIndex = null;
        if (activeCharacter) activeCharacter.targetIndex = null;
        currentTargetMonster = null;
        persistCharacter(activeCharacter);
        if (aggro.length) {
            const app = root.parentElement || root;
            renderCombatScreen(app, aggro);
            return true;
        }
    } else {
        nearbyMonsters = activeCharacter.monsters;
        monsterCoordKey = key;
        currentTargetMonster = getSelectedMonster(nearbyMonsters);
        const aggro = nearbyMonsters.filter(m => m.aggro && !m.defeated);
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

function updateHPDisplay() {
    if (!activeCharacter) return;
    const hpBar = document.getElementById('hp-bar');
    const mpBar = document.getElementById('mp-bar');
    const tpBar = document.getElementById('tp-bar');
    const charHpBar = document.getElementById('char-hp-bar');
    const xpBar = document.getElementById('xp-bar');

    if (hpBar) {
        const maxHp = activeCharacter.raceHP + activeCharacter.jobHP + activeCharacter.sJobHP;
        const hpVal = activeCharacter.hp ?? maxHp;
        if (activeCharacter.hp == null) activeCharacter.hp = hpVal;
        const pct = maxHp > 0 ? Math.max(0, Math.min(100, Math.round((hpVal / maxHp) * 100))) : 0;
        hpBar.textContent = `HP ${hpVal}/${maxHp}`;
        hpBar.style.backgroundImage = `linear-gradient(to right, darkred ${pct}%, #333 ${pct}%)`;
    }

    if (mpBar) {
        const maxMp = activeCharacter.raceMP + activeCharacter.jobMP + activeCharacter.sJobMP;
        const mpVal = activeCharacter.mp ?? maxMp;
        if (activeCharacter.mp == null) activeCharacter.mp = mpVal;
        const pct = maxMp > 0 ? Math.max(0, Math.min(100, Math.round((mpVal / maxMp) * 100))) : 0;
        mpBar.textContent = `MP ${mpVal}/${maxMp}`;
        mpBar.style.backgroundImage = `linear-gradient(to right, lightblue ${pct}%, #333 ${pct}%)`;
    }

    if (tpBar) {
        const maxTp = 3000;
        const tpVal = activeCharacter.tp ?? 0;
        if (activeCharacter.tp == null) activeCharacter.tp = tpVal;
        const pct = Math.max(0, Math.min(100, Math.round((tpVal / maxTp) * 100)));
        tpBar.textContent = `TP ${tpVal}/${maxTp}`;
        tpBar.style.backgroundImage = `linear-gradient(to right, yellowgreen ${pct}%, #333 ${pct}%)`;
    }

    if (charHpBar) {
        const maxHp = activeCharacter.raceHP + activeCharacter.jobHP + activeCharacter.sJobHP;
        const hpVal = activeCharacter.hp ?? maxHp;
        const pct = maxHp > 0 ? Math.max(0, Math.min(100, Math.round((hpVal / maxHp) * 100))) : 0;
        charHpBar.style.backgroundImage = `linear-gradient(to right, green ${pct}%, #333 ${pct}%)`;
    }

    if (xpBar && activeCharacter.xpMode === 'EXP') {
        const current = activeCharacter.jobExp?.[activeCharacter.job] || 0;
        const prev = expToLevel[activeCharacter.level] || 0;
        const next = expToLevel[activeCharacter.level + 1] || prev;
        const pct = next > prev ? Math.max(0, Math.min(100, Math.round(((current - prev) / (next - prev)) * 100))) : 0;
        xpBar.textContent = `XP: ${current}/${next}`;
        xpBar.style.backgroundImage = `linear-gradient(to right, orange ${pct}%, #333 ${pct}%)`;
    }
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
    const prevIndex = selectedMonsterIndex;
    container.innerHTML = '';
    navColumnElement = null;
    monsterListElement = null;
    const main = renderMainMenu();
    container.appendChild(main);
    updateHPDisplay();
    if (activeCharacter?.currentLocation) {
        updateNearbyMonsters(activeCharacter.currentLocation, main);
        setTargetIndex(prevIndex);
        updateMonsterDisplay();
    }
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
    if (item.jobs && !(item.jobs.includes(activeCharacter.job) || item.jobs.includes(activeCharacter.subJob))) return false;
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
    const subLvl = activeCharacter.subJob ? activeCharacter.jobs[activeCharacter.subJob] || 1 : 0;
    const jobText = activeCharacter.subJob ? `${activeCharacter.job}/${activeCharacter.subJob} ${activeCharacter.level}/${subLvl}` : `${activeCharacter.job}`;
    line1.textContent = `${activeCharacter.name} - Lv.${activeCharacter.level} ${activeCharacter.sex} ${activeCharacter.race} ${jobText}`;
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
    if (activeCharacter && activeCharacter.targetIndex !== undefined) {
        selectedMonsterIndex = activeCharacter.targetIndex;
    }
    const container = document.createElement('div');
    container.id = 'main-screen';

    const menu = document.createElement('div');
    menu.id = 'menu';

    const loc = activeCharacter && locations.find(l => l.name === activeCharacter.currentLocation);
    const areaBtn = document.createElement(loc && loc.distance <= 0 ? 'div' : 'button');
    areaBtn.className = 'area-header';
    if (loc && loc.distance <= 0) areaBtn.classList.add('main-area-header');
    areaBtn.textContent = loc?.displayName || activeCharacter?.currentLocation || 'Area';
    const areaDiv = document.createElement('div');
    if (loc && loc.distance > 0) {
        areaDiv.classList.add('hidden');
        areaBtn.addEventListener('click', () => areaDiv.classList.toggle('hidden'));
    }

    let navSection = null;
    if (loc) {
        if (loc.distance > 0) {
            const actions = createActionPanel(container, loc);
            if (actions) {
                navSection = actions.navSection;
            }
        } else {
            const grid = createCityAreaGrid(container, loc);
            menu.appendChild(areaBtn);
            menu.appendChild(grid);
        }
    }

    const layout = document.createElement('div');
    layout.className = 'main-layout';

    const combatCol = document.createElement('div');
    combatCol.id = 'combat-column';
    layout.appendChild(combatCol);

    if (activeCharacter) {
        const profile = document.createElement('div');
        profile.id = 'active-profile';

        const imgNav = createImageContainer();
        imgNav.setImages(characterImages[activeCharacter.race]?.[activeCharacter.sex]?.[activeCharacter.job]);

    const line2 = document.createElement('div');
        line2.className = 'job-line';

        const subJob = activeCharacter.subJob;
        const subLvl = subJob ? activeCharacter.jobs[subJob] || 1 : 0;
        const mainAbbr = jobs.find(j => j.name === activeCharacter.job)?.abbr || activeCharacter.job.slice(0,3).toUpperCase();
        let jobText = `${mainAbbr} Lv.${activeCharacter.level}`;
        if (subJob) {
            const subAbbr = jobs.find(j => j.name === subJob)?.abbr || subJob.slice(0,3).toUpperCase();
            jobText = `${mainAbbr}/${subAbbr} ${activeCharacter.level}/${subLvl}`;
        }
        const jobIcon = document.createElement('img');
        jobIcon.className = 'job-icon';
        jobIcon.src = `img/Icons/Job icons/${mainAbbr.toLowerCase()}.png`;
        jobIcon.alt = mainAbbr;
        line2.appendChild(jobIcon);
        const jobTextSpan = document.createElement('span');
        jobTextSpan.textContent = jobText;
        line2.appendChild(jobTextSpan);

        const hpLine = document.createElement('div');
        hpLine.id = 'hp-bar';
        hpLine.className = 'stat-bar hp';

        const mpLine = document.createElement('div');
        mpLine.id = 'mp-bar';
        mpLine.className = 'stat-bar mp';

        const tpLine = document.createElement('div');
        tpLine.id = 'tp-bar';
        tpLine.className = 'stat-bar tp';

        const statsWrap = document.createElement('div');
        const atkLine = document.createElement('div');
        atkLine.textContent = `ATK: ${getAttack(activeCharacter)}`;
        const defLine = document.createElement('div');
        defLine.textContent = `DEF: ${getDefense(activeCharacter)}`;
        statsWrap.appendChild(atkLine);
        statsWrap.appendChild(defLine);
        const { str = 0, dex = 0, vit = 0, agi = 0, int = 0, mnd = 0, chr = 0 } = activeCharacter.stats || {};
        [
            ['STR', str],
            ['DEX', dex],
            ['VIT', vit],
            ['AGI', agi],
            ['INT', int],
            ['MND', mnd],
            ['CHR', chr]
        ].forEach(([label, val]) => {
            const line = document.createElement('div');
            line.textContent = `${label} ${Math.round(val)}`;
            statsWrap.appendChild(line);
        });

        const xpLine = document.createElement('div');
        xpLine.id = 'xp-bar';
        xpLine.className = 'stat-bar xp';
        let progressText;
        if (activeCharacter.level >= 99 && activeCharacter.xpMode === 'CP') {
            const needed = 30000 - ((activeCharacter.capacityPoints || 0) % 30000);
            progressText = `CP to Next JP: ${needed}`;
        } else if (activeCharacter.level >= 75 && activeCharacter.xpMode === 'LP') {
            const needed = 10000 - ((activeCharacter.limitPoints || 0) % 10000);
            progressText = `LP to Next Merit: ${needed}`;
        } else {
            const current = activeCharacter.jobExp?.[activeCharacter.job] || 0;
            const prev = expToLevel[activeCharacter.level] || 0;
            const next = expToLevel[activeCharacter.level + 1];
            const pct = next && next > prev
                ? Math.max(0, Math.min(100, Math.round(((current - prev) / (next - prev)) * 100)))
                : 0;
            progressText = `XP: ${current}/${next}`;
            xpLine.style.backgroundImage = `linear-gradient(to right, orange ${pct}%, #333 ${pct}%)`;
        }
        xpLine.textContent = progressText;

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
        charBtn.id = 'char-hp-bar';
        charBtn.textContent = 'Profile';
        charBtn.style.fontSize = '18px';
        group.appendChild(charBtn);
        group.appendChild(line2);
        group.appendChild(xpLine);
        group.appendChild(hpLine);
        group.appendChild(mpLine);
        group.appendChild(tpLine);

        const details = document.createElement('div');
        details.id = 'character-details';
        details.classList.add('hidden');

        const nameLine = document.createElement('div');
        nameLine.className = 'profile-name-line';
        nameLine.textContent = `${activeCharacter.name} - ${activeCharacter.job} Lv.${activeCharacter.level}`;
        details.appendChild(nameLine);
        const infoRow = document.createElement('div');
        infoRow.className = 'profile-info';
        infoRow.appendChild(imgNav.wrapper);
        statsWrap.classList.add('profile-stats');
        infoRow.appendChild(statsWrap);
        details.appendChild(infoRow);

        let holdTimer;
        const startHold = () => {
            holdTimer = setTimeout(() => showProfilePopup(details), 500);
        };
        const cancelHold = () => clearTimeout(holdTimer);
        charBtn.addEventListener('mousedown', startHold);
        charBtn.addEventListener('touchstart', startHold);
        ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev =>
            charBtn.addEventListener(ev, cancelHold));

        const invBtn = document.createElement('button');
        invBtn.className = 'profile-btn';
        invBtn.textContent = 'Inventory';
        invBtn.addEventListener('click', () => {
            renderInventoryScreen(container);
        });

        const equipBtn = document.createElement('button');
        equipBtn.className = 'profile-btn';
        equipBtn.textContent = 'Equipment';
        equipBtn.addEventListener('click', () => {
            renderEquipmentScreen(container);
        });

        const jobBtn = document.createElement('button');
        jobBtn.className = 'profile-btn';
        jobBtn.textContent = 'Change Job';
        jobBtn.addEventListener('click', () => {
            renderJobChangeScreen(container);
        });

        const storageBtn = document.createElement('button');
        storageBtn.className = 'profile-btn';
        storageBtn.textContent = 'Storage';
        storageBtn.addEventListener('click', () => {
            showStoragePopup();
        });

        const wardrobeBtn = document.createElement('button');
        wardrobeBtn.className = 'profile-btn';
        wardrobeBtn.textContent = 'Wardrobe';
        wardrobeBtn.addEventListener('click', () => {
            showWardrobePopup();
        });

        details.appendChild(invBtn);
        details.appendChild(equipBtn);
        if (modeBtn) details.appendChild(modeBtn);
        if (/Residential Area/i.test(activeCharacter.currentLocation)) {
            group.appendChild(jobBtn);
            group.appendChild(wardrobeBtn);
            group.appendChild(storageBtn);
        }
        group.appendChild(details);
        profile.appendChild(group);
        if (navColumnElement) {
            navColumnElement.insertBefore(profile, navColumnElement.firstChild);
        } else {
            layout.appendChild(profile);
        }

        // Previously the main menu displayed several buttons that allowed the
        // player to inspect traits, abilities, skills and other details. Those
        // buttons have been removed to simplify the profile view. The character
        // information now only shows the basic profile lines above.
    }
    if (navSection) layout.insertBefore(navSection, combatCol);
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

    const seenAreas = new Set();
    const seenCoords = new Set();
    loc.connectedAreas.forEach(area => {
        if (seenAreas.has(area)) return;
        const destCoordStr = loc.coordinates?.[area];
        if (destCoordStr && seenCoords.has(destCoordStr)) return;
        seenAreas.add(area);
        if (destCoordStr) seenCoords.add(destCoordStr);
        if (loc.name.startsWith('South Gustaberg') && area.startsWith('Vomp Hill')) return;
        if (loc.name.startsWith('Vomp Hill') && (area.startsWith('South Gustaberg') || area.startsWith('Vomp Hill'))) return;
        const li = document.createElement('li');
        const btn = document.createElement('button');
        let total = getZoneTravelTurns(area, loc.name);
        if (activeCharacter.coordinates && destCoordStr) {
            total = coordinateDistance(activeCharacter.coordinates, parseCoordinate(destCoordStr));
        }
        const travel = activeCharacter.travel &&
            activeCharacter.travel.start === loc.name &&
            activeCharacter.travel.destination === area
            ? activeCharacter.travel.remaining
            : total;
        const destLoc = locations.find(l => l.name === area);
        let display = destLoc?.displayName || area;
        if (!destLoc?.displayName) {
            display = display.replace(/^North\s/, 'N. ').replace(/^South\s/, 'S. ');
        }
        if (total > 1) {
            btn.textContent = `${display} (${travel}/${total})`;
        } else {
            btn.textContent = display;
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

    // zone-specific travel handled via map entries

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

function createCityAreaGrid(root, loc) {
    const wrapper = document.createElement('div');
    wrapper.id = 'city-area-grid';
    wrapper.className = 'city-area-grid';

    const navCol = document.createElement('div');
    navCol.className = 'city-nav-column';
    const listCol = document.createElement('div');
    listCol.className = 'city-list-column';
    wrapper.appendChild(navCol);
    wrapper.appendChild(listCol);

    const sections = [];
    const saved = activeCharacter?.citySections?.[loc.name] || 'Zone';
    function makeSection(title, expanded = false) {
        const btn = document.createElement('button');
        btn.className = 'area-header city-subheader';
        btn.textContent = title;
        if (expanded) btn.classList.add('expanded');
        navCol.appendChild(btn);
        const list = document.createElement('ul');
        list.className = 'city-area-list';
        if (!expanded) list.classList.add('hidden');
        sections.push({ btn, list });
        return list;
    }

    const travelList = makeSection('Zone', saved === 'Zone');
    const travelKeywords = /(airship|ferry|chocobo|rental|home point|dock|boat|stable|crystal)/i;
    const travelPOIs = loc.pointsOfInterest.filter(p => travelKeywords.test(p));

    const craftingKeywords = /guild/i;
    const craftingPOIs = loc.pointsOfInterest.filter(p => craftingKeywords.test(p) && !travelPOIs.includes(p));

    const seenAreasCity = new Set();
    const seenCoordsCity = new Set();
    loc.connectedAreas.forEach(area => {
        if (seenAreasCity.has(area)) return;
        const destCoordStr = loc.coordinates?.[area];
        if (destCoordStr && seenCoordsCity.has(destCoordStr)) return;
        seenAreasCity.add(area);
        if (destCoordStr) seenCoordsCity.add(destCoordStr);
        if (loc.name.startsWith('South Gustaberg') && area.startsWith('Vomp Hill')) return;
        if (loc.name.startsWith('Vomp Hill') && (area.startsWith('South Gustaberg') || area.startsWith('Vomp Hill'))) return;
        const li = document.createElement('li');
        const btn = document.createElement('button');
        let total = getZoneTravelTurns(area, loc.name);
        if (activeCharacter.coordinates && destCoordStr) {
            total = coordinateDistance(activeCharacter.coordinates, parseCoordinate(destCoordStr));
        }
        const travel = activeCharacter.travel &&
            activeCharacter.travel.start === loc.name &&
            activeCharacter.travel.destination === area
            ? activeCharacter.travel.remaining
            : total;
        const destLoc = locations.find(l => l.name === area);
        let display = destLoc?.displayName || area;
        if (!destLoc?.displayName) {
            display = display.replace(/^North\s/, 'N. ').replace(/^South\s/, 'S. ');
        }
        if (total > 1) {
            btn.textContent = `${display} (${travel}/${total})`;
        } else {
            btn.textContent = display;
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
    const craftList = craftPOIs.length ? makeSection('Crafting', saved === 'Crafting') : null;
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
        marketList = makeSection('Marketplace', saved === 'Marketplace');
        marketItems.forEach(li => marketList.appendChild(li));
    }

    const otherList = makeSection('Other', saved === 'Other');

    loc.pointsOfInterest.forEach(p => {
        if (travelPOIs.includes(p) || craftingPOIs.includes(p) || marketPOIs.includes(p)) return;
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

    const validSections = sections.filter(s => s.list.children.length > 0);
    sections.filter(s => !s.list.children.length).forEach(s => s.btn.remove());

    validSections.forEach(s => {
        s.btn.addEventListener('click', () => {
            validSections.forEach(o => {
                o.list.classList.add('hidden');
                o.btn.classList.remove('expanded');
            });
            listCol.innerHTML = '';
            listCol.appendChild(s.list);
            s.list.classList.remove('hidden');
            s.btn.classList.add('expanded');
            if (activeCharacter) {
                if (!activeCharacter.citySections) activeCharacter.citySections = {};
                activeCharacter.citySections[loc.name] = s.btn.textContent;
                persistCharacter(activeCharacter);
            }
        });
    });

    if (validSections.length) {
        const initial =
            validSections.find(o => o.btn.classList.contains('expanded')) || validSections[0];
        initial.btn.classList.add('expanded');
        initial.list.classList.remove('hidden');
        listCol.appendChild(initial.list);
    }
    return wrapper;
}

function nextCoord(coord, dx, dy) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const x = Math.min(Math.max(0, coord.letter.toUpperCase().charCodeAt(0) - 65 + dx), letters.length - 1);
    const y = Math.max(1, coord.number + dy);
    return { letter: letters[x], number: y };
}

function stepInDirection(coord, dx, dy) {
    const next = nextCoord(coord, dx, dy);
    if (!canMove(activeCharacter.currentLocation, coord, next)) return coord;
    activeCharacter.subArea = getSubArea(activeCharacter.currentLocation, next);
    return next;
}

function getCoordinatePOIs(loc, root) {
    const list = [];
    if (!activeCharacter?.coordinates) return list;
    const key = coordKey(activeCharacter.coordinates).toUpperCase();

    const zmap = zoneMaps[loc.name];
    if (zmap && zmap[key]) {
        const cell = zmap[key];
        if (Array.isArray(cell.entries)) {
            cell.entries.forEach(e => {
                const lbl = e.label || e.to;
                list.push({ label: lbl, action: () => {
                    setLocation(activeCharacter, e.to, loc.name);
                    persistCharacter(activeCharacter);
                    refreshMainMenu(root.parentElement);
                    const dest = locations.find(l => l.name === e.to);
                    const mapName = dest?.displayName || dest?.name;
                    if (mapName) showMap(mapName);
                }});
            });
        }
        if (cell.entryTo) {
            const lbl = cell.entryLabel || cell.entryTo;
            list.push({ label: lbl, action: () => {
                setLocation(activeCharacter, cell.entryTo, loc.name);
                persistCharacter(activeCharacter);
                refreshMainMenu(root.parentElement);
                const dest = locations.find(l => l.name === cell.entryTo);
                const mapName = dest?.displayName || dest?.name;
                if (mapName) showMap(mapName);
            }});
        }
        if (Array.isArray(cell.pois)) {
            cell.pois.forEach(p => list.push({ label: p, action: () => openMenu(p) }));
        }
    }

    if (loc.coordinates) {
        for (const [area, coord] of Object.entries(loc.coordinates)) {
            if (coord.toUpperCase() === key) {
                list.push({ label: area, action: () => {
                    setLocation(activeCharacter, area, loc.name);
                    persistCharacter(activeCharacter);
                    refreshMainMenu(root.parentElement);
                    const dest = locations.find(l => l.name === area);
                    const mapName = dest?.displayName || dest?.name;
                    if (mapName) showMap(mapName);
                }});
            }
        }
    }
    return list;
}

function createActionButtons(disabled = false) {
    const actionDiv = document.createElement('div');
    actionDiv.id = 'action-buttons';

    const attackBtn = document.createElement('button');
    attackBtn.textContent = 'Auto Attack';

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
    const castBtn = document.createElement('button');
    castBtn.textContent = 'Cast';
    const spells = activeCharacter.spells || [];
    spells.forEach(s => magicSelect.appendChild(new Option(s, s)));
    if (!spells.length) { magicBtn.disabled = true; castBtn.disabled = true; }

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
    magicWrap.className = 'action-cell with-select with-cast';
    magicWrap.appendChild(magicBtn);
    magicWrap.appendChild(magicSelect);
    magicWrap.appendChild(castBtn);

    const fleeWrap = document.createElement('div');
    fleeWrap.className = 'action-cell';
    fleeWrap.appendChild(fleeBtn);

    actionDiv.appendChild(attackWrap);
    actionDiv.appendChild(abilityWrap);
    actionDiv.appendChild(fleeWrap);
    actionDiv.appendChild(magicWrap);

    [attackBtn, abilityBtn, abilitySelect, magicBtn, magicSelect, castBtn, fleeBtn].forEach(el => {
        el.disabled = disabled || el.disabled;
    });

    return { actionDiv, attackBtn, abilityBtn, abilitySelect, magicBtn, magicSelect, castBtn, fleeBtn };
}

function createActionPanel(root, loc) {
    if (!loc || loc.distance <= 0) return null;

    const restBtn = document.createElement('button');
    restBtn.id = 'rest-button';
    restBtn.textContent = 'Rest';
    if (activeCharacter) {
        const maxHp = activeCharacter.raceHP + activeCharacter.jobHP + activeCharacter.sJobHP;
        const pct = activeCharacter.hp / maxHp;
        if (pct < 0.25) {
            restBtn.style.backgroundColor = 'orange';
            restBtn.style.color = 'black';
        } else if (pct < 0.5) {
            restBtn.style.backgroundColor = 'yellow';
            restBtn.style.color = 'black';
        }
    }
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
    let coordBtn;
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
            b.id = 'attack-button';
            coordBtn = b;
            if (activeCharacter.coordinates) {
                b.textContent = `${activeCharacter.coordinates.letter}-${activeCharacter.coordinates.number}`;
            }
            b.addEventListener('click', () => {
                if (activeCharacter?.currentLocation) {
                    const loc = locations.find(l => l.name === activeCharacter.currentLocation);
                    const mapName = loc?.displayName || loc?.name;
                    if (mapName) showMap(mapName);
                }
            });
        } else {
            b.textContent = d.l;
            if (activeCharacter?.coordinates) {
                const candidate = nextCoord(activeCharacter.coordinates, d.dx, d.dy);
                if (!canMove(loc.name, activeCharacter.coordinates, candidate)) {
                    b.disabled = true;
                }
            } else {
                b.disabled = true;
            }
            if (b.disabled) b.textContent = '';
            b.addEventListener('click', () => {
                if (!activeCharacter?.coordinates) return;
                activeCharacter.coordinates = stepInDirection(activeCharacter.coordinates, d.dx, d.dy);
                if (coordBtn) coordBtn.textContent = `${activeCharacter.coordinates.letter}-${activeCharacter.coordinates.number}`;
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

    const partyList = document.createElement('div');
    partyList.id = 'party-list';

    function renderParty() {
        partyList.innerHTML = '';
        partyMembers = [activeCharacter];
        partyMembers.forEach((p, i) => {
            const btn = document.createElement('button');
            btn.className = 'party-btn';
            const jobAbbr = jobs.find(j => j.name === p.job)?.abbr || p.job.slice(0,3).toUpperCase();
            const icon = document.createElement('img');
            icon.className = 'job-icon';
            icon.src = `img/Icons/Job icons/${jobAbbr.toLowerCase()}.png`;
            icon.alt = jobAbbr;
            const label = document.createElement('span');
            label.textContent = `${p.name} HP:${p.hp}`;
            btn.appendChild(icon);
            btn.appendChild(label);
            btn.addEventListener('click', () => {
                setPartyTarget(i);
                renderParty();
            });
            partyList.appendChild(btn);
        });
        partyListElement = partyList;
        updateTargetIndicator();
    }

    function renderMonsters() {
        const prevScroll = monsterList.scrollTop;
        monsterIndexList = [];
        monsterNameList = [];
        monsterHpList = [];
        if (activeCharacter) {
            if (activeCharacter.targetIndex !== null && activeCharacter.targetIndex >= nearbyMonsters.length) {
                activeCharacter.targetIndex = null;
            }
            if (selectedMonsterIndex === null || selectedMonsterIndex === undefined) {
                selectedMonsterIndex = activeCharacter.targetIndex;
            } else if (activeCharacter.targetIndex === null || activeCharacter.targetIndex === undefined) {
                activeCharacter.targetIndex = selectedMonsterIndex;
            } else {
                selectedMonsterIndex = activeCharacter.targetIndex;
            }
            currentTargetMonster = getSelectedMonster(nearbyMonsters);
        } else {
            selectedMonsterIndex = null;
            currentTargetMonster = null;
        }
        const hasAggro = nearbyMonsters.some(m => m.aggro && !m.defeated);
        restBtn.disabled = hasAggro;
        monsterList.innerHTML = '';
        nearbyMonsters.forEach((m, i) => {
            const idxVal = m.listIndex ?? i;
            const btn = document.createElement('button');
            btn.dataset.idx = idxVal;
            btn.textContent = m.name;
            btn.className = 'monster-btn';
            if (m.maxHp === undefined) m.maxHp = m.hp;
            const pct = m.maxHp > 0 ? Math.max(0, Math.min(100, (m.hp / m.maxHp) * 100)) : 0;
            const hpBar = document.createElement('div');
            hpBar.className = 'monster-hp-bar';
            hpBar.style.width = `${pct}%`;
            btn.appendChild(hpBar);
            if (m.defeated) btn.classList.add('defeated');
            if (m.aggro && !m.defeated) btn.classList.add('aggro');
            if (idxVal === selectedMonsterIndex) btn.classList.add('target');
            btn.addEventListener('click', () => {
                if (m.defeated) return;
                setTargetIndex(idxVal);
                currentTargetMonster = nearbyMonsters.find(n => (n.listIndex ?? nearbyMonsters.indexOf(n)) === idxVal) || m;
                if (activeCharacter) persistCharacter(activeCharacter);
                if (typeof monsterSelectHandler === 'function') {
                    monsterSelectHandler(idxVal);
                }
                renderMonsters();
            });
            btn.disabled = m.defeated;
            monsterList.appendChild(btn);
            monsterIndexList.push(idxVal);
            monsterNameList.push(m.name);
            monsterHpList.push(m.hp);
        });
        if (activeCharacter && activeCharacter.targetIndex !== null) {
            const focusBtn = monsterList.children[activeCharacter.targetIndex];
            if (focusBtn) focusBtn.focus();
        }
        updateTargetIndicator();
        monsterList.scrollTop = prevScroll;
        renderParty();
    }

    renderMonsters();
    monsterListElement = monsterList;
    updateMonsterDisplay = renderMonsters;

    const navSection = document.createElement('div');
    navSection.className = 'nav-section';
    const navRow = document.createElement('div');
    navRow.className = 'nav-row';
    const navCol = document.createElement('div');
    navCol.className = 'nav-column';
    navCol.appendChild(restBtn);
    navColumnElement = navCol;
    navCol.appendChild(dirGrid);

    const mobCol = document.createElement('div');
    mobCol.className = 'mob-column';
    mobCol.appendChild(monsterList);
    mobCol.appendChild(partyList);

    navRow.appendChild(navCol);
    navRow.appendChild(mobCol);
    navSection.appendChild(navRow);

    const actionColumn = document.createElement('div');
    actionColumn.className = 'action-column';
    const { actionDiv, attackBtn } = createActionButtons(true);
    attackBtn.disabled = false;
    attackBtn.addEventListener('click', () => {
        let idx = selectedMonsterIndex;
        if (idx === null && activeCharacter) idx = activeCharacter.targetIndex;
        if (idx === null || !nearbyMonsters[idx] || nearbyMonsters[idx].defeated) return;
        const target = nearbyMonsters[idx];
        target.aggro = true;
        target.listIndex = idx;
        if (activeCharacter) {
            activeCharacter.targetIndex = idx;
            persistCharacter(activeCharacter);
        }
        updateMonsterDisplay();
        const zone = loc.name;
        const sub = getSubArea(zone, activeCharacter.coordinates);
        const group = huntEncounter(zone, target.name, sub);
        if (group.length) {
            group[0] = target;
        } else {
            group.push(target);
        }
        // Assign listIndex for additional group members so targeting works
        group.forEach(m => {
            if (m.listIndex === undefined) {
                m.listIndex = nearbyMonsters.length;
                m.hp = m.hp || parseLevel(m.level) * 20;
                nearbyMonsters.push(m);
                if (activeCharacter) activeCharacter.monsters.push(m);
            }
        });
        renderCombatScreen(root.parentElement, group);
    });
    actionColumn.appendChild(actionDiv);
    const poiList = document.createElement('div');
    poiList.id = 'poi-list';
    const pois = getCoordinatePOIs(loc, root);
    pois.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'poi-btn';
        btn.textContent = p.label;
        btn.addEventListener('click', p.action);
        poiList.appendChild(btn);
    });
    actionColumn.appendChild(poiList);
    navCol.appendChild(actionColumn);

    return { navSection };
}


function renderCombatScreen(app, mobs, destination) {
    if (!activeCharacter) return;
    if (!Array.isArray(mobs)) {
        mobs = [mobs];
    } else {
        mobs = [...mobs];
    }
    document.body.classList.add('combat-active');
    const container = app.querySelector('#combat-column');
    if (!container) return;
    container.innerHTML = '';
    container.appendChild(statusEffectsDisplay());

    const navColumn = app.querySelector('.nav-column');
    const actionColumn = document.createElement('div');
    actionColumn.className = 'action-column';
    if (navColumn) {
        const existing = navColumn.querySelectorAll('.action-column');
        existing.forEach(el => el.remove());
        navColumn.appendChild(actionColumn);
    } else {
        container.appendChild(actionColumn);
    }

    const { actionDiv, attackBtn, abilityBtn, abilitySelect, magicBtn, magicSelect, castBtn, fleeBtn } = createActionButtons(false);
    actionColumn.appendChild(actionDiv);
    const spells = activeCharacter.spells || [];

    mobs.forEach(m => {
        m.currentHP = (m.hp || parseLevel(m.level) * 20);
    });
    if (selectedMonsterIndex === null && activeCharacter && activeCharacter.targetIndex !== null) {
        selectedMonsterIndex = activeCharacter.targetIndex;
    }
    currentTargetMonster = getSelectedMonster(mobs);
    if (!currentTargetMonster) selectedMonsterIndex = null;
    if (activeCharacter) activeCharacter.targetIndex = selectedMonsterIndex;
    monsterSelectHandler = idx => {
        let mob = mobs.find(m => m.listIndex === idx);
        if (!mob) mob = nearbyMonsters[idx];
        if (mob) {
            selectedMonsterIndex = mob.listIndex ?? idx;
            currentTargetMonster = mob;
            if (activeCharacter) {
                activeCharacter.targetIndex = selectedMonsterIndex;
                persistCharacter(activeCharacter);
            }
            if (autoAttacking) schedulePlayerAttack();
        }
    };
    
    let battleEnded = false;
    const defeated = [];
    let autoAttacking = false;
    let playerTimer = null;
    const monsterTimers = new Map();

    function weaponDelayMs() {
        const weaponDelay = items[activeCharacter.equipment?.mainHand]?.delay || 240;
        return weaponDelay * 1000 / 60;
    }

    function monsterDelayMs(mob) {
        const mobDelay = mob.delay || 240;
        return mobDelay * 1000 / 60;
    }

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
        showGameLogTemporarily(2000);
    }

    function addItemsToInventory(list) {
        list.forEach(({ id, qty }) => {
            addItem(activeCharacter.inventory, id, qty);
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
        const current = activeCharacter.jobExp?.[activeCharacter.job] || 0;
        while (activeCharacter.level < 99 &&
            current >= expToLevel[activeCharacter.level + 1]) {
            activeCharacter.level++;
            activeCharacter.jobs[activeCharacter.job] = activeCharacter.level;
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
        monsterSelectHandler = null;
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
                const job = activeCharacter.job;
                if (!activeCharacter.jobExp) activeCharacter.jobExp = {};
                activeCharacter.jobExp[job] = (activeCharacter.jobExp[job] || 0) + exp;
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
        if (activeCharacter) {
            activeCharacter.targetIndex = null;
        }
        currentTargetMonster = null;
        if (destination && activeCharacter.hp > 0) {
            setLocation(activeCharacter, destination);
        }
        persistCharacter(activeCharacter);
        updateMonsterDisplay();
        refreshMainMenu(app);
    }

    function update() {
        updateMonsterDisplay();
        updateHPDisplay();
    }

    function monsterDefeated(idx) {
        const mob = mobs[idx];
        defeated.push(mob);
        mobs.splice(idx, 1);
        let listIdx = mob.listIndex;
        if (listIdx === undefined) listIdx = nearbyMonsters.indexOf(mob);
        if (listIdx !== -1) {
            nearbyMonsters[listIdx].defeated = true;
            nearbyMonsters[listIdx].aggro = false;
            nearbyMonsters[listIdx].hp = 0;
        }
        mob.aggro = false;
        const t = monsterTimers.get(mob);
        if (t) {
            clearTimeout(t);
            monsterTimers.delete(mob);
        }
        updateMonsterDisplay();
        if (mobs.length === 0) {
            const rewards = calculateBattleRewards(activeCharacter, defeated);
            victory(rewards.exp, rewards.gil, rewards.cp, rewards.drops, rewards.messages);
        } else {
            if (selectedMonsterIndex === listIdx) {
                selectedMonsterIndex = null;
                if (activeCharacter) activeCharacter.targetIndex = null;
                currentTargetMonster = null;
            } else {
                currentTargetMonster = getSelectedMonster(mobs);
                if (activeCharacter) activeCharacter.targetIndex = selectedMonsterIndex;
            }
            if (activeCharacter) persistCharacter(activeCharacter);
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

    function tpFromDelay(delay) {
        if (delay <= 180) return Math.floor(61 + (delay - 180) * 63 / 360);
        if (delay <= 540) return Math.floor(61 + (delay - 180) * 88 / 360);
        if (delay <= 630) return Math.floor(149 + (delay - 540) * 20 / 360);
        if (delay <= 720) return Math.floor(154 + (delay - 630) * 28 / 360);
        if (delay <= 900) return Math.floor(161 + (delay - 720) * 24 / 360);
        return Math.floor(173 + (delay - 900) * 28 / 360);
    }

    function gainTP(character, base) {
        if (!character) return;
        const store = character.storeTp || 0;
        const total = Math.floor(base) + Math.floor(base * store / 100);
        character.tp = Math.min(3000, Math.max(0, (character.tp || 0) + Math.floor(total)));
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
                const mobDelay = attacker.delay || 240;
                gainTP(activeCharacter, tpFromDelay(mobDelay) / 3);
                if (activeCharacter.hp <= 0) {
                    stopAutoAttack();
                    endBattle();
                    return;
                }
            } else {
                defender.currentHP = Math.max(0, defender.currentHP - dmg);
                defender.hp = defender.currentHP;
                if (defender.listIndex !== undefined && nearbyMonsters[defender.listIndex]) {
                    nearbyMonsters[defender.listIndex].hp = defender.currentHP;
                }
            }
            if (attacker === activeCharacter) {
                const weaponDelay = items[activeCharacter.equipment?.mainHand]?.delay || 240;
                gainTP(activeCharacter, tpFromDelay(weaponDelay));
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
        if (attacker === activeCharacter && defender !== activeCharacter) {
            defender.aggro = true;
            if (!monsterTimers.has(defender)) scheduleMonsterAttack(defender);
        }
        update();
    }

    function schedulePlayerAttack(extra = 0) {
        if (!autoAttacking || battleEnded) return;
        clearTimeout(playerTimer);
        playerTimer = setTimeout(() => {
            const target = getSelectedMonster(mobs);
            if (!target) {
                return;
            }
            attack(activeCharacter, target);
            if (!battleEnded) schedulePlayerAttack();
        }, weaponDelayMs() + extra);
    }

    function scheduleMonsterAttack(mob, extra = 0) {
        if (battleEnded || mob.currentHP <= 0) return;
        clearTimeout(monsterTimers.get(mob));
        const t = setTimeout(() => {
            if (mob.currentHP > 0 && activeCharacter.hp > 0) {
                attack(mob, activeCharacter);
                if (!battleEnded && (autoAttacking || mob.aggro)) {
                    scheduleMonsterAttack(mob);
                }
            }
        }, monsterDelayMs(mob) + extra);
        monsterTimers.set(mob, t);
    }

    function stopAutoAttack() {
        autoAttacking = false;
        attackBtn.classList.remove('auto-on');
        clearTimeout(playerTimer);
        monsterTimers.forEach((t, mob) => {
            if (!mob.aggro) {
                clearTimeout(t);
                monsterTimers.delete(mob);
            }
        });
    }

    function endBattle(clearList = true) {
        if (activeCharacter.hp <= 0) {
            setLocation(activeCharacter, activeCharacter.spawnPoint || activeCharacter.homeCity);
            clearTemporaryEffects(activeCharacter);
            updateDerivedStats(activeCharacter);
            log('You were defeated and return to your home point.');
        }
        battleEnded = true;
        monsterSelectHandler = null;
        selectedMonsterIndex = null;
        if (activeCharacter) activeCharacter.targetIndex = null;
        autoAttacking = false;
        attackBtn.classList.remove('auto-on');
        clearTimeout(playerTimer);
        monsterTimers.forEach(t => clearTimeout(t));
        monsterTimers.clear();
        if (clearList) {
            nearbyMonsters = [];
            monsterIndexList = [];
            monsterNameList = [];
            monsterHpList = [];
            monsterCoordKey = '';
            if (activeCharacter) {
                activeCharacter.monsters = [];
                activeCharacter.monsterCoord = '';
            }
        }
        currentTargetMonster = null;
        if (destination && activeCharacter.hp > 0) {
            setLocation(activeCharacter, destination);
        }
        persistCharacter(activeCharacter);
        refreshMainMenu(app);
    }

    function setActionsEnabled(enabled) {
        attackBtn.disabled = false;
        abilityBtn.disabled = !enabled;
        abilitySelect.disabled = !enabled;
        magicBtn.disabled = !enabled || !spells.length;
        magicSelect.disabled = !enabled || !spells.length;
        castBtn.disabled = !enabled || !spells.length;
        fleeBtn.disabled = !enabled;
    }

    function attemptFlee() {
        const playerAgi = activeCharacter.stats.agi;
        for (let i = mobs.length - 1; i >= 0; i--) {
            const m = mobs[i];
            const mobAgi = m.agi !== undefined ? m.agi : (m.vit ?? parseLevel(m.level) * 2) + 1;
            let chance = 0.5 + (playerAgi - mobAgi) * 0.05;
            chance = Math.max(0.05, Math.min(0.95, chance));
            if (Math.random() < chance) {
                log(`${activeCharacter.name} fled from ${m.name}.`);
                if (m.listIndex !== undefined && nearbyMonsters[m.listIndex]) {
                    nearbyMonsters[m.listIndex].aggro = false;
                }
                const t = monsterTimers.get(m);
                if (t) {
                    clearTimeout(t);
                    monsterTimers.delete(m);
                }
                mobs.splice(i, 1);
                if (selectedMonsterIndex === m.listIndex) {
                    selectedMonsterIndex = null;
                    if (activeCharacter) activeCharacter.targetIndex = null;
                    currentTargetMonster = null;
                }
            } else {
                log(`${m.name} keeps chase.`);
            }
        }
        if (mobs.length === 0) {
            endBattle(false);
        } else {
            update();
        }
        return true;
    }

    attackBtn.addEventListener('click', () => {
        if (autoAttacking) {
            stopAutoAttack();
        } else {
            autoAttacking = true;
            attackBtn.classList.add('auto-on');
            const target = getSelectedMonster(mobs);
            if (target) {
                schedulePlayerAttack();
            }
        }
    });

    abilityBtn.addEventListener('click', () => {
        const target = getSelectedMonster(mobs);
        if (!target) {
            log('No target selected.');
            return;
        }
        const name = abilitySelect.value || 'Ability';
        log(`${activeCharacter.name} uses ${name}.`);
        clearTimeout(playerTimer);
        const jobData = jobs.find(j => j.name === activeCharacter.job) || {};
        const abilityData = (jobData.abilities || []).find(a => a.name === name);
        const castMs = abilityData?.castTime ? abilityData.castTime * 1000 : 0;
        const run = () => {
            attack(activeCharacter, target);
            if (autoAttacking) schedulePlayerAttack();
        };
        if (castMs > 0) setTimeout(run, castMs); else run();
    });

    castBtn.addEventListener('click', () => {
        const target = getSelectedMonster(mobs) || getSelectedPartyMember();
        if (!target) {
            log('No target selected.');
            return;
        }
        const spell = magicSelect.value || 'Spell';
        const tName = target.name || target;
        log(`${activeCharacter.name} casts ${spell} on ${tName}.`);
        clearTimeout(playerTimer);
        const spellData = spells.find(s => s.name === spell);
        const castMs = spellData?.castTime ? spellData.castTime * 1000 : 0;
        const run = () => { if (autoAttacking) schedulePlayerAttack(); };
        if (castMs > 0) setTimeout(run, castMs); else run();
    });

    fleeBtn.addEventListener('click', () => {
        stopAutoAttack();
        attemptFlee();
    });

    mobs.forEach(m => {
        if (m.aggro) scheduleMonsterAttack(m);
    });

    log(`A ${mobs.map(m=>m.name).join(', ')} appear!`);
    update();
    setActionsEnabled(true);
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
    addItem(activeCharacter.inventory, id, qty);
    persistCharacter(activeCharacter);
    alert(`Purchased ${qty} x ${item.name}.`);
}

function sellItem(id, qty = 1) {
    const entry = activeCharacter.inventory.find(i => i.id === id);
    if (!entry) return;
    if (itemProtected(id) || items[id].sellable === false) {
        alert('This item cannot be sold.');
        return;
    }
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
    const screen = document.createElement('div');
    screen.className = 'vendor-menu';
    const title = document.createElement('h2');
    title.textContent = shopName || vendor;
    screen.appendChild(title);
    const intro = document.createElement('p');
    if (shopName) intro.textContent = `You enter ${shopName} and approach ${vendor}.`;
    else intro.textContent = `You approach ${vendor}.`;
    screen.appendChild(intro);
    const greet = document.createElement('p');
    greet.textContent = vendorGreetings[vendor] || 'Welcome, traveler.';
    screen.appendChild(greet);
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
    screen.appendChild(buyBtn);
    screen.appendChild(sellBtn);
    root.appendChild(screen);
    const handler = backFn || (() => refreshMainMenu(root.parentElement));
    showBackButton(handler);
}

export function renderVendorScreen(root, vendor, backFn = null, mode = 'buy') {
    root.innerHTML = '';
    resetDetails();
    const title = document.createElement('h2');
    const displayName = vendor.includes(' the ') ? vendor.split(' the ')[0] : vendor;
    title.textContent = displayName;
    root.appendChild(title);
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

        const name = document.createElement('button');
        name.className = 'vendor-name vendor-name-btn';
        name.textContent = item.name;
        name.addEventListener('click', () => showItemPopup(item));
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
        const price = document.createElement('span');
        price.className = 'vendor-price';
        price.textContent = `${item.price} gil`;
        if (item.price > activeCharacter.gil) price.style.color = 'red';
        top.appendChild(name);
        top.appendChild(price);

        const actions = document.createElement('div');
        actions.className = 'vendor-actions';
        let qtyInput = null;
        if (item.stack > 1) {
            qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = '1';
            qtyInput.max = String(item.stack);
            qtyInput.value = '1';
            qtyInput.className = 'vendor-qty';
            actions.appendChild(qtyInput);
        }
        const buyBtn = document.createElement('button');
        buyBtn.textContent = 'Buy';
        buyBtn.addEventListener('click', () => {
            const q = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            buyItem(id, q);
            renderVendorScreen(root, vendor, backFn, 'buy');
        });
        actions.appendChild(buyBtn);
        top.appendChild(actions);
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
        if (equipped.has(entry.id) || itemProtected(entry.id) || items[entry.id].sellable === false) return;
        const item = items[entry.id];
        const row = document.createElement('div');
        row.className = 'vendor-item';
        const top = document.createElement('div');
        top.className = 'vendor-row-top';

        const name = document.createElement('button');
        name.className = 'vendor-name vendor-name-btn';
        const qtyText = item.stack > 1 && entry.qty > 1 ? ` x${entry.qty}` : '';
        name.textContent = item.name + qtyText;
        name.addEventListener('click', () => showItemPopup(item));
        const price = document.createElement('span');
        const sp = item.sellPrice || Math.floor(item.price / 2);
        price.className = 'vendor-price';
        price.textContent = `${sp} gil`;
        top.appendChild(name);
        top.appendChild(price);

        const actions = document.createElement('div');
        actions.className = 'vendor-actions';
        let qtyInput = null;
        if (item.stack > 1 && entry.qty > 1) {
            qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = '1';
            qtyInput.max = String(entry.qty);
            qtyInput.value = '1';
            qtyInput.className = 'vendor-qty';
            actions.appendChild(qtyInput);
        }
        const sellBtn = document.createElement('button');
        sellBtn.textContent = 'Sell';
        sellBtn.addEventListener('click', () => {
            const q = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
            sellItem(entry.id, q);
            renderVendorScreen(root, vendor, backFn, 'sell');
        });
        let sellGroup = document.createElement('div');
        sellGroup.className = 'sell-buttons';
        sellGroup.appendChild(sellBtn);
        if (entry.qty > 1) {
            const sellAllBtn = document.createElement('button');
            sellAllBtn.textContent = 'Sell all';
            sellAllBtn.addEventListener('click', () => {
                sellItem(entry.id, entry.qty);
                renderVendorScreen(root, vendor, backFn, 'sell');
            });
            sellGroup.appendChild(sellAllBtn);
        }
        actions.appendChild(sellGroup);
        top.appendChild(actions);
        row.appendChild(top);

        const detailsWrap = document.createElement('div');
        detailsWrap.className = 'item-details hidden';
        const desc = document.createElement('div');
        desc.className = 'item-description';
        desc.textContent = item.description || item.name;
        detailsWrap.appendChild(desc);
        row.appendChild(detailsWrap);
        sellList.appendChild(row);
        });
        root.appendChild(sellList);
    }
    showBackButton(backFn || (() => renderVendorMenu(root, vendor, backFn)));
}

export function renderConquestShop(root, backFn = null) {
    root.innerHTML = '';
    resetDetails();
    const title = document.createElement('h2');
    title.textContent = 'Conquest Rewards';
    root.appendChild(title);
    const list = document.createElement('div');
    list.className = 'vendor-list';
    Object.entries(conquestRewards).forEach(([id, cost]) => {
        const item = items[id];
        const row = document.createElement('div');
        row.className = 'vendor-item';
        const top = document.createElement('div');
        top.className = 'vendor-row-top';

        const name = document.createElement('button');
        name.className = 'vendor-name vendor-name-btn';
        name.textContent = item.name;
        name.addEventListener('click', () => showItemPopup(item));
        const price = document.createElement('span');
        price.className = 'vendor-price';
        price.textContent = `${cost} CP`;
        if (cost > (activeCharacter.conquestPoints || 0)) price.style.color = 'red';
        top.appendChild(name);
        top.appendChild(price);

        const actions = document.createElement('div');
        actions.className = 'vendor-actions';
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
        actions.appendChild(buyBtn);
        top.appendChild(actions);
        row.appendChild(top);
        const detailsWrap = document.createElement('div');
        detailsWrap.className = 'item-details hidden';
        const desc = document.createElement('div');
        desc.className = 'item-description';
        desc.textContent = item.description || item.name;
        detailsWrap.appendChild(desc);
        row.appendChild(detailsWrap);
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
    const wardBtn = document.createElement('button');
    wardBtn.textContent = 'Wardrobe';
    wardBtn.addEventListener('click', () => {
        showWardrobePopup();
    });
    root.appendChild(wardBtn);
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

            const info = document.createElement('div');
            info.className = 'equipment-info';
            const nameDiv = document.createElement('span');
            if (item) {
                nameDiv.textContent = `${slots[key]}: `;
                const nameBtn = document.createElement('button');
                nameBtn.className = 'item-name-btn';
                nameBtn.textContent = item.name;
                if (!meetsRequirements(item)) nameBtn.style.color = 'red';
                nameBtn.addEventListener('click', () => showItemPopup(item));
                nameDiv.appendChild(nameBtn);
            } else {
                nameDiv.textContent = `${slots[key]}: ${itemId || 'Empty'}`;
            }
            info.appendChild(nameDiv);
            top.appendChild(info);

            const actions = document.createElement('div');
            actions.className = 'equipment-actions';
            if (itemId) {
                const unequip = document.createElement('button');
                unequip.textContent = 'Unequip';
                unequip.addEventListener('click', () => {
                    activeCharacter.equipment[key] = null;
                    persistCharacter(activeCharacter);
                    renderEquipmentScreen(root);
                });
                actions.appendChild(unequip);
            }
            top.appendChild(actions);
            li.appendChild(top);
            const detailsWrap = document.createElement('div');
            detailsWrap.className = 'item-details hidden';
            const desc = document.createElement('div');
            desc.className = 'item-description';
            desc.textContent = item.description || item.name;
            detailsWrap.appendChild(desc);
            if (item.effects) {
                const eff = document.createElement('div');
                eff.className = 'item-effects';
                eff.textContent = 'Effects: ' + item.effects.join(', ');
                detailsWrap.appendChild(eff);
            }
            if (item.abilities) {
                const ab = document.createElement('div');
                ab.className = 'item-abilities';
                ab.textContent = 'Abilities: ' + item.abilities.join(', ');
                detailsWrap.appendChild(ab);
            }
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
            list.appendChild(li);
        }
        root.appendChild(list);
    }
    showBackButton(() => refreshMainMenu(root.parentElement));
}

function renderJobChangeScreen(root) {
    if (!activeCharacter) return;
    if (!/Residential Area/i.test(activeCharacter.currentLocation)) {
        alert('You must be inside a residential area to change jobs.');
        refreshMainMenu(root.parentElement);
        return;
    }
    root.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = 'Change Jobs';
    root.appendChild(title);

    const mainSelect = document.createElement('select');
    baseJobNames.forEach(j => {
        const opt = new Option(j, j);
        mainSelect.appendChild(opt);
    });
    mainSelect.value = activeCharacter.job;
    const mainLabel = document.createElement('label');
    mainLabel.textContent = 'Main Job:';
    mainLabel.appendChild(mainSelect);
    root.appendChild(mainLabel);
    const mainBtn = document.createElement('button');
    mainBtn.textContent = 'Set Main Job';
    mainBtn.addEventListener('click', () => {
        changeJob(activeCharacter, mainSelect.value);
        refreshMainMenu(root.parentElement);
    });
    root.appendChild(mainBtn);

    const subSelect = document.createElement('select');
    subSelect.appendChild(new Option('(None)', ''));
    baseJobNames.forEach(j => {
        const opt = new Option(j, j);
        subSelect.appendChild(opt);
    });
    subSelect.value = activeCharacter.subJob || '';
    if (!activeCharacter.subJobUnlocked) {
        subSelect.disabled = true;
    }
    const subLabel = document.createElement('label');
    subLabel.textContent = 'Sub Job:';
    subLabel.appendChild(subSelect);
    root.appendChild(subLabel);
    const subBtn = document.createElement('button');
    subBtn.textContent = 'Set Sub Job';
    subBtn.disabled = !activeCharacter.subJobUnlocked;
    subBtn.addEventListener('click', () => {
        changeSubJob(activeCharacter, subSelect.value || null);
        refreshMainMenu(root.parentElement);
    });
    root.appendChild(subBtn);
    if (!activeCharacter.subJobUnlocked) {
        const note = document.createElement('p');
        note.textContent = 'Subjob locked';
        root.appendChild(note);
    }
    showBackButton(() => refreshMainMenu(root.parentElement));
}

function getItemCategory(item) {
    if (item.damage !== undefined || item.delay !== undefined) return 'Weapons';
    if (item.slot === 'offHand' && item.defense !== undefined) return 'Weapons';
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
        if (item.keyItem) return;
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
            const nameBtn = document.createElement('button');
            nameBtn.className = 'item-name-btn';
            nameBtn.textContent = ent.item.name + qtyText + (statsInline ? ` (${statsInline})` : '');
            if (!meetsRequirements(ent.item)) nameBtn.style.color = 'red';
            else if (canEquipItem(ent.item) && isBetterItem(ent.item)) nameBtn.style.color = 'lightgreen';
            nameBtn.addEventListener('click', () => showItemPopup(ent.item));
            info.appendChild(nameBtn);
            row.appendChild(info);

            const actions = document.createElement('div');
            actions.className = 'item-actions';


            if (canEquipItem(ent.item)) {
                if (activeCharacter.equipment[ent.item.slot] !== ent.id) {
                    const eq = document.createElement('button');
                    eq.textContent = 'Equip';
                    eq.addEventListener('click', () => equipItem(ent.id, root));
                    actions.appendChild(eq);
                }
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
            const desc = document.createElement('div');
            desc.className = 'item-description';
            desc.textContent = ent.item.description || ent.item.name;
            detailsWrap.appendChild(desc);
            if (ent.item.effects) {
                const eff = document.createElement('div');
                eff.className = 'item-effects';
                eff.textContent = 'Effects: ' + ent.item.effects.join(', ');
                detailsWrap.appendChild(eff);
            }
            if (ent.item.abilities) {
                const ab = document.createElement('div');
                ab.className = 'item-abilities';
                ab.textContent = 'Abilities: ' + ent.item.abilities.join(', ');
                detailsWrap.appendChild(ab);
            }
            const stats = basicStatsText(ent.item);
            if (stats) {
                const s = document.createElement('div');
                s.className = 'item-stats';
                s.textContent = stats;
                detailsWrap.appendChild(s);
            }
            const req = requirementText(ent.item);
            if (req) {
                const r = document.createElement('div');
                r.className = 'item-req';
                r.textContent = req;
                detailsWrap.appendChild(r);
            }
            li.appendChild(detailsWrap);
            ul.appendChild(li);
        });
    });
    const keyBtn = document.createElement('button');
    keyBtn.textContent = 'Key Items';
    keyBtn.addEventListener('click', () => renderKeyItemsScreen(root));
    root.appendChild(keyBtn);
    showBackButton(() => refreshMainMenu(root.parentElement));
}

function renderKeyItemsScreen(root) {
    if (!activeCharacter) return;
    root.innerHTML = '';
    resetDetails();
    const categories = {};
    activeCharacter.inventory.forEach(entry => {
        const item = items[entry.id];
        if (!item.keyItem) return;
        const cat = /^Map of/i.test(item.name) ? 'Maps' : 'Key Items';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ item, qty: entry.qty });
    });
    Object.keys(categories).forEach(cat => {
        const header = document.createElement('h3');
        header.textContent = cat;
        root.appendChild(header);
        const ul = document.createElement('ul');
        ul.className = 'inventory-list';
        categories[cat].forEach(ent => {
            const li = document.createElement('li');
            li.className = 'inventory-item';
            li.textContent = ent.item.name;
            ul.appendChild(li);
        });
        root.appendChild(ul);
    });
    showBackButton(() => renderInventoryScreen(root));
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
        const screen = document.createElement('div');
        screen.className = 'shop-menu';
        const title = document.createElement('h2');
        title.textContent = name;
        screen.appendChild(title);
        const intro = document.createElement('p');
        if (name === "Deegis's Armour") {
            intro.textContent = `You step into Deegis\u2019 Armor, torchlight dancing on steel-clad walls.\nDeegis nods from behind a rack of padded gambesons as Zemedars polishes a sturdy targe beside him.\n\n\"Welcome, friend!\"`;
        } else if (name === "Brunhilde's Armory") {
            intro.textContent = "You step into Brunhilde's Armory, torchlight dancing off rows of gleaming plate mail, supple leather harnesses, padded gambesons and more. Brunhilde herself stands by displays of hefty breastplates and sallets, while Balthilda arranges lighter gauntlets and scale mail on nearby racks, Charging Chocobo arranging belts and leggings.\n\n\"Welcome adventurer, what are you looking for today?\"";
        } else if (name === "Dragon's Claw Weaponry") {
            intro.textContent = "You step into Dragon\u2019s Claw Weaponry, steel ringing softly as the door closes behind you.\n\"Welcome to our shop!\" Ciqala greets you from a rack of knuckles, clubs, and polished rods.\nPeritrage stands beside great-axes and hunting knives, while Zhikkom polishes swords and daggers with calm precision.";
        } else {
            intro.textContent = `You enter ${name}. Inside you see:`;
        }
        screen.appendChild(intro);
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.paddingLeft = '0';
        npcs.forEach(npc => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            const displayName = npc.includes(' the ') ? npc.split(' the ')[0] : npc;
            btn.textContent = displayName;
            btn.addEventListener('click', () => {
                renderVendorScreen(root, npc, () => openMenu(name, backFn), 'buy');
            });
            li.appendChild(btn);
            list.appendChild(li);
        });
        screen.appendChild(list);
        const sellBtn = document.createElement('button');
        sellBtn.textContent = 'Sell';
        sellBtn.addEventListener('click', () => {
            renderVendorScreen(root, npcs[0], () => openMenu(name, backFn), 'sell');
        });
        screen.appendChild(sellBtn);
        root.appendChild(screen);
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
