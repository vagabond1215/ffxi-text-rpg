# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.500.1
Package:       0.8.500
Account Save:  4
Game State:    5
Data:          36
Benchmark:     1
Codename:      Daily Social Availability
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4–0.7 are complete. Phase 0.8 — Life and infrastructure expansion is in progress. Tracks `0.8.100` through `0.8.500` are complete and audited.**

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Projects, inventory, transport, production, commitments, relationships, party state, NPC schedules, and fictional time remain canonical authorities; Journal/service/information/home/social presentation remains derived or bounded adapters. Legacy FFXI-derived material is research/reference/migration material only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics | **Complete** |
| `0.7` | Multi-region playable alpha | **Complete** |
| `0.8` | Life and infrastructure expansion | **In progress** |
| `0.9` | Adventure depth and release hardening | Planned |
| `1.0` | Live foundation | Planned |

# Phase 0.7 — complete

The multi-region playable-alpha proof covers Thornwall/Elderwood, Brasshaven/Redstone Reach, and Mistmere/Starfen; persistent community continuity; livelihood/production/mastery; danger/combat/recovery; acquired-knowledge readability; semantic transport and settlement services; semantic information access; persistent companion preparation; and deterministic save/load.

Final Phase 0.7 checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
Benchmark 1 success
Product 0.7.400.1
Data 31
```

Later shared-authority work does not reopen Phase 0.7.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

**Build a Storage Chest** consumes 2 Resin-Sealed Hardwood Boards, 1 Redstone Copper Ingot, and 30 minutes of canonical project labor, then places the Storage Chest exactly once and raises furnishing-backed home storage from 3 to 8 slots.

Original checkpoint: `0b9251a43285443087050127da36b977cabdf7ee` — 496/496 tests, Benchmark 1, Product `0.8.100.1`, Data 32.

`0.8.100.2` subsequently closed onboarding/creator polish: Light/Dark palettes, corrupt-save deletion/reset, original-world randomization, truthful discipline previews/starter kits, and distinct authored origin arrivals. Checkpoint `0f00ef68a01ad001063803d67ff0efffc48ab3ef` — 505/505 tests, Benchmark 1, Data 33.

## `0.8.200` — Home Workshop Capability — complete

**Build a Joiner's Workbench** consumes 2 Resin-Sealed Hardwood Boards, 1 Copper Trail Clasp, and 45 minutes of project labor. The zero-storage furnishing grants `woodshop`/`workshop` context only while the character is physically at home. The existing production engine can then run the existing Resin-Sealed Hardwood Board recipe there, preserving normal fictional time, provenance, output, and crafting mastery.

Checkpoint `03ab71c7e96c54eaeffb75598ed01243fd390f21` — 506/506 tests, Benchmark 1, Product `0.8.200.1`, Data 34.

## `0.8.300` — Carried Load & Transport Logistics — complete

Scheduled transport cargo is now derived from canonical carried inventory rather than caller/UI payload. `carriedLoadEngine`, `transportServiceBoardEngine`, and `transportEngine` share the same derived fact; booking checks allowance before fare deduction and records actual load. Home storage therefore creates a real travel-preparation choice.

Checkpoint:

```text
4f8c0de9e6ba926ee903f5787d34cca73c40eb6d
507/507 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.300.1
Package 0.8.300
Data 34
```

## `0.8.400` — Portable Field Logistics — complete

**Make a Field Satchel** consumes 2 Resin-Cured Hide Bindings, 1 Copper Trail Clasp, and 30 minutes of project labor, then unlocks the existing 8-slot portable Field Satchel exactly once. Inventory remains authority for unlock/access/capacity/transfer.

Every unlocked portable container marked as carried cargo contributes occupied slots to `carriedLoadEngine`. Moving goods from Inventory to Field Satchel preserves total transport load; only leaving goods in non-carried home storage reduces it.

Promoted runtime checkpoint:

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Product 0.8.400.1
Package 0.8.400
Data 35
Check 32080844409 SUCCESS
```

## `0.8.500` — Daily Social Availability — complete

This track makes one existing named relationship/commitment loop respect **fictional daily availability** without creating a second social clock or autonomous NPC simulator.

The first authored schedule is Sera Talwin at Thornwall Southgate:

```text
Sera Talwin
Southgate guide duty
available daily 08:00–18:00
```

`npcScheduleEngine` derives whether Sera is publicly available from canonical `state.worldTime`; no schedule registry is persisted. The authored schedule cross-links one canonical NPC, POI, place, and recurring daily window and has its own catalog validator.

One schedule authority is consumed by all relevant interaction seams:

- semantic locality/POI interaction checks availability before moving or discovering the POI;
- command-path POI talk/action checks the same schedule;
- commitment accept, resolve, and follow-up use the same giver-availability check;
- locality/browser presentation keeps the person/place visible with away/return-time information;
- contextual Talk and Journal commitment actions are suppressed while the giver is unavailable rather than advertising actions the domain engine will reject.

The proving loop is:

```text
08:00 Southgate
  -> Sera available
  -> Talk / commitment interaction available

18:30 Southgate
  -> Sera away
  -> semantic and command talk blocked
  -> Journal action blocked with “returns 08:00” guidance
  -> commitment acceptance blocked by domain authority
  -> no hidden movement or time cost

save/load at 18:30
  -> fictional time persists
  -> no schedule state is serialized
  -> availability re-derives as away

next day 08:00
  -> availability re-derives as present
  -> commitment acceptance succeeds
```

This is deliberately **public availability at a static canonical NPC location**, not multi-location NPC pathfinding. Sera's persistent NPC location remains Southgate; the schedule says when she is available there. Romance systems, a general appointment calendar, mass NPC scheduling, and autonomous daily movement remain outside this bounded track.

Data advances `35 -> 36` because the canonical authored NPC-schedule catalog is new. Account Save remains 4 and Game State remains 5 because availability is derived from already-persisted fictional time. Benchmark remains 1 because the workload/protocol is unchanged.

Authoritative promoted runtime checkpoint:

```text
fde1d30d76264ea25af6bad4d829545c488eec9b
509/509 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.500.1
Package 0.8.500
Data 36
```

Benchmark 1:

```text
player combat profiles  0.367612 ms/op
enemy combat profiles   0.101654 ms/op
basic attacks            0.434260 ms/op
tick dispatch            0.004321 ms/op
direct route lookup      0.687768 ms/op
```

The first promoted validation exposed one stale Phase 0.7 version ceiling requiring `commitments` to remain exactly `0.2.0`. That historical assertion now checks a compatible minimum, matching the established rule that later shared-authority revisions do not reopen a closed phase. No Phase 0.7 gameplay contract was weakened.

### `0.8.500` closure audit

**PASS.** Daily social availability is driven by canonical fictional time, is not persisted redundantly, is enforced by both semantic and command/domain interaction paths, survives save/load through re-derivation, and is visible in ordinary browser decisions without creating a parallel social simulation.

## Next Phase 0.8 boundary

This work order stops at closed `0.8.500`. **Do not automatically begin `0.8.600` or mass-author schedules.** A new work order should re-audit one bounded Phase 0.8 seam against existing authorities.

Strong candidate families now are:

- agriculture/stewardship;
- companion life breadth;
- earned automation;
- additional social-life breadth only when a concrete player decision and authority path justify it;
- another life/logistics segment only when a specific existing seam warrants it.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
