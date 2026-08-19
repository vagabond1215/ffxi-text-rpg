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
- While a battle is active, the battle-player snapshot is bound to the durable root player for stable player ID, mutable resources, canonical statuses, and the deterministic combat profile derived from live root combat-driving authority. A terminal battle is historical and may legitimately diverge from later root-character changes.
- Root-owned combat skill gains that occur during an active encounter are copied into the battle-player snapshot before encounter cache refresh. This synchronization is explicit because save/load breaks the nested object sharing that happens to exist immediately after encounter construction.
- Projects own persistent material/labor progress and exactly-once completion state.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks rather than creating parallel stores or timers.
- Transport owns fares, cadence, departure, arrival, journey cargo snapshots, and service limits, deriving carried load from inventory.
- Commitments own accepted/resolved/follow-up state and one-time rewards; relationship continuity remains a separate authority.
- NPC schedules are recurring authored availability evaluated against canonical fictional time; availability is derived, not serialized as a second clock.
- `state.npcs` is a reconstructible runtime world projection, not serialized authority. Canonical seed NPC definitions plus persisted party companion state rebuild it after raw validation.
- Campaign recovery remains the one player/party recovery authority.
- Atlas/POI discovery persists acquired knowledge; atlas visit timing uses canonical fictional seconds rather than wall-clock timestamps.
- Maps, Journal guidance, service boards, player information, home opportunity models, and social schedule decoration are projections of acquired/current state.
- Persistent companions remain NPC-backed world participants; party authority owns recruitment, active membership, location continuity, field approach, recovery participation, and battle synchronization. Their backing NPC records are projections of that authority.
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

## NPC world projection authority

Product `.50` completed the dedicated `state.npcs` ownership audit.

Current production ownership is split cleanly:

```text
authored seed NPC definitions
  -> canonical baseline identity/services/location

state.party.companions
  -> durable recruited companion membership/location/tactics/resources

NPC schedule catalog + world time
  -> derived availability

state.relationships
  -> durable named-NPC social continuity

state.commitments
  -> durable accepted/resolved/follow-up continuity
```

No independent production system owns mutable durable facts solely in `state.npcs`. The only runtime mutations found there are companion-backing identity/location/active flags, and those values are projections of `state.party` plus the companion catalog.

Accordingly, Game State 10 encoding omits `state.npcs`. `refreshNpcWorldProjection()` rebuilds the array during revival from `createSeedNpcs()` and overlays persisted companion participation. Raw validation happens first. A forged or stale serialized `npcs` field therefore cannot become canonical state; revival replaces it with the deterministic projection.

This is deliberately different from adding a broad NPC validator. If a future system introduces genuinely mutable non-companion NPC world facts, that system must first define its durable owner rather than silently making the projection array authoritative again.

## Persistence authority — strict current schema

Compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.50
Package:       0.8.600
Account Save:  5
Game State:    10
Data:          37
Benchmark:     3
Codename:      Derived NPC World Projection
```

`js/text/save.js` owns account/session/character persistence. Accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

### Raw validation precedes revival

`currentGameStateSchema.js` validates decoded Game State 10 **before reference revival and before runtime `ensure*` normalization or projection reconstruction**.

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
active battle player / root player live-authority coherence
```

Optional persisted authority currently includes:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

For each, absence remains valid construction state. Once present, the stored value must satisfy its domain contract before runtime access.

Derived/post-revival state includes:

```text
state.npcs
flat player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

Malformed current persisted authority is rejected rather than repaired or rewritten. `saveGame()` likewise refuses malformed current state rather than manufacturing required authority during persistence. Derived projections are rebuilt only after the raw persisted contract is accepted.

### Historical schema transitions

- **Game State 7** — Product `.34` replaced wall-clock atlas `visitedAt` with canonical fictional `visitedAtWorldSeconds`.
- **Game State 8** — Product `.39` removed root `player.combat` and `player.statState` from serialized authority and made them post-validation reconstructed caches.
- **Game State 9** — Product `.41` changed valid persisted status modifiers to canonical nested `attributes`, `resources`, `derived`, and `resistances` blocks.
- **Game State 10** — Product `.50` removed the reconstructible `state.npcs` runtime projection from serialized authority.

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

Product `.49` adds a second, cross-boundary invariant for the one active battle player. Its stable ID must match the root player. While `activeBattle.phase === 'active'`, its mutable resources and statuses must match the root player and its persisted combat cache must equal a fresh deterministic profile reconstructed from root combat-driving authority. This catches a battle snapshot that is internally self-consistent but no longer represents the live character.

Terminal encounters are intentionally different: after victory/defeat the encounter snapshot is historical, so later root progression, recovery, loadout, or resource changes do not have to rewrite the terminal battle.

`reconcileCombatStatuses()` refreshes battle combatant derived profiles after status timing changes. `syncPlayerFromCombat()` copies durable resources/statuses back to the root player, clones nested status modifiers, and refreshes root caches. `combatActionEngine.js` additionally copies a newly gained root combat-skill map into the active battle player before final cache refresh. That explicit step matters after save/load because JSON revival recreates root and battle progression as separate nested objects rather than preserving construction-time object sharing.

### Identity, flags, location, and encounter identity

Products `.44` and `.45` made player identity/key items/player flags, the stable player envelope, and top-level world flags strict current-state facts. Flags are booleans rather than generic truthy values.

Product `.47` made persisted location coherent: exact canonical `currentPlaceId`, matching `location`, and a `position` owned by that place. Topology places require navigable normalized coordinates, valid level and facing, and no grid x/y. Grid places require stored x/y within raw bounds; any external coordinate must map exactly to those values.

Product `.48` made encounter allocation strict: `combatSequence` is the persisted allocator and an existing `activeBattle.id` must exactly match its padded sequence identity. Forged counters or IDs are rejected before revival rather than repaired.

Product `.49` makes the battle-player identity/live-authority link strict while the encounter is active. A forged root player ID, live resource/status split, or combat-driving split is rejected before revival. Load does not repair either side. A terminal battle remains historical.

### State-classification rule

Before tightening another raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not during current-save load;
4. **optional persisted authority** — absence is valid, but a present stored value must satisfy its domain contract.

Do not compose broad `validatePlayer()` wholesale at the raw boundary. `state.npcs` has now been classified as derived/reconstructible. Do not mechanically promote `state.enemies` or presentation `state.log` before their separate ownership audits.

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

`tests/playerPersistenceIntegration.test.js` proves the player boundary together. `tests/currentSchemaCombatIdentityPersistence.test.js` proves active battle/root player linkage, malformed split rejection/no repair, terminal historical divergence, and post-load combat-skill synchronization. `tests/currentSchemaNpcWorldProjection.test.js` proves Game State 10 does not require serialized `npcs`, save encoding omits it, canonical seed plus party authority rebuild it, and injected NPC projection data cannot become authoritative on load.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS, `actions/checkout@v7`, and `actions/setup-node@v6`.

Latest exact runtime gate: validation-only PR #374 / head `181bc67b69172390d1a59fa3dfca35980a026b3d` / Check `32292959171`, Node 24.19.0. The PR existed only to surface the standard pull-request Check for the direct-main runtime and was closed without merge after validation.

```text
680/680 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.372865 ms/op
enemy combat profiles   0.071050 ms/op
basic attacks            0.003425 ms/op
tick dispatch            0.000818 ms/op
direct route lookup      0.007469 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.364304 ms/op    3.27%
enemy profiles   0.067755 ms/op   10.57%
basic attacks    0.001213 ms/op  162.66%
tick dispatch    0.000876 ms/op   44.41%
route lookup     0.007423 ms/op    6.50%
```

Benchmark 3 remains the current comparability protocol; no hard performance thresholds are accepted. The runtime freeze for this packet is `181bc67b69172390d1a59fa3dfca35980a026b3d`. Documentation commits after that freeze are synchronization only.

## Carried-forward rule

Presentation adapters and reconstructed projections may make canonical state easier to understand and operate, but they must not become second authorities. Future persistence work must continue one bounded family at a time.

The `state.npcs` audit is complete. The next strongest classification work is `state.enemies`, followed separately by `state.log`. Authored encounter definitions, mutable encounter state, derived combat caches, and presentation history must not be conflated into one broad validator. Do not automatically begin `0.8.700`.