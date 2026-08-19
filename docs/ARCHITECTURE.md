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
- Root-owned combat skill gains that occur during an active encounter are copied into the battle-player snapshot before encounter cache refresh.
- Projects own persistent material/labor progress and exactly-once completion state.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks rather than creating parallel stores or timers.
- Transport owns fares, cadence, departure, arrival, journey cargo snapshots, and service limits, deriving carried load from inventory.
- Commitments own accepted/resolved/follow-up state and one-time rewards; relationship continuity remains a separate authority.
- NPC schedules are recurring authored availability evaluated against canonical fictional time; availability is derived, not serialized as a second clock.
- `state.npcs` is a reconstructible runtime world projection, not serialized authority. Canonical seed NPC definitions plus persisted party companion state rebuild it after raw validation.
- `state.enemies` is a reconstructible encounter-template projection, not serialized mutable world authority. Canonical seed enemy definitions rebuild it after raw validation; place spawn rules reference stable enemy IDs, and `activeBattle` owns mutable ongoing encounter state.
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

## Runtime world/entity projections

### NPC world projection

Product `.50` completed the dedicated `state.npcs` ownership audit. Canonical seed NPC definitions provide baseline identity/services/location; `state.party.companions` owns recruited companion continuity; schedules are derived from authored schedule data plus world time; relationships and commitments own their separate durable facts.

No independent production system owns mutable durable facts solely in `state.npcs`. The runtime mutations found there are companion-backing identity/location/active flags projected from party authority. Game State 10 therefore removed `state.npcs` from serialized authority. `refreshNpcWorldProjection()` rebuilds it after raw validation from `createSeedNpcs()` and persisted companion participation.

### Enemy encounter projection

Product `.51` completed the dedicated `state.enemies` ownership audit.

Current production ownership is:

```text
canonical seed enemy definitions
  -> encounter-template identity/species/zone/level/loot/aggro inputs
  -> factory-derived template combat/resources

place spawn rules / player opportunities
  -> stable enemy IDs describing which encounter template may be used

startEncounter()
  -> resolves one template and constructs a distinct encounter combatant

activeBattle
  -> durable mutable combatants/resources/statuses/actions/timeline/phase
```

No production system mutates `state.enemies`, and no durable world fact exists solely there. `createEnemy()` currently calculates combat and initial resources while constructing the template, but those values are deterministic construction data, not persisted mutable entity history.

Game State 11 therefore removes `state.enemies` from serialized authority. `refreshEnemyEncounterProjection()` reconstructs fresh seed templates from `createSeedEnemies()` after raw validation. The existing post-validation projection chain invokes this during revival. A forged or stale serialized `enemies` field cannot become canonical: revival replaces it before gameplay lookup.

This must not be confused with active battle persistence. Once an encounter starts, the unique combatant snapshot inside `activeBattle` is the ongoing mutable authority and remains persisted under the established battle contracts.

## Persistence authority — strict current schema

Compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.51
Package:       0.8.600
Account Save:  5
Game State:    11
Data:          37
Benchmark:     3
Codename:      Derived Enemy Encounter Projection
```

`js/text/save.js` owns account/session/character persistence. Accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

### Raw validation precedes revival

`currentGameStateSchema.js` validates decoded Game State 11 **before reference revival and before runtime `ensure*` normalization or projection reconstruction**.

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
state.log array pending its dedicated ownership audit
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
state.enemies
flat player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

Malformed current persisted authority is rejected rather than repaired or rewritten. `saveGame()` likewise refuses malformed current state rather than manufacturing required authority during persistence. Derived projections are rebuilt only after the raw persisted contract is accepted.

### Historical schema transitions

- **Game State 7** — Product `.34` replaced wall-clock atlas `visitedAt` with canonical fictional `visitedAtWorldSeconds`.
- **Game State 8** — Product `.39` removed root `player.combat` and `player.statState` from serialized authority.
- **Game State 9** — Product `.41` changed valid persisted status modifiers to canonical nested modifier blocks.
- **Game State 10** — Product `.50` removed the reconstructible `state.npcs` runtime projection from serialized authority.
- **Game State 11** — Product `.51` removed the reconstructible `state.enemies` encounter-template projection from serialized authority.

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

Active battle snapshots are different. Product `.46` made deterministic encounter `combat` caches, and the player combatant's `statState`, strict persisted snapshots. They must match deterministic recomputation from persisted combatant inputs. This preserves an internally coherent ongoing encounter while root player caches remain non-authoritative.

Product `.49` adds the active battle/root player invariant. While `activeBattle.phase === 'active'`, stable ID, resources, statuses, and deterministic combat-driving profile must agree. Terminal encounters are historical and may legitimately diverge from later root-character changes.

`reconcileCombatStatuses()` refreshes battle combatant derived profiles after status timing changes. `syncPlayerFromCombat()` copies durable resources/statuses back to the root player and refreshes root caches. `combatActionEngine.js` additionally copies a newly gained root combat-skill map into the active battle player before final cache refresh, which is required because JSON revival breaks construction-time nested object sharing.

### Identity, flags, location, and encounter identity

Products `.44` and `.45` made player identity/key items/player flags, the stable player envelope, and top-level world flags strict current-state facts. Product `.47` made current place/display name/position one coherent authority. Product `.48` made `combatSequence` and `activeBattle.id` coherent. Product `.49` made the live active-battle player/root link strict.

### State-classification rule

Before tightening another raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not during current-save load;
4. **optional persisted authority** — absence is valid, but a present stored value must satisfy its domain contract.

Do not compose broad `validatePlayer()` wholesale at the raw boundary. `state.npcs` and `state.enemies` are now classified as derived/reconstructible. Do not mechanically promote presentation `state.log` before its dedicated ownership audit.

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

`tests/playerPersistenceIntegration.test.js` proves the player boundary together. `tests/currentSchemaCombatIdentityPersistence.test.js` proves active battle/root player linkage. `tests/currentSchemaNpcWorldProjection.test.js` proves NPC projection reconstruction. `tests/currentSchemaEnemyEncounterProjection.test.js` proves Game State 11 omits enemy templates, rebuilds canonical definitions, preserves encounter lookup after load, and rejects injected projection authority by replacement.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS, `actions/checkout@v7`, and `actions/setup-node@v6`.

Latest exact runtime gate: validation-only PR #375 / head `5a97a109d9476438d001ee75b8e20293f57360dd` / Check `32297557960`, Node 24.19.0. The PR existed only to surface the standard pull-request Check for the direct-main runtime and was closed without merge after validation.

```text
684/684 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.360644 ms/op
enemy combat profiles   0.069621 ms/op
basic attacks            0.002998 ms/op
tick dispatch            0.000941 ms/op
direct route lookup      0.007920 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.361064 ms/op    3.82%
enemy profiles   0.067427 ms/op    9.06%
basic attacks    0.001015 ms/op  191.25%
tick dispatch    0.000908 ms/op   38.68%
route lookup     0.007617 ms/op    8.23%
```

Benchmark 3 remains the current comparability protocol; no hard performance thresholds are accepted. Runtime freeze: `5a97a109d9476438d001ee75b8e20293f57360dd`. Documentation commits after that freeze are synchronization only.

## Carried-forward rule

Presentation adapters and reconstructed projections may make canonical state easier to understand and operate, but they must not become second authorities. Future persistence work must continue one bounded family at a time.

The NPC and enemy audits are complete. The next strongest classification work is `state.log` alone: determine whether command/presentation history is disposable projection, durable player-facing memory, or compatibility baggage without conflating it with semantic events. Do not automatically begin `0.8.700`.