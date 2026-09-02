# 0.9.400 A4 — Remaining Bronze Starter Set Conversion Proof

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

This bounded checkpoint closes canonical production coverage for the established bronze starter equipment set without creating a second Pack-v2 ownership domain.

## Version decision

```text
Product       0.9.400.4 -> 0.9.400.5
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          78        -> 79
Benchmark     3         -> 3
Codename      Remaining Bronze Starter Set Conversion Proof
```

Data advances to 79 because A4 adds five canonical production definitions and ten new Pack-v2 ownership records.

Game State remains 21 because crafted equipment identity, production provenance, equipment placement, combat use, and current-schema persistence already have canonical durable owners.

## Implemented conversions

A4 adds production paths for five existing equipment stable IDs:

| Existing equipment ID | Production definition |
| --- | --- |
| `bronze-axe` | `craft-bronze-axe` |
| `bronze-dagger` | `craft-bronze-dagger` |
| `bronze-pick` | `craft-bronze-pick` |
| `bronze-subligar` | `craft-bronze-subligar` |
| `bronze-mittens` | `craft-bronze-mittens` |

No duplicate item definitions were added to `productionItems` or resource catalogs. `equipmentCatalog` remains physical/equipment behavior authority.

## Ownership consolidation

A4 deliberately does **not** create another bronze starter Pack-v2 pack.

Instead it extends the existing:
- `pack-starter-bronze-martial-equipment`.

The pack now owns:
- eight existing bronze starter equipment item refs;
- eight canonical bronze starter recipe refs.

This keeps one shared bronze-starter production/placement authority rather than splitting one coherent equipment family across two artificial packs.

Pack count therefore remains 42.

## Existing material graph

A4 reuses the A2 bronze graph plus existing shared hardware.

### Bronze Axe

```text
Bronze Ingot
Ash Handle Blank
Hemp Twine
    -> forge
    -> Bronze Axe
```

### Bronze Dagger

```text
Bronze Ingot
Ash Handle Blank
Hemp Twine
    -> forge
    -> Bronze Dagger
```

### Bronze Pick

```text
Bronze Ingot
Ash Handle Blank
Iron Ferrule and Socket Set
    -> forge
    -> Bronze Pick
```

Bronze Pick remains the legacy-shaped **combat weapon** identity. It does not gain `mining`; field mining remains owned by Prospector Pick.

### Bronze Subligar

```text
Bronze Sheet
Hemp Canvas
Iron Buckle and Ring Set
Field Knife / cutting capability
    -> forge
    -> Bronze Subligar
```

### Bronze Mittens

```text
Bronze Sheet
Hemp Canvas
Field Knife / cutting capability
    -> forge
    -> Bronze Mittens
```

No A4 recipe-only material identity was added.

## Mechanical proof

A4 proves:

```text
established bronze / wood / textile / hardware stocks
  -> craft existing Bronze Axe / Dagger / Pick / Subligar / Mittens IDs
  -> Axe, Dagger, and Pick retain distinct canonical weapon cadence
  -> Bronze Pick stays an axe-family combat weapon and does not acquire mining
  -> A1 Field Knife binds into both armor-assembly recipes
  -> crafted Subligar/Mittens contribute through normal armor/stat authority
  -> current-schema save/load preserves crafted identities and provenance
```

Primary regression:
- `tests/remainingBronzeStarterConversion.test.js`.

A2 regression was updated only to reflect deliberate pack extension: A2 still owns exactly three process definitions and its original item/recipe refs remain the stable prefix of the consolidated bronze pack.

## Validation evidence

Initial A4 head Check #2258 / run `33672825424`:
- Repository Audit PASS;
- A4 tests PASS;
- full suite 920/921;
- one failure: the A2 regression still expected the shared bronze pack to contain exactly three records.

That assertion was corrected to distinguish A2 process ownership from the intentionally expanded shared pack. No recipe/runtime behavior changed.

Validated behavioral implementation freeze:

```text
d371ff9f54a2b28dbda2d533a17f00de9aaa70fd
```

Hosted Check:

```text
Check #2259
Run   33672932856
Repository Audit       PASS
Tests                  921 / 921 PASS
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
```

Canonical item count remains 410 because A4 converts existing equipment IDs rather than adding new item identities.

## Next bounded candidate

**0.9.400 A5 — Basic Leather Garment Conversion — candidate next / not started.**

Initial existing-ID scope:
- Leather Vest;
- Leather Trousers.

Before authoring A5:
- inspect existing tanned-hide/binding/thread stocks and their Pack-v2 dependencies;
- prefer established leather supply chains rather than inventing generic duplicate leather;
- require a real cutting/stitching tool capability only if an existing canonical tool provides it cleanly;
- prove real armor/loadout/stat/persistence behavior;
- do not silently absorb Traveler Gloves or Traveler Boots without a fresh equipment/material audit.

## Later Packet-A work

After A5 selection:
- shared smithing tools;
- woodworking tools;
- masonry tools;
- textile tools;
- leatherworking tools;
- cooking tools;
- measurement tools.

That broader profession-tool suite should be broken into mechanically meaningful clusters instead of authored as one census-filling batch.

## Explicit non-goals

A4 does not add:
- new equipment item IDs;
- leather garment recipes;
- broad profession-tool suites;
- tool durability, wear, breakage, quality, or repair;
- workstation-owned inventories;
- worker automation;
- combat-system breadth;
- geography, ecology, quest, social, or companion breadth.
