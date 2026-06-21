import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

import init, {
  momentumIndicators,
  ConstantModelType,
  DeviationModel,
} from "../index.node.js";

before(async () => {
  await init();
});

describe("momentumIndicators.single (parity, one model each)", () => {
  test("relativeStrengthIndex (SMA)", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19];
    const out = momentumIndicators.single.relativeStrengthIndex(
      prices,
      ConstantModelType.SimpleMovingAverage
    );
    assert.strictEqual(out, 49.2537313432832);
  });

  test("stochasticOscillator", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.34];
    assert.strictEqual(
      momentumIndicators.single.stochasticOscillator(prices),
      42.42424242424281
    );
  });

  // 1.3.0 regression lock: all-NaN input returns NaN (1.2.2 panicked).
  test("stochasticOscillator all-NaN -> NaN", () => {
    assert.ok(
      Number.isNaN(momentumIndicators.single.stochasticOscillator([NaN, NaN, NaN]))
    );
  });

  test("slowStochastic (SMA)", () => {
    const stochastics = [0.0, 5.882352941175241, 38.23529411764534, 47.36842105263394];
    const out = momentumIndicators.single.slowStochastic(
      stochastics,
      ConstantModelType.SimpleMovingAverage
    );
    assert.strictEqual(out, 22.871517027863632);
  });

  test("slowestStochastic (SMA)", () => {
    const slow = [0.0, 5.882352941175241, 38.23529411764534, 47.36842105263394];
    const out = momentumIndicators.single.slowestStochastic(
      slow,
      ConstantModelType.SimpleMovingAverage
    );
    assert.strictEqual(out, 22.871517027863632);
  });

  test("williamsPercentR", () => {
    const high = [100.93, 101.58, 101.25];
    const low = [100.37, 100.57, 100.94];
    const close = 101.13;
    assert.strictEqual(
      momentumIndicators.single.williamsPercentR(high, low, close),
      -37.190082644628525
    );
  });

  test("moneyFlowIndex", () => {
    const prices = [100.2, 100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const volume = [1200, 1400, 1450, 1100, 900, 875, 1025, 1100];
    assert.strictEqual(
      momentumIndicators.single.moneyFlowIndex(prices, volume),
      63.40886336843541
    );
  });

  test("rateOfChange", () => {
    assert.strictEqual(
      momentumIndicators.single.rateOfChange(100.46, 100.2),
      0.25948103792414257
    );
  });

  test("onBalanceVolume", () => {
    assert.strictEqual(
      momentumIndicators.single.onBalanceVolume(120, 100, 1500, 0),
      1500
    );
  });

  test("commodityChannelIndex (SMA + MeanAD, k=0.015)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = momentumIndicators.single.commodityChannelIndex(
      prices,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.MeanAbsoluteDeviation,
      0.015
    );
    assert.strictEqual(out, -77.92207792208092);
  });

  test("mcginleyDynamicCommodityChannelIndex (no previous)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = momentumIndicators.single.mcginleyDynamicCommodityChannelIndex(
      prices,
      0.0,
      DeviationModel.MeanAbsoluteDeviation,
      0.015
    );
    assert.deepEqual(out, [0.0, 100.21]);
  });

  test("macdLine (EMA/EMA, short=3)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = momentumIndicators.single.macdLine(
      prices,
      3,
      ConstantModelType.ExponentialMovingAverage,
      ConstantModelType.ExponentialMovingAverage
    );
    assert.strictEqual(out, -0.06067027758972188);
  });

  test("signalLine (EMA)", () => {
    const macds = [-0.06067027758972188, -0.022417061611406552, 0.005788761002008869];
    const out = momentumIndicators.single.signalLine(
      macds,
      ConstantModelType.ExponentialMovingAverage
    );
    assert.strictEqual(out, -0.011764193829214216);
  });

  test("mcginleyDynamicMacdLine (no previous)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = momentumIndicators.single.mcginleyDynamicMacdLine(prices, 3, 0.0, 0.0);
    assert.deepEqual(out, [0.0, 100.21, 100.21]);
  });

  test("chaikinOscillator (EMA/EMA, short=3)", () => {
    const highs = [103.0, 102.0, 105.0, 109.0, 106.0];
    const lows = [99.0, 99.0, 100.0, 103.0, 98.0];
    const close = [102.0, 100.0, 103.0, 106.0, 100.0];
    const volume = [1000.0, 1500.0, 1200.0, 1500.0, 2000.0];
    const out = momentumIndicators.single.chaikinOscillator(
      highs,
      lows,
      close,
      volume,
      3,
      0.0,
      ConstantModelType.ExponentialMovingAverage,
      ConstantModelType.ExponentialMovingAverage
    );
    assert.deepEqual(out, [-179.95937711577525, -760.0]);
  });

  test("percentagePriceOscillator (EMA, short=3)", () => {
    const prices = [100.01, 100.44, 100.39, 100.63, 100.71];
    const out = momentumIndicators.single.percentagePriceOscillator(
      prices,
      3,
      ConstantModelType.ExponentialMovingAverage
    );
    assert.strictEqual(out, 0.08979623002617415);
  });

  test("chandeMomentumOscillator", () => {
    const prices = [100.01, 100.44, 100.39, 100.63, 100.71];
    const out = momentumIndicators.single.chandeMomentumOscillator(prices);
    assert.strictEqual(out, 87.50000000000044);
  });
});

describe("momentumIndicators.bulk (parity, one model each)", () => {
  test("relativeStrengthIndex (SMA, period 5)", () => {
    const prices = [100.2,100.46,100.53,100.38,100.19,100.21,100.32,100.28];
    const out = momentumIndicators.bulk.relativeStrengthIndex(
      prices,
      ConstantModelType.SimpleMovingAverage,
      5
    );
    assert.deepEqual(out, [
      49.2537313432832,
      20.930232558140005,
      27.6595744680842,
      36.111111111111335,
    ]);
  });

  test("stochasticOscillator (period 5)", () => {
    const prices = [100.2,100.46,100.53,100.38,100.19,100.21,100.32,100.28];
    const out = momentumIndicators.bulk.stochasticOscillator(prices, 5);
    assert.deepEqual(out, [0.0, 5.882352941175241, 38.23529411764534, 47.36842105263394]);
  });

  test("slowStochastic (SMA, period 3)", () => {
    const stoch = [0.0, 5.882352941175241, 38.23529411764534, 47.36842105263394];
    const out = momentumIndicators.bulk.slowStochastic(
      stoch,
      ConstantModelType.SimpleMovingAverage,
      3
    );
    assert.deepEqual(out, [14.705882352940193, 30.49535603715151]);
  });

  test("slowestStochastic (SMA, period 3)", () => {
    const slow = [0.0, 5.882352941175241, 38.23529411764534, 47.36842105263394];
    const out = momentumIndicators.bulk.slowestStochastic(
      slow,
      ConstantModelType.SimpleMovingAverage,
      3
    );
    assert.deepEqual(out, [14.705882352940193, 30.49535603715151]);
  });

  test("williamsPercentR (period 3)", () => {
    const high = [100.93, 101.58, 101.25, 101.72];
    const low = [100.37, 100.57, 100.94, 100.89];
    const close = [100.49, 101.06, 101.13, 100.95];
    const out = momentumIndicators.bulk.williamsPercentR(high, low, close, 3);
    assert.deepEqual(out, [-37.190082644628525, -66.95652173912976]);
  });

  test("moneyFlowIndex (period 5)", () => {
    const prices = [100.2,100.46,100.53,100.38,100.19,100.21,100.32,100.28];
    const volume = [1200,1400,1450,1100,900,875,1025,1100];
    const out = momentumIndicators.bulk.moneyFlowIndex(prices, volume, 5);
    assert.deepEqual(out, [
      58.811420498704834,
      33.5840199520207,
      26.291946512503486,
      54.5117755343317,
    ]);
  });

  test("rateOfChange", () => {
    const prices = [100.2, 100.46, 100.38, 100.19, 100.32, 100.32];
    const out = momentumIndicators.bulk.rateOfChange(prices);
    assert.deepEqual(out, [
      0.25948103792414257,
      -0.07963368504877394,
      -0.18928073321378536,
      0.12975346841001642,
      0.0,
    ]);
  });

  test("onBalanceVolume (no previous)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const volume = [1400, 1450, 1100, 900, 875];
    const out = momentumIndicators.bulk.onBalanceVolume(prices, volume, 0.0);
    assert.deepEqual(out, [1450.0, 350.0, -550.0, 325.0]);
  });

  test("commodityChannelIndex (SMA+MeanAD, k=0.015, period 3)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21];
    const out = momentumIndicators.bulk.commodityChannelIndex(
      prices,
      ConstantModelType.SimpleMovingAverage,
      DeviationModel.MeanAbsoluteDeviation,
      0.015,
      3
    );
    assert.deepEqual(out, [-100.0, -100.00000000000804, -41.66666666666519]);
  });

  test("mcginleyDynamicCommodityChannelIndex (no previous, period 5)", () => {
    const prices = [100.46, 100.53, 100.38, 100.19, 100.21, 100.32, 100.28];
    const out = momentumIndicators.bulk.mcginleyDynamicCommodityChannelIndex(
      prices,
      0.0,
      DeviationModel.MeanAbsoluteDeviation,
      0.015,
      5
    );
    assert.deepEqual(out, [
      [0.0, 100.21],
      [56.90977560811997, 100.23190366735862],
      [42.20998599356397, 100.24150449277387],
    ]);
  });

  test("macdLine (EMA/EMA, short=3, long=5)", () => {
    const prices = [100.46,100.53,100.38,100.19,100.21,100.32,100.28];
    const out = momentumIndicators.bulk.macdLine(
      prices,
      3,
      ConstantModelType.ExponentialMovingAverage,
      5,
      ConstantModelType.ExponentialMovingAverage
    );
    assert.deepEqual(out, [
      -0.06067027758972188,
      -0.022417061611406552,
      0.005788761002008869,
    ]);
  });

  test("signalLine (EMA, period 3)", () => {
    const macds = [
      -0.0606702775897219, -0.0224170616113781, 0.0057887610020515,
      0.0318212593094103, -0.737982396750169
    ];
    const out = momentumIndicators.bulk.signalLine(
      macds,
      ConstantModelType.ExponentialMovingAverage,
      3
    );
    assert.deepEqual(out, [
      -0.011764193829181728,
      0.0166350710900523,
      -0.4117854724828291,
    ]);
  });

  test("mcginleyDynamicMacdLine (no previous)", () => {
    const prices = [100.46,100.53,100.38,100.19,100.21,100.32,100.28];
    const out = momentumIndicators.bulk.mcginleyDynamicMacdLine(
      prices,
      3,
      0.0,
      5,
      0.0
    );
    assert.deepEqual(out, [
      [0.0, 100.21, 100.21],
      [0.014602444905747802, 100.24650611226437, 100.23190366735862],
      [0.01615134009865926, 100.25765583287253, 100.24150449277387],
    ]);
  });

  test("chaikinOscillator (SMA/Median, short=3, long=5)", () => {
    const highs = [100.53,100.68,100.73,100.79,100.88,100.51,100.17];
    const lows = [99.62,99.97,100.28,100.12,100.07,99.86,99.60];
    const close = [100.01,100.44,100.39,100.63,100.71,100.35,100.12];
    const volume = [268,319,381,414,376,396,362];
    const out = momentumIndicators.bulk.chaikinOscillator(
      highs, lows, close, volume,
      3, 5, 0.0,
      ConstantModelType.SimpleMovingAverage,
      ConstantModelType.SimpleMovingMedian
    );
    assert.deepEqual(out, [
      [22.17005097965847, 304.76047677253655],
      [212.4639442861619, 848.8528216769286],
      [233.52784525415495, 1588.098366482492],
    ]);
  });

  test("percentagePriceOscillator (EMA, short=3, long=5)", () => {
    const prices = [100.01, 100.44, 100.39, 100.63, 100.71, 100.35, 100.12];
    const out = momentumIndicators.bulk.percentagePriceOscillator(
      prices,
      3,
      5,
      ConstantModelType.ExponentialMovingAverage
    );
    assert.deepEqual(out, [
      0.08979623002617415,
      -0.008380468415664317,
      -0.08769552039759204,
    ]);
  });

  test("chandeMomentumOscillator (period 5)", () => {
    const prices = [100.01, 100.44, 100.39, 100.63, 100.71, 100.35, 100.12];
    const out = momentumIndicators.bulk.chandeMomentumOscillator(prices, 5);
    assert.deepEqual(out, [
      87.50000000000044,
      -12.328767123288312,
      -29.67032967032981,
    ]);
  });
});

// 1.3.0: wrappers now throw a JS `Error` on invalid input instead of panicking.
describe("momentumIndicators error handling (throws JS Error)", () => {
  // A1 (decisive): representative scalar wrapper throws a real Error.
  test("single.relativeStrengthIndex empty array throws Error", () => {
    assert.throws(
      () =>
        momentumIndicators.single.relativeStrengthIndex(
          [],
          ConstantModelType.SimpleMovingAverage
        ),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(typeof err.message === "string" && err.message.length > 0);
        return true;
      }
    );
  });

  test("single.moneyFlowIndex mismatched series lengths throws Error", () => {
    assert.throws(
      () => momentumIndicators.single.moneyFlowIndex([100.2, 100.46], [268]),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(typeof err.message === "string" && err.message.length > 0);
        return true;
      }
    );
  });

  // Representative Array wrapper: period > length.
  test("bulk.relativeStrengthIndex period > length throws Error", () => {
    assert.throws(
      () =>
        momentumIndicators.bulk.relativeStrengthIndex(
          [100.2, 100.46, 100.53],
          ConstantModelType.SimpleMovingAverage,
          10
        ),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(typeof err.message === "string" && err.message.length > 0);
        return true;
      }
    );
  });

  test("bulk.stochasticOscillator empty array throws Error", () => {
    assert.throws(
      () => momentumIndicators.bulk.stochasticOscillator([], 5),
      (err) => {
        assert.ok(err instanceof Error);
        assert.ok(typeof err.message === "string" && err.message.length > 0);
        return true;
      }
    );
  });
});
