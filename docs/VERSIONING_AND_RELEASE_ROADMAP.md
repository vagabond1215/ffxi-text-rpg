# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/ROADMAP.md`
- `docs/THREAD_HANDOFF.md`

## Current baseline

```text
Product:       0.8.200.1
Package:       0.8.200
Account Save:  4
Game State:    5
Data:          34
Benchmark:     1
Codename:      Home Workshop Capability
Compatibility: pre-release-current-schema
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete. Phase 0.8 is in progress. `0.8.100` and `0.8.200` are complete.** The project remains pre-alpha and unreleased.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 34 | canonical authored-data contract |
| Benchmark | 1 | benchmark protocol/comparability |

Account Save changes when the account/session registry changes materially. Game State changes when persisted runtime structure or meaning changes materially. Data changes when canonical authored-data shape/authority/content changes materially. Benchmark changes only when the workload/protocol changes enough that prior results stop being comparable.

Recent Data history:

- Data 20 — character capability learning/use;
- Data 21 — original magic/active abilities;
- Data 22 — enemy ability/combat data;
- Data 23 — equipment/field-tool/shop breadth;
- Data 24 — production/process/output;
- Data 25 — regional ecology/resource breadth;
- Data 26 — persistent companion definitions;
- Data 27 — Phase 0.7 player-experience content/opportunity/regional-loop contract;
- Data 28 — canonical commitment definitions + general persistent NPC relationship/follow-up contract;
- Data 29 — Reader Soli Venn / `Marrowleaf for the Ward` continuity breadth;
- Data 30 — Sera Talwin / `Sweetroot for Southgate`, completing three-origin community continuity;
- Data 31 — companion field-approach content plus character-facing place/POI cleanup;
- Data 32 — first canonical home-infrastructure definition linking regional production and project labor to Storage Chest capacity;
- Data 33 — original ancestry/sex-aware names, starting-discipline kits, and authored origin openings;
- Data 34 — Joiner's Workbench furnishing/home-improvement definition plus explicit construction sink metadata for infrastructure-consumed production goods.

`0.8.200` does **not** advance Game State or Account Save. Its project fits existing project `data`; its completed effect is an ordinary placed-furnishing ID; workstation availability is derived from current place plus furnishing tags; production/mastery/provenance use existing runtime structures.

## Compatibility policy

Current mode remains `pre-release-current-schema`. Current-format save/load/validation/resume must be deterministic. Old pre-alpha local saves/accounts may be reset when a cleaner schema materially improves the project. Do not add compatibility-only duplicate state or adapters by reflex.

## Release discipline

A coherent checkpoint requires bounded implementation/tests, observed full suite, observed benchmark, browser/build/deploy verification where applicable, deliberate product/schema/data registration, synchronized docs, and a stop at the declared boundary.

A product milestone advances only when its player-facing gate closes. A completed track or phase does not imply the product is released.

# Phase history

## 0.4 — Foundation — complete

Direction lock, version protocol, persistence migrations, structured action results/events, architecture stabilization.

## 0.5 — Simulation/content substrate — complete

Fictional time, pause/scheduler, timed tasks, interrupts, day review, original-world identity, provenance/projects, ecology/gathering, routes/transport, content packs, validation.

## 0.6 — Integrated character/mechanics — complete

Stats/progression, skills/proficiencies/disciplines/capabilities, semantic DOM UI, original magic/abilities, Combat 2.0, locality/exploration navigation, equipment/field tools, production/crafting, regional ecology/resources, persistent companions/party, and the integrated-mechanics exit gate. Closed at Product `0.6.900.1` / Data 26.

# Phase 0.7 — Multi-region playable alpha — complete

Final Phase 0.7 baseline:

```text
Product:       0.7.400.1
Package:       0.7.400
Data:          31
Account Save:  4
Game State:    5
```

The sequence closed origin/community continuity, multi-region campaign readability, danger/combat/recovery, semantic transport, settlement economy/service depth, semantic information access, companion preparation, and the character-POV browser boundary.

Final runtime checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
Benchmark 1 success
```

Phase 0.7 remains closed; later shared-authority revisions do not reopen its historical gate.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

### Original track

```text
Product:       0.8.100.1
Package:       0.8.100
Data:          32
```

The first home improvement consumes 2 Resin-Sealed Hardwood Boards, 1 Redstone Copper Ingot, and 30 minutes project labor, then places the Storage Chest exactly once and raises furnishing-backed storage from 3 to 8 slots. Existing project, timed-task, inventory, furnishing, and Journal authorities remain canonical.

Original promoted checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
Benchmark 1 success
```

### `0.8.100.2` — onboarding/creator polish revision — complete

```text
Product:       0.8.100.2
Package:       0.8.100
Data:          33
```

This revision added Light/Dark browser themes, save-recovery controls, original-world creator randomization, truthful discipline previews/starter kits, and distinct authored origin arrivals. It reused existing account, inventory, equipment, creator, and DOM authorities.

Promoted checkpoint:

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
Benchmark 1 success
```

## `0.8.200` — Home Workshop Capability — complete

### Version decision

```text
Product:       0.8.200.1
Package:       0.8.200
Account Save:  4
Game State:    5
Data:          34
Benchmark:     1
Codename:      Home Workshop Capability
Compatibility: pre-release-current-schema
```

Data advances `33 -> 34` because this track changes canonical authored data: it adds the Joiner's Workbench furnishing, the second home-infrastructure definition, and construction sink metadata for infrastructure-consumed production goods.

Game State remains 5 because the durable workbench is stored as an ordinary existing placed-furnishing ID, project progress uses existing project records/data, and work/proficiency/production/provenance structures are unchanged. Account Save remains 4 because account/session/character registry semantics are unchanged. Benchmark remains 1 because the workload/protocol is unchanged.

### `0.8.200` subsystem registrations

```text
versionManifest:         0.8.200.1
homeInfrastructure:      0.2.0
activityAdvance:         0.4.0
workstations:            0.3.0
productionItems:         0.3.0
settlementServiceBoard:  0.2.0
```

Supporting database registrations:

```text
homeInfrastructure  implemented 0.2.0
workstations        implemented 0.2.0
productionItems     seeded      0.2.0
```

The runtime subsystem and authored-data registry versions are intentionally independent contracts.

### Authority decision

The track composes existing authorities instead of adding a workshop-management system:

- `homeInfrastructureEngine` maps an authored home improvement onto generic project/material/labor/furnishing completion;
- `projectEngine` owns material contribution, project state, and generic completion;
- canonical world time/timed tasks own the 45-minute build and production durations;
- furnishing state owns the placed Joiner's Workbench;
- `workstationEngine` derives `woodshop`/`workshop` availability from that furnishing only while the character is at the home place;
- `productionEngine` remains sole authority for station requirements, recipe inputs, timed production, outputs, provenance, and work proficiency;
- `settlementServiceBoardEngine` exposes the home-enabled recipe through the ordinary **Work, Trade & Recover** projection;
- Journal/service models remain derived UI state only.

No second property registry, workstation registry, crafting recipe engine, construction clock, home inventory, mastery counter, or UI persistence authority was added.

### Player-facing gate

The authored improvement is:

```text
Build a Joiner's Workbench
  2 Resin-Sealed Hardwood Boards
  1 Copper Trail Clasp
  45 minutes hands-on project labor
    -> Joiner's Workbench furnishing
    -> woodshop + workshop capability at home
```

The furnishing has zero storage slots. Before it exists, the existing `craft-elderwood-resin-board` recipe is blocked at the Thornwall home by its `woodshop` requirement. After construction, the same recipe is available at home through canonical workstation resolution:

```text
1 Elderwood Hardwood
1 Elderwood Amber Resin
240 fictional seconds at proficiency 0
  -> 1 Resin-Sealed Hardwood Board
  -> +2 crafting proficiency
  -> canonical transformation/input/place provenance
```

The effect is locality-bound: leaving the home place removes the furnishing-derived station context until the character returns.

### Resource-lifecycle audit

The follow-up audit aligned descriptive sink metadata with actual infrastructure use:

```text
Resin-Sealed Hardwood Board  -> construction
Redstone Copper Ingot        -> construction
Copper Trail Clasp           -> construction
```

Consumption itself still happens through canonical project/inventory authority; sink metadata does not create another consumption mechanism.

### Regression and repair trail

`tests/playerHomeWorkshopFlow.test.js` is the primary end-to-end guard. It proves the blocked-before-build state, semantic construction, material consumption, active-project save/load, exactly-once furnishing application, zero hidden storage, home-only station tags, service-board recipe discovery, production time/output, provenance/mastery, final save/load, validation, and player-facing HTML hygiene.

Two test/release synchronization failures were repaired without changing the runtime contract:

1. a historical Phase 0.7 gate froze `settlementServiceBoard` at version 1; it now correctly asserts a historical minimum so later shared-authority evolution does not reopen Phase 0.7;
2. the first promoted head left `tests/pipeline.test.js` pinned to `0.8.100.2`; the manifest test was synchronized to the deliberate `0.8.200.1` / Data 34 contract.

### Authoritative promoted runtime checkpoint

```text
03ab71c7e96c54eaeffb75598ed01243fd390f21
506/506 tests
0 failed
0 skipped
Benchmark 1 success
```

Benchmark 1:

```text
1,000 player combat profiles      465.527ms  0.465527ms/op
1,000 enemy combat profiles       117.252ms  0.117252ms/op
1,000 basic attacks               550.132ms  0.550132ms/op
10,000 ticks / 5 subscribers       44.971ms  0.004497ms/op
10,000 direct route lookups      8708.613ms  0.870861ms/op
```

### Closure

**PASS. `0.8.200` is closed.** Phase 0.8 remains open.

Do not automatically mass-author additional workbenches, workshop tiers, agriculture, logistics, social schedules, companion breadth, or automation from this checkpoint. A new bounded work order should first choose and audit one next authority/data seam.

# Planned later phases

## 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the core persistent-life/adventure promise is coherent, durable, original, stable, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track or phase only when its player-facing gate and authority boundaries are coherent enough for the next bounded work order to build on safely.
