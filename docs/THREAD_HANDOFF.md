# Thread Handoff

This is the first document a new ChatGPT/Codex thread should read before continuing repository work.

## Read order

1. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
2. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — authoritative product-version protocol and release gates.
3. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not be mistaken for final design.
4. `docs/ROADMAP.md` — implementation summary and phase index.
5. `docs/ARCHITECTURE.md` — current module/runtime boundaries.
6. `js/text/version.js` — authoritative runtime/system version state.

`docs/planning/DEVELOPMENT_PIPELINE_AND_MILESTONES.md` is superseded historical planning from the earlier formula-first direction.

## Product identity

The project is a long-form, text-first fantasy life RPG with FFXI-inspired weight, preparation, dangerous travel, jobs/disciplines, equipment, mastery, and earned accomplishment.

It is not intended to become a text transcription of retail FFXI.

Core progression law:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

Repeated identical work should not receive arbitrary exponential resource multipliers. Higher resource demand should come from physical scale, upgrades, specialization, logistics, infrastructure, quality, and more ambitious projects.

Simulation time and wall-clock time are separate. Fictional work may take hours, days, seasons, or years while the player can pause, accelerate, advance to completion, or advance to a meaningful interrupt.

## Jobs/disciplines direction

The current `mainJob`/support-job/current-job model is transitional compatibility scaffolding.

Long-term rule:

```text
Jobs describe.
Capabilities enable.
Loadouts constrain and enhance.
```

Jobs remain recognizable disciplines/training traditions. Equipment does not magically transform the character into another job, and changing loadout should not erase learned knowledge.

Ability eligibility should eventually derive from learned capability, proficiency, equipment, hard/soft requirements, preparation, resources, condition, context, and formal advanced training where logically required. Characters may combine capabilities associated with several disciplines when the actual prerequisites are satisfied.

Do not broadly remove the existing job state before the 0.6 capability migration. Also do not deepen it into a permanent magical class-lock model.

See `docs/TRANSITIONAL_ARCHITECTURE.md` for implementation constraints.

## Current version state

Target state for the current stabilization branch:

```text
Product:      0.4.600.0
Package:      0.4.600
Account Save: 4
Game State:   3
Data:         13
Codename:     Foundation Stabilization
```

Product version format:

```text
MAJOR.PHASE.TRACK.REVISION
```

`package.json.version` remains valid three-part SemVer and normally mirrors `MAJOR.PHASE.TRACK`.

### Completed foundation tracks

- `0.4.100` — direction and version-roadmap lock.
- `0.4.200` — product/package version separation and repository CI gate.
- `0.4.300` — ordered Account Save/Game State migration mechanism.
- `0.4.400` — versioned `ActionResult` contract; travel-start pilot.
- `0.4.500` — bounded semantic event foundation; travel start/arrival pilot.
- `0.4.600` — stabilization/readiness pass and transitional architecture documentation.

After this track is green, `0.4.900` is the 0.4 exit-gate certification. The next implementation phase is 0.5 deterministic world time.

## New foundation contracts

### Ordered persistence migrations

Files:

```text
js/text/systems/migrationEngine.js
js/text/systems/saveMigrations.js
js/text/save.js
```

Registered migrations are applied sequentially. Unsupported old/future versions fail deterministically rather than being silently interpreted as current.

`reviveGameState()` still repairs JSON-broken object references such as `player.inventory`, but it is not the migration system.

### ActionResult

File:

```text
js/text/systems/actionResult.js
```

Representative semantic shape:

```text
contract
version
ok
action
code
outcome
data
display
```

Engine consumers should use semantic fields instead of parsing prose. Non-enumerable `.message` / `.reason` aliases exist only as transitional command compatibility adapters.

Travel start is the first migrated path.

### Semantic events

File:

```text
js/text/systems/semanticEventEngine.js
```

Events have stable sequential IDs, typed names, source, optional observed world-time seconds, and structured data. They are bounded observational history, not event sourcing and not the authoritative source of game state.

Travel currently emits:

```text
travel.started
travel.arrived
```

Objective/quest/achievement/end-of-day consumers should eventually use event types/data rather than parsing command-log prose.

## World-time insertion point

The current `tickEngine.js` uses wall-clock timing and is only a scheduling/dispatch scaffold.

It must not become the canonical game calendar.

0.5 should introduce deterministic world-time state and exact advancement independently of `Date.now()`. The desired boundary is:

```text
optional wall-clock scheduler
        -> requests simulation advancement
        -> deterministic world clock
        -> tasks/travel/projects/status/events
```

Tests and commands must be able to advance simulation without sleeping or waiting for real time.

## Current browser/UI architecture

```text
index.html
  -> js/main.js
      -> createCanvasApp(canvas)
          -> loadActiveCharacter() or createInitialState()
          -> createCommandRouter(state)
          -> createSlashCommandRouter(state)
          -> canvas render/input loop
```

The active UI is canvas-first and text-focused. Limited icons, tokens, meters, diagrams, cards, or similar state aids are welcome; do not rebuild a fully graphical world unless explicitly requested.

Logic must remain independent of rendering.

## Existing foundations to preserve

### World and interaction

- starter cities/wilderness/dungeon hooks;
- San d'Oria alphanumeric topology;
- coordinate movement and atlas discovery;
- zone graph and travel restrictions;
- foot-travel aggro scaffold;
- POI discovery/actions and same-zone travel.

### Inventory/equipment/economy

- Inventory plus Mog/storage/portable/wardrobe containers;
- capacity/access/stack rules;
- item normalization/schema;
- equipment eligibility/equip/unequip;
- item inspection;
- shop buying/selling;
- metadata-only latent/enchantment/charge/ranged-ammo behavior.

### Progression/combat

- character-owned `player.progression.skills[skillId]` values;
- sparse skill-cap scaffolds;
- deterministic representative skill-gain hooks;
- EXP, leveling, reward and loot scaffolds;
- battle state and deterministic RNG injection;
- placeholder attacks/weapon skills/casts;
- status lifecycle.

Current FFXI formulas/caps are scaffold data unless explicitly confidence-labeled otherwise.

## Save/account rules

Current local keys:

```text
ffxiTextRpgAccounts
ffxiTextRpgAccountSession
```

Encoding:

```text
base64-json-v1
```

This is encoding, not cryptographic protection.

Important compatibility reference:

```text
player.inventory
```

must reference:

```text
player.inventoryState.containers.inventory.items
```

after load/revive.

Persistent incompatible state changes require an ordered migration or an explicit reset decision.

## Development gate

Use Node 20+.

```bash
npm test
npm run benchmark
npm run check
```

GitHub Actions runs the test and benchmark gate for pull requests and pushes to `main`.

New runtime tracks should merge only after the gate is green.

## Immediate sequence after 0.4 stabilization

1. `0.4.900` — certify the 0.4 exit gates and synchronize authoritative docs.
2. `0.5.100` — deterministic world clock.
3. `0.5.200` — pause/simulation speed boundary.
4. `0.5.300` — canonical timed task model.
5. `0.5.400` — interrupt model.
6. `0.5.500` — day boundary and end-of-day review.
7. `0.5.600` — persistent project model.
8. `0.5.700` — integrate travel plus one non-travel activity with canonical time.
9. `0.5.900` — 0.5 exit gate.

Then 0.6 begins capability/disciplines/origins/livelihood work.

## First representative gameplay target

0.7 working slice: **A Week Beyond the West Gate**.

It should combine origins, a modest foothold, one livelihood loop, local economy, one persistent material/labor project, simulated days/EoD review, preparation, one meaningful expedition, travel danger/combat, return/recovery, measurable capability growth, and one permanent end-of-week accomplishment.

The purpose is to prove that life-building and adventure are one connected game rather than separate minigames.
