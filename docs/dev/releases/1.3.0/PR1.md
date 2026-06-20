# PR 1 — Rust dependency bump

Branch: `pr/1-dep-bump` · merged into `release/1.3.0` (#23) · Status: **merged**

## Objective
Move onto Rust core `1.3.0` and confirm a green baseline before any binding change.

## Changes
- `Cargo.toml` — `centaur_technical_indicators` `"1.2.2"` → `"=1.3.0"`.
- `CHANGELOG.md` — `### Changed` dep-bump entry + migration note for the upstream
  `chart_trends::peaks`/`valleys` index-0 fix and the aroon/stochastic NaN hardening.

## Key decisions
- **Exact pin (`=1.3.0`), not caret.** The bare caret already floated to 1.3.0 and
  would reach 1.4.x with a fresh index; this binding is a hand-written mirror of a
  *specific* core version, so the pin keeps builds deterministic. (Changes the prior
  caret convention — bump deliberately per release.)

## Validation
fmt ✓ · clippy ✓ · build (3 wasm targets) ✓ · test ✓ · `cargo tree` → `v1.3.0`.
