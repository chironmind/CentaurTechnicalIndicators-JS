# How to determine the best period for a CentaurTechnicalIndicators-JS function

This guide shows how to programmatically determine the best period for your indicator using the JavaScript package CentaurTechnicalIndicators-JS.

The rating model is overly simplified and should be refined to suit your needs before usage.

---

## 🎯 Goal

- Determine the best period for the RSI using an in-memory dataset

---

## 📦 Requirements

Install CentaurTechnicalIndicators-JS:

```bash
# npm
npm install centaur-technical-indicators

# yarn
yarn add centaur-technical-indicators

# pnpm
pnpm add centaur-technical-indicators
```

Initialize (recommended, required in browsers):

```js
import init from "centaur-technical-indicators";

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

### 2. Calculate the RSI for multiple periods

The common/default RSI period is 14. We’ll iterate from 2 to 15 to see if a different period performs better (excluding 1 to avoid degenerate windows).

```js
import init, { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";

await init();

const model = ConstantModelType.SmoothedMovingAverage; // default flavor for RSI
// Example bulk call for a given period:
// const rsiSeries = momentumIndicators.bulk.relativeStrengthIndex(data, model, period);
```

### 3. Rate each different RSI to find the best

> The logic is overly simple for the purpose of the guide.

- If RSI > 70 (overbought) and the next price < current price, the period gets +1
- If RSI < 30 (oversold) and the next price > current price, the period gets +1

We normalize the score by the number of "attempts" (how many times we evaluated a signal).

Alignment note for bulk outputs:
- momentumIndicators.bulk.relativeStrengthIndex(prices, model, period) returns an array of length prices.length - period + 1
- rsiSeries[0] corresponds to the window prices[0..period-1] and “anchors” at prices[period-1]
- For price index i (starting at period-1), the RSI index is rsiIdx = i - (period - 1)

```js
import { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";

/**
 * Returns { period: number, rating: number }
 */
function chooseBestRsiPeriod(prices, minP = 2, maxP = 15) {
  const model = ConstantModelType.SmoothedMovingAverage;

  let bestRating = -1;
  let bestPeriod = minP;

  for (let p = minP; p <= maxP; p++) {
    const rsi = momentumIndicators.bulk.relativeStrengthIndex(prices, model, p);

    let currentRating = 0;
    let attempts = 0;

    // rsi[0] anchors at prices[p - 1]
    for (let i = p - 1; i < prices.length - 1; i++) {
      const rsiVal = rsi[i - (p - 1)];

      // Overbought: expect price to fall next step
      if (rsiVal > 70) {
        attempts += 1;
        if (prices[i + 1] < prices[i]) currentRating += 1;
      }

      // Oversold: expect price to rise next step
      if (rsiVal < 30) {
        attempts += 1;
        if (prices[i + 1] > prices[i]) currentRating += 1;
      }
    }

    const averageRating = attempts > 0 ? currentRating / attempts : 0;
    if (averageRating > bestRating) {
      bestRating = averageRating;
      bestPeriod = p;
    }
  }

  return { period: bestPeriod, rating: bestRating };
}
```

### 4. Full example

```js
import init, { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";

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

function chooseBestRsiPeriod(prices, minP = 2, maxP = 15) {
  const model = ConstantModelType.SmoothedMovingAverage;

  let bestRating = -1;
  let bestPeriod = minP;

  for (let p = minP; p <= maxP; p++) {
    const rsi = momentumIndicators.bulk.relativeStrengthIndex(prices, model, p);

    let currentRating = 0;
    let attempts = 0;

    for (let i = p - 1; i < prices.length - 1; i++) {
      const rsiVal = rsi[i - (p - 1)];

      if (rsiVal > 70) {
        attempts += 1;
        if (prices[i + 1] < prices[i]) currentRating += 1;
      }
      if (rsiVal < 30) {
        attempts += 1;
        if (prices[i + 1] > prices[i]) currentRating += 1;
      }
    }

    const averageRating = attempts > 0 ? currentRating / attempts : 0;
    if (averageRating > bestRating) {
      bestRating = averageRating;
      bestPeriod = p;
    }
  }

  return { period: bestPeriod, rating: bestRating };
}

const result = chooseBestRsiPeriod(data, 2, 15);
console.log(`Best period for RSI is ${result.period} with a rating of ${result.rating}`);
```

Notes:
- Valid ConstantModelType values include:
  - ConstantModelType.SimpleMovingAverage
  - ConstantModelType.SmoothedMovingAverage
  - ConstantModelType.ExponentialMovingAverage
  - ConstantModelType.SimpleMovingMedian
  - ConstantModelType.SimpleMovingMode

---

## 🧪 Example Output

```text
Best period for RSI is 7 with a rating of 0.56
```

(Output will vary with data and scoring rules.)

---

## ✅ Next Steps

- Programmatically choose a constant model type (see: choose-constant-model-type.md)
- Combine period selection and constant model type selection
- Introduce the notion of punishment to the rating system (e.g., penalize false signals/whipsaws)
