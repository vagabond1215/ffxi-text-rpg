# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. `0.9.100 Content Scale Gate A` is in progress. Content Pack Scale Contract v2 and Redstone Forge-Road are complete; **Elderwood Hunt-Timber** is implemented, validated on its frozen implementation/data head, and pending final promoted-head validation + PR landing.

```text
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Codename:      Elderwood Hunt-Timber
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Data advances from 41 to 42 because Elderwood Hunt-Timber adds stable canonical NPCs, schedule placement, capabilities/abilities, production items/processes, commitments, and one child Pack v2 ownership graph. Game State remains 14 because the tranche adds no new durable player/world authority, simulation clock, task engine, persistence family, or save migration.

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

## Elderwood Hunt-Timber

The current regional tranche deliberately deepens existing Thornwall/Elderwood loops instead of creating disconnected breadth.

It adds:

- four character-owned Elderwood capabilities and four executable abilities;
- six downstream Elderwood outputs and six processes using existing Barkboar recovery, Duskcap, amber resin, hardwood, tannery/woodshop, work-proficiency, inventory, and provenance authorities;
- three existing POI people promoted to persistent NPC-backed contacts, with Oren Vale on a canonical-fictional-time 07:00–15:00 roadworks schedule;
- three provenance-qualified Thornwall commitments consuming real Elderwood production output;
- `pack-elderwood-hunt-timber`, dependent on the shared foundation, Elderwood opening root, and Elderwood ecology breadth pack;
- focused end-to-end coverage for Pack v2 ownership, real production/provenance, exactly-once civic resolution, schedule behavior, census growth, and executable Barkboar Brace.

No new place, companion, simulation clock, persistence family, direct timed-task owner, inventory authority, progression authority, or social authority was introduced.

## Content-scale census

```bash
npm run census
npm run census -- --json
```

Validated Elderwood implementation checkpoint:

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
companions               1 / 4
transport services       3 / 5
```

Infrastructure coverage:

```text
routes                                7
spell schools                         3
capabilities/training definitions    16
NPC schedules                         5
regional/shared content packs         9
pack-owned records                   171
pack-owned abilities/capabilities/
  schedules/companions            13/16/5/1
runtime seed NPCs                    14
runtime seed enemies                 13
```

The mechanics-scale gate remains **NOT READY**. That is a progression fact, not a CI failure. Abilities/techniques remain the largest relative gap. Counts must not be gamed with disconnected filler.

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
- Pack v2 ownership/validation, Redstone Forge-Road and Elderwood Hunt-Timber connected regional content, content-scale census, current-schema persistence, lifecycle guards, and repeatable benchmark sampling.

## Current decision boundary

`0.9.100 Content Scale Gate A` remains open. Elderwood Hunt-Timber is the completed second authored regional tranche after Redstone, pending final exact-head validation and PR landing. **Starfen Marshcraft-Practical Magic is next but has not been started or authorized by this work order.**

Before any further high-volume authoring/import, content must continue through the connected Pack v2 ownership/validation path and the census must distinguish real gameplay breadth from pack bookkeeping.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` for active Phase 0.9 sequencing
9. relevant architecture/runtime/tests for the active pass

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