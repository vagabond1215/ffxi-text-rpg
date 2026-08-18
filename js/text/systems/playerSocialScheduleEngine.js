import { getCommitmentDefinition } from '../data/commitments.js';
import { describeNpcScheduleStatus, getNpcScheduleStatus } from './npcScheduleEngine.js';

export const PLAYER_SOCIAL_SCHEDULE_VERSION = 1;

const SOCIAL_COMMITMENT_INTENTS = new Set([
    'commitment.accept',
    'commitment.resolve',
    'commitment.followUp',
]);

export function decoratePlayerSocialScheduleModel(state, baseModel) {
    if (!baseModel?.entries?.length) return baseModel;
    let changed = false;
    const entries = baseModel.entries.map((entry) => {
        const intent = entry.action?.intent;
        const commitmentId = entry.action?.payload?.commitmentId;
        if (!SOCIAL_COMMITMENT_INTENTS.has(intent) || !commitmentId) return entry;

        const definition = getCommitmentDefinition(commitmentId);
        if (!definition) return entry;
        const availability = getNpcScheduleStatus(state, definition.giverNpcId);
        if (!availability.scheduled || availability.available) return entry;

        changed = true;
        const blocker = describeNpcScheduleStatus(availability);
        return Object.freeze({
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
    });

    if (!changed) return baseModel;
    const recommended = entries.find((entry) => entry.status === 'active' && entry.action)
        ?? entries.find((entry) => entry.status === 'ready' && entry.action)
        ?? entries.find((entry) => entry.status === 'ready')
        ?? entries.find((entry) => entry.status === 'active')
        ?? entries.find((entry) => entry.status === 'available')
        ?? null;

    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 10),
        recommendedOpportunityId: recommended?.id ?? null,
        entries: Object.freeze(entries),
    });
}
