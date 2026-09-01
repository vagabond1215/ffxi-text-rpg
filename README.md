# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. **`0.9.200 Adventure Vertical Slices` is COMPLETE and `0.9.300 Advanced Combat / Training` is ACTIVE. Packets 1–6 are complete.** The current canonical/runtime checkpoint is Data 73 / Product 0.9.300.6 / Game State 21. Packet 6 gives Umbral Well honest persistent-field behavior: its completed cast creates battle-local durable field state with three fictional-time Dark pulses, a cast-time source snapshot, pulse-time defender resistance, and explicit save/load continuity.

```text
Product:       0.9.300.6
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          73
Benchmark:     3
Codename:      Umbral Well Field Foundation
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Data 62 closes the five-part location flora/fauna diversity repair sequence. Data 63 opens Adventure Vertical Slices with **Sable Renn**, the Slatewater Road Scout. Data 64 completes Combat 2.0 Packet B1 by adding authored recovery/resolution metadata to representative existing abilities and a shared combat-resolution engine; no new ability record, place, route, NPC, companion, or durable state family was added.

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

Validated Data 73 implementation census:

```text
places/localities       55 / mechanics floor 10
named NPCs              48 / 50
shop/service sites      37 / 20
creatures              123 / 40
resource sources       143 / 40
canonical items        408 / 200
recipes/processes      234 / 75
abilities/techniques    41 / 100
quests/contracts        20 / 30
companions               2 / 4
transport services       7 / 5
routes                   25
spell schools             4
capabilities             44
NPC schedules            27
regional/shared packs    39
pack-owned records     1325
runtime seed NPCs        47
runtime seed enemies     17
raw-resource use      145/154
luxury-raw use          14/14
```

Creature breadth now exceeds the playable-alpha planning lower bound of 120 through coherent biome families. The mechanics-scale gate remains **NOT READY** because companions, abilities, quests, and named NPCs are still below their mechanics floors.

## Persistence model

The project is pre-alpha and uses strict **current-schema-only** persistence. Old local saves are not automatically migrated unless a future bounded work order explicitly requires compatibility.

Game State 20 requires versioned character-owned elemental affinity state in addition to weapon-kata configuration version 2. Kata selections remain move IDs and encounter-local kata state remains version 1; Game State advances because earned affinity is a new durable gameplay fact, not because a second battle authority was added. Important non-serialized runtime state still includes root combat/stat caches, `activeBattle.rng`, the flat inventory alias, reconstructed `state.npcs`/`state.enemies`, and top-level session presentation history. `state.events` remains persisted structured semantic observation history.

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

**Combat 2.0 Packet B1 — Unified Combat Resolution is COMPLETE.**

Permanent implementation record:
- `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`.

Behavioral implementation freeze:
- `20b7351a61f56203975e101ef04fd7311e110d9b`;
- Check #1860 / run `33457301272`;
- **832/832 tests** plus Repository Audit, Census, Benchmark 3, and Benchmark Sample green;
- Pages #1990 / run `33457300712` green.

B1 gives representative basic melee, Ember Dart, Ridge Breaker, Rivet Guard, and Fracture Sigil a shared structured accuracy/defense/resistance/element/recovery vocabulary. Fracture Sigil can now be resisted, Ember Dart uses fire resistance, Ridge Breaker has explicit defense penetration/critical eligibility, and canonical post-action recovery is distinct from activation and cooldown.

Current mechanics-scale gaps remain:
- abilities/techniques 41/100;
- companions 2/4;
- quests/contracts 20/30;
- named NPCs 48/50.

Do not fill the ability gap with mechanically duplicate records.

**Combat 2.0 Packet B2 — Enemy Attention Foundation is COMPLETE.** It establishes durable hostile-specific Enmity -> normalized Focus -> nonlinear selection weighting -> sticky Aggro -> Fixation/Priority on the existing active-battle authority. Focus is not literal attack probability, and target reassessment is event-driven rather than a per-tick reroll.

**Combat 2.0 Packet B3 — Combat Loadout Transition Foundation is COMPLETE.** Permanent record: `docs/COMBAT_2_0_B3_LOADOUT_TRANSITIONS.md`. Active-combat equipment changes now use canonical fictional time, directional handling, atomic completion/cancellation, cooldown preservation, root/battle equipment coherence, and B2-driven armor-pressure legality.

**Combat 2.0 Packet B4 — Weapon Cadence, Ranged Action, and Minimal Kata is COMPLETE.** Permanent record: `docs/COMBAT_2_0_B4_WEAPON_CADENCE_RANGED_KATA.md`. Basic player/companion cadence is equipment-derived, ranged attacks are first-class and consume equipped ammunition, and dagger/sword kata configuration/cursors persist through current-schema combat state.

**Combat 2.0 Packet B5 — Playable Brasshaven / Redstone Combat-Training Proof is COMPLETE.** Permanent record: `docs/COMBAT_2_0_B5_BRASSHAVEN_REDSTONE_TRAINING_PROOF.md`. Marshal Varric Stone now exposes bounded Forge-Road instruction through the existing capability authority, and the integrated South Redstone proof exercises B1–B4 together.

**`0.9.200 Adventure Vertical Slices` is COMPLETE. `0.9.300 Advanced Combat / Training` is ACTIVE. Packets 1–6 are COMPLETE.** Packet 6 gives Umbral Well a real persistent field: direct Dark impact plus a 12-second target-position Well that pulses at 4/8/12 seconds, persists under `activeBattle.fields`, snapshots source offense at creation, and reads current defender resistance per pulse. Movement, LOS/pursuit, broad zone scripting, and wider adept migration remain deferred.

Preserved resumable queues remain unchanged:
- Occupational Tool Conversion for 0.9.400;
- Waymeet Inner Marches / outer crossroads world-edge continuation;
- richer locality ambient/dialogue/shop-browse/map work;
- optional ecology only by fresh selection; the five-part repair sequence itself is complete.

