# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/ROADMAP.md`
- `docs/THREAD_HANDOFF.md`

## Current baseline

```text
Product:       0.8.100.1
Package:       0.8.100
Account Save:  4
Game State:    5
Data:          32
Benchmark:     1
Codename:      Home Foothold and Infrastructure
Compatibility: pre-release-current-schema
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete. Phase 0.8 is in progress and `0.8.100` is complete.** The project remains pre-alpha and unreleased.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 32 | canonical authored-data contract |
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
- Data 29 — commitment catalog v2, Reader Soli Venn, `Marrowleaf for the Ward`, raw-resource/source/return guidance;
- Data 30 — Sera Talwin plus `Sweetroot for Southgate`, completing the three-origin authored community-continuity set;
- Data 31 — companion catalog v2 with voiced field approaches plus character-facing place/POI authored-content cleanup;
- Data 32 — first canonical home-infrastructure definition linking existing regional production goods and generic project labor to the durable Storage Chest furnishing benefit.

`0.8.100` does **not** advance Game State or Account Save. Its persistent construction record fits the existing generic project `data` contract, its labor is an existing timed task, and its completed benefit uses existing placed-furnishing/inventory state.

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

| Track | Contract | Result |
| --- | --- | --- |
| `0.6.100` | Continuous-character stats/progression | Data 19 |
| `0.6.200` | skills/proficiencies/disciplines/capabilities | Data 20 |
| `0.6.250` | semantic DOM UI | Data 20 |
| `0.6.300` | original magic/ability engine | Data 21 |
| `0.6.400` | Combat 2.0 | Data 22 |
| `0.6.450` | locality/exploration navigation | Data 22 |
| `0.6.500` | equipment/field tools | Data 23 |
| `0.6.600` | gathering/production/crafting | Data 24 |
| `0.6.700` | regional ecology/resources | Data 25 |
| `0.6.800` | persistent companions/party | Data 26 |
| `0.6.900` | integrated mechanics exit gate | Product `0.6.900.1` / Data 26 |

# Phase 0.7 — Multi-region playable alpha — complete

Final Phase 0.7 baseline:

```text
Product:       0.7.400.1
Package:       0.7.400
Data:          31
Account Save:  4
Game State:    5
```

The sequence closed origin/community continuity, multi-region campaign readability, danger/combat/recovery, semantic transport, settlement economy/service depth, semantic information access, companion preparation, and the character-POV browser boundary. The authoritative final runtime checkpoint remains:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
0 failed
0 skipped
Benchmark 1 success
```

Final Phase 0.7 registrations that remain relevant:

```text
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
settlementServiceBoard:       0.1.0
workstations:                 0.2.0
shopTransactions:             0.5.0
playerInformation:            0.1.1
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.10.0
companionCatalog:             0.2.0
party:                        0.2.0
companions:                   0.2.0
```

Phase 0.7 remains closed; later shared-authority revisions do not reopen its historical gate.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

### Version decision

```text
Product:       0.8.100.1
Package:       0.8.100
Account Save:  4
Game State:    5
Data:          32
Benchmark:     1
Codename:      Home Foothold and Infrastructure
Compatibility: pre-release-current-schema
```

Data advances `31 -> 32` because this track adds a canonical authored home-infrastructure definition and a material-to-durable-benefit contract. Game State remains 5 because construction uses the existing `state.projects` record/data structure, existing canonical timed tasks, and existing `inventoryState.mogHouse.placedFurniture`. Account Save remains 4 because the account/session/character registry is unchanged. Benchmark remains 1 because the benchmark protocol/workloads are unchanged.

### `0.8.100` subsystem registrations

```text
versionManifest:              0.8.100.1
homeInfrastructure:           0.1.0
characterActivity:            0.3.0
activityAdvance:              0.3.0
gameViewModels:               0.13.0
uiIntents:                    0.10.0
validation:                   0.10.0
projects:                     0.1.0
homeStorage:                  0.3.9
```

Existing `projects` and `homeStorage` versions do not advance because their authority contracts did not change. The new adapter consumes them. `js/text/data/databaseRegistry.js` records `homeInfrastructure` as an implemented `0.1.0` contract.

### Authority decision

`homeInfrastructureEngine` is a bounded adapter over existing authorities:

- authored home-improvement definitions specify material/labor/benefit requirements;
- `projectEngine` owns project IDs, material contributions, labor linkage, status, and generic completion;
- world time/timed tasks own fictional duration;
- inventory/furnishing definitions own the actual storage-capacity benefit;
- the Journal/view model is derived presentation only;
- semantic UI intents delegate begin/contribute/start operations to the adapter;
- `activityAdvanceEngine` can now complete generic `project.labor`, with home-specific completion effects delegated back to the home adapter.

No second property registry, construction timer, item store, storage-capacity calculation, or UI persistence layer was added.

### Player-facing gate

The first improvement is **Build a Storage Chest**. It requires 2 Resin-Sealed Hardwood Boards, 1 Redstone Copper Ingot, and 30 minutes of hands-on fictional labor. The materials are existing canonical products from Elderwood and Redstone chains; construction therefore turns regional production into a durable preparation sink rather than spawning a disconnected building currency.

The starting Bronze Bed + Maple Table provide 3 furnishing-storage slots. Completion places the existing Storage Chest exactly once, raising the furnishing-backed home storage capacity to 8 slots. Real account save/load is proven both during active construction and after completion.

`tests/playerHomeInfrastructureFlow.test.js` guards semantic Journal actions, atomic material contribution, active-project persistence, canonical activity completion, exactly-once furnishing application, 3 -> 8 capacity, final save/load continuity, validation, and player-facing HTML hygiene.

### Authoritative promoted runtime checkpoint

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
0 failed
0 skipped
Benchmark 1 success
Data 32
```

Benchmark 1:

```text
1,000 player combat profiles     466.332ms  0.466332ms/op
1,000 enemy combat profiles      108.813ms  0.108813ms/op
1,000 basic attacks              521.192ms  0.521192ms/op
10,000 ticks / 5 subscribers      48.255ms  0.004825ms/op
10,000 direct route lookups     8784.978ms  0.878498ms/op
```

Benchmark protocol remains 1 and the results remain comparable to the Phase 0.7 baseline.

### Next Phase 0.8 decision

`0.8.100` is closed. Do not automatically expand it into broad property or farm authoring. A new bounded work order should choose and audit the next life/infrastructure seam before implementation. Candidate directions include workshop/home-production depth, agriculture/stewardship, logistics, social schedules/relationship life, companion life breadth, or earned automation.

# Planned later phases

## 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the core persistent-life/adventure promise is coherent, durable, original, stable, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track or phase only when its player-facing gate and authority boundaries are coherent enough for the next bounded work order to build on safely.
