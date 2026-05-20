// Enum-variant drift guard.
//
// The Rust core defines six enums that this binding mirrors with hand-written
// wasm_bindgen enums in src/lib.rs (the parameterized variants from the Rust
// core can't cross the wasm-bindgen boundary, so the JS-side lists are
// curated unit-variant subsets).
//
// Without a guard here, an upstream Rust addition or removal would silently
// stay behind: the binding compiles, the existing functions still work, and
// the new variant just wouldn't appear on the JS side. This test fails fast
// when the JS-side variant set drifts from the expected canonical list.
//
// What to do when this test fails:
//   - If a Rust unit variant was ADDED upstream: mirror it in src/lib.rs's
//     #[wasm_bindgen] enum (with a matching From<JsEnum> for RustEnum arm),
//     then add it to the expected list below. Do NOT skip the test.
//   - If a Rust unit variant was REMOVED upstream: same direction.
//   - If a Rust parameterized variant was added: do nothing on the JS side
//     (it can't cross the boundary). Update index.d.ts JSDoc @remarks to
//     mention the new gap.
//
// Why the filter on isNaN(Number(k)): wasm-bindgen exports unit-variant enums
// as JS objects with BOTH forward (name -> number) and reverse (number-string
// -> name) entries. Object.keys() gives both. We want only the variant names,
// which are the keys that aren't parseable as numbers.
//
// CR-1 from the Rust ROADMAP delegates this check to this repo (the binding
// is the only place where the variant set is concretely known on the JS side).

import { test } from "node:test";
import assert from "node:assert/strict";
import init, {
  ConstantModelType,
  DeviationModel,
  Position,
  MovingAverageType,
  CentralPoint,
  DeviationAggregate,
} from "../index.node.js";

await init();

function variantNames(enumValue) {
  return Object.keys(enumValue)
    .filter((k) => Number.isNaN(Number(k)))
    .sort();
}

test("ConstantModelType has expected unit variants", () => {
  assert.deepEqual(variantNames(ConstantModelType), [
    "ExponentialMovingAverage",
    "SimpleMovingAverage",
    "SimpleMovingMedian",
    "SimpleMovingMode",
    "SmoothedMovingAverage",
  ]);
});

test("DeviationModel has expected unit variants", () => {
  assert.deepEqual(variantNames(DeviationModel), [
    "CauchyIQRScale",
    "LaplaceStdEquivalent",
    "LogStandardDeviation",
    "MeanAbsoluteDeviation",
    "MedianAbsoluteDeviation",
    "ModeAbsoluteDeviation",
    "StandardDeviation",
    "UlcerIndex",
  ]);
});

test("Position has expected unit variants", () => {
  assert.deepEqual(variantNames(Position), ["Long", "Short"]);
});

test("MovingAverageType has expected unit variants", () => {
  assert.deepEqual(variantNames(MovingAverageType), [
    "Exponential",
    "Simple",
    "Smoothed",
  ]);
});

test("CentralPoint has expected unit variants", () => {
  assert.deepEqual(variantNames(CentralPoint), ["Mean", "Median", "Mode"]);
});

test("DeviationAggregate has expected unit variants", () => {
  assert.deepEqual(variantNames(DeviationAggregate), [
    "Mean",
    "Median",
    "Mode",
  ]);
});
