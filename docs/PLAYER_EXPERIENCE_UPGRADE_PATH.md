# Player Experience Upgrade Path

This document records the player-facing progression proof for Hearth & Horizon. Historical checkpoint detail remains in git and `docs/ROADMAP.md`; exact current work and deferred sequencing live in `docs/THREAD_HANDOFF.md` and `docs/EXECUTION_PIPELINE.md`.

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

Phase 0.8 landed tracks:

| Track | Player-facing proof | Status |
| --- | --- | --- |
| `0.8.100` | Regional materials + fictional labor create durable home storage | Complete |
| `0.8.200` | Home investment creates reusable workshop capability | Complete |
| `0.8.300` | Carried inventory creates transport-capacity decisions | Complete |
| `0.8.400` | Project labor/materials earn portable field capacity | Complete |
| `0.8.500` | Named-person availability depends on fictional time | Complete |
| `0.8.600` | Injured companions convalesce safely and rejoin explicitly | Complete |

## `0.8.700` — Cultivation & Stewardship

**Status: implemented and validated on draft PR #378; pending merge authorization.**

The bounded player proof is deliberately small and connected:

```text
one home Sweetroot bed
  -> prepare with hands-on labor
  -> plant one physical Elderwood Sweetroot
  -> wait through canonical fictional time
  -> tend after the first fictional day
  -> harvest after the second fictional day
  -> receive three ordinary Sweetroots with cultivated provenance
  -> use them through existing consumption, cooking and trade paths
  -> cultivation mastery shortens later preparation/tending
```

### What the player understands

The Journal/context model can tell the player:

- the bed needs preparation;
- one physical Sweetroot is required to propagate it;
- the crop is growing;
- tending is due;
- the crop is ready to harvest;
- the next hands-on work duration reflects accumulated cultivation proficiency.

The normal path does **not** expose raw plot IDs, internal timestamps, provenance objects or command vocabulary.

### Why the loop matters

The first proof reuses `item-elderwood-sweetroot` rather than adding a duplicate farm-only item. Harvested Sweetroot retains existing sinks:

```text
consume          -> food/medicine material context
craftIngredient  -> existing Silverfin Sweetroot Stew production chain
trade            -> existing shop-sale economy
```

Cultivation therefore turns prior field access into a repeatable home supply without bypassing the rest of the game.

### Time and attention

Growth is not a real-time timer and does not allocate one long-lived timed task per crop. Planting persists fictional-time boundaries. World time advances through the existing simulation; crop status derives from those timestamps.

Only the moments when the character is personally preparing or tending the bed create short normal work tasks. Those tasks use the existing activity/work lifecycle and release after their consequence is durable.

### Persistence and replay safety

Game State 13 makes cultivation durable authority. The end-to-end proof saves and reloads mid-growth and after tending, then harvests once. A second harvest attempt is rejected without duplicating output.

The propagation root's provenance is preserved during growth and nested into the cultivated harvest provenance, so the game does not forget where the new crop originated.

### Mastery

Cultivation uses the existing persistent work-proficiency model via stable id `cultivation`. Practice improves future hands-on duration; there is no separate farming level, crop XP or parallel mastery system.

### Exact validation

```text
Head:   c125f7ae5f94800893dc28c7fa0ceb61553e3db8
PR:     #378 draft/open/unmerged
Check:  32340190710
Tests:  695/695
Node:   24.19.0
Benchmark 3 + sample: success
```

## `0.8.800` — Earned Routine Delegation

**Status: READY NEXT only after #378 lands; not started.**

The strongest next player proof is now concrete: after manually establishing a Sweetroot routine, can the character earn a bounded way to spend less attention on one cultivation chore without free output or a second clock?

```text
manual cultivation routine
  -> mastery / infrastructure / social access
  -> one bounded helper or hired-labor option
  -> wages/material/time constraints remain
  -> cultivation remains domain consequence authority
  -> less repetitive player attention
```

Do not start with generic automation.

## `0.8.900` — Household & Community Continuity

**Status: queued.**

Make the foothold socially consequential through additional recurring named characters, livelihood/property-linked commitments/services, several-day consequences, and companion breadth where justified. No full romance framework yet.

## Phase 0.8 exit proof

```text
home/storage/workshop
  -> cultivation/stewardship
  -> recurring productive routine
  -> earned reduction in repetitive attention
  -> named community consequences
  -> preparation for travel/adventure
```

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunities, cultivation guidance and social opportunity decoration are projections/adapters over canonical state.

World time, cultivation state, work/tasks, inventory, provenance, production, commitments, relationships, party/recovery, home infrastructure and work mastery remain in their declared domain authorities.

If PR #378 remains unmerged, a replacement thread should resolve its state before starting `0.8.800`; do not repeat broad cultivation discovery unless repository authority materially changed.
