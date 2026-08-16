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
Product:       0.6.900.1
Package:       0.6.900
Account Save:  4
Game State:    5
Data:          27
Benchmark:     1
Codename:      Integrated Mechanics Gate
Compatibility: pre-release-current-schema
```

`js/text/version.js` is authoritative. Product/package remain at the last **completed** milestone while Phase 0.7 work is still an in-progress playable-campaign slice. Data 27 registers the authored player-experience/regional-loop contract added during that work.

## Development state

Phase 0.6 is complete. Phase 0.7 — **Multi-region playable alpha** — is in progress, with `0.7.100` still open.

The current foundation includes deterministic fictional time, timed work and interrupts, day review, travel and transport, provenance-bearing resources and production, ecology, continuous-character progression/capabilities, Combat 2.0, persistent companions, semantic DOM presentation, locality/exploration navigation, equipment and field tools, and scalable content-pack validation.

Phase 0.7 has now landed three player-experience slices:

- **PX-1 — arrival and footing:** origin-specific arrival, first contact, believable morning start, and setting-friendly explanation of persistent progress;
- **PX-2 — actionable opportunities:** a real Journal/Opportunities projection over current state with semantic claim/equip/locality/travel/gathering/combat/service actions across all three origins;
- **PX-3 — first regional loop:** a fully executable Brasshaven → South Redstone Reach → copper gathering → return → forge processing loop that leaves persistent mining/metalworking gains and provenance-bearing material.

`0.7.100` is **not** complete yet. The next bounded work should add a real canonical contract/commitment and persistent NPC/social follow-up around the proven regional loop, then surface those consequences across several fictional days. Do not mass-author content before that reusable continuity slice is proven.

## Original-world anchors

- **Thornwall** and the **Elderwood**
- **Brasshaven** and the **Redstone Reach**
- **Mistmere** and the **Starfen**
- future central trade hub **Waymeet**

Canonical ancestries are **Human, Lethari, Miri, Veyra, and Korren**. Disciplines are training traditions rather than magical class transformations.

## Player interface

The player-facing UI is a **world interface**, not a permanent command console.

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> authoritative game/save/intent services
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
```

Primary information navigation includes Scene, Character, Spellbook, Journal, Codex, Craft, and World. Contextual actions stay small and situation-dependent. Search-or-act remains a power-user command adapter rather than the required gameplay path.

Safe settlements use named locality navigation and omit the exploration map/D-pad. Wilderness and dungeon-style spaces retain directional movement and a discovery-relative map. Authored coordinates, undiscovered extent, and hidden global placement remain simulation-private.

The Journal is now state-aware guidance rather than a future-system placeholder. It does not own a second quest clock: it projects canonical inventory, equipment, POI discovery, route, work, production, combat, and progression state into useful next actions.

## Fictional time, work, and resources

Simulation time is separate from wall-clock time. Canonical fictional seconds drive travel, work, projects, ecology regeneration, combat recovery, timed abilities, statuses, interrupts, and day review.

A defeated creature or gathering source does not magically manufacture finished goods. Physical resources preserve provenance through recovery, processing, crafting, cooking, salvage/recycling, trade, and use.

```text
world source
  -> raw material
  -> processing
  -> component/ingredient
  -> finished good
  -> use/wear/consumption
  -> repair/recycling/salvage or replacement
```

The first Phase 0.7 regional loop proves this in ordinary browser play: Brasshaven issues a Prospector Pick through a real first contact, the player travels to South Redstone Reach, mines two copper ore through timed gathering, returns to Market Ring, uses a real forge POI, and smelts a provenance-bearing copper ingot through timed production.

## Read these first

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`
9. `docs/LOCALITY_AND_EXPLORATION_MODEL.md`
10. `js/text/version.js`

## Running

Serve over localhost; do not open `index.html` with `file://` because browser ES-module imports require an HTTP origin.

```bash
npm start
```

Validation:

```bash
npm test
npm run benchmark
```

GitHub Actions is the executable validation environment for connector-driven sessions. The current Node 20 action-runtime deprecation warning is non-blocking but should be handled in a deliberate CI-maintenance pass rather than mixed into gameplay work.
