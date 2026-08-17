# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md`
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
- `docs/ROADMAP.md`
- `docs/THREAD_HANDOFF.md`

## Current baseline

```text
Product:       0.8.100.2
Package:       0.8.100
Account Save:  4
Game State:    5
Data:          33
Benchmark:     1
Codename:      Home Foothold and Infrastructure
Compatibility: pre-release-current-schema
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete. Phase 0.8 is in progress and the bounded `0.8.100` track is complete.** `0.8.100.2` is an onboarding/character-creation polish revision within that closed track. The project remains pre-alpha and unreleased.

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`. `package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority.

## Independent schema/data versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 4 | local account/session/character registry contract |
| Game State | 5 | serialized character/world runtime contract |
| Data | 33 | canonical authored-data contract |
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
- Data 32 — first canonical home-infrastructure definition linking existing regional production goods and generic project labor to the durable Storage Chest furnishing benefit;
- Data 33 — original ancestry/sex-aware character-name catalog, starting-discipline starter-kit definitions, and authored Thornwall/Brasshaven/Mistmere opening scenes.

Neither the original `0.8.100` home track nor the `0.8.100.2` onboarding revision advances Game State or Account Save. Home construction uses existing project/timed-task/furnishing state. Creator starter gear uses existing inventory records, and save deletion/clear-all uses the existing account registry.

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

The sequence closed origin/community continuity, multi-region campaign readability, danger/combat/recovery, semantic transport, settlement economy/service depth, semantic information access, companion preparation, and the character-POV browser boundary.

Final runtime checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
0 failed
0 skipped
Benchmark 1 success
```

Phase 0.7 remains closed; later shared-authority revisions do not reopen its historical gate.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

### Original track decision

```text
Product:       0.8.100.1
Package:       0.8.100
Account Save:  4
Game State:    5
Data:          32
Benchmark:     1
```

Data `31 -> 32` added the first canonical home-infrastructure definition. `homeInfrastructureEngine` is a bounded adapter over project, timed-task, inventory, furnishing, and Journal authorities. The proving improvement consumes 2 Resin-Sealed Hardwood Boards, 1 Redstone Copper Ingot, and 30 minutes project labor, then places the existing Storage Chest exactly once and raises furnishing-backed storage from 3 to 8 slots.

Original promoted checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
0 failed
0 skipped
Benchmark 1 success
Data 32
```

## `0.8.100.2` — onboarding and character-creation polish revision — complete

### Version decision

```text
Product:       0.8.100.2
Package:       0.8.100
Account Save:  4
Game State:    5
Data:          33
Benchmark:     1
Codename:      Home Foothold and Infrastructure
Compatibility: pre-release-current-schema
```

This is a revision of the existing `0.8.100` track rather than `0.8.200`: it repairs onboarding/player presentation and uses existing game authorities instead of introducing another life/infrastructure feature domain.

Data advances `32 -> 33` because the revision adds canonical authored name pools, starting-discipline-kit definitions, and substantial origin-opening prose. Game State stays 5 because the kit is ordinary inventory. Account Save stays 4 because character deletion and clear-all use the existing registry/storage contract. Benchmark remains 1 because the workload is unchanged.

### Relevant registrations

```text
versionManifest:          0.8.100.2
domOnboarding:            0.1.0
saveRecovery:             0.1.0
characterCreation:        0.6.0
characterCreationContent: 0.2.0
characterNames:           0.1.0
startingDisciplineKits:   0.1.0
```

Existing `domUi`, account-save, inventory, equipment, stat, and game-state versions do not advance merely because the new presentation composes them.

### Player-facing gate

The revision closes the requested onboarding defects:

- active browser color scheme is deliberately limited to Light and Dark palettes;
- corrupt character records can be removed without decoding their game state;
- account-wide local data can be cleared from Settings, with a logged-out recovery path as well;
- name and whole-character randomization use original-world canonical data and valid ancestry/sex combinations;
- the six starting disciplines expose their real attribute/resource/skill/combat distinctions and actual starting gear;
- guided creator state grants the selected two-item kit into ordinary carried inventory without auto-equipping it;
- Thornwall, Brasshaven, and Mistmere have distinct authored arrival scenes with credible first human contacts and discipline-sensitive observation.

The generic new-game constructor intentionally remains neutral unless the creator-specific `includeStartingDisciplineKit` option is supplied. The older prompt/fast-create command adapter still uses neutral generic creation; it is transitional debt, not a reason to make starter inventory universal.

The historical account settings normalizer still accepts `highContrast`, but the active browser UI exposes only Light and Dark. Removing that dormant value can be a later bounded account-settings cleanup.

### Authoritative promoted runtime checkpoint

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
0 failed
0 skipped
Benchmark 1 success
Data 33
```

Benchmark 1:

```text
1,000 player combat profiles      463.353ms  0.463353ms/op
1,000 enemy combat profiles       125.126ms  0.125126ms/op
1,000 basic attacks               551.861ms  0.551861ms/op
10,000 ticks / 5 subscribers       48.338ms  0.004834ms/op
10,000 direct route lookups      8665.221ms  0.866522ms/op
```

Primary new regressions are `tests/playerCreatorPolish.test.js` and `tests/saveRecovery.test.js`. Exact promoted runtime Check and Pages workflows both succeeded. No manual visual-browser walkthrough is claimed by this evidence.

### Next Phase 0.8 decision

`0.8.100` remains closed after this revision. Do not automatically expand it into broad property, farm, workshop, social-schedule, logistics, companion, or automation work. A new bounded user work order should choose and audit one such seam before implementation.

# Planned later phases

## 0.9 — Adventure depth and release hardening

Advanced regions/dungeons, combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the core persistent-life/adventure promise is coherent, durable, original, stable, and supported by enough interconnected content for real play.

## Gate philosophy

Do not inflate version numbers to imply completion. Do not mass-author content merely to fill numeric ranges. Close a track or phase only when its player-facing gate and authority boundaries are coherent enough for the next bounded work order to build on safely.
