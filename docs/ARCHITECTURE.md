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
- Mutable HP/MP/TP are persisted player state. Root `player.combat` and `player.statState` are reconstructible caches and are omitted from save payloads.
- Inventory/equipment/tool/container state owns preparation, capacity, access, portable item location, carried-load facts, and practical capability checks. Equipped items are durable loadout authority.
- Player statuses are durable timed/modifier authority and use canonical fictional-time boundaries plus canonical nested modifier blocks.
- The canonical wallet owns persisted currency balances under the current currency-key set.
- Resources preserve source/transformation provenance and one-time ownership.
- Active battles persist as ongoing combat authority: combatant snapshots, resources, sides, statuses, action history/timeline, and phase survive save/load. The live battle RNG is transient and is not serialized.
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
Product:       0.8.600.43
Package:       0.8.600
Account Save:  5
Game State:    9
Data:          37
Benchmark:     3
Codename:      Player Persistence Integration
```

`js/text/save.js` owns account/session/character persistence. Current storage keys are `hearthHorizonAccounts` and `hearthHorizonAccountSession`; accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

### Raw validation precedes revival

`currentGameStateSchema.js` validates decoded Game State 9 **before reference revival and before runtime `ensure*` normalization**.

Current required raw domain validation covers:

```text
world time / simulation control
timed tasks / active owner-task links
active Travel State 2
projects / commitments / relationships
resource opportunities / ecology
party / ability runtime
semantic events
atlas / POI acquired discovery
player progression / training / learned skills / capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical status state
active battle state when present
```

Optional persisted authority currently includes:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

For each, absence remains valid construction state. Once present, the stored value must satisfy its domain contract before runtime access.

Malformed current state is rejected rather than repaired or rewritten. `saveGame()` likewise refuses malformed current state rather than manufacturing required authority during persistence.

### Game State 7 discovery contract

Product `.34` changed persisted discovery meaning and therefore advanced Game State 6 → 7. Atlas visits store `visitedAtWorldSeconds` from canonical fictional time. Legacy wall-clock `visitedAt` records are incompatible current state and are rejected without migration or rewrite.

### Game State 8 derived player-cache contract

Product `.39` changed serialized player shape and advanced Game State 7 → 8. Root `player.combat` and `player.statState` are no longer serialized authority. `stripPlayerDerivedStateForPersistence()` removes them from the save payload; `reviveGameState()` reconstructs them after raw validation through `refreshPlayerDerivedState()`.

This distinction is intentional:

```text
player.resources.hp/mp/tp
  -> durable mutable gameplay state

player.combat
player.statState
  -> reconstructible derived caches
```

Combat synchronization preserves that contract after revival. `reconcileCombatStatuses()` refreshes each battle combatant's derived profile after status timing changes. `syncPlayerFromCombat()` copies durable resources/statuses back to the root player, clones nested status modifier blocks, then refreshes root derived caches.

### Game State 9 canonical status contract

Product `.41` changed valid persisted status semantics and advanced Game State 8 → 9. Status modifiers use canonical nested blocks:

```text
modifiers.attributes
modifiers.resources
modifiers.derived
modifiers.resistances
```

Flat authored modifier keys are normalized when a status is created at runtime, not while loading persisted state. A Game State 9 save carrying legacy flat modifier records is malformed current state and is rejected. Canonical status timing uses `appliedAtWorldSeconds`, `expiresAtWorldSeconds`, duration/remaining fields, stack ownership, optional tick data, and flags.

### Durable equipment and active-battle authority

Product `.40` made player equipment structurally strict without changing Game State 8 meaning. All canonical equipment slots must exist; occupied slots contain valid equipment items compatible with that slot; impossible two-handed/off-hand combinations are rejected. Current discipline eligibility is deliberately not persistence authority because a durable loadout may outlive a training-context change.

Product `.42` made `activeBattle` strict when present without changing Game State 9 meaning. The persisted battle owns ongoing combatant snapshots, resources, sides, statuses, bounded log, Combat 2.0 action identity/references, timeline actor readiness, and phase coherence. `activeBattle.rng` remains transient/non-persisted.

### State-classification rule

Before tightening another raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not during current-save load;
4. **optional persisted authority** — absence is valid, but a present stored value must satisfy its domain contract.

Do not compose broad `validatePlayer()` wholesale at the raw boundary. Flat inventory alias identity remains post-revival, and root combat/stat caches remain derived.

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

`tests/playerPersistenceIntegration.test.js` proves the current player boundary together: equipment, canonical statuses, damaged/spent resources, active battle, stripped root caches, real save/load revival, status expiry, derived profile refresh, non-aliased status modifier blocks, and resumed combat.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS, `actions/checkout@v7`, and `actions/setup-node@v6`.

Latest exact-head runtime gate: PR #366 / exact head `2a10727dfa14734ca9c3031adf4bc368be592063` / Check `32276311018`, Node 24.19.0:

```text
648/648 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.314430 ms/op
enemy combat profiles   0.064417 ms/op
basic attacks            0.003578 ms/op
tick dispatch            0.000743 ms/op
direct route lookup      0.006808 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.316339 ms/op    4.33%
enemy profiles   0.058325 ms/op    5.66%
basic attacks    0.001355 ms/op  173.80%
tick dispatch    0.000598 ms/op   67.24%
route lookup     0.006198 ms/op    1.95%
```

Benchmark 1/2 results are not numerically comparable to Benchmark 3. No hard performance thresholds are accepted yet.

The runtime freeze for this train is `daa1904c8287c5b16950142cef76edcfdd902d3d`. Documentation commits after that freeze are synchronization only, not new runtime checkpoints.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future persistence work must continue one bounded family at a time and must not mechanically attach every runtime validator to load.

The next strongest maintenance classification is the remaining root-player identity/key-item/flag boundary. A separate follow-up may audit whether active-battle `combatant.combat` should remain a durable encounter snapshot or become another explicitly reconstructible cache. Do not combine those mechanically.
