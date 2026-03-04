# AI-Friendly Roadmap

This document is a practical map for contributors and coding agents working in `CentaurTechnicalIndicators-JS`.

## How to use this roadmap

- `Now`: high-confidence, near-term items that improve contributor and agent reliability.
- `Next`: medium-term items that build on completed `Now` work.
- `Later`: directional items that should not block current PRs.
- Each milestone includes acceptance criteria and non-goals to keep the implementation scope clear.

## Current API surface by module

This repository provides WASM bindings that wrap the `centaur_technical_indicators` Rust crate. Indicators are exposed via three JS entry points (`index.node.js`, `index.js`, `index.web.js`) and typed via `index.d.ts`.

Indicator namespaces currently exported:

- `candleIndicators.single` / `candleIndicators.bulk`: candle-derived indicators.
- `chartTrends`: peak/valley and trend-structure analysis.
- `correlationIndicators.single` / `correlationIndicators.bulk`: pairwise/statistical relationship indicators.
- `momentumIndicators.single` / `momentumIndicators.bulk`: momentum and oscillator families.
- `movingAverage.single` / `movingAverage.bulk`: core moving-average implementations.
- `otherIndicators.single` / `otherIndicators.bulk`: miscellaneous indicators.
- `strengthIndicators.single` / `strengthIndicators.bulk`: strength/volume participation indicators.
- `trendIndicators.single` / `trendIndicators.bulk`: trend direction/strength systems.
- `volatilityIndicators.single` / `volatilityIndicators.bulk`: volatility and range-expansion indicators.

Rust WASM binding source modules in `src/`:

- `lib.rs`: central enums and module exports.
- `candle_indicators.rs`: candle pattern indicator bindings.
- `chart_trends.rs`: peak/valley analysis bindings.
- `correlation_indicators.rs`: statistical correlation bindings.
- `momentum_indicators.rs`: RSI, Stochastic, and related bindings.
- `moving_average.rs`: moving average function bindings.
- `other_indicators.rs`: miscellaneous indicator bindings.
- `strength_indicators.rs`: volume-based indicator bindings.
- `trend_indicators.rs`: trend indicator bindings.
- `volatility_indicators.rs`: volatility indicator bindings.

## Testing/validation expectations

Before opening a PR, contributors should run and report:

1. `cargo fmt --check`
2. `cargo clippy`
3. `npm run build`
4. `node --test`

Testing guidance:

- Add or adjust tests in `test/` as the implementation changes.
- Prefer deterministic tests with explicit expected values (parity with Rust reference).
- Do not weaken or remove unrelated assertions to make a change pass.

## Contributor workflow roadmap

### Now

1. **PR quality report standardization**
   - Goal: all AI/human PRs present the same validation summary shape.
   - Acceptance criteria:
     - `AGENTS.md` defines a required PR summary format.
     - PR descriptions consistently include `Summary`, `Scope`, `Compatibility`, `Validation`, and `Changelog`.
   - Non-goals:
     - Enforcing via CI in this milestone.
2. **Repository orientation map**
   - Goal: reduce onboarding/search time for contributors and agents.
   - Acceptance criteria:
     - `docs/REPO_MAP.md` with key directories, extension points, and "if changing X, also check Y" guidance.
   - Non-goals:
     - Exhaustive architecture documentation.
3. **Machine-readable contribution policy**
   - Goal: enable deterministic checks by automation/bots.
   - Acceptance criteria:
     - `ai-policy.yaml` listing required checks and user-facing change obligations.
   - Non-goals:
     - Full custom policy engine implementation.

### Next

1. **CI guardrails for contribution policy**
   - Goal: make contributor requirements executable rather than advisory.
   - Acceptance criteria:
     - CI checks for `CHANGELOG.md` updates on user-facing changes.
   - Non-goals:
     - Complex policy engines.
2. **Indicator registry for the JS layer**
   - Goal: machine-readable discovery of all exported JS/WASM bindings.
   - Acceptance criteria:
     - A `docs/binding_registry.json` listing exported namespaces, function names, and deprecation status.
   - Non-goals:
     - Duplicating the upstream Rust indicator registry verbatim.

### Later

1. **Agent bootstrap command**
   - Goal: provide a one-command local setup and verification flow.
   - Acceptance criteria:
     - Script or npm task that documents and runs core checks in order.
   - Non-goals:
     - Replacing existing contributor docs.
