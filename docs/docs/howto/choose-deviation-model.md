# How to determine the best DeviationModel for a CentaurTechnicalIndicators-JS function

This guide shows how to programmatically determine the best DeviationModel for your indicator using the JavaScript package CentaurTechnicalIndicators-JS.

The rating model is overly simplified and should be refined to suit your needs before usage.

---

## 🎯 Goal

- Determine the best DeviationModel for Moving Constant Bands using an in-memory dataset

---

## 📦 Requirements

Install CentaurTechnicalIndicators-JS:

```bash
# npm
npm install centaur-technical-indicators-js

# yarn
yarn add centaur-technical-indicators-js

# pnpm
pnpm add centaur-technical-indicators-js
```

Initialize (recommended, required in browsers):

```js
import init from "centaur-technical-indicators-js";

await init(); // In Node it's a no-op; in browsers it loads WASM
```

---

## 💻 Step-by-Step

### 1. Use an in-memory dataset

For this guide, we’ll use a constant array of prices:

```js
const data = [
  6037.59, 5970.84, 5906.94, 5881.63, 5868.55, 5942.47, 5975.38, 5909.03,
  5918.25, 5827.04, 5836.22, 5842.91, 5949.91, 5937.34, 5996.66, 6049.24,
  6086.37, 6118.71, 6101.24, 6012.28, 6067.70, 6039.31, 6071.17, 6040.53,
  5994.57, 6037.88, 6061.48, 6083.57, 6025.99, 6066.44, 6068.50, 6051.97,
  6115.07, 6114.63, 6129.58, 6144.15, 6117.52, 6013.13, 5983.25, 5955.25,
  5956.06, 5861.57, 5954.50, 5849.72, 5778.15, 5842.63, 5738.52, 5770.20,
  5614.56, 5572.07, 5599.30, 5521.52, 5638.94
];
```

### 2. Calculate Moving Constant Bands for multiple deviation models

The default deviation model is the standard deviation; however other models may provide more insight.

We’ll test several deviation models while keeping the constant model fixed (e.g., ExponentialMovingAverage), a deviation multiplier (e.g., 2.0), and a short period (e.g., 5) for illustration.

```js
import init, {
  candleIndicators,
  ConstantModelType,
  DeviationModel
} from "centaur-technical-indicators-js";

await init();

const period = 5;
const deviationMultiplier = 2.0;
const constantModel = ConstantModelType.ExponentialMovingAverage;

const deviationModels = [
  DeviationModel.StandardDeviation,
  DeviationModel.MeanAbsoluteDeviation,
  DeviationModel.MedianAbsoluteDeviation,
  DeviationModel.ModeAbsoluteDeviation,
  DeviationModel.UlcerIndex,
];

// Example:
// const bands = candleIndicators.bulk.movingConstantBands(
//   data,
//   constantModel,
//   DeviationModel.StandardDeviation,
//   deviationMultiplier,
//   period
// );
```

### 3. Rate each model to find the best

> The logic is overly simple for the purpose of the guide.

- If price > upper band (overbought) and next price < current price, model gets +1
- If price < lower band (oversold) and next price > current price, model gets +1

We normalize the score by the number of "attempts" (how many times we evaluated a signal).

Alignment note for bulk outputs:
- candleIndicators.bulk.movingConstantBands(prices, …, period) returns an array of length prices.length - period + 1
- out[0] corresponds to the window prices[0..period-1] and “anchors” at prices[period-1]
- For price index i (starting at period-1), the bands index is bandsIdx = i - (period - 1)

```js
import {
  candleIndicators,
  ConstantModelType,
  DeviationModel
} from "centaur-technical-indicators-js";

/**
 * Returns { model: DeviationModel, rating: number }
 */
function chooseBestDeviationModel(
  prices,
  {
    constantModelType = ConstantModelType.ExponentialMovingAverage,
    deviationMultiplier = 2.0,
    period = 5,
  } = {}
) {
  const candidates = [
    DeviationModel.StandardDeviation,
    DeviationModel.MeanAbsoluteDeviation,
    DeviationModel.MedianAbsoluteDeviation,
    DeviationModel.ModeAbsoluteDeviation,
    DeviationModel.UlcerIndex,
  ];

  let bestRating = -1;
  let bestModel = candidates[0];

  for (const dm of candidates) {
    const bands = candleIndicators.bulk.movingConstantBands(
      prices,
      constantModelType,
      dm,
      deviationMultiplier,
      period
    );

    let currentRating = 0;
    let attempts = 0;

    // bands[0] anchors at prices[period - 1]
    for (let i = period - 1; i < prices.length - 1; i++) {
      const bandsIdx = i - (period - 1);
      const [lower, , upper] = bands[bandsIdx];

      // Overbought: expect next price to fall
      if (prices[i] > upper) {
        attempts += 1;
        if (prices[i + 1] < prices[i]) currentRating += 1;
      }

      // Oversold: expect next price to rise
      if (prices[i] < lower) {
        attempts += 1;
        if (prices[i + 1] > prices[i]) currentRating += 1;
      }
    }

    const averageRating = attempts > 0 ? currentRating / attempts : 0;
    if (averageRating > bestRating) {
      bestRating = averageRating;
      bestModel = dm;
    }
  }

  return { model: bestModel, rating: bestRating };
}
```

### 4. Full example

```js
import init, {
  candleIndicators,
  ConstantModelType,
  DeviationModel
} from "centaur-technical-indicators-js";

await init();

const data = [
  6037.59, 5970.84, 5906.94, 5881.63, 5868.55, 5942.47, 5975.38, 5909.03,
  5918.25, 5827.04, 5836.22, 5842.91, 5949.91, 5937.34, 5996.66, 6049.24,
  6086.37, 6118.71, 6101.24, 6012.28, 6067.70, 6039.31, 6071.17, 6040.53,
  5994.57, 6037.88, 6061.48, 6083.57, 6025.99, 6066.44, 6068.50, 6051.97,
  6115.07, 6114.63, 6129.58, 6144.15, 6117.52, 6013.13, 5983.25, 5955.25,
  5956.06, 5861.57, 5954.50, 5849.72, 5778.15, 5842.63, 5738.52, 5770.20,
  5614.56, 5572.07, 5599.30, 5521.52, 5638.94
];

function chooseBestDeviationModel(
  prices,
  {
    constantModelType = ConstantModelType.ExponentialMovingAverage,
    deviationMultiplier = 2.0,
    period = 5,
  } = {}
) {
  const candidates = [
    DeviationModel.StandardDeviation,
    DeviationModel.MeanAbsoluteDeviation,
    DeviationModel.MedianAbsoluteDeviation,
    DeviationModel.ModeAbsoluteDeviation,
    DeviationModel.UlcerIndex,
  ];

  let bestRating = -1;
  let bestModel = candidates[0];

  for (const dm of candidates) {
    const bands = candleIndicators.bulk.movingConstantBands(
      prices,
      constantModelType,
      dm,
      deviationMultiplier,
      period
    );

    let currentRating = 0;
    let attempts = 0;

    for (let i = period - 1; i < prices.length - 1; i++) {
      const bandsIdx = i - (period - 1);
      const [lower, , upper] = bands[bandsIdx];

      if (prices[i] > upper) {
        attempts += 1;
        if (prices[i + 1] < prices[i]) currentRating += 1;
      }
      if (prices[i] < lower) {
        attempts += 1;
        if (prices[i + 1] > prices[i]) currentRating += 1;
      }
    }

    const averageRating = attempts > 0 ? currentRating / attempts : 0;
    if (averageRating > bestRating) {
      bestRating = averageRating;
      bestModel = dm;
    }
  }

  return { model: bestModel, rating: bestRating };
}

const period = 5;
const devMult = 2.0;
const constantModel = ConstantModelType.ExponentialMovingAverage;

const { model, rating } = chooseBestDeviationModel(data, {
  constantModelType: constantModel,
  deviationMultiplier: devMult,
  period,
});

// Optional: pretty-print the enum
const deviationModelName =
  Object.entries(DeviationModel).find(([, v]) => v === model)?.[0] ?? String(model);

console.log(
  `Best model for Moving Constant Bands is ${deviationModelName} with a rating of ${rating}`
);
```

Notes:
- Valid ConstantModelType values include:
  - ConstantModelType.SimpleMovingAverage
  - ConstantModelType.SmoothedMovingAverage
  - ConstantModelType.ExponentialMovingAverage
  - ConstantModelType.SimpleMovingMedian
  - ConstantModelType.SimpleMovingMode
- Valid DeviationModel values include:
  - DeviationModel.StandardDeviation
  - DeviationModel.MeanAbsoluteDeviation
  - DeviationModel.MedianAbsoluteDeviation
  - DeviationModel.ModeAbsoluteDeviation
  - DeviationModel.UlcerIndex

---

## 🧪 Example Output

```text
Best model for Moving Constant Bands is MedianAbsoluteDeviation with a rating of 0.67
```

(Output will vary with data and scoring rules.)

---

## ✅ Next Steps

- Programmatically choose a period
- Programmatically choose a ConstantModelType
- Programmatically choose a deviation multiplier
- Combine all selections
- Introduce punishment to the rating system (e.g., penalize false signals/whipsaws)
