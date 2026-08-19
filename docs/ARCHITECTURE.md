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
- Player identity, key items, player flags, and top-level world-condition flags are durable persisted facts where declared by the current schema.
- Mutable HP/MP/TP persist. Root `player.combat` and `player.statState` are reconstructible caches and are omitted from save payloads.
- Inventory/equipment/tool/container state owns preparation, capacity, access, portable item location, carried-load facts, and practical capability checks. Equipped items are durable loadout authority.
- Player statuses are durable timed/modifier authority and use canonical fictional-time boundaries plus canonical nested modifier blocks.
- The canonical wallet owns persisted currency balances.
- Resources preserve source/transformation provenance and one-time ownership.
- Current location is one coherent persisted authority: canonical place ID, canonical display name, and a position owned by that same place.
- `combatSequence` is the durable encounter-ID allocator. A persisted active battle must carry the corresponding `battle-NNNNNN` identity.
- Active battles persist ongoing combat authority: combatants, resources, sides, statuses, action history/timeline, phase, and deterministic combat/stat snapshots survive save/load. The live battle RNG is transient and is not serialized.
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

The flat `player.inventory` array is a runtime convenience alias relinked to the main inventory container after decode. Its object identity is a **post-revival invariant**, not a raw serialized invariant.

## Persistence authority — strict current schema

Compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.48
Package:       0.8.600
Account Save:  5
Game State:    9
Data:          37
Benchmark:     3
Codename:      Strict Combat Identity Sequence
```

`js/text/save.js` owns account/session/character persistence. Accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

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
player envelope / identity / key items / flags
player progression / training / learned skills / capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical status state
top-level world flags
current location/position coherence
combat identity sequence
active battle state and deterministic encounter caches when present
```

Optional persisted authority currently includes:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

For each, absence remains valid construction state. Once present, the stored value must satisfy its domain contract before runtime access.

Malformed current state is rejected rather than repaired or rewritten. `saveGame()` likewise refuses malformed current state rather than manufacturing required authority during persistence.

### Historical schema transitions

- **Game State 7** — Product `.34` replaced wall-clock atlas `visitedAt` with canonical fictional `visitedAtWorldSeconds`.
- **Game State 8** — Product `.39` removed root `player.combat` and `player.statState` from serialized authority and made them post-validation reconstructed caches.
- **Game State 9** — Product `.41` changed valid persisted status modifiers to canonical nested `attributes`, `resources`, `derived`, and `resistances` blocks.

No automatic pre-alpha migrations were added for those transitions.

### Root caches versus encounter snapshots

The root player boundary deliberately distinguishes mutable/durable state from reconstructed projections:

```text
player.resources.hp/mp/tp
  -> durable mutable gameplay state

player.combat
player.statState
  -> reconstructible root caches, omitted from saves
```

Active battle snapshots are different. Product `.46` made deterministic encounter `combat` caches, and the player combatant's `statState`, strict persisted snapshots. They must match deterministic recomputation from the persisted combatant inputs. This preserves an internally coherent ongoing encounter while still keeping root player caches non-authoritative.

`reconcileCombatStatuses()` refreshes battle combatant derived profiles after status timing changes. `syncPlayerFromCombat()` copies durable resources/statuses back to the root player, clones nested status modifiers, and refreshes root caches.

### Identity, flags, location, and encounter identity

Products `.44` and `.45` made player identity/key items/player flags, the stable player envelope, and top-level world flags strict current-state facts. Flags are booleans rather than generic truthy values.

Product `.47` made persisted location coherent: exact canonical `currentPlaceId`, matching `location`, and a `position` owned by that place. Topology places require navigable normalized coordinates, valid level and facing, and no grid x/y. Grid places require stored x/y within raw bounds; any external coordinate must map exactly to those values.

Product `.48` made encounter allocation strict: `combatSequence` is the persisted allocator and an existing `activeBattle.id` must exactly match its padded sequence identity. Forged counters or IDs are rejected before revival rather than repaired.

### State-classification rule

Before tightening another raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not during current-save load;
4. **optional persisted authority** — absence is valid, but a present stored value must satisfy its domain contract.

Do not compose broad `validatePlayer()` wholesale at the raw boundary. Do not mechanically promote `state.npcs`, `state.enemies`, or presentation `state.log` to strict authority before separate ownership audits.

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

`tests/architectureDebtGuard.test.js` makes that set executable. Each owner releases only after its durable exactly-once consequence. `releaseTimedTask` rejects active tasks and never rewinds sequence allocation. There is no accepted blind global pruning policy.

## Other lifecycle ownership

`domRoot.js` owns the mounted DOM app and onboarding observer. Tick subscriber replacement is stale-disposer safe. `tests/longSessionLifecycle.test.js` proves deterministic multi-day advancement with periodic current-schema save/load, bounded event/day-summary histories, exactly-once task transitions, and zero-retained-task steady state for owner-managed lifecycles.

`tests/playerPersistenceIntegration.test.js` proves the player boundary together: equipment, canonical statuses, mutable resources, active battle, stripped root caches, save/load revival, status expiry, derived profile refresh, non-aliased status modifier blocks, and resumed combat.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS, `actions/checkout@v7`, and `actions/setup-node@v6`.

Latest exact-head runtime gate: PR #372 / head `8cdc20aecf40201e82cd560eccd19d7f34700798` / Check `32287076773`, Node 24.19.0:

```text
670/670 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.268864 ms/op
enemy combat profiles   0.052262 ms/op
basic attacks            0.003205 ms/op
tick dispatch            0.000825 ms/op
direct route lookup      0.005607 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.260915 ms/op    6.23%
enemy profiles   0.050549 ms/op    8.78%
basic attacks    0.001223 ms/op  224.79%
tick dispatch    0.000587 ms/op  123.28%
route lookup     0.005258 ms/op    8.89%
```

Benchmark 3 remains the current comparability protocol; no hard performance thresholds are accepted. The runtime freeze for this train is `512f8c3d5edbb22d07d857fa98d6f0755d043d89`. Documentation commits after that freeze are synchronization only.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future persistence work must continue one bounded family at a time.

The next strongest classification work is to audit `state.npcs`, `state.enemies`, and `state.log` **separately**. Seed/world-entity definitions, mutable world participation, derived combat state, and presentation history must not be conflated into one broad validator. Do not automatically begin `0.8.700`.
