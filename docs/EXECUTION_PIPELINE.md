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
Product:       0.9.100.5
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          44
Benchmark:     3
Phase:         0.9 in progress
Codename:      Location & Area Profiles
Runtime:       Node >=24
```

Phase 0.8 is complete. Phase 0.9 / `0.9.100 Content Scale Gate A` is active. Packets A–D are merged. A separately authorized Location & Area Profiles pass is implemented, validated, promoted, and pending final exact-head Check + PR landing.

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

**Status: COMPLETE / MERGED.**

Elderwood established the second authored Pack-v2 regional proof with hunt/timber recovery, tannery/woodshop production, persistent contacts, fictional-time civic availability, commitments, and field techniques. Its frozen implementation checkpoint was `acb24b73b4894d3febab370aa279bdfd12cbd02e`; the promoted packet landed before Packet D opened.

### Current census

Validated Packet D implementation/content checkpoint:

```text
places/localities       26 / mechanics floor 10
named NPCs              17 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         68 / 200
recipes/processes       29 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions                1 / 4
transport services        3 / 5
```

Infrastructure coverage:

```text
routes                                   7
spell schools                            4
capabilities/training definitions       44
NPC schedules                            7
regional/shared packs                   10
pack-owned records                     248
pack-owned abilities/capabilities/
  schedules/companions              41/44/7/1
runtime seed NPCs                       16
runtime seed enemies                    13
```

Mechanics-scale gate remains **NOT READY** by design. Companions are now the largest relative gap. This is not a failing CI condition.

### Packet D — Universal Magic & Starfen Marshcraft

**Status: IMPLEMENTED + VALIDATED + PROMOTED / PENDING FINAL EXACT-HEAD CHECK AND LANDING.**

Frozen gameplay/content implementation SHA:

```text
ee81069defe59a55979bc262ea595c3c9df42f40
```

Pre-promotion hosted evidence:

```text
Check:              33139128883
Job:                98745791538
Node:               24.19.0
Repository Audit:   PASS
Tests:              719/719 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

Bounded graph:

```text
shared character magic authority
  -> Elemental Form / Vital Weave / Ward Lore / Veilscript
  -> universal learned spell capabilities + executable abilities
  -> no regional spell ownership or location gate

existing Starfen resources/recovery
  -> existing production/work/provenance/inventory authorities
  -> marsh medicine / cord / waterproofing / survey gear
  -> persistent Mistmere contacts + fictional-time schedules
  -> provenance-qualified community/research commitments
  -> regional Starfen Current Reading field knowledge
  -> pack-starfen-marshcraft
```

The external Tales of Symphonia material is retained only as non-canonical taxonomy research in `docs/research/TALES_OF_SYMPHONIA_MAGIC_REFERENCE.md`. Canonical spell names, stable IDs, schools, effects, and lore are original Hearth & Horizon content.

Version decision:

```text
Product:      0.9.100.4
Package:      0.9.100 unchanged
Data:         43
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

Data 43 advances because stable canonical magic IDs/ownership, capability/ability catalogs, commitment-reference validation, Starfen marshcraft outputs/processes/NPCs/schedules/contracts, and the child regional pack changed. Game State remains 14 because no new durable player/world authority was introduced.

### Location & Area Profiles — authorized supporting-data pass

**Status: IMPLEMENTED + VALIDATED + PROMOTED / PENDING FINAL CHECK AND LANDING.**

Frozen implementation/data SHA:

```text
ba156a416026835ccc483b8644d134a8d3d062d9
```

Pre-promotion hosted evidence:

```text
Check:              33149570962
Job:                98778174178
Repository Audit:   PASS
Tests:              725/725 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

The pass provides 26 place profiles, five settlement aggregates, three region aggregates, and a world population summary. It composes existing place/ecology authority rather than creating a second geography or species database.

Demographic semantics:

```text
resident population
+ typical transient/workforce presence
= typical present population
```

Settlement, region, and world totals are derived from place profiles. Flora/fauna distinguish local canonical records from regional context; missing local ecology remains visible rather than fabricated.

Version decision:

```text
Product:      0.9.100.5
Package:      0.9.100 unchanged
Data:         44
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

### Next bounded packet — Packet E Gate A integration/census audit

**Status: QUEUED / NOT STARTED.**

This profile pass does not auto-start Packet E.

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