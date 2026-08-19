# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.43
Package:       0.8.600
Account Save:  5
Game State:    9
Data:          37
Benchmark:     3
Codename:      Player Persistence Integration
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.43` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

A revision bump may record a coherent maintenance contract without advancing a feature track. Do not advance `TRACK` merely because maintenance occurred.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 9 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | benchmark workload/measurement comparability contract |

These versions advance independently.

### Persistence-version history through `.43`

Account Save 5, Data 37, and Benchmark 3 remained unchanged through the latest persistence trains.

- `.34` changed atlas timing from wall-clock `visitedAt` to canonical fictional `visitedAtWorldSeconds`: **Game State 6 → 7**.
- `.39` removed root `player.combat` and `player.statState` from serialized authority and made them post-validation reconstructed caches: **Game State 7 → 8**.
- `.41` changed valid persisted player-status modifier semantics to canonical nested modifier blocks: **Game State 8 → 9**.

Other revisions in those trains enforce/classify existing authority or repair runtime synchronization without changing serialized meaning, so they do not bump Game State.

Under the current pre-alpha policy there are no automatic migrations between those Game State versions. Old local saves are not a supported compatibility surface unless a future work order explicitly changes that policy.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 9 and contain complete required persisted authority before revival/reference relinking.
3. Raw validation runs before runtime `ensure*` helpers may normalize state.
4. Required persisted authority must already satisfy its declared current contract.
5. Optional persisted authority may be absent, but a present value must satisfy its domain contract.
6. Active owner/task links may reference active or just-completed tasks until domain reconciliation; terminal owner records may retain historical `taskId` after release.
7. Incompatible, incomplete, malformed, or legacy-shaped pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
8. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
9. The generic ordered migration utility remains available for a future migration only when compatibility is explicitly required or independently useful.
10. Persisted gameplay time uses canonical fictional time; wall-clock timestamps are not a substitute for simulation time.
11. Derived root player caches are omitted from save payloads and rebuilt only after current raw state validates.
12. Live battle RNG is transient and is not serialized gameplay authority.

### Current raw validation

Current Game State 9 raw validation covers:

```text
world time
simulation control
timed tasks
active Travel State 2
projects
commitments
relationships
resource opportunities
ecology
party
ability runtime
semantic events
atlas and POI discovery
player progression / lifetime training / learned skills
player capability registry
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical statuses
active battle when present
```

Optional persisted authority validates when present:

```text
work registry
player work proficiencies
day-cycle history
```

Derived/transient or post-revival state includes root `player.combat`, root `player.statState`, flat inventory alias identity, and `activeBattle.rng`.

Before adding another validator, classify state as persistent required authority, derived/transient, construction convenience, or optional persisted authority.

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

The old `.message` / `.reason` aliases remain removed. Adapters render `display.text` or consume semantic fields; domain logic must not parse presentation prose.

## Runtime/tooling baseline

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS with `actions/checkout@v7` and `actions/setup-node@v6`, concurrency cancellation, and a bounded job timeout.

Hosted Check runs:

```text
npm test
npm run benchmark
npm run benchmark:sample
```

## Benchmark protocol history

- **Benchmark 1** — historical workloads included setup in several timed loops.
- **Benchmark 2** — introduced at Product `0.8.600.9`; setup moved outside timed attack/tick/route workloads.
- **Benchmark 3 — current** — introduced at Product `0.8.600.12`; each workload receives a separate-context unreported warm-up equal to 10% of measured iterations.

Benchmark 3 is the current comparability baseline. No hard timing threshold is accepted yet.

## Latest maintenance train `.39`–`.43`

| Revision | Contract | PR | Exact head | Check | Tests | Promoted main |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `.39` | Derived Player Cache Contract / Game State 8 | #362 | `a94666003e54dedb96d8d4140b1b1cae04d7fd97` | `32273155030` | 632/632 | `16ce275995aae56c2d4da36dbce02ccd33647a25` |
| `.40` | Strict Player Equipment | #363 | `103b3a363153a30a25549d58063717b5eed666ee` | `32273809797` | 637/637 | `29d20cf78d1faae2c7ae08899211e439577fa515` |
| `.41` | Canonical Player Statuses / Game State 9 | #364 | `430dbb78bbbdaea72d2be9d4c1dcb82699c3d90d` | `32274840087` | 641/641 | `9cb2a32cbd3253bed099a8aabb31c68e7f7e252c` |
| `.42` | Strict Active Battle | #365 | `ce680fc35568df1a16a2feed30b1b7130d0b8eb6` | `32275555067` | 646/646 | `5526eba5fa3728b4212955a307b91b0ee72b4b2c` |
| `.43` | Player Persistence Integration | #366 | `2a10727dfa14734ca9c3031adf4bc368be592063` | `32276311018` | 648/648 | `daa1904c8287c5b16950142cef76edcfdd902d3d` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

Latest exact-head runtime evidence from `.43` / Check `32276311018`:

```text
648/648 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.314430 ms/op
enemy profiles   0.064417 ms/op
basic attacks    0.003578 ms/op
tick dispatch    0.000743 ms/op
route lookup     0.006808 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.316339 ms/op    4.33%
enemy profiles   0.058325 ms/op    5.66%
basic attacks    0.001355 ms/op  173.80%
tick dispatch    0.000598 ms/op   67.24%
route lookup     0.006198 ms/op    1.95%
```

Runtime freeze for this train: `daa1904c8287c5b16950142cef76edcfdd902d3d`.

## Timed-task ownership contract

Direct production task creators remain limited to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases only after its durable exactly-once consequence. There is no production generic/unowned task producer, so there is no accepted blind global task-history prune.

## Release discipline

A coherent runtime checkpoint requires one bounded contract, focused regression coverage, observed full Test and current Benchmark gates, deliberate version decisions, and promotion only after the exact head is green. Freeze runtime before documentation. Documentation-only synchronization after the freeze is not a new runtime validation checkpoint.

## Next Phase 0.8 decision

Do **not** automatically begin `0.8.700`.

For maintenance, the strongest next bounded investigation is the remaining root-player persistence boundary: classify identity, key items, and player flags before adding raw validation. Separately audit whether active-battle combatant combat profiles are intentionally durable encounter snapshots or should become reconstructible cache state. Do not mechanically combine those decisions.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam. Starting a new feature track requires an explicit fresh work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
