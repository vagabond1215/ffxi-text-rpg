# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `js/text/version.js`, and relevant Phase 0.7 systems/tests.

## Workflow and pre-alpha policy

Work directly on `main` by default. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. **Old local saves/accounts are not a design constraint.** Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, lazy compatibility state, or adapter layers.

This never relaxes determinism, validation, provenance, exactly-once ownership, content originality, acquired-knowledge privacy, or test discipline.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is legacy research/reference/migration material only.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

```text
Use fine movement where movement itself creates decisions.
Use named localities and actions where destinations and relationships create decisions.
```

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain physical/economic/social provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/aftermath are derived presentation.

## Current baseline

```text
Product:       0.6.900.1
Package:       0.6.900
Account Save:  4
Game State:    5
Data:          29
Benchmark:     1
Codename:      Integrated Mechanics Gate
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 is in progress. `0.7.100` is not complete.**

Authoritative audited runtime checkpoint for PX-7:

```text
0411083b07bc4063fe4810fcb225e1dffd2895a4
Align PX7 proof with regional Journal title
```

At that checkpoint:

```text
tests       483
pass        483
fail        0
benchmark   success
Data        29
```

Benchmark 1:

```text
1,000 player combat profiles     468.655ms  0.468655ms/op
1,000 enemy combat profiles      110.203ms  0.110203ms/op
1,000 basic attacks              553.072ms  0.553072ms/op
10,000 ticks / 5 subscribers      48.620ms  0.004862ms/op
10,000 direct route lookups     8767.498ms  0.876750ms/op
```

GitHub Actions project tests run on Node 20.20.2; the recurring action-runtime Node deprecation warning remains warning-only.

Documentation commits after the runtime checkpoint synchronize the PX path, architecture, roadmap, versioning, and this handoff. Verify the final docs-only head's Check/Pages before beginning new implementation.

## Current Phase 0.7 registrations

```text
activityAdvance:            0.2.0
campaignRecovery:           0.1.0
characterActivity:          0.2.0
commitments:                0.2.0
relationships:              0.1.0
dayCycle:                   0.2.0
resourceRecoveryWork:       0.3.0
gameViewModels:             0.8.0
playerExperience:           0.3.0
playerOpportunities:        0.2.0
playerContinuity:           0.5.0
playerCampaignReadability:  0.2.0
playerDangerRecovery:       0.2.0
domUi:                      0.7.0
uiIntents:                  0.6.0
```

PX-7 advances Data from 28 to 29 because it adds a real authored contract: commitment catalog v2, persistent Reader Soli Venn seed, `Marrowleaf for the Ward`, and provenance-aware commitment requirements across raw gathered or transformed goods plus field-source/return guidance.

Account Save 4 / Game State 5 stay unchanged because existing generic commitment/relationship registries already serialize the new records. Benchmark remains 1 because the workload/protocol did not change.

## Phase 0.7 player-experience path

- **PX-1 — Arrival and footing:** implemented/audited.
- **PX-2 — First-day opportunities:** implemented/audited.
- **PX-3 — First regional loop:** Brasshaven/Redstone proof implemented/audited.
- **PX-4 — Several-day continuity:** Varric commitment/relationship/day/save-load proof implemented/audited.
- **PX-5 — Multi-region campaign readability:** acquired-knowledge regional grouping/readiness proof implemented/audited.
- **PX-6 — Danger, combat, and recovery:** ordinary campaign combat/body/recovery proof implemented/audited.
- **Player-language hygiene pass:** implemented/audited.
- **PX-7 — Repeated multi-region/community breadth:** Mistmere/Soli/Starfen second-community proof implemented/audited.
- **PX-8 — Sustained sandbox breadth / third-origin continuity:** **next bounded unit**.

## Player-language / information-hierarchy boundary

A character-POV audit found that the mechanics were improving faster than the presentation language. The cleanup before PX-7 is now a stable contract:

- ordinary Journal rendering does **not** expose internal `entry.reason` engineering rationale;
- summaries/motivation/progress are character/world-facing;
- detailed progress/requirements live behind a collapsible **Details** disclosure;
- blockers remain immediately visible;
- completed entries visually recede;
- suggested actionable entries receive emphasis;
- Day Review turns structured semantic history into character memory rather than event-count telemetry;
- Spellbook/Codex/Craft/continuity/readability/aftermath ordinary prose avoids developer jargon.

`tests/playerFacingLanguage.test.js` guards this boundary. Do not regress it by putting words like “canonical authority,” “semantic event,” “persisted outcome roll,” or “exactly once” directly into ordinary player prose.

## Established first community — Brasshaven / Varric

```text
meet Marshal Varric Stone
  -> claim/equip Prospector Pick
  -> accept Copper for the Ring
  -> travel to Redstone Reach
  -> gather copper
  -> return to Brasshaven
  -> forge Copper Ingot
  -> deliver provenance-qualified ingot
  -> receive 36 gil + relationship change exactly once
  -> later fictional day
  -> Varric remembers the work
  -> Starfen / Copper Trail Clasp horizon
```

PX-4 audit invariants remain:

- same-ID stackable items with different provenance histories do not merge;
- commitment delivery consumes only provenance-qualified stack quantities;
- real save/load is tested across resolution/day/follow-up;
- commitment/relationship registries and catalog are validated authority.

## Acquired-knowledge / multi-region readability

`playerCampaignReadabilityEngine` is a pure presentation decorator. It does not persist a campaign registry.

Varric's later follow-up can make Starfen reed fiber a known ambition without revealing remote Tall Reedbed/source data before arrival. Actual locality routes, scheduled transport fare/cadence, travel reachability, tools, and work requirements remain authoritative.

The Forge–Mere proving fare remains 52 gil; Varric's 36-gil reward does not magically satisfy it.

Explicit truthful upstream `regionLabel` metadata wins over fallback origin inference.

## Ordinary campaign danger/recovery

PX-6 proves:

```text
livelihood/training choice
  -> Redstone Burrower encounter
  -> semantic Attack / abilities / Wait
  -> victory or defeat
  -> exactly-once EXP/currency
  -> separate physical body opportunity
  -> optional tool/time/proficiency recovery
  -> timed body/party recovery or defeat retreat
  -> resume same campaign
```

Combat 2.0 remains authoritative. Resource opportunities own physical creature material. Campaign recovery uses existing timed tasks:

```text
field       10 minutes   partial recovery
settlement  60 minutes   full active-party safe rest
defeat      120 minutes  retreat to known safety + partial restoration
```

Do not invent a campaign-specific combat engine, second clock, free defeat reset, paid inn economy, or auto-loot layer.

## PX-7 second community — Mistmere / Reader Soli Venn / Starfen

### Canonical authored record

```text
commitment-mistmere-marrowleaf-return
Marrowleaf for the Ward
Giver: Reader Soli Venn
Offer: Mistmere Canal Ward
Requirement: 2 item-starfen-marrowleaf
Required provenance: source-west-starfen-marrowleaf-bed
Field source: source-west-starfen-marrowleaf-bed
Return hub: mistmere-reedport
Reward: 24 gil + familiarity 1 + respect 1
Follow-up: one later fictional day
```

Reader Soli Venn is a persistent NPC-backed world contact: `npc-mistmere-reader-soli-venn`.

### Proven ordinary flow

```text
meet Soli
  -> accept Marrowleaf for the Ward
  -> service/exploration alternatives remain available
  -> Canal Ward -> Reedport -> West Starfen
  -> choose among:
       Soli Marrowleaf gathering
       ordinary Reed Fiber livelihood
       Starfen Rootling training/danger
  -> gather 2 provenance-qualified Marrowleaf
  -> West Starfen -> Reedport -> Canal Ward
  -> deliver to Soli
  -> 24 gil + relationship change exactly once
  -> real save/load
  -> later fictional day
  -> real save/load
  -> Soli remembers the Marrowleaf and contextualizes Rootling danger
```

### What genuinely generalized

`playerContinuityEngine` now projects **all actually known commitment definitions**. The offer POI must be discovered or persistent commitment state must already exist.

Generic continuity projection supports:

- offer/accept;
- active material requirements;
- direct semantic field gathering when an authored commitment names a real canonical field source;
- bounded semantic return via existing locality/travel authority;
- resolution;
- later-day follow-up;
- remembered complete state.

The commitment system itself remains canonical authority. Journal projection owns none of those states.

Commitment catalog v2 can validate/provision provenance requirements against canonical raw-resource items or canonical production items. Do not introduce quest-token materials where a real world resource can serve as the social/economic sink.

## Stable authority boundaries

Preserve:

- one fictional-time/task/interrupt substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- command routes as optional power/diagnostic surfaces;
- acquired-knowledge privacy for maps/routes/resources/contacts;
- safe settlements intentionally omitting wilderness D-pad/minimap controls;
- provenance and exactly-once source/sink ownership;
- battle progression rewards separate from physical resource recovery;
- commitments separate from relationships and both separate from Journal projection;
- scheduled transport owning fare/cadence/cargo/departure/arrival;
- persistent NPC-backed companions;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Deferred technical/product debt

- Search-or-act is still command-capable rather than true semantic fuzzy search.
- Some information views still bridge command output.
- Craft browser view is still a compact surface rather than a rich production interface.
- `gil` remains current currency terminology pending deliberate original-currency design.
- companion tactical/dialogue/equipment/progression breadth remains small.
- safe-settlement rest is executable but not yet a priced/service-quality economy.
- active DOM safe-locality density/hierarchy still has room to improve; do **not** restore wilderness navigation controls there.
- two persistent communities are now proven, but Thornwall/Elderwood lacks equivalent several-day continuity.
- alternative social/economic goals remain thin after the Varric and Soli proving commitments are exhausted.

## `0.7.100` status

**Open.** Do not promote Product merely because PX-7 is coherent.

The concrete remaining closure question is whether ordinary multi-session play has enough repeated community/social/economic/adventure redirection to feel like a sandbox rather than two excellent proving loops.

## Next bounded unit — PX-8 sustained sandbox breadth / third-origin continuity

Prefer existing **Thornwall/Elderwood** authorities.

PX-8 should:

1. establish one persistent Thornwall/Elderwood named-contact/community reason;
2. connect at least one livelihood/service reason and one danger/adventure reason;
3. create later fictional-day consequence surviving real save/load;
4. preserve provenance/exactly-once behavior;
5. reuse the generic known-commitment projection rather than adding an origin-specific continuity branch;
6. preserve competing alternatives instead of one mandatory breadcrumb chain;
7. re-audit the complete `0.7.100` exit criteria after the third-origin slice, including economy/service usefulness, companion relevance, Craft/UI reachability, and repeated-session breadth.

Do **not** start with mass-authored records, a global quest/reputation/dialogue system, replacement economy/encounter framework, or universal campaign registry.

Stop after PX-8 and its audits/docs unless the user explicitly asks to continue farther.
