# Resource Lifecycle

Runtime resources that can outlive a single function call need explicit ownership. The purpose is to prevent repeated play, navigation, save/load, remounting, or state transitions from accumulating duplicate work or stale references.

## Ownership contract

For each long-lived resource, answer:

1. Who owns it?
2. What creates it?
3. What prevents duplicate creation or stale-owner teardown?
4. What happens when the owning activity/view/state is paused or replaced?
5. What ends or disposes it?
6. What state, if any, survives save/load?

Applicable resources include timers, scheduled callbacks, simulation tasks, listeners, subscriptions, observers, UI overlays, cached derived data, background jobs, and retained runtime objects.

## Runtime rules

- Fictional simulation state remains authoritative; wall-clock scheduling is only an input mechanism where the architecture defines it.
- Re-entering or remounting a view/activity must not silently register another equivalent listener, timer, observer, or background job.
- Ending or replacing an owner releases resources that no longer belong to the current owner.
- A stale disposer must not tear down a newer resource that reused the same stable identifier.
- Save/load must not recreate both an old live resource and a second restored equivalent.
- Cached/history data needs an explicit invalidation or bounded-retention rule where justified.
- Presentation resources must not become hidden authority for game state.

## Current deterministic evidence

`tests/longSessionLifecycle.test.js` remains the accepted long-session/lifecycle smoke. Existing production-owner evidence proves repeated work/project/travel/ability/resource lifecycles return the task registry to **zero retained tasks** after reconciliation, including real save/load while owner tasks are active. Task IDs remain monotonic and are never reused.

This is deterministic state/lifecycle evidence, not a claim about process memory or browser heap retention.

## Wall-clock tick subscription ownership

`tickEngine` allows a stable subscription ID to be replaced by a newer owner. A stale disposer removes the subscription only if its exact subscriber record is still current.

`tests/tickLifecycle.test.js` guards replacement safety and explicit current-owner unsubscribe behavior.

## Browser root ownership

`js/text/ui/domRoot.js` owns active browser shell lifecycle. Remount first disposes the current enhancement observer and destroys the current DOM app. Repeated unmount is idempotent. `tests/domRootLifecycle.test.js` guards this boundary.

## Timed-task ownership — current contract

The generic timed-task authority exposes `releaseTimedTask(state, taskId)` for terminal tasks only. Releasing a terminal task removes the task record but never rewinds `nextSequence`; stable domain records/events may retain the old `taskId` as correlation.

Current direct runtime task owners remain exactly:

- `abilityEngine.js`;
- `campaignRecoveryEngine.js`;
- `projectEngine.js`;
- `resourceOpportunityEngine.js`;
- `transportEngine.js`;
- `workTaskEngine.js`.

`tests/architectureDebtGuard.test.js` makes this owner set executable.

The release point belongs to the domain that owns the durable consequence. A terminal task is released only after the owner has copied every required outcome and recorded the exactly-once transition.

## Game State 13 task integrity on PR #378

The proposed current-schema boundary validates:

- timed-task registry version, sequence, IDs, statuses, timing, data shape, duplicate IDs, and monotonic `nextSequence`;
- active travel -> matching travel task;
- active project -> `project.labor` task;
- active work -> matching `work.<kind>` task;
- active ability -> `ability.activation` task;
- active resource recovery -> matching `resource.recovery` task;
- active cultivation labor -> `state.cultivation.plot.activeWorkId` must reference the persisted active work record for that plot/action.

An active owner may reference an active task or a task that has just completed and awaits owner reconciliation. Malformed current saves are rejected rather than reconstructed.

## Cultivation lifecycle — 0.8.700

Draft PR #378 deliberately **does not add a seventh direct timed-task owner**.

Cultivation uses two different lifecycles:

### Crop growth lifecycle

```text
plant physical Sweetroot
  -> state.cultivation.plot.crop persists
      plantedAtWorldSeconds
      tendDueAtWorldSeconds
      readyAtWorldSeconds
      tendedAtWorldSeconds
      seedProvenance
  -> fictional world time advances normally
  -> status is derived by comparing persisted boundaries with world time
  -> no crop timer / interval / callback / background job / timed-task record exists
  -> harvest clears crop and increments durable harvestCount exactly once
```

The crop survives save/load because its durable timestamps and seed provenance survive, not because a scheduler is recreated.

### Hands-on labor lifecycle

Preparation and tending are real character work and reuse the existing work owner:

```text
cultivation action
  -> workTaskEngine.startWorkTask(...)
  -> one work record + one normal work timed task
  -> activity advancement reaches task boundary
  -> cultivation reconciliation copies durable consequence
      prepare: plot becomes prepared
      tend: crop receives tendedAtWorldSeconds
  -> cultivation mastery gain is recorded
  -> markWorkCompleted(...)
  -> work owner releases terminal timed task
```

`tests/playerCultivationStewardshipFlow.test.js` explicitly proves the preparation task is released, tending consequence does not replay, save/load preserves crop state without a growth task, and harvest cannot duplicate output.

### Ownership summary

| Concern | Owner |
| --- | --- |
| elapsed crop growth | canonical world time + persisted cultivation timestamps |
| plot/crop lifecycle facts | `state.cultivation` |
| short preparation/tending labor | `workTaskEngine` |
| physical input/output | inventory/container authority |
| cultivated/seed history | resource provenance |
| repeated-practice efficiency | work proficiency |
| player-facing action projection | semantic Journal/context view model |

No wall-clock/offline growth, crop scheduler, cultivation interval, extra task engine, or passive background producer exists.

## Generic terminal history policy

There is still **no production generic/unowned timed-task producer**. Therefore no generic age/count pruning policy is justified. Future code that needs a new direct task owner must first define:

```text
owner -> durable consequence -> exactly-once reconciliation -> terminal release
```

Do not add global pruning preemptively or reconstruct missing task records as compatibility behavior.

## 0.8.800 caution

Earned Routine Delegation is the proposed next track only after 0.8.700 lands. Delegating a cultivation chore must not convert timestamp-derived crop growth into a permanent background worker by accident. A helper may own a bounded paid/manual consequence only when its owner, costs, failure semantics, save/load behavior, and exactly-once reconciliation are explicit.

## Review checklist

For lifecycle-sensitive changes, inspect:

- enter -> leave -> re-enter a view/location;
- mount -> unmount -> remount;
- subscribe -> replace owner -> dispose stale owner;
- start -> pause/resume -> finish an activity;
- task becomes terminal -> owner reconciles -> owner releases;
- save -> load -> continue before and after reconciliation;
- growth timestamp persists -> world time advances -> readiness derives once;
- harvest -> repeat harvest attempt -> no duplicate output;
- malformed current save -> reject before revival, never repair implicitly;
- repeated multi-day advancement with periodic persistence.

The desired steady state is bounded, explicitly owned resource growth after warm-up.
