import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, { otherIndicators, ConstantModelType } from "../index.node.js";

before(async () => {
  await init();
});

describe("otherIndicators.single (parity, one model where applicable)", () => {
  test("returnOnInvestment", () => {
    const out = otherIndicators.single.returnOnInvestment(100.46, 100.53, 1000.0);
    assert.deepEqual(out, [1000.6967947441768, 0.06967947441768274]);
  });

  test("trueRange", () => {
    // Args: previousClose, high, low
    assert.strictEqual(
      otherIndicators.single.trueRange(100.46, 101.12, 100.29),
      0.8299999999999983
    );
    assert.strictEqual(
      otherIndicators.single.trueRange(100.53, 101.3, 100.87),
      0.769999999999996
    );
    assert.strictEqual(
      otherIndicators.single.trueRange(100.38, 100.11, 99.94),
      0.4399999999999977
    );
  });

  test("averageTrueRange (SMA)", () => {
    const close = [100.46, 100.53, 100.38];
    const high = [101.12, 101.3, 100.11];
    const low = [100.29, 100.87, 99.94];
    const out = otherIndicators.single.averageTrueRange(
      close,
      high,
      low,
      ConstantModelType.SimpleMovingAverage
    );
    assert.strictEqual(out, 0.6799999999999974);
  });

  test("internalBarStrength", () => {
    const out = otherIndicators.single.internalBarStrength(102.32, 100.14, 100.55);
    assert.strictEqual(out, 0.1880733944954119);
  });
});

describe("otherIndicators.bulk (parity, one model where applicable)", () => {
  test("returnOnInvestment", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = otherIndicators.bulk.returnOnInvestment(prices, 1000.0);
    assert.deepEqual(out, [
      [1000.6967947441768, 0.06967947441768274],
      [999.2036631495122, -0.14920919128619353],
      [997.3123631296038, -0.18928073321378402],
      [997.5114473422257, 0.01996207206307317],
    ]);
  });

  test("trueRange", () => {
    const close = [100.46, 100.53, 100.38];
    const high = [101.12, 101.3, 100.11];
    const low = [100.29, 100.87, 99.94];
    const out = otherIndicators.bulk.trueRange(close, high, low);
    assert.deepEqual(out, [
      0.8299999999999983,
      0.769999999999996,
      0.4399999999999977,
    ]);
  });

  test("averageTrueRange (SMA, period 3)", () => {
    const close = [100.46, 100.53, 100.38, 100.19, 100.21];
    const high = [101.12, 101.3, 100.11, 100.55, 100.43];
    const low = [100.29, 100.87, 99.94, 99.86, 99.91];
    const out = otherIndicators.bulk.averageTrueRange(
      close,
      high,
      low,
      ConstantModelType.SimpleMovingAverage,
      3
    );
    assert.deepEqual(out, [
      0.6799999999999974,
      0.6333333333333305,
      0.5500000000000019,
    ]);
  });

  test("internalBarStrength", () => {
    const close = [100.55, 99.01, 100.43, 101.0, 101.76];
    const high = [102.32, 100.69, 100.83, 101.73, 102.01];
    const low = [100.14, 98.98, 99.07, 100.1, 99.96];
    const out = otherIndicators.bulk.internalBarStrength(high, low, close);
    assert.deepEqual(out, [
      0.1880733944954119,
      0.017543859649123535,
      0.7727272727272783,
      0.5521472392638039,
      0.8780487804878055,
    ]);
  });

  test("positivityIndicator (SMA, period 5)", () => {
    const open = [5278.24, 5314.48, 5357.8, 5343.81, 5341.22, 5353.0, 5409.13];
    const previousClose = [
      5283.4, 5291.34, 5354.03, 5352.96, 5346.99, 5360.79, 5375.32,
    ];
    const out = otherIndicators.bulk.positivityIndicator(
      open,
      previousClose,
      5,
      ConstantModelType.SimpleMovingAverage
    );
    assert.deepEqual(out, [
      [-0.10791117993487043, 0.026244711276039178],
      [-0.14531440328757447, 0.01671470717528643],
      [0.6289858092169471, 0.05504820197025553],
    ]);
  });
});
