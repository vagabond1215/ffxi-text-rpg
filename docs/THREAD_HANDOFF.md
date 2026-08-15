# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. Relevant architecture/runtime/data/tests, especially `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, and `js/text/version.js`.

## Workflow

Work directly on `main` by default. Treat each prompt as a bounded work order. Follow the `AGENTS.md` autonomous-session guardrail and update this handoff at the end of substantive work.

This repository remains early/single-maintainer pre-alpha development. Incremental commits may temporarily fail while a bounded unit is being assembled, but coherent milestone checkpoints should be validated and known failures recorded. Do not create routine branches/PRs unless explicitly requested or later repository protection requires them.

## Product laws

Working title: **Hearth & Horizon**. Earlier FFXI-derived material is legacy research/reference/migration material, not canonical world content.

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

Maps represent acquired character knowledge, not omniscient authored geography. Authored coordinates remain simulation/internal data. Resources have physical/economic/social provenance. Canonical fictional time is separate from wall-clock scheduling. Companions are persistent world characters, not summons.

## Current baseline

```text
Product:       0.6.800.1
Package:       0.6.800
Account Save:  4
Game State:    5
Data:          26
Benchmark:     1
Codename:      Persistent Companions and Party
Compatibility: migrate-supported-save-versions
```

Phase 0.5 is complete. Phase 0.6 is complete through **0.6.800**; **0.6.900 integrated-mechanics exit gate is next**. No `0.6.900` implementation has started.

Authoritative coherent runtime/version checkpoint:

```text
073e0ef1bc26b68e0b47fea579db5525e1e26904
Update pipeline expectations for persistent companions
```

Documentation synchronization follows that runtime checkpoint.

## Completed Phase 0.6 sequence

- `0.6.100` continuous-character stats/progression — Data 19.
- `0.6.200` character-owned skills/proficiencies/capabilities — Data 20.
- `0.6.250` semantic DOM player-interface architecture — Data 20.
- `0.6.300` original magic and active ability engine — Data 21.
- `0.6.400.2` Combat 2.0 — Data 22.
- `0.6.450` locality/exploration navigation — Data 22.
- `0.6.500` equipment and field-tool breadth — Data 23.
- `0.6.600` gathering/hunting/processing/crafting/cooking/salvage — Data 24.
- `0.6.700` ecology/regional creature/resource breadth — Data 25.
- `0.6.800` persistent companion/party foundation — Data 26.

## 0.6.600 production/resource loops — complete

Primary additions include character-owned work proficiencies, timed gathering/recovery/production, activity ownership, locality-derived workstations, provenance-preserving processing/crafting/cooking/salvage/recycling, and persistent pending output when storage is full.

Hands-on work blocks incompatible movement and transport. Existing ecology remains environmental source authority; equipped tool tags and persistent work proficiency compose into the work layer rather than creating a second tool or clock system.

Representative loops prove regional raw material -> processing -> finished use and lossy salvage without magical duplication.

## 0.6.700 regional ecology/resource breadth — complete

Regional ecology/resource registries expand Elderwood, Redstone Reach, and Starfen without turning the foundation ecology module into a monolith.

Environmental gathering and defeated-creature body recovery both feed the `0.6.600` production economy. Recovered regional hunt materials use canonical item metadata while retaining acquisition provenance from the defeated body/resource opportunity.

Content-pack ownership/dependencies remain explicit and validated. The track populated proven systems rather than adding species-specific engine branches.

## 0.6.800 persistent companions and party — complete

### Primary files

```text
js/text/data/companions.js
js/text/data/seedEntities.js
js/text/systems/partyEngine.js
js/text/systems/battleEngine.js
js/text/systems/combatActionEngine.js
js/text/systems/combatTurnEngine.js
js/text/systems/navigationEngine.js
js/text/systems/localityEngine.js
js/text/systems/transportEngine.js
js/text/ui/gameViewModel.js
js/text/ui/uiIntentDispatcher.js
```

Focused tests:

```text
tests/partyEngine.test.js
tests/partyCombatIntegration.test.js
tests/partyUiIntegration.test.js
```

### Companion identity contract

A companion is one persistent NPC promoted into character-like party state. Do not model companions as summons, disposable battle entities, or copies of an NPC.

Representative original companion:

```text
companion-mara-venn
npc-elderwood-waywarden
Mara Venn, Waywarden
timbercross-landing
```

`companions.js` stores canonical NPC linkage, recruitment places/requirements, level/base combat traits, tactical role/policy, and relationship dimensions. The representative Mara record has no prerequisite flag so the current foundation is actually recruitable in world; future companions may use generic flag-based willingness conditions.

### Party runtime contract

```text
PARTY_STATE_VERSION = 1
active companion capacity = 2
```

`state.party` is additive/lazily normalizable within Game State 5 and contains persistent recruited records plus active membership. Companion state includes resources/statuses, relationship dimensions, tactics, home/current place, and joining time.

Recruit/join/leave membership changes are blocked during active combat and emit semantic events:

```text
party.companion-recruited
party.companion-joined
party.companion-left
```

Backing NPC identity/location is synchronized from the persistent companion. If an older Game State 5 save lacks the backing NPC, `partyEngine` can reconstruct it from the canonical companion definition rather than requiring a save-version migration.

### Combat integration

Combat 2.0 now has explicit sides:

```text
ally
enemy
```

Player and active companions are allies. Friendly basic attacks are rejected. Battle defeat is side-based, so a living companion can keep the ally side active after the player falls.

Active companions enter encounters as normal combatants. A ready companion currently contributes a deterministic structured basic-attack action through the existing Combat 2.0 action history after player action resolution. Companion resources/statuses synchronize back into persistent party state during combat finalization.

This preserves the existing Combat 2.0 clock/action contract instead of creating a separate companion combat engine.

### Location continuity

Active companion location follows canonical place changes through:

- exploration movement/place exits;
- named locality crossings;
- direct route travel arrivals;
- scheduled transport arrivals.

Backing NPC location follows the same persistent companion record.

### Semantic UI integration

`gameViewModel.js` exposes a renderer-independent party model with active/recruited counts, identity, role, HP, location, and relationship dimensions.

Recruitable companions can appear as direct semantic contextual actions:

```js
{
  intent: 'party.recruit',
  payload: { companionId }
}
```

`uiIntentDispatcher.js` invokes `partyEngine` directly; it does not manufacture a command string. The semantic party browser contract exists even though a large dedicated party renderer is deferred.

## Persistence/version decision

`0.6.800` completed at Product `0.6.800.1`, Package `0.6.800`, Data `26`, while Account Save 4 and Game State 5 remain unchanged.

No Game State migration was required because `state.party` is additive/lazy and backing NPC state is reconstructible. Data advanced because companion identity linkage, recruitment requirements, tactical policy, and relationship-dimension definitions are canonical authored runtime data.

Relevant system versions include:

```text
versionManifest  0.6.800.1
transport        0.2.0
gameViewModels   0.4.0
uiIntents        0.4.0
companionCatalog 0.1.0
party            0.1.0
enemyEntity      0.4.0
battleEngine     0.8.0
combatTurns      0.3.0
combatActions    0.8.0
companions       0.1.0
```

## Validation checkpoint

At runtime/version head `073e0ef1bc26b68e0b47fea579db5525e1e26904`:

```text
tests       448
pass        448
fail        0
cancelled   0
skipped     0
todo        0
```

Build/deploy checks all completed successfully:

```text
test                  success
build                 success
report-build-status   success
deploy                success
```

Benchmark:

```text
create 1,000 player combat profiles:              467.995 ms | 0.467995 ms/op
create 1,000 enemy combat profiles:               111.001 ms | 0.111001 ms/op
resolve 1,000 basic attacks:                      551.000 ms | 0.551000 ms/op
run 10,000 tick dispatches with 5 subscribers:     48.508 ms | 0.004851 ms/op
resolve 10,000 direct travel route lookups:      8632.854 ms | 0.863285 ms/op
```

The recurring GitHub Actions warning about Node 20 action-runtime deprecation remains warning-only. Actions targeting Node20 are forced through Node24 internally while `setup-node` installs Node 20.20.2 for project tests/benchmarks.

## 0.6.800 bounded limitations / intentional follow-ups

- Only one representative recruitable companion proves the current foundation.
- Companion tactical policy is intentionally basic; companions are not yet independent simulation-interrupt providers. Do not create a second combat clock to solve this later.
- Deeper relationship progression/dialogue, companion equipment/progression breadth, formation/tactical controls, and larger companion content belong later.
- The semantic party model exists but a dedicated full party browser view is not yet required.
- `poiEngine.js`/`commandRouter.js` still contain transitional companion compatibility text/commands. Future cleanup should route those adapters to `partyEngine`; POI prose must not become companion authority.
- The legacy-shaped POI catalog contains an unrelated Thornwall Southgate POI also displayed as “Mara Venn”. Preserve its stable compatibility ID if needed, but give that POI a unique original display identity in a bounded content cleanup.
- Active companion location is synchronized at canonical place-transition authorities; stationary companions remain at their stored place.
- Existing broader compatibility debt remains: legacy localStorage keys, some legacy-shaped POI IDs, internal `player.jobs`/`mainJobId` naming, Canvas regression/reference modules, older starter discipline-shaped equipment eligibility, transitional cast/technique command adapters, and `gil` terminology.

## Next bounded target — 0.6.900 integrated-mechanics exit gate

Do not treat `0.6.900` as permission for another broad subsystem. It is the Phase 0.6 integration/audit/stabilization gate.

Recommended sequence:

1. audit save/load and lazy normalization across abilities, work, ecology, combat, party, travel, projects, and semantic events;
2. audit canonical fictional-time and interrupt composition across combat readiness, ability activation, work, travel/locality crossing, projects, and day review;
3. identify remaining accidental active-discipline hard gates that contradict continuous-character ownership;
4. exercise party/combat/travel/work coexistence and exactly-once synchronization/reward/resource behavior;
5. audit provenance/source/sink continuity through combat recovery, gathering, production, trade, quests/rewards where implemented;
6. audit semantic UI/view-model authority against old command/prose compatibility adapters;
7. run world/database/content-pack validators and repair dangling/duplicate authority seams;
8. run full tests, benchmark, build/deploy, and performance-regression review;
9. close Phase 0.6 only after defining exact Phase 0.7 playable-alpha entry criteria;
10. stop at the coherent `0.6.900` boundary rather than beginning 0.7 content automatically.
