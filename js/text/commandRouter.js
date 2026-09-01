import {
    appendLog,
    createNewGameState,
    describeCharacter,
    describeEnemies,
    describeInventory,
    describeLocation,
    describeNpcs,
    describeStats,
    replaceState,
} from './gameState.js';
import { parseCommand } from './commands/parser.js';
import { describeControls } from './data/actionControls.js';
import { describeDatabases } from './data/databaseRegistry.js';
import { describeLegacyRecoveredData } from './data/legacyRecoveredData.js';
import { describeMap, describeMaps } from './data/maps.js';
import { describeNations, findNation } from './data/nations.js';
import { RACES } from './data/races.js';
import { describeActionResult } from './systems/actionResult.js';
import { describeAggroResult, evaluateAggroForGrid } from './systems/aggroEngine.js';
import { activateAbility, describeAbilities, reconcileAbilityActivation } from './systems/abilityEngine.js';
import { describeAtlas, describeCurrentGrid } from './systems/atlasEngine.js';
import {
    castSpell,
    describeBattle,
    isActiveBattle,
    performManualWeaponKataTechnique,
    performPlayerAttack,
    performPlayerRangedAttack,
    performWeaponSkill,
    startEncounter,
} from './systems/combatActionEngine.js';
import { createCreatorSession, handleCreatorInput, listStartingJobs, renderCreatorPrompt } from './systems/characterCreator.js';
import { startCombatEquipTransition, startCombatUnequipTransition } from './systems/combatLoadoutEngine.js';
import { describePopulationEncounterOptions, startPopulationEncounter } from './systems/populationEncounterEngine.js';
import { describeEquippableSources, equipItem, inspectItem, unequipItem } from './systems/equipmentEngine.js';
import {
    describeContainerContents,
    describeInventoryContainers,
    setHomeAccess,
    transferItemBetweenContainers,
} from './systems/inventoryEngine.js';
import {
    describeBestiary,
    describeEquipment,
    describeJobAbilities,
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
import { moveInDirection, stopTravel } from './systems/navigationEngine.js';
import { describeSkillProgression } from './systems/skillProgressionEngine.js';
import { describeTrainingServiceAtPoi, trainCapabilityAtPoi } from './systems/trainingServiceEngine.js';
import { configureWeaponKataSelection, describeWeaponKata } from './systems/weaponKataEngine.js';
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
import { advanceWorldTime } from './systems/worldTimeEngine.js';
import { describeSystemVersions, describeVersion } from './version.js';

const HELP_TEXT = [
    'Available commands:',
    '  help                 Show this command list.',
    '  create               Start prompt-based character creation.',
    '  create --power=<id> --ancestry=<id> --sex=<id> --discipline=<id> --name=<name>  Fast-create a character.',
    '  cancel               Cancel prompt-based character creation.',
    '  powers               List available starting powers.',
    '  ancestries           List available ancestries.',
    '  disciplines          List available starting disciplines.',
    '  discipline           Show unlocked discipline progression.',
    '  discipline <id>      Change active discipline to an unlocked discipline.',
    '  skills               Show current character-owned skill progression.',
    '  skill <id>           Inspect one character-owned skill.',
    '  look                 Describe the current location, coordinate, and contextual POIs.',
    '  here                 Show context-aware POIs/actions at the current grid.',
    '  poi                  Summarize seeded POIs by place.',
    '  pois [place]         List seeded POIs for current or named place.',
    '  talk [name]          Talk/interact with a POI at this coordinate and discover it.',
    '  shop [name]          Use shop action at this coordinate where supported.',
    '  buy <item>           Buy an item from the current shop POI into Inventory.',
    '  sell <item> [qty]    Sell one or more Inventory items to the current shop POI.',
    '  guild [name]         Use guild action at this coordinate where supported.',
    '  quest [name]         Use quest/commission action at this coordinate where supported.',
    '  companion [name]     Interact with a companion/recruitment contact where supported.',
    '  discovered           List discovered POIs in this place.',
    '  fastpoi <name>       Fast travel to a discovered POI in this same place.',
    '  exits                List known usable exits from the current place.',
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
    '  equipSources         Show accessible equipment source containers.',
    '  home enter|leave     Toggle home-storage access context for storage testing.',
    '  equipment            Show equipped gear slots and wardrobe containers.',
    '  spells               Show learned canonical spells and active abilities.',
    '  abilities            Show learned canonical spells, techniques, and utility abilities.',
    '  training             Show combat instruction available at the current trainer.',
    '  train <technique>    Learn an eligible technique from the current trainer.',
    '  invoke <ability>     Activate a canonical learned ability through the ability engine.',
    '  techniques           Show recovered weapon-technique source data.',
    '  disciplineabilities  Show bounded recovered discipline abilities and traits.',
    '  bestiary             Show recovered bestiary notes for the current place.',
    '  encounter <enemy>    Start a battle against a loaded enemy seed.',
    '  wildlife             Show trackable local wildlife populations.',
    '  hunt <wildlife>       Deliberately locate a passive/wary/territorial population encounter.',
    '  battle               Show the active battle state.',
    '  attack [target]      Perform a weapon-cadenced basic attack in battle.',
    '  ranged [target]      Perform a first-class ranged attack with equipped weapon/ammo.',
    '  kata [family]        Show configured proficiency-gated weapon kata slots.',
    '  kata set <family> <slot> <move>  Configure an unlocked kata slot outside combat.',
    '  kata use <move> [target]          Use a manual kata technique in combat.',
    '  technique <name>     Use the current TP-gated combat technique adapter.',
    '  cast <spell>         Use a learned spell in combat.',
    '  npcs                 List loaded NPCs.',
    '  enemies              List loaded enemies.',
    '  maps                 List known starter map records.',
    '  map <id>             Inspect a starter map record.',
    '  places               List known seeded places.',
    '  place [id/name]      Inspect current or named place.',
    '  atlas [id/name]      Show discovered place atlas grids.',
    '  grid                 Inspect current grid.',
    '  move <dir>           Move within the current place coordinate using n/ne/e/se/s/sw/w/nw.',
    '  stop                 Stop active travel or auto-run movement.',
    '  controls             Show resource bars, tick bar, keypad, and action groups.',
    '  recovered            Summarize useful data recovered from legacy research.',
    '  travel <destination> Start direct travel to a connected place.',
    '  wait [seconds]       Advance canonical fictional time and reconcile timed actions.',
    '  databases            List planned/seeded/implemented data registries.',
    '  version              Show product/schema/data version tracking.',
    '  systems              Show system version map.',
    '  tick                 Inspect live tick engine baseline.',
    '  inspect <target>     Inspect character, item, stats, skills, inventory, equipment, places, maps, or runtime diagnostics.',
    '  validate             Validate current game state.',
    '  log                  Show recent command history.',
    '  save                 Save the current local game state.',
    '  reset                Clear local save data and reload the page.',
].join('\n');

export function createCommandRouter(state, services = {}) {
    const saveGame = services.saveGame ?? (() => false);
    const clearSave = typeof services.clearSave === 'function' ? services.clearSave : null;
    const reload = services.reload ?? (() => globalThis.window?.location?.reload?.());
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

        switch (parsed.command) {
            case 'help': return HELP_TEXT;
            case 'create':
            case 'new':
                if (hasFastCreateArgs(parsed)) return describeCreateCharacter(state, parsed);
                creator = createCreatorSession();
                return renderCreatorPrompt(creator);
            case 'cancel': creator = null; return 'Character creation cancelled.';
            case 'powers': return describeNations();
            case 'ancestries': return describeAncestries();
            case 'disciplines': return describeDisciplines();
            case 'discipline': return parsed.args.length ? switchMainJob(state.player, parsed.args.join(' ')).message : describeJobProgression(state.player);
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
            case 'companion': return performPoiAction(state, 'companion', parsed.args.join(' '));
            case 'discovered': return describeDiscoveredPois(state);
            case 'fastpoi': return fastTravelToPoi(state, parsed.args.join(' '));
            case 'exits': return describeZoneFastTravelOptions(state);
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
            case 'home': return describeHomeCommand(state, parsed.args[0]);
            case 'equipment': return describeEquipment(state);
            case 'spells':
            case 'abilities': return describeAbilities(state);
            case 'invoke': return describeAbilityActivation(state, parsed.args.join(' '));
            case 'techniques': return describeWeaponSkills();
            case 'disciplineabilities': return describeJobAbilities(state);
            case 'bestiary': return describeBestiary(state);
            case 'encounter': return describeEncounterStart(state, parsed.args.join(' '));
            case 'wildlife': return describePopulationEncounterOptions(state);
            case 'hunt':
            case 'track': return describeActionResult(startPopulationEncounter(state, parsed.args.join(' ')));
            case 'battle': return describeBattle(state.activeBattle);
            case 'attack': return performPlayerAttack(state, parsed.args[0]);
            case 'ranged': return performPlayerRangedAttack(state, parsed.args[0]);
            case 'kata': return describeKataCommand(state, parsed.args);
            case 'training': return describeTrainingServiceAtPoi(state, state.activePoiId);
            case 'train': return describeActionResult(trainCapabilityAtPoi(state, parsed.args.join(' '), state.activePoiId));
            case 'technique': return performWeaponSkill(state, parsed.args.join(' ') || 'Weapon Technique');
            case 'cast': return castSpell(state, parsed.args[0] ?? 'Cure', parsed.args[1]);
            case 'npcs': return describeNpcs(state);
            case 'enemies': return describeEnemies(state);
            case 'maps': return describeMaps();
            case 'map': return describeMap(parsed.args.join(' '));
            case 'places': return describePlaces();
            case 'place': return describePlace(parsed.args.join(' ') || state.currentPlaceId);
            case 'atlas': return describeAtlas(state, parsed.args.join(' ') || state.currentPlaceId);
            case 'grid': return describeCurrentGrid(state);
            case 'move': return describeMove(state, parsed.args[0]);
            case 'stop': return stopTravel(state).message;
            case 'controls':
            case 'hud': return describeControls();
            case 'recovered': return describeLegacyRecoveredData();
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
            case 'reset':
                if (!clearSave) return 'Reset is unavailable in this command context.';
                clearSave();
                reload();
                return 'Resetting local save...';
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
    if (state.activeBattle?.phase === 'active') return describeActionResult(startCombatEquipTransition(state, itemQuery, { slot, fromContainerId }));
    return equipItem(state, itemQuery, { slot, fromContainerId });
}

function describeUnequipCommand(state, args) {
    const toIndex = args.findIndex((arg) => String(arg).toLowerCase() === 'to');
    const slot = args[0];
    const destinationContainerId = toIndex >= 0 ? args[toIndex + 1] : 'inventory';
    if (state.activeBattle?.phase === 'active') return describeActionResult(startCombatUnequipTransition(state, slot, destinationContainerId));
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

function describeHomeCommand(state, action = 'status') {
    const normalized = String(action).toLowerCase();
    if (['enter', 'in', 'on'].includes(normalized)) return setHomeAccess(state, true).message;
    if (['leave', 'exit', 'out', 'off'].includes(normalized)) return setHomeAccess(state, false).message;
    return describeInventoryContainers(state);
}

function describeEncounterStart(state, enemyQuery) {
    if (!enemyQuery) return 'Encounter what? Try `enemies` to see loaded enemy seeds.';
    const result = startEncounter(state, enemyQuery, { source: 'command' });
    return result.message;
}

function describeAbilityActivation(state, abilityQuery) {
    if (!abilityQuery) return 'Invoke what? Try `abilities` to see learned canonical abilities.';
    return describeActionResult(activateAbility(state, abilityQuery));
}

function hasFastCreateArgs(parsed) {
    return Object.keys(parsed.named).length > 0 || parsed.args.length > 0;
}

function describeCreateCharacter(state, parsed) {
    const powerQuery = parsed.named.power ?? parsed.args[0] ?? 'thornwall';
    const power = findNation(powerQuery);
    if (!power) return `Unknown starting power: ${powerQuery}. Try: powers`;

    const nextState = createNewGameState({
        nationId: power.id,
        raceId: parsed.named.ancestry ?? 'human',
        sex: parsed.named.sex,
        mainJobId: parsed.named.discipline ?? 'vanguard',
        name: parsed.named.name ?? 'Traveler',
    });

    replaceState(state, nextState);
    return describeCreatedCharacter(state);
}

function describeCreatedCharacter(state) {
    return [`Created ${state.player.identity.name}.`, describeCharacter(state), '', 'Starting maps:', ...state.player.progression.unlockedMaps.map((mapId) => `- ${mapId}`)].join('\n');
}

function describeAncestries() {
    return Object.values(RACES).map((ancestry, index) => `${index + 1}. ${ancestry.id} - ${ancestry.name}: ${ancestry.description}`).join('\n');
}

function describeDisciplines() {
    return listStartingJobs().map((discipline, index) => `${index + 1}. ${discipline.id} - ${discipline.name} (${discipline.abbreviation}): ${discipline.role}`).join('\n');
}

function describeMove(state, direction) {
    if (isActiveBattle(state.activeBattle)) return 'You cannot move while engaged in battle.';
    if (!direction) return 'Move where? Use n, ne, e, se, s, sw, w, or nw.';
    const result = moveInDirection(state, direction);
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
    if (!destination) return 'Travel where? Try `places` to see known destinations.';
    return describeActionResult(startTravel(state, destination));
}

function describeWait(state, tickEngine, secondsArg = '1') {
    const seconds = Math.max(1, Math.min(3600, Number.parseInt(secondsArg, 10) || 1));
    tickEngine.tick({ state, manual: true, seconds });
    const travelWasActive = Boolean(state.travel?.active);
    const travelResult = travelWasActive ? advanceTravel(state, seconds) : null;
    if (!travelWasActive) advanceWorldTime(state, seconds, { source: 'command.wait' });
    const abilityResult = reconcileAbilityActivation(state);
    const lines = [`Advanced ${seconds}s.`];
    if (travelResult?.message) lines.push(travelResult.message);
    if (abilityResult) lines.push(describeActionResult(abilityResult));
    if (travelResult?.completed) lines.push('', describeLocation(state));
    else if (state.travel?.active) lines.push(describeTravel(state));
    return lines.join('\n');
}

function inspectTarget(state, target = 'character', restArgs = []) {
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
        case 'abilities': return describeAbilities(state);
        case 'techniques': return describeWeaponSkills();
        case 'discipline':
        case 'progression': return describeJobProgression(state.player);
        case 'skills': return describeSkillProgression(state.player);
        case 'skill': return describeSkillProgression(state.player, restArgs[0]);
        case 'disciplineabilities': return describeJobAbilities(state);
        case 'bestiary': return describeBestiary(state);
        case 'battle': return describeBattle(state.activeBattle);
        case 'npcs':
        case 'npc': return describeNpcs(state);
        case 'enemies':
        case 'enemy': return describeEnemies(state);
        case 'powers': return describeNations();
        case 'ancestries': return describeAncestries();
        case 'disciplines': return describeDisciplines();
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
        case 'exits': return describeZoneFastTravelOptions(state);
        case 'place': return describeLocation(state);
        case 'atlas': return describeAtlas(state);
        case 'grid': return describeCurrentGrid(state);
        case 'travel': return describeTravel(state);
        case 'controls':
        case 'hud': return describeControls();
        case 'recovered': return describeLegacyRecoveredData();
        case 'state': return JSON.stringify(state, null, 2);
        case 'log': return describeLog(state);
        case 'version': return describeVersion();
        case 'systems': return describeSystemVersions();
        case 'databases':
        case 'db': return describeDatabases();
        default: return `Nothing to inspect for "${target}". Try: character, item, stats, skills, skill <id>, inventory, containers, equipment, equipSources, spells, techniques, discipline, abilities, bestiary, battle, npcs, enemies, powers, ancestries, disciplines, maps, here, pois, discovered, exits, place, atlas, grid, travel, controls, recovered, state, log, version, systems, databases.`;
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


function describeKataCommand(state, args = []) {
    const [mode, first, second, third] = args;
    if (!mode) return describeWeaponKata(state.player);
    if (String(mode).toLowerCase() === 'set') {
        if (!first || !second || !third) return 'Usage: kata set <family> <slot> <move>';
        return describeActionResult(configureWeaponKataSelection(state, first, second, third));
    }
    if (String(mode).toLowerCase() === 'use') {
        if (!first) return 'Usage: kata use <move> [target]';
        return performManualWeaponKataTechnique(state, first, second);
    }
    return describeWeaponKata(state.player, mode);
}
