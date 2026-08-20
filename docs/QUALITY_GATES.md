# Quality Gates

These repository-level gates supplement the current handoff, execution pipeline, and focused design authorities.

## Before implementation

- Confirm current `main` and read `docs/THREAD_HANDOFF.md`.
- Read `docs/EXECUTION_PIPELINE.md`; do not restart broad discovery when the checkpoint is current.
- Identify the authoritative state owner and production caller for the requested behavior.
- Inspect focused tests and nearby persistence/runtime/UI contracts.
- Read `docs/PERFORMANCE_BUDGET.md` and `docs/RESOURCE_LIFECYCLE.md` for lifecycle- or performance-sensitive work.
- For content-heavy work, use `npm run census` when the metric is material and executable.
- A planned roadmap unit is not authorization to implement it.

## Validation entry points

```bash
npm test
npm run benchmark
npm run benchmark:sample
npm run census
npm run hardening
npm run check
```

Hosted `Check` normally runs the full test suite, Benchmark 3 and Benchmark Sample on Node 24. Report only checks that actually ran. Documentation-only synchronization after a frozen green implementation does not create a new runtime checkpoint.

`tests/architectureDebtGuard.test.js` protects selected compatibility/lifecycle seams. `tests/contentScaleGate.test.js` protects criteria-driven content-scale target definitions. Future breadth targets are progression indicators, not ordinary CI pass/fail thresholds.

## Current Phase 0.8 validation baseline

Frozen runtime:

```text
ca7d37c643adc4115b519148615f6120d03228df
Product 0.8.900.1
Package 0.8.900
Account Save 5
Game State 14
Data 39
Benchmark 3
```

Hosted Check `32395768383` / Node 24.19.0:

```text
699/699 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Phase-exit validation-only Check `32395959505` additionally ran and passed:

```text
Content Census
Hardening
```

Hardening includes `tests/longSessionLifecycle.test.js` (2/2 pass) followed by Benchmark Sample.

Validation-only PR #380 is closed without merge.

## Persistence

Current mode remains **pre-alpha current-schema only**.

- Account/session payloads must match Account Save 5 exactly.
- Character payloads must match Game State 14 and contain complete required persisted authority before reference revival.
- Raw validation runs before runtime `ensure*` helpers, reconstructed projections, or presentation initialization may normalize state.
- Malformed required persisted authority is rejected rather than repaired, backfilled, migrated, or silently rewritten.
- Optional persisted authority may be absent only where its domain contract permits absence.
- Active owner/task links must remain consistent until owner reconciliation.
- Changing serialized shape/meaning requires a deliberate schema decision; derived/session state is not serialized merely for convenience.

### Game State 14 raw validation

Required persisted families include:

```text
world time and simulation control
timed tasks and active owner/task links
active Travel State 2
projects, commitments, relationships
resource opportunities and ecology
cultivation plot/crop/delegation authority
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
active battle state when present, including deterministic combat/stat snapshots
active battle player / root player live-authority coherence
```

Optional persisted authorities remain:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

### Cultivation and delegation classification

`state.cultivation` is **persistent required authority**. It preserves player-costly facts that cannot be reconstructed safely: prepared/growing state, cycle/harvest counts, active manual work link, crop timing, seed provenance, and paid delegation appointment state.

Crop growth is **not** a timed-task resource. Manual preparation/tending reuse the existing work/timed-task chain. Paid delegated tending uses no new direct timed-task owner and resolves from persisted canonical fictional-time boundaries.

### Derived/transient state

Current non-authoritative runtime state still includes:

```text
state.npcs
state.enemies
state.log
player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

`state.events` remains persisted structured semantic observation history. `activeBattle.log` remains persisted encounter-local history. Top-level `state.log` remains session-only presentation history.

### Historical schema decisions

- Game State 7 — canonical fictional-time atlas visits.
- Game State 8 — root player combat/stat caches removed from serialization.
- Game State 9 — canonical persisted status modifier shape.
- Game State 10 — `state.npcs` projection removed from serialization.
- Game State 11 — `state.enemies` projection removed from serialization.
- Game State 12 — top-level command presentation history removed from serialization.
- Game State 13 — required durable cultivation plot/crop authority introduced.
- Game State 14 — durable paid cultivation delegation appointment introduced.

No automatic pre-alpha migrations were added.

## Lifecycle gates

Current direct timed-task creators remain the audited six owners:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

Cultivation growth and delegated tending do not add another owner.

Required properties:

- owner defines durable consequence;
- exactly-once reconciliation occurs before terminal release;
- save/load preserves active ownership without duplicate resources;
- task sequence IDs remain monotonic;
- no blind global task pruning;
- no wall-clock/offline simulation becomes canonical.

`npm run hardening` is required for phase/release gates or material lifecycle-sensitive changes.

## Phase 0.8 connected-life gate

Phase 0.8 is complete only because the following remain connected in one authority model:

```text
home/storage/workshop
  -> cultivation
  -> repeated manual routine/mastery
  -> bounded paid delegation
  -> home-grown provenance
  -> scheduled named community commitments/relationships
  -> ordinary services, preparation, travel and adventure
```

See `docs/PHASE_0_8_EXIT_GATE.md` for exact evidence.

## Content progression

Current census:

| Metric | Current | Mechanics floor |
| --- | ---: | ---: |
| Places/localities | 26 | 10 |
| Named NPCs | 12 | 50 |
| Shop/service sites | 17 | 20 |
| Creature definitions | 16 | 40 |
| Resource sources | 13 | 40 |
| Canonical items | 50 | 200 |
| Recipes/processes | 11 | 75 |
| Abilities/techniques | 5 | 100 |
| Quests/contracts | 8 | 30 |
| Companions | 1 | 4 |
| Transport services | 3 | 5 |

Mechanics-scale gate is **NOT READY**. Places exceed their mechanics floor; all other tracked categories remain below it. The largest relative gap is abilities/techniques.

Do not game counts with disconnected filler. Phase 0.9 content work should build dense cross-linked regional graphs.

## Performance and long-session stability

Benchmark 3 remains the current comparability protocol. No hard thresholds are accepted.

Frozen-runtime sample medians/spreads from Check `32395768383`:

```text
player profiles  0.359735 ms/op    6.77%
enemy profiles   0.068665 ms/op    8.93%
basic attacks    0.001223 ms/op  172.92%
tick dispatch    0.000821 ms/op   27.23%
route lookup     0.007260 ms/op    6.40%
```

The very fast attack/tick workloads remain noisy; do not convert these numbers into CI thresholds.

## UI and adapter boundaries

The semantic DOM shell is the active player interface. Direct gameplay intents include:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
commitment.accept
commitment.resolve
commitment.followUp
```

The Journal/context model may project player decisions but must not expose raw plot IDs, internal timestamps/provenance structures, or require command-string manufacture.

Canonical `ActionResult` consumers continue using `ok`, `action`, `code`, `outcome`, `data`, and `display`; domain logic must not parse presentation prose.

## Definition of done

A bounded implementation is complete when production behavior is coherent, relevant validation actually ran, persistence/lifecycle contracts are preserved, performance/content-scale evidence is recorded when material, version decisions are explicit, the exact implementation SHA is frozen before documentation synchronization, and `docs/THREAD_HANDOFF.md` is updated last.

Phase 0.8 is closed. Phase 0.9 is planned but not opened; a separate explicit work order is required before `0.9.100` implementation or governance changes begin.
