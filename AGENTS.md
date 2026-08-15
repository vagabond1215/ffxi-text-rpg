# Agent Work Protocol

This file defines repository-level operating rules for ChatGPT/Codex-style implementation agents. It is intentionally short enough to be read before work begins and authoritative for **how long an autonomous repository session may continue**.

## Required read order

Before implementing anything substantial:

1. `AGENTS.md` — this operating protocol.
2. `docs/THREAD_HANDOFF.md` — current repository state, completed work, blockers, and immediate next action.
3. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-world/content policy.
5. `docs/ROADMAP.md` — implementation sequence and milestone gates.
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
7. Relevant architecture/runtime files for the requested work.

Do not restart broad discovery or design research when these documents already answer the question. Inspect `main`, open PRs only when they exist, CI status, and recent commits before deciding what remains.

## Repository administration baseline

`PROJECT_PROFILE.yaml` is the machine-readable repository profile for project phase, Git posture, tool routing, validation, and active quality modules. It summarizes operating posture; it does not override the authority order above or the current handoff.

For implementation work, use these durable quality authorities when relevant to the changed surface:

- `docs/QUALITY_GATES.md` — repository-level completion and validation expectations;
- `docs/PERFORMANCE_BUDGET.md` — benchmark, responsiveness, and regression-baseline policy;
- `docs/RESOURCE_LIFECYCLE.md` — ownership and cleanup rules for timers, tasks, listeners, UI resources, caches, and other long-lived runtime state.

Repository evidence beats conversation memory. Do not claim tests, benchmarks, browser checks, heap/leak checks, or other executable validation ran unless they actually ran in a capable environment. Use the least-powerful safe tool that can complete and validate the bounded request; documentation or connector evidence is not a substitute for a repository-capable execution surface when correctness depends on runtime commands.

## Default Git workflow: work on `main`

This repository is currently in an early, single-maintainer development phase. **Work directly on `main` by default.**

- Do not create a branch or pull request solely as a routine safety ritual.
- Use a branch/PR only when the user explicitly asks for one, when a connector/tool requires one, or when a change is unusually risky enough that isolated review is materially useful.
- Existing implementation branches from older runs should be merged into `main` once their state is coherent enough to continue from there; do not keep stacking follow-up work on an old branch merely because it already exists.
- A fully green repository test suite is desirable but is **not currently a mandatory pre-merge gate** for every incremental development change. Run relevant validation when practical, distinguish stale assertions from real regressions, and record known failures in the handoff instead of using branch isolation as a substitute for progress.
- When the project reaches a genuinely active/stabilization/release phase, this rule can be tightened to require protected branches, reviews, and green CI before merge.
- Connector limitations may prevent remote branch deletion. If so, merge/close what can be handled through the connector, record the stale branch for manual deletion, and continue new work on `main`.

## Pre-alpha compatibility posture

Hearth & Horizon is not production-ready and old local saves are **not** a design constraint during the current pre-alpha phase.

- Prefer one clean, explicit current schema and one clear authority over compatibility scaffolding, lazy reconstruction, duplicate fields, or adapter layers created only to preserve old saves.
- Breaking Game State, Account Save, or authored-data changes are acceptable when they materially simplify or standardize the current design. Bump the relevant schema/version contract and update tests/docs deliberately.
- Add a migration only when the user explicitly requires compatibility or when the migration is independently useful and does not complicate the canonical model.
- Existing migrations and compatibility adapters may remain until a bounded cleanup, but do not extend them reflexively.
- This policy does **not** relax deterministic behavior, validation, provenance, exactly-once ownership, content originality, or test discipline.

## Scope preservation

A user prompt is a bounded work order, not blanket authorization to execute the entire roadmap.

- Complete the requested unit and the directly necessary fixes, migrations, tests, documentation, and CI cleanup needed to leave that unit coherent.
- `Next`, `Following`, roadmap, handoff, and milestone sections describe future sequencing; they do **not** authorize an agent to keep launching subsequent milestones without returning to the user.
- Do not turn a request to continue one track into an unbounded chain of PRs, deep-research passes, refactors, or later-version work.
- If additional safe work is obvious after the requested unit is complete, record it in the handoff/report and stop.
- External research should be targeted to a concrete blocker or explicitly requested question. Avoid repeated broad/deep research passes when repository evidence is sufficient.

## Runtime quality discipline

For runtime, persistence, UI, simulation, or performance work:

- identify the authoritative state owner and the real production caller before changing a helper in isolation;
- preserve deterministic fictional-time and simulation behavior where the existing architecture requires it;
- define ownership and cleanup for every new long-lived timer, listener, task, observer, subscription, cache, overlay, worker, or background job;
- do not allow repeated scene/view entry, save/load, pause/resume, combat entry/exit, or navigation cycles to accumulate duplicate resources;
- during pre-alpha, change persisted contracts cleanly when needed instead of preserving stale shapes by default; migrations are opt-in engineering work, not an automatic requirement;
- run the relevant focused tests plus the repository validation expected by the current handoff;
- use the existing benchmark as regression evidence and follow `docs/PERFORMANCE_BUDGET.md` before introducing hard thresholds;
- treat long-session/soak and resource-retention coverage as a required design consideration for systems that create persistent or repeatable runtime activity, even when the automated harness for that surface has not yet been implemented.

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

- current branch (`main` by default) and any relevant PR;
- target product/subversion;
- what was completed in this session;
- tests/benchmarks/CI status;
- known failures or blockers;
- the next bounded work unit that was **not** started because the session ended.

## Project intent that must survive handoffs

These are condensed reminders; the authoritative detail remains in the docs above.

- The canonical game is the original **Hearth & Horizon** setting. FFXI-derived material is legacy research/reference/migration material, not a source of player-facing canon.
- Do not introduce or preserve FFXI-specific proper nouns or wording in new canonical content merely because legacy data used them. Re-express useful mechanics/data in original project terminology and context.
- Disciplines/jobs are not magical identity transformations. The character remains one person; learned capabilities persist. Actual capability use is constrained by learned skill, proficiency, equipment/tool requirements, resources, preparation, status, and context.
- High-volume content generation follows stable original-world IDs, content-pack architecture, and validation. Do not mass-produce content on top of transitional legacy nomenclature.
- Prefer bounded, coherent current-model refactors over compatibility scaffolding or unbounded rewrites; pre-alpha save breakage is acceptable when it materially improves the canonical design.
- Follow the repository version protocol and milestone gates; do not advance product versions merely because incidental work was performed.