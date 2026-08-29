# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory.

## Current contract

```text
Product:       0.9.100.13
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          52
Benchmark:     3
Codename:      Headwater Vale & Waymeet Approach
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current integration state

**Headwater Vale & Waymeet Approach is implemented on `main` and promoted to Data 52.**

Implementation freeze `aa39347a0faa754690a194d926262256e92027f1` passed Check **#1476 / run `33264692343`** with Repository Audit, **770/770 tests**, Content Census, Benchmark 3, and Benchmark Sample green.

The version/continuity synchronization followed that exact green implementation freeze. Final promoted-main Check should be recorded here once observed.

Normal low-risk work continues directly on `main`. Use a branch only when rollback/blast-radius risk materially exceeds what an ordinary GitHub revert can safely contain.

## Data 52 — Headwater Vale

Permanent profile:
- `docs/ZONE_PROFILE_HEADWATER_VALE.md`.

Geography:
- Headwater Lower Vale — danger 2 river-valley wilderness;
- Headwater Warden Lodge — danger 0 small service/work lodge and wagon limit;
- Headwater Upper Vale — danger 3 upper watershed;
- Headwater River Road — Timbercross -> Lower Vale -> lodge, walk/mount/wagon;
- Headwater Upper Trail — lodge -> Upper Vale, walk/mount only;
- no onward route from the Upper Vale is authored yet.

The missing onward edge is deliberate. Future Waymeet Marches / plateau geography must add a real route rather than treating map proximity as adjacency.

Ecology:
- 6 species/populations;
- Red Deer is deliberately encounter-backed for population hunting;
- Coldstream Trout is recovered through fishing;
- otter, fox, owl, and turtle remain ecological presence without forced aggression.

Resources/production:
- 6 gathering sources;
- 9 raw/body resources;
- 10 transformations / 10 outputs;
- alder/willow work, trout/venison preservation, deer leather/antler components, fishing creels, and bridge repair;
- every new raw/body resource has production demand;
- canonical raw utilization **89/100**;
- luxury utilization **14/14**.

Food:
- raw trout and venison explicitly require preparation and are described as capable of causing sickness when eaten raw;
- prepared stew/smoked foods are direct-ready;
- world-facing language remains practical late-medieval/fantasy knowledge.

People:
- Elin Marr — River Factor;
- Torin Ash — Warden;
- Bessa Reed — Lodge Keeper;
- 2 schedules;
- exchange, warden desk, common hearth, and riverworks yard.

Persistence:
- Game State remains 14;
- no new durable state family.

## Data 52 census

```text
places/localities                        40
named NPCs                               32
shop/service sites                       27
creature definitions                     64
resource sources                         89
canonical items                         283
recipes/processes                       164
abilities/techniques                     41
quests/contracts                         18
companions                                1
transport services                        6
routes                                   14
spell schools                             4
capabilities/training definitions        44
NPC schedules                            17
regional/shared content packs            23
pack-owned records                      859
runtime seed NPCs                        31
runtime seed enemies                     17
```

Mechanics-scale gate remains **NOT READY**:
- companions 1/4;
- abilities 41/100;
- quests 18/30;
- named NPCs 32/50.

## Macro-world authority

`docs/WORLD_MACRO_TOPOLOGY.md` remains authoritative.

Key rules:
- no global square/hex world board;
- irregular macro geographic envelopes;
- routes/passages own inter-place traversability, distance, time, hazards, and modes;
- local grids/topologies remain place-scale exploration abstractions;
- touching regions do not automatically create exits.

Headwater now realizes the first leg of:
`Timbercross -> Headwater Vale -> future plateau/saddle -> Waymeet Marches -> Waymeet`.

## Next bounded choices — not auto-authorized

Formal roadmap:
- Packet E — Gate A integration/census audit.

World geography:
- **Starfen Delta / Brackish Coast** is now the next ranked candidate;
- Gloamwood follows;
- Emberwash remains the later southern-frontier candidate.

Material culture:
- Occupational Tool Conversion remains the next ranked material-culture packet.

High-value scale gaps:
- companion breadth;
- ability/technique breadth;
- NPC/quest network density.

Do not start any of these merely because they are listed next.

## Restart order

1. `AGENTS.md`
2. this file
3. `PROJECT_PROFILE.yaml`
4. `docs/EXECUTION_PIPELINE.md`
5. `docs/WORLD_MACRO_TOPOLOGY.md`
6. `docs/ZONE_PROFILE_HEADWATER_VALE.md`
7. `docs/ITEM_CONSUMPTION_SAFETY.md`
8. `docs/ROADMAP.md`
9. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
10. relevant runtime/data/tests for the explicitly selected next unit
