# Development Pipeline and Milestone Roadmap

This document captures the connector-safe planning pass for the text RPG rebuild after the San d'Oria coordinate/navigation work, item behavior/selling foundation, and conservative skill-gain hook merge.

It is intentionally planning-only. It does not change runtime code, tests, data, versions, or save shape.

## Current baseline

At the time this plan was updated, `main` is expected to be at the post-PR-293 baseline:

- App/package: `0.4.4`
- Codename: `Conservative Skill Gains`
- Game State: `3`
- Data: `13`
- `itemBehavior: 0.1.0`
- `itemInspection: 0.5.1`
- `shops` / `shopTransactions: 0.3.8`
- `skillProgression: 0.5.2`
- `combatActions: 0.5.1`

Completed foundation:

- PR #293, `codex/conservative-skill-gain-hooks`, merged deterministic skill-gain hooks into `main`.
- Basic attacks, placeholder weapon skills, and placeholder spell casts can now gain conservative learned skill while keeping damage, accuracy, magic potency, enemy AI, and item behavior formulas unchanged.

Next active planning target:

- Formula confidence planning should define how learned/effective skill, skill caps, stats, and item behavior metadata may safely enter formulas without claiming exact retail behavior.

## Delivery pipeline

Every implementation PR should follow this sequence:

1. Start from current `main` unless explicitly creating a stacked planning branch.
2. Keep one primary gameplay/system goal per PR.
3. Inspect the current repo state before editing.
4. Avoid broad rewrites when a small module or helper can isolate the change.
5. Keep formulas conservative and confidence-labeled.
6. Add or update tests in the same PR as runtime behavior changes.
7. Update docs and version metadata when behavior changes.
8. Run the standard gate locally or through Codex:
   - `npm.cmd test`
   - `npm.cmd run benchmark`
   - `npm.cmd run check`
   - `git diff --check`
9. Report:
   - branch name
   - PR number/link
   - final commit SHA
   - changed files
   - version bump
   - test count and check results
   - known limitations
   - working-tree status

Connector-only passes should remain docs, planning, metadata, issue/PR triage, or review-only unless the user explicitly approves a write such as closing stale PRs or opening a planning PR.

## Merge gates

A PR should not be merged until all relevant gates are satisfied.

### Runtime PR gate

- Local/Codex tests pass.
- Benchmark passes.
- Static check passes.
- Whitespace check passes.
- Version metadata matches the PR body.
- ROADMAP and THREAD_HANDOFF reflect the new repo state.
- Known limitations are stated in the PR body.

### Docs-only PR gate

- No runtime files changed.
- No version bump unless the docs change is part of a release/documentation sync policy.
- No test run required, but the PR body should state that it is docs-only.
- The doc must not claim runtime behavior that has not merged.

### Connector-only gate

- Prefer read-only inspection first.
- Mutating actions must be low-risk and explicit: create a planning branch, add a planning doc, comment on a PR, close a superseded PR, or open a draft/planning PR.
- Do not merge implementation PRs through connector-only review if local/Codex verification has not been reported.

## Milestone 0: conservative skill-gain hooks (completed)

Status: completed by PR #293.

Goal: merge deterministic skill-gain hooks after local/Codex verification.

Delivered foundation:

- Basic attacks infer and gain main-hand weapon skill.
- Weapon skills gain the main-hand weapon skill once.
- Cure-like placeholder casts gain `healingMagic`.
- Offensive placeholder casts gain `elementalMagic`.
- Skill gain clamps to the current job cap.
- Capped skills do not spam battle-log gain messages.
- Damage, accuracy, magic potency, enemy AI, and item behavior formulas remain unchanged.

Merged version target:

- App/package: `0.4.4`
- Codename: `Conservative Skill Gains`
- `skillProgression: 0.5.2`
- `combatActions: 0.5.1`

Completion gate:

- PR #293 merged into `main`.
- `main` version metadata matches the PR body.
- Learned/effective skill values remain intentionally unused by damage, accuracy, magic potency, enemy AI, and item behavior formulas until a later formula-confidence pass.

## Milestone 1: formula confidence planning

Suggested branch: `planning/formula-confidence-and-skill-application`

Goal: define how skill caps, learned/effective skill, stats, and item behavior metadata can safely enter formulas without pretending placeholder math is exact retail behavior.

Deliverables:

- Add a planning document for formula confidence and skill application.
- Define confidence tiers:
  - exact / sourced
  - researched approximation
  - intentional simplification
  - placeholder
- Define the first safe formula integration points:
  - main-hand skill contribution to physical accuracy or attack
  - magic skill contribution to magic accuracy or potency
  - defensive skill hooks later
- Define boundaries:
  - no retail-exact formula claim without source notes
  - no random skill-up pacing until RNG policy is explicit
  - no latent/enchantment/charge behavior application until semantics are explicit

Exit gate:

- Planning doc merged.
- ROADMAP points to a small next implementation pass, not a broad combat rewrite.

## Milestone 2: conservative skill formula hooks

Suggested branch: `codex/skill-caps-combat-formula-hooks`

Goal: allow effective learned skill to influence one or two conservative formula outputs in a small, testable way.

Deliverables:

- Add or extend a formula helper module rather than scattering math through command handlers.
- Use effective skill, not raw over-cap learned skill.
- Keep current job cap clamping explicit.
- Add confidence/source notes in formula descriptions.
- Keep formula changes deliberately small.

Candidate first hooks:

- main-hand effective skill contributes to physical accuracy scaffold
- magic effective skill contributes to magic accuracy/potency scaffold

Non-goals:

- no weapon-skill unlock tables
- no full magic database
- no enemy AI expansion
- no exact FFXI formula claim
- no item behavior application yet

Exit gate:

- Tests prove capped effective skill is used.
- Tests prove over-cap learned skill does not overboost formulas.
- Existing combat and reward tests remain stable.

## Milestone 3: combat UX hardening

Suggested branch: `codex/combat-targeting-and-recovery`

Goal: improve the moment-to-moment battle loop before deeper AI, magic, or formula work.

Deliverables:

- Target selection improvements.
- Clear invalid-target messages.
- Multi-enemy target list display.
- Simple rest/recovery flow outside battle.
- Death/KO placeholder flow.
- Battle-end cleanup and inspectability.

Non-goals:

- no full enemy AI system
- no trust AI
- no spell database
- no formula overhaul

Exit gate:

- Tests cover invalid target, valid target selection, KO state, rest blocked in battle, and rest allowed outside battle.

## Milestone 4: spell catalog scaffold

Suggested branch: `codex/spell-catalog-scaffold`

Goal: replace placeholder spell-name inference with structured spell records.

Deliverables:

- Add a minimal spell catalog.
- Define spell fields:
  - id
  - name
  - skill
  - element
  - mp cost
  - target type
  - effect type
  - cast time placeholder
  - recast placeholder
  - confidence/source metadata
- Route `cast Cure` and `cast Fire` through catalog entries.
- Keep effects conservative and close to current behavior.

Non-goals:

- no full magic database
- no cast-time tick integration yet
- no recast timers yet
- no interruption rules yet

Exit gate:

- Existing cast behavior remains stable.
- Skill gain uses catalog spell skill where present.
- Placeholder fallback is still safe or explicitly removed with tests.

## Milestone 5: item behavior application planning

Suggested branch: `planning/item-behavior-application`

Goal: define how latent effects, enchantments, charges, ranged/ammo, and item flags will move from metadata-only inspection into runtime.

Deliverables:

- Categorize item behavior types:
  - passive always-on modifiers
  - conditional latent modifiers
  - activated enchantments
  - charge and cooldown state
  - ranged/ammo consumption
  - restricted trade/sell/drop behavior
- Define runtime state shape before implementation.
- Define validation requirements.
- Define formula and action touchpoints.

Non-goals:

- no runtime item behavior application in the planning PR
- no combat formula rewrites
- no economy expansion

Exit gate:

- Clear next implementation PR is scoped to one item behavior category only.

## Milestone 6: key items and unlock flags

Suggested branch: `codex/key-items-and-progression-flags`

Goal: add the missing unlock substrate for maps, travel restrictions, trusts, missions, quests, and permissions.

Deliverables:

- Key item schema.
- Player key item storage.
- Key item inspection output.
- Validation for key item records.
- Unlock/permission helpers.
- Tests for adding, checking, and validating key items.

Non-goals:

- no full quest database
- no mission progression
- no trust implementation

Exit gate:

- Travel/zone/item restriction scaffolds can reference key item helpers safely.

## Milestone 7: San d'Oria interaction nodes

Suggested branch: `codex/sandoria-interaction-nodes`

Goal: make San d'Oria feel interactive through compact nodes instead of unnecessary full interiors.

Deliverables:

- Improve `here`, `look`, `talk`, `shop`, `guild`, and `quest` affordances at important San d'Oria coordinates.
- Add compact interaction nodes for shops, guilds, inns, gates, Mog House access, and civic points.
- Improve exit prompts.
- Keep full interiors for locations that have meaningful gameplay use.

Non-goals:

- no full city expansion outside San d'Oria
- no unnecessary building interiors
- no broad POI rewrite

Exit gate:

- San d'Oria movement remains stable.
- POI discovery and shop/guild hooks remain stable.

## Milestone 8: Mog House as a real place

Suggested branch: `codex/mog-house-place`

Goal: replace temporary boolean Mog House access with a real place/interior.

Deliverables:

- Mog House place definition.
- Entry and exit flow from city coordinate.
- Storage access tied to being inside Mog House.
- Tests for storage access transitions.
- Documentation update for the new place model.

Non-goals:

- no furniture placement system
- no full housing customization
- no auction house/economy work

Exit gate:

- Storage access is location-driven instead of boolean-only.

## Milestone 9: quest state foundation

Suggested branch: `codex/quest-state-foundation`

Goal: add a minimal quest state machine after key item and POI foundations are ready.

Deliverables:

- Quest database scaffold.
- Quest state machine:
  - unavailable
  - available
  - active
  - readyToTurnIn
  - completed
  - repeatableCooldown
- Objective types:
  - talk
  - kill
  - collect
  - travel
  - inspect
- Reward types:
  - EXP
  - gil
  - items
  - key items
  - titles/flags placeholders

Non-goals:

- no complete nation mission chain
- no reputation/fame economy
- no large quest content dump

Exit gate:

- One tiny sample quest works end-to-end with tests.

## Near-term recommended order

1. Add formula confidence planning.
2. Implement conservative skill formula hooks.
3. Harden combat UX.
4. Add spell catalog scaffold.
5. Plan item behavior application.
6. Add key item/unlock substrate.
7. Improve San d'Oria interaction nodes.
8. Replace Mog House access flag with a real place.
9. Start quest state foundation.

## Branch naming conventions

Use one of these prefixes:

- `codex/` for runtime implementation
- `planning/` for connector-safe planning docs
- `docs/` for documentation syncs without new planning scope
- `fix/` for narrow bug fixes
- `test/` for test-only hardening

## Versioning guidance

- Patch bump for small runtime behavior changes.
- No app version bump for planning-only docs unless a release/documentation policy requires it.
- Bump specific system versions only when that system's runtime behavior or public output changes.
- Keep `gameState` and `data` stable unless save shape or data schema changes.

## Current risks

- Multiple open branches touching docs can conflict. Keep planning docs in standalone files when another implementation PR is open.
- Formula work can become too broad; keep the first formula PR intentionally small.
- Skill cap data remains placeholder; any formula use must be described as scaffold behavior.
- Item behavior metadata should not enter combat until activation, state, and validation rules are explicit.
- Connector-only PRs cannot prove runtime tests pass; report that limitation plainly.
