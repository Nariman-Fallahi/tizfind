use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct TemperatureStats {
    pub temperature: Option<f32>,
    pub cores: Vec<f32>,
}
