export const QUEST_HOOKS = Object.freeze({
    'poi-sandoria-s-ambrotien': quest('poi-sandoria-s-ambrotien', 'San d’Oria Mission Desk', 'mission', 'Nation missions will start here once mission state is implemented.', ['nationRank', 'sanDoria']),
    'poi-sandoria-n-grilau': quest('poi-sandoria-n-grilau', 'San d’Oria Mission Liaison', 'mission', 'Alternate San d’Oria mission contact.', ['nationRank', 'sanDoria']),
    'poi-bastok-markets-cleades': quest('poi-bastok-markets-cleades', 'Bastok Mission Desk', 'mission', 'Bastok nation missions will start here once mission state is implemented.', ['nationRank', 'bastok']),
    'poi-metalworks-cid': quest('poi-metalworks-cid', 'Cid Engineering Requests', 'quest', 'Future engineering and prototype quest chain anchor.', ['bastok', 'engineering']),
    'poi-metalworks-cornelia': quest('poi-metalworks-cornelia', 'Cornelia Mission Contact', 'mission', 'Bastok mission story contact.', ['bastok', 'mission']),
    'poi-metalworks-iron-eater': quest('poi-metalworks-iron-eater', 'Iron Eater Mission Contact', 'mission', 'Bastok military mission contact.', ['bastok', 'mission']),
    'poi-metalworks-raibaht': quest('poi-metalworks-raibaht', 'Raibaht Workshop Requests', 'quest', 'Future workshop quest anchor.', ['bastok', 'engineering']),
    'poi-waters-dagoza-beruza': quest('poi-waters-dagoza-beruza', 'Windurst Mission Desk', 'mission', 'Windurst nation missions will start here once mission state is implemented.', ['nationRank', 'windurst']),
    'poi-woods-apururu': quest('poi-woods-apururu', 'Apururu Requests', 'mission', 'Important Windurst mission and story contact.', ['windurst', 'mission']),
    'poi-walls-heavens-tower-gate': quest('poi-walls-heavens-tower-gate', 'Heavens Tower Access', 'mission', 'Future Windurst civic/magical mission gateway.', ['windurst', 'mission']),
    'poi-heavens-tower-mission-desk': quest('poi-heavens-tower-mission-desk', 'Heavens Tower Mission Desk', 'mission', 'Central Windurst mission desk.', ['windurst', 'mission']),
});

export function getQuestHookForPoi(poiId) {
    return QUEST_HOOKS[poiId] ?? null;
}

export function listQuestHooks() {
    return Object.values(QUEST_HOOKS);
}

export function describeQuestHookForPoi(poi) {
    const hook = getQuestHookForPoi(poi.id);
    if (!hook) return `${poi.name} has no quest hook yet. Tags: ${poi.tags.join(', ')}`;

    return [
        hook.name,
        `Kind: ${hook.kind}`,
        hook.description,
        `Tags: ${hook.tags.join(', ')}`,
        'Status: schema hook only; quest journal/objective state is not implemented yet.',
    ].join('\n');
}

function quest(poiId, name, kind, description, tags) {
    return Object.freeze({ poiId, name, kind, description, tags: Object.freeze(tags) });
}
