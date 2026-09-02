# 0.9.400 A2 — Bronze Martial Conversion Proof

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

This bounded checkpoint continues the A1 canonical conversion pattern with a compact martial-equipment cluster: one weapon and two armor pieces using existing shared material-foundation stocks.

## Version decision

```text
Product       0.9.400.2 -> 0.9.400.3
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          76        -> 77
Benchmark     3         -> 3
Codename      Bronze Martial Conversion Proof
```

Data advances to 77 because A2 adds three canonical production definitions and one shared Pack-v2 ownership tranche.

Game State remains 21 because crafted equipment identity, provenance, equipment placement, combat profile use, weapon cadence, and current-schema persistence all use existing durable authorities.

## Implemented conversions

A2 adds production paths for three existing equipment stable IDs:

| Existing equipment ID | Production definition |
| --- | --- |
| `bronze-sword` | `craft-bronze-sword` |
| `bronze-cap` | `craft-bronze-cap` |
| `bronze-harness` | `craft-bronze-harness` |

No duplicate item definitions were added to `productionItems` or any resource-item catalog. `equipmentCatalog` remains physical/equipment behavior authority.

## Existing material graph

A2 deliberately adds no recipe-only material identity.

### Bronze Sword

```text
Bronze Ingot
Ash Handle Blank
Hemp Twine
    -> forge
    -> Bronze Sword
```

### Bronze Cap

```text
Hammered Bronze Sheet
Hemp Canvas
    -> forge
    -> Bronze Cap
```

### Bronze Harness

```text
2x Hammered Bronze Sheet
Hemp Canvas
Iron Buckle and Ring Set
Field Knife / cutting capability
    -> forge
    -> Bronze Harness
```

The harness deliberately requires `cutting`, connecting A1's physical-tool contract to a separate equipment-production chain.

## Pack-v2 ownership

A2 adds shared `pack-starter-bronze-martial-equipment`.

It owns:
- three existing canonical equipment item references;
- three new recipe references.

Dependencies:
- `pack-shared-foundation`;
- `pack-material-foundations-common-components`.

The pack owns production placement/integration, not a parallel equipment definition.

## Mechanical proof

A2 proves:

```text
shared alloy / wood / textile / hardware stocks
  -> craft existing Bronze Sword / Cap / Harness IDs
  -> A1 Field Knife binds as cutting tool for harness assembly
  -> canonical equipment modifiers retained
  -> crafted Bronze Sword drives real melee weapon cadence
  -> crafted armor modifies real combat profile
  -> full crafted loadout persists through current-schema save/load
```

Primary regression:
- `tests/starterBronzeMartialConversion.test.js`.

The proof exercises:
- canonical item authority;
- production;
- A1 physical tool binding;
- equipment;
- stat/combat profile calculation;
- weapon cadence;
- account save/load.

## Validation evidence

Behavioral implementation freeze:

```text
f4ae20cce0a3a735d13b6df537deeb3f9ea8360d
```

Hosted Check:

```text
Check #2220
Run   33665699974
Repository Audit       PASS
Tests                  911 / 911 PASS
Content Census         PASS
Benchmark 3            PASS
Benchmark Sample       PASS
```

Validated census:

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
```

Canonical item count remains 410 because A2 converts existing equipment IDs rather than adding new item identities.

## Next bounded candidate

**0.9.400 A3 — Caster / Offhand Starter Conversion — candidate next / not started.**

The remaining compact mixed starter cluster is:
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring.

Before authoring A3, inspect those four existing IDs against current shared wood/metal/fine-craft stocks and choose recipes that do not invent one-off materials merely to satisfy conversion.

The rest of the broader conversion backlog remains deferred:
- remaining Bronze Axe / Dagger / Pick and Bronze Subligar / Mittens;
- basic leather garments;
- selected shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools.

## Explicit non-goals

A2 does not add:
- new equipment item IDs;
- remaining bronze equipment recipes;
- caster/offhand/accessory recipes;
- leather garment recipes;
- tool durability, wear, breakage, quality, or repair;
- workstation-owned inventories;
- worker automation;
- combat-system breadth;
- geography, ecology, quest, social, or companion breadth.
