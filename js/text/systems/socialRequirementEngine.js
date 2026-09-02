import { SOCIAL_RELATIONSHIP_DIMENSIONS } from '../data/socialRequirements.js';
import { getNpcRelationship } from './relationshipEngine.js';

export const SOCIAL_REQUIREMENT_ENGINE_VERSION = 1;

export function evaluateRelationshipRequirements(state, requirements = []) {
    const unmet = [];

    for (const requirement of requirements ?? []) {
        const relationship = getNpcRelationship(state, requirement.npcId);
        const actual = Object.fromEntries(
            SOCIAL_RELATIONSHIP_DIMENSIONS.map((dimension) => [
                dimension,
                Number.isInteger(relationship?.dimensions?.[dimension]) ? relationship.dimensions[dimension] : 0,
            ]),
        );

        for (const [dimension, minimum] of Object.entries(requirement.minimums ?? {})) {
            if (!Number.isInteger(minimum)) continue;
            if ((actual[dimension] ?? 0) >= minimum) continue;
            unmet.push(Object.freeze({
                npcId: requirement.npcId,
                dimension,
                minimum,
                actual: actual[dimension] ?? 0,
            }));
        }
    }

    return Object.freeze({
        ok: unmet.length === 0,
        unmet: Object.freeze(unmet),
        reason: unmet.length ? describeUnmet(state, unmet) : '',
    });
}

function describeUnmet(state, unmet) {
    return unmet.map((entry) => {
        const npc = (state?.npcs ?? []).find((candidate) => candidate.id === entry.npcId);
        const name = npc?.identity?.name ?? entry.npcId;
        return `${name} requires ${entry.dimension} ${entry.minimum} (current ${entry.actual}).`;
    }).join(' ');
}
