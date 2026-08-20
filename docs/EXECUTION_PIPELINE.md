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

If this file and `THREAD_HANDOFF.md` already identify the active pass, **do not restart a broad repository audit**. Refresh `main`, verify the handoff/PR checkpoint still matches, inspect only the files/tests named by the active pass, and proceed.

## Proposed post-0.8.700 baseline

The following baseline exists on draft PR #378 and is **not yet merged to `main`**:

```text
Product:       0.8.700.1
Package:       0.8.700
Account Save:  5
Game State:    13
Data:          38
Benchmark:     3
Phase:         0.8 in progress
Codename:      Cultivation & Stewardship
```

Exact frozen implementation head:

```text
c125f7ae5f94800893dc28c7fa0ceb61553e3db8
PR #378 draft, open, unmerged
Check 32340190710
Job 96337561458
Node 24.19.0
695/695 tests
Benchmark 3 success
Benchmark Sample success
```

`main` remains on the pre-0.8.700 baseline until #378 is explicitly merged. A replacement thread must check PR #378 before starting independent work.

## Fast restart protocol

```text
1. fetch current main SHA
2. inspect PR #378 status when 0.8.700 is not yet on main
3. read AGENTS.md
4. read docs/THREAD_HANDOFF.md
5. read this file
6. compare current main / PR head with the handoff
7. inspect only the named next-pass evidence
8. continue the named bounded unit
```

Only reopen broad discovery when:

- `main` or the active feature PR materially diverged from the handoff;
- the handoff says the next unit is unselected;
- the named pass has become impossible because an authority changed;
- the user explicitly asks for a fresh audit or roadmap revision.

Do not spend a new thread rediscovering closed Phase 0.4–0.7 work, the `.39`–`.52` persistence history, the completed `state.npcs` / `state.enemies` / `state.log` classification sequence, or the 0.8.700 cultivation architecture unless the active task directly touches those contracts.

# Active progression queue

Statuses:

- **ACTIVE** — current bounded unit.
- **READY NEXT** — recommended next unit after current landing; still requires explicit authorization.
- **QUEUED** — ordered candidate after dependencies are satisfied.
- **DEFERRED** — intentionally not part of the current phase/pass.
- **DONE** — implemented, validated, synchronized, and landed.
- **VALIDATED / PENDING LANDING** — implementation is green on a feature PR but has not been merged.

## C0 — Continuation Infrastructure + Content Census

**Status: DONE.**

Validated checkpoint `b0c1e067a1907a8587a08a128126f9207c6d6134`, validation-only PR #377 / Check `32308719621`, 692/692 tests. C0 added:

- `js/text/systems/contentScaleGate.js`
- `scripts/contentCensus.js`
- `tests/contentScaleGate.test.js`
- `npm run census`
- this durable active/next/deferred queue.

The census reports mechanics-integration, playable-alpha, and 1.0 lower-bound gaps. Missing future content is a roadmap gap, **not a CI failure**.

## 0.8.700 — Cultivation & Stewardship

**Status: VALIDATED / PENDING LANDING on draft PR #378.**

Player-facing proof now implemented:

```text
one reusable home Sweetroot bed
  -> 15m hands-on preparation
  -> consume 1 physical Elderwood Sweetroot propagation root
  -> persist planting/tending/readiness timestamps in canonical fictional seconds
  -> after 1 fictional day, short hands-on tending becomes due
  -> after 2 fictional days and tending, harvest exactly once
  -> 3 ordinary Elderwood Sweetroots enter normal inventory
  -> output provenance records the home plot and preserves seed provenance
  -> existing consume / craftIngredient / trade sinks remain available
  -> cultivation work proficiency reduces later preparation/tending duration
```

Authority decisions:

- `state.cultivation` is new required durable Game State authority;
- crop growth is timestamp-derived and creates **no crop-owned long-lived timed task**;
- only short preparation/tending labor uses existing `workTaskEngine` / timed-task ownership;
- inventory owns the physical propagation input and harvest output;
- resource provenance stays on the existing Sweetroot item instead of creating a duplicate crop item;
- work proficiency owns repeated-practice efficiency through new stable proficiency id `cultivation`;
- semantic Journal/context actions use direct cultivation intents, not command strings;
- recommendation integration does not let a merely ready cultivation bed displace existing active/ready commitment, livelihood, home, or recovery decisions.

Version decision on #378:

```text
Product      0.8.600.52 -> 0.8.700.1
Package      0.8.600    -> 0.8.700
Game State   12         -> 13
Data         37         -> 38
Account Save 5 unchanged
Benchmark    3 unchanged
```

No Game State 12 -> 13 migration was added under the pre-alpha current-schema-only policy.

Focused evidence:

- Game State 13 requires cultivation before runtime normalization;
- forged crop timing and active-work links are rejected;
- real account save/load succeeds mid-growth and after tending;
- growth has no active crop timer/task;
- work tasks release after cultivation reconciliation;
- seed provenance survives planting and is nested into harvest provenance;
- harvest cannot replay or duplicate output;
- cultivation mastery reduces later hands-on labor duration;
- Journal/browser rendering exposes ordinary actions without leaking raw plot/timestamp/provenance internals.

No standalone `npm run census` output was recorded in this pass. The bounded proof reuses an existing canonical item and does not add a census-counted place, NPC, service, creature, resource source, recipe, ability, quest, companion, or transport service, so no claimed scale-count increase is recorded.

### Landing gate

Before starting `0.8.800`:

1. refresh `main` and PR #378 status;
2. if #378 is still unmerged, do not start an independent next track by default;
3. merge/close/replace #378 only with explicit authorization;
4. after landing, refresh the handoff and mark 0.8.700 DONE.

## 0.8.800 — Earned Routine Delegation

**Status: READY NEXT only after 0.8.700 lands. Not started.**

Player-facing question:

> Can established mastery, infrastructure, reputation, or wages reduce player attention spent on a solved routine without producing free resources or a second simulation clock?

Preferred first proof should delegate **one cultivation chore** rather than invent generic automation:

```text
manual Sweetroot routine proven
  -> player earns mastery / infrastructure / social access
  -> bounded helper or hired-labor option
  -> wages/material/time constraints remain real
  -> cultivation remains domain authority
  -> no free output and no second clock
  -> player attention decreases
```

Do not generalize until one real delegated routine proves ownership, cost, failure, save/load, and exactly-once consequences.

## 0.8.900 — Household & Community Continuity

**Status: QUEUED.**

Goal: make the foothold socially consequential rather than only storage/workstation/cultivation infrastructure. Target 2–3 additional recurring named relationships with distinct needs/schedules, possible additional companion breadth where justified, and multi-day livelihood/property consequences. No full romance framework yet.

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

Run when closing the phase:

```text
npm run census
npm test
npm run benchmark
npm run benchmark:sample
npm run hardening   # when lifecycle-sensitive work warrants it
```

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

**Open.** Use `npm run census` at the start/end of genuinely content-heavy tracks when it can actually be executed. The architecture supports substantially more content than is authored; Phase 0.9 should shift developer time toward connected regional content rather than another generic persistence-hardening chain without a concrete defect.

## Branch protection / required review

**DEFERRED to Phase 0.9 stabilization.** Current pre-alpha policy remains unprotected `main`; substantial cross-system feature work may still use a feature PR when risk warrants it, as 0.8.700 does.

## Supported save compatibility and migrations

**DEFERRED to `0.9.800` unless explicitly requested earlier.** Current pre-alpha policy remains exact current-schema only.

## Browser E2E and accessibility harness

**DEFERRED as a dedicated program to `0.9.700`.** Continue semantic DOM, keyboard, focus and POV tests during normal development.

## Hard performance budgets

**DEFERRED.** Benchmark 3 remains comparative evidence. Do not invent pass/fail numbers from noisy microbenchmarks; protocol changes require a Benchmark version decision.

## Balance certification

**DEFERRED.** Green mechanics tests do not mean the game is balanced.

## Quality/HQ crafting depth

**DEFERRED.** Add only when quality creates meaningful material/tool/proficiency decisions.

## Mounts, warehouses and large-logistics breadth

**DEFERRED.** Stress existing carried-load, transport, home storage, and cultivation authorities with real content first.

## Romance/deep social-life framework

**DEFERRED beyond 0.8.900.** Prove broader authored social characters with goals, schedules, boundaries and useful non-romance roles first.

# Standard bounded-pass pipeline

```text
1. Select one player-facing or repository-risk question.
2. Identify existing authority and production caller.
3. Define explicit non-goals.
4. Write the smallest end-to-end proof.
5. Implement runtime/data first.
6. Add focused deterministic tests.
7. Add realistic connected content for the changed system.
8. Run focused validation.
9. Run full Test + Benchmark evidence when coherent.
10. Freeze exact implementation SHA.
11. Synchronize roadmap/profile/catalog/docs only after freeze.
12. Update THREAD_HANDOFF.md last.
13. Stop; do not silently launch the next independent pass.
```

For lifecycle-sensitive systems, add ownership/cleanup and long-session evidence. For persistence changes, classify state before validation and make a deliberate Game State decision. For content-heavy work, run `npm run census` and record only output that actually ran.

# Handoff template

```text
Current main SHA:
Active branch / PR:
Validated implementation SHA:
Product / Package / Account Save / Game State / Data / Benchmark:
Active pass:
Pass status: active | blocked | validated-pending-landing | complete
Completed behavior:
Exact validation evidence:
Known failures/blockers:
Files/authorities to inspect next:
Next bounded unit:
Deferred work discovered but not started:
Do-not-redo notes:
```

`THREAD_HANDOFF.md` should remain short enough to read first. Historical detail belongs in roadmap/version history, git, or this queue rather than being recopied into every handoff.
