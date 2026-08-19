# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

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

## Current runtime baseline

```text
Product:       0.8.600.52
Package:       0.8.600
Account Save:  5
Game State:    12
Data:          37
Benchmark:     3
Codename:      Transient Command Presentation Log
Compatibility: pre-release-current-schema
Released:      false
Runtime:       Node >=24
```

Phase 0.8 — **Life and infrastructure expansion** — is in progress. Feature tracks `0.8.100` through `0.8.600` are complete. Revisions `.2` through `.52` are maintenance/hardening over that closed feature track and do **not** automatically open `0.8.700`.

Latest frozen runtime: `0fb444aee8b6dbd3a35bb1d3b7662728d85fd691`. Validation-only PR #376 surfaced Check `32301160532` on Node 24.19.0: **688/688 tests**, Benchmark 3 success, and Benchmark Sample success. The PR was closed without merge after validation; documentation commits after the runtime freeze are synchronization only.

## Product direction

The game is one persistent life, not a collection of disconnected minigames. Hunting, gathering, work, production, trade, commitments, relationships, travel, combat, recovery, companions, and home infrastructure should feed one another through shared authorities.

Fictional time is separate from wall-clock waiting. Long tasks cost character time, resources, preparation, risk, and opportunity rather than mandatory real-world delay. Maps represent acquired knowledge. Materials preserve provenance. Disciplines describe training traditions; learned capabilities belong to the character and are constrained by actual proficiency, equipment, resources, preparation, status, and context.

## Current persistence model

The project is pre-alpha and uses a strict **current-schema-only** persistence posture. Old local saves are not automatically migrated unless a future bounded work order explicitly requires compatibility.

Game State 12 validates required persisted authority before reference revival or runtime normalization. Important durable authorities include world time, simulation/task state, projects, commitments, relationships, ecology/resource opportunities, party, ability runtime, semantic events, acquired discovery, player identity/progression/inventory/resources/wallet/equipment/statuses, location, combat identity, and active-battle state when present.

Some runtime state is deliberately **not** serialized:

- root `player.combat` and `player.statState` are reconstructed caches;
- `activeBattle.rng` is transient;
- flat `player.inventory` reference identity is relinked after decode;
- `state.npcs` is a reconstructed world projection;
- `state.enemies` is a reconstructed encounter-template projection;
- top-level `state.log` is current-session command presentation history.

Products `.50`–`.52` completed the dedicated broad-array ownership series. NPC records are rebuilt from canonical seed data plus persisted party authority. Enemy templates are rebuilt from canonical seed definitions while mutable encounter state belongs to persisted `activeBattle`. Top-level command history is wall-clock-stamped presentation/diagnostic state: save encoding omits it and character load starts a fresh session log, while persisted typed `state.events` remains the semantic observation channel.

`activeBattle.log` remains separate persisted encounter-local history. Canvas command-history/output buffers are separate transient UI state.

There is no automatically queued next audit from this series. A new maintenance or feature packet requires a fresh bounded work order; `0.8.700` is not opened by revision sequencing alone.

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

The semantic DOM/CSS shell is active. Primary information navigation includes Scene, Character, Spellbook, Journal, Codex, Craft, and World. Contextual actions use semantic intents into domain systems. Search/command routing remains a power-user and regression adapter rather than the required gameplay path.

Safe settlements use named locality navigation where fine movement adds little decision value. Wilderness and dungeon-style spaces retain directional movement and discovery-relative maps. Authored topology and undiscovered coordinates remain simulation-private.

## Systems already playable

The current foundation includes:

- deterministic fictional time, simulation control, timed tasks, interrupts, and day review;
- connected multi-region travel, exploration, scheduled transport, and acquired map knowledge;
- continuous-character progression, skills, capabilities, equipment, and ability execution;
- deterministic combat, statuses, battle persistence, recovery, and persistent companions;
- inventory containers, carried-load logistics, shops, provenance, resource recovery, and economy seams;
- ecology, gathering, work proficiency, production, workstations, and regional material chains;
- commitments, relationships, recurring NPC availability, Journal/opportunity projections, and player information surfaces;
- home storage, workshop capability, and earned portable field logistics;
- current-schema persistence, lifecycle guards, long-session smoke coverage, and repeatable benchmark sampling.

High-volume content, advanced combat/ability breadth, deeper social life, agriculture/stewardship, earned automation, larger property systems, and release hardening remain future work.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`
9. `docs/QUALITY_GATES.md`
10. `PROJECT_PROFILE.yaml`
11. `js/text/version.js`

Repository evidence beats conversation memory. Follow the bounded-work and validation rules in `AGENTS.md` before implementation.

## Running

Serve over localhost; do not open `index.html` with `file://` because browser ES-module imports require an HTTP origin.

```bash
npm start
```

Validation entry points:

```bash
npm test
npm run benchmark
npm run benchmark:sample
npm run hardening
npm run check
```

`package.json` requires Node 24 or newer. Hosted `Check` currently uses Node 24 LTS.
