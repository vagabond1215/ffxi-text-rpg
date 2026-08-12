# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — naming, provenance, scale, and legacy/reference policy.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product/schema version protocol and release gates.
- `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.
- `docs/THREAD_HANDOFF.md` — latest implementation handoff.

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

This remains pre-alpha product development. Milestone numbers describe active contracts; they are not completion percentages.

## Product laws

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Key rules:

- simulation time and real-world waiting are separate;
- one continuous character learns across disciplines rather than changing magical identities;
- disciplines can describe training paths without becoming universal use gates;
- learned capability/proficiency ownership belongs to the continuous character;
- settlements, roads, wilderness, livelihoods, relationships, logistics, danger, and combat share one persistent world;
- maps represent acquired knowledge and player map views reveal rather than omnisciently expose geography;
- the player interface presents world meaning and contextual choices rather than treating command output as the game itself;
- resources and rewards have physical/economic/social provenance;
- mechanics and representative content grow together;
- regional content is authored as a validated cross-linked graph;
- legacy FFXI-derived material is research/reference/migration material only.

## Phase summary

| Phase | Theme | Status / exit promise |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete.** Architecture can evolve without another broad reset. |
| `0.5` | Simulation + original-world/content substrate | **Complete.** Time, interrupts, provenance, ecology, transport, projects, regional packs, and scalable validation exist. |
| `0.6` | Integrated character/mechanics content | **Active through 0.6.300.** Character ownership/capabilities, semantic player interface, and original executable magic/ability contracts are established; Combat 2.0, item breadth, production chains, ecology content, and companions follow. |
| `0.7` | Multi-region playable alpha | Multiple settlements/regions, transport, NPC populations, quests, relationships, economies, and authored content support a real sandbox campaign. |
| `0.8` | Life and infrastructure expansion | Property, production, agriculture, logistics, relationships, and earned automation deepen long-form play. |
| `0.9` | Adventure depth and release hardening | Advanced content, balance, UI, persistence, and performance reach release-candidate quality. |
| `1.0` | Live foundation | The central persistent-life/adventure promise is coherent, stable, migratable, and release-ready. |

---

# 0.4 — Foundation — complete

Delivered development direction/versioning, ordered persistence migrations, structured `ActionResult`, bounded semantic events, and architecture stabilization.

---

# 0.5 — Simulation and Content Substrate — complete

## 0.5.100 — Deterministic world clock — complete

- [x] Canonical simulated seconds.
- [x] Deterministic advancement independent of wall-clock truth.
- [x] Persistence migration and rollover tests.

## 0.5.200 — Pause and speed control — complete

- [x] Pause/resume semantics.
- [x] Deterministic speed multipliers and scheduler adapter.
- [x] Sub-second remainder without catch-up drift.

## 0.5.300 — Canonical timed tasks — complete

- [x] Versioned task registry and stable task IDs.
- [x] Start/progress/complete/cancel semantics.
- [x] Canonical deadlines and deterministic reconciliation.

## 0.5.400 — Simulation interrupt model — complete

- [x] Advance-until-event semantics.
- [x] Deterministic time/priority/tie ordering.
- [x] Built-in task completion and generic interrupt providers.

## 0.5.500 — Day boundary and end-of-day review — complete

- [x] Deterministic midnight boundaries.
- [x] Structured day summaries from semantic events.
- [x] Configurable end-of-day auto-pause.
- [x] Priority-safe simultaneous interrupts.

## 0.5.550 — Original-world identity and canonical nomenclature — complete

Implemented original powers/regions/places/maps/ancestries/transitional disciplines, Game State v4 -> v5 identity migration, canonical world-facing vocabulary, bounded legacy adapters, and explicit legacy/reference quarantine.

## 0.5.600 — Resource provenance and persistent projects — complete

Implemented persistent projects, source/sink metadata, provenance-aware post-combat resource opportunities, deterministic timed recovery actions, and physical-resource recovery through normal inventory rules.

## 0.5.650 — Ecology, gathering, and spawn substrate — complete

Implemented canonical family/species records, place-bound populations, flora/mineral/fishing sources, persistent depletion/regeneration, deterministic rare/named hooks, and ecology cross-reference validation. Existing `places.js` spawn rules remain a bounded transitional encounter-placement seam.

## 0.5.700 — Travel and scheduled transport substrate — complete

Implemented canonical routes/stops, fictional distance/duration/hazards, cargo and map/knowledge hooks, timed walking travel, shared scheduled-service contracts, deterministic caravan/ferry departures and arrivals, travel interrupts, and route/service validation. Existing place connections remain a bounded fallback where canonical route coverage is incomplete.

## 0.5.800 — Regional content packs, normalization, and validation — complete

Resulting data contract: **Data 19**.

- [x] Stable regional/shared pack manifests, ownership, dependencies, and explicit collections.
- [x] Human-readable stable-ID ownership/conflict detection.
- [x] Unified cross-reference validation across geography, transport, ecology, items/provenance/sinks, NPCs, shops, recipes, quests, and relationships.
- [x] Review-only legacy/reference candidate normalization.
- [x] Representative shared/Elderwood/Starfen packs and intentional cross-region dependencies.
- [x] Generated 600-record validation fixture before mass canonical authoring.

## 0.5.900 — Simulation/content-substrate exit gate — complete

Resulting baseline: **0.5.900.1 / Package 0.5.900 / Game State 5 / Data 19**.

The explicit gate covers deterministic simulation, original-world identity, projects/provenance, ecology/gathering, routes/transport, regional content/scale, and persistence compatibility. The gate remains a historical readiness invariant in later phases rather than requiring the product version to remain exactly 0.5.900.

Phase 0.5 closes because long fictional activities can advance deterministically and interrupt/summarize; original-world IDs are established; projects/provenance exist; ecology/gathering/population definitions can populate the world; scheduled transport connects setting anchors; and regional content packs/validators can support high-volume original content without turning parsing success into canonical truth.

---

# 0.6 — Integrated Character and Mechanics Content — active

## 0.6.100 — Character stats and progression — complete

Resulting baseline: **0.6.100.1 / Package 0.6.100 / Account Save 4 / Game State 5 / Data 19**.

- [x] Added versioned `player.statState` owned by the continuous character.
- [x] Original provisional character base attributes/resources replace historical FFXI formulas as canonical player runtime authority.
- [x] Persistent base growth follows the highest attained discipline training level rather than the currently active discipline.
- [x] Active discipline contributes contextual attribute/resource/training focus without becoming the owner of base character stats or a universal capability gate.
- [x] Added `player.progression.character` with lifetime EXP and highest attained discipline level across per-discipline records.
- [x] Switching to a lower-level discipline does not reduce character base growth.
- [x] Historical FFXI stat and inferred-job-resource formulas remain callable only at explicit research/reference boundaries and tests assert they are not runtime authority.
- [x] New state is additive and lazily repairable; Account Save remains 4 and Game State remains 5.

### 0.6.100 bounded limitations

- Base stat numbers are intentionally provisional original balance, not final 1.0 balance.
- `player.jobs`, `mainJobId`, `raceId`, and related internal names remain migration-compatible storage seams.
- Discipline levels still use the existing EXP-table scaffold; deeper training/mastery structure can evolve incrementally.
- Equipment/status modifiers still use established combat-profile contracts.

## 0.6.200 — Skills, proficiencies, disciplines, and capabilities — complete

Capability contract integrated at **0.6.200.1 / Package 0.6.200 / Account Save 4 / Game State 5 / Data 20**. Revision `0.6.200.2` was a bounded canvas-UI usability pass before the dedicated interface architecture track.

- [x] Added canonical capability catalog with stable capability IDs and separate learning/use contracts.
- [x] Added versioned character-owned capability state under `player.progression.capabilities`.
- [x] Disciplines can satisfy capability learning paths, including previously attained inactive-discipline training.
- [x] Once learned, a capability remains character-owned after discipline switching.
- [x] Capability use checks learned proficiency, main-hand/equipment tags, tools, preparation tags, flags, resources, and action/world context.
- [x] The active discipline is explicitly **not** a universal capability-use gate.
- [x] Character-owned proficiency survives discipline switching even when the current discipline has a lower or zero training cap; current discipline caps constrain new gain instead of shrinking learned proficiency.
- [x] Representative martial and practical capabilities prove combat/resource-recovery/gathering-shaped requirements without opening a mass content catalog.
- [x] Capability data is registered separately from executable `abilities` definitions.
- [x] Data advanced 19 -> 20 for the canonical capability learning/use contract; Account Save remains 4 and Game State remains 5 because capability state is additive/lazy.

### 0.6.200 bounded limitations

- Capability records remain representative substrate, not a broad technique catalog.
- Equipment eligibility still contains discipline-shaped compatibility requirements that should migrate toward capability/loadout prerequisites incrementally.
- Current skill-cap rank math remains explicitly placeholder-confidence research/scaffolding.
- No broad trainer, quest-instruction, or preparation interface exists yet.

## 0.6.250 — Player interface architecture — complete

Resulting baseline: **0.6.250.1 / Package 0.6.250 / Account Save 4 / Game State 5 / Data 20**.

The purpose of this inserted track was to establish the intended interaction model before magic, Combat 2.0, crafting, companions, and larger content catalogs multiplied the number of player actions.

- [x] Replaced the active full-canvas browser shell with semantic DOM/CSS presentation; Canvas modules remain bounded transitional regression/reference code.
- [x] Added renderer-independent `gameViewModel.js` for scene, status, map, movement, current activity, and contextual actions.
- [x] Made the world/scene the primary center view rather than a permanent player-facing `Output Log`.
- [x] Added a discovery-driven SVG local map backed by existing atlas knowledge; authored topology is not exposed omnisciently.
- [x] Kept a compact centered D-pad beneath the map and added direct keyboard movement for fast/fine navigation.
- [x] Added compact primary information navigation: Scene, Character, Spellbook, Journal, Codex, Craft, and World.
- [x] Added a situation-dependent contextual action bar capped to a small useful set rather than presenting the whole command catalog.
- [x] Added a compact persistent status view for identity, HP/MP/TP, primary attributes, and current activity.
- [x] Added a Search-or-act field as the keyboard/power-user adapter into existing command/slash behavior.
- [x] Replaced the creator wizard with a single-screen native form containing name, ancestry, sex, origin, starting discipline, descriptions/tags, and a live starting-profile summary.
- [x] Native HTML/CSS text flow now owns player-facing creator/scene wrapping instead of custom canvas truncation/wrapping logic.
- [x] Kept unimplemented Journal/Codex/Craft depth explicit rather than pretending legacy data is a finished interface.
- [x] Added dedicated semantic-interface tests while retaining canvas compatibility regression tests.

### 0.6.250 version impact

- **Product:** `0.6.200.2` -> `0.6.250.1`.
- **Package:** `0.6.200` -> `0.6.250`.
- **Account Save:** unchanged at 4.
- **Game State:** unchanged at 5; interface state is ephemeral and the DOM shell consumes existing canonical runtime state.
- **Data:** unchanged at 20; no canonical gameplay data contract changed.
- New system: `domUi 0.1.0`.
- New system: `gameViewModels 0.1.0`.
- `canvasUi 0.8.0` remains tracked as a transitional compatibility/reference surface.

### 0.6.250 bounded limitations

- Several information views still bridge to existing typed-command outputs until those domains expose dedicated presentation models.
- The Search-or-act field is command-capable, not yet a full fuzzy entity/action search index.
- The local map is intentionally rough; landmark/icon/regional-map depth should grow without replacing atlas knowledge as authority.
- Simulation controls are displayed as state but a richer dedicated time-control HUD should only be added when it is wired cleanly to the active browser scheduler/interrupt flow.
- `uiState.js` still reuses some structural helpers from the former canvas input layer; extract shared UI state incrementally rather than through a broad rewrite.

## 0.6.300 — Original magic and active ability engine — complete

Resulting baseline: **0.6.300.1 / Package 0.6.300 / Account Save 4 / Game State 5 / Data 21**.

- [x] Added executable canonical ability/effect records separately from character capability ownership.
- [x] Added original spell traditions Embercraft, Vital Weave, and Ward Lore with stable original IDs and no historical spell-name promotion.
- [x] Added representative executable Ember Dart, Mending Thread, Stone Ward, Guarded Cut, and Waymark Reading records.
- [x] Defined deterministic target contracts, MP/TP costs, activation durations, cooldowns, structured effects, and interruption behavior.
- [x] Kept `capabilityEngine` as the character ownership/use-prerequisite authority while `abilityEngine` owns effect execution and cost spending.
- [x] Backed non-instant abilities with canonical `ability.activation` timed tasks and a deterministic ability-completion interrupt above generic task completion.
- [x] Added structured `ability.started`, `ability.resolved`, and `ability.interrupted` semantic events independent of display prose.
- [x] Added damage, healing, status, and contextual-survey effects without opening Combat 2.0 or a mass spell catalog.
- [x] Waymark Reading reports only already-acquired atlas knowledge rather than revealing authored topology.
- [x] Added additive/lazy Game State v5 ability runtime state for active activation and cooldown deadlines.
- [x] Added semantic `ability.activate` UI intents and learned-ability view-model records; combat context can surface ready learned abilities without manufacturing command strings.
- [x] Added `invoke <ability>` as a bounded command/power-user adapter while leaving legacy `cast`/transitional combat technique behavior behind compatibility seams for 0.6.400.
- [x] Corrected `wait` so non-travel waits advance canonical fictional world time and reconcile active abilities rather than advancing only the wall-clock tick adapter.
- [x] Data advanced 20 -> 21 for the canonical spell-school/ability data contract; Account Save remains 4 and Game State remains 5 because runtime ability state is additive/lazily reconstructible.

### 0.6.300 bounded limitations

- The old `combatActionEngine.castSpell()` placeholder and transitional combat-technique adapter remain intentionally bounded until Combat 2.0.
- Only one active ability activation is supported at a time; no action queue/concurrency model is claimed yet.
- Enemy canonical ability selection/execution, AoE/ground targeting, resistance/accuracy layers, and deeper tactical timing belong to 0.6.400.
- Status records can carry duration metadata, but this track does not redesign status-expiry orchestration around world time.
- Current representative effect coefficients are provisional original balance and may be tuned by Combat 2.0 without changing capability/ability ownership boundaries.
- Cooldown currently begins on successful resolution. Interrupted abilities retain already-spent resources and do not start cooldown.
- The DOM Spellbook presentation still has command-backed transitional elements; the semantic view model and direct battle-context ability intents are canonical seams to extend rather than justification for another UI rewrite.

## 0.6.400 — Combat 2.0 — next

Recommended first bounded unit:

- [ ] Inspect current battle topology/phase/combatants, action adapters, statuses, canonical ability engine, reward/resource-opportunity flow, equipment, and deterministic timing contracts.
- [ ] Define a canonical encounter/combat-state contract that can evolve beyond placeholder action assumptions without rewriting unrelated world simulation.
- [ ] Make canonical abilities first-class combat actions with deterministic target/action resolution.
- [ ] Define opponent action selection/AI, action timing/recovery, interruption, and status interaction on the existing fictional-time substrate.
- [ ] Keep skills, equipment, capabilities, preparation, and resources compositional; do not turn active discipline into a hard class gate.
- [ ] Migrate legacy `attack`, `cast`, and `technique` commands behind bounded adapters to the canonical combat path.
- [ ] Preserve victory/defeat, EXP, physical resource opportunities, and provenance behavior while replacing combat scaffolding.
- [ ] Validate/version/test/benchmark and stop before `0.6.500` item/equipment breadth.

## Later planned 0.6 tracks

- `0.6.500` canonical item/equipment/tool breadth;
- `0.6.600` gathering, hunting, processing, crafting, cooking, salvage;
- `0.6.700` ecology and regional creature/resource content;
- `0.6.800` AI party/companion foundation;
- `0.6.900` integrated-mechanics exit gate.

The phase exit requires one continuous character to train across disciplines, use substantial skill/magic/item catalogs, gather and transform resources, fight tactically with or without companions, and participate in a functioning material economy.

---

# 0.7 — Multi-Region Playable Alpha

Planned tracks cover multiple cities/settlements and exploration, regional transport/logistics, hundreds-scale NPC populations, regional economies, systemic quests/contracts/reputation, relationships/romance, distinct ecology/content packs, substantial item/recipe/technique breadth, and a complete multi-city opening campaign layer.

---

# 0.8 — Life and Infrastructure Expansion

Deepen property, construction, farming/gardening, husbandry/taming, workshops, logistics, labor, households, civic institutions, production chains, maintenance, and earned automation.

---

# 0.9 — Adventure Depth and Release Hardening

Deepen advanced combat/magic, bosses/dungeons/expeditions, high-tier equipment/crafting, regional/faction arcs, long-simulation balance, UI/accessibility, migrations, performance, and thousands-of-record validation.

---

# 1.0 — Live Foundation

1.0 begins the explicit compatibility/product promise for a persistent character living across a connected original fantasy world with meaningful livelihoods, relationships, exploration, material progression, danger, home/infrastructure, and long-term ambition.