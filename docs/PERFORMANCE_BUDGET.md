# Performance Budget

Performance evidence is part of the current hardening contract, but **hard numeric pass/fail thresholds are not yet accepted**. Use repeatable like-for-like measurements and treat protocol changes as new baselines rather than apparent improvements or regressions.

## Repository commands

```bash
npm run benchmark
npm run benchmark:sample
npm run hardening
```

- `npm run benchmark` runs one Benchmark 3 measurement.
- `npm run benchmark:sample` runs three measurements by default and reports min, median, max, mean, and spread.
- `npm run hardening` runs focused deterministic long-session lifecycle smoke followed by sampled benchmark evidence.
- Hosted `Check` normally runs the full test suite, Benchmark 3, and Benchmark Sample on Node 24.

## Benchmark 3 protocol

Benchmark 3 remains the current comparability contract. Benchmark 1/2 are historical and not numerically comparable.

| Workload | Measured iterations | Timing rule |
| --- | ---: | --- |
| create player combat profile | 1,000 | entity creation + combat-profile calculation measured |
| create enemy combat profile | 1,000 | entity creation + combat-profile calculation measured |
| resolve basic attack | 1,000 | battle fixtures prepared before timing |
| dispatch tick to 5 steady subscribers | 10,000 | engine/subscribers prepared before timing |
| direct travel route lookup | 10,000 | game-state fixture prepared before timing |

Each workload receives an unreported separate-context warm-up equal to 10% of measured iterations.

## Latest validated runtime baseline

```text
Runtime SHA: ca7d37c643adc4115b519148615f6120d03228df
Check:       32395768383
Node:        24.19.0
Product:     0.8.900.1
Benchmark:   3
Tests:       699/699
```

Phase 0.8 did not change Benchmark 3 workloads or measurement protocol, so the results remain comparable to other Benchmark 3 checkpoints.

Single run from the frozen-runtime Check:

```text
player combat profiles  0.396198 ms/op
enemy combat profiles   0.071316 ms/op
basic attacks            0.003386 ms/op
tick dispatch            0.000809 ms/op
direct route lookup      0.007450 ms/op
```

Three-sample evidence from the same Check:

| Workload | Median ms/op | Spread |
| --- | ---: | ---: |
| player combat profiles | 0.359735 | 6.77% |
| enemy combat profiles | 0.068665 | 8.93% |
| basic attacks | 0.001223 | 172.92% |
| tick dispatch | 0.000821 | 27.23% |
| direct route lookup | 0.007260 | 6.40% |

The very fast attack/tick microbenchmarks remain dominated by runtime/timing noise. **Do not create CI thresholds from these figures.** Profile creation and route lookup are more stable but still are not accepted release budgets.

## Phase 0.8 exit rerun

Validation-only Check `32395959505` reran Test + Benchmark 3 + Benchmark Sample and additionally ran Content Census + Hardening. All steps succeeded.

That rerun's normal sample medians/spreads were:

```text
player profiles  0.357405 ms/op    5.82%
enemy profiles   0.071194 ms/op   10.41%
basic attacks    0.001104 ms/op  189.28%
tick dispatch    0.000877 ms/op   30.05%
route lookup     0.007036 ms/op    5.41%
```

Hardening then reran the lifecycle smoke (2/2 pass) and another sample:

```text
player profiles  0.366008 ms/op    7.13%
enemy profiles   0.071743 ms/op   11.52%
basic attacks    0.001110 ms/op  169.06%
tick dispatch    0.000693 ms/op   53.45%
route lookup     0.007213 ms/op    9.45%
```

This repeated evidence does not justify hard thresholds; it confirms the current qualitative envelope remained stable while Phase 0.8 closed.

## Performance rules

- Compare only the same Benchmark version in comparable environments.
- Preserve correctness, deterministic simulation, save/load meaning, and player behavior while optimizing.
- Do not optimize a benchmark by moving required gameplay work outside production behavior.
- Use median/spread and multiple runs; one fast run is not a performance claim.
- Prioritize simulation advancement, action resolution, map/view-model derivation, save/load, content validation, UI rendering, and representative long-session behavior.
- Treat retained-state growth as lifecycle/ownership debt when repeated use does not return toward stable application-owned state.
- Advance Benchmark version whenever workload or measurement protocol changes enough to break comparability.

Hard thresholds remain deferred until repeated representative evidence supports them. Phase 0.9 content-scale work should continue collecting comparable evidence when broad content materially changes lookup, validation, view-model, or long-session costs.
