use crate::jsutil::{flat_to_array, js_err, quads_to_array, triple_to_array, triples_to_array};
use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------

#[wasm_bindgen(js_name = trend_single_aroonUp)]
pub fn trend_single_aroon_up(highs: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::trend_indicators::single::aroon_up(&highs).map_err(js_err)
}

#[wasm_bindgen(js_name = trend_single_aroonDown)]
pub fn trend_single_aroon_down(lows: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::trend_indicators::single::aroon_down(&lows).map_err(js_err)
}

#[wasm_bindgen(js_name = trend_single_aroonOscillator)]
pub fn trend_single_aroon_oscillator(aroon_up: f64, aroon_down: f64) -> f64 {
    centaur_technical_indicators::trend_indicators::single::aroon_oscillator(aroon_up, aroon_down)
}

#[wasm_bindgen(js_name = trend_single_aroonIndicator)]
pub fn trend_single_aroon_indicator(highs: Vec<f64>, lows: Vec<f64>) -> Result<Array, JsValue> {
    let triple =
        centaur_technical_indicators::trend_indicators::single::aroon_indicator(&highs, &lows)
            .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = trend_single_longParabolicTimePriceSystem)]
pub fn trend_single_long_parabolic_time_price_system(
    previous_sar: f64,
    extreme_point: f64,
    acceleration_factor: f64,
    low: f64,
) -> f64 {
    centaur_technical_indicators::trend_indicators::single::long_parabolic_time_price_system(
        previous_sar,
        extreme_point,
        acceleration_factor,
        low,
    )
}

#[wasm_bindgen(js_name = trend_single_shortParabolicTimePriceSystem)]
pub fn trend_single_short_parabolic_time_price_system(
    previous_sar: f64,
    extreme_point: f64,
    acceleration_factor: f64,
    high: f64,
) -> f64 {
    centaur_technical_indicators::trend_indicators::single::short_parabolic_time_price_system(
        previous_sar,
        extreme_point,
        acceleration_factor,
        high,
    )
}

#[wasm_bindgen(js_name = trend_single_volumePriceTrend)]
pub fn trend_single_volume_price_trend(
    current_price: f64,
    previous_price: f64,
    volume: f64,
    previous_volume_price_trend: f64,
) -> f64 {
    centaur_technical_indicators::trend_indicators::single::volume_price_trend(
        current_price,
        previous_price,
        volume,
        previous_volume_price_trend,
    )
}

#[wasm_bindgen(js_name = trend_single_trueStrengthIndex)]
pub fn trend_single_true_strength_index(
    prices: Vec<f64>,
    first_constant_model: crate::ConstantModelType,
    first_period: usize,
    second_constant_model: crate::ConstantModelType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::trend_indicators::single::true_strength_index(
        &prices,
        first_constant_model.into(),
        first_period,
        second_constant_model.into(),
    )
    .map_err(js_err)
}

// -------- BULK --------

#[wasm_bindgen(js_name = trend_bulk_aroonUp)]
pub fn trend_bulk_aroon_up(highs: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::trend_indicators::bulk::aroon_up(&highs, period)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = trend_bulk_aroonDown)]
pub fn trend_bulk_aroon_down(lows: Vec<f64>, period: usize) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::trend_indicators::bulk::aroon_down(&lows, period)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = trend_bulk_aroonOscillator)]
pub fn trend_bulk_aroon_oscillator(
    aroon_up: Vec<f64>,
    aroon_down: Vec<f64>,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::trend_indicators::bulk::aroon_oscillator(
        &aroon_up, &aroon_down,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = trend_bulk_aroonIndicator)]
pub fn trend_bulk_aroon_indicator(
    highs: Vec<f64>,
    lows: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::trend_indicators::bulk::aroon_indicator(
        &highs, &lows, period,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = trend_bulk_parabolicTimePriceSystem)]
pub fn trend_bulk_parabolic_time_price_system(
    highs: Vec<f64>,
    lows: Vec<f64>,
    acceleration_factor_start: f64,
    acceleration_factor_max: f64,
    acceleration_factor_step: f64,
    start_position: crate::Position,
    previous_sar: f64,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::trend_indicators::bulk::parabolic_time_price_system(
        &highs,
        &lows,
        acceleration_factor_start,
        acceleration_factor_max,
        acceleration_factor_step,
        start_position.into(),
        previous_sar,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = trend_bulk_directionalMovementSystem)]
pub fn trend_bulk_directional_movement_system(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    period: usize,
    constant_model_type: crate::ConstantModelType,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::trend_indicators::bulk::directional_movement_system(
        &highs,
        &lows,
        &close,
        period,
        constant_model_type.into(),
    )
    .map_err(js_err)?;
    Ok(quads_to_array(data))
}

#[wasm_bindgen(js_name = trend_bulk_volumePriceTrend)]
pub fn trend_bulk_volume_price_trend(
    prices: Vec<f64>,
    volumes: Vec<f64>,
    previous_volume_price_trend: f64,
) -> Result<Array, JsValue> {
    // Handle both same-length arrays (skip first volume) and L-1 length arrays (backward compat)
    let volumes_slice = if volumes.len() == prices.len() {
        &volumes[1..]
    } else {
        &volumes
    };

    let data = centaur_technical_indicators::trend_indicators::bulk::volume_price_trend(
        &prices,
        volumes_slice,
        previous_volume_price_trend,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = trend_bulk_trueStrengthIndex)]
pub fn trend_bulk_true_strength_index(
    prices: Vec<f64>,
    first_constant_model: crate::ConstantModelType,
    first_period: usize,
    second_constant_model: crate::ConstantModelType,
    second_period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::trend_indicators::bulk::true_strength_index(
        &prices,
        first_constant_model.into(),
        first_period,
        second_constant_model.into(),
        second_period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}
