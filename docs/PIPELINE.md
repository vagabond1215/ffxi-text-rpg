# Development Pipeline

Use this pipeline when adding systems to the text RPG foundation.

## 1. Research intake

For every imported FFXI-like mechanic, record:

- mechanic name
- source links
- confidence level: confirmed, strongly inferred, approximate, placeholder
- implementation scope: now, later, defer
- simplification decision

## 2. Schema first

Before adding behavior, define the data shape:

- entity fields
- state ownership
- persistence concerns
- validation rules
- text output needs

## 3. Engine second

Engines should be pure or mostly pure functions:

- accept state/entity inputs
- return calculated values or mutate clearly documented state slices
- avoid DOM access
- avoid hidden globals

## 4. Command third

Expose the mechanic through text commands only after the schema and engine exist.

Command output should be readable and compact. Long detail screens should be split into targeted commands.

## 5. Tests fourth

Every new engine should get tests for:

- happy path
- boundary values
- invalid/missing data
- one regression case if replacing old behavior

## 6. Documentation fifth

Update at least one of:

- README.md for user-facing usage
- CHANGELOG.md for notable changes
- docs/ARCHITECTURE.md for structural changes
- docs/ROADMAP.md for milestone status

## 7. Migration policy

Backwards compatibility is off by default. If old data is reused, migrate it forward intentionally and document the conversion.

## 8. Pull request checklist

- [ ] No graphical dependency added to the active text runtime.
- [ ] Game logic does not touch the DOM.
- [ ] New state shape is documented.
- [ ] Tests cover the new engine or schema.
- [ ] Placeholder formulas are labeled as placeholders.
- [ ] README/changelog/roadmap updated where appropriate.
