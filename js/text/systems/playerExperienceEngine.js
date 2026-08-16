import { getEquipmentCatalogEntry } from '../data/equipmentCatalog.js';
import { getNation } from '../data/nations.js';
import { getOriginExperienceContent } from '../data/playerExperienceContent.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';
import { getPlace } from '../data/places.js';
import { actionFailure, actionSuccess } from './actionResult.js';
import { addItemToContainer, findItemInContainer } from './inventoryEngine.js';
import { emitSemanticEvent } from './semanticEventEngine.js';

export const PLAYER_EXPERIENCE_VERSION = 2;

export function createPlayerExperienceModel(state) {
    if (!state?.player) return null;
    const content = getOriginExperienceForState(state);
    const guide = getPointOfInterest(content.guidePoiId);
    const currentPlace = getPlace(state.currentPlaceId);
    const guideMet = hasDiscoveredPoi(state, content.guidePoiId);
    const inStartingLocality = state.currentPlaceId === content.startingPlaceId;
    const onExpedition = Boolean(currentPlace && (Number(currentPlace.dangerLevel ?? 0) > 0 || ['wilderness', 'dungeon'].includes(currentPlace.type)));
    const phase = !guideMet ? 'orientation' : onExpedition ? 'expedition' : 'foothold';

    const nextStep = !guideMet
        ? `Meet ${content.guideName} in ${getPlace(content.startingPlaceId)?.name ?? 'your starting district'}. This contact explains the local footing and how effort turns into lasting progress.`
        : onExpedition
            ? 'You are beyond the safe wards now. Choose a purpose before pushing farther: train, recover useful resources, learn the route, or return with something that improves your next attempt.'
            : `Choose one small loop: prepare through ${content.localLead}, then use your known exits toward ${content.regionalHorizon} when you are ready. Return with experience, materials, knowledge, or stronger connections.`;

    const primaryAction = !guideMet && inStartingLocality && guide
        ? Object.freeze({
            id: `context:origin-guide:${guide.id}`,
            label: `Meet · ${guide.name}`,
            intent: 'locality.poi',
            payload: Object.freeze({ poiId: guide.id, action: 'talk' }),
            kind: 'social',
        })
        : null;

    return Object.freeze({
        version: PLAYER_EXPERIENCE_VERSION,
        phase,
        title: phase === 'orientation' ? 'Find your footing' : phase === 'expedition' ? 'Make the trip count' : 'Build your footing',
        nextStep,
        scenePrompt: phase === 'orientation'
            ? `As a newcomer, your clearest next step is to meet ${content.guideName}.`
            : phase === 'expedition'
                ? 'Repeated effort here should leave you better prepared, more capable, or more knowledgeable than when you arrived.'
                : `You now have enough local orientation to choose your own first loop: prepare, practice, work, or explore toward ${content.regionalHorizon}.`,
        progressionLaw: 'Effort → mastery → efficiency → capability → larger ambition.',
        guide: Object.freeze({
            poiId: content.guidePoiId,
            name: content.guideName,
            met: guideMet,
            startingPlaceId: content.startingPlaceId,
        }),
        regionalHorizon: content.regionalHorizon,
        firstRegionalDestination: content.firstRegionalDestination,
        primaryAction,
        paths: Object.freeze([
            path('training', 'Train through danger', 'Take fights you can survive and use the techniques you actually know.', 'Discipline experience and relevant combat proficiency persist. Better training and capability eligibility make harder encounters practical.'),
            path('livelihood', 'Build a livelihood', `Use ${content.livelihoodExamples} to turn character time and tools into useful material.`, 'Work proficiency, better tools, and material stockpiles make future work faster, safer, or more valuable.'),
            path('exploration', 'Learn the world', `Use known exits and deliberate travel to push into ${content.regionalHorizon} without treating the authored map as already known.`, 'Discovered routes, places, and map knowledge improve planning and open larger trips.'),
            path('preparation', 'Improve preparation', `Use ${content.localLead} to improve what you carry and who you know before taking on more risk.`, 'Equipment, tools, supplies, services, and contacts convert previous gains into larger ambitions.'),
        ]),
    });
}

export function claimOriginStarterKit(state) {
    if (!state?.player) {
        return actionFailure({
            action: 'playerExperience.claimStarterKit',
            code: 'player-experience.no-player',
            outcome: 'blocked',
            display: { text: 'No player character is available.' },
        });
    }
    const content = getOriginExperienceForState(state);
    if (!hasDiscoveredPoi(state, content.guidePoiId)) {
        return actionFailure({
            action: 'playerExperience.claimStarterKit',
            code: 'player-experience.guide-required',
            outcome: 'blocked',
            data: { guidePoiId: content.guidePoiId },
            display: { text: `Meet ${content.guideName} before collecting the newcomer field kit.` },
        });
    }
    if (state.currentPlaceId !== content.startingPlaceId) {
        return actionFailure({
            action: 'playerExperience.claimStarterKit',
            code: 'player-experience.starting-locality-required',
            outcome: 'blocked',
            data: { startingPlaceId: content.startingPlaceId },
            display: { text: `Return to ${getPlace(content.startingPlaceId)?.name ?? content.nationName} to collect the newcomer field kit.` },
        });
    }

    const nation = getNation(content.nationId);
    const itemId = nation.startingEquipmentIds[0] ?? null;
    const item = itemId ? getEquipmentCatalogEntry(itemId) : null;
    if (!item) {
        return actionFailure({
            action: 'playerExperience.claimStarterKit',
            code: 'player-experience.starter-kit-missing',
            outcome: 'error',
            data: { nationId: nation.id, itemId },
            display: { text: 'This origin has no valid newcomer field kit configured.' },
        });
    }
    if (isEquipped(state.player, itemId) || findItemInContainer(state.player.inventoryState, 'inventory', itemId).ok) {
        return actionSuccess({
            action: 'playerExperience.claimStarterKit',
            code: 'player-experience.starter-kit-already-owned',
            outcome: 'unchanged',
            data: { nationId: nation.id, itemId },
            display: { text: `You already have the ${item.name} from your newcomer field kit.` },
        });
    }

    const stored = addItemToContainer(state.player.inventoryState, 'inventory', item);
    if (!stored.ok) {
        return actionFailure({
            action: 'playerExperience.claimStarterKit',
            code: 'player-experience.starter-kit-storage-blocked',
            outcome: 'blocked',
            data: { nationId: nation.id, itemId },
            display: { text: stored.reason },
        });
    }
    emitSemanticEvent(state, 'player.starter-kit-claimed', {
        nationId: nation.id,
        itemId,
        guidePoiId: content.guidePoiId,
    }, { source: 'playerExperienceEngine' });
    return actionSuccess({
        action: 'playerExperience.claimStarterKit',
        code: 'player-experience.starter-kit-claimed',
        outcome: 'granted',
        data: { nationId: nation.id, itemId, guidePoiId: content.guidePoiId },
        display: { text: `${content.guideName} issues you a ${item.name} from the newcomer field kit. It is now in your inventory.` },
    });
}

export function getOriginExperienceForState(state) {
    const nationId = String(state?.player?.identity?.nation ?? 'thornwall').trim().toLowerCase().replace(/\s+/g, '-');
    return getOriginExperienceContent(nationId);
}

export function isOriginGuidePoi(state, poiOrId) {
    const poiId = typeof poiOrId === 'string' ? poiOrId : poiOrId?.id;
    return Boolean(poiId && getOriginExperienceForState(state).guidePoiId === poiId);
}

export function describeOriginGuideDialogue(state, poiOrId) {
    if (!isOriginGuidePoi(state, poiOrId)) return null;
    const content = getOriginExperienceForState(state);
    const guide = typeof poiOrId === 'string' ? getPointOfInterest(poiOrId) : poiOrId;
    const place = getPlace(content.startingPlaceId);
    const nation = getNation(content.nationId);
    const starterItem = getEquipmentCatalogEntry(nation.startingEquipmentIds[0]);
    return [
        `${guide?.name ?? content.guideName}`,
        `“You are on the newcomer roll for ${content.nationName}. That means you have a place to begin, not a reputation someone else earned for you.”`,
        '',
        `“Learn ${place?.name ?? 'this district'} first. ${capitalize(content.localLead)} can help you prepare before you gamble time or blood outside the safe wards.”`,
        starterItem ? `They point out that the newcomer desk can issue you a ${starterItem.name} for your first field work.` : null,
        '',
        'They reduce the advice to one rule:',
        'Effort becomes mastery. Mastery makes old work easier. That efficiency gives you room for new capabilities and larger ambitions.',
        '',
        'Ways to make progress:',
        '- Train through danger: surviving real fights builds discipline experience and relevant combat proficiency.',
        `- Work for a living: ${capitalize(content.livelihoodExamples)} build work mastery while producing materials with real uses.`,
        `- Explore deliberately: routes into ${content.regionalHorizon} become useful knowledge only as you learn them.`,
        '- Prepare well: better tools, equipment, supplies, and contacts turn yesterday’s gains into tomorrow’s reach.',
        '',
        `“Start small. Come back with something you did not have before—skill, material, knowledge, or a useful connection. When ${content.firstRegionalDestination} stops feeling like the edge of your world, choose a farther horizon.”`,
    ].filter(Boolean).join('\n');
}

function hasDiscoveredPoi(state, poiId) {
    return Object.values(state?.discoveredPois ?? {}).some((ids) => Array.isArray(ids) && ids.includes(poiId));
}

function isEquipped(player, itemId) {
    return Object.values(player?.equipment ?? {}).some((item) => item && (item.templateId === itemId || item.id === itemId));
}

function path(id, title, how, grows) {
    return Object.freeze({ id, title, how, grows });
}
