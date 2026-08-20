# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.1
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          40
Benchmark:     3
Codename:      Content Pack Scale Contract v2
Compatibility: pre-release-current-schema
Runtime:       Node >=24
Phase:         0.9 / 0.9.100 in progress
```

## Product version format

Use `MAJOR.PHASE.TRACK.REVISION`.

`package.json.version` remains three-part SemVer and mirrors `MAJOR.PHASE.TRACK` where practical. `js/text/version.js` is runtime authority. Planning a track does not open its runtime version; implementation does.

## Independent contract versions

| Version | Current | Purpose |
| --- | ---: | --- |
| Account Save | 5 | local account/session/character registry contract |
| Game State | 14 | serialized character/world runtime contract |
| Data | 40 | canonical authored-data, stable-ID, pack ownership and validation contract |
| Benchmark | 3 | workload/measurement comparability contract |

These advance independently.

## Current 0.9.100 decision

`0.9.100.1` opens Content Scale Gate A with **infrastructure before content volume**.

```text
Product       0.8.900.1 -> 0.9.100.1
Package       0.8.900   -> 0.9.100
Data          39        -> 40
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

### Why Data 40

Data 40 changes the canonical authored-data infrastructure contract:

- Content Pack schema advances to v2.
- Pack ownership now includes spell schools, capabilities/training definitions, executable abilities, NPC schedules, and companions.
- A connected catalog registry lets packs claim canonical resource/production/equipment items, production recipes, commitments, seed NPCs, routes/ecology, abilities/capabilities, schedules, and companions without copying definition authority.
- Pack validation adds structural/cross-reference/dependency rules for the new scale families.
- Existing current catalog records are assigned to shared/regional ownership roots, including a Redstone opening root.
- Census distinguishes gameplay breadth from pack ownership and can count future pack-native abilities/companions without double-counting catalog refs.

This is a stable-ID/ownership/validation contract change, so Data advances even though gameplay breadth is intentionally unchanged.

### Why Game State stays 14

No new durable player/world fact was introduced. Pack ownership, catalog resolution, schedule-definition validation, and census bookkeeping are authored-data/tooling contracts, not persisted runtime state.

Game State 14 therefore remains the correct strict current-schema authority. Bumping Game State merely because Data changed would create a false compatibility boundary.

## Persistence history

Relevant late history:

```text
Game State 6 -> 7   canonical atlas fictional-time visits
7 -> 8              root combat/stat caches become derived
8 -> 9              canonical nested status modifiers
9 -> 10             state.npcs becomes derived projection
10 -> 11            state.enemies becomes derived projection
11 -> 12            top-level command log becomes transient
12 -> 13            durable cultivation authority
13 -> 14            durable paid cultivation delegation appointment
0.8.900.1           no Game State change
0.9.100.1           no Game State change; Data 39 -> 40
```

Current pre-alpha policy remains current-schema-only; unsupported legacy saves are rejected rather than automatically migrated.

## Current Data 40 content infrastructure contract

Canonical definition authority remains in the existing catalogs. Content packs own stable-ID placement and regional/shared dependency metadata; they do not create a second gameplay database merely for ownership.

Pack v2 collections:

```text
places / routes / transportServices
ecologyFamilies / species / populations / gatheringSources
items / npcs / npcSchedules / shops
recipes / quests / relationships
spellSchools / capabilities / abilities / companions
```

`contentCatalogRegistry` is the bridge between ownership manifests and canonical catalogs.

Key system versions:

```text
contentCatalogRegistry 0.1.0
contentPackSchema      0.2.0
regionalContentPacks   0.3.0
contentPackValidation  0.2.0
contentScaleGate       0.2.0
npcSchedules           0.3.0
```

## Validation baseline

Ordinary local/hosted Check now runs:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census is continuously executable but mechanics-scale target shortfalls remain progression information rather than pass/fail thresholds.

The infrastructure checkpoint before documentation promotion passed 704/704 tests, census, Benchmark 3, and Benchmark Sample on Node 24.19.0. A final promoted-version Check is required before merge and will become the authoritative `0.9.100.1` checkpoint.

No hard timing thresholds are accepted. Benchmark 3 remains comparative evidence.

## Phase progression

```text
0.9.100 Content Scale Gate A               IN PROGRESS
  Packet A Content Pack Scale Contract v2  COMPLETE
  Redstone Forge-Road                      NOT STARTED
  Elderwood Hunt-Timber                    QUEUED
  Starfen Marshcraft-Practical Magic       QUEUED
  Gate A integration/census                QUEUED
0.9.200 Adventure vertical slices          QUEUED
0.9.300 Advanced combat/training            QUEUED
0.9.400 Economy/production depth           QUEUED
0.9.500 Quest/social depth                 QUEUED
0.9.600 Playable-alpha scale push          QUEUED
0.9.700 Browser E2E/accessibility           DEFERRED
0.9.800 Supported persistence transition   DEFERRED
0.9.900 Release-candidate hardening        DEFERRED
```

## Governance and release discipline

Phase 0.9 track work uses PR-based integration and must merge only after required validation evidence is observed. Protected `main` remains recommended; if the available repository action surface cannot configure protection, record that administrative limitation rather than claiming it was changed.

A coherent checkpoint requires one bounded contract, focused/adversarial tests, relevant scale validation, full hosted Check, deliberate version decisions, an exact frozen implementation SHA before documentation synchronization, and `THREAD_HANDOFF.md` updated last.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, usable through ordinary browser play, and supported by enough interconnected content for sustained play. Calendar targets remain planning envelopes, not commitments.
