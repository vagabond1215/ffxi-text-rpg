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
Product:      0.5.650.1
Package:      0.5.650
Account Save: 4
Game State:   5
Data:         17
Codename:     Ecology Substrate
```

This remains pre-alpha product development. Milestone numbers describe the active contract; they are not completion percentages.

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
- settlements, roads, wilderness, livelihoods, relationships, logistics, danger, and combat share one persistent world;
- maps represent acquired knowledge;
- resources and rewards have physical/economic/social provenance;
- mechanics and representative content grow together;
- legacy FFXI-derived material is research/reference/migration material only.

## Phase summary

| Phase | Theme | Exit promise |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | Architecture can evolve without another broad reset. |
| `0.5` | Simulation + original-world/content substrate | Time, interrupts, provenance, ecology, transport, projects, and scalable content validation exist. |
| `0.6` | Integrated character/mechanics content | Character progression, capabilities, magic, combat, items, gathering/crafting, ecology, and companions form a substantial connected layer. |
| `0.7` | Multi-region playable alpha | Multiple settlements/regions, transport, NPC populations, quests, relationships, economies, and authored content support a real sandbox campaign. |
| `0.8` | Life and infrastructure expansion | Property, production, agriculture, logistics, relationships, and earned automation deepen long-form play. |
| `0.9` | Adventure depth and release hardening | Advanced content, balance, UI, persistence, and performance reach release-candidate quality. |
| `1.0` | Live foundation | The central persistent-life/adventure promise is coherent, stable, migratable, and release-ready. |

---

# 0.4 — Foundation — complete

Delivered development direction/versioning, ordered persistence migrations, structured `ActionResult`, bounded semantic events, and architecture stabilization.

---

# 0.5 — Simulation and Content Substrate — active

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

Deliberate compatibility debt that does not block the gate remains: `gil`, historical localStorage keys, legacy-shaped POI hook IDs, migration aliases/tests, and explicitly historical research modules.

## 0.5.600 — Resource provenance and persistent projects — complete

Implemented persistent projects, source/sink metadata, provenance-aware post-combat resource opportunities, deterministic timed recovery actions, and physical-resource recovery through normal inventory rules.

## 0.5.650 — Ecology, gathering, and spawn substrate — complete

Implemented on `main` at product `0.5.650.1`.

- [x] Canonical creature-family and species records are separate from encounter instances.
- [x] Seed encounter templates carry canonical `speciesId` references where they represent world species.
- [x] Habitat/population records include place/biome, capacity, density, rarity, aggression/senses/social behavior, linking-family hooks, and deterministic respawn rules.
- [x] Representative ecology spans forest beasts/raiders, upland burrowers, cave bats, wetland plantoids/raiders, and a rare forest hart rather than one toy family.
- [x] Flora/mineral/fishing gathering-source records reference canonical raw-resource item outputs and provenance actions.
- [x] Representative source types include forage/gather/log/mine/fish contracts with tool/proficiency hooks.
- [x] Persistent ecology depletion state regenerates or respawns from canonical `worldTime.totalSeconds`, not wall-clock time.
- [x] Harvest inventory insertion is atomic: a storage failure does not silently consume source capacity.
- [x] Rare population appearance can use deterministic day/time conditions.
- [x] Named-variant hooks use explicit world conditions/flags rather than arbitrary random appearance rolls.
- [x] Ecology catalog validation cross-checks family/species/population/place/source/action/item references and verifies source provenance on output items.
- [x] Data contract advanced to 17; Game State remains 5 because ecology state is additive/lazily initializable.

### 0.5.650 bounded limitations

- Existing `places.js` spawn-rule arrays remain the transitional encounter-placement layer. Population records now exist as the intended ecology authority, but encounter selection has not yet been rewritten to consume them directly.
- Environmental harvesting is currently a shared engine/API substrate rather than a broad command/UI workflow.
- Representative resource items prove source/sink/provenance contracts but are intentionally not a large canonical item catalog.
- Population capacity currently models deterministic available units; richer migration, predation, weather, reproduction, territory, and season interactions remain later ecology depth.
- The standalone ecology cross-reference validator is exercised by tests. Hundreds/thousands-scale regional validation belongs to `0.5.800`.
- Do not begin hundreds-scale ecology/resource generation merely because the substrate exists.

## 0.5.700 — Travel and scheduled transport substrate — next

First bounded unit:

- [ ] Canonical route records separated from incidental place-transition UI.
- [ ] Timed walking/local/overland travel based on canonical world time and the existing task/interrupt substrate.
- [ ] Road/route records that can carry distance/time, hazards, cargo/encumbrance hooks, and knowledge/discovery metadata.
- [ ] Scheduled caravan records with stable stops, departure cadence, fare, cargo allowance, travel time, and deterministic arrival.
- [ ] Shared transport contract suitable for later ferries, wagons, mounts, and other modes without duplicating scheduling logic.
- [ ] Interrupt hooks for meaningful en-route events without requiring real-world waiting.
- [ ] Representative route validation across multiple regions/stops before broad transport generation.

Keep this unit substrate-focused. Do not mass-author transport networks until route/schedule contracts and validators are coherent.

## 0.5.800 — Regional content packs, normalization, and validation

- [ ] Regional content-pack contract across places/routes/NPCs/shops/ecology/resources/items/recipes/quests/relationships/transport.
- [ ] Legacy/reference ingestion produces reviewable candidate records, never direct canonical imports.
- [ ] Cross-reference validation for IDs, sources/sinks, spawns, recipes, shops, quests/rewards, routes, maps, and companions.
- [ ] Workflow proven at hundreds/thousands-of-record scale.

## 0.5.900 — Simulation/content-substrate exit gate

0.5 closes when:

- long fictional activities safely fast-forward, interrupt, and summarize;
- original-world naming/stable IDs are established;
- persistent projects and resource provenance exist;
- ecology/gathering/spawn definitions can populate the world;
- scheduled transport connects multiple settlements/regions;
- regional content packs and validators support high-volume original content generation.

---

# 0.6 — Integrated Character and Mechanics Content

Planned tracks:

- `0.6.100` character stats and progression;
- `0.6.200` skills, proficiencies, disciplines, and capabilities;
- `0.6.300` original magic and active ability engine;
- `0.6.400` Combat 2.0;
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
