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

This remains pre-alpha product development. Milestone numbers describe active contracts, not completion percentages. Phase 0.7 implementation is in progress, but the runtime product number remains at the last completed milestone until the bounded `0.7.100` campaign-slice track actually closes.

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
- learned capabilities/proficiencies belong to the character; disciplines are training/context rather than universal use gates;
- settlements, roads, wilderness, livelihoods, relationships, logistics, danger, combat, and recovery share one persistent world;
- maps and campaign guidance represent acquired knowledge and do not expose authored coordinates, hidden extent, remote source records, or unreachable route actions;
- safe settlements use named localities/actions while terrain-sensitive spaces may use fine exploration navigation;
- resources and rewards preserve physical/economic/social provenance and exactly-once ownership;
- companions are persistent NPC-backed world participants, not summons;
- commitments and general NPC relationships are canonical gameplay state; the Journal is a derived presentation surface;
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

| Track | Contract | Status |
| --- | --- | --- |
| `0.5.100` | Deterministic fictional world clock | Complete |
| `0.5.200` | Pause/speed and scheduler adapter | Complete |
| `0.5.300` | Canonical timed tasks | Complete |
| `0.5.400` | Deterministic interrupt model | Complete |
| `0.5.500` | Day boundaries/review | Complete |
| `0.5.550` | Original-world identity migration | Complete |
| `0.5.600` | Projects/resource provenance | Complete |
| `0.5.650` | Ecology/gathering/population substrate | Complete |
| `0.5.700` | Routes/scheduled transport | Complete |
| `0.5.800` | Regional content packs/scalable validation | Complete |
| `0.5.900` | Simulation/content-substrate exit gate | Complete |

Phase 0.5 closed with deterministic long activities/interrupts/day review, original-world IDs, projects/provenance, ecology/gathering/population substrate, scheduled transport, and scalable regional content-pack validation.

---

# 0.6 — Integrated Character and Mechanics Content — complete

| Track | Contract | Resulting product/data | Status |
| --- | --- | --- | --- |
| `0.6.100` | Continuous-character stats/progression | `0.6.100.1` / Data 19 | Complete |
| `0.6.200` | Skills/proficiencies/disciplines/capabilities | `0.6.200.1` / Data 20 | Complete |
| `0.6.250` | Semantic DOM player-interface architecture | `0.6.250.1` / Data 20 | Complete |
| `0.6.300` | Original magic and active ability engine | `0.6.300.1` / Data 21 | Complete |
| `0.6.400` | Combat 2.0 timing/action/interruption contract | `0.6.400.2` / Data 22 | Complete |
| `0.6.450` | Locality and exploration navigation | `0.6.450.1` / Data 22 | Complete |
| `0.6.500` | Equipment and field-tool breadth | `0.6.500.1` / Data 23 | Complete |
| `0.6.600` | Gathering/hunting/processing/crafting/cooking/salvage | `0.6.600.1` / Data 24 | Complete |
| `0.6.700` | Ecology/regional creature/resource content breadth | `0.6.700.1` / Data 25 | Complete |
| `0.6.800` | Persistent companion/party foundation | `0.6.800.1` / Data 26 | Complete |
| `0.6.900` | Integrated-mechanics exit gate | `0.6.900.1` / Data 26 | Complete |

Resulting Phase 0.6 baseline: **Product `0.6.900.1` / Package `0.6.900` / Account Save 4 / Game State 5 / Data 26 / Benchmark 1**.

The phase established character-owned progression/capabilities/work mastery, semantic browser UI, original executable abilities, Combat 2.0 on canonical fictional time, locality/exploration navigation, real equipment/tools, provenance-bearing gathering/production, regional ecology/resource breadth, persistent NPC-backed companions, and the executable `integratedMechanicsGate`.

The completed runtime checkpoint passed **453/453 tests** plus Benchmark 1/build/deploy. Historical detailed version decisions remain in `docs/VERSIONING_AND_RELEASE_ROADMAP.md` and implementation-specific architecture documents.

---

# 0.7 — Multi-region playable alpha — in progress

Phase 0.7 is not another architecture reset. It turns the proven Phase 0.6 systems into sustained play across a coherent authored world.

The player-facing sequence and acceptance checks are authoritative in `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`.

## Phase 0.7 entry contract

Work may build on the Phase 0.6 gate only while preserving:

- one canonical fictional-time/task/interrupt substrate;
- continuous-character ownership of stats, learned skills/capabilities, and work mastery;
- combat, travel, work, party, ecology, economy, social continuity, and recovery composing through existing engines rather than parallel clocks/state;
- semantic DOM/view-model/intents as the normal browser interaction direction;
- acquired-knowledge map/campaign privacy;
- provenance/source-sink/exactly-once integrity;
- explicit content-pack ownership/dependencies and cross-reference validation;
- one clean current schema, with pre-alpha reset/breakage preferred over compatibility-only complexity.

## Phase 0.7 playable-alpha exit criteria

A Phase 0.7 alpha slice is credible only when a normal player can sustain repeated multi-session play without test-only setup:

- several connected settlements/regions form a navigable campaign space with meaningful reasons, costs, and risks for travel;
- persistent named NPCs provide shops/services, commitments/quests, relationship/reputation hooks, and companion/social continuity so settlements function as communities rather than menus;
- each major playable region connects ecology/resources to work/production/trade sinks and also provides adventure/social reasons to visit;
- combat, abilities, party, work, travel, scheduled transport, day review, and recovery can occur in one campaign without violating fictional-time or exactly-once ownership contracts;
- ordinary campaign actions are reachable through semantic browser UI rather than requiring command-line knowledge;
- current-version saves resume without duplicate rewards, contacts, or progress;
- world/content-pack/source-sink/database validation remains green as authored content scales;
- authored breadth supports alternative short-term goals and repeated routes/activities rather than one linear systems demonstration.

## 0.7.100 — Playable campaign slice — in progress

The current proving corridor is **Brasshaven -> Redstone Reach -> Brasshaven -> Mistmere -> Starfen**, assembled from existing locality, travel/transport, ecology, work/production, social-continuity, danger/combat/recovery, and semantic UI authorities.

Implemented player-experience layers:

- **PX-1 — arrival and footing:** all three origins provide origin-specific arrival, a real first contact, semantic first action, persistent-progress explanation, and believable morning start;
- **PX-2 — first-day opportunities:** the Journal surfaces real livelihood, training/danger, exploration/travel, and service/preparation paths plus real starter-tool claim/equip actions;
- **PX-3 — first regional loop:** Brasshaven guides preparation, Redstone travel, timed copper gathering, return, forge/workstation context, copper-ingot processing, persistent work mastery, and the larger Copper Trail Clasp ambition;
- **PX-4 — several-day continuity:** `Copper for the Ring` is canonical commitment state tied to persistent Marshal Varric Stone relationship state. Provenance-qualified delivery resolves exactly once, changes the NPC relationship, appears in structured day review, survives real account save/load, and exposes a changed next-day follow-up that competes with another valid use of time;
- **PX-5 — multi-region campaign readability:** a derived campaign-readability layer groups only acquired-known opportunities by region/readiness, records why they are knowable, and exposes only genuinely reachable semantic actions. The Varric follow-up creates a Starfen material horizon without revealing the remote Tall Reedbed before arrival; real fare/tool blockers remain visible and authoritative;
- **PX-6 — danger, combat, and recovery:** the existing Redstone Burrower now competes with the copper livelihood goal in ordinary play. Encounter, basic Attack, abilities, and Wait are reachable semantically; Combat 2.0 remains canonical. Victory EXP/currency resolve exactly once while physical body material remains a tool/proficiency/time-gated resource opportunity. Field/safe-locality/defeat recovery use canonical timed tasks, and defeat costs two fictional hours, retreats to known safety, and restores only part of combat resources before the same Journal campaign resumes.

PX-4 through PX-6 audits strengthened shared authority rather than adding parallel campaign state:

- same-ID inventory stacks with different provenance histories remain distinct;
- commitment delivery consumes only qualifying provenance-bearing stacks;
- commitment/relationship state and commitment definitions are top-level validated authority;
- campaign readability and combat aftermath remain pure derived projections with no persisted Journal/campaign registry;
- explicit current-context region metadata wins over fallback origin inference, preventing Redstone aftermath from being grouped as Brasshaven;
- scheduled transport remains authoritative for fare/cadence/cargo/departure/arrival behavior;
- battle progression rewards remain exactly once while physical creature material uses canonical resource-opportunity ownership and provenance;
- defeated-body work and bodily/party recovery now complete through the same fictional-time activity seam as other ordinary work/travel actions.

Authoritative PX-6 runtime checkpoint:

```text
e30bc607faf0e56b784aca54e1f830c0c48fe274
480/480 tests
Benchmark 1 success
Data 28
```

Benchmark 1 remains comparable; PX-6 changed neither the protocol nor the route-lookup algorithm. The runtime checkpoint measured approximately 0.459 ms/op player profile creation, 0.099 ms/op enemy profile creation, 0.506 ms/op basic attacks, 0.0045 ms/op tick dispatch, and 0.791 ms/op direct-route lookup.

`0.7.100` remains open. The next bounded unit is **PX-7 — repeated multi-region/community breadth**. The strongest current continuity is still Brasshaven-centered; a second real community/regional slice should prove another named contact/social reason, livelihood/service reason, danger/adventure reason, and later consequence—preferably using existing Mistmere/Starfen authority—before generalizing commitment/readability patterns.

Do **not** mass-generate content, introduce replacement quest/economy/dialogue/encounter frameworks, or declare `0.7.100` complete because its systems now compose. Closure requires enough alternative repeated goals and community breadth for sustained ordinary play.

---

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, home/infrastructure, workshops, agriculture, logistics, social life, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand advanced regions/dungeons, difficult encounters, rare systems, high-level production/economies, UI/accessibility, migration hardening, balance, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.