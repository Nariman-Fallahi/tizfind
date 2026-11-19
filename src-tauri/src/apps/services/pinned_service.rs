use std::{fs, path::PathBuf};

use tauri::{AppHandle, Manager};

fn file_path(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;

    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;

    Ok(dir.join("pinned.json"))
}

pub fn load(app: &AppHandle) -> Vec<String> {
    file_path(app)
        .ok()
        .and_then(|path| fs::read_to_string(path).ok())
        .and_then(|content| serde_json::from_str(&content).ok())
        .unwrap_or_default()
}

fn save(app: &AppHandle, list: &[String]) -> Result<(), String> {
    let json = serde_json::to_string(list).map_err(|e| e.to_string())?;

    fs::write(file_path(app)?, json).map_err(|e| e.to_string())
}

pub fn toggle_pin(app: &AppHandle, path: String) -> Result<bool, String> {
    let mut list = load(app);

    let pinned = match list.iter().position(|p| p == &path) {
        Some(index) => {
            list.remove(index);
            false
        }

        None => {
            list.push(path);
            true
        }
    };

    save(app, &list)?;

    Ok(pinned)
}
