# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. this file
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. only the architecture/runtime/tests named for the next bounded unit

If current `main` still matches this handoff's assumptions, **do not restart a broad repository audit**. The durable active/next/deferred queue now lives in `docs/EXECUTION_PIPELINE.md`.

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
Phase:         0.8 in progress
```

Gameplay behavior remains Product `.52`. The continuation/content-census pass does **not** change Product, Game State, Data, or Benchmark versions.

## Current repository checkpoint

Normal branch: `main`.

Pre-handoff documentation tip immediately before this file was written:

```text
f9d8e13f8cdd2472195f4db50f4df732fe6069f2
```

The commit containing this handoff is the final documentation tip for the session; a new thread must fetch current `main` first rather than assuming a hardcoded chat SHA.

Exact validated implementation/tooling freeze:

```text
b0c1e067a1907a8587a08a128126f9207c6d6134
```

Prior `.52` gameplay runtime freeze remains:

```text
0fb444aee8b6dbd3a35bb1d3b7662728d85fd691
```

## C0 — Continuation Infrastructure + Content Census — COMPLETE

The August 19, 2026 audit found that deterministic simulation, persistence ownership, and lifecycle discipline are comparatively mature while authored player-facing breadth is now the larger strategic gap.

C0 added a durable continuation system so future threads do not need to repeat that audit:

```text
docs/EXECUTION_PIPELINE.md
  -> active / ready-next / queued / deferred work
  -> fast restart protocol
  -> standard bounded-pass pipeline
  -> Phase 0.8 and 0.9 progression sequence
  -> outstanding/deferred work

js/text/systems/contentScaleGate.js
  -> criteria-driven mechanics / playable-alpha / 1.0 scale indicators

scripts/contentCensus.js
  -> npm run census
  -> npm run census -- --json

tests/contentScaleGate.test.js
  -> protects target definitions, counting, readiness and gap reporting
```

`AGENTS.md`, `PROJECT_PROFILE.yaml`, `README.md`, `ROADMAP.md`, `VERSIONING_AND_RELEASE_ROADMAP.md`, `PLAYER_EXPERIENCE_UPGRADE_PATH.md`, `QUALITY_GATES.md`, `PERFORMANCE_BUDGET.md`, and `RESOURCE_LIFECYCLE.md` were synchronized around that queue. Identified stale performance/lifecycle baseline wording was corrected.

The census is a progression indicator, not a CI failure threshold. Do not game it with disconnected filler content.

## Exact hosted validation for C0 implementation

Validation-only draft PR **#377** existed only to surface the normal pull-request `Check` for exact head `b0c1e067a1907a8587a08a128126f9207c6d6134`. It was closed **without merge** after success.

```text
PR:                  #377 validation-only, closed without merge
Check:               32308719621
Job:                 96247035026
Node:                24.19.0
npm:                 11.17.0
Tests:               692/692 passed
Failed/skipped:      0 / 0
Benchmark 3:         success
Benchmark Sample:    success
```

New focused tests all passed:

```text
content scale targets preserve repository planning lower bounds
default content census derives nonzero canonical breadth and supplemental evidence
content scale stage readiness is criteria-driven rather than calendar-driven
content scale report exposes outstanding gaps without treating them as failures
```

Benchmark 3 single run:

```text
player profiles  0.393820 ms/op
enemy profiles   0.070731 ms/op
basic attacks    0.003811 ms/op
tick dispatch    0.001062 ms/op
route lookup     0.007603 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.362912 ms/op   10.42%
enemy profiles   0.065795 ms/op    9.93%
basic attacks    0.001204 ms/op  200.40%
tick dispatch    0.000696 ms/op   33.93%
route lookup     0.006992 ms/op    9.64%
```

No hard performance threshold is accepted. `npm run census` was added and its underlying census logic was exercised by tests; do not claim a standalone census command output unless it is actually run in the next capable environment.

## Next bounded unit — `0.8.700` Cultivation & Stewardship

**Status: READY NEXT; selected by the fresh repo audit, not yet opened in runtime version metadata.**

A future explicit `continue` may proceed directly with this bounded unit after refreshing `main` and this handoff. Do not re-run the broad candidate-selection audit unless repository authority materially changed.

Player-facing question:

> Can a player turn a home/foothold and existing material economy into a multi-day cultivation loop whose output feeds food, medicine, trade, production, or commitments without creating a parallel clock or inventory?

Smallest proof:

```text
access plot
  -> prepare
  -> plant physical/provenance-bearing input
  -> canonical fictional time passes
  -> tend when meaningful
  -> harvest exactly once
  -> provenance-bearing output enters normal inventory
  -> output feeds at least three existing systems/sinks
  -> persistent work/cultivation mastery improves efficiency
```

### Inspect these first

Use repository/code search if exact filenames have moved, but start with these authorities instead of broad discovery:

```text
docs/EXECUTION_PIPELINE.md
docs/ROADMAP.md
docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md
js/text/systems/contentScaleGate.js
world-time / simulation authority
work-task + work-proficiency authority
project/home-infrastructure authority
inventory/container authority
resource provenance authority
ecology/gathering authority
production/economy/commitment sinks
semantic DOM intent/view-model paths
focused save/load and lifecycle tests for those systems
```

### Constraints for `0.8.700`

- canonical fictional time is the only growth clock;
- no passive wall-clock/offline growth authority;
- inventory owns physical inputs/tools/outputs;
- provenance stays explicit;
- existing work proficiency should own repeated-practice efficiency where appropriate;
- home/project authority owns durable infrastructure where appropriate;
- do **not** create one long-lived timed-task owner per crop by reflex;
- prefer persisted crop/plot state plus canonical-time derivation when sufficient;
- prove save/load mid-growth and exactly-once harvest;
- provide an ordinary semantic browser path without command expertise;
- run content-pack/cross-reference validation for added content;
- run `npm run census` before/after content-heavy changes when a capable execution surface is available;
- make Product/Data/Game State decisions from the actual changed contracts when implementation begins.

## Following queue — not started

```text
0.8.800  Earned Routine Delegation        QUEUED
0.8.900  Household & Community Continuity QUEUED
0.8 exit Phase 0.8 connected-life audit   QUEUED
```

Do not launch these during the `0.8.700` bounded pass merely because they are listed.

Phase 0.9 progression and planning windows are recorded in `docs/EXECUTION_PIPELINE.md` and `docs/ROADMAP.md`.

## Deferred work already recorded

Do not rediscover these as new surprises:

- protected `main` / required review transition — deferred to Phase 0.9 stabilization;
- supported-save compatibility/migrations — deferred to `0.9.800` unless explicitly requested earlier;
- dedicated real-browser E2E/accessibility program — deferred to `0.9.700`;
- hard performance thresholds — deferred until representative Benchmark 3 evidence supports them;
- balance certification — deferred until sustained content-scale play exists;
- quality/HQ crafting depth — deferred until it creates real decisions;
- mounts/warehouses/large logistics — deferred until current logistics are stressed by real content;
- deep romance framework — deferred beyond the bounded 0.8 social-breadth work.

## Do not redo

The following work is closed unless a concrete regression or changed requirement directly touches it:

```text
Phase 0.4–0.7 broad discovery
state.npcs persistence classification
state.enemies persistence classification
top-level state.log persistence classification
root player derived-cache serialization audit
active-battle identity/cache/player-link hardening sequence
```

## Session status

```text
Branch:                         main
C0 pass:                        complete
Validated implementation head: b0c1e067a1907a8587a08a128126f9207c6d6134
Validation PR:                  #377 closed without merge
Hosted Check:                   32308719621 success
Tests:                          692/692 passed
Benchmark 3 / Sample:           success / success
Known implementation failures:  none observed
Known blocker:                  none
Next bounded unit:              0.8.700 Cultivation & Stewardship
Next unit runtime work started:  no
```
