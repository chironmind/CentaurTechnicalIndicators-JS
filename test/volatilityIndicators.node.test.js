import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, {
  volatilityIndicators,
  ConstantModelType,
} from "../index.node.js";

before(async () => {
  await init();
});

describe("volatilityIndicators.single (parity)", () => {
  test("ulcerIndex", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = volatilityIndicators.single.ulcerIndex(prices);
    assert.strictEqual(out, 0.21816086938686668);
  });
});

describe("volatilityIndicators.bulk (parity, one model where applicable)", () => {
  test("ulcerIndex (period 5)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const out = volatilityIndicators.bulk.ulcerIndex(prices, 5);
    assert.deepEqual(out, [
      0.21816086938686668,
      0.2373213243162752,
      0.12490478596260104,
    ]);
  });

  test("volatilitySystem (SMA, long start)", () => {
    const highs = [100.83, 100.91, 101.03, 101.27, 100.52];
    const lows = [100.59, 100.72, 100.84, 100.91, 99.85];
    const close = [100.76, 100.88, 100.96, 101.14, 100.01];
    const out = volatilityIndicators.bulk.volatilitySystem(
      close,
      highs,
      lows,
      3,
      2.0,
      ConstantModelType.SimpleMovingAverage
    );
    assert.deepEqual(out, [100.54666666666667, 100.46666666666667, 101.95333333333333]);
  });

  test("volatilitySystem (SMA, short start)", () => {
    const highs = [101.27, 101.03, 100.91, 100.83, 101.54];
    const lows = [100.91, 100.84, 100.72, 100.59, 100.68];
    const close = [101.14, 100.96, 100.88, 100.76, 101.37];
    const out = volatilityIndicators.bulk.volatilitySystem(
      close,
      highs,
      lows,
      3,
      2.0,
      ConstantModelType.SimpleMovingAverage
    );
    assert.deepEqual(out, [101.37333333333332, 101.29333333333332, 99.9]);
  });
});
