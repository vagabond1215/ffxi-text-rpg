# Versioning and Release Roadmap

This document defines product-version protocol and milestone gates from the current pre-alpha foundation to 1.0. Milestones are criteria-driven rather than calendar-driven.

## Current baseline

```text
Product:       0.9.100.2
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          41
Benchmark:     3
Codename:      Redstone Forge-Road
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
| Data | 41 | canonical authored-data, stable-ID, pack ownership and validation contract |
| Benchmark | 3 | workload/measurement comparability contract |

These advance independently.

## `0.9.100` history and current decision

### `0.9.100.1` — Content Pack Scale Contract v2

Packet A opened Content Scale Gate A with infrastructure before volume:

```text
Product       0.8.900.1 -> 0.9.100.1
Package       0.8.900   -> 0.9.100
Data          39        -> 40
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

Data 40 established Pack v2 ownership/validation and the catalog bridge for scale-critical content families without increasing gameplay breadth or persisted authority.

### `0.9.100.2` — Redstone Forge-Road

Packet B adds the first authored regional tranche on top of Pack v2:

```text
Product       0.9.100.1 -> 0.9.100.2
Package       0.9.100   -> 0.9.100
Data          40        -> 41
Game State    14        -> 14
Account Save  5         -> 5
Benchmark     3         -> 3
```

#### Why Data 41

Data 41 adds stable canonical authored records and connected relationships across existing catalogs:

- four Redstone character-owned capabilities and four executable abilities;
- six additional downstream Redstone forge outputs and six additional forge processes;
- three provenance-qualified Brasshaven commitments;
- `pack-redstone-forge-road` as a child Pack v2 ownership graph depending on shared foundation, Redstone opening, and Redstone ecology breadth;
- source/sink/provenance/social connections that make those IDs part of the current canonical data contract.

The census consequently moves to 56 canonical items, 17 recipes/processes, 9 abilities/techniques, and 11 quests/contracts while places, NPCs, creatures, resource sources, companions, and transport remain unchanged in this bounded tranche.

#### Why Game State stays 14

No new durable player/world fact was introduced. Redstone Forge-Road reuses existing:

- character capability/skill authority;
- ability runtime authority;
- inventory/equipment and provenance authority;
- work-task/work-proficiency/production authority;
- commitment/relationship/NPC-schedule authority;
- canonical fictional world time.

There is no new simulation clock, direct timed-task owner, persistence family, inventory store, progression meter, or social state family. Bumping Game State merely because authored content grew would create a false compatibility boundary.

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
0.9.100.2           no Game State change; Data 40 -> 41
```

Current pre-alpha policy remains current-schema-only; unsupported legacy saves are rejected rather than automatically migrated.

## Current content infrastructure contract

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

Key current system/catalog versions include:

```text
contentCatalogRegistry 0.1.0
contentPackSchema      0.2.0
regionalContentPacks   0.4.0
contentPackValidation  0.2.0
contentScaleGate       0.2.0
npcSchedules           0.3.0
commitments            0.5.0
productionCatalog      0.3.0
productionItems        0.5.0
capabilities           0.3.0
abilityCatalog         0.2.0
```

## Validation baseline

Ordinary local/hosted Check runs:

```text
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Census is continuously executable but mechanics-scale target shortfalls remain progression information rather than pass/fail thresholds.

The frozen Redstone implementation/content head before promotion/document synchronization is:

```text
440a77c542fcc6a6efcce7a45ca989e9068499f8
```

Hosted Check `32416678697` / job `96579293377` on Node 24.19.0 passed Repository Audit, **707/707 tests**, Content Census, Benchmark 3, and Benchmark Sample. A final exact promoted/documented PR-head Check is required before merge.

No hard timing thresholds are accepted. Benchmark 3 remains comparative evidence.

## Phase progression

```text
0.9.100 Content Scale Gate A                  IN PROGRESS
  Packet A Content Pack Scale Contract v2     COMPLETE / MERGED
  Packet B Redstone Forge-Road                IMPLEMENTED + VALIDATED / PENDING LANDING
  Elderwood Hunt-Timber                       NOT STARTED / NEXT WITH NEW AUTHORIZATION
  Starfen Marshcraft-Practical Magic          QUEUED
  Gate A integration/census                   QUEUED
0.9.200 Adventure vertical slices             QUEUED
0.9.300 Advanced combat/training              QUEUED
0.9.400 Economy/production depth              QUEUED
0.9.500 Quest/social depth                    QUEUED
0.9.600 Playable-alpha scale push             QUEUED
0.9.700 Browser E2E/accessibility              DEFERRED
0.9.800 Supported persistence transition      DEFERRED
0.9.900 Release-candidate hardening           DEFERRED
```

## Governance and release discipline

Phase 0.9 track work uses PR-based integration and merges only after required validation evidence is observed. Protected `main` remains recommended; if the available repository action surface cannot configure protection, record that administrative limitation rather than claiming it was changed.

A coherent checkpoint requires one bounded contract, focused/adversarial tests, relevant scale validation, full hosted Check, deliberate version decisions, an exact frozen implementation SHA before documentation synchronization, and `THREAD_HANDOFF.md` updated last.

## 1.0 — Live foundation

Release when the persistent-life/adventure promise is coherent, durable, original, stable, performant, usable through ordinary browser play, and supported by enough interconnected content for sustained play. Calendar targets remain planning envelopes, not commitments.