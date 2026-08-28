# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.9
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          48
Benchmark:     3
Codename:      Great Mere Freshwater Economy & Food Safety
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

Active PR: **#396 — Great Mere freshwater economy and food safety metadata**

Base main:

`77e5ac0bce738be5b8ba65a8c3786ac0a98ae7dd`

The repaired implementation head before Data 48/version-document synchronization passed hosted Check **#1334 / run `33209084881`**:

```text
Repository Audit: PASS
Tests:            743/743
Content Census:   PASS
Benchmark 3:      PASS
Benchmark Sample: PASS
```

A final exact-head Check is required after Data 48 continuity synchronization before PR #396 merges.

## Great Mere implementation

Geography:
- `great-mere-westshore` — danger-1 freshwater shore;
- `merewatch-landing` — danger-0 fishing hamlet;
- `reedcrown-isle` — boat-only nesting/shoal island;
- `map-great-mere`;
- East Fen Shore Track;
- Reedport-Mere Waterway;
- Great Mere Ferry.

Physical boundary rule:
- shore travel is authored;
- open/deep water is not walkable;
- Reedcrown has no overland connection.

Ecology:
- five new families: Lake Perch, Lake Pike, Crayfish, Grebe, Dragonfly;
- seven Great Mere species/populations, reusing canonical turtle and freshwater-mussel families where appropriate;
- all ordinary wildlife remains passive/wary rather than being made aggressive for drops;
- nine freshwater/shoreside sources and nine exact-provenance raw resources.

Merewatch:
- Essel Wren — fishery factor;
- Jory Tamm — Lakesmen’s Hall steward;
- Nara Veil — ferrymaster;
- fishery exchange, lakesmen’s hall, ferry landing, smokehouse/common loft;
- two fictional-time schedules.

## Food safety contract

Data 48 adds explicit canonical item consumption metadata.

Permanent authority:

`docs/ITEM_CONSUMPTION_SAFETY.md`

Modes:
- direct;
- processRequired;
- nonFood.

Hazards:
- none;
- pathogenRisk;
- rawIrritant;
- rawToxic.

Reference example:
- Bitterflag Rhizome is `processRequired/rawToxic`;
- it has no direct consume sink;
- it must be sliced, leached, and boiled;
- its safe production path creates detoxified starch, then a cooked fisher biscuit.

The carried-item/search information surface now exposes the safety label.

## Great Mere processing

22 transformations / 23 outputs include:
- fish cleaning, smoking, brining, and pickling;
- crayfish and mussel cleaning/cooking;
- mussel shell byproduct -> shell lime;
- arrowroot starch/cakes;
- toxic Bitterflag -> detoxified starch -> fisher biscuits;
- rush cord -> pitch-tarred net line -> fish creel;
- pearl polishing -> fine net needle;
- Starfen Reedgrain meal/fishcake;
- Starfen Fen Mussel cooked use.

Raw-resource production utilization is now **45/53 (~85%)**.
Current luxury raws are **12/12** used by production.

## Current census

```text
places/localities                        34
named NPCs                               26
shop/service sites                       23
creature definitions                    52
resource sources                        50
canonical items                        158
recipes/processes                       81
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       6

routes                                   10
spell schools                             4
capabilities/training definitions        44
NPC schedules                            13
regional/shared content packs            18
pack-owned records                      564
runtime seed NPCs                        25
runtime seed enemies                     13
```

Mechanics floors now reached:
- places;
- shop/service sites;
- creatures;
- resource sources;
- **recipes/processes**;
- transport services.

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap. Abilities, NPC breadth, quests, and items remain short.

## Next decision boundary after Great Mere

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge planning:
- Ironspine Highlands becomes the next ranked geography candidate after Great Mere.

System/content:
- population-backed hunting remains a strong separate candidate;
- companion/NPC/quest/ability breadth remain major scale gaps.

None is auto-started.

## Restart order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/ZONE_PROFILE_GREAT_MERE.md`
5. `docs/ITEM_CONSUMPTION_SAFETY.md`
6. `docs/ROADMAP.md`
7. relevant runtime/data/tests for the explicitly selected next unit

Do not redo broad discovery unless repository evidence contradicts this checkpoint.
