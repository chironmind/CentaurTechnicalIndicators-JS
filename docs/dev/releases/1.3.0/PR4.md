# PR 4 — Regression tests for 1.3.0 bug fixes

Branch: `pr/4-regression-tests` · Status: branch pushed (PR not yet opened)

## Objective
Lock the behavior 1.3.0 fixed so future dep bumps can't silently regress it. Tests only.

## Changes (tests only)
- `test/chartTrends.node.test.js` — index-0 regression locks
  (`peaks([110,109,108,107],2,1) → [[110,0]]`, `valleys([107,108,109,110],2,1) → [[107,0]]`),
  retained-extremum correctness checks, and all-NaN peaks/valleys → `[]`.
- `test/trendIndicators.node.test.js` — single `aroonUp`/`aroonDown([NaN,NaN,NaN]) → NaN`.
- `test/momentumIndicators.node.test.js` — single `stochasticOscillator([NaN,NaN,NaN]) → NaN`.

## Key decisions
- Single `aroon`/`stochastic` take **no period** arg; all-NaN peaks/valleys return
  `[]` (`assert.deepEqual`), not a throw. Strictly depends on PR 1 (1.2.2 *panics*
  on all-NaN).
- These are the regression tests the Codex comments on #26/#30 ask for — they live
  here (split-PR release), not in the dep-bump / doc / CI PRs.

## Validation
fmt ✓ · clippy ✓ · build ✓ · test ✓ (109/109).
