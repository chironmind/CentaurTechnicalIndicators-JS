use crate::jsutil::{
    flat_to_array, js_err, quintuple_to_array, quintuples_to_array, triple_to_array,
    triples_to_array,
};
use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// ------------- SINGLE -------------
#[wasm_bindgen(js_name = candle_single_movingConstantEnvelopes)]
pub fn candle_single_moving_constant_envelopes(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    difference: f64,
) -> Result<Array, JsValue> {
    let triple =
        centaur_technical_indicators::candle_indicators::single::moving_constant_envelopes(
            &prices,
            constant_model_type.into(),
            difference,
        )
        .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = candle_single_mcginleyDynamicEnvelopes)]
pub fn candle_single_mcginley_dynamic_envelopes(
    prices: Vec<f64>,
    difference: f64,
    previous_mcginley_dynamic: f64,
) -> Result<Array, JsValue> {
    let triple =
        centaur_technical_indicators::candle_indicators::single::mcginley_dynamic_envelopes(
            &prices,
            difference,
            previous_mcginley_dynamic,
        )
        .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = candle_single_movingConstantBands)]
pub fn candle_single_moving_constant_bands(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
) -> Result<Array, JsValue> {
    let triple = centaur_technical_indicators::candle_indicators::single::moving_constant_bands(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        deviation_multiplier,
    )
    .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = candle_single_mcginleyDynamicBands)]
pub fn candle_single_mcginley_dynamic_bands(
    prices: Vec<f64>,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
    previous_mcginley_dynamic: f64,
) -> Result<Array, JsValue> {
    let triple = centaur_technical_indicators::candle_indicators::single::mcginley_dynamic_bands(
        &prices,
        deviation_model.into(),
        deviation_multiplier,
        previous_mcginley_dynamic,
    )
    .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = candle_single_ichimokuCloud)]
pub fn candle_single_ichimoku_cloud(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    conversion_period: usize,
    base_period: usize,
    span_b_period: usize,
) -> Result<Array, JsValue> {
    let quintuple = centaur_technical_indicators::candle_indicators::single::ichimoku_cloud(
        &highs,
        &lows,
        &close,
        conversion_period,
        base_period,
        span_b_period,
    )
    .map_err(js_err)?;
    Ok(quintuple_to_array(quintuple))
}

#[wasm_bindgen(js_name = candle_single_donchianChannels)]
pub fn candle_single_donchian_channels(highs: Vec<f64>, lows: Vec<f64>) -> Result<Array, JsValue> {
    let triple = centaur_technical_indicators::candle_indicators::single::donchian_channels(
        &highs, &lows,
    )
    .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = candle_single_keltnerChannel)]
pub fn candle_single_keltner_channel(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    atr_constant_model_type: crate::ConstantModelType,
    multiplier: f64,
) -> Result<Array, JsValue> {
    let triple = centaur_technical_indicators::candle_indicators::single::keltner_channel(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        atr_constant_model_type.into(),
        multiplier,
    )
    .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = candle_single_supertrend)]
pub fn candle_single_supertrend(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    multiplier: f64,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::candle_indicators::single::supertrend(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        multiplier,
    )
    .map_err(js_err)
}

// ------------- BULK -------------
#[wasm_bindgen(js_name = candle_bulk_movingConstantEnvelopes)]
pub fn candle_bulk_moving_constant_envelopes(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    difference: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::moving_constant_envelopes(
        &prices,
        constant_model_type.into(),
        difference,
        period,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = candle_bulk_mcginleyDynamicEnvelopes)]
pub fn candle_bulk_mcginley_dynamic_envelopes(
    prices: Vec<f64>,
    difference: f64,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::mcginley_dynamic_envelopes(
        &prices,
        difference,
        previous_mcginley_dynamic,
        period,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = candle_bulk_movingConstantBands)]
pub fn candle_bulk_moving_constant_bands(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::moving_constant_bands(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        deviation_multiplier,
        period,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = candle_bulk_mcginleyDynamicBands)]
pub fn candle_bulk_mcginley_dynamic_bands(
    prices: Vec<f64>,
    deviation_model: crate::DeviationModel,
    deviation_multiplier: f64,
    previous_mcginley_dynamic: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::mcginley_dynamic_bands(
        &prices,
        deviation_model.into(),
        deviation_multiplier,
        previous_mcginley_dynamic,
        period,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = candle_bulk_ichimokuCloud)]
pub fn candle_bulk_ichimoku_cloud(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    conversion_period: usize,
    base_period: usize,
    span_b_period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::ichimoku_cloud(
        &highs,
        &lows,
        &close,
        conversion_period,
        base_period,
        span_b_period,
    )
    .map_err(js_err)?;
    Ok(quintuples_to_array(data))
}

#[wasm_bindgen(js_name = candle_bulk_donchianChannels)]
pub fn candle_bulk_donchian_channels(
    highs: Vec<f64>,
    lows: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::donchian_channels(
        &highs, &lows, period,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = candle_bulk_keltnerChannel)]
pub fn candle_bulk_keltner_channel(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    atr_constant_model_type: crate::ConstantModelType,
    multiplier: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::keltner_channel(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        atr_constant_model_type.into(),
        multiplier,
        period,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = candle_bulk_supertrend)]
pub fn candle_bulk_supertrend(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    multiplier: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::candle_indicators::bulk::supertrend(
        &highs,
        &lows,
        &close,
        constant_model_type.into(),
        multiplier,
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}
