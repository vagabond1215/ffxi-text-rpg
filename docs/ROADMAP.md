# Hearth & Horizon Roadmap

This roadmap records the current product phase, accepted sequence, and deferred work. It is criteria-driven rather than calendar-driven.

Repository evidence beats conversation memory. For restart state, read `AGENTS.md`, `docs/THREAD_HANDOFF.md`, and `docs/EXECUTION_PIPELINE.md` before using this roadmap.

## Current baseline

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
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Completed foundation

```text
Phase 0.4–0.7                         COMPLETE
Phase 0.8 life/infrastructure         COMPLETE
Phase 0.8 exit audit                  COMPLETE
post-0.8 status/repair audit          COMPLETE
repository contract audit             COMPLETE
Content Pack Scale Contract v2        COMPLETE / MERGED
Redstone Forge-Road                    COMPLETE / MERGED
Elderwood Hunt-Timber                  COMPLETE / MERGED
Universal Magic & Starfen Marshcraft  COMPLETE / MERGED
Ecology family/resource breadth pass  COMPLETE / MERGED
Coppergrass Steppe                     COMPLETE / MERGED
```

## Active bounded unit

### Slatewater Foothills & Waylodge

**Status: implementation + hosted validation complete on PR #389; final documentation synchronization / exact-head validation / landing in progress.**

Purpose:

- fill the long geographic gap between Timbercross/Elderwood and Brasshaven/Redstone;
- preserve the existing Crown-Forge route distance/time while giving it real intermediate geography;
- establish mountain/pass boundary logic rather than treating every zone edge as automatically walkable;
- add a neutral field-guild lodge without requiring a town or city;
- connect gathering/hunting/trade travel into one usable roadside loop.

Implemented graph:

```text
Timbercross / Elderwood
  -> Crown-Forge road
  -> Slatewater Foothills
       mixed woodland
       river ravines
       upland meadow
       slate ridges
       montane scrub
  -> Slatewater Waylodge
       field exchange
       field guild
       safe hearth/bunks
       stableyard / pack-animal care
       scheduled foothill caravan
  -> Brasshaven / Redstone
```

Current route preservation:

```text
Thornwall Rivergate -> Timbercross              18,000 yalms / 7,200s
Timbercross -> Slatewater Waylodge              18,000 yalms / 7,200s
Slatewater Waylodge -> Brasshaven Iron Quay     18,000 yalms / 7,200s
FULL CROWN-FORGE                               54,000 yalms / 21,600s
```

Validated Slatewater branch census:

| Category | Current | Mechanics floor | Remaining |
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
| Recruitable companions | 1 | 4 | 3 |
| Transport services | 4 | 5 | 1 |

Supplemental coverage:

```text
routes                                   7
spell schools                            4
capability/training definitions         44
NPC schedules                            9
regional/shared content packs           13
pack-owned records                      374
pack-owned abilities/capabilities/
  schedules/companions               41/44/9/1
runtime seed NPCs                       19
runtime seed enemies                    13
```

Hosted Check #1253 / run `33182827321` / job `98888188450` passed Repository Audit, **724/724 tests**, Content Census, Benchmark 3, and Benchmark Sample before this final documentation synchronization.

Mechanics-scale gate remains **NOT READY**. Creature breadth now reaches the mechanics floor. Companions remain the largest relative gap.

## World-edge expansion plan

The current world-edge audit is intentionally preserved in:

`docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`

It is a temporary handoff/planning artifact and may be deleted once its decisions are absorbed into permanent world-cartography/regional documents.

Accepted design rule:

> A local exploration-map edge is not automatically a walkable world boundary.

Physical barriers, legal restrictions, and environmental preparation gates should remain separate concepts.

Prioritized candidate sequence recorded there:

1. Slatewater Foothills — active/implemented in PR #389.
2. Crownfields — agricultural lowlands south of Thornwall.
3. Great Mere — deep freshwater lake east/southeast of Starfen.
4. Ironspine Highlands — alpine mountains north of North Redstone.
5. Emberwash Badlands — arid transition south of South Redstone.
6. Gloamwood — deeper old-growth continuation west of Elderwood.
7. Headwater Vale — upstream river valley north of Timbercross.
8. Lower Deepvein — subterranean-only continuation.
9. Drowned Vaults — submerged continuation beyond Sunken Archive.
10. Coppergrass north/south biome-belt extensions.
11. Starfen delta/brackish coast.
12. Waymeet approach regions while preserving direct Thornwall–Waymeet as a skyferry bypass.

**This sequence is planning, not automatic authorization.** Finishing Slatewater does not automatically start Crownfields.

## Phase 0.9 Content Scale Gate A

Primary question:

> Can the repository repeatedly author and validate materially larger connected content without creating parallel authorities, bypassing stable-ID ownership, or manufacturing filler?

### Packet A — Content Pack Scale Contract v2

**COMPLETE / MERGED.**

Established Pack-v2 ownership/dependency validation while preserving existing canonical catalogs as definition authority.

### Packet B — Redstone Forge-Road

**COMPLETE / MERGED.**

Proved a connected mining → production → equipment → commitment → technique regional graph.

### Packet C — Elderwood Hunt-Timber

**COMPLETE / MERGED.**

Proved a different hunt/forestry → recovery → processing → equipment → civic-work graph.

### Packet D — Universal Magic & Starfen Marshcraft

**COMPLETE / MERGED.**

Established universal/shared magic ownership and a third regional marshcraft/community graph.

### User-authorized geography/ecology expansion

After Packet D, explicit work orders authorized:

- ecology family/resource breadth expansion;
- Coppergrass Steppe;
- world-edge planning and Slatewater Foothills/Waylodge.

These are legitimate Gate-A content-scale work because they exercise the same canonical place/route/ecology/resource/service/pack contracts at higher breadth.

### Packet E — Gate A integration/census audit

**QUEUED / NOT STARTED.**

Packet E remains the next formal roadmap gate unless a future work order explicitly prioritizes another bounded world/content tranche first.

Packet E should:
- run and inspect current scale census after all landed tranches;
- identify underrepresented connected families rather than raw count gaps only;
- inspect pack ownership/dependency density;
- inspect route/service connectivity and unreachable content;
- inspect provenance/source/sink coverage;
- inspect NPC/service/quest/companion gaps;
- identify scaling pressure or architecture debt exposed by larger content;
- produce the next bounded phase decision.

## Near-term content priorities after Slatewater

These are evidence-based gaps, not automatic tasks:

1. **companions** — 1/4 mechanics floor;
2. **service sites** — 19/20;
3. **transport services** — 4/5;
4. **resource sources** — 35/40;
5. **recipes/processes** — 29/75;
6. **named NPCs** — 20/50;
7. **quests/contracts** — 18/30;
8. **abilities/techniques** — 41/100;
9. **canonical items** — 90/200.

Counts must not be gamed. New records should arrive through coherent regional, livelihood, social, combat, or exploration graphs.

## Durable architectural constraints

Do not introduce a second authority for an existing domain.

Examples:

- one fictional simulation clock;
- canonical timed-task ownership remains domain-specific;
- inventory remains physical item authority;
- provenance remains resource-origin authority;
- existing shop engine remains trade authority;
- existing campaign recovery remains safe-rest authority;
- existing route/transport systems remain travel authority;
- existing ecology registry remains ecology authority;
- Pack v2 owns stable-ID placement/dependencies, not duplicate gameplay definitions;
- canonical magic remains character-owned/shared, not region-owned;
- mount/pack-animal care may be represented through services until a canonical mount state system is deliberately implemented.

Game State remains 14 unless a future bounded change introduces a new durable player/world fact that truly requires a compatibility boundary.

## Validation contract

Every bounded implementation intended for landing must pass:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census target shortfalls are progression evidence rather than ordinary CI failures.

## Restart rule

A new thread should not repeat Phase 0.4–0.8 or earlier Gate-A discovery if the repository checkpoint is coherent.

Read:

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` if continuing geography work
5. the relevant current zone/profile/catalog/tests only

Then verify `main` and current hosted Check state and continue the immediate bounded unit.
