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
```

The semantic DOM/CSS shell is the active player interface. Canvas code remains bounded regression/reference code.

## Authority rules

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, recovery, and day review share one canonical deterministic simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool/container state owns preparation, capacity, access, portable item location, carried-load facts, and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership.
- Projects own persistent material/labor progress and exactly-once completion state.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks rather than creating parallel stores or timers.
- Transport owns fares, cadence, departure, arrival, journey cargo snapshots, and service limits, deriving carried load from inventory.
- Commitments own accepted/resolved/follow-up state and one-time rewards; relationship continuity remains a separate authority.
- NPC schedules are recurring authored availability evaluated against canonical fictional time; availability is derived, not serialized as a second clock.
- Campaign recovery remains the one player/party recovery authority.
- Maps, Journal guidance, service boards, player information, home opportunity models, and social schedule decoration are projections of acquired/current state.
- Persistent companions remain NPC-backed world participants; party authority owns recruitment, active membership, location continuity, field approach, recovery participation, and battle synchronization.
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

Adapters render `display.text` or consume semantic fields. Do not restore `.message`/`.reason` compatibility aliases or prose parsing as gameplay authority.

## Home, inventory, and carried-load authority

`projectEngine.js` is the persistent construction/work substrate. `player.inventoryState` is the canonical inventory/container root. Inventory owns container unlock/access/capacity/transfer and physical item location. `homeFurnishings.js` owns furnishing definitions; `workstationEngine` derives workstation context; `productionEngine` owns recipe inputs/work/outputs/provenance/mastery.

`carriedInventoryEngine.js` centralizes the portable-carried container set. `carriedLoadEngine.js` projects cargo units from the same definitions. Transport and commitments consume those authorities instead of maintaining their own container lists.

The flat `player.inventory` array is a runtime convenience alias relinked to the main inventory container after decode. Its object identity is therefore a **post-revival invariant**, not a raw serialized invariant.

## Persistence authority — strict current schema

Compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.32
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Optional Work Registry
```

`js/text/save.js` owns account/session/character persistence. Current storage keys are `hearthHorizonAccounts` and `hearthHorizonAccountSession`; accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

### Raw validation precedes revival

`currentGameStateSchema.js` validates decoded Game State 6 **before reference revival and before runtime `ensure*` normalization**.

Current required raw domain validation covers:

```text
world time
  canonical non-negative fictional seconds

simulation control
  paused/speed/end-of-day preference shape

timed tasks
  version, sequence monotonicity, unique ids, status/timing/data

active travel
  Travel State 2 plus matching task kind/channel/endpoints/deadline

projects
  version, sequence, stable ids, status, labor/material progress

commitments
  definition ids, status, reward/follow-up bookkeeping

relationships
  version, npc-key consistency, dimensions, timestamps

resource opportunities
  version, sequence, stable ids/status, recovery actions, persisted outcome rolls

ecology
  version, population/source maps, canonical references, quantities, timestamps

party
  version, capacity, active membership, recruited records/resources/tactics

ability runtime
  version, cooldown map, active activation structure

semantic events
  record-array shape, stable identity/type/data, ordering, duplicate prevention, nextSequence monotonicity

player capabilities
  capability registry version, known records, canonical ids/source/timestamps

player inventory state
  canonical container set, item-array shape, unlock flags, capacity, home context
```

`work` is **optional persisted authority**. A state with no `work` property remains valid construction state. If `work` is persisted, however, it must be an object satisfying `validateWorkState()` before runtime access. This prevents `ensureWorkState()` from replacing a malformed persisted value while preserving lazy construction where the registry has never been created.

Separate active-owner link validation requires active project/work/travel/timed-ability/resource-recovery state to retain a matching active-or-just-completed timed task until owner reconciliation.

Malformed current state is rejected rather than repaired or rewritten. `saveGame()` likewise refuses malformed current state rather than manufacturing required authority during persistence.

### Deliberately post-revival or deferred validation

Raw validation is not a goal by itself. The current boundary deliberately excludes:

- broad `validatePlayer()`, because that validator mixes true persisted invariants with post-revival inventory alias identity and derived combat/profile expectations;
- flat `player.inventory` reference identity, which is reconstructed by revival;
- atlas/POI discovery tightening, because no dedicated raw-domain validator currently exists and atlas visit records include wall-clock timestamp semantics that require an explicit authority decision before becoming stricter persistence law.

A future player-persistence packet should first extract a **raw-safe persisted player sub-validator** rather than invoking `validatePlayer()` wholesale.

### State-classification rule

Before tightening another raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not during current-save load;
4. **optional persisted authority** — absence is valid, but a present stored value must satisfy its domain contract.

Historical lazy-init tests may still prove internal/new-state construction behavior. They are not promises that malformed or incomplete current Game State 6 saves will load.

## Timed-task lifecycle ownership

Timed-task authority owns scheduling/progress/terminal status. Domain authority owns semantic consequence and terminal release.

Current direct production task creators are exactly:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

`tests/architectureDebtGuard.test.js` makes that set executable. Each owner releases only after its durable exactly-once consequence. `releaseTimedTask` rejects active tasks and never rewinds sequence allocation.

Production-style repeated owner lifecycles return the task registry to zero retained task records after reconciliation. There is no production generic/unowned timed-task producer and no accepted blind global pruning policy.

## Other lifecycle ownership

`domRoot.js` owns the mounted DOM app and onboarding observer. Tick subscriber replacement is stale-disposer safe. `tests/longSessionLifecycle.test.js` proves deterministic 130-day advancement with periodic current-schema save/load, bounded event/day-summary histories, exactly-once task transitions, and zero-retained-task steady state for owner-managed lifecycles.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS, `actions/checkout@v7`, and `actions/setup-node@v6`.

Latest exact-head runtime gate: PR #355 / exact head `458a87b3dbf08f6d6da086cc24bc1da6c539ede4` / Check `32178015948`, Node 24.19.0:

```text
602/602 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.270363 ms/op
enemy combat profiles   0.053653 ms/op
basic attacks            0.002913 ms/op
tick dispatch            0.000814 ms/op
direct route lookup      0.005602 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.259028 ms/op   7.25%
enemy profiles   0.051633 ms/op  11.45%
basic attacks    0.001148 ms/op 186.78%
tick dispatch    0.000478 ms/op 133.64%
route lookup     0.005363 ms/op  14.08%
```

Benchmark 1/2 results are not numerically comparable to Benchmark 3. No hard performance thresholds are accepted yet.

The runtime freeze for this train is `9423e87b6d681841a7576d938950bfbb631dd257`. Documentation commits after that freeze are synchronization only, not new runtime checkpoints.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future persistence work must continue one bounded family at a time and must not mechanically attach every runtime validator to load.
