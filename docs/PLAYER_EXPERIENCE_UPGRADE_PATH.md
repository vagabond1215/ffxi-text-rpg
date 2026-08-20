# Player Experience Upgrade Path

This document records the player-facing progression proof for **Hearth & Horizon**. Historical checkpoint detail remains in git and `docs/ROADMAP.md`; exact current work and deferred sequencing live in `docs/THREAD_HANDOFF.md` and `docs/EXECUTION_PIPELINE.md`.

## Player promise

A normal player should be able to answer from ordinary browser play:

1. Who am I and what was I trained to do?
2. Why am I here and who can I trust first?
3. What can I do next without command expertise?
4. How does effort create persistent progress?
5. Why should I leave town, and why should I return?
6. What do I know, carry, and have prepared?
7. Who is traveling with me?
8. Why improve a home or foothold?
9. How should I prepare for travel constraints?
10. When are people actually available?
11. What happens when a companion is too hurt to continue?
12. What can I cultivate or steward over several days, and why does it matter?
13. When have I earned the ability to spend less attention on a solved routine?
14. Who in the community changes because of the life I am building?

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No convenience layer may create a duplicate clock, inventory, progression counter, economy, cargo wallet, social clock, cultivation clock, or reward path that bypasses canonical authority/provenance.

## Completed foundation

Phase 0.7 established original-world onboarding, first-day opportunities, field tools, regional livelihood/production, named-NPC continuity, acquired-knowledge readability, danger/combat/recovery, multiple commitments, semantic transport, settlement services, semantic information access and persistent companions.

Phase 0.8 is now complete:

| Track | Player-facing proof | Status |
| --- | --- | --- |
| `0.8.100` | Regional materials + fictional labor create durable home storage | Complete |
| `0.8.200` | Home investment creates reusable workshop capability | Complete |
| `0.8.300` | Carried inventory creates transport-capacity decisions | Complete |
| `0.8.400` | Project labor/materials earn portable field capacity | Complete |
| `0.8.500` | Named-person availability depends on fictional time | Complete |
| `0.8.600` | Injured companions convalesce safely and rejoin explicitly | Complete |
| `0.8.700` | Multi-day Sweetroot cultivation connects home, work, provenance and existing sinks | Complete |
| `0.8.800` | Paid tending delegation reduces attention only after manual mastery | Complete |
| `0.8.900` | Home-grown produce creates scheduled named community consequences | Complete |

## Cultivation & Stewardship

The bounded player proof is deliberately small and connected:

```text
one home Sweetroot bed
  -> prepare with hands-on labor
  -> plant one physical Elderwood Sweetroot
  -> wait through canonical fictional time
  -> tend after the first fictional day
  -> harvest after the second fictional day
  -> receive ordinary Sweetroots with cultivated provenance
  -> use them through existing consumption, production and trade paths
  -> cultivation mastery shortens later manual work
```

### What the player understands

The Journal/context model tells the player when the bed needs preparation, when a physical propagation root is required, when the crop is growing, when tending is due, when harvest is ready, and when accumulated mastery has shortened later hands-on work.

The normal path does **not** expose raw plot IDs, internal timestamps, provenance objects or command vocabulary.

### Why the loop matters

The proof reuses `item-elderwood-sweetroot` instead of adding a farm-only duplicate. Cultivated Sweetroot remains compatible with existing consume, production and trade sinks. Provenance distinguishes home-grown and wild histories without fragmenting item identity.

### Time and attention

Growth is not a wall-clock timer and does not allocate one long-lived timed task per crop. Planting persists fictional-time boundaries; world time advances through the existing simulation and crop status derives from those timestamps.

Only moments when the character personally prepares or tends the bed create short normal work tasks. Those tasks use the existing work lifecycle and release after their consequence is durable.

### Persistence and replay safety

Game State 13 made cultivation durable authority. Save/load preserves mid-growth and tended state. Harvest is exactly once; the propagation root's provenance survives growth and is retained in harvested provenance.

### Mastery

Cultivation uses existing persistent work proficiency through stable id `cultivation`. There is no farming level, crop XP or parallel mastery system.

## Earned Routine Delegation

After one manually completed cultivation cycle, the player can pay **12 gil** to arrange the next tending visit.

```text
manual routine proven
  -> pay real wage
  -> bounded tending appointment persists
  -> canonical fictional time reaches the visit boundary
  -> crop is tended exactly once
  -> player remains free for other activity
  -> helper labor grants no player mastery
  -> harvest proceeds through ordinary cultivation authority
```

This is the first concrete proof of the product law that solved chores may demand less attention only after efficiency/automation is earned.

The feature adds no helper clock, background producer, generic automation framework, free output or seventh direct timed-task owner. Game State 14 exists because a paid pending appointment is durable player-costly state that cannot be reconstructed safely after save/load.

## Household & Community Continuity

The foothold now creates social consequences through three existing named locality people:

- **Mira Fen** — Thornwall Southgate, available 06:00–11:00;
- **Mae Oris** — Brasshaven Market Ring, available 11:00–17:00;
- **Kiri Fen** — Mistmere Canal Ward, available 16:00–21:00.

Each has a commitment that requires an Elderwood Sweetroot whose provenance includes `plot-home-sweetroot-bed`. Wild-foraged Sweetroot does not satisfy the same request merely because it shares the item ID.

Resolution and later-day follow-up use existing commitment, relationship, wallet, inventory, schedule, semantic-event and save/load authorities. The Journal uses direct semantic intents:

```text
commitment.accept
commitment.resolve
commitment.followUp
```

No social clock, household XP or second quest framework exists.

## Phase 0.8 exit proof

The completed player-facing arc is:

```text
home/storage/workshop
  -> cultivation/stewardship
  -> recurring manual productive routine
  -> mastery and earned reduction in repetitive attention
  -> home-grown provenance
  -> named scheduled community consequences
  -> preparation, services, travel and adventure remain ordinary competing choices
```

The phase closed only after the complete suite, Benchmark 3, Benchmark Sample, Content Census and long-session Hardening were green. See `docs/PHASE_0_8_EXIT_GATE.md`.

## Content-scale implication

The current mechanics-scale census is **NOT READY**. Places/localities already exceed the mechanics floor, while abilities/techniques, recipes/processes, NPCs, items, companions, quests/contracts, ecology/resources/creatures, service sites and transport services remain below their planning floors.

The largest relative gap is abilities/techniques. This means the next product challenge is authored breadth and connected content throughput, not another generic state-coherence pass.

Do not answer the census by adding disconnected filler. New content should arrive as dense regional graphs that give the player additional reasons to prepare, travel, work, fight, trade, return home and remember people.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunities, cultivation guidance and social opportunity decoration are projections/adapters over canonical state.

World time, cultivation state, work/tasks, inventory, provenance, production, commitments, relationships, party/recovery, home infrastructure and work mastery remain in their declared domain authorities.

## Next decision boundary

Phase 0.9 is planned but **not opened**. Proposed first unit: `0.9.100 — Content Scale Gate A`.

A future thread should read `docs/THREAD_HANDOFF.md` and `docs/EXECUTION_PIPELINE.md`, refresh `main`, and wait for explicit authorization before opening Phase 0.9 implementation or changing repository governance.
