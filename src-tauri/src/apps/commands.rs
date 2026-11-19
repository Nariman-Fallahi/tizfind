use tauri::AppHandle;

use crate::apps::services::{app_launcher, app_scanner, pinned_service};

use crate::apps::models::app_info::AppInfo;

#[tauri::command]
pub async fn list_apps(app: AppHandle) -> Vec<AppInfo> {
    app_scanner::scan_apps(&app)
}

#[tauri::command]
pub fn launch_app(exec: String) -> Result<(), String> {
    app_launcher::launch(exec)
}

#[tauri::command]
pub fn toggle_pin(app: AppHandle, path: String) -> Result<bool, String> {
    pinned_service::toggle_pin(&app, path)
}
