use std::collections::HashSet;
use sysinfo::Disks;

use crate::system_monitor::models::disk::DiskStats;

const REAL_FS: &[&str] = &[
    "ext2", "ext3", "ext4", "btrfs", "xfs", "f2fs", "jfs", "reiserfs", "bcachefs", "zfs", "ntfs",
    "ntfs3", "fuseblk", "vfat", "exfat", "hfsplus",
];

const IGNORED_DEVICES: &[&str] = &["/dev/loop", "/dev/zram", "/dev/ram"];

fn device_key(name: &str, fs: &str) -> String {
    if fs == "zfs" {
        name.split('/').next().unwrap_or(name).to_string()
    } else {
        name.to_string()
    }
}

pub fn collect(disks: &Disks) -> DiskStats {
    let mut seen = HashSet::new();
    let mut total: u64 = 0;
    let mut available: u64 = 0;

    for disk in disks.iter() {
        let fs = disk.file_system().to_string_lossy();
        let name = disk.name().to_string_lossy();

        if !REAL_FS.contains(&fs.as_ref()) {
            continue;
        }

        if IGNORED_DEVICES.iter().any(|p| name.starts_with(p)) {
            continue;
        }

        if disk.mount_point().starts_with("/boot") {
            continue;
        }

        if disk.is_removable() {
            continue;
        }

        if !seen.insert(device_key(&name, &fs)) {
            continue;
        }

        total += disk.total_space();
        available += disk.available_space();
    }

    let used = total.saturating_sub(available);

    let usage = if total > 0 {
        (used as f64 / total as f64 * 100.0) as f32
    } else {
        0.0
    };

    DiskStats {
        used_bytes: used,
        total_bytes: total,
        usage,
    }
}
