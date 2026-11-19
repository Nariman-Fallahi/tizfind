use crate::apps::{
    models::app_info::AppInfo,
    services::{icon_service, pinned_service},
};

use freedesktop_desktop_entry::{Iter, PathSource, default_paths, get_languages_from_env};

use tauri::AppHandle;

fn primary_category(cats: Vec<&str>) -> &'static str {
    for category in cats {
        match category {
            "AudioVideo" | "Audio" | "Video" => return "Multimedia",
            "Development" => return "Development",
            "Education" => return "Education",
            "Game" => return "Games",
            "Graphics" => return "Graphics",
            "Network" => return "Internet",
            "Office" => return "Office",
            "Science" => return "Science",
            "Settings" => return "Settings",
            "System" => return "System",
            "Utility" => return "Utilities",
            _ => continue,
        }
    }

    "Other"
}

pub fn scan_apps(app: &AppHandle) -> Vec<AppInfo> {
    let locales = get_languages_from_env();
    let pinned_list = pinned_service::load(app);

    let mut apps: Vec<AppInfo> = Iter::new(default_paths())
        .entries(Some(&locales))
        .filter(|e| !e.no_display() && !e.hidden())
        .filter(|e| e.type_() == Some("Application"))
        .filter_map(|e| {
            let name = e.name(&locales)?.to_string();

            let icon = e.icon().map(|value| value.to_string());

            let icon_data = icon.as_deref().and_then(icon_service::load_icon_data);

            let path = e.path.to_string_lossy().to_string();

            let category = e
                .categories()
                .map(|cats| primary_category(cats))
                .unwrap_or("Other")
                .to_string();

            Some(AppInfo {
                name,
                exec: e.exec().map(|value| value.to_string()),
                icon,
                icon_data,
                comment: e.comment(&locales).map(|value| value.to_string()),
                pinned: pinned_list.contains(&path),
                path,
                source: format!("{:?}", PathSource::guess_from(&e.path)),
                category,
            })
        })
        .collect();

    apps.sort_by_cached_key(|a| (!a.pinned, a.name.to_lowercase()));

    apps.dedup_by(|a, b| a.path == b.path);

    apps
}
