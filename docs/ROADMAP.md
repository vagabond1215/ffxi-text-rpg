# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.600.27
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
Codename:      Strict Character Runtime
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

**Phases 0.4–0.7 are complete. Phase 0.8 — Life and infrastructure expansion is in progress. Tracks `0.8.100` through `0.8.600` are complete and audited. Revisions `0.8.600.2` through `.27` are maintenance/hardening revisions and do not open `0.8.700`.**

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

Historical final Phase 0.7 checkpoint: `1e217fe1f7e62593fa9ed33eebdf1b3878490336`, 495/495 tests, Benchmark 1, Product `0.7.400.1`, Data 31.

# Phase 0.8 — Life and infrastructure expansion — in progress

| Track | Gate | Status |
| --- | --- | --- |
| `0.8.100` | Home foothold: Storage Chest converts regional materials + project labor into durable storage | **Complete** |
| `0.8.200` | Home workshop: Joiner's Workbench grants locality-bound production capability | **Complete** |
| `0.8.300` | Carried-load transport: service capacity derives from actual carried inventory | **Complete** |
| `0.8.400` | Portable logistics: earned Field Satchel expands field organization without creating free cargo | **Complete** |
| `0.8.500` | Daily social availability: Sera Talwin follows authored fictional-time availability | **Complete** |
| `0.8.600` | Companion convalescence: safe-settlement recovery closes the downed inactive-companion dead end | **Complete** |

Historical feature-track checkpoints:

```text
0.8.100  0b9251a43285443087050127da36b977cabdf7ee
0.8.200  03ab71c7e96c54eaeffb75598ed01243fd390f21
0.8.300  4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
0.8.400  d1a43568c5ca4dd7e57fb86316b422c35025ce07
0.8.500  fde1d30d76264ea25af6bad4d829545c488eec9b
0.8.600  04211e8909996b1ac34fa91ae1cdd7aa216b86f8
```

## `0.8.600.2`–`.27` — maintenance and hardening

| Revision | Maintenance gate | Promoted main commit |
| --- | --- | --- |
| `.2` | Current-schema cleanup: canonical persistence/home identifiers and obsolete migration cleanup | `bc42c7a00050f73704f19f2c3287d1426a788fa1` |
| `.3` | Canonical command contract; remove FFXI runtime command compatibility | `c1fbfbe2629aee628cba4e60af3bed37bef86f7a` |
| `.4` | Strict current schema: reject incomplete Game State 6 before revival | `ba3f38f05c83175f188b0231c175a89c9310309f` |
| `.5` | Carried commitment delivery shares canonical carried-container authority | `0b62b13b25297acad853c2b17be8ffb86a63419f` |
| `.6` | Canonical ActionResult contract; remove compatibility aliases | `268e17f4c5d8de08d1ea2fc68f6017371df4627a` |
| `.7` | Node 24/current Actions + executable architecture-debt guards | `f56b2f6f50d481f46babf80b47e13c70672d9176` |
| `.8` | Deterministic 130-day save/load smoke + benchmark sampling | `8fad34adb0d7db253a6593e7ffbeab3f28c28293` |
| `.9` | Benchmark Protocol V2 | `7f562e20b335c4fdb449f74a8fd2a48c6378e182` |
| `.10` | Stale-safe tick subscription ownership | `cc75d707f3a6ca492a6de6883c7ac59b871836c8` |
| `.11` | DOM root owns remount/unmount cleanup | `b9d1be0d72cb1bb27d414349bc894726deb6ace3` |
| `.12` | Benchmark 3 warm-up baseline | `3de675d60ba46852f193b5cd319df2ce056aa00f` |
| `.13` | Terminal-only task release + campaign-recovery proof | `be8db394e81da0e2aa96069efb7df51cd0b68b9b` |
| `.14` | Work/project terminal task release | `f7d51365f13fa1cb703383ec4799934e07a3f90f` |
| `.15` | Transport terminal task release | `588d6dd0e0a882a6cfdc76d60797c0488330141d` |
| `.16` | Ability/resource terminal task release | `67ec4ea8ae19b1032894a604ed372802d794cf92` |
| `.17` | Repeated owner-managed retention soak | `e4ebdbc14776329156f2df2dee8c598e3b8b91cb` |
| `.18` | Direct task-owner guard + zero-retained managed steady state | `6dbea79abd82dab5b4dc9e1b141a409383937530` |
| `.19` | Strict Active Travel; remove runtime legacy reconstruction | `fcd435c0c3802c7301670a4c48700def1c2465e7` |
| `.20` | Active Task Link Integrity | `2c11cda829c407dea6564c4eb622e17238f8dc4c` |
| `.21` | Strict Task Registry | `8c3995d8957dfa3a9542688d9cc8dc79e69a1903` |
| `.22` | Active Task Persistence Matrix | `7a148ebdff594523f956ed6be83aba59e26d564f` |
| `.23` | Strict Project Registry: project validator runs on raw current saves | `d99d8b56cb3a79f24a3aa9c1c0212ca21c7b8e74` |
| `.24` | Strict Continuity Registries: commitments + relationships validate before revival | `d9fab2ac9096243687afc72ef5c9faac16a27216` |
| `.25` | Strict Resource Opportunities: resource registry validates before recovery reconciliation | `8b15db6696bb38988e023935df13345dac5574d8` |
| `.26` | Strict Ecology Registry: persisted depletion/regeneration state validates before runtime access | `d1f55853a366604cf36b274c915935dd7978575b` |
| `.27` | Strict Character Runtime: Party + Ability runtime validators run before normalization | `bccd49848593e47e7f5b3d69e0132d3a598ebe4a` |

### Latest strict-registry train `.23`–`.27`

| Revision | PR | Exact head | Check | Tests |
| --- | ---: | --- | ---: | ---: |
| `.23` | #346 | `9facc76633f706cf808371e60b24ce901c0659af` | `32172651042` | 555/555 |
| `.24` | #347 | `e71cbfe13ec08f39462cfad59a3793643e478c25` | `32173390833` | 560/560 |
| `.25` | #348 | `1251d915706f4c7e4c1a795512aa1e24f4eea17b` | `32173721913` | 565/565 |
| `.26` | #349 | `ae497c08ffa017a76d5baa2ba190cde39c1c4a3a` | `32174111312` | 569/569 |
| `.27` | #350 | `5d0d8071d9f94cac818c43a1fe018583eb56286f` | `32174533957` | 575/575 |

Every final head passed Test, Benchmark 3, and Benchmark Sample on Node 24.19.0 before promotion.

Latest Benchmark 3 evidence from `.27`:

```text
single run
player profiles  0.381457 ms/op
enemy profiles   0.067924 ms/op
basic attacks    0.003165 ms/op
tick dispatch    0.000865 ms/op
route lookup     0.007660 ms/op

three-sample medians/spreads
player profiles  0.357477 ms/op   6.21%
enemy profiles   0.064718 ms/op   8.92%
basic attacks    0.001198 ms/op 200.77%
tick dispatch    0.000698 ms/op  69.53%
route lookup     0.007425 ms/op  17.56%
```

Benchmark 3 remains the current comparability baseline. No hard timing threshold is accepted yet.

### Current persistence boundary after `.23`–`.27`

Current Game State 6 raw validation now composes domain validators for timed tasks, active travel, projects, commitments, relationships, resource opportunities, ecology, party, and ability runtime before revival. Active task-owning records also require consistent persisted task links.

This does **not** mean every runtime `ensure*` helper is obsolete. Construction helpers may still initialize new/internal state, and derived/transient state may be recomputed. The load boundary must first classify a state family as persistent authority, derived/transient, or construction convenience before adding another validator.

Malformed current required state is rejected without being silently repaired or rewritten. Old pre-alpha payloads remain outside the supported compatibility surface.

## Current Phase 0.8 boundary

**Do not automatically begin `0.8.700`.** A fresh feature work order should re-audit one bounded seam before implementation.

For further maintenance, the next bounded persistence audit should examine the **remaining top-level/player state families not yet governed by a dedicated raw-domain validator**, one family at a time. Prioritize authoritative state with meaningful invariants; do not mechanically validate projections or historical construction convenience.

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
