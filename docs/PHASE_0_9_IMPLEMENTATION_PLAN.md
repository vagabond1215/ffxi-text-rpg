# Phase 0.9 Implementation Plan

Phase 0.9 is now **open**. This document sequences future bounded packets; it does not authorize later packets merely because they appear here.

Authoritative companions remain `AGENTS.md`, `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Current baseline

```text
Product:       0.9.100.1
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          40
Benchmark:     3
Phase:         0.9 / 0.9.100 in progress
Codename:      Content Pack Scale Contract v2
```

The strategic risk is authored-content breadth and throughput, but the first Phase 0.9 implementation packet deliberately scaled the supporting infrastructure **before** adding volume.

## Current census

| Category | Current | Mechanics floor | Remaining |
| --- | ---: | ---: | ---: |
| Places/localities | 26 | 10 | ready |
| Named NPCs | 12 | 50 | 38 |
| Shop/service sites | 17 | 20 | 3 |
| Creature definitions | 16 | 40 | 24 |
| Resource sources | 13 | 40 | 27 |
| Canonical items | 50 | 200 | 150 |
| Recipes/processes | 11 | 75 | 64 |
| Abilities/techniques | 5 | 100 | 95 |
| Quests/contracts | 8 | 30 | 22 |
| Recruitable companions | 1 | 4 | 3 |
| Transport services | 3 | 5 | 2 |

Packet A intentionally left these gameplay counts unchanged.

Infrastructure coverage now records separately:

```text
spell schools                            3
capability/training definitions          8
NPC schedules                            4
regional/shared packs                    7
pack-owned records                     115
pack-owned abilities/capabilities/
  schedules/companions                 5/8/4/1
```

# `0.9.100` — Content Scale Gate A

## Objective

Prove that Hearth & Horizon can repeatedly author, validate, integrate, and review **dense cross-linked regional content at materially higher volume** without creating parallel authorities, bypassing catalog rules, or manufacturing filler.

## Packet A — Content Pack Scale Contract v2

**Status: COMPLETE.**

### Implemented decisions

The pack contract now owns regional/shared placement for:

```text
places / routes / transportServices
ecologyFamilies / species / populations / gatheringSources
items / npcs / npcSchedules / shops
recipes / quests / relationships
spellSchools / capabilities / abilities / companions
```

Canonical definitions remain in their existing catalogs. `contentCatalogRegistry` bridges Pack v2 ownership to those definitions so ownership metadata does not become a second data model.

Catalog bridges cover:

- resource, production, and equipment items;
- production recipes/processes;
- commitment definitions used as quest/contract catalog records;
- seed NPCs;
- route, transport and ecology catalogs;
- spell schools, capabilities and executable abilities;
- NPC schedules;
- companions.

### Validator upgrades

Pack v2 validation now covers:

- stable-ID ownership and cross-collection collision detection;
- explicit cross-pack dependency enforcement;
- missing catalog refs and dangling inline references;
- ability -> capability and spell-school references;
- NPC schedule -> NPC/place references plus fictional-day structural validation;
- companion -> NPC/home/recruitment-place references and approach/tactics structure;
- existing topology, source/sink, recipe, quest, relationship and legacy-leak rules.

POI ownership was **not** duplicated merely to support schedules. Schedule POI IDs retain their existing transitional authority while schedule structure and NPC/place ownership are validated.

### Scale proof

The generated Pack v2 fixture validates:

```text
1 place
200 items
200 recipes
200 NPCs
200 NPC schedules
200 capabilities
200 abilities
200 companions
-----------------
1,401 owned records
```

These records are test fixtures only and are never counted as canonical gameplay breadth.

### CI/census upgrade

Ordinary local/hosted `Check` now executes:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census shortfalls remain informational; Check proves census/catalog integration executes successfully, not that arbitrary volume quotas have been met.

### Version decision

```text
Product:      0.9.100.1
Package:      0.9.100
Data:         40
Game State:   14 unchanged
Account Save: 5 unchanged
Benchmark:    3 unchanged
```

Data advances because pack ownership/stable-ID validation changed. Game State remains 14 because no new durable runtime authority was introduced.

## Packet B — Redstone Forge-Road regional tranche

**Status: NOT STARTED. A new bounded authorization is required.**

Use `pack-redstone-opening` as the regional root. The tranche should build one playable graph rather than independent category batches:

```text
named people / mentors / service contacts
  -> schedules / training / contracts
  -> Redstone creatures + mineral/resource sources
  -> raw materials
  -> processing / recipes
  -> tools, equipment, consumables
  -> techniques / capability access
  -> shops / wages / trade / transport
  -> field danger / recovery / provenance
```

Representative planning band, not quota:

- 4–6 named NPCs;
- 1–2 useful service/shop/training contexts;
- 3–5 creatures or meaningful variants;
- 3–5 resource sources;
- 15–20 source/sink-connected items;
- 8–12 recipes/processes;
- 8–12 techniques/abilities/training hooks where mechanically coherent;
- 3–4 contracts/quests;
- transport only where topology creates a real decision.

Before acceptance, every new record family must pass Pack v2 ownership/dependency checks and relevant runtime use coverage.

## Packet C — Elderwood Hunt-Timber

**Status: QUEUED.**

Stress hunting, forestry, body recovery, food/material chains, field techniques, home supply, relationships and dangerous travel. Resources should feed multiple downstream decisions where practical.

A companion candidate is appropriate only if the authored person warrants recruitment; companion count is not a quota.

## Packet D — Starfen Marshcraft-Practical Magic

**Status: QUEUED.**

Stress wetland ecology, herbs/fungi, medicine/cooking, practical magic, training, schedules, canal/water context and community/research contracts. This is a strong later tranche for ability breadth after Redstone proves the production workflow.

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
| Canonical items | 50 | 110+ |
| Recipes/processes | 11 | 40+ |
| Abilities/techniques | 5 | 40+ |
| Quests/contracts | 8 | 18+ |
| Recruitable companions | 1 | 4 only when authored characters justify them |
| Transport services | 3 | 5 only when topology justifies them |

Places should not be expanded simply to increase count; 26 already exceeds the mechanics floor of 10.

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

The original relative envelope remains useful as capacity planning, but Packet A is now complete:

| Relative band | Packet | Status |
| --- | --- | --- |
| Weeks 1–2 equivalent | Governance + Pack v2 | COMPLETE |
| Weeks 3–5 equivalent | Redstone Forge-Road | NOT STARTED |
| Weeks 6–8 equivalent | Elderwood Hunt-Timber | QUEUED |
| Weeks 9–11 equivalent | Starfen Marshcraft-Practical Magic | QUEUED |
| Week 12 equivalent | Gate A integration/census | QUEUED |

These are planning bands, not delivery promises.

# After `0.9.100`

`0.9.200` deeper adventure vertical slices, `0.9.300` advanced combat/training, `0.9.400` economy/production depth, `0.9.500` quest/social depth, and `0.9.600` playable-alpha scale remain ordered future tracks. `0.9.700`–`0.9.900` remain browser/accessibility, supported-persistence transition, and release-candidate hardening programs.

# Explicit non-goals

Do not use Gate A to introduce a second simulation clock, generic background automation, full romance, mounts/warehouses merely for breadth, supported-save migrations without a separate decision, hard benchmark thresholds, giant global content files that bypass pack ownership, or procedural filler intended only to satisfy census numbers.

The desired outcome is a production system that repeatedly creates **original, regional, cross-linked, testable gameplay** on infrastructure that is already prepared to own it.
