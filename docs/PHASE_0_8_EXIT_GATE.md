# 0.8 Life and Infrastructure Exit Gate

This document records the evidence used to close Phase 0.8 — Life and Infrastructure Expansion. It is an evidence record, not authorization to begin Phase 0.9 implementation.

Authoritative companions are `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/ROADMAP.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/QUALITY_GATES.md`, and `docs/THREAD_HANDOFF.md`.

## Exit decision

**Phase 0.8 is complete.**

The phase closes on Product `0.8.900.1`, Package `0.8.900`, Account Save 5, Game State 14, Data 39, Benchmark 3, codename **Household & Community Continuity**.

Exact frozen runtime implementation SHA:

```text
ca7d37c643adc4115b519148615f6120d03228df
```

Validation-only PR #380 was closed without merge after collecting hosted evidence. Validation-only workflow instrumentation added Census + Hardening on its branch and did not alter production runtime.

## Connected-life proof

Phase 0.8 now supports one coherent life/adventure progression chain using existing authorities rather than isolated minigames:

```text
regional materials
  -> home storage improvement
  -> home workshop capability
  -> carried-load / Field Satchel logistics
  -> fictional-time NPC schedules and companion convalescence
  -> home Sweetroot cultivation
  -> repeated manual cultivation mastery
  -> earned paid delegation of one tending chore
  -> cultivated produce with home-plot provenance
  -> named scheduled community commitments and persistent relationships
  -> ordinary inventory, services, travel, preparation and adventure remain available
```

The individual track regressions all pass together in the full suite. The exit decision relies on their shared state contracts plus long-session save/load evidence, not on inventing another Phase-specific runtime authority.

## Gate 1 — Home and infrastructure remain connected to the world

Satisfied.

- `0.8.100` converts regional materials and hands-on project labor into durable home storage.
- `0.8.200` turns home improvement into a reusable woodshop capability that reduces future workshop travel.
- `0.8.300` makes scheduled transport capacity depend on actual carried inventory and home-storage planning.
- `0.8.400` earns Field Satchel capacity without turning it into free transport cargo.

Home infrastructure therefore changes later logistics and production choices instead of existing only as decorative state.

## Gate 2 — Cultivation is deterministic stewardship, not a second simulation

Satisfied by `0.8.700`.

- `state.cultivation` owns required durable plot/crop facts.
- Planting consumes one physical canonical Sweetroot.
- Growth and tending/readiness boundaries use canonical fictional timestamps.
- Growth creates no crop-owned timer, interval, task, wall-clock scheduler, or offline progression path.
- Preparation and manual tending reuse the existing work/timed-task owner.
- Harvest is exactly once and produces ordinary inventory output carrying home-plot and seed provenance.
- Repeated hands-on work increases existing cultivation work proficiency.

Game State advanced 12 -> 13 for required cultivation authority; Data advanced 37 -> 38 for stable cultivation identifiers.

## Gate 3 — Repetition can be reduced only after it is earned

Satisfied by `0.8.800`.

After one manually completed cultivation cycle, the player can pay **12 gil** to arrange the next Sweetroot tending visit.

The delegation contract is bounded:

- wages are charged up front;
- cultivation remains consequence authority;
- the appointment persists under the cultivation plot/crop contract;
- completion derives from canonical fictional time;
- no new timed-task owner or helper clock exists;
- delegated work does not award player cultivation mastery;
- completion and harvest remain exactly once across save/load;
- insufficient funds fail atomically.

Game State advanced 13 -> 14 because the paid pending appointment cannot be reconstructed safely after the wage is spent.

## Gate 4 — The foothold has named social consequences

Satisfied by `0.8.900`.

Three existing locality people are persistent NPC-backed community contacts:

- Mira Fen — Thornwall Southgate, available 06:00–11:00;
- Mae Oris — Brasshaven Market Ring, available 11:00–17:00;
- Kiri Fen — Mistmere Canal Ward, available 16:00–21:00.

Each has a commitment that accepts a Sweetroot only when provenance includes `plot-home-sweetroot-bed`. Wild-foraged Sweetroot does not satisfy the requirement.

Resolution uses the existing commitment, wallet, inventory, relationship, semantic-event, NPC-schedule, save/load and Journal authorities. Each relationship change/payment/follow-up is exactly once. No social clock, reputation meter, household-state engine, or duplicate quest framework was introduced.

The Journal commitment actions are direct semantic intents:

```text
commitment.accept
commitment.resolve
commitment.followUp
```

## Gate 5 — Persistence and lifecycle ownership remain coherent

Satisfied.

Current durable schema is Game State 14. Current-schema-only pre-alpha policy remains in force; no automatic migrations were added.

Direct production timed-task creators remain exactly the established owner set:

```text
abilityEngine.js
campaignRecoveryEngine.js
projectEngine.js
resourceOpportunityEngine.js
transportEngine.js
workTaskEngine.js
```

Cultivation growth and routine delegation add no new direct owner.

`npm run hardening` passed:

```text
long-session lifecycle tests: 2/2 pass
Benchmark Sample: success
```

The lifecycle tests verify multi-day save/load continuation remains deterministic and mixed owner-managed lifecycles return retained task state to zero.

## Gate 6 — Full hosted quality evidence is green

Frozen runtime `ca7d37c643adc4115b519148615f6120d03228df` passed hosted Check run `32395768383` on Node 24.19.0:

```text
699/699 tests
Benchmark 3: success
Benchmark Sample: success
```

The Phase-exit validation branch then passed Check run `32395959505` with:

```text
npm test
npm run benchmark
npm run benchmark:sample
npm run census
npm run hardening
```

All steps succeeded.

## Gate 7 — Content scale is measured honestly

Satisfied as an evidence gate; **mechanics-scale content readiness is not satisfied and is not required to close Phase 0.8**.

Current census:

| Metric | Current | Mechanics floor | Gap |
| --- | ---: | ---: | ---: |
| Places/localities | 26 | 10 | ready |
| Named NPCs | 12 | 50 | 38 |
| Shop/service sites | 17 | 20 | 3 |
| Creature definitions | 16 | 40 | 24 |
| Resource sources | 13 | 40 | 27 |
| Canonical items | 50 | 200 | 150 |
| Recipes/processes | 11 | 75 | 64 |
| Abilities/techniques | 5 | 100 | 95 |
| Quests/contracts | 8 | 30 | 22 |
| Companions | 1 | 4 | 3 |
| Transport services | 3 | 5 | 2 |

Supplemental evidence: 7 routes, 6 regional content packs, 80 pack-owned records, 11 runtime seed NPCs, and 13 runtime seed enemies.

The mechanics-scale gate is **NOT READY**. The largest relative gap is abilities/techniques. This is the intended strategic input to Phase 0.9 Content Scale Gate A, not a reason to manufacture filler before Phase 0.8 can close.

## Performance evidence

Benchmark 3 protocol remains unchanged; no hard thresholds are accepted.

Frozen-runtime validation sample medians/spreads from Check `32395768383`:

```text
player profiles  0.359735 ms/op    6.77%
enemy profiles   0.068665 ms/op    8.93%
basic attacks    0.001223 ms/op  172.92%
tick dispatch    0.000821 ms/op   27.23%
route lookup     0.007260 ms/op    6.40%
```

Phase-exit rerun `32395959505` also passed; its sample remained in the same qualitative envelope. The very fast attack/tick measurements remain noisy and are not release budgets.

## Phase 0.8 closure rule

Phase 0.8 is closed because:

1. all `0.8.100`–`0.8.900` player-facing tracks are landed on `main`;
2. cultivation, delegation and household/community work compose existing authorities without creating parallel clocks/task engines/progression systems;
3. the full current-schema suite, Benchmark 3, Benchmark Sample, census and hardening are green;
4. the census exposes the next strategic debt honestly;
5. there are no known Phase 0.8 runtime blockers.

## Next decision boundary

The next proposed phase is Phase 0.9 — Content Scale, Adventure Depth and Release Hardening. Its first proposed unit is `0.9.100 — Content Scale Gate A`.

**Do not start it automatically.** Opening Phase 0.9 requires a new explicit work order. At that boundary, also revisit the repository governance transition toward protected `main` and required green Check before high-volume content/release work accelerates.
