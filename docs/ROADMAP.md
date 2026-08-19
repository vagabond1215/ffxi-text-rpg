# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.50
Package:       0.8.600
Account Save:  5
Game State:    10
Data:          37
Benchmark:     3
Codename:      Derived NPC World Projection
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.50` are maintenance/hardening revisions and do not open `0.8.700`.**

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

### Persistence hardening and authority classification `.44`–`.50`

| Revision | Maintenance gate | Validation PR | Exact validated head | Check | Runtime/main checkpoint |
| --- | --- | ---: | --- | ---: | --- |
| `.44` | Strict Player Identity Facts: canonical player identity, key items, and player flags | #367 | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` | `6ef317c75d5181ddc316caeefe342d14492ab8e2` |
| `.45` | Strict Player Envelope and World Flags: stable player envelope plus boolean world conditions | #368 | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` |
| `.46` | Strict Battle Derived Caches: deterministic encounter combat/stat snapshots validate before revival | #369 | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` | `2e143daf63f8874d6135e61af79ddfcd474fc418` |
| `.47` | Strict Current Location State: canonical place/name/position coherence | #371 | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` | `1c8698147a98e80a0a519aadb520f6808fe61323` |
| `.48` | Strict Combat Identity Sequence: battle ID must agree with durable encounter allocator | #372 | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` |
| `.49` | Strict Active Battle Player Link: live battle player/root authority coherence plus post-load combat-skill synchronization | #373 validation-only | `49df1a5379da51e15cfb3ce0320008047a70c768` | `32290206583` | `49df1a5379da51e15cfb3ce0320008047a70c768` |
| `.50` | Derived NPC World Projection: remove seed/backing NPC projection from serialized authority and rebuild it from canonical seed definitions plus persisted party authority after raw validation | #374 validation-only | `181bc67b69172390d1a59fa3dfca35980a026b3d` | `32292959171` | `181bc67b69172390d1a59fa3dfca35980a026b3d` |

Every final validated head passed hosted Test, Benchmark 3, and Benchmark Sample. `.47` finished at **665/665 tests**; `.48` at **670/670**; `.49` at **676/676**; `.50` at **680/680** on Node 24.19.0.

`.49` and `.50` were implemented directly on `main` under the bounded normal-work policy. PRs #373 and #374 were validation-only: their heads pointed at the frozen runtime SHA so the standard pull-request Check could be observed through the connector. Both were closed without merge after validation.

### Version decision through `.50`

Account Save 5, Data 37, and Benchmark 3 remain unchanged.

Revisions `.44`–`.49` tightened or synchronized already-persisted Game State 9 authority without changing serialized shape. Product `.50` is different: the dedicated NPC ownership audit determined that `state.npcs` is a reconstructible runtime projection rather than durable world authority. Save encoding therefore omits `state.npcs`, and revival rebuilds it from canonical seed NPC definitions plus persisted `state.party` companion authority **after** raw validation. Because that changes the serialized Game State contract, `.50` advances **Game State 9 → 10**. Under the current pre-alpha policy no automatic migration was added.

Historical schema changes are:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers;
- `.50`: Game State 9 → 10 when runtime NPC projection left serialized authority.

## Current persistence boundary after `.50`

Required raw Game State 10 validation covers:

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

Derived/transient or post-revival state:

```text
state.npcs runtime world projection
flat player.inventory alias identity
root player.combat
root player.statState
activeBattle.rng
```

The NPC projection is rebuilt deterministically from `createSeedNpcs()` plus persisted companion membership/location/identity participation under `state.party`. Injected serialized `npcs` data does not become authority; Game State 10 encoding omits the field and revival replaces any supplied runtime value.

The active battle/root player rule remains phase-aware. The battle player ID remains bound to the root player, and while the encounter is active its mutable resources/statuses and deterministic combat profile must match root combat-driving authority. A terminal battle is historical and may diverge from later root-character progression, recovery, equipment, or resources.

## Latest runtime gate

Runtime freeze: `181bc67b69172390d1a59fa3dfca35980a026b3d`.

Exact validated `.50` gate: validation-only PR #374, head `181bc67b69172390d1a59fa3dfca35980a026b3d`, Check `32292959171`, Node 24.19.0:

```text
680/680 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.372865 ms/op
enemy profiles   0.071050 ms/op
basic attacks    0.003425 ms/op
tick dispatch    0.000818 ms/op
route lookup     0.007469 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.364304 ms/op    3.27%
enemy profiles   0.067755 ms/op   10.57%
basic attacks    0.001213 ms/op  162.66%
tick dispatch    0.000876 ms/op   44.41%
route lookup     0.007423 ms/op    6.50%
```

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.**

The `state.npcs` authority audit is complete. The remaining broad arrays must still be classified separately before adding new raw validators:

1. `state.enemies` — distinguish authored encounter definitions from mutable runtime entity state and derived combat caches;
2. `state.log` — determine whether it is presentation history, compatibility baggage, or durable player-facing history; do not confuse it with canonical semantic events.

Do not combine these into one broad “validate all entities” packet. The strongest next maintenance pass is the bounded `state.enemies` ownership/classification audit.

Strong feature candidate families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam—but starting a new feature track requires an explicit fresh feature work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.