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
8. Relevant architecture/runtime/data/tests, especially `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `js/text/version.js`, and the Phase 0.7 systems/tests named below.

## Workflow and pre-alpha schema policy

Work directly on `main` by default. Treat each prompt as a bounded work order and follow the autonomous-session guardrail in `AGENTS.md`.

Hearth & Horizon is pre-alpha. **Old local saves/accounts are not a design constraint.** Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, lazy compatibility state, or adapter layers. Breaking Account Save/Game State/Data contracts is acceptable when it materially simplifies or standardizes the current design; version the current contract deliberately.

This does not relax determinism, validation, provenance, exactly-once ownership, content originality, acquired-knowledge privacy, or test discipline.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is legacy research/reference/migration material only, not canonical world content.

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

Maps and campaign guidance represent acquired character knowledge, not omniscient authored geography. Authored coordinates, undiscovered extent, hidden routes, and remote resource sites remain internal. Canonical fictional time is separate from wall-clock scheduling. Resources have physical/economic/social provenance. Companions are persistent NPC-backed people, not summons. Commitments and general NPC relationships are canonical gameplay state; the Journal is a projection/ranking/grouping surface.

## Current baseline

```text
Product:       0.6.900.1
Package:       0.6.900
Account Save:  4
Game State:    5
Data:          28
Benchmark:     1
Codename:      Integrated Mechanics Gate
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 is in progress. `0.7.100` is not complete.**

Authoritative audited runtime checkpoint for PX-6:

```text
e30bc607faf0e56b784aca54e1f830c0c48fe274
Synchronize pipeline manifest with PX6 versions
```

At that runtime checkpoint:

```text
tests       480
pass        480
fail        0
benchmark   success
Data        28
```

Benchmark 1 remains comparable. The runtime checkpoint reported:

```text
1,000 player combat profiles     459.380ms  0.459380ms/op
1,000 enemy combat profiles       98.733ms  0.098733ms/op
1,000 basic attacks              506.141ms  0.506141ms/op
10,000 ticks / 5 subscribers      44.849ms  0.004485ms/op
10,000 direct route lookups     7909.264ms  0.790926ms/op
```

GitHub Actions ran project tests with Node 20.20.2. The recurring warning that Node 20-based GitHub actions are forced through a newer action runtime remains warning-only; project tests and Benchmark 1 are green.

Documentation commits after the runtime checkpoint synchronize the PX path, architecture, roadmap, versioning, and this handoff. Verify the final documentation-only head's Check/Pages before beginning new implementation.

## Current Phase 0.7 registrations

```text
activityAdvance:            0.2.0
campaignRecovery:           0.1.0
characterActivity:          0.2.0
commitments:                0.1.0
relationships:              0.1.0
dayCycle:                   0.2.0
resourceRecoveryWork:       0.3.0
gameViewModels:             0.8.0
playerExperience:           0.3.0
playerOpportunities:        0.2.0
playerContinuity:           0.4.0
playerCampaignReadability:  0.2.0
playerDangerRecovery:       0.2.0
domUi:                      0.6.0
uiIntents:                  0.6.0
```

PX-6 does not advance Product, Package, Account Save, Game State, Data, or Benchmark. Recovery progress lives inside existing canonical timed-task/battle state, while danger/recovery Journal entries are derived. Existing enemy/loot/resource data remains authoritative, so Data stays 28.

## Phase 0.7 player-experience path

`docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` is authoritative:

- **PX-1 — Arrival and footing:** implemented.
- **PX-2 — First-day opportunities:** implemented.
- **PX-3 — First regional loop:** first bounded Brasshaven/Redstone loop implemented.
- **PX-4 — Several-day continuity:** first commitment/relationship/day-review/save-load proof implemented and audited.
- **PX-5 — Multi-region campaign readability:** acquired-knowledge regional grouping/readiness proof implemented and audited.
- **PX-6 — Danger, combat, and recovery:** ordinary campaign combat/reward/body/recovery proof implemented and audited.
- **PX-7 — Repeated multi-region/community breadth:** **next bounded unit**.

The guidance/readability/aftermath layers are projections over canonical gameplay state, not second simulation, quest, travel, encounter, recovery, or campaign authorities.

## PX-1 through PX-3 — established footing and regional livelihood loop

All three origins have real first contacts and horizons:

| Origin | Starting locality | First contact | Horizon |
| --- | --- | --- | --- |
| Thornwall | Thornwall Southgate | Sera Talwin | Elderwood |
| Brasshaven | Brasshaven Market Ring | Marshal Varric Stone | Redstone Reach |
| Mistmere | Mistmere Canal Ward | Reader Soli Venn | Starfen |

The first proven material loop is:

```text
meet Varric / claim Prospector Pick
  -> equip real tool
  -> travel to Redstone Reach
  -> gather copper through canonical timed work
  -> return to Brasshaven
  -> use real forge/workstation context
  -> process Copper Ingot
  -> retain provenance + character-owned work mastery
  -> expose Copper Trail Clasp as a larger ambition
```

## PX-4 — canonical several-day continuity

First proving commitment:

```text
commitment-brasshaven-copper-return
Copper for the Ring
Giver: Marshal Varric Stone
Requirement: 1 provenance-qualified Redstone Copper Ingot
Reward: 36 gil + familiarity/respect relationship change
Follow-up: one later fictional day
```

`commitmentEngine` owns acceptance/resolution/follow-up and exactly-once reward ownership. `relationshipEngine` owns general named-NPC familiarity/respect/trust/obligation. The real local-account save/load path is tested across resolution, day transition, follow-up, and repeat handling.

PX-4 invariants:

- same-ID items with different provenance histories do not merge;
- commitment delivery consumes only provenance-qualified stack quantities;
- commitment/relationship registries and commitment definitions are top-level validated authority;
- later-day follow-up competes with another valid use of time rather than becoming the only breadcrumb.

## PX-5 — acquired-knowledge campaign readability

`playerCampaignReadabilityEngine` is a pure presentation decorator. There is no persisted campaign-readability registry.

It derives region grouping, readiness ordering, readiness counts, knowledge-source metadata, and the bounded Copper Trail Clasp cross-region projection. Varric's later-day follow-up can make Starfen reed fiber a known ambition without exposing the remote Tall Reedbed before arrival. Real route/fare/tool blockers remain authoritative.

The current proving travel facts are intentional:

- Brasshaven Market Ring exposes the next local step to Iron Quay, not every route node;
- Iron Quay -> Mistmere Reedport uses the existing Forge–Mere caravan;
- the real proving fare is 52 gil while PX-4 leaves 36 gil, so the Journal truthfully shows a blocked known route until canonical funds suffice;
- at Mistmere Reedport, the real route into West Starfen becomes reachable;
- only after arrival in West Starfen does the local Tall Reedbed become visible.

PX-6 revised the readability projection to version 2 / subsystem `0.2.0`: explicit truthful `regionLabel` supplied by an upstream acquired/current-context opportunity now wins over fallback origin inference. This prevents Redstone combat aftermath from being grouped as Brasshaven.

## PX-6 — ordinary danger, combat, body recovery, and defeat consequence

The first proof uses the existing **Redstone Burrower** in South Redstone Reach so danger competes directly with the proven copper livelihood goal.

The ordinary semantic flow is:

```text
known Redstone livelihood + training goals
  -> choose the field threat
  -> semantic Combat 2.0 encounter
  -> semantic Attack / abilities / Wait
  -> canonical victory or defeat
  -> exactly-once EXP/currency consequence
  -> physical defeated-body opportunity remains in world state
  -> optional tool/proficiency-gated material recovery
  -> timed bodily/party recovery or defeat retreat
  -> resume the same Journal/travel/work/social campaign
```

### Combat authority

`combatActionEngine`, `combatTurnEngine`, `combatSimulationEngine`, existing battle state, and party state remain authoritative. PX-6 adds no campaign-specific combat clock or encounter framework.

Ordinary active-battle **Attack** and **Wait** now use direct semantic intents. Commands remain optional diagnostic/power surfaces.

Victory EXP/currency remain exactly-once `rewardEngine` consequences. Physical creature material is not auto-looted.

### Defeated-body resource authority

The existing `resourceOpportunityEngine` owns body condition, available recovery actions, timed work, outcome roll, inventory insertion, and provenance. `resourceRecoveryWorkAdapter` composes real equipped-tool/work-proficiency requirements.

For the Redstone Burrower:

- canonical action is `extract`;
- `extract` requires `fieldTool:cutting`;
- the Brasshaven Prospector Pick does not satisfy it;
- a cutting-capable Field Knife makes the real recovery action reachable;
- recovered `worm-segment` provenance records the defeated-enemy source and `extract` action;
- repeated reconciliation cannot duplicate the physical material.

`activityAdvanceEngine` can now finish standalone defeated-body recovery through the same fictional-time activity path used by other hands-on work.

### Campaign recovery authority

`campaignRecoveryEngine` is the smallest missing ordinary-campaign recovery primitive and uses canonical persisted timed tasks rather than a new state registry:

```text
recovery.field       10 fictional minutes   partial missing-resource restoration
recovery.settlement  60 fictional minutes   full active-party safe rest
recovery.defeat      120 fictional minutes  retreat to known safe home + bounded partial restoration
```

Defeat is not a free reset. The two fictional hours remain spent, the active party retreats through existing atlas/party location authority, and resources return only partially. Recovery completion marks the persisted task/battle consequence exactly once and emits structured semantic events.

Focused coverage proves an in-progress recovery survives the real `saveGame` / `loadCharacter` path.

`playerDangerRecoveryEngine` adds only derived Journal entries for actual injuries/defeat or actual local defeated-body opportunities. It does not scan hidden remote sources or persist a combat-campaign registry.

Important tests:

```text
tests/playerDangerRecoveryFlow.test.js
tests/phase07Px6Versioning.test.js
tests/playerCampaignReadability.test.js
tests/pipeline.test.js
```

## Stable authority boundaries

Preserve these while continuing Phase 0.7:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of stats, learned skills/capabilities, and work mastery;
- active discipline is training/context, not universal use identity;
- semantic DOM/view-model/intents are the normal browser presentation/action direction;
- command/slash routes are bounded adapters/power surfaces, not required player knowledge;
- map/campaign presentation is acquired knowledge; raw coordinates, hidden authored extent, remote resource sites, and unreachable route actions remain private;
- safe settlements intentionally omit wilderness minimap/D-pad exploration controls;
- resource acquisition/transformation/delivery/rewards preserve provenance and source/sink reasoning;
- battle EXP/currency and physical creature material have distinct exactly-once authorities;
- commitments own commitment state/rewards; relationships own general NPC social state; Journal/readability owns neither;
- scheduled transport owns fare/cadence/cargo/departure/arrival; semantic UI may call it but may not bypass it;
- companions remain persistent NPC-backed people composing with Combat 2.0, travel, and recovery;
- content-pack ownership/dependencies and cross-reference validation remain the scale mechanism;
- current schema quality takes priority over old pre-alpha compatibility.

## Relevant deferred technical debt

- Historical migration code and compatibility adapters remain bounded debt; do not extend them reflexively.
- Legacy-shaped stable POI IDs and transitional fields such as `player.jobs`, `mainJobId`, `raceId`, and `nationId` remain internally.
- Some DOM information views still bridge command output; Search-or-act is command-capable rather than true semantic fuzzy search.
- `playerContinuityEngine` and the Copper Trail projection contain first-slice Brasshaven/copper knowledge; prove a second real community slice before generalizing them into universal quest/reputation/campaign infrastructure.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- The active Craft browser view still needs a richer dedicated production surface.
- Safe-settlement rest is executable but is not a priced/healing-service economy. Do not invent a paid inn, potion, or treatment layer in renderer prose; add one only through a later executable economy/service slice if desired.
- The active DOM layout still has vertical-density/hierarchy debt in safe-locality play. **Do not restore wilderness minimap/D-pad controls in safe settlements**; their omission is intentional.
- `0.7.100` still lacks enough repeated multi-region/community breadth and alternative goals to claim sustained sandbox play. The strongest persistent social continuity remains Brasshaven-centered.

## Next bounded unit — PX-7 repeated multi-region/community breadth

Do **not** start with mass-authored records, a global quest framework, a new dialogue/reputation system, or a replacement encounter/economy layer.

Use a second real community/regional slice—preferably existing Mistmere/Starfen authority—to determine which PX-4/PX-5 social/readability shapes genuinely generalize.

The PX-7 proof should:

1. establish a second persistent named contact/community reason that is not Marshal Varric Stone;
2. connect that community to at least one real livelihood/service reason and one real danger/adventure reason using existing ecology/work/combat/service authorities;
3. create a later consequence or follow-up that survives fictional-day progression and the real save/load path;
4. keep physical/economic/social rewards provenance-aware and exactly once;
5. keep all ordinary required actions reachable through semantic browser UI and acquired knowledge;
6. preserve a meaningful competing alternative with the established Brasshaven/Redstone path rather than forming one mandatory breadcrumb chain;
7. prove repeated redirection among several short-term goals over multiple fictional days;
8. generalize commitment/continuity/readability code only where this second real slice proves a reusable contract.

After a coherent PX-7 checkpoint, re-audit the full `0.7.100` exit criteria. Do not declare the track complete merely because a second slice exists; close only if ordinary multi-session breadth is genuinely sufficient.

Stop after PX-7 and its necessary audits/docs unless the user explicitly asks to continue farther.