# Roadmap

This is the authoritative implementation summary and phase index for **Hearth & Horizon**, an original text-first persistent fantasy life RPG.

Authoritative companions:

- `docs/DEVELOPMENT_DIRECTION.md` — design north star.
- `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md` — naming, provenance, scale, and legacy/reference policy.
- `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — product/schema version protocol and release gates.
- `docs/ARCHITECTURE.md` — current runtime/module boundaries.
- `docs/THREAD_HANDOFF.md` — latest implementation handoff.
- `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md` — Phase 0.7 player-facing sequencing and acceptance checks.

## Current baseline

```text
Product:      0.6.900.1
Package:      0.6.900
Account Save: 4
Game State:   5
Data:         29
Benchmark:    1
Codename:     Integrated Mechanics Gate
```

Phase 0.7 is in progress. The product number remains at the last completed milestone until the bounded `0.7.100` playable-campaign track actually closes.

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

Campaign guidance and maps reflect acquired knowledge. Resources preserve provenance. Commitments/relationships are canonical gameplay state; Journal/readability are projections. Companions are persistent NPC-backed people. Legacy FFXI-derived material remains research/reference only.

## Phase summary

| Phase | Theme | Status |
| --- | --- | --- |
| `0.4` | Foundation and direction lock | **Complete** |
| `0.5` | Simulation + original-world/content substrate | **Complete** |
| `0.6` | Integrated character/mechanics content | **Complete** |
| `0.7` | Multi-region playable alpha | **In progress** |
| `0.8` | Life and infrastructure expansion | Planned |
| `0.9` | Adventure depth and release hardening | Planned |
| `1.0` | Live foundation | Planned |

## Completed phase history

### 0.4 — Foundation

Direction/version protocol, ordered persistence migrations, structured action results/events, and architecture stabilization.

### 0.5 — Simulation and content substrate

Deterministic fictional time, scheduler/pause, timed tasks, interrupts, day review, original-world identity, projects/provenance, ecology/gathering/populations, routes/scheduled transport, content packs, and scalable validation.

### 0.6 — Integrated character and mechanics

| Track | Contract | Result |
| --- | --- | --- |
| `0.6.100` | Continuous-character stats/progression | Data 19 |
| `0.6.200` | Skills/proficiencies/disciplines/capabilities | Data 20 |
| `0.6.250` | Semantic DOM player interface | Data 20 |
| `0.6.300` | Original magic/active ability engine | Data 21 |
| `0.6.400` | Combat 2.0 | Data 22 |
| `0.6.450` | Locality/exploration navigation | Data 22 |
| `0.6.500` | Equipment/field-tool breadth | Data 23 |
| `0.6.600` | Gathering/production/crafting breadth | Data 24 |
| `0.6.700` | Regional ecology/resource breadth | Data 25 |
| `0.6.800` | Persistent companion/party foundation | Data 26 |
| `0.6.900` | Integrated-mechanics exit gate | Product `0.6.900.1` / Data 26 |

The closed Phase 0.6 gate passed 453/453 tests plus Benchmark 1 and deployment.

# 0.7 — Multi-region playable alpha — in progress

Phase 0.7 turns the proven systems into sustained ordinary play; it is not another architecture reset.

## Exit criteria

A normal player must be able to sustain repeated multi-session play across several connected settlements/regions without test-only setup or command expertise. The campaign must combine:

- persistent NPC communities and relationships;
- shops/services and meaningful economy/transport;
- commitments/social consequences;
- livelihood/resources/production;
- adventure/combat/recovery;
- companions where relevant;
- several competing short-term goals;
- semantic browser actions;
- current-version save/load without duplicate rewards/progress;
- acquired-knowledge privacy and provenance/source-sink validation.

## `0.7.100` — Playable campaign slice — in progress

Current proving geography spans **Brasshaven / Redstone Reach / Mistmere / Starfen**, with all three origins providing first-session footing and Thornwall/Elderwood still serving as the remaining third-origin continuity gap.

### Completed player-experience slices

- **PX-1 — Arrival and footing:** origin-specific opening, first contact, believable morning start, semantic first action.
- **PX-2 — First-day opportunities:** real preparation, livelihood, training, exploration, and service choices plus starter-tool claim/equip.
- **PX-3 — First regional loop:** Brasshaven -> Redstone copper gathering -> return -> forge production -> larger ambition.
- **PX-4 — Several-day continuity:** Varric commitment/relationship, provenance-qualified delivery, exactly-once reward, later-day follow-up, real save/load.
- **PX-5 — Multi-region readability:** acquired-knowledge regional grouping/readiness and honest route/fare/tool blockers.
- **PX-6 — Danger/combat/recovery:** ordinary Redstone combat, body recovery, timed bodily recovery/defeat consequence, return to the same campaign.
- **Player-language hygiene:** Journal no longer displays internal engineering rationale; details are collapsible; Day Review is memory-style; player prose avoids implementation jargon.
- **PX-7 — Second community breadth:** Reader Soli Venn / `Marrowleaf for the Ward` creates a second persistent multi-day community loop in Mistmere/Starfen while ordinary Reed Fiber livelihood and Starfen Rootling danger remain competing choices.

### PX-7 reusable authority proved

- commitment definitions can require provenance-qualified raw gathered resources or transformed goods;
- Reader Soli Venn is a persistent NPC-backed contact;
- `playerContinuityEngine` projects all **actually known** commitment definitions instead of containing a Varric-only branch;
- field gathering and return guidance call existing gathering/locality/travel authorities rather than replacing them;
- delivery and later follow-up remain exactly once across real save/load;
- commitment data privacy remains contact-gated;
- Data advances to 29; Account Save 4 / Game State 5 remain valid.

Authoritative PX-7 runtime checkpoint:

```text
0411083b07bc4063fe4810fcb225e1dffd2895a4
483/483 tests
Benchmark 1 success
Data 29
```

Benchmark 1 remains comparable:

```text
player profile      0.468655ms/op
enemy profile       0.110203ms/op
basic attack        0.553072ms/op
tick dispatch       0.004862ms/op
direct route lookup 0.876750ms/op
```

## Why `0.7.100` remains open

PX-7 proves the community/continuity pattern is reusable, but two strong proving loops are not yet enough to claim sustained sandbox breadth.

Concrete remaining gaps:

- Thornwall/Elderwood lacks equivalent multi-day persistent community continuity;
- alternative social/economic goals remain thin after the two proving commitments are exhausted;
- executable settlement-service economy remains shallow;
- companion/social breadth remains intentionally small;
- Craft and some information surfaces remain less direct than the Journal/Scene path;
- the exit gate still needs a multi-session breadth audit after a third-origin/community slice.

## Next bounded unit — PX-8 sustained sandbox breadth / third-origin continuity

Prefer **Thornwall/Elderwood**. Prove a third community loop using the already-generic known-commitment projection and existing work/combat/travel authorities. Add only the smallest new authored/runtime pieces the real slice demonstrates.

At the PX-8 checkpoint, explicitly re-audit `0.7.100` against ordinary multi-session play. Do not mass-generate content or introduce a global quest/reputation/dialogue framework merely to fill breadth.

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, workshops, agriculture, logistics, home/infrastructure, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
