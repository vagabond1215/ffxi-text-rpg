# Hearth & Horizon

**Hearth & Horizon** is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, material capability, home infrastructure, and geographic reach across an original connected fantasy world.

Earlier FFXI-derived experiments remain research/reference only and are not canonical world content.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.9 — Content Scale, Adventure Depth and Release Hardening — is open. `0.9.100 Content Scale Gate A` is in progress. Content Pack Scale Contract v2 and Redstone Forge-Road are complete; **Elderwood Hunt-Timber** is the current validated packet pending final PR landing.

```text
Product:       0.9.100.3
Package:       0.9.100
Account Save:  5
Game State:    14
Data:          42
Benchmark:     3
Codename:      Elderwood Hunt-Timber
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Game State remains 14 because Elderwood adds no new durable runtime authority. Data advances to 42 because the packet adds stable NPC, schedule, capability, ability, production, commitment, and Pack-v2 content relationships.

## Current regional content proof

Elderwood Hunt-Timber composes existing authorities rather than creating a new subsystem:

```text
Barkboar recovery + Duskcap + amber resin + hardwood
  -> existing tannery / woodshop production and work proficiency
  -> tanned hide / resin pitch / field gear / repair bundles
  -> existing commitment / relationship / NPC schedule authority
  -> character-owned Elderwood techniques and warding
  -> Pack v2 regional ownership
```

The packet adds three persistent Thornwall service contacts from existing POIs, Oren Vale's 07:00–15:00 roadworks schedule, six new downstream production outputs/processes, four executable Elderwood capabilities, three provenance-qualified commitments, and `pack-elderwood-hunt-timber`.

No new simulation clock, task owner, persistence family, companion, place, or generic quest engine was added.

## Content-scale census

```text
places/localities       26 / mechanics floor 10
named NPCs              15 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         62 / 200
recipes/processes       23 / 75
abilities/techniques    13 / 100
quests/contracts        14 / 30
companions               1 / 4
transport services       3 / 5
```

Supplemental ownership coverage:

```text
routes                                   7
spell schools                            3
capability/training definitions         16
NPC schedules                            5
regional/shared content packs            9
pack-owned records                     171
pack-owned abilities/capabilities/
  schedules/companions                13/16/5/1
runtime seed NPCs                       14
runtime seed enemies                    13
```

The mechanics-scale gate remains **NOT READY**. Abilities/techniques remain the largest relative gap. Counts are progression evidence, not filler quotas.

## Core authority rules

- fictional simulation time is canonical and separate from wall-clock scheduling;
- current persistence is strict pre-alpha current-schema-only;
- content packs own stable regional/shared identity and dependencies, not duplicate gameplay state;
- canonical catalogs remain definition authorities;
- inventory/provenance, production/work, commitments/relationships/schedules, and character capabilities remain the existing owners;
- direct timed-task creation remains limited to the audited existing domain owners;
- the semantic DOM/UI is player-facing; command routing remains an adapter/power-user seam.

## Validation

```bash
npm run audit:repo
npm test
npm run census
npm run benchmark
npm run benchmark:sample
npm run hardening
npm run check
```

Hosted `Check` executes Repository Audit + Test + Content Census + Benchmark 3 + Benchmark Sample on Node 24. Census target shortfalls are informational and do not fail ordinary CI.

The frozen Elderwood implementation/data checkpoint is `acb24b73b4894d3febab370aa279bdfd12cbd02e`, validated by Check `32423676980` with 711/711 tests plus census and both benchmark steps green before version/document promotion.

## Decision boundary

The next proposed Gate A tranche is **Starfen Marshcraft-Practical Magic**, but it is **not started and not authorized by this packet**. After that comes Gate A integration/census review.

Read first when continuing:

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. `docs/PHASE_0_9_IMPLEMENTATION_PLAN.md`

Repository evidence beats conversation memory.
