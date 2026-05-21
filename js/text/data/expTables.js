export const EXP_GUIDE_SOURCE = Object.freeze({
    id: 'ffxiclopedia-exp-calculation-guide',
    name: 'FFXIclopedia Experience Point Calculation Guide',
    url: 'https://ffxiclopedia.fandom.com/wiki/Experience_Point_Calculation_Guide',
    caveat: 'The source page is marked outdated. These tables are research scaffolding, not final retail-verified math.',
});

export const EXP_CON_RANKS = Object.freeze({
    TOO_WEAK: 'tooWeak',
    EASY_PREY: 'easyPrey',
    DECENT_CHALLENGE: 'decentChallenge',
    EVEN_MATCH: 'evenMatch',
    TOUGH: 'tough',
    VERY_TOUGH: 'veryTough',
    INCREDIBLY_TOUGH: 'incrediblyTough',
});

export const EXP_CHAIN_BONUS_PERCENT = Object.freeze({
    1: 20,
    2: 25,
    3: 30,
    4: 40,
    5: 50,
});

export function describeExpCalculationResearch() {
    return [
        'EXP calculation research scaffold:',
        `Source: ${EXP_GUIDE_SOURCE.url}`,
        `Caveat: ${EXP_GUIDE_SOURCE.caveat}`,
        '',
        'Current implementation goal:',
        '- Keep EXP math pure and testable.',
        '- Return a breakdown object, not a naked number.',
        '- Do not hook EXP rewards into combat until battle, party, con, chain, and bonus state are stable.',
        '',
        'Known staged model:',
        '1. Determine effective player/party level.',
        '2. Determine monster level difference and con band.',
        '3. Calculate base EXP.',
        '4. Apply party/share/level-spread rules.',
        '5. Apply cap.',
        '6. Apply chain bonus.',
        '7. Apply ring/campaign/event modifiers.',
    ].join('\n');
}
