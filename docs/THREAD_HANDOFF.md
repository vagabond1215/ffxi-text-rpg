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
Product:       0.7.200.1
Package:       0.7.200
Account Save:  4
Game State:    5
Data:          30
Benchmark:     1
Codename:      Settlement Economy Depth
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 remains in progress. The bounded `0.7.100` playable-campaign and `0.7.200` settlement-economy tracks are complete.**

Authoritative promoted `0.7.200` runtime checkpoint:

```text
61c8c6c602bc71a4e7325d04b3e7698f669843c4
Synchronize pipeline manifest with 0.7.200
```

At that checkpoint:

```text
tests       487
pass        487
fail        0
skipped     0
benchmark   success
Data        30
```

Benchmark 1:

```text
1,000 player combat profiles     413.227ms  0.413227ms/op
1,000 enemy combat profiles      102.942ms  0.102942ms/op
1,000 basic attacks              513.096ms  0.513096ms/op
10,000 ticks / 5 subscribers      44.538ms  0.004454ms/op
10,000 direct route lookups     7769.865ms  0.776987ms/op
```

GitHub Actions project tests use Node 20.20.2. The recurring action-runtime Node deprecation warning remains warning-only.

Documentation commits after the runtime checkpoint synchronize the roadmap, architecture, versioning, player-experience path, and this handoff. Verify the final documentation head's Check and Pages before beginning new implementation.

## Current Phase 0.7 registrations

```text
versionManifest:              0.7.200.1
activityAdvance:              0.2.0
campaignRecovery:             0.1.0
characterActivity:            0.2.0
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
settlementServiceBoard:       0.1.0
workstations:                 0.2.0
shopTransactions:             0.5.0
gameViewModels:               0.10.0
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.8.0
uiIntents:                    0.7.0
```

`0.7.200` changes no Data, Game State, Account Save, or Benchmark contract. The new settlement service board is derived. Production, shop transactions, inventory, wallet, work mastery, recovery, locality, and fictional time continue to use their existing persisted/current authorities.

## Phase 0.7 player-experience path

- **PX-1 — Arrival and footing:** implemented/audited.
- **PX-2 — First-day opportunities:** implemented/audited.
- **PX-3 — First regional loop:** Brasshaven/Redstone implemented/audited.
- **PX-4 — Several-day continuity:** Varric commitment/relationship/day/save-load implemented/audited.
- **PX-5 — Multi-region campaign readability:** acquired-knowledge regional grouping/readiness implemented/audited.
- **PX-6 — Danger, combat, and recovery:** ordinary campaign combat/body/recovery implemented/audited.
- **Player-language hygiene:** implemented/audited.
- **PX-7 — Second community breadth:** Mistmere/Soli/Starfen implemented/audited.
- **PX-8 — Third-origin continuity:** Thornwall/Sera/Elderwood implemented/audited.
- **PX-9 — Cross-community rotation:** implemented/audited; closed `0.7.100`.
- **`0.7.200` — Settlement service and economy depth:** implemented/audited; closed.

## Established campaign/community baseline

### Thornwall / Sera Talwin / Elderwood

`Sweetroot for Southgate`: two provenance-qualified West Elderwood Sweetroots, 20 gil + familiarity/respect, save/load, later-day follow-up. Amber Resin livelihood and Brush Hare danger remain independent choices.

### Brasshaven / Marshal Varric Stone / Redstone

`Copper for the Ring`: provenance-qualified Redstone Copper Ingot, 36 gil + relationship change, later-day follow-up, and Copper Trail/Starfen horizon.

### Mistmere / Reader Soli Venn / Starfen

`Marrowleaf for the Ward`: two provenance-qualified Marrowleaf, 24 gil + relationship change, later-day follow-up, with Reed Fiber livelihood and Rootling danger independent.

`playerContinuityEngine` projects all actually known commitment definitions. Commitment, relationship, gathering, travel, day, and persistence systems retain authority.

## PX-9 generic scheduled transport remains stable

`transportServiceBoardEngine` derives actual service choices from the canonical route/service catalog plus current wallet/activity/journey state. It stores nothing. `transportEngine` remains canonical for payment, cargo, cadence, tasks, fictional time, departure/arrival, interrupts, and party synchronization.

The established semantic proving rotation remains Thornwall Rivergate -> Brasshaven Iron Quay -> Mistmere Reedport and return, including real fares, save/load during scheduled travel, correct stop-specific service visibility, and acquired-knowledge privacy.

## `0.7.200` settlement service/economy contract

### New derived board

`js/text/systems/settlementServiceBoardEngine.js`

`SETTLEMENT_SERVICE_BOARD_VERSION = 1`.

It derives current safe-settlement choices from:

- real locality POIs;
- authored POI workstation tags;
- existing production definitions;
- current inventory and provenance-bearing quantities;
- current work proficiency and active production work;
- local shop catalogs and current wallet;
- current recovery state;
- canonical fictional time/activity state.

It stores nothing in `state` and owns no prices, recipes, wallet mutation, inventory transfer, work completion, recovery effect, or locality movement.

### Browser integration

The active Craft surface is now **Work, Trade & Recover**. It presents real executable settlement choices instead of command-backed production buttons.

Semantic actions include:

- `locality.poi` for required workshop/merchant focus;
- `production.start`;
- `activity.advanceToCompletion`;
- `production.claimOutputs`;
- `shop.buy`;
- `shop.sell`;
- `recovery.start`.

`domApp.js` dispatches these directly to existing domain engines. Commands remain optional diagnostic/power surfaces.

### Shop transaction interface

`shopEngine.js` now exposes structured `buyFromCurrentShopAction` and `sellToCurrentShopAction` while retaining old string-return wrappers for bounded compatibility.

Atomicity rules:

- purchase must successfully store the item before currency is deducted;
- sale must successfully remove the quantity before currency is added;
- an already-sold quantity cannot pay twice;
- current affordability is derived honestly; unaffordable stock is visible with a blocker but no executable buy action.

### Workstation interface

`workstationEngine.js` exports canonical POI-to-workstation tag projection. It does not create a second facility catalog. The settlement board uses existing POI tags to determine which production types exist somewhere in the locality and which are usable at the currently focused point.

### Proving economic loop

`tests/playerSettlementEconomyFlow.test.js` proves:

```text
Brasshaven
  -> South Redstone Reach
  -> gather 2 Redstone Copper Ore
  -> return to Brasshaven Market Ring
  -> go to Selka Aurum's authored forge/workshop
  -> compare raw sale value vs processing
  -> smelt Redstone Copper Ingot
  -> gain persistent metalworking mastery
  -> sell finished ingot to Mae Oris
  -> buy preparation stock with proceeds
  -> choose one-hour safe recovery
  -> account save/load
```

Proving values:

```text
2 raw copper ore typical shop value   10 gil
1 processed copper ingot value        14 gil
initial smelt                         300 fictional seconds
metalworking gain                     +2
next projected smelt                  295 fictional seconds
Flask of Water                         8 gil
wallet after ingot sale               14 gil
wallet after water purchase            6 gil
safe settlement recovery             3600 fictional seconds
```

The ingot retains production/input provenance. Wallet, world time, purchased item, and work mastery survive real account save/load.

### Cross-origin breadth proof

`tests/settlementServiceBoard.test.js` proves the same generic board against existing authored facilities in all three origin communities:

- Thornwall — Faulpie's tannery -> Elderwood Hide Binding;
- Brasshaven — Selka Aurum's forge -> Redstone Copper Ingot;
- Mistmere — Chomo Jinjahl's kitchen -> Starfen Bluekelp Broth.

Each locality also derives its real merchant providers. There is no Brasshaven-specific settlement-economy branch.

### Recovery boundary

Safe settlement recovery remains the existing one-hour canonical recovery primitive. No fake inn fee, dynamic service quality, or second rest economy was added. Paid/service-quality recovery should only be authored when there is a real executable service contract to own it.

## `0.7.200` closure decision

**Closed. Do not reopen the milestone merely because later UI/economy/companion depth remains desirable.**

The track now proves a reusable return-to-settlement loop with real process-vs-sell decisions, mastery/efficiency consequence, executable trade/preparation, recovery time choice, provenance, transaction atomicity, save/load, and facility breadth across all three established communities.

Product is `0.7.200.1`, Package `0.7.200`, codename `Settlement Economy Depth`. The milestone is still pre-alpha (`released: false`). **Phase 0.7 remains open.**

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
- transport service board as derived presentation only;
- settlement service board as derived presentation only;
- production engine owning recipes/work/input/output/mastery;
- shop engine owning actual transactions and wallet changes;
- persistent NPC-backed companions;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Deferred debt after `0.7.200`

- Search-or-act still routes command text rather than providing a semantic known-information/action surface.
- Several ordinary information views still bridge command output: Inventory, Equipment, Skills, Codex/World inspection.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- Safe-locality DOM density/hierarchy can improve without restoring wilderness navigation controls there.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Paid/service-quality recovery remains unauthored; do not invent a parallel rest economy.

The Craft browser surface is no longer the old compact production-command placeholder; do not list that former gap as current debt.

## Next bounded track — `0.7.300` semantic information access and locality usability

Start by resyncing `main` and rereading this handoff. Then audit:

- `js/text/ui/gameViewModel.js`;
- `js/text/ui/domRenderer.js`;
- `js/text/ui/domApp.js`;
- `js/text/ui/uiActions.js` and command-intent/search-or-act seams;
- inventory/equipment inspection and actions;
- skill/capability/ability knowledge presentation;
- Codex/World/map/acquired-knowledge presentation;
- `localityEngine.js` / `pointsOfInterest.js` and safe-locality point/service hierarchy;
- player-facing/UI regression tests.

Target one bounded proof in which a normal player can inspect the preparation, learned capability/knowledge, and relevant local options needed for a decision directly through the browser UI without knowing command vocabulary.

Any semantic search/index must operate only on information the character currently knows or can currently act on. Do not create an omniscient world index, general natural-language agent, or second game-state authority.

Do not make `0.7.300` a full UI rewrite. Preserve the locality/exploration distinction and do not restore wilderness minimap/D-pad controls in safe settlements.

Stop after the `0.7.200` documentation/CI checkpoint unless the user explicitly asks to continue into `0.7.300`.
