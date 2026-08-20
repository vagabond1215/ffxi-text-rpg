# Historical Baseline Pipeline

This file is retained as a historical process note from the repository's earliest reconstruction work. It is **not an active planning, versioning, architecture, or implementation authority**.

The old contents predated the current product-version protocol, deterministic fictional-time architecture, original-world migration, content-pack model, current-schema persistence policy, semantic DOM interface, and Phase 0.4–0.8 roadmap. In particular, the former `0.2.0` / Save 2 / Data 1 / Benchmark 1 version table, command-first workflow, live-tick-as-game-clock guidance, FFXI-oriented implementation checklist, and `0.3.0` next-version target are obsolete and must not be used to plan new work.

## Current authority

Read these instead, in order:

1. `AGENTS.md` — operating protocol and scope discipline.
2. `docs/THREAD_HANDOFF.md` — exact current checkpoint.
3. `docs/EXECUTION_PIPELINE.md` — active/next/deferred execution queue.
4. `docs/DEVELOPMENT_DIRECTION.md` — product/design north star.
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-world and content-scale policy.
6. `docs/ROADMAP.md` — phase/track progression.
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version and release protocol.
8. `docs/ARCHITECTURE.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, and `docs/RESOURCE_LIFECYCLE.md` for the relevant implementation surface.

Current runtime authority remains `js/text/version.js`; current package/runtime/tooling entry points remain `package.json`.

## Current baseline at retirement

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Phase:         0.8 complete
Codename:      Household & Community Continuity
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

The next proposed phase is Phase 0.9, but it is not opened merely by this file or by the roadmap. `docs/THREAD_HANDOFF.md` and `docs/EXECUTION_PIPELINE.md` define the current decision boundary.

## Historical ideas that remain valid in modern form

Some early process principles survived, but their current definitions live in the authorities above:

- define stable IDs, ownership, validation and persistence impact before adding durable state;
- keep domain logic independent of presentation/DOM code;
- add focused deterministic tests for new behavior;
- use benchmarks as regression evidence for runtime-heavy work;
- document version/schema/data impact deliberately;
- treat imported legacy material as reference until originalized and validated.

Do not revive the retired assumptions that wall-clock ticks are canonical game time, that commands are the primary player interface, that old saves require compatibility by default, or that high-volume canonical content should be built from inherited FFXI identity.
