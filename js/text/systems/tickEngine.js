export function createTickEngine(options = {}) {
    const tickLengthMs = options.tickLengthMs ?? 1000;
    const subscribers = new Map();
    let intervalId = null;
    let elapsedTicks = 0;
    let lastTickAt = null;

    function subscribe(id, handler, meta = {}) {
        if (!id || typeof handler !== 'function') {
            throw new Error('Tick subscriptions require an id and handler function.');
        }
        subscribers.set(id, {
            id,
            handler,
            meta,
            enabled: true,
            ticksHandled: 0,
        });
        return () => unsubscribe(id);
    }

    function unsubscribe(id) {
        subscribers.delete(id);
    }

    function setEnabled(id, enabled) {
        const subscriber = subscribers.get(id);
        if (subscriber) subscriber.enabled = Boolean(enabled);
    }

    function tick(context = {}) {
        const now = Date.now();
        const deltaMs = lastTickAt ? now - lastTickAt : tickLengthMs;
        lastTickAt = now;
        elapsedTicks += 1;

        const event = {
            tick: elapsedTicks,
            deltaMs,
            deltaSeconds: deltaMs / 1000,
            at: new Date(now).toISOString(),
            context,
        };

        for (const subscriber of subscribers.values()) {
            if (!subscriber.enabled) continue;
            subscriber.handler(event);
            subscriber.ticksHandled += 1;
        }

        return event;
    }

    function start(contextProvider = () => ({})) {
        if (intervalId) return;
        lastTickAt = Date.now();
        intervalId = setInterval(() => tick(contextProvider()), tickLengthMs);
    }

    function stop() {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = null;
    }

    function describe() {
        return [
            `Tick length: ${tickLengthMs}ms`,
            `Elapsed ticks: ${elapsedTicks}`,
            `Subscribers: ${subscribers.size}`,
            ...Array.from(subscribers.values()).map((sub) => `- ${sub.id} [${sub.enabled ? 'enabled' : 'disabled'}] handled=${sub.ticksHandled}`),
        ].join('\n');
    }

    return {
        subscribe,
        unsubscribe,
        setEnabled,
        tick,
        start,
        stop,
        describe,
        get elapsedTicks() {
            return elapsedTicks;
        },
        get subscriberCount() {
            return subscribers.size;
        },
    };
}

export const STANDARD_TICK_CHANNELS = Object.freeze({
    STATUS_EFFECTS: 'statusEffects',
    COMBAT: 'combat',
    MAGIC_CASTING: 'magicCasting',
    RECASTS: 'recasts',
    TRAVEL: 'travel',
    RESPAWNS: 'respawns',
    REGENERATION: 'regeneration',
    TRUST_AI: 'trustAi',
    CRAFTING: 'crafting',
});
