mod apps;
mod system_monitor;
mod theme;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(
            system_monitor::state::SystemMonitorState::new()
                .expect("Failed to initialize system monitor"),
        )
        .setup(|app| {
            theme::watch(app.handle().clone());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            apps::commands::list_apps,
            apps::commands::launch_app,
            apps::commands::toggle_pin,
            theme::system_theme,
            system_monitor::commands::get_system_overview,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
