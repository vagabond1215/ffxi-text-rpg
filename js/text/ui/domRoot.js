export function createDomRoot({ host, createApp, installEnhancements }) {
    if (!host) throw new Error('DOM root requires a host element.');
    if (typeof createApp !== 'function') throw new Error('DOM root requires a createApp function.');
    if (typeof installEnhancements !== 'function') throw new Error('DOM root requires an installEnhancements function.');

    let app = null;
    let disposeEnhancements = null;

    function unmount() {
        const dispose = disposeEnhancements;
        const mountedApp = app;
        disposeEnhancements = null;
        app = null;
        if (typeof dispose === 'function') dispose();
        mountedApp?.destroy?.();
    }

    function mount() {
        unmount();
        const nextApp = createApp({ host });
        try {
            const nextDispose = installEnhancements(host);
            app = nextApp;
            disposeEnhancements = typeof nextDispose === 'function' ? nextDispose : null;
            return app;
        } catch (error) {
            nextApp?.destroy?.();
            throw error;
        }
    }

    return {
        mount,
        unmount,
        get app() {
            return app;
        },
        get mounted() {
            return app !== null;
        },
    };
}
