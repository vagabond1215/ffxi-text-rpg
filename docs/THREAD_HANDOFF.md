# Thread Handoff

Read this before continuing implementation in a new ChatGPT/Codex thread.

## Required read order

1. `AGENTS.md`
2. `docs/THREAD_HANDOFF.md`
3. `docs/DEVELOPMENT_DIRECTION.md`
4. `docs/WORLD_IDENTITY_AND_CONTENT_POLICY.md`
5. `docs/ROADMAP.md`
6. `docs/VERSIONING_AND_RELEASE_ROADMAP.md`
7. `docs/PLAYER_EXPERIENCE_UPGRADE_PATH.md`
8. `docs/ARCHITECTURE.md`, `docs/LOCALITY_AND_EXPLORATION_MODEL.md`, `docs/QUALITY_GATES.md`, `docs/PERFORMANCE_BUDGET.md`, `js/text/version.js`, and the systems/tests relevant to the next bounded work order.

## Workflow and pre-alpha policy

Work directly on `main` by default. Treat each prompt as a bounded work order and stop at a coherent checkpoint.

Hearth & Horizon is pre-alpha. Old local saves/accounts are not a design constraint. Prefer one clean current schema and one clear authority over compatibility-only migrations, duplicate fields, or adapter layers. This never relaxes determinism, validation, provenance, one-time ownership, content originality, acquired-knowledge privacy, or test discipline.

## Product laws

Working title: **Hearth & Horizon**. FFXI-derived material is legacy research/reference/migration material only.

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

Maps/campaign guidance represent acquired character knowledge. Fictional time is separate from wall-clock scheduling. Resources retain provenance. Companions are persistent NPC-backed people. Commitments/relationships are canonical state; Journal/readability/service/information/home opportunity models are derived presentation.

Ordinary player-facing information should describe what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, compatibility, raw state/task channels, hidden topology, and implementation rationale stay outside normal play.

## Current baseline

```text
Product:       0.8.100.2
Package:       0.8.100
Account Save:  4
Game State:    5
Data:          33
Benchmark:     1
Codename:      Home Foothold and Infrastructure
Compatibility: pre-release-current-schema
Released:      false
```

**Phases 0.4, 0.5, 0.6, and 0.7 are complete. Phase 0.8 is IN PROGRESS. The bounded `0.8.100` track remains complete; `0.8.100.2` is a closed onboarding/creator polish revision.**

Authoritative promoted runtime checkpoint:

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
Synchronize onboarding polish version contract
```

At that checkpoint:

```text
tests       505
pass        505
fail        0
skipped     0
benchmark   success
Data        33
```

Benchmark 1:

```text
1,000 player combat profiles      463.353ms  0.463353ms/op
1,000 enemy combat profiles       125.126ms  0.125126ms/op
1,000 basic attacks               551.861ms  0.551861ms/op
10,000 ticks / 5 subscribers       48.338ms  0.004834ms/op
10,000 direct route lookups      8665.221ms  0.866522ms/op
```

Exact promoted runtime workflows:

```text
Check  31994591523  SUCCESS
Pages  31994591247  SUCCESS
```

GitHub Actions project tests use Node 20.20.2. The recurring Actions-runtime Node deprecation/forced-Node-24 warning remains warning-only for `actions/checkout` / `actions/setup-node`; the project test job explicitly installs Node 20.20.2.

## Current relevant registrations

```text
versionManifest:              0.8.100.2
projects:                     0.1.0
homeInfrastructure:           0.1.0
homeStorage:                  0.3.9
characterActivity:            0.3.0
activityAdvance:              0.3.0
gameViewModels:               0.13.0
uiIntents:                    0.10.0
validation:                   0.10.0
commitments:                  0.2.0
relationships:                0.1.0
dayCycle:                     0.2.0
resourceRecoveryWork:         0.3.0
transport:                    0.2.0
transportServiceBoard:        0.1.0
settlementServiceBoard:       0.1.0
workstations:                 0.2.0
shopTransactions:             0.5.0
playerInformation:            0.1.1
playerExperience:             0.3.0
playerOpportunities:          0.2.0
playerContinuity:             0.5.0
playerCampaignReadability:    0.2.0
playerDangerRecovery:         0.2.0
domUi:                        0.10.0
domOnboarding:                0.1.0
saveRecovery:                 0.1.0
characterCreation:            0.6.0
characterCreationContent:     0.2.0
characterNames:               0.1.0
startingDisciplineKits:       0.1.0
companionCatalog:             0.2.0
party:                        0.2.0
companions:                   0.2.0
```

## Stable Phase 0.7 baseline remains closed

The multi-region playable-alpha proof remains canonical:

- Thornwall / Sera Talwin / Elderwood — `Sweetroot for Southgate`;
- Brasshaven / Marshal Varric Stone / Redstone — `Copper for the Ring`;
- Mistmere / Reader Soli Venn / Starfen — `Marrowleaf for the Ward`;
- semantic scheduled transport connects the proving communities;
- settlement return offers real work/trade/recovery/preparation/social decisions;
- acquired/current information and maps preserve hidden-topology privacy;
- danger/combat/body recovery/defeat return to the same campaign;
- Mara Venn remains one persistent NPC-backed companion with a real pre-battle field-approach choice;
- primary browser surfaces follow the character-POV presentation boundary.

Do not reopen Phase 0.7 merely because later breadth is desirable.

## `0.8.100` — Home Foothold & Infrastructure — complete

The first authored improvement is **Build a Storage Chest**:

```text
2 Resin-Sealed Hardwood Boards
1 Redstone Copper Ingot
30 minutes project labor
  -> Storage Chest furnishing
  -> home storage 3 -> 8 slots
```

`homeInfrastructureEngine` remains a bounded adapter. Generic projects own material/labor/status; inventory owns material removal and storage; world time/timed tasks own duration; furnishings own the durable capacity benefit; the Journal is derived presentation.

No second property registry, construction clock, construction-material wallet, home-only inventory, storage-capacity formula, or UI-owned economy/property state was introduced.

Original runtime checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
Benchmark 1 success
Product 0.8.100.1
Data 32
```

## `0.8.100.2` — Onboarding and character creation polish — complete

This revision responds to the first hands-on creator/onboarding walkthrough and does not open a new Phase 0.8 track.

### Themes

The active browser now exposes two palettes:

```text
Dark  -> charcoal + grayscale + slate/navy blue
Light -> silver gray + dark navy + dark gray/black
```

`css/theme.css` is loaded after the legacy stylesheet and normalizes active selection, focus, map, primary-button, and resource-meter chrome away from decorative gold/brown. Restrained red/green remain semantic danger/success cues. `js/text/ui/uiTheme.js` was aligned with the dark charcoal/navy palette for bounded canvas/reference code.

Theme preference remains account settings authority. The historical settings normalizer still accepts `highContrast`, but the active browser UI exposes only Light/Dark. Treat removal of the dormant value as optional bounded cleanup, not a reason to reopen this revision.

### Save recovery

`saveRecovery.js` is an adapter over `save.js`:

- character cards receive a top-right `×`;
- `deleteCharacterSave(id)` removes the account-registry record without decoding `encodedState`, so corrupt characters can be deleted even when `loadCharacter` rejects them;
- deletion repairs `lastCharacterId` to another character or `null`;
- Settings exposes **Clear all local data** with destructive confirmation;
- logged-out landing exposes **Reset local data** so account-registry corruption can be cleared without entering Settings;
- clear-all delegates existing `clearSave()`.

No second save/account/storage authority was added.

### Creator randomization

`characterNames.js` owns original-world ancestry/sex-aware name pools. The legacy FFXI name generator is not used.

The creator now has:

- a name die for the current ancestry/sex;
- a whole-character die that selects ancestry → valid sex → origin → starting discipline → matching name.

`characterCreationModel.randomizeCreator*` accepts injectable RNG for deterministic tests.

### Disciplines and starter gear

The six starting disciplines now expose their real level-1 differences: active attribute emphasis, resource tendency, derived combat focus, weapon/non-magic skill focus, magic skill focus, protection, play style, and starting gear.

Current kits:

```text
Vanguard     Bronze Sword + Leather Vest
Pugilist     Traveler Gloves + Leather Vest
Lifewarden   Maple Wand + Road Cloak
Elementalist Ash Staff + Road Cloak
Spellblade   Bronze Sword + Leather Vest
Shadowhand   Bronze Dagger + Road Cloak
```

Guided browser creation sets `includeStartingDisciplineKit: true`; `createNewGameState` then stores the existing equipment items through canonical inventory authority. Items begin carried and are **not auto-equipped**.

Generic `createNewGameState()` stays neutral unless that explicit option is present. This repaired the first integration attempt, which had polluted many low-level fixtures by universally granting starter inventory.

The old prompt/fast-create command adapter still uses the neutral generic path and therefore does not receive the starter kit. It is a known non-blocking transitional seam. Do not “fix” it by restoring universal starter inventory; either route it through creator options in a later bounded cleanup or leave it diagnostic.

### Authored starting narrative

`characterCreationContent.js` now owns three distinct arrival scenes:

- **Thornwall:** timber-wagon arrival, Warden Halric Dane, predatory hawker, credible introduction to Sera Talwin;
- **Brasshaven:** freight/ore arrival, predatory labor broker, Marshal Varric Stone intervenes;
- **Mistmere:** morning ferry, bogus visitor-fee runner, canal registrar directs the player to Reader Soli Venn.

Each includes one restrained discipline-aware observation. Diegetic prose no longer explains permanent-class design; the creator UI retains the non-permanent-discipline rule.

### Regression and audit trail

Primary new regressions:

- `tests/playerCreatorPolish.test.js`
- `tests/saveRecovery.test.js`

The first full integration run failed because starter gear was initially universal; this was corrected to the explicit creator-only option. A follow-up color audit found lingering gold TP/resource-meter styling and replaced it with theme-aware grayscale/navy values.

The final promoted runtime is fully green at `0f00ef68...` with 505/505 tests plus Benchmark 1.

No manual visual/browser walkthrough was performed or claimed; evidence is code/DOM/CSS regression coverage, full CI, Benchmark 1, and Pages build/deploy.

## Stable authority boundaries to preserve

- one fictional-time/task/interrupt substrate;
- generic projects as shared material + labor + completion substrate;
- continuous-character ownership of stats/capabilities/work mastery;
- semantic browser intents as normal player actions;
- command routes as optional power/diagnostic surfaces;
- acquired-knowledge privacy for maps/routes/resources/contacts/search;
- safe settlements intentionally omitting wilderness D-pad/minimap controls;
- provenance and one-time source/sink ownership;
- battle progression rewards separate from physical body recovery;
- commitments separate from relationships and both separate from Journal projection;
- scheduled transport owning fare/cadence/cargo/departure/arrival;
- service/information/onboarding views as projections/adapters only;
- production engine owning recipes/work/input/output/mastery;
- shop engine owning actual transactions and wallet changes;
- persistent NPC-backed companions with party/battle/travel responsibilities kept separate;
- furnishings/inventory owning actual home-storage capacity;
- creator starter gear entering through canonical inventory, not UI-owned loadout state;
- save recovery mutating the existing account registry, not raw storage in the UI;
- content-pack/cross-reference validation;
- clean current pre-alpha schema over compatibility-only debt.

## Known non-blocking debt

- internal `mogHouse` remains legacy terminology; player-facing copy is already original/generic;
- legacy prompt/fast-create creator bypasses the semantic creator starter-kit flag;
- account settings still normalize historical `highContrast`, while active UI offers only Light/Dark;
- broader property/workshops/agriculture/logistics/social schedules/companion breadth/earned automation remain future Phase 0.8 work;
- original currency terminology is still deferred;
- recurring GitHub action-runtime Node warning remains warning-only.

## Next work

**Do not automatically launch another Phase 0.8 track from this handoff.** A new user work order should choose one bounded life/infrastructure seam and audit the existing authority/data path before implementation.

Good candidate tracks include:

- workshop/home-production depth;
- agriculture/stewardship;
- logistics/warehousing/transport capacity;
- social schedules and relationship life;
- companion life breadth;
- earned automation.
