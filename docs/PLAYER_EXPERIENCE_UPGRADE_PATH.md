# Player Experience Upgrade Path

This document records the player-facing upgrade path that closed Phase 0.7 and now guides bounded Phase 0.8 life/infrastructure work. It is ordered by what a normal player must understand and accomplish, not by how many underlying engines exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Who am I, and what was I trained to do?** — ancestry, sex, origin, and starting discipline communicate concrete level-1 differences without pretending the discipline is a permanent class.
2. **Why am I here?** — the character has an origin-specific arrival circumstance and a credible first local connection.
3. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
4. **How does progress work?** — actions connect effort to persistent mastery, efficiency, capability, preparation, knowledge, relationships, or infrastructure.
5. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character's life.
6. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.
7. **What do I know and have ready?** — preparation, learned abilities/capabilities, acquired world knowledge, and useful local options are inspectable without command vocabulary.
8. **Who is traveling with me?** — an active companion is a persistent person whose preparation, condition, and choices matter beyond a single combat effect.
9. **Why improve a home or foothold?** — regional materials and fictional labor become durable preparation advantages that can increase capacity or move useful work closer to home.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding or convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, construction currency, property timer, workstation registry, crafting engine, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player-experience work targets the clean current model. Old local-save compatibility is not a design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

# Completed Phase 0.7 sequence

Phase 0.7 is complete. Its combined player proof includes distinct origin footing, first-day opportunities, real field tools, regional livelihood/production loops, several-day named-NPC continuity, acquired-knowledge campaign readability, danger/combat/recovery, three community loops, semantic scheduled transport, settlement work/trade/recovery, semantic information access, and persistent companion preparation.

The carried-forward character-POV rule is:

> Ordinary character-facing information should tell the player what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, roadmap, compatibility, raw state channels, hidden topology, and implementation rationale stay outside normal play.

Phase 0.7 closed at Product `0.7.400.1`. Later shared-authority revisions do not reopen it.

# Phase 0.8 — Life and infrastructure expansion — in progress

Phase 0.8 must deepen the persistent-life loop without turning the game into disconnected management menus. New property, workshop, agriculture, logistics, social-life, companion-life, and automation features must consume or extend real world resources, fictional time, skills, relationships, locations, and existing persistent authorities.

# `0.8.100` — Home Foothold & Infrastructure

**Implemented, audited, and closed.**

The first improvement, **Build a Storage Chest**, reuses existing Elderwood/Redstone material chains plus canonical project labor:

```text
2 Resin-Sealed Hardwood Boards
1 Redstone Copper Ingot
30 minutes hands-on labor
  -> Storage Chest furnishing
  -> furnishing-backed home storage 3 -> 8 slots
```

The Journal exposes a semantic Plan → Set aside materials → Start work → Finish sequence. Project, inventory, timed-task, furnishing, and save/load authorities remain canonical.

Original promoted checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
Benchmark 1 success
Product 0.8.100.1
Data 32
```

## `0.8.100.2` — onboarding and character-creation polish

**Implemented, audited, and closed as a revision of `0.8.100`.**

The active browser now has deliberate Light/Dark palettes; corrupt character saves can be removed by registry ID and local data can be reset; creator randomization uses original-world ancestry/sex-aware names; the six starting disciplines expose truthful mechanics and real carried starter gear; and Thornwall, Brasshaven, and Mistmere have distinct authored arrival scenes.

Guided starter gear enters canonical inventory and is not auto-equipped. Generic low-level `createNewGameState()` remains neutral. No manual visual-browser walkthrough is claimed by repository evidence.

Promoted checkpoint:

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
Benchmark 1 success
Product 0.8.100.2
Data 33
```

# `0.8.200` — Home Workshop Capability

**Implemented, audited, and closed.**

## Player-facing problem

After `0.8.100`, the home could hold more material, but infrastructure still did not change **where useful work could happen**. Production remained dependent on public workshop context even after the player had invested in a durable foothold.

The bounded question for `0.8.200` was therefore:

> Can one real home improvement convert regional goods and fictional labor into an existing production capability, so the character can prepare closer to home without creating a second crafting/property system?

## Bounded proof: Build a Joiner's Workbench

The authored improvement consumes goods already produced by ordinary play:

```text
2 Resin-Sealed Hardwood Boards
1 Copper Trail Clasp
45 minutes hands-on project labor
  -> Joiner's Workbench furnishing
  -> woodshop + workshop capability while physically at home
```

The workbench contributes **zero storage slots**. It is not an upgraded chest or a generic stat bonus. Its persistent value is a place-bound workstation capability.

Before completion, Thornwall home cannot satisfy the `woodshop` requirement for **Seal Elderwood Hardwood Board**. After the workbench is placed, the same existing production definition becomes available there:

```text
1 Elderwood Hardwood
1 Elderwood Amber Resin
woodshop required
240 fictional seconds at crafting proficiency 0
  -> 1 Resin-Sealed Hardwood Board
  -> +2 crafting proficiency
  -> canonical transformation/input/place provenance
```

The ordinary **Work, Trade & Recover** browser surface discovers this choice. No home-only crafting screen or recipe list is necessary.

## Why the loop matters

The player-facing result is not merely “house stat +1.” It follows the project law directly:

```text
travel / gather / produce
  -> invest regional goods at home
  -> build durable workshop capability
  -> perform future woodshop work at home
  -> gain normal crafting mastery
  -> spend less future travel on basic preparation
  -> support larger ambitions
```

The benefit remains spatially honest. The workbench's tags count only when the character is at their actual home locality. Leaving home removes that station context until the character returns.

## Authority and continuity proof

The track deliberately reuses existing systems:

- generic projects own material contribution, build state, labor, and generic completion;
- canonical world time/timed tasks own the 45-minute build and production duration;
- furnishings own the durable placed workbench;
- `workstationEngine` owns station availability and derives the home furnishing's tags;
- `productionEngine` owns recipe requirements, atomic inputs, output, provenance, and crafting proficiency;
- the settlement service board and Journal are projections only.

The end-to-end regression proves:

- the workbench is unavailable as a station before it is built;
- 2 boards + 1 clasp leave carried inventory exactly once through project contribution;
- an active build survives real account save/load;
- canonical activity advancement completes the 45-minute labor task;
- the Joiner's Workbench is placed exactly once;
- repeated reconciliation cannot duplicate it;
- home storage remains 3 slots when only the workbench is added;
- `woodshop` and `workshop` tags become available only at home;
- the existing resin-board recipe becomes semantically executable through **Work, Trade & Recover**;
- production consumes real raw inputs and 240 fictional seconds;
- output has canonical process/input/place provenance;
- crafting proficiency gains +2 through the normal mastery engine;
- final furnishing, crafted output, mastery, and world time survive another real save/load;
- game-state/home validation and player-facing HTML hygiene remain clean.

Primary guard: `tests/playerHomeWorkshopFlow.test.js`.

## Follow-up audit and repairs

The first full integration run exposed one stale historical test that treated `settlementServiceBoard` version 1 as a permanent ceiling. The Phase 0.7 gate was repaired to assert historical minimums for later shared-authority systems rather than preventing their evolution.

The resource-lifecycle audit also found that two goods already consumed by infrastructure did not advertise that use in authored sink metadata. The current contract explicitly records:

```text
Resin-Sealed Hardwood Board  -> construction
Redstone Copper Ingot        -> construction
Copper Trail Clasp           -> construction
```

A first promoted `0.8.200.1` head then exposed a stale pipeline-version assertion still pinned to `0.8.100.2`. That release-contract test was synchronized to the deliberate Product/Data/subsystem/database versions. Neither failure required weakening runtime behavior.

## Promoted checkpoint

```text
03ab71c7e96c54eaeffb75598ed01243fd390f21
506/506 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.200.1
Package 0.8.200
Data 34
Account Save 4
Game State 5
```

Benchmark 1:

```text
player combat profiles  0.465527 ms/op
enemy combat profiles   0.117252 ms/op
basic attacks            0.550132 ms/op
tick dispatch            0.004497 ms/op
direct route lookup      0.870861 ms/op
```

## `0.8.200` closure audit

**PASS.** A home investment now creates real place-bound production capability, the existing crafting/mastery/provenance loop consumes it without parallel state, save/load is durable, and the previous storage track remains valid.

## Next Phase 0.8 boundary

`0.8.200` is complete, but Phase 0.8 is not. Do **not** automatically add several more workshop furnishings or a tiered property tree. A new bounded work order should first select and audit one next seam, such as:

- agriculture/stewardship;
- logistics/warehousing/transport capacity;
- social schedules and relationship life;
- companion life breadth;
- earned automation.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunity models, onboarding helpers, and similar presentation layers are projections/adapters over canonical state, not second simulation authorities. Projects, commitments, relationships, party state, recovery tasks, transport journeys, inventory, production, workstations, resource opportunities, fictional time, wallet ownership, furnishings, storage capacity, and work mastery remain in their domain systems.
