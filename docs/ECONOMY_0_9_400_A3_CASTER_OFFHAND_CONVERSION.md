# 0.9.400 A3 — Caster / Offhand Starter Conversion Proof

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

This bounded checkpoint converts the remaining compact starter caster/offhand cluster into canonical production while proving existing two-handed/offhand, accessory, cadence, provenance, and persistence rules.

## Version decision

```text
Product       0.9.400.3 -> 0.9.400.4
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          77        -> 78
Benchmark     3         -> 3
Codename      Caster / Offhand Starter Conversion Proof
```

Data advances to 78 because A3 adds four canonical production definitions and one shared Pack-v2 ownership tranche.

Game State remains 21 because crafted equipment identity, production provenance, equipment/loadout placement, combat/stat use, and current-schema persistence already have canonical durable owners.

## Implemented conversions

A3 adds production paths for four existing equipment stable IDs:

| Existing equipment ID | Production definition |
| --- | --- |
| `ash-staff` | `craft-ash-staff` |
| `maple-wand` | `craft-maple-wand` |
| `iron-buckler` | `craft-iron-buckler` |
| `brass-ring` | `craft-brass-ring` |

No duplicate item definitions were added to `productionItems` or resource catalogs. `equipmentCatalog` remains physical/equipment behavior authority.

## Existing material graph

A3 deliberately adds no recipe-only material identity.

### Ash Staff

```text
Elderwood Ash Timber
Hemp Twine
Hide Glue
Field Knife / cutting capability
    -> woodshop
    -> Ash Staff
```

### Maple Wand

```text
Silvermaple Fine Board
Hammered Brass Sheet
Hide Glue
Field Knife / cutting capability
    -> woodshop
    -> Maple Wand
```

### Iron Buckler

```text
Tempered Redstone Iron Bar
Redstone Rivet Set
Hemp Cord
    -> forge
    -> Iron Buckler
```

### Brass Ring

```text
Brass Ingot
    -> forge
    -> Brass Ring
```

The pack depends on `pack-redstone-forge-road` because the buckler intentionally consumes established Redstone processed iron/rivet output rather than inventing a generic parallel iron-stock identity.

## Pack-v2 ownership

A3 adds shared `pack-starter-caster-offhand-equipment`.

It owns:
- four existing canonical equipment item references;
- four new recipe references.

Dependencies:
- `pack-shared-foundation`;
- `pack-material-foundations-common-components`;
- `pack-redstone-forge-road`.

The pack owns production placement/integration, not a parallel physical equipment definition.

## Mechanical proof

A3 proves:

```text
established wood / binding / brass / Redstone iron stocks
  -> craft existing Ash Staff / Maple Wand / Iron Buckler / Brass Ring IDs
  -> A1 Field Knife binds to both wood-equipment recipes
  -> crafted Ash Staff drives staff cadence and blocks offhand buckler use
  -> crafted Maple Wand replaces the two-handed staff and permits buckler use
  -> crafted Iron Buckler contributes defense/shield-block through normal equipment authority
  -> crafted Brass Ring contributes through normal accessory/stat authority
  -> current-schema save/load preserves equipped wand/buckler/ring plus stored crafted staff provenance
```

Primary regression:
- `tests/starterCasterOffhandConversion.test.js`.

The proof exercises:
- canonical item authority;
- production;
- A1 physical tool binding;
- equipment replacement/two-handed/offhand rules;
- stat/combat profile calculation;
- weapon cadence;
- account save/load.

## Validation evidence

Behavioral implementation freeze:

```text
d672f3ab90ec46c6ca9ef4beb85cef1fbfe5353d
```

Hosted Check:

```text
Check #2240
Run   33671247638
Repository Audit       PASS
Tests                  916 / 916 PASS
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
```

Canonical item count remains 410 because A3 converts existing equipment IDs rather than adding new item identities.

## Next bounded candidate

**0.9.400 A4 — Remaining Bronze Starter Set Conversion — candidate next / not started.**

Candidate existing IDs:
- Bronze Axe;
- Bronze Dagger;
- Bronze Pick;
- Bronze Subligar;
- Bronze Mittens.

This is the smallest coherent follow-on because A2 already established the bronze material graph and A4 can close the remaining established bronze starter equipment without branching into leather garments or broad profession-tool systems.

Before authoring A4:
- confirm each stable ID still has a meaningful current gameplay role;
- retain the note that Bronze Pick is a combat weapon identity, not a field-mining tool;
- reuse existing bronze/wood/textile/hardware stocks;
- prove at least one real weapon cadence/loadout path and one armor/stat path;
- do not create duplicate equipment definitions.

## Remaining Packet-A backlog after A4

Deferred:
- basic leather garments;
- selected shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools.

## Explicit non-goals

A3 does not add:
- new equipment item IDs;
- remaining bronze equipment recipes;
- leather garment recipes;
- broad profession-tool suites;
- tool durability, wear, breakage, quality, or repair;
- workstation-owned inventories;
- worker automation;
- combat-system breadth;
- geography, ecology, quest, social, or companion breadth.
