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
8. `docs/ARCHITECTURE.md`, `docs/TRANSITIONAL_ARCHITECTURE.md`, `docs/SYSTEM_CATALOG.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `docs/RESOURCE_LIFECYCLE.md`, `js/text/version.js`, and systems/tests relevant to the next bounded work order.

## Workflow and pre-alpha policy

Work directly on `main` by default. Use a branch/PR for risky multi-file runtime refactors or when hosted exact-head validation is useful. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. Old local saves/accounts are **not** a compatibility requirement. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, aliases, lazy reconstruction, or fallback storage keys. A migration is deliberate future engineering work only when explicitly required or independently useful.

Runtime first. Freeze runtime before documentation. Update this handoff last. Report only validation that actually ran.

Autonomous-session discipline from `AGENTS.md` remains binding. If reliable elapsed time is unavailable, use at most six cycles; cycle 6 is stabilization/handoff only.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is legacy research/reference material only.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships remain separate canonical authorities. Presentation/view models remain derived.

## Current baseline

```text
Product:       0.8.600.7
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     1
Codename:      Runtime Architecture Guardrails
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Phases 0.4–0.7 are complete. Phase 0.8 is in progress. Tracks `0.8.100` through `0.8.600` remain complete and audited. Revisions `.2` through `.7` are maintenance/hardening revisions over the closed `0.8.600` track and do **not** open `0.8.700`.

## Promoted maintenance train

The user authorized sequential cleanup/upgrade/fix/consolidation work until input became necessary. Five runtime cycles were promoted, followed by the required sixth-cycle documentation/handoff stabilization.

| Revision | Work | PR | Promoted main commit | Exact-head Check |
| --- | --- | ---: | --- | ---: |
| `0.8.600.3` | Canonical command contract | #326 | `c1fbfbe2629aee628cba4e60af3bed37bef86f7a` | `32108927371` |
| `0.8.600.4` | Strict current-schema persistence | #327 | `ba3f38f05c83175f188b0231c175a89c9310309f` | `32109574064` |
| `0.8.600.5` | Carried commitment delivery | #328 | `0b62b13b25297acad853c2b17be8ffb86a63419f` | `32109997967` |
| `0.8.600.6` | Canonical ActionResult contract | #329 | `268e17f4c5d8de08d1ea2fc68f6017371df4627a` | `32110743314` |
| `0.8.600.7` | Runtime/architecture guardrails | #330 | `f56b2f6f50d481f46babf80b47e13c70672d9176` | `32110997315` |

All five final PR heads passed both Test and Benchmark before merge.

### Latest validated runtime gate

PR #330 / exact head `49124e3d676e81f74fa689c7a60762036915056c` / Check `32110997315` ran on Node 24.19.0:

```text
tests       517
pass        517
fail        0
cancelled   0
skipped     0
Benchmark   success
```

Benchmark 1:

```text
1,000 player combat profiles      410.749ms  0.410749ms/op
1,000 enemy combat profiles        77.986ms  0.077986ms/op
1,000 basic attacks               450.466ms  0.450466ms/op
10,000 ticks / 5 subscribers       55.530ms  0.005553ms/op
10,000 direct route lookups      6347.264ms  0.634726ms/op
```

The runtime was frozen after promotion of `f56b2f6f50d481f46babf80b47e13c70672d9176`. Subsequent cycle-6 commits synchronize documentation only; do not describe them as new runtime validation checkpoints.

## `0.8.600.3` — Canonical Command Contract

Removed the remaining FFXI runtime command compatibility surface rather than preserving aliases indefinitely:

- deleted `js/text/systems/ffxiCommandAdapter.js`;
- deleted runtime `ffxiMacroCommands.js` reference data;
- removed canonical routing aliases such as `trust`, `moghouse`, `jobs`, `races`, `nations`, `zones`, `/ma`, `/ws`, `/ja`, etc.;
- removed the old `ffxiTextRpgSave` reset fallback;
- removed ambiguous `VERSION.app` and `VERSION.save` aliases;
- retained ordinary ergonomic parser abbreviations such as `?`, `h`, `char`, and `inv` where useful.

No Account/Game/Data/Benchmark version changed.

## `0.8.600.4` — Strict Current Schema

Game State 6 is now a real strict persisted contract rather than merely a version number.

`currentGameStateSchema.js` validates required persisted structure **before** `reviveGameState()` may relink JSON references. Incomplete current-version payloads are rejected without mutation/reconstruction. `saveGame()` likewise refuses malformed current runtime state rather than manufacturing required registries.

Canonical capability persistence is `player.progression.capabilities`; do not create a second player-level capability registry.

Runtime `ensure*` helpers remain useful for new/internal state initialization, but they are not implicit save migrations.

## `0.8.600.5` — Carried Commitment Delivery

`carriedInventoryEngine.js` now centralizes the portable-carried container fact and provides:

- carried container enumeration;
- carried item enumeration/quantity;
- atomic cross-container removal plans.

Commitments consume that authority instead of inspecting main Inventory only. A qualifying item in Field Satchel/Sack/Case can satisfy delivery; home storage cannot. Failed removal plans leave every carried container unchanged.

`carriedLoadEngine` consumes the same carried-container definition, preserving one inventory/logistics fact.

## `0.8.600.6` — Canonical Action Results

The ActionResult compatibility shim is removed.

Canonical semantic results expose only:

```text
ok
action
code
outcome
data
display
```

No non-enumerable `.message` or `.reason` aliases remain. Confirmed command consumers use `describeActionResult()` / `display.text`; semantic consumers use structured fields. Do not restore compatibility aliases to make an old test/caller convenient.

## `0.8.600.7` — Runtime Architecture Guardrails

Hosted validation moved from Node 20 to Node 24 LTS. Current workflow uses:

```text
actions/checkout@v7
actions/setup-node@v6
node-version: 24
package-manager-cache: false
concurrency cancellation
15-minute job timeout
```

`package.json` requires Node `>=24`.

`tests/architectureDebtGuard.test.js` prevents selected removed compatibility surfaces from returning, including retired FFXI command modules, old persistence/home identifiers, ambiguous version aliases, ActionResult compatibility aliases, obsolete `highContrast` intent state, and the dead view-model `cargoUnits` payload.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- strict current-schema persistence during pre-alpha unless compatibility is explicitly requested;
- inventory owns container unlock/access/capacity/transfer and carried-item facts;
- carried inventory/load facts derive from container definitions, not consumer-specific container lists;
- home infrastructure composes project/inventory/furnishing/workstation authorities rather than creating parallel stores or timers;
- transport owns fares/cadence/departure/arrival/service allowance and independently derives carried load;
- projects own material + labor + completion state;
- `workstationEngine` owns workstation-context derivation;
- `productionEngine` owns recipe requirements/work/inputs/outputs/provenance/mastery;
- campaign recovery remains the single player/party recovery authority;
- recovery never silently changes active party membership;
- commitments remain separate from relationships and Journal projection;
- NPC schedules are recurring availability evaluated against canonical fictional time, never a second clock/state registry;
- maps/routes/resources/contacts/search preserve acquired-knowledge privacy;
- player-facing browser information describes what the character sees, knows, carries, remembers, needs, or can decide;
- canonical ActionResult logic uses structured semantic fields, not prose parsing;
- legacy FFXI-derived records remain bounded research/reference material, not canonical world identity.

## Documentation consolidation completed in cycle 6

After runtime freeze, cycle 6 refreshed:

- `PROJECT_PROFILE.yaml`;
- `docs/QUALITY_GATES.md`;
- `docs/ROADMAP.md`;
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SYSTEM_CATALOG.md`;
- `docs/TRANSITIONAL_ARCHITECTURE.md`;
- this handoff last.

`SYSTEM_CATALOG.md` now describes current implemented/playable systems instead of preserving 0.5-era “planned” status. `TRANSITIONAL_ARCHITECTURE.md` now lists only live transitions.

## Remaining non-blocking debt / future hardening

- Internal implementation names such as `player.jobs`, `races`, or `nations` still exist in some modules where they are not player-facing world identity. Refactor only when a bounded change improves real authority clarity; do not mass-rename mechanically.
- Original currency terminology remains deferred.
- NPC schedules remain static-location recurring availability; autonomous multi-location NPC pathfinding is future work.
- Enemy tactical/content breadth remains representative rather than deep.
- Broad quest/romance/social-life content remains shallower than long-term design.
- No passive/offline companion healing or autonomous companion routine exists, deliberately.
- Regional content breadth/balance remains pre-alpha.
- Long-session hardening is still worthwhile: repeatable benchmark sampling plus deterministic multi-day lifecycle/save-load smoke coverage. This was not started because the autonomous session reached its sixth-cycle stabilization boundary.

## Next work

**Do not automatically begin `0.8.700`.** A fresh work order should resync `main`, reread this handoff, and choose one bounded seam.

If continuing maintenance/hardening, the strongest next bounded unit is:

```text
repeatable benchmark sampling
+ deterministic multi-day lifecycle/save-load smoke
+ duplicate-task/event/resource-growth assertions
```

If returning to Phase 0.8 feature work, strong candidate families remain:

- agriculture/stewardship;
- earned automation that reduces already-established chore attention through investment/mastery;
- further companion/social-life breadth only where a concrete player decision and existing authority path justify it;
- another life/logistics segment only when a specific current defect/opportunity warrants it.

A new user message is required before starting another implementation cycle because this session has reached the repository's six-cycle autonomous stabilization boundary.
