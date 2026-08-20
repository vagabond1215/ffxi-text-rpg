# Quality Gates

These repository-level gates supplement the current handoff, execution pipeline, and focused design authorities.

## Before implementation

- Confirm current `main`, active PR state, and read `docs/THREAD_HANDOFF.md`.
- Read `docs/EXECUTION_PIPELINE.md`; do not restart broad discovery when the checkpoint is current.
- Identify the authoritative state owner and production caller for the requested behavior.
- Inspect focused tests and nearby persistence/runtime/UI contracts.
- Read `docs/PERFORMANCE_BUDGET.md` and `docs/RESOURCE_LIFECYCLE.md` for lifecycle- or performance-sensitive work.
- For content-heavy work, use `npm run census` when the metric is material and actually executable.

## Validation entry points

```bash
npm test
npm run benchmark
npm run benchmark:sample
npm run census
npm run hardening
npm run check
```

Hosted `Check` runs on Node 24 LTS. Report only checks that actually ran. Documentation-only synchronization after a frozen green implementation does not create a new implementation validation checkpoint.

`tests/architectureDebtGuard.test.js` protects selected compatibility and lifecycle seams. `tests/contentScaleGate.test.js` protects criteria-driven content-scale target definitions. Future breadth targets are progression indicators, not CI pass/fail thresholds.

## Draft 0.8.700 validation baseline

Draft PR #378 is open/unmerged. Exact frozen implementation head:

```text
c125f7ae5f94800893dc28c7fa0ceb61553e3db8
Check 32340190710
Job 96337561458
Node 24.19.0
695/695 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Focused cultivation coverage:

```text
tests/currentSchemaCultivation.test.js
tests/playerCultivationStewardshipFlow.test.js
```

It proves required raw cultivation authority, timing/link rejection, real save/load mid-growth, no crop-owned growth task, exactly-once work reconciliation/harvest, provenance continuity, mastery-based duration improvement, existing sink participation, and semantic browser presentation.

## Persistence

Current mode remains **pre-alpha current-schema only**.

On PR #378:

- Account/session payloads must match Account Save 5 exactly.
- Character payloads must match Game State 13 and contain complete required persisted authority before reference revival.
- Raw validation runs before runtime `ensure*` helpers, reconstructed projections, or presentation initialization may normalize state.
- Malformed required persisted authority is rejected rather than repaired, backfilled, migrated, or silently rewritten.
- Optional persisted authority may be absent only where its domain contract permits absence.
- Active owner/task links must remain consistent until owner reconciliation.
- Changing serialized shape/meaning requires a deliberate schema decision; derived/session state is not serialized merely for convenience.

### Game State 13 raw validation

Required persisted families include:

```text
world time and simulation control
timed tasks and active owner/task links
active Travel State 2
projects, commitments, relationships
resource opportunities and ecology
cultivation plot/crop authority
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

When `state.cultivation.plot.activeWorkId` is non-null, cross-link validation requires the matching persisted active `state.work` record. The existing work record in turn requires its normal persisted timed task.

### Cultivation state classification

`state.cultivation` is **persistent required authority**, not a derived projection. It preserves player-costly facts that cannot be reconstructed safely:

- whether the bed is prepared/growing;
- cycle/harvest counts;
- active cultivation labor link;
- planting/tending/readiness fictional timestamps;
- seed provenance during growth.

Crop growth itself is **not** a timed-task resource. Readiness derives from canonical world time against persisted timestamps. Only preparation/tending are short hands-on work tasks.

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

No automatic pre-alpha migrations were added.

## Cultivation lifecycle gate

The cultivation architecture must continue to satisfy:

```text
plant/grow state
  -> persisted cultivation timestamps
  -> no crop-owned timer/task

prepare/tend
  -> existing work record
  -> existing work timed task
  -> domain reconciliation copies durable consequence
  -> terminal task released exactly once

harvest
  -> validates readiness
  -> stores ordinary canonical item in inventory
  -> records cultivated provenance + seed provenance
  -> clears crop / increments harvest count
  -> replay cannot duplicate output
```

Adding a per-crop scheduler, background job, offline clock, duplicate inventory, or second mastery counter requires a new explicit architecture decision rather than incremental convenience code.

## Content progression

`npm run census` measures unique canonical breadth across places, NPCs, service sites, creatures, resource sources, items, recipes, abilities, quests, companions, and transport services. Do not game counts with disconnected filler.

No scale-count increase is claimed for `0.8.700`: its first proof deliberately reuses an existing Sweetroot item and existing sinks rather than adding breadth solely for the metric. A standalone census output was not recorded in this pass.

## Performance and long-session stability

Benchmark 3 remains the current comparability protocol. No hard thresholds are accepted.

PR #378 single run:

```text
player profiles  0.350069 ms/op
enemy profiles   0.068868 ms/op
basic attacks    0.003197 ms/op
tick dispatch    0.000788 ms/op
route lookup     0.007068 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.331167 ms/op    6.35%
enemy profiles   0.062892 ms/op    7.69%
basic attacks    0.001206 ms/op  166.26%
tick dispatch    0.000613 ms/op   54.43%
route lookup     0.006783 ms/op    5.66%
```

The very fast attack/tick workloads remain noisy; do not turn these figures into CI thresholds.

## UI and adapter boundaries

The semantic DOM shell is the active player interface. Cultivation actions are direct intents:

```text
cultivation.prepare
cultivation.plant
cultivation.tend
cultivation.harvest
```

The Journal/context model may project cultivation status but must not expose raw plot IDs, internal timestamps, seed-provenance structures, or command vocabulary as required gameplay. Recommendation logic must not allow a merely ready cultivation bed to suppress stronger active/ready commitment, livelihood, home, or recovery decisions.

Canonical `ActionResult` consumers continue using `ok`, `action`, `code`, `outcome`, `data`, and `display`; domain logic must not parse presentation prose.

## Definition of done

A bounded implementation is complete when production behavior is coherent, relevant validation actually ran, persistence/lifecycle contracts are preserved, performance/content-scale evidence is recorded when material, version decisions are explicit, the exact implementation SHA is frozen before documentation synchronization, and `docs/THREAD_HANDOFF.md` is updated last.

For feature-branch work, a green implementation is **validated but not landed** until the PR is explicitly merged. Do not start the next independent track by default while the current feature PR remains unresolved.
