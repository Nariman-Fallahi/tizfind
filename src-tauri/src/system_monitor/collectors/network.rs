use std::ffi::OsStr;
use std::fs;
use std::path::Path;

use sysinfo::Networks;

use crate::system_monitor::models::network::NetworkStats;

fn is_physical(name: &OsStr) -> bool {
    let link = Path::new("/sys/class/net").join(name);

    match fs::canonicalize(&link) {
        Ok(real) => !real.starts_with("/sys/devices/virtual"),
        Err(_) => true,
    }
}

pub fn collect(networks: &Networks, elapsed_seconds: f64) -> NetworkStats {
    let mut received: u64 = 0;
    let mut transmitted: u64 = 0;
    let mut total_received: u64 = 0;
    let mut total_transmitted: u64 = 0;

    for (name, network) in networks {
        if !is_physical(name) {
            continue;
        }

        received += network.received();
        transmitted += network.transmitted();
        total_received += network.total_received();
        total_transmitted += network.total_transmitted();
    }

    let (download_speed, upload_speed) = if elapsed_seconds > 0.0 {
        (
            received as f64 / elapsed_seconds,
            transmitted as f64 / elapsed_seconds,
        )
    } else {
        (0.0, 0.0)
    };

    NetworkStats {
        download_speed,
        upload_speed,
        total_download: total_received,
        total_upload: total_transmitted,
    }
}
