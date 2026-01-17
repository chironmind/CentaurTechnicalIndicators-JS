use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = ma_single_movingAverage)]
pub fn ma_single_moving_average(prices: Vec<f64>, ma_type: crate::MovingAverageType) -> f64 {
    centaur_technical_indicators::moving_average::single::moving_average(&prices, ma_type.into())
}

#[wasm_bindgen(js_name = ma_single_mcginleyDynamic)]
pub fn ma_single_mcginley_dynamic(
    latest_price: f64,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> f64 {
    centaur_technical_indicators::moving_average::single::mcginley_dynamic(
        latest_price,
        previous_mcginley_dynamic,
        period,
    )
}

// -------- BULK --------

#[wasm_bindgen(js_name = ma_bulk_movingAverage)]
pub fn ma_bulk_moving_average(
    prices: Vec<f64>,
    ma_type: crate::MovingAverageType,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::moving_average::bulk::moving_average(&prices, ma_type.into(), period);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

#[wasm_bindgen(js_name = ma_bulk_mcginleyDynamic)]
pub fn ma_bulk_mcginley_dynamic(
    prices: Vec<f64>,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> Array {
    let data =
        centaur_technical_indicators::moving_average::bulk::mcginley_dynamic(&prices, previous_mcginley_dynamic, period);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}
