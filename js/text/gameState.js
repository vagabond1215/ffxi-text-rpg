import { getNation } from './data/nations.js';
import { getStartingDisciplineKit } from './data/startingDisciplineKits.js';
import { createPlayerCharacter } from './entities/entityFactory.js';
import { createSeedEnemies, createSeedNpcs } from './data/seedEntities.js';
import { describeCoordinate, normalizePositionForPlace } from './data/coordinates.js';
import { getPlace } from './data/places.js';
import { createAbilityRuntimeState } from './systems/abilityEngine.js';
import { createAtlasState, describeCurrentGrid, setPositionAndDiscover } from './systems/atlasEngine.js';
import { createCommitmentState } from './systems/commitmentEngine.js';
import { createCultivationState } from './systems/cultivationEngine.js';
import { createEcologyState } from './systems/ecologyEngine.js';
import { addItemToContainer } from './systems/inventoryEngine.js';
import { createPartyState } from './systems/partyEngine.js';
import { describeCurrentPois } from './systems/poiEngine.js';
import { createLocalKnowledgeState, getPlayerFacingNpcName } from './systems/localKnowledgeEngine.js';
import { createProjectState } from './systems/projectEngine.js';
import { createRelationshipState } from './systems/relationshipEngine.js';
import { createResourceOpportunityState } from './systems/resourceOpportunityEngine.js';
import { createSemanticEventState } from './systems/semanticEventEngine.js';
import { createSimulationControlState } from './systems/simulationControlEngine.js';
import { createTimedTaskState } from './systems/timedTaskEngine.js';
import { describePlace } from './systems/travelEngine.js';
import { moveInDirection } from './systems/navigationEngine.js';
import { calculateCombatProfile } from './systems/statEngine.js';
import { createWorldTimeState } from './systems/worldTimeEngine.js';
import { VERSION } from './version.js';

export const DEFAULT_START_WORLD_TIME_SECONDS = 8 * 60 * 60;

export function createInitialState() { return createNewGameState(); }

export function createNewGameState(options = {}) {
    const nation = getNation(options.nationId);
    const startPlace = getPlace(options.startingPlaceId ?? nation.startingPlaceId);
    const startCoordinate = normalizePositionForPlace(startPlace, startPlace.coordinateSystem.start);
    const startWorldTimeSeconds = options.startWorldTimeSeconds ?? DEFAULT_START_WORLD_TIME_SECONDS;
    const mainJobId = options.mainJobId ?? 'vanguard';
    const player = createPlayerCharacter({
        name: options.name ?? 'Traveler',
        raceId: options.raceId ?? 'human',
        sex: options.sex,
        mainJobId,
        level: 1,
        nation: nation.name,
        startingCity: startPlace.name,
        keyItems: [...nation.startingKeyItems],
        progression: {
            unlockedMaps: [...nation.startingMapIds],
            unlockedHomePoints: [startPlace.id],
        },
    });
    if (options.includeStartingDisciplineKit === true) grantStartingDisciplineKit(player, mainJobId);

    return {
        version: VERSION.gameState,
        worldTime: createWorldTimeState({ totalSeconds: startWorldTimeSeconds }),
        simulation: createSimulationControlState({
            paused: options.simulationPaused ?? false,
            speedMultiplier: options.simulationSpeedMultiplier ?? 1,
        }),
        tasks: createTimedTaskState(),
        abilities: createAbilityRuntimeState(),
        party: createPartyState(),
        projects: createProjectState(),
        commitments: createCommitmentState(),
        relationships: createRelationshipState(),
        resourceOpportunities: createResourceOpportunityState(),
        ecology: createEcologyState(),
        cultivation: createCultivationState({ homePlaceId: player.progression.unlockedHomePoints[0] }),
        currentPlaceId: startPlace.id,
        location: startPlace.name,
        position: startCoordinate,
        atlas: createAtlasState(startPlace.id, startCoordinate, { worldTimeSeconds: startWorldTimeSeconds }),
        localKnowledge: createLocalKnowledgeState(startPlace.id, { worldTimeSeconds: startWorldTimeSeconds }),
        travel: null,
        player,
        npcs: createSeedNpcs(),
        enemies: createSeedEnemies(),
        inventory: player.inventory,
        flags: {},
        log: [],
        events: createSemanticEventState(),
        combatSequence: 0,
        activeBattle: null,
    };
}

export function replaceState(target, nextState) {
    for (const key of Object.keys(target)) delete target[key];
    Object.assign(target, nextState);
    return target;
}

export function describeLocation(state) {
    const currentPlaceId = state.currentPlaceId ?? 'thornwall-southgate';
    const npcsHere = (state.npcs ?? [])
        .filter((npc) => npc.identity.locationId === currentPlaceId)
        .map((npc) => `- ${getPlayerFacingNpcName(state, npc)}`);

    return [
        describePlace(currentPlaceId),
        '',
        describeCurrentGrid(state),
        '',
        describeCurrentPois(state),
        '',
        'Visible NPCs:',
        ...(npcsHere.length ? npcsHere : ['- None']),
    ].join('\n');
}

export function moveWithinCurrentPlace(state, delta) {
    if (delta?.id || delta?.direction) return moveInDirection(state, delta.id ?? delta.direction);
    const place = getPlace(state.currentPlaceId);
    if (!place) return { ok: false, reason: `Unknown place: ${state.currentPlaceId}` };

    const current = state.position ?? { placeId: place.id, ...place.coordinateSystem.start };
    const next = { x: current.x + delta.dx, y: current.y + delta.dy };
    const result = setPositionAndDiscover(state, place.id, next);
    return result.ok ? { ok: true, place, coordinate: next, message: `Moved within ${place.name}.` } : result;
}

export function describeCharacter(state) {
    const player = state.player;
    const combat = calculateCombatProfile(player);
    const identity = player.identity;
    const jobs = player.jobs;

    return [
        `${identity.name}`,
        `Ancestry: ${identity.raceName} (${identity.sex})`,
        `Home power: ${identity.nation}`,
        `Title: ${identity.title}`,
        `Discipline: ${jobs.mainJobName} Lv.${jobs.level}${jobs.supportJobName ? ` / ${jobs.supportJobName} Lv.${jobs.supportLevel}` : ''}`,
        `HP: ${player.resources.hp}/${combat.resources.maxHp}`,
        `MP: ${player.resources.mp}/${combat.resources.maxMp}`,
        `TP: ${player.resources.tp}/${combat.resources.maxTp}`,
        `Gil: ${player.wallet.gil}`,
        `Location: ${state.location}`,
    ].join('\n');
}

export function describeStats(state) {
    const combat = calculateCombatProfile(state.player);
    const attrs = combat.attributes;
    const derived = combat.derived;
    return [
        'Attributes:',
        `STR ${attrs.str}  DEX ${attrs.dex}  VIT ${attrs.vit}  AGI ${attrs.agi}`,
        `INT ${attrs.int}  MND ${attrs.mnd}  CHR ${attrs.chr}`,
        '',
        'Derived:',
        `Attack ${derived.attack}  Defense ${derived.defense}`,
        `Accuracy ${derived.accuracy}  Evasion ${derived.evasion}`,
        `Magic Attack ${derived.magicAttack}  Magic Accuracy ${derived.magicAccuracy}`,
        `Magic Defense ${derived.magicDefense}  Magic Evasion ${derived.magicEvasion}`,
    ].join('\n');
}

export function describeNpcs(state) {
    if (!state.npcs?.length) return 'No NPCs are currently loaded.';
    return state.npcs.map((npc) => [
        `${npc.identity.name}${npc.identity.title ? `, ${npc.identity.title}` : ''}`,
        `  Disposition: ${npc.disposition}`,
        `  Services: ${npc.services.length ? npc.services.join(', ') : 'none'}`,
    ].join('\n')).join('\n\n');
}

export function describeEnemies(state) {
    if (!state.enemies?.length) return 'No enemies are currently loaded.';
    return state.enemies.map((enemy) => {
        const combat = calculateCombatProfile(enemy);
        return `${enemy.identity.name} Lv.${enemy.level} (${enemy.identity.family}) HP ${enemy.resources.hp}/${combat.resources.maxHp}`;
    }).join('\n');
}

export function describeInventory(state) {
    const inventory = state.player?.inventory ?? state.inventory ?? [];
    if (!inventory.length) return 'Inventory is empty.';
    return inventory.map((item, index) => `${index + 1}. ${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`).join('\n');
}

export function appendLog(state, entry) {
    state.log.push({ at: new Date().toISOString(), entry });
    if (state.log.length > 100) state.log.splice(0, state.log.length - 100);
}

function grantStartingDisciplineKit(player, mainJobId) {
    const kit = getStartingDisciplineKit(mainJobId);
    for (const item of kit.items) {
        const stored = addItemToContainer(player.inventoryState, 'inventory', item);
        if (!stored.ok) throw new Error(`Unable to grant ${kit.disciplineId} starting equipment: ${stored.reason}`);
    }
}