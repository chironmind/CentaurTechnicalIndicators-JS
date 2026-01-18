# Tutorial: Hybrid REST + WebSocket indicators — bulk & single calculations with CentaurTechnicalIndicators-JS

In this tutorial, you’ll build a live dashboard that combines:
- **Bulk** calculations (for historical data, batch analysis)
- **Single** calculations (for real-time updates, streaming)

You’ll fetch historical OHLCV bars from Binance REST API, run full-series indicator calculations, then subscribe to new bars via Binance WebSocket and compute indicators for each new tick.  
All charted live in Plotly.js!

This tutorial is the last in the series:
- [01 - Getting started with CentaurTechnicalIndicators-JS](getting-started.md)
- [02 - Visualizing Indicators with Plotly](plotting.md)
- [03 - More advanced use cases](advanced.md)
- [04 - Getting data from an API](api.md)
- [05 - Real-time updates with WebSockets (single vs bulk)](websockets.md)


---

## 🎯 What you’ll learn

- How to fetch historical 1m bars from Binance via REST
- How to run “bulk” indicator calculations with CentaurTechnicalIndicators-JS
- How to subscribe to live 1m bars via Binance WebSocket
- How to run “single” indicator calculations on new bars
- How to display a live technical dashboard with Plotly.js

---

## 📦 Prerequisites

- Modern browser (recommended for this tutorial)
- `centaur-technical-indicators` (technical indicators)
- `plotly.js-dist-min` (for charting)

```bash
npm install centaur-technical-indicators plotly.js-dist-min
```

If you prefer using Plotly via CDN, you can include `<script src="https://cdn.plot.ly/plotly-2.30.0.min.js"></script>` in your HTML.

---

## 🧱 Project scaffold

Minimal HTML to host the dashboard:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Hybrid REST + WebSocket Technical Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.plot.ly/plotly-2.30.0.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 100%; max-width: 1200px; margin: 0 auto; height: 700px;"></div>
    <pre id="log" style="max-width: 1000px; margin: 1rem auto; white-space: pre-wrap;"></pre>
    <script type="module" src="/hybrid-dashboard.mjs"></script>
  </body>
</html>
```

---

## 1️⃣ Fetch historical data via REST

Use Binance’s REST API to get the last N 1m bars for your symbol.

```js
// hybrid-dashboard.mjs
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

const SYMBOL = "BTCUSDT";
const INTERVAL = "1m";
const REST_LIMIT = 500; // Binance max is 1000 for most intervals

async function fetchBinanceKlines(symbol = "BTCUSDT", interval = "1m", limit = 500) {
  const url = new URL("https://api.binance.com/api/v3/klines");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const raw = await resp.json();
  // [OpenTime, Open, High, Low, Close, Volume, ...]
  const date = [], open = [], high = [], low = [], close = [], volume = [];
  for (const row of raw) {
    date.push(new Date(row[0]).toISOString());
    open.push(+row[1]);
    high.push(+row[2]);
    low.push(+row[3]);
    close.push(+row[4]);
    volume.push(+row[5]);
  }
  return { date, open, high, low, close, volume };
}

const history = await fetchBinanceKlines(SYMBOL, INTERVAL, REST_LIMIT);
```

---

## 2️⃣ Run bulk calculations on historical data

Pick your indicator periods:

```js
const SMA_PERIOD = 20;
const BANDS_PERIOD = 20;
const BANDS_MODEL = ConstantModelType.ExponentialMovingAverage;
const DEV_MODEL = DeviationModel.StandardDeviation;
const DEV_MULT = 2.0;
const RSI_PERIOD = 14;
const RSI_MODEL = ConstantModelType.SmoothedMovingAverage;
const ATR_PERIOD = 14;
const ATR_MODEL = ConstantModelType.ExponentialMovingAverage;
```

Perform bulk calculations (for the whole historical series):

```js
const smaBulk = movingAverage.bulk.movingAverage(
  history.close, MovingAverageType.Simple, SMA_PERIOD
);

const bandsBulk = candleIndicators.bulk.movingConstantBands(
  history.close, BANDS_MODEL, DEV_MODEL, DEV_MULT, BANDS_PERIOD
);
const mcbLowerBulk = bandsBulk.map(b => b[0]);
const mcbMidBulk   = bandsBulk.map(b => b[1]);
const mcbUpperBulk = bandsBulk.map(b => b[2]);

const rsiBulk = momentumIndicators.bulk.relativeStrengthIndex(
  history.close, RSI_MODEL, RSI_PERIOD
);

const atrBulk = otherIndicators.bulk.averageTrueRange(
  history.close, history.high, history.low, ATR_MODEL, ATR_PERIOD
);

// For x-axis alignment, right-align rolling outputs to their corresponding dates
const tail = (xs, n) => xs.slice(xs.length - n);
const xSMA   = tail(history.date, smaBulk.length);
const xBands = tail(history.date, bandsBulk.length);
const xRSI   = tail(history.date, rsiBulk.length);
const xATR   = tail(history.date, atrBulk.length);
```

---

## 3️⃣ Initialize the live Plotly dashboard

```js
const chartDiv = document.getElementById("chart");

const traces = [
  // Candles
  {
    type: "candlestick",
    x: history.date,
    open: history.open,
    high: history.high,
    low: history.low,
    close: history.close,
    name: "Price",
    xaxis: "x",
    yaxis: "y"
  },
  // SMA (bulk)
  {
    type: "scatter",
    mode: "lines",
    x: xSMA,
    y: smaBulk,
    name: `SMA ${SMA_PERIOD} (bulk)`,
    line: { color: "orange", width: 1.3 },
    xaxis: "x",
    yaxis: "y"
  },
  // Bands upper/lower/mid (bulk)
  {
    type: "scatter",
    mode: "lines",
    x: xBands,
    y: mcbUpperBulk,
    name: "MCB Upper (bulk)",
    line: { color: "royalblue", width: 1 },
    opacity: 0.7,
    xaxis: "x",
    yaxis: "y"
  },
  {
    type: "scatter",
    mode: "lines",
    x: xBands,
    y: mcbLowerBulk,
    name: "MCB Lower (bulk)",
    line: { color: "royalblue", width: 1 },
    fill: "tonexty",
    fillcolor: "rgba(65,105,225,0.15)",
    opacity: 0.7,
    xaxis: "x",
    yaxis: "y"
  },
  {
    type: "scatter",
    mode: "lines",
    x: xBands,
    y: mcbMidBulk,
    name: "MCB Mid (bulk)",
    line: { color: "royalblue", width: 0.8, dash: "dot" },
    opacity: 0.6,
    xaxis: "x",
    yaxis: "y"
  },
  // RSI panel
  {
    type: "scatter",
    mode: "lines",
    x: xRSI,
    y: rsiBulk,
    name: `RSI ${RSI_PERIOD} (bulk)`,
    line: { color: "purple" },
    xaxis: "x2",
    yaxis: "y2"
  },
  // ATR panel
  {
    type: "bar",
    x: xATR,
    y: atrBulk,
    name: `ATR ${ATR_PERIOD} (bulk)`,
    marker: { color: "gray" },
    opacity: 0.7,
    xaxis: "x3",
    yaxis: "y3"
  }
];

const layout = {
  title: "Hybrid REST + WebSocket Technical Dashboard",
  template: "plotly_white",
  hovermode: "x unified",
  grid: { rows: 3, columns: 1, pattern: "independent" },
  yaxis:  { domain: [0.45, 1.0], title: "Price" },
  yaxis2: { domain: [0.22, 0.42], title: "RSI", range: [0, 100] },
  yaxis3: { domain: [0.00, 0.20], title: "ATR" },
  xaxis_rangeslider_visible: false,
  shapes: [
    { type: "line", xref: "x2", yref: "y2", x0: xRSI[0], x1: xRSI[xRSI.length-1], y0: 70, y1: 70, line: { dash: "dash", color: "red" } },
    { type: "line", xref: "x2", yref: "y2", x0: xRSI[0], x1: xRSI[xRSI.length-1], y0: 30, y1: 30, line: { dash: "dash", color: "green" } }
  ]
};

const config = { responsive: true, displaylogo: false };

Plotly.newPlot(chartDiv, traces, layout, config);
```

---

## 4️⃣ Subscribe to live bars via WebSocket

On each closed bar, append to your arrays, run **single** indicator calculations, and update the dashboard.

```js
const WS_URL = `wss://stream.binance.com:9443/ws/${SYMBOL.toLowerCase()}@kline_${INTERVAL}`;

const MAX_BARS = 1000; // Cap buffer size

// Mutable arrays for appending live bars
const rolling = {
  date: history.date.slice(),
  open: history.open.slice(),
  high: history.high.slice(),
  low:  history.low.slice(),
  close:history.close.slice()
};

function pushBar(d, o, h, l, c) {
  rolling.date.push(d);
  rolling.open.push(o);
  rolling.high.push(h);
  rolling.low.push(l);
  rolling.close.push(c);

  // Cap buffer size
  Object.keys(rolling).forEach(k => {
    if (rolling[k].length > MAX_BARS) rolling[k].shift();
  });
}

function computeSingles() {
  const L = rolling.close.length;
  return {
    sma:    L >= SMA_PERIOD   ? movingAverage.single.movingAverage(rolling.close.slice(-SMA_PERIOD), MovingAverageType.Simple) : undefined,
    bands:  L >= BANDS_PERIOD ? candleIndicators.single.movingConstantBands(rolling.close.slice(-BANDS_PERIOD), BANDS_MODEL, DEV_MODEL, DEV_MULT) : undefined,
    rsi:    L >= RSI_PERIOD   ? momentumIndicators.single.relativeStrengthIndex(rolling.close.slice(-RSI_PERIOD), RSI_MODEL) : undefined,
    atr:    L >= ATR_PERIOD   ? otherIndicators.single.averageTrueRange(
              rolling.close.slice(-ATR_PERIOD),
              rolling.high.slice(-ATR_PERIOD),
              rolling.low.slice(-ATR_PERIOD),
              ATR_MODEL
            ) : undefined
  };
}

function updateChart(d, o, h, l, c, singles) {
  // Extend price and overlay traces
  Plotly.extendTraces(chartDiv,
    {
      x:    [[d], [d], [d], [d], [d], [d], [d]],
      open: [[o], null, null, null, null, null, null],
      high: [[h], null, null, null, null, null, null],
      low:  [[l], null, null, null, null, null, null],
      close:[[c], null, null, null, null, null, null],
      y:    [null, [singles.sma ?? null], [singles.bands?.[2] ?? null], [singles.bands?.[0] ?? null], [singles.bands?.[1] ?? null], [singles.rsi ?? null], [singles.atr ?? null]]
    },
    [0,1,2,3,4,5,6],
    MAX_BARS
  );
}

const logEl = document.getElementById("log");
const log = (...args) => {
  if (logEl) logEl.textContent = `${args.map(String).join(" ")}\n${logEl.textContent}`.slice(0, 20000);
};

function connectWebSocket() {
  const ws = new WebSocket(WS_URL);
  ws.onopen = () => log(`WebSocket connected: ${WS_URL}`);
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      const k = msg.k;
      if (k && k.x === true) {
        const d = new Date(k.T).toISOString();
        const o = +k.o, h = +k.h, l = +k.l, c = +k.c;

        pushBar(d, o, h, l, c);

        const singles = computeSingles();

        log(
          `[${d}]`, `Close=${c}`,
          singles.sma !== undefined ? `SMA=${singles.sma.toFixed(2)}` : "",
          singles.bands ? `MCB L=${singles.bands[0].toFixed(2)} M=${singles.bands[1].toFixed(2)} U=${singles.bands[2].toFixed(2)}` : "",
          singles.rsi !== undefined ? `RSI=${singles.rsi.toFixed(2)}` : "",
          singles.atr !== undefined ? `ATR=${singles.atr.toFixed(2)}` : ""
        );

        updateChart(d, o, h, l, c, singles);
      }
    } catch (e) {
      log("Parse error:", e);
    }
  };
  ws.onclose = () => {
    log("WebSocket closed, reconnecting in 5s...");
    setTimeout(connectWebSocket, 5000);
  };
  ws.onerror = (err) => {
    log("WebSocket error:", err);
    ws.close();
  };
}

connectWebSocket();
```

---

## 🧠 Interpretation

- **Bulk** calculations: run once on history, produce full-series overlays (SMA, Bands, RSI, ATR).
- **Single** calculations: run per new bar, produce latest overlays/indicators for real-time display.
- **Plotly** displays both historical and live overlays, updating traces as new bars stream in.

---

## 🛡️ Disclaimer

This is an educational example; for production, add robust error handling, rate limiting, and security.  
Always observe Binance’s API terms of use.

---

Happy charting and streaming! 📈🦀
