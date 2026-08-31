# Slatewater Foothills — Zone Profile

## Canonical identity

- **Region:** Slatewater Foothills
- **Wilderness:** `slatewater-foothills`
- **Safe road locality:** `slatewater-waylodge`
- **Map:** `map-slatewater-foothills`
- **Political status:** neutral corridor between Thornwall and Brasshaven spheres
- **Wilderness danger:** 3
- **Primary route:** Crown-Forge Caravan Road

Slatewater Foothills occupies the formerly unrepresented long-road transition between Timbercross Landing and Brasshaven. It is not a separate nation and does not require an urban settlement. Its defining inhabited site is a guild-supported waylodge serving people who work or travel through the foothills.

## Geographic placement

The Crown-Forge road already established a 36,000-yalm / 14,400-second segment between Timbercross and Brasshaven. Slatewater now gives that distance physical geography.

```text
Elderwood / Timbercross
        |
        | mixed forest, navigable river country
        v
+------------------------------------+
|         SLATEWATER FOOTHILLS       |
|                                    |
| western mixed woodland             |
| river-cut ravines                  |
| slate shelves and upland meadow    |
| rocky montane scrub                |
| engineered road cuts / passes      |
|                       Waylodge *    |
+------------------------------------+
        |
        | drier grades / exposed stone
        v
Redstone Reach / Brasshaven
```

The old Timbercross-Brasshaven long-road leg is divided evenly:

- Timbercross Landing → Slatewater Waylodge: 18,000 yalms / 7,200 seconds;
- Slatewater Waylodge → Brasshaven Iron Quay: 18,000 yalms / 7,200 seconds.

The overall Crown-Forge through journey remains 54,000 yalms / 21,600 seconds from Thornwall Rivergate to Brasshaven Iron Quay.

## Biome

**Temperate foothill woodland grading into rocky montane scrub.**

Slatewater is a transition belt rather than a hard ecological border. The west retains more Elderwood influence: mixed hardwood, pine, berries, fungi, humid ravines, and deeper soils. Moving east and upward, slopes become stonier, pine becomes more prominent, exposed slate appears, and vegetation opens into scrub and upland meadow before Redstone's drier mineral uplands dominate.

### Terrain units

**Western mixed woodland**
- hardwood/pine mosaic;
- shaded stream cuts;
- berry brakes;
- relatively deep soils;
- easier foot travel.

**River ravines**
- cold tributaries and slate-bottomed channels;
- steep banks;
- clay exposures;
- wildlife travel corridors;
- bridge and ford bottlenecks.

**Central upland meadow**
- sunny grass/herb openings;
- grouse habitat;
- gathering grounds;
- seasonal grazing.

**Slate ridges**
- exposed blue-grey rock;
- eagle nesting faces;
- mineral and fine-building-stone opportunities;
- dangerous off-road grades.

**Eastern montane scrub**
- thinner soils;
- more wind exposure;
- dry pine and scrub;
- increasingly Redstone-like geology.

## Boundary and access logic

Slatewater is deliberately not a flat rectangular wilderness whose every edge is equally traversable.

The main Crown-Forge road follows valleys, bridges, engineered cuts, and workable passes. Wagons and caravans can use the maintained road. Broad ridge faces and cliff bands are not assumed to be wagon-traversable merely because a local map edge exists.

Current supported movement:
- Crown-Forge road: walk, mount, wagon, caravan;
- Waylodge ↔ nearby foothills: walk;
- scheduled Slatewater Foothill Caravan: Timbercross ↔ Waylodge ↔ Brasshaven.

Future side routes can distinguish:
- foot-only hunter trails;
- mount-capable ridge tracks;
- bridged river crossings;
- impassable cliff faces;
- seasonal washouts and rockfall closures.

## Slatewater Waylodge

Slatewater Waylodge is the region's primary inhabited anchor.

It is a neutral stone-and-timber road lodge maintained for practical field and caravan use rather than civic prestige.

### Primary users

- gatherers;
- hunters;
- trappers and field processors;
- traveling merchants;
- caravan crews;
- drovers;
- prospectors;
- guild field staff;
- messengers and road wardens.

### Core services

**Slatewater Field Exchange — Eira Voss**

A functional buy/sell counter. It buys ordinary sellable field goods and stocks:
- food;
- water;
- first aid;
- cutting/woodcutting/digging tools;
- travel clothing;
- locally gathered Slatewater resources.

This uses the canonical shop/selling authority, so provenance-bearing field resources can become actual trade income rather than decorative loot.

**Slatewater Field Guild — Toren Marr**

A broad field guild desk supporting:
- resource appraisal;
- route and weather guidance;
- gathering notices;
- hunting notices;
- trade/exchange information;
- fieldcraft orientation.

The guild is intentionally broader than a single craft discipline because the lodge exists to connect multiple frontier livelihoods.

**Waylodge Stableyard — Bram Pell**

Provides:
- water/feed;
- sheltered pens;
- tack and harness checks;
- mount care;
- pack-animal care;
- caravan boarding.

The current implementation represents these as canonical place/POI/NPC/travel services. It does **not** create a second mount-condition authority ahead of the planned mount system.

**Sable Renn — Slatewater Road Scout**

A persistent mobile road scout who:
- evaluates route damage, animal sign, loose slate, and caravan wear as one connected field problem;
- offers the chained `Resin for the Mile Posts` and `Silver for the Fog Marks` contracts;
- becomes recruitable only after both field proofs are resolved;
- carries earned NPC trust/respect/familiarity into companion relationship state;
- has no fixed daily Waylodge schedule after recruitment because the backing NPC follows companion travel.

Permanent slice record: `docs/ADVENTURE_VERTICAL_SLICE_A_SLATEWATER_ROAD_SCOUT.md`.

**Hearth and Bunkroom**

Provides the fiction for:
- hot meals;
- drying wet gear;
- common shelter;
- simple bunks;
- safe overnight recovery.

Actual player recovery uses the existing safe-locality campaign-recovery authority because the Waylodge is a danger-0 travel hub.

## Ecology

### Greyback Bear
- family: bear;
- habitat: mixed woodland and river ravines;
- niche: large omnivore;
- behavior: territorial, solitary;
- rarity: uncommon.

### Scree Lynx
- family: lynx;
- habitat: rocky foothill and montane scrub;
- niche: solitary mid-sized predator;
- prey relationship: grouse and other small upland fauna;
- activity: weighted toward late day/evening.

### Russet Grouse
- family: grouse;
- habitat: mixed woodland and upland meadow;
- niche: common ground bird / seed and insect consumer;
- behavior: wary coveys;
- activity: daytime.

### Slatewater Ridge Eagle
- family: mountain eagle;
- habitat: slate ridges and ravines;
- niche: aerial predator/scavenger;
- behavior: territorial pairs;
- activity: daytime.

These initial records broaden foothill ecology without forcing all wildlife into executable combat encounters. Future hunting content can promote selected species into combat/recovery opportunities when carcass outputs and balance are authored.

## Gathering resources

### Staple / working resources

**Slatewater Serviceberry**
- common food/preserve fruit;
- western woodland and sunny slopes;
- supports trail food and household trade.

**Pitch Pine Resin**
- binder, repair, waterproofing and craft input;
- pine slopes;
- ordinary field/road maintenance good.

**Slatewater White Clay**
- ceramic and construction material;
- exposed river-cut banks;
- useful to both local camps and downstream towns.

**Mountain Thyme**
- culinary and medicinal herb;
- sunny upland meadow;
- lightweight high-frequency trade good.

### Specialty / luxury resources

**Silver Lichen**
- rare shaded-cliff lichen;
- alchemical and fine-dye use;
- slower regeneration and higher gathering proficiency.

**Slatewater Blue Slate**
- attractive fine stone from exposed ridge shelves;
- masonry, decoration and fine craft;
- rarer, mining-gated material.

## Economic role

Slatewater is valuable because it is a **conversion point between field production and long-distance logistics**.

A worker can:
1. enter the foothills;
2. gather/hunt/prospect;
3. return to the Waylodge;
4. sell useful finds;
5. buy food, water, first aid, or replacement field tools;
6. rest safely;
7. stable animals;
8. continue west toward Timbercross/Thornwall or east toward Brasshaven.

That loop makes the lodge economically meaningful even without a village or city around it.

## Human geography

Permanent population should remain small.

Likely surrounding sites:
- temporary hunter camps;
- charcoal or resin camps;
- survey markers;
- road crew shelters;
- bridge houses;
- seasonal grazing camps;
- abandoned quarry cuts;
- isolated shrines;
- emergency caravan shelters.

The Waylodge is the social concentration point precisely because the surrounding landscape is too rugged and dispersed to justify dense settlement.

## Adventure Vertical Slice A

**IMPLEMENTED / Data 63 / Product 0.9.200.1.**

The road-scout slice deliberately reuses the existing Waylodge/foothills loop:
1. meet Sable at the Waylodge;
2. gather provenance-qualified Pitch Pine Resin;
3. gain enough real foraging proficiency to reach the Silver Lichen source;
4. resolve the chained second field contract;
5. recruit Sable through the existing party authority;
6. keep Sable's backing NPC synchronized with canonical route travel.

This adds character/quest/companion depth without adding a second town, duplicate road graph, or quest-only progression meter.

## Future extensions

High-value follow-ons within Slatewater include:
1. route-condition events: rockfalls, washed bridges, snow/ice or fallen timber;
2. hunting recovery for selected fauna with hides/meat/feathers;
3. local food and resin processing;
4. blue-slate masonry/fine craft;
5. additional lodge contracts for trail clearing, animal incidents, and caravan supply after the implemented road-scout trust arc;
6. field-guild reputation or notices using existing social/commitment authorities;
7. foot-only side passes and cliff topology;
8. eventual mount/pack-animal condition integration when the canonical mount system is implemented.

Slatewater should remain a rugged transition corridor with one strong service anchor, not grow into a city merely because more content is added.
