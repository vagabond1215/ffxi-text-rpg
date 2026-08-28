# Execution Pipeline

Operational continuation path for Hearth & Horizon.

## Current baseline

```text
Product:       0.9.100.6
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          45
Benchmark:     3
Codename:      Ecology & Geography Integrity

latest main product merge: 8a6faf63832b9443a175cc9031dd881ca1b7a2a8
PR #390:                  MERGED
post-merge Check #1291:   PASS
tests:                     728/728
```

## Resume sequence

1. Read `AGENTS.md`.
2. Read `docs/THREAD_HANDOFF.md`.
3. Read this file and `docs/ROADMAP.md`.
4. Read `docs/ECOLOGY_GEOGRAPHY_INTEGRITY_AUDIT.md` for current world/ecology integrity findings.
5. Read `docs/TEMP_WORLD_EDGE_EXTENSION_PLAN.md` only when world-edge expansion is relevant.
6. Verify current `main` and latest hosted Check.
7. Inspect only files relevant to the next bounded unit.

## Current status

No implementation unit is active after PR #390.

The repository has a clean post-merge baseline and waits for explicit next authorization.

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
NPC schedules            9
content packs            13
pack-owned records      374
```

## Known deferred gaps

- population-backed hunt encounter discovery;
- Old Gaol ecology/resource substrate;
- Timbercross gathering sources;
- sparse dungeon gathering/salvage;
- companions remain largest mechanics-scale relative gap.

These are roadmap inputs, not red CI conditions.

## Next decision boundary

Formal roadmap:
- **Packet E — Gate A integration/census audit**.

World-edge planning:
- **Crownfields** is ranked next.

Ecology gameplay:
- **population-backed hunting encounter bridge** is a strong bounded candidate.

Do not auto-start any of them without an explicit work order.

## Validation

Every landing candidate:

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
```

Use `npm run hardening` for lifecycle-sensitive/release work.

## Invariants carried forward

- one authority per domain;
- one fictional world clock;
- Pack v2 owns placement/dependencies, not duplicate definitions;
- canonical map/place references must be reciprocal;
- canonical routes must not be shadowed by contradictory direct edges;
- player-enterable places need an outbound path unless trapping is deliberate;
- service stops may be express ordered subsequences;
- regional ecology must pass canonical registry validation;
- resource provenance must resolve end-to-end;
- do not make passive wildlife aggressive merely to simulate hunting;
- Game State changes only for new durable serialized state.
