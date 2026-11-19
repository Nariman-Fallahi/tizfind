use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SwapStats {
    pub used_bytes: u64,
    pub total_bytes: u64,
    pub usage: f32,
    pub swap_in: u64,
    pub swap_out: u64,
}
