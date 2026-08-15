import { getOriginExperienceContent } from '../data/playerExperienceContent.js';
import { getPointOfInterest } from '../data/pointsOfInterest.js';
import { getPlace } from '../data/places.js';

export const PLAYER_EXPERIENCE_VERSION = 1;

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
            ? `You are beyond the safe wards now. Choose a purpose before pushing farther: train, recover useful resources, learn the route, or return with something that improves your next attempt.`
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
    return [
        `${guide?.name ?? content.guideName}`,
        `“You are on the newcomer roll for ${content.nationName}. That means you have a place to begin, not a reputation someone else earned for you.”`,
        '',
        `“Learn ${place?.name ?? 'this district'} first. ${capitalize(content.localLead)} can help you prepare before you gamble time or blood outside the safe wards.”`,
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
    ].join('\n');
}

function hasDiscoveredPoi(state, poiId) {
    return Object.values(state?.discoveredPois ?? {}).some((ids) => Array.isArray(ids) && ids.includes(poiId));
}

function path(id, title, how, grows) {
    return Object.freeze({ id, title, how, grows });
}

function capitalize(value) {
    const text = String(value ?? '');
    return text ? `${text.slice(0, 1).toUpperCase()}${text.slice(1)}` : '';
}
