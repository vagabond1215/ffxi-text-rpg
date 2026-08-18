# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

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
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 — Life and infrastructure expansion is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `0.8.600.2` through `.7` are maintenance/hardening revisions and do not open `0.8.700`.**

## Product laws

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

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Projects, inventory, transport, production, commitments, relationships, party state, recovery, NPC schedules, and fictional time remain canonical authorities. Journal/service/information/home/social presentation remains derived. Legacy FFXI-derived material is research/reference material only, not canonical runtime identity.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics | **Complete** |
| `0.7` | Multi-region playable alpha | **Complete** |
| `0.8` | Life and infrastructure expansion | **In progress** |
| `0.9` | Adventure depth and release hardening | Planned |
| `1.0` | Live foundation | Planned |

## Phase 0.7 — complete

The multi-region playable-alpha proof covers Thornwall/Elderwood, Brasshaven/Redstone Reach, and Mistmere/Starfen; persistent community continuity; livelihood/production/mastery; danger/combat/recovery; acquired-knowledge readability; semantic transport and settlement services; persistent companion preparation; and deterministic save/load.

Historical final Phase 0.7 checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
Benchmark 1 success
Product 0.7.400.1
Data 31
```

Later shared-authority work does not reopen Phase 0.7.

# Phase 0.8 — Life and infrastructure expansion — in progress

| Track | Gate | Status |
| --- | --- | --- |
| `0.8.100` | Home foothold: Storage Chest converts regional materials + project labor into durable storage | **Complete** |
| `0.8.200` | Home workshop: Joiner's Workbench grants locality-bound production capability | **Complete** |
| `0.8.300` | Carried-load transport: service capacity derives from actual carried inventory | **Complete** |
| `0.8.400` | Portable logistics: earned Field Satchel expands field organization without creating free cargo | **Complete** |
| `0.8.500` | Daily social availability: Sera Talwin follows authored fictional-time availability | **Complete** |
| `0.8.600` | Companion convalescence: safe-settlement recovery closes the downed inactive-companion dead end | **Complete** |

### Historical track checkpoints

```text
0.8.100  0b9251a43285443087050127da36b977cabdf7ee
0.8.200  03ab71c7e96c54eaeffb75598ed01243fd390f21
0.8.300  4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
0.8.400  d1a43568c5ca4dd7e57fb86316b422c35025ce07
0.8.500  fde1d30d76264ea25af6bad4d829545c488eec9b
0.8.600  04211e8909996b1ac34fa91ae1cdd7aa216b86f8
```

`0.8.600.1` closed Companion Convalescence at 511/511 tests and Benchmark 1 success. Settlement recovery can heal a nearby inactive recruited companion without silently changing party membership, and a downed companion cannot be abandoned in unsafe wilderness.

## `0.8.600.2`–`.7` — maintenance and consolidation train

The maintenance train cleaned the current foundation before another feature track:

| Revision | Maintenance gate | Promoted main commit |
| --- | --- | --- |
| `.2` | Current-schema cleanup: Hearth & Horizon persistence/home identifiers, obsolete migration removal, theme/transport cleanup | `bc42c7a00050f73704f19f2c3287d1426a788fa1` |
| `.3` | Canonical command contract: remove FFXI runtime macro adapter/aliases and ambiguous version aliases | `c1fbfbe2629aee628cba4e60af3bed37bef86f7a` |
| `.4` | Strict current schema: reject incomplete Game State 6 payloads before revival | `ba3f38f05c83175f188b0231c175a89c9310309f` |
| `.5` | Carried commitment delivery: commitment requirements/removal share canonical carried-container authority | `0b62b13b25297acad853c2b17be8ffb86a63419f` |
| `.6` | Canonical ActionResult contract: remove `.message`/`.reason` compatibility aliases | `268e17f4c5d8de08d1ea2fc68f6017371df4627a` |
| `.7` | Runtime/architecture guardrails: Node 24 LTS CI, current GitHub Actions, executable compatibility-debt guards | `f56b2f6f50d481f46babf80b47e13c70672d9176` |

Latest exact-head validation for `.7` was PR #330 / Check `32110997315` on Node 24.19.0:

```text
tests       517
pass        517
fail        0
skipped     0
Benchmark   success
```

Benchmark 1 on that gate:

```text
player combat profiles  0.410749 ms/op
enemy combat profiles   0.077986 ms/op
basic attacks            0.450466 ms/op
tick dispatch            0.005553 ms/op
direct route lookup      0.634726 ms/op
```

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.** The maintenance train is complete through `.7`, but the next feature track still requires a fresh bounded seam audit.

Strong candidate families remain:

- agriculture/stewardship;
- earned automation that reduces established chore attention through investment/mastery;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another life/logistics segment only when a specific current gap warrants it.

A separate hardening candidate is long-session/performance evidence: repeatable benchmark sampling plus deterministic multi-day lifecycle/save-load smoke coverage. Treat that as a bounded maintenance work order rather than silently folding it into a feature track.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability evidence, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
