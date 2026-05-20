# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed
- CI: replaced the archived `actions-rs/toolchain@v1` action with native `rustup` invocations in `ci.yml`, `publish.yml`, and `docs.yml`. Per `~/Projects/CLAUDE.md`, this avoids the deprecated third-party Rust toolchain action.
- CI: `wasm-pack` is now installed from its pinned GitHub release tarball (`v0.13.1`) instead of `cargo install wasm-pack`. This is ~30-60s faster per matrix slot.
- `package.json`: `test` now runs `npm run build && npm run test:only`. `test:only` excludes the slow package-import smoke test (`test:smoke`) so local `npm test` stays fast.

### Added
- CI: new `rust-lint` job runs `cargo fmt --check` and `cargo clippy --target wasm32-unknown-unknown --all-targets -- -D warnings`, matching the gates documented in `AGENTS.md` and `ai-policy.yaml`.
- CI: new TypeScript typecheck step runs `tsc --noEmit --strict index.d.ts` once per build (gated to the lowest Node matrix slot).
- CI: new `package-smoke` job packs the package, installs the tarball into a temp consumer project, and verifies that the documented package-root + subpath imports (`./index.js`, `./index.node.js`, `./index.web.js`) all resolve and can compute an indicator.
- `test/packageImport.smoke.test.js`: implements the package-import smoke test. Filename is `.smoke.test.js` (not `.node.test.js`) so it is excluded from default `npm test`; runs explicitly via `npm run test:smoke`.
- `package.json`: new scripts `test:only`, `test:smoke`, `typecheck`; new devDependency `typescript ^5.4.5`.
- `.github/dependabot.yml`: monthly Dependabot config for GitHub Actions, root `npm`, `docs/` `npm`, and Cargo.

### Fixed
- CI: `publish.yml` now runs `npm run test:only` and `npm run test:smoke` before `npm publish`. A failing test now prevents a release.
- CI: build job no longer rebuilds WASM twice. Previously the three explicit `wasm-pack build` steps were followed by `npm test`, which itself ran `npm run build && node --test`. The new flow uses `npm run test:only` so the build runs once.

---

## [1.2.2] - 2026-04-04

### Changed
- Updated `centaur_technical_indicators` dependency from `1.2.1` to `1.2.2`.
- Removed deprecation from `volumePriceTrend` (no longer deprecated upstream).
- Fixed stale `rust_ti` reference in `chart_trends.rs`.
- Fixed README enum listing: removed unavailable `PersonalisedMovingAverage`, added missing `LogStandardDeviation`, `LaplaceStdEquivalent`, `CauchyIQRScale` to `DeviationModel`.
- Added `@deprecated` JSDoc tags to deprecated functions in `index.d.ts` (`slowStochastic`, `slowestStochastic`, `signalLine`, `volatilitySystem`).

---

## [1.2.1] - 2026-03-01

### Added
- Added `AGENTS.md` with agent operating rules and PR/reporting expectations.
- Added `AI_FRIENDLY_ROADMAP.md` with contributor-workflow and JS/WASM-layer feature roadmap.
- Added `ai-policy.yaml` as a machine-readable contribution policy file.
- Added `docs/AI_ONBOARDING.md` as a canonical start-here onboarding flow for coding agents.
- Added `docs/REPO_MAP.md` with a quick repository map, extension points, and "if changing X, also check Y" guidance.
- Added default pull request template at `.github/pull_request_template.md` with required sections (`Summary`, `Scope`, `Compatibility`, `Validation`, `Changelog`).

### Changed
- Updated `centaur_technical_indicators` dependency from `1.2.0` to `1.2.1`.

---

## [1.2.0] - 2026-02-26

### Added
- Added reference URLs for explanations

### Changed
- Updated `centaur_technical_indicators` dependency from 1.0.0 to 1.2.0

### Deprecated
- The following WASM bindings wrap functions that are deprecated in the upstream `centaur_technical_indicators` 1.2.0 crate and will be removed in a future major release:
  - `momentumIndicators.single.slowStochastic` / `momentumIndicators.bulk.slowStochastic`
  - `momentumIndicators.single.slowestStochastic` / `momentumIndicators.bulk.slowestStochastic`
  - `momentumIndicators.single.signalLine` / `momentumIndicators.bulk.signalLine`
  - `volatilityIndicators.bulk.volatilitySystem`

---

## [1.0.0] - 2025-01-20

### Changed
- **BREAKING**: Package renamed from `ti-engine` to `centaur-technical-indicators` to align with the CentaurCapital ecosystem
- **BREAKING**: Updated dependency from `rust_ti` to `centaur-technical-indicators` version 1.0.0
- Updated all documentation, examples, and references to reflect the new branding
- Updated WASM build artifact names from `ti_engine` to `centaur-technical-indicators`
- Updated repository URLs and documentation links to point to new CentaurTechnicalIndicators-JS repository

---

*** /!\ The release notes below cover the ti-engine packages before the rebranding /!\ ***

---

## [1.1.4] - 2025-10-23

### Changed
- Updated release number on some files that had been forgotten

---

## [1.1.3] - 2025-10-23

### Fixed
- Added WASM files to get the CDN to work
- Made lib name follow coding standards for JS packages

---

## [1.1.2] - 2025-10-19

### Fixed
- Mangled release because some files were not updated correctly

---

## [1.1.1] - 2025-10-19

### Changed

- Updated rust_ti dependency from 2.1.5 to 2.2.0

### Added

- New DeviationModel variants: LogStandardDeviation, LaplaceStdEquivalent, CauchyIQRScale

### Fixed

- Updated test expectations for MedianAbsoluteDeviation and ModeAbsoluteDeviation to match rust_ti 2.2.0 behavior

---

## [1.1.0] - 2025-10-08 

### Added

- More badges to README
- Link to docs in package.json

### Changed

- Fixed node version in README, and package.json
- Updated rust_ti version 2.1.5

### Fixed

- Package version in package.json

---

## [1.0.0] - 2025-08-27

Initial release
