# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.51
Package:       0.8.600
Account Save:  5
Game State:    11
Data:          37
Benchmark:     3
Codename:      Derived Enemy Encounter Projection
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.51` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. A revision bump may record a coherent maintenance contract without advancing a feature track.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 11 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | benchmark workload/measurement comparability contract |

These versions advance independently.

### Persistence-version history

- `.34` changed atlas timing from wall-clock `visitedAt` to canonical fictional `visitedAtWorldSeconds`: **Game State 6 → 7**.
- `.39` removed root `player.combat` and `player.statState` from serialized authority: **Game State 7 → 8**.
- `.41` changed persisted player-status modifiers to canonical nested modifier blocks: **Game State 8 → 9**.
- `.50` removed reconstructible `state.npcs` runtime projection from serialized authority: **Game State 9 → 10**.
- `.51` removed reconstructible `state.enemies` encounter-template projection from serialized authority: **Game State 10 → 11**.

Under the current pre-alpha policy there are no automatic migrations between those Game State versions.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 11 and contain complete required persisted authority before revival/reference relinking.
3. Raw validation runs before runtime `ensure*` helpers or derived projection reconstruction may normalize state.
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
15. The persisted battle player must match the root player ID. While the encounter is active, its mutable resources/statuses and deterministic combat profile must agree with root combat-driving authority; terminal battle snapshots remain historical.
16. Root-owned combat skill gains during an active encounter must be synchronized into the battle-player snapshot before the encounter combat cache refreshes.
17. `state.npcs` is not serialized authority. It is rebuilt after raw validation from canonical seed NPC definitions plus persisted `state.party` companion authority.
18. `state.enemies` is not serialized authority. It is rebuilt after raw validation from canonical seed enemy definitions; supplied template data cannot override the catalog, and mutable ongoing enemy state belongs to `activeBattle`.

### Current raw validation

Current Game State 11 raw validation covers:

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
active battle player / root player live-authority coherence
state.log array pending dedicated ownership classification
```

Optional persisted authority validates when present:

```text
work registry
player work proficiencies
day-cycle history
```

Derived/transient or post-revival state includes `state.npcs`, `state.enemies`, root `player.combat`, root `player.statState`, flat inventory alias identity, and `activeBattle.rng`.

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

## Latest maintenance line `.44`–`.51`

| Revision | Contract | Validation PR | Exact validated head | Check | Runtime/main checkpoint |
| --- | --- | ---: | --- | ---: | --- |
| `.44` | Strict Player Identity Facts | #367 | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` | `6ef317c75d5181ddc316caeefe342d14492ab8e2` |
| `.45` | Strict Player Envelope and World Flags | #368 | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` |
| `.46` | Strict Battle Derived Caches | #369 | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` | `2e143daf63f8874d6135e61af79ddfcd474fc418` |
| `.47` | Strict Current Location State | #371 | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` | `1c8698147a98e80a0a519aadb520f6808fe61323` |
| `.48` | Strict Combat Identity Sequence | #372 | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` |
| `.49` | Strict Active Battle Player Link | #373 validation-only | `49df1a5379da51e15cfb3ce0320008047a70c768` | `32290206583` | `49df1a5379da51e15cfb3ce0320008047a70c768` |
| `.50` | Derived NPC World Projection | #374 validation-only | `181bc67b69172390d1a59fa3dfca35980a026b3d` | `32292959171` | `181bc67b69172390d1a59fa3dfca35980a026b3d` |
| `.51` | Derived Enemy Encounter Projection | #375 validation-only | `5a97a109d9476438d001ee75b8e20293f57360dd` | `32297557960` | `5a97a109d9476438d001ee75b8e20293f57360dd` |

Every final validated head passed Test, Benchmark 3, and Benchmark Sample. `.49` passed 676/676 tests; `.50` passed 680/680; `.51` passed 684/684 on Node 24.19.0.

Revisions `.49`–`.51` were direct-main bounded maintenance packets. Validation-only PRs #373–#375 existed solely to expose the standard pull-request Check for the corresponding frozen `main` SHA through the available connector; all were closed without merge after validation.

### `.50` and `.51` version decisions

Both revisions changed serialized Game State shape after dedicated ownership audits rather than adding broad validators.

For `.50`, `state.npcs` proved to be an authored/party-derived world projection. Companion continuity remains durably owned by `state.party`; schedules, relationships and commitments retain separate authorities. Save encoding omits the projection and revival reconstructs it after raw validation, advancing Game State 9 → 10.

For `.51`, `state.enemies` proved to be an authored encounter-template projection. Production does not mutate the array. Place spawn rules and opportunities reference stable enemy IDs, `startEncounter()` resolves a template, and the unique combatant snapshot under `activeBattle` owns mutable encounter resources/statuses/actions/phase. Factory-created combat/resources on seed templates are deterministic construction data. Save encoding omits `state.enemies` and revival reconstructs fresh templates after raw validation, advancing Game State 10 → 11.

Account Save 5, Data 37, Benchmark 3, and Package 0.8.600 remain unchanged. No pre-alpha compatibility migrations were added.

## Latest runtime evidence

Exact validated `.51` gate: validation-only PR #375, head `5a97a109d9476438d001ee75b8e20293f57360dd`, Check `32297557960`, Node 24.19.0:

```text
684/684 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.360644 ms/op
enemy profiles   0.069621 ms/op
basic attacks    0.002998 ms/op
tick dispatch    0.000941 ms/op
route lookup     0.007920 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.361064 ms/op    3.82%
enemy profiles   0.067427 ms/op    9.06%
basic attacks    0.001015 ms/op  191.25%
tick dispatch    0.000908 ms/op   38.68%
route lookup     0.007617 ms/op    8.23%
```

Runtime freeze: `5a97a109d9476438d001ee75b8e20293f57360dd`.

## Timed-task ownership contract

Direct production task creators remain limited to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases only after its durable exactly-once consequence. There is no production generic/unowned task producer and no accepted blind global task-history prune.

## Release discipline

A coherent runtime checkpoint requires one bounded contract, focused regression coverage, observed full Test and current Benchmark gates, deliberate version decisions, and direct-main completion only after the exact head is green. Freeze runtime before documentation. Documentation-only synchronization after the freeze is not a new runtime validation checkpoint.

## Next Phase 0.8 decision

Do **not** automatically begin `0.8.700`.

The `state.npcs` and `state.enemies` classifications are complete. The remaining broad persisted array must be audited separately before another raw-boundary change:

- `state.log`: presentation/command history versus durable player-facing history or compatibility baggage; do not confuse it with semantic event authority.

Do not broaden that work into a presentation rewrite or combine it with a new feature track.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam. Starting a new feature track requires an explicit fresh work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.