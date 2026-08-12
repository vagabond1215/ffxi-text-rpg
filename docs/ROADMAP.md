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
Product:      0.5.550.2
Package:      0.5.550
Account Save: 4
Game State:   5
Data:         15
Codename:     Original World Identity
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

- [x] Development direction and version protocol.
- [x] Four-part product version and package-version separation.
- [x] Ordered persistence migrations.
- [x] Structured `ActionResult` contract.
- [x] Bounded semantic-event foundation.
- [x] Foundation stabilization and architecture exit gate.

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

Implemented on `main` at product `0.5.550.2`.

- [x] Canonical powers: Thornwall, Brasshaven, Mistmere.
- [x] Canonical regions/places/maps under original stable IDs.
- [x] Canonical ancestries: Human, Lethari, Miri, Veyra, Korren.
- [x] Transitional discipline IDs/names migrated to original terminology.
- [x] Game State v4 -> v5 identity migration.
- [x] Data contract advanced through v15.
- [x] Canonical character-creation defaults and help vocabulary.
- [x] Canonical POI companion/route-exit/home-storage vocabulary.
- [x] Canonical runtime travel fallback and arrival terminology.
- [x] Originalized starter NPC/service/place-facing content.
- [x] Historical FFXI-derived data quarantined behind explicit legacy/reference boundaries.
- [x] CI baseline restored with tests, benchmark, and build green after migration cleanup.

### Deliberate bounded compatibility debt

These do **not** block the 0.5.550 exit gate:

- `gil` remains until an original currency design is deliberately chosen;
- historical localStorage key names remain for save compatibility;
- some legacy-shaped POI hook IDs remain until dependent catalogs/hooks migrate atomically;
- `legacyIdentity`, save migrations, `legacyRecoveredData`, and `ffxi*` research modules intentionally retain historical identifiers;
- legacy command aliases may remain at input/diagnostic boundaries while canonical help/new runtime records use original-world vocabulary.

The exit rule is therefore: **new canonical gameplay data and normal world-facing runtime state no longer depend on inherited FFXI proper nouns or stable IDs.**

## 0.5.600 — Resource provenance and persistent projects — next

First bounded implementation unit:

- [ ] Persistent project schema/state with stable IDs, materials, labor, canonical time, progress, completion, and semantic events.
- [ ] Provenance/source schema for carried goods, bodies, flora, minerals, fishing, salvage, crafting, trade, contracts, and explicit exceptional magic.
- [ ] Defeated-creature body/resource opportunities instead of automatic finished-material reward confetti where fiction does not support it.
- [ ] Search/skin/butcher/pluck/extract/salvage action substrate with tool, time, condition, and proficiency hooks.
- [ ] Item source/sink metadata foundation and validation hooks.

## 0.5.650 — Ecology, gathering, and spawn substrate

- [ ] Species/family definitions separate from encounter instances.
- [ ] Habitat/population/rarity/aggression/senses/social behavior.
- [ ] Flora/mineral/fishing/gathering-source definitions.
- [ ] Deterministic regeneration/respawn model.
- [ ] Rare/named spawn hooks.

## 0.5.700 — Travel and scheduled transport substrate

- [ ] Canonical timed walking/local routes.
- [ ] Road/route records independent of artificial player-facing loading zones.
- [ ] Scheduled caravans with stops, fare, cargo allowance, travel time, and interrupt hooks.
- [ ] Shared transport contract for ferries, wagons, mounts, and later transport modes.
- [ ] Map/route knowledge and discovery hooks.

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

Planned tracks cover:

- multiple cities/settlements and a connected exploration graph;
- caravans, ferries, mounts, freight, and regional logistics;
- hundreds-scale NPC populations and regional economies;
- systemic quests/contracts/rewards/reputation;
- persistent relationships and romance;
- distinct regional ecology/content packs;
- substantial item/recipe/spell/technique/economy breadth;
- a complete multi-city opening campaign layer.

The phase closes when the project plays as a sandbox campaign rather than a systems demonstration.

---

# 0.8 — Life and Infrastructure Expansion

Deepen property, construction, farming/gardening, husbandry/taming, workshops, logistics, labor, households, civic institutions, production chains, maintenance, and earned automation.

Earlier chores should become easier because the character earns tools, knowledge, infrastructure, labor, and relationships—not because identical actions receive arbitrary exponential costs.

---

# 0.9 — Adventure Depth and Release Hardening

Deepen advanced combat/magic, bosses/dungeons/expeditions, high-tier equipment/crafting, regional/faction arcs, long-simulation balance, UI/accessibility, migrations, performance, and thousands-of-record validation.

---

# 1.0 — Live Foundation

1.0 begins the explicit compatibility/product promise for a persistent character living across a connected original fantasy world with meaningful livelihoods, relationships, exploration, material progression, danger, home/infrastructure, and long-term ambition.
