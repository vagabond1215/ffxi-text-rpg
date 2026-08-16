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

**Status: implemented and audited.** All three origins name the starting settlement, regional horizon, and a real first contact; normal new games begin at a believable morning hour; the contact is the first semantic action; and the opening explains that the starting discipline is initial training rather than a permanent class identity.

## PX-2 — First day: actionable opportunities

**Status: implemented and audited.** The Journal projects real livelihood, training/danger, exploration/travel, and settlement/service preparation from current world state. All three origins can claim and equip a real starter field tool through semantic actions. Commands remain optional power/diagnostic surfaces.

## PX-3 — First regional loop: leave, accomplish, return

**Status: implemented and audited.** Marshal Varric Stone and a Prospector Pick lead into Redstone Reach, timed copper gathering, return to Brasshaven, forge selection, copper-ingot processing, persistent work mastery, and the Copper Trail Clasp horizon.

## PX-4 — First several fictional days: continuity

**Status: implemented and audited.** `Copper for the Ring` is canonical commitment state. Provenance-qualified delivery changes Varric’s persistent relationship, pays once, survives real account save/load, and creates changed later-day follow-up. The audit also repaired provenance-safe stack identity and provenance-qualified delivery consumption.

## PX-5 — Multi-region campaign readability

**Status: implemented and audited.** `playerCampaignReadabilityEngine` remains a pure projection. It groups known opportunities by region/readiness, preserves acquired-knowledge privacy, and exposes only currently usable route/service actions. The Brasshaven -> Mistmere -> Starfen horizon distinguishes knowing *why* Starfen matters from knowing every route or resource site there.

PX-6 repaired region precedence so explicit truthful current-context `regionLabel` metadata wins over fallback origin inference.

## PX-6 — Danger, combat, and recovery in the ordinary campaign

**Status: implemented and audited.** The Redstone Burrower competes with copper livelihood in ordinary Journal play. Encounter, Attack, abilities, and Wait are semantic actions; victory rewards EXP/currency exactly once; physical creature material remains a separate defeated-body recovery opportunity; field/safe-locality/defeat recovery consumes canonical fictional time; and defeat retreats the active party to known safety with partial rather than free full restoration.

## Player-language hygiene pass — completed before PX-7

A character-POV audit formalized the player-language boundary:

- internal opportunity `reason` remains diagnostic/model metadata and is not rendered as player prose;
- Journal cards lead with character-facing motivation, blockers, and an action;
- progress/requirements live behind a collapsible **Details** disclosure;
- completed entries recede and suggested actionable entries are emphasized;
- Day Review renders structured history as character memory rather than event telemetry;
- ordinary Spellbook, Codex, Craft, continuity, readability, and aftermath prose avoids developer jargon.

`tests/playerFacingLanguage.test.js` guards this boundary.

## PX-7 — Second community breadth

**Status: implemented and audited.** Reader Soli Venn / `Marrowleaf for the Ward` provides the Mistmere/Starfen proof. The player can meet Soli, accept the request, travel Canal Ward -> Reedport -> West Starfen, choose among Marrowleaf gathering, ordinary reed livelihood, or Rootling danger, return with provenance-qualified material, resolve once, save/load, advance to a later fictional day, and receive changed Soli follow-up.

PX-7 proved that `playerContinuityEngine` can project all actually known commitment definitions rather than carrying a Varric-only branch. Data advanced to 29 for the second authored community/commitment contract.

## PX-8 — Third-origin continuity / Thornwall-Elderwood breadth

**Status: implemented and audited.** Sera Talwin is a persistent Thornwall NPC-backed contact and `Sweetroot for Southgate` creates the third several-day community proof.

```text
meet Sera Talwin at Thornwall Southgate
    -> accept Sweetroot for Southgate
    -> travel to West Elderwood
    -> choose among Sweetroot work, Amber Resin livelihood, or Brush Hare danger
    -> gather 2 provenance-qualified Elderwood Sweetroot
    -> return and deliver
    -> receive 20 gil + familiarity/respect once
    -> save/load
    -> later fictional day
    -> save/load again
    -> changed Sera follow-up
```

Sweetroot was deliberately chosen instead of Amber Resin so community work and ordinary livelihood remain independent choices. Data advanced to 30 because Sera and the third canonical commitment are new authored content; the commitment schema remained v2 and Game State remained 5.

## PX-9 — Cross-community rotation / `0.7.100` gate

**Goal:** make the already-connected scheduled transport graph usable through ordinary browser play instead of relying on a campaign-specific travel hint or command/API knowledge.

**Status: implemented and audited.** `transportServiceBoardEngine` is a derived service-board projection over the existing route/transport catalog and current character state. It does not own routes, bookings, fares, clocks, or persisted journey state.

At a real serviced stop it derives only the scheduled destinations actually reachable from that stop and presents:

- service and destination;
- fare and current-funds blocker;
- cadence and next boardable departure;
- journey duration;
- cargo/activity/travel blockers;
- a direct semantic `transport.start` action.

`transportEngine` remains canonical authority for fare deduction, boarding lead, cadence, cargo, fictional time, scheduled task/interrupt behavior, departure/arrival, and active-party movement. Travel POIs describe the same service board rather than claiming scheduled service is unimplemented.

### Cross-community proving loop

```text
Thornwall Southgate
    -> Crownward -> Rivergate
    -> Crown-Forge Caravan
    -> Brasshaven Iron Quay
    -> Forge-Mere Caravan
    -> Mistmere Reedport
    -> save/load and reorient
    -> Forge-Mere Caravan back to Brasshaven
    -> Crown-Forge Caravan back to Thornwall
```

The PX-9 regression proves the real 60-gil Rivergate -> Brasshaven fare, the real 52-gil Brasshaven -> Mistmere fare, fare ownership exactly once per booking, save/load during a scheduled journey, correct service choices at each stop, canonical return travel, and no leak of hidden remote resource topology.

No Data bump accompanies PX-9 because no route, service, POI, resource, or other authored world contract changed. No Game State bump is required because the board is recomputed from existing state rather than persisted.

## `0.7.100` closure audit

**Closed.** The bounded playable-campaign slice now satisfies its ordinary-player gate across PX-1 through PX-9:

- all three origins have arrival/first-contact footing;
- several competing livelihood, social, preparation, exploration, and danger goals are legible;
- Brasshaven/Redstone livelihood-production and combat/recovery loops are executable;
- Thornwall, Brasshaven, and Mistmere have persistent several-day named-community continuity;
- community delivery uses real provenance-bearing resources and one-time reward ownership;
- acquired-knowledge Journal/readability does not expose hidden topology;
- scheduled transport now provides generic semantic rotation across the connected proving communities;
- current-version account save/load survives social continuity, day transitions, physical aftermath, and scheduled travel;
- companion, shop, production, travel, combat, and recovery authorities compose with the same continuous character.

Product advances to **`0.7.100.1`** / Package **`0.7.100`**, codename **Playable Campaign Slice**. This closes the first Phase 0.7 track; **Phase 0.7 itself remains in progress**.

Authoritative promoted runtime checkpoint:

```text
d15bd9517803faf6bceae5fb3376193648cca09d
485/485 tests
Benchmark 1 success
Data 30
```

Benchmark 1 at that checkpoint:

```text
1,000 player combat profiles     439.616ms  0.439616ms/op
1,000 enemy combat profiles      116.070ms  0.116070ms/op
1,000 basic attacks              504.204ms  0.504204ms/op
10,000 ticks / 5 subscribers      48.633ms  0.004863ms/op
10,000 direct route lookups     8064.154ms  0.806415ms/op
```

## Next Phase 0.7 bounded track — `0.7.200` settlement service and economy depth

The next track should deepen repeated settlement usefulness now that the campaign can rotate among communities. It should begin with an audit rather than mass-authored content.

Priority questions:

1. Which existing shops, recovery services, workstations, and production sinks already have authority but weak browser presentation?
2. Where do characters make meaningful spend/save/process/recover decisions after returning from the field?
3. Can the Craft browser become a real production-choice surface using existing production/workstation authority rather than a second recipe system?
4. If priced recovery/service quality is added, can it use the same wallet, fictional-time, and service rules rather than a free parallel rest mechanic?
5. Which additional economic/social alternatives create repeated reasons to revisit communities without turning Phase 0.7 into property/infrastructure work that belongs in 0.8?

Do not begin `0.7.200` by mass-generating shops, recipes, or services. Close one reusable settlement-service/economic loop first.

## Player-facing acceptance checks

For each remaining Phase 0.7 slice, evaluate from a fresh save:

- Is one useful next action obvious without command expertise?
- Are several competing ambitions understandable?
- Does each activity expose persistent character/world consequences?
- Does acquired knowledge remain distinct from hidden authored topology?
- Can save/load resume without duplicated rewards, contacts, fares, or progress?
- Do prior days and relationships alter later opportunities?
- Does combat/recovery return to the same campaign?
- Can the player move among relevant communities through semantic browser actions?
- On return to settlement, are trade, production, recovery, training, and social choices useful enough to support another outing?

## Architecture rule

Player-experience guidance and service boards are projections over canonical state, not second simulation authorities. Commitments, relationships, battle consequences, recovery tasks, transport journeys, inventory, production, resource opportunities, fictional time, and wallet ownership remain in their domain systems; UI projections may summarize and expose semantic actions but may not secretly own those states.
