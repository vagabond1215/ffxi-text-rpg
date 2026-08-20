# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Current baseline

Phase 0.8 — Life and Infrastructure Expansion — is complete.

```text
Product:       0.8.900.1
Package:       0.8.900
Account Save:  5
Game State:    14
Data:          39
Benchmark:     3
Codename:      Household & Community Continuity
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Frozen runtime `ca7d37c643adc4115b519148615f6120d03228df` passed hosted Check `32395768383` on Node 24.19.0 with **699/699 tests**, Benchmark 3 success, and Benchmark Sample success. Phase-exit validation Check `32395959505` additionally passed Content Census and Hardening. See `docs/PHASE_0_8_EXIT_GATE.md`.

## Product direction

The game is one persistent life, not a collection of disconnected minigames. Hunting, gathering, work, production, trade, commitments, relationships, travel, combat, recovery, companions, home infrastructure, cultivation, and earned delegation feed one another through shared authorities.

Fictional time is separate from wall-clock waiting. Maps represent acquired knowledge. Materials preserve provenance. Disciplines describe training traditions; learned capabilities and mastery belong to the character.

## Completed Phase 0.8 arc

```text
home storage + workshop
  -> carried-load and portable logistics
  -> fictional-time NPC/companion life
  -> deterministic home Sweetroot cultivation
  -> repeated manual mastery
  -> paid delegation of one tending chore
  -> home-grown provenance
  -> scheduled named community commitments and relationships
  -> ordinary services, preparation, travel and adventure remain connected
```

Cultivation growth and delegated tending do not introduce a second clock or direct timed-task owner. The current direct player intents include cultivation actions plus `commitment.accept`, `commitment.resolve`, and `commitment.followUp`.

## Content-scale census

```bash
npm run census
npm run census -- --json
```

Current exit census:

```text
places/localities       26 / mechanics floor 10
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

The mechanics-scale gate is **NOT READY**. This is expected and is the main strategic input for planned Phase 0.9 content-scale work. Counts should not be gamed with disconnected filler.

## Persistence model

The project is pre-alpha and uses strict **current-schema-only** persistence. Old local saves are not automatically migrated unless a future bounded work order explicitly requires compatibility.

Game State 14 requires durable cultivation plot/crop/delegation authority. Some runtime state remains deliberately non-serialized:

- root `player.combat` and `player.statState` are reconstructed caches;
- `activeBattle.rng` is transient;
- flat `player.inventory` reference identity is relinked after decode;
- `state.npcs` is a reconstructed world projection;
- `state.enemies` is a reconstructed encounter-template projection;
- top-level `state.log` is session command presentation history.

`state.events` remains persisted structured semantic observation history. `activeBattle.log` remains separate persisted encounter-local history.

## Player interface

The player-facing UI is a **world interface**, not a permanent command console.

```text
index.html
  -> js/main.js
      -> createDomRoot(...)
          -> createDomApp(host)
              -> authoritative game/save/intent services
              -> createGameViewModel(state, uiState)
              -> renderDomApp(...)
```

Primary information navigation includes Scene, Character, Spellbook, Journal, Codex, Craft, and World. Contextual gameplay actions use semantic intents into domain systems; command routing remains an optional adapter/regression surface.

## Systems already playable / proven

- deterministic fictional time, simulation control, timed tasks, interrupts, and day review;
- multi-region travel, exploration, scheduled transport, acquired map knowledge;
- character progression, skills, capabilities, equipment, abilities;
- deterministic combat, statuses, battle persistence, recovery, companions;
- inventory containers, carried load, shops, provenance, resource recovery;
- ecology, gathering, work proficiency, production, workstations;
- commitments, relationships, recurring NPC availability, semantic Journal/information surfaces;
- home storage, workshop capability, portable field logistics;
- cultivation/stewardship, earned tending delegation, and home-linked community continuity;
- current-schema persistence, lifecycle guards, content-scale census, and repeatable benchmark sampling.

High-volume authored content, deeper combat/ability breadth, broader social/companion life, larger property/logistics systems, browser E2E hardening, supported-save compatibility, and release support remain future work.

## Next decision boundary

Phase 0.9 is planned but **not opened**. Proposed first unit: `0.9.100 — Content Scale Gate A`. A separate explicit work order is required before implementation or the recommended protected-main/required-Check governance transition begins.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. relevant architecture/runtime/tests for the active pass

Repository evidence beats conversation memory.

## Running

```bash
npm start
```

Validation/progression entry points:

```bash
npm test
npm run benchmark
npm run benchmark:sample
npm run census
npm run hardening
npm run check
```

`package.json` requires Node 24 or newer. Hosted `Check` uses Node 24 LTS.
