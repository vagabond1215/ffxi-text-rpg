# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.17
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Bounded Task Retention
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 — Life and infrastructure expansion is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `0.8.600.2` through `.17` are maintenance/hardening revisions and do not open `0.8.700`.**

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

Historical track checkpoints:

```text
0.8.100  0b9251a43285443087050127da36b977cabdf7ee
0.8.200  03ab71c7e96c54eaeffb75598ed01243fd390f21
0.8.300  4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
0.8.400  d1a43568c5ca4dd7e57fb86316b422c35025ce07
0.8.500  fde1d30d76264ea25af6bad4d829545c488eec9b
0.8.600  04211e8909996b1ac34fa91ae1cdd7aa216b86f8
```

`0.8.600.1` closed Companion Convalescence at 511/511 tests and Benchmark 1 success. Settlement recovery can heal a nearby inactive recruited companion without silently changing party membership, and a downed companion cannot be abandoned in unsafe wilderness.

## `0.8.600.2`–`.17` — maintenance and hardening

The maintenance revisions consolidate the current foundation before another feature track:

| Revision | Maintenance gate | Promoted main commit |
| --- | --- | --- |
| `.2` | Current-schema cleanup: Hearth & Horizon persistence/home identifiers, obsolete migration removal, theme/transport cleanup | `bc42c7a00050f73704f19f2c3287d1426a788fa1` |
| `.3` | Canonical command contract: remove FFXI runtime macro adapter/aliases and ambiguous version aliases | `c1fbfbe2629aee628cba4e60af3bed37bef86f7a` |
| `.4` | Strict current schema: reject incomplete Game State 6 payloads before revival | `ba3f38f05c83175f188b0231c175a89c9310309f` |
| `.5` | Carried commitment delivery: commitment requirements/removal share canonical carried-container authority | `0b62b13b25297acad853c2b17be8ffb86a63419f` |
| `.6` | Canonical ActionResult contract: remove `.message`/`.reason` compatibility aliases | `268e17f4c5d8de08d1ea2fc68f6017371df4627a` |
| `.7` | Runtime/architecture guardrails: Node 24 LTS CI, current GitHub Actions, executable compatibility-debt guards | `f56b2f6f50d481f46babf80b47e13c70672d9176` |
| `.8` | Long-session evidence: deterministic 130-day save/load smoke + repeated benchmark sampling | `8fad34adb0d7db253a6593e7ffbeab3f28c28293` |
| `.9` | Benchmark Protocol V2: setup removed from timed attack/tick/route workloads; Benchmark `1 -> 2` | `7f562e20b335c4fdb449f74a8fd2a48c6378e182` |
| `.10` | Subscription ownership: stale tick disposer cannot remove replacement owner | `cc75d707f3a6ca492a6de6883c7ac59b871836c8` |
| `.11` | DOM root ownership: remount/unmount explicitly dispose active app resources and onboarding observer | `b9d1be0d72cb1bb27d414349bc894726deb6ace3` |
| `.12` | Warm Benchmark Baseline: separate-context 10% warm-up before measurement; Benchmark `2 -> 3` | `3de675d60ba46852f193b5cd319df2ce056aa00f` |
| `.13` | Owner-gated task release: terminal-only release API + campaign-recovery save/load/exactly-once proof | `be8db394e81da0e2aa96069efb7df51cd0b68b9b` |
| `.14` | Work/project task release: durable completion/failure/storage/cancel transitions release terminal task records | `f7d51365f13fa1cb703383ec4799934e07a3f90f` |
| `.15` | Transport task release: arrival/cancellation releases terminal task after location/event state is durable | `588d6dd0e0a882a6cfdc76d60797c0488330141d` |
| `.16` | Ability/resource task release: resolution/interruption/recovery/storage outcomes release terminal tasks after durable consequences | `67ec4ea8ae19b1032894a604ed372802d794cf92` |
| `.17` | Bounded task retention soak: repeated mixed owner-managed lifecycles return to one intentional generic-terminal baseline across real save/load | `e4ebdbc14776329156f2df2dee8c598e3b8b91cb` |

Latest exact-head runtime validation was PR #340 / head `666d2f432c3db097012ef035d2e4655405c5747d` / Check `32168023319` on Node 24.19.0:

```text
tests       534
pass        534
fail        0
cancelled   0
skipped     0
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run on that gate:

```text
player combat profiles  0.379708 ms/op
enemy combat profiles   0.071495 ms/op
basic attacks            0.003396 ms/op
tick dispatch            0.000927 ms/op
direct route lookup      0.007520 ms/op
```

Three-sample medians/spreads on that gate:

```text
player profiles  0.359505 ms/op   6.21%
enemy profiles   0.070873 ms/op  10.10%
basic attacks    0.001285 ms/op 189.74%
tick dispatch    0.000798 ms/op  28.18%
route lookup     0.007662 ms/op   6.59%
```

Benchmark 3 remains the current comparability baseline. Do not compare its numeric values directly with Benchmark 1 or 2. No hard timing threshold is accepted yet, especially for the very short attack/tick microbenchmarks.

### Terminal-task ownership after `.13`–`.17`

The known domain-managed retention seam is now closed without blind central pruning.

`releaseTimedTask` rejects active tasks. Campaign recovery, work, projects, transport, abilities, and resource recovery release terminal records only after their domain consequence/event is durable. Domain records/results/events may retain `taskId` as historical correlation. An unreconciled terminal task remains persisted until its owner consumes it.

The `.17` mixed lifecycle soak proves repeated work/project/travel/ability/resource cycles return the timed-task registry to a stable baseline, including a save/load while project labor is active. A deliberately generic unowned completed task remains retained, demonstrating that domain release is not equivalent to global history deletion.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.** A fresh work order should re-audit one bounded seam before implementation.

For further maintenance/hardening, the next task-history question is narrower: audit whether generic/unowned terminal task records need a bounded diagnostic/history policy at all. Do not add a central prune unless real generic producers/consumers justify it; owner-managed gameplay tasks already return to steady state.

Strong feature candidate families remain:

- agriculture/stewardship;
- earned automation that reduces established chore attention through investment/mastery;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another life/logistics segment only when a specific current gap warrants it.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, long-session stability, performance evidence/budgets, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
