# Transitional Architecture

This document records **only remaining temporary seams**. Current runtime authority is `docs/ARCHITECTURE.md`; product direction is `docs/DEVELOPMENT_DIRECTION.md`; schema/release policy is `docs/VERSIONING_AND_RELEASE_ROADMAP.md`.

The maintenance train through Product `0.8.600.7` retired several former transitions: FFXI runtime command compatibility, automatic old-save migration, inherited home/container identifiers, ambiguous version aliases, and ActionResult `.message`/`.reason` compatibility are no longer active seams.

## Discipline/job state remains partly transitional

Current player state still contains `player.jobs` fields used by progression, some equipment eligibility, and internal historical naming. They are not the final definition of character capability.

Durable rule:

```text
Disciplines describe.
Capabilities enable.
Loadouts and preparation constrain and enhance.
```

New permanent action eligibility should prefer character-owned learned capabilities/proficiency plus equipment, tools, resources, status, preparation, and context. Do not deepen magical active-class transformation as a final design assumption.

## Historical/internal terminology

Some internal APIs/data modules still retain historical names such as `jobs`, `races`, or `nations` even when player-facing content is original-world. Treat these as bounded implementation vocabulary, not permission to restore inherited world identity.

Refactor them only when a bounded change improves authority clarity or removes real coupling; do not mass-rename working internal identifiers solely for cosmetic uniformity.

## Research/reference boundary

Legacy FFXI-derived datasets may remain as research/reference evidence. They must not:

- become canonical player-facing names/content;
- define new stable runtime IDs by inheritance;
- create automatic compatibility requirements;
- bypass original-world content validation.

The retired FFXI command adapter/runtime macro-reference modules must remain deleted; `tests/architectureDebtGuard.test.js` protects that boundary.

## Persistence boundary

Current persistence is strict pre-alpha current-schema only:

```text
Account Save == current version
Game State   == current version + complete required structure
encoding     == base64-json-v1
otherwise    -> reject
```

`reviveGameState()` restores current-schema reference identity/metadata only after structural acceptance. Runtime `ensure*` helpers are not implicit save migrations.

`migrationEngine.js` remains a generic utility for a future deliberate migration requirement. No active automatic save-migration layer exists.

## Remaining breadth transitions

These are design/evolution seams rather than compatibility obligations:

- some equipment/progression rules still consume internal discipline/job fields while capability-based eligibility expands;
- enemy tactical breadth is representative rather than deep;
- NPC schedules are static-location recurring availability, not autonomous pathfinding;
- broad quest/romance/social-life systems remain shallower than their long-term design;
- home/property systems prove storage/workshop/logistics but do not yet implement agriculture/stewardship/earned automation;
- regional content breadth and balance remain pre-alpha rather than release-scale;
- long-session lifecycle/performance evidence should be expanded before release hardening.

## Rule for removing a transition

Remove a transitional seam when:

1. its canonical replacement already exists;
2. production callers can consume that replacement directly;
3. persistence/data consequences are explicit;
4. focused regression coverage proves the removal;
5. no second authority or compatibility mirror is introduced.

Prefer deletion over permanent adapter layers once those conditions are true.
