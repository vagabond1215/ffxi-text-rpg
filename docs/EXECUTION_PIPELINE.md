# Execution Pipeline and Continuation Queue

This document is the operational progression path for **Hearth & Horizon**. It minimizes repeated discovery when work moves to a new thread. It does not replace the design north star or roadmap.

Authority order remains:

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. this file
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` for active Phase 0.9 sequencing
9. relevant architecture/runtime/tests for the active bounded pass

## Current baseline

```text
Product:       0.9.100.1
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          40
Benchmark:     3
Phase:         0.9 in progress
Codename:      Content Pack Scale Contract v2
Runtime:       Node >=24
```

Phase 0.8 is complete. The post-0.8 status/repair/planning audit is complete. Phase 0.9 is explicitly open and is using PR-based integration for its cross-file scale work.

## Fast restart protocol

```text
1. refresh current main and open PR state
2. read AGENTS.md
3. read docs/THREAD_HANDOFF.md
4. read this file
5. read docs/PHASE_0_9_IMPLEMENTATION_PLAN.md only for the authorized Phase 0.9 packet
6. inspect the named runtime/data/tests only
7. proceed only with the immediate bounded unit
```

Do not redo Phase 0.4–0.8 discovery, persistence classification, or the post-0.8 audit unless a concrete regression/change requires it.

# Completed foundation

```text
Phase 0.4–0.7                  COMPLETE
Phase 0.8 life/infrastructure  COMPLETE
Phase 0.8 exit audit           COMPLETE
post-0.8 status/repair audit   COMPLETE
repository contract audit      COMPLETE
```

Phase 0.8 closed at Product `0.8.900.1`, Game State 14, Data 39. The first Phase 0.9 packet changes authored-data infrastructure only; existing persistence ownership remains unchanged.

# Active phase — 0.9 Content Scale, Adventure Depth and Release Hardening

## `0.9.100` — Content Scale Gate A

**Status: IN PROGRESS.**

Primary question:

> Can the repository repeatedly author and validate materially larger connected regional content without bypassing ownership rules, duplicating canonical catalogs, or manufacturing filler?

### Packet A — Content Pack Scale Contract v2

**Status: COMPLETE on the Phase 0.9 integration branch; validated before content expansion.**

Implemented infrastructure:

- Pack schema v2 owns `spellSchools`, `capabilities`, `abilities`, `npcSchedules`, and `companions` in addition to existing geography/ecology/item/NPC/shop/recipe/quest/relationship families.
- `contentCatalogRegistry` resolves packs against existing canonical catalogs rather than copying definitions for ownership bookkeeping.
- Item lookup spans resource, production, and equipment catalogs.
- Recipes, commitments, seed NPCs, route/ecology records, abilities/capabilities, schedules, and companions can be claimed through catalog refs.
- Pack validator enforces scale-family structure, stable-ID collisions, cross-pack dependencies, dangling references, and legacy boundaries.
- NPC schedule definitions now have structural catalog validation and stable schedule-ID lookup.
- Existing current catalog records are assigned to shared/region roots, including a Redstone opening root, without adding new gameplay records.
- Census can count future inline Pack v2 abilities/companions while de-duplicating catalog references.
- Generated validation exercises 1,401 ownership records across one place plus 200 each of items, recipes, NPCs, schedules, capabilities, abilities, and companions.
- Hosted/local `check` now executes Repository Audit + Test + Content Census + Benchmark 3 + Benchmark Sample.

Version decision:

```text
Product:      0.9.100.1
Package:      0.9.100
Data:         40
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

### Current census

Gameplay breadth did not change in Packet A:

```text
places/localities       26 / mechanics floor 10
named NPCs              12 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         50 / 200
recipes/processes       11 / 75
abilities/techniques     5 / 100
quests/contracts         8 / 30
companions                1 / 4
transport services        3 / 5
```

Infrastructure coverage:

```text
routes                                   7
spell schools                            3
capabilities/training definitions        8
NPC schedules                            4
regional/shared packs                    7
pack-owned records                     115
pack-owned abilities/capabilities/
  schedules/companions                 5/8/4/1
```

Mechanics-scale gate remains **NOT READY** by design. This is not a failing CI condition.

### Next bounded packet — Redstone Forge-Road

**Status: NOT STARTED / not authorized by Packet A completion alone.**

When explicitly authorized, use `pack-redstone-opening` as the regional root and add one dense cross-linked tranche spanning mining/resources, production, equipment, techniques/training, scheduled people/services, contracts, transport/economy, field danger, and provenance. Do not add isolated records merely to move the census.

Following Gate A tranches remain Elderwood Hunt-Timber and Starfen Marshcraft-Practical Magic, then integration/census review.

# Phase 0.9 progression envelope

| Track | Primary gate | Status |
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

# Governance and deferred operations

- Phase 0.9 uses PR-based integration for track packets.
- Protected `main` + required Check remains recommended. The repository connector used for Packet A exposes no safe branch-protection mutation action, so this remains administrative follow-up rather than a claimed completed change.
- Historical stale remote branches remain manual cleanup debt where the connector exposes no safe delete operation.
- Supported-save compatibility/migrations remain deferred to `0.9.800` unless explicitly required earlier.
- Browser E2E/accessibility remains `0.9.700`.
- Hard performance budgets, balance certification, quality/HQ depth, large logistics, and deep romance remain deferred until their prerequisites exist.

# Standard bounded-pass pipeline

```text
1. select one player-facing or repository-risk question
2. identify existing authority and production caller
3. define non-goals
4. implement the smallest complete runtime/data path
5. add focused deterministic/adversarial tests
6. add connected content only when the infrastructure can own and validate it
7. run Repository Audit + Test + Census + Benchmark 3 + Sample
8. add hardening only for lifecycle-sensitive ownership changes
9. freeze the exact implementation SHA
10. synchronize profile/roadmap/catalog/version docs after runtime freeze
11. update THREAD_HANDOFF.md last
12. stop before the next independent packet
```

Content targets are lower-bound progression indicators. Never game them with disconnected filler, fixtures counted as canonical content, or duplicate catalog refs.
