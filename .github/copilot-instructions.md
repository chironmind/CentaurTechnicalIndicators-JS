# Copilot Instructions for CentaurTechnicalIndicators-JS

This document provides comprehensive guidance for coding agents working with the CentaurTechnicalIndicators-JS repository.

## Repository Overview

**CentaurTechnicalIndicators-JS** is a WebAssembly-powered JavaScript/TypeScript wrapper around CentaurTechnicalIndicators-Rust, a high-performance technical indicators library for financial analysis. The project provides production-grade indicators with first-class TypeScript support and works in both Node.js 18+ and modern browsers.

### Key Characteristics
- **Type**: Library/NPM package
- **Languages**: Rust (core WASM), JavaScript/TypeScript (wrappers)
- **Size**: Medium (~20 root files, 11 Rust modules, organized directory structure)
- **Dependencies**: centaur-technical-indicators crate, wasm-bindgen, js-sys, Node.js built-in test runner
- **Targets**: Three WASM builds (Node.js, bundler, web)

## Prerequisites and Environment Setup

**Always verify and install these prerequisites before building:**

1. **Node.js 18+** - Required for ESM and `node:test`
2. **Rust stable** - Install via `rustup` (recommended)
3. **WASM target**: `rustup target add wasm32-unknown-unknown`
4. **wasm-pack**: `cargo install wasm-pack`

**Installation sequence:**
```bash
# Always run in this order
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```

## Build Process

### Build Commands

**Use npm scripts (preferred):**
```bash
npm run build          # Builds all targets (web, node, bundler)
npm run build:web      # Web target only  
npm run build:node     # Node target only
npm run build:bundler  # Bundler target only
```

**Direct wasm-pack commands (fallback):**
```bash
# Use these if npm scripts fail or don't exist
wasm-pack build --release --target web --out-dir dist/web --out-name centaur-technical-indicators
wasm-pack build --release --target nodejs --out-dir dist/node --out-name centaur-technical-indicators  
wasm-pack build --release --target bundler --out-dir dist/bundler --out-name centaur-technical-indicators
```

### Critical Build Information

**IMPORTANT:** The `--out-name centaur-technical-indicators` flag is required for consistent file naming expected by JavaScript entry points.

**Known Issue - wasm-opt Download Failure:**
Error: failed to download from https://github.com/WebAssembly/binaryen/releases/download/version_XXX/binaryen-version_XXX-x86_64-linux.tar.gz
```

**Workaround:** Temporarily disable wasm-opt in `Cargo.toml`:
```toml
[package.metadata.wasm-pack.profile.release]
wasm-opt = false  # Add this line
```

**Build Outputs:**
- `dist/web/` - Web target (ESM + separate .wasm file)
- `dist/node/` - Node.js target (CommonJS)  
- `dist/bundler/` - Bundler target (ESM for Vite/Webpack/Rollup)

**Build Time:** Initial build ~2-3 minutes (downloads dependencies), subsequent builds ~30 seconds.

## Testing

**Test Command:**
```bash
npm test
# Equivalent to: npm run build && node --test
```

**Direct Test Command:**
```bash
node --test test/*.test.js
# or
node --test CentaurTechnicalIndicators-JS/test/*.test.js
```

**Test Structure:**
- Tests use Node.js built-in `node:test` runner
- Located in `test/*.test.js`
- All tests are value parity tests comparing exact numeric outputs to Rust reference
- Tests require the Node.js build to exist in `dist/node/`
- **Always run `npm run build` before testing**

## Linting and Formatting

### Rust
```bash
cargo fmt        # Format Rust code
cargo fmt --check # Check formatting without changing files
cargo clippy     # Rust linting (expect some warnings about too many arguments)
```

### JavaScript/TypeScript
- **Prettier** mentioned in CONTRIBUTING.md but not installed by default
- **ESLint** mentioned but not configured in the repository
- Manual formatting may be needed for JS/TS files

## Architecture and Project Layout

### Directory Structure
```
CentaurTechnicalIndicators-JS/
├── src/                     # Rust WASM wrappers (wasm-bindgen)
│   ├── lib.rs              # Central enums and module exports
│   ├── candle_indicators.rs # Candle pattern indicators
│   ├── momentum_indicators.rs # RSI, Stochastic, etc.
│   ├── trend_indicators.rs  # Aroon, PSAR, etc.
│   ├── volatility_indicators.rs # Volatility measures
│   ├── strength_indicators.rs # Volume-based indicators  
│   ├── correlation_indicators.rs # Statistical measures
│   ├── chart_trends.rs     # Peak/valley analysis
│   ├── moving_average.rs   # Moving average functions
│   ├── standard_indicators.rs # Common indicators (SMA, EMA, etc.)
│   └── other_indicators.rs # Miscellaneous indicators
├── index.node.js           # Node.js adapter (CommonJS require)
├── index.js                # Bundler adapter (ESM)
├── index.web.js            # Web adapter (ESM) 
├── index.d.ts              # TypeScript definitions + JSDoc
├── test/                   # Value parity tests (node:test)
├── dist/                   # Generated WASM + glue JS (gitignored)
├── package.json            # NPM configuration with build scripts
├── Cargo.toml              # Rust project configuration
└── .github/workflows/      # CI/CD pipelines
```

### Key Configuration Files
- `package.json` - NPM scripts, dependencies, exports configuration
- `Cargo.toml` - Rust project with wasm-pack settings
- `.github/workflows/ci.yml` - CI pipeline (builds + tests)
- `.github/workflows/docs.yml` - TypeDoc documentation generation
- `.github/workflows/publish.yml` - NPM publishing workflow

### Architecture Patterns

**WASM Binding Pattern:**
1. Rust functions in `src/*.rs` use `#[wasm_bindgen]` annotations
2. JS entry points (`index.*.js`) import and re-export with namespace organization
3. TypeScript definitions in `index.d.ts` provide types and JSDoc

**API Organization:**
Functions are grouped into namespaces like:
- `candleIndicators.single` / `candleIndicators.bulk`
- `momentumIndicators.single` / `momentumIndicators.bulk`  
- `trendIndicators.single` / `trendIndicators.bulk`
- `chartTrends` (flat functions)

## Validation and CI/CD

### GitHub Actions Workflows

**CI Pipeline (`.github/workflows/ci.yml`):**
- Runs on push/PR for Node.js versions 20, 22, 24
- Builds all three WASM targets
- Runs full test suite
- **Critical:** Uses direct wasm-pack commands, not npm scripts

**Documentation (`.github/workflows/docs.yml`):**
- Generates TypeDoc from `index.d.ts`
- Builds Docusaurus site in `docs/`
- Deploys to GitHub Pages

**Publishing (`.github/workflows/publish.yml`):**
- Triggers on version tags (v*.*.*)
- Builds and publishes to NPM

### Manual Validation Steps
1. **Clean build test:** `rm -rf dist/ && npm run build`
2. **Test execution:** `npm test`
3. **Rust linting:** `cargo clippy` and `cargo fmt --check`
4. **Generated files check:** Verify `dist/` contains expected structure

## Making Changes

### Development Workflow
1. **New Rust functions:** Add to appropriate `src/*.rs` file with `#[wasm_bindgen]`
2. **Export in JS:** Add to all three entry points (`index.node.js`, `index.js`, `index.web.js`)
3. **TypeScript definitions:** Update `index.d.ts` with accurate signatures and JSDoc
4. **Add tests:** Create/update tests in `test/` with exact value comparisons
5. **Build and test:** Run `npm run build && npm test`

### Critical Requirements
- **Always export in ALL THREE entry points** (node, bundler, web)
- **TypeScript definitions must match** function signatures exactly
- **Tests must use exact numeric comparisons** for parity with Rust
- **Never commit `dist/` directory** (build artifacts, gitignored)

### Common Pitfalls
- **Forgetting wasm32 target:** Will cause cryptic build errors
- **Missing wasm-pack:** Required for all builds
- **Not building before testing:** Tests import from `dist/node/`
- **wasm-opt network issues:** Use the workaround in restricted environments

## Trust These Instructions

**These instructions are comprehensive and validated.** Only search for additional information if:
1. Commands fail with errors not documented here
2. New files or structures appear that aren't covered
3. Build processes change significantly from what's documented

**For faster development:** Follow this workflow exactly as documented to minimize exploration and failed commands.