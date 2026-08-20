import { getCommitmentDefinition } from '../data/commitments.js';
import { getPlace } from '../data/places.js';
import { describeNpcScheduleStatus, getNpcScheduleStatus } from './npcScheduleEngine.js';

export const PLAYER_SOCIAL_SCHEDULE_VERSION = 2;

const SOCIAL_COMMITMENT_INTENTS = new Set([
    'commitment.accept',
    'commitment.resolve',
    'commitment.followUp',
]);

export function decoratePlayerSocialScheduleModel(state, baseModel) {
    if (!baseModel?.entries?.length) return baseModel;
    let changed = false;
    const homePlaceId = state?.player?.progression?.unlockedHomePoints?.[0] ?? null;
    const homeRegion = getPlace(homePlaceId)?.region ?? null;

    const entries = baseModel.entries.map((entry) => {
        let next = entry;
        const intent = entry.action?.intent;
        const commitmentId = entry.action?.payload?.commitmentId;
        if (SOCIAL_COMMITMENT_INTENTS.has(intent) && commitmentId) {
            const definition = getCommitmentDefinition(commitmentId);
            if (definition) {
                const availability = getNpcScheduleStatus(state, definition.giverNpcId);
                if (availability.scheduled && !availability.available) {
                    changed = true;
                    const blocker = describeNpcScheduleStatus(availability);
                    next = Object.freeze({
                        ...entry,
                        status: 'blocked',
                        summary: blocker,
                        blockers: Object.freeze([...new Set([...(entry.blockers ?? []), blocker])]),
                        requirements: Object.freeze([
                            ...(entry.requirements ?? []),
                            Object.freeze({ label: `${availability.npcName} is available ${availability.windowSummary}`, met: false }),
                        ]),
                        action: null,
                    });
                }
            }
        }

        if (next.groupKind === 'cultivation' && !next.regionLabel && homeRegion) {
            changed = true;
            next = Object.freeze({ ...next, regionLabel: homeRegion });
        }
        return next;
    });

    const recommended = chooseRecommended(entries, baseModel.recommendedOpportunityId);
    const recommendationChanged = recommended?.id !== baseModel.recommendedOpportunityId;
    const groups = remapGroupEntries(baseModel.groups, entries);
    if (!changed && !recommendationChanged && groups === baseModel.groups) return baseModel;

    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 13),
        recommendedOpportunityId: recommended?.id ?? null,
        entries: Object.freeze(entries),
        groups,
    });
}

function chooseRecommended(entries, baseRecommendedId) {
    const activeCultivation = entries.find((entry) => entry.groupKind === 'cultivation' && entry.status === 'active' && entry.action);
    if (activeCultivation) return activeCultivation;

    const activeNonCultivation = entries.find((entry) => entry.groupKind !== 'cultivation' && entry.status === 'active' && entry.action);
    if (activeNonCultivation) return activeNonCultivation;

    const baseRecommended = entries.find((entry) => entry.id === baseRecommendedId);
    if (baseRecommended?.groupKind !== 'cultivation' && baseRecommended?.action && ['active', 'ready'].includes(baseRecommended.status)) {
        return baseRecommended;
    }

    return entries.find((entry) => entry.groupKind !== 'cultivation' && entry.status === 'ready' && entry.action)
        ?? entries.find((entry) => entry.groupKind === 'cultivation' && entry.status === 'ready' && entry.action)
        ?? entries.find((entry) => entry.status === 'ready')
        ?? entries.find((entry) => entry.status === 'active')
        ?? entries.find((entry) => entry.status === 'available')
        ?? null;
}

function remapGroupEntries(groups, entries) {
    if (!Array.isArray(groups)) return groups;
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    let changed = false;
    const mapped = groups.map((group) => {
        if (!Array.isArray(group?.entries)) return group;
        const groupEntries = group.entries.map((entry) => byId.get(entry.id) ?? entry);
        const differs = groupEntries.some((entry, index) => entry !== group.entries[index]);
        if (!differs) return group;
        changed = true;
        return Object.freeze({ ...group, entries: Object.freeze(groupEntries) });
    });
    return changed ? Object.freeze(mapped) : groups;
}