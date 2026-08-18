# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.12
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Warm Benchmark Baseline
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.12` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

A revision bump may record a coherent maintenance contract without advancing a feature track. Do not advance `TRACK` merely because maintenance work occurred.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 6 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | benchmark workload/measurement comparability contract |

These versions advance independently:

- **Account Save** changes when account/session registry semantics change materially.
- **Game State** changes when persisted runtime structure or meaning changes materially.
- **Data** changes when canonical authored-data shape, authority, content, or stable identifiers change materially.
- **Benchmark** changes when the workload or measurement protocol stops being comparable.

Recent Data history:

- Data 31 — companion field approach + character-facing place/POI cleanup;
- Data 32 — first home-infrastructure Storage Chest definition;
- Data 33 — original character names, starter kits, origin openings;
- Data 34 — Joiner's Workbench + infrastructure construction sinks;
- Data 35 — Field Satchel + hide-binding construction sink;
- Data 36 — recurring NPC availability schedule data;
- Data 37 — canonical home furnishing/container identifiers replacing inherited `mog*` identifiers.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Old pre-alpha local saves/accounts are **not** a supported compatibility surface. Current-format save/load/validation/resume must be deterministic.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 6 and contain the complete required persisted structure before revival/reference relinking.
3. Incompatible or incomplete pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
4. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
5. The generic ordered migration utility remains available for a future migration only when compatibility is explicitly required or independently useful.

## Current ActionResult contract

Canonical semantic results expose:

```text
ok
action
code
outcome
data
display
```

The old non-enumerable `.message` / `.reason` aliases are removed. Adapters render `display.text` or consume semantic fields; domain logic must not parse presentation prose.

## Runtime/tooling baseline

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS with `actions/checkout@v7` and `actions/setup-node@v6`, concurrency cancellation, and a 15-minute job timeout.

Hosted Check currently runs:

```text
npm test
npm run benchmark
npm run benchmark:sample
```

`tests/architectureDebtGuard.test.js` guards selected removed compatibility surfaces from returning. Long-session and lifecycle-specific guards additionally cover multi-day save/load, tick subscription ownership, and browser-root resource teardown.

## Benchmark protocol history

Benchmark version changes are deliberate comparability boundaries.

### Benchmark 1

Historical workload. Several timed loops included fixture/setup work such as tick subscription setup, game-state construction for route lookup, and battle/entity construction for attack measurement.

### Benchmark 2

Introduced at Product `0.8.600.9`. Setup was moved outside the timed regions for basic attacks, steady tick dispatch, and route lookup. Player/enemy profile creation remained intentionally measured as creation workloads. Because this changed what the numbers meant, Benchmark advanced `1 -> 2`.

### Benchmark 3 — current

Introduced at Product `0.8.600.12`. Every workload now receives an unreported warm-up equal to 10% of measured iterations on a separate setup context before timing begins. Because warm-up changes the measurement protocol and cold/JIT contribution, Benchmark advanced `2 -> 3`.

Benchmark 3 is the current baseline. Numeric results from Benchmark 1/2 must not be described as directly improving/regressing against Benchmark 3.

No hard timing threshold is accepted yet. The latest hosted sample still shows substantial relative variance on very short basic-attack and tick measurements.

## `0.8.600` feature-track history

| Track | Result |
| --- | --- |
| `0.8.100` | Storage Chest home foothold |
| `0.8.200` | Joiner's Workbench home workshop |
| `0.8.300` | canonical carried-load transport |
| `0.8.400` | earned Field Satchel portable logistics |
| `0.8.500` | daily fictional-time NPC availability |
| `0.8.600` | companion convalescence and safe reunion |

Historical `0.8.600.1` checkpoint:

```text
04211e8909996b1ac34fa91ae1cdd7aa216b86f8
511/511 tests
Benchmark 1 success
Account Save 4
Game State 5
Data 36
```

## `0.8.600.2`–`.12` maintenance history

| Revision | Contract | Independent-version decision |
| --- | --- | --- |
| `.2` Current Schema Cleanup | Hearth & Horizon persistence/home identifiers; obsolete migration/theme/transport cleanup | Account `4->5`, Game `5->6`, Data `36->37` |
| `.3` Canonical Command Contract | remove FFXI runtime macro adapter/aliases; remove `VERSION.app`/`VERSION.save` | unchanged |
| `.4` Strict Current Schema | reject incomplete Game State 6 before revival; malformed current state cannot save | unchanged |
| `.5` Carried Commitment Delivery | one carried-container fact for logistics + commitment delivery; atomic cross-container removal | unchanged |
| `.6` Canonical Action Results | remove ActionResult `.message`/`.reason` compatibility aliases | unchanged |
| `.7` Runtime Architecture Guardrails | Node 24 LTS + current Actions + executable debt guards | unchanged |
| `.8` Long Session Evidence | sampled benchmark command + deterministic 130-day save/load/lifecycle smoke | unchanged |
| `.9` Benchmark Protocol V2 | separate setup from attack/tick/route timing | Benchmark `1->2` |
| `.10` Subscription Ownership | prevent stale tick disposer from deleting replacement owner | unchanged |
| `.11` DOM Root Ownership | root owns app/observer teardown across remount/failure | unchanged |
| `.12` Warm Benchmark Baseline | 10% separate-context warm-up before each measurement/sample | Benchmark `2->3` |

Promoted commits for the second hardening train:

```text
.8   8fad34adb0d7db253a6593e7ffbeab3f28c28293
.9   7f562e20b335c4fdb449f74a8fd2a48c6378e182
.10  cc75d707f3a6ca492a6de6883c7ac59b871836c8
.11  b9d1be0d72cb1bb27d414349bc894726deb6ace3
.12  3de675d60ba46852f193b5cd319df2ce056aa00f
```

Latest exact-head runtime validation: PR #335 / exact head `10ab2c5af9ddcf0760f49817ff5a8c41ec1caa07` / Check `32160936491`, Node 24.19.0:

```text
tests       527
pass        527
fail        0
cancelled   0
skipped     0
Benchmark 3 success
Benchmark Sample success
```

Three-sample Benchmark 3 medians/spreads:

```text
player profiles  0.359021 ms/op   7.97%
enemy profiles   0.068446 ms/op  11.71%
basic attacks    0.000951 ms/op 191.11%
tick dispatch    0.000646 ms/op  61.69%
route lookup     0.007238 ms/op   5.16%
```

## Release discipline

A coherent checkpoint requires:

- one bounded implementation or maintenance contract;
- focused regression coverage;
- observed full Test and current Benchmark gates for runtime changes;
- deliberate Product/Account/Game/Data/Benchmark decisions;
- synchronized authority docs;
- a stop at the declared boundary.

Do not claim validation that did not run. Documentation-only synchronization after a green frozen runtime does not create a new runtime checkpoint.

## Next Phase 0.8 decision

Do **not** automatically begin `0.8.700`. A new work order should re-audit one bounded seam before implementation.

For maintenance, terminal timed-task retention is a known ownership seam but must not be solved by generic blind pruning. Domain owners must first define when terminal task IDs can be released safely.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
