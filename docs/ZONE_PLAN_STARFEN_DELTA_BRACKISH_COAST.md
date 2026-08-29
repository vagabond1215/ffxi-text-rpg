# Zone Plan — Starfen Delta / Brackish Coast

Status: **AUTHORIZED BOUNDED IMPLEMENTATION PLAN.**

This plan realizes the Great Mere's locked eastward drainage into the Eastern Sea without opening the Miri archipelago or a general ocean-travel system.

## 1. Geographic role

The zone is the transition:

```text
Great Mere freshwater basin
  -> lower distributary river
  -> reed-and-levee delta
  -> Tideglass Landing
  -> brackish marsh / tidal flats
  -> exposed eastern coast
  -> Eastern Sea [not walkable]
```

It is downstream from existing Starfen/Great Mere geography. It does not retroactively make Great Mere brackish.

## 2. Places

### Starfen Lower Delta

Danger 2 wilderness.

- broad lower distributaries;
- freshwater becoming weakly brackish;
- natural levees, reed islands, muddy cutbanks, drift lines;
- selective foot/mount travel only on firm levees;
- boat channels remain the dependable through-route.

### Tideglass Landing

Danger 0 small port/work locality.

Role:
- river/sea pilots;
- fishery and shellfish exchange;
- smokehouse and cookhouse;
- net/creel/rope repair;
- tide and shoal notices;
- modest salt work from natural tidepan crust;
- staging point for coastal craft.

This is not another city and not the Miri gateway metropolis.

### Starfen Brackish Coast

Danger 3 coastal wilderness.

- salt marsh;
- tidal creeks;
- mudflats;
- eelgrass;
- kelp wrack;
- shell beds;
- exposed strand and shoals.

Open sea is explicitly not walkable. No route to the Miri archipelago is authored in this tranche.

## 3. Travel contract

Three connections are planned:

1. **East Starfen Delta Levee** — East Starfen -> Lower Delta; walk/mount only.
2. **Mere-Delta Waterway** — Merewatch -> Lower Delta -> Tideglass Landing; ferry/boat authority.
3. **Tideglass Coast Track** — Tideglass Landing -> Brackish Coast; walk/mount on marked firm ground.

One scheduled local packet boat may run Merewatch <-> Tideglass Landing using the waterway.

No general `ship` mode or open-ocean route authority is introduced.

## 4. Ecology

Target species:

- Brackish Reed Eel — reuse Reed Eel family;
- Saltflat Mud Crab — reuse Crab family;
- Delta Heron — reuse Mire Heron family;
- Saltmarsh Duck — reuse Waterfowl family;
- Tide Oyster — new coastal shellfish family;
- Shoal Ray — new ray family;
- Greyback Seal — new seal family;
- Coast Gull — new gull family.

Behavior is predominantly passive/wary. None needs an encounter template for this bounded tranche.

## 5. Resource sources

Target raw resources:

1. Brackish Reed Eel — fishing;
2. Saltflat Mud Crab — trapping;
3. Tide Oyster — shellfish fishing/gathering;
4. Coast Kelp — gathering;
5. Marsh Samphire — foraging;
6. Saltmarsh Reed — gathering;
7. Tidepan Salt Crust — mineral collection/mining.

Every new raw must have an explicit production or direct-use sink. No decorative filler source is authorized.

## 6. Production loops

Planned transformations:

- clean brackish eel;
- smoke eel with regional wood/fuel;
- boil mud crab;
- shuck tide oysters into meat + shell;
- roast oyster meat;
- crush oyster shell into shell lime;
- dry coast kelp;
- refine tidepan salt crust into clean sea salt;
- weave saltmarsh reed into tide mats/basket stock;
- pickle samphire using clean salt and Crownfields vinegar.

Existing regional/common inputs should be reused where sensible rather than duplicated:
- Starfen Marsh Willow or other ordinary local fuel;
- Crownfields cider vinegar;
- hemp net/cordage components where needed.

## 7. Food-safety contract

Internal metadata stays explicit.

World-facing language remains practical fantasy-era knowledge:

- raw eel, crab, and oyster can cause sickness and require cleaning/cooking;
- smoked/boiled/roasted outputs are direct-ready;
- clean young samphire may be edible after rinsing if authored as direct food, but the preserved form remains a production sink;
- no modern microbiology language in ordinary descriptions.

## 8. Service/economy scope

Tideglass Landing should expose:

- regional exchange;
- pilot/route desk;
- cooking/smoking;
- general workshop/net repair;
- optional simple lodging/recovery fiction.

Persistent staff target: 3 NPCs, with 2 schedules.

## 9. Pack ownership

Use two Pack-v2 graphs:

- ecology pack: wilderness places, families/species/populations, gathering sources, raw resources;
- landing/production pack: Tideglass Landing, routes/service, NPCs/schedules/shop, production outputs and recipes.

Canonical catalogs remain definition authority.

## 10. Persistence/version expectation

Expected:
- Product revision bump;
- Data version bump;
- Game State remains 14 unless implementation unexpectedly introduces a new durable state family.

No such new state family is currently planned.

## 11. Explicit exclusions

This tranche does **not** implement:

- Miri archipelago;
- Miri capital;
- open-ocean long-distance shipping;
- merfolk capital/access;
- Drowned Vaults;
- generalized tides as persistent simulation state;
- weather/ocean simulation;
- new fishing/husbandry state authority.

## 12. Validation

Required focused guards:

- reciprocal world/map/route validity;
- open sea not gaining a walkable edge;
- scheduled waterway journey validity;
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
