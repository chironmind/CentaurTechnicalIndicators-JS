# PR 2 — Error handling: `chart_trends` + shared `js_err` (implementation brief)

Self-contained brief for the **PR 2** session. Expands the PR 2 section of
`RELEASE_1.3.0.md` (they agree). Working doc — disposable once PR 2 merges.

**Depends on:** PR 1 (needs the `=1.3.0` dep). This is the **first** error-handling
PR and **creates the `js_err` helper** that PR 3 and PRs 5a–5h all reuse — it's on
the critical path, so land it before Wave B.

---

## Goal

Introduce the shared error adapter `js_err`, and convert the six `chart_trends`
wrappers from `.expect(...)` **panics** to shaped JS **errors**
(`Result<Array, JsValue>` via `.map_err(js_err)?`). Success behavior is
unchanged; invalid input now throws a real `Error` carrying the upstream
`TechnicalIndicatorError` message instead of panicking.

**Why it's a real fix:** wasm32 defaults to `panic = abort` and this crate sets
no panic hook, so a Rust panic *traps the singleton wasm instance* and poisons
subsequent calls into the Node/bundler module. `Result` throws cleanly and keeps
the instance usable.

---

## 1. Branch / worktree

Branch off the integration branch **after PR 1 is merged into it**:
```
git switch -c pr/2-chart-trends-errors release/1.3.0
```
(If PR 1 isn't merged into `release/1.3.0` yet, stack off its branch instead:
`git switch -c pr/2-chart-trends-errors pr/1-dep-bump`. Either way the dep must
resolve to 1.3.0 — verify with `cargo tree -i centaur_technical_indicators`.)

## 2. Toolchain

Same as PR 1: `wasm32-unknown-unknown` target, `wasm-pack` v0.13.1, Node ≥ 20.

## 3. Changes — four files

### 3a. Create `src/jsutil.rs`
```rust
use wasm_bindgen::JsValue;

/// Adapter: turn any `Display` error (e.g. the upstream `TechnicalIndicatorError`)
/// into a `JsValue` so wasm-bindgen throws it as a JS `Error` instead of the
/// wrapper panicking. Reused by every module's `.map_err(js_err)?` sites.
pub fn js_err(err: impl std::fmt::Display) -> JsValue {
    JsValue::from_str(&err.to_string())
}
```
**Name it `js_err`** (not `js_error`). (`pub(crate) fn` is marginally cleaner since
it's internal-only, but the plan specifies `pub fn` — follow the plan.)

### 3b. Register the module in `src/lib.rs`
Add to the module block (currently lines ~98–106, the `pub mod *_indicators;`
list), e.g. at the top of that block:
```rust
pub mod jsutil; // shared js_err adapter (PR 2)
```

### 3c. Convert `src/chart_trends.rs` — all six functions
At the top of the file add:
```rust
use crate::jsutil::js_err;
```
Then for **each** of the six `#[wasm_bindgen]` functions
(`chart_trends_peaks`, `chart_trends_valleys`, `chart_trends_peak_trend`,
`chart_trends_valley_trend`, `chart_trends_overall_trend`,
`chart_trends_break_down_trends`):
1. change the return type `-> Array` to **`-> Result<Array, JsValue>`**;
2. change `.expect("Failed to calculate indicator")` to **`.map_err(js_err)?`**;
3. change the trailing `outer` / `arr` to **`Ok(outer)` / `Ok(arr)`**.

Example (peaks):
```rust
#[wasm_bindgen(js_name = chart_trends_peaks)]
pub fn chart_trends_peaks(prices: Vec<f64>, period: usize, closest_neighbor: usize)
    -> Result<Array, JsValue> {
    let pairs = centaur_technical_indicators::chart_trends::peaks(&prices, period, closest_neighbor)
        .map_err(js_err)?;
    let outer = Array::new();
    for (val, idx) in pairs {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(val));
        inner.push(&JsValue::from_f64(idx as f64));
        outer.push(&inner);
    }
    Ok(outer)
}
```
**Preserve** the existing `#[allow(clippy::too_many_arguments)]` on
`chart_trends_break_down_trends` (line ~72) — keep it on the function.

There are exactly **6** `.expect()` sites (lines 11, 26, 41, 52, 63, 99 on `main`)
and no `.unwrap()`. All six functions return `Array`; none are scalar here (the
scalar/`f64` favorable-move fns are PR 3).

### 3d. Tests — `test/chartTrends.node.test.js`
The file has two **commented-out** `assert.throws` tests at the bottom — uncomment
them and add one per remaining wrapper. The existing parity (`deepEqual`) tests
must stay **unchanged and green** (success behavior didn't change):
```js
test("peaks throws on period > len", () => {
  assert.throws(() => chartTrends.peaks([101.26, 102.57, 102.32, 100.69], 40, 1));
});
test("valleys throws on period > len", () => {
  assert.throws(() => chartTrends.valleys([100.08, 98.75, 100.14, 98.98], 40, 1));
});
test("peakTrend throws on period > len", () => {
  assert.throws(() => chartTrends.peakTrend([101.26, 102.57, 102.32, 100.69], 40));
});
test("valleyTrend throws on period > len", () => {
  assert.throws(() => chartTrends.valleyTrend([100.08, 98.75, 100.14, 98.98], 40));
});
test("overallTrend throws on empty input", () => {
  assert.throws(() => chartTrends.overallTrend([]));
});
test("breakDownTrends throws on empty input", () => {
  assert.throws(() => chartTrends.breakDownTrends([], 1, 0.75, 0.5, 2.0, 3.0, 1.0, 3.0, 0.7, 3.3));
});
```
(Throw conditions verified against the 1.3.0 source: `peakTrend`/`valleyTrend`
call `peaks`/`valleys` so `period > len` → `InvalidPeriod`; `overallTrend`/
`breakDownTrends` call `assert_non_empty` so `[]` → `EmptyData`.)

### 3e. `CHANGELOG.md`
**Append a bullet** under the existing `## [Unreleased]` → `### Changed` block
that PR 1 created (don't add a second `### Changed` heading):
```
- `chartTrends` wrappers now throw structured `Error`s instead of panicking on
  invalid input: each `.expect("Failed to calculate indicator")` in
  `src/chart_trends.rs` becomes `.map_err(js_err)?`, returning
  `Result<Array, JsValue>` that carries the upstream `TechnicalIndicatorError`
  message. Adds the shared `src/jsutil.rs` `js_err` adapter. Success behavior
  unchanged.
```

## 4. Validate — all must pass
```
cargo fmt --all -- --check
cargo clippy                 # PLAIN clippy — warnings OK; NOT -D warnings (that's PR 8)
npm run build                # all three wasm targets
npm run test:only            # node --test  (npm test = build + test:only)
```
Expected: the new `*throws*` tests pass, **and every pre-existing parity test
still passes unchanged**. If a parity (`deepEqual`) test now fails, the
conversion changed a success path — STOP and report (it shouldn't).

## 5. Scope discipline
Touch only: `src/jsutil.rs` (new), `src/lib.rs` (one `pub mod` line),
`src/chart_trends.rs` (6 fns), `test/chartTrends.node.test.js`, `CHANGELOG.md`.
**Do NOT** touch the JS entry points (`index.js` / `index.node.js` /
`index.web.js`) or `index.d.ts`: wasm-bindgen turns `Result<Array, JsValue>` into
the *same* JS export that now throws on error — the JS name, call signature, and
TS type are unchanged. **Out of scope:** other modules' wrappers (PRs 5a–5h); the
favorable-move bindings (PR 3); any clippy/CI change (PR 8).

## 6. PR report (per `AGENTS.md`)
- **Summary** — convert `chart_trends` wrappers panic→`Result`; add shared `js_err`.
- **Scope** — the five files above; entry points / `index.d.ts` deliberately untouched.
- **Compatibility** — non-breaking: success outputs identical; invalid input now
  throws a structured `Error` (message = upstream `TechnicalIndicatorError`)
  instead of an unrecoverable wasm panic. Stays a minor.
- **Validation** — paste fmt / clippy / build / test results.
- **Changelog** — the bullet above.

## Definition of done
- [ ] `src/jsutil.rs` exists with `pub fn js_err`; `pub mod jsutil;` in `lib.rs`.
- [ ] Zero `.expect()` remain in `src/chart_trends.rs`; all six return `Result<Array, JsValue>`.
- [ ] `#[allow(clippy::too_many_arguments)]` on `break_down_trends` preserved.
- [ ] New throws tests pass; all prior parity tests pass unchanged.
- [ ] fmt / clippy (plain) / build / test green.
- [ ] PR opened against `release/1.3.0`; only the five files touched.
