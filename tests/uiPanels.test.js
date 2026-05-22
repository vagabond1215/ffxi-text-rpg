import test from 'node:test';
import assert from 'node:assert/strict';

import {
    classifyCommandFeedback,
    renderCharacterCards,
    renderCommandChips,
    renderMainMenuPanel,
} from '../js/text/uiPanels.js';

test('renderMainMenuPanel exposes primary slash commands', () => {
    const html = renderMainMenuPanel();

    assert.match(html, /data-command="\/newcharacter"/);
    assert.match(html, /data-command="\/characters"/);
    assert.match(html, /data-command="\/save"/);
});

test('renderCommandChips exposes common command buttons', () => {
    const html = renderCommandChips();

    assert.match(html, /data-command="\/look"/);
    assert.match(html, /data-command="\/inventory"/);
    assert.match(html, /data-command="\/move n"/);
});

test('renderCharacterCards shows empty state and load buttons', () => {
    assert.match(renderCharacterCards([]), /No saved characters/);

    const html = renderCharacterCards([{ index: 2, name: 'Tester', race: 'Hume', job: 'Warrior', level: 1, nation: 'San d’Oria', location: 'Southern San d’Oria' }]);
    assert.match(html, /Tester/);
    assert.match(html, /data-command="\/load 2"/);
});

test('classifyCommandFeedback identifies success error and info responses', () => {
    assert.equal(classifyCommandFeedback('/save', 'Character saved.').kind, 'success');
    assert.equal(classifyCommandFeedback('/load 2', 'No saved character matched: 2').kind, 'error');
    assert.equal(classifyCommandFeedback('/look', 'Southern San d’Oria').kind, 'info');
});
