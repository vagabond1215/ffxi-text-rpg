import { calculateCombatProfile } from '../systems/statEngine.js';
import { getCreatorStep, getCreatorSummary, validateCreator } from '../systems/characterCreationModel.js';
import { CANVAS_THEME } from './uiTheme.js';

export function createCanvasContextSnapshot(state) {
  const player = state.player;
  const combat = calculateCombatProfile(player);
  return { playerName: player.identity.name, raceName: player.identity.raceName, jobName: player.jobs.mainJobName, level: player.jobs.level, hp: player.resources.hp, maxHp: combat.resources.maxHp, mp: player.resources.mp, maxMp: combat.resources.maxMp, tp: player.resources.tp, maxTp: combat.resources.maxTp, location: state.location, gridX: state.position?.x ?? '?', gridY: state.position?.y ?? '?' };
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
  drawSidebar(ctx, layout, uiState, theme);
  drawMainOutput(ctx, layout.panels.main, uiState, theme);
  drawContext(ctx, layout.panels.context, state, uiState, theme);
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
  ctx.fillText('FFXI Text RPG', centerX, rect.y + 64);
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
  ctx.fillStyle = 'rgba(0, 0, 0, 0.48)'; ctx.fillRect(0, 0, layout.width, layout.height);
  const rect = layout.panels.modal; panel(ctx, rect, theme.panel, theme.accent); drawCloseButton(ctx, layout.modalCloseButton, uiState, theme);
  for (const field of layout.modalFields) drawModalField(ctx, field, uiState, theme);
  for (const button of layout.modalButtons) drawButton(ctx, button, uiState, theme);
  if (shouldShowFeedback(uiState.activeFeedback)) { ctx.fillStyle = theme.accent; fitText(ctx, uiState.activeFeedback, rect.x + 18, rect.y + rect.h - 8, rect.w - 36); }
}

function drawCloseButton(ctx, button, uiState, theme) {
  const { rect } = button; const hovered = uiState.hoveredActionId === button.action.id; const pressed = uiState.pressedActionId === button.action.id;
  ctx.fillStyle = pressed ? theme.pressed : hovered ? theme.hover : theme.panel; ctx.strokeStyle = hovered ? theme.accentBright : theme.border; ctx.lineWidth = hovered ? 2 : 1; roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 5); ctx.fill(); ctx.stroke();
  ctx.font = '18px Consolas, monospace'; ctx.fillStyle = theme.text; ctx.textAlign = 'center'; ctx.fillText('×', rect.x + rect.w / 2, rect.y + 17); ctx.textAlign = 'left';
}

function drawModalField(ctx, field, uiState, theme) {
  const focused = uiState.focusedModalField === field.id; const raw = String(uiState.modalInputs?.[field.id] ?? ''); const value = field.id === 'password' && raw ? '•'.repeat(raw.length) : raw;
  ctx.font = theme.font; ctx.fillStyle = focused ? theme.accentBright : theme.muted; fitText(ctx, field.label, field.rect.x, field.rect.y - 7, field.rect.w);
  ctx.fillStyle = theme.panelDeep; ctx.strokeStyle = focused ? theme.accentBright : theme.border; ctx.lineWidth = focused ? 2 : 1; roundedRect(ctx, field.rect.x, field.rect.y, field.rect.w, field.rect.h, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = value ? theme.text : theme.muted; fitText(ctx, `${value}_`, field.rect.x + 12, field.rect.y + 23, field.rect.w - 24);
}

function drawBackground(ctx, layout, theme) { ctx.fillStyle = theme.background; ctx.fillRect(0, 0, layout.width, layout.height); }

function drawTopBar(ctx, layout, state, uiState, session, theme) {
  const rect = layout.panels.top; const snapshot = createCanvasContextSnapshot(state); panel(ctx, rect, theme.panelSoft, theme.border); ctx.font = theme.font; ctx.fillStyle = theme.muted;
  const account = session?.loggedIn ? session.displayName : '';
  const status = uiState.screen === 'menu' ? account : uiState.screen === 'creator' ? `Create Adventurer${account ? ` | ${account}` : ''}` : uiState.screen === 'creatorIntro' ? `${snapshot.playerName} begins${account ? ` | ${account}` : ''}` : `${snapshot.playerName} | ${snapshot.jobName} Lv.${snapshot.level} | ${snapshot.location} ${snapshot.gridX}:${snapshot.gridY}${account ? ` | ${account}` : ''}`;
  if (status) fitText(ctx, status, rect.x + 58, rect.y + 24, rect.w - 210);
  if (shouldShowFeedback(uiState.activeFeedback) && uiState.screen !== 'menu') { ctx.fillStyle = theme.accent; fitText(ctx, uiState.activeFeedback, rect.x + 58, rect.y + 42, rect.w - 210); }
  drawClock(ctx, rect, session, theme); for (const button of layout.topButtons) drawButton(ctx, button, uiState, theme);
}

function drawClock(ctx, rect, session, theme) {
  const settings = session?.settings ?? {}; if (!session?.loggedIn || settings.showClock === false) return;
  const clock = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', hour12: settings.clockFormat !== '24h' }).format(new Date());
  ctx.font = theme.font; ctx.fillStyle = theme.accentBright; fitText(ctx, clock, rect.x + rect.w - 120, rect.y + 32, 104, 'right');
}

function drawCreator(ctx, layout, uiState, theme) {
  const sidebar = layout.panels.sidebar, main = layout.panels.main, input = layout.panels.input;
  panel(ctx, sidebar, theme.panel, theme.border); panel(ctx, main, theme.panelDeep, theme.border); panel(ctx, input, theme.panelSoft, theme.border);
  ctx.font = theme.fontLarge; ctx.fillStyle = theme.accent; ctx.fillText('Creation', sidebar.x + 14, sidebar.y + 26);
  const step = getCreatorStep(uiState.creator); ctx.font = theme.fontLarge; ctx.fillStyle = theme.accentBright; fitText(ctx, creatorTitle(step), main.x + 18, main.y + 30, main.w - 36);
  ctx.font = theme.font; ctx.fillStyle = theme.muted; drawParagraph(ctx, creatorHelp(step), main.x + 18, main.y + 56, main.w - 36, theme);
  for (const button of layout.creatorButtons) drawButton(ctx, button, uiState, theme);
  if (step === 'summary') drawCreatorSummary(ctx, layout, uiState, theme);
  ctx.font = theme.font; ctx.fillStyle = theme.muted; fitText(ctx, step === 'summary' ? 'Enter your name, review, then create.' : 'Choose an option, then continue.', input.x + 18, input.y + 36, Math.max(80, input.w - 520));
}

function drawCreatorSummary(ctx, layout, uiState, theme) {
  const summary = getCreatorSummary(uiState.creator); const main = layout.panels.main; const nameRect = layout.panels.creatorName;
  drawLines(ctx, main.x + 18, main.y + 118, main.w - 36, [`Race: ${summary.race} (${summary.sex})`, `Job: ${summary.job} (${summary.jobAbbreviation})`, `Nation: ${summary.nation}`, `Starting City: ${summary.startingCity}`, `Starter Region: ${summary.starterRegion}`, `Maps: ${summary.startingMaps.join(', ')}`, `Key Items: ${summary.startingKeyItems.join(', ')}`], theme);
  ctx.font = theme.font; ctx.fillStyle = theme.accent; ctx.fillText('Name', nameRect.x, nameRect.y - 7);
  const focused = uiState.focusedRegion === 'creatorName'; ctx.fillStyle = focused ? theme.panelSoft : theme.panelDeep; ctx.strokeStyle = focused ? theme.accentBright : theme.border; ctx.lineWidth = focused ? 2 : 1; roundedRect(ctx, nameRect.x, nameRect.y, nameRect.w, nameRect.h, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = uiState.creator.name ? theme.text : theme.muted; fitText(ctx, `${uiState.creator.name || 'Type a name'}${focused ? '_' : ''}`, nameRect.x + 12, nameRect.y + 24, nameRect.w - 24);
  const issues = validateCreator(uiState.creator); if (issues.length) { ctx.fillStyle = theme.accent; fitText(ctx, issues[0], nameRect.x, nameRect.y + nameRect.h + 20, main.w - 36); }
}

function drawCreatorIntro(ctx, layout, uiState, state, theme) {
  const main = layout.panels.main; panel(ctx, main, theme.panelDeep, theme.border);
  ctx.font = theme.fontTitle ?? '28px Consolas, monospace'; ctx.fillStyle = theme.accentBright; fitText(ctx, state.player.identity.name, main.x + 24, main.y + 48, main.w - 48);
  ctx.font = theme.fontLarge; ctx.fillStyle = theme.accent; fitText(ctx, `${state.player.identity.raceName} ${state.player.jobs.mainJobName} of ${state.player.identity.nation}`, main.x + 24, main.y + 80, main.w - 48);
  ctx.font = theme.font; ctx.fillStyle = theme.text; let y = main.y + 126; for (const paragraph of uiState.creatorIntro ?? []) y = drawParagraph(ctx, paragraph, main.x + 24, y + 2, main.w - 48, theme) + theme.lineHeight;
  for (const button of layout.creatorButtons) drawButton(ctx, button, uiState, theme);
}

function creatorTitle(step) { return step === 'identity' ? 'Choose Race and Sex' : step === 'nation' ? 'Choose Starting City' : step === 'job' ? 'Choose Starting Job' : 'Review Adventurer'; }
function creatorHelp(step) { return step === 'identity' ? 'Race changes allowed sex options. Appearance stays out of scope for this first pass.' : step === 'nation' ? 'Your city determines starting location, first region, maps, and early flavor.' : step === 'job' ? 'Only the six default starting jobs are shown. Advanced jobs remain progression unlocks.' : 'Name the character and confirm the final setup.'; }

function drawSidebar(ctx, layout, uiState, theme) { const rect = layout.panels.sidebar; panel(ctx, rect, theme.panel, theme.border); ctx.font = theme.fontLarge; ctx.fillStyle = theme.accent; ctx.fillText('Actions', rect.x + 14, rect.y + 26); for (const button of layout.actionButtons) drawButton(ctx, button, uiState, theme); }

function drawButton(ctx, button, uiState, theme) {
  const { action, rect } = button; const hovered = uiState.hoveredActionId === action.id; const pressed = uiState.pressedActionId === action.id; const selected = Boolean(action.selected);
  ctx.fillStyle = action.disabled ? theme.panelDeep : pressed ? theme.pressed : hovered ? theme.hover : selected ? theme.hover : theme.panelSoft; ctx.strokeStyle = action.disabled ? theme.border : selected ? theme.accentBright : hovered ? theme.accent : theme.border; ctx.lineWidth = hovered || selected ? 2 : 1; roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 6); ctx.fill(); ctx.stroke();
  if (action.id === 'menu') { drawHamburgerIcon(ctx, rect, action.disabled ? theme.disabled : theme.text); return; }
  ctx.font = theme.font; ctx.fillStyle = action.disabled ? theme.disabled : selected ? theme.accentBright : theme.text; fitText(ctx, action.label, rect.x + 12, rect.y + 22, rect.w - 24);
  if (action.detail && rect.h > 50) { ctx.font = '12px Consolas, monospace'; ctx.fillStyle = action.disabled ? theme.disabled : theme.muted; fitText(ctx, action.detail, rect.x + 12, rect.y + 42, rect.w - 24); }
}

function drawHamburgerIcon(ctx, rect, color) { const lineWidth = Math.max(14, Math.floor(rect.w * 0.48)); const startX = rect.x + Math.floor((rect.w - lineWidth) / 2); const centerY = rect.y + Math.floor(rect.h / 2); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineCap = 'round'; for (const offset of [-7, 0, 7]) { ctx.beginPath(); ctx.moveTo(startX, centerY + offset); ctx.lineTo(startX + lineWidth, centerY + offset); ctx.stroke(); } ctx.lineCap = 'butt'; }

function drawMainOutput(ctx, rect, uiState, theme) { const isHovered = uiState.hoveredRegion === 'main'; panel(ctx, rect, theme.panelDeep, isHovered ? theme.accent : theme.border); ctx.font = theme.font; ctx.fillStyle = theme.accent; ctx.fillText('Output Log', rect.x + 14, rect.y + 26); const inner = { x: rect.x + 14, y: rect.y + 44, w: rect.w - 28, h: rect.h - 58 }; drawWrappedLog(ctx, inner, uiState.outputLines, theme, uiState.outputScrollOffset); }
function drawContext(ctx, rect, state, uiState, theme) { if (!rect.w || !rect.h) return; panel(ctx, rect, theme.panel, theme.border); const s = createCanvasContextSnapshot(state); drawLines(ctx, rect.x + 14, rect.y + 26, rect.w - 28, ['Context', '', s.playerName, `${s.raceName} ${s.jobName} Lv.${s.level}`, `HP ${s.hp}/${s.maxHp}`, `MP ${s.mp}/${s.maxMp}`, `TP ${s.tp}/${s.maxTp}`, '', `Location: ${s.location}`, `Grid: ${s.gridX}:${s.gridY}`, '', 'History', ...uiState.commandHistory.slice(-7).map((command) => `> ${command}`)], theme); }
function drawInput(ctx, rect, uiState, theme) { const focused = uiState.focusedRegion === 'input'; const border = focused ? theme.accentBright : uiState.hoveredRegion === 'input' ? theme.accent : theme.border; panel(ctx, rect, focused ? theme.panelSoft : theme.panelDeep, border); ctx.font = theme.font; ctx.fillStyle = focused ? theme.accentBright : theme.accent; ctx.fillText('>', rect.x + 16, rect.y + 36); ctx.fillStyle = theme.text; fitText(ctx, `${uiState.inputBuffer}${focused ? '_' : ''}`, rect.x + 40, rect.y + 36, rect.w - 56); }
function drawWrappedLog(ctx, rect, lines, theme, scrollOffset = 0) { const visible = getVisibleLogLines(ctx, lines, rect, theme, scrollOffset); ctx.fillStyle = theme.text; visible.forEach((line, index) => ctx.fillText(line, rect.x, rect.y + theme.lineHeight * (index + 1))); }
function drawLines(ctx, x, y, maxWidth, lines, theme) { ctx.font = theme.font; let offset = 0; for (const line of lines) { ctx.fillStyle = line === 'Context' || line === 'History' ? theme.accent : theme.text; fitText(ctx, line, x, y + offset, maxWidth); offset += theme.lineHeight; } }
function drawParagraph(ctx, text, x, y, maxWidth, theme) { ctx.font = theme.font; const lines = wrapText(ctx, text, maxWidth); lines.forEach((line, index) => ctx.fillText(line, x, y + theme.lineHeight * index)); return y + theme.lineHeight * lines.length; }
function wrapText(ctx, text, maxWidth) { if (!text) return ['']; const words = String(text).split(/\s+/); const lines = []; let current = ''; for (const word of words) { const candidate = current ? `${current} ${word}` : word; if (ctx.measureText(candidate).width <= maxWidth || !current) current = candidate; else { lines.push(current); current = word; } } lines.push(current); return lines; }
function panel(ctx, rect, fillStyle, strokeStyle) { ctx.fillStyle = fillStyle; ctx.strokeStyle = strokeStyle; ctx.lineWidth = 1; roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8); ctx.fill(); ctx.stroke(); }
function fitText(ctx, text, x, y, maxWidth, align = 'left') { const previousAlign = ctx.textAlign; ctx.textAlign = align; const value = String(text ?? ''); const drawX = align === 'center' ? x + maxWidth / 2 : align === 'right' ? x + maxWidth : x; if (ctx.measureText(value).width <= maxWidth) { ctx.fillText(value, drawX, y); ctx.textAlign = previousAlign; return; } let trimmed = value; while (trimmed.length > 1 && ctx.measureText(`${trimmed}...`).width > maxWidth) trimmed = trimmed.slice(0, -1); ctx.fillText(`${trimmed}...`, drawX, y); ctx.textAlign = previousAlign; }
function shouldShowFeedback(feedback) { const value = String(feedback ?? '').trim(); return Boolean(value && value !== 'Main menu opened.'); }
function roundedRect(ctx, x, y, width, height, radius) { const r = Math.min(radius, width / 2, height / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + width - r, y); ctx.quadraticCurveTo(x + width, y, x + width, y + r); ctx.lineTo(x + width, y + height - r); ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height); ctx.lineTo(x + r, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); }
