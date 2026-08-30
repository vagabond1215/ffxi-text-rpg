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
Product:       0.9.100.23
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          62
Benchmark:     3
Codename:      Cross-Biome Family Breadth
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

## Data 62 ecology repair authority

Cross-Biome Family Breadth closes the five-part location flora/fauna diversity repair sequence.

- new families: **Ground Squirrel** and **Finch**;
- new species/populations: 7 / 7;
- Ground Squirrel spans Coppergrass Steppe, Waymeet South Marches, and Crownfields;
- Finch spans Coppergrass, Crownfields, East Elderwood, and Slatewater Foothills;
- no recovery source, body-resource, item, recipe, or production output was added;
- all new species are passive/wary and have no encounter template;
- predator-family link metadata remains unchanged pending actual mechanical need;
- ordinary seedgrass, hedges, thistles, coppice understory, and burrow evidence remain descriptive rather than inventory-node filler.

Implementation freeze Check #1634 / run `33331659415` passed **822/822 tests** plus Repository Audit, Census, Benchmark 3, and Benchmark Sample.

Promoted aggregate versions include `ecologyRegistry 0.16.0`, `regionalContentPacks 0.21.0`, and `places 0.11.5`. `crossBiomeFamilyBreadthEcology` begins at `0.1.0`.

## Data 61 ecology repair authority

Wetland / Island Distribution Repair is a population-only distribution pass across existing Starfen, Great Mere, and Starfen Delta habitat.

- East Starfen gains Mirecrest Heron, Reed Eel, Reed Crab, and Great Mere Glasswing Dragonfly populations.
- Reedcrown Isle gains Great Mere Silver Perch, Glasswing Dragonfly, and Starfen Fen Duck populations.
- Starfen Lower Delta gains Delta Saltflat Mud Crab presence.
- Crown Grebe now has same-place Lake Perch prey overlap at Reedcrown.
- No new family, species, gathering source, raw resource, process, production output, geography, or durable state family is introduced.
- Population presence remains distinct from player-authorized recovery: Westshore remains the Silver Perch fishery and Brackish Coast remains the Saltflat Mud Crab trap ground.

Implementation freeze Check #1626 / run `33325861973` passed **817/817 tests** plus Repository Audit, Census, Benchmark 3, and Benchmark Sample.

Promoted aggregate versions include `ecologyRegistry 0.15.0`, `regionalContentPacks 0.20.0`, and `places 0.11.4`. `wetlandIslandDistributionRepairEcology` begins at `0.1.0`.

## Data 60 ecology repair authority

Headwater / Highland Transition Repair strengthens distribution across existing upper-valley, saddle, foothill, and alpine habitats without adding geography or durable state.

- Headwater Upper Vale gains Grouse, Bee, upper-tributary Trout presence, Bilberry recovery, and richer descriptive meadow/shrub layers.
- Windscar gains existing South March Grey Grouse overlap.
- Slatewater gains Brush Hare and Thyme Bee presence without new recovery nodes.
- Ironspine gains Snow Hare, Sorrel Bee at Lower Pass and High Meadow, plus High Meadow Snow Grouse overlap.
- Five new species variants and ten populations reuse established Hare, Bee, Grouse, and Trout authority; no new ecology family is introduced.
- One new raw, Upper Vale Bilberries, feeds one Bilberry-Meadowsweet Preserve transformation using existing dried Meadowsweet.
- Existing Lynx prey-family metadata remains unchanged so this bounded repair does not rewrite older pack-owned species records merely to mirror distribution changes.

Implementation freeze Check #1618 / run `33325161966` passed **812/812 tests** plus Repository Audit, Census, Benchmark 3, and Benchmark Sample.

Promoted aggregate versions include `productionCatalog 0.17.0`, `productionItems 0.18.0`, `ecologyRegistry 0.14.0`, `resourceItemRegistry 0.15.0`, `regionalContentPacks 0.19.0`, and `places 0.11.3`. Headwater/highland transition repair ecology/resource/production modules begin at `0.1.0`.

## Data 59 ecology repair authority

Dry Upland & Saltpan Ecology Repair strengthens existing dryland/saline ecology without adding geography or durable state.

- South Redstone gains common grass/fiber, culinary/medicinal herb, and woody-resin shrub recovery.
- North Redstone gains juniper/yarrow and existing-family Ibex/Lizard/Grouse transition spread.
- Emberwash Saltpan gains edible, fiber, and decorative/dye halophyte recovery while retaining its existing fauna structure.
- Eight new raws feed eight transformations; Juniper-Millet Pot also activates demand for existing Ridge Millet.
- Decorative/background grasses, scrub, lichen, succulents, seedheads, and seasonal forbs remain descriptive where harvesting would add no real loop.

Implementation freeze Check #1610 / run `33322534675` passed **807/807 tests** plus Repository Audit, Census, Benchmark 3, and Benchmark Sample.

Promoted aggregate versions include `productionCatalog 0.16.0`, `productionItems 0.17.0`, `ecologyRegistry 0.13.0`, `resourceItemRegistry 0.14.0`, `regionalContentPacks 0.18.0`, and `places 0.11.2`. Dry-upland/saltpan repair ecology/resource/production modules begin at `0.1.0`.

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

## Content infrastructure and regional packs — Data 62

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
| Places/routes/maps | playable | 55 current places/localities; reciprocal map/place and route-stop integrity is validated. |
| Safe-locality navigation | playable | Named destinations where fine topology is not the decision; current one-step POI discovery/direct navigation is transitional before locality familiarity work. |
| Wilderness exploration | playable | Discovery-relative movement/minimap. |
| Acquired map knowledge | playable | Presentation reveals acquired knowledge only. |
| Player locality knowledge/familiarity | planned | Layered Unknown/Referenced/Sighted/Recognized/Familiar knowledge, learned connectors, and save-persistent temporary directions; canonical world truth remains separate. |
| Contextual Look Around / Explore resolver | planned | Fictional-time, locality-aware, deterministic/injectable weighted discovery and ambient-event resolution. |
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
| Gathering sources | playable | 142 current sources with place/tool/capacity/provenance; later regional tranches include fishing, hunting-backed recovery, logging, forage, mineral, wetland, alpine, coastal, old-growth, and arid-frontier sources. |
| Production | playable | 233 current processing/crafting/cooking/salvage definitions; regional substitutes and connected preservation/fieldcraft/material chains prevent basic production dead ends without duplicating specialty resources everywhere. |
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
| NPC seed definitions | integrated | 46 runtime seed NPCs; census counts 47 named NPC definitions across canonical sources. |
| NPC recurring schedules | playable | Twenty-three current schedules derive availability from fictional time. |
| NPC schedule validation | integrated | Stable schedule lookup + structural validation. |
| Player-facing NPC identity disclosure | planned | Canonical names remain internal until introduction/reference/credible visual identification links identity for the character. |
| Contextual greeting/dialogue presentation | planned | Semantic actions with NPC/player-personality-aware prose variants; presentation RNG must not silently mutate gameplay state. |
| Commitments | playable | 18 current persistent contracts with accept/resolve/follow-up/reward state. |
| Commitment capability reward seam | integrated | Optional qualified character capability instruction exists; Starfen regional contracts deliberately do not gate universal spells. |
| Redstone Forge-Road commitments | playable | Three provenance-qualified Brasshaven orders consume real forged output. |
| Elderwood Hunt-Timber commitments | playable | Three provenance-qualified Thornwall orders consume real Elderwood production output. |
| Starfen Marshcraft commitments | playable | Four Mistmere contracts consume real wetland production output; Starfen Current Reading is regional field knowledge, not magic. |
| Relationships | playable | Persistent NPC-specific continuity. |
| Journal/information projection | playable | Decision-first guidance over canonical state; future locality/NPC rendering must consume player knowledge rather than raw canonical lists. |
| Staged NPC-mediated shop interaction | planned | Reach/enter first, then greet/shop/ask/leave, then stock-derived categories/browse; no omniscient same-district stock listing. |
| Broad branching narrative | seeded | Contract breadth is growing but remains below mechanics-scale target. |
| Romance/deep social life | planned | Requires broader authored people/goals/boundaries first. |

## Content-scale status

Gameplay breadth at the Data 62 Cross-Biome Family Breadth checkpoint:

```text
places/localities       55 / mechanics 10
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
NPC schedules            27
regional/shared packs    39
pack-owned records     1320
```

The creature catalog now clears the playable-alpha planning lower bound of 120. Mechanics-scale readiness remains **NOT READY** because other required categories remain short.

## Current decision boundary

Phase 0.9 remains open, while **`0.9.100 Content Scale Gate A` is complete after Packet E**. Cross-Biome Family Breadth remains the promoted Data 62 runtime/data checkpoint, and the ordered five-part location flora/fauna diversity repair sequence is complete.

Packet E's permanent integration/census evidence is `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`. The next formal roadmap track is `0.9.200 Adventure Vertical Slices`, queued and not auto-started. World-edge expansion, Occupational Tool Conversion, and optional post-sequence ecology targets remain separate explicit-selection queues.
