# Roadmap

This is the authoritative phase and feature-track roadmap for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Operational sequencing lives in `docs/EXECUTION_PIPELINE.md`. Exact restart state lives in `docs/THREAD_HANDOFF.md`. Detailed Gate A planning lives in `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`.

## Current validated baseline

```text
Product:       0.9.100.1
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          40
Benchmark:     3
Codename:      Content Pack Scale Contract v2
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Phase 0.8 remains complete. Phase 0.9 is now **open / in progress**. The first `0.9.100` infrastructure packet is complete on the integration branch; high-volume regional content authoring has deliberately not begun.

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Fictional time is separate from wall-clock scheduling. Persistent authorities remain canonical; projections and presentation remain derived. Legacy FFXI-derived material is research/reference only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics | **Complete** |
| `0.7` | Multi-region playable-alpha foundation | **Complete** |
| `0.8` | Life and infrastructure expansion | **Complete** |
| `0.9` | Content scale, adventure depth and release hardening | **In progress** |
| `1.0` | Live foundation | Planned |

# Phase 0.8 — Life and infrastructure expansion

**Status: COMPLETE.** See `docs/PHASE_0_8_EXIT_GATE.md` for the validated connected-life arc and historical evidence.

Completed tracks:

```text
0.8.100 home foothold/storage
0.8.200 home workshop
0.8.300 carried-load transport
0.8.400 Field Satchel
0.8.500 fictional-time NPC availability
0.8.600 companion convalescence
0.8.700 cultivation/stewardship
0.8.800 earned routine delegation
0.8.900 household/community continuity
```

Game State ended Phase 0.8 at 14 and remains 14 in the first Phase 0.9 packet.

# Content scale as the Phase 0.9 gate

`npm run census` is an executable progression indicator. It now runs in ordinary hosted `Check`, but incomplete content targets are **not CI failures**.

Current gameplay breadth remains:

| Category | Current | Mechanics integration | Playable alpha | 1.0 lower bound |
| --- | ---: | ---: | ---: | ---: |
| Places/localities | 26 | 10 | 30 | 75 |
| Named NPCs | 12 | 50 | 250 | 700 |
| Functional shop/service sites | 17 | 20 | 60 | 150 |
| Creature definitions | 16 | 40 | 120 | 300 |
| Resource sources | 13 | 40 | 100 | 250 |
| Canonical items | 50 | 200 | 800 | 2,500 |
| Recipes/processes | 11 | 75 | 300 | 800 |
| Abilities/techniques | 5 | 100 | 250 | 500 |
| Quests/contracts | 8 | 30 | 150 | 500 |
| Recruitable companions | 1 | 4 | 12 | 25 |
| Scheduled transport services | 3 | 5 | 20 | 50 |

Mechanics-scale status is **NOT READY**. Places already exceed the mechanics floor; abilities/techniques remain the largest relative gap.

The first Phase 0.9 packet intentionally did **not** change these gameplay counts. Instead it scaled the infrastructure that must own later growth:

```text
regional/shared content packs                         7
pack-owned records                                  115
pack-owned abilities/capabilities/schedules/companions 5/8/4/1
spell schools                                          3
capability/training definitions                        8
NPC schedules                                          4
```

This separation between authored breadth and infrastructure ownership is deliberate. Do not satisfy roadmap targets with disconnected filler or by counting catalog references twice.

# Phase 0.9 — Content scale, adventure depth and release hardening

**Status: IN PROGRESS.**

| Track | Gate | Status |
| --- | --- | --- |
| `0.9.100` | Content Scale Gate A | **IN PROGRESS** |
| `0.9.200` | Adventure vertical slices | QUEUED |
| `0.9.300` | Advanced combat/training | QUEUED |
| `0.9.400` | Economy/production depth | QUEUED |
| `0.9.500` | Quest/social depth | QUEUED |
| `0.9.600` | Playable-alpha content-scale push | QUEUED |
| `0.9.700` | Browser UX/accessibility/E2E hardening | DEFERRED |
| `0.9.800` | Supported persistence/release transition | DEFERRED |
| `0.9.900` | Release-candidate soak/performance/release hardening | DEFERRED |

## `0.9.100` — Content Scale Gate A

### Packet A — Content Pack Scale Contract v2

**Status: COMPLETE / validated before content expansion.**

The packet adds infrastructure rather than content volume:

- Content Pack schema v2 adds `spellSchools`, `capabilities`, `abilities`, `npcSchedules`, and `companions` to the existing regional/shared ownership model.
- `contentCatalogRegistry` bridges packs to canonical resource/production/equipment items, production recipes, commitments, seed NPCs, routes/ecology, abilities/capabilities, schedules, and companions instead of duplicating definition authority.
- Pack validation now checks scale-family structure, dangling references, stable-ID ownership, cross-pack dependencies, and legacy leakage.
- NPC schedules gain structural catalog validation and stable schedule lookup.
- Existing shared abilities/training, regional schedules, Mara, and Redstone roots are claimed by packs as ownership metadata without creating duplicate gameplay records.
- Census counts future pack-owned abilities/companions but de-duplicates catalog refs.
- A generated fixture validates more than 1,400 ownership records across Pack v2 families.
- Hosted Check now runs Repository Audit + Test + Content Census + Benchmark 3 + Benchmark Sample.

Version decision:

```text
Product:      0.9.100.1
Package:      0.9.100
Data:         39 -> 40
Game State:   remains 14
Account Save: remains 5
Benchmark:    remains 3
```

Data advances because the canonical authored-data ownership/validation contract changed. Game State does not advance because no new durable player/world fact was introduced.

### Next bounded packet — Redstone Forge-Road

**Status: NOT STARTED.**

Use the new Pack v2 path for a dense Redstone/Brasshaven graph linking existing geography to mining, production, equipment, training, schedules, services, contracts, transport, danger, and provenance. Do not begin by dumping isolated items or abilities into global catalogs.

Following Gate A tranches remain Elderwood Hunt-Timber, Starfen Marshcraft-Practical Magic, then Gate A integration/census review. Their numeric planning bands remain guidance, not quotas.

## Phase 0.9 governance

Phase 0.9 work is using PR-based integration. The repository tool available in this session does not expose branch-protection mutation, so protected `main` / required-check enforcement remains an administrative follow-up rather than a fabricated completed step.

# Current Game State 14 persistence boundary

The Phase 0.9 infrastructure packet changes no persistence ownership. Required current-schema authority still includes world/simulation/task state, travel, projects, commitments, relationships, ecology/resource opportunities, cultivation/delegation, party/ability runtime, semantic events, discovery, player state, location, and active combat when present.

Derived/transient state remains:

```text
state.npcs
state.enemies
state.log
flat player.inventory alias identity
root player.combat
root player.statState
activeBattle.rng
```

# Deferred work

Supported-save migrations, browser E2E/accessibility, hard performance thresholds, balance certification, quality/HQ depth, large logistics, and deep romance remain deferred to their planned tracks unless explicitly opened earlier.

A future continuation must start from `THREAD_HANDOFF.md` and `EXECUTION_PIPELINE.md`. The next regional content packet is not authorized merely because it appears here.
