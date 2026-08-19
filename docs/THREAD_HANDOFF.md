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

## Workflow and autonomous-session rule

Hearth & Horizon is pre-alpha. Old local saves/accounts are not a compatibility requirement unless a future work order explicitly changes that policy.

Runtime first. Freeze runtime before documentation. Update this handoff last. Report only validation that actually ran.

When elapsed-time enforcement is unavailable, autonomous work is capped at six cycles; **cycle 6 is stabilization/handoff only**. The maintenance train documented here used five runtime cycles plus the mandatory sixth documentation cycle, so a fresh user message is required before more implementation.

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

Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments and relationships remain separate authorities. Presentation and declared caches remain derived from canonical state.

## Current baseline

```text
Product:       0.8.600.43
Package:       0.8.600
Account Save:  5
Game State:    9
Data:          37
Benchmark:     3
Codename:      Player Persistence Integration
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.34.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.43` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current runtime freeze

The latest player-persistence train ended with PR **#366** (`maintenance/player-persistence-integration`) and was squash-merged to `main` as:

```text
daa1904c8287c5b16950142cef76edcfdd902d3d
```

Exact validated PR head:

```text
2a10727dfa14734ca9c3031adf4bc368be592063
Check 32276311018
Node 24.19.0
```

Observed exact-head validation:

```text
tests              648
pass               648
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single run:

```text
player profiles  0.314430 ms/op
enemy profiles   0.064417 ms/op
basic attacks    0.003578 ms/op
tick dispatch    0.000743 ms/op
route lookup     0.006808 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.316339 ms/op    4.33%
enemy profiles   0.058325 ms/op    5.66%
basic attacks    0.001355 ms/op  173.80%
tick dispatch    0.000598 ms/op   67.24%
route lookup     0.006198 ms/op    1.95%
```

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

Runtime was frozen after promotion of `daa1904c8287c5b16950142cef76edcfdd902d3d`. Cycle-6 commits after that point are documentation synchronization only and are not new runtime validation checkpoints.

## Player persistence train `.39`–`.43`

| Revision | Contract | PR | Promoted main | Exact head | Check | Tests |
| --- | --- | ---: | --- | --- | ---: | ---: |
| `.39` | Derived Player Cache Contract: omit root combat/stat caches from saves and rebuild after raw validation | #362 | `16ce275995aae56c2d4da36dbce02ccd33647a25` | `a94666003e54dedb96d8d4140b1b1cae04d7fd97` | `32273155030` | 632/632 |
| `.40` | Strict Player Equipment: canonical slot/loadout state validates before revival | #363 | `29d20cf78d1faae2c7ae08899211e439577fa515` | `103b3a363153a30a25549d58063717b5eed666ee` | `32273809797` | 637/637 |
| `.41` | Canonical Player Statuses: nested modifier state and fictional-time status timing become strict | #364 | `9cb2a32cbd3253bed099a8aabb31c68e7f7e252c` | `430dbb78bbbdaea72d2be9d4c1dcb82699c3d90d` | `32274840087` | 641/641 |
| `.42` | Strict Active Battle: ongoing combat snapshots/actions/timeline validate before revival | #365 | `5526eba5fa3728b4212955a307b91b0ee72b4b2c` | `ce680fc35568df1a16a2feed30b1b7130d0b8eb6` | `32275555067` | 646/646 |
| `.43` | Player Persistence Integration: combined round trip plus derived-cache resynchronization | #366 | `daa1904c8287c5b16950142cef76edcfdd902d3d` | `2a10727dfa14734ca9c3031adf4bc368be592063` | `32276311018` | 648/648 |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

### Independent-version decision

Account Save 5, Data 37, and Benchmark 3 remained unchanged throughout `.39`–`.43`.

- `.39` changed serialized player shape by removing root `player.combat` and `player.statState` from save payloads and reconstructing them after raw validation. Therefore **Game State advanced 7 → 8**.
- `.40` enforced the existing equipment/loadout contract without changing serialized meaning.
- `.41` changed valid persisted status semantics from flat/legacy modifier records to canonical nested modifier blocks. Therefore **Game State advanced 8 → 9**.
- `.42` enforced the existing active-battle/Combat 2.0 snapshot contract.
- `.43` repaired derived-cache synchronization and added integrated evidence without changing serialized meaning.

Under the current pre-alpha policy no automatic Game State 7 → 8 or 8 → 9 migrations were added.

## Current raw Game State 9 boundary

`currentGameStateSchema.js` validates decoded state **before reference revival and before runtime `ensure*` normalization**.

Required raw validation covers:

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
atlas discovery
POI discovery
player progression / lifetime training / learned skills
player capability registry
player inventory/container state
player mutable HP/MP/TP
player canonical wallet
player equipment/loadout state
player canonical statuses
active battle when present
```

Active project/work/travel/timed-ability/resource-recovery records also require consistent persisted timed-task links until owner reconciliation.

Optional persisted authority:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

Absence is valid construction state for those fields. Once persisted, each must satisfy its domain contract before runtime access.

## Derived player-cache contract

Game State 8 made these root fields explicitly reconstructible:

```text
player.combat
player.statState
```

They are omitted from the encoded character state by `stripPlayerDerivedStateForPersistence()` and rebuilt by `refreshPlayerDerivedState()` only after the raw Game State 9 payload validates. Mutable `player.resources.hp/mp/tp` remain durable and independent.

`playerPersistenceIntegration.test.js` proves that equipment, statuses, resources, and active battle persist while root combat/stat caches do not. After load, status expiry refreshes each battle combatant's derived profile, durable battle-to-root resource/status synchronization refreshes root player caches, nested status modifier blocks are not aliased between those two authorities, and combat can continue.

Do **not** re-add root combat/stat caches to the serialized required-field list without a new explicit authority decision.

## Canonical player-status contract

Runtime `createStatusEffect()` canonicalizes authored flat modifier keys into nested blocks consumed by `statEngine`:

```text
modifiers.attributes
modifiers.resources
modifiers.derived
modifiers.resistances
```

Persisted Game State 9 must already use that canonical shape. Loading does not normalize a malformed flat status payload. Status identity/category/source, fictional-time duration/expiry, stack ownership, optional tick state, modifier keys, and flags validate before revival.

This train also fixed a concrete behavior defect: flat Stone Ward/Guarded Cut-style defense modifiers previously could persist and expire while not contributing to `calculateCombatProfile()`. Canonical nested modifier state now affects the intended derived stat.

## Equipment and active-battle authority

`player.equipment` is durable physical/loadout authority. All canonical slots exist; occupied slots contain structurally valid equipment compatible with the occupied slot; impossible two-handed/off-hand persistence is rejected. Current discipline eligibility is deliberately not persistence authority.

`activeBattle` is durable ongoing encounter authority when present. Raw validation covers battle identity/phase/round, combatant identity/types/sides/resources/statuses, bounded log, Combat 2.0 action identity/references, timeline actor ownership, and phase/living-side coherence. The live `activeBattle.rng` function is transient and is not serialized.

A future audit may decide whether `activeBattle.combatants[*].combat` should remain a durable encounter snapshot or become explicitly reconstructible cache state. Do not change that classification incidentally.

## State-classification law

Do not mechanically attach runtime validators to save/load.

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

Broad `validatePlayer()` remains unsuitable for the raw boundary because it mixes serialized invariants with post-revival reference identity and derived expectations. Flat `player.inventory` identity remains post-revival.

## Timed-task authority remains unchanged

Direct production `startTimedTask()` ownership is limited by the architecture guard to:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

Each owner owns exactly-once reconciliation and terminal release. `releaseTimedTask` rejects active tasks and does not rewind sequence allocation. Managed repeated lifecycles return the task registry to zero retained records. There is no production generic/unowned task producer and no accepted blind global task prune.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- raw persistence validation before revival/runtime normalization;
- inventory owns container/access/capacity/transfer/carried-item facts;
- equipment is durable loadout authority;
- transport independently derives carried load and owns fare/cadence/departure/arrival/service limits;
- projects own material/labor/completion state;
- work owns durable work records when constructed;
- work proficiency is character-owned mastery and optional persisted authority;
- production owns recipe/work/input/output/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- party owns persistent companion membership/location/tactics;
- commitments remain separate from relationships and Journal projection;
- NPC schedules are recurring availability against canonical fictional time, not a second clock;
- atlas/POI discovery is acquired knowledge and uses canonical fictional visit time;
- semantic events are bounded observational history, not world authority, while persisted ID/order/sequence integrity is strict;
- mutable HP/MP/TP and wallet balances persist;
- root player combat/stat caches are omitted from saves and rebuilt after validation;
- canonical player statuses persist and use nested modifier blocks;
- active battle persists while live RNG does not;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Cycle-6 documentation synchronization

After runtime freeze at `daa1904c8287c5b16950142cef76edcfdd902d3d`, Cycle 6 changed documentation/configuration only:

- `PROJECT_PROFILE.yaml` — Game State 9 raw/optional/derived authority map and next classification audits;
- `docs/QUALITY_GATES.md` — Game State 9 rules and player persistence integration evidence;
- `docs/ARCHITECTURE.md` — Game State 8/9 cache/status contracts, equipment/active-battle authority, `.43` gate;
- `docs/ROADMAP.md` — `.39`–`.43` train and current maintenance boundary;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — Game State 7 → 8 → 9 rationale and independent-version decisions;
- this handoff **last**.

No runtime validation was rerun after the freeze for these documentation-only commits.

## Next recommended work

**Do not automatically begin `0.8.700`.**

If continuing maintenance, start a fresh bounded train from current `main` and keep the next decisions separate:

1. **Root player identity/key-item/flag boundary**
   - inspect production ownership and mutation of `player.identity`, `player.keyItems`, and `player.flags`;
   - classify exact durable invariants before composing any raw validator;
   - add non-trivial save/load and malformed/no-repair evidence only for true authority.
2. **Active-battle combat snapshot audit**
   - separately inspect `activeBattle.combatants[*].combat` readers and mutation/reconstruction behavior;
   - decide whether it remains a durable encounter snapshot or becomes reconstructible cache state;
   - do not combine that decision mechanically with root-player validation.

If returning to feature work, agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam remain candidate families, but a new feature track requires explicit authorization.

## Stop condition

This session reached the six-cycle autonomous boundary: five runtime cycles plus Cycle 6 stabilization/handoff. **A fresh user message is required before more implementation.**
