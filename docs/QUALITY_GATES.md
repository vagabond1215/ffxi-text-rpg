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
- Character payloads must match Game State 9 and contain complete required persisted authority before reference revival.
- Raw validation runs before runtime `ensure*` helpers may normalize state.
- Malformed required persisted authority is rejected rather than repaired, backfilled, migrated, or silently rewritten.
- Optional persisted authority may be absent where construction semantics permit it, but once present must satisfy its domain contract.
- Active project/work/travel/timed-ability/resource-recovery task links must reference consistent active-or-just-completed persisted tasks until owner reconciliation.
- A future compatibility migration is deliberate work only when explicitly required or independently useful.
- Tightening enforcement of an existing invariant does not alone require a schema bump; changing serialized shape or meaning does.

### Current raw Game State 9 validation

The current boundary validates these persisted families before revival:

```text
world time
simulation control
timed tasks
active Travel State 2
projects
commitments
relationships
resource opportunities
ecology
party
ability runtime
semantic events
atlas discovery with canonical fictional-time visit records
POI discovery/acquired-knowledge ownership
player discipline progression, lifetime training, learned skills and capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical status state
active battle state when present
```

Active battle validation covers battle identity/phase, combatants, sides, resources, status records, Combat 2.0 action identity/references, and timeline actor ownership. The live battle RNG is transient and is not serialized authority.

Optional persisted authorities are:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

For each, absence remains legitimate construction state; a present stored value must validate before runtime access.

### Derived player-cache rule

Game State 8 established that root `player.combat` and `player.statState` are reconstructible caches rather than durable save authority. Save encoding omits them; revival rebuilds both from validated character inputs. Mutable HP/MP/TP remain persisted independently.

Combat synchronization must keep that cache contract live after revival: status reconciliation refreshes combatant derived profiles, and durable resource/status synchronization refreshes root player derived caches. Nested status modifier blocks must not be shared by reference between battle and root player state.

The following remain deliberately outside raw persistence authority:

- broad `validatePlayer()`, because it mixes serialized invariants with post-revival object identity and derived combat/profile checks;
- flat `player.inventory` alias/reference identity, restored during revival;
- root `player.combat` and `player.statState`, rebuilt after validation;
- live `activeBattle.rng`, which is transient.

### Discovery-time rule

Game State 7 replaced wall-clock atlas visit timestamps with `visitedAtWorldSeconds` anchored to canonical fictional time. Current discovery records carrying legacy wall-clock `visitedAt` are incompatible and are rejected rather than migrated or rewritten. Acquired-knowledge map privacy remains mandatory.

### Status-state rule

Game State 9 canonicalized persisted status modifiers into nested `attributes`, `resources`, `derived`, and `resistances` blocks. Flat modifier payloads are no longer current state. Status timing uses canonical fictional-time boundaries, and malformed current records are rejected before revival rather than canonicalized during load.

### State-classification rule

Before adding another raw validator, classify the state first:

1. **persistent required authority** — validate before revival;
2. **derived/transient** — recompute from authoritative inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not as implicit current-save migration;
4. **optional persisted authority** — absence is allowed, but once present the stored value must satisfy its domain contract.

Historical tests that exercise lazy `ensure*` initialization may remain correct internal construction tests. They do not imply that an incomplete or malformed current Game State 9 save is load-compatible.

## Current strict-persistence evidence

Focused raw-boundary and integration regression files include:

```text
tests/currentSchemaProjectRegistry.test.js
tests/currentSchemaContinuityRegistries.test.js
tests/currentSchemaResourceOpportunities.test.js
tests/currentSchemaEcologyRegistry.test.js
tests/currentSchemaCharacterRuntime.test.js
tests/currentSchemaWorldSimulation.test.js
tests/currentSchemaPlayerCapabilities.test.js
tests/currentSchemaInventoryState.test.js
tests/currentSchemaSemanticEvents.test.js
tests/currentSchemaWorkRegistry.test.js
tests/currentSchemaPlayerProgression.test.js
tests/currentSchemaDiscoveryPersistence.test.js
tests/currentSchemaWorkProficiencies.test.js
tests/currentSchemaPlayerResources.test.js
tests/currentSchemaDayCycle.test.js
tests/currentSchemaPlayerWallet.test.js
tests/currentSchemaDerivedPlayerState.test.js
tests/currentSchemaPlayerEquipment.test.js
tests/currentSchemaPlayerStatuses.test.js
tests/currentSchemaActiveBattle.test.js
tests/playerPersistenceIntegration.test.js
```

Each newly tightened authority family requires positive non-trivial current save/load evidence and malformed-current-save rejection/no-repair evidence where applicable. Derived-cache contracts require proof that serialized caches are absent/ignored and rebuilt from durable inputs.

## Resource lifecycle

New long-lived runtime resources require a clear owner, creation condition, duplicate-prevention strategy, and cleanup behavior. Repeated scene/view changes, activity transitions, save/load, and pause/resume must not accumulate duplicate resources. See `docs/RESOURCE_LIFECYCLE.md`.

A new direct production timed-task creator must define its durable consequence, exactly-once reconciliation point, and terminal release responsibility. The architecture guard currently admits only the six audited task-owner modules.

## Performance and long-session stability

Benchmark 3 and repeated sampling are the current comparability protocol. Do not invent hard thresholds before a repeatable baseline is explicitly accepted. Lifecycle-sensitive work must preserve deterministic long-session smoke and owner-managed zero-retained-task steady-state evidence.

Latest validated runtime evidence is PR #366 exact head `2a10727dfa14734ca9c3031adf4bc368be592063`, Check `32276311018`, Node 24.19.0: **648/648 tests**, Benchmark 3 success, Benchmark Sample success. Runtime freeze after promotion is `daa1904c8287c5b16950142cef76edcfdd902d3d`.

## UI and adapter boundaries

The semantic DOM shell is the active player interface. UI work must preserve keyboard usability, acquired-knowledge map privacy, sensible focus/navigation behavior, and separation of authoritative game state from presentation.

Canonical `ActionResult` consumers use `ok`, `action`, `code`, `outcome`, `data`, and `display`; do not restore `.message`/`.reason` compatibility aliases or prose parsing as domain logic.

## Definition of done

A bounded implementation is complete when production behavior is coherent, relevant validation actually ran or limitations are reported, persistence/lifecycle contracts are preserved, performance evidence is collected when material, architecture guards remain green, deliberate version decisions are recorded, and `docs/THREAD_HANDOFF.md` is updated last when current state or immediate next work changes.
