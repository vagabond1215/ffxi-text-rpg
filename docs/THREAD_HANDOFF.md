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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/service/information models are derived presentation.

## Current baseline

```text
Product:       0.7.300.1
Package:       0.7.300
Account Save:  4
Game State:    5
Data:          30
Benchmark:     1
Codename:      Semantic Information Access
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 remains in progress. The bounded `0.7.100`, `0.7.200`, and `0.7.300` tracks are complete.**

Authoritative promoted `0.7.300` runtime checkpoint:

```text
0f6af06ff8571658d51bc2be53112a50d51275cb
Synchronize pipeline manifest with 0.7.300
```

At that checkpoint:

```text
tests       490
pass        490
fail        0
skipped     0
benchmark   success
Data        30
```

Benchmark 1:

```text
1,000 player combat profiles     464.067ms  0.464067ms/op
1,000 enemy combat profiles      114.406ms  0.114406ms/op
1,000 basic attacks              543.591ms  0.543591ms/op
10,000 ticks / 5 subscribers      48.428ms  0.004843ms/op
10,000 direct route lookups     8693.735ms  0.869373ms/op
```

GitHub Actions project tests use Node 20.20.2. The recurring action-runtime Node deprecation warning remains warning-only.

Documentation commits after the runtime checkpoint synchronize the roadmap, architecture, versioning, player-experience path, and this handoff. Verify the final documentation head's Check and Pages before beginning new implementation.

## Current Phase 0.7 registrations

```text
versionManifest:              0.7.300.1
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
playerInformation:            0.1.0
gameViewModels:               0.11.0
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.9.0
uiIntents:                    0.8.0
```

`0.7.300` changes no Data, Game State, Account Save, or Benchmark contract. `playerInformationEngine` is derived; its search query is transient UI state. Inventory, equipment, skills, capabilities, abilities, atlas/discovery, locality, and POI systems retain authority.

## Completed Phase 0.7 player-experience path

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
- **`0.7.300` — Semantic information access and locality usability:** implemented/audited; closed.

## Stable campaign/community baseline

Three established several-day community loops remain canonical:

- Thornwall / Sera Talwin / Elderwood — `Sweetroot for Southgate`;
- Brasshaven / Marshal Varric Stone / Redstone — `Copper for the Ring`;
- Mistmere / Reader Soli Venn / Starfen — `Marrowleaf for the Ward`.

`playerContinuityEngine` projects all actually known commitment definitions. Commitment, relationship, gathering, travel, day, and persistence systems retain authority.

PX-9 scheduled transport and `0.7.200` settlement service/economy surfaces remain stable. `transportServiceBoardEngine` and `settlementServiceBoardEngine` are derived presentation only.

## `0.7.300` semantic information contract

### New derived projection

`js/text/systems/playerInformationEngine.js`

`PLAYER_INFORMATION_VERSION = 1`.

`createPlayerInformationModel(state, { query })` derives:

- current gil;
- accessible unlocked carried containers/items;
- equipped items;
- semantic equip/unequip readiness/actions;
- effective skills under current discipline context;
- character-owned learned capabilities;
- learned abilities and current readiness;
- acquired maps only;
- visited atlas places only;
- discovered named POIs/contacts only;
- currently actionable safe-locality POIs and destinations;
- deterministic bounded search results over those entries only.

It stores no registry in game state and never needs to enumerate the global map/place/POI/resource/encounter catalogs.

### Search privacy boundary

`uiState.informationQuery` is transient browser state. It is not persisted into account/game state.

The omnibox now searches **what the character knows or can do**. A value beginning with `/` explicitly opts into the existing command shell; ordinary information search does not route through command prose.

`tests/playerInformationAccess.test.js` proves:

- Thornwall acquired map visible; Starfen map hidden before acquisition;
- Thornwall Southgate visited; West Starfen absent before visit;
- Sera Talwin searchable as a current semantic locality action;
- learned Ore Survey searchable as character knowledge;
- inaccessible Home Safe is not presented as carried-accessible storage;
- **Tall Reedbed returns zero results before discovery**;
- Character, Spellbook, Codex, and World core views do not use command buttons.

### Browser surfaces

`gameViewModel.js` includes `information` and reads transient search query state.

`domRenderer.js` now renders:

- Character: Equipped, Carried, Skills, Capabilities;
- Spellbook: learned spells/techniques with costs/readiness and semantic Use;
- Codex: acquired maps, visited places, discovered contacts/POIs, search results;
- World: current named locality destinations/places/people plus acquired maps.

`domApp.js` dispatches `ui.view.open`, `ui.search`, `ui.search.clear`, `equipment.equip`, `equipment.unequip`, and the existing locality/ability domain intents directly.

Safe settlements still intentionally omit wilderness D-pad/minimap controls. Exploration remains discovery-relative.

### Bounded remaining command seams

Do **not** reopen `0.7.300` merely because every historical command adapter has not been removed. Explicit command use remains allowed as an optional power/diagnostic surface. A few utility/combat and wilderness POI bridges may remain until a later ordinary-player gate actually requires replacement.

One cosmetic implementation seam is currently non-blocking: capability definitions use `type`; the new information projection's optional subtype label currently reads `definition.kind`, so that small label can be blank even though capability name/description/search/view behavior are correct. If `0.7.400` or another UI pass touches the projection, fix this surgically rather than creating new capability metadata.

## `0.7.300` closure decision

**Closed. Do not reopen the milestone merely because later companion/UI breadth remains desirable.**

A normal player can inspect preparation, learned capability/ability information, acquired world knowledge, and current safe-locality options directly in the browser without knowing command vocabulary. The search boundary is acquired/current rather than omniscient.

Product is `0.7.300.1`, Package `0.7.300`, codename `Semantic Information Access`. The milestone remains pre-alpha (`released: false`). **Phase 0.7 remains open.**

## Stable authority boundaries

Preserve:

- one fictional-time/task/interrupt substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- command routes as optional power/diagnostic surfaces;
- acquired-knowledge privacy for maps/routes/resources/contacts/search;
- safe settlements intentionally omitting wilderness D-pad/minimap controls;
- provenance and one-time source/sink ownership;
- battle progression rewards separate from physical body recovery;
- commitments separate from relationships and both separate from Journal projection;
- scheduled transport owning fare/cadence/cargo/departure/arrival;
- transport service board as derived presentation only;
- settlement service board as derived presentation only;
- player information/search as derived/transient presentation only;
- production engine owning recipes/work/input/output/mastery;
- shop engine owning actual transactions and wallet changes;
- persistent NPC-backed companions;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Deferred debt after `0.7.300`

- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- A few explicit utility/combat and wilderness POI actions still use command adapters; do not turn that into a blind total-command-removal project.
- Safe-locality DOM density/hierarchy can improve without restoring wilderness navigation controls there.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Paid/service-quality recovery remains unauthored; do not invent a parallel rest economy.
- The capability subtype-label mismatch noted above is cosmetic and bounded.

## Next bounded track — `0.7.400` companion life and party depth

Start by resyncing `main` and rereading this handoff. Then audit:

- `js/text/data/companions.js` / companion definitions and backing NPCs;
- `partyEngine.js` recruitment, active membership, join/leave, relationship state, travel synchronization;
- companion Combat 2.0 contribution/tactics and resource synchronization;
- campaign recovery effects on active companions;
- companion equipment/progression/dialogue seams;
- browser party/companion presentation and semantic intents;
- save/load and validation coverage.

Choose one concrete multi-session loop before abstraction. The target is for an **existing recruited companion** to create a meaningful preparation, tactical, or social choice outside one automatic combat action, with a persistent consequence that survives real save/load while the companion remains the same NPC-backed person across travel/community play.

Reuse existing party, relationship, combat, travel, recovery, equipment, progression, and fictional-time authorities where they genuinely apply. Extract reusable helpers only after the concrete proof demonstrates the need.

Do **not** begin by mass-authoring companions, creating a summon framework, adding a duplicate relationship/progression registry, or building a universal party-AI framework.

Stop after the `0.7.300` documentation/CI checkpoint unless the user explicitly asks to continue into `0.7.400`.
