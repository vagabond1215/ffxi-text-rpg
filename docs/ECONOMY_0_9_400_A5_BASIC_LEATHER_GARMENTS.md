# 0.9.400 A5 — Basic Leather Garment Conversion Proof

Status: **COMPLETE / IMPLEMENTATION FREEZE VALIDATED.**

This bounded checkpoint closes the explicit basic-leather-garment conversion debt using the established Elderwood tanning supply chain and existing physical-tool authority.

## Version decision

```text
Product       0.9.400.5 -> 0.9.400.6
Package       0.9.400   -> 0.9.400
Account Save  5         -> 5
Game State    21        -> 21
Data          79        -> 80
Benchmark     3         -> 3
Codename      Basic Leather Garment Conversion Proof
```

Data advances to 80 because A5 adds two canonical production definitions and one shared Pack-v2 ownership tranche.

Game State remains 21 because crafted equipment identity, production provenance, equipment placement, combat/stat use, and current-schema persistence already have canonical durable owners.

## Implemented conversions

| Existing equipment ID | Production definition |
| --- | --- |
| `leather-vest` | `craft-leather-vest` |
| `leather-trousers` | `craft-leather-trousers` |

No duplicate item definitions were added. `equipmentCatalog` remains physical/equipment behavior authority.

Traveler Gloves and Traveler Boots remain deliberately out of scope.

## Existing material graph

A5 does not create a generic duplicate leather identity.

### Leather Vest

```text
2x Dusk-Tanned Barkboar Hide
Resin-Cured Hide Binding
Field Knife / cutting capability
    -> tannery
    -> Leather Vest
```

### Leather Trousers

```text
Dusk-Tanned Barkboar Hide
Resin-Cured Hide Binding
Field Knife / cutting capability
    -> tannery
    -> Leather Trousers
```

The recipes follow existing Elderwood leathercraft conventions:
- `crafting` proficiency;
- tannery workstation;
- established `item-elderwood-tanned-hide`;
- established `item-elderwood-hide-binding`.

A5 does not invent a separate leatherworking proficiency or stitching-tool state family.

## Pack-v2 ownership

A5 adds shared `pack-basic-leather-garments`.

Dependencies:
- `pack-shared-foundation`;
- `pack-elderwood-hunt-timber`.

It owns:
- two existing equipment item refs;
- two new recipe refs.

The Elderwood dependency is intentional because A5 consumes the canonical Elderwood tanning supply chain.

## Mechanical proof

A5 proves:

```text
Elderwood hide recovery/tanning/binding chain
  -> crafted A1 Field Knife supplies cutting
  -> craft existing Leather Vest / Leather Trousers IDs at tannery
  -> canonical light-armor HP/defense behavior
  -> current-schema save/load preserves equipment identities + provenance
```

Primary regression:
- `tests/basicLeatherGarmentConversion.test.js`.

## Validation evidence

Initial implementation Check #2276 / run `33675148970`:
- Repository Audit PASS;
- A5 recipe/authority/stat/save-load tests passed except the crafted-Field-Knife prerequisite test;
- full suite 925/926;
- failure reason: test setup granted `crafting` but omitted the existing A1 Field Knife recipe's required `metalworking 4`.

The regression setup was corrected; A5 runtime/recipe definitions did not change.

Validated behavioral implementation freeze:

```text
ff238f7aef29f2229cd35f2d77ea9ba0b8faa847
```

Hosted Check:

```text
Check #2277
Run   33675272069
Repository Audit       PASS
Tests                  926 / 926 PASS
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
recipes/processes                      254
abilities/techniques                    41
quests/contracts                        20
companions                               2
transport services                       7
routes                                  25
NPC schedules                           27
regional/shared packs                   43
pack-owned records                    1365
runtime seed NPCs                       47
runtime seed enemies                    17
```

Canonical item count remains 410 because A5 converts existing equipment IDs.

## Conversion-first exhaustion finding

After A5, the explicit Packet-A conversion list no longer contains a clean established-ID workshop-tool cluster.

Current canonical equipment provides the six established field tools:
- Field Knife;
- Prospector Pick;
- Woodsman Hatchet;
- Digging Spade;
- Reed Sickle;
- Marsh Fishing Rod.

Repository inspection found no established equipment IDs for ordinary:
- smithing hammers/tongs/files;
- woodworking saws/planes/chisels;
- masonry mallets/chisels;
- textile shears/needles/spindles;
- leatherworking awls/needles;
- cooking implements;
- measurement/balance tools.

The material foundation does contain useful components such as Iron Tool-Head Blank, textile fibers/yarns, quicklime, pine tar, and hide glue, but those are materials, not physical workshop-tool identities.

## Next bounded candidate

**0.9.400 A6 — Shared Workshop Tool Authority Audit — candidate next / not started.**

A6 should be an authority/design pass before new tool authoring.

Required questions:
1. Which workshop actions genuinely need portable physical tools versus workstation capability?
2. Which minimal tool tags are mechanically meaningful rather than decorative?
3. Which tool identities should be equipment, workstation fixtures, consumable components, or contextual station capabilities?
4. Can existing `requiredToolTags` and production binding support them without new durable state?
5. Which smallest cross-profession cluster proves the model—likely smithing + woodworking—without authoring the entire backlog?
6. Which existing material-foundation components can produce those tools?
7. Which packs should own shared tools without region-specific duplication?

Do **not** create a large workshop-tool catalog before this audit freezes those boundaries.

## Explicit non-goals

A5 does not:
- convert Traveler Gloves or Traveler Boots;
- create new workshop-tool item identities;
- add a leatherworking proficiency;
- add stitching-tool state;
- add tool durability/quality/repair;
- add workstation inventories;
- add worker automation;
- authorize Material Culture Packets B-F.
