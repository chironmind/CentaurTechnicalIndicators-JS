# PR 8 — CI, scripts, strict clippy

Branch: `pr/8-ci-clippy` (#26) · Status: open

## Objective
Add the strict clippy gate, restructure npm scripts, and clean up CI toolchain setup.

## Changes
- `src/momentum_indicators.rs` — `#[allow(clippy::too_many_arguments)]` on both
  chaikin oscillator fns (the only sites that fail `-D warnings`).
- `package.json` — scripts `build` / `test:node` / `test:pack` / `check:rust` /
  `check`; `prepublishOnly` → `check`.
- `.github/workflows/ci.yml` + `publish.yml` — run `npm run check`; **replaced the
  archived `actions-rs/toolchain` with native `rustup` commands**.

## Key decisions
- **Native `rustup`, no third-party toolchain action** (workspace CI policy) — *not*
  a swap to another third-party action like `dtolnay/rust-toolchain`, which an
  earlier plan draft wrongly suggested.
- Strict gate = `cargo clippy --target wasm32-unknown-unknown --all-targets -- -D warnings`.
- A pre-existing `cargo fmt` drift on the base (10 modules, inherited from `main`)
  blocked every PR's fmt gate; fixed separately by a `cargo fmt --all` baseline
  commit on `release/1.3.0` (`098217a`) — a gap the plan had missed.

## Validation
fmt ✓ · strict clippy ✓ · build ✓ · test ✓.
