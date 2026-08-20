# Roadmap

This is the authoritative phase and feature-track roadmap for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Operational sequencing, deferred work, and restart instructions live in `docs/EXECUTION_PIPELINE.md`. Exact current checkpoint and immediate next work live in `docs/THREAD_HANDOFF.md`.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/EXECUTION_PIPELINE.md`
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
- `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
- `docs/ARCHITECTURE.md`
- `docs/QUALITY_GATES.md`

## Current feature proposal

Draft PR #378 contains the validated `0.8.700` feature baseline. It is **open, draft, and unmerged**:

```text
Product:       0.8.700.1
Package:       0.8.700
Account Save:  5
Game State:    13
Data:          38
Benchmark:     3
Codename:      Cultivation & Stewardship
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Exact frozen implementation evidence:

```text
Head:   c125f7ae5f94800893dc28c7fa0ceb61553e3db8
PR:     #378 draft, open, unmerged
Check:  32340190710
Job:    96337561458
Node:   24.19.0
Tests:  695/695
Benchmark 3: success
Benchmark Sample: success
```

`main` remains on the prior baseline until #378 is explicitly merged.

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Fictional time is separate from wall-clock scheduling. Persistent authorities remain canonical; projections and presentation remain derived. Legacy FFXI-derived material is research/reference only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics | **Complete** |
| `0.7` | Multi-region playable alpha foundation | **Complete** |
| `0.8` | Life and infrastructure expansion | **In progress** |
| `0.9` | Content scale, adventure depth and release hardening | Planned |
| `1.0` | Live foundation | Planned |

# Phase 0.8 — Life and infrastructure expansion

## Landed tracks

| Track | Player-facing gate | Status |
| --- | --- | --- |
| `0.8.100` | Home foothold: durable storage from regional materials + project labor | **Complete** |
| `0.8.200` | Home workshop: locality-bound production capability | **Complete** |
| `0.8.300` | Carried-load transport from actual inventory | **Complete** |
| `0.8.400` | Earned Field Satchel portable logistics | **Complete** |
| `0.8.500` | Fictional-time NPC availability | **Complete** |
| `0.8.600` | Companion convalescence and safe reunion | **Complete** |

Revisions `.2` through `.52` after the closed `0.8.600` track hardened current-schema persistence, semantic/action boundaries, deterministic lifecycle ownership, current location/combat authority, and the derived/transient classification of root player caches, `state.npcs`, `state.enemies`, and top-level `state.log`. That classification sequence is complete.

C0 then added the durable execution queue and executable content census. The project-risk conclusion was that player-facing breadth now deserves priority over manufacturing another generic persistence audit.

## `0.8.700` — Cultivation & Stewardship

**Status: implemented and validated on draft PR #378; pending landing.**

Bounded proof:

```text
home Sweetroot bed
  -> prepare with short hands-on work
  -> consume 1 physical existing Sweetroot as propagation input
  -> canonical fictional time drives growth
  -> tending becomes due after 1 fictional day
  -> maturity follows after 2 fictional days
  -> harvest exactly once
  -> 3 ordinary Sweetroots enter normal inventory
  -> output carries home-cultivation provenance + seed provenance history
  -> consume / production / trade sinks remain real
  -> cultivation mastery reduces later hands-on duration
```

### Authority model

- `state.cultivation` is required persisted Game State 13 authority.
- Growth stores canonical fictional timestamps and **does not own a long-lived timed task**.
- Preparation/tending are short hands-on work records under the existing `workTaskEngine` timed-task owner.
- Inventory owns propagation input and harvest output.
- Existing Sweetroot remains the canonical item; provenance distinguishes cultivated and wild stacks.
- Existing work proficiency owns repeated-practice efficiency through stable proficiency id `cultivation`.
- Journal/context actions use semantic intents (`cultivation.prepare`, `.plant`, `.tend`, `.harvest`) rather than command strings.
- A merely ready cultivation action does not steal recommendation priority from existing active/ready commitments, livelihood, home, or recovery choices.

### Persistence/data decision

```text
Product      0.8.600.52 -> 0.8.700.1
Package      0.8.600    -> 0.8.700
Game State   12         -> 13   required cultivation authority
Data         37         -> 38   stable cultivation proficiency/contract
Account Save 5 unchanged
Benchmark    3 unchanged
```

No Game State 12 -> 13 migration was added under the pre-alpha current-schema-only policy.

### Exit evidence

- deterministic multi-day growth/tending/harvest;
- real account save/load mid-growth and after tending;
- malformed crop timing and active-work links rejected before normalization;
- no crop-owned growth timer/task;
- cultivation work task released after exactly-once reconciliation;
- physical propagation input consumed once;
- seed provenance retained through crop state and harvest provenance;
- harvest replay blocked with no duplicated output;
- harvested Sweetroot retains three existing sink families: consume, craft ingredient, trade;
- semantic Journal/browser path exposes player decisions without raw implementation fields;
- full hosted gate: 695/695 tests + Benchmark 3 + Benchmark Sample.

No content-scale increase is claimed: this bounded proof reuses an existing item and adds no census-counted place, NPC, service site, creature, resource source, recipe, ability, quest, companion, or transport service.

## `0.8.800` — Earned Routine Delegation

**Status: READY NEXT after #378 lands; not started.**

The preferred first proof should use the now-proven cultivation routine rather than invent a generic automation system:

```text
manual Sweetroot routine established
  -> mastery / infrastructure / social investment
  -> one bounded hired/helper option
  -> wages, materials and fictional-time constraints remain real
  -> cultivation remains consequence authority
  -> no free resource generation
  -> less repetitive player attention
```

A future work order must define who/what performs the delegated action, what it costs, when it can fail, how save/load works, and where exactly-once responsibility lives. Do not generalize until one chore proves those contracts.

## `0.8.900` — Household & Community Continuity

**Status: queued.**

Make the player's foothold socially consequential through existing schedule, relationship, commitment, party, work, recovery, home, cultivation and economy authorities. Target 2–3 additional recurring named social characters with distinct needs/routines, possible companion breadth where justified, livelihood/property-linked commitments or services, and several-day return consequences. No full romance framework yet.

## Phase 0.8 exit audit

After `0.8.900`, prove one coherent life arc:

```text
home/storage/workshop
  -> cultivation/stewardship
  -> recurring productive routine
  -> earned reduction in repetitive attention
  -> named community consequences
  -> preparation for travel/adventure
```

Run the content census and normal quality gates. Close 0.8 only when life/infrastructure additions remain connected to the adventure loop rather than isolated menu systems.

# Content scale as a roadmap gate

`docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` defines lower-bound planning ranges. `npm run census` turns the most important categories into an executable progression indicator.

| Category | Mechanics integration | Playable alpha | 1.0 lower bound |
| --- | ---: | ---: | ---: |
| Places/localities | 10 | 30 | 75 |
| Named NPCs | 50 | 250 | 700 |
| Functional shop/service sites | 20 | 60 | 150 |
| Creature definitions | 40 | 120 | 300 |
| Resource sources | 40 | 100 | 250 |
| Canonical items | 200 | 800 | 2,500 |
| Recipes/processes | 75 | 300 | 800 |
| Abilities/techniques | 100 | 250 | 500 |
| Quests/contracts | 30 | 150 | 500 |
| Recruitable companions | 4 | 12 | 25 |
| Scheduled transport services | 5 | 20 | 50 |

Counts are scale evidence, not quality/balance claims.

# Phase 0.9 — Content scale, adventure depth and release hardening

| Proposed track | Gate | Planning envelope |
| --- | --- | --- |
| `0.9.100` | Content Scale Gate A: move core categories toward mechanics-integration lower bounds | Q1 2027 |
| `0.9.200` | Adventure vertical slices: deeper dangerous regions/dungeons combining maps, preparation, ecology, combat, recovery and provenance | Q1–Q2 2027 |
| `0.9.300` | Advanced combat/training: tactical families, techniques, mentors/certification and equipment interaction | Q2 2027 |
| `0.9.400` | Economy/production depth: material tiers, repair/replacement, advanced stations and durable sinks | Q2–Q3 2027 |
| `0.9.500` | Quest/social depth: regional arcs, reputation/community consequences, companion breadth | Q3 2027 |
| `0.9.600` | Playable-alpha content-scale push | Q4 2027–Q1 2028 |
| `0.9.700` | Browser UX/accessibility/E2E hardening | Q1–Q2 2028 |
| `0.9.800` | Supported persistence/release transition; deliberate migrations; protected-main policy | Q2 2028 |
| `0.9.900` | Release-candidate soak, accepted performance budgets, packaging/recovery/content/balance sweeps | Q3 2028 |

Calendar windows are planning envelopes, not promises. Track completion remains criteria-driven.

## Phase 0.9 governance transition

Before release/stabilization work, transition toward protected `main`, required hosted Check, deliberate supported persistence, explicit release fixtures, and accepted representative performance budgets. Do not adopt ceremony before it materially improves project safety.

# 1.0 — Live foundation

A 1.0 release is justified when the continuous-character persistent-life/adventure promise works at sustained content scale: original world identity, interconnected life/adventure systems, meaningful mastery, sufficient authored content, ordinary browser usability, supported persistence, stable long sessions, accepted performance budgets, and proven release/recovery tooling.

# Proposed Game State 13 persistence boundary

On PR #378, required current-schema authority adds:

```text
state.cultivation
  plot id / home place
  phase / cycle / harvest count
  active cultivation work link when present
  preparation / last-harvest fictional timestamps
  growing crop timestamps and seed provenance when present
```

Existing required authorities remain world/simulation/task state, active travel, projects, commitments, relationships, resource opportunities/ecology, party, ability runtime, semantic events, discovery, player identity/progression/inventory/resources/wallet/equipment/statuses, world flags, location and active combat authority when present.

Optional persisted authority remains:

```text
state.work                  # optional globally, required while cultivation has active hands-on work
player.progression.workProficiencies
state.dayCycle
```

Derived/transient state remains:

```text
state.npcs
state.enemies
state.log
flat player.inventory alias identity
root player.combat
root player.statState
activeBattle.rng
```

# Deferred work

Detailed deferred work lives in `docs/EXECUTION_PIPELINE.md`: supported-save migrations, branch-protection transition, dedicated browser E2E/accessibility, hard performance thresholds, balance certification, quality/HQ crafting depth, mounts/warehouses/large logistics, and deep romance.

When a future thread is asked to continue, start from `THREAD_HANDOFF.md` and `EXECUTION_PIPELINE.md`. If PR #378 remains open/unmerged, resolve that state before beginning `0.8.800`; do not repeat broad cultivation discovery.
