# NEXT_RELEASE — candidate backlog after 1.3.0

> Curated, prioritized shortlist of the still-worthwhile items from the root
> `ROADMAP.md`, filtered against what **1.3.0 actually shipped** and re-checked
> against the Rust core on 2026-06-21. Each item cites its `ROADMAP.md` task ID.
>
> **Convention:** the JS repo is a *pure wrapper* over the Rust core — no JS-side
> math; new indicators land in the Rust crate first.

## What 1.3.0 already delivered (baseline — don't re-do)

Rust dep → `=1.3.0`; favorable-move bindings; `.expect()` → thrown JS `Error`
across all 9 wrapper modules (shared `js_err`); CommonJS entry `index.node.cjs`;
strict clippy + native-rustup CI; doc hygiene + process-doc consolidation;
regression tests; the **binding registry + cross-entry-point namespace drift
test** (PR 9); CI `GITHUB_TOKEN` permissions hardened (PR 46); version cut + tag.

## Coverage audit (ROADMAP 3.3) — DONE 2026-06-21

Parsed every `pub fn` in the Rust core's `single`/`bulk` (and flat `chart_trends`)
submodules and diffed against `docs/binding_registry.json`. **All 9 exposed
modules are complete** — every public Rust indicator function is bound, with no
phantom JS bindings. **The only unexposed module is `basic_indicators`** (15
single + 14 bulk fns). So there is no "scattered per-module omissions" work to do;
the only coverage question is `basic_indicators` (see below).

---

## Tier 1 — Highest value

- **Enum-variant drift test — `ROADMAP 6.1` (Rust CR-1).** PR 9 pinned the
  *namespace/function* surface; this pins the *enum unit-variant* sets
  (`ConstantModelType`, `DeviationModel`, `Position`, `MovingAverageType`) against
  the Rust core, so an upstream variant add/remove can't silently desync the JS
  mirror. Cheap, direct complement to PR 9. (~0.5 session.)
- **Re-enable `wasm-opt` for the published build — `ROADMAP 2.5`.** `Cargo.toml`
  sets `wasm-opt = false` ("download issues in CI"). **Accurate framing:**
  `wasm-pack --release` already applies LLVM release opts, so the code is *not*
  `-O0` — `wasm-opt` (binaryen) is an *additional* post-pass. Its main, guaranteed
  win is **bundle size** (~20–40% → faster download / parse / instantiate, esp.
  browser + CDN); steady-state compute gain is real but smaller. Net positive, low
  effort. Run it as a pinned-binaryen step in `publish.yml` (dodges the original
  download-flake). (~0.5 session.)

## Tier 1b — `basic_indicators`: a scope DECISION, not a clear win

The only unexposed module — but binding it wholesale is **not** obviously worth it.
JS's stdlib (`Math`) has no statistics, yet the 29 fns split two ways:

- **Trivial stats** — `mean`, `median`, `mode`, `variance`, `standard_deviation`,
  `min`, `max`. One-liners in JS, or in `simple-statistics` (a tiny, ubiquitous npm
  lib). Worse: the per-call **WASM boundary copy** (`Vec<f64>` marshalling) likely
  makes a binding *slower* than a pure-JS loop for these. Binding them mainly buys
  bit-exact parity with the Rust core — marginal for most consumers.
- **Specialized** — `log` / `log_difference`, `log_standard_deviation`,
  `absolute_deviation`, `student_t_adjusted_std`, `laplace_std_equivalent`,
  `cauchy_iqr_scale`, `empirical_quantile_range_from_distribution`,
  `price_distribution`. **No JS equivalent** — this is the deviation-model /
  distribution machinery, the part with real unique value. BUT:
  `absolute_deviation` takes `AbsDevConfig { CentralPoint, DeviationAggregate }`
  (needs two new enum mirrors), and `student_t_adjusted_std` /
  `empirical_quantile_range_from_distribution` overlap the **deferred
  parameterized-variant decision** (see `RELEASE_1.3.0.md` "Deferred" — does
  configurable flexibility belong in the JS retail surface at all, or only the
  research engine?).

**Recommendation:** do **not** bind the module wholesale. Resolve the
parameterized-variant positioning call first; then expose only the *specialized*
subset that has no JS equivalent. The trivial stats are best left to `Math` /
`simple-statistics` (and would often be slower over WASM). This demotes 3.1 from a
headline to a gated, scoped item.

## Tier 2 — CI / supply-chain hygiene (extends the PR 46 security work)

- **`tsc --noEmit` typecheck in CI — `ROADMAP 1.3`.** Nothing verifies the
  hand-maintained `index.d.ts` actually *compiles*; PR 9's drift test checks names,
  not types. Add a `typecheck` script + CI step. (~0.5 session.)
- **Dependabot config — `ROADMAP 1.6`.** `.github/dependabot.yml` for
  `github-actions` + `npm`; keeps Actions current and surfaces vuln alerts
  proactively. (~0.1 session.)
- **Pin/cache `wasm-pack` in CI — `ROADMAP 1.7`.** Every job runs
  `cargo install wasm-pack` cold (~30–60s wasted/job); download the pinned release
  binary instead (no third-party action, per CI policy). (~0.25 session.)

## Tier 3 — Test depth

- **Web/bundler runtime smoke test — `ROADMAP 4.2` / `4.4`.** The `web` and
  `bundler` targets build but are **never executed at runtime** — PR 9's drift test
  text-parses `index.js` precisely because it can't load under plain Node. A
  Playwright/headless smoke (load → `init()` → assert an RSI) + the ESM-CDN pattern
  closes the only untested entry points. (~1 session.)
- **Model-variant test coverage — `ROADMAP 4.3`.** Most indicators test one
  `ConstantModelType`/`DeviationModel`; a wrong `From<…>` arm wouldn't be caught.
  Add ≥2 variant cases per indicator (parity values from the Rust tests). (~1
  session, spread across PRs.)

## Tier 4 — API ergonomics & docs

- **`breakDownTrends` typed config object — `ROADMAP 2.4`.** Still 9 positional
  args (`index.d.ts:518`) with no protection against swapping
  `softDurbinWatsonMin`/`hardDurbinWatsonMin`. Add an **additive**
  `breakDownTrendsWithConfig(prices, config)` (non-breaking). (~0.5 session.)
- **Typed-array input types — `ROADMAP C-3.4`.** JSDoc says `Float64Array` is
  accepted but the TS signatures only allow `number[]` (prose-only,
  `index.d.ts:196`). Add `type NumericArray = number[] | Float64Array`. (~0.5
  session.)
- **Parameterized-variant docs + README "Limitations" — `ROADMAP 3.2` / `5.4`.**
  Only scattered "X not exposed" notes today; add systematic `@remarks` on each
  affected enum (`DeviationModel` `CustomAbsoluteDeviation` / `StudentT` /
  `EmpiricalQuantileRange`; `ConstantModelType.PersonalisedMovingAverage`) + a
  README Limitations section. (~0.5 session.)
- **`examples/` directory — `ROADMAP 5.2`.** Runnable `quickstart.js` / `rsi.js` /
  `bollinger.js`, wired to an npm script. (~0.5 session.)

## Tier 5 — Small cleanups

- **Dedup `[1.0.0]` heading in CHANGELOG — `ROADMAP 5.3`.** Appears twice (rebrand +
  legacy ti-engine); rename the older to `[1.0.0-tiengine]`. (Confirmed 2 headings
  on `main`.) (~0.1 session.)
- **Extract array-conversion helpers — `ROADMAP 2.2`.** Internal-only refactor;
  output must stay byte-identical. (~0.5 session.)

---

## Explicitly NOT planned (non-goals, per ROADMAP)

Switching test runner; Prettier/ESLint; hand-rolled FFI; streaming/incremental
APIs; auto-generating `index.d.ts`; JS-side calculation logic; **parameterized /
configurable enum variants in JS** (deferred pending the positioning decision —
see `RELEASE_1.3.0.md` "Deferred"; this also gates the specialized half of
`basic_indicators`).

## Suggested first slice for the next release

Lead with the cheap, high-certainty wins: **enum-drift test (6.1)** + **`wasm-opt`
(2.5)** + the CI hygiene trio (**1.3 typecheck, 1.6 dependabot, 1.7 wasm-pack
pin**). Defer `basic_indicators` until the parameterized-variant positioning
decision is made.
