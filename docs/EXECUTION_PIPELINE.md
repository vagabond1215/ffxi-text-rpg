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

## Latest completed bounded unit

**Regional Ingredient & Luxury Processing — COMPLETE / MERGED**

```text
PR:             #394
merge:          fb7a4ec0145c6072aac21525cb15e931125fc327
PR Check:       #1326 / 33202537431 PASS
main Check:     #1327 / 33202596523 PASS
tests:          736/736
```

No implementation unit is active.

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

Do not close gaps with disconnected filler.

## Next decision boundary

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge planning:
- Great Mere.

System/content candidates:
- population-backed hunting;
- companion breadth;
- NPC/quest/ability density;
- further connected production depth.

No next unit is auto-started.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census targets are progression evidence, not ordinary CI pass/fail thresholds.
