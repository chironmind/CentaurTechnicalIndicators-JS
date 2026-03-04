# Repository Map

Quick orientation for contributors and coding agents working in `CentaurTechnicalIndicators-JS`.

## Top-level layout

- `src/`: Rust WASM binding sources (wasm-bindgen).
- `test/`: Node.js value-parity tests (`node:test`).
- `dist/`: Generated WASM + glue JS (gitignored; produced by `npm run build`).
- `docs/`: Supplementary documentation (AI onboarding, this file, Docusaurus site source).
- `.github/workflows/`: CI/CD pipelines (`ci.yml`, `docs.yml`, `publish.yml`).
- `CHANGELOG.md`: required entry point for every user-facing change.
- `AGENTS.md`: agent operating rules and PR/reporting expectations.
- `docs/AI_ONBOARDING.md`: canonical start-here checklist for coding agents.
- `AI_FRIENDLY_ROADMAP.md`: contributor-workflow and feature roadmap.
- `CONTRIBUTING.md`: contributor expectations and required validation gates.
- `index.js`: ESM entry point for bundlers (Vite/Webpack/Rollup).
- `index.node.js`: CommonJS entry point for Node.js.
- `index.web.js`: ESM entry point for browsers (loads `.wasm` separately).
- `index.d.ts`: TypeScript definitions and JSDoc for all exported APIs.
- `Cargo.toml`: Rust project configuration and dependency pinning.
- `package.json`: NPM configuration, scripts, and exports map.

## Source module map (`src/`)

- `lib.rs`: central enums and module exports wired for wasm-bindgen.
- `candle_indicators.rs`: candle-derived indicator bindings.
- `chart_trends.rs`: peak/valley and trend-structure analysis bindings.
- `correlation_indicators.rs`: pairwise/statistical relationship indicator bindings.
- `momentum_indicators.rs`: RSI, Stochastic, and oscillator bindings.
- `moving_average.rs`: moving average function bindings.
- `other_indicators.rs`: miscellaneous indicator bindings.
- `strength_indicators.rs`: strength/volume participation indicator bindings.
- `trend_indicators.rs`: trend direction/strength indicator bindings.
- `volatility_indicators.rs`: volatility and range-expansion indicator bindings.

## Extension points

- New indicator binding: add to the appropriate `src/*_indicators.rs` (or `src/moving_average.rs` / `src/chart_trends.rs`).
- New JS export: add to **all three** entry points (`index.js`, `index.node.js`, `index.web.js`).
- New TypeScript definition: add to `index.d.ts` with accurate signatures and JSDoc.
- New test: add to `test/` with exact expected-value comparisons.

## If changing X, also check Y

- If adding a new Rust binding:
  - Also export in all three JS entry points.
  - Also add TypeScript definition in `index.d.ts`.
  - Also add a test in `test/`.
- If changing a JS export name or signature:
  - Also update `index.d.ts`.
  - Also update corresponding tests in `test/`.
- If changing indicator output semantics:
  - Also update test expected values.
  - Also document the change in `CHANGELOG.md`.
- If adding any user-visible behavior:
  - Also update `README.md` when appropriate.
  - Also add a `CHANGELOG.md` entry.
- If bumping `centaur_technical_indicators` in `Cargo.toml`:
  - Also update the version in `package.json` and `Cargo.toml` (`[package].version`).
  - Also add a `CHANGELOG.md` entry.

## Required local validation gates

Run these before opening a PR:

1. `cargo fmt --check`
2. `cargo clippy`
3. `npm run build`
4. `node --test`

## Minimal PR content checklist

- What changed and why.
- Compatibility/user-impact notes.
- Validation command summary.
- Explicit `CHANGELOG.md` entry note.
