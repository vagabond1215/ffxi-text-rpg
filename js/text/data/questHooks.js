export const QUEST_HOOKS = Object.freeze({
    'poi-sandoria-s-ambrotien': quest('poi-sandoria-s-ambrotien', 'Thornwall Southgate Civic Commission Desk', 'commission', 'Oren Vale records local service requests, road work, and civic commissions for the Southgate ward.', ['thornwall', 'southgate', 'civic']),
    'poi-sandoria-n-grilau': quest('poi-sandoria-n-grilau', 'Thornwall Crownward Commission Desk', 'commission', 'Deren Oathclerk handles Crownward service requests and work tied to the older guild and oath houses.', ['thornwall', 'crownward', 'civic']),
    'poi-bastok-markets-cleades': quest('poi-bastok-markets-cleades', 'Brasshaven Market Ring Civic Commission Desk', 'commission', 'Clerk Merrow records practical work requested by Market Ring offices, merchants, and civic crews.', ['brasshaven', 'market-ring', 'civic']),
    'poi-metalworks-cid': quest('poi-metalworks-cid', 'Caldris Engineering Requests', 'commission', 'Master Engineer Caldris posts engineering, repair, prototype, and material requests for capable workers.', ['brasshaven', 'engineering', 'foundry']),
    'poi-metalworks-cornelia': quest('poi-metalworks-cornelia', 'Foundry Hall Civic Commission Desk', 'commission', 'Envoy Tessa Mar coordinates civic requests that pass through Brasshaven’s Foundry Hall.', ['brasshaven', 'foundry', 'civic']),
    'poi-metalworks-iron-eater': quest('poi-metalworks-iron-eater', 'Foundry Guard Commission Board', 'commission', 'Captain Brannic Voss handles guard, escort, and security work associated with the foundry district.', ['brasshaven', 'foundry', 'security']),
    'poi-metalworks-raibaht': quest('poi-metalworks-raibaht', 'Gearwright Noll Workshop Requests', 'commission', 'Gearwright Noll keeps a list of workshop repair, salvage, and fabrication needs.', ['brasshaven', 'engineering', 'workshop']),
    'poi-waters-dagoza-beruza': quest('poi-waters-dagoza-beruza', 'Mistmere Canal Ward Civic Commission Desk', 'commission', 'Reader Soli Venn records Canal Ward requests involving deliveries, field observations, and civic service.', ['mistmere', 'canal-ward', 'civic']),
    'poi-woods-apururu': quest('poi-woods-apururu', 'Garden Ward Civic Requests', 'commission', 'Curator Lessa Rain coordinates work involving the gardens, local growers, and nearby Starfen field sites.', ['mistmere', 'garden-ward', 'civic']),
    'poi-walls-heavens-tower-gate': quest('poi-walls-heavens-tower-gate', 'Observatory Access Requests', 'commission', 'The Observatory Gate records authorized deliveries, survey errands, and requests for scholastic access.', ['mistmere', 'observatory', 'scholastic']),
    'poi-heavens-tower-mission-desk': quest('poi-heavens-tower-mission-desk', 'Observatory Civic Desk', 'commission', 'The Observatory Civic Desk coordinates survey, archive, and city research requests.', ['mistmere', 'observatory', 'civic']),
});

export function getQuestHookForPoi(poiId) {
    return QUEST_HOOKS[poiId] ?? null;
}

export function listQuestHooks() {
    return Object.values(QUEST_HOOKS);
}

export function describeQuestHookForPoi(poi) {
    const hook = getQuestHookForPoi(poi.id);
    if (!hook) return `${poi.name} has no formal commission posted.`;

    return [
        hook.name,
        hook.description,
        'No formal tracked commission is posted here yet; the contact can still help you understand what kind of work belongs in this part of the world.',
    ].join('\n');
}

function quest(poiId, name, kind, description, tags) {
    return Object.freeze({ poiId, name, kind, description, tags: Object.freeze(tags) });
}
