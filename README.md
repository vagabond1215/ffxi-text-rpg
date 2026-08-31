# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. **`0.9.100 Content Scale Gate A` is complete after Packet E, and the Local Knowledge & Familiarity Foundation prerequisite is complete.** Data 62 remains the canonical authored-content checkpoint; Product 0.9.100.24 / Game State 15 is the current runtime/persistence checkpoint. The next formal roadmap track is `0.9.200 Adventure Vertical Slices`, queued and not auto-started.

```text
Product:       0.9.100.24
Package:       0.9.100
Account Save:  5
Game State:    15
Data:          62
Benchmark:     3
Codename:      Local Knowledge & Familiarity
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Data 62 closes the five-part location flora/fauna diversity repair sequence. It adds two scoped missing families—Ground Squirrel and Finch—through seven regional species/populations across Coppergrass, Waymeet South Marches, Crownfields, East Elderwood, and Slatewater. No new recovery source, raw resource, production record, route, place, or durable state family was added.

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

Validated Data 62 implementation census:

```text
places/localities       55 / mechanics floor 10
named NPCs              47 / 50
shop/service sites      37 / 20
creatures              123 / 40
resource sources       143 / 40
canonical items        408 / 200
recipes/processes      234 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions               1 / 4
transport services       7 / 5
routes                   25
spell schools             4
capabilities             44
NPC schedules            27
regional/shared packs    39
pack-owned records     1320
runtime seed NPCs        46
runtime seed enemies     17
raw-resource use      145/154
luxury-raw use          14/14
```

Creature breadth now exceeds the playable-alpha planning lower bound of 120 through coherent biome families. The mechanics-scale gate remains **NOT READY** because companions, abilities, quests, and named NPCs are still below their mechanics floors.

## Persistence model

The project is pre-alpha and uses strict **current-schema-only** persistence. Old local saves are not automatically migrated unless a future bounded work order explicitly requires compatibility.

Game State 15 adds durable `localKnowledge` plus nullable `activePoiId` context for learned places/POIs/connectors, NPC identity linkage, familiarity, temporary guidance, interaction history, and staged locality presence. Important non-serialized runtime state still includes root combat/stat caches, `activeBattle.rng`, the flat inventory alias, reconstructed `state.npcs`/`state.enemies`, and top-level session presentation history. `state.events` remains persisted structured semantic observation history.

## Player interface

The player-facing UI is a **world interface**, not a permanent command console. Primary information navigation includes Scene, Character, Spellbook, Journal, Codex, Craft, and World. Contextual gameplay actions use semantic intents into domain systems; command routing remains an optional adapter/regression surface.

Locality/player information now implements the foundation in `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`: unknown POIs/NPC identities stay hidden, references/sightings are distinct from familiarity and interaction, sighted entrances require explicit transitions, `Look Around` and fictional-time `Explore` reveal the world contextually, guide referrals create temporary search bias, and shops/services use staged approach/enter/interact/leave semantics.

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
- Pack v2 ownership/validation, Redstone Forge-Road, Elderwood Hunt-Timber, Starfen Marshcraft, universal shared magic, Coppergrass, Slatewater, Crownfields managed agriculture, regional ingredient/luxury processing, Great Mere freshwater economy, population-backed hunting, Ironspine alpine ecology/economy, Gloamwood old-growth barrier ecology/economy, Emberwash arid-frontier ecology/economy, Lower Deepvein cave-frontier ecology/economy, Legacy Elderwood riparian/understory/cellar ecology repair, Dry Upland & Saltpan ecology repair, explicit period-framed item food-safety metadata, ecology/geography integrity guards, content-scale census, current-schema persistence, lifecycle guards, and repeatable benchmark sampling.

## Current decision boundary

**`0.9.100 Content Scale Gate A` is complete, and Local Knowledge & Familiarity Foundation is complete.** Packet E remains the Data 62 scale/integration closure; the locality foundation advances Product to 0.9.100.24 and Game State to 15 without changing Data, Package, Account Save, or Benchmark. Foundation implementation freeze: `da168ddff6cc9e3611c9b8c06165b117081ea5c0`; Check #1770 / run `33355620265` passed Repository Audit, **823/823 tests**, Census, Benchmark 3, and Benchmark Sample.

The five-part location flora/fauna diversity repair sequence is complete through Data 62.

Completed:
1. Legacy Elderwood Ecology Repair — Data 58;
2. Dry Upland & Saltpan Ecology Repair — Data 59;
3. Headwater / Highland Transition Spread — Data 60;
4. Wetland / Island Distribution Repair — Data 61;
5. Cross-Biome Family Breadth — Data 62.

There is **no automatically authorized sixth ecology repair**. Post-sequence ecology opportunities remain optional: Crownfields broader ordinary-wildlife spread, secondary dungeon substrate/ecology cleanup, a shorebird/wader family when coastal depth warrants it, and a snake family only when a concrete ecological/player loop justifies it.

The locality foundation is complete and broad follow-on locality event/dialogue/UI polish was not auto-started. The next formal roadmap track remains `0.9.200 Adventure Vertical Slices`; world-edge expansion, Occupational Tool Conversion, optional post-sequence ecology work, and richer locality-event/UI work remain separate queues requiring explicit selection.
