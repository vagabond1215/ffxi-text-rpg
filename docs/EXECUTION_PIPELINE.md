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

Detailed future Phase 0.9 packet design is recorded in `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`. That file is a planning artifact, not independent authorization to open the phase.

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

Frozen gameplay/runtime implementation:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

Phase 0.8 evidence:

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

## Post-Phase-0.8 status audit and maintenance pass

**Status: DONE.**

The current-status audit found no gameplay/persistence blocker and did not change Product, Package, Account Save, Game State, Data, or Benchmark versions.

Maintenance changes:

- added `npm run audit:repo` to detect drift between runtime/package/profile/core docs/hosted Check;
- aligned local `npm run check` with Repository Audit + Test + Benchmark + Benchmark Sample;
- added the Repository Audit step to hosted `Check`;
- added `tests/repositoryContractAudit.test.js`;
- retired the obsolete pre-roadmap `docs/BASELINE_PIPELINE.md` instructions in favor of current authority documents.

Validated maintenance head:

```text
c3d610e1f3820248a20de28bdc605e82da29e6f1
```

Validation-only PR #381 / Check `32398650493` / Job `96521318203` passed:

```text
Repository Audit PASS
700/700 tests
Benchmark 3 success
Benchmark Sample success
```

PR #381 was closed without merge because the maintenance changes had already landed directly on `main`.

### Repository-hygiene note

Several historical validation branches and `feature/0.8.700-cultivation-stewardship` remain remotely. The available connector has no safe branch-delete action. They are manual cleanup debt, not active work or a runtime blocker. Do not continue new implementation from those stale branches.

## Fast restart protocol

```text
1. fetch current main SHA
2. read AGENTS.md
3. read docs/THREAD_HANDOFF.md
4. read this file
5. compare current main with the handoff
6. if Phase 0.9 is explicitly opened, read docs/PHASE_0_9_IMPLEMENTATION_PLAN.md
7. inspect only the named next-pass evidence
8. proceed only if that bounded unit is explicitly authorized
```

Only reopen broad discovery when `main` materially diverged from the handoff, the handoff says the next unit is unselected, the named pass became impossible because authority changed, or the user explicitly asks for a fresh audit/roadmap revision.

Do not rediscover closed Phase 0.4–0.8 work or the completed post-0.8 status audit without a concrete regression/change.

# Completed Phase 0.8 queue

| Unit | Outcome |
| --- | --- |
| C0 continuation infrastructure + content census | DONE |
| `0.8.700` Cultivation & Stewardship | DONE |
| `0.8.800` Earned Routine Delegation | DONE |
| `0.8.900` Household & Community Continuity | DONE |
| Phase 0.8 exit audit | DONE |
| Post-0.8 status audit / maintenance / planning pass | DONE |

Phase 0.8 established the connected life loop and closed without adding parallel simulation clocks, generic task engines, duplicate inventories, or duplicate progression authorities.

## Current census

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

Mechanics-scale gate: **NOT READY**. Largest relative gap: abilities/techniques. Places already exceed the mechanics floor, so empty geography is not a useful response.

# Current decision boundary

There is **no active implementation unit**.

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — remains **planned / not opened**. Opening it requires explicit authorization. Do not infer authorization from this queue, the roadmap, or `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`.

## Proposed `0.9.100` — Content Scale Gate A

**Status: PLANNED / NOT OPENED.**

Primary question:

> Can the existing architecture support materially greater authored breadth without turning content production into disconnected filler or duplicating runtime authorities?

### First future packet — Content Pack Scale Contract v2

The post-0.8 audit found that the current regional content-pack contract owns places, routes, transport services, ecology, gathering sources, items, NPCs, shops, recipes, quests, and relationships, but does **not** yet own several content families Phase 0.9 must scale heavily:

```text
abilities / techniques
capability / training definitions
NPC schedules
companions
```

Therefore the recommended first implementation packet after explicit Phase 0.9 opening is **Content Pack Scale Contract v2**, before mass content generation.

It should:

- define regional/shared ownership for the missing content families where appropriate;
- extend stable-ID collision and dependency validation;
- validate ability/training, NPC/schedule, and NPC/companion cross-references;
- extend generated scale fixtures to exercise the new collections;
- keep the census measuring canonical content rather than pack bookkeeping;
- preserve existing runtime authorities rather than creating pack-owned duplicate gameplay state.

Likely version impact must be decided from the actual implementation. A Data-version change is plausible; Game State should remain unchanged unless the packet introduces genuinely new durable player/world facts. Do not pre-open `0.9.100` versions from planning alone.

### Following Gate A tranches

After Pack v2 proves ownership/validation, `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md` proposes three dense regional tranches:

1. **Redstone Forge-Road** — mining, production, shops/services, caravan logistics, equipment, contracts and techniques.
2. **Elderwood Hunt-Timber** — creatures, forestry, body recovery, food/material processing, field techniques and recurring characters.
3. **Starfen Marshcraft-Practical Magic** — herbs/fungi, wetland ecology, medicine/cooking, practical magic, training, schedules and water/canal context.

Then run Gate A integration and census validation. Counts are planning bands, not filler quotas.

### Recommended Phase 0.9 opening governance decision

Before high-volume Phase 0.9 implementation begins, explicitly decide the transition to:

```text
protected main
  + PR-based track integration
  + required green hosted Check
```

The recommendation is yes once Phase 0.9 is explicitly opened. Keep current-schema-only persistence until a later deliberate release-transition work order changes that policy.

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
9. Run full Repository Audit + Test + Benchmark + Benchmark Sample evidence when coherent.
10. Run census for content-heavy work; hardening for lifecycle-sensitive work.
11. Freeze exact implementation SHA.
12. Synchronize roadmap/profile/catalog/docs only after freeze.
13. Update THREAD_HANDOFF.md last.
14. Stop; do not silently launch the next independent pass.
```

For persistence changes, classify state before validation and make a deliberate Game State decision. For content-heavy work, record only census output that actually ran.

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
