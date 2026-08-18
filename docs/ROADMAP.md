# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

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
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.38` are maintenance/hardening revisions and do not open `0.8.700`.**

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

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Projects, inventory, transport, production, commitments, relationships, party state, recovery, NPC schedules, fictional time, acquired discovery, character progression, mutable resources, and wallet balances remain canonical authorities. Journal/service/information/home/social presentation and combat/stat projections remain derived. Legacy FFXI-derived material is research/reference only.

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

Historical feature-track checkpoints:

```text
0.8.100  0b9251a43285443087050127da36b977cabdf7ee
0.8.200  03ab71c7e96c54eaeffb75598ed01243fd390f21
0.8.300  4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
0.8.400  d1a43568c5ca4dd7e57fb86316b422c35025ce07
0.8.500  fde1d30d76264ea25af6bad4d829545c488eec9b
0.8.600  04211e8909996b1ac34fa91ae1cdd7aa216b86f8
```

## Maintenance history

Revisions `.2`–`.22` established current-schema cleanup, canonical command/action contracts, carried-inventory authority, Node 24/current Actions, deterministic long-session and Benchmark 3 evidence, explicit lifecycle ownership, terminal task release, task-owner guards, strict active travel, task-registry validation, and positive active-task persistence evidence.

Revisions `.23`–`.27` composed raw pre-revival validators for projects, continuity, resource opportunities, ecology, party, and ability runtime.

Revisions `.28`–`.32` added strict world/simulation, player capability, inventory, semantic-event, and optional work-registry validation.

### Strict persistence train `.33`–`.38`

| Revision | Maintenance gate | PR | Exact head | Check | Tests | Promoted main |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `.33` | Strict Player Progression: durable disciplines/EXP/training/skills validate before revival | #356 | `98c1d2e9c6499fb85256b40c5d225c329b623e7c` | `32186702816` | 607/607 | `4a4710464c0b47fc6abe0fdc924e70e3d1681577` |
| `.34` | Canonical Discovery Time: atlas visit timing moves to fictional seconds and discovery becomes strict | #357 | `3037e1a7ad3e9883b9dce0252866290bf1e52917` | `32196254452` | 611/611 | `cfaa7ce2c7afa613925f51c94aa2d12b311cd8e9` |
| `.35` | Strict Work Proficiencies: absent is valid; persisted mastery must validate | #358 | `f01dbe687d434f88b61c72e7889a61e09bec8ff4` | `32196637167` | 616/616 | `be4c29eb5e4dd60993da113f3ccfa2241b8b06b8` |
| `.36` | Strict Player Resources: persisted HP/MP/TP validate without promoting combat profiles to authority | #359 | `fec79d286c9d6ed117b92375bddaffd9e8f04f56` | `32196927507` | 620/620 | `3759f130174d804ccb76c9b243dca4d7826b10c1` |
| `.37` | Strict Day Cycle: optional persisted day-review history validates against canonical world days | #360 | `29aecd95fd92930330b64734dd24a573c93d4cda` | `32197342668` | 625/625 | `4dd5b126b37810a807c5f1e03c074c68178ede06` |
| `.38` | Strict Player Wallet: complete canonical currency keys and balances validate before revival | #361 | `a356c67124167ab60efd4cf4a57c742d3d94c355` | `32197699859` | 629/629 | `dc588d194211ccaed671d58362617bea6b2c5a73` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

### Version decision for `.33`–`.38`

Only `.34` changed persisted meaning: atlas wall-clock `visitedAt` was replaced by canonical fictional `visitedAtWorldSeconds`, so **Game State advanced 6 → 7**. Under the pre-alpha current-schema policy there is no automatic Game State 6 migration.

`.33` and `.35`–`.38` enforce or classify invariants without changing the Game State 7 shape/meaning, so Game State remains 7. Account Save 5, Data 37, and Benchmark 3 remain unchanged across the train.

## Current persistence boundary after `.38`

Required raw Game State 7 validation now covers:

```text
world time and simulation control
timed tasks and active owner/task links
active Travel State 2
projects, commitments, relationships
resource opportunities and ecology
party and ability runtime
semantic events
atlas and POI discovery
player discipline progression, training history, learned skills and capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
```

Optional persisted authority:

```text
work registry
player work proficiencies
day-cycle history
```

The state-classification rule remains mandatory: persistent authority validates before revival; derived/transient state is recomputed; construction convenience is created in factory/internal paths; optional persisted authority may be absent but must be valid when present.

Important deliberate exclusions:

- broad `validatePlayer()` is **not** composed at the raw boundary because it mixes persisted checks with post-revival alias identity and derived state;
- flat `player.inventory` reference identity remains post-revival;
- `player.combat` and derived stat/resource maxima remain projections, not accepted persistence authority;
- `player.statState` requires a dedicated cache/ownership audit before stricter persistence or de-persistence changes.

## Latest runtime gate

Runtime freeze: `dc588d194211ccaed671d58362617bea6b2c5a73`.

Exact validated `.38` gate: PR #361, head `a356c67124167ab60efd4cf4a57c742d3d94c355`, Check `32197699859`, Node 24.19.0:

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

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.**

For further maintenance, the strongest next bounded investigation is the **derived combat/stat cache audit**:

1. enumerate production reads/writes/reconstruction of `player.combat` and `player.statState`;
2. distinguish authoritative character-base data from deterministic cached projections;
3. decide whether current saves should persist, validate, ignore, or recompute those fields;
4. only then change required raw fields or load behavior, with positive save/load and malformed/no-repair-or-recompute evidence appropriate to the chosen contract.

A separate later persistence candidate is durable equipment/status validation, but it should not be mixed into the combat/stat cache decision.

Strong feature candidate families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam—but starting a new feature track requires an explicit fresh feature work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
