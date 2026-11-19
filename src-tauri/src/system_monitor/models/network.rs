use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworkStats {
    pub download_speed: f64,
    pub upload_speed: f64,
    pub total_download: u64,
    pub total_upload: u64,
}
