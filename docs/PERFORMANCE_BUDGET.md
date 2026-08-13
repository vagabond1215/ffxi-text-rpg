# Performance Budget

Use `npm run benchmark` for performance-sensitive changes.

Current rules:

- Record repeatable baselines before adopting hard numeric thresholds.
- Compare like-for-like environments and representative fixtures.
- Preserve correctness, deterministic simulation, save compatibility, and player behavior while optimizing.
- Prioritize simulation advancement, action resolution, map/view-model derivation, save/load, content validation, UI rendering, and representative long-session behavior.
- Treat cumulative resource growth as a lifecycle problem when repeated use does not return toward a stable application-owned state.

When a dedicated performance or long-session harness is accepted, document its fixture, environment, normal variance, and per-surface budgets here, then use those accepted budgets in CI or release readiness.
