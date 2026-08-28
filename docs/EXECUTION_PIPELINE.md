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

## Current product state

**Crownfields Agricultural Lowlands is merged through PR #392 at `738faa5813e4aca30950b0d787f1209ae9a3d917`.**

Final promoted PR Check #1307 / run `33200172961` passed. Post-merge main Check #1308 / run `33200236952` is pending at the time of this docs branch.

Pre-promotion implementation Check #1294 / run `33199542741` passed **731/731 tests**, Repository Audit, Census, Benchmark 3 and Benchmark Sample.

## Immediate integration sequence

1. require post-merge main Check #1308 to pass;
2. mark this continuity branch with that green result;
3. open/validate/merge the docs-only handoff PR;
4. verify final main Check;
5. await the next explicit bounded work order.

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

## Next decision boundary

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
