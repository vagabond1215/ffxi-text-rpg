# Thread Handoff

Repository evidence beats conversation memory.

## Current runtime contract

```text
Product:       0.9.400.4
Package:       0.9.400
Account Save:  5
Game State:    21
Data:          78
Benchmark:     3
Codename:      Caster / Offhand Starter Conversion Proof
Runtime:       Node >=24
Phase:         0.9
0.9.100:       COMPLETE
0.9.200:       COMPLETE — Adventure Vertical Slices
0.9.300:       COMPLETE — Advanced Combat / Training
0.9.400:       ACTIVE — Economy / Production Depth
A0:            COMPLETE — Production & Item Authority Hardening
A1:            COMPLETE — Existing Field-Tool Conversion Proof
A2:            COMPLETE — Bronze Martial Conversion Proof
Latest unit:   A3 — Caster / Offhand Starter Conversion Proof
Next unit:     A4 — Remaining Bronze Starter Set Conversion
Next status:   CANDIDATE / NOT STARTED
```

Data 78 is the current authored/mechanics-data checkpoint. A3 adds four canonical production definitions and one shared Pack-v2 ownership tranche while preserving four existing equipment stable IDs.

Game State remains 21. Crafted equipment identity, production provenance, loadout/equipment placement, combat/stat use, and save/load all use existing durable authority/state envelopes.

## Repository / promotion state

Pre-A3 main checkpoint:
- `6b21c166af744bde2b9ddfad3e92695680b06ebe`.

A3 branch:
- `phase-0.9.400-a3-caster-offhand-conversion`.

Promotion PR:
- PR #409 — Add 0.9.400 A3 caster and offhand conversion proof.

A3 behavioral implementation freeze:
- `d672f3ab90ec46c6ca9ef4beb85cef1fbfe5353d`.

Hosted implementation evidence:
- Check #2240 / run `33671247638`;
- Repository Audit PASS;
- **916/916 tests**;
- Content Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

This handoff write is the intended final pre-merge file mutation. Validate its exact resulting PR head with hosted Check before merging PR #409.

## Validated Data 78 census

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      247
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   42
pack-owned records                    1351
runtime seed NPCs                       47
runtime seed enemies                    17
raw-resource production demand       145/154
luxury-raw production demand          14/14
```

Canonical item count remains 410 because A3 converts existing equipment IDs rather than inventing replacements.

A3 exact Pack-v2 breadth changes:
- regional/shared packs 41 -> 42;
- pack-owned records 1,343 -> 1,351;
- Pack-v2 owned item refs 386 -> 390;
- Pack-v2 owned recipe refs 237 -> 241.

## A3 canonical conversion result

### Production definitions

`js/text/data/starterCasterOffhandProductionCatalog.js` owns exactly four new process definitions:

```text
craft-ash-staff       -> ash-staff
craft-maple-wand      -> maple-wand
craft-iron-buckler    -> iron-buckler
craft-brass-ring      -> brass-ring
```

Do not add these equipment IDs to `productionItems` or resource-item catalogs. `equipmentCatalog` remains physical/equipment behavior authority.

### Material graph

A3 reuses established material chains only.

Ash Staff:
- Elderwood Ash Timber;
- Hemp Twine;
- Hide Glue;
- physical `cutting` capability;
- woodshop.

Maple Wand:
- Silvermaple Fine Board;
- Hammered Brass Sheet;
- Hide Glue;
- physical `cutting` capability;
- woodshop.

Iron Buckler:
- Tempered Redstone Iron Bar;
- Redstone Rivet Set;
- Hemp Cord;
- forge.

Brass Ring:
- Brass Ingot;
- forge.

No A3 recipe-only material identity was added.

### Pack-v2 ownership

`pack-starter-caster-offhand-equipment` owns:
- four existing equipment item refs;
- four A3 recipe refs.

Dependencies:
- `pack-shared-foundation`;
- `pack-material-foundations-common-components`;
- `pack-redstone-forge-road`.

The Redstone dependency is intentional: Iron Buckler consumes the established tempered-iron/rivet supply chain rather than creating a generic duplicate iron-stock family.

### Mechanical vertical proof

A3 proves:

```text
established wood / binding / brass / Redstone iron stocks
  -> craft existing Ash Staff / Maple Wand / Iron Buckler / Brass Ring IDs
  -> A1 Field Knife binds into both wood-equipment recipes
  -> crafted Ash Staff drives staff cadence
  -> crafted Ash Staff rejects offhand Iron Buckler while two-handed
  -> crafted Maple Wand replaces the staff and permits the buckler
  -> crafted buckler contributes defense / shield-block
  -> crafted Brass Ring contributes through accessory/stat authority
  -> current-schema save/load preserves equipped wand/buckler/ring
     plus stored crafted Ash Staff identity/provenance
```

Primary regression:
- `tests/starterCasterOffhandConversion.test.js`.

Prior conversion/authority regressions remain:
- `tests/canonicalItemAuthority.test.js`;
- `tests/productionWork.test.js`;
- `tests/occupationalFieldToolConversion.test.js`;
- `tests/starterBronzeMartialConversion.test.js`.

## Version result

```text
Product       0.9.400.3 -> 0.9.400.4
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          77        -> 78
Benchmark     3         -> 3
```

Relevant system manifest changes:
- `versionManifest 0.9.400.3 -> 0.9.400.4`;
- `productionCatalog 0.19.0 -> 0.20.0`;
- `starterCasterOffhandProductionCatalog 0.1.0` added;
- `regionalContentPacks 0.24.0 -> 0.25.0`.

No persistence migration or compatibility adapter was added.

## Next bounded candidate — 0.9.400 A4

**Remaining Bronze Starter Set Conversion — CANDIDATE / NOT STARTED.**

Candidate existing IDs:
- Bronze Axe;
- Bronze Dagger;
- Bronze Pick;
- Bronze Subligar;
- Bronze Mittens.

A4 is not automatically authorized by A3 completion. A fresh explicit continuation may select it.

### A4 decision rule

Before authoring:
1. confirm all five existing equipment IDs still have meaningful current gameplay roles;
2. preserve Bronze Pick as its existing combat-weapon identity — field mining remains owned by Prospector Pick;
3. reuse the A2 bronze material graph and existing wood/textile/hardware stocks;
4. avoid recipe-only material identities;
5. prove at least one real weapon cadence/loadout path and one armor/stat path;
6. preserve existing stable IDs and singular equipment authority;
7. advance Data only for new canonical process/ownership records;
8. advance Game State only for a genuinely new durable fact.

## Remaining Packet-A backlog after A4

Deferred:
- basic leather garments;
- selected shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools.

Do not mass-convert these in the same pass.

## Other preserved deferred / queued work

Do not reopen automatically:

- **Combat depth:** engagement coordinates, LOS/line-of-fire, pursuit/search/disengagement/flee, passive block/parry/guard/counter/reaction execution, stale combat placeholders, weapon resonance/imbuement, unsupported-family breadth, remaining richer named-spell semantics.
- **World edge:** Waymeet Inner Marches / outer crossroads first, then Coppergrass extensions, then Drowned Vaults.
- **Locality enrichment:** ambient/risk events, wandering/seasonal merchants, generalized directions/help dialogue, richer conversation, shop browse/category depth, learned-locality presentation.
- **Quest/social/companion depth:** later 0.9.500 track.
- **Ecology repair:** five-part sequence complete; do not restart without fresh selection.
- **Husbandry:** fleece/wool, dairy, eggs, honey, manure, managed domestic meat/hides wait for explicit managed-animal source authority.
- **Tool durability/quality/repair:** not implied by A3.
- **Worker automation or workstation inventories:** not implied by A3.
- **Material Culture Packets B-F:** not auto-authorized by A4.

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

## Restart order for a future A4 continuation

1. `AGENTS.md`;
2. this handoff;
3. `PROJECT_PROFILE.yaml`;
4. `docs/EXECUTION_PIPELINE.md`;
5. `docs/ECONOMY_0_9_400_A3_CASTER_OFFHAND_CONVERSION.md`;
6. `docs/MATERIAL_CULTURE_AND_PROFESSION_PLAN.md`;
7. inspect Bronze Axe, Bronze Dagger, Bronze Pick, Bronze Subligar, Bronze Mittens, current shops, A2 bronze recipes, and real downstream equipment use;
8. freeze the smallest coherent A4 production graph;
9. freeze exact Product/Data/Game-State expectations before authoring;
10. implement canonical recipes/ownership without duplicate item authority;
11. prove production -> equipment/use -> persistence/economy integration;
12. freeze implementation before documentation promotion;
13. update this handoff last.

Do not restart the broad material-culture audit or advanced-combat audit unless A4 exposes a concrete blocker owned by those domains.

## Final validation contract

This handoff is the intended final pre-merge repository-file mutation for A3 closure.

After this write:
- perform no repository-file mutation unless exact-head validation exposes a real failure;
- validate the exact synchronized PR head with hosted Check;
- confirm Repository Audit, **916/916 tests or higher**, Census, Benchmark 3, and Benchmark Sample;
- merge/promote PR #409 only after that exact synchronized head is green;
- after merge, make only a handoff-status correction on `main` recording the merged main SHA and final synchronized PR head;
- leave A4 unstarted.
