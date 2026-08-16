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

The current proving corridor is **Brasshaven -> Redstone Reach -> Brasshaven -> Mistmere -> Starfen**, assembled from existing locality, travel/transport, ecology, work/production, social-continuity, and semantic UI authorities.

Implemented player-experience layers:

- **PX-1 — arrival and footing:** all three origins provide origin-specific arrival, a real first contact, semantic first action, persistent-progress explanation, and believable morning start;
- **PX-2 — first-day opportunities:** the Journal surfaces real livelihood, training/danger, exploration/travel, and service/preparation paths plus real starter-tool claim/equip actions;
- **PX-3 — first regional loop:** Brasshaven guides preparation, Redstone travel, timed copper gathering, return, forge/workstation context, copper-ingot processing, persistent work mastery, and the larger Copper Trail Clasp ambition;
- **PX-4 — several-day continuity:** `Copper for the Ring` is canonical commitment state tied to persistent Marshal Varric Stone relationship state. Provenance-qualified delivery resolves exactly once, changes the NPC relationship, appears in structured day review, survives real account save/load, and exposes a changed next-day follow-up that competes with another valid use of time;
- **PX-5 — multi-region campaign readability:** a derived campaign-readability layer groups known opportunities by region/readiness, records why they are knowable, and exposes only genuinely reachable semantic actions. The Varric follow-up creates a Starfen material horizon without revealing the remote Tall Reedbed before arrival. The real Iron Quay -> Mistmere caravan remains blocked at 36 gil against its 52-gil fare and becomes a semantic `transport.start` action only when canonical funds are sufficient. From Mistmere, the real Starfen route becomes actionable, and the local cutting-tool requirement appears only after arrival.

PX-4/PX-5 audits strengthened shared authority rather than adding parallel campaign state:

- same-ID inventory stacks with different provenance histories remain distinct;
- commitment delivery consumes only qualifying provenance-bearing stacks;
- commitment/relationship state and commitment definitions are top-level validated authority;
- `playerCampaignReadabilityEngine` is a pure derived projection with no persisted campaign-readability registry;
- scheduled transport remains authoritative for fare/cadence/cargo/departure/arrival behavior;
- the semantic Journal now renders actual regional/continuity groups with readiness counts instead of a flat card list.

Authoritative PX-5 runtime checkpoint:

```text
cc78f3a5b72c4c793ad8f7f3e1a2f83b001aa9d6
476/476 tests
Benchmark 1 success
Data 28
```

`0.7.100` remains open. The next bounded unit is **PX-6 — danger, combat, and recovery in the ordinary campaign**. It should reuse current regional encounter/ecology data, Combat 2.0, companions, battle rewards, resource-recovery opportunities, settlement recovery/services, canonical fictional time, and semantic UI to prove that danger has real consequences and returns the player to the same persistent campaign.

After PX-6, audit whether `0.7.100` has enough multi-region/community breadth for closure or whether one further bounded breadth/content unit is justified. Do **not** mass-generate content, introduce a replacement quest/economy/dialogue/encounter framework, or turn the Journal into an omniscient global quest database.

---

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, home/infrastructure, workshops, agriculture, logistics, social life, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand advanced regions/dungeons, difficult encounters, rare systems, high-level production/economies, UI/accessibility, migration hardening, balance, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
