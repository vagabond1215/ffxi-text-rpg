# Legacy Elderwood Flora & Fauna Repair Plan

Status: **COMPLETE / PROMOTED DATA 58.**

Baseline: Product **0.9.100.18**, Data **57**, Game State **14**, Package **0.9.100**.

Promoted result: Product **0.9.100.19**, Data **58**, Game State **14**, Package **0.9.100**.

Authority:
- `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
- `docs/WORLD_MACRO_TOPOLOGY.md`
- `docs/ITEM_CONSUMPTION_SAFETY.md`

This is repair unit **1 of 5** from the location flora/fauna diversity audit. It does not authorize Dry Upland & Saltpan, Headwater/Highland, Wetland/Island, or cross-biome family-breadth implementation in the same bounded run.

## 1. Botanical diversity standard

Flora quality is assessed as a **guild/layer mix**, not an equal gathering-node quota.

For temperate forest and riparian locations, authoring should consider:

1. canopy / woody structure;
2. shrub and understory structure;
3. herbaceous and ground-layer vegetation;
4. wet-margin/aquatic vegetation where water exists;
5. fungi, mosses, lichens, or decomposer substrate where moisture/shade supports them;
6. edible forage;
7. medicinal/alchemical/aromatic plants;
8. fiber, binder, timber, dye, or other practical material plants;
9. decorative or visually distinctive flowers/foliage;
10. ordinary non-harvested background vegetation.

Not every plant needs an inventory item. Decorative/background vegetation can remain in place descriptions when harvesting it would add no meaningful loop. Every new recoverable raw must retain exact provenance and an intentional sink; food-capable items must use explicit practical preparation metadata.

## 2. Bounded locations

### East Elderwood

Current strengths:
- Hazel nuts and rod coppice;
- Crabapple;
- Ash;
- Silvermaple timber and sap;
- Amber Bee and Embercoat Fox.

Repair goal:
- add understory food, medicinal/alchemical, and decorative layers;
- spread existing common forest fauna instead of creating bespoke replacements.

Planned flora:
- **Wood Sorrel Bank** — edible understory green;
- **Wayleaf Patch** — medicinal/alchemical herb;
- **Bluebell Glade** — decorative/aromatic/dye flower.

Planned fauna spread:
- Brush Hare population;
- Moon-Antler Hart population;
- Elderwood Barkboar population at low density;
- Moss Owl population.

No new East Elderwood fauna family is required.

### Timbercross Landing

Current:
- River Otter;
- Moss-Shell River Turtle;
- no flora recovery;
- no fish population/catch.

Repair goal:
- make the navigable forest river bend a real riparian ecosystem.

Planned flora:
- **River Mint Bank** — edible/aromatic herb;
- **Willowherb Bank** — medicinal/alchemical riparian herb;
- **Landing Sedge Stand** — fiber/bank vegetation;
- **River Currant Brake** — edible shrub fruit.

Planned fauna:
- **Timbercross Bronze Dace** — new lower-river fish species in one new broadly reusable river-dace family;
- **Timbercross Teal** — Waterfowl-family species;
- **Timbercross Bank Frog** — Frog-family species.

A fishing source will provide exact Bronze Dace catch provenance.

### Thornwall Old Gaol

Current:
- zero ecology populations;
- zero sources;
- disused cells, cistern passages, and old foundations.

Repair goal:
- add a restrained cellar/cistern ecological substrate without turning a civic ruin into a cave-biome duplicate.

Planned fauna:
- **Thornwall Cellar Bat** — existing Bat family;
- **Gaol Webspider** — existing Spider family.

Planned flora/fungi:
- **Cistern Moss Seam** — damp absorbent/alchemical ground layer;
- **Gaol Shelf-Fungus Cluster** — non-food fungus used for tinder/dye/utility processing.

No rat family is introduced in this pass.

### Redfang Camp

No broad ecology expansion is planned. Its primary identity remains an occupied fortified raider site. Ordinary camp-edge vegetation may be reflected in description if needed, but no source or species is added solely to raise counts.

## 3. Planned raw resources and downstream uses

Every new recoverable raw receives direct production demand:

| Raw | Role | Intended downstream use |
| --- | --- | --- |
| Elderwood Wood Sorrel | consumption / herb | Sorrel-Crabapple Relish |
| Elderwood Wayleaf | alchemical / medicine | Wayleaf Field Wash |
| Elderwood Bluebell Petals | decorative / dye / aroma | Bluebell Dye Bath |
| Timbercross River Mint | food / aroma / medicine | River-Mint Tea; Minted Dace Pot |
| Timbercross Willowherb | medicinal / tannin/herb | Willowherb Poultice |
| Timbercross Sedge Fiber | fiber / bank material | Landing Sedge Mat |
| Timbercross River Currants | consumption / preserve | River Currant Compote |
| Timbercross Bronze Dace | fish / food | Cleaned Bronze Dace -> Minted Dace Pot |
| Thornwall Cistern Moss | absorbent / alchemical | Clean Cistern Moss Packing |
| Gaol Shelf Fungus | fungus / tinder / dye | Dried Gaol Fungus Tinder |

The exact number of transformations may be adjusted during implementation if an existing production path is a better sink, but **all ten raws must have real production demand at implementation freeze**.

## 4. Food safety

- Wood Sorrel: direct-ready after ordinary rinsing; treated as a tart herb/green, not a bulk staple.
- River Mint: direct-ready culinary herb after rinsing.
- River Currants: direct-ready when ripe and clean.
- Bronze Dace: raw catch requires cleaning and cooking/smoking.
- Cleaned Bronze Dace remains raw until cooked.
- Shelf fungus is **not food**.
- Cistern moss is **not food**.

Player-facing wording should remain practical fantasy-era preparation advice.

## 5. Decorative/background diversity

Place descriptions should carry additional non-node flora so the biome does not imply that only harvestable plants exist.

Expected descriptive layers include, where appropriate:
- oak/maple/ash canopy;
- hazel and thorn shrub;
- bracken/fern;
- moss and leaf litter;
- river willow/alder;
- rush/sedge margins;
- nettles, grasses, and small seasonal flowers.

These are descriptive ecology unless a real player-facing resource loop justifies canonical recovery.

## 6. Taxonomy decision

One new family is justified:

- **River Dace** — lower/deeper navigable-river small fish distinct from Headwater cold-stream trout and Great Mere lake fish.

Everything else should reuse existing canonical families.

## 7. Persistence/version intent

Expected if implemented and promoted:
- Product revision: **0.9.100.19**;
- Data: **58**;
- Game State: **14**;
- Package: **0.9.100**;
- Account Save: **5**;
- Benchmark: **3**.

Game State stays 14 because this pass adds static authored ecology/resource/production content and existing population/source state instances only. It introduces no new serialized state family.

## 8. Validation

Focused:
- canonical ecology registry;
- resource provenance and item-consumption validation;
- Pack-v2 ownership/dependency validation;
- production input/output validation;
- player flow for East Elderwood population spread, Timbercross fishing/processing, and Old Gaol ecology.

Full contract:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Deterministic census guards must move only from measured hosted results.


## 9. Implementation result

Implemented as planned with one bounded adjustment: East Elderwood uses a common **Crownwood Hart** species in the existing Hart family rather than spreading the rare Moon-Antler Hart itself.

Final authored delta:
- 1 new ecology family;
- 6 new species;
- 9 new population placements;
- 10 exact-provenance sources/raws;
- 11 transformations;
- 11 production outputs;
- 1 Pack-v2 ownership graph;
- non-harvested flora layers added to place descriptions.

Measured raw utilization improved to **135/145**.

Implementation freeze:
- `3732f22a464a3cdd2d11409475730ea804dfa1a6`;
- Check #1601 / run `33314083287`;
- Repository Audit PASS;
- **802/802 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Promoted runtime/data SHA:
- `9988c34e985d28586624d64258955cecec55e5d5`.

No later ecology repair is authorized by completion of this unit.
