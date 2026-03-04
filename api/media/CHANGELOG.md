# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - `trendIndicators.single.volumePriceTrend` / `trendIndicators.bulk.volumePriceTrend`
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
