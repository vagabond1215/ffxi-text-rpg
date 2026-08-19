# Quality Gates

These repository-level gates supplement the current handoff, execution pipeline, and focused design authorities.

## Before implementation

- Confirm current `main` and read `docs/THREAD_HANDOFF.md`.
- Read `docs/EXECUTION_PIPELINE.md` and use its active/next/deferred queue instead of restarting broad discovery when the checkpoint is current.
- Identify the authoritative state owner and production caller for the requested behavior.
- Inspect focused tests and nearby persistence/runtime/UI contracts.
- Read `docs/PERFORMANCE_BUDGET.md` and `docs/RESOURCE_LIFECYCLE.md` for lifecycle- or performance-sensitive work.
- For content-heavy work, inspect the current `npm run census` result and the relevant regional/content-pack validators.

## Validation

Repository entry points are:

```bash
npm test
npm run benchmark
npm run benchmark:sample
npm run census
npm run hardening
npm run check
```

Hosted `Check` runs on Node 24 LTS. `package.json` requires Node `>=24`. Report only checks that actually ran. Documentation-only synchronization after a frozen green implementation does not create a new runtime/tooling validation checkpoint.

`tests/architectureDebtGuard.test.js` protects selected compatibility and lifecycle seams, including the exact direct timed-task owner set and the removal of runtime legacy active-travel reconstruction.

`tests/contentScaleGate.test.js` protects the criteria-driven content-scale target definitions and census behavior. Future content targets are progression indicators, not CI pass/fail thresholds: a game can be valid while still being below mechanics-integration, playable-alpha, or 1.0 breadth.

## Content progression

`npm run census` reports unique canonical breadth across the main runtime catalogs and regional content packs for:

```text
places/localities
named NPCs
functional shop/service sites
creature definitions
resource sources
canonical items
recipes/processes
abilities/techniques
quests/contracts
companions
scheduled transport services
```

Use it before and after content-heavy tracks when the metric is material. Do not optimize the census with disconnected filler records. A content tranche should still satisfy stable-ID, originality, source/sink, topology, provenance, cross-reference, regional ownership, and player-facing integration requirements.

The lower-bound targets come from `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`. Meeting a numeric target is scale evidence only; it is not a balance, originality, usability, or release-quality claim.

## Persistence

Current mode is **pre-alpha current-schema only**.

- Account/session payloads must match Account Save 5 exactly.
- Character payloads must match Game State 12 and contain complete required persisted authority before reference revival.
- Raw validation runs before runtime `ensure*` helpers, reconstructed projections, or session-presentation initialization may normalize state.
- Malformed required persisted authority is rejected rather than repaired, backfilled, migrated, or silently rewritten.
- Optional persisted authority may be absent where construction semantics permit it, but once present must satisfy its domain contract.
- Active owner/task links must remain consistent until owner reconciliation.
- Tightening enforcement of an existing invariant does not alone require a schema bump; changing serialized shape or meaning does.
- Derived or session-only runtime state must not be serialized merely because it is convenient to consume.

### Current raw Game State 12 validation

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
```

Optional persisted authorities remain:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

### Derived, transient, and post-validation state

Current non-serialized/runtime-only state includes:

```text
state.npcs
state.enemies
state.log
player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

Product `.50` classified `state.npcs` as a runtime world projection. Product `.51` classified `state.enemies` as a runtime encounter-template projection whose mutable encounter authority lives in `activeBattle`.

Product `.52` classifies top-level `state.log` as **session-only command presentation history**. The command adapter appends bounded wall-clock-stamped command input for `log`/`inspect log` diagnostics. Save encoding omits it, saving does not clear the live session, and character load resets any supplied/injected log to `[]` after raw validation and before broad runtime validation.

This top-level log is not a substitute for durable chronology. `state.events` remains the persisted structured semantic observation channel with typed data and fictional-time context. Tests prove semantic consumers do not parse `state.log` prose. Canvas `commandHistory` and output buffers are separate transient UI state. `activeBattle.log` is separate persisted encounter-local history and remains under active-battle authority.

Root `player.combat` and `player.statState` remain reconstructible caches. Mutable HP/MP/TP remain persisted independently. `activeBattle.rng` remains transient.

### Historical schema decisions

- Game State 7 replaced wall-clock atlas `visitedAt` with fictional-time `visitedAtWorldSeconds`.
- Game State 8 removed root player combat/stat caches from serialized authority.
- Game State 9 canonicalized persisted player-status modifiers into nested modifier blocks.
- Game State 10 removed the reconstructible `state.npcs` runtime projection from serialized authority.
- Game State 11 removed the reconstructible `state.enemies` encounter-template projection from serialized authority.
- Game State 12 removed top-level session command presentation history from serialized authority.

No automatic compatibility migrations were added for those pre-alpha transitions.

### State-classification rule

Before adding a raw validator, classify the state first:

1. **persistent required authority** — validate before revival;
2. **derived/transient** — recompute or initialize from authoritative/runtime inputs;
3. **construction convenience** — initialize in factory/new-state/internal paths, not as implicit current-save migration;
4. **optional persisted authority** — absence is allowed, but once present the stored value must satisfy its domain contract.

Do not compose broad `validatePlayer()` wholesale at the raw boundary. The dedicated broad-array sequence is complete: `state.npcs`, `state.enemies`, and top-level `state.log` are classified. Do not reopen that sequence merely to find another revision.

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
tests/currentSchemaPresentationLog.test.js
```

Revisions `.50`–`.52` demonstrate that ownership audits can correctly remove convenient runtime arrays from serialization rather than promote them to false durable authority.

## Resource lifecycle

New long-lived runtime resources require a clear owner, creation condition, duplicate-prevention strategy, and cleanup behavior. Repeated scene/view changes, activity transitions, save/load, and pause/resume must not accumulate duplicate resources. See `docs/RESOURCE_LIFECYCLE.md`.

A new direct production timed-task creator must define its durable consequence, exactly-once reconciliation point, and terminal release responsibility. The architecture guard currently admits only the six audited task-owner modules.

For the planned `0.8.700` cultivation pass, do not create one long-lived timed task per growing plot by reflex. Prefer persisted domain state plus canonical-world-time derivation when growth itself does not need active task ownership.

## Performance and long-session stability

Benchmark 3 and repeated sampling are the current comparability protocol. Do not invent hard thresholds before a repeatable baseline is explicitly accepted. Lifecycle-sensitive work must preserve deterministic long-session smoke and owner-managed zero-retained-task steady-state evidence.

Latest validated implementation/tooling evidence is validation-only PR #377 exact head `b0c1e067a1907a8587a08a128126f9207c6d6134`, Check `32308719621`, Node 24.19.0: **692/692 tests**, Benchmark 3 success, Benchmark Sample success. The PR was closed without merge after validation. Product remains `0.8.600.52`; this checkpoint adds continuation/content-census tooling rather than a new gameplay version.

Benchmark 3 single run:

```text
player profiles  0.393820 ms/op
enemy profiles   0.070731 ms/op
basic attacks    0.003811 ms/op
tick dispatch    0.001062 ms/op
route lookup     0.007603 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.362912 ms/op   10.42%
enemy profiles   0.065795 ms/op    9.93%
basic attacks    0.001204 ms/op  200.40%
tick dispatch    0.000696 ms/op   33.93%
route lookup     0.006992 ms/op    9.64%
```

No hard threshold is accepted.

## UI and adapter boundaries

The semantic DOM shell is the active player interface. UI work must preserve keyboard usability, acquired-knowledge map privacy, sensible focus/navigation behavior, and separation of authoritative game state from presentation.

Canonical `ActionResult` consumers use `ok`, `action`, `code`, `outcome`, `data`, and `display`; do not restore `.message`/`.reason` compatibility aliases or prose parsing as domain logic.

## Definition of done

A bounded implementation is complete when production behavior is coherent, relevant validation actually ran or limitations are reported, persistence/lifecycle contracts are preserved, performance evidence is collected when material, architecture guards remain green, content-scale evidence is recorded when material, deliberate version decisions are recorded, the exact implementation SHA is frozen before documentation synchronization, and `docs/THREAD_HANDOFF.md` is updated last when current state or immediate next work changes.
