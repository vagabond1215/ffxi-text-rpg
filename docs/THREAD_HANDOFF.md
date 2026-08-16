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

Maps represent acquired character knowledge, not omniscient authored geography. Authored coordinates remain internal. Canonical fictional time is separate from wall-clock scheduling. Resources have physical/economic/social provenance. Companions are persistent NPC-backed people, not summons. Commitments and general NPC relationships are canonical gameplay state; the Journal is only a projection/ranking surface.

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

Authoritative audited runtime checkpoint for PX-4:

```text
ee3937b3bd9d60024937548ef09776e7677f0e97
Lock PX4 continuity into top-level validation
```

At that runtime checkpoint:

```text
tests       474
pass        474
fail        0
benchmark   success
Data        28
```

GitHub Actions ran project tests with Node 20.20.2. The recurring warning that Node 20-based GitHub actions are forced through a newer action runtime remains warning-only; project tests and Benchmark 1 are green.

Documentation commits after the runtime checkpoint synchronize PX path, roadmap, versioning, architecture, and this handoff. Verify the final documentation-only head's Check/Pages before beginning new implementation.

## Current Phase 0.7 registrations

```text
activityAdvance:     0.1.0
commitments:         0.1.0
relationships:       0.1.0
dayCycle:            0.2.0
gameViewModels:      0.6.0
playerExperience:    0.3.0
playerOpportunities: 0.2.0
playerContinuity:    0.2.0
domUi:               0.4.0
uiIntents:            0.4.0
```

Data advanced to 28 for the canonical commitment/general-NPC-relationship continuity contract. Product/Package/Account Save/Game State/Benchmark did not advance. Do not inflate Product to `0.7.100` merely because PX-4 is coherent.

## Phase 0.7 player-experience path

`docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` is authoritative for the player-facing sequence:

- **PX-1 — Arrival and footing:** implemented.
- **PX-2 — First-day opportunities:** implemented.
- **PX-3 — First regional loop:** first bounded Brasshaven/Redstone loop implemented.
- **PX-4 — Several-day continuity:** first bounded commitment/relationship/day-review/save-load proof implemented and audited.
- **PX-5 — Multi-region readability:** **next bounded unit**.

The guidance layer is a projection over canonical gameplay state, not a second simulation or quest authority.

## PX-1 — implemented

All three current origins provide a real first contact and regional horizon:

| Origin | Starting locality | First contact | Horizon |
| --- | --- | --- | --- |
| Thornwall | Thornwall Southgate | Sera Talwin | Elderwood |
| Brasshaven | Brasshaven Market Ring | Marshal Varric Stone | Redstone Reach |
| Mistmere | Mistmere Canal Ward | Reader Soli Venn | Starfen |

Orientation derives from canonical origin/place/POI discovery. While un-oriented, the guide is promoted to the first semantic contextual action. After meeting the guide, the game opens non-exclusive training, livelihood, exploration, and preparation paths.

Canonical new-game time remains 08:00 fictional world time from `gameState`; UI code must not own a duplicate product default.

## PX-2 — implemented

Primary authority:

```text
js/text/systems/playerOpportunityEngine.js
```

The Journal answers what can be pursued, why it matters, requirements/preparation, and persistent progress. All origins can claim and equip a real first field tool through semantic actions. Opportunities are projections over real shops, equipment, ecology, travel, services, capabilities, and world state; unavailable future systems must not masquerade as live actions.

## PX-3 — implemented bounded regional-loop proof

Current proving corridor:

```text
Brasshaven
  -> prepare with Prospector Pick
  -> travel to Redstone Reach
  -> gather copper through canonical timed work
  -> return to Brasshaven
  -> use real forge/workstation context
  -> process Copper Ingot
  -> retain material provenance + character-owned work mastery
  -> expose Copper Trail Clasp / Starfen as larger ambition
```

`activityAdvanceEngine` provides semantic completion of the active travel/work activity without inventing another clock. Gathering/production engines remain canonical domain authorities.

## PX-4 — implemented and audited

### Canonical commitment

Data authority:

```text
js/text/data/commitments.js
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

Runtime authority:

```text
js/text/systems/commitmentEngine.js
```

`state.commitments` owns acceptance, active/resolved state, exactly-once reward ownership, resolution timestamps/day, and follow-up readiness/seen state. Journal/UI code must not duplicate these flags.

### General named-NPC relationships

Runtime authority:

```text
js/text/systems/relationshipEngine.js
```

`state.relationships` owns general NPC relationship dimensions:

```text
familiarity
respect
trust
obligation
```

Relationship changes emit structured `relationship.changed` events. This authority is separate from companion-specific relationship state because companions have party/character semantics beyond general world contacts.

### Journal/day continuity

Projection authority:

```text
js/text/systems/playerContinuityEngine.js
```

The current continuity projection is intentionally tied to the Brasshaven copper proof. It surfaces canonical commitment status, latest structured day review, later-day Varric follow-up, and competing uses of time. Do not generalize this into a universal quest/reputation framework until another real slice proves a reusable shape.

### Semantic intent path

Ordinary browser play can accept, resolve, and follow up through semantic commitment intents. Command strings are not required for the proven PX-4 flow.

### PX-4 audit repairs

The audit found and repaired four authority defects:

1. **Provenance-safe stacking:** same-ID stackable items with different provenance structures no longer merge in `inventoryEngine`.
2. **Provenance-qualified commitment consumption:** requirement checking and actual delivery now consume the same qualifying provenance-bearing stack quantities; unrelated same-ID material is left untouched.
3. **Real persistence proof:** tests use the actual local account `saveGame` / `loadCharacter` path across resolution, day boundary, follow-up, second save/load, and exactly-once repeat handling rather than only JSON cloning.
4. **Top-level validation:** current-state validation now requires/validates commitment and relationship registries; world validation includes the canonical commitment catalog.

Focused flow coverage also proves that the next-day social follow-up competes with another valid action rather than becoming the only mandatory breadcrumb.

Important tests:

```text
tests/commitmentContinuity.test.js
tests/playerContinuityFlow.test.js
tests/playerExperience.test.js
```

## Stable authority boundaries

Preserve these while continuing Phase 0.7:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of stats, learned skills/capabilities, and work mastery;
- active discipline is training/context, not universal use identity;
- semantic DOM/view-model/intents are the normal browser presentation/action direction;
- command/slash routes are bounded adapters/power surfaces, not required player knowledge;
- map presentation is acquired knowledge; raw coordinates and hidden authored extent remain private;
- safe settlements intentionally omit wilderness minimap/D-pad exploration controls;
- resource acquisition/transformation/delivery/rewards preserve provenance and source/sink reasoning;
- different provenance histories must not be erased by same-ID inventory stacking;
- commitments own commitment state/reward ownership; relationships own general NPC social state; Journal owns neither;
- companions are persistent NPC-backed people whose party state composes with Combat 2.0 and travel;
- content-pack ownership/dependencies and cross-reference validation remain the scale mechanism;
- current schema quality takes priority over old pre-alpha save compatibility.

## Relevant deferred technical debt

- Historical migration code and compatibility adapters still exist; remove/consolidate only in bounded cleanup rather than extending them reflexively.
- Legacy-shaped POI stable IDs remain internally, including the Brasshaven commitment giver POI.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and other transitional internal names remain.
- Some DOM information views still bridge command output; Search-or-act is still command-capable rather than true semantic fuzzy search.
- `playerContinuityEngine` currently contains first-slice Brasshaven/copper knowledge; prove another real continuity slice before generalizing.
- `gil` remains current currency terminology pending deliberate original-currency design.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- The active Craft browser view still needs a richer dedicated production surface.
- The ordinary `0.7.100` campaign flow still lacks a single end-to-end proof that meaningfully composes danger/combat/recovery with livelihood, travel, commitment, and several-day continuity.
- The active DOM layout still has visible vertical-density/hierarchy debt in safe-locality play. The screenshot from the preceding thread showed excess blank vertical space, a weakly weighted primary Scene, and oversized bottom information tabs. **Do not solve this by restoring the wilderness minimap/D-pad in safe settlements**; their omission there is intentional locality policy.

## Next bounded unit — PX-5 multi-region campaign readability

Do **not** start with mass-authored content or a global quest database.

Use the already-proven Brasshaven -> Redstone Reach -> Starfen horizon to make several known opportunities readable without omniscience.

The PX-5 proof should:

1. derive region/goal visibility only from acquired canonical knowledge such as discovered places/routes/POIs/maps, known contacts, canonical commitment/relationship state, inventory/equipment, mastery, and actual reachability;
2. rank or group known opportunities by useful player-facing dimensions such as current region, target region, readiness/preparation, active/ready/distant/completed state, and larger-ambition linkage;
3. preserve direct semantic actions only when the action is genuinely reachable from current state;
4. keep undiscovered places, routes, contacts, resources, and authored topology hidden;
5. prove a fresh-save player can distinguish several short-term goals across the current corridor without needing commands or developer knowledge;
6. retain exactly-once/provenance/save-load/validation guarantees while adding readability.

After a coherent PX-5 checkpoint, audit the remaining `0.7.100` campaign-slice gap. Meaningful danger/combat/recovery composition is still required before the track can close.

Stop after PX-5 and its necessary audits/docs unless the user explicitly asks to continue farther. Do not silently declare `0.7.100` complete.
