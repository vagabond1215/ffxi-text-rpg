# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — naming, provenance, scale, and legacy/reference policy.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product/schema version protocol and release gates.
- `docs/TRANSITIONAL_ARCHITECTURE.md` — temporary seams that must not harden into final design.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.
- `docs/LOCALITY_AND_EXPLORATION_MODEL.md` — settlement/exploration navigation contract.
- `docs/THREAD_HANDOFF.md` — latest implementation handoff.

## Current baseline

```text
Product:      0.6.800.1
Package:      0.6.800
Account Save: 4
Game State:   5
Data:         26
Benchmark:    1
Codename:     Persistent Companions and Party
```

This remains pre-alpha product development. Milestone numbers describe active contracts, not completion percentages.

## Product laws

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

Key rules:

- simulation time and real-world waiting are separate;
- one continuous character learns across disciplines rather than changing magical identities;
- disciplines can describe training paths without becoming universal use gates;
- learned capability/proficiency ownership belongs to the continuous character;
- settlements, roads, wilderness, livelihoods, relationships, logistics, danger, and combat share one persistent world;
- maps represent acquired knowledge and never automatically expose authored coordinates or undiscovered extent;
- safe settlements use named localities/actions while terrain-sensitive spaces may use fine exploration navigation;
- resources and rewards have physical/economic/social provenance;
- companions are persistent characters and world participants, not summons;
- mechanics and representative content grow together;
- regional content is authored as a validated cross-linked graph;
- legacy FFXI-derived material is research/reference/migration material only.

## Phase summary

| Phase | Theme | Status / exit promise |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete.** Architecture can evolve without another broad reset. |
| `0.5` | Simulation + original-world/content substrate | **Complete.** Time, interrupts, provenance, ecology, transport, projects, regional packs, and scalable validation exist. |
| `0.6` | Integrated character/mechanics content | **Active through 0.6.800.** Continuous-character progression, semantic UI, abilities, Combat 2.0, locality navigation, equipment/tools, production, regional ecology breadth, and persistent companions are integrated. The exit audit follows. |
| `0.7` | Multi-region playable alpha | Multiple settlements/regions, transport, NPC populations, quests, relationships, economies, and authored content support a real sandbox campaign. |
| `0.8` | Life and infrastructure expansion | Property, production, agriculture, logistics, relationships, and earned automation deepen long-form play. |
| `0.9` | Adventure depth and release hardening | Advanced content, balance, UI, persistence, and performance reach release-candidate quality. |
| `1.0` | Live foundation | The central persistent-life/adventure promise is coherent, stable, migratable, and release-ready. |

---

# 0.4 — Foundation — complete

Delivered development direction/versioning, ordered persistence migrations, structured `ActionResult`, bounded semantic events, and architecture stabilization.

---

# 0.5 — Simulation and Content Substrate — complete

- **0.5.100** deterministic fictional world clock.
- **0.5.200** pause/resume and deterministic speed control.
- **0.5.300** canonical timed tasks.
- **0.5.400** deterministic advance-until-interrupt model.
- **0.5.500** day boundaries and end-of-day review.
- **0.5.550** original-world identity and stable-ID migration.
- **0.5.600** persistent projects and resource provenance.
- **0.5.650** ecology, gathering, and population substrate.
- **0.5.700** canonical routes and scheduled transport.
- **0.5.800** regional content packs, normalization, and scalable cross-reference validation.
- **0.5.900** simulation/content-substrate exit gate.

Phase 0.5 closes because long fictional activities advance deterministically and interrupt/summarize; original-world IDs are established; projects/provenance exist; ecology/gathering/population definitions can populate the world; scheduled transport connects setting anchors; and regional content packs/validators can support high-volume original content without turning parsing success into canonical truth.

---

# 0.6 — Integrated Character and Mechanics Content — active

## 0.6.100 — Character stats and progression — complete

Resulting baseline: **0.6.100.1 / Package 0.6.100 / Account Save 4 / Game State 5 / Data 19**.

- Continuous-character base attributes/resources and progression are canonical runtime authority.
- Highest attained discipline training rank drives persistent base growth; changing to lower training cannot reduce it.
- Active discipline contributes contextual training/stat modifiers without owning the person.
- Historical FFXI formulas remain bounded reference/research surfaces.

## 0.6.200 — Skills, proficiencies, disciplines, and capabilities — complete

Resulting capability baseline: **0.6.200.1 / Package 0.6.200 / Data 20**. Revision `0.6.200.2` was a bounded Canvas usability pass.

- Character-owned capability state separates learning requirements from use requirements.
- Disciplines may teach capabilities, but learned capability persists after switching.
- Use checks proficiency, equipment/tool tags, preparation, flags, resources, and action/world context compositionally.
- Current discipline caps constrain new proficiency gain rather than erasing learned proficiency.

## 0.6.250 — Player interface architecture — complete

Resulting baseline: **0.6.250.1 / Package 0.6.250 / Data 20**.

- Active browser shell moved from full Canvas to semantic DOM/CSS.
- Renderer-independent `gameViewModel.js` became the semantic presentation seam.
- Scene/world meaning, compact character status, contextual actions, primary information navigation, recent events, and Search-or-act replaced a permanent output-log design.
- Character creation became a single-screen native form.
- Discovery map remained a knowledge-derived SVG exploration substrate; Canvas modules remain bounded regression/reference code.

## 0.6.300 — Original magic and active ability engine — complete

Resulting baseline: **0.6.300.1 / Package 0.6.300 / Data 21**.

- Executable canonical ability/effect records are separate from character capability ownership.
- Original spell traditions and representative offensive, restorative/support, martial, and contextual effects exist.
- Non-instant activation uses canonical timed tasks; costs, cooldowns, interruption, targeting, and structured effect payloads are deterministic.
- `ability.started`, `ability.resolved`, and `ability.interrupted` semantic events are independent of display prose.
- Semantic UI ability intents and a bounded `invoke` command adapter share the same authority.

## 0.6.400 — Combat 2.0 — complete

Resulting baseline: **0.6.400.2 / Package 0.6.400 / Account Save 4 / Game State 5 / Data 22**.

- Unified basic attacks, canonical abilities, bounded legacy cast/technique adapters, and enemy actions behind structured combat-action history.
- Combat contract v2 uses deterministic fictional-time readiness/recovery rather than a second combat clock.
- Enemy readiness is an interrupt provider on the canonical simulation substrate.
- Finite combat statuses carry canonical application/expiry timestamps.
- Battle/encounter IDs are deterministic within runtime state.
- Original enemy active-ability data and deterministic enemy action selection are established.
- Rewards, provenance opportunities, skill gain, capability composition, and semantic UI seams remain intact.

Bounded limitations: enemy tactical policy remains intentionally small; AoE/ground targeting, deeper resistance layers, formation tactics, and broad enemy ability catalogs are later depth work.

## 0.6.450 — Locality and exploration navigation — complete

Resulting baseline: **0.6.450.1 / Package 0.6.450 / Account Save 4 / Game State 5 / Data 22**.

- Added semantic navigation modes for locality, exploration, route, and combat contexts.
- Existing safe settlement `place` records serve as named locality nodes rather than duplicating city geography.
- Locality crossings consume authored fictional time through the canonical interrupt engine.
- Safe locality/route/combat presentation omits the exploration map and D-pad; wilderness retains knowledge-derived map and directional controls.
- Internal POI/grid coordinates remain implementation data rather than player-facing geography.

## 0.6.500 — Equipment, tools, item breadth, and effects — complete

Resulting baseline: **0.6.500.1 / Package 0.6.500 / Account Save 4 / Game State 5 / Data 23**.

- Equipment catalog v3 provides representative weapons, armor, shields, accessories, travel gear, and field tools.
- Original field tools cover cutting, mining, woodcutting, digging, and fishing.
- `equipmentToolEngine` is the shared equipped-tool authority for practical capability and gathering requirements.
- Newly authored original equipment defaults to no active-discipline restriction; older starter `allowedJobs` fields remain bounded compatibility debt.

## 0.6.600 — Gathering, hunting, processing, crafting, cooking, and salvage — complete

Resulting baseline: **0.6.600.1 / Package 0.6.600 / Account Save 4 / Game State 5 / Data 24**.

- Added additive character-owned work proficiencies for gathering, field dressing, salvage, metalworking, crafting, and cooking domains.
- Environmental gathering, body recovery, and production use canonical timed work and fictional time.
- Hands-on work owns character activity and blocks incompatible movement/travel; scheduled fare rollback is atomic.
- Workstations are derived from locality service/POI tags rather than a duplicate facility database.
- Canonical processing/crafting/cooking/salvage/recycling records consume inputs at start and materialize outputs at completion.
- Production outputs retain transformation provenance; full storage produces persistent pending output instead of duplication/loss.
- Representative Redstone metallurgy/crafting/salvage and regional cooking loops prove the contract.

Bounded limitation: the active Craft browser view still needs a richer dedicated production presentation/action surface; engine/data authority must not be moved back into renderer prose.

## 0.6.700 — Ecology and regional creature/resource content breadth — complete

Resulting baseline: **0.6.700.1 / Package 0.6.700 / Account Save 4 / Game State 5 / Data 25**.

- Added a regional ecology/resource catalog layer and unified registries so content breadth does not turn the original substrate module into a monolith.
- Expanded **Elderwood**, **Redstone Reach**, and **Starfen** with original species/populations occupying distinct ecological/gameplay niches.
- Expanded regional flora, mineral, timber/fiber/food, hide/bone, and hunting-resource records with explicit provenance and useful production/trade sinks.
- Environmental gathering and defeated-creature body recovery both feed the `0.6.600` production economy.
- Recovered hunt materials resolve through canonical item metadata while acquisition provenance remains tied to the defeated body/opportunity.
- Regional sources/populations use existing deterministic capacity/regeneration/appearance/world-state hooks rather than species-specific engine branches.
- Content-pack ownership/dependencies were expanded and validated without duplicate ownership of existing places.

The track intentionally populates proven mechanics rather than creating a second ecology or production engine.

## 0.6.800 — Persistent companion/party foundation — complete

Resulting baseline: **0.6.800.1 / Package 0.6.800 / Account Save 4 / Game State 5 / Data 26**.

- Added original versioned companion definitions with backing NPC identity, recruitment locations/requirements, tactical role/policy, and relationship dimensions.
- Added additive/lazy persistent `state.party` with recruited-companion records, active membership, capacity, resources/statuses, relationship state, location continuity, and validation.
- A companion remains one persistent NPC promoted into character-like party state; backing NPC identity/location is synchronized or reconstructible for older Game State 5 saves.
- Recruitment, joining, and leaving emit structured semantic events and are blocked during active combat.
- Combat uses explicit ally/enemy sides. Active companions enter encounters as allies, cannot be friendly-targeted by basic attacks, can keep the ally side alive after the player falls, and synchronize battle resources/statuses back into persistent party state.
- Representative companion tactics contribute structured Combat 2.0 actions through the existing action history rather than special prose-only combat.
- Active companions follow exploration exits, locality crossings, and canonical route/scheduled-transport arrivals.
- The game view model exposes semantic party state and a direct `party.recruit` UI intent; recruitment does not require manufacturing a command string.
- Data advanced to 26 because canonical companion definitions, recruitment/tactics, and relationship-dimension contracts are authored runtime data. Party runtime state remains additive/lazily reconstructible in Game State 5.

Bounded limitations:

- only one representative recruitable companion currently proves the foundation;
- companion tactical policy is intentionally basic and companions are not yet independent simulation-interrupt providers;
- deeper relationship progression/dialogue, companion-specific progression/loadouts, formations, and broad companion content remain later work;
- the semantic party model exists, but a dedicated full party browser view is not yet required;
- old POI/command companion compatibility text remains transitional and must eventually route to `partyEngine` rather than become authority;
- an unrelated legacy-shaped POI currently duplicates the display name “Mara Venn”; its stable POI ID may remain, but the display-name collision should be repaired in a bounded content cleanup.

## 0.6.900 — Integrated-mechanics exit gate — next

`0.6.900` is an integration/audit/stabilization track, not another broad mechanics subsystem.

Bounded acceptance direction:

- audit save/load and lazy normalization across all additive `0.6` state, including abilities, work, ecology, combat, and party;
- audit fictional-time/interrupt interactions across combat, ability activation, work, travel, locality crossings, projects, and day review;
- verify continuous-character ownership rules and identify remaining accidental active-discipline hard gates;
- verify party/combat/travel/work coexistence and exactly-once state/resource synchronization;
- validate provenance/source/sink continuity through combat recovery, gathering, production, trade, and rewards;
- audit semantic UI intents/view models against old command/prose compatibility adapters so authority remains in engines/data;
- run world/content-pack/database validators and repair dangling or duplicate authority seams found by the audit;
- run the full suite, benchmark, browser build/deploy, and performance-regression review;
- close Phase 0.6 only when the integrated mechanics baseline is coherent enough to define exact `0.7` playable-alpha entry criteria;
- avoid using the gate as permission for mass content generation or a new broad subsystem.

---

# Later phases

## 0.7 — Multi-region playable alpha

Build enough connected settlements, regions, NPC populations, economies, quests/contracts, relationships, transport, companions, and authored content for a sustained sandbox campaign rather than isolated substrate demonstrations.

## 0.8 — Life and infrastructure expansion

Deepen property, home/infrastructure, workshops, agriculture, logistics, social life, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand advanced regions/dungeons, difficult encounters, rare systems, high-level production/economies, UI/accessibility, migration hardening, balance, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
