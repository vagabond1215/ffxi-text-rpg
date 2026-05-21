# Baseline Pipeline

This document defines the start-to-finish production pipeline for rebuilding the text RPG. It is intentionally broad so every system has an assigned place before implementation begins.

## Version lanes

| Lane | Purpose | Current |
| --- | --- | --- |
| App version | User-facing runtime and command shell maturity | 0.2.0 |
| Save version | Persisted state shape | 2 |
| Data version | Registry/schema/data compatibility | 1 |
| Benchmark version | Performance baseline suite | 1 |

Version data lives in `js/text/version.js`.

## Pipeline stages

### 1. Research intake

Inputs:
- Official documentation where available.
- High-quality wiki references.
- Community-tested formulas.
- Open-source server/emulator implementations where legally and ethically useful for structural reference.
- Existing legacy repo data, treated as source material until migrated.

Output:
- Source notes.
- Confidence level.
- Simplification decision.
- Target version assignment.

### 2. System ticketing

Every system must be assigned to one of these version tracks:

| Track | Meaning |
| --- | --- |
| planned | Identified but not implemented. |
| seeded | Has minimal schema or seed data. |
| integrated | Runtime can read/use it. |
| playable | Exposed through commands and game loop. |
| balanced | Has tests, tuning, and expected benchmarks. |

### 3. Schema definition

Before gameplay behavior, define:
- IDs and naming rules.
- Ownership: save state, static data, temporary battle state, runtime timer state.
- Relationships to other databases.
- Validation rules.
- Version impact.

### 4. Database population

Database categories:
- enemies
- NPCs
- places
- zone connections
- travel methods and restrictions
- quests
- achievements
- items
- key items
- magic
- abilities and traits
- loot tables
- leveling and skill caps
- trusts / AI companions
- crafting
- mounts
- status effects
- live tick subscriptions

Each database needs:
- schema
- seed records
- validation
- lookup helpers
- integration tests
- command inspection

### 5. Engine integration

Engines should be added in this order:
1. validation
2. lookup/indexing
3. calculation
4. mutation/update
5. command integration
6. tests
7. benchmark coverage

### 6. Live tick integration

The live tick timer is the backbone for time-based systems.

Tick consumers:
- status effect duration and ticks
- HP/MP/TP regeneration
- magic cast progress
- spell recast timers
- ability cooldowns
- combat action delay
- auto-attacks
- enemy AI decisions
- trust AI decisions
- travel progress
- crafting progress
- respawn timers
- timed quest objectives
- mount timers or restrictions

Tick rules:
- Tick consumers register through `tickEngine` channels.
- Long actions should store progress in state, not in the DOM.
- The timer should be pausable.
- Deterministic test hooks should exist before complex combat is added.

### 7. Command exposure

Commands should expose only stable slices of systems.

Examples:
- `databases`
- `version`
- `systems`
- `tick`
- `zones`
- `travel <destination>`
- `quest list`
- `item inspect <id>`
- `magic list`
- `cast <spell> <target>`
- `attack <target>`
- `trust summon <id>`
- `craft <recipe>`
- `mount <id>`

### 8. Benchmarks

Every new runtime-heavy system should add or update benchmarks.

Baseline categories:
- combat profile calculation
- enemy profile calculation
- battle attack resolution
- tick dispatch
- database lookup/indexing
- pathfinding/travel lookup
- loot roll resolution
- quest condition evaluation
- trust AI decision pass

Benchmark command:

```bash
npm run benchmark
```

### 9. Version release gate

Before increasing app/data/save version:
- tests pass
- benchmarks run
- changelog updated
- roadmap updated
- architecture/pipeline docs updated
- save compatibility decision documented

## External implementation references to review

These are research targets, not dependencies:

- Official Final Fantasy XI manuals and update notes for high-level system behavior.
- BG Wiki and FFXIclopedia for player-facing mechanics and terminology.
- Community formula research for combat, magic, TP, enmity, crafting, and EXP.
- LandSandBoat as an open-source FFXI server implementation reference for database categories and server-side system decomposition.
- General text RPG / MUD architecture patterns for command parsing, tick loops, room graphs, NPC scripting, loot tables, and AI companions.

## Immediate next version target: 0.3.0

Goal: world graph and travel baseline.

Required:
- places database
- zone connection schema
- travel restriction schema
- travel command
- zone inspection command
- tick-based travel progress scaffold
- tests for connected/disconnected travel
- benchmark for zone graph lookup
