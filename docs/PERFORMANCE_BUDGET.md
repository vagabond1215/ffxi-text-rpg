# Performance Budget

Performance evidence is part of the current hardening contract, but **hard numeric pass/fail thresholds are not yet accepted**. Use repeatable like-for-like measurements and treat protocol changes as new baselines rather than apparent improvements or regressions.

## Repository commands

```bash
npm run benchmark
npm run benchmark:sample
npm run hardening
```

- `npm run benchmark` runs one Benchmark 3 measurement.
- `npm run benchmark:sample` runs three measurements by default and reports min, median, max, mean, and spread for each workload. `HNH_BENCHMARK_SAMPLES` may request 2–10 samples.
- `npm run hardening` runs the focused deterministic long-session lifecycle smoke followed by sampled benchmark evidence.
- Hosted `Check` runs the full test suite, Benchmark 3, and the three-sample benchmark on Node 24.

## Benchmark 3 protocol

Benchmark 3 is the current comparability contract. Benchmark 1 and Benchmark 2 remain historical evidence but are **not numerically comparable** to Benchmark 3 because their measurement boundaries differ.

Current workloads:

| Workload | Measured iterations | Setup/timing rule |
| --- | ---: | --- |
| create player combat profile | 1,000 | entity creation + combat-profile calculation are measured |
| create enemy combat profile | 1,000 | entity creation + combat-profile calculation are measured |
| resolve basic attack | 1,000 | independent battle fixtures are prepared before timing; only attack resolution is measured |
| dispatch tick to 5 steady subscribers | 10,000 | one tick engine and five subscribers are prepared before timing; only dispatch is measured |
| direct travel route lookup | 10,000 | one game-state fixture is prepared before timing; only route lookup is measured |

Each workload performs an **unreported warm-up equal to 10% of its measured iterations** before the timer starts. Warm-up uses a separate setup context so mutable warm-up activity cannot contaminate the measured fixture.

Protocol history:

- **Benchmark 1** included setup inside several timed loops.
- **Benchmark 2** separated setup from timed attack/tick/route work and therefore established a new comparability baseline.
- **Benchmark 3** adds the separate-context 10% warm-up and therefore establishes another new comparability baseline.

## Latest accepted baseline

Runtime checkpoint: PR #335 exact head `10ab2c5af9ddcf0760f49817ff5a8c41ec1caa07`, Check `32160936491`, Node `24.19.0`, Product `0.8.600.12`, Benchmark `3`.

The full gate observed 527/527 tests passing before benchmark execution.

Single Benchmark 3 run:

```text
player combat profiles  0.355492 ms/op   warmup=100
enemy combat profiles   0.066399 ms/op   warmup=100
basic attacks            0.002787 ms/op   warmup=100
tick dispatch            0.000923 ms/op   warmup=1000
direct route lookup      0.008017 ms/op   warmup=1000
```

Three-sample evidence from the same exact-head Check:

| Workload | Median ms/op | Spread |
| --- | ---: | ---: |
| player combat profiles | 0.359021 | 7.97% |
| enemy combat profiles | 0.068446 | 11.71% |
| basic attacks | 0.000951 | 191.11% |
| tick dispatch | 0.000646 | 61.69% |
| direct route lookup | 0.007238 | 5.16% |

The very fast basic-attack and tick microbenchmarks remain dominated by timing/runtime noise at this duration. **Do not create CI thresholds from those figures yet.** Player/enemy profile creation and route lookup are more stable in the current hosted environment, but they still need additional repeated evidence before a release budget is accepted.

## Performance rules

- Compare only the same Benchmark version in comparable environments.
- Preserve correctness, deterministic simulation, save/load meaning, and player behavior while optimizing.
- Do not optimize a benchmark by moving required gameplay work outside the production path.
- Use median/spread and multiple runs when interpreting small changes; one fast run is not a performance claim.
- Prioritize simulation advancement, action resolution, map/view-model derivation, save/load, content validation, UI rendering, and representative long-session behavior.
- Treat cumulative retained-state growth as a lifecycle/ownership problem when repeated use does not return toward a stable application-owned state.
- Advance the Benchmark version whenever workload or measurement protocol changes enough to break comparability.

Hard thresholds may be adopted later only after a repeatable baseline and acceptable variance are established for the specific surface and environment.
