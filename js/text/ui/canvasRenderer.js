import { calculateCombatProfile } from '../systems/statEngine.js';
import { CANVAS_THEME } from './uiTheme.js';

export function createCanvasContextSnapshot(state) {
    const player = state.player;
    const combat = calculateCombatProfile(player);
    return {
        playerName: player.identity.name,
        raceName: player.identity.raceName,
        jobName: player.jobs.mainJobName,
        level: player.jobs.level,
        hp: player.resources.hp,
        maxHp: combat.resources.maxHp,
        mp: player.resources.mp,
        maxMp: combat.resources.maxMp,
        tp: player.resources.tp,
        maxTp: combat.resources.maxTp,
        location: state.location,
        gridX: state.position?.x ?? '?',
        gridY: state.position?.y ?? '?',
    };
}

export function getVisibleLogLines(ctx, lines, rect, theme = CANVAS_THEME, scrollOffset = 0) {
    const wrapped = [];
    ctx.font = theme.font;
    for (const line of lines) wrapped.push(...wrapText(ctx, line, rect.w));
    const visibleCount = Math.max(1, Math.floor(rect.h / theme.lineHeight));
    const maxOffset = Math.max(0, wrapped.length - visibleCount);
    const offset = Math.max(0, Math.min(maxOffset, Number(scrollOffset) || 0));
    const end = wrapped.length - offset;
    return wrapped.slice(Math.max(0, end - visibleCount), end);
}

export function renderCanvasApp(ctx, { layout, state, uiState, session = null, theme = CANVAS_THEME }) {
    ctx.clearRect(0, 0, layout.width, layout.height);
    drawBackground(ctx, layout, theme);
    drawTopBar(ctx, layout, state, uiState, session, theme);
    if (uiState.screen === 'menu') {
        drawSplashMenu(ctx, layout, uiState, session, theme);
        return;
    }
    drawSidebar(ctx, layout, uiState, theme);
    drawMainOutput(ctx, layout.panels.main, uiState, theme);
    drawContext(ctx, layout.panels.context, state, uiState, theme);
    drawInput(ctx, layout.panels.input, uiState, theme);
}

function drawSplashMenu(ctx, layout, uiState, session, theme) {
    const topBottom = layout.panels.top.y + layout.panels.top.h;
    const rect = {
        x: layout.panels.splash.x,
        y: topBottom + layout.gap,
        w: layout.panels.splash.w,
        h: Math.max(120, layout.panels.splash.h - topBottom - layout.gap),
    };
    panel(ctx, rect, theme.panelDeep, theme.border);
    const compact = layout.width < 700 || layout.height < 560;
    const centerX = rect.x + rect.w / 2;
    const titleY = rect.y + (compact ? 42 : 64);

    ctx.font = compact ? theme.fontLarge : theme.fontTitle ?? '28px Consolas, monospace';
    ctx.fillStyle = theme.accentBright;
    ctx.textAlign = 'center';
    ctx.fillText('FFXI Text RPG', centerX, titleY);
    ctx.font = theme.font;
    ctx.fillStyle = theme.muted;

    const accounts = session?.accounts ?? [];
    const status = session?.loggedIn
        ? `${session.displayName} · ${session.characterCount} character${session.characterCount === 1 ? '' : 's'}`
        : accounts.length ? `${accounts.length} local account${accounts.length === 1 ? '' : 's'}` : 'No local accounts';
    ctx.fillText(status, centerX, titleY + 26);

    const infoLines = [];
    if (!session?.loggedIn && !accounts.length) infoLines.push('Create Account: enter account name | password');
    else if (!session?.loggedIn) infoLines.push('Select an account, enter password, then Login.');
    else if (!session.characterCount) infoLines.push('No characters on this account. Create a character.');
    else infoLines.push('Select a character to play.');
    drawCenteredLines(ctx, centerX, titleY + 54, rect.w - 48, infoLines, theme);

    for (const button of layout.menuButtons) drawButton(ctx, button, uiState, theme);

    const hintY = rect.y + rect.h - (compact ? 44 : 58);
    ctx.font = theme.font;
    ctx.fillStyle = theme.muted;
    ctx.textAlign = 'center';
    fitText(ctx, `Input: ${uiState.inputBuffer || '_'}`, rect.x + 24, hintY, rect.w - 48, 'center');
    if (uiState.activeFeedback) {
        ctx.fillStyle = theme.accent;
        fitText(ctx, uiState.activeFeedback, rect.x + 24, hintY + 22, rect.w - 48, 'center');
    }
    ctx.textAlign = 'left';
}

function drawBackground(ctx, layout, theme) {
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, layout.width, layout.height);
}

function drawTopBar(ctx, layout, state, uiState, session, theme) {
    const rect = layout.panels.top;
    const snapshot = createCanvasContextSnapshot(state);
    panel(ctx, rect, theme.panelSoft, theme.border);
    ctx.font = theme.fontLarge;
    ctx.fillStyle = theme.accentBright;
    ctx.fillText('FFXI Text RPG', rect.x + 16, rect.y + 32);
    ctx.font = theme.font;
    ctx.fillStyle = theme.muted;
    const account = session?.loggedIn ? session.displayName : 'No account';
    const status = uiState.screen === 'menu'
        ? `Main Menu | ${account}`
        : `${snapshot.playerName} | ${snapshot.jobName} Lv.${snapshot.level} | ${snapshot.location} ${snapshot.gridX}:${snapshot.gridY} | ${account}`;
    fitText(ctx, status, rect.x + 190, rect.y + 24, rect.w - 310);
    if (uiState.activeFeedback) {
        ctx.fillStyle = theme.accent;
        fitText(ctx, uiState.activeFeedback, rect.x + 190, rect.y + 42, rect.w - 310);
    }
    for (const button of layout.topButtons) drawButton(ctx, button, uiState, theme);
}

function drawSidebar(ctx, layout, uiState, theme) {
    const rect = layout.panels.sidebar;
    panel(ctx, rect, theme.panel, theme.border);
    ctx.font = theme.fontLarge;
    ctx.fillStyle = theme.accent;
    ctx.fillText('Actions', rect.x + 14, rect.y + 26);
    for (const button of layout.actionButtons) drawButton(ctx, button, uiState, theme);
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
    fitText(ctx, action.label, rect.x + 12, rect.y + 22, rect.w - 24);
}

function drawMainOutput(ctx, rect, uiState, theme) {
    const isHovered = uiState.hoveredRegion === 'main';
    panel(ctx, rect, theme.panelDeep, isHovered ? theme.accent : theme.border);
    ctx.font = theme.font;
    ctx.fillStyle = theme.accent;
    ctx.fillText('Output Log', rect.x + 14, rect.y + 26);
    if (uiState.outputScrollOffset > 0) {
        ctx.fillStyle = theme.muted;
        fitText(ctx, `Scrolled +${uiState.outputScrollOffset} lines`, rect.x + 110, rect.y + 26, rect.w - 124);
    }
    const inner = { x: rect.x + 14, y: rect.y + 44, w: rect.w - 28, h: rect.h - 58 };
    drawWrappedLog(ctx, inner, uiState.outputLines, theme, uiState.outputScrollOffset);
}

function drawContext(ctx, rect, state, uiState, theme) {
    if (!rect.w || !rect.h) return;
    panel(ctx, rect, theme.panel, theme.border);
    const snapshot = createCanvasContextSnapshot(state);
    const lines = [
        'Context', '', `${snapshot.playerName}`,
        `${snapshot.raceName} ${snapshot.jobName} Lv.${snapshot.level}`,
        `HP ${snapshot.hp}/${snapshot.maxHp}`,
        `MP ${snapshot.mp}/${snapshot.maxMp}`,
        `TP ${snapshot.tp}/${snapshot.maxTp}`,
        '', `Location: ${snapshot.location}`, `Grid: ${snapshot.gridX}:${snapshot.gridY}`,
        '', 'History', ...uiState.commandHistory.slice(-7).map((command) => `> ${command}`),
    ];
    drawLines(ctx, rect.x + 14, rect.y + 26, rect.w - 28, lines, theme);
}

function drawInput(ctx, rect, uiState, theme) {
    const focused = uiState.focusedRegion === 'input';
    const hovered = uiState.hoveredRegion === 'input';
    const pressed = uiState.pressedRegion === 'input';
    const border = focused ? theme.accentBright : hovered ? theme.accent : theme.border;
    const fill = pressed ? theme.pressed : focused ? theme.panelSoft : theme.panelDeep;
    panel(ctx, rect, fill, border);
    ctx.font = theme.font;
    ctx.fillStyle = focused ? theme.accentBright : theme.accent;
    ctx.fillText('>', rect.x + 16, rect.y + 36);
    ctx.fillStyle = theme.text;
    const cursor = focused ? '_' : '';
    fitText(ctx, `${uiState.inputBuffer}${cursor}`, rect.x + 40, rect.y + 36, rect.w - 56);
}

function drawWrappedLog(ctx, rect, lines, theme, scrollOffset = 0) {
    const visible = getVisibleLogLines(ctx, lines, rect, theme, scrollOffset);
    ctx.fillStyle = theme.text;
    visible.forEach((line, index) => ctx.fillText(line, rect.x, rect.y + theme.lineHeight * (index + 1)));
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

function drawCenteredLines(ctx, centerX, y, maxWidth, lines, theme) {
    ctx.font = theme.font;
    ctx.fillStyle = theme.text;
    lines.forEach((line, index) => fitText(ctx, line, centerX - maxWidth / 2, y + index * theme.lineHeight, maxWidth, 'center'));
}

function wrapText(ctx, text, maxWidth) {
    if (!text) return [''];
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (ctx.measureText(candidate).width <= maxWidth || !current) current = candidate;
        else { lines.push(current); current = word; }
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

function fitText(ctx, text, x, y, maxWidth, align = 'left') {
    const previousAlign = ctx.textAlign;
    ctx.textAlign = align;
    const value = String(text ?? '');
    const drawX = align === 'center' ? x + maxWidth / 2 : x;
    if (ctx.measureText(value).width <= maxWidth) {
        ctx.fillText(value, drawX, y);
        ctx.textAlign = previousAlign;
        return;
    }
    let trimmed = value;
    while (trimmed.length > 1 && ctx.measureText(`${trimmed}...`).width > maxWidth) trimmed = trimmed.slice(0, -1);
    ctx.fillText(`${trimmed}...`, drawX, y);
    ctx.textAlign = previousAlign;
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
