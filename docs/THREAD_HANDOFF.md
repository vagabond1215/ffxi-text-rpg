# Thread Handoff

Read this first when continuing Hearth & Horizon implementation in a new ChatGPT/Codex thread.

This file exists to minimize rediscovery. Repository evidence beats conversation memory.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`
9. `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` if continuing geography/world-edge work
10. only the runtime/data/tests named by the immediate bounded unit

Do not restart broad Phase 0.4–0.8, persistence, Pack-v2, or completed packet discovery unless current repository evidence contradicts this checkpoint.

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
Phase:         0.9 / 0.9.100 Content Scale Gate A
```

## Current repository state

Main before the active Slatewater tranche:

`4c1b1956e5d3126fced402188f00f1612be853f3`

That main already contains:
- Packet A — Content Pack Scale Contract v2;
- Packet B — Redstone Forge-Road;
- Packet C — Elderwood Hunt-Timber;
- Packet D — Universal Magic & Starfen Marshcraft;
- ecology family/resource breadth expansion;
- Coppergrass Steppe.

Active work:

```text
branch: feature/slatewater-foothills-waylodge
PR:     #389
state:  open / mergeable before final documentation synchronization
scope:  Slatewater Foothills + Slatewater Waylodge
```

Hosted Check #1253 / run `33182827321` / job `98888188450` passed the complete gate on head `e3e444598432c8eb391694603852a33969d23863`:

```text
Repository Audit: PASS
Tests:            724/724
Content Census:   PASS
Benchmark 3:      PASS
Benchmark Sample: PASS
Node:             24.19.0
```

This handoff is being synchronized after that run, so the final PR head must receive one more exact-head Check before merge. If a new thread starts before PR #389 lands, inspect the PR/current head rather than assuming the merge happened.

## Why Slatewater exists

The Crown-Forge Caravan Road had an established long segment between Timbercross Landing and Brasshaven but no intermediate physical landscape.

Slatewater fills that gap with a believable biome transition:

```text
Elderwood / Timbercross
  -> mixed foothill woodland
  -> river ravines
  -> upland meadow
  -> slate ridges
  -> montane scrub
  -> Redstone / Brasshaven
```

The zone is not another nation or city.

### Canonical places

**`slatewater-foothills`**
- wilderness;
- danger 3;
- 10x8 exploration grid;
- neutral;
- mixed woodland / river-cut slope / slate ridge / montane scrub transition.

**`slatewater-waylodge`**
- danger-0 travel hub / safe locality;
- neutral guild lodge;
- field exchange;
- field guild;
- hearth/bunkroom;
- stableyard / pack-animal care;
- scheduled caravan access.

### Route preservation

The original Crown-Forge total is unchanged:

```text
Thornwall Rivergate -> Timbercross              18,000 yalms / 7,200s
Timbercross -> Slatewater Waylodge              18,000 yalms / 7,200s
Slatewater Waylodge -> Brasshaven Iron Quay     18,000 yalms / 7,200s

TOTAL                                             54,000 yalms / 21,600s
```

New `service-slatewater-foothill-caravan` serves Timbercross → Waylodge → Brasshaven.

## Waylodge functional loop

The lodge is not descriptive-only.

Validated player loop:

```text
Slatewater Foothills
  -> gather provenance-bearing Serviceberry
  -> walk to Slatewater Waylodge
  -> use Eira Voss / Slatewater Field Exchange
  -> sell nearby field good for gil
  -> buy provisions
  -> use danger-0 safe-locality recovery
  -> visit stableyard / travel service
```

### Service authorities

Do not create duplicate systems.

- buy/sell: existing shop engine;
- safe sleep/recovery: existing campaign recovery / settlement service board;
- gathering: existing gathering work;
- ecology: existing canonical ecology registry;
- transport: existing route/transport engine;
- NPC availability: existing fictional-time schedules;
- pack ownership: Pack v2;
- mount/pack-animal care: currently place/POI/NPC/travel-service content only.

There is **no durable mount-condition state yet**. `SYSTEM_VERSIONS.mounts` remains planned.

## Slatewater ecology

New families/species:

- Greyback Bear / `family-bear`;
- Scree Lynx / `family-lynx`;
- Russet Grouse / `family-grouse`;
- Slatewater Ridge Eagle / `family-mountain-eagle`.

All initial species are ambient ecology records rather than automatically executable combat encounters. Promote selected fauna into hunting/combat only when body recovery, outputs, encounter balance, and downstream sinks are intentionally authored.

New resource sources/items:

Staple/working:
- Slatewater Serviceberry;
- Pitch Pine Resin;
- Slatewater White Clay;
- Mountain Thyme.

Specialty/luxury:
- Silver Lichen;
- Slatewater Blue Slate.

All use exact source/place/action provenance.

## Pack ownership

New ecology pack:

`pack-slatewater-foothills-ecology`

Owns:
- foothills place;
- 4 new families/species/populations;
- 6 gathering sources;
- 6 resource items.

New lodge pack:

`pack-slatewater-waylodge`

Owns:
- Waylodge place;
- local foothill transport service;
- Eira Voss;
- Toren Marr;
- Bram Pell;
- Eira/Toren schedules;
- Slatewater field-exchange ownership record.

Dependencies deliberately bridge shared foundation, Elderwood, Redstone, and Slatewater ecology rather than duplicating definitions.

## Validated content census

```text
Places/localities             29 / mechanics floor 10
Named NPCs                    20 / 50
Shop/service sites            19 / 20
Creature definitions          40 / 40
Resource sources              35 / 40
Canonical items               90 / 200
Recipes/processes             29 / 75
Abilities/techniques          41 / 100
Quests/contracts              18 / 30
Companions                     1 / 4
Transport services             4 / 5

Routes                           7
Spell schools                    4
Capabilities/training           44
NPC schedules                    9
Regional/shared packs           13
Pack-owned records             374
Pack-owned ability/capability/
  schedule/companion       41/44/9/1
Runtime seed NPCs               19
Runtime seed enemies            13
```

Mechanics-scale gate remains **NOT READY**.

Important interpretation:
- creature breadth now reaches the mechanics floor exactly;
- resource sources are 5 short;
- shop/service sites and transport services are each 1 short;
- companions remain the largest relative gap;
- counts are evidence, not permission to add disconnected filler.

## World-edge planning artifact

`docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` is intentionally temporary but should be retained for continuity until its decisions are absorbed into permanent world/cartography docs.

Core rule:

> A local map edge is not automatically a walkable adjacent world zone.

It distinguishes:
- open wilderness seams;
- mountain/pass barriers;
- bridge/ford/ferry river crossings;
- boat/ship-only deep water;
- subterranean-only continuations;
- flooded/diving-gated ruins;
- air-bypass routes;
- legal/reputation restrictions;
- harsh-environment preparation gates.

Ranked candidate sequence after Slatewater:

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

That ranking is **planning only**. It does not auto-authorize Crownfields or any later region.

## Formal roadmap state

Packet E — **Gate A integration/census audit** — remains queued and not started.

After Slatewater lands, the next work order should explicitly choose a bounded direction. The two obvious candidates are:

- formal Packet E integration/census audit;
- a specifically authorized next world-edge tranche, with Crownfields ranked first in the temporary plan.

Do not silently choose between them.

## Version decision

```text
Product       0.9.100.4 -> 0.9.100.5
Package       0.9.100   -> 0.9.100
Data          43        -> 44
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

Data 44 incorporates stable authored world/ecology/service additions landed after Data 43, including Coppergrass and Slatewater.

Game State remains 14 because no new durable player/world fact or authority was introduced.

## Validation contract

Ordinary hosted Check:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census scale thresholds remain progression indicators rather than normal CI failures.

## Immediate continuation instructions

If PR #389 is still open:
1. inspect PR head and latest Check;
2. require exact-head green;
3. merge only if mergeable and green;
4. verify post-merge `main` Check;
5. update this handoff/profile through a tiny docs-only follow-up if they still describe Slatewater as an active PR.

If PR #389 is already merged:
1. verify `main` contains Slatewater profile/data/tests;
2. verify latest main Check green;
3. use the validated census above unless newer repository evidence supersedes it;
4. do not re-audit old phases;
5. wait for an explicit next bounded work order.

## High-value Slatewater files

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

## Governance

Phase 0.9 uses PR-based integration and exact-head hosted validation.

Do not:
- create disconnected filler to chase census numbers;
- create a second authority for existing domains;
- regionalize canonical universal magic;
- assume every map edge is traversable;
- bump Game State merely because authored data grew;
- auto-start the next roadmap or temporary-plan item without explicit authorization.
