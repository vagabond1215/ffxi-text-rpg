# Player Experience Upgrade Path

This document defines the player-facing upgrade path for Phase 0.7. It is intentionally ordered by what a normal player must understand and accomplish, not by how many underlying engines already exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Why am I here?** — the character has an origin-specific arrival circumstance and a first local connection.
2. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
3. **How does progress work?** — actions visibly connect effort to persistent mastery, efficiency, capability, preparation, knowledge, or relationships.
4. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character’s life.
5. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding layer may create a parallel quest clock, hidden teleport graph, omniscient map, duplicate progression counter, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player experience work targets the clean current game model. Old local-save compatibility is not a Phase 0.7 design requirement.

- Prefer one explicit authority over lazy compatibility state or duplicate bookkeeping.
- Break/reset a persisted schema when that materially simplifies the current design; version the new contract rather than carrying stale shapes forward by default.
- Keep a value derived when it is genuinely a projection of canonical state, not merely to avoid a schema bump.
- Add migrations only when they are deliberately useful, not as an automatic tax on pre-alpha iteration.

## PX-1 — First 30 minutes: arrival and footing

**Goal:** prevent the new character from being dropped into an unexplained sandbox.

Required experience:

- origin-specific opening prose names the starting settlement, regional horizon, and a real first contact;
- every normal new-game path starts at a believable morning hour owned by `gameState`, rather than an unexplained world-time epoch or a UI-specific default;
- the Scene itself states the clearest next step while the character is still un-oriented;
- the origin contact is promoted to the first contextual action in the starting locality;
- speaking to that contact explains, in setting-friendly terms, how combat training, livelihood work, exploration, and preparation create persistent progress;
- after the contact is met, guidance changes from a single instruction to several non-exclusive paths;
- player-facing commission hooks use Hearth & Horizon canon and do not leak legacy world names or implementation-schema language.

**Implementation status:** landed as the first `0.7.100` in-progress slice. Orientation guidance is a pure projection over authoritative origin/place/POI discovery state; it is not persisted because persisting it would duplicate authority.

## PX-2 — First day: actionable opportunities

**Goal:** turn explanation into ordinary semantic UI actions.

Add a dedicated Journal/Opportunities presentation model that answers:

- What can I pursue now?
- Why would I care?
- What preparation does it require?
- What persistent progress can it produce?

The first-day set should include at least one viable path in each category that the current region actually supports: livelihood/material work, training/danger, exploration/travel, and settlement/service/social preparation. Buttons should route through semantic gameplay intents; command adapters remain optional power/diagnostic surfaces rather than required player knowledge.

Do not present unavailable future systems as clickable promises. A commission should either be a real trackable commitment or clearly remain an unposted/informal lead.

**Implementation status:** landed. `playerOpportunityEngine` now owns a dedicated semantic opportunities projection, the Journal renders actionable opportunity cards, all three origins can claim and equip a real field tool through semantic actions, and first-day livelihood/training/exploration/service paths are surfaced only when supported by current world/gameplay authority. The Journal no longer depends on a flat command catalog for this flow.

## PX-3 — First regional loop: leave, accomplish, return

**Goal:** prove one complete reason-to-travel loop.

A player should be able to:

```text
settlement contact/service
    -> accept or choose a concrete goal
    -> prepare
    -> travel into the region
    -> work, gather, explore, or fight
    -> recover/produce something with provenance
    -> return
    -> resolve/trade/process/report
    -> see what persistent change now makes a larger ambition possible
```

Use the existing Phase 0.6 engines as authority. Add only the missing reusable commitment/opportunity primitives demonstrated by this slice.

**Implementation status:** first bounded loop landed for Brasshaven. The Journal can guide an ordinary semantic flow from Marshal Varric Stone and a real Prospector Pick, through travel to Redstone Reach, timed copper gathering and activity completion, return to Brasshaven, forge/workstation selection, and copper-ingot processing. The loop leaves provenance-bearing material plus persistent work mastery, then points at the larger Copper Trail Clasp ambition rather than issuing a disconnected reward. This proves the regional-loop shape; it does **not** close the full `0.7.100` campaign slice or establish general tracked contracts/reputation by itself.

## PX-4 — First several fictional days: continuity

**Goal:** make the world feel inhabited rather than reset after each loop.

Add persistent NPC follow-up, lightweight reputation/relationship consequences, repeatable or changing local needs, day-review surfacing of gains and new opportunities, recovery costs, and reasons to choose between competing uses of character time.

Earlier chores should already begin becoming easier or more skippable through earned mastery, tools, route knowledge, or services.

**Next bounded implementation target:** anchor the first continuity proof to the completed Brasshaven regional loop. Add only the smallest reusable canonical social/follow-up state needed to remember an NPC/community consequence across a day boundary, surface that consequence through Journal/day-review semantic presentation, and prove that a changed local need or follow-up competes with another valid use of character time. Do not invent a parallel quest clock or broad reputation framework before the slice proves its requirements.

## PX-5 — Multi-region campaign readability

**Goal:** preserve clarity as choice count grows.

The Journal/Opportunities layer should rank and group known opportunities without becoming an omniscient quest list. Regional knowledge, contacts, maps, reputation, travel access, and prior discoveries determine what can be surfaced.

The player should be able to maintain several short-term goals while understanding their relationship to larger ambitions: better livelihood, deeper training, stronger equipment, a broader route network, social standing, companions, property/infrastructure, and dangerous expeditions.

## Player-facing acceptance checks

For each future Phase 0.7 slice, evaluate from a fresh save rather than from test fixtures alone:

- Does the player know why the character is currently here?
- Is one useful next action obvious without opening help or knowing commands?
- Are at least two alternative ambitions understandable after the first orientation step?
- Does the game explain what an activity improves, not merely what button starts it?
- When an activity completes, is the persistent consequence legible?
- Does the next opportunity arise from world knowledge/state rather than developer omniscience?
- Can the current-version save/load loop resume without duplicating rewards, contacts, or progress?

## Architecture rule

Player-experience guidance is a **projection over canonical state**, not a second simulation authority.

The first implementation follows that rule by deriving orientation from:

- chosen origin / existing player identity;
- the canonical starting place;
- existing POI identity and discovery state;
- current locality/exploration context;
- existing progression, work, travel, equipment, and map laws.

When later work needs real commitments or contracts, those should be canonical gameplay state with semantic events and exactly-once reward ownership. The guidance layer may summarize that state; it must not secretly own it.