// Bundler/default wrapper: groups flat wasm exports into a natural namespace API.
import init, * as wasm from "./dist/bundler/centaur_technical_indicators.js";

// Re-export enums
export const { ConstantModelType, DeviationModel, Position, MovingAverageType } = wasm;

// Natural JS/TS namespace mirroring centaur_technical_indicators::candle_indicators::{single, bulk}
export const candleIndicators = {
  single: {
    movingConstantEnvelopes: wasm.candle_single_movingConstantEnvelopes,
    mcginleyDynamicEnvelopes: wasm.candle_single_mcginleyDynamicEnvelopes,
    movingConstantBands: wasm.candle_single_movingConstantBands,
    mcginleyDynamicBands: wasm.candle_single_mcginleyDynamicBands,
    ichimokuCloud: wasm.candle_single_ichimokuCloud,
    donchianChannels: wasm.candle_single_donchianChannels,
    keltnerChannel: wasm.candle_single_keltnerChannel,
    supertrend: wasm.candle_single_supertrend
  },
  bulk: {
    movingConstantEnvelopes: wasm.candle_bulk_movingConstantEnvelopes,
    mcginleyDynamicEnvelopes: wasm.candle_bulk_mcginleyDynamicEnvelopes,
    movingConstantBands: wasm.candle_bulk_movingConstantBands,
    mcginleyDynamicBands: wasm.candle_bulk_mcginleyDynamicBands,
    ichimokuCloud: wasm.candle_bulk_ichimokuCloud,
    donchianChannels: wasm.candle_bulk_donchianChannels,
    keltnerChannel: wasm.candle_bulk_keltnerChannel,
    supertrend: wasm.candle_bulk_supertrend
  }
};

// Chart trends namespace (no single/bulk split)
export const chartTrends = {
  peaks: wasm.chart_trends_peaks,
  valleys: wasm.chart_trends_valleys,
  peakTrend: wasm.chart_trends_peakTrend,
  valleyTrend: wasm.chart_trends_valleyTrend,
  overallTrend: wasm.chart_trends_overallTrend,
  breakDownTrends: wasm.chart_trends_breakDownTrends
};

export const correlationIndicators = {
  single: {
    correlateAssetPrices: wasm.correlation_single_correlateAssetPrices,
  },
  bulk: {
    correlateAssetPrices: wasm.correlation_bulk_correlateAssetPrices,
  },
};

export const momentumIndicators = {
  single: {
    relativeStrengthIndex: wasm.momentum_single_relativeStrengthIndex,
    stochasticOscillator: wasm.momentum_single_stochasticOscillator,
    slowStochastic: wasm.momentum_single_slowStochastic,
    slowestStochastic: wasm.momentum_single_slowestStochastic,
    williamsPercentR: wasm.momentum_single_williamsPercentR,
    moneyFlowIndex: wasm.momentum_single_moneyFlowIndex,
    rateOfChange: wasm.momentum_single_rateOfChange,
    onBalanceVolume: wasm.momentum_single_onBalanceVolume,
    commodityChannelIndex: wasm.momentum_single_commodityChannelIndex,
    mcginleyDynamicCommodityChannelIndex:
      wasm.momentum_single_mcginleyDynamicCommodityChannelIndex,
    macdLine: wasm.momentum_single_macdLine,
    signalLine: wasm.momentum_single_signalLine,
    mcginleyDynamicMacdLine: wasm.momentum_single_mcginleyDynamicMacdLine,
    chaikinOscillator: wasm.momentum_single_chaikinOscillator,
    percentagePriceOscillator: wasm.momentum_single_percentagePriceOscillator,
    chandeMomentumOscillator: wasm.momentum_single_chandeMomentumOscillator,
  },
  bulk: {
    relativeStrengthIndex: wasm.momentum_bulk_relativeStrengthIndex,
    stochasticOscillator: wasm.momentum_bulk_stochasticOscillator,
    slowStochastic: wasm.momentum_bulk_slowStochastic,
    slowestStochastic: wasm.momentum_bulk_slowestStochastic,
    williamsPercentR: wasm.momentum_bulk_williamsPercentR,
    moneyFlowIndex: wasm.momentum_bulk_moneyFlowIndex,
    rateOfChange: wasm.momentum_bulk_rateOfChange,
    onBalanceVolume: wasm.momentum_bulk_onBalanceVolume,
    commodityChannelIndex: wasm.momentum_bulk_commodityChannelIndex,
    mcginleyDynamicCommodityChannelIndex:
      wasm.momentum_bulk_mcginleyDynamicCommodityChannelIndex,
    macdLine: wasm.momentum_bulk_macdLine,
    signalLine: wasm.momentum_bulk_signalLine,
    mcginleyDynamicMacdLine: wasm.momentum_bulk_mcginleyDynamicMacdLine,
    chaikinOscillator: wasm.momentum_bulk_chaikinOscillator,
    percentagePriceOscillator: wasm.momentum_bulk_percentagePriceOscillator,
    chandeMomentumOscillator: wasm.momentum_bulk_chandeMomentumOscillator,
  },
};

export const otherIndicators = {
  single: {
    returnOnInvestment: wasm.other_single_returnOnInvestment,
    trueRange: wasm.other_single_trueRange,
    averageTrueRange: wasm.other_single_averageTrueRange,
    internalBarStrength: wasm.other_single_internalBarStrength,
  },
  bulk: {
    returnOnInvestment: wasm.other_bulk_returnOnInvestment,
    trueRange: wasm.other_bulk_trueRange,
    averageTrueRange: wasm.other_bulk_averageTrueRange,
    internalBarStrength: wasm.other_bulk_internalBarStrength,
    positivityIndicator: wasm.other_bulk_positivityIndicator,
  },
};

export const strengthIndicators = {
  single: {
    accumulationDistribution: wasm.strength_single_accumulationDistribution,
    volumeIndex: wasm.strength_single_volumeIndex,
    relativeVigorIndex: wasm.strength_single_relativeVigorIndex,
  },
  bulk: {
    accumulationDistribution: wasm.strength_bulk_accumulationDistribution,
    positiveVolumeIndex: wasm.strength_bulk_positiveVolumeIndex,
    negativeVolumeIndex: wasm.strength_bulk_negativeVolumeIndex,
    relativeVigorIndex: wasm.strength_bulk_relativeVigorIndex,
  },
};

export const trendIndicators = {
  single: {
    aroonUp: wasm.trend_single_aroonUp,
    aroonDown: wasm.trend_single_aroonDown,
    aroonOscillator: wasm.trend_single_aroonOscillator,
    aroonIndicator: wasm.trend_single_aroonIndicator,
    longParabolicTimePriceSystem: wasm.trend_single_longParabolicTimePriceSystem,
    shortParabolicTimePriceSystem: wasm.trend_single_shortParabolicTimePriceSystem,
    volumePriceTrend: wasm.trend_single_volumePriceTrend,
    trueStrengthIndex: wasm.trend_single_trueStrengthIndex,
  },
  bulk: {
    aroonUp: wasm.trend_bulk_aroonUp,
    aroonDown: wasm.trend_bulk_aroonDown,
    aroonOscillator: wasm.trend_bulk_aroonOscillator,
    aroonIndicator: wasm.trend_bulk_aroonIndicator,
    parabolicTimePriceSystem: wasm.trend_bulk_parabolicTimePriceSystem,
    directionalMovementSystem: wasm.trend_bulk_directionalMovementSystem,
    volumePriceTrend: wasm.trend_bulk_volumePriceTrend,
    trueStrengthIndex: wasm.trend_bulk_trueStrengthIndex,
  },
};

export const volatilityIndicators = {
  single: {
    ulcerIndex: wasm.volatility_single_ulcerIndex,
  },
  bulk: {
    ulcerIndex: wasm.volatility_bulk_ulcerIndex,
    volatilitySystem: wasm.volatility_bulk_volatilitySystem,
  },
};

export const movingAverage = {
  single: {
    movingAverage: wasm.ma_single_movingAverage,
    mcginleyDynamic: wasm.ma_single_mcginleyDynamic,
  },
  bulk: {
    movingAverage: wasm.ma_bulk_movingAverage,
    mcginleyDynamic: wasm.ma_bulk_mcginleyDynamic,
  },
};

export default init;
