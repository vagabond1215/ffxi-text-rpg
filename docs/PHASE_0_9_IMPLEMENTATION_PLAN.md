# Phase 0.9 Implementation Plan

Phase 0.9 is **open**. This document sequences future bounded packets; it does not authorize later packets merely because they appear here.

Authoritative companions remain `AGENTS.md`, `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Current baseline

```text
Product:       0.9.100.8
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          47
Benchmark:     3
Phase:         0.9 / 0.9.100 in progress
Codename:      Regional Ingredient & Luxury Processing
```

The strategic risk remains authored-content breadth and throughput. Packets A–C are merged. Packet D is merged. Subsequent explicit work orders expanded ecology breadth, added Coppergrass Steppe, and added Slatewater Foothills/Waylodge, further exercising Pack v2 geography/ecology/service scale without introducing parallel authorities.

## Current census

Validated Data 47 pre-promotion checkpoint:

| Category | Current | Mechanics floor | Remaining |
| --- | ---: | ---: | ---: |
| Places/localities | 31 | 10 | ready |
| Named NPCs | 23 | 50 | 27 |
| Shop/service sites | 21 | 20 | ready |
| Creature definitions | 45 | 40 | ready |
| Resource sources | 41 | 40 | ready |
| Canonical items | 126 | 200 | 74 |
| Recipes/processes | 59 | 75 | 16 |
| Abilities/techniques | 41 | 100 | 59 |
| Quests/contracts | 18 | 30 | 12 |
| Recruitable companions | 1 | 4 | 3 |
| Transport services | 5 | 5 | ready |

Infrastructure coverage:

```text
routes                                   8
spell schools                            4
capability/training definitions         44
NPC schedules                           11
regional/shared packs                   16
pack-owned records                     470
pack-owned abilities/capabilities/
  schedules/companions              41/44/9/1
runtime seed NPCs                       22
runtime seed enemies                    13
```

Mechanics-scale gate remains **NOT READY**. Places, shop/service sites, creatures, resource sources, and transport services now meet their mechanics floors; companions remain the largest relative gap.

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

**Status: ecology breadth, Coppergrass, Slatewater, the Data 45 ecology/geography integrity audit, and Crownfields are merged. The Data 47 ingredient/luxury processing tranche is active on PR #394.**

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

**Status: IMPLEMENTED / FINAL PR #390 INTEGRATION IN PROGRESS.**

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

**Status: IMPLEMENTED / PRE-PROMOTION CHECK GREEN / PR #394 FINAL INTEGRATION IN PROGRESS.**

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

## Packet E — Gate A integration and census audit

**Status: QUEUED.**

After the regional tranches:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Run `npm run hardening` only if a tranche changes lifecycle-sensitive runtime ownership or the integration gate explicitly requires it.

### Gate A planning bands

These are progression bands, never permission to create filler:

| Category | Current | Gate A planning band |
| --- | ---: | ---: |
| Named NPCs | 23 | 30+ |
| Shop/service sites | 21 | 20+ |
| Creature definitions | 45 | 28+ |
| Resource sources | 41 | 28+ |
| Canonical items | 126 | 110+ |
| Recipes/processes | 59 | 40+ |
| Abilities/techniques | 41 | 40+ |
| Quests/contracts | 18 | 18+ |
| Recruitable companions | 1 | 4 only when authored characters justify them |
| Transport services | 5 | 5 only when topology justifies them |

### Qualitative Gate A requirements

Gate A fails regardless of count if the graph is weak. Require:

- intentional item sources and sinks or explicit exemptions;
- resources participating in multiple decisions where practical;
- abilities with real learning/access/use requirements and runtime coverage;
- schedules/services tied to canonical fictional time/location authority;
- reachable quests/contracts with valid references;
- NPC-backed persistent companions rather than combat vending machines;
- declared cross-pack dependencies;
- no legacy identifier leakage;
- generated scale fixtures and real packs both validating;
- census gains coming from playable connected canonical records rather than fixtures or ownership refs.

# Relative planning envelope

| Relative band | Packet | Status |
| --- | --- | --- |
| Weeks 1–2 equivalent | Governance + Pack v2 | COMPLETE |
| Weeks 3–5 equivalent | Redstone Forge-Road | COMPLETE |
| Weeks 6–8 equivalent | Elderwood Hunt-Timber | COMPLETE / MERGED |
| Weeks 9–11 equivalent | Universal Magic & Starfen Marshcraft | IMPLEMENTED + VALIDATED / PENDING LANDING |
| Week 12 equivalent | Gate A integration/census | QUEUED |

These are planning bands, not delivery promises.

# After `0.9.100`

`0.9.200` deeper adventure vertical slices, `0.9.300` advanced combat/training, `0.9.400` economy/production depth, `0.9.500` quest/social depth, and `0.9.600` playable-alpha scale remain ordered future tracks. `0.9.700`–`0.9.900` remain browser/accessibility, supported-persistence transition, and release-candidate hardening programs.

# Explicit non-goals

Do not use Gate A to introduce a second simulation clock, generic background automation, full romance, mounts/warehouses merely for breadth, supported-save migrations without a separate decision, hard benchmark thresholds, giant global content files that bypass pack ownership, or procedural filler intended only to satisfy census numbers.

The desired outcome is a production system that repeatedly creates **original, regional, cross-linked, testable gameplay** on infrastructure that is already prepared to own it.