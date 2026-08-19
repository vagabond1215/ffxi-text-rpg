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
- Top-level `state.log` is session-only command presentation history. The command adapter writes wall-clock-stamped input lines for diagnostics; it is omitted from saves and initialized empty on character load.
- `state.events` is the persisted structured semantic observation channel. Event consumers use typed data and canonical fictional-time fields rather than parsing `state.log` prose.
- `activeBattle.log` is a separate encounter-local persisted narrative/action record governed by active-battle persistence; Product `.52` does not change it.
- Canvas `commandHistory` and output buffers are separate transient UI state and are not Game State authority.
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

No independent production system owns mutable durable facts solely in `state.npcs`. Game State 10 therefore removed `state.npcs` from serialized authority. `refreshNpcWorldProjection()` rebuilds it after raw validation from `createSeedNpcs()` and persisted companion participation.

### Enemy encounter projection

Product `.51` completed the dedicated `state.enemies` ownership audit.

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

No production system mutates `state.enemies`, and no durable world fact exists solely there. Game State 11 therefore removes `state.enemies` from serialized authority. `refreshEnemyEncounterProjection()` reconstructs fresh seed templates from `createSeedEnemies()` after raw validation.

## Presentation and semantic history

Product `.52` completed the dedicated top-level `state.log` audit.

Current ownership is:

```text
commandRouter -> appendLog(state, input)
  -> bounded current-session command presentation history
  -> wall-clock ISO display timestamp
  -> read only by log / inspect log diagnostics

canvas uiState.commandHistory + outputLines
  -> separate transient UI input/output buffers

state.events
  -> persisted typed semantic observation history
  -> stable sequence identity
  -> canonical fictional world-time context

activeBattle.log
  -> persisted encounter-local battle narrative/action history
```

No production mechanic reads top-level `state.log`, and semantic-event tests explicitly prove consumers operate without parsing its prose. Command logging does not advance fictional time or create semantic events. Character replacement could already discard the history, reinforcing that it is session presentation rather than continuous-character authority.

Game State 12 therefore removes top-level `state.log` from serialized authority. `saveGame()` omits it without mutating the current live session. `loadCharacter()` validates the raw payload first, then `resetPresentationLog()` replaces any supplied/injected value with `[]` before broad runtime validation. A loaded character begins a fresh command-diagnostic session while durable semantic events remain intact.

This is intentionally not a conversion of wall-clock command timestamps into fictional time. The timestamps are appropriate only for transient presentation; durable gameplay chronology belongs in typed systems such as `state.events`, day-cycle records, tasks, travel, or battle state.

## Persistence authority — strict current schema

Compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.52
Package:       0.8.600
Account Save:  5
Game State:    12
Data:          37
Benchmark:     3
Codename:      Transient Command Presentation Log
```

`js/text/save.js` owns account/session/character persistence. Accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

### Raw validation precedes revival

`currentGameStateSchema.js` validates decoded Game State 12 **before reference revival and before runtime `ensure*` normalization or projection/session-state initialization**.

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

Derived/transient or post-validation runtime state includes:

```text
state.npcs
state.enemies
state.log
flat player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

Malformed persisted authority is rejected rather than repaired or rewritten. Derived projections/session state are initialized only after the raw persisted contract is accepted.

### Historical schema transitions

- **Game State 7** — Product `.34` replaced wall-clock atlas `visitedAt` with canonical fictional `visitedAtWorldSeconds`.
- **Game State 8** — Product `.39` removed root `player.combat` and `player.statState` from serialized authority.
- **Game State 9** — Product `.41` changed valid persisted status modifiers to canonical nested modifier blocks.
- **Game State 10** — Product `.50` removed the reconstructible `state.npcs` runtime projection from serialized authority.
- **Game State 11** — Product `.51` removed the reconstructible `state.enemies` encounter-template projection from serialized authority.
- **Game State 12** — Product `.52` removed top-level transient command presentation history from serialized authority.

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

Active battle snapshots are different. Deterministic encounter caches and encounter-local history remain persisted under active-battle authority. Product `.52` changes only top-level command presentation history; it does not alter battle persistence.

### State-classification rule

Before tightening a raw persistence seam, classify the state:

1. **persistent required authority** — must already be valid before revival;
2. **derived/transient state** — recompute or initialize from runtime context;
3. **construction convenience** — initialize in factory/new-state/internal paths, not during current-save load;
4. **optional persisted authority** — absence is valid, but a present stored value must satisfy its domain contract.

The dedicated broad-array sequence is complete: `state.npcs`, `state.enemies`, and top-level `state.log` have all been classified and removed from serialized authority where appropriate. Do not invent another generic entity/history validator merely to continue the sequence.

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

`tests/architectureDebtGuard.test.js` makes that set executable. Each owner releases only after its durable exactly-once consequence. There is no accepted blind global pruning policy.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS, `actions/checkout@v7`, and `actions/setup-node@v6`.

Latest exact runtime gate: validation-only PR #376 / head `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691` / Check `32301160532`, Node 24.19.0. The PR existed only to surface the standard pull-request Check for the direct-main runtime and was closed without merge after validation.

```text
688/688 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player combat profiles  0.399417 ms/op
enemy combat profiles   0.070029 ms/op
basic attacks            0.003675 ms/op
tick dispatch            0.000898 ms/op
direct route lookup      0.007617 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.357454 ms/op    7.63%
enemy profiles   0.070214 ms/op   11.19%
basic attacks    0.001153 ms/op  214.09%
tick dispatch    0.000873 ms/op   30.99%
route lookup     0.007237 ms/op    6.02%
```

Benchmark 3 remains the current comparability protocol; no hard performance thresholds are accepted. Runtime freeze: `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691`. Documentation commits after that freeze are synchronization only.

## Carried-forward rule

Presentation adapters and reconstructed projections may make canonical state easier to understand and operate, but they must not become second authorities.

The `state.npcs`, `state.enemies`, and top-level `state.log` audit series is complete. Do **not** automatically begin `0.8.700` or another maintenance revision. The next bounded work unit must be selected through a fresh repository-evidenced decision/work order.
