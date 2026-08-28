# Hearth & Horizon Roadmap

Milestones are criteria-driven rather than calendar-driven. Repository evidence beats conversation memory.

## Current baseline

```text
Product:       0.9.100.6
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          45
Benchmark:     3
Codename:      Ecology & Geography Integrity
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Completed foundation and content tranches

```text
Phase 0.4–0.7                         COMPLETE
Phase 0.8 life/infrastructure         COMPLETE
Phase 0.8 exit/status repair          COMPLETE
Content Pack Scale Contract v2        COMPLETE / MERGED
Redstone Forge-Road                    COMPLETE / MERGED
Elderwood Hunt-Timber                  COMPLETE / MERGED
Universal Magic & Starfen Marshcraft  COMPLETE / MERGED
Ecology family/resource breadth       COMPLETE / MERGED
Coppergrass Steppe                     COMPLETE / MERGED
Slatewater Foothills & Waylodge       COMPLETE / MERGED (#389)
```

Slatewater merge checkpoint:

`edca59ac8955d999f7c80812688e7153d5aaafeb`

Post-merge Check #1265 / run `33187962625` passed.

## Active bounded unit

### Ecology & Geography Integrity Audit

**Status: implemented; Data 45 promotion/document synchronization and final PR #390 integration in progress.**

This pass fixes integrity rather than increasing census volume.

Major repaired classes:
- competing legacy direct edges versus canonical routes;
- accidental player-trapping places;
- asymmetric ordinary gates/direction metadata;
- hidden duplicate ecology/resource IDs;
- weak regional ecology validation;
- foundation-only ecology catalog resolution;
- non-reciprocal map/place validation;
- under-validated route stop/service topology.

Permanent audit:

`docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md`

Dedicated guard:

`tests/ecologyGeographyIntegrity.test.js`

Pre-promotion audit Check #1266 passed 728/728 tests and the full hosted gate. Check #1267 also passed after the final Crownward reciprocity repair.

## Current content census

| Category | Current | Mechanics floor | Gap |
| --- | ---: | ---: | ---: |
| Places/localities | 29 | 10 | ready |
| Named NPCs | 20 | 50 | 30 |
| Shop/service sites | 19 | 20 | 1 |
| Creature definitions | 40 | 40 | ready |
| Resource sources | 35 | 40 | 5 |
| Canonical items | 90 | 200 | 110 |
| Recipes/processes | 29 | 75 | 46 |
| Abilities/techniques | 41 | 100 | 59 |
| Quests/contracts | 18 | 30 | 12 |
| Companions | 1 | 4 | 3 |
| Transport services | 4 | 5 | 1 |

Supplemental:

```text
routes                         7
spell schools                  4
capabilities                  44
NPC schedules                  9
regional/shared packs         13
pack-owned records           374
runtime seed NPCs             19
runtime seed enemies          13
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap.

## Formal Phase 0.9 sequence

### Packet A — Content Pack Scale Contract v2
**COMPLETE / MERGED.**

### Packet B — Redstone Forge-Road
**COMPLETE / MERGED.**

### Packet C — Elderwood Hunt-Timber
**COMPLETE / MERGED.**

### Packet D — Universal Magic & Starfen Marshcraft
**COMPLETE / MERGED.**

### Packet E — Gate A integration/census audit
**QUEUED / NOT STARTED.**

Packet E remains the next formal roadmap gate. User-authorized ecology/geography tranches after Packet D are additional Gate-A scale evidence; they do not silently replace Packet E.

Packet E should inspect:
- current census and connected-family gaps;
- Pack-v2 ownership/dependency density;
- route/service reachability;
- provenance/source/sink coverage;
- NPC/service/quest/companion gaps;
- scaling pressure and architecture debt;
- next bounded phase decision.

## World-edge plan

`docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` remains the temporary detailed planning authority.

Current ranked sequence after completed Slatewater starts with:
1. Crownfields;
2. Great Mere;
3. Ironspine Highlands;
4. Emberwash Badlands;
5. Gloamwood;
6. Headwater Vale;
7. Lower Deepvein;
8. Drowned Vaults;
9. Coppergrass extensions;
10. Starfen delta/coast;
11. Waymeet approaches.

This ranking is planning, not automatic authorization.

## Ecology/geography deferred gaps

From the Data 45 integrity audit:
- Thornwall Old Gaol has no ecology/resource substrate;
- Timbercross has fauna but no gathering source;
- Redfang/Deepvein/Sunken Archive lack gathering/salvage sources;
- persistent ecology populations do not yet drive player-facing passive/wary hunt encounters.

Do not solve these with disconnected filler.

A future population-backed hunting bridge is a strong bounded system candidate because it can reuse:
- canonical population authority;
- enemy encounter templates;
- defeated-body recovery;
- provenance;
without making passive wildlife aggressive.

## Durable architectural constraints

- one fictional world clock;
- one domain authority per state family;
- inventory owns physical items;
- provenance owns resource history;
- canonical ecology registry owns ecology definitions;
- Pack v2 owns stable-ID placement/dependencies, not duplicate definitions;
- maps/places/routes must cross-reference consistently;
- canonical routes must not be shadowed by contradictory direct edges;
- every player-enterable place needs an escape path unless deliberate trapping is explicitly modeled;
- universal magic remains character/shared-owned;
- Game State only changes for new durable state.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census shortfalls are progression evidence rather than ordinary CI failures.

## Restart rule

Read:
1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. this roadmap
5. the relevant dedicated audit/profile docs

Then verify current `main`/PR/Check and continue only the explicit bounded unit.
