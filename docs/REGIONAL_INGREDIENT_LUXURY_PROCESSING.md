# Regional Ingredient & Luxury Processing

## Status

Data 47 bounded content-depth tranche.

This pass converts the existing regional raw-resource catalog from mostly harvest/trade breadth into a more connected production economy. It deliberately treats **processed ingredients and components as first-class outputs** rather than jumping directly from raw resource to finished product.

## Contract

- Product: `0.9.100.8`
- Data: `47`
- Game State: `14` unchanged
- New production transformations: **30**
- New production outputs: **30**
- Canonical recipes/processes after pass: **59**
- Canonical items after pass: **126**
- Regional/shared Pack-v2 packs: **16**
- Pack-owned records: **470**

No new persistent state family is introduced.

## Production principle

The canonical shape is:

```text
raw resource
  -> processed ingredient / component
  -> second-stage ingredient / component
  -> finished food / textile / luxury good
```

Intermediate goods remain ordinary canonical inventory items with production provenance and sinks. They can be traded, stored, used by later recipes, or become inputs to future content.

## Crownfields staple chains

### Grain

```text
Crown Rye
  -> Crown Rye Flour
  -> Crown Rye Hearth Loaf
```

The finished loaf also consumes Redstone Rock Salt, creating a real regional food dependency.

### Pulses

```text
Field Pea
  -> Field Pea Meal
  -> Herbed Field Pea Pottage
```

The pottage combines Crownfields peas, Slatewater Mountain Thyme, and Redstone Rock Salt.

### Linen

```text
Blue Flax Straw
  -> Crownfields Flax Thread
  -> Crownfields Linen Cloth
```

Linen cloth is intentionally a major intermediate used by multiple regional dye chains.

### Woad

```text
Dyer's Woad
  -> Crownfields Woad Pigment
  + Crownfields Linen Cloth
  -> Woad-Blue Linen Bolt
```

### Orchard processing

```text
Cider Apple
  -> Pressed Cider Apple Must
  -> Crownfields Cider Vinegar
```

The vinegar remains an ingredient-oriented output for later preservation, cooking, tanning, or household recipes.

## Luxury chains

### Elderwood

```text
Ghost Orchid
  -> Ghost Orchid Absolute

Blackheart Heartwood
  -> Blackheart Fine Veneer

Blackheart Veneer
+ Ghost Orchid Absolute
+ Windglass Agate Cabochon
  -> Orchid-Scented Blackheart Casket
```

### Redstone

```text
Sun Crocus Stigma
  -> Sun Crocus Gold Pigment

Fire Opal
  -> Cut Redstone Fire Opal
  + Redstone Copper Ingot
  -> Copper-Set Fire Opal Brooch
```

### Starfen

```text
Indigo Iris Petal
  -> Starfen Indigo Pigment
  + Crownfields Linen Cloth
  -> Starfen Indigo Linen Bolt

Moonlotus Blossom
  -> Moonlotus Essence
  + Ghost Orchid Absolute
  -> Moonlotus-Orchid Perfume
```

### Coppergrass

```text
Crimson Madder Root
  -> Coppergrass Crimson Pigment
  + Crownfields Linen Cloth
  -> Coppergrass Crimson Linen Bolt

Windglass Agate
  -> Windglass Agate Cabochon
  + Crownfields Flax Thread
  + Redstone Copper Ingot
  -> Windglass Road Charm
```

### Slatewater

```text
Silver Lichen
  -> Silver Lichen Pigment

White Clay
  -> Slatewater Fine White Slip

Silver Lichen Pigment
+ Fine White Slip
  -> Silver Lichen Ceramic Glaze

Blue Slate
  -> Polished Slatewater Blue Tile

Polished Blue Tile
+ Silver Lichen Glaze
  -> Silver-Glazed Blue Slate Plaque
```

## Five-region dye artifact

The highest-order cross-regional recipe is:

```text
Crownfields Linen Cloth
+ Crownfields Woad Pigment
+ Redstone Crocus Pigment
+ Starfen Indigo Pigment
+ Coppergrass Madder Pigment
+ Slatewater Lichen Pigment
  -> Five-Region Dyer's Sample Book
```

This is deliberately not merely a census filler item. It demonstrates that regional luxury resources can become mutually dependent inputs in a single finished artifact.

## Raw-resource utilization

Before this pass:

- canonical raw resources: **44**
- raw resources directly used by production: **15**
- explicit luxury raws: **11**
- luxury raws directly used by production: **0**

After this pass:

- canonical raw resources: **44**
- raw resources directly used by production: **33**
- utilization: **75%**
- explicit luxury raws: **11**
- luxury raws directly used by production: **11**
- luxury utilization: **100%**

The regression contract lives in `tests/ingredientLuxuryProcessing.test.js`.

## Remaining raw-resource opportunities

The following current raw resources still do not directly feed the canonical production catalog:

- Redstone Clay
- Elderwood Hazel Nut
- Elderwood Crabapple
- Ridge Millet
- Starfen Reedgrain
- Fen Mussel
- Coppergrass Groundpea
- Prairie Flax
- Slatewater Serviceberry
- Pitch Pine Resin
- Meadow Hay

These are **content-depth opportunities, not broken references**.

Likely future uses include:

- clay pottery / kiln goods;
- nut oil / nut meal;
- preserves / vinegar / fruit pastry;
- millet and reedgrain flour/porridge;
- shellfish cooking and preservation;
- groundpea roasting/meal;
- alternate flax/oilseed processing;
- berry preserves;
- pine pitch/tar;
- hay/fodder once husbandry becomes a deliberate system.

## Workstation reuse

No new production authority was created.

The pass reuses existing workstation tags:

- `kitchen`
- `workshop`
- `woodshop`
- `forge`

Crownfields Growers' Hall and Millhouse/Common Loft now expose the existing workshop/kitchen authority through POI tags, making its staple processing locally playable without adding a mill-specific state subsystem.

## Pack-v2 ownership

`pack-regional-ingredient-luxury-processing` owns the new 30 items and 30 recipes.

It is shared/cross-regional because the recipes deliberately combine materials from multiple regions. It declares dependencies on the regional ecology packs that own the raw inputs rather than duplicating those definitions.

## Persistence decision

Game State remains 14.

The pass adds only authored definitions and ownership relationships. Runtime production continues to use the existing:

- inventory/container authority;
- provenance authority;
- production/work-task authority;
- work proficiency authority;
- workstation authority;
- fictional world time;
- Pack-v2 catalog bridge.

No new serialized fact is required.
