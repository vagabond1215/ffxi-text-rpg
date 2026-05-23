export function createCanvasLayout({ width, height, actions = [] }) {
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

    return {
        width: safeWidth,
        height: safeHeight,
        margin,
        gap,
        panels: {
            top: rect(margin, margin, safeWidth - margin * 2, topHeight),
            sidebar,
            main,
            context,
            input,
        },
        actionButtons: layoutActionButtons(sidebar, actions),
    };
}

export function hitTestAction(layout, x, y) {
    return layout.actionButtons.find((button) => pointInRect(x, y, button.rect)) ?? null;
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

function layoutActionButtons(sidebar, actions) {
    const padding = 14;
    const buttonHeight = 34;
    const gap = 8;
    const startY = sidebar.y + padding + 34;
    return actions.map((item, index) => ({
        action: item,
        rect: rect(
            sidebar.x + padding,
            startY + index * (buttonHeight + gap),
            sidebar.w - padding * 2,
            buttonHeight,
        ),
    }));
}

function rect(x, y, w, h) {
    return { x, y, w, h };
}
