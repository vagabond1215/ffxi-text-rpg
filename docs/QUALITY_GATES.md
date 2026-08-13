# Quality Gates

These repository-level gates supplement the current handoff and focused design authorities.

## Before implementation

- Confirm current `main` and the current handoff.
- Identify the authoritative state owner and the production caller for the requested behavior.
- Inspect focused tests and nearby persistence/runtime/UI contracts that may be affected.
- Read `docs/PERFORMANCE_BUDGET.md` and `docs/RESOURCE_LIFECYCLE.md` when the change affects repeated runtime activity, lifecycle ownership, responsiveness, or long-session stability.

## Validation

Repository entry points are:

```bash
npm test
npm run benchmark
npm run check
```

Use any stricter focused validation required by the current handoff. Report only checks that actually ran. Documentation-only administration changes do not need to pretend that local runtime checks ran.

## Persistence

Changes to persisted meaning must preserve supported saves or follow the ordered migration/version protocol. When persistence is affected, validate representative save/load and supported older-state behavior.

## Resource lifecycle

New long-lived runtime resources require a clear owner, creation condition, duplicate-prevention strategy, and cleanup behavior. Repeated scene/view changes, activity transitions, save/load, and pause/resume should not accumulate duplicate resources. See `docs/RESOURCE_LIFECYCLE.md`.

## Performance and long-session stability

Use `docs/PERFORMANCE_BUDGET.md`. The existing benchmark is required evidence for performance-sensitive work. Do not invent hard thresholds before a repeatable baseline is measured and accepted.

## UI

The semantic DOM shell is the active player interface. UI work should preserve keyboard usability, acquired-knowledge map privacy, sensible focus/navigation behavior, and separation of authoritative game state from presentation.

## Definition of done

A bounded implementation is complete when the requested production behavior is coherent, relevant validation actually ran or limitations are explicitly reported, persistence and lifecycle contracts are preserved, performance evidence is collected when material, and `docs/THREAD_HANDOFF.md` is updated when current state or immediate next work changed.
