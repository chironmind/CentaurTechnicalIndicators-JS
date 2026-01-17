# Tutorial 2: Visualizing Indicators with Plotly 

Build on Tutorial 1 by adding rich, interactive technical charts in the browser.  

This tutorial is the second in the series:
- [01 - Getting started with CentaurTechnicalIndicators-JS](getting-started.md)
- 02 - Visualizing Indicators with Plotly (this page)
- [03 - More advanced use cases](advanced.md)
- [04 - Getting data from an API](api.md)
- [05 - Real-time updates with WebSockets (single vs bulk)](websockets.md)

---

## 🎯 Goal

Add interactive Plotly charts on top of indicators computed with CentaurTechnicalIndicators-JS:

- Candlestick chart from inline OHLC data
- Overlay Simple Moving Average (SMA)
- Overlay Moving Constant Bands (EMA + StdDev)
- Add RSI in its own panel (with threshold lines)
- Add ATR in a third panel
- Optional: interactive toggling of indicators and static export

---

## 📦 Prerequisites

- A modern browser and a bundler (Vite, Webpack, etc.) for ESM modules
- CentaurTechnicalIndicators-JS and Plotly.js

Install dependencies:
```bash
npm install centaur-technical-indicators-js plotly.js-dist-min
```

If you prefer a CDN for Plotly, you can include it via a script tag instead of installing.

---

## 📁 Project scaffold

Minimal HTML (place in public/index.html or similar). If using the Plotly CDN, include the script tag; if using the npm package, you can import it in JS instead.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Technical Indicators Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Option A: Use Plotly via CDN (global Plotly variable) -->
    <script src="https://cdn.plot.ly/plotly-2.30.0.min.js"></script>
  </head>
  <body>
    <div id="chart" style="width: 100%; max-width: 1200px; margin: 0 auto;"></div>
    <script type="module" src="/plotly-dashboard.mjs"></script>
  </body>
</html>
```

---

## 🧱 Data and helpers 

We’ll use a constant array for Close prices and derive simple Open/High/Low for the demo.  
In practice, use real OHLC.

```js
// plotly-dashboard.mjs
import init, {
  movingAverage,
  momentumIndicators,
  candleIndicators,
  otherIndicators,
  ConstantModelType,
  DeviationModel,
  MovingAverageType
} from "centaur-technical-indicators-js";

// If you installed Plotly via npm instead of CDN:
// import Plotly from "plotly.js-dist-min";

await init();

// Close prices (inline)
const close = [
  6037.59, 5970.84, 5906.94, 5881.63, 5868.55, 5942.47, 5975.38, 5909.03,
  5918.25, 5827.04, 5836.22, 5842.91, 5949.91, 5937.34, 5996.66, 6049.24,
  6086.37, 6118.71, 6101.24, 6012.28, 6067.70, 6039.31, 6071.17, 6040.53,
  5994.57, 6037.88, 6061.48, 6083.57, 6025.99, 6066.44, 6068.50, 6051.97,
  6115.07, 6114.63, 6129.58, 6144.15, 6117.52, 6013.13, 5983.25, 5955.25,
  5956.06, 5861.57, 5954.50, 5849.72, 5778.15, 5842.63, 5738.52, 5770.20,
  5614.56, 5572.07, 5599.30, 5521.52, 5638.94
];

// Derive simple Open/High/Low for demo purposes
const open = close.map((c, i) => (i === 0 ? c : close[i - 1]));
const high = close.map((c, i) => Math.max(c, open[i]) + 20);
const low  = close.map((c, i) => Math.min(c, open[i]) - 20);

// Simple daily dates (YYYY-MM-DD); adjust start as you like
const start = new Date(2025, 0, 1);
const dates = Array.from({ length: close.length }, (_, i) => {
  const d = new Date(start);
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 10);
});

// Helper to align a rolling series to the right edge of dates
const alignTail = (x, y) => ({
  x: x.slice(x.length - y.length),
  y
});
```

---

## ✅ Compute indicators

- SMA(20) via movingAverage.bulk.movingAverage
- Moving Constant Bands (EMA + StdDev, x2, period 20)
- RSI(20) via momentumIndicators.bulk.relativeStrengthIndex
- ATR(20) via otherIndicators.bulk.averageTrueRange

```js
// Parameters
const period = 20;

// SMA
const sma20 = movingAverage.bulk.movingAverage(
  close,
  MovingAverageType.Simple,
  period
);

// Moving Constant Bands (EMA + StdDev)
const bands = candleIndicators.bulk.movingConstantBands(
  close,
  ConstantModelType.ExponentialMovingAverage,
  DeviationModel.StandardDeviation,
  2.0,
  period
);
const lowerBand = bands.map(t => t[0]);
const midBand   = bands.map(t => t[1]);
const upperBand = bands.map(t => t[2]);

// RSI
const rsi20 = momentumIndicators.bulk.relativeStrengthIndex(
  close,
  ConstantModelType.SmoothedMovingAverage,
  period
);

// ATR
const atr20 = otherIndicators.bulk.averageTrueRange(
  close, // previous closes
  high,
  low,
  ConstantModelType.ExponentialMovingAverage,
  period
);

// Aligned x for rolling outputs (right-aligned)
const xSMA  = alignTail(dates, sma20).x;
const xBands = alignTail(dates, lowerBand).x;
const xRSI  = alignTail(dates, rsi20).x;
const xATR  = alignTail(dates, atr20).x;
```

---

## 📊 Build a multi-row Plotly figure

Layout plan:
- Row 1: Candlestick + SMA + Bands (shaded between lower/upper)
- Row 2: RSI + threshold lines (70 / 30)
- Row 3: ATR (bar)

In Plotly.js, we’ll create a grid of 3 rows and assign traces to x/y axes x, x2, x3 and y, y2, y3.

```js
const traces = [
  // Row 1: Candlestick
  {
    type: "candlestick",
    x: dates,
    open,
    high,
    low,
    close,
    name: "Price",
    increasing: { line: { color: "#26a69a" } },
    decreasing: { line: { color: "#ef5350" } },
    xaxis: "x",
    yaxis: "y"
  },

  // Row 1: SMA(20)
  {
    type: "scatter",
    mode: "lines",
    x: xSMA,
    y: sma20,
    name: "SMA 20",
    line: { color: "orange", width: 1.3 },
    hovertemplate: "SMA %{y:.2f}<extra></extra>",
    xaxis: "x",
    yaxis: "y"
  },

  // Row 1: Bands Upper then Lower (Lower fills to next y)
  {
    type: "scatter",
    mode: "lines",
    x: xBands,
    y: upperBand,
    name: "MCB Upper",
    line: { color: "royalblue", width: 1 },
    opacity: 0.7,
    hovertemplate: "Upper %{y:.2f}<extra></extra>",
    xaxis: "x",
    yaxis: "y"
  },
  {
    type: "scatter",
    mode: "lines",
    x: xBands,
    y: lowerBand,
    name: "MCB Lower",
    line: { color: "royalblue", width: 1 },
    fill: "tonexty",
    fillcolor: "rgba(65,105,225,0.15)",
    opacity: 0.7,
    hovertemplate: "Lower %{y:.2f}<extra></extra>",
    xaxis: "x",
    yaxis: "y"
  },
  // Row 1: Bands mid (EMA)
  {
    type: "scatter",
    mode: "lines",
    x: xBands,
    y: midBand,
    name: "MCB Mid (EMA)",
    line: { color: "royalblue", width: 0.8, dash: "dot" },
    opacity: 0.6,
    hovertemplate: "Mid %{y:.2f}<extra></extra>",
    xaxis: "x",
    yaxis: "y"
  },

  // Row 2: RSI(20)
  {
    type: "scatter",
    mode: "lines",
    x: xRSI,
    y: rsi20,
    name: "RSI (20)",
    line: { color: "purple" },
    hovertemplate: "RSI %{y:.2f}<extra></extra>",
    xaxis: "x2",
    yaxis: "y2"
  },

  // Row 3: ATR(20)
  {
    type: "bar",
    x: xATR,
    y: atr20,
    name: "ATR 20",
    marker: { color: "gray" },
    opacity: 0.7,
    hovertemplate: "ATR %{y:.2f}<extra></extra>",
    xaxis: "x3",
    yaxis: "y3"
  }
];

const layout = {
  title: "Technical Indicators Dashboard",
  template: "plotly_white",
  hovermode: "x unified",
  margin: { l: 40, r: 40, t: 60, b: 40 },
  legend: { orientation: "h", yanchor: "bottom", y: 1.02, xanchor: "right", x: 1 },

  // 3-row grid of independent subplots
  grid: { rows: 3, columns: 1, pattern: "independent", roworder: "top to bottom" },

  // Row heights via domain
  yaxis:  { domain: [0.45, 1.0], title: "Price" },
  yaxis2: { domain: [0.22, 0.42], title: "RSI", range: [0, 100] },
  yaxis3: { domain: [0.0,  0.20], title: "ATR" },

  xaxis:  { showspikes: true, spikemode: "across" },
  xaxis2: { showspikes: true, spikemode: "across" },
  xaxis3: { showspikes: true, spikemode: "across" },

  // RSI horizontal threshold lines (yref ties to y2)
  shapes: [
    {
      type: "line",
      xref: "x2",
      yref: "y2",
      x0: xRSI[0],
      x1: xRSI[xRSI.length - 1],
      y0: 70, y1: 70,
      line: { dash: "dash", color: "red" }
    },
    {
      type: "line",
      xref: "x2",
      yref: "y2",
      x0: xRSI[0],
      x1: xRSI[xRSI.length - 1],
      y0: 30, y1: 30,
      line: { dash: "dash", color: "green" }
    }
  ],

  xaxis_rangeslider_visible: false
};

const config = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: ["select2d", "lasso2d"]
};

Plotly.newPlot("chart", traces, layout, config);
```

---

## 🧪 Handling missing indicator rows

Rolling indicators start later; we aligned to the right using x slices:
- For a rolling series Y of length M over dates of length L, we use dates.slice(L - M) as the x-values.
- Alternatively, you can pad the left of Y with nulls to match L and plot against full dates.

---

## 🎨 Styling tips

- Dark theme: set layout.template = "plotly_dark"
- Band opacity tweak: lower-trace fillcolor "rgba(65,105,225,0.08)"
- Add more MAs (e.g., SMA 50/200) as additional scatter lines
- Use hovermode "x unified" for synchronized tooltips across rows

---

## 🧾 Common pitfalls

| Issue | Cause | Fix |
|------|-------|-----|
| Bands misaligned | Wrong x alignment | Use dates.slice(dates.length - bands.length) |
| RSI flatlining | Period too long or low volatility | Try a shorter period; verify inputs |
| ATR bars obscure price | Added to row 1 by mistake | Ensure xaxis/xaxisN and yaxis/yaxisN are correct |
| Init errors in browser | Missing await init() | Always await init() before calling indicators |

---

## ✅ Next step

[Advanced use cases to CentaurTechnicalIndicators-JS](advanced.md)

Happy charting! 📈🦀
