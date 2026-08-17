import test from 'node:test';
import assert from 'node:assert/strict';

import { getPointOfInterest } from '../js/text/data/pointsOfInterest.js';
import { getPlace } from '../js/text/data/places.js';
import { createNewGameState } from '../js/text/gameState.js';
import { setPositionAndDiscover } from '../js/text/systems/atlasEngine.js';
import { recruitCompanion } from '../js/text/systems/partyEngine.js';
import { renderDomApp } from '../js/text/ui/domRenderer.js';
import { createUiState } from '../js/text/ui/uiState.js';

const FORBIDDEN_PLAYER_COPY = [
    'Continuous Character',
    'authored world',
    'does not invent a fee',
    'fictional minutes',
    'Named locality',
    'stubs = unrevealed path',
    'Potential future companion',
    'services placeholder',
    'placeholder route instance',
    'future long-distance',
    'future story contacts',
    'future overland mount',
    'recovery:character',
];

function render(state, view) {
    return renderDomApp({
        state,
        uiState: createUiState({ screen: 'game', activeView: view }),
        session: { loggedIn: true, displayName: 'POV Audit' },
    });
}

function assertCharacterFacing(html) {
    for (const phrase of FORBIDDEN_PLAYER_COPY) {
        assert.doesNotMatch(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `ordinary player HTML should not expose “${phrase}”`);
    }
}

test('ordinary browser surfaces stay inside what the character sees, knows, carries, or can decide', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'POV Auditor' });

    for (const view of ['scene', 'character', 'spellbook', 'journal', 'codex', 'craft', 'world']) {
        assertCharacterFacing(render(state, view));
    }

    const scene = render(state, 'scene');
    assert.match(scene, /Safe/);
    assert.doesNotMatch(scene, /danger\s+0/i);

    const character = render(state, 'character');
    assert.match(character, /Gear &amp; training/);
    assert.match(character, /what you know how to do/i);

    const codex = render(state, 'codex');
    assert.match(codex, /Unknown roads stay unknown until you learn them/i);

    const world = render(state, 'world');
    assert.match(world, /names and landmarks matter more than counting steps/i);
});

test('Mara reads as a person with a voiced road choice rather than a raw party policy', () => {
    const state = createNewGameState({ nationId: 'thornwall', name: 'Companion POV Auditor' });
    const timbercross = getPlace('timbercross-landing');
    setPositionAndDiscover(state, timbercross.id, timbercross.coordinateSystem.start);
    assert.equal(recruitCompanion(state, 'companion-mara-venn').ok, true);

    const html = render(state, 'character');
    assertCharacterFacing(html);
    assert.match(html, /Traveling company/);
    assert.match(html, /Mara Venn/);
    assert.match(html, /reads bent grass, bird-silence, and bad tracks/i);
    assert.match(html, /Guard the Road/);
    assert.match(html, /We get home together/);
    assert.match(html, /data-party-action=/);
    assert.doesNotMatch(html, /basic-attack-v1|skirmisher|active party|persistent companion/i);
});

test('encounterable places and named POIs do not narrate the development roadmap to the character', () => {
    const placeIds = [
        'thornwall-rivergate',
        'thornwall-high-citadel',
        'thornwall-strider-yard',
        'skyferry-waymeet-thornwall',
        'redfang-camp',
        'mistmere-reedport',
    ];
    const poiIds = [
        'poi-sandoria-s-gondebaud',
        'poi-port-bastok-travel-counter',
        'poi-port-windurst-travel-counter',
    ];

    for (const placeId of placeIds) {
        const description = getPlace(placeId)?.description ?? '';
        assert.doesNotMatch(description, /\b(?:future|placeholder|early dangerous expedition target)\b/i, `${placeId} should describe the living world, not planned implementation`);
    }
    for (const poiId of poiIds) {
        const notes = getPointOfInterest(poiId)?.notes ?? '';
        assert.doesNotMatch(notes, /\b(?:future|placeholder)\b/i, `${poiId} should have in-world notes`);
    }
});
