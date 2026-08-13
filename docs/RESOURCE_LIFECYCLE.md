# Resource Lifecycle

Runtime resources that can outlive a single function call need explicit ownership. The purpose is to prevent repeated play, navigation, save/load, or state transitions from accumulating duplicate work or stale references.

## Ownership contract

For each new long-lived resource, answer:

1. Who owns it?
2. What creates it?
3. What prevents duplicate creation?
4. What happens when the owning activity/view/state is paused or replaced?
5. What ends or disposes it?
6. What state, if any, survives save/load?

Applicable resources include timers, scheduled callbacks, simulation tasks, listeners, subscriptions, observers, UI overlays, cached derived data, background jobs, and other retained runtime objects.

## Runtime rules

- Fictional simulation state remains authoritative; wall-clock scheduling is only an input mechanism where the current architecture defines it.
- Re-entering a view or activity must not silently register another equivalent listener, timer, or background job.
- Ending or replacing an owning activity should release resources that no longer have a valid owner.
- Save/load must not recreate both an old live resource and a second restored equivalent.
- Cached data must have a clear invalidation or bounded-retention rule.
- Presentation resources must not become hidden authority for game state.

## Review checklist

For changes that add or alter lifecycle-sensitive behavior, inspect at least the relevant repeated transitions, such as:

- enter -> leave -> re-enter a view/location;
- start -> pause/resume -> finish an activity;
- save -> load -> continue;
- open -> close -> reopen an overlay/view;
- switch between major information views repeatedly.

The expected steady state is bounded application-owned resource growth after warm-up.

## Validation direction

Focused tests should verify duplicate prevention and cleanup where the resource can be inspected deterministically. Browser/runtime profiling can supplement tests for retained UI objects or other resources that require a capable execution environment.

A future long-session harness should reuse these ownership contracts rather than relying only on total process memory as a signal.
