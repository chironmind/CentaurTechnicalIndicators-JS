use crate::jsutil::{js_err, pair_to_array, pairs_to_array, quads_to_array};
use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// chart_trends has no single/bulk split; expose flat functions under a "chartTrends" JS namespace.

// peaks: Vec<(f64, usize)> -> Array<[value, index]>
#[wasm_bindgen(js_name = chart_trends_peaks)]
pub fn chart_trends_peaks(
    prices: Vec<f64>,
    period: usize,
    closest_neighbor: usize,
) -> Result<Array, JsValue> {
    let pairs =
        centaur_technical_indicators::chart_trends::peaks(&prices, period, closest_neighbor)
            .map_err(js_err)?;
    Ok(pairs_to_array(pairs.into_iter().map(|(v, i)| (v, i as f64))))
}

// valleys: Vec<(f64, usize)> -> Array<[value, index]>
#[wasm_bindgen(js_name = chart_trends_valleys)]
pub fn chart_trends_valleys(
    prices: Vec<f64>,
    period: usize,
    closest_neighbor: usize,
) -> Result<Array, JsValue> {
    let pairs =
        centaur_technical_indicators::chart_trends::valleys(&prices, period, closest_neighbor)
            .map_err(js_err)?;
    Ok(pairs_to_array(pairs.into_iter().map(|(v, i)| (v, i as f64))))
}

// peak_trend: (f64, f64) -> [slope, intercept]
#[wasm_bindgen(js_name = chart_trends_peakTrend)]
pub fn chart_trends_peak_trend(prices: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let pair = centaur_technical_indicators::chart_trends::peak_trend(&prices, period)
        .map_err(js_err)?;
    Ok(pair_to_array(pair))
}

// valley_trend: (f64, f64) -> [slope, intercept]
#[wasm_bindgen(js_name = chart_trends_valleyTrend)]
pub fn chart_trends_valley_trend(prices: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let pair = centaur_technical_indicators::chart_trends::valley_trend(&prices, period)
        .map_err(js_err)?;
    Ok(pair_to_array(pair))
}

// overall_trend: (f64, f64) -> [slope, intercept]
#[wasm_bindgen(js_name = chart_trends_overallTrend)]
pub fn chart_trends_overall_trend(prices: Vec<f64>) -> Result<Array, JsValue> {
    let pair =
        centaur_technical_indicators::chart_trends::overall_trend(&prices).map_err(js_err)?;
    Ok(pair_to_array(pair))
}

// break_down_trends: Vec<(usize, usize, f64, f64)> -> Array<[start, end, slope, intercept]>
#[allow(clippy::too_many_arguments)]
#[wasm_bindgen(js_name = chart_trends_breakDownTrends)]
pub fn chart_trends_break_down_trends(
    prices: Vec<f64>,
    max_outliers: usize,
    soft_adj_r_squared_minimum: f64,
    hard_adj_r_squared_minimum: f64,
    soft_rmse_multiplier: f64,
    hard_rmse_multiplier: f64,
    soft_durbin_watson_min: f64,
    soft_durbin_watson_max: f64,
    hard_durbin_watson_min: f64,
    hard_durbin_watson_max: f64,
) -> Result<Array, JsValue> {
    let config = centaur_technical_indicators::chart_trends::TrendBreakConfig {
        max_outliers,
        soft_adj_r_squared_minimum,
        hard_adj_r_squared_minimum,
        soft_rmse_multiplier,
        hard_rmse_multiplier,
        soft_durbin_watson_min,
        soft_durbin_watson_max,
        hard_durbin_watson_min,
        hard_durbin_watson_max,
    };

    let segments = centaur_technical_indicators::chart_trends::break_down_trends(&prices, config)
        .map_err(js_err)?;
    Ok(quads_to_array(segments.into_iter().map(
        |(start, end, slope, intercept)| (start as f64, end as f64, slope, intercept),
    )))
}
