# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. `0.9.100 Content Scale Gate A` is in progress. **Starfen Delta & Brackish Coast** is the current Data 53 geography/content checkpoint, realizing the Great Mere's eastward outflow, Tideglass pilot port, the first true Eastern Sea coast, and an explicit non-walkable open-sea boundary.

```text
Product:       0.9.100.15
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          54
Benchmark:     3
Codename:      Gloamwood & Oldbough Refuge
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Data 53 adds Starfen Lower Delta, Tideglass Landing, and Starfen Brackish Coast; three route corridors plus the Mere-Delta Packet Boat; eight brackish/coastal species; seven gathering/fishing/mineral sources; seven exact-provenance raws; and ten transformations producing eleven outputs across seafood, salt, kelp, shell lime, reed matting, and preservation. The Eastern Sea is deliberately not walkable and no Miri/open-ocean route is authored yet. Game State remains 14.

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

Validated Data 53 census:

```text
places/localities       43 / mechanics floor 10
named NPCs              35 / 50
shop/service sites      29 / 20
creatures               72 / 40
resource sources        96 / 40
canonical items        301 / 200
recipes/processes      174 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions               1 / 4
transport services       7 / 5
```

Infrastructure coverage:

```text
routes                               17
spell schools                         4
capabilities/training definitions    44
NPC schedules                        19
regional/shared content packs        25
pack-owned records                   927
pack-owned abilities/capabilities/
  schedules/companions            41/44/19/1
runtime seed NPCs                    34
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

`0.9.100 Content Scale Gate A` remains open. **Starfen Delta & Brackish Coast is complete as Data 53 on `main`.** Packet E — Gate A integration/census audit remains the next formal roadmap gate. **Gloamwood** is the next ranked world-edge candidate. Occupational Tool Conversion remains the next ranked material-culture packet. None is auto-started.
