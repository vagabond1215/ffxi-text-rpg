# Player Experience Upgrade Path

This document defines the player-facing upgrade path for Phase 0.7. It is ordered by what a normal player must understand and accomplish, not by how many underlying engines exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Why am I here?** — the character has an origin-specific arrival circumstance and a first local connection.
2. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
3. **How does progress work?** — actions connect effort to persistent mastery, efficiency, capability, preparation, knowledge, or relationships.
4. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character’s life.
5. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding layer may create a parallel quest clock, hidden teleport graph, omniscient map, duplicate progression counter, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player-experience work targets the clean current model. Old local-save compatibility is not a Phase 0.7 design requirement.

- Prefer one explicit authority over compatibility-only bookkeeping.
- Break/reset a persisted schema when that materially simplifies the current design; version the new contract deliberately.
- Keep a value derived when it is genuinely a projection of canonical state.
- Add migrations only when deliberately useful.

## PX-1 — First 30 minutes: arrival and footing

**Goal:** prevent the new character from being dropped into an unexplained sandbox.

**Status: implemented and audited.** All three origins name the starting settlement, regional horizon, and a real first contact; normal new games begin at a believable morning hour; the contact is the first semantic action; and the opening explains that the starting discipline is initial training rather than a permanent class identity.

## PX-2 — First day: actionable opportunities

**Goal:** turn explanation into ordinary semantic UI actions.

**Status: implemented and audited.** The Journal projects real livelihood, training/danger, exploration/travel, and settlement/service preparation from current world state. All three origins can claim and equip a real starter field tool through semantic actions. Commands remain optional power/diagnostic surfaces.

## PX-3 — First regional loop: leave, accomplish, return

**Goal:** prove one complete reason-to-travel loop.

```text
settlement contact/service
    -> concrete goal
    -> preparation
    -> regional travel
    -> work / gather / explore / fight
    -> recover or produce something
    -> return
    -> resolve / process / report
    -> larger ambition
```

**Status: implemented and audited for the first bounded Brasshaven loop.** Marshal Varric Stone and a Prospector Pick lead into Redstone Reach, timed copper gathering, return to Brasshaven, forge selection, copper-ingot processing, persistent work mastery, and the Copper Trail Clasp horizon.

## PX-4 — First several fictional days: continuity

**Goal:** make the world remember what the player did.

**Status: implemented and audited.** `Copper for the Ring` is canonical commitment state. Provenance-qualified delivery changes Varric’s persistent relationship, pays once, survives real account save/load, and creates changed later-day follow-up. The audit also repaired provenance-safe stack identity and provenance-qualified delivery consumption.

## PX-5 — Multi-region campaign readability

**Goal:** keep goals understandable as known opportunities span regions without exposing undiscovered world data.

**Status: implemented and audited.** `playerCampaignReadabilityEngine` remains a pure projection. It groups known opportunities by region/readiness, preserves acquired-knowledge privacy, and exposes only currently usable route/service actions. The Brasshaven -> Mistmere -> Starfen horizon distinguishes knowing *why* Starfen matters from knowing every route or resource site there.

PX-6 repaired region precedence so explicit truthful current-context `regionLabel` metadata wins over fallback origin inference.

## PX-6 — Danger, combat, and recovery in the ordinary campaign

**Goal:** make danger part of the same persistent life/adventure loop rather than a detached combat demonstration.

**Status: implemented and audited.** The Redstone Burrower competes with copper livelihood in ordinary Journal play. Encounter, Attack, abilities, and Wait are semantic actions; victory rewards EXP/currency exactly once; physical creature material remains a separate defeated-body recovery opportunity; field/safe-locality/defeat recovery consumes canonical fictional time; and defeat retreats the active party to known safety with partial rather than free full restoration.

## Player-language hygiene pass — completed before PX-7

A character-POV audit formalized the player-language boundary:

- internal opportunity `reason` remains diagnostic/model metadata and is **not rendered** as player prose;
- Journal cards lead with what is happening, character-facing motivation, blockers, and an action;
- progress/requirements live behind a collapsible **Details** disclosure;
- completed entries visually recede and suggested actionable entries are emphasized;
- Day Review renders structured history as character memory rather than event telemetry;
- ordinary Spellbook, Codex, Craft, continuity, readability, and aftermath prose avoids developer jargon.

`tests/playerFacingLanguage.test.js` guards this boundary.

## PX-7 — Second community breadth

**Goal:** prove that several-day social/livelihood/danger continuity works in another real community before generalizing it.

**Status: implemented and audited.** Reader Soli Venn / `Marrowleaf for the Ward` provides the Mistmere/Starfen proof. The player can meet Soli, accept the request, travel Canal Ward -> Reedport -> West Starfen, choose among Marrowleaf gathering, ordinary reed livelihood, or Rootling danger, return with provenance-qualified material, resolve exactly once, save/load, advance to a later fictional day, and receive changed Soli follow-up.

PX-7 proved that `playerContinuityEngine` can project **all actually known commitment definitions** rather than carrying a Varric-only branch. Commitment definitions can require provenance-qualified raw gathered resources or transformed goods while gathering/travel/relationship engines remain authority.

Data advanced to **29** for the second authored community/commitment contract. Account Save 4 and Game State 5 remained valid.

## PX-8 — Third-origin continuity / Thornwall-Elderwood breadth

**Goal:** prove the generic community-continuity contract in the remaining origin without collapsing ordinary livelihood and danger into one quest breadcrumb.

**Status: implemented and audited.** Sera Talwin is now a persistent Thornwall NPC-backed contact and `Sweetroot for Southgate` creates the third several-day community proof.

### Third-community proving loop

```text
meet Sera Talwin at Thornwall Southgate
    -> claim/equip the existing Field Knife
    -> accept Sweetroot for Southgate
    -> travel to West Elderwood
    -> choose among:
         Sera's Sweetroot request
         ordinary Amber Resin livelihood
         Brush Hare danger/training
    -> gather 2 provenance-qualified Elderwood Sweetroot
    -> return to Southgate
    -> deliver to Sera
    -> receive 20 gil + familiarity/respect exactly once
    -> real account save/load
    -> advance one fictional day
    -> real save/load again
    -> Sera remembers the work and points back toward resin work, Brush Hares, and deeper Elderwood choices
```

The slice deliberately uses **Sweetroot**, not Amber Resin. Amber Resin was already Thornwall’s ordinary livelihood route, so making the community request consume the same activity would have reduced the region to one breadcrumb. Sweetroot already had canonical West Elderwood provenance plus food/medicine/trade sinks, making it a legitimate community need without creating a quest-token resource.

PX-8 required no new quest, reputation, travel, day, or save-state framework. The generic commitment/relationship/gathering/travel/day/save-load authorities from PX-7 handled the third community unchanged.

Data advances to **30** because Sera becomes a persistent authored NPC-backed contact and a third canonical commitment definition is added. `COMMITMENT_CATALOG_VERSION` remains 2 because the catalog shape does not change. Account Save 4 and Game State 5 remain unchanged.

Authoritative PX-8 runtime checkpoint:

```text
63a234edfc1e327d90823c4171bdf315f01aa044
484/484 tests
Benchmark 1 success
Data 30
```

Benchmark 1 at that checkpoint:

```text
1,000 player combat profiles     400.261ms  0.400261ms/op
1,000 enemy combat profiles      104.237ms  0.104237ms/op
1,000 basic attacks              509.356ms  0.509356ms/op
10,000 ticks / 5 subscribers      50.139ms  0.005014ms/op
10,000 direct route lookups     7969.682ms  0.796968ms/op
```

## `0.7.100` closure audit after PX-8

**Result: still open, for one concrete ordinary-player blocker.**

PX-8 closes the third-origin/community continuity gap. The world graph itself is connected:

```text
Thornwall Rivergate
    -> Timbercross Landing
    -> Brasshaven Iron Quay
    -> Mistmere Reedport
    -> West Starfen
```

The route/transport engines already own the Crown–Forge and Forge–Mere scheduled services, fares, cadence, cargo, departure, arrival, fictional time, and interruption behavior. `domApp` can also execute semantic `transport.start` when a view model supplies it.

However, **generic Travel Desk interaction is not yet an executable browser transport surface**. `poiEngine` still tells the player that travel-service behavior is not implemented for ordinary travel POIs. PX-5 exposed one specific Forge–Mere caravan action through the Copper Trail readability proof, but that special acquired-knowledge path does not make Thornwall -> Brasshaven -> Mistmere rotation generically semantic.

That violates the `0.7.100` exit promise that a normal player can sustain repeated play across several connected communities without command/API expertise. The product version therefore remains `0.6.900.1`.

## Next bounded unit — PX-9 cross-community rotation / `0.7.100` gate

Do **not** begin by adding another community or mass-authoring more commitments. The next unit should repair the remaining access seam:

1. derive scheduled services available from the player’s current real route stop;
2. expose destination, fare, timing/readiness, and blockers through player-facing Travel Desk/context UI;
3. dispatch existing semantic `transport.start` rather than routing a command string;
4. prove Thornwall -> Brasshaven -> Mistmere (and return as appropriate) through ordinary browser interaction using canonical locality + scheduled transport authority;
5. preserve acquired-knowledge privacy, fare/cargo/time rules, companion travel, and save/load continuity;
6. re-run the complete `0.7.100` exit audit immediately after that proof.

A richer Craft surface, deeper paid service economy, and broader companion content remain worthwhile later work, but they are not substitutes for fixing the current cross-community transport-access blocker.

## Player-facing acceptance checks

For each remaining Phase 0.7 slice, evaluate from a fresh save:

- Does the player know why the character is here?
- Is one useful next action obvious without help or command knowledge?
- Are at least two alternative ambitions understandable after orientation?
- Does the UI explain what an activity changes in character/world terms rather than implementation terms?
- When an activity completes, is the persistent consequence legible?
- Does the next opportunity arise from acquired knowledge rather than developer omniscience?
- Can current-version save/load resume without duplicating rewards, contacts, or progress?
- Across days, does prior activity change what people or places offer?
- Can the player distinguish ready, preparatory, distant, blocked, and completed goals without seeing undiscovered content?
- Does combat/recovery return to the same continuous-character campaign?
- Across communities, are there multiple valid reasons to revisit, redirect, and prepare the same character?
- Can the player actually move among those communities through semantic browser actions rather than merely because the route graph exists internally?

## Architecture rule

Player-experience guidance is a **projection over canonical state**, not a second simulation authority.

Current projections derive from canonical origin/place/POI discovery, progression, work, travel/transport, equipment, map knowledge, commitments, relationships, day-cycle state, acquired campaign context, injury state, and actual defeated-body resource opportunities. Real commitments, relationships, battle consequences, recovery tasks, transport journeys, and resource opportunities remain canonical gameplay state; the Journal/UI may summarize, group, rank, and expose semantic actions but may not secretly own them.
