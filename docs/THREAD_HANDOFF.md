# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory. This checkpoint is intentionally written so a new thread can resume from `main` without reconstructing the recent ecology/geography work.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/ROADMAP.md`
5. `docs/DEVELOPMENT_DIRECTION.md`
6. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
7. `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md`
8. `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` if continuing geography expansion
9. only runtime/data/tests relevant to the next bounded unit

## Current main checkpoint

```text
Product:       0.9.100.6
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          45
Benchmark:     3
Codename:      Ecology & Geography Integrity
Compatibility: pre-release-current-schema
Runtime:       Node >=24

main merge:    8a6faf63832b9443a175cc9031dd881ca1b7a2a8
PR:            #390 merged
main Check:    #1291 / 33189839043
tests:         728/728
result:        Repository Audit + Test + Census + Benchmark + Sample PASS
```

## Recently completed sequence

- PR #387: ecology family/resource breadth expansion;
- PR #388: Coppergrass Steppe;
- PR #389: Slatewater Foothills & Waylodge, merge `edca59ac8955d999f7c80812688e7153d5aaafeb`;
- PR #390: Ecology & Geography Integrity Audit, merge `8a6faf63832b9443a175cc9031dd881ca1b7a2a8`.

No implementation PR is currently pending in this handoff. The repository is awaiting the next explicitly authorized bounded unit.

## What Data 45 fixed

The integrity audit found and repaired actual defects:

1. duplicate canonical ecology IDs could be hidden by deduplication before validation;
2. duplicate canonical resource IDs had the same blind spot;
3. regional ecology validation was weaker than foundation ecology validation;
4. Pack-v2 ecology catalog resolution was foundation-only;
5. map/place relationships were not required to agree reciprocally;
6. route stop coordinates, segment order and service stop order were under-validated;
7. five legacy direct zone edges duplicated canonical route legs with conflicting travel times;
8. Strider Yard, Old Gaol and the Thornwall skyferry mooring had no outbound path;
9. Crownward/West Elderwood ordinary walk gates were asymmetric;
10. Rivergate→Crownward had an incorrect direction label.

`tests/ecologyGeographyIntegrity.test.js` now guards the connected graph.

## Current census

```text
places/localities                        29
named NPCs                               20
shop/service sites                       19
creature definitions                    40
resource sources                        35
canonical items                         90
recipes/processes                       29
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       4
routes                                    7
spell schools                             4
capabilities/training definitions        44
NPC schedules                             9
regional/shared content packs            13
pack-owned records                      374
runtime seed NPCs                        19
runtime seed enemies                     13
```

Mechanics-scale gate remains **NOT READY**. Creature definitions meet the mechanics floor at 40/40; companions remain the largest relative gap.

## Deferred findings — not repository failures

Do not rediscover or misclassify these as dangling references:

- **Thornwall Old Gaol:** real dungeon with no ecology/resource substrate yet.
- **Timbercross Landing:** fauna exists, no gathering source.
- **Redfang Camp / Deepvein Mine / Sunken Archive:** encounter ecology exists but gathering/salvage nodes are sparse or absent.
- **Population-backed hunting:** persistent ecology populations do not yet instantiate player-facing passive/wary hunt encounters.

The hunting gap is the most important ecology architecture follow-up. Existing Barkboar/Ridge Ibex/Mirecrest Heron encounter templates and body-recovery resources are valid, but tests manually obtain the enemy. A future bounded bridge should compose population authority with encounter/recovery authority rather than making passive wildlife aggressive.

## Reviewed and retained

Long-distance passenger services may skip intermediate physical route stops. Their stop list is an ordered subsequence of route stops, permitting express-service behavior. Fare segments are passenger service hops; route duration/distance still crosses all physical route segments.

This is intentional and now validator-backed.

## World-edge state

`docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` remains the temporary planning artifact.

Slatewater is merged and audited.

Next ranked geography candidate: **Crownfields**.

That ranking is not authorization.

## Formal roadmap state

Packet E — **Gate A integration/census audit** — remains queued and not started.

The next work order should explicitly choose among:
- Packet E;
- another authorized geography tranche such as Crownfields;
- a bounded ecology-gameplay pass such as population-backed hunting.

Do not silently select or combine these.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census shortfalls are progression evidence, not ordinary CI failures.

## Restart instruction

A new thread should:
1. verify `main` still includes merge `8a6faf63832b9443a175cc9031dd881ca1b7a2a8` or a newer successor;
2. verify latest hosted Check is green;
3. read the dedicated audit rather than re-running broad discovery;
4. proceed only with the explicit next bounded work order.
