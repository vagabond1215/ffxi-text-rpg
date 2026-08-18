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
9. **How should I prepare for travel constraints?** — storage and portable capacity create visible choices rather than hidden or spoofable transport rules.
10. **When are people actually available?** — fictional time can make a named person's presence matter, and the browser explains when to return instead of offering a dead social action.
11. **What happens when someone traveling with me is too hurt to continue?** — safety, fictional time, recovery, and explicit reunion should form one understandable loop rather than strand the companion permanently.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, construction currency, property timer, workstation registry, crafting engine, cargo wallet, social clock, romance meter, companion recovery clock, or reward path that bypasses provenance/authority.

## Pre-alpha rule

Target the clean current model. Old local-save compatibility is not a design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

# Phase 0.7 — complete

The player proof includes distinct origin footing, first-day opportunities, real field tools, regional livelihood/production, several-day NPC continuity, acquired-knowledge campaign readability, danger/combat/recovery, three community loops, semantic scheduled transport, settlement work/trade/recovery, semantic information access, and persistent companion preparation.

Carried-forward POV rule:

> Ordinary character-facing information tells the player what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state channels, hidden topology, and implementation rationale stay outside normal play.

Phase 0.7 closed at Product `0.7.400.1` and remains closed.

# Phase 0.8 — Life and infrastructure expansion — in progress

## `0.8.100` — Home Foothold & Infrastructure — complete

2 Resin-Sealed Hardwood Boards + 1 Redstone Copper Ingot + 30 minutes labor → Storage Chest → furnishing-backed storage 3→8. The Journal exposes Plan → materials → work → finish through canonical project/inventory/time/furnishing authority.

## `0.8.100.2` — onboarding/creator polish — complete

Light/Dark palettes, corrupt-save recovery, original-world creator randomization, truthful discipline previews/starter kits, and distinct authored origin arrivals are complete.

## `0.8.200` — Home Workshop Capability — complete

2 Resin-Sealed Hardwood Boards + 1 Copper Trail Clasp + 45 minutes labor → Joiner's Workbench → `woodshop`/`workshop` capability at home. Existing production, time, provenance, and crafting mastery remain authoritative.

Checkpoint `03ab71c7e96c54eaeffb75598ed01243fd390f21` — 506/506 tests, Benchmark 1, Product `0.8.200.1`, Data 34.

## `0.8.300` — Carried Load & Transport Logistics — complete

Scheduled transport derives carried load from canonical occupied portable slots. Home storage can reduce a real transport load; caller-supplied cargo cannot spoof the service.

Checkpoint `4f8c0de9e6ba926ee903f5787d34cca73c40eb6d` — 507/507 tests, Benchmark 1, Product `0.8.300.1`, Data 34.

## `0.8.400` — Portable Field Logistics — complete

2 Resin-Cured Hide Bindings + 1 Copper Trail Clasp + 30 minutes project labor → Field Satchel unlocked → 8 portable slots. Inventory→Field Satchel preserves carried transport load; portable goods→Home Safe reduces it.

Promoted checkpoint `d1a43568c5ca4dd7e57fb86316b422c35025ce07`; Product `0.8.400.1`, Data 35; Check `32080844409` Test and Benchmark steps succeeded.

## `0.8.500` — Daily Social Availability — complete

Sera Talwin is publicly available at Thornwall Southgate from 08:00–18:00 daily. At 18:30 semantic talk, command talk, and commitment interaction are all blocked by the same fictional-time schedule authority while the browser retains useful return-time guidance. Save/load stores world time, not schedule state; next-day 08:00 restores availability.

Promoted checkpoint `fde1d30d76264ea25af6bad4d829545c488eec9b` — 509/509 tests, Benchmark 1, Product `0.8.500.1`, Data 36.

# `0.8.600` — Companion Convalescence

**Implemented, audited, and closed.**

## Player-facing problem

A persistent companion can be injured in real combat. Before this track, a 0-HP companion who stopped traveling with the player could become stuck: the reunion action correctly refused a downed companion, but settlement recovery restored only the active party.

The bounded question was:

> Can an injured companion be left somewhere safe, recover through the same fictional-time rest already used by the player, and rejoin explicitly afterward without a separate companion-healing system?

## Bounded proof: Mara rests in Southgate

```text
Mara downed
  -> reach Thornwall Southgate
  -> Part ways here succeeds because the settlement is safe
  -> Mara remains recruited and physically in Southgate
  -> Travel together is unavailable at 0 HP

healthy player chooses Rest in safety
  -> existing settlement recovery task starts
  -> 60 fictional minutes pass
  -> Mara reaches full HP/MP
  -> Mara remains inactive
  -> Travel together reappears
  -> player explicitly reunites with Mara
  -> save/load preserves recovery and party state
```

The player does not need to be injured for the rest choice to matter. If a nearby recruited companion needs recovery, the settlement recovery model truthfully exposes that reason.

## Safety matters

A downed companion cannot simply be abandoned in dangerous wilderness. Trying to part ways with 0-HP Mara in West Elderwood is rejected before party membership or companion location changes.

That gives safe settlements a concrete companion-life role: they are places where an injured traveling companion can stop, convalesce, and later rejoin.

## One recovery authority

The player sees one rest action because the runtime uses one recovery system:

```text
field recovery
  player + active companions

defeat recovery
  player + active companions

settlement recovery
  player + active companions + inactive recruited companions present here
```

No passive wall-clock healing, companion-only timer, recovery currency, duplicate HP state, or autonomous companion schedule was added. Settlement recovery still consumes exactly 3600 canonical fictional seconds through the existing timed-task/activity path.

Recovery also does not decide party membership. Healing an inactive Mara does not silently make her active again; the player still chooses **Travel together** afterward.

## Browser/domain agreement

While Mara is downed and inactive at the current settlement, the Character surface shows her persisted HP/location but suppresses the impossible **Travel together** action. After recovery the same action reappears because party authority will accept it again.

This keeps presentation useful without making it authoritative.

## End-to-end proof

`tests/playerCompanionRecoveryFlow.test.js` verifies safe separation, zero-HP reunion blocking, no dead browser reunion action, healthy-player settlement rest for an injured inactive companion, exact one-hour fictional time, full recovery without implicit membership change, explicit reunion, save/load, validation, and atomic wilderness separation blocking.

## Promoted checkpoint

```text
04211e8909996b1ac34fa91ae1cdd7aa216b86f8
511/511 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.600.1
Package 0.8.600
Data 36
Account Save 4
Game State 5
```

Benchmark 1:

```text
player combat profiles  0.436701 ms/op
enemy combat profiles   0.102201 ms/op
basic attacks            0.519382 ms/op
tick dispatch            0.005689 ms/op
direct route lookup      0.810038 ms/op
```

## Current Phase 0.8 boundary

The recent tracks now add distinct life-preparation pressures through existing authorities:

```text
home storage
  -> prepare for transport capacity

home labor + regional goods
  -> earn portable field space

fictional daily time
  -> plan around named-person availability

companion injury + safe settlement
  -> decide where to stop, recover, and reunite
```

This work order stops at closed `0.8.600`. Do **not** automatically open `0.8.700` or add passive companion recovery/routines.

A new bounded work order should re-audit one candidate family first:

- agriculture/stewardship;
- earned automation;
- further companion/social-life breadth only where a concrete decision and existing authority path justify it;
- another life/logistics seam only when a specific current defect or opportunity warrants it.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunities, onboarding helpers, and social opportunity decoration are projections/adapters over canonical state. Projects, commitments, relationships, NPC schedule data/fictional time, party state, campaign recovery, transport journeys, inventory/container state, production, workstations, resource opportunities, wallet ownership, furnishings, storage capacity, carried load, and work mastery remain in their domain systems.
