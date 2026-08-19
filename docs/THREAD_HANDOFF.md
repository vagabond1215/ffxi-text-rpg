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

When elapsed-time enforcement is unavailable, autonomous work is capped at six cycles; **cycle 6 is stabilization/handoff only**. The maintenance train documented here accounts for five runtime cycles (`.44`–`.48`) plus the mandatory sixth documentation cycle, so a fresh user message is required before more implementation.

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
Product:       0.8.600.48
Package:       0.8.600
Account Save:  5
Game State:    9
Data:          37
Benchmark:     3
Codename:      Strict Combat Identity Sequence
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.39.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.48` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current runtime freeze

The latest runtime packet is PR **#372** (`maintenance/strict-combat-identity-sequence`), squash-merged to `main` as:

```text
512f8c3d5edbb22d07d857fa98d6f0755d043d89
```

Exact validated PR head:

```text
8cdc20aecf40201e82cd560eccd19d7f34700798
Check 32287076773
Node 24.19.0
```

Observed exact-head validation:

```text
tests              670
pass               670
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single run:

```text
player profiles  0.268864 ms/op
enemy profiles   0.052262 ms/op
basic attacks    0.003205 ms/op
tick dispatch    0.000825 ms/op
route lookup     0.005607 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.260915 ms/op    6.23%
enemy profiles   0.050549 ms/op    8.78%
basic attacks    0.001223 ms/op  224.79%
tick dispatch    0.000587 ms/op  123.28%
route lookup     0.005258 ms/op    8.89%
```

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

Runtime was frozen after promotion of `512f8c3d5edbb22d07d857fa98d6f0755d043d89`. Cycle-6 commits after that point are documentation/configuration synchronization only and are not new runtime validation checkpoints.

## Persistence hardening train `.44`–`.48`

This continuation began by resynchronizing current `main`. The previous handoff was stale at `.43`, while `.44`–`.46` had already landed. Those three completed runtime packets were counted as cycles 1–3 of the fresh train; `.47` and `.48` were then implemented and validated as cycles 4–5 before this Cycle 6 stabilization pass.

| Revision | Contract | PR | Promoted main | Exact head | Check |
| --- | --- | ---: | --- | --- | ---: |
| `.44` | Strict Player Identity Facts: canonical identity, key items, boolean player flags | #367 | `6ef317c75d5181ddc316caeefe342d14492ab8e2` | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` |
| `.45` | Strict Player Envelope and World Flags: stable player envelope plus boolean world conditions | #368 | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` |
| `.46` | Strict Battle Derived Caches: deterministic encounter combat/stat snapshots validate before revival | #369 | `2e143daf63f8874d6135e61af79ddfcd474fc418` | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` |
| `.47` | Strict Current Location State: canonical place/name/position coherence | #371 | `1c8698147a98e80a0a519aadb520f6808fe61323` | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` |
| `.48` | Strict Combat Identity Sequence: active battle ID agrees with durable encounter allocator | #372 | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` |

Every final head passed hosted Test, Benchmark 3, and Benchmark Sample before promotion. `.47` passed **665/665 tests** after one persistence-specific bounds correction; `.48` passed **670/670 tests** on Node 24.19.0.

### Version decision

Account Save 5, Game State 9, Data 37, and Benchmark 3 remained unchanged throughout `.44`–`.48`. Each packet tightened or classified fields already present in the Game State 9 shape rather than changing serialized shape or meaning.

Historical schema transitions remain:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers.

Under the current pre-alpha policy no automatic migrations were added for those transitions.

## Current raw Game State 9 boundary

`currentGameStateSchema.js` validates decoded state **before reference revival and before runtime `ensure*` normalization**.

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
```

Optional persisted authority:

```text
state.work
player.progression.workProficiencies
state.dayCycle
```

Absence is valid construction state for those optional fields. Once persisted, each must satisfy its domain contract before runtime access.

## Root player and encounter-cache split

Root fields:

```text
player.combat
player.statState
```

are reconstructible caches. They are omitted from encoded character state and rebuilt after the raw Game State 9 payload validates. Mutable `player.resources.hp/mp/tp` remain durable and independent.

Active-battle caches are intentionally different under the current contract. Product `.46` made `activeBattle.combatants[*].combat` and the player combatant's `statState` strict deterministic persisted encounter snapshots. They must match recomputation from the persisted combatant facts. The live `activeBattle.rng` remains transient and non-persisted.

Combat/status reconciliation refreshes battle combatant profiles, synchronizes durable resources/statuses back to the root player, avoids nested status-modifier aliasing, and refreshes root caches.

## Identity, flags, and key items

Products `.44`–`.45` completed the root player identity boundary:

- stable player envelope (`id`/`type`) is strict;
- canonical ancestry/sex/name identity facts must agree with canonical definitions;
- persisted key-item identity is structurally valid and duplicate-free;
- player flags are boolean durable facts;
- top-level world-condition flags are boolean durable facts.

Do not reintroduce generic truthy/falsy persistence for these facts.

## Current location authority

Product `.47` made these one persisted authority:

```text
currentPlaceId
location
position
```

The place ID must be exact canonical identity; `location` must match the canonical place name; `position.placeId` must match the current place.

Topology places require a normalized navigable coordinate, canonical level and facing, and no numeric grid x/y. Grid places require raw stored x/y within the place width/height; if an external coordinate is persisted it must normalize and map exactly to the same x/y, with canonical level/facing metadata.

The first `.47` hosted run exposed a useful implementation mistake: a convenience bounds helper preferred the external coordinate and therefore failed to judge a forged raw `x=999`. The final validator checks stored numeric bounds directly and separately checks external-coordinate mapping. The corrected exact head is the one recorded above and passed 665/665.

## Combat identity authority

Product `.48` makes `combatSequence` the explicit durable encounter-ID allocator.

- no active battle: sequence may be zero or later historical count;
- active battle present: sequence must be positive;
- `activeBattle.id` must exactly equal `battle-${sequence padded to six digits}`.

A persisted low/high forged counter or forged battle ID is rejected before revival. Load does not repair either side. Focused evidence also proves normal next-encounter allocation advances from `battle-000001` to `battle-000002` rather than reusing identity.

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
- player identity/key items/player flags and world flags are strict durable facts;
- current place/name/position is one coherent persisted location authority;
- transport derives carried load and owns fare/cadence/departure/arrival/service limits;
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
- active battle persists with deterministic combat/stat snapshots while live RNG does not;
- combatSequence and activeBattle identity must remain coherent;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Cycle-6 documentation synchronization

After runtime freeze at `512f8c3d5edbb22d07d857fa98d6f0755d043d89`, Cycle 6 changed documentation/configuration only:

- `PROJECT_PROFILE.yaml` — `.48` raw/optional/derived authority map and next classification audits;
- `docs/QUALITY_GATES.md` — current Game State 9 rules and `.48` gate;
- `docs/ARCHITECTURE.md` — identity/flags/location/combat-sequence and encounter-cache authority;
- `docs/ROADMAP.md` — `.44`–`.48` train and next maintenance boundary;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — `.44`–`.48` version rationale and independent-version decisions;
- this handoff **last**.

No runtime validation was rerun after the freeze for these documentation-only commits.

## Next recommended work

**Do not automatically begin `0.8.700`.**

If continuing maintenance, start a fresh bounded train from current `main` and classify the remaining broad persisted arrays separately:

1. **Persisted NPC world-entity boundary**
   - inspect `state.npcs` production readers/writers;
   - distinguish authored/seeded identity, persistent mutable world location/relationship/companion backing facts, and derived/presentation fields;
   - do not require every seeded NPC field merely because it exists at runtime.
2. **Persisted enemy world-entity boundary**
   - inspect `state.enemies` as authored encounter definitions versus mutable runtime entity state;
   - keep derived combat caches separate from stable authored identity/data decisions.
3. **Presentation log boundary**
   - classify `state.log` separately from canonical semantic events;
   - determine whether it is presentation history, durable player-facing history, or compatibility baggage before tightening or de-persisting it;
   - do not make prose history a second semantic-event authority.

Do not combine these into one broad entity validator.

If returning to feature work, agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam remain candidate families, but a new feature track requires explicit authorization.

## Stop condition

This session reached the six-cycle autonomous boundary: five runtime cycles (`.44`–`.48`, with `.44`–`.46` already present when the stale handoff was resynchronized) plus Cycle 6 stabilization/handoff. **A fresh user message is required before more implementation.**
