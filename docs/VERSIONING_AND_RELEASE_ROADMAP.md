# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.48
Package:       0.8.600
Account Save:  5
Game State:    9
Data:          37
Benchmark:     3
Codename:      Strict Combat Identity Sequence
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.48` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. A revision bump may record a coherent maintenance contract without advancing a feature track.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 9 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | benchmark workload/measurement comparability contract |

These versions advance independently.

### Persistence-version history

- `.34` changed atlas timing from wall-clock `visitedAt` to canonical fictional `visitedAtWorldSeconds`: **Game State 6 → 7**.
- `.39` removed root `player.combat` and `player.statState` from serialized authority and made them post-validation reconstructed caches: **Game State 7 → 8**.
- `.41` changed valid persisted player-status modifier semantics to canonical nested modifier blocks: **Game State 8 → 9**.

Other later revisions enforce/classify existing authority or repair runtime synchronization without changing serialized meaning. Under the current pre-alpha policy there are no automatic migrations between those Game State versions.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 9 and contain complete required persisted authority before revival/reference relinking.
3. Raw validation runs before runtime `ensure*` helpers may normalize state.
4. Required persisted authority must already satisfy its declared current contract.
5. Optional persisted authority may be absent, but a present value must satisfy its domain contract.
6. Active owner/task links may reference active or just-completed tasks until domain reconciliation.
7. Incompatible, incomplete, malformed, or legacy-shaped pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
8. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
9. The generic ordered migration utility remains available only for a future deliberate migration.
10. Persisted gameplay time uses canonical fictional time; wall-clock timestamps are not a substitute for simulation time.
11. Root player combat/stat caches are omitted from saves and rebuilt only after current raw state validates.
12. Active-battle deterministic combat/stat snapshots are persisted and validated; live battle RNG is transient.
13. Current place ID, display location, and position must form one canonical persisted location state.
14. `combatSequence` is the encounter-ID allocator and must agree with `activeBattle.id` when a battle exists.

### Current raw validation

Current Game State 9 raw validation covers:

```text
world time / simulation control / timed tasks
active Travel State 2 and owner/task links
projects / commitments / relationships
resource opportunities / ecology
party / ability runtime
semantic events
atlas and POI discovery
player envelope / identity / key items / flags
player progression / training / skills / capabilities
player inventory / mutable resources / wallet
equipment / canonical statuses
top-level world flags
current location/position coherence
combat identity sequence
active battle and deterministic encounter combat/stat snapshots
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

The old `.message` / `.reason` aliases remain removed. Domain logic must not parse presentation prose.

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
- **Benchmark 2** — Product `0.8.600.9`; setup moved outside timed attack/tick/route workloads.
- **Benchmark 3 — current** — Product `0.8.600.12`; each workload receives a separate-context unreported warm-up equal to 10% of measured iterations.

Benchmark 3 is the current comparability baseline. No hard timing threshold is accepted yet.

## Latest maintenance train `.44`–`.48`

| Revision | Contract | PR | Exact head | Check | Promoted main |
| --- | --- | ---: | --- | ---: | --- |
| `.44` | Strict Player Identity Facts | #367 | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` | `6ef317c75d5181ddc316caeefe342d14492ab8e2` |
| `.45` | Strict Player Envelope and World Flags | #368 | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` |
| `.46` | Strict Battle Derived Caches | #369 | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` | `2e143daf63f8874d6135e61af79ddfcd474fc418` |
| `.47` | Strict Current Location State | #371 | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` | `1c8698147a98e80a0a519aadb520f6808fe61323` |
| `.48` | Strict Combat Identity Sequence | #372 | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` |

Every final head passed Test, Benchmark 3, and Benchmark Sample before promotion. `.47` passed 665/665 tests; `.48` passed 670/670 tests on Node 24.19.0.

### `.44`–`.48` version decision

Account Save 5, Game State 9, Data 37, and Benchmark 3 remain unchanged. These revisions tighten existing Game State 9 invariants rather than changing serialized shape or meaning:

- `.44` classifies canonical player identity, key items, and boolean player flags as strict durable facts.
- `.45` validates the stable player envelope and boolean top-level world conditions.
- `.46` validates already-persisted deterministic active-battle combat/stat snapshots against recomputation.
- `.47` enforces coherence among already-persisted current place, display name, and position.
- `.48` enforces coherence between the existing encounter sequence allocator and active battle identity.

## Latest runtime evidence

Exact validated `.48` gate: PR #372, head `8cdc20aecf40201e82cd560eccd19d7f34700798`, Check `32287076773`, Node 24.19.0:

```text
670/670 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.268864 ms/op
enemy profiles   0.052262 ms/op
basic attacks    0.003205 ms/op
tick dispatch    0.000825 ms/op
route lookup     0.005607 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.260915 ms/op    6.23%
enemy profiles   0.050549 ms/op    8.78%
basic attacks    0.001223 ms/op  224.79%
tick dispatch    0.000587 ms/op  123.28%
route lookup     0.005258 ms/op    8.89%
```

Runtime freeze for this train: `512f8c3d5edbb22d07d857fa98d6f0755d043d89`.

## Timed-task ownership contract

Direct production task creators remain limited to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases only after its durable exactly-once consequence. There is no production generic/unowned task producer and no accepted blind global task-history prune.

## Release discipline

A coherent runtime checkpoint requires one bounded contract, focused regression coverage, observed full Test and current Benchmark gates, deliberate version decisions, and promotion only after the exact head is green. Freeze runtime before documentation. Documentation-only synchronization after the freeze is not a new runtime validation checkpoint.

## Next Phase 0.8 decision

Do **not** automatically begin `0.8.700`.

For maintenance, separately classify the remaining broad persisted arrays before adding new raw validation:

- `state.npcs`: authored/seeded identity versus mutable persistent world state and companion-backed continuity;
- `state.enemies`: authored encounter definitions versus mutable runtime entity state and derived caches;
- `state.log`: presentation history versus durable player-facing history; do not confuse it with semantic event authority.

Do not mechanically combine these into a single entity validator.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam. Starting a new feature track requires an explicit fresh work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
