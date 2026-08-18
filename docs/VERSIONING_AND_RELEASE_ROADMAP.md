# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.27
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Character Runtime
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.27` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

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

These versions advance independently. Maintenance that enforces an already-declared current contract does not require a schema/data bump merely because validation became stricter. Revisions `.23`–`.27` therefore leave Account Save 5, Game State 6, Data 37, and Benchmark 3 unchanged: they reject malformed states that were already outside the intended current contract; they do not change persisted shape or meaning.

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
3. Raw Game State 6 validation runs before runtime `ensure*` helpers may normalize state.
4. Required persisted domain registries must already satisfy their declared validator at the raw boundary.
5. Active owner/task links may reference active or just-completed tasks until domain reconciliation; terminal owner records may retain historical `taskId` after release.
6. Incompatible, incomplete, malformed, or legacy-shaped pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
7. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
8. The generic ordered migration utility remains available for a future migration only when compatibility is explicitly required or independently useful.

### Current raw domain validation

Current Game State 6 validation composes domain validators for:

```text
timed tasks
active Travel State 2
projects
commitments
relationships
resource opportunities
ecology
party
ability runtime
```

Separate active-owner checks require consistent persisted timed-task links for active travel, projects, work, timed abilities, and resource recovery.

Before adding another validator, classify the state as:

1. **persistent required authority** — validate before revival;
2. **derived/transient** — recompute freely;
3. **construction convenience** — initialize in new-state/factory paths, not as implicit load migration.

Historical lazy-initialization tests may remain useful construction/runtime tests; they are not a promise that incomplete current Game State 6 saves will load.

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

`tests/architectureDebtGuard.test.js` guards selected retired compatibility surfaces, the exact direct timed-task owner set, and removal of runtime legacy active-travel reconstruction.

## Benchmark protocol history

Benchmark version changes are deliberate comparability boundaries.

- **Benchmark 1** — historical workloads included setup in several timed loops.
- **Benchmark 2** — introduced at Product `0.8.600.9`; setup moved outside timed attack/tick/route workloads.
- **Benchmark 3 — current** — introduced at Product `0.8.600.12`; every workload receives a separate-context unreported warm-up equal to 10% of measured iterations.

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

Historical `0.8.600.1` checkpoint: `04211e8909996b1ac34fa91ae1cdd7aa216b86f8`, 511/511 tests, Benchmark 1, Account Save 4, Game State 5, Data 36.

## Maintenance history `.2`–`.27`

| Revision | Contract | Independent-version decision |
| --- | --- | --- |
| `.2` Current Schema Cleanup | canonical persistence/home identifiers; obsolete migration/theme/transport cleanup | Account `4->5`, Game `5->6`, Data `36->37` |
| `.3` Canonical Command Contract | remove FFXI runtime command compatibility and ambiguous version aliases | unchanged |
| `.4` Strict Current Schema | reject incomplete Game State 6 before revival | unchanged |
| `.5` Carried Commitment Delivery | one carried-container authority + atomic removal | unchanged |
| `.6` Canonical Action Results | remove ActionResult compatibility aliases | unchanged |
| `.7` Runtime Architecture Guardrails | Node 24 + current Actions + executable debt guards | unchanged |
| `.8` Long Session Evidence | benchmark sampling + deterministic 130-day save/load smoke | unchanged |
| `.9` Benchmark Protocol V2 | separate setup from attack/tick/route timing | Benchmark `1->2` |
| `.10` Subscription Ownership | stale disposer cannot delete replacement tick owner | unchanged |
| `.11` DOM Root Ownership | root owns app/observer cleanup | unchanged |
| `.12` Warm Benchmark Baseline | separate-context 10% warm-up | Benchmark `2->3` |
| `.13` Owner-Gated Task Release | terminal-only release + campaign recovery reconciliation proof | unchanged |
| `.14` Work/Project Task Release | release after durable terminal transitions | unchanged |
| `.15` Transport Task Release | release after arrival/cancellation | unchanged |
| `.16` Ability/Resource Task Release | release after durable resolution/recovery outcome | unchanged |
| `.17` Bounded Task Retention | mixed repeated owner lifecycle soak | unchanged |
| `.18` Task Owner Guard | direct production task creation restricted to six audited release owners | unchanged |
| `.19` Strict Active Travel | remove runtime legacy reconstruction; enforce Travel State 2/task link | unchanged |
| `.20` Active Task Link Integrity | validate active project/work/ability/resource task links | unchanged |
| `.21` Strict Task Registry | validate full timed-task registry before revival | unchanged |
| `.22` Active Task Persistence Matrix | positive active save/load/reconcile/release evidence across all six owners | unchanged |
| `.23` Strict Project Registry | compose project registry validator at raw current-schema boundary | unchanged |
| `.24` Strict Continuity Registries | compose commitment + relationship validators before revival | unchanged |
| `.25` Strict Resource Opportunities | compose resource-opportunity validator before recovery reconciliation | unchanged |
| `.26` Strict Ecology Registry | compose persistent ecology validator before runtime access | unchanged |
| `.27` Strict Character Runtime | compose Party + Ability runtime validators before `ensure*` normalization | unchanged |

### Strict-registry train `.23`–`.27`

| Revision | PR | Exact head | Check | Tests | Promoted main |
| --- | ---: | --- | ---: | ---: | --- |
| `.23` | #346 | `9facc76633f706cf808371e60b24ce901c0659af` | `32172651042` | 555/555 | `d99d8b56cb3a79f24a3aa9c1c0212ca21c7b8e74` |
| `.24` | #347 | `e71cbfe13ec08f39462cfad59a3793643e478c25` | `32173390833` | 560/560 | `d9fab2ac9096243687afc72ef5c9faac16a27216` |
| `.25` | #348 | `1251d915706f4c7e4c1a795512aa1e24f4eea17b` | `32173721913` | 565/565 | `8b15db6696bb38988e023935df13345dac5574d8` |
| `.26` | #349 | `ae497c08ffa017a76d5baa2ba190cde39c1c4a3a` | `32174111312` | 569/569 | `d1f55853a366604cf36b274c915935dd7978575b` |
| `.27` | #350 | `5d0d8071d9f94cac818c43a1fe018583eb56286f` | `32174533957` | 575/575 | `bccd49848593e47e7f5b3d69e0132d3a598ebe4a` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

Latest Benchmark 3 evidence from `.27` / Check `32174533957`:

```text
single run
player profiles  0.381457 ms/op
enemy profiles   0.067924 ms/op
basic attacks    0.003165 ms/op
tick dispatch    0.000865 ms/op
route lookup     0.007660 ms/op

three-sample medians/spreads
player profiles  0.357477 ms/op   6.21%
enemy profiles   0.064718 ms/op   8.92%
basic attacks    0.001198 ms/op 200.77%
tick dispatch    0.000698 ms/op  69.53%
route lookup     0.007425 ms/op  17.56%
```

## Timed-task ownership contract

`releaseTimedTask` removes terminal task records only. Active release is rejected, and `nextSequence` remains monotonic.

Direct production task creators are limited to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases only after its durable exactly-once consequence. There is no production generic/unowned task producer at the `.27` baseline, so there is no accepted generic history cap or global task prune.

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

For maintenance, the next bounded persistence audit should inspect **remaining top-level/player state families not yet governed by a dedicated raw-domain validator**. Choose one family with meaningful authoritative invariants, classify it first, and only then decide whether raw validation is warranted. Do not mechanically attach validators to projections, caches, or construction convenience.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
