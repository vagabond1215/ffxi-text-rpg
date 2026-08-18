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
- Cached/history data needs an explicit invalidation or bounded-retention rule when it is safe to apply one.
- Presentation resources must not become hidden authority for game state.

## Current deterministic evidence

`tests/longSessionLifecycle.test.js` is the accepted long-session/lifecycle smoke. It proves both long-run bounded histories and mixed owner-managed task release.

Long-session evidence:

- one timed task survives repeated current-schema save/load as one task;
- its `task.started` event remains exactly once;
- completion reconciles exactly once and remains completed after another save/load;
- a second reconciliation does not manufacture another completion;
- 130 fictional days can advance deterministically, with current save/load every ten days;
- semantic event history remains bounded at 200 records with unique event IDs/sequences;
- day-summary history remains bounded at 120 summaries with unique day identities;
- final fictional time and persisted task/event/summary registry counts survive another save/load unchanged.

Mixed terminal-task evidence added at Product `0.8.600.17`:

```text
one completed generic/unowned terminal task is retained as the baseline
  -> work completes and releases its terminal task
  -> project labor begins
  -> real account save/load while project task is active
  -> project completes and releases its terminal task
  -> route travel arrives and releases its terminal task
  -> timed ability resolves and releases its terminal task
  -> resource recovery resolves and releases its terminal task
  -> save/load
  -> repeat three cycles
  -> task registry returns to the one-record baseline after every owner reconciliation
  -> task IDs remain monotonic and are never reused
```

This is deterministic state/lifecycle evidence, not a claim about total process memory or browser heap retention.

## Wall-clock tick subscription ownership

`tickEngine` allows a stable subscription ID to be replaced by a newer owner. The disposer returned to the old owner removes the subscription **only if that exact subscriber record is still current**.

```text
owner A subscribes id X
owner B replaces id X
owner A disposes
  -> owner B remains subscribed
explicit unsubscribe(X)
  -> current owner B is removed
```

`tests/tickLifecycle.test.js` guards both replacement safety and explicit current-owner unsubscribe behavior.

## Browser root ownership

`js/text/ui/domRoot.js` is the root lifecycle owner for the active browser shell.

A remount first disposes the current onboarding enhancement observer and destroys the current DOM app. `domApp.destroy()` owns removal of its host/window listeners and movement interval. A failed enhancement installation destroys the newly created app and leaves the root unmounted instead of leaking partially mounted resources. Repeated unmount is idempotent.

`tests/domRootLifecycle.test.js` guards remount teardown, idempotent unmount, and failed-install cleanup.

## Timed-task terminal ownership — current contract

The generic timed-task authority now exposes `releaseTimedTask(state, taskId)` for **terminal tasks only**. Active tasks cannot be released. Releasing a task removes only the heavyweight task record; stable domain records/events may retain `taskId` as historical correlation.

The release point belongs to the domain that owns the consequence. A terminal task is not released until the domain has durably copied every outcome it needs and emitted/recorded the exactly-once transition.

Current owners using this contract:

- campaign recovery — after recovery consequences/events reconcile;
- work — after completed, failed, awaiting-storage, or cancelled state/event is durable;
- projects — after completion or cancellation is durable;
- transport — after arrival or cancellation has updated travel/location state and emitted its event;
- abilities — after resolution/cooldown/effects or interruption state/event is durable;
- resource recovery — after recovered/failed-storage outcomes and completion event are durable.

An unreconciled terminal task is intentionally retained across save/load until its owner consumes it. This is explicitly tested for campaign recovery. Work/project/transport/ability/resource owners then remove terminal task records without erasing correlation IDs from their own durable records/results/events.

## Generic terminal history remains a separate policy decision

`timedTaskEngine` does **not** blindly prune all completed/cancelled records. The owner-gated release train removed the known domain-managed accumulation path, and the mixed soak proves those owners return to steady state.

A generic task with no domain owner may still remain terminal indefinitely by design. Before adding a central age/count cap, audit what such generic tasks represent and whether their history is needed for diagnostics, tests, or future consumers. If a retention cap is added, it must preserve all active tasks and must not become a substitute for domain reconciliation.

Do not solve retention by duplicating task state into consumers or by silently reconstructing missing task records.

## Review checklist

For lifecycle-sensitive changes, inspect the relevant repeated transitions:

- enter -> leave -> re-enter a view/location;
- mount -> unmount -> remount the browser shell;
- subscribe -> replace owner -> dispose stale owner;
- start -> pause/resume -> finish an activity;
- task becomes terminal -> owner reconciles consequence -> owner releases task;
- save -> load -> continue before and after owner reconciliation;
- open -> close -> reopen an overlay/view;
- repeated multi-day advancement with periodic persistence.

The desired steady state is bounded, explicitly owned resource growth after warm-up. Focused deterministic tests should prove duplicate prevention and cleanup where the resource can be inspected; browser/runtime profiling may supplement tests where heap/DOM retention requires a capable environment.
