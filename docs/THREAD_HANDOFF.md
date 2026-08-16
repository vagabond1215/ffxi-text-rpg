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

This does not relax determinism, validation, provenance, exactly-once ownership, content originality, map privacy, or test discipline.

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

Maps and campaign guidance represent acquired character knowledge, not omniscient authored geography. Authored coordinates, undiscovered extent, hidden routes, and remote resource sites remain internal. Canonical fictional time is separate from wall-clock scheduling. Resources have physical/economic/social provenance. Companions are persistent NPC-backed people, not summons. Commitments and general NPC relationships are canonical gameplay state; the Journal is only a projection/ranking/grouping surface.

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

Authoritative audited runtime checkpoint for PX-5:

```text
cc78f3a5b72c4c793ad8f7f3e1a2f83b001aa9d6
Render PX5 Journal as regional readiness groups
```

At that runtime checkpoint:

```text
tests       476
pass        476
fail        0
benchmark   success
Data        28
```

Benchmark 1 remains comparable and within the current soft-budget discipline. The runtime checkpoint reported approximately 0.450 ms/op player profile creation, 0.130 ms/op enemy profile creation, 0.544 ms/op basic attacks, 0.00465 ms/op tick dispatch, and 0.859 ms/op direct-route lookup. PX-5 did not change the benchmark protocol or route-lookup algorithm.

GitHub Actions ran project tests with Node 20.20.2. The recurring warning that Node 20-based GitHub actions are forced through a newer action runtime remains warning-only; project tests and Benchmark 1 are green.

Documentation commits after the runtime checkpoint synchronize the PX path, architecture, roadmap/versioning where relevant, and this handoff. Verify the final documentation-only head's Check/Pages before beginning new implementation.

## Current Phase 0.7 registrations

```text
activityAdvance:            0.1.0
commitments:                0.1.0
relationships:              0.1.0
dayCycle:                   0.2.0
gameViewModels:             0.7.0
playerExperience:           0.3.0
playerOpportunities:        0.2.0
playerContinuity:           0.3.0
playerCampaignReadability:  0.1.0
domUi:                      0.5.0
uiIntents:                  0.5.0
```

Data remains 28 because PX-5 adds derived readability and semantic access to existing transport authority rather than a new authored-data or persistence contract. Product/Package/Account Save/Game State/Benchmark also remain unchanged. Do not inflate Product to `0.7.100` merely because PX-5 is coherent.

## Phase 0.7 player-experience path

`docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` is authoritative for the player-facing sequence:

- **PX-1 — Arrival and footing:** implemented.
- **PX-2 — First-day opportunities:** implemented.
- **PX-3 — First regional loop:** first bounded Brasshaven/Redstone loop implemented.
- **PX-4 — Several-day continuity:** first bounded commitment/relationship/day-review/save-load proof implemented and audited.
- **PX-5 — Multi-region campaign readability:** first acquired-knowledge regional grouping/readiness proof implemented and audited.
- **PX-6 — Danger, combat, and recovery in the ordinary campaign:** **next bounded unit**.

The guidance/readability layer is a projection over canonical gameplay state, not a second simulation, quest, travel, or campaign authority.

## PX-1 through PX-3 — established player footing and regional loop

All three current origins provide a real first contact and regional horizon:

| Origin | Starting locality | First contact | Horizon |
| --- | --- | --- | --- |
| Thornwall | Thornwall Southgate | Sera Talwin | Elderwood |
| Brasshaven | Brasshaven Market Ring | Marshal Varric Stone | Redstone Reach |
| Mistmere | Mistmere Canal Ward | Reader Soli Venn | Starfen |

The Brasshaven proving loop is:

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

`activityAdvanceEngine` provides semantic completion of active travel/work without inventing another clock. Gathering/production/travel authorities remain canonical.

## PX-4 — canonical several-day continuity

### Commitment authority

Data:

```text
js/text/data/commitments.js
```

Runtime:

```text
js/text/systems/commitmentEngine.js
```

First proving commitment:

```text
commitment-brasshaven-copper-return
Copper for the Ring
Giver: Marshal Varric Stone
Requirement: 1 Redstone Copper Ingot transformed by process-redstone-copper-ingot
Reward: 36 gil + familiarity/respect relationship change
Follow-up: one later fictional day
```

`state.commitments` owns acceptance, active/resolved state, exactly-once reward ownership, resolution timestamps/day, and follow-up readiness/seen state.

### General named-NPC relationship authority

```text
js/text/systems/relationshipEngine.js
```

`state.relationships` owns familiarity, respect, trust, and obligation for general named NPCs. This remains distinct from companion-specific relationship state because party companions have additional character/party semantics.

### PX-4 audit repairs that remain invariants

- Same-ID stackable items with different provenance structures do not merge.
- Commitment delivery plans and consumes only provenance-qualified stack quantities.
- The real local-account `saveGame` / `loadCharacter` path is tested across resolution, day transition, follow-up, repeat handling, and exactly-once reward ownership.
- Top-level current-state validation owns commitment/relationship registries; world validation owns the canonical commitment catalog.
- Later-day Varric follow-up competes with another valid use of character time rather than becoming the only breadcrumb.

## PX-5 — implemented and audited

### Readability authority

```text
js/text/systems/playerCampaignReadabilityEngine.js
```

This is a **pure presentation decorator** over the existing player-opportunity + continuity model. There is no persisted `state.campaignReadability` registry.

The layer derives:

- region labels and current-region emphasis;
- readiness ordering (`active`, `ready`, `available`, `blocked`, `complete`);
- per-group readiness counts;
- knowledge-source metadata describing why an opportunity is currently knowable;
- one bounded cross-region Copper Trail Clasp proof that composes existing locality, scheduled transport, direct travel, inventory/equipment, commitment/relationship, ecology, work, and production authorities.

### Journal presentation

`domRenderer.js` consumes the derived opportunity groups as actual semantic Journal sections. Region/continuity headings own the hierarchy and show readiness counts; cards retain what/why/progress/requirements/blockers/actions without repeating the group name as visual noise.

### Acquired-knowledge privacy proof

The Brasshaven -> Redstone Reach -> Starfen horizon now distinguishes **known ambition** from **known implementation detail**:

1. Before Varric's canonical later-day follow-up, the Journal does not manufacture a Starfen campaign lead merely because Starfen records exist in authored data.
2. After the follow-up, Starfen reed fiber becomes a known larger objective, but the remote Tall Reedbed/source record remains hidden.
3. Brasshaven Market Ring exposes the next real local action to Iron Quay, not every authored route node.
4. At Iron Quay, the existing Forge–Mere caravan becomes the relevant travel authority.
5. The real fare for the proving Iron Quay -> Mistmere Reedport trip is 52 gil. PX-4 leaves 36 gil, so the Journal truthfully shows a **blocked** known route rather than granting free travel or an implicit teleport.
6. When canonical funds are sufficient, the same opportunity exposes semantic `transport.start`, which delegates directly to `startScheduledTransport` and preserves fare/cadence/cargo/time rules.
7. At Mistmere Reedport, the real route into West Starfen becomes a semantic `travel.start` action.
8. Only after reaching West Starfen does the exact Tall Reedbed source become locally visible; its cutting-tool requirement remains authoritative.

This proves multi-region readability without a global quest database, hidden topology leak, or duplicate travel state.

Important tests:

```text
tests/playerCampaignReadability.test.js
tests/commitmentContinuity.test.js
tests/playerContinuityFlow.test.js
tests/playerOpportunity.test.js
```

## Stable authority boundaries

Preserve these while continuing Phase 0.7:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of stats, learned skills/capabilities, and work mastery;
- active discipline is training/context, not universal use identity;
- semantic DOM/view-model/intents are the normal browser presentation/action direction;
- command/slash routes are bounded adapters/power surfaces, not required player knowledge;
- map and campaign presentation are acquired knowledge; raw coordinates, hidden authored extent, remote resource sites, and unreachable route actions remain private;
- safe settlements intentionally omit wilderness minimap/D-pad exploration controls;
- resource acquisition/transformation/delivery/rewards preserve provenance and source/sink reasoning;
- different provenance histories must not be erased by same-ID inventory stacking;
- commitments own commitment state/reward ownership; relationships own general NPC social state; Journal/readability owns neither;
- scheduled transport owns its real fare/cadence/cargo/departure/arrival behavior; a semantic UI action may call it but may not bypass it;
- companions are persistent NPC-backed people whose party state composes with Combat 2.0 and travel;
- content-pack ownership/dependencies and cross-reference validation remain the scale mechanism;
- current schema quality takes priority over old pre-alpha save compatibility.

## Relevant deferred technical debt

- Historical migration code and compatibility adapters still exist; remove/consolidate only in bounded cleanup rather than extending them reflexively.
- Legacy-shaped POI stable IDs remain internally, including the Brasshaven commitment giver POI.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and other transitional internal names remain.
- Some DOM information views still bridge command output; Search-or-act is still command-capable rather than true semantic fuzzy search.
- `playerContinuityEngine` and `playerCampaignReadabilityEngine` contain first-slice Brasshaven/copper knowledge; prove another real slice before generalizing them into universal quest/campaign infrastructure.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- The active Craft browser view still needs a richer dedicated production surface.
- The active DOM layout still has visible vertical-density/hierarchy debt in safe-locality play. Do not solve this by restoring wilderness minimap/D-pad controls in safe settlements; their omission there is intentional locality policy.
- Most importantly, the ordinary `0.7.100` campaign flow still lacks a single end-to-end proof that meaningfully composes danger/combat/recovery with livelihood, travel, commitment, several-day continuity, and the new multi-region readability layer.

## Next bounded unit — PX-6 danger/combat/recovery composition

Do **not** start with a replacement encounter campaign system, broad enemy catalog expansion, or mass-authored dungeon content.

Use the already-proven Brasshaven / Redstone / Starfen corridor and existing combat/ecology/recovery authorities to prove one normal-player sequence where danger belongs to the same campaign rather than a disconnected combat demo.

The PX-6 proof should:

1. surface one meaningful field threat from actual current regional ecology/encounter data through semantic browser UI;
2. make pursuing or avoiding that threat compete with livelihood/travel/campaign goals rather than replacing them;
3. enter and resolve Combat 2.0 through canonical fictional-time readiness/interrupt rules and normal semantic actions;
4. preserve companion participation if a persistent companion is active, without making a companion mandatory for the proof;
5. award victory resources/currency/EXP exactly once and leave creature materials as canonical recoverable world opportunities where applicable;
6. make post-combat recovery/resource handling legible through existing recovery, inventory, settlement/service, and fictional-time authorities;
7. prove defeat/recovery or a bounded loss/recovery path is coherent enough that combat has consequence rather than functioning as a free reset;
8. return the player to the same persistent multi-region campaign after combat/recovery, with Journal/readability state still derived from canonical world/character state;
9. preserve save/load, provenance, validation, and exactly-once guarantees.

After a coherent PX-6 checkpoint, audit whether `0.7.100` has enough multi-region/community breadth for closure or whether one further bounded breadth/content unit is still justified. Do not silently declare `0.7.100` complete.

Stop after PX-6 and its necessary audits/docs unless the user explicitly asks to continue farther.
