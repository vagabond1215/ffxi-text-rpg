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
10. **When are people actually available?** — fictional time can make a named person's presence matter, and the browser should explain when to return instead of offering a dead social action.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, construction currency, property timer, workstation registry, crafting engine, cargo wallet, social clock, romance meter, or reward path that bypasses provenance/authority.

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

## `0.8.300` — Carried Load & Transport Logistics — complete

Scheduled transport now derives carried load from canonical occupied portable slots. A 25-slot carried load blocks the 24-unit Crown–Forge allowance before fare is charged; storing one good at home reduces load to 24 and makes the service boardable. Caller-supplied cargo numbers cannot spoof the booking engine.

Checkpoint `4f8c0de9e6ba926ee903f5787d34cca73c40eb6d` — 507/507 tests, Benchmark 1, Product `0.8.300.1`, Data 34.

## `0.8.400` — Portable Field Logistics — complete

```text
2 Resin-Cured Hide Bindings
1 Copper Trail Clasp
30 minutes project labor
  -> Field Satchel unlocked
  -> 8 portable slots
```

The satchel uses the existing Home & Foothold flow and canonical inventory container authority. Moving an item from Inventory to Field Satchel preserves carried transport load; moving portable goods into Home Safe reduces it. The player earns more portable preparation space without gaining a cargo-limit exploit.

Promoted checkpoint `d1a43568c5ca4dd7e57fb86316b422c35025ce07`; Product `0.8.400.1`, Package `0.8.400`, Data 35; Check `32080844409` Test and Benchmark steps succeeded.

# `0.8.500` — Daily Social Availability

**Implemented, audited, and closed.**

## Player-facing problem

Several-day commitments already made named NPCs persistent social anchors, but ordinary interactions treated a giver as perpetually available whenever their static NPC record was in the place. Fictional time therefore changed work, travel, recovery, transport, and day review while having no effect on when a person could actually be spoken to.

The bounded question was:

> Can one named NPC have a believable daily public-availability window, enforced consistently across semantic UI, command interaction, and commitment state, without creating a second clock or a broad NPC life simulator?

## Bounded proof: Sera Talwin's Southgate duty

```text
Sera Talwin
Thornwall Southgate
available 08:00–18:00 daily
```

At 08:00, Sera is present for ordinary interaction and **Sweetroot for Southgate** can be accepted. At 18:30, she is away from guide duty. The browser still tells the player that she is away and returns at 08:00, but it does not advertise a Talk or commitment action that will fail.

The distinction is deliberate: Sera's canonical persistent location is still Southgate. `0.8.500` models **when she is publicly available there**, not where she pathfinds during every hour of the day.

## One social-time authority

The player sees one rule because the runtime uses one rule:

- locality semantic interaction checks the schedule before moving/focusing the POI;
- command-path talk/POI interaction checks the same schedule;
- commitment acceptance, delivery resolution, and later follow-up check the same giver availability;
- Journal opportunities are derived from that state and lose their executable action while blocked;
- contextual Talk is omitted while the scheduled person is away;
- nearby/locality presentation keeps useful schedule/return information visible.

This prevents the UI from becoming a second social authority and prevents a command route from bypassing the browser rule.

## Fictional-time and save/load proof

The end-to-end loop is:

```text
Day 1 08:00
  Sera available
  -> talk works
  -> commitment action available

Day 1 18:30
  Sera away
  -> semantic talk blocked
  -> command talk blocked
  -> commitment accept blocked
  -> no hidden movement or time cost
  -> Journal says when to return

save/load
  -> world time remains 18:30
  -> no NPC schedule state was serialized
  -> availability re-derives as away

Day 2 08:00
  -> availability re-derives as present
  -> commitment acceptance succeeds
```

The schedule catalog itself is validated for stable NPC/POI/place references and well-formed daily windows. `tests/playerSocialScheduleFlow.test.js` is the primary end-to-end guard.

## What was deliberately not built

No romance system, appointment/calendar UI, schedule XP, separate social timer, wall-clock dependency, autonomous NPC pathfinding, multi-location daily routine, or mass-authored schedule coverage. The first schedule exists to prove the reusable authority seam; later breadth must earn its own player-facing reason.

## Promoted checkpoint

```text
fde1d30d76264ea25af6bad4d829545c488eec9b
509/509 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.500.1
Package 0.8.500
Data 36
Account Save 4
Game State 5
```

Benchmark 1:

```text
player combat profiles  0.367612 ms/op
enemy combat profiles   0.101654 ms/op
basic attacks            0.434260 ms/op
tick dispatch            0.004321 ms/op
direct route lookup      0.687768 ms/op
```

The first promoted validation exposed only a stale Phase 0.7 version assertion that froze the shared commitment subsystem at `0.2.0`. It was repaired to assert the historical minimum, consistent with other evolved shared authorities. No old player behavior was weakened.

## Current Phase 0.8 boundary

Tracks `0.8.300`–`0.8.500` now add three distinct life-preparation pressures without parallel management state:

```text
home storage
  -> prepare for real transport capacity

home labor + regional goods
  -> earn portable field space
  -> preserve honest cargo

fictional daily time
  -> named people have real availability
  -> plan social/commitment interactions around the day
```

This work order stops at closed `0.8.500`. Do **not** automatically open `0.8.600` or mass-author additional schedules.

A new bounded work order should re-audit one candidate family first:

- agriculture/stewardship;
- companion life breadth;
- earned automation;
- additional social-life breadth only where a concrete decision and existing authority path justify it;
- another life/logistics seam only when a specific current defect or opportunity warrants it.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunities, onboarding helpers, and social opportunity decoration are projections/adapters over canonical state. Projects, commitments, relationships, NPC schedule data/fictional time, party state, recovery tasks, transport journeys, inventory/container state, production, workstations, resource opportunities, wallet ownership, furnishings, storage capacity, carried load, and work mastery remain in their domain systems.
