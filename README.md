# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. `0.9.100 Content Scale Gate A` is in progress. **Headwater Vale & Waymeet Approach** is the current Data 52 geography/content checkpoint, extending Timbercross upstream into the first grounded overland approach toward Waymeet while preserving route-gated world geography.

```text
Product:       0.9.100.14
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          53
Benchmark:     3
Codename:      Starfen Delta & Brackish Coast
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Data 52 adds Headwater Lower Vale, Headwater Warden Lodge, and Headwater Upper Vale; a wagon-capable river road followed by a foot/mount upper trail; six river/forest species; population-backed red-deer hunting; six gathering sources and nine raw/body resources; and ten connected processing/crafting outputs covering fish, venison, leather, alder/willow work, provisions, and bridge repair. The upper rim deliberately has no onward route yet. Game State remains 14.

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

## Universal Magic & Starfen Marshcraft

Magic is now a **shared universal character capability**, not a Redstone, Elderwood, Starfen, city, or trainer-location possession. Regions may provide teachers, traditions, contracts, and examples, but canonical spell stable IDs live in the shared foundation and learning/use depends on character training, skill, resources, and context rather than geography.

The packet adds:

- four universal spell schools: Elemental Form, Vital Weave, Ward Lore, and **Veilscript**;
- 33 shared spell capabilities and 33 shared executable spell abilities, including eight elemental families, restoration/support, and four Veilscript seal arts using the existing `ninjutsu` skill;
- original Hearth & Horizon names/mechanics derived from systemic research rather than copied franchise identity; `docs/research/TALES_OF_SYMPHONIA_MAGIC_REFERENCE.md` is explicitly non-canonical research;
- six downstream Starfen marshcraft outputs/processes using existing reed fiber, Bluekelp, Marrowleaf, Bogberry, Mirecrest Heron recovery, kitchen/work, inventory, proficiency, and provenance authorities;
- Pelu Senn and Tavi Meren as persistent Mistmere contacts with fictional-time schedules;
- four provenance-qualified Mistmere commitments, with universal spells deliberately **not** gated by regional contract completion;
- Starfen Current Reading retained as regional field knowledge rather than magic;
- `pack-starfen-marshcraft` for regional marshcraft ownership while all spell schools/spells remain owned by `pack-shared-foundation`;
- Pack-v2 catalog-ref validation extended across canonical commitment giver/place/item/source/capability relationships.

No new place, companion, simulation clock, persistence family, direct timed-task owner, inventory authority, progression state family, or social-state family was introduced.

## Content-scale census

```bash
npm run census
npm run census -- --json
```

Validated Data 52 census:

```text
places/localities       40 / mechanics floor 10
named NPCs              32 / 50
shop/service sites      27 / 20
creatures               64 / 40
resource sources        89 / 40
canonical items        283 / 200
recipes/processes      164 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions               1 / 4
transport services       6 / 5
```

Infrastructure coverage:

```text
routes                               14
spell schools                         4
capabilities/training definitions    44
NPC schedules                        17
regional/shared content packs        23
pack-owned records                   859
pack-owned abilities/capabilities/
  schedules/companions            41/44/17/1
runtime seed NPCs                    31
runtime seed enemies                 17
```

The mechanics-scale gate remains **NOT READY**. Places, shop/service sites, creatures, resource sources, canonical items, recipes/processes, and transport services meet their mechanics floors. Companions remain the largest relative gap, with abilities, NPC breadth, and quests materially short. Regional sufficiency should be improved with plausible substitutes and dependable trade—not duplicate specialty resources or disconnected filler.

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
- Pack v2 ownership/validation, Redstone Forge-Road, Elderwood Hunt-Timber, Starfen Marshcraft, universal shared magic, Coppergrass, Slatewater, Crownfields managed agriculture, regional ingredient/luxury processing, Great Mere freshwater economy, population-backed hunting, Ironspine alpine ecology/economy, explicit period-framed item food-safety metadata, ecology/geography integrity guards, content-scale census, current-schema persistence, lifecycle guards, and repeatable benchmark sampling.

## Current decision boundary

`0.9.100 Content Scale Gate A` remains open. Ironspine Highlands and the population-backed hunting bridge are the latest completed bounded work on `main`. **Packet E — Gate A integration/census audit — remains the next formal roadmap gate**; **Emberwash Badlands** is the next ranked world-edge candidate. Neither is auto-started without an explicit bounded work order.

Future magic expansion must preserve the universal/shared ownership rule. Regional content may teach, contextualize, or reward access to character-owned magic, but it must not make a spell definition location-owned. External-game spell lists remain research inputs only and must pass originalization before entering canonical catalogs.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/ZONE_PROFILE_IRONSPINE_HIGHLANDS.md` for the latest alpine region
9. `docs/ZONE_PROFILE_GREAT_MERE.md` for the freshwater region
10. `docs/ITEM_CONSUMPTION_SAFETY.md` for the standing food-safety item contract
11. `docs/REGIONAL_INGREDIENT_LUXURY_PROCESSING.md` for Data 47 production-depth state
12. `docs/ZONE_PROFILE_CROWNFIELDS.md` for the agricultural region
13. `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md` for ecology/geography state and deferred gaps
14. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` for active Phase 0.9 sequencing
15. relevant architecture/runtime/tests for the active pass

Repository evidence beats conversation memory. Low-risk normal development now prefers direct work on `main`; create a branch only when rollback/blast-radius risk exceeds what an ordinary GitHub revert can safely contain.

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