# Zone Plan — Gloamwood

Status: **AUTHORIZED BOUNDED IMPLEMENTATION PLAN.**

This plan realizes the first true old-growth barrier on the western ancestral corridor without opening the western mountain crescent, a Lethari gate city, or the Lethari ancestral heartland.

## 1. Geographic role

The zone is the transition:

```text
West Elderwood managed/old-growth margin
  -> Gloamwood Verge
  -> Oldbough Refuge
  -> Gloamwood Deep
  -> western mountain crescent [not yet authored]
  -> guarded Lethari pass/cities [not yet authored]
```

Gloamwood is a wet, older, more difficult forest than West Elderwood. It is a barrier and travel problem, not a disguised homeland settlement.

## 2. Places

### Gloamwood Verge

Danger 2 wilderness.

- old-growth transition beyond Thornwall's maintained forest;
- huge root plates, mossed trunks, wet hollows, game paths, and abandoned cutting lanes;
- the one maintained cart track remains usable, but broad forest adjacency does not imply wagon access;
- ordinary wildlife remains ecological presence rather than mandatory combat.

### Oldbough Refuge

Danger 0 small forester/refuge locality.

Role:
- boundary foresters and route notices;
- simple regional exchange;
- common hearth and drying racks;
- wood/resin/trail-repair work;
- shelter for travelers before the deep forest;
- last dependable wagon turnaround.

This is a refuge/work station, not a town, Lethari gate city, or western-pass fortress.

### Gloamwood Deep

Danger 3 wilderness.

- ancient wet forest;
- flooded gullies and blackwater pools;
- ravines, deadfall fields, root tangles, dim canopy, and mossy stone;
- travel follows marked foot/mount paths;
- no onward route to the western crescent or Lethari realm is authored in this tranche.

## 3. Travel contract

Two route corridors are planned:

1. **Oldgrowth Cart Track** — West Elderwood -> Gloamwood Verge -> Oldbough Refuge; walk/mount/wagon.
2. **Deepwood Forester Trail** — Oldbough Refuge -> Gloamwood Deep; walk/mount only.

The refuge is the wagon limit.

No route leaves Gloamwood Deep toward the western mountain crescent, a guarded pass, or the Lethari heartland.

## 4. Ecology

Target species:

- Gloam Barkboar — reuse Barkboar family;
- Deep Embercoat Fox — reuse Fox family;
- Gloam Moss Owl — reuse Owl family;
- Rain Lantern Moth — reuse Lantern Moth family;
- Rootback Newt — new old-growth amphibian family;
- Hollow Crow — new forest corvid family;
- Moss-Shell Land Snail — new forest mollusk family;
- Greywood Deer — new forest deer family.

Behavior is predominantly passive, wary, or naturally territorial. Wildlife is not made hostile merely to create loot.

No new hunting/body-recovery loop is required for this bounded pass.

## 5. Resource sources

Target raw resources:

1. Raincap Mushroom — foraging;
2. Bitterbark — gathering;
3. Ironoak Deadfall — logging;
4. Velvet Moss — gathering;
5. Nightberry — foraging;
6. Candle Resin — gathering;
7. Bog-Iron Nodule — mineral collection.

Every new raw must have an explicit production sink.

## 6. Production loops

Planned transformations:

- cook raincaps into a safe hearth dish;
- dry raincaps for travel use;
- steep bitterbark into tannin liquor;
- season ironoak deadfall into workable timber;
- dry velvet moss into tinder/packing stock;
- dry nightberries into preserved trail fruit;
- cook candle resin into weatherproof sealant;
- wash/sort bog-iron nodules into concentrate;
- combine seasoned ironoak + sealant into route-repair stakes/pegs;
- combine dry moss + bitterbark preparation into a practical field dressing/packing bundle.

Existing common/regional inputs should be reused where sensible rather than duplicated.

## 7. Food-safety contract

Internal metadata stays explicit.

World-facing language remains practical fantasy-era knowledge:

- raw Raincap Mushrooms require cooking and may cause stomach sickness/irritation if eaten raw;
- ripe Nightberries may be eaten after ordinary cleaning if authored as direct food;
- cooked/dried mushroom and dried berry outputs are direct-ready;
- descriptions avoid modern microbiology language.

## 8. Service/economy scope

Oldbough Refuge should expose:

- small regional exchange;
- forester/route desk;
- common hearth/drying support;
- wood/resin/trail-repair workshop;
- simple shelter/recovery fiction.

Persistent staff target: 3 NPCs, with 2 schedules.

## 9. Pack ownership

Use two Pack-v2 graphs:

- ecology pack: Gloamwood wilderness places, families/species/populations, gathering sources, raw resources;
- refuge/production pack: Oldbough Refuge, routes, NPCs/schedules/shop, production outputs and recipes.

Canonical catalogs remain definition authority.

## 10. Persistence/version expectation

Expected:
- Product revision bump;
- Data version bump;
- Game State remains 14 unless implementation unexpectedly introduces a new durable state family.

No such new state family is planned.

## 11. Explicit exclusions

This tranche does **not** implement:

- western mountain crescent;
- Lethari gate/pass city;
- Lethari ancestral capital or fertile-valley heartland;
- generalized magical forest navigation state;
- permanent ward/disorientation simulation;
- a new nation or political border system;
- dark-Lethari geography;
- a new hunting/body-recovery family.

## 12. Validation

Required focused guards:

- reciprocal place/map/route validity;
- wagon travel stopping at Oldbough Refuge;
- Gloamwood Deep having no onward western/Lethari route;
- ecology/source/resource exact provenance;
- food-safety completeness;
- production connectivity for every new raw;
- workstation coverage;
- Pack-v2 ownership/dependencies.

Then run:
- Repository Audit;
- full tests;
- Content Census;
- Benchmark 3;
- Benchmark Sample.
