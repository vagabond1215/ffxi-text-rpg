# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. `0.9.100 Content Scale Gate A` is in progress. The infrastructure-first Content Pack Scale Contract v2 packet is complete, and the Redstone Forge-Road regional tranche is implemented and validated pending final PR landing.

```text
Product:       0.9.100.2
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          41
Benchmark:     3
Codename:      Redstone Forge-Road
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Data advances from 40 to 41 because Redstone Forge-Road adds stable canonical abilities/capabilities, production items/processes, commitments, and one child Pack v2 ownership graph. Game State remains 14 because the tranche adds no new durable player/world authority, simulation clock, task engine, persistence family, or save migration.

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

`js/text/data/contentCatalogRegistry.js` bridges packs to the existing canonical catalogs rather than duplicating definitions merely to claim ownership. The content-pack validator enforces stable-ID ownership, cross-pack dependencies, dangling references, legacy leaks, and family-specific structure. A generated fixture validates 1,401 Pack v2 ownership records without contributing to canonical content counts.

## Redstone Forge-Road

The current regional tranche deliberately deepens existing Brasshaven/Redstone loops instead of creating disconnected breadth.

It adds:

- four character-owned Redstone capabilities and four executable abilities;
- six additional downstream Redstone forge outputs, including tempered iron, rivets, wearable forge/mining equipment, and caravan repair hardware;
- six additional forge processes using existing iron, sunstone, Ridge Ibex, forge, work-proficiency, inventory, and provenance authorities;
- three provenance-qualified Brasshaven commitments that consume real forged output;
- `pack-redstone-forge-road`, dependent on the shared foundation, Redstone opening root, and Redstone ecology breadth pack;
- focused end-to-end coverage for Pack v2 ownership, real production/provenance, exactly-once commitment resolution, and executable Redstone combat training.

The established Varric copper-return continuity remains intact. Later Forge-Road orders use Mae Oris as a separate scheduled Market Ring contact so new work does not displace that earlier relationship path.

## Content-scale census

```bash
npm run census
npm run census -- --json
```

Validated Redstone checkpoint:

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
routes                                7
spell schools                         3
capabilities/training definitions    12
NPC schedules                         4
regional/shared content packs         8
pack-owned records                   140
pack-owned abilities/capabilities/
  schedules/companions             9/12/4/1
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
- Pack v2 ownership/validation, Redstone Forge-Road production/training/contracts, content-scale census, current-schema persistence, lifecycle guards, and repeatable benchmark sampling.

## Current decision boundary

`0.9.100 Content Scale Gate A` remains open. Redstone Forge-Road is the completed first authored regional tranche after Pack v2 infrastructure. **Elderwood Hunt-Timber is next but has not been started by this work order.**

Before any further high-volume authoring/import, content must continue through the connected Pack v2 ownership/validation path and the census must distinguish real gameplay breadth from pack bookkeeping.

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

`npm run check` and hosted `Check` execute Repository Audit + Test + Content Census + Benchmark 3 + Benchmark Sample. Census target shortfalls remain informational. `package.json` requires Node 24 or newer.