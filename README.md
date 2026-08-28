# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. `0.9.100 Content Scale Gate A` is in progress. Packets A–D, ecology breadth, Coppergrass, Slatewater, and the Data 45 ecology/geography integrity pass are merged. **Crownfields Agricultural Lowlands is merged** through PR #392 at `738faa5813e4aca30950b0d787f1209ae9a3d917`. Its post-merge main Check #1308 / run `33200236952` is the final product-baseline verification.

```text
Product:       0.9.100.7
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          46
Benchmark:     3
Codename:      Crownfields Agricultural Lowlands
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Data 46 adds Crownfields, Crownfields Grange, the Southfield Farm Road, a scheduled produce wagon, managed agricultural ecology, six provenance-backed crops, and the Grange’s trade/guild/service layer. Game State remains 14 because all of this reuses existing place, route, transport, ecology, gathering, inventory/provenance, shop, schedule, recovery, and Pack-v2 authorities.

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

Validated Crownfields pre-promotion census:

```text
places/localities       31 / mechanics floor 10
named NPCs              23 / 50
shop/service sites      21 / 20
creatures               45 / 40
resource sources        41 / 40
canonical items         96 / 200
recipes/processes       29 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions               1 / 4
transport services       5 / 5
```

Infrastructure coverage:

```text
routes                                8
spell schools                         4
capabilities/training definitions    44
NPC schedules                        11
regional/shared content packs        15
pack-owned records                   410
pack-owned abilities/capabilities/
  schedules/companions            41/44/9/1
runtime seed NPCs                    22
runtime seed enemies                 13
```

The mechanics-scale gate remains **NOT READY**. Places, shop/service sites, creatures, resource sources, and transport services now meet or exceed their mechanics floors. Companions remain the largest relative gap, with recipes, abilities, NPC breadth, items, and quests also materially short. Counts must not be gamed with disconnected filler.

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
- Pack v2 ownership/validation, Redstone Forge-Road, Elderwood Hunt-Timber, Starfen Marshcraft, universal shared magic, Coppergrass, Slatewater, Crownfields managed agriculture, ecology/geography integrity guards, content-scale census, current-schema persistence, lifecycle guards, and repeatable benchmark sampling.

## Current decision boundary

`0.9.100 Content Scale Gate A` remains open. Crownfields is merged. **Packet E — Gate A integration/census audit — remains the next formal roadmap gate**; **Great Mere** is the next ranked world-edge candidate. Population-backed hunting also remains a strong ecology-system candidate. None is auto-started without an explicit bounded work order.

Future magic expansion must preserve the universal/shared ownership rule. Regional content may teach, contextualize, or reward access to character-owned magic, but it must not make a spell definition location-owned. External-game spell lists remain research inputs only and must pass originalization before entering canonical catalogs.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/ZONE_PROFILE_CROWNFIELDS.md` for the active agricultural region
9. `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md` for ecology/geography state and deferred gaps
10. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` for active Phase 0.9 sequencing
11. relevant architecture/runtime/tests for the active pass

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