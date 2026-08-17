# Player Experience Upgrade Path

This document records the player-facing upgrade path that closed Phase 0.7 and now guides bounded Phase 0.8 life/infrastructure work. It is ordered by what a normal player must understand and accomplish, not by how many engines exist.

## Player promise

A normal player should be able to answer from ordinary browser play:

1. **Who am I and what was I trained to do?**
2. **Why am I here and who can I trust first?**
3. **What can I do next without command expertise?**
4. **How does effort create persistent progress?**
5. **Why should I leave town, and why should I return?**
6. **What do I know, carry, and have prepared?**
7. **Who is traveling with me?**
8. **Why improve a home or foothold?**
9. **How should I prepare for travel constraints?** — storage and portable capacity should create visible choices rather than hidden or spoofable transport rules.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, construction currency, property timer, workstation registry, crafting engine, cargo wallet, or reward path that bypasses provenance.

## Pre-alpha rule

Target the clean current model. Old local-save compatibility is not a design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

# Phase 0.7 — complete

The player proof includes distinct origin footing, first-day opportunities, real field tools, regional livelihood/production, several-day NPC continuity, acquired-knowledge campaign readability, danger/combat/recovery, three community loops, semantic scheduled transport, settlement work/trade/recovery, semantic information access, and persistent companion preparation.

Carried-forward POV rule:

> Ordinary character-facing information tells the player what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state channels, hidden topology, and implementation rationale stay outside normal play.

Phase 0.7 closed at Product `0.7.400.1` and remains closed.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

```text
2 Resin-Sealed Hardwood Boards
1 Redstone Copper Ingot
30 minutes labor
  -> Storage Chest
  -> furnishing-backed storage 3 -> 8
```

The Journal exposes Plan → Set aside materials → Start work → Finish through canonical project, inventory, timed-task, furnishing, and save/load authority.

## `0.8.100.2` — onboarding/creator polish — complete

Light/Dark palettes, corrupt-save recovery, original-world creator randomization, truthful discipline previews/starter kits, and distinct authored origin arrivals are complete. Guided starter gear enters canonical carried inventory and is not auto-equipped.

## `0.8.200` — Home Workshop Capability — complete

```text
2 Resin-Sealed Hardwood Boards
1 Copper Trail Clasp
45 minutes labor
  -> Joiner's Workbench
  -> woodshop + workshop capability only while at home
```

The workbench adds no storage. It lets the existing production engine perform the existing Elderwood resin-board process at home through normal workstation resolution, fictional time, provenance, output, and crafting mastery. The ordinary **Work, Trade & Recover** surface exposes the choice; there is no home-only crafting menu.

Checkpoint `03ab71c7e96c54eaeffb75598ed01243fd390f21` — 506/506 tests, Benchmark 1, Product `0.8.200.1`, Data 34.

# `0.8.300` — Carried Load & Transport Logistics

**Implemented, audited, and closed.**

## Player-facing problem

Scheduled services had authored cargo allowances, but the browser/API could supply an arbitrary cargo number. A transport limit the player can bypass by sending `cargoUnits: 0` is not a real preparation decision.

## Bounded proof

The game now derives carried transport load from canonical occupied carried-inventory slots.

```text
25 carried slots
  -> Crown–Forge caravan limit 24
  -> boarding blocked before fare is charged
  -> leave one item in Home Safe
  -> carried load 24
  -> boarding becomes available
```

The service board and booking engine use the same underlying fact. The booking engine derives it independently, so a caller cannot spoof the UI payload. The booked journey stores the canonical load and survives save/load.

The player-facing consequence is useful: home storage is no longer only a capacity number. Leaving goods behind can be the difference between boarding and missing a service.

## What was deliberately not built

No item-mass simulation, encumbrance stat, cargo currency, warehouse ledger, or UI-owned logistics state. The current bounded contract measures occupied portable slots against the service allowance.

## Proof

Primary guard: `tests/playerTransportLogisticsFlow.test.js` plus canonical transport tests.

Promoted checkpoint:

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

# `0.8.400` — Portable Field Logistics

**Implemented, audited, and closed.**

## Player-facing problem

After `0.8.300`, leaving goods at home made transport capacity meaningful, but the main carried inventory remained the only ordinary portable space. The next question was whether the player could earn more field capacity **without** turning a portable bag into a cargo-limit exploit.

## Bounded proof: Make a Field Satchel

```text
2 Resin-Cured Hide Bindings
1 Copper Trail Clasp
30 minutes hands-on project labor
  -> Field Satchel unlocked
  -> 8 portable slots
```

The satchel uses the existing Home & Foothold semantic flow. The player invests ordinary production goods and fictional labor at their lodging; inventory authority then unlocks the existing portable container exactly once.

## The important logistics rule

```text
Inventory -> Field Satchel
  more usable distribution of portable space
  carried load unchanged

Field Satchel / Inventory -> Home Safe
  goods stop being portable
  carried load decreases
```

The player can therefore carry more kinds of equipment/materials during a field loop, but scheduled transport still sees everything physically carried. The satchel is capability, not a loophole.

## End-to-end proof

`tests/playerPortableFieldLogisticsFlow.test.js` verifies:

- Field Satchel begins locked and is visibly an 8-slot potential benefit;
- the Journal exposes semantic Plan → materials → work → finish actions;
- 2 hide bindings + 1 clasp are consumed through canonical project contribution;
- 30 minutes of project labor completes through the shared fictional-time/task path;
- the existing container unlock is applied exactly once;
- the unlock and contents survive real account save/load;
- moving a carried item into the satchel preserves total cargo;
- the satchel lets portable holdings exceed the main Inventory's 30 slots;
- a 31-unit load blocks the Crown–Forge service;
- moving seven goods to Home Safe reduces load to 24 while the satchel item still counts;
- the same service then boards and records cargo 24;
- state/home validation passes;
- player-facing Journal copy explains the cargo rule without exposing internal container/project IDs.

A briefly drafted standalone portable-logistics project/catalog was removed before validation because it duplicated existing home-infrastructure/project authority. The final implementation has one project authority and one inventory authority.

The first pre-promotion run exposed only a stale `0.8.100` completion-copy assertion. The chest behavior was unchanged; the regression now asserts the stable semantic fact instead of one historical sentence.

Promoted runtime checkpoint:

```text
d1a43568c5ca4dd7e57fb86316b422c35025ce07
Product 0.8.400.1
Package 0.8.400
Data 35
Account Save 4
Game State 5
Benchmark 1
```

Promoted Check `32080844409` succeeded, including both Test and Benchmark workflow steps. Exact test-count/timing lines are not claimed because they were not retained in the available connector evidence.

## Current Phase 0.8 boundary

`0.8.300` and `0.8.400` form a coherent logistics pair:

```text
home storage
  -> leave nonessential goods behind
  -> meet real transport limit

regional materials + home labor
  -> earn Field Satchel
  -> expand portable preparation space
  -> retain honest transport load
```

This work order stops here. Do **not** automatically open `0.8.500` or add more bags/warehouses merely to continue the theme.

A new bounded work order should re-audit one candidate family first:

- agriculture/stewardship;
- social schedules and relationship life;
- companion life breadth;
- earned automation;
- further logistics only if an existing concrete authority seam warrants it.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunities, and onboarding helpers are projections/adapters over canonical state. Projects, commitments, relationships, party state, recovery tasks, transport journeys, inventory/container state, production, workstations, resource opportunities, fictional time, wallet ownership, furnishings, storage capacity, carried load, and work mastery remain in their domain systems.
