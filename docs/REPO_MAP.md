# Repository Map

Quick directory map for contributors. For contribution rules, validation gates,
and the if-changing-X-also-check-Y checklist, see **AGENTS.md** (canonical
agent-facing doc) and **CONTRIBUTING.md** (canonical human-facing doc).

## Top-level layout

- `src/`: Rust WASM binding sources (wasm-bindgen).
- `test/`: Node.js value-parity tests (`node:test`).
- `e2e/`: Playwright headless-browser smoke tests for the web/CDN targets.
- `examples/`: Small runnable example programs.
- `bench/`: JS-side microbenchmarks (manually run; numbers paste-back into README).
- `dist/`: Generated WASM + glue JS (gitignored; produced by `npm run build`).
- `docs/`: Docusaurus documentation site source + this map.
- `.github/workflows/`: CI/CD pipelines (`ci.yml`, `docs.yml`, `publish.yml`).
- `CHANGELOG.md`: required entry point for every user-facing change.
- `AGENTS.md`: agent operating rules and PR expectations.
- `CONTRIBUTING.md`: contributor expectations and validation gates.
- `index.js`: ESM entry point for bundlers (Vite/Webpack/Rollup).
- `index.node.js`: CommonJS entry point for Node.js.
- `index.web.js`: ESM entry point for browsers (loads `.wasm` separately).
- `index.d.ts`: TypeScript definitions and JSDoc for all exported APIs.
- `Cargo.toml`: Rust project configuration and dependency pinning.
- `package.json`: NPM configuration, scripts, and exports map.

## Source module map (`src/`)

- `lib.rs`: central enums and module exports wired for wasm-bindgen.
- `jsutil.rs`: internal helper module — array converters and `js_err` adapter.
- `basic_indicators.rs`: arithmetic/statistical helper bindings (mean/median/variance/etc.).
- `candle_indicators.rs`: candle-derived indicator bindings.
- `chart_trends.rs`: peak/valley and trend-structure analysis bindings.
- `correlation_indicators.rs`: pairwise/statistical relationship indicator bindings.
- `momentum_indicators.rs`: RSI, Stochastic, and oscillator bindings.
- `moving_average.rs`: moving average function bindings.
- `other_indicators.rs`: miscellaneous indicator bindings.
- `strength_indicators.rs`: strength/volume participation indicator bindings.
- `trend_indicators.rs`: trend direction/strength indicator bindings.
- `volatility_indicators.rs`: volatility and range-expansion indicator bindings.
