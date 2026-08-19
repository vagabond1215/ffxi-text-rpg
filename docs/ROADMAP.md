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

## Current baseline

```text
Product:       0.8.600.52
Package:       0.8.600
Account Save:  5
Game State:    12
Data:          37
Benchmark:     3
Codename:      Transient Command Presentation Log
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Latest validated implementation/tooling checkpoint:

```text
b0c1e067a1907a8587a08a128126f9207c6d6134
PR #377 validation-only, closed without merge
Check 32308719621
Node 24.19.0
692/692 tests
Benchmark 3 success
Benchmark Sample success
```

That checkpoint adds the content-scale progression gate and `npm run census`; it does not change Product version, Game State, or gameplay authority.

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

## Completed tracks

| Track | Player-facing gate | Status |
| --- | --- | --- |
| `0.8.100` | Home foothold: durable storage from regional materials + project labor | **Complete** |
| `0.8.200` | Home workshop: locality-bound production capability | **Complete** |
| `0.8.300` | Carried-load transport from actual inventory | **Complete** |
| `0.8.400` | Earned Field Satchel portable logistics | **Complete** |
| `0.8.500` | Fictional-time NPC availability | **Complete** |
| `0.8.600` | Companion convalescence and safe reunion | **Complete** |

Revisions `.2` through `.52` after the closed `0.8.600` feature track hardened current-schema persistence, action/semantic boundaries, deterministic lifecycle ownership, current location/combat authority, and the derived/transient classification of root player caches, `state.npcs`, `state.enemies`, and top-level `state.log`.

The dedicated broad-array classification sequence is complete. Do not manufacture another persistence audit merely to advance a revision number.

## Continuation infrastructure gate

Before opening a new feature track, the August 19, 2026 repo audit identified a transition in project risk:

> The deterministic/persistence substrate is comparatively mature; the largest strategic gap is now player-facing life/adventure breadth and authored content scale.

The C0 continuation pass therefore adds:

- `docs/EXECUTION_PIPELINE.md` — durable active/next/deferred queue and restart rules;
- `js/text/systems/contentScaleGate.js` — criteria-driven content scale metrics;
- `scripts/contentCensus.js` / `npm run census` — developer-visible census;
- `tests/contentScaleGate.test.js` — protects the target definitions and readiness logic.

This tooling is intentionally informational: being below future content targets does not fail CI.

## Next Phase 0.8 sequence

The following tracks are the recommended current progression path. Roadmap order does **not** authorize unbounded autonomous implementation; each new independent track still needs an explicit work order/message under `AGENTS.md`.

### `0.8.700` — Cultivation & Stewardship

**Status: next recommended feature track after the C0 documentation pass closes.**

Bounded first proof:

```text
access plot
  -> prepare
  -> plant provenance-bearing input
  -> canonical fictional time passes
  -> tend when required
  -> harvest
  -> provenance-bearing outputs
  -> outputs feed multiple existing systems
  -> persistent work/cultivation mastery improves efficiency
```

Required design constraints:

- one canonical fictional clock;
- no real-time/offline-growth authority;
- inventory owns physical seed/input/output location;
- provenance remains explicit;
- existing work proficiency should own repeated-practice efficiency where it fits;
- home/projects may own durable infrastructure;
- do not create a new timed-task owner for every growing plot unless the domain truly requires task semantics.

Exit proof must include deterministic multi-day behavior, save/load mid-growth, exactly-once harvest, meaningful output sinks, and an ordinary semantic browser path.

### `0.8.800` — Earned Routine Delegation

**Status: queued after a real repetitive routine exists.**

The system should prove the progression law by allowing investment/mastery/infrastructure/social capital to reduce attention spent on a solved chore.

First proof should delegate one concrete routine rather than build a generic automation platform.

```text
manual chore
  -> mastery/infrastructure/reputation
  -> bounded hired/helper option
  -> wages/material/time constraints remain real
  -> same domain consequence
  -> less player attention
```

No free resource generation, passive wall-clock simulation, or second generic task engine.

### `0.8.900` — Household & Community Continuity

**Status: queued.**

Make the player's foothold socially consequential through existing schedule, relationship, commitment, party, work, recovery, home and economy authorities.

Target breadth for the track:

- 2–3 additional recurring named social characters with distinct routines/needs;
- one additional companion candidate when the regional content graph justifies it;
- livelihood/property-linked commitments or services;
- several-day return consequences;
- no full romance framework yet.

### Phase 0.8 exit audit

After `0.8.900`, prove one coherent life arc:

```text
home/storage/workshop
  -> cultivation/stewardship
  -> recurring productive routine
  -> earned reduction in repetitive attention
  -> named community consequences
  -> preparation for travel/adventure
```

Run the content census and normal quality gates. Close 0.8 only when the life/infrastructure additions feel connected to the existing adventure loop rather than like isolated menu systems.

# Content scale as a roadmap gate

`docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` defines lower-bound planning ranges. `npm run census` now turns the most important categories into an executable progression indicator.

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

These counts are **scale evidence, not quality/balance claims**. A category can meet a numeric lower bound and still need better cross-linking, originality, balance, presentation, or regional distribution.

# Phase 0.9 — Content scale, adventure depth and release hardening

Phase 0.9 should spend substantially more effort on connected authored breadth than the late 0.8 maintenance line did.

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

Current early single-maintainer work may continue directly on `main` under `AGENTS.md`.

Before release/stabilization work, transition toward:

```text
protected main
  -> required hosted Check
  -> feature/track PRs
  -> supported persistence policy
  -> explicit release fixtures
  -> accepted representative performance budgets
```

Do not adopt these controls simply as ceremony before they materially improve project safety.

# 1.0 — Live foundation

A 1.0 release is justified when the game fulfills the continuous-character persistent-life/adventure promise at sustained content scale:

- original world identity is coherent and no legacy proprietary setting leaks into canonical content;
- life, livelihood, preparation, travel, danger, combat, recovery, home and social systems materially feed one another;
- repeated effort produces mastery/efficiency/capability rather than only larger denominators;
- the content graph is large enough for sustained play and passes source/sink/topology/cross-reference validation;
- normal browser play is accessible without command expertise;
- supported saves have a deliberate compatibility/migration policy;
- long-session/resource behavior is stable;
- accepted performance budgets cover representative workloads;
- release tooling, recovery and packaging are proven.

Q4 2028 is an aggressive planning target for a 1.0 candidate, not a commitment. Do not lock a release date before the `0.9.600` content-scale push proves sustainable authoring throughput.

# Current persistence boundary

Game State 12 remains strict current-schema-only during pre-alpha.

Required persisted authority includes world/simulation/task state, active travel, projects, commitments, relationships, resource opportunities/ecology, party, ability runtime, semantic events, discovery, player identity/progression/inventory/resources/wallet/equipment/statuses, world flags, location and active combat authority when present.

Optional persisted authority remains:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

Derived/transient state includes:

```text
state.npcs
state.enemies
state.log
flat player.inventory alias identity
root player.combat
root player.statState
activeBattle.rng
```

`state.events` remains durable structured semantic observation history. Top-level `state.log` remains session-only command presentation. `activeBattle.log` remains separate persisted encounter-local history.

# Deferred work

The authoritative detailed deferred queue is `docs/EXECUTION_PIPELINE.md`. Key items include:

- supported-save migrations until release policy requires them;
- branch protection until Phase 0.9 stabilization;
- dedicated real-browser E2E/accessibility program until the UI flow stabilizes;
- hard performance thresholds until Benchmark 3 evidence is repeatable enough;
- full balance certification until content-scale play exists;
- quality/HQ crafting, mounts/warehouses/large logistics, and deep romance until existing systems create the need.

When a future thread is asked to continue, start from `THREAD_HANDOFF.md` and `EXECUTION_PIPELINE.md`. Do not repeat broad discovery unless repository evidence has invalidated those checkpoints.
