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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/service/information models are derived presentation.

## Current baseline

```text
Product:       0.7.400.1
Package:       0.7.400
Account Save:  4
Game State:    5
Data:          31
Benchmark:     1
Codename:      Companion Life and Party Depth
Compatibility: pre-release-current-schema
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete. The project remains pre-alpha and unreleased.**

Authoritative promoted `0.7.400` runtime checkpoint:

```text
1e217fe1f7e62593fa9ed33eebdf1b3878490336
Register companion and party database contracts at 0.2.0
```

At that checkpoint:

```text
tests       495
pass        495
fail        0
skipped     0
benchmark   success
Data        31
```

Benchmark 1:

```text
1,000 player combat profiles     470.213ms  0.470213ms/op
1,000 enemy combat profiles      124.768ms  0.124768ms/op
1,000 basic attacks              538.006ms  0.538006ms/op
10,000 ticks / 5 subscribers      50.197ms  0.005020ms/op
10,000 direct route lookups     8612.637ms  0.861264ms/op
```

GitHub Actions project tests use Node 20.20.2. The recurring action-runtime Node deprecation warning remains warning-only.

Documentation commits after the runtime checkpoint synchronize roadmap, player-experience path, architecture, versioning, and this handoff. Before new implementation, verify the current `main` documentation head's Check and Pages results if they are not already recorded in the thread that produced the handoff.

## Final Phase 0.7 registrations

```text
versionManifest:              0.7.400.1
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
playerInformation:            0.1.1
gameViewModels:               0.12.0
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.10.0
uiIntents:                    0.9.0
companionCatalog:             0.2.0
party:                        0.2.0
companions:                   0.2.0
```

`js/text/data/databaseRegistry.js` also records `companions` and `party` as implemented `0.2.0` contracts.

## Completed Phase 0.7 sequence

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
- **`0.7.400` — Companion life, party depth, and character POV:** implemented/audited; closed Phase 0.7.

## Stable campaign/community baseline

Three established several-day community loops remain canonical:

- Thornwall / Sera Talwin / Elderwood — `Sweetroot for Southgate`;
- Brasshaven / Marshal Varric Stone / Redstone — `Copper for the Ring`;
- Mistmere / Reader Soli Venn / Starfen — `Marrowleaf for the Ward`.

`playerContinuityEngine` projects all actually known commitment definitions. Commitment, relationship, gathering, travel, day, and persistence systems retain authority.

PX-9 scheduled transport, `0.7.200` settlement service/economy, and `0.7.300` information/search surfaces remain stable derived presentation over existing authorities.

## `0.7.400` companion-life contract

Mara Venn is the proving companion and remains one persistent backing NPC.

Her companion catalog v2 definition provides two voiced field approaches:

```text
Guard the Road
  “Stay inside my reach. We get home together.”
  favors evasion over attack

Seek the Opening
  “Hold their eye. I'll find the seam.”
  favors attack over caution
```

The selected approach lives in Mara's **existing party tactics record**. It is a preparation choice outside combat, persists through real account save/load, and follows the same companion through canonical travel. Battle creation reads the choice and derives temporary battle-entry attributes; permanent character attributes are not rewritten.

Do not turn this into a second progression or AI framework. Current authority boundaries are deliberate:

- companion catalog owns authored definitions/voice/approach effects;
- party authority owns recruitment, active membership, companion condition/location, relationship/tactics record, and backing-NPC synchronization;
- battle authority owns battle entities/actions/resources;
- travel/recovery authorities move and recover the active party;
- Character UI is presentation and dispatches semantic intents.

`tests/playerCompanionLifeFlow.test.js` guards the real tradeoff, permanent-stat non-mutation, battle-time change lockout, save/load persistence, and NPC identity through travel.

## Character-POV / immersion boundary

The `0.7.400` audit established a stronger presentation law:

> Ordinary character-facing information should tell the player what the character **sees, knows, carries, remembers, needs, or can decide**.

Architecture, roadmap plans, compatibility notes, raw task/state channels, hidden topology, and implementation rationale must not leak into normal player prose.

The pass cleaned Scene/Character/Spellbook/Journal/Codex/Craft/World presentation and representative encounterable places/POIs. It replaced raw/internal phrases such as task-channel labels, “fictional minutes,” “authored world,” development placeholders, numeric danger, and software explanations of map/service behavior with present-world language.

`tests/playerPointOfViewPresentation.test.js` and `tests/playerFacingLanguage.test.js` are the primary regressions for this boundary.

## Phase 0.7 closure decision

**PASS. Phase 0.7 is complete at Product `0.7.400.1`. Do not reopen it merely because later breadth is desirable.**

The combined Phase 0.7 proofs satisfy the playable-alpha gate:

- ordinary first actions and competing ambitions are understandable without command expertise;
- three connected persistent communities support several-day social/economic loops;
- livelihood/resources/provenance/production/trade/mastery feed preparation and larger ambitions;
- danger/combat/body recovery/defeat return to the same campaign;
- semantic scheduled transport connects the proving communities;
- settlement return offers real work/trade/recovery/preparation/social choices;
- acquired/current search and maps preserve hidden-topology privacy;
- current-format save/load preserves continuity without duplicate rewards/fares/trades/progress;
- Mara remains the same persistent person and creates a meaningful persistent pre-battle decision;
- character-facing information is simple, decision-first, and increasingly immersive rather than implementation-facing.

## Deferred depth after Phase 0.7

These are later-phase breadth unless a future work order demonstrates a concrete blocker:

- broader companion dialogue/equipment/progression/goals/schedules and relationship consequences;
- richer generic NPC/vendor voice and social density;
- a few optional utility/combat/wilderness command adapters outside the core ordinary information path;
- further safe-locality density/hierarchy refinement without restoring wilderness controls there;
- deliberate original-currency terminology replacing current `gil` wording;
- authored paid/service-quality recovery rather than fabricated fees;
- broader life/infrastructure and difficult adventure content.

## Stable authority boundaries to preserve

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
- transport and settlement service boards as derived presentation only;
- player information/search as derived/transient presentation only;
- production engine owning recipes/work/input/output/mastery;
- shop engine owning actual transactions and wallet changes;
- persistent NPC-backed companions with party/battle/travel responsibilities kept separate;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Next work

**Do not automatically start Phase 0.8.** The next user request should first choose a bounded Phase 0.8 life/infrastructure track from the roadmap and audit the existing authority/data seam relevant to that track before implementation.
