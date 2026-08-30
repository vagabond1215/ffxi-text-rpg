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
Product:       0.9.100.19
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          58
Benchmark:     3
Codename:      Legacy Elderwood Ecology Repair
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 in progress
```

## Data 57 regional authority

Waymeet Marches composes existing geography, route, ecology, resource, production, service, schedule, and Pack-v2 systems.

- 3 places; 2 routes with a real wagon-limit transition at Cairnward;
- 8 plateau populations; 7 exact-provenance raws; 10 processes/outputs;
- 3 relay NPCs; 2 schedules; 4 service POIs;
- `pack-waymeet-marches-ecology` and `pack-waymeet-marches-cairnward`;
- raw production utilization **124/135**;
- Game State 14 unchanged.

Measured current breadth: **55 places, 47 NPCs, 37 service sites, 104 creatures, 124 sources, 369 items, 214 recipes, 25 routes, 27 schedules, 33 packs, 1,183 pack-owned records**.

Promoted system/catalog versions include `npcSchedules 0.9.0`, `productionCatalog 0.14.0`, `productionItems 0.15.0`, `ecologyRegistry 0.11.0`, `resourceItemRegistry 0.12.0`, `routeCatalog 0.9.0`, and `regionalContentPacks 0.16.0`. Waymeet Marches modular catalogs begin at `0.1.0`.

## Data 58 ecology repair authority

Legacy Elderwood Ecology Repair strengthens existing location ecology without adding geography or a new durable state family.

- East Elderwood gains understory food, medicine/alchemy, decorative flower/dye, and ordinary forest-fauna spread.
- Timbercross gains a lower-river fish family plus waterfowl, amphibian, riparian food/herb/fiber vegetation, and exact fishing provenance.
- Thornwall Old Gaol gains restrained bat/spider/moss/fungus substrate.
- Ten new raws feed eleven production transformations; raw production utilization is **135/145**.
- Decorative/background vegetation remains descriptive where harvesting would add no gameplay loop.

Implementation freeze Check #1601 / run `33314083287` passed **802/802 tests** plus Repository Audit, Census, Benchmark 3, and Benchmark Sample.

Promoted aggregate versions include `productionCatalog 0.15.0`, `productionItems 0.16.0`, `ecologyRegistry 0.12.0`, `resourceItemRegistry 0.13.0`, and `regionalContentPacks 0.17.0`. Elderwood repair ecology/resource/production modules begin at `0.1.0`.

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
| Hosted Check | integrated | Repository Audit + Test + Census + Benchmark 3 + Sample on Node 24; Lower Deepvein implementation freeze Check #1577 and promoted Data 56 Check #1580 both passed 791/791 tests with Repository Audit, Census, Benchmark 3, and Benchmark Sample green. |

## Content infrastructure and regional packs — Data 56

| System | Status | Notes |
| --- | --- | --- |
| Content catalog registry | integrated | One resolver bridge from pack ownership to existing canonical catalogs. |
| Content Pack schema v2 | integrated | Covers geography, ecology, items, NPCs, schedules, services, recipes, quests, relationships, training/abilities, and companions. |
| Regional/shared pack ownership | integrated | Thirty-one current packs; 1,121 current ownership records. |
| Pack dependency validation | scaled | Detects cross-pack references without declared dependencies. |
| Stable-ID ownership validation | scaled | Detects duplicate ownership and cross-collection ID collisions. |
| Catalog-ref validation | integrated | Canonical domain records resolve without definition duplication. |
| Canonical commitment ref validation | integrated | Catalog-referenced commitments validate giver/place/item/source/capability relationships and dependencies. |
| Population-backed encounter discovery | playable | Passive/wary/territorial encounter-backed populations can be deliberately located; population depletion occurs only after victory and existing body recovery remains authoritative. |
| Ironspine alpine geography/economy | integrated | Wagon-limited pass, walk/mount high trail, alpine ecology, hunted body resources, preservation, hide/fur work, remedies, and survey craft. |
| Headwater Vale geography/economy | playable | Timbercross headwaters, wagon-limited warden lodge, upper trail, coldstream fishing, red-deer hunting/body recovery, alder/willow work, preservation, and bridge-repair production form the first overland Waymeet approach. |
| Starfen Delta / Brackish Coast | playable | Great Mere outflow, lower delta levees, Tideglass pilot port, packet-boat service, tidal coast ecology, seafood/salt/shell/reed production, and explicit non-walkable Eastern Sea boundary. |
| Gloamwood & Oldbough Refuge | playable | Old-growth barrier beyond West Elderwood, wagon-limited refuge, foot/mount deepwood trail, eight-species ecology, seven exact-provenance raws, and ten connected food/fieldcraft/timber/mineral outputs with no onward Lethari route. |
| Emberwash Badlands & Cinderwell Station | playable | Northern arid frontier beyond South Redstone, wagon-limited caravan well, preparation-sensitive saltpan foretrail, eight-species ecology, seven exact-provenance raws, and ten connected food/cordage/salt/pigment/plaster/repair outputs with no farther-desert, strait, or Veyra route. |
| Lower Deepvein & Lantern Sump Station | playable | First controlled Deep World frontier below Deepvein Mine with walk-only tunnel/cavern routes, safe delver station, eight-species cave ecology, seven exact-provenance raws, and ten connected food/lampwork/survey/repair outputs with no farther deep-road or Korren route. |
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
| Places/routes/maps | playable | 52 current places/localities; reciprocal map/place and route-stop integrity is validated. |
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
| Gathering sources | playable | 134 current sources with place/tool/capacity/provenance; later regional tranches include fishing, hunting-backed recovery, logging, forage, mineral, wetland, alpine, coastal, old-growth, and arid-frontier sources. |
| Production | playable | 225 current processing/crafting/cooking/salvage definitions; regional substitutes and connected preservation/fieldcraft/material chains prevent basic production dead ends without duplicating specialty resources everywhere. |
| Ingredient/component chaining | playable | Food/textile/luxury intermediates now extend into standardized alloys, sheet/wire, hardware, tool blanks, planks/beams/handles, cordage grades, canvas/net webbing, industrial binders/abrasives, and glass batch. |
| Luxury production depth | playable | All 14 current luxury raws feed production demand. |
| Freshwater processing safety | playable | Raw fish/shellfish remain preparation-required; Bitterflag is explicitly toxic raw and has a detoxification chain; prepared outputs become direct-safe food with provenance. |
| Redstone forge chain | playable | Existing iron/sunstone/Ridge Ibex inputs feed flux, tempered iron, rivets, work gear, and caravan hardware through existing forge/work authorities. |
| Elderwood hunt-timber chain | playable | Barkboar hide recovery, Duskcap, amber resin and hardwood feed tanned hide, bindings, resin products, field gear and trail-repair stock through existing tannery/woodshop/work authorities. |
| Starfen marshcraft chain | playable | Reed fiber, Bluekelp, Marrowleaf, Bogberry and Mirecrest Heron recovery feed cord, extract, medicine, waterproofing and survey gear through existing production/work authorities. |
| Crownfields agricultural loop | playable | Managed crops move through timed gathering/provenance to the Grange exchange, safe recovery, and scheduled produce wagon; livestock products remain deferred to a deliberate husbandry model. |
| Material foundations | playable | Data 50 established shared stock/components; Data 51 adds six common regional raws and five substitute/fallback processes. Wool remains deferred to husbandry authority. |
| Regional trade resilience | playable | Local + reliable-trade basins cover ordinary food, structures, metal access, bindings, fuel, medicine, and preservation without duplicating premium regional resources. |
| Workstations | playable | Locality/home context; Data 51 exposes light kitchen/workshop support at Slatewater, Ironspine, and Mistmere where existing fiction already implied it. |
| Home/storage/workshop | playable | Durable life infrastructure. |
| Cultivation/stewardship | playable | Multi-day Sweetroot crop using canonical world time. |
| Earned delegation | playable | Paid bounded tending visit after manual mastery. |
| Quality/HQ depth | planned | Add only when it creates material/tool/proficiency decisions. |

## NPCs, schedules, commitments, and relationships

| System | Status | Notes |
| --- | --- | --- |
| NPC seed definitions | integrated | 40 runtime seed NPCs; census counts 41 named NPC definitions across canonical sources. |
| NPC recurring schedules | playable | Twenty-three current schedules derive availability from fictional time. |
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

Gameplay breadth at the Data 58 Legacy Elderwood ecology-repair checkpoint:

```text
places/localities       55 / mechanics 10
named NPCs              47 / 50
shop/service sites      37 / 20
creatures              110 / 40
resource sources       134 / 40
canonical items        390 / 200
recipes/processes      225 / 75
abilities/techniques    41 / 100
quests/contracts        18 / 30
companions               1 / 4
transport services       7 / 5
routes                   25
NPC schedules            27
regional/shared packs    34
pack-owned records     1241
```

Mechanics-scale gate remains **NOT READY**. Ecology breadth is no longer a reason to add disconnected creature/resource filler.

## Current decision boundary

Phase 0.9 and `0.9.100` remain open. **Legacy Elderwood Ecology Repair is the current Data 58 bounded unit on `main`.** The next ranked ecology-quality unit is **Dry Upland & Saltpan Ecology Repair**. Packet E remains the next formal roadmap gate; world-edge and material-culture rankings remain separate and none is auto-started.
