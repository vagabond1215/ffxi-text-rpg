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

Phase 0.8 exit `npm run hardening` passed both long-session tests plus Benchmark Sample in hosted Check `32395959505`.

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
- `combatLoadoutEngine.js`;
- `projectEngine.js`;
- `resourceOpportunityEngine.js`;
- `transportEngine.js`;
- `workTaskEngine.js`.

`tests/architectureDebtGuard.test.js` makes this owner set executable.

The release point belongs to the domain that owns the durable consequence. A terminal task is released only after the owner has copied every required outcome and recorded the exactly-once transition.

## Game State 21 task integrity

The current-schema boundary validates:

- timed-task registry version, sequence, IDs, statuses, timing, data shape, duplicate IDs, and monotonic `nextSequence`;
- active travel -> matching travel task;
- active project -> `project.labor` task;
- active work -> matching `work.<kind>` task;
- active ability -> `ability.activation` task;
- active combat loadout transition -> matching `combat.loadout-transition` task with battle/actor ownership;
- active resource recovery -> matching `resource.recovery` task;
- active manual cultivation labor -> `state.cultivation.plot.activeWorkId` references the persisted active work record for that plot/action;
- cultivation delegation appointment state is internally coherent but **does not reference a timed task**, because delegated tending is timestamp-derived under cultivation authority.

An active owner may reference an active task or a task that has just completed and awaits owner reconciliation. Malformed current saves are rejected rather than reconstructed.

B4 adds no direct timed-task owner. Weapon cadence is stateless; kata configuration/cursor state persists directly under player progression/active battle; ranged shots are ordinary combat actions that mutate equipped ammunition synchronously through equipment authority.

B5 also adds no direct timed-task owner. Combat training is synchronous context around capability learning and semantic events. The B5 ammo-persistence repair changes validation of the physical `ammo` equipment slot, not task ownership or lifecycle.

0.9.300 Packet 1 also adds no direct timed-task owner. Axe/staff/club kata are authored configuration/execution data under the existing weapon-kata owner; Game State 19 changes durable configuration breadth, not task lifecycle.

0.9.300 Packet 2 adds no direct timed-task owner. Character affinity is synchronous durable progression under `player.progression.affinities`; affinity-gated kata substitutions reuse the existing kata, cadence, action, and combat-resolution paths. Game State 20 changes character progression persistence, not lifecycle ownership.

0.9.300 Packet 3 adds no direct timed-task owner and no persistence family. It changes canonical ability definitions only: novice elemental spells reuse existing ability activation tasks, combat action recovery, and `combatResolutionEngine`. Game State remains 20; Data 70 changes authored resolution/recovery metadata, not lifecycle ownership.

0.9.300 Packet 4 adds no direct timed-task owner or control scheduler. Thunder Cage uses the existing ability activation task and generic persisted status expiry. `combatTurnEngine` defers an already-owned enemy readiness interrupt to the active hard-disable expiry; it does not create a separate cage timer/task. Game State remains 20; Data 71 changes authored Thunder Cage semantics and shared status/readiness behavior.

0.9.300 Packet 5 adds no direct timed-task owner, geometry timer, or mutable battle-position resource. `combatGeometryEngine` is stateless: it derives encounter-relative formation from the already-owned combatant array and answers ring queries synchronously. Tempest Ring reuses the existing ability activation task and combat-resolution/action paths. Game State remains 20; Data 72 changes authored Tempest Ring geometry/resolution/recovery metadata, not lifecycle ownership.

0.9.300 Packet 6 also adds no direct timed-task owner. `combatFieldEngine` owns durable `activeBattle.fields` records directly; their fictional-time pulse deadlines are exposed as combat interrupt candidates and reconciled through `combatSimulationEngine`. The existing Umbral Well ability activation task ends when the cast resolves and does not remain as the field's scheduler. Game State 21 changes active-battle persistence because outstanding field center/source-snapshot/pulse state changes future resumable outcomes; Data 73 changes the authored Umbral Well impact/field contract. The direct timed-task-owner set therefore remains unchanged.

0.9.300 Packet 7 adds no direct timed-task owner and no durable propagation resource. Radiant Arc uses the ordinary ability activation task only until cast completion; its complete target-to-target recipient chain is then selected and resolved synchronously through `combatGeometryEngine`, `abilityEngine`, `combatResolutionEngine`, and `combatAttentionEngine`. No propagation deadline, interrupt provider, timer, field record, or background owner survives the action. Game State remains 21; Data 74 changes the authored Radiant Arc target/resolution/recovery contract. The direct timed-task-owner set remains unchanged.

## Cultivation lifecycle

Cultivation deliberately did **not** add a new direct timed-task owner. B3 later adds `combatLoadoutEngine.js` as the seventh current direct owner; cultivation still reuses work or timestamp-derived authority.

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
  -> status derives from persisted boundaries
  -> no crop timer / interval / callback / background job / timed-task record exists
  -> harvest clears crop and increments durable harvestCount exactly once
```

The crop survives save/load because its durable timestamps and seed provenance survive, not because a scheduler is recreated.

### Manual hands-on labor lifecycle

Preparation and manual tending reuse the existing work owner:

```text
cultivation action
  -> workTaskEngine.startWorkTask(...)
  -> one work record + one normal work timed task
  -> activity advancement reaches task boundary
  -> cultivation reconciliation copies durable consequence
  -> player cultivation mastery gain is recorded
  -> work owner marks complete
  -> work owner releases terminal timed task
```

### Earned delegation lifecycle

After the manual routine has been proven, one tending visit may be delegated for 12 gil:

```text
player pays wage once
  -> cultivation stores bounded assignment
      crop cycle
      arranged/scheduled/completion fictional-time boundaries
      wage
      active/completed status
  -> no direct timed-task record is created
  -> canonical world time reaches completion boundary
  -> cultivation reconciliation records tendedAtWorldSeconds exactly once
  -> assignment becomes completed
  -> no player work proficiency is awarded
  -> harvest later consumes the completed tending fact normally
```

The wage is not recomputed on load and the helper does not own an offline clock. Reconciliation cannot replay the helper visit.

### Ownership summary

| Concern | Owner |
| --- | --- |
| elapsed crop growth | canonical world time + persisted cultivation timestamps |
| plot/crop lifecycle facts | `state.cultivation` |
| paid tending appointment | `state.cultivation` |
| short manual preparation/tending labor | `workTaskEngine` |
| physical input/output | inventory/container authority |
| cultivated/seed history | resource provenance |
| player repeated-practice efficiency | work proficiency |
| player-facing action projection | semantic Journal/context view model |

No wall-clock/offline growth, crop scheduler, helper scheduler, cultivation interval, extra task engine, or passive background producer exists.

## NPC schedule and community lifecycle

NPC recurring availability also derives from canonical fictional time. Schedule definitions are authored data; there is no persisted per-NPC timer or social scheduler.

Household/community commitments use existing durable commitment and relationship records. Follow-up availability derives from recorded resolution day + authored delay. They do not create retained callbacks or a separate social clock.

## Combat loadout lifecycle

B3 adds one explicit direct timed-task owner:

```text
activeBattle.loadoutTransition
  -> combatLoadoutEngine starts one combat.loadout-transition task
  -> canonical world time reaches completion or combat hard-disable cancels
  -> owner applies no partial equipment mutation before successful completion
  -> owner synchronizes root/battle equipment + combat profile exactly once
  -> structured action/event evidence is durable
  -> owner releases terminal task
```

The active transition survives save/load through `activeBattle` plus its owner-task link. Generic inventory transfers and direct equipment mutation are blocked while the transition is active, so the pending source/destination plan cannot silently drift underneath the owner.

Cancellation records its durable event before task release and leaves the old equipment mechanically equipped. Successful completion applies the equipment mutation once, then uses existing combat recovery rather than a second loadout clock.

Repeated B3 lifecycle evidence is guarded by `tests/combatLoadoutEngine.test.js` and the direct-owner set remains executable in `tests/architectureDebtGuard.test.js`.

## Generic terminal history policy

There is still **no production generic/unowned timed-task producer**. Therefore no generic age/count pruning policy is justified. Future code that needs a new direct task owner must first define:

```text
owner -> durable consequence -> exactly-once reconciliation -> terminal release
```

Do not add global pruning preemptively or reconstruct missing task records as compatibility behavior.

## Review checklist

For lifecycle-sensitive changes, inspect:

- enter -> leave -> re-enter a view/location;
- mount -> unmount -> remount;
- subscribe -> replace owner -> dispose stale owner;
- start -> pause/resume -> finish an activity;
- task becomes terminal -> owner reconciles -> owner releases;
- save -> load -> continue before and after reconciliation;
- combat loadout start -> save/load -> completion/cancel -> equipment authority remains coherent -> terminal task released;
- cultivation growth timestamps persist -> world time advances -> readiness derives once;
- paid delegation persists -> completion boundary passes -> no duplicate charge/consequence;
- harvest -> repeat harvest attempt -> no duplicate output;
- scheduled NPC availability -> next window derives from world time without a timer;
- malformed current save -> reject before revival, never repair implicitly;
- repeated multi-day advancement with periodic persistence.

The desired steady state is bounded, explicitly owned resource growth after warm-up.
