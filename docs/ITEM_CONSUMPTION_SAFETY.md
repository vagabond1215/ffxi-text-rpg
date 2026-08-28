# Item Consumption Safety Contract

## Purpose

Canonical food/material data must distinguish **what an item is used for** from **whether it is safe to ingest in its current state**.

A generic `food` tag is not sufficient. Raw fish, grain, berries, cooked meals, toxic roots, and craft materials must not collapse into one implicit “edible” category.

Data 48 establishes explicit authored consumption metadata in the canonical item schema.

## Modes

### `direct`

Safe to consume in the item’s current authored state.

Examples:

- ripe Serviceberry;
- Lake Cress;
- Cider Apple;
- cooked bread, broth, pottage, fishcakes, smoked fish.

A direct item must have `hazard: none`.

### `processRequired`

The item is a food ingredient or potentially edible material but is **not ready to eat**.

It must include one or more preparation labels.

Examples:

- grain requiring threshing/milling/cooking;
- raw freshwater fish requiring cleaning/cooking;
- dry pulses requiring soaking/grinding/cooking;
- raw shellfish requiring purging/cleaning/cooking;
- starch that still needs cooking.

Process-required raw food should not expose an intentional direct `consume` sink.

### `nonFood`

Not intended for ingestion.

Examples:

- lake rush fiber;
- shell lime;
- pearls;
- ores;
- timber;
- net line.

Non-food items may still be materials, tools, medicines applied externally, decorative goods, or other useful objects.

## Hazards

### `none`

No special raw ingestion hazard is authored.

This does **not** automatically mean the item is ready to eat: flour and grain can be `processRequired` with `hazard: none`.

### `pathogenRisk`

Raw animal/aquatic food has a food-safety risk that processing removes.

Current examples include freshwater fish, crayfish, and mussels.

### `rawIrritant`

Raw ingestion is expected to cause irritation or digestive distress.

Examples include some mushrooms, dry pulses, and raw arrowroot-like corms.

### `rawToxic`

The raw item is poisonous/toxic and requires a specific detoxification process.

Data 48 reference case:

```text
Bitterflag Rhizome
mode: processRequired
hazard: rawToxic
preparation: slice / leach / boil
```

The player-facing label explicitly says **toxic if eaten raw**.

## Validation

Canonical validators now require explicit consumption metadata on every `food`-tagged resource or production item.

Regression coverage ensures:

- food-tagged items cannot silently inherit an ambiguous default;
- `direct` items cannot carry a raw hazard;
- `processRequired` items declare preparation;
- Great Mere preparation-required raw foods have an actual production path;
- Bitterflag has no direct-consume sink;
- processed Great Mere foods preserve input provenance;
- carried-item/search information exposes safety labels.

## Presentation

The character information surface can display labels such as:

- `Safe to consume as-is`
- `Process before eating: raw food-safety risk; clean, cook`
- `Process before eating: toxic if eaten raw; slice, leach, boil`
- `Not food`

This is information about authored item state, not a second food or poison simulation.

## Runtime boundary

Data 48 **does not** introduce:

- hunger;
- nutrition meters;
- food spoilage state;
- poisoning status from a generic eat command;
- recipe-specific detox state;
- a separate cooking clock;
- a second inventory authority.

If later gameplay introduces an explicit consume/eat action with poisoning, satiety, allergy, spoilage, or nutrition effects, that must compose this metadata with the existing item/status/character authorities rather than reinterpret tags ad hoc.

## Future zone rule

When authoring a new zone:

1. assign plausible flora/fauna for the biome;
2. assign plausible resources/catches/body recoveries;
3. classify each food-capable raw as direct, processing-required, or hazardous;
4. provide appropriate processing/recipes for new preparation-required raws within the tranche unless deliberately documented otherwise;
5. preserve useful byproducts where they support believable craft/economic loops;
6. connect resulting goods to trade, craft, repair, consumption, contracts, or other intentional sinks;
7. do not make passive wildlife aggressive solely to create drops.
