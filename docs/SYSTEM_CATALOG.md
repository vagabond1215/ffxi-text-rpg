# System Catalog

This catalog describes the current **Hearth & Horizon** runtime and planned feature state. Historical detail remains in git, roadmap, and exit-gate documents.

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

## Current baseline

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Codename:      Household & Community Continuity
Runtime:       Node >=24
Phase:         0.8 complete
```

Frozen runtime `ca7d37c643adc4115b519148615f6120d03228df` passed hosted Check `32395768383`: **699/699 tests**, Benchmark 3 success, Benchmark Sample success. Phase-exit Check `32395959505` additionally passed Content Census and Hardening.

## Core simulation, persistence, and tooling

| System | Status | Notes |
| --- | --- | --- |
| Canonical fictional world time | playable | One deterministic second count drives elapsed gameplay time. |
| Simulation control / interrupts | playable | Pause/speed and deterministic advance-to-event behavior. |
| Timed tasks | playable | Shared substrate for bounded active work; owner-managed release. |
| Day cycle/review | playable | Structured end-of-day summaries. |
| Persistent projects | playable | Materials + labor + exactly-once completion. |
| Semantic events | integrated | Persisted typed observation history with world-time context. |
| ActionResult contract | integrated | Canonical structured result contract. |
| Current-schema persistence | playable | Account Save 5 / Game State 14. |
| Raw current-state gate | integrated | Required authority validates before revival/normalization. |
| Cultivation persistence | integrated | Required plot/crop/delegation state validates before normalization. |
| NPC world projection | integrated | Rebuilt from canonical seeds + party authority. |
| Enemy encounter projection | integrated | Rebuilt from canonical templates; mutable encounter state lives in `activeBattle`. |
| Command presentation log | integrated | Session-only, omitted/reset across character load. |
| Content-scale census | integrated | Criteria-driven breadth signal, not CI threshold. |
| Benchmark harness | integrated | Benchmark 3 + repeatable sample. |
| Long-session lifecycle harness | integrated | Deterministic save/load and retained-resource checks. |
| Hosted CI | integrated | Node 24, Test + Benchmark + Benchmark Sample. |

## World, travel, and knowledge

| System | Status | Notes |
| --- | --- | --- |
| Original-world identity | integrated | Hearth & Horizon canon is authoritative. |
| Places/routes/maps | playable | 26 current places/localities across connected regions. |
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
| Work proficiency | playable | Persistent repeated-practice efficiency, including cultivation. |
| Ability/spell engine | playable | Learned abilities, timing, costs, cooldowns, interruption. |
| Equipment/tool context | playable | Gear/tools provide practical capability context. |
| Root combat/stat caches | integrated | Omitted from saves and rebuilt after raw validation. |
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
| Companion/social breadth | seeded | Census currently counts one recruitable companion. |

## Inventory, provenance, economy, and logistics

| System | Status | Notes |
| --- | --- | --- |
| Inventory containers/transfers | playable | Capacity/access/stacking/portable/home rules. |
| Carried load | playable | Derived from canonical portable inventory. |
| Shops/buy/sell | playable | Wallet/inventory transactions with restrictions. |
| Resource provenance | playable | Physical/economic/social/exceptional source history. |
| Resource opportunities/recovery | playable | World/body resources recover into inventory through real work. |
| Scheduled transport cargo | playable | Capacity responds to actual carried load. |
| Field Satchel | playable | Earned portable capacity, not free transport storage. |
| Regional economy depth | seeded | Real goods/sinks exist; broad stock/price simulation future. |

## Ecology, gathering, work, production, and cultivation

| System | Status | Notes |
| --- | --- | --- |
| Ecology families/species/populations | playable | Deterministic habitat/population hooks. |
| Gathering sources | playable | Place/tool/time conditions, capacity, provenance output. |
| Hunting/body recovery | playable | Defeat feeds material recovery/production. |
| Production processes | playable | Processing/crafting/cooking/salvage with provenance/mastery. |
| Workstations | playable | Locality/home context under one authority. |
| Cultivation & Stewardship | playable | Home Sweetroot bed with deterministic multi-day growth and exactly-once harvest. |
| Cultivation crop scheduler | intentionally absent | Growth owns no background/timed-task resource. |
| Cultivation mastery | playable | Existing work-proficiency authority reduces later hands-on duration. |
| Earned routine delegation | playable | One paid Sweetroot tending chore after manual mastery; no second clock/task owner. |
| Regional production breadth | seeded | Census currently counts 11 recipes/processes and 50 canonical items. |
| Quality/HQ depth | planned | Add only when it creates real decisions. |

## NPCs, commitments, relationships, and information

| System | Status | Notes |
| --- | --- | --- |
| NPC seed definitions | integrated | Canonical identity/services/location; 11 runtime seed NPCs. |
| Runtime NPC projection | integrated | Rebuilt after raw validation. |
| NPC recurring schedules | playable | Derived from canonical fictional time. |
| Commitments | playable | Accept/resolve/follow-up/one-time reward state. |
| Relationships | playable | Persistent named-NPC continuity. |
| Household/community continuity | playable | Mira Fen, Mae Oris and Kiri Fen have scheduled home-produce loops. |
| Provenance-qualified social delivery | playable | Home-grown Sweetroot can be required without wild substitutes. |
| Journal/opportunity projection | playable | Decision-first guidance over canonical state. |
| Semantic commitment intents | playable | `commitment.accept`, `.resolve`, `.followUp` dispatch directly. |
| Player information/services | playable | Carried/known/visited/actionable information. |
| Top-level command history | integrated | Diagnostics only; not durable semantic history. |
| Broad branching narrative | seeded | Census currently counts 8 quests/contracts. |
| Romance/deep social life | planned | Requires authored candidates/goals/boundaries. |

## Home, livelihood, and infrastructure

| System | Status | Notes |
| --- | --- | --- |
| Home storage foothold | playable | Regional materials + project labor -> durable capacity. |
| Home workshop | playable | Reusable home production context. |
| Portable field logistics | playable | Earned Field Satchel. |
| Home cultivation bed | playable | Reusable Sweetroot stewardship loop tied to home place. |
| Earned routine delegation | playable | Paid bounded helper visit reduces attention on a solved tending chore. |
| Household/community consequences | playable | Home produce feeds named scheduled relationships. |
| Broader property/building depth | seeded | More acquisition/renovation breadth future. |
| Stewardship/husbandry breadth | planned | Add only when care/resources/transport decisions justify it. |
| Warehouses/large logistics | planned | Stress current systems before expanding. |

## Game State 14 cultivation/delegation contract

`state.cultivation` is required persisted authority. It owns plot phase/cycle/harvest count, active manual cultivation-work link, growth timestamps, seed provenance, and the bounded paid tending assignment when present.

Crop readiness derives from canonical world time; growth itself has no timed task. Manual preparation/tending reuse the existing work owner. Paid delegation creates no new direct timed-task owner and grants no player mastery.

Planting consumes the existing canonical `item-elderwood-sweetroot`. Harvest produces the same item with home-cultivation provenance and retained seed history. Community commitments can require the home-plot provenance source without changing item identity.

## Content-scale status

Phase 0.8 exit census:

```text
places/localities       26 / mechanics 10
named NPCs              12 / 50
shop/service sites      17 / 20
creatures               16 / 40
resource sources        13 / 40
canonical items         50 / 200
recipes/processes       11 / 75
abilities/techniques     5 / 100
quests/contracts         8 / 30
companions                1 / 4
transport services        3 / 5
```

Mechanics-scale gate is **NOT READY**. This is a strategic Phase 0.9 input, not a failing Phase 0.8 quality gate.

## Current decision boundary

Phase 0.8 is complete. There is no active implementation track. Phase 0.9 and proposed `0.9.100 Content Scale Gate A` are planned but **not opened**. A new work order is required before implementation begins.
