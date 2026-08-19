# System Catalog

This catalog describes the **current** Hearth & Horizon runtime. Historical roadmap documents and git history retain earlier scaffolds; this file should describe current system status rather than preserve obsolete planned labels.

## Status legend

| Status | Meaning |
| --- | --- |
| `planned` | Known requirement, no canonical runtime implementation. |
| `seeded` | Canonical schema or bounded content exists, but player-facing breadth is limited. |
| `integrated` | Runtime consumes the authority across real system paths. |
| `playable` | A player can exercise a meaningful end-to-end loop. |
| `scaled` | Representative larger-volume/content validation exists. |
| `balanced` | Tuned through sustained gameplay/accepted performance evidence at intended scale. |

No system is marked `balanced` merely because tests are green.

## Current baseline

```text
Product:       0.8.600.51
Package:       0.8.600
Account Save:  5
Game State:    11
Data:          37
Benchmark:     3
Codename:      Derived Enemy Encounter Projection
Runtime:       Node >=24
```

Latest frozen runtime `5a97a109d9476438d001ee75b8e20293f57360dd` passed validation-only PR #375 / Check `32297557960` on Node 24.19.0: **684/684 tests**, Benchmark 3 success, Benchmark Sample success.

## Core simulation, persistence, and tooling

| System | Status | Notes |
| --- | --- | --- |
| Canonical fictional world time | playable | One deterministic second count drives derived date/time. |
| Simulation pause/speed control | playable | Wall-clock scheduling requests deterministic fictional-time advancement. |
| Timed tasks | playable | Shared substrate for work, recovery, projects, travel, and abilities. |
| Simulation interrupts | playable | Deterministic advance-until-event behavior with priority ordering. |
| Day cycle/review | playable | Structured end-of-day summaries and pause preference. |
| Persistent projects | playable | Materials + labor + linked timed task + exactly-once completion. |
| Semantic events | integrated | Bounded observational history; domain state remains authoritative. |
| ActionResult contract | integrated | Canonical `ok/action/code/outcome/data/display`; legacy aliases remain removed. |
| Current-schema account/character persistence | playable | Account Save 5 / Game State 11, strict current-format load/save. |
| Raw current-state gate | integrated | Required persisted authority validates before revival/normalization. |
| NPC world projection | integrated | `state.npcs` is omitted from saves and rebuilt from canonical seed definitions + persisted party authority. |
| Enemy encounter projection | integrated | `state.enemies` is omitted from saves and rebuilt from canonical seed encounter templates; mutable enemy combat belongs to `activeBattle`. |
| Generic ordered migration utility | integrated utility | Available for a future deliberate migration; no automatic save-migration layer. |
| Validation framework | integrated | Runtime, persistence, authored-data, and cross-reference validation. |
| Benchmark harness | integrated | Benchmark 3 uses separate-context warm-up and repeatable sampling. |
| Long-session lifecycle harness | integrated | Multi-day save/load and owner-managed zero-retained-task smoke coverage. |
| Architecture debt guard | integrated | Static tests protect removed compatibility and audited lifecycle seams. |
| Hosted CI | integrated | Node 24 LTS, `checkout@v7`, `setup-node@v6`, Test + Benchmark + Benchmark Sample. |

## World identity, geography, knowledge, and travel

| System | Status | Notes |
| --- | --- | --- |
| Original-world identity | integrated | Hearth & Horizon powers, ancestries, disciplines, places, NPCs, and player-facing vocabulary are canonical. |
| Places/routes/maps | playable | Three anchor regions with connected travel/locality/exploration paths. |
| Safe-locality navigation | playable | Named destinations/actions where topology itself is not the decision. |
| Wilderness/dungeon exploration | playable | Discovery-relative coordinates/minimap and terrain-sensitive movement. |
| Acquired map knowledge | playable | Presentation reveals visited/discovered knowledge, not omniscient authored topology. |
| Direct canonical travel | playable | Uses route authority, timed tasks, fictional time, and arrival events. |
| Scheduled transport | playable | Deterministic departures, fares, cargo allowance, arrival interrupts. |
| Carried-load projection | playable | Derived from canonical unlocked portable containers. |
| Regional content-pack schema/validation | integrated | Cross-pack references, ownership, legacy-boundary checks, generated larger fixture. |
| High-volume regional content | seeded | Architecture supports breadth; authored world volume is still pre-alpha. |

## Character identity, progression, abilities, and equipment

| System | Status | Notes |
| --- | --- | --- |
| Continuous player entity | playable | Identity/resources/equipment/progression persist as one person. |
| Original ancestries/origins | playable | Creator has authored original-world options/openings. |
| Disciplines | playable | Contextual training identities; no magical character replacement. |
| Character-owned skill progression | playable | Learned values persist independently of active discipline. |
| Character-owned capability state | playable | Learned capabilities and use requirements are character-owned. |
| Character stats/progression | playable | Base/lifetime growth and discipline context compose deterministically. |
| Ability/spell catalog + engine | playable | Learned canonical abilities, timed resolution, resource cost, cooldown/interruption seams. |
| Equipment eligibility/tool context | playable | Gear, tools, ancestry/discipline bounded requirements where explicitly modeled. |
| Strict player persistence boundary | integrated | Identity, key items, flags, progression, resources, wallet, equipment, statuses and inventory state have current-schema guards. |
| Root derived combat/stat caches | integrated projection | Omitted from saves and rebuilt after raw validation. |
| Equipment/item breadth | seeded | Representative original catalog exists; broad high-level economy still future. |
| Training/mentor/certification depth | planned | Expand when it creates meaningful capability access decisions. |

## Combat, danger, recovery, and companions

| System | Status | Notes |
| --- | --- | --- |
| Combat 2.0 battle/action model | playable | Structured deterministic action history, readiness, TP/resources, victory/defeat. |
| Basic attacks and techniques | playable | Deterministic action resolution; technique breadth remains limited. |
| Timed magic/ability interruption | playable | Shares fictional time and interrupt authority. |
| Status timing | integrated | Canonical-time duration/expiry. |
| Enemy authored encounter templates | integrated projection | Seed enemy records provide stable encounter inputs; factory combat/resources are deterministic construction data, not durable world history. |
| Active-battle persistence | integrated | Encounter state and deterministic combat/stat snapshots survive save/load; RNG is transient. |
| Battle/root player coherence | integrated | Active player ID/resources/statuses/combat-driving profile remain bound to root authority. |
| Enemy active abilities/tactical selection | seeded | Representative deterministic enemy action selection; broad tactical families remain future. |
| Campaign recovery | playable | Field, defeat, and safe-settlement recovery under one authority. |
| Persistent companions | playable | NPC-backed recruitment, active membership, travel continuity, battle synchronization. |
| Companion convalescence | playable | Inactive local injured companions can recover safely and explicitly rejoin. |
| Companion/social breadth | seeded | Persistent relationship/party foundations exist; deeper authored life breadth remains future. |

## Inventory, provenance, economy, and logistics

| System | Status | Notes |
| --- | --- | --- |
| Inventory containers/transfers | playable | Capacity/access/stacking/portable/home/wardrobe rules. |
| Canonical home/container vocabulary | integrated | Home storage and field logistics use original project vocabulary. |
| Carried inventory authority | playable | Portable carried-container queries + atomic cross-container removal. |
| Shops/buy/sell | playable | Deterministic wallet/inventory transactions with sell restrictions. |
| Resource provenance | playable | Physical/economic/social/exceptional source history survives transformations. |
| Resource opportunities/body recovery | playable | Defeated creatures/world sources become recoverable opportunities rather than magical inventory rewards. |
| Regional economy depth | seeded | Real goods, sinks, shops, transport decisions exist; broad stock/price simulation is future. |
| Currency vocabulary cleanup | planned | Original terminology remains a separate content/design decision. |

## Ecology, gathering, work, and production

| System | Status | Notes |
| --- | --- | --- |
| Ecology families/species/populations | playable | Canonical habitat/population state with deterministic availability/respawn hooks. |
| Gathering sources | playable | Place/tool/time conditions, source capacity, fictional work, provenance output. |
| Hunting/body recovery | playable | Defeated bodies feed practical material recovery/production sinks. |
| Work proficiency | playable | Repeated work improves persistent efficiency without discipline ownership. |
| Production processes | playable | Processing/crafting/cooking/salvage examples use inputs, work, output, provenance, mastery. |
| Workstations | playable | Locality/home furnishing context is derived under one workstation authority. |
| Regional production breadth | seeded | Representative cross-region resource/process graph exists; sustained balance/content breadth future. |
| Quality/HQ depth | planned | Do not inherit MMO quality tiers by default. |

## NPCs, commitments, relationships, and information

| System | Status | Notes |
| --- | --- | --- |
| NPC authored seed definitions | integrated | Canonical baseline identity/services/location used to build runtime projection. |
| Runtime `state.npcs` projection | integrated projection | Rebuilt after raw validation; not Game State 11 serialized authority. |
| NPC recurring availability schedules | playable | Authored windows evaluated from canonical fictional time; not serialized as second clock state. |
| Companion-backed NPC continuity | playable | Durable companion participation belongs to `state.party`; backing NPC location/active flags are derived. |
| Commitments | playable | Accept/requirements/resolve/follow-up/one-time reward state. |
| Carried commitment delivery | playable | Portable carried goods qualify; home storage does not; removal is atomic. |
| Named-NPC relationship state | playable | Persistent social continuity separate from commitments/party state. |
| Journal/player opportunity projection | playable | Decision-first derived guidance over canonical state. |
| Player information/services projections | playable | Carried/known/visited/actionable information without second authorities. |
| Broad quest/branching narrative engine | seeded | Commitment and hook foundations exist; large branching quest breadth remains future. |
| Romance/deep social life | planned | Requires authored candidates, boundaries, goals, schedules, and real decisions. |

## Home, livelihood, infrastructure, and future life systems

| System | Status | Notes |
| --- | --- | --- |
| Home storage foothold | playable | Storage Chest converts regional materials + project labor into durable capacity. |
| Home workshop | playable | Joiner's Workbench grants home production context. |
| Portable field logistics | playable | Field Satchel is earned through existing project/inventory authorities. |
| Broader property/building depth | seeded | Home infrastructure substrate exists; broader acquisition/renovation breadth future. |
| Agriculture/gardening | planned | Strong Phase 0.8 candidate; requires a fresh bounded authority audit. |
| Stewardship/husbandry | planned | Add only where care/work/resources/transport create meaningful decisions. |
| Earned automation/hired labor | planned | Strong candidate after established chores exist; must reduce attention through earned investment/mastery. |
| Warehouses/large logistics | planned | Do not add merely to fill a numeric track. |

## Current maintenance/hardening posture

Maintenance through Product `0.8.600.51` has established:

- strict current-schema persistence and removal of retired FFXI runtime compatibility;
- canonical ActionResult and semantic-event boundaries;
- deterministic simulation, timed-task ownership, lifecycle cleanup, and long-session smoke coverage;
- strict registries for projects, continuity, resources, ecology, discovery, player authority, location, combat identity, and active battle state;
- root derived player caches omitted from serialized authority;
- deterministic active-battle cache persistence and root-player live-authority coherence;
- Game State 10 NPC-world classification: seed/backing NPC runtime records are reconstructible projection rather than durable serialized state;
- Game State 11 enemy classification: seed encounter templates are reconstructible projection while `activeBattle` owns mutable encounter state.

## Next decision boundary

Do **not** automatically begin `0.8.700`.

The NPC and enemy classifications are complete. The strongest remaining maintenance candidate is the bounded `state.log` audit: determine whether recent command/presentation history is disposable projection, compatibility baggage, or durable player-facing history, and keep that distinction separate from semantic-event authority.

Strong feature candidates remain agriculture/stewardship, earned automation, justified companion/social-life breadth, or another concrete life/logistics gap. A new feature track requires a fresh bounded work order.