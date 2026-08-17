import { DIRECTION_ARROWS, DIRECTION_ORDER, describeCoordinate } from '../data/coordinates.js';
import { getContextualPois } from '../data/pointsOfInterest.js';
import { getPlace } from '../data/places.js';
import { listAbilityAvailability } from '../systems/abilityEngine.js';
import { getLatestDaySummary } from '../systems/dayCycleEngine.js';
import {
    getNavigationMode,
    listLocalityDestinations,
    listLocalityPoints,
} from '../systems/localityEngine.js';
import { canMoveDirection } from '../systems/navigationEngine.js';
import { listActiveCompanions, listRecruitableCompanions, listRecruitedCompanions } from '../systems/partyEngine.js';
import { decoratePlayerOpportunityModel } from '../systems/playerContinuityEngine.js';
import { createPlayerExperienceModel } from '../systems/playerExperienceEngine.js';
import { createPlayerInformationModel } from '../systems/playerInformationEngine.js';
import { createPlayerOpportunityModel } from '../systems/playerOpportunityEngine.js';
import { createSettlementServiceBoard } from '../systems/settlementServiceBoardEngine.js';
import { calculateCombatProfile } from '../systems/statEngine.js';
import { getTimedTaskProgress, listTimedTasks } from '../systems/timedTaskEngine.js';
import { createTransportServiceBoard } from '../systems/transportServiceBoardEngine.js';
import { describeWorldTime, ensureWorldTimeState } from '../systems/worldTimeEngine.js';
import { createMinimapModel } from './minimapModel.js';

const POI_ACTION_LABELS = Object.freeze({
    shop: 'Browse',
    guild: 'Guild',
    quest: 'Commission',
    storage: 'Storage',
    companion: 'Companion',
    travel: 'Travel Desk',
    talk: 'Talk',
});

const LOCALITY_ACTION_PRIORITY = Object.freeze(['shop', 'guild', 'quest', 'storage', 'companion', 'travel', 'talk']);

export function createGameViewModel(state, uiState = {}) {
    if (!state?.player) throw new Error('Game view model requires player state.');
    const place = getPlace(state.currentPlaceId);
    const combat = calculateCombatProfile(state.player);
    const navigationMode = getNavigationMode(state);
    const nearbySource = navigationMode === 'locality'
        ? listLocalityPoints(state, { limit: 8 })
        : getContextualPois(state);
    const nearby = nearbySource.map(toNearbyRecord);
    const activity = createActivityModel(state);
    const spellbook = createSpellbookModel(state);
    const party = createPartyModel(state);
    const guidance = createPlayerExperienceModel(state);
    const opportunities = decoratePlayerOpportunityModel(state, createPlayerOpportunityModel(state));
    const information = createPlayerInformationModel(state, { query: uiState.informationQuery ?? '' });
    const transportDesk = navigationMode === 'locality'
        ? createTransportServiceBoard(state)
        : Object.freeze({ version: 1, placeId: state.currentPlaceId, placeName: place?.name ?? state.location ?? '', entries: Object.freeze([]) });
    const settlementServices = navigationMode === 'locality'
        ? createSettlementServiceBoard(state)
        : createSettlementServiceBoard(null);
    const coordinateLabel = navigationMode === 'locality' ? 'Named locality' : describeCoordinate(state.position);

    return Object.freeze({
        header: Object.freeze({
            placeId: place?.id ?? state.currentPlaceId ?? null,
            placeName: place?.name ?? state.location ?? 'Unknown place',
            region: place?.region ?? '',
            coordinate: coordinateLabel,
            worldTime: describeWorldTime(ensureWorldTimeState(state)),
            paused: Boolean(state.simulation?.paused),
            speedMultiplier: state.simulation?.speedMultiplier ?? 1,
        }),
        character: createCharacterModel(state.player, combat, activity),
        scene: Object.freeze({
            title: place?.name ?? state.location ?? 'Unknown place',
            region: place?.region ?? '',
            type: place?.type ?? '',
            dangerLevel: place?.dangerLevel ?? 0,
            coordinate: coordinateLabel,
            description: describeScene(place, guidance),
            nearby: Object.freeze(nearby),
            nearbyTotal: navigationMode === 'locality' ? listLocalityPoints(state, { limit: 100 }).length : nearby.length,
            recent: Object.freeze(createRecentSceneLines(uiState.outputLines ?? [])),
        }),
        navigation: Object.freeze({
            mode: navigationMode,
            destinations: Object.freeze(navigationMode === 'locality' ? listLocalityDestinations(state) : []),
        }),
        map: navigationMode === 'exploration' ? createMinimapModel(state) : null,
        movement: Object.freeze(navigationMode === 'exploration' ? createMovementActions(state) : []),
        contextualActions: Object.freeze(createContextualActions(state, nearby, opportunities, transportDesk)),
        transportDesk,
        settlementServices,
        spellbook,
        information,
        party,
        activity,
        guidance,
        opportunities,
        dayReview: getLatestDaySummary(state),
    });
}

export function createContextualActions(state, nearby = null, opportunities = null, transportDesk = null) {
    if (state.activeBattle?.phase === 'active') {
        const readyAbilities = listAbilityAvailability(state)
            .filter((entry) => entry.known && entry.available && entry.ability.contexts.includes('combat'))
            .slice(0, 2)
            .map((entry) => abilityAction(entry));
        return [
            directAction('context:attack', 'Attack', 'combat.attack', {}, 'combat'),
            ...readyAbilities,
            directAction('context:combat-wait', 'Wait · 3s', 'combat.wait', { seconds: 3 }, 'combat'),
            directAction('context:items', 'Items', 'ui.view.open', { view: 'character' }, 'utility'),
            commandAction('context:battle', 'Battle Status', 'battle', 'utility'),
            directAction('context:spellbook', 'Spellbook', 'ui.view.open', { view: 'spellbook' }, 'utility'),
        ].slice(0, 6);
    }

    if (state.travel?.active) {
        return [
            Object.freeze({ id: 'context:stop-travel', label: 'Stop Travel', intent: 'navigation.stop', payload: Object.freeze({}), kind: 'travel' }),
        ];
    }

    const recruitActions = listRecruitableCompanions(state)
        .filter((entry) => entry.recruitable)
        .map((entry) => Object.freeze({
            id: `context:recruit:${entry.definition.id}`,
            label: `Recruit · ${entry.definition.name}`,
            intent: 'party.recruit',
            payload: Object.freeze({ companionId: entry.definition.id }),
            kind: 'social',
        }));

    if (getNavigationMode(state) === 'locality') {
        const points = nearby ?? listLocalityPoints(state, { limit: 8 }).map(toNearbyRecord);
        const guidanceAction = createPlayerExperienceModel(state)?.primaryAction ?? null;
        const opportunityModel = opportunities ?? decoratePlayerOpportunityModel(state, createPlayerOpportunityModel(state));
        const recommendedOpportunity = opportunityModel.entries.find((entry) => entry.id === opportunityModel.recommendedOpportunityId);
        const recommendedAction = recommendedOpportunity?.action
            ? Object.freeze({ ...recommendedOpportunity.action, kind: recommendedOpportunity.category })
            : null;
        const board = transportDesk ?? createTransportServiceBoard(state);
        const transportActions = board.entries.map(transportBoardAction);
        const actions = [
            ...(guidanceAction ? [guidanceAction] : []),
            ...(recommendedAction ? [recommendedAction] : []),
            ...transportActions,
            ...recruitActions,
            ...listLocalityDestinations(state)
                .slice(0, 3)
                .map((destination) => Object.freeze({
                    id: `context:locality:${destination.id}`,
                    label: `Go · ${destination.name}`,
                    intent: 'locality.move',
                    payload: Object.freeze({ destinationId: destination.id }),
                    kind: 'travel',
                })),
        ];

        for (const poi of points) {
            if (actions.length >= 5) break;
            const action = LOCALITY_ACTION_PRIORITY.find((candidate) => poi.actions.includes(candidate)) ?? 'talk';
            actions.push(Object.freeze({
                id: `context:locality-poi:${poi.id}:${action}`,
                label: `${POI_ACTION_LABELS[action] ?? 'Use'} · ${poi.name}`,
                intent: 'locality.poi',
                payload: Object.freeze({ poiId: poi.id, action }),
                kind: action === 'talk' ? 'social' : action,
            }));
        }
        actions.push(directAction('context:locality-list', 'All Local Places', 'ui.view.open', { view: 'world' }, 'utility'));
        return dedupeActions(actions).slice(0, 6);
    }

    const points = nearby ?? getContextualPois(state).map(toNearbyRecord);
    const actions = [...recruitActions];
    const opportunityModel = opportunities ?? decoratePlayerOpportunityModel(state, createPlayerOpportunityModel(state));
    const recommendedOpportunity = opportunityModel.entries.find((entry) => entry.id === opportunityModel.recommendedOpportunityId);
    if (recommendedOpportunity?.action) actions.push(Object.freeze({ ...recommendedOpportunity.action, kind: recommendedOpportunity.category }));
    for (const poi of points) {
        actions.push(commandAction(`context:talk:${poi.id}`, `Talk · ${poi.name}`, `talk ${poi.name}`, 'social'));
        for (const action of poi.actions) {
            if (!POI_ACTION_LABELS[action]) continue;
            actions.push(commandAction(
                `context:${action}:${poi.id}`,
                `${POI_ACTION_LABELS[action]} · ${poi.name}`,
                `${action} ${poi.name}`,
                action,
            ));
        }
    }

    actions.push(directAction('context:look', 'World & Nearby', 'ui.view.open', { view: 'world' }, 'world'));
    return dedupeActions(actions).slice(0, 6);
}

export function createMovementActions(state) {
    const inBattle = state.activeBattle?.phase === 'active';
    return DIRECTION_ORDER.map((direction) => Object.freeze({
        id: `move:${direction}`,
        label: DIRECTION_ARROWS[direction],
        direction,
        intent: 'navigation.move',
        payload: Object.freeze({ direction }),
        disabled: inBattle || !canMoveDirection(state, direction),
    }));
}

function createSpellbookModel(state) {
    const entries = listAbilityAvailability(state)
        .filter((entry) => entry.known)
        .map((entry) => Object.freeze({
            id: entry.ability.id,
            name: entry.ability.name,
            kind: entry.ability.kind,
            schoolName: entry.school?.name ?? null,
            tags: Object.freeze([...(entry.ability.tags ?? [])]),
            available: entry.available,
            reason: entry.reason,
            cost: formatCosts(entry.ability.costs),
            activationSeconds: entry.ability.activation.durationSeconds,
            cooldownSeconds: entry.ability.cooldownSeconds,
            cooldownRemainingSeconds: entry.cooldownRemainingSeconds ?? 0,
            intent: 'ability.activate',
            payload: Object.freeze({ abilityId: entry.ability.id }),
        }));
    return Object.freeze({
        entries: Object.freeze(entries),
        knownCount: entries.length,
        activeAbilityId: state.abilities?.active?.abilityId ?? null,
    });
}

function createPartyModel(state) {
    const activeIds = new Set(listActiveCompanions(state).map((entry) => entry.id));
    const entries = listRecruitedCompanions(state).map((companion) => {
        const combat = calculateCombatProfile(companion);
        return Object.freeze({
            id: companion.id,
            npcId: companion.npcId,
            name: companion.identity.name,
            title: companion.identity.title,
            level: companion.level,
            active: activeIds.has(companion.id),
            locationId: companion.locationId,
            role: companion.tactics.role,
            hp: companion.resources.hp,
            maxHp: combat.resources.maxHp,
            relationship: Object.freeze({ ...companion.relationship }),
        });
    });
    return Object.freeze({
        capacity: state.party?.capacity ?? 2,
        activeCount: activeIds.size,
        recruitedCount: entries.length,
        entries: Object.freeze(entries),
    });
}

function createCharacterModel(player, combat, activity) {
    const a = combat.attributes;
    return Object.freeze({
        name: player.identity.name,
        ancestry: player.identity.raceName,
        discipline: player.jobs.mainJobName,
        level: player.jobs.level,
        resources: Object.freeze([
            resource('hp', 'HP', player.resources.hp, combat.resources.maxHp),
            resource('mp', 'MP', player.resources.mp, combat.resources.maxMp),
            resource('tp', 'TP', player.resources.tp, combat.resources.maxTp),
        ]),
        attributes: Object.freeze([
            stat('str', 'STR', a.str), stat('dex', 'DEX', a.dex), stat('vit', 'VIT', a.vit),
            stat('agi', 'AGI', a.agi), stat('int', 'INT', a.int), stat('mnd', 'MND', a.mnd), stat('chr', 'CHR', a.chr),
        ]),
        activityLabel: activity?.label ?? 'None',
    });
}

function createActivityModel(state) {
    const now = ensureWorldTimeState(state).totalSeconds;
    if (state.travel?.active) {
        const total = Math.max(1, Number(state.travel.totalSeconds) || 1);
        const remaining = state.travel.arriveAtWorldSeconds === undefined
            ? Math.max(0, Number(state.travel.remainingSeconds) || 0)
            : Math.max(0, state.travel.arriveAtWorldSeconds - now);
        return Object.freeze({
            kind: 'travel',
            label: state.travel.status === 'waiting' ? 'Waiting to depart' : 'Traveling',
            detail: getPlace(state.travel.to)?.name ?? state.travel.to ?? '',
            remainingSeconds: remaining,
            progress: clamp01((total - remaining) / total),
        });
    }

    const task = listTimedTasks(state, { status: 'active' })
        .sort((a, b) => a.completesAtWorldSeconds - b.completesAtWorldSeconds)[0];
    if (!task) return null;
    const progress = getTimedTaskProgress(state, task.id);
    return Object.freeze({
        kind: task.kind,
        label: task.label,
        detail: task.channel,
        remainingSeconds: progress?.remainingSeconds ?? 0,
        progress: clamp01(progress?.progress ?? 0),
    });
}

function createRecentSceneLines(lines) {
    const ignored = new Set([
        'Hearth & Horizon canvas shell initialized.',
        'Hearth & Horizon interface initialized.',
    ]);
    return lines
        .map((line) => String(line ?? '').trim())
        .filter((line) => line && !line.startsWith('> ') && !ignored.has(line))
        .slice(-10);
}

function describeScene(place, guidance) {
    const description = place?.description ?? 'The surroundings are not yet described.';
    if (!guidance?.scenePrompt) return description;
    return `${description} ${guidance.scenePrompt}`;
}

function toNearbyRecord(poi) {
    return Object.freeze({
        id: poi.id,
        name: poi.name,
        type: poi.type,
        notes: poi.notes,
        actions: Object.freeze([...(poi.actions ?? [])]),
    });
}

function commandAction(id, label, command, kind) {
    return Object.freeze({
        id,
        label,
        intent: 'command.route',
        payload: Object.freeze({ command }),
        kind,
    });
}

function directAction(id, label, intent, payload, kind) {
    return Object.freeze({
        id,
        label,
        intent,
        payload: Object.freeze({ ...(payload ?? {}) }),
        kind,
    });
}

function abilityAction(entry) {
    return Object.freeze({
        id: `context:ability:${entry.ability.id}`,
        label: entry.ability.name,
        intent: 'ability.activate',
        payload: Object.freeze({ abilityId: entry.ability.id }),
        kind: entry.ability.kind === 'spell' ? 'magic' : 'combat',
    });
}

function transportBoardAction(entry) {
    const readiness = entry.available
        ? `departs in ${formatDurationShort(entry.waitSeconds)}`
        : entry.blockers[0];
    return directAction(
        `context:${entry.id}`,
        `${entry.serviceName} → ${entry.destinationName} · ${entry.fareAmount} ${entry.currencyId} · every ${formatDurationShort(entry.cadenceSeconds)} · ${readiness}`,
        'transport.start',
        { serviceId: entry.serviceId, destinationPlaceId: entry.destinationPlaceId, cargoUnits: 0 },
        'travel',
    );
}

function dedupeActions(actions) {
    const seen = new Set();
    return actions.filter((action) => {
        const transportKey = action.payload?.serviceId && action.payload?.destinationPlaceId
            ? `${action.payload.serviceId}:${action.payload.destinationPlaceId}`
            : null;
        const key = `${action.intent}:${action.payload?.command ?? action.payload?.abilityId ?? action.payload?.companionId ?? action.payload?.commitmentId ?? action.payload?.destinationId ?? action.payload?.poiId ?? action.payload?.itemId ?? action.payload?.sourceId ?? action.payload?.enemyId ?? action.payload?.opportunityId ?? action.payload?.view ?? transportKey ?? action.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function resource(id, label, current, max) {
    const safeMax = Math.max(0, Number(max) || 0);
    const safeCurrent = Math.max(0, Number(current) || 0);
    return Object.freeze({ id, label, current: safeCurrent, max: safeMax, ratio: safeMax ? clamp01(safeCurrent / safeMax) : 0 });
}

function stat(id, label, value) {
    return Object.freeze({ id, label, value: Number(value) || 0 });
}

function formatCosts(costs = {}) {
    const entries = Object.entries(costs);
    return entries.length ? entries.map(([key, value]) => `${value} ${key.toUpperCase()}`).join(' + ') : 'No resource cost';
}

function formatDurationShort(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    if (total === 0) return 'now';
    if (total % 3600 === 0) return `${total / 3600}h`;
    if (total >= 3600) return `${Math.floor(total / 3600)}h ${Math.floor((total % 3600) / 60)}m`;
    if (total % 60 === 0) return `${total / 60}m`;
    return `${total}s`;
}

function clamp01(value) {
    return Math.max(0, Math.min(1, Number(value) || 0));
}
