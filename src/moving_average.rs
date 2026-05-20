use crate::jsutil::{flat_to_array, js_err};
use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = ma_single_movingAverage)]
pub fn ma_single_moving_average(
    prices: Vec<f64>,
    ma_type: crate::MovingAverageType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::moving_average::single::moving_average(&prices, ma_type.into())
        .map_err(js_err)
}

#[wasm_bindgen(js_name = ma_single_mcginleyDynamic)]
pub fn ma_single_mcginley_dynamic(
    latest_price: f64,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::moving_average::single::mcginley_dynamic(
        latest_price,
        previous_mcginley_dynamic,
        period,
    )
    .map_err(js_err)
}

// -------- BULK --------

#[wasm_bindgen(js_name = ma_bulk_movingAverage)]
pub fn ma_bulk_moving_average(
    prices: Vec<f64>,
    ma_type: crate::MovingAverageType,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::moving_average::bulk::moving_average(
        &prices,
        ma_type.into(),
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = ma_bulk_mcginleyDynamic)]
pub fn ma_bulk_mcginley_dynamic(
    prices: Vec<f64>,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::moving_average::bulk::mcginley_dynamic(
        &prices,
        previous_mcginley_dynamic,
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}
