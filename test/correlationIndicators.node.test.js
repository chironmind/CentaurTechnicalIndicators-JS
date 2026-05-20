import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, {
  correlationIndicators,
  ConstantModelType,
  DeviationModel,
} from "../index.node.js";

before(async () => {
  await init();
});

describe("correlationIndicators.single (parity with Rust tests, excluding Personalised)", () => {
  const A = [100.46, 100.53, 100.38, 100.19, 100.21];
  const B = [74.71, 71.98, 68.33, 63.6, 65.92];

  test("SMA + StdDev", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.StandardDeviation
    );
    assert.strictEqual(v, 0.9042213658878326);
  });

  test("SmoothedMA + StdDev", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SmoothedMovingAverage,
      DeviationModel.StandardDeviation
    );
    assert.strictEqual(v, 0.9791080346628417);
  });

  test("EMA + StdDev", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.ExponentialMovingAverage,
      DeviationModel.StandardDeviation
    );
    assert.strictEqual(v, 1.121845018991745);
  });

  test("Median + StdDev", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingMedian,
      DeviationModel.StandardDeviation
    );
    assert.strictEqual(v, 0.8763922185678863);
  });

  test("Mode + StdDev", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingMode,
      DeviationModel.StandardDeviation
    );
    assert.strictEqual(v, 0.8439113000163907);
  });

  test("SMA + MeanAD", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.MeanAbsoluteDeviation
    );
    assert.strictEqual(v, 1.1165699299573548);
  });

  test("SMA + MedianAD", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.MedianAbsoluteDeviation
    );
    assert.strictEqual(v, 0.8918502283104672);
  });

  test("SMA + ModeAD", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.ModeAbsoluteDeviation
    );
    assert.strictEqual(v, Infinity);
  });

  test("SMA + UlcerIndex", () => {
    const v = correlationIndicators.single.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.UlcerIndex
    );
    assert.strictEqual(v, 0.23702330943345767);
  });
});

describe("correlationIndicators.bulk (parity with Rust tests)", () => {
  test("SMA + StdDev, period 5", () => {
    const A = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const B = [74.71, 71.98, 68.33, 63.6, 65.92, 69.54, 73.81];
    const out = correlationIndicators.bulk.correlateAssetPrices(
      A,
      B,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.StandardDeviation,
      5
    );
    assert.deepEqual(out, [
      0.9042213658878326,
      0.9268640506930989,
      0.5300870380836703,
    ]);
  });

  // Optional error parity (commented out; will throw)
  // test("mismatched lengths panic", () => {
  //   assert.throws(() =>
  //     correlationIndicators.bulk.correlateAssetPrices(
  //       [1,2,3], [1,2], ConstantModelType.SimpleMovingAverage, DeviationModel.StandardDeviation, 2
  //     )
  //   );
  // });
});
