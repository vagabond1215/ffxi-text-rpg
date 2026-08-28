# Thread Handoff

Read this first when continuing Hearth & Horizon in a new development thread.

Repository evidence beats conversation memory. Do not repeat broad Phase 0.4–0.8, Pack-v2, or completed regional discovery when this checkpoint still matches `main`.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md` for geography/ecology work
8. `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` for future world-edge work
9. only the runtime/data/tests named by the next bounded action

## Current contract

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
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Landed baseline before active audit

Slatewater Foothills & Waylodge merged through PR #389.

```text
Slatewater merge:       edca59ac8955d999f7c80812688e7153d5aaafeb
post-merge Check:       #1265 / 33187962625
post-merge result:      PASS
```

The landed Slatewater graph contains:
- Slatewater Foothills wilderness;
- Slatewater Waylodge safe locality;
- Field Exchange / field guild / stableyard / hearth-bunkroom;
- foothill caravan;
- four foothill fauna species;
- six provenance-backed gathering resources;
- Pack-v2 ecology + lodge ownership.

## Active bounded unit

**Ecology & Geography Integrity Audit — PR #390**

Branch:

`audit/ecology-geography-consistency`

Base:

`edca59ac8955d999f7c80812688e7153d5aaafeb`

The audit has implemented:
- canonical ecology/resource duplicate validation before deduplication;
- regional ecology validation parity with foundation ecology;
- canonical regional ecology resolution through Pack-v2 catalog refs;
- resource registry validation in connected-catalog validation;
- reciprocal map/place validation;
- route stop coordinate + route-chain + service-stop validation;
- removal of five obsolete zone edges that duplicated canonical routes with conflicting travel times;
- return edges for Strider Yard, Old Gaol and the Thornwall skyferry mooring;
- reciprocal Crownward/West Elderwood gate travel;
- correction of the Rivergate→Crownward direction label;
- canonical route destinations in player-facing place descriptions;
- `tests/ecologyGeographyIntegrity.test.js`.

Pre-promotion audit heads passed:
- Check #1266 / run `33188833540`: 728/728 tests and full gate green;
- Check #1267 / run `33189086957`: full gate green after final Crownward reciprocity repair.

Data 45/version/doc synchronization followed those green checks. A final exact-head hosted Check is required before merging PR #390.

## Validated content census

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
capability/training definitions          44
NPC schedules                             9
regional/shared content packs            13
pack-owned records                      374
runtime seed NPCs                        19
runtime seed enemies                     13
```

Mechanics-scale gate remains **NOT READY**. Creature breadth is at its mechanics floor; companions remain the largest relative gap.

## Integrity findings: fixed versus deferred

### Fixed correctness defects

See `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md` for full detail.

Highest-impact fixes:
- stale direct zone edges contradicted canonical road travel times;
- three locations had no outbound path and could trap the player;
- duplicate ecology/resource IDs could be hidden by pre-validation deduplication;
- regional ecology validator was weaker than foundation validation;
- Pack-v2 regional ecology catalog references were not canonical;
- map/place references were not required to agree in both directions.

### Deferred content gaps — not broken references

Do not fill these with arbitrary records merely because the audit named them:

- Thornwall Old Gaol: no ecology/spawn/resource substrate;
- Timbercross Landing: fauna present, no gathering source;
- Redfang Camp, Deepvein Mine, Sunken Archive: no gathering/salvage nodes;
- population-backed passive/wary hunting encounters: no generic player-facing bridge yet.

The hunting gap is architectural: persistent populations do not instantiate encounters. Existing regional hunt tests manually obtain a seed enemy before defeated-body recovery. Do not make passive wildlife aggressive merely to bridge that gap.

### Reviewed and intentionally retained

Long-distance transport services may skip intermediate physical route stops. Service stop lists are ordered route subsequences, allowing express service behavior. Fare segments are passenger-service hops while duration/distance crosses the actual route geometry.

## World-edge continuation

`docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` remains temporary but authoritative planning context.

Slatewater is merged.

The next ranked world-edge candidate is **Crownfields**, but the list is planning only. It is not automatic authorization.

## Formal roadmap

Packet E — **Gate A integration/census audit** — remains the next formal roadmap gate and has not been auto-started.

After PR #390 lands, a future work order should explicitly choose:
- Packet E;
- a new geography tranche such as Crownfields;
- or a bounded ecology gameplay pass such as population-backed hunting encounters.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census shortfalls are progression evidence, not ordinary CI failures.

## If PR #390 is still open

1. inspect its exact current head;
2. require exact-head green Check;
3. merge only if green and mergeable;
4. verify post-merge `main` Check;
5. update this handoff/profile through a tiny documentation-only follow-up so they record the actual merge SHA.

## If PR #390 is already merged

1. verify `main` contains `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md` and `tests/ecologyGeographyIntegrity.test.js`;
2. verify latest main Check is green;
3. do not repeat this audit unless new geography/ecology changes require it;
4. continue only from an explicitly authorized next bounded unit.

## Governance

Do not:
- create disconnected content to chase census counts;
- create duplicate domain authorities;
- regionalize universal magic;
- assume local map edges imply world traversal;
- allow ordinary player-enterable places to become accidental dead ends;
- bump Game State merely because authored data/validation changed;
- auto-start the next roadmap or temporary-plan item.
