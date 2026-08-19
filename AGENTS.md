# Agent Work Protocol

This file defines repository-level operating rules for ChatGPT/Codex-style implementation agents. It is intentionally short enough to be read before work begins and authoritative for **how long an autonomous repository session may continue**.

## Required read order

Before implementing anything substantial:

1. `AGENTS.md` — this operating protocol.
2. `docs/THREAD_HANDOFF.md` — exact current repository state, completed work, blockers, and immediate next bounded action.
3. `docs/EXECUTION_PIPELINE.md` — durable active/next/deferred progression queue and thread-restart protocol.
4. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-world/content policy and scale targets.
6. `docs/ROADMAP.md` — phase and feature-track progression.
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
8. Relevant architecture/runtime files for the active bounded work only.

Do not restart broad discovery or design research when the handoff and execution pipeline already answer what is active and what comes next. Inspect current `main`, open PRs only when they exist, CI status, and recent commits before deciding whether the handoff is stale. Reopen broad discovery only when repository evidence materially diverges, the next unit is explicitly unselected, or the user asks for a fresh audit.

## Repository administration baseline

`PROJECT_PROFILE.yaml` is the machine-readable repository profile for project phase, Git posture, tool routing, validation, and active quality modules. It summarizes operating posture; it does not override the authority order above or the current handoff.

For implementation work, use these durable quality authorities when relevant to the changed surface:

- `docs/QUALITY_GATES.md` — repository-level completion and validation expectations;
- `docs/PERFORMANCE_BUDGET.md` — benchmark, responsiveness, and regression-baseline policy;
- `docs/RESOURCE_LIFECYCLE.md` — ownership and cleanup rules for timers, tasks, listeners, UI resources, caches, and other long-lived runtime state.

Repository evidence beats conversation memory. Do not claim tests, benchmarks, browser checks, heap/leak checks, census results, or other executable validation ran unless they actually ran in a capable environment. Use the least-powerful safe tool that can complete and validate the bounded request; documentation or connector evidence is not a substitute for a repository-capable execution surface when correctness depends on runtime commands.

For content-heavy work, `npm run census` is the progression indicator for repository planning-scale categories. A content target being incomplete is a roadmap fact, not a CI failure.

## Default Git workflow: work on `main`

This repository is currently in an early, single-maintainer development phase. **Work directly on `main` by default.**

- Do not create a branch or pull request solely as a routine safety ritual.
- Use a branch/PR only when the user explicitly asks for one, when a connector/tool requires one, for validation-only Check surfacing when direct-main CI cannot be inspected, or when a change is unusually risky enough that isolated review is materially useful.
- Existing implementation branches from older runs should be merged into `main` once their state is coherent enough to continue from there; do not keep stacking follow-up work on an old branch merely because it already exists.
- A fully green repository test suite is desirable but is **not currently a mandatory pre-merge gate** for every incremental development change. Run relevant validation when practical, distinguish stale assertions from real regressions, and record known failures in the handoff instead of using branch isolation as a substitute for progress.
- Validation-only PRs for already-direct-main checkpoints must be closed without merge after evidence is collected.
- When the project reaches a genuinely active stabilization/release phase, follow the execution pipeline and roadmap transition to protected `main`, required Check, and review-oriented work.
- Connector limitations may prevent remote branch deletion. If so, close validation/review work that can be handled, record stale branches for manual deletion, and continue new normal work on `main`.

## Pre-alpha compatibility posture

Hearth & Horizon is not production-ready and old local saves are **not** a design constraint during the current pre-alpha phase.

- Prefer one clean, explicit current schema and one clear authority over compatibility scaffolding, lazy reconstruction, duplicate fields, or adapter layers created only to preserve old saves.
- Breaking Game State, Account Save, or authored-data changes are acceptable when they materially simplify or standardize the current design. Bump the relevant schema/version contract and update tests/docs deliberately.
- Add a migration only when the user explicitly requires compatibility or when the migration is independently useful and does not complicate the canonical model.
- Existing migrations and compatibility adapters may remain until a bounded cleanup, but do not extend them reflexively.
- Existing plans defer a supported-save compatibility promise until Phase 0.9 release transition unless a future work order explicitly changes that policy.
- This policy does **not** relax deterministic behavior, validation, provenance, exactly-once ownership, content originality, or test discipline.

## Scope preservation

A user prompt is a bounded work order, not blanket authorization to execute the entire roadmap.

- Complete the requested unit and the directly necessary fixes, migrations, tests, documentation, and CI cleanup needed to leave that unit coherent.
- `Next`, `Following`, roadmap, execution-pipeline, handoff, and milestone sections describe future sequencing; they do **not** authorize an agent to keep launching subsequent independent milestones without returning to the user.
- A new explicit user message such as `continue` may authorize the immediate next bounded unit when `THREAD_HANDOFF.md` names it clearly; do not reinterpret it as authorization for all queued tracks.
- Do not turn a request to continue one track into an unbounded chain of PRs, research passes, refactors, content expansion, or later-version work.
- If additional safe work is obvious after the requested unit is complete, record it in `docs/EXECUTION_PIPELINE.md` or the handoff and stop.
- External research should be targeted to a concrete blocker or explicitly requested question. Avoid repeated broad/deep research passes when repository evidence is sufficient.

## Runtime quality discipline

For runtime, persistence, UI, simulation, content-scale, or performance work:

- identify the authoritative state owner and the real production caller before changing a helper in isolation;
- preserve deterministic fictional-time and simulation behavior where the existing architecture requires it;
- define ownership and cleanup for every new long-lived timer, listener, task, observer, subscription, cache, overlay, worker, or background job;
- do not allow repeated scene/view entry, save/load, pause/resume, combat entry/exit, or navigation cycles to accumulate duplicate resources;
- during pre-alpha, change persisted contracts cleanly when needed instead of preserving stale shapes by default; migrations are opt-in engineering work, not an automatic requirement;
- run the relevant focused tests plus the repository validation expected by the current handoff;
- use the existing benchmark as regression evidence and follow `docs/PERFORMANCE_BUDGET.md` before introducing hard thresholds;
- run `npm run census` before/after content-heavy tracks when it materially measures progress, but do not game the count by adding disconnected filler records;
- treat long-session/soak and resource-retention coverage as a required design consideration for systems that create persistent or repeatable runtime activity, even when the automated harness for that surface has not yet been implemented.

## Content progression discipline

The project has enough systems that authored breadth is now a first-class risk.

- Grow mechanics and content together; do not validate a major content system only against one or two toy records.
- Prefer cross-linked regional content packs with source/sink/topology/service/social relationships over disconnected global lists.
- Numeric content targets are lower-bound planning indicators, not permission to create filler.
- Every content-heavy pass should preserve originality, provenance, stable IDs, and cross-reference validation.
- Use `docs/EXECUTION_PIPELINE.md` to keep deferred content families visible instead of repeatedly rediscovering them.

## Hard autonomous-session budget

An autonomous repository session has a **2 hour 45 minute wall-clock maximum** from the start of active repo work for the current user prompt.

Operational checkpoints:

- **2:15 elapsed — stabilization checkpoint.** Reassess remaining scope, commit durable work, and make sure the repository can be handed off.
- **2:30 elapsed — no new implementation unit.** Do not begin a new milestone, broad refactor, research pass, or independent follow-on task. Only finish the currently active bounded unit, run essential validation, and prepare the handoff.
- **2:45 elapsed — hard report deadline.** Finish only the current atomic operation needed to avoid leaving the repository in a corrupt/incoherent state, persist work, update the handoff, and return a status report. Do not autonomously continue because more roadmap work is available.

Waiting on CI does not extend the budget. If a long-running or unavailable external check prevents completion, record the pending/failing state and report rather than idling indefinitely.

A new explicit user message can start a new autonomous session with a fresh budget. Broad instructions such as "continue through the roadmap" must still be chunked into separate sessions; no single session should exceed this limit.

### Fallback when elapsed time cannot be measured reliably

If the execution environment cannot reliably track wall-clock elapsed time, use a **maximum of 6 autonomous work cycles** for the prompt.

One cycle is one bounded loop of:

```text
inspect/plan -> implement -> test/validate -> commit-or-status inspection
```

Rules:

- Cycles 1-5 may implement the requested work.
- Cycle 6 is stabilization/handoff only: fix only immediately blocking breakage, run essential validation, update `docs/THREAD_HANDOFF.md`, and report.
- Do not reset the cycle count because a new safe follow-on task was discovered. Only a new user message starts a new budget.

The wall-clock budget is primary; the cycle limit is a fallback guardrail, not permission to exceed 2:45 when elapsed time is known.

## Required end-of-session handoff

Before returning from a substantive repo session, update `docs/THREAD_HANDOFF.md` when the repository state or immediate next work changed. The final status should make it possible for another thread to continue without reconstructing the session from chat history.

Record at minimum:

- current `main` SHA and any relevant validation/review PR;
- validated implementation/runtime SHA;
- target product/subversion and schema/data decisions;
- active pass and whether it is active, blocked, or complete;
- what was completed in this session;
- tests/benchmarks/census/CI status actually observed;
- known failures or blockers;
- exact files/authorities the next thread should inspect;
- the next bounded work unit that was **not** started;
- deferred work discovered but deliberately not started;
- explicit do-not-redo notes when a prior audit/discovery sequence is closed.

Keep the handoff concise. Historical detail belongs in `docs/ROADMAP.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/EXECUTION_PIPELINE.md`, and git history rather than being recopied into every thread handoff.

## Project intent that must survive handoffs

These are condensed reminders; the authoritative detail remains in the docs above.

- The canonical game is the original **Hearth & Horizon** setting. FFXI-derived material is legacy research/reference/migration material, not a source of player-facing canon.
- Do not introduce or preserve FFXI-specific proper nouns or wording in new canonical content merely because legacy data used them. Re-express useful mechanics/data in original project terminology and context.
- Disciplines/jobs are not magical identity transformations. The character remains one person; learned capabilities persist. Actual capability use is constrained by learned skill, proficiency, equipment/tool requirements, resources, preparation, status, and context.
- High-volume content generation follows stable original-world IDs, content-pack architecture, provenance/source-sink rules, and validation. Do not mass-produce content on top of transitional legacy nomenclature.
- Prefer bounded, coherent current-model refactors over compatibility scaffolding or unbounded rewrites; pre-alpha save breakage is acceptable when it materially improves the canonical design.
- Follow the repository version protocol and milestone gates; do not advance product versions merely because incidental work was performed.
