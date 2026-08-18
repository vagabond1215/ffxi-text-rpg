# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.32
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Optional Work Registry
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.32` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

A revision bump may record a coherent maintenance contract without advancing a feature track. Do not advance `TRACK` merely because maintenance occurred.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 6 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 3 | benchmark workload/measurement comparability contract |

These versions advance independently.

### `.28`–`.32` version decision

Account Save 5, Game State 6, Data 37, and Benchmark 3 remain unchanged throughout `.28`–`.32`.

Those revisions enforce invariants already intended by the current persistence contract:

- `.28` validates already-persisted world time and simulation-control state;
- `.29` validates the already-required character capability registry;
- `.30` validates canonical inventory/container state without changing its shape;
- `.31` validates persisted semantic-event identity/order/sequence without changing bounded-history semantics;
- `.32` classifies `work` as optional persisted authority: absence is still allowed, while a present value must satisfy the existing work-state contract.

No authored-data identity changed and Benchmark 3 protocol did not change. Product revision and `SYSTEM_VERSIONS.validation` advance to record stricter enforcement; schema/data/benchmark versions do not advance merely because invalid current payloads are rejected earlier.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Old pre-alpha local saves/accounts are **not** a supported compatibility surface. Current-format save/load/validation/resume must be deterministic.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 6 and contain the complete required persisted structure before revival/reference relinking.
3. Raw validation runs before runtime `ensure*` helpers may normalize state.
4. Required persisted authority must already satisfy its declared current contract.
5. Optional persisted authority may be absent, but a present value must satisfy its domain contract.
6. Active owner/task links may reference active or just-completed tasks until domain reconciliation; terminal owner records may retain historical `taskId` after release.
7. Incompatible, incomplete, malformed, or legacy-shaped pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
8. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
9. The generic ordered migration utility remains available for a future migration only when compatibility is explicitly required or independently useful.

### Current raw validation

Current Game State 6 raw validation covers:

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
player capability registry
player inventory/container state
optional work registry when present
```

Separate active-owner checks require consistent persisted timed-task links for active travel, projects, work, timed abilities, and resource recovery.

Before adding another validator, classify state as persistent required authority, derived/transient, construction convenience, or optional persisted authority.

The raw boundary deliberately does **not** compose broad `validatePlayer()`, because that mixes persisted checks with post-revival reference identity and derived state. Flat `player.inventory` alias identity remains post-revival. Atlas/POI discovery persistence remains deferred pending a dedicated authority decision and resolution of wall-clock visit timestamp semantics.

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

The old `.message` / `.reason` aliases remain removed. Adapters render `display.text` or consume semantic fields; domain logic must not parse presentation prose.

## Runtime/tooling baseline

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS with `actions/checkout@v7` and `actions/setup-node@v6`, concurrency cancellation, and a bounded job timeout.

Hosted Check runs:

```text
npm test
npm run benchmark
npm run benchmark:sample
```

## Benchmark protocol history

- **Benchmark 1** — historical workloads included setup in several timed loops.
- **Benchmark 2** — introduced at Product `0.8.600.9`; setup moved outside timed attack/tick/route workloads.
- **Benchmark 3 — current** — introduced at Product `0.8.600.12`; each workload receives a separate-context unreported warm-up equal to 10% of measured iterations.

Benchmark 3 is the current comparability baseline. No hard timing threshold is accepted yet.

## Maintenance history

Revisions `.2`–`.22` established current-schema cleanup, canonical command/action contracts, carried inventory authority, Node 24/current Actions, deterministic long-session/benchmark evidence, explicit lifecycle ownership, terminal task release, task-owner guards, strict active travel, task-registry validation, and positive active-task persistence evidence.

Revisions `.23`–`.27` composed raw validators for projects, continuity, resource opportunities, ecology, party, and ability runtime.

### Strict-state train `.28`–`.32`

| Revision | Contract | PR | Exact head | Check | Tests | Promoted main |
| --- | --- | ---: | --- | ---: | ---: | --- |
| `.28` | Strict World Simulation | #351 | `5c1d4108fc8714ea67a5b009ada5cfac43da3e4a` | `32175617550` | 581/581 | `3d1f59b9bfdf03a17e7c96ef00c4eee6bed72087` |
| `.29` | Strict Player Capabilities | #352 | `31e0f665e7d022508e10f1dce0ef18fd1420e739` | `32176059398` | 586/586 | `eac701fb968bb326e768c2c105fe814c84272a10` |
| `.30` | Strict Inventory State | #353 | `229cf4992c61dd1c887b5ec85886443122739dbe` | `32176647509` | 591/591 | `86eb8365fc1b2ff9c2207ce52ffe84321c713f9e` |
| `.31` | Strict Semantic Events | #354 | `f5842eb71eb16861ecb8c0c50b56454396e3f5f4` | `32177641185` | 597/597 | `e947f82f132d0f1fb972688471a23140731ab34c` |
| `.32` | Strict Optional Work Registry | #355 | `458a87b3dbf08f6d6da086cc24bc1da6c539ede4` | `32178015948` | 602/602 | `9423e87b6d681841a7576d938950bfbb631dd257` |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

Latest exact-head runtime evidence from `.32` / Check `32178015948`:

```text
602/602 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run:

```text
player profiles  0.270363 ms/op
enemy profiles   0.053653 ms/op
basic attacks    0.002913 ms/op
tick dispatch    0.000814 ms/op
route lookup     0.005602 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.259028 ms/op   7.25%
enemy profiles   0.051633 ms/op  11.45%
basic attacks    0.001148 ms/op 186.78%
tick dispatch    0.000478 ms/op 133.64%
route lookup     0.005363 ms/op  14.08%
```

Runtime freeze for this train: `9423e87b6d681841a7576d938950bfbb631dd257`.

## Timed-task ownership contract

Direct production task creators remain limited to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases only after its durable exactly-once consequence. There is no production generic/unowned task producer, so there is no accepted blind global task-history prune.

## Release discipline

A coherent runtime checkpoint requires one bounded contract, focused regression coverage, observed full Test and current Benchmark gates, deliberate version decisions, and promotion only after the exact head is green. Freeze runtime before documentation. Documentation-only synchronization after the freeze is not a new runtime validation checkpoint.

## Next Phase 0.8 decision

Do **not** automatically begin `0.8.700`.

For maintenance, the strongest likely next persistence investigations are:

- extract a dedicated raw-safe persisted player progression/stat validator instead of composing broad `validatePlayer()`;
- separately audit atlas/POI discovery authority and wall-clock timestamp semantics before tightening persistence;
- inspect another optional persisted family only where a real save/load normalization gap is demonstrated.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam. Starting a new feature track requires an explicit fresh work order.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance budgets, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
