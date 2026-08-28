# Roadmap

This is the authoritative phase and feature-track roadmap for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Operational sequencing lives in `docs/EXECUTION_PIPELINE.md`. Exact restart state lives in `docs/THREAD_HANDOFF.md`. Detailed Gate A planning lives in `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`.

## Current validated baseline

```text
Product:       0.9.100.5
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          44
Benchmark:     3
Codename:      World Edge Expansion & Slatewater Waylodge
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Phase 0.8 remains complete. Phase 0.9 is **open / in progress**. Packets A–C are merged; Packet D is implemented, validated on frozen gameplay/content SHA `ee81069defe59a55979bc262ea595c3c9df42f40`, promoted to Product 0.9.100.4 / Data 43, and pending final exact-head validation + PR landing.

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

Game State ended Phase 0.8 at 14 and remains 14 through the current Gate A content packets.

# Content scale as the Phase 0.9 gate

`npm run census` is an executable progression indicator and runs in ordinary hosted `Check`, but incomplete content targets are **not CI failures**.

Current gameplay breadth after Packet D:

| Category | Current | Mechanics integration | Playable alpha | 1.0 lower bound |
| --- | ---: | ---: | ---: | ---: |
| Places/localities | 26 | 10 | 30 | 75 |
| Named NPCs | 17 | 50 | 250 | 700 |
| Functional shop/service sites | 17 | 20 | 60 | 150 |
| Creature definitions | 16 | 40 | 120 | 300 |
| Resource sources | 13 | 40 | 100 | 250 |
| Canonical items | 68 | 200 | 800 | 2,500 |
| Recipes/processes | 29 | 75 | 300 | 800 |
| Abilities/techniques | 41 | 100 | 250 | 500 |
| Quests/contracts | 18 | 30 | 150 | 500 |
| Recruitable companions | 1 | 4 | 12 | 25 |
| Scheduled transport services | 3 | 5 | 20 | 50 |

Mechanics-scale status is **NOT READY**. Places already exceed the mechanics floor. Companions are now the largest relative gap.

Infrastructure coverage remains distinct from authored breadth:

```text
regional/shared content packs                           10
pack-owned records                                     248
pack-owned abilities/capabilities/schedules/companions 41/44/7/1
spell schools                                             4
capability/training definitions                          44
NPC schedules                                             7
runtime seed NPCs                                        16
runtime seed enemies                                     13
```

The ability jump is intentional connected catalog breadth, not a regional ownership shortcut: all 33 canonical spells are shared-owned and character-learned, while regional packs retain only non-spell techniques/field knowledge.

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

**Status: COMPLETE / MERGED.**

The packet established Pack v2 ownership for geography, ecology, items, NPCs, schedules, services, recipes, quests, relationships, spell schools, capabilities, executable abilities, and companions while keeping existing catalogs as canonical definition authorities. Validation covers stable-ID ownership, dependency integrity, dangling references, legacy leakage, and a generated 1,401-record scale fixture.

### Packet B — Redstone Forge-Road

**Status: COMPLETE / MERGED.**

Redstone established the first authored regional tranche on Pack v2, composing existing iron/sunstone/Ridge Ibex recovery, forge/work, inventory/provenance, scheduled Brasshaven contacts, commitments, and character-owned techniques without adding parallel authorities.

### Packet C — Elderwood Hunt-Timber

**Status: COMPLETE / MERGED.**

Elderwood proved Pack-v2 throughput across hunt/timber recovery, tannery/woodshop production, persistent contacts, fictional-time civic availability, commitments, and field techniques. It remains a historical completed Packet C checkpoint.

### Packet D — Universal Magic & Starfen Marshcraft

**Status: IMPLEMENTED + VALIDATED + PROMOTED / PENDING FINAL CHECK AND LANDING.**

Packet D changes the originally planned Starfen-magic ownership model: **magic is universal/shared**. Regions may teach or contextualize spells, but no canonical spell definition is owned by a place or region.

Implemented:

- four shared spell schools, including original **Veilscript** seal magic using the existing `ninjutsu` skill;
- 33 shared spell capabilities and 33 shared executable spells, spanning eight elemental families plus restoration/support/warding/sigils;
- no `redstone`, `elderwood`, or `starfen` tags on canonical spell definitions;
- external Tales of Symphonia material retained only as non-canonical taxonomy research, with original Hearth & Horizon names and mechanics entering canon;
- six connected Starfen marshcraft outputs/processes;
- two persistent Mistmere contacts and two schedules;
- four Starfen/Mistmere production/community commitments;
- Starfen Current Reading retained as regional non-magical field knowledge;
- `pack-starfen-marshcraft` for regional ownership and `pack-shared-foundation` for universal spell ownership;
- stronger canonical commitment cross-reference validation.

Frozen implementation/content SHA `ee81069defe59a55979bc262ea595c3c9df42f40` passed hosted Check `33139128883` / job `98745791538` with **719/719 tests**, census, Benchmark 3, and Benchmark Sample.

### Packet E — Gate A integration/census audit

**Status: QUEUED / NOT STARTED.**

After Packet D lands, the next bounded review is combined Gate A integration/census. It should assess connectedness, target gaps, and validation evidence rather than manufacture records to hit planning bands. It is not authorized automatically by this roadmap entry.

## Phase 0.9 governance

Phase 0.9 work uses PR-based integration. Protected `main` / required-check enforcement remains recommended; when the available repository action surface cannot configure it, record that limitation instead of claiming it was changed.

# Current Game State 14 persistence boundary

The current Gate A packets change no persistence ownership. Required current-schema authority still includes world/simulation/task state, travel, projects, commitments, relationships, ecology/resource opportunities, cultivation/delegation, party/ability runtime, semantic events, discovery, player state, location, and active combat when present.

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

A future continuation must start from `THREAD_HANDOFF.md` and `EXECUTION_PIPELINE.md`. Starfen Marshcraft-Practical Magic is not authorized merely because it appears here.