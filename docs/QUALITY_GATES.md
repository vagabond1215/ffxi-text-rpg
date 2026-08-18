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
npm run benchmark:sample
npm run hardening
npm run check
```

The hosted `Check` gate runs on Node 24 LTS. `package.json` requires Node `>=24`. The workflow uses current supported GitHub Actions majors and includes cancellation plus a bounded job timeout.

`tests/architectureDebtGuard.test.js` protects selected canonical runtime seams from reintroducing compatibility debt and now also guards the exact direct timed-task owner set plus removal of runtime legacy active-travel reconstruction.

Use any stricter focused validation required by the current handoff. Report only checks that actually ran. Documentation-only synchronization does not create a new runtime validation checkpoint.

## Persistence

Current mode is **pre-alpha current-schema only**.

- Account/session payloads must match the current Account Save contract exactly.
- Character payloads must match the current Game State version and contain the complete required persisted structure before revival/reference relinking.
- Raw current-schema validation must run before runtime `ensure*` helpers can normalize state.
- Persisted registries that have been declared required and whose validator is part of the current raw boundary must satisfy that validator before revival.
- The current task boundary validates the timed-task registry and active travel/project/work/timed-ability/resource-recovery task links.
- Active owner/task links may reference active or just-completed tasks until owner reconciliation; terminal owner records may retain historical `taskId` after terminal task release.
- Missing, malformed, mismatched, or legacy-shaped active task/travel state is rejected rather than reconstructed.
- Incompatible or incomplete pre-alpha saves are rejected rather than lazily reconstructed or migrated by default.
- A future migration is deliberate engineering work only when explicitly required or independently useful; the generic migration utility may remain without making migration automatic.
- Any change to current persisted meaning requires a deliberate Game State/Account Save version decision and representative current save/load validation.

When tightening raw validation for another registry, first classify its state:

1. **persistent required authority** — validate before revival;
2. **derived/transient** — recompute freely;
3. **construction convenience** — initialize in new-state/factory paths, not as implicit load migration.

Do not convert historical lazy-initialization behavior into current save compatibility by accident.

## Resource lifecycle

New long-lived runtime resources require a clear owner, creation condition, duplicate-prevention strategy, and cleanup behavior. Repeated scene/view changes, activity transitions, save/load, and pause/resume should not accumulate duplicate resources. See `docs/RESOURCE_LIFECYCLE.md`.

For timed tasks specifically, a new direct production task creator must define its durable consequence, exactly-once reconciliation point, and terminal release responsibility. The architecture guard currently admits only the six audited task-owner modules.

## Performance and long-session stability

Use `docs/PERFORMANCE_BUDGET.md`. Benchmark 3 and repeated sampling are required evidence for performance-sensitive work. Do not invent hard thresholds before a repeatable baseline is measured and accepted.

Lifecycle-sensitive work should preserve the deterministic long-session smoke and owner-managed zero-retained-task steady-state evidence.

## UI and adapter boundaries

The semantic DOM shell is the active player interface. UI work should preserve keyboard usability, acquired-knowledge map privacy, sensible focus/navigation behavior, and separation of authoritative game state from presentation.

Canonical `ActionResult` consumers use `ok`, `action`, `code`, `outcome`, `data`, and `display`; do not restore `.message`/`.reason` compatibility aliases. Command and UI adapters may render semantic results, but they must not become domain authorities.

## Definition of done

A bounded implementation is complete when the requested production behavior is coherent, relevant validation actually ran or limitations are explicitly reported, persistence and lifecycle contracts are preserved, performance evidence is collected when material, architecture-debt guardrails remain green, and `docs/THREAD_HANDOFF.md` is updated last when current state or immediate next work changed.
