# Roadmap

This is the authoritative phase and feature-track roadmap for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Operational sequencing lives in `docs/EXECUTION_PIPELINE.md`. Exact restart state lives in `docs/THREAD_HANDOFF.md`. Phase 0.8 closure evidence lives in `docs/PHASE_0_8_EXIT_GATE.md`.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/EXECUTION_PIPELINE.md`
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/QUALITY_GATES.md`

## Current validated baseline

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Codename:      Household & Community Continuity
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Exact frozen runtime:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

Hosted evidence:

```text
Check 32395768383
Node 24.19.0
699/699 tests
Benchmark 3 success
Benchmark Sample success
```

Phase-exit validation-only Check `32395959505` additionally passed Content Census and Hardening. Validation-only PR #380 is closed without merge.

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
| `0.7` | Multi-region playable-alpha foundation | **Complete** |
| `0.8` | Life and infrastructure expansion | **Complete** |
| `0.9` | Content scale, adventure depth and release hardening | **Planned; not opened** |
| `1.0` | Live foundation | Planned |

# Phase 0.8 — Life and infrastructure expansion

**Status: COMPLETE.** See `docs/PHASE_0_8_EXIT_GATE.md`.

| Track | Player-facing gate | Status |
| --- | --- | --- |
| `0.8.100` | Home foothold: durable storage from regional materials + project labor | **Complete** |
| `0.8.200` | Home workshop: locality-bound production capability | **Complete** |
| `0.8.300` | Carried-load transport from actual inventory | **Complete** |
| `0.8.400` | Earned Field Satchel portable logistics | **Complete** |
| `0.8.500` | Fictional-time NPC availability | **Complete** |
| `0.8.600` | Companion convalescence and safe reunion | **Complete** |
| `0.8.700` | Cultivation & Stewardship | **Complete** |
| `0.8.800` | Earned Routine Delegation | **Complete** |
| `0.8.900` | Household & Community Continuity | **Complete** |

Revisions `.2`–`.52` after `0.8.600` completed the late-phase persistence/lifecycle classification sequence. C0 then added durable continuation guidance and executable content census tooling. The subsequent player-facing tracks proved the connected life arc rather than manufacturing another persistence audit.

## `0.8.700` — Cultivation & Stewardship

A reusable home Sweetroot bed now composes canonical world time, inventory, provenance, work tasks, work proficiency and semantic Journal actions.

```text
physical Sweetroot propagation input
  -> prepare / plant
  -> timestamp-derived growth
  -> manual tending after one fictional day
  -> maturity after two fictional days
  -> exactly-once ordinary Sweetroot harvest
  -> cultivated + seed provenance
  -> existing consume / production / trade sinks
  -> repeated practice reduces later hands-on duration
```

Game State advanced 12 -> 13 for required cultivation plot/crop authority. Data advanced 37 -> 38 for stable cultivation identifiers. No crop-owned long-lived timed task was introduced.

## `0.8.800` — Earned Routine Delegation

After one manually completed cultivation cycle, the player can pay **12 gil** to arrange one future Sweetroot tending visit.

The appointment persists under cultivation authority, resolves from canonical fictional time, occupies no player hands-on channel, creates no new direct timed-task owner, grants no player mastery, and cannot charge or complete twice across save/load. Insufficient funds fail atomically.

Game State advanced 13 -> 14 because the paid pending appointment is durable player-costly state.

## `0.8.900` — Household & Community Continuity

Three existing named locality people now participate as persistent scheduled community contacts:

- Mira Fen — Thornwall Southgate, 06:00–11:00;
- Mae Oris — Brasshaven Market Ring, 11:00–17:00;
- Kiri Fen — Mistmere Canal Ward, 16:00–21:00.

Their commitments require Sweetroot provenance from `plot-home-sweetroot-bed`; wild Sweetroot does not substitute. Resolution and later-day follow-up reuse existing commitment, relationship, wallet, inventory, NPC schedule, semantic event, save/load and Journal authorities. Semantic actions are `commitment.accept`, `commitment.resolve`, and `commitment.followUp`.

Data advanced 38 -> 39 for the expanded canonical NPC/schedule/commitment identifiers. Game State remains 14 because existing generic persistence contracts already own the new records.

## Phase 0.8 exit result

The validated connected-life chain is:

```text
home/storage/workshop
  -> cultivation/stewardship
  -> repeated manual routine
  -> earned paid delegation
  -> named scheduled community consequences
  -> ordinary inventory/services/travel/adventure remain connected
```

Exit gates all passed:

```text
npm test                 699/699
npm run benchmark        Benchmark 3 success
npm run benchmark:sample success
npm run census           success
npm run hardening        2/2 lifecycle tests + sample success
```

No second simulation clock, second task engine, generic automation platform, social clock or duplicate inventory/progression authority was introduced.

# Content scale as the Phase 0.9 gate

`npm run census` is an executable progression indicator. Counts measure authored breadth, not quality or balance.

Current Phase 0.8 exit census:

| Category | Current | Mechanics integration | Playable alpha | 1.0 lower bound |
| --- | ---: | ---: | ---: | ---: |
| Places/localities | 26 | 10 | 30 | 75 |
| Named NPCs | 12 | 50 | 250 | 700 |
| Functional shop/service sites | 17 | 20 | 60 | 150 |
| Creature definitions | 16 | 40 | 120 | 300 |
| Resource sources | 13 | 40 | 100 | 250 |
| Canonical items | 50 | 200 | 800 | 2,500 |
| Recipes/processes | 11 | 75 | 300 | 800 |
| Abilities/techniques | 5 | 100 | 250 | 500 |
| Quests/contracts | 8 | 30 | 150 | 500 |
| Recruitable companions | 1 | 4 | 12 | 25 |
| Scheduled transport services | 3 | 5 | 20 | 50 |

Mechanics-scale status is **NOT READY**. Places already exceed the mechanics floor; all other tracked categories remain below it. The largest relative gap is abilities/techniques.

This is the central strategic input for the next phase. Do not game the census with disconnected filler.

# Phase 0.9 — Content scale, adventure depth and release hardening

**Status: planned; not opened.** The following are ordered planning tracks, not authorization to implement them.

| Proposed track | Gate | Planning envelope |
| --- | --- | --- |
| `0.9.100` | Content Scale Gate A: move core categories toward mechanics-integration lower bounds through connected regional packs | Q1 2027 |
| `0.9.200` | Adventure vertical slices: deeper dangerous regions/dungeons combining maps, preparation, ecology, combat, recovery and provenance | Q1–Q2 2027 |
| `0.9.300` | Advanced combat/training: tactical families, techniques, mentors/certification and equipment interaction | Q2 2027 |
| `0.9.400` | Economy/production depth: material tiers, repair/replacement, advanced stations and durable sinks | Q2–Q3 2027 |
| `0.9.500` | Quest/social depth: regional arcs, reputation/community consequences, companion breadth | Q3 2027 |
| `0.9.600` | Playable-alpha content-scale push | Q4 2027–Q1 2028 |
| `0.9.700` | Browser UX/accessibility/E2E hardening | Q1–Q2 2028 |
| `0.9.800` | Supported persistence/release transition; deliberate migrations | Q2 2028 |
| `0.9.900` | Release-candidate soak, accepted performance budgets, packaging/recovery/content/balance sweeps | Q3 2028 |

Calendar windows are planning envelopes, not promises. Track completion remains criteria-driven.

## Phase 0.9 governance transition

Before high-volume Phase 0.9 work is explicitly opened, revisit repository governance. The recommended transition is protected `main` with required green hosted Check and PR-based track integration. Supported-save migrations remain a later deliberate release-transition decision unless a work order explicitly changes that policy.

Do not perform this transition merely because Phase 0.8 closed; it belongs to the explicit Phase 0.9 opening decision.

# 1.0 — Live foundation

A 1.0 release is justified when the continuous-character persistent-life/adventure promise works at sustained content scale: original world identity, interconnected life/adventure systems, meaningful mastery, sufficient authored content, ordinary browser usability, supported persistence, stable long sessions, accepted performance budgets, and proven release/recovery tooling.

# Current Game State 14 persistence boundary

Required current-schema authority includes world/simulation/task state, active travel, projects, commitments, relationships, resource opportunities/ecology, cultivation including paid delegation appointment state, party, ability runtime, semantic events, discovery, player identity/progression/inventory/resources/wallet/equipment/statuses, world flags, location and active combat authority when present.

Optional persisted authority remains:

```text
state.work
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

A future continuation should start from `THREAD_HANDOFF.md` and `EXECUTION_PIPELINE.md`. Do not automatically begin `0.9.100` from this roadmap alone.
