# Cross-Biome Family Breadth Plan

Status: **BOUNDED IMPLEMENTATION PLAN — AUTHORIZED.**

Baseline: Product **0.9.100.22**, Data **61**, Game State **14**, Package **0.9.100**.

Authority:
- `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
- `docs/WETLAND_ISLAND_DISTRIBUTION_REPAIR_PLAN.md`
- `docs/WORLD_MACRO_TOPOLOGY.md`
- `docs/ITEM_CONSUMPTION_SAFETY.md`

This is repair unit **5 of 5** from the location flora/fauna diversity audit.

It does not authorize:
- shorebird/wader expansion;
- snake-family expansion;
- dungeon ecology cleanup;
- world-edge authoring;
- material-culture conversion;
- Packet E;
- a new broad flora tranche.

## 1. Purpose

The first four repair units corrected location-specific distribution and botanical thinness. The remaining high-value gap is **family-level small-fauna breadth** across otherwise mature terrestrial biomes.

The audit identifies two genuinely missing, broadly reusable guilds:

1. small burrowing mammal / prey base;
2. small seed-eating passerine.

The lower-river fish gap is already resolved through River Dace from Data 58.

## 2. New family A — Ground Squirrel

Canonical family:
- `family-ground-squirrel`
- scoped to small diurnal burrowing herbivorous/omnivorous mammals of open ground;
- not a catch-all for rats, marmots, hares, or all rodents.

Planned species:

### Coppergrass Loess Ground Squirrel
Place:
- Coppergrass Steppe.

Function:
- fills the steppe's strongest missing small-burrower/prey guild;
- uses loess banks, bunchgrass, seedgrass, and seasonal-basin margins;
- remains wary/passive rather than being made aggressive for loot.

### Waymeet Cairn Ground Squirrel
Place:
- Waymeet South Marches.

Function:
- adds smaller burrowing prey below the existing marmot scale;
- uses dry cairn banks, grass rises, and raised-road verges;
- supports the plateau transition without inventing a new large-animal tranche.

### Crownfields Hedgebank Ground Squirrel
Place:
- Crownfields.

Function:
- adds ordinary wild small-mammal life to hedgebanks, hay meadows, orchard margins, and rough pasture;
- complements, rather than replaces, the existing managed Field Rat/pest ecology.

No Slatewater ground-squirrel species is planned because Data 60 already added Brush Hare as a small-prey layer there. Avoid redundant small-mammal inflation.

## 3. New family B — Finch

Canonical family:
- `family-finch`
- scoped to small seed-eating passerines;
- not a vague all-purpose “songbird” family.

Planned species:

### Coppergrass Seed Finch
Place:
- Coppergrass Steppe.

Function:
- adds a small seed-eating bird below the existing Bustard/Kite scale;
- uses seedgrass, bunchgrass heads, and seasonal-basin margins.

### Crownfields Hedgerow Finch
Place:
- Crownfields.

Function:
- fills the explicit farmland/hedgerow passerine gap;
- uses hedges, orchard margins, grain strips, hay meadows, and coppice edges.

### Elderwood Hazel Finch
Place:
- East Elderwood.

Function:
- fills the small woodland-edge bird guild;
- uses hazel coppice, crabapple thicket, grasses, and glade edges;
- does not duplicate raptor/owl/grouse roles.

### Slatewater Thistle Finch
Place:
- Slatewater Foothills.

Function:
- adds a small seed-eating bird to woodland-edge scrub and flowering road verges;
- complements existing Grouse, Eagle, Hare, and Bee presence without another large vertebrate.

No Waymeet Finch is planned in this bounded pass because Waymeet already receives the new ground-squirrel guild and has strong Grouse/Owl/Eagle/Waterfowl bird breadth.

## 4. Planned authored delta

Expected:
- new ecology families: **2**;
- new species: **7**;
- new population placements: **7**;
- new gathering sources: **0**;
- new raw resources: **0**;
- new transformations: **0**;
- new production outputs: **0**.

Planned populations:
1. Coppergrass Loess Ground Squirrel;
2. Waymeet Cairn Ground Squirrel;
3. Crownfields Hedgebank Ground Squirrel;
4. Coppergrass Seed Finch;
5. Crownfields Hedgerow Finch;
6. East Elderwood Hazel Finch;
7. Slatewater Thistle Finch.

## 5. Fauna/recovery boundary

These species are ecological diversity records, not automatic loot dispensers.

This tranche must not:
- make passive small wildlife hostile merely to manufacture drops;
- add carcass/body resources only because a species exists;
- add hunting/trapping sources without a deliberate player/economic loop;
- add food-safety metadata for nonexistent food items.

No new recoverable fauna output is planned.

## 6. Predator/prey metadata boundary

The new small-prey guild improves trophic plausibility through local presence.

Do **not** rewrite older predator species merely to add new family-link metadata unless a validation or actual player-facing mechanic requires it.

Existing predator records remain owned by their current packs. This pass owns the new families/species/populations only.

A later dedicated behavior-link normalization pass may update predator metadata if those links become mechanically significant.

## 7. Habitat-description rule

Place descriptions may receive small non-resource additions:
- burrow mounds;
- seed heads;
- hedgerow/coppice bird activity;
- thistle/grass seed structure;
- road-verge/cairn-bank small-fauna evidence.

Do not convert ordinary seedgrass, thistles, hedges, or coppice understory into inventory nodes merely to justify the new fauna.

## 8. Pack-v2 ownership

Create one bounded cross-region repair pack:

**Cross-Biome Family Breadth**
- regions: Coppergrass Steppe, Waymeet Marches, Crownfields, Elderwood, Slatewater Foothills;
- owns exactly 2 families, 7 species, and 7 populations;
- no gathering sources/items/recipes;
- depends on the existing regional ecology packs for the affected places.

## 9. Persistence/version intent

Expected if implemented and promoted:
- Product revision: **0.9.100.23**;
- Data: **62**;
- Game State: **14**;
- Package: **0.9.100**;
- Account Save: **5**;
- Benchmark: **3**.

Game State remains 14 because this is static authored ecology content only.

## 10. Validation

Focused:
- exact 2-family/7-species/7-population authored delta;
- no source/resource/production additions;
- unique family/species/population IDs;
- canonical registry resolution;
- Pack-v2 ownership/dependency validation;
- affected-place habitat text;
- passive/wary wildlife behavior;
- no route/place count change.

Full contract:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Deterministic census guards move only from measured hosted results.

## 11. Stop condition

Completion of this unit closes the **five-part location flora/fauna diversity repair sequence**.

Do not auto-start:
- shorebird/snake breadth;
- Crownfields general wild-fauna expansion;
- secondary dungeon ecology cleanup;
- world-edge expansion;
- Packet E;
- material-culture work.

Return to a fresh decision boundary after Data 62 validation.
