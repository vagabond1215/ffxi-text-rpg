# System Catalog

This catalog tracks major systems against the current roadmap. It distinguishes **schema existence** from **real player-facing breadth** so a toy dataset is not mistaken for a completed subsystem.

## Status legend

| Status | Meaning |
| --- | --- |
| `planned` | Known requirement, no canonical runtime implementation. |
| `seeded` | Schema or small seed dataset exists. |
| `integrated` | Runtime reads/uses the system. |
| `playable` | A player can meaningfully interact with it end-to-end. |
| `scaled` | Proven against representative content volume and cross-system references. |
| `balanced` | Tuned through sustained gameplay/benchmarking at intended scale. |

## Core simulation and architecture

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Text command shell/parser | integrated | complete foundation | Active command adapter. |
| Canvas/UI intent layer | integrated | ongoing | UI and command paths should call shared gameplay actions. |
| Structured action results | integrated | 0.4 complete | Semantic outcomes separated from prose. |
| Semantic events | integrated | 0.4 complete | Bounded structured event history. |
| Ordered save migrations | integrated | 0.4 complete | Required for upcoming stable-ID migration. |
| Validation framework | integrated | ongoing | Must expand into cross-content validation. |
| Benchmark harness | seeded | ongoing | Needs broader simulation/content benchmarks. |
| Canonical world time | integrated | 0.5.100 complete | Deterministic simulation seconds. |
| Pause/speed control | integrated | 0.5.200 complete | Includes end-of-day preference after 0.5.500. |
| Canonical timed tasks | integrated | 0.5.300 complete | Generic timed activity substrate. |
| Simulation interrupts | integrated | 0.5.400 complete | Deterministic advance-until-event foundation. |
| Day cycle/review | integrated | 0.5.500 complete | Structured day summaries and default auto-pause. |
| Persistent projects | planned | 0.5.600 | Materials + labor + time + progress + completion. |

## World identity, geography, maps, and travel

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Original-world canonical IDs/names | planned | 0.5.550 | Must land before high-volume content expansion. |
| Legacy ID/save migration | planned | 0.5.550 | Replace inherited place/nation/ancestry/discipline IDs safely. |
| Places database | integrated | 0.5.550 migration then 0.7 scale | Several starter city/wilderness/dungeon records exist but use legacy identity. |
| Place/route connections | integrated | 0.5.700 expansion | Directed graph exists; should evolve toward roads/routes and natural transitions. |
| Coordinate/topology movement | integrated | ongoing | Supports grid/topology movement and exits. |
| Map definitions | integrated | 0.5.550 migration | Map ownership/discovery needs deeper cartography gameplay. |
| Cartography/map knowledge | seeded | 0.5.700 / 0.7.100 | Discovery exists; partial maps/route confidence/annotations still needed. |
| Local travel | playable scaffold | 0.5.700 | Existing travel/movement does not yet fully consume canonical time through one route model. |
| Scheduled caravans | planned | 0.5.700 | Stops, schedules, fares, cargo, risk, interruption. |
| Ferry/hired transport contract | planned | 0.5.700+ | Reuse generic transport model. |
| Mount/pack-animal transport | planned | 0.7.200 / 0.8 | Original species/terminology required. |
| Multi-region sandbox | seeded | 0.7.100 | Three starter clusters exist, but broad inter-regional graph and dense content are missing. |

## Character identity and progression

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Player entity | integrated | ongoing | Identity/resources/equipment/progression present. |
| Ancestries | seeded legacy | 0.5.550 | Mechanical slots exist; canonical names/identity migrate next. |
| Origins/backgrounds | planned | 0.6 / 0.7 opening | Starting circumstances should replace class-only opening emphasis. |
| Transitional job scaffold | integrated legacy | 0.5.550 then 0.6.200 | Must become original disciplines and later cease being universal ability gate. |
| EXP/level progression | playable scaffold | 0.6.100 | Current system works but remains transitional. |
| Character-owned skills | playable scaffold | 0.6.200 | Learned skill storage exists. |
| Skill caps/ranks | seeded | 0.6.200 | Sparse starter table with placeholder rank math. |
| Full skill/proficiency registry | planned | 0.6.200 | Must include combat, magic, gathering, crafting, practical/social domains. |
| Learned capability registry | planned | 0.6.200 | Spells/techniques/recipes/traits/actions owned by character. |
| Training/mentor/certification | planned | 0.6.200+ | Advanced instruction and recognition. |
| Advanced long-horizon progression | planned | 0.9+ | Add only after core advancement is compelling. |

## Stats, combat, magic, and abilities

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Primary/resource/derived stat engine | integrated scaffold | 0.6.100 | Mix of researched and simplified values; needs canonical balance pass. |
| Basic battle state | playable scaffold | 0.6.400 | Hit/damage/TP and victory/defeat exist. |
| Basic attack | playable | 0.6.400 hardening | Deterministic tests exist. |
| Weapon techniques | seeded placeholder | 0.6.300–0.6.400 | Current weapon-skill action is simplified and not a full ability catalog. |
| Magic action | seeded placeholder | 0.6.300 | Current Cure/generic-damage split is intentionally temporary. |
| Canonical magic database | planned | 0.6.300 | Legacy spell data is reference only; author original spell catalog. |
| Casting/recast/interruption | planned | 0.6.300 | Time-aware spell action engine. |
| Capability prerequisites | planned | 0.6.200–0.6.300 | Hard/soft/enhancing equipment/preparation/context checks. |
| Enemy tactical AI | planned | 0.6.400 | Current enemies auto-basic-attack only. |
| Enemy family abilities | planned | 0.6.400 | Requires canonical creature ability records. |
| Status/resistance system | seeded | 0.6.400 | Status structure exists; broad combat integration incomplete. |
| Threat/attention | planned | 0.6.400 | Needed for party tactics. |
| KO/injury/recovery | planned | 0.6.400 | Persistent consequences/recovery. |
| Party combat | planned | 0.6.800 | Companion-aware targets/tactics/resources. |

## Creatures, ecology, spawns, and natural resources

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Enemy entity schema | integrated | ongoing | Runtime enemy entities exist. |
| Starter spawn rules | seeded | 0.5.650 | Small place-level populations exist. |
| Species/family database | planned | 0.5.650 | Separate species ecology from encounter instances. |
| Habitat/population model | planned | 0.5.650 | Density, rarity, aggression, senses, social behavior, time/environment hooks. |
| Respawn/regeneration | planned | 0.5.650 | Deterministic population/resource recovery. |
| Rare/named spawns | legacy seed only | 0.5.650 / 0.6.700 | Rebuild under original world/content rules. |
| Flora/fungi resources | planned | 0.5.650 | Location/yield/regeneration/use data. |
| Mineral/clay/stone resources | planned | 0.5.650 | Geology/location/yield/tool hooks. |
| Fishing/shore resources | planned | 0.5.650 / 0.6.600 | Waters/habitat/tackle/time hooks. |
| Hunting/trapping | planned | 0.6.600 | Integrates ecology and provenance. |
| Carcass/body processing | planned | 0.5.600 / 0.6.600 | Skin, butcher, pluck, bone, gland, venom, salvage. |
| Construct salvage | planned | 0.5.600 / 0.6.600 | Dismantle rather than magical drops. |

## Items, inventory, equipment, and economy

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Canonical item schema | integrated | 0.5.800 validation / 0.6.500 scale | Structured requirements/effects/modifiers/metadata exist. |
| Inventory containers | playable scaffold | ongoing | Portable/home/storage rules exist. |
| Item stacking/transfers | playable | ongoing | Capacity/access/stack behavior tested. |
| Equipment eligibility | playable scaffold | 0.6.200 evolution | Currently tied partly to legacy job scaffold. |
| Equipment catalog | seeded | 0.6.500 | Very small starter catalog only. |
| Direct-use consumables/tools | seeded | 0.6.500 | Item behavior contract exists; broad actions/content missing. |
| Item source/sink metadata | planned | 0.5.600 | Required before high-volume item database. |
| Physical provenance | planned | 0.5.600 | Body/environment/commerce/craft/quest origin categories. |
| Loot/search carried inventory | seeded legacy behavior | 0.5.600 | Automatic battle rewards must distinguish carried goods from recoverable body resources. |
| Shops/buy/sell | playable scaffold | 0.7.300 scale | Transactions work; catalogs are tiny. |
| Regional economy | planned | 0.7.300 | Stock, services, regional inputs/outputs, trade incentives. |
| Currency vocabulary | legacy | 0.5.550 | Replace inherited currency/reward terminology. |
| Repair/maintenance | planned | 0.6.500 / 0.8 | Add where it creates useful sinks/decisions. |

## Gathering, processing, crafting, and cooking

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Gathering categories | legacy seed only | 0.6.600 | Names exist in old data, not a canonical gathering engine. |
| Gathering actions/nodes | planned | 0.5.650 / 0.6.600 | Actual world sources, tools, time, yields, proficiency. |
| Craft disciplines | legacy seed only | 0.6.600 | Old list is not a recipe/process system. |
| Recipe/process schema | planned | 0.5.800 / 0.6.600 | Inputs, outputs, tools, stations, time, skill, quality, byproducts. |
| Cooking | planned | 0.6.600 | Food effects + ingredient chains. |
| Medicine/alchemy | planned | 0.6.600 | Herbs, extracts, reagents, tools, medicines. |
| Smithing/metalwork | planned | 0.6.600 | Ore -> processed metal -> components/equipment/tools. |
| Woodworking | planned | 0.6.600 | Timber -> lumber/components/tools/construction. |
| Leatherwork | planned | 0.6.600 | Hide -> tanning -> leather/components/equipment. |
| Textiles | planned | 0.6.600 | Fiber/wool/etc. -> cloth -> clothing/equipment. |
| Salvage/recycling | planned | 0.5.600 / 0.6.600 | Recover materials from constructed goods/ruins. |
| Quality/HQ behavior | planned | 0.6.600 | Original quality model; do not assume inherited MMO tiers. |

## NPCs, services, quests, reputation, and social systems

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| NPC entity schema | integrated | ongoing | Only a few runtime seed entities currently exist. |
| POI/NPC location records | seeded | 0.5.550 migration / 0.7.300 scale | Many current POIs still use inherited names. |
| NPC schedules/availability | planned | 0.7.300 | Work/home/service routines. |
| Shop/service attachment | playable scaffold | 0.7.300 | Small catalogs/services exist. |
| Quest hooks | seeded only | 0.7.400 | No full objective/journal state yet. |
| Quest/contract engine | planned | 0.7.400 | Semantic objectives, prereqs, branches, rewards, repeatability. |
| Reputation/faction | planned | 0.7.400+ | Regional/social consequences and service access. |
| Relationship state | planned | 0.7.500 | Friendship/rivalry/mentorship/community/romance. |
| Romance | planned | 0.7.500 | Deep authored candidates with goals/boundaries/schedules. |
| Achievements/titles | planned | 0.7+ | Milestones, recognition, unlocks; not a priority over core quests. |

## Party and companions

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Companion database | planned | 0.6.800 | Original persistent companion entities replace inherited `Trust` terminology. |
| Companion tactics AI | planned | 0.6.800 | Roles/preferences/action selection/resources. |
| Companion equipment/progression | planned | 0.6.800 | Persistent capability/loadout growth. |
| Companion KO/recovery | planned | 0.6.800 | Integrate party and injury/recovery systems. |
| Companion relationships | planned | 0.7.500 | Tactical AI remains separate from social state. |
| Personal companion quests | planned | 0.7.400–0.7.500 | Goals and narrative/state changes. |

## Home, livelihood, infrastructure, and logistics

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Home/storage foothold | seeded legacy | 0.7 opening / 0.8 | Current storage concept needs original terminology and deeper property context. |
| Origins/backgrounds | planned | 0.6/0.7 | Determine opening property/tools/relationships/obligations. |
| Livelihood loops | planned | 0.6.600 | Work must connect time, resources, skill, economy, and mastery. |
| Persistent construction projects | planned | 0.5.600 | Shared project substrate first. |
| Property/buildings | planned | 0.8 | Acquisition, renovation, capacity, workshops. |
| Farming/gardening | planned | 0.8 | Crop/soil/season/work/infrastructure systems. |
| Husbandry/taming | planned | 0.8 | Practical animals, care, production, transport where useful. |
| Logistics/carts/warehouses | planned | 0.7.200 / 0.8 | Carrying capacity and regional trade/infrastructure. |
| Hired labor/earned automation | planned | 0.8 | Reduce chore attention through investment/mastery. |

## Data-production infrastructure

| System | Status | Roadmap | Notes |
| --- | --- | --- | --- |
| Regional content-pack contract | planned | 0.5.800 | Geography, NPC, ecology, items, recipes, quests, social, transport. |
| Cross-reference validator | seeded baseline | 0.5.800 | Expand dramatically before large data generation. |
| Legacy normalization/import tools | planned | 0.5.800 | Produce candidate original records; never direct canonical copying. |
| Source/sink validator | planned | 0.5.600 / 0.5.800 | Detect items with no source/use unless exempt. |
| Quest reachability/content validator | planned | 0.5.800 / 0.7.400 | Detect impossible objectives/rewards. |
| Scale/performance validation | planned | 0.5.800 onward | Test hundreds/thousands of records rather than only tiny seeds. |

## Current implementation priority

1. **0.5.550** — original-world naming and stable-ID/save migration.
2. **0.5.600** — persistent projects + resource provenance/body processing.
3. **0.5.650** — ecology, gathering sources, spawn populations, regeneration.
4. **0.5.700** — canonical timed travel + scheduled caravans/transport.
5. **0.5.800** — regional content packs, import normalization, cross-reference validation.
6. **0.6.100–0.6.400** — stats/progression, skills/disciplines/capabilities, magic/abilities, Combat 2.0.
7. **0.6.500–0.6.800** — item breadth, gathering/crafting/cooking/salvage, ecology content, AI party.
8. **0.7** — multi-region world, transport network, NPC populations/economies, quests, relationships/romance, broad content packs.
9. **0.8** — infrastructure/life expansion.
10. **0.9** — adventure depth, high-volume balance, release hardening.

The project must no longer treat content as a late decorative layer. Systems and real cross-linked data advance together.
