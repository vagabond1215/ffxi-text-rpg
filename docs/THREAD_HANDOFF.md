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

The previous `.44`–`.48` train had already reached its autonomous-session stop and required fresh input. The user then explicitly asked to continue. That fresh work order authorized the one unfinished active-battle/root-player integrity unit completed here as Product `.49`. It does **not** authorize automatically starting the next NPC/enemy/log audit or a new feature track.

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
Product:       0.8.600.49
Package:       0.8.600
Account Save:  5
Game State:    9
Data:          37
Benchmark:     3
Codename:      Strict Active Battle Player Link
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
Validation:    0.40.0
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.49` are maintenance/hardening revisions over the closed `0.8.600` track and **do not open `0.8.700`**.

## Current runtime freeze

The `.49` runtime was implemented directly on `main` under the bounded normal-work policy and frozen at:

```text
49df1a5379da51e15cfb3ce0320008047a70c768
```

Exact validation was observed through validation-only draft PR **#373** whose head ref pointed at that exact frozen runtime SHA:

```text
Head   49df1a5379da51e15cfb3ce0320008047a70c768
Check  32290206583
Node   24.19.0
```

Observed exact-head validation:

```text
tests              676
pass               676
fail               0
cancelled          0
skipped            0
Benchmark 3        success
Benchmark Sample   success
```

Benchmark 3 single run:

```text
player profiles  0.382805 ms/op
enemy profiles   0.069545 ms/op
basic attacks    0.003288 ms/op
tick dispatch    0.000952 ms/op
route lookup     0.007661 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.362564 ms/op    6.88%
enemy profiles   0.068110 ms/op    8.11%
basic attacks    0.001199 ms/op  209.52%
tick dispatch    0.000681 ms/op   57.21%
route lookup     0.007336 ms/op    3.69%
```

No hard performance threshold is accepted. Benchmark 1/2 are not directly comparable to Benchmark 3.

### Why PR #373 was validation-only

The available GitHub connector exposes pull-request-triggered workflow runs but did not expose the direct `push` run by commit in the needed way. Two isolated validation refs were therefore used solely to surface the repository's standard pull-request Check against the exact direct-main runtime SHA:

```text
validation/strict-active-battle-player-link-base
validation/strict-active-battle-player-link-head
```

The final validation head was exactly `49df1a5379da51e15cfb3ce0320008047a70c768`. PR #373 was closed **without merge** after Check `32290206583` passed. Both validation refs were aligned to that runtime SHA afterward. They are validation artifacts, not development authorities.

### Superseded stale PR #370

An earlier branch/PR #370 (`maintenance/active-battle-player-link`) had been opened against the older `.46` base while `.47` and `.48` landed separately on `main`. It was closed as superseded and must **not** be merged. The valid defect it exposed was re-audited and reimplemented cleanly on current `.48` main as the `.49` packet documented here.

## Persistence hardening line `.44`–`.49`

| Revision | Contract | Validation PR | Runtime/main checkpoint | Exact validated head | Check |
| --- | --- | ---: | --- | --- | ---: |
| `.44` | Strict Player Identity Facts: canonical identity, key items, boolean player flags | #367 | `6ef317c75d5181ddc316caeefe342d14492ab8e2` | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` |
| `.45` | Strict Player Envelope and World Flags: stable player envelope plus boolean world conditions | #368 | `c02c8ec72f5e78c93b27ae2fed9f3ff233114c9b` | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` |
| `.46` | Strict Battle Derived Caches: deterministic encounter combat/stat snapshots validate before revival | #369 | `2e143daf63f8874d6135e61af79ddfcd474fc418` | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` |
| `.47` | Strict Current Location State: canonical place/name/position coherence | #371 | `1c8698147a98e80a0a519aadb520f6808fe61323` | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` |
| `.48` | Strict Combat Identity Sequence: active battle ID agrees with durable encounter allocator | #372 | `512f8c3d5edbb22d07d857fa98d6f0755d043d89` | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` |
| `.49` | Strict Active Battle Player Link: live root/battle authority plus post-load combat-skill synchronization | #373 validation-only | `49df1a5379da51e15cfb3ce0320008047a70c768` | `49df1a5379da51e15cfb3ce0320008047a70c768` | `32290206583` |

Every final validated head passed hosted Test, Benchmark 3, and Benchmark Sample. `.47` passed **665/665 tests**, `.48` passed **670/670**, and `.49` passed **676/676** on Node 24.19.0.

### `.49` version decision

Account Save 5, Game State 9, Data 37, and Benchmark 3 remain unchanged.

`.49` did not change the serialized shape or redefine a stored field. It tightened coherence among already-persisted Game State 9 authorities and repaired runtime synchronization after save/load. Therefore:

```text
Product                    0.8.600.48 -> 0.8.600.49
Validation                 0.39.0 -> 0.40.0
combatIdentityPersistence  0.1.0 -> 0.2.0
combatActions              0.8.0 -> 0.8.1
Account Save               5 unchanged
Game State                 9 unchanged
Data                       37 unchanged
Benchmark                  3 unchanged
```

Historical schema transitions remain:

- `.34`: Game State 6 → 7 for canonical fictional-time discovery timestamps;
- `.39`: Game State 7 → 8 when root player combat/stat caches left serialized authority;
- `.41`: Game State 8 → 9 for canonical nested persisted status modifiers.

Under the current pre-alpha policy no automatic migrations were added for those transitions.

## `.49` active-battle/root-player contract

### Problem discovered

Immediately after encounter construction, the root player and battle-player snapshot may share nested objects in memory. JSON save/load does not preserve that nested object identity. After reload, `state.player.progression` and the active battle player's `progression` are separate objects.

A player combat action can award a root-owned learned skill. Learned skills feed `calculateCombatProfile()`, including attack/accuracy and other derived combat values. Before `.49`, the post-load root skill could advance without the battle-player skill map advancing before the encounter combat cache was recalculated. The persisted battle could therefore become mechanically stale relative to the live root character.

### Runtime repair

`combatActionEngine.js` now treats a successful root combat skill gain as an explicit synchronization seam:

1. root progression remains the owner of the learned skill;
2. the updated root `progression.skills` map is copied into the active battle player;
3. normal combat finalization recalculates the encounter combat cache;
4. root/battle mutable resource and status synchronization continues through the existing combat finalization path.

This is not a load-time migration or repair. It is normal active-combat synchronization after a legitimate gameplay mutation.

### Raw persistence enforcement

`combatIdentityPersistence.js` is now version 2 and still owns `combatSequence`/`activeBattle.id` coherence. It also receives the full state and enforces:

- if a battle player is present, its stable player ID must match the durable root player ID;
- while `activeBattle.phase === 'active'`, battle-player resources must match root resources;
- while active, battle-player statuses must match root statuses;
- while active, the persisted battle-player combat profile must equal deterministic recomputation from root combat-driving authority with root derived caches discarded/rebuilt;
- a malformed split is rejected before revival and is not normalized into agreement.

A terminal battle is deliberately historical. Once victory/defeat has ended the live encounter, later root progression, recovery, equipment, or resource changes may diverge without rewriting the terminal snapshot. The stable battle/root player ID binding remains meaningful, but live-value equality is active-phase authority only.

## Validation correction during `.49`

The first exact-head validation attempt had one failing focused test: **675/676 passed**. The failure did not expose a runtime defect; the test fixture used an unarmed player and therefore did not guarantee a trainable combat skill gain.

The test was corrected to equip the canonical Bronze Sword before encounter/save. The final regression proves all of the following on the real account save/load path:

- root and battle progression objects are distinct after JSON revival;
- root sword skill begins absent;
- the next attack deterministically gains sword skill 1;
- the active battle-player skill map is synchronized to the root map;
- the full raw current-state validator is green afterward.

No production runtime code changed after that fixture correction. Final runtime freeze and validation are the `49df1a...` evidence above.

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
active battle player / root player live-authority coherence while active
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

Product `.49` adds the active-phase cross-link to root player authority and the explicit post-load learned-skill synchronization described above. Do not weaken the distinction by either making root caches persisted authority or treating terminal encounter snapshots as live character state.

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
- an active battle player must remain bound to root player ID/resources/statuses/combat-driving profile;
- terminal battle snapshots are historical rather than live-character mirrors;
- root-owned combat skill gains must synchronize into the active battle player before encounter cache refresh, including after save/load;
- canonical ActionResult logic uses structured fields rather than prose parsing;
- Benchmark protocol changes require a Benchmark version bump when comparability changes;
- legacy FFXI-derived records remain bounded research/reference material.

## Documentation synchronization after `.49` runtime freeze

After runtime freeze at `49df1a5379da51e15cfb3ce0320008047a70c768`, only documentation/configuration was changed:

- `PROJECT_PROFILE.yaml` — active-battle/root-player raw authority and post-load skill-sync constraints, commit `5fc7e8a77854c9bf5f147b3c1d4dcbf69edd95d6`;
- `docs/QUALITY_GATES.md` — `.49` persistence/validation rules and exact gate, commit `2fcd81b11a0d6dd1616fc7f47dabc5b40151b55e`;
- `docs/ARCHITECTURE.md` — live active-battle player authority, terminal-history distinction, and synchronization path, commit `d4e7ae89d919fff36455c740a169c42a41cf3882`;
- `docs/ROADMAP.md` — `.49` checkpoint, version decision, and next maintenance boundary, commit `d6a2869d410ab835a9e454a2c16e2bec8102e8ef`;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — `.49` independent-version rationale and exact evidence, commit `6c8a2428e2b0074cfba30c3e7032d088945e9e0e`;
- this handoff **last**.

No runtime validation was rerun after the freeze for those documentation-only commits.

## Next recommended work

**Do not automatically begin `0.8.700`.**

If the user explicitly asks to continue maintenance again, start from current `main`, reread this handoff, and choose **one** of the remaining broad persisted-array classification seams. Do not combine them:

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

If returning to feature work, agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam remain candidate families, but a new feature track requires explicit authorization.

## Stop condition

The bounded `.49` work order authorized by the user's fresh continuation message is complete: runtime is frozen and validated, documentation is synchronized, and this handoff was written last. **Do not automatically start the next maintenance unit without another user request.**