# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.22
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Active Task Persistence Matrix
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.22` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

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

These versions advance independently. Maintenance that enforces an already-declared current contract does not require a schema/data bump merely because validation became stricter.

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
3. Current persisted registries/active owner links that are validated at the raw boundary must already satisfy their declared contract; load does not manufacture replacement task/travel state.
4. Incompatible or incomplete pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
5. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
6. The generic ordered migration utility remains available for a future migration only when compatibility is explicitly required or independently useful.

Current task-related raw validation covers:

- timed-task registry version/records/status/timing/duplicates/monotonic sequence;
- Travel State 2 plus the active travel/task link;
- active project/work/timed-ability/resource-recovery task ownership.

Active owner links may point to an active or just-completed task until the owner reconciles. Terminal owner records may retain historical `taskId` after terminal task release.

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

Hosted Check runs:

```text
npm test
npm run benchmark
npm run benchmark:sample
```

`tests/architectureDebtGuard.test.js` now also guards the exact direct timed-task owner set and prevents runtime legacy active-travel reconstruction from returning.

## Benchmark protocol history

Benchmark version changes are deliberate comparability boundaries.

### Benchmark 1

Historical workload. Several timed loops included fixture/setup work such as tick subscription setup, game-state construction for route lookup, and battle/entity construction for attack measurement.

### Benchmark 2

Introduced at Product `0.8.600.9`. Setup was moved outside the timed regions for basic attacks, steady tick dispatch, and route lookup. Player/enemy profile creation remained intentionally measured as creation workloads. Benchmark advanced `1 -> 2` because the measurement meaning changed.

### Benchmark 3 — current

Introduced at Product `0.8.600.12`. Every workload receives an unreported warm-up equal to 10% of measured iterations on a separate setup context before timing begins. Benchmark advanced `2 -> 3` because warm-up changed comparability.

Benchmark 3 is the current baseline. Numeric results from Benchmark 1/2 must not be described as direct improvement/regression against Benchmark 3. No hard timing threshold is accepted yet.

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

## Maintenance history `.2`–`.22`

| Revision | Contract | Independent-version decision |
| --- | --- | --- |
| `.2` Current Schema Cleanup | canonical persistence/home identifiers; obsolete migration/theme/transport cleanup | Account `4->5`, Game `5->6`, Data `36->37` |
| `.3` Canonical Command Contract | remove FFXI runtime macro adapter/aliases; remove ambiguous version aliases | unchanged |
| `.4` Strict Current Schema | reject incomplete Game State 6 before revival | unchanged |
| `.5` Carried Commitment Delivery | canonical carried-container facts + atomic removal | unchanged |
| `.6` Canonical Action Results | remove ActionResult compatibility aliases | unchanged |
| `.7` Runtime Architecture Guardrails | Node 24 + current Actions + executable debt guards | unchanged |
| `.8` Long Session Evidence | sampled benchmark + deterministic 130-day save/load smoke | unchanged |
| `.9` Benchmark Protocol V2 | separate setup from attack/tick/route timing | Benchmark `1->2` |
| `.10` Subscription Ownership | stale disposer cannot delete replacement tick owner | unchanged |
| `.11` DOM Root Ownership | root owns app/observer cleanup | unchanged |
| `.12` Warm Benchmark Baseline | separate-context 10% warm-up | Benchmark `2->3` |
| `.13` Owner-Gated Task Release | terminal-only release + campaign recovery reconciliation proof | unchanged |
| `.14` Work/Project Task Release | release after durable terminal transitions | unchanged |
| `.15` Transport Task Release | release after arrival/cancellation | unchanged |
| `.16` Ability/Resource Task Release | release after durable resolution/recovery outcome | unchanged |
| `.17` Bounded Task Retention | mixed repeated owner lifecycle soak | unchanged |
| `.18` Task Owner Guard | direct production task creation restricted to six audited release owners; managed task steady state zero | unchanged |
| `.19` Strict Active Travel | remove runtime legacy reconstruction; enforce Travel State 2/task link at raw save boundary | unchanged |
| `.20` Active Task Link Integrity | validate active project/work/ability/resource owner task links before revival | unchanged |
| `.21` Strict Task Registry | validate full task registry before revival | unchanged |
| `.22` Active Task Persistence Matrix | positive active save/load/reconcile/release evidence across all six owners | unchanged |

Latest hardening train `.18`–`.22`:

| Revision | PR | Exact head | Check | Tests | Promoted main |
| --- | ---: | --- | ---: | ---: | --- |
| `.18` | #341 | `340e0088f93bac89d00bd37e4be5800d065275c3` | `32169108628` | 535/535 | `6dbea79abd82dab5b4dc9e1b141a409383937530` |
| `.19` | #342 | `45918eda8b144c2a3ab1cc6c0eb8599eb58923e2` | `32169787083` | 539/539 | `fcd435c0c3802c7301670a4c48700def1c2465e7` |
| `.20` | #343 | `d2d3376e19ad3e4a6df79fcef7040afde7053819` | `32170142917` | 543/543 | `2c11cda829c407dea6564c4eb622e17238f8dc4c` |
| `.21` | #344 | `7b269d0a17d6d07237c281288c9b7d03365ec354` | `32170589178` | 547/547 | `8c3995d8957dfa3a9542688d9cc8dc79e69a1903` |
| `.22` | #345 | `be561e922f1b0316727e13a91381595418b956e2` | `32171224914` | 550/550 | `7a148ebdff594523f956ed6be83aba59e26d564f` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

Latest Benchmark 3 single run from Check `32171224914`:

```text
player profiles  0.394555 ms/op
enemy profiles   0.071987 ms/op
basic attacks    0.003521 ms/op
tick dispatch    0.001158 ms/op
route lookup     0.007919 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.364139 ms/op   7.99%
enemy profiles   0.070800 ms/op  11.17%
basic attacks    0.001303 ms/op 219.89%
tick dispatch    0.000713 ms/op  18.43%
route lookup     0.007434 ms/op   6.93%
```

## Timed-task ownership contract

`releaseTimedTask` removes terminal task records only. Active release is rejected, and `nextSequence` remains monotonic.

Direct production task creators are currently limited to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases only after its durable exactly-once consequence.

There is no production generic/unowned task producer at the `.22` baseline. Consequently there is no accepted generic history cap or global task prune. Future direct owners must establish ownership/reconciliation/release semantics before being admitted by the architecture guard.

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

Do **not** automatically begin `0.8.700`.

For maintenance, the strongest next bounded audit is current-schema validator composition for other required persisted registries. Inspect one registry family at a time and distinguish required persistent authority from derived/transient/construction convenience before tightening rejection behavior.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
