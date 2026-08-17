# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions: `docs/DEVELOPMENT_DIRECTION.md`, `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`, `docs/VERSIONING_AND_RELEASE_ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, and `docs/THREAD_HANDOFF.md`.

## Current baseline

```text
Product:       0.8.400.1
Package:       0.8.400
Account Save:  4
Game State:    5
Data:          35
Benchmark:     1
Codename:      Portable Field Logistics
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4–0.7 are complete. Phase 0.8 — Life and infrastructure expansion is in progress. `0.8.100`, `0.8.200`, `0.8.300`, and `0.8.400` are complete and audited.**

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

Campaign guidance reflects acquired knowledge. Resources preserve provenance. Projects, inventory, transport, production, relationships, party state, and fictional time remain canonical authorities; Journal/service/information/home models remain projections or bounded adapters. Legacy FFXI-derived material is research/reference/migration material only.

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

Scheduled transport already had real cargo allowances, but its UI/API accepted caller-supplied cargo numbers. That was an authority defect: a caller could claim zero cargo even while carrying a full pack.

`carriedLoadEngine` now derives transport load from canonical carried inventory. `transportServiceBoardEngine` and `transportEngine` consume the same derived fact; caller-provided cargo is ignored. Capacity is checked before fare deduction, and the booked journey records the actual load.

The proving loop is:

```text
25 occupied carried slots
  -> Crown–Forge caravan allowance 24 blocks boarding
  -> store one item in Home Safe
  -> carried load becomes 24
  -> same service becomes boardable
  -> fake caller cargo values cannot bypass or inflate the result
  -> save/load preserves the booked canonical load
```

This makes home storage a real travel-preparation decision without introducing weight simulation, a cargo wallet, or UI-owned logistics state.

Authoritative runtime checkpoint:

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

Benchmark 1:

```text
player combat profiles  0.492450 ms/op
enemy combat profiles   0.117547 ms/op
basic attacks            0.588062 ms/op
tick dispatch            0.005528 ms/op
direct route lookup      0.902781 ms/op
```

## `0.8.400` — Portable Field Logistics — complete

The next adjacent logistics track adds one earned portable-capacity improvement without undermining `0.8.300` cargo honesty.

**Make a Field Satchel**:

```text
2 Resin-Cured Hide Bindings
1 Copper Trail Clasp
30 minutes canonical project labor
  -> unlock Field Satchel
  -> 8 portable slots
```

The satchel reuses the existing home-infrastructure/project/timed-task path. Inventory remains authority for container unlock, access, capacity, and transfer. The same Home & Foothold Journal exposes Plan → Set aside materials → Start work → Finish.

Crucially, every authored portable container marked as carried cargo contributes its occupied slots to `carriedLoadEngine`. Moving an item from Inventory to Field Satchel therefore **does not reduce transport load**. Only leaving goods in non-carried home storage reduces load. This preserves the preparation tradeoff while allowing longer field loops.

The end-to-end regression proves construction, exactly-once unlock, 8-slot portable expansion, Inventory→Satchel load conservation, load reduction through Home Safe only, transport blocking/unblocking, save/load, validation, and player-facing copy without internal container IDs.

Authoritative promoted runtime checkpoint:

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Product 0.8.400.1
Package 0.8.400
Data 35
Account Save 4
Game State 5
Benchmark 1
```

Promoted Check run `32080844409` completed successfully; both the **Test** and **Benchmark** workflow steps succeeded. The exact test-count/timing lines were not retained in the available connector evidence, so this document does not invent them.

Data advances `34 -> 35` for the canonical Field Satchel home-improvement/container semantics and the Resin-Cured Hide Binding construction sink. Game State remains 5 because the track reuses existing project records and the existing container `unlocked` field. Account Save remains 4.

### `0.8.400` closure audit

**PASS.** Portable space is earned through real materials and fictional time, survives save/load, applies exactly once, remains subject to canonical inventory rules, and cannot be used to falsify transport cargo. The first pre-promotion run exposed only a stale historical chest-copy assertion; the semantic contract remained intact and the assertion was repaired without weakening gameplay behavior.

## Next Phase 0.8 boundary

This work order stops at closed `0.8.400`. **Do not automatically begin `0.8.500` or continue logistics merely because adjacent work exists.** The next work order should re-audit one bounded Phase 0.8 seam against existing authorities.

Strong candidate families now are:

- agriculture/stewardship;
- social schedules and relationship life;
- companion life breadth;
- earned automation;
- a new logistics segment only if a concrete existing authority seam justifies it.

# Later phases

## 0.9 — Adventure depth and release hardening

Difficult regions/dungeons, advanced combat/abilities, high-level economy/production, UI/accessibility, persistence hardening, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, performant, and supported by enough interconnected content for sustained play.
