use sysinfo::System;

use crate::system_monitor::models::memory::MemoryStats;

pub fn collect(system: &System) -> MemoryStats {
    let total = system.total_memory();
    let used = system.used_memory();

    let usage = if total > 0 {
        (used as f32 / total as f32) * 100.0
    } else {
        0.0
    };

    MemoryStats {
        used_bytes: used,
        total_bytes: total,
        usage,
    }
}
