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

- Prefer one explicit authority over compatibility-only bookkeeping.
- Break/reset a persisted schema when that materially simplifies the current design; version the new contract rather than carrying stale shapes forward by default.
- Keep a value derived when it is genuinely a projection of canonical state, not merely to avoid a schema bump.
- Add migrations only when they are deliberately useful, not as an automatic tax on pre-alpha iteration.

## PX-1 — First 30 minutes: arrival and footing

**Goal:** prevent the new character from being dropped into an unexplained sandbox.

Required experience:

- origin-specific opening prose names the starting settlement, regional horizon, and a real first contact;
- every normal new-game path starts at a believable morning hour owned by `gameState`;
- the Scene states the clearest next step while the character is still un-oriented;
- the origin contact is promoted to the first contextual action in the starting locality;
- speaking to that contact explains how combat training, livelihood work, exploration, and preparation create persistent progress;
- after the contact is met, guidance changes from one instruction to several non-exclusive paths;
- player-facing commission hooks use Hearth & Horizon canon and do not leak legacy world names or implementation-schema language.

**Implementation status: landed.** Orientation guidance is a pure projection over authoritative origin/place/POI discovery state; it is not persisted because persisting it would duplicate authority.

## PX-2 — First day: actionable opportunities

**Goal:** turn explanation into ordinary semantic UI actions.

The Journal/Opportunities presentation model answers:

- What can I pursue now?
- Why would I care?
- What preparation does it require?
- What persistent progress can it produce?

The first-day set includes viable paths supported by current regional authority: livelihood/material work, training/danger, exploration/travel, and settlement/service/social preparation. Buttons route through semantic gameplay intents; command adapters remain optional power/diagnostic surfaces rather than required player knowledge.

**Implementation status: landed.** `playerOpportunityEngine` owns the semantic opportunities projection, all three origins can claim/equip a real field tool through semantic actions, and the Journal renders only opportunities supported by current world/gameplay authority.

## PX-3 — First regional loop: leave, accomplish, return

**Goal:** prove one complete reason-to-travel loop.

A player should be able to:

```text
settlement contact/service
    -> choose a concrete goal
    -> prepare
    -> travel into the region
    -> work, gather, explore, or fight
    -> recover/produce something with provenance
    -> return
    -> resolve/trade/process/report
    -> see what persistent change now makes a larger ambition possible
```

Use the existing Phase 0.6 engines as authority. Add only missing reusable primitives demonstrated by a real slice.

**Implementation status: first bounded loop landed for Brasshaven.** The Journal guides an ordinary semantic flow from Marshal Varric Stone and a real Prospector Pick, through travel to Redstone Reach, timed copper gathering, return to Brasshaven, forge/workstation selection, and copper-ingot processing. The loop leaves provenance-bearing material plus persistent work mastery and points at the larger Copper Trail Clasp ambition, whose Starfen reed-fiber requirement creates a natural cross-regional horizon.

This proves the regional-loop shape; it does not by itself close the full `0.7.100` campaign slice.

## PX-4 — First several fictional days: continuity

**Goal:** make the world remember what the player did rather than resetting after each loop.

Required experience:

- a real commitment is canonical gameplay state rather than Journal-owned guidance;
- resolving it changes a persistent named-NPC relationship and owns its reward exactly once;
- material requirements preserve provenance all the way through delivery;
- the consequence survives a fictional day boundary and the real account save/load path;
- the next fictional day exposes changed follow-up from the same world character;
- the Journal/day review surfaces structured commitment and relationship consequences without parsing display prose;
- the follow-up competes with another valid use of character time rather than becoming a mandatory quest arrow.

**Implementation status: landed and audited.** The first continuity proof is `Copper for the Ring`, tied to Marshal Varric Stone and the completed Brasshaven -> Redstone Reach -> Brasshaven copper loop. `commitmentEngine` owns acceptance/resolution/follow-up and exactly-once rewards; `relationshipEngine` owns general NPC relationship dimensions; `playerContinuityEngine` projects commitment/day-review state into the Journal; semantic commitment intents reach canonical engines directly.

The audit also repaired two provenance seams that the slice exposed: same-ID inventory items with different provenance histories no longer merge into one stack, and commitment delivery consumes only the provenance-qualified stack(s) that satisfied its requirement. Top-level current-state/world validation now includes the commitment/relationship contracts, and focused tests exercise the real account save/load path plus next-day competing choices.

This remains deliberately small. It is **not** a universal numeric reputation framework, broad dialogue scheduler, or generalized quest graph. The first continuity projection is still Brasshaven/copper-specific; generalize only when another real slice proves the reusable shape.

## PX-5 — Multi-region campaign readability

**Goal:** preserve clarity as known opportunities and continuity span multiple regions.

The Journal/Opportunities layer ranks and groups **known** opportunities without becoming an omniscient quest list. What can be surfaced derives from canonical player/world knowledge such as:

- discovered places, routes, POIs, maps, and regional horizons;
- persistent contacts and relationship/commitment state;
- current equipment, capabilities, materials, work mastery, and preparation;
- actually reachable travel/service context;
- prior discoveries and completed regional work.

The player should be able to maintain several short-term goals while understanding their relationship to larger ambitions: better livelihood, deeper training, stronger equipment, broader routes, social standing, companions, infrastructure, and dangerous expeditions.

**Implementation status: landed and audited.** `playerCampaignReadabilityEngine` is a pure presentation decorator over the existing opportunity/continuity model. It adds regional grouping, readiness ordering, knowledge-source metadata, group counts, and one bounded cross-region Copper Trail Clasp proof. The semantic DOM Journal renders those groups as actual sections rather than one flat card list.

The Brasshaven/Redstone/Starfen proof now behaves as acquired knowledge rather than developer omniscience:

- before Varric’s canonical later-day follow-up, the Journal does not manufacture a Starfen campaign lead merely because Starfen data exists;
- after the follow-up, Starfen becomes a known larger ambition while the remote Tall Reedbed/source record remains hidden;
- Brasshaven Market Ring exposes the next local action to Iron Quay, not every route node at once;
- at Iron Quay, the existing Forge–Mere caravan is surfaced through the semantic `transport.start` intent only when its real fare is affordable;
- immediately after PX-4, Varric’s 36-gil reward is insufficient for the 52-gil fare, so the Journal honestly reports a blocked route instead of inventing free transport;
- from Mistmere Reedport, the real route into West Starfen becomes actionable;
- only after arriving in Starfen does the local Tall Reedbed become visible, at which point the existing cutting-tool requirement remains authoritative.

This PX-5 layer does not persist a campaign-readability registry, add a global quest database, reveal hidden topology, or advance Data beyond 28. It composes canonical locality, transport, travel, inventory/equipment, commitment/relationship, ecology, work, production, and map knowledge.

## PX-6 — Danger, combat, and recovery in the ordinary campaign

**Goal:** make danger part of the same sustained life/adventure loop instead of a detached combat demonstration.

**Next bounded implementation target:** use the existing Brasshaven/Redstone/Starfen corridor to prove one ordinary-player sequence where a meaningful field threat interrupts or competes with livelihood/travel goals, Combat 2.0 resolves through normal semantic UI, victory/defeat has real recovery/resource consequences, and the character can resume the persistent campaign afterward without a second clock or duplicate reward path.

The first proof should reuse currently authored regional enemies, companions, resource-recovery opportunities, settlement recovery/services, canonical fictional time, and exactly-once battle rewards. Do not broaden enemy catalogs, add a parallel encounter campaign system, or mass-author dungeons merely to close the slice.

Before closing `0.7.100`, PX-6 must demonstrate that livelihood, travel, commitment/relationship continuity, multi-region readability, danger, combat, and recovery can coexist in one ordinary current-version campaign flow.

## Player-facing acceptance checks

For each future Phase 0.7 slice, evaluate from a fresh save rather than from test fixtures alone:

- Does the player know why the character is currently here?
- Is one useful next action obvious without opening help or knowing commands?
- Are at least two alternative ambitions understandable after the first orientation step?
- Does the game explain what an activity improves, not merely what button starts it?
- When an activity completes, is the persistent consequence legible?
- Does the next opportunity arise from acquired world knowledge/state rather than developer omniscience?
- Can the current-version save/load loop resume without duplicating rewards, contacts, or progress?
- Across days, does prior activity change what people or places offer?
- As regions accumulate, can the player distinguish ready, preparatory, distant, blocked, and completed goals without seeing undiscovered content?
- When danger appears, does combat/recovery return the player to the same continuous-character campaign rather than a disconnected mode?

## Architecture rule

Player-experience guidance is a **projection over canonical state**, not a second simulation authority.

Current projections derive from canonical origin/place/POI discovery, progression, work, travel/transport, equipment, map knowledge, commitments, relationships, day-cycle state, and acquired campaign context. Real commitments and relationship consequences are canonical gameplay state with semantic events and exactly-once ownership; the Journal may summarize, group, or rank them but must not secretly own them.
