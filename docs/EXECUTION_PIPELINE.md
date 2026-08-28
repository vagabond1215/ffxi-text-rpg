# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.100.9
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          48
Benchmark:     3
Codename:      Great Mere Freshwater Economy & Food Safety
```

## Active bounded unit

**PR #396 — Great Mere Freshwater Economy & Food Safety**

Pre-promotion repaired implementation Check #1334 / run `33209084881` passed **743/743 tests**, Repository Audit, Census, Benchmark 3 and Benchmark Sample.

## Immediate integration sequence

1. finish Data 48 version/continuity/document synchronization;
2. run exact-head hosted Check on PR #396;
3. require the full gate green;
4. merge PR #396 with expected-head protection;
5. verify post-merge `main` Check;
6. perform a tiny docs-only handoff sync if the merge SHA/check result must be recorded;
7. await the next explicit bounded work order.

## Data 48 metrics

```text
places/localities                       34
named NPCs                              26
shop/service sites                      23
creatures                               52
resource sources                        50
canonical items                        158
recipes/processes                       81
abilities/techniques                    41
quests/contracts                        18
companions                               1
transport services                       6

raw resources with production demand   45 / 53
luxury raws with production demand      12 / 12
routes                                  10
NPC schedules                           13
regional/shared packs                   18
pack-owned records                     564
```

## Standing zone-authoring rule

Every newly authored zone should, where ecologically appropriate, include:

1. plausible biome/geography;
2. common-sense flora/fauna niches;
3. populations and/or encounter/catch/recovery paths;
4. resources/drops/catches with provenance;
5. connected processing and recipes;
6. intentional economic/use sinks;
7. explicit food-consumption safety for food-capable items;
8. no conversion of passive wildlife into aggression merely to force drops.

See `docs/ITEM_CONSUMPTION_SAFETY.md`.

## Mechanics-floor status

Reached:
- places;
- shop/service sites;
- creatures;
- resource sources;
- recipes/processes;
- transport services.

Still short:
- companions: 1/4;
- abilities/techniques: 41/100;
- named NPCs: 26/50;
- quests/contracts: 18/30;
- canonical items: 158/200.

Do not close these gaps with disconnected filler.

## Next decision boundary

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge planning:
- Ironspine Highlands after Great Mere.

Strong system/content candidates:
- population-backed hunting;
- companion breadth;
- NPC/quest/ability density.

No next unit is auto-started.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
