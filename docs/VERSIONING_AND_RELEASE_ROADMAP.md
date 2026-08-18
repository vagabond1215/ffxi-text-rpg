# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.7
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     1
Codename:      Runtime Architecture Guardrails
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `.2` through `.7` are maintenance/hardening revisions over the closed `0.8.600` track, not new Phase 0.8 feature tracks.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

A revision bump may record a coherent maintenance contract without advancing a feature track. Do not advance `TRACK` merely because maintenance work occurred.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 6 | serialized character/world runtime contract |
| Data | 37 | canonical authored-data and stable-identifier contract |
| Benchmark | 1 | benchmark workload/comparability contract |

These versions advance independently:

- **Account Save** changes when account/session registry semantics change materially.
- **Game State** changes when persisted runtime structure or meaning changes materially.
- **Data** changes when canonical authored-data shape, authority, content, or stable identifiers change materially.
- **Benchmark** changes only when the benchmark workload/protocol stops being comparable.

Recent Data history:

- Data 31 — companion field approach + character-facing place/POI cleanup;
- Data 32 — first home-infrastructure Storage Chest definition;
- Data 33 — original character names, starter kits, origin openings;
- Data 34 — Joiner's Workbench + infrastructure construction sinks;
- Data 35 — Field Satchel + hide-binding construction sink;
- Data 36 — recurring NPC availability schedule data;
- Data 37 — canonical home furnishing/container identifiers replacing inherited `mog*` identifiers.

## Current compatibility policy

Mode: `pre-release-current-schema`.

Old pre-alpha local saves/accounts are **not** a supported compatibility surface. Current-format save/load/validation/resume must be deterministic.

Current rules:

1. Account/session payloads must match Account Save 5 exactly.
2. Character payloads must match Game State 6 and contain the complete required persisted structure before revival/reference relinking.
3. Incompatible or incomplete pre-alpha payloads are rejected rather than lazily reconstructed or automatically migrated.
4. Do not add duplicate fields, compatibility aliases, fallback storage keys, or adapter layers by reflex.
5. The generic ordered migration utility remains available for a future migration only when compatibility is explicitly required or independently useful.

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

The old non-enumerable `.message` / `.reason` aliases are removed. Adapters render `display.text` or consume semantic fields; domain logic must not parse presentation prose.

## Runtime/tooling baseline

`package.json` requires Node `>=24`. Hosted Check uses Node 24 LTS with `actions/checkout@v7` and `actions/setup-node@v6`, plus concurrency cancellation and a 15-minute job timeout.

`tests/architectureDebtGuard.test.js` guards selected removed compatibility surfaces from returning to canonical runtime code.

## `0.8.600` feature-track history

| Track | Result |
| --- | --- |
| `0.8.100` | Storage Chest home foothold |
| `0.8.200` | Joiner's Workbench home workshop |
| `0.8.300` | canonical carried-load transport |
| `0.8.400` | earned Field Satchel portable logistics |
| `0.8.500` | daily fictional-time NPC availability |
| `0.8.600` | companion convalescence and safe reunion |

Historical `0.8.600.1` checkpoint:

```text
04211e8909996b1ac34fa91ae1cdd7aa216b86f8
511/511 tests
Benchmark 1 success
Account Save 4
Game State 5
Data 36
```

## `0.8.600.2`–`.7` maintenance history

| Revision | Contract | Schema/data decision |
| --- | --- | --- |
| `.2` Current Schema Cleanup | Hearth & Horizon persistence/home identifiers; obsolete migration/theme/transport cleanup | Account `4->5`, Game `5->6`, Data `36->37` |
| `.3` Canonical Command Contract | remove FFXI runtime macro adapter/aliases; remove `VERSION.app`/`VERSION.save` | unchanged |
| `.4` Strict Current Schema | reject incomplete Game State 6 before revival; malformed current state cannot save | unchanged |
| `.5` Carried Commitment Delivery | one carried-container fact for logistics + commitment delivery; atomic cross-container removal | unchanged |
| `.6` Canonical Action Results | remove ActionResult `.message`/`.reason` compatibility aliases | unchanged |
| `.7` Runtime Architecture Guardrails | Node 24 LTS + current Actions + executable debt guards | unchanged |

Promoted commits:

```text
.2  bc42c7a00050f73704f19f2c3287d1426a788fa1
.3  c1fbfbe2629aee628cba4e60af3bed37bef86f7a
.4  ba3f38f05c83175f188b0231c175a89c9310309f
.5  0b62b13b25297acad853c2b17be8ffb86a63419f
.6  268e17f4c5d8de08d1ea2fc68f6017371df4627a
.7  f56b2f6f50d481f46babf80b47e13c70672d9176
```

Latest exact-head validation: PR #330 / Check `32110997315`, Node 24.19.0:

```text
tests      517
pass       517
fail       0
skipped    0
Benchmark  success
```

Benchmark 1 remains comparable; the workload did not change.

## Release discipline

A coherent checkpoint requires:

- one bounded implementation or maintenance contract;
- focused regression coverage;
- observed full Test and Benchmark gates for runtime changes;
- deliberate Product/Account/Game/Data/Benchmark decisions;
- synchronized authority docs;
- a stop at the declared boundary.

Do not claim validation that did not run. Documentation-only synchronization after a green frozen runtime does not require inventing a new runtime gate.

## Next Phase 0.8 decision

Do **not** automatically begin `0.8.700`. A new work order should re-audit one bounded seam before implementation.

Candidate feature families remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics seam.

A separate maintenance candidate is long-session/performance hardening: repeatable benchmark sampling and deterministic multi-day lifecycle/save-load smoke coverage.

## Later phases

### 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability evidence, performance, and release tooling.

### 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, and supported by enough interconnected content for sustained play.
