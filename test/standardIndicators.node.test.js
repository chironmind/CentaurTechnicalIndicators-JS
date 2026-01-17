import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, { standardIndicators } from "../index.node.js";

before(async () => {
  await init();
});

describe("standardIndicators.single (parity)", () => {
  test("simpleMovingAverage", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    assert.strictEqual(
      standardIndicators.single.simpleMovingAverage(prices),
      100.352
    );
  });

  test("smoothedMovingAverage", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    assert.strictEqual(
      standardIndicators.single.smoothedMovingAverage(prices),
      100.34228938600666
    );
  });

  test("exponentialMovingAverage", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    assert.strictEqual(
      standardIndicators.single.exponentialMovingAverage(prices),
      100.32810426540287
    );
  });

  test("bollingerBands", () => {
    const prices = [
      99.39, 99.59, 99.68, 99.98, 99.06, 98.39, 99.23, 98.66, 98.88, 98.31, 98.16, 97.87,
      98.74, 99.47, 98.86, 99.73, 100.06, 100.66, 99.69, 100.63,
    ];
    assert.deepEqual(
      standardIndicators.single.bollingerBands(prices),
      [97.73388801467088, 99.25200000000002, 100.77011198532917]
    );
  });

  test("macd", () => {
    const prices = [
      99.39, 99.59, 99.68, 99.98, 99.06, 98.39, 99.23, 98.66, 98.88, 98.31, 98.16, 97.87,
      98.74, 99.47, 98.86, 99.73, 100.06, 100.66, 99.69, 100.63, 99.75, 99.55, 98.8, 98.97,
      98.83, 98.15, 97.42, 96.94, 96.51, 96.71, 96.5, 97.22, 98.03, 98.21,
    ];
    // Updated expectations for centaur_technical_indicators v1.0.0
    // Values changed due to API differences in MACD calculation
    assert.deepEqual(
      standardIndicators.single.macd(prices),
      [-0.8107883516938728, -0.7483558543039736, -0.0624324973898992]
    );
  });

  test("rsi", () => {
    const prices = [
      99.75, 99.55, 98.8, 98.97, 98.83, 98.15, 97.42, 96.94, 96.51, 96.71, 96.5, 97.22,
      98.03, 98.21,
    ];
    assert.strictEqual(standardIndicators.single.rsi(prices), 49.49693728728258);
  });
});

describe("standardIndicators.bulk (parity)", () => {
  test("simpleMovingAverage", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = standardIndicators.bulk.simpleMovingAverage(prices, 4);
    assert.deepEqual(out, [100.3925, 100.39]);
  });

  test("smoothedMovingAverage", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = standardIndicators.bulk.smoothedMovingAverage(prices, 4);
    assert.deepEqual(out, [100.40982857142858, 100.35371428571428]);
  });

  test("exponentialMovingAverage", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = standardIndicators.bulk.exponentialMovingAverage(prices, 4);
    assert.deepEqual(out, [100.41672794117645, 100.32544117647058]);
  });

  test("bollingerBands", () => {
    const prices = [
      99.39, 99.59, 99.68, 99.98, 99.06, 98.39, 99.23, 98.66, 98.88, 98.31, 98.16, 97.87,
      98.74, 99.47, 98.86, 99.73, 100.06, 100.66, 99.69, 100.63, 99.75, 99.55, 98.8,
    ];
    const out = standardIndicators.bulk.bollingerBands(prices);
    assert.deepEqual(out, [
      [97.73388801467088, 99.25200000000002, 100.77011198532917],
      [97.7373030306026, 99.27000000000001, 100.80269696939742],
      [97.73687492346315, 99.268, 100.79912507653685],
      [97.69218538980725, 99.224, 100.75581461019276],
    ]);
  });

  test("macd", () => {
    const prices = [
      99.39, 99.59, 99.68, 99.98, 99.06, 98.39, 99.23, 98.66, 98.88, 98.31, 98.16, 97.87,
      98.74, 99.47, 98.86, 99.73, 100.06, 100.66, 99.69, 100.63, 99.75, 99.55, 98.8, 98.97,
      98.83, 98.15, 97.42, 96.94, 96.51, 96.71, 96.5, 97.22, 98.03, 98.21, 98.05, 98.24,
    ];
    const out = standardIndicators.bulk.macd(prices);
    assert.deepEqual(out, [
      [-0.6285719796983358, -0.6158898367280627, -0.012682142970273036],
      [-0.54985540794776, -0.61936157195289, 0.06950616400512999],
      [-0.4749341506892648, -0.6001186622390476, 0.12518451154978283],
    ]);
  });

  test("rsi", () => {
    const prices = [
      99.75, 99.55, 98.8, 98.97, 98.83, 98.15, 97.42, 96.94, 96.51, 96.71, 96.5, 97.22,
      98.03, 98.21, 98.05, 98.24,
    ];
    const out = standardIndicators.bulk.rsi(prices);
    assert.deepEqual(out, [49.49693728728258, 51.7387808206744, 49.93948387240627]);
  });
});
