# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.300.6
Package:       0.9.300
Account Save:  5
Game State:    21
Data:          73
Benchmark:     3
Codename:      Umbral Well Field Foundation
```

## Completed foundation and major tranches

```text
Phase 0.4–0.8 foundation                COMPLETE
Content Pack Scale Contract v2          COMPLETE / MERGED
Redstone Forge-Road                      COMPLETE / MERGED
Elderwood Hunt-Timber                    COMPLETE / MERGED
Universal Magic & Starfen Marshcraft    COMPLETE / MERGED
Ecology family/resource breadth         COMPLETE / MERGED
Coppergrass Steppe                       COMPLETE / MERGED
Slatewater Foothills & Waylodge         COMPLETE / MERGED
Ecology & Geography Integrity           COMPLETE / MERGED
Crownfields Agricultural Lowlands        COMPLETE / MERGED
Regional Ingredient & Luxury Processing COMPLETE / MERGED
Great Mere Freshwater Economy & Food Safety COMPLETE / MERGED
Population-backed Hunting Bridge             COMPLETE / MERGED
Ironspine Highlands                           COMPLETE / MERGED
Headwater Vale & Waymeet Approach             COMPLETE / MAIN
Starfen Delta & Brackish Coast                 COMPLETE / MAIN
Gloamwood & Oldbough Refuge                    COMPLETE / MAIN
Emberwash Badlands & Cinderwell Station         COMPLETE / MAIN
Lower Deepvein & Lantern Sump Station             COMPLETE / MAIN
Waymeet Marches & Cairnward Relay                  COMPLETE / MAIN
Legacy Elderwood Ecology Repair                     COMPLETE / MAIN
Dry Upland & Saltpan Ecology Repair                  COMPLETE / MAIN
Headwater / Highland Transition Repair               COMPLETE / MAIN
```

## Latest runtime/data bounded unit

### Cross-Biome Family Breadth

**Status: IMPLEMENTED ON `main`; promoted as Data 62 / Product 0.9.100.23.**

This final location-diversity repair adds two genuinely missing scoped families:
- **Ground Squirrel** — Coppergrass Loess, Waymeet Cairn, and Crownfields Hedgebank variants;
- **Finch** — Coppergrass Seed, Crownfields Hedgerow, Elderwood Hazel, and Slatewater Thistle variants.

Authored delta:
- 2 families;
- 7 species;
- 7 populations;
- 0 gathering sources/resources/processes/outputs;
- 1 Pack-v2 cross-region ownership graph.

All seven species are passive/wary, have no encounter template, and are not turned hostile to manufacture loot. Existing predator-family link metadata was deliberately left unchanged because it has no current player-facing mechanical requirement.

Implementation freeze `c5e12b5d8f0b6ddf7a76f5df01316567b43d4528` passed Check #1634 / run `33331659415` with **822/822 tests**, Repository Audit, Census, Benchmark 3, and Benchmark Sample. Promoted runtime/data SHA: `bc472b60374a048686b0ee6c877ba26c515aec35`.

The five-part location flora/fauna diversity repair sequence is now complete. Game State remains 14.

## Current content census

| Category | Current | Mechanics floor | Status |
| --- | ---: | ---: | --- |
| Places/localities | 55 | 10 | reached |
| Named NPCs | 48 | 50 | 2 short |
| Shop/service sites | 37 | 20 | reached |
| Creature definitions | 123 | 40 | reached; playable-alpha lower bound 120 also reached |
| Resource sources | 143 | 40 | reached |
| Canonical items | 408 | 200 | reached |
| Recipes/processes | 234 | 75 | reached |
| Abilities/techniques | 41 | 100 | 59 short |
| Quests/contracts | 20 | 30 | 10 short |
| Companions | 2 | 4 | 2 short |
| Transport services | 7 | 5 | reached |

```text
routes                        25
spell schools                  4
capabilities                  44
NPC schedules                 27
regional/shared packs         39
pack-owned records          1325
runtime seed NPCs             46
runtime seed enemies          17
raw-resource utilization   145/154
luxury-raw utilization       14/14
```

Mechanics-scale gate remains **NOT READY**.

## Latest planning pass

### Player Information & Locality Discovery / Local Knowledge & Familiarity Foundation

**Status: FOUNDATION COMPLETE ON `main`.**

Permanent authority:
- `docs/PLAYER_INFORMATION_AND_LOCALITY_DISCOVERY.md`.

Runtime/persistence closure:
- Product `0.9.100.24`;
- Game State `15`;
- Data `62` unchanged;
- implementation freeze `da168ddff6cc9e3611c9b8c06165b117081ea5c0`;
- Check #1770 / run `33355620265`: Repository Audit, **823/823 tests**, Census, Benchmark 3, and Benchmark Sample green.

The foundation replaces binary `discoveredPois` with durable layered locality knowledge, learned connectors, NPC identity linkage, familiarity-gated direct navigation, deterministic fictional-time Look Around/Explore, temporary save-persistent guidance, real guide referrals, staged approach/enter/interact/leave transitions, and knowledge-gated service/transport presentation.

Data stays 62 because this unit introduces no canonical authored world/content records. Game State advances 14 -> 15 because `localKnowledge`, temporary guidance, interaction history, and current local POI context are durable gameplay facts.

The broader design document still contains follow-on possibilities—ambient/risk events, wandering merchants, richer guard directions, personality dialogue variation, and deeper NPC-mediated shop browsing. Those are **not** part of this foundation closure and are not auto-started.

The next formal roadmap track remains **`0.9.200 Adventure Vertical Slices`**, queued and not auto-started.

### Macro-World Topology Lock

**Status: COMPLETE ON `main`; documentation/planning only.**

No Product, Data, Game State, or Benchmark change accompanies this pass. The latest runtime/data checkpoint is Data 62.

## Formal Phase 0.9 sequence

Packets A–E: **COMPLETE.**

### Packet E — Gate A integration/census audit

**COMPLETE ON `main`; NO RUNTIME/DATA VERSION CHANGE.**

Permanent evidence:
- `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`;
- implementation freeze `81b2928611a297d765eaa64f7cedeadb5fd697ee`;
- Check #1638 / run `33332932015`: Repository Audit, **822/822 tests**, Census, Benchmark 3, and Benchmark Sample all green.

Packet E confirms that the Data 62 graph clears every Gate A planning band and the qualitative ownership/integration requirements. It deliberately does **not** treat the later mechanics-scale shortfalls as Gate A failures.

`0.9.100 Content Scale Gate A` is therefore **COMPLETE**. The next formal roadmap track is **`0.9.200 Adventure Vertical Slices`**, queued and not auto-started.

## 0.9.200 Adventure Vertical Slice A — Slatewater Road Scout

**Status: COMPLETE ON `main`.**

Permanent evidence:
- `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`;
- implementation freeze `63cbd31edb149c9cf10af0a83bcf6f667abe17b8`;
- Check #1815 / run `33361131795`: Repository Audit, **826/826 tests**, Census, Benchmark 3, and Benchmark Sample green.

Version decision:
- Product 0.9.100.24 -> 0.9.200.1;
- Package 0.9.100 -> 0.9.200;
- Data 62 -> 63;
- Game State remains 15;
- Account Save remains 5;
- Benchmark remains 3.

Slice A is character-centered and reuses existing Slatewater geography. Sable Renn's two-contract trust arc composes field gathering/provenance, work proficiency, persistent relationships, chained commitment visibility, locality interaction, party recruitment, route travel, NPC projection, and save-compatible existing Game State families.

Census movement:
- NPCs 47 -> 48;
- quests/contracts 18 -> 20;
- companions 1 -> 2;
- pack-owned records 1,320 -> 1,325.

The mechanics-scale gate remains NOT READY. Abilities/techniques are now the largest relative gap.

**0.9.200 Adventure Vertical Slices is COMPLETE.** Slice A and Combat Packets B1-B5 are closed; current work is in `0.9.300 Advanced Combat / Training`.

## Macro-world topology

**TOPOLOGY LOCK COMPLETE / NO VERSION CHANGE.**

Permanent authority:
- `docs/WORLD_MACRO_TOPOLOGY.md`.

The lock establishes:

- irregular continuous world geography rather than a global square/hex board;
- route graph as inter-place traversability/distance/time authority;
- local grids/topologies as place-scale exploration abstractions;
- Central Continent + Southern Landmass + Eastern Archipelago;
- Deep World + Pelagic layers;
- Ironspine and western mountain-crescent barriers;
- Great Mere east-draining freshwater outflow to a future brackish delta/Eastern Sea;
- reserved Lethari, Korren, Miri, Veyra, Waymeet, and pelagic civilization envelopes.

The old macro-planning hold is lifted as a geography blocker. Edge implementation still requires an explicit bounded work order.

Post-lock world-edge status:

- **Headwater Vale — COMPLETE / Data 52.**
- **Starfen Delta / Brackish Coast — COMPLETE / Data 53.**
- **Gloamwood & Oldbough Refuge — COMPLETE / Data 54.**
- **Emberwash Badlands & Cinderwell Station — COMPLETE / Data 55.**
- **Lower Deepvein & Lantern Sump Station — COMPLETE / Data 56.**
- **Waymeet Marches & Cairnward Relay — COMPLETE / Data 57.**

Remaining ranking:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

The temporary detailed edge notes remain in `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`.

### Central Continent completion budget

Planning intent established at Data 55 and updated after the Data 57 surface pass:

- current surface-region maturity is approximately **60–70%** at the present authored granularity;
- budget approximately **9–13 additional substantial surface-region passes** for a broadly complete Central Continent;
- roughly **5–7** of those are enough to finish the minimum coherent continental skeleton; the remainder should add warranted route, ecology, economy, settlement, and civilization-approach density;
- **Lower Deepvein and Drowned Vaults are not counted in the surface percentage** because they are vertical/subterranean expansions;
- avoid subdividing wilderness for its own sake; after the Central Continent reaches a coherent skeleton, prefer outward expansion toward Veyra, Miri, Korren, and Pelagic realms.

The detailed corridor budget and completion doctrine live in `docs/WORLD_MACRO_TOPOLOGY.md`.

## Advanced combat implementation

Permanent design authority:
- `docs/COMBAT_ABILITY_WEAPON_KATA_AND_ATTENTION_MODEL.md`.

Permanent B1 implementation record:
- `docs/COMBAT_2_0_B1_UNIFIED_RESOLUTION.md`.

**Packet B1 — Unified Combat Resolution is COMPLETE at Product 0.9.200.2 / Data 64 / Game State 15.**

Behavioral implementation freeze:
- `20b7351a61f56203975e101ef04fd7311e110d9b`;
- Check #1860 / run `33457301272`;
- **832/832 tests** plus Repository Audit, Census, Benchmark 3, and sample green.

B1 proves:
- shared representative physical/magical/hybrid resolution;
- actual physical/magic accuracy and defense/resistance;
- elemental resistance for Ember Dart;
- defense penetration/critical eligibility for Ridge Breaker;
- resistible Fracture Sigil;
- explicit canonical recovery separate from activation/cooldown;
- action-commitment blocking during timed canonical activation.

The ability census remains 41/100 because B1 changes mechanics/contracts rather than manufacturing breadth.

**Packet B2 — Enemy Attention Foundation is COMPLETE at Product 0.9.200.3 / Data 64 / Game State 16.**
It adds durable Enmity -> Focus -> nonlinear selection weighting -> sticky Aggro -> Fixation/Priority on the existing battle authority. Behavioral freeze `92e6d1623470fbc923ef9beebe148829418b7080` passed Check #1881 with 837/837 tests and the full gate.

**Packet B3 — Combat Loadout Transition Foundation is COMPLETE at Product 0.9.200.4 / Data 65 / Game State 17.** Behavioral freeze `3ef9a1c48f22911fe90a08a60c03a72c09d7fd67` passed Check #1908 with 844/844 tests and the full gate; Pages #2038 passed.

**Packet B4 — Weapon Cadence, Ranged Action, and Minimal Kata is COMPLETE at Product 0.9.200.5 / Data 66 / Game State 18.** Behavioral freeze `0c3ef0a2720850d362cea06dffdbfd452f5a0c19` passed Check #1925 with 852/852 tests and the full gate; Pages #2055 passed.

**Packet B5 — Playable Brasshaven / Redstone Combat-Training Proof is COMPLETE at Product 0.9.200.6 / Data 67 / Game State 18.** Behavioral freeze `764faae437f3bc58d4d55a7e46dc4921a4a85c05` passed Check #1939 with 855/855 tests and the full gate; Pages #2069 passed.

**`0.9.200 Adventure Vertical Slices` is COMPLETE. `0.9.300 Advanced Combat / Training` is ACTIVE. Packets 1–5 are COMPLETE.** Packet 5 establishes the first honest radial target geometry at Product 0.9.300.5 / Data 72 / Game State 20: Tempest Ring selects living enemies within a target-centered radius using deterministic encounter-relative formation, caps recipients at four, resolves each enemy independently, and applies attention only to enemies actually struck. Behavioral/data freeze `29d6da27e48850aa96307553b4c124f2598c8caa` passed Check #2034 with 879/879 tests and the full gate; Pages #2164 passed. No subsequent 0.9.300 packet is selected.

Interrupted/resumable queues remain preserved:
- Occupational Tool Conversion remains strongest prepared 0.9.400 packet;
- Waymeet Inner Marches remains first ranked world-edge candidate;
- locality enrichment remains deferred/resumable;
- ecology repair sequence remains complete and is not auto-reopened.


## High-value system/content gaps

- companion breadth improved to 2/4 through Slice A;
- production/recipe breadth already exceeds the mechanics floor; future recipes should deepen utility rather than chase count;
- NPC and quest network density improved to 48/50 and 20/30 through Slice A;
- ability/technique breadth is now the largest relative mechanics gap at 41/100;
- deeper Crownfields agricultural processing/husbandry when justified;
- The five-part location flora/fauna diversity repair sequence is complete through Data 62; no sixth ecology packet is auto-authorized.

## Durable constraints

- one domain authority per state family;
- one fictional world clock;
- maps/places/routes must cross-reference cleanly;
- no contradictory direct edges shadowing canonical routes;
- player-enterable places require an escape path unless deliberate;
- Pack v2 owns placement/dependencies, not duplicate definitions;
- universal magic remains shared/character-owned;
- managed animal products should wait for a real husbandry source model;
- new zone food-capable raws require explicit consumption safety plus plausible processing paths, with world-facing language grounded in practical fantasy-era knowledge;
- Game State changes only for new durable serialized state.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
