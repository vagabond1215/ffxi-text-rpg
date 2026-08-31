# Phase 0.9 Implementation Plan

Phase 0.9 is **open**. This document sequences future bounded packets; it does not authorize later packets merely because they appear here.

Authoritative companions remain `AGENTS.md`, `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Current baseline

```text
Product:       0.9.100.24
Package:       0.9.100
Account Save:  5
Game State:    15
Data:          62
Benchmark:     3
Phase:         0.9 / 0.9.100 complete; 0.9.200 queued
Codename:      Local Knowledge & Familiarity
```

`0.9.100 Content Scale Gate A` is complete through Packet E. The strategic risk remains connected authored breadth and player-loop depth rather than Pack-v2 throughput itself.

## Current census

Validated Data 62 checkpoint:

| Category | Current | Mechanics floor | Remaining |
| --- | ---: | ---: | ---: |
| Places/localities | 55 | 10 | ready |
| Named NPCs | 47 | 50 | 3 |
| Shop/service sites | 37 | 20 | ready |
| Creature definitions | 123 | 40 | ready |
| Resource sources | 143 | 40 | ready |
| Canonical items | 408 | 200 | ready |
| Recipes/processes | 234 | 75 | ready |
| Abilities/techniques | 41 | 100 | 59 |
| Quests/contracts | 18 | 30 | 12 |
| Recruitable companions | 1 | 4 | 3 |
| Transport services | 7 | 5 | ready |

Infrastructure coverage:

```text
routes                                  25
spell schools                            4
capability/training definitions         44
NPC schedules                           27
regional/shared packs                   39
pack-owned records                    1320
pack-owned abilities/capabilities/
  schedules/companions              41/44/27/1
runtime seed NPCs                       46
runtime seed enemies                    17
raw resources with production demand 145/154
luxury raws with production demand      14/14
```

Mechanics-scale gate remains **NOT READY**. Companions remain the largest relative gap; abilities are the largest absolute gap. These are roadmap signals, not permission to create filler.

# `0.9.100` — Content Scale Gate A

## Objective

Prove that Hearth & Horizon can repeatedly author, validate, integrate, and review **dense cross-linked regional content at materially higher volume** without creating parallel authorities, bypassing catalog rules, or manufacturing filler.

## Packet A — Content Pack Scale Contract v2

**Status: COMPLETE / MERGED.**

Pack v2 owns regional/shared placement for:

```text
places / routes / transportServices
ecologyFamilies / species / populations / gatheringSources
items / npcs / npcSchedules / shops
recipes / quests / relationships
spellSchools / capabilities / abilities / companions
```

Canonical definitions remain in their existing catalogs. `contentCatalogRegistry` bridges Pack v2 ownership to those definitions so ownership metadata does not become a second data model. Validation covers stable-ID ownership, cross-pack dependencies, dangling references, family-specific structure, legacy boundaries, and a generated 1,401-record scale fixture that is never counted as canonical gameplay breadth.

## Packet B — Redstone Forge-Road regional tranche

**Status: COMPLETE / MERGED.**

Frozen implementation/content SHA:

```text
440a77c542fcc6a6efcce7a45ca989e9068499f8
```

Hosted implementation Check `32416678697` / job `96579293377` passed Repository Audit, **707/707 tests**, Content Census, Benchmark 3, and Benchmark Sample on Node 24.19.0.

The accepted bounded graph reused existing Redstone substrate:

```text
existing Redstone iron / sunstone / Ridge Ibex
  -> existing forge / work / inventory / provenance authorities
  -> forge flux / tempered iron / rivets
  -> wearable work gear / caravan hardware
  -> provenance-qualified Brasshaven commitments
  -> character-owned Redstone techniques and spells
  -> Pack v2 child ownership
```

A first integration Check caught one real continuity regression: later Forge-Road jobs sharing Varric's discovered contact displaced his established copper commitment. The content repair preserved the old copper test unchanged and moved later orders to Mae Oris's existing scheduled Market Ring contact.

## Packet C — Elderwood Hunt-Timber

**Status: COMPLETE / MERGED.**

Packet C proved a hunt/timber/civic graph through the same Pack-v2 infrastructure without repeating Redstone's forge shape. Its frozen implementation/content SHA was `acb24b73b4894d3febab370aa279bdfd12cbd02e`.

## Packet D — Universal Magic & Starfen Marshcraft

**Status: COMPLETE / MERGED.**

Frozen gameplay/content SHA:

```text
ee81069defe59a55979bc262ea595c3c9df42f40
```

Hosted implementation evidence:

```text
Check:              33139128883
Job:                98745791538
Node:               24.19.0
Repository Audit:   PASS
Tests:              719/719 passed
Content Census:     success
Benchmark 3:        success
Benchmark Sample:   success
```

### Universal-magic rule

Canonical spells are character-owned/shared definitions. A region may offer instruction or narrative context, but it must not own the spell stable ID or make geography a use requirement. `pack-shared-foundation` owns spell schools and spells; regional packs own only regional non-spell capabilities where appropriate.

Current shared magic:

- Elemental Form: fire, earth, wind, water, lightning, ice, light, dark;
- Vital Weave: restoration;
- Ward Lore: defensive/support magic;
- Veilscript: original seal magic using existing `ninjutsu` skill;
- 33 spell capabilities / 33 executable spell abilities.

`docs/research/TALES_OF_SYMPHONIA_MAGIC_REFERENCE.md` is research-only. It preserves mechanical/taxonomic observations from an external game while canonical Hearth & Horizon names, IDs, effects, lore, and progression remain original.

### Starfen marshcraft graph

```text
existing Starfen reed fiber / Bluekelp / Marrowleaf / Bogberry / Mirecrest Heron recovery
  -> existing production / workstation / work proficiency / inventory / provenance
  -> reed cord / kelp extract / poultice / tonic / waterproof wrap / survey kit
  -> Pelu Senn + Tavi Meren + existing Mistmere contacts and schedules
  -> provenance-qualified community/research commitments
  -> Starfen Current Reading as regional field knowledge
  -> pack-starfen-marshcraft
```

Universal spells are deliberately not commitment rewards in this regional graph. The generic commitment capability-reward seam remains available for qualified character instruction, but regional spell ownership is forbidden.

Version decision:

```text
Product:      0.9.100.4
Package:      0.9.100 unchanged
Data:         43
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

## User-authorized post-Packet-D breadth/geography tranches

**Status: ecology breadth, Coppergrass, Slatewater, the Data 45 ecology/geography integrity audit, Crownfields, Data 47 processing, Great Mere Data 48, the population-backed hunting bridge, and Ironspine Data 49 are complete and merged through Data 49.**

These work orders are not replacements for Packet E. They are additional Gate-A scale evidence explicitly authorized by the user.

### Ecology family/resource breadth

Expanded missing fauna families and functional niches, distributed ecology into underused places, and added both staple and luxury resource classes with exact provenance.

### Coppergrass Steppe

Inserted a neutral temperate steppe transition into the Forge-Mere corridor while preserving the established through-road distance/time. Added steppe ecology and staple/luxury resources.

### Slatewater Foothills & Waylodge

Inserted a temperate foothill/montane transition into the Crown-Forge corridor while preserving established through-road distance/time. Added:

- Slatewater Foothills wilderness;
- Slatewater Waylodge danger-0 travel/guild locality;
- functional field exchange;
- gatherer/hunter/trader guild services;
- safe hearth/bunks through existing recovery authority;
- stableyard/pack-animal care through existing travel/service content;
- scheduled foothill caravan;
- four fauna families/species/populations;
- six gathering resources;
- two Pack-v2 ownership packs.

See:
- `docs/ZONE_PROFILE_SLATEWATER_FOOTHILLS.md`;
- `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`.

The temporary world-edge sequence is planning only and does not auto-authorize the next zone.

## Ecology & Geography Integrity Audit — Data 45

**Status: COMPLETE / MERGED through PR #390.**

This bounded repair followed the Slatewater merge and does not increase content census volume. It:
- removes stale direct travel edges that competed with canonical routes;
- repairs accidental no-exit places and ordinary gate reciprocity;
- strengthens reciprocal map/place and route/service topology validation;
- closes duplicate-ID validator blind spots;
- brings regional ecology validation to foundation parity;
- makes Pack-v2 ecology catalog references canonical across foundation + regional data;
- adds end-to-end ecology/geography integrity regression coverage.

Permanent findings and deferred gaps are in `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md`.

## Crownfields Agricultural Lowlands — Data 46

**Status: COMPLETE / MERGED through PR #392 at `738faa5813e4aca30950b0d787f1209ae9a3d917`. Post-merge main Check #1308 / run `33200236952` passed the full hosted gate.**

Crownfields adds a fourth distinct regional economic/ecological shape:

```text
managed grain / pulses / flax / orchard / hay / woad
  -> existing timed gathering + provenance
  -> Crownfields Grange produce exchange
  -> Growers' Hall + safe rest + wagon logistics
  -> Southfield Farm Road
  -> Thornwall
```

It also adds managed cattle, sheep, poultry, crop-pest, and pollinator populations without inventing a second cultivation/husbandry state authority.

Pre-promotion Check #1294 / run `33199542741` passed Repository Audit, **731/731 tests**, Census, Benchmark 3, and Benchmark Sample.

## Regional Ingredient & Luxury Processing — Data 47

**Status: COMPLETE / MERGED through PR #394 at `fb7a4ec0145c6072aac21525cb15e931125fc327`; final PR Check #1326 and post-merge main Check #1327 passed.**

This tranche converts breadth into connected depth:

```text
existing regional raw resources
  -> intermediate ingredients/components
  -> later production inputs
  -> selected finished food / textile / perfume / jewelry / decorative goods
```

Measured change:

```text
raw production utilization    15/44 -> 33/44
luxury raw utilization         0/11 -> 11/11
canonical items                  96 -> 126
recipes/processes                29 -> 59
packs                            15 -> 16
pack-owned records              410 -> 470
```

Pre-promotion Check #1311 / run `33202128019` passed Repository Audit, **736/736 tests**, Census, Benchmark 3, and Benchmark Sample.

Permanent design record: `docs/REGIONAL_INGREDIENT_LUXURY_PROCESSING.md`.

## Great Mere Freshwater Economy & Food Safety — Data 48

**Status: COMPLETE / MERGED through PR #396 at `e327181fcd1e93579f335045a817de1fdae842a5`; exact-head Check #1348 and post-merge main Check #1349 both passed with 743/743 tests and the full hosted gate.**

Great Mere adds a distinct freshwater ecology/economy shape:

```text
Starfen wetland edge
  -> walkable lake shore
  -> Merewatch fishing hamlet
  -> ferry-only Reedcrown Isle
```

Content graph:

```text
freshwater fish / crayfish / mussels
shore herbs / starch roots / rush fiber / pearl
  -> explicit raw consumption-safety state
  -> cleaning / detoxification / preservation / cooking
  -> edible rations/meals + reusable byproducts
  -> lakecraft / pearl work / trade
```

Data 48 also establishes the standing rule that food-capable raws declare whether they are directly consumable or require processing and whether the raw state carries pathogen, irritant, or toxic risk.

Measured change:

```text
places/localities              31 -> 34
named NPCs                     23 -> 26
shop/service sites             21 -> 23
creatures                      45 -> 52
resource sources               41 -> 50
canonical items               126 -> 158
recipes/processes              59 -> 81
transport services              5 -> 6
routes                           8 -> 10
packs                           16 -> 18
pack-owned records             470 -> 564
raw production utilization  33/44 -> 45/53
luxury raw utilization      11/11 -> 12/12
```

Recipes/processes now exceed the mechanics floor.

Exact PR-head Check #1348 / run `33212388143` and post-merge main Check #1349 / run `33212454122` passed Repository Audit, **743/743 tests**, Census, Benchmark 3, and Benchmark Sample.

Permanent records:
- `docs/ZONE_PROFILE_GREAT_MERE.md`;
- `docs/ITEM_CONSUMPTION_SAFETY.md`.

## Population-backed Hunting & Ironspine Highlands — Data 49

**Status: COMPLETE / MERGED. Population hunting landed through PR #400; Ironspine/Data 49 promotion landed through PR #402 at `a410eb18e6f8df2f58b965ab9697f8ae813b1c4d`. Promoted exact-head Check #1381 / run `33217086478` passed 753/753 tests and the full hosted gate.**

The enabling hunting bridge first connected persistent passive/wary/territorial populations to deliberate encounters without turning wildlife into ordinary aggro spawns. Encounter start does not consume ecology; victory consumes one population unit exactly once and existing body recovery remains authoritative.

Ironspine then exercises that bridge in alpine terrain:

```text
North Redstone
  -> wagon-capable maintained lower pass
  -> High-Pass Watch
  -> walk/mount high trail
  -> alpine meadow / scree / cliff country

persistent Snowhorn / Cliff Bear / Froststep Lynx populations
  -> deliberate hunt
  -> existing combat
  -> population depletion on victory
  -> defeated-body recovery
  -> preservation / leather / fur / field remedy / survey craft
```

Data 49 adds 3 places, 3 NPCs, 6 species/populations, 6 gathering sources, 11 new raws/body resources, 13 transformations/outputs, 2 routes, 2 schedules, and 2 packs. It raises raw production utilization from 45/53 to 56/64 and keeps luxury raw utilization complete at 13/13.

Food-safety presentation is now explicitly period-framed: internal hazard metadata remains precise, but ordinary player-facing prose describes practical outcomes and preparations such as raw game causing sickness and salting/smoking/stewing making it fit for use.

Implementation freeze `53323564ac724044ff06b1341c5466e73a34ab37`; Check #1368 / run `33215878907` and promoted exact-head Check #1381 / run `33217086478` both passed Repository Audit, **753/753 tests**, Census, Benchmark 3, and Benchmark Sample.

Permanent profile: `docs/ZONE_PROFILE_IRONSPINE_HIGHLANDS.md`.

## Packet E — Gate A integration and census audit

**Status: COMPLETE ON `main`; GATE A PASS.**

Permanent audit:
- `docs/GATE_A_INTEGRATION_CENSUS_AUDIT.md`;
- implementation freeze `81b2928611a297d765eaa64f7cedeadb5fd697ee`;
- Check #1638 / run `33332932015`: Repository Audit, **822/822 tests**, Census, Benchmark 3, and Benchmark Sample all green.

No runtime or canonical authored-data mutation was needed. Product 0.9.100.23, Data 62, Game State 14, Account Save 5, Package 0.9.100, and Benchmark 3 remain unchanged.

### Post-Gate-A prerequisite — Local Knowledge & Familiarity Foundation

**Status: COMPLETE ON `main`.**

This bounded prerequisite was implemented before any broader locality/UI expansion:
- Product 0.9.100.24;
- Game State 15;
- Data 62 unchanged;
- implementation freeze `da168ddff6cc9e3611c9b8c06165b117081ea5c0`;
- Check #1770 / run `33355620265`: Repository Audit, **823/823 tests**, Census, Benchmark 3, and Benchmark Sample green.

It adds durable layered locality knowledge, NPC identity linkage, connector familiarity, temporary guidance, staged POI presence/interaction, and deterministic fictional-time local exploration. It introduces no canonical content records, no second route graph, no second clock, no timer/listener owner, and no supported-save migration.

### Gate A planning bands at closure

These are progression bands, never permission to create filler:

| Category | Data 62 | Gate A planning band | Result |
| --- | ---: | ---: | --- |
| Named NPCs | 47 | 30+ | pass |
| Shop/service sites | 37 | 20+ | pass |
| Creature definitions | 123 | 28+ | pass |
| Resource sources | 143 | 28+ | pass |
| Canonical items | 408 | 110+ | pass |
| Recipes/processes | 234 | 40+ | pass |
| Abilities/techniques | 41 | 40+ | pass |
| Quests/contracts | 18 | 18+ | pass |
| Recruitable companions | 1 | 4 only when authored characters justify them | pass by intentional-authoring rule |
| Transport services | 7 | 5 only when topology justifies them | pass |

### Qualitative Gate A result

**PASS.** The permanent audit records evidence for:
- intentional item sources/sinks or explicit exemptions;
- connected resource use and production depth;
- real capability learning/access/use/runtime coverage;
- canonical fictional-time schedules/services;
- reference-valid, reachable commitments;
- NPC-backed companion identity;
- declared cross-pack dependencies and stable ownership;
- legacy-ID rejection;
- generated 1,401-record fixture validation separate from canonical census;
- census deduplication that excludes ownership refs/fixtures from gameplay breadth.

The later mechanics-scale gate remains **NOT READY** and is deliberately not conflated with Gate A.

# Relative planning envelope

| Relative band | Packet | Status |
| --- | --- | --- |
| Weeks 1–2 equivalent | Governance + Pack v2 | COMPLETE |
| Weeks 3–5 equivalent | Redstone Forge-Road | COMPLETE |
| Weeks 6–8 equivalent | Elderwood Hunt-Timber | COMPLETE / MERGED |
| Weeks 9–11 equivalent | Universal Magic & Starfen Marshcraft | COMPLETE / MERGED |
| Week 12 equivalent | Gate A integration/census | COMPLETE |

These are planning bands, not delivery promises.

# After `0.9.100`

`0.9.100` is complete and the Local Knowledge & Familiarity prerequisite is also complete. `0.9.200` Adventure Vertical Slices is the next formal queued track, followed by `0.9.300` advanced combat/training, `0.9.400` economy/production depth, `0.9.500` quest/social depth, and `0.9.600` playable-alpha scale. `0.9.700`–`0.9.900` remain browser/accessibility, supported-persistence transition, and release-candidate hardening programs.

# Explicit non-goals

Do not use Gate A to introduce a second simulation clock, generic background automation, full romance, mounts/warehouses merely for breadth, supported-save migrations without a separate decision, hard benchmark thresholds, giant global content files that bypass pack ownership, or procedural filler intended only to satisfy census numbers.

The desired outcome is a production system that repeatedly creates **original, regional, cross-linked, testable gameplay** on infrastructure that is already prepared to own it.