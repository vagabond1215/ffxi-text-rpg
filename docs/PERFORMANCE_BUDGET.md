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
- Hosted `Check` runs the full test suite, Benchmark 3, and the three-sample benchmark on Node 24.

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

## Latest validated feature baseline

Draft PR #378 exact frozen implementation head:

```text
c125f7ae5f94800893dc28c7fa0ceb61553e3db8
Check 32340190710
Job 96337561458
Node 24.19.0
Product 0.8.700.1
Benchmark 3
695/695 tests
```

The feature adds cultivation state, semantic actions, and save/load coverage but **does not change Benchmark 3 workloads or measurement protocol**, so the results remain comparable to other Benchmark 3 checkpoints.

Single run:

```text
player combat profiles  0.350069 ms/op   warmup=100
enemy combat profiles   0.068868 ms/op   warmup=100
basic attacks            0.003197 ms/op   warmup=100
tick dispatch            0.000788 ms/op   warmup=1000
direct route lookup      0.007068 ms/op   warmup=1000
```

Three-sample evidence:

| Workload | Median ms/op | Spread |
| --- | ---: | ---: |
| player combat profiles | 0.331167 | 6.35% |
| enemy combat profiles | 0.062892 | 7.69% |
| basic attacks | 0.001206 | 166.26% |
| tick dispatch | 0.000613 | 54.43% |
| direct route lookup | 0.006783 | 5.66% |

The very fast attack/tick microbenchmarks remain dominated by runtime/timing noise. **Do not create CI thresholds from these figures.** Profile creation and route lookup are more stable but still are not accepted release budgets.

PR #378 remains draft/unmerged. This evidence validates its frozen implementation head; it does not claim the feature has landed on `main`.

## Prior C0 checkpoint

C0 continuation/content-census tooling validated at `b0c1e067a1907a8587a08a128126f9207c6d6134`, Check `32308719621`, 692/692 tests. That checkpoint did not change gameplay Product version.

## Performance rules

- Compare only the same Benchmark version in comparable environments.
- Preserve correctness, deterministic simulation, save/load meaning, and player behavior while optimizing.
- Do not optimize a benchmark by moving required gameplay work outside production behavior.
- Use median/spread and multiple runs; one fast run is not a performance claim.
- Prioritize simulation advancement, action resolution, map/view-model derivation, save/load, content validation, UI rendering, and representative long-session behavior.
- Treat retained-state growth as lifecycle/ownership debt when repeated use does not return toward stable application-owned state.
- Advance Benchmark version whenever workload or measurement protocol changes enough to break comparability.

Hard thresholds remain deferred until repeated representative evidence supports them.
