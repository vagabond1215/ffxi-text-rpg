# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

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
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.51` are maintenance/hardening revisions and do not open `0.8.700`.**

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

### Persistence hardening and authority classification `.44`–`.51`

| Revision | Maintenance gate | Validation PR | Exact validated head | Check | Runtime/main checkpoint |
| --- | --- | ---: | --- | ---: | --- |
| `.44` | Strict Player Identity Facts | #367 | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` | `6ef317c75d5181ddc316caeefe342d14492ab8e2` |
| `.45` | Strict Player Envelope and World Flags | #368 | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` |
| `.46` | Strict Battle Derived Caches | #369 | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` | `2e143daf63f8874d6135e61af79ddfcd474fc418` |
| `.47` | Strict Current Location State | #371 | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` | `1c8698147a98e80a0a519aadb520f6808fe61323` |
| `.48` | Strict Combat Identity Sequence | #372 | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` |
| `.49` | Strict Active Battle Player Link | #373 validation-only | `49df1a5379da51e15cfb3ce0320008047a70c768` | `32290206583` | `49df1a5379da51e15cfb3ce0320008047a70c768` |
| `.50` | Derived NPC World Projection | #374 validation-only | `181bc67b69172390d1a59fa3dfca35980a026b3d` | `32292959171` | `181bc67b69172390d1a59fa3dfca35980a026b3d` |
| `.51` | Derived Enemy Encounter Projection: remove seed enemy templates from serialized authority and reconstruct them after raw validation; ongoing mutable enemy authority remains in `activeBattle` | #375 validation-only | `5a97a109d9476438d001ee75b8e20293f57360dd` | `32297557960` | `5a97a109d9476438d001ee75b8e20293f57360dd` |

Every final validated head passed hosted Test, Benchmark 3, and Benchmark Sample. `.49` finished at **676/676 tests**; `.50` at **680/680**; `.51` at **684/684** on Node 24.19.0.

Revisions `.49`–`.51` were implemented directly on `main` under the bounded normal-work policy. PRs #373–#375 were validation-only and were closed without merge after the exact frozen runtime heads passed.

### Version decision through `.51`

Account Save 5, Data 37, and Benchmark 3 remain unchanged.

Revisions `.44`–`.49` tightened or synchronized already-persisted Game State 9 authority without changing serialized shape. `.50` and `.51` are explicit authority-classification schema changes:

- `.50` determined `state.npcs` is a reconstructible runtime projection, not durable world authority, and advanced **Game State 9 → 10**.
- `.51` determined `state.enemies` is a reconstructible encounter-template projection, not durable mutable world authority. Canonical seed enemy definitions provide encounter construction input; their factory-created combat/resources are derived template data. `activeBattle` owns mutable ongoing combat state. Save encoding omits `state.enemies`, revival reconstructs it after raw validation, and the schema advances **Game State 10 → 11**.

Under the current pre-alpha policy no automatic migrations were added.

Historical schema changes are:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers;
- `.50`: Game State 9 → 10 when runtime NPC projection left serialized authority;
- `.51`: Game State 10 → 11 when runtime enemy encounter-template projection left serialized authority.

## Current persistence boundary after `.51`

Required raw Game State 11 validation covers:

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
presentation log array pending its dedicated ownership audit
```

Optional persisted authority:

```text
work registry
player work proficiencies
day-cycle history
```

Derived/transient or post-revival state:

```text
state.npcs runtime world projection
state.enemies encounter-template projection
flat player.inventory alias identity
root player.combat
root player.statState
activeBattle.rng
```

The NPC projection is rebuilt from canonical seed NPC definitions plus persisted party companion participation. The enemy projection is rebuilt from canonical seed enemy definitions. Place spawn rules and player-opportunity surfaces reference stable enemy IDs; `startEncounter()` resolves an encounter template and constructs a distinct combatant snapshot. Damage, statuses, resources, timeline and other mutable encounter facts belong to `activeBattle`, not to `state.enemies`.

Injected serialized `npcs` or `enemies` data does not become authority. Game State 11 encoding omits both fields and post-validation revival replaces any supplied runtime values.

## Latest runtime gate

Runtime freeze: `5a97a109d9476438d001ee75b8e20293f57360dd`.

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

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.**

The `state.npcs` and `state.enemies` authority audits are complete. The remaining broad array must be classified on its own before another raw-boundary change:

1. `state.log` — determine whether it is disposable presentation/command history, compatibility baggage, or durable player-facing memory; do not confuse it with canonical semantic events.

Do not broaden that audit into an unrelated presentation rewrite or new feature track.

Strong feature candidate families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam—but starting a new feature track requires an explicit fresh feature work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.