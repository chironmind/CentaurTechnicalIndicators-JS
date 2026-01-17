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

impl From<ConstantModelType> for centaur_technical_indicators::ConstantModelType {
    fn from(v: ConstantModelType) -> Self {
        match v {
            ConstantModelType::SimpleMovingAverage => {
                centaur_technical_indicators::ConstantModelType::SimpleMovingAverage
            }
            ConstantModelType::SmoothedMovingAverage => {
                centaur_technical_indicators::ConstantModelType::SmoothedMovingAverage
            }
            ConstantModelType::ExponentialMovingAverage => {
                centaur_technical_indicators::ConstantModelType::ExponentialMovingAverage
            }
            ConstantModelType::SimpleMovingMedian => centaur_technical_indicators::ConstantModelType::SimpleMovingMedian,
            ConstantModelType::SimpleMovingMode => centaur_technical_indicators::ConstantModelType::SimpleMovingMode,
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

impl From<DeviationModel> for centaur_technical_indicators::DeviationModel {
    fn from(v: DeviationModel) -> Self {
        match v {
            DeviationModel::StandardDeviation => centaur_technical_indicators::DeviationModel::StandardDeviation,
            DeviationModel::MeanAbsoluteDeviation => centaur_technical_indicators::DeviationModel::MeanAbsoluteDeviation,
            DeviationModel::MedianAbsoluteDeviation => {
                centaur_technical_indicators::DeviationModel::MedianAbsoluteDeviation
            }
            DeviationModel::ModeAbsoluteDeviation => centaur_technical_indicators::DeviationModel::ModeAbsoluteDeviation,
            DeviationModel::UlcerIndex => centaur_technical_indicators::DeviationModel::UlcerIndex,
            DeviationModel::LogStandardDeviation => centaur_technical_indicators::DeviationModel::LogStandardDeviation,
            DeviationModel::LaplaceStdEquivalent => centaur_technical_indicators::DeviationModel::LaplaceStdEquivalent,
            DeviationModel::CauchyIQRScale => centaur_technical_indicators::DeviationModel::CauchyIQRScale,
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

// Conversion to the internal Centaur Technical Indicators type
impl From<MovingAverageType> for centaur_technical_indicators::MovingAverageType {
    fn from(value: MovingAverageType) -> Self {
        match value {
            MovingAverageType::Simple => centaur_technical_indicators::MovingAverageType::Simple,
            MovingAverageType::Smoothed => centaur_technical_indicators::MovingAverageType::Smoothed,
            MovingAverageType::Exponential => centaur_technical_indicators::MovingAverageType::Exponential,
        }
    }
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug)]
pub enum Position {
    Long,
    Short,
}

impl From<Position> for centaur_technical_indicators::Position {
    fn from(v: Position) -> Self {
        match v {
            Position::Long => centaur_technical_indicators::Position::Long,
            Position::Short => centaur_technical_indicators::Position::Short,
        }
    }
}

// Mirror Centaur Technical Indicators structure
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
