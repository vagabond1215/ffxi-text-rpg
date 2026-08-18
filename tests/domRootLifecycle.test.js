import test from 'node:test';
import assert from 'node:assert/strict';

import { createDomRoot } from '../js/text/ui/domRoot.js';

function createHarness(options = {}) {
    const host = { id: 'app' };
    const apps = [];
    const enhancementDisposals = [];
    let enhancementInstallCount = 0;

    const root = createDomRoot({
        host,
        createApp: ({ host: receivedHost }) => {
            assert.equal(receivedHost, host);
            const app = {
                destroyed: 0,
                destroy() {
                    this.destroyed += 1;
                },
            };
            apps.push(app);
            return app;
        },
        installEnhancements: (receivedHost) => {
            assert.equal(receivedHost, host);
            enhancementInstallCount += 1;
            if (options.throwOnInstall === enhancementInstallCount) throw new Error('enhancement install failed');
            const disposal = { count: 0 };
            enhancementDisposals.push(disposal);
            return () => {
                disposal.count += 1;
            };
        },
    });

    return { root, apps, enhancementDisposals, get enhancementInstallCount() { return enhancementInstallCount; } };
}

test('remount tears down the previous app and onboarding observer before replacing them', () => {
    const harness = createHarness();

    const first = harness.root.mount();
    assert.equal(harness.root.mounted, true);
    assert.equal(harness.root.app, first);

    const second = harness.root.mount();

    assert.notEqual(second, first);
    assert.equal(first.destroyed, 1);
    assert.equal(harness.enhancementDisposals[0].count, 1);
    assert.equal(second.destroyed, 0);
    assert.equal(harness.enhancementDisposals[1].count, 0);
    assert.equal(harness.root.app, second);
});

test('unmount is idempotent and disposes only the currently mounted resources', () => {
    const harness = createHarness();
    const app = harness.root.mount();

    harness.root.unmount();
    harness.root.unmount();

    assert.equal(app.destroyed, 1);
    assert.equal(harness.enhancementDisposals[0].count, 1);
    assert.equal(harness.root.mounted, false);
    assert.equal(harness.root.app, null);
});

test('failed enhancement installation destroys the newly created app and leaves root unmounted', () => {
    const harness = createHarness({ throwOnInstall: 1 });

    assert.throws(() => harness.root.mount(), /enhancement install failed/);

    assert.equal(harness.apps.length, 1);
    assert.equal(harness.apps[0].destroyed, 1);
    assert.equal(harness.root.mounted, false);
    assert.equal(harness.root.app, null);
});
