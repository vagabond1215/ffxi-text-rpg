# Architecture

Hearth & Horizon is an original text-first persistent fantasy life RPG built around one deterministic world state and one continuous character. This document describes current runtime authority, not speculative final architecture.

## Active browser path

```text
index.html
  -> js/main.js
      -> createDomRoot(...)
          -> mount()
              -> createDomApp(host)
                  -> authoritative game/save/intent services
                  -> createGameViewModel(state, uiState)
                  -> renderDomApp(...)
              -> installOnboardingEnhancements(host)
          -> unmount()
              -> dispose onboarding observer
              -> domApp.destroy()
                  -> remove host/window listeners
                  -> stop movement interval
```

The semantic DOM/CSS shell is the active player interface. Canvas code remains bounded regression/reference code.

## Authority rules

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, recovery, and day review share one canonical deterministic simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool/container state owns preparation, capacity, access, portable item location, carried-load facts, and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership.
- Projects own persistent material/labor progress and exactly-once completion state.
- Home/infrastructure composes projects, timed tasks, materials, inventory, furnishings, workstations, production, and container unlocks; it does not create parallel stores, timers, workstation registries, recipe engines, mastery counters, or cargo state.
- Transport owns fares, cadence, departure, arrival, journey cargo snapshots, and service limits. It derives carried load from inventory and never trusts caller/UI cargo counts.
- Commitments own accepted/resolved/follow-up state and one-time rewards; relationship continuity remains a separate authority.
- NPC schedules are recurring authored availability evaluated against canonical fictional time; availability is derived, not serialized as a second clock.
- Campaign recovery remains the one player/party recovery authority.
- Maps, Journal guidance, transport/service boards, player information, home opportunity models, and social schedule decoration are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants; party authority owns recruitment, active membership, location continuity, safe separation/reunion, and battle synchronization.
- Ordinary presentation exposes what the character sees, knows, carries, remembers, needs, or can decide; implementation rationale stays outside normal play.

## Semantic action contract

Canonical `ActionResult` exposes only:

```text
ok
action
code
outcome
data
display
```

`actionSuccess()` / `actionFailure()` return that contract directly. The old non-enumerable `.message` / `.reason` aliases are removed. Adapters use `describeActionResult()` / `display.text` for prose and semantic fields for logic.

Do not reintroduce prose parsing or promoted compatibility fields as gameplay authority.

## Shared player-experience projections

`playerExperienceEngine`, `playerOpportunityEngine`, `playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, `playerInformationEngine`, and `playerSocialScheduleEngine` remain derived views/decorators over canonical domain authorities.

`activityAdvanceEngine` provides semantic advance-to-completion without a second clock. It composes travel, gathering/production work, recovery, and generic `project.labor`.

## Home and inventory authority

`projectEngine.js` is the persistent construction/work substrate. Projects own stable identity/status, material requirements/contributions, labor duration, linked tasks, timestamps, and bounded domain data.

Current canonical home/inventory state is:

```text
player.inventoryState.home
  isAtHome
  placedFurniture

player.inventoryState.containers
  inventory
  homeSafe
  homeSafe2
  storage
  homeLocker
  fieldSatchel
  fieldSack
  fieldCase
  wardrobe1 ... wardrobe8
```

Inherited `mogHouse` state and `mog*` container identifiers are not canonical aliases and are not translated during load. `homeFurnishings.js` owns canonical furnishing definitions; inventory owns container unlock/access/capacity/transfer; `workstationEngine` derives workstation context; `productionEngine` owns recipe inputs/work/outputs/provenance/mastery.

## Carried inventory and logistics authority

`carriedInventoryEngine.js` centralizes the portable-carried container set and exposes deterministic carried-item queries plus atomic cross-container removal. Consumers such as commitments do not hard-code Field Satchel/Sack/Case IDs.

`carriedLoadEngine.js` projects cargo units from the same container definitions. It does not persist a second live cargo counter.

```text
Inventory -> Field Satchel
  item location changes
  total carried cargo does NOT change

Inventory/Field Satchel -> Home Safe
  goods leave portable carriage
  total carried cargo decreases
```

Commitment requirements/delivery inspect canonical carried inventory, so a qualifying item in an unlocked portable field container can be delivered while home storage cannot. Cross-container removal plans validate completely before mutation.

`transportServiceBoardEngine` derives current load for presentation and `transportEngine` independently derives load when booking, checks allowance before fare deduction, and records journey load.

## Daily social availability authority

`npcSchedules.js` is the recurring NPC-availability catalog. `npcScheduleEngine` reads canonical `state.worldTime` and derives current availability, window end, next availability, and guidance. The same authority is enforced below presentation by locality interaction and commitment actions.

The current model is public availability at a static canonical NPC location, not autonomous multi-location pathfinding.

## Companion convalescence authority

`campaignRecoveryEngine.js` remains the one recovery authority:

```text
field recovery       -> player + active companions
defeat recovery      -> player + active companions
settlement recovery  -> player + active companions + inactive recruited companions physically present in the safe settlement
```

Settlement recovery uses the existing `recovery.settlement` timed task and 3600 canonical fictional seconds. It changes HP/MP only; inactive companions do not silently become active.

`partyEngine` rejects leaving a 0-HP companion behind in unsafe wilderness before membership/location mutation. `localityClassificationEngine.js` owns the shared safe-settlement predicate. Presentation suppresses impossible reunion actions while party authority remains final.

## Persistence authority — strict current schema

Compatibility mode: `pre-release-current-schema`.

```text
Product:       0.8.600.12
Package:       0.8.600
Account Save:  5
Game State:    6
Data:          37
Benchmark:     3
```

`js/text/save.js` owns account/session/character persistence. Current storage keys are:

```text
hearthHorizonAccounts
hearthHorizonAccountSession
```

Accepted payload encoding is `base64-json-v1` with exact current Account/Game State versions.

Before revival/reference relinking, `currentGameStateSchema.js` requires a complete Game State 6 persisted structure. Missing required registries or nested capability state cause rejection. Runtime `ensure*` helpers may initialize new/internal state, but they are not implicit save migrations.

`saveGame()` likewise refuses malformed current state rather than manufacturing required registries during persistence. The deleted active save-migration layer is not part of current runtime. `migrationEngine.js` remains a generic utility only for a future deliberate migration requirement.

## Lifecycle ownership

Long-lived runtime resources require explicit owners and safe replacement/disposal.

### Tick subscriptions

Stable subscriber IDs may be replaced. The disposer returned to a subscriber removes only the exact record it created; therefore an old owner cannot later remove a newer subscriber that reused the same ID. Explicit `unsubscribe(id)` remains the deliberate operation for removing the current owner.

### Browser root

`domRoot.js` owns the active `domApp` instance and onboarding enhancement disposer. Remount disposes the prior observer/app before replacement. Unmount is idempotent. If onboarding enhancement installation throws after app creation, the new app is destroyed and the root remains unmounted.

### Long-session state

`tests/longSessionLifecycle.test.js` proves deterministic 130-day advancement with periodic real current-schema save/load, exactly-once task start/completion through reload, bounded semantic-event history (200), and bounded day-summary history (120).

### Terminal task history

Completed/cancelled timed-task records are not generically pruned yet. Multiple domain records may still reconcile through terminal task IDs. Any future compaction requires domain-owned release semantics first; generic deletion without that contract would violate task authority.

See `docs/RESOURCE_LIFECYCLE.md` for the detailed ownership contract.

## Command/adapter boundary

Canonical command/slash routing no longer preserves the retired FFXI macro runtime surface. The old command adapter, macro runtime reference data, raw-save fallback key, and command aliases such as `moghouse`, `trust`, `jobs`, `/ma`, `/ws`, etc. are removed from canonical runtime routing.

Generic UX abbreviations such as `?`, `h`, `inv`, or `char` remain ordinary parser shorthand where useful; they are not world-identity compatibility.

Legacy FFXI-derived research/reference datasets may remain bounded reference material but must not feed canonical world identity or persisted gameplay state merely for compatibility.

## Runtime, validation, and performance guardrails

`package.json` requires Node `>=24`. Hosted Check runs on Node 24 LTS using `actions/checkout@v7` and `actions/setup-node@v6`, with concurrency cancellation and a bounded job timeout.

Hosted Check executes the full tests, Benchmark 3, and sampled Benchmark 3 evidence. `tests/architectureDebtGuard.test.js` prevents selected removed compatibility surfaces from returning. Focused lifecycle tests additionally protect long-session save/load, subscriber ownership, and DOM-root cleanup.

Benchmark 3 separates setup from the timed attack/tick/route workloads and performs an unreported 10% warm-up on separate setup state before every timed workload/sample. Benchmark 1/2 results are not numerically comparable to Benchmark 3.

Latest exact-head runtime gate: PR #335 / exact head `10ab2c5af9ddcf0760f49817ff5a8c41ec1caa07` / Check `32160936491`, Node 24.19.0:

```text
527/527 tests
0 failed
0 skipped
Benchmark 3 success
Benchmark Sample success
```

Single Benchmark 3 run:

```text
player combat profiles  0.355492 ms/op
enemy combat profiles   0.066399 ms/op
basic attacks            0.002787 ms/op
tick dispatch            0.000923 ms/op
direct route lookup      0.008017 ms/op
```

No hard performance thresholds are accepted yet. The very short attack/tick microbenchmarks still show high relative variance in repeated hosted samples. See `docs/PERFORMANCE_BUDGET.md` for the current baseline and interpretation rules.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, recovery, production, transport, world knowledge, and bounded authored schedules rather than creating isolated management simulations, hidden lifecycle resources, or compatibility layers.
