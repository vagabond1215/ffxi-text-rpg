import { CANVAS_THEME } from './uiTheme.js';

export function renderCanvasApp(ctx, { layout, state, uiState, theme = CANVAS_THEME }) {
    ctx.clearRect(0, 0, layout.width, layout.height);
    drawBackground(ctx, layout, theme);
    drawTopBar(ctx, layout.panels.top, state, theme);
    drawSidebar(ctx, layout, uiState, theme);
    drawMainOutput(ctx, layout.panels.main, uiState, theme);
    drawContext(ctx, layout.panels.context, state, uiState, theme);
    drawInput(ctx, layout.panels.input, uiState, theme);
}

function drawBackground(ctx, layout, theme) {
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, layout.width, layout.height);
}

function drawTopBar(ctx, rect, state, theme) {
    panel(ctx, rect, theme.panelSoft, theme.border);
    ctx.font = theme.fontLarge;
    ctx.fillStyle = theme.accentBright;
    ctx.fillText('FFXI Text RPG', rect.x + 16, rect.y + 32);
    ctx.font = theme.font;
    ctx.fillStyle = theme.muted;
    const player = state.player;
    const grid = state.position ? `${state.position.x}:${state.position.y}` : '?:?';
    const status = `${player.identity.name} | ${player.jobs.mainJobName} Lv.${player.jobs.level} | ${state.location} ${grid}`;
    fitText(ctx, status, rect.x + 190, rect.y + 32, rect.w - 210);
}

function drawSidebar(ctx, layout, uiState, theme) {
    const rect = layout.panels.sidebar;
    panel(ctx, rect, theme.panel, theme.border);
    ctx.font = theme.fontLarge;
    ctx.fillStyle = theme.accent;
    ctx.fillText('Actions', rect.x + 14, rect.y + 26);
    for (const button of layout.actionButtons) {
        drawButton(ctx, button, uiState, theme);
    }
}

function drawButton(ctx, button, uiState, theme) {
    const { action, rect } = button;
    const hovered = uiState.hoveredActionId === action.id;
    const pressed = uiState.pressedActionId === action.id;
    ctx.fillStyle = action.disabled ? theme.panelDeep : pressed ? theme.pressed : hovered ? theme.hover : theme.panelSoft;
    ctx.strokeStyle = action.disabled ? theme.border : hovered ? theme.accent : theme.border;
    ctx.lineWidth = hovered ? 2 : 1;
    roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = theme.font;
    ctx.fillStyle = action.disabled ? theme.disabled : theme.text;
    ctx.fillText(action.label, rect.x + 12, rect.y + 22);
}

function drawMainOutput(ctx, rect, uiState, theme) {
    panel(ctx, rect, theme.panelDeep, theme.border);
    ctx.font = theme.font;
    ctx.fillStyle = theme.accent;
    ctx.fillText('Output Log', rect.x + 14, rect.y + 26);
    const inner = {
        x: rect.x + 14,
        y: rect.y + 44,
        w: rect.w - 28,
        h: rect.h - 58,
    };
    drawWrappedLog(ctx, inner, uiState.outputLines, theme);
}

function drawContext(ctx, rect, state, uiState, theme) {
    if (!rect.w || !rect.h) return;
    panel(ctx, rect, theme.panel, theme.border);
    const player = state.player;
    const combat = player.combat;
    const lines = [
        'Context',
        '',
        `${player.identity.name}`,
        `${player.identity.raceName} ${player.jobs.mainJobName} Lv.${player.jobs.level}`,
        `HP ${player.resources.hp}/${combat.resources.maxHp}`,
        `MP ${player.resources.mp}/${combat.resources.maxMp}`,
        `TP ${player.resources.tp}/${combat.resources.maxTp}`,
        '',
        `Location: ${state.location}`,
        `Grid: ${state.position?.x ?? '?'}:${state.position?.y ?? '?'}`,
        '',
        'History',
        ...uiState.commandHistory.slice(-7).map((command) => `> ${command}`),
    ];
    drawLines(ctx, rect.x + 14, rect.y + 26, rect.w - 28, lines, theme);
}

function drawInput(ctx, rect, uiState, theme) {
    panel(ctx, rect, theme.panelSoft, uiState.focusedRegion === 'input' ? theme.accent : theme.border);
    ctx.font = theme.font;
    ctx.fillStyle = theme.accentBright;
    ctx.fillText('>', rect.x + 16, rect.y + 36);
    ctx.fillStyle = theme.text;
    const cursor = uiState.focusedRegion === 'input' ? '_' : '';
    fitText(ctx, `${uiState.inputBuffer}${cursor}`, rect.x + 40, rect.y + 36, rect.w - 56);
}

function drawWrappedLog(ctx, rect, lines, theme) {
    const wrapped = [];
    ctx.font = theme.font;
    for (const line of lines) {
        wrapped.push(...wrapText(ctx, line, rect.w));
    }
    const visibleCount = Math.max(1, Math.floor(rect.h / theme.lineHeight));
    const visible = wrapped.slice(-visibleCount);
    ctx.fillStyle = theme.text;
    visible.forEach((line, index) => {
        ctx.fillText(line, rect.x, rect.y + theme.lineHeight * (index + 1));
    });
}

function drawLines(ctx, x, y, maxWidth, lines, theme) {
    ctx.font = theme.font;
    let offset = 0;
    for (const line of lines) {
        ctx.fillStyle = line === 'Context' || line === 'History' ? theme.accent : theme.text;
        fitText(ctx, line, x, y + offset, maxWidth);
        offset += theme.lineHeight;
    }
}

function wrapText(ctx, text, maxWidth) {
    if (!text) return [''];
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (ctx.measureText(candidate).width <= maxWidth || !current) {
            current = candidate;
        } else {
            lines.push(current);
            current = word;
        }
    }
    lines.push(current);
    return lines;
}

function panel(ctx, rect, fillStyle, strokeStyle) {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fill();
    ctx.stroke();
}

function fitText(ctx, text, x, y, maxWidth) {
    const value = String(text ?? '');
    if (ctx.measureText(value).width <= maxWidth) {
        ctx.fillText(value, x, y);
        return;
    }
    let trimmed = value;
    while (trimmed.length > 1 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
        trimmed = trimmed.slice(0, -1);
    }
    ctx.fillText(`${trimmed}...`, x, y);
}

function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
