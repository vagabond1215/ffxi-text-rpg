# Phase 0.9 Implementation Plan

This document is a **planning artifact, not an implementation authorization**. Phase 0.9 remains planned and unopened until a future work order explicitly opens it.

Authoritative companions remain `AGENTS.md`, `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Current planning baseline

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Phase:         0.8 complete
Codename:      Household & Community Continuity
```

Frozen gameplay/runtime implementation remains:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

Phase 0.8 already proved the core persistent-life architecture. The strategic risk has moved from state coherence toward **authored content breadth, content-production throughput, and cross-system density**.

## Audit inputs that shape Phase 0.9

Current census:

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

Places are not the immediate scaling problem. The largest relative deficit is abilities/techniques, followed by recipes/processes and the broader item/NPC/ecology graph.

### Content-pack ownership gap

The current `CONTENT_PACK_COLLECTIONS` contract owns:

```text
places
routes
transportServices
ecologyFamilies
species
populations
gatheringSources
items
npcs
shops
recipes
quests
relationships
```

That contract does **not yet own several categories Phase 0.9 must scale heavily**, including player abilities/techniques, capability/training definitions, NPC schedule definitions, and companion definitions. The validator likewise has no regional cross-reference rules for those families.

Therefore Phase 0.9 should not begin by mass-authoring those categories in parallel global lists. The first implementation packet should make the pack/validation architecture capable of owning the content that Phase 0.9 intends to scale.

## Recommended Phase 0.9 opening decision

When the phase is explicitly opened, make these decisions before the first large content commit:

1. transition to protected `main`;
2. require the hosted `Check` workflow;
3. use PR-based integration for Phase 0.9 track packets;
4. keep `npm run census` as a progression metric, not an ordinary pass/fail threshold;
5. preserve current-schema-only persistence until a later deliberate supported-save transition;
6. do not advance Product/Package to `0.9.100` until actual implementation begins.

The governance recommendation is stronger now because Phase 0.9 will involve larger cross-file authored-data changes where accidental stable-ID, reference, or count drift is more likely than during bounded single-system work.

# Proposed `0.9.100` — Content Scale Gate A

## Objective

Prove that Hearth & Horizon can author, validate, integrate, and review **dense cross-linked regional content at materially higher volume** without creating parallel authorities or disconnected filler.

Gate A is a production-throughput and architecture gate. It does not need to reach every mechanics-integration lower bound in one track, but it must make large measurable progress and close the smallest strategic gaps where doing so is genuinely useful.

## Packet A — Content Pack Scale Contract v2

This should be the first implementation packet after Phase 0.9 opens.

### Required decisions

- define pack ownership for abilities/techniques and their capability/training references;
- define pack ownership for NPC schedules;
- define pack ownership for companion definitions and NPC/relationship references;
- decide whether service/trainer definitions require a distinct pack collection or remain projections over existing POI/shop/NPC authority;
- preserve shared-foundation ownership for content that is intentionally cross-regional;
- avoid duplicating canonical catalogs merely so packs can claim ownership.

### Expected implementation work

- advance the content-pack schema deliberately if the collection contract changes;
- extend pack index ownership/collision detection to the new families;
- extend cross-reference validation for the new families;
- extend generated scale fixtures so hundreds-record validation exercises the new categories;
- make the census count canonical content regardless of whether the record is shared or region-owned;
- add tests proving duplicate IDs, dangling trainer/ability/NPC/companion/schedule references, and undeclared cross-pack dependencies fail clearly.

### Version expectation

Likely decisions, to be confirmed from the exact implementation:

```text
Product:      open 0.9.100 only when implementation starts
Package:      0.9.100 when the track opens
Data:         likely advance because stable content-pack/data contracts expand
Game State:   expected unchanged unless a genuinely new durable runtime fact is introduced
Benchmark:    expected unchanged unless workload/protocol changes
Account Save: expected unchanged
```

Do not pre-commit these version increments from planning alone.

## Packet B — Redstone Forge-Road regional tranche

Use Brasshaven / Redstone Reach as the first scale proof because it already intersects mining, production, shops, caravan travel, combat, equipment, contracts and provenance.

A useful tranche should aim for a connected graph, not a quota dump:

```text
new NPCs / mentors / service contacts
  -> schedules and contracts
  -> Redstone creatures + mineral/resource sources
  -> raw materials
  -> processing / recipes
  -> tools, equipment and consumables
  -> techniques or training access
  -> shops / wages / trade / transport
  -> field danger and recovery
```

Representative tranche band:

- 4–6 named NPCs;
- 1–2 functional service/shop/training contexts;
- 3–5 creature definitions or meaningful variants;
- 3–5 resource sources;
- 15–20 canonical items participating in real sources/sinks;
- 8–12 recipes/processes;
- 8–12 abilities/techniques or training hooks where mechanically coherent;
- 3–4 contracts/quests;
- transport expansion only where route topology creates a real decision.

## Packet C — Elderwood Hunt-Timber regional tranche

Use Thornwall / Elderwood to stress hunting, forestry, body recovery, food/material processing, field techniques, home supply, relationships and dangerous travel.

The content graph should connect creature bodies and forest resources into multiple downstream uses rather than creating one-recipe materials.

Prefer at least one companion-candidate or deeper recurring field character if the authored role is strong enough; do not add a recruitable companion solely to increment the census.

## Packet D — Starfen Marshcraft-Practical Magic regional tranche

Use Mistmere / Starfen to stress practical magic, herbs/fungi, wetland ecology, medicine/cooking/processing, magical training, canal/water transport, schedules and research/community contracts.

This tranche is the strongest place to expand the currently tiny ability/technique catalog while preserving the rule that abilities are learned capabilities with real requirements rather than class-toggle permissions.

## Packet E — Gate A integration and census audit

After the regional tranches:

```text
npm run audit:repo
npm test
npm run benchmark
npm run benchmark:sample
npm run census
```

Run `npm run hardening` only if the track changes lifecycle-sensitive runtime ownership; content breadth alone should not manufacture new long-lived resources.

### Proposed Gate A progression targets

These are **planning bands**, not permission to add filler and not release quotas:

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
| Recruitable companions | 1 | 4 when justified by authored characters |
| Transport services | 3 | 5 when topology justifies them |

Places/localities should not be expanded just to increase the count; 26 already exceeds the mechanics floor of 10.

### Qualitative Gate A requirements

Gate A should fail even with attractive counts if the content graph is weak. Require:

- new items have intentional sources and sinks or explicit exemptions;
- new resources participate in more than one downstream decision where practical;
- abilities/techniques have real learning/access/use requirements and at least representative runtime use coverage;
- NPC schedules and services use canonical fictional time/location authority;
- quests/contracts are reachable and reference valid content;
- companion definitions remain NPC-backed persistent people, not combat vending machines;
- cross-pack references declare dependencies;
- legacy identifiers do not leak into canonical packs;
- the generated scale fixture and real regional packs both validate;
- census gains come from playable connected records rather than inert fixtures.

# Relative implementation timeline

The following is a capacity-planning envelope after an explicit Phase 0.9 opening, not a delivery promise:

| Relative window | Packet |
| --- | --- |
| Weeks 1–2 | Phase opening governance + Content Pack Scale Contract v2 |
| Weeks 3–5 | Redstone Forge-Road tranche |
| Weeks 6–8 | Elderwood Hunt-Timber tranche |
| Weeks 9–11 | Starfen Marshcraft-Practical Magic tranche |
| Week 12 | Gate A integration, census, docs and handoff |

If Pack v2 reveals deeper ownership problems, stop and repair those before content volume increases. If a regional tranche reveals categorization or balance problems, adjust the next tranche rather than copying the defect at scale.

# After `0.9.100`

## `0.9.200` — Adventure vertical slices

Select the strongest newly dense region and create a deeper dangerous expedition/dungeon slice that combines preparation, route knowledge, ecology, combat, resource recovery, provenance, equipment, companions and return-home consequences.

## `0.9.300` — Advanced combat and training

Use the larger ability catalog to deepen enemy tactics, techniques, mentor/certification access and equipment interaction. Do not build advanced combat around five representative abilities.

## `0.9.400` — Economy and production depth

Add material tiers, repair/replacement, advanced stations and durable sinks only after Gate A provides enough real item/process breadth to expose the economy's actual weak points.

## `0.9.500` — Quest and social depth

Build regional arcs, reputation/community consequences and companion breadth over the larger NPC/content graph established by Gate A.

## `0.9.600` — Playable-alpha content-scale push

This is the appropriate track to drive toward the much larger playable-alpha lower bounds after the production pipeline has proven that it can scale without loss of coherence.

Later `0.9.700`–`0.9.900` remain the planned browser accessibility/E2E, supported-persistence/release transition, and release-candidate hardening programs.

# Explicit non-goals for the first Phase 0.9 track

Do not use `0.9.100` to introduce:

- a new simulation clock;
- generic background automation;
- full romance;
- mounts/warehouses merely for breadth;
- supported-save migrations unless separately authorized;
- hard benchmark thresholds;
- a giant global content file that bypasses regional ownership;
- procedural filler whose only purpose is satisfying the census.

The desired outcome is a content-production system that can repeatedly produce **original, regional, cross-linked, testable gameplay**, not merely a larger database.
