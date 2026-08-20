# System Catalog

This catalog describes the current Hearth & Horizon runtime/proposed feature state. Historical detail remains in git and roadmap documents.

## Status legend

| Status | Meaning |
| --- | --- |
| `planned` | Known requirement, no canonical runtime implementation. |
| `seeded` | Canonical schema or bounded content exists, but player-facing breadth is limited. |
| `integrated` | Runtime consumes the authority across real system paths. |
| `playable` | A player can exercise a meaningful end-to-end loop. |
| `scaled` | Representative larger-volume/content validation exists. |
| `balanced` | Tuned through sustained gameplay/accepted performance evidence. |

No system is marked `balanced` merely because tests are green.

## Draft 0.8.700 baseline

```text
Product:       0.8.700.1
Package:       0.8.700
Account Save:  5
Game State:    13
Data:          38
Benchmark:     3
Codename:      Cultivation & Stewardship
Runtime:       Node >=24
```

Draft PR #378 is open/unmerged. Exact frozen implementation head `c125f7ae5f94800893dc28c7fa0ceb61553e3db8` passed Check `32340190710`: **695/695 tests**, Benchmark 3 success, Benchmark Sample success.

## Core simulation, persistence, and tooling

| System | Status | Notes |
| --- | --- | --- |
| Canonical fictional world time | playable | One deterministic second count drives all elapsed gameplay time. |
| Simulation control / interrupts | playable | Pause/speed and deterministic advance-to-event behavior. |
| Timed tasks | playable | Shared substrate for bounded active work; owner-managed release. |
| Day cycle/review | playable | Structured end-of-day summaries. |
| Persistent projects | playable | Materials + labor + exactly-once completion. |
| Semantic events | integrated | Persisted typed observation history with world-time context. |
| ActionResult contract | integrated | Canonical structured result contract. |
| Current-schema persistence | playable | Account Save 5 / proposed Game State 13. |
| Raw current-state gate | integrated | Required authority validates before revival/normalization. |
| Cultivation persistence | integrated | Required plot/crop state validates before normalization. |
| NPC world projection | integrated projection | Rebuilt from canonical seeds + party authority. |
| Enemy encounter projection | integrated projection | Rebuilt from canonical templates; mutable encounter state lives in `activeBattle`. |
| Command presentation log | integrated transient | Session-only, omitted/reset across character load. |
| Content-scale census | integrated tooling | Criteria-driven breadth signal, not CI threshold. |
| Benchmark harness | integrated | Benchmark 3 + repeatable sample. |
| Long-session lifecycle harness | integrated | Deterministic save/load and retained-resource checks. |
| Hosted CI | integrated | Node 24, Test + Benchmark + Benchmark Sample. |

## World, travel, and knowledge

| System | Status | Notes |
| --- | --- | --- |
| Original-world identity | integrated | Hearth & Horizon canon is authoritative. |
| Places/routes/maps | playable | Three anchor regions with connected travel. |
| Safe-locality navigation | playable | Named destinations where fine topology is not the decision. |
| Wilderness exploration | playable | Discovery-relative movement/minimap. |
| Acquired map knowledge | playable | Presentation reveals acquired knowledge only. |
| Direct travel | playable | Route authority + fictional time. |
| Scheduled transport | playable | Deterministic departures/fares/cargo limits. |
| Regional content-pack validation | integrated | Stable ownership/cross-reference/legacy-boundary checks. |
| High-volume regional content | seeded | Architecture supports more breadth than currently authored. |

## Character, progression, abilities, and equipment

| System | Status | Notes |
| --- | --- | --- |
| Continuous player entity | playable | Identity/resources/equipment/progression persist as one person. |
| Disciplines | playable | Contextual training identities. |
| Character-owned skills/capabilities | playable | Persist independently of active discipline. |
| Character stats/progression | playable | Deterministic base/lifetime growth. |
| Work proficiency | playable | Persistent repeated-practice efficiency, now including `cultivation`. |
| Ability/spell engine | playable | Learned abilities, timing, costs, cooldowns, interruption. |
| Equipment/tool context | playable | Gear/tools provide practical capability context. |
| Root combat/stat caches | integrated projection | Omitted from saves and rebuilt after raw validation. |
| Equipment/item breadth | seeded | Representative original catalog; broad economy future. |
| Training/mentor/certification depth | planned | Expand when access decisions justify it. |

## Combat, danger, recovery, and companions

| System | Status | Notes |
| --- | --- | --- |
| Combat 2.0 | playable | Deterministic action/readiness/resource model. |
| Timed abilities/status timing | playable | Shared canonical time/interrupt substrate. |
| Active-battle persistence | integrated | Encounter state and deterministic snapshots survive save/load; RNG transient. |
| Battle/root player coherence | integrated | Active battle remains bound to root player authority. |
| Campaign recovery | playable | Field, defeat, safe-settlement recovery under one authority. |
| Persistent companions | playable | NPC-backed recruitment/travel/combat continuity. |
| Companion convalescence | playable | Injured inactive companions recover safely and rejoin explicitly. |
| Companion/social breadth | seeded | Deeper authored life breadth remains future. |

## Inventory, provenance, economy, and logistics

| System | Status | Notes |
| --- | --- | --- |
| Inventory containers/transfers | playable | Capacity/access/stacking/portable/home rules. |
| Carried load | playable | Derived from canonical portable inventory. |
| Shops/buy/sell | playable | Wallet/inventory transactions with restrictions. |
| Resource provenance | playable | Physical/economic/social/exceptional source history. |
| Resource opportunities/recovery | playable | World/body resources recover into inventory through real work. |
| Regional economy depth | seeded | Real goods/sinks exist; broad stock/price simulation future. |

## Ecology, gathering, work, production, and cultivation

| System | Status | Notes |
| --- | --- | --- |
| Ecology families/species/populations | playable | Deterministic habitat/population hooks. |
| Gathering sources | playable | Place/tool/time conditions, capacity, provenance output. |
| Hunting/body recovery | playable | Defeat feeds material recovery/production. |
| Production processes | playable | Processing/crafting/cooking/salvage with provenance/mastery. |
| Workstations | playable | Locality/home context under one authority. |
| Cultivation & Stewardship | **playable on PR #378** | Home Sweetroot bed; timestamp-derived growth, short work-task tending, exactly-once harvest. |
| Cultivation crop scheduler | intentionally absent | Growth owns no background/timed-task resource. |
| Cultivation mastery | playable | Existing work-proficiency authority reduces future hands-on duration. |
| Regional production breadth | seeded | Representative connected graph; sustained breadth future. |
| Quality/HQ depth | planned | Add only when it creates real decisions. |

## NPCs, commitments, relationships, and information

| System | Status | Notes |
| --- | --- | --- |
| NPC seed definitions | integrated | Canonical baseline identity/services/location. |
| Runtime NPC projection | integrated projection | Rebuilt after raw validation. |
| NPC recurring schedules | playable | Derived from canonical fictional time. |
| Commitments | playable | Accept/resolve/follow-up/one-time reward state. |
| Relationships | playable | Persistent named-NPC continuity. |
| Journal/opportunity projection | playable | Decision-first guidance over canonical state. |
| Cultivation Journal projection | playable on PR #378 | Direct semantic prepare/plant/tend/harvest actions. |
| Player information/services | playable | Carried/known/visited/actionable information. |
| Top-level command history | integrated transient | Diagnostics only; not durable semantic history. |
| Broad branching narrative | seeded | Large quest breadth remains future. |
| Romance/deep social life | planned | Requires authored candidates/goals/boundaries. |

## Home, livelihood, and infrastructure

| System | Status | Notes |
| --- | --- | --- |
| Home storage foothold | playable | Regional materials + project labor -> durable capacity. |
| Home workshop | playable | Reusable home production context. |
| Portable field logistics | playable | Earned Field Satchel. |
| Home cultivation bed | playable on PR #378 | Reusable Sweetroot stewardship loop tied to home place. |
| Broader property/building depth | seeded | More acquisition/renovation breadth future. |
| Earned routine delegation | planned / ready next | Preferred next proof after 0.8.700 lands. |
| Household/community continuity | planned | Queued after delegation. |
| Stewardship/husbandry breadth | planned | Add only when care/resources/transport decisions justify it. |
| Warehouses/large logistics | planned | Stress current systems before expanding. |

## Game State 13 cultivation contract

`state.cultivation` is required persisted authority on PR #378. It owns plot phase/cycle/harvest count, active cultivation-work link, growth timestamps, and seed provenance. Crop readiness derives from canonical world time; growth itself has no timed task.

Planting consumes one existing `item-elderwood-sweetroot`. Harvest produces three of the same canonical item with home-cultivation provenance while preserving existing consume/craft/trade sinks.

## Current decision boundary

PR #378 is validated but **not landed**. Do not start `0.8.800` by default while it remains unresolved. After explicit landing, the recommended next bounded track is Earned Routine Delegation, preferably proving one paid/earned delegation seam over the now-established cultivation routine without free resources or a second clock.
