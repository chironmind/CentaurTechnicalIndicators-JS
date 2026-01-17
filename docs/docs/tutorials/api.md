# Tutorial 4: Connecting to a Market Data API (JavaScript)

Learn how to fetch fresh OHLCV data from a public API, convert it into plain arrays, and analyze it with CentaurTechnicalIndicators-JS.  
This workflow enables automated, up-to-date, and repeatable research pipelines — without CSVs.

Series so far:
- [01 - Getting started with CentaurTechnicalIndicators-JS](getting-started.md)
- [02 - Plotting your indicators](plotting.md)
- [03 - More advanced use cases](advanced.md)
- [04 - Getting data from an API] (this file)
- [05 - Real-time updates with WebSockets (single vs bulk)](websockets.md)

---

## 🎯 Goal

- Fetch OHLCV (Open, High, Low, Close, Volume) data from a free market data API
- Parse JSON into arrays suitable for CentaurTechnicalIndicators-JS
- Run your indicator pipeline on fresh data (SMA, Bands, RSI, ATR)
- Understand alignment for rolling outputs
- Optional: wire results into the Plotly dashboard from Tutorial 2

---

## 📦 Prerequisites

- JavaScript runtime:
  - Browser: modern browser with ESM modules
  - Node.js: v18+ (has global fetch). For older Node, install node-fetch.
- Packages:
  ```bash
  npm install centaur-technical-indicators
  # If plotting later:
  # npm install plotly.js-dist-min
  ```

Initialize CentaurTechnicalIndicators-JS (required in browsers; no-op in Node):
```js
import init from "centaur-technical-indicators";
await init();
```

---

## 🔍 Using Binance’s free market data API

We’ll use Binance’s public API for OHLCV “klines” (no API key required).

Docs: https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data

Example endpoint (daily BTCUSDT, 365 bars):
```
https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=365
```
- Replace `BTCUSDT` with another supported symbol.
- `interval` can be `1d`, `1h`, etc.
- `limit` controls number of bars.

Note: Some environments may encounter CORS restrictions for browser-based fetches. If so, use Node, a proxy, or your own backend.

---

## 🧑‍💻 Fetch OHLCV and map to arrays

```js
// api-connection.mjs
import init, {
  movingAverage,
  momentumIndicators,
  candleIndicators,
  otherIndicators,
  ConstantModelType,
  DeviationModel,
  MovingAverageType
} from "centaur-technical-indicators";

await init();

/**
 * Fetch OHLCV from Binance and map into arrays.
 * @param {string} symbol e.g., "BTCUSDT"
 * @param {string} interval e.g., "1d", "1h"
 * @param {number} limit number of bars (<= 1500 typically)
 * @returns {Promise<{date:string[], open:number[], high:number[], low:number[], close:number[], volume:number[]}>}
 */
async function fetchBinanceKlines(symbol = "BTCUSDT", interval = "1d", limit = 365) {
  const url = new URL("https://api.binance.com/api/v3/klines");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));

  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
  }
  const raw = await resp.json();
  // Each row: [OpenTime, Open, High, Low, Close, Volume, CloseTime, ...]
  const date = [];
  const open = [];
  const high = [];
  const low = [];
  const close = [];
  const volume = [];

  for (const row of raw) {
    const openTime = row[0];
    date.push(new Date(openTime).toISOString()); // ISO datetime; use .slice(0,10) for YYYY-MM-DD
    open.push(parseFloat(row[1]));
    high.push(parseFloat(row[2]));
    low.push(parseFloat(row[3]));
    close.push(parseFloat(row[4]));
    volume.push(parseFloat(row[5]));
  }

  return { date, open, high, low, close, volume };
}

const { date, open, high, low, close } = await fetchBinanceKlines("BTCUSDT", "1d", 365);
console.log(`Fetched ${close.length} bars for BTCUSDT`);
```

---

## ⚙️ Run indicators on fresh data

We’ll compute:
- SMA(20)
- Moving Constant Bands (EMA + StdDev, x2, period 20)
- RSI(20) with SmoothedMovingAverage
- ATR(14) with ExponentialMovingAverage

```js
const smaPeriod = 20;
const sma20 = movingAverage.bulk.movingAverage(
  close,
  MovingAverageType.Simple,
  smaPeriod
);

// Moving Constant Bands
const bandsPeriod = 20;
const bands = candleIndicators.bulk.movingConstantBands(
  close,
  ConstantModelType.ExponentialMovingAverage,
  DeviationModel.StandardDeviation,
  2.0,
  bandsPeriod
);
const mcbLower = bands.map(t => t[0]);
const mcbMid   = bands.map(t => t[1]);
const mcbUpper = bands.map(t => t[2]);

// RSI
const rsiPeriod = 20;
const rsi20 = momentumIndicators.bulk.relativeStrengthIndex(
  close,
  ConstantModelType.SmoothedMovingAverage,
  rsiPeriod
);

// ATR
const atrPeriod = 14;
const atr14 = otherIndicators.bulk.averageTrueRange(
  close, // previous closes
  high,
  low,
  ConstantModelType.ExponentialMovingAverage,
  atrPeriod
);

// Alignment: rolling outputs are shorter. Right-align to dates:
const tail = (xs, n) => xs.slice(xs.length - n);
const xSMA   = tail(date, sma20.length);
const xBands = tail(date, bands.length);
const xRSI   = tail(date, rsi20.length);
const xATR   = tail(date, atr14.length);

// Inspect latest values
console.log("Latest SMA20:", sma20[sma20.length - 1]);
console.log("Latest Bands:", {
  lower: mcbLower[mcbLower.length - 1],
  mid:   mcbMid[mcbMid.length - 1],
  upper: mcbUpper[mcbUpper.length - 1]
});
console.log("Latest RSI20:", rsi20[rsi20.length - 1]);
console.log("Latest ATR14:", atr14[atr14.length - 1]);
```

---

## 📊 Visualize (optional)

Reuse the Plotly layout from Tutorial 2.  
At minimum, replace the hardcoded arrays there with your freshly fetched arrays here:
- Candles: x=date, open/open, high/high, low/low, close/close
- SMA trace: x=xSMA, y=sma20
- Bands traces: x=xBands with mcbUpper/mcbLower fill and mcbMid line
- RSI trace: x=xRSI, y=rsi20 (+ horizontal shapes at 70/30)
- ATR trace: x=xATR, y=atr14

See: Tutorial 2: Visualizing Indicators with Plotly (JavaScript)

---

## 🔄 Real-time and incremental updates (optional)

When a new bar arrives, you can compute “single” values on the last N samples without recomputing the entire history:

```js
import { momentumIndicators, otherIndicators, candleIndicators, ConstantModelType, DeviationModel } from "centaur-technical-indicators";

// Example: update RSI(20), ATR(14), and Bands(20) on the latest bar
function computeLatestSnapshots(close, high, low) {
  const latestRSI = momentumIndicators.single.relativeStrengthIndex(
    close.slice(-rsiPeriod),
    ConstantModelType.SmoothedMovingAverage
  );

  const latestATR = otherIndicators.single.averageTrueRange(
    close.slice(-atrPeriod), // previous closes for the window
    high.slice(-atrPeriod),
    low.slice(-atrPeriod),
    ConstantModelType.ExponentialMovingAverage
  );

  const [lower, mid, upper] = candleIndicators.single.movingConstantBands(
    close.slice(-bandsPeriod),
    ConstantModelType.ExponentialMovingAverage,
    DeviationModel.StandardDeviation,
    2.0
  );

  return { latestRSI, latestATR, bands: { lower, mid, upper } };
}
```

Note: For true live streaming, also handle partial candles (intra-bar) vs. closed candles and consider debouncing update frequency.

---

## 🧪 Handling alignment and edge cases

- Rolling functions return arrays of length L - N + 1 (L = input length, N = period).
- Right-align x-axis values with the tail of your date/time array.
- Ensure arrays (open, high, low, close) have identical lengths.
- For very small histories (length < period), compute only single values on available windows.

---

## 🛡️ Disclaimer

- Respect API rate limits and terms of use.
- Add retries and error handling for production usage.
- This example is educational; validate indicators and assumptions before using in live systems.

---

Happy fetching! 🦀🌐📈
