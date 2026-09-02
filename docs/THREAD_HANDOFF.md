# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.400.5
Package:       0.9.400
Account Save:  5
Game State:    21
Data:          79
Benchmark:     3
Codename:      Remaining Bronze Starter Set Conversion Proof
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       ACTIVE — Economy / Production Depth
A0:            COMPLETE — Production & Item Authority Hardening
A1:            COMPLETE — Existing Field-Tool Conversion Proof
A2:            COMPLETE — Bronze Martial Conversion Proof
A3:            COMPLETE — Caster / Offhand Starter Conversion Proof
Latest unit:   A4 — Remaining Bronze Starter Set Conversion Proof
Next unit:     A5 — Basic Leather Garment Conversion
Next status:   CANDIDATE / NOT STARTED
```

Data 79 is the current authored/mechanics-data checkpoint. A4 adds five canonical production definitions and ten Pack-v2 ownership records while preserving five existing equipment stable IDs and the existing bronze Pack-v2 pack.

Game State remains 21. Crafted equipment identity, production provenance, equipment placement, combat/stat use, and save/load all use existing durable authority/state envelopes.

## Repository / promotion state

Pre-A4 main checkpoint:
- `56d50c0356cda4f0ba15d14dddee62a48e56fb8e`.

A4 branch:
- `phase-0.9.400-a4-remaining-bronze-conversion`.

Promotion PR:
- PR #410 — Add 0.9.400 A4 remaining bronze starter conversion proof.

A4 behavioral implementation freeze:
- `d371ff9f54a2b28dbda2d533a17f00de9aaa70fd`.

Hosted implementation evidence:
- Check #2259 / run `33672932856`;
- Repository Audit PASS;
- **921/921 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Initial Check #2258 / run `33672825424` reached the full suite and produced 920/921. The single failure was the A2 regression's obsolete expectation that `pack-starter-bronze-martial-equipment` must contain exactly three item/recipe refs. A4 intentionally extends that existing shared pack. The A2 regression was corrected to preserve its three recipe definitions and original pack prefix; no runtime or recipe behavior changed.

This handoff write is the intended final pre-merge file mutation. Validate its exact resulting PR head with hosted Check before merging PR #410.

## Validated Data 79 census

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      252
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   42
pack-owned records                    1361
runtime seed NPCs                       47
runtime seed enemies                    17
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

Canonical item count remains 410 because A4 converts existing equipment IDs rather than inventing replacements.

A4 Pack-v2 breadth changes:
- regional/shared packs remain 42;
- pack-owned records 1,351 -> 1,361;
- Pack-v2 owned item refs 390 -> 395;
- Pack-v2 owned recipe refs 241 -> 246.

## A4 canonical conversion result

### Production definitions

`js/text/data/remainingBronzeStarterProductionCatalog.js` owns exactly five new process definitions:

```text
craft-bronze-axe        -> bronze-axe
craft-bronze-dagger     -> bronze-dagger
craft-bronze-pick       -> bronze-pick
craft-bronze-subligar   -> bronze-subligar
craft-bronze-mittens    -> bronze-mittens
```

Do not add these equipment IDs to `productionItems` or resource-item catalogs. `equipmentCatalog` remains physical/equipment behavior authority.

### Ownership consolidation

A4 intentionally does **not** add another bronze Pack-v2 pack.

`pack-starter-bronze-martial-equipment` now owns the complete established bronze starter family:

Items:
- Bronze Sword;
- Bronze Cap;
- Bronze Harness;
- Bronze Axe;
- Bronze Dagger;
- Bronze Pick;
- Bronze Subligar;
- Bronze Mittens.

Recipes:
- `craft-bronze-sword`;
- `craft-bronze-cap`;
- `craft-bronze-harness`;
- `craft-bronze-axe`;
- `craft-bronze-dagger`;
- `craft-bronze-pick`;
- `craft-bronze-subligar`;
- `craft-bronze-mittens`.

A second bronze starter pack would be artificial ownership fragmentation and should not be introduced.

### Material graph

A4 reuses established A2/A1 material stocks.

Bronze Axe:
- Bronze Ingot;
- Ash Handle Blank;
- Hemp Twine.

Bronze Dagger:
- Bronze Ingot;
- Ash Handle Blank;
- Hemp Twine.

Bronze Pick:
- Bronze Ingot;
- Ash Handle Blank;
- Iron Ferrule and Socket Set.

Bronze Subligar:
- Bronze Sheet;
- Hemp Canvas;
- Iron Buckle and Ring Set;
- physical `cutting` capability.

Bronze Mittens:
- Bronze Sheet;
- Hemp Canvas;
- physical `cutting` capability.

No A4 recipe-only material identity was added.

### Bronze Pick authority boundary

Bronze Pick remains:
- family: weapon;
- weapon category: axe;
- starter combat equipment.

It does **not** gain `mining`.

Prospector Pick remains the canonical field-mining tool. Do not merge these identities merely because both are pick-shaped.

### Mechanical vertical proof

A4 proves:

```text
established bronze / wood / textile / hardware stocks
  -> craft existing Bronze Axe / Dagger / Pick / Subligar / Mittens IDs
  -> Axe, Dagger, and Pick retain distinct canonical cadence
  -> Bronze Pick remains combat-only and non-mining
  -> A1 Field Knife binds into Subligar/Mittens assembly
  -> crafted Subligar/Mittens contribute normal armor stats
  -> current-schema save/load preserves crafted identities + provenance
```

Primary regression:
- `tests/remainingBronzeStarterConversion.test.js`.

Prior conversion/authority regressions remain:
- `tests/canonicalItemAuthority.test.js`;
- `tests/productionWork.test.js`;
- `tests/occupationalFieldToolConversion.test.js`;
- `tests/starterBronzeMartialConversion.test.js`;
- `tests/starterCasterOffhandConversion.test.js`.

## Version result

```text
Product       0.9.400.4 -> 0.9.400.5
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          78        -> 79
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.400.4 -> 0.9.400.5`;
- `productionCatalog 0.20.0 -> 0.21.0`;
- `remainingBronzeStarterProductionCatalog 0.1.0` added;
- `regionalContentPacks 0.25.0 -> 0.26.0`.

No persistence migration or compatibility adapter was added.

## Next bounded candidate — 0.9.400 A5

**Basic Leather Garment Conversion — CANDIDATE / NOT STARTED.**

Initial existing-ID scope:
- Leather Vest;
- Leather Trousers.

A5 is not automatically authorized by A4 completion. A fresh explicit continuation may select it.

### A5 decision rule

Before authoring:
1. inspect Leather Vest and Leather Trousers current shop placement and equipment semantics;
2. inspect established tanned-hide, hide-binding, thread/cord, adhesive, and relevant Pack-v2 ownership;
3. prefer an existing leather supply chain over a new generic duplicate leather identity;
4. use a real cutting/stitching tool capability only if an existing canonical tool supports it cleanly;
5. prove normal armor/loadout/stat behavior and current-schema persistence;
6. do not silently absorb Traveler Gloves or Traveler Boots;
7. advance Data only for new canonical process/ownership records;
8. advance Game State only for a genuinely new durable fact.

## Remaining Packet-A work after A5

Deferred:
- shared smithing tools;
- woodworking tools;
- masonry tools;
- textile tools;
- leatherworking tools;
- cooking tools;
- measurement tools.

This profession-tool suite should be split into mechanically meaningful clusters. Do not author it as one large census-filling batch.

## Other preserved deferred / queued work

Do not reopen automatically:

- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, remaining richer named-spell semantics.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Quest/social/companion depth:** later 0.9.500 track.
- **Ecology repair:** five-part sequence complete; do not restart without fresh selection.
- **Husbandry:** fleece/wool, dairy, eggs, honey, manure, managed domestic meat/hides wait for explicit managed-animal source authority.
- **Tool durability/quality/repair:** not implied by A4.
- **Worker automation or workstation inventories:** not implied by A4.
- **Material Culture Packets B-F:** not auto-authorized by A5.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- resolver/registry layers do not become duplicate definition authorities;
- equipment stable IDs remain singular across shop, production, equipment, combat use, and persistence;
- related Pack-v2 content should extend an existing coherent ownership domain instead of creating artificial duplicate packs;
- no duplicate task owner;
- current-schema-only pre-alpha persistence;
- implementation/data freeze before Product/Data promotion;
- Data and Game State advance independently;
- no mechanics-census filler;
- no hidden compatibility scaffolding for unsupported saves;
- exploration aggro remains separate from active-battle attention;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for a future A5 continuation

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/ECONOMY_0_9_400_A4_REMAINING_BRONZE_CONVERSION.md`;
6. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
7. inspect Leather Vest, Leather Trousers, current shops, established leather inputs, Pack-v2 ownership, and real armor use;
8. freeze the smallest coherent A5 production graph;
9. freeze exact Product/Data/Game-State expectations before authoring;
10. implement canonical recipes/ownership without duplicate item authority;
11. prove production -> equipment/use -> persistence/economy integration;
12. freeze implementation before documentation promotion;
13. update this handoff last.

Do not restart the broad material-culture audit or advanced-combat audit unless A5 exposes a concrete blocker owned by those domains.

## Final validation contract

This handoff is the intended final pre-merge repository-file mutation for A4 closure.

After this write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact synchronized PR head with hosted Check;
- confirm Repository Audit, **921/921 tests or higher**, Census, Benchmark 3, and Benchmark Sample;
- merge/promote PR #410 only after that exact synchronized head is green;
- after merge, make only a handoff-status correction on `main` recording the merged main SHA and final synchronized PR head;
- leave A5 unstarted.
