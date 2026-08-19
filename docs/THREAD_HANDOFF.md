# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`, `docs/QUALITY_GATES.md`, `PROJECT_PROFILE.yaml`, `js/text/version.js`, and systems/tests relevant to the next bounded work order.

## Workflow and bounded-work rule

Hearth & Horizon is pre-alpha. Old local saves/accounts are not a compatibility requirement unless a future work order explicitly changes that policy.

Runtime first. Freeze runtime before documentation. Update this handoff last. Report only validation that actually ran.

The latest user instruction, `continue`, explicitly authorized the next bounded maintenance unit named by the prior handoff: audit top-level `state.log` ownership/persistence and implement the coherent result. That pass is complete as Product `.52`.

The earlier three-array classification sequence is now complete:

```text
state.npcs    -> derived runtime world projection
state.enemies -> derived encounter-template projection
state.log     -> transient current-session command presentation history
```

There is **no automatically authorized next maintenance packet** from that sequence. Do not open `0.8.700` or choose another revision merely because `.52` is complete.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is bounded research/reference only.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments and relationships remain separate authorities. Presentation and reconstructible projections remain derived from canonical state.

## Current baseline

```text
Product:       0.8.600.52
Package:       0.8.600
Account Save:  5
Game State:    12
Data:          37
Benchmark:     3
Codename:      Transient Command Presentation Log
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.43.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.52` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current branch and runtime freeze

Normal development branch: `main`.

The `.52` runtime was implemented directly on `main` and frozen at:

```text
0fb444aee8b6dbd3a35bb1d3b7662728d85fd691
```

Documentation/configuration commits after that SHA are synchronization only and do not create a new runtime checkpoint.

Validation-only draft PR **#376** existed solely to surface the repository's normal pull-request `Check` for that frozen runtime. It was closed **without merge** after validation.

```text
Head   0fb444aee8b6dbd3a35bb1d3b7662728d85fd691
PR     #376 validation-only, closed without merge
Check  32301160532
Node   24.19.0
```

Observed hosted validation:

```text
tests              688
pass               688
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single run:

```text
player profiles  0.399417 ms/op
enemy profiles   0.070029 ms/op
basic attacks    0.003675 ms/op
tick dispatch    0.000898 ms/op
route lookup     0.007617 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.357454 ms/op    7.63%
enemy profiles   0.070214 ms/op   11.19%
basic attacks    0.001153 ms/op  214.09%
tick dispatch    0.000873 ms/op   30.99%
route lookup     0.007237 ms/op    6.02%
```

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

## Product `.52` — Transient Command Presentation Log

### Audit conclusion

The dedicated audit traced every production producer/consumer rather than adding a log validator by default.

Top-level `state.log` ownership is:

```text
commandRouter
  -> calls appendLog(state, `> ${parsed.input}`) for routed command input

gameState.appendLog
  -> stores { at: new Date().toISOString(), entry }
  -> bounds history to the latest 100 entries

log / inspect log
  -> only production readers
  -> render the recent timestamped command history
```

No gameplay/domain system reads the top-level log or parses its prose. Writing a command log entry does not advance canonical fictional time and does not itself create a semantic event.

Other history-like structures are separate authorities:

```text
state.events
  -> persisted typed semantic observation history
  -> stable sequence ids
  -> canonical fictional-time context

activeBattle.log
  -> separate persisted encounter-local battle narrative/action history

canvas uiState.commandHistory / outputLines
  -> separate transient UI input/output buffers
```

`tests/semanticEventEngine.test.js` already proves semantic event consumers operate without parsing top-level log prose. Character state replacement could already discard command history, further confirming that it is not continuous-character authority.

Therefore top-level `state.log` is **transient current-session presentation/diagnostic state**, not durable Game State.

### Runtime implementation

New module:

```text
js/text/systems/presentationLog.js
```

`resetPresentationLog(state)` sets the runtime presentation history to a fresh empty array.

Persistence behavior is deliberately phase-specific:

1. new game state still constructs `log: []` so runtime diagnostics have a valid array;
2. live routed commands continue appending bounded wall-clock presentation history;
3. `saveGame()` validates the current runtime normally and **does not clear** the live session log;
4. save encoding omits top-level `state.log` alongside the existing non-authoritative world/entity projections;
5. `loadCharacter()` validates the raw Game State 12 payload first;
6. only after raw validation, load calls `resetPresentationLog(state)` before broad runtime validation/revival;
7. supplied or injected serialized top-level log history therefore cannot become character authority;
8. a loaded character begins a fresh command-diagnostic session while persisted `state.events` remains intact.

This is intentionally **not** a conversion of command timestamps from wall clock to fictional time. Those timestamps are appropriate for transient presentation. Durable chronology belongs to typed domain state such as semantic events, tasks, day-cycle records, travel, commitments, or active battle.

### Raw-schema result

`currentGameStateSchema.js` no longer requires any of the three broad top-level arrays:

```text
state.npcs
state.enemies
state.log
```

That does not mean runtime state may omit them arbitrarily. Post-validation runtime construction/revival supplies the needed projections/session state, and broad runtime validation may still assert runtime invariants such as `state.log` being an array.

## `.52` focused regression coverage

New test file:

```text
tests/currentSchemaPresentationLog.test.js
```

It proves:

- raw Game State 12 is valid without `npcs`, `enemies`, or top-level `log`;
- routed command logging is wall-clock presentation history and does not change fictional world time or semantic events;
- `log` remains a functioning current-session diagnostic command;
- save encoding omits `npcs`, `enemies`, and `log`;
- saving does not erase the current in-memory command history;
- structured semantic events survive save/load unchanged;
- a loaded character begins with an empty presentation log and can immediately accumulate new commands;
- injected serialized command history is discarded on load rather than accepted as durable authority.

NPC/enemy projection and discovery/version-manifest suites were advanced to Game State 12. Full hosted coverage remained green at 688/688.

## `.52` version decision

The packet changes serialized Game State shape, so it advances the schema version.

```text
Product          0.8.600.51 -> 0.8.600.52
Game State       11 -> 12
Validation       0.42.0 -> 0.43.0
saveEncoding     0.8.0 -> 0.9.0
presentationLog  new 0.1.0
Account Save     5 unchanged
Package          0.8.600 unchanged
Data             37 unchanged
Benchmark        3 unchanged
```

No Game State 11 → 12 migration was added. That is deliberate under the current-schema-only pre-alpha policy.

Historical schema transitions now include:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers;
- `.50`: Game State 9 → 10 when `state.npcs` projection left serialized authority;
- `.51`: Game State 10 → 11 when `state.enemies` projection left serialized authority;
- `.52`: Game State 11 → 12 when top-level command presentation history left serialized authority.

## Current raw Game State 12 boundary

`currentGameStateSchema.js` validates decoded state **before reference revival, projection reconstruction, presentation-session initialization, and runtime `ensure*` normalization**.

Required raw validation covers:

```text
world time / simulation control
timed tasks and active owner/task links
active Travel State 2
projects / commitments / relationships
resource opportunities / ecology
party / ability runtime
semantic events
atlas / POI discovery
player envelope / identity / key items / player flags
player progression / lifetime training / learned skills / capabilities
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical statuses
top-level world flags
current place / display location / position coherence
combatSequence / activeBattle.id coherence
active battle and deterministic encounter combat/stat snapshots when present
active battle player / root player live-authority coherence while active
```

Optional persisted authority:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

Derived/transient or post-validation runtime state:

```text
state.npcs
state.enemies
state.log
flat player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- raw persistence validation before revival/runtime normalization;
- `state.events` is persisted typed semantic observation history and must not depend on presentation prose;
- top-level `state.log` is session-only command presentation history, not durable character memory;
- `activeBattle.log` is separate persisted encounter-local history;
- Canvas command/output history is transient UI state separate from Game State;
- inventory owns container/access/capacity/transfer/carried-item facts;
- equipment is durable loadout authority;
- player identity/key items/player flags and world flags are strict durable facts;
- current place/name/position is one coherent persisted location authority;
- projects, work, production, recovery, transport, commitments, relationships, party, ecology and resources retain their declared owners;
- NPC backing records are reconstructed projection of canonical seed + party authority;
- enemy seed/template records are reconstructed encounter projection, while `activeBattle` owns mutable ongoing enemy combat state;
- root player combat/stat caches are omitted from saves and rebuilt after validation;
- active battle persists deterministic encounter state while live RNG does not;
- combatSequence and activeBattle identity must remain coherent;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Documentation synchronization after `.52` runtime freeze

After runtime freeze at `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691`, documentation/configuration was synchronized without changing runtime behavior:

- `PROJECT_PROFILE.yaml` — Game State 12, presentation-log exclusion, broad-array series complete;
- `docs/ROADMAP.md` — `.52` checkpoint, validation evidence, fresh next-decision boundary;
- `docs/ARCHITECTURE.md` — command presentation / semantic event / active-battle history separation;
- `docs/QUALITY_GATES.md` — Game State 12 raw/transient boundary and focused regression evidence;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — Game State 11 → 12 schema decision;
- `README.md` — current runtime/persistence orientation;
- `docs/SYSTEM_CATALOG.md` — current transient presentation-history status;
- this handoff — updated last.

These documentation commits are not new runtime checkpoints and were not independently benchmarked.

## Next bounded work — not selected

The persistence classification queue that drove Products `.50`–`.52` is complete. There is no inherited next audit to begin automatically.

Do **not** automatically begin `0.8.700`.

For a future user request to continue, first refresh repository authority and select one bounded unit based on the then-current roadmap and evidence. Candidate feature families currently named in roadmap/catalog include:

```text
agriculture / gardening / stewardship
earned automation or hired labor after established chores
justified companion / social-life breadth
another concrete life / logistics gap
```

A maintenance packet is also valid when a specific repository-evidenced risk is identified, but do not manufacture another persistence audit merely to extend revision numbering.

## Session status

```text
Branch:                 main
Runtime freeze:         0fb444aee8b6dbd3a35bb1d3b7662728d85fd691
Relevant PR:            #376 validation-only, closed without merge
Hosted Check:           32301160532 success
Tests:                  688/688 passed
Benchmark 3:            success
Benchmark Sample:       success
Known runtime failures: none observed
Known blocker:          none
Broad array audits:     complete (npcs, enemies, log)
Next unit:              not selected; fresh bounded work order required
```
