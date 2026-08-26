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
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Phase:         0.9 in progress
Codename:      Elderwood Hunt-Timber
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

Do not redo Phase 0.4–0.8 discovery, persistence classification, the post-0.8 audit, Pack v2 infrastructure discovery, or earlier Gate A packet discovery unless a concrete regression/change requires it.

# Completed foundation

```text
Phase 0.4–0.7                  COMPLETE
Phase 0.8 life/infrastructure  COMPLETE
Phase 0.8 exit audit           COMPLETE
post-0.8 status/repair audit   COMPLETE
repository contract audit      COMPLETE
Pack v2 infrastructure         COMPLETE
Redstone Forge-Road            COMPLETE / MERGED
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

**Status: COMPLETE and merged.**

Redstone established the first authored regional proof on Pack v2 by joining existing iron, sunstone, Ridge Ibex recovery, forge work, equipment, provenance, Brasshaven commitments, schedules, and character-owned techniques without adding a parallel authority.

### Packet C — Elderwood Hunt-Timber

**Status: IMPLEMENTED + HOSTED IMPLEMENTATION VALIDATION GREEN / PENDING FINAL PROMOTED-HEAD VALIDATION AND LANDING.**

Frozen implementation/content SHA:

```text
acb24b73b4894d3febab370aa279bdfd12cbd02e
```

Pre-promotion hosted evidence:

```text
Check:              32423676980
Job:                96600958329
Node:               24.19.0
Repository Audit:   PASS
Tests:              711/711 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

Bounded graph:

```text
existing Barkboar recovery / Duskcap / amber resin / hardwood
  -> existing tannery + woodshop + work proficiency + inventory/provenance authorities
  -> tanned hide / bindings / resin boards + pitch / field gear / road repair bundles
  -> persistent Thornwall contacts + Oren Vale schedule
  -> provenance-qualified commitments
  -> character-owned Elderwood techniques/warding
  -> Pack v2 ownership through pack-elderwood-hunt-timber
```

The tranche adds no new simulation clock, persistence family, direct timed-task owner, inventory authority, social authority, progression authority, place, or companion system.

Version decision:

```text
Product:      0.9.100.3
Package:      0.9.100
Data:         42
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

Data 42 advances for new stable canonical authored records and their source/sink/social/schedule/Pack-v2 relationships. Game State remains 14 because no new durable player/world fact is introduced.

### Current census

```text
places/localities       26 / mechanics floor 10
named NPCs              15 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         62 / 200
recipes/processes       23 / 75
abilities/techniques    13 / 100
quests/contracts        14 / 30
companions                1 / 4
transport services        3 / 5
```

Infrastructure coverage:

```text
routes                                   7
spell schools                            3
capabilities/training definitions       16
NPC schedules                            5
regional/shared packs                    9
pack-owned records                     171
pack-owned abilities/capabilities/
  schedules/companions              13/16/5/1
runtime seed NPCs                       14
runtime seed enemies                    13
```

Mechanics-scale gate remains **NOT READY** by design. Abilities/techniques remain the largest relative gap. This is not a failing CI condition.

### Next bounded packet — Starfen Marshcraft-Practical Magic

**Status: NOT STARTED / not authorized by Elderwood completion alone.**

After Elderwood lands and only with a new explicit continuation, deepen the existing Starfen/Mistmere root rather than bulk-generating global lists. Prefer a connected wetland graph that joins named people/schedules and community/research needs to herbs/fungi, medicine/cooking, practical magic, training, canal/water context, contracts/services, field danger, and provenance through Pack v2.

Following that regional tranche is Gate A integration/census review.

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