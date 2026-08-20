# Execution Pipeline and Continuation Queue

This is the operational continuation path for **Hearth & Horizon**. Repository evidence beats conversation memory.

Authority order:

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. this file
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`
9. only the runtime/data/tests relevant to the active bounded packet

## Current baseline

```text
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Phase:         0.9 / 0.9.100 Content Scale Gate A
Codename:      Elderwood Hunt-Timber
Runtime:       Node >=24
```

## Current packet

**Elderwood Hunt-Timber — implemented and validated before promotion; final exact-head validation/landing remains.**

Frozen gameplay/data implementation checkpoint:

```text
acb24b73b4894d3febab370aa279bdfd12cbd02e
Check 32423676980
711/711 tests
Content Census PASS
Benchmark 3 PASS
Benchmark Sample PASS
```

Authoritative census at that checkpoint:

```text
places/localities       26
named NPCs              15
shop/service sites      17
creatures               16
resource sources        13
canonical items         62
recipes/processes       23
abilities/techniques    13
quests/contracts        14
companions               1
transport services       3

capabilities            16
NPC schedules            5
content packs             9
pack-owned records      171
```

Mechanics-scale status remains **NOT READY**; abilities/techniques are still the largest relative gap.

## Packet workflow

For Phase 0.9 cross-file content-scale work:

```text
refresh main + handoff + PR state
  -> identify existing domain authorities
  -> create isolated feature branch / draft PR
  -> implement runtime/data/tests first
  -> hosted Check: audit + tests + census + benchmark + sample
  -> fix real behavior regressions before stale expectations
  -> freeze exact implementation/data SHA
  -> promote Product/Data/system versions and assertions
  -> synchronize profile/docs
  -> write THREAD_HANDOFF.md LAST
  -> exact final-head Check
  -> mark ready
  -> merge with expected-head protection
  -> refresh main
  -> stop at bounded packet boundary
```

Do not use generated fixtures or catalog refs to inflate gameplay breadth. Do not introduce parallel clocks, progression, inventory, social, or task authorities simply to accelerate content authoring.

## Persistence and lifecycle decision

Elderwood adds authored content only. Existing owners remain:

- inventory + provenance for physical material;
- work task / production / work proficiency for transformations;
- commitments + relationships + NPC schedules for social continuity;
- character capabilities + ability engine for learned techniques;
- Pack v2 for regional identity/dependencies.

Therefore:

```text
Account Save remains 5
Game State remains 14
Data advances 41 -> 42
Benchmark remains 3
```

No lifecycle-sensitive ownership changed, so `npm run hardening` is not required solely for this packet.

## Validation contract

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
npm run check
```

`npm run hardening` remains required when lifecycle-sensitive runtime ownership changes or a later phase/release gate explicitly calls for it.

## Continuation queue

1. **Finish Elderwood Hunt-Timber landing** — exact promoted head must pass hosted Check and merge.
2. **Starfen Marshcraft-Practical Magic** — next proposed bounded Gate A tranche; **NOT STARTED** and requires a new explicit continuation after Elderwood lands.
3. **Gate A integration/census audit** — after regional tranches.
4. Later `0.9.200+` tracks remain queued by roadmap.

Do not start Starfen merely because it is next in this queue.
