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
Data:         30
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

A normal player must be able to sustain repeated multi-session play across several connected settlements/regions without test-only setup or command expertise. The campaign must combine persistent NPC communities/relationships, shops/services and meaningful economy/transport, commitments/social consequences, livelihood/resources/production, adventure/combat/recovery, companions where relevant, competing goals, semantic browser actions, deterministic save/load, acquired-knowledge privacy, and provenance/source-sink integrity.

## `0.7.100` — Playable campaign slice — in progress

The proving geography now spans **Thornwall / Elderwood / Brasshaven / Redstone Reach / Mistmere / Starfen** with persistent several-day community continuity at all three origins.

### Completed player-experience slices

- **PX-1 — Arrival and footing:** origin-specific opening, first contact, believable morning start, semantic first action.
- **PX-2 — First-day opportunities:** real preparation, livelihood, training, exploration, and service choices plus starter-tool claim/equip.
- **PX-3 — First regional loop:** Brasshaven -> Redstone copper gathering -> return -> forge production -> larger ambition.
- **PX-4 — Several-day continuity:** Varric commitment/relationship, provenance-qualified delivery, exactly-once reward, later-day follow-up, real save/load.
- **PX-5 — Multi-region readability:** acquired-knowledge regional grouping/readiness and honest route/fare/tool blockers.
- **PX-6 — Danger/combat/recovery:** ordinary Redstone combat, body recovery, timed bodily recovery/defeat consequence, return to the same campaign.
- **Player-language hygiene:** Journal no longer displays internal engineering rationale; details are collapsible; Day Review is memory-style; ordinary prose avoids implementation jargon.
- **PX-7 — Second community breadth:** Reader Soli Venn / `Marrowleaf for the Ward` establishes Mistmere/Starfen several-day continuity while Reed Fiber livelihood and Rootling danger remain independent.
- **PX-8 — Third-origin continuity:** Sera Talwin / `Sweetroot for Southgate` establishes Thornwall/Elderwood several-day continuity while Amber Resin livelihood and Brush Hare danger remain independent.

### PX-8 authority/result

Sera Talwin is now a persistent NPC-backed contact. `Sweetroot for Southgate` requests two provenance-qualified West Elderwood Sweetroots, pays 20 gil plus familiarity/respect exactly once, survives real account save/load, and produces changed later-day follow-up. Sweetroot already had food/medicine/trade sinks, so PX-8 adds no quest-token resource.

The generic PX-7 continuity projection handles the entire third-origin flow without an origin-specific engine branch. `COMMITMENT_CATALOG_VERSION` remains 2. Data advances to **30** for the new persistent NPC/commitment authored content; Account Save 4 and Game State 5 remain valid.

Authoritative PX-8 runtime checkpoint:

```text
63a234edfc1e327d90823c4171bdf315f01aa044
484/484 tests
Benchmark 1 success
Data 30
```

Benchmark 1 remains comparable:

```text
player profile      0.400261ms/op
enemy profile       0.104237ms/op
basic attack        0.509356ms/op
tick dispatch       0.005014ms/op
direct route lookup 0.796968ms/op
```

## `0.7.100` closure audit after PX-8

**Still open.** The third-community breadth requirement is now substantially proven, but the audit exposed one concrete ordinary-player access defect rather than a need for more authored communities.

The canonical route graph already connects the campaign:

```text
Thornwall Rivergate
  -> Timbercross Landing
  -> Brasshaven Iron Quay
  -> Mistmere Reedport
  -> West Starfen
```

Scheduled transport authority already owns the Crown–Forge and Forge–Mere services, fares, cadence, cargo, departures, arrivals, fictional time, and party travel. `domApp` can dispatch semantic `transport.start`.

The remaining defect is presentation/discovery: generic locality **Travel Desk** interaction still reports that travel-service behavior is not implemented. PX-5 exposes a Forge–Mere booking only through the specific Copper Trail readability proof. Therefore a normal player cannot yet rotate freely among the three proven communities using generic semantic browser transport without command/API knowledge.

That fails the explicit `0.7.100` exit promise even though the underlying route graph is connected.

## Next bounded unit — PX-9 cross-community rotation / `0.7.100` gate

Do not add a fourth community first. Repair the transport access seam:

1. derive scheduled services/destinations available from the current real route stop;
2. show fare, departure/readiness, and blockers through Travel Desk/context UI;
3. dispatch existing semantic `transport.start`;
4. prove ordinary Thornwall -> Brasshaven -> Mistmere rotation, including canonical locality legs and scheduled transport;
5. preserve acquired-knowledge privacy, fare/cargo/time/party/save-load behavior;
6. immediately re-run the complete `0.7.100` closure audit.

Craft UI depth, paid service economy, and broader companion content remain later improvements, but they are not substitutes for this specific closure blocker.

# Later phases

## 0.8 — Life and infrastructure expansion

Deepen property, workshops, agriculture, logistics, home/infrastructure, relationships, companions, and earned automation.

## 0.9 — Adventure depth and release hardening

Expand difficult regions/dungeons, advanced combat/abilities, rare systems, high-level economy/production, UI/accessibility, balance, persistence policy, performance, and release tooling.

## 1.0 — Live foundation

Release when the continuous-character persistent-life/adventure promise is coherent, original, stable, migratable, performant, and supported by enough interconnected content to sustain real play.
