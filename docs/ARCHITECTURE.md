# Architecture

Hearth & Horizon is an original text-first persistent fantasy life RPG built around one deterministic world state and one continuous character. This document describes current runtime authority, not speculative final architecture.

## Active browser path

```text
index.html
  -> js/main.js
      -> createDomApp(host)
          -> authoritative game/save/intent services
          -> createGameViewModel(state, uiState)
          -> renderDomApp(...)
      -> installOnboardingEnhancements(host)
          -> presentation-only theme/creator/save-recovery controls
```

The semantic DOM/CSS shell is the active player interface. Canvas modules remain bounded regression/reference code and must not become normal gameplay authority again.

## Authority rules

- Fictional time, timed tasks, interrupts, work, projects, travel, combat readiness, statuses, recovery, and day review share one canonical simulation substrate.
- Continuous-character stats, learned skills/capabilities, and work proficiency belong to the person; disciplines are contextual training traditions.
- Inventory/equipment/tool state is canonical for preparation and practical capability checks.
- Resources preserve source/transformation provenance and one-time ownership; same-ID stacks with different provenance histories remain distinct.
- Projects own persistent material/labor progress; specialized systems may attach bounded project metadata and apply domain-specific completion effects.
- Home/infrastructure composes projects, timed tasks, canonical materials, inventory, and furnishings; it does not own a second item store, construction clock, or capacity formula.
- Commitments own accepted/resolved/follow-up state and one-time rewards. General named-NPC relationship continuity lives in `state.relationships`; companion-specific relationship/tactics state remains in party/companion authority.
- Maps, campaign guidance, transport boards, settlement service boards, player information, and home opportunity models are projections of acquired/current state.
- Safe settlements use named locality navigation; terrain-sensitive wilderness/dungeon spaces use discovery-relative spatial exploration.
- Persistent companions remain NPC-backed world participants rather than summons.
- Content packs and cross-reference validation remain the scale mechanism for authored world growth.
- Ordinary browser presentation exposes what the character sees, knows, carries, remembers, needs, or can decide. Architecture, compatibility, raw state/task channels, and hidden topology stay outside normal play.

## Player-experience projections

`playerExperienceEngine` and `playerOpportunityEngine` read real origin, equipment, locality, route, work, gathering, inventory, encounter, and service state; they do not persist tutorial progress.

`playerContinuityEngine`, `playerDangerRecoveryEngine`, `playerCampaignReadabilityEngine`, `transportServiceBoardEngine`, `settlementServiceBoardEngine`, and `playerInformationEngine` remain derived views over their canonical domain authorities. The semantic browser delegates actual mutations to travel, transport, production, shop, recovery, equipment, commitment, party, locality, inventory, and project engines.

`activityAdvanceEngine` provides semantic advance-to-completion for the current canonical activity without a second clock. It composes travel, gathering/production work, defeated-body recovery, campaign recovery, and generic `project.labor`.

## Character creation and onboarding architecture (`0.8.100.2`)

### Canonical creator model

`characterCreationModel.js` owns normalized creator choices and deterministic creator randomization. It consumes:

- canonical ancestry definitions from `races.js`;
- canonical discipline definitions from `jobs.js`;
- canonical origin definitions from `nations.js` / player-experience content;
- original-world names from `characterNames.js`;
- authored creator/origin prose from `characterCreationContent.js`;
- starter-kit definitions from `startingDisciplineKits.js`.

`randomizeCreatorName` and `randomizeCreator` accept an injectable RNG. Tests can therefore prove valid ancestry/sex/origin/discipline combinations without making UI randomness an implicit gameplay authority.

### Starting discipline presentation and kit

The six starting disciplines already own real `primaryAttributes`, `derivedFocus`, and `skillFocus`. `characterCreationContent.js` now exposes those facts alongside a small starter-kit description so the browser can explain the practical level-1 difference between disciplines.

`startingDisciplineKits.js` is authored data, not an equipment/progression engine. Each definition points at existing canonical equipment records and adds player-facing weapon-training/protection/play-style framing.

Guided browser creation calls:

```text
createCreatorGameOptions(...)
  -> includeStartingDisciplineKit: true
  -> createNewGameState(options)
  -> addItemToContainer(...)
```

The kit is placed in canonical carried inventory and is **not auto-equipped**. This preserves a real first preparation choice and avoids mutating equipment/combat state behind the player's back.

Generic `createNewGameState()` remains neutral unless that explicit option is supplied. This is intentional: low-level fixtures, diagnostic callers, and future non-creator state construction must not silently receive browser onboarding equipment.

The older prompt/fast-create command adapter still uses neutral generic state creation. It is a non-blocking transitional seam; do not repair it by restoring universal starter inventory.

### Authored opening scenes

`characterCreationContent.js` owns three distinct present-world arrival scenes rather than one variable-substitution tutorial template:

- Thornwall: timber-wagon arrival, Warden Halric Dane, an opportunistic hawker, and a credible pointer toward Sera Talwin;
- Brasshaven: freight-caravan arrival, a predatory labor broker, and Marshal Varric Stone's intervention;
- Mistmere: ferry arrival, a bogus visitor-fee pitch, a canal registrar, and a pointer toward Reader Soli Venn.

Each scene includes one restrained observation derived from the selected discipline. Game-design explanation such as permanent-class rules belongs in the creator UI, not diegetic prose.

### DOM onboarding adapter

`domOnboardingEnhancements.js` is a bounded presentation adapter installed after the main DOM app. It does not own creator, save, account, equipment, or theme persistence state.

It adds:

- ancestry/sex-aware name die;
- whole-character die;
- discipline mechanics/gear preview;
- top-right delete control on character save cards;
- Light/Dark theme control in Settings;
- clear-all local data in Settings;
- logged-out reset-local-data fallback.

The MutationObserver exists only to reapply these controls after the existing renderer replaces DOM markup. Every enhancement has duplicate guards. It is not a gameplay timer, subscription, or simulation loop.

### Theme authority

Account settings remain the persistence source for theme preference. `applyThemePreference()` reads that setting and applies `html[data-theme]`; `css/theme.css` provides the two active palettes:

```text
Dark  = charcoal + grayscale + dark/slate blue
Light = silver-gray + dark navy + dark gray + black
```

Decorative gold/brown selection chrome is overridden, including resource-meter colors. Restrained semantic danger/success colors remain allowed.

The historical account-settings normalizer still accepts `highContrast`; the active new browser UI exposes only Light and Dark. A future schema/settings cleanup may remove the dormant historical value deliberately.

### Save recovery

`saveRecovery.js` is an adapter over `save.js`, not another persistence layer.

`deleteCharacterSave(characterId)`:

- loads the logged-in account registry;
- removes a character record by registry ID without decoding its `encodedState`;
- repairs `lastCharacterId` to another remaining character or `null`;
- persists through canonical `saveAccount`;
- therefore can remove a corrupt character that `loadCharacter()` cannot revive.

`clearAllLocalData()` delegates to existing `clearSave()`. The UI uses destructive confirmations but does not manipulate storage keys directly.

## Home, project, and infrastructure architecture (`0.8.100`)

`projectEngine.js` remains the persistent construction/work substrate. A project owns stable ID/kind/status, material requirements/contributions, labor duration and linked `project.labor` task, timestamps, and bounded domain `data`.

Data 32 introduced **Build a Storage Chest**:

```text
2 Resin-Sealed Hardwood Boards
1 Redstone Copper Ingot
30 minutes canonical project labor
  -> existing Storage Chest furnishing
  -> +5 furnishing-storage slots
```

`homeInfrastructureEngine.js` resolves the current home, begins the generic project, delegates material contribution and labor, reconciles generic completion, applies the furnishing exactly once, emits the semantic completion event, and derives the **Home & Foothold** Journal entry. Inventory/furnishing authority remains the actual storage-capacity owner.

A fresh character's Bronze Bed + Maple Table provide 3 furnishing-storage slots; the Storage Chest raises that to 8. No second property registry, construction clock, construction wallet, or home-only inventory exists.

## Navigation, economy, combat, party, and recovery

Safe-locality navigation remains named-place/POI based. Wilderness/dungeons use discovery-relative spatial navigation and acquired map knowledge. Route/transport engines own inter-place travel, fares, cadence, cargo, fictional time, and party arrival.

Gathering/production/shop/inventory authorities continue to own source capacity, tools, transformation provenance, work mastery, atomic transactions, wallet mutation, and storage. Physical creature-material recovery remains separate from battle progression rewards.

Combat 2.0 uses structured battle-local history and fictional-time readiness. Persistent party state is NPC-backed. Mara Venn's field approach lives in existing party tactics and affects derived battle-entry attributes without mutating permanent stats or creating companion XP.

Campaign recovery remains canonical timed work:

```text
recovery.field       10 minutes
recovery.settlement  60 minutes
recovery.defeat      120 minutes
```

## Persistence and version policy

Current compatibility mode: `pre-release-current-schema`.

```text
Product:      0.8.100.2
Package:      0.8.100
Account Save: 4
Game State:   5
Data:         33
Benchmark:    1
Codename:     Home Foothold and Infrastructure
```

Data 32 remains the first home-infrastructure contract. Data advances `32 -> 33` for canonical original-world name pools, starting-discipline-kit definitions, and the authored origin-opening revision.

Account Save remains 4: per-character deletion and clear-all use the existing account registry/settings/storage contract.

Game State remains 5: starter equipment uses existing inventory records; no persisted field or meaning changed.

Relevant new/advanced registrations:

```text
versionManifest:          0.8.100.2
domOnboarding:            0.1.0
saveRecovery:             0.1.0
characterCreation:        0.6.0
characterCreationContent: 0.2.0
characterNames:           0.1.0
startingDisciplineKits:   0.1.0
```

## Current authoritative runtime checkpoint

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.100.2
Data 33
```

Benchmark 1:

```text
player combat profiles  0.463353 ms/op
enemy combat profiles   0.125126 ms/op
basic attacks            0.551861 ms/op
tick dispatch            0.004834 ms/op
direct route lookup      0.866522 ms/op
```

Primary new regression coverage is `tests/playerCreatorPolish.test.js` and `tests/saveRecovery.test.js`. This checkpoint also passed the normal Pages build/deploy. No manual visual-browser walkthrough is claimed by the repository evidence.

## Carried-forward rule

Presentation adapters may make canonical state easier to understand and operate, but they must not become second authorities. Future Phase 0.8 work should extend real fictional time, materials, inventory, projects, relationships, locations, party state, production, transport, and world knowledge rather than creating isolated management simulations.
