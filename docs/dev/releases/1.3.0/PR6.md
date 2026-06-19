# PR 6 — Documentation hygiene

Branch: `pr/6-doc-hygiene` (#30) · Status: open

## Objective
Fix stale references in the docs we keep (no whole-file deletions — that's PR 6b).

## Changes
- Removed `standardIndicators` refs from `README.md`, `CONTRIBUTING.md`,
  `docs/docs/index.md`, `docs/docs/howto/bulk-vs-single.md`. (`index.d.ts` had none —
  an earlier draft listed it in error.)
- Replaced stale `ti-engine` in `README.md` + `SECURITY.md`; fixed the advisory URL.
- README dist filenames underscore → hyphen `centaur-technical-indicators.js`.
- Renamed `test/otherIndicators.node.js` → `...node.test.js` (so it runs under the glob).
- `index.d.ts` — breakDownTrends JSDoc `1.0.0` → `1.3.0`, **plus `@remarks`
  documenting the 1.3.0 behavior** for peaks/valleys (index-0, all-NaN → `[]`) and
  single aroon/stochastic (NaN on all-NaN) — per AGENTS.md and review #30/#26.

## Validation
fmt ✓ · clippy ✓ · build ✓ · test ✓ (109/109).
