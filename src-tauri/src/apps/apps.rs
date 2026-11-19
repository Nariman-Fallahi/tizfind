use crate::apps::icons::load_icon_data;
use crate::apps::pinned;
use freedesktop_desktop_entry::{Iter, PathSource, default_paths, get_languages_from_env};
use serde::Serialize;
use tauri::AppHandle;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo {
    name: String,
    exec: Option<String>,
    icon: Option<String>,
    icon_data: Option<String>,
    comment: Option<String>,
    path: String,
    source: String,
    pinned: bool,
    category: String,
}

fn primary_category(cats: &[&str]) -> &'static str {
    for c in cats {
        return match *c {
            "AudioVideo" | "Audio" | "Video" => "Multimedia",
            "Development" => "Development",
            "Education" => "Education",
            "Game" => "Games",
            "Graphics" => "Graphics",
            "Network" => "Internet",
            "Office" => "Office",
            "Science" => "Science",
            "Settings" => "Settings",
            "System" => "System",
            "Utility" => "Utilities",
            _ => continue,
        };
    }
    "Other"
}

#[tauri::command]
pub async fn list_apps(app: AppHandle) -> Vec<AppInfo> {
    let locales = get_languages_from_env();
    let pinned_list = pinned::load(&app);

    let mut apps: Vec<AppInfo> = Iter::new(default_paths())
        .entries(Some(&locales))
        .filter(|e| !e.no_display() && !e.hidden())
        .filter(|e| e.type_() == Some("Application"))
        .filter_map(|e| {
            let icon = e.icon().map(str::to_string);
            let icon_data = icon.as_deref().and_then(load_icon_data);
            let path = e.path.to_string_lossy().to_string();
            let category = e
                .categories()
                .map(|c| primary_category(&c))
                .unwrap_or("Other")
                .to_string();

            Some(AppInfo {
                name: e.name(&locales)?.to_string(),
                exec: e.exec().map(str::to_string),
                icon,
                icon_data,
                comment: e.comment(&locales).map(|c| c.to_string()),
                pinned: pinned_list.contains(&path),
                path: e.path.to_string_lossy().to_string(),
                source: format!("{:?}", PathSource::guess_from(&e.path)),
                category,
            })
        })
        .collect();

    apps.sort_by_cached_key(|a| (!a.pinned, a.name.to_lowercase()));
    apps.dedup_by(|a, b| a.path == b.path);
    apps
}
