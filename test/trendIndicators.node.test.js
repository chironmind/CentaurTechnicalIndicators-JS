import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, {
  trendIndicators,
  ConstantModelType,
  Position,
} from "../index.node.js";

before(async () => {
  await init();
});

describe("trendIndicators.single (parity)", () => {
  test("aroonUp", () => {
    const highs = [101.26, 102.57, 102.32, 100.69];
    assert.strictEqual(trendIndicators.single.aroonUp(highs), 33.33333333333333);
  });

  test("aroonDown", () => {
    const lows = [100.08, 98.75, 100.14, 98.98];
    assert.strictEqual(trendIndicators.single.aroonDown(lows), 33.33333333333333);
  });

  test("aroonOscillator", () => {
    assert.strictEqual(
      trendIndicators.single.aroonOscillator(33.33333333333333, 33.33333333333333),
      0.0
    );
  });

  test("aroonIndicator", () => {
    const highs = [101.26, 102.57, 102.32, 100.69];
    const lows = [100.08, 98.75, 100.14, 98.98];
    assert.deepEqual(trendIndicators.single.aroonIndicator(highs, lows), [
      33.33333333333333, 33.33333333333333, 0.0,
    ]);
  });

  test("longParabolicTimePriceSystem", () => {
    assert.strictEqual(
      trendIndicators.single.longParabolicTimePriceSystem(100.0, 110.0, 0.06, 105.0),
      100.6
    );
  });

  test("shortParabolicTimePriceSystem", () => {
    assert.strictEqual(
      trendIndicators.single.shortParabolicTimePriceSystem(100.0, 90.0, 0.04, 95.0),
      99.6
    );
  });

  test("volumePriceTrend (no previous)", () => {
    assert.strictEqual(
      trendIndicators.single.volumePriceTrend(99.01, 100.55, 743.0, 0.0),
      -11.379612133266974
    );
  });

  test("trueStrengthIndex (EMA/EMA, first=5)", () => {
    const prices = [100.14, 98.98, 99.07, 100.1, 99.96, 99.56, 100.72, 101.16];
    const out = trendIndicators.single.trueStrengthIndex(
      prices,
      ConstantModelType.ExponentialMovingAverage,
      5,
      ConstantModelType.ExponentialMovingAverage
    );
    assert.strictEqual(out, 0.6031084483806584);
  });
});

describe("trendIndicators.bulk (parity, one model where applicable)", () => {
  test("aroonUp", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const out = trendIndicators.bulk.aroonUp(highs, 4);
    assert.deepEqual(out, [33.33333333333333, 0.0, 0.0, 100.0]);
  });

  test("aroonDown", () => {
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const out = trendIndicators.bulk.aroonDown(lows, 4);
    assert.deepEqual(out, [33.33333333333333, 0.0, 33.33333333333333, 0.0]);
  });

  test("aroonOscillator", () => {
    const up = [33.33333333333333, 0.0, 0.0, 100.0];
    const down = [33.33333333333333, 0.0, 33.33333333333333, 0.0];
    const out = trendIndicators.bulk.aroonOscillator(up, down);
    assert.deepEqual(out, [0.0, 0.0, -33.33333333333333, 100.0]);
  });

  test("aroonIndicator", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const out = trendIndicators.bulk.aroonIndicator(highs, lows, 4);
    assert.deepEqual(out, [
      [33.33333333333333, 33.33333333333333, 0.0],
      [0.0, 0.0, 0.0],
      [0.0, 33.33333333333333, -33.33333333333333],
      [100.0, 0.0, 100.0],
    ]);
  });

  test("parabolicTimePriceSystem (Long, no previous)", () => {
    const highs = [100.64, 102.39, 101.51, 99.48, 96.93];
    const lows = [95.92, 96.77, 95.84, 91.22, 89.12];
    const out = trendIndicators.bulk.parabolicTimePriceSystem(
      highs, lows,
      0.02, 0.2, 0.02,
      Position.Long,
      0.0
    );
    assert.deepEqual(out, [95.92, 95.92, 102.39, 101.9432, 101.17380800000001]);
  });

  test("directionalMovementSystem (SMA, period 3)", () => {
    const highs = [100.83,100.91,101.03,101.27,100.52,101.27,101.03,100.91,100.83];
    const lows  = [100.59,100.72,100.84,100.91, 99.85,100.91,100.84,100.72,100.59];
    const close = [100.76,100.88,100.96,101.14,100.01,101.14,100.96,100.88,100.76];
    const out = trendIndicators.bulk.directionalMovementSystem(
      highs, lows, close, 3, ConstantModelType.SimpleMovingAverage
    );
    assert.deepEqual(out, [
      [101.35135135135205, 25.675675675675546, 27.733956062965074, 39.31871283052075],
      [0.0, 51.61290322580615, 59.92907801418446, 42.118401465704885],
    ]);
  });

  test("volumePriceTrend (no previous)", () => {
    const prices = [100.55, 99.01, 100.43, 101.0, 101.76];
    const volume = [743.0, 1074.0, 861.0, 966.0];
    const out = trendIndicators.bulk.volumePriceTrend(prices, volume, 0.0);
    assert.deepEqual(out, [
      -11.379612133266974,
      4.023680463440446,
      8.910367708287545,
      16.1792785993767,
    ]);
  });

  test("volumePriceTrend (same-length arrays)", () => {
    // Test with same-length arrays - first volume should be skipped automatically
    const prices = [100.55, 99.01, 100.43, 101.0, 101.76];
    const volume = [999.0, 743.0, 1074.0, 861.0, 966.0]; // First element (999.0) should be ignored
    const out = trendIndicators.bulk.volumePriceTrend(prices, volume, 0.0);
    // Should give same result as if we passed volume[1:]
    assert.deepEqual(out, [
      -11.379612133266974,
      4.023680463440446,
      8.910367708287545,
      16.1792785993767,
    ]);
  });

  test("trueStrengthIndex (EMA/EMA, 5/3)", () => {
    const prices = [100.14,98.98,99.07,100.1,99.96,99.56,100.72,101.16,100.76,100.3];
    const out = trendIndicators.bulk.trueStrengthIndex(
      prices,
      ConstantModelType.ExponentialMovingAverage, 5,
      ConstantModelType.ExponentialMovingAverage, 3
    );
    assert.deepEqual(out, [
      0.6031084483806584,
      0.43792017300550673,
      0.06758060421426838,
    ]);
  });
});
