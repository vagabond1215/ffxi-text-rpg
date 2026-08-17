# Player Experience Upgrade Path

This document records the player-facing upgrade path that closed Phase 0.7. It is ordered by what a normal player must understand and accomplish, not by how many underlying engines exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Why am I here?** — the character has an origin-specific arrival circumstance and a first local connection.
2. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
3. **How does progress work?** — actions connect effort to persistent mastery, efficiency, capability, preparation, knowledge, or relationships.
4. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character's life.
5. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.
6. **What do I know and have ready?** — preparation, learned abilities/capabilities, acquired world knowledge, and useful local options are inspectable without command vocabulary.
7. **Who is traveling with me?** — an active companion is a persistent person whose preparation, condition, and choices matter beyond a single combat effect.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding or convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player-experience work targets the clean current model. Old local-save compatibility is not a Phase 0.7 design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

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

## Companion ordinary-play proof

Mara Venn remains one persistent NPC-backed character. Her existing party tactics record now carries a chosen **field approach** that matters before danger:

- **Guard the Road** — Mara keeps close and guarded, gaining evasion while giving up some attack. “Stay inside my reach. We get home together.”
- **Seek the Opening** — Mara looks for decisive angles, gaining attack while giving up some caution. “Hold their eye. I'll find the seam.”

The player changes the approach outside combat from the Character view. The choice survives real account save/load and canonical travel. Battle creation derives approach modifiers for Mara's battle entity without changing her permanent attributes. No companion XP track, summon system, second relationship registry, or universal party-AI framework was introduced.

`tests/playerCompanionLifeFlow.test.js` proves:

- Mara is the same backing NPC before and after travel;
- approach choice changes a real attack/evasion tradeoff;
- permanent attributes remain unchanged;
- changing approach during active combat is blocked;
- chosen approach survives real save/load;
- active-party/travel synchronization remains canonical.

## Character-POV and immersion audit

The browser and encounterable authored content were reviewed under one rule:

> Ordinary character-facing information should tell the player what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, roadmap, compatibility, raw state channels, hidden topology, and implementation rationale stay outside normal play.

The pass removed or replaced player-visible phrases such as raw task-channel labels, “fictional minutes,” “authored world,” roadmap/future placeholders, numeric danger values, and explanatory software-language around maps/services. Settlement, map, status, companion, place, and POI copy now favors present-world observations and decisions.

The Character view presents Mara with identity, lore description, location, condition, current approach, voiced intent, alternatives, and semantic party/preparation actions rather than raw tactic IDs.

`tests/playerPointOfViewPresentation.test.js` guards the primary Scene, Character, Spellbook, Journal, Codex, Craft, and World surfaces plus representative place/POI authored strings. `tests/playerFacingLanguage.test.js` continues to guard decision-first Journal/UI language.

## `0.7.400` promoted checkpoint

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

Benchmark 1:

```text
1,000 player combat profiles     470.213ms  0.470213ms/op
1,000 enemy combat profiles      124.768ms  0.124768ms/op
1,000 basic attacks              538.006ms  0.538006ms/op
10,000 ticks / 5 subscribers      50.197ms  0.005020ms/op
10,000 direct route lookups     8612.637ms  0.861264ms/op
```

Data advances to 31 for the canonical companion catalog and authored world/POI content changes. Game State remains 5 and Account Save remains 4 because field approach uses the existing party tactics record.

# Phase 0.7 closure audit

**Result: PASS — Phase 0.7 is complete at `0.7.400.1`.**

From a fresh/current-format save, the combined Phase 0.7 proofs satisfy the player-facing acceptance checks:

- one useful next action is obvious without command expertise;
- several competing ambitions are understandable;
- activities expose persistent character/world consequences;
- acquired knowledge remains distinct from hidden authored topology;
- save/load resumes without duplicated rewards, fares, trades, or progress;
- prior days and relationships alter later opportunities;
- combat/recovery returns to the same campaign;
- players can move among proving communities through semantic browser actions;
- returning to settlements provides trade, production, recovery, preparation, and social choices for another outing;
- core decision information can be inspected without command vocabulary;
- Mara remains the same persistent NPC-backed person and now creates a meaningful preparation decision outside a single automatic combat action;
- primary character-facing surfaces use immersive, present-world language and a simple decision-first hierarchy.

The alpha gate does not require every future life/adventure depth feature. The following remain deliberate later-phase breadth rather than Phase 0.7 blockers: broader companion dialogue/equipment/progression/goals, richer generic NPC/vendor voice, residual optional command adapters, safe-locality density refinement, original currency terminology, and authored paid/service-quality recovery.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, and similar presentation models are projections over canonical state, not second simulation authorities. Commitments, relationships, battle consequences, party state, recovery tasks, transport journeys, inventory, production, shops, resource opportunities, fictional time, and wallet ownership remain in their domain systems.

Phase 0.8 is planned but **must not begin automatically**. A new work order should choose its first bounded life/infrastructure track.
