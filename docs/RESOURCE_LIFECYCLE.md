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
- A stale disposer must not be able to tear down a newer resource that reused the same stable identifier.
- Save/load must not recreate both an old live resource and a second restored equivalent.
- Cached/history data needs an explicit invalidation or bounded-retention rule when it is safe and justified.
- Presentation resources must not become hidden authority for game state.

## Current deterministic evidence

`tests/longSessionLifecycle.test.js` is the accepted long-session/lifecycle smoke.

Long-session evidence:

- one deliberately low-level timed task survives repeated current-schema save/load as one task;
- its `task.started` and `task.completed` events remain exactly once;
- a second reconciliation does not manufacture another completion;
- 130 fictional days advance deterministically with current save/load every ten days;
- semantic event history remains bounded at 200 records with unique event IDs/sequences;
- day-summary history remains bounded at 120 summaries with unique day identities;
- final fictional time and persisted registry counts survive another save/load unchanged.

Production-owner evidence now proves repeated work/project/travel/ability/resource lifecycles return the task registry to **zero retained tasks** after reconciliation, including real save/load while an owner task is active. Task IDs remain monotonic and are never reused.

This is deterministic state/lifecycle evidence, not a claim about total process memory or browser heap retention.

## Wall-clock tick subscription ownership

`tickEngine` allows a stable subscription ID to be replaced by a newer owner. The disposer returned to the old owner removes the subscription only if that exact subscriber record is still current.

```text
owner A subscribes id X
owner B replaces id X
owner A disposes
  -> owner B remains subscribed
explicit unsubscribe(X)
  -> current owner B is removed
```

`tests/tickLifecycle.test.js` guards replacement safety and explicit current-owner unsubscribe behavior.

## Browser root ownership

`js/text/ui/domRoot.js` owns the active browser shell lifecycle.

A remount first disposes the current onboarding enhancement observer and destroys the current DOM app. `domApp.destroy()` removes its host/window listeners and movement interval. Failed enhancement installation destroys the newly created app and leaves the root unmounted. Repeated unmount is idempotent.

`tests/domRootLifecycle.test.js` guards remount teardown, repeated unmount, and failed-install cleanup.

## Timed-task ownership — current contract

The generic timed-task authority exposes `releaseTimedTask(state, taskId)` for terminal tasks only. Active tasks cannot be released. Releasing a terminal task removes the task record but does not rewind `nextSequence`; stable domain records/events may retain `taskId` as historical correlation.

The release point belongs to the domain that owns the consequence. A task is released only after the owner has durably copied every required outcome and recorded the exactly-once semantic transition.

Current direct runtime task owners are exactly:

- `abilityEngine.js`;
- `campaignRecoveryEngine.js`;
- `projectEngine.js`;
- `resourceOpportunityEngine.js`;
- `transportEngine.js`;
- `workTaskEngine.js`.

`tests/architectureDebtGuard.test.js` makes this owner set executable: another production module cannot begin creating timed tasks silently, and each allowed owner must depend on `releaseTimedTask`.

Current owner release points:

- campaign recovery — after recovery consequence/event reconciliation;
- work — after completed, failed, awaiting-storage, or cancelled transition/event;
- projects — after completion or cancellation;
- transport — after arrival/cancellation updates location/travel state and emits its event;
- abilities — after resolution/cooldown/effects or interruption state/event;
- resource recovery — after recovered/failed-storage outcome and completion event.

An unreconciled terminal task remains persisted until its owner consumes it. Campaign recovery directly proves the terminal-before-owner-reconciliation save/load boundary. Project, travel, work, timed ability, and resource recovery have active-task save/load continuation evidence. After terminal owner reconciliation, the task record is gone while domain correlation may remain.

## Current-schema task integrity

Game State 6 persistence now validates task ownership before revival/runtime access.

The raw current-schema boundary validates:

- timed-task registry version, sequence, IDs, statuses, timing, data shape, duplicate IDs, and monotonic `nextSequence`;
- active Travel State 2 shape and matching travel task kind/channel/endpoints/deadline;
- active project -> `project.labor` task ownership;
- active work -> matching `work.<kind>` task ownership;
- active timed ability -> `ability.activation` task ownership;
- active resource recovery -> matching `resource.recovery` task ownership.

An active owner may reference an active task or a task that has just completed and is awaiting owner reconciliation. A terminal owner record may retain a historical `taskId` after its task record has been released.

Malformed current saves are rejected rather than repaired. Runtime active-travel compatibility reconstruction has been removed; a missing or legacy-shaped active travel/task link is not silently rebuilt.

## Generic terminal history policy

There is currently **no production generic/unowned timed-task producer**. The low-level generic terminal task used by lifecycle tests deliberately remains retained because `timedTaskEngine` does not perform blind global pruning.

Therefore no generic age/count retention policy is currently justified. Future code that needs a new direct task owner must first define:

```text
owner -> durable consequence -> exactly-once reconciliation -> terminal release
```

If a future diagnostic/history use case introduces genuinely generic tasks, design retention from that concrete requirement. Do not add global pruning preemptively, duplicate task state into consumers, or reconstruct missing task records as compatibility behavior.

## Review checklist

For lifecycle-sensitive changes, inspect the relevant repeated transitions:

- enter -> leave -> re-enter a view/location;
- mount -> unmount -> remount the browser shell;
- subscribe -> replace owner -> dispose stale owner;
- start -> pause/resume -> finish an activity;
- task becomes terminal -> owner reconciles consequence -> owner releases task;
- save -> load -> continue before and after owner reconciliation;
- malformed current save -> reject before revival, never repair implicitly;
- open -> close -> reopen an overlay/view;
- repeated multi-day advancement with periodic persistence.

The desired steady state is bounded, explicitly owned resource growth after warm-up. Focused deterministic tests should prove duplicate prevention and cleanup where the resource can be inspected; browser/runtime profiling may supplement tests where heap/DOM retention requires a capable environment.
