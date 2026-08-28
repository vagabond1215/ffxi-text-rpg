# Great Mere Zone Profile

## Status

Data 48 bounded world-edge tranche.

Great Mere extends the Starfen drainage system into a large freshwater lake. The region is designed as a **working freshwater landscape** rather than an empty water tile: shore ecology, fisheries, processing, preservation, lakecraft, ferry travel, and nesting-island conservation all compose existing runtime authorities.

## Geography

Canonical places:

- `great-mere-westshore` — danger-1 freshwater shore wilderness;
- `merewatch-landing` — danger-0 fishing hamlet and service landing;
- `reedcrown-isle` — danger-1 nesting/shoal island.

Canonical map:

- `map-great-mere` — Chart of the Great Mere.

Boundary rule:

- shoreline terrain is walkable where authored;
- the East Fen Shore Track joins East Starfen to Westshore and Merewatch;
- deep/open lake water is **not walkable**;
- Reedcrown Isle has no fake overland edge;
- Mistmere Reedport, Merewatch, and Reedcrown are connected by the canonical Great Mere Ferry waterway.

## Habitation

Merewatch Landing is intentionally a fishing hamlet, not another major city.

Functional sites:

- Merewatch Fishery Exchange — Essel Wren;
- Lakesmen’s Hall — Jory Tamm;
- Great Mere Ferry Landing — Nara Veil;
- Merewatch Smokehouse and Common Loft.

The hamlet reuses existing shop, guild, workstation, travel, schedule, and safe-recovery presentation authorities.

## Freshwater ecology

New families:

- Lake Perch;
- Lake Pike;
- Crayfish;
- Grebe;
- Dragonfly.

Reused canonical families:

- River Turtle;
- Freshwater Mussel.

Species/populations:

- Great Mere Silver Perch;
- Great Mere Reed Pike;
- Blueclaw Crayfish;
- Crown Grebe;
- Glasswing Dragonfly;
- Great Mere Basking Turtle;
- Cloudwater Mussel.

All are passive or wary ecology. No ordinary lake wildlife is made automatically aggressive just to create combat encounters.

## Resources and catch

Nine exact-provenance resources:

| Resource | Role | Consumption |
| --- | --- | --- |
| Great Mere Silver Perch | fish/protein | clean + cook; raw pathogen risk |
| Great Mere Reed Pike | predatory fish | clean + cook/pickle; raw pathogen risk |
| Blueclaw Crayfish | shellfish/protein | clean + cook; raw pathogen risk |
| Cloudwater Mussel | shellfish | purge + clean + cook; raw pathogen risk |
| Lake Cress | fresh herb/green | safe to eat as gathered after washing |
| Mere Arrowroot Corm | starch root | process/cook; raw irritant |
| Bitterflag Rhizome | starch root | **poisonous raw**; slice + leach + boil |
| Great Mere Lake Rush | fiber/lakecraft | non-food |
| Cloudwater Pearl | luxury/jewelry | non-food |

## Processing graph

Great Mere adds 22 transformations and 23 outputs.

### Fish and preservation

```text
Silver Perch
 -> cleaned perch fillet
 -> smoked perch ration

Reed Pike
 -> cleaned pike fillet
 + Crownfields cider vinegar + Redstone salt
 -> preservation brine
 -> pickled reed pike
```

### Shellfish

```text
Blueclaw Crayfish
 -> cleaned tail meat
 + Slatewater mountain thyme + Redstone salt
 -> thyme crayfish pot

Cloudwater Mussel
 -> mussel meat + shell
   |                |
   v                v
cress broth       shell lime
```

The two-output mussel process preserves a useful physical byproduct instead of deleting it.

### Shore starches

```text
Arrowroot Corm
 -> washed arrowroot starch
 -> griddle cake

Bitterflag Rhizome [TOXIC RAW]
 -> repeated leaching + boiling
 -> detoxified Bitterflag starch
 + Crown Rye Flour + salt
 -> fisher biscuit
```

The toxin is an authored raw-state property. The safe transformation is a normal production recipe with provenance; there is no parallel poison-food state authority.

### Lakecraft and luxury

```text
Lake Rush
 -> rush cord
 + Slatewater Pitch Pine Resin
 -> pitch-tarred net line
 -> woven fish creel

Cloudwater Pearl
 -> polished pearl
 + Redstone copper
 -> pearl-set net needle
```

### Neighboring-resource repair

Great Mere also supplies useful processing paths for previously thin nearby ingredients:

```text
Starfen Reedgrain
 -> reedgrain meal
 + Great Mere perch/cress
 -> reedgrain fishcake

Starfen Fen Mussel
 + Great Mere lake cress
 -> cooked mussel-and-cress pot
```

Slatewater Pitch Pine Resin gains a lakecraft sink through tarred net line.

## Item-consumption contract

Data 48 introduces explicit canonical consumption metadata. See:

`docs/ITEM_CONSUMPTION_SAFETY.md`

Food items no longer rely on the generic `food` tag to imply raw edibility.

## Pack-v2 ownership

- `pack-great-mere-freshwater-ecology`
  - owns Great Mere wilderness places, new ecology families, species, populations, sources, and raw resources;
  - declares dependencies for the reused turtle and mussel families.

- `pack-great-mere-merewatch`
  - owns Merewatch, Great Mere routes/ferry, staff/schedules, production outputs/processes, and fishery exchange;
  - depends on the lake ecology and existing regional processing/ecology packs used by cross-regional recipes.

## Persistence decision

Game State remains 14.

The zone adds authored places, routes, ecology, items, recipes, NPCs, schedules, service metadata, and static consumption-safety definitions. Runtime consequences reuse:

- fictional world time;
- route/transport authority;
- ecology/gathering authority;
- inventory/container authority;
- provenance;
- production/work tasks;
- work proficiency;
- workstation resolution;
- shops and recovery;
- Pack-v2 ownership.

No new durable mutable state family is introduced.
