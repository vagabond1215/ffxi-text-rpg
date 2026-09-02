# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.400.2
Package:       0.9.400
Account Save:  5
Game State:    21
Data:          76
Benchmark:     3
Codename:      Existing Field-Tool Conversion Proof
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       ACTIVE — Economy / Production Depth
A0:            COMPLETE — Production & Item Authority Hardening
Latest unit:   A1 — Existing Field-Tool Conversion Proof
Next unit:     A2 — Broader Starter Equipment & Occupational Tool Conversion
Next status:   NEXT / NOT STARTED
```

Data 76 is the current authored/mechanics-data checkpoint. A1 adds six canonical production definitions and one shared Pack-v2 ownership tranche while preserving the six existing equipment stable IDs.

Game State remains 21. Crafted-tool identity, production provenance, equipment placement, inventory placement, and work/tool bindings all use existing durable authority/state envelopes.

## Latest bounded unit — 0.9.400 A1

Permanent record:
- `docs/ECONOMY_0_9_400_A1_FIELD_TOOL_CONVERSION.md`.

A0 prerequisite:
- `docs/ECONOMY_0_9_400_A0_PRODUCTION_ITEM_AUTHORITY.md`;
- merged checkpoint `5205a323a98ceb6a77431eae77fe2dea6299c8ba`.

A1 behavioral implementation freeze:
- `d4de8f25204a46f54ccecd905b4a2144e19e96b4`.

Hosted implementation evidence:
- Check #2200 / run `33663456804`;
- Repository Audit PASS;
- **906/906 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

The first A1 implementation head Check #2194 failed only stale exact Pack-v2 census assertions after the new shared pack changed the intentional current breadth. Those expectations were synchronized before the validated freeze:
- packs 39 -> 40;
- owned records 1,325 -> 1,337;
- Pack-v2 owned item refs 377 -> 383;
- Pack-v2 owned recipe refs 228 -> 234.

The pre-handoff promoted-sync Check #2217 / run `33664133137` reached Repository Audit and failed only because this handoff still carried Product 0.9.400.1. This handoff update is the required final synchronization mutation.

## Validated Data 76 census

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      240
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   40
pack-owned records                    1337
runtime seed NPCs                       47
runtime seed enemies                    17
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

Canonical item count remains 410 because A1 converts existing equipment IDs instead of inventing replacements.

## A1 canonical conversion result

### Production definitions

`js/text/data/occupationalFieldToolProductionCatalog.js` owns exactly six new process definitions:

```text
craft-field-knife          -> field-knife
craft-prospector-pick      -> prospector-pick
craft-woodsman-hatchet     -> woodsman-hatchet
craft-digging-spade        -> digging-spade
craft-reed-sickle          -> reed-sickle
craft-marsh-fishing-rod    -> marsh-rod
```

Do not add the six equipment IDs to `productionItems` or any resource-item catalog. `equipmentCatalog` remains physical/equipment behavior authority.

### Material graph

A1 uses existing shared material-foundation stocks/components:
- Steel Blade Blank;
- Iron Tool-Head Blank;
- Ash Handle Blank;
- Iron Ferrule and Socket Set;
- Dressed Giant Cane Poles;
- Hemp Twine.

No A1 recipe-only material identity was added.

### Pack-v2 ownership

`pack-occupational-field-tools` is the shared ownership tranche.

It owns:
- six existing equipment item refs;
- six A1 recipe refs.

Dependencies:
- `pack-shared-foundation`;
- `pack-material-foundations-common-components`.

The pack owns shared placement/production integration, not a duplicate physical item definition.

### Mechanical vertical proof

A1 proves:

```text
existing material stocks
  -> craft existing Field Knife ID
  -> canonical equipment behavior retained
  -> production provenance attached
  -> equip crafted Field Knife
  -> real cutting capability available
  -> cutting-gated Ash Handle work succeeds
  -> crafted knife binds into Marsh Fishing Rod assembly
  -> craft existing Marsh Fishing Rod ID
  -> real fishing capability available
  -> account save/load preserves crafted identities/provenance
```

Primary regression:
- `tests/occupationalFieldToolConversion.test.js`.

A0 authority/tool-binding regressions remain:
- `tests/canonicalItemAuthority.test.js`;
- `tests/productionWork.test.js`;
- `tests/equipmentToolBreadth.test.js`.

## Version result

```text
Product       0.9.400.1 -> 0.9.400.2
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          75        -> 76
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.400.1 -> 0.9.400.2`;
- `productionCatalog 0.17.0 -> 0.18.0`;
- `occupationalFieldToolProductionCatalog 0.1.0` added;
- `regionalContentPacks 0.22.0 -> 0.23.0`.

No persistence migration or compatibility adapter was added.

## Next bounded implementation — 0.9.400 A2

**Broader Starter Equipment & Occupational Tool Conversion — NEXT / NOT STARTED.**

Primary authorities:
- this handoff;
- `docs/ECONOMY_0_9_400_A1_FIELD_TOOL_CONVERSION.md`;
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

A2 may consider the deferred existing-ID conversion list:
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring;
- Bronze weapons and armor;
- basic leather garments;
- selected shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools.

Do not convert all of these at once merely because A1 is complete. Choose the smallest coherent A2 tranche that demonstrates a useful cross-profession dependency and downstream use.

### A2 authority rules

Preserve the A1 pattern:
1. existing equipment stable ID remains physical authority;
2. production catalog owns the process, not a copied item definition;
3. reuse existing material-foundation stocks/components before adding new ones;
4. Pack-v2 claims canonical item/recipe placement without duplicating catalog definitions;
5. durable tools are requirements/bindings, not consumed recipe inputs;
6. prove real downstream use rather than recipe existence alone;
7. advance Data only for actual authored canonical additions;
8. advance Game State only for a genuinely new required durable fact.

### Suggested first A2 decision

Audit the deferred starter equipment list against existing material stocks and choose one compact dependency cluster, likely one of:
- bronze martial equipment using existing bronze/wood/leather components;
- staff/wand/shield/ring starter set using existing wood/metal/fine-craft stocks;
- a small shared profession-tool suite that unlocks multiple already-authored production operations.

Do not pre-author new equipment families before checking whether existing stable IDs can satisfy the proof.

## Preserved deferred / queued work

Do not reopen automatically:

- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, remaining richer named-spell semantics.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Quest/social/companion depth:** later 0.9.500 track.
- **Ecology repair:** five-part sequence complete; do not restart without fresh selection.
- **Husbandry:** fleece/wool, dairy, eggs, honey, manure, managed domestic meat/hides wait for explicit managed-animal source authority.
- **Tool durability/quality/repair:** not implied by A1.
- **Worker automation or workstation inventories:** not implied by A1.
- **Material Culture Packets B-F:** not auto-authorized by A2.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- resolver/registry layers do not become duplicate definition authorities;
- equipment stable IDs remain singular across shop, production, equipment, and persistence;
- no duplicate task owner;
- current-schema-only pre-alpha persistence;
- implementation/data freeze before Product/Data promotion;
- Data and Game State advance independently;
- no mechanics-census filler;
- no hidden compatibility scaffolding for unsupported saves;
- exploration aggro remains separate from active-battle attention;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for 0.9.400 A2

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/ECONOMY_0_9_400_A1_FIELD_TOOL_CONVERSION.md`;
6. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
7. inspect existing deferred equipment IDs, current shops, existing material-foundation stocks/components, and real downstream equipment/tool use;
8. select one compact A2 conversion cluster;
9. freeze exact Product/Data/Game-State expectations before authoring;
10. implement canonical recipes/ownership without duplicate item authority;
11. prove production -> equipment/use -> persistence/economy integration;
12. freeze implementation before documentation promotion;
13. update this handoff last.

Do not restart the broad material-culture audit or advanced-combat audit unless A2 exposes a concrete blocker owned by those domains.

## Final validation contract

This handoff is the intended final repository-file mutation for the A1 closure.

After this write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact synchronized PR head with hosted Check;
- confirm Repository Audit, **906/906 tests or higher**, Census, Benchmark 3, and Benchmark Sample;
- merge/promote PR #407 only after the exact synchronized head is green.

If exact-head validation exposes a synchronization defect, repair it and rewrite this handoff last again.
