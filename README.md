# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is now open. `0.9.100 Content Scale Gate A` is in progress, with its first infrastructure packet complete and the first high-volume content tranche deliberately not started.

```text
Product:       0.9.100.1
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          40
Benchmark:     3
Codename:      Content Pack Scale Contract v2
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

The 0.9.100 infrastructure packet extends the regional/shared content-pack contract before content volume grows. It adds one catalog bridge and Pack v2 ownership/validation for spell schools, capabilities/training definitions, executable abilities, NPC schedules, and companions while preserving the existing runtime catalogs as canonical definition authorities.

No new gameplay content, simulation clock, task engine, persistence family, or save migration was introduced by this packet. Game State therefore remains 14; Data advances to 40 because the canonical authored-data ownership/validation contract changed.

## Product direction

The game is one persistent life, not a collection of disconnected minigames. Hunting, gathering, work, production, trade, commitments, relationships, travel, combat, recovery, companions, home infrastructure, cultivation, and earned delegation feed one another through shared authorities.

Fictional time is separate from wall-clock waiting. Maps represent acquired knowledge. Materials preserve provenance. Disciplines describe training traditions; learned capabilities and mastery belong to the character.

## Content infrastructure

The current Pack v2 contract can own and cross-validate:

```text
places / routes / transport services
ecology families / species / populations / gathering sources
items / recipes
NPCs / NPC schedules / shops
quests / relationships
spell schools / capabilities / executable abilities
companions
```

`js/text/data/contentCatalogRegistry.js` bridges packs to the existing canonical catalogs rather than duplicating definitions merely to claim ownership. Items resolve across resource, production, and equipment catalogs; recipes, commitments, seed NPCs, routes/ecology, abilities/capabilities, schedules, and companions are also resolvable through the same boundary.

The content-pack validator enforces stable-ID ownership, cross-pack dependencies, dangling references, legacy leaks, and family-specific structure. A generated fixture validates more than 1,400 Pack v2 ownership records across items, recipes, NPCs, schedules, capabilities, abilities, and companions before equivalent canonical volume is authored.

## Content-scale census

```bash
npm run census
npm run census -- --json
```

Current gameplay breadth remains intentionally unchanged by the infrastructure packet:

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

Infrastructure coverage now reports separately:

```text
spell schools                         3
capabilities/training definitions     8
NPC schedules                          4
regional/shared content packs          7
pack-owned records                    115
pack-owned abilities/capabilities/
  schedules/companions              5/8/4/1
```

The mechanics-scale gate remains **NOT READY**. That is a progression fact, not a CI failure. Counts must not be gamed with disconnected filler.

## Persistence model

The project is pre-alpha and uses strict **current-schema-only** persistence. Old local saves are not automatically migrated unless a future bounded work order explicitly requires compatibility.

Game State 14 still owns the same durable player/world facts. Important non-serialized runtime state includes root combat/stat caches, `activeBattle.rng`, the flat inventory alias, reconstructed `state.npcs`/`state.enemies`, and top-level session presentation history. `state.events` remains persisted structured semantic observation history.

## Player interface

The player-facing UI is a **world interface**, not a permanent command console. Primary information navigation includes Scene, Character, Spellbook, Journal, Codex, Craft, and World. Contextual gameplay actions use semantic intents into domain systems; command routing remains an optional adapter/regression surface.

## Systems already playable / proven

- deterministic fictional time, simulation control, timed tasks, interrupts, and day review;
- multi-region travel, exploration, scheduled transport, acquired map knowledge;
- character progression, skills, capabilities, equipment, abilities;
- deterministic combat, statuses, battle persistence, recovery, companions;
- inventory containers, carried load, shops, provenance, resource recovery;
- ecology, gathering, work proficiency, production, workstations;
- commitments, relationships, recurring NPC availability, semantic Journal/information surfaces;
- home storage, workshop capability, portable field logistics;
- cultivation/stewardship, earned tending delegation, and home-linked community continuity;
- current-schema persistence, lifecycle guards, connected Pack v2 validation, content-scale census, and repeatable benchmark sampling.

## Current decision boundary

`0.9.100 Content Scale Gate A` is open. **Content Pack Scale Contract v2 is the completed first packet.** The next proposed bounded packet is the Redstone Forge-Road regional tranche, but it has not been started by this infrastructure work order.

Before any high-volume authoring/import, content must use the connected Pack v2 ownership/validation path and the census must continue distinguishing real gameplay breadth from pack bookkeeping.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. relevant architecture/runtime/tests for the active pass

Repository evidence beats conversation memory.

## Running

```bash
npm start
```

Validation/progression entry points:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
npm run hardening
npm run check
```

`npm run check` and hosted `Check` now execute Repository Audit + Test + Content Census + Benchmark 3 + Benchmark Sample. Census target shortfalls remain informational. `package.json` requires Node 24 or newer.
