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

Hearth & Horizon is pre-alpha. **Old local saves/accounts are not a design constraint.** Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, lazy compatibility state, or adapter layers. Breaking Account Save/Game State/Data contracts is acceptable when it materially simplifies or standardizes the current design; version the current contract deliberately. Existing historical migrations/adapters may remain as bounded technical debt until a focused cleanup, but do not extend them reflexively.

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
Data:          26
Benchmark:     1
Codename:      Integrated Mechanics Gate
Compatibility: pre-release-current-schema
```

**Phase 0.6 is complete. Phase 0.7 is in progress. `0.7.100` is not complete.**

Authoritative green runtime checkpoint for the current player-experience work:

```text
855df41a32b4fdf573ce8d0abff4e0d5594022b1
Align phase gates with pre-release schema policy
```

At that checkpoint:

```text
tests       457
pass        457
fail        0
benchmark   success
Check run   success
Pages       success
```

The recurring GitHub Actions warning about Node 20 action-runtime deprecation remains warning-only; project tests still execute under Node 20.20.2 while GitHub forces deprecated action runtimes through Node 24.

## Phase 0.7 player-experience path

`docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` is the player-facing sequence:

- **PX-1 — Arrival and footing:** why am I here, who should I meet first, how does progress work?
- **PX-2 — First-day opportunities:** what can I pursue now, why care, what preparation is needed, what persistent progress results?
- **PX-3 — First regional loop:** settlement -> goal -> prepare -> travel -> accomplish -> recover/produce -> return -> resolve -> larger ambition.
- **PX-4 — Several-day continuity:** follow-up, relationships/reputation, changing local needs, day-review meaning, competing uses of time.
- **PX-5 — Multi-region readability:** rank/group known opportunities without omniscient quest-list behavior.

The guidance layer is a projection over canonical gameplay state, not a second simulation or quest authority. Real commitments/contracts added later must be canonical state with semantic events and exactly-once reward ownership.

## PX-1 — implemented

Primary files:

```text
js/text/data/playerExperienceContent.js
js/text/systems/playerExperienceEngine.js
js/text/data/characterCreationContent.js
js/text/systems/characterCreationModel.js
js/text/systems/poiEngine.js
js/text/ui/gameViewModel.js
js/text/data/questHooks.js
tests/playerExperience.test.js
docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md
```

### Origin-specific first-session experience

All three current origins now provide a real first contact and regional horizon:

| Origin | Starting locality | First contact | Horizon |
| --- | --- | --- | --- |
| Thornwall | Thornwall Southgate | Sera Talwin | Elderwood |
| Brasshaven | Brasshaven Market Ring | Marshal Varric Stone | Redstone Reach |
| Mistmere | Mistmere Canal Ward | Reader Soli Venn | Starfen |

Legacy-shaped POI IDs remain internal technical debt; player-facing names/content are canonical Hearth & Horizon.

Character-creation opening prose now explains the arrival circumstance, starting training as a discipline rather than a permanent class, the first contact, and the first regional horizon.

### Semantic orientation flow

`createPlayerExperienceModel(state)` currently derives:

- `orientation` until the origin guide POI is discovered;
- `foothold` after the guide is met in a safe settlement;
- `expedition` while in dangerous/wilderness/dungeon space.

While un-oriented in the starting locality, the guide is promoted to the **first contextual semantic action** through `locality.poi`; no command string is manufactured.

The Scene description also states the clearest next step. After the guide is met, the guidance changes to four non-exclusive progress paths:

```text
training
livelihood
exploration
preparation
```

Guide dialogue explains the project law in setting-friendly terms: repeated effort should return skill, material capability, knowledge, preparation, or useful connections that make larger ambitions possible.

Guide completion is derived from canonical POI discovery state. This is intentional state normalization, not a save-compatibility workaround: persisting a duplicate onboarding flag would create competing authority.

### Canonical commission presentation

Quest/commission presentation records were rewritten to original-world Thornwall/Brasshaven/Mistmere names and descriptions. Unimplemented formal contracts no longer masquerade as working quest systems; current text explicitly says when no formal tracked commission is posted.

Stable internal legacy-shaped POI IDs remain until a separate ID-cleanup migration/refactor is justified.

## Canonical new-game time

`js/text/gameState.js` now owns one default new-game start time:

```text
08:00 fictional world time
```

`DEFAULT_START_WORLD_TIME_SECONDS = 8 * 60 * 60` is the product authority. Character-creation UI no longer carries a duplicate time default.

Low-level timing/mechanics tests use `tests/helpers/createTestState.js` to request an explicit zero-based clock where that makes assertions clearer. Tests no longer inherit an accidental product-default epoch.

## Compatibility policy correction

`js/text/version.js` now reports:

```text
Compatibility: pre-release-current-schema
playerExperience subsystem: 0.1.0
```

The historical Phase 0.5/0.6 gates were updated so later current-schema versions can remain valid without requiring migration-first compatibility:

- Account Save and Game State checks are minimum phase-contract checks rather than exact-version freezes;
- compatibility checks require the current `pre-release-current-schema` policy;
- the simulation substrate gate group is now `persistenceContract`, not `persistenceCompatibility`;
- old migration tooling remains available but no longer determines current project health.

Do not restore `migrate-supported-save-versions` merely to satisfy historical assertions.

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
- current schema quality takes priority over old pre-alpha save compatibility.

## Relevant deferred technical debt

- Historical migration code and several compatibility adapters still exist; remove/consolidate only in a bounded cleanup rather than extending them.
- Legacy-shaped POI stable IDs still exist internally.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and other transitional internal names remain.
- Some DOM information views still bridge command output.
- Search-or-act remains command-capable rather than true semantic fuzzy search.
- The active Journal remains thin and does not yet render a dedicated opportunities model.
- Formal tracked commission/contract state does not yet exist.
- Canvas modules remain regression/reference code; active browser UI is semantic DOM.
- Companion tactical/dialogue/equipment/progression breadth remains intentionally small.
- `gil` remains current currency terminology pending deliberate original-currency design.

## Next bounded unit — PX-2 first-day opportunities

Do **not** start by mass-authoring content or by creating a parallel quest framework.

Implement a dedicated semantic Journal/Opportunities presentation layer using current world knowledge and existing mechanics. It should answer four questions for each surfaced opportunity:

1. What can I pursue now?
2. Why would I care?
3. What preparation/conditions are required?
4. What persistent progress can result?

Use existing capability/work/ecology/travel/shop/NPC/progression authorities to surface only opportunities that are real enough to act on. Route actions through semantic intents where available. If the slice proves that a real persistent commitment/contract primitive is missing, add one clean canonical state model rather than compatibility scaffolding or renderer-owned quest state.

Stop after a coherent PX-2 checkpoint; do not silently continue into the full PX-3 regional campaign loop.