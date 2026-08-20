# Execution Pipeline and Continuation Queue

This document is the operational progression path for **Hearth & Horizon**. It minimizes repeated discovery when work moves to a new thread. It does not replace the design north star or roadmap.

Authority order remains:

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. this file
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. relevant architecture/runtime/tests for the active pass only

If this file and `THREAD_HANDOFF.md` identify the active boundary, do not restart a broad audit. Refresh `main`, verify the checkpoint, inspect only the named next-pass evidence, and proceed only when the user has authorized that pass.

## Current validated baseline

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Phase:         0.8 complete
Codename:      Household & Community Continuity
Runtime:       Node >=24
```

Frozen runtime:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

Evidence:

```text
Check 32395768383
Node 24.19.0
699/699 tests
Benchmark 3 success
Benchmark Sample success

Phase-exit validation Check 32395959505
Content Census success
Hardening success
Validation-only PR #380 closed without merge
```

See `docs/PHASE_0_8_EXIT_GATE.md` for the closure record.

## Fast restart protocol

```text
1. fetch current main SHA
2. read AGENTS.md
3. read docs/THREAD_HANDOFF.md
4. read this file
5. compare current main with the handoff
6. inspect only the named next-pass evidence
7. proceed only if that bounded unit is explicitly authorized
```

Only reopen broad discovery when `main` materially diverged from the handoff, the handoff says the next unit is unselected, the named pass became impossible because authority changed, or the user explicitly asks for a fresh audit/roadmap revision.

Do not rediscover closed Phase 0.4–0.8 work without a concrete reason.

# Completed Phase 0.8 queue

Statuses here are historical outcomes, not active work.

| Unit | Outcome |
| --- | --- |
| C0 continuation infrastructure + content census | DONE |
| `0.8.700` Cultivation & Stewardship | DONE |
| `0.8.800` Earned Routine Delegation | DONE |
| `0.8.900` Household & Community Continuity | DONE |
| Phase 0.8 exit audit | DONE |

## `0.8.700` — Cultivation & Stewardship

The home Sweetroot bed uses persisted timestamps and existing world time, work, inventory, provenance and proficiency authorities. Growth creates no crop-owned timer/task. Preparation/tending are normal hands-on work. Harvest is exactly once and retains seed/home provenance.

Version decisions:

```text
Game State 12 -> 13
Data 37 -> 38
```

## `0.8.800` — Earned Routine Delegation

After one manual crop cycle, the player can pay 12 gil to arrange one Sweetroot tending visit. The appointment persists under cultivation authority, completes from canonical fictional time, creates no direct timed-task owner, grants no helper mastery, and is exactly once across save/load.

Version decision:

```text
Game State 13 -> 14
```

## `0.8.900` — Household & Community Continuity

Mira Fen, Mae Oris and Kiri Fen are persistent scheduled community contacts. Their home-produce commitments require Sweetroot provenance `plot-home-sweetroot-bed`, reject wild substitutes, and use existing commitment/relationship/wallet/inventory/schedule/event/save authorities. Journal actions are semantic commitment intents.

Version decision:

```text
Data 38 -> 39
Game State remains 14
```

## Phase 0.8 exit audit

All required commands passed:

```text
npm test                 699/699
npm run benchmark        success
npm run benchmark:sample success
npm run census           success
npm run hardening        success
```

Current census:

```text
places/localities       26 / mechanics floor 10
named NPCs              12 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         50 / 200
recipes/processes       11 / 75
abilities/techniques     5 / 100
quests/contracts         8 / 30
companions                1 / 4
transport services        3 / 5
```

Mechanics-scale gate: **NOT READY**. Largest relative gap: abilities/techniques.

# Current decision boundary

There is **no active implementation unit** after Phase 0.8 closure.

The next proposed phase is Phase 0.9. Opening it requires explicit authorization. Do not infer authorization from the roadmap, this queue, or the fact that Phase 0.8 is complete.

## Proposed `0.9.100` — Content Scale Gate A

**Status: PLANNED / NOT OPENED.**

Primary question:

> Can the existing architecture support materially greater authored breadth without turning content production into disconnected filler or duplicating runtime authorities?

The first Phase 0.9 planning packet should use the census to select connected regional content tranches. Priority is not simply the smallest numeric gap; content should create playable cross-system graphs.

Current evidence suggests special attention to:

- ability/technique breadth: 5/100 mechanics floor;
- recipe/process breadth: 11/75;
- named NPC breadth: 12/50;
- canonical items: 50/200;
- companion breadth: 1/4;
- quests/contracts: 8/30;
- ecology/resource/creature breadth.

Places are already 26/10, so adding empty geography is not a useful first response.

### Recommended Phase 0.9 opening governance decision

Before high-volume Phase 0.9 implementation begins, explicitly decide whether to transition to:

```text
protected main
  + PR-based track integration
  + required green hosted Check
```

The recommendation is yes once Phase 0.9 is opened. Do not change branch protection merely as a documentation side effect of closing Phase 0.8.

# Phase 0.9 progression envelope

These are ordered planning tracks, not blanket authorization.

| Track | Primary gate | Status |
| --- | --- | --- |
| `0.9.100` | Content Scale Gate A | PLANNED / NOT OPENED |
| `0.9.200` | Adventure vertical slices | QUEUED |
| `0.9.300` | Advanced combat/training | QUEUED |
| `0.9.400` | Economy/production depth | QUEUED |
| `0.9.500` | Quest/social depth | QUEUED |
| `0.9.600` | Playable-alpha content-scale push | QUEUED |
| `0.9.700` | Browser UX/accessibility/E2E hardening | DEFERRED |
| `0.9.800` | Supported persistence/release transition | DEFERRED |
| `0.9.900` | Release-candidate soak/performance/release hardening | DEFERRED |

# Outstanding improvements and deferred runs

## Content breadth — highest strategic debt

Open. Use `npm run census` at the start/end of genuinely content-heavy tracks. Do not game counts with disconnected filler.

## Branch protection / required review

Decision deferred to explicit Phase 0.9 opening. Recommended transition: protected `main` + required green Check + PR-based track integration.

## Supported save compatibility and migrations

Deferred to release-transition work unless explicitly requested earlier. Current pre-alpha policy remains exact current-schema only.

## Browser E2E and accessibility harness

Deferred as a dedicated program to `0.9.700`. Continue semantic DOM, keyboard, focus and POV tests during ordinary development.

## Hard performance budgets

Deferred. Benchmark 3 remains comparative evidence; do not invent pass/fail numbers from noisy microbenchmarks.

## Balance certification

Deferred. Green mechanics tests do not imply balance.

## Quality/HQ crafting depth

Deferred until quality creates real material/tool/proficiency decisions.

## Mounts, warehouses and large-logistics breadth

Deferred. Stress existing carried-load, transport, home storage and cultivation with real content first.

## Romance/deep social-life framework

Deferred. Broader authored people/goals/schedules/boundaries should precede a romance framework.

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
Validated implementation SHA:
Product / Package / Account Save / Game State / Data / Benchmark:
Active pass:
Pass status:
Completed behavior:
Exact validation evidence:
Known failures/blockers:
Files/authorities to inspect next:
Next bounded unit:
Deferred work discovered but not started:
Do-not-redo notes:
```

`THREAD_HANDOFF.md` should remain short enough to read first. Historical detail belongs in roadmap/version history, git, or this queue.
