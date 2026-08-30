# Dry Upland & Saltpan Flora & Fauna Repair Plan

Status: **BOUNDED IMPLEMENTATION PLAN — AUTHORIZED.**

Baseline: Product **0.9.100.19**, Data **58**, Game State **14**, Package **0.9.100**.

Authority:
- `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
- `docs/LEGACY_ELDERWOOD_FLORA_FAUNA_REPAIR_PLAN.md`
- `docs/ITEM_CONSUMPTION_SAFETY.md`
- `docs/WORLD_MACRO_TOPOLOGY.md`

This is repair unit **2 of 5** from the location flora/fauna diversity audit. It does not authorize Headwater/Highland, Wetland/Island, or cross-biome family-breadth implementation in the same bounded run.

## 1. Scope and botanical standard

The Data 58 botanical standard remains authoritative: flora quality is assessed as habitat layers plus useful roles, not as an equal gathering-node quota.

This pass covers only:
- South Redstone Reach;
- North Redstone Reach;
- Emberwash Saltpan Verge.

No new places, routes, settlements, NPCs, services, or southern/Veyra corridor are authorized.

Recoverable plants must support real downstream use. Ordinary grasses, scrub, lichen, crust plants, and non-economic seasonal flowers may remain descriptive ecology.

## 2. South Redstone Reach

Current strengths:
- Ridge Ibex;
- Glass-Shell Crawler;
- Sunscale Lizard;
- Ironclaw Scorpion;
- copper/iron/sunstone/salt mineral access;
- rare Sun Crocus.

Primary defect:
- the dry upland is botanically represented almost entirely by one rare luxury flower.

Planned recoverable flora:
- **Sunbent Bunchgrass** — common grass/fiber/thatch layer;
- **Stone Thyme** — edible/aromatic/medicinal herb;
- **Drythorn Resin** — hardy woody-scrub/alchemical/repair material.

Descriptive non-node layers should also include broken bunchgrass, dry scrub, crust lichen, seedheads, and sparse seasonal forbs.

No new South Redstone fauna is required.

## 3. North Redstone Reach

Current strengths:
- Crag Marmot;
- Cliff Vulture;
- Ridge Millet;
- Fire Opal and mining context.

Primary defects:
- under-spread transition fauna below Ironspine;
- only one living flora source despite scrub/grass transition habitat.

Planned flora:
- **Wind Juniper Berries** — aromatic culinary shrub resource;
- **Ridge Yarrow** — medicinal/alchemical flowering herb.

Planned fauna:
- Redstone Ridge Ibex population using the existing species/family;
- Sunscale Lizard population on warmer exposed rock using the existing species/family;
- **Redstone Stone Grouse** — one new species in the existing Grouse family.

No new fauna family is required.

## 4. Emberwash Saltpan Verge

Current fauna is already coherent:
- Redtail Scorpion;
- Saltwind Vulture;
- Dust Hare;
- Saltbrush Tortoise.

Primary defect:
- the location fiction names saltbrush but the canonical recovery graph has no living halophyte resource; the only current source is mineral salt crust.

Planned recoverable flora:
- **Saltbrush Shoots** — edible halophyte shrub, prepared before eating;
- **Saltgrass Fiber** — salt-flat grass/fiber for shade and matting;
- **Panbloom Petals** — decorative/dye/alchemical flowering halophyte.

Descriptive non-node flora should include low succulent mats, saltgrass tufts, crust lichens, dry seed stalks, and sparse salt-tolerant scrub.

No new Saltpan fauna is required.

## 5. Planned raw-resource demand

Every new recoverable raw must have direct production demand:

| Raw | Role | Intended downstream use |
| --- | --- | --- |
| Sunbent Bunchgrass | fiber / thatch / structural grass | Bunchgrass Thatch Mat |
| Stone Thyme | food / aroma / medicine | Stone-Thyme Infusion |
| Drythorn Resin | alchemical / adhesive / repair | Drythorn Resin Sealant |
| Wind Juniper Berries | culinary / aroma | Juniper-Millet Pot |
| Ridge Yarrow | medicine / alchemy | Ridge Yarrow Salve |
| Saltbrush Shoots | food / halophyte diversity | Saltbrush Pot Greens |
| Saltgrass Fiber | fiber / shelter / matting | Saltgrass Shade Mat |
| Panbloom Petals | decorative / dye / alchemy | Panbloom Dye Bath |

The eight raw additions should produce eight connected outputs unless implementation discovers a cleaner existing sink.

## 6. Food-safety intent

- Stone Thyme: clean leaves may be used directly as a culinary herb in small amounts; most are steeped/cooked.
- Wind Juniper Berries: process-required culinary spice; crush and cook rather than treating them as handful food.
- Saltbrush Shoots: process-required; rinse and blanch/cook before eating because field-harvested salt-flat greens carry grit and excessive surface salt.
- prepared Stone-Thyme Infusion, Juniper-Millet Pot, and Saltbrush Pot Greens are direct-ready.

Player-facing language remains practical fantasy-era preparation guidance.

## 7. Pack-v2 ownership

Use two bounded repair ownership graphs:

1. **Redstone Dry-Upland Ecology Repair**
   - owns the new Redstone species/populations/sources/raws/outputs/recipes;
   - depends on Redstone opening/ecology breadth and Slatewater ecology for the existing Grouse family.

2. **Emberwash Saltpan Ecology Repair**
   - owns the new Saltpan sources/raws/outputs/recipes;
   - depends on Emberwash Badlands ecology.

No existing pack is duplicated merely to claim ownership.

## 8. Persistence/version intent

Expected if implemented and promoted:
- Product revision: **0.9.100.20**;
- Data: **59**;
- Game State: **14**;
- Package: **0.9.100**;
- Account Save: **5**;
- Benchmark: **3**.

Game State remains 14 because the repair adds static catalog definitions and instances of existing population/source authorities only. It introduces no new serialized flora, saltpan, or transition-state family.

## 9. Validation

Focused:
- ecology registry validation;
- exact source/item provenance;
- food-consumption metadata;
- all eight raws have production demand;
- Pack-v2 dependencies/ownership;
- place descriptions retain non-harvested botanical layers;
- no route/world-edge expansion.

Full contract:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Deterministic census guards move only from measured hosted results.
