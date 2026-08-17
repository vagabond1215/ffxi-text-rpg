# Player Experience Upgrade Path

This document defines the player-facing upgrade path for Phase 0.7. It is ordered by what a normal player must understand and accomplish, not by how many underlying engines exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Why am I here?** — the character has an origin-specific arrival circumstance and a first local connection.
2. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
3. **How does progress work?** — actions connect effort to persistent mastery, efficiency, capability, preparation, knowledge, or relationships.
4. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character’s life.
5. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.
6. **What do I know and have ready?** — preparation, learned abilities/capabilities, acquired world knowledge, and useful local options are inspectable without command vocabulary.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding or convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player-experience work targets the clean current model. Old local-save compatibility is not a Phase 0.7 design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

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

`0.7.100` closes at Product `0.7.100.1`, with 485/485 tests plus Benchmark 1 at runtime checkpoint `d15bd9517803faf6bceae5fb3376193648cca09d`.

# `0.7.200` — Settlement service and economy depth

**Status: implemented, audited, and closed.**

The active Craft surface is now **Work, Trade & Recover**. `settlementServiceBoardEngine` derives actual workshop, production, merchant, wallet, work-mastery, and recovery decisions from existing authorities. A Brasshaven/Redstone proof turns gathered ore into a process-vs-sell decision, persistent mastery/efficiency, finished-goods trade, preparation purchase, optional safe recovery, and save/load continuity. The same board discovers existing Thornwall, Brasshaven, and Mistmere facilities.

Product closes at `0.7.200.1`, Package `0.7.200`, with 487/487 tests and Benchmark 1 at runtime checkpoint `61c8c6c602bc71a4e7325d04b3e7698f669843c4`.

# `0.7.300` — Semantic information access and locality usability

**Goal:** let ordinary players inspect the information needed for a decision and use safe-locality options without knowing command vocabulary.

**Status: implemented, audited, and closed.**

## Known/current information contract

`playerInformationEngine` is a derived model. It reads existing authorities and exposes only information justified by the current character and current/acquired world state:

- accessible carried containers/items and current equipment;
- semantic equip/unequip actions when eligible;
- effective skills and learned character capabilities;
- learned spells/techniques and current readiness;
- acquired maps;
- visited atlas places;
- discovered named contacts/POIs;
- current safe-locality destinations and local actions;
- deterministic bounded search over the same set.

It does not persist a knowledge/search registry and does not enumerate hidden remote world content.

## Browser result

The core decision-information surfaces are now structured rather than command-backed:

- **Character** — resources/attributes plus Equipped, Carried, Skills, and Capabilities;
- **Spellbook** — actual learned spells/techniques, costs, activation time, cooldown/readiness, and semantic use;
- **Codex** — acquired maps, visited places, discovered contacts/POIs, and bounded search results;
- **World** — current safe-locality districts and local places/people with semantic actions, plus acquired maps;
- **Omnibox** — searches what the character currently knows or can do; `/` explicitly enters the optional command shell.

Safe settlements still omit wilderness D-pad/minimap controls. Wilderness exploration remains discovery-relative rather than replaced by settlement locality UI.

## Privacy proof

`tests/playerInformationAccess.test.js` starts from ordinary Thornwall state and proves:

- an acquired Thornwall map is visible while the Starfen map is not;
- Thornwall Southgate is visible as visited while West Starfen is not;
- current Sera Talwin is searchable and resolves to a semantic locality action;
- learned Ore Survey is searchable and resolves to the relevant information view;
- inaccessible Home Safe storage is not presented as carried-accessible inventory;
- **Tall Reedbed returns no search result before discovery**;
- the Character, Spellbook, Codex, and World core views do not require `data-command` buttons.

Search query state is transient UI state only; no Game State field was added.

## `0.7.300` closure

Product advances to **`0.7.300.1`** / Package **`0.7.300`**, codename **Semantic Information Access**. Account Save remains 4, Game State 5, Data 30, Benchmark 1.

Authoritative promoted runtime checkpoint:

```text
0f6af06ff8571658d51bc2be53112a50d51275cb
490/490 tests
Benchmark 1 success
```

Benchmark 1 at that checkpoint:

```text
1,000 player combat profiles     464.067ms  0.464067ms/op
1,000 enemy combat profiles      114.406ms  0.114406ms/op
1,000 basic attacks              543.591ms  0.543591ms/op
10,000 ticks / 5 subscribers      48.428ms  0.004843ms/op
10,000 direct route lookups     8693.735ms  0.869373ms/op
```

The track deliberately does not create a full natural-language agent, omniscient fuzzy search, universal command replacement, or second knowledge authority. Explicit `/` commands remain available as a power/diagnostic surface.

# Next Phase 0.7 bounded track — `0.7.400` companion life and party depth

The persistent NPC-backed companion foundation now needs a deeper ordinary-play proof.

First audit:

1. Mara's existing companion/NPC/relationship definition and state.
2. Recruitment, active join/leave, and current locality requirements.
3. Current battle contribution and tactical-role data.
4. Travel/recovery synchronization.
5. Companion equipment/progression/dialogue seams and current browser presentation.
6. Save/load coverage for recruited/active companion state and relationship consequences.

Choose one bounded multi-session loop in which an existing recruited companion creates a meaningful preparation, tactical, or social decision **outside a single automatic combat action**, the consequence persists, save/load resumes correctly, and the companion remains the same NPC-backed person through travel/community play.

Do not begin with a summon system, mass-authored companions, duplicate relationship/progression state, or a universal party-AI framework.

## Player-facing acceptance checks

For remaining Phase 0.7 work, evaluate from a fresh save:

- Is one useful next action obvious without command expertise?
- Are several competing ambitions understandable?
- Does each activity expose persistent character/world consequences?
- Does acquired knowledge remain distinct from hidden authored topology?
- Can save/load resume without duplicated rewards, fares, trades, or progress?
- Do prior days and relationships alter later opportunities?
- Does combat/recovery return to the same campaign?
- Can the player move among relevant communities through semantic browser actions?
- On return to settlement, are trade, production, recovery, preparation, and social choices useful enough to support another outing?
- Can core information needed for a decision be inspected without command vocabulary?
- When a companion is involved, do they remain the same persistent person rather than a temporary combat effect?

## Architecture rule

Player-experience guidance, service boards, and information/search models are projections over canonical state, not second simulation authorities. Commitments, relationships, battle consequences, party state, recovery tasks, transport journeys, inventory, production, shops, resource opportunities, fictional time, and wallet ownership remain in their domain systems; UI projections may summarize and expose semantic actions but may not secretly own those states.
