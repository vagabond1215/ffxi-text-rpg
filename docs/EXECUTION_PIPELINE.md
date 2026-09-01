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

**Adventure Vertical Slice A — Slatewater Road Scout** is the latest bounded unit on `main`.

- permanent record `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`;
- Product 0.9.200.1 / Package 0.9.200 / Game State 15 / Data 63 / Account Save 5 / Benchmark 3;
- implementation freeze `63cbd31edb149c9cf10af0a83bcf6f667abe17b8`;
- Check #1815 / run `33361131795`: Repository Audit, **826/826 tests**, Census, Benchmark 3, and Benchmark Sample green.

Slice A reuses Slatewater Waylodge + Slatewater Foothills. It adds one persistent NPC, two chained provenance-qualified field contracts, one recruitable companion, and Pack-v2 relationship/ownership metadata.

Game State stays 15: commitments, relationships, party state, local knowledge, and backing-NPC projection already own every durable consequence.

The previous Local Knowledge & Familiarity Foundation remains complete:
- implementation freeze `da168ddff6cc9e3611c9b8c06165b117081ea5c0`;
- Check #1770 / run `33355620265`;
- 823/823 tests plus full hosted gate.

Packet E / Content Scale Gate A remains PASS / COMPLETE. The five-part flora/fauna repair sequence remains complete through Data 62 and is not reopened.

## Data 63 metrics

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creatures                              123
resource sources                       143
canonical items                        408
recipes/processes                      234
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
raw resources with production demand  145 / 154
luxury raws with production demand      14 / 14
routes                                  25
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1325
runtime seed NPCs                       47
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
- companions: 2/4;
- abilities/techniques: 41/100;
- named NPCs: 48/50;
- quests/contracts: 20/30;

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

## Next selected implementation

Adventure Vertical Slice A is complete at Data 63 / Product 0.9.200.1.

Adventure Vertical Slice B is now **SELECTED / PLANNED, NOT STARTED** as a **Brasshaven / Redstone combat-training bridge**.

Design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Implementation plan:
- `docs/COMBAT_2_0_SLICE_B_IMPLEMENTATION_PLAN.md`.

### Immediate next bounded unit — Packet B1

**Unified Combat Resolution Contract.**

B1 must extend the existing Combat 2.0/ability substrate rather than start a parallel combat engine.

Required first-pass outcomes:
- one structured physical/magical/hybrid resolution vocabulary;
- explicit element metadata that actually participates in resistance resolution;
- canonical accuracy/defense/resistance paths for representative abilities;
- status accuracy/resistance rather than unconditional landing;
- explicit action recovery distinct from startup/cast duration and cooldown;
- representative migration of basic melee, Ridge Breaker, Rivet Guard, one direct elemental spell, and one status spell;
- no high-volume ability authoring yet;
- no kata/loadout/attention implementation until B1 is frozen.

A `continue` from this handoff should start **B1 only**.

### Subsequent selected Slice B packets

After separate stable handoffs:
1. B2 — Enemy Attention Foundation: Enmity -> Focus -> nonlinear selection weighting -> sticky Aggro -> Fixation.
2. B3 — timed weapon/full-loadout transitions; armor swap locked while meaningful hostile pressure remains.
3. B4 — weapon-delay cadence, first-class ranged attack, minimal configurable kata.
4. B5 — playable Brasshaven/Redstone combat-training vertical proof.

After B5, deliberately close `0.9.200` and open `0.9.300 Advanced Combat / Training` for broad weapon/affinity/ability depth.

## Preserved interrupted/resumable queues

Combat selection does not erase earlier circles:

- **Locality enrichment:** ambient/risk events, wandering merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality graphical presentation. Foundation is complete; enrichment remains deferred.
- **Occupational Tool Conversion:** still the strongest prepared `0.9.400` economy/production packet; authority `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.
- **World edge:** Waymeet Inner Marches / outer crossroads approach remains first, then Coppergrass extensions, then Drowned Vaults.
- **Optional ecology:** five-part repair sequence is complete; any new ecology work requires fresh selection.

These are resumable queues, not canceled work. None should be silently folded into B1.


## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
