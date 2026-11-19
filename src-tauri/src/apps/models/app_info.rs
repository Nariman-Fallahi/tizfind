use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo {
    pub name: String,
    pub exec: Option<String>,
    pub icon: Option<String>,
    pub icon_data: Option<String>,
    pub comment: Option<String>,
    pub path: String,
    pub source: String,
    pub pinned: bool,
    pub category: String,
}
