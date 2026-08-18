# Transitional Architecture

This document records remaining temporary seams so current pre-alpha work does not harden legacy assumptions. The design authority is `docs/DEVELOPMENT_DIRECTION.md`; current runtime authority is `docs/ARCHITECTURE.md`; release/schema policy is `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

## Purpose

Hearth & Horizon is an original text-first persistent fantasy life RPG. FFXI-derived code/data may remain as bounded research, migration history, or command-adapter scaffolding, but must not become canonical player-facing identity or a second source of truth.

The transition strategy is evolutionary:

- preserve deterministic, tested current systems;
- replace legacy authority rather than mirror it;
- keep adapters narrow and clearly non-canonical;
- change pre-alpha persisted contracts cleanly when simplification is worth the break;
- add a migration only when compatibility is explicitly required or independently useful;
- remove temporary assumptions once their canonical replacement is proven.

Do not perform a broad rewrite merely because transitional debt remains.

## Discipline/job state remains partly transitional

Current player state still contains `player.jobs` fields used by progression, equipment eligibility, and some command-facing descriptions. They are not the long-term definition of what the character can do.

The durable rule is:

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

Character-owned learned capabilities, proficiency, equipment/tool requirements, resources, preparation, status, and context should increasingly decide action eligibility. Do not add new permanent mechanics whose only justification is a magical active-class transformation.

## Structured action and event seams

`js/text/systems/actionResult.js` provides structured action outcomes; consumers should use semantic action/code/outcome/data rather than parse prose.

`js/text/systems/semanticEventEngine.js` provides bounded observational events for summaries, objectives, relationships, completion, diagnostics, and tests. Events are not event sourcing; canonical game state remains authoritative.

Some compatibility aliases on action results or command-facing adapters may remain until a bounded cleanup proves their callers are gone. Do not extend those aliases reflexively.

## Persistence seam — current-schema pre-alpha

The active persistence policy is now intentionally simple:

```text
accepted account registry version == VERSION.accountSave
accepted game state version       == VERSION.gameState
accepted encoding                 == base64-json-v1
otherwise                         -> reject/reset, do not auto-migrate
```

`js/text/save.js` owns current account/session/character persistence. Current storage keys are Hearth & Horizon names, and current Game State uses canonical `inventoryState.home` plus canonical home/field container identifiers.

`js/text/systems/migrationEngine.js` remains as a generic ordered-migration utility for a future migration that is deliberately required. The old active `saveMigrations.js` compatibility layer has been removed. The existence of the generic engine does not imply support for old local pre-alpha saves/accounts.

`reviveGameState()` may restore current-schema object references after JSON decoding. It must not become a hidden migration/reconstruction system.

Account Save, Game State, Data, Benchmark, and Product versions answer different questions and must be advanced deliberately.

## Fictional time versus wall clock

Canonical fictional time is `state.worldTime` and the deterministic simulation/task/interrupt substrate. Wall-clock scheduling may request advancement; it never owns the world calendar.

```text
wall-clock/UI input (optional)
        |
        v
request deterministic simulation advancement
        |
        v
world time + tasks + interrupts
        |
        v
travel / work / projects / recovery / schedules / combat
```

Tests and gameplay systems must be able to advance fictional time without sleeping or depending on real elapsed time.

## Legacy command adapter boundary

The command shell still contains historical aliases and FFXI-era command compatibility. This is an adapter surface, not canonical world identity. New normal browser gameplay should use semantic intents and original-world terminology.

Do not add new canonical state, content IDs, or gameplay rules merely to preserve an old command alias. Remove remaining aliases/fallback keys only in a bounded command-shell cleanup with focused tests so parser behavior is not accidentally rewritten alongside unrelated systems.

## Foundations to preserve

The following boundaries are useful and should be evolved rather than replaced without cause:

- deterministic world time, timed tasks, activity advancement, and interrupts;
- ActionResult and semantic-event contracts;
- projects, resource provenance, ecology, gathering, production, and work mastery;
- original-world places/localities, acquired map knowledge, routes, and transport;
- canonical inventory/container/equipment/tool ownership;
- commitments and relationships as separate authorities;
- authored NPC availability evaluated from fictional time;
- persistent NPC-backed companions and separate party/recovery authority;
- semantic DOM browser UI with presentation/view models kept non-authoritative;
- validation, Node test harness, and Benchmark 1.

## Current cleanup checkpoint

Product `0.8.600.2` removes the active old-save compatibility layer, inherited `mogHouse`/`mog*` canonical home identifiers, obsolete `highContrast` intent generation, and the dead UI transport cargo payload. It advances Account Save to 5, Game State to 6, and Data to 37 without opening a new feature track.

Remaining transitional debt should be addressed only when a concrete bounded work order justifies it. In particular, do not turn compatibility cleanup into an unbounded rewrite of legacy research datasets or the entire command adapter.
