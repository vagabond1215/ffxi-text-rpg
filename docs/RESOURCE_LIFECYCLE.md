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

`tests/longSessionLifecycle.test.js` is the accepted long-session smoke. It currently proves:

- one timed task survives repeated current-schema save/load as one task;
- its `task.started` event remains exactly once;
- completion reconciles exactly once and remains completed after another save/load;
- a second reconciliation does not manufacture another completion;
- 130 fictional days can advance deterministically, with current save/load every ten days;
- semantic event history remains bounded at 200 records with unique event IDs/sequences;
- day-summary history remains bounded at 120 summaries with unique day identities;
- final fictional time and persisted task/event/summary registry counts survive another save/load unchanged.

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

## Timed-task terminal history — unresolved ownership seam

`timedTaskEngine` currently retains completed/cancelled task records. A central age/count prune was audited during the `0.8.600.8`–`.12` hardening train and **was deliberately not implemented**.

Several domain records can remain active while their linked timed task is already terminal and later reconcile by task ID. Blindly pruning terminal task records in the generic task engine could therefore orphan domain reconciliation or manufacture inconsistent state.

A future task-retention change must first define the domain-owned release/reconciliation contract for projects, work, resource recovery, transport, abilities, and any other task-linked state. Only after those owners can prove they no longer require a terminal task record should generic retention be bounded or compaction be introduced.

Do not solve this by duplicating task state into each consumer or by silently reconstructing missing task records.

## Review checklist

For lifecycle-sensitive changes, inspect the relevant repeated transitions:

- enter -> leave -> re-enter a view/location;
- mount -> unmount -> remount the browser shell;
- subscribe -> replace owner -> dispose stale owner;
- start -> pause/resume -> finish an activity;
- save -> load -> continue;
- open -> close -> reopen an overlay/view;
- repeated multi-day advancement with periodic persistence.

The desired steady state is bounded, explicitly owned resource growth after warm-up. Focused deterministic tests should prove duplicate prevention and cleanup where the resource can be inspected; browser/runtime profiling may supplement tests where heap/DOM retention requires a capable environment.
