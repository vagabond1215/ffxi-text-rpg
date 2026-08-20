# Hearth & Horizon

**Working title.** Hearth & Horizon is a text-first persistent fantasy life RPG about one continuous character building skills, livelihood, relationships, reputation, material capability, home/infrastructure, and geographic reach across a connected original fantasy world.

Earlier FFXI-derived experiments may remain only as explicit research, migration, compatibility, or comparison material. They are **not canonical world content**.

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

## Draft 0.8.700 feature baseline

Draft PR #378 is open and unmerged. Its validated proposed baseline is:

```text
Product:       0.8.700.1
Package:       0.8.700
Account Save:  5
Game State:    13
Data:          38
Benchmark:     3
Codename:      Cultivation & Stewardship
Compatibility: pre-release-current-schema
Runtime:       Node >=24
```

Exact frozen implementation head `c125f7ae5f94800893dc28c7fa0ceb61553e3db8` passed Check `32340190710` on Node 24.19.0 with **695/695 tests**, Benchmark 3 success, and Benchmark Sample success.

`main` remains on the previous baseline until #378 is explicitly merged.

## Product direction

The game is one persistent life, not a collection of disconnected minigames. Hunting, gathering, work, production, trade, commitments, relationships, travel, combat, recovery, companions, home infrastructure, and cultivation should feed one another through shared authorities.

Fictional time is separate from wall-clock waiting. Maps represent acquired knowledge. Materials preserve provenance. Disciplines describe training traditions; learned capabilities and mastery belong to the character.

## Current Phase 0.8 progression

```text
C0 Continuation Infrastructure + Content Census  -> complete
0.8.700 Cultivation & Stewardship                -> validated on PR #378, pending landing
0.8.800 Earned Routine Delegation                -> ready next only after #378 lands
0.8.900 Household & Community Continuity         -> queued
Phase 0.8 exit audit                             -> queued
```

`docs/THREAD_HANDOFF.md` states the exact checkpoint. `docs/EXECUTION_PIPELINE.md` contains the durable active/next/deferred queue and restart rules. New threads should use those documents instead of restarting broad discovery when the checkpoint is current.

## Cultivation & Stewardship

The bounded 0.8.700 proof adds one reusable home Sweetroot bed:

```text
prepare
  -> plant one physical existing Sweetroot
  -> fictional time passes
  -> tend after one fictional day
  -> harvest after two fictional days
  -> three ordinary Sweetroots enter inventory
  -> provenance records home cultivation + seed history
  -> existing consume / cooking / trade sinks remain usable
  -> cultivation mastery reduces later hands-on work duration
```

Growth itself owns no timer, interval, background worker or long-lived timed task. `state.cultivation` persists crop lifecycle timestamps; only short preparation/tending labor reuses the existing work/task owner.

The Journal/context UI exposes cultivation through direct semantic intents rather than generated command strings.

## Content-scale census

```bash
npm run census
npm run census -- --json
```

The census reports unique canonical breadth against mechanics-integration, playable-alpha, and 1.0 planning targets. Being below a future target is not a CI failure and counts should not be gamed with disconnected filler.

The first cultivation proof deliberately reuses existing Sweetroot content, so no census-count increase is claimed for this track.

## Persistence model

The project is pre-alpha and uses strict **current-schema-only** persistence. Old local saves are not automatically migrated unless a future bounded work order explicitly requires compatibility.

On PR #378, Game State 13 adds required durable `state.cultivation` authority for plot phase/cycle, crop timestamps, seed provenance, harvest replay protection, and active cultivation-work links.

Some runtime state remains deliberately non-serialized:

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
- cultivation/stewardship on draft PR #378;
- current-schema persistence, lifecycle guards, content-scale census, and repeatable benchmark sampling.

High-volume content, deeper combat/ability breadth, broader social life, earned routine delegation, larger property/logistics systems, browser E2E hardening, and release support remain future work.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/EXECUTION_PIPELINE.md`
4. `docs/DEVELOPMENT_DIRECTION.md`
5. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
6. `docs/ROADMAP.md`
7. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
8. relevant architecture/runtime/tests for the active pass

Repository evidence beats conversation memory. If PR #378 remains open/unmerged, resolve its status before starting `0.8.800` by default.

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
