import { getCompanionDefinition } from '../data/companions.js';
import { createSeedNpcs } from '../data/seedEntities.js';
import { createNpc } from '../entities/entityFactory.js';
import { refreshEnemyEncounterProjection } from './enemyEncounterProjection.js';

export const NPC_WORLD_PROJECTION_VERSION = 1;

export function refreshNpcWorldProjection(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) return [];
    refreshEnemyEncounterProjection(state);
    state.npcs = createSeedNpcs();

    const party = state.party;
    if (!party || typeof party !== 'object' || Array.isArray(party)) return state.npcs;
    if (!party.companions || typeof party.companions !== 'object' || Array.isArray(party.companions)) return state.npcs;

    const activeCompanionIds = new Set(Array.isArray(party.activeCompanionIds) ? party.activeCompanionIds : []);
    for (const [companionId, companion] of Object.entries(party.companions)) {
        const definition = getCompanionDefinition(companionId);
        if (!definition || !companion || typeof companion !== 'object' || Array.isArray(companion)) continue;

        let npc = state.npcs.find((entry) => entry.id === definition.npcId) ?? null;
        if (!npc) {
            npc = createNpc({
                id: definition.npcId,
                name: definition.name,
                title: definition.title,
                locationId: definition.homePlaceId,
                services: ['companion-recruitment'],
            });
            state.npcs.push(npc);
        }

        npc.identity.name = companion.identity?.name ?? definition.name;
        npc.identity.title = companion.identity?.title ?? definition.title;
        npc.identity.locationId = companion.locationId ?? definition.homePlaceId;
        npc.flags ??= {};
        npc.flags.companionId = companionId;
        npc.flags.companionActive = activeCompanionIds.has(companionId);
    }

    return state.npcs;
}
