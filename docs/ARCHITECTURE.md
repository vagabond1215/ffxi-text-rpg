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
- Continuous-character progression, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Mutable HP/MP/TP are persisted player state. Combat profiles and derived maxima are projections from character/training/equipment/status inputs, not accepted raw persistence authority.
- Inventory/equipment/tool/container state owns preparation, capacity, access, portable item location, carried-load facts, and practical capability checks.
- The canonical wallet owns persisted currency balances under the current currency-key set.
- Resources preserve source/transformation provenance and one-time ownership.
- Projects own persistent material/labor progress and exactly-once completion state.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks rather than creating parallel stores or timers.
- Transport owns fares, cadence, departure, arrival, journey cargo snapshots, and service limits, deriving carried load from inventory.
- Commitments own accepted/resolved/follow-up state and one-time rewards; relationship continuity remains a separate authority.
- NPC schedules are recurring authored availability evaluated against canonical fictional time; availability is derived, not serialized as a second clock.
- Campaign recovery remains the one player/party recovery authority.
- Atlas/POI discovery persists acquired knowledge; atlas visit timing uses canonical fictional seconds rather than wall-clock timestamps.
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
Product:       0.8.600.38
Package:       0.8.600
Account Save:  5
Game State:    7
Data:          37
Benchmark:     3
Codename:      Strict Player Wallet
```

`js/text/save.js` owns account/session/character persistence. Current storage keys are `hearthHorizonAccounts` and `hearthHorizonAccountSession`; accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

### Raw validation precedes revival

`currentGameStateSchema.js` validates decoded Game State 7 **before reference revival and before runtime `ensure*` normalization**.

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

commitments / relationships
  continuity definitions, status, reward/follow-up and relationship invariants

resource opportunities / ecology
  durable recovery, population and gathering-source state

party / ability runtime
  companion continuity, cooldown and active-activation structure

semantic events
  stable identity/type/data, ordering, duplicates and nextSequence monotonicity

atlas / POI discovery
  acquired-place/coordinate/POI knowledge with fictional-time visit timestamps

player progression
  unlocked disciplines, per-discipline level/EXP, continuous-character training totals and learned skills

player capabilities
  canonical capability registry and learned records

player inventory state
  canonical containers, unlocks, capacity and home context

player mutable resources
  required non-negative integer HP/MP/TP values

player wallet
  complete canonical currency-key set with non-negative integer balances and no undeclared keys
```

Optional persisted authority currently includes:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

For each, absence remains valid construction state. Once present, the stored value must satisfy its domain contract before runtime access. `dayCycle` additionally validates canonical day boundaries, ordering, bounded summary history, and consistency with completed fictional days.

Separate active-owner link validation requires active project/work/travel/timed-ability/resource-recovery state to retain a matching active-or-just-completed timed task until owner reconciliation.

Malformed current state is rejected rather than repaired or rewritten. `saveGame()` likewise refuses malformed current state rather than manufacturing required authority during persistence.

### Game State 7 discovery contract

Product `.34` changed persisted discovery meaning and therefore advanced Game State 6 → 7. Atlas visits now store `visitedAtWorldSeconds` from canonical fictional time. Legacy wall-clock `visitedAt` records are incompatible current state and are rejected without migration or rewrite. Account Save 5 and Data 37 did not change.

### Deliberately derived or post-revival state

Raw validation is not a goal by itself. The current boundary deliberately excludes:

- broad `validatePlayer()`, because that validator mixes true persisted invariants with post-revival inventory alias identity and derived combat/profile expectations;
- flat `player.inventory` reference identity, which is reconstructed by revival;
- `player.combat` and derived combat/stat maxima as raw authority; they remain projections;
- a final decision on `player.statState`, whose deterministic continuous-character base-state semantics and reconstruction path need a dedicated cache/ownership audit before stricter persistence or de-persistence work.

### State-classification rule

Before tightening another raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not during current-save load;
4. **optional persisted authority** — absence is valid, but a present stored value must satisfy its domain contract.

Historical lazy-init tests may still prove internal/new-state construction behavior. They are not promises that malformed or incomplete current Game State 7 saves will load.

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

`domRoot.js` owns the mounted DOM app and onboarding observer. Tick subscriber replacement is stale-disposer safe. `tests/longSessionLifecycle.test.js` proves deterministic multi-day advancement with periodic current-schema save/load, bounded event/day-summary histories, exactly-once task transitions, and zero-retained-task steady state for owner-managed lifecycles.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS, `actions/checkout@v7`, and `actions/setup-node@v6`.

Latest exact-head runtime gate: PR #361 / exact head `a356c67124167ab60efd4cf4a57c742d3d94c355` / Check `32197699859`, Node 24.19.0:

```text
629/629 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.352213 ms/op
enemy combat profiles   0.066914 ms/op
basic attacks            0.003626 ms/op
tick dispatch            0.000750 ms/op
direct route lookup      0.007245 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.332962 ms/op    7.70%
enemy profiles   0.063346 ms/op   11.90%
basic attacks    0.001369 ms/op  150.99%
tick dispatch    0.000825 ms/op   33.05%
route lookup     0.007222 ms/op    5.66%
```

Benchmark 1/2 results are not numerically comparable to Benchmark 3. No hard performance thresholds are accepted yet.

The runtime freeze for this train is `dc588d194211ccaed671d58362617bea6b2c5a73`. Documentation commits after that freeze are synchronization only, not new runtime checkpoints.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future persistence work must continue one bounded family at a time and must not mechanically attach every runtime validator to load.

The next strongest maintenance audit is the **derived combat/stat cache boundary**: inspect direct reads and reconstruction behavior for `player.combat` and `player.statState`, then decide explicitly what remains persisted cache versus what should be recomputed. Do not bulk-remove or make either field strict before that production-caller audit.
