export function createSequenceRng(values = []) {
    const sequence = values.length ? values : [0.5];
    let index = 0;
    return function sequenceRng() {
        const value = sequence[index % sequence.length];
        index += 1;
        return clampRngValue(value);
    };
}

export function resolveRng(options = {}) {
    return typeof options.rng === 'function' ? options.rng : Math.random;
}

export function rollPercent(rng = Math.random) {
    return clampRngValue(rng()) * 100;
}

function clampRngValue(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.max(0, Math.min(0.999999, number));
}
