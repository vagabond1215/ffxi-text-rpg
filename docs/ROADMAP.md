# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

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
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.48` are maintenance/hardening revisions and do not open `0.8.700`.**

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

### Persistence hardening `.44`–`.48`

| Revision | Maintenance gate | PR | Exact head | Check | Promoted main |
| --- | --- | ---: | --- | ---: | --- |
| `.44` | Strict Player Identity Facts: canonical player identity, key items, and player flags | #367 | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` | `6ef317c75d5181ddc316caeefe342d14492ab8e2` |
| `.45` | Strict Player Envelope and World Flags: stable player envelope plus boolean world conditions | #368 | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` |
| `.46` | Strict Battle Derived Caches: deterministic encounter combat/stat snapshots validate before revival | #369 | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` | `2e143daf63f8874d6135e61af79ddfcd474fc418` |
| `.47` | Strict Current Location State: canonical place/name/position coherence | #371 | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` | `1c8698147a98e80a0a519aadb520f6808fe61323` |
| `.48` | Strict Combat Identity Sequence: battle ID must agree with durable encounter allocator | #372 | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` |

Every final head passed hosted Test, Benchmark 3, and Benchmark Sample before promotion. `.47` finished at **665/665 tests**; `.48` finished at **670/670 tests** on Node 24.19.0.

### Version decision for `.44`–`.48`

Account Save 5, Game State 9, Data 37, and Benchmark 3 remain unchanged across this train. Each revision tightens or classifies existing Game State 9 fields/semantics rather than changing serialized shape or meaning.

Historical schema changes remain:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers.

Under the pre-alpha current-schema policy there are no automatic migrations between those versions.

## Current persistence boundary after `.48`

Required raw Game State 9 validation covers:

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
```

Optional persisted authority:

```text
work registry
player work proficiencies
day-cycle history
```

Derived/transient or post-revival state:

```text
flat player.inventory alias identity
root player.combat
root player.statState
activeBattle.rng
```

## Latest runtime gate

Runtime freeze: `512f8c3d5edbb22d07d857fa98d6f0755d043d89`.

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

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.**

For further maintenance, audit the remaining broad arrays separately before adding any new raw validator:

1. `state.npcs` — distinguish seeded definition data, persistent NPC world identity/location, companion backing records, and derived presentation/combat fields;
2. `state.enemies` — distinguish authored encounter definitions from mutable runtime entity state and derived combat caches;
3. `state.log` — determine whether it is presentation history, compatibility baggage, or durable player-facing history; do not confuse it with canonical semantic events.

Do not combine these into one broad “validate all entities” packet.

Strong feature candidate families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam—but starting a new feature track requires an explicit fresh feature work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
