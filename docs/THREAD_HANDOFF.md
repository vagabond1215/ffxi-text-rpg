# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. Relevant architecture/runtime/data/tests, especially `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`, `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, and `js/text/version.js`.

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

Maps represent acquired character knowledge, not omniscient authored geography. Authored coordinates remain internal. Canonical fictional time is separate from wall-clock scheduling. Resources have physical/economic/social provenance. Companions are persistent world characters, not summons.

## Current baseline

```text
Product:       0.6.900.1
Package:       0.6.900
Account Save:  4
Game State:    5
Data:          27
Benchmark:     1
Codename:      Integrated Mechanics Gate
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 is in progress. `0.7.100` is not complete.**

Authoritative green runtime checkpoint for the current player-experience work:

```text
39d9912011691477d6443fa57da1bc3594b1b6f2
Assert Phase 0.7 slice version registrations
```

At that checkpoint:

```text
tests       464
pass        464
fail        0
benchmark   success
Check run   success
Pages       success
```

The Benchmark 1 workload at this checkpoint reports Data 27. The recurring GitHub Actions warning about Node 20 action-runtime deprecation remains warning-only; project tests execute under Node 20.20.2 while GitHub forces deprecated action runtimes through Node 24.

## What Phase 0.7 has landed

`docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` is the player-facing sequence. PX-1, PX-2, and the first bounded PX-3 regional loop are now implemented.

### PX-1 — arrival and footing

All three current origins provide a real first contact and regional horizon:

| Origin | Starting locality | First contact | Horizon |
| --- | --- | --- | --- |
| Thornwall | Thornwall Southgate | Sera Talwin | Elderwood |
| Brasshaven | Brasshaven Market Ring | Marshal Varric Stone | Redstone Reach |
| Mistmere | Mistmere Canal Ward | Reader Soli Venn | Starfen |

The Scene promotes the guide as the first semantic locality action. Guide dialogue explains persistent progress without creating duplicate onboarding state. New games begin at a canonical 08:00 fictional-world time owned by game state.

### PX-2 — first-day opportunities

Primary additions include:

```text
js/text/systems/playerOpportunityEngine.js
js/text/data/playerExperienceContent.js
js/text/ui/gameViewModel.js
js/text/ui/uiIntentRouter.js
js/text/ui/domUi.js
tests/playerOpportunity.test.js
```

The Journal now renders a dedicated semantic opportunity model rather than a thin command list. It answers what can be pursued, why it matters, what preparation is required, and what persistent progress may result.

All three origins can claim and equip a real field tool through semantic UI actions. Livelihood, training/danger, exploration/travel, and settlement/service opportunities are surfaced only when supported by current world/gameplay authority.

### PX-3 — first regional loop

The first complete bounded loop is Brasshaven -> Redstone Reach -> Brasshaven:

```text
meet/prepare in Brasshaven
-> obtain and equip Prospector Pick
-> travel to Redstone Reach
-> gather Redstone copper through canonical timed work
-> complete the active activity through semantic intent
-> return to Brasshaven
-> select the forge/workstation context
-> process copper into a provenance-bearing ingot
-> retain persistent work mastery
-> surface Copper Trail Clasp as the larger ambition
```

The Copper Trail Clasp also requires Starfen reed fiber, so the completed loop points naturally toward a larger cross-regional ambition instead of granting an isolated reward.

An end-to-end test proves the loop leaves and returns with persistent material and mastery gains. This is the first regional-loop proof, **not** completion of `0.7.100`.

## Version registrations for the Phase 0.7 slice

Current runtime registrations are deliberate in-progress contract versions rather than a product milestone bump:

```text
activityAdvance:      0.1.0
gameViewModels:       0.5.0
playerExperience:     0.2.0
playerOpportunities:  0.1.0
domUi:                0.3.0
uiIntents:             0.4.0
Data:                 27
```

Product remains `0.6.900.1` until a coherent `0.7.100` campaign-slice contract is actually closed.

## UI state confirmed from the latest browser screenshot

The current safe-settlement screenshot is consistent with the navigation contract in one important respect: safe locality mode intentionally omits the wilderness minimap and D-pad. Wilderness/exploration mode retains the discovery-safe minimap and compact directional controls.

The screenshot still exposes presentation debt worth addressing in a bounded UI pass rather than confusing it with navigation correctness:

- excessive empty vertical space separates the scene from primary navigation;
- the scene/narrative card feels visually detached from the character/context panes;
- the large bottom category buttons compete with the scene as the dominant interaction surface;
- the right context pane and next-step callout are useful but could participate in a tighter single-screen composition.

Do not reintroduce a map into safe settlement locality merely to fill space. The fix should be spatial hierarchy/composition, not leaking exploration controls into the wrong navigation mode.

## Stable authority boundaries

Preserve these while building Phase 0.7:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of stats, learned skills/capabilities, and work mastery;
- active discipline is training/context, not universal use identity;
- semantic DOM/view-model/intents are the normal browser presentation/action direction;
- command/slash routes are bounded adapters/power surfaces, not required player knowledge;
- map presentation is acquired knowledge; raw coordinates and hidden authored extent remain private;
- resource acquisition/transformation/rewards preserve provenance and source/sink reasoning;
- companions are persistent NPC-backed people whose party state composes with Combat 2.0 and travel;
- content-pack ownership/dependencies and cross-reference validation are the scale mechanism;
- player-experience guidance is a projection over canonical state, never a second quest/simulation authority;
- current schema quality takes priority over old pre-alpha save compatibility.

## Relevant deferred technical debt

- Historical migration code and several compatibility adapters still exist; remove/consolidate only in a bounded cleanup rather than extending them.
- Legacy-shaped POI stable IDs still exist internally.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and other transitional internal names remain.
- Some DOM information views still bridge command output.
- Search-or-act remains command-capable rather than true semantic fuzzy search.
- Formal tracked commission/contract state does not yet exist.
- There is companion-specific relationship state, but no general NPC/community relationship or reputation authority yet.
- The first PX-3 loop contains Brasshaven/Redstone-specific opportunity logic; generalize only when a second real loop proves the reusable shape.
- Current safe-locality DOM composition has excessive vertical whitespace and over-dominant bottom navigation despite correct navigation-mode semantics.
- Canvas modules remain regression/reference code; active browser UI is semantic DOM.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- `gil` remains current currency terminology pending deliberate original-currency design.

## Next bounded unit — PX-4 first continuity proof

Do **not** jump directly to PX-5, mass-author content, or declare `0.7.100` complete.

Anchor the first PX-4 slice to the completed Brasshaven regional loop. Prove that the world remembers what the player did across at least one fictional day and turns that history into a meaningful next choice.

Required shape:

1. Add the smallest reusable canonical social/follow-up state needed to represent an NPC/community consequence. Do not create a broad reputation framework unless the slice proves it necessary.
2. Emit semantic events for that state change and preserve exactly-once ownership.
3. Make a completed Brasshaven loop create or advance one persistent follow-up tied to a named world character/service/community need.
4. Carry that follow-up across a day boundary and current-version save/load.
5. Surface the change in Journal/opportunities and day review without parsing display prose.
6. Present at least one competing valid use of character time so continuity creates a decision rather than a linear quest arrow.
7. Prove the resulting flow with focused tests plus the full suite/benchmark/deploy checkpoint.

Stop after that coherent PX-4 continuity proof. A later bounded unit can widen the pattern to additional origins/regions and decide whether a general contract/reputation model is justified.