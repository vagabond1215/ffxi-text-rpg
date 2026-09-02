# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.400.3
Package:       0.9.400
Account Save:  5
Game State:    21
Data:          77
Benchmark:     3
Codename:      Bronze Martial Conversion Proof
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       ACTIVE — Economy / Production Depth
A0:            COMPLETE — Production & Item Authority Hardening
A1:            COMPLETE — Existing Field-Tool Conversion Proof
Latest unit:   A2 — Bronze Martial Conversion Proof
Next unit:     A3 — Caster / Offhand Starter Conversion
Next status:   CANDIDATE / NOT STARTED
```

Data 77 is the current authored/mechanics-data checkpoint. A2 adds three canonical production definitions and one shared Pack-v2 ownership tranche while preserving the three existing equipment stable IDs.

Game State remains 21. Crafted equipment identity, production provenance, equipment placement, combat profile/cadence use, and save/load all use existing durable authority/state envelopes.

## Repository / promotion state

A2 is merged to `main`.

- merged main SHA: `d100490949de7de5b5427ebbcc747696d7384bf6`;
- PR #408: MERGED;
- exact synchronized PR head: `4f34c285d5e352921599879ce9ec6e40bf7e7da1`;
- final pre-merge Check #2237 / run `33666470613`: Repository Audit, **911/911 tests**, Census, Benchmark 3, and Benchmark Sample PASS.

The older A2 branch may remain remotely if connector cleanup is unavailable; do not continue new work on it. A future A3 continuation should start from current `main`.

## Latest bounded unit — 0.9.400 A2

Permanent record:
- `docs/ECONOMY_0_9_400_A2_BRONZE_MARTIAL_CONVERSION.md`.

A1 prerequisite:
- `docs/ECONOMY_0_9_400_A1_FIELD_TOOL_CONVERSION.md`.

A2 behavioral implementation freeze:
- `f4ae20cce0a3a735d13b6df537deeb3f9ea8360d`.

Hosted implementation evidence:
- Check #2220 / run `33665699974`;
- Repository Audit PASS;
- **911/911 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

A2's exact Pack-v2 current-count expectations were synchronized before the freeze:
- regional/shared packs 40 -> 41;
- pack-owned records 1,337 -> 1,343;
- Pack-v2 owned item refs 383 -> 386;
- Pack-v2 owned recipe refs 234 -> 237.

No runtime defect or freeze repair was required.

## Validated Data 77 census

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      243
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   41
pack-owned records                    1343
runtime seed NPCs                       47
runtime seed enemies                    17
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

Canonical item count remains 410 because A2 converts existing equipment IDs instead of inventing replacements.

## A2 canonical conversion result

### Production definitions

`js/text/data/starterBronzeMartialProductionCatalog.js` owns exactly three new process definitions:

```text
craft-bronze-sword      -> bronze-sword
craft-bronze-cap        -> bronze-cap
craft-bronze-harness    -> bronze-harness
```

Do not add these equipment IDs to `productionItems` or any resource-item catalog. `equipmentCatalog` remains physical/equipment behavior authority.

### Material graph

A2 reuses existing material-foundation stocks only.

Bronze Sword:
- Bronze Ingot;
- Ash Handle Blank;
- Hemp Twine.

Bronze Cap:
- Hammered Bronze Sheet;
- Hemp Canvas.

Bronze Harness:
- 2x Hammered Bronze Sheet;
- Hemp Canvas;
- Iron Buckle and Ring Set;
- physical `cutting` capability.

No A2 recipe-only material identity was added.

### Pack-v2 ownership

`pack-starter-bronze-martial-equipment` is the shared A2 ownership tranche.

It owns:
- three existing equipment item refs;
- three A2 recipe refs.

Dependencies:
- `pack-shared-foundation`;
- `pack-material-foundations-common-components`.

The pack owns shared placement/production integration, not duplicate physical item definitions.

### Mechanical vertical proof

A2 proves:

```text
shared bronze / wood / textile / hardware stocks
  -> craft existing Bronze Sword / Cap / Harness IDs
  -> A1 Field Knife binds as cutting tool for Bronze Harness
  -> canonical equipment modifiers retained
  -> crafted Bronze Sword drives melee weapon cadence
  -> crafted armor changes canonical combat profile
  -> current-schema save/load preserves full crafted loadout + provenance
```

Primary regression:
- `tests/starterBronzeMartialConversion.test.js`.

Prior authority regressions remain:
- `tests/canonicalItemAuthority.test.js`;
- `tests/productionWork.test.js`;
- `tests/occupationalFieldToolConversion.test.js`.

## Version result

```text
Product       0.9.400.2 -> 0.9.400.3
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          76        -> 77
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.400.2 -> 0.9.400.3`;
- `productionCatalog 0.18.0 -> 0.19.0`;
- `starterBronzeMartialProductionCatalog 0.1.0` added;
- `regionalContentPacks 0.23.0 -> 0.24.0`.

No persistence migration or compatibility adapter was added.

## Next bounded candidate — 0.9.400 A3

**Caster / Offhand Starter Conversion — CANDIDATE / NOT STARTED.**

Primary authorities:
- this handoff;
- `docs/ECONOMY_0_9_400_A2_BRONZE_MARTIAL_CONVERSION.md`;
- `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`.

Candidate existing IDs:
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring.

A3 is not automatically authorized by completion of A2. A fresh explicit continuation may select it.

### A3 decision rule

Before authoring:
1. inspect the four existing equipment definitions and current shop placement;
2. map each to existing Ash/Silvermaple, iron/brass, fine-craft, textile, adhesive, or ordinary hardware stocks;
3. reject recipes that would require implausible one-off materials solely to complete the set;
4. choose the smallest coherent subset if all four do not share a sufficiently clean material graph;
5. preserve existing equipment stable IDs;
6. prove real downstream equipment/combat/loadout use;
7. advance Data only for actual new canonical process/ownership records;
8. advance Game State only for a genuinely new required durable fact.

## Remaining Packet-A conversion backlog

Deferred after A3 selection:
- Bronze Axe;
- Bronze Dagger;
- Bronze Pick;
- Bronze Subligar;
- Bronze Mittens;
- basic leather garments;
- selected shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools.

Do not mass-convert this list in one pass.

## Other preserved deferred / queued work

Do not reopen automatically:

- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, remaining richer named-spell semantics.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Quest/social/companion depth:** later 0.9.500 track.
- **Ecology repair:** five-part sequence complete; do not restart without fresh selection.
- **Husbandry:** fleece/wool, dairy, eggs, honey, manure, managed domestic meat/hides wait for explicit managed-animal source authority.
- **Tool durability/quality/repair:** not implied by A2.
- **Worker automation or workstation inventories:** not implied by A2.
- **Material Culture Packets B-F:** not auto-authorized by A3.

## Standing governance

Preserve:
- one canonical fictional world clock;
- one owner per state family;
- resolver/registry layers do not become duplicate definition authorities;
- equipment stable IDs remain singular across shop, production, equipment, combat use, and persistence;
- no duplicate task owner;
- current-schema-only pre-alpha persistence;
- implementation/data freeze before Product/Data promotion;
- Data and Game State advance independently;
- no mechanics-census filler;
- no hidden compatibility scaffolding for unsupported saves;
- exploration aggro remains separate from active-battle attention;
- `docs/THREAD_HANDOFF.md` is updated last for a closed bounded unit.

## Restart order for a future A3 continuation

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/ECONOMY_0_9_400_A2_BRONZE_MARTIAL_CONVERSION.md`;
6. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
7. inspect Ash Staff, Maple Wand, Iron Buckler, Brass Ring, their shops, existing material stocks, and real downstream equipment use;
8. select the smallest coherent A3 conversion subset;
9. freeze exact Product/Data/Game-State expectations before authoring;
10. implement canonical recipes/ownership without duplicate item authority;
11. prove production -> equipment/use -> persistence/economy integration;
12. freeze implementation before documentation promotion;
13. update this handoff last.

Do not restart the broad material-culture audit or advanced-combat audit unless A3 exposes a concrete blocker owned by those domains.

## Final validation contract

This post-merge handoff correction is the intended final repository-file mutation for the A2 closure.

After this write:
- perform no repository-file mutation unless exact-main validation exposes a real failure;
- validate the exact resulting `main` SHA with hosted Check;
- confirm Repository Audit, **911/911 tests or higher**, Census, Benchmark 3, and Benchmark Sample;
- leave A3 unstarted.

If exact-main validation exposes a synchronization defect, repair it and rewrite this handoff last again.
