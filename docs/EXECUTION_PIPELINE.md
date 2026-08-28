# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.100.8
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          47
Benchmark:     3
Codename:      Regional Ingredient & Luxury Processing
```

## Active bounded unit

**PR #394 — Regional Ingredient & Luxury Processing**

Pre-promotion implementation Check #1311 / run `33202128019` passed **736/736 tests**, Repository Audit, Census, Benchmark 3 and Benchmark Sample.

## Immediate integration sequence

1. finish Data 47 continuity/document synchronization;
2. run exact-head hosted Check on PR #394;
3. require the full gate green;
4. merge PR #394 with expected-head protection;
5. verify post-merge `main` Check;
6. perform a docs-only handoff sync if the merge SHA/check result must be recorded;
7. await the next explicit bounded work order.

## Data 47 depth metrics

```text
raw resources with production demand     33 / 44  (75%)
luxury raw resources with demand         11 / 11 (100%)
new transformations                      30
new outputs                              30
canonical items                         126
recipes/processes                        59
regional/shared packs                    16
pack-owned records                      470
```

## Mechanics-floor status

Reached:
- places;
- shop/service sites;
- creatures;
- resource sources;
- transport services.

Still short:
- companions: 1/4;
- abilities/techniques: 41/100;
- named NPCs: 23/50;
- quests/contracts: 18/30;
- canonical items: 126/200;
- recipes/processes: 59/75.

Do not close those gaps with disconnected filler.

## Next decision boundary

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge planning:
- Great Mere.

System/content candidates:
- population-backed hunting;
- companion breadth;
- connected production depth using the eleven still-unused raw resources.

No next unit is auto-started.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
