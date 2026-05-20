use crate::jsutil::{
    flat_to_array, js_err, pair_to_array, pairs_to_array, triple_to_array, triples_to_array,
};
use js_sys::Array;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsValue;

// -------- SINGLE --------
#[wasm_bindgen(js_name = momentum_single_relativeStrengthIndex)]
pub fn momentum_single_relative_strength_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::relative_strength_index(
        &prices,
        constant_model_type.into(),
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_stochasticOscillator)]
pub fn momentum_single_stochastic_oscillator(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::stochastic_oscillator(&prices)
        .map_err(js_err)
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_single_slowStochastic)]
pub fn momentum_single_slow_stochastic(
    stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::slow_stochastic(
        &stochastics,
        constant_model_type.into(),
    )
    .map_err(js_err)
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_single_slowestStochastic)]
pub fn momentum_single_slowest_stochastic(
    slow_stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::slowest_stochastic(
        &slow_stochastics,
        constant_model_type.into(),
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_williamsPercentR)]
pub fn momentum_single_williams_percent_r(
    high: Vec<f64>,
    low: Vec<f64>,
    close: f64,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::williams_percent_r(
        &high, &low, close,
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_moneyFlowIndex)]
pub fn momentum_single_money_flow_index(
    prices: Vec<f64>,
    volume: Vec<f64>,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::money_flow_index(&prices, &volume)
        .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_rateOfChange)]
pub fn momentum_single_rate_of_change(
    current_price: f64,
    previous_price: f64,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::rate_of_change(
        current_price,
        previous_price,
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_onBalanceVolume)]
pub fn momentum_single_on_balance_volume(
    current_price: f64,
    previous_price: f64,
    current_volume: f64,
    previous_on_balance_volume: f64,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::on_balance_volume(
        current_price,
        previous_price,
        current_volume,
        previous_on_balance_volume,
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_commodityChannelIndex)]
pub fn momentum_single_commodity_channel_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::commodity_channel_index(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        constant_multiplier,
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_mcginleyDynamicCommodityChannelIndex)]
pub fn momentum_single_mcginley_dynamic_commodity_channel_index(
    prices: Vec<f64>,
    previous_mcginley_dynamic: f64,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
) -> Result<Array, JsValue> {
    let pair =
        centaur_technical_indicators::momentum_indicators::single::mcginley_dynamic_commodity_channel_index(
            &prices,
            previous_mcginley_dynamic,
            deviation_model.into(),
            constant_multiplier,
        )
        .map_err(js_err)?;
    Ok(pair_to_array(pair))
}

#[wasm_bindgen(js_name = momentum_single_macdLine)]
pub fn momentum_single_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    short_period_model: crate::ConstantModelType,
    long_period_model: crate::ConstantModelType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::macd_line(
        &prices,
        short_period,
        short_period_model.into(),
        long_period_model.into(),
    )
    .map_err(js_err)
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_single_signalLine)]
pub fn momentum_single_signal_line(
    macds: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::signal_line(
        &macds,
        constant_model_type.into(),
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_mcginleyDynamicMacdLine)]
pub fn momentum_single_mcginley_dynamic_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    previous_short_mcginley: f64,
    previous_long_mcginley: f64,
) -> Result<Array, JsValue> {
    let triple = centaur_technical_indicators::momentum_indicators::single::mcginley_dynamic_macd_line(
        &prices,
        short_period,
        previous_short_mcginley,
        previous_long_mcginley,
    )
    .map_err(js_err)?;
    Ok(triple_to_array(triple))
}

#[wasm_bindgen(js_name = momentum_single_chaikinOscillator)]
pub fn momentum_single_chaikin_oscillator(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    volume: Vec<f64>,
    short_period: usize,
    previous_accumulation_distribution: f64,
    short_period_model: crate::ConstantModelType,
    long_period_model: crate::ConstantModelType,
) -> Result<Array, JsValue> {
    let pair = centaur_technical_indicators::momentum_indicators::single::chaikin_oscillator(
        &highs,
        &lows,
        &close,
        &volume,
        short_period,
        previous_accumulation_distribution,
        short_period_model.into(),
        long_period_model.into(),
    )
    .map_err(js_err)?;
    Ok(pair_to_array(pair))
}

#[wasm_bindgen(js_name = momentum_single_percentagePriceOscillator)]
pub fn momentum_single_percentage_price_oscillator(
    prices: Vec<f64>,
    short_period: usize,
    constant_model_type: crate::ConstantModelType,
) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::percentage_price_oscillator(
        &prices,
        short_period,
        constant_model_type.into(),
    )
    .map_err(js_err)
}

#[wasm_bindgen(js_name = momentum_single_chandeMomentumOscillator)]
pub fn momentum_single_chande_momentum_oscillator(prices: Vec<f64>) -> Result<f64, JsValue> {
    centaur_technical_indicators::momentum_indicators::single::chande_momentum_oscillator(&prices)
        .map_err(js_err)
}

// -------- BULK --------
#[wasm_bindgen(js_name = momentum_bulk_relativeStrengthIndex)]
pub fn momentum_bulk_relative_strength_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::relative_strength_index(
        &prices,
        constant_model_type.into(),
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_stochasticOscillator)]
pub fn momentum_bulk_stochastic_oscillator(
    prices: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::stochastic_oscillator(
        &prices, period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_bulk_slowStochastic)]
pub fn momentum_bulk_slow_stochastic(
    stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::slow_stochastic(
        &stochastics,
        constant_model_type.into(),
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_bulk_slowestStochastic)]
pub fn momentum_bulk_slowest_stochastic(
    slow_stochastics: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::slowest_stochastic(
        &slow_stochastics,
        constant_model_type.into(),
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_williamsPercentR)]
pub fn momentum_bulk_williams_percent_r(
    high: Vec<f64>,
    low: Vec<f64>,
    close: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::williams_percent_r(
        &high, &low, &close, period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_moneyFlowIndex)]
pub fn momentum_bulk_money_flow_index(
    prices: Vec<f64>,
    volume: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::money_flow_index(
        &prices, &volume, period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_rateOfChange)]
pub fn momentum_bulk_rate_of_change(prices: Vec<f64>) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::rate_of_change(&prices)
        .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_onBalanceVolume)]
pub fn momentum_bulk_on_balance_volume(
    prices: Vec<f64>,
    volume: Vec<f64>,
    previous_on_balance_volume: f64,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::on_balance_volume(
        &prices,
        &volume,
        previous_on_balance_volume,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_commodityChannelIndex)]
pub fn momentum_bulk_commodity_channel_index(
    prices: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::commodity_channel_index(
        &prices,
        constant_model_type.into(),
        deviation_model.into(),
        constant_multiplier,
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_mcginleyDynamicCommodityChannelIndex)]
pub fn momentum_bulk_mcginley_dynamic_commodity_channel_index(
    prices: Vec<f64>,
    previous_mcginley_dynamic: f64,
    deviation_model: crate::DeviationModel,
    constant_multiplier: f64,
    period: usize,
) -> Result<Array, JsValue> {
    let data =
        centaur_technical_indicators::momentum_indicators::bulk::mcginley_dynamic_commodity_channel_index(
            &prices,
            previous_mcginley_dynamic,
            deviation_model.into(),
            constant_multiplier,
            period,
        )
        .map_err(js_err)?;
    Ok(pairs_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_macdLine)]
pub fn momentum_bulk_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    short_period_model: crate::ConstantModelType,
    long_period: usize,
    long_period_model: crate::ConstantModelType,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::macd_line(
        &prices,
        short_period,
        short_period_model.into(),
        long_period,
        long_period_model.into(),
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[allow(deprecated)]
#[wasm_bindgen(js_name = momentum_bulk_signalLine)]
pub fn momentum_bulk_signal_line(
    macds: Vec<f64>,
    constant_model_type: crate::ConstantModelType,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::signal_line(
        &macds,
        constant_model_type.into(),
        period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_mcginleyDynamicMacdLine)]
pub fn momentum_bulk_mcginley_dynamic_macd_line(
    prices: Vec<f64>,
    short_period: usize,
    previous_short_mcginley: f64,
    long_period: usize,
    previous_long_mcginley: f64,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::mcginley_dynamic_macd_line(
        &prices,
        short_period,
        previous_short_mcginley,
        long_period,
        previous_long_mcginley,
    )
    .map_err(js_err)?;
    Ok(triples_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_chaikinOscillator)]
pub fn momentum_bulk_chaikin_oscillator(
    highs: Vec<f64>,
    lows: Vec<f64>,
    close: Vec<f64>,
    volume: Vec<f64>,
    short_period: usize,
    long_period: usize,
    previous_accumulation_distribution: f64,
    short_period_model: crate::ConstantModelType,
    long_period_model: crate::ConstantModelType,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::chaikin_oscillator(
        &highs,
        &lows,
        &close,
        &volume,
        short_period,
        long_period,
        previous_accumulation_distribution,
        short_period_model.into(),
        long_period_model.into(),
    )
    .map_err(js_err)?;
    Ok(pairs_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_percentagePriceOscillator)]
pub fn momentum_bulk_percentage_price_oscillator(
    prices: Vec<f64>,
    short_period: usize,
    long_period: usize,
    constant_model_type: crate::ConstantModelType,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::percentage_price_oscillator(
        &prices,
        short_period,
        long_period,
        constant_model_type.into(),
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}

#[wasm_bindgen(js_name = momentum_bulk_chandeMomentumOscillator)]
pub fn momentum_bulk_chande_momentum_oscillator(
    prices: Vec<f64>,
    period: usize,
) -> Result<Array, JsValue> {
    let data = centaur_technical_indicators::momentum_indicators::bulk::chande_momentum_oscillator(
        &prices, period,
    )
    .map_err(js_err)?;
    Ok(flat_to_array(data))
}
