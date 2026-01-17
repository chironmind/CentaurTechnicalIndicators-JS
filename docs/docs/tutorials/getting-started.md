# Tutorial 1: Getting started with CentaurTechnicalIndicators-JS

Leverage Rust-powered speed from JavaScript — compute indicators directly on plain arrays.

This tutorial is the first in a series:

- 01 - Getting started with CentaurTechnicalIndicators-JS (this page)
- [02 - Plotting your indicators](plotting.md)
- [03 - More advanced use cases](advanced.md)
- [04 - Getting data from an API](api.md)
- [05 - Real-time updates with WebSockets (single vs bulk)](websockets.md)

---

## 🎯 What you’ll learn

- Install and initialize CentaurTechnicalIndicators-JS
- Understand the single vs bulk API style
- Compute:
  - Simple Moving Average (SMA)
  - Moving Constant Bands (generic Bollinger-like bands)
  - Relative Strength Index (RSI)
  - Average True Range (ATR)
- Handle window alignment and common pitfalls

---

## 📦 Prerequisites

Install CentaurTechnicalIndicators-JS:

```bash
# npm
npm install centaur-technical-indicators

# yarn
yarn add centaur-technical-indicators

# pnpm
pnpm add centaur-technical-indicators
```

Initialize (required in browsers; a no-op in Node for parity):

```js
import init from "centaur-technical-indicators";
await init();
```

---

## 🧱 Library structure (quick recap)

- Namespaces group indicators by families:
  - movingAverage, momentumIndicators, candleIndicators, otherIndicators, trendIndicators, strengthIndicators, volatilityIndicators, correlationIndicators, chartTrends
- Each indicator namespace typically exposes:
  - single: full-window, scalar/tuple output
  - bulk: rolling windows, vector output (length L - N + 1 for window N)

Enums you’ll use frequently:
- MovingAverageType: Simple, Smoothed, Exponential
- ConstantModelType: SimpleMovingAverage, SmoothedMovingAverage, ExponentialMovingAverage, SimpleMovingMedian, SimpleMovingMode
- DeviationModel: StandardDeviation, MeanAbsoluteDeviation, MedianAbsoluteDeviation, ModeAbsoluteDeviation, UlcerIndex

---

## 📥 Data 

We’ll use a constant array for Close prices. For ATR, we’ll derive simple High/Low arrays from Close just for demonstration (use real OHLC in practice).

```js
// Close prices
const close = [
  6037.59, 5970.84, 5906.94, 5881.63, 5868.55, 5942.47, 5975.38, 5909.03,
  5918.25, 5827.04, 5836.22, 5842.91, 5949.91, 5937.34, 5996.66, 6049.24,
  6086.37, 6118.71, 6101.24, 6012.28, 6067.70, 6039.31, 6071.17, 6040.53,
  5994.57, 6037.88, 6061.48, 6083.57, 6025.99, 6066.44, 6068.50, 6051.97,
  6115.07, 6114.63, 6129.58, 6144.15, 6117.52, 6013.13, 5983.25, 5955.25,
  5956.06, 5861.57, 5954.50, 5849.72, 5778.15, 5842.63, 5738.52, 5770.20,
  5614.56, 5572.07, 5599.30, 5521.52, 5638.94
];

// Synthetic High/Low for ATR demo (replace with real OHLC in practice)
const high = close.map(v => v + 20);
const low  = close.map(v => v - 20);
```

---

## ✅ Example 1: Simple Moving Average (SMA)

Helpers live under movingAverage. Use MovingAverageType to pick Simple/Smoothed/Exponential.

```js
import init, { movingAverage, MovingAverageType } from "centaur-technical-indicators";
await init();

// Single: average over the full array
const smaAll = movingAverage.single.movingAverage(close, MovingAverageType.Simple);
console.log("Full-series SMA:", smaAll);

// Bulk: rolling SMA with period=20
const periodSMA = 20;
const smaSeries = movingAverage.bulk.movingAverage(close, MovingAverageType.Simple, periodSMA);
console.log(`SMA(${periodSMA}) series length:`, smaSeries.length);
// Alignment tip: smaSeries[0] corresponds to close[0..19] and anchors at close[19]
```

---

## ✅ Example 2: Moving Constant Bands (generic Bollinger-like bands)

Bands around a moving “constant” (e.g., EMA) using a deviation model (e.g., StdDev). Outputs are [lower, middle, upper].

```js
import init, {
  candleIndicators,
  ConstantModelType,
  DeviationModel
} from "centaur-technical-indicators";
await init();

const periodBands = 20;
const constantModel = ConstantModelType.ExponentialMovingAverage;
const deviationModel = DeviationModel.StandardDeviation;
const deviationMultiplier = 2.0;

// Single (latest window)
const latestWindow = close.slice(-periodBands);
const [lower1, middle1, upper1] = candleIndicators.single.movingConstantBands(
  latestWindow,
  constantModel,
  deviationModel,
  deviationMultiplier
);
console.log("Latest MCB (single):", lower1, middle1, upper1);

// Bulk (rolling across the whole series)
const bands = candleIndicators.bulk.movingConstantBands(
  close,
  constantModel,
  deviationModel,
  deviationMultiplier,
  periodBands
);
// bands[i] => [lower, middle, upper] for window close[i..i+periodBands-1], anchored at close[i+periodBands-1]
const [lowerLast, middleLast, upperLast] = bands[bands.length - 1];
console.log("Last MCB (bulk):", lowerLast, middleLast, upperLast);
```

---

## ✅ Example 3: Relative Strength Index (RSI)

Use momentumIndicators with a ConstantModelType (SmoothedMovingAverage is the common default in many RSI formulations).

```js
import init, { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";
await init();

const periodRSI = 14;
const rsiSeries = momentumIndicators.bulk.relativeStrengthIndex(
  close,
  ConstantModelType.SmoothedMovingAverage,
  periodRSI
);
console.log(`RSI(${periodRSI}) length:`, rsiSeries.length);

// Latest RSI using single on the last window
const rsiLatest = momentumIndicators.single.relativeStrengthIndex(
  close.slice(-periodRSI),
  ConstantModelType.SmoothedMovingAverage
);
console.log("Latest RSI (single):", rsiLatest);
```

---

## ✅ Example 4: Average True Range (ATR)

ATR measures average true range of movement; provide aligned arrays for previous close, high, and low. You can choose the averaging model (e.g., ExponentialMovingAverage) and a window.

```js
import init, { otherIndicators, ConstantModelType } from "centaur-technical-indicators";
await init();

const periodATR = 14;
const atrSeries = otherIndicators.bulk.averageTrueRange(
  close, // previous closes
  high,
  low,
  ConstantModelType.ExponentialMovingAverage,
  periodATR
);
console.log(`ATR(${periodATR}) length:`, atrSeries.length);
console.log("Latest ATR:", atrSeries[atrSeries.length - 1]);

// Note: atrSeries[0] corresponds to close/high/low window [0..periodATR-1], anchored at index periodATR-1
```

---

## 🛠️ Alignment and windows

- Bulk outputs shrink: length = L - N + 1 for a window N over L inputs.
- For i from 0 to L - N:
  - bulkOut[i] corresponds to input slice inputs[i..i+N-1]
  - “Anchors” at inputs[i + N - 1] (the right edge of each rolling window)

---

## 🧪 Single vs Bulk — when to choose

- single: one full-window value (e.g., latest signal, dashboard, streaming tick updates)
- bulk: historical series over rolling windows (e.g., chart overlays, backtests, feature engineering)

---

## ⚙️ Tips

- Always await init() in browsers (it loads the WebAssembly module).
- Use number[] or Float64Array. For large series, consider chunking to amortize crossings.
- Consistency matters: arrays for multi-input indicators (e.g., ATR) must be the same length.

---

## ✅ Next step

- [Plot your indicators](plotting.md)

Happy analyzing! 🦀📈
