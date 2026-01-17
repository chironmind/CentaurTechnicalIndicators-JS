use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

/// return_on_investment -> [final_value, percent_return]
#[wasm_bindgen(js_name = other_single_returnOnInvestment)]
pub fn other_single_return_on_investment(
    start_price: f64,
    end_price: f64,
    investment: f64,
) -> Array {
    let (final_value, percent_return) =
        centaur_technical_indicators::other_indicators::single::return_on_investment(start_price, end_price, investment);
    let arr = Array::new();
    arr.push(&JsValue::from_f64(final_value));
    arr.push(&JsValue::from_f64(percent_return));
    arr
}

/// true_range -> number
#[wasm_bindgen(js_name = other_single_trueRange)]
pub fn other_single_true_range(close: f64, high: f64, low: f64) -> f64 {
    centaur_technical_indicators::other_indicators::single::true_range(close, high, low)
}

/// average_true_range -> number
#[wasm_bindgen(js_name = other_single_averageTrueRange)]
pub fn other_single_average_true_range(
    close: Vec<f64>,
    high: Vec<f64>,
    low: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> f64 {
    centaur_technical_indicators::other_indicators::single::average_true_range(
        &close,
        &high,
        &low,
        constant_model_type.into(),
    )
}

/// internal_bar_strength -> number
#[wasm_bindgen(js_name = other_single_internalBarStrength)]
pub fn other_single_internal_bar_strength(high: f64, low: f64, close: f64) -> f64 {
    centaur_technical_indicators::other_indicators::single::internal_bar_strength(high, low, close)
}

// -------- BULK --------

/// return_on_investment -> Array<[final_value, percent_return]>
#[wasm_bindgen(js_name = other_bulk_returnOnInvestment)]
pub fn other_bulk_return_on_investment(prices: Vec<f64>, investment: f64) -> Array {
    let data = centaur_technical_indicators::other_indicators::bulk::return_on_investment(&prices, investment);
    let out = Array::new();
    for (final_value, percent_return) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(final_value));
        inner.push(&JsValue::from_f64(percent_return));
        out.push(&inner);
    }
    out
}

/// true_range -> Array<number>
#[wasm_bindgen(js_name = other_bulk_trueRange)]
pub fn other_bulk_true_range(close: Vec<f64>, high: Vec<f64>, low: Vec<f64>) -> Array {
    let data = centaur_technical_indicators::other_indicators::bulk::true_range(&close, &high, &low);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

/// average_true_range -> Array<number>
#[wasm_bindgen(js_name = other_bulk_averageTrueRange)]
pub fn other_bulk_average_true_range(
    close: Vec<f64>,
    high: Vec<f64>,
    low: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Array {
    let data = centaur_technical_indicators::other_indicators::bulk::average_true_range(
        &close,
        &high,
        &low,
        constant_model_type.into(),
        period,
    );
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

/// internal_bar_strength -> Array<number>
#[wasm_bindgen(js_name = other_bulk_internalBarStrength)]
pub fn other_bulk_internal_bar_strength(high: Vec<f64>, low: Vec<f64>, close: Vec<f64>) -> Array {
    let data = centaur_technical_indicators::other_indicators::bulk::internal_bar_strength(&high, &low, &close);
    let out = Array::new();
    for v in data {
        out.push(&JsValue::from_f64(v));
    }
    out
}

/// positivity_indicator -> Array<[pi, signal]>
#[wasm_bindgen(js_name = other_bulk_positivityIndicator)]
pub fn other_bulk_positivity_indicator(
    open: Vec<f64>,
    previous_close: Vec<f64>,
    signal_period: usize,
    constant_model_type: crate::ConstantModelType,
) -> Array {
    let data = centaur_technical_indicators::other_indicators::bulk::positivity_indicator(
        &open,
        &previous_close,
        signal_period,
        constant_model_type.into(),
    );
    let out = Array::new();
    for (pi, sig) in data {
        let inner = Array::new();
        inner.push(&JsValue::from_f64(pi));
        inner.push(&JsValue::from_f64(sig));
        out.push(&inner);
    }
    out
}
