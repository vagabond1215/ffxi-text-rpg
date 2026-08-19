# Execution Pipeline and Continuation Queue

This document is the operational progression path for **Hearth & Horizon**. It exists to minimize repeated discovery when work moves to a new ChatGPT/Codex thread.

It does not replace the design north star or roadmap. Authority order remains:

1. `AGENTS.md` — operating rules and scope discipline.
2. `docs/THREAD_HANDOFF.md` — exact current checkpoint and immediate next bounded work.
3. this file — durable active/next/deferred queue and pass gates.
4. `docs/DEVELOPMENT_DIRECTION.md` — product laws and design direction.
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — setting/content identity and scale policy.
6. `docs/ROADMAP.md` — phase/track progression.
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
8. relevant architecture/runtime/tests for the active pass only.

If this file and `THREAD_HANDOFF.md` already identify the active pass, **do not restart a broad repository audit**. Refresh `main`, verify the handoff checkpoint still matches, inspect only the files/tests named by the active pass, and proceed.

## Current baseline

```text
Product:       0.8.600.52
Package:       0.8.600
Account Save:  5
Game State:    12
Data:          37
Benchmark:     3
Phase:         0.8 in progress
```

Latest gameplay behavior remains Product `.52` (`Transient Command Presentation Log`).

Latest validated repository/tooling checkpoint:

```text
b0c1e067a1907a8587a08a128126f9207c6d6134
PR #377 validation-only, closed without merge
Check 32308719621
Node 24.19.0
692/692 tests
Benchmark 3 success
Benchmark Sample success
```

The checkpoint adds the content-scale progression gate and `npm run census`; it does not change Game State, gameplay authority, or Product version.

## Fast restart protocol

A replacement thread should do this before any implementation:

```text
1. fetch current main SHA
2. read AGENTS.md
3. read docs/THREAD_HANDOFF.md
4. read this file
5. compare current main with the handoff SHA
6. run/inspect only the active pass evidence
7. continue the named bounded unit
```

Only reopen broad discovery when one of these is true:

- `main` materially diverged from the handoff checkpoint;
- the handoff says the next unit is unselected;
- the active pass has become impossible because an authority changed;
- the user explicitly asks for a fresh audit or roadmap revision.

Do not spend a new thread rediscovering closed Phase 0.4–0.7 work, the `.39`–`.52` persistence history, or the completed `state.npcs` / `state.enemies` / `state.log` classification sequence unless the active task directly touches those contracts.

# Active progression queue

Statuses:

- **ACTIVE** — current bounded unit.
- **READY NEXT** — recommended next unit after the active pass closes; still requires a new explicit work order/message under `AGENTS.md`.
- **QUEUED** — ordered candidate after its dependencies are satisfied.
- **DEFERRED** — intentionally not part of the current phase/pass.
- **DONE** — implemented and validated.

## C0 — Continuation Infrastructure + Content Census

**Status: ACTIVE (implementation validated; documentation synchronization finishing).**

Purpose: make repository progress measurable and handoffs cheap before opening another feature track.

Implemented at validated checkpoint `b0c1e067a1907a8587a08a128126f9207c6d6134`:

- `js/text/systems/contentScaleGate.js`
- `scripts/contentCensus.js`
- `tests/contentScaleGate.test.js`
- `npm run census`

The gate tracks the lower-bound planning targets already defined by `WORLD_IDENTITY_AND_CONTENT_POLICY.md` for:

```text
places/localities
named NPCs
functional shop/service sites
creature definitions
resource sources
canonical items
recipes/processes
abilities/techniques
quests/contracts
companions
scheduled transport services
```

It reports mechanics-integration, playable-alpha, and 1.0 lower-bound targets. Missing future content is a roadmap gap, **not a CI failure**. Tests protect the target definitions, counting logic, and criteria-driven gate behavior.

C0 exit criteria:

- [x] executable content census exists;
- [x] focused tests exist;
- [x] full hosted Test/Benchmark gate passed exact implementation head;
- [ ] authority/read-order docs point future threads here;
- [ ] roadmap records the next Phase 0.8 sequence;
- [ ] handoff updated last with exact next bounded unit.

## 0.8.700 — Cultivation & Stewardship

**Status: READY NEXT after C0 closes.**

Player-facing question:

> Can a player turn a home/foothold and existing material economy into a multi-day cultivation loop whose output feeds food, medicine, trade, production, or commitments without creating a parallel clock or inventory?

First bounded proof should prefer an existing home or settlement plot and compose existing authorities:

```text
obtain/access plot
  -> prepare soil/bed
  -> plant provenance-bearing seed/input
  -> canonical fictional time passes
  -> tend/maintain when required
  -> harvest
  -> provenance-bearing output
  -> output has multiple real sinks
  -> cultivation/work mastery improves future efficiency
```

Authority constraints:

- canonical world time remains the only clock;
- inventory owns physical inputs/outputs;
- provenance remains attached to outputs;
- work proficiency owns repeated-practice efficiency;
- home/project authority owns durable infrastructure where needed;
- do not create one long-lived timed-task owner per crop by reflex;
- persisted plot/crop state should derive elapsed growth from canonical world time when that is sufficient;
- no wall-clock/offline growth authority.

Required first-pass evidence:

- deterministic multi-day growth/tending/harvest test;
- save/load during growth;
- no duplicate harvest or repeated completion reward;
- output participates in at least three existing sinks/systems;
- browser/semantic action path does not require command expertise;
- `npm run census` records any content breadth added by the track.

## 0.8.800 — Earned Routine Delegation

**Status: QUEUED; depends on a real established repetitive chore, preferably 0.8.700.**

Player-facing question:

> Can established mastery, infrastructure, reputation, or wages reduce player attention spent on a solved routine without producing free resources or a second simulation clock?

Proof direction:

```text
manual routine established
  -> mastery/infrastructure/social investment
  -> bounded helper/hired-labor option
  -> player pays fictional time/wages/material constraints
  -> routine consequence remains under existing domain authority
  -> player attention decreases
```

Do not implement generic automation first. Delegate one proven chore and prove ownership/exactly-once behavior before generalizing.

## 0.8.900 — Household & Community Continuity

**Status: QUEUED; follows cultivation/delegation unless a stronger concrete social defect appears.**

Goal: make the foothold socially consequential rather than only a storage/workstation container.

Target bounded breadth:

- 2–3 additional recurring named NPC relationships with distinct schedules/needs;
- at least one additional recruitable companion candidate if justified by the regional content graph;
- commitments or services that intersect with livelihood/property rather than gift-spam;
- multi-day consequences and return visits;
- no full romance framework yet.

## Phase 0.8 exit audit

**Status: QUEUED after `0.8.900`.**

Exit proof should demonstrate one coherent life arc:

```text
home/storage/workshop
  -> cultivation/stewardship
  -> repeated productive routine
  -> earned reduction in repetitive attention
  -> named social/community consequences
  -> preparation for travel/adventure
```

Run:

```text
npm run census
npm test
npm run benchmark
npm run benchmark:sample
npm run hardening   # when lifecycle-sensitive work in the closing set warrants it
```

The Phase 0.8 exit review chooses whether remaining life-system gaps belong in a small final 0.8 track or move to 0.9. Do not add a numeric track merely to fill the sequence.

# Phase 0.9 progression envelope

These are ordered planning tracks, not blanket authorization to execute them.

| Track | Primary gate | Planning window | Status |
| --- | --- | --- | --- |
| `0.9.100` | Content Scale Gate A: move core authored categories toward mechanics-integration lower bounds | Q1 2027 | QUEUED |
| `0.9.200` | Adventure vertical slices: deeper dangerous regions/dungeons combining preparation, ecology, combat, recovery and provenance | Q1–Q2 2027 | QUEUED |
| `0.9.300` | Advanced combat/training: enemy tactics, technique breadth, mentors/certification and equipment interaction | Q2 2027 | QUEUED |
| `0.9.400` | Economy/production depth: material tiers, repair/replacement, advanced stations and durable sinks | Q2–Q3 2027 | QUEUED |
| `0.9.500` | Quest/social depth: multi-step regional arcs, reputation/community consequences, companion breadth | Q3 2027 | QUEUED |
| `0.9.600` | Playable-alpha content-scale push | Q4 2027–Q1 2028 | QUEUED |
| `0.9.700` | Browser UX/accessibility/E2E hardening | Q1–Q2 2028 | DEFERRED |
| `0.9.800` | Supported persistence/release transition, deliberate migrations, protected-main policy | Q2 2028 | DEFERRED |
| `0.9.900` | Release-candidate soak, accepted performance budgets, packaging/recovery/content/balance sweeps | Q3 2028 | DEFERRED |

Calendar windows are planning envelopes only. Advancement remains criteria-driven.

# Outstanding improvements and deferred runs

Keep these visible so future threads do not rediscover them as surprises.

## Content breadth — highest strategic debt

**Open.** Use `npm run census` at the start/end of content-heavy tracks.

The current architecture supports substantially more content than is authored. Phase 0.9 must shift developer time toward connected regional content, not another long generic persistence-hardening chain unless a concrete defect requires it.

## Documentation drift cleanup

**Open, low risk.** Some long-lived docs can lag the latest checkpoint even when core authorities are correct. Examples identified by the August 19, 2026 audit:

- `docs/PERFORMANCE_BUDGET.md` still names an older `.12` checkpoint as its latest accepted baseline;
- `docs/RESOURCE_LIFECYCLE.md` contains a historical `Game State 6` label in the current-task-integrity section even though the current schema is Game State 12.

Fix when synchronizing the relevant authority or before Phase 0.9 hardening; do not launch a separate broad audit solely to find more wording drift.

## Branch protection / required review

**DEFERRED to Phase 0.9 stabilization.** Current single-maintainer pre-alpha policy remains direct `main`. Transition when release/stabilization work begins:

```text
protected main
required hosted Check
feature/track branch or PR
no merge on failing required checks
```

## Supported save compatibility and migrations

**DEFERRED to `0.9.800` unless explicitly requested earlier.** Current pre-alpha policy remains exact current-schema only. Do not accumulate compatibility scaffolding before the product has a supported-save promise.

## Browser E2E and accessibility harness

**DEFERRED as a dedicated program to `0.9.700`.** Continue semantic DOM, keyboard, focus and POV tests during normal development. Add a real browser E2E matrix once the UI flow is stable enough to justify maintenance cost.

## Hard performance budgets

**DEFERRED.** Benchmark 3 remains comparative evidence; current very-fast attack/tick workloads are noisy. Do not invent pass/fail numbers until repeated representative evidence supports them. A workload/protocol change requires a Benchmark version decision.

## Balance certification

**DEFERRED.** Green mechanics tests do not mean the game is balanced. Do not mark systems `balanced` until sustained play/content-scale evidence exists.

## Quality/HQ crafting depth

**DEFERRED.** Add only when quality creates meaningful material/tool/proficiency decisions rather than inherited MMO rarity tiers.

## Mounts, warehouses and large-logistics breadth

**DEFERRED.** Existing carried-load, transport and home storage authorities should be stressed by real content first.

## Romance/deep social-life framework

**DEFERRED beyond 0.8.900.** First prove broader authored social characters with goals, schedules, boundaries and useful non-romance roles.

# Standard bounded-pass pipeline

Every implementation pass should use this sequence unless the active task clearly does not need one of the steps:

```text
1. Select one player-facing or repository-risk question.
2. Identify existing authority and production caller.
3. Define explicit non-goals.
4. Write the smallest end-to-end proof.
5. Implement runtime/data first.
6. Add focused deterministic tests.
7. Add realistic content breadth for the changed system.
8. Run focused validation.
9. Run full Test + Benchmark evidence when the change is coherent.
10. Freeze exact implementation SHA.
11. Synchronize roadmap/profile/catalog/docs only after freeze.
12. Update THREAD_HANDOFF.md last.
13. Stop; do not silently launch the next independent pass.
```

For lifecycle-sensitive systems, add ownership/cleanup and long-session evidence. For persistence changes, classify state before validation and make a deliberate Game State decision. For content-heavy work, run `npm run census` and record what categories changed.

# Handoff template

Every substantive closing handoff should make the following explicit so a new thread can continue without reconstructing chat history:

```text
Current main SHA:
Validated implementation SHA:
Product / Package / Account Save / Game State / Data / Benchmark:
Active pass:
Pass status: active | blocked | complete
Completed behavior:
Exact validation evidence:
Known failures/blockers:
Files/authorities to inspect next:
Next bounded unit:
Deferred work discovered but not started:
Do-not-redo notes:
```

`THREAD_HANDOFF.md` should remain short enough to read first. Historical detail belongs in roadmap/version history, git, or this queue rather than being recopied into every handoff.
