use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CpuStats {
    pub name: String,
    pub usage: f32,
    pub logical_cores: usize,
}
