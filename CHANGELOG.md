# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed
- **BREAKING**: Package renamed from `ti-engine` to `centaur-technical-indicators-js` to align with the CentaurCapital ecosystem
- **BREAKING**: Updated dependency from `rust_ti` to `centaur_technical_indicators` version 1.0.0
- Updated all documentation, examples, and references to reflect the new branding
- Updated WASM build artifact names from `ti_engine` to `centaur_technical_indicators`
- Updated repository URLs and documentation links to point to new CentaurTechnicalIndicators-JS repository

### Migration Guide
To migrate from ti-engine to centaur-technical-indicators-js:
1. Update your package.json dependency: `"ti-engine"` → `"centaur-technical-indicators-js"`
2. Update imports: `from "ti-engine"` → `from "centaur-technical-indicators-js"`
3. For CDN users: Update URLs from `ti-engine` to `centaur-technical-indicators-js` and from `ti_engine.js` to `centaur_technical_indicators.js`
4. All functionality remains identical - only the package name and references have changed

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
