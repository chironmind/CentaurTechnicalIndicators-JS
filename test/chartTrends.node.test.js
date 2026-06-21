import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, { chartTrends } from "../index.node.js";

before(async () => {
  await init();
});

describe("chartTrends (parity with Rust tests)", () => {
  test("peaks_single_peak", () => {
    const highs = [101.26, 102.57, 102.32, 100.69];
    const out = chartTrends.peaks(highs, 4, 1);
    assert.deepEqual(out, [[102.57, 1]]);
  });

  test("peaks_multiple_peaks", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const out = chartTrends.peaks(highs, 4, 1);
    assert.deepEqual(out, [
      [102.57, 1],
      [102.01, 6],
    ]);
  });

  test("peaks_multiple_peaks_same_period", () => {
    const highs = [101.26, 102.57, 102.57, 100.69, 100.83, 101.73, 102.01];
    const out = chartTrends.peaks(highs, 4, 1);
    assert.deepEqual(out, [
      [102.57, 2],
      [102.01, 6],
    ]);
  });

  test("valleys_single_valley", () => {
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const out = chartTrends.valleys(lows, 7, 1);
    assert.deepEqual(out, [[98.75, 1]]);
  });

  test("valleys_multiple_valleys", () => {
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const out = chartTrends.valleys(lows, 4, 1);
    assert.deepEqual(out, [
      [98.75, 1],
      [98.98, 3],
    ]);
  });

  test("valleys_multiple_valleys_same_period", () => {
    const lows = [98.75, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const out = chartTrends.valleys(lows, 4, 1);
    assert.deepEqual(out, [
      [98.75, 1],
      [98.98, 3],
    ]);
  });

  test("peak_trend", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const out = chartTrends.peakTrend(highs, 4);
    assert.deepEqual(out, [-0.11199999999999762, 102.68199999999999]);
  });

  test("valley_trend", () => {
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const out = chartTrends.valleyTrend(lows, 4);
    assert.deepEqual(out, [0.11500000000000199, 98.635]);
  });

  test("overall_trend", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = chartTrends.overallTrend(prices);
    assert.deepEqual(out, [-0.010000000000000852, 100.372]);
  });

  test("break_down_trends_std_dev", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = chartTrends.breakDownTrends(
      prices,
      1,    // max_outliers
      0.75, // soft_adj_r_squared_minimum
      0.5,  // hard_adj_r_squared_minimum
      2.0,  // soft_rmse_multiplier
      3.0,  // hard_rmse_multiplier
      1.0,  // soft_durbin_watson_min
      3.0,  // soft_durbin_watson_max
      0.7,  // hard_durbin_watson_min
      3.3   // hard_durbin_watson_max
    );
    assert.deepEqual(out, [
      [0, 2, 0.16499999999999915, 100.23166666666665],
      [2, 4, -0.1700000000000017, 100.87666666666668],
    ]);
  });

  // Error-handling parity: invalid input now throws a structured Error
  // (Result<Array, JsValue>) instead of panicking the wasm instance.
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
    assert.throws(() =>
      chartTrends.breakDownTrends([], 1, 0.75, 0.5, 2.0, 3.0, 1.0, 3.0, 0.7, 3.3)
    );
  });

  test("peakFavorableMove basic (A1)", () => {
    assert.strictEqual(chartTrends.peakFavorableMove([107, 104, 100, 102], 0, 3), 7.0);
  });
  test("valleyFavorableMove basic (A1)", () => {
    assert.strictEqual(
      chartTrends.valleyFavorableMove([100, 102, 107, 104, 100], 0, 3),
      7.0
    );
  });
  test("peakFavorableMove not floored (A2)", () => {
    assert.strictEqual(chartTrends.peakFavorableMove([100, 101, 102, 103], 0, 3), -1.0);
  });
  test("valleyFavorableMove not floored (A2)", () => {
    assert.strictEqual(chartTrends.valleyFavorableMove([105, 104, 103, 102], 0, 3), -1.0);
  });
  test("valleyFavorableMove window boundary (A3)", () => {
    assert.strictEqual(chartTrends.valleyFavorableMove([10, 1, 1, 20, 99], 0, 3), 10.0);
  });
  test("peakFavorableMove window boundary (A3)", () => {
    assert.strictEqual(chartTrends.peakFavorableMove([50, 99, 99, 30, 1], 0, 3), 20.0);
  });
  test("peakFavorableMove throws when window past end (A4)", () => {
    assert.throws(() => chartTrends.peakFavorableMove([100, 101, 102], 1, 3));
  });
  test("peakFavorableMove throws on period 0 (A4)", () => {
    assert.throws(() => chartTrends.peakFavorableMove([100, 101, 102, 103], 0, 0));
  });
  test("valleyFavorableMove throws on period 0 (A4)", () => {
    assert.throws(() => chartTrends.valleyFavorableMove([100, 101, 102, 103], 0, 0));
  });
  test("peakFavorableMove throws on empty input (A4)", () => {
    assert.throws(() => chartTrends.peakFavorableMove([], 0, 3));
  });
  test("valleyFavorableMove throws on empty input (A4)", () => {
    assert.throws(() => chartTrends.valleyFavorableMove([], 0, 3));
  });
});
