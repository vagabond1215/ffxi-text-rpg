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

The latest user work order explicitly authorized the next highest-recommended maintenance pass after Product `.50`: audit the `state.enemies` ownership/persistence boundary, create the plan, and implement the coherent result. That pass is complete as Product `.51`. It does **not** authorize automatically starting the remaining `state.log` audit or opening `0.8.700`.

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
Product:       0.8.600.51
Package:       0.8.600
Account Save:  5
Game State:    11
Data:          37
Benchmark:     3
Codename:      Derived Enemy Encounter Projection
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.42.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.51` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current branch and runtime freeze

Normal development branch: `main`.

The `.51` runtime was implemented directly on `main` under the bounded normal-work policy and frozen at:

```text
5a97a109d9476438d001ee75b8e20293f57360dd
```

Documentation/configuration commits after that SHA are synchronization only and do not create a new runtime checkpoint.

Validation-only draft PR **#375** existed solely to surface the repository's normal pull-request `Check` for that frozen runtime. It was closed **without merge** after validation.

```text
Head   5a97a109d9476438d001ee75b8e20293f57360dd
PR     #375 validation-only, closed without merge
Check  32297557960
Node   24.19.0
```

Observed hosted validation:

```text
tests              684
pass               684
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

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

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

## Product `.51` — Derived Enemy Encounter Projection

### Audit conclusion

The dedicated `state.enemies` audit traced production construction, readers, mutation sites, spawn references, and the encounter-cloning boundary before changing persistence.

Current ownership is:

```text
createSeedEnemies() / authored enemy definitions
  -> stable encounter-template identity/species/zone/level/loot/aggro inputs

createEnemy()
  -> constructs each template and deterministically derives its initial combat/resources

place spawn rules / player opportunities
  -> reference stable enemy IDs

startEncounter()
  -> resolves a template and constructs a distinct encounter combatant

activeBattle
  -> durable mutable combatants, resources, statuses, actions, timeline and phase
```

No production mutation of `state.enemies` was found. No durable world fact is owned solely by that array. The `combat` and `resources` fields created on seed enemies are deterministic construction data, not ongoing entity history.

Therefore `state.enemies` is **derived/reconstructible encounter-template state**, not persisted mutable world-entity authority.

### Runtime implementation

New module:

```text
js/text/systems/enemyEncounterProjection.js
```

`refreshEnemyEncounterProjection(state)` replaces `state.enemies` with fresh canonical entities from `createSeedEnemies()`.

The existing post-validation world-projection chain now reconstructs enemy templates during `refreshNpcWorldProjection(state)`, before rebuilding NPC projection. This is the current bounded orchestration seam; do not refactor it merely for naming aesthetics without a separate reason.

Save encoding now omits both top-level projections:

```text
state.npcs
state.enemies
```

Raw `currentGameStateSchema.js` no longer requires either array. `state.log` remains the only broad required top-level array awaiting ownership classification.

A forged/stale serialized `enemies` field cannot become authority. Game State 11 accepts the payload without requiring that projection and revival deterministically replaces supplied runtime enemy data before encounter lookup.

### Active battle remains different

Do not infer from `.51` that enemy combat state is generally non-persistent.

Once `startEncounter()` resolves a template, the battle engine constructs a unique encounter combatant under `activeBattle`. That snapshot is governed by the established active-battle persistence contract and carries mutable resources, statuses, deterministic caches, action history/timeline, sides and phase through save/load. Only the reusable seed/template projection left serialized authority.

## `.51` focused regression coverage

New test file:

```text
tests/currentSchemaEnemyEncounterProjection.test.js
```

It proves:

- raw Game State 11 is valid without `state.enemies`;
- `state.log` remains required pending its own audit;
- refresh replaces forged enemy templates with fresh canonical seed entities;
- mutating a projected seed enemy's HP does not survive a projection refresh;
- save encoding omits `enemies`;
- load reconstructs canonical enemy templates before `startEncounter()` lookup;
- a loaded reconstructed template can start a normal encounter;
- injected serialized enemy projection data is replaced rather than accepted as authority.

Existing NPC projection coverage was advanced to Game State 11 and now proves both `npcs` and `enemies` are absent from encoded state. Discovery/version-manifest expectations were advanced accordingly. Full hosted coverage remained green.

## `.51` version decision

This packet changes serialized Game State shape and therefore advances the schema version.

```text
Product                    0.8.600.50 -> 0.8.600.51
Game State                 10 -> 11
Validation                 0.41.0 -> 0.42.0
saveEncoding               0.7.0 -> 0.8.0
playerDerivedState         0.1.1 -> 0.1.2
npcWorldProjection         0.1.0 -> 0.1.1
enemyEncounterProjection   new 0.1.0
Account Save               5 unchanged
Package                    0.8.600 unchanged
Data                       37 unchanged
Benchmark                  3 unchanged
```

No Game State 10 → 11 migration was added. That is deliberate under the pre-alpha current-schema-only policy.

Historical schema transitions are now:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers;
- `.50`: Game State 9 → 10 when the reconstructible `state.npcs` runtime projection left serialized authority;
- `.51`: Game State 10 → 11 when the reconstructible `state.enemies` encounter-template projection left serialized authority.

## Current raw Game State 11 boundary

`currentGameStateSchema.js` validates decoded state **before reference revival, derived projection reconstruction, and runtime `ensure*` normalization**.

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
state.log array pending dedicated ownership classification
```

Optional persisted authority:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

Derived/transient or post-revival:

```text
state.npcs
state.enemies
flat player.inventory alias identity
player.combat
player.statState
activeBattle.rng
```

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- raw persistence validation before revival/runtime normalization;
- inventory owns container/access/capacity/transfer/carried-item facts;
- equipment is durable loadout authority;
- player identity/key items/player flags and world flags are strict durable facts;
- current place/name/position is one coherent persisted location authority;
- transport derives carried load and owns fare/cadence/departure/arrival/service limits;
- projects own material/labor/completion state;
- work owns durable work records when constructed;
- work proficiency is character-owned mastery and optional persisted authority;
- production owns recipe/work/input/output/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- party owns persistent companion membership/location/tactics/resources/statuses;
- NPC backing records are reconstructed projection of canonical seed + party authority, not a second persistence store;
- enemy seed/template records are reconstructed encounter projection, while `activeBattle` owns mutable ongoing enemy combat state;
- commitments remain separate from relationships and Journal projection;
- NPC schedules are recurring availability against canonical fictional time, not a second clock;
- atlas/POI discovery is acquired knowledge and uses canonical fictional visit time;
- semantic events are bounded observational history, not world authority, while persisted ID/order/sequence integrity is strict;
- mutable HP/MP/TP and wallet balances persist;
- root player combat/stat caches are omitted from saves and rebuilt after validation;
- canonical player statuses persist and use nested modifier blocks;
- active battle persists with deterministic combat/stat snapshots while live RNG does not;
- combatSequence and activeBattle identity must remain coherent;
- an active battle player must remain bound to root player ID/resources/statuses/combat-driving profile;
- terminal battle snapshots are historical rather than live-character mirrors;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Documentation synchronization after `.51` runtime freeze

After runtime freeze at `5a97a109d9476438d001ee75b8e20293f57360dd`, documentation/configuration was synchronized without changing runtime behavior:

- `PROJECT_PROFILE.yaml` — Game State 11, enemy projection classification/serialization exclusion, `state.log` as sole remaining audit;
- `docs/ROADMAP.md` — `.51` checkpoint, validation evidence, next decision boundary;
- `docs/ARCHITECTURE.md` — enemy encounter-template ownership and active-battle distinction;
- `docs/QUALITY_GATES.md` — Game State 11 raw/derived boundary and regression evidence;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — Game State 10 → 11 schema decision;
- `README.md` — current runtime/persistence orientation;
- `docs/SYSTEM_CATALOG.md` — current projection and combat authority status;
- this handoff — updated last.

These documentation commits are not new runtime checkpoints and were not independently benchmarked.

## Next bounded work unit — not started

**Highest recommended next maintenance pass: audit `state.log` ownership/persistence.**

Do not begin by validating log entries. First trace every producer and consumer and classify at least:

```text
command input history
player-facing recent output/history
wall-clock timestamp usage
canvas/DOM presentation history
save/load expectations
semantic-event overlap or lack thereof
whether anything mechanically reads log prose
```

Current evidence already suggests `appendLog()` writes wall-clock-stamped command/presentation history and command help describes `log` as recent command history, while `state.events` is the structured semantic observational channel. The next pass must prove the boundary across all producers/consumers before deciding whether `state.log` should leave Game State authority, remain optional durable player memory, or be replaced by a more explicit presentation-history owner.

Do **not** combine the log audit with a UI redesign. Do **not** automatically begin `0.8.700`.

## Session status

```text
Branch:                 main
Runtime freeze:         5a97a109d9476438d001ee75b8e20293f57360dd
Relevant PR:            #375 validation-only, closed without merge
Hosted Check:           32297557960 success
Tests:                  684/684 passed
Benchmark 3:            success
Benchmark Sample:       success
Known runtime failures: none observed
Known blocker:          none
Next unit:              state.log ownership/persistence audit
```
