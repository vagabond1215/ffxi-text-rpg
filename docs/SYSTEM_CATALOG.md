# System Catalog

This catalog describes the current **Hearth & Horizon** runtime and planned feature state. Historical detail remains in git, roadmap, and phase-exit documents.

## Status legend

| Status | Meaning |
| --- | --- |
| `planned` | Known requirement, no canonical runtime implementation. |
| `seeded` | Canonical schema or bounded content exists, but player-facing breadth is limited. |
| `integrated` | Runtime/tooling consumes the authority across real paths. |
| `playable` | A player can exercise a meaningful end-to-end loop. |
| `scaled` | Representative larger-volume validation exists. |
| `balanced` | Tuned through sustained gameplay/accepted evidence. |

No system is marked `balanced` merely because tests are green.

## Current baseline

```text
Product:       0.9.100.9
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          48
Benchmark:     3
Codename:      Great Mere Freshwater Economy & Food Safety
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 in progress
```

## Core simulation, persistence, and tooling

| System | Status | Notes |
| --- | --- | --- |
| Canonical fictional world time | playable | One deterministic second count drives elapsed gameplay time. |
| Simulation control / interrupts | playable | Pause/speed and deterministic advance-to-event behavior. |
| Timed tasks | playable | Shared substrate with explicit domain owners and terminal release. |
| Day cycle/review | playable | Structured end-of-day summaries. |
| Persistent projects | playable | Materials + labor + exactly-once completion. |
| Semantic events | integrated | Persisted typed observation history. |
| ActionResult | integrated | Canonical structured result contract. |
| Current-schema persistence | playable | Account Save 5 / Game State 14. |
| Raw current-state gate | integrated | Required authority validates before normalization. |
| NPC/enemy projections | integrated | Rebuilt from canonical authority; not serialized authority. |
| Command presentation log | integrated | Session-only. |
| Repository contract audit | integrated | Keeps runtime/package/profile/docs/hosted Check synchronized. |
| Content-scale census v2 | integrated | Runs in Check; target shortfalls are informational. |
| Benchmark harness | integrated | Benchmark 3 + repeatable sample. |
| Long-session lifecycle harness | integrated | Multi-day save/load/resource-retention coverage. |
| Hosted Check | integrated | Repository Audit + Test + Census + Benchmark 3 + Sample on Node 24. |

## Content infrastructure and regional packs — Data 48

| System | Status | Notes |
| --- | --- | --- |
| Content catalog registry | integrated | One resolver bridge from pack ownership to existing canonical catalogs. |
| Content Pack schema v2 | integrated | Covers geography, ecology, items, NPCs, schedules, services, recipes, quests, relationships, training/abilities, and companions. |
| Regional/shared pack ownership | integrated | Eighteen current packs; 564 current ownership records. |
| Pack dependency validation | scaled | Detects cross-pack references without declared dependencies. |
| Stable-ID ownership validation | scaled | Detects duplicate ownership and cross-collection ID collisions. |
| Catalog-ref validation | integrated | Canonical domain records resolve without definition duplication. |
| Canonical commitment ref validation | integrated | Catalog-referenced commitments validate giver/place/item/source/capability relationships and dependencies. |
| Scale-family validation | scaled | Abilities/capabilities/schedules/companions receive structural and reference checks. |
| Generated scale fixture | scaled | 1,401 ownership records validate across one place + 200 each of seven major families. |
| Legacy-leak boundary | integrated | Canonical packs reject legacy IDs absent explicit adapters. |
| Shared universal magic ownership | playable | Four schools / 33 spell capabilities / 33 executable spells are shared-owned; regional packs do not own spells. |
| Redstone Forge-Road pack | playable | Child Pack v2 graph joins Redstone ecology to forge production, equipment, martial techniques, and Brasshaven commitments. |
| Elderwood Hunt-Timber pack | playable | Child Pack v2 graph joins Barkboar/forest inputs to tannery/woodshop production, contacts, civic work, equipment, commitments, and non-spell field techniques. |
| Starfen Marshcraft pack | playable | Child Pack v2 graph joins wetland materials to medicine, waterproofing, survey gear, contacts, schedules, and community/research commitments. |
| Coppergrass Steppe ecology pack | integrated | Neutral steppe transition on the Forge-Mere corridor with preserved route geometry, five fauna niches, and staple/luxury resource provenance. |
| Slatewater Foothills ecology pack | integrated | Mixed-wood foothill transition with four fauna families, six gathering sources, exact resource provenance, and physical pass/cliff geography. |
| Slatewater Waylodge pack | playable | Safe road lodge with functional field exchange, field guild, campaign-recovery-backed lodging, stableyard/travel services, staff schedules, and foothill caravan. |
| Crownfields agricultural ecology | integrated | Managed cattle, sheep, poultry, crop pests, pollinators, and six exact-provenance crops broaden ecology into a human-shaped production landscape without inventing a second farming authority. |
| Crownfields Grange pack | playable | Produce exchange, growers’ hall, safe lodging, wagon yard, staff schedules, Southfield Farm Road, and scheduled produce transport connect field goods to Thornwall. |
| Regional ingredient/luxury processing pack | playable | Shared Pack-v2 graph owns 30 new outputs + 30 transformations and converts 33/44 raws, including all 11 luxury raws, into real production demand through intermediate-first chains. |
| Great Mere freshwater ecology | integrated | Westshore/Reedcrown lake graph adds seven passive/wary species, nine sources, nine exact-provenance raws, and declared reuse of canonical turtle/mussel families. |
| Great Mere & Merewatch pack | playable | Merewatch service hamlet, shore/water routes, ferry, fishery staff, 22 transformations / 23 outputs, preservation, lakecraft, and pearl work. |
| Item consumption safety metadata | integrated | Canonical food-tagged resources/production items explicitly state direct-vs-processing-required safety plus pathogen/toxic/irritant hazards; labels surface in player information. |
| Ecology/geography integrity validation | integrated | Canonical raw duplicate detection, reciprocal map/place references, ordered route/service topology, regional ecology parity, provenance validation, and no-trap geography are regression-guarded. |
| High-volume canonical regional content | seeded | Real authored breadth is growing but remains below most mechanics floors. |

### Pack v2 collections

```text
places / routes / transportServices
ecologyFamilies / species / populations / gatheringSources
items / npcs / npcSchedules / shops
recipes / quests / relationships
spellSchools / capabilities / abilities / companions
```

`contentCatalogRegistry` intentionally prevents packs from becoming a second canonical gameplay catalog. A `catalogRef` claims ownership/dependency context while resolving the real existing definition.

## World, travel, and knowledge

| System | Status | Notes |
| --- | --- | --- |
| Original-world identity | integrated | Hearth & Horizon canon is authoritative. |
| Places/routes/maps | playable | 31 current places/localities; reciprocal map/place and route-stop integrity is validated. |
| Safe-locality navigation | playable | Named destinations where fine topology is not the decision. |
| Wilderness exploration | playable | Discovery-relative movement/minimap. |
| Acquired map knowledge | playable | Presentation reveals acquired knowledge only. |
| Direct travel | playable | Route authority + fictional time. |
| Scheduled transport | playable | Deterministic departures/fares/cargo limits. |

## Character, abilities, combat, and companions

| System | Status | Notes |
| --- | --- | --- |
| Continuous player entity | playable | One persistent person across disciplines. |
| Disciplines/capabilities/skills | playable | Learned capability and mastery stay character-owned. |
| Universal magic catalog | playable | 33 shared spells span eight elemental families, restoration/support/warding, and Veilscript sigils. |
| Elemental Form | playable | Universal fire/earth/wind/water/lightning/ice/light/dark attack families; no region ownership. |
| Vital Weave / Ward Lore | playable | Universal healing and defensive/support spell families. |
| Veilscript | playable | Original seal-magic tradition using the existing `ninjutsu` skill for debuff/guard sigils. |
| Ability/spell engine | playable | Learned abilities, timing, costs, cooldowns, interruption, damage/heal/status effects. |
| Ability/training pack ownership | integrated | Four schools / 44 capabilities / 41 abilities are represented through Pack v2; all spells are shared-owned. |
| Regional martial/field training | playable | Redstone/Elderwood/Starfen packs own only non-spell techniques or field knowledge. |
| Equipment/tool context | playable | Gear/tools constrain and enhance real capability. |
| Combat 2.0 | playable | Deterministic readiness/action/resource model. |
| Active-battle persistence | integrated | Encounter authority survives save/load; RNG remains transient. |
| Campaign recovery | playable | Field/defeat/safe-settlement recovery. |
| Persistent companions | playable | NPC-backed recruitment/travel/combat continuity. |
| Companion pack ownership | integrated | Current companion catalog resolves through Pack v2 without copy authority. |
| Companion breadth | seeded | Census still counts one recruitable companion. |

## Economy, ecology, production, and life systems

| System | Status | Notes |
| --- | --- | --- |
| Inventory/containers/transfers | playable | Capacity/access/stacking rules. |
| Carried load / Field Satchel | playable | Derived portable logistics. |
| Shops/buy/sell | playable | Wallet/inventory transactions. |
| Resource provenance | playable | Physical/economic/social/exceptional origins. |
| Resource opportunities/recovery | playable | Defeat/world opportunities become materials through real recovery work. |
| Ecology/species/populations | playable | Deterministic habitat/population hooks now include managed agricultural livestock/pest/pollinator niches. |
| Gathering sources | playable | 41 current sources with place/tool/time/capacity/provenance, including managed Crownfields crops. |
| Production | playable | 81 current processing/crafting/cooking/salvage definitions with mastery, provenance, multi-stage ingredients, preservation, and lakecraft chains. |
| Ingredient/component chaining | playable | Flour, meal, thread, linen, must/vinegar, pigments, perfume extracts, cut stones, veneer, slip/glaze, and other intermediates are canonical items reusable by later recipes. |
| Luxury production depth | playable | All 12 current luxury raws now feed production, including Great Mere Cloudwater Pearl. |
| Freshwater processing safety | playable | Raw fish/shellfish remain preparation-required; Bitterflag is explicitly toxic raw and has a detoxification chain; prepared outputs become direct-safe food with provenance. |
| Redstone forge chain | playable | Existing iron/sunstone/Ridge Ibex inputs feed flux, tempered iron, rivets, work gear, and caravan hardware through existing forge/work authorities. |
| Elderwood hunt-timber chain | playable | Barkboar hide recovery, Duskcap, amber resin and hardwood feed tanned hide, bindings, resin products, field gear and trail-repair stock through existing tannery/woodshop/work authorities. |
| Starfen marshcraft chain | playable | Reed fiber, Bluekelp, Marrowleaf, Bogberry and Mirecrest Heron recovery feed cord, extract, medicine, waterproofing and survey gear through existing production/work authorities. |
| Crownfields agricultural loop | playable | Managed crops move through timed gathering/provenance to the Grange exchange, safe recovery, and scheduled produce wagon; livestock products remain deferred to a deliberate husbandry model. |
| Workstations | playable | Locality/home context. |
| Home/storage/workshop | playable | Durable life infrastructure. |
| Cultivation/stewardship | playable | Multi-day Sweetroot crop using canonical world time. |
| Earned delegation | playable | Paid bounded tending visit after manual mastery. |
| Quality/HQ depth | planned | Add only when it creates material/tool/proficiency decisions. |

## NPCs, schedules, commitments, and relationships

| System | Status | Notes |
| --- | --- | --- |
| NPC seed definitions | integrated | 22 runtime seed NPCs; census counts 23 named NPC definitions across canonical sources. |
| NPC recurring schedules | playable | Eleven current schedules derive availability from fictional time. |
| NPC schedule validation | integrated | Stable schedule lookup + structural validation. |
| Commitments | playable | 18 current persistent contracts with accept/resolve/follow-up/reward state. |
| Commitment capability reward seam | integrated | Optional qualified character capability instruction exists; Starfen regional contracts deliberately do not gate universal spells. |
| Redstone Forge-Road commitments | playable | Three provenance-qualified Brasshaven orders consume real forged output. |
| Elderwood Hunt-Timber commitments | playable | Three provenance-qualified Thornwall orders consume real Elderwood production output. |
| Starfen Marshcraft commitments | playable | Four Mistmere contracts consume real wetland production output; Starfen Current Reading is regional field knowledge, not magic. |
| Relationships | playable | Persistent NPC-specific continuity. |
| Journal/information projection | playable | Decision-first guidance over canonical state. |
| Broad branching narrative | seeded | Contract breadth is growing but remains below mechanics-scale target. |
| Romance/deep social life | planned | Requires broader authored people/goals/boundaries first. |

## Content-scale status

Gameplay breadth after Packet D:

```text
places/localities       26 / mechanics 10
named NPCs              17 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         68 / 200
recipes/processes       29 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions                1 / 4
transport services        3 / 5
```

Infrastructure coverage:

```text
routes                                   7
spell schools                            4
capability/training definitions         44
NPC schedules                            7
regional/shared packs                   10
pack-owned records                     248
pack-owned abilities/capabilities/
  schedules/companions              41/44/7/1
runtime seed NPCs                       16
runtime seed enemies                    13
```

Mechanics-scale gate remains **NOT READY**. Companions are now the largest relative gap. The census measures real canonical breadth; Pack refs and generated fixtures do not inflate it.

## Current decision boundary

Phase 0.9 and `0.9.100` remain open. Packets A–D and the Great Mere Data 48 tranche are merged. No implementation unit is active. Packet E Gate A integration/census remains the next formal roadmap gate; Ironspine Highlands is the next ranked world-edge candidate. Neither is auto-started.
