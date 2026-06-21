import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, {
  candleIndicators,
  ConstantModelType,
  DeviationModel,
} from "../index.node.js";

before(async () => {
  await init();
});

describe("candleIndicators.single (parity with Rust tests)", () => {
  test("movingConstantEnvelopes (EMA, 3.0)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = candleIndicators.single.movingConstantEnvelopes(
      prices,
      ConstantModelType.ExponentialMovingAverage,
      3.0
    );
    assert.deepEqual(out, [
      97.28056445497631,
      100.28924170616115,
      103.29791895734598,
    ]);
  });

  test("mcginleyDynamicEnvelopes (diff 3.0, prev 0.0)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = candleIndicators.single.mcginleyDynamicEnvelopes(
      prices,
      3.0,
      0.0
    );
    assert.deepEqual(out, [97.2037, 100.21, 103.21629999999999]);
  });

  test("movingConstantBands (SMA, StdDev, x2)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = candleIndicators.single.movingConstantBands(
      prices,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.StandardDeviation,
      2.0
    );
    assert.deepEqual(out, [
      100.08489778893514,
      100.354,
      100.62310221106486,
    ]);
  });

  test("mcginleyDynamicBands (StdDev, x2, prev 0.0)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = candleIndicators.single.mcginleyDynamicBands(
      prices,
      DeviationModel.StandardDeviation,
      2.0,
      0.0
    );
    assert.deepEqual(out, [99.94089778893513, 100.21, 100.47910221106486]);
  });

  test("ichimokuCloud (3,5,7)", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const close = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const out = candleIndicators.single.ichimokuCloud(
      highs,
      lows,
      close,
      3,
      5,
      7
    );
    assert.deepEqual(out, [
      100.595,
      100.66,
      100.65,
      100.53999999999999,
      100.38,
    ]);
  });

  test("donchianChannels", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07];
    const out = candleIndicators.single.donchianChannels(highs, lows);
    assert.deepEqual(out, [98.75, 100.66, 102.57]);
  });

  test("keltnerChannel (EMA,SMA,x2)", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07];
    const close = [100.94, 101.27, 100.55, 99.01, 100.43];
    const out = candleIndicators.single.keltnerChannel(
      highs,
      lows,
      close,
      ConstantModelType.ExponentialMovingAverage,
      ConstantModelType.SimpleMovingAverage,
      2.0
    );
    assert.deepEqual(out, [
      95.99663507109007,
      100.25663507109006,
      104.51663507109005,
    ]);
  });

  test("supertrend (SMA,x2)", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07];
    const close = [100.94, 101.27, 100.55, 99.01, 100.43];
    const out = candleIndicators.single.supertrend(
      highs,
      lows,
      close,
      ConstantModelType.SimpleMovingAverage,
      2.0
    );
    assert.strictEqual(out, 104.91999999999999);
  });
});

describe("candleIndicators.bulk (parity with Rust tests)", () => {
  test("movingConstantEnvelopes (EMA, 3.0, period 5)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const out = candleIndicators.bulk.movingConstantEnvelopes(
      prices,
      ConstantModelType.ExponentialMovingAverage,
      3.0,
      5
    );
    assert.deepEqual(out, [
      [97.28056445497631, 100.28924170616115, 103.29791895734598],
      [97.28364454976304, 100.29241706161139, 103.30118957345974],
      [97.26737061611377, 100.27563981042657, 103.28390900473937],
    ]);
  });

  test("mcginleyDynamicEnvelopes (3.0, prev 0.0, period 5)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const out = candleIndicators.bulk.mcginleyDynamicEnvelopes(
      prices,
      3.0,
      0.0,
      5
    );
    assert.deepEqual(out, [
      [97.2037, 100.21, 103.21629999999999],
      [97.22494655733786, 100.23190366735862, 103.23886077737939],
      [97.23425935799065, 100.24150449277387, 103.24874962755709],
    ]);
  });

  test("movingConstantBands (SMA, StdDev, x2, period 5)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const out = candleIndicators.bulk.movingConstantBands(
      prices,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.StandardDeviation,
      2.0,
      5
    );
    assert.deepEqual(out, [
      [100.08489778893514, 100.354, 100.62310221106486],
      [100.07858132649292, 100.326, 100.57341867350706],
      [100.1359428687999, 100.276, 100.41605713120009],
    ]);
  });

  test("mcginleyDynamicBands (StdDev, x2, prev 0.0, period 5)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const out = candleIndicators.bulk.mcginleyDynamicBands(
      prices,
      DeviationModel.StandardDeviation,
      2.0,
      0.0,
      5
    );
    assert.deepEqual(out, [
      [99.94089778893513, 100.21, 100.47910221106486],
      [99.98448499385155, 100.23190366735862, 100.47932234086569],
      [100.10144736157378, 100.24150449277387, 100.38156162397397],
    ]);
  });

  test("ichimokuCloud (3,5,7)", () => {
    const highs = [
      101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01, 101.11, 100.75,
    ];
    const lows = [
      100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96, 100.21, 100.48,
    ];
    const close = [
      100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28, 100.49, 100.52,
    ];
    const out = candleIndicators.bulk.ichimokuCloud(highs, lows, close, 3, 5, 7);
    assert.deepEqual(out, [
      [100.595, 100.66, 100.65, 100.53999999999999, 100.38],
      [100.74000000000001, 100.66, 100.495, 100.985, 100.19],
      [100.76249999999999, 100.65, 100.53999999999999, 100.985, 100.21],
    ]);
  });

  test("donchianChannels (period 5)", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const out = candleIndicators.bulk.donchianChannels(highs, lows, 5);
    assert.deepEqual(out, [
      [98.75, 100.66, 102.57],
      [98.75, 100.66, 102.57],
      [98.98, 100.65, 102.32],
    ]);
  });

  test("keltnerChannel (EMA,SMA,x2, period 5)", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const close = [100.94, 101.27, 100.55, 99.01, 100.43, 101.0, 101.76];
    const out = candleIndicators.bulk.keltnerChannel(
      highs,
      lows,
      close,
      ConstantModelType.ExponentialMovingAverage,
      ConstantModelType.SimpleMovingAverage,
      2.0,
      5
    );
    assert.deepEqual(out, [
      [95.99663507109007, 100.25663507109006, 104.51663507109005],
      [96.05480252764615, 100.49480252764614, 104.93480252764614],
      [97.03152290679306, 100.76352290679306, 104.49552290679306],
    ]);
  });

  test("supertrend (SMA,x2, period 5)", () => {
    const highs = [101.26, 102.57, 102.32, 100.69, 100.83, 101.73, 102.01];
    const lows = [100.08, 98.75, 100.14, 98.98, 99.07, 100.1, 99.96];
    const close = [100.94, 101.27, 100.55, 99.01, 100.43, 101.0, 101.76];
    const out = candleIndicators.bulk.supertrend(
      highs,
      lows,
      close,
      ConstantModelType.SimpleMovingAverage,
      2.0,
      5
    );
    assert.deepEqual(out, [104.91999999999999, 105.1, 104.382]);
  });
});

describe("candleIndicators error handling (throws Error, not panic)", () => {
  const isNonEmptyError = (err) =>
    err instanceof Error && typeof err.message === "string" && err.message.length > 0;

  test("single.movingConstantEnvelopes throws on empty input", () => {
    assert.throws(
      () =>
        candleIndicators.single.movingConstantEnvelopes(
          [],
          ConstantModelType.ExponentialMovingAverage,
          3.0
        ),
      isNonEmptyError
    );
  });

  test("single.donchianChannels throws on mismatched high/low lengths", () => {
    assert.throws(
      () => candleIndicators.single.donchianChannels([101.26, 102.57], [100.08]),
      isNonEmptyError
    );
  });

  test("single.supertrend throws on empty input", () => {
    assert.throws(
      () =>
        candleIndicators.single.supertrend(
          [],
          [],
          [],
          ConstantModelType.SimpleMovingAverage,
          2.0
        ),
      isNonEmptyError
    );
  });

  test("bulk.movingConstantEnvelopes throws when period exceeds series length", () => {
    assert.throws(
      () =>
        candleIndicators.bulk.movingConstantEnvelopes(
          [100.46, 100.53, 100.38],
          ConstantModelType.ExponentialMovingAverage,
          3.0,
          5
        ),
      isNonEmptyError
    );
  });

  test("bulk.donchianChannels throws on mismatched high/low lengths", () => {
    assert.throws(
      () =>
        candleIndicators.bulk.donchianChannels(
          [101.26, 102.57, 102.32],
          [100.08, 98.75],
          2
        ),
      isNonEmptyError
    );
  });
});
