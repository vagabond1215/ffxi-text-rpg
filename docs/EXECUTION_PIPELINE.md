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
Product:       0.9.100.2
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          41
Benchmark:     3
Phase:         0.9 in progress
Codename:      Redstone Forge-Road
Runtime:       Node >=24
```

Phase 0.8 is complete. Phase 0.9 / `0.9.100 Content Scale Gate A` is active and uses PR-based integration for cross-file scale packets.

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

Do not redo Phase 0.4–0.8 discovery, persistence classification, the post-0.8 audit, or Pack v2 infrastructure discovery unless a concrete regression/change requires it.

# Completed foundation

```text
Phase 0.4–0.7                  COMPLETE
Phase 0.8 life/infrastructure  COMPLETE
Phase 0.8 exit audit           COMPLETE
post-0.8 status/repair audit   COMPLETE
repository contract audit      COMPLETE
```

# Active phase — 0.9 Content Scale, Adventure Depth and Release Hardening

## `0.9.100` — Content Scale Gate A

**Status: IN PROGRESS.**

Primary question:

> Can the repository repeatedly author and validate materially larger connected regional content without bypassing ownership rules, duplicating canonical catalogs, or manufacturing filler?

### Packet A — Content Pack Scale Contract v2

**Status: COMPLETE and merged.**

The Pack v2 foundation owns stable regional/shared placement and dependencies across geography, ecology, resources, items, NPCs, schedules, services, recipes, quests, relationships, spell schools, capabilities, abilities, and companions while preserving existing catalogs as definition authorities. Its generated scale fixture validates 1,401 ownership records without contributing to gameplay census counts.

### Packet B — Redstone Forge-Road

**Status: IMPLEMENTED + HOSTED VALIDATION GREEN / PENDING FINAL LANDING.**

Frozen implementation/content SHA:

```text
440a77c542fcc6a6efcce7a45ca989e9068499f8
```

Pre-promotion hosted evidence:

```text
Check:              32416678697
Job:                96579293377
Node:               24.19.0
Repository Audit:   PASS
Tests:              707/707 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

Bounded graph:

```text
existing Redstone iron / sunstone / Ridge Ibex inputs
  -> existing forge + work proficiency + inventory/provenance authorities
  -> tempered iron / rivets / wearable work gear / caravan hardware
  -> provenance-qualified Brasshaven commitments
  -> character-owned Redstone techniques and spells
  -> Pack v2 ownership through pack-redstone-forge-road
```

The tranche adds no new simulation clock, persistence family, direct timed-task owner, inventory authority, social authority, or progression authority.

The established Varric copper-return continuity remains intact. Later Forge-Road orders use Mae Oris as a separate scheduled Market Ring contact so later jobs do not displace Varric's existing copper follow-up.

Version decision:

```text
Product:      0.9.100.2
Package:      0.9.100
Data:         41
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

Data 41 advances for new stable canonical authored records and their source/sink/social/Pack-v2 relationships. Game State remains 14 because no new durable player/world fact is introduced.

### Current census

```text
places/localities       26 / mechanics floor 10
named NPCs              12 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         56 / 200
recipes/processes       17 / 75
abilities/techniques     9 / 100
quests/contracts        11 / 30
companions                1 / 4
transport services        3 / 5
```

Infrastructure coverage:

```text
routes                                   7
spell schools                            3
capabilities/training definitions       12
NPC schedules                            4
regional/shared packs                    8
pack-owned records                     140
pack-owned abilities/capabilities/
  schedules/companions               9/12/4/1
```

Mechanics-scale gate remains **NOT READY** by design. This is not a failing CI condition.

### Next bounded packet — Elderwood Hunt-Timber

**Status: NOT STARTED / not authorized by Redstone completion alone.**

When explicitly authorized after Redstone lands, deepen the existing Elderwood root rather than bulk-generating global lists. Prefer a connected hunt/timber graph that joins named people and schedules to creature/resource recovery, wood/hide/resin processing, equipment/consumables, practical techniques, contracts/services, economy, field danger, and provenance through Pack v2.

Following Gate A tranches remain Starfen Marshcraft-Practical Magic and then Gate A integration/census review.

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
- Protected `main` + required Check remains recommended; if the repository action surface cannot configure protection, record that administrative limitation rather than claiming it was changed.
- Historical stale remote branches remain manual cleanup debt where no safe delete action exists.
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