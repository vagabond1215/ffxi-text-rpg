# 0.4 Foundation Exit Gate

This document records the evidence used to close the 0.4 foundation phase and authorize the start of 0.5 deterministic simulation-time work.

The authoritative design direction is `docs/DEVELOPMENT_DIRECTION.md`. The release criteria are defined by `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Exit decision

0.4 may close when the project has a stable enough architectural seam to add deterministic world time without another reset or broad rewrite.

The required gates are satisfied by the 0.4.100 through 0.4.600 tracks, subject to the repository test/benchmark gate remaining green on the 0.4.900 integration PR.

## Gate 1 — Direction and version protocol are authoritative

Satisfied.

- `docs/DEVELOPMENT_DIRECTION.md` defines the long-term fantasy-life RPG direction.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` defines `MAJOR.PHASE.TRACK.REVISION` product versions and release gates through 1.0.
- `docs/TRANSITIONAL_ARCHITECTURE.md` identifies scaffolds that must not be mistaken for final design.
- formula reconstruction is no longer the roadmap spine.

## Gate 2 — Product and package versions are separated

Satisfied by 0.4.200.

- `PRODUCT_VERSION` is the four-segment game-development identity.
- `PACKAGE_VERSION` / `package.json.version` remain valid three-part SemVer.
- Account Save, Game State, Data, Benchmark, and system versions remain independent counters.

## Gate 3 — Ordered persistence migration exists

Satisfied by 0.4.300.

- versioned values migrate one registered step at a time;
- missing paths and future versions fail deterministically;
- supported Account Save and Game State migrations have unit/integration coverage;
- `reviveGameState()` remains reference repair rather than the compatibility strategy.

## Gate 4 — Structured action seam exists

Satisfied by 0.4.400.

- `ActionResult` separates semantic action/outcome/code/data from display text;
- travel start is the representative migrated path;
- command-facing compatibility remains available through transitional adapters;
- new semantic consumers do not need to parse action prose.

## Gate 5 — Semantic event seam exists

Satisfied by 0.4.500.

- bounded semantic event history exists;
- event IDs and event types are stable structured identifiers;
- travel emits `travel.started` and `travel.arrived`;
- event consumers can filter on structured data without parsing command logs;
- event history is observational, not event sourcing or authoritative state history.

## Gate 6 — Existing foundation remains functional

Satisfied by the repository test and benchmark suite plus 0.4.600 readiness checks.

The preserved foundation includes:

- canvas-first text UI and command adapters;
- account/character persistence;
- inventory/container/equipment systems;
- shops and basic economy;
- places, coordinates, atlas, POIs, travel and aggro scaffolds;
- battle/reward/status/RNG scaffolds;
- character-owned skill state;
- validation, benchmark, version and CI pipelines.

No broad rewrite was required to introduce migrations, ActionResult, or semantic events.

## Gate 7 — Transitional job assumptions are explicit

Satisfied by 0.4.600 documentation/readiness work.

Current main-job fields remain compatibility scaffolding until the 0.6 capability migration.

The intended long-term rule remains:

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

0.5 world-time work must not deepen magical job-switching assumptions.

## Gate 8 — Deterministic world time has a clean insertion point

Satisfied.

The existing `tickEngine.js` remains a wall-clock scheduler/dispatcher and is not authoritative simulation time.

Readiness tests prove optional deterministic `worldTime` state can coexist with current state and can be observed by semantic events without being mutated by the wall-clock tick scaffold.

The 0.5 architecture can therefore introduce:

```text
optional wall-clock scheduler
        -> request exact simulation advancement
        -> deterministic world clock
        -> tasks/travel/projects/status/events
```

without making `Date.now()` the game calendar.

## 0.4 closure rule

The 0.4 phase is considered complete when the 0.4.900 PR:

1. reports product version `0.4.900.0`;
2. passes the complete Node test suite;
3. passes the repository benchmark;
4. leaves `main` with no unresolved foundation-blocking regression.

The existence of unfinished gameplay systems does not block 0.4 closure. 0.4 is a foundation phase, not a content-complete game phase.

## Authorized next phase

After 0.4.900 merges, begin:

```text
0.5.100 — Deterministic world clock
```

The first world-time implementation should remain deliberately small:

- canonical simulated time stored in game state;
- exact deterministic advancement by a requested number of seconds/minutes;
- derived day/time formatting;
- no dependence on `Date.now()` for canonical time;
- tests for exact rollover behavior;
- no fast-forward scheduler, task engine, or day-summary system until their dedicated 0.5 tracks.
