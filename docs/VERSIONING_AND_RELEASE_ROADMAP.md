# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/THREAD_HANDOFF.md`, `docs/EXECUTION_PIPELINE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, and `docs/ROADMAP.md`.

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
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Feature tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.52` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

The C0 continuation/content-census pass is tooling and documentation, not a gameplay Product track. It therefore leaves Product, Package, Account Save, Game State, Data, and Benchmark versions unchanged.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. A revision bump may record a coherent maintenance contract without advancing a feature track.

A feature-track number such as `0.8.700` is opened only when implementation for that bounded player-facing track actually begins. Planning or selecting the track does not by itself advance runtime version metadata.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 12 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | benchmark workload/measurement comparability contract |

These versions advance independently.

### Persistence-version history

- `.34` changed atlas timing from wall-clock `visitedAt` to canonical fictional `visitedAtWorldSeconds`: **Game State 6 → 7**.
- `.39` removed root `player.combat` and `player.statState` from serialized authority: **Game State 7 → 8**.
- `.41` changed persisted player-status modifiers to canonical nested modifier blocks: **Game State 8 → 9**.
- `.50` removed reconstructible `state.npcs` runtime projection from serialized authority: **Game State 9 → 10**.
- `.51` removed reconstructible `state.enemies` encounter-template projection from serialized authority: **Game State 10 → 11**.
- `.52` removed top-level session command presentation history from serialized authority: **Game State 11 → 12**.

Under the current pre-alpha policy there are no automatic migrations between those Game State versions.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 12 and contain complete required persisted authority before revival/reference relinking.
3. Raw validation runs before runtime `ensure*` helpers, derived projection reconstruction, or session-presentation initialization may normalize state.
4. Required persisted authority must already satisfy its declared current contract.
5. Optional persisted authority may be absent, but a present value must satisfy its domain contract.
6. Active owner/task links may reference active or just-completed tasks until domain reconciliation.
7. Incompatible, incomplete, malformed, or legacy-shaped pre-alpha payloads are rejected rather than automatically migrated.
8. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
9. The generic ordered migration utility remains available only for a future deliberate migration.
10. Persisted gameplay time uses canonical fictional time; wall-clock timestamps are not a substitute for simulation time.
11. Root player combat/stat caches are omitted from saves and rebuilt only after current raw state validates.
12. Active-battle deterministic combat/stat snapshots are persisted and validated; live battle RNG is transient.
13. Current place ID, display location, and position must form one canonical persisted location state.
14. `combatSequence` is the encounter-ID allocator and must agree with `activeBattle.id` when a battle exists.
15. The persisted battle player must match the root player ID while an encounter is active; terminal battle snapshots remain historical.
16. Root-owned combat skill gains during an active encounter must be synchronized into the battle-player snapshot before encounter cache refresh.
17. `state.npcs` is not serialized authority; it is rebuilt from canonical seed NPC definitions plus persisted party companion authority.
18. `state.enemies` is not serialized authority; it is rebuilt from canonical seed enemy definitions and mutable ongoing enemy state belongs to `activeBattle`.
19. Top-level `state.log` is not serialized authority. It is current-session command presentation history, omitted from saves and reset on character load. `state.events` remains the persisted structured semantic observation channel.
20. `activeBattle.log` remains separate persisted encounter-local history; Canvas command-history/output buffers remain separate transient UI state.

Supported-save migrations remain deliberately deferred to the Phase 0.9 release transition unless a future explicit work order changes that policy.

### Current raw validation

Current Game State 12 raw validation covers:

```text
world time / simulation control / timed tasks
active Travel State 2 and owner/task links
projects / commitments / relationships
resource opportunities / ecology
party / ability runtime
semantic events
atlas and POI discovery
player envelope / identity / key items / flags
player progression / training / skills / capabilities
player inventory / mutable resources / wallet
equipment / canonical statuses
top-level world flags
current location/position coherence
combat identity sequence
active battle and deterministic encounter combat/stat snapshots
active battle player / root player live-authority coherence
```

Optional persisted authority validates when present:

```text
work registry
player work proficiencies
day-cycle history
```

Derived/transient or post-validation state includes `state.npcs`, `state.enemies`, top-level `state.log`, root `player.combat`, root `player.statState`, flat inventory alias identity, and `activeBattle.rng`.

## Current ActionResult contract

Canonical semantic results expose:

```text
ok
action
code
outcome
data
display
```

The old `.message` / `.reason` aliases remain removed. Domain logic must not parse presentation prose.

## Runtime/tooling baseline

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS with `actions/checkout@v7` and `actions/setup-node@v6`.

Hosted Check runs:

```text
npm test
npm run benchmark
npm run benchmark:sample
```

Developer progression tooling additionally provides:

```text
npm run census
```

The content census is informational/criteria-tracking; future breadth targets do not fail CI merely because they are unfinished.

## Benchmark protocol history

- **Benchmark 1** — historical workloads included setup in several timed loops.
- **Benchmark 2** — Product `0.8.600.9`; setup moved outside timed attack/tick/route workloads.
- **Benchmark 3 — current** — Product `0.8.600.12`; each workload receives a separate-context unreported warm-up equal to 10% of measured iterations.

Benchmark 3 is the current comparability baseline. No hard timing threshold is accepted yet.

## Maintenance line `.44`–`.52`

| Revision | Contract | Validation PR | Exact validated head | Check |
| --- | --- | ---: | --- | ---: |
| `.44` | Strict Player Identity Facts | #367 | `ec77c85573dacfe9c8148c8d602b565288f356fa` | `32279241023` |
| `.45` | Strict Player Envelope and World Flags | #368 | `b65d80707073db0a1f5ebe1941c9b48c8c34fd67` | `32280196036` |
| `.46` | Strict Battle Derived Caches | #369 | `a8eec6ef34ff96ed53bc37ee14aab6280d36a93e` | `32281825598` |
| `.47` | Strict Current Location State | #371 | `9a59dc8cd67f136dd857e04277522f5074ea32d3` | `32286661683` |
| `.48` | Strict Combat Identity Sequence | #372 | `8cdc20aecf40201e82cd560eccd19d7f34700798` | `32287076773` |
| `.49` | Strict Active Battle Player Link | #373 | `49df1a5379da51e15cfb3ce0320008047a70c768` | `32290206583` |
| `.50` | Derived NPC World Projection | #374 | `181bc67b69172390d1a59fa3dfca35980a026b3d` | `32292959171` |
| `.51` | Derived Enemy Encounter Projection | #375 | `5a97a109d9476438d001ee75b8e20293f57360dd` | `32297557960` |
| `.52` | Transient Command Presentation Log | #376 | `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691` | `32301160532` |

The broad-array ownership sequence is complete. Do not extend it mechanically.

## Continuation/content-census checkpoint

C0 exact implementation/tooling head:

```text
b0c1e067a1907a8587a08a128126f9207c6d6134
PR #377 validation-only, closed without merge
Check 32308719621
Node 24.19.0
692/692 tests
Benchmark 3 success
Benchmark Sample success
```

C0 adds `docs/EXECUTION_PIPELINE.md`, a criteria-driven content-scale gate, `npm run census`, and focused tests. Because it does not change gameplay semantics, serialized state, authored-data meaning, or benchmark protocol, Product remains `0.8.600.52`, Game State remains 12, Data remains 37, and Benchmark remains 3.

## Release discipline

A coherent implementation checkpoint requires one bounded contract, focused regression coverage, observed full Test and current Benchmark gates when material, deliberate version decisions, and an exact frozen implementation SHA before documentation synchronization. `docs/THREAD_HANDOFF.md` is updated last.

Content-heavy work should also record census evidence when the command actually ran. Numeric scale is not a substitute for content quality or integration.

## Next Phase 0.8 decision — selected

The fresh August 19, 2026 repository audit and C0 continuation pass have now selected the next bounded feature family:

### `0.8.700` — Cultivation & Stewardship

Status: **READY NEXT; not yet opened in runtime version metadata.**

The first pass should prove a multi-day cultivation loop that composes existing canonical world time, inventory/provenance, home/infrastructure, work mastery, production/economy, and semantic browser actions. It must avoid a parallel growth clock, passive real-time authority, and a new per-crop timed-task owner by reflex.

Once implementation begins, use the normal feature-track version protocol and make explicit Product/Data/Game State decisions from the actual changed contracts.

Following planned Phase 0.8 units are:

```text
0.8.800 Earned Routine Delegation
0.8.900 Household & Community Continuity
Phase 0.8 exit audit
```

Those later units are queued, not automatically authorized by starting `0.8.700`.

## Phase 0.9 planning envelope

Phase 0.9 shifts emphasis toward connected authored scale and deeper adventure/release evidence:

```text
0.9.100 content-scale gate A
0.9.200 deeper adventure vertical slices
0.9.300 advanced combat/training
0.9.400 economy/production depth
0.9.500 quest/social depth
0.9.600 playable-alpha content-scale push
0.9.700 browser E2E/accessibility hardening
0.9.800 supported persistence + protected-main transition
0.9.900 release-candidate soak/performance/release hardening
```

See `docs/EXECUTION_PIPELINE.md` for statuses, deferred work, and planning windows.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, usable through ordinary browser play, and supported by enough interconnected content for sustained play. Q4 2028 is an aggressive planning target for a candidate, not a commitment; do not lock the date before the `0.9.600` content-scale push demonstrates sustainable authoring throughput.
