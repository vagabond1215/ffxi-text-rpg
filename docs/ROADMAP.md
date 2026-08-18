# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.22
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Active Task Persistence Matrix
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 — Life and infrastructure expansion is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `0.8.600.2` through `.22` are maintenance/hardening revisions and do not open `0.8.700`.**

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

`0.8.600.1` closed Companion Convalescence at 511/511 tests and Benchmark 1 success.

## `0.8.600.2`–`.22` — maintenance and hardening

| Revision | Maintenance gate | Promoted main commit |
| --- | --- | --- |
| `.2` | Current-schema cleanup: canonical persistence/home identifiers and obsolete migration cleanup | `bc42c7a00050f73704f19f2c3287d1426a788fa1` |
| `.3` | Canonical command contract: remove FFXI runtime macro adapter/aliases and ambiguous version aliases | `c1fbfbe2629aee628cba4e60af3bed37bef86f7a` |
| `.4` | Strict current schema: reject incomplete Game State 6 payloads before revival | `ba3f38f05c83175f188b0231c175a89c9310309f` |
| `.5` | Carried commitment delivery shares canonical carried-container authority | `0b62b13b25297acad853c2b17be8ffb86a63419f` |
| `.6` | Canonical ActionResult contract; remove `.message`/`.reason` compatibility aliases | `268e17f4c5d8de08d1ea2fc68f6017371df4627a` |
| `.7` | Node 24/current Actions + executable architecture-debt guards | `f56b2f6f50d481f46babf80b47e13c70672d9176` |
| `.8` | Deterministic 130-day save/load smoke + repeated benchmark sampling | `8fad34adb0d7db253a6593e7ffbeab3f28c28293` |
| `.9` | Benchmark Protocol V2; setup removed from timed attack/tick/route workloads | `7f562e20b335c4fdb449f74a8fd2a48c6378e182` |
| `.10` | Stale-safe tick subscription ownership | `cc75d707f3a6ca492a6de6883c7ac59b871836c8` |
| `.11` | DOM root owns remount/unmount cleanup | `b9d1be0d72cb1bb27d414349bc894726deb6ace3` |
| `.12` | Benchmark 3 separate-context warm-up baseline | `3de675d60ba46852f193b5cd319df2ce056aa00f` |
| `.13` | Terminal-only release API + campaign-recovery save/load/exactly-once proof | `be8db394e81da0e2aa96069efb7df51cd0b68b9b` |
| `.14` | Work/project terminal task release after durable transition | `f7d51365f13fa1cb703383ec4799934e07a3f90f` |
| `.15` | Transport task release after durable arrival/cancellation | `588d6dd0e0a882a6cfdc76d60797c0488330141d` |
| `.16` | Ability/resource terminal release after durable consequence | `67ec4ea8ae19b1032894a604ed372802d794cf92` |
| `.17` | Repeated owner-managed retention soak across real save/load | `e4ebdbc14776329156f2df2dee8c598e3b8b91cb` |
| `.18` | Task Owner Guard: direct production task creation limited to six audited release owners; managed steady state returns to zero retained tasks | `6dbea79abd82dab5b4dc9e1b141a409383937530` |
| `.19` | Strict Active Travel: remove runtime legacy-travel reconstruction; validate Travel State 2/task link before revival | `fcd435c0c3802c7301670a4c48700def1c2465e7` |
| `.20` | Active Task Link Integrity: current active project/work/ability/resource owners require matching persisted tasks | `2c11cda829c407dea6564c4eb622e17238f8dc4c` |
| `.21` | Strict Task Registry: validate task registry version/IDs/status/timing/duplicates/sequence before revival | `8c3995d8957dfa3a9542688d9cc8dc79e69a1903` |
| `.22` | Active Task Persistence Matrix: positive current save/load continuation evidence across all six audited task owners | `7a148ebdff594523f956ed6be83aba59e26d564f` |

Latest exact-head runtime validation was PR #345 / head `be561e922f1b0316727e13a91381595418b956e2` / Check `32171224914` on Node 24.19.0:

```text
tests       550
pass        550
fail        0
cancelled   0
skipped     0
Benchmark 3 success
Benchmark Sample success
```

Benchmark 3 single run on that gate:

```text
player combat profiles  0.394555 ms/op
enemy combat profiles   0.071987 ms/op
basic attacks            0.003521 ms/op
tick dispatch            0.001158 ms/op
direct route lookup      0.007919 ms/op
```

Three-sample medians/spreads:

```text
player profiles  0.364139 ms/op   7.99%
enemy profiles   0.070800 ms/op  11.17%
basic attacks    0.001303 ms/op 219.89%
tick dispatch    0.000713 ms/op  18.43%
route lookup     0.007434 ms/op   6.93%
```

Benchmark 3 remains the current comparability baseline. Benchmark 1/2 values are not directly comparable. No hard timing threshold is accepted yet.

### Task ownership and current-schema integrity after `.13`–`.22`

The known task-retention seam is now closed for production owners without blind central pruning.

Direct production task creation is restricted by executable guard to ability, campaign recovery, projects, resource recovery, transport, and work. Each owner releases a terminal task only after its durable exactly-once consequence. Managed repeated lifecycles return the task registry to zero retained records, while task IDs remain monotonic.

Current Game State 6 validation now checks the task registry itself and active owner/task links before revival. Active travel must already be current Travel State 2; legacy-shaped or orphaned current travel is rejected instead of reconstructed. Active project/work/ability/resource records must retain a matching active-or-completed task until owner reconciliation. Terminal owner records may retain historical `taskId` after task release.

There is currently no production generic/unowned task producer, so no global task-history retention cap is justified. The low-level lifecycle smoke intentionally demonstrates that the task engine itself does not silently prune unowned terminal records.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.** A fresh feature work order should re-audit one bounded seam before implementation.

For further maintenance, the strongest next bounded audit is broader **current-schema registry validation composition**: identify persisted registries that are required structurally but whose own validators are not yet applied at the raw pre-revival boundary. Proceed one registry family at a time because some historical `ensure*` behavior is construction convenience while other missing state would violate Game State 6.

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
