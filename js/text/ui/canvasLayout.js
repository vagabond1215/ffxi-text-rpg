export function createCanvasLayout({ width, height, actions = [], menuActions = [], topActions = [], modal = null, creatorActions = [], compassActions = [] }) {
    const safeWidth = Math.max(320, Number(width) || 320);
    const safeHeight = Math.max(360, Number(height) || 360);
    const margin = 14;
    const gap = 12;
    const topHeight = 54;
    const inputHeight = 58;
    const sidebarWidth = Math.max(204, Math.min(252, Math.floor(safeWidth * 0.22)));
    const hasContextPanel = safeWidth >= 920;
    const contextWidth = hasContextPanel ? Math.max(228, Math.min(288, Math.floor(safeWidth * 0.24))) : 0;
    const bodyTop = margin + topHeight + gap;
    const bodyBottom = safeHeight - margin - inputHeight - gap;
    const bodyHeight = Math.max(80, bodyBottom - bodyTop);
    const sidebar = rect(margin, bodyTop, sidebarWidth, bodyHeight);
    const context = hasContextPanel
        ? rect(safeWidth - margin - contextWidth, bodyTop, contextWidth, bodyHeight)
        : rect(0, 0, 0, 0);
    const mainX = sidebar.x + sidebar.w + gap;
    const mainRight = hasContextPanel ? context.x - gap : safeWidth - margin;
    const main = rect(mainX, bodyTop, Math.max(120, mainRight - mainX), bodyHeight);
    const input = rect(margin, safeHeight - margin - inputHeight, safeWidth - margin * 2, inputHeight);
    const splash = rect(margin, margin, safeWidth - margin * 2, safeHeight - margin * 2);
    const creatorName = rect(main.x + 18, main.y + 104, Math.min(420, main.w - 36), 38);
    const modalRect = createModalRect(safeWidth, safeHeight, margin, modal, menuActions.length);
    const minimap = createMinimapRect(sidebar);
    const compassButtons = layoutCompassButtons(sidebar, compassActions, minimap);
    const autoRunButton = layoutAutoRunButton(sidebar, compassActions, compassButtons, minimap);
    const actionHeadingY = autoRunButton ? autoRunButton.rect.y + autoRunButton.rect.h + 34 : minimap.y + minimap.h + 34;
    const actionStartY = actionHeadingY + 14;

    return {
        width: safeWidth,
        height: safeHeight,
        margin,
        gap,
        modal,
        actionHeadingY,
        panels: {
            top: rect(margin, margin, safeWidth - margin * 2, topHeight),
            sidebar,
            main,
            context,
            input,
            splash,
            modal: modalRect,
            creatorName,
            minimap,
        },
        actionButtons: layoutActionButtons(sidebar, actions, actionStartY),
        compassButtons,
        autoRunButton,
        creatorButtons: layoutCreatorButtons(sidebar, main, input, creatorActions),
        menuButtons: layoutMenuButtons(splash, menuActions),
        modalButtons: layoutModalButtons(modalRect, menuActions, modal),
        modalCloseButton: layoutModalCloseButton(modalRect),
        modalFields: layoutModalFields(modalRect, modal),
        topButtons: layoutTopButtons(rect(margin, margin, safeWidth - margin * 2, topHeight), topActions),
    };
}

export function hitTestAction(layout, x, y) {
    return [
        ...layout.topButtons,
        ...(layout.modal ? [layout.modalCloseButton] : []),
        ...(layout.modal ? layout.modalButtons : []),
        ...(!layout.modal ? layout.creatorButtons ?? [] : []),
        ...(!layout.modal ? layout.compassButtons ?? [] : []),
        ...(!layout.modal && layout.autoRunButton ? [layout.autoRunButton] : []),
        ...(!layout.modal ? layout.menuButtons : []),
        ...layout.actionButtons,
    ].filter(Boolean).find((button) => pointInRect(x, y, button.rect)) ?? null;
}

export function hitTestModalField(layout, x, y) {
    if (!layout.modal) return null;
    return (layout.modalFields ?? []).find((field) => pointInRect(x, y, field.rect)) ?? null;
}

export function hitTestRegion(layout, x, y) {
    for (const [id, area] of Object.entries(layout.panels)) {
        if (pointInRect(x, y, area)) return id;
    }
    return null;
}

export function pointInRect(x, y, area) {
    return x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h;
}

function createMinimapRect(sidebar) {
    const padding = 12;
    const height = Math.max(118, Math.min(148, Math.floor(sidebar.w * 0.62)));
    return rect(sidebar.x + padding, sidebar.y + 40, sidebar.w - padding * 2, height);
}

function layoutActionButtons(sidebar, actions, startY) {
    const padding = 14;
    const gap = 7;
    const categoryMode = actions.length > 0 && actions.every((item) => item.region === 'category');
    if (categoryMode) {
        const columns = 2;
        const buttonHeight = 32;
        const buttonWidth = Math.floor((sidebar.w - padding * 2 - gap) / columns);
        return actions.map((item, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);
            return {
                action: item,
                rect: rect(sidebar.x + padding + column * (buttonWidth + gap), startY + row * (buttonHeight + gap), buttonWidth, buttonHeight),
            };
        });
    }

    const buttonHeight = 32;
    return actions.map((item, index) => ({
        action: item,
        rect: rect(sidebar.x + padding, startY + index * (buttonHeight + gap), sidebar.w - padding * 2, buttonHeight),
    }));
}

function layoutCompassButtons(sidebar, actions, minimap) {
    const compassActions = actions.filter((item) => item.region === 'compass');
    if (!compassActions.length) return [];
    const byDirection = new Map(compassActions.map((item) => [item.payload?.direction ?? 'stop', item]));
    byDirection.set('stop', compassActions.find((item) => item.id === 'compassStop'));
    const order = [
        'northwest', 'north', 'northeast',
        'west', 'stop', 'east',
        'southwest', 'south', 'southeast',
    ];
    const gap = 5;
    const size = Math.max(24, Math.min(30, Math.floor(sidebar.w * 0.13)));
    const totalWidth = size * 3 + gap * 2;
    const startX = sidebar.x + Math.floor((sidebar.w - totalWidth) / 2);
    const startY = minimap.y + minimap.h + 12;
    return order.map((direction, index) => {
        const action = byDirection.get(direction);
        const column = index % 3;
        const row = Math.floor(index / 3);
        return action ? {
            action,
            rect: rect(startX + column * (size + gap), startY + row * (size + gap), size, size),
        } : null;
    }).filter(Boolean);
}

function layoutAutoRunButton(sidebar, actions, compassButtons, minimap) {
    const action = actions.find((item) => item.region === 'autoRun');
    if (!action) return null;
    const compassBottom = compassButtons.length
        ? Math.max(...compassButtons.map((button) => button.rect.y + button.rect.h))
        : minimap.y + minimap.h;
    const width = Math.min(132, sidebar.w - 28);
    return {
        action,
        rect: rect(sidebar.x + Math.floor((sidebar.w - width) / 2), compassBottom + 8, width, 26),
    };
}

function layoutCreatorButtons(sidebar, main, input, actions) {
    const stepActions = actions.filter((item) => item.region === 'steps');
    const choiceActions = actions.filter((item) => item.region === 'choices');
    const footerActions = actions.filter((item) => item.region === 'footer');
    const introActions = actions.filter((item) => item.region === 'intro');
    return [
        ...layoutCreatorStepButtons(sidebar, stepActions),
        ...layoutCreatorChoiceButtons(main, choiceActions),
        ...layoutCreatorFooterButtons(input, footerActions),
        ...layoutCreatorIntroButtons(main, introActions),
    ];
}

function layoutCreatorStepButtons(sidebar, actions) {
    const padding = 14;
    const buttonHeight = 32;
    const gap = 7;
    const startY = sidebar.y + padding + 42;
    return actions.map((item, index) => ({
        action: item,
        rect: rect(sidebar.x + padding, startY + index * (buttonHeight + gap), sidebar.w - padding * 2, buttonHeight),
    }));
}

function layoutCreatorChoiceButtons(main, actions) {
    if (!actions.length) return [];
    const columns = main.w >= 520 ? 2 : 1;
    const gap = 10;
    const buttonHeight = 92;
    const buttonWidth = Math.floor((main.w - 36 - gap * (columns - 1)) / columns);
    const startX = main.x + 18;
    const startY = main.y + 110;
    return actions.map((item, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        return {
            action: item,
            rect: rect(startX + column * (buttonWidth + gap), startY + row * (buttonHeight + gap), buttonWidth, buttonHeight),
        };
    });
}

function layoutCreatorFooterButtons(input, actions) {
    if (!actions.length) return [];
    const buttonHeight = 34;
    const gap = 10;
    const buttonWidth = Math.max(108, Math.min(154, Math.floor((input.w - 36 - gap * (actions.length - 1)) / actions.length)));
    const totalWidth = actions.length * buttonWidth + (actions.length - 1) * gap;
    const startX = input.x + input.w - totalWidth - 18;
    const y = input.y + Math.floor((input.h - buttonHeight) / 2);
    return actions.map((item, index) => ({ action: item, rect: rect(startX + index * (buttonWidth + gap), y, buttonWidth, buttonHeight) }));
}

function layoutCreatorIntroButtons(main, actions) {
    if (!actions.length) return [];
    const buttonWidth = Math.max(170, Math.min(240, Math.floor(main.w * 0.28)));
    const buttonHeight = 38;
    const gap = 12;
    const totalWidth = actions.length * buttonWidth + Math.max(0, actions.length - 1) * gap;
    const startX = main.x + Math.floor((main.w - totalWidth) / 2);
    const y = main.y + main.h - 66;
    return actions.map((item, index) => ({ action: item, rect: rect(startX + index * (buttonWidth + gap), y, buttonWidth, buttonHeight) }));
}

function layoutMenuButtons(splash, actions) {
    const buttonWidth = Math.max(220, Math.min(360, Math.floor(splash.w * 0.34)));
    const buttonHeight = 38;
    const gap = 10;
    const startX = splash.x + Math.floor((splash.w - buttonWidth) / 2);
    const startY = splash.y + 184;
    return actions.map((item, index) => ({
        action: item,
        rect: rect(startX, startY + index * (buttonHeight + gap), buttonWidth, buttonHeight),
    }));
}

function layoutModalButtons(modalRect, actions, modal) {
    const buttonWidth = Math.max(180, Math.min(300, modalRect.w - 48));
    const buttonHeight = 36;
    const gap = 9;
    const startX = modalRect.x + Math.floor((modalRect.w - buttonWidth) / 2);
    const startY = modalButtonStartY(modalRect, modal);
    return actions.map((item, index) => ({
        action: item,
        rect: rect(startX, startY + index * (buttonHeight + gap), buttonWidth, buttonHeight),
    }));
}

function layoutModalCloseButton(modalRect) {
    const size = 24;
    return {
        action: Object.freeze({
            id: 'modalClose',
            label: '×',
            command: 'modalClose',
            intent: 'ui.modal.close',
            payload: Object.freeze({}),
            kind: 'ui',
        }),
        rect: rect(modalRect.x + modalRect.w - size - 10, modalRect.y + 10, size, size),
    };
}

function layoutModalFields(modalRect, modal) {
    const fieldWidth = modalRect.w - 48;
    const fieldHeight = 36;
    const x = modalRect.x + 24;
    if (modal === 'createAccount') {
        return [
            { id: 'accountName', label: 'Account Name', rect: rect(x, modalRect.y + 40, fieldWidth, fieldHeight) },
            { id: 'password', label: 'Password', rect: rect(x, modalRect.y + 92, fieldWidth, fieldHeight) },
        ];
    }
    if (modal === 'loginPassword') {
        return [
            { id: 'password', label: 'Password', rect: rect(x, modalRect.y + 48, fieldWidth, fieldHeight) },
        ];
    }
    return [];
}

function layoutTopButtons(top, actions) {
    const buttonSize = 34;
    const gap = 8;
    return actions.map((item, index) => ({
        action: item,
        rect: rect(top.x + gap + index * (buttonSize + gap), top.y + Math.floor((top.h - buttonSize) / 2), buttonSize, buttonSize),
    }));
}

function createModalRect(width, height, margin, modal, actionCount = 0) {
    const maxWidth = Math.max(280, width - margin * 2);
    const modalWidth = Math.min(maxWidth, modal === 'settings' ? 360 : 340);
    const requiredHeight = modalHeight(modal, actionCount);
    const modalHeightValue = Math.min(Math.max(170, requiredHeight), Math.max(170, height - margin * 2));
    return rect(Math.floor((width - modalWidth) / 2), Math.floor((height - modalHeightValue) / 2), modalWidth, modalHeightValue);
}

function modalHeight(modal, actionCount) {
    if (modal === 'createAccount') return 188;
    if (modal === 'loginPassword') return 150;
    return 54 + Math.max(1, actionCount) * 45;
}

function modalButtonStartY(modalRect, modal) {
    if (modal === 'createAccount') return modalRect.y + 140;
    if (modal === 'loginPassword') return modalRect.y + 96;
    return modalRect.y + 44;
}

function rect(x, y, w, h) {
    return { x, y, w, h };
}
