# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.52
Package:       0.8.600
Account Save:  5
Game State:    12
Data:          37
Benchmark:     3
Codename:      Transient Command Presentation Log
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.52` are maintenance/hardening revisions and do not open `0.8.700`.**

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Declared persistent authorities remain canonical; projections and presentation remain derived. Legacy FFXI-derived material is research/reference only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics | **Complete** |
| `0.7` | Multi-region playable alpha | **Complete** |
| `0.8` | Life and infrastructure expansion | **In progress** |
| `0.9` | Adventure depth and release hardening | Planned |
| `1.0` | Live foundation | Planned |

## Phase 0.8 feature tracks

| Track | Gate | Status |
| --- | --- | --- |
| `0.8.100` | Home foothold: durable storage from regional materials + project labor | **Complete** |
| `0.8.200` | Home workshop: locality-bound production capability | **Complete** |
| `0.8.300` | Carried-load transport from actual inventory | **Complete** |
| `0.8.400` | Earned Field Satchel portable logistics | **Complete** |
| `0.8.500` | Fictional-time NPC availability | **Complete** |
| `0.8.600` | Companion convalescence and safe reunion | **Complete** |

Historical feature-track checkpoints remain recorded in git history and earlier roadmap revisions.

## Maintenance history

Revisions `.2`–`.38` established current-schema cleanup, canonical action/command boundaries, deterministic simulation and lifecycle ownership, strict domain registries, fictional-time discovery, and progressively stricter persisted player/runtime state.

Revisions `.39`–`.43` established Game State 8/9 player-persistence rules: root derived caches removed from save authority, equipment strictness, canonical status persistence, active battle persistence, and integrated cache resynchronization.

### Persistence hardening and authority classification `.44`–`.52`

| Revision | Maintenance gate | Validation PR | Exact validated head | Check | Runtime/main checkpoint |
| --- | --- | ---: | --- | ---: | --- |
| `.44` | Strict Player Identity Facts | #367 | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` | `6ef317c75d5181ddc316caeefe342d14492ab8e2` |
| `.45` | Strict Player Envelope and World Flags | #368 | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` |
| `.46` | Strict Battle Derived Caches | #369 | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` | `2e143daf63f8874d6135e61af79ddfcd474fc418` |
| `.47` | Strict Current Location State | #371 | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` | `1c8698147a98e80a0a519aadb520f6808fe61323` |
| `.48` | Strict Combat Identity Sequence | #372 | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` |
| `.49` | Strict Active Battle Player Link | #373 validation-only | `49df1a5379da51e15cfb3ce0320008047a70c768` | `32290206583` | `49df1a5379da51e15cfb3ce0320008047a70c768` |
| `.50` | Derived NPC World Projection | #374 validation-only | `181bc67b69172390d1a59fa3dfca35980a026b3d` | `32292959171` | `181bc67b69172390d1a59fa3dfca35980a026b3d` |
| `.51` | Derived Enemy Encounter Projection | #375 validation-only | `5a97a109d9476438d001ee75b8e20293f57360dd` | `32297557960` | `5a97a109d9476438d001ee75b8e20293f57360dd` |
| `.52` | Transient Command Presentation Log: remove top-level wall-clock command history from serialized authority while preserving session diagnostics and structured semantic events | #376 validation-only | `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691` | `32301160532` | `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691` |

Every final validated head passed hosted Test, Benchmark 3, and Benchmark Sample. `.50` finished at **680/680 tests**; `.51` at **684/684**; `.52` at **688/688** on Node 24.19.0.

Revisions `.49`–`.52` were implemented directly on `main` under the bounded normal-work policy. PRs #373–#376 were validation-only and were closed without merge after the exact frozen runtime heads passed.

### Version decision through `.52`

Account Save 5, Data 37, Benchmark 3, and Package 0.8.600 remain unchanged.

Revisions `.50`–`.52` complete the dedicated ownership audit of the three broad top-level arrays that had previously remained weakly classified:

- `.50`: `state.npcs` is a reconstructible runtime world projection; **Game State 9 → 10**.
- `.51`: `state.enemies` is a reconstructible encounter-template projection; mutable encounter authority belongs to `activeBattle`; **Game State 10 → 11**.
- `.52`: top-level `state.log` is bounded session presentation history produced by the command adapter with wall-clock display timestamps. It has no mechanical consumers, does not advance fictional time, and is distinct from persisted structured `state.events`. Save encoding omits it; character load resets it to an empty session log after raw validation; saving does not erase the live in-memory log. This advances **Game State 11 → 12**.

`activeBattle.log` is a separate persisted encounter-local record and is unchanged. Canvas command history/output buffers are separate transient UI state.

Under the current pre-alpha policy no automatic migrations were added.

Historical schema changes are:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers;
- `.50`: Game State 9 → 10 when runtime NPC projection left serialized authority;
- `.51`: Game State 10 → 11 when runtime enemy encounter-template projection left serialized authority;
- `.52`: Game State 11 → 12 when top-level command presentation history left serialized authority.

## Current persistence boundary after `.52`

Required raw Game State 12 validation covers:

```text
world time and simulation control
timed tasks and active owner/task links
active Travel State 2
projects, commitments, relationships
resource opportunities and ecology
party and ability runtime
semantic events
atlas and POI discovery
player envelope / identity / key items / flags
player progression, training, learned skills and capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical statuses
top-level world flags
current location/position coherence
combat sequence / active battle identity coherence
active battle and deterministic encounter combat/stat snapshots when present
active battle player / root player live-authority coherence while the encounter is active
```

Optional persisted authority:

```text
work registry
player work proficiencies
day-cycle history
```

Derived/transient or post-validation runtime state:

```text
state.npcs runtime world projection
state.enemies encounter-template projection
state.log command presentation history
flat player.inventory alias identity
root player.combat
root player.statState
activeBattle.rng
```

`state.events` remains the persisted structured semantic observation channel, with fictional-time semantics and stable sequence identity. It must not depend on command-log prose. The command log remains useful for `log`/`inspect log` diagnostics during the current session, but it is not character/world continuity.

## Latest runtime gate

Runtime freeze: `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691`.

Exact validated `.52` gate: validation-only PR #376, head `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691`, Check `32301160532`, Node 24.19.0:

```text
688/688 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.399417 ms/op
enemy profiles   0.070029 ms/op
basic attacks    0.003675 ms/op
tick dispatch    0.000898 ms/op
route lookup     0.007617 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.357454 ms/op    7.63%
enemy profiles   0.070214 ms/op   11.19%
basic attacks    0.001153 ms/op  214.09%
tick dispatch    0.000873 ms/op   30.99%
route lookup     0.007237 ms/op    6.02%
```

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.**

The bounded `state.npcs`, `state.enemies`, and `state.log` ownership/classification series is complete. There is no remaining broad top-level array audit queued by this maintenance sequence.

The next work unit requires a **fresh bounded decision/work order** rather than automatic continuation. Strong feature candidate families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam. A new maintenance packet should likewise be justified by a specific repository-evidenced risk rather than continuing revision numbers mechanically.

## Later phases

### 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
