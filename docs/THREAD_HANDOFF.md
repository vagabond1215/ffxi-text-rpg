# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.22
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          61
Benchmark:     3
Codename:      Wetland / Island Distribution Repair
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Wetland / Island Distribution Repair is complete and promoted on `main` as Data 61.**

Plan:
- `docs/WETLAND_ISLAND_DISTRIBUTION_REPAIR_PLAN.md`;
- plan commit `33575d6a8ae2aa202664d647558c66c91ecde025`.

Implementation:
- initial candidate `c22e6cee6f1daad1a11131dbac07978381c4f8d4`;
- measured guard synchronization / implementation freeze `48948292ea26a38d91d306d12998973c1ae35677`.

Implementation-freeze evidence:
- Check **#1626 / run `33325861973`**;
- Repository Audit PASS;
- **817/817 tests PASS**;
- Census PASS;
- Benchmark 3 PASS;
- Benchmark Sample PASS.

Promoted runtime/data:
- `d861b1a6cdeca5a470fb13fa429a7329353b6b02`;
- Product 0.9.100.22 / Data 61 / Game State 14 / Package 0.9.100.

Permanent authority synchronization:
- `40af11ebdaac8d7d3bb1cb73655849b595fee1ef`;
- PROJECT_PROFILE, README, roadmap, execution pipeline, system catalog, version roadmap, location-diversity audit, and repair plan updated for Data 61.

This handoff is the final synchronization write. The exact head after it must have hosted Check and Pages green before closure.

## Data 61 authored delta

This is repair unit **4 of 5** from `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`.

Authored additions:
- **0 new ecology families**;
- **0 new species**;
- **8 new population placements**;
- **0 new gathering sources**;
- **0 new raw resources**;
- **0 new transformations/outputs**;
- **1 population-only Pack-v2 repair graph**.

### East Starfen

New distribution:
- Mirecrest Heron;
- Reed Eel;
- Reed Crab;
- Great Mere Glasswing Dragonfly.

Existing Bellfrog, Fen Duck, and established flora/fiber/wood recovery remain intact.

Non-node description now includes sedges, rushes, floating duckweed, reed litter, mud-bank herbs, and ordinary marsh flowers.

### Reedcrown Isle

New distribution:
- Great Mere Silver Perch;
- Great Mere Glasswing Dragonfly;
- Starfen Fen Duck.

This gives Crown Grebe same-place **Lake Perch** prey-family overlap.

No new island fishery was created. Great Mere Westshore remains the authored Silver Perch catch source.

Non-node description now includes floating pondweed, low sedges, water-mint-like herbs, reed litter, and algae on basking stones.

### Starfen Lower Delta

New distribution:
- Delta Saltflat Mud Crab.

No new lower-delta crab trap was created. Brackish Coast remains the authored Saltflat Mud Crab recovery source.

Non-node description now includes freshwater reed remnants, sedges, mud-bank herbs, floating algae, and salt-tolerant transition grasses.

## Distribution vs recovery rule

Data 61 deliberately reinforces that **ecological presence does not automatically create a player recovery source**.

A species may occur in more than one compatible place while only one or a subset of those places has authored fishing, trapping, hunting, or gathering authority.

Do not add duplicate recovery nodes merely to mirror population spread.

## Data 61 census

```text
places/localities                        55
named NPCs                               47
shop/service sites                       37
creature definitions                    116
resource sources                        143
canonical items                         408
recipes/processes                       234
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        7
routes                                   25
spell schools                             4
capabilities/training definitions        44
NPC schedules                            27
regional/shared content packs            38
pack-owned records                     1304
Pack-v2 population records              129
runtime seed NPCs                        46
runtime seed enemies                     17
raw resources with production demand 145/154
luxury raws with production demand      14/14
```

Definition/resource breadth is unchanged from Data 60; only population distribution and Pack-v2 ownership breadth increased.

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 47/50.

Do not close those gaps with disconnected filler.

## Persistence decision

Game State remains **14**.

Data 61 adds only static authored population records and descriptive place text. It adds no serialized wetland state, island state, route state, recovery-right state, or player/world state family.

## Ecology repair sequence

Completed:
1. **Legacy Elderwood Ecology Repair — COMPLETE / Data 58**;
2. **Dry Upland & Saltpan Ecology Repair — COMPLETE / Data 59**;
3. **Headwater / Highland Transition Spread — COMPLETE / Data 60**;
4. **Wetland / Island Distribution Repair — COMPLETE / Data 61**.

Next ranked, **not auto-started**:
5. **Cross-biome Family Breadth**.

The audit's strongest remaining broad-family candidates are:
- small burrowing rodent / vole / ground-squirrel family;
- scoped passerine / small seed-eating songbird family;
- optional shorebird/wader or snake only where a player/economic/ecological loop justifies them.

The lower-river fish gap was already resolved in Data 58 through River Dace.

## Final synchronization validation note

The first fully synchronized Data 61 head, `e7c289c1e664091d08f4e5974a28638a0d9d2772`, passed Repository Audit but exposed two stale `describeVersion()` regression assertions in `tests/pipeline.test.js`:
- Product regex still expected `0.9.100.21`;
- codename regex still expected **Headwater / Highland Transition Repair**.

Assertion-only repair:
- `15a50ddee19010a63f786173f9602e41ff55b6cf`;
- no runtime, ecology, ownership, census, persistence, or authored-content change.

The exact head after this handoff is the final Data 61 continuity candidate and must have hosted Check + Pages green before closure.

## Other queues remain separate

Formal roadmap:
- Packet E — Gate A integration/census audit.

World edge:
1. Waymeet Inner Marches / outer crossroads approach;
2. Coppergrass extensions;
3. Drowned Vaults.

Material culture:
- Occupational Tool Conversion.

None is auto-started by completion of Data 61.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/LOCATION_FLORA_FAUNA_DIVERSITY_AUDIT.md`
5. `docs/WETLAND_ISLAND_DISTRIBUTION_REPAIR_PLAN.md`
6. `docs/EXECUTION_PIPELINE.md`
7. `docs/ROADMAP.md`
8. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
9. relevant ecology/Pack-v2/runtime/tests for the explicitly selected next unit

## Final validation requirement

The exact head after this handoff must have:
- hosted Check green;
- Pages green.

If final synchronization validation exposes only stale version/authority assertions, repair those narrowly, rewrite this handoff last, and rerun the exact head before closure.
