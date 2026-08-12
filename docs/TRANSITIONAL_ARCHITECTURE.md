# Transitional Architecture

This document records the seams that are intentionally temporary between the current 0.4 foundation and the planned simulation/capability architecture. It exists to prevent future implementation work from accidentally hardening scaffolds that are scheduled to be replaced.

The design authority remains `docs/DEVELOPMENT_DIRECTION.md`. The release gates remain `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Purpose

The current repository is useful foundation code, but several concepts still reflect the earlier FFXI-oriented scaffold. New work should preserve working behavior while avoiding deeper coupling to those assumptions.

The transition strategy is evolutionary:

- preserve current tested systems;
- introduce new contracts beside them;
- adapt representative paths first;
- migrate persistent state explicitly when required;
- remove transitional assumptions only when their replacement is tested.

Do not perform a broad rewrite merely because a later architecture is known.

## Main-job and job-switching state is transitional

Current player state still contains concepts such as:

```text
player.jobs.mainJobId
player.jobs.mainJobName
player.jobs.level
player.jobs.unlocked
```

and current systems may use the active main job for level progression, skill-cap scaffolding, equipment eligibility, and legacy FFXI-facing descriptions.

These fields are compatibility scaffolds, not the long-term definition of what the character is capable of doing.

### Long-term rule

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

A job/discipline is a recognizable training tradition or archetype. The character does not transform into another person or magically forget learned abilities when changing equipment.

Long-term action eligibility should derive from some combination of:

- learned capability/knowledge;
- proficiency/mastery;
- required or preferred equipment;
- preparation and selected loadout;
- resources such as MP, stamina, TP, ammunition, reagents, or charges;
- current physical/status condition;
- environmental/context requirements;
- specific formal training where an advanced technique genuinely requires it.

A future capability may therefore be usable across several traditional job classifications when its actual requirements are met.

### Rules during the transition

Until the 0.6 capability/discipline work lands:

1. Do not delete `player.jobs` or the current progression paths merely to anticipate the new model.
2. Do not add new permanent rules whose only justification is `current main job == X` unless they are explicitly documented as temporary compatibility behavior.
3. Prefer character-owned proficiency state over new per-job copies. Existing `player.progression.skills[skillId]` remains the intended character-owned location.
4. Equipment eligibility may continue using current job data where already implemented, but new ability eligibility should be designed so it can later accept capability/equipment/preparation predicates.
5. Job names remain valuable content and identity labels; only the magical job-switch interpretation is being retired.

## Structured action seam

`js/text/systems/actionResult.js` defines the first engine-facing action contract.

The intended direction is:

```text
engine action
  -> semantic outcome/code/data
  -> optional semantic events
  -> UI/command adapter renders prose
```

Engine consumers should prefer `action`, `code`, `outcome`, and `data` rather than parsing message strings.

The non-enumerable `.message` / `.reason` aliases are compatibility aids for older command-facing callers. They are not a reason to keep adding prose-dependent game logic.

Only representative paths need to migrate at first. Do not mass-convert every engine solely for stylistic consistency.

## Semantic event seam

`js/text/systems/semanticEventEngine.js` provides bounded observational events.

Events are intended for systems such as:

- objectives and quests;
- end-of-day summaries;
- achievements;
- project completion;
- relationship/reputation reactions;
- interruption handling;
- diagnostics and tests.

Events are **not** authoritative event sourcing. Game state remains the source of truth. Event history may be bounded or absent in an older save, and consumers must tolerate that distinction where appropriate.

Consumers should inspect event types and structured data rather than command-log prose.

## Persistence seam

`js/text/systems/migrationEngine.js` and `saveMigrations.js` now provide ordered migrations for versioned persistent structures.

Rules:

- a persistent shape change that invalidates an existing current save must have a registered ordered migration or an explicit reset decision;
- future versions must be rejected rather than silently interpreted as current;
- `reviveGameState()` remains useful for restoring object references after JSON decoding, but it is not the migration system;
- Account Save, Game State, Data, and product versions answer different questions and must not be bumped automatically together.

Optional observational fields that can be created lazily and do not invalidate current saves do not require a Game State bump solely because they now appear on new states.

## World-time seam

The current `tickEngine.js` is a wall-clock scheduling/dispatch scaffold. It uses real elapsed milliseconds and must not become the authoritative game calendar.

The 0.5 world-time architecture should introduce a deterministic simulation clock with state such as total simulated seconds and derived date/time values.

The boundary should become:

```text
wall-clock scheduler (optional)
        |
        v
request simulation advancement
        |
        v
deterministic world clock
        |
        v
tasks / travel / projects / statuses / events
```

Tests and direct commands must be able to advance world time exactly without `Date.now()`, sleeping, or waiting for a real interval.

The existing live tick scaffold may later become one way to request advancement at normal speed. It should not calculate the canonical world date by itself.

## Travel as the current integration pilot

Travel is intentionally the first path through the new seams because it already has:

- a clear start action;
- duration;
- progress;
- completion;
- location change;
- user-facing text;
- restrictions;
- natural future interaction with world time and interrupts.

Current travel therefore demonstrates:

```text
startTravel
  -> ActionResult
  -> travel.started event

advanceTravel
  -> state transition
  -> travel.arrived event
```

During 0.5, travel should become a consumer of the canonical timed-task/world-clock model rather than being used as the model every other activity must copy.

## Existing systems to preserve

The following foundations are already useful and should be extended rather than replaced without cause:

- canvas-first text UI and command compatibility;
- local account/character persistence;
- ordered migrations;
- places, coordinates, atlas and movement;
- POI discovery and interaction;
- inventory containers and item normalization;
- equipment storage/equip/unequip flow;
- shops and basic economy transactions;
- battle state, rewards and deterministic RNG seams;
- character-owned skill values;
- ActionResult and semantic-event contracts;
- validation and Node test harness;
- benchmark/check pipeline.

Their formulas/content depth may be provisional even when their architectural boundaries are useful.

## 0.4 stabilization constraints

Before entering 0.5:

- current tests and benchmark must remain green;
- travel command behavior must remain compatible despite structured action/event internals;
- current saves supported by registered migrations must still load;
- no subsystem may require semantic-event prose parsing;
- world-time work must have a clean insertion point separate from wall-clock scheduling;
- no new feature should deepen magical main-job switching as the intended final capability model.

Meeting these conditions means the project can proceed into deterministic simulation time without another reset or architectural rewrite.
