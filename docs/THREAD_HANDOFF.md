# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Read order

1. `AGENTS.md` — direct-`main` workflow, autonomous-session budget, scope boundaries, and handoff protocol.
2. `docs/DEVELOPMENT_DIRECTION.md` — authoritative design north star.
3. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — original-setting, naming, legacy-data, provenance, scale, and content-pack policy.
4. `docs/ROADMAP.md` — current implementation sequence and milestone gates.
5. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — version protocol.
6. `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
7. `docs/ARCHITECTURE.md` — current module boundaries.
8. `js/text/version.js` — authoritative active version values.
9. This handoff, then relevant runtime/data/tests for the next bounded unit.

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

Maps represent acquired player knowledge rather than omniscient geography.

## Current baseline

```text
Product:      0.6.200.2
Package:      0.6.200
Account Save: 4
Game State:   5
Data:         20
Benchmark:    1
Codename:     Character Capabilities
```

Subsystem changes in the latest UI revision:

```text
versionManifest    0.6.200.2
canvasUi           0.8.0
uiIntents          0.2.0
characterCreation  0.5.2
```

No Account Save, Game State, or Data bump was required.

## Completed implementation sequence

The coherent sequence on `main` is:

- 0.4 foundation/versioning/ordered migrations/ActionResult/semantic events;
- 0.5.100 deterministic world clock;
- 0.5.200 pause/speed controls;
- 0.5.300 canonical timed tasks;
- 0.5.400 deterministic interrupt model;
- 0.5.500 day boundaries/end-of-day review;
- 0.5.550 original-world identity/stable-ID migration;
- 0.5.600 persistent projects and resource provenance;
- 0.5.650 ecology/gathering/populations;
- 0.5.700 canonical routes and scheduled transport;
- 0.5.800 regional content packs/normalization/scalable validation;
- 0.5.900 simulation/content-substrate exit gate;
- 0.6.100 continuous-character stats and progression;
- 0.6.200 character-owned skills/proficiencies/capabilities;
- 0.6.200.2 bounded canvas UI/creator/navigation usability refinement.

Phase 0.5 is complete. Phase 0.6 is active through 0.6.200. Do not reopen earlier tracks broadly without a concrete regression.

## Continuous-character/capability state

`characterStatEngine.js` owns versioned original-design `player.statState`. Persistent base growth follows the highest attained discipline training level rather than the currently active discipline. Active discipline contributes contextual training/stat modifiers and explicitly is not a universal capability gate.

`player.progression.character` records lifetime character training metadata while per-discipline level/EXP records remain compatible.

`data/capabilities.js` and `capabilityEngine.js` separate capability learning paths from current-use prerequisites. Learned capabilities live under `player.progression.capabilities` and survive discipline switching. Use eligibility checks concrete proficiency/equipment/tool/preparation/resource/context requirements.

Skill training caps constrain **new gain** without truncating already learned character proficiency. Future executable `abilities` remain a separate responsibility from character-owned `capabilities`.

Historical FFXI stat/formula modules remain explicit research/reference surfaces and are not canonical runtime authority.

## 0.6.200.2 UI usability refinement

The user explicitly requested less clunky character creation, a navigational visual reference, a much smaller D-pad, fewer flat buttons, categorized information surfaces, and permanent at-a-glance character stats. The bounded implementation now provides those seams.

### Character creation

`js/text/data/characterCreationContent.js`, `js/text/ui/uiActions.js`, `js/text/ui/canvasInput.js`, `js/text/ui/canvasLayout.js`, and `js/text/ui/canvasRenderer.js` now use player-facing creator vocabulary:

```text
Ancestry -> Origin -> Discipline -> Review
```

Descriptions for the five canonical ancestries, three origins, and six starter disciplines were shortened and clarified. Starting discipline text explicitly says it is initial training rather than a permanent class.

Creator cards now wrap descriptions rather than ellipsizing them. `wrapText()` also splits oversized single tokens so narrow canvas cards cannot overflow from one long word/string.

The creator name field moved to the review area and keyboard input edits the name only while the review step is active. Earlier ancestry/origin/discipline steps no longer consume invisible name input. The creator footer is reduced to Cancel, Back, and Continue/Create rather than the previous extra reset/view controls.

### Discovery-driven local minimap

New file:

```text
js/text/ui/minimapModel.js
```

`createMinimapModel(state)` consumes existing `state.atlas[placeId].visited` knowledge. It does not create a second geography database or new persistence shape.

Behavior:

- the starting map initially shows only the known/current coordinate;
- normal navigation discovery reveals additional cells;
- visited topology connections render fully;
- connections toward unknown neighboring cells/exits can appear only as short local stubs from known positions;
- alpha-coordinate topology places and numeric-grid places share the same UI model;
- the current location and explored/total count appear in the minimap footer.

This deliberately implements the old-school reveal-as-you-travel behavior rather than exposing the full authored topology.

### Navigation controls

The minimap occupies the former large D-pad area. The D-pad now sits centered beneath it.

Movement buttons are constrained to approximately **24–30px** rather than the prior ~65px sidebar controls, exceeding the requested 50% reduction. Direction/stop symbols are centered explicitly in the buttons. Auto Run is a compact centered control under the pad.

### Action categories

The long flat sidebar action list is replaced in the actual game canvas with seven category buttons:

```text
Character
Spellbook
Codex
World
Crafting
Combat
System
```

Character contains Stats, Training, Skills, Inventory, Equipment. Spellbook exposes current Known Spells/Techniques/Abilities command surfaces. World groups Look Around/Nearby/Local Atlas/Maps. Combat contains Battle Status; System contains Help/Save.

Codex and Crafting include disabled planned entries such as Flora & Fauna, Loot Index, Item Compendium, Recipe Book, Crafting Workbench, and Processing. These are navigation-architecture placeholders only; they do not pretend those gameplay systems are implemented.

The direct visible `Character` summary button was removed because it duplicated information already shown in the persistent context pane. The typed/global `character` command remains available as a compatibility interface and `GLOBAL_ACTIONS` retains it for older callers/tests.

### Permanent right-pane character information

The context pane now renders without command injection:

- character name / ancestry / active discipline / level;
- HP, MP, TP current/max;
- STR, DEX, VIT, AGI, INT, MND, CHR;
- ATK, DEF, ACC, EVA;
- M.ATK, M.DEF, M.ACC, M.EVA;
- current location and coordinate.

The main output pane remains the activity/command log. The old right-pane command-history block was removed to prioritize live character state.

### Canvas shell identity

The canvas splash title now says **Hearth & Horizon** rather than the stale legacy project title.

## UI regression coverage

New `tests/uiStreamlining.test.js` proves:

- minimap begins from atlas discoveries only;
- movement reveals cells/connections;
- compact centered D-pad is below the minimap;
- actual game sidebar begins with category menus and no redundant Character-summary button;
- Character, Spellbook, Codex, and Crafting category structure;
- disabled planned placeholders do not masquerade as working commands;
- right-pane snapshot includes canonical attributes/derived combat values;
- creator text wrapping handles prose and long tokens;
- creator keyboard text edits only the visible review-name field.

## Validation checkpoint

Runtime UI integration head:

```text
711c494a3e8e8249241d034db91174fd79c4226e
```

The exact test result at that runtime head was:

```text
tests       377
pass        377
fail        0
cancelled   0
skipped     0
todo        0
```

Benchmark from that runtime head:

```text
create 1,000 player combat profiles:              482.560ms total | 0.482560ms/op
create 1,000 enemy combat profiles:               113.377ms total | 0.113377ms/op
resolve 1,000 basic attacks:                      549.744ms total | 0.549744ms/op
run 10,000 tick dispatches with 5 subscribers:     45.061ms total | 0.004506ms/op
resolve 10,000 direct travel route lookups:      7239.355ms total | 0.723935ms/op
```

Version/pipeline synchronization head:

```text
a37db888a25f06c004f1abefcc9fcc82c73b6ab5
```

GitHub Actions on that head completed **test success, build success, report-build-status success, and deploy success**. The runtime tests at the preceding UI integration head already contained the new 377-test suite; later changes only synchronized the `0.6.200.2` manifest and pipeline expectations.

The runner continues to emit the known non-blocking Node-20-actions deprecation warning. Project commands themselves run with Node 20.20.2.

Documentation closeout commits follow the validated version head; refetch current `main` before the next coding session.

## Current transitional debt / UI limitations

Do not turn these into an unbounded rewrite:

- the local minimap is intentionally rough; richer landmarks/icons, multi-level presentation, world-map screens, and POI styling remain future UI work;
- the minimap reveals atlas knowledge, but broader regional/world mapping still needs authored presentation layers;
- planned Codex/Crafting category entries are disabled placeholders until their underlying engines/data are ready;
- `capabilityEngine` evaluates ownership/use eligibility but does not execute generalized effects yet;
- placeholder spell and weapon-skill actions remain in the current combat scaffold;
- `skillCaps.js` remains sparse/placeholder-confidence;
- active discipline still participates in legacy equipment eligibility;
- `player.jobs`, `mainJobId`, `raceId`, `nationId`, and related internal names remain save/runtime compatibility seams;
- historical FFXI research modules remain bounded reference surfaces;
- `places.js` encounter `spawnRules` and place connections remain transitional seams;
- `gil`, historical localStorage keys, and legacy-shaped POI hook IDs remain intentional compatibility debt.

## Next target

```text
0.6.300 — Original magic and active ability engine
```

**No 0.6.300 implementation started in this UI usability session.** Start it only under a new user-authorized run budget unless the user explicitly requests another UI refinement first.

Recommended first 0.6.300 unit remains:

1. refetch latest `main`, checks, required docs, architecture, and version manifest;
2. inspect combat actions/battle, ActionResult/events, timed tasks/interrupts, statuses, capabilities, equipment/item effect metadata, and bounded historical spell research;
3. define executable original-world ability/effect records separately from capability ownership;
4. establish original spell schools/traditions and representative techniques with targeting, resource costs, cast/activation time, recast/cooldown, interruption, and structured effect payloads;
5. keep capability/loadout/preparation/resource/context prerequisites compositional rather than making active discipline a universal gate;
6. use canonical fictional time for non-instant activation;
7. preserve the current battle scaffold behind bounded adapters until `0.6.400`;
8. prove offensive, restorative/support, and non-combat/contextual effects without mass-porting historical spell catalogs;
9. validate/version/test/benchmark/document, then stop at the coherent 0.6.300 boundary.
