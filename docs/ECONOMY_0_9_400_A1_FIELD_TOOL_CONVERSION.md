# 0.9.400 A1 — Existing Field-Tool Conversion Proof

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

This bounded checkpoint proves that established field equipment can move from shop/bootstrap-only availability into canonical production without duplicating item authority.

## Version decision

```text
Product       0.9.400.1 -> 0.9.400.2
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          75        -> 76
Benchmark     3         -> 3
Codename      Existing Field-Tool Conversion Proof
```

Data advances to 76 because A1 adds six canonical production definitions and one new shared Pack-v2 ownership tranche.

Game State remains 21 because crafted tools, production provenance, equipment state, inventory state, work records, and current-schema persistence already have canonical durable owners.

## Implemented tool conversions

A1 adds six production definitions targeting existing equipment stable IDs:

| Existing equipment ID | Production definition |
| --- | --- |
| `field-knife` | `craft-field-knife` |
| `prospector-pick` | `craft-prospector-pick` |
| `woodsman-hatchet` | `craft-woodsman-hatchet` |
| `digging-spade` | `craft-digging-spade` |
| `reed-sickle` | `craft-reed-sickle` |
| `marsh-rod` | `craft-marsh-fishing-rod` |

No duplicate item definitions were added to `productionItems` or resource catalogs. `equipmentCatalog` remains physical/equipment behavior authority.

## Existing material dependencies

The recipes reuse Data-75 material-foundation stocks and components rather than creating recipe-only inputs.

Five metal-edge/head tools use combinations of:
- Steel Blade Blank;
- Iron Tool-Head Blank;
- Ash Handle Blank;
- Iron Ferrule and Socket Set.

The Marsh Fishing Rod uses:
- Dressed Giant Cane Poles;
- Hemp Twine;
- Iron Ferrule and Socket Set.

The Marsh Fishing Rod assembly explicitly requires `cutting`, making the production tool-binding contract mechanically active.

## Pack-v2 ownership

A1 adds the shared `pack-occupational-field-tools` pack.

It owns:
- six existing canonical equipment item references;
- six new recipe references.

Dependencies:
- `pack-shared-foundation`;
- `pack-material-foundations-common-components`.

This is ownership/placement authority, not a second physical item database.

## Vertical proof

A1 proves the requested end-to-end loop:

```text
existing material-foundation stocks
  -> craft existing Field Knife ID
  -> canonical equipment behavior retained
  -> crafting provenance retained
  -> equip crafted Field Knife
  -> cutting capability becomes available
  -> crafted knife unlocks real cutting-gated production
  -> crafted knife binds into Marsh Fishing Rod assembly
  -> craft existing Marsh Fishing Rod ID
  -> rod provides real fishing capability
  -> save/load preserves crafted equipment identity and provenance
```

The proof uses real production, equipment, tool-binding, inventory, and account-save/load paths.

## Validation evidence

A1 implementation freeze:

```text
d4de8f25204a46f54ccecd905b4a2144e19e96b4
```

Hosted Check:

```text
Check #2200
Run   33663456804
Repository Audit       PASS
Tests                  906 / 906 PASS
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
```

Canonical item count remains 410 because A1 converts existing equipment IDs rather than adding new item identities.

## Initial freeze repair

The first A1 freeze head reached the full test suite but exposed only stale exact Pack-v2 census expectations after the new shared pack was added:
- 39 -> 40 content packs;
- 1,325 -> 1,337 owned records;
- Pack-v2 owned item refs 377 -> 383;
- Pack-v2 owned recipe refs 228 -> 234.

Those assertions were synchronized without changing recipe/runtime behavior. Check #2200 is the validated implementation freeze after that repair.

## Next bounded implementation

**0.9.400 A2 — Broader Starter Equipment & Occupational Tool Conversion is next / not started.**

A2 may now consider the deferred conversion list:
- Ash Staff;
- Maple Wand;
- Iron Buckler;
- Brass Ring;
- Bronze weapons and armor;
- basic leather garments;
- selected shared smithing, woodworking, masonry, textile, leatherworking, cooking, and measurement tools.

A2 should remain conversion-first: reuse established item IDs and existing material graphs before inventing new equipment families.

## Explicit non-goals

A1 does not add:
- tool durability, wear, breakage, or repair;
- quality tiers;
- workstation-owned inventories;
- worker automation;
- new field-tool item IDs;
- new gathering sources;
- husbandry products;
- combat breadth;
- geography, ecology, quest, social, or companion breadth.
