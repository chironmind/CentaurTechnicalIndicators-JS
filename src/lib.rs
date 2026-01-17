use wasm_bindgen::prelude::*;

// Centralized JS-facing enums (no personalised variants)
#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum ConstantModelType {
    SimpleMovingAverage,
    SmoothedMovingAverage,
    ExponentialMovingAverage,
    SimpleMovingMedian,
    SimpleMovingMode,
}

impl From<ConstantModelType> for rust_ti::ConstantModelType {
    fn from(v: ConstantModelType) -> Self {
        match v {
            ConstantModelType::SimpleMovingAverage => {
                rust_ti::ConstantModelType::SimpleMovingAverage
            }
            ConstantModelType::SmoothedMovingAverage => {
                rust_ti::ConstantModelType::SmoothedMovingAverage
            }
            ConstantModelType::ExponentialMovingAverage => {
                rust_ti::ConstantModelType::ExponentialMovingAverage
            }
            ConstantModelType::SimpleMovingMedian => rust_ti::ConstantModelType::SimpleMovingMedian,
            ConstantModelType::SimpleMovingMode => rust_ti::ConstantModelType::SimpleMovingMode,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum DeviationModel {
    StandardDeviation,
    MeanAbsoluteDeviation,
    MedianAbsoluteDeviation,
    ModeAbsoluteDeviation,
    UlcerIndex,
    LogStandardDeviation,
    LaplaceStdEquivalent,
    CauchyIQRScale,
}

impl From<DeviationModel> for rust_ti::DeviationModel {
    fn from(v: DeviationModel) -> Self {
        match v {
            DeviationModel::StandardDeviation => rust_ti::DeviationModel::StandardDeviation,
            DeviationModel::MeanAbsoluteDeviation => rust_ti::DeviationModel::MeanAbsoluteDeviation,
            DeviationModel::MedianAbsoluteDeviation => {
                rust_ti::DeviationModel::MedianAbsoluteDeviation
            }
            DeviationModel::ModeAbsoluteDeviation => rust_ti::DeviationModel::ModeAbsoluteDeviation,
            DeviationModel::UlcerIndex => rust_ti::DeviationModel::UlcerIndex,
            DeviationModel::LogStandardDeviation => rust_ti::DeviationModel::LogStandardDeviation,
            DeviationModel::LaplaceStdEquivalent => rust_ti::DeviationModel::LaplaceStdEquivalent,
            DeviationModel::CauchyIQRScale => rust_ti::DeviationModel::CauchyIQRScale,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum MovingAverageType {
    Simple,
    Smoothed,
    Exponential,
}

// Conversion to the internal RustTI type
impl From<MovingAverageType> for rust_ti::MovingAverageType {
    fn from(value: MovingAverageType) -> Self {
        match value {
            MovingAverageType::Simple => rust_ti::MovingAverageType::Simple,
            MovingAverageType::Smoothed => rust_ti::MovingAverageType::Smoothed,
            MovingAverageType::Exponential => rust_ti::MovingAverageType::Exponential,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum Position {
    Long,
    Short,
}

impl From<Position> for rust_ti::Position {
    fn from(v: Position) -> Self {
        match v {
            Position::Long => rust_ti::Position::Long,
            Position::Short => rust_ti::Position::Short,
        }
    }
}

// Mirror RustTI structure
pub mod candle_indicators;
pub mod chart_trends;
pub mod correlation_indicators;
pub mod momentum_indicators;
pub mod moving_average;
pub mod other_indicators;
pub mod standard_indicators;
pub mod strength_indicators;
pub mod trend_indicators;
pub mod volatility_indicators;
