# Quality Gates

These repository-level gates supplement the current handoff and focused design authorities.

## Before implementation

- Confirm current `main` and read `docs/THREAD_HANDOFF.md`.
- Identify the authoritative state owner and production caller for the requested behavior.
- Inspect focused tests and nearby persistence/runtime/UI contracts.
- Read `docs/PERFORMANCE_BUDGET.md` and `docs/RESOURCE_LIFECYCLE.md` for lifecycle- or performance-sensitive work.

## Validation

Repository entry points are:

```bash
npm test
npm run benchmark
npm run benchmark:sample
npm run hardening
npm run check
```

Hosted `Check` runs on Node 24 LTS. `package.json` requires Node `>=24`. Report only checks that actually ran. Documentation-only synchronization after a frozen green runtime does not create a new runtime checkpoint.

`tests/architectureDebtGuard.test.js` protects selected compatibility and lifecycle seams, including the exact direct timed-task owner set and the removal of runtime legacy active-travel reconstruction.

## Persistence

Current mode is **pre-alpha current-schema only**.

- Account/session payloads must match Account Save 5 exactly.
- Character payloads must match Game State 11 and contain complete required persisted authority before reference revival.
- Raw validation runs before runtime `ensure*` helpers or derived projection reconstruction may normalize state.
- Malformed required persisted authority is rejected rather than repaired, backfilled, migrated, or silently rewritten.
- Optional persisted authority may be absent where construction semantics permit it, but once present must satisfy its domain contract.
- Active owner/task links must remain consistent until owner reconciliation.
- Tightening enforcement of an existing invariant does not alone require a schema bump; changing serialized shape or meaning does.
- Derived runtime projections must not be serialized merely because they are convenient to consume.

### Current raw Game State 11 validation

The current boundary validates these persisted families before revival:

```text
world time and simulation control
timed tasks and active owner/task links
active Travel State 2
projects, commitments, relationships
resource opportunities and ecology
party and ability runtime
semantic events
atlas and POI discovery
player envelope / identity / key items / player flags
player progression / lifetime training / learned skills / capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical status state
top-level world flags
current place / display location / position coherence
combatSequence / activeBattle.id identity coherence
active battle state when present, including deterministic combat/stat cache snapshots
active battle player / root player identity and live combat-authority coherence
state.log array pending dedicated ownership classification
```

Optional persisted authorities remain:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

For each, absence remains legitimate construction state; a present stored value must validate before runtime access.

### Derived and post-revival state

Current non-serialized/reconstructed state includes:

```text
state.npcs
state.enemies
player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

Product `.50` classified `state.npcs` as a runtime world projection. Save encoding omits it; post-validation revival reconstructs canonical seed NPCs and overlays persisted companion participation from `state.party`.

Product `.51` classified `state.enemies` as a runtime encounter-template projection. Save encoding omits it; post-validation revival rebuilds fresh canonical seed enemy templates. Place/spawn systems reference stable enemy IDs, and `startEncounter()` constructs the actual encounter snapshot. Mutable enemy resources, statuses, action history, phase, and other ongoing encounter facts belong to persisted `activeBattle`, not to the template projection. Injected serialized `enemies` data is replaced rather than accepted as authority.

Root `player.combat` and `player.statState` remain reconstructible caches. Mutable HP/MP/TP remain persisted independently. `activeBattle.rng` remains transient.

Active-battle combatant caches are intentionally different: `activeBattle.combatants[*].combat` and the player combatant's `statState` are persisted deterministic encounter snapshots and must match recomputation from persisted combatant inputs.

While a battle is active, the persisted battle player is additionally bound to the durable root player: stable player ID, mutable resources, statuses, and deterministic combat profile must agree with root combat-driving authority. Once the battle is terminal, the battle snapshot is historical and later root progression/recovery changes may diverge legitimately.

### Identity, world-condition, location, and encounter rules

Persisted player identity must remain canonical and internally coherent. Key-item identity is stable and duplicate-free; player flags and top-level world-condition flags are boolean facts, not truthy/falsy convenience values.

`currentPlaceId`, `location`, and `position` form one persisted location authority. The place ID must be canonical, the display name must match that place, and the position must belong to that place.

`combatSequence` is the durable encounter-ID allocator. When `activeBattle` exists, its ID must equal the canonical `battle-NNNNNN` value for the persisted sequence. Load must reject a forged counter or battle ID rather than repairing either side.

The battle player ID must match the root player ID. During an active encounter, root/battle resource, status, or combat-driving profile splits are malformed current state and must be rejected before revival rather than normalized into agreement. Terminal encounters retain historical snapshots.

### Historical schema decisions

- Game State 7 replaced wall-clock atlas `visitedAt` with fictional-time `visitedAtWorldSeconds`.
- Game State 8 removed root player combat/stat caches from serialized authority.
- Game State 9 canonicalized persisted player-status modifiers into nested modifier blocks.
- Game State 10 removed the reconstructible `state.npcs` runtime projection from serialized authority.
- Game State 11 removed the reconstructible `state.enemies` encounter-template projection from serialized authority.

No automatic compatibility migrations were added for those pre-alpha transitions.

### State-classification rule

Before adding another raw validator, classify the state first:

1. **persistent required authority** — validate before revival;
2. **derived/transient** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not as implicit current-save migration;
4. **optional persisted authority** — absence is allowed, but once present the stored value must satisfy its domain contract.

Do not compose broad `validatePlayer()` wholesale at the raw boundary. Flat `player.inventory` alias/reference identity remains a post-revival invariant. `state.npcs` and `state.enemies` are explicitly derived. `state.log` remains the one broad array still requiring dedicated ownership classification.

## Current strict-persistence evidence

Focused evidence includes the existing registry/resource/discovery/player suites plus:

```text
tests/currentSchemaDerivedPlayerState.test.js
tests/currentSchemaPlayerEquipment.test.js
tests/currentSchemaPlayerStatuses.test.js
tests/currentSchemaActiveBattle.test.js
tests/playerPersistenceIntegration.test.js
tests/currentSchemaLocationPersistence.test.js
tests/currentSchemaCombatIdentityPersistence.test.js
tests/currentSchemaNpcWorldProjection.test.js
tests/currentSchemaEnemyEncounterProjection.test.js
```

Revisions `.44`–`.49` cover strict persisted-authority invariants. Revisions `.50` and `.51` prove the opposite classification pattern is equally important: fields that are deterministic projections must leave serialized authority rather than gain validators.

## Resource lifecycle

New long-lived runtime resources require a clear owner, creation condition, duplicate-prevention strategy, and cleanup behavior. Repeated scene/view changes, activity transitions, save/load, and pause/resume must not accumulate duplicate resources. See `docs/RESOURCE_LIFECYCLE.md`.

A new direct production timed-task creator must define its durable consequence, exactly-once reconciliation point, and terminal release responsibility. The architecture guard currently admits only the six audited task-owner modules.

## Performance and long-session stability

Benchmark 3 and repeated sampling are the current comparability protocol. Do not invent hard thresholds before a repeatable baseline is explicitly accepted. Lifecycle-sensitive work must preserve deterministic long-session smoke and owner-managed zero-retained-task steady-state evidence.

Latest validated runtime evidence is validation-only PR #375 exact head `5a97a109d9476438d001ee75b8e20293f57360dd`, Check `32297557960`, Node 24.19.0: **684/684 tests**, Benchmark 3 success, Benchmark Sample success. Runtime freeze is the same exact `main` SHA. The PR was closed without merge after validation.

Benchmark 3 single run:

```text
player profiles  0.360644 ms/op
enemy profiles   0.069621 ms/op
basic attacks    0.002998 ms/op
tick dispatch    0.000941 ms/op
route lookup     0.007920 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.361064 ms/op    3.82%
enemy profiles   0.067427 ms/op    9.06%
basic attacks    0.001015 ms/op  191.25%
tick dispatch    0.000908 ms/op   38.68%
route lookup     0.007617 ms/op    8.23%
```

No hard threshold is accepted.

## UI and adapter boundaries

The semantic DOM shell is the active player interface. UI work must preserve keyboard usability, acquired-knowledge map privacy, sensible focus/navigation behavior, and separation of authoritative game state from presentation.

Canonical `ActionResult` consumers use `ok`, `action`, `code`, `outcome`, `data`, and `display`; do not restore `.message`/`.reason` compatibility aliases or prose parsing as domain logic.

## Definition of done

A bounded implementation is complete when production behavior is coherent, relevant validation actually ran or limitations are reported, persistence/lifecycle contracts are preserved, performance evidence is collected when material, architecture guards remain green, deliberate version decisions are recorded, and `docs/THREAD_HANDOFF.md` is updated last when current state or immediate next work changes.