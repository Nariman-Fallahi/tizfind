use dark_light::Mode;
use tauri::{AppHandle, Emitter};

fn mode_str(m: Mode) -> &'static str {
    match m {
        Mode::Dark => "dark",
        Mode::Light => "light",
        Mode::Unspecified => "unspecified",
    }
}

#[tauri::command]
pub async fn system_theme() -> String {
    dark_light::detect()
        .map(mode_str)
        .unwrap_or("unspecified")
        .to_string()
}

pub fn watch(app: AppHandle) {
    std::thread::spawn(move || {
        let Ok(watcher) = dark_light::subscribe() else {
            return;
        };
        for mode in watcher.iter() {
            let _ = app.emit("system-theme-changed", mode_str(mode));
        }
    });
}
