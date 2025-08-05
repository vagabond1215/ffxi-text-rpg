const TICK_MS = 3000; // 3 seconds per FFXI tick
let timer = null;
const handlers = new Set();

export function startTicks() {
  if (!timer) {
    timer = setInterval(() => {
      handlers.forEach(fn => {
        try {
          fn();
        } catch (e) {
          console.error('Tick handler error', e);
        }
      });
    }, TICK_MS);
  }
}

export function stopTicks() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export function onTick(fn) {
  handlers.add(fn);
  return () => handlers.delete(fn);
}
