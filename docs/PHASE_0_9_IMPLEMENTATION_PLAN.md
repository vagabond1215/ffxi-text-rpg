# Phase 0.9 Implementation Plan

Phase 0.9 is **open**. This document sequences future bounded packets; it does not authorize later packets merely because they appear here.

Authoritative companions remain `AGENTS.md`, `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Current baseline

```text
Product:       0.9.100.2
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          41
Benchmark:     3
Phase:         0.9 / 0.9.100 in progress
Codename:      Redstone Forge-Road
```

The strategic risk remains authored-content breadth and throughput. Packet A scaled supporting infrastructure first; Packet B now proves that infrastructure with one real connected Redstone regional tranche.

## Current census

| Category | Current | Mechanics floor | Remaining |
| --- | ---: | ---: | ---: |
| Places/localities | 26 | 10 | ready |
| Named NPCs | 12 | 50 | 38 |
| Shop/service sites | 17 | 20 | 3 |
| Creature definitions | 16 | 40 | 24 |
| Resource sources | 13 | 40 | 27 |
| Canonical items | 56 | 200 | 144 |
| Recipes/processes | 17 | 75 | 58 |
| Abilities/techniques | 9 | 100 | 91 |
| Quests/contracts | 11 | 30 | 19 |
| Recruitable companions | 1 | 4 | 3 |
| Transport services | 3 | 5 | 2 |

Infrastructure coverage:

```text
spell schools                            3
capability/training definitions         12
NPC schedules                            4
regional/shared packs                    8
pack-owned records                     140
pack-owned abilities/capabilities/
  schedules/companions                9/12/4/1
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

**Status: IMPLEMENTED + VALIDATED / PENDING FINAL LANDING.**

Frozen implementation/content SHA:

```text
440a77c542fcc6a6efcce7a45ca989e9068499f8
```

Hosted implementation Check `32416678697` / job `96579293377` passed Repository Audit, **707/707 tests**, Content Census, Benchmark 3, and Benchmark Sample on Node 24.19.0.

The accepted bounded graph deliberately reused existing Redstone substrate instead of chasing the representative planning band as a quota:

```text
existing Redstone iron / sunstone / Ridge Ibex
  -> existing forge / work / inventory / provenance authorities
  -> forge flux / tempered iron / rivets
  -> wearable work gear / caravan hardware
  -> provenance-qualified Brasshaven commitments
  -> character-owned Redstone techniques and spells
  -> Pack v2 child ownership
```

Implemented content:

- four character-owned capabilities and four executable abilities;
- six additional downstream forge outputs and six additional forge processes;
- three provenance-qualified Brasshaven commitments;
- `pack-redstone-forge-road` depending on shared foundation, Redstone opening, and Redstone ecology breadth;
- focused end-to-end coverage for ownership, production/provenance, exactly-once contract resolution, and real ability execution.

No new simulation clock, direct timed-task owner, persistence family, inventory authority, progression authority, or social authority was introduced.

A first integration Check caught one real continuity regression: later Forge-Road jobs sharing Varric's discovered contact displaced his established copper commitment. The content repair preserved the old copper test unchanged and moved later orders to Mae Oris's existing scheduled Market Ring contact.

Version decision:

```text
Product:      0.9.100.2
Package:      0.9.100 unchanged
Data:         41
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

## Packet C — Elderwood Hunt-Timber

**Status: NEXT / NOT STARTED / REQUIRES NEW BOUNDED AUTHORIZATION AFTER REDSTONE LANDS.**

Use the existing Elderwood opening/ecology roots and stress hunting, forestry, body recovery, food/material chains, practical field techniques, home supply, relationships, and dangerous travel.

Prefer a connected graph such as:

```text
named people / schedules / local services
  -> hunt + forestry needs
  -> creature recovery / timber-resin resources
  -> hide / wood / resin transformations
  -> equipment / consumables / repair/home inputs
  -> practical techniques / capability access
  -> contracts / trade / relationship consequences
  -> field danger / recovery / provenance
```

A companion candidate is appropriate only if the authored person warrants recruitment; companion count is not a quota. Places should not expand merely for count because 26 already exceeds the mechanics floor.

## Packet D — Starfen Marshcraft-Practical Magic

**Status: QUEUED.**

Stress wetland ecology, herbs/fungi, medicine/cooking, practical magic, training, schedules, canal/water context, and community/research contracts. This remains a strong later tranche for ability breadth after Redstone proves the production workflow and Elderwood tests hunt/timber recovery chains.

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

Run `npm run hardening` only if a tranche changes lifecycle-sensitive runtime ownership.

### Gate A planning bands

These are progression bands, never permission to create filler:

| Category | Current | Gate A planning band |
| --- | ---: | ---: |
| Named NPCs | 12 | 30+ |
| Shop/service sites | 17 | 20+ |
| Creature definitions | 16 | 28+ |
| Resource sources | 13 | 28+ |
| Canonical items | 56 | 110+ |
| Recipes/processes | 17 | 40+ |
| Abilities/techniques | 9 | 40+ |
| Quests/contracts | 11 | 18+ |
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
| Weeks 3–5 equivalent | Redstone Forge-Road | IMPLEMENTED + VALIDATED / PENDING LANDING |
| Weeks 6–8 equivalent | Elderwood Hunt-Timber | NOT STARTED |
| Weeks 9–11 equivalent | Starfen Marshcraft-Practical Magic | QUEUED |
| Week 12 equivalent | Gate A integration/census | QUEUED |

These are planning bands, not delivery promises.

# After `0.9.100`

`0.9.200` deeper adventure vertical slices, `0.9.300` advanced combat/training, `0.9.400` economy/production depth, `0.9.500` quest/social depth, and `0.9.600` playable-alpha scale remain ordered future tracks. `0.9.700`–`0.9.900` remain browser/accessibility, supported-persistence transition, and release-candidate hardening programs.

# Explicit non-goals

Do not use Gate A to introduce a second simulation clock, generic background automation, full romance, mounts/warehouses merely for breadth, supported-save migrations without a separate decision, hard benchmark thresholds, giant global content files that bypass pack ownership, or procedural filler intended only to satisfy census numbers.

The desired outcome is a production system that repeatedly creates **original, regional, cross-linked, testable gameplay** on infrastructure that is already prepared to own it.