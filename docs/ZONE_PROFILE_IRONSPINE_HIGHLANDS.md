# Ironspine Highlands Zone Profile

## Status

Data 49 bounded world-edge tranche.

Ironspine extends north from North Redstone Reach into alpine/subalpine mountain country. The region is designed around **authored pass corridors, sparse habitation, persistent wildlife, high-country gathering, field processing, and survey work** rather than treating a mountain map edge as ordinary flat walking terrain.

Implementation freeze before version/document promotion:

- head: `53323564ac724044ff06b1341c5466e73a34ab37`;
- Check #1368 / run `33215878907`;
- Repository Audit: PASS;
- tests: **753/753**;
- Content Census, Benchmark 3, Benchmark Sample: PASS.

## Geography

Canonical places:

- `ironspine-lower-pass` — danger-2 subalpine pass wilderness;
- `ironspine-watchpost` — danger-0 high-pass survey lodge/watch locality;
- `ironspine-high-meadow` — danger-3 alpine meadow/scree wilderness.

Canonical map:

- `map-ironspine-highlands` — Survey of the Ironspine Highlands.

Routes:

- `route-redstone-ironspine-pass-road` — North Redstone -> Lower Pass -> High-Pass Watch; walking, mounts, and wagons;
- `route-ironspine-high-trail` — High-Pass Watch -> High Meadow; walking and mounts only.

Boundary rule:

- maintained pass corridors are traversable;
- wagons stop at the watchpost;
- the high trail is foot/mount country;
- broad cliff bands and unstable scree are not implicit exits;
- falling rock, fog, exposure, cold, scree, and whiteout are authored route hazards rather than separate geography authorities.

## Habitation

The High-Pass Watch is intentionally a small working lodge/watchpost, not another city.

Named staff:

- Vara Kell — High-Pass Survey Factor;
- Dain Rove — Ironspine Warden;
- Mara Fell — Pass Lodge Keeper.

Functional sites:

- Ironspine Survey Exchange;
- Ironspine Warden Desk;
- common hearth and sleeping space;
- sheltered animal yard marking the wagon limit.

The site supports prospectors, hunters, herders, wardens, pack animals, travelers, and survey crews through existing shop, POI, schedule, travel, recovery, and fictional-time authorities.

## Population-backed hunting

The enabling population encounter bridge landed before Ironspine.

Non-hostile encounter-backed populations can now be deliberately located without converting them into ordinary aggro spawns:

```text
persistent ecology population
  -> deliberate tracking / hunt
  -> existing enemy encounter template
  -> victory
  -> consume one population unit
  -> existing defeated-body recovery
  -> exact-provenance materials
```

Encounter start does not reduce the population. Victory consumes exactly one unit once. Defeat, retreat, or merely finding sign does not falsely deplete ecology.

Hostile creatures remain under ordinary encounter/aggro authority.

Ironspine uses this bridge for:

- Ironspine Snowhorn Ibex;
- Ironspine Cliff Bear;
- Froststep Lynx.

## Alpine ecology

Ironspine deliberately reuses existing canonical regional families instead of inventing near-duplicate taxonomy:

- Ridge Ibex;
- Bear;
- Lynx;
- Marmot;
- Mountain Eagle;
- Grouse.

Species/populations:

- Ironspine Snowhorn Ibex;
- Ironspine Cliff Bear;
- Froststep Lynx;
- Ironspine Crag Marmot;
- Whitecrest Eagle;
- Ironspine Snow Grouse.

The marmot, eagle, and grouse currently provide ecological presence without manufactured combat drops. Encounter-backed game/predators remain passive, wary, or territorial rather than being made generically aggressive.

## Gathering and hunted resources

Gathering sources:

- Stonepine Cone Grove -> Ironspine Stonepine Cone;
- Alpine Sorrel Patch -> Ironspine Alpine Sorrel;
- Frost Lichen Face -> Frost Lichen;
- Dwarf Willow Scrub -> Dwarf Willow Bark;
- Lodestone Iron Seam -> Ironspine Lodestone Ore;
- Cloud Quartz Pocket -> Cloud Quartz.

Body recovery:

- Snowhorn Ibex -> Snowhorn Hide / Fresh Snowhorn Meat;
- Cliff Bear -> Cliff Bear Hide / Bear Fat;
- Froststep Lynx -> Froststep Pelt.

All canonical raws preserve exact authored source/place/action provenance.

## Processing and economy

Ironspine adds thirteen regional transformations and thirteen outputs spanning provisions, preservation, tanning, fur work, field remedies, survey craft, and travel gear.

Key chains:

```text
Stonepine cones
  -> shelled/roasted kernels
  -> trail food

Snowhorn meat + sorrel + salt
  -> Snowhorn Sorrel Stew

Snowhorn meat + salt
  -> Salt-Smoked Snowhorn
  -> durable travel provision

Snowhorn hide + dwarf willow bark
  -> willow-tanned highland leather

Cliff bear fat
  -> rendered tallow
  + frost lichen
  -> field salve

Cliff bear hide + willow bark + Crownfields linen
  -> high-pass bearhide bedroll

Froststep pelt
  -> dressed fur lining

lodestone ore + Redstone forge flux
  -> lodestone billet
  -> balanced pointer

Cloud Quartz
  -> polished sight stone

pointer + quartz + Redstone rivets
  -> High-Pass Survey Compass

highland leather + fur lining + Crownfields linen
  -> Ironspine Weather Mantle
```

This gives every new Ironspine raw an intentional production demand rather than leaving high-country materials as disconnected collectibles.

## Food and preparation framing

The internal item-safety contract remains explicit, but world-facing language follows late-medieval/fantasy practical knowledge.

Examples:

- Stonepine cones require shelling and roasting or grinding;
- young Alpine Sorrel is known as an edible field green;
- fresh Snowhorn game is not treated as ready-to-eat: hunters and cooks know raw or poorly prepared meat can bring sickness;
- roasting, boiling, stewing, salting, and smoking are ordinary practical preparations;
- prepared stew and properly salt-smoked meat are ready food.

The internal `pathogenRisk` identifier remains useful for validation, but player-facing descriptions say things such as **“can cause sickness if eaten raw”** rather than invoking modern microbiology.

See `docs/ITEM_CONSUMPTION_SAFETY.md`.

## Data 49 census

Validated implementation-freeze census:

```text
places/localities                        37
named NPCs                               29
shop/service sites                       25
creature definitions                    58
resource sources                        56
canonical items                        182
recipes/processes                       94
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       6

routes                                  12
spell schools                            4
capability/training definitions         44
NPC schedules                           15
regional/shared content packs           20
pack-owned records                     630
runtime seed NPCs                       28
runtime seed enemies                    16
```

Raw-resource production demand is **56/64 (87.5%)**. Ironspine's new Cloud Quartz luxury raw has a real processing chain; current luxury-resource demand remains complete.

Mechanics-scale gate remains **NOT READY**. Items are now only 18 short of the mechanics floor; companions remain the largest relative gap, followed by abilities, NPC breadth, and quests.

## Durable constraints

- no second ecology population authority;
- no second hunting state registry;
- no aggressive-spawn conversion merely to make wildlife lootable;
- no implicit walking across cliffs/scree;
- route hazards remain route data rather than a second world clock or environmental simulation;
- body materials come from defeated-body recovery, not fake flora/gathering sources;
- food-capable raws keep explicit preparation metadata with period-appropriate presentation;
- Game State remains 14 because no new durable serialized state family is introduced;
- Pack v2 owns regional placement/dependencies without duplicating canonical definitions.

## Next world-edge candidate

With Ironspine complete, the next ranked geography candidate in the temporary world-edge plan is **Emberwash Badlands**, south of South Redstone Reach.

Packet E — Gate A integration/census audit — remains the next formal roadmap gate unless another bounded unit is explicitly chosen first.
