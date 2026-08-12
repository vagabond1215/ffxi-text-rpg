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
Product:      0.5.900.1
Package:      0.5.900
Account Save: 4
Game State:   5
Data:         19
Benchmark:    1
Codename:     Simulation Substrate Gate
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
- settlements, roads, wilderness, livelihoods, relationships, logistics, danger, and combat share one persistent world;
- maps represent acquired knowledge;
- resources and rewards have physical/economic/social provenance;
- mechanics and representative content grow together;
- regional content is authored as a validated cross-linked graph;
- legacy FFXI-derived material is research/reference/migration material only.

## Phase summary

| Phase | Theme | Status / exit promise |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete.** Architecture can evolve without another broad reset. |
| `0.5` | Simulation + original-world/content substrate | **Complete.** Time, interrupts, provenance, ecology, transport, projects, regional packs, and scalable validation exist. |
| `0.6` | Integrated character/mechanics content | **Next.** Character progression, capabilities, magic, combat, items, gathering/crafting, ecology, and companions become a substantial connected layer. |
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

- [x] `contentPackSchema.js` defines stable pack IDs, shared/regional ownership, dependencies, data version, explicit content collections, and bounded legacy adapters.
- [x] Stable-ID ownership conflicts are detected across packs without replacing human-meaningful canonical IDs with opaque generated identifiers.
- [x] `contentPackValidator.js` cross-checks places, routes/services, ecology, gathering sources, items/provenance/sinks, NPCs, shops, recipes, quests, and relationships through one validation surface.
- [x] The validator catches duplicate ownership, dangling references, invalid route/service topology, invalid source/sink contracts, undeclared cross-pack dependencies, and legacy identifiers leaking into canonical packs without an explicit adapter.
- [x] `legacyCandidateNormalizer.js` converts historical/reference inputs only into review-required candidates; normalization never makes imported material canonical.
- [x] Representative shared, Elderwood, and Starfen packs prove shared ownership, regional ownership, and intentional cross-region dependencies.
- [x] Representative pack-defined NPC/shop/recipe/quest/relationship records prove that social/economic content can join the same dependency graph.
- [x] Generated tests validate a 600-record fixture (300 items + 300 recipes) before broad content generation begins.

### 0.5.800 bounded limitations

- Representative pack manifests currently claim several established runtime records through `catalogRef`; the existing catalogs have not been physically relocated into pack files wholesale.
- Pack-defined recipe/quest/relationship records prove data contracts, not complete player-facing crafting/quest/relationship engines.
- Hundreds-record validation is exercised with generated fixtures; canonical hand-authored content breadth remains intentionally sparse.
- Legacy/reference candidates still require human/originality review before any canonical adoption.

## 0.5.900 — Simulation/content-substrate exit gate — complete

Product baseline: **0.5.900.1 / Package 0.5.900 / Game State 5 / Data 19**.

`simulationSubstrateGate.js` now evaluates seven structured readiness groups:

- [x] deterministic simulation — world time, simulation control, timed tasks, interrupts, day cycle, semantic events;
- [x] original-world identity — Game State v5 identity generation and canonical world-identity subsystem;
- [x] projects and provenance — projects, provenance, resource opportunities, timed recovery;
- [x] ecology and gathering — valid ecology catalogs plus representative family/species/population/source breadth across flora/mineral/fishing;
- [x] routes and transport — valid route/service catalogs plus deterministic scheduled departure checks;
- [x] regional content and scale — valid multi-pack graph, stable ownership, cross-pack dependency, content-pack validation, candidate normalization;
- [x] persistence compatibility — Account Save v4, Game State v5, Data >=19, ordered migration compatibility contract.

The production gate is green. Injection tests also prove that invalid catalogs and planned/missing substrate dependencies produce structured gate diagnostics rather than silently reporting readiness.

### 0.5 exit decision

The phase closes because long fictional activities can advance deterministically and interrupt/summarize; original-world IDs are established; projects and provenance exist; ecology/gathering/population definitions can populate the world; scheduled transport connects setting anchors; and regional content packs/validators can support high-volume original content without turning parsing success into canonical truth.

Deliberate compatibility debt remains non-blocking: `gil`, historical localStorage keys, legacy-shaped POI hook IDs, transitional internal job/race/nation property names, `places.js` route fallbacks, encounter `spawnRules`, and explicitly historical research/reference modules.

---

# 0.6 — Integrated Character and Mechanics Content — next

## 0.6.100 — Character stats and progression — next

First bounded unit:

- [ ] Audit current player stat/progression ownership and identify where historical FFXI formula tables still directly shape canonical runtime behavior.
- [ ] Define an original-world character-stat contract owned by the continuous character, with explicit base/derived/resource fields and provenance/confidence for transitional formulas.
- [ ] Keep discipline training/progression descriptive and contextual rather than turning `mainJobId` into a universal capability gate.
- [ ] Establish migration-safe adapters around existing `player.jobs`, `mainJobId`, `raceId`, and related persisted/internal fields instead of a broad save rewrite.
- [ ] Separate character-owned progression state from active-discipline modifiers/caps where the substrate still conflates them.
- [ ] Add representative progression/stat tests across multiple ancestries and disciplines using canonical IDs and original-world vocabulary.
- [ ] Preserve historical formula research only behind explicit reference/comparison boundaries.
- [ ] Stop at a coherent 0.6.100 contract before opening the broader capability system.

## Later planned 0.6 tracks

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
