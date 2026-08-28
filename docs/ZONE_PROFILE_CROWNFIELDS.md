# Crownfields — Zone Profile

## Canonical identity

- **Region:** Crownfields
- **Countryside place:** `crownfields`
- **Service hamlet:** `crownfields-grange`
- **Map:** `map-crownfields`
- **Nation:** Thornwall
- **Countryside danger:** 1
- **Primary route:** Southfield Farm Road
- **Scheduled transport:** Crownfields Produce Wagon

Crownfields is Thornwall’s southern agricultural hinterland. It exists to answer a basic worldbuilding and economic question that the earlier map left unresolved: **where does a forest capital get its grain, pulses, fodder, orchard fruit, fiber crops, draft animals, and routine market surplus?**

It is deliberately not another wilderness frontier and not another major city.

## Geographic placement

```text
                Thornwall
             Southgate / walls
                    |
                    | Southfield Farm Road
                    v
          +----------------------+
          |  CROWNFIELDS GRANGE  |
          | market / mill /      |
          | growers hall / wagons|
          +----------+-----------+
                     |
                     | local farm tracks
                     v
+------------------------------------------------+
|                  CROWNFIELDS                   |
|                                                |
| hedged grain strips     pasture / hay meadow   |
| pulse fields            orchard belts          |
| flax + dye crops        drainage ditches       |
| farmsteads              coppices / field trees |
+------------------------------------------------+
                     |
              future southern country
```

Crownfields is directly south of Thornwall. It is a relatively gentle lowland compared with Elderwood’s enclosed forests and Slatewater’s foothills.

## Biome

**Temperate agricultural lowland.**

The landscape is a mosaic rather than one continuous crop field.

### Open-field strips

Long cultivated grain and pulse strips occupy the best-drained soils. Crop rotation, fallow strips, boundary banks, and cart tracks break up the landscape.

### Hedgerows and ditch banks

Hedges provide:
- field boundaries;
- wind shelter;
- nesting habitat;
- pest corridors;
- berries and incidental forage;
- livestock control.

Drainage ditches and small streams keep low fields workable and feed water meadows.

### Pasture and hay meadow

Permanent and seasonal pasture supports cattle and sheep. Hay meadows provide winter fodder and create a distinct managed grassland niche.

### Orchard belts

Farmsteads and sheltered roads support apple orchards, pollinating insects, poultry, and small pests.

### Coppices and field woods

Crownfields is not treeless. Small managed woods, pollarded trees, and coppices provide fuel, fencing material, shade, and wildlife cover without becoming Elderwood.

## Access and boundary logic

Crownfields is intentionally one of the world’s most accessible regions.

Supported movement:
- walk;
- mount;
- wagon;
- caravan.

The **Southfield Farm Road** connects Thornwall Southgate to Crownfields Grange:

- 9,000 yalms;
- 3,600 fictional seconds;
- hazards are logistical rather than high-danger wilderness threats: seasonal mud, livestock crossings, and farm traffic.

Crownfields Grange connects to the surrounding fields by ordinary local foot travel.

Future boundaries should remain plausible:
- drainage channels can require bridges or culverts;
- fenced pasture should use gates rather than magical collision walls;
- muddy lanes may restrict wagons seasonally;
- private farmyards can be socially restricted even when physically reachable;
- major rivers, if introduced later, should require real crossings.

## Crownfields Grange

The Grange is a **small agricultural service hamlet**, not a city.

It concentrates functions that dispersed farms cannot efficiently provide alone.

### Crownfields Produce Exchange — Maelin Rook

The exchange:
- buys ordinary sellable field goods;
- aggregates loads for Thornwall;
- sells staple produce;
- supplies bread, water, cutting tools, and digging tools;
- provides market-price context for nearby farmers and field workers.

The exchange is mechanically backed by the existing shop engine.

### Crownfields Growers’ Hall — Hessa Vale

The hall serves:
- crop appraisal;
- harvest guidance;
- market notices;
- drover notices;
- field-exchange coordination;
- practical fieldcraft information.

It uses the existing guild-service presentation surface rather than introducing a new farming progression authority.

### Produce Wagon Yard — Perrin Bale

The yard supports:
- scheduled produce wagons;
- draft-animal watering and feed;
- harness and wagon checks;
- stabling;
- farm freight consolidation.

The scheduled **Crownfields Produce Wagon** connects the Grange and Thornwall Southgate through the canonical transport system.

### Millhouse and Common Loft

The Grange includes:
- watermill;
- granary scales;
- common kitchen;
- dry storage;
- simple loft bunks.

Because the Grange is danger 0, safe overnight recovery uses the existing campaign-recovery authority.

## Managed ecology

Crownfields broadens ecology into domesticated and human-shaped niches rather than simply adding more wild predators.

### Crownfield Cattle

- family: cattle;
- role: draft power, grazing, manure, future dairy/meat/hide potential;
- habitat: pasture and water meadow;
- behavior: passive herds.

No livestock-product state is invented yet. Future husbandry mechanics can consume these populations or reference dedicated herd ownership when such a system is deliberately authored.

### Whitefleece Sheep

- family: sheep;
- role: grazing and future wool/meat production;
- habitat: pasture and hay meadow;
- behavior: passive flocks.

### Redcomb Hen

- family: chicken;
- role: farmyard omnivore and future egg/meat production;
- habitat: farmyards, orchard edges, grain yards.

### Hedgerow Rat

- family: field rat;
- role: agricultural pest and scavenger;
- habitat: hedges, ditches, granary margins;
- activity: weighted toward evening.

This provides a real crop-loss/pest niche without turning every farm animal into combat content.

### Orchard Honeybee

- existing bee family;
- role: pollinator;
- habitat: orchard, clover meadow, farm gardens;
- daytime activity.

Apiary products are not added yet because the current ecology source taxonomy represents field/flora/mineral/fishing sources, not managed animal-product husbandry. Honey should arrive with an intentional apiary/husbandry model rather than being mislabeled as a plant resource.

## Agricultural resources

Crownfields adds six directly gatherable managed-crop resources through the existing timed gathering and provenance systems.

### Crown Rye

Staple cereal crop.

Uses:
- food;
- milling/processing;
- cooking;
- trade.

### Field Pea

Staple pulse.

Uses:
- direct food;
- preserved food;
- cooking/processing;
- trade.

### Blue Flax Straw

Fiber crop.

Uses:
- textile processing;
- cordage;
- craft inputs;
- trade.

### Cider Apple

Orchard fruit.

Uses:
- food;
- preserves;
- cider/juice processing;
- cooking;
- trade.

### Meadow Hay

Managed fodder and bedding.

Uses:
- future animal feed;
- packing/bedding;
- fieldcraft;
- trade.

The current sink model represents these through process/craft/trade hooks until husbandry feed consumption becomes a canonical system.

### Dyer’s Woad

Higher-value specialty dye crop.

Uses:
- dye extraction;
- textile craft;
- trade.

This gives the region a modest specialty export rather than making every farm output a low-value staple.

## Economic role

Crownfields should become the principal **food and farm-material source** for Thornwall.

The core loop is:

```text
managed countryside
  -> harvest crop/fodder/fiber
  -> provenance-bearing item
  -> Crownfields Grange
  -> sell / aggregate / provision
  -> produce wagon
  -> Thornwall markets
```

This differs deliberately from:
- Elderwood: hunt/forestry;
- Slatewater: foothill field goods;
- Redstone: mining/forge economy;
- Coppergrass: steppe gathering/caravan corridor;
- Starfen: marshcraft/herbs/wetland goods.

## Settlement density

Crownfields should feel inhabited without becoming urban.

Expected dispersed sites:
- farmsteads;
- tenant hamlets;
- mills;
- barns;
- shepherd shelters;
- field shrines;
- granaries;
- bridge houses;
- seasonal labor camps;
- manor farms;
- roadside inns.

Only the Grange is currently promoted to a canonical service locality.

## Future agricultural depth

High-value follow-ons include:

1. grain milling and flour;
2. bread and preserved pulse cooking;
3. flax retting/spinning and linen;
4. cider/juice production;
5. woad dye processing;
6. livestock ownership/husbandry;
7. wool, milk, eggs, manure, hides and meat through a proper managed-animal source model;
8. crop rotation and field stewardship;
9. seasonal harvest labor;
10. pest control and field contracts;
11. market-price or supply commitments to Thornwall;
12. weather-sensitive yield and mud-road logistics if an agricultural production system is later justified.

Crownfields should remain a **working landscape**. More content should deepen agricultural decisions and Thornwall’s food economy rather than turning the region into another monster field.
