# Architecture

Hearth & Horizon is an original text-first persistent fantasy life RPG built around one deterministic world state and one continuous character. This document describes current runtime authority, not speculative final architecture.

## Active browser path

```text
index.html
  -> js/main.js
      -> createDomRoot(...)
          -> mount()
              -> createDomApp(host)
                  -> authoritative game/save/intent services
                  -> createGameViewModel(state, uiState)
                  -> renderDomApp(...)
              -> installOnboardingEnhancements(host)
          -> unmount()
              -> dispose onboarding observer
              -> domApp.destroy()
                  -> remove host/window listeners
                  -> stop movement interval
```

The semantic DOM/CSS shell is the active player interface. Canvas code remains bounded regression/reference code.

## Authority rules

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, recovery, and day review share one canonical deterministic simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool/container state owns preparation, capacity, access, portable item location, carried-load facts, and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership.
- Projects own persistent material/labor progress and exactly-once completion state.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks rather than creating parallel stores or timers.
- Transport owns fares, cadence, departure, arrival, journey cargo snapshots, and service limits. It derives carried load from inventory and never trusts caller/UI cargo counts.
- Commitments own accepted/resolved/follow-up state and one-time rewards; relationship continuity remains a separate authority.
- NPC schedules are recurring authored availability evaluated against canonical fictional time; availability is derived, not serialized as a second clock.
- Campaign recovery remains the one player/party recovery authority.
- Maps, Journal guidance, transport/service boards, player information, home opportunity models, and social schedule decoration are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants; party authority owns recruitment, active membership, location continuity, safe separation/reunion, field approach, and battle synchronization.
- Ordinary presentation exposes what the character sees, knows, carries, remembers, needs, or can decide; implementation rationale stays outside normal play.

## Semantic action contract

Canonical `ActionResult` exposes only:

```text
ok
action
code
outcome
data
display
```

`actionSuccess()` / `actionFailure()` return that contract directly. The old non-enumerable `.message` / `.reason` aliases are removed. Adapters use `describeActionResult()` / `display.text` for prose and semantic fields for logic.

## Shared player-experience projections

`playerExperienceEngine`, `playerOpportunityEngine`, `playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, `playerInformationEngine`, and `playerSocialScheduleEngine` remain derived views/decorators over canonical domain authorities.

`activityAdvanceEngine` provides semantic advance-to-completion without a second clock. It composes travel, gathering/production work, recovery, and generic `project.labor`.

## Home, inventory, and carried-load authority

`projectEngine.js` is the persistent construction/work substrate. Projects own stable identity/status, material requirements/contributions, labor duration, linked tasks, timestamps, and bounded domain data.

Current canonical home/inventory state is rooted at `player.inventoryState`. Inventory owns container unlock/access/capacity/transfer and item location. `homeFurnishings.js` owns canonical furnishing definitions; `workstationEngine` derives workstation context; `productionEngine` owns recipe inputs/work/outputs/provenance/mastery.

`carriedInventoryEngine.js` centralizes the portable-carried container set and exposes deterministic carried-item queries plus atomic cross-container removal. `carriedLoadEngine.js` projects cargo units from those same definitions. Transport and commitments consume these authorities rather than duplicating container lists.

## Daily social availability authority

`npcSchedules.js` is the recurring NPC-availability catalog. `npcScheduleEngine` reads canonical `state.worldTime` and derives current availability, window end, next availability, and guidance. The same authority is enforced below presentation by locality interaction and commitment actions.

The current model is public availability at a static canonical NPC location, not autonomous multi-location pathfinding.

## Companion and recovery authority

`campaignRecoveryEngine.js` remains the one recovery authority for player and party consequences. Settlement recovery can include inactive recruited companions physically present in a safe settlement without silently activating them.

`partyEngine` owns persistent companion identity/membership/location/tactics state. It rejects unsafe abandonment of a downed companion before mutation. `localityClassificationEngine.js` owns the shared safe-settlement predicate.

## Persistence authority — strict current schema

Compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.27
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Character Runtime
```

`js/text/save.js` owns account/session/character persistence. Current storage keys are `hearthHorizonAccounts` and `hearthHorizonAccountSession`; accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

### Raw validation precedes revival

`currentGameStateSchema.js` validates the raw persisted Game State 6 before reference revival and before runtime `ensure*` helpers can normalize it. Current required domain-registry validation covers:

```text
timed tasks
  version, sequence monotonicity, unique ids, status/timing/data

active travel
  Travel State 2 plus matching task kind/channel/endpoints/deadline

projects
  version, sequence, stable ids, status, labor/material progress

commitments
  canonical definition ids and reward/follow-up bookkeeping

relationships
  version, npc-key/record consistency, integer dimensions, timestamps

resource opportunities
  version, sequence, stable ids/status, action definitions, persisted output rolls

ecology
  version, population/source child maps, canonical references, quantities, timestamps

party
  version, capacity, unique active membership, recruited records, identity/resources/tactics

ability runtime
  version, cooldown map and active activation structure
```

Separate active-owner link validation requires active project/work/travel/timed-ability/resource-recovery state to retain a matching active-or-just-completed timed task until owner reconciliation.

Malformed current state is rejected rather than repaired. In particular, Party and Ability `ensure*` normalization cannot reset a malformed Game State 6 payload into apparent validity, and ecology/project/continuity/resource registries cannot be lazily recreated on load. Historical lazy-init tests may still prove internal/new-state construction behavior; they are not pre-alpha save-compatibility promises.

`saveGame()` likewise refuses malformed current state rather than manufacturing required registries during persistence. The generic migration utility remains available only for a future deliberate compatibility requirement.

### State classification rule

Before tightening another raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state paths, not during current-save load.

This prevents raw validation from accidentally serializing projections or turning runtime convenience helpers into implicit migration code.

## Timed-task lifecycle ownership

Timed-task authority owns scheduling/progress/terminal status. Domain authority owns the semantic consequence and terminal release point.

Current direct production task creators are exactly:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

`tests/architectureDebtGuard.test.js` makes that set executable and requires each direct owner to depend on terminal release.

Lifecycle law:

```text
start task
  -> active owner state references task
  -> task becomes completed/cancelled
  -> owner commits durable consequence + exactly-once semantic transition
  -> owner calls releaseTimedTask
  -> task record removed
  -> domain record/event may retain historical taskId
```

`releaseTimedTask` rejects active tasks and never rewinds task sequence allocation. Production-style repeated owner lifecycles return the task registry to zero retained task records after reconciliation. There is currently no production generic/unowned timed-task producer and no accepted blind global pruning policy.

Positive current-schema persistence evidence exists across all six task owners: campaign recovery, project, travel, work, timed ability, and resource recovery preserve the relevant owner/task identity through their required save/load boundary and reconcile exactly once.

See `docs/RESOURCE_LIFECYCLE.md` for the detailed ownership contract.

## Other lifecycle ownership

### Tick subscriptions

Stable subscriber IDs may be replaced. The disposer returned to a subscriber removes only the exact record it created; an old owner cannot later remove a newer subscriber that reused the same ID.

### Browser root

`domRoot.js` owns the active `domApp` instance and onboarding enhancement disposer. Remount disposes the prior observer/app before replacement. Unmount is idempotent. A failed enhancement installation destroys the new app and leaves the root unmounted.

### Long-session state

`tests/longSessionLifecycle.test.js` proves deterministic 130-day advancement with periodic real current-schema save/load, bounded semantic-event/day-summary histories, exactly-once task transitions, and zero-retained-task steady state for repeated owner-managed gameplay lifecycles.

## Command/adapter boundary

Canonical command/slash routing no longer preserves the retired FFXI macro runtime surface. Legacy FFXI-derived research/reference datasets may remain bounded reference material but must not feed canonical world identity or persisted gameplay state merely for compatibility.

Generic UX abbreviations such as `?`, `h`, `inv`, or `char` remain ordinary parser shorthand where useful; they are not world-identity compatibility.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check runs on Node 24 LTS using `actions/checkout@v7` and `actions/setup-node@v6`, with concurrency cancellation and a bounded job timeout.

Latest exact-head runtime gate: PR #350 / exact head `5d0d8071d9f94cac818c43a1fe018583eb56286f` / Check `32174533957`, Node 24.19.0:

```text
575/575 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.381457 ms/op
enemy combat profiles   0.067924 ms/op
basic attacks            0.003165 ms/op
tick dispatch            0.000865 ms/op
direct route lookup      0.007660 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.357477 ms/op   6.21%
enemy profiles   0.064718 ms/op   8.92%
basic attacks    0.001198 ms/op 200.77%
tick dispatch    0.000698 ms/op  69.53%
route lookup     0.007425 ms/op  17.56%
```

Benchmark 1/2 results are not numerically comparable to Benchmark 3. No hard performance thresholds are accepted yet.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, recovery, production, transport, world knowledge, and bounded authored schedules rather than creating isolated management simulations, hidden lifecycle resources, or compatibility layers.

For future persistence hardening, audit remaining top-level/player state one bounded authority family at a time. Do not mechanically attach every runtime validator to load; first determine whether the data is true persisted authority, a projection, or construction convenience.
