# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.200.1
Package:       0.9.200
Account Save:  5
Game State:    15
Data:          63
Benchmark:     3
Codename:      Slatewater Road Scout
```

## Current bounded-unit state

**Local Knowledge & Familiarity Foundation** is the latest bounded runtime/persistence unit on `main`.

- Product 0.9.100.24 / Game State 15 / Data 62 / Package 0.9.100 / Account Save 5 / Benchmark 3.
- Implementation freeze: `da168ddff6cc9e3611c9b8c06165b117081ea5c0`.
- Check #1770 / run `33355620265`: Repository Audit, **823/823 tests**, Census, Benchmark 3, and Benchmark Sample green.
- Data remains 62: no canonical authored place, route, ecology, resource, item, recipe, NPC, quest, or pack record was added.
- No supported-save migration was added; pre-alpha persistence remains strict current-schema-only.

**Packet E — Gate A Integration & Census Audit** remains the latest completed scale/audit unit:
- permanent audit `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`;
- implementation freeze `81b2928611a297d765eaa64f7cedeadb5fd697ee`;
- Check #1638 / run `33332932015`: Repository Audit, 822/822 tests, Census, Benchmark 3, and Benchmark Sample green;
- Gate A result **PASS / COMPLETE**.

**Cross-Biome Family Breadth** remains the latest canonical authored-data bounded unit:
- implementation freeze `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528`;
- promoted Data 62 SHA `bc472b60374a048686b0ee6c877ba26c515aec35`;
- canonical authored Data version remains 62.

The five-part location flora/fauna diversity repair sequence remains complete and is not reopened.

## Local Knowledge & Familiarity Foundation

Permanent design authority: `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

Foundation status: **IMPLEMENTED / COMPLETE**.

Implemented semantics:
- canonical world truth is filtered through durable character knowledge;
- POI/place knowledge uses Unknown -> Referenced -> Sighted -> Recognized -> Familiar states;
- NPC appearance/name reference/identity linkage remain distinct;
- direct same-locality navigation requires familiarity or a currently sighted anchor;
- sighting an entrance never auto-transitions;
- `Look Around` is immediate observation while `Explore` advances fictional time and uses deterministic/injectable weighted discovery;
- save-persistent temporary guidance biases exploration rather than teleporting;
- origin-guide referrals create real Referenced knowledge plus temporary search guidance;
- commitments require actual prior contact with the giver rather than mere sighting;
- buildings/services use staged approach -> enter -> interact -> leave behavior;
- public scheduled transport is exposed only through learned travel points or Familiar transport hubs;
- `discoveredPois` is legacy-invalid under Game State 15; `localKnowledge` is current authority.

Broader ambient-event variety, wandering merchants, guard-direction catalogs, personality-varied dialogue, deeper shop category conversation, and any broader UI polish remain follow-on work and were not auto-started.

## Data 62 metrics

```text
places/localities                       55
named NPCs                              47
shop/service sites                      37
creatures                              123
resource sources                       143
canonical items                        408
recipes/processes                      234
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       7
raw resources with production demand  145 / 154
luxury raws with production demand      14 / 14
routes                                  25
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1320
runtime seed NPCs                       46
runtime seed enemies                    17
```

Creature breadth now clears the playable-alpha planning lower bound of 120. This does not make the mechanics-scale gate ready.

## Regional resilience rule

Established settlements do not need identical local resource catalogs. Audit the **local region plus dependable trade partners** for staple food, structural stock, metal, bindings, fuel, medicine, preservation, and practical workstation access.

Prefer ordinary substitutes over duplicated specialties:
- local Willow/Thornwood/Stonepine charcoal can substitute for Crown Oak charcoal;
- dry smoking can preserve fish when trade salt is unavailable, at lower yield;
- common clay/stone/wood should exist when the established biome plainly implies it;
- silver, gold, premium timber, pearls, specialty dyes, and similar premium materials may remain geographically distinct.

Coppergrass remains a transit wilderness: the Forge-Mere route physically crosses it, but no staffed locality or scheduled boarding stop should be inferred until one is deliberately authored.

## Standing zone-authoring rule

Every newly authored zone should, where ecologically appropriate, include:

1. plausible biome/geography;
2. common-sense flora/fauna niches;
3. populations and/or encounter/catch/recovery paths;
4. resources/drops/catches with provenance;
5. connected processing and recipes;
6. intentional economic/use sinks;
7. explicit food-consumption safety for food-capable items, presented as practical late-medieval/fantasy preparation knowledge;
8. no conversion of passive wildlife into aggression merely to force drops.

See `docs/ITEM_CONSUMPTION_SAFETY.md`.

## Mechanics-floor status

Reached:
- places;
- shop/service sites;
- creatures;
- resource sources;
- recipes/processes;
- transport services.

Still short:
- companions: 1/4;
- abilities/techniques: 41/100;
- named NPCs: 47/50;
- quests/contracts: 18/30;

Do not close these gaps with disconnected filler. Canonical items now exceed their mechanics floor through connected material stocks/components.

## Macro-world topology state

The prior geography hold is resolved by `docs/WORLD_MACRO_TOPOLOGY.md`.

Locked model:

- continuous irregular macro geography;
- no global hex/square world tessellation;
- route graph owns inter-place traversability, distance, time, hazards, and travel modes;
- local place grids/topologies remain fine-exploration abstractions;
- Great Mere drains east through a future brackish delta to the Eastern Sea;
- Waymeet is approached overland through Headwater Vale and additional plateau/march country;
- Emberwash is the northern arid frontier, not a direct Veyra adjacency.

Headwater Vale, Starfen Delta / Brackish Coast, Gloamwood & Oldbough Refuge, Emberwash Badlands & Cinderwell Station, Lower Deepvein & Lantern Sump Station, and Waymeet Marches & Cairnward Relay are complete through Data 57. The route graph reaches Waymeet South Marches but not the inner marches or Waymeet. Next ranked world-edge candidate: **Waymeet Inner Marches / outer crossroads approach**. It is queued, not auto-authorized.

## Next bounded material-culture candidate

- Occupational Tool Conversion: turn existing shop/equipment-only tools and starter metal/leather goods into real production outputs, then add shared smithing/woodworking/masonry/textile/leatherworking/cooking/measurement tools.
- This is queued but not auto-authorized.
- See `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

## Next decision boundary

`0.9.100 Content Scale Gate A` is **COMPLETE through Packet E**. The ordered location flora/fauna diversity repair sequence is complete through Data 62. **Local Knowledge & Familiarity Foundation is also COMPLETE** at Product 0.9.100.24 / Game State 15.

Formal roadmap priority remains:
1. **`0.9.200 Adventure Vertical Slice A`** — prefer a character-centered slice that naturally grows companion, quest, NPC, and service connectivity while reusing existing geography where practical;
2. **`0.9.300 Advanced Combat / Training`** — deepen ability/technique breadth through real learning and use requirements;
3. **`0.9.400 Economy / Production Depth`** — Occupational Tool Conversion is the strongest already-planned bounded candidate;
4. **`0.9.500 Quest / Social Depth`**;
5. **`0.9.600 Playable-Alpha Scale Push`**.

None is auto-started. Richer locality events/dialogue/UI work is a separate optional queue, not an automatic continuation of the foundation.

The separate world-edge ranking remains Waymeet Inner Marches / outer crossroads approach, Coppergrass extensions, then Drowned Vaults.

Optional ecology remains separate: broader Crownfields ordinary-wildlife spread, secondary dungeon ecology/substrate cleanup, shorebird/wader breadth, or snake breadth require fresh explicit selection and concrete loop justification.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
