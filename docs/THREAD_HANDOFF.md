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

The latest user work order explicitly authorized the highest-recommended next maintenance pass after Product `.49`: audit the `state.npcs` ownership/persistence boundary and implement the minimum coherent correction. That pass is complete as Product `.50`. It does **not** authorize automatically starting the remaining `state.enemies` or `state.log` audits, nor opening `0.8.700`.

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
Product:       0.8.600.50
Package:       0.8.600
Account Save:  5
Game State:    10
Data:          37
Benchmark:     3
Codename:      Derived NPC World Projection
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.41.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.50` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current branch and runtime freeze

Normal development branch: `main`.

The `.50` runtime was implemented directly on `main` under the bounded normal-work policy and frozen at:

```text
181bc67b69172390d1a59fa3dfca35980a026b3d
```

Documentation/configuration commits after that SHA are synchronization only and do not create a new runtime checkpoint.

Validation-only draft PR **#374** was created solely to surface the repository's normal pull-request `Check` for the frozen runtime. It was closed **without merge** after validation. The validation refs were then aligned to the runtime SHA; they are validation artifacts, not development authorities.

```text
Head   181bc67b69172390d1a59fa3dfca35980a026b3d
PR     #374 validation-only, closed without merge
Check  32292959171
Node   24.19.0
```

Observed hosted validation:

```text
tests              680
pass               680
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single run:

```text
player profiles  0.372865 ms/op
enemy profiles   0.071050 ms/op
basic attacks    0.003425 ms/op
tick dispatch    0.000818 ms/op
route lookup     0.007469 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.364304 ms/op    3.27%
enemy profiles   0.067755 ms/op   10.57%
basic attacks    0.001213 ms/op  162.66%
tick dispatch    0.000876 ms/op   44.41%
route lookup     0.007423 ms/op    6.50%
```

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

## Product `.50` — Derived NPC World Projection

### Audit conclusion

The dedicated `state.npcs` audit traced the production producers, mutators, and consumers instead of adding a validator by default.

Current ownership is:

```text
createSeedNpcs() / authored seed records
  -> canonical NPC baseline identity, services, starting location

state.party.companions
  -> durable recruited companion membership, location, tactics, resources, statuses

NPC schedule catalog + canonical world time
  -> derived recurring availability

state.relationships
  -> durable named-NPC relationship continuity

state.commitments
  -> durable accepted/resolved/follow-up continuity

state.npcs
  -> runtime projection consumed by location/talk/presentation paths
```

No independent production system was found that owns durable mutable facts solely in `state.npcs`. The meaningful mutations to the array are companion-backing identity/location/active flags, and those values are projections of already-persisted party authority plus companion definitions.

Therefore `state.npcs` is **derived/reconstructible runtime state**, not another persisted world-entity authority.

### Runtime implementation

New module:

```text
js/text/systems/npcWorldProjection.js
```

`refreshNpcWorldProjection(state)`:

1. rebuilds the baseline from `createSeedNpcs()`;
2. reads persisted `state.party.companions` and `activeCompanionIds`;
3. creates a companion backing NPC if the canonical seed list does not already contain one;
4. overlays companion name/title/location and `companionId` / `companionActive` flags from party authority;
5. replaces the runtime `state.npcs` projection deterministically.

`save.js` now omits `state.npcs` from encoded character state. `reviveGameState()` reconstructs it **after** `validateCurrentGameStateStructure()` accepts the raw Game State 10 payload.

`currentGameStateSchema.js` therefore no longer requires `npcs` as a persisted array. `enemies` and `log` remain required arrays pending their own dedicated ownership audits.

### Why this is not a validator

The correct result of the audit was to remove authority, not tighten it.

A broad NPC validator would have created a second durable authority for facts already owned by seed definitions, party, schedules, relationships, and commitments. Game State 10 instead preserves the repository's classification law:

```text
persistent required authority
  -> validate before revival

derived/transient
  -> recompute from authoritative inputs

construction convenience
  -> initialize in factory/new-state/internal paths

optional persisted authority
  -> absence is valid; present stored state must satisfy its domain contract
```

An injected or stale serialized `npcs` value cannot become authoritative: raw Game State 10 does not require it, and revival replaces it with the deterministic projection.

## `.50` focused regression coverage

New test file:

```text
tests/currentSchemaNpcWorldProjection.test.js
```

It proves:

- raw Game State 10 is valid without `state.npcs`;
- `state.enemies` and `state.log` remain required while still awaiting classification;
- canonical seed NPCs rebuild correctly;
- persisted Mara companion participation overlays backing NPC location/identity/active flags;
- save encoding omits `npcs` while preserving party authority;
- load reconstructs the NPC projection from seed + party data;
- a forged injected serialized NPC projection is ignored and replaced.

The normal full hosted suite also proves existing companion travel, recruitment, social schedules, commitments, UI flows, save/load, combat, and long-session behavior remain green under the new projection boundary.

## `.50` version decision

This packet changes the serialized Game State shape, so it is not merely another Game State 9 invariant tightening.

```text
Product             0.8.600.49 -> 0.8.600.50
Game State          9 -> 10
Validation          0.40.0 -> 0.41.0
saveEncoding        0.6.0 -> 0.7.0
npcWorldProjection  new 0.1.0
Account Save        5 unchanged
Package             0.8.600 unchanged
Data                37 unchanged
Benchmark           3 unchanged
```

No Game State 9 → 10 migration was added. That is deliberate under the pre-alpha current-schema-only policy.

Historical schema transitions are now:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers;
- `.50`: Game State 9 → 10 when the reconstructible `state.npcs` runtime projection left serialized authority.

## Current raw Game State 10 boundary

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
- root-owned combat skill gains must synchronize into the active battle player before encounter cache refresh, including after save/load;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Documentation synchronization after `.50` runtime freeze

After runtime freeze at `181bc67b69172390d1a59fa3dfca35980a026b3d`, documentation/configuration was synchronized without changing runtime behavior:

- `PROJECT_PROFILE.yaml` — Game State 10, NPC projection classification/serialization exclusion, remaining audits;
- `docs/ROADMAP.md` — `.50` checkpoint, validation evidence, next decision boundary;
- `docs/ARCHITECTURE.md` — NPC world projection authority and Game State 10 persistence model;
- `docs/QUALITY_GATES.md` — Game State 10 raw/derived boundary and focused regression evidence;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — Game State 9 → 10 schema decision;
- `README.md` — current Phase 0.8/runtime orientation;
- `docs/SYSTEM_CATALOG.md` — current system statuses and maintenance posture;
- this handoff — updated last.

These documentation commits are not new runtime checkpoints and were not independently benchmarked.

## Next bounded work unit — not started

**Highest recommended next maintenance pass: audit `state.enemies` ownership/persistence.**

Do not begin by validating every enemy object. First trace production ownership and classify at least:

```text
authored encounter/enemy definitions
seed construction data
runtime-derived combat/resource caches
mutable world-entity state, if any actually exists
activeBattle combatant authority
spawn/ecology references
```

The key question is whether `state.enemies` is another reconstructible definition/projection array like `state.npcs`, or whether it contains genuine durable mutable world state that needs a dedicated persisted owner. Only the audit should determine whether Game State changes again.

After `state.enemies`, audit `state.log` separately. Current evidence suggests `state.log` is bounded command/presentation history with wall-clock timestamps while `state.events` is the canonical semantic observational history, but that conclusion must be proven by its own bounded producer/consumer audit before changing the save contract.

Do **not** combine enemy and log work into a generic entity packet. Do **not** automatically begin `0.8.700`.

## Session status

```text
Branch:                 main
Runtime freeze:         181bc67b69172390d1a59fa3dfca35980a026b3d
Relevant PR:            #374 validation-only, closed without merge
Hosted Check:           32292959171 success
Tests:                  680/680 passed
Benchmark 3:            success
Benchmark Sample:       success
Known runtime failures: none observed
Known blocker:          none
Next unit:              state.enemies ownership/persistence audit
```
