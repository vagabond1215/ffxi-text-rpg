# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

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
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.43` are maintenance/hardening revisions and do not open `0.8.700`.**

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

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Projects, inventory, equipment, transport, production, commitments, relationships, party state, recovery, NPC schedules, fictional time, discovery, character progression, mutable resources, wallet balances, canonical statuses, and active battles remain canonical authorities where declared. Journal/service/information/home/social presentation and root combat/stat caches remain derived. Legacy FFXI-derived material is research/reference only.

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

Revisions `.33`–`.38` added strict player progression, canonical fictional-time discovery, optional work proficiency/day-cycle authority, mutable resources, and wallet validation. `.34` advanced Game State 6 → 7 because discovery timestamp meaning changed.

### Player persistence train `.39`–`.43`

| Revision | Maintenance gate | PR | Exact head | Check | Tests | Promoted main |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `.39` | Derived Player Cache Contract: omit root combat/stat caches from saves and rebuild after validation | #362 | `a94666003e54dedb96d8d4140b1b1cae04d7fd97` | `32273155030` | 632/632 | `16ce275995aae56c2d4da36dbce02ccd33647a25` |
| `.40` | Strict Player Equipment: canonical slots/loadout item structure validate before revival | #363 | `103b3a363153a30a25549d58063717b5eed666ee` | `32273809797` | 637/637 | `29d20cf78d1faae2c7ae08899211e439577fa515` |
| `.41` | Canonical Player Statuses: nested modifier authority and strict fictional-time status persistence | #364 | `430dbb78bbbdaea72d2be9d4c1dcb82699c3d90d` | `32274840087` | 641/641 | `9cb2a32cbd3253bed099a8aabb31c68e7f7e252c` |
| `.42` | Strict Active Battle: validate ongoing combatants/resources/sides/actions/timeline before revival | #365 | `ce680fc35568df1a16a2feed30b1b7130d0b8eb6` | `32275555067` | 646/646 | `5526eba5fa3728b4212955a307b91b0ee72b4b2c` |
| `.43` | Player Persistence Integration: prove combined round trip and refresh derived caches after combat/status sync | #366 | `2a10727dfa14734ca9c3031adf4bc368be592063` | `32276311018` | 648/648 | `daa1904c8287c5b16950142cef76edcfdd902d3d` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

### Version decision for `.39`–`.43`

Account Save 5, Data 37, and Benchmark 3 remained unchanged.

- `.39` changed serialized shape by removing root `player.combat` and `player.statState` from save payloads and rebuilding them after raw validation. **Game State advanced 7 → 8.**
- `.40` enforced the existing durable equipment/loadout shape; Game State 8 stayed unchanged.
- `.41` changed valid persisted status semantics from legacy/flat modifier payloads to canonical nested modifier blocks. **Game State advanced 8 → 9.**
- `.42` enforced the existing active-battle snapshot/Combat 2.0 contract; Game State 9 stayed unchanged.
- `.43` fixed derived-cache synchronization after status/combat reconciliation and added combined evidence; serialized meaning stayed Game State 9.

Under the pre-alpha current-schema policy there are no automatic Game State 7 → 8 or 8 → 9 migrations.

## Current persistence boundary after `.43`

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
player progression, training, learned skills and capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical statuses
active battle when present
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

The save encoder omits root combat/stat caches. Revival reconstructs them after raw validation. Combat/status reconciliation refreshes battle combatant profiles and root player caches so the derived contract remains true during continued play.

## Latest runtime gate

Runtime freeze: `daa1904c8287c5b16950142cef76edcfdd902d3d`.

Exact validated `.43` gate: PR #366, head `2a10727dfa14734ca9c3031adf4bc368be592063`, Check `32276311018`, Node 24.19.0:

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

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.**

For further maintenance, the strongest next bounded investigation is the remaining root-player persistence boundary:

1. classify `player.identity`, `player.keyItems`, and `player.flags` as durable authority versus construction/reference state;
2. add raw-safe validation only where the production ownership contract warrants it;
3. separately audit whether `activeBattle.combatants[*].combat` should remain a durable encounter snapshot or become explicitly reconstructible cache state;
4. do not combine those two audits mechanically.

Strong feature candidate families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam—but starting a new feature track requires an explicit fresh feature work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
