import { calculateCombatProfile } from '../systems/statEngine.js';
import { getCreatorStep, getCreatorSummary, validateCreator } from '../systems/characterCreationModel.js';
import { describeCoordinate } from '../data/coordinates.js';
import { createMinimapModel } from './minimapModel.js';
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
    attributes: { ...combat.attributes },
    derived: { ...combat.derived },
    location: state.location,
    coordinate: describeCoordinate(state.position),
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
  if (uiState.screen === 'menu') { drawSplashMenu(ctx, layout, uiState, session, theme); if (uiState.modal) drawModal(ctx, layout, uiState, theme); return; }
  if (uiState.screen === 'creator') { drawCreator(ctx, layout, uiState, theme); if (uiState.modal) drawModal(ctx, layout, uiState, theme); return; }
  if (uiState.screen === 'creatorIntro') { drawCreatorIntro(ctx, layout, uiState, state, theme); if (uiState.modal) drawModal(ctx, layout, uiState, theme); return; }
  drawSidebar(ctx, layout, state, uiState, theme);
  drawMainOutput(ctx, layout.panels.main, uiState, theme);
  drawContext(ctx, layout.panels.context, state, theme);
  drawInput(ctx, layout.panels.input, uiState, theme);
  if (uiState.modal) drawModal(ctx, layout, uiState, theme);
}

function drawSplashMenu(ctx, layout, uiState, session, theme) {
  const topBottom = layout.panels.top.y + layout.panels.top.h;
  const rect = { x: layout.panels.splash.x, y: topBottom + layout.gap, w: layout.panels.splash.w, h: Math.max(120, layout.panels.splash.h - topBottom - layout.gap) };
  panel(ctx, rect, theme.panelDeep, theme.border);
  const centerX = rect.x + rect.w / 2;
  ctx.font = layout.width < 700 ? theme.fontLarge : theme.fontTitle ?? '28px Consolas, monospace';
  ctx.fillStyle = theme.accentBright;
  ctx.textAlign = 'center';
  ctx.fillText('Hearth & Horizon', centerX, rect.y + 64);
  ctx.font = theme.font;
  ctx.fillStyle = theme.muted;
  const accounts = session?.accounts ?? [];
  const subtitle = session?.loggedIn ? `${session.displayName}${session.characterCount ? ` · ${session.characterCount} character${session.characterCount === 1 ? '' : 's'}` : ''}` : accounts.length ? `${accounts.length} local account${accounts.length === 1 ? '' : 's'}` : '';
  if (subtitle) ctx.fillText(subtitle, centerX, rect.y + 90);
  if (!uiState.modal) for (const button of layout.menuButtons) drawButton(ctx, button, uiState, theme);
  if (shouldShowFeedback(uiState.activeFeedback) && !uiState.modal) { ctx.fillStyle = theme.accent; fitText(ctx, uiState.activeFeedback, rect.x + 24, rect.y + rect.h - 48, rect.w - 48, 'center'); }
  ctx.textAlign = 'left';
}

function drawModal(ctx, layout, uiState, theme) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
  ctx.fillRect(0, 0, layout.width, layout.height);
  const rect = layout.panels.modal;
  panel(ctx, rect, theme.panel, theme.accent);
  drawCloseButton(ctx, layout.modalCloseButton, uiState, theme);
  for (const field of layout.modalFields) drawModalField(ctx, field, uiState, theme);
  for (const button of layout.modalButtons) drawButton(ctx, button, uiState, theme);
  if (shouldShowFeedback(uiState.activeFeedback)) { ctx.fillStyle = theme.accent; fitText(ctx, uiState.activeFeedback, rect.x + 18, rect.y + rect.h - 8, rect.w - 36); }
}

function drawCloseButton(ctx, button, uiState, theme) {
  const { rect } = button;
  const hovered = uiState.hoveredActionId === button.action.id;
  const pressed = uiState.pressedActionId === button.action.id;
  ctx.fillStyle = pressed ? theme.pressed : hovered ? theme.hover : theme.panel;
  ctx.strokeStyle = hovered ? theme.accentBright : theme.border;
  ctx.lineWidth = hovered ? 2 : 1;
  roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 5);
  ctx.fill();
  ctx.stroke();
  ctx.font = '18px Consolas, monospace';
  ctx.fillStyle = theme.text;
  ctx.textAlign = 'center';
  ctx.fillText('×', rect.x + rect.w / 2, rect.y + 17);
  ctx.textAlign = 'left';
}

function drawModalField(ctx, field, uiState, theme) {
  const focused = uiState.focusedModalField === field.id;
  const raw = String(uiState.modalInputs?.[field.id] ?? '');
  const value = field.id === 'password' && raw ? '•'.repeat(raw.length) : raw;
  ctx.font = theme.font;
  ctx.fillStyle = focused ? theme.accentBright : theme.muted;
  fitText(ctx, field.label, field.rect.x, field.rect.y - 7, field.rect.w);
  ctx.fillStyle = theme.panelDeep;
  ctx.strokeStyle = focused ? theme.accentBright : theme.border;
  ctx.lineWidth = focused ? 2 : 1;
  roundedRect(ctx, field.rect.x, field.rect.y, field.rect.w, field.rect.h, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = value ? theme.text : theme.muted;
  fitText(ctx, `${value}_`, field.rect.x + 12, field.rect.y + 23, field.rect.w - 24);
}

function drawBackground(ctx, layout, theme) { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, layout.width, layout.height); }

function drawTopBar(ctx, layout, state, uiState, session, theme) {
  const rect = layout.panels.top;
  const snapshot = createCanvasContextSnapshot(state);
  panel(ctx, rect, theme.panelSoft, theme.border);
  ctx.font = theme.font;
  ctx.fillStyle = theme.muted;
  const account = session?.loggedIn ? session.displayName : '';
  const status = uiState.screen === 'menu'
    ? account
    : uiState.screen === 'creator'
      ? `Create Character${account ? ` | ${account}` : ''}`
      : uiState.screen === 'creatorIntro'
        ? `${snapshot.playerName} begins${account ? ` | ${account}` : ''}`
        : `${snapshot.playerName} | ${snapshot.jobName} Lv.${snapshot.level} | ${snapshot.location} ${snapshot.coordinate}${account ? ` | ${account}` : ''}`;
  if (status) fitText(ctx, status, rect.x + 58, rect.y + 24, rect.w - 210);
  if (shouldShowFeedback(uiState.activeFeedback) && uiState.screen !== 'menu') { ctx.fillStyle = theme.accent; fitText(ctx, uiState.activeFeedback, rect.x + 58, rect.y + 42, rect.w - 210); }
  drawClock(ctx, rect, session, theme);
  for (const button of layout.topButtons) drawButton(ctx, button, uiState, theme);
}

function drawClock(ctx, rect, session, theme) {
  const settings = session?.settings ?? {};
  if (!session?.loggedIn || settings.showClock === false) return;
  const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', hour12: settings.clockFormat !== '24h' }).format(new Date());
  ctx.font = theme.font;
  ctx.fillStyle = theme.accentBright;
  fitText(ctx, clock, rect.x + rect.w - 120, rect.y + 32, 104, 'right');
}

function drawCreator(ctx, layout, uiState, theme) {
  const sidebar = layout.panels.sidebar;
  const main = layout.panels.main;
  const input = layout.panels.input;
  panel(ctx, sidebar, theme.panel, theme.border);
  panel(ctx, main, theme.panelDeep, theme.border);
  panel(ctx, input, theme.panelSoft, theme.border);
  ctx.font = theme.fontLarge;
  ctx.fillStyle = theme.accent;
  ctx.fillText('Creation', sidebar.x + 14, sidebar.y + 26);
  const step = getCreatorStep(uiState.creator);
  ctx.font = theme.fontLarge;
  ctx.fillStyle = theme.accentBright;
  fitText(ctx, creatorTitle(step), main.x + 18, main.y + 30, main.w - 36);
  ctx.font = theme.font;
  ctx.fillStyle = theme.muted;
  drawParagraph(ctx, creatorHelp(step), main.x + 18, main.y + 56, main.w - 36, theme);
  for (const button of layout.creatorButtons) drawButton(ctx, button, uiState, theme);
  if (step === 'summary') drawCreatorSummary(ctx, layout, uiState, theme);
  ctx.font = theme.font;
  ctx.fillStyle = theme.muted;
  fitText(ctx, step === 'summary' ? 'Name, review, create.' : 'Choose, then continue.', input.x + 18, input.y + 36, Math.max(80, input.w - 460));
}

function drawCreatorSummary(ctx, layout, uiState, theme) {
  const summary = getCreatorSummary(uiState.creator);
  const main = layout.panels.main;
  const nameRect = layout.panels.creatorName;
  ctx.font = theme.font;
  ctx.fillStyle = theme.accent;
  ctx.fillText('Name', nameRect.x, nameRect.y - 7);
  const focused = uiState.focusedRegion === 'creatorName';
  ctx.fillStyle = focused ? theme.panelSoft : theme.panelDeep;
  ctx.strokeStyle = focused ? theme.accentBright : theme.border;
  ctx.lineWidth = focused ? 2 : 1;
  roundedRect(ctx, nameRect.x, nameRect.y, nameRect.w, nameRect.h, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = uiState.creator.name ? theme.text : theme.muted;
  fitText(ctx, `${uiState.creator.name || 'Type a name'}${focused ? '_' : ''}`, nameRect.x + 12, nameRect.y + 24, nameRect.w - 24);
  const issues = validateCreator(uiState.creator);
  if (issues.length) {
    ctx.fillStyle = theme.accent;
    fitText(ctx, issues[0], nameRect.x, nameRect.y + nameRect.h + 20, main.w - 36);
  }
  drawLines(ctx, main.x + 18, nameRect.y + nameRect.h + 46, main.w - 36, [
    'Starting Profile',
    `Ancestry: ${summary.race} · ${summary.sex}`,
    `Origin: ${summary.nation}`,
    `Start: ${summary.startingCity}`,
    `Region: ${summary.starterRegion}`,
    `Discipline: ${summary.job}`,
  ], theme);
}

function drawCreatorIntro(ctx, layout, uiState, state, theme) {
  const main = layout.panels.main;
  panel(ctx, main, theme.panelDeep, theme.border);
  ctx.font = theme.fontTitle ?? '28px Consolas, monospace';
  ctx.fillStyle = theme.accentBright;
  fitText(ctx, state.player.identity.name, main.x + 24, main.y + 48, main.w - 48);
  ctx.font = theme.fontLarge;
  ctx.fillStyle = theme.accent;
  fitText(ctx, `${state.player.identity.raceName} ${state.player.jobs.mainJobName} of ${state.player.identity.nation}`, main.x + 24, main.y + 80, main.w - 48);
  ctx.font = theme.font;
  ctx.fillStyle = theme.text;
  let y = main.y + 126;
  for (const paragraph of uiState.creatorIntro ?? []) y = drawParagraph(ctx, paragraph, main.x + 24, y + 2, main.w - 48, theme) + theme.lineHeight;
  for (const button of layout.creatorButtons) drawButton(ctx, button, uiState, theme);
}

function creatorTitle(step) {
  if (step === 'identity') return 'Choose Ancestry';
  if (step === 'nation') return 'Choose Your Origin';
  if (step === 'job') return 'Choose Starting Discipline';
  return 'Review Character';
}

function creatorHelp(step) {
  if (step === 'identity') return 'Ancestry shapes starting attributes; it does not lock disciplines or future capabilities. Choose sex alongside ancestry where available.';
  if (step === 'nation') return 'Origin sets your first city, surrounding region, and starting map knowledge.';
  if (step === 'job') return 'Your first discipline is initial training, not a permanent class or a limit on future learning.';
  return 'Name the character, review the starting choices, and create.';
}

function drawSidebar(ctx, layout, state, uiState, theme) {
  const rect = layout.panels.sidebar;
  panel(ctx, rect, theme.panel, theme.border);
  ctx.font = theme.fontLarge;
  ctx.fillStyle = theme.accent;
  ctx.fillText('Local Map', rect.x + 14, rect.y + 26);
  drawMinimap(ctx, layout.panels.minimap, state, theme);
  drawCompass(ctx, layout, uiState, theme);
  ctx.font = theme.fontLarge;
  ctx.fillStyle = theme.accent;
  ctx.fillText(uiState.actionCategory ? 'Menu' : 'Actions', rect.x + 14, layout.actionHeadingY);
  for (const button of layout.actionButtons) drawButton(ctx, button, uiState, theme);
}

function drawMinimap(ctx, rect, state, theme) {
  panel(ctx, rect, theme.panelDeep, theme.border);
  const model = createMinimapModel(state);
  if (!model) return;

  ctx.font = theme.fontSmall ?? '12px Consolas, monospace';
  ctx.fillStyle = theme.muted;
  fitText(ctx, model.placeName, rect.x + 8, rect.y + 16, rect.w - 42);
  ctx.fillStyle = theme.accent;
  fitText(ctx, 'N', rect.x + rect.w - 28, rect.y + 16, 20, 'right');

  const footerHeight = 18;
  const mapRect = { x: rect.x + 8, y: rect.y + 24, w: Math.max(24, rect.w - 16), h: Math.max(24, rect.h - 24 - footerHeight) };
  const cellW = mapRect.w / Math.max(1, model.width);
  const cellH = mapRect.h / Math.max(1, model.height);
  const center = (cell) => ({ x: mapRect.x + (cell.x + 0.5) * cellW, y: mapRect.y + (cell.y + 0.5) * cellH });

  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1;
  for (let column = 1; column < model.width; column += 1) {
    const x = mapRect.x + column * cellW;
    ctx.beginPath(); ctx.moveTo(x, mapRect.y); ctx.lineTo(x, mapRect.y + mapRect.h); ctx.stroke();
  }
  for (let row = 1; row < model.height; row += 1) {
    const y = mapRect.y + row * cellH;
    ctx.beginPath(); ctx.moveTo(mapRect.x, y); ctx.lineTo(mapRect.x + mapRect.w, y); ctx.stroke();
  }

  for (const connection of model.connections ?? []) {
    const from = center(connection.from);
    const to = center(connection.to);
    const targetX = connection.targetVisited ? to.x : from.x + (to.x - from.x) * (connection.exit ? 0.7 : 0.45);
    const targetY = connection.targetVisited ? to.y : from.y + (to.y - from.y) * (connection.exit ? 0.7 : 0.45);
    ctx.strokeStyle = connection.exit ? theme.accent : connection.currentSource ? theme.accentBright : theme.muted;
    ctx.lineWidth = connection.currentSource ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(targetX, targetY); ctx.stroke();
  }

  for (const cell of model.cells) {
    const centerPoint = center(cell);
    const size = Math.max(3, Math.min(8, Math.floor(Math.min(cellW, cellH) * 0.55)));
    ctx.fillStyle = cell.current ? theme.accentBright : theme.text;
    ctx.fillRect(centerPoint.x - size / 2, centerPoint.y - size / 2, size, size);
  }

  ctx.font = theme.fontSmall ?? '12px Consolas, monospace';
  ctx.fillStyle = theme.muted;
  fitText(ctx, `${model.currentLabel} · ${model.exploredCount}/${model.totalCount}`, rect.x + 8, rect.y + rect.h - 5, rect.w - 16, 'center');
}

function drawCompass(ctx, layout, uiState, theme) {
  for (const button of layout.compassButtons ?? []) drawButton(ctx, button, uiState, theme);
  if (layout.autoRunButton) drawButton(ctx, layout.autoRunButton, uiState, theme);
}

function drawButton(ctx, button, uiState, theme) {
  const { action, rect } = button;
  const hovered = uiState.hoveredActionId === action.id;
  const pressed = uiState.pressedActionId === action.id;
  const selected = Boolean(action.selected);
  ctx.fillStyle = action.disabled ? theme.panelDeep : pressed ? theme.pressed : hovered ? theme.hover : selected ? theme.hover : theme.panelSoft;
  ctx.strokeStyle = action.disabled ? theme.border : selected ? theme.accentBright : hovered ? theme.accent : theme.border;
  ctx.lineWidth = hovered || selected ? 2 : 1;
  roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 6);
  ctx.fill();
  ctx.stroke();
  if (action.id === 'menu') { drawHamburgerIcon(ctx, rect, action.disabled ? theme.disabled : theme.text); return; }

  ctx.fillStyle = action.disabled ? theme.disabled : selected ? theme.accentBright : theme.text;
  if (action.region === 'compass') {
    ctx.font = '18px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(action.label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 6);
    ctx.textAlign = 'left';
    return;
  }
  if (action.region === 'category') {
    ctx.font = theme.fontSmall ?? theme.font;
    fitText(ctx, action.label, rect.x + 5, rect.y + rect.h / 2 + 5, rect.w - 10, 'center');
    return;
  }
  if (action.region === 'autoRun') {
    ctx.font = theme.fontSmall ?? theme.font;
    fitText(ctx, action.label, rect.x + 5, rect.y + rect.h / 2 + 5, rect.w - 10, 'center');
    return;
  }

  ctx.font = theme.font;
  fitText(ctx, action.label, rect.x + 12, rect.y + 22, rect.w - 24);
  if (action.detail && rect.h > 50) {
    ctx.font = theme.fontSmall ?? '12px Consolas, monospace';
    ctx.fillStyle = action.disabled ? theme.disabled : theme.muted;
    const detailLines = wrapText(ctx, action.detail, rect.w - 24).slice(0, 3);
    detailLines.forEach((line, index) => ctx.fillText(line, rect.x + 12, rect.y + 43 + index * 14));
  }
}

function drawHamburgerIcon(ctx, rect, color) {
  const lineWidth = Math.max(14, Math.floor(rect.w * 0.48));
  const startX = rect.x + Math.floor((rect.w - lineWidth) / 2);
  const centerY = rect.y + Math.floor(rect.h / 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (const offset of [-7, 0, 7]) { ctx.beginPath(); ctx.moveTo(startX, centerY + offset); ctx.lineTo(startX + lineWidth, centerY + offset); ctx.stroke(); }
  ctx.lineCap = 'butt';
}

function drawMainOutput(ctx, rect, uiState, theme) {
  const isHovered = uiState.hoveredRegion === 'main';
  panel(ctx, rect, theme.panelDeep, isHovered ? theme.accent : theme.border);
  ctx.font = theme.font;
  ctx.fillStyle = theme.accent;
  ctx.fillText('Output Log', rect.x + 14, rect.y + 26);
  const inner = { x: rect.x + 14, y: rect.y + 44, w: rect.w - 28, h: rect.h - 58 };
  drawWrappedLog(ctx, inner, uiState.outputLines, theme, uiState.outputScrollOffset);
}

function drawContext(ctx, rect, state, theme) {
  if (!rect.w || !rect.h) return;
  panel(ctx, rect, theme.panel, theme.border);
  const s = createCanvasContextSnapshot(state);
  const a = s.attributes;
  const d = s.derived;
  drawLines(ctx, rect.x + 14, rect.y + 26, rect.w - 28, [
    'Character',
    s.playerName,
    `${s.raceName} · ${s.jobName} Lv.${s.level}`,
    '',
    `HP ${s.hp}/${s.maxHp}`,
    `MP ${s.mp}/${s.maxMp}`,
    `TP ${s.tp}/${s.maxTp}`,
    '',
    'Attributes',
    `STR ${a.str}   DEX ${a.dex}`,
    `VIT ${a.vit}   AGI ${a.agi}`,
    `INT ${a.int}   MND ${a.mnd}`,
    `CHR ${a.chr}`,
    '',
    'Combat',
    `ATK ${d.attack}   DEF ${d.defense}`,
    `ACC ${d.accuracy}   EVA ${d.evasion}`,
    `M.ATK ${d.magicAttack}   M.DEF ${d.magicDefense}`,
    `M.ACC ${d.magicAccuracy}   M.EVA ${d.magicEvasion}`,
    '',
    'Location',
    s.location,
    s.coordinate,
  ], theme);
}

function drawInput(ctx, rect, uiState, theme) {
  const focused = uiState.focusedRegion === 'input';
  const border = focused ? theme.accentBright : uiState.hoveredRegion === 'input' ? theme.accent : theme.border;
  panel(ctx, rect, focused ? theme.panelSoft : theme.panelDeep, border);
  ctx.font = theme.font;
  ctx.fillStyle = focused ? theme.accentBright : theme.accent;
  ctx.fillText('>', rect.x + 16, rect.y + 36);
  ctx.fillStyle = theme.text;
  fitText(ctx, `${uiState.inputBuffer}${focused ? '_' : ''}`, rect.x + 40, rect.y + 36, rect.w - 56);
}

function drawWrappedLog(ctx, rect, lines, theme, scrollOffset = 0) {
  const visible = getVisibleLogLines(ctx, lines, rect, theme, scrollOffset);
  ctx.fillStyle = theme.text;
  visible.forEach((line, index) => ctx.fillText(line, rect.x, rect.y + theme.lineHeight * (index + 1)));
}

function drawLines(ctx, x, y, maxWidth, lines, theme) {
  ctx.font = theme.font;
  let offset = 0;
  const headings = new Set(['Context', 'History', 'Character', 'Attributes', 'Combat', 'Location', 'Starting Profile']);
  for (const line of lines) {
    ctx.fillStyle = headings.has(line) ? theme.accent : theme.text;
    fitText(ctx, line, x, y + offset, maxWidth);
    offset += theme.lineHeight;
  }
}

function drawParagraph(ctx, text, x, y, maxWidth, theme) {
  ctx.font = theme.font;
  const lines = wrapText(ctx, text, maxWidth);
  lines.forEach((line, index) => ctx.fillText(line, x, y + theme.lineHeight * index));
  return y + theme.lineHeight * lines.length;
}

export function wrapText(ctx, text, maxWidth) {
  if (!text) return [''];
  const width = Math.max(1, Number(maxWidth) || 1);
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const rawWord of words) {
    const pieces = splitWordToWidth(ctx, rawWord, width);
    for (const word of pieces) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= width) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
  }
  if (current || !lines.length) lines.push(current);
  return lines;
}

function splitWordToWidth(ctx, word, maxWidth) {
  if (ctx.measureText(word).width <= maxWidth) return [word];
  const pieces = [];
  let current = '';
  for (const char of word) {
    const candidate = `${current}${char}`;
    if (current && ctx.measureText(candidate).width > maxWidth) {
      pieces.push(current);
      current = char;
    } else {
      current = candidate;
    }
  }
  if (current) pieces.push(current);
  return pieces;
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
  const drawX = align === 'center' ? x + maxWidth / 2 : align === 'right' ? x + maxWidth : x;
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

function shouldShowFeedback(feedback) {
  const value = String(feedback ?? '').trim();
  return Boolean(value && value !== 'Main menu opened.');
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
