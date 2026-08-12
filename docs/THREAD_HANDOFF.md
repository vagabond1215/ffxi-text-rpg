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
Product:      0.6.250.1
Package:      0.6.250
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Player Interface Architecture
```

Relevant subsystem contracts:

```text
versionManifest  0.6.250.1
domUi            0.1.0
gameViewModels   0.1.0
canvasUi         0.8.0   transitional compatibility/reference
uiIntents        0.2.0
characterCreation 0.5.2
```

No Account Save, Game State, or Data bump was required for `0.6.250`.

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
- **0.6.250 semantic player-interface architecture.**

Phase 0.5 is complete. Phase 0.6 is active through 0.6.250. Do not reopen earlier tracks broadly without a concrete regression.

## 0.6.250 — player interface architecture status

The track is **complete enough to exit**.

### Active browser shell is DOM-first

The browser no longer mounts the full-canvas application.

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> existing game/save/command/intent services
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
```

New active UI files:

```text
js/text/ui/domApp.js
js/text/ui/domRenderer.js
js/text/ui/gameViewModel.js
js/text/ui/uiState.js
```

The existing `canvasApp.js`, `canvasRenderer.js`, `canvasLayout.js`, and related tests remain as bounded transition/reference surfaces. Do not extend Canvas as the primary browser presentation layer unless a specific compatibility reason requires it.

### Semantic game presentation model

`gameViewModel.js` derives disposable renderer-facing meaning from authoritative runtime state. It currently exposes:

- place, region, coordinate, world time, pause/speed state;
- compact character identity, HP/MP/TP, and primary attributes;
- scene title/description and nearby POIs;
- atlas-derived local map knowledge;
- legal movement directions;
- current travel/timed-task activity;
- a small set of contextual actions;
- recent display events with typed-command echoes filtered out.

It is **not** a second persisted game-state schema.

### World/scene is primary

The normal game screen is organized around:

```text
location + fictional time header

local knowledge map   world/scene or selected information view   character status

contextual actions
recent meaningful events
Search-or-act input
```

There is no permanent player-facing `Output Log` panel. Command outputs can still feed the recent-events compatibility seam while individual domains acquire dedicated presentation models.

### Local map and movement

The local map is SVG rendered from existing atlas/discovery knowledge. The player sees only visited cells and bounded path stubs toward unrevealed neighboring geography. The authored full topology is not exposed.

The compact D-pad remains under the local map as a secondary/fine-movement control. Keyboard movement supports arrows/WASD plus Q/E/Z/C diagonals when focus is not in an input field.

### Contextual actions

Normal exploration actions prioritize nearby POI interaction and basic observation, capped to a small useful set. Battle swaps to combat-shaped actions. Active travel exposes semantic `Stop Travel` rather than fabricating a malformed text command.

Information surfaces such as Character, Spellbook, Journal, Codex, Craft, and World are navigation rather than world actions.

Some destination views still bridge to existing command-backed output because dedicated inventory/equipment/spell/codex presentation models do not yet exist. Migrate those incrementally as their mechanics tracks mature.

### Character creation

The active creator is now a **single-screen configuration surface**, not a wizard.

It simultaneously exposes:

- name;
- ancestry;
- sex;
- origin;
- starting discipline;
- description/tags for the active choice;
- continuously visible starting profile;
- one Create Character action.

Native HTML/CSS handles wrapping and focus. Starting discipline wording explicitly describes initial training rather than permanent class identity.

### Search-or-act field

The bottom omnibox is currently a keyboard/power-user adapter into existing typed/slash commands. It is **not yet** a fuzzy cross-database search/index. Do not describe it as one until suggestions/entity/action resolution are implemented.

## 0.6.250 validation checkpoint

Coherent runtime/version/test-fix head:

```text
0cc3acae8a421ec0c72044bd153afc2825b5b04c
```

GitHub Actions test completed successfully on 2026-08-12 with:

```text
tests       383
pass        383
fail        0
cancelled   0
skipped     0
todo        0
```

Benchmark from the same successful test job:

```text
Product: 0.6.250.1
Package: 0.6.250
Account Save: 4
Game State: 5
Data: 20
Benchmark: 1
Codename: Player Interface Architecture

create 1,000 player combat profiles:              464.793ms total | 0.464793ms/op
create 1,000 enemy combat profiles:               116.485ms total | 0.116485ms/op
resolve 1,000 basic attacks:                      549.896ms total | 0.549896ms/op
run 10,000 tick dispatches with 5 subscribers:     47.044ms total | 0.004704ms/op
resolve 10,000 direct travel route lookups:      7380.195ms total | 0.738020ms/op
```

On that head:

```text
test                 success
build                success
report-build-status  success
```

The deploy job was still finishing at the last validation read; no test/build failure remained.

A preceding test run exposed only a test-fixture error (`state.travel` is initially null); the test was corrected to assign a minimal active-travel object. The corrected 383-test suite is green.

GitHub runners continue to emit the known non-blocking warning about Node-20-targeting checkout/setup actions being forced through Node 24. Project test/benchmark commands themselves use Node 20.20.2.

## Current 0.6.250 limitations / intentional debt

Treat these as deliberate follow-up seams, not justification for another broad UI rewrite:

- Canvas modules remain temporarily for compatibility/regression comparison.
- `uiState.js` still reuses structural helpers from `canvasInput.js`; extract renderer-neutral UI state incrementally.
- Inventory, equipment, skills, existing spell/technique views, and portions of Codex still bridge to command output rather than owning domain presentation models.
- The Search-or-act field is command-capable only; fuzzy entity/action search is future work.
- The local map is intentionally rough; richer landmarks, POI symbols, regional maps, and transport overlays should preserve atlas knowledge as authority.
- Dedicated active-browser simulation controls are not yet exposed; add them only through the canonical simulation/interrupt scheduler rather than inventing UI clocks.
- `capabilityEngine` evaluates ownership/use eligibility but generalized effects are still pending.
- Existing spell and weapon-skill actions are transitional combat scaffolding.
- `skillCaps.js` remains sparse/placeholder-confidence.
- Active discipline still participates in legacy equipment eligibility.
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related internal names remain compatibility seams.
- Historical FFXI modules remain bounded research/reference surfaces.
- `places.js` spawn rules/place connections, `gil`, historical localStorage keys, and legacy-shaped POI hook IDs remain intentional compatibility debt.

## Next target

```text
0.6.300 — Original magic and active ability engine
```

**No 0.6.300 implementation has started.** Begin it only under the next user-authorized mechanics run.

Recommended first bounded unit:

1. refetch latest `main`, checks, required docs, architecture, and version manifest;
2. inspect combat actions/battle, `ActionResult`/semantic events, timed tasks/interrupts, statuses, capabilities, equipment/item-effect metadata, and bounded historical spell research;
3. define executable original-world ability/effect records separately from character capability ownership;
4. establish original spell schools/traditions and representative techniques with targeting, cost, cast/activation duration, recast/cooldown, interruption, and structured effect payloads;
5. keep capability/loadout/preparation/resource/context prerequisites compositional rather than making active discipline a universal gate;
6. use canonical fictional time/timed-task infrastructure for non-instant activation;
7. expose new magic/actions through semantic UI view/context seams rather than adding another permanent button catalog;
8. preserve the current battle scaffold behind bounded adapters until `0.6.400`;
9. prove offensive, restorative/support, and non-combat/contextual effects without mass-porting historical spell catalogs;
10. validate/version/test/benchmark/document and stop at the coherent 0.6.300 boundary before Combat 2.0.
