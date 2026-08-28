# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.7
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          46
Benchmark:     3
Codename:      Crownfields Agricultural Lowlands
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

Active PR: **#392 — Crownfields agricultural lowlands**

Base main:

`9876721e218b5b256a8963221250fe4896ad8f05`

The implementation head before Data 46/version-document synchronization passed hosted Check **#1294 / run `33199542741`**:

```text
Repository Audit: PASS
Tests:            731/731
Content Census:   PASS
Benchmark 3:      PASS
Benchmark Sample: PASS
```

A final exact-head Check is still required after the Data 46 continuity updates before PR #392 merges.

## Recently completed sequence

- PR #387: ecology breadth;
- PR #388: Coppergrass Steppe;
- PR #389: Slatewater Foothills & Waylodge;
- PR #390: Ecology & Geography Integrity;
- PR #391: post-audit continuity sync;
- PR #392: Crownfields — active.

## Crownfields implementation

New canonical geography:
- `crownfields` — danger-1 managed agricultural countryside;
- `crownfields-grange` — danger-0 farm-market service hamlet;
- `map-crownfields`;
- `route-thornwall-crownfields-road` / Southfield Farm Road;
- `service-crownfields-produce-wagon`.

Grange services:
- Produce Exchange — Maelin Rook;
- Growers’ Hall — Hessa Vale;
- Produce Wagon Yard — Perrin Bale;
- Millhouse/Common Loft;
- shop trade, safe recovery, guild presentation, stabling/freight, scheduled transport.

Managed ecology:
- Crownfield Cattle;
- Whitefleece Sheep;
- Redcomb Hen;
- Hedgerow Rat;
- Orchard Honeybee.

The Orchard Honeybee reuses the canonical Bee family owned by Elderwood ecology; Crownfields declares that dependency rather than duplicating family ownership.

Agricultural resources:
- Crown Rye;
- Field Pea;
- Blue Flax Straw;
- Cider Apple;
- Meadow Hay;
- Dyer’s Woad.

All six use the existing gathering/provenance authority. Honey, wool, milk, eggs and other animal products are deliberately deferred until a proper husbandry/managed-animal source model exists.

## Validated census

```text
places/localities                        31
named NPCs                               23
shop/service sites                       21
creature definitions                    45
resource sources                        41
canonical items                         96
recipes/processes                       29
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       5

routes                                    8
spell schools                             4
capabilities/training definitions        44
NPC schedules                            11
regional/shared content packs            15
pack-owned records                      410
runtime seed NPCs                        22
runtime seed enemies                     13
```

Mechanics floors now reached:
- places;
- shop/service sites;
- creatures;
- resource sources;
- transport services.

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap; recipes, abilities, NPC breadth, items and quests are also materially short.

## Geography planning

`docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` remains the temporary world-edge plan.

Slatewater is merged/audited. Crownfields is now the active/implemented second zone.

Next ranked zone after Crownfields: **Great Mere**.

That ranking is planning only and does not auto-authorize Great Mere.

## Formal roadmap

Packet E — **Gate A integration/census audit** — remains queued and not started.

After Crownfields lands, the next work order should explicitly choose among:
- Packet E;
- Great Mere or another authorized geography tranche;
- population-backed hunting encounter integration;
- another bounded content-depth tranche aimed at the remaining scale gaps.

## Restart order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/ROADMAP.md`
5. `docs/ZONE_PROFILE_CROWNFIELDS.md`
6. `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md`
7. `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` if geography work is relevant
8. verify current `main`/PR/Check state

Do not redo earlier phase discovery unless repository evidence contradicts this checkpoint.
