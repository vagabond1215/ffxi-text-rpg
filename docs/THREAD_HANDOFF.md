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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/aftermath are derived presentation.

## Current baseline

```text
Product:       0.6.900.1
Package:       0.6.900
Account Save:  4
Game State:    5
Data:          30
Benchmark:     1
Codename:      Integrated Mechanics Gate
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 is in progress. `0.7.100` is not complete.**

Authoritative audited runtime checkpoint for PX-8:

```text
63a234edfc1e327d90823c4171bdf315f01aa044
Prove PX8 Thornwall Elderwood continuity
```

At that checkpoint:

```text
tests       484
pass        484
fail        0
skipped     0
benchmark   success
Data        30
```

Benchmark 1:

```text
1,000 player combat profiles     400.261ms  0.400261ms/op
1,000 enemy combat profiles      104.237ms  0.104237ms/op
1,000 basic attacks              509.356ms  0.509356ms/op
10,000 ticks / 5 subscribers      50.139ms  0.005014ms/op
10,000 direct route lookups     7969.682ms  0.796968ms/op
```

GitHub Actions project tests use Node 20.20.2. The recurring action-runtime Node deprecation warning remains warning-only.

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

PX-8 advances Data 29 -> 30 because Sera Talwin becomes a persistent authored NPC-backed contact and `Sweetroot for Southgate` becomes the third canonical commitment definition. `COMMITMENT_CATALOG_VERSION` stays 2: the schema/shape does not change. Account Save 4 / Game State 5 stay unchanged because existing generic commitment/relationship registries already serialize the records. Benchmark remains 1.

## Phase 0.7 player-experience path

- **PX-1 — Arrival and footing:** implemented/audited.
- **PX-2 — First-day opportunities:** implemented/audited.
- **PX-3 — First regional loop:** Brasshaven/Redstone proof implemented/audited.
- **PX-4 — Several-day continuity:** Varric commitment/relationship/day/save-load proof implemented/audited.
- **PX-5 — Multi-region campaign readability:** acquired-knowledge regional grouping/readiness proof implemented/audited.
- **PX-6 — Danger, combat, and recovery:** ordinary campaign combat/body/recovery proof implemented/audited.
- **Player-language hygiene pass:** implemented/audited.
- **PX-7 — Second community breadth:** Mistmere/Soli/Starfen implemented/audited.
- **PX-8 — Third-origin continuity:** Thornwall/Sera/Elderwood implemented/audited.
- **PX-9 — Cross-community rotation / `0.7.100` gate:** next bounded unit; do not start unless requested.

## Player-language / information-hierarchy boundary

Ordinary Journal rendering does **not** expose internal `entry.reason` engineering rationale. Summaries/motivation/progress are character/world-facing; detailed requirements live behind **Details**; blockers remain visible; completed entries recede; recommended actionable entries receive emphasis; Day Review renders structured history as memory. `tests/playerFacingLanguage.test.js` guards this boundary.

Do not put terms like “canonical authority,” “semantic event,” “persisted outcome roll,” or “exactly once” into ordinary player prose merely because those concepts remain valid developer invariants.

## Three established community loops

### Thornwall / Sera Talwin / Elderwood — PX-8

Canonical record:

```text
commitment-thornwall-sweetroot-return
Sweetroot for Southgate
Giver: Sera Talwin
Offer: Thornwall Southgate
Requirement: 2 item-elderwood-sweetroot
Required provenance: source-west-elderwood-sweetroot-patch
Field source: source-west-elderwood-sweetroot-patch
Reward: 20 gil + familiarity 1 + respect 1
Follow-up: one later fictional day
```

Proven ordinary flow:

```text
meet Sera
  -> claim/equip Field Knife
  -> accept Sweetroot for Southgate
  -> travel to West Elderwood
  -> choose among:
       Sweetroot community request
       ordinary Amber Resin livelihood
       Brush Hare training/danger
  -> gather 2 provenance-qualified Sweetroot
  -> return to Southgate
  -> resolve exactly once
  -> real save/load
  -> later fictional day
  -> real save/load
  -> Sera remembers the work and points back toward resin, Brush Hares, deeper woods
```

Sweetroot was deliberately chosen instead of Amber Resin because Amber Resin is already the ordinary Thornwall livelihood route. This preserves independent community/livelihood/danger choices. Sweetroot already has food/medicine/trade sinks; no quest-token material was added.

### Brasshaven / Marshal Varric Stone / Redstone

`Copper for the Ring` remains the first transformed-good continuity proof: provenance-qualified Redstone Copper Ingot, 36 gil + relationship change, later-day follow-up, and Copper Trail/Starfen horizon.

### Mistmere / Reader Soli Venn / Starfen — PX-7

`Marrowleaf for the Ward` remains the second raw-resource continuity proof: two provenance-qualified Marrowleaf, 24 gil + relationship change, later-day follow-up, with Reed Fiber livelihood and Rootling danger remaining independent.

## Generic continuity contract

`playerContinuityEngine` projects **all actually known commitment definitions**. A giver POI must be discovered or persistent commitment state must already exist.

The generic projection supports offer/accept, material requirements, direct field gathering when a real source is authored, bounded semantic return through existing locality/travel authority, resolution, later-day follow-up, and remembered complete state.

The commitment system owns state/rewards; relationship engine owns relationship dimensions; gathering/travel/day/save systems remain their own authorities. Do not add origin-specific continuity branches unless a real future slice proves the generic contract insufficient.

## Ordinary campaign danger/recovery

PX-6 invariants remain: Combat 2.0 is authoritative; semantic Attack/abilities/Wait are ordinary UI actions; EXP/currency reward is exactly once; physical creature material is a separate defeated-body opportunity; recovery consumes fictional time; defeat retreats to known safety with partial rather than free restoration.

## Acquired-knowledge / campaign readability

`playerCampaignReadabilityEngine` remains derived. Varric's follow-up may make Starfen fiber a known ambition without revealing the Tall Reedbed before arrival. Explicit truthful region metadata wins over fallback origin inference. Scheduled transport retains fare/cadence/cargo/departure/arrival authority.

## `0.7.100` post-PX-8 closure audit

**Open.** The third-origin/community breadth gap is closed. The remaining blocker is now concrete and architectural/UI-facing rather than a request for more content.

The existing route graph connects:

```text
Thornwall Rivergate
  -> Timbercross Landing
  -> Brasshaven Iron Quay
  -> Mistmere Reedport
  -> West Starfen
```

`service-crown-forge-caravan` and `service-forge-mere-caravan` already exist, and `transportEngine` owns their fare/cadence/cargo/departure/arrival behavior. `domApp` already dispatches `transport.start` semantically.

**But generic Travel Desk interaction is not executable transport UI.** `poiEngine.describePoiInteraction(..., 'travel')` currently reports: `Travel service behavior is not implemented yet unless this is a route exit.` PX-5 exposes one Forge–Mere booking through a specific Copper Trail readability path, but that does not make cross-community rotation generically available.

This fails the Phase 0.7 promise that ordinary players can sustain play across several connected communities without command/API expertise. Do not promote Product to `0.7.100` until this seam is repaired and re-audited.

## Next bounded unit — PX-9 cross-community rotation / `0.7.100` gate

First audit:

- `js/text/data/routeCatalog.js`
- `js/text/systems/transportEngine.js`
- `js/text/systems/localityEngine.js`
- `js/text/systems/poiEngine.js`
- `js/text/ui/gameViewModel.js`
- `js/text/ui/domApp.js`
- `js/text/ui/domRenderer.js`
- PX-5 campaign-readability transport tests
- route/transport/locality/party save-load tests.

Target:

```text
current real travel stop
  -> Travel Desk/context shows real scheduled services
  -> destination + fare + timing/readiness + blockers are legible
  -> semantic transport.start
  -> canonical wait/depart/arrive
  -> active companions follow
  -> continue locality/region play
```

Required proof should cover ordinary **Thornwall -> Brasshaven -> Mistmere** rotation (and an appropriate return leg) using existing locality and scheduled-transport authority. Preserve acquired-knowledge privacy, fare/cargo/time rules, exactly-once payment, companion synchronization, and current-version save/load.

Do not create a second transport catalog, UI-owned journey state, campaign-specific travel state machine, or another community merely to avoid this access problem.

After PX-9, immediately re-run the complete `0.7.100` exit audit instead of automatically inventing PX-10.

## Deferred debt not currently the milestone blocker

- Search-or-act remains command-capable rather than true semantic fuzzy search.
- Some information views still bridge command output.
- Craft browser view is still compact rather than a rich production interface.
- `gil` remains current currency terminology pending deliberate original-currency design.
- companion tactical/dialogue/equipment/progression breadth remains small.
- safe-settlement rest is executable but not yet a priced/service-quality economy.
- active DOM safe-locality density/hierarchy still has room to improve; do **not** restore wilderness navigation controls there.

These are real future improvements, but the cross-community Travel Desk seam is the immediate `0.7.100` gate.

Stop after the PX-8 audit/docs checkpoint unless the user explicitly asks to continue farther.
