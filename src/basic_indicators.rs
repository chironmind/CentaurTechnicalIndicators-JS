use crate::jsutil::{flat_to_array, js_err, pairs_to_array};
use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// =========================================================================
// SINGLE
// =========================================================================

#[wasm_bindgen(js_name = basic_single_mean)]
pub fn basic_single_mean(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::mean(&prices).map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_median)]
pub fn basic_single_median(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::median(&prices).map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_mode)]
pub fn basic_single_mode(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::mode(&prices).map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_logDifference)]
pub fn basic_single_log_difference(price_t: f64, price_t_1: f64) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::log_difference(price_t, price_t_1)
        .map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_variance)]
pub fn basic_single_variance(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::variance(&prices).map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_standardDeviation)]
pub fn basic_single_standard_deviation(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::standard_deviation(&prices)
        .map_err(js_err)
}

/// Absolute deviation with a configurable center and aggregate.
/// `AbsDevConfig { center, aggregate }` from the Rust core is flattened to two
/// positional enum parameters, since `wasm_bindgen` cannot construct the struct
/// directly from JS. Mirrors the existing flattening pattern used in
/// `chart_trends_breakDownTrends`.
#[wasm_bindgen(js_name = basic_single_absoluteDeviation)]
pub fn basic_single_absolute_deviation(
    prices: Vec<f64>,
    center: crate::CentralPoint,
    aggregate: crate::DeviationAggregate,
) -> Result<f64, JsValue> {
    let config = centaur_technical_indicators::AbsDevConfig {
        center: center.into(),
        aggregate: aggregate.into(),
    };
    centaur_technical_indicators::basic_indicators::single::absolute_deviation(&prices, config)
        .map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_logStandardDeviation)]
pub fn basic_single_log_standard_deviation(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::log_standard_deviation(&prices)
        .map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_studentTAdjustedStd)]
pub fn basic_single_student_t_adjusted_std(
    prices: Vec<f64>,
    df: f64,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::student_t_adjusted_std(&prices, df)
        .map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_laplaceStdEquivalent)]
pub fn basic_single_laplace_std_equivalent(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::laplace_std_equivalent(&prices)
        .map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_cauchyIqrScale)]
pub fn basic_single_cauchy_iqr_scale(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::cauchy_iqr_scale(&prices)
        .map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_max)]
pub fn basic_single_max(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::max(&prices).map_err(js_err)
}

#[wasm_bindgen(js_name = basic_single_min)]
pub fn basic_single_min(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::min(&prices).map_err(js_err)
}

/// `price_distribution` returns `Vec<(f64, usize)>` upstream — each entry is
/// `(bucket_center, count)`. Convert to `Array<[number, number]>` with the
/// `usize` cast to `f64`.
#[wasm_bindgen(js_name = basic_single_priceDistribution)]
pub fn basic_single_price_distribution(
    prices: Vec<f64>,
    precision: f64,
) -> Result<Array, JsValue> {
    let dist = centaur_technical_indicators::basic_indicators::single::price_distribution(
        &prices, precision,
    )
    .map_err(js_err)?;
    Ok(pairs_to_array(
        dist.into_iter().map(|(v, c)| (v, c as f64)),
    ))
}

#[wasm_bindgen(js_name = basic_single_empiricalQuantileRangeFromDistribution)]
pub fn basic_single_empirical_quantile_range_from_distribution(
    prices: Vec<f64>,
    precision: f64,
    low: f64,
    high: f64,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::basic_indicators::single::empirical_quantile_range_from_distribution(
        &prices, precision, low, high,
    )
    .map_err(js_err)
}

// =========================================================================
// BULK
// =========================================================================

#[wasm_bindgen(js_name = basic_bulk_mean)]
pub fn basic_bulk_mean(prices: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::mean(&prices, period)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_median)]
pub fn basic_bulk_median(prices: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::median(&prices, period)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_mode)]
pub fn basic_bulk_mode(prices: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::mode(&prices, period)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_log)]
pub fn basic_bulk_log(prices: Vec<f64>) -> Result<Array, JsValue> {
    let data =
        centaur_technical_indicators::basic_indicators::bulk::log(&prices).map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_logDifference)]
pub fn basic_bulk_log_difference(prices: Vec<f64>) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::log_difference(&prices)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_variance)]
pub fn basic_bulk_variance(prices: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::variance(&prices, period)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_standardDeviation)]
pub fn basic_bulk_standard_deviation(
    prices: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data =
        centaur_technical_indicators::basic_indicators::bulk::standard_deviation(&prices, period)
            .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_absoluteDeviation)]
pub fn basic_bulk_absolute_deviation(
    prices: Vec<f64>,
    period: usize,
    center: crate::CentralPoint,
    aggregate: crate::DeviationAggregate,
) -> Result<Array, JsValue> {
    let config = centaur_technical_indicators::AbsDevConfig {
        center: center.into(),
        aggregate: aggregate.into(),
    };
    let data = centaur_technical_indicators::basic_indicators::bulk::absolute_deviation(
        &prices, period, config,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

/// `bulk::price_distribution` returns `Vec<Vec<(f64, usize)>>` — one nested
/// distribution per window. Convert to `Array<Array<[number, number]>>`.
#[wasm_bindgen(js_name = basic_bulk_priceDistribution)]
pub fn basic_bulk_price_distribution(
    prices: Vec<f64>,
    period: usize,
    precision: f64,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::price_distribution(
        &prices, period, precision,
    )
    .map_err(js_err)?;
    let outer = Array::new();
    for inner_dist in data {
        outer.push(&pairs_to_array(
            inner_dist.into_iter().map(|(v, c)| (v, c as f64)),
        ));
    }
    Ok(outer)
}

#[wasm_bindgen(js_name = basic_bulk_logStandardDeviation)]
pub fn basic_bulk_log_standard_deviation(
    prices: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::log_standard_deviation(
        &prices, period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_studentTAdjustedStd)]
pub fn basic_bulk_student_t_adjusted_std(
    prices: Vec<f64>,
    period: usize,
    df: f64,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::student_t_adjusted_std(
        &prices, period, df,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_laplaceStdEquivalent)]
pub fn basic_bulk_laplace_std_equivalent(
    prices: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::laplace_std_equivalent(
        &prices, period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_cauchyIqrScale)]
pub fn basic_bulk_cauchy_iqr_scale(
    prices: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data =
        centaur_technical_indicators::basic_indicators::bulk::cauchy_iqr_scale(&prices, period)
            .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = basic_bulk_empiricalQuantileRangeFromDistribution)]
pub fn basic_bulk_empirical_quantile_range_from_distribution(
    prices: Vec<f64>,
    period: usize,
    precision: f64,
    low: f64,
    high: f64,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::basic_indicators::bulk::empirical_quantile_range_from_distribution(
        &prices, period, precision, low, high,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}
