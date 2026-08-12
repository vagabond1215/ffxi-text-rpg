# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. Relevant runtime/data/tests for the next bounded unit.

Older planning documents preserve useful history but do not override the files above.

## Current Git workflow

The repository is in an early single-maintainer development phase. Per `AGENTS.md`, **continue directly on `main` by default**.

Do not create a branch/PR merely as ceremony. Use isolation if the user asks, a tool requires it, or the change is unusually risky enough that isolation materially helps.

Remote branch deletion is not exposed by the current GitHub connector, so stale remote branches remain a manual repository-maintenance task. Do not create replacement cleanup branches.

## Autonomous work-session limit

`AGENTS.md` sets the operating guardrail:

- maximum autonomous session: **2 hours 45 minutes**;
- **2:15** stabilization checkpoint;
- **2:30** start no new implementation unit;
- by **2:45** persist a coherent state, update this handoff, and report;
- if elapsed time cannot be measured reliably, use the fallback maximum of **6 autonomous work cycles**, reserving cycle 6 for stabilization/handoff.

A new user message starts a new budget. Roadmap `Next` sections do not authorize an endless autonomous chain.

## Product identity

Working title: **Hearth & Horizon**.

This is an original text-first persistent fantasy life RPG about one continuous character building livelihood, skills, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected fantasy world.

Earlier FFXI-derived material is **legacy research/reference/migration material**, not canonical world content.

Core laws:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

## Current baseline

```text
Product:      0.5.600.1
Package:      0.5.600
Account Save: 4
Game State:   5
Data:         16
Benchmark:    1
Codename:     Resource Provenance
```

`js/text/version.js` is authoritative.

## 0.5.600 — exit status

The resource-provenance and persistent-project substrate is **complete enough to exit the track**.

### Persistent projects

`js/text/systems/projectEngine.js` now provides:

- versioned project registry with stable `project-000001`-style IDs;
- planned/active/completed/cancelled states;
- material requirements and real inventory contribution/removal;
- canonical `project.labor` timed tasks;
- deterministic labor progress/completion boundaries;
- cancellation;
- project progress inspection;
- project-state validation;
- structured `project.created`, `project.material-contributed`, `project.started`, `project.completed`, and `project.cancelled` events.

New games initialize the registry. Older Game State v5 records lazily acquire it when the project system is first used, so no Game State version bump was required.

### Provenance and sinks

`js/text/data/resourceProvenance.js` now defines normalized/validated acquisition categories for:

- carried inventory;
- creature/body resources;
- flora;
- minerals;
- fishing;
- salvage;
- crafting;
- commerce;
- contracts;
- social rewards;
- explicitly exceptional magic.

It also defines acquisition/recovery actions including search/skin/butcher/pluck/extract/salvage/gather/forage/log/mine/fish/trap/process/craft/purchase/barter/earn/receive/conjure and item sink/use categories spanning consumption, equipment, tools, crafting/processing, construction, repair, trade, contracts/quests, salvage, decoration/collection, and key items.

`js/text/data/itemSchema.js` advanced to schema v3 and normalizes `provenance` and `sinks` while preserving the older `source` field as a bounded compatibility note. Data contract advanced from 15 to 16.

### Post-combat resource opportunities

`js/text/systems/resourceOpportunityEngine.js` now provides a persistent resource-opportunity registry with stable `resource-*` IDs.

Defeated enemies with transitional output tables create one of:

- `body` opportunities for creatures;
- `carriedInventory` opportunities for raider/humanoid-style enemies;
- `salvage` opportunities for constructs.

Recovery actions currently support:

- `search`;
- `skin`;
- `butcher`;
- `pluck`;
- `extract`;
- `salvage`.

Action definitions expose tool tags, proficiency IDs/minimums, source-condition minimums, and canonical fictional duration. Starting recovery creates a `resource.recovery` timed task.

Yield rolls are fixed **when recovery begins** and stored on the persistent recovery record. Completion therefore does not reroll already-started work if reconciliation happens later or after persistence.

Recovered materials are added through normal inventory/capacity rules and carry structured provenance identifying source enemy, place, recovery action, opportunity, and source condition.

### Battle reward change

`js/text/systems/rewardEngine.js` no longer rolls creature materials directly into inventory on victory.

Current behavior:

- EXP resolves immediately;
- current `gil` scaffold resolves immediately;
- physical candidate materials remain in the world as recoverable opportunities;
- `battle.rewards.items` remains an empty compatibility field;
- `battle.rewards.resourceOpportunities` records created opportunities.

Existing `lootTables.js` is now transitional candidate-output data for the provenance system rather than a direct reward-confetti mechanism.

### Version/system changes

```text
Product             0.5.550.2 -> 0.5.600.1
Package             0.5.550   -> 0.5.600
Account Save        4         unchanged
Game State          5         unchanged
Data                15        -> 16
itemSchema          0.6.0     -> 0.7.0
battleRewards       0.5.2     -> 0.6.0
projects            new       0.1.0
resourceProvenance  new       0.1.0
resourceOpportunities new     0.1.0
resourceRecovery    new       0.1.0
```

Database registry now lists `projects`, `resourceProvenance`, and `resourceOpportunities` as implemented substrate registries.

### Tests added/updated

- `tests/projectEngine.test.js`
- `tests/resourceProvenance.test.js`
- `tests/resourceOpportunityEngine.test.js`
- `tests/rewardEngine.test.js`
- `tests/pipeline.test.js`

Coverage includes stable IDs, material contribution, timed completion, cancellation, provenance/sink normalization and validation, body/carried-resource opportunities, tool/condition/proficiency hooks, persisted recovery rolls, inventory-capacity failure, duplicate reward protection, and version/database contracts.

### CI checkpoint

The complete runtime/version series is represented by the history through:

```text
43b6c54f29414795ea46a9d810778c714ed3c1dd
```

At handoff preparation time, GitHub Actions for that commit had been started after prior provenance/resource commits had already reached green test/build checkpoints. **Inspect the newest `main` check runs before starting 0.5.650** and fix any real regression directly on `main`.

Documentation closeout commits follow that runtime/version checkpoint.

## 0.5.600 bounded limitations

These are deliberate deferrals, not reasons to reopen the track immediately:

- broad player-facing UI/command affordances for project/resource actions are not yet exposed;
- current starter recovered materials carry a minimal representative `trade` sink rather than a mature economy graph;
- full item source/sink cross-reference enforcement at hundreds/thousands-of-record scale belongs to `0.5.800`;
- environmental gathering nodes, species populations, depletion/regeneration, and respawn belong to `0.5.650`;
- processing/crafting chains remain later work;
- `gil` remains unchanged pending deliberate currency design;
- legacy-shaped POI hook IDs and historical localStorage keys remain bounded compatibility debt.

## Next target

```text
0.5.650 — Ecology, gathering, and spawn substrate
```

**Do not restart identity migration or reopen 0.5.600 broadly.** First verify current CI, then start one bounded ecology/gathering unit.

Recommended first unit:

1. Define canonical species/family records separate from encounter instances.
2. Define habitat/population records with stable IDs and references to places/biomes.
3. Add density/rarity, aggression, senses, linking/social behavior, and environmental/time hooks without prematurely hard-coding every ecology rule.
4. Define flora/mineral/fishing/gathering-source records that reference canonical item outputs and provenance actions.
5. Add persistent or derivable depletion/regeneration/respawn state based on canonical world time.
6. Add rare/named population hooks without arbitrary random appearance semantics.
7. Add representative cross-reference validation across species, populations, places, resource sources, and item outputs.
8. Test against several distinct families/source types, not one toy record.

Do **not** begin hundreds-scale creature/flora generation yet. Prove the substrate and cross-reference validation first.

## Resource/economy law

Rewards should have physical, economic, or social provenance. Combat can create access to bodies, carried goods, or salvage; it should not automatically manufacture finished crafting materials in inventory.

Desired material flow remains:

```text
world source
  -> raw material
  -> processing
  -> component/ingredient
  -> finished good
  -> use/wear/consumption
  -> repair/recycling/salvage or replacement
```

## Current transitional technical debt

Treat these as temporary and replace incrementally behind migrations/tested interfaces:

- `mainJobId` as a broad capability gate;
- sparse placeholder skill-rank math;
- placeholder spell/weapon-skill combat actions;
- tiny starter equipment/shop/enemy/resource catalogs;
- minimal current sink metadata on recovered starter materials;
- legacy `data/` and `ffxi*` research tables;
- historical localStorage key names;
- legacy-shaped POI hook IDs.

Do not solve these through an unbounded rewrite.
