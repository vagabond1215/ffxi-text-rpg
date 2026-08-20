# Roadmap

This is the authoritative phase/track roadmap for **Hearth & Horizon**. Operational sequencing lives in `docs/EXECUTION_PIPELINE.md`; exact restart state lives in `docs/THREAD_HANDOFF.md`; Gate A detail lives in `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`.

## Current validated baseline

```text
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Codename:      Elderwood Hunt-Timber
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Phase 0.8 remains complete. Phase 0.9 is **in progress**.

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition

Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Fictional time is separate from wall-clock scheduling. Resources preserve provenance. Persistent authorities remain canonical; projections remain derived. Legacy FFXI-derived material is reference/research only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | Complete |
| `0.5` | Simulation + original-world/content substrate | Complete |
| `0.6` | Integrated character/mechanics | Complete |
| `0.7` | Multi-region playable-alpha foundation | Complete |
| `0.8` | Life and infrastructure expansion | Complete |
| `0.9` | Content scale, adventure depth and release hardening | **In progress** |
| `1.0` | Live foundation | Planned |

## Phase 0.9 tracks

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

## `0.9.100` Content Scale Gate A

Completed/active bounded packets:

1. **Content Pack Scale Contract v2 — COMPLETE.** Pack ownership, catalog bridge, cross-pack validation, scale fixture, census/CI wiring.
2. **Redstone Forge-Road — COMPLETE / merged.** Connected minerals, forge work, equipment, caravan repair, contracts, and Redstone techniques.
3. **Elderwood Hunt-Timber — IMPLEMENTED + VALIDATED / pending final landing.** Connected Barkboar recovery, forest gathering, tanning/woodworking, field gear, road repair, scheduled contacts, commitments, and Elderwood techniques.
4. **Starfen Marshcraft-Practical Magic — QUEUED / NOT STARTED.** Requires a new explicit continuation after Elderwood lands.
5. **Gate A integration/census audit — QUEUED.** Run after the regional tranches.

## Current content-scale evidence

| Category | Current | Mechanics floor |
| --- | ---: | ---: |
| Places/localities | 26 | 10 |
| Named NPCs | 15 | 50 |
| Shop/service sites | 17 | 20 |
| Creature definitions | 16 | 40 |
| Resource sources | 13 | 40 |
| Canonical items | 62 | 200 |
| Recipes/processes | 23 | 75 |
| Abilities/techniques | 13 | 100 |
| Quests/contracts | 14 | 30 |
| Recruitable companions | 1 | 4 |
| Transport services | 3 | 5 |

Supplemental Pack-v2 coverage:

```text
routes                                   7
spell schools                            3
capability/training definitions         16
NPC schedules                            5
regional/shared packs                    9
pack-owned records                     171
pack-owned abilities/capabilities/
  schedules/companions                13/16/5/1
```

Mechanics-scale status remains **NOT READY**. Abilities/techniques remain the largest relative gap. Counts are lower-bound progression signals and must not be satisfied with disconnected filler.

## Persistence boundary

Game State remains 14. Elderwood adds no new serialized authority; it composes existing inventory/provenance, production/work, commitment/relationship/schedule, and character capability/ability authorities. Data advances to 42 because stable authored IDs and relationships changed.

## Deferred work

Supported-save migrations, browser E2E/accessibility, hard performance thresholds, balance certification, quality/HQ depth, large logistics, and deep romance remain deferred to their planned tracks unless a later bounded work order explicitly opens them.

A future continuation starts from `THREAD_HANDOFF.md` and `EXECUTION_PIPELINE.md`. Roadmap order does not itself authorize the next packet.
