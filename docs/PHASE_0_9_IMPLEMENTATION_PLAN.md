# Phase 0.9 Implementation Plan

Phase 0.9 is **open**. This document sequences future bounded packets; it does not authorize later packets merely because they appear here.

Authoritative companions remain `AGENTS.md`, `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Current baseline

```text
Product:       0.9.100.5
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          44
Benchmark:     3
Phase:         0.9 / 0.9.100 in progress
Codename:      Location & Area Profiles
```

Packets A–D are merged. A separately authorized supporting-data pass now gives every current place an explicit biome/demographic profile and derives settlement/region/world summaries from existing geography/ecology authority. This does not replace the queued Packet E integration/census audit.

## Current census

| Category | Current | Mechanics floor | Remaining |
| --- | ---: | ---: | ---: |
| Places/localities | 26 | 10 | ready |
| Named NPCs | 17 | 50 | 33 |
| Shop/service sites | 17 | 20 | 3 |
| Creature definitions | 16 | 40 | 24 |
| Resource sources | 13 | 40 | 27 |
| Canonical items | 68 | 200 | 132 |
| Recipes/processes | 29 | 75 | 46 |
| Abilities/techniques | 41 | 100 | 59 |
| Quests/contracts | 18 | 30 | 12 |
| Recruitable companions | 1 | 4 | 3 |
| Transport services | 3 | 5 | 2 |

Infrastructure coverage:

```text
spell schools                            4
capability/training definitions         44
NPC schedules                            7
regional/shared packs                   10
pack-owned records                     248
pack-owned abilities/capabilities/
  schedules/companions              41/44/7/1
runtime seed NPCs                       16
runtime seed enemies                    13
```

The mechanics-scale gate remains **NOT READY**. Companions are now the largest relative gap. Ability breadth has materially improved, but the remaining 59 abilities should still come from coherent training/combat/support needs rather than list-filling.

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

**Status: IMPLEMENTED + VALIDATED + PROMOTED / PENDING FINAL CHECK AND LANDING.**

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

## Supporting pass — Location & Area Profiles

**Status: IMPLEMENTED + VALIDATED + PROMOTED / PENDING LANDING.**

Frozen implementation/data SHA `ba156a416026835ccc483b8644d134a8d3d062d9` passed Check `33149570962` / job `98778174178` with **725/725 tests**, census, Benchmark 3, and Benchmark Sample.

Coverage:

```text
canonical place profiles    26
settlement aggregates        5
region aggregates            3
modeled residents       92,785
typical present        ~119,478
```

The pass intentionally exposes ecology gaps. Flora/fauna are derived from canonical source/population/spawn evidence; profiles without direct records use separately labeled regional context. Redstone currently has no canonical flora sources, so its flora profile is empty rather than invented.

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
| Named NPCs | 17 | 30+ |
| Shop/service sites | 17 | 20+ |
| Creature definitions | 16 | 28+ |
| Resource sources | 13 | 28+ |
| Canonical items | 68 | 110+ |
| Recipes/processes | 29 | 40+ |
| Abilities/techniques | 41 | 40+ |
| Quests/contracts | 18 | 18+ |
| Recruitable companions | 1 | 4 only when authored characters justify them |
| Transport services | 3 | 5 only when topology justifies them |

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