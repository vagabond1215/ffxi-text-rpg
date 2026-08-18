# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.32
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Optional Work Registry
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.32` are maintenance/hardening revisions and do not open `0.8.700`.**

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

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Projects, inventory, transport, production, commitments, relationships, party state, recovery, NPC schedules, and fictional time remain canonical authorities. Journal/service/information/home/social presentation remains derived. Legacy FFXI-derived material is research/reference only.

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

## Maintenance history `.2`–`.32`

Earlier revisions `.2`–`.22` established current-schema cleanup, canonical command/action contracts, carried-inventory authority, Node 24/current Actions, deterministic long-session and Benchmark 3 evidence, explicit lifecycle ownership, terminal task release, task-owner guards, strict active travel, task-registry validation, and positive active task persistence evidence.

Revisions `.23`–`.27` composed raw pre-revival validators for projects, continuity, resource opportunities, ecology, party, and ability runtime.

### Latest strict-state train `.28`–`.32`

| Revision | Maintenance gate | PR | Exact head | Check | Tests | Promoted main |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `.28` | Strict World Simulation: world time + simulation control validate before runtime access | #351 | `5c1d4108fc8714ea67a5b009ada5cfac43da3e4a` | `32175617550` | 581/581 | `3d1f59b9bfdf03a17e7c96ef00c4eee6bed72087` |
| `.29` | Strict Player Capabilities: required character capability registry validates before `ensureCapabilityState()` | #352 | `31e0f665e7d022508e10f1dce0ef18fd1420e739` | `32176059398` | 586/586 | `eac701fb968bb326e768c2c105fe814c84272a10` |
| `.30` | Strict Inventory State: canonical containers/access/capacity/home state validate before revival | #353 | `229cf4992c61dd1c887b5ec85886443122739dbe` | `32176647509` | 591/591 | `86eb8365fc1b2ff9c2207ce52ffe84321c713f9e` |
| `.31` | Strict Semantic Events: event records/order/sequence integrity validate before normalization | #354 | `f5842eb71eb16861ecb8c0c50b56454396e3f5f4` | `32177641185` | 597/597 | `e947f82f132d0f1fb972688471a23140731ab34c` |
| `.32` | Strict Optional Work Registry: absence remains valid; persisted work must satisfy its domain validator | #355 | `458a87b3dbf08f6d6da086cc24bc1da6c539ede4` | `32178015948` | 602/602 | `9423e87b6d681841a7576d938950bfbb631dd257` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

### Current persistence boundary after `.32`

Current Game State 6 raw validation now covers:

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
player capability registry
player inventory/container state
optional work registry when present
```

Active project/work/travel/timed-ability/resource-recovery owners additionally require consistent persisted timed-task links.

The state-classification rule remains mandatory: persistent authority validates before revival; derived/transient state is recomputed; construction convenience is created in factory/internal paths; optional persisted authority may be absent but must be valid when present.

Important non-actions in this train:

- broad `validatePlayer()` was **not** composed at the raw boundary because it mixes persisted checks with post-revival alias identity and derived state;
- flat `player.inventory` reference identity remains post-revival;
- atlas/POI discovery persistence was **not** tightened because it lacks a dedicated raw-domain validator and currently includes wall-clock visit timestamps that require an explicit authority decision first.

## Latest runtime gate

Runtime freeze: `9423e87b6d681841a7576d938950bfbb631dd257`.

Exact validated `.32` gate: PR #355, head `458a87b3dbf08f6d6da086cc24bc1da6c539ede4`, Check `32178015948`, Node 24.19.0:

```text
602/602 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.270363 ms/op
enemy profiles   0.053653 ms/op
basic attacks    0.002913 ms/op
tick dispatch    0.000814 ms/op
route lookup     0.005602 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.259028 ms/op   7.25%
enemy profiles   0.051633 ms/op  11.45%
basic attacks    0.001148 ms/op 186.78%
tick dispatch    0.000478 ms/op 133.64%
route lookup     0.005363 ms/op  14.08%
```

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.**

For further maintenance, choose one remaining state family and classify it before implementation. The strongest likely persistence follow-ups are:

- extract a dedicated **raw-safe persisted player progression/stat validator** instead of invoking broad `validatePlayer()`;
- separately audit atlas/POI discovery authority and wall-clock timestamp semantics before any persistence tightening;
- audit another optional persisted family only where real current save/load behavior demonstrates a concrete normalization gap.

Strong feature candidate families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam—but starting a new feature track requires an explicit fresh feature work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
