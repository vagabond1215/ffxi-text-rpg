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

The proving flow is:

```text
livelihood / training choice
    -> field danger
    -> Combat 2.0
    -> victory or defeat
    -> reward / physical aftermath
    -> optional material recovery
    -> bodily or party recovery
    -> resume the same campaign
```

## Player-language hygiene pass — completed before PX-7

A character-POV audit found that the mechanics were becoming coherent while the Journal still exposed engineering vocabulary. The presentation layer was repaired without changing gameplay authority.

Current player-facing rules:

- internal opportunity `reason` remains diagnostic/model metadata and is **not rendered** as player prose;
- Journal cards lead with what is happening, why it matters to the character, blockers, and an action;
- detailed progress/requirements are available through a collapsible **Details** disclosure instead of dominating the scan path;
- completed entries visually recede and the suggested actionable entry is emphasized;
- Day Review renders structured history as character memory rather than semantic-event telemetry;
- Spellbook, Codex, Craft, continuity, campaign-readability, and combat-aftermath prose avoid terms such as “canonical authority,” “persisted outcome roll,” or “semantic event” in ordinary play;
- first-contact dialogue remains concise enough to feel like advice from a person rather than an architecture manifesto.

`tests/playerFacingLanguage.test.js` makes this an enforceable UI contract.

## PX-7 — Repeated multi-region/community breadth

**Goal:** prove that the several-day social/livelihood/danger pattern works in a second real community before generalizing it.

**Status: implemented and audited.** Mistmere / Reader Soli Venn / West Starfen now provides the second persistent community proof.

### Second-community proving loop

```text
meet Reader Soli Venn in Mistmere Canal Ward
    -> accept Marrowleaf for the Ward
    -> keep local service/exploration alternatives available
    -> move through Mistmere Reedport
    -> travel to West Starfen
    -> choose among Soli's Marrowleaf work, ordinary reed livelihood, or Rootling danger
    -> gather 2 provenance-qualified Marrowleaf
    -> return Starfen -> Reedport -> Canal Ward through semantic travel/locality actions
    -> deliver to Soli
    -> receive 24 gil + familiarity/respect exactly once
    -> save/load
    -> advance to a later fictional day
    -> save/load again
    -> receive changed Soli follow-up that remembers the work and points back toward Starfen danger/livelihood
```

The slice proves several important reusable contracts:

- Reader Soli Venn is a persistent NPC-backed world character, not Journal-only content;
- commitment definitions may require provenance-qualified **raw gathered resources or transformed goods**;
- the commitment catalog can name a real field source and bounded known return hub while gathering/travel engines remain authority;
- `playerContinuityEngine` now projects **all actually known commitment definitions**, rather than containing a Varric-only presentation branch;
- the generic projection handles offer, active field work, semantic return, resolution, later-day follow-up, and completed history;
- the Journal still does not reveal a commitment until its giver is actually known;
- ordinary Starfen reed livelihood and the Starfen Rootling training choice remain valid alongside Soli’s request, so the slice does not collapse the region into one breadcrumb;
- delivery and follow-up rewards remain exactly once across real save/load.

Data advances to **29** because this adds a real authored-data contract: commitment catalog v2, the Soli persistent NPC seed, the Marrowleaf commitment, and provenance-aware raw-resource commitment requirements. Account Save 4 and Game State 5 remain valid because the existing generic commitment/relationship registries already store the new records.

Authoritative PX-7 runtime checkpoint:

```text
0411083b07bc4063fe4810fcb225e1dffd2895a4
483/483 tests
Benchmark 1 success
Data 29
```

## `0.7.100` status after PX-7

**Still open.** Two persistent community loops now prove the architecture, but a sustained multi-region sandbox needs more breadth than two strongly guided examples.

The most concrete remaining closure gaps are:

- Thornwall/Elderwood still lacks an equivalent multi-day named-community continuity proof;
- repeated ordinary play still has limited alternative social/economic goals once the two proving commitments are exhausted;
- several secondary browser surfaces (especially Craft and some command-backed information views) remain shallower than the Journal/Scene path;
- companion/social breadth and executable settlement-service economy remain intentionally small;
- the full alpha gate still requires demonstrating that several communities and routes remain interesting across multiple sessions, not merely that two scripted proofs work.

## PX-8 — Sustained sandbox breadth / third-origin continuity

**Next bounded unit.** Prefer Thornwall/Elderwood as the third-origin proving slice, because it tests whether the reusable commitment/continuity contract survives outside both Brasshaven metalwork and Mistmere marsh gathering.

PX-8 should:

1. establish one persistent Thornwall/Elderwood contact/community reason using existing world authorities;
2. connect livelihood/service and danger/adventure choices without forming one mandatory chain;
3. create a later consequence across fictional days and real save/load;
4. keep provenance and exactly-once ownership intact;
5. use the now-generic known-commitment projection rather than adding another origin-specific branch;
6. audit whether the resulting three-origin breadth is sufficient for `0.7.100`, including ordinary semantic UI, economy/service usefulness, companion relevance, and repeated-session redirection.

Do **not** start by mass-authoring records or introducing global quest/reputation/dialogue frameworks.

## Player-facing acceptance checks

For each future Phase 0.7 slice, evaluate from a fresh save:

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

## Architecture rule

Player-experience guidance is a **projection over canonical state**, not a second simulation authority.

Current projections derive from canonical origin/place/POI discovery, progression, work, travel/transport, equipment, map knowledge, commitments, relationships, day-cycle state, acquired campaign context, injury state, and actual defeated-body resource opportunities. Real commitments, relationships, battle consequences, recovery tasks, and resource opportunities remain canonical gameplay state; the Journal may summarize, group, rank, and expose semantic actions but may not secretly own them.
