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
Product:      0.6.500.1
Package:      0.6.500
Account Save: 4
Game State:   5
Data:         23
Benchmark:    1
Codename:     Equipment and Tool Breadth
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
- mechanics and representative content grow together;
- regional content is authored as a validated cross-linked graph;
- legacy FFXI-derived material is research/reference/migration material only.

## Phase summary

| Phase | Theme | Status / exit promise |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete.** Architecture can evolve without another broad reset. |
| `0.5` | Simulation + original-world/content substrate | **Complete.** Time, interrupts, provenance, ecology, transport, projects, regional packs, and scalable validation exist. |
| `0.6` | Integrated character/mechanics content | **Active through 0.6.500.** Character ownership, semantic UI, original abilities, Combat 2.0 timing, locality navigation, and usable equipment/tool breadth are established. Production chains, ecology content, companions, and integration follow. |
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

- Unified basic attacks, canonical abilities, legacy cast/technique adapters, and enemy actions behind a structured combat-action history.
- Combat contract v2 adds deterministic fictional-time readiness/recovery for player and enemy combatants.
- Enemy readiness is an interrupt provider on the existing simulation substrate; enemy actions can interleave with a timed player cast and interrupt it before completion.
- Finite combat statuses carry canonical application/expiry timestamps and reconcile against world time rather than a separate combat clock.
- Battle and encounter IDs are deterministic within runtime state rather than wall-clock-generated.
- Added an original enemy active-ability catalog and representative Redfang Raider technique, **Rushing Cleave**, with deterministic selection policy.
- Rewards, resource opportunities/provenance, skill gain, capability composition, and semantic UI seams remain intact.

Bounded limitations: enemy tactical policy is still intentionally small; AoE/ground targeting, deeper resistance layers, formation/party tactics, and large enemy ability catalogs are later breadth/depth work rather than prerequisites for the Combat 2.0 timing contract.

## 0.6.450 — Locality and exploration navigation — complete

Resulting baseline: **0.6.450.1 / Package 0.6.450 / Account Save 4 / Game State 5 / Data 22**.

- Added semantic navigation modes for locality, exploration, route, and combat contexts.
- Existing safe settlement `place` records serve as named locality nodes; no redundant city-geography schema was introduced.
- Guarded city areas expose named adjacent districts and semantic locality/POI actions instead of requiring compass movement.
- Locality crossings consume authored coarse fictional time through the canonical interrupt engine; ordinary UI browsing remains free.
- The active DOM renderer **omits** the local map and D-pad in safe locality, route, and combat contexts.
- Wilderness/exploration retains the acquired-knowledge SVG map and directional controls.
- Internal POI/grid coordinates remain implementation data and are not exposed as player-facing city identity.
- Higher-resolution shaped cartography remains optional/deferred exploration presentation work, not a prerequisite for settlement interaction.

## 0.6.500 — Equipment, tools, item breadth, and effects — complete

Resulting baseline: **0.6.500.1 / Package 0.6.500 / Account Save 4 / Game State 5 / Data 23**.

- Equipment catalog v3 now provides representative weapons, armor, shields, accessories, travel gear, and field tools instead of only a narrow starter set.
- Added usable original field tools for cutting, mining, woodcutting, digging, and fishing: Field Knife, Prospector Pick, Woodsman Hatchet, Digging Spade, Reed Sickle, and Marsh Fishing Rod.
- Added `equipmentToolEngine` so equipped item tags are one shared loadout authority for practical capability and gathering prerequisites.
- Gathering automatically recognizes equipped tool tags while still allowing explicit contextual tool tags as a bounded adapter.
- Representative settlement shops stock the new tools and gear as real normalized equipment purchases.
- Newly authored original equipment defaults to no active-discipline restriction; concrete loadout/capability/level/possession requirements are preferred. Older starter `allowedJobs` fields remain bounded compatibility debt rather than a pattern for new content.
- Shop-facing names/descriptions use original-world vocabulary while stable legacy-shaped POI IDs remain internal compatibility seams.

This is **systems breadth, not mass item completion**. Durability/repair, ammunition depth, enchantment charge use, and large equipment progression tables can grow incrementally when their gameplay loops require them.

## 0.6.600 — Gathering, hunting, processing, crafting, cooking, and salvage — next

Recommended bounded unit:

- turn current atomic gathering/recovery substrate into timed, proficiency-bearing work;
- establish processing/process definitions that transform provenance-bearing raw resources into components/ingredients;
- implement representative crafting and cooking actions through canonical tasks, tools, workstations, capability/proficiency, and resource sinks;
- add salvage/recycling seams so finished goods can return material value without magical duplication;
- preserve locality/exploration context, canonical fictional time, equipment-tool composition, regional content ownership, and resource provenance;
- prove a small cross-linked source -> process -> finished-use/sink loop before broad recipe authoring;
- validate/version/benchmark/document at a coherent `0.6.600` boundary.

## Following 0.6 tracks

| Track | Theme |
| --- | --- |
| `0.6.700` | Ecology and regional creature/resource content breadth |
| `0.6.800` | Persistent companion/party foundation |
| `0.6.900` | Integrated-mechanics exit gate |

Do not mass-generate content before mechanics and validation contracts for the relevant domain are stable.

---

# Later phases

## 0.7 — Multi-region playable alpha

Build enough connected settlements, regions, NPC populations, economies, quests/contracts, relationships, transport, and authored content for a sustained sandbox campaign rather than isolated substrate demonstrations.

## 0.8 — Life and infrastructure expansion

Deepen property, home/infrastructure, workshops, agriculture, logistics, social life, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand advanced regions/dungeons, difficult encounters, rare systems, high-level production/economies, UI/accessibility, migration hardening, balance, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
