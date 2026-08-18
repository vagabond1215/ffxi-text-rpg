# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.17
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Bounded Task Retention
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.17` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

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

`tests/architectureDebtGuard.test.js` guards selected removed compatibility surfaces from returning. Long-session and lifecycle-specific guards additionally cover multi-day save/load, tick subscription ownership, browser-root resource teardown, owner-gated terminal task release, and mixed task-retention steady state.

## Benchmark protocol history

Benchmark version changes are deliberate comparability boundaries.

### Benchmark 1

Historical workload. Several timed loops included fixture/setup work such as tick subscription setup, game-state construction for route lookup, and battle/entity construction for attack measurement.

### Benchmark 2

Introduced at Product `0.8.600.9`. Setup was moved outside the timed regions for basic attacks, steady tick dispatch, and route lookup. Player/enemy profile creation remained intentionally measured as creation workloads. Because this changed what the numbers meant, Benchmark advanced `1 -> 2`.

### Benchmark 3 — current

Introduced at Product `0.8.600.12`. Every workload now receives an unreported warm-up equal to 10% of measured iterations on a separate setup context before timing begins. Because warm-up changes the measurement protocol and cold/JIT contribution, Benchmark advanced `2 -> 3`.

Benchmark 3 is the current baseline. Numeric results from Benchmark 1/2 must not be described as directly improving/regressing against Benchmark 3.

No hard timing threshold is accepted yet. The latest hosted sample still shows substantial relative variance on very short basic-attack measurements, though the longer profile/route workloads remain more stable.

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

## `0.8.600.2`–`.17` maintenance history

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
| `.13` Owner-Gated Task Release | terminal-only `releaseTimedTask`; campaign recovery releases after exactly-once consequence reconciliation | unchanged |
| `.14` Work/Project Task Release | work/project terminal transitions release task records while retaining correlation IDs | unchanged |
| `.15` Transport Task Release | arrival/cancellation release terminal task after location/state/event transition | unchanged |
| `.16` Ability/Resource Task Release | ability resolution/interruption and resource recovery/storage outcomes release terminal tasks after durable consequences | unchanged |
| `.17` Bounded Task Retention | mixed repeated owner-managed lifecycles return task registry to one intentional generic-terminal baseline across save/load | unchanged |

Promoted commits for the terminal-task hardening train:

```text
.13  be8db394e81da0e2aa96069efb7df51cd0b68b9b
.14  f7d51365f13fa1cb703383ec4799934e07a3f90f
.15  588d6dd0e0a882a6cfdc76d60797c0488330141d
.16  67ec4ea8ae19b1032894a604ed372802d794cf92
.17  e4ebdbc14776329156f2df2dee8c598e3b8b91cb
```

Exact-head validation for the train:

| Revision | PR | Exact head | Check | Tests |
| --- | ---: | --- | ---: | ---: |
| `.13` | #336 | `d3d7beeba9d605a7a94d397ed3827e97f7b1e434` | `32162369191` | 529/529 |
| `.14` | #337 | `fcea01f324067a60af440378a0647767c5bb5cab` | `32162896278` | 533/533 |
| `.15` | #338 | `3086f424259b441fd644338ad3e65e9b860938db` | `32163232356` | 533/533 |
| `.16` | #339 | `d596e0a86e71ac2dc5b74c552b5f98a5ff2b621a` | `32163982824` | 533/533 |
| `.17` | #340 | `666d2f432c3db097012ef035d2e4655405c5747d` | `32168023319` | 534/534 |

Every listed head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

Latest exact-head runtime validation: PR #340 / head `666d2f432c3db097012ef035d2e4655405c5747d` / Check `32168023319`:

```text
tests       534
pass        534
fail        0
cancelled   0
skipped     0
Benchmark 3 success
Benchmark Sample success
```

Latest three-sample Benchmark 3 medians/spreads:

```text
player profiles  0.359505 ms/op   6.21%
enemy profiles   0.070873 ms/op  10.10%
basic attacks    0.001285 ms/op 189.74%
tick dispatch    0.000798 ms/op  28.18%
route lookup     0.007662 ms/op   6.59%
```

## Timed-task release/retention contract

`releaseTimedTask` may remove only terminal task records. Active release is rejected, and `nextSequence` remains monotonic so released task IDs are not reused.

Domain owners release only after their durable consequence is established:

- campaign recovery after recovery consequence/event reconciliation;
- work after completed/failed/awaiting-storage/cancelled transition;
- projects after completion/cancellation;
- transport after arrival/cancellation;
- abilities after resolution/cooldown/effects or interruption;
- resource recovery after recovered/failed-storage outcome and completion event.

An unreconciled terminal task survives save/load until its owner consumes it. Domain records/results/events may keep `taskId` only as historical correlation after release.

Generic/unowned terminal history is intentionally **not** centrally pruned yet. The `.17` soak proves owner-managed gameplay task retention returns to steady state; a separate generic history cap should be introduced only if a concrete diagnostic/history requirement justifies it.

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

Do **not** automatically begin `0.8.700`. A new feature work order should re-audit one bounded seam before implementation.

For maintenance, the prior terminal-task ownership seam is now closed for known direct owners. The next bounded question is whether generic/unowned terminal tasks require any history/diagnostic retention policy at all. Audit real producers/consumers first; do not add a central prune merely because the mechanism exists.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
