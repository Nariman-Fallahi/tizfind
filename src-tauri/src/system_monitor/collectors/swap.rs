use sysinfo::System;

use crate::system_monitor::models::swap::SwapStats;

pub fn page_size() -> u64 {
    let output = std::process::Command::new("getconf")
        .arg("PAGESIZE")
        .output();

    output
        .ok()
        .filter(|output| output.status.success())
        .and_then(|output| String::from_utf8(output.stdout).ok())
        .and_then(|value| value.trim().parse::<u64>().ok())
        .unwrap_or(4096)
}

pub fn read_swap_counters() -> Result<(u64, u64), String> {
    let content = std::fs::read_to_string("/proc/vmstat")
        .map_err(|err| format!("Failed to read /proc/vmstat: {err}"))?;

    let mut swap_in = 0;
    let mut swap_out = 0;

    for line in content.lines() {
        let mut parts = line.split_whitespace();

        match parts.next() {
            Some("pswpin") => {
                swap_in = parts
                    .next()
                    .and_then(|value| value.parse().ok())
                    .unwrap_or(0);
            }
            Some("pswpout") => {
                swap_out = parts
                    .next()
                    .and_then(|value| value.parse().ok())
                    .unwrap_or(0);
            }
            _ => {}
        }
    }

    Ok((swap_in, swap_out))
}

pub fn collect(
    system: &System,
    swap_in: u64,
    swap_out: u64,
) -> SwapStats {
    let total = system.total_swap();
    let used = system.used_swap();

    let usage = if total > 0 {
        (used as f32 / total as f32) * 100.0
    } else {
        0.0
    };

    SwapStats {
        used_bytes: used,
        total_bytes: total,
        usage,
        swap_in,
        swap_out,
    }
}
