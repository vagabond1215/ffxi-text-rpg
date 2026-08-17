# Player Experience Upgrade Path

This document records the player-facing upgrade path that closed Phase 0.7 and now guides bounded Phase 0.8 life/infrastructure work. It is ordered by what a normal player must understand and accomplish, not by how many underlying engines exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Why am I here?** — the character has an origin-specific arrival circumstance and a first local connection.
2. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
3. **How does progress work?** — actions connect effort to persistent mastery, efficiency, capability, preparation, knowledge, relationships, or infrastructure.
4. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character's life.
5. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.
6. **What do I know and have ready?** — preparation, learned abilities/capabilities, acquired world knowledge, and useful local options are inspectable without command vocabulary.
7. **Who is traveling with me?** — an active companion is a persistent person whose preparation, condition, and choices matter beyond a single combat effect.
8. **Why improve a home or foothold?** — regional materials and fictional labor can become durable preparation advantages that reduce the burden of future journeys.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding or convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, construction currency, property timer, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player-experience work targets the clean current model. Old local-save compatibility is not a design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

# Completed Phase 0.7 sequence

## PX-1 — Arrival and footing

**Implemented and audited.** All three origins name the starting settlement, regional horizon, and a real first contact; new games begin at a believable morning hour; and the opening explains that the starting discipline is initial training rather than a permanent class identity.

## PX-2 — First-day actionable opportunities

**Implemented and audited.** The Journal projects real livelihood, training/danger, exploration/travel, and settlement/service preparation. All three origins can claim and equip a real starter field tool through semantic actions.

## PX-3 — First regional loop

**Implemented and audited.** Marshal Varric Stone and a Prospector Pick lead into Redstone Reach, timed copper gathering, return to Brasshaven, forge selection, copper-ingot processing, persistent work mastery, and a larger crafting horizon.

## PX-4 — Several fictional days of continuity

**Implemented and audited.** `Copper for the Ring` is canonical commitment state. Provenance-qualified delivery changes Varric's relationship, pays once, survives account save/load, and creates later-day follow-up.

## PX-5 — Multi-region campaign readability

**Implemented and audited.** Known opportunities are grouped by region/readiness without exposing hidden topology. Knowing why a distant region matters is distinct from knowing every route/resource site there.

## PX-6 — Danger, combat, and recovery

**Implemented and audited.** Redstone livelihood and danger compete in ordinary play. Combat rewards progression/currency once, physical creature material remains a separate recovery opportunity, and recovery/defeat consume canonical fictional time before the same campaign resumes.

## Player-language hygiene

**Implemented and audited.** Journal cards use character-facing motivation/blockers/actions; details are collapsible; completed entries recede; Day Review reads as memory rather than telemetry; ordinary player surfaces avoid implementation jargon.

## PX-7 — Second community breadth

**Implemented and audited.** Reader Soli Venn / `Marrowleaf for the Ward` proves Mistmere/Starfen several-day continuity while ordinary reed livelihood and Rootling danger remain independent choices.

## PX-8 — Third-origin continuity

**Implemented and audited.** Sera Talwin / `Sweetroot for Southgate` proves Thornwall/Elderwood several-day continuity while Amber Resin livelihood and Brush Hare danger remain independent choices.

## PX-9 — Cross-community rotation / `0.7.100`

**Implemented and audited.** `transportServiceBoardEngine` derives actual scheduled destinations, fares, cadence, next boardable departure, journey duration, and blockers from the existing route/service catalog and character state. The UI dispatches direct `transport.start`; transport authority still owns payment, cargo, fictional time, departure/arrival, and party movement.

`0.7.100` closed at Product `0.7.100.1` with 485/485 tests plus Benchmark 1.

# `0.7.200` — Settlement service and economy depth

**Implemented, audited, and closed.**

The active Craft surface became **Work, Trade & Recover**. `settlementServiceBoardEngine` derives actual workshop, production, merchant, wallet, work-mastery, and recovery decisions from existing authorities. A Brasshaven/Redstone proof turns gathered ore into a process-vs-sell decision, persistent mastery/efficiency, finished-goods trade, preparation purchase, optional safe recovery, and save/load continuity. The same board discovers existing Thornwall, Brasshaven, and Mistmere facilities.

# `0.7.300` — Semantic information access and locality usability

**Implemented, audited, and closed.**

`playerInformationEngine` is a derived model over existing authorities. It exposes only accessible carried/equipped preparation, effective skills, character-owned capabilities, learned abilities, acquired maps, visited places, discovered contacts/POIs, and currently actionable safe-locality choices.

Character, Spellbook, Codex, and World render those states directly. The omnibox searches what the character currently knows or can do; `/` explicitly enters the optional command shell. Search is bounded by acquired/current knowledge, so hidden places such as Tall Reedbed remain absent until learned or discovered.

# `0.7.400` — Companion life, party depth, and character POV

**Implemented, audited, and closed.**

Mara Venn remains one persistent NPC-backed character. Her existing party tactics record carries a chosen field approach that matters before danger:

- **Guard the Road** — favors evasion over attack. “Stay inside my reach. We get home together.”
- **Seek the Opening** — favors attack over caution. “Hold their eye. I'll find the seam.”

The choice survives real account save/load and canonical travel. Battle creation derives approach modifiers without changing permanent attributes. The Character view presents identity, lore description, location, condition, current approach, voiced intent, alternatives, and semantic party/preparation actions rather than raw tactic IDs.

The accompanying character-POV audit established the carried-forward rule:

> Ordinary character-facing information should tell the player what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, roadmap, compatibility, raw state channels, hidden topology, and implementation rationale stay outside normal play.

`tests/playerCompanionLifeFlow.test.js`, `tests/playerPointOfViewPresentation.test.js`, and `tests/playerFacingLanguage.test.js` guard this closure.

Promoted checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
495/495 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.7.400.1
Package 0.7.400
Data 31
```

# Phase 0.7 closure audit

**Result: PASS — Phase 0.7 is complete at `0.7.400.1`.**

The combined Phase 0.7 proofs satisfy the player-facing acceptance checks: clear next actions and competing ambitions, persistent consequences, acquired-knowledge privacy, deterministic save/load, social continuity, combat/recovery continuity, semantic movement among proving communities, useful settlement returns, inspectable preparation/knowledge, persistent companion life, and clean decision-first character-facing presentation.

Phase 0.7 remains closed as later phases extend shared authorities.

# Phase 0.8 — Life and infrastructure expansion — in progress

Phase 0.8 must deepen the persistent-life loop without turning the game into disconnected management menus. New property, workshop, agriculture, logistics, social-life, companion-life, and automation features must consume or extend real world resources, fictional time, skills, relationships, locations, and existing persistent authorities.

# `0.8.100` — Home Foothold & Infrastructure

**Implemented, audited, and closed.**

## Player-facing problem

Before this track, the character began with a home/storage concept, and the generic project engine already supported materials plus fictional labor, but ordinary play did not turn regional production into a visible durable home improvement. Home storage was a static starting convenience rather than a reason to bring useful goods back from the wider campaign.

## Bounded proof: Build a Storage Chest

The first improvement deliberately reuses existing material chains and furnishing authority:

```text
2 Resin-Sealed Hardwood Boards   <- Elderwood production
1 Redstone Copper Ingot          <- Redstone production
30 minutes hands-on labor        <- canonical project/timed-task substrate
                   |
                   v
Storage Chest furnishing         -> +5 furnishing-storage slots
```

A fresh character begins with Bronze Bed + Maple Table for 3 furnishing-storage slots. Completing the chest raises that existing capacity to 8 slots.

The Journal now includes a derived **Home & Foothold** group. The ordinary semantic sequence is:

```text
Plan
  -> Set aside available construction materials
  -> Start work
  -> Finish the active task
  -> see the completed furnishing and larger home-storage capacity
```

The player never needs a project ID, task channel, internal furnishing registry name, or command string.

## Authority and continuity proof

`homeInfrastructureEngine` is an adapter, not a new simulation authority. Generic projects own material/labor progress; inventory removes contributed goods; world time/timed tasks own the 30-minute duration; furnishing/inventory authority owns the actual capacity calculation; Journal/view state is derived.

The end-to-end regression proves:

- the authored home-infrastructure catalog validates against real canonical production items and furnishing IDs;
- contributed boards and copper leave carried inventory exactly once;
- an active home project survives real account save/load;
- canonical activity advance completes `project.labor` without a second clock;
- the Storage Chest furnishing is applied exactly once;
- repeated reconciliation cannot duplicate the benefit;
- home storage is 3 slots before and 8 after completion;
- completed infrastructure survives another real save/load;
- game-state/world-data validation remain clean;
- rendered Journal HTML exposes present-world lodging/material/storage language and not internal project/task/state identifiers.

`tests/playerHomeInfrastructureFlow.test.js` is the primary regression.

## `0.8.100` promoted checkpoint

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.100.1
Package 0.8.100
Data 32
Account Save 4
Game State 5
```

Benchmark 1:

```text
1,000 player combat profiles     466.332ms  0.466332ms/op
1,000 enemy combat profiles      108.813ms  0.108813ms/op
1,000 basic attacks              521.192ms  0.521192ms/op
10,000 ticks / 5 subscribers      48.255ms  0.004825ms/op
10,000 direct route lookups     8784.978ms  0.878498ms/op
```

Data advances to 32 because the canonical authored home-improvement definition and material-to-durable-benefit contract are new content. Game State and Account Save stay unchanged because the project metadata and completed furnishing fit existing persisted structures.

## Character-POV audit for `0.8.100`

The new home flow follows the Phase 0.7 POV boundary. Player text speaks about lodging, materials, hands-on work, the chest taking shape, and available storage. Internal terms such as `project.labor`, `completionApplied`, `homePlaceId`, internal project IDs, and the legacy internal `mogHouse` key are not rendered in normal Journal play.

The completed improvement remains simple to read: what was built, where it stands, and what practical capacity changed.

## Next Phase 0.8 boundary

`0.8.100` is complete, but Phase 0.8 is not. Do **not** automatically launch a broad property/farming/automation expansion. A new bounded work order should first select and audit one existing seam, such as workshop/home-production depth, agriculture/stewardship, logistics, social schedules/relationship life, companion life breadth, or earned automation.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunity models, and similar presentation layers are projections over canonical state, not second simulation authorities. Projects, commitments, relationships, party state, recovery tasks, transport journeys, inventory, production, shops, resource opportunities, fictional time, wallet ownership, and furnishing/storage capacity remain in their domain systems.
