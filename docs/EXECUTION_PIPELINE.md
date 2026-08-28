# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.100.7
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          46
Benchmark:     3
Codename:      Crownfields Agricultural Lowlands
```

## Active bounded unit

**PR #392 — Crownfields Agricultural Lowlands**

Pre-promotion implementation Check #1294 / run `33199542741` passed **731/731 tests**, Repository Audit, Census, Benchmark 3 and Benchmark Sample.

## Immediate integration sequence

1. finish Data 46 continuity/document synchronization;
2. run exact-head hosted Check on PR #392;
3. require the full gate green;
4. verify PR mergeable;
5. merge PR #392;
6. verify post-merge `main` Check;
7. if needed, perform a tiny docs-only handoff sync with the actual merge SHA.

## Current measured census

```text
places/localities       31
named NPCs              23
shop/service sites      21
creature definitions    45
resource sources        41
canonical items         96
recipes/processes       29
abilities/techniques    41
quests/contracts        18
companions               1
transport services       5
routes                    8
NPC schedules           11
content packs           15
pack-owned records     410
```

## Gate interpretation

Mechanics floors are now satisfied for:
- places;
- functional shop/service sites;
- creature definitions;
- resource sources;
- transport services.

The overall gate remains NOT READY because major gaps remain in:
- companions;
- recipes/processes;
- abilities/techniques;
- named NPCs;
- canonical items;
- quests/contracts.

Do not chase those counts with disconnected filler.

## Next decision boundary after Crownfields

Formal roadmap:
- Packet E — Gate A integration/census audit.

World-edge planning:
- Great Mere is the next ranked zone.

Ecology systems:
- population-backed hunting remains a strong player-loop gap.

Agricultural depth:
- milling, cooking, flax processing, livestock husbandry and crop stewardship are valid future Crownfields follow-ons, but should use existing authorities or deliberately introduce a single canonical husbandry model.

No next unit is auto-started.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```
