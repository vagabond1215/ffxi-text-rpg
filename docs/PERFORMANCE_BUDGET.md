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
Runtime/content SHA: ba156a416026835ccc483b8644d134a8d3d062d9
Check:               33149570962
Job:                 98778174178
Node:                24.19.0
Product target:      0.9.100.5
Benchmark:           3
Tests:               725/725
Content Census:      success
```

Location & Area Profiles does not change Benchmark 3 workloads or the runtime hot paths measured by the benchmark protocol. Results remain comparable.

Single run:

```text
player combat profiles  0.355206 ms/op
enemy combat profiles   0.068380 ms/op
basic attacks            0.003525 ms/op
tick dispatch            0.000834 ms/op
direct route lookup      0.007249 ms/op
```

Three-sample evidence:

| Workload | Median ms/op | Spread |
| --- | ---: | ---: |
| player combat profiles | 0.326829 | 13.12% |
| enemy combat profiles | 0.065145 | 10.67% |
| basic attacks | 0.001299 | 170.23% |
| tick dispatch | 0.000814 | 32.39% |
| direct route lookup | 0.006769 | 7.30% |

No hard threshold is accepted. The profile catalog is exercised by tests/reporting, not by altering benchmark workloads.

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