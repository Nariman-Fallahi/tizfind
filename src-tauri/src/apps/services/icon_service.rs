use base64::{Engine, engine::general_purpose::STANDARD};

use std::path::Path;

const MAX_ICON_SIZE: usize = 300_000;

fn sniff_mime(bytes: &[u8]) -> Option<&'static str> {
    if bytes.starts_with(&[0x89, b'P', b'N', b'G']) {
        Some("image/png")
    } else if bytes.starts_with(&[0xFF, 0xD8, 0xFF]) {
        Some("image/jpeg")
    } else if bytes.starts_with(b"GIF8") {
        Some("image/gif")
    } else if bytes.len() > 12 && &bytes[0..4] == b"RIFF" && &bytes[8..12] == b"WEBP" {
        Some("image/webp")
    } else {
        let head = String::from_utf8_lossy(&bytes[..bytes.len().min(512)]);

        head.contains("<svg").then_some("image/svg+xml")
    }
}

fn to_data_url(path: &str) -> Option<String> {
    let bytes = std::fs::read(path).ok()?;

    if bytes.len() > MAX_ICON_SIZE {
        return None;
    }

    let mime = sniff_mime(&bytes)?;

    Some(format!("data:{mime};base64,{}", STANDARD.encode(bytes)))
}

fn resolve_path(icon: &str) -> Option<String> {
    if Path::new(icon).is_absolute() {
        return Path::new(icon).exists().then(|| icon.to_string());
    }

    if let Some(path) = freedesktop_icons::lookup(icon).with_size(64).find() {
        return Some(path.to_string_lossy().to_string());
    }

    for theme in ["hicolor", "Papirus", "Adwaita", "breeze"] {
        if let Some(path) = freedesktop_icons::lookup(icon)
            .with_size(64)
            .with_theme(theme)
            .find()
        {
            return Some(path.to_string_lossy().to_string());
        }
    }

    for ext in ["png", "svg"] {
        let path = format!("/usr/share/pixmaps/{icon}.{ext}");

        if Path::new(&path).exists() {
            return Some(path);
        }
    }

    None
}

pub fn load_icon_data(icon: &str) -> Option<String> {
    resolve_path(icon).and_then(|path| to_data_url(&path))
}
