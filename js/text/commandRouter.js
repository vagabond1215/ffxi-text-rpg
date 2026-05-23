import {
    appendLog,
    createNewGameState,
    describeCharacter,
    describeEnemies,
    describeInventory,
    describeLocation,
    describeNpcs,
    describeStats,
    moveWithinCurrentPlace,
    replaceState,
} from './gameState.js';
import { parseCommand } from './commands/parser.js';
import { describeControls, NAV_KEYPAD } from './data/actionControls.js';
import { describeDatabases } from './data/databaseRegistry.js';
import { describeLegacyRecoveredData } from './data/legacyRecoveredData.js';
import { describeMap, describeMaps } from './data/maps.js';
import { describeNations, findNation } from './data/nations.js';
import { RACES } from './data/races.js';
import { describeAggroResult, evaluateAggroForGrid } from './systems/aggroEngine.js';
import { describeAtlas, describeCurrentGrid } from './systems/atlasEngine.js';
import {
    castSpell,
    describeBattle,
    isActiveBattle,
    performPlayerAttack,
    performWeaponSkill,
    startEncounter,
} from './systems/combatActionEngine.js';
import { createCreatorSession, handleCreatorInput, listStartingJobs, renderCreatorPrompt } from './systems/characterCreator.js';
import { describeEquippableSources, equipItem, inspectItem, unequipItem } from './systems/equipmentEngine.js';
import { isFfxiSlashCommand, routeFfxiSlashCommand } from './systems/ffxiCommandAdapter.js';
import {
    describeContainerContents,
    describeInventoryContainers,
    setMogHouseAccess,
    transferItemBetweenContainers,
} from './systems/inventoryEngine.js';
import {
    describeBestiary,
    describeEquipment,
    describeJobAbilities,
    describeSpells,
    describeWeaponSkills,
} from './systems/menuDescriptions.js';
import {
    describeDiscoveredPois,
    describeCurrentPois,
    describePlacePois,
    describePoiSummary,
    describeZoneFastTravelOptions,
    fastTravelToPoi,
    performPoiAction,
    talkAtCurrentGrid,
} from './systems/poiEngine.js';
import { describeJobProgression, switchMainJob } from './systems/progressionEngine.js';
import { describeSkillProgression } from './systems/skillProgressionEngine.js';
import { buyFromCurrentShop, sellToCurrentShop } from './systems/shopEngine.js';
import {
    describeHpMpGradeComparisons,
    describeInferredJobHpMpGrades,
    describeJobStatGrades,
    describeRaceStatGrades,
    describeStatFormulaOverview,
} from './systems/statFormulaDescriptions.js';
import { validateGameState } from './systems/validation.js';
import { createTickEngine } from './systems/tickEngine.js';
import {
    advanceTravel,
    describePlace,
    describePlaces,
    describeTravel,
    startTravel,
} from './systems/travelEngine.js';
import { describeSystemVersions, describeVersion } from './version.js';

const HELP_TEXT = [
    'Available commands:',
    '  help                 Show this command list.',
    '  create               Start prompt-based character creation.',
    '  create --nation=<id> --race=<id> --sex=<id> --job=<id> --name=<name>  Fast-create a character.',
    '  cancel               Cancel prompt-based character creation.',
    '  nations              List available starting nations.',
    '  races                List available races.',
    '  jobs                 List available starting jobs.',
    '  job                  Show unlocked job progression.',
    '  job <id>             Change main job to an unlocked job.',
    '  skills               Show current character-owned skill progression.',
    '  skill <id>           Inspect one character-owned skill.',
    '  look                 Describe the current location, grid, and contextual POIs.',
    '  here                 Show context-aware POIs/actions at the current grid.',
    '  poi                  Summarize seeded POIs by zone.',
    '  pois [zone]          List seeded POIs for current or named zone.',
    '  talk [name]          Talk/interact with a POI at this grid and discover it.',
    '  shop [name]          Use shop action at this grid where supported.',
    '  buy <item>           Buy an item from the current shop POI into Inventory.',
    '  sell <item>          Placeholder for future sell flow.',
    '  guild [name]         Use guild action at this grid where supported.',
    '  quest [name]         Use quest/mission action at this grid where supported.',
    '  discovered           List discovered POIs in this zone.',
    '  fastpoi <name>       Fast travel to a discovered POI in this same zone.',
    '  zonefast             List known usable zone exits from current zone.',
    '  character            Show the current character summary.',
    '  stats                Show attributes and derived combat stats.',
    '  inventory            Show carried items.',
    '  item <query>          Inspect an accessible item template/runtime record.',
    '  inspect item <query>  Inspect an accessible item template/runtime record.',
    '  containers           Show all inventory/storage containers and access state.',
    '  container <id>       Inspect a specific container.',
    '  transfer <item> from <source> to <destination>  Move items between containers.',
    '  equip <item> [to slot] [from container]          Equip gear from Inventory/Wardrobe.',
    '  unequip <slot> [to container]                    Unequip gear into a container.',
    '  equipSources       Show accessible equipment source containers.',
    '  moghouse enter|leave Toggle Mog House access context for storage testing.',
    '  equipment            Show equipped gear slots and wardrobe containers.',
    '  spells               Show known spell placeholder data.',
    '  weaponSkills         Show recovered weapon skill source data.',
    '  jobAbilities         Show recovered job abilities and traits for the current job.',
    '  bestiary             Show recovered bestiary notes for the current zone.',
    '  encounter <enemy>    Start a battle against a loaded enemy seed.',
    '  battle               Show the active battle state.',
    '  attack [target]      Perform a basic attack in battle.',
    '  weaponSkill <name>   Use a TP-gated placeholder weapon skill.',
    '  cast <spell>         Cast a simple placeholder spell in battle.',
    '  npcs                 List loaded NPCs.',
    '  enemies              List loaded enemies.',
    '  maps                 List known starter map records.',
    '  map <id>             Inspect a starter map record.',
    '  zones                List known seeded places.',
    '  zone [id/name]       Inspect current or named zone.',
    '  atlas [id/name]      Show discovered zone atlas grids.',
    '  grid                 Inspect current grid.',
    '  move <dir>           Move within the current zone grid using n/ne/e/se/s/sw/w/nw.',
    '  controls             Show resource bars, tick bar, keypad, and action groups.',
    '  recovered            Summarize useful data recovered from stale branches.',
    '  /macrohelp           Show FFXI-style macro/text command reference.',
    '  /ma /ja /ws /item    Accept FFXI-style action command forms.',
    '  /equip /equipset     Accept FFXI-style equipment command forms as stubs.',
    '  travel <destination> Start direct travel to a connected zone.',
    '  wait [seconds]       Advance time manually for travel/tick testing.',
    '  databases            List planned/seeded/implemented data registries.',
    '  version              Show app/save/data version tracking.',
    '  systems              Show system version map.',
    '  tick                 Inspect live tick engine baseline.',
    '  inspect <target>     Inspect player, item, stats, skills, skill <id>, inventory, containers, equipment, npcs, enemies, state, or log.',
    '  validate             Validate current game state.',
    '  log                  Show recent command history.',
    '  save                 Save the current local game state.',
    '  reset                Clear local save data and reload the page.',
].join('\n');

export function createCommandRouter(state, services = {}) {
    const saveGame = services.saveGame ?? (() => false);
    const clearSave = services.clearSave ?? (() => window.localStorage?.removeItem('ffxiTextRpgSave'));
    const reload = services.reload ?? (() => window.location.reload());
    const tickEngine = services.tickEngine ?? createTickEngine();
    let creator = null;

    return function routeCommand(rawCommand) {
        const parsed = parseCommand(rawCommand);
        if (!parsed.command) return '';

        appendLog(state, `> ${parsed.input}`);

        if (creator && !['cancel', 'help'].includes(parsed.command)) {
            const result = handleCreatorInput(creator, parsed.input);
            if (result.restart) creator = result.creator;
            if (result.confirmed) {
                const nextState = createNewGameState(result.answers);
                replaceState(state, nextState);
                creator = null;
                return describeCreatedCharacter(state);
            }
            return result.message;
        }

        if (isFfxiSlashCommand(parsed)) return routeFfxiSlashCommand(state, parsed);

        switch (parsed.command) {
            case 'help': return HELP_TEXT;
            case 'create':
            case 'new':
                if (hasFastCreateArgs(parsed)) return describeCreateCharacter(state, parsed);
                creator = createCreatorSession();
                return renderCreatorPrompt(creator);
            case 'cancel': creator = null; return 'Character creation cancelled.';
            case 'nations': return describeNations();
            case 'races': return describeRaces();
            case 'jobs': return describeJobs();
            case 'job': return parsed.args.length ? switchMainJob(state.player, parsed.args.join(' ')).message : describeJobProgression(state.player);
            case 'skills': return describeSkillProgression(state.player);
            case 'skill': return describeSkillProgression(state.player, parsed.args[0]);
            case 'statformula': return describeStatFormulaOverview();
            case 'racegrades': return describeRaceStatGrades();
            case 'jobgrades': return describeJobStatGrades();
            case 'hpmpgrades': return describeInferredJobHpMpGrades();
            case 'hpmpcompare': return describeHpMpGradeComparisons();
            case 'look': return describeLocation(state);
            case 'here': return describeCurrentPois(state);
            case 'poi': return describePoiSummary();
            case 'pois': return describePlacePois(parsed.args.join(' ') || state.currentPlaceId);
            case 'talk': return talkAtCurrentGrid(state, parsed.args.join(' '));
            case 'shop': return performPoiAction(state, 'shop', parsed.args.join(' '));
            case 'buy': return buyFromCurrentShop(state, parsed.args.join(' '));
            case 'sell': return sellToCurrentShop(state, parsed.args.join(' '));
            case 'guild': return performPoiAction(state, 'guild', parsed.args.join(' '));
            case 'quest': return performPoiAction(state, 'quest', parsed.args.join(' '));
            case 'storage': return performPoiAction(state, 'storage', parsed.args.join(' '));
            case 'trust': return performPoiAction(state, 'trust', parsed.args.join(' '));
            case 'discovered': return describeDiscoveredPois(state);
            case 'fastpoi': return fastTravelToPoi(state, parsed.args.join(' '));
            case 'zonefast': return describeZoneFastTravelOptions(state);
            case 'character': return describeCharacter(state);
            case 'stats': return describeStats(state);
            case 'inventory':
            case 'items': return describeInventory(state);
            case 'item': return inspectItem(state, parsed.args.join(' '));
            case 'containers': return describeInventoryContainers(state);
            case 'container': return describeContainerContents(state, parsed.args[0] ?? 'inventory');
            case 'transfer': return describeTransferCommand(state, parsed.args);
            case 'equip': return describeEquipCommand(state, parsed.args);
            case 'unequip': return describeUnequipCommand(state, parsed.args);
            case 'equipsources': return describeEquippableSources(state);
            case 'moghouse': return describeMogHouseCommand(state, parsed.args[0]);
            case 'equipment': return describeEquipment(state);
            case 'spells':
            case 'magic': return describeSpells(state);
            case 'weaponskills':
            case 'ws': return describeWeaponSkills();
            case 'jobabilities':
            case 'abilities':
            case 'ja': return describeJobAbilities(state);
            case 'bestiary': return describeBestiary(state);
            case 'encounter': return describeEncounterStart(state, parsed.args.join(' '));
            case 'battle': return describeBattle(state.activeBattle);
            case 'attack': return performPlayerAttack(state, parsed.args[0]);
            case 'weaponskill': return performWeaponSkill(state, parsed.args.join(' ') || 'Weapon Skill');
            case 'cast': return castSpell(state, parsed.args[0] ?? 'Cure', parsed.args[1]);
            case 'npcs': return describeNpcs(state);
            case 'enemies': return describeEnemies(state);
            case 'maps': return describeMaps();
            case 'map': return describeMap(parsed.args.join(' '));
            case 'zones':
            case 'places': return describePlaces();
            case 'zone':
            case 'place': return describePlace(parsed.args.join(' ') || state.currentPlaceId);
            case 'atlas': return describeAtlas(state, parsed.args.join(' ') || state.currentPlaceId);
            case 'grid': return describeCurrentGrid(state);
            case 'move': return describeMove(state, parsed.args[0]);
            case 'controls':
            case 'hud': return describeControls();
            case 'recovered':
            case 'legacy': return describeLegacyRecoveredData();
            case 'travel': return describeTravelStart(state, parsed.args.join(' '));
            case 'wait': return describeWait(state, tickEngine, parsed.args[0]);
            case 'databases':
            case 'db': return describeDatabases();
            case 'version': return describeVersion();
            case 'systems': return describeSystemVersions();
            case 'tick': return tickEngine.describe();
            case 'inspect': return inspectTarget(state, parsed.args[0], parsed.args.slice(1));
            case 'validate': return describeValidation(state);
            case 'log': return describeLog(state, parsed.args[0]);
            case 'save': return saveGame(state) ? 'Game saved locally.' : 'Save failed. Check console for validation details.';
            case 'reset': clearSave(); reload(); return 'Resetting local save...';
            default: return `Unknown command: ${parsed.input}\nType "help" for available commands.`;
        }
    };
}

function describeEquipCommand(state, args) {
    const toIndex = args.findIndex((arg) => String(arg).toLowerCase() === 'to');
    const fromIndex = args.findIndex((arg) => String(arg).toLowerCase() === 'from');
    const splitIndex = [toIndex, fromIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? args.length;
    const itemQuery = args.slice(0, splitIndex).join(' ');
    const slot = toIndex >= 0 ? args[toIndex + 1] : null;
    const fromContainerId = fromIndex >= 0 ? args[fromIndex + 1] : null;
    return equipItem(state, itemQuery, { slot, fromContainerId });
}

function describeUnequipCommand(state, args) {
    const toIndex = args.findIndex((arg) => String(arg).toLowerCase() === 'to');
    const slot = args[0];
    const destinationContainerId = toIndex >= 0 ? args[toIndex + 1] : 'inventory';
    return unequipItem(state, slot, destinationContainerId);
}

function describeTransferCommand(state, args) {
    const fromIndex = args.findIndex((arg) => String(arg).toLowerCase() === 'from');
    const toIndex = args.findIndex((arg) => String(arg).toLowerCase() === 'to');
    if (fromIndex <= 0 || toIndex <= fromIndex + 1 || toIndex >= args.length - 1) return 'Usage: transfer <item> from <sourceContainer> to <destinationContainer>';
    const itemQuery = args.slice(0, fromIndex).join(' ');
    const fromContainer = args[fromIndex + 1];
    const toContainer = args[toIndex + 1];
    return transferItemBetweenContainers(state, itemQuery, fromContainer, toContainer);
}

function describeMogHouseCommand(state, action = 'status') {
    const normalized = String(action).toLowerCase();
    if (['enter', 'in', 'on'].includes(normalized)) return setMogHouseAccess(state, true).message;
    if (['leave', 'exit', 'out', 'off'].includes(normalized)) return setMogHouseAccess(state, false).message;
    return describeInventoryContainers(state);
}

function describeEncounterStart(state, enemyQuery) {
    if (!enemyQuery) return 'Encounter what? Try `enemies` to see loaded enemy seeds.';
    const result = startEncounter(state, enemyQuery, { source: 'command' });
    return result.message;
}

function hasFastCreateArgs(parsed) {
    return Object.keys(parsed.named).length > 0 || parsed.args.length > 0;
}

function describeCreateCharacter(state, parsed) {
    const nationQuery = parsed.named.nation ?? parsed.args[0] ?? 'sandoria';
    const nation = findNation(nationQuery);
    if (!nation) return `Unknown nation: ${nationQuery}. Try: nations`;

    const nextState = createNewGameState({
        nationId: nation.id,
        raceId: parsed.named.race ?? 'hume',
        sex: parsed.named.sex,
        mainJobId: parsed.named.job ?? parsed.named.mainJob ?? 'warrior',
        name: parsed.named.name ?? 'Adventurer',
    });

    replaceState(state, nextState);
    return describeCreatedCharacter(state);
}

function describeCreatedCharacter(state) {
    return [`Created ${state.player.identity.name}.`, describeCharacter(state), '', 'Starting maps:', ...state.player.progression.unlockedMaps.map((mapId) => `- ${mapId}`)].join('\n');
}

function describeRaces() {
    return Object.values(RACES).map((race, index) => `${index + 1}. ${race.id} - ${race.name}: ${race.description}`).join('\n');
}

function describeJobs() {
    return listStartingJobs().map((job, index) => `${index + 1}. ${job.id} - ${job.name} (${job.abbreviation}): ${job.role}`).join('\n');
}

function describeMove(state, direction) {
    if (isActiveBattle(state.activeBattle)) return 'You cannot move while engaged in battle.';
    if (!direction) return 'Move where? Use n, ne, e, se, s, sw, w, or nw.';
    const nav = NAV_KEYPAD.find((item) => item.id === String(direction).toLowerCase());
    if (!nav) return `Unknown direction: ${direction}. Use n, ne, e, se, s, sw, w, or nw.`;
    const result = moveWithinCurrentPlace(state, nav);
    if (!result.ok) return result.reason;
    const aggro = evaluateAggroForGrid(state, { travelMode: 'foot' });
    const lines = [result.message, '', describeCurrentGrid(state), '', describeAggroResult(aggro)];
    if (aggro.triggered) {
        const encounter = startEncounter(state, aggro.encounter.enemyId, {
            source: 'aggro',
            reason: `${aggro.encounter.enemyId} noticed you by ${aggro.encounter.aggroTypes.join('/')}`,
        });
        lines.push('', encounter.message);
    }
    return lines.join('\n');
}

function describeTravelStart(state, destination) {
    if (isActiveBattle(state.activeBattle)) return 'You cannot travel while engaged in battle.';
    if (!destination) return 'Travel where? Try `zones` to see known places.';
    const result = startTravel(state, destination);
    return result.ok ? result.message : result.reason;
}

function describeWait(state, tickEngine, secondsArg = '1') {
    const seconds = Math.max(1, Math.min(3600, Number.parseInt(secondsArg, 10) || 1));
    tickEngine.tick({ state, manual: true, seconds });
    const travelResult = advanceTravel(state, seconds);
    if (travelResult.completed) return [`Advanced ${seconds}s.`, travelResult.message, '', describeLocation(state)].join('\n');
    return [`Advanced ${seconds}s.`, describeTravel(state)].join('\n');
}

function inspectTarget(state, target = 'player', restArgs = []) {
    switch (String(target).toLowerCase()) {
        case 'item': return inspectItem(state, restArgs.join(' '));
        case 'player':
        case 'character':
        case 'char': return describeCharacter(state);
        case 'stats': return describeStats(state);
        case 'inventory':
        case 'inv':
        case 'items': return describeInventory(state);
        case 'containers': return describeInventoryContainers(state);
        case 'container': return describeContainerContents(state, 'inventory');
        case 'equipsources': return describeEquippableSources(state);
        case 'equipment':
        case 'equip': return describeEquipment(state);
        case 'spells':
        case 'magic': return describeSpells(state);
        case 'weaponskills':
        case 'ws': return describeWeaponSkills();
        case 'job':
        case 'progression': return describeJobProgression(state.player);
        case 'skills': return describeSkillProgression(state.player);
        case 'skill': return describeSkillProgression(state.player, restArgs[0]);
        case 'jobabilities':
        case 'abilities':
        case 'ja': return describeJobAbilities(state);
        case 'bestiary': return describeBestiary(state);
        case 'battle': return describeBattle(state.activeBattle);
        case 'npcs':
        case 'npc': return describeNpcs(state);
        case 'enemies':
        case 'enemy': return describeEnemies(state);
        case 'nations': return describeNations();
        case 'races': return describeRaces();
        case 'jobs': return describeJobs();
        case 'statformula': return describeStatFormulaOverview();
        case 'racegrades': return describeRaceStatGrades();
        case 'jobgrades': return describeJobStatGrades();
        case 'hpmpgrades': return describeInferredJobHpMpGrades();
        case 'hpmpcompare': return describeHpMpGradeComparisons();
        case 'maps': return describeMaps();
        case 'here': return describeCurrentPois(state);
        case 'poi':
        case 'pois': return describePlacePois(state.currentPlaceId);
        case 'discovered': return describeDiscoveredPois(state);
        case 'zonefast': return describeZoneFastTravelOptions(state);
        case 'zone':
        case 'place': return describeLocation(state);
        case 'atlas': return describeAtlas(state);
        case 'grid': return describeCurrentGrid(state);
        case 'travel': return describeTravel(state);
        case 'controls':
        case 'hud': return describeControls();
        case 'recovered':
        case 'legacy': return describeLegacyRecoveredData();
        case 'state': return JSON.stringify(state, null, 2);
        case 'log': return describeLog(state);
        case 'version': return describeVersion();
        case 'systems': return describeSystemVersions();
        case 'databases':
        case 'db': return describeDatabases();
        default: return `Nothing to inspect for "${target}". Try: player, item, stats, skills, skill <id>, inventory, containers, equipment, equipSources, spells, weaponSkills, job, jobAbilities, bestiary, battle, npcs, enemies, nations, races, jobs, maps, here, pois, discovered, zonefast, zone, atlas, grid, travel, controls, recovered, state, log, version, systems, databases.`;
    }
}

function describeValidation(state) {
    const issues = validateGameState(state);
    if (!issues.length) return 'Game state is valid.';
    return ['Game state has validation issues:', ...issues.map((issue) => `- ${issue}`)].join('\n');
}

function describeLog(state, limitArg = '20') {
    if (!state.log.length) return 'No command history yet.';
    const limit = Math.max(1, Math.min(100, Number.parseInt(limitArg, 10) || 20));
    return state.log.slice(-limit).map((item) => `${item.at} ${item.entry}`).join('\n');
}
