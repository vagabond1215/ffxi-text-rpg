# Historical Development Pipeline and Milestones

> **Status: superseded.**
>
> This document previously described a formula/item-behavior-first milestone sequence after the conservative skill-gain work. That ordering is no longer authoritative.

Use these documents instead:

1. `docs/DEVELOPMENT_DIRECTION.md` — current design north star.
2. `docs/VERSIONING_AND_RELEASE_ROADMAP.md` — current product-version protocol and detailed milestones through 1.0.
3. `docs/ROADMAP.md` — current implementation summary and phase index.
4. `docs/THREAD_HANDOFF.md` — current repo handoff and next implementation sequence.

The original content remains available in git history if the formula-confidence, skill-hook, combat UX, spell-catalog, item-behavior, key-item, San d'Oria interaction, Mog House, or quest-state planning notes need to be recovered.

## What remains valid from the old plan

The following engineering policies still apply:

- start implementation work from current `main` unless deliberately stacking a planning branch;
- keep one primary gameplay/system goal per PR;
- inspect current repo state before editing;
- prefer small modules/helpers over broad rewrites;
- keep formulas confidence-labeled;
- add/update tests in the same PR as runtime behavior changes;
- update docs and version metadata when behavior changes;
- run the standard gate when runtime code changes:

```text
npm.cmd test
npm.cmd run benchmark
npm.cmd run check
git diff --check
```

- report branch, PR, commit, changed files, version impact, checks, known limitations, and working-tree status;
- connector-only work should remain planning/docs/metadata/review unless explicit runtime writes are requested.

## What changed

The project direction now prioritizes a cohesive long-form life/adventure game over formula reconstruction as the roadmap spine.

Major new priorities include:

- ordered persistence migrations;
- deterministic simulation time separate from wall-clock time;
- pause/fast-forward/end-of-day review;
- canonical timed tasks and persistent projects;
- jobs as disciplines/classifications rather than magical active states;
- learned capabilities with logical equipment/preparation prerequisites;
- origins and starting circumstances;
- a first livelihood loop;
- the **A Week Beyond the West Gate** representative vertical slice;
- construction/infrastructure, relationships, taming, crafting, and logistics;
- later combat/magic/content hardening toward 1.0.

Formula confidence, skill application, item behavior, key items, quests, Mog House, combat UX, and magic remain relevant systems; they are now scheduled where they best support the player-facing release milestones instead of leading the release sequence by themselves.
