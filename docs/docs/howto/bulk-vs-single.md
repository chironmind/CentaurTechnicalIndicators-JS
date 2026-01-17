# When to choose bulk vs single functions in CentaurTechnicalIndicators-JS

This guide shows when to choose the bulk version of a function or the single version of a function using the JavaScript package CentaurTechnicalIndicators-JS.

---

## 🎯 Goal

- Understand when to use bulk or single functions

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

Initialize (recommended especially in browsers):

```js
import init from "centaur-technical-indicators";

await init(); // In Node it's a no-op; in browsers it loads WASM
```

---

## 💻 Step-by-Step

### 1. What period are you using?

Determine how much time (period) you want to include when computing the indicator (e.g., RSI period = 14).

### 2. Observe the data

Do you have just enough data to cover the period?

- If yes, you’ll only be able to calculate a single value for the indicator.

Do you have extra data?

- If yes, you’ll be able to calculate multiple values over time (historical series).

### 3. What is your goal?

Will previous values for the indicator help you make a decision?

- If yes, make sure you collect enough data to compute previous values (use bulk).
- If no (e.g., streaming updates), compute just the latest value (use single).

### 4. Example (RSI)

The default RSI often uses 14 previous prices. If you have 53 days of data you can:
- Use the bulk function to calculate the historical RSIs.
- When a new price comes in, use the single function on the latest window.

```js
import init, { momentumIndicators, ConstantModelType } from "centaur-technical-indicators";

await init();

// 53 example closing prices
const data = [
  6037.59, 5970.84, 5906.94, 5881.63, 5868.55, 5942.47, 5975.38, 5909.03,
  5918.25, 5827.04, 5836.22, 5842.91, 5949.91, 5937.34, 5996.66, 6049.24,
  6086.37, 6118.71, 6101.24, 6012.28, 6067.70, 6039.31, 6071.17, 6040.53,
  5994.57, 6037.88, 6061.48, 6083.57, 6025.99, 6066.44, 6068.50, 6051.97,
  6115.07, 6114.63, 6129.58, 6144.15, 6117.52, 6013.13, 5983.25, 5955.25,
  5956.06, 5861.57, 5954.50, 5849.72, 5778.15, 5842.63, 5738.52, 5770.20,
  5614.56, 5572.07, 5599.30, 5521.52, 5638.94
];

const period = 14;
const model = ConstantModelType.SmoothedMovingAverage; // also see other options below

// 1) Bulk: compute historical RSI values
const rsiSeries = momentumIndicators.bulk.relativeStrengthIndex(data, model, period);
console.log("Bulk RSIs:", rsiSeries);

// 2) Single: compute the next/latest RSI when a new price arrives
const newPrice = 5769.21;
data.push(newPrice);

// For period=14, use the latest 14 prices for single RSI
const latestWindow = data.slice(-period);
const latestRsi = momentumIndicators.single.relativeStrengthIndex(latestWindow, model);
console.log("Single RSI:", latestRsi);
```

Notes:
- Valid ConstantModelType values:
  - ConstantModelType.SimpleMovingAverage
  - ConstantModelType.SmoothedMovingAverage
  - ConstantModelType.ExponentialMovingAverage
  - ConstantModelType.SimpleMovingMedian
  - ConstantModelType.SimpleMovingMode
- Tip (standard 14-period RSI):
  - standardIndicators.single.rsi(pricesOfLength14) // exactly 14 values
  - standardIndicators.bulk.rsi(allPrices)          // rolling 14 over the series

---

## 🧪 Example Output

```text
Bulk RSIs: [47.49434607156126, 50.3221945432267, ..., 40.34609500741716]
Single RSI: 48.00106962275036
```

- Use bulk when: calculating many historical values, initial setup, backtesting
- Use single when: real-time updates, streaming data, memory constraints
