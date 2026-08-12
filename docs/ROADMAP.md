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
Product:      0.5.700.1
Package:      0.5.700
Account Save: 4
Game State:   5
Data:         18
Codename:     Routes and Transport
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

Implemented canonical family/species records, place-bound populations, flora/mineral/fishing sources, persistent depletion/regeneration, deterministic rare/named hooks, and ecology cross-reference validation. Existing `places.js` spawn rules remain a bounded transitional encounter-placement seam.

## 0.5.700 — Travel and scheduled transport substrate — complete

Implemented on `main` at product `0.5.700.1`.

- [x] Canonical route records are separate from incidental place-transition/exit UI.
- [x] Stable route-stop IDs, route directionality, fictional duration, distance, hazards, transport-mode compatibility, cargo/encumbrance metadata, and map/knowledge hooks.
- [x] Walking/local route travel uses canonical timed tasks and `worldTime.totalSeconds` rather than an independent travel clock.
- [x] Existing place connections remain a transitional fallback where canonical route coverage is not yet authored.
- [x] Scheduled transport services use stable route/stops, deterministic cadence, boarding lead, fare, cargo allowance, fictional journey duration, and deterministic arrival.
- [x] Shared service contract supports caravan and ferry examples and is shaped for later wagon/coach/mount modes without separate schedule engines.
- [x] Travel state distinguishes waiting and in-transit phases and stores route/service/task/world-time boundaries.
- [x] Travel/task cancellation is coupled so stopping a journey does not leave a hidden active timed task.
- [x] Structured route/service start, booking, departure, arrival, and cancellation events are emitted independently of display prose.
- [x] Departure/arrival interrupt providers integrate scheduled movement with advance-until-event behavior.
- [x] Route/service catalog validation checks modes, stops, places, maps, segment structure, cadence, fares, and cargo fields.
- [x] Representative routes/services span Thornwall/Elderwood, Brasshaven/Redstone Reach, Mistmere/Starfen, two interregional caravan corridors, and a wetland ferry case.
- [x] Data contract advanced to 18; Game State remains 5 because no new required top-level persistence registry is introduced and legacy active travel is normalized at the runtime boundary.

### 0.5.700 bounded limitations

- Scheduled transport is currently an engine/API substrate rather than a broad command/UI booking workflow.
- Cancelling scheduled service does not yet implement fare-refund policy.
- Schedule records use periodic cadence; calendars, service days, stop dwell, weather suspension, tickets/reservations, and vehicle/NPC actors are later depth.
- En-route hazards are structured metadata/interrupt hooks; encounter/event resolution along routes is not yet a full travel-event system.
- Route knowledge exists as metadata/discovery hooks but is not a universal hard eligibility gate.
- Current route/service records are representative substrate data, not balanced final geography or a mass-authored network.
- `gil` remains the intentional transitional fare currency until a deliberate original currency design is selected.

## 0.5.800 — Regional content packs, normalization, and validation — next

First bounded unit:

- [ ] Define a regional content-pack manifest/schema with stable pack IDs, region ownership, data-contract version, and explicit record collections/references.
- [ ] Establish pack-scoped stable-ID ownership and duplicate/conflict detection across packs without changing canonical IDs into opaque generated identifiers.
- [ ] Cross-reference places, routes/stops/services, ecology/populations/sources, items/source-sink metadata, shops/NPCs, and representative recipe/quest/relationship placeholders through one validator surface.
- [ ] Reject missing/duplicate IDs, dangling references, invalid source/sink graphs, invalid routes/stops, and legacy identifiers leaking into canonical packs without an explicit adapter.
- [ ] Define legacy/reference normalization as a candidate-record pipeline requiring review/originalization; never import historical material directly into canonical packs.
- [ ] Prove at least two regional packs plus shared/common data and cross-region references.
- [ ] Add generated/fixture scale tests at hundreds-of-record breadth so lookup, duplicate detection, and validation behavior are tested before mass content authoring.

Keep this first unit infrastructure-focused. Do not jump directly to hundreds of hand-authored creatures/items/recipes before the pack contract and validator are coherent.

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
