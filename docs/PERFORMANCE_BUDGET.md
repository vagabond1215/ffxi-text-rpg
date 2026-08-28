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
- Hosted `Check` runs Repository Audit, the full test suite, Content Census, Benchmark 3, and Benchmark Sample on Node 24.

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

## Latest validated authored-content checkpoint

```text
Runtime/content SHA: ee81069defe59a55979bc262ea595c3c9df42f40
Check:               33139128883
Job:                 98745791538
Node:                24.19.0
Product target:      0.9.100.4
Benchmark:           3
Tests:               719/719
Content Census:      success
```

Universal Magic & Starfen Marshcraft did not change Benchmark 3 workloads or measurement protocol, so these results remain comparable to other Benchmark 3 checkpoints.

Single run from the validated implementation Check:

```text
player combat profiles  0.350067 ms/op
enemy combat profiles   0.069801 ms/op
basic attacks            0.003693 ms/op
tick dispatch            0.000746 ms/op
direct route lookup      0.007094 ms/op
```

Three-sample evidence from the same Check:

| Workload | Median ms/op | Spread |
| --- | ---: | ---: |
| player combat profiles | 0.332334 | 6.74% |
| enemy combat profiles | 0.062607 | 6.32% |
| basic attacks | 0.001525 | 128.37% |
| tick dispatch | 0.000618 | 72.36% |
| direct route lookup | 0.006927 | 1.09% |

The very fast attack/tick microbenchmarks remain dominated by runtime/timing noise. **Do not create CI thresholds from these figures.** Profile creation and route lookup are more stable but still are not accepted release budgets.

## Historical references

Redstone Forge-Road froze at `440a77c542fcc6a6efcce7a45ca989e9068499f8` and passed Check `32416678697` with 707/707 tests under Benchmark 3. Phase 0.8's frozen runtime `ca7d37c643adc4115b519148615f6120d03228df` passed Check `32395768383` with 699/699 tests; Phase-exit validation `32395959505` additionally passed Census and Hardening. These remain useful like-for-like historical evidence but are no longer the latest checkpoint.

## Performance rules

- Compare only the same Benchmark version in comparable environments.
- Preserve correctness, deterministic simulation, save/load meaning, and player behavior while optimizing.
- Do not optimize a benchmark by moving required gameplay work outside production behavior.
- Use median/spread and multiple runs; one fast run is not a performance claim.
- Prioritize simulation advancement, action resolution, map/view-model derivation, save/load, content validation, UI rendering, and representative long-session behavior.
- Treat retained-state growth as lifecycle/ownership debt when repeated use does not return toward stable application-owned state.
- Advance Benchmark version whenever workload or measurement protocol changes enough to break comparability.

Hard thresholds remain deferred until repeated representative evidence supports them. Phase 0.9 content-scale work should continue collecting comparable evidence when broad content materially changes lookup, validation, view-model, or long-session costs.