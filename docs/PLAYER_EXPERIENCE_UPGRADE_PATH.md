# Player Experience Upgrade Path

This document records the player-facing upgrade path that closed Phase 0.7 and now guides bounded Phase 0.8 life/infrastructure work. It is ordered by what a normal player must understand and accomplish, not by how many underlying engines exist.

## Player promise

A new player should be able to answer these questions from normal browser play:

1. **Who am I, and what was I trained to do?** — ancestry, sex, origin, and starting discipline communicate concrete level-1 differences without pretending the discipline is a permanent class.
2. **Why am I here?** — the character has an origin-specific arrival circumstance and a credible first local connection.
3. **What should I do next?** — the game presents one clear first contact and then several small, non-exclusive ambitions.
4. **How does progress work?** — actions connect effort to persistent mastery, efficiency, capability, preparation, knowledge, relationships, or infrastructure.
5. **Why would I leave town?** — nearby regions contain work, resources, danger, people, and knowledge that feed back into the character's life.
6. **Why would I return?** — settlements convert what the character earned into recovery, trade, processing, equipment, training, social continuity, and larger ambitions.
7. **What do I know and have ready?** — preparation, learned abilities/capabilities, acquired world knowledge, and useful local options are inspectable without command vocabulary.
8. **Who is traveling with me?** — an active companion is a persistent person whose preparation, condition, and choices matter beyond a single combat effect.
9. **Why improve a home or foothold?** — regional materials and fictional labor can become durable preparation advantages that reduce the burden of future journeys.

The intended loop remains:

```text
effort -> mastery -> efficiency -> capability -> larger ambition
```

No onboarding or convenience layer may create a parallel quest clock, hidden teleport graph, omniscient map/index, duplicate progression counter, duplicate economy, construction currency, property timer, or reward path that bypasses provenance.

## Pre-alpha implementation rule

Player-experience work targets the clean current model. Old local-save compatibility is not a design requirement. Prefer one explicit authority, keep derived values derived, and version real contract changes deliberately.

# Completed Phase 0.7 sequence

## PX-1 — Arrival and footing

**Implemented and audited.** The current opening now improves on the original Phase 0.7 proof: each origin has a distinct present-world arrival scene, a named first intermediary/contact, a believable pointer toward the origin guide, and one discipline-sensitive observation. The rule that a starting discipline is not a permanent class remains visible in character creation rather than being spoken by the narrator inside the fiction.

## PX-2 — First-day actionable opportunities

**Implemented and audited.** The Journal projects real livelihood, training/danger, exploration/travel, and settlement/service preparation. All three origins can claim and equip a real starter field tool through semantic actions.

## PX-3 through PX-9

**Implemented and audited.** The Phase 0.7 campaign proof covers Redstone gathering/production/mastery, several-day commitment and relationship continuity, multi-region acquired-knowledge readability, combat/recovery/defeat continuity, Mistmere/Starfen and Thornwall/Elderwood community breadth, and semantic scheduled transport among the proving communities.

`0.7.100` closed at Product `0.7.100.1`; later Phase 0.7 tracks added settlement economy/service depth, semantic information access/locality usability, and companion/POV depth.

# `0.7.200` — Settlement service and economy depth

**Implemented, audited, and closed.**

The active Craft surface became **Work, Trade & Recover**. `settlementServiceBoardEngine` derives actual workshop, production, merchant, wallet, work-mastery, and recovery decisions from existing authorities. A Brasshaven/Redstone proof turns gathered ore into a process-vs-sell decision, persistent mastery/efficiency, finished-goods trade, preparation purchase, optional safe recovery, and save/load continuity.

# `0.7.300` — Semantic information access and locality usability

**Implemented, audited, and closed.**

`playerInformationEngine` exposes only accessible carried/equipped preparation, effective skills, character-owned capabilities, learned abilities, acquired maps, visited places, discovered contacts/POIs, and currently actionable safe-locality choices. Character, Spellbook, Codex, World, and the omnibox no longer require command vocabulary for ordinary information decisions.

# `0.7.400` — Companion life, party depth, and character POV

**Implemented, audited, and closed.**

Mara Venn remains one persistent NPC-backed character. Her field approach survives real account save/load and travel and changes derived battle-entry behavior without rewriting permanent attributes.

The carried-forward character-POV rule is:

> Ordinary character-facing information should tell the player what the character **sees, knows, carries, remembers, needs, or can decide**. Architecture, roadmap, compatibility, raw state channels, hidden topology, and implementation rationale stay outside normal play.

Phase 0.7 closes at Product `0.7.400.1`; later shared-authority revisions do not reopen it.

# Phase 0.8 — Life and infrastructure expansion — in progress

Phase 0.8 must deepen the persistent-life loop without turning the game into disconnected management menus. New property, workshop, agriculture, logistics, social-life, companion-life, and automation features must consume or extend real world resources, fictional time, skills, relationships, locations, and existing persistent authorities.

# `0.8.100` — Home Foothold & Infrastructure

**Implemented, audited, and closed.**

The first improvement, **Build a Storage Chest**, reuses existing Elderwood/Redstone material chains plus canonical project labor:

```text
2 Resin-Sealed Hardwood Boards
1 Redstone Copper Ingot
30 minutes hands-on labor
  -> Storage Chest furnishing
  -> +5 furnishing-storage slots
```

A fresh character's existing furnishings provide 3 storage slots; completing the chest raises capacity to 8. The Journal exposes a semantic Plan → Set aside materials → Start work → Finish sequence. Project, inventory, timed-task, furnishing, and save/load authorities remain canonical.

Original promoted checkpoint:

```text
0b9251a43285443087050127da36b977cabdf7ee
496/496 tests
Benchmark 1 success
Product 0.8.100.1
Data 32
```

# `0.8.100.2` — Onboarding and character-creation polish

**Implemented, audited, and closed as a revision of `0.8.100`.**

## Theme/readability repair

The active browser now has two deliberate visual modes:

- **Dark:** charcoal gray surfaces, grayscale text/chrome, dark/slate blue emphasis.
- **Light:** silver-gray surfaces, dark navy emphasis, dark gray/black text.

The follow-up audit removed remaining decorative gold/brown selection and resource-meter chrome. Red/green remain only where a restrained semantic danger/success cue is useful. Theme preference continues to live in account settings.

The historical settings normalizer can still accept `highContrast`, but the active browser UI intentionally exposes only Light and Dark. Removing that dormant compatibility value is later cleanup, not part of this player-facing repair.

## Save recovery

Character selection now provides a small top-right `×` per save. The deletion path operates on the account-registry record ID and therefore works even when the encoded character state is corrupt and cannot be loaded or migrated.

Settings also exposes **Clear all local data** with destructive confirmation. A logged-out **Reset local data** path remains available if account-registry corruption prevents normal settings access.

Deletion/clearing reuse the existing save/account layer and do not create a second persistence system.

## Random character creation

The Name field has a die for a canonical original-world name appropriate to the currently selected ancestry and sex. A second die randomizes the whole character: ancestry → valid sex → origin → starting discipline → matching name.

The canonical randomizer accepts injected RNG so validity is deterministic in tests. The old legacy FFXI name generator is not reused.

## Disciplines now explain a real level-1 choice

The existing concise discipline buttons/descriptions remain, but the selected discipline now exposes real canonical differences:

- active attribute emphasis;
- starting HP/MP tendency where the current discipline context provides one;
- combat-derived focus;
- weapon/non-magic skill focus;
- magic skill focus;
- protection style;
- play style;
- actual starting gear.

The six current starter kits are:

| Discipline | Starting gear |
| --- | --- |
| Vanguard | Bronze Sword + Leather Vest |
| Pugilist | Traveler Gloves + Leather Vest |
| Lifewarden | Maple Wand + Road Cloak |
| Elementalist | Ash Staff + Road Cloak |
| Spellblade | Bronze Sword + Leather Vest |
| Shadowhand | Bronze Dagger + Road Cloak |

Guided browser creation places these items into canonical carried inventory. They are **not auto-equipped**. That gives the new player an immediate preparation/equipment decision and keeps equipment authority explicit.

Generic low-level `createNewGameState()` remains empty unless the creator-specific option is supplied. The older prompt/fast-create command adapter still uses that neutral generic path; it is transitional debt and should not be “fixed” by making every new-game fixture receive starter gear.

## Authored introductions

The previous generic opening template has been replaced with three distinct authored scenes:

### Thornwall

The character reaches Southgate on a timber wagon after dawn, sees wet forest-road traffic and gate congestion, is checked against the newcomer roll by **Warden Halric Dane**, and watches Dane chase off a hawker selling an overpriced “essential road bundle.” Dane gives a concrete reason to seek **Sera Talwin**.

### Brasshaven

The character arrives with a freight caravan among ore wagons and foundry haze. A labor broker tries to turn the newcomer into an easy sale before **Marshal Varric Stone** intervenes and points them toward legitimate Market Ring footing.

### Mistmere

The character arrives by morning ferry among wet canal steps, herb sellers, students, kitchens, and civic magic. A runner tries to charge a bogus visitor fee before a canal registrar points the character toward **Reader Soli Venn**.

Each scene adds one short discipline-aware observation—weapon posture, balance, injury, elemental/magical detail, steel/ward-work, or sightlines/watchers—without branching into six separate novels.

Diegetic prose no longer explains “permanent class” design rules. That information remains in the creator UI, where the player needs it.

## Regression/audit proof

`tests/playerCreatorPolish.test.js` verifies original names, deterministic whole-character randomization, truthful six-discipline previews, creator-scoped starter kits, carried-not-equipped gear, distinct origin scenes, and the two-theme contract.

`tests/saveRecovery.test.js` verifies deletion of a deliberately corrupt encoded character, last-character fallback, deletion of the only character, and account-wide clear-all behavior.

The first integration run intentionally exposed a bad implementation choice: universal starter inventory polluted many low-level tests. That was repaired at the authority boundary by making the kit creator-specific. The follow-up palette audit also caught old gold TP/meter chrome and replaced it with theme-aware grayscale/navy values.

Authoritative promoted checkpoint:

```text
0f00ef68a01ad001063803d67ff0efffc48ab3ef
505/505 tests
0 failed
0 skipped
Benchmark 1 success
Product 0.8.100.2
Package 0.8.100
Data 33
Account Save 4
Game State 5
```

Benchmark 1:

```text
player combat profiles  0.463353 ms/op
enemy combat profiles   0.125126 ms/op
basic attacks            0.551861 ms/op
tick dispatch            0.004834 ms/op
direct route lookup      0.866522 ms/op
```

This evidence includes code/DOM/CSS regressions, full CI, Benchmark 1, and Pages build/deploy. No manual visual-browser walkthrough is claimed.

## Next Phase 0.8 boundary

`0.8.100` remains complete, but Phase 0.8 is not. Do **not** automatically launch another property/farming/automation expansion from this revision. A new bounded work order should first select and audit one existing seam, such as workshop/home-production depth, agriculture/stewardship, logistics, social schedules/relationship life, companion life breadth, or earned automation.

## Architecture rule carried forward

Player-experience guidance, service boards, information/search, home opportunity models, onboarding helpers, and similar presentation layers are projections/adapters over canonical state, not second simulation authorities. Projects, commitments, relationships, party state, recovery tasks, transport journeys, inventory, production, shops, resource opportunities, fictional time, wallet ownership, and furnishing/storage capacity remain in their domain systems.
