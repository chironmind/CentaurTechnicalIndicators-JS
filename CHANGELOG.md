# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Removed
- Deleted `docs/AI_ONBOARDING.md`, `.github/copilot-instructions.md`, and
  `AI_FRIENDLY_ROADMAP.md`. Their content overlapped heavily with `AGENTS.md`
  and `CONTRIBUTING.md` and contained stale references (Node 18+ vs. 20+,
  phantom `standardIndicators` namespace, etc.). `AGENTS.md` and
  `CONTRIBUTING.md` are now the canonical agent-facing and human-facing
  process docs respectively.

### Changed
- `docs/REPO_MAP.md`: stripped policy and PR-checklist content; reduced to a
  pure directory map. Policy lives in `AGENTS.md`/`CONTRIBUTING.md` now.
- `CHANGELOG.md`: renamed the pre-rebrand `[1.0.0] - 2025-08-27` heading to
  `[1.0.0-tiengine] - 2025-08-27` and added a paragraph explaining the
  rebrand boundary, eliminating the duplicate `[1.0.0]` heading that
  Keep-a-Changelog flagged as confusing.
- `README.md` Performance section gains indicative JS-side benchmark numbers
  (run `npm run bench` for your-machine numbers) and a note about wasm-opt
  at publish time.
- `README.md` Tips & Conventions: updated to describe the new structured
  error messages (Phase 2.1 / `TechnicalIndicatorError::Display`) rather
  than the prior generic-panic wording.

### Added
- New top-level **Limitations** section in `README.md` covering every
  intentional gap relative to the Rust crate: parameterized enum variants,
  simplified error messages, no streaming API, `volumePriceTrend` silent
  slice, and the `AbsDevConfig` flattening for `basicIndicators.absoluteDeviation`.
- New `examples/` directory: `quickstart.js`, `rsi.js`, `bollinger.js`. Each
  is under 40 lines and runnable with `node examples/<name>.js` after
  `npm run build`.
- New `bench/run.js` JS-side microbenchmark harness. Manually run with
  `npm run bench`; not wired into CI (numbers are environment-dependent and
  belong in the README when ratified).
- `package.json` scripts: `example:quickstart`, `example:rsi`,
  `example:bollinger`, `bench`.

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

The version history below is from the pre-rebrand `ti-engine` package and is
preserved verbatim for historical context. The final `1.0.0-tiengine` entry
below is the original `ti-engine` initial release and is **distinct** from
the post-rebrand `[1.0.0] - 2025-01-20` entry above.

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

## [1.0.0-tiengine] - 2025-08-27

Initial release of the pre-rebrand `ti-engine` npm package. Renamed to
`centaur-technical-indicators` in the `[1.0.0] - 2025-01-20` entry above.
