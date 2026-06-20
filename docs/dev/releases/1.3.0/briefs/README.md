# 1.3.0 — execution briefs (not-yet-run PRs)

Forward-execution **briefs** for the remaining 1.3.0 work, each conforming to the
workspace `TEMPLATE-brief.md` and self-contained (a session can execute one
without reading the plan).

**Brief vs. record.** These are the *spec read before* a PR runs. The sibling
[`../`](../) `PR*.md` files are *implementation records written after* a PR lands
(objective · changes · decisions · validation), per
[`docs/dev/README.md`](../../../README.md). The two don't overlap: records exist
for landed PRs (1, 2, 4, 6, 6b, 7, 8); briefs exist for the not-yet-run ones
below. When a brief's PR lands, add its record as `../PR<n>.md` — don't rewrite
the brief.

**Plan.** The PR-by-PR plan is [`../../RELEASE_1.3.0.md`](../../RELEASE_1.3.0.md).
Note the plan predates the **trunk-based** pivot: these briefs target `main`
(`pr_target: main`) and omit the old `release/1.3.0` integration-branch +
"Final PR" + tagging-gate ceremony, which is superseded (see the session handoff
/ `RESUME.md`). The version cut is a commit + `v1.3.0` tag on `main`.

## Briefs

| Brief | Title | Wave | depends_on | Decisive test |
|-------|-------|------|------------|----------------|
| [PR3](./PR3-favorable-move.md) | Favorable-move bindings (`peakFavorableMove` / `valleyFavorableMove`) | B | PR1, PR2 | A1 |
| [PR5a](./PR5a-candle-errors.md) | Error-handling: `candle_indicators` | B | PR2 | A1 |
| [PR5b](./PR5b-momentum-errors.md) | Error-handling: `momentum_indicators` (chaikin `#[allow]` landmine) | B | PR2 | A1 |
| [PR5c](./PR5c-trend-errors.md) | Error-handling: `trend_indicators` | B | PR2 | A1 |
| [PR5d](./PR5d-strength-errors.md) | Error-handling: `strength_indicators` | B | PR2 | A1 |
| [PR5e](./PR5e-volatility-errors.md) | Error-handling: `volatility_indicators` | B | PR2 | A1 |
| [PR5f](./PR5f-correlation-errors.md) | Error-handling: `correlation_indicators` | B | PR2 | A1 |
| [PR5g](./PR5g-other-errors.md) | Error-handling: `other_indicators` | B | PR2 | A1 |
| [PR5h](./PR5h-moving-average-errors.md) | Error-handling: `moving_average` | B | PR2 | A1 |
| [PR9](./PR9-binding-registry.md) | Binding registry + cross-entry-point drift test | C | PR3, PR7 | A1 |
| [version-cut](./version-cut.md) | Version cut + changelog finalization + tag | D | PR1, PR2, PR3, PR5a–h, PR7, PR9 | A1 |

## Sequencing (backbone)

PR 2 → (Wave B: PR 3 + PR 5a–5h, all parallel) → (Wave C: PR 9, after PR 3 + PR 7)
→ (Wave D: version-cut, after every error-handling PR + PR 3 + PR 9).

**Prerequisite reality (at time of writing):** PR 2 (`js_err` helper) is open as
`#29`, not yet merged — so Wave B cannot start until it lands. PR 7
(`index.node.cjs`, `#27`) gates PR 9. Each brief's *Prerequisites* section states
how to verify its preconditions and to stop-and-report if unmet.
