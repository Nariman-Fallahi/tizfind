use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiskStats {
    pub used_bytes: u64,
    pub total_bytes: u64,
    pub usage: f32,
}
