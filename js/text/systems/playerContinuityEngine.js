import { getCommitmentDefinition } from '../data/commitments.js';
import { getOriginExperienceForState } from './playerExperienceEngine.js';
import {
    checkCommitmentRequirements,
    getCommitmentRecord,
    isCommitmentFollowUpAvailable,
} from './commitmentEngine.js';
import { hasDiscoveredPoi } from './poiEngine.js';

export const PLAYER_CONTINUITY_VERSION = 1;

export function decoratePlayerOpportunityModel(state, baseModel) {
    if (!baseModel) return baseModel;
    const continuity = createCommitmentOpportunity(state);
    if (!continuity) return baseModel;

    const entries = [...baseModel.entries];
    const preparationIndex = entries.findIndex((entry) => entry.category === 'preparation');
    entries.splice(preparationIndex >= 0 ? preparationIndex + 1 : 0, 0, continuity);

    // Hands-on work with an explicit Finish action should win over unrelated ready leads.
    const activeAction = entries.find((entry) => entry.status === 'active' && entry.action);
    const recommended = activeAction
        ?? entries.find((entry) => entry.status === 'ready')
        ?? entries.find((entry) => entry.status === 'active')
        ?? entries.find((entry) => entry.status === 'available')
        ?? null;

    return Object.freeze({
        ...baseModel,
        version: Math.max(Number(baseModel.version) || 0, 4),
        recommendedOpportunityId: recommended?.id ?? null,
        entries: Object.freeze(entries),
    });
}

export function createCommitmentOpportunity(state) {
    const origin = getOriginExperienceForState(state);
    const commitmentId = origin.regionalLoop?.commitmentId;
    if (!commitmentId) return null;
    const definition = getCommitmentDefinition(commitmentId);
    if (!definition || !hasDiscoveredPoi(state, definition.offerPoiId)) return null;

    const record = getCommitmentRecord(state, commitmentId);
    if (!record) {
        const inPlace = state.currentPlaceId === definition.offerPlaceId;
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: definition.name,
            summary: definition.description,
            reason: 'A real commitment gives the first regional livelihood loop a social and economic reason without turning the Journal into authority.',
            progress: 'Resolving it records completed work, pays once, and changes your standing with a persistent NPC.',
            status: inPlace ? 'ready' : 'available',
            requirements: [requirement('Speak with Marshal Varric Stone in Brasshaven Market Ring', inPlace)],
            action: inPlace ? action('accept-copper-return', `Accept · ${definition.name}`, 'commitment.accept', { commitmentId }) : null,
        });
    }

    if (record.status === 'active') {
        const check = checkCommitmentRequirements(state, commitmentId);
        const deliverable = hasQualifyingItem(state, definition.requiredItems[0]);
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: definition.name,
            summary: deliverable
                ? 'You have the requested provenance-bearing ingot. Return it to Varric for real resolution.'
                : definition.objective,
            reason: 'The commitment remains persistent while the livelihood loop supplies its real material requirement.',
            progress: 'Successful resolution pays exactly once and changes Varric’s familiarity and respect.',
            status: check.ok ? 'ready' : 'active',
            requirements: [
                requirement('Commitment accepted', true),
                requirement('Carry one Redstone Copper Ingot from the Redstone smelting process', deliverable),
                requirement('Return to Brasshaven Market Ring', state.currentPlaceId === definition.offerPlaceId),
            ],
            blockers: check.ok ? [] : check.blockers,
            action: check.ok ? action('resolve-copper-return', `Deliver · Redstone Copper Ingot`, 'commitment.resolve', { commitmentId }) : null,
        });
    }

    const followUpSeen = record.followUpSeenAtWorldSeconds !== null;
    if (followUpSeen) {
        return opportunity({
            id: `commitment-${definition.id}`,
            category: 'commitment',
            title: `${definition.name} · follow-up complete`,
            summary: 'Varric now remembers your completed work as part of an ongoing relationship rather than a one-time newcomer transaction.',
            reason: 'Persistent social continuity turns completed work into future context instead of resetting the NPC after reward collection.',
            progress: 'The Copper Trail Clasp now points toward Starfen reed fiber and a broader cross-region ambition.',
            status: 'complete',
            requirements: [requirement('Resolve the commitment and return on a later day', true)],
            action: null,
        });
    }

    const followUpReady = isCommitmentFollowUpAvailable(state, commitmentId);
    const inPlace = state.currentPlaceId === definition.offerPlaceId;
    return opportunity({
        id: `commitment-${definition.id}`,
        category: 'commitment',
        title: followUpReady ? 'Varric remembers the copper' : `${definition.name} · credited`,
        summary: followUpReady
            ? 'A later fictional day has arrived. The same NPC now has changed follow-up based on the resolved commitment.'
            : 'The ingot has been delivered and credited. Varric’s next follow-up becomes available on a later fictional day.',
        reason: 'Time and relationships persist after resolution; continuity is not an immediate reward-dialogue reset.',
        progress: 'The next conversation connects proven Brasshaven work to a larger Starfen-linked ambition.',
        status: followUpReady && inPlace ? 'ready' : 'available',
        requirements: [
            requirement('Commitment resolved', true),
            requirement('A later fictional day has begun', followUpReady),
            requirement('Return to Brasshaven Market Ring', inPlace),
        ],
        action: followUpReady && inPlace
            ? action('follow-up-copper-return', 'Speak again · Marshal Varric Stone', 'commitment.followUp', { commitmentId })
            : null,
    });
}

function hasQualifyingItem(state, requirement) {
    if (!requirement) return false;
    return (state.player?.inventoryState?.containers?.inventory?.items ?? []).some((item) => {
        const matches = item.id === requirement.itemId || item.templateId === requirement.itemId;
        if (!matches) return false;
        if (!requirement.provenanceSourceId) return true;
        return Array.isArray(item.provenance) && item.provenance.some((entry) => entry.sourceId === requirement.provenanceSourceId);
    });
}

function opportunity(definition) {
    return Object.freeze({
        ...definition,
        blockers: Object.freeze([...(definition.blockers ?? [])]),
        requirements: Object.freeze((definition.requirements ?? []).map((entry) => Object.freeze({ ...entry }))),
        action: definition.action ? Object.freeze({ ...definition.action, payload: Object.freeze({ ...(definition.action.payload ?? {}) }) }) : null,
    });
}

function action(id, label, intent, payload = {}) {
    return { id, label, intent, payload };
}

function requirement(label, met) {
    return { label, met: Boolean(met) };
}
