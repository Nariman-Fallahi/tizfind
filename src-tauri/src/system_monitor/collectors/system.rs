use sysinfo::System;

use crate::system_monitor::models::system::SystemStats;

pub fn collect() -> SystemStats {
    let uptime_seconds = System::uptime().unwrap_or(0);

    SystemStats { uptime_seconds }
}
