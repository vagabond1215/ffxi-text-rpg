# Execution Pipeline

This file is the operational continuation path for Hearth & Horizon. It exists so a fresh development thread can resume from repository state without repeating broad discovery.

## Resume sequence

When starting a new thread:

1. read `AGENTS.md`;
2. read `docs/THREAD_HANDOFF.md`;
3. read this file;
4. read `docs/DEVELOPMENT_DIRECTION.md`;
5. read `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`;
6. read `docs/ROADMAP.md`;
7. if geography/world-edge work is relevant, read `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`;
8. inspect only runtime/data/tests named by the immediate bounded action;
9. verify current `main`, relevant PR state, and latest hosted Check;
10. continue from that evidence.

Do **not** redo Phase 0.4–0.8 discovery, persistence classification, Pack-v2 infrastructure discovery, or completed regional-packet analysis unless a concrete regression requires it.

## Current contract

```text
Product:       0.9.100.5
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          44
Benchmark:     3
Codename:      World Edge Expansion & Slatewater Waylodge
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

## Current bounded unit

**Slatewater Foothills & Waylodge — PR #389.**

Base main before the tranche:

`4c1b1956e5d3126fced402188f00f1612be853f3`

That main checkpoint already includes:
- Packet D / Universal Magic & Starfen Marshcraft;
- ecology family/resource breadth expansion;
- Coppergrass Steppe.

Slatewater implementation is complete and validated before final documentation synchronization.

Validated hosted evidence:

```text
Check:              #1253 / 33182827321
Job:                98888188450
Node:               24.19.0
Repository Audit:   PASS
Tests:              724/724
Content Census:     PASS
Benchmark 3:        PASS
Benchmark Sample:   PASS
```

Because this file and other authority docs are being synchronized after that Check, a final exact-head Check is still required before merging PR #389.

## Slatewater bounded graph

```text
Timbercross Landing
  -> Crown-Forge Caravan Road
  -> Slatewater Foothills
       ecology + gathering
       cliffs/pass logic
       local field travel
  -> Slatewater Waylodge
       Eira Voss / Field Exchange
       Toren Marr / Field Guild
       Bram Pell / Stableyard
       Hearth + Bunkroom
       safe recovery
       scheduled foothill caravan
  -> Brasshaven Iron Quay
```

The original Crown-Forge through journey remains:

```text
54,000 yalms / 21,600 seconds
```

The former Timbercross→Brasshaven 36,000-yalm segment is now represented as:
- Timbercross→Waylodge: 18,000 yalms / 7,200s;
- Waylodge→Brasshaven: 18,000 yalms / 7,200s.

## Validated census

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
pack-owned abilities/capabilities/
  schedules/companions                41/44/9/1
runtime seed NPCs                        19
runtime seed enemies                     13
```

Mechanics-scale gate: **NOT READY**.

Creature definitions now meet the mechanics floor at 40/40. Companions remain the largest relative gap.

## Immediate pipeline

### A. Finish Slatewater integration

Required before landing:
1. finish continuity/document synchronization;
2. run exact-head hosted Check;
3. require Repository Audit + Test + Census + Benchmark + Benchmark Sample success;
4. verify PR #389 mergeable;
5. merge through PR;
6. verify post-merge `main` Check.

### B. Refresh final thread handoff

The repository restart contract should record the landed Slatewater state rather than leaving an active-PR fiction. If PR #389 is merged, update `docs/THREAD_HANDOFF.md` (and PROJECT_PROFILE if needed) through a bounded documentation-only follow-up so a fresh thread sees the true main checkpoint.

### C. Next work is a decision boundary

Do **not** automatically start the next numbered world-edge item.

Two valid next directions exist:

- formal roadmap: **Packet E — Gate A integration/census audit**;
- world-edge plan: **Crownfields** is the next ranked geography candidate.

A future work order must choose or otherwise explicitly authorize the next bounded unit.

## Temporary geography artifact

`docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` is intentionally temporary but currently important.

It records:
- macro-geographic interpretation;
- walkable versus restricted/transport-only boundary logic;
- all 12 ranked zone-extension candidates;
- habitation-density policy;
- exact pre-Slatewater checkpoint;
- Slatewater authorization and design rationale.

Do not delete it until its surviving decisions are incorporated into permanent cartography/world-expansion documentation.

## Data/version decision

Data 44 covers stable canonical authored additions after Data 43, including Coppergrass and Slatewater.

```text
Product       0.9.100.4 -> 0.9.100.5
Package       0.9.100   -> 0.9.100
Data          43        -> 44
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

Game State stays 14 because the tranche reuses existing:
- place/map/atlas authority;
- route/transport authority;
- safe-locality recovery;
- shop transactions;
- NPC/schedule projection;
- ecology/population/gathering;
- inventory/provenance;
- Pack-v2 ownership.

No durable mount state was added. Mount and pack-animal care at Slatewater is currently service/world content layered over existing travel/logistics authority. `SYSTEM_VERSIONS.mounts` remains planned.

## Quality gate

Ordinary landing gate:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Hosted `Check` must pass the same sequence.

Census readiness thresholds are not CI pass/fail thresholds.

## PR discipline

- use bounded feature branches;
- run hosted validation on exact PR head;
- do not merge red checks;
- avoid unrelated cleanups in an active packet;
- update continuity docs when their state would otherwise mislead a fresh thread;
- do not create a second domain authority merely to make new content convenient.

## Key files for Slatewater

```text
docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md
docs/ZONE_PROFILE_SLATEWATER_FOOTHILLS.md
js/text/data/maps.js
js/text/data/places.js
js/text/data/routeCatalog.js
js/text/data/pointsOfInterest.js
js/text/data/shopCatalogs.js
js/text/data/guildServices.js
js/text/data/seedEntities.js
js/text/data/npcSchedules.js
js/text/data/regionalEcologyExpansion.js
js/text/data/regionalResourceItems.js
js/text/data/regionalEcologyPacks.js
js/text/data/regionalContentPacks.js
tests/playerSlatewaterWaylodgeFlow.test.js
tests/transportEngine.test.js
tests/regionalEcologyBreadth.test.js
tests/contentPackValidator.test.js
tests/contentScaleGate.test.js
```
