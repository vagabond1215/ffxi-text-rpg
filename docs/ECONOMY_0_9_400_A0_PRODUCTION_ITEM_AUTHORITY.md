# 0.9.400 A0 — Production & Item Authority Hardening

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

This bounded checkpoint opens `0.9.400 Economy / Production Depth` by hardening the authority seams required before Occupational Tool Conversion adds recipes for existing tools and starter equipment.

## Version decision

```text
Product       0.9.300.8 -> 0.9.400.1
Package       0.9.300   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          75        -> 75
Benchmark     3         -> 3
Codename      Production Item Authority Hardening
```

Data remains 75 because A0 adds no canonical authored item, recipe, shop-stock, NPC, quest, ability, geography, ecology, or Pack-v2 ownership record.

Game State remains 21 because existing work records already provide a generic durable data envelope. Production now records physical tool bindings inside the existing work record; no new top-level serialized state family or required work-state schema field is introduced.

## Audit findings that required A0

The post-0.9.300 repo audit found three integration seams that had to be closed before recipe conversion:

1. production outputs resolved only through `productionItems`, so an existing `equipmentCatalog` ID such as `field-knife` could not be a legal production output without duplicating its item definition;
2. shops reconstructed purchased items from shop tags, allowing canonical physical type to diverge from item authority — including material records carrying a `tool` tag;
3. `requiredToolTags` were checked only as capabilities at production start, without binding a physical tool to the active work record or preventing common player operations from moving that tool during the task.

## Canonical item authority

`js/text/data/canonicalItemRegistry.js` now provides the shared item resolver over the existing authorities:

```text
resourceItemRegistry
        |
productionItems
        |
equipmentCatalog
        v
canonicalItemRegistry
```

The registry does not create a fourth item-definition database. It resolves the existing domain definitions and validates cross-authority stable-ID collisions.

`contentCatalogRegistry` now uses this shared resolver for Pack-v2 item references.

## Production output authority

`productionCatalog` now exposes canonical input/output item resolution. `productionEngine` materializes outputs through the canonical resolver rather than assuming every output must be defined in `productionItems`.

This establishes the required Packet-A rule:

> An existing equipment stable ID may become a production output without copying its physical/equipment definition into a second catalog.

No existing recipe output changed in A0.

## Commerce authority

When shop stock names a canonical item ID, `shopEngine` now starts from the canonical physical definition and overlays only transaction-specific facts:

- purchase price;
- shop source metadata;
- `commerce` provenance with `purchase` action.

Legacy/non-canonical shop stock retains the bounded fallback reconstruction path.

`validateShopCatalogs()` now guards canonical stock identity and catches equipment-like stock with no canonical definition.

This also fixes tag-first misclassification of canonical material records whose descriptive tags include `tool`.

## Occupational tool accessibility and binding

Production tool requirements now resolve against:

1. **equipped field tools**;
2. **portable equipment tools in Inventory**;
3. **explicit contextual tool capabilities** supplied by a caller/service.

Material objects that merely carry a `tool` tag are not treated as portable occupational tools; portable bindings require equipment-kind tool identity.

When physical tools satisfy a production requirement, the existing work record stores bounded `toolBindings` identifying the item and its source.

Common player mutation paths now reject moving a bound physical tool while the work record is active:

- equipping an Inventory-bound tool;
- transferring an Inventory-bound tool;
- selling an Inventory-bound tool;
- unequipping an equipped bound tool;
- replacing an equipped bound tool.

The binding releases automatically when the work record leaves `active` status. No durability, breakage, quality, repair, worker automation, or second inventory authority is introduced.

## Validation evidence

Behavioral implementation freeze:

```text
0445823264bb6adf1d1717dee2df83678e561a0f
```

Hosted Check:

```text
Check #2172
Run   33661309577
Repository Audit       PASS
Tests                  901 / 901 PASS
Content Census         PASS
Benchmark 3            PASS
Benchmark Sample       PASS
```

Validated census remains:

```text
places/localities                       55
named NPCs                              48
shop/service sites                      37
creature definitions                   123
resource sources                       143
canonical items                        410
recipes/processes                      234
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1325
runtime seed NPCs                       47
runtime seed enemies                    17
```

The 410-item census predates A0 and is unchanged by this checkpoint; older operational docs that still said 408 were stale.

## Next bounded implementation

**0.9.400 A1 — Existing Field-Tool Conversion Proof** is next / not started.

A1 should convert the first bounded set of existing field tools into real recipes using existing material-foundation inputs:

- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod.

A1 must prove an end-to-end loop:

```text
raw source
  -> processed stock/components
  -> crafted existing tool ID
  -> equip/use crafted tool
  -> tool unlocks real work
  -> resulting output/use/trade
  -> save/load remains coherent
```

Only after this proof should broader starter equipment and profession-tool conversion proceed.

## Explicit non-goals

A0 does not add:

- occupational recipes or new item IDs;
- tool durability/breakage/quality;
- workstation-owned inventories;
- husbandry products;
- worker automation;
- a second production or equipment catalog;
- a new persistence family;
- combat, geography, ecology, quest, or social breadth.
