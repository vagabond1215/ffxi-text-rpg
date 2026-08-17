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
8. `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `js/text/version.js`, and the systems/tests relevant to the next bounded work order.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/service/information/home opportunity models are derived presentation.

Ordinary player-facing information should describe what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state/task channels, hidden topology, and implementation rationale stay outside normal play.

## Current baseline

```text
Product:       0.8.100.1
Package:       0.8.100
Account Save:  4
Game State:    5
Data:          32
Benchmark:     1
Codename:      Home Foothold and Infrastructure
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete. Phase 0.8 is IN PROGRESS. The bounded `0.8.100` track is complete and audited.**

Authoritative promoted `0.8.100` runtime checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
Restore augment validation after 0.8.100 promotion
```

At that checkpoint:

```text
tests       496
pass        496
fail        0
skipped     0
benchmark   success
Data        32
```

Benchmark 1:

```text
1,000 player combat profiles     466.332ms  0.466332ms/op
1,000 enemy combat profiles      108.813ms  0.108813ms/op
1,000 basic attacks              521.192ms  0.521192ms/op
10,000 ticks / 5 subscribers      48.255ms  0.004825ms/op
10,000 direct route lookups     8784.978ms  0.878498ms/op
```

Exact promoted runtime Check run: `31990577051` — SUCCESS. GitHub Actions project tests use Node 20.20.2. The recurring action-runtime Node deprecation warning remains warning-only.

Documentation commits after the runtime checkpoint synchronize roadmap, versioning, architecture, player-experience path, and this handoff. Verify the final documentation head's Check and Pages results before new implementation if they are not recorded in the thread that produced this handoff.

## Current relevant registrations

```text
versionManifest:              0.8.100.1
projects:                     0.1.0
homeInfrastructure:           0.1.0
homeStorage:                  0.3.9
characterActivity:            0.3.0
activityAdvance:              0.3.0
gameViewModels:               0.13.0
uiIntents:                    0.10.0
validation:                   0.10.0
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
settlementServiceBoard:       0.1.0
workstations:                 0.2.0
shopTransactions:             0.5.0
playerInformation:            0.1.1
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.10.0
companionCatalog:             0.2.0
party:                        0.2.0
companions:                   0.2.0
```

`js/text/data/databaseRegistry.js` records `homeInfrastructure` as implemented `0.1.0`. Existing `projects` and home-storage contracts did not advance because `0.8.100` consumes rather than replaces those authorities.

## Phase 0.7 remains closed

The established multi-region playable-alpha baseline remains canonical:

- Thornwall / Sera Talwin / Elderwood — `Sweetroot for Southgate`;
- Brasshaven / Marshal Varric Stone / Redstone — `Copper for the Ring`;
- Mistmere / Reader Soli Venn / Starfen — `Marrowleaf for the Ward`;
- semantic scheduled transport connects the proving communities;
- settlement return offers real work/trade/recovery/preparation/social decisions;
- acquired/current information and maps preserve hidden-topology privacy;
- danger/combat/body recovery/defeat return to the same campaign;
- Mara Venn remains one persistent NPC-backed companion with a real persistent pre-battle field-approach choice;
- primary browser surfaces follow the character-POV presentation boundary.

Do not reopen Phase 0.7 merely because later breadth is desirable.

## `0.8.100` — Home Foothold & Infrastructure — complete

### Player-facing proof

The first authored improvement is **Build a Storage Chest**.

```text
2 Resin-Sealed Hardwood Boards   <- existing Elderwood production chain
1 Redstone Copper Ingot          <- existing Redstone production chain
30 minutes hands-on labor        <- canonical project/timed-task substrate
                   |
                   v
Storage Chest furnishing         -> +5 furnishing-storage slots
```

A fresh character's Bronze Bed + Maple Table provide 3 furnishing-backed home-storage slots. Completing the chest places the existing `storage-chest` furnishing exactly once and raises capacity to 8 slots.

The Journal derives a **Home & Foothold** group. Normal semantic flow is:

```text
Plan
  -> Set aside available materials
  -> Start work
  -> Finish current activity
  -> completed furnishing and larger storage capacity
```

No project IDs, task channels, internal furnishing registry names, or command strings are required in ordinary play.

### Authority boundaries

`homeInfrastructureEngine` is a bounded adapter, not a second property simulation.

- `js/text/data/homeInfrastructure.js` owns authored improvement definitions.
- `projectEngine` owns project IDs, material requirements/contributions, labor linkage, status, timestamps, and generic completion.
- `inventoryEngine` owns atomic material removal and storage capacity/access.
- canonical world time/timed tasks own fictional duration.
- `mogHouseFurniture.js` remains the bounded legacy-internal furnishing data source; player-facing copy uses home/lodging/furnishing terminology.
- `homeInfrastructureEngine` applies recognized domain completion benefits exactly once and emits the semantic completion event.
- `gameViewModel` derives the Journal group/action state.
- `uiIntentDispatcher` delegates semantic begin/contribute/start actions.
- `activityAdvanceEngine` now supports generic `project.labor`; unrelated project kinds remain generic and are not claimed by the home adapter.

Do **not** add a second property registry, construction clock, construction-material wallet, home-only inventory, storage-capacity formula, or UI-owned economy/property state.

### Persistence and validation

Data advances `31 -> 32` because the canonical home-improvement definition and its material-to-durable-benefit contract are authored data.

Game State remains 5 because the active project fits the existing generic `state.projects.records[].data` contract, labor uses existing timed tasks, and the completed benefit uses existing `inventoryState.mogHouse.placedFurniture` state. Account Save remains 4 because the account/session/character registry is unchanged.

Canonical validation now checks:

- home-infrastructure authored material/furnishing references;
- recognized home-project metadata against the catalog;
- completed home projects claiming applied furnishing benefits actually have that furnishing present.

Existing equipment validation was preserved after a promotion regression exposed an accidentally omitted `augments` validation call. The final runtime checkpoint includes the repair and is fully green.

### End-to-end regression

`tests/playerHomeInfrastructureFlow.test.js` proves:

- authored catalog validation;
- initial 3-slot furnishing capacity;
- derived Home & Foothold Journal presentation;
- semantic Plan / contribute / Start actions;
- canonical materials consumed exactly once;
- active construction persists through real account save/load;
- canonical activity advance completes `project.labor`;
- Storage Chest is applied exactly once;
- capacity becomes 8 slots;
- repeated reconciliation cannot duplicate the benefit;
- completed benefit survives real save/load;
- game-state validation remains clean;
- rendered Journal copy does not expose internal project/task/`mogHouse`/completion identifiers.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- generic projects as the shared material + labor + completion substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- command routes as optional power/diagnostic surfaces;
- acquired-knowledge privacy for maps/routes/resources/contacts/search;
- safe settlements intentionally omitting wilderness D-pad/minimap controls;
- provenance and one-time source/sink ownership;
- battle progression rewards separate from physical body recovery;
- commitments separate from relationships and both separate from Journal projection;
- scheduled transport owning fare/cadence/cargo/departure/arrival;
- transport and settlement service boards as derived presentation only;
- player information/search as derived/transient presentation only;
- production engine owning recipes/work/input/output/mastery;
- shop engine owning actual transactions and wallet changes;
- persistent NPC-backed companions with party/battle/travel responsibilities kept separate;
- furnishings/inventory owning actual home-storage capacity;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Known non-blocking debt

- the internal `mogHouse` key/module name remains legacy terminology; ordinary player-facing copy is already original/generic. Do not rename the persisted internal contract incidentally—do so only in a bounded schema/terminology cleanup if the simplification is worth the change;
- broader property/building ownership, workshops, agriculture, logistics, social schedules, companion breadth, and earned automation remain future Phase 0.8 work;
- original currency terminology is still deferred;
- recurring GitHub action-runtime Node deprecation warning remains warning-only.

## Next work

**Do not automatically launch another Phase 0.8 track from this handoff.** A new user work order should choose one bounded life/infrastructure seam and audit the existing authority/data path before implementation.

Good candidate bounded tracks include:

- workshop/home-production depth;
- agriculture/stewardship;
- logistics/warehousing/transport capacity;
- social schedules and relationship life;
- companion life breadth;
- earned automation that reduces attention only after demonstrated investment/mastery.

Whichever track is selected, grow from existing materials, fictional time, projects/work, inventory, locations, relationships, party, production, transport, and service authorities rather than creating an isolated management minigame.
