# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/THREAD_HANDOFF.md` — this current continuation state.
3. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, legacy-data, provenance, scale, and content-pack policy.
5. `docs/ROADMAP.md` — implementation sequence and milestone gates.
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
7. Relevant architecture/runtime/data/tests, especially `docs/ARCHITECTURE.md` and `js/text/version.js`.

## Workflow and session guardrail

Continue directly on `main` by default. Do not create branch/PR ceremony unless the user asks, a tool requires isolation, or risk materially justifies it.

Maximum autonomous work session is **2h45** with the `AGENTS.md` stabilization checkpoints; when elapsed time cannot be measured reliably, use no more than **6 work cycles**, reserving cycle 6 for stabilization/handoff. A new user message starts a new budget.

## Product identity and laws

Working title: **Hearth & Horizon**.

Earlier FFXI-derived material is legacy research/reference/migration material, not canonical world content.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Maps represent acquired player knowledge rather than omniscient geography. The player interface should present world meaning and contextual choices rather than treating command output as the game itself.

## Current baseline

```text
Product:      0.6.300.1
Package:      0.6.300
Account Save: 4
Game State:   5
Data:         21
Benchmark:    1
Codename:     Original Magic and Abilities
```

Relevant subsystem contracts:

```text
versionManifest     0.6.300.1
capabilities        0.2.0
abilityCatalog      0.1.0
abilityEngine       0.1.0
magic               0.1.0
abilities           0.1.0
gameViewModels      0.2.0
uiIntents           0.3.0
commandShell        0.5.0
timedTasks          0.1.0
simulationInterrupts 0.1.0
```

Account Save remains 4. Game State remains 5 because the new ability runtime state is additive/lazily reconstructible. Data advanced 20 -> 21 because original spell-school and executable ability records are a new canonical data contract.

## Completed implementation sequence

The coherent sequence on `main` is now:

- 0.4 foundation/versioning/ordered migrations/ActionResult/semantic events;
- 0.5.100 deterministic world clock;
- 0.5.200 pause/speed controls;
- 0.5.300 canonical timed tasks;
- 0.5.400 deterministic interrupt model;
- 0.5.500 day boundaries/end-of-day review;
- 0.5.550 original-world identity/stable-ID migration;
- 0.5.600 persistent projects/resource provenance;
- 0.5.650 ecology/gathering/populations;
- 0.5.700 canonical routes/scheduled transport;
- 0.5.800 regional content packs/normalization/scalable validation;
- 0.5.900 simulation/content-substrate exit gate;
- 0.6.100 continuous-character stats/progression;
- 0.6.200 character-owned skills/proficiencies/capabilities;
- 0.6.200.2 bounded canvas usability refinement;
- 0.6.250 semantic player-interface architecture;
- **0.6.300 original magic and active ability engine.**

Phase 0.5 is complete. Phase 0.6 is active through 0.6.300. Do not reopen earlier tracks broadly without a concrete regression.

## 0.6.300 — Original magic and active ability engine

The track is **complete enough to exit**.

### Canonical ability data is separate from character ownership

New canonical data:

```text
js/text/data/abilities.js
```

The catalog defines executable effects and does not own whether a character has learned them. `capabilityEngine` remains the character ownership/use-prerequisite authority; `abilityEngine` executes concrete effects and spends concrete resources.

Original spell traditions:

```text
school-embercraft   Embercraft
school-vital-weave Vital Weave
school-ward-lore   Ward Lore
```

Representative executable records:

```text
ability-ember-dart       -> spell-ember-dart
ability-mending-thread   -> spell-mending-thread
ability-stone-ward       -> spell-stone-ward
ability-guarded-cut      -> technique-guarded-cut
ability-waymark-reading  -> practical-waymark-reading
```

No historical spell names were promoted into canonical ability data.

### Capability catalog evolution

`js/text/data/capabilities.js` advanced to capability catalog v2 and now includes original spell learning/use paths plus exploration context.

Representative semantics:

- Ember Dart can be learned through Elementalist/Spellblade training and requires elemental-magic proficiency;
- Mending Thread can be learned through Lifewarden/Spellblade training and requires healing-magic proficiency;
- Stone Ward can be learned through Oathguard/Lifewarden/Savant training and requires enhancing-magic proficiency;
- Waymark Reading can be learned through Wayfinder/Leykeeper training and is usable in exploration;
- Guarded Cut retains its character-owned martial capability contract.

Learning paths can be discipline-shaped. Once learned, the capability belongs to the continuous character. Active discipline is not a universal effect-use gate.

### Deterministic active ability runtime

New system:

```text
js/text/systems/abilityEngine.js
```

Additive Game State v5 runtime shape:

```js
{
  version: 1,
  cooldowns: {},
  active: null
}
```

The engine provides:

- ability lookup and context validation;
- capability ownership/use checks;
- deterministic self/enemy/context targeting;
- resource-cost checks and one-time cost spending;
- fictional-time activation deadlines;
- cooldown deadlines based on `worldTime.totalSeconds`;
- non-instant activation through `ability.activation` timed tasks;
- deterministic damage/heal/status/context effects;
- interruption/cancellation;
- runtime validation;
- learned/available ability presentation data.

Non-instant abilities use canonical world time. There are no real-time cast timers.

### Activation, cooldown, and interruption policy

Current explicit policy:

- costs are spent when activation begins;
- non-instant activation creates one canonical timed task;
- successful resolution starts cooldown;
- interruption cancels the underlying timed task;
- interrupted abilities retain already-spent resources;
- interrupted abilities do not begin cooldown;
- only one active player ability activation is supported at a time in this first contract.

Ability completion uses interrupt priority **550**, above generic timed-task completion (500) and below project completion (600), so the ability-specific semantic boundary wins a same-time generic-task tie.

### Structured effects and events

Representative effect types now proved:

- Ember Dart — deterministic INT-scaled enemy damage;
- Mending Thread — deterministic MND-scaled self healing;
- Stone Ward — self defensive status payload;
- Guarded Cut — instant STR-scaled damage plus defensive status;
- Waymark Reading — non-combat contextual survey.

Waymark Reading reports current place/coordinate and the count of **already-known atlas cells**. It deliberately does not expose total authored topology.

Lifecycle events:

```text
ability.started
ability.resolved
ability.interrupted
```

Events carry typed semantic data and do not require parsing display prose.

### Command and semantic UI integration

`commandRouter.js` now exposes canonical ability data through:

```text
abilities
spells
magic
invoke <ability>
```

`invoke` is a bounded keyboard/power-user adapter into `abilityEngine`.

The old `cast <spell>` placeholder remains a distinct legacy/transitional combat adapter until 0.6.400. Transitional weapon-technique commands also remain bounded.

`wait [seconds]` now advances canonical fictional world time outside travel and reconciles active ability activation. During travel, the existing travel adapter remains world-time authority so wait does not double-advance time.

The semantic UI dispatcher supports:

```text
ability.activate
```

without manufacturing a command string. `gameViewModel.js` exposes learned-only spellbook entries and can surface ready learned combat abilities as direct semantic contextual actions.

The active DOM Spellbook renderer still contains some command-backed transitional presentation. Extend the semantic view-model/intent seam incrementally; do not reopen broad UI architecture merely to remove those adapters.

## 0.6.300 validation checkpoint

Coherent runtime/version/test head:

```text
103507d663e91f6e3490c215d8d4159cbd320c52
```

GitHub Actions `Check` completed successfully on 2026-08-12 with:

```text
tests       397
pass        397
fail        0
cancelled   0
skipped     0
todo        0
```

Benchmark from the same successful test job:

```text
Product: 0.6.300.1
Package: 0.6.300
Account Save: 4
Game State: 5
Data: 21
Benchmark: 1
Codename: Original Magic and Abilities

create 1,000 player combat profiles:               483.913ms total | 0.483913ms/op
create 1,000 enemy combat profiles:                110.088ms total | 0.110088ms/op
resolve 1,000 basic attacks:                       555.742ms total | 0.555742ms/op
run 10,000 tick dispatches with 5 subscribers:      49.165ms total | 0.004916ms/op
resolve 10,000 direct travel route lookups:       7220.942ms total | 0.722094ms/op
```

The GitHub Pages build/deployment for package/version head `9ba098b6914e5a3741f4a6f0a3cb2cf8fc49bc54` completed successfully. That head already contained the 0.6.300 runtime/UI integration; the later `103507...` commit synchronized test expectations only.

GitHub runners continue to emit the known non-blocking warning about Node-20-targeting checkout/setup actions being forced through Node 24. Project test/benchmark commands themselves use Node 20.20.2.

Documentation closeout commits follow the validated runtime/version head; refetch current `main` before the next coding session.

## Current 0.6.300 limitations / intentional debt

Treat these as deliberate follow-up seams, not justification for another broad rewrite:

- `combatActionEngine.castSpell()` is the old placeholder adapter and remains until Combat 2.0 replaces its compatibility value.
- Transitional combat-technique/recovered weapon-skill command behavior remains bounded.
- Only one active ability activation is supported; there is no generalized action queue/concurrency policy yet.
- Enemy canonical ability selection/execution is not implemented yet.
- AoE, multi-target/ground targeting, resistance/accuracy layers, and final tactical timing belong to 0.6.400.
- Status effects can carry duration metadata, but 0.6.300 does not redesign status expiry around canonical world time.
- Representative damage/heal coefficients are provisional original balance.
- Cooldown starts on successful resolution; interruption retains spent resources and does not start cooldown.
- The DOM Spellbook renderer still has transitional command-backed elements even though the semantic learned-ability view model and direct ability intent now exist.
- Canvas modules remain temporarily for compatibility/regression comparison.
- `uiState.js` still reuses structural helpers from `canvasInput.js`.
- Equipment eligibility still contains discipline-shaped compatibility requirements.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related internal names remain compatibility seams.
- Historical FFXI research modules remain bounded reference surfaces.
- `places.js` spawn rules/place connections, `gil`, historical localStorage keys, and legacy-shaped POI hook IDs remain intentional compatibility debt.

## Next target

```text
0.6.400 — Combat 2.0
```

**No 0.6.400 implementation has started.** Begin it only under the next user-authorized mechanics run.

Recommended first bounded unit:

1. refetch latest `main`, checks, required docs, architecture, and version manifest;
2. inspect battle state/phase/combatants, `combatActionEngine`, `battleEngine`, `abilityEngine`, statuses, rewards/resource opportunities, equipment, skills/capabilities, and deterministic timing;
3. define a canonical encounter/combat-state contract without making active discipline a hard class identity;
4. make canonical abilities first-class combat actions with deterministic target/action resolution;
5. define opponent action selection/AI and action timing/recovery/interruption/status interaction on the existing fictional-time substrate;
6. keep skills, equipment, capabilities, preparation, and resources compositional;
7. migrate legacy `attack`, `cast`, and `technique` commands behind bounded adapters to the canonical combat path;
8. preserve victory/defeat, EXP, provenance-aware physical resource opportunities, and reward semantics;
9. validate/version/test/benchmark/document and stop at the coherent 0.6.400 boundary before item/equipment breadth.
