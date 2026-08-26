# Phase 0.9 Implementation Plan

Phase 0.9 is **open**. This document sequences future bounded packets; it does not authorize later packets merely because they appear here.

Authoritative companions remain `AGENTS.md`, `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Current baseline

```text
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Phase:         0.9 / 0.9.100 in progress
Codename:      Elderwood Hunt-Timber
```

The strategic risk remains authored-content breadth and throughput. Packet A scaled supporting infrastructure first; Packet B proved forge/contract/training throughput in Redstone; Packet C now proves the same infrastructure can support a materially different hunt/timber/civic graph in Elderwood without parallel authorities.

## Current census

| Category | Current | Mechanics floor | Remaining |
| --- | ---: | ---: | ---: |
| Places/localities | 26 | 10 | ready |
| Named NPCs | 15 | 50 | 35 |
| Shop/service sites | 17 | 20 | 3 |
| Creature definitions | 16 | 40 | 24 |
| Resource sources | 13 | 40 | 27 |
| Canonical items | 62 | 200 | 138 |
| Recipes/processes | 23 | 75 | 52 |
| Abilities/techniques | 13 | 100 | 87 |
| Quests/contracts | 14 | 30 | 16 |
| Recruitable companions | 1 | 4 | 3 |
| Transport services | 3 | 5 | 2 |

Infrastructure coverage:

```text
spell schools                            3
capability/training definitions         16
NPC schedules                            5
regional/shared packs                    9
pack-owned records                     171
pack-owned abilities/capabilities/
  schedules/companions              13/16/5/1
runtime seed NPCs                       14
runtime seed enemies                    13
```

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

**Status: IMPLEMENTED + VALIDATED / PENDING FINAL PROMOTED-HEAD CHECK AND LANDING.**

Frozen implementation/content SHA:

```text
acb24b73b4894d3febab370aa279bdfd12cbd02e
```

Hosted implementation Check `32423676980` / job `96600958329` passed Repository Audit, **711/711 tests**, Content Census, Benchmark 3, and Benchmark Sample on Node 24.19.0.

The accepted bounded graph deliberately reuses existing Elderwood substrate and stresses a different regional composition:

```text
existing Barkboar recovery / Duskcap / amber resin / hardwood
  -> existing tannery / woodshop / work / inventory / provenance authorities
  -> tanned hide / bindings / resin boards + pitch
  -> forester gloves / hunter bracer / trail-repair bundles
  -> persistent Thornwall service contacts + fictional-time roadworks schedule
  -> provenance-qualified civic/community commitments
  -> character-owned Elderwood techniques/warding
  -> Pack v2 child ownership
```

Implemented content:

- four character-owned capabilities and four executable abilities;
- six downstream production outputs and six production processes;
- three existing POI people promoted to persistent NPC-backed contacts;
- Oren Vale on a canonical fictional-time 07:00–15:00 roadworks schedule;
- three provenance-qualified Thornwall commitments;
- `pack-elderwood-hunt-timber` depending on shared foundation, Elderwood opening, and Elderwood ecology breadth;
- focused end-to-end coverage for Pack v2 ownership, production/provenance, exactly-once civic resolution, schedule behavior, census growth, and Barkboar Brace execution.

No new simulation clock, direct timed-task owner, persistence family, inventory authority, progression authority, social authority, place, or companion system was introduced.

The first hosted integration run reached 711 tests with 705 passing and six failures. All six were stale count/index expectations caused by intentional content growth; the Elderwood production, civic delivery, schedule, and ability behavior already passed. The repair updated those assertions without weakening validators or gameplay behavior.

Version decision:

```text
Product:      0.9.100.3
Package:      0.9.100 unchanged
Data:         42
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

## Packet D — Starfen Marshcraft-Practical Magic

**Status: NEXT / NOT STARTED / REQUIRES NEW BOUNDED AUTHORIZATION AFTER ELDERWOOD LANDS.**

Stress wetland ecology, herbs/fungi, medicine/cooking, practical magic, training, schedules, canal/water context, and community/research contracts. Reuse existing Starfen/Mistmere roots and favor another connected graph rather than broad category dumps.

Prefer a graph such as:

```text
named people / schedules / canal and research needs
  -> wetland herbs / fungi / water-context resources
  -> medicine / cooking / marshcraft transformations
  -> practical magic and training access
  -> equipment / consumables / preparation choices
  -> community / research contracts and relationships
  -> field danger / recovery / provenance
```

A companion candidate is appropriate only if an authored person warrants recruitment; companion count is not a quota. Places should not expand merely for count because 26 already exceeds the mechanics floor.

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
| Named NPCs | 15 | 30+ |
| Shop/service sites | 17 | 20+ |
| Creature definitions | 16 | 28+ |
| Resource sources | 13 | 28+ |
| Canonical items | 62 | 110+ |
| Recipes/processes | 23 | 40+ |
| Abilities/techniques | 13 | 40+ |
| Quests/contracts | 14 | 18+ |
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
| Weeks 6–8 equivalent | Elderwood Hunt-Timber | IMPLEMENTED + VALIDATED / PENDING LANDING |
| Weeks 9–11 equivalent | Starfen Marshcraft-Practical Magic | QUEUED / NOT STARTED |
| Week 12 equivalent | Gate A integration/census | QUEUED |

These are planning bands, not delivery promises.

# After `0.9.100`

`0.9.200` deeper adventure vertical slices, `0.9.300` advanced combat/training, `0.9.400` economy/production depth, `0.9.500` quest/social depth, and `0.9.600` playable-alpha scale remain ordered future tracks. `0.9.700`–`0.9.900` remain browser/accessibility, supported-persistence transition, and release-candidate hardening programs.

# Explicit non-goals

Do not use Gate A to introduce a second simulation clock, generic background automation, full romance, mounts/warehouses merely for breadth, supported-save migrations without a separate decision, hard benchmark thresholds, giant global content files that bypass pack ownership, or procedural filler intended only to satisfy census numbers.

The desired outcome is a production system that repeatedly creates **original, regional, cross-linked, testable gameplay** on infrastructure that is already prepared to own it.