import { ConstantModelType, DeviationModel, Position, MovingAverageType } from "./dist/bundler/centaur-technical-indicators";

// Re-export enums from the generated wasm types so consumers get both types and JSDoc.
/**
 * The moving constant model to use for indicators that accept a "constant".
 * - SimpleMovingAverage: arithmetic mean
 * - SmoothedMovingAverage: SMA-like smoothing
 * - ExponentialMovingAverage: EMA
 * - SimpleMovingMedian: median
 * - SimpleMovingMode: mode
 */
export { ConstantModelType } from "./dist/bundler/centaur-technical-indicators";

/**
 * Price deviation models used to form bands around a central line.
 * - StandardDeviation
 * - MeanAbsoluteDeviation
 * - MedianAbsoluteDeviation
 * - ModeAbsoluteDeviation
 * - UlcerIndex
 * - LogStandardDeviation
 * - LaplaceStdEquivalent
 * - CauchyIQRScale
 */
export { DeviationModel } from "./dist/bundler/centaur-technical-indicators";

/**
 * Trade direction for Parabolic SAR systems.
 * - Long: uptrend stop
 * - Short: downtrend stop
 */
export { Position } from "./dist/bundler/centaur-technical-indicators";

/**
 * Moving average type used by the movingAverage APIs.
 * Supported:
 * - Simple
 * - Smoothed
 * - Exponential
 *
 * Note: The Rust Personalised variant is not exposed in this JS API.
 */
export { MovingAverageType } from "./dist/bundler/centaur-technical-indicators";

/**
 * Initialize the WASM module.
 * - Web: required (fetches and instantiates the WebAssembly module)
 * - Node: no-op (the Node target is loaded synchronously)
 *
 * @example
 * import init from "centaur-technical-indicators";
 * await init();
 */
export default function init(input?: any): Promise<void>;

/**
 * Single-value candle indicators: operate on entire arrays and return a single result.
 */
export interface CandleIndicatorsSingle {
  /**
   * Envelopes around a moving constant (mean/median/etc.), expressed as ±percentage.
   * @param prices Close prices for the full window.
   * @param constantModelType The central model (SMA, EMA, median, etc.).
   * @param difference Percent band width (e.g., 3.0 for ±3%).
   * @returns [lower, middle, upper]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/moving-constant-envelopes/} Explanation and interactive playground
   * @example
   * single.movingConstantEnvelopes(prices, ConstantModelType.ExponentialMovingAverage, 3.0)
   */
  movingConstantEnvelopes(
    prices: number[],
    constantModelType: ConstantModelType,
    difference: number
  ): [number, number, number];

  /**
   * Envelopes around the McGinley Dynamic value.
   * @param prices Close prices for the full window.
   * @param difference Percent band width (e.g., 3.0 for ±3%).
   * @param previousMcGinleyDynamic Previous McGinley value (0.0 if none).
   * @returns [lower, mcginley, upper]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/mcginley-dynamic-envelopes/} Explanation and interactive playground
   */
  mcginleyDynamicEnvelopes(
    prices: number[],
    difference: number,
    previousMcGinleyDynamic: number
  ): [number, number, number];

  /**
   * Generalized bands (e.g., Bollinger Bands) around a moving constant using a deviation model.
   * @param prices Close prices for the full window.
   * @param constantModelType The central model (SMA, EMA, median, etc.).
   * @param deviationModel Deviation model (StdDev, MAD, etc.).
   * @param deviationMultiplier Multiplier applied to the deviation (e.g., 2.0).
   * @returns [lower, middle, upper]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/moving-constant-bands/} Explanation and interactive playground
   */
  movingConstantBands(
    prices: number[],
    constantModelType: ConstantModelType,
    deviationModel: DeviationModel,
    deviationMultiplier: number
  ): [number, number, number];

  /**
   * Bands around the McGinley Dynamic using a deviation model and multiplier.
   * @param prices Close prices for the full window.
   * @param deviationModel Deviation model (StdDev, MAD, etc.).
   * @param deviationMultiplier Multiplier applied to the deviation (e.g., 2.0).
   * @param previousMcGinleyDynamic Previous McGinley value (0.0 if none).
   * @returns [lower, mcginley, upper]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/mcginley-dynamic-bands/} Explanation and interactive playground
   */
  mcginleyDynamicBands(
    prices: number[],
    deviationModel: DeviationModel,
    deviationMultiplier: number,
    previousMcGinleyDynamic: number
  ): [number, number, number];

  /**
   * Ichimoku Cloud for a full window.
   * @param highs High prices.
   * @param lows Low prices.
   * @param close Close prices.
   * @param conversionPeriod Tenkan-sen period.
   * @param basePeriod Kijun-sen period.
   * @param spanBPeriod Senkou Span B period.
   * @returns [spanA, spanB, base, conversion, displacedClose]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/ichimoku-cloud/} Explanation and interactive playground
   */
  ichimokuCloud(
    highs: number[],
    lows: number[],
    close: number[],
    conversionPeriod: number,
    basePeriod: number,
    spanBPeriod: number
  ): [number, number, number, number, number];

  /**
   * Donchian Channels for a full window.
   * @param highs High prices.
   * @param lows Low prices.
   * @returns [lower, middle, upper]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/donchian-channels/} Explanation and interactive playground
   */
  donchianChannels(highs: number[], lows: number[]): [number, number, number];

  /**
   * Keltner Channel using ATR and a central moving constant.
   * @param highs High prices.
   * @param lows Low prices.
   * @param close Close prices.
   * @param constantModelType Central model (for typical price).
   * @param atrConstantModelType Model for ATR calculation.
   * @param multiplier Multiplier for ATR width.
   * @returns [lower, middle, upper]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/keltner-channels/} Explanation and interactive playground
   */
  keltnerChannel(
    highs: number[],
    lows: number[],
    close: number[],
    constantModelType: ConstantModelType,
    atrConstantModelType: ConstantModelType,
    multiplier: number
  ): [number, number, number];

  /**
   * Supertrend value for a full window.
   * @param highs High prices.
   * @param lows Low prices.
   * @param close Close prices.
   * @param constantModelType Model used by ATR.
   * @param multiplier Multiplier for ATR.
   * @returns supertrend value
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/supertrend/} Explanation and interactive playground
   */
  supertrend(
    highs: number[],
    lows: number[],
    close: number[],
    constantModelType: ConstantModelType,
    multiplier: number
  ): number;
}

/**
 * Bulk/rolling candle indicators: operate over a sliding window and return arrays.
 *
 * General behavior:
 * - Windowing: For inputs of length L and a window size N, the output length is L - N + 1 (when N applies).
 * - Start index: The first output corresponds to indices [0..N-1], the second to [1..N], and so on.
 * - Typed arrays: You may pass number[] or Float64Array (both are accepted).
 * - OHLC alignment: Arrays for highs/lows/close must have equal length.
 * - Insufficient data: If the effective window exceeds input length, the result is an empty array.
 */
export interface CandleIndicatorsBulk {
  /**
   * Rolling envelopes around a moving constant (±percentage of the central line).
   *
   * Window size:
   * - Uses the provided `period` N; output length = prices.length - N + 1.
   *
   * @param prices Close prices.
   * @param constantModelType Central model (SMA, EMA, median, etc.).
   * @param difference Percent band width (e.g., 3.0 for ±3%).
   * @param period Window length for the moving constant.
   * @returns Array of [lower, middle, upper] per window.
   *
   * @example
   * const out = bulk.movingConstantEnvelopes(
   *   prices, ConstantModelType.ExponentialMovingAverage, 3.0, 20
   * );
   * // out[i] corresponds to prices[i..i+19]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/moving-constant-envelopes/} Explanation and interactive playground
   */
  movingConstantEnvelopes(
    prices: number[],
    constantModelType: ConstantModelType,
    difference: number,
    period: number
  ): [number, number, number][];

  /**
   * Rolling McGinley Dynamic envelopes (±percentage of McGinley value).
   *
   * Window size:
   * - Uses the provided `period` N; output length = prices.length - N + 1.
   *
   * Seeding:
   * - `previousMcGinleyDynamic` seeds the first window's McGinley; use 0.0 if none.
   *
   * @param prices Close prices.
   * @param difference Percent band width (e.g., 3.0 for ±3%).
   * @param previousMcGinleyDynamic Previous McGinley value to seed the first window (0.0 if unknown).
   * @param period Window length for the McGinley computation.
   * @returns Array of [lower, mcginley, upper] per window.
   *
   * @example
   * const out = bulk.mcginleyDynamicEnvelopes(prices, 3.0, 0.0, 14);
   * // out[i] corresponds to prices[i..i+13]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/mcginley-dynamic-envelopes/} Explanation and interactive playground
   */
  mcginleyDynamicEnvelopes(
    prices: number[],
    difference: number,
    previousMcGinleyDynamic: number,
    period: number
  ): [number, number, number][];

  /**
   * Rolling generalized bands (e.g., Bollinger) around a moving constant using a deviation model.
   *
   * Window size:
   * - Uses the provided `period` N; output length = prices.length - N + 1.
   *
   * Band formula:
   * - lower = middle - deviationMultiplier * deviation
   * - upper = middle + deviationMultiplier * deviation
   * - where middle is the chosen moving constant over the window.
   *
   * @param prices Close prices.
   * @param constantModelType Central model (SMA, EMA, median, etc.).
   * @param deviationModel Deviation model (StdDev, MAD, MedianAD, ModeAD, UlcerIndex).
   * @param deviationMultiplier Multiplier applied to the deviation (e.g., 2.0).
   * @param period Window length for both the constant and deviation.
   * @returns Array of [lower, middle, upper] per window.
   *
   * @example
   * const out = bulk.movingConstantBands(
   *   prices,
   *   ConstantModelType.SimpleMovingAverage,
   *   DeviationModel.StandardDeviation,
   *   2.0,
   *   20
   * );
   * // out[i] corresponds to prices[i..i+19]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/moving-constant-bands/} Explanation and interactive playground
   */
  movingConstantBands(
    prices: number[],
    constantModelType: ConstantModelType,
    deviationModel: DeviationModel,
    deviationMultiplier: number,
    period: number
  ): [number, number, number][];

  /**
   * Rolling McGinley Dynamic bands using a deviation model and multiplier.
   *
   * Window size:
   * - Uses the provided `period` N; output length = prices.length - N + 1.
   *
   * Seeding:
   * - `previousMcGinleyDynamic` seeds the first window's McGinley; use 0.0 if none.
   *
   * @param prices Close prices.
   * @param deviationModel Deviation model (StdDev, MAD, etc.).
   * @param deviationMultiplier Multiplier applied to the deviation (e.g., 2.0).
   * @param previousMcGinleyDynamic Previous McGinley value to seed the first window (0.0 if unknown).
   * @param period Window length.
   * @returns Array of [lower, mcginley, upper] per window.
   *
   * @example
   * const out = bulk.mcginleyDynamicBands(
   *   prices, DeviationModel.StandardDeviation, 2.0, 0.0, 20
   * );
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/mcginley-dynamic-bands/} Explanation and interactive playground
   */
  mcginleyDynamicBands(
    prices: number[],
    deviationModel: DeviationModel,
    deviationMultiplier: number,
    previousMcGinleyDynamic: number,
    period: number
  ): [number, number, number][];

  /**
   * Rolling Ichimoku Cloud.
   *
   * Effective window:
   * - Uses `max(conversionPeriod, basePeriod, spanBPeriod)` as the effective N.
   * - For inputs of length L, output length = L - N + 1.
   *
   * Output tuple:
   * - [spanA, spanB, base (Kijun), conversion (Tenkan), displacedClose]
   *
   * @param highs High prices (length L).
   * @param lows Low prices (length L).
   * @param close Close prices (length L).
   * @param conversionPeriod Tenkan-sen period.
   * @param basePeriod Kijun-sen period.
   * @param spanBPeriod Senkou Span B period.
   * @returns Array of [spanA, spanB, base, conversion, displacedClose] per window.
   *
   * @example
   * const out = bulk.ichimokuCloud(highs, lows, close, 9, 26, 52);
   * // N = max(9, 26, 52) = 52; out[i] corresponds to OHLC[i..i+51]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/ichimoku-cloud/} Explanation and interactive playground
   */
  ichimokuCloud(
    highs: number[],
    lows: number[],
    close: number[],
    conversionPeriod: number,
    basePeriod: number,
    spanBPeriod: number
  ): [number, number, number, number, number][];

  /**
   * Rolling Donchian Channels.
   *
   * Window size:
   * - Uses the provided `period` N; output length = highs.length - N + 1.
   *
   * Middle line:
   * - Average of rolling highest-high and lowest-low, i.e., (upper + lower) / 2.
   *
   * @param highs High prices.
   * @param lows Low prices.
   * @param period Window length.
   * @returns Array of [lower, middle, upper] per window.
   *
   * @example
   * const out = bulk.donchianChannels(highs, lows, 20);
   * // out[i] corresponds to highs/lows[i..i+19]
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/donchian-channels/} Explanation and interactive playground
   */
  donchianChannels(
    highs: number[],
    lows: number[],
    period: number
  ): [number, number, number][];

  /**
   * Rolling Keltner Channel using ATR and a central moving constant.
   *
   * Window size:
   * - Uses the provided `period` N; output length = highs.length - N + 1.
   *
   * Notes:
   * - `constantModelType` defines the moving average for the typical price center.
   * - `atrConstantModelType` defines the ATR's smoothing model.
   *
   * @param highs High prices.
   * @param lows Low prices.
   * @param close Close prices.
   * @param constantModelType Central model (for typical price).
   * @param atrConstantModelType Model for ATR calculation.
   * @param multiplier Multiplier for ATR width.
   * @param period Window length.
   * @returns Array of [lower, middle, upper] per window.
   *
   * @example
   * const out = bulk.keltnerChannel(
   *   highs, lows, close,
   *   ConstantModelType.ExponentialMovingAverage,
   *   ConstantModelType.SimpleMovingAverage,
   *   2.0,
   *   20
   * );
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/keltner-channels/} Explanation and interactive playground
   */
  keltnerChannel(
    highs: number[],
    lows: number[],
    close: number[],
    constantModelType: ConstantModelType,
    atrConstantModelType: ConstantModelType,
    multiplier: number,
    period: number
  ): [number, number, number][];

  /**
   * Rolling Supertrend values.
   *
   * Window size:
   * - Uses the provided `period` N; output length = highs.length - N + 1.
   *
   * @param highs High prices.
   * @param lows Low prices.
   * @param close Close prices.
   * @param constantModelType Model used by ATR.
   * @param multiplier Multiplier for ATR.
   * @param period Window length for ATR and bands.
   * @returns Array of supertrend values per window.
   *
   * @example
   * const out = bulk.supertrend(
   *   highs, lows, close,
   *   ConstantModelType.SimpleMovingAverage,
   *   2.0,
   *   10
   * );
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/candle-indicators/supertrend/} Explanation and interactive playground
   */
  supertrend(
    highs: number[],
    lows: number[],
    close: number[],
    constantModelType: ConstantModelType,
    multiplier: number,
    period: number
  ): number[];
}

/**
 * Chart trend utilities (no single/bulk split).
 *
 * Notes:
 * - Indices in the returned tuples are zero-based.
 * - All returns are plain arrays for easy consumption from JS.
 */
export interface ChartTrends {
  /**
   * Calculate all local maxima (peaks) using a rolling window.
   * @param prices High prices (or series to scan).
   * @param period Window length for detecting a local peak.
   * @param closestNeighbor Minimum index distance between accepted peaks.
   * @returns Array of [value, index] pairs.
   * @example
   * const peaks = chartTrends.peaks([103, 102, 107, 104, 100], 3, 1); // [[107, 2]]
   */
  peaks(prices: number[], period: number, closestNeighbor: number): [number, number][];

  /**
   * Calculate all local minima (valleys) using a rolling window.
   * @param prices Low prices (or series to scan).
   * @param period Window length for detecting a local valley.
   * @param closestNeighbor Minimum index distance between accepted valleys.
   * @returns Array of [value, index] pairs.
   */
  valleys(prices: number[], period: number, closestNeighbor: number): [number, number][];

  /**
   * OLS trend line (slope, intercept) computed on detected peaks over windows of size `period`.
   * @param prices Series to analyze.
   * @param period Window length used to find peaks.
   * @returns [slope, intercept]
   */
  peakTrend(prices: number[], period: number): [number, number];

  /**
   * OLS trend line (slope, intercept) computed on detected valleys over windows of size `period`.
   * @param prices Series to analyze.
   * @param period Window length used to find valleys.
   * @returns [slope, intercept]
   */
  valleyTrend(prices: number[], period: number): [number, number];

  /**
   * OLS trend line (slope, intercept) for all points in `prices`.
   * @param prices Series to analyze.
   * @returns [slope, intercept]
   */
  overallTrend(prices: number[]): [number, number];

  /**
   * Segment the series into distinct trend ranges based on goodness-of-fit thresholds.
   * Uses Centaur Technical Indicators 1.0.0 TrendBreakConfig parameters.
   * @param prices Prices series.
   * @param maxOutliers Maximum number of outliers allowed before trend break.
   * @param softAdjRSquaredMinimum Soft minimum adjusted R-squared threshold.
   * @param hardAdjRSquaredMinimum Hard minimum adjusted R-squared threshold.
   * @param softRmseMultiplier Soft RMSE multiplier for trend breaks.
   * @param hardRmseMultiplier Hard RMSE multiplier for trend breaks.
   * @param softDurbinWatsonMin Soft minimum Durbin-Watson statistic.
   * @param softDurbinWatsonMax Soft maximum Durbin-Watson statistic.
   * @param hardDurbinWatsonMin Hard minimum Durbin-Watson statistic.
   * @param hardDurbinWatsonMax Hard maximum Durbin-Watson statistic.
   * @returns Array of [startIndex, endIndex, slope, intercept].
   */
  breakDownTrends(
    prices: number[],
    maxOutliers: number,
    softAdjRSquaredMinimum: number,
    hardAdjRSquaredMinimum: number,
    softRmseMultiplier: number,
    hardRmseMultiplier: number,
    softDurbinWatsonMin: number,
    softDurbinWatsonMax: number,
    hardDurbinWatsonMin: number,
    hardDurbinWatsonMax: number
  ): [number, number, number, number][];
}

/**
 * Correlation indicators.
 */
export interface CorrelationIndicatorsSingle {
  /**
   * Correlation between two price series (single window).
   * @param pricesAssetA First asset prices.
   * @param pricesAssetB Second asset prices (same length as A).
   * @param constantModelType Central model for demeaning (SMA, EMA, etc.).
   * @param deviationModel Deviation model for scaling (StdDev, MAD, etc.).
   * @returns Correlation-like coefficient (unitless).
   *
   * Note: PersonalisedMovingAverage is not exposed in this JS API.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/correlation-indicators/correlate-asset-prices/} Explanation and interactive playground
   */
  correlateAssetPrices(
    pricesAssetA: number[],
    pricesAssetB: number[],
    constantModelType: ConstantModelType,
    deviationModel: DeviationModel
  ): number;
}

/**
 * Rolling correlation indicators.
 *
 * Windowing:
 * - Output length = L - period + 1, where L is the input length.
 * - pricesAssetA and pricesAssetB must have equal length.
 */
export interface CorrelationIndicatorsBulk {
  /**
   * Rolling correlation between two price series.
   * @param pricesAssetA First asset prices.
   * @param pricesAssetB Second asset prices.
   * @param constantModelType Central model for demeaning (SMA, EMA, etc.).
   * @param deviationModel Deviation model for scaling (StdDev, MAD, etc.).
   * @param period Rolling window length.
   * @returns Array of correlation values per window.
   *
   * @example
   * const out = correlationIndicators.bulk.correlateAssetPrices(
   *   pricesA, pricesB, ConstantModelType.SimpleMovingAverage, DeviationModel.StandardDeviation, 20
   * );
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/correlation-indicators/correlate-asset-prices/} Explanation and interactive playground
   */
  correlateAssetPrices(
    pricesAssetA: number[],
    pricesAssetB: number[],
    constantModelType: ConstantModelType,
    deviationModel: DeviationModel,
    period: number
  ): number[];
}

/**
 * Single-value momentum indicators.
 * These compute a single value from a full window (the entire array passed in).
 */
export interface MomentumIndicatorsSingle {
  /**
   * Calculates the Relative Strength Index (RSI).
   *
   * Computes average gains and losses from consecutive price differences and
   * forms the RSI using the selected central model to smooth/aggregate:
   * - SimpleMovingAverage, SmoothedMovingAverage, ExponentialMovingAverage,
   *   SimpleMovingMedian, SimpleMovingMode.
   *
   * Special cases:
   * - If there are no previous gains => 0.0
   * - If there are no previous losses => 100.0
   *
   * @param prices Slice of prices (length >= 1).
   * @param constantModelType Central model used to aggregate gains/losses.
   * @returns RSI value in [0, 100].
   * @throws If prices is empty.
   *
   * @example
   * const rsi = momentumIndicators.single.relativeStrengthIndex(
   *   prices,
   *   ConstantModelType.SmoothedMovingAverage
   * );
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/rsi/} Explanation and interactive playground
   */
  relativeStrengthIndex(
    prices: number[],
    constantModelType: ConstantModelType
  ): number;

  /**
   * Calculates the Stochastic Oscillator for the full window.
   *
   * Interpretation:
   * - Returns 100 * ((last - min) / (max - min)) over the entire input.
   *
   * @param prices Slice of prices (length >= 1).
   * @returns Percent value in [0, 100].
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/stochastic-oscillator/} Explanation and interactive playground
   */
  stochasticOscillator(prices: number[]): number;

  /**
   * Calculates the Slow Stochastic as a smoothing of Stochastic Oscillator values.
   *
   * Uses the provided central model to aggregate the given stochastics.
   *
   * @param stochastics Slice of Stochastic Oscillator values (length >= 1).
   * @param constantModelType Central model (SMA, EMA, median, etc.).
   * @returns Smoothed stochastic value.
   * @throws If stochastics is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/slow-stochastic-oscillator/} Explanation and interactive playground
   */
  slowStochastic(
    stochastics: number[],
    constantModelType: ConstantModelType
  ): number;

  /**
   * Calculates the Slowest Stochastic as a smoothing of Slow Stochastic values.
   *
   * Uses the provided central model to aggregate the given slow stochastics.
   *
   * @param slowStochastics Slice of Slow Stochastic values (length >= 1).
   * @param constantModelType Central model (SMA, EMA, median, etc.).
   * @returns Slowest stochastic value.
   * @throws If slowStochastics is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/slow-stochastic-oscillator/} Explanation and interactive playground
   */
  slowestStochastic(
    slowStochastics: number[],
    constantModelType: ConstantModelType
  ): number;

  /**
   * Calculates the Williams %R for the full window.
   *
   * @param high Slice of highs.
   * @param low Slice of lows.
   * @param close Close price for the observed period (last bar’s close).
   * @returns %R value in [-100, 0].
   * @throws If high/low are empty or their lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/williams-percent-r/} Explanation and interactive playground
   */
  williamsPercentR(high: number[], low: number[], close: number): number;

  /**
   * Calculates the Money Flow Index (MFI) for the full window.
   *
   * Notes:
   * - Uses raw money flow (price * volume) to accumulate positive/negative flows.
   * - Returns 100 if there are no negative flows, 0 if no positive flows.
   *
   * @param prices Slice of prices (length >= 1).
   * @param volume Slice of volumes (same length as prices).
   * @returns MFI value in [0, 100].
   * @throws If arrays are empty or lengths mismatch.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/money-flow-index/} Explanation and interactive playground
   */
  moneyFlowIndex(prices: number[], volume: number[]): number;

  /**
   * Calculates the Rate of Change (RoC) between two prices.
   *
   * @param currentPrice Current price.
   * @param previousPrice Previous price.
   * @returns Percentage change: ((current - previous)/previous) * 100.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/rate-of-change/} Explanation and interactive playground
   */
  rateOfChange(currentPrice: number, previousPrice: number): number;

  /**
   * Calculates the On-Balance Volume (OBV) update.
   *
   * Adds/subtracts current volume if price up/down vs previous price, and
   * accumulates with previous OBV.
   *
   * @param currentPrice Current price.
   * @param previousPrice Previous price.
   * @param currentVolume Current volume.
   * @param previousOnBalanceVolume Previous OBV seed (use 0 if none).
   * @returns Updated OBV value.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/on-balance-volume/} Explanation and interactive playground
   */
  onBalanceVolume(
    currentPrice: number,
    previousPrice: number,
    currentVolume: number,
    previousOnBalanceVolume: number
  ): number;

  /**
   * Calculates the Commodity Channel Index (CCI) for the full window.
   *
   * Formula:
   * - (lastPrice - movingConstant) / (constantMultiplier * deviation)
   * - Typically, constantMultiplier = 0.015
   *
   * @param prices Slice of prices (length >= 1).
   * @param constantModelType Central model (SMA, EMA, median, etc.).
   * @param deviationModel Deviation model (StdDev, MAD, etc.).
   * @param constantMultiplier Scale factor (normally 0.015).
   * @returns CCI value (unitless).
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/commodity-channel-index/} Explanation and interactive playground
   */
  commodityChannelIndex(
    prices: number[],
    constantModelType: ConstantModelType,
    deviationModel: DeviationModel,
    constantMultiplier: number
  ): number;

  /**
   * Calculates the McGinley Dynamic CCI for the full window.
   *
   * Uses the McGinley Dynamic of the last price as the center and scales by the
   * chosen deviation model. Returns both the CCI and the computed McGinley value.
   *
   * @param prices Slice of prices (length >= 1).
   * @param previousMcginleyDynamic Previous McGinley value (use 0.0 if none).
   * @param deviationModel Deviation model (StdDev, MAD, etc.).
   * @param constantMultiplier Scale factor (normally 0.015).
   * @returns [cci, mcginleyDynamic].
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/mcginley-dynamic-commodity-channel-index/} Explanation and interactive playground
   */
  mcginleyDynamicCommodityChannelIndex(
    prices: number[],
    previousMcginleyDynamic: number,
    deviationModel: DeviationModel,
    constantMultiplier: number
  ): [number, number];

  /**
   * Calculates the MACD line for the full window.
   *
   * Short-period average is computed over the last `shortPeriod` values, while
   * the long-period average uses the entire series, each with the respective model.
   *
   * @param prices Slice of prices (length >= 1).
   * @param shortPeriod Length of the short period (must be < prices.length).
   * @param shortPeriodModel Model for short average.
   * @param longPeriodModel Model for long average (over full series).
   * @returns MACD value (short - long).
   * @throws If prices is empty or shortPeriod >= prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/macd/} Explanation and interactive playground
   */
  macdLine(
    prices: number[],
    shortPeriod: number,
    shortPeriodModel: ConstantModelType,
    longPeriodModel: ConstantModelType
  ): number;

  /**
   * Calculates the MACD signal line for the full window.
   *
   * Applies the chosen central model to the provided MACD values.
   *
   * @param macds Slice of MACD values (length >= 1).
   * @param constantModelType Central model (SMA, EMA, median, etc.).
   * @returns Signal value.
   * @throws If macds is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/macd/} Explanation and interactive playground
   */
  signalLine(macds: number[], constantModelType: ConstantModelType): number;

  /**
   * Calculates the McGinley Dynamic MACD for the full window.
   *
   * Returns a tuple:
   * - [macd, shortMcginley, longMcginley]
   * - If both previous short/long McGinley are 0.0, returns (0.0, lastPrice, lastPrice)
   *
   * @param prices Slice of prices (length >= 1).
   * @param shortPeriod Short period length (must be < prices.length).
   * @param previousShortMcginley Previous short McGinley (0.0 if none).
   * @param previousLongMcginley Previous long McGinley (0.0 if none).
   * @returns [macd, shortMcginley, longMcginley].
   * @throws If prices is empty or shortPeriod >= prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/mcginley-dynamic-macd/} Explanation and interactive playground
   */
  mcginleyDynamicMacdLine(
    prices: number[],
    shortPeriod: number,
    previousShortMcginley: number,
    previousLongMcginley: number
  ): [number, number, number];

  /**
   * Calculates the Chaikin Oscillator (CO) for the full window.
   *
   * Steps:
   * - Builds Accumulation/Distribution (AD) series with provided previous seed.
   * - Short-period average from last `shortPeriod` AD values using short model.
   * - Long-period average over all AD values using long model.
   * - Returns (short - long, lastAD).
   *
   * @param highs Slice of highs.
   * @param lows Slice of lows.
   * @param close Slice of closes.
   * @param volume Slice of volumes.
   * @param shortPeriod Short AD period length.
   * @param previousAccumulationDistribution Previous AD seed (0.0 if none).
   * @param shortPeriodModel Model for the short AD average.
   * @param longPeriodModel Model for the long AD average.
   * @returns [oscillatorValue, lastAD].
   * @throws If input lengths differ or highs.length <= shortPeriod.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/chaikin-oscillator/} Explanation and interactive playground
   */
  chaikinOscillator(
    highs: number[],
    lows: number[],
    close: number[],
    volume: number[],
    shortPeriod: number,
    previousAccumulationDistribution: number,
    shortPeriodModel: ConstantModelType,
    longPeriodModel: ConstantModelType
  ): [number, number];

  /**
   * Calculates the Percentage Price Oscillator (PPO) for the full window (%).
   *
   * Uses chosen central model for both short (applied to the trailing short slice)
   * and long (applied to the full window), then scales the difference by long.
   *
   * @param prices Slice of prices (length >= 1).
   * @param shortPeriod Length of the short period (must be <= prices.length).
   * @param constantModelType Central model for both averages.
   * @returns PPO percentage.
   * @throws If prices is empty or shortPeriod > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/percentage-price-oscillator/} Explanation and interactive playground
   */
  percentagePriceOscillator(
    prices: number[],
    shortPeriod: number,
    constantModelType: ConstantModelType
  ): number;

  /**
   * Calculates the Chande Momentum Oscillator (CMO) for the full window.
   *
   * Uses sums of positive/negative price differences to produce a value in [-100, 100].
   * Special cases:
   * - If no gains => -100
   * - If no losses => 100
   *
   * @param prices Slice of prices (length >= 1).
   * @returns CMO value in [-100, 100].
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/chande-momentum-oscillator/} Explanation and interactive playground
   */
  chandeMomentumOscillator(prices: number[]): number;
}

/**
 * Bulk/rolling momentum indicators.
 *
 * General:
 * - Output length is L - N + 1 where N is `period` (or `longPeriod` for two-window indicators).
 * - Each output at index i corresponds to the input window [i..i+N-1].
 */
export interface MomentumIndicatorsBulk {
  /**
   * Rolling RSI.
   *
   * @param prices Slice of prices.
   * @param constantModelType Central model for gains/losses aggregation.
   * @param period Window length.
   * @returns RSI per window.
   * @throws If period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/rsi/} Explanation and interactive playground
   */
  relativeStrengthIndex(
    prices: number[],
    constantModelType: ConstantModelType,
    period: number
  ): number[];

  /**
   * Rolling Stochastic Oscillator.
   *
   * @param prices Slice of prices.
   * @param period Window length.
   * @returns %K per window in [0, 100].
   * @throws If period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/stochastic-oscillator/} Explanation and interactive playground
   */
  stochasticOscillator(prices: number[], period: number): number[];

  /**
   * Rolling Slow Stochastic (smoothing of Stochastic Oscillator).
   *
   * @param stochastics Slice of stochastic values.
   * @param constantModelType Central model.
   * @param period Window length.
   * @returns Slow stochastic per window.
   * @throws If period > stochastics.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/slow-stochastic-oscillator/} Explanation and interactive playground
   */
  slowStochastic(
    stochastics: number[],
    constantModelType: ConstantModelType,
    period: number
  ): number[];

  /**
   * Rolling Slowest Stochastic (smoothing of Slow Stochastic).
   *
   * @param slowStochastics Slice of slow stochastic values.
   * @param constantModelType Central model.
   * @param period Window length.
   * @returns Slowest stochastic per window.
   * @throws If period > slowStochastics.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/slow-stochastic-oscillator/} Explanation and interactive playground
   */
  slowestStochastic(
    slowStochastics: number[],
    constantModelType: ConstantModelType,
    period: number
  ): number[];

  /**
   * Rolling Williams %R.
   *
   * @param high High prices.
   * @param low Low prices.
   * @param close Close prices.
   * @param period Window length.
   * @returns %R values per window.
   * @throws If lengths differ or period > lengths.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/williams-percent-r/} Explanation and interactive playground
   */
  williamsPercentR(
    high: number[],
    low: number[],
    close: number[],
    period: number
  ): number[];

  /**
   * Rolling Money Flow Index (MFI).
   *
   * @param prices Prices.
   * @param volume Volumes (same length).
   * @param period Window length.
   * @returns MFI values per window.
   * @throws If period > prices.length or lengths mismatch.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/money-flow-index/} Explanation and interactive playground
   */
  moneyFlowIndex(prices: number[], volume: number[], period: number): number[];

  /**
   * Pairwise Rate of Change across the series.
   *
   * @param prices Prices (length >= 1).
   * @returns Array of successive RoC values (length = prices.length - 1).
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/rate-of-change/} Explanation and interactive playground
   */
  rateOfChange(prices: number[]): number[];

  /**
   * Rolling On-Balance Volume (OBV).
   *
   * @param prices Prices (length >= 1).
   * @param volume Volumes (same length).
   * @param previousOnBalanceVolume Previous OBV seed (0 if none).
   * @returns OBV values per step (length = prices.length - 1).
   * @throws If prices is empty or lengths mismatch.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/on-balance-volume/} Explanation and interactive playground
   */
  onBalanceVolume(
    prices: number[],
    volume: number[],
    previousOnBalanceVolume: number
  ): number[];

  /**
   * Rolling Commodity Channel Index (CCI).
   *
   * @param prices Prices.
   * @param constantModelType Central model.
   * @param deviationModel Deviation model.
   * @param constantMultiplier Scale factor (normally 0.015).
   * @param period Window length.
   * @returns CCI per window.
   * @throws If period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/commodity-channel-index/} Explanation and interactive playground
   */
  commodityChannelIndex(
    prices: number[],
    constantModelType: ConstantModelType,
    deviationModel: DeviationModel,
    constantMultiplier: number,
    period: number
  ): number[];

  /**
   * Rolling McGinley Dynamic CCI.
   *
   * Seeds the first window with `previousMcginleyDynamic`, then chains each
   * window's McGinley into the next.
   *
   * @param prices Prices.
   * @param previousMcginleyDynamic Previous McGinley (0.0 if none).
   * @param deviationModel Deviation model.
   * @param constantMultiplier Scale factor (normally 0.015).
   * @param period Window length.
   * @returns Array of [cci, mcginley] per window.
   * @throws If period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/mcginley-dynamic-commodity-channel-index/} Explanation and interactive playground
   */
  mcginleyDynamicCommodityChannelIndex(
    prices: number[],
    previousMcginleyDynamic: number,
    deviationModel: DeviationModel,
    constantMultiplier: number,
    period: number
  ): [number, number][];

  /**
   * Rolling MACD line (short vs long window).
   *
   * @param prices Prices.
   * @param shortPeriod Short window length (must be <= longPeriod).
   * @param shortPeriodModel Model for short average.
   * @param longPeriod Long window length (<= prices.length).
   * @param longPeriodModel Model for long average.
   * @returns MACD values per window.
   * @throws If shortPeriod > longPeriod or longPeriod > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/macd/} Explanation and interactive playground
   */
  macdLine(
    prices: number[],
    shortPeriod: number,
    shortPeriodModel: ConstantModelType,
    longPeriod: number,
    longPeriodModel: ConstantModelType
  ): number[];

  /**
   * Rolling MACD signal line.
   *
   * @param macds MACD values.
   * @param constantModelType Central model.
   * @param period Window length.
   * @returns Signal values per window.
   * @throws If period > macds.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/macd/} Explanation and interactive playground
   */
  signalLine(
    macds: number[],
    constantModelType: ConstantModelType,
    period: number
  ): number[];

  /**
   * Rolling McGinley Dynamic MACD.
   *
   * Chains short/long McGinley values across windows:
   * - Returns [macd, shortMcginley, longMcginley] per window.
   *
   * @param prices Prices.
   * @param shortPeriod Short window length.
   * @param previousShortMcginley Previous short McGinley (0.0 if none).
   * @param longPeriod Long window length.
   * @param previousLongMcginley Previous long McGinley (0.0 if none).
   * @returns Array of [macd, shortMcginley, longMcginley].
   * @throws If prices is empty, longPeriod > prices.length, or shortPeriod >= longPeriod.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/mcginley-dynamic-macd/} Explanation and interactive playground
   */
  mcginleyDynamicMacdLine(
    prices: number[],
    shortPeriod: number,
    previousShortMcginley: number,
    longPeriod: number,
    previousLongMcginley: number
  ): [number, number, number][];

  /**
   * Rolling Chaikin Oscillator (CO).
   *
   * Builds AD for each window from a running previous AD seed.
   * Returns [oscillatorValue, lastAD] per window.
   *
   * @param highs High prices.
   * @param lows Low prices.
   * @param close Close prices.
   * @param volume Volumes.
   * @param shortPeriod Short AD period.
   * @param longPeriod Long AD period.
   * @param previousAccumulationDistribution Previous AD seed (0.0 if none).
   * @param shortPeriodModel Model for short AD average.
   * @param longPeriodModel Model for long AD average.
   * @returns Array of [oscValue, lastAD] per window.
   * @throws If lengths differ, length < longPeriod, or shortPeriod >= longPeriod.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/chaikin-oscillator/} Explanation and interactive playground
   */
  chaikinOscillator(
    highs: number[],
    lows: number[],
    close: number[],
    volume: number[],
    shortPeriod: number,
    longPeriod: number,
    previousAccumulationDistribution: number,
    shortPeriodModel: ConstantModelType,
    longPeriodModel: ConstantModelType
  ): [number, number][];

  /**
   * Rolling Percentage Price Oscillator (PPO) (%).
   *
   * @param prices Prices.
   * @param shortPeriod Short window length.
   * @param longPeriod Long window length.
   * @param constantModelType Central model for both averages.
   * @returns PPO values per window (%).
   * @throws If shortPeriod >= longPeriod, prices is empty, or longPeriod > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/percentage-price-oscillator/} Explanation and interactive playground
   */
  percentagePriceOscillator(
    prices: number[],
    shortPeriod: number,
    longPeriod: number,
    constantModelType: ConstantModelType
  ): number[];

  /**
   * Rolling Chande Momentum Oscillator (CMO).
   *
   * @param prices Prices.
   * @param period Window length.
   * @returns CMO values per window (range [-100, 100]).
   * @throws If prices is empty or period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/momentum-indicators/chande-momentum-oscillator/} Explanation and interactive playground
   */
  chandeMomentumOscillator(prices: number[], period: number): number[];
}

/**
 * Single-value "other" indicators.
 * Foundational measures such as True Range, ATR, ROI, and Internal Bar Strength.
 */
export interface OtherIndicatorsSingle {
  /**
   * Calculates the final value and percentage return of an investment.
   *
   * Uses buy-and-hold assumption:
   * - initial_units = investment / start_price
   * - final_value = end_price * initial_units
   * - percent_return = ((final_value - investment) / investment) * 100
   *
   * @param startPrice Initial asset price.
   * @param endPrice Final asset price.
   * @param investment Amount invested at start.
   * @returns [finalValue, percentReturn].
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/return-on-investment/} Explanation and interactive playground
   */
  returnOnInvestment(
    startPrice: number,
    endPrice: number,
    investment: number
  ): [number, number];

  /**
   * Calculates the True Range (TR).
   *
   * TR is the maximum of:
   * - high - low
   * - high - previousClose
   * - previousClose - low
   *
   * @param previousClose Previous period close.
   * @param high Current period high.
   * @param low Current period low.
   * @returns True Range value.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/true-range/} Explanation and interactive playground
   */
  trueRange(previousClose: number, high: number, low: number): number;

  /**
   * Calculates the Average True Range (ATR) across the full window of data.
   *
   * Steps:
   * - Build TR for each bar (previousClose, high, low).
   * - Aggregate TRs with the chosen model (SMA, EMA, Smoothed, Median, Mode).
   *
   * @param close Previous closes (length L).
   * @param high Highs (length L).
   * @param low Lows (length L).
   * @param constantModelType Central model for averaging TR.
   * @returns ATR value.
   * @throws If arrays are empty or lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/average-true-range/} Explanation and interactive playground
   */
  averageTrueRange(
    close: number[],
    high: number[],
    low: number[],
    constantModelType: ConstantModelType
  ): number;

  /**
   * Calculates the Internal Bar Strength (IBS).
   *
   * IBS = (close - low) / (high - low)
   *
   * @param high High of the bar.
   * @param low Low of the bar.
   * @param close Close of the bar.
   * @returns IBS in [0, 1].
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/internal-bar-strength/} Explanation and interactive playground
   */
  internalBarStrength(high: number, low: number, close: number): number;
}

/**
 * Bulk/rolling "other" indicators.
 *
 * General:
 * - Windowing where relevant returns length L - period + 1 outputs.
 * - Arrays must have matching lengths where required.
 */
export interface OtherIndicatorsBulk {
  /**
   * Rolling return on investment and percent return.
   *
   * For each consecutive pair (prices[i-1], prices[i]):
   * - Computes final value from previous step's final value as the next investment seed.
   *
   * @param prices Prices (length >= 2).
   * @param investment Initial investment amount.
   * @returns Array of [finalValue, percentReturn] per step (length L - 1).
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/return-on-investment/} Explanation and interactive playground
   */
  returnOnInvestment(prices: number[], investment: number): [number, number][];

  /**
   * Vectorized True Range for each bar.
   *
   * @param close Previous closes.
   * @param high Highs.
   * @param low Lows.
   * @returns TR per bar.
   * @throws If arrays are empty or lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/true-range/} Explanation and interactive playground
   */
  trueRange(close: number[], high: number[], low: number[]): number[];

  /**
   * Rolling Average True Range (ATR).
   *
   * @param close Previous closes.
   * @param high Highs.
   * @param low Lows.
   * @param constantModelType Central model for ATR averaging.
   * @param period Window size for ATR.
   * @returns ATR per window (length L - period + 1).
   * @throws If arrays are empty, lengths differ, or period > length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/average-true-range/} Explanation and interactive playground
   */
  averageTrueRange(
    close: number[],
    high: number[],
    low: number[],
    constantModelType: ConstantModelType,
    period: number
  ): number[];

  /**
   * Vectorized Internal Bar Strength (IBS).
   *
   * @param high Highs.
   * @param low Lows.
   * @param close Closes.
   * @returns IBS per bar.
   * @throws If arrays are empty or lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/internal-bar-strength/} Explanation and interactive playground
   */
  internalBarStrength(high: number[], low: number[], close: number[]): number[];

  /**
   * Positivity Indicator and its signal line.
   *
   * Definition:
   * - PI[i] = ((open[i] - previousClose[i]) / previousClose[i]) * 100
   * - Signal = moving average of PI using the selected model over signalPeriod
   * - Output tuples pair the raw PI at each window end with its signal.
   *
   * @param open Opening prices.
   * @param previousClose Previous closing prices.
   * @param signalPeriod Period used for the signal line.
   * @param constantModelType Model for the signal line (SMA, EMA, etc.).
   * @returns Array of [pi, signal] aligned to window ends (length L - signalPeriod + 1).
   * @throws If arrays are empty, lengths differ, or signalPeriod > length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/other-indicators/positivity-indicator/} Explanation and interactive playground
   */
  positivityIndicator(
    open: number[],
    previousClose: number[],
    signalPeriod: number,
    constantModelType: ConstantModelType
  ): [number, number][];
}

/**
 * Single-value standard indicators (classic defaults as in trading literature).
 * - SMA (full-window)
 * - Smoothed MA (full-window)
 * - EMA (full-window)
 * - Bollinger Bands (20 SMA, ±2 StdDev, full-window must be length 20)
 * - MACD (12/26 EMA with 9 EMA signal; full-window must be length 34)
 * - RSI (Smoothed MA, period 14; full-window must be length 14)
 */

/**
 * Single-value strength indicators.
 * Volume- and price-based measures of trend/conviction.
 */
export interface StrengthIndicatorsSingle {
  /**
   * Accumulation/Distribution (AD) update.
   * moneyFlowMultiplier = ((close - low) - (high - close)) / (high - low)
   * moneyFlowVolume = moneyFlowMultiplier * volume
   * AD = previousAD + moneyFlowVolume
   *
   * @param high High price.
   * @param low Low price.
   * @param close Close price.
   * @param volume Volume.
   * @param previousAccumulationDistribution Previous AD seed (0.0 if none).
   * @returns Updated AD value.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/strength-indicators/accumulation-distribution/} Explanation and interactive playground
   */
  accumulationDistribution(
    high: number,
    low: number,
    close: number,
    volume: number,
    previousAccumulationDistribution: number
  ): number;

  /**
   * Generic Volume Index update step (used by PVI/NVI).
   * change = (currentClose - previousClose)/previousClose
   * If previousIndex == 0: return change + change^2
   * Else: return previousIndex + (change * previousIndex)
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/strength-indicators/positive-volume-index/} Explanation and interactive playground
   */
  volumeIndex(
    currentClose: number,
    previousClose: number,
    previousVolumeIndex: number
  ): number;

  /**
   * Relative Vigor Index (RVI) over the full window.
   * Uses 4-sample weights on close-open and high-low differences, then a
   * central model (SMA/EMA/etc.) on numerator and denominator and returns their ratio.
   *
   * @param open Opening prices.
   * @param high Highs.
   * @param low Lows.
   * @param close Closes.
   * @param constantModelType Central model for smoothing numerator/denominator.
   * @returns RVI value.
   * @throws If lengths differ, empty, or length < 4.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/strength-indicators/relative-vigor-index/} Explanation and interactive playground
   */
  relativeVigorIndex(
    open: number[],
    high: number[],
    low: number[],
    close: number[],
    constantModelType: ConstantModelType
  ): number;
}

/**
 * Bulk/rolling strength indicators.
 */
export interface StrengthIndicatorsBulk {
  /**
   * Vectorized AD line 
   * @returns AD per bar.
   * @throws If lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/strength-indicators/accumulation-distribution/} Explanation and interactive playground
   */
  accumulationDistribution(
    high: number[],
    low: number[],
    close: number[],
    volume: number[],
    previousAccumulationDistribution: number
  ): number[];

  /**
   * Positive Volume Index (PVI).
   * Advances only when volume increases vs previous bar; otherwise repeats last value.
   * @returns PVI per step (length L-1).
   * @throws If lengths differ or empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/strength-indicators/positive-volume-index/} Explanation and interactive playground
   */
  positiveVolumeIndex(
    close: number[],
    volume: number[],
    previousPositiveVolumeIndex: number
  ): number[];

  /**
   * Negative Volume Index (NVI).
   * Advances only when volume decreases vs previous bar; otherwise repeats last value.
   * @returns NVI per step (length L-1).
   * @throws If lengths differ or empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/strength-indicators/negative-volume-index/} Explanation and interactive playground
   */
  negativeVolumeIndex(
    close: number[],
    volume: number[],
    previousNegativeVolumeIndex: number
  ): number[];

  /**
   * Rolling Relative Vigor Index (RVI) over a window.
   * @param open Opening prices.
   * @param high Highs.
   * @param low Lows.
   * @param close Closes.
   * @param constantModelType Central model for smoothing numerator/denominator.
   * @param period Window length (>= 4).
   * @returns RVI per window.
   * @throws If lengths differ, empty, period > length, or period < 4.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/strength-indicators/relative-vigor-index/} Explanation and interactive playground
   */
  relativeVigorIndex(
    open: number[],
    high: number[],
    low: number[],
    close: number[],
    constantModelType: ConstantModelType,
    period: number
  ): number[];
}

/**
 * Single-value trend indicators.
 */
export interface TrendIndicatorsSingle {
  /**
   * Aroon Up over the full window.
   * AroonUp = 100 * (periodsSinceMax / periodLength) with the current bar excluded from the lookback.
   * @param highs High prices (length >= 2).
   * @returns Aroon Up in [0, 100].
   * @throws If highs is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonUp(highs: number[]): number;

  /**
   * Aroon Down over the full window.
   * AroonDown = 100 * (periodsSinceMin / periodLength) with the current bar excluded from the lookback.
   * @param lows Low prices (length >= 2).
   * @returns Aroon Down in [0, 100].
   * @throws If lows is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonDown(lows: number[]): number;

  /**
   * Aroon Oscillator = AroonUp - AroonDown.
   * @param aroonUp Aroon Up value.
   * @param aroonDown Aroon Down value.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonOscillator(aroonUp: number, aroonDown: number): number;

  /**
   * Aroon Indicator triplet for the full window.
   * @param highs High prices.
   * @param lows Low prices.
   * @returns [aroonUp, aroonDown, aroonOscillator].
   * @throws If lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonIndicator(highs: number[], lows: number[]): [number, number, number];

  /**
   * Long Parabolic Time Price System (SAR) step.
   * sar = min(previousSar + af*(ep - previousSar), low).
   * @param previousSar Previous SAR (or window low if none).
   * @param extremePoint Highest high for the period.
   * @param accelerationFactor Step factor.
   * @param low Current/previous period low clamp.
   * @returns Next SAR.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/parabolic-time-price-system/} Explanation and interactive playground
   */
  longParabolicTimePriceSystem(
    previousSar: number,
    extremePoint: number,
    accelerationFactor: number,
    low: number
  ): number;

  /**
   * Short Parabolic Time Price System (SAR) step.
   * sar = max(previousSar - af*(previousSar - ep), high).
   * @param previousSar Previous SAR (or window high if none).
   * @param extremePoint Lowest low for the period.
   * @param accelerationFactor Step factor.
   * @param high Current/previous period high clamp.
   * @returns Next SAR.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/parabolic-time-price-system/} Explanation and interactive playground
   */
  shortParabolicTimePriceSystem(
    previousSar: number,
    extremePoint: number,
    accelerationFactor: number,
    high: number
  ): number;

  /**
   * Volume Price Trend (single step).
   * vpt = prevVpt + volume * ((current - previous) / previous).
   * @param currentPrice Current price.
   * @param previousPrice Previous price.
   * @param volume Current volume.
   * @param previousVolumePriceTrend Previous VPT seed.
   */
  volumePriceTrend(
    currentPrice: number,
    previousPrice: number,
    volume: number,
    previousVolumePriceTrend: number
  ): number;

  /**
   * True Strength Index (TSI) over the full window.
   * - Build momentum and abs(mom), smooth with first model/period (rolling),
   * - Smooth the result again with the second model (single),
   * - Return ratio secondSmoothing / absSecondSmoothing (0 if denominator is 0).
   * @param prices Prices.
   * @param firstConstantModel First smoothing model (rolling).
   * @param firstPeriod First smoothing period.
   * @param secondConstantModel Second smoothing model (single).
   * @returns TSI value (unitless).
   * @throws If prices is empty or too short for firstPeriod+1.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/true-strength-index/} Explanation and interactive playground
   */
  trueStrengthIndex(
    prices: number[],
    firstConstantModel: ConstantModelType,
    firstPeriod: number,
    secondConstantModel: ConstantModelType
  ): number;
}

/**
 * Bulk/rolling trend indicators.
 */
export interface TrendIndicatorsBulk {
  /**
   * Rolling Aroon Up.
   * @param highs High prices.
   * @param period Lookback length.
   * @returns Aroon Up per window.
   * @throws If period > highs.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonUp(highs: number[], period: number): number[];

  /**
   * Rolling Aroon Down.
   * @param lows Low prices.
   * @param period Lookback length.
   * @returns Aroon Down per window.
   * @throws If period > lows.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonDown(lows: number[], period: number): number[];

  /**
   * Rolling Aroon Oscillator (element-wise aroonUp - aroonDown).
   * @param aroonUp AroonUp series.
   * @param aroonDown AroonDown series.
   * @returns Oscillator series.
   * @throws If lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonOscillator(aroonUp: number[], aroonDown: number[]): number[];

  /**
   * Rolling Aroon Indicator.
   * @param highs High prices.
   * @param lows Low prices.
   * @param period Lookback length.
   * @returns Array of [aroonUp, aroonDown, oscillator].
   * @throws If lengths differ or period > length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/aroon-indicator/} Explanation and interactive playground
   */
  aroonIndicator(
    highs: number[],
    lows: number[],
    period: number
  ): [number, number, number][];

  /**
   * Rolling Parabolic Time Price System (Wilder's SAR variant).
   * Handles trend switches and AF updates internally, returns SAR per bar.
   * @param highs High prices.
   * @param lows Low prices.
   * @param accelerationFactorStart Initial AF.
   * @param accelerationFactorMax Maximum AF.
   * @param accelerationFactorStep AF increment.
   * @param startPosition Long or Short.
   * @param previousSar Previous SAR seed (0.0 if none).
   * @returns SAR values per bar.
   * @throws If inputs empty or lengths differ.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/parabolic-time-price-system/} Explanation and interactive playground
   */
  parabolicTimePriceSystem(
    highs: number[],
    lows: number[],
    accelerationFactorStart: number,
    accelerationFactorMax: number,
    accelerationFactorStep: number,
    startPosition: Position,
    previousSar: number
  ): number[];

  /**
   * Directional Movement System (+DI, -DI, ADX, ADXR).
   * @param highs High prices.
   * @param lows Low prices.
   * @param close Close prices.
   * @param period Smoothing window.
   * @param constantModelType Model for ADX smoothing.
   * @returns Array of [+di, -di, adx, adxr].
   * @throws If lengths differ, empty, or not enough data (len < 3*period).
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/directional-movement-system/} Explanation and interactive playground
   */
  directionalMovementSystem(
    highs: number[],
    lows: number[],
    close: number[],
    period: number,
    constantModelType: ConstantModelType
  ): [number, number, number, number][];

  /**
   * Rolling Volume Price Trend (VPT).
   * @param prices Price series (length L).
   * @param volumes Volume series (length L or L-1). If same length as prices, the first volume is skipped.
   * @param previousVolumePriceTrend Seed VPT value.
   * @returns VPT values per step (length L-1).
   * @throws If lengths mismatch or empty.
   */
  volumePriceTrend(
    prices: number[],
    volumes: number[],
    previousVolumePriceTrend: number
  ): number[];

  /**
   * Rolling True Strength Index (TSI).
   * @param prices Prices.
   * @param firstConstantModel First smoothing model.
   * @param firstPeriod First smoothing period.
   * @param secondConstantModel Second smoothing model.
   * @param secondPeriod Second smoothing period.
   * @returns TSI per window.
   * @throws If prices is empty or too short (len < first+second).
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/trend-indicators/true-strength-index/} Explanation and interactive playground
   */
  trueStrengthIndex(
    prices: number[],
    firstConstantModel: ConstantModelType,
    firstPeriod: number,
    secondConstantModel: ConstantModelType,
    secondPeriod: number
  ): number[];
}

/**
 * Single-value volatility indicators.
 */
export interface VolatilityIndicatorsSingle {
  /**
   * Ulcer Index over the full window.
   *
   * Definition:
   * - For each bar i, compute periodMax = max(prices[0..i]),
   *   drawdown% = 100 * (price[i] - periodMax) / periodMax.
   * - Return sqrt(mean(square(drawdown%))).
   *
   * @param prices Slice of prices (length >= 1).
   * @returns Ulcer Index (percentage points).
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/volatility-indicators/ulcer-index/} Explanation and interactive playground
   */
  ulcerIndex(prices: number[]): number;
}

/**
 * Bulk/rolling volatility indicators.
 */
export interface VolatilityIndicatorsBulk {
  /**
   * Rolling Ulcer Index.
   * @param prices Prices.
   * @param period Window length.
   * @returns Ulcer Index per window.
   * @throws If period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/volatility-indicators/ulcer-index/} Explanation and interactive playground
   */
  ulcerIndex(prices: number[], period: number): number[];

  /**
   * Welles Wilder's volatility system.
   *
   * Steps:
   * - Compute typical price = (high + low + close)/3
   * - Determine initial trend via overall OLS trend on first `period` typical prices
   * - Compute ATR per window using the selected constant model
   * - ARC = ATR * constantMultiplier
   * - Seed SAR from significant close of initial segment (max for Long, min for Short)
   * - For each subsequent bar, update SAR +/- ARC based on position and switch on crosses
   *
   * @param close Close prices.
   * @param high High prices.
   * @param low Low prices.
   * @param period ATR/trend lookback window.
   * @param constantMultiplier Multiplier applied to ATR to form ARC.
   * @param constantModelType Model used inside ATR (SMA/EMA/etc.).
   * @returns SAR-like levels per bar (aligned to period windows).
   * @throws If arrays are empty, lengths differ, or period > length.
   */
  volatilitySystem(
    close: number[],
    high: number[],
    low: number[],
    period: number,
    constantMultiplier: number,
    constantModelType: ConstantModelType
  ): number[];
}

/**
 * Single-value moving average utilities.
 */
export interface MovingAverageSingle {
  /**
   * Moving Average over the full window with the selected type.
   * @param prices Prices.
   * @param maType Moving average type (Simple, Smoothed, Exponential).
   * @returns Average value.
   * @throws If prices is empty.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/moving-averages/moving-average/} Explanation and interactive playground
   */
  movingAverage(prices: number[], maType: MovingAverageType): number;

  /**
   * McGinley Dynamic (single step or full-window last value semantics per Rust implementation).
   * @param latestPrice Latest price.
   * @param previousMcginleyDynamic Previous McGinley (0.0 if none).
   * @param period Period length (> 0).
   * @returns McGinley value.
   * @throws If period == 0.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/moving-averages/mcginley-dynamic/} Explanation and interactive playground
   */
  mcginleyDynamic(
    latestPrice: number,
    previousMcginleyDynamic: number,
    period: number
  ): number;
}

/**
 * Bulk/rolling moving average utilities.
 */
export interface MovingAverageBulk {
  /**
   * Rolling Moving Average.
   * @param prices Prices.
   * @param maType Moving average type (Simple, Smoothed, Exponential).
   * @param period Window length.
   * @returns Average value per window.
   * @throws If period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/moving-averages/moving-average/} Explanation and interactive playground
   */
  movingAverage(
    prices: number[],
    maType: MovingAverageType,
    period: number
  ): number[];

  /**
   * Rolling McGinley Dynamic, chaining previous value through the window sequence.
   * @param prices Prices.
   * @param previousMcginleyDynamic Seed McGinley (0.0 if none).
   * @param period Period length.
   * @returns McGinley values per step.
   * @throws If period > prices.length.
   * @see {@link https://tech.centaurresearchtechnologies.com/indicators/moving-averages/mcginley-dynamic/} Explanation and interactive playground
   */
  mcginleyDynamic(
    prices: number[],
    previousMcginleyDynamic: number,
    period: number
  ): number[];
}

export const candleIndicators: {
  single: CandleIndicatorsSingle;
  bulk: CandleIndicatorsBulk;
};

export const chartTrends: ChartTrends;

export const correlationIndicators: {
  single: CorrelationIndicatorsSingle;
  bulk: CorrelationIndicatorsBulk;
};

export const momentumIndicators: {
  single: MomentumIndicatorsSingle;
  bulk: MomentumIndicatorsBulk;
};

export const otherIndicators: {
  single: OtherIndicatorsSingle;
  bulk: OtherIndicatorsBulk;
};

export const strengthIndicators: {
  single: StrengthIndicatorsSingle;
  bulk: StrengthIndicatorsBulk;
};

export const trendIndicators: {
  single: TrendIndicatorsSingle;
  bulk: TrendIndicatorsBulk;
};

export const volatilityIndicators: {
  single: VolatilityIndicatorsSingle;
  bulk: VolatilityIndicatorsBulk;
};

export const movingAverage: {
  single: MovingAverageSingle;
  bulk: MovingAverageBulk;
};
