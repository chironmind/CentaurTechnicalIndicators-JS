# Contributing to CentaurTechnicalIndicators-JS

First off, thank you for taking the time to contribute! This project wraps the Centaur Technical Indicators library in a WebAssembly-powered, JS/TS‑friendly API. Contributions that improve correctness, performance, DX, and documentation are all welcome.

This guide explains how to get set up, propose changes, add new indicators, and keep everything consistent across Rust, WASM, JS, and TypeScript types.

---

## Table of contents

- Code of Conduct
- Project goals
- How to contribute
  - Ask questions and report bugs
  - Propose features
  - Good-first tasks
- Development environment
  - Prerequisites
  - Build targets
  - Directory layout
- Making changes
  - Wrapping new Rust functions with wasm_bindgen
  - Exporting in JS entrypoints
  - Updating TypeScript definitions
  - Adding tests (value parity)
  - Linting, formatting, and checks
- Design and conventions
  - Namespaces and API shape
  - Panics vs. thrown errors
  - JSDoc and docstrings
  - Versioning and changelog
- Pull request checklist
- Release process (maintainers)
- License

---

## Code of Conduct

Be kind and respectful. By participating, you agree to uphold a friendly, collaborative environment. If you encounter unacceptable behavior, please open an issue.

---

## Project goals

- Correctness and parity with Centaur Technical Indicators reference outputs
- High performance using Rust + WebAssembly
- Ergonomic JS/TS developer experience (stable API and strong types)
- Clear docs, examples, and tests that keep parity obvious

---

## How to contribute

### Ask questions and report bugs

- Use GitHub Issues to file bug reports or ask technical questions
- Include repro steps, environment info (Node version, browser, OS), and sample inputs/outputs

### Propose features

- Open an issue describing the use case, proposed API, and references (e.g., indicator definitions, Centaur Technical Indicators references)
- Keep the API consistent with existing namespaces and docstring conventions

### Good-first tasks

- Add or improve JSDoc docstrings in `index.d.ts`
- Add missing value parity tests for indicators
- Fill gaps in namespaces to match RustTI modules
- Improve error messages for invalid inputs (length mismatches, period bounds)

---

## Development environment

### Prerequisites

- Node.js 18+ (ESM + `node:test`)
- Rust stable (`rustup` recommended)
- wasm32 target and wasm toolchain:
  - `rustup target add wasm32-unknown-unknown`
  - `cargo install wasm-pack` (recommended) or a comparable wasm-bindgen pipeline

Optional but recommended:
- A modern package manager: `npm`/`pnpm`/`yarn`
- Prettier/ESLint for editor formatting

### Build targets

This project ships three WASM builds:
- Node: `dist/node/centaur-technical-indicators.js` (+ `.wasm`)
- Bundler (ESM): `dist/bundler/centaur-technical-indicators.js` (+ `.wasm`)
- Web (ESM): `dist/web/centaur-technical-indicators.js` (+ `.wasm`)

If the repo provides `package.json` scripts, prefer those:

```bash
# Typical (if available)
npm run build            # build all targets
npm run build:node
npm run build:bundler
npm run build:web
```

If not, you can build with `wasm-pack`:

```bash
# Node
wasm-pack build --release --target nodejs    --out-dir dist/node     --out-name centaur-technical-indicators

# Bundler
wasm-pack build --release --target bundler   --out-dir dist/bundler  --out-name centaur-technical-indicators

# Web
wasm-pack build --release --target web       --out-dir dist/web      --out-name centaur-technical-indicators
```

> Note: The `--out-name centaur-technical-indicators` flag ensures consistent file names expected by the JS entrypoints.

### Directory layout

- `src/*.rs`     Rust WASM wrappers (wasm-bindgen) mapping Centaur Technical Indicators APIs to JS
- `src/lib.rs`   Central module exports and enums bridged to JS
- `index.node.js` Node adapter exporting namespaces
- `index.js`     Bundler adapter exporting namespaces
- `index.web.js` Web adapter exporting namespaces
- `index.d.ts`   TypeScript types + JSDoc for editor DX
- `test/*.test.js` Value parity tests using `node:test`
- `dist/**`                Generated WASM + glue JS (do not edit by hand)

---

## Making changes

### 1) Wrap new Rust functions with wasm_bindgen

- Create a new file in `src/` or add to an existing module (e.g., `trend_indicators.rs`).
- Expose Centaur Technical Indicators functions with `#[wasm_bindgen]` and a stable `js_name`:
  - Convert Rust return types into JS-friendly outputs: `f64` or `js_sys::Array` for tuples/series
  - Accept `Vec<f64>` for slices from JS
- Register the module in `src/lib.rs` with `pub mod your_module;`
- If you need Rust enums in JS (e.g., `Position`, `MovingAverageType`), define a wasm-exposed enum and implement `From<YourEnum> for centaur-technical-indicators::YourEnum`.

Example:

```rust
#[wasm_bindgen(js_name = trend_bulk_aroonUp)]
pub fn trend_bulk_aroon_up(highs: Vec<f64>, period: usize) -> Array {
    let data = centaur_technical_indicators::trend_indicators::bulk::aroon_up(&highs, period);
    let out = Array::new();
    for v in data { out.push(&JsValue::from_f64(v)); }
    out
}
```

### 2) Export in JS entrypoints

Add your bindings to all three entrypoints:
- `index.node.js`
- `index.js`
- `index.web.js`

Group them under an existing or new namespace to keep the API consistent. Example:

```js
export const trendIndicators = {
  single: { /* ... */ },
  bulk:   { /* ... */ },
};
```

### 3) Update TypeScript definitions

- Extend `index.d.ts` with accurate function signatures and JSDoc borrowed from Rust doc comments (adapted to JS terms).
- Use plain arrays for tuples (e.g., `[lower, middle, upper]`) and typed tuples in TS definitions.

### 4) Add tests (value parity)

- Put tests in `test/*.test.js`
- Use `node:test` and compare exact numeric outputs to the Rust reference (use values from Centaur Technical Indicators docs/tests).
- Prefer deterministic test vectors with explicit expected results.

Run tests:

```bash
node --test test/*.test.js
# or
npm test
```

### 5) Linting, formatting, and checks

- JS/TS: Format with Prettier. If ESLint is configured, fix warnings/errors.
- Rust: `cargo fmt` and `cargo clippy` in the wrapper crate (and in RustTI if you’re working there).
- WASM builds: Rebuild for Node, Bundler, and Web as needed, then re-run tests.

---

## Design and conventions

### Namespaces and API shape

- Each domain groups indicators under a namespaced object:
  - `movingAverage`, `momentumIndicators`, `strengthIndicators`, `trendIndicators`, `volatilityIndicators`, `candleIndicators`, `correlationIndicators`, `chartTrends`, `otherIndicators`, `standardIndicators`
- Two styles per indicator set:
  - `single.*` — full-window calculations returning a scalar (or tuple)
  - `bulk.*`   — rolling-window calculations returning arrays

### Panics vs. thrown errors

- Rust panics become JS exceptions at call time.
- Mirror Centaur Technical Indicators validations: length mismatches, empty arrays, period bounds, etc.
- Document preconditions in JSDoc.

### JSDoc and docstrings

- Port core documentation from Rust docs to `index.d.ts` for best editor hovers.
- Keep parameter names consistent, clarify units (percent vs. scalar), and explain windows (L - N + 1).

### Versioning and changelog

- Use semver when publishing breaking changes to the JS API.
- Note behavior changes (defaults, parameter orders, tuple shapes) clearly in the changelog.

---

## Pull request checklist

Before you open a PR:

- [ ] Clear problem statement and reasoning
- [ ] New/changed functions exported in all three entrypoints (node, bundler, web)
- [ ] Type declarations updated in `index.d.ts` with JSDoc
- [ ] Value parity tests added/updated and passing (`node --test`)
- [ ] WASM builds verified locally if touching Rust (`wasm-pack build ...`)
- [ ] Code formatted (`prettier`, `cargo fmt`) and lint warnings addressed
- [ ] No large generated files committed (e.g., avoid committing `dist/` unless repo policy requires it)

PR guidance:

- Keep changes focused (one topic per PR)
- Add concise but informative description and examples
- Reference any related issues

---

## Release process (maintainers)

1. Ensure CI is green (builds/test on Node and Bundler at minimum)
2. Update changelog and bump version if needed
3. Build all targets (Node/Bundler/Web) and verify smoke tests
4. Publish package (if applicable) and tag the release

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License contained in this repository.

Thanks again for helping make CentaurTechnicalIndicators-JS better!
