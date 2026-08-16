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

Hearth & Horizon is pre-alpha. Old local saves/accounts are not a design constraint. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, or adapter layers. This never relaxes determinism, validation, provenance, one-time ownership, content originality, acquired-knowledge privacy, or test discipline.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/service boards are derived presentation.

## Current baseline

```text
Product:       0.7.100.1
Package:       0.7.100
Account Save:  4
Game State:    5
Data:          30
Benchmark:     1
Codename:      Playable Campaign Slice
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 is still in progress. The bounded `0.7.100` playable-campaign track is complete.**

Authoritative promoted runtime checkpoint:

```text
d15bd9517803faf6bceae5fb3376193648cca09d
Align Phase 0.7 version gate with PX9 closure
```

At that checkpoint:

```text
tests       485
pass        485
fail        0
skipped     0
benchmark   success
Data        30
```

Benchmark 1:

```text
1,000 player combat profiles     439.616ms  0.439616ms/op
1,000 enemy combat profiles      116.070ms  0.116070ms/op
1,000 basic attacks              504.204ms  0.504204ms/op
10,000 ticks / 5 subscribers      48.633ms  0.004863ms/op
10,000 direct route lookups     8064.154ms  0.806415ms/op
```

GitHub Actions project tests use Node 20.20.2. The recurring action-runtime Node deprecation warning remains warning-only.

Documentation commits after the runtime checkpoint synchronize the PX path, architecture, roadmap, versioning, and this handoff. Verify the final docs-only head's Check and Pages before beginning new implementation.

## Current Phase 0.7 registrations

```text
versionManifest:              0.7.100.1
activityAdvance:              0.2.0
campaignRecovery:             0.1.0
characterActivity:            0.2.0
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
gameViewModels:               0.9.0
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.7.0
uiIntents:                    0.6.0
```

PX-9 changes no Data, Game State, Account Save, or Benchmark contract. The new service-board projection derives current choices from existing Data 30 route/service records and current Game State 5 wallet/activity/travel state.

## Phase 0.7 player-experience path

- **PX-1 — Arrival and footing:** implemented/audited.
- **PX-2 — First-day opportunities:** implemented/audited.
- **PX-3 — First regional loop:** Brasshaven/Redstone implemented/audited.
- **PX-4 — Several-day continuity:** Varric commitment/relationship/day/save-load implemented/audited.
- **PX-5 — Multi-region campaign readability:** acquired-knowledge regional grouping/readiness implemented/audited.
- **PX-6 — Danger, combat, and recovery:** ordinary campaign combat/body/recovery implemented/audited.
- **Player-language hygiene pass:** implemented/audited.
- **PX-7 — Second community breadth:** Mistmere/Soli/Starfen implemented/audited.
- **PX-8 — Third-origin continuity:** Thornwall/Sera/Elderwood implemented/audited.
- **PX-9 — Cross-community rotation:** implemented/audited; closes `0.7.100`.

## Three established community loops

### Thornwall / Sera Talwin / Elderwood

`Sweetroot for Southgate`: two provenance-qualified West Elderwood Sweetroots, 20 gil + familiarity/respect, real save/load, later-day follow-up. Amber Resin livelihood and Brush Hare danger remain independent choices.

### Brasshaven / Marshal Varric Stone / Redstone

`Copper for the Ring`: provenance-qualified Redstone Copper Ingot, 36 gil + relationship change, later-day follow-up, and Copper Trail/Starfen horizon.

### Mistmere / Reader Soli Venn / Starfen

`Marrowleaf for the Ward`: two provenance-qualified Marrowleaf, 24 gil + relationship change, later-day follow-up, with Reed Fiber livelihood and Rootling danger independent.

`playerContinuityEngine` projects all actually known commitment definitions. Commitment, relationship, gathering, travel, day, and persistence systems retain their own authority.

## PX-9 generic scheduled transport

### New derived authority

`js/text/systems/transportServiceBoardEngine.js`

`TRANSPORT_SERVICE_BOARD_VERSION = 1`.

It derives service choices from:

- canonical `routeCatalog` service/route/journey/departure data;
- current real place/service stop;
- current wallet;
- active hands-on work;
- active journey;
- cargo request.

It returns service/destination, fare, cadence, duration, next boardable departure/wait, funds, availability, and blockers. It stores nothing in game state.

### Browser integration

`gameViewModel.js` exposes board entries as direct `transport.start` contextual actions. Travel POI interaction in `poiEngine.js` describes the same service board rather than saying scheduled travel is unimplemented. `domApp.js` already routes `transport.start` to `startScheduledTransport`.

`transportEngine` remains canonical for payment, cargo, boarding lead, cadence, scheduled task, fictional time, departure/arrival, interruptions, and active-party location synchronization.

### Proving flow

`tests/playerCrossCommunityRotation.test.js` proves:

```text
Southgate -> Crownward -> Rivergate
  -> Crown-Forge Caravan (60 gil) -> Brasshaven Iron Quay
  -> Forge-Mere Caravan (52 gil) -> Mistmere Reedport
  -> save/load/reorient
  -> Forge-Mere back to Brasshaven
  -> Crown-Forge back to Thornwall
```

The test also proves blocked fare visibility, one deduction per booking, no duplicate charge on an already-active journey, save/load during scheduled travel, per-stop service visibility, return rotation, state/world validation, and no Tall Reedbed/source topology leak.

## `0.7.100` closure decision

**Closed.** Do not reopen it merely because later UI/economy/companion depth remains desirable.

The combined PX-1 through PX-9 proof now covers origin footing, competing first-day opportunities, livelihood/production, persistent communities and relationships, danger/combat/recovery, acquired-knowledge readability, semantic cross-community transport, current-version save/load, companions where relevant, and provenance/source-sink/one-time ownership.

Product is `0.7.100.1`, Package `0.7.100`, codename `Playable Campaign Slice`. The milestone is still pre-alpha (`released: false`). **Phase 0.7 as a whole remains open.**

## Stable authority boundaries

Preserve:

- one fictional-time/task/interrupt substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- command routes as optional power/diagnostic surfaces;
- acquired-knowledge privacy for maps/routes/resources/contacts;
- safe settlements intentionally omitting wilderness D-pad/minimap controls;
- provenance and one-time source/sink ownership;
- battle progression rewards separate from physical body recovery;
- commitments separate from relationships and both separate from Journal projection;
- scheduled transport owning fare/cadence/cargo/departure/arrival;
- service board as derived transport presentation only;
- persistent NPC-backed companions;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Deferred debt after `0.7.100`

- Search-or-act is still command-capable rather than true semantic fuzzy search.
- Some information views still bridge command output.
- Craft browser view is compact rather than a rich production-choice interface.
- `gil` remains current currency terminology pending deliberate original-currency design.
- companion tactical/dialogue/equipment/progression breadth remains small.
- safe-settlement rest is executable but not yet a priced/service-quality economy.
- active DOM safe-locality density/hierarchy still has room to improve; do not restore wilderness navigation controls there.

## Next bounded track — `0.7.200` settlement service and economy depth

Start by resyncing `main` and rereading this handoff. Then audit:

- `shopEngine` / shop catalogs / wallet ownership;
- production catalog/engine/workstations and the Craft browser surface;
- campaign/safe-settlement recovery and fictional-time costs;
- locality/POI service presentation;
- resource source-sink/trade loops;
- relevant semantic UI intents and save/load tests.

Target one reusable return-to-settlement loop:

```text
field/community activity
  -> return to settlement
  -> compare useful economic/service choices
  -> spend/process/trade/recover through existing authorities
  -> persistent character/economic consequence
  -> prepare for another outing
```

Strong candidates include a real browser production-choice surface and deliberately priced/service-quality recovery, but choose the smallest loop justified by existing authority after audit.

Do **not** start by mass-authoring shops/recipes/services, creating a parallel economy, or pulling property/workshop/infrastructure scope forward from Phase 0.8.

Stop after the `0.7.100` docs/CI checkpoint unless the user explicitly asks to continue into `0.7.200`.
