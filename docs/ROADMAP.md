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
- `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` — Phase 0.7 player-facing sequencing and acceptance checks.

## Current baseline

```text
Product:      0.6.900.1
Package:      0.6.900
Account Save: 4
Game State:   5
Data:         28
Benchmark:    1
Codename:     Integrated Mechanics Gate
```

This remains pre-alpha product development. Milestone numbers describe active contracts, not completion percentages. Phase 0.7 implementation is in progress, but the runtime product number remains at the last completed milestone until a bounded 0.7 track is closed.

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
| `0.6` | Integrated character/mechanics content | **Complete.** Continuous-character progression, semantic UI, active abilities, Combat 2.0, navigation, equipment/tools, provenance-bearing work/production, regional ecology breadth, persistent companions, and an executable cross-system exit gate are established. |
| `0.7` | Multi-region playable alpha | **In progress.** Convert the proven systems into a sustained multi-region sandbox campaign with enough NPC/social/economic/adventure content and ordinary UI flow to play rather than merely demonstrate systems. |
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

# 0.6 — Integrated Character and Mechanics Content — complete

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
- Original authored equipment uses concrete possession/loadout/capability semantics rather than active-discipline identity as a universal gate. Legacy explicit `allowedJobs` input remains supported only as a compatibility seam.

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

## 0.6.800 — Persistent companion/party foundation — complete

Resulting baseline: **0.6.800.1 / Package 0.6.800 / Account Save 4 / Game State 5 / Data 26**.

- Added original versioned companion definitions with backing NPC identity, recruitment locations/requirements, tactical role/policy, and relationship dimensions.
- Added additive/lazy persistent `state.party` with recruited-companion records, active membership, capacity, resources/statuses, relationship state, location continuity, and validation.
- A companion remains one persistent NPC promoted into character-like party state; backing NPC identity/location is synchronized or reconstructible for older Game State 5 saves.
- Recruitment, joining, and leaving emit structured semantic events and are blocked during active combat.
- Combat uses explicit ally/enemy sides; active companions participate through the existing Combat 2.0 action history and synchronize resources/statuses back to persistent party state.
- Active companions follow exploration exits, locality crossings, and canonical route/scheduled-transport arrivals.
- The game view model exposes semantic party state and a direct `party.recruit` UI intent.

Bounded limitations: current companion breadth/tactics/dialogue/progression remain intentionally small; the foundation proves identity, persistence, combat participation, travel continuity, and semantic UI authority rather than final companion depth.

## 0.6.900 — Integrated-mechanics exit gate — complete

Resulting baseline: **0.6.900.1 / Package 0.6.900 / Account Save 4 / Game State 5 / Data 26 / Benchmark 1**.

`js/text/systems/integratedMechanicsGate.js` is an executable Phase 0.6 gate rather than a documentation-only checklist. It groups and validates:

- persistence and additive Game State 5 normalization;
- fictional-time/task/interrupt ownership;
- continuous-character stat/skill/capability/work-proficiency ownership;
- combat/party/work/travel coexistence;
- resource provenance, recovery, ecology, and production continuity;
- semantic event/view-model/UI-intent authority;
- world, route, ecology, production, companion, and content-pack validators;
- required Phase 0.6 subsystem/database readiness and the final product/data contract.

The audit repaired concrete integration seams before closing the phase:

- canonical starter equipment no longer carries active-discipline `allowedJobs` hard gates; explicit legacy eligibility remains accepted only at compatibility/test/migration boundaries;
- the legacy `companion` command/POI adapter now delegates canonical recruitment to `partyEngine`, including exactly-once recruitment event/state behavior;
- the unrelated Thornwall guide that duplicated Mara Venn's display identity is now **Sera Talwin** while its stable compatibility POI ID remains intact;
- exported legacy POI description helpers no longer reveal internal authored coordinates/source-position labels.

Focused gate tests prove that all major additive Phase 0.6 runtime registries can be removed from a Game State 5 fixture and lazily reconstructed without changing the save version. The complete runtime checkpoint passes **453/453 tests** plus benchmark/build/deploy.

Phase 0.6 is therefore closed without an Account Save, Game State, Data, or Benchmark bump beyond the already-established `4 / 5 / 26 / 1` contracts.

---

# 0.7 — Multi-region playable alpha — in progress

Phase 0.7 is not another architecture reset. It turns the proven Phase 0.6 systems into sustained play across a coherent authored world.

The player-facing sequencing for this phase is defined in `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`.

## Phase 0.7 entry contract

Work may build on the Phase 0.6 gate only while preserving these authorities:

- canonical fictional time/tasks/interrupts remain the common activity clock;
- continuous-character stats, skills, capabilities, and work proficiencies remain character-owned;
- combat, travel, work, party, ecology, economy, and social content compose through existing engines rather than parallel domain clocks/state;
- semantic DOM/view-model/intents remain the primary player-interface direction; command adapters are optional power/diagnostic surfaces;
- maps remain acquired knowledge and internal coordinates remain non-player-facing;
- provenance and source/sink validation remain mandatory for physical/economic/social rewards;
- content-pack ownership/dependencies and cross-reference validation remain canonical scale controls;
- compatibility mode is `pre-release-current-schema`: prefer one clean current model and intentional schema/version changes over compatibility-only lazy state or adapter complexity.

## Phase 0.7 playable-alpha exit criteria

A Phase 0.7 alpha slice is credible only when a normal player can sustain repeated multi-session play without test-only setup:

- several connected settlements/regions form a navigable campaign space with meaningful reasons, costs, and risks for travel;
- persistent named NPCs provide enough shops/services, contracts/quests, relationship/reputation hooks, and companion/social continuity to make settlements function as communities rather than menus;
- each major playable region connects ecology/resources to work/production/trade sinks and also provides adventure/social reasons to visit;
- combat, abilities, party, work, travel, scheduled transport, day review, and recovery can occur in one campaign without violating fictional-time or exactly-once ownership contracts;
- ordinary gameplay actions needed for the campaign slice are reachable through semantic browser UI rather than requiring command-line knowledge;
- current-version saves can resume the campaign slice without duplicate rewards, contacts, or progress; historical pre-alpha migrations are not an exit requirement;
- world/content-pack/source-sink/database validation remains green as authored content scales;
- authored breadth is sufficient for alternative short-term goals and repeated routes/activities, rather than one linear systems demonstration.

## 0.7.100 — Playable campaign slice — in progress

The first Phase 0.7 unit assembles one end-to-end campaign slice from existing systems before broad content multiplication. The current proving corridor is Brasshaven -> Redstone Reach -> Brasshaven, with Starfen already visible as the next material horizon through the Copper Trail Clasp recipe and Varric's follow-up.

Implemented player-experience layers now include:

- **PX-1 — arrival and footing:** all three origins provide an origin-specific arrival, clear first local contact, semantic first action, persistent-progress explanation, and believable morning start;
- **PX-2 — first-day opportunities:** a dedicated Journal/opportunity model surfaces real livelihood, training/danger, exploration/travel, and service/preparation paths plus real starter-tool claim/equip actions;
- **PX-3 — first regional loop:** Brasshaven guides the player through preparation, Redstone travel, timed copper gathering, semantic activity completion, return, forge/workstation context, copper-ingot processing, persistent work mastery, and a larger Copper Trail Clasp ambition;
- **PX-4 — several-day continuity:** `Copper for the Ring` is canonical commitment state tied to persistent Marshal Varric Stone relationship state. Provenance-qualified delivery resolves exactly once, changes the NPC relationship, appears in structured day review, survives the real account save/load path, and exposes a changed next-day follow-up that competes with another valid use of character time.

PX-4's audit also strengthened shared authority: same-ID inventory stacks with different provenance histories remain distinct; commitment delivery consumes only qualifying provenance-bearing stacks; commitment/relationship state and the commitment catalog are now part of top-level validation.

`0.7.100` remains open. The next bounded unit is **PX-5 — multi-region campaign readability**: rank/group only acquired-known opportunities by region and readiness using discovered places/routes/POIs/maps, contacts/relationships/commitments, equipment/materials/mastery, and real reachability. Unknown content must remain unknown, and direct semantic actions should remain available only when genuinely reachable.

Before `0.7.100` can close, the ordinary campaign flow must also compose meaningful danger/combat/recovery with the livelihood/travel/commitment continuity already proven, and the playable corridor must have enough multi-region/community breadth to sustain repeated play rather than one guided proof.

Do **not** mass-generate hundreds of records, introduce a replacement quest/economy/dialogue framework, or turn the Journal into an omniscient global quest database. Generalize only when additional real slices prove the reusable shape.

---

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, home/infrastructure, workshops, agriculture, logistics, social life, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand advanced regions/dungeons, difficult encounters, rare systems, high-level production/economies, UI/accessibility, migration hardening, balance, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
