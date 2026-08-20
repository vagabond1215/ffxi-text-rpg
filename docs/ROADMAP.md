# Roadmap

This is the authoritative phase and feature-track roadmap for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Operational sequencing lives in `docs/EXECUTION_PIPELINE.md`. Exact restart state lives in `docs/THREAD_HANDOFF.md`. Detailed Gate A planning lives in `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`.

## Current validated baseline

```text
Product:       0.9.100.2
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          41
Benchmark:     3
Codename:      Redstone Forge-Road
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Phase 0.8 remains complete. Phase 0.9 is **open / in progress**. Content Pack Scale Contract v2 is complete and Redstone Forge-Road is the first authored Gate A regional tranche, implemented and validated pending final landing.

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

Current gameplay breadth after Redstone Forge-Road:

| Category | Current | Mechanics integration | Playable alpha | 1.0 lower bound |
| --- | ---: | ---: | ---: | ---: |
| Places/localities | 26 | 10 | 30 | 75 |
| Named NPCs | 12 | 50 | 250 | 700 |
| Functional shop/service sites | 17 | 20 | 60 | 150 |
| Creature definitions | 16 | 40 | 120 | 300 |
| Resource sources | 13 | 40 | 100 | 250 |
| Canonical items | 56 | 200 | 800 | 2,500 |
| Recipes/processes | 17 | 75 | 300 | 800 |
| Abilities/techniques | 9 | 100 | 250 | 500 |
| Quests/contracts | 11 | 30 | 150 | 500 |
| Recruitable companions | 1 | 4 | 12 | 25 |
| Scheduled transport services | 3 | 5 | 20 | 50 |

Mechanics-scale status is **NOT READY**. Places already exceed the mechanics floor; abilities/techniques remain the largest relative gap.

Infrastructure coverage is tracked separately from authored breadth:

```text
regional/shared content packs                          8
pack-owned records                                   140
pack-owned abilities/capabilities/schedules/companions 9/12/4/1
spell schools                                           3
capability/training definitions                        12
NPC schedules                                           4
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

**Status: COMPLETE / MERGED.**

The packet established Pack v2 ownership for geography, ecology, items, NPCs, schedules, services, recipes, quests, relationships, spell schools, capabilities, executable abilities, and companions while keeping existing catalogs as canonical definition authorities. Validation covers stable-ID ownership, dependency integrity, dangling references, legacy leakage, and a generated 1,401-record scale fixture.

### Packet B — Redstone Forge-Road

**Status: IMPLEMENTED + VALIDATED / PENDING FINAL LANDING.**

Frozen implementation/content SHA:

```text
440a77c542fcc6a6efcce7a45ca989e9068499f8
```

Pre-promotion hosted Check `32416678697` / job `96579293377` passed Repository Audit, **707/707 tests**, Content Census, Benchmark 3, and Benchmark Sample on Node 24.19.0.

The tranche reuses the existing Redstone/Brasshaven substrate and adds one connected downstream graph:

- four character-owned Redstone capabilities plus four executable abilities;
- six additional forge outputs and six additional forge processes connected to existing iron, sunstone, Ridge Ibex, work-proficiency, workstation, inventory, and provenance authorities;
- three provenance-qualified Brasshaven commitments consuming those outputs;
- a `pack-redstone-forge-road` child Pack v2 graph depending on shared foundation, Redstone opening, and Redstone ecology breadth;
- focused end-to-end proof for ownership, production/provenance, exactly-once social resolution, and executable combat training.

The Varric copper-return continuity remains intact. Later Forge-Road orders use Mae Oris as a separate scheduled Market Ring contact rather than crowding the already-established Varric path.

Version decision:

```text
Product:      0.9.100.1 -> 0.9.100.2
Package:      0.9.100 unchanged
Data:         40 -> 41
Game State:   remains 14
Account Save: remains 5
Benchmark:    remains 3
```

Data advances because new stable canonical authored records and their cross-linked source/sink/social/Pack ownership relationships are part of the current data contract. Game State does not advance because no new durable player/world fact was introduced.

### Next bounded packet — Elderwood Hunt-Timber

**Status: NOT STARTED.**

After Redstone lands and only with a new explicit continuation, deepen the existing Elderwood root with a dense hunt/timber graph joining named people and schedules to creature/resource recovery, timber/hide/resin processing, equipment/consumables, practical techniques, contracts/services, economy, field danger, and provenance through Pack v2.

Following Gate A tranches remain Starfen Marshcraft-Practical Magic, then Gate A integration/census review. Their numeric planning bands remain guidance, not quotas.

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

A future continuation must start from `THREAD_HANDOFF.md` and `EXECUTION_PIPELINE.md`. Elderwood Hunt-Timber is not authorized merely because it appears here.