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

The hosted `Check` gate runs on Node 24 LTS. `package.json` requires Node `>=24`. The workflow uses current supported GitHub Actions majors and includes cancellation plus a bounded job timeout.

`tests/architectureDebtGuard.test.js` protects selected canonical runtime seams from reintroducing compatibility debt removed during the `0.8.600.3`–`.7` maintenance train.

Use any stricter focused validation required by the current handoff. Report only checks that actually ran. Documentation-only administration changes do not need to pretend that runtime checks ran.

## Persistence

Current mode is **pre-alpha current-schema only**.

- Account/session payloads must match the current Account Save contract exactly.
- Character payloads must match the current Game State version and contain the complete required persisted structure before revival/reference relinking.
- Incompatible or incomplete pre-alpha saves are rejected rather than lazily reconstructed or migrated by default.
- A future migration is deliberate engineering work only when explicitly required or independently useful; the generic migration utility may remain without making migration automatic.
- Any change to current persisted meaning requires a deliberate Game State/Account Save version decision and representative current save/load validation.

## Resource lifecycle

New long-lived runtime resources require a clear owner, creation condition, duplicate-prevention strategy, and cleanup behavior. Repeated scene/view changes, activity transitions, save/load, and pause/resume should not accumulate duplicate resources. See `docs/RESOURCE_LIFECYCLE.md`.

## Performance and long-session stability

Use `docs/PERFORMANCE_BUDGET.md`. The existing benchmark is required evidence for performance-sensitive work. Do not invent hard thresholds before a repeatable baseline is measured and accepted.

## UI and adapter boundaries

The semantic DOM shell is the active player interface. UI work should preserve keyboard usability, acquired-knowledge map privacy, sensible focus/navigation behavior, and separation of authoritative game state from presentation.

Canonical `ActionResult` consumers use `ok`, `action`, `code`, `outcome`, `data`, and `display`; do not restore `.message`/`.reason` compatibility aliases. Command and UI adapters may render semantic results, but they must not become domain authorities.

## Definition of done

A bounded implementation is complete when the requested production behavior is coherent, relevant validation actually ran or limitations are explicitly reported, persistence and lifecycle contracts are preserved, performance evidence is collected when material, architecture-debt guardrails remain green, and `docs/THREAD_HANDOFF.md` is updated when current state or immediate next work changed.
