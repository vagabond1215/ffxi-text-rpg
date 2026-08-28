# Execution Pipeline

This file is the operational continuation path for Hearth & Horizon.

## Resume sequence

1. Read `AGENTS.md`.
2. Read `docs/THREAD_HANDOFF.md`.
3. Read this file.
4. Read `docs/ROADMAP.md`.
5. For ecology/geography work, read `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md`.
6. For new world-edge work, read `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md`.
7. Verify current `main`, active PR and latest hosted Check.
8. Inspect only files/tests relevant to the immediate bounded unit.

Do not redo completed historical discovery without contradictory repository evidence.

## Current contract

```text
Product:       0.9.100.6
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          45
Benchmark:     3
Codename:      Ecology & Geography Integrity
```

## Current integration unit

**PR #390 — Ecology & Geography Integrity Audit**

Base main is the landed Slatewater merge:

`edca59ac8955d999f7c80812688e7153d5aaafeb`

Slatewater post-merge Check #1265 / run `33187962625` passed.

Audit implementation before Data 45 synchronization passed:
- Check #1266 / run `33188833540`, 728/728 tests;
- Check #1267 / run `33189086957` after reciprocal Crownward forest-gate repair.

Final exact-head validation is required after Data 45 documentation synchronization.

## Data 45 scope

```text
canonical geography repair
  -> remove competing legacy direct route edges
  -> repair accidental no-exit places
  -> repair ordinary gate reciprocity / direction metadata

validator hardening
  -> map <-> place reciprocity
  -> route stop coordinates + ordered chains
  -> service stop subsequences
  -> regional ecology schema parity
  -> raw duplicate detection before dedupe
  -> resource provenance registry validation
  -> canonical regional ecology catalog refs

regression proof
  -> tests/ecologyGeographyIntegrity.test.js
```

No persisted state family changed.

## Immediate landing sequence

1. Finish Data 45 authority-document synchronization.
2. Run exact-head hosted Check on PR #390.
3. Require Repository Audit + Test + Census + Benchmark + Benchmark Sample success.
4. Verify PR #390 mergeable.
5. Merge PR #390.
6. Verify post-merge main Check.
7. Land a tiny docs-only continuity sync if handoff/profile still describe PR #390 as active.

## Current measured census

```text
places/localities       29
named NPCs              20
shop/service sites      19
creature definitions    40
resource sources        35
canonical items         90
recipes/processes       29
abilities/techniques    41
quests/contracts        18
companions               1
transport services       4

routes                    7
spell schools             4
capabilities             44
NPC schedules             9
content packs            13
pack-owned records      374
```

## Deferred audit findings

These are recorded work candidates, not current failures:
- Old Gaol ecology/content substrate;
- Timbercross gathering;
- sparse dungeon gathering/salvage;
- population-backed hunting/encounter discovery.

The express-service stop policy is intentionally retained.

## Decision boundary after audit

Do not auto-start another unit.

Candidate directions:
- formal Packet E Gate A integration/census audit;
- Crownfields, ranked next in temporary world-edge planning;
- population-backed hunting encounter integration if ecology gameplay depth is prioritized.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
npm run hardening   # lifecycle-sensitive/release work
```

Census target completion is informational for ordinary Check.
