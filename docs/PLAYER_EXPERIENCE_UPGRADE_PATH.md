# Player Experience Upgrade Path

This document records the player-facing progression proof for Hearth & Horizon. Historical implementation/checkpoint detail remains in git and `docs/ROADMAP.md`; this file stays focused on what a normal player should be able to understand and accomplish next.

For exact current work order and deferred sequencing, read `docs/THREAD_HANDOFF.md` and `docs/EXECUTION_PIPELINE.md` first.

## Player promise

A normal player should be able to answer from ordinary browser play:

1. **Who am I and what was I trained to do?**
2. **Why am I here and who can I trust first?**
3. **What can I do next without command expertise?**
4. **How does effort create persistent progress?**
5. **Why should I leave town, and why should I return?**
6. **What do I know, carry, and have prepared?**
7. **Who is traveling with me?**
8. **Why improve a home or foothold?**
9. **How should I prepare for travel constraints?**
10. **When are people actually available?**
11. **What happens when a companion is too hurt to continue?**
12. **What can I cultivate or steward over several days, and why does it matter to the rest of my life?**
13. **When have I earned the ability to spend less attention on a solved routine?**
14. **Who in the community changes because of the life I am building?**

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, construction currency, property timer, workstation registry, crafting engine, cargo wallet, social clock, romance meter, companion recovery clock, cultivation clock, or reward path that bypasses provenance/authority.

## Pre-alpha rule

Target the clean current model. Old local-save compatibility is not a design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

Ordinary character-facing information tells the player what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state channels, hidden topology, and implementation rationale stay outside normal play.

# Completed player-experience foundation

Phase 0.7 is complete. Its player proof established:

- distinct original-world origin footing and first contacts;
- first-day opportunities without command expertise;
- real field tools and preparation;
- regional livelihood/production loops;
- several-day named-NPC continuity;
- acquired-knowledge campaign readability;
- danger, combat, recovery, and provenance-aware body/resource recovery;
- multiple community/commitment loops;
- semantic scheduled transport;
- settlement work/trade/recovery;
- semantic information access;
- persistent companion preparation and travel.

Phase 0.8 completed tracks currently prove:

| Track | Player-facing proof | Status |
| --- | --- | --- |
| `0.8.100` | Regional materials + fictional labor create durable home storage | Complete |
| `0.8.200` | Home investment creates reusable production/workshop capability | Complete |
| `0.8.300` | Real carried inventory creates transport-capacity decisions | Complete |
| `0.8.400` | Project labor and materials earn portable field capacity | Complete |
| `0.8.500` | Named-person availability depends on canonical fictional time | Complete |
| `0.8.600` | Injured companions can convalesce safely and rejoin explicitly | Complete |

The persistence/hardening revisions through Product `.52` do not add another player-facing life track; they protect the authorities those loops depend on.

# Current player-experience boundary

The August 19, 2026 audit and C0 continuation pass completed the previously required fresh candidate selection. The next bounded player-facing track is no longer unselected.

## `0.8.700` — Cultivation & Stewardship — READY NEXT

Player-facing question:

> Can the character invest in a home/foothold cultivation activity that unfolds over fictional days, requires meaningful preparation/care, and returns useful provenance-bearing goods into the same economy and life systems already in play?

Smallest useful proof:

```text
access a cultivation plot
  -> prepare the plot
  -> plant a physical/provenance-bearing input
  -> canonical fictional time advances
  -> condition/tending creates a real decision
  -> harvest exactly once
  -> goods enter ordinary inventory with provenance
  -> goods support at least three existing sinks/systems
  -> practice improves persistent efficiency
```

The player should understand:

- what is growing;
- when it will be ready or needs attention;
- what preparation/tool/input is missing;
- why tending or ignoring it changes the outcome;
- where the result can be used;
- what mastery made easier compared with earlier work.

### Authority constraints

Cultivation should compose existing systems instead of creating a farming minigame with duplicate infrastructure:

- **world time** owns elapsed fictional time;
- **inventory** owns seeds/inputs/tools/harvested goods;
- **provenance** owns physical origin/transformation history;
- **work proficiency** should own repeated-practice efficiency where applicable;
- **home/project/infrastructure** owns durable plot/furnishing improvements where needed;
- **production/economy/commitments** provide sinks and reasons to cultivate;
- **semantic UI intents/view models** expose normal browser actions.

Do not add passive real-world/offline growth. Do not automatically make every crop a new long-lived timed task; persisted crop/plot state plus canonical-world-time boundaries is preferable when it expresses the domain cleanly.

### Required end-to-end proof

Before closing the track, demonstrate:

- deterministic multi-day growth;
- at least one meaningful tending/condition choice;
- save/load while growth is in progress;
- exactly-once harvest and no duplicate completion reward;
- provenance-bearing harvested output;
- outputs with at least three real existing sinks/systems;
- persistent mastery/efficiency residue;
- ordinary browser actions without command expertise;
- content-pack/cross-reference validation;
- content census evidence when `npm run census` is actually run.

# Following Phase 0.8 player sequence

## `0.8.800` — Earned Routine Delegation — QUEUED

After cultivation or another real recurring chore has been established, prove that mastery, infrastructure, reputation, or wages can reduce player attention without removing fictional costs or creating free resources.

```text
manual routine
  -> investment/mastery
  -> bounded helper/hired-labor option
  -> wages/material/time constraints remain
  -> same authoritative consequence
  -> less repetitive player attention
```

Do not begin with a generic automation platform.

## `0.8.900` — Household & Community Continuity — QUEUED

Make the foothold socially consequential:

- 2–3 additional recurring named social characters with distinct needs/schedules;
- at least one additional companion candidate when justified by regional content;
- livelihood/property-linked commitments or services;
- several-day return consequences;
- no full romance framework yet.

## Phase 0.8 exit proof — QUEUED

The life/infrastructure phase should close only when a normal player can experience this connected arc:

```text
home/storage/workshop
  -> cultivation/stewardship
  -> recurring productive routine
  -> earned reduction in repetitive attention
  -> named community consequences
  -> preparation for travel/adventure
```

# Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunities, onboarding helpers, cultivation guidance, and social opportunity decoration are projections/adapters over canonical state.

Projects, commitments, relationships, NPC schedules/fictional time, party state, campaign recovery, transport journeys, inventory/container state, provenance, production, workstations, resource opportunities, wallet ownership, furnishings, storage capacity, carried load, work mastery, and future cultivation domain state remain in their declared domain authorities.

Use `docs/EXECUTION_PIPELINE.md` for the later 0.9 progression envelope and deferred runs. Roadmap order does not authorize automatically starting `0.8.800`, `0.8.900`, or Phase 0.9 work during the bounded `0.8.700` pass.
