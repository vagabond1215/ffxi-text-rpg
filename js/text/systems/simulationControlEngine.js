import { actionFailure, actionSuccess } from './actionResult.js';
import { emitSemanticEvent } from './semanticEventEngine.js';
import { advanceWorldTime } from './worldTimeEngine.js';

export const DEFAULT_SIMULATION_SPEED = 1;
export const MAX_SIMULATION_SPEED = 3600;

export function createSimulationControlState(options = {}) {
    const state = {
        paused: Boolean(options.paused ?? false),
        speedMultiplier: options.speedMultiplier ?? DEFAULT_SIMULATION_SPEED,
    };
    const issues = validateSimulationControlState(state);
    if (issues.length) throw new Error(issues.join(' '));
    return state;
}

export function ensureSimulationControlState(state) {
    if (!state?.simulation) state.simulation = createSimulationControlState();
    const issues = validateSimulationControlState(state.simulation);
    if (issues.length) throw new Error(issues.join(' '));
    return state.simulation;
}

export function pauseSimulation(state) {
    const simulation = ensureSimulationControlState(state);
    if (simulation.paused) return result(true, 'simulation.pause', 'simulation.already-paused', 'unchanged', simulation, 'Simulation is already paused.');
    simulation.paused = true;
    const event = emitSemanticEvent(state, 'simulation.paused', { speedMultiplier: simulation.speedMultiplier }, { source: 'simulationControlEngine' });
    return result(true, 'simulation.pause', 'simulation.paused', 'paused', { ...simulation, eventId: event.id }, 'Simulation paused.');
}

export function resumeSimulation(state) {
    const simulation = ensureSimulationControlState(state);
    if (!simulation.paused) return result(true, 'simulation.resume', 'simulation.already-running', 'unchanged', simulation, `Simulation is already running at ${simulation.speedMultiplier}x.`);
    simulation.paused = false;
    const event = emitSemanticEvent(state, 'simulation.resumed', { speedMultiplier: simulation.speedMultiplier }, { source: 'simulationControlEngine' });
    return result(true, 'simulation.resume', 'simulation.resumed', 'running', { ...simulation, eventId: event.id }, `Simulation resumed at ${simulation.speedMultiplier}x.`);
}

export function setSimulationSpeed(state, requestedSpeed) {
    const simulation = ensureSimulationControlState(state);
    const speed = Number(requestedSpeed);
    if (!validSpeed(speed)) return result(false, 'simulation.speed', 'simulation.invalid-speed', 'rejected', { requestedSpeed }, `Simulation speed must be a whole-number multiplier from 1x to ${MAX_SIMULATION_SPEED}x.`);
    if (simulation.speedMultiplier === speed) return result(true, 'simulation.speed', 'simulation.speed-unchanged', 'unchanged', simulation, `Simulation speed is already ${speed}x.`);
    const previousSpeed = simulation.speedMultiplier;
    simulation.speedMultiplier = speed;
    const event = emitSemanticEvent(state, 'simulation.speed-changed', { previousSpeed, speedMultiplier: speed, paused: simulation.paused }, { source: 'simulationControlEngine' });
    return result(true, 'simulation.speed', 'simulation.speed-changed', 'changed', { ...simulation, previousSpeed, eventId: event.id }, `Simulation speed set to ${speed}x.`);
}

export function createSimulationAdvanceDriver(driverOptions = {}) {
    let remainderMs = 0;
    const advanceSeconds = driverOptions.advanceSeconds
        ?? ((state, seconds, options) => advanceWorldTime(state, seconds, options));
    if (typeof advanceSeconds !== 'function') throw new Error('advanceSeconds must be a function.');

    return {
        advance(state, elapsedWallMilliseconds, options = {}) {
            const elapsedMs = Number(elapsedWallMilliseconds);
            if (!Number.isInteger(elapsedMs) || elapsedMs < 0) return result(false, 'simulation.scheduled-advance', 'simulation.invalid-wall-delta', 'rejected', { elapsedWallMilliseconds }, 'Scheduler elapsed time must be a non-negative whole number of milliseconds.');
            const simulation = ensureSimulationControlState(state);
            if (simulation.paused) return result(true, 'simulation.scheduled-advance', 'simulation.paused-no-advance', 'paused', { elapsedWallMilliseconds: elapsedMs, speedMultiplier: simulation.speedMultiplier, secondsAdvanced: 0, remainderMs }, 'Simulation is paused; world time did not advance.');
            remainderMs += elapsedMs * simulation.speedMultiplier;
            const requestedSimulationSeconds = Math.floor(remainderMs / 1000);
            remainderMs %= 1000;
            if (!requestedSimulationSeconds) return result(true, 'simulation.scheduled-advance', 'simulation.accumulating', 'accumulating', { elapsedWallMilliseconds: elapsedMs, speedMultiplier: simulation.speedMultiplier, secondsAdvanced: 0, remainderMs }, 'No full simulated second elapsed yet.');

            const advanceResult = advanceSeconds(state, requestedSimulationSeconds, options);
            if (!advanceResult?.ok) {
                return result(false, 'simulation.scheduled-advance', 'simulation.advance-failed', 'rejected', {
                    elapsedWallMilliseconds: elapsedMs,
                    speedMultiplier: simulation.speedMultiplier,
                    requestedSimulationSeconds,
                    secondsAdvanced: 0,
                    remainderMs,
                    advanceResult: advanceResult?.data ?? null,
                }, advanceResult?.display?.text ?? 'Simulation advancement failed.');
            }

            const secondsAdvanced = Number.isInteger(advanceResult.data?.secondsAdvanced)
                ? advanceResult.data.secondsAdvanced
                : requestedSimulationSeconds;
            const interrupted = advanceResult.data?.interrupted === true || advanceResult.outcome === 'interrupted';
            return result(true, 'simulation.scheduled-advance', interrupted ? 'simulation.interrupted' : 'simulation.advanced', interrupted ? 'interrupted' : 'advanced', {
                elapsedWallMilliseconds: elapsedMs,
                speedMultiplier: simulation.speedMultiplier,
                requestedSimulationSeconds,
                secondsAdvanced,
                remainderMs,
                worldTime: advanceResult.data,
                interrupted,
            }, advanceResult.display?.text ?? `Advanced ${secondsAdvanced}s.`);
        },
        resetRemainder() { remainderMs = 0; },
        get remainderMs() { return remainderMs; },
    };
}

export function validateSimulationControlState(simulation) {
    if (!simulation || typeof simulation !== 'object' || Array.isArray(simulation)) return ['simulation must be an object.'];
    const issues = [];
    if (typeof simulation.paused !== 'boolean') issues.push('simulation.paused must be boolean.');
    if (!validSpeed(simulation.speedMultiplier)) issues.push(`simulation.speedMultiplier must be an integer from 1 to ${MAX_SIMULATION_SPEED}.`);
    return issues;
}

function validSpeed(value) { return Number.isInteger(value) && value >= 1 && value <= MAX_SIMULATION_SPEED; }
function result(ok, action, code, outcome, data, text) {
    return ok ? actionSuccess({ action, code, outcome, data: { ...data }, display: { text } }) : actionFailure({ action, code, outcome, data: { ...data }, display: { text } });
}
