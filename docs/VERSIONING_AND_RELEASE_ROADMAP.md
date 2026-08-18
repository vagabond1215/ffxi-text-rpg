# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.38
Package:       0.8.600
Account Save:  5
Game State:    7
Data:          37
Benchmark:     3
Codename:      Strict Player Wallet
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.38` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

A revision bump may record a coherent maintenance contract without advancing a feature track. Do not advance `TRACK` merely because maintenance occurred.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 7 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | benchmark workload/measurement comparability contract |

These versions advance independently.

### `.33`–`.38` version decision

Account Save 5, Data 37, and Benchmark 3 remain unchanged throughout `.33`–`.38`.

- `.33` extracts raw-safe validation for existing durable player progression/training/skills; no persisted meaning change.
- `.34` changes persisted atlas discovery timing from wall-clock ISO `visitedAt` to canonical fictional `visitedAtWorldSeconds`, and adds strict atlas/POI discovery authority. **Game State advances 6 → 7.**
- `.35` classifies work proficiencies as optional persisted authority; stored shape is unchanged.
- `.36` validates existing mutable HP/MP/TP values without promoting derived combat profiles to authority.
- `.37` classifies day-cycle summaries as optional persisted authority and validates the existing canonical-day bookkeeping.
- `.38` validates the existing canonical wallet key/balance contract without renaming currency or changing economic meaning.

The Game State 7 bump at `.34` is deliberate because serialized field meaning changed. The other revisions are enforcement/classification changes and therefore remain Game State 7. No authored-data identity changed and Benchmark 3 protocol did not change.

Under the current pre-alpha policy there is no automatic Game State 6 → 7 migration. Old local saves are not a supported compatibility surface unless a future work order explicitly changes that policy.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 7 and contain complete required persisted authority before revival/reference relinking.
3. Raw validation runs before runtime `ensure*` helpers may normalize state.
4. Required persisted authority must already satisfy its declared current contract.
5. Optional persisted authority may be absent, but a present value must satisfy its domain contract.
6. Active owner/task links may reference active or just-completed tasks until domain reconciliation; terminal owner records may retain historical `taskId` after release.
7. Incompatible, incomplete, malformed, or legacy-shaped pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
8. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
9. The generic ordered migration utility remains available for a future migration only when compatibility is explicitly required or independently useful.
10. Persisted gameplay time uses canonical fictional time; wall-clock timestamps are not a substitute for simulation time.

### Current raw validation

Current Game State 7 raw validation covers:

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
player discipline progression / lifetime training / learned skills
player capability registry
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
```

Optional persisted authority validates when present:

```text
work registry
player work proficiencies
day-cycle history
```

Separate active-owner checks require consistent persisted timed-task links for active travel, projects, work, timed abilities, and resource recovery.

Before adding another validator, classify state as persistent required authority, derived/transient, construction convenience, or optional persisted authority.

The raw boundary deliberately does **not** compose broad `validatePlayer()`. Flat `player.inventory` alias identity remains post-revival. `player.combat` and derived stat/resource maxima remain projections. `player.statState` requires a dedicated cache/ownership audit before changing its persistence role.

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

## Maintenance history

Revisions `.2`–`.22` established current-schema cleanup, canonical command/action contracts, carried inventory authority, Node 24/current Actions, deterministic long-session/benchmark evidence, explicit lifecycle ownership, terminal task release, task-owner guards, strict active travel, task-registry validation, and positive active-task persistence evidence.

Revisions `.23`–`.27` composed raw validators for projects, continuity, resource opportunities, ecology, party, and ability runtime.

Revisions `.28`–`.32` composed strict world/simulation, player capability, inventory, semantic-event, and optional work validation.

### Strict persistence train `.33`–`.38`

| Revision | Contract | PR | Exact head | Check | Tests | Promoted main |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `.33` | Strict Player Progression | #356 | `98c1d2e9c6499fb85256b40c5d225c329b623e7c` | `32186702816` | 607/607 | `4a4710464c0b47fc6abe0fdc924e70e3d1681577` |
| `.34` | Canonical Discovery Time / Game State 7 | #357 | `3037e1a7ad3e9883b9dce0252866290bf1e52917` | `32196254452` | 611/611 | `cfaa7ce2c7afa613925f51c94aa2d12b311cd8e9` |
| `.35` | Strict Work Proficiencies | #358 | `f01dbe687d434f88b61c72e7889a61e09bec8ff4` | `32196637167` | 616/616 | `be4c29eb5e4dd60993da113f3ccfa2241b8b06b8` |
| `.36` | Strict Player Resources | #359 | `fec79d286c9d6ed117b92375bddaffd9e8f04f56` | `32196927507` | 620/620 | `3759f130174d804ccb76c9b243dca4d7826b10c1` |
| `.37` | Strict Day Cycle | #360 | `29aecd95fd92930330b64734dd24a573c93d4cda` | `32197342668` | 625/625 | `4dd5b126b37810a807c5f1e03c074c68178ede06` |
| `.38` | Strict Player Wallet | #361 | `a356c67124167ab60efd4cf4a57c742d3d94c355` | `32197699859` | 629/629 | `dc588d194211ccaed671d58362617bea6b2c5a73` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

Latest exact-head runtime evidence from `.38` / Check `32197699859`:

```text
629/629 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.352213 ms/op
enemy profiles   0.066914 ms/op
basic attacks    0.003626 ms/op
tick dispatch    0.000750 ms/op
route lookup     0.007245 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.332962 ms/op    7.70%
enemy profiles   0.063346 ms/op   11.90%
basic attacks    0.001369 ms/op  150.99%
tick dispatch    0.000825 ms/op   33.05%
route lookup     0.007222 ms/op    5.66%
```

Runtime freeze for this train: `dc588d194211ccaed671d58362617bea6b2c5a73`.

## Timed-task ownership contract

Direct production task creators remain limited to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases only after its durable exactly-once consequence. There is no production generic/unowned task producer, so there is no accepted blind global task-history prune.

## Release discipline

A coherent runtime checkpoint requires one bounded contract, focused regression coverage, observed full Test and current Benchmark gates, deliberate version decisions, and promotion only after the exact head is green. Freeze runtime before documentation. Documentation-only synchronization after the freeze is not a new runtime validation checkpoint.

## Next Phase 0.8 decision

Do **not** automatically begin `0.8.700`.

For maintenance, the strongest next bounded persistence investigation is the derived combat/stat cache boundary:

- audit direct production reads/writes/reconstruction of `player.combat` and `player.statState`;
- separate durable character-base authority from deterministic cache/projection state;
- decide whether each field should persist, validate, or be recomputed on load;
- only then modify the raw required-field list or save/load behavior.

Durable equipment/status persistence is a separate later candidate and should not be mechanically combined with that audit.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam. Starting a new feature track requires an explicit fresh work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
